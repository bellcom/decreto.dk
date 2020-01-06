jQuery(function ($) {
  'use strict';

  // Flexy header
  flexy_header.init();

  // Sidr
  $('.slinky-menu')
    .find('ul, li, a')
    .removeClass();

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();
});
