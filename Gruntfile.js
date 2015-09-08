/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    less: {
      all: {
        options: {
          //compress: true,
          // cleancss: true,
          report: 'min'
        },
        expand: true,
        cwd: "public/less",
        src: "main.less",
        dest: "public/stylesheets",
        ext: ".css",
        //flatten: true
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      all: {
        src: ['public/javascript/*.js']
      }
    },
    mochaTest: {
      test: {
        options: {
          run: true,
          reporter: 'spec',
          quiet: false,
          clearRequireCache: true,
          url: 'http://localhost:9001'
        },
        src: ['tests/*.js']
      }
    },
    watch: {
      //gruntfile: {
      //  files: '<%= jshint.gruntfile.src %>',
      //  tasks: ['jshint:gruntfile']
      // },
      src: {
        files: ['public/less/*.less', 'views/*.ejs', 'tests/*.js', 'public/javascripts/*.js'],
        tasks: ['default']
      },
      options: {
        spawn: false,
        livereload: 35729
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // On watch events, if the changed file is a test file then configure mochaTest to only
  // run the tests from that file. Otherwise run all the tests
  var defaultTestSrc = grunt.config('mochaTest.test.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.test.src', defaultTestSrc);
    if (filepath.match('test/')) {
      grunt.config('mochaTest.test.src', filepath);
    }
  });

  // Default task.
  grunt.registerTask('mochaRun', 'mochaTest');
  grunt.registerTask('default', ['jshint', 'mochaRun', 'less', 'watch']);

};
