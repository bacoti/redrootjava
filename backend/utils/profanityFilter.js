/**
 * Profanity Filter Utility
 * Basic filter for inappropriate words in Indonesian and English
 */

// Kata-kata yang tidak pantas (Indonesian + English)
const profanityList = [
    // Indonesian
    'anjing', 'babi', 'bangsat', 'brengsek', 'goblok', 'tolol', 'bodoh',
    'idiot', 'kampret', 'kontol', 'memek', 'ngentot', 'pepek', 'tai',
    'bego', 'dungu', 'setan', 'iblis', 'laknat', 'sialan', 'bajingan',
    // English
    'fuck', 'shit', 'ass', 'bitch', 'damn', 'bastard', 'crap',
    'dick', 'asshole', 'bullshit', 'stupid', 'idiot', 'moron',
    // Spam indicators
    'http://', 'https://', 'www.', '.com', '.net', '.org',
    'click here', 'buy now', 'free money', 'lottery', 'winner'
];

/**
 * Check if text contains profanity or spam
 * @param {string} text - Text to check
 * @returns {boolean} - True if contains profanity/spam
 */
function containsProfanity(text) {
    if (!text) return false;

    const lowerText = text.toLowerCase();

    for (const word of profanityList) {
        if (lowerText.includes(word.toLowerCase())) {
            return true;
        }
    }

    return false;
}

/**
 * Clean text by removing profanity (optional use)
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text with profanity replaced by asterisks
 */
function cleanText(text) {
    if (!text) return text;

    let cleanedText = text;

    for (const word of profanityList) {
        const regex = new RegExp(word, 'gi');
        cleanedText = cleanedText.replace(regex, '*'.repeat(word.length));
    }

    return cleanedText;
}

module.exports = { containsProfanity, cleanText, profanityList };
