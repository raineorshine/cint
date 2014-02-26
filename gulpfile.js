(function() {
	'use strict';

	var gulp =		require('gulp'),
			pkg = 		require('./package.json'),
			open =		require('gulp-open'),
			jshint =	require('gulp-jshint'),
			clean =		require('gulp-clean'),
			jsdoc =		require('gulp-jsdoc'),
			uglify =	require('gulp-uglify'),
			rename =	require('gulp-rename'),
			template =require('gulp-template');

	gulp.task('default', ['clean'], function() {

		gulp.src('src/*.js')
			// jshint not working now?
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(jshint.reporter('fail'))
		  .pipe(jsdoc('./docs'));

		gulp.src('src/*.js')
			.pipe(template({ version: pkg.version, date: (new Date()).toUTCString() }, { interpolate: /{{([\s\S]+?)}}/g }))
	    .pipe(rename({ basename: 'latest' }))
	    .pipe(gulp.dest('dist'))
	    .pipe(rename({ basename: 'cint-' + pkg.version }))
	    .pipe(gulp.dest('dist'))
	    .pipe(uglify())
	    .pipe(rename({ suffix:'.min' }))
	    .pipe(gulp.dest('dist'))
	    .pipe(rename({ basename: 'cint-' + pkg.version }))
	    .pipe(rename({ suffix:'.min' }))
	    .pipe(gulp.dest('dist'));
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
