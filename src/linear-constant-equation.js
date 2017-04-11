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
					c=>`${c}the equation can be written as`,
					x1=>`\\[ P\\left(${nt.ddt}\\right) ${x1} = e^{r t} \\]`
				)(nt),
				`if`,
				`\\[ P(r) {=} P'(r) {=} \\cdots {=} P^{(m-1)}(r) {=} 0 \\]`,
				`and`,
				`\\[ P^{(m)} \\ne 0 \\]`,
				{type:'note',content:[
					`this is equivalent to:`,
					`if \\( r \\) is a root of \\( P \\) with multiplicity \\( m \\)`,
					`where \\( m = 0 \\) means \\( r \\) is not a root of \\( P \\)`,
				]},
				...x._('p').firstComponentExpression(
					c=>`then ${c}a particular solution is`,
					x1=>`\\[ ${x1} = \\frac{t^m}{P^{(m)}(r)} e^{r t} \\]`
				)(nt),
				...x._('p').restDiffComponentExpression()(nt),
			]},
		]
	}
}

module.exports=LinearConstantEquation
