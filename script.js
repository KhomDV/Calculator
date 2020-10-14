class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.readyToReset = false;
      this.charSquare = String.fromCodePoint(0x221A);
      this.squarePrevious = false;
      this.statusError = false;
      this.clear();
    }
  
    clear() {
      this.currentOperand = '';
      this.previousOperand = '';
      this.operation = undefined;
      this.readyToReset = false;
      this.statusError = false;
    }
  
    clearLast() {
      if (this.statusError) return;
      if (this.currentOperand !== '') {
        this.currentOperand = '';
      } else {
        if (this.operation != null) {
          this.operation = undefined;
          this.currentOperand = this.previousOperand;
        }
      }
    }
  
    delete() {
      if (this.statusError) return;
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  
    appendNumber(number) {
      if (this.statusError) return;
      if (number === '.' && this.currentOperand.includes('.')) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  
    chooseOperation(operation) {
      if (this.statusError) return;
      if (this.currentOperand === '') return;
      if (this.currentOperand !== '' &&
         (this.previousOperand !== '' || (this.previousOperand === '' && this.operation === this.charSquare))) {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '';
    }
  
    compute(operation='') {
      if (this.statusError) return;
      let computation = undefined;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
  
      if ((isNaN(prev) || isNaN(current)) && this.operation !== this.charSquare) {
        if (operation !== '') {
          this.readyToReset = true;
        }
        return;
      }  
  
      switch (this.operation) {
        case '+':
          computation = prev + current;
          computation = this.getResultCompute(computation, prev, current, this.operation);
          break
        case '-':
          computation = prev - current;
          computation = this.getResultCompute(computation, prev, current, this.operation);
          break
        case '*':
          computation = prev * current;
          computation = this.getResultCompute(computation, prev, current, this.operation);
          break
        case '÷':
          computation = this.division(prev, current);
          break
        case '^':
          computation = Math.pow(prev, current);
          computation = this.getResultCompute(computation, prev, current, this.operation);
          break
        case this.charSquare:
          let numberSquare = current;
          if (this.squarePrevious) {
            numberSquare = prev;
          }
          computation = Math.sqrt(numberSquare);
          break
        default:
          return;
      }
      this.readyToReset = true;
      if (isNaN(computation)) {
        this.statusError = true;
      }
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = '';
    }
  
    squareButton() {
      if (this.statusError) return;
      this.operation = this.charSquare;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '';    
    }
  
    changeSign() {
      if (this.statusError) return;
      if (this.currentOperand === '') return;
      if (this.currentOperand !== '') {
        const current = parseFloat(this.currentOperand);
        this.currentOperand = current * (-1);
      }
    }
  
  
    division(number1, number2) {
      let exponentRound;
  
      const decimalLength1 = this.getDecimalNumber(number1);
      const decimalLength2 = this.getDecimalNumber(number2);
  
      exponentRound = decimalLength1;
      if (decimalLength1 < decimalLength2) {
        exponentRound = decimalLength2;
      }
      const factor = Math.pow(10, exponentRound);
  
      return (number1 * factor) / (number2 * factor);
    }
  
  
    getResultCompute(computation, number1, number2, operation) {
      let exponentRound;
      let factor;
  
      const decimalLength1 = this.getDecimalNumber(number1);
      const decimalLength2 = this.getDecimalNumber(number2);
  
      switch (operation) {
        case '+':
          exponentRound = decimalLength1;
          if (decimalLength1 < decimalLength2) {
            exponentRound = decimalLength2;
          }
          factor = Math.pow(10, exponentRound);
  
          computation = Math.round(computation * factor) / factor;
  
          break;
  
        case '-':
          exponentRound = decimalLength1;
          if (decimalLength1 < decimalLength2) {
            exponentRound = decimalLength2;
          }
          factor = Math.pow(10, exponentRound);
  
          computation = Math.round(computation * factor) / factor;
  
          break;
  
        case '*':
          exponentRound = decimalLength1 + decimalLength2;
          factor = Math.pow(10, exponentRound);
  
          computation = Math.round(computation * factor) / factor;
  
          break;
  
        case '^':
          exponentRound = decimalLength1 * number2;
          factor = Math.pow(10, exponentRound);
  
          computation = Math.round(computation * factor) / factor;
  
          break;
      }
      return computation;
    }
  
    getDecimalNumber(number) {
      let lengthFractional = 0;
      if (number.toString().includes('.')) {
        lengthFractional = number.toString().split('.')[1].length;
      }
      return lengthFractional;
    }
  
  
    getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      if (this.statusError) {
        this.currentOperandTextElement.innerText = '=ERROR';
        this.operation = undefined;
      } else {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
      }
      
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
  
  }
  
  
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const allClearButton = document.querySelector('[data-all-clear]');
  const exponentButton = document.querySelector('[data-exponent]');
  const squareButton = document.querySelector('[data-square]');
  const clearButton = document.querySelector('[data-clear]');
  const deleteButton = document.querySelector('[data-delete]');
  const changeButton = document.querySelector('[data-change]');
  const equalsButton = document.querySelector('[data-equals]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]');
  const currentOperandTextElement = document.querySelector('[data-current-operand]');
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  numberButtons.forEach(button => {
    button.addEventListener("click", () => {
      if(calculator.previousOperand === "" &&
          calculator.currentOperand !== "" &&
          calculator.readyToReset) {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay();
    })
  })
  
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText);
      calculator.updateDisplay();
    })
  })
  
  equalsButton.addEventListener('click', button => {
    calculator.compute('=');
    calculator.updateDisplay();
  })
  
  allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
  })
  
  clearButton.addEventListener('click', button => {
    calculator.clearLast();
    calculator.updateDisplay();
  })
  
  deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
  })
  
  exponentButton.addEventListener('click', button => {
    calculator.chooseOperation('^');
    calculator.updateDisplay();
  })
  
  squareButton.addEventListener('click', button => {
    if (calculator.operation != null) return;
    calculator.squareButton();
    calculator.updateDisplay();
    if(calculator.previousOperand !== "") {
      calculator.squarePrevious = true;
      calculator.compute();
    }
    calculator.squarePrevious = false;
    calculator.updateDisplay();
  })
  
  changeButton.addEventListener('click', button => {
    calculator.changeSign();
    calculator.updateDisplay();
  })
  
