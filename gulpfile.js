// Require node modules
const gulp = require('gulp'),
			sass = require('gulp-sass'),
			gutil = require('gulp-util'),
			plumber = require('gulp-plumber'),
			rename = require('gulp-rename'),
			minifyCSS = require('gulp-clean-css'),
			prefixer = require('gulp-autoprefixer'),
			connect = require('gulp-connect');
			childProcess = require('child_process');


// Set the path variables
const base_path = './',
			src = base_path + '_dev/',
			dist = base_path + 'assets',
			paths = {
					js: src + '/scripts/**/*.js',
					scss: src +'/styles/**/*.scss',
					jekyll: [
									'_data/*',
									'_pages/*',
									'_posts/*',
									'_layouts/*',
									'_includes/*' ,
									'assets/**/*'
									]
			};


// Compile SCSS to CSS
gulp.task('compile-sass', () => {
	return gulp.src(paths.scss)
		.pipe(plumber((error) => {
				gutil.log(gutil.colors.red(error.message));
				gulp.task('compile-sass').emit('end');
		}))
		.pipe(sass())
		.pipe(prefixer('last 3 versions', 'ie 9'))
		.pipe(minifyCSS())
		.pipe(rename({dirname: dist + '/styles'}))
		.pipe(gulp.dest('./'));
});


// Rebuild Jekyll
gulp.task('build-jekyll', (code) => {
	return childProcess.spawn('jekyll', ['build', '--incremental'], { stdio: 'inherit' }) // Adding incremental reduces build time.
		.on('error', (error) => gutil.log(gutil.colors.red(error.message)))
		.on('close', code);
})


// Setup server
gulp.task('server', () => {
	connect.server({
		root: ['_site'],
		port: 4000
	});
})


// Watch files
gulp.task('watch', () => {
	gulp.watch(paths.scss, ['compile-sass']);
	gulp.watch(paths.jekyll, ['build-jekyll']);
});


// Start everything with the default task
gulp.task('default', [ 'compile-sass', 'build-jekyll', 'server', 'watch' ]);