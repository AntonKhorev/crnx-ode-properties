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
		return [isPositive,factors.filter(factor=>factor!='1')]
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
		if (factors.length==0) {
			return sign+'1'
		} else {
			return sign+factors.join(' ')
		}
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
	return isPositive && factors.length==0
}

const frac=(numer,denom)=>{
	let numerTerms=makeTerms(numer)
	let denomTerms=makeTerms(denom)
	if (denomTerms.length==1) {
		denomTerms[0][1]=denomTerms[0][1].filter(denomFactor=>{
			const canSimplify=numerTerms.every(([isPositive,factors])=>factors.indexOf(denomFactor)>=0)
			if (!canSimplify) return true
			numerTerms=numerTerms.map(([isPositive,factors])=>{
				const i=factors.indexOf(denomFactor)
				const newFactors=[...factors]
				newFactors.splice(i,1)
				return [isPositive,newFactors]
			})
			return false
		})
	}
	if (isOne(denomTerms)) {
		return renderTerms(numerTerms)
	} else {
		return `\\frac{${renderTerms(numerTerms)}}{${renderTerms(denomTerms)}}`
	}
}

module.exports={sum,blockSum,frac}
