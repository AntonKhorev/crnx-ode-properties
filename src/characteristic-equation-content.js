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
	const mapTerms=(nt,mapper)=>tex.blockSum(...(
		terms.map(term=>{
			if (Array.isArray(term)) {
				const [order,factor]=term
				return mapper(nt,order,factor)
			} else {
				return term
			}
		})
	))
	const step1=(nt,order,factor)=>[factor,nt.dd(nt.x,'t',order)]
	const step2=(nt,order,factor)=>[factor,nt.dd('','t',order),'e^{λ t}']
	const step3=(nt,order,factor)=>[factor,lambdaPow(order),'e^{λ t}']
	const step4=(nt,order,factor)=>[factor,lambdaPow(order)]
	return nt=>[
		{type:'derivation',content:[
			mapTerms(nt,step1),
			`substitute \\( ${nt.x} = e^{λ t} \\)`,
			mapTerms(nt,step2),
			mapTerms(nt,step3),
			`divide by \\( e^{\\lambda t} \\)`,
		]},
		mapTerms(nt,step4),
	]
}
