'use strict'

const tex=require('./tex')
const LinearEquationFormSuite=require('./linear-equation-form-suite')

class O2LinearEquationFormSuite extends LinearEquationFormSuite {
	constructor(a0,a1,a2,b0,b1) {
		super()
		const initBi=(bi,ai)=>{
			if (bi!==undefined) return bi
			if (ai==0) return 0
			return `-\\frac{${ai}}{${a2}}`
		}
		this.a0=a0; this.a1=a1; this.a2=a2
		this.b0=initBi(b0,a0); this.b1=initBi(b1,a1)
	}
	get linear() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			const pl=(isConstant?`+`:`{+}`)
			const eq=(isConstant?`=`:`{=}`)
			return tex.sum([this.a2+t,nt.dd(nt.x,'t',2)],pl,[this.a1+t,nt.dxdt],pl,[this.a0+t,nt.x],eq,[input?`${input}(t)`:0])
		})
	}
	get resolved() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			return tex.sum([nt.dd(nt.x,'t','2')],'=',[this.b1+t,nt.dxdt],'+',[this.b0+t,nt.x],'+',[input?`${input}(t)`:0])
		})
	}
	get system() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			return nt.sys2(
				`${nt.dd(nt.x)} &= ${nt.y}`,
				`${nt.dd(nt.y)} &= `+tex.sum([this.b0+t,nt.x],'+',[this.b1+t,nt.y],'+',[input?`${input}(t)`:0])
			)
		})
	}
	get vector() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			const pl=(isConstant||!input?`+`:`{+}`)
			const eq=(isConstant||!input?`=`:`{=}`)
			return `${nt.dd(nt.X)} ${eq} `+nt.mat2(0,1,this.b0+t,this.b1+t)+` ${nt.X} `+(input?` ${pl} `+nt.vec2(0,`${input}(t)`):``)
		})
	}
	get classIdPrefix() {
		return 'o2'
	}
	get highestOrderCoefficient() {
		return this.a2
	}
	get systemFormType() {
		return 'xy'
	}
}

module.exports=O2LinearEquationFormSuite
