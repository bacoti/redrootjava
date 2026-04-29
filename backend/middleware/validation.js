const { body, validationResult } = require('express-validator');

/**
 * Validation rules for Pre-Purchase feedback
 */
const prePurchaseValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama harus diisi')
        .isLength({ min: 2, max: 100 }).withMessage('Nama harus 2-100 karakter'),

    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('Format email tidak valid'),

    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^[0-9+\-\s()]{8,20}$/).withMessage('Format nomor telepon tidak valid'),

    body('question')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 1000 }).withMessage('Pertanyaan maksimal 1000 karakter'),

    body('suggestion')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 1000 }).withMessage('Saran maksimal 1000 karakter'),

    body('source')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage('Sumber maksimal 100 karakter'),

    // Custom validation: email or phone must be provided
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.phone) {
            throw new Error('Email atau nomor telepon harus diisi salah satu');
        }
        return true;
    })
];

/**
 * Validation rules for Post-Purchase feedback
 */
const postPurchaseValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama harus diisi')
        .isLength({ min: 2, max: 100 }).withMessage('Nama harus 2-100 karakter'),

    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('Format email tidak valid'),

    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^[0-9+\-\s()]{8,20}$/).withMessage('Format nomor telepon tidak valid'),

    body('product_variant')
        .notEmpty().withMessage('Varian produk harus dipilih')
        .isIn(['original', 'coconut', 'mango']).withMessage('Varian produk tidak valid'),

    body('rating')
        .notEmpty().withMessage('Rating harus diisi')
        .isInt({ min: 1, max: 5 }).withMessage('Rating harus 1-5'),

    body('review')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 2000 }).withMessage('Review maksimal 2000 karakter'),

    body('allow_display')
        .optional()
        .isBoolean().withMessage('allow_display harus boolean'),

    // Custom validation: email or phone must be provided
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.phone) {
            throw new Error('Email atau nomor telepon harus diisi salah satu');
        }
        return true;
    })
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

/**
 * Get validation rules based on feedback type
 */
const getFeedbackValidation = (req, res, next) => {
    const feedbackType = req.body.feedback_type;

    if (feedbackType === 'pre_purchase') {
        return [...prePurchaseValidation];
    } else if (feedbackType === 'post_purchase') {
        return [...postPurchaseValidation];
    }

    return [];
};

module.exports = {
    prePurchaseValidation,
    postPurchaseValidation,
    handleValidationErrors,
    getFeedbackValidation
};
