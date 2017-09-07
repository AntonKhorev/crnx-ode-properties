'use strict'

const tex=require('./tex')
const LinearConstantEquation=require('./linear-constant-equation')

class O2LinearConstantEquation extends LinearConstantEquation {
	erfContent() {
		const a0=this.equation.equationCoefs[0]
		const a1=this.equation.equationCoefs[1]
		const a2=this.equation.equationCoefs[2]
		const x=this.x
		const f=this.f
		const sexpr=(...args)=>tex.sum(args,o=>'{'+o+'}')
		const cosCase=(xp,fa,fb,op)=>(
			{type:'case',title:`\\( ${f}(t) = \\${fa} ω t \\), \\( ω ≠ 0 \\)`,content:[
				{type:'switch',title:`coefficients satisfy`,content:[
					{type:'case',title:`\\( `+tex.sum([a1,'≠',0])+` \\) or \\( `+tex.sum([a0,'≠',a2,'ω^2'])+` \\)`,content:[
						`\\[ ${xp} {=} \\frac{`+
							sexpr('('+sexpr(a0,'-',a2,'ω^2')+')',`\\${fa} ω t`,op,a1,'ω',`\\${fb} ω t`)+
						`}{`+
							sexpr(a2,'^2','ω^4','+','('+sexpr(a1,'^2','-',2,a0,a2)+')','ω^2','+',a0,'^2')+
						`} \\]`,
					]},
					{type:'case',title:`\\( a_1 = 0 \\) and \\( a_0 = a_2 ω^2 \\)`,content:[
						tex.blockSum([xp,'=',op,`\\frac{t \\${fb} ω t}{2 a_2 ω}`]),
					]},
				]},
			]}
		)
		const expCosCase=(xp,fa,fb,op)=>(
			{type:'case',title:`\\( ${f}(t) = e^{α t} \\${fa} ω t \\), \\( ω ≠ 0 \\)`,content:[
				{type:'switch',title:`coefficients satisfy`,content:[
					{type:'case',title:`\\( 2 a_2 α + a_1 ≠ 0 \\) or \\( a_0 ≠ a_2 (α^2 + ω^2) \\)`,content:[
						`\\[ \\begin{aligned} `+
							`A &= a_2 (α^2 - ω^2) + a_1 α + a_0 \\\\`+
							`B &= (2 a_2 α + a_1) ω \\\\`+
							`${xp} &= e^{α t} \\frac{A \\${fa} ω t ${op} B \\${fb} ω t}{A^2 + B^2} `+
						`\\end{aligned} \\]`,
					]},
					{type:'case',title:`\\( 2 a_2 α + a_1 = 0 \\) and \\( a_0 = a_2 (α^2 + ω^2) \\)`,content:[
						tex.blockSum([xp,'=',op,`\\frac{t e^{α t} \\${fb} ω t}{2 a_2 ω}`]),
					]},
				]},
			]}
		)
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
					cosCase(xp,'cos','sin','+'),
					cosCase(xp,'sin','cos','-'),
					expCosCase(xp,'cos','sin','+'),
					expCosCase(xp,'sin','cos','-'),
				]}
			)),
			...x._('p').restDiffComponentExpressionContent()(nt),
		]
	}
}

module.exports=O2LinearConstantEquation
