'use strict'

const assert=require('assert')
const tex=require('../src/tex')

describe("tex.sum",()=>{
	it("handles one term",()=>{
		const s=tex.sum(["a"])
		assert.equal(s,"a")
	})
	it("handles product term",()=>{
		const s=tex.sum(["a","b"])
		assert.equal(s,"a b")
	})
	it("handles sum of terms",()=>{
		const s=tex.sum(["a","+","b"])
		assert.equal(s,"a + b")
	})
	it("handles sum of terms with negative 1st term",()=>{
		const s=tex.sum(["-a","+","b"])
		assert.equal(s,"-a + b")
	})
	it("handles sum of terms with negative 2nd term",()=>{
		const s=tex.sum(["a","+","-b"])
		assert.equal(s,"a - b")
	})
	it("handles difference of terms",()=>{
		const s=tex.sum(["a","-","b"])
		assert.equal(s,"a - b")
	})
	it("handles difference of terms with negative 1st term",()=>{
		const s=tex.sum(["-a","-","b"])
		assert.equal(s,"-a - b")
	})
	it("handles difference of terms with negative 2nd term",()=>{
		const s=tex.sum(["a","-","-b"])
		assert.equal(s,"a + b")
	})
	it("handles one zero term",()=>{
		const s=tex.sum([0])
		assert.equal(s,"0")
	})
	it("handles one zero product term",()=>{
		const s=tex.sum([0,"a"])
		assert.equal(s,"0")
	})
	it("handles sum of terms with zero 2nd term",()=>{
		const s=tex.sum(["a","+",0])
		assert.equal(s,"a")
	})
	it("handles difference of terms with zero 1st term",()=>{
		const s=tex.sum([0,"-","b"])
		assert.equal(s,"-b")
	})
	it("handles difference of terms with zero 2nd term",()=>{
		const s=tex.sum(["a","-",0])
		assert.equal(s,"a")
	})
	it("handles equality of terms with negative 2nd term",()=>{
		const s=tex.sum(["a","=","-b"])
		assert.equal(s,"a = -b")
	})
	it("handles equality of terms with zero 2nd term",()=>{
		const s=tex.sum(["a","=",0])
		assert.equal(s,"a = 0")
	})
	it("handles one unity term",()=>{
		const s=tex.sum([1])
		assert.equal(s,"1")
	})
	it("handles product with unity 1st term",()=>{
		const s=tex.sum([1,"a"])
		assert.equal(s,"a")
	})
	it("handles product with unity 2nd term",()=>{
		const s=tex.sum(["a",1])
		assert.equal(s,"a")
	})
	it("handles custom operator wrapper",()=>{
		const s=tex.sum(["a","+","b"],o=>'???'+o+'!!!')
		assert.equal(s,"a???+!!!b")
	})
})

describe("tex.frac",()=>{
	it("handles division",()=>{
		const r=tex.frac(["a","+","b"],["c","+","d"])
		assert.equal(r,"\\frac{a + b}{c + d}")
	})
	it("handles division by 1",()=>{
		const r=tex.frac(["a","+","b"],[1])
		assert.equal(r,"a + b")
	})
	it("handles division with simplification",()=>{
		const r=tex.frac(["a","b"],["a"])
		assert.equal(r,"b")
	})
})
