'use strict'

const traits=[
	['entity',[
		['associatedHomogeneousEquation'],
		['characteristicEquation'],
	]],
	['property',[
		['isoclineProperty'],
		['solutionRelation',[
			['shiftSolutionRelation'],
			['linearitySolutionRelation',[ // linear and affine properties of solutions
				['solutionSpaceBasis'],
				['homogeneitySolutionRelation'],
				['additivitySolutionRelation'],
				['twoLinearCombinationSolutionRelation'],
				['nLinearCombinationSolutionRelation'],
				['twoAffineCombinationSolutionRelation'],
				['nAffineCombinationSolutionRelation'],
				['associatedSolutionRelation'],
			]]
		]],
	]],
	['transform',[
		['orderReduction'],
	]],
	['solutionMethod',[
		['generalSolutionMethod'],
		['phaseSolutionMethod'],
		['equilibriumSolutionMethod'],
		['testSolutionMethod'],
	]],
	['plot'],
]

// class entries:
//	hasForm = use this value as form type instead of class id
//	...TODO...

// trait entries:
//	title = redefine title
//	content
//	form = have to present the equation in which this trait was defined
//		if true: form type is equal to class id
//		otherwise: object: { formType1:true, formType2:true, ... }; usually lists children forms
//	close = children don't need to inherit this trait; display it only if parents have it displayed
//	compare = show only if other classes have this property without compare entry
module.exports=(nt)=>{
	const classes={}
	const merge=(mergedClassesGenerator)=>{
		const mergedClasses=mergedClassesGenerator(nt)
		for (let id in mergedClasses) {
			classes[id]=mergedClasses[id]
		}
	}
	merge(require('./data/equations-1st'))
	merge(require('./data/equations-2nd'))
	merge(require('./data/equations-nth'))
	merge(require('./data/systems'))
	return {traits,classes}
}
