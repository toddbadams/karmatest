var
    gulp = require('gulp'),
    path = require('path'),
    fs = require('fs');

/**
 * get a list of subfolders
 */
function getFolders(folder) {
    return fs.readdirSync(folder)
        .filter(function(file) {
            return fs.statSync(path.join(folder, file)).isDirectory();
        });
}

/**
 * Get a list of files within a folder
 * ext is optional file extension
 */
function getFiles(folder, ext) {
    return fs.readdirSync(folder)
        .filter(function(file) {
            if (ext && path.extname(file) !== ext) return false;

            return fs.statSync(path.join(folder, file)).isFile();
        });
}

function getFolderName(path) {
    var _arr = path.split('/');
    return _arr[_arr.length - 1];
}

/**
 * get a gulp source of JS files
 */
function getSrcJs(folder, options) {
    var _srcJs = [folder + '/**/*.js'];
    if (!options.includeFakes) _srcJs.push('!' + folder + '/**/*fake.js');
    if (!options.includeApis) _srcJs.push('!' + folder + '/**/*spec.js');
    if (!options.includeSpecs) _srcJs.push('!' + folder + '/**/*api.js');
    return gulp.src(_srcJs, {
        read: options.read
    });
}

/**
 * get a gulp source of CSS files
 */
function getSrcCss(folder) {
    var _srcCss = [folder + '/**/*.css'];
    return gulp.src(_srcCss);
}

/**
 * extend an object
 */
function objectExtend(to, from) {
    for (var prop in to) {
        // important check that this is objects own property
        // not from prototype prop inherited
        if (to.hasOwnProperty(prop) && from.hasOwnProperty(prop)) {
            to[prop] = from[prop];
        }
    }
}

module.exports = {
    getFolders: getFolders,
    getFiles: getFiles,
    getFolderName: getFolderName,
    getSrcJs: getSrcJs,
    getSrcCss: getSrcCss,
    objectExtend: objectExtend
};
