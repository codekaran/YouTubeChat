var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"));
});

// var gulp = require("gulp");
// var ts = require("gulp-typescript");
// var tsProject = ts.createProject("tsconfig.json");
// argv = require('yargs').argv, // for args parsing
// spawn = require('child_process').spawn;

// gulp.task('log', function() {
//     console.log('CSSs has been changed');
//   });
  
//   gulp.task('watching-task', function() {
//     gulp.watch('*.css', ['log']);
//   });
  
//   gulp.task('auto-reload', function() {
//     var p;
  
//     gulp.watch('gulpfile.js', spawnChildren);
//     spawnChildren();
  
//     function spawnChildren(e) {
//       // kill previous spawned process
//       if(p) { p.kill(); }
  
//       // `spawn` a child `gulp` process linked to the parent `stdio`
//       p = spawn('gulp', [argv.task], {stdio: 'inherit'});
//     }
//   });


