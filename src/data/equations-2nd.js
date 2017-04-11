'use strict'

const LhcParam=require('../lhc-param-classes')
const LhcContent=require('../lhc-content-classes')

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

const harmonicOscillatorType=(type,discriminantRelation,contentMethodName)=>({
	parents: {
		o2_harmonicOscillator: true,
	},
	name: `${type} harmonic oscillator`,
	htmlName: `${type} <a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator'>harmonic oscillator</a>`,
	importance: 4,
	forms: [
		{
			is: 't,x,scalar_o2_simpleHarmonicOscillator,scalar_o2_harmonicOscillator,linear_o2_harmonicOscillator',
			equation: nt=>`m \\cdot ${nt.dd(nt.x,'t',2)} + b \\cdot ${nt.dxdt} + k \\cdot ${nt.x} = 0`,
			notes: nt=>[
				`\\[ b^2 - 4 m k ${discriminantRelation} 0 \\]`,
				`\\( m > 0 \\) is the mass`,
				`\\( b \\ge 0 \\) is the viscous damping coefficient`,
				`\\( k > 0 \\) is the spring constant`,
			],
		},
		// copypasted from harmonic oscillator
		{
			is: 't,x,scalar_o2_simpleHarmonicOscillator,scalar_o2_harmonicOscillator,resolved_o2_harmonicOscillator',
			equation: nt=>`${nt.dd(nt.x,'t',2)} = - \\frac bm \\cdot ${nt.dxdt} - \\frac km \\cdot ${nt.x}`,
		},
		{
			is: 't,xy,system_o2_simpleHarmonicOscillator,system_o2_harmonicOscillator',
			equation: nt=>`\\left\\{ \\begin{aligned} `+
				`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
				`${nt.dd(nt.y)} &= - \\frac km \\cdot ${nt.x} - \\frac bm \\cdot ${nt.y} `+
			`\\end{aligned} \\right.`,
		},
		{
			is: 't,X,vector_o2_simpleHarmonicOscillator,vector_o2_harmonicOscillator',
			equation: nt=>`${nt.dd(nt.X)} = \\begin{bmatrix}`+
				`0 & 1 \\\\`+
				`- \\frac km & - \\frac bm`+
			`\\end{bmatrix} ${nt.X}`,
		},
	],
	traits: {
		generalSolutionMethod: {
			title: `General and ${ivp} solution`,
			contents: {
				linear_o2_harmonicOscillator:   new LhcContent.Linear(new LhcParam.Linear('m','b','k'))[contentMethodName](),
				resolved_o2_harmonicOscillator: new LhcContent.Resolved(new LhcParam.Linear('m','b','k'))[contentMethodName](),
				system_o2_harmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m','b','k'))[contentMethodName](),
				vector_o2_harmonicOscillator:   new LhcContent.ReducedVector(new LhcParam.Linear('m','b','k'))[contentMethodName](),
			},
		},
	},
})

const o2OrderReductionForms=(classId,resolvedFormFn)=>[ // resolvedFormFn: (x,y)=>`...`
	{
		is: `t,x,resolved_${classId}`,
		equation: nt=>`${nt.dd(nt.x,'t',2)} = `+resolvedFormFn(nt.x,nt.dxdt),
	},
	{
		is: 't,xy,system_${classId}',
		equation: nt=>`\\left\\{ \\begin{aligned} `+
			`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
			`${nt.dd(nt.y)} &= `+resolvedFormFn(nt.x,nt.y)+` `+
		`\\end{aligned} \\right.`,
	},
]

module.exports={
	o2: {
		parents: {
			s2: true,
			on: true,
		},
		name: "second-order",
		importance: 2,
		forms: [
			{
				is: 't,x,resolved_o2',
				equation: nt=>`${nt.dd(nt.x,'t',2)} = f(t,${nt.x},${nt.dxdt})`,
			},
			{
				is: 't,xy,system_o2',
				equation: nt=>`\\left\\{ \\begin{aligned} `+
					`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
					`${nt.dd(nt.y)} &= f(t,${nt.x},${nt.y}) `+
				`\\end{aligned} \\right.`,
			},
		],
	},
	o2_autonomous: {
		parents: {
			o2: true,
			s2_autonomous: true,
		},
		name: "second-order autonomous",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Autonomous_system_%28mathematics%29'>autonomous</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,resolved_o2_autonomous',
				equation: nt=>`${nt.dd(nt.x,'t',2)} = f(${nt.x},${nt.dxdt})`,
			},
			{
				is: 't,xy,system_o2_autonomous',
				equation: nt=>`\\left\\{ \\begin{aligned} `+
					`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
					`${nt.dd(nt.y)} &= f(${nt.x},${nt.y}) `+
				`\\end{aligned} \\right.`,
			},
		],
	},
	o2_linearHomogeneous: {
		parents: {
			s2_linearHomogeneous: true,
			on_linearHomogeneous: true,
			o2: true,
		},
		name: "second-order linear homogeneous",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a> <a href='https://en.wikipedia.org/wiki/Homogeneous_differential_equation#Homogeneous_linear_differential_equations'>homogeneous</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,linear_o2_linearHomogeneous',
				equation: nt=>`${nt.dd(nt.x,'t',2)} + p(t) \\cdot ${nt.dxdt} + q(t) \\cdot ${nt.x} = 0`,
			},
			{
				is: 't,x,resolved_o2_linearHomogeneous',
				equation: nt=>`${nt.dd(nt.x,'t',2)} = a(t) \\cdot ${nt.dxdt} + b(t) \\cdot ${nt.x}`,
			},
			{
				is: 't,xy,system_o2_linearHomogeneous',
				equation: nt=>`\\left\\{ \\begin{aligned} `+
					`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
					`${nt.dd(nt.y)} &= c(t) \\cdot ${nt.x} + d(t) \\cdot ${nt.y} `+
				`\\end{aligned} \\right.`,
			},
			{
				is: 't,X,vector_o2_linearHomogeneous',
				equation: nt=>`${nt.dd(nt.X)} = \\begin{bmatrix}`+
					`0 & 1 \\\\`+
					`c(t) & d(t)`+
				`\\end{bmatrix} ${nt.X}`,
			},
		],
		traits: {
			equilibriumSolutionMethod: {
				contents: {
					linear_o2_linearHomogeneous:   new LhcContent.Linear(new LhcParam.Linear(1,'p(t)','q(t)')).getContentFor_equilibriumSolutionMethod(),
					resolved_o2_linearHomogeneous: new LhcContent.Resolved(new LhcParam.Resolved('a(t)','b(t)')).getContentFor_equilibriumSolutionMethod(),
					system_o2_linearHomogeneous:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('c(t)','d(t)')).getContentFor_equilibriumSolutionMethod(),
					vector_o2_linearHomogeneous:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('c(t)','d(t)')).getContentFor_equilibriumSolutionMethod(),
				},
			},
		},
	},
	o2_linearHomogeneousConstant: {
		parents: {
			s2_linearHomogeneousConstant: true,
			on_linearHomogeneousConstant: true,
			o2_autonomous: true,
			o2_linearHomogeneous: true,
		},
		name: "second-order linear homogeneous with constant coefficients",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,linear_o2_linearHomogeneousConstant',
				equation: nt=>`a_2 \\cdot ${nt.dd(nt.x,'t',2)} + a_1 \\cdot ${nt.dxdt} + a_0 \\cdot ${nt.x} = 0`,
				notes: nt=>[
					`\\( a_2 \\ne 0 \\)`,
				],
			},
			{
				is: 't,x,resolved_o2_linearHomogeneousConstant',
				equation: nt=>`${nt.dd(nt.x,'t',2)} = b_1 \\cdot ${nt.dxdt} + b_0 \\cdot ${nt.x}`,
			},
			{
				is: 't,xy,system_o2_linearHomogeneousConstant',
				equation: nt=>`\\left\\{ \\begin{aligned} `+
					`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
					`${nt.dd(nt.y)} &= c \\cdot ${nt.x} + d \\cdot ${nt.y} `+
				`\\end{aligned} \\right.`,
			},
			{
				is: 't,X,vector_o2_linearHomogeneousConstant',
				equation: nt=>`${nt.dd(nt.X)} = \\begin{bmatrix}`+
					`0 & 1 \\\\`+
					`c & d`+
				`\\end{bmatrix} ${nt.X}`,
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_o2_linearHomogeneousConstant:   new LhcContent.Linear(new LhcParam.Linear('a_2','a_1','a_0')).getContentFor_characteristicEquation(),
					resolved_o2_linearHomogeneousConstant: new LhcContent.Resolved(new LhcParam.Resolved('b_1','b_0')).getContentFor_characteristicEquation(),
					system_o2_linearHomogeneousConstant:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('c','d')).getContentFor_characteristicEquation(),
					vector_o2_linearHomogeneousConstant:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('c','d')).getContentFor_characteristicEquation(),
				},
			},
			generalSolutionMethod: {
				title: `General and ${ivp} solution`,
				contents: {
					linear_o2_linearHomogeneousConstant:   new LhcContent.Linear(new LhcParam.Linear('a_2','a_1','a_0')).getContentFor_generalSolutionMethod(),
					resolved_o2_linearHomogeneousConstant: new LhcContent.Resolved(new LhcParam.Resolved('b_1','b_0')).getContentFor_generalSolutionMethod(),
					system_o2_linearHomogeneousConstant:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('c','d')).getContentFor_generalSolutionMethod(),
					vector_o2_linearHomogeneousConstant:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('c','d')).getContentFor_generalSolutionMethod(),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_o2_linearHomogeneousConstant:   new LhcContent.Linear(new LhcParam.Linear('a_2','a_1','a_0')).getContentFor_equilibriumSolutionMethod(),
					resolved_o2_linearHomogeneousConstant: new LhcContent.Resolved(new LhcParam.Resolved('b_1','b_0')).getContentFor_equilibriumSolutionMethod(),
					system_o2_linearHomogeneousConstant:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('c','d')).getContentFor_equilibriumSolutionMethod(),
					vector_o2_linearHomogeneousConstant:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('c','d')).getContentFor_equilibriumSolutionMethod(),
				},
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
		forms: [
			{
				is: 't,x,scalar_o2_simpleHarmonicOscillator,scalar_o2_harmonicOscillator,linear_o2_harmonicOscillator',
				equation: nt=>`m \\cdot ${nt.dd(nt.x,'t',2)} + b \\cdot ${nt.dxdt} + k \\cdot ${nt.x} = 0`,
				notes: nt=>[ // TODO all-forms notes
					`\\( m > 0 \\) is the mass`,
					`\\( b \\ge 0 \\) is the viscous damping coefficient`,
					`\\( k > 0 \\) is the spring constant`,
				],
			},
			{
				is: 't,x,scalar_o2_simpleHarmonicOscillator,scalar_o2_harmonicOscillator,resolved_o2_harmonicOscillator',
				equation: nt=>`${nt.dd(nt.x,'t',2)} = - \\frac bm \\cdot ${nt.dxdt} - \\frac km \\cdot ${nt.x}`,
			},
			{
				is: 't,xy,system_o2_simpleHarmonicOscillator,system_o2_harmonicOscillator',
				equation: nt=>`\\left\\{ \\begin{aligned} `+
					`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
					`${nt.dd(nt.y)} &= - \\frac km \\cdot ${nt.x} - \\frac bm \\cdot ${nt.y} `+
				`\\end{aligned} \\right.`,
			},
			{
				is: 't,X,vector_o2_simpleHarmonicOscillator,vector_o2_harmonicOscillator',
				equation: nt=>`${nt.dd(nt.X)} = \\begin{bmatrix}`+
					`0 & 1 \\\\`+
					`- \\frac km & - \\frac bm`+
				`\\end{bmatrix} ${nt.X}`,
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_o2_harmonicOscillator:   new LhcContent.Linear(new LhcParam.Linear('m','b','k')).getContentFor_characteristicEquation(),
					resolved_o2_harmonicOscillator: new LhcContent.Resolved(new LhcParam.Linear('m','b','k')).getContentFor_characteristicEquation(),
					system_o2_harmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m','b','k')).getContentFor_characteristicEquation(),
					vector_o2_harmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m','b','k')).getContentFor_characteristicEquation(),
				},
			},
			generalSolutionMethod: {
				title: `General and ${ivp} solution`,
				contents: {
					linear_o2_harmonicOscillator:   new LhcContent.Linear(new LhcParam.Linear('m','b','k')).getContentFor_generalSolutionMethod(),
					resolved_o2_harmonicOscillator: new LhcContent.Resolved(new LhcParam.Linear('m','b','k')).getContentFor_generalSolutionMethod(),
					system_o2_harmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m','b','k')).getContentFor_generalSolutionMethod(),
					vector_o2_harmonicOscillator:   new LhcContent.ReducedVector(new LhcParam.Linear('m','b','k')).getContentFor_generalSolutionMethod(),
				},
			},
			equilibriumSolutionMethod: {
				formType: 'scalar_o2_simpleHarmonicOscillator',
				contents: {
					scalar_o2_simpleHarmonicOscillator: new LhcContent.Linear(new LhcParam.Linear('m','b','k')).getContentFor_equilibriumSolutionMethod0(),
					system_o2_simpleHarmonicOscillator: new LhcContent.ReducedSystem(new LhcParam.Linear('m','b','k')).getContentFor_equilibriumSolutionMethod0(),
					vector_o2_simpleHarmonicOscillator: new LhcContent.ReducedVector(new LhcParam.Linear('m','b','k')).getContentFor_equilibriumSolutionMethod0(),
				},
			},
		},
	},
	o2_underdampedHarmonicOscillator: harmonicOscillatorType(
		"underdamped",
		"&lt;",
		'getContentFor_generalSolutionMethod_Complex'
	),
	o2_criticallyDampedHarmonicOscillator: harmonicOscillatorType(
		"critically damped",
		"=",
		'getContentFor_generalSolutionMethod_Repeated'
	),
	o2_overdampedHarmonicOscillator: harmonicOscillatorType(
		"overdamped",
		">",
		'getContentFor_generalSolutionMethod_Real'
	),
	o2_simpleHarmonicOscillator: {
		parents: {
			o2_underdampedHarmonicOscillator: true,
		},
		name: "simple (undamped) harmonic oscillator",
		htmlName: "<a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Simple_harmonic_oscillator'>simple (undamped) harmonic oscillator</a>",
		importance: 3,
		forms: [
			{
				is: 't,x,scalar_o2_simpleHarmonicOscillator,linear_o2_simpleHarmonicOscillator',
				equation: nt=>`m \\cdot ${nt.dd(nt.x,'t',2)} + k \\cdot ${nt.x} = 0`,
				notes: nt=>[
					`\\( m > 0 \\) is the mass`,
					`\\( k > 0 \\) is the spring constant`,
				],
			},
			{
				is: 't,x,scalar_o2_simpleHarmonicOscillator,resolved_o2_simpleHarmonicOscillator',
				equation: nt=>`${nt.dd(nt.x,'t',2)} = - \\frac km \\cdot ${nt.x}`,
			},
			{
				is: 't,xy,system_o2_simpleHarmonicOscillator',
				equation: nt=>`\\left\\{ \\begin{aligned} `+
					`${nt.dd(nt.x)} &= ${nt.y} \\\\ `+
					`${nt.dd(nt.y)} &= - \\frac km \\cdot ${nt.x} `+
				`\\end{aligned} \\right.`,
			},
			{
				is: 't,X,vector_o2_simpleHarmonicOscillator',
				equation: nt=>`${nt.dd(nt.X)} = \\begin{bmatrix}`+
					`0 & 1 \\\\`+
					`- \\frac km & 0`+
				`\\end{bmatrix} ${nt.X}`,
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_o2_simpleHarmonicOscillator:   new LhcContent.Linear(new LhcParam.Linear('m',0,'k')).getContentFor_characteristicEquation(),
					resolved_o2_simpleHarmonicOscillator: new LhcContent.Resolved(new LhcParam.Linear('m',0,'k')).getContentFor_characteristicEquation(),
					system_o2_simpleHarmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m',0,'k')).getContentFor_characteristicEquation(),
					vector_o2_simpleHarmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m',0,'k')).getContentFor_characteristicEquation(),
				},
			},
			generalSolutionMethod: {
				title: `General and ${ivp} solution`,
				contents: {
					linear_o2_simpleHarmonicOscillator:   new LhcContent.Linear(new LhcParam.Linear('m',0,'k')).getContentFor_generalSolutionMethod_Imaginary(),
					resolved_o2_simpleHarmonicOscillator: new LhcContent.Resolved(new LhcParam.Linear('m',0,'k')).getContentFor_generalSolutionMethod_Imaginary(),
					system_o2_simpleHarmonicOscillator:   new LhcContent.ReducedSystem(new LhcParam.Linear('m',0,'k')).getContentFor_generalSolutionMethod_Imaginary(),
					vector_o2_simpleHarmonicOscillator:   new LhcContent.ReducedVector(new LhcParam.Linear('m',0,'k')).getContentFor_generalSolutionMethod_Imaginary(),
				},
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
		forms: o2OrderReductionForms('o2_vanDerPol',(x,y)=>`\\mu(1-${x}^2)${y} - ${x}`),
	},
	o2_unforcedDuffing: {
		parents: {
			o2_autonomous: true,
		},
		name: "unforced Duffing",
		htmlName: "unforced <a href='https://en.wikipedia.org/wiki/Duffing_equation'>Duffing</a>",
		importance: 3,
		forms: o2OrderReductionForms('o2_unforcedDuffing',(x,y)=>`- \\delta ${y} - \\alpha ${x} - \\beta ${x}^3`),
	},
}
