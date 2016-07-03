var
	gulp        = require('gulp'),
	jade        = require('gulp-jade'),
	browserSync = require('browser-sync').create(),
	browserify  = require('gulp-browserify'),
	uglify      = require('gulp-uglify'),
	rename      = require("gulp-rename"),
	sass 		= require('gulp-sass'),
	plumber     = require('gulp-plumber'),
	spritesmith = require('gulp.spritesmith'),
	concat      = require('gulp-concat'),
	svgmin		= require('gulp-svgmin');

/* --------- paths --------- */

var
	paths = {
		jade : {
			location    : 'app/jade/**/*.jade',
			compiled    : 'app/jade/_pages/*.jade',
			destination : '.'
		},

		scss : {
			location    : 'app/scss/**/*.scss',
			entryPoint  : 'app/css/main.css'
		},

		js : {
			location    : 'app/js/main.js',
			plugins     : 'app/js/_plugins/*.js',
			destination : 'scripts'
		},

		browserSync : {
			baseDir : './',
			watchPaths : ['*.html', 'app/css/*.css', 'app/js/*.js']
		}
	}

/* --------- jade --------- */

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

// Работа с sass
gulp.task('sass', function() {
  gulp.src(paths.scss.location)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

/* --------- browser sync --------- */

gulp.task('sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});
/* --------- sprite --------- */
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/all-icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
		padding: 60,
		algorithm: 'binary-tree'
  }));
  return spriteData.pipe(gulp.dest('app/img/images/sprites/'));
});
/* --------- plugins --------- */

gulp.task('plugins', function() {
	return gulp.src(paths.js.plugins)
		.pipe(plumber())
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.destination));
});

/* --------- plugins --------- */

gulp.task('scripts', function() {
	return gulp.src(paths.js.location)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(paths.js.destination));
});

gulp.task('watch', function(){
	gulp.watch(paths.jade.location, ['jade']);
	gulp.watch(paths.scss.location, ['sass']);
	gulp.watch(paths.js.location, ['scripts']);
	gulp.watch(paths.js.plugins, ['plugins']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});
/* --------- default --------- */

gulp.task('default', ['jade', 'sass', 'sync', 'watch']);
