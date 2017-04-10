'use strict'

// TODO include in notation.js

const TexDepvar=require('./tex-depvar')
const TexScalarDepvar=require('./tex-scalar-depvar')

class TexSystemDepvar extends TexDepvar {
	constructor(x,subscripts=[]) {
		super()
		this.x=x
		this.subscripts=subscripts
	}
	component(i) {
		return new TexScalarDepvar(this.x,[i,...this.subscripts])
	}
	_(...ii) {
		return new TexSystemDepvar(this.x,[...this.subscripts,...ii])
	}
	toString() {
		return `{\\scriptstyle \\left\\{ \\begin{array}{c} `+
			`${this.component(1)} \\\\[-1em] `+
			`\\cdots \\\\[-1em] `+
			`${this.component('n')} `+
		`\\end{array} \\right.}`
	}
	parallelAssignment(template) {
		return `\\[ \\left\\{ \\begin{aligned} `+
			`${this.component(1)} &= ${template(this.component(1))} \\\\ `+
			`\\vdots \\\\ `+
			`${this.component('n')} &= ${template(this.component('n'))} `+
		`\\end{aligned} \\right. \\]`
	}
}

module.exports=TexSystemDepvar
