'use strict'

// TODO include in notation.js

const TexDepvar=require('./tex-depvar')

class TexScalarDepvar extends TexDepvar {
	constructor(x,subscripts=[]) {
		super()
		this.x=x
		this.subscripts=subscripts
	}
	_(...ii) {
		return new TexScalarDepvar(this.x,[...this.subscripts,...ii])
	}
	toString() {
		if (this.subscripts.length>0) {
			return `${this.x}_{${this.subscripts.join()}}` // TODO comma-less joins like ij
		} else {
			return this.x
		}
	}
	parallelExpression(template) {
		return `\\[ ${template(this).replace(/&/g,'')} \\]`
	}
	firstComponentExpression(preambleTemplate,firstComponentTemplate) {
		return nt=>[
			preambleTemplate(``),
			firstComponentTemplate(this),
		]
	}
	restDiffComponentExpression() {
		return nt=>[]
	}
}

module.exports=TexScalarDepvar
