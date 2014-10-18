module.exports = function(grunt) {

    var jsFiles = 'app/**/*.js';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.css': 'sass/main.scss'
                },
                options: {
                    style: 'compressed',
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [jsFiles]
                }
            }
        },
        watch: {
            js: {
                files: [jsFiles],
                tasks: ['uglify']
            },
            css: {
                files: ['sass/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify', 'sass']);
};
