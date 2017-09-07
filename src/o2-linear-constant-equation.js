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
		const expr=(...args)=>tex.sum(args)
		const sexpr=(...args)=>tex.sum(args,o=>'{'+o+'}')
		const cosCase=(xp,fa,fb,op)=>(
			{type:'case',title:`\\( ${f}(t) = \\${fa} ω t \\), \\( ω ≠ 0 \\)`,content:[
				{type:'switch',title:`coefficients satisfy`,content:[
					{type:'case',title:`\\( `+expr(a1,'≠',0)+` \\) or \\( `+expr(a0,'≠',a2,'ω^2')+` \\)`,content:[
						`\\[ ${xp} {=} \\frac{`+
							sexpr('('+sexpr(a0,'-',a2,'ω^2')+')',`\\${fa} ω t`,op,a1,'ω',`\\${fb} ω t`)+
						`}{`+
							sexpr(a2,'^2','ω^4','+','('+sexpr(a1,'^2','-',2,a0,a2)+')','ω^2','+',a0,'^2')+
						`} \\]`,
					]},
					{type:'case',title:`\\( `+expr(a1,'=',0)+` \\) and \\( `+expr(a0,'=',a2,'ω^2')+` \\)`,content:[
						tex.blockSum([xp,'=',op,`\\frac{t \\${fb} ω t}{`+expr(2,a2,'ω')+`}`]),
					]},
				]},
			]}
		)
		const expCosCase=(xp,fa,fb,op)=>(
			{type:'case',title:`\\( ${f}(t) = e^{α t} \\${fa} ω t \\), \\( ω ≠ 0 \\)`,content:[
				{type:'switch',title:`coefficients satisfy`,content:[
					{type:'case',title:`\\( `+expr(2,a2,'α','+',a1,'≠',0)+` \\) or \\( `+expr(a0,'≠',a2,'(α^2 + ω^2)')+` \\)`,content:[
						`\\[ \\begin{aligned} `+
							`A &= `+expr(a2,'(α^2 - ω^2)','+',a1,'α','+',a0)+` \\\\`+
							`B &= (`+expr(2,a2,'α','+',a1)+`) ω \\\\`+
							`${xp} &= e^{α t} \\frac{A \\${fa} ω t ${op} B \\${fb} ω t}{A^2 + B^2} `+
						`\\end{aligned} \\]`,
					]},
					{type:'case',title:`\\( `+expr(2,a2,'α','+',a1,'=',0)+` \\) and \\( `+expr(a0,'=',a2,'(α^2 + ω^2)')+` \\)`,content:[
						tex.blockSum([xp,'=',op,`\\frac{t e^{α t} \\${fb} ω t}{`+expr(2,a2,'ω')+`}`]),
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
							{type:'case',title:`\\( `+expr(a0,'≠',0)+` \\)`,content:[
								`\\[ ${xp} = `+tex.frac([1],[a0])+` \\]`,
							]},
							{type:'case',title:`\\( `+expr(a0,'=',0)+` \\) and \\( `+expr(a1,'≠',0)+` \\)`,content:[
								`\\[ ${xp} = `+tex.frac(['t'],[a1])+` \\]`,
							]},
							{type:'case',title:`\\( `+expr(a0,'=',0)+` \\) and \\( `+expr(a1,'=',0)+` \\)`,content:[
								`\\[ ${xp} = `+tex.frac(['t^2'],[2,a2])+` \\]`,
							]},
						]},
					]},
					{type:'case',title:`\\( ${f}(t) = e^{α t} \\)`,content:[
						{type:'switch',title:`coefficients satisfy`,content:[
							{type:'case',title:`\\( `+expr(a2,'α^2','+',a1,'α','+',a0,'≠',0)+` \\)`,content:[
								`\\[ ${xp} = \\frac{e^{α t}}{`+expr(a2,'α^2','+',a1,'α','+',a0)+`} \\]`,
							]},
							{type:'case',title:`\\( `+expr(a2,'α^2','+',a1,'α','+',a0,'=',0)+` \\) and \\( `+expr(2,a2,'α','+',a1,'≠',0)+` \\)`,content:[
								`\\[ ${xp} = \\frac{t e^{α t}}{`+expr(2,a2,'α','+',a1)+`} \\]`,
							]},
							{type:'case',title:`\\( `+expr(a2,'α^2','+',a1,'α','+',a0,'=',0)+` \\) and \\( `+expr(2,a2,'α','+',a1,'=',0)+` \\)`,content:[
								`\\[ ${xp} = \\frac{t^2 e^{α t}}{`+expr(2,a2)+`} \\]`,
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
