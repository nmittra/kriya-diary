// Add this script for the carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const quotes = [
        "Enlightenment happens quietly, like the blossoming of a flower.",
        "Practice, practice, and practice. One day you will behold the divine goal.",
        "Watch your every breath and be thankful to God.",
        "Kriya Yoga is a beautiful system of meditation"
    ];

    let currentQuote = 0;
    const quoteElement = document.querySelector('.quote');

    setInterval(() => {
        currentQuote = (currentQuote + 1) % quotes.length;
        quoteElement.style.opacity = 0;
        setTimeout(() => {
            quoteElement.textContent = quotes[currentQuote];
            quoteElement.style.opacity = 1;
        }, 500);
    }, 5000);
});
