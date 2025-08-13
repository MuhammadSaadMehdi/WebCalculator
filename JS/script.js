let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

const currentOperandElement = document.querySelector('.current-operand');
const previousOperandElement = document.querySelector('.previous-operand');

// Basic Calculator Functions
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    if (number === '.' && currentOperand.includes('.')) return;
    currentOperand += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (currentOperand === '' && !['(', ')', '%'].includes(operator)) return;
    
    if (operator === '%') {
        currentOperand = (parseFloat(currentOperand) / 100).toString();
        updateDisplay();
        return;
    }
    
    currentOperand += operator;
    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteLastDigit() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function toggleSign() {
    if (currentOperand.startsWith('-')) {
        currentOperand = currentOperand.substring(1);
    } else {
        currentOperand = '-' + currentOperand;
    }
    updateDisplay();
}

// Scientific Functions
function calculateFunction(func) {
    try {
        if (func === 'π') {
            currentOperand = Math.PI.toString();
        } else if (func === 'e') {
            currentOperand = Math.E.toString();
        } else if (func === '10^') {
            currentOperand = `10^(${currentOperand})`;
        } else if (func === '1/') {
            currentOperand = `1/(${currentOperand})`;
        } else {
            currentOperand = `${func}${currentOperand})`;
        }
        updateDisplay();
    } catch {
        currentOperand = "Error";
        updateDisplay();
    }
}

function factorial() {
    try {
        let num = parseFloat(currentOperand);
        if (num < 0 || !Number.isInteger(num)) {
            currentOperand = "Error";
            updateDisplay();
            return;
        }
        
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        currentOperand = result.toString();
        updateDisplay();
    } catch {
        currentOperand = "Error";
        updateDisplay();
    }
}

// Calculation and Evaluation
function calculate() {
    try {
        // Replace special symbols for evaluation
        let expression = currentOperand
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
        
        // Handle 10^x and 1/x
        expression = expression.replace(/10\^\(([^)]+)\)/g, '10**($1)');
        expression = expression.replace(/1\/\(([^)]+)\)/g, '1/($1)');
        
        // Evaluate the expression
        const result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            currentOperand = "Error";
        } else {
            currentOperand = result.toString();
        }
        updateDisplay();
    } catch {
        currentOperand = "Error";
        updateDisplay();
    }
}

function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    previousOperandElement.textContent = previousOperand;
}

// Keyboard Support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') appendNumber(event.key);
    else if (event.key === '.') appendNumber('.');
    else if (event.key === '%') appendOperator('%');
    else if (event.key === '+') appendOperator('+');
    else if (event.key === '-') appendOperator('-');
    else if (event.key === '*' || event.key === 'x') appendOperator('×');
    else if (event.key === '/') appendOperator('÷');
    else if (event.key === '^') appendOperator('^');
    else if (event.key === '(') appendOperator('(');
    else if (event.key === ')') appendOperator(')');
    else if (event.key === 'Enter' || event.key === '=') calculate();
    else if (event.key === 'Escape') clearAll();
    else if (event.key === 'Backspace') deleteLastDigit();
    else if (event.key === 'p' && event.ctrlKey) calculateFunction('π');
    else if (event.key === 'e' && event.ctrlKey) calculateFunction('e');
});

// Initialize display
updateDisplay();