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
            },
            modules: [],//to be filled in by build task
            pkg: grunt.file.readJSON('package.json'),
            dist: 'dist',
            meta: {
                modules: 'angular.module(\'<%= build.options.moduleName %>\', [<%= srcModules %>]);',
                tplmodules: 'angular.module(\'<%= build.options.moduleName %>.tpls\', [<%= tplModules %>]);',
                all: 'angular.module(\'<%= build.options.moduleName %>\', [\'<%= build.options.moduleName %>.tpls\', <%= srcModules %>]);',
                cssInclude: '',
                cssFileBanner: '/* Include this file in your html if you are using the CSP mode. */\n\n',
                cssFileDest: '<%= build.dist %>/<%= build.options.filename %>-<%= pkg.version %>-csp.css',
                banner: ['/*',
               ' * <%= build.pkg.name %>',
               ' * <%= build.pkg.homepage %>\n',
               ' * Version: <%= build.pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
               ' * License: <%= build.pkg.license %>',
               ' */\n'].join('\n')
            }
        },
        concat: {
            dist: {
                options: {
                    banner: '<%= build.meta.banner %><%= build.meta.modules %>\n',
                    footer: '<%= build.meta.cssInclude %>'
                },
                src: [], //src filled in by build task
                dest: '<%= build.dist %>/<%= build.options.filename %>-<%= build.pkg.version %>.js'
            },
            dist_tpls: {
                options: {
                    banner: '<%= build.meta.banner %><%= build.meta.all %>\n<%= build.meta.tplmodules %>\n',
                    footer: '<%= build.meta.cssInclude %>'
                },
                src: [], //src filled in by build task
                dest: '<%= build.dist %>/<%= build.options.filename %>-tpls-<%= build.pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= build.meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= build.dist %>/<%= build.options.filename %>-<%= build.pkg.version %>.min.js'
            },
            dist_tpls: {
                src: ['<%= concat.dist_tpls.dest %>'],
                dest: '<%= build.dist %>/<%= build.options.filename %>-tpls-<%= build.pkg.version %>.min.js'
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
    
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.loadTasks('tasks');
    

    
    grunt.registerTask('default', ['clean', 'build', 'ngdocs', 'connect']);
};