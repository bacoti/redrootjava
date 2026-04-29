const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    prePurchaseValidation,
    postPurchaseValidation,
    handleValidationErrors
} = require('../middleware/validation');
const feedbackController = require('../controllers/feedbackController');

// ============================================
// MULTER CONFIGURATION FOR FILE UPLOADS
// ============================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'feedback-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only images
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar (JPG, PNG, WebP) yang diizinkan'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/feedback
 * Submit new feedback (pre or post purchase)
 */
router.post('/feedback', upload.single('photo'), (req, res, next) => {
    // Determine which validation to use based on feedback type
    const feedbackType = req.body.feedback_type;

    if (feedbackType === 'pre_purchase') {
        return Promise.all(prePurchaseValidation.map(validation => validation.run(req)))
            .then(() => handleValidationErrors(req, res, next));
    } else if (feedbackType === 'post_purchase') {
        return Promise.all(postPurchaseValidation.map(validation => validation.run(req)))
            .then(() => handleValidationErrors(req, res, next));
    } else {
        return res.status(400).json({
            success: false,
            message: 'Tipe feedback tidak valid. Gunakan "pre_purchase" atau "post_purchase".'
        });
    }
}, feedbackController.submitFeedback);

/**
 * GET /api/testimonials
 * Get approved testimonials for public display (shuffled)
 * Query params: limit (default 6)
 */
router.get('/testimonials', feedbackController.getTestimonials);

/**
 * GET /api/feedback/stats
 * Get feedback statistics (for admin dashboard)
 */
router.get('/feedback/stats', feedbackController.getStats);

/**
 * GET /api/feedback
 * Get all feedbacks with pagination (for admin)
 * Query params: page, limit, type
 */
router.get('/feedback', feedbackController.getAllFeedbacks);

// ============================================
// ERROR HANDLING FOR MULTER
// ============================================
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ukuran file terlalu besar. Maksimal 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Error saat upload file: ' + error.message
        });
    }

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
});

module.exports = router;
