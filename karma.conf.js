// Karma configuration
// Generated on Sat Feb 07 2015 12:49:13 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/moment/min/moment.min.js',
            'bower_components/chance/chance.js',
            'bower_components/hammerjs/hammer.js',
            'bower_components/lodash/dist/lodash.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-material/angular-material.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/restangular/dist/restangular.js',
            'bower_components/ng-messages/angular-messages.js',
            'src/**/*.js',
            'src/**/*.html'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.html': 'ng-html2js',
            'src/**/*.js': ['coverage']
        },

        ngHtml2JsPreprocessor: {
            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            //stripPrefix: "source/path/to/templates/.*/",
            // prependPrefix: "base/",

            // the name of the Angular module to create
            moduleName: "templates"
        },

//        plugins: [
//            'karma-jasmine',
//            'karma-coverage',
//            'karma-chrome-launcher',
//            'karma-firefox-launcher',
//            'karma-dhtml-reporter',
//            'karma-nghtml2js'
//        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'DHTML'], //, 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        dhtmlReporter: {
            'outputFile': '/report.html',
            'exclusiveSections': true
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }
    });
};
