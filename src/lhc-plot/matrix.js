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
	_saveOriginal() {
		if (this._original===null) {
			this._original={
				a: this._a,
				b: this._b,
				c: this._c,
				d: this._d,
			}
		}
	}
	_updateElements() {
		this._a=(this._original.a+this._tr-this._original.d)/2
		this._d=this._tr-this._a
		const bc=getClosestPointOnHyperbola(this._a*this._d-this._det,this._original.b,this._original.c)
		this._b=bc[0]
		this._c=bc[1]
		this._updated.a=this._updated.b=this._updated.c=this._updated.d=true
	}
	_updateTrDet() {
		this._tr=this._a+this._d
		this._det=this._a*this._d-this._b*this._c
		this._updated.tr=this._updated.det=true
	}
	_updateEigenvalues() {
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
		this._updateTrDet()
		this._updateEigenvalues()
	}
	set b(v) {
		this._b=v
		this._original=null
		this._updateTrDet()
		this._updateEigenvalues()
	}
	set c(v) {
		this._c=v
		this._original=null
		this._updateTrDet()
		this._updateEigenvalues()
	}
	set d(v) {
		this._d=v
		this._original=null
		this._updateTrDet()
		this._updateEigenvalues()
	}
	set tr(v) {
		this._tr=v
		this._saveOriginal()
		this._updateElements()
		this._updateEigenvalues()
	}
	set det(v) {
		this._det=v
		this._saveOriginal()
		this._updateElements()
		this._updateEigenvalues()
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
