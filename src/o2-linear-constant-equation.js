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
			x._('p').firstComponentExpression(xp=>(
				{type:'switch',title:`\\( ${f}(t) \\) is`,content:[
					{type:'case',title:`\\( ${f}(t) = 1 \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( a_0 ≠ 0 \\)`,content:[
								`\\[ ${xp} = \\frac1{a_0} \\]`,
							]},
							{type:'case',title:`\\( a_0 = 0 \\) and \\( a_1 ≠ 0 \\)`,content:[
								`\\[ ${xp} = \\frac{t}{a_1} \\]`,
							]},
							{type:'case',title:`\\( a_0 = 0 \\) and \\( a_1 = 0 \\)`,content:[
								`\\[ ${xp} = \\frac{t^2}{2 a_2} \\]`,
							]},
						]},
					]},
					{type:'case',title:`\\( ${f}(t) = e^{α t} \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( a_2 α^2 + a_1 α + a_0 ≠ 0 \\)`,content:[
								`\\[ ${xp} = \\frac{e^{α t}}{a_2 α^2 + a_1 α + a_0} \\]`,
							]},
							{type:'case',title:`\\( a_2 α^2 + a_1 α + a_0 = 0 \\) and \\( 2 a_2 α + a_1 ≠ 0 \\)`,content:[
								`\\[ ${xp} = \\frac{t e^{α t}}{2 a_2 α + a_1} \\]`,
							]},
							{type:'case',title:`\\( a_2 α^2 + a_1 α + a_0 = 0 \\) and \\( 2 a_2 α + a_1 = 0 \\)`,content:[
								`\\[ ${xp} = \\frac{t^2 e^{α t}}{2 a_2} \\]`,
							]},
						]},
					]},
					{type:'case',title:`\\( ${f}(t) = \\cos ω t \\), \\( ω ≠ 0 \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( a_1 ≠ 0 \\) or \\( a_0 ≠ a_2 ω^2 \\)`,content:[
								`\\[ ${xp} {=} \\frac{(a_0 {-} a_2 ω^2) \\cos ω t {+} a_1 ω \\sin ω t}{a_2^2 ω^4 {+} (a_1^2 {-} 2 a_0 a_2) ω^2 {+} a_0^2} \\]`,
							]},
							{type:'case',title:`\\( a_1 = 0 \\) and \\( a_0 = a_2 ω^2 \\)`,content:[
								`\\[ ${xp} = \\frac{t \\sin ω t}{2 a_2 ω} \\]`,
							]},
						]},
					]},
					{type:'case',title:`\\( ${f}(t) = \\sin ω t \\), \\( ω ≠ 0 \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( a_1 ≠ 0 \\) or \\( a_0 ≠ a_2 ω^2 \\)`,content:[
								`\\[ ${xp} {=} \\frac{(a_0 {-} a_2 ω^2) \\sin ω t {-} a_1 ω \\cos ω t}{a_2^2 ω^4 {+} (a_1^2 {-} 2 a_0 a_2) ω^2 {+} a_0^2} \\]`,
							]},
							{type:'case',title:`\\( a_1 = 0 \\) and \\( a_0 = a_2 ω^2 \\)`,content:[
								`\\[ ${xp} = -\\frac{t \\cos ω t}{2 a_2 ω} \\]`,
							]},
						]},
					]},
					{type:'case',title:`\\( ${f}(t) = e^{α t} \\cos ω t \\), \\( ω ≠ 0 \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( 2 a_2 α + a_1 ≠ 0 \\) or \\( a_0 ≠ a_2 (α^2 + ω^2) \\)`,content:[
								`\\[ \\begin{aligned} `+
									`A &= a_2 (α^2 - ω^2) + a_1 α + a_0 \\\\`+
									`B &= (2 a_2 α + a_1) ω \\\\`+
									`${xp} &= e^{α t} \\frac{A \\cos ω t + B \\sin ω t}{A^2 + B^2} `+
								`\\end{aligned} \\]`,
							]},
							{type:'case',title:`\\( 2 a_2 α + a_1 = 0 \\) and \\( a_0 = a_2 (α^2 + ω^2) \\)`,content:[
								`\\[ ${xp} = \\frac{t e^{α t} \\sin ω t}{2 a_2 ω} \\]`,
							]},
						]},
					]},
					{type:'case',title:`\\( ${f}(t) = e^{α t} \\sin ω t \\), \\( ω ≠ 0 \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( 2 a_2 α + a_1 ≠ 0 \\) or \\( a_0 ≠ a_2 (α^2 + ω^2) \\)`,content:[
								`\\[ \\begin{aligned} `+
									`A &= a_2 (α^2 - ω^2) + a_1 α + a_0 \\\\`+
									`B &= (2 a_2 α + a_1) ω \\\\`+
									`${xp} &= e^{α t} \\frac{A \\sin ω t - B \\cos ω t}{A^2 + B^2} `+
								`\\end{aligned} \\]`,
							]},
							{type:'case',title:`\\( 2 a_2 α + a_1 = 0 \\) and \\( a_0 = a_2 (α^2 + ω^2) \\)`,content:[
								`\\[ ${xp} = - \\frac{t e^{α t} \\cos ω t}{2 a_2 ω} \\]`,
							]},
						]},
					]},
				]}
			)),
			...x._('p').restDiffComponentExpressionContent()(nt),
		]
	}
}

module.exports=O2LinearConstantEquation
