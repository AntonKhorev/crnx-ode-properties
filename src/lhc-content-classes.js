'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

const LhcContent={}

LhcContent.Base = class {
	constructor(x,form) {
		this.x=x
		this.form=form
	}
	getGeneralSolutionConstantsEquation(nt,eigx1,eigx2,eigy1,eigy2) {
		return `${nt.mat2(eigx1,eigx2,eigy1,eigy2)} ${nt.vec2('k_1','k_2')} = ${this.getX0(nt)}`
	}
	getGeneralSolutionConstantsSolution(nt,kmatlead,kx1,ky1,kx2,ky2,eqn1,eqn2) {
		if (!(this instanceof LhcContent.Vector)) { // TODO check x type instead
			return `\\begin{aligned} `+
				`k_1 &= ${eqn1} \\\\ `+
				`k_2 &= ${eqn2} `+
			`\\end{aligned}`
		} else {
			return `${nt.vec2('k_1','k_2')} = ${kmatlead} ${nt.mat2(kx1,ky1,kx2,ky2)} ${this.getX0(nt)}`
		}
	}
	getGeneralSolutionRepeatedCase(nt) {
		const x0=this.getx0(nt)
		const y0=this.gety0(nt)
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			`\\[ ${this.getRepeatedGeneralSolution(nt)} \\]`,
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,'λ',1)} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'',1,0,'-λ',1,x0,`${y0} - λ \\cdot ${x0}`)} \\]`,
		]
	}
	getGeneralSolutionRealCase(nt) {
		const x0=this.getx0(nt)
		const y0=this.gety0(nt)
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			`\\[ ${this.getRealGeneralSolution(nt)} \\]`,
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,1,'λ_1','λ_2')} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'\\frac1{λ_2{-}λ_1}','λ_2',-1,'-λ_1',1,`\\frac{λ_2 \\cdot ${x0} - ${y0}}{λ_2 - λ_1}`,`\\frac{λ_1 \\cdot ${x0} - ${y0}}{λ_1 - λ_2}`)} \\]`,
		]
	}
	getGeneralSolutionComplexCase(nt) {
		const x0=this.getx0(nt)
		const y0=this.gety0(nt)
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			`\\[ ${this.getComplexGeneralSolution(nt)} \\]`,
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,'α','β')} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'\\frac1{β}','β',0,'-α',1,x0,`\\frac{${y0} - α \\cdot ${x0}}{β}`)} \\]`,
		]
	}
	getGeneralSolutionImaginaryCase(nt) {
		const x0=this.getx0(nt)
		const y0=this.gety0(nt)
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			`\\[ ${this.getImaginaryGeneralSolution(nt)} \\]`,
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,0,'β')} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'',1,0,0,'β^{-1}',x0,`\\frac{${y0}}{β}`)} \\]`,
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
	getX0(nt) {
		return nt.vec2(`${nt.x}(0)`,`${nt.x}'(0)`)
	}
	getx0(nt) {
		return `${nt.x}(0)`
	}
	gety0(nt) {
		return `${nt.x}'(0)`
	}
	getRepeatedGeneralSolution(nt) {
		return `${nt.x} = k_1 e^{λ t} + k_2 t e^{λ t}`
	}
	getRealGeneralSolution(nt) {
		return `${nt.x} = k_1 e^{λ_1 t} + k_2 e^{λ_2 t}`
	}
	getComplexGeneralSolution(nt) {
		return `${nt.x} = k_1 e^{α t} \\cos β t + k_2 e^{α t} \\sin β t`
	}
	getImaginaryGeneralSolution(nt) {
		return `${nt.x} = k_1 \\cos β t + k_2 \\sin β t`
	}
}

LhcContent.System = class extends LhcContent.Base {
	getX0(nt) {
		return nt.vec2(`${nt.x}(0)`,`${nt.y}(0)`)
	}
	getx0(nt) {
		return `${nt.x}(0)`
	}
	gety0(nt) {
		return `${nt.y}(0)`
	}
	getRepeatedGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 e^{λ t} + k_2 t e^{λ t} \\\\`+
			`${nt.y} &= (k_1 λ + k_2) e^{λ t} + k_2 λ t e^{λ t}`+
		`\\end{aligned} \\right.`
	}
	getRealGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 e^{λ_1 t} + k_2 e^{λ_2 t} \\\\`+
			`${nt.y} &= k_1 λ_1 e^{λ_1 t} + k_2 λ_2 e^{λ_2 t}`+
		`\\end{aligned} \\right.`
	}
	getComplexGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} = \\: & k_1 e^{α t} \\cos β t \\\\`+
				`+ \\: & k_2 e^{α t} \\sin β t \\\\`+
			`${nt.y} = \\: & k_1 e^{α t} (α \\cos β t - β \\sin β t) \\\\`+
				`+ \\: & k_2 e^{α t} (α \\sin β t + β \\cos β t)`+
		`\\end{aligned} \\right.`
	}
	getImaginaryGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 \\cos β t + k_2 \\sin β t \\\\`+
			`${nt.y} &= k_2 β \\cos β t - k_1 β \\sin β t`+
		`\\end{aligned} \\right.`
	}
}

LhcContent.Vector = class extends LhcContent.Base {
	getX0(nt) {
		return `${nt.X}(0)`
	}
	getx0(nt) {
		return `${nt.X}_1(0)`
	}
	gety0(nt) {
		return `${nt.X}_2(0)`
	}
	getRepeatedGeneralSolution(nt) {
		return `\\begin{aligned} `+
			`${nt.X} &= k_1 ${nt.vec2(1,'λ')} e^{λt} + k_2 ${nt.vec2('t','1{+}λt')} e^{λt} \\\\`+
			        `&= ${nt.mat2(1,'t','λ','1{+}λt')} ${nt.vec2('k_1','k_2')} e^{λt}`+
		`\\end{aligned}`
	}
	getRealGeneralSolution(nt) {
		return `\\begin{aligned}`+
			`${nt.X} &= k_1 ${nt.vec2(1,'λ_1')} e^{λ_1 t} + k_2 ${nt.vec2(1,'λ_2')} e^{λ_2 t} \\\\`+
			        `&= ${nt.mat2(1,1,'λ_1','λ_2')} ${nt.vec2(`k_1 e^{λ_1 t}`,`k_2 e^{λ_2 t}`)}`+
		`\\end{aligned}`
	}
	getComplexGeneralSolution(nt) {
		return `\\begin{aligned} `+
			`${nt.X} = \\: & k_1 e^{α t} ${nt.vec2('\\cos β t','α \\cos β t - β \\sin β t')} \\\\`+
			        `+ \\: & k_2 e^{α t} ${nt.vec2('\\sin β t','α \\sin β t + β \\cos β t')} \\\\`+
			        `= \\: & e^{α t} ${nt.smat2(1,0,'α','β')} ${nt.smat2('\\cos β t','\\sin β t','- \\sin β t','\\cos β t')} ${nt.svec2('k_1','k_2')}`+
		`\\end{aligned}`
	}
	getImaginaryGeneralSolution(nt) {
		return `\\begin{aligned} `+
			`${nt.X} = \\: & k_1 ${nt.vec2('\\cos β t','-β \\sin β t')} \\\\`+
			        `+ \\: & k_2 ${nt.vec2('\\sin β t', 'β \\cos β t')} \\\\`+
			        `= \\: & ${nt.smat2(1,0,0,'β')} ${nt.smat2('\\cos β t','\\sin β t','- \\sin β t','\\cos β t')} ${nt.svec2('k_1','k_2')}`+
		`\\end{aligned}`
	}
}

module.exports=LhcContent
