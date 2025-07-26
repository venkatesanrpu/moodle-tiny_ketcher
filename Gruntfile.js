module.exports = function(grunt) {
  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          baseUrl: "amd/src",
          mainConfigFile: "amd/src/main.js",
          name: "main",
          out: "amd/build/main.min.js"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('amd', ['requirejs']);
};