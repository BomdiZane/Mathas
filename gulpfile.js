const gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	livereload = require('gulp-livereload'),
	nodemon = require('gulp-nodemon'),
	webpack = require('webpack'),
	webpack_stream = require('webpack-stream'),
	webpack_config = require('./webpack.config.js');

const testSrc = 'tests/unit/*.js',
	webpackSrc = 'public/components/*.js',
	webpackDest = 'public/js/';

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

// Nodemon
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
});

gulp.task('default', ['watch', 'server']);
