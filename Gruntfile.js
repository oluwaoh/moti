module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        appName: 'app', // main angular module
        appSrc: 'src/**.js',
        appDist: 'extension/build',
        tmp: '.build-cache',
        appBuild: '<%= tmp %>/<%= appName %>',
        templateSrc: 'src/**.html',
        templateBuild: '<%= tmp %>/templates.js',

        sass: {
            dist: {
                files: {
                    '<%= appDist %>/<%= pkg.name %>.css': 'src/main.scss'
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
                dest: '<%= appBuild %>.js',
            },
            build: {
                files: {
                    '<%= appDist %>/<%= pkg.name %>.min.js': [
                        'bower_components/angular/angular.min.js',
                        '<%= appBuild %>.min.js',
                    ]
                }
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

    grunt.registerTask('default', ['ngtemplates', 'concat:app', 'uglify', 'concat:build', 'sass']);
};
