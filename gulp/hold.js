
    /** *****************************************
     * Default Task
     ** ***************************************** */
    gulp.task('default', ['modules']);

    /** *****************************************
     * Tasks for Jasmine Test
     ** ***************************************** */
    gulp.task('test', function() {
        var _en = environment('test', true, true, true, false);
        return gulp.src(_en.sourceHtmlFile)
            .pipe(inject(_en.sourceJs()))
            .pipe(_en.destination());
    });

    /** *****************************************
     * Tasks for Watch features
     ** ***************************************** */
    gulp.task('watch', ['default'], function() {
        gulp.watch(modulesFolder, ['default']);
    });

    /** *****************************************
     * Tasks and functions for Dev build
     ** ***************************************** */
    gulp.task('dev', function() {
        var _en = environment('dev', true, false, false, false);
        return gulp.src(_en.sourceHtmlFile)
            .pipe(inject(_en.sourceCss()))
            .pipe(inject(_en.sourceJs()))
            .pipe(_en.destination());
    });

    /** *****************************************
     * Tasks for documentation
     ** ***************************************** */
    gulp.task('docs', [], function() {
        var _en = environment('docs', true, true, false, false);
        return _en.sourceJsCode()
            .pipe(gulpDocs.process({
                html5Mode: true,
                title: "Scheduler",
                image: "images/favicon.png"
            }))
            .pipe(_en.destination());
    });

    gulp.task('templates', function() {
        gulp.src(sourceBasePath + '*.html')
            .pipe(templateCache())
            .pipe(gulp.dest('src'));
    });
