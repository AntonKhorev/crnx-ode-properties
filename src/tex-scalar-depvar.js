'use strict'

// TODO include in notation.js

const tex=require('./tex')
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
	ICLinearSystemSolution([a,b,c,d],[k1,k2]) {
		const x=`${this}(0)`
		const y=`${this}'(0)`
		const det=tex.sum([a,d,'-',b,c])
		const v1=tex.sum([d,x,'-',b,y])
		const v2=tex.sum([a,y,'-',c,x])
		const solution=(v,det)=>{
			if (det=='1') {
				return v
			} else {
				return `\\frac{${v}}{${det}}`
			}
		}
		return nt=>[
			`\\[ ${nt.mat2(a,b,c,d)} ${nt.vec2(k1,k2)} = ${nt.vec2(x,y)} \\]`,
			`\\begin{aligned} `+
				`${k1} &= ${solution(v1,det)} \\\\ `+
				`${k2} &= ${solution(v2,det)} \\\\ `+
			`\\end{aligned}`,
		]
	}
}

module.exports=TexScalarDepvar
