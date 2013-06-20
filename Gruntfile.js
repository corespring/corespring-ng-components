module.exports = function (grunt) {

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    clean: [ 'build'],
    uglify: {
      my_target: {
        files: {
          'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
        }
      }
    },
    coffee: {
     compileJoined: {
      options: {
        join: true
      },
      files: {
        'build/<%= pkg.name %>.js': ['common/src/module.coffee', 'modules/**/src/*.coffee']
      }
    },
  }
};

grunt.initConfig(config);
grunt.loadNpmTasks('grunt-contrib-coffee');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jasmine');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.registerTask('default', ['clean', 'coffee', 'uglify:my_target']);
grunt.registerTask('test', [ 'jshint', 'shell:prepareTests', 'jasmine']);

};