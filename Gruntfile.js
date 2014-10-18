module.exports = function(grunt) {

    var jsFiles = 'src/**/*.js';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.css': 'src/main.scss'
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
                files: ['src/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify', 'sass']);
};
