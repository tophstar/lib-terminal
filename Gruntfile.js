module.exports = function (grunt) {

  grunt.initConfig({

    jshint: {
      all: ['source/**/*.js'],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    watch: {

    },

    requirejs: {
      build: {
        options: {
          name: "terminal",
          baseUrl: "./source",
          out: "./build/terminal.js",
          waitSeconds: 15,
          optimize: "none",
          optimizeCss: false,
          inlineText: false,
          isBuild: true,
          fileExclusionRegExp: /^\.|\.md$/,

          paths: {
            "angular": "../bower_components/angular/angular",
            "bootstrap": "../bower_components/angular-bootstrap/ui-bootstrap",
            "dialogs": "../bower_components/dialogs/dialogs"
          },

          shim: {
            "angular": {deps: [], exports: "angular"},
            "bootstrap": {deps: [], exports: "bootstrap"},
            "dialogs": {deps: [], exports: "dialogs"},
          },

          priority: [
            "angular",
            "bootstrap",
            "dialogs",
          ]
        }
      }
    },

    uglify: {
      options: {
      },
      dist: {
        files: {
          './build/terminal.min.js': ['./build/terminal.js']
        }
      }
    },

    less: {
      terminal: {
        options: {
          cleancss: false
        },
        files: {
          "build/terminal.css": "less/terminal.less",
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-less");

  grunt.registerTask("setup_build", function () {
    if (!grunt.file.exists("./build")) {
      grunt.file.mkdir("./build");
      grunt.log.ok("Added build folder.");
    } else {
      grunt.log.ok("Build file exists.");
    }
  });

    //gitless and modernizr must happen before require.  These both create files used by require.
  grunt.registerTask("default", ["setup_build", "jshint", "requirejs:build", "uglify",
      "less:terminal"]);
};
