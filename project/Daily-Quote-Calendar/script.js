const calendar = document.getElementById("calendar");
const quoteBox = document.getElementById("quoteBox");
const quoteText = document.getElementById("quoteText");
const selectedDay = document.getElementById("selectedDay");

// Motivational quotes — 30 in total (one for each date)
const quotes = [
  "Believe you can and you're halfway there.",
  "Push yourself, because no one else is going to do it for you.",
  "Do something today that your future self will thank you for.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Sometimes later becomes never. Do it now.",
  "Great things never come from comfort zones.",
  "Success doesn’t just find you. You have to go out and get it.",
  "Little things make big days.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It always seems impossible until it’s done.",
  "You don’t have to be great to start, but you have to start to be great.",
  "The key to success is to focus on goals, not obstacles.",
  "Your limitation—it’s only your imagination.",
  "Work hard in silence, let success make the noise.",
  "Be stronger than your excuses.",
  "Discipline is the bridge between goals and accomplishment.",
  "Doubt kills more dreams than failure ever will.",
  "Success is not in what you have, but who you are.",
  "You are your only limit.",
  "The best way to predict your future is to create it.",
  "Start where you are. Use what you have. Do what you can.",
  "Don’t wish for it, work for it.",
  "Every day is a new beginning. Take a deep breath and start again.",
  "If it doesn’t challenge you, it won’t change you.",
  "Stay positive, work hard, make it happen.",
  "Consistency is what transforms average into excellence.",
  "You got this. One day or day one—you decide."
];

// Generate calendar for 30 days
for (let i = 1; i <= 30; i++) {
  const day = document.createElement("div");
  day.classList.add("day");
  day.textContent = i;

  day.addEventListener("click", () => {
    selectedDay.textContent = `Day ${i}`;
    quoteText.textContent = quotes[i - 1];
    quoteBox.classList.add("show");
  });

  calendar.appendChild(day);
}
