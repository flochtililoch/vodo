$(function() {
  var callback = null,
      feedContainer = $('.items'),
      loading = $('.loading');

  // If url contains reference to an item, show overlay while loading items, then scroll to required item when loading is complete
  if (window.location.hash)
  {
    loading.show();
    callback = function() {
      $((($.browser.chrome) || ($.browser.safari)) ? document.body: document.documentElement)
      .animate({
        scrollTop: $(window.location.hash).offset().top
      },
      1000);
      loading.hide();
    }
  }

  // Retrieve item placeholder, then process feed
  $.get('tpl/item.html.tpl',
  function(placeholder) {
    feedContainer.vodoFeed({
      url: 'http://pipes.yahoo.com/pipes/pipe.run?_id=f42c711ab0e64056fd200b38ad98e102&_render=json&callback=myfunction',
      callback: callback,
      placeholder: $(placeholder)
    });
  });

});
