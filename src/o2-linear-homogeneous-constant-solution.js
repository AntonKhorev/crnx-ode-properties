'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

class O2LinearHomogeneousConstantSolution {
	constructor(x,form) {
		this.x=x
		this.form=form
	}
	getSolution(solveIvp) {
		return this.frameSolution(nt=>[
			{type:'switch',title:`roots \\( λ \\) are`,content:[
				{type:'case',title:`repeated \\( ( λ_1 = λ_2 = λ ) \\)`,
					content:this.getSolutionCase_Repeated(solveIvp)(nt)
				},
				{type:'case',title:`real distinct \\( ( λ_1 \\ne λ_2; λ_1, λ_2 \\in \\mathbb{R} ) \\)`,
					content:this.getSolutionCase_Real(solveIvp)(nt)
				},
				{type:'case',title:`complex conjugate pair \\( ( λ = α \\pm i β; β \\ne 0 ) \\)`,
					content:this.getSolutionCase_Complex(solveIvp)(nt)
				},
			]},
		])
	}
	getSolution_Repeated(solveIvp) {
		return this.frameSolution(nt=>[
			`roots \\( λ \\) are going to be repeated:`,
			`\\[ λ_1 = λ_2 = λ \\]`,
			...this.getSolutionCase_Repeated(solveIvp)(nt)
		])
	}
	getSolution_Real(solveIvp) {
		return this.frameSolution(nt=>[
			`roots \\( λ \\) are going to be real distinct:`,
			`\\[ λ_1 \\ne λ_2 \\]`,
			`\\[ λ_1, λ_2 \\in \\mathbb{R} \\]`,
			...this.getSolutionCase_Real(solveIvp)(nt)
		])
	}
	getSolution_Complex(solveIvp) {
		return this.frameSolution(nt=>[
			`roots \\( λ \\) are going to be complex conjugate:`,
			`\\[ λ = α \\pm i β \\]`,
			`\\[ β \\ne 0 \\]`,
			...this.getSolutionCase_Complex(solveIvp)(nt)
		])
	}
	getSolution_Imaginary(solveIvp) {
		return this.frameSolution(nt=>[
			`roots \\( λ \\) are going to be complex conjugate:`,
			`\\[ λ = \\pm i β = \\pm ${this.form.naturalFrequency} \\]`,
			...this.getSolutionCase_Imaginary(solveIvp)(nt)
		])
	}

	// private:
	frameSolution(specificLines) {
		return nt=>[
			`solve characteristic equation for \\( λ \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			...specificLines(nt)
		]
	}
	getSolutionCase_Repeated(solveIvp) {
		return this.frameSolutionCase(
			['e^{λ t}','e^{λ t}'],[1,0,'λ',1],[1,'t',0,1]
		)(false,false)(solveIvp,[1,0,'λ',1])
	}
	getSolutionCase_Real(solveIvp) {
		return this.frameSolutionCase(
			['e^{λ_1 t}','e^{λ_2 t}'],[1,1,'λ_1','λ_2']
		)(false,false)(solveIvp,[1,1,'λ_1','λ_2'])
	}
	getSolutionCase_Complex(solveIvp) {
		return this.frameSolutionCase(
			['e^{α t}','e^{α t}'],[1,0,'α','β'],['\\cos β t','\\sin β t','-\\sin β t','\\cos β t']
		)(true,true,true)(solveIvp,[1,0,'α','β'])
	}
	getSolutionCase_Imaginary(solveIvp) {
		return this.frameSolutionCase(
			[1,1],[1,0,0,'β'],['\\cos β t','\\sin β t','-\\sin β t','\\cos β t']
		)(false,true,true)(solveIvp,[1,0,0,'β'])
	}
	frameSolutionCase(solutionExpVector,solutionCoefMatrix1,solutionCoefMatrix2) {
		return (...solutionFormatting)=>(solveIvp,ivpMatrix)=>nt=>[
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			...this.x.generalLinearSolution(
				['k_1','k_2'],solutionExpVector,solutionCoefMatrix1,solutionCoefMatrix2
			)(...solutionFormatting)(nt),
			...(solveIvp?[
				`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
				...this.x.ICLinearSystemSolution(ivpMatrix,['k_1','k_2'])(nt),
			]:[]),
		]
	}
}

module.exports=O2LinearHomogeneousConstantSolution
