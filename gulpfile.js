var gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') ,
    notify = require("gulp-notify") ,
    bower = require('gulp-bower'),
    livereload = require('gulp-livereload'),
    server = require('gulp-server-livereload'),
    express = require('express'),
    connect = require('gulp-connect');

var config = {
     sassPath: './resources/sass',
     bowerDir: './bower_components' ,
    publicPath:'./public'
}

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) ;
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./public/fonts'))
        .pipe(livereload());
});

gulp.task('css', function() { 
    return gulp.src(config.sassPath + '/style.scss')
         .pipe(sass({
             style: 'compressed',
             loadPath: [
                 './resources/sass',
                 config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                 config.bowerDir + '/fontawesome/scss',
             ]
         }) 
            .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             }))) 
         .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

gulp.task('html', function() { 
    return gulp.src(config.publicPath + '*.html') 
        .pipe(livereload());
});


// Rerun the task when a file changes


gulp.task('watch', function () {
    gulp.watch('./public/**.*').on('change', livereload.changed);
    gulp.watch('./resources/sass/style.scss').on('change', livereload.changed);
    gulp.watch( './resources/sass/**/*.scss', ['css'] );
    livereload.listen();
});

gulp.task('webserver', function() {
    connect.server({
        root: 'public/',
        port: 8000,
        fallback: 'public/index.html',
        livereload: true,
        directoryListing: true
    });

});

  gulp.task('default', ['bower', 'icons', 'css','watch','html','webserver']);


