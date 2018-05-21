const gulp = require('gulp'),
	rename = require('gulp-rename'),
	// sass = require('gulp-sass'),
	uglifycss = require('gulp-uglifycss'),
	mocha = require('gulp-mocha'),
	del = require('del'),
	livereload = require('gulp-livereload'),
	nodemon = require('gulp-nodemon'),
	webpack = require('webpack'),
	webpack_stream = require('webpack-stream'),
	webpack_config = require('./webpack.config.js');

const testSrc = 'tests/unit/*.js',
	webpackSrc = 'public/components/*.js',
	webpackDest = 'public/js/',
	sassSrc = 'public/sass/*.scss',
	sassDest = 'public/css/';

// Clean CSS build
gulp.task('clean:css', () => {
	return del([sassDest]);
});

// Test - Mocha
gulp.task('test', () => {
  	return gulp.src(testSrc, { read: false })
	 	.pipe(mocha({reporter: 'list',ui: 'tdd'}));
});

// Bundle - Webpack
gulp.task('webpack', ['test'], () => {
	return webpack_stream(webpack_config, webpack)
		.pipe(gulp.dest(webpackDest))
		.pipe(livereload());
});

// Sass
// gulp.task('sass', ['clean:css'], () => {
//    	return gulp.src(sassSrc)
//       	.pipe(sass().on('error', sass.logError))
//       	.pipe(uglifycss())
// 		.pipe(rename({ suffix: '.min' }))
// 		.pipe(gulp.dest(sassDest))
// 		.pipe(livereload());
// });

// Nodemon
// gulp.task('server', [ 'sass', 'webpack' ], () => {
gulp.task('server', [ 'webpack' ], () => {
    nodemon({
		script: 'server.js',
		watch: ['app/**/*.*', 'server.js'],
		ext: 'js hbs'
	})
	.on('restart',() => {
		gulp.src('server.js').pipe(livereload());
	});
});

// Watch
gulp.task('watch', () => {
	livereload.listen();
	gulp.watch(webpackSrc, ['webpack']);
	gulp.watch(testSrc, ['test']);
	// gulp.watch(sassSrc, ['sass']);
});

gulp.task('default', ['watch', 'server']);
