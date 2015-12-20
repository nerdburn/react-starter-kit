// requirements
var gulp = require('gulp'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  nodemon = require('gulp-nodemon'),
  concat = require('gulp-concat'),
  path = require('path'),
  babel = require('gulp-babel');

// file locations
var path = {
  js: './public/js/',
  css: './public/css/',
  lib: './public/lib/'
};

// startups
gulp.task('default', ['watch', 'less', 'js', 'node']);

// static
gulp.task('static', ['less']);

// node
gulp.task('node', function() {
  nodemon({
    script: 'app.js',
    env: { 'NODE_ENV': 'development' },
    ext: 'html js less',
    ignore: [path.js + 'app.min.js']
  })
  .on('restart', function(items) {
    console.log(items);
  });
});

gulp.task('watch', function() {
	gulp.watch(path.js + '**/*', ['js']);
	gulp.watch(path.css + "**/*", ['less']);
});

// less
gulp.task('less', function() {

  gulp.src(path.css + 'datawallet.less')
    .pipe(less())
    .on('error', function(err) {
      console.log('Error with LESS.js: ', err.message);
    })
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.css));

});

// js
gulp.task('js', function(){

  gulp.src([
      path.js + 'site.js'
    ])
		.pipe(babel({
			presets: ['es2015']
		}))
    .pipe(concat('site.js'))
    .pipe(gulp.dest(path.js));

});
