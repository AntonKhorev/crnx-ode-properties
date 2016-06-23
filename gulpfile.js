'use strict'

const gulp=require('gulp')
const gulpTasks=require('crnx-build/gulp-tasks')

gulpTasks(
	gulp,
	"ODE properties",
	[],
	["'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'"], // have to quote it manually b/c contains =
	[require.resolve('crnx-base')]
)
