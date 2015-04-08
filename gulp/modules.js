var lsUtils = require('./utils.js'),
    gulp = require('gulp'),
    clean = require('gulp-clean'), // https://www.npmjs.com/package/gulp-clean
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'), // https://www.npmjs.com/package/gulp-jshint
    plato = require('gulp-plato'),
    print = require('gulp-print'),
    options = {
        debugPrint: true,

        // modules folder
        modulesFolder: './modules',

        // Plato JS Report subfolder
        platoJSReportSubfolder: 'report'
    };

/**
 * Create task to clean a module folder
 */
function createModuleCleanTask(folder, files) {
    var _name = 'clean' + folder;

    gulp.task(_name, function() {
        return gulp.src(files)
            .pipe(gulpif(options.debugPrint, print(function(filepath) {
                return 'removed: ' + filepath;
            })))
            .pipe(clean({
                force: true
            }));
    });
    return _name;
}

/**
 * Create task to validate a module folder
 */
function createModuleValidateJsTask(folder, dependencies) {
    var _name = 'validate' + folder;

    gulp.task(_name, dependencies, function() {
        return lsUtils.getSrcJs(folder, {
                includeFakes: true,
                includeApis: true,
                includeSpecs: true,
                read: true
            })
            .pipe(jshint('.jshintrc'))
            .pipe(gulpif(options.debugPrint, print(function(filepath) {
                return 'validated: ' + filepath;
            })))
            .pipe(jshint.reporter(require('jshint-summary')()));
    });

    return _name;
}

/**
 * Create task to create a plato report for a module folder
 */
function createBuildPlatoJsReportTask(folder, dependencies) {
    var _name = 'platoReport' + folder;
    gulp.task(_name, dependencies, function() {
        return lsUtils.getSrcJs(folder, {
                includeFakes: true,
                includeApis: true,
                includeSpecs: true,
                read: true
            })
            .pipe(plato(folder + '/' + options.platoJSReportSubfolder, {
                jshint: {
                    options: {
                        strict: true
                    }
                },
                complexity: {
                    trycatch: true
                }
            }));
    });

    return _name;
}

/**
 * Create task to create a the module level js file with fakes and no api
 */
function createJsFakeConcatTask(folder, dependencies, filename) {
    var _name = 'jsFakeConcat' + folder;
    gulp.task(_name, dependencies, function() {
        return lsUtils.getSrcJs(folder, {
                includeFakes: true,
                includeApis: false,
                includeSpecs: false,
                read: true
            })
            .pipe(concat(filename))
            .pipe(gulp.dest(folder + '/'))
            .pipe(gulpif(options.debugPrint, print(function(filepath) {
                return 'created: ' + filepath;
            })));
    });

    return _name;
}

/**
 * Create tasks for all modules
 */
function getModuleTaskNames(root) {
    var folders = lsUtils.getFolders(root),
        _i,
        _l = folders.length,
        _names = [];

    for (_i = 0; _i < _l; _i += 1) {
        _names.push(createModuleTasks(root + '/' + folders[_i]));
    }
    return _names;
}

/**
 * Create a set of tasks for a given module
 */
function createModuleTasks(folder) {
    var _fakeJSFilename = lsUtils.getFolderName(folder) + 'fake.js',
        _platoReportFolder = folder + '/' + options.platoJSReportSubfolder,
        _cleanFiles = [
            folder + '/' + _fakeJSFilename,
            _platoReportFolder
        ],

        _cleanTaskName = createModuleCleanTask(folder, _cleanFiles, options),
        _validateTaskName = createModuleValidateJsTask(folder, [_cleanTaskName], _platoReportFolder, options),
        _buildReportTaskName = createBuildPlatoJsReportTask(folder, [_cleanTaskName], options),
        _fakesTaskName = createJsFakeConcatTask(folder, [_cleanTaskName], _fakeJSFilename, options),

        _name = 'module' + folder,
        _dependancies = [_validateTaskName, _fakesTaskName],
        _subfolders = lsUtils.getFolders(folder);

    if (_subfolders.indexOf('modules') > -1) {
        var _f = getModuleTaskNames(folder+'/modules'),
        _i,
        _l = _f.length;
        for(_i=0; _i<_l; _i+=1){
            _dependancies.unshift(_f[_i]);
        }
    }

    gulp.task(_name, _dependancies);
    return _name;
}

module.exports = function(opt) {
    lsUtils.objectExtend(options, opt);
    return {
        getModuleTaskNames: getModuleTaskNames
    };
};
