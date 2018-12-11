import _ from 'lodash'

/**
 * Stack datastructure to perform required operations - 
 * push, pop, peek, empty to perform arithmatic/logical operaitons
 * 
 * Adding new operator to be supported
 *  1. Add the symbol/keyword of operation in allowedOps array
 *  2. Add new 'case' in the switch present inside the method for newly added operator applyOp
 *  3. If required, decide the precendence inside the method hasPrecedence
 * 
 */

class Stack {
  constructor() {
    this.top = -1
    this.items = []
  }

  push(item) {
    const idx = this.top
    this.items[idx+1] = item
    this.top = idx + 1
  }

  pop() {
    const popIdx = this.top
    const item  = this.items[popIdx]
    this.top = popIdx - 1
    return item
  }

  peek() {
    return this.items[this.top]
  }

  empty() {
    if(this.top === -1)
      return true
    return false
  }
}



/**
 * ex - 4 * 5 - 2
 * @param op2 peeked from ops
 * @param op1 found in the expression
 * 
 * @returns true if 'op2' has higher or same precedence as 'op1', otherwise returns false
 */
function hasPrecedence(op1, op2) { 
  if (op2 === '(' || op2 === ')') 
    return false
  if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-' || op2 === '==' || op2 === '>' || op2 === '<' || op2 === 'contains')) 
    return false
  else
    return true
}
/**
 * A utility method to apply an operation 'op' on operands
 * @param op operator 
 * @param b operand 
 * @param a operand
 * 
 * @returns result of operation applied
 */
function applyOp(op, b, a) { 
  switch (op) { 
  case '+': 
    return a + b
  case '-': 
    return a - b
  case '*': 
    return a * b
  case '/': 
    //should we handle the case of b == 0 ?
    return a / b
  case '==': 
    return a === b
  case '&&': 
    return a && b
  case '||': 
    return a || b
  case '>': 
    return a > b
  case '<': 
    return a < b
  case 'contains':
    return a.indexOf(b) > -1
  }
  return 0
}

// list of operations allowed by the parser
const allowedOps = ['+', '-', '*', '/', '==', '&&', '||', '>', '<', 'contains']

/**
 * Javascript parser to parse the logical/arithmetic opertaion provided 
 * this is based on javascript implementation of "Shunting Yard Algo"
 * 
 * @param expression an expression to be evaluated
 * @param data data json to fetch the operands value
 * 
 * @returns true, if the expression evaluates to true otherwise false
 * 
 */
export function evaluate(expression, data) {
  const tokens = expression.split(' ')

  // Stack for operands: 'values' 
  const values = new Stack()

  // Stack for Operators: 'ops' 
  const ops = new Stack()

  for (let i = 0; i < tokens.length; i++) { 
    // ignore mistakenly added whitespace in the expression
    if (tokens[i] === ' ') 
      continue

    if (tokens[i] === '(') 
      ops.push(tokens[i])
    // Closing brace encountered, solve expression since the last opening brace 
    else if (tokens[i] === ')') { 
      while (ops.peek() !== '(') 
        values.push(applyOp(ops.pop(), values.pop(), values.pop()))
      ops.pop()//removing opening brace
    }
    // Current token is an operator. 
    else if (allowedOps.indexOf(tokens[i]) > -1) {
      /** 
       * While top of 'ops' has same or greater precedence to current token,
       * Apply operator on top of 'ops' to top two elements in values stack  
       */
      while (!ops.empty() && hasPrecedence(tokens[i], ops.peek())) 
        values.push(applyOp(ops.pop(), values.pop(), values.pop()))

      // Push current token to ops
      ops.push(tokens[i])
    } else {
      //console.log(tokens[i])
      if(tokens[i] in data) {
        //console.log("val : ",data[tokens[i]])
        values.push(_.get(data, tokens[i]))
      } else {
        /*if(tokens[i] == "true")
        values.push(true);
        else if(tokens[i] == "false")
        values.push(false); */
        if(!isNaN(tokens[i]))
          values.push(parseInt(tokens[i]))
        else
          //removing single quotes around the text values
          values.push(tokens[i].replace(/'/g, ''))
      }
    }
  }
  //debugger
  // Parsed expression tokens are pushed to values/ops respectively, 
  // Running while loop to evaluate the expression 
  while (!ops.empty()) 
    values.push(applyOp(ops.pop(), values.pop(), values.pop()))
  // Top contains result, return it 
  return values.pop()
}