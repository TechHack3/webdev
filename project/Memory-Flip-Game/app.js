// Memory Flip Game — Vanilla JS
(function(){
  const boardEl = document.getElementById('board');
  const movesEl = document.getElementById('moves');
  const timerEl = document.getElementById('timer');
  const matchesEl = document.getElementById('matches');
  const totalEl = document.getElementById('total');
  const restartBtn = document.getElementById('restart');
  const overlay = document.getElementById('overlay');
  const modalText = document.getElementById('modal-text');
  const playAgain = document.getElementById('play-again');
  const closeModal = document.getElementById('close-modal');

  const EMOJIS = ['🐶','🐱','🦊','🐼','🦁','🐸','🦄','🐵','🐤','🐙','🐝','🦋','🍎','🍉','🍩','🌟'];

  let cards = [];
  let firstCard = null, secondCard = null;
  let lockBoard = false, moves = 0, matches = 0;
  let totalPairs = 8;
  let timer = null, seconds = 0, started = false;

  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  function startTimer(){
    if(timer) return;
    timer = setInterval(()=> {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    },1000);
  }
  function stopTimer(){ clearInterval(timer); timer=null; }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function buildCards(pairCount){
    const chosen = shuffle([...EMOJIS]).slice(0, pairCount);
    return shuffle([...chosen, ...chosen]).map((emoji, i)=>({id:i, emoji, matched:false}));
  }

  function renderBoard(){
    boardEl.innerHTML = '';
    cards.forEach(card=>{
      const div = document.createElement('div');
      div.className = 'card';
      div.dataset.id = card.id;
      div.dataset.emoji = card.emoji;
      div.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front"></div>
          <div class="card-face card-back">${card.emoji}</div>
        </div>
      `;
      div.addEventListener('click', onCardClick);
      boardEl.appendChild(div);
    });
  }

  function onCardClick(e){
    const node = e.currentTarget;
    if(lockBoard || node.classList.contains('flipped')) return;

    if(!started){ started = true; startTimer(); }
    node.classList.add('flipped');

    if(!firstCard){ firstCard = node; return; }

    secondCard = node;
    moves++; movesEl.textContent = moves;

    const match = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if(match){
      firstCard.classList.add('locked');
      secondCard.classList.add('locked');
      firstCard.removeEventListener('click', onCardClick);
      secondCard.removeEventListener('click', onCardClick);
      matches++; matchesEl.textContent = matches;
      resetSelection();
      if(matches === totalPairs) finishGame();
    } else {
      lockBoard = true;
      setTimeout(()=>{
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetSelection(); lockBoard=false;
      },700);
    }
  }

  const resetSelection = ()=>{ firstCard=null; secondCard=null; };

  function finishGame(){
    stopTimer();
    overlay.classList.remove('hidden');
    modalText.textContent = `You finished in ${moves} moves and ${formatTime(seconds)}.`;
  }

  function setDifficulty(nPairs){
    totalPairs = nPairs;
    totalEl.textContent = totalPairs;
    cards = buildCards(totalPairs);
    renderBoard();
  }

  function resetGame(){
    stopTimer(); seconds=0; timerEl.textContent='00:00';
    moves=0; movesEl.textContent='0';
    matches=0; matchesEl.textContent='0';
    started=false; lockBoard=false; resetSelection();
    const selected = document.querySelector('input[name=size]:checked');
    const n = Number(selected?.value || 8);
    setDifficulty(n);
  }

  restartBtn.addEventListener('click', ()=>{ resetGame(); overlay.classList.add('hidden'); });
  playAgain.addEventListener('click', ()=>{ resetGame(); overlay.classList.add('hidden'); });
  closeModal.addEventListener('click', ()=>{ overlay.classList.add('hidden'); });
  document.querySelectorAll('input[name=size]').forEach(r=>r.addEventListener('change', resetGame));

  resetGame();
})();
