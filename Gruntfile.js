module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var config = {
        // configurable paths
        src: 'public/src',
        dev: 'public/dev',
        dist: 'public/dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            //console.log(event.colour);
                        });
                        // opens browser on initial server start
                        nodemon.on('config:update', function() {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://127.0.0.1:3000');
                            }, 1000);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function() {

                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },

        'node-inspector': {
            dev: {
                options: {
                    'web-port': 3000,
                    'web-host': '127.0.0.1',
                    'debug-port': 5857,
                    'save-live-edit': false,
                    'no-preload': true,
                    'stack-trace-limit': 4,
                    'hidden': ['node_modules']
                }
            }
        },

        sass: {
            options: {
                style: 'expanded'
            },
            dev: {

                files: [{
                    expand: true,
                    cwd: config.src + '/sass',
                    src: ['app.scss'],
                    dest: config.dev + '/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: config.dev + '/css',
                    src: ['app.css'],
                    dest: config.dist + '/css',
                    ext: '.min.css'
                }]
            }
        },

        copy: {
            dev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: config.src,
                    dest: config.dev,
                    src: [
                        './js/**/*',
                        '!./js/lib/**',
                        './fonts/**/*'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: config.src,
                    dest: config.dist,
                    src: ['./js/libs.js']
                }]
                    
            }
        },



        jshint: {
            dev: {
                options: {
                    reporter: require('jshint-stylish')
                },
                files: [{
                    src: [config.src + "/js/**/*.js", "app/**/*.js", "routes/**/*.js"]
                }]
            }
        },

        handlebars: {
            dev: {
                options: {
                    namespace: "JST",
                    processName: function(filePath) {
                        return filePath.replace(/^templates\//, '').replace(/\.hbs$/, '');
                    },
                    wrapped: true
                },
                files: {
                    "public/src/js/templates.js": ["public/src/templates/**/*.hbs"]
                }
            }
        },

        uglify: {
            dist: {

                options: {
                    banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',

                    compress: {
                        drop_console: false
                    }
                },

                files: {
                    'public/dist/js/app.min.js': ['public/dev/js/**/*.js', '!public/dev/js/libs.js']
                }

            }

        },

        clean: {
            dev: {
                files: [{
                    dot: true,
                    src: config.dev + '/**/*',
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: config.dist + '/**/*',
                }]
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['public/src/js/lib/jquery.min.js', 
                    'public/src/js/lib/modernizr-latest.min.js', 
                    'public/src/js/lib/bootstrap.min.js',
                    'public/src/js/lib/handlebars.runtime.min.js',
                    'public/src/js/lib/autosize.min.js', 
                    'public/src/js/lib/hashtags.min.js'],
                dest: 'public/src/js/libs.js',
            },
        },



        watch: {
            options: {
                // these two options significantly decrease execution time
                spawn: false,
                interrupt: true
            },
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: [config.src + '/sass/**/*'],
                tasks: ['clean:dev', 'sass']
            },

            assets: {
                files: [config.src + '/**/*'],
                tasks: ['clean:dev', 'sass:dev', 'copy']
            },

            handlebars: {
                files: [config.src + "/js/templates.js", config.src + "/templates/**/*.hbs"],
                tasks: ['handlebars', 'copy']
            },
        },


        //new
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });






    grunt.registerTask('default', ['concurrent']);
    //minify everything except for libs move libs.js to dist
    grunt.registerTask('dist', ['uglify', 'cssmin', 'copy:dist']);

};
