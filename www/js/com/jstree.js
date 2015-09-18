requirejs.config({
	context: 'gk',
	paths: {
		'jquery': 'lib/jquery/jquery-1.10.1',
		'jquery_jstree': 'lib/jstree/jquery.jstree'
	},
	shim: {
		'jquery_jstree': {
			deps: ['jquery']
		}
	}
});

// define module (component)
define('jstree', ['jquery_jstree'], function() {
	return {
    template: "<div id='{{id}}'><content></content></div>",
		script: function() {
			var $oriEle = this.$originEle,
					$ele = this.$ele,
					_tempXmlDoc;

			// make the html data rules
			// todo: should be made exact rule
			var isHtmlData = function(c) {
				return $(c).find('li').has('a').length !== 0;
			};

			var createNode = function(doc, parentId, nodeName, nodeId) {
				var item = document.createElement("item"),
						content = document.createElement("content"),
						nameNode = document.createElement("name");

				nameNode.textContent = nodeName;
				content.appendChild(nameNode);
				item.appendChild(content);
				if (typeof nodeId !== 'undefined') {
					item.setAttribute('id', nodeId);
				}
				if (typeof parentId !== 'undefined') {
					item.setAttribute('parent_id', parentId);
				}
				doc.documentElement.appendChild(item);
				return doc;
			};

			// deepTracing is boolean, true means deep tracing, not first level node.
			var _xmlAdapter = function(content, deepTracing, parentId) {
				if (!deepTracing) {
					_tempXmlDoc = $.parseXML("<root/>");
				}
				$(content).each(function() {
					_tempXmlDoc = createNode(_tempXmlDoc, parentId, $(this).context.tagName, $(this).context.id);

					if ($(this).context.innerHTML.trim() !== '') {
						_xmlAdapter($(this).context.innerHTML, true, $(this).context.id);
					}
				});
			};

			this.init = function() {
				var classic_theme = {
					'theme' : 'classic',
					'dots' : true,
					'icons' : true
				};

				var theme = $.extend(classic_theme, {
					'theme' : $oriEle.attr('theme'),
					'dots' : $oriEle.attr('dots') === 'false' ? false : true,
					'icons' : $oriEle.attr('icons') === 'false' ? false : true
				});

				var content = $.trim($oriEle.html());

				var plugins = ['themes', 'search'];

				if ($oriEle.attr('checkbox') === 'true') {
					plugins.push('checkbox');
				}

				if ($oriEle.attr('dnd') === 'true') {
					plugins.push('dnd');
				}

				if ($oriEle.attr('crrm') === 'true') {
					plugins.push('crrm');
					if ($.inArray('ui', plugins) === -1) {
						plugins.push('ui');
					}
				}
        
				try {
					var jsonData = JSON.parse(content);
					// json data zone if parse success
          // organize the json_data config
          var jsonConfig = {};
          
          if ($oriEle.attr('lazy') === 'true') {
            var ajax = {};
            
            ajax.url = $oriEle.attr('ajax-url');
            ajax.data = function(node) {
              return {
                id: node.attr ? node.attr("id") : 0
              };
            }
            ajax.success = function(resData) {
              // assume that response data is json string
              return resData.i.trim() !== '' ? JSON.parse(resData.i) : '';
            }
            
            jsonConfig.ajax = ajax;
          } else {
            jsonConfig.data = jsonData;
          }
          
					plugins.push('json_data');
					$ele.jstree({
            "json_data" : jsonConfig,
						"plugins" : plugins,
						"themes" : theme
					});
				} catch(error) {
					if (isHtmlData(content)) {
						// html data zone
						plugins.push('html_data');
						$ele.jstree({
							"core" : {
								"initially_open" : ['root']
							},
							"plugins" : plugins,
							"themes" : theme
						});
					} else {
						// assume it's xml if parse error
						// xml data zone
						// transfer xml to _tempXmlDoc variable
						// todo: maybe has better way ...
						_xmlAdapter(content, false);
						var xmlData = (new XMLSerializer()).serializeToString(_tempXmlDoc),
							xmlStr = xmlData.split(' xmlns="http://www.w3.org/1999/xhtml"').join('');

						plugins.push('xml_data');
						$ele.jstree({
							"xml_data" : {
								"data" : xmlStr
							},
							"plugins" : plugins,
							"themes" : theme
						});
					}
				}

			};
		}
	};
});