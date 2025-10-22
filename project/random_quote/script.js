// script.js

const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const tweetBtn = document.getElementById("tweetBtn");
const copyBtn = document.getElementById("copyBtn");

// Optional: fallback quotes if API fails
const localQuotes = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
];

// Fetch quote from API
async function fetchQuote() {
  const apiUrl = "https://api.quotable.io/random";

  try {
    quoteText.textContent = "Fetching new quote...";
    authorText.textContent = "—";

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();

    quoteText.textContent = data.content;
    authorText.textContent = `— ${data.author}`;
  } catch (error) {
    console.error("Error fetching quote:", error);
    // fallback to local quote
    const random = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    quoteText.textContent = random.text;
    authorText.textContent = `— ${random.author}`;
  }
}

// Tweet quote
function tweetQuote() {
  const text = `${quoteText.textContent} ${authorText.textContent}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, "_blank");
}

// Copy quote to clipboard
function copyQuote() {
  const fullQuote = `${quoteText.textContent} ${authorText.textContent}`;
  navigator.clipboard.writeText(fullQuote)
    .then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => copyBtn.textContent = "📋 Copy", 2000);
    })
    .catch(err => console.error("Copy failed:", err));
}

// Event listeners
newQuoteBtn.addEventListener("click", fetchQuote);
tweetBtn.addEventListener("click", tweetQuote);
copyBtn.addEventListener("click", copyQuote);

// Load first quote
document.addEventListener("DOMContentLoaded", fetchQuote);
