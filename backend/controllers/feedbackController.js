const { pool } = require('../config/database');
const { containsProfanity } = require('../utils/profanityFilter');

/**
 * Calculate approval score for a feedback
 * Higher score = higher priority to display
 */
function calculateApprovalScore(feedback) {
    let score = 0;

    // Base score from rating (20 points per star, max 100)
    if (feedback.rating) {
        score += feedback.rating * 20;
    }

    // Bonus for having a photo (+10)
    if (feedback.photo_url) {
        score += 10;
    }

    // Bonus for longer reviews (+5 per 50 chars, max +20)
    if (feedback.review) {
        const reviewBonus = Math.min(Math.floor(feedback.review.length / 50) * 5, 20);
        score += reviewBonus;
    }

    return score;
}

/**
 * Check if feedback should be auto-approved
 */
function shouldAutoApprove(feedback) {
    // Only post-purchase can be approved for display
    if (feedback.feedback_type !== 'post_purchase') {
        return false;
    }

    // Must have user consent
    if (!feedback.allow_display) {
        return false;
    }

    // Rating must be 4 or higher
    if (!feedback.rating || feedback.rating < 4) {
        return false;
    }

    // Review must be at least 20 characters
    if (!feedback.review || feedback.review.length < 20) {
        return false;
    }

    // Check for profanity in review
    if (containsProfanity(feedback.review)) {
        return false;
    }

    // Check for profanity in name
    if (containsProfanity(feedback.name)) {
        return false;
    }

    return true;
}

/**
 * Submit new feedback
 */
async function submitFeedback(req, res) {
    const connection = await pool.getConnection();

    try {
        const {
            feedback_type,
            name,
            email,
            phone,
            question,
            suggestion,
            source,
            product_variant,
            rating,
            review,
            allow_display
        } = req.body;

        // Handle file upload for photo
        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

        // Calculate approval
        const feedbackData = {
            feedback_type,
            name,
            rating,
            review,
            photo_url,
            allow_display: allow_display === true || allow_display === 'true'
        };

        const isApproved = shouldAutoApprove(feedbackData);
        const approvalScore = calculateApprovalScore(feedbackData);

        // Insert into database
        const [result] = await connection.execute(
            `INSERT INTO feedbacks (
        feedback_type, name, email, phone,
        question, suggestion, source,
        product_variant, rating, review, photo_url, allow_display,
        is_approved, approval_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                feedback_type,
                name,
                email || null,
                phone || null,
                question || null,
                suggestion || null,
                source || null,
                product_variant || null,
                rating || null,
                review || null,
                photo_url,
                feedbackData.allow_display,
                isApproved,
                approvalScore
            ]
        );

        connection.release();

        return res.status(201).json({
            success: true,
            message: feedback_type === 'pre_purchase'
                ? 'Terima kasih atas pertanyaan/saran Anda! Kami akan segera menghubungi Anda.'
                : 'Terima kasih atas feedback Anda! Ulasan Anda sangat berharga bagi kami.',
            data: {
                id: result.insertId,
                feedback_type,
                is_approved: isApproved
            }
        });

    } catch (error) {
        connection.release();
        console.error('Error submitting feedback:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Get approved testimonials for display (shuffled)
 */
async function getTestimonials(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 6;

        // Get top approved testimonials ordered by score minus display penalty
        const [testimonials] = await pool.execute(
            `SELECT 
        id, name, product_variant, rating, review, photo_url, created_at,
        (approval_score - (display_count * 2)) as priority_score
      FROM feedbacks 
      WHERE is_approved = TRUE 
        AND allow_display = TRUE 
        AND feedback_type = 'post_purchase'
      ORDER BY priority_score DESC, created_at DESC
      LIMIT 20`
        );

        if (testimonials.length === 0) {
            return res.json({
                success: true,
                message: 'No testimonials available',
                data: []
            });
        }

        // Shuffle the results
        const shuffled = testimonials.sort(() => Math.random() - 0.5);

        // Take only the requested limit
        const selected = shuffled.slice(0, limit);

        // Update display count for selected testimonials
        const selectedIds = selected.map(t => t.id);
        if (selectedIds.length > 0) {
            await pool.execute(
                `UPDATE feedbacks SET display_count = display_count + 1 WHERE id IN (${selectedIds.join(',')})`
            );
        }

        return res.json({
            success: true,
            data: selected.map(t => ({
                id: t.id,
                name: t.name,
                product_variant: t.product_variant,
                rating: t.rating,
                review: t.review,
                photo_url: t.photo_url,
                created_at: t.created_at
            }))
        });

    } catch (error) {
        console.error('Error fetching testimonials:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil testimonial',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Get feedback statistics (for admin)
 */
async function getStats(req, res) {
    try {
        const [stats] = await pool.execute('SELECT * FROM feedback_stats');

        return res.json({
            success: true,
            data: stats[0] || {
                total_feedbacks: 0,
                pre_purchase_count: 0,
                post_purchase_count: 0,
                approved_count: 0,
                average_rating: 0,
                five_star_count: 0,
                four_star_count: 0,
                low_rating_count: 0
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil statistik',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Get all feedbacks (for admin - with pagination)
 */
async function getAllFeedbacks(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const type = req.query.type; // 'pre_purchase' or 'post_purchase'

        let whereClause = '';
        const params = [];

        if (type) {
            whereClause = 'WHERE feedback_type = ?';
            params.push(type);
        }

        const [feedbacks] = await pool.execute(
            `SELECT * FROM feedbacks ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM feedbacks ${whereClause}`,
            params
        );

        return res.json({
            success: true,
            data: feedbacks,
            pagination: {
                page,
                limit,
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching feedbacks:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    submitFeedback,
    getTestimonials,
    getStats,
    getAllFeedbacks,
    calculateApprovalScore,
    shouldAutoApprove
};
