'use strict'

const dydt="\\frac{\\mathrm{d}y}{\\mathrm{d}t}"

module.exports={
	root: {
		parents: {},
		name: "first-order",
		equation: `${dydt} = f(t,y)`,
		properties: [
			"can test if \\(y_1(t)\\) is a solution by substituting \\(y = y_1\\) into the equation",
		]
	},
	separable: {
		parents: {
			root: true,
		},
		name: "first-order separable",
		equation: `${dydt} = f_1(t) \\cdot f_2(y)`,
	},
	autonomous: {
		parents: {
			separable: true,
		},
		name: "first-order autonomous",
		equation: `${dydt} = f(y)`,
		properties: [
			"horizontal <a href='https://en.wikipedia.org/wiki/Isocline'>isoclines</a>",
			"\\(y_1(t)\\) is a solution \\(\\Rightarrow\\) \\(y_1(t+C)\\) is a solution",
		],
	},
	linear: {
		parents: {
			root: true,
		},
		name: "first-order linear",
		equation: `${dydt} = a(t) y + b(t)`,
	},
	linearHomogeneous: {
		parents: {
			separable: true,
			linear: true,
		},
		name: "first-order linear homogeneous",
		equation: `${dydt} = a(t) y`,
		properties: [
			"\\(y_h(t) = 0\\) is an <a href='https://en.wikipedia.org/wiki/Equilibrium_point'>equilibrium solution</a>",
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
			"\\(y_1(t)\\) is a solution \\(\\Rightarrow\\) \\(y_1(t) + C\\) is a solution",
		],
	},
}
