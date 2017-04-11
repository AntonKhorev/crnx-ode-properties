'use strict'

class LinearEquation {
	constructor(x,f,equation) {
		this.x=x
		this.f=f
		this.equation=equation
	}
	getContentFor_generalSolutionMethod(homogeneousGeneralSolution) {
		const x=this.x
		const extraSection=(title,content)=>(content!==undefined
			? {type:'extra',title,content}
			: title
		)
		return nt=>[
			extraSection(`find the general solution \\( ${x._('h')} \\) of the associated homogeneous equation`,homogeneousGeneralSolution),
			{type:'switch',title:`find a particular solution \\( ${x._('p')} \\) of the original equation`,
				content:this.particularSolutionCases()(nt)
			},
			`general solution (with arbitrary constants included in \\( ${x._('h')}) \\):`,
			x.parallelExpression(x=>`${x} &= ${x._('h')} + ${x._('p')}`)
		]
	}
	particularSolutionCases() {
		const x=this.x
		const f=this.f
		return nt=>[
			// TODO guess coefficients - needs example
			{type:'case',title:`using superposition when \\( ${f}(t) = k_1 ${f}_1(t) + k_2 ${f}_2(t) + \\cdots \\)`,content:[
				`for each term \\( k_j ${f}_j(t) \\), find a particular solution \\( ${x._('p','j')} \\) of:`,
				`\\[ ${this.equation(`${f}_j`,false)(nt)} \\]`,
				`particular solution of the original equation is a linear combinations of these solutions:`,
				x._('p').parallelExpression(xp=>`${xp} &= k_1 ${xp._(1)} + k_2 ${xp._(2)} + \\cdots`),
			]},
		]
	}
}

module.exports=LinearEquation
