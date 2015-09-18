(function (global) {

  var script = getScript(),
    baseUrl = script.getAttribute('gk-baseUrl') || getScriptFolder(script),
    gkPkg = script.getAttribute('gk-pkg') || 'com',
    gkTags = script.getAttribute('gk-tags'),
    gkPath = 'lib/gk/jquery.gk-0.5',
    context = 'gk',
    config = {},
    defined;

  function each(ary, func) {
    if (ary) {
      for (var i = 0, len = ary.length; i < len; i++) {
        if (ary[i] && func(ary[i], i, ary)) {
          break;
        }
      }
    }
  }

  function getScript() {
    var scriptTags = document.getElementsByTagName('script');
    return scriptTags[scriptTags.length - 1];
  }

  function getScriptFolder(script) {
    return script.src.split('?')[0].split('/').slice(0, -1).join('/');
  }

  function checkUndefined(tags) {
    var undef = false;
    each(tags, function (tag) {
      if (!defined[tag]) {
        undef = true;
        return true;
      }
    });
    return undef;
  }

  function setUpRequire() {
    baseUrl && (config.baseUrl = baseUrl);
    context && (config.context = context);
    requirejs.config(config);
    defined = requirejs.s.contexts[context || '_'].defined;
  }

  function setPaths(tags) {
    var prefix = gkPkg ? gkPkg.replace(/\./g, '/') + '/' : '';
    config.paths = config.paths || {};
    config.paths.gk = gkPath;
    config.shim = config.shim || {};
    each(tags, function (tag) {
      prefix && (config.paths[tag] = prefix + tag);
      config.shim[tag] = {
        deps: ['gk']
      };
    });
  }

  global.registryGK = function (tags, callback) {
    each(tags, function (tag, idx) {
      tags[idx] = tag.toLowerCase();
    });
    setPaths(tags);
    if (checkUndefined(tags)) {
      requirejs.config(config)(tags, function () {
        var modules = arguments;
        each(tags, function (val, idx) {
          modules[idx] && $.gk.registry(val, modules[idx]);
        });
        if (typeof callback === 'function') {
          callback(modules);
        }
      });
    } else {
      var modules = [],
        m;
      each(tags, function (tag) {
        m = defined[tag];
        m && $.gk.registry(tag, m);
        modules.push(m);
      });
      if (typeof callback === 'function') {
        callback(modules);
      }
    }
  };

  setUpRequire();
  if (gkTags) {
    var tags = gkTags.split(/[\s,]+/);
    registryGK(tags, function () {
      $.gk.init();
    });
  }

}(this));