'use strict'

// TODO include in notation.js

const TexDepvar=require('./tex-depvar')

class TexVectorDepvar extends TexDepvar {
	constructor(X,x,subscripts=[]) {
		super()
		this.X=X
		this.x=x // TODO use in this.component
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
	parallelAssignment(template) {
		return `\\[ ${this} = ${template(this)} \\]`
	}
}

module.exports=TexVectorDepvar
