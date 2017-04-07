'use strict'

const characteristicEquationContent=require('../characteristic-equation-content')

const eqsol=(name)=>`<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>${name}</a>`

const o1_linear_generalSolutionMethod_content=isLinear=>{
	const mvp1=isLinear?'+':'='
	const mvp2=isLinear?'=':'+'
	const mvp3=isLinear?'-':'+'
	const mvpa=isLinear?'g':'a'
	const mvpyh=nt=>(isLinear?`e^{-${nt.sint('g(t)')}}`:`e^{${nt.sint('a(t)')}}`)
	return nt=>[
		{type:'case',title:"method of <a href='https://en.wikipedia.org/wiki/Integrating_factor'>integrating factors</a>",content:[
			{type:'derivation',content:[
				...(isLinear?[]:[
					`\\[ ${nt.dxdt} = a(t) \\cdot ${nt.x} + b(t) \\]`,
					`introduce a new function`,
					`\\[ g(t) = -a(t) \\]`,
					`rewrite the equation with \\( g(t) \\)`,
				]),
				`\\[ ${nt.dxdt} + g(t) \\cdot ${nt.x} = b(t) \\]`,
				`introduce the integrating factor`,
				`\\[ \\mu(t) = e^{${nt.sint('g(t)')}} \\]`,
				`multiply the equation by \\( \\mu(t) \\)`,
				`\\[ \\mu(t) ${nt.dxdt} + \\mu(t) g(t) ${nt.x} = \\mu(t) b(t) \\]`,
				`\\[ \\mu(t) ${nt.dxdt} + e^{${nt.sint('g(t)')}} g(t) ${nt.x} = \\mu(t) b(t) \\]`,
				`\\[ \\mu(t) ${nt.dxdt} + ${nt.ddt}(e^{${nt.sint('g(t)')}}) ${nt.x} = \\mu(t) b(t) \\]`,
				`\\[ \\mu(t) ${nt.dxdt} + ${nt.ddt}(\\mu(t)) ${nt.x} = \\mu(t) b(t) \\]`,
				`\\[ ${nt.ddt}(\\mu(t) ${nt.x}) = \\mu(t) b(t) \\]`,
				`integrate the equation multiplied by \\( \\mu(t) \\)`,
				`\\[ \\mu(t) ${nt.x} = ${nt.int('\\mu(t) b(t)')} + C \\]`,
			]},
			(isLinear
				?`\\[ \\mu(t) = e^{${nt.sint('g(t)')}} \\]`
				:`\\[ \\mu(t) = e^{-${nt.sint('a(t)')}} \\]`
			),
			`\\[ \\mu(t) ${nt.x} = ${nt.int('\\mu(t) b(t)')} + C \\]`,
		]},
		{type:'case',title:"method of <a href='https://en.wikipedia.org/wiki/Variation_of_parameters'>variation of parameters</a>",content:[
			{type:'note',content:[
				`mathematically equivalent to the method of integrating factors`,
			]},
			`find the general solution \\( K ${nt.x}_h \\) of the associated homogeneous equation`,
			`\\[ ${nt.x}_h = ${mvpyh(nt)} \\]`,
			{type:'derivation',title:`find \\( ${nt.x} \\) as \\( ${nt.x}_h \\) multiplied by an unknown function`,content:[
				`\\[ ${nt.x} = u(t) ${nt.x}_h \\]`,
				`substitute \\( ${nt.x} \\) into the original equation`,
				`\\[ ${nt.ddt}(u(t) ${nt.x}_h) ${mvp1} ${mvpa}(t) u(t) ${nt.x}_h ${mvp2} b(t) \\]`,
				`\\[ \\begin{multline}`+
					`${nt.dd('u(t)')} ${nt.x}_h + u(t) ${nt.dd(`${nt.x}_h`)} ${mvp1} \\\\ `+
					`${mvp1} ${mvpa}(t) u(t) ${nt.x}_h ${mvp2} b(t) `+
				`\\end{multline} \\]`,
				`\\[ \\begin{multline}`+
					`${nt.dd('u(t)')} ${nt.x}_h + u(t) ${nt.ddt}(${mvpyh(nt)}) ${mvp1} \\\\ `+
					`${mvp1} ${mvpa}(t) u(t) ${nt.x}_h ${mvp2} b(t) `+
				`\\end{multline} \\]`,
				`\\[ \\begin{multline}`+
					`${nt.dd('u(t)')} ${nt.x}_h ${mvp3} u(t) ${mvpa}(t) ${mvpyh(nt)} ${mvp1} \\\\ `+
					`${mvp1} ${mvpa}(t) u(t) ${nt.x}_h ${mvp2} b(t) `+
				`\\end{multline} \\]`,
				`\\[ \\begin{multline}`+
					`${nt.dd('u(t)')} ${nt.x}_h ${mvp3} u(t) ${mvpa}(t) ${nt.x}_h ${mvp1} \\\\ `+
					`${mvp1} ${mvpa}(t) u(t) ${nt.x}_h ${mvp2} b(t) `+
				`\\end{multline} \\]`,
				`\\[ ${nt.dd('u(t)')} ${nt.x}_h = b(t) \\]`,
				`\\[ ${nt.dd('u(t)')} = \\frac{b(t)}{${nt.x}_h} \\]`,
				`\\[ u(t) = ${nt.int(`\\frac{b(t)}{${nt.x}_h}`)} + C \\]`,
				`substitute \\( u(t) \\) into the expression for \\( ${nt.x} \\)`,
			]},
			`\\[ ${nt.x} = ${nt.x}_h \\left( ${nt.int(`\\frac{b(t)}{${nt.x}_h}`)} + C \\right) \\]`,
		]},
		{type:'case',title:"<a href='https://en.wikipedia.org/wiki/Method_of_undetermined_coefficients'>method of undetermined coefficients</a>",content:[
			`find the general solution \\( K ${nt.x}_h \\) of the associated homogeneous equation`,
			`\\[ ${nt.x}_h = ${mvpyh(nt)} \\]`,
			{type:'derivation',title:`find a particular solution \\( ${nt.x}_p \\) of the original equation`,content:[
				`guess the solution form with coefficients to be solved for`,
				`solve for coefficients`,
				{type:'example',content:[
					...(isLinear?[]:[
						`\\[ ${nt.dxdt} = -2 ${nt.x} + 3 e^{-t/2} \\]`,
						`move all terms with \\( ${nt.x} \\) to one side`,
					]),
					`\\[ ${nt.dxdt} + 2 ${nt.x} = 3 e^{-t/2} \\]`,
					`compare the terms and guess the particular solution form`,
					`\\[ ${nt.x}_p = \\alpha e^{-t/2} \\]`,
					`substitute \\( ${nt.x}_p \\) into the equation`,
					`\\[ - \\frac{\\alpha}{2} e^{-t/2} + 2 \\alpha e^{-t/2} = 3 e^{-t/2} \\]`,
					`divide by \\( e^{-t/2} \\)`,
					`\\[ - \\frac{\\alpha}{2} + 2 \\alpha = 3 \\]`,
					`solve for \\( \\alpha \\)`,
					`\\[ \\alpha = 2 \\]`,
					`substitute \\( \\alpha \\) into \\( ${nt.x}_p \\)`,
					`\\[ ${nt.x}_p = 2 e^{-t/2} \\]`,
				]},
			]},
			`\\[ ${nt.x} = K ${nt.x}_h + ${nt.x}_p \\]`,
		]},
	]
}

const o1_linearHomogeneous_generalSolutionMethod_content=isLinear=>{
	const s=isLinear?'-':''
	const a=isLinear?'g':'a'
	return nt=>[
		{type:'derivation',content:[
			`\\[ ${nt.dxdt} = ${s}${a}(t) \\cdot ${nt.x} \\]`,
			`\\[ \\frac{1}{${nt.x}} \\cdot ${nt.dxdt} = ${s}${a}(t) \\]`,
			`\\[ ${nt.int(`\\frac{1}{${nt.x}} ${nt.dxdt}`)} = ${s}${nt.int(`${a}(t)`)} + C \\]`,
			`\\[ ${nt.int(`\\frac{1}{${nt.x}}`,nt.x)} = ${s}${nt.int(`${a}(t)`)} + C \\]`,
			`\\[ \\ln|${nt.x}| = ${s}${nt.int(`${a}(t)`)} + C \\]`,
		]},
		`\\[ ${nt.x} = K \\cdot e^{${s}${nt.sint(`${a}(t)`)}} \\]`,
		{type:'note',content:[
			`includes ${eqsol("equilibrium solution")} when \\( K = 0 \\)`,
		]},
	]
}

const o1_linearHomogeneous_equilibriumSolutionMethod_content=xMultiplier=>nt=>[
	{type:'switch',title:`\\( ${xMultiplier} \\) is`,content:[
		{type:'case',title:`\\( ${xMultiplier} = 0 \\)`,content:[
			`\\[ ${nt.x} = K \\]`,
		]},
		{type:'case',title:`\\( ${xMultiplier} \\ne 0 \\)`,content:[
			`\\[ ${nt.x} = 0 \\]`,
		]},
	]},
]

const o1_linearHomogeneousConstant_generalSolutionMethod_content=(xMulSign,xMulValue)=>nt=>[
	{type:'derivation',content:[
		`\\[ ${nt.dxdt} = ${xMulSign}${xMulValue} \\cdot ${nt.x} \\]`,
		`\\[ \\frac{1}{${nt.x}} \\cdot ${nt.dxdt} = ${xMulSign}${xMulValue} \\]`,
		`\\[ ${nt.int(`\\frac{1}{${nt.x}} ${nt.dxdt}`)} = ${xMulSign}${nt.int(xMulValue)} + C \\]`,
		`\\[ ${nt.int(`\\frac{1}{${nt.x}}`,nt.x)} = ${xMulSign}${nt.int(xMulValue)} + C \\]`,
		`\\[ \\ln|${nt.x}| = ${xMulSign}${xMulValue} t + C \\]`,
		`\\[ ${nt.x}(t) = C_1 e^{${xMulSign}${xMulValue} t} \\]`,
		`\\[ ${nt.x}(0) = C_1 e^0 \\]`,
		`\\[ C_1 = ${nt.x}(0) \\]`,
	]},
	`\\[ ${nt.x}(t) = ${nt.x}(0) \\cdot e^{${xMulSign}${xMulValue} t} \\]`,
	{type:'note',content:[
		`includes ${eqsol("equilibrium solution")} when \\( ${nt.x}(0) = 0 \\)`,
	]},
]

module.exports={
	o1: {
		parents: {
			on: true,
		},
		name: "first-order",
		importance: 0,
		forms: [
			{
				is: 't,x,resolved_o1',
				equation: nt=>`${nt.dxdt} = f(t,${nt.x})`,
			},
		],
	},
	o1_separable: {
		parents: {
			o1: true,
		},
		name: "first-order separable",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Separation_of_variables#Ordinary_differential_equations_.28ODE.29'>separable</a>",
		importance: 1,
		forms: [
			{
				is: 't,x,resolved_o1_separable',
				equation: nt=>`${nt.dxdt} = f_1(t) \\cdot f_2(${nt.x})`,
			},
		],
		traits: {
			generalSolutionMethod: {
				content: nt=>[
					{type:'derivation',content:[
						`\\[ ${nt.dxdt} = f_1(t) \\cdot f_2(${nt.x}) \\]`,
						`\\[ \\frac{1}{f_2(${nt.x})} \\cdot ${nt.dxdt} = f_1(t) \\]`,
						`\\[ ${nt.int(`\\frac{1}{f_2(${nt.x})} ${nt.dxdt}`)} = ${nt.int('f_1(t)')} + C \\]`,
					]},
					`\\[ ${nt.int(`\\frac{1}{f_2(${nt.x})}`,nt.x)} = ${nt.int('f_1(t)')} + C \\]`,
					{type:'note',content:[
						`this may or may not include ${eqsol("equilibrium solutions")}`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				content: nt=>[
					`solve \\( f_2(${nt.x}) = 0 \\) for constant \\( ${nt.x} \\)`,
				],
				//`domain is not necessary \\( -\\infty &lt; t &lt; +\\infty \\)`
			},
		},
	},
	o1_autonomous: {
		parents: {
			o1_separable: true,
		},
		name: "first-order autonomous",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Autonomous_system_%28mathematics%29'>autonomous</a>",
		importance: 1,
		forms: [
			{
				is: 't,x,resolved_o1_autonomous',
				equation: nt=>`${nt.dxdt} = f(${nt.x})`,
			},
		],
		traits: {
			isoclineProperty: {
				formType: 't',
				content: nt=>[
					`isoclines are horizontal`,
				],
			},
			shiftSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_p(t) \\) is a solution, then \\( ${nt.x}_p(t+C) \\) is a solution`,
				],
			},
			generalSolutionMethod: {
				content: nt=>[
					{type:'derivation',content:[
						`\\[ ${nt.dxdt} = f(${nt.x}) \\]`,
						`\\[ \\frac{1}{f(${nt.x})} \\cdot ${nt.dxdt} = 1 \\]`,
						`\\[ ${nt.int(`\\frac{1}{f(${nt.x})} ${nt.dxdt}`)} = ${nt.int(1)} + C \\]`,
					]},
					`\\[ ${nt.int(`\\frac{1}{f(${nt.x})}`,nt.x)} = t + C \\]`,
					{type:'note',content:[
						`this may or may not include ${eqsol("equilibrium solutions")}`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				content: nt=>[
					`solve \\( f(${nt.x}) = 0 \\) for constant \\( ${nt.x} \\)`,
				],
				//`domain is \\( -\\infty &lt; t &lt; +\\infty \\)` // only if f(y) is continuous
			},
		},
	},
	o1_bernoulli: {
		parents: {
			o1: true,
		},
		name: "Bernoulli",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Bernoulli_differential_equation'>Bernoulli</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,resolved_o1_bernoulli',
				equation: nt=>`${nt.dxdt} = a(t) \\cdot ${nt.x} + b(t) \\cdot ${nt.x}^n`,
				notes: nt=>[
					`\\( n \\neq 1 \\)`,
					`usually it's also defined that additionally \\( n \\neq 0 \\), but we ignore this requirement here`,
				],
			},
		],
		traits: {
			generalSolutionMethod: {
				content: nt=>[
					{type:'derivation',content:[
						`\\[ ${nt.dxdt} = a(t) \\cdot ${nt.x} + b(t) \\cdot ${nt.x}^n \\]`,
						`multiply the equation by \\( \\frac{1-n}{${nt.x}^n} \\)`,
						`\\[ \\begin{multline} `+
							`\\frac{1-n}{${nt.x}^n} ${nt.dxdt} = \\\\ `+
							`= \\frac{(1-n) a(t)}{${nt.x}^{n-1}} + (1-n) b(t) `+
						`\\end{multline} \\]`,
						`introduce a new variable`,
						`\\[ ${nt.w} = \\frac{1}{${nt.x}^{n-1}} \\]`,
						`\\[ ${nt.dd(nt.w)} = ${nt.dd(nt.w,nt.x)} ${nt.dxdt} = \\frac{1-n}{${nt.x}^n} ${nt.dxdt} \\]`,
						`substitute \\( ${nt.w} \\) and \\( ${nt.dd(nt.w)} \\) into the equation`,
						`\\[ ${nt.dd(nt.w)} = (1-n) a(t) ${nt.w} + (1-n) b(t) \\]`,
						`solve this equation as a linear equation in \\( ${nt.w} \\), then return to the original variable \\( ${nt.x} \\)`,
						`\\[ \\mu(t) ${nt.w} = (1-n) ${nt.int('\\mu(t) b(t)')} + C \\]`,
					]},
					`\\[ \\mu(t) = e^{(n-1)${nt.sint('a(t)')}} \\]`,
					`\\[ \\frac{\\mu(t)}{${nt.x}^{n-1}} = (1-n) ${nt.int('\\mu(t) b(t)')} + C \\]`,
					{type:'note',content:[
						`this may or may not include ${eqsol("equilibrium solutions")}`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				content: nt=>[
					`if \\( n>0 \\), there's an equilibrium solution \\( ${nt.x} = 0 \\)`,
				],
			},
		},
	},
	o1_linear: {
		parents: {
			o1_bernoulli: true,
		},
		name: "first-order linear",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a>",
		importance: 1,
		forms: [
			{
				is: 't,x,linear_o1_linear',
				equation: nt=>`${nt.dxdt} + g(t) \\cdot ${nt.x} = b(t)`,
			},
			{
				is: 't,x,resolved_o1_linear',
				equation: nt=>`${nt.dxdt} = a(t) \\cdot ${nt.x} + b(t)`,
			},
		],
		traits: {
			associatedHomogeneousEquation: {
				contents: {
					linear_o1_linear: nt=>[
						`\\[ ${nt.dxdt} + g(t) \\cdot ${nt.x} = 0 \\]`,
					],
					resolved_o1_linear: nt=>[
						`\\[ ${nt.dxdt} = a(t) \\cdot ${nt.x} \\]`,
					],
				},
			},
			solutionSpaceBasis: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_p \\) is a solution`,
					`and \\( ${nt.x}_h \\) is a nonzero solution of the associated homogeneous equation`,
					`then \\( K ${nt.x}_h + ${nt.x}_p \\) is a general solution.`,
				],
			},
			homogeneitySolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_0 \\) and \\( ${nt.x}_1 \\) are solutions,`,
					`then \\( K_1 ${nt.x}_1 + (1 - K_1) ${nt.x}_0 \\) is a solution.`,
				],
				compare: true,
			},
			additivitySolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_0 \\), \\( ${nt.x}_1 \\) and \\( ${nt.x}_2 \\) are solutions,`,
					`then \\( ${nt.x}_1 + ${nt.x}_2 - ${nt.x}_0 \\) is a solution.`,
				],
				compare: true,
			},
			twoLinearCombinationSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_0 \\), \\( ${nt.x}_1 \\) and \\( ${nt.x}_2 \\) are solutions,`,
					`then \\( K_1 ${nt.x}_1 + K_2 ${nt.x}_2 + (1 - K_1 - K_2) ${nt.x}_0 \\) is a solution.`,
				],
				compare: true,
			},
			nLinearCombinationSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_0 \\), \\( ${nt.x}_1 \\), \\( ${nt.x}_2 \\), ..., \\( ${nt.x}_m \\) are solutions,`,
					`then \\( \\sum\\limits_{i=1}^m K_i ${nt.x}_i + (1 - \\sum\\limits_{i=1}^m K_i) ${nt.x}_0 \\) is a solution.`,
				],
				compare: true,
			},
			twoAffineCombinationSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\), \\( ${nt.x}_2 \\) are solutions`,
					`and \\( K_1 + K_2 = 1 \\)`,
					`then \\( K_1 ${nt.x}_1 + K_2 ${nt.x}_2 \\) is a solution.`,
				],
			},
			nAffineCombinationSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\), \\( ${nt.x}_2 \\), ..., \\( ${nt.x}_m \\) are solutions`,
					`and \\( \\sum\\limits_{i=1}^m K_i = 1 \\)`,
					`then \\( \\sum\\limits_{i=1}^m K_i ${nt.x}_i \\) is a solution.`,
				],
			},
			associatedSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\) and \\( ${nt.x}_2 \\) are solutions,`,
					`then \\( ${nt.x}_1 - ${nt.x}_2 \\) is a solution of the associated homogeneous equation.`,
				],
			},
			generalSolutionMethod: {
				contents: {
					linear_o1_linear:   o1_linear_generalSolutionMethod_content(true),
					resolved_o1_linear: o1_linear_generalSolutionMethod_content(false),
				},
			},
			equilibriumSolutionMethod: {
				formType: 'resolved_o1_linear',
				content: nt=>[
					{type:'note',content:[
						`Can't find equilibrium solution like in Bernoulli equation because \\( n = 0 \\).`,
					]},
				],
				close: true,
			},
		},
	},
	o1_linearHomogeneous: {
		parents: {
			o1_separable: true,
			o1_linear: true,
		},
		name: "first-order linear homogeneous",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a> <a href='https://en.wikipedia.org/wiki/Homogeneous_differential_equation#Homogeneous_linear_differential_equations'>homogeneous</a>",
		importance: 1,
		forms: [
			{
				is: 't,x,linear_o1_linearHomogeneous',
				equation: nt=>`${nt.dxdt} + g(t) \\cdot ${nt.x} = 0`,
			},
			{
				is: 't,x,resolved_o1_linearHomogeneous',
				equation: nt=>`${nt.dxdt} = a(t) \\cdot ${nt.x}`,
			},
		],
		traits: {
			associatedHomogeneousEquation: {
				contents: {
					linear_o1_linearHomogeneous: nt=>[
						`\\[ ${nt.dxdt} + g(t) \\cdot ${nt.x} = 0 \\]`,
						{type:'note',content:[
							`The equation is associated with itself.`,
						]}
					],
					resolved_o1_linearHomogeneous: nt=>[
						`\\[ ${nt.dxdt} = a(t) \\cdot ${nt.x} \\]`,
						{type:'note',content:[
							`The equation is associated with itself.`,
						]}
					],
				},
				close: true,
			},
			solutionSpaceBasis: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_h \\) is a nonzero solution,`,
					`then \\( K ${nt.x}_h \\) is a general solution.`,
				],
			},
			homogeneitySolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\) is a solution,`,
					`then \\( K_1 ${nt.x}_1 \\) is a solution.`,
				],
			},
			additivitySolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\) and \\( ${nt.x}_2 \\) are solutions,`,
					`then \\( ${nt.x}_1 + ${nt.x}_2 \\) is a solution.`,
				],
			},
			twoLinearCombinationSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\) and \\( ${nt.x}_2 \\) are solutions,`,
					`then \\( K_1 ${nt.x}_1 + K_2 ${nt.x}_2 \\) is a solution.`,
				],
			},
			nLinearCombinationSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_1 \\), \\( ${nt.x}_2 \\), ..., \\( ${nt.x}_m \\) are solutions,`,
					`then \\( \\sum\\limits_{i=1}^m K_i ${nt.x}_i \\) is a solution.`,
				],
			},
			twoAffineCombinationSolutionRelation: {
				formType: 't',
				content: nt=>[
					{type:'note',content:[
						`This is a special case of a linear combination.`,
					]},
				],
				close: true,
			},
			nAffineCombinationSolutionRelation: {
				formType: 't',
				content: nt=>[
					{type:'note',content:[
						`This is a special case of a linear combination.`,
					]},
				],
				close: true,
			},
			associatedSolutionRelation: {
				close: true,
			},
			generalSolutionMethod: {
				contents: {
					linear_o1_linearHomogeneous:   o1_linearHomogeneous_generalSolutionMethod_content(true),
					resolved_o1_linearHomogeneous: o1_linearHomogeneous_generalSolutionMethod_content(false),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_o1_linearHomogeneous:   o1_linearHomogeneous_equilibriumSolutionMethod_content('g(t)'),
					resolved_o1_linearHomogeneous: o1_linearHomogeneous_equilibriumSolutionMethod_content('a(t)'),
				},
			},
		},
	},
	o1_separableInT: {
		parents: {
			o1_separable: true,
			o1_linear: true,
		},
		name: "first-order separable in independent variable",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Separation_of_variables#Ordinary_differential_equations_.28ODE.29'>separable</a> in \\(t\\)",
		importance: 2,
		forms: [
			{
				is: 't,x,resolved_o1_separableInT',
				equation: nt=>`${nt.dxdt} = f(t)`,
			},
		],
		traits: {
			associatedHomogeneousEquation: {
				formType: 'x',
				content: nt=>[
					`\\( ${nt.dxdt} = 0 \\)`,
				],
			},
			isoclineProperty: {
				formType: 'x',
				content: nt=>[
					`isoclines are vertical`,
				],
			},
			solutionSpaceBasis: { // also shiftSolutionRelation
				formType: 'x',
				content: nt=>[
					`If \\( ${nt.x}_p \\) is a solution`,
					`then \\( ${nt.x}_p + C \\) is a general solution.`,
				],
			},
			associatedSolutionRelation: {
				formType: 'x',
				content: nt=>[
					`\\( ${nt.x} = C \\) is a solution of the associated homogeneous equation.`,
				],
			},
			generalSolutionMethod: {
				content: nt=>[
					{type:'derivation',content:[
						`\\[ ${nt.dxdt} = f(t) \\]`,
						`\\[ ${nt.int(nt.dxdt)} = ${nt.int('f(t)')} + C \\]`,
					]},
					`\\[ ${nt.x} = ${nt.int('f(t)')} + C \\]`,
				],
			},
			equilibriumSolutionMethod: {
				content: nt=>[
					{type:'note',content:[
						`Can't find equilibrium solution like in separable equation because \\( f_2(${nt.x}) = 1 \\).`,
					]},
				],
				close: true,
			},
		},
	},
	o1_linearHomogeneousConstant: {
		parents: {
			on_linearHomogeneousConstant: true,
			o1_autonomous: true,
			o1_linearHomogeneous: true,
		},
		name: "first-order linear homogeneous with constant coefficients",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,linear_o1_linearHomogeneousConstant',
				equation: nt=>`a \\cdot ${nt.dxdt} + b \\cdot ${nt.x} = 0`,
				notes: nt=>[
					`\\( a \\ne 0 \\)`,
				],
			},
			{
				is: 't,x,resolved_o1_linearHomogeneousConstant',
				equation: nt=>`${nt.dxdt} = k \\cdot ${nt.x}`,
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_o1_linearHomogeneousConstant:   characteristicEquationContent([1,'a'],'+',[0,'b'],'=','0'),
					resolved_o1_linearHomogeneousConstant: characteristicEquationContent([1,1],'=',[0,'k']),
				},
			},
			generalSolutionMethod: {
				contents: {
					linear_o1_linearHomogeneousConstant:   o1_linearHomogeneousConstant_generalSolutionMethod_content('-','\\frac ba'),
					resolved_o1_linearHomogeneousConstant: o1_linearHomogeneousConstant_generalSolutionMethod_content('','k'),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_o1_linearHomogeneousConstant:   o1_linearHomogeneous_equilibriumSolutionMethod_content('b'),
					resolved_o1_linearHomogeneousConstant: o1_linearHomogeneous_equilibriumSolutionMethod_content('k'),
				},
			},
		},
	},
	o1_expGrowth: {
		parents: {
			o1_linearHomogeneousConstant: true,
		},
		name: "exponential (natural) growth",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Exponential_growth#Differential_equation'>exponential (natural) growth</a>",
		importance: 3,
		forms: [
			{
				is: 't,x,linear_o1_expGrowth',
				equation: nt=>`${nt.dxdt} - k \\cdot ${nt.x} = 0`,
				notes: nt=>[
					`\\( k > 0 \\) is the growth constant`,
				],
			},
			{
				is: 't,x,resolved_o1_linearHomogeneousConstant,resolved_o1_expGrowth',
				equation: nt=>`${nt.dxdt} = k \\cdot ${nt.x}`,
				notes: nt=>[
					`\\( k > 0 \\) is the growth constant`,
				],
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_o1_expGrowth:   characteristicEquationContent([1,1],'-',[0,'k'],'=','0'),
					resolved_o1_expGrowth: characteristicEquationContent([1,1],'=',[0,'k']),
				},
			},
			generalSolutionMethod: {
				contents: {
					linear_o1_expGrowth:   o1_linearHomogeneousConstant_generalSolutionMethod_content('','k'),
					resolved_o1_expGrowth: o1_linearHomogeneousConstant_generalSolutionMethod_content('','k'),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_o1_expGrowth:   o1_linearHomogeneous_equilibriumSolutionMethod_content('k'),
					resolved_o1_expGrowth: o1_linearHomogeneous_equilibriumSolutionMethod_content('k'),
				},
			},
		},
	},
	o1_expDecay: {
		parents: {
			o1_linearHomogeneousConstant: true,
		},
		name: "exponential (natural) decay",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Exponential_decay'>exponential (natural) decay</a>",
		importance: 3,
		forms: [
			{
				is: 't,x,scalar_o1_expDecay,linear_o1_expDecay',
				equation: nt=>`${nt.dxdt} + k \\cdot ${nt.x} = 0`,
				notes: nt=>[
					`\\( k > 0 \\) is the decay constant`,
				],
			},
			{
				is: 't,x,scalar_o1_expDecay,resolved_o1_expDecay',
				equation: nt=>`${nt.dxdt} = -k \\cdot ${nt.x}`,
				notes: nt=>[
					`\\( k > 0 \\) is the decay constant`,
				],
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_o1_expDecay:   characteristicEquationContent([1,1],'+',[0,'k'],'=','0'),
					resolved_o1_expDecay: characteristicEquationContent([1,1],'=',[0,'-k']),
				},
			},
			halfLife: {
				formType: 'scalar_o1_expDecay',
				content: nt=>[
					{type:'derivation',content:[
						`\\[ ${nt.x}(t_{1/2}) = \\frac 12 \\cdot ${nt.x}(0) \\]`,
						`substitute general solution \\( ${nt.x}(t) = ${nt.x}(0) e^{-kt} \\)`,
						`\\[ ${nt.x}(0) e^{-kt_{1/2}} = \\frac 12 \\cdot ${nt.x}(0) \\]`,
						`\\[ e^{-kt_{1/2}} = \\frac 12 \\]`,
						`\\[ -kt_{1/2} = -\\ln 2 \\]`,
					]},
					`\\[ t_{1/2} = \\frac{\\ln 2}{k} \\]`,
				],
			},
			generalSolutionMethod: {
				contents: {
					linear_o1_expDecay:   o1_linearHomogeneousConstant_generalSolutionMethod_content('-','k'),
					resolved_o1_expDecay: o1_linearHomogeneousConstant_generalSolutionMethod_content('-','k'),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_o1_expDecay:   o1_linearHomogeneous_equilibriumSolutionMethod_content('-k'),
					resolved_o1_expDecay: o1_linearHomogeneous_equilibriumSolutionMethod_content('-k'),
				},
			},
		},
	},
	o1_logisticGrowth: {
		parents: {
			o1_autonomous: true,
			o1_bernoulli: true,
		},
		name: "logistic growth",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Logistic_function#In_ecology:_modeling_population_growth'>logistic growth</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,o1_logisticGrowth',
				equation: nt=>`${nt.dxdt} = r \\cdot ${nt.x} \\cdot \\left(1 - \\frac{${nt.x}}{k}\\right)`,
				notes: nt=>[
					`\\( k \\) is the <a href='https://en.wikipedia.org/wiki/Carrying_capacity'>carrying capacity</a>`,
				],
			},
		],
		traits: {
			equilibriumSolutionMethod: {
				content: nt=>[
					`\\[ ${nt.x} = 0 \\]`,
					`\\[ ${nt.x} = k \\]`,
				],
			},
		},
	},
}
