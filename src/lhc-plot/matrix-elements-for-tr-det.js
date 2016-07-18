'use strict'

// for matrix A = [
//   a0 b0
//   c0 d0
// ]
// returns new [a,b,c,d] with tr(A)=T, det(A)=D

const getClosestPointOnHyperbola=require('./closest-point-on-hyperbola')

const updateMatrixElementsForTrDet=(a0,b0,c0,d0,T,D)=>{
	const a=(a0+T-d0)/2
	const d=T-a
	const bc=getClosestPointOnHyperbola(a*d-D,b0,c0)
	const b=bc[0]
	const c=bc[1]
	return [a,b,c,d]
}

module.exports=updateMatrixElementsForTrDet
