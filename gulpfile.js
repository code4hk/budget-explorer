var gulp = require('gulp');
// var gulputil = require('gulp-util');
var watch = require('gulp-watch');
// var uglify = require('gulp-uglify');
// var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
// var concat = require('gulp-concat');
// var less = require('gulp-less');
// var bower = require('gulp-bower');
// var deploy = require('gulp-gh-pages');
// var minifyCss = require('gulp-minify-css');
// var usemin = require('gulp-usemin');
// var markdown = require('gulp-markdown');
var component = require('gulp-component-build');

var dist = 'dist';
var publicFolder = 'public';


gulp.task('default', ['watch'], function() {


});
gulp.task('reload', function() {
  gulp.src(publicFolder + '/*')
    .pipe(watch(publicFolder + '/*'))
    .pipe(livereload());
})

//TODO fix he components path
gulp.task('components', [], function() {
  gulp.src('component.json', {
      cwd: publicFolder
    })
    .pipe(component.scripts({
      install: true
    }))
    .pipe(gulp.dest(publicFolder + '/build/'))
});
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(publicFolder + '/*', ['components', 'reload']);
})
