(function() {

  // Tiny Slider.
  tns({
    container: '.testimonials .view-content',
    center: true,
    items: 1,
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
      768: {
        items: 2
      }
    }
  });

  // Add the same height to all elements.
  let testimonials = document.querySelectorAll('.testimonials .testimonial');
  let tallest = 0;

  // Loop through to find tallest element.
  [...testimonials].forEach(testimonial => {
    const height = testimonial.offsetHeight;

    if (height > tallest) {
      tallest = height;
    }
  });

  // Apply tallest height to all testimonials.
  [...testimonials].forEach(testimonial => {
    testimonial.style.minHeight = `${tallest}px`;
  });
})();
