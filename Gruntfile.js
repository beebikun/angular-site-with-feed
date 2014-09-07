module.exports = function(grunt) {
    var src = ['js/services.js', 'js/app.js', 'js/directives.js', 'js/controllers.js'];
  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                report: 'min',
                mangle: false
            },
            build:{
                src: src,
                dest: 'build/<%= pkg.name %>.min.js'
            },
        },
        concat: {
            options: {
                separator: ";",
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build:{
                src: src,
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
