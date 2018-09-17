const gulpPostcss = require("gulp-postcss"),
	  autoprefixer = require("autoprefixer"),
	  postcssSimpleVars = require("postcss-simple-vars"),
	  postcssNested = require("postcss-nested"), 
	  postcssMixins = require("postcss-mixins"),
	  postcssImport = require("postcss-import"),
	  hexRgba = require("postcss-hexrgba"),
	  rename = require("gulp-rename"),
	  browserify = require('browserify'),
	  source = require('vinyl-source-stream'),
	  gulp = require('gulp'),
      browserSync = require('browser-sync');

let manhattan = {
    cssSrcFile : "./app/css-tmp/manhattan-unbundled.css",
    bundledCssFileName : 'manhattan.css',
    bundledCssFileDest : './app/css/'
}

let bundleCssI = 0; 
let reloadHtmlI = 0; 

bundleCss(manhattan);

gulp.task('default', () => {
    browserSync.init({ 
        notify:false,
        server: {
            baseDir: "/home/sandor/Documents/on-going-projects/manhattan/app/"
        }   
    });
    gulp.watch('./app/*.html', function() {
        browserSync.reload();
        reloadHtmlI++

        console.log('html reloaded: ' + reloadHtmlI);
    });

    gulp.watch('./app/css-tmp/**/**/*.css', function() {
        browserSync.reload();

        bundleCssI++;
        console.log('bundle-css cycles: ' + bundleCssI);
        
        bundleCss(manhattan); 
    });

});


function bundleCss(fileForPageObj){
    let cssSrcFile = fileForPageObj.cssSrcFile
    let bundledCssFileName = fileForPageObj.bundledCssFileName
    let bundledCssFileDest = fileForPageObj.bundledCssFileDest

    console.log('been bundled');
    return gulp.src(cssSrcFile)
    .pipe(gulpPostcss([
        postcssImport,
        autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }),
        postcssMixins, 
        postcssSimpleVars,
        hexRgba,
        postcssNested
    ]))
    .on('error', function(errorInfo){
        console.log( errorInfo.toString())
        this.emit('end');
    })
    .pipe(rename(bundledCssFileName))
    .pipe(gulp.dest(bundledCssFileDest))
}