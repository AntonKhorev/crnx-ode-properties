'use strict'

class Canvas {
	constructor() {
		this.width=246
		this.height=246
		this.$output=$(`<canvas width='${this.width}' height='${this.height}'>`)
		this.ctx=this.$output[0].getContext('2d')
	}
}

module.exports=Canvas
