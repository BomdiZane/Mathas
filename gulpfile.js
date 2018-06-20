const gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	livereload = require('gulp-livereload'),
	nodemon = require('gulp-nodemon'),
	webpack = require('webpack'),
	webpack_stream = require('webpack-stream'),
	webpack_config = require('./webpack.config.js');

const testSrc = 'tests/unit/*.js',
	webpackSrc = ['app/views/components/**/*.js', 'app/sass/**/*.scss'],
	webpackDest = 'app/static/js/',
	reloadSrc = ['app/views/templates/**/*.hbs', 'app/static/images/*.*', 'app/static/thumbs/*.*'];

gulp.task('reload', () => gulp.src(reloadSrc).pipe(livereload()));

gulp.task('test', () => {
	return gulp.src(testSrc, { read: false })
		.pipe(mocha({reporter: 'list',ui: 'tdd'}));
});

gulp.task('webpack', ['test'], () => {
	return webpack_stream(webpack_config, webpack)
		.pipe(gulp.dest(webpackDest))
		.pipe(livereload());
});

gulp.task('server', [ 'webpack' ], () => {
	nodemon({
		script: 'server.js',
		watch: ['app/routes/*.*', 'app/models/*.*', 'app/*.js'],
		ext: 'js hbs'
	})
		.on('restart',() => {
			gulp.src('server.js').pipe(livereload());
		});
});

gulp.task('watch', () => {
	livereload.listen();
	gulp.watch(webpackSrc, ['webpack']);
	gulp.watch(testSrc, ['test']);
	gulp.watch(reloadSrc, ['reload']);
});

gulp.task('default', ['watch', 'server']);
