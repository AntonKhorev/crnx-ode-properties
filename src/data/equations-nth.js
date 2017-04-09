'use strict'

const characteristicEquationContent=require('../characteristic-equation-content')

const on_linear_linear_equation=(isHomogeneous,isConstant)=>nt=>(
	`\\sum_{i=0}^n a_i`+(isConstant?``:`(t)`)+` ${nt.dd(nt.x,'t','i')} = `+(isHomogeneous?`0`:`f(t)`)
)
const on_linear_resolved_equation=(isHomogeneous,isConstant)=>nt=>(
	`${nt.dd(nt.x,'t','n')} = \\sum_{i=0}^{n-1} b_i`+(isConstant?``:`(t)`)+` ${nt.dd(nt.x,'t','i')}`+(isHomogeneous?``:` + g(t)`)
)
const on_linear_system_equation=(isHomogeneous,isConstant)=>nt=>`\\left\\{ \\begin{array}{rcl}`+
	`${nt.dd(`${nt.x}_1`)} &=& ${nt.x}_2 \\\\`+
	`${nt.dd(`${nt.x}_2`)} &=& ${nt.x}_3 \\\\`+
	`&\\vdots \\\\`+
	`${nt.dd(`${nt.x}_{n-1}`)} &=& ${nt.x}_n \\\\`+
	`${nt.dd(`${nt.x}_n`)} &=& \\sum_{i=1}^{n} c_i`+(isConstant?``:`(t)`)+` ${nt.x}_i`+(isHomogeneous?``:` + g(t)`)+
`\\end{array} \\right.`
const on_linear_vector_equation=(isHomogeneous,isConstant)=>nt=>`${nt.dd(nt.X)} {=} `+(isHomogeneous?`\\begin{bmatrix}`:`\\! \\left[ \\begin{smallmatrix}`)+
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
(isHomogeneous?`\\end{bmatrix}`:`\\end{smallmatrix} \\right]`)+(isHomogeneous?``:` \\! ${nt.X} {+} \\! \\left[ \\begin{smallmatrix}`+
	`0 \\\\`+(isConstant?` 0 \\\\`:``)+` \\vdots \\\\ 0 \\\\ g(t)`+
`\\end{smallmatrix} \\right]`)

const on_linearHomogeneousConstant_generalSolutionMethod_content=(charEqn,x,isSystem,isVector)=>nt=>[
	`solve the characteristic equation for \\( λ \\):`,
	`\\[ ${charEqn} \\]`,
	`\\( λ \\) are:`,
	`\\( r \\) distinct real roots \\( λ_1, ..., λ_r \\) with multiplicities \\( p_1, ..., p_r \\)`,
	`\\( s \\) distinct complex conjugate root pairs \\( α_1 \\pm i β_1, ..., α_s \\pm i β_s \\) with multiplicities \\( q_1, ..., q_s \\)`,
	{type:'note',content:[
		`sum of multiplicities is equal to order of the equation:`,
		`\\[ \\sum_{i=1}^r p_i + 2 \\cdot \\sum_{i=1}^s q_i = n \\]`,
	]},
	((isSystem||isVector)?`first component of `:``)+`general solution (with arbitrary constants \\( K_{ij} \\), \\( A_{ij} \\), \\( B_{ij} \\)):`,
	`\\[ \\begin{aligned}`+
		`${x}`+(isSystem?`_1`:``)+
		` = \\: & \\sum_{i=1}^r \\sum_{j=1}^{p_i} K_{ij} \\, t^{j-1} \\, e^{λ_i t} + \\\\`+
		` + \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} A_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\cos β_i t \\\\`+
		` + \\: & \\sum_{i=1}^s \\sum_{j=1}^{q_i} B_{ij} \\, t^{j-1} \\, e^{α_i t} \\, \\sin β_i t`+
	`\\end{aligned} \\]`,
	...(isSystem?[
		`find other components by differentiating \\( ${nt.x}_1 \\):`,
		`\\[ \\begin{array}{rcl}`+
			`${nt.x}_2 &=& ${nt.dd(nt.x,'t',1)} \\\\`+
			`${nt.x}_3 &=& ${nt.dd(nt.x,'t',2)} \\\\`+
			`&\\vdots \\\\`+
			`${nt.x}_n &=& ${nt.dd(nt.x,'t','n-1')}`+
		`\\end{array} \\]`,
	]:[]),
	...(isVector?[
		`find other components by differentiating \\( ${nt.x} \\):`,
		`\\[ ${nt.X} = \\begin{bmatrix}`+
			`${nt.x} \\\\`+
			`${nt.dd(nt.x,'t',1)} \\\\`+
			`${nt.dd(nt.x,'t',2)} \\\\`+
			`\\vdots \\\\`+
			`${nt.dd(nt.x,'t','n-1')}`+
		`\\end{bmatrix} \\]`,
	]:[]),
]

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
				is: 't,x,linear_on_linearConstant',
				equation: on_linear_linear_equation(false,false),
				notes: nt=>[
					`\\( a_n(t) \\ne 0 \\) on the entire interval of interest`,
				],
			},
			{
				is: 't,x,resolved_on_linearConstant',
				equation: on_linear_resolved_equation(false,false),
			},
			{
				is: 't,xi,system_on_linearConstant',
				equation: on_linear_system_equation(false,false),
			},
			{
				is: 't,X,vector_on_linearConstant',
				equation: on_linear_vector_equation(false,false),
			},
		],
		traits: {
			associatedHomogeneousEquation: {
				contents: {
					linear_on_linearConstant: nt=>[
						`\\[ `+on_linear_linear_equation(true,false)(nt)+` \\]`,
					],
					resolved_on_linearConstant: nt=>[
						`\\[ `+on_linear_resolved_equation(true,false)(nt)+` \\]`,
					],
					system_on_linearConstant: nt=>[
						`\\[ `+on_linear_system_equation(true,false)(nt)+` \\]`,
					],
					vector_on_linearConstant: nt=>[
						`\\[ `+on_linear_vector_equation(true,false)(nt)+` \\]`,
					],
				},
			},
			generalSolutionMethod: {
				contents: {
					linear_on_linearConstant: nt=>[
						`find the general solution \\( ${nt.x}_h \\) of the associated homogeneous equation`,
						{type:'switch',title:`find a particular solution \\( ${nt.x}_p \\) of the original equation`,content:[
							{type:'case',title:`using superposition when \\( f(t) = k_1 f_1(t) + k_2 f_2(t) + \\cdots \\)`,content:[
								`for each term \\( k_i f_i(t) \\), find a particular solution \\( ${nt.x}_{p,i} \\) of:`,
								`\\[ \\sum_{i=0}^n a_i(t) ${nt.dd(nt.x,'t','i')} = f_i(t) \\]`,
								`particular solution of the original equation is a linear combinations of these solutions:`,
								`\\[ ${nt.x}_p = k_1 ${nt.x}_{p,1} + k_2 ${nt.x}_{p,2} + \\cdots \\]`,
							]},
						]},
						`general solution (with arbitrary constants included in \\( ${nt.x}_h \\)):`,
						`\\[ ${nt.x} = ${nt.x}_h + ${nt.x}_p \\]`,
					],
				},
			},
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
				equation: on_linear_linear_equation(false,true),
				notes: nt=>[
					`\\( a_n \\ne 0 \\)`,
				],
			},
			{
				is: 't,x,resolved_on_linearConstant',
				equation: on_linear_resolved_equation(false,true),
			},
			{
				is: 't,xi,system_on_linearConstant',
				equation: on_linear_system_equation(false,true),
			},
			{
				is: 't,X,vector_on_linearConstant',
				equation: on_linear_vector_equation(false,true),
			},
		],
		traits: {
			associatedHomogeneousEquation: {
				contents: {
					linear_on_linearConstant: nt=>[
						`\\[ `+on_linear_linear_equation(true,true)(nt)+` \\]`,
					],
					resolved_on_linearConstant: nt=>[
						`\\[ `+on_linear_resolved_equation(true,true)(nt)+` \\]`,
					],
					system_on_linearConstant: nt=>[
						`\\[ `+on_linear_system_equation(true,true)(nt)+` \\]`,
					],
					vector_on_linearConstant: nt=>[
						`\\[ `+on_linear_vector_equation(true,true)(nt)+` \\]`,
					],
				},
			},
			generalSolutionMethod: {
				contents: {
					linear_on_linearConstant: nt=>[
						{type:'extra',title:`find the general solution \\( ${nt.x}_h \\) of the associated homogeneous equation`,
							content: on_linearHomogeneousConstant_generalSolutionMethod_content(`\\sum_{i=0}^n a_i λ^i = 0`,`${nt.x}_h`)(nt),
						},
						{type:'switch',title:`find a particular solution \\( ${nt.x}_p \\) of the original equation`,content:[
							{type:'case',title:`using superposition when \\( f(t) = k_1 f_1(t) + k_2 f_2(t) + \\cdots \\)`,content:[
								`for each term \\( k_i f_i(t) \\), find a particular solution \\( ${nt.x}_{p,i} \\) of:`,
								`\\[ \\sum_{i=0}^n a_i ${nt.dd(nt.x,'t','i')} = f_i(t) \\]`,
								`particular solution of the original equation is a linear combinations of these solutions:`,
								`\\[ ${nt.x}_p = k_1 ${nt.x}_{p,1} + k_2 ${nt.x}_{p,2} + \\cdots \\]`,
							]},
						]},
						`general solution (with arbitrary constants included in \\( ${nt.x}_h \\)):`,
						`\\[ ${nt.x} = ${nt.x}_h + ${nt.x}_p \\]`,
					],
				},
			},
		},
	},
	on_linearHomogeneousConstant: {
		parents: {
			on_linearConstant: true,
		},
		name: "nth-order linear homogeneous with constant coefficients",
		htmlName: "<em>n</em>th-order <a href='https://en.wikipedia.org/wiki/Linear_differential_equation#Homogeneous_equations_with_constant_coefficients'>linear homogeneous with constant coefficients</a>",
		importance: 2,
		forms: [
			{
				is: 't,x,linear_on_linearHomogeneousConstant',
				equation: on_linear_linear_equation(true,true),
				notes: nt=>[
					`\\( a_n \\ne 0 \\)`,
				],
			},
			{
				is: 't,x,resolved_on_linearHomogeneousConstant',
				equation: on_linear_resolved_equation(true,true),
			},
			{
				is: 't,xi,system_on_linearHomogeneousConstant',
				equation: on_linear_system_equation(true,true),
			},
			{
				is: 't,X,vector_on_linearHomogeneousConstant',
				equation: on_linear_vector_equation(true,true),
			},
		],
		traits: {
			characteristicEquation: {
				contents: {
					linear_on_linearHomogeneousConstant:   characteristicEquationContent(['i','\\sum_{i=0}^n a_i'],'=','0'),
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
					linear_on_linearHomogeneousConstant:   nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(`\\sum_{i=0}^n a_i λ^i = 0`,nt.x)(nt),
					resolved_on_linearHomogeneousConstant: nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(`λ^n - \\sum_{i=0}^{n-1} b_i λ^i = 0`,nt.x)(nt),
					system_on_linearHomogeneousConstant:   nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0`,nt.x,true)(nt),
					vector_on_linearHomogeneousConstant:   nt=>on_linearHomogeneousConstant_generalSolutionMethod_content(`λ^n - \\sum_{i=0}^{n-1} c_{i+1} λ^i = 0`,nt.x,false,true)(nt),
				},
			},
			equilibriumSolutionMethod: {
				contents: {
					linear_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( a_0 \\) is`,content:[
							{type:'case',title:`\\( a_0 = 0 \\)`,content:[
								`\\[ ${nt.x} = K \\]`,
							]},
							{type:'case',title:`\\( a_0 \\ne 0 \\)`,content:[
								`\\[ ${nt.x} = 0 \\]`,
							]},
						]},
					],
					resolved_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( b_0 \\) is`,content:[
							{type:'case',title:`\\( b_0 = 0 \\)`,content:[
								`\\[ ${nt.x} = K \\]`,
							]},
							{type:'case',title:`\\( b_0 \\ne 0 \\)`,content:[
								`\\[ ${nt.x} = 0 \\]`,
							]},
						]},
					],
					system_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( c_1 \\) is`,content:[
							{type:'case',title:`\\( c_1 = 0 \\)`,content:[
								`\\[ \\left\\{ \\begin{array}{rcl}`+
									`${nt.x}_1 &=& K \\\\`+
									`${nt.x}_2 &=& 0 \\\\`+
									`&\\vdots \\\\`+
									`${nt.x}_n &=& 0 \\\\`+
								`\\end{array} \\right. \\]`,
							]},
							{type:'case',title:`\\( c_1 \\ne 0 \\)`,content:[
								`\\[ \\left\\{ \\begin{array}{rcl}`+
									`${nt.x}_1 &=& 0 \\\\`+
									`&\\vdots \\\\`+
									`${nt.x}_n &=& 0 \\\\`+
								`\\end{array} \\right. \\]`,
							]},
						]},
					],
					vector_on_linearHomogeneousConstant: nt=>[
						{type:'switch',title:`\\( c_1 \\) is`,content:[
							{type:'case',title:`\\( c_1 = 0 \\)`,content:[
								`\\[ ${nt.X} = \\begin{bmatrix} K \\\\ 0 \\\\ \\vdots \\\\ 0 \\end{bmatrix} \\]`,
							]},
							{type:'case',title:`\\( c_1 \\ne 0 \\)`,content:[
								`\\[ ${nt.X} = \\begin{bmatrix} 0 \\\\ \\vdots \\\\ 0 \\end{bmatrix} \\]`,
							]},
						]},
					],
				},
			},
		},
	},
}
