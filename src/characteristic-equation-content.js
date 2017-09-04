'use strict'

const tex=require('./tex')

// TODO incorporate into linear-equation-form-suite.js

// terms are one of '+', '-', '=', '0', [order,factor]
module.exports=(...terms)=>{
	let needToCollect=true
	let collectedTerms=terms
	if (terms[terms.length-2]=='=' && terms[terms.length-1]==0) {
		needToCollect=false
	} else {
		collectedTerms=[]
		let flipSign=false
		for (let term of terms) {
			if (Array.isArray(term)) {
				collectedTerms.push(term)
			} else if (term=='=') {
				flipSign=true
				collectedTerms.push('-')
			} else if (term=='+') {
				collectedTerms.push(flipSign?'-':'+')
			} else if (term=='-') {
				collectedTerms.push(flipSign?'+':'-')
			}
		}
		collectedTerms.push('=','0')
	}
	const lambdaPow=order=>{
		if (order==0) {
			return 1
		} else if (order==1) {
			return `λ`
		} else {
			return `λ^{${order}}`
		}
	}
	const mapTerms=(nt,terms,mapper)=>tex.blockSum([].concat(
		terms.map(term=>{
			if (Array.isArray(term)) {
				const [order,factor]=term
				return mapper(nt,order,factor)
			} else {
				return [term]
			}
		})
	))
	const step1=(nt,order,factor)=>[factor,nt.dd(nt.x,'t',order)]
	const step2=(nt,order,factor)=>[factor,nt.dd('','t',order),'e^{λ t}']
	const step3=(nt,order,factor)=>[factor,lambdaPow(order),'e^{λ t}']
	const step4=(nt,order,factor)=>[factor,lambdaPow(order)]
	return nt=>[
		{type:'derivation',content:[
			mapTerms(nt,terms,step1),
			`substitute \\( ${nt.x} = e^{λ t} \\)`,
			mapTerms(nt,terms,step2),
			mapTerms(nt,terms,step3),
			`divide by \\( e^{\\lambda t} \\)`,
			...(needToCollect?[
				mapTerms(nt,terms,step4),
			]:[]),
		]},
		mapTerms(nt,collectedTerms,step4),
	]
}
