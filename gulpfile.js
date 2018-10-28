"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var image = require("gulp-image");
var webp = require("gulp-webp");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var cssnano = require("gulp-cssnano");
var del = require("del");
var uglify = require("gulp-uglify");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(cssnano())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([include({
      root: "build/"
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

gulp.task("imagemin", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(image({
      optipng: ["-i 1", "-strip all", "-fix", "-o3", "-force"],
      pngquant: ["--speed=1", "--force", 256],
      zopflipng: ["-y", "--lossy_8bit", "--lossy_transparent"],
      jpegRecompress: false,
      mozjpeg: ["-quality", 95, "-progressive"],
      guetzli: false,
      gifsicle: false,
      svgo: ["--enable", "cleanupIDs", "--disable", "convertColors"]
    }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function() {
  return gulp.src("source/img/sprite-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("js", function() {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("clean", function() {
  return del("build");
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
  gulp.watch("source/img/*.svg", gulp.series("sprite"));
  gulp.watch("source/fonts/*", gulp.series("fonts"));
  gulp.watch("source/img/*", gulp.series("image"));
  gulp.watch("source/js/*", gulp.series("js"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("clean", "fonts", "js", "image", "css", "sprite", "html", "server"));

gulp.task("build", gulp.series("clean", "fonts", "js", "image", "css", "sprite", "html"));
