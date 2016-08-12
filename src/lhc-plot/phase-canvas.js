'use strict'

const Canvas=require('./canvas')

class PhaseCanvas extends Canvas {
	redraw(matrix,xLabel,yLabel) {
		const ctx=this.ctx
		const xRange=this.width/2
		const yRange=this.height/2
		const drawDirectionField=()=>{
			const arrowSpacing=27
			const arrowLength=5
			const arrowWidth=2
			const drawArrow=(x,y)=>{
				const dx=matrix.a*x+matrix.b*y
				const dy=matrix.c*x+matrix.d*y
				const dl=Math.sqrt(dx*dx+dy*dy)
				ctx.beginPath()
				ctx.moveTo(
					+(x-dx/dl*arrowLength),
					-(y-dy/dl*arrowLength)
				)
				ctx.lineTo(+x,-y)
				ctx.stroke()
				ctx.beginPath()
				ctx.moveTo(
					+(x+dx/dl*arrowLength),
					-(y+dy/dl*arrowLength)
				)
				ctx.lineTo(
					+(x-dy/dl*arrowWidth),
					-(y+dx/dl*arrowWidth)
				)
				ctx.lineTo(
					+(x+dy/dl*arrowWidth),
					-(y-dx/dl*arrowWidth)
				)
				ctx.closePath()
				ctx.fill()
			}
			ctx.save()
			ctx.fillStyle=ctx.strokeStyle='#888'
			const nx=Math.floor(xRange/arrowSpacing)
			const ny=Math.floor(yRange/arrowSpacing)
			for (let i=-nx;i<=nx;i++) {
				for (let j=-ny;j<=ny;j++) {
					drawArrow(
						i*arrowSpacing+0.5*Math.sign(i),
						j*arrowSpacing+0.5*Math.sign(j)
					)
				}
			}
			ctx.restore()
		}
		const drawEigenline=(lambda,otherLambda)=>{
			const iconSize=5
			let icon
			if (lambda<0) {
				icon=-1-(otherLambda<0 && lambda<otherLambda)
			} else if (lambda>0) {
				icon=+1+(otherLambda>0 && lambda>otherLambda)
			} else {
				icon=0
			}
			const xy=matrix.getEigenvector(lambda)
			let x=xy[0], y=xy[1]
			ctx.save()
			ctx.lineWidth=2
			if (x<0) {
				x=-x
				y=-y
			}
			if (y<0) {
				ctx.scale(1,-1)
				y=-y
			}
			if (x<y) { // TODO this will work only for square canvases, should also swap xRange and yRange
				ctx.transform(0,1,1,0,0,0) // swap x,y
				const t=x
				x=y
				y=t
			}
			if (x>0) {
				const r=Math.sqrt(x*x+y*y)
				const x0=x/r
				const y0=y/r
				const x1=xRange
				const y1=yRange*y/x
				const xic=xRange/2*x0
				const yic=yRange/2*y0
				const xis=iconSize*x0
				const yis=iconSize*y0
				const drawEigenlineIcon=()=>{
					const dir=Math.sign(icon)
					const drawDiamond=()=>{
						ctx.beginPath()
						ctx.moveTo(xic-xis,-(yic-yis))
						ctx.lineTo(xic+yis,-(yic-xis))
						ctx.lineTo(xic+xis,-(yic+yis))
						ctx.lineTo(xic-yis,-(yic+xis))
						ctx.closePath()
						ctx.fill()
					}
					const drawTriangle=(ofs)=>{
						ctx.beginPath()
						ctx.moveTo(xic+dir*(ofs*xis-xis-yis),-(yic+dir*(ofs*yis-yis+xis)))
						ctx.lineTo(xic+dir*(ofs*xis-xis+yis),-(yic+dir*(ofs*yis-yis-xis)))
						ctx.lineTo(xic+dir*(ofs*xis+xis    ),-(yic+dir*(ofs*yis+yis    )))
						ctx.closePath()
						ctx.fill()
					}
					if (dir==0) {
						drawDiamond()
					} else {
						drawTriangle(0)
						if (Math.abs(icon)>=2) {
							drawTriangle(2)
						}
					}
				}
				ctx.beginPath()
				ctx.moveTo(-x1,+y1)
				ctx.lineTo(+x1,-y1)
				ctx.stroke()
				ctx.save()
				drawEigenlineIcon()
				ctx.scale(-1,-1)
				drawEigenlineIcon()
				ctx.restore()
			}
			ctx.restore()
		}
		const drawSolution=(x0,y0,color)=>{
			const iterationLimit=100*Math.max(xRange,yRange)
			const fnOnFractions=(fn,xNum,xDen,yNum,yDen)=>{
				if (xDen!=0 && yDen!=0) {
					return fn(xNum/xDen,yNum/yDen)
				} else if (xDen==0 && yDen!=0) {
					return yNum/yDen
				} else if (xDen!=0 && yDen==0) {
					return xNum/xDen
				}
			}
			const drawFixedPoint=()=>{
				const fixedPointSize=3
				ctx.beginPath()
				ctx.arc(x0,y0,fixedPointSize,0,2*Math.PI)
				ctx.fill()
			}
			const drawSaddleOrNodeSolution=()=>{
				let lambda1,lambda2
				if (matrix.re1<=matrix.re2) {
					lambda1=matrix.re1
					lambda2=matrix.re2
				} else {
					lambda1=matrix.re2
					lambda2=matrix.re1
				}
				const xy1=matrix.getEigenvector(lambda1)
				let x1=xy1[0], y1=xy1[1]
				const xy2=matrix.getEigenvector(lambda2)
				let x2=xy2[0], y2=xy2[1]
				if (lambda2<=0) {
					let t
					t=lambda1
					lambda1=-lambda2
					lambda2=-t
					t=x1; x1=x2; x2=t
					t=y1; y1=y2; y2=t
				}
				let k1=+(x2*y0-x0*y2)/(x2*y1-x1*y2)
				let k2=-(x1*y0-x0*y1)/(x2*y1-x1*y2)
				if ((k1==0 && k2==0) || (lambda1==0 && k2==0)) {
					drawFixedPoint()
					return
				} else if (k1==0 && lambda2!=0) {
					lambda1=0 // trigger comb case below
				} else if (k2==0 && lambda1!=0) {
					lambda2=Math.abs(lambda1)
					lambda1=0 // trigger comb case below
					let t
					t=x1; x1=x2; x2=t
					t=y1; y1=y2; y2=t
					t=k1; k1=k2; k2=t
				}
				if (lambda1>0) { // node
					let T1=0
					let T2=0
					const dT1=1/Math.max(Math.abs(k1*x1),Math.abs(k1*y1)) // step size is controlled by slow direction
					ctx.beginPath()
					ctx.moveTo(0,0)
					for (let i=0;i<iterationLimit;i++) {
						T1+=dT1
						T2=Math.pow(T1,lambda2/lambda1)
						ctx.lineTo(
							+(k1*x1*T1+k2*x2*T2),
							-(k1*y1*T1+k2*y2*T2)
						)
						if (
							(k1*x1*T1+k2*x2*T2)*Math.sign(k2*x2)>xRange ||
							(k1*y1*T1+k2*y2*T2)*Math.sign(k2*y2)>yRange
						) break
					}
					ctx.stroke()
				} else if (lambda1<0 && lambda2>0) { // saddle
					let t=0 // assumes starting point is in viewport
					for (let i=0;i<iterationLimit;i++) {
						const ke1=k1*Math.exp(lambda1*t)
						const ke2=k2*Math.exp(lambda2*t)
						if (
							(x1*ke1+x2*ke2)*Math.sign(x1*k1)>xRange ||
							(y1*ke1+y2*ke2)*Math.sign(y1*k1)>yRange
						) break
						const dt=Math.min(
							1/Math.abs(x1*ke1*lambda1),
							1/Math.abs(y1*ke1*lambda1),
							1/Math.abs(x1*ke2*lambda2),
							1/Math.abs(y1*ke2*lambda2)
						)
						t-=dt
					}
					ctx.beginPath()
					for (let i=0;i<iterationLimit;i++) {
						const ke1=k1*Math.exp(lambda1*t)
						const ke2=k2*Math.exp(lambda2*t)
						ctx[i?'lineTo':'moveTo'](
							+(x1*ke1+x2*ke2),
							-(y1*ke1+y2*ke2)
						)
						if (t>0 && (
							(x1*ke1+x2*ke2)*Math.sign(x1*k2)>xRange ||
							(y1*ke1+y2*ke2)*Math.sign(y1*k2)>yRange
						)) break
						const dt=Math.min(
							1/Math.abs(x1*ke1*lambda1),
							1/Math.abs(y1*ke1*lambda1),
							1/Math.abs(x1*ke2*lambda2),
							1/Math.abs(y1*ke2*lambda2)
						)
						t+=dt
					}
					ctx.stroke()
				} else if (lambda1==0 && lambda2>0) { // comb
					const t=fnOnFractions(Math.min,
						Math.sign(x2*k2)*xRange-x1*k1, x2*k2,
						Math.sign(y2*k2)*yRange-y1*k1, y2*k2
					)
					if (t>0) {
						ctx.beginPath()
						ctx.moveTo(
							+(x1*k1),
							-(y1*k1)
						)
						ctx.lineTo(
							+(x1*k1+x2*k2*t),
							-(y1*k1+y2*k2*t)
						)
						ctx.stroke()
					}
				}
			}
			const drawSpiralSolution=()=>{
				let alpha=matrix.re1
				let beta=matrix.im1
				if (beta<0) {
					beta=-beta
				}
				const xxyy=matrix.getComplexEigenvector(alpha,beta)
				if (alpha<0) {
					alpha=-alpha
					beta=-beta
				}
				const x1=xxyy[0], x2=xxyy[1]
				const y1=xxyy[2], y2=xxyy[3]
				const k1=+(x2*y0-x0*y2)/(x2*y1-x1*y2)
				const k2=-(x1*y0-x0*y1)/(x2*y1-x1*y2)
				if (k1==0 && k2==0) return
				const kxc=k1*x1+k2*x2
				const kxs=k2*x1-k1*x2
				const kyc=k1*y1+k2*y2
				const kys=k2*y1-k1*y2
				if (alpha==0) { // center
					ctx.beginPath()
					const dt=1/Math.max(kxc,kyc,kxs,kys)
					let t=0
					for (let i=0;i<iterationLimit;i++) {
						const c=Math.cos(t)
						const s=Math.sin(t)
						ctx[i?'lineTo':'moveTo'](
							+(kxc*c+kxs*s),
							-(kyc*c+kys*s)
						)
						t+=dt
						if (t>=2*Math.PI) break
					}
					ctx.closePath()
					ctx.stroke()
				} else { // spiral
					const calculateSemiaxes=()=>{ // https://en.wikipedia.org/wiki/Ellipse#Canonical_form
						const A=kys*kys+kyc*kyc, B=-2*(kxs*kys+kxc*kyc), C=kxs*kxs+kxc*kxc
						const f=kxc*kys-kxs*kyc
						const F=-f*f
						const DIS=B*B-4*A*C
						const A2=2*DIS*F*(A+C-Math.sqrt((A-C)*(A-C)+B*B))/(DIS*DIS)
						const B2=2*DIS*F*(A+C+Math.sqrt((A-C)*(A-C)+B*B))/(DIS*DIS)
						return [A2,B2] // TODO relative axes lengths don't depend on initial conditions, this calculation should be simpler
					}
					const A2B2=calculateSemiaxes()
					const A2=A2B2[0]
					const B2=A2B2[1]
					const B=Math.sqrt(B2)
					const R2=xRange*xRange+yRange*yRange
					//const t0=-(Math.log(B2)/2+Math.log(Math.exp(2*Math.PI*alpha/Math.abs(beta))-1))/alpha
					const lineWidth=2
					const t0=(Math.log(lineWidth)-Math.log(B2)/2-Math.log(Math.exp(2*Math.PI*alpha/Math.abs(beta))-1))/alpha
					//const t1=(Math.log(R2)-Math.log(A2))/(2*alpha)
					ctx.beginPath()
					const e0=Math.exp(alpha*t0)
					const nSegments=Math.ceil(B*e0*2*Math.PI)
					for (let i=0;i<nSegments;i++) {
						const t=2*Math.PI*i/nSegments
						const c0=Math.cos(t)
						const s0=Math.sin(t)
						ctx[i?'lineTo':'moveTo'](
							+e0*(kxc*c0+kxs*s0),
							-e0*(kyc*c0+kys*s0)
						)
					}
					ctx.closePath()
					ctx.stroke()
					ctx.fill()
					ctx.beginPath()
					let t=t0
					for (let i=0;i<iterationLimit;i++) {
						const e=Math.exp(alpha*t)
						const c=Math.cos(beta*t)
						const s=Math.sin(beta*t)
						ctx[i?'lineTo':'moveTo'](
							+e*(kxc*c+kxs*s),
							-e*(kyc*c+kys*s)
						)
						//const dtTan=1/Math.abs(beta*B*e)
						const dtRad=Math.log(1/(B*e)+1)/alpha
						//t+=Math.min(Math.max(dtTan,1/Math.abs(40*beta)),dtRad)
						t+=Math.min(dtRad,1/Math.abs(16*beta))
						if (e*e*A2>R2) break
					}
					ctx.stroke()
				}
			}
			const drawDefectiveSolution=()=>{
				let lambda=matrix.re1
				let x1=(matrix.a-lambda)*x0+matrix.b*y0
				let y1=matrix.c*x0+(matrix.d-lambda)*y0
				if (lambda<0) {
					lambda=-lambda
					x1=-x1
					y1=-y1
				}
				if (lambda==0 && x1==0 && y1==0) { // everywhere fixed
					drawFixedPoint()
				} if (lambda==0) { // parallel lines
					const t0=fnOnFractions(Math.min,
						-Math.sign(x1)*xRange-x0, x1,
						-Math.sign(y1)*yRange-y0, y1
					)
					const t1=fnOnFractions(Math.max,
						+Math.sign(x1)*xRange-x0, x1,
						+Math.sign(y1)*yRange-y0, y1
					)
					ctx.beginPath()
					ctx.moveTo(
						+(x0+t0*x1),
						-(y0+t0*y1)
					)
					ctx.lineTo(
						+(x0+t1*x1),
						-(y0+t1*y1)
					)
					ctx.stroke()
				} else { // star or defective node
					ctx.beginPath()
					ctx.moveTo(0,0)
					let T=0
					const dT=1/Math.max(Math.abs(x0),Math.abs(y0))
					for (let i=0;i<iterationLimit;i++) {
						T+=dT
						const t=Math.log(T)/lambda
						ctx.lineTo(
							+T*(x0+t*x1),
							-T*(y0+t*y1)
						)
						if (
							T*(x0+t*x1)*Math.sign(x0)>xRange ||
							T*(y0+t*y1)*Math.sign(y0)>yRange
						) break
					}
					ctx.stroke()
				}
			}
			ctx.save()
			ctx.lineWidth=2
			ctx.strokeStyle=ctx.fillStyle=color
			if (matrix.im1==0 && matrix.re1!=matrix.re2) {
				drawSaddleOrNodeSolution()
			} else if (matrix.im1==0 && matrix.re1==matrix.re2) {
				drawDefectiveSolution()
			} else if (matrix.im1!=0) {
				drawSpiralSolution()
			}
			ctx.restore()
		}
		ctx.save()
		ctx.fillStyle='#FFF'
		ctx.fillRect(0,0,this.width,this.height)
		ctx.restore()
		ctx.save()
		ctx.translate(xRange,yRange)
		this.drawAxes(xLabel,yLabel)
		drawDirectionField()
		if (matrix.im1==0) {
			drawEigenline(matrix.re1,matrix.re2)
			if (matrix.re1!=matrix.re2) {
				drawEigenline(matrix.re2,matrix.re1)
			}
		}
		drawSolution(+xRange/2,0,'#08F')
		drawSolution(-xRange/2,0,'#28F')
		drawSolution(0,+yRange/2,'#0AF')
		drawSolution(0,-yRange/2,'#08D')
		ctx.restore()
	}
}

module.exports=PhaseCanvas
