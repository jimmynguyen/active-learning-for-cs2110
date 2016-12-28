module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            options: {
              jshintrc: '.jshintrc',
              jshintignore: '.jshintignore',
              reporter: require('jshint-stylish')
            },
            gruntfile: {
              src: "Gruntfile.js"
            },
            all: [
                "Gruntfile.js",
                "app/js/**/*.js"]
        },
        concat: {
            options: {
                stripBanners: true,
                banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                "<%= grunt.template.today(\"yyyy-mm-dd\") %> */",
                separator: ";",
                nonull: true,
            },
            dist: {
                src: [
                    "node_modules/jquery/dist/jquery.min.js",
                    "node_modules/bootstrap/dist/js/bootstrap.min.js",
                    "node_modules/angular/angular.min.js",
                    "node_modules/angular-cookies/angular-cookies.min.js",
                    "node_modules/angular-md5/angular-md5.js",
                    "node_modules/angular-route/angular-route.min.js",
                    "node_modules/angular-toastr/dist/angular-toastr.tpls.min.js",
                    "node_modules/zingchart/client/zingchart.min.js",
                    "node_modules/zingchart-angularjs/src/zingchart-angularjs.js",
                    "app/js/**/*.js"
                ],
                dest: "app/dist/app.min.js",
            }
        },
        uglify: {
            options: {
                sourceMap: false,
                mangle: false
            },
            my_target: {
                files: {
                    "app/dist/app.min.js": ["<%= concat.dist.dest %>"]
                }
            }
        },
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    "node_modules/bootstrap/dist/css/bootstrap.min.css",
                    "node_modules/bootstrap/dist/css/bootstrap-theme.min.css",
                    "node_modules/angular-toastr/dist/angular-toastr.min.css",
                    "app/css/*.css"
                ],
                dest: "app/dist/app.min.css"
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'app/dist',
                    src: ['app.min.css'],
                    dest: 'app/dist',
                    ext: '.min.css'
                }]
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask("default", [
        "jshint",
        "concat",
        "uglify",
        "concat_css",
        "cssmin"
    ]);

};