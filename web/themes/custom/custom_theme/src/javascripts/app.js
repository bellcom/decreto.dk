jQuery(function ($) {
  'use strict';

  // Flexy header
  flexy_header.init();

  // Sidr
  $('.slinky-menu')
    .find('ul, li, a')
    .removeClass();

  $('.sidr-toggle--right').sidr({
    name: 'sidr-main',
    side: 'right',
    renaming: false,
    body: '.layout__wrapper',
    source: '.sidr-source-provider'
  });

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();

  // Explainers.
  tns({
    container: '.explainers .view-content',
    center: true,
    items: 1,
    autoplay: true,
    autoplayHoverPause: true
  });
});
