'use strict'

// returns coords [x,y] of a point on x*y=C closest to (x0,y0)
// could have solved x^3*(x-x0)+C*y0*x-C^2=0, y=C/x

const getClosestPointOnPositiveHyperbolaIn1stQuadrant=(C,x0,y0)=>{
	let x=Math.sqrt(C)
	let y=x
	const epsilon2=1e-12
	const iterationLimit=20
	for (let i=0;i<iterationLimit;i++) {
		if (x<=0) return [C/y0,y0]
		if (y<=0) return [x0,C/x0]
		const yx=y0/(2*x)
		const xy=x0/(2*y)
		const t=yx+xy-Math.sqrt((yx-xy)*(yx-xy)+C/(x*y))
		let x1=x0-y*t
		let y1=y0-x*t
		if ((x-x1)*(x-x1)+(y-y1)*(y-y1)<=epsilon2) break
		x=x1
		y=y1
	}
	return [x,y]
}

const getClosestPointOnPositiveHyperbola=(C,x0,y0)=>{
	if (y0>=-x0) { // top-right branch
		return getClosestPointOnPositiveHyperbolaIn1stQuadrant(C,x0,y0)
	} else { // bottom-left branch
		const xy=getClosestPointOnPositiveHyperbolaIn1stQuadrant(C,-x0,-y0)
		return [-xy[0],-xy[1]]
	}
}

const getClosestPointOnHyperbola=(C,x0,y0)=>{
	if (C==0) {
		// TODO
	} else if (C>0) {
		return getClosestPointOnPositiveHyperbola(C,x0,y0)
	} else { // flip y axis
		const xy=getClosestPointOnPositiveHyperbola(-C,x0,-y0)
		return [xy[0],-xy[1]]
	}
}

module.exports=getClosestPointOnHyperbola
