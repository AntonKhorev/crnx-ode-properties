'use strict'

const LinearConstantEquation=require('./linear-constant-equation')

class O2LinearConstantEquation extends LinearConstantEquation {
	erfContent() {
		const x=this.x
		const f=this.f
		return nt=>[
			x._('p').firstComponentExpressionPreamble(
				c=>`${c}a particular solution is one of the following, depending on \\( ${f}(t) \\) and the equation coefficients`
			),
			x._('p').firstComponentExpression(x1=>(
				{type:'switch',title:`\\( ${f}(t) \\) is`,content:[
					{type:'case',title:`\\( ${f}(t) = e^{α t} \\)`,content:[
					]},
				]}
				/*
				x1=>`\\begin{array}{cc} `+
					`${f}(t) & ${x1} \\\\[1em] `+
					`\\hline `+
					`e^{α t} & \\frac{\\displaystyle t^m \\cdot e^{α t}}{\\displaystyle P^{(m)}(α)} \\\\`+
					`\\cos(ω t) & \\operatorname{Re}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{i ω t}}{\\displaystyle P^{(m)}(i ω)} \\!\\right) \\\\ `+
					`\\sin(ω t) & \\operatorname{Im}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{i ω t}}{\\displaystyle P^{(m)}(i ω)} \\!\\right) \\\\ `+
					`e^{α t} \\cos(ω t) & \\operatorname{Re}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{(α {+} i ω) t}}{\\displaystyle P^{(m)}(α {+} i ω)} \\!\\right) \\\\ `+
					`e^{α t} \\sin(ω t) & \\operatorname{Im}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{(α {+} i ω) t}}{\\displaystyle P^{(m)}(α {+} i ω)} \\!\\right) `+
				`\\end{array}`
				*/
			)),
			...x._('p').restDiffComponentExpressionContent()(nt),
		]
	}
}

module.exports=O2LinearConstantEquation
