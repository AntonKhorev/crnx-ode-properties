'use strict'

const dd=(a,b,n)=>{
	if (b===undefined) b='t'
	if (n===undefined) n=1
	if (n==1) {
		return `\\frac{\\mathrm{d}${a}}{\\mathrm{d}${b}}`
	} else {
		return `\\frac{\\mathrm{d}^{${n}}${a}}{\\mathrm{d}${b}^{${n}}}`
	}
}
const dydt=dd('y')
const ddt=dd('')
const int=(fx,x)=>`\\int\\!${fx}\\,\\mathrm{d}${x}`
const sint=(fx,x)=>`\\int\\!${fx}\\mathrm{d}${x}`
const eqsol=(name)=>`<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>${name}</a>`
const vec2=(a,b)=>`\\begin{bmatrix} ${a} \\\\ ${b} \\end{bmatrix}`
const mat2=(a,b,c,d)=>`\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`

const traits=[
	['entity',[
		['associatedHomogeneousEquation'],
		['characteristicEquation'],
	]],
	['property',[
		['isoclineProperty'],
		['solutionRelation',[
			['shiftSolutionRelation'],
			['linearitySolutionRelation',[ // linear and affine properties of solutions
				['solutionSpaceBasis'],
				['homogeneitySolutionRelation'],
				['additivitySolutionRelation'],
				['twoLinearCombinationSolutionRelation'],
				['nLinearCombinationSolutionRelation'],
				['twoAffineCombinationSolutionRelation'],
				['nAffineCombinationSolutionRelation'],
				['associatedSolutionRelation'],
			]]
		]],
	]],
	['transform',[
		['orderReduction'],
	]],
	['solutionMethod',[
		['generalSolutionMethod'],
		['phaseSolutionMethod'],
		['equilibriumSolutionMethod'],
		['testSolutionMethod'],
	]],
]

// trait entries:
//	title = redefine title
//	content
//	form = have to present the equation in which this trait was defined
//	close = children don't need to inherit this trait; display it only if parents have it displayed
//	compare = show only if other classes have this property without compare entry
const classes={
	sn: {
		parents: {},
		name: "system of n first-order",
		htmlName: "system of <em>n</em> first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{array}{c}`+
				dd('y_1')+` = f_1(t,y_1,…,y_n) \\\\`+
				`\\vdots \\\\`+
				dd('y_n')+` = f_n(t,y_1,…,y_n)`+
			`\\end{array} \\right.`,
		vectorEquation: dd('Y')+` = F(t,Y)`,
		traits: {
			testSolutionMethod: {
				content: [
					"Can test if \\( Y_p \\) is a solution by substituting \\( Y = Y_p \\) into the equation.",
				],
			},
		},
	},
	s2: {
		parents: {
			sn: true,
		},
		name: "system of 2 first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				dd('y')+` &= f(t,y,v) \\\\`+
				dd('v')+` &= g(t,y,v)`+
			`\\end{aligned} \\right.`,
		vectorEquation: dd('Y')+` = F(t,Y)`,
		traits: {},
	},
	s2_partlyDecoupled: {
		parents: {
			s2: true,
		},
		name: "partly decoupled system of 2 first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				dd('y')+` &= f(t,y,v) \\\\`+
				dd('v')+` &= g(t,v)`+
			`\\end{aligned} \\right.`,
		traits: {
			generalSolutionMethod: {
				form: true,
				content: [
					`Solve \\(${dd('v')} = g(t,v) \\).`,
					`Substitute \\( v \\) into \\( ${dd('y')} = f(t,y,v) \\).`,
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
				dd('y')+` &= f(y,v) \\\\`+
				dd('v')+` &= g(y,v)`+
			`\\end{aligned} \\right.`,
		vectorEquation: dd('Y')+` = F(Y)`,
		traits: {},
	},
	s2_linearHomogeneousConstant: {
		parents: {
			s2_autonomous: true,
		},
		name: "system of 2 first-order linear homogeneous equations with constant coefficients",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				dd('y')+` &= a_{yy} y + a_{yv} v \\\\`+
				dd('v')+` &= a_{vy} y + a_{vv} v`+
			`\\end{aligned} \\right.`,
		vectorEquation: dd('Y')+` = A Y`,
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					`\\[ \\det(A - \\lambda I) = 0 \\]`,
					{type:'note',content:[
						`\\( \\lambda \\) is an eigenvalue of \\( A \\)`,
					]},
				],
			},
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'cases',content:[
						{type:'case',title:`\\( a_{yv} = a_{vy} = 0 \\)`,content:[
							`\\[ ${ddt} ${vec2('y','v')} = ${mat2('\\lambda_1',0,0,'\\lambda_2')} ${vec2('y','v')} \\]`+
							`\\[ Y = y_0 e^{\\lambda_1 t} ${vec2(1,0)} + v_0 e^{\\lambda_2 t} ${vec2(0,1)} \\]`,
						]},
						{type:'case',title:`\\( a_{yv} \\neq 0 \\) or \\( a_{vy} \\neq 0 \\)`,content:[
							`solve characteristic equation for \\( \\lambda \\)`,
							{type:'cases',content:[
								{type:'case',title:`repeated \\( \\lambda \\)`,content:[
									`TODO`,
								]},
								{type:'case',title:`real distinct \\( \\lambda_1 \\), \\( \\lambda_2 \\)`,content:[
									`TODO`,
								]},
								{type:'case',title:`complex conjugate pair \\( \\lambda = \\alpha \\pm \\beta i \\)`,content:[
									`TODO`,
								]},
							]},
						]},
					]},
				],
			}
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
				dd('S')+` &= -\\alpha S I \\\\`+
				dd('I')+` &= \\alpha S I - \\beta I \\\\ `+
				dd('R')+` &= \\beta I`+
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
						`\\[ ${dd('S')} + ${dd('I')} + ${dd('R')} = 0 \\]`,
						`total population \\( N \\) is constant`,
						`\\[ S + I + R = N \\]`,
						`eliminate \\( R \\)`,
						`\\[ \\left\\{ \\begin{aligned}`+
							dd('S')+` &= -\\alpha S I \\\\`+
							dd('I')+` &= \\alpha S I - \\beta I \\\\ `+
						`\\end{aligned} \\right. \\]`,
						`\\[ ${dd('I','S')} = \\frac{\\alpha S I - \\beta I}{-\\alpha S I} = -1 + \\frac{\\rho}{S} \\]`,
						`integrate by \\( S \\)`,
						`\\[ I = -S + \\rho \\ln S + C \\]`,
					]},
					`conserved quantities:`,
					`\\[ \\begin{multline}`+
						`S(t) + I(t) + R(t) = \\\\`+
						`= S(0) + I(0) + R(0)`+
					`\\end{multline} \\]`,
					`\\[ \\begin{multline}`+
						`I(t) + S(t) - \\rho \\ln S(t) = \\\\`+
						`= I(0) + S(0) - \\rho \\ln S(0)`+
					`\\end{multline} \\]`,
					`maximum of \\( I \\):`,
					`\\[ \\begin{multline}`+
						`I_{max} + \\rho - \\rho \\ln \\rho = \\\\`+
						`= I(0) + S(0) - \\rho \\ln S(0)`+
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
	on: {
		parents: {},
		name: "nth-order",
		htmlName: "<em>n</em>th-order",
		importance: 2,
		equation: `${dd('y','t','n')} = f(t,y,${dydt},...,${dd('y','t','n-1')})`,
		traits: {
			testSolutionMethod: {
				content: [
					"Can test if \\( y_p \\) is a solution by substituting \\( y = y_p \\) into the equation.",
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
		equation: `${dd('y','t','n')} = - \\sum_{i=0}^{n-1} \\frac{a_i}{a_n} ${dd('y','t','i')}`,
		equationNotes: [
			`usually written as \\( \\sum_{i=0}^n a_i ${dd('y','t','i')} = 0 \\)`,
		],
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ \\sum_{i=0}^n a_i ${dd('y','t','i')} = 0 \\]`,
						`substitute \\( y = e^{\\lambda t} \\)`,
						`\\[ \\sum_{i=0}^n a_i ${dd('','t','i')} e^{\\lambda t} = 0 \\]`,
						`\\[ \\sum_{i=0}^n a_i \\lambda^i e^{\\lambda t} = 0 \\]`,
						`divide by \\( e^{\\lambda t} \\)`,
					]},
					`\\[ \\sum_{i=0}^n a_i \\lambda^i = 0 \\]`,
				],
			},
		},
	},
	o1: {
		parents: {
			sn: true,
			on: true,
		},
		name: "first-order",
		importance: 0,
		equation: `${dydt} = f(t,y)`,
		traits: {
			testSolutionMethod: { // same as in 'on', done to mask 'sn's trait
				content: [
					"Can test if \\( y_p \\) is a solution by substituting \\( y = y_p \\) into the equation.",
				],
			},
		},
	},
	o1_separable: {
		parents: {
			o1: true,
		},
		name: "first-order separable",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Separation_of_variables#Ordinary_differential_equations_.28ODE.29'>separable</a>",
		importance: 1,
		equation: `${dydt} = f_1(t) \\cdot f_2(y)`,
		traits: {
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = f_1(t) \\cdot f_2(y) \\]`,
						`\\[ \\frac{1}{f_2(y)} \\cdot ${dydt} = f_1(t) \\]`,
						`\\[ ${int(`\\frac{1}{f_2(y)} ${dydt}`,'t')} = ${int('f_1(t)','t')} + C \\]`,
					]},
					`\\[ ${int(`\\frac{1}{f_2(y)}`,'y')} = ${int('f_1(t)','t')} + C \\]`,
					{type:'note',content:[
						`this may or may not include ${eqsol("equilibrium solutions")}`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`solve \\( f_2(y) = 0 \\) for constant \\( y \\)`,
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
		equation: `${dydt} = f(y)`,
		traits: {
			isoclineProperty: {
				content: [
					"isoclines are horizontal",
				],
			},
			shiftSolutionRelation: {
				content: [
					"If \\( y_p(t) \\) is a solution, then \\( y_p(t+C) \\) is a solution",
				],
			},
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = f(y) \\]`,
						`\\[ \\frac{1}{f(y)} \\cdot ${dydt} = 1 \\]`,
						`\\[ ${int(`\\frac{1}{f(y)} ${dydt}`,'t')} = ${int('1','t')} + C \\]`,
					]},
					`\\[ ${int(`\\frac{1}{f(y)}`,'y')} = t + C \\]`,
					{type:'note',content:[
						`this may or may not include ${eqsol("equilibrium solutions")}`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`solve \\( f(y) = 0 \\) for constant \\( y \\)`,
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
		equation: `${dydt} = a(t) \\cdot y + b(t) \\cdot y^n`,
		equationNotes: [
			`\\( n \\neq 1 \\)`,
			`usually it's also defined that additionally \\( n \\neq 0 \\), but we ignore this requirement here`,
		],
		traits: {
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = a(t) \\cdot y + b(t) \\cdot y^n \\]`,
						`multiply the equation by \\( \\frac{1-n}{y^n} \\)`,
						`\\[ \\frac{1-n}{y^n} ${dydt} = \\cdots \\]`,
						`\\[ \\cdots = \\frac{(1-n) a(t)}{y^{n-1}} + (1-n) b(t) \\]`,
						`introduce a new variable`,
						`\\[ z = \\frac{1}{y^{n-1}} \\]`,
						`\\[ ${dd('z')} = ${dd('z','y')} ${dydt} = \\frac{1-n}{y^n} ${dydt} \\]`,
						`substitute \\( z \\) and \\( ${dd('z')} \\) into the equation`,
						`\\[ ${dd('z')} = (1-n) a(t) z + (1-n) b(t) \\]`,
						`solve this equation as a linear equation in \\( z \\), then return to the original variable \\( y \\)`,
						`\\[ \\mu(t) z = (1-n) ${int('\\mu(t) b(t)','t')} + C \\]`,
					]},
					`\\[ \\mu(t) = e^{(n-1)${sint('a(t)','t')}} \\]`,
					`\\[ \\frac{\\mu(t)}{y^{n-1}} = (1-n) ${int('\\mu(t) b(t)','t')} + C \\]`,
					{type:'note',content:[
						`this may or may not include ${eqsol("equilibrium solutions")}`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`if \\( n>0 \\), there's an equilibrium solution \\( y(t) = 0 \\)`,
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
		equation: `${dydt} = a(t) \\cdot y + b(t)`,
		traits: {
			associatedHomogeneousEquation: {
				form: true,
				content: [
					`\\[ ${dydt} = a(t) \\cdot y \\]`,
				],
			},
			solutionSpaceBasis: {
				content: [
					`If \\( y_p \\) is a solution`,
					`and \\( y_h \\) is a nonzero solution of the associated homogeneous equation`,
					`then \\( K y_h + y_p \\) is a general solution.`,
				],
			},
			homogeneitySolutionRelation: {
				content: [
					`If \\( y_0 \\) and \\( y_1 \\) are solutions,`,
					`then \\( K_1 y_1 + (1 - K_1) y_0 \\) is a solution.`,
				],
				compare: true,
			},
			additivitySolutionRelation: {
				content: [
					`If \\( y_0 \\), \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( y_1 + y_2 - y_0 \\) is a solution.`,
				],
				compare: true,
			},
			twoLinearCombinationSolutionRelation: {
				content: [
					`If \\( y_0 \\), \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( K_1 y_1 + K_2 y_2 + (1 - K_1 - K_2) y_0 \\) is a solution.`,
				],
				compare: true,
			},
			nLinearCombinationSolutionRelation: {
				content: [
					`If \\( y_0 \\), \\( y_1 \\), \\( y_2 \\), ..., \\( y_m \\) are solutions,`,
					`then \\( \\sum\\limits_{i=1}^m K_i y_i + (1 - \\sum\\limits_{i=1}^m K_i) y_0 \\) is a solution.`,
				],
				compare: true,
			},
			twoAffineCombinationSolutionRelation: {
				content: [
					`If \\( y_1 \\), \\( y_2 \\) are solutions`,
					`and \\( K_1 + K_2 = 1 \\)`,
					`then \\( K_1 y_1 + K_2 y_2 \\) is a solution.`,
				],
			},
			nAffineCombinationSolutionRelation: {
				content: [
					`If \\( y_1 \\), \\( y_2 \\), ..., \\( y_m \\) are solutions`,
					`and \\( \\sum\\limits_{i=1}^m K_i = 1 \\)`,
					`then \\( \\sum\\limits_{i=1}^m K_i y_i \\) is a solution.`,
				],
			},
			associatedSolutionRelation: {
				content: [
					`If \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( y_1 - y_2 \\) is a solution of the associated homogeneous equation.`,
				],
			},
			generalSolutionMethod: {
				title: "Solutions found with method of <a href='https://en.wikipedia.org/wiki/Integrating_factor'>integrating factors</a>",
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = a(t) \\cdot y + b(t) \\]`,
						`introduce a new function`,
						`\\[ g(t) = -a(t) \\]`,
						`rewrite the equation with \\( g(t) \\)`,
						`\\[ ${dydt} + g(t) \\cdot y = b(t) \\]`,
						`introduce the integrating factor`,
						`\\[ \\mu(t) = e^{${sint('g(t)','t')}} \\]`,
						`multiply the equation by \\( \\mu(t) \\)`,
						`\\[ \\mu(t) ${dydt} + \\mu(t) g(t) y = \\mu(t) b(t) \\]`,
						`\\[ \\mu(t) ${dydt} + e^{${sint('g(t)','t')}} g(t) y = \\mu(t) b(t) \\]`,
						`\\[ \\mu(t) ${dydt} + ${ddt}(e^{${sint('g(t)','t')}}) y = \\mu(t) b(t) \\]`,
						`\\[ \\mu(t) ${dydt} + ${ddt}(\\mu(t)) y = \\mu(t) b(t) \\]`,
						`\\[ ${ddt}(\\mu(t) y) = \\mu(t) b(t) \\]`,
						`integrate the equation multiplied by \\( \\mu(t) \\)`,
						`\\[ \\mu(t) y = ${int('\\mu(t) b(t)','t')} + C \\]`,
					]},
					`\\[ \\mu(t) = e^{-${sint('a(t)','t')}} \\]`,
					`\\[ \\mu(t) y = ${int('\\mu(t) b(t)','t')} + C \\]`,
				],
			},
			equilibriumSolutionMethod: {
				content: [
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
		equation: `${dydt} = a(t) \\cdot y`,
		traits: {
			associatedHomogeneousEquation: {
				content: [
					`\\[ ${dydt} = a(t) \\cdot y \\]`,
					{type:'note',content:[
						`The equation is associated with itself.`,
					]}
				],
				close: true,
			},
			solutionSpaceBasis: {
				content: [
					`If \\( y_h \\) is a nonzero solution,`,
					`then \\( K y_h \\) is a general solution.`,
				],
			},
			homogeneitySolutionRelation: {
				content: [
					`If \\( y_1 \\) is a solution,`,
					`then \\( K_1 y_1 \\) is a solution.`,
				],
			},
			additivitySolutionRelation: {
				content: [
					`If \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( y_1 + y_2 \\) is a solution.`,
				],
			},
			twoLinearCombinationSolutionRelation: {
				content: [
					`If \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( K_1 y_1 + K_2 y_2 \\) is a solution.`,
				],
			},
			nLinearCombinationSolutionRelation: {
				content: [
					`If \\( y_1 \\), \\( y_2 \\), ..., \\( y_m \\) are solutions,`,
					`then \\( \\sum\\limits_{i=1}^m K_i y_i \\) is a solution.`,
				],
			},
			twoAffineCombinationSolutionRelation: {
				content: [
					{type:'note',content:[
						`This is a special case of a linear combination.`,
					]},
				],
				close: true,
			},
			nAffineCombinationSolutionRelation: {
				content: [
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
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = a(t) \\cdot y \\]`,
						`\\[ \\frac{1}{y} \\cdot ${dydt} = a(t) \\]`,
						`\\[ ${int(`\\frac{1}{y} ${dydt}`,'t')} = ${int('a(t)','t')} + C \\]`,
						`\\[ ${int(`\\frac{1}{y}`,'y')} = ${int('a(t)','t')} + C \\]`,
						`\\[ \\ln|y| = ${int('a(t)','t')} + C \\]`,
					]},
					`\\[ y = K \\cdot e^{${sint('a(t)','t')}} \\]`,
					{type:'note',content:[
						`includes ${eqsol("equilibrium solution")} when \\( K = 0 \\)`,
					]},
				],
			},
			equilibriumSolutionMethod: {
				content: [
					`\\[ y = 0 \\]`,
				],
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
		equation: `${dydt} = f(t)`,
		traits: {
			associatedHomogeneousEquation: {
				content: [
					`\\( ${dydt} = 0 \\)`,
				],
			},
			isoclineProperty: {
				content: [
					"isoclines are vertical",
				],
			},
			solutionSpaceBasis: { // also shiftSolutionRelation
				content: [
					`If \\( y_p \\) is a solution`,
					`then \\( y_p + C \\) is a general solution.`,
				],
			},
			associatedSolutionRelation: {
				content: [
					`\\( y = C \\) is a solution of the associated homogeneous equation.`,
				],
			},
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = f(t) \\]`,
						`\\[ ${int(`${dydt}`,'t')} = ${int('f(t)','t')} + C \\]`,
					]},
					`\\[ y = ${int('f(t)','t')} + C \\]`,
				],
			},
			equilibriumSolutionMethod: {
				content: [
					{type:'note',content:[
						`Can't find equilibrium solution like in separable equation because \\( f_2(y) = 1 \\).`,
					]},
				],
				close: true,
			},
		},
	},
	o1_expGrowth: {
		parents: {
			on_linearHomogeneousConstant: true,
			o1_autonomous: true,
			o1_linearHomogeneous: true,
		},
		name: "first-order linear homogeneous with constant coefficients (exponential growth)",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a> (<a href='https://en.wikipedia.org/wiki/Exponential_growth#Differential_equation'>exponential growth</a>)",
		importance: 2,
		equation: `${dydt} = k \\cdot y`,
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = k \\cdot y \\]`,
						`substitute \\( y = e^{\\lambda t} \\)`,
						`\\[ ${ddt} e^{\\lambda t} = k \\cdot e^{\\lambda t} \\]`,
						`\\[ \\lambda \\cdot e^{\\lambda t} = k \\cdot e^{\\lambda t} \\]`,
						`divide by \\( e^{\\lambda t} \\)`,
					]},
					`\\[ \\lambda = k \\]`,
				],
			},
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'derivation',content:[
						`\\[ ${dydt} = k \\cdot y \\]`,
						`\\[ \\frac{1}{y} \\cdot ${dydt} = k \\]`,
						`\\[ ${int(`\\frac{1}{y} ${dydt}`,'t')} = ${int('k','t')} + C \\]`,
						`\\[ ${int(`\\frac{1}{y}`,'y')} = ${int('k','t')} + C \\]`,
						`\\[ \\ln|y| = kt + C \\]`,
						`\\[ y(t) = C_1 e^{kt} \\]`,
						`\\[ y(0) = C_1 e^0 \\]`,
						`\\[ C_1 = y(0) \\]`,
					]},
					`\\[ y(t) = y(0) e^{kt} \\]`,
					{type:'note',content:[
						`includes ${eqsol("equilibrium solution")} when \\( y(0) = 0 \\)`,
					]},
				],
			},
			equilibriumSolutionMethod: { // TODO could have inherited from linear homogeneous, but have to override autonomous
				content: [
					`\\[ y = 0 \\]`
				],
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
		equation: `${dydt} = r \\cdot y \\cdot \\left(1 - \\frac{y}{k}\\right)`,
		equationNotes: [
			`\\( k \\) is the <a href='https://en.wikipedia.org/wiki/Carrying_capacity'>carrying capacity</a>`,
		],
		traits: {
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`\\[ y = 0 \\]`,
					`\\[ y = k \\]`,
				],
			},
		},
	},
	o2: {
		parents: {
			on: true,
		},
		name: "second-order",
		importance: 2,
		equation: `${dd('y','t','2')} = f(t,y,${dydt})`,
		traits: {
			orderReduction: {
				title: "Order reduction to a system of 2 first-order equations",
				form: true,
				content: [
					"transform to a system of 2 first-order equations",
					`\\[ \\left\\{ \\begin{aligned}`+
						dd(`y`)+` &= v \\\\`+
						dd(`v`)+` &= f(t,y,v)`+
					`\\end{aligned} \\right. \\]`,
				],
			},
		},
	},
	o2_autonomous: {
		parents: {
			o2: true,
		},
		name: "second-order autonomous",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Autonomous_system_%28mathematics%29'>autonomous</a>",
		importance: 2,
		equation: `${dd('y','t','2')} = f(y,${dydt})`,
		traits: {
			orderReduction: {
				title: "Order reduction to a system of 2 first-order autonomous equations",
				form: true,
				content: [
					`\\[ \\left\\{ \\begin{aligned}`+
						dd(`y`)+` &= v \\\\`+
						dd(`v`)+` &= f(y,v)`+
					`\\end{aligned} \\right. \\]`,
				],
			},
		},
	},
	o2_linearHomogeneousConstant: {
		parents: {
			on_linearHomogeneousConstant: true,
			o2_autonomous: true,
		},
		name: "second-order linear homogeneous with constant coefficients",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		equation: `${dd('y','t','2')} = - \\frac b a ${dydt} - \\frac c a y`,
		equationNotes: [
			`usually written as \\( a ${dd('y','t','2')} + b ${dydt} + c y = 0 \\)`,
		],
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					{type:'derivetion',content:[
						`\\[ a ${dd('y','t','2')} + b ${dydt} + c y = 0 \\]`,
						`substitute \\( y = e^{\\lambda t} \\)`,
						`\\[ a ${dd('','t','2')} e^{\\lambda t} + b ${ddt} e^{\\lambda t} + c e^{\\lambda t} = 0 \\]`,
						`\\[ a \\lambda^2 e^{\\lambda t} + b \\lambda e^{\\lambda t} + c e^{\\lambda t} = 0 \\]`,
						`divide by \\( e^{\\lambda t} \\)`,
					]},
					`\\[ a \\lambda^2 + b \\lambda + c = 0 \\]`,
				],
			},
			orderReduction: {
				title: "Order reduction to a system of 2 first-order linear homogeneous equations with constant coefficients",
				form: true,
				content: [
					`\\[ \\left\\{ \\begin{aligned}`+
						dd(`y`)+` &= v \\\\`+
						dd(`v`)+` &= - \\frac c a y - \\frac b a v`+
					`\\end{aligned} \\right. \\]`,
				],
			},
		},
	},
	o2_vanDerPol: {
		parents: {
			o2_autonomous: true,
		},
		name: "Van der Pol",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Van_der_Pol_oscillator'>Van der Pol</a>",
		importance: 3,
		equation: `${dd('y','t','2')} = \\mu(1-y^2)${dydt} - y`,
		traits: {},
	},
	o2_unforcedDuffing: {
		parents: {
			o2_autonomous: true,
		},
		name: "unforced Duffing",
		htmlName: "unforced <a href='https://en.wikipedia.org/wiki/Duffing_equation'>Duffing</a>",
		importance: 3,
		equation: `${dd('y','t','2')} = - \\delta ${dydt} - \\alpha y - \\beta y^3`,
		traits: {},
	},
	o2_harmonicOscillator: {
		parents: {
			o2_autonomous: true,
		},
		name: "harmonic oscillator",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator'>harmonic oscillator</a>",
		importance: 3,
		equation: `${dd('y','t','2')} = - \\frac{b}{m} ${dydt} - \\frac{k}{m} y`,
		equationNotes: [
			`\\(m\\) is the mass`,
			`\\(b\\) is the viscous damping coefficient`,
			`\\(k\\) is the spring constant`,
		],
		traits: {},
	},
	o2_simpleHarmonicOscillator: {
		parents: {
			o2_harmonicOscillator: true,
		},
		name: "simple harmonic oscillator",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Simple_harmonic_oscillator'>simple harmonic oscillator</a>",
		importance: 3,
		equation: `${dd('y','t','2')} = - \\frac{k}{m} y`,
		equationNotes: [
			`\\(m\\) is the mass`,
			`\\(k\\) is the spring constant`,
		],
		traits: {},
	},
}

module.exports={traits,classes}
