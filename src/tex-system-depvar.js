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
	parallelExpression(template) {
		return `\\[ \\left\\{ \\begin{aligned} `+
			`${template(this.component(1))} \\\\ `+
			`\\vdots \\\\ `+
			`${template(this.component('n'))} `+
		`\\end{aligned} \\right. \\]`
	}
	firstComponentExpressionPreamble(template) {
		return template(`first component of `,this.component(1))
	}
	firstComponentExpression(template) {
		return `\\[ ${template(this.component(1))} \\]`
	}
	restDiffComponentExpressionContent() {
		return nt=>[
			`find other components by differentiating \\( ${this.component(1)} \\):`,
			`\\[ \\begin{array}{rcl}`+
				`${this.component(2)} &=& ${nt.dd(this.component(1),'t',1)} \\\\`+
				`${this.component(3)} &=& ${nt.dd(this.component(1),'t',2)} \\\\`+
				`&\\vdots \\\\`+
				`${this.component('n')} &=& ${nt.dd(this.component(1),'t','n-1')}`+
			`\\end{array} \\]`,
		]
	}
	// ICLinearSystemSolution([a,b,c,d],[k1,k2]) only for 2d systems
	// generalLinearSolution([k1,k2],[exp1,exp2],[a11,a12,a21,a22],[b11,b12,b21,b22]) only for 2d systems
}

module.exports=TexSystemDepvar
