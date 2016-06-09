'use strict'

const dd=(a,b,n)=>{
	if (n===undefined) n=1
	if (n==1) {
		return `\\frac{\\mathrm{d}${a}}{\\mathrm{d}${b}}`
	} else {
		return `\\frac{\\mathrm{d}^{${n}}${a}}{\\mathrm{d}${b}^{${n}}}`
	}
}
const dydt=dd('y','t')
const ddt=dd('','t')
const int=(fx,x)=>`\\int\\!${fx}\\,\\mathrm{d}${x}`
const sint=(fx,x)=>`\\int\\!${fx}\\mathrm{d}${x}`
const eqsol=(name)=>`<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>${name}</a>`

const traits=[
	['entity',[
		['associatedHomogeneousEquation'],
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
	['solutionMethod',[
		['generalSolutionMethod'],
		['equilibriumSolutionMethod'],
		['testSolutionMethod'],
	]],
]

// trait entries:
//	title = redefine title; has to be first
//	main
//	detail
//	note
//	form = have to present the equation in which this trait was defined; put after title
//	close = children don't need to inherit this trait; display it only if parents have it displayed; put at end
//	compare = show only if other classes have this property without compare entry; put at end
const classes={
	on: {
		parents: {},
		name: "nth-order",
		htmlName: "<em>n</em>th-order",
		importance: 2,
		equation: `${dd('y','t','n')} = F(t,y,${dydt},...,${dd('y','t','n-1')})`,
		traits: {
			testSolutionMethod: [
				['main',[
					"Can test if \\( y_p \\) is a solution by substituting \\( y = y_p \\) into the equation.",
				]],
			],
		}
	},
	o1: {
		parents: {
			on: true,
		},
		name: "first-order",
		importance: 0,
		equation: `${dydt} = f(t,y)`,
		traits: {},
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
			generalSolutionMethod: [
				['form'],
				['detail',[
					`\\[ ${dydt} = f_1(t) \\cdot f_2(y) \\]`,
					`\\[ \\frac{1}{f_2(y)} \\cdot ${dydt} = f_1(t) \\]`,
					`\\[ ${int(`\\frac{1}{f_2(y)} ${dydt}`,'t')} = ${int('f_1(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ ${int(`\\frac{1}{f_2(y)}`,'y')} = ${int('f_1(t)','t')} + C \\]`,
				]],
				['note',[
					`this may or may not include ${eqsol("equilibrium solutions")}`,
				]],
			],
			equilibriumSolutionMethod: [
				['form'],
				['main',[
					`solve \\( f_2(y) = 0 \\) for constant \\( y \\)`,
				]],
				//`domain is not necessary \\( -\\infty &lt; t &lt; +\\infty \\)`
			],
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
			isoclineProperty: [
				['main',[
					"isoclines are horizontal",
				]],
			],
			shiftSolutionRelation: [
				['main',[
					"If \\( y_p(t) \\) is a solution, then \\( y_p(t+C) \\) is a solution",
				]],
			],
			generalSolutionMethod: [
				['form'],
				['detail',[
					`\\[ ${dydt} = f(y) \\]`,
					`\\[ \\frac{1}{f(y)} \\cdot ${dydt} = 1 \\]`,
					`\\[ ${int(`\\frac{1}{f(y)} ${dydt}`,'t')} = ${int('1','t')} + C \\]`,
				]],
				['main',[
					`\\[ ${int(`\\frac{1}{f(y)}`,'y')} = t + C \\]`,
				]],
				['note',[
					`this may or may not include ${eqsol("equilibrium solutions")}`,
				]],
			],
			equilibriumSolutionMethod: [
				['form'],
				['main',[
					`solve \\( f(y) = 0 \\) for constant \\( y \\)`,
				]],
				//`domain is \\( -\\infty &lt; t &lt; +\\infty \\)` // only if f(y) is continuous
			],
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
			`\\( n ≠ 1 \\)`,
			`usually it's also defined that additionally \\( n ≠ 0 \\), but we ignore this requirement here`,
		],
		traits: {
			generalSolutionMethod: [
				['form'],
				['detail',[
					`\\[ ${dydt} = a(t) \\cdot y + b(t) \\cdot y^n \\]`,
					`multiply the equation by \\( \\frac{1-n}{y^n} \\)`,
					`\\[ \\frac{1-n}{y^n} ${dydt} = \\cdots \\]`,
					`\\[ \\cdots = \\frac{(1-n) a(t)}{y^{n-1}} + (1-n) b(t) \\]`,
					`introduce a new variable`,
					`\\[ z = \\frac{1}{y^{n-1}} \\]`,
					`\\[ ${dd('z','t')} = ${dd('z','y')} ${dydt} = \\frac{1-n}{y^n} ${dydt} \\]`,
					`substitute \\( z \\) and \\( ${dd('z','t')} \\) into the equation`,
					`\\[ ${dd('z','t')} = (1-n) a(t) z + (1-n) b(t) \\]`,
					`solve this equation as a linear equation in \\( z \\), then return to the original variable \\( y \\)`,
					`\\[ \\mu(t) z = (1-n) ${int('\\mu(t) b(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ \\mu(t) = e^{(n-1)${sint('a(t)','t')}} \\]`,
					`\\[ \\frac{\\mu(t)}{y^{n-1}} = (1-n) ${int('\\mu(t) b(t)','t')} + C \\]`,
				]],
				['note',[
					`this may or may not include ${eqsol("equilibrium solutions")}`,
				]],
			],
			equilibriumSolutionMethod: [
				['form'],
				['main',[
					`if \\( n>0 \\), there's an equilibrium solution \\( y(t) = 0 \\)`,
				]],
			],
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
			associatedHomogeneousEquation: [
				['form'],
				['main',[
					`\\( ${dydt} = a(t) \\cdot y \\)`,
				]],
			],
			solutionSpaceBasis: [
				['main',[
					`If \\( y_p \\) is a solution`,
					`and \\( y_h \\) is a nonzero solution of the associated homogeneous equation`,
					`then \\( K y_h + y_p \\) is a general solution.`,
				]],
			],
			homogeneitySolutionRelation: [
				['main',[
					`If \\( y_0 \\) and \\( y_1 \\) are solutions,`,
					`then \\( K_1 y_1 + (1 - K_1) y_0 \\) is a solution.`,
				]],
				['compare'],
			],
			additivitySolutionRelation: [
				['main',[
					`If \\( y_0 \\), \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( y_1 + y_2 - y_0 \\) is a solution.`,
				]],
				['compare'],
			],
			twoLinearCombinationSolutionRelation: [
				['main',[
					`If \\( y_0 \\), \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( K_1 y_1 + K_2 y_2 + (1 - K_1 - K_2) y_0 \\) is a solution.`,
				]],
				['compare'],
			],
			nLinearCombinationSolutionRelation: [
				['main',[
					`If \\( y_0 \\), \\( y_1 \\), \\( y_2 \\), ..., \\( y_m \\) are solutions,`,
					`then \\( \\sum\\limits_{i=1}^m K_i y_i + (1 - \\sum\\limits_{i=1}^m K_i) y_0 \\) is a solution.`,
				]],
				['compare'],
			],
			twoAffineCombinationSolutionRelation: [
				['main',[
					`If \\( y_1 \\), \\( y_2 \\) are solutions`,
					`and \\( K_1 + K_2 = 1 \\)`,
					`then \\( K_1 y_1 + K_2 y_2 \\) is a solution.`,
				]],
			],
			nAffineCombinationSolutionRelation: [
				['main',[
					`If \\( y_1 \\), \\( y_2 \\), ..., \\( y_m \\) are solutions`,
					`and \\( \\sum\\limits_{i=1}^m K_i = 1 \\)`,
					`then \\( \\sum\\limits_{i=1}^m K_i y_i \\) is a solution.`,
				]],
			],
			associatedSolutionRelation: [
				['main',[
					`If \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( y_1 - y_2 \\) is a solution of the associated homogeneous equation.`,
				]],
			],
			generalSolutionMethod: [
				['title',[
					"Solutions found with method of <a href='https://en.wikipedia.org/wiki/Integrating_factor'>integrating factors</a>",
				]],
				['form'],
				['detail',[
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
				]],
				['main',[
					`\\[ \\mu(t) = e^{-${sint('a(t)','t')}} \\]`,
					`\\[ \\mu(t) y = ${int('\\mu(t) b(t)','t')} + C \\]`,
				]],
			],
			equilibriumSolutionMethod: [
				['note',[
					`Can't find equilibrium solution like in Bernoulli equation because \\( n = 0 \\).`,
				]],
				['close'],
			],
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
			associatedHomogeneousEquation: [
				['note',[
					`The equation is associated with itself.`
				]],
				['close'],
			],
			solutionSpaceBasis: [
				['main',[
					`If \\( y_h \\) is a nonzero solution,`,
					`then \\( K y_h \\) is a general solution.`,
				]],
			],
			homogeneitySolutionRelation: [
				['main',[
					`If \\( y_1 \\) is a solution,`,
					`then \\( K_1 y_1 \\) is a solution.`,
				]],
			],
			additivitySolutionRelation: [
				['main',[
					`If \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( y_1 + y_2 \\) is a solution.`,
				]],
			],
			twoLinearCombinationSolutionRelation: [
				['main',[
					`If \\( y_1 \\) and \\( y_2 \\) are solutions,`,
					`then \\( K_1 y_1 + K_2 y_2 \\) is a solution.`,
				]],
			],
			nLinearCombinationSolutionRelation: [
				['main',[
					`If \\( y_1 \\), \\( y_2 \\), ..., \\( y_m \\) are solutions,`,
					`then \\( \\sum\\limits_{i=1}^m K_i y_i \\) is a solution.`,
				]],
			],
			twoAffineCombinationSolutionRelation: [
				['note',[
					`This is a special case of a linear combination.`,
				]],
				['close'],
			],
			nAffineCombinationSolutionRelation: [
				['note',[
					`This is a special case of a linear combination.`,
				]],
				['close'],
			],
			associatedSolutionRelation: [
				['close'],
			],
			generalSolutionMethod: [
				['form'],
				['detail',[
					`\\[ ${dydt} = a(t) \\cdot y \\]`,
					`\\[ \\frac{1}{y} \\cdot ${dydt} = a(t) \\]`,
					`\\[ ${int(`\\frac{1}{y} ${dydt}`,'t')} = ${int('a(t)','t')} + C \\]`,
					`\\[ ${int(`\\frac{1}{y}`,'y')} = ${int('a(t)','t')} + C \\]`,
					`\\[ \\ln|y| = ${int('a(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ y = K \\cdot e^{${sint('a(t)','t')}} \\]`,
				]],
				['note',[
					`includes ${eqsol("equilibrium solution")} when \\( K = 0 \\)`,
				]],
			],
			equilibriumSolutionMethod: [
				['main',[
					`\\[ y = 0 \\]`
				]],
			],
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
			associatedHomogeneousEquation: [
				['main',[
					`\\( ${dydt} = 0 \\)`,
				]],
			],
			isoclineProperty: [
				['main',[
					"isoclines are vertical",
				]],
			],
			solutionSpaceBasis: [ // also shiftSolutionRelation
				['main',[
					`If \\( y_p \\) is a solution`,
					`then \\( y_p + C \\) is a general solution.`,
				]],
			],
			associatedSolutionRelation: [
				['main',[
					`\\( y = C \\) is a solution of the associated homogeneous equation.`,
				]],
			],
			generalSolutionMethod: [
				['form'],
				['detail',[
					`\\[ ${dydt} = f(t) \\]`,
					`\\[ ${int(`${dydt}`,'t')} = ${int('f(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ y = ${int('f(t)','t')} + C \\]`,
				]],
			],
			equilibriumSolutionMethod: [
				['note',[
					`Can't find equilibrium solution like in separable equation because \\( f_2(y) = 1 \\).`,
				]],
				['close'],
			],
		},
	},
	o1_expGrowth: {
		parents: {
			o1_autonomous: true,
			o1_linearHomogeneous: true,
		},
		name: "exponential growth",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Exponential_growth#Differential_equation'>exponential growth</a>",
		importance: 2,
		equation: `${dydt} = k \\cdot y`,
		traits: {
			generalSolutionMethod: [
				['form'],
				['detail',[
					`\\[ ${dydt} = k \\cdot y \\]`,
					`\\[ \\frac{1}{y} \\cdot ${dydt} = k \\]`,
					`\\[ ${int(`\\frac{1}{y} ${dydt}`,'t')} = ${int('k','t')} + C \\]`,
					`\\[ ${int(`\\frac{1}{y}`,'y')} = ${int('k','t')} + C \\]`,
					`\\[ \\ln|y| = kt + C \\]`,
					`\\[ y(t) = C_1 e^{kt} \\]`,
					`\\[ y(0) = C_1 e^0 \\]`,
					`\\[ C_1 = y(0) \\]`,
				]],
				['main',[
					`\\[ y(t) = y(0) e^{kt} \\]`,
				]],
				['note',[
					`includes ${eqsol("equilibrium solution")} when \\( y(0) = 0 \\)`,
				]],
			],
			equilibriumSolutionMethod: [ // TODO could have inherited from linear homogeneous, but have to override autonomous
				['main',[
					`\\[ y = 0 \\]`
				]],
			],
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
			equilibriumSolutionMethod: [
				['form'],
				['main',[
					`\\[ y = 0 \\]`,
					`\\[ y = k \\]`,
				]],
			],
		},
	},
	o2: {
		parents: {
			on: true,
		},
		name: "second-order",
		importance: 2,
		equation: `${dd('y','t','2')} = F(t,y,${dydt})`,
		traits: {},
	},
	o2_autonomous: {
		parents: {
			o2: true,
		},
		name: "second-order autonomous",
		importance: 2,
		equation: `${dd('y','t','2')} = F(y,${dydt})`,
		traits: {},
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
