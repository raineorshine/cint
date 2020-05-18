(function() {
  'use strict'

  const gulp =    require('gulp')
  const fs =      require('fs')
  const pkg =     require('./package.json')
  const open =    require('gulp-open')
  const clean =   require('gulp-clean')
  const uglify =  require('gulp-uglify')
  const rename =  require('gulp-rename')
  const header =  require('gulp-header')
  const extend =  require('lodash.assign')

  const srcPath = 'src/cint.js'
  const destPath = './'
  const docsPath = 'docs'

  gulp.task('default', ['clean'], function() {

    const buildPackage = extend(pkg, { buildtime: new Date().toUTCString() })
    const headerTemplate = fs.readFileSync('header.ejs')

    gulp.src(srcPath)
      .pipe(header(headerTemplate, buildPackage))
      .pipe(gulp.dest(destPath))
      .pipe(uglify())
      .pipe(header(headerTemplate, buildPackage))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(destPath))
  })

  gulp.task('clean', function() {
    gulp.src(['docs'], { read: false })
      .pipe(clean({ force: true }))
  })

})()
