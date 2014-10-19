module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        appName: 'app', // main angular module
        appSrc: 'src/**.js',
        buildDir: 'extension/build',
        tmp: '.build-cache',
        appBuild: '<%= buildDir %>/<%= pkg.name  %>',
        templateSrc: 'src/**.html',
        templateBuild: '<%= tmp %>/templates.js',

        copy: {
            bower: {
                expand: true,
                flatten: true,
                src: [
                    'bower_components/angular/angular.min.js'
                ],
                dest: '<%= buildDir %>/',
            }
        },
        sass: {
            dist: {
                files: {
                    '<%= buildDir %>/<%= pkg.name %>.css': 'src/main.scss'
                },
                options: {
                    style: 'compressed',
                }
            }
        },
        ngtemplates: {
            app: {
                src: '<%= templateSrc %>',
                dest: '<%= templateBuild %>',
                options: {
                    module: 'app',
                    htmlmin: {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }
            }
        },
        concat: {
            app: {
                src: [
                    '<%= appSrc %>',
                    '<%= templateBuild %>'
                ],
                dest: '<%= appBuild %>.js'
            },
            options: {
                sourceMap: true,
                stripBanners: true,
            }
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: {
                    '<%= appBuild %>.min.js': ['<%= appBuild %>.js']
                }
            }
        },
        watch: {
            js: {
                files: ['<%= appSrc %>'],
                tasks: ['concat', 'uglify']
            },
            bower: {
                files: ['<%= copy.bower.src  %>'],
                tasks: ['copy:bower']
            },
            css: {
                files: ['src/**.scss'],
                tasks: ['sass']
            },
            html: {
                files: ['<%= templateSrc %>'],
                tasks: ['ngtemplates', 'concat', 'uglify']
            }
        }
    });

    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['ngtemplates', 'copy', 'concat', 'uglify', 'sass']);
};
