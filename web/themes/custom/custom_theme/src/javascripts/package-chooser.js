(function() {
  const fakeSubmit = (event) => {
    event.preventDefault();

    var target = event.target;
    var parentForm = target.closest('form');

    parentForm.submit();
  };

  const highlight = (event) => {
    var target = event.target;
    var wrapper = target.closest('.paragraph--type--package-chooser');
    var container = target.closest('.package-selector');
    var selectors = wrapper.querySelectorAll('.package-selector');

    // Remove class from all other containers.
    for (var i = 0; i < selectors.length; i++) {
      var selector = selectors[i];

      selector.classList.remove('highlighted');
    }

    // Add class to container.
    container.classList.toggle('highlighted');
  };

  // Add eventListeners.
  var buttons = document.querySelectorAll('.paragraph--type--package-chooser .field--name-field-link a');
  var radios = document.querySelectorAll('.paragraph--type--package-chooser input[name="package"]');

  // Buttons.
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];

    button.addEventListener('click', fakeSubmit);
  }

  // Radios.
  for (var i = 0; i < radios.length; i++) {
    var radio = radios[i];

    radio.addEventListener('change', highlight);
  }
})();
