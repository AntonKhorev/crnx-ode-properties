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
	firstComponentExpressionPreamble(template) {
		return template(``,this)
	}
	firstComponentExpression(template) {
		return `\\[ ${template(this)} \\]`
	}
	restDiffComponentExpressionContent() {
		return nt=>[]
	}
}

module.exports=TexScalarDepvar
