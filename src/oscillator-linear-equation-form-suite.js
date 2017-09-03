'use strict'

const O2LinearEquationFormSuite=require('./o2-linear-equation-form-suite')

class OscillatorLinearEquationFormSuite extends O2LinearEquationFormSuite {
	makeConstantForm(equationFn,characteristicPolynomialFn) {
		const form1=super.makeConstantForm(equationFn,characteristicPolynomialFn)
		form1.naturalFrequency=`\\sqrt{\\frac{${this.a0}}{${this.a2}}}`
		return form1
	}
	getClassId(isConstant,isHomogeneous) { // TODO forced/unforced
		if (this.a1!=0) {
			return 'o2_harmonicOscillator'
		} else {
			return 'o2_simpleHarmonicOscillator'
		}
	}
	getForms(isConstant,isHomogeneous,discriminantRelation) {
		const classId=this.getClassId(isConstant,isHomogeneous)
		const simpleClassId='o2_simpleHarmonicOscillator'
		return [
			{
				is: `t,x,`+(classId!=simpleClassId?`scalar_${simpleClassId},`:``)+`scalar_${classId},linear_${classId}`,
				equation: this.linear(isConstant)(isHomogeneous?0:'f'),
				notes: nt=>[ // TODO all-forms notes
					...(discriminantRelation!==undefined?[
						`\\[ ${this.a1}^2 ${discriminantRelation} 4 ${this.a2} ${this.a0} \\]`
					]:[]),
					`\\( ${this.a2} > 0 \\) is the mass`,
					...(this.a1!=0?[
						`\\( ${this.a1} \\ge 0 \\) is the viscous damping coefficient`,
					]:[]),
					`\\( ${this.a0} > 0 \\) is the spring constant`,
				],
			},
			{
				is: `t,x,`+(classId!=simpleClassId?`scalar_${simpleClassId},`:``)+`scalar_${classId},resolved_${classId}`,
				equation: this.resolved(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,${this.systemFormType},`+(classId!=simpleClassId?`system_${simpleClassId},`:``)+`system_${classId}`,
				equation: this.system(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,X,`+(classId!=simpleClassId?`vector_${simpleClassId},`:``)+`vector_${classId}`,
				equation: this.vector(isConstant)(isHomogeneous?0:'g'),
			},
		]
	}
}

module.exports=OscillatorLinearEquationFormSuite
