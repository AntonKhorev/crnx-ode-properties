'use strict'

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
}

LhcContent.Resolved = class extends LhcContent.Base {
	getContentFor_characteristicEquation() {
		const b=i=>this.param.resolved(i)
		return nt=>[
			{type:'derivation',content:[
				`\\[ ${nt.dd(nt.x,'t',2)} = `+(b(1)?`${b(1)} ${nt.dxdt} + `:``)+`${b(0)} ${nt.x} \\]`,
				`substitute \\( ${nt.x} = e^{\\lambda t} \\)`,
				`\\[ ${nt.dd('','t',2)} e^{\\lambda t} = `+(b(1)?`${b(1)} ${nt.ddt} e^{\\lambda t} + `:``)+`${b(0)} e^{\\lambda t} \\]`,
				`\\[ \\lambda^2 e^{\\lambda t} = `+(b(1)?`${b(1)} \\lambda e^{\\lambda t} + `:``)+`${b(0)} e^{\\lambda t} \\]`,
				`divide by \\( e^{\\lambda t} \\)`,
				`\\[ \\lambda^2 = `+(b(1)?`${b(1)} \\lambda + `:``)+`${b(0)} \\]`,
			]},
			`\\[ \\lambda^2 `+(b(1)?`- ${b(1)} \\lambda `:``)+`- ${b(0)} = 0 \\]`,
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
}

LhcContent.ReducedSystem = class extends LhcContent.Base {
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
}

LhcContent.ReducedVector = class extends LhcContent.Base {
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
}

module.exports=LhcContent
