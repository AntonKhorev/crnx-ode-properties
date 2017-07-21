'use strict'

const gulp=require('gulp')
const gulpTasks=require('crnx-build/gulp-tasks')

gulpTasks(
	gulp,
	"ODE properties",
	[],
	["'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML'"], // have to quote it manually b/c contains =
	[require.resolve('crnx-base')]
)
