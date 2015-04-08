var lsModules = require('./gulp/modules.js')({
        debugPrint: false,

        // modules folder
        modulesFolder: 'modules',

        // Plato JS Report subfolder
        platoJSReportSubfolder: 'report'
    }),

    gulp = require('gulp');

/** *****************************************
 * Default Task
 ** ***************************************** */
gulp.task('default', lsModules.getModuleTaskNames('./modules'));
