var vodo = (function($, self){
  
  function parseItem(placeholder, item) {
    
    // Parse item container
    placeholder.parse({ data : item });

    // Parse item content
    placeholder.find('h2 a, img, p, span, em, .back').parse({ data : item });
    placeholder.find('dd').parse({ data : item, replace: false });

    // 'Action' links require tailored object depending on their [rel] attribute
    var links = placeholder.find('.actions li');
    $.each(item.link, function(k, link){
      links
        .filter('.' + link.rel)
        .children('a')
        .parse({ data : {
          href: link.href,
          title: item.title,
          rights: item.rights,
          duration: item.format.duration,
          size: item.format.size
        }});
      });

    return placeholder;
  }
  
  self.loadFeed = function(o) {
    
    function processFeed(data) {
      $.each(data.value.items, function(key, item){

        // Variables used to loop through items list
        var index = 0,
            itemsCount = item.entry.length;

        // Do not freeze UI while processing list
        var repeat = setInterval(function() {

          // Process and display item
          o.container.append(
            parseItem(
              o.placeholder.clone(),
              item.entry[index]
              )
            );

          // Make sure there are still items to process
          index++;
          if(index >= itemsCount) {
            clearInterval(repeat);
            if (typeof o.callback === 'function') {
              o.callback();
            }
          }
        }, 150);
      });
    };
    
    // MSIE edge case
    // http://stackoverflow.com/questions/5087549/access-denied-to-jquery-script-on-ie
    // http://www.cypressnorth.com/blog/programming/cross-domain-ajax-request-with-json-response-for-iefirefoxchrome-safari-jquery/ 
    if ($.browser.msie && window.XDomainRequest) {
      var xdr = new XDomainRequest();
      xdr.open("get", o.url);
      xdr.onload = function()
      {
        // response need to be parsed
        processFeed($.parseJSON(xdr.responseText));
      };
      xdr.send();
    } else {
      $.getJSON(o.url, processFeed);
    }
  };
  
// Hook into jQuery
$.fn.extend({
  vodoFeed: function(o)
  {
    return this.each(
      function() {
        // get selected element
        var container = jQuery(this);

        // Handle click on info link
        container.on("click", "a.info",
        function(event) {
          $(this).parents('.item').toggleClass('flip');
        });

        // Load feed into given element
        self.loadFeed({
          url: o.url,
          container: container,
          placeholder: o.placeholder,
          callback: o.callback
        });

        // Do not break jQuery chain
        return container;
      }
    );
  }
});

return self;

})(jQuery, vodo || {});

/* Vodo specific template filters */
var tpl = (function(jQuery, self)
{
  // 'Normalize' date
  function dateCleanup(date) {
    // Date input format : YYYY-MM-DD-HH:II:SS xM
    // Cross-browser date format for Date object : MM/DD/YYYY HH:II:SS xM (http://biostall.com/javascript-new-date-returning-nan-in-ie-or-invalid-date-in-safari) 
    date = date.replace(/(\d{4})-(\d{2})-(\d{2})-(.*)/, '$2/$3/$1 $4');
    return new Date(date);
  };

  // Convert date to human readable format
  self.date = function(date) {

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    date = dateCleanup(date);
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  };
  
  return self;
})(jQuery, tpl || {});