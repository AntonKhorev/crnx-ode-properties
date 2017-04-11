'use strict'

const LinearEquation=require('./linear-equation')

class LinearConstantEquation extends LinearEquation {
	particularSolutionCases() {
		const x=this.x
		const f=this.f
		return nt=>[
			...super.particularSolutionCases()(nt),
			{type:'case',title:`using time invariance when \\( ${f}(t) = ${f}_1(t+t_1) \\)`,content:[
				`find a particular solution \\( ${x._('p',1)} \\) of:`,
				`\\[ ${this.equation(`${f}_1`,false)(nt)} \\]`,
				`particular solution of the original equation is:`,
				x._('p').parallelExpression(xp=>`${xp}(t) &= ${xp._(1)}(t+t_1)`),
			]},
			{type:'case',title:`using exponential response formula when \\( ${f}(t) = e^{r t} \\)`,content:[
				// TODO define P(λ)
				...x.firstComponentExpression(
					x=>`the equation can be written as`,
					x1=>`\\[ P\\left(${nt.ddt}\\right) ${x1} = e^{r t} \\]`
				)(nt),
			]},
		]
	}
}

module.exports=LinearConstantEquation
