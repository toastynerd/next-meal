const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const livereload = require('gulp-livereload');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const neat = require('node-neat').includePaths;
const KarmaServer = require('karma').Server;
const autoprefixer = require('gulp-autoprefixer');

var serverFiles = ['lib/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'test/unit/server/**/*.js',
                   '_server.js', 'gulpfile.js', 'index.js', 'server.js', 'karma.conf.js'];
var staticFiles = ['app/**/*.html', 'app/**/*.jpg', 'app/**/*.svg', 'app/**/*.png'];
var testBuildFiles = ['babel-polyfill', 'test/unit/client/test_entry.js'];
var buildFiles = ['babel-polyfill', 'app/js/entry.js'];

var nodemonOptions = {
  script: 'server.js',
  ext: 'html scss js',
  ignore: ['build/'],
  tasks: ['build:dev', 'lint']
};

gulp.task('lint:server', () => {
  return gulp.src(serverFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:app', () => {
  return gulp.src('app/**/*.js')
    .pipe(eslint({
      'env': {
        'browser': true,
        'es6': true,
        'commonjs': true
      },
      'globals': {
        'angular': 1
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:test', () => {
  return gulp.src('test/unit/client/**/*.js')
  .pipe(eslint({
    'env': {
      'browser': true,
      'jasmine': true,
      'protractor': true
    }
  }))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('sass:dev', () => {
  return gulp.src('app/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['sass'].concat(neat)
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'));
});

gulp.task('sass:pro', () => {
  return gulp.src('app/sass/main.scss')
    .pipe(sass({
      includePaths: ['sass'].concat(neat)
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build'));
});

gulp.task('webpack:dev', () => {
  return gulp.src(buildFiles)
    .pipe(named())
    .pipe(webpack({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            include: [
              __dirname + '/app/js'
            ],
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('webpack:pro', () => {
  return gulp.src(buildFiles)
    .pipe(named())
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            include: [
              __dirname + '/app/js'
            ],
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('webpack:test', () => {
  return gulp.src(testBuildFiles)
    .pipe(named())
    .pipe(webpack({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          { test: /\.html$/, loader: 'html' },
          {
            test: /\.js$/,
            include: [
              __dirname + '/app/js',
              __dirname + '/test/unit/client'
            ],
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('test'));
});

gulp.task('static', () => {
  return gulp.src(staticFiles)
    .pipe(gulp.dest('build'));
});

gulp.task('server:test', ['client:test'], () => {
  return gulp.src('test/unit/server/**/*_test.js')
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('client:test', ['webpack:test'], (done) => {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('watch', ['build:dev', 'lint'], () => {
  livereload.listen();
  nodemon(nodemonOptions).on('restart', () => {
    gulp.src('server.js')
      .pipe(livereload());
    console.log('restarted');
  });
});

gulp.task('lint', ['lint:server', 'lint:app', 'lint:test']);
gulp.task('test', ['server:test']);
gulp.task('build:dev', ['sass:dev', 'webpack:dev', 'static']);
gulp.task('build:pro', ['sass:pro', 'webpack:pro', 'static']);
gulp.task('default', ['lint', 'test']);
