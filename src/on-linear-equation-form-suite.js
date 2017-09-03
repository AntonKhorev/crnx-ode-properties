'use strict'

const LinearEquationFormSuite=require('./linear-equation-form-suite')

class OnLinearEquationFormSuite extends LinearEquationFormSuite {
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
	getEquilibriumSolutionMethodTrait(isConstant) {
		const classId=this.getClassId(isConstant,true)
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
}

module.exports=OnLinearEquationFormSuite
