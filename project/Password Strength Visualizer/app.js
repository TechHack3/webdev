// DOM Elements
const passwordInput = document.getElementById('password');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const strengthEmoji = document.getElementById('strengthEmoji');
const strengthTips = document.getElementById('strengthTips');


function calculateStrength(password) {
    let score = 0;
    console.log(password);
    let tips = [];
    if (password.length >= 6) score++; else tips.push('Use at least 6 characters');
    if (password.length >= 10) score++; else tips.push('Use 10+ characters for strong password');
    if (/[A-Z]/.test(password)) score++; else tips.push('Add uppercase letters 🔠');
    if (/[0-9]/.test(password)) score++; else tips.push('Add numbers 🔢');
    if (/[^A-Za-z0-9]/.test(password)) score++; else tips.push('Include symbols ✨');
    if (['123456', 'password', 'qwerty', '111111'].includes(password)) { score = 0; tips = ['Avoid common passwords ⚠️']; }
    return { score, tips };
}


function updateStrength() {
    const pwd = passwordInput.value;
    const { score, tips } = calculateStrength(pwd);
    let width = (score / 5) * 100;
    let color = '#ff4b5c';
    let text = 'Very Weak';
    let emoji = '😐';


    if (score === 1) { color = '#ff4b5c'; text = 'Very Weak'; emoji = '😐'; }
    else if (score === 2) { color = '#ff7f50'; text = 'Weak'; emoji = '😕'; }
    else if (score === 3) { color = '#ffd700'; text = 'Medium'; emoji = '😌'; }
    else if (score === 4) { color = '#9acd32'; text = 'Strong'; emoji = '😃'; }
    else if (score === 5) { color = '#32cd32'; text = 'Very Strong'; emoji = '🤩'; }


    strengthFill.style.width = width + '%';
    strengthFill.style.background = color;
    strengthText.textContent = 'Strength: ' + text;
    strengthEmoji.textContent = emoji;
    strengthEmoji.style.transform = `scale(${1 + score * 0.05}) rotate(${score * 5}deg)`;
    strengthTips.textContent = tips.join(' • ');
}


passwordInput.addEventListener('input', updateStrength);


// Particle effect
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();


function initParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2 + 1 });
    }
}
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x > canvas.width) p.x = 0; if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0; if (p.y < 0) p.y = canvas.height;
    }
    requestAnimationFrame(drawParticles);
}
initParticles(); drawParticles();