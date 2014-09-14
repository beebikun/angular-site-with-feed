module.exports = function(grunt) {
  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                report: 'min',
                mangle: false
            },
            dist: {
                files: {
                  'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
              }
        },
        concat: {
            options: {
                separator: ";",
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist:{
                src: ['js/*.js'],
                dest: 'build/<%= pkg.name %>.js'
            }
        }
      });

  // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
   // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Task definitions
    grunt.registerTask('default', ['concat', 'uglify']);
};
