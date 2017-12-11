var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    uncss = require('gulp-uncss'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('consol', function() {
    console.log('hello world');
});

gulp.task('clean', function(){
	return del.sync('dist');
})

gulp.task('clearCach', function(){
    return cache.clearAll();
})

gulp.task('default', function () {
  return gulp.src('app/css/allcss/*.css')
    .pipe(concatCss("style.min.css"))
    .pipe(autoprefixer(['last 10 version']))//автопрефиксы
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(uncss({html: ['app/*.html']}))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({stream: true}));//перезагружаем страницу
});



gulp.task('browser-sync', function() {//синхронизация браузера с изменениями
    browserSync.init({
        server: {
            baseDir: "app"
        },//не было запитой и выдавало ошибку при отчключении уведомлений
        notify: false
    });
});

gulp.task('watch',['browser-sync','default'], function(){//следит за изменениями в файлах
	gulp.watch('app/css/allcss/style.css', ['default']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('img', function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean','img','default'], function(){
    var buildCss = gulp.src(['app/css/style.min.css'])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/font/**/*')
    .pipe(gulp.dest('dist/font'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
})