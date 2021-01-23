/**
 * This program numerically solves a system of N first-order differential equations or a single higher-order ODE.
 * It uses Euler's method.
 */
const ODE = class ODE {
    /**
     * Constructs a new ODE in the form y(t)
     * @param {Object}          options                   The options for this ODE
     * @param {number}          options.h                 The h value, lower is more accurate
     * @param {number}          options.t_o               The initial t value
     * @param {string}          [options.verbose]         Whether to log all the outputs
     * @param {string[]}        options.equations         An array of equations
     * @param {number}          options.iterations        The number of iterations to perform. The final t value t_f is equal to t_o + h * iterations.
     * @param {string[]}        options.initialConditions An array of initial conditions
     * @example
     * const equation = new ODE({
     *     equations: ["y'''=y''*y'*y+t"],
     *     initialConditions: ["y'''=0", "y''=0", "y'=0", "y=0"],
     *     h: 0.1,
     *     t_o: 0,
     *     iterations: 20,
     * })
     * @warning Never allow clients to enter unsanitized inputs as an equation.
     * @constructor 
     */
    constructor(options) {
        this.h                 = options.h
        this.t_o               = options.t_o
        this.type              = options.equations.length === 1 ? 'HIGHER_ORDER' : 'SYSTEM'
        this.verbose           = options.verbose || false
        this.functions         = []
        this.equations         = options.equations
        this.iterations        = options.iterations
        this.initialConditions = options.initialConditions
    }

    /**
     * Parses an ODE and returns its order and its representation as a function
     * @param {string} equation The equation to parse
     * @private
     */
    _parseODE(equation) {
        // Test if equation begins with y'''=
        this.log(equation)
        let degree = equation.match(/y\s?('{0,})\s?=/g)
        if(!degree) {
            throw new Error('Invalid ODE format. Write the ODE in terms of a derivative of y.')
        }

        equation = equation
        // 
        .replace(/y/g, `y'`)
        // Remove y[n]=
        .replace(/y\s?('{1,})\s?=/g, ``)
        // Replace primes with array references
        .replace(/'{1,}/g, (match) => match = `[${match.length - 1}]`)

        return {equation, degree: degree[0].length - 2}
    }

    /**
     * Solves an ODE or system of ODEs
     * @returns {Array} An array of the results, indexed by their order.
     */
    solve() {
        // Set initial conditions
        let y_n = this.initialConditions
        .map(ode     => this._parseODE(ode))
        .sort((a, b) => a.degree - b.degree)
        .map(ode     => eval(ode.equation))
        
        // Assign constants
        const h          = this.h
        const f_y        = []
        const t_o        = this.t_o
        const iterations = this.iterations

        /**
         * By the property: The vector of y is equal to a matrix of derivatives such that the y1' = y2, y2' = y3, etc.
         */
        for(let i = 1; i < y_n.length; i++) {
            f_y.push((t, ...y) => y[i])
        }
        
        for(let i = 0; i < this.equations.length; i++) {
            const parsed = this._parseODE(this.equations[i])
            f_y[parsed.degree] = eval(`(t, ...y) => ${parsed.equation}`)
        }
        
        // Rounds to nearest nth digit
        const $ = (num, n = 3) => Math.round(num * Math.pow(10, n)) / Math.pow(10, n)
    
        let t = t_o
        let y_n_new = []
        for(let i = 0; i < iterations; i++) {
            y_n_new = []
            for(let j = 0; j < f_y.length; j++) {
                let new_y
                try {
                    // Euler's method
                    new_y = y_n[j] + (h * (f_y[j](t, ...y_n)))
                    if(Number.isNaN(new_y)) {
                        throw new Error('Equation resulted in NaN values, write in terms of the highest order derivative')
                    }
                } catch(err) {
                    this.handle(err)
                }

                y_n_new.push(new_y)
                if(this.verbose) {
                    if (this.type === 'HIGHER_ORDER') this.log(`[Iteration ${i + 1} | t=${$(t,4)}] y${`'`.repeat(j)}${` `.repeat(y_n.length - j)} = y(n-1)${`'`.repeat(j)}${` `.repeat(y_n.length - j)}+ ${h} * ${$(f_y[j](t, ...y_n))} = ${$(new_y)}`)
                    else if (this.type === 'SYSTEM') this.log(`[t=${$(t,4)}] y_(${j + 1},${i + 1}) = y_(${j + 1},${i}) + ${h} * ${$(f_y[j](t, ...y_n))} = ${$(new_y)}`)
                }
            }
            y_n = y_n_new
            t += h
        }
        return y_n
    }

    handle(err) {
        if(err.message === 'f_y[j] is not a function') {
            throw new Error('Incorrect equations entered, make sure all initial conditions are defined')
        } else {
            throw err
        }
    }
    
    log(...args) {
        if(this.verbose) console.log(...args)
    }

}

module.exports = ODE