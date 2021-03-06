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
	it("handles inequality of terms",()=>{
		const s=tex.sum(["a","≠","+","b"])
		assert.equal(s,"a ≠ b")
	})
	it("handles square",()=>{
		const s=tex.sum(["a","^2"])
		assert.equal(s,"a^2")
	})
	it("handles square of 1",()=>{
		const s=tex.sum([1,"^2"])
		assert.equal(s,"1")
	})
	it("handles square of negative",()=>{
		const s=tex.sum(["-a","^2"])
		assert.equal(s,"a^2")
	})
	it("flips sign of single negative term equality to 0",()=>{
		const s=tex.sum(["-a","=","0"])
		assert.equal(s,"a = 0")
	})
	it("flips sign of single negative term inequality to 0",()=>{
		const s=tex.sum(["-a","≠","0"])
		assert.equal(s,"a ≠ 0")
	})
	it("doesn't flip sign of non-single term equality to 0",()=>{
		const s=tex.sum(["-a","+","b","=","0"])
		assert.equal(s,"-a + b = 0")
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
	it("handles division with simplification of sum",()=>{
		const r=tex.frac(["a","b","+","a"],["a"])
		assert.equal(r,"b + 1")
	})
	it("pulls out minus from single-term denominator",()=>{
		const r=tex.frac(["a","+","b"],["-c"])
		assert.equal(r,"-\\frac{a + b}{c}")
	})
	it("pulls out minus from single-term denominator equal to -1",()=>{
		const r=tex.frac(["a","+","b"],["-1"])
		assert.equal(r,"-(a + b)")
	})
})
