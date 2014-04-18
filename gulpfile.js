(function() {
	'use strict';

	var gulp =		require('gulp'),
			fs = 			require('fs'),
			pkg = 		require('./package.json'),
			open =		require('gulp-open'),
			jshint =	require('gulp-jshint'),
			clean =		require('gulp-clean'),
			jsdoc =		require('gulp-jsdoc'),
			uglify =	require('gulp-uglify'),
			rename =	require('gulp-rename'),
			header =	require('gulp-header'),
			extend = 	require('lodash.assign');

	var srcPath = 'src/cint.js',
			destPath = './',
			docsPath = 'docs';

	gulp.task('default', ['clean'], function() {

		gulp.src(srcPath)
			// jshint not working now?
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(jshint.reporter('fail'))
		  .pipe(jsdoc(docsPath))

		gulp.src(srcPath)
			.pipe(header(fs.readFileSync('header.ejs'), extend(pkg, { buildtime: (new Date()).toUTCString() })))
	    .pipe(gulp.dest(destPath))
	    .pipe(uglify())
	    .pipe(rename({ suffix: '.min' }))
	    .pipe(gulp.dest(destPath))
	});

	gulp.task('docs', function() {
		gulp.src('./docs/index.html')
			// how to access piped src?
			// TODO: output stderr
			.pipe(open('./docs/index.html', { app: 'Google Chrome' }));
	});

	gulp.task('clean', function() {
	  gulp.src(['docs'], {read: false})
	    .pipe(clean({force:true}));
	});

})();
