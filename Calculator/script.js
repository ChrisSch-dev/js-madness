// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const darkClass = 'dark';

function setTheme(dark) {
  document.body.classList.toggle(darkClass, dark);
  themeToggle.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Persist theme in localStorage
function getThemePref() {
  if(localStorage.getItem('calc-theme')) return localStorage.getItem('calc-theme') === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
setTheme(getThemePref());
themeToggle.onclick = () => {
  const dark = !document.body.classList.contains(darkClass);
  setTheme(dark);
  localStorage.setItem('calc-theme', dark ? 'dark' : 'light');
};

// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let input = '';
let resultShown = false;

function updateDisplay() {
  display.value = input || '0';
}

function appendValue(val) {
  if (resultShown && /[0-9.]/.test(val)) {
    input = '';
    resultShown = false;
  }
  if (val === '.' && input.match(/(\.\d*)?$/g)?.[0]?.includes('.')) return;
  input += val;
  updateDisplay();
}

function clearDisplay() {
  input = '';
  updateDisplay();
}

function calculate() {
  try {
    // Replace unicode operators with JS equivalents for eval
    let exp = input.replace(/÷/g, '/').replace(/×/g, '*');
    let result = eval(exp);
    input = String(result);
    updateDisplay();
    resultShown = true;
  } catch {
    input = '';
    display.value = 'Error';
    resultShown = true;
  }
}

buttons.forEach(btn => {
  if (btn.id === 'clear') {
    btn.onclick = clearDisplay;
  } else if (btn.id === 'equals') {
    btn.onclick = calculate;
  } else {
    btn.onclick = () => appendValue(btn.dataset.value);
  }
});

updateDisplay();