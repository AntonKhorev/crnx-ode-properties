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
				`\\[ ${this.equation(`${f}_1`)(nt)} \\]`,
				`particular solution of the original equation is:`,
				x._('p').parallelExpression(xp=>`${xp}(t) &= ${xp._(1)}(t+t_1)`),
			]},
			{type:'case',title:`using exponential response formula when \\( ${f}(t) = 1 \\), \\( e^{α t} \\), \\( \\cos ω t \\), \\( \\sin ω t \\), \\( e^{α t} \\cos ω t \\) or \\( e^{α t} \\sin ω t \\)`,
				content:this.erfContent()(nt)
			},
		]
	}
	erfContent() {
		const x=this.x
		const f=this.f
		return nt=>[
			`define characteristic polynomial \\( P \\) as`,
			`\\[ P(λ) = ${this.equation.characteristicPolynomial(nt)} \\]`,
			`get \\( r \\in \\mathbb{C} \\) by equating \\( ${f}(t) \\) to \\( e^{r t} \\), \\( \\operatorname{Re}(e^{r t}) \\) or \\( \\operatorname{Im}(e^{r t}) \\)`,
			`\\[ \\begin{array}{cc} `+
				`${f}(t) & r \\\\[1em] `+
				`\\hline `+
				`1 & 0 \\\\`+
				`e^{α t} & α \\\\`+
				`\\cos ω t & i ω \\\\ `+
				`\\sin ω t & i ω \\\\ `+
				`e^{α t} \\cos ω t & α + i ω \\\\ `+
				`e^{α t} \\sin ω t & α + i ω `+
			`\\end{array} \\]`,
			{type:'derivation',content:[
				x.firstComponentExpressionPreamble(
					c=>`${c}the equation can be written as one of`
				),
				x.firstComponentExpression(
					x1=>`\\[ \\begin{aligned} `+
									  `P\\left(${nt.ddt}\\right) ${x1} &= e^{r t} \\\\ `+
						`\\operatorname{Re}\\left( P\\left(${nt.ddt}\\right) ${x1} \\right) &= \\operatorname{Re}(e^{r t}) \\\\ `+
						`\\operatorname{Im}\\left( P\\left(${nt.ddt}\\right) ${x1} \\right) &= \\operatorname{Im}(e^{r t}) `+
					`\\end{aligned} \\]`
				),
				{type:'note',content:[
					`the rest of this derivation uses the first form:`,
					x.firstComponentExpression(
						x1=>`\\[ P\\left(${nt.ddt}\\right) ${x1} = e^{r t} \\]`
					),
				]},
				`evaluate \\( P\\left(${nt.ddt}\\right) e^{r t} \\)`,
				`\\[ P\\left(${nt.ddt}\\right) e^{r t} = P(r) e^{r t} \\]`,
				{type:'switch',title:`\\( P(r) \\) is`,content:[
					{type:'case',title:`\\( P(r) \\ne 0 \\)`,content:[
						`divide by \\( P(r) \\)`,
						`\\[ P\\left(${nt.ddt}\\right) \\frac{e^{r t}}{P(r)} = e^{r t} \\]`,
						`compare with`,
						x.firstComponentExpression(
							x1=>`\\[ P\\left(${nt.ddt}\\right) ${x1} = e^{r t} \\]`
						),
						x.firstComponentExpressionPreamble(
							c=>`to see that ${c}a particular solution is`
						),
						x._('p').firstComponentExpression(
							x1=>`\\[ ${x1} = \\frac{e^{r t}}{P(r)} \\]`
						),
					]},
					{type:'case',title:`\\( P(r) = 0 \\)`,content:[
						`assume that \\( r \\) is a variable and differentiate by it`,
						`\\[ \\frac{\\partial}{\\partial r}\\left(\\! P\\left(\\!${nt.ddt}\\!\\right) e^{r t} \\!\\right) = \\frac{\\partial}{\\partial r}\\left( P(r) e^{r t} \\right) \\]`,
						`\\[ \\begin{multline} `+
							`P\\left(\\!${nt.ddt}\\!\\right) \\frac{\\partial e^{r t}}{\\partial r} = \\\\ `+
							`= \\frac{\\partial P(r)}{\\partial r} e^{r t} + P(r) \\frac{\\partial e^{r t}}{\\partial r} `+
						`\\end{multline} \\]`,
						`\\[ P\\left(\\!${nt.ddt}\\!\\right) t e^{r t} = P'(r) e^{r t} + P(r) t e^{r t} \\]`,
						`treat \\( r \\) as a constant again with \\( P(r) = 0 \\)`,
						`\\[ P\\left(${nt.ddt}\\right) t e^{r t} = P'(r) e^{r t} \\]`,
						{type:'switch',title:`\\( P'(r) \\) is`,content:[
							{type:'case',title:`\\( P'(r) \\ne 0 \\)`,content:[
								`divide by \\( P'(r) \\)`,
								`\\[ P\\left(${nt.ddt}\\right) \\frac{t e^{r t}}{P'(r)} = e^{r t} \\]`,
								`compare with`,
								x.firstComponentExpression(
									x1=>`\\[ P\\left(${nt.ddt}\\right) ${x1} = e^{r t} \\]`
								),
								x.firstComponentExpressionPreamble(
									c=>`to see that ${c}a particular solution is`
								),
								x._('p').firstComponentExpression(
									x1=>`\\[ ${x1} = \\frac{t e^{r t}}{P'(r)} \\]`
								),
							]},
							{type:'case',title:`\\( P'(r) = 0 \\)`,content:[
								`continue differentiating by \\( r \\)`,
							]},
						]},
					]},
				]},
			]},
			`if`,
			`\\[ P(r) {=} P'(r) {=} \\cdots {=} P^{(m-1)}(r) {=} 0 \\]`,
			`and`,
			`\\[ P^{(m)}(r) \\ne 0 \\]`,
			{type:'note',content:[
				`this is equivalent to:`,
				`if \\( r \\) is a root of \\( P \\) with multiplicity \\( m \\)`,
				`where \\( m = 0 \\) means \\( r \\) is not a root of \\( P \\)`,
			]},
			x._('p').firstComponentExpressionPreamble(
				c=>`then ${c}a particular solution is one of`
			),
			x._('p').firstComponentExpression(
				x1=>`\\[ \\begin{array}{cc} `+
					`${f}(t) & ${x1} \\\\[1em] `+
					`\\hline `+
					`1 & \\frac{\\displaystyle t^m}{\\displaystyle P^{(m)}(0)} \\\\`+
					`e^{α t} & \\frac{\\displaystyle t^m \\cdot e^{α t}}{\\displaystyle P^{(m)}(α)} \\\\`+
					`\\cos ω t & \\operatorname{Re}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{i ω t}}{\\displaystyle P^{(m)}(i ω)} \\!\\right) \\\\ `+
					`\\sin ω t & \\operatorname{Im}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{i ω t}}{\\displaystyle P^{(m)}(i ω)} \\!\\right) \\\\ `+
					`e^{α t} \\cos ω t & \\operatorname{Re}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{(α {+} i ω) t}}{\\displaystyle P^{(m)}(α {+} i ω)} \\!\\right) \\\\ `+
					`e^{α t} \\sin ω t & \\operatorname{Im}\\left(\\! \\frac{\\displaystyle t^m \\cdot e^{(α {+} i ω) t}}{\\displaystyle P^{(m)}(α {+} i ω)} \\!\\right) `+
				`\\end{array} \\]`
			),
			...x._('p').restDiffComponentExpressionContent()(nt),
		]
	}
}

module.exports=LinearConstantEquation
