'use strict'

module.exports=(nt)=>({
	o2: {
		parents: {
			on: true,
		},
		name: "second-order",
		importance: 2,
		equation: `${nt.dd(nt.x,'t',2)} = f(t,${nt.x},${nt.dxdt})`,
		traits: {
			orderReduction: {
				title: "Order reduction to a system of 2 first-order equations",
				form: true,
				content: [
					`transform to a system of 2 first-order equations`,
					`\\[ \\left\\{ \\begin{aligned}`+
						`${nt.dd(nt.x)} &= ${nt.y} \\\\`+
						`${nt.dd(nt.y)} &= f(t,${nt.x},${nt.y})`+
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
		equation: `${nt.dd(nt.x,'t',2)} = f(${nt.x},${nt.dxdt})`,
		traits: {
			orderReduction: {
				title: "Order reduction to a system of 2 first-order autonomous equations",
				form: true,
				content: [
					`\\[ \\left\\{ \\begin{aligned}`+
						`${nt.dd(nt.x)} &= ${nt.y} \\\\`+
						`${nt.dd(nt.y)} &= f(${nt.x},${nt.y})`+
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
		equation: `${nt.dd(nt.x,'t',2)} = - \\frac b a ${nt.dxdt} - \\frac c a ${nt.x}`,
		equationNotes: [
			`usually written as \\( a ${nt.dd(nt.x,'t',2)} + b ${nt.dxdt} + c ${nt.x} = 0 \\)`,
		],
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					{type:'derivetion',content:[
						`\\[ a ${nt.dd(nt.x,'t',2)} + b ${nt.dxdt} + c ${nt.x} = 0 \\]`,
						`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
						`\\[ a ${nt.dd('','t',2)} e^{\\lambda t} + b ${nt.ddt} e^{\\lambda t} + c e^{\\lambda t} = 0 \\]`,
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
						`${nt.dd(nt.x)} &= ${nt.y} \\\\`+
						`${nt.dd(nt.y)} &= - \\frac c a ${nt.x} - \\frac b a ${nt.y}`+
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
		equation: `${nt.dd(nt.x,'t',2)} = \\mu(1-${nt.x}^2)${nt.dxdt} - ${nt.x}`,
		traits: {},
	},
	o2_unforcedDuffing: {
		parents: {
			o2_autonomous: true,
		},
		name: "unforced Duffing",
		htmlName: "unforced <a href='https://en.wikipedia.org/wiki/Duffing_equation'>Duffing</a>",
		importance: 3,
		equation: `${nt.dd(nt.x,'t',2)} = - \\delta ${nt.dxdt} - \\alpha ${nt.x} - \\beta ${nt.x}^3`,
		traits: {},
	},
	o2_harmonicOscillator: {
		parents: {
			o2_autonomous: true,
		},
		name: "harmonic oscillator",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator'>harmonic oscillator</a>",
		importance: 3,
		equation: `${nt.dd(nt.x,'t',2)} = - \\frac{b}{m} ${nt.dxdt} - \\frac{k}{m} ${nt.x}`,
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
		equation: `${nt.dd(nt.x,'t',2)} = - \\frac{k}{m} ${nt.x}`,
		equationNotes: [
			`\\(m\\) is the mass`,
			`\\(k\\) is the spring constant`,
		],
		traits: {},
	},
})
