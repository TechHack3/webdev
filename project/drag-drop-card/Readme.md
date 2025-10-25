
# 📝 Draggable Note Card

![HTML](https://img.shields.io/badge/HTML5-orange?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-blue?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A simple, interactive web app that lets you write notes inside a draggable text card — built with **HTML**, **CSS**, and **JavaScript**.  
Your notes are automatically saved in **localStorage**, so they persist even after refreshing the page.

---
## 🚀 Features

- 🖊️ Editable text area that saves your content automatically.  
- 🖱️ Click & drag to move the note anywhere inside the container.  
- 💾 Notes persist even after refresh via `localStorage`.  
- 🎨 Smooth animations on hover and focus.  
- 🔒 Movement restricted to within the window/container.

---

## 📂 Project Structure

```bash
draggable-note-card/
│
├── index.html       # Main structure of the page
├── style.css        # Styling for the card and container
├── script.js        # Dragging and localStorage logic
```
---

## 💡 How It Works

1. A single `<textarea>` element (`.card`) is placed inside a `.container`.
2. When you type, the input value is saved in `localStorage`.
3. You can click and drag the card — movement is bounded within the container.
4. When the page reloads, your saved text is restored automatically.

---

## ⚙️ Setup Instructions

You can run this project locally in seconds.

### Option 1 — Directly open
1. Download or clone the repository.
2. Double-click `index.html` or open it in your browser.
3. Start typing and drag your note around!

### Option 2 — Local dev server (recommended)
If you have Node.js installed:
```bash
npx serve .
````

Then open `http://localhost:3000` in your browser.

---

## 🧠 Concepts Demonstrated

| Concept             | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| 🖱️ Event Handling  | Uses `mousedown`, `mousemove`, and `mouseup` for drag detection |
| 💾 LocalStorage     | Saves and loads the note persistently                           |
| 📐 Bounding Logic   | Keeps card inside parent container                              |
| 🎨 CSS Transitions  | Adds a smooth hover scaling effect                              |
| 🧱 DOM Manipulation | Updates element positions dynamically                           |

---

## 🧰 Tech Stack

* **HTML5**
* **CSS3**
* **Vanilla JavaScript (ES6)**

---

## 🪲 Troubleshooting

**Note not saving?**
➡ Make sure your browser allows `localStorage` (disable incognito/private mode).

**Card moves outside the window?**
➡ Ensure `.container` has `position: relative;` and `.card` has `position: absolute;`.

---

## 🧑‍💻 Author

**Abhishek Valsan**
Full-stack Developer • JavaScript Enthusiast

🌐 [Portfolio Link](https://abhishekvalsan.vercel.app) • 💼 [LinkedIn](https://www.linkedin.com/in/abhishek-valsan-7590a6224)

---

## 📜 License

This project is open-source and available under the **[MIT License](LICENSE)**.

---
