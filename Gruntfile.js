module.exports = function (grunt) {
    
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.initConfig({
        ngdocs: {
            options: {
                html5Mode: false,
                sourceLink: 'https://github.com/mdarlea/sw-common/blob/master/{{file}}'
            },
            all: ['src/*.js']
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['docs']
    });
    
    grunt.registerTask('default', ['clean', 'ngdocs', 'connect']);

};