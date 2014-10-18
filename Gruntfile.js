module.exports = function(grunt) {

  var jsFiles = 'app/**/*.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        sourceMap: true,
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': [jsFiles]
        }
      }
    },
    watch: {
      files: [jsFiles],
      tasks: ['uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify']);
};
