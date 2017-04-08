'use strict'

const characteristicEquationContent=require('../characteristic-equation-content')

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
		forms: [
			{
				is: 't,x,linear_on_linearHomogeneousConstant',
				equation: nt=>`\\sum_{i=0}^n a_i ${nt.dd(nt.x,'t','i')} = 0`,
				notes: nt=>[
					`\\( a_n \\ne 0 \\)`,
				],
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
					linear_on_linearHomogeneousConstant:   characteristicEquationContent(['i','\\sum_{i=0}^n a_i'],'=','0'),
					resolved_on_linearHomogeneousConstant: characteristicEquationContent(['n',1],'=',['i','\\sum_{i=0}^{n-1} b_i']),
					system_on_linearHomogeneousConstant: nt=>[
						`\\[ λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0 \\]`,
					],
					vector_on_linearHomogeneousConstant: nt=>[
						`\\[ λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0 \\]`,
					],
				}
			},
			generalSolutionMethod: {
				contents: {
					linear_on_linearHomogeneousConstant: nt=>[
						`solve the characteristic equation for \\( λ \\):`,
						`\\[ \\sum_{i=0}^n a_i λ^i = 0 \\]`,
						`\\( λ \\) are:`,
						`\\( r \\) distinct real roots \\( λ_1, ..., λ_r \\) with multiplicities \\( p_1, ..., p_r \\)`,
						`\\( s \\) distinct complex conjugate root pairs \\( α_1 \\pm i β_1, ..., α_s \\pm i β_s \\) with multiplicities \\( q_1, ..., q_s \\)`,
						{type:'note',content:[
							`sum of multiplicities is equal to order of the equation:`,
							`\\[ \\sum_{i=1}^r p_i + 2 \\cdot \\sum_{i=1}^s q_i = n \\]`,
						]},
						`general solution (with arbitrary constants \\( K_{ij} \\), \\( A_{ij} \\), \\( B_{ij} \\)):`,
						`\\[ \\begin{aligned}`+
							`${nt.x} = \\: & \\sum_{i=1}^r \\sum_{j=1}^{p_i} K_{ij} \\, t^{j-1} \\, e^{λ_i t} + \\\\`+
							        `+ \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} A_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\cos β_i t \\\\`+
							        `+ \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} B_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\sin β_i t`+
						`\\end{aligned} \\]`,
					],
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( a_0 \\) is`,content:[
							{type:'case',title:`\\( a_0 = 0 \\)`,content:[
								`\\[ ${nt.x} = K \\]`,
							]},
							{type:'case',title:`\\( a_0 \\ne 0 \\)`,content:[
								`\\[ ${nt.x} = 0 \\]`,
							]},
						]},
					],
					resolved_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( b_0 \\) is`,content:[
							{type:'case',title:`\\( b_0 = 0 \\)`,content:[
								`\\[ ${nt.x} = K \\]`,
							]},
							{type:'case',title:`\\( b_0 \\ne 0 \\)`,content:[
								`\\[ ${nt.x} = 0 \\]`,
							]},
						]},
					],
					system_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( c_1 \\) is`,content:[
							{type:'case',title:`\\( c_1 = 0 \\)`,content:[
								`\\[ \\left\\{ \\begin{array}{rcl}`+
									`${nt.x}_1 &=& K \\\\`+
									`${nt.x}_2 &=& 0 \\\\`+
									`&\\vdots \\\\`+
									`${nt.x}_n &=& 0 \\\\`+
								`\\end{array} \\right. \\]`,
							]},
							{type:'case',title:`\\( c_1 \\ne 0 \\)`,content:[
								`\\[ \\left\\{ \\begin{array}{rcl}`+
									`${nt.x}_1 &=& 0 \\\\`+
									`&\\vdots \\\\`+
									`${nt.x}_n &=& 0 \\\\`+
								`\\end{array} \\right. \\]`,
							]},
						]},
					],
					vector_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( c_1 \\) is`,content:[
							{type:'case',title:`\\( c_1 = 0 \\)`,content:[
								`\\[ ${nt.X} = \\begin{bmatrix} K \\\\ 0 \\\\ \\vdots \\\\ 0 \\end{bmatrix} \\]`,
							]},
							{type:'case',title:`\\( c_1 \\ne 0 \\)`,content:[
								`\\[ ${nt.X} = \\begin{bmatrix} 0 \\\\ \\vdots \\\\ 0 \\end{bmatrix} \\]`,
							]},
						]},
					],
				},
			},
		},
	},
}
