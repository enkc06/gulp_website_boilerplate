"use strict";

var gulp = require("gulp"),
  path = require("path"),
  browserSync = require("browser-sync").create(),
  browser = require("browser-sync"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  htmlmin = require("gulp-htmlmin"),
  imagemin = require("gulp-imagemin"),
  watch = require("gulp-watch"),
  sass = require("gulp-sass"),
  pump = require("pump"),
  versionNumber = require("gulp-version-number"),
  connect = require("gulp-connect"),
  del = require("del");

const versionConfig = {
  value: "%MDS%",
  append: {
    key: "v",
    to: ["css", "js"]
  }
};

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./src",
      index: "index.html"
    }
  });
});

gulp.task("clean:folder", function() {
  return del("dist/**/*");
});

gulp.task("minify:img", function() {
  gulp
    .src("./src/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/img"));

  gulp
    .src("./src/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/images"));
});

gulp.task("sass:css", function() {
  gulp
    .src("./src/scss/main.scss")
    .pipe(sass({ style: "expanded" }).on("error", sass.logError))
    .pipe(gulp.dest("./src/css"));
});

gulp.task("minify:css", function() {
  return gulp
    .src("./src/css/**/*")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("minify:js", function(cb) {
  pump([gulp.src("./src/js/**/*"), uglify(), gulp.dest("dist/js")], cb);
});

gulp.task("copy:files", function() {
  gulp.src("./src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

gulp.task("add:version", function() {
  gulp
    .src(["src/*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(versionNumber(versionConfig))
    .pipe(gulp.dest("dist"));
});

gulp.task("prod:url", function() {
  gulp.src("./url.js").pipe(gulp.dest("dist/js/content/"));
});

gulp.task("connect", function() {
  connect.server({
    root: "dist",
    livereload: true
  });
});

gulp.task("refresh", function() {
  browserSync.reload();
});

gulp.task("watch", ["browser-sync", "refresh"], function() {
  gulp.watch("./src/scss/**/*.scss", ["sass:css"]);
  gulp.watch(["*src/**/*"], ["refresh"]);
});

gulp.task("default:build", [
  "minify:img",
  "sass:css",
  "minify:css",
  "minify:js",
  "add:version",
  "copy:files"
]);
