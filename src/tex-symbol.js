'use strict'

// TODO include in notation.js

class TexSymbol {
	constructor(x,subscripts=[]) {
		this.x=x
		this.subscripts=subscripts
	}
	toString() {
		if (this.subscripts.length>0) {
			return `${this.x}_{${this.subscripts.join()}}` // TODO comma-less joins like ij
		} else {
			return this.x
		}
	}
	_(...ii) {
		return new TexSymbol(this.x,[...this.subscripts,...ii])
	}
	c(i) { // "component" TODO handle vector components w/ lowercasing
		return new TexSymbol(this.x,[i,...this.subscripts])
	}
}

module.exports=TexSymbol
