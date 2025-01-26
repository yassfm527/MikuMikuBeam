module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Build from source.
    shell: {
      clean: {
        command: "rimraf dist",
      },

      buildClient: {
        command: "vite build",
      },
      buildServer: {
        command:
          "tsc --project tsconfig.server.json && tsc-alias -p tsconfig.server.json",
      },
    },

    // Copy worker files (Backend attack methods)
    copy: {
      static: {
        expand: true,
        cwd: "server/workers/",
        src: "*",
        dest: "dist/workers/",
      },
    },

    // Run concurrent tasks
    concurrent: {
      build: ["shell:buildClient", "shell:buildServer"],
    },
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-concurrent");

  // Run our tasks
  grunt.registerTask("build", [
    "shell:clean",
    "concurrent:build",
    "copy:static",
  ]);

  grunt.registerTask("build_server", ["shell:buildServer"]);
  grunt.registerTask("build_client", ["shell:buildClient"]);
};
