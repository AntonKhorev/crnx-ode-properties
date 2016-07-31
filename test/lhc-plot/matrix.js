'use strict'

const chai=require('chai')
const expect=chai.expect
chai.use(require('chai-roughly'))

const Matrix=require('../../src/lhc-plot/matrix')

describe("Matrix",()=>{
	const delta=1e-6
	it("calculates trace",()=>{
		const matrix=new Matrix
		matrix.a=3; matrix.b=0
		matrix.c=0; matrix.d=2
		expect(matrix.tr).closeTo(5,delta)
	})
	it("calculates det",()=>{
		const matrix=new Matrix
		matrix.a=3; matrix.b=4
		matrix.c=1; matrix.d=2
		expect(matrix.det).closeTo(2,delta)
	})
	it("calculates real eigenvalues",()=>{
		const matrix=new Matrix
		matrix.a=3; matrix.b=2
		matrix.c=1; matrix.d=2
		expect(matrix.re1).closeTo(1,delta)
		expect(matrix.im1).closeTo(0,delta)
		expect(matrix.re2).closeTo(4,delta)
		expect(matrix.im2).closeTo(0,delta)
	})
	it("changes trace of I",()=>{
		const matrix=new Matrix
		matrix.a=1; matrix.b=0
		matrix.c=0; matrix.d=1
		matrix.tr=4
		matrix.det=4
		expect(matrix.a).closeTo(2,delta); expect(matrix.b).closeTo(0,delta)
		expect(matrix.c).closeTo(0,delta); expect(matrix.d).closeTo(2,delta)
	})
	it("changes det of I",()=>{
		const matrix=new Matrix
		matrix.a=1; matrix.b=0
		matrix.c=0; matrix.d=1
		matrix.tr=2
		matrix.det=0
		expect(matrix.a).closeTo(1,delta); expect(matrix.b).closeTo(1,delta)
		expect(matrix.c).closeTo(1,delta); expect(matrix.d).closeTo(1,delta)
	})
	it("results in correct tr and det for arbitrary matrix elements",()=>{
		const matrix=new Matrix
		matrix.a=345; matrix.b=237
		matrix.c=785; matrix.d=892
		matrix.tr=893
		matrix.det=931
		const tr=matrix.a+matrix.d
		const det=matrix.a*matrix.d-matrix.b*matrix.c
		expect(tr).closeTo(893,delta)
		expect(det).closeTo(931,delta)
	})
})
