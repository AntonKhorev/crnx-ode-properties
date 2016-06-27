'use strict'

class Notation {
	constructor(dependentVariables) {
		this.dependentVariables=dependentVariables // main variable, second variable in 2d system, substitution variable
	}

	// variable names
	get x() { // main dependent variable
		return this.dependentVariables.charAt(0)
	}
	get X() { // vector of dependent variables
		return '\\mathbf{'+this.dependentVariables.charAt(0).toUpperCase()+'}'
	}
	get y() { // second dependent variable for systems of 2 equations
		return this.dependentVariables.charAt(1)
	}
	get w() { // substituted variable
		return this.dependentVariables.charAt(2)
	}

	// tex shortcuts
	dd(a,b,n) {
		if (a===undefined) a=''
		if (b===undefined) b='t'
		if (n===undefined) n=1
		if (n==1) {
			return `\\frac{\\mathrm{d}${a}}{\\mathrm{d}${b}}`
		} else {
			return `\\frac{\\mathrm{d}^{${n}}${a}}{\\mathrm{d}${b}^{${n}}}`
		}
	}
	get ddt() {
		return this.dd()
	}
	get dxdt() {
		return this.dd(this.x)
	}
	sint(f,t) { // short integral = with no spacing before dt
		if (t===undefined) t='t'
		return `\\int\\!${f}\\mathrm{d}${t}`
	}
	int(f,t) {
		return this.sint(f+'\\,',t)
	}
	vec2(a,b) {
		return `\\begin{bmatrix} ${a} \\\\ ${b} \\end{bmatrix}`
	}
	mat2(a,b,c,d) {
		return `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`
	}
}

module.exports=Notation
