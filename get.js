/**
 * @param {string} code The code to evaluate
 * @returns {*} The result of the evaluation
 */
function evaluateCode(code) {
    return eval(code); // Alert: Avoid using eval() function
  }
  
  // Example usage triggering the alert
  evaluateCode("2 + 2");
  