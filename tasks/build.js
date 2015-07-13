'use strict';

var markdown = require('node-markdown').Markdown;

module.exports = function (grunt) {
    grunt.registerTask('makeModuleMappingFile', function () {
        var _ = grunt.util._;
        var moduleMappingJs = 'dist/assets/module-mapping.json';
        var moduleMappings = grunt.config('moduleFileMapping');
        var moduleMappingsMap = _.object(_.pluck(moduleMappings, 'name'), moduleMappings);
        var jsContent = JSON.stringify(moduleMappingsMap);
        grunt.file.write(moduleMappingJs, jsContent);
        grunt.log.writeln('File ' + moduleMappingJs.cyan + ' created.');
    });

    var _options = {};
    var _foundModules = {};

    grunt.registerTask('build', 'Create build files', function () {
        var _ = grunt.util._;

        // Merge task-specific options with these defaults
        _options = this.options({
            filename: '',
            prefix: 'sw',
            modulePrefix: 'sw',
            moduleName: ''
        });

        configTask("modules", []);
        configTask("pkg", grunt.file.readJSON('package.json'));
        configTask("dist", 'dist');
        configTask("meta", {
            modules: 'angular.module(\'<%= build.options.moduleName %>\', [<%= srcModules %>]);',
            tplmodules: 'angular.module(\'<%= build.options.moduleName %>.tpls\', [<%= tplModules %>]);',
            all: 'angular.module(\'<%= build.options.moduleName %>\', [\'<%= build.options.moduleName %>.tpls\', <%= srcModules %>]);',
            cssInclude: '',
            cssFileBanner: '/* Include this file in your html if you are using the CSP mode. */\n\n',
            cssFileDest: '<%= dist %>/<%= build.options.filename %>-<%= pkg.version %>-csp.css',
            banner: [
                '/*',
                ' * <%= pkg.name %>',
                ' * <%= pkg.homepage %>\n',
                ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * License: <%= pkg.license %>',
                ' */\n'
            ].join('\n')
        },true);

        //If arguments define what modules to build, build those. Else, everything
        if (this.args.length) {
            this.args.forEach(findModule);
        } else {
            grunt.file.expand({ filter: 'isDirectory', cwd: '.' }, 'src/*')
            .forEach(function (dir) {
                grunt.log.writeln('Package files in folder: ' + dir);
                findModule(dir.split('/')[1]);
            });
        }
        
        var modules = grunt.config('modules');
        grunt.config('srcModules', _.pluck(modules, 'moduleName'));
        grunt.config('tplModules', _.pluck(modules, 'tplModules').filter(function (tpls) { return tpls.length > 0; }));
        grunt.config('demoModules', modules.filter(function (module) {
            return module.docs.md && module.docs.js && module.docs.html;
        }).sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        }));
        
        var cssStrings = _.flatten(_.compact(_.pluck(modules, 'css')));
        var cssJsStrings = _.flatten(_.compact(_.pluck(modules, 'cssJs')));
        if (cssStrings.length) {
            grunt.config('meta.cssInclude', cssJsStrings.join('\n'));
            
            grunt.file.write(grunt.config('meta.cssFileDest'), grunt.config('meta.cssFileBanner') +
                       cssStrings.join('\n'));
            
            grunt.log.writeln('File ' + grunt.config('meta.cssFileDest') + ' created');
        }
        
        var moduleFileMapping = _.clone(modules, true);
        moduleFileMapping.forEach(function (module) {
            delete module.docs;
        });
        
        grunt.config('moduleFileMapping', moduleFileMapping);
        
        var srcFiles = _.pluck(modules, 'srcFiles');
        var tpljsFiles = _.pluck(modules, 'tpljsFiles');
        //Set the concat task to concatenate the given src modules
        grunt.config('concat.dist.src', grunt.config('concat.dist.src')
                 .concat(srcFiles));
        //Set the concat-with-templates task to concat the given src & tpl modules
        grunt.config('concat.dist_tpls.src', grunt.config('concat.dist_tpls.src')
                 .concat(srcFiles).concat(tpljsFiles));
        
        grunt.task.run(['concat', 'uglify', 'makeModuleMappingFile']);
    });
    
    function configTask(name, value, merge) {
        if (!grunt.config.data || !grunt.config.data[name]) {
            grunt.config.set(name, value);
        } else {
            if (merge) {
                var newValue = {};
                newValue[name] = value;
                grunt.config.merge(newValue);
            }
        }
    }

    function findModule(name) {
        var modName = toAttribute(name);
        
        if (_foundModules[modName]) { return; }
        _foundModules[modName] = true;

        function breakup(text, separator) {
            return text.replace(/[A-Z]/g, function (match) {
                return separator + match;
            });
        }
        function enquote(str) {
            return '\'' + str + '\'';
        }

        var prefix = _options.prefix;
        var path = '';
        if (prefix) {
            path = (name.substring(0, prefix.length + 1).toLowerCase() === prefix.toLowerCase() + '-')
                ? name
                : name.substring(0, prefix.length).toLowerCase() + "-" + lcwords(name.substring(prefix.length))
        } else {
            var modulePrefix = _options.modulePrefix;
            path = (name.substring(0, modulePrefix.length).toLowerCase() === modulePrefix.toLowerCase())
                ? name.substring(modulePrefix.length)
                : name;
        }
        
        var deps = dependenciesForModule(path);
        
        var src = [
            'src/' + path + '/*.js',
            '!src/' + path + '/*.docs.js'
        ];
        
        var module = {
            name: modName,
            moduleName: enquote(modName),
            displayName: modName,
            srcFiles: grunt.file.expand({ filter: 'isFile' }, src),
            cssFiles: grunt.file.expand('src/' + path + '/*.css'),
            tplFiles: grunt.file.expand('template/' + path + '/*.html'),
            tpljsFiles: grunt.file.expand('template/' + path + '/*.html.js'),
            tplModules: grunt.file.expand('template/' + path + '/*.html').map(enquote),
            dependencies: deps,
            docs: {
                md: grunt.file.expand('src/' + path + '/docs/*.md').map(grunt.file.read).map(markdown).join('\n'),
                js: grunt.file.expand('src/' + path + '/docs/*.js').map(grunt.file.read).join('\n'),
                html: grunt.file.expand('src/' + path + '/docs/*.html').map(grunt.file.read).join('\n')
            }
        };
        
        var styles = {
            css: [],
            js: []
        };
        module.cssFiles.forEach(processCSS.bind(null, styles, true));
        if (styles.css.length) {
            module.css = styles.css.join('\n');
            module.cssJs = styles.js.join('\n');
        }
        
        module.dependencies.forEach(findModule);
        grunt.config('modules', grunt.config('modules').concat(module));
    }
    
    function dependenciesForModule(name) {
        var deps = [];
        
        var src = [
            'src/' + name + '/*.js',
            '!src/' + name + '/*.docs.js'
        ];
        
        grunt.file.expand({ filter: 'isFile' }, src).map(grunt.file.read).forEach(function (contents) {
            //Strategy: find where module is declared,
            //and from there get everything inside the [] and split them by comma
            
            var moduleDecl = 'angular.module(';
            var moduleDeclIndex = contents.indexOf(moduleDecl);
            var hasModule = contents.substring(moduleDeclIndex + moduleDecl.length).indexOf(moduleDecl);
            
            if (hasModule) {
                var moduleCode = contents.substring(moduleDeclIndex, hasModule - moduleDeclIndex);
                
                var depArrayStart = moduleCode.indexOf('[');
                var depArrayEnd = moduleCode.indexOf(']', depArrayStart);
                var dependencies = moduleCode.substring(depArrayStart + 1, depArrayEnd);

                var modulePrefix = _options.modulePrefix;

                dependencies.split(',').forEach(function (dep) {
                    var depName = dep.trim().replace(/['"]/g, '');
                    if (depName.substring(0, modulePrefix.length).toLowerCase() === modulePrefix.toLowerCase()) {
                        if (deps.indexOf(depName) < 0) {
                            deps.push(depName);
                            //Get dependencies for this new dependency
                            deps = deps.concat(dependenciesForModule(depName));
                        }
                    }
                });
            }
        });
        return deps;
    }
    
    function toAttribute(str) {
        var sep = str.indexOf('-');
        return (sep > -1) ? (str.substring(0, sep) + ucwords(str.substring(sep + 1))) : str;
    }
    
    function ucwords(text) {
        return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    }
    
    function lcwords(text) {
        return text.replace(/^([A-Z])|\s+([A-Z])/g, function ($1) {
            return $1.toLowerCase();
        });
    }
    
    /**
   * Logic from AngularJS
   * https://github.com/angular/angular.js/blob/36831eccd1da37c089f2141a2c073a6db69f3e1d/lib/grunt/utils.js#L121-L145
   */
  function processCSS(state, minify, file) {
        /* jshint quotmark: false */
        var css = fs.readFileSync(file).toString(),
            js;
        state.css.push(css);
        
        if (minify) {
            css = css
        .replace(/\r?\n/g, '')
        .replace(/\/\*.*?\*\//g, '')
        .replace(/:\s+/g, ':')
        .replace(/\s*\{\s*/g, '{')
        .replace(/\s*\}\s*/g, '}')
        .replace(/\s*\,\s*/g, ',')
        .replace(/\s*\;\s*/g, ';');
        }
        //escape for js
        css = css
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, '\\n');
        js = "!angular.$$csp() && angular.element(document).find('head').prepend('<style type=\"text/css\">" + css + "</style>');";
        state.js.push(js);
        
        return state;
    }
};