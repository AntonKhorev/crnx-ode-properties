'use strict'

// TODO include in notation.js

const tex=require('./tex')
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
		return template(x)
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
	ICLinearSystemSolution([a,b,c,d],[k1,k2]) {
		const det=tex.sum([a,d,'-',b,c],o=>'{'+o+'}')
		const matrixPrefix=(det=='1' ? '' : `\\frac1{${det}} `)
		return nt=>[
			`\\[ ${nt.mat2(a,b,c,d)} ${nt.vec2(k1,k2)} = ${this}(0) \\]`,
			`\\[ ${nt.vec2(k1,k2)} = ${matrixPrefix}${nt.mat2(d,tex.sum(['-',b]),tex.sum(['-',c]),a)} ${this}(0) \\]`,
		]
	}
	generalLinearSolution([k1,k2],[exp1,exp2],mata,matb) {
		const [c11,c12,c21,c22]=this.matMul(mata,matb)
		return (systemLineBreak,vectorLineBreak,expInFront=false)=>nt=>{
			const eq=(vectorLineBreak ? '= \\: &' : '&=')
			const pl=(vectorLineBreak ? '\\\\ + \\: &' : '+')
			const vec=(vectorLineBreak ? nt.svec2 : nt.vec2)
			const mat=(vectorLineBreak ? nt.smat2 : nt.mat2)
			const v1=nt.vec2(c11,c21)
			const v2=nt.vec2(c12,c22)
			const lastLineTerms=[mat(...mata)]
			if (matb!==undefined) lastLineTerms.push(mat(...matb))
			if (exp1==exp2) {
				lastLineTerms.push(vec(k1,k2))
				if (expInFront) {
					lastLineTerms.unshift(exp1)
				} else {
					lastLineTerms.push(exp1)
				}
			} else {
				lastLineTerms.push(vec(tex.sum([k1,exp1]),tex.sum([k2,exp2])))
			}
			return [
				`\\[ \\begin{aligned} `+
					`${this} ${eq} `+tex.sum(expInFront?[k1,exp1,v1]:[k1,v1,exp1])+
					       ` ${pl} `+tex.sum(expInFront?[k2,exp2,v2]:[k2,v2,exp2])+` \\\\`+
					       ` ${eq} `+tex.sum(lastLineTerms)+
				` \\end{aligned} \\]`
			]
		}
	}
}

module.exports=TexVectorDepvar
