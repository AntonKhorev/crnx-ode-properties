'use strict'

// const characteristicEquationContent=require('./characteristic-equation-content')

class LinearEquationFormSuite {
	makeConstantForm(equationFn,characteristicPolynomialFn,equationCoefs) {
		const form1=input=>equationFn(true)(input)
		form1.equationCoefs=equationCoefs
		form1.characteristicPolynomial=characteristicPolynomialFn
		form1.characteristicEquation=nt=>characteristicPolynomialFn(nt)+` = 0`
		return form1
	}
	makeForm(equationFn,characteristicPolynomialFn,equationCoefs) {
		return isConstant=>{
			if (isConstant) {
				return this.makeConstantForm(equationFn,characteristicPolynomialFn,equationCoefs)
			} else {
				return equationFn(false)
			}
		}
	}
	// abstract get classIdPrefix
	getClassId(isConstant,isHomogeneous) {
		let classId=this.classIdPrefix+'_linear'
		if (isHomogeneous) classId+='Homogeneous'
		if (isConstant) classId+='Constant'
		return classId
	}
	// abstract get highestOrderCoefficient()
	// abstract get systemFormType()
	getForms(isConstant,isHomogeneous) {
		const classId=this.getClassId(isConstant,isHomogeneous)
		return [
			{
				is: `t,x,linear_${classId}`,
				equation: this.linear(isConstant)(isHomogeneous?0:'f'),
				notes: nt=>[
					`\\( `+this.highestOrderCoefficient+(isConstant?``:`(t)`)+` \\ne 0 \\)`+(isConstant?``:` on the entire interval of interest`),
				],
			},
			{
				is: `t,x,resolved_${classId}`,
				equation: this.resolved(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,${this.systemFormType},system_${classId}`,
				equation: this.system(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,X,vector_${classId}`,
				equation: this.vector(isConstant)(isHomogeneous?0:'g'),
			},
		]
	}
	getAssociatedHomogeneousEquationTrait(isConstant,isHomogeneous) {
		const classId=this.getClassId(isConstant,isHomogeneous)
		const note=isHomogeneous?[
			{type:'note',content:[
				`the equation is associated with itself`,
			]},
		]:[]
		const trait={
			contents: {
				[`linear_${classId}`]: nt=>[
					`\\[ `+this.linear(isConstant)(0)(nt)+` \\]`,
					...note,
				],
				[`resolved_${classId}`]: nt=>[
					`\\[ `+this.resolved(isConstant)(0)(nt)+` \\]`,
					...note,
				],
				[`system_${classId}`]: nt=>[
					`\\[ `+this.system(isConstant)(0)(nt)+` \\]`,
					...note,
				],
				[`vector_${classId}`]: nt=>[
					`\\[ `+this.vector(isConstant)(0)(nt)+` \\]`,
					...note,
				],
			},
		}
		if (isHomogeneous) {
			trait.close=true
		}
		return trait
	}
	// abstract getEquilibriumSolutionMethodTrait(isConstant) // assumed to be homogeneous
}

module.exports=LinearEquationFormSuite
