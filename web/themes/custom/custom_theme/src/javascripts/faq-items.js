const handleToggle = (event) => {
  var target = event.target;
  var parentNode = target.closest('.faq-item');

  parentNode.classList.toggle('open');
};

// Add eventListeners.
var toggles = document.querySelectorAll('.js-faq-item-toggle');

for (var i = 0; i < toggles.length; i++) {
  var item = toggles[i];

  item.addEventListener('click', handleToggle);
}
