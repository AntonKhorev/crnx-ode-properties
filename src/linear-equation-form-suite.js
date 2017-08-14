'use strict'

class LinearEquationFormSuite {
	makeForm(equationFn) {
		return {
			equation: equationFn,
			// TODO characteristic eqn
		}
	}
	// abstract get classIdPrefix
	// abstract get highestOrderCoefficient()
	// abstract get systemFormType()
	getClassId(isConstant,isHomogeneous) {
		let classId=this.classIdPrefix+'_linear'
		if (isHomogeneous) classId+='Homogeneous'
		if (isConstant) classId+='Constant'
		return classId
	}
	getForms(isConstant,isHomogeneous) {
		const classId=this.getClassId(isConstant,isHomogeneous)
		return [
			{
				is: `t,x,linear_${classId}`,
				equation: this.linear.equation(isConstant)(isHomogeneous?0:'f'),
				notes: nt=>[
					`\\( `+this.highestOrderCoefficient+(isConstant?``:`(t)`)+` \\ne 0 \\)`+(isConstant?``:` on the entire interval of interest`),
				],
			},
			{
				is: `t,x,resolved_${classId}`,
				equation: this.resolved.equation(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,${this.systemFormType},system_${classId}`,
				equation: this.system.equation(isConstant)(isHomogeneous?0:'g'),
			},
			{
				is: `t,X,vector_${classId}`,
				equation: this.vector.equation(isConstant)(isHomogeneous?0:'g'),
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
					`\\[ `+this.linear.equation(isConstant)(0)(nt)+` \\]`,
					...note,
				],
				[`resolved_${classId}`]: nt=>[
					`\\[ `+this.resolved.equation(isConstant)(0)(nt)+` \\]`,
					...note,
				],
				[`system_${classId}`]: nt=>[
					`\\[ `+this.system.equation(isConstant)(0)(nt)+` \\]`,
					...note,
				],
				[`vector_${classId}`]: nt=>[
					`\\[ `+this.vector.equation(isConstant)(0)(nt)+` \\]`,
					...note,
				],
			},
		}
		if (isHomogeneous) {
			trait.close=true
		}
		return trait
	}
}

module.exports=LinearEquationFormSuite
