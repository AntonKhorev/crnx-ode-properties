'use strict'

const dd=(a,b)=>`\\frac{\\mathrm{d}${a}}{\\mathrm{d}${b}}`
const dydt=dd('y','t')
const ddt=dd('','t')
const int=(fx,x)=>`\\int\\!${fx}\\,\\mathrm{d}${x}`
const sint=(fx,x)=>`\\int\\!${fx}\\mathrm{d}${x}`
const eqsol=(name)=>`<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>${name}</a>`

module.exports={
	// TODO require all functions to be continuous on the domain?
	root: {
		parents: {},
		name: "first-order",
		importance: 0,
		equation: `${dydt} = f(t,y)`,
		properties: [
			[
				['main',[
					"Can test if \\(y_p(t)\\) is a solution by substituting \\(y = y_p\\) into the equation.",
				]],
			],
		]
	},
	separable: {
		parents: {
			root: true,
		},
		name: "first-order separable",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Separation_of_variables#Ordinary_differential_equations_.28ODE.29'>separable</a>",
		importance: 1,
		equation: `${dydt} = f_1(t) \\cdot f_2(y)`,
		solutions: [
			[
				['title',[
					"Solutions",
				]],
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
			[
				['title',[
					eqsol("Equilibrium solutions"),
				]],
				['main',[
					`Solve \\( f_2(y) = 0 \\) for constant \\( y \\).`,
				]],
				//`domain is not necessary \\( -\\infty &lt; t &lt; +\\infty \\)`
			],
		],
	},
	autonomous: {
		parents: {
			separable: true,
		},
		name: "first-order autonomous",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Autonomous_system_%28mathematics%29'>autonomous</a>",
		importance: 1,
		equation: `${dydt} = f(y)`,
		properties: [
			[
				['main',[
					"horizontal <a href='https://en.wikipedia.org/wiki/Isocline'>isoclines</a>",
				]],
			],
			[
				['main',[
					"\\( y_p(t )\\) is a solution \\( \\Rightarrow \\) \\( y_p(t+C) \\) is a solution",
				]],
			],
		],
		solutions: [
			[
				['title',[
					"Solutions",
				]],
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
			[
				['title',[
					eqsol("Equilibrium solutions"),
				]],
				['main',[
					`Solve \\( f(y) = 0 \\) for constant \\( y \\)`,
				]],
				//`domain is \\( -\\infty &lt; t &lt; +\\infty \\)` // only if f(y) is continuous
			],
		],
	},
	bernoulli: {
		parents: {
			root: true,
		},
		name: "Bernoulli",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Bernoulli_differential_equation'>Bernoulli</a>",
		importance: 2,
		equation: `${dydt} + p(t) \\cdot y = q(t) \\cdot y^n`, // TODO we include n=0 and 1 here, others may exclude
	},
	linear: {
		parents: {
			bernoulli: true,
		},
		name: "first-order linear",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a>",
		importance: 1,
		equation: `${dydt} = a(t) \\cdot y + b(t)`,
		properties: [
			[
				['id','linearity'],
				['title',[
					"Extended linearity",
				]],
				['main',[
					`If \\( y_p(t) \\) is a solution of the original equation \\( ${dydt} = a(t) \\cdot y + b(t) \\)`,
					`and \\( y_h(t) \\) is a solution of its associated homogeneous equation \\( ${dydt} = a(t) \\cdot y \\),`,
					`then \\( k \\cdot y_h(t) + y_p(t) \\) is a solution of the original equation.`,
					`If additionally \\( y_h(t) \\neq 0 \\), then \\( k \\cdot y_h(t) + y_p(t) \\) is a general solution.`,
				]],
			],
			[
				['main',[
					`If \\( y_p(t) \\) and \\( y_q(t) \\) are solutions,`,
					`then \\( y_p(t) - y_q(t) \\) is a solution of the associated homogeneous equation \\( ${dydt} = a(t) \\cdot y \\).`,
				]],
			],
		],
		solutions: [
			[
				['title',[
					"Solutions found with method of <a href='https://en.wikipedia.org/wiki/Integrating_factor'>integrating factors</a>",
				]],
				['main',[
					`Rewrite the equation as \\[ ${dydt} + g(t) \\cdot y = b(t) \\]`,
					`Introduce the integrating factor`,
					`\\[ \\mu(t) = e^{${sint('g(t)','t')}} \\]`,
					`Multiply the equation by \\( \\mu(t) \\)`,
				]],
				['detail',[
					`\\[ \\mu(t) ${dydt} + \\mu(t) g(t) y = \\mu(t) b(t) \\]`,
					`\\[ \\mu(t) ${dydt} + e^{${sint('g(t)','t')}} g(t) y = \\mu(t) b(t) \\]`,
					`\\[ \\mu(t) ${dydt} + ${ddt}(e^{${sint('g(t)','t')}}) y = \\mu(t) b(t) \\]`,
					`\\[ \\mu(t) ${dydt} + ${ddt}(\\mu(t)) y = \\mu(t) b(t) \\]`,
					`\\[ ${ddt}(\\mu(t) y) = \\mu(t) b(t) \\]`,
				]],
				['main',[
					`Integrate the equation multiplied by \\( \\mu(t) \\)`,
					`\\[ \\mu(t) y = ${int('\\mu(t) b(t)','t')} + C \\]`,
				]],
			],
		],
	},
	linearHomogeneous: {
		parents: {
			separable: true,
			linear: true,
		},
		name: "first-order linear homogeneous",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a> <a href='https://en.wikipedia.org/wiki/Homogeneous_differential_equation#Homogeneous_linear_differential_equations'>homogeneous</a>",
		importance: 1,
		equation: `${dydt} = a(t) \\cdot y`,
		properties: [
			[
				['override','linearity'],
				['title',[
					"Linearity",
				]],
				['main',[
					`If \\( y_h(t) \\) is a solution, then \\( k \\cdot y_h(t) \\) is a solution.`,
					`If additionally \\( y_h(t) \\neq 0 \\), then \\( k \\cdot y_h(t) \\) is a general solution.`,
				]],
			],
		],
		solutions: [
			[
				['title',[
					"Solutions",
				]],
				['detail',[
					`\\[ ${dydt} = a(t) \\cdot y \\]`,
					`\\[ \\frac{1}{y} \\cdot ${dydt} = a(t) \\]`,
					`\\[ ${int(`\\frac{1}{y} ${dydt}`,'t')} = ${int('a(t)','t')} + C \\]`,
					`\\[ ${int(`\\frac{1}{y}`,'y')} = ${int('a(t)','t')} + C \\]`,
					`\\[ \\ln|y| = ${int('a(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ y = k \\cdot e^{${sint('a(t)','t')}} \\]`,
				]],
				['note',[
					`includes ${eqsol("equilibrium solution")} when \\( k = 0 \\)`,
				]],
			],
			[
				['title',[
					eqsol("Equilibrium solution"),
				]],
				['main',[
					`\\[ y(t) = 0 \\]`
				]],
			],
		],
	},
	separableInT: {
		parents: {
			separable: true,
			linear: true,
		},
		name: "first-order separable in independent variable",
		htmlName: "first-order <a href='https://en.wikipedia.org/wiki/Separation_of_variables#Ordinary_differential_equations_.28ODE.29'>separable</a> in \\(t\\)",
		importance: 2,
		equation: `${dydt} = f(t)`,
		properties: [
			[
				['main',[
					"vertical <a href='https://en.wikipedia.org/wiki/Isocline'>isoclines</a>",
				]],
			],
			[
				['main',[
					"\\( y_p(t) \\) is a solution \\( \\Rightarrow \\) \\( y_p(t) + C \\) is a solution",
				]],
			],
		],
		solutions: [
			[
				['title',[
					"Solutions",
				]],
				['detail',[
					`\\[ ${dydt} = f(t) \\]`,
					`\\[ ${int(`${dydt}`,'t')} = ${int('f(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ y = ${int('f(t)','t')} + C \\]`,
				]],
			],
		],
	},
	expGrowth: {
		parents: {
			autonomous: true,
			linearHomogeneous: true,
		},
		name: "exponential growth",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Exponential_growth#Differential_equation'>exponential growth</a>",
		importance: 2,
		equation: `${dydt} = k \\cdot y`,
		solutions: [
			[
				['title',[
					"Solution",
				]],
				['main',[
					`\\[ y(t) = y(0) e^{kt} \\]`,
				]],
			],
		],
	},
	logisticGrowth: {
		parents: {
			autonomous: true,
		},
		name: "logistic growth",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Logistic_function#In_ecology:_modeling_population_growth'>logistic growth</a>",
		importance: 2,
		equation: `${dydt} = k \\cdot y \\cdot \\left(1 - \\frac{y}{N}\\right)`,
	},
}
