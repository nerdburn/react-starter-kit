// requirements
var gulp = require('gulp'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  nodemon = require('gulp-nodemon'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  eslint = require('gulp-eslint'),    
  path = require('path');

// file locations
var path = {
  js: './public/js/',
  css: './public/css/',
  lib: './public/lib/'
};

// startups
gulp.task('default', ['less', 'lint', 'js', 'watch', 'node']);

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
	gulp.watch(path.js + '**/*', ['lint', 'js']);
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

// lint
gulp.task('lint', function() {
  gulp.src(path.js + '/jsx/*')
    .pipe(eslint({
      baseConfig: {
        "ecmaFeatures": {
           "jsx": true
         }
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// js
gulp.task('js', function(){

  gulp.src([
      path.js + 'site.js'
    ])
    .pipe(babel({
      only: [
        path.js + '/jsx/*',
      ],
      compact: false
    }))
    .pipe(concat('site.js'))
    .pipe(gulp.dest(path.js));

});
