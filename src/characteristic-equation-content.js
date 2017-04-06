'use strict'

const tex=require('./tex')

// terms are one of '+', '-', '=', '0', [order,factor]
module.exports=(...terms)=>{
	const lambdaPow=order=>{
		if (order==0) {
			return 1
		} else if (order==1) {
			return `λ`
		} else {
			return `λ^{order}`
		}
	}
	const step1=nt=>term=>{
		if (Array.isArray(term)) {
			const [order,factor]=term
			return [factor,nt.dd(nt.x,'t',order)]
		} else {
			return term
		}
	}
	const step2=nt=>term=>{
		if (Array.isArray(term)) {
			const [order,factor]=term
			return [factor,nt.dd('','t',order),'e^{λ t}']
		} else {
			return term
		}
	}
	const step3=nt=>term=>{
		if (Array.isArray(term)) {
			const [order,factor]=term
			return [factor,lambdaPow(order),'e^{λ t}']
		} else {
			return term
		}
	}
	const step4=nt=>term=>{
		if (Array.isArray(term)) {
			const [order,factor]=term
			return [factor,lambdaPow(order)]
		} else {
			return term
		}
	}
	return nt=>[
		{type:'derivation',content:[
			tex.blockSum(...terms.map(step1(nt))),
			`substitute \\( ${nt.x} = e^{λ t} \\)`,
			tex.blockSum(...terms.map(step2(nt))),
			tex.blockSum(...terms.map(step3(nt))),
			`divide by \\( e^{\\lambda t} \\)`,
		]},
		tex.blockSum(...terms.map(step4(nt))),
	]
}
