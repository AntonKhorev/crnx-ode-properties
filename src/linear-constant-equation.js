'use strict'

const LinearEquation=require('./linear-equation')

class LinearConstantEquation extends LinearEquation {
	constructor(x,f,equation,charPoly) {
		super(x,f,equation)
		this.charPoly=charPoly
	}
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
			{type:'case',title:`using exponential response formula when \\( ${f}(t) = e^{α t} \\), \\( \\cos(ω t) \\), \\( \\sin(ω t) \\), \\( e^{α t} \\cos(ω t) \\) or \\( e^{α t} \\sin(ω t) \\)`,content:[
				...x.firstComponentExpression(
					c=>`${c}the equation can be written as one of`,
					x1=>`\\[ \\begin{aligned} `+
						                          `P\\left(${nt.ddt}\\right) ${x1} &= e^{r t} \\\\ `+
						`\\operatorname{Re}\\left( P\\left(${nt.ddt}\\right) ${x1} \\right) &= \\operatorname{Re}(e^{r t}) \\\\ `+
						`\\operatorname{Im}\\left( P\\left(${nt.ddt}\\right) ${x1} \\right) &= \\operatorname{Im}(e^{r t}) `+
					`\\end{aligned} \\]`
				)(nt),
				`with \\( r \\in \\mathbb{C} \\) and characteristic polynomial \\( P \\) defined as`,
				`\\[ P(λ) = ${this.charPoly} \\]`,
				`If`,
				`\\[ P(r) {=} P'(r) {=} \\cdots {=} P^{(m-1)}(r) {=} 0 \\]`,
				`and`,
				`\\[ P^{(m)} \\ne 0 \\]`,
				{type:'note',content:[
					`this is equivalent to:`,
					`if \\( r \\) is a root of \\( P \\) with multiplicity \\( m \\)`,
					`where \\( m = 0 \\) means \\( r \\) is not a root of \\( P \\)`,
				]},
				...x._('p').firstComponentExpression(
					c=>`then ${c}a particular solution is one of`,
					x1=>`\\[ \\begin{array}{cc} `+
						`${f}(t) & ${x1} \\\\[1em] `+
						`\\hline `+
						`e^{α t} & \\frac{\\displaystyle t^m \\cdot e^{α t}}{\\displaystyle P^{(m)}(α)} \\\\`+
						`\\cos(ω t) & \\operatorname{Re}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{i ω t}}{\\displaystyle P^{(m)}(i ω)} \\!\\right) \\\\ `+
						`\\sin(ω t) & \\operatorname{Im}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{i ω t}}{\\displaystyle P^{(m)}(i ω)} \\!\\right) \\\\ `+
						`e^{α t} \\cos(ω t) & \\operatorname{Re}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{(α {+} i ω) t}}{\\displaystyle P^{(m)}(α {+} i ω)} \\!\\right) \\\\ `+
						`e^{α t} \\sin(ω t) & \\operatorname{Im}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{(α {+} i ω) t}}{\\displaystyle P^{(m)}(α {+} i ω)} \\!\\right) `+
					`\\end{array} \\]`
				)(nt),
				...x._('p').restDiffComponentExpression()(nt),
				// TODO derivation
			]},
		]
	}
}

module.exports=LinearConstantEquation
