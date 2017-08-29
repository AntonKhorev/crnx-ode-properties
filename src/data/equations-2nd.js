'use strict'

const tex=require('../tex')
const TexScalarDepvar=require('../tex-scalar-depvar')
const TexSystem2Depvar=require('../tex-system2-depvar')
const TexVectorDepvar=require('../tex-vector-depvar')
const LinearEquationFormSuite=require('../linear-equation-form-suite')
const LinearEquation=require('../linear-equation')
const LhcParam=require('../lhc-param-classes')
const LhcContent=require('../lhc-content-classes')

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

class o2_FormSuite extends LinearEquationFormSuite {
	constructor(a0,a1,a2,b0,b1) {
		super()
		if (b0===undefined) b0=`-\\frac{${a0}}{${a2}}`
		if (b1===undefined) b1=`-\\frac{${a1}}{${a2}}`
		this.a0=a0; this.a1=a1; this.a2=a2
		this.b0=b0; this.b1=b1
	}
	get linear() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			const pl=(isConstant?`+`:`{+}`)
			const eq=(isConstant?`=`:`{=}`)
			return tex.sum([this.a2+t,nt.dd(nt.x,'t',2)],pl,[this.a1+t,nt.dxdt],pl,[this.a0+t,nt.x],eq,[input?`${input}(t)`:0])
		})
	}
	get resolved() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			return tex.sum([nt.dd(nt.x,'t','2')],'=',[this.b1+t,nt.dxdt],'+',[this.b0+t,nt.x],'+',[input?`${input}(t)`:0])
		})
	}
	get system() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			return nt.sys2(
				`${nt.dd(nt.x)} &= ${nt.y}`,
				`${nt.dd(nt.y)} &= `+tex.sum([this.b0+t,nt.x],'+',[this.b1+t,nt.y],'+',[input?`${input}(t)`:0])
			)
		})
	}
	get vector() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			const pl=(isConstant||!input?`+`:`{+}`)
			const eq=(isConstant||!input?`=`:`{=}`)
			return `${nt.dd(nt.X)} ${eq} `+nt.mat2(0,1,this.b0+t,this.b1+t)+` ${nt.X} `+(input?` ${pl} `+nt.vec2(0,`${input}(t)`):``)
		})
	}
	get classIdPrefix() {
		return 'o2'
	}
	get highestOrderCoefficient() {
		return this.a2
	}
	get systemFormType() {
		return 'xy'
	}
}

class o2_OscillatorFormSuite extends o2_FormSuite {
	getClassId(isConstant,isHomogeneous) {
		return 'o2_harmonicOscillator' // TODO forced/unforced
	}
	getForms(isConstant,isHomogeneous,discriminantRelation) {
		const classId=this.getClassId(isConstant,isHomogeneous)
		const simpleClassId='o2_simpleHarmonicOscillator'
		return [
			{
				is: `t,x,scalar_${simpleClassId},scalar_${classId},linear_${classId}`,
				equation: this.linear(isConstant)(isHomogeneous?0:'f'),
				notes: nt=>[ // TODO all-forms notes
					...(discriminantRelation!==undefined?[
						`\\[ ${this.a1}^2 ${discriminantRelation} 4 ${this.a2} ${this.a0} \\]`
					]:[]),
					`\\( ${this.a2} > 0 \\) is the mass`,
					`\\( ${this.a1} \\ge 0 \\) is the viscous damping coefficient`,
					`\\( ${this.a0} > 0 \\) is the spring constant`,
				],
			},
			{
				is: `t,x,scalar_${simpleClassId},scalar_${classId},resolved_${classId}`,
				equation: this.resolved(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,${this.systemFormType},system_${simpleClassId},system_${classId}`,
				equation: this.system(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,X,vector_${classId}`,
				is: `t,X,vector_${simpleClassId},vector_${classId}`,
				equation: this.vector(isConstant)(isHomogeneous?0:'g'),
			},
		]
	}
}

const o2_formSuite=new o2_FormSuite('a_0','a_1','a_2','b_0','b_1')
const osc_formSuite=new o2_OscillatorFormSuite('k','b','m')

// { paste with changes from on_*

// TODO const o2_linearHomogeneousConstant_generalSolutionMethod_content=(x,charEqn)=>nt=>[

const o2_linearHomogeneous_equilibriumSolutionMethod_trait=(classId,isConstant)=>{
	const t=isConstant?'':'(t)'
	return {
		contents: {
			[`linear_${classId}`]: nt=>[
				{type:'switch',title:`\\( a_0${t} \\) is`,content:[
					{type:'case',title:`\\( a_0${t} = 0 \\)`,content:[
						`\\[ ${nt.x} = K \\]`,
					]},
					{type:'case',title:`\\( a_0${t} \\ne 0 \\)`,content:[
						`\\[ ${nt.x} = 0 \\]`,
					]},
				]},
			],
			[`resolved_${classId}`]: nt=>[
				{type:'switch',title:`\\( b_0${t} \\) is`,content:[
					{type:'case',title:`\\( b_0${t} = 0 \\)`,content:[
						`\\[ ${nt.x} = K \\]`,
					]},
					{type:'case',title:`\\( b_0${t} \\ne 0 \\)`,content:[
						`\\[ ${nt.x} = 0 \\]`,
					]},
				]},
			],
			[`system_${classId}`]: nt=>[
				{type:'switch',title:`\\( b_0${t} \\) is`,content:[ // 'c_1' -> 'b_0'
					{type:'case',title:`\\( b_0${t} = 0 \\)`,content:[
						`\\[ \\left\\{ \\begin{array}{rcl}`+
							`${nt.x} &=& K \\\\`+
							`${nt.y} &=& 0 \\\\`+
						`\\end{array} \\right. \\]`,
					]},
					{type:'case',title:`\\( b_0${t} \\ne 0 \\)`,content:[
						`\\[ \\left\\{ \\begin{array}{rcl}`+
							`${nt.x} &=& 0 \\\\`+
							`${nt.y} &=& 0 \\\\`+
						`\\end{array} \\right. \\]`,
					]},
				]},
			],
			[`vector_${classId}`]: nt=>[
				{type:'switch',title:`\\( b_0${t} \\) is`,content:[ // 'c_1' -> 'b_0'
					{type:'case',title:`\\( b_0${t} = 0 \\)`,content:[
						`\\[ ${nt.X} = \\begin{bmatrix} K \\\\ 0 \\end{bmatrix} \\]`,
					]},
					{type:'case',title:`\\( b_0${t} \\ne 0 \\)`,content:[
						`\\[ ${nt.X} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\]`,
					]},
				]},
			],
		},
	}
}

// }

const harmonicOscillatorType=(type,discriminantRelation,contentMethodName)=>({
	parents: {
		o2_harmonicOscillator: true,
	},
	name: `${type} harmonic oscillator`,
	htmlName: `${type} <a href='https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator'>harmonic oscillator</a>`,
	importance: 4,
	forms: osc_formSuite.getForms(true,true,discriminantRelation),
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
	o2_linear: {
		parents: {
			on_linear: true,
			o2: true,
		},
		name: "second-order linear",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a>",
		importance: 2,
		forms: o2_formSuite.getForms(false,false),
		traits: {
			associatedHomogeneousEquation: o2_formSuite.getAssociatedHomogeneousEquationTrait(false,false),
			generalSolutionMethod: {
				contents: {
					linear_o2_linear:   nt=>new LinearEquation(new TexScalarDepvar(nt.x)      ,'f',o2_formSuite.linear(false)  ).getContentFor_generalSolutionMethod()(nt),
					resolved_o2_linear: nt=>new LinearEquation(new TexScalarDepvar(nt.x)      ,'g',o2_formSuite.resolved(false)).getContentFor_generalSolutionMethod()(nt),
					system_o2_linear:   nt=>new LinearEquation(new TexSystem2Depvar(nt.x,nt.y),'g',o2_formSuite.system(false)  ).getContentFor_generalSolutionMethod()(nt),
					vector_o2_linear:   nt=>new LinearEquation(new TexVectorDepvar(nt.X,nt.x) ,'g',o2_formSuite.vector(false)  ).getContentFor_generalSolutionMethod()(nt),
				},
			},
		},
	},
	o2_linearHomogeneous: {
		parents: {
			s2_linearHomogeneous: true,
			on_linearHomogeneous: true,
			o2_linear: true,
		},
		name: "second-order linear homogeneous",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a> <a href='https://en.wikipedia.org/wiki/Homogeneous_differential_equation#Homogeneous_linear_differential_equations'>homogeneous</a>",
		importance: 2,
		forms: o2_formSuite.getForms(false,true),
		traits: {
			associatedHomogeneousEquation: o2_formSuite.getAssociatedHomogeneousEquationTrait(false,true),
			// TODO realitySolutionRelation, maybe not worth it
			generalSolutionMethod: {
				close: true, // because parent doesn't specify how to solve associated eqn
			},
			equilibriumSolutionMethod: o2_linearHomogeneous_equilibriumSolutionMethod_trait('o2_linearHomogeneous',false),
		},
	},
	o2_linearConstant: {
		parents: {
			on_linearConstant: true,
			o2_linear: true,
		},
		name: "second-order linear with constant coefficients",
		importance: 2,
		forms: o2_formSuite.getForms(true,false),
		traits: {
			associatedHomogeneousEquation: o2_formSuite.getAssociatedHomogeneousEquationTrait(true,false),
			// TODO generalSolutionMethod
		},
	},
	o2_linearHomogeneousConstant: {
		parents: {
			s2_linearHomogeneousConstant: true,
			on_linearHomogeneousConstant: true,
			o2_autonomous: true,
			o2_linearHomogeneous: true,
			o2_linearConstant: true,
		},
		name: "second-order linear homogeneous with constant coefficients",
		htmlName: "second-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		forms: o2_formSuite.getForms(true,true),
		traits: {
			associatedHomogeneousEquation: o2_formSuite.getAssociatedHomogeneousEquationTrait(true,true),
			characteristicEquation: {
				contents: {
					linear_o2_linearHomogeneousConstant:   new LhcContent.Linear(new LhcParam.Linear('a_2','a_1','a_0')).getContentFor_characteristicEquation(),
					resolved_o2_linearHomogeneousConstant: new LhcContent.Resolved(new LhcParam.Resolved('b_1','b_0')).getContentFor_characteristicEquation(),
					system_o2_linearHomogeneousConstant:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('b_0','b_1')).getContentFor_characteristicEquation(),
					vector_o2_linearHomogeneousConstant:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('b_0','b_1')).getContentFor_characteristicEquation(),
				},
			},
			generalSolutionMethod: {
				title: `General and ${ivp} solution`,
				contents: {
					linear_o2_linearHomogeneousConstant:   new LhcContent.Linear(new LhcParam.Linear('a_2','a_1','a_0')).getContentFor_generalSolutionMethod(),
					resolved_o2_linearHomogeneousConstant: new LhcContent.Resolved(new LhcParam.Resolved('b_1','b_0')).getContentFor_generalSolutionMethod(),
					system_o2_linearHomogeneousConstant:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('b_0','b_1')).getContentFor_generalSolutionMethod(),
					vector_o2_linearHomogeneousConstant:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('b_0','b_1')).getContentFor_generalSolutionMethod(),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_o2_linearHomogeneousConstant:   new LhcContent.Linear(new LhcParam.Linear('a_2','a_1','a_0')).getContentFor_equilibriumSolutionMethod(),
					resolved_o2_linearHomogeneousConstant: new LhcContent.Resolved(new LhcParam.Resolved('b_1','b_0')).getContentFor_equilibriumSolutionMethod(),
					system_o2_linearHomogeneousConstant:   new LhcContent.ReducedSystem(new LhcParam.ReducedSystem('b_0','b_1')).getContentFor_equilibriumSolutionMethod(),
					vector_o2_linearHomogeneousConstant:   new LhcContent.ReducedVector(new LhcParam.ReducedSystem('b_0','b_1')).getContentFor_equilibriumSolutionMethod(),
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
		forms: osc_formSuite.getForms(true,true),
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
