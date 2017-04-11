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
	firstComponentExpression(preambleTemplate,firstComponentTemplate) {
		return nt=>[
			`first component of `+preambleTemplate(this),
			firstComponentTemplate(this.component(1)),
		]
	}
	restDiffComponentExpression() {
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
}

module.exports=TexSystemDepvar
