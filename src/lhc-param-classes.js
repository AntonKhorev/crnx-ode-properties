'use strict'

const LhcParam={}

LhcParam.Linear = class {
	constructor(a2,a1,a0) {
		this.a=[a0,a1,a2]
	}
	linear(i) {
		return this.a[i]
	}
}

module.exports=LhcParam
