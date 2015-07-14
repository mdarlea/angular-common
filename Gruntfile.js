module.exports = function (grunt) {
    grunt.initConfig({
        dist: 'dist',
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
        ngdocs: {
            options: {
                dest: '<%= dist %>/docs',
                title: '<%= pkg.name %>',
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
        clean: ['<%= dist %>']
    });

    grunt.loadNpmTasks('grunt-angular-build');
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.registerTask('test', ['clean', 'build', 'ngdocs']);
    grunt.registerTask('default', ['test', 'connect']);
};