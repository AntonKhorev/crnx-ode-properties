'use strict'

// TODO include in notation.js

const TexDepvar=require('./tex-depvar')
const TexScalarDepvar=require('./tex-scalar-depvar')

class TexVectorDepvar extends TexDepvar {
	constructor(X,x,subscripts=[]) {
		super()
		this.X=X
		this.x=x
		this.subscripts=subscripts
	}
	_(...ii) {
		return new TexVectorDepvar(this.X,this.x,[...this.subscripts,...ii])
	}
	toString() {
		if (this.subscripts.length>0) {
			return `${this.X}_{${this.subscripts.join()}}` // TODO comma-less joins like ij
		} else {
			return this.X
		}
	}
	parallelExpression(template) {
		return `\\[ ${template(this).replace(/&/g,'')} \\]`
	}
	firstComponentExpressionPreamble(template) {
		const x=new TexScalarDepvar(this.x,this.subscripts)
		return template(`first component of `,x)
	}
	firstComponentExpression(template) {
		const x=new TexScalarDepvar(this.x,this.subscripts)
		return `\\[ ${template(x)} \\]`
	}
	restDiffComponentExpressionContent() {
		const x=new TexScalarDepvar(this.x,this.subscripts)
		return nt=>[
			`find other components by differentiating \\( ${x} \\):`,
			`\\[ ${this} = \\begin{bmatrix}`+
				`${x} \\\\`+
				`${nt.dd(x,'t',1)} \\\\`+
				`${nt.dd(x,'t',2)} \\\\`+
				`\\vdots \\\\`+
				`${nt.dd(x,'t','n-1')}`+
			`\\end{bmatrix} \\]`,
		]
	}
}

module.exports=TexVectorDepvar
