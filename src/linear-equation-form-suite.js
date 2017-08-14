'use strict'

class LinearEquationFormSuite {
	makeForm(equationFn) {
		return {
			equation: equationFn,
			// TODO characteristic eqn
		}
	}
	// abstract get highestOrderCoefficient()
	// abstract get systemFormType()
	getForms(classId,isConstant,isHomogeneous) {
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
}

module.exports=LinearEquationFormSuite
