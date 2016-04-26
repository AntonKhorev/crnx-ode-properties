'use strict'

const dd=(a,b)=>`\\frac{\\mathrm{d}${a}}{\\mathrm{d}${b}}`
const dydt=dd('y','t')
const ddt=dd('','t')
const int=(fx,x)=>`\\int\\!${fx}\\,\\mathrm{d}${x}`
const sint=(fx,x)=>`\\int\\!${fx}\\mathrm{d}${x}`
const eqsol=(name)=>`<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>${name}</a>`

module.exports={
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
				['id','general'],
				['title',[
					"Solutions",
				]],
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
			[
				['id','equilibrium'],
				['title',[
					eqsol("Equilibrium solutions"),
				]],
				['form'],
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
					"\\( y_p(t) \\) is a solution \\( \\Rightarrow \\) \\( y_p(t+C) \\) is a solution",
				]],
			],
		],
		solutions: [
			[
				['id','general'],
				['override',[
					'general',
				]],
				['title',[
					"Solutions",
				]],
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
			[
				['id','equilibrium'],
				['override',[
					'equilibrium',
				]],
				['title',[
					eqsol("Equilibrium solutions"),
				]],
				['form'],
				['main',[
					`Solve \\( f(y) = 0 \\) for constant \\( y \\).`,
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
		equation: `${dydt} = a(t) \\cdot y + b(t) \\cdot y^n`,
		equationNote: `\\( n ≠ 1 \\); usually it's also defined that additionally \\( n ≠ 0 \\), `+
			`but we ignore this requirement here`,
		solutions: [
			[
				['id','general'],
				['title',[
					"Solutions",
				]],
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
			[
				['id','equilibrium'],
				['override',[
					'equilibrium',
				]],
				['title',[
					eqsol("Equilibrium solution"),
				]],
				['form'],
				['main',[
					`if \\( n>0 \\), there's an equilibrium solution`,
					`\\[ y(t) = 0 \\]`,
				]],
			],
		],
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
				['form'],
				['main',[
					`If \\( y_p(t) \\) is a solution of the original equation \\( ${dydt} = a(t) \\cdot y + b(t) \\)`,
					`and \\( y_h(t) \\) is a solution of its associated homogeneous equation \\( ${dydt} = a(t) \\cdot y \\),`,
					`then \\( K y_h(t) + y_p(t) \\) is a solution of the original equation.`,
					`If additionally \\( y_h(t) \\neq 0 \\), then \\( K y_h(t) + y_p(t) \\) is a general solution.`,
				]],
			],
			[
				['id','homodiff'],
				['form'],
				['main',[
					`If \\( y_p(t) \\) and \\( y_q(t) \\) are solutions,`,
					`then \\( y_p(t) - y_q(t) \\) is a solution of the associated homogeneous equation \\( ${dydt} = a(t) \\cdot y \\).`,
				]],
			],
		],
		solutions: [
			[
				['id','general'],
				['override',[
					'general',
				]],
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
			[
				['override',[
					'equilibrium',
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
				['id','linearity'],
				['override',[
					'linearity',
					'homodiff',
				]],
				['title',[
					"Linearity",
				]],
				['main',[
					`If \\( y_h(t) \\) is a solution, then \\( K y_h(t) \\) is a solution.`,
					`If additionally \\( y_h(t) \\neq 0 \\), then \\( K y_h(t) \\) is a general solution.`,
				]],
			],
		],
		solutions: [
			[
				['id','general'],
				['override',[
					'general',
				]],
				['title',[
					"Solutions",
				]],
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
			[
				['id','equilibrium'],
				['override',[
					'equilibrium',
				]],
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
				['id','linearity'],
				['override',[
					'linearity',
					'homodiff',
				]],
				['main',[
					"\\( y_p(t) \\) is a solution \\( \\Rightarrow \\) \\( y_p(t) + C \\) is a solution",
				]],
			],
		],
		solutions: [
			[
				['id','general'],
				['override',[
					'general',
				]],
				['title',[
					"Solutions",
				]],
				['form'],
				['detail',[
					`\\[ ${dydt} = f(t) \\]`,
					`\\[ ${int(`${dydt}`,'t')} = ${int('f(t)','t')} + C \\]`,
				]],
				['main',[
					`\\[ y = ${int('f(t)','t')} + C \\]`,
				]],
			],
			[
				['override',[
					'equilibrium',
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
				['id','general'],
				['override',[
					'general',
				]],
				['title',[
					"Solutions",
				]],
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
			[ // TODO could have inherited from linear homogeneous, but have to override autonomous
				['id','equilibrium'],
				['override',[
					'equilibrium',
				]],
				['title',[
					eqsol("Equilibrium solution"),
				]],
				['main',[
					`\\[ y(t) = 0 \\]`
				]],
			],
		],
	},
	logisticGrowth: {
		parents: {
			autonomous: true,
			bernoulli: true,
		},
		name: "logistic growth",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Logistic_function#In_ecology:_modeling_population_growth'>logistic growth</a>",
		importance: 2,
		equation: `${dydt} = r \\cdot y \\cdot \\left(1 - \\frac{y}{k}\\right)`,
		equationNote: `\\( k \\) is the <a href='https://en.wikipedia.org/wiki/Carrying_capacity'>carrying capacity</a>`,
		solutions: [
			[
				['id','equilibrium'],
				['override',[
					'equilibrium',
				]],
				['title',[
					eqsol("Equilibrium solutions"),
				]],
				['form'],
				['main',[
					`\\[ y(t) = 0 \\]`,
					`\\[ y(t) = k \\]`,
				]],
			],
		],
	},
}
