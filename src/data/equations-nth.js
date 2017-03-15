'use strict'

module.exports={
	on: {
		parents: {
			sn: true,
		},
		name: "nth-order",
		htmlName: "<em>n</em>th-order",
		importance: 2,
		forms: [
			{
				is: ['t','x','resolved_on'],
				equation: nt=>`${nt.dd(nt.x,'t','n')} = f(t,${nt.x},${nt.dxdt},\\dotsc,${nt.dd(nt.x,'t','n-1')})`,
			},
			// TODO as systen of n 1st order
		],
		traits: {
			testSolutionMethod: {
				formType: 'x',
				content: nt=>[
					`Can test if \\( ${nt.x}_p \\) is a solution by substituting \\( ${nt.x} = ${nt.x}_p \\) into the equation.`,
				],
			},
		}
	},
/*
	on_linearHomogeneousConstant: {
		parents: {
			on: true,
		},
		name: "nth-order linear homogeneous with constant coefficients",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		//equation: `y^{(n)} = - \\tfrac{a_{n-1}}{a_n} y^{(n-1)} - \\cdots - \\tfrac{a_1}{a_n} y' - \\tfrac{a_0}{a_n} y`,
		equation: `${nt.dd(nt.x,'t','n')} = - \\sum_{i=0}^{n-1} \\frac{a_i}{a_n} ${nt.dd(nt.x,'t','i')}`,
		equationNotes: [
			`usually written as \\( \\sum_{i=0}^n a_i ${nt.dd(nt.x,'t','i')} = 0 \\)`,
		],
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ \\sum_{i=0}^n a_i ${nt.dd(nt.x,'t','i')} = 0 \\]`,
						`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
						`\\[ \\sum_{i=0}^n a_i ${nt.dd('','t','i')} e^{\\lambda t} = 0 \\]`,
						`\\[ \\sum_{i=0}^n a_i \\lambda^i e^{\\lambda t} = 0 \\]`,
						`divide by \\( e^{\\lambda t} \\)`,
					]},
					`\\[ \\sum_{i=0}^n a_i \\lambda^i = 0 \\]`,
				],
			},
		},
	},
*/
}
