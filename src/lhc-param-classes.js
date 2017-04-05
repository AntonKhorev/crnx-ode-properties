'use strict'

const LhcParam={}

LhcParam.Linear = class {
	constructor(a2,a1,a0) {
		this.a=[a0,a1,a2]
	}
	linear(i) {
		return this.a[i]
	}
	resolved(i) {
		if (this.a[i]!=0) {
			return `-\\frac{${this.a[i]}}{${this.a[2]}}`
		} else {
			return 0
		}
	}
	system(i,j) {
		if (i==1) {
			if (j==1) {
				return 0
			} else if (j==2) {
				return 1
			}
		} else if (i==2) {
			return this.resolved(j-1)
		}
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

LhcParam.ReducedSystem = class {
	constructor(c,d) {
		this.A=[[0,1],[c,d]]
	}
	system(i,j) {
		return this.A[i-1][j-1]
	}
}

module.exports=LhcParam
