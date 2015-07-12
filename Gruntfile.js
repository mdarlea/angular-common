module.exports = function (grunt) {
    
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.initConfig({
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
        clean: ['dist/docs']
    });
    
    grunt.registerTask('default', ['clean', 'ngdocs', 'connect']);
};