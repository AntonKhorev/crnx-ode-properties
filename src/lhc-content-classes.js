'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

const LhcContent={}

// TODO get general solution w/o ivp solution
LhcContent.Base = class {
	constructor(x,form) {
		this.x=x
		this.form=form
	}
	getRepeatedGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],['e^{λ t}','e^{λ t}'],[1,0,'λ',1],[1,'t',0,1]
		)(false,false)(nt)
		/*
		// scalar
		return `${nt.x} = k_1 e^{λ t} + k_2 t e^{λ t}`
		// system
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 e^{λ t} + k_2 t e^{λ t} \\\\`+
			`${nt.y} &= (k_1 λ + k_2) e^{λ t} + k_2 λ t e^{λ t}`+
		`\\end{aligned} \\right.`
		// vector
		return `\\begin{aligned} `+
			`${nt.X} &= k_1 ${nt.vec2(1,'λ')} e^{λt} + k_2 ${nt.vec2('t','1{+}λt')} e^{λt} \\\\`+
			        `&= ${nt.mat2(1,'t','λ','1{+}λt')} ${nt.vec2('k_1','k_2')} e^{λt}`+
		`\\end{aligned}`
		*/
	}
	getRealGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],['e^{λ_1 t}','e^{λ_2 t}'],[1,1,'λ_1','λ_2']
		)(false,false)(nt)
		/*
		// scalar
		return `${nt.x} = k_1 e^{λ_1 t} + k_2 e^{λ_2 t}`
		// system
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 e^{λ_1 t} + k_2 e^{λ_2 t} \\\\`+
			`${nt.y} &= k_1 λ_1 e^{λ_1 t} + k_2 λ_2 e^{λ_2 t}`+
		`\\end{aligned} \\right.`
		// vector
		return `\\begin{aligned}`+
			`${nt.X} &= k_1 ${nt.vec2(1,'λ_1')} e^{λ_1 t} + k_2 ${nt.vec2(1,'λ_2')} e^{λ_2 t} \\\\`+
			        `&= ${nt.mat2(1,1,'λ_1','λ_2')} ${nt.vec2(`k_1 e^{λ_1 t}`,`k_2 e^{λ_2 t}`)}`+
		`\\end{aligned}`
		*/
	}
	getComplexGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],['e^{α t}','e^{α t}'],[1,0,'α','β'],['\\cos β t','\\sin β t','-\\sin β t','\\cos β t']
		)(true,true)(nt)
		/*
		// scalar
		return `${nt.x} = k_1 e^{α t} \\cos β t + k_2 e^{α t} \\sin β t`
		// system
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} = \\: & k_1 e^{α t} \\cos β t \\\\`+
				`+ \\: & k_2 e^{α t} \\sin β t \\\\`+
			`${nt.y} = \\: & k_1 e^{α t} (α \\cos β t - β \\sin β t) \\\\`+
				`+ \\: & k_2 e^{α t} (α \\sin β t + β \\cos β t)`+
		`\\end{aligned} \\right.`
		// vector
		return `\\begin{aligned} `+
			`${nt.X} = \\: & k_1 e^{α t} ${nt.vec2('\\cos β t','α \\cos β t - β \\sin β t')} \\\\`+
			        `+ \\: & k_2 e^{α t} ${nt.vec2('\\sin β t','α \\sin β t + β \\cos β t')} \\\\`+
			        `= \\: & e^{α t} ${nt.smat2(1,0,'α','β')} ${nt.smat2('\\cos β t','\\sin β t','- \\sin β t','\\cos β t')} ${nt.svec2('k_1','k_2')}`+
		`\\end{aligned}`
		*/
	}
	getImaginaryGeneralSolution(nt) {
		return this.x.generalLinearSolution(
			['k_1','k_2'],[1,1],[1,0,0,'β'],['\\cos β t','\\sin β t','-\\sin β t','\\cos β t']
		)(false,true)(nt)
		/*
		// scalar
		return `${nt.x} = k_1 \\cos β t + k_2 \\sin β t`
		// system
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 \\cos β t + k_2 \\sin β t \\\\`+
			`${nt.y} &= k_2 β \\cos β t - k_1 β \\sin β t`+
		`\\end{aligned} \\right.`
		// vector
		return `\\begin{aligned} `+
			`${nt.X} = \\: & k_1 ${nt.vec2('\\cos β t','-β \\sin β t')} \\\\`+
			        `+ \\: & k_2 ${nt.vec2('\\sin β t', 'β \\cos β t')} \\\\`+
			        `= \\: & ${nt.smat2(1,0,0,'β')} ${nt.smat2('\\cos β t','\\sin β t','- \\sin β t','\\cos β t')} ${nt.svec2('k_1','k_2')}`+
		`\\end{aligned}`
		*/
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

LhcContent.Scalar = class extends LhcContent.Base {
}

LhcContent.System = class extends LhcContent.Base {
}

LhcContent.Vector = class extends LhcContent.Base {
}

module.exports=LhcContent
