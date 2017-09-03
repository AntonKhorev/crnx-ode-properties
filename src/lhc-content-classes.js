'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

const LhcContent={}

LhcContent.Base = class {
	constructor(form) {
		this.form=form
	}
	getGeneralSolutionConstantsEquation(nt,eigx1,eigx2,eigy1,eigy2) {
		return `${nt.mat2(eigx1,eigx2,eigy1,eigy2)} ${nt.vec2('k_1','k_2')} = ${this.getX0(nt)}`
	}
	getGeneralSolutionConstantsSolution(nt,kmatlead,kx1,ky1,kx2,ky2,eqn1,eqn2) {
		if (!(this instanceof LhcContent.ReducedVector)) {
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
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,'\\lambda',1)} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'',1,0,'-\\lambda',1,x0,`${y0} - \\lambda \\cdot ${x0}`)} \\]`,
		]
	}
	getGeneralSolutionRealCase(nt) {
		const x0=this.getx0(nt)
		const y0=this.gety0(nt)
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			`\\[ ${this.getRealGeneralSolution(nt)} \\]`,
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,1,'\\lambda_1','\\lambda_2')} \\]`,
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
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,'\\alpha','\\beta')} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'\\frac1{\\beta}','\\beta',0,'-\\alpha',1,x0,`\\frac{${y0} - α \\cdot ${x0}}{β}`)} \\]`,
		]
	}
	getGeneralSolutionImaginaryCase(nt) {
		const x0=this.getx0(nt)
		const y0=this.gety0(nt)
		return [
			`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
			`\\[ ${this.getImaginaryGeneralSolution(nt)} \\]`,
			`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
			`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,0,'\\beta')} \\]`,
			`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'',1,0,0,'β^{-1}',x0,`\\frac{${y0}}{β}`)} \\]`,
		]
	}
	getContentFor_generalSolutionMethod_Repeated() {
		return nt=>[
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( \\lambda \\) are going to be repeated:`,
			`\\[ \\lambda_1 = \\lambda_2 = \\lambda \\]`,
			...this.getGeneralSolutionRepeatedCase(nt),
		]
	}
	getContentFor_generalSolutionMethod_Real() {
		return nt=>[
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( \\lambda \\) are going to be real distinct:`,
			`\\[ \\lambda_1 \\ne \\lambda_2 \\]`,
			`\\[ \\lambda_1, \\lambda_2 \\in \\mathbb{R} \\]`,
			...this.getGeneralSolutionRealCase(nt),
		]
	}
	getContentFor_generalSolutionMethod_Complex() {
		return nt=>[
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( \\lambda \\) are going to be complex conjugate:`,
			`\\[ \\lambda = \\alpha \\pm i \\beta \\]`,
			`\\[ \\beta \\ne 0 \\]`,
			...this.getGeneralSolutionComplexCase(nt),
		]
	}
	getContentFor_generalSolutionMethod_Imaginary() {
		return nt=>[
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			`roots \\( \\lambda \\) are going to be complex conjugate:`,
			`\\[ \\lambda = \\pm i \\beta = \\pm ${this.form.naturalFrequency} \\]`,
			...this.getGeneralSolutionImaginaryCase(nt),
		]
	}
	getContentFor_generalSolutionMethod() {
		return nt=>[
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${this.form.characteristicEquation(nt)} \\]`,
			{type:'switch',title:`roots \\( \\lambda \\) are`,content:[
				{type:'case',title:`repeated \\( ( \\lambda_1 = \\lambda_2 = \\lambda ) \\)`,
					content:this.getGeneralSolutionRepeatedCase(nt)
				},
				{type:'case',title:`real distinct \\( ( \\lambda_1 \\ne \\lambda_2; \\lambda_1, \\lambda_2 \\in \\mathbb{R} ) \\)`,
					content:this.getGeneralSolutionRealCase(nt)
				},
				{type:'case',title:`complex conjugate pair \\( ( \\lambda = \\alpha \\pm i \\beta; \\beta \\ne 0 ) \\)`,
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
		return `${nt.x} = k_1 e^{\\lambda t} + k_2 t e^{\\lambda t}`
	}
	getRealGeneralSolution(nt) {
		return `${nt.x} = k_1 e^{\\lambda_1 t} + k_2 e^{\\lambda_2 t}`
	}
	getComplexGeneralSolution(nt) {
		return `${nt.x} = k_1 e^{\\alpha t} \\cos \\beta t + k_2 e^{\\alpha t} \\sin \\beta t`
	}
	getImaginaryGeneralSolution(nt) {
		return `${nt.x} = k_1 \\cos \\beta t + k_2 \\sin \\beta t`
	}
}

LhcContent.Linear = class extends LhcContent.Scalar {}

LhcContent.Resolved = class extends LhcContent.Scalar {}

LhcContent.ReducedSystem = class extends LhcContent.Base {
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
			`${nt.x} &= k_1 e^{\\lambda t} + k_2 t e^{\\lambda t} \\\\`+
			`${nt.y} &= (k_1 \\lambda + k_2) e^{\\lambda t} + k_2 \\lambda t e^{\\lambda t}`+
		`\\end{aligned} \\right.`
	}
	getRealGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 e^{\\lambda_1 t} + k_2 e^{\\lambda_2 t} \\\\`+
			`${nt.y} &= k_1 \\lambda_1 e^{\\lambda_1 t} + k_2 \\lambda_2 e^{\\lambda_2 t}`+
		`\\end{aligned} \\right.`
	}
	getComplexGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} = \\: & k_1 e^{\\alpha t} \\cos \\beta t \\\\`+
				`+ \\: & k_2 e^{\\alpha t} \\sin \\beta t \\\\`+
			`${nt.y} = \\: & k_1 e^{\\alpha t} (\\alpha \\cos \\beta t - \\beta \\sin \\beta t) \\\\`+
				`+ \\: & k_2 e^{\\alpha t} (\\alpha \\sin \\beta t + \\beta \\cos \\beta t)`+
		`\\end{aligned} \\right.`
	}
	getImaginaryGeneralSolution(nt) {
		return `\\left\\{ \\begin{aligned}`+
			`${nt.x} &= k_1 \\cos \\beta t + k_2 \\sin \\beta t \\\\`+
			`${nt.y} &= k_2 \\beta \\cos \\beta t - k_1 \\beta \\sin \\beta t`+
		`\\end{aligned} \\right.`
	}
}

LhcContent.ReducedVector = class extends LhcContent.Base {
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
			`${nt.X} = \\: & k_1 e^{\\alpha t} ${nt.vec2('\\cos \\beta t','\\alpha \\cos \\beta t - \\beta \\sin \\beta t')} \\\\`+
			        `+ \\: & k_2 e^{\\alpha t} ${nt.vec2('\\sin \\beta t','\\alpha \\sin \\beta t + \\beta \\cos \\beta t')} \\\\`+
			        `= \\: & e^{\\alpha t} ${nt.smat2(1,0,'\\alpha','\\beta')} ${nt.smat2('\\cos \\beta t','\\sin \\beta t','- \\sin \\beta t','\\cos \\beta t')} ${nt.svec2('k_1','k_2')}`+
		`\\end{aligned}`
	}
	getImaginaryGeneralSolution(nt) {
		return `\\begin{aligned} `+
			`${nt.X} = \\: & k_1 ${nt.vec2('\\cos \\beta t','-\\beta \\sin \\beta t')} \\\\`+
			        `+ \\: & k_2 ${nt.vec2('\\sin \\beta t', '\\beta \\cos \\beta t')} \\\\`+
			        `= \\: & ${nt.smat2(1,0,0,'\\beta')} ${nt.smat2('\\cos \\beta t','\\sin \\beta t','- \\sin \\beta t','\\cos \\beta t')} ${nt.svec2('k_1','k_2')}`+
		`\\end{aligned}`
	}
}

module.exports=LhcContent
