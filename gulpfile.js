(function() {
	'use strict';

	var gulp =		require('gulp'),
			// gutil = require('gulp-util'),
			open =		require('gulp-open'),
			jshint =	require('gulp-jshint'),
			clean =		require('gulp-clean'),
			jsdoc =		require('gulp-jsdoc');

	gulp.task('default', function() {

		gulp.src('./src/*.js')
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(jshint.reporter('fail'))
		  .pipe(jsdoc('./docs'));
	});

	gulp.task('docs', function() {
		gulp.src('./docs/index.html')
			// how to access piped src?
			.pipe(open('./docs/index.html', { app: 'Google Chrome' }));
	});

	gulp.task('clean', function() {
	  gulp.src('./documentation-output', {read: false})
	    .pipe(clean());
	});
})();
