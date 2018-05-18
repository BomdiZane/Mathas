const gulp = require('gulp'),
	  rename = require('gulp-rename'),
	  sass = require('gulp-sass'),
	  uglifycss = require('gulp-uglifycss'),
	  mocha = require('gulp-mocha'),
	  del = require('del'),
	  livereload = require('gulp-livereload'),
	  nodemon = require('gulp-nodemon');

const testSrc = 'tests/*.js',
	sassSrc = 'public/sass/*.scss',
	sassDest = 'public/css/';

// Clean CSS build
gulp.task('clean:css', function() {
	return del([sassDest]);	
});

// Test - Mocha
gulp.task('test', function(){
  	return gulp.src(testSrc, {read: false})
	 	.pipe(mocha({reporter: 'list',ui: 'tdd'}));
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
gulp.task('server', ['sass'], function(){  
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
	gulp.watch('tests/*.js', ['test']);
	gulp.watch('public/sass/*.scss', ['sass']);
});

gulp.task('default', ['watch', 'server']);
