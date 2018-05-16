const gulp = require('gulp'),
	  jshint = require('gulp-jshint'),
	  uglify = require('gulp-uglify-es').default,
	  sourcemaps = require('gulp-sourcemaps'),
	  babel = require('gulp-babel'),
	  rename = require('gulp-rename'),
	  changed = require('gulp-changed'),
	  sass = require('gulp-sass'),
	  uglifycss = require('gulp-uglifycss'),
	  mocha = require('gulp-mocha'),
	  del = require('del'),
	  livereload = require('gulp-livereload'),
	  nodemon = require('gulp-nodemon');

const hintSrc = ['*.js', 'public/lib/*.js', 'tests/*.js', 'app/**/*.js', 'config/*.js'],
	testSrc = 'tests/*.js',
	jsSrc = 'public/lib/*.js',
	jsDest = 'public/js/',
	sassSrc = 'public/sass/*.scss',
	sassDest = 'public/css/';

// Clean JS build
gulp.task('clean:js', function() {
	return del([jsDest]);	
});

// Clean CSS build
gulp.task('clean:css', function() {
	return del([sassDest]);	
});

// JS Hint
gulp.task('hint', function() {
	return gulp.src(hintSrc)
	  	// .pipe(changed(hintSrc)) 
	  	.pipe(jshint())
    	.pipe(jshint.reporter('default'));
});

// Test - Mocha
gulp.task('test', function(){
  	return gulp.src(testSrc, {read: false})
	 	.pipe(mocha({reporter: 'list',ui: 'tdd'}));
});

// Uglify
gulp.task('uglify', ['test', 'clean:js'], function () {
	return gulp.src(jsSrc)
		.pipe(babel())
   		.pipe(uglify().on('error', err => console.log(err)))
   		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(jsDest))
		.pipe(livereload());
});

// Sass
gulp.task('sass', ['clean:css'], function() {
   	return gulp.src(sassSrc)
      	.pipe(sass().on('error', sass.logError))
      	.pipe(uglifycss())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(sassDest))
		.pipe(livereload());
});

// Nodemon
gulp.task('server', ['hint', 'sass', 'uglify'], function(){  
    nodemon({
			script: 'server.js',
			watch: ['app/**/*.*', 'server.js'],
			ext: 'js hbs'
		})
		.on('restart',function(){  
			gulp.src('server.js')
				.pipe(livereload());
		});
});

// Watch
gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(['*.js', 'app/**/*.js', 'config/*.js'], ['hint']);
	gulp.watch('public/lib/*.js', ['hint', 'uglify']);
	gulp.watch('tests/*.js', ['hint', 'test']);
	gulp.watch('public/sass/*.scss', ['sass']);
});

gulp.task('default', ['watch', 'server']);