// Calculator variables
let x = null;
let y = null;
let lastY = null;
let operator = null;
let trackingX = true;
let trackingY = false;
let operateDone = false;

// Calculator functions
function add(x, y) {
  return parseFloat(x) + parseFloat(y);
}

function subtract(x, y) {
  return parseFloat(x) - parseFloat(y);
}

function multiply(x, y) {
  return parseFloat(x) * parseFloat(y);
}

function divide(x, y) {
  if (y === '0') return 0;
  return parseFloat(x) / parseFloat(y);
}

function addDecimal() {
  if (trackingX) {
    if (x && x.includes('.')) return;
    if (!x || x === '0') {
      x = '0.';
    } else {
      x += '.';
    }
    updateDisplay(x);
  } else {
    if (y && y.includes('.')) return;
    if (!y || y === '0') {
      y = '0.';
    } else {
      y += '.';
    }
    updateDisplay(y);
  }
}

function flipSign() {
  if (trackingX) {
    if (x === null || x === '0') return;
    x *= -1;
    updateDisplay(x.toString());
  } else {
    if (y === null || y === '0') return;
    y *= -1;
    updateDisplay(y.toString());
  }
}

function operate(x, y, operatorCallback) {
  console.log('operatorCallBack: ' + operatorCallback);
  return operatorCallback(x, y);
}

// Map operator symbols to callbacks
const operatorToCalculation = {
  '+': add,
  '-': subtract,
  'x': multiply,
  '/': divide,
};

const operatorToUnaryCallback = {
  '.': addDecimal,
  '+/-': flipSign,
};

// Get common calculator elements from the page
const display = document.querySelector('#display');

// Get all calculator buttons and add onclick callback
const buttons = document.querySelectorAll('.calc-btn');
buttons.forEach((button) => button.addEventListener('click', () => handleCalcBtn(button)));

function handleCalcBtn(button) {
  // For turning '÷' to '/'
  button.dataset.operator ? (btnVal = '/') : (btnVal = button.textContent);

  if (isNumeric(btnVal)) {
    handleNumber(btnVal);
  } else if (isOperator(btnVal)) {
    handleOperator(btnVal);
  } else if (isClear(btnVal)) {
    clearCalculator(btnVal);
  } else {
    console.log('Invalid button: ' + btnVal);
  }
}

function isNumeric(val) {
  // Checks if the value is 0-9
  return /^\d+$/.test(val);
}

function handleNumber(btnVal) {
  console.log('Number pressed!');

  if (trackingX) {
    console.log('Updating x!');
    x = updateOperand(x, btnVal);
    updateDisplay(x);
  } else {
    console.log('Updating y!');
    y = updateOperand(y, btnVal);
    updateDisplay(y);
  }
}

function isOperator(val) {
  // Regex pattern matches:
  // '+', '-', 'x', '/', '+/-', '.'
  return /^[\+\-x\/\.=]$|^\+\/\-$/.test(val);
}

function handleOperator(btnVal) {
  // If x, y, and operator are valid and = is pressed then do calculation
  if (checkOperate() && btnVal === '=' && !(btnVal in operatorToUnaryCallback)) {
    let res = operate(x, y, operatorToCalculation[operator]);
    !Number.isInteger(res) ? (res = res.toFixed(2)) : (res = res.toString());
    x = res;
    updateDisplay(res);
    trackingX = true;
    operateDone = true;
  }
  // If x, y, and operator are valid and +, -, x, or / is pressed then do calculation
  else if (checkOperate() && btnVal !== '=' && !(btnVal in operatorToUnaryCallback)) {
    if (!operateDone) {
      let res = operate(x, y, operatorToCalculation[operator]);
      !Number.isInteger(res) ? (res = res.toFixed(2)) : (res = res.toString());
      x = res;
      updateDisplay(res);
      trackingX = true;
      trackingY = true;
    } else {
      operateDone = false;
      trackingY = true;
    }
    if (trackingY) {
      trackingX = false;
      trackingY = false;
    }
    y = null;
    operator = btnVal;
  }
  // If x and operator are valid and then a number is pressed then do calculation
  // Handle unary operators
  else if (btnVal in operatorToUnaryCallback) operatorToUnaryCallback[btnVal]();
  else {
    trackingX = false;
    operator = btnVal;
  }
}

function isClear(val) {
  // Regex pattern matches:
  // '<-' and 'CE'
  return /^\<\-$|CE|C/.test(val);
}

function clearCalculator(clearVal) {
  switch (clearVal) {
    case '<-':
      if (trackingX) {
        console.log('Clearing x!');
        x = display.value.slice(0, display.value.length - 1);
        if (x.length === 0) x = null;
        updateDisplay(x);
      } else {
        console.log('Clearing y!');
        y = display.value.slice(0, display.value.length - 1);
        if (y.length === 0) y = null;
        updateDisplay(y);
      }
      break;
    case 'C':
      x = null;
      y = null;
      operator = null;
      trackingX = true;
      trackingY = false;
      operateDone = false;
      updateDisplay(null);
    case 'CE':
      if (trackingX) {
        x = null;
        updateDisplay(x);
      } else {
        y = null;
        updateDisplay(y);
      }
      break;
    default:
      console.log('Invalid clear command!');
  }
}

function updateOperand(operand, val) {
  // Operands x and y are uninitialized by default
  // If so set them to val to avoid null value
  // Otherwise append val to the end of operand
  operand === null || operand === '0' ? (operand = val) : (operand += val);
  return operand;
}

function checkOperate() {
  // Check if operands and operator are valid
  return !x || !y || !operator ? false : true;
}

function updateDisplay(val) {
  val ? (display.value = val) : (display.value = 0);
}
