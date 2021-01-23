/**
 * This runs a simple example of the ODEs.
 */

// n-th dimensional ODE
const ODE = require('./lib/ODE.js')

let equation1 = new ODE({
   equations: ["y'''=y''*y'*y+t"],
   initialConditions: ["y'''=0", "y''=0", "y'=0", "y=0"],
   h: 0.1,
   t_o: 0,
   iterations: 21,
   verbose: true,
})

console.log(equation1.solve())