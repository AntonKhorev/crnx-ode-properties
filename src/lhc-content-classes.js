'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

// TODO get general solution w/o ivp solution
class LhcContent {
	constructor(x,form) {
		this.x=x
		this.form=form
	}
	getRepeatedGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],['e^{λ t}','e^{λ t}'],[1,0,'λ',1],[1,'t',0,1]
		)(false,false)(nt)
	}
	getRealGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],['e^{λ_1 t}','e^{λ_2 t}'],[1,1,'λ_1','λ_2']
		)(false,false)(nt)
	}
	getComplexGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],['e^{α t}','e^{α t}'],[1,0,'α','β'],['\\cos β t','\\sin β t','-\\sin β t','\\cos β t']
		)(true,true,true)(nt)
	}
	getImaginaryGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],[1,1],[1,0,0,'β'],['\\cos β t','\\sin β t','-\\sin β t','\\cos β t']
		)(false,true,true)(nt)
	}

	getGeneralSolutionRepeatedCase(nt) {
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			...this.getRepeatedGeneralSolution(nt),
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			...this.x.ICLinearSystemSolution([1,0,'λ',1],['k_1','k_2'])(nt),
		]
	}
	getGeneralSolutionRealCase(nt) {
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			...this.getRealGeneralSolution(nt),
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			...this.x.ICLinearSystemSolution([1,1,'λ_1','λ_2'],['k_1','k_2'])(nt),
		]
	}
	getGeneralSolutionComplexCase(nt) {
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			...this.getComplexGeneralSolution(nt),
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			...this.x.ICLinearSystemSolution([1,0,'α','β'],['k_1','k_2'])(nt),
		]
	}
	getGeneralSolutionImaginaryCase(nt) {
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			...this.getImaginaryGeneralSolution(nt),
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			...this.x.ICLinearSystemSolution([1,0,0,'β'],['k_1','k_2'])(nt),
		]
	}
	getContentFor_generalSolutionMethod_Repeated() {
		return nt=>[
			`solve characteristic equation for \\( λ \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( λ \\) are going to be repeated:`,
			`\\[ λ_1 = λ_2 = λ \\]`,
			...this.getGeneralSolutionRepeatedCase(nt),
		]
	}
	getContentFor_generalSolutionMethod_Real() {
		return nt=>[
			`solve characteristic equation for \\( λ \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( λ \\) are going to be real distinct:`,
			`\\[ λ_1 \\ne λ_2 \\]`,
			`\\[ λ_1, λ_2 \\in \\mathbb{R} \\]`,
			...this.getGeneralSolutionRealCase(nt),
		]
	}
	getContentFor_generalSolutionMethod_Complex() {
		return nt=>[
			`solve characteristic equation for \\( λ \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( λ \\) are going to be complex conjugate:`,
			`\\[ λ = α \\pm i β \\]`,
			`\\[ β \\ne 0 \\]`,
			...this.getGeneralSolutionComplexCase(nt),
		]
	}
	getContentFor_generalSolutionMethod_Imaginary() {
		return nt=>[
			`solve characteristic equation for \\( λ \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( λ \\) are going to be complex conjugate:`,
			`\\[ λ = \\pm i β = \\pm ${this.form.naturalFrequency} \\]`,
			...this.getGeneralSolutionImaginaryCase(nt),
		]
	}
	getContentFor_generalSolutionMethod() {
		return nt=>[
			`solve characteristic equation for \\( λ \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			{type:'switch',title:`roots \\( λ \\) are`,content:[
				{type:'case',title:`repeated \\( ( λ_1 = λ_2 = λ ) \\)`,
					content:this.getGeneralSolutionRepeatedCase(nt)
				},
				{type:'case',title:`real distinct \\( ( λ_1 \\ne λ_2; λ_1, λ_2 \\in \\mathbb{R} ) \\)`,
					content:this.getGeneralSolutionRealCase(nt)
				},
				{type:'case',title:`complex conjugate pair \\( ( λ = α \\pm i β; β \\ne 0 ) \\)`,
					content:this.getGeneralSolutionComplexCase(nt)
				},
			]},
		]
	}
}

module.exports=LhcContent
