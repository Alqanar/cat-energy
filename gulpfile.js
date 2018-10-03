"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([include({
      root: 'source/'
    })]))
    .pipe(gulp.dest("build"));
});

gulp.task("fonts", function() {
  return gulp.src("source/fonts/*")
    .pipe(gulp.dest("build/fonts"));
});

gulp.task("image", function() {
  return gulp.src("source/img/*")
    .pipe(gulp.dest("build/img"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/fonts/*", gulp.series("fonts"));
  gulp.watch("source/img/*", gulp.series("image"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "html", "fonts", "image", "server"));

gulp.task("build", gulp.series("css", "html", "fonts", "image"));
