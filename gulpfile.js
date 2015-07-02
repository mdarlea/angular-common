// Include gulp
var gulp = require('gulp');
var connect = require('connect');
var serveStatic = require('serve-static');

gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');

    var options = {
        html5Mode: false
    }

    return gulp.src('src/*.js')
               .pipe(gulpDocs.process(options))
               .pipe(gulp.dest('./docs'));
});

gulp.task('default', ['ngdocs'], function (cb) {
    var app = connect().use(serveStatic('./docs'));
    app.listen(8000);
    cb();
    console.log('Server started on http://localhost:8000');
});