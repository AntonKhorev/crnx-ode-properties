'use strict'

const getClosestPointOnHyperbola=require('./closest-point-on-hyperbola')

class Matrix {
	constructor() {
		this._a=this._b=this._c=this._d=0
		this._tr=this._det=0
		this._re1=this._re2=this._im1=this._im2=0
		this._original=null
		this._updated={}
	}
	forUpdated(fn) {
		for (let coef in this._updated) {
			fn(coef)
		}
		this._updated={}
	}
	_computeElementsFromTrdet() {
		if (this._original===null) {
			this._original={
				a: this._a,
				b: this._b,
				c: this._c,
				d: this._d,
			}
		}
		this._a=(this._original.a+this._tr-this._original.d)/2
		this._d=this._tr-this._a
		const bc=getClosestPointOnHyperbola(this._a*this._d-this._det,this._original.b,this._original.c)
		this._b=bc[0]
		this._c=bc[1]
		this._updated.a=this._updated.b=this._updated.c=this._updated.d=true
	}
	_computeTrdetFromElements() {
		this._tr=this._a+this._d
		this._det=this._a*this._d-this._b*this._c
		this._updated.tr=this._updated.det=true
	}
	_computeEigenvaluesFromTrdet() {
		const discr=this._tr*this._tr-4*this._det
		if (discr>=0) {
			const root=Math.sqrt(discr)
			if (this._re2>=this._re1) {
				this._re1=(this._tr-root)/2
				this._re2=(this._tr+root)/2
			} else {
				this._re2=(this._tr-root)/2
				this._re1=(this._tr+root)/2
			}
			this._im1=this._im2=0
		} else {
			const root=Math.sqrt(-discr)
			this._re1=this._re2=this._tr/2
			if (this._im2>=this._im1) {
				this._im1=-root
				this._im2=+root
			} else {
				this._im2=-root
				this._im1=+root
			}
		}
		this._updated.re1=this._updated.re2=this._updated.im1=this._updated.im2=true
	}
	_computeTrdetFromEigenvalues() {
		this._tr=this._re1+this._re2
		this._det=this._re1*this._re2-this._im1*this._im2
		this._updated.tr=this._updated.det=true
	}
	get a() { return this._a }
	get b() { return this._b }
	get c() { return this._c }
	get d() { return this._d }
	get tr() { return this._tr }
	get det() { return this._det }
	get re1() { return this._re1 }
	get re2() { return this._re2 }
	get im1() { return this._im1 }
	get im2() { return this._im2 }
	set a(v) {
		this._a=v
		this._original=null
		this._computeTrdetFromElements()
		this._computeEigenvaluesFromTrdet()
	}
	set b(v) {
		this._b=v
		this._original=null
		this._computeTrdetFromElements()
		this._computeEigenvaluesFromTrdet()
	}
	set c(v) {
		this._c=v
		this._original=null
		this._computeTrdetFromElements()
		this._computeEigenvaluesFromTrdet()
	}
	set d(v) {
		this._d=v
		this._original=null
		this._computeTrdetFromElements()
		this._computeEigenvaluesFromTrdet()
	}
	set tr(v) {
		this._tr=v
		this._computeElementsFromTrdet()
		this._computeEigenvaluesFromTrdet()
	}
	set det(v) {
		this._det=v
		this._computeElementsFromTrdet()
		this._computeEigenvaluesFromTrdet()
	}
	setTrdetExternally(T,D) { // for use with clicks on tr-det plane plot
		this._tr=T
		this._det=D
		this._updated.tr=this._updated.det=true
		this._computeElementsFromTrdet()
		this._computeEigenvaluesFromTrdet()
	}
	_setRe(v,i,j) {
		this['_re'+i]=v
		if (this._im1!=0 || this._im2!=0) {
			this['_re'+j]=v
			this._updated['re'+j]=true
		}
		this._computeTrdetFromEigenvalues()
		this._computeElementsFromTrdet()
	}
	set re1(v) {
		this._setRe(v,1,2)
	}
	set re2(v) {
		this._setRe(v,2,1)
	}
	_setIm(v,i,j) {
		this['_im'+i]=v
		this['_im'+j]=-v
		this._updated['im'+j]=true
		if (v!=0) {
			this['_re'+j]=this['_re'+i]
			this._updated['re'+j]=true
		}
		this._computeTrdetFromEigenvalues()
		this._computeElementsFromTrdet()
	}
	set im1(v) {
		this._setIm(v,1,2)
	}
	set im2(v) {
		this._setIm(v,2,1)
	}
	getRange(coef) {
		if (coef=='tr') {
			return 10
		} else if (coef=='det') {
			return 50
		} else if (coef=='a' || coef=='b' || coef=='c' || coef=='d') {
			return 5
		} else {
			return 10 // eigenvalues
		}
	}
}

module.exports=Matrix
