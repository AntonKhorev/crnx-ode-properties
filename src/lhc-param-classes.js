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

LhcParam.Resolved = class {
	constructor(b1,b0) {
		this.b=[b0,b1]
	}
	resolved(i) {
		return this.b[i]
	}
}

module.exports=LhcParam
