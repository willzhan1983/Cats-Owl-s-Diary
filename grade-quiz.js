/* Grade selector and grade-aware quiz picking. */
(function setupGradeAwareQuizzes(){
  if(typeof quizBank==='undefined')return;
  const STORAGE_KEY='catsOwlGrade';
  const DEFAULT_GRADE=3;
  const gradeButtons=document.querySelectorAll('[data-grade]');
  function clampGrade(value){const n=Number(value);return Number.isFinite(n)?Math.max(1,Math.min(6,Math.round(n))):DEFAULT_GRADE;}
  let selectedGrade=clampGrade(localStorage.getItem(STORAGE_KEY)||DEFAULT_GRADE);
  function matchesGrade(q){
    if(!q.grade&&!q.minGrade&&!q.maxGrade)return selectedGrade<=3&&!['hard','expert'].includes(q.difficulty);
    const min=clampGrade(q.minGrade||q.grade||1);
    const max=clampGrade(q.maxGrade||q.grade||6);
    return min<=selectedGrade&&selectedGrade<=max;
  }
  function sync(){gradeButtons.forEach(btn=>{const on=clampGrade(btn.dataset.grade)===selectedGrade;btn.classList.toggle('is-selected',on);btn.setAttribute('aria-pressed',on?'true':'false');});}
  function pick(list){const exact=list.filter(q=>Number(q.grade)===selectedGrade);const matched=list.filter(matchesGrade);const candidates=exact.length?exact:matched.length?matched:list;return candidates[Math.floor(Math.random()*candidates.length)]||quizBank.math[0];}
  randomQuiz=function randomGradeQuiz(key){return pick(quizBank[key]||[]);};
  function rerollCurrentQuizLevel(){if(typeof state==='undefined'||!state||state.running)return;const hasQuiz=state.tasksList?.some(task=>task.kind==='quiz');if(!hasQuiz||typeof resetGame!=='function')return;resetGame(state.levelIndex,state.levelIndex>0);if(typeof messageEl!=='undefined')messageEl.textContent=`已切换为小学${selectedGrade}年级题库，点击开始继续挑战。`;}
  function setGrade(grade,reroll=true){selectedGrade=clampGrade(grade);localStorage.setItem(STORAGE_KEY,String(selectedGrade));sync();if(reroll)rerollCurrentQuizLevel();}
  gradeButtons.forEach(btn=>btn.addEventListener('click',()=>setGrade(btn.dataset.grade)));
  window.catsOwlQuizGrade={get:()=>selectedGrade,set:grade=>setGrade(grade)};
  sync();
  rerollCurrentQuizLevel();
})();
