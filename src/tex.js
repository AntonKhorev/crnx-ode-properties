'use strict'

const makeTerms=(items)=>{
	const terms=[[true,[]]]
	for (let item of items) {
		if (item=='+' || item=='-') {
			terms.push([item=='+',[]])
		} else {
			terms[terms.length-1][1].push(''+item)
		}
	}
	console.log(items,'=>',terms) ///
	return terms.map(([isPositive,factors])=>{ // merge signs
		factors=factors.map(factor=>{
			if (factor[0]=='-') {
				isPositive=!isPositive
				return factor.slice(1)
			} else {
				return factor
			}
		})
		return [isPositive,factors]
	}).filter(([isPositive,factors])=>{ // remove zero terms
		return !(factors.length==0 || factors.indexOf('0')>=0)
	}).map(([isPositive,factors])=>{ // remove 1 factors
		factors=factors.filter(factor=>factor!='1')
		if (factors.length==0) factors=[1]
		return [isPositive,factors]
	})
}

const renderTerms=(terms,wrapOp=o=>' '+o+' ')=>{
	if (terms.length==0) return '0'
	return terms.map(([isPositive,factors],i)=>{
		let sign=''
		if (isPositive) {
			if (i>0) {
				sign=wrapOp('+')
			}
		} else {
			if (i>0) {
				sign=wrapOp('-')
			} else {
				sign='-'
			}
		}
		return sign+factors.join(' ')
	}).join('')
}

const sum=(items,wrapOp=o=>' '+o+' ')=>{
	let result=''
	let sumSide=[]
	const doSumSide=()=>{
		const r=renderTerms(makeTerms(sumSide),wrapOp)
		sumSide=[]
		return r
	}
	for (let item of items) {
		if (item!='=') {
			sumSide.push(item)
		} else {
			result+=doSumSide()+wrapOp('=')
		}
	}
	result+=doSumSide()
	return result
}

const blockSum=(...args)=>`\\[ `+sum(...args)+` \\]`

const isOne=(terms)=>{
	if (terms.length!=1) return false
	const [isPositive,factors]=terms[0]
	return isPositive && factors.length==1 && factors[0]=='1'
}

const frac=(numer,denom)=>{
	let numerTerms=makeTerms(numer)
	let denomTerms=makeTerms(denom)
	/*
	if (denomTerms.length==1) {
		for
	}
	*/
	if (isOne(denomTerms)) {
		return renderTerms(numerTerms)
	} else {
		return `\\frac{${renderTerms(numerTerms)}}{${renderTerms(denomTerms)}}`
	}
}

module.exports={sum,blockSum,frac}
