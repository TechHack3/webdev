// === Digital Resume Timeline ===

// Example data (you can replace with your own info)
const timelineData = [
  {
    year: "2018",
    title: "Graduated from University",
    role: "B.Tech in Computer Science",
    description: "Completed my undergraduate studies with a strong foundation in programming, algorithms, and web technologies."
  },
  {
    year: "2019",
    title: "Frontend Developer Intern",
    role: "XYZ Tech Pvt Ltd",
    description: "Built responsive web components and worked with HTML, CSS, and JavaScript frameworks."
  },
  {
    year: "2020",
    title: "Junior Web Developer",
    role: "Creative Studio",
    description: "Collaborated with designers to develop interactive landing pages and improve UX performance."
  },
  {
    year: "2022",
    title: "Full Stack Developer",
    role: "Freelance / Remote",
    description: "Developed small business web applications using MERN stack, deployed on cloud platforms."
  },
  {
    year: "2024",
    title: "Software Engineer",
    role: "Innovate Labs",
    description: "Leading front-end architecture and mentoring new developers in the team."
  }
];

// === Render Timeline ===
const container = document.getElementById("timeline");

timelineData.forEach((item, index) => {
  const div = document.createElement("div");
  div.classList.add("timeline-item");

  div.innerHTML = `
    <span class="timeline-dot"></span>
    <div class="timeline-content">
      <h3>${item.year} — ${item.title}</h3>
      <h4>${item.role}</h4>
      <p>${item.description}</p>
    </div>
  `;

  container.appendChild(div);
});

// === Scroll Animation ===
const items = document.querySelectorAll(".timeline-content");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

items.forEach(item => observer.observe(item));
