module.exports = function (grunt) {

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build', 'examples/components'],

    version: {
      // options: {},
      defaults: {
        src: ['build/<%= pkg.name %>.js','build/<%= pkg.name %>.min.js']
      }
    },

    uglify: {
      my_target: {
         options: {
          mangle: {
            except: ['version']
          }
        },
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
grunt.loadNpmTasks('grunt-version');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.registerTask('default', ['clean', 'coffee', 'uglify:my_target', 'version']);
grunt.registerTask('test', [ 'jshint', 'shell:prepareTests', 'jasmine']);

};