'use strict'

const sum=(...terms)=>{
	const mergeSign=(sign,term)=>{
		if (sign=='-') {
			sign='+'
			if (term[0][0]=='-') {
				term=[term[0].slice(1),...term.slice(1)]
			} else {
				term=['-'+term[0],...term.slice(1)]
			}
		}
		return [sign,term]
	}
	const alterSign=(sign,term)=>{
		if (term[0][0]=='-') {
			term=[term[0].slice(1),...term.slice(1)]
			if (sign=='+') {
				sign='-'
			} else if (sign=='-') {
				sign='+'
			}
		}
		return [sign,term]
	}
	let result=''
	let sign=''
	let empty=true
	for (let term of terms) {
		if (Array.isArray(term) && term[0]!=0) {
			term=term.filter(factor=>factor!=1)
			if (term.length==0) term=[1]
			if (empty) {
				[sign,term]=mergeSign(sign,term)
				result+=term.join(' ')
				empty=false
			} else {
				[sign,term]=alterSign(sign,term)
				result+=' '+sign+' '+term.join(' ')
			}
		} else {
			if (term=='=') {
				if (empty) {
					result+='0'
				}
				result+=' = '
				sign=''
				empty=true
			} else {
				sign=term
			}
		}
	}
	if (empty) {
		result+='0'
	}
	return result
}

const blockSum=(...terms)=>`\\[ `+sum(...terms)+` \\]`

module.exports={sum,blockSum}
