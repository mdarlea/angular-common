module.exports = function (grunt) {
    grunt.initConfig({
        debug: {
            options: {
                open: false // do not open node-inspector in Chrome automatically 
            }
        },
        build: {
            options: {
                filename: 'sw-common',
                prefix: 'sw',
                modulePrefix: 'sw',
                moduleName: 'sw.common'
            }
        },
        concat: {
            dist: {
                options: {
                    banner: '<%= meta.banner %><%= meta.modules %>\n',
                    footer: '<%= meta.cssInclude %>'
                },
                src: [], //src filled in by build task
                dest: '<%= dist %>/<%= build.options.filename %>-<%= pkg.version %>.js'
            },
            dist_tpls: {
                options: {
                    banner: '<%= meta.banner %><%= meta.all %>\n<%= meta.tplmodules %>\n',
                    footer: '<%= meta.cssInclude %>'
                },
                src: [], //src filled in by build task
                dest: '<%= dist %>/<%= build.options.filename %>-tpls-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dist %>/<%= build.options.filename %>-<%= pkg.version %>.min.js'
            },
            dist_tpls: {
                src: ['<%= concat.dist_tpls.dest %>'],
                dest: '<%= dist %>/<%= build.options.filename %>-tpls-<%= pkg.version %>.min.js'
            }
        },
        ngdocs: {
            options: {
                dest: 'dist/docs',
                title: 'sw-common',
                html5Mode: false,
                sourceLink: 'https://github.com/mdarlea/angular-common/blob/master/{{file}}'
            },
            api: {
                src: ['src/**/*.js', '!src/**/*.spec.js'],
                title: 'API Documentation'
            }
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['dist']
    });
    
    grunt.loadTasks('tasks');
    
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('default', ['clean', 'build', 'ngdocs', 'connect']);
};