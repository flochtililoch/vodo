/**
 * TEMPLATING ENGINE
 */
var tpl = (function(jQuery, self)
{
  var debug = false;
  
  /**
	 * Interpolate variables with given data
	 */
  function evaluate_params(p, d)
	{
		var r = [];
		jQuery.each(p,
			function(k, v)
			{
				data = d;
				jQuery.each(v.substring(2, v.length - 1).split('.'),
					function(k2, v2)
					{
					  var a = v2.split('|');
						data = data[a[0]] || 'undefined';

						// apply filter if defined
						data = a[1] !== undefined ? self[a[1]](data) : data;
					});
				r.push(data);
			});
		return r;
	};
	
	/**
	 *	If variable doesnt exists, remove linked tags
	 *	having 'lnk' attribute defined to container_id{attribute_name_to_interpolate}
	 *	ie: <em/> tag will be removed if ${foo} doesnt exists
	 *	<em lnk="product_image{src}">Product legend</em>
	 *	<img attr="src" _src="${foo}" rel="product_image" />
	 */
	function remove_linked_tags(rel, attr, removeTag)
	{
		e = jQuery('[lnk="' + rel + '{' + attr + '}"]');
		if(removeTag === true)
		{
			e.remove();
		}
		else
		{
			e.removeAttr('lnk');
		}
	};
	
	/**
	 * Extract variables from given attributes
	 */
	function parse_params(p, d)
	{
		if(debug === true){ console.log('	before parsing : ' + p); }
		
		var reg = /\${([^}]+)}/g;
		v = p.match(reg);
		if(v !== null)
		{
			// evalute variables
			var r = evaluate_params(v, d);
			for (var i=0; i< v.length; i++)
			{
				if(r[i] === 'undefined')
				{
					return 'undefined';
				}
				
				// and put their content back in their placeholder
				p = p.replace(v[i], r[i]);
			}
		}
		
		if(debug === true){ console.log('	after parsing : ' + p); }
		
		return p;
	};
	
	$.fn.extend(
	{
		parse : function(options)
		{
			var defaults =
			{
				data : null,
				attr : { attr : 'attr', html : 'html'},
				replace : true
			};
			
			// merge default options & user options
			var o =  $.extend(defaults, options);
			
			/**
    	 * Parse and interpolate tag attributes
    	 */
    	var attributes = function(e)
    	{
    		if(e.attr(o.attr.attr) !== undefined)
    		{
    			if(debug === true){ console.log('Parsing attributes'); }

    			// Get all attributes to process
    			var a = e.attr(o.attr.attr).split(' ');
    			jQuery.each(a,
    				function(k, v)
    				{
    					// Variable interpolation
    					var r = parse_params(e.attr('_' + v), o.data)

    					if(r !== 'undefined')
    					{
    						e.attr(v, r);
    					}
    					else
    					{
    						remove_linked_tags(e.attr('rel'), v, o.replace);
    					}
    					e.removeAttr('_' + v);
    					remove_linked_tags(e.attr('rel'), v, o.replace);
    				});

    			// Remove working attribute
    			e.removeAttr(o.attr.attr);
    		}
    	};

    	/**
    	 * Parse and interpolate tag content
    	 */
    	var content = function(e)
    	{
    		if(e.attr(o.attr.html) !== undefined)
    		{
    			if(debug === true){ console.log('Parsing content :'); }

    			var r = parse_params(e.attr(o.attr.html), o.data);
    			if(r !== 'undefined')
    			{
    				e.html(r);
    				e.removeAttr(o.attr.html);
    			}
    			else
    			{
    				remove_linked_tags(e.attr('rel'), 'html', o.replace);
    				if(o.replace)
    				{
    				  e.remove();
    				}
    			}
    			remove_linked_tags(e.attr('rel'), 'html', o.replace);
    		}
    	};
			
			// Process all matching tags
			return this.filter('[attr], [html]').each(
				function()
				{
					// get selected element
					var e = jQuery(this);
					
					attributes(e);
					content(e);
				}
			);
		}
	});
	
	return self;
})(jQuery, tpl || {});

/**
 *  TEMPLATE FILTERS
 */
var tpl = (function(jQuery, self)
{
  // Remove html tags from string
  // http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
  self.striptags = function(html)
  {
     var tmp = document.createElement("DIV");
     tmp.innerHTML = html;
     return tmp.textContent || tmp.innerText;
  }
  
  // Convert bytes to human readable format
  // http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-(javascript)
  self.bytesToSize = function(bytes) {
    if(bytes === "undefined" || parseInt(bytes, 10) === 0) {
      return "undefined";
    }
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };
  
  // Convert seconds to human readble format
  self.secondsToMinutes = function(sec) {
  	return sec === "undefined" || parseInt(sec, 10) === 0 ? "undefined" : Math.ceil(sec / 60) + ' min';
  }
  
  return self;
})(jQuery, tpl || {});