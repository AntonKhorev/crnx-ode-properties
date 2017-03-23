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
				is: 't,x,resolved_on',
				equation: nt=>`${nt.dd(nt.x,'t','n')} = f(t,${nt.x},${nt.dxdt},\\dotsc,${nt.dd(nt.x,'t','n-1')})`,
			},
			{
				is: 't,xi,system_on',
				equation: nt=>`\\left\\{ \\begin{array}{rcl}`+
					`${nt.dd(`${nt.x}_1`)} &=& ${nt.x}_2 \\\\`+
					`${nt.dd(`${nt.x}_2`)} &=& ${nt.x}_3 \\\\`+
					`&\\vdots \\\\`+
					`${nt.dd(`${nt.x}_{n-1}`)} &=& ${nt.x}_n \\\\`+
					`${nt.dd(`${nt.x}_n`)} &=& f_n(t,${nt.x}_1,\\dotsc,${nt.x}_n)`+
				`\\end{array} \\right.`,
			},
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
	on_linearHomogeneousConstant: {
		parents: {
			on: true,
		},
		name: "nth-order linear homogeneous with constant coefficients",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		//equation: `y^{(n)} = - \\tfrac{a_{n-1}}{a_n} y^{(n-1)} - \\cdots - \\tfrac{a_1}{a_n} y' - \\tfrac{a_0}{a_n} y`,
		forms: [
			{
				is: 't,x,linear_on_linearHomogeneousConstant',
				equation: nt=>`\\sum_{i=0}^n a_i ${nt.dd(nt.x,'t','i')} = 0`,
			},
			{
				is: 't,x,resolved_on_linearHomogeneousConstant',
				equation: nt=>`${nt.dd(nt.x,'t','n')} = \\sum_{i=0}^{n-1} b_i ${nt.dd(nt.x,'t','i')}`,
			},
			{
				is: 't,xi,system_on_linearHomogeneousConstant',
				equation: nt=>`\\left\\{ \\begin{array}{rcl}`+
					`${nt.dd(`${nt.x}_1`)} &=& ${nt.x}_2 \\\\`+
					`${nt.dd(`${nt.x}_2`)} &=& ${nt.x}_3 \\\\`+
					`&\\vdots \\\\`+
					`${nt.dd(`${nt.x}_{n-1}`)} &=& ${nt.x}_n \\\\`+
					`${nt.dd(`${nt.x}_n`)} &=& \\sum_{i=1}^{n} c_i ${nt.x}_i`+
				`\\end{array} \\right.`,
			},
			{
				is: 't,X,vector_on_linearHomogeneousConstant',
				equation: nt=>`${nt.dd(nt.X)} {=} \\begin{bmatrix}`+
					`0 & 1 & 0 & \\cdots & 0 \\\\`+
					`0 & 0 & 1 & \\cdots & 0 \\\\`+
					`\\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\`+
					`0 & 0 & 0 & \\cdots & 1 \\\\`+
					`c_1 & c_2 & c_3 & \\cdots & c_n`+
				`\\end{bmatrix} ${nt.X}`,
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_on_linearHomogeneousConstant: nt=>[
						{type:'derivation',content:[
							`\\[ \\sum_{i=0}^n a_i ${nt.dd(nt.x,'t','i')} = 0 \\]`,
							`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
							`\\[ \\sum_{i=0}^n a_i ${nt.dd('','t','i')} e^{\\lambda t} = 0 \\]`,
							`\\[ \\sum_{i=0}^n a_i \\lambda^i e^{\\lambda t} = 0 \\]`,
							`divide by \\( e^{\\lambda t} \\)`,
						]},
						`\\[ \\sum_{i=0}^n a_i \\lambda^i = 0 \\]`,
					],
					resolved_on_linearHomogeneousConstant: nt=>[
						{type:'derivation',content:[
							`\\[ ${nt.dd(nt.x,'t','n')} = \\sum_{i=0}^{n-1} b_i ${nt.dd(nt.x,'t','i')} \\]`,
							`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
							`\\[ ${nt.dd('','t','n')} e^{\\lambda t} = \\sum_{i=0}^{n-1} b_i ${nt.dd('','t','i')} e^{\\lambda t} \\]`,
							`\\[ \\lambda^n e^{\\lambda t} = \\sum_{i=0}^{n-1} b_i \\lambda^i e^{\\lambda t} \\]`,
							`divide by \\( e^{\\lambda t} \\)`,
							`\\[ \\lambda^n = \\sum_{i=0}^{n-1} b_i \\lambda^i \\]`,
						]},
						`\\[ \\lambda^n - \\sum_{i=0}^{n-1} b_i \\lambda^i = 0 \\]`,
					],
					system_on_linearHomogeneousConstant: nt=>[
						`\\[ \\lambda^n - \\sum_{i=0}^{n-1} c_{i+1} \\lambda^i = 0 \\]`,
					],
					vector_on_linearHomogeneousConstant: nt=>[
						`\\[ \\lambda^n - \\sum_{i=0}^{n-1} c_{i+1} \\lambda^i = 0 \\]`,
					],
				}
			},
		},
	},
}
