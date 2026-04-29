-- ============================================
-- RED ROOT JAVA - FEEDBACK DATABASE SCHEMA
-- ============================================

-- Step 1: Create database
CREATE DATABASE IF NOT EXISTS redrootjava_feedback;

-- Step 2: Use database
USE redrootjava_feedback;

-- Step 3: Drop existing table if exists
DROP TABLE IF EXISTS feedbacks;

-- Step 4: Create feedbacks table
CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    question TEXT,
    suggestion TEXT,
    source VARCHAR(100),
    product_variant VARCHAR(20),
    rating INT,
    review TEXT,
    photo_url VARCHAR(255),
    allow_display INT DEFAULT 0,
    is_approved INT DEFAULT 0,
    approval_score INT DEFAULT 0,
    display_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 5: Add indexes
ALTER TABLE feedbacks ADD INDEX idx_approved (is_approved);

ALTER TABLE feedbacks ADD INDEX idx_feedback_type (feedback_type);

-- Step 6: Insert sample data
INSERT INTO
    feedbacks (
        feedback_type,
        name,
        email,
        product_variant,
        rating,
        review,
        allow_display,
        is_approved,
        approval_score
    )
VALUES (
        'post_purchase',
        'Budi Santoso',
        'budi@email.com',
        'original',
        5,
        'Produk luar biasa! Rasa jahemu khas dan sangat membantu menghangatkan badan. Sangat recommended!',
        1,
        1,
        100
    );

INSERT INTO
    feedbacks (
        feedback_type,
        name,
        email,
        product_variant,
        rating,
        review,
        allow_display,
        is_approved,
        approval_score
    )
VALUES (
        'post_purchase',
        'Rina Wati',
        'rina@email.com',
        'coconut',
        5,
        'Varian kelapa pandan ini favorit saya! Rasanya unik dan menyegarkan. Sudah beli berkali-kali.',
        1,
        1,
        95
    );

INSERT INTO
    feedbacks (
        feedback_type,
        name,
        email,
        product_variant,
        rating,
        review,
        allow_display,
        is_approved,
        approval_score
    )
VALUES (
        'post_purchase',
        'Agus Prasetyo',
        'agus@email.com',
        'mango',
        4,
        'Rasa mangga nya enak, cocok diminum dingin. Kualitas bubuk jahmeya sangat halus.',
        1,
        1,
        80
    );