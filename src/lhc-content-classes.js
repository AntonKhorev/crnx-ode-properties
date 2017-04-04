'use strict'

const ivp="<a href='https://en.wikipedia.org/wiki/Initial_value_problem'>initial value problem</a>"

const TexSum=(...terms)=>{
	let result=''
	let lead=''
	let first=true
	for (let term of terms) {
		if (Array.isArray(term)) {
			if (term[0][0]=='-') {
				if (lead=='+') {
					term[0]=term[0].slice(1)
					lead='-'
				} else if (lead=='-') {
					term[0]=term[0].slice(1)
					lead='+'
				}
			}
			if (first) {
				first=false
			} else {
				result+=' '
			}
			result+=lead+' '+term.join(' ')
		} else {
			lead=term
		}
	}
	return result
}
const BlockTexSum=(...terms)=>`\\[ `+TexSum(...terms)+` \\]`

const LhcContent={}

LhcContent.Base = class {
	constructor(param) {
		this.param=param
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
	getContentFor_generalSolutionMethod() {
		return nt=>{
			const x0=this.getx0(nt)
			const y0=this.gety0(nt)
		return [
			`solve characteristic equation for \\( \\lambda \\):`,
			`\\[ ${this.getCharacteristicEquation(nt)} \\]`,
			{type:'switch',title:`roots \\( \\lambda \\) are`,content:[
				{type:'case',title:`repeated \\( ( \\lambda_1 = \\lambda_2 = \\lambda ) \\)`,content:[
					`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
					`\\[ ${this.getRepeatedGeneralSolution(nt)} \\]`,
					`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
					`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,'\\lambda',1)} \\]`,
					`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'',1,0,'-\\lambda',1,x0,`${y0} - \\lambda \\cdot ${x0}`)} \\]`,
				]},
				{type:'case',title:`real distinct \\( ( \\lambda_1 \\ne \\lambda_2; \\lambda_1, \\lambda_2 \\in \\mathbb{R} ) \\)`,content:[
					`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
					`\\[ ${this.getRealGeneralSolution(nt)} \\]`,
					`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
					`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,1,'\\lambda_1','\\lambda_2')} \\]`,
					`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'\\frac1{λ_2{-}λ_1}','λ_2',-1,'-λ_1',1,`\\frac{λ_2 \\cdot ${x0} - ${y0}}{λ_2 - λ_1}`,`\\frac{λ_1 \\cdot ${x0} - ${y0}}{λ_1 - λ_2}`)} \\]`,
				]},
				{type:'case',title:`complex conjugate pair \\( ( \\lambda = \\alpha \\pm i \\beta; \\beta \\ne 0 ) \\)`,content:[
					`general solution (with arbitrary constants \\( k_1 \\), \\( k_2 \\)):`,
					`\\[ ${this.getComplexGeneralSolution(nt)} \\]`,
					`get constants \\( k_1 \\), \\( k_2 \\) for ${ivp} solution by solving:`,
					`\\[ ${this.getGeneralSolutionConstantsEquation(nt,1,0,'\\alpha','\\beta')} \\]`,
					`\\[ ${this.getGeneralSolutionConstantsSolution(nt,'\\frac1{\\beta}','\\beta',0,'-\\alpha',1,x0,`\\frac{${y0} - α \\cdot ${x0}}{β}`)} \\]`,
				]},
			]},
		]}
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
}

LhcContent.Linear = class extends LhcContent.Scalar {
	getCharacteristicEquation(nt) {
		const a=i=>this.param.linear(i)
		return TexSum([a(2),`\\lambda^2`],'+',[a(1),`\\lambda`],'+',[a(0)],'=',[0])
	}
	getContentFor_characteristicEquation() {
		const a=i=>this.param.linear(i)
		return nt=>[
			{type:'derivation',content:[
				`\\[ ${a(2)} ${nt.dd(nt.x,'t',2)} `+(a(1)?`+ ${a(1)} ${nt.dxdt} `:``)+`+ ${a(0)} ${nt.x} = 0 \\]`,
				`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
				`\\[ ${a(2)} ${nt.dd('','t',2)} e^{\\lambda t} `+(a(1)?`+ ${a(1)} ${nt.ddt} e^{\\lambda t} `:``)+`+ ${a(0)} e^{\\lambda t} = 0 \\]`,
				`\\[ ${a(2)} \\lambda^2 e^{\\lambda t} `+(a(1)?`+ ${a(1)} \\lambda e^{\\lambda t} `:``)+`+ ${a(0)} e^{\\lambda t} = 0 \\]`,
				`divide by \\( e^{\\lambda t} \\)`,
			]},
			`\\[ ${this.getCharacteristicEquation(nt)} \\]`,
		]
	}
	getContentFor_equilibriumSolutionMethod() {
		const a=i=>this.param.linear(i)
		return nt=>[
			{type:'switch',title:`\\( ${a(0)} \\) is`,content:[
				{type:'case',title:`\\( ${a(0)} = 0 \\)`,content:[
					`\\[ ${nt.x} = K \\]`,
				]},
				{type:'case',title:`\\( ${a(0)} \\ne 0 \\)`,content:[
					`\\[ ${nt.x} = 0 \\]`,
				]},
			]},
		]
	}
	getContentFor_equilibriumSolutionMethod0() {
		const a=i=>this.param.linear(i)
		return nt=>[
			`\\[ ${nt.x} = 0 \\]`,
			{type:'note',content:[
				`no other equilibrium solution is possible because \\( ${a(0)} \\ne 0 \\)`,
			]},
		]
	}
}

LhcContent.Resolved = class extends LhcContent.Scalar {
	getCharacteristicEquation(nt) {
		const b=i=>this.param.resolved(i)
		return TexSum([`\\lambda^2`],'-',[b(1),`\\lambda`],'-',[b(0)],'=',[0])
	}
	getContentFor_characteristicEquation() {
		const b=i=>this.param.resolved(i)
		return nt=>[
			{type:'derivation',content:[
				BlockTexSum([nt.dd(nt.x,'t',2)],'=',[b(1),nt.dxdt],'+',[b(0),nt.x]),
				`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
				BlockTexSum([`${nt.dd('','t',2)} e^{\\lambda t}`],'=',[b(1),`${nt.ddt} e^{\\lambda t}`],'+',[b(0),`e^{\\lambda t}`]),
				BlockTexSum([`\\lambda^2 e^{\\lambda t}`],'=',[b(1),`\\lambda e^{\\lambda t}`],'+',[b(0),`e^{\\lambda t}`]),
				`divide by \\( e^{\\lambda t} \\)`,
				BlockTexSum([`\\lambda^2`],'=',[b(1),`\\lambda`],'+',[b(0)]),
			]},
			`\\[ ${this.getCharacteristicEquation(nt)} \\]`,
		]
	}
	getContentFor_equilibriumSolutionMethod() {
		const b=i=>this.param.resolved(i)
		return nt=>[
			{type:'switch',title:`\\( ${b(0)} \\) is`,content:[
				{type:'case',title:`\\( ${b(0)} = 0 \\)`,content:[
					`\\[ ${nt.x} = K \\]`,
				]},
				{type:'case',title:`\\( ${b(0)} \\ne 0 \\)`,content:[
					`\\[ ${nt.x} = 0 \\]`,
				]},
			]},
		]
	}
	getContentFor_equilibriumSolutionMethod0() {
		const b=i=>this.param.resolved(i)
		return nt=>[
			`\\[ ${nt.x} = 0 \\]`,
			{type:'note',content:[
				`no other equilibrium solution is possible because \\( ${b(0)} \\ne 0 \\)`,
			]},
		]
	}
}

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
	getCharacteristicEquation(nt) {
		const c=this.param.system(2,1)
		const d=this.param.system(2,2)
		return TexSum([`\\lambda^2`],'-',[d,`\\lambda`],'-',[c],'=',[0])
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
	getContentFor_characteristicEquation() {
		return nt=>[
			`\\[ ${this.getCharacteristicEquation(nt)} \\]`,
		]
	}
	getContentFor_equilibriumSolutionMethod() {
		const c=this.param.system(2,1)
		return nt=>[
			{type:'switch',title:`\\( ${c} \\) is`,content:[
				{type:'case',title:`\\( ${c} = 0 \\)`,content:[
					`\\[ `+nt.sys2(`${nt.x} &= K`,`${nt.y} &= 0`)+` \\]`,
				]},
				{type:'case',title:`\\( ${c} \\ne 0 \\)`,content:[
					`\\[ `+nt.sys2(`${nt.x} &= 0`,`${nt.y} &= 0`)+` \\]`,
				]},
			]},
		]
	}
	getContentFor_equilibriumSolutionMethod0() {
		const c=this.param.system(2,1)
		return nt=>[
			`\\[ ${nt.sys2(`${nt.x} &= 0`,`${nt.y} &= 0`)} \\]`,
			{type:'note',content:[
				`no other equilibrium solution is possible because \\( ${c} \\ne 0 \\)`,
			]},
		]
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
	getCharacteristicEquation(nt) {
		const c=this.param.system(2,1)
		const d=this.param.system(2,2)
		return `\\det\\left(${nt.mat2('-\\lambda',1,c,`${d}-\\lambda`)}\\right) = 0`
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
	getContentFor_characteristicEquation() {
		return nt=>[
			`\\[ ${this.getCharacteristicEquation(nt)} \\]`,
		]
	}
	getContentFor_equilibriumSolutionMethod() {
		const c=this.param.system(2,1)
		return nt=>[
			{type:'switch',title:`\\( ${c} \\) is`,content:[
				{type:'case',title:`\\( ${c} = 0 \\)`,content:[
					`\\[ ${nt.X} = ${nt.vec2('K',0)} \\]`,
				]},
				{type:'case',title:`\\( ${c} \\ne 0 \\)`,content:[
					`\\[ ${nt.X} = \\mathbf{0} \\]`,
				]},
			]},
		]
	}
	getContentFor_equilibriumSolutionMethod0() {
		const c=this.param.system(2,1)
		return nt=>[
			`\\[ ${nt.X} = \\mathbf{0} \\]`,
			{type:'note',content:[
				`no other equilibrium solution is possible because \\( ${c} \\ne 0 \\)`,
			]},
		]
	}
}

module.exports=LhcContent
