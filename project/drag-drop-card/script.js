

//script.js

let startY = 0;
let startX = 0;
let newX = 0;
let newY = 0;


console.log( Number("0x2a") )


const card = document.querySelector(".card");
const container = document.querySelector(".container");

let a = localStorage.getItem("a");

card.addEventListener("change", (e) => {
  let value = e.target.value;
  localStorage.setItem("a", value);
});

card.addEventListener("mousedown", mousedown);

function mousedown(e) {
  startX = e.clientX;
  startY = e.clientY;

  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}

function mousemove(e) {
  console.clear();
  newX = e.clientX - startX;
  newY = e.clientY - startY;

  // Calculate new position
  let newLeft = card.offsetLeft + newX;
  let newTop = card.offsetTop + newY;

  // Get parent boundaries
  const parentRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  // console.log(startX, startY);
  // console.log(newX, newY);
  // console.log(newLeft, newTop);
  // console.log(parentRect, cardRect);

  // Restrict movement within parent boundaries
  if (newLeft < 0) newLeft = 0;
  if (newTop < 0) newTop = 0;
  if (newLeft + cardRect.width > parentRect.width)
    newLeft = parentRect.width - cardRect.width;
  if (newTop + cardRect.height > parentRect.height)
    newTop = parentRect.height - cardRect.height;

  // Apply the new position
  card.style.left = newLeft + "px";
  card.style.top = newTop + "px";

  startX = e.clientX;
  startY = e.clientY;
}

function mouseup(e) {
  document.removeEventListener("mousemove", mousemove);
  document.removeEventListener("mouseup", mouseup);
}
window.onload = () => {
  if (a) {
    card.innerText = a.toString();
  }
};


