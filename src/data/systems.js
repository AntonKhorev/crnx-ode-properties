'use strict'

const LhcPlot=require('../lhc-plot')

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

module.exports={
	sn: {
		parents: {},
		name: "system of n first-order",
		htmlName: "system of <em>n</em> first-order",
		importance: 3,
		forms: [
			{
				is: ['t','xi','system_sn'],
				equation: nt=>`\\left\\{ \\begin{array}{c}`+
					`${nt.dd(`${nt.x}_1`)} = f_1(t,${nt.x}_1,\\dotsc,${nt.x}_n) \\\\`+
					`\\vdots \\\\`+
					`${nt.dd(`${nt.x}_n`)} = f_n(t,${nt.x}_1,\\dotsc,${nt.x}_n)`+
				`\\end{array} \\right.`,
			},
			{
				is: ['t','X','vector_sn'],
				equation: nt=>`${nt.dd(nt.X)} = \\mathbf{F}(t,${nt.X})`,
			},
		],
		traits: {
			testSolutionMethod: {
				formType: 'xi',
				contents: {
					xi: nt=>[
						`Can test if \\( ${nt.x}_{1,p}, ..., ${nt.x}_{n,p} \\) is a solution by substituting \\( ${nt.x}_1 = ${nt.x}_{1,p}, ..., ${nt.x}_n = ${nt.x}_{n,p} \\) into the equation.`,
					],
					X: nt=>[
						`Can test if \\( ${nt.X}_p \\) is a solution by substituting \\( ${nt.X} = ${nt.X}_p \\) into the equation.`,
					],
				},
			},
		},
	},
	s2: {
		parents: {
			sn: true,
		},
		name: "system of 2 first-order",
		importance: 3,
		forms: [
			{
				is: ['t','xy','system_s2'],
				equation: nt=>`\\left\\{ \\begin{aligned}`+
					`${nt.dd(nt.x)} &= f(t,${nt.x},${nt.y}) \\\\`+
					`${nt.dd(nt.y)} &= g(t,${nt.x},${nt.y})`+
				`\\end{aligned} \\right.`,
			},
			{
				is: ['t','X','vector_s2'],
				equation: nt=>`${nt.dd(nt.X)} = \\mathbf{F}(t,${nt.X})`,
			},
		],
		traits: {
			testSolutionMethod: {
				formType: 'xy',
				contents: {
					xy: nt=>[
						`Can test if \\( ${nt.x}_p, ${nt.y}_p \\) is a solution by substituting \\( ${nt.x} = ${nt.x}_p, ${nt.y} = ${nt.y}_p \\) into the equation.`,
					],
					X: nt=>[
						`Can test if \\( ${nt.X}_p \\) is a solution by substituting \\( ${nt.X} = ${nt.X}_p \\) into the equation.`,
					],
				},
			},
		},
	},
/*
	s2_partlyDecoupled: { // TODO other kind of partly decoupled: f(t,x); g(t,x,y)
		parents: {
			s2: true,
		},
		name: "partly decoupled system of 2 first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= f(t,${nt.x},${nt.y}) \\\\`+
				`${nt.dd(nt.y)} &= g(t,${nt.y})`+
			`\\end{aligned} \\right.`,
		traits: {
			generalSolutionMethod: {
				form: true,
				content: [
					`Solve \\(${nt.dd(nt.y)} = g(t,${nt.y}) \\).`,
					`Substitute \\( ${nt.y} \\) into \\( ${nt.dd(nt.x)} = f(t,${nt.x},${nt.y}) \\).`,
					{type:'example',content:[
						`\\[ \\left\\{ \\begin{aligned}`+
							`${nt.dd(nt.x)} &= 2 ${nt.y} - ${nt.x} \\\\`+
							`${nt.dd(nt.y)} &= ${nt.y}`+
						`\\end{aligned} \\right. \\]`,
						`solve the second equation`,
						`\\[ ${nt.y} = ${nt.y}_0 e^t \\]`,
						`substitute \\( ${nt.y} \\) into the first equation`,
						`\\[ ${nt.dd(nt.x)} = 2 ${nt.y}_0 e^t - ${nt.x} \\]`,
						{type:'derivation',title:`solve the first equation`,content:[
							`solve the associated homogeneous equation \\( ${nt.dd(nt.x)} = - ${nt.x} \\)`,
							`\\[ ${nt.x}_h = K e^{-t} \\]`,
							{type:'derivation',title:`find a particular solution of \\( ${nt.dd(nt.x+'_p')} + ${nt.x}_p = 2 ${nt.y}_0 e^t \\)`,content:[
								`guess a solution`,
								`\\[ ${nt.x}_p = \\alpha e^t \\]`,
								`substitute the guess into the equation`,
								`\\[ \\alpha e^t + \\alpha e^t = 2 ${nt.y}_0 e^t \\]`,
								`\\[ \\alpha = ${nt.y}_0 \\]`,
							]},
							`\\[ ${nt.x}_p = ${nt.y}_0 e^t \\]`,
							`\\[ ${nt.x} = ${nt.x}_p + ${nt.x}_h \\]`,
							`\\[ ${nt.x} = ${nt.y}_0 e^t + K e^{-t} \\]`,
						]},
						`\\[ ${nt.x} = ${nt.y}_0 e^t + (${nt.x}_0 - ${nt.y}_0) e^{-t} \\]`,
					]},
				],
			},
		},
	},
	s2_autonomous: {
		parents: {
			s2: true,
		},
		name: "system of 2 first-order autonomous",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= f(${nt.x},${nt.y}) \\\\`+
				`${nt.dd(nt.y)} &= g(${nt.x},${nt.y})`+
			`\\end{aligned} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{F}(${nt.X})`,
		traits: {},
	},
	s2_linearHomogeneous: {
		parents: {
			s2: true,
		},
		name: "system of 2 first-order linear homogeneous equations",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= a(t) \\, ${nt.x} + b(t) \\, ${nt.y} \\\\`+
				`${nt.dd(nt.y)} &= c(t) \\, ${nt.x} + d(t) \\, ${nt.y}`+
			`\\end{aligned} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{A}(t) \\, ${nt.X}`,
		traits: {
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`\\[ ${nt.X} = ${nt.vec2(0,0)} \\]`,
				],
			},
		},
	},
	s2_linearHomogeneousConstant: {
		parents: {
			s2_autonomous: true,
			s2_linearHomogeneous: true,
		},
		name: "system of 2 first-order linear homogeneous equations with constant coefficients",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= a ${nt.x} + b ${nt.y} \\\\`+
				`${nt.dd(nt.y)} &= c ${nt.x} + d ${nt.y}`+
			`\\end{aligned} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{A} ${nt.X}`,
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					`\\[ \\det(\\mathbf{A} - \\lambda \\mathbf{I}) = 0 \\]`,
					{type:'note',content:[
						`\\( \\lambda \\) is an eigenvalue of \\( \\mathbf{A} \\)`,
					]},
				],
			},
			generalSolutionMethod: {
				title: `General and ${ivp} solution`,
				form: true,
				content: [
					`${ivp} initial conditions are: \\( ${nt.x}_0 = ${nt.x}(0) \\), \\( ${nt.y}_0 = ${nt.y}(0) \\)`,
					{type:'switch',title:`coefficients satisfy conditions`,content:[
						{type:'case',title:`\\( b = c = 0 \\)`,content:[
							`the equation has the form:`,
							`\\[ ${nt.ddt} ${nt.vec2(nt.x,nt.y)} = ${nt.mat2('\\lambda_1',0,0,'\\lambda_2')} ${nt.vec2(nt.x,nt.y)} \\]`,
							`general solution (with arbitrary constants \\( ${nt.x}_0 \\), \\( ${nt.y}_0 \\)) and ${ivp} solution:`,
							`\\[ ${nt.X} = ${nt.x}_0 e^{\\lambda_1 t} ${nt.vec2(1,0)} + ${nt.y}_0 e^{\\lambda_2 t} ${nt.vec2(0,1)} \\]`,
						]},
						{type:'case',title:`\\( a = 0 \\) and \\( b = 1 \\) (optional)`,content:[
							{type:'note',content:[
								`this is an optional case, you can use <em>\\( b \\neq 0 \\) or \\( c \\neq 0 \\)</em> case below`,
								`this case will happen after order reduction of second-order equation`,
							]},
							`the equation has the form:`,
							`\\[ ${nt.ddt} ${nt.vec2(nt.x,nt.y)} = ${nt.mat2(0,1,`c`,`d`)} ${nt.vec2(nt.x,nt.y)} \\]`,
							{type:'derivation',content:[
									`eigenvector for \\( \\lambda_1 \\) is:`,
									`\\[ ${nt.vec2(`${nt.x}_1`,`${nt.y}_1`)} = ${nt.vec2(1,'\\lambda_1')} \\]`,
									`eigenvector for \\( \\lambda_2 \\) is:`,
									`\\[ ${nt.vec2(`${nt.x}_2`,`${nt.y}_2`)} = ${nt.vec2(1,'\\lambda_2')} \\]`,
									`use these eigenvectors in <em>\\( b \\neq 0 \\) or \\( c \\neq 0 \\)</em> case below`,
								]},
							`get eigenvalues \\( \\lambda_1 \\), \\( \\lambda_2 \\) by solving the characteristic equation for \\( \\lambda \\):`,
							`\\[ \\det(\\mathbf{A} - \\lambda \\mathbf{I}) = 0 \\]`,
							{type:'switch',title:`eigenvalues \\( \\lambda_1 \\), \\( \\lambda_2 \\) are`,content:[
								{type:'case',title:`repeated \\( ( \\lambda_1 = \\lambda_2 = \\lambda ) \\)`,content:[
									`general solution (with arbitrary constants \\( ${nt.x}_0 \\), \\( ${nt.y}_0 \\)) and ${ivp} solution:`,
									`\\[ ${nt.X} = e^{\\lambda t} ${nt.vec2(nt.x+'_0',nt.y+'_0')} + t e^{\\lambda t} (\\mathbf{A} - \\lambda \\mathbf{I}) ${nt.vec2(nt.x+'_0',nt.y+'_0')} \\]`,
								]},
								{type:'case',title:`real distinct \\( ( \\lambda_1 \\ne \\lambda_2; \\lambda_1, \\lambda_2 \\in \\mathbb{R} ) \\)`,content:[
									`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
									`\\[ ${nt.X} = k_1 e^{\\lambda_1 t} ${nt.vec2(1,'\\lambda_1')} + k_2 e^{\\lambda_2 t} ${nt.vec2(1,'\\lambda_2')} \\]`,
									`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
									`\\[ ${nt.mat2(1,1,'\\lambda_1','\\lambda_2')} ${nt.vec2('k_1','k_2')} = ${nt.vec2(`${nt.x}_0`,`${nt.y}_0`)} \\]`,
								]},
								{type:'case',title:`complex conjugate pair \\( ( \\lambda = \\alpha \\pm i \\beta; \\beta \\ne 0 ) \\)`,content:[
									`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
									`\\[ \\begin{aligned} `+
										`${nt.X} = \\: & k_1 e^{\\alpha t} ${nt.vec2('\\cos \\beta t','\\alpha \\cos \\beta t - \\beta \\sin \\beta t')} \\\\`+
										        `+ \\: & k_2 e^{\\alpha t} ${nt.vec2('\\sin \\beta t','\\alpha \\sin \\beta t + \\beta \\cos \\beta t')} `+
									`\\end{aligned} \\]`,
									`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
									`\\[ ${nt.mat2(1,0,'\\alpha','\\beta')} ${nt.vec2('k_1','k_2')} = ${nt.vec2(`${nt.x}_0`,`${nt.y}_0`)} \\]`,
								]},
							]},
						]},
						{type:'case',title:`\\( b \\neq 0 \\) or \\( c \\neq 0 \\)`,content:[
							`get eigenvalues \\( \\lambda_1 \\), \\( \\lambda_2 \\) by solving the characteristic equation for \\( \\lambda \\):`,
							`\\[ \\det(\\mathbf{A} - \\lambda \\mathbf{I}) = 0 \\]`,
							{type:'switch',title:`eigenvalues \\( \\lambda_1 \\), \\( \\lambda_2 \\) are`,content:[
								{type:'case',title:`repeated \\( ( \\lambda_1 = \\lambda_2 = \\lambda ) \\)`,content:[
									`general solution (with arbitrary constants \\( ${nt.x}_0 \\), \\( ${nt.y}_0 \\)) and ${ivp} solution:`,
									`\\[ ${nt.X} = e^{\\lambda t} ${nt.vec2(nt.x+'_0',nt.y+'_0')} + t e^{\\lambda t} (\\mathbf{A} - \\lambda \\mathbf{I}) ${nt.vec2(nt.x+'_0',nt.y+'_0')} \\]`,
								]},
								{type:'case',title:`real distinct \\( ( \\lambda_1 \\ne \\lambda_2; \\lambda_1, \\lambda_2 \\in \\mathbb{R} ) \\)`,content:[
									`find eigenvector \\( ${nt.svec2(`${nt.x}_1`,`${nt.y}_1`)} \\) by solving:`,
									`\\[ (\\mathbf{A} - \\lambda_1 \\mathbf{I}) ${nt.vec2(`${nt.x}_1`,`${nt.y}_1`)} = 0 \\]`,
									`find eigenvector \\( ${nt.svec2(`${nt.x}_2`,`${nt.y}_2`)} \\) by solving:`,
									`\\[ (\\mathbf{A} - \\lambda_2 \\mathbf{I}) ${nt.vec2(`${nt.x}_2`,`${nt.y}_2`)} = 0 \\]`,
									`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
									`\\[ ${nt.X} = k_1 e^{\\lambda_1 t} ${nt.vec2(`${nt.x}_1`,`${nt.y}_1`)} + k_2 e^{\\lambda_2 t} ${nt.vec2(`${nt.x}_2`,`${nt.y}_2`)} \\]`,
									`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
									`\\[ ${nt.mat2(`${nt.x}_1`,`${nt.x}_2`,`${nt.y}_1`,`${nt.y}_2`)} ${nt.vec2('k_1','k_2')} = ${nt.vec2(`${nt.x}_0`,`${nt.y}_0`)} \\]`,
								]},
								{type:'case',title:`complex conjugate pair \\( ( \\lambda = \\alpha \\pm i \\beta; \\beta \\ne 0 ) \\)`,content:[
									`select one of eigenvalues \\( \\lambda_1 = \\alpha + i \\beta \\)`,
									`find complex-valued eigenvector \\( ${nt.svec2(`${nt.x}_1 + i ${nt.x}_2`,`${nt.y}_1 + i ${nt.y}_2`)} \\) by solving:`,
									`\\[ (\\mathbf{A} - \\lambda_1 \\mathbf{I}) ${nt.vec2(`${nt.x}_1 + i ${nt.x}_2`,`${nt.y}_1 + i ${nt.y}_2`)} = 0 \\]`,
									{type:'derivation',content:[
										`one of complex-valued solutions:`,
										`\\[ ${nt.X}_c = e^{\\alpha t} (\\cos \\beta t + i \\sin \\beta t) ${nt.svec2(`${nt.x}_1 + i ${nt.x}_2`,`${nt.y}_1 + i ${nt.y}_2`)} \\]`,
										`find general solution by taking real and imaginary parts of a complex-valued solution:`,
										`\\[ ${nt.X} = k_1 \\operatorname{Re}(${nt.X}_c) + k_2 \\operatorname{Im}(${nt.X}_c) \\]`,
									]},
									`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
									`\\[ \\begin{aligned} `+
										`${nt.X} = \\: & k_1 e^{\\alpha t} ${nt.vec2(`${nt.x}_1 \\cos \\beta t - ${nt.x}_2 \\sin \\beta t`,`${nt.y}_1 \\cos \\beta t - ${nt.y}_2 \\sin \\beta t`)} \\\\`+
										        `+ \\: & k_2 e^{\\alpha t} ${nt.vec2(`${nt.x}_1 \\sin \\beta t + ${nt.x}_2 \\cos \\beta t`,`${nt.y}_1 \\sin \\beta t + ${nt.y}_2 \\cos \\beta t`)} `+
									`\\end{aligned} \\]`,
									`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
									`\\[ ${nt.mat2(`${nt.x}_1`,`${nt.x}_2`,`${nt.y}_1`,`${nt.y}_2`)} ${nt.vec2('k_1','k_2')} = ${nt.vec2(`${nt.x}_0`,`${nt.y}_0`)} \\]`,
								]},
							]},
						]},
					]},
				],
			},
			equilibriumSolutionMethod: {
				form: true,
				content: [
					{type:'switch',title:`\\( \\det(\\mathbf{A}) \\) is`,content:[
						{type:'case',title:`\\( \\det(\\mathbf{A}) = 0 \\)`,content:[
							`\\[ ${nt.X} = K ${nt.vec2('b','-a')} \\]`,
							{type:'proof',content:[
								`\\[ ${nt.dd(nt.X)} = K ${nt.mat2('a','b','c','d')} ${nt.vec2('b','-a')} \\]`,
								`\\[ ${nt.dd(nt.X)} = K ${nt.vec2('a b - b a','c b - d a')} \\]`,
								`\\[ a d = b c \\]`,
								`\\[ ${nt.dd(nt.X)} = ${nt.vec2(0,0)} \\]`,
							]},
						]},
						{type:'case',title:`\\( \\det(\\mathbf{A}) \\ne 0 \\)`,content:[
							`\\[ ${nt.X} = ${nt.vec2(0,0)} \\]`,
						]},
					]},
				],
			},
			plot: {
				form: true,
				content: [
					()=>{
						const plot=new LhcPlot(nt.x,nt.y)
						return plot.$output
					}
				],
			},
		},
	},
	sn_sir: {
		parents: {
			sn: true,
		},
		name: "SIR model",
		htmlName: "<a href='https://en.wikipedia.org/w/index.php?title=SIR_model'>SIR</a> model",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd('S')} &= -\\alpha S I \\\\`+
				`${nt.dd('I')} &= \\alpha S I - \\beta I \\\\ `+
				`${nt.dd('R')} &= \\beta I`+
			`\\end{aligned} \\right.`,
		equationNotes: [
			`\\( S = \\) number susceptible`,
			`\\( I = \\) number infectious`,
			`\\( R = \\) number recovered (immune)`,
			`\\( \\alpha = \\) contact rate`,
			`\\( \\beta = \\) recovery rate`,
			`all quantities are nonnegative`,
		],
		traits: {
			phaseSolutionMethod: {
				form: true,
				content: [
					`threshold value \\( \\rho = \\frac\\beta\\alpha \\):`,
					`\\( I \\) increases when \\( S &gt; \\rho \\)`,
					`\\( S \\) decreases`,
					`\\( I \\) attains its maximum when \\( S = \\rho \\)`,
					{type:'derivation',content:[
						`\\[ ${nt.dd('S')} + ${nt.dd('I')} + ${nt.dd('R')} = 0 \\]`,
						`total population \\( N \\) is constant`,
						`\\[ S + I + R = N \\]`,
						`eliminate \\( R \\)`,
						`\\[ \\left\\{ \\begin{aligned} `+
							`${nt.dd('S')} &= -\\alpha S I \\\\ `+
							`${nt.dd('I')} &= \\alpha S I - \\beta I \\\\ `+
						`\\end{aligned} \\right. \\]`,
						`\\[ ${nt.dd('I','S')} = \\frac{\\alpha S I - \\beta I}{-\\alpha S I} = -1 + \\frac{\\rho}{S} \\]`,
						`integrate by \\( S \\)`,
						`\\[ I = -S + \\rho \\ln S + C \\]`,
					]},
					`conserved quantities:`,
					`\\[ \\begin{multline}`+
						`S(t) + I(t) + R(t) = \\\\ `+
						`= S(0) + I(0) + R(0) `+
					`\\end{multline} \\]`,
					`\\[ \\begin{multline}`+
						`I(t) + S(t) - \\rho \\ln S(t) = \\\\ `+
						`= I(0) + S(0) - \\rho \\ln S(0) `+
					`\\end{multline} \\]`,
					`maximum of \\( I \\):`,
					`\\[ \\begin{multline}`+
						`I_{max} + \\rho - \\rho \\ln \\rho = \\\\ `+
						`= I(0) + S(0) - \\rho \\ln S(0) `+
					`\\end{multline} \\]`,
				],
			},
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`\\[ I = 0 \\]`,
				],
			},
		},
	},
*/
}
