'use strict'

const TexScalarDepvar=require('../tex-scalar-depvar')
const TexSystemDepvar=require('../tex-system-depvar')
const TexVectorDepvar=require('../tex-vector-depvar')
const characteristicEquationContent=require('../characteristic-equation-content')

const on_linear_linear_equation=(input,isConstant)=>nt=>(
	`\\sum_{i=0}^n a_i`+(isConstant?``:`(t)`)+` ${nt.dd(nt.x,'t','i')} = `+(input?`${input}(t)`:`0`)
)
const on_linear_resolved_equation=(input,isConstant)=>nt=>(
	`${nt.dd(nt.x,'t','n')} = \\sum_{i=0}^{n-1} b_i`+(isConstant?``:`(t)`)+` ${nt.dd(nt.x,'t','i')}`+(input?` + ${input}(t)`:``)
)
const on_linear_system_equation=(input,isConstant)=>nt=>`\\left\\{ \\begin{array}{rcl}`+
	`${nt.dd(`${nt.x}_1`)} &=& ${nt.x}_2 \\\\`+
	`${nt.dd(`${nt.x}_2`)} &=& ${nt.x}_3 \\\\`+
	`&\\vdots \\\\`+
	`${nt.dd(`${nt.x}_{n-1}`)} &=& ${nt.x}_n \\\\`+
	`${nt.dd(`${nt.x}_n`)} &=& \\sum_{i=1}^{n} c_i`+(isConstant?``:`(t)`)+` ${nt.x}_i`+(input?` + ${input}(t)`:``)+
`\\end{array} \\right.`
const on_linear_vector_equation=(input,isConstant)=>nt=>`${nt.dd(nt.X)} {=} `+
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

const extraSection=(title,content)=>(content!==undefined
	? {type:'extra',title,content}
	: title
)

const on_linear_generalSolutionMethod_content=(x,f,equation,generalSolution)=>nt=>[
	extraSection(`find the general solution \\( ${x._('h')} \\) of the associated homogeneous equation`,generalSolution),
	{type:'switch',title:`find a particular solution \\( ${x._('p')} \\) of the original equation`,content:[
		{type:'case',title:`using superposition when \\( ${f}(t) = k_1 ${f}_1(t) + k_2 ${f}_2(t) + \\cdots \\)`,content:[
			`for each term \\( k_j ${f}_j(t) \\), find a particular solution \\( ${x._('p','j')} \\) of:`,
			`\\[ ${equation(`${f}_j`,false)(nt)} \\]`,
			`particular solution of the original equation is a linear combinations of these solutions:`,
			x._('p').parallelAssignment(xp=>`k_1 ${xp._(1)} + k_2 ${xp._(2)} + \\cdots`),
		]},
	]},
	`general solution (with arbitrary constants included in \\( ${x._('h')}) \\):`,
	x.parallelAssignment(x=>`${x._('h')} + ${x._('p')}`)
]

const on_linearHomogeneousConstant_generalSolutionMethod_content=(x,charEqn)=>nt=>[
	`solve the characteristic equation for \\( λ \\):`,
	`\\[ ${charEqn} \\]`,
	`\\( λ \\) are:`,
	`\\( r \\) distinct real roots \\( λ_1, ..., λ_r \\) with multiplicities \\( p_1, ..., p_r \\)`,
	`\\( s \\) distinct complex conjugate root pairs \\( α_1 \\pm i β_1, ..., α_s \\pm i β_s \\) with multiplicities \\( q_1, ..., q_s \\)`,
	{type:'note',content:[
		`sum of multiplicities is equal to order of the equation:`,
		`\\[ \\sum_{i=1}^r p_i + 2 \\cdot \\sum_{i=1}^s q_i = n \\]`,
	]},
	...x.firstRestDiff(
		x=>`general solution (with arbitrary constants \\( K_{ij} \\), \\( A_{ij} \\), \\( B_{ij} \\)):`,
		x1=>`\\[ \\begin{aligned}`+
			`${x1}`+
			` = \\: & \\sum_{i=1}^r \\sum_{j=1}^{p_i} K_{ij} \\, t^{j-1} \\, e^{λ_i t} + \\\\`+
			` + \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} A_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\cos β_i t \\\\`+
			` + \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} B_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\sin β_i t`+
		`\\end{aligned} \\]`
	)(nt),
]

const on_linear_associatedHomogeneousEquation_trait=(classId,isConstant,isClosed)=>{
	const note=isClosed?[
		{type:'note',content:[
			`the equation is associated with itself`,
		]},
	]:[]
	const trait={
		contents: {
			[`linear_${classId}`]: nt=>[
				`\\[ `+on_linear_linear_equation(0,isConstant)(nt)+` \\]`,
				...note,
			],
			[`resolved_${classId}`]: nt=>[
				`\\[ `+on_linear_resolved_equation(0,isConstant)(nt)+` \\]`,
				...note,
			],
			[`system_${classId}`]: nt=>[
				`\\[ `+on_linear_system_equation(0,isConstant)(nt)+` \\]`,
				...note,
			],
			[`vector_${classId}`]: nt=>[
				`\\[ `+on_linear_vector_equation(0,isConstant)(nt)+` \\]`,
				...note,
			],
		},
	}
	if (isClosed) {
		trait.close=true
	}
	return trait
}

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
		forms: [
			{
				is: 't,x,linear_on_linear',
				equation: on_linear_linear_equation('f',false),
				notes: nt=>[
					`\\( a_n(t) \\ne 0 \\) on the entire interval of interest`,
				],
			},
			{
				is: 't,x,resolved_on_linear',
				equation: on_linear_resolved_equation('g',false),
			},
			{
				is: 't,xi,system_on_linear',
				equation: on_linear_system_equation('g',false),
			},
			{
				is: 't,X,vector_on_linear',
				equation: on_linear_vector_equation('g',false),
			},
		],
		traits: {
			associatedHomogeneousEquation: on_linear_associatedHomogeneousEquation_trait('on_linear',false,false),
			generalSolutionMethod: {
				contents: {
					linear_on_linear:   nt=>on_linear_generalSolutionMethod_content(new TexScalarDepvar(nt.x),'f',on_linear_linear_equation)(nt),
					resolved_on_linear: nt=>on_linear_generalSolutionMethod_content(new TexScalarDepvar(nt.x),'g',on_linear_resolved_equation)(nt),
					system_on_linear:   nt=>on_linear_generalSolutionMethod_content(new TexSystemDepvar(nt.x),'g',on_linear_system_equation)(nt),
					vector_on_linear:   nt=>on_linear_generalSolutionMethod_content(new TexVectorDepvar(nt.X,nt.x),'g',on_linear_vector_equation)(nt),
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
		forms: [
			{
				is: 't,x,linear_on_linearHomogeneous',
				equation: on_linear_linear_equation(0,false),
				notes: nt=>[
					`\\( a_n(t) \\ne 0 \\) on the entire interval of interest`,
				],
			},
			{
				is: 't,x,resolved_on_linearHomogeneous',
				equation: on_linear_resolved_equation(0,false),
			},
			{
				is: 't,xi,system_on_linearHomogeneous',
				equation: on_linear_system_equation(0,false),
			},
			{
				is: 't,X,vector_on_linearHomogeneous',
				equation: on_linear_vector_equation(0,false),
			},
		],
		traits: {
			associatedHomogeneousEquation: on_linear_associatedHomogeneousEquation_trait('on_linearHomogeneous',false,true),
			generalSolutionMethod: {
				close: true,
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
		forms: [
			{
				is: 't,x,linear_on_linearConstant',
				equation: on_linear_linear_equation('f',true),
				notes: nt=>[
					`\\( a_n \\ne 0 \\)`,
				],
			},
			{
				is: 't,x,resolved_on_linearConstant',
				equation: on_linear_resolved_equation('g',true),
			},
			{
				is: 't,xi,system_on_linearConstant',
				equation: on_linear_system_equation('g',true),
			},
			{
				is: 't,X,vector_on_linearConstant',
				equation: on_linear_vector_equation('g',true),
			},
		],
		traits: {
			associatedHomogeneousEquation: on_linear_associatedHomogeneousEquation_trait('on_linearConstant',true,false),
			generalSolutionMethod: {
				contents: {
					linear_on_linearConstant: nt=>on_linear_generalSolutionMethod_content(
						new TexScalarDepvar(nt.x),'f',on_linear_linear_equation,
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexScalarDepvar(nt.x)._('h'),
							`\\sum_{i=0}^n a_i λ^i = 0`
						)(nt)
					)(nt),
					resolved_on_linearConstant: nt=>on_linear_generalSolutionMethod_content(
						new TexScalarDepvar(nt.x),'g',on_linear_resolved_equation,
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexScalarDepvar(nt.x)._('h'),
							`λ^n - \\sum_{i=0}^{n-1} b_i λ^i = 0`
						)(nt)
					)(nt),
					system_on_linearConstant: nt=>on_linear_generalSolutionMethod_content(
						new TexSystemDepvar(nt.x),'g',on_linear_system_equation,
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexSystemDepvar(nt.x)._('h'),
							`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0`
						)(nt)
					)(nt),
					vector_on_linearConstant: nt=>on_linear_generalSolutionMethod_content(
						new TexVectorDepvar(nt.X,nt.x),'g',on_linear_vector_equation,
						on_linearHomogeneousConstant_generalSolutionMethod_content(
							new TexVectorDepvar(nt.X,nt.x)._('h'),
							`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0`
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
		forms: [
			{
				is: 't,x,linear_on_linearHomogeneousConstant',
				equation: on_linear_linear_equation(0,true),
				notes: nt=>[
					`\\( a_n \\ne 0 \\)`,
				],
			},
			{
				is: 't,x,resolved_on_linearHomogeneousConstant',
				equation: on_linear_resolved_equation(0,true),
			},
			{
				is: 't,xi,system_on_linearHomogeneousConstant',
				equation: on_linear_system_equation(0,true),
			},
			{
				is: 't,X,vector_on_linearHomogeneousConstant',
				equation: on_linear_vector_equation(0,true),
			},
		],
		traits: {
			associatedHomogeneousEquation: on_linear_associatedHomogeneousEquation_trait('on_linearHomogeneousConstant',true,true),
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
						`\\sum_{i=0}^n a_i λ^i = 0`
					)(nt),
					resolved_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexScalarDepvar(nt.x),
						`λ^n - \\sum_{i=0}^{n-1} b_i λ^i = 0`
					)(nt),
					system_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexSystemDepvar(nt.x),
						`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0`
					)(nt),
					vector_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(
						new TexVectorDepvar(nt.X,nt.x),
						`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0`
					)(nt),
				},
			},
			equilibriumSolutionMethod: on_linearHomogeneous_equilibriumSolutionMethod_trait('on_linearHomogeneousConstant',true),
		},
	},
}
