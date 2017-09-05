'use strict'

// TODO include in notation.js

const tex=require('./tex')
const TexDepvar=require('./tex-depvar')
const TexScalarDepvar=require('./tex-scalar-depvar')

class TexSystem2Depvar extends TexDepvar {
	constructor(x,y,subscripts=[]) {
		super()
		this.x=x
		this.y=y
		this.subscripts=subscripts
	}
	componentX() {
		return new TexScalarDepvar(this.x,this.subscripts)
	}
	componentY() {
		return new TexScalarDepvar(this.y,this.subscripts)
	}
	_(...ii) {
		return new TexSystem2Depvar(this.x,this.y,[...this.subscripts,...ii])
	}
	toString() {
		return `{\\scriptstyle \\left\\{ \\begin{array}{c} `+
			`${this.componentX()} \\\\ `+
			`${this.componentY()} `+
		`\\end{array} \\right.}`
	}
	parallelExpression(template) {
		return `\\[ \\left\\{ \\begin{aligned} `+
			`${template(this.componentX())} \\\\ `+
			`${template(this.componentY())} `+
		`\\end{aligned} \\right. \\]`
	}
	firstComponentExpressionPreamble(template) {
		return template(``,this.componentX())
	}
	firstComponentExpression(template) {
		return `\\[ ${template(this.componentX())} \\]`
	}
	restDiffComponentExpressionContent() {
		return nt=>[
			`find ${this.componentY()} by differentiating \\( ${this.componentX()} \\):`,
			`\\[ ${this.componentY()} = ${nt.dd(this.componentX(),'t',1)} \\]`,
		]
	}
	ICLinearSystemSolution([a,b,c,d],[k1,k2]) {
		const x=`${this.componentX()}(0)`
		const y=`${this.componentY()}(0)`
		return nt=>[ // copypaste from tex-scalar-depvar.js
			`\\[ ${nt.mat2(a,b,c,d)} ${nt.vec2(k1,k2)} = ${nt.vec2(x,y)} \\]`,
			`\\begin{aligned} `+
				`${k1} &= ${tex.frac([d,x,'-',b,y],[a,d,'-',b,c])} \\\\ `+
				`${k2} &= ${tex.frac([a,y,'-',c,x],[a,d,'-',b,c])} \\\\ `+
			`\\end{aligned}`,
		]
	}
	generalLinearSolution([k1,k2],[exp1,exp2],mata,matb) {
		return (systemLineBreak,vectorLineBreak)=>(nt)=>[
			`TODO`
		]
	}
}

module.exports=TexSystem2Depvar
