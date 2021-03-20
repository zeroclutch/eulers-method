# Euler's Method
This project numerically solves n-th order ODEs using Euler's method. 

```js
const equation = new ODE({
    equations: ["y'''=y''*y'*y+t"],
    initialConditions: ["y'''=0", "y''=0", "y'=0", "y=0"],
    h: 0.1,
    t_o: 0,
    iterations: 21,
    verbose: false,
})

console.log(equation.solve())
/*
Output:
[
  0.20349782566016145, // y(2)
  0.5986169723555632,  // y'(2)
  1.331508807983541,   // y''(2)
  2.116822588920463    // y'''(2)
]
*/
```

### How to use
This program requires a specific set of inputs in order to function properly.

* All y with an order less than or equal to n must have an initial condition specified.
* This evaluates the equations mathematically as pure Javascript. As a result, operators like `a^b` will not work. Use `a ** b` or `Math.pow(a,b)` instead.
* The equation must be written in terms of the highest-order derivative.
* Have fun!
