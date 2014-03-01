// Common script to all template:
// initiate affix on top of the page, and remove CAS ticket

var $win = $(window), $nav, navTop, isFixed=0;

var processScroll = function() {
  var i, scrollTop = $win.scrollTop();
  if (scrollTop >= navTop && !isFixed) {
    isFixed = 1;
    $nav.addClass('subnav-fixed');
  } else if (scrollTop <= navTop && isFixed) {
    isFixed = 0;
    $nav.removeClass('subnav-fixed');
  }
};

// do not keep CAS ticket in url to allow browser refresh
if (window.location.search.match(/\?ticket=/)) {
  window.location.search = ''
}

$win.on('load', function() {
  $nav = $('.subnav');
  if ($nav.length === 0) {
    return;
  }
  $win.on('scroll', processScroll);
  navTop = $nav.offset().top;
});