'use strict'

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
}

LhcContent.Linear = class extends LhcContent.Base {
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
			`\\[ ${a(2)} \\lambda^2 `+(a(1)?`+ ${a(1)} \\lambda `:``)+`+ ${a(0)} = 0 \\]`,
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

LhcContent.Resolved = class extends LhcContent.Base {
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
			BlockTexSum([`\\lambda^2`],'-',[b(1),`\\lambda`],'-',[b(0)],'=',[0]),
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
	getContentFor_characteristicEquation() {
		const c=this.param.system(2,1)
		const d=this.param.system(2,2)
		return nt=>[
			BlockTexSum([`\\lambda^2`],'-',[d,`\\lambda`],'-',[c],'=',[0]),
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
	getContentFor_characteristicEquation() {
		const c=this.param.system(2,1)
		const d=this.param.system(2,2)
		return nt=>[
			`\\[ \\det\\left(${nt.mat2('-\\lambda',1,c,`${d}-\\lambda`)}\\right) = 0 \\]`,
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
