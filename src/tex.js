'use strict'

const makeTerms=(items)=>{
	const terms=[[true,[]]]
	const lastFactors=()=>terms[terms.length-1][1]
	for (let item of items) {
		if (item=='+' || item=='-') {
			terms.push([item=='+',[]])
		} else if (item=='^2') {
			const factor=lastFactors().pop()
			if (factor=='1') {
				lastFactors().push(factor)
			} else if (factor[0]=='-') {
				lastFactors().push(factor.slice(1)+'^2')
			} else {
				lastFactors().push(factor+'^2')
			}
		} else {
			lastFactors().push(''+item)
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
	let equalityItems=[]
	let sumSide=[]
	const doSumSide=()=>{
		equalityItems.push(makeTerms(sumSide))
		sumSide=[]
	}
	for (let item of items) {
		if (item=='=' || item=='≠') {
			doSumSide()
			equalityItems.push(item)
		} else {
			sumSide.push(item)
		}
	}
	doSumSide()
	if (equalityItems.length==3 && equalityItems[0].length==1 && equalityItems[2].length==0) { // single-term (in)equality to 0
		equalityItems[0][0][0]=true // set sign to positive
	}
	return equalityItems.map(equalityItem=>{
		if (Array.isArray(equalityItem)) {
			return renderTerms(equalityItem,wrapOp)
		} else {
			return wrapOp(equalityItem)
		}
	}).join('')
}

const blockSum=(...args)=>`\\[ `+sum(...args)+` \\]`

const isOne=(terms)=>{
	if (terms.length!=1) return false
	const [isPositive,factors]=terms[0]
	return isPositive && factors.length==0
}

const frac=(numer,denom)=>{
	let leadNegation=false
	let numerTerms=makeTerms(numer)
	let denomTerms=makeTerms(denom)
	if (denomTerms.length==1) {
		if (!denomTerms[0][0]) {
			denomTerms[0][0]=true
			leadNegation=true
		}
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
		return (leadNegation?'-(':'')+renderTerms(numerTerms)+(leadNegation?')':'')
	} else {
		return (leadNegation?'-':'')+`\\frac{${renderTerms(numerTerms)}}{${renderTerms(denomTerms)}}`
	}
}

module.exports={sum,blockSum,frac}
