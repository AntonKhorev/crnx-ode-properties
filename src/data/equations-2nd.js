'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

module.exports=(nt)=>{
	const lhc_characteristicEquation=(a,b,c)=>({
		form: true,
		content: [
			{type:'derivation',content:[
				`\\[ ${a} ${nt.dd(nt.x,'t',2)} + ${b} ${nt.dxdt} + ${c} ${nt.x} = 0 \\]`,
				`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
				`\\[ ${a} ${nt.dd('','t',2)} e^{\\lambda t} + ${b} ${nt.ddt} e^{\\lambda t} + ${c} e^{\\lambda t} = 0 \\]`,
				`\\[ ${a} \\lambda^2 e^{\\lambda t} + ${b} \\lambda e^{\\lambda t} + ${c} e^{\\lambda t} = 0 \\]`,
				`divide by \\( e^{\\lambda t} \\)`,
			]},
			`\\[ ${a} \\lambda^2 + ${b} \\lambda + ${c} = 0 \\]`,
		],
	})
	const lhc_orderReduction=(a,b,c)=>({
		title: "Order reduction to a system of 2 first-order linear homogeneous equations with constant coefficients",
		form: true,
		content: [
			`\\[ \\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= ${nt.y} \\\\`+
				`${nt.dd(nt.y)} &= - \\frac ${c} ${a} ${nt.x} - \\frac ${b} ${a} ${nt.y}`+
			`\\end{aligned} \\right. \\]`,
		],
	})
	const lhc_generalSolutionMethod=(a,b,c)=>({
		title: `General and ${ivp} solution`,
		form: true,
		content: [
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${a} \\lambda^2 + ${b} \\lambda + ${c} = 0 \\]`,
			{type:'switch',title:`roots \\( \\lambda \\) are`,content:[
				{type:'case',title:`repeated \\( ( \\lambda_1 = \\lambda_2 = \\lambda ) \\)`,content:[
					`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
					`\\[ ${nt.x} = k_1 e^{\\lambda t} + k_2 t e^{\\lambda t} \\]`,
					`constants for ${ivp} solution:`,
					`\\[ \\begin{aligned} `+
						`k_1 &= ${nt.x}(0) \\\\ `+
						`k_2 &= ${nt.x}'(0) - \\lambda ${nt.x}(0) `+
					`\\end{aligned} \\]`,
				]},
				{type:'case',title:`real distinct \\( ( \\lambda_1 \\ne \\lambda_2; \\lambda_1, \\lambda_2 \\in \\mathbb{R} ) \\)`,content:[
					`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
					`\\[ ${nt.x} = k_1 e^{\\lambda_1 t} + k_2 e^{\\lambda_2 t} \\]`,
					`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
					`\\[ ${nt.mat2(1,1,'\\lambda_1','\\lambda_2')} ${nt.vec2('k_1','k_2')} = ${nt.vec2(`${nt.x}(0)`,`${nt.x}'(0)`)} \\]`,
				]},
				{type:'case',title:`complex conjugate pair \\( ( \\lambda = \\alpha \\pm i \\beta; \\beta \\ne 0 ) \\)`,content:[
					`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
					`\\[ ${nt.x} = k_1 e^{\\alpha t} \\cos \\beta t + k_2 e^{\\alpha t} \\sin \\beta t \\]`,
					`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
					`\\[ ${nt.mat2(1,0,'\\alpha','\\beta')} ${nt.vec2('k_1','k_2')} = ${nt.vec2(`${nt.x}(0)`,`${nt.x}'(0)`)} \\]`,
				]},
			]},
		],
	})
	return {
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
		o2_linearHomogeneous: {
			parents: {
				o2: true,
			},
			name: "second-order linear homogeneous",
			htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a> <a href='https://en.wikipedia.org/wiki/Homogeneous_differential_equation#Homogeneous_linear_differential_equations'>homogeneous</a>",
			importance: 2,
			equation: `${nt.dd(nt.x,'t',2)} = a(t) \\cdot ${nt.dxdt} + b(t) \\cdot ${nt.x}`,
			traits: {
				equilibriumSolutionMethod: {
					form: true,
					content: [
						{type:'switch',title:`\\( b(t) \\) is`,content:[
							{type:'case',title:`\\( b(t) = 0 \\)`,content:[
								`\\[ ${nt.x} = K \\]`,
							]},
							{type:'case',title:`\\( b(t) \\ne 0 \\)`,content:[
								`\\[ ${nt.x} = 0 \\]`,
							]},
						]},
					],
				},
			},
		},
		o2_linearHomogeneousConstant: {
			parents: {
				on_linearHomogeneousConstant: true,
				o2_autonomous: true,
				o2_linearHomogeneous: true,
			},
			name: "second-order linear homogeneous with constant coefficients",
			htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
			importance: 2,
			equation: `${nt.dd(nt.x,'t',2)} = - \\frac b a ${nt.dxdt} - \\frac c a ${nt.x}`,
			equationNotes: [
				`usually written as \\( a ${nt.dd(nt.x,'t',2)} + b ${nt.dxdt} + c ${nt.x} = 0 \\)`,
			],
			traits: {
				characteristicEquation: lhc_characteristicEquation('a','b','c'),
				orderReduction: lhc_orderReduction('a','b','c'),
				generalSolutionMethod: lhc_generalSolutionMethod('a','b','c'),
				equilibriumSolutionMethod: {
					form: true,
					content: [
						{type:'switch',title:`\\( c \\) is`,content:[
							{type:'case',title:`\\( c = 0 \\)`,content:[
								`\\[ ${nt.x} = K \\]`,
							]},
							{type:'case',title:`\\( c \\ne 0 \\)`,content:[
								`\\[ ${nt.x} = 0 \\]`,
							]},
						]},
					],
				},
			},
		},
		o2_harmonicOscillator: {
			parents: {
				o2_linearHomogeneousConstant: true,
			},
			name: "harmonic oscillator",
			htmlName: "<a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator'>harmonic oscillator</a>",
			importance: 3,
			equation: `${nt.dd(nt.x,'t',2)} = - \\frac{b}{m} ${nt.dxdt} - \\frac{k}{m} ${nt.x}`,
			equationNotes: [
				`usually written as \\( m ${nt.dd(nt.x,'t',2)} + b ${nt.dxdt} + k ${nt.x} = 0 \\)`,
				`\\( m &gt; 0 \\) is the mass`,
				`\\( b \\ge 0 \\) is the viscous damping coefficient`,
				`\\( k &gt; 0 \\) is the spring constant`,
			],
			traits: {
				characteristicEquation: lhc_characteristicEquation('m','b','k'),
				orderReduction: lhc_orderReduction('m','b','k'),
				generalSolutionMethod: lhc_generalSolutionMethod('m','b','k'),
				equilibriumSolutionMethod: {
					form: true,
					content: [
						`\\[ ${nt.x} = 0 \\]`,
						{type:'note',content:[
							`no other equilibrium solution is possible because \\( k &gt; 0 \\)`,
						]},
					],
				},
			},
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
	}
}
