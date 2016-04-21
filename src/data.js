'use strict'

const dydt="\\frac{\\mathrm{d}y}{\\mathrm{d}t}"

module.exports={
	root: {
		parents: {},
		name: "first-order",
		equation: `${dydt} = f(t,y)`,
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
	},
	separableInT: {
		parents: {
			separable: true,
			linear: true,
		},
		name: "first-order separable in independent variable",
		equation: `${dydt} = f(t)`,
	},
}
