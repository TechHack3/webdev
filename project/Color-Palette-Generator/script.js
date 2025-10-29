const palette = document.getElementById('palette');
const btn = document.getElementById('generate');

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function generatePalette() {
  palette.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const color = randomColor();
    const div = document.createElement('div');
    div.className = 'color';
    div.style.background = color;
    div.innerHTML = `<p>${color}</p>`;
    div.onclick = () => {
      navigator.clipboard.writeText(color);
      alert(`Copied ${color}`);
    };
    palette.appendChild(div);
  }
}
btn.onclick = generatePalette;
generatePalette();
