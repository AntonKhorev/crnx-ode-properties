'use strict'

const tex=require('./tex')
const characteristicEquationContent=require('./characteristic-equation-content')
const LinearEquationFormSuite=require('./linear-equation-form-suite')

class O2LinearEquationFormSuite extends LinearEquationFormSuite {
	constructor(a0,a1,a2,b0,b1) {
		super()
		const initBi=(bi,ai)=>{
			if (bi!==undefined) return bi
			if (ai==0) return 0
			return `-\\frac{${ai}}{${a2}}` // TODO will need special handling in getEquilibriumSolutionMethodTrait()
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
		},nt=>tex.sum([this.a2,`λ^2`],'+',[this.a1,`λ`],'+',[this.a0]))
	}
	get resolved() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			return tex.sum([nt.dd(nt.x,'t','2')],'=',[this.b1+t,nt.dxdt],'+',[this.b0+t,nt.x],'+',[input?`${input}(t)`:0])
		},nt=>tex.sum([`λ^2`],'-',[this.b1,`λ`],'-',[this.b0]))
	}
	get system() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			return nt.sys2(
				`${nt.dd(nt.x)} &= ${nt.y}`,
				`${nt.dd(nt.y)} &= `+tex.sum([this.b0+t,nt.x],'+',[this.b1+t,nt.y],'+',[input?`${input}(t)`:0])
			)
		},nt=>tex.sum([`λ^2`],'-',[this.b1,`λ`],'-',[this.b0]))
	}
	get vector() {
		return this.makeForm(isConstant=>input=>nt=>{
			const t=(isConstant?``:`(t)`)
			const pl=(isConstant||!input?`+`:`{+}`)
			const eq=(isConstant||!input?`=`:`{=}`)
			return `${nt.dd(nt.X)} ${eq} `+nt.mat2(0,1,this.b0+t,this.b1+t)+` ${nt.X} `+(input?` ${pl} `+nt.vec2(0,`${input}(t)`):``)
		},nt=>`\\det\\left(${nt.mat2('-λ',1,this.b0,tex.sum([this.b1],'-',['λ']))}\\right)`)
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
	getCharacteristicEquationTrait() {
		const classId=this.getClassId(true,true)
		return {
			contents: {
				[`linear_${classId}`]: characteristicEquationContent([2,this.a2],'+',[1,this.a1],'+',[0,this.a0],'=','0'),
				[`resolved_${classId}`]: characteristicEquationContent([2,1],'=',[1,this.b1],'+',[0,this.b0]),
				[`system_${classId}`]: nt=>[`\\[ ${this.system(true).characteristicEquation(nt)} \\]`],
				[`vector_${classId}`]: nt=>[`\\[ ${this.vector(true).characteristicEquation(nt)} \\]`],
			},
		}
	}
	getEquilibriumSolutionMethodTrait(isConstant) {
		const classId=this.getClassId(isConstant,true)
		const t=isConstant?'':'(t)'
		return {
			contents: {
				[`linear_${classId}`]: nt=>[
					{type:'switch',title:`\\( ${this.a0}${t} \\) is`,content:[
						{type:'case',title:`\\( ${this.a0}${t} = 0 \\)`,content:[
							`\\[ ${nt.x} = K \\]`,
						]},
						{type:'case',title:`\\( ${this.a0}${t} \\ne 0 \\)`,content:[
							`\\[ ${nt.x} = 0 \\]`,
						]},
					]},
				],
				[`resolved_${classId}`]: nt=>[
					{type:'switch',title:`\\( ${this.b0}${t} \\) is`,content:[
						{type:'case',title:`\\( ${this.b0}${t} = 0 \\)`,content:[
							`\\[ ${nt.x} = K \\]`,
						]},
						{type:'case',title:`\\( ${this.b0}${t} \\ne 0 \\)`,content:[
							`\\[ ${nt.x} = 0 \\]`,
						]},
					]},
				],
				[`system_${classId}`]: nt=>[
					{type:'switch',title:`\\( ${this.b0}${t} \\) is`,content:[ // 'c_1' -> 'b_0'
						{type:'case',title:`\\( ${this.b0}${t} = 0 \\)`,content:[
							`\\[ \\left\\{ \\begin{array}{rcl}`+
								`${nt.x} &=& K \\\\`+
								`${nt.y} &=& 0 \\\\`+
							`\\end{array} \\right. \\]`,
						]},
						{type:'case',title:`\\( ${this.b0}${t} \\ne 0 \\)`,content:[
							`\\[ \\left\\{ \\begin{array}{rcl}`+
								`${nt.x} &=& 0 \\\\`+
								`${nt.y} &=& 0 \\\\`+
							`\\end{array} \\right. \\]`,
						]},
					]},
				],
				[`vector_${classId}`]: nt=>[
					{type:'switch',title:`\\( ${this.b0}${t} \\) is`,content:[
						{type:'case',title:`\\( ${this.b0}${t} = 0 \\)`,content:[
							`\\[ ${nt.X} = \\begin{bmatrix} K \\\\ 0 \\end{bmatrix} \\]`,
						]},
						{type:'case',title:`\\( ${this.b0}${t} \\ne 0 \\)`,content:[
							`\\[ ${nt.X} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\]`,
						]},
					]},
				],
			},
		}
	}
}

module.exports=O2LinearEquationFormSuite
