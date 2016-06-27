'use strict'

module.exports=(nt)=>({
	sn: {
		parents: {},
		name: "system of n first-order",
		htmlName: "system of <em>n</em> first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{array}{c}`+
				`${nt.dd(`${nt.x}_1`)} = f_1(t,${nt.x}_1,…,${nt.x}_n) \\\\`+
				`\\vdots \\\\`+
				`${nt.dd(`${nt.x}_n`)} = f_n(t,${nt.x}_1,…,${nt.x}_n)`+
			`\\end{array} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{F}(t,${nt.X})`,
		traits: {
			testSolutionMethod: {
				content: [
					`Can test if \\( ${nt.X}_p \\) is a solution by substituting \\( ${nt.X} = ${nt.X}_p \\) into the equation.`,
				],
			},
		},
	},
	s2: {
		parents: {
			sn: true,
		},
		name: "system of 2 first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= f(t,${nt.x},${nt.y}) \\\\`+
				`${nt.dd(nt.y)} &= g(t,${nt.x},${nt.y})`+
			`\\end{aligned} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{F}(t,${nt.X})`,
		traits: {},
	},
	s2_partlyDecoupled: {
		parents: {
			s2: true,
		},
		name: "partly decoupled system of 2 first-order",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= f(t,${nt.x},${nt.y}) \\\\`+
				`${nt.dd(nt.y)} &= g(t,${nt.y})`+
			`\\end{aligned} \\right.`,
		traits: {
			generalSolutionMethod: {
				form: true,
				content: [
					`Solve \\(${nt.dd(nt.y)} = g(t,${nt.y}) \\).`,
					`Substitute \\( ${nt.y} \\) into \\( ${nt.dd(nt.x)} = f(t,${nt.x},${nt.y}) \\).`,
				],
			},
		},
	},
	s2_autonomous: {
		parents: {
			s2: true,
		},
		name: "system of 2 first-order autonomous",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= f(${nt.x},${nt.y}) \\\\`+
				`${nt.dd(nt.y)} &= g(${nt.x},${nt.y})`+
			`\\end{aligned} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{F}(${nt.X})`,
		traits: {},
	},
	s2_linearHomogeneousConstant: {
		parents: {
			s2_autonomous: true,
		},
		name: "system of 2 first-order linear homogeneous equations with constant coefficients",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd(nt.x)} &= a_{${nt.x}${nt.x}} ${nt.x} + a_{${nt.x}${nt.y}} ${nt.y} \\\\`+
				`${nt.dd(nt.y)} &= a_{${nt.y}${nt.x}} ${nt.x} + a_{${nt.y}${nt.y}} ${nt.y}`+
			`\\end{aligned} \\right.`,
		vectorEquation: `${nt.dd(nt.X)} = \\mathbf{A} ${nt.X}`,
		traits: {
			characteristicEquation: {
				form: true,
				content: [
					`\\[ \\det(\\mathbf{A} - \\lambda \\mathbf{I}) = 0 \\]`,
					{type:'note',content:[
						`\\( \\lambda \\) is an eigenvalue of \\( \\mathbf{A} \\)`,
					]},
				],
			},
			generalSolutionMethod: {
				form: true,
				content: [
					{type:'cases',content:[
						{type:'case',title:`\\( a_{${nt.x}${nt.y}} = a_{${nt.y}${nt.x}} = 0 \\)`,content:[
							`\\[ ${nt.ddt} ${nt.vec2(nt.x,nt.y)} = ${nt.mat2('\\lambda_1',0,0,'\\lambda_2')} ${nt.vec2(nt.x,nt.y)} \\]`+
							`\\[ ${nt.X} = ${nt.x}_0 e^{\\lambda_1 t} ${nt.vec2(1,0)} + ${nt.y}_0 e^{\\lambda_2 t} ${nt.vec2(0,1)} \\]`,
						]},
						{type:'case',title:`\\( a_{${nt.x}${nt.y}} \\neq 0 \\) or \\( a_{${nt.y}${nt.x}} \\neq 0 \\)`,content:[
							`solve characteristic equation for \\( \\lambda \\)`,
							{type:'cases',content:[
								{type:'case',title:`repeated \\( \\lambda \\)`,content:[
									`TODO`,
								]},
								{type:'case',title:`real distinct \\( \\lambda_1 \\), \\( \\lambda_2 \\)`,content:[
									`TODO`,
								]},
								{type:'case',title:`complex conjugate pair \\( \\lambda = \\alpha \\pm \\beta i \\)`,content:[
									`TODO`,
								]},
							]},
						]},
					]},
				],
			}
		},
	},
	sn_sir: {
		parents: {
			sn: true,
		},
		name: "SIR model",
		htmlName: "<a href='https://en.wikipedia.org/w/index.php?title=SIR_model'>SIR</a> model",
		importance: 3,
		equation:
			`\\left\\{ \\begin{aligned}`+
				`${nt.dd('S')} &= -\\alpha S I \\\\`+
				`${nt.dd('I')} &= \\alpha S I - \\beta I \\\\ `+
				`${nt.dd('R')} &= \\beta I`+
			`\\end{aligned} \\right.`,
		equationNotes: [
			`\\( S = \\) number susceptible`,
			`\\( I = \\) number infectious`,
			`\\( R = \\) number recovered (immune)`,
			`\\( \\alpha = \\) contact rate`,
			`\\( \\beta = \\) recovery rate`,
			`all quantities are nonnegative`,
		],
		traits: {
			phaseSolutionMethod: {
				form: true,
				content: [
					`threshold value \\( \\rho = \\frac\\beta\\alpha \\):`,
					`\\( I \\) increases when \\( S &gt; \\rho \\)`,
					`\\( S \\) decreases`,
					`\\( I \\) attains its maximum when \\( S = \\rho \\)`,
					{type:'derivation',content:[
						`\\[ ${nt.dd('S')} + ${nt.dd('I')} + ${nt.dd('R')} = 0 \\]`,
						`total population \\( N \\) is constant`,
						`\\[ S + I + R = N \\]`,
						`eliminate \\( R \\)`,
						`\\[ \\left\\{ \\begin{aligned} `+
							`${nt.dd('S')} &= -\\alpha S I \\\\ `+
							`${nt.dd('I')} &= \\alpha S I - \\beta I \\\\ `+
						`\\end{aligned} \\right. \\]`,
						`\\[ ${nt.dd('I','S')} = \\frac{\\alpha S I - \\beta I}{-\\alpha S I} = -1 + \\frac{\\rho}{S} \\]`,
						`integrate by \\( S \\)`,
						`\\[ I = -S + \\rho \\ln S + C \\]`,
					]},
					`conserved quantities:`,
					`\\[ \\begin{multline}`+
						`S(t) + I(t) + R(t) = \\\\ `+
						`= S(0) + I(0) + R(0) `+
					`\\end{multline} \\]`,
					`\\[ \\begin{multline}`+
						`I(t) + S(t) - \\rho \\ln S(t) = \\\\ `+
						`= I(0) + S(0) - \\rho \\ln S(0) `+
					`\\end{multline} \\]`,
					`maximum of \\( I \\):`,
					`\\[ \\begin{multline}`+
						`I_{max} + \\rho - \\rho \\ln \\rho = \\\\ `+
						`= I(0) + S(0) - \\rho \\ln S(0) `+
					`\\end{multline} \\]`,
				],
			},
			equilibriumSolutionMethod: {
				form: true,
				content: [
					`\\[ I = 0 \\]`,
				],
			},
		},
	},
})
