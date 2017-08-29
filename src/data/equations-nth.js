'use strict'

const TexScalarDepvar=require('../tex-scalar-depvar')
const TexSystemDepvar=require('../tex-system-depvar')
const TexVectorDepvar=require('../tex-vector-depvar')
const characteristicEquationContent=require('../characteristic-equation-content')
const LinearEquationFormSuite=require('../linear-equation-form-suite')
const LinearEquation=require('../linear-equation')
const LinearConstantEquation=require('../linear-constant-equation')

class on_FormSuite extends LinearEquationFormSuite {
	get linear() {
		return this.makeForm(isConstant=>input=>nt=>(
			`\\sum_{i=0}^n a_i`+(isConstant?``:`(t)`)+` ${nt.dd(nt.x,'t','i')} = `+(input?`${input}(t)`:`0`)
		),nt=>`\\sum_{i=0}^n a_i λ^i`)
	}
	get resolved() {
		return this.makeForm(isConstant=>input=>nt=>(
			`${nt.dd(nt.x,'t','n')} = \\sum_{i=0}^{n-1} b_i`+(isConstant?``:`(t)`)+` ${nt.dd(nt.x,'t','i')}`+(input?` + ${input}(t)`:``)
		),nt=>`λ^n - \\sum_{i=0}^{n-1} b_i λ^i`)
	}
	get system() {
		return this.makeForm(isConstant=>input=>nt=>(
			`\\left\\{ \\begin{array}{rcl}`+
				`${nt.dd(`${nt.x}_1`)} &=& ${nt.x}_2 \\\\`+
				`${nt.dd(`${nt.x}_2`)} &=& ${nt.x}_3 \\\\`+
				`&\\vdots \\\\`+
				`${nt.dd(`${nt.x}_{n-1}`)} &=& ${nt.x}_n \\\\`+
				`${nt.dd(`${nt.x}_n`)} &=& \\sum_{i=1}^{n} c_i`+(isConstant?``:`(t)`)+` ${nt.x}_i`+(input?` + ${input}(t)`:``)+
			`\\end{array} \\right.`
		),nt=>`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i`)
	}
	get vector() {
		return this.makeForm(isConstant=>input=>nt=>(
			`${nt.dd(nt.X)} {=} `+
			((input||!isConstant)?`\\! \\left[ \\begin{smallmatrix}`:`\\begin{bmatrix}`)+
				(isConstant
					?`0 & 1 & 0 & \\cdots & 0 \\\\`+
					 `0 & 0 & 1 & \\cdots & 0 \\\\`+
					 `\\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\`+
					 `0 & 0 & 0 & \\cdots & 1 \\\\`+
					 `c_1 & c_2 & c_3 & \\cdots & c_n`
					:`0 & 1 & \\cdots & 0 \\\\`+
					 `\\vdots & \\vdots & \\ddots & \\vdots \\\\`+
					 `0 & 0 & \\cdots & 1 \\\\`+
					 `c_1\\mspace{-2mu}(t) & c_2\\mspace{-2mu}(t) & \\cdots & c_n\\mspace{-2mu}(t)`
				)+
			((input||!isConstant)?`\\end{smallmatrix} \\right] \\!`:`\\end{bmatrix}`)+
			` ${nt.X}`+
			(input?` {+} \\! \\left[ \\begin{smallmatrix}`+
				`0 \\\\`+(isConstant?` 0 \\\\`:``)+` \\vdots \\\\ 0 \\\\ ${input}(t)`+
			`\\end{smallmatrix} \\right]`:``)
		),nt=>`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i`)
	}
	get classIdPrefix() {
		return 'on'
	}
	get highestOrderCoefficient() {
		return 'a_n'
	}
	get systemFormType() {
		return 'xi'
	}
}

const on_formSuite=new on_FormSuite

const on_linearHomogeneousConstant_generalSolutionMethod_content=(x,form)=>nt=>[
	`solve the characteristic equation for \\( λ \\):`,
	`\\[ ${form.characteristicEquation(nt)} \\]`,
	`\\( λ \\) are:`,
	`\\( r \\) distinct real roots \\( λ_1, ..., λ_r \\) with multiplicities \\( p_1, ..., p_r \\)`,
	`\\( s \\) distinct complex conjugate root pairs \\( α_1 \\pm i β_1, ..., α_s \\pm i β_s \\) with multiplicities \\( q_1, ..., q_s \\)`,
	{type:'note',content:[
		`sum of multiplicities is equal to order of the equation:`,
		`\\[ \\sum_{i=1}^r p_i + 2 \\cdot \\sum_{i=1}^s q_i = n \\]`,
	]},
	x.firstComponentExpressionPreamble(
		c=>`${c}general solution (with arbitrary constants \\( K_{ij} \\), \\( A_{ij} \\), \\( B_{ij} \\)):`
	),
	x.firstComponentExpression(
		x1=>`\\begin{aligned}`+
			`${x1}`+
			` = \\: & \\sum_{i=1}^r \\sum_{j=1}^{p_i} K_{ij} \\, t^{j-1} \\, e^{λ_i t} + \\\\`+
			` + \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} A_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\cos β_i t \\\\`+
			` + \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} B_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\sin β_i t`+
		`\\end{aligned}`
	),
	...x.restDiffComponentExpressionContent()(nt),
]

const on_linearHomogeneous_equilibriumSolutionMethod_trait=(classId,isConstant)=>{
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
				{type:'switch',title:`\\( c_1${t} \\) is`,content:[
					{type:'case',title:`\\( c_1${t} = 0 \\)`,content:[
						`\\[ \\left\\{ \\begin{array}{rcl}`+
							`${nt.x}_1 &=& K \\\\`+
							`${nt.x}_2 &=& 0 \\\\`+
							`&\\vdots \\\\`+
							`${nt.x}_n &=& 0 \\\\`+
						`\\end{array} \\right. \\]`,
					]},
					{type:'case',title:`\\( c_1${t} \\ne 0 \\)`,content:[
						`\\[ \\left\\{ \\begin{array}{rcl}`+
							`${nt.x}_1 &=& 0 \\\\`+
							`&\\vdots \\\\`+
							`${nt.x}_n &=& 0 \\\\`+
						`\\end{array} \\right. \\]`,
					]},
				]},
			],
			[`vector_${classId}`]: nt=>[
				{type:'switch',title:`\\( c_1${t} \\) is`,content:[
					{type:'case',title:`\\( c_1${t} = 0 \\)`,content:[
						`\\[ ${nt.X} = \\begin{bmatrix} K \\\\ 0 \\\\ \\vdots \\\\ 0 \\end{bmatrix} \\]`,
					]},
					{type:'case',title:`\\( c_1${t} \\ne 0 \\)`,content:[
						`\\[ ${nt.X} = \\begin{bmatrix} 0 \\\\ \\vdots \\\\ 0 \\end{bmatrix} \\]`,
					]},
				]},
			],
		},
	}
}

module.exports={
	on: {
		parents: {
			sn: true,
		},
		name: "nth-order",
		htmlName: "<em>n</em>th-order",
		importance: 2,
		forms: [
			{
				is: 't,x,resolved_on',
				equation: nt=>`${nt.dd(nt.x,'t','n')} = f(t,${nt.x},${nt.dxdt},\\dotsc,${nt.dd(nt.x,'t','n-1')})`,
			},
			{
				is: 't,xi,system_on',
				equation: nt=>`\\left\\{ \\begin{array}{rcl}`+
					`${nt.dd(`${nt.x}_1`)} &=& ${nt.x}_2 \\\\`+
					`${nt.dd(`${nt.x}_2`)} &=& ${nt.x}_3 \\\\`+
					`&\\vdots \\\\`+
					`${nt.dd(`${nt.x}_{n-1}`)} &=& ${nt.x}_n \\\\`+
					`${nt.dd(`${nt.x}_n`)} &=& f_n(t,${nt.x}_1,\\dotsc,${nt.x}_n)`+
				`\\end{array} \\right.`,
			},
		],
		traits: {
			testSolutionMethod: {
				formType: 'x',
				content: nt=>[
					`Can test if \\( ${nt.x}_p \\) is a solution by substituting \\( ${nt.x} = ${nt.x}_p \\) into the equation.`,
				],
			},
		}
	},
	on_linear: {
		parents: {
			on: true,
		},
		name: "nth-order linear",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation'>linear</a>",
		importance: 2,
		forms: on_formSuite.getForms(false,false),
		traits: {
			associatedHomogeneousEquation: on_formSuite.getAssociatedHomogeneousEquationTrait(false,false),
			generalSolutionMethod: {
				contents: {
					linear_on_linear:   nt=>new LinearEquation(new TexScalarDepvar(nt.x)     ,'f',on_formSuite.linear(false)  ).getContentFor_generalSolutionMethod()(nt),
					resolved_on_linear: nt=>new LinearEquation(new TexScalarDepvar(nt.x)     ,'g',on_formSuite.resolved(false)).getContentFor_generalSolutionMethod()(nt),
					system_on_linear:   nt=>new LinearEquation(new TexSystemDepvar(nt.x)     ,'g',on_formSuite.system(false)  ).getContentFor_generalSolutionMethod()(nt),
					vector_on_linear:   nt=>new LinearEquation(new TexVectorDepvar(nt.X,nt.x),'g',on_formSuite.vector(false)  ).getContentFor_generalSolutionMethod()(nt),
				},
			},
		},
	},
	on_linearHomogeneous: {
		parents: {
			on_linear: true,
		},
		name: "nth-order linear homogeneous",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Homogeneous_differential_equation#Homogeneous_linear_differential_equations'>linear homogeneous</a>",
		importance: 2,
		forms: on_formSuite.getForms(false,true),
		traits: {
			associatedHomogeneousEquation: on_formSuite.getAssociatedHomogeneousEquationTrait(false,true),
			realitySolutionRelation: {
				contents: {
					linear_on_linearHomogeneous: nt=>[
						`If \\( ${nt.x}_1 + i ${nt.x}_2 \\) is a (complex-valued) solution,`,
						`then \\( ${nt.x}_1 \\) and \\( ${nt.x}_2 \\) are solutions.`,
						{type:'proof',content:[
							`substitute \\( ${nt.x} = ${nt.x}_1 + i ${nt.x}_2 \\) into the equation`,
							`\\[ \\sum_{j=0}^n a_j(t) ${nt.dd('','t','j')}(${nt.x}_1 + i ${nt.x}_2) = 0 \\]`,
							`\\[ \\begin{aligned} `+
								       `&\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_1`,'t','j')} + {} \\\\ `+
								`{} + i &\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_2`,'t','j')} = 0 `+
							`\\end{aligned} \\]`,
							`\\[ \\left\\{ \\begin{aligned} `+
								`\\operatorname{Re}\\Biggl( &\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_1`,'t','j')} + {} \\\\ `+
								                    `{} + i &\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_2`,'t','j')} \\Biggr) = 0 \\\\ `+
								`\\operatorname{Im}\\Biggl( &\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_1`,'t','j')} + {} \\\\ `+
								                    `{} + i &\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_2`,'t','j')} \\Biggr) = 0 `+
							`\\end{aligned} \\right. \\]`,
							`\\[ \\left\\{ \\begin{aligned} `+
								`\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_1`,'t','j')} = 0 \\\\ `+
								`\\sum_{j=0}^n a_j(t) ${nt.dd(`${nt.x}_2`,'t','j')} = 0 `+
							`\\end{aligned} \\right. \\]`,
						]},
					],
				},
			},
			generalSolutionMethod: {
				close: true, // because parent doesn't specify how to solve associated eqn
			},
			equilibriumSolutionMethod: on_linearHomogeneous_equilibriumSolutionMethod_trait('on_linearHomogeneous',false),
		},
	},
	on_linearConstant: {
		parents: {
			on_linear: true,
		},
		name: "nth-order linear with constant coefficients",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Nonhomogeneous_equation_with_constant_coefficients'>linear with constant coefficients</a>",
		importance: 2,
		forms: on_formSuite.getForms(true,false),
		traits: {
			associatedHomogeneousEquation: on_formSuite.getAssociatedHomogeneousEquationTrait(true,false),
			generalSolutionMethod: {
				contents: {
					linear_on_linearConstant: nt=>new LinearConstantEquation(
						new TexScalarDepvar(nt.x),'f',on_formSuite.linear(true)
					).getContentFor_generalSolutionMethod(
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexScalarDepvar(nt.x)._('h'),
							on_formSuite.linear(true)
						)(nt)
					)(nt),
					resolved_on_linearConstant: nt=>new LinearConstantEquation(
						new TexScalarDepvar(nt.x),'g',on_formSuite.resolved(true)
					).getContentFor_generalSolutionMethod(
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexScalarDepvar(nt.x)._('h'),
							on_formSuite.resolved(true)
						)(nt)
					)(nt),
					system_on_linearConstant: nt=>new LinearConstantEquation(
						new TexSystemDepvar(nt.x),'g',on_formSuite.system(true)
					).getContentFor_generalSolutionMethod(
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexSystemDepvar(nt.x)._('h'),
							on_formSuite.system(true)
						)(nt)
					)(nt),
					vector_on_linearConstant: nt=>new LinearConstantEquation(
						new TexVectorDepvar(nt.X,nt.x),'g',on_formSuite.vector(true)
					).getContentFor_generalSolutionMethod(
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexVectorDepvar(nt.X,nt.x)._('h'),
							on_formSuite.vector(true)
						)(nt)
					)(nt),
				},
			},
		},
	},
	on_linearHomogeneousConstant: {
		parents: {
			on_linearHomogeneous: true,
			on_linearConstant: true,
		},
		name: "nth-order linear homogeneous with constant coefficients",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		forms: on_formSuite.getForms(true,true),
		traits: {
			associatedHomogeneousEquation: on_formSuite.getAssociatedHomogeneousEquationTrait(true,true),
			characteristicEquation: {
				contents: {
					linear_on_linearHomogeneousConstant: characteristicEquationContent(['i','\\sum_{i=0}^n a_i'],'=','0'),
					resolved_on_linearHomogeneousConstant: characteristicEquationContent(['n',1],'=',['i','\\sum_{i=0}^{n-1} b_i']),
					system_on_linearHomogeneousConstant: nt=>[
						`\\[ λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0 \\]`,
					],
					vector_on_linearHomogeneousConstant: nt=>[
						`\\[ λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0 \\]`,
					],
				}
			},
			generalSolutionMethod: {
				contents: {
					linear_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexScalarDepvar(nt.x),
						on_formSuite.linear(true)
					)(nt),
					resolved_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexScalarDepvar(nt.x),
						on_formSuite.resolved(true)
					)(nt),
					system_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexSystemDepvar(nt.x),
						on_formSuite.system(true)
					)(nt),
					vector_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexVectorDepvar(nt.X,nt.x),
						on_formSuite.vector(true)
					)(nt),
				},
			},
			equilibriumSolutionMethod: on_linearHomogeneous_equilibriumSolutionMethod_trait('on_linearHomogeneousConstant',true),
		},
	},
}
