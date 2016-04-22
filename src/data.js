'use strict'

const dd=(a,b)=>`\\frac{\\mathrm{d}${a}}{\\mathrm{d}${b}}`
const dydt=dd('y','t')
const int=(fx,x)=>`\\int\\!${fx}\\,\\mathrm{d}${x}`
const eqsol=(name)=>`<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>${name}</a>`

module.exports={
	root: {
		parents: {},
		name: "first-order",
		equation: `${dydt} = f(t,y)`,
		properties: [
			"can test if \\(y_p(t)\\) is a solution by substituting \\(y = y_p\\) into the equation",
		]
	},
	separable: {
		parents: {
			root: true,
		},
		name: "first-order separable",
		equation: `${dydt} = f_1(t) \\cdot f_2(y)`,
		solutions: [
			`<em>Solutions</em>:`+
				`\\[ ${dydt} = f_1(t) \\cdot f_2(y) \\]`+
				`\\[ \\frac{1}{f_2(y)} \\cdot ${dydt} = f_1(t) \\]`+
				`\\[ ${int(`\\frac{1}{f_2(y)} \\cdot ${dydt}`,'t')} = ${int('f_1(t)','t')} \\]`+
				`\\[ ${int(`\\frac{1}{f_2(y)}`,'y')} = ${int('f_1(t)','t')} \\]`+
				`this may or may not include ${eqsol("equilibrium solutions")}`,
			"<em>"+eqsol("Equilibrium solutions")+":</em><br>"+
				`Solve \\( f_2(y) = 0 \\) for constant \\( y \\);`+"<br>"+
				`domain is not necessary \\( -\\infty &lt; t &lt; +\\infty \\)`
		],
	},
	autonomous: {
		parents: {
			separable: true,
		},
		name: "first-order autonomous",
		equation: `${dydt} = f(y)`,
		properties: [
			"horizontal <a href='https://en.wikipedia.org/wiki/Isocline'>isoclines</a>",
			"\\( y_p(t )\\) is a solution \\( \\Rightarrow \\) \\( y_p(t+C) \\) is a solution",
		],
		solutions: [
			`<em>Solutions</em>:`+
				`\\[ ${dydt} = f(y) \\]`+
				`\\[ \\frac{1}{f(y)} \\cdot ${dydt} = 1 \\]`+
				`\\[ ${int(`\\frac{1}{f(y)} \\cdot ${dydt}`,'t')} = ${int('1','t')} \\]`+
				`\\[ ${int(`\\frac{1}{f(y)}`,'y')} = t \\]`+
				`this may or may not include ${eqsol("equilibrium solutions")}`,
			"<em>"+eqsol("Equilibrium solutions")+":</em><br>"+
				`Solve \\( f(y) = 0 \\) for constant \\( y \\);`+"<br>"+
				`domain is \\( -\\infty &lt; t &lt; +\\infty \\)`
		],
	},
	linear: {
		parents: {
			root: true,
		},
		name: "first-order linear",
		equation: `${dydt} = a(t) \\cdot y + b(t)`,
		properties: [
			`<em>Extended linearity</em>:<br>`+
				`If \\( y_p(t) \\) is a solution of the original equation \\( ${dydt} = a(t) \\cdot y + b(t) \\)<br>`+
				`and \\( y_h(t) \\) is a solution of its associated homogeneous equation \\( ${dydt} = a(t) \\cdot y \\),<br>`+
				`then \\( k \\cdot y_h(t) + y_p(t) \\) is a solution of the original equation.<br>`+
				`If additionally \\( y_h(t) \\neq 0 \\), then \\( k \\cdot y_h(t) + y_p(t) \\) is a general solution.`,
			`If \\( y_p(t) \\) and \\( y_q(t) \\) are solutions,<br>`+
				`then \\( y_p(t) - y_q(t) \\) is a solution of the associated homogeneous equation \\( ${dydt} = a(t) \\cdot y \\).`,
		],
	},
	linearHomogeneous: {
		parents: {
			separable: true,
			linear: true,
		},
		name: "first-order linear homogeneous",
		equation: `${dydt} = a(t) \\cdot y`,
		properties: [
			`<em>Linearity</em>:<br>`+
				`If \\( y_h(t) \\) is a solution, then \\( k \\cdot y_h(t) \\) is a solution.<br>`+
				`If additionally \\( y_h(t) \\neq 0 \\), then \\( k \\cdot y_h(t) \\) is a general solution.`,
		],
		solutions: [
			"<em>"+eqsol("Equilibrium solution")+":</em>"+
				`\\[ y(t) = 0 \\]` // +
				// `domain is \\( -\\infty &lt; t &lt; +\\infty \\)` // why?
		],
	},
	separableInT: {
		parents: {
			separable: true,
			linear: true,
		},
		name: "first-order separable in independent variable",
		equation: `${dydt} = f(t)`,
		properties: [
			"vertical <a href='https://en.wikipedia.org/wiki/Isocline'>isoclines</a>",
			"\\( y_p(t) \\) is a solution \\( \\Rightarrow \\) \\( y_p(t) + C \\) is a solution",
		],
		solutions: [
			`<em>Solutions</em>:`+
				`\\[ ${dydt} = f(t) \\]`+
				`\\[ ${int(`${dydt}`,'t')} = ${int('f(t)','t')} \\]`+
				`\\[ y = ${int('f(t)','t')} \\]`,
		],
	},
	expGrowth: {
		parents: {
			autonomous: true,
			linearHomogeneous: true,
		},
		name: "exponential growth",
		equation: `${dydt} = k \\cdot y`,
		solutions: [
			`<em>Solution</em>:`+
				`\\[ y(t) = y(0) e^{kt} \\]`,
		],
	},
}
