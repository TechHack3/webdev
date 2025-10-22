/* slider.js
   Responsive image slider with:
   - auto-play (configurable interval)
   - next / prev controls
   - pagination dots
   - pause on hover / focus
   - keyboard navigation (ArrowLeft / ArrowRight)
   - touch swipe for mobile
*/

(() => {
  const slidesWrap = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  const carousel = document.getElementById('carousel');
  const progressBar = document.getElementById('progress').firstElementChild;
  const autoplayToggle = document.getElementById('autoplayToggle');
  const intervalInput = document.getElementById('intervalInput');
  const goToFirstBtn = document.getElementById('goToFirst');

  let current = 0;
  const total = slides.length;
  let autoPlay = autoplayToggle.checked;
  let interval = Math.max(1000, Number(intervalInput.value) || 3500);
  let timer = null;
  let progressTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let animationID = 0;

  // create dots
  function createDots(){
    dotsWrap.innerHTML = '';
    for(let i=0;i<total;i++){
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label', `Go to slide ${i+1}`);
      d.dataset.index = i;
      d.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(d);
    }
    updateDots();
  }

  function updateDots(){
    const dots = dotsWrap.querySelectorAll('.dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  // set slide position
  function updateSlidePosition(animate = true){
    const offset = -current * 100;
    if(!animate) slidesWrap.style.transition = 'none';
    else slidesWrap.style.transition = 'transform 520ms cubic-bezier(.22,.9,.33,1)';
    slidesWrap.style.transform = `translateX(${offset}%)`;
    // reset transition property after forcing no-transition
    if(!animate){
      requestAnimationFrame(()=> {
        slidesWrap.style.transition = '';
      });
    }
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i === current ? 'false' : 'true'));
    updateDots();
  }

  function prev(){
    goTo(current - 1);
  }
  function next(){
    goTo(current + 1);
  }

  function goTo(index, userTriggered = false){
    current = (index + total) % total;
    updateSlidePosition();
    resetTimer(userTriggered);
  }

  // autoplay timer
  function startTimer(){
    stopTimer();
    if(!autoPlay) return;
    const ms = interval;
    // progress bar animation
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // force reflow
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${ms}ms linear`;
    progressBar.style.width = '100%';

    timer = setTimeout(() => {
      next();
    }, ms);
  }
  function stopTimer(){
    if(timer) clearTimeout(timer);
    timer = null;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
  }
  function resetTimer(userTriggered){
    // if user triggered navigation, restart autoplay (if enabled)
    if(autoPlay) startTimer();
    else stopTimer();
  }

  // keyboard navigation
  function onKey(e){
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  }

  // pause on hover & focus
  carousel.addEventListener('mouseenter', () => {
    stopTimer();
  });
  carousel.addEventListener('mouseleave', () => {
    if(autoPlay) startTimer();
  });
  carousel.addEventListener('focusin', () => stopTimer());
  carousel.addEventListener('focusout', () => { if(autoPlay) startTimer(); });

  // touch support (basic)
  function touchStart(e){
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    currentTranslate = -current * carousel.offsetWidth;
    slidesWrap.style.transition = 'none';
    cancelAnimationFrame(animationID);
  }
  function touchMove(e){
    if(!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - startX;
    // convert px to percentage relative to width
    const percent = (currentTranslate + dx) / carousel.offsetWidth * 100;
    slidesWrap.style.transform = `translateX(${percent}%)`;
  }
  function touchEnd(e){
    if(!isDragging) return;
    isDragging = false;
    const endX = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    const dx = endX - startX;
    const threshold = carousel.offsetWidth * 0.18; // swipe threshold
    slidesWrap.style.transition = '';
    if(dx > threshold) prev();
    else if(dx < -threshold) next();
    else updateSlidePosition();
    resetTimer(true);
  }

  // init
  function init(){
    createDots();
    updateSlidePosition(false);
    // event listeners
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    document.addEventListener('keydown', onKey);

    // touch & mouse drag
    slidesWrap.addEventListener('touchstart', touchStart, {passive:true});
    slidesWrap.addEventListener('touchmove', touchMove, {passive:true});
    slidesWrap.addEventListener('touchend', touchEnd);
    slidesWrap.addEventListener('mousedown', (e) => { e.preventDefault(); touchStart(e); }, {passive:false});
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);

    // autoplay controls
    autoplayToggle.addEventListener('change', (e) => {
      autoPlay = e.target.checked;
      if(autoPlay) startTimer(); else stopTimer();
    });
    intervalInput.addEventListener('change', (e) => {
      interval = Math.max(1000, Number(e.target.value) || 3500);
      if(autoPlay) startTimer();
    });

    goToFirstBtn.addEventListener('click', ()=> goTo(0, true));

    // start autoplay if enabled
    if(autoPlay) startTimer();
  }

  // expose a tiny API if needed (not global)
  init();

})();
