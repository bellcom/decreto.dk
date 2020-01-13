'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.4.1';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    selector = selector === '#' ? [] : selector;
    var $parent = $(document).find(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.4.1';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d).prop(d, true);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d).prop(d, false);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target).closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
      // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
      e.preventDefault();
      // The target component still receive the focus
      if ($btn.is('input,button')) $btn.trigger('focus');else $btn.find('input:visible,button:visible').first().trigger('focus');
    }
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.4.1';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      if ((typeof $next === 'undefined' ? 'undefined' : _typeof($next)) === 'object' && $next.length) {
        $next[0].offsetWidth; // force reflow
      }
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var $this = $(this);
    var href = $this.attr('href');
    if (href) {
      href = href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
    }

    var target = $this.attr('data-target') || href;
    var $target = $(document).find(target);

    if (!$target.hasClass('carousel')) return;

    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.4.1';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(document).find(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.4.1';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null;

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom';

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.4.1';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    var scrollbarWidth = this.scrollbarWidth;
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + scrollbarWidth);
      $(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight;
        var calculatedPadding = $(element).css('padding-right');
        $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px');
      });
    }
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
    $(this.fixedContent).each(function (index, element) {
      var padding = $(element).data('padding-right');
      $(element).removeData('padding-right');
      element.style.paddingRight = padding ? padding : '';
    });
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var target = $this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    var $target = $(document).find(target);
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];

  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []

    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
  };var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if ($.inArray(attrName, allowedAttributeList) !== -1) {
      if ($.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = $(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp;
    });

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    // IE 8 and below don't support createHTMLDocument
    if (!document.implementation || !document.implementation.createHTMLDocument) {
      return unsafeHtml;
    }

    var createdDocument = document.implementation.createHTMLDocument('sanitization');
    createdDocument.body.innerHTML = unsafeHtml;

    var whitelistKeys = $.map(whiteList, function (el, i) {
      return i;
    });
    var elements = $(createdDocument.body).find('*');

    for (var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if ($.inArray(elName, whitelistKeys) === -1) {
        el.parentNode.removeChild(el);

        continue;
      }

      var attributeList = $.map(el.attributes, function (el) {
        return el;
      });
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);

      for (var j = 0, len2 = attributeList.length; j < len2; j++) {
        if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
          el.removeAttribute(attributeList[j].nodeName);
        }
      }
    }

    return createdDocument.body.innerHTML;
  }

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.4.1';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    },
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    var dataAttributes = this.$element.data();

    for (var dataAttr in dataAttributes) {
      if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
        delete dataAttributes[dataAttr];
      }
    }

    options = $.extend({}, this.getDefaults(), dataAttributes, options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    if (options.sanitize) {
      options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    if (this.options.html) {
      if (this.options.sanitize) {
        title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
      }

      $tip.find('.tooltip-inner').html(title);
    } else {
      $tip.find('.tooltip-inner').text(title);
    }

    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) {
        // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      }
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null;
    });
  };

  Tooltip.prototype.sanitizeHtml = function (unsafeHtml) {
    return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.4.1';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    if (this.options.html) {
      var typeContent = typeof content === 'undefined' ? 'undefined' : _typeof(content);

      if (this.options.sanitize) {
        title = this.sanitizeHtml(title);

        if (typeContent === 'string') {
          content = this.sanitizeHtml(content);
        }
      }

      $tip.find('.popover-title').html(title);
      $tip.find('.popover-content').children().detach().end()[typeContent === 'string' ? 'html' : 'append'](content);
    } else {
      $tip.find('.popover-title').text(title);
      $tip.find('.popover-content').children().detach().end().text(content);
    }

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.4.1';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.4.1';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(document).find(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);

    this.$target = target.on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.4.1';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
'use strict';

// |--------------------------------------------------------------------------
// | Flexy header
// |--------------------------------------------------------------------------
// |
// | This jQuery script is written by
// |
// | Morten Nissen
// | hjemmesidekongen.dk
// |

var flexy_header = function ($) {
    'use strict';

    var pub = {},
        $header_static = $('.flexy-header--static'),
        $header_sticky = $('.flexy-header--sticky'),
        options = {
        update_interval: 100,
        tolerance: {
            upward: 20,
            downward: 10
        },
        offset: _get_offset_from_elements_bottom($header_static),
        classes: {
            pinned: "flexy-header--pinned",
            unpinned: "flexy-header--unpinned"
        }
    },
        was_scrolled = false,
        last_distance_from_top = 0;

    /**
     * Instantiate
     */
    pub.init = function (options) {
        registerEventHandlers();
        registerBootEventHandlers();
    };

    /**
     * Register boot event handlers
     */
    function registerBootEventHandlers() {
        $header_sticky.addClass(options.classes.unpinned);

        setInterval(function () {

            if (was_scrolled) {
                document_was_scrolled();

                was_scrolled = false;
            }
        }, options.update_interval);
    }

    /**
     * Register event handlers
     */
    function registerEventHandlers() {
        $(window).scroll(function (event) {
            was_scrolled = true;
        });
    }

    /**
     * Get offset from element bottom
     */
    function _get_offset_from_elements_bottom($element) {
        var element_height = $element.outerHeight(true),
            element_offset = $element.offset().top;

        return element_height + element_offset;
    }

    /**
     * Document was scrolled
     */
    function document_was_scrolled() {
        var current_distance_from_top = $(window).scrollTop();

        // If past offset
        if (current_distance_from_top >= options.offset) {

            // Downwards scroll
            if (current_distance_from_top > last_distance_from_top) {

                // Obey the downward tolerance
                if (Math.abs(current_distance_from_top - last_distance_from_top) <= options.tolerance.downward) {
                    return;
                }

                $header_sticky.removeClass(options.classes.pinned).addClass(options.classes.unpinned);
            }

            // Upwards scroll
            else {

                    // Obey the upward tolerance
                    if (Math.abs(current_distance_from_top - last_distance_from_top) <= options.tolerance.upward) {
                        return;
                    }

                    // We are not scrolled past the document which is possible on the Mac
                    if (current_distance_from_top + $(window).height() < $(document).height()) {
                        $header_sticky.removeClass(options.classes.unpinned).addClass(options.classes.pinned);
                    }
                }
        }

        // Not past offset
        else {
                $header_sticky.removeClass(options.classes.pinned).addClass(options.classes.unpinned);
            }

        last_distance_from_top = current_distance_from_top;
    }

    return pub;
}(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  var AjaxMonitor,
      Bar,
      DocumentMonitor,
      ElementMonitor,
      ElementTracker,
      EventLagMonitor,
      Evented,
      Events,
      NoTargetError,
      Pace,
      RequestIntercept,
      SOURCE_KEYS,
      Scaler,
      SocketRequestTracker,
      XHRRequestTracker,
      animation,
      avgAmplitude,
      bar,
      cancelAnimation,
      cancelAnimationFrame,
      defaultOptions,
      _extend,
      extendNative,
      getFromDOM,
      getIntercept,
      handlePushState,
      ignoreStack,
      init,
      now,
      options,
      requestAnimationFrame,
      result,
      runAnimation,
      scalers,
      shouldIgnoreURL,
      shouldTrack,
      source,
      sources,
      uniScaler,
      _WebSocket,
      _XDomainRequest,
      _XMLHttpRequest,
      _i,
      _intercept,
      _len,
      _pushState,
      _ref,
      _ref1,
      _replaceState,
      __slice = [].slice,
      __hasProp = {}.hasOwnProperty,
      __extends = function __extends(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }return -1;
  };

  defaultOptions = {
    catchupTime: 100,
    initialRate: .03,
    minTime: 250,
    ghostTime: 100,
    maxProgressPerFrame: 20,
    easeFactor: 1.25,
    startOnPageLoad: true,
    restartOnPushState: true,
    restartOnRequestAfter: 500,
    target: 'body',
    elements: {
      checkInterval: 100,
      selectors: ['body']
    },
    eventLag: {
      minSamples: 10,
      sampleCount: 3,
      lagThreshold: 3
    },
    ajax: {
      trackMethods: ['GET'],
      trackWebSockets: true,
      ignoreURLs: []
    }
  };

  now = function now() {
    var _ref;
    return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +new Date();
  };

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  if (requestAnimationFrame == null) {
    requestAnimationFrame = function requestAnimationFrame(fn) {
      return setTimeout(fn, 50);
    };
    cancelAnimationFrame = function cancelAnimationFrame(id) {
      return clearTimeout(id);
    };
  }

  runAnimation = function runAnimation(fn) {
    var last, _tick;
    last = now();
    _tick = function tick() {
      var diff;
      diff = now() - last;
      if (diff >= 33) {
        last = now();
        return fn(diff, function () {
          return requestAnimationFrame(_tick);
        });
      } else {
        return setTimeout(_tick, 33 - diff);
      }
    };
    return _tick();
  };

  result = function result() {
    var args, key, obj;
    obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (typeof obj[key] === 'function') {
      return obj[key].apply(obj, args);
    } else {
      return obj[key];
    }
  };

  _extend = function extend() {
    var key, out, source, sources, val, _i, _len;
    out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      if (source) {
        for (key in source) {
          if (!__hasProp.call(source, key)) continue;
          val = source[key];
          if (out[key] != null && _typeof(out[key]) === 'object' && val != null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            _extend(out[key], val);
          } else {
            out[key] = val;
          }
        }
      }
    }
    return out;
  };

  avgAmplitude = function avgAmplitude(arr) {
    var count, sum, v, _i, _len;
    sum = count = 0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      v = arr[_i];
      sum += Math.abs(v);
      count++;
    }
    return sum / count;
  };

  getFromDOM = function getFromDOM(key, json) {
    var data, e, el;
    if (key == null) {
      key = 'options';
    }
    if (json == null) {
      json = true;
    }
    el = document.querySelector("[data-pace-" + key + "]");
    if (!el) {
      return;
    }
    data = el.getAttribute("data-pace-" + key);
    if (!json) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (_error) {
      e = _error;
      return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
    }
  };

  Evented = function () {
    function Evented() {}

    Evented.prototype.on = function (event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once
      });
    };

    Evented.prototype.once = function (event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function (event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    Evented.prototype.trigger = function () {
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;
  }();

  Pace = window.Pace || {};

  window.Pace = Pace;

  _extend(Pace, Evented.prototype);

  options = Pace.options = _extend({}, defaultOptions, window.paceOptions, getFromDOM());

  _ref = ['ajax', 'document', 'eventLag', 'elements'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    source = _ref[_i];
    if (options[source] === true) {
      options[source] = defaultOptions[source];
    }
  }

  NoTargetError = function (_super) {
    __extends(NoTargetError, _super);

    function NoTargetError() {
      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return NoTargetError;
  }(Error);

  Bar = function () {
    function Bar() {
      this.progress = 0;
    }

    Bar.prototype.getElement = function () {
      var targetElement;
      if (this.el == null) {
        targetElement = document.querySelector(options.target);
        if (!targetElement) {
          throw new NoTargetError();
        }
        this.el = document.createElement('div');
        this.el.className = "pace pace-active";
        document.body.className = document.body.className.replace(/pace-done/g, '');
        document.body.className += ' pace-running';
        this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
        if (targetElement.firstChild != null) {
          targetElement.insertBefore(this.el, targetElement.firstChild);
        } else {
          targetElement.appendChild(this.el);
        }
      }
      return this.el;
    };

    Bar.prototype.finish = function () {
      var el;
      el = this.getElement();
      el.className = el.className.replace('pace-active', '');
      el.className += ' pace-inactive';
      document.body.className = document.body.className.replace('pace-running', '');
      return document.body.className += ' pace-done';
    };

    Bar.prototype.update = function (prog) {
      this.progress = prog;
      return this.render();
    };

    Bar.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (_error) {
        NoTargetError = _error;
      }
      return this.el = void 0;
    };

    Bar.prototype.render = function () {
      var el, key, progressStr, transform, _j, _len1, _ref2;
      if (document.querySelector(options.target) == null) {
        return false;
      }
      el = this.getElement();
      transform = "translate3d(" + this.progress + "%, 0, 0)";
      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        key = _ref2[_j];
        el.children[0].style[key] = transform;
      }
      if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
        el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
        if (this.progress >= 100) {
          progressStr = '99';
        } else {
          progressStr = this.progress < 10 ? "0" : "";
          progressStr += this.progress | 0;
        }
        el.children[0].setAttribute('data-progress', "" + progressStr);
      }
      return this.lastRenderedProgress = this.progress;
    };

    Bar.prototype.done = function () {
      return this.progress >= 100;
    };

    return Bar;
  }();

  Events = function () {
    function Events() {
      this.bindings = {};
    }

    Events.prototype.trigger = function (name, val) {
      var binding, _j, _len1, _ref2, _results;
      if (this.bindings[name] != null) {
        _ref2 = this.bindings[name];
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          binding = _ref2[_j];
          _results.push(binding.call(this, val));
        }
        return _results;
      }
    };

    Events.prototype.on = function (name, fn) {
      var _base;
      if ((_base = this.bindings)[name] == null) {
        _base[name] = [];
      }
      return this.bindings[name].push(fn);
    };

    return Events;
  }();

  _XMLHttpRequest = window.XMLHttpRequest;

  _XDomainRequest = window.XDomainRequest;

  _WebSocket = window.WebSocket;

  extendNative = function extendNative(to, from) {
    var e, key, _results;
    _results = [];
    for (key in from.prototype) {
      try {
        if (to[key] == null && typeof from[key] !== 'function') {
          if (typeof Object.defineProperty === 'function') {
            _results.push(Object.defineProperty(to, key, {
              get: function get() {
                return from.prototype[key];
              },
              configurable: true,
              enumerable: true
            }));
          } else {
            _results.push(to[key] = from.prototype[key]);
          }
        } else {
          _results.push(void 0);
        }
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  ignoreStack = [];

  Pace.ignore = function () {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('ignore');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  Pace.track = function () {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('track');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  shouldTrack = function shouldTrack(method) {
    var _ref2;
    if (method == null) {
      method = 'GET';
    }
    if (ignoreStack[0] === 'track') {
      return 'force';
    }
    if (!ignoreStack.length && options.ajax) {
      if (method === 'socket' && options.ajax.trackWebSockets) {
        return true;
      } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
        return true;
      }
    }
    return false;
  };

  RequestIntercept = function (_super) {
    __extends(RequestIntercept, _super);

    function RequestIntercept() {
      var monitorXHR,
          _this = this;
      RequestIntercept.__super__.constructor.apply(this, arguments);
      monitorXHR = function monitorXHR(req) {
        var _open;
        _open = req.open;
        return req.open = function (type, url, async) {
          if (shouldTrack(type)) {
            _this.trigger('request', {
              type: type,
              url: url,
              request: req
            });
          }
          return _open.apply(req, arguments);
        };
      };
      window.XMLHttpRequest = function (flags) {
        var req;
        req = new _XMLHttpRequest(flags);
        monitorXHR(req);
        return req;
      };
      try {
        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
      } catch (_error) {}
      if (_XDomainRequest != null) {
        window.XDomainRequest = function () {
          var req;
          req = new _XDomainRequest();
          monitorXHR(req);
          return req;
        };
        try {
          extendNative(window.XDomainRequest, _XDomainRequest);
        } catch (_error) {}
      }
      if (_WebSocket != null && options.ajax.trackWebSockets) {
        window.WebSocket = function (url, protocols) {
          var req;
          if (protocols != null) {
            req = new _WebSocket(url, protocols);
          } else {
            req = new _WebSocket(url);
          }
          if (shouldTrack('socket')) {
            _this.trigger('request', {
              type: 'socket',
              url: url,
              protocols: protocols,
              request: req
            });
          }
          return req;
        };
        try {
          extendNative(window.WebSocket, _WebSocket);
        } catch (_error) {}
      }
    }

    return RequestIntercept;
  }(Events);

  _intercept = null;

  getIntercept = function getIntercept() {
    if (_intercept == null) {
      _intercept = new RequestIntercept();
    }
    return _intercept;
  };

  shouldIgnoreURL = function shouldIgnoreURL(url) {
    var pattern, _j, _len1, _ref2;
    _ref2 = options.ajax.ignoreURLs;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      pattern = _ref2[_j];
      if (typeof pattern === 'string') {
        if (url.indexOf(pattern) !== -1) {
          return true;
        }
      } else {
        if (pattern.test(url)) {
          return true;
        }
      }
    }
    return false;
  };

  getIntercept().on('request', function (_arg) {
    var after, args, request, type, url;
    type = _arg.type, request = _arg.request, url = _arg.url;
    if (shouldIgnoreURL(url)) {
      return;
    }
    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
      args = arguments;
      after = options.restartOnRequestAfter || 0;
      if (typeof after === 'boolean') {
        after = 0;
      }
      return setTimeout(function () {
        var stillActive, _j, _len1, _ref2, _ref3, _results;
        if (type === 'socket') {
          stillActive = request.readyState < 2;
        } else {
          stillActive = 0 < (_ref2 = request.readyState) && _ref2 < 4;
        }
        if (stillActive) {
          Pace.restart();
          _ref3 = Pace.sources;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            source = _ref3[_j];
            if (source instanceof AjaxMonitor) {
              source.watch.apply(source, args);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }, after);
    }
  });

  AjaxMonitor = function () {
    function AjaxMonitor() {
      var _this = this;
      this.elements = [];
      getIntercept().on('request', function () {
        return _this.watch.apply(_this, arguments);
      });
    }

    AjaxMonitor.prototype.watch = function (_arg) {
      var request, tracker, type, url;
      type = _arg.type, request = _arg.request, url = _arg.url;
      if (shouldIgnoreURL(url)) {
        return;
      }
      if (type === 'socket') {
        tracker = new SocketRequestTracker(request);
      } else {
        tracker = new XHRRequestTracker(request);
      }
      return this.elements.push(tracker);
    };

    return AjaxMonitor;
  }();

  XHRRequestTracker = function () {
    function XHRRequestTracker(request) {
      var event,
          size,
          _j,
          _len1,
          _onreadystatechange,
          _ref2,
          _this = this;
      this.progress = 0;
      if (window.ProgressEvent != null) {
        size = null;
        request.addEventListener('progress', function (evt) {
          if (evt.lengthComputable) {
            return _this.progress = 100 * evt.loaded / evt.total;
          } else {
            return _this.progress = _this.progress + (100 - _this.progress) / 2;
          }
        }, false);
        _ref2 = ['load', 'abort', 'timeout', 'error'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          event = _ref2[_j];
          request.addEventListener(event, function () {
            return _this.progress = 100;
          }, false);
        }
      } else {
        _onreadystatechange = request.onreadystatechange;
        request.onreadystatechange = function () {
          var _ref3;
          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
            _this.progress = 100;
          } else if (request.readyState === 3) {
            _this.progress = 50;
          }
          return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
        };
      }
    }

    return XHRRequestTracker;
  }();

  SocketRequestTracker = function () {
    function SocketRequestTracker(request) {
      var event,
          _j,
          _len1,
          _ref2,
          _this = this;
      this.progress = 0;
      _ref2 = ['error', 'open'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        event = _ref2[_j];
        request.addEventListener(event, function () {
          return _this.progress = 100;
        }, false);
      }
    }

    return SocketRequestTracker;
  }();

  ElementMonitor = function () {
    function ElementMonitor(options) {
      var selector, _j, _len1, _ref2;
      if (options == null) {
        options = {};
      }
      this.elements = [];
      if (options.selectors == null) {
        options.selectors = [];
      }
      _ref2 = options.selectors;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        selector = _ref2[_j];
        this.elements.push(new ElementTracker(selector));
      }
    }

    return ElementMonitor;
  }();

  ElementTracker = function () {
    function ElementTracker(selector) {
      this.selector = selector;
      this.progress = 0;
      this.check();
    }

    ElementTracker.prototype.check = function () {
      var _this = this;
      if (document.querySelector(this.selector)) {
        return this.done();
      } else {
        return setTimeout(function () {
          return _this.check();
        }, options.elements.checkInterval);
      }
    };

    ElementTracker.prototype.done = function () {
      return this.progress = 100;
    };

    return ElementTracker;
  }();

  DocumentMonitor = function () {
    DocumentMonitor.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    };

    function DocumentMonitor() {
      var _onreadystatechange,
          _ref2,
          _this = this;
      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
      _onreadystatechange = document.onreadystatechange;
      document.onreadystatechange = function () {
        if (_this.states[document.readyState] != null) {
          _this.progress = _this.states[document.readyState];
        }
        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
      };
    }

    return DocumentMonitor;
  }();

  EventLagMonitor = function () {
    function EventLagMonitor() {
      var avg,
          interval,
          last,
          points,
          samples,
          _this = this;
      this.progress = 0;
      avg = 0;
      samples = [];
      points = 0;
      last = now();
      interval = setInterval(function () {
        var diff;
        diff = now() - last - 50;
        last = now();
        samples.push(diff);
        if (samples.length > options.eventLag.sampleCount) {
          samples.shift();
        }
        avg = avgAmplitude(samples);
        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
          _this.progress = 100;
          return clearInterval(interval);
        } else {
          return _this.progress = 100 * (3 / (avg + 3));
        }
      }, 50);
    }

    return EventLagMonitor;
  }();

  Scaler = function () {
    function Scaler(source) {
      this.source = source;
      this.last = this.sinceLastUpdate = 0;
      this.rate = options.initialRate;
      this.catchup = 0;
      this.progress = this.lastProgress = 0;
      if (this.source != null) {
        this.progress = result(this.source, 'progress');
      }
    }

    Scaler.prototype.tick = function (frameTime, val) {
      var scaling;
      if (val == null) {
        val = result(this.source, 'progress');
      }
      if (val >= 100) {
        this.done = true;
      }
      if (val === this.last) {
        this.sinceLastUpdate += frameTime;
      } else {
        if (this.sinceLastUpdate) {
          this.rate = (val - this.last) / this.sinceLastUpdate;
        }
        this.catchup = (val - this.progress) / options.catchupTime;
        this.sinceLastUpdate = 0;
        this.last = val;
      }
      if (val > this.progress) {
        this.progress += this.catchup * frameTime;
      }
      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
      this.progress += scaling * this.rate * frameTime;
      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
      this.progress = Math.max(0, this.progress);
      this.progress = Math.min(100, this.progress);
      this.lastProgress = this.progress;
      return this.progress;
    };

    return Scaler;
  }();

  sources = null;

  scalers = null;

  bar = null;

  uniScaler = null;

  animation = null;

  cancelAnimation = null;

  Pace.running = false;

  handlePushState = function handlePushState() {
    if (options.restartOnPushState) {
      return Pace.restart();
    }
  };

  if (window.history.pushState != null) {
    _pushState = window.history.pushState;
    window.history.pushState = function () {
      handlePushState();
      return _pushState.apply(window.history, arguments);
    };
  }

  if (window.history.replaceState != null) {
    _replaceState = window.history.replaceState;
    window.history.replaceState = function () {
      handlePushState();
      return _replaceState.apply(window.history, arguments);
    };
  }

  SOURCE_KEYS = {
    ajax: AjaxMonitor,
    elements: ElementMonitor,
    document: DocumentMonitor,
    eventLag: EventLagMonitor
  };

  (init = function init() {
    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
    Pace.sources = sources = [];
    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      type = _ref2[_j];
      if (options[type] !== false) {
        sources.push(new SOURCE_KEYS[type](options[type]));
      }
    }
    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      source = _ref4[_k];
      sources.push(new source(options));
    }
    Pace.bar = bar = new Bar();
    scalers = [];
    return uniScaler = new Scaler();
  })();

  Pace.stop = function () {
    Pace.trigger('stop');
    Pace.running = false;
    bar.destroy();
    cancelAnimation = true;
    if (animation != null) {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(animation);
      }
      animation = null;
    }
    return init();
  };

  Pace.restart = function () {
    Pace.trigger('restart');
    Pace.stop();
    return Pace.start();
  };

  Pace.go = function () {
    var start;
    Pace.running = true;
    bar.render();
    start = now();
    cancelAnimation = false;
    return animation = runAnimation(function (frameTime, enqueueNextFrame) {
      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
      remaining = 100 - bar.progress;
      count = sum = 0;
      done = true;
      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
        source = sources[i];
        scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
          element = elements[j];
          scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
          done &= scaler.done;
          if (scaler.done) {
            continue;
          }
          count++;
          sum += scaler.tick(frameTime);
        }
      }
      avg = sum / count;
      bar.update(uniScaler.tick(frameTime, avg));
      if (bar.done() || done || cancelAnimation) {
        bar.update(100);
        Pace.trigger('done');
        return setTimeout(function () {
          bar.finish();
          Pace.running = false;
          return Pace.trigger('hide');
        }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
      } else {
        return enqueueNextFrame();
      }
    });
  };

  Pace.start = function (_options) {
    _extend(options, _options);
    Pace.running = true;
    try {
      bar.render();
    } catch (_error) {
      NoTargetError = _error;
    }
    if (!document.querySelector('.pace')) {
      return setTimeout(Pace.start, 50);
    } else {
      Pace.trigger('start');
      return Pace.go();
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(['pace'], function () {
      return Pace;
    });
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = Pace;
  } else {
    if (options.startOnPageLoad) {
      Pace.start();
    }
  }
}).call(undefined);
"use strict";

!function (e) {
  var t;e.fn.slinky = function (a) {
    var s = e.extend({ label: "Back", title: !1, speed: 300, resize: !0 }, a),
        i = e(this),
        n = i.children().first();i.addClass("slinky-menu");var r = function r(e, t) {
      var a = Math.round(parseInt(n.get(0).style.left)) || 0;n.css("left", a - 100 * e + "%"), "function" == typeof t && setTimeout(t, s.speed);
    },
        l = function l(e) {
      i.height(e.outerHeight());
    },
        d = function d(e) {
      i.css("transition-duration", e + "ms"), n.css("transition-duration", e + "ms");
    };if (d(s.speed), e("a + ul", i).prev().addClass("next"), e("li > ul", i).prepend('<li class="header">'), s.title === !0 && e("li > ul", i).each(function () {
      var t = e(this).parent().find("a").first().text(),
          a = e("<h2>").text(t);e("> .header", this).append(a);
    }), s.title || s.label !== !0) {
      var o = e("<a>").text(s.label).prop("href", "#").addClass("back");e(".header", i).append(o);
    } else e("li > ul", i).each(function () {
      var t = e(this).parent().find("a").first().text(),
          a = e("<a>").text(t).prop("href", "#").addClass("back");e("> .header", this).append(a);
    });e("a", i).on("click", function (a) {
      if (!(t + s.speed > Date.now())) {
        t = Date.now();var n = e(this);/#/.test(this.href) && a.preventDefault(), n.hasClass("next") ? (i.find(".active").removeClass("active"), n.next().show().addClass("active"), r(1), s.resize && l(n.next())) : n.hasClass("back") && (r(-1, function () {
          i.find(".active").removeClass("active"), n.parent().parent().hide().parentsUntil(i, "ul").first().addClass("active");
        }), s.resize && l(n.parent().parent().parentsUntil(i, "ul")));
      }
    }), this.jump = function (t, a) {
      t = e(t);var n = i.find(".active");n = n.length > 0 ? n.parentsUntil(i, "ul").length : 0, i.find("ul").removeClass("active").hide();var o = t.parentsUntil(i, "ul");o.show(), t.show().addClass("active"), a === !1 && d(0), r(o.length - n), s.resize && l(t), a === !1 && d(s.speed);
    }, this.home = function (t) {
      t === !1 && d(0);var a = i.find(".active"),
          n = a.parentsUntil(i, "li").length;n > 0 && (r(-n, function () {
        a.removeClass("active");
      }), s.resize && l(e(a.parentsUntil(i, "li").get(n - 1)).parent())), t === !1 && d(s.speed);
    }, this.destroy = function () {
      e(".header", i).remove(), e("a", i).removeClass("next").off("click"), i.removeClass("slinky-menu").css("transition-duration", ""), n.css("transition-duration", "");
    };var c = i.find(".active");return c.length > 0 && (c.removeClass("active"), this.jump(c, !1)), this;
  };
}(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var tns = function () {
  // Object.keys
  if (!Object.keys) {
    Object.keys = function (object) {
      var keys = [];
      for (var name in object) {
        if (Object.prototype.hasOwnProperty.call(object, name)) {
          keys.push(name);
        }
      }
      return keys;
    };
  }

  // ChildNode.remove
  if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  var win = window;

  var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) {
    return setTimeout(cb, 16);
  };

  var win$1 = window;

  var caf = win$1.cancelAnimationFrame || win$1.mozCancelAnimationFrame || function (id) {
    clearTimeout(id);
  };

  function extend() {
    var obj,
        name,
        copy,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;

    for (; i < length; i++) {
      if ((obj = arguments[i]) !== null) {
        for (name in obj) {
          copy = obj[name];

          if (target === copy) {
            continue;
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  function checkStorageValue(value) {
    return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value;
  }

  function setLocalStorage(storage, key, value, access) {
    if (access) {
      try {
        storage.setItem(key, value);
      } catch (e) {}
    }
    return value;
  }

  function getSlideId() {
    var id = window.tnsId;
    window.tnsId = !id ? 1 : id + 1;

    return 'tns' + window.tnsId;
  }

  function getBody() {
    var doc = document,
        body = doc.body;

    if (!body) {
      body = doc.createElement('body');
      body.fake = true;
    }

    return body;
  }

  var docElement = document.documentElement;

  function setFakeBody(body) {
    var docOverflow = '';
    if (body.fake) {
      docOverflow = docElement.style.overflow;
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    return docOverflow;
  }

  function resetFakeBody(body, docOverflow) {
    if (body.fake) {
      body.remove();
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      // eslint-disable-next-line
      docElement.offsetHeight;
    }
  }

  // get css-calc 

  function calc() {
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        result = false;

    body.appendChild(div);
    try {
      var str = '(10px * 10)',
          vals = ['calc' + str, '-moz-calc' + str, '-webkit-calc' + str],
          val;
      for (var i = 0; i < 3; i++) {
        val = vals[i];
        div.style.width = val;
        if (div.offsetWidth === 100) {
          result = val.replace(str, '');
          break;
        }
      }
    } catch (e) {}

    body.fake ? resetFakeBody(body, docOverflow) : div.remove();

    return result;
  }

  // get subpixel support value

  function percentageLayout() {
    // check subpixel layout supporting
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        wrapper = doc.createElement('div'),
        outer = doc.createElement('div'),
        str = '',
        count = 70,
        perPage = 3,
        supported = false;

    wrapper.className = "tns-t-subp2";
    outer.className = "tns-t-ct";

    for (var i = 0; i < count; i++) {
      str += '<div></div>';
    }

    outer.innerHTML = str;
    wrapper.appendChild(outer);
    body.appendChild(wrapper);

    supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[count - perPage].getBoundingClientRect().left) < 2;

    body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove();

    return supported;
  }

  function mediaquerySupport() {
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        style = doc.createElement('style'),
        rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}',
        position;

    style.type = 'text/css';
    div.className = 'tns-mq-test';

    body.appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(doc.createTextNode(rule));
    }

    position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position'];

    body.fake ? resetFakeBody(body, docOverflow) : div.remove();

    return position === "absolute";
  }

  // create and append style sheet
  function createStyleSheet(media) {
    // Create the <style> tag
    var style = document.createElement("style");
    // style.setAttribute("type", "text/css");

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    if (media) {
      style.setAttribute("media", media);
    }

    // WebKit hack :(
    // style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.querySelector('head').appendChild(style);

    return style.sheet ? style.sheet : style.styleSheet;
  }

  // cross browsers addRule method
  function addCSSRule(sheet, selector, rules, index) {
    // return raf(function() {
    'insertRule' in sheet ? sheet.insertRule(selector + '{' + rules + '}', index) : sheet.addRule(selector, rules, index);
    // });
  }

  // cross browsers addRule method
  function removeCSSRule(sheet, index) {
    // return raf(function() {
    'deleteRule' in sheet ? sheet.deleteRule(index) : sheet.removeRule(index);
    // });
  }

  function getCssRulesLength(sheet) {
    var rule = 'insertRule' in sheet ? sheet.cssRules : sheet.rules;
    return rule.length;
  }

  function toDegree(y, x) {
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  function getTouchDirection(angle, range) {
    var direction = false,
        gap = Math.abs(90 - Math.abs(angle));

    if (gap >= 90 - range) {
      direction = 'horizontal';
    } else if (gap <= range) {
      direction = 'vertical';
    }

    return direction;
  }

  // https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
  function forEach(arr, callback, scope) {
    for (var i = 0, l = arr.length; i < l; i++) {
      callback.call(scope, arr[i], i);
    }
  }

  var classListSupport = 'classList' in document.createElement('_');

  var hasClass = classListSupport ? function (el, str) {
    return el.classList.contains(str);
  } : function (el, str) {
    return el.className.indexOf(str) >= 0;
  };

  var addClass = classListSupport ? function (el, str) {
    if (!hasClass(el, str)) {
      el.classList.add(str);
    }
  } : function (el, str) {
    if (!hasClass(el, str)) {
      el.className += ' ' + str;
    }
  };

  var removeClass = classListSupport ? function (el, str) {
    if (hasClass(el, str)) {
      el.classList.remove(str);
    }
  } : function (el, str) {
    if (hasClass(el, str)) {
      el.className = el.className.replace(str, '');
    }
  };

  function hasAttr(el, attr) {
    return el.hasAttribute(attr);
  }

  function getAttr(el, attr) {
    return el.getAttribute(attr);
  }

  function isNodeList(el) {
    // Only NodeList has the "item()" function
    return typeof el.item !== "undefined";
  }

  function setAttrs(els, attrs) {
    els = isNodeList(els) || els instanceof Array ? els : [els];
    if (Object.prototype.toString.call(attrs) !== '[object Object]') {
      return;
    }

    for (var i = els.length; i--;) {
      for (var key in attrs) {
        els[i].setAttribute(key, attrs[key]);
      }
    }
  }

  function removeAttrs(els, attrs) {
    els = isNodeList(els) || els instanceof Array ? els : [els];
    attrs = attrs instanceof Array ? attrs : [attrs];

    var attrLength = attrs.length;
    for (var i = els.length; i--;) {
      for (var j = attrLength; j--;) {
        els[i].removeAttribute(attrs[j]);
      }
    }
  }

  function arrayFromNodeList(nl) {
    var arr = [];
    for (var i = 0, l = nl.length; i < l; i++) {
      arr.push(nl[i]);
    }
    return arr;
  }

  function hideElement(el, forceHide) {
    if (el.style.display !== 'none') {
      el.style.display = 'none';
    }
  }

  function showElement(el, forceHide) {
    if (el.style.display === 'none') {
      el.style.display = '';
    }
  }

  function isVisible(el) {
    return window.getComputedStyle(el).display !== 'none';
  }

  function whichProperty(props) {
    if (typeof props === 'string') {
      var arr = [props],
          Props = props.charAt(0).toUpperCase() + props.substr(1),
          prefixes = ['Webkit', 'Moz', 'ms', 'O'];

      prefixes.forEach(function (prefix) {
        if (prefix !== 'ms' || props === 'transform') {
          arr.push(prefix + Props);
        }
      });

      props = arr;
    }

    var el = document.createElement('fakeelement'),
        len = props.length;
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (el.style[prop] !== undefined) {
        return prop;
      }
    }

    return false; // explicit for ie9-
  }

  function has3DTransforms(tf) {
    if (!tf) {
      return false;
    }
    if (!window.getComputedStyle) {
      return false;
    }

    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        el = doc.createElement('p'),
        has3d,
        cssTF = tf.length > 9 ? '-' + tf.slice(0, -9).toLowerCase() + '-' : '';

    cssTF += 'transform';

    // Add it to the body to get the computed style
    body.insertBefore(el, null);

    el.style[tf] = 'translate3d(1px,1px,1px)';
    has3d = window.getComputedStyle(el).getPropertyValue(cssTF);

    body.fake ? resetFakeBody(body, docOverflow) : el.remove();

    return has3d !== undefined && has3d.length > 0 && has3d !== "none";
  }

  // get transitionend, animationend based on transitionDuration
  // @propin: string
  // @propOut: string, first-letter uppercase
  // Usage: getEndProperty('WebkitTransitionDuration', 'Transition') => webkitTransitionEnd
  function getEndProperty(propIn, propOut) {
    var endProp = false;
    if (/^Webkit/.test(propIn)) {
      endProp = 'webkit' + propOut + 'End';
    } else if (/^O/.test(propIn)) {
      endProp = 'o' + propOut + 'End';
    } else if (propIn) {
      endProp = propOut.toLowerCase() + 'end';
    }
    return endProp;
  }

  // Test via a getter in the options object to see if the passive property is accessed
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}
  var passiveOption = supportsPassive ? { passive: true } : false;

  function addEvents(el, obj, preventScrolling) {
    for (var prop in obj) {
      var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 && !preventScrolling ? passiveOption : false;
      el.addEventListener(prop, obj[prop], option);
    }
  }

  function removeEvents(el, obj) {
    for (var prop in obj) {
      var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? passiveOption : false;
      el.removeEventListener(prop, obj[prop], option);
    }
  }

  function Events() {
    return {
      topics: {},
      on: function on(eventName, fn) {
        this.topics[eventName] = this.topics[eventName] || [];
        this.topics[eventName].push(fn);
      },
      off: function off(eventName, fn) {
        if (this.topics[eventName]) {
          for (var i = 0; i < this.topics[eventName].length; i++) {
            if (this.topics[eventName][i] === fn) {
              this.topics[eventName].splice(i, 1);
              break;
            }
          }
        }
      },
      emit: function emit(eventName, data) {
        data.type = eventName;
        if (this.topics[eventName]) {
          this.topics[eventName].forEach(function (fn) {
            fn(data, eventName);
          });
        }
      }
    };
  }

  function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
    var tick = Math.min(duration, 10),
        unit = to.indexOf('%') >= 0 ? '%' : 'px',
        to = to.replace(unit, ''),
        from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')),
        positionTick = (to - from) / duration * tick,
        running;

    setTimeout(moveElement, tick);
    function moveElement() {
      duration -= tick;
      from += positionTick;
      element.style[attr] = prefix + from + unit + postfix;
      if (duration > 0) {
        setTimeout(moveElement, tick);
      } else {
        callback();
      }
    }
  }

  var tns = function tns(options) {
    options = extend({
      container: '.slider',
      mode: 'carousel',
      axis: 'horizontal',
      items: 1,
      gutter: 0,
      edgePadding: 0,
      fixedWidth: false,
      autoWidth: false,
      viewportMax: false,
      slideBy: 1,
      center: false,
      controls: true,
      controlsPosition: 'top',
      controlsText: ['prev', 'next'],
      controlsContainer: false,
      prevButton: false,
      nextButton: false,
      nav: true,
      navPosition: 'top',
      navContainer: false,
      navAsThumbnails: false,
      arrowKeys: false,
      speed: 300,
      autoplay: false,
      autoplayPosition: 'top',
      autoplayTimeout: 5000,
      autoplayDirection: 'forward',
      autoplayText: ['start', 'stop'],
      autoplayHoverPause: false,
      autoplayButton: false,
      autoplayButtonOutput: true,
      autoplayResetOnVisibility: true,
      animateIn: 'tns-fadeIn',
      animateOut: 'tns-fadeOut',
      animateNormal: 'tns-normal',
      animateDelay: false,
      loop: true,
      rewind: false,
      autoHeight: false,
      responsive: false,
      lazyload: false,
      lazyloadSelector: '.tns-lazy-img',
      touch: true,
      mouseDrag: false,
      swipeAngle: 15,
      nested: false,
      preventActionWhenRunning: false,
      preventScrollOnTouch: false,
      freezable: true,
      onInit: false,
      useLocalStorage: true
    }, options || {});

    var doc = document,
        win = window,
        KEYS = {
      ENTER: 13,
      SPACE: 32,
      LEFT: 37,
      RIGHT: 39
    },
        tnsStorage = {},
        localStorageAccess = options.useLocalStorage;

    if (localStorageAccess) {
      // check browser version and local storage access
      var browserInfo = navigator.userAgent;
      var uid = new Date();

      try {
        tnsStorage = win.localStorage;
        if (tnsStorage) {
          tnsStorage.setItem(uid, uid);
          localStorageAccess = tnsStorage.getItem(uid) == uid;
          tnsStorage.removeItem(uid);
        } else {
          localStorageAccess = false;
        }
        if (!localStorageAccess) {
          tnsStorage = {};
        }
      } catch (e) {
        localStorageAccess = false;
      }

      if (localStorageAccess) {
        // remove storage when browser version changes
        if (tnsStorage['tnsApp'] && tnsStorage['tnsApp'] !== browserInfo) {
          ['tC', 'tPL', 'tMQ', 'tTf', 't3D', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function (item) {
            tnsStorage.removeItem(item);
          });
        }
        // update browserInfo
        localStorage['tnsApp'] = browserInfo;
      }
    }

    var CALC = tnsStorage['tC'] ? checkStorageValue(tnsStorage['tC']) : setLocalStorage(tnsStorage, 'tC', calc(), localStorageAccess),
        PERCENTAGELAYOUT = tnsStorage['tPL'] ? checkStorageValue(tnsStorage['tPL']) : setLocalStorage(tnsStorage, 'tPL', percentageLayout(), localStorageAccess),
        CSSMQ = tnsStorage['tMQ'] ? checkStorageValue(tnsStorage['tMQ']) : setLocalStorage(tnsStorage, 'tMQ', mediaquerySupport(), localStorageAccess),
        TRANSFORM = tnsStorage['tTf'] ? checkStorageValue(tnsStorage['tTf']) : setLocalStorage(tnsStorage, 'tTf', whichProperty('transform'), localStorageAccess),
        HAS3DTRANSFORMS = tnsStorage['t3D'] ? checkStorageValue(tnsStorage['t3D']) : setLocalStorage(tnsStorage, 't3D', has3DTransforms(TRANSFORM), localStorageAccess),
        TRANSITIONDURATION = tnsStorage['tTDu'] ? checkStorageValue(tnsStorage['tTDu']) : setLocalStorage(tnsStorage, 'tTDu', whichProperty('transitionDuration'), localStorageAccess),
        TRANSITIONDELAY = tnsStorage['tTDe'] ? checkStorageValue(tnsStorage['tTDe']) : setLocalStorage(tnsStorage, 'tTDe', whichProperty('transitionDelay'), localStorageAccess),
        ANIMATIONDURATION = tnsStorage['tADu'] ? checkStorageValue(tnsStorage['tADu']) : setLocalStorage(tnsStorage, 'tADu', whichProperty('animationDuration'), localStorageAccess),
        ANIMATIONDELAY = tnsStorage['tADe'] ? checkStorageValue(tnsStorage['tADe']) : setLocalStorage(tnsStorage, 'tADe', whichProperty('animationDelay'), localStorageAccess),
        TRANSITIONEND = tnsStorage['tTE'] ? checkStorageValue(tnsStorage['tTE']) : setLocalStorage(tnsStorage, 'tTE', getEndProperty(TRANSITIONDURATION, 'Transition'), localStorageAccess),
        ANIMATIONEND = tnsStorage['tAE'] ? checkStorageValue(tnsStorage['tAE']) : setLocalStorage(tnsStorage, 'tAE', getEndProperty(ANIMATIONDURATION, 'Animation'), localStorageAccess);

    // get element nodes from selectors
    var supportConsoleWarn = win.console && typeof win.console.warn === "function",
        tnsList = ['container', 'controlsContainer', 'prevButton', 'nextButton', 'navContainer', 'autoplayButton'],
        optionsElements = {};

    tnsList.forEach(function (item) {
      if (typeof options[item] === 'string') {
        var str = options[item],
            el = doc.querySelector(str);
        optionsElements[item] = str;

        if (el && el.nodeName) {
          options[item] = el;
        } else {
          if (supportConsoleWarn) {
            console.warn('Can\'t find', options[item]);
          }
          return;
        }
      }
    });

    // make sure at least 1 slide
    if (options.container.children.length < 1) {
      if (supportConsoleWarn) {
        console.warn('No slides found in', options.container);
      }
      return;
    }

    // update options
    var responsive = options.responsive,
        nested = options.nested,
        carousel = options.mode === 'carousel' ? true : false;

    if (responsive) {
      // apply responsive[0] to options and remove it
      if (0 in responsive) {
        options = extend(options, responsive[0]);
        delete responsive[0];
      }

      var responsiveTem = {};
      for (var key in responsive) {
        var val = responsive[key];
        // update responsive
        // from: 300: 2
        // to: 
        //   300: { 
        //     items: 2 
        //   } 
        val = typeof val === 'number' ? { items: val } : val;
        responsiveTem[key] = val;
      }
      responsive = responsiveTem;
      responsiveTem = null;
    }

    // update options
    function updateOptions(obj) {
      for (var key in obj) {
        if (!carousel) {
          if (key === 'slideBy') {
            obj[key] = 'page';
          }
          if (key === 'edgePadding') {
            obj[key] = false;
          }
          if (key === 'autoHeight') {
            obj[key] = false;
          }
        }

        // update responsive options
        if (key === 'responsive') {
          updateOptions(obj[key]);
        }
      }
    }
    if (!carousel) {
      updateOptions(options);
    }

    // === define and set variables ===
    if (!carousel) {
      options.axis = 'horizontal';
      options.slideBy = 'page';
      options.edgePadding = false;

      var animateIn = options.animateIn,
          animateOut = options.animateOut,
          animateDelay = options.animateDelay,
          animateNormal = options.animateNormal;
    }

    var horizontal = options.axis === 'horizontal' ? true : false,
        outerWrapper = doc.createElement('div'),
        innerWrapper = doc.createElement('div'),
        middleWrapper,
        container = options.container,
        containerParent = container.parentNode,
        containerHTML = container.outerHTML,
        slideItems = container.children,
        slideCount = slideItems.length,
        breakpointZone,
        windowWidth = getWindowWidth(),
        isOn = false;
    if (responsive) {
      setBreakpointZone();
    }
    if (carousel) {
      container.className += ' tns-vpfix';
    }

    // fixedWidth: viewport > rightBoundary > indexMax
    var autoWidth = options.autoWidth,
        fixedWidth = getOption('fixedWidth'),
        edgePadding = getOption('edgePadding'),
        gutter = getOption('gutter'),
        viewport = getViewportWidth(),
        center = getOption('center'),
        items = !autoWidth ? Math.floor(getOption('items')) : 1,
        slideBy = getOption('slideBy'),
        viewportMax = options.viewportMax || options.fixedWidthViewportWidth,
        arrowKeys = getOption('arrowKeys'),
        speed = getOption('speed'),
        rewind = options.rewind,
        loop = rewind ? false : options.loop,
        autoHeight = getOption('autoHeight'),
        controls = getOption('controls'),
        controlsText = getOption('controlsText'),
        nav = getOption('nav'),
        touch = getOption('touch'),
        mouseDrag = getOption('mouseDrag'),
        autoplay = getOption('autoplay'),
        autoplayTimeout = getOption('autoplayTimeout'),
        autoplayText = getOption('autoplayText'),
        autoplayHoverPause = getOption('autoplayHoverPause'),
        autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'),
        sheet = createStyleSheet(),
        lazyload = options.lazyload,
        lazyloadSelector = options.lazyloadSelector,
        slidePositions,
        // collection of slide positions
    slideItemsOut = [],
        cloneCount = loop ? getCloneCountForLoop() : 0,
        slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2,
        hasRightDeadZone = (fixedWidth || autoWidth) && !loop ? true : false,
        rightBoundary = fixedWidth ? getRightBoundary() : null,
        updateIndexBeforeTransform = !carousel || !loop ? true : false,

    // transform
    transformAttr = horizontal ? 'left' : 'top',
        transformPrefix = '',
        transformPostfix = '',

    // index
    getIndexMax = function () {
      if (fixedWidth) {
        return function () {
          return center && !loop ? slideCount - 1 : Math.ceil(-rightBoundary / (fixedWidth + gutter));
        };
      } else if (autoWidth) {
        return function () {
          for (var i = slideCountNew; i--;) {
            if (slidePositions[i] >= -rightBoundary) {
              return i;
            }
          }
        };
      } else {
        return function () {
          if (center && carousel && !loop) {
            return slideCount - 1;
          } else {
            return loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1;
          }
        };
      }
    }(),
        index = getStartIndex(getOption('startIndex')),
        indexCached = index,
        displayIndex = getCurrentSlide(),
        indexMin = 0,
        indexMax = !autoWidth ? getIndexMax() : null,

    // resize
    resizeTimer,
        preventActionWhenRunning = options.preventActionWhenRunning,
        swipeAngle = options.swipeAngle,
        moveDirectionExpected = swipeAngle ? '?' : true,
        running = false,
        onInit = options.onInit,
        events = new Events(),

    // id, class
    newContainerClasses = ' tns-slider tns-' + options.mode,
        slideId = container.id || getSlideId(),
        disable = getOption('disable'),
        disabled = false,
        freezable = options.freezable,
        freeze = freezable && !autoWidth ? getFreeze() : false,
        frozen = false,
        controlsEvents = {
      'click': onControlsClick,
      'keydown': onControlsKeydown
    },
        navEvents = {
      'click': onNavClick,
      'keydown': onNavKeydown
    },
        hoverEvents = {
      'mouseover': mouseoverPause,
      'mouseout': mouseoutRestart
    },
        visibilityEvent = { 'visibilitychange': onVisibilityChange },
        docmentKeydownEvent = { 'keydown': onDocumentKeydown },
        touchEvents = {
      'touchstart': onPanStart,
      'touchmove': onPanMove,
      'touchend': onPanEnd,
      'touchcancel': onPanEnd
    },
        dragEvents = {
      'mousedown': onPanStart,
      'mousemove': onPanMove,
      'mouseup': onPanEnd,
      'mouseleave': onPanEnd
    },
        hasControls = hasOption('controls'),
        hasNav = hasOption('nav'),
        navAsThumbnails = autoWidth ? true : options.navAsThumbnails,
        hasAutoplay = hasOption('autoplay'),
        hasTouch = hasOption('touch'),
        hasMouseDrag = hasOption('mouseDrag'),
        slideActiveClass = 'tns-slide-active',
        imgCompleteClass = 'tns-complete',
        imgEvents = {
      'load': onImgLoaded,
      'error': onImgFailed
    },
        imgsComplete,
        liveregionCurrent,
        preventScroll = options.preventScrollOnTouch === 'force' ? true : false;

    // controls
    if (hasControls) {
      var controlsContainer = options.controlsContainer,
          controlsContainerHTML = options.controlsContainer ? options.controlsContainer.outerHTML : '',
          prevButton = options.prevButton,
          nextButton = options.nextButton,
          prevButtonHTML = options.prevButton ? options.prevButton.outerHTML : '',
          nextButtonHTML = options.nextButton ? options.nextButton.outerHTML : '',
          prevIsButton,
          nextIsButton;
    }

    // nav
    if (hasNav) {
      var navContainer = options.navContainer,
          navContainerHTML = options.navContainer ? options.navContainer.outerHTML : '',
          navItems,
          pages = autoWidth ? slideCount : getPages(),
          pagesCached = 0,
          navClicked = -1,
          navCurrentIndex = getCurrentNavIndex(),
          navCurrentIndexCached = navCurrentIndex,
          navActiveClass = 'tns-nav-active',
          navStr = 'Carousel Page ',
          navStrCurrent = ' (Current Slide)';
    }

    // autoplay
    if (hasAutoplay) {
      var autoplayDirection = options.autoplayDirection === 'forward' ? 1 : -1,
          autoplayButton = options.autoplayButton,
          autoplayButtonHTML = options.autoplayButton ? options.autoplayButton.outerHTML : '',
          autoplayHtmlStrings = ['<span class=\'tns-visually-hidden\'>', ' animation</span>'],
          autoplayTimer,
          animating,
          autoplayHoverPaused,
          autoplayUserPaused,
          autoplayVisibilityPaused;
    }

    if (hasTouch || hasMouseDrag) {
      var initPosition = {},
          lastPosition = {},
          translateInit,
          disX,
          disY,
          panStart = false,
          rafIndex,
          getDist = horizontal ? function (a, b) {
        return a.x - b.x;
      } : function (a, b) {
        return a.y - b.y;
      };
    }

    // disable slider when slidecount <= items
    if (!autoWidth) {
      resetVariblesWhenDisable(disable || freeze);
    }

    if (TRANSFORM) {
      transformAttr = TRANSFORM;
      transformPrefix = 'translate';

      if (HAS3DTRANSFORMS) {
        transformPrefix += horizontal ? '3d(' : '3d(0px, ';
        transformPostfix = horizontal ? ', 0px, 0px)' : ', 0px)';
      } else {
        transformPrefix += horizontal ? 'X(' : 'Y(';
        transformPostfix = ')';
      }
    }

    if (carousel) {
      container.className = container.className.replace('tns-vpfix', '');
    }
    initStructure();
    initSheet();
    initSliderTransform();

    // === COMMON FUNCTIONS === //
    function resetVariblesWhenDisable(condition) {
      if (condition) {
        controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
      }
    }

    function getCurrentSlide() {
      var tem = carousel ? index - cloneCount : index;
      while (tem < 0) {
        tem += slideCount;
      }
      return tem % slideCount + 1;
    }

    function getStartIndex(ind) {
      ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0;
      return carousel ? ind + cloneCount : ind;
    }

    function getAbsIndex(i) {
      if (i == null) {
        i = index;
      }

      if (carousel) {
        i -= cloneCount;
      }
      while (i < 0) {
        i += slideCount;
      }

      return Math.floor(i % slideCount);
    }

    function getCurrentNavIndex() {
      var absIndex = getAbsIndex(),
          result;

      result = navAsThumbnails ? absIndex : fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) : Math.floor(absIndex / items);

      // set active nav to the last one when reaches the right edge
      if (!loop && carousel && index === indexMax) {
        result = pages - 1;
      }

      return result;
    }

    function getItemsMax() {
      // fixedWidth or autoWidth while viewportMax is not available
      if (autoWidth || fixedWidth && !viewportMax) {
        return slideCount - 1;
        // most cases
      } else {
        var str = fixedWidth ? 'fixedWidth' : 'items',
            arr = [];

        if (fixedWidth || options[str] < slideCount) {
          arr.push(options[str]);
        }

        if (responsive) {
          for (var bp in responsive) {
            var tem = responsive[bp][str];
            if (tem && (fixedWidth || tem < slideCount)) {
              arr.push(tem);
            }
          }
        }

        if (!arr.length) {
          arr.push(0);
        }

        return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
      }
    }

    function getCloneCountForLoop() {
      var itemsMax = getItemsMax(),
          result = carousel ? Math.ceil((itemsMax * 5 - slideCount) / 2) : itemsMax * 4 - slideCount;
      result = Math.max(itemsMax, result);

      return hasOption('edgePadding') ? result + 1 : result;
    }

    function getWindowWidth() {
      return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
    }

    function getInsertPosition(pos) {
      return pos === 'top' ? 'afterbegin' : 'beforeend';
    }

    function getClientWidth(el) {
      var div = doc.createElement('div'),
          rect,
          width;
      el.appendChild(div);
      rect = div.getBoundingClientRect();
      width = rect.right - rect.left;
      div.remove();
      return width || getClientWidth(el.parentNode);
    }

    function getViewportWidth() {
      var gap = edgePadding ? edgePadding * 2 - gutter : 0;
      return getClientWidth(containerParent) - gap;
    }

    function hasOption(item) {
      if (options[item]) {
        return true;
      } else {
        if (responsive) {
          for (var bp in responsive) {
            if (responsive[bp][item]) {
              return true;
            }
          }
        }
        return false;
      }
    }

    // get option:
    // fixed width: viewport, fixedWidth, gutter => items
    // others: window width => all variables
    // all: items => slideBy
    function getOption(item, ww) {
      if (ww == null) {
        ww = windowWidth;
      }

      if (item === 'items' && fixedWidth) {
        return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1;
      } else {
        var result = options[item];

        if (responsive) {
          for (var bp in responsive) {
            // bp: convert string to number
            if (ww >= parseInt(bp)) {
              if (item in responsive[bp]) {
                result = responsive[bp][item];
              }
            }
          }
        }

        if (item === 'slideBy' && result === 'page') {
          result = getOption('items');
        }
        if (!carousel && (item === 'slideBy' || item === 'items')) {
          result = Math.floor(result);
        }

        return result;
      }
    }

    function getSlideMarginLeft(i) {
      return CALC ? CALC + '(' + i * 100 + '% / ' + slideCountNew + ')' : i * 100 / slideCountNew + '%';
    }

    function getInnerWrapperStyles(edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
      var str = '';

      if (edgePaddingTem !== undefined) {
        var gap = edgePaddingTem;
        if (gutterTem) {
          gap -= gutterTem;
        }
        str = horizontal ? 'margin: 0 ' + gap + 'px 0 ' + edgePaddingTem + 'px;' : 'margin: ' + edgePaddingTem + 'px 0 ' + gap + 'px 0;';
      } else if (gutterTem && !fixedWidthTem) {
        var gutterTemUnit = '-' + gutterTem + 'px',
            dir = horizontal ? gutterTemUnit + ' 0 0' : '0 ' + gutterTemUnit + ' 0';
        str = 'margin: 0 ' + dir + ';';
      }

      if (!carousel && autoHeightBP && TRANSITIONDURATION && speedTem) {
        str += getTransitionDurationStyle(speedTem);
      }
      return str;
    }

    function getContainerWidth(fixedWidthTem, gutterTem, itemsTem) {
      if (fixedWidthTem) {
        return (fixedWidthTem + gutterTem) * slideCountNew + 'px';
      } else {
        return CALC ? CALC + '(' + slideCountNew * 100 + '% / ' + itemsTem + ')' : slideCountNew * 100 / itemsTem + '%';
      }
    }

    function getSlideWidthStyle(fixedWidthTem, gutterTem, itemsTem) {
      var width;

      if (fixedWidthTem) {
        width = fixedWidthTem + gutterTem + 'px';
      } else {
        if (!carousel) {
          itemsTem = Math.floor(itemsTem);
        }
        var dividend = carousel ? slideCountNew : itemsTem;
        width = CALC ? CALC + '(100% / ' + dividend + ')' : 100 / dividend + '%';
      }

      width = 'width:' + width;

      // inner slider: overwrite outer slider styles
      return nested !== 'inner' ? width + ';' : width + ' !important;';
    }

    function getSlideGutterStyle(gutterTem) {
      var str = '';

      // gutter maybe interger || 0
      // so can't use 'if (gutter)'
      if (gutterTem !== false) {
        var prop = horizontal ? 'padding-' : 'margin-',
            dir = horizontal ? 'right' : 'bottom';
        str = prop + dir + ': ' + gutterTem + 'px;';
      }

      return str;
    }

    function getCSSPrefix(name, num) {
      var prefix = name.substring(0, name.length - num).toLowerCase();
      if (prefix) {
        prefix = '-' + prefix + '-';
      }

      return prefix;
    }

    function getTransitionDurationStyle(speed) {
      return getCSSPrefix(TRANSITIONDURATION, 18) + 'transition-duration:' + speed / 1000 + 's;';
    }

    function getAnimationDurationStyle(speed) {
      return getCSSPrefix(ANIMATIONDURATION, 17) + 'animation-duration:' + speed / 1000 + 's;';
    }

    function initStructure() {
      var classOuter = 'tns-outer',
          classInner = 'tns-inner',
          hasGutter = hasOption('gutter');

      outerWrapper.className = classOuter;
      innerWrapper.className = classInner;
      outerWrapper.id = slideId + '-ow';
      innerWrapper.id = slideId + '-iw';

      // set container properties
      if (container.id === '') {
        container.id = slideId;
      }
      newContainerClasses += PERCENTAGELAYOUT || autoWidth ? ' tns-subpixel' : ' tns-no-subpixel';
      newContainerClasses += CALC ? ' tns-calc' : ' tns-no-calc';
      if (autoWidth) {
        newContainerClasses += ' tns-autowidth';
      }
      newContainerClasses += ' tns-' + options.axis;
      container.className += newContainerClasses;

      // add constrain layer for carousel
      if (carousel) {
        middleWrapper = doc.createElement('div');
        middleWrapper.id = slideId + '-mw';
        middleWrapper.className = 'tns-ovh';

        outerWrapper.appendChild(middleWrapper);
        middleWrapper.appendChild(innerWrapper);
      } else {
        outerWrapper.appendChild(innerWrapper);
      }

      if (autoHeight) {
        var wp = middleWrapper ? middleWrapper : innerWrapper;
        wp.className += ' tns-ah';
      }

      containerParent.insertBefore(outerWrapper, container);
      innerWrapper.appendChild(container);

      // add id, class, aria attributes 
      // before clone slides
      forEach(slideItems, function (item, i) {
        addClass(item, 'tns-item');
        if (!item.id) {
          item.id = slideId + '-item' + i;
        }
        if (!carousel && animateNormal) {
          addClass(item, animateNormal);
        }
        setAttrs(item, {
          'aria-hidden': 'true',
          'tabindex': '-1'
        });
      });

      // ## clone slides
      // carousel: n + slides + n
      // gallery:      slides + n
      if (cloneCount) {
        var fragmentBefore = doc.createDocumentFragment(),
            fragmentAfter = doc.createDocumentFragment();

        for (var j = cloneCount; j--;) {
          var num = j % slideCount,
              cloneFirst = slideItems[num].cloneNode(true);
          removeAttrs(cloneFirst, 'id');
          fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);

          if (carousel) {
            var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true);
            removeAttrs(cloneLast, 'id');
            fragmentBefore.appendChild(cloneLast);
          }
        }

        container.insertBefore(fragmentBefore, container.firstChild);
        container.appendChild(fragmentAfter);
        slideItems = container.children;
      }
    }

    function initSliderTransform() {
      // ## images loaded/failed
      if (hasOption('autoHeight') || autoWidth || !horizontal) {
        var imgs = container.querySelectorAll('img');

        // add complete class if all images are loaded/failed
        forEach(imgs, function (img) {
          var src = img.src;

          if (src && src.indexOf('data:image') < 0) {
            addEvents(img, imgEvents);
            img.src = '';
            img.src = src;
            addClass(img, 'loading');
          } else if (!lazyload) {
            imgLoaded(img);
          }
        });

        // All imgs are completed
        raf(function () {
          imgsLoadedCheck(arrayFromNodeList(imgs), function () {
            imgsComplete = true;
          });
        });

        // Check imgs in window only for auto height
        if (!autoWidth && horizontal) {
          imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1));
        }

        lazyload ? initSliderTransformStyleCheck() : raf(function () {
          imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck);
        });
      } else {
        // set container transform property
        if (carousel) {
          doContainerTransformSilent();
        }

        // update slider tools and events
        initTools();
        initEvents();
      }
    }

    function initSliderTransformStyleCheck() {
      if (autoWidth) {
        // check styles application
        var num = loop ? index : slideCount - 1;
        (function stylesApplicationCheck() {
          slideItems[num - 1].getBoundingClientRect().right.toFixed(2) === slideItems[num].getBoundingClientRect().left.toFixed(2) ? initSliderTransformCore() : setTimeout(function () {
            stylesApplicationCheck();
          }, 16);
        })();
      } else {
        initSliderTransformCore();
      }
    }

    function initSliderTransformCore() {
      // run Fn()s which are rely on image loading
      if (!horizontal || autoWidth) {
        setSlidePositions();

        if (autoWidth) {
          rightBoundary = getRightBoundary();
          if (freezable) {
            freeze = getFreeze();
          }
          indexMax = getIndexMax(); // <= slidePositions, rightBoundary <=
          resetVariblesWhenDisable(disable || freeze);
        } else {
          updateContentWrapperHeight();
        }
      }

      // set container transform property
      if (carousel) {
        doContainerTransformSilent();
      }

      // update slider tools and events
      initTools();
      initEvents();
    }

    function initSheet() {
      // gallery:
      // set animation classes and left value for gallery slider
      if (!carousel) {
        for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
          var item = slideItems[i];
          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }

      // #### LAYOUT

      // ## INLINE-BLOCK VS FLOAT

      // ## PercentageLayout:
      // slides: inline-block
      // remove blank space between slides by set font-size: 0

      // ## Non PercentageLayout:
      // slides: float
      //         margin-right: -100%
      //         margin-left: ~

      // Resource: https://docs.google.com/spreadsheets/d/147up245wwTXeQYve3BRSAD4oVcvQmuGsFteJOeA5xNQ/edit?usp=sharing
      if (horizontal) {
        if (PERCENTAGELAYOUT || autoWidth) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', 'font-size:' + win.getComputedStyle(slideItems[0]).fontSize + ';', getCssRulesLength(sheet));
          addCSSRule(sheet, '#' + slideId, 'font-size:0;', getCssRulesLength(sheet));
        } else if (carousel) {
          forEach(slideItems, function (slide, i) {
            slide.style.marginLeft = getSlideMarginLeft(i);
          });
        }
      }

      // ## BASIC STYLES
      if (CSSMQ) {
        // middle wrapper style
        if (TRANSITIONDURATION) {
          var str = middleWrapper && options.autoHeight ? getTransitionDurationStyle(options.speed) : '';
          addCSSRule(sheet, '#' + slideId + '-mw', str, getCssRulesLength(sheet));
        }

        // inner wrapper styles
        str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed, options.autoHeight);
        addCSSRule(sheet, '#' + slideId + '-iw', str, getCssRulesLength(sheet));

        // container styles
        if (carousel) {
          str = horizontal && !autoWidth ? 'width:' + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ';' : '';
          if (TRANSITIONDURATION) {
            str += getTransitionDurationStyle(speed);
          }
          addCSSRule(sheet, '#' + slideId, str, getCssRulesLength(sheet));
        }

        // slide styles
        str = horizontal && !autoWidth ? getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) : '';
        if (options.gutter) {
          str += getSlideGutterStyle(options.gutter);
        }
        // set gallery items transition-duration
        if (!carousel) {
          if (TRANSITIONDURATION) {
            str += getTransitionDurationStyle(speed);
          }
          if (ANIMATIONDURATION) {
            str += getAnimationDurationStyle(speed);
          }
        }
        if (str) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
        }

        // non CSS mediaqueries: IE8
        // ## update inner wrapper, container, slides if needed
        // set inline styles for inner wrapper & container
        // insert stylesheet (one line) for slides only (since slides are many)
      } else {
        // middle wrapper styles
        update_carousel_transition_duration();

        // inner wrapper styles
        innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight);

        // container styles
        if (carousel && horizontal && !autoWidth) {
          container.style.width = getContainerWidth(fixedWidth, gutter, items);
        }

        // slide styles
        var str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : '';
        if (gutter) {
          str += getSlideGutterStyle(gutter);
        }

        // append to the last line
        if (str) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
        }
      }

      // ## MEDIAQUERIES
      if (responsive && CSSMQ) {
        for (var bp in responsive) {
          // bp: convert string to number
          bp = parseInt(bp);

          var opts = responsive[bp],
              str = '',
              middleWrapperStr = '',
              innerWrapperStr = '',
              containerStr = '',
              slideStr = '',
              itemsBP = !autoWidth ? getOption('items', bp) : null,
              fixedWidthBP = getOption('fixedWidth', bp),
              speedBP = getOption('speed', bp),
              edgePaddingBP = getOption('edgePadding', bp),
              autoHeightBP = getOption('autoHeight', bp),
              gutterBP = getOption('gutter', bp);

          // middle wrapper string
          if (TRANSITIONDURATION && middleWrapper && getOption('autoHeight', bp) && 'speed' in opts) {
            middleWrapperStr = '#' + slideId + '-mw{' + getTransitionDurationStyle(speedBP) + '}';
          }

          // inner wrapper string
          if ('edgePadding' in opts || 'gutter' in opts) {
            innerWrapperStr = '#' + slideId + '-iw{' + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + '}';
          }

          // container string
          if (carousel && horizontal && !autoWidth && ('fixedWidth' in opts || 'items' in opts || fixedWidth && 'gutter' in opts)) {
            containerStr = 'width:' + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ';';
          }
          if (TRANSITIONDURATION && 'speed' in opts) {
            containerStr += getTransitionDurationStyle(speedBP);
          }
          if (containerStr) {
            containerStr = '#' + slideId + '{' + containerStr + '}';
          }

          // slide string
          if ('fixedWidth' in opts || fixedWidth && 'gutter' in opts || !carousel && 'items' in opts) {
            slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP);
          }
          if ('gutter' in opts) {
            slideStr += getSlideGutterStyle(gutterBP);
          }
          // set gallery items transition-duration
          if (!carousel && 'speed' in opts) {
            if (TRANSITIONDURATION) {
              slideStr += getTransitionDurationStyle(speedBP);
            }
            if (ANIMATIONDURATION) {
              slideStr += getAnimationDurationStyle(speedBP);
            }
          }
          if (slideStr) {
            slideStr = '#' + slideId + ' > .tns-item{' + slideStr + '}';
          }

          // add up
          str = middleWrapperStr + innerWrapperStr + containerStr + slideStr;

          if (str) {
            sheet.insertRule('@media (min-width: ' + bp / 16 + 'em) {' + str + '}', sheet.cssRules.length);
          }
        }
      }
    }

    function initTools() {
      // == slides ==
      updateSlideStatus();

      // == live region ==
      outerWrapper.insertAdjacentHTML('afterbegin', '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + '</span>  of ' + slideCount + '</div>');
      liveregionCurrent = outerWrapper.querySelector('.tns-liveregion .current');

      // == autoplayInit ==
      if (hasAutoplay) {
        var txt = autoplay ? 'stop' : 'start';
        if (autoplayButton) {
          setAttrs(autoplayButton, { 'data-action': txt });
        } else if (options.autoplayButtonOutput) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.autoplayPosition), '<button data-action="' + txt + '">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + '</button>');
          autoplayButton = outerWrapper.querySelector('[data-action]');
        }

        // add event
        if (autoplayButton) {
          addEvents(autoplayButton, { 'click': toggleAutoplay });
        }

        if (autoplay) {
          startAutoplay();
          if (autoplayHoverPause) {
            addEvents(container, hoverEvents);
          }
          if (autoplayResetOnVisibility) {
            addEvents(container, visibilityEvent);
          }
        }
      }

      // == navInit ==
      if (hasNav) {
        var initIndex = !carousel ? 0 : cloneCount;
        // customized nav
        // will not hide the navs in case they're thumbnails
        if (navContainer) {
          setAttrs(navContainer, { 'aria-label': 'Carousel Pagination' });
          navItems = navContainer.children;
          forEach(navItems, function (item, i) {
            setAttrs(item, {
              'data-nav': i,
              'tabindex': '-1',
              'aria-label': navStr + (i + 1),
              'aria-controls': slideId
            });
          });

          // generated nav 
        } else {
          var navHtml = '',
              hiddenStr = navAsThumbnails ? '' : 'style="display:none"';
          for (var i = 0; i < slideCount; i++) {
            // hide nav items by default
            navHtml += '<button data-nav="' + i + '" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) + '"></button>';
          }
          navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + '</div>';
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.navPosition), navHtml);

          navContainer = outerWrapper.querySelector('.tns-nav');
          navItems = navContainer.children;
        }

        updateNavVisibility();

        // add transition
        if (TRANSITIONDURATION) {
          var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(),
              str = 'transition: all ' + speed / 1000 + 's';

          if (prefix) {
            str = '-' + prefix + '-' + str;
          }

          addCSSRule(sheet, '[aria-controls^=' + slideId + '-item]', str, getCssRulesLength(sheet));
        }

        setAttrs(navItems[navCurrentIndex], { 'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent });
        removeAttrs(navItems[navCurrentIndex], 'tabindex');
        addClass(navItems[navCurrentIndex], navActiveClass);

        // add events
        addEvents(navContainer, navEvents);
      }

      // == controlsInit ==
      if (hasControls) {
        if (!controlsContainer && (!prevButton || !nextButton)) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[0] + '</button><button data-controls="next" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[1] + '</button></div>');

          controlsContainer = outerWrapper.querySelector('.tns-controls');
        }

        if (!prevButton || !nextButton) {
          prevButton = controlsContainer.children[0];
          nextButton = controlsContainer.children[1];
        }

        if (options.controlsContainer) {
          setAttrs(controlsContainer, {
            'aria-label': 'Carousel Navigation',
            'tabindex': '0'
          });
        }

        if (options.controlsContainer || options.prevButton && options.nextButton) {
          setAttrs([prevButton, nextButton], {
            'aria-controls': slideId,
            'tabindex': '-1'
          });
        }

        if (options.controlsContainer || options.prevButton && options.nextButton) {
          setAttrs(prevButton, { 'data-controls': 'prev' });
          setAttrs(nextButton, { 'data-controls': 'next' });
        }

        prevIsButton = isButton(prevButton);
        nextIsButton = isButton(nextButton);

        updateControlsStatus();

        // add events
        if (controlsContainer) {
          addEvents(controlsContainer, controlsEvents);
        } else {
          addEvents(prevButton, controlsEvents);
          addEvents(nextButton, controlsEvents);
        }
      }

      // hide tools if needed
      disableUI();
    }

    function initEvents() {
      // add events
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        addEvents(container, eve);
      }

      if (touch) {
        addEvents(container, touchEvents, options.preventScrollOnTouch);
      }
      if (mouseDrag) {
        addEvents(container, dragEvents);
      }
      if (arrowKeys) {
        addEvents(doc, docmentKeydownEvent);
      }

      if (nested === 'inner') {
        events.on('outerResized', function () {
          resizeTasks();
          events.emit('innerLoaded', info());
        });
      } else if (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) {
        addEvents(win, { 'resize': onResize });
      }

      if (autoHeight) {
        if (nested === 'outer') {
          events.on('innerLoaded', doAutoHeight);
        } else if (!disable) {
          doAutoHeight();
        }
      }

      doLazyLoad();
      if (disable) {
        disableSlider();
      } else if (freeze) {
        freezeSlider();
      }

      events.on('indexChanged', additionalUpdates);
      if (nested === 'inner') {
        events.emit('innerLoaded', info());
      }
      if (typeof onInit === 'function') {
        onInit(info());
      }
      isOn = true;
    }

    function destroy() {
      // sheet
      sheet.disabled = true;
      if (sheet.ownerNode) {
        sheet.ownerNode.remove();
      }

      // remove win event listeners
      removeEvents(win, { 'resize': onResize });

      // arrowKeys, controls, nav
      if (arrowKeys) {
        removeEvents(doc, docmentKeydownEvent);
      }
      if (controlsContainer) {
        removeEvents(controlsContainer, controlsEvents);
      }
      if (navContainer) {
        removeEvents(navContainer, navEvents);
      }

      // autoplay
      removeEvents(container, hoverEvents);
      removeEvents(container, visibilityEvent);
      if (autoplayButton) {
        removeEvents(autoplayButton, { 'click': toggleAutoplay });
      }
      if (autoplay) {
        clearInterval(autoplayTimer);
      }

      // container
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        removeEvents(container, eve);
      }
      if (touch) {
        removeEvents(container, touchEvents);
      }
      if (mouseDrag) {
        removeEvents(container, dragEvents);
      }

      // cache Object values in options && reset HTML
      var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML];

      tnsList.forEach(function (item, i) {
        var el = item === 'container' ? outerWrapper : options[item];

        if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object') {
          var prevEl = el.previousElementSibling ? el.previousElementSibling : false,
              parentEl = el.parentNode;
          el.outerHTML = htmlList[i];
          options[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild;
        }
      });

      // reset variables
      tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = resizeTimer = swipeAngle = moveDirectionExpected = running = onInit = events = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = disX = disY = panStart = rafIndex = getDist = touch = mouseDrag = null;
      // check variables
      // [animateIn, animateOut, animateDelay, animateNormal, horizontal, outerWrapper, innerWrapper, container, containerParent, containerHTML, slideItems, slideCount, breakpointZone, windowWidth, autoWidth, fixedWidth, edgePadding, gutter, viewport, items, slideBy, viewportMax, arrowKeys, speed, rewind, loop, autoHeight, sheet, lazyload, slidePositions, slideItemsOut, cloneCount, slideCountNew, hasRightDeadZone, rightBoundary, updateIndexBeforeTransform, transformAttr, transformPrefix, transformPostfix, getIndexMax, index, indexCached, indexMin, indexMax, resizeTimer, swipeAngle, moveDirectionExpected, running, onInit, events, newContainerClasses, slideId, disable, disabled, freezable, freeze, frozen, controlsEvents, navEvents, hoverEvents, visibilityEvent, docmentKeydownEvent, touchEvents, dragEvents, hasControls, hasNav, navAsThumbnails, hasAutoplay, hasTouch, hasMouseDrag, slideActiveClass, imgCompleteClass, imgEvents, imgsComplete, controls, controlsText, controlsContainer, controlsContainerHTML, prevButton, nextButton, prevIsButton, nextIsButton, nav, navContainer, navContainerHTML, navItems, pages, pagesCached, navClicked, navCurrentIndex, navCurrentIndexCached, navActiveClass, navStr, navStrCurrent, autoplay, autoplayTimeout, autoplayDirection, autoplayText, autoplayHoverPause, autoplayButton, autoplayButtonHTML, autoplayResetOnVisibility, autoplayHtmlStrings, autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused, autoplayVisibilityPaused, initPosition, lastPosition, translateInit, disX, disY, panStart, rafIndex, getDist, touch, mouseDrag ].forEach(function(item) { if (item !== null) { console.log(item); } });

      for (var a in this) {
        if (a !== 'rebuild') {
          this[a] = null;
        }
      }
      isOn = false;
    }

    // === ON RESIZE ===
    // responsive || fixedWidth || autoWidth || !horizontal
    function onResize(e) {
      raf(function () {
        resizeTasks(getEvent(e));
      });
    }

    function resizeTasks(e) {
      if (!isOn) {
        return;
      }
      if (nested === 'outer') {
        events.emit('outerResized', info(e));
      }
      windowWidth = getWindowWidth();
      var bpChanged,
          breakpointZoneTem = breakpointZone,
          needContainerTransform = false;

      if (responsive) {
        setBreakpointZone();
        bpChanged = breakpointZoneTem !== breakpointZone;
        // if (hasRightDeadZone) { needContainerTransform = true; } // *?
        if (bpChanged) {
          events.emit('newBreakpointStart', info(e));
        }
      }

      var indChanged,
          itemsChanged,
          itemsTem = items,
          disableTem = disable,
          freezeTem = freeze,
          arrowKeysTem = arrowKeys,
          controlsTem = controls,
          navTem = nav,
          touchTem = touch,
          mouseDragTem = mouseDrag,
          autoplayTem = autoplay,
          autoplayHoverPauseTem = autoplayHoverPause,
          autoplayResetOnVisibilityTem = autoplayResetOnVisibility,
          indexTem = index;

      if (bpChanged) {
        var fixedWidthTem = fixedWidth,
            autoHeightTem = autoHeight,
            controlsTextTem = controlsText,
            centerTem = center,
            autoplayTextTem = autoplayText;

        if (!CSSMQ) {
          var gutterTem = gutter,
              edgePaddingTem = edgePadding;
        }
      }

      // get option:
      // fixed width: viewport, fixedWidth, gutter => items
      // others: window width => all variables
      // all: items => slideBy
      arrowKeys = getOption('arrowKeys');
      controls = getOption('controls');
      nav = getOption('nav');
      touch = getOption('touch');
      center = getOption('center');
      mouseDrag = getOption('mouseDrag');
      autoplay = getOption('autoplay');
      autoplayHoverPause = getOption('autoplayHoverPause');
      autoplayResetOnVisibility = getOption('autoplayResetOnVisibility');

      if (bpChanged) {
        disable = getOption('disable');
        fixedWidth = getOption('fixedWidth');
        speed = getOption('speed');
        autoHeight = getOption('autoHeight');
        controlsText = getOption('controlsText');
        autoplayText = getOption('autoplayText');
        autoplayTimeout = getOption('autoplayTimeout');

        if (!CSSMQ) {
          edgePadding = getOption('edgePadding');
          gutter = getOption('gutter');
        }
      }
      // update options
      resetVariblesWhenDisable(disable);

      viewport = getViewportWidth(); // <= edgePadding, gutter
      if ((!horizontal || autoWidth) && !disable) {
        setSlidePositions();
        if (!horizontal) {
          updateContentWrapperHeight(); // <= setSlidePositions
          needContainerTransform = true;
        }
      }
      if (fixedWidth || autoWidth) {
        rightBoundary = getRightBoundary(); // autoWidth: <= viewport, slidePositions, gutter
        // fixedWidth: <= viewport, fixedWidth, gutter
        indexMax = getIndexMax(); // autoWidth: <= rightBoundary, slidePositions
        // fixedWidth: <= rightBoundary, fixedWidth, gutter
      }

      if (bpChanged || fixedWidth) {
        items = getOption('items');
        slideBy = getOption('slideBy');
        itemsChanged = items !== itemsTem;

        if (itemsChanged) {
          if (!fixedWidth && !autoWidth) {
            indexMax = getIndexMax();
          } // <= items
          // check index before transform in case
          // slider reach the right edge then items become bigger
          updateIndex();
        }
      }

      if (bpChanged) {
        if (disable !== disableTem) {
          if (disable) {
            disableSlider();
          } else {
            enableSlider(); // <= slidePositions, rightBoundary, indexMax
          }
        }
      }

      if (freezable && (bpChanged || fixedWidth || autoWidth)) {
        freeze = getFreeze(); // <= autoWidth: slidePositions, gutter, viewport, rightBoundary
        // <= fixedWidth: fixedWidth, gutter, rightBoundary
        // <= others: items

        if (freeze !== freezeTem) {
          if (freeze) {
            doContainerTransform(getContainerTransformValue(getStartIndex(0)));
            freezeSlider();
          } else {
            unfreezeSlider();
            needContainerTransform = true;
          }
        }
      }

      resetVariblesWhenDisable(disable || freeze); // controls, nav, touch, mouseDrag, arrowKeys, autoplay, autoplayHoverPause, autoplayResetOnVisibility
      if (!autoplay) {
        autoplayHoverPause = autoplayResetOnVisibility = false;
      }

      if (arrowKeys !== arrowKeysTem) {
        arrowKeys ? addEvents(doc, docmentKeydownEvent) : removeEvents(doc, docmentKeydownEvent);
      }
      if (controls !== controlsTem) {
        if (controls) {
          if (controlsContainer) {
            showElement(controlsContainer);
          } else {
            if (prevButton) {
              showElement(prevButton);
            }
            if (nextButton) {
              showElement(nextButton);
            }
          }
        } else {
          if (controlsContainer) {
            hideElement(controlsContainer);
          } else {
            if (prevButton) {
              hideElement(prevButton);
            }
            if (nextButton) {
              hideElement(nextButton);
            }
          }
        }
      }
      if (nav !== navTem) {
        nav ? showElement(navContainer) : hideElement(navContainer);
      }
      if (touch !== touchTem) {
        touch ? addEvents(container, touchEvents, options.preventScrollOnTouch) : removeEvents(container, touchEvents);
      }
      if (mouseDrag !== mouseDragTem) {
        mouseDrag ? addEvents(container, dragEvents) : removeEvents(container, dragEvents);
      }
      if (autoplay !== autoplayTem) {
        if (autoplay) {
          if (autoplayButton) {
            showElement(autoplayButton);
          }
          if (!animating && !autoplayUserPaused) {
            startAutoplay();
          }
        } else {
          if (autoplayButton) {
            hideElement(autoplayButton);
          }
          if (animating) {
            stopAutoplay();
          }
        }
      }
      if (autoplayHoverPause !== autoplayHoverPauseTem) {
        autoplayHoverPause ? addEvents(container, hoverEvents) : removeEvents(container, hoverEvents);
      }
      if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) {
        autoplayResetOnVisibility ? addEvents(doc, visibilityEvent) : removeEvents(doc, visibilityEvent);
      }

      if (bpChanged) {
        if (fixedWidth !== fixedWidthTem || center !== centerTem) {
          needContainerTransform = true;
        }

        if (autoHeight !== autoHeightTem) {
          if (!autoHeight) {
            innerWrapper.style.height = '';
          }
        }

        if (controls && controlsText !== controlsTextTem) {
          prevButton.innerHTML = controlsText[0];
          nextButton.innerHTML = controlsText[1];
        }

        if (autoplayButton && autoplayText !== autoplayTextTem) {
          var i = autoplay ? 1 : 0,
              html = autoplayButton.innerHTML,
              len = html.length - autoplayTextTem[i].length;
          if (html.substring(len) === autoplayTextTem[i]) {
            autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i];
          }
        }
      } else {
        if (center && (fixedWidth || autoWidth)) {
          needContainerTransform = true;
        }
      }

      if (itemsChanged || fixedWidth && !autoWidth) {
        pages = getPages();
        updateNavVisibility();
      }

      indChanged = index !== indexTem;
      if (indChanged) {
        events.emit('indexChanged', info());
        needContainerTransform = true;
      } else if (itemsChanged) {
        if (!indChanged) {
          additionalUpdates();
        }
      } else if (fixedWidth || autoWidth) {
        doLazyLoad();
        updateSlideStatus();
        updateLiveRegion();
      }

      if (itemsChanged && !carousel) {
        updateGallerySlidePositions();
      }

      if (!disable && !freeze) {
        // non-meduaqueries: IE8
        if (bpChanged && !CSSMQ) {
          // middle wrapper styles
          if (autoHeight !== autoheightTem || speed !== speedTem) {
            update_carousel_transition_duration();
          }

          // inner wrapper styles
          if (edgePadding !== edgePaddingTem || gutter !== gutterTem) {
            innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight);
          }

          if (horizontal) {
            // container styles
            if (carousel) {
              container.style.width = getContainerWidth(fixedWidth, gutter, items);
            }

            // slide styles
            var str = getSlideWidthStyle(fixedWidth, gutter, items) + getSlideGutterStyle(gutter);

            // remove the last line and
            // add new styles
            removeCSSRule(sheet, getCssRulesLength(sheet) - 1);
            addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
          }
        }

        // auto height
        if (autoHeight) {
          doAutoHeight();
        }

        if (needContainerTransform) {
          doContainerTransformSilent();
          indexCached = index;
        }
      }

      if (bpChanged) {
        events.emit('newBreakpointEnd', info(e));
      }
    }

    // === INITIALIZATION FUNCTIONS === //
    function getFreeze() {
      if (!fixedWidth && !autoWidth) {
        var a = center ? items - (items - 1) / 2 : items;
        return slideCount <= a;
      }

      var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount],
          vp = edgePadding ? viewport + edgePadding * 2 : viewport + gutter;

      if (center) {
        vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2;
      }

      return width <= vp;
    }

    function setBreakpointZone() {
      breakpointZone = 0;
      for (var bp in responsive) {
        bp = parseInt(bp); // convert string to number
        if (windowWidth >= bp) {
          breakpointZone = bp;
        }
      }
    }

    // (slideBy, indexMin, indexMax) => index
    var updateIndex = function () {
      return loop ? carousel ?
      // loop + carousel
      function () {
        var leftEdge = indexMin,
            rightEdge = indexMax;

        leftEdge += slideBy;
        rightEdge -= slideBy;

        // adjust edges when has edge paddings
        // or fixed-width slider with extra space on the right side
        if (edgePadding) {
          leftEdge += 1;
          rightEdge -= 1;
        } else if (fixedWidth) {
          if ((viewport + gutter) % (fixedWidth + gutter)) {
            rightEdge -= 1;
          }
        }

        if (cloneCount) {
          if (index > rightEdge) {
            index -= slideCount;
          } else if (index < leftEdge) {
            index += slideCount;
          }
        }
      } :
      // loop + gallery
      function () {
        if (index > indexMax) {
          while (index >= indexMin + slideCount) {
            index -= slideCount;
          }
        } else if (index < indexMin) {
          while (index <= indexMax - slideCount) {
            index += slideCount;
          }
        }
      } :
      // non-loop
      function () {
        index = Math.max(indexMin, Math.min(indexMax, index));
      };
    }();

    function disableUI() {
      if (!autoplay && autoplayButton) {
        hideElement(autoplayButton);
      }
      if (!nav && navContainer) {
        hideElement(navContainer);
      }
      if (!controls) {
        if (controlsContainer) {
          hideElement(controlsContainer);
        } else {
          if (prevButton) {
            hideElement(prevButton);
          }
          if (nextButton) {
            hideElement(nextButton);
          }
        }
      }
    }

    function enableUI() {
      if (autoplay && autoplayButton) {
        showElement(autoplayButton);
      }
      if (nav && navContainer) {
        showElement(navContainer);
      }
      if (controls) {
        if (controlsContainer) {
          showElement(controlsContainer);
        } else {
          if (prevButton) {
            showElement(prevButton);
          }
          if (nextButton) {
            showElement(nextButton);
          }
        }
      }
    }

    function freezeSlider() {
      if (frozen) {
        return;
      }

      // remove edge padding from inner wrapper
      if (edgePadding) {
        innerWrapper.style.margin = '0px';
      }

      // add class tns-transparent to cloned slides
      if (cloneCount) {
        var str = 'tns-transparent';
        for (var i = cloneCount; i--;) {
          if (carousel) {
            addClass(slideItems[i], str);
          }
          addClass(slideItems[slideCountNew - i - 1], str);
        }
      }

      // update tools
      disableUI();

      frozen = true;
    }

    function unfreezeSlider() {
      if (!frozen) {
        return;
      }

      // restore edge padding for inner wrapper
      // for mordern browsers
      if (edgePadding && CSSMQ) {
        innerWrapper.style.margin = '';
      }

      // remove class tns-transparent to cloned slides
      if (cloneCount) {
        var str = 'tns-transparent';
        for (var i = cloneCount; i--;) {
          if (carousel) {
            removeClass(slideItems[i], str);
          }
          removeClass(slideItems[slideCountNew - i - 1], str);
        }
      }

      // update tools
      enableUI();

      frozen = false;
    }

    function disableSlider() {
      if (disabled) {
        return;
      }

      sheet.disabled = true;
      container.className = container.className.replace(newContainerClasses.substring(1), '');
      removeAttrs(container, ['style']);
      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            hideElement(slideItems[j]);
          }
          hideElement(slideItems[slideCountNew - j - 1]);
        }
      }

      // vertical slider
      if (!horizontal || !carousel) {
        removeAttrs(innerWrapper, ['style']);
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i];
          removeAttrs(item, ['style']);
          removeClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }

      // update tools
      disableUI();

      disabled = true;
    }

    function enableSlider() {
      if (!disabled) {
        return;
      }

      sheet.disabled = false;
      container.className += newContainerClasses;
      doContainerTransformSilent();

      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            showElement(slideItems[j]);
          }
          showElement(slideItems[slideCountNew - j - 1]);
        }
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i],
              classN = i < index + items ? animateIn : animateNormal;
          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, classN);
        }
      }

      // update tools
      enableUI();

      disabled = false;
    }

    function updateLiveRegion() {
      var str = getLiveRegionStr();
      if (liveregionCurrent.innerHTML !== str) {
        liveregionCurrent.innerHTML = str;
      }
    }

    function getLiveRegionStr() {
      var arr = getVisibleSlideRange(),
          start = arr[0] + 1,
          end = arr[1] + 1;
      return start === end ? start + '' : start + ' to ' + end;
    }

    function getVisibleSlideRange(val) {
      if (val == null) {
        val = getContainerTransformValue();
      }
      var start = index,
          end,
          rangestart,
          rangeend;

      // get range start, range end for autoWidth and fixedWidth
      if (center || edgePadding) {
        if (autoWidth || fixedWidth) {
          rangestart = -(parseFloat(val) + edgePadding);
          rangeend = rangestart + viewport + edgePadding * 2;
        }
      } else {
        if (autoWidth) {
          rangestart = slidePositions[index];
          rangeend = rangestart + viewport;
        }
      }

      // get start, end
      // - check auto width
      if (autoWidth) {
        slidePositions.forEach(function (point, i) {
          if (i < slideCountNew) {
            if ((center || edgePadding) && point <= rangestart + 0.5) {
              start = i;
            }
            if (rangeend - point >= 0.5) {
              end = i;
            }
          }
        });

        // - check percentage width, fixed width
      } else {

        if (fixedWidth) {
          var cell = fixedWidth + gutter;
          if (center || edgePadding) {
            start = Math.floor(rangestart / cell);
            end = Math.ceil(rangeend / cell - 1);
          } else {
            end = start + Math.ceil(viewport / cell) - 1;
          }
        } else {
          if (center || edgePadding) {
            var a = items - 1;
            if (center) {
              start -= a / 2;
              end = index + a / 2;
            } else {
              end = index + a;
            }

            if (edgePadding) {
              var b = edgePadding * items / viewport;
              start -= b;
              end += b;
            }

            start = Math.floor(start);
            end = Math.ceil(end);
          } else {
            end = start + items - 1;
          }
        }

        start = Math.max(start, 0);
        end = Math.min(end, slideCountNew - 1);
      }

      return [start, end];
    }

    function doLazyLoad() {
      if (lazyload && !disable) {
        getImageArray.apply(null, getVisibleSlideRange()).forEach(function (img) {
          if (!hasClass(img, imgCompleteClass)) {
            // stop propagation transitionend event to container
            var eve = {};
            eve[TRANSITIONEND] = function (e) {
              e.stopPropagation();
            };
            addEvents(img, eve);

            addEvents(img, imgEvents);

            // update src
            img.src = getAttr(img, 'data-src');

            // update srcset
            var srcset = getAttr(img, 'data-srcset');
            if (srcset) {
              img.srcset = srcset;
            }

            addClass(img, 'loading');
          }
        });
      }
    }

    function onImgLoaded(e) {
      imgLoaded(getTarget(e));
    }

    function onImgFailed(e) {
      imgFailed(getTarget(e));
    }

    function imgLoaded(img) {
      addClass(img, 'loaded');
      imgCompleted(img);
    }

    function imgFailed(img) {
      addClass(img, 'failed');
      imgCompleted(img);
    }

    function imgCompleted(img) {
      addClass(img, 'tns-complete');
      removeClass(img, 'loading');
      removeEvents(img, imgEvents);
    }

    function getImageArray(start, end) {
      var imgs = [];
      while (start <= end) {
        forEach(slideItems[start].querySelectorAll('img'), function (img) {
          imgs.push(img);
        });
        start++;
      }

      return imgs;
    }

    // check if all visible images are loaded
    // and update container height if it's done
    function doAutoHeight() {
      var imgs = getImageArray.apply(null, getVisibleSlideRange());
      raf(function () {
        imgsLoadedCheck(imgs, updateInnerWrapperHeight);
      });
    }

    function imgsLoadedCheck(imgs, cb) {
      // directly execute callback function if all images are complete
      if (imgsComplete) {
        return cb();
      }

      // check selected image classes otherwise
      imgs.forEach(function (img, index) {
        if (hasClass(img, imgCompleteClass)) {
          imgs.splice(index, 1);
        }
      });

      // execute callback function if selected images are all complete
      if (!imgs.length) {
        return cb();
      }

      // otherwise execute this functiona again
      raf(function () {
        imgsLoadedCheck(imgs, cb);
      });
    }

    function additionalUpdates() {
      doLazyLoad();
      updateSlideStatus();
      updateLiveRegion();
      updateControlsStatus();
      updateNavStatus();
    }

    function update_carousel_transition_duration() {
      if (carousel && autoHeight) {
        middleWrapper.style[TRANSITIONDURATION] = speed / 1000 + 's';
      }
    }

    function getMaxSlideHeight(slideStart, slideRange) {
      var heights = [];
      for (var i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) {
        heights.push(slideItems[i].offsetHeight);
      }

      return Math.max.apply(null, heights);
    }

    // update inner wrapper height
    // 1. get the max-height of the visible slides
    // 2. set transitionDuration to speed
    // 3. update inner wrapper height to max-height
    // 4. set transitionDuration to 0s after transition done
    function updateInnerWrapperHeight() {
      var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount),
          wp = middleWrapper ? middleWrapper : innerWrapper;

      if (wp.style.height !== maxHeight) {
        wp.style.height = maxHeight + 'px';
      }
    }

    // get the distance from the top edge of the first slide to each slide
    // (init) => slidePositions
    function setSlidePositions() {
      slidePositions = [0];
      var attr = horizontal ? 'left' : 'top',
          attr2 = horizontal ? 'right' : 'bottom',
          base = slideItems[0].getBoundingClientRect()[attr];

      forEach(slideItems, function (item, i) {
        // skip the first slide
        if (i) {
          slidePositions.push(item.getBoundingClientRect()[attr] - base);
        }
        // add the end edge
        if (i === slideCountNew - 1) {
          slidePositions.push(item.getBoundingClientRect()[attr2] - base);
        }
      });
    }

    // update slide
    function updateSlideStatus() {
      var range = getVisibleSlideRange(),
          start = range[0],
          end = range[1];

      forEach(slideItems, function (item, i) {
        // show slides
        if (i >= start && i <= end) {
          if (hasAttr(item, 'aria-hidden')) {
            removeAttrs(item, ['aria-hidden', 'tabindex']);
            addClass(item, slideActiveClass);
          }
          // hide slides
        } else {
          if (!hasAttr(item, 'aria-hidden')) {
            setAttrs(item, {
              'aria-hidden': 'true',
              'tabindex': '-1'
            });
            removeClass(item, slideActiveClass);
          }
        }
      });
    }

    // gallery: update slide position
    function updateGallerySlidePositions() {
      var l = index + Math.min(slideCount, items);
      for (var i = slideCountNew; i--;) {
        var item = slideItems[i];

        if (i >= index && i < l) {
          // add transitions to visible slides when adjusting their positions
          addClass(item, 'tns-moving');

          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        } else if (item.style.left) {
          item.style.left = '';
          addClass(item, animateNormal);
          removeClass(item, animateIn);
        }

        // remove outlet animation
        removeClass(item, animateOut);
      }

      // removing '.tns-moving'
      setTimeout(function () {
        forEach(slideItems, function (el) {
          removeClass(el, 'tns-moving');
        });
      }, 300);
    }

    // set tabindex on Nav
    function updateNavStatus() {
      // get current nav
      if (nav) {
        navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex();
        navClicked = -1;

        if (navCurrentIndex !== navCurrentIndexCached) {
          var navPrev = navItems[navCurrentIndexCached],
              navCurrent = navItems[navCurrentIndex];

          setAttrs(navPrev, {
            'tabindex': '-1',
            'aria-label': navStr + (navCurrentIndexCached + 1)
          });
          removeClass(navPrev, navActiveClass);

          setAttrs(navCurrent, { 'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent });
          removeAttrs(navCurrent, 'tabindex');
          addClass(navCurrent, navActiveClass);

          navCurrentIndexCached = navCurrentIndex;
        }
      }
    }

    function getLowerCaseNodeName(el) {
      return el.nodeName.toLowerCase();
    }

    function isButton(el) {
      return getLowerCaseNodeName(el) === 'button';
    }

    function isAriaDisabled(el) {
      return el.getAttribute('aria-disabled') === 'true';
    }

    function disEnableElement(isButton, el, val) {
      if (isButton) {
        el.disabled = val;
      } else {
        el.setAttribute('aria-disabled', val.toString());
      }
    }

    // set 'disabled' to true on controls when reach the edges
    function updateControlsStatus() {
      if (!controls || rewind || loop) {
        return;
      }

      var prevDisabled = prevIsButton ? prevButton.disabled : isAriaDisabled(prevButton),
          nextDisabled = nextIsButton ? nextButton.disabled : isAriaDisabled(nextButton),
          disablePrev = index <= indexMin ? true : false,
          disableNext = !rewind && index >= indexMax ? true : false;

      if (disablePrev && !prevDisabled) {
        disEnableElement(prevIsButton, prevButton, true);
      }
      if (!disablePrev && prevDisabled) {
        disEnableElement(prevIsButton, prevButton, false);
      }
      if (disableNext && !nextDisabled) {
        disEnableElement(nextIsButton, nextButton, true);
      }
      if (!disableNext && nextDisabled) {
        disEnableElement(nextIsButton, nextButton, false);
      }
    }

    // set duration
    function resetDuration(el, str) {
      if (TRANSITIONDURATION) {
        el.style[TRANSITIONDURATION] = str;
      }
    }

    function getSliderWidth() {
      return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew];
    }

    function getCenterGap(num) {
      if (num == null) {
        num = index;
      }

      var gap = edgePadding ? gutter : 0;
      return autoWidth ? (viewport - gap - (slidePositions[num + 1] - slidePositions[num] - gutter)) / 2 : fixedWidth ? (viewport - fixedWidth) / 2 : (items - 1) / 2;
    }

    function getRightBoundary() {
      var gap = edgePadding ? gutter : 0,
          result = viewport + gap - getSliderWidth();

      if (center && !loop) {
        result = fixedWidth ? -(fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() : getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1];
      }
      if (result > 0) {
        result = 0;
      }

      return result;
    }

    function getContainerTransformValue(num) {
      if (num == null) {
        num = index;
      }

      var val;
      if (horizontal && !autoWidth) {
        if (fixedWidth) {
          val = -(fixedWidth + gutter) * num;
          if (center) {
            val += getCenterGap();
          }
        } else {
          var denominator = TRANSFORM ? slideCountNew : items;
          if (center) {
            num -= getCenterGap();
          }
          val = -num * 100 / denominator;
        }
      } else {
        val = -slidePositions[num];
        if (center && autoWidth) {
          val += getCenterGap();
        }
      }

      if (hasRightDeadZone) {
        val = Math.max(val, rightBoundary);
      }

      val += horizontal && !autoWidth && !fixedWidth ? '%' : 'px';

      return val;
    }

    function doContainerTransformSilent(val) {
      resetDuration(container, '0s');
      doContainerTransform(val);
    }

    function doContainerTransform(val) {
      if (val == null) {
        val = getContainerTransformValue();
      }
      container.style[transformAttr] = transformPrefix + val + transformPostfix;
    }

    function animateSlide(number, classOut, classIn, isOut) {
      var l = number + items;
      if (!loop) {
        l = Math.min(l, slideCountNew);
      }

      for (var i = number; i < l; i++) {
        var item = slideItems[i];

        // set item positions
        if (!isOut) {
          item.style.left = (i - index) * 100 / items + '%';
        }

        if (animateDelay && TRANSITIONDELAY) {
          item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1000 + 's';
        }
        removeClass(item, classOut);
        addClass(item, classIn);

        if (isOut) {
          slideItemsOut.push(item);
        }
      }
    }

    // make transfer after click/drag:
    // 1. change 'transform' property for mordern browsers
    // 2. change 'left' property for legacy browsers
    var transformCore = function () {
      return carousel ? function () {
        resetDuration(container, '');
        if (TRANSITIONDURATION || !speed) {
          // for morden browsers with non-zero duration or 
          // zero duration for all browsers
          doContainerTransform();
          // run fallback function manually 
          // when duration is 0 / container is hidden
          if (!speed || !isVisible(container)) {
            onTransitionEnd();
          }
        } else {
          // for old browser with non-zero duration
          jsTransform(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd);
        }

        if (!horizontal) {
          updateContentWrapperHeight();
        }
      } : function () {
        slideItemsOut = [];

        var eve = {};
        eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
        removeEvents(slideItems[indexCached], eve);
        addEvents(slideItems[index], eve);

        animateSlide(indexCached, animateIn, animateOut, true);
        animateSlide(index, animateNormal, animateIn);

        // run fallback function manually 
        // when transition or animation not supported / duration is 0
        if (!TRANSITIONEND || !ANIMATIONEND || !speed || !isVisible(container)) {
          onTransitionEnd();
        }
      };
    }();

    function render(e, sliderMoved) {
      if (updateIndexBeforeTransform) {
        updateIndex();
      }

      // render when slider was moved (touch or drag) even though index may not change
      if (index !== indexCached || sliderMoved) {
        // events
        events.emit('indexChanged', info());
        events.emit('transitionStart', info());
        if (autoHeight) {
          doAutoHeight();
        }

        // pause autoplay when click or keydown from user
        if (animating && e && ['click', 'keydown'].indexOf(e.type) >= 0) {
          stopAutoplay();
        }

        running = true;
        transformCore();
      }
    }

    /*
     * Transfer prefixed properties to the same format
     * CSS: -Webkit-Transform => webkittransform
     * JS: WebkitTransform => webkittransform
     * @param {string} str - property
     *
     */
    function strTrans(str) {
      return str.toLowerCase().replace(/-/g, '');
    }

    // AFTER TRANSFORM
    // Things need to be done after a transfer:
    // 1. check index
    // 2. add classes to visible slide
    // 3. disable controls buttons when reach the first/last slide in non-loop slider
    // 4. update nav status
    // 5. lazyload images
    // 6. update container height
    function onTransitionEnd(event) {
      // check running on gallery mode
      // make sure trantionend/animationend events run only once
      if (carousel || running) {
        events.emit('transitionEnd', info(event));

        if (!carousel && slideItemsOut.length > 0) {
          for (var i = 0; i < slideItemsOut.length; i++) {
            var item = slideItemsOut[i];
            // set item positions
            item.style.left = '';

            if (ANIMATIONDELAY && TRANSITIONDELAY) {
              item.style[ANIMATIONDELAY] = '';
              item.style[TRANSITIONDELAY] = '';
            }
            removeClass(item, animateOut);
            addClass(item, animateNormal);
          }
        }

        /* update slides, nav, controls after checking ...
         * => legacy browsers who don't support 'event' 
         *    have to check event first, otherwise event.target will cause an error 
         * => or 'gallery' mode: 
         *   + event target is slide item
         * => or 'carousel' mode: 
         *   + event target is container, 
         *   + event.property is the same with transform attribute
         */
        if (!event || !carousel && event.target.parentNode === container || event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {

          if (!updateIndexBeforeTransform) {
            var indexTem = index;
            updateIndex();
            if (index !== indexTem) {
              events.emit('indexChanged', info());

              doContainerTransformSilent();
            }
          }

          if (nested === 'inner') {
            events.emit('innerLoaded', info());
          }
          running = false;
          indexCached = index;
        }
      }
    }

    // # ACTIONS
    function goTo(targetIndex, e) {
      if (freeze) {
        return;
      }

      // prev slideBy
      if (targetIndex === 'prev') {
        onControlsClick(e, -1);

        // next slideBy
      } else if (targetIndex === 'next') {
        onControlsClick(e, 1);

        // go to exact slide
      } else {
        if (running) {
          if (preventActionWhenRunning) {
            return;
          } else {
            onTransitionEnd();
          }
        }

        var absIndex = getAbsIndex(),
            indexGap = 0;

        if (targetIndex === 'first') {
          indexGap = -absIndex;
        } else if (targetIndex === 'last') {
          indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex;
        } else {
          if (typeof targetIndex !== 'number') {
            targetIndex = parseInt(targetIndex);
          }

          if (!isNaN(targetIndex)) {
            // from directly called goTo function
            if (!e) {
              targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex));
            }

            indexGap = targetIndex - absIndex;
          }
        }

        // gallery: make sure new page won't overlap with current page
        if (!carousel && indexGap && Math.abs(indexGap) < items) {
          var factor = indexGap > 0 ? 1 : -1;
          indexGap += index + indexGap - slideCount >= indexMin ? slideCount * factor : slideCount * 2 * factor * -1;
        }

        index += indexGap;

        // make sure index is in range
        if (carousel && loop) {
          if (index < indexMin) {
            index += slideCount;
          }
          if (index > indexMax) {
            index -= slideCount;
          }
        }

        // if index is changed, start rendering
        if (getAbsIndex(index) !== getAbsIndex(indexCached)) {
          render(e);
        }
      }
    }

    // on controls click
    function onControlsClick(e, dir) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }
      var passEventObject;

      if (!dir) {
        e = getEvent(e);
        var target = getTarget(e);

        while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) {
          target = target.parentNode;
        }

        var targetIn = [prevButton, nextButton].indexOf(target);
        if (targetIn >= 0) {
          passEventObject = true;
          dir = targetIn === 0 ? -1 : 1;
        }
      }

      if (rewind) {
        if (index === indexMin && dir === -1) {
          goTo('last', e);
          return;
        } else if (index === indexMax && dir === 1) {
          goTo('first', e);
          return;
        }
      }

      if (dir) {
        index += slideBy * dir;
        if (autoWidth) {
          index = Math.floor(index);
        }
        // pass e when click control buttons or keydown
        render(passEventObject || e && e.type === 'keydown' ? e : null);
      }
    }

    // on nav click
    function onNavClick(e) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }

      e = getEvent(e);
      var target = getTarget(e),
          navIndex;

      // find the clicked nav item
      while (target !== navContainer && !hasAttr(target, 'data-nav')) {
        target = target.parentNode;
      }
      if (hasAttr(target, 'data-nav')) {
        var navIndex = navClicked = Number(getAttr(target, 'data-nav')),
            targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items,
            targetIndex = navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1);
        goTo(targetIndex, e);

        if (navCurrentIndex === navIndex) {
          if (animating) {
            stopAutoplay();
          }
          navClicked = -1; // reset navClicked
        }
      }
    }

    // autoplay functions
    function setAutoplayTimer() {
      autoplayTimer = setInterval(function () {
        onControlsClick(null, autoplayDirection);
      }, autoplayTimeout);

      animating = true;
    }

    function stopAutoplayTimer() {
      clearInterval(autoplayTimer);
      animating = false;
    }

    function updateAutoplayButton(action, txt) {
      setAttrs(autoplayButton, { 'data-action': action });
      autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt;
    }

    function startAutoplay() {
      setAutoplayTimer();
      if (autoplayButton) {
        updateAutoplayButton('stop', autoplayText[1]);
      }
    }

    function stopAutoplay() {
      stopAutoplayTimer();
      if (autoplayButton) {
        updateAutoplayButton('start', autoplayText[0]);
      }
    }

    // programaitcally play/pause the slider
    function play() {
      if (autoplay && !animating) {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }
    function pause() {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      }
    }

    function toggleAutoplay() {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      } else {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }

    function onVisibilityChange() {
      if (doc.hidden) {
        if (animating) {
          stopAutoplayTimer();
          autoplayVisibilityPaused = true;
        }
      } else if (autoplayVisibilityPaused) {
        setAutoplayTimer();
        autoplayVisibilityPaused = false;
      }
    }

    function mouseoverPause() {
      if (animating) {
        stopAutoplayTimer();
        autoplayHoverPaused = true;
      }
    }

    function mouseoutRestart() {
      if (autoplayHoverPaused) {
        setAutoplayTimer();
        autoplayHoverPaused = false;
      }
    }

    // keydown events on document 
    function onDocumentKeydown(e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);

      if (keyIndex >= 0) {
        onControlsClick(e, keyIndex === 0 ? -1 : 1);
      }
    }

    // on key control
    function onControlsKeydown(e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);

      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (!prevButton.disabled) {
            onControlsClick(e, -1);
          }
        } else if (!nextButton.disabled) {
          onControlsClick(e, 1);
        }
      }
    }

    // set focus
    function setFocus(el) {
      el.focus();
    }

    // on key nav
    function onNavKeydown(e) {
      e = getEvent(e);
      var curElement = doc.activeElement;
      if (!hasAttr(curElement, 'data-nav')) {
        return;
      }

      // var code = e.keyCode,
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode),
          navIndex = Number(getAttr(curElement, 'data-nav'));

      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (navIndex > 0) {
            setFocus(navItems[navIndex - 1]);
          }
        } else if (keyIndex === 1) {
          if (navIndex < pages - 1) {
            setFocus(navItems[navIndex + 1]);
          }
        } else {
          navClicked = navIndex;
          goTo(navIndex, e);
        }
      }
    }

    function getEvent(e) {
      e = e || win.event;
      return isTouchEvent(e) ? e.changedTouches[0] : e;
    }
    function getTarget(e) {
      return e.target || win.event.srcElement;
    }

    function isTouchEvent(e) {
      return e.type.indexOf('touch') >= 0;
    }

    function preventDefaultBehavior(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }

    function getMoveDirectionExpected() {
      return getTouchDirection(toDegree(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis;
    }

    function onPanStart(e) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }

      if (autoplay && animating) {
        stopAutoplayTimer();
      }

      panStart = true;
      if (rafIndex) {
        caf(rafIndex);
        rafIndex = null;
      }

      var $ = getEvent(e);
      events.emit(isTouchEvent(e) ? 'touchStart' : 'dragStart', info(e));

      if (!isTouchEvent(e) && ['img', 'a'].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) {
        preventDefaultBehavior(e);
      }

      lastPosition.x = initPosition.x = $.clientX;
      lastPosition.y = initPosition.y = $.clientY;
      if (carousel) {
        translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, ''));
        resetDuration(container, '0s');
      }
    }

    function onPanMove(e) {
      if (panStart) {
        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;

        if (carousel) {
          if (!rafIndex) {
            rafIndex = raf(function () {
              panUpdate(e);
            });
          }
        } else {
          if (moveDirectionExpected === '?') {
            moveDirectionExpected = getMoveDirectionExpected();
          }
          if (moveDirectionExpected) {
            preventScroll = true;
          }
        }

        if (preventScroll) {
          e.preventDefault();
        }
      }
    }

    function panUpdate(e) {
      if (!moveDirectionExpected) {
        panStart = false;
        return;
      }
      caf(rafIndex);
      if (panStart) {
        rafIndex = raf(function () {
          panUpdate(e);
        });
      }

      if (moveDirectionExpected === '?') {
        moveDirectionExpected = getMoveDirectionExpected();
      }
      if (moveDirectionExpected) {
        if (!preventScroll && isTouchEvent(e)) {
          preventScroll = true;
        }

        try {
          if (e.type) {
            events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e));
          }
        } catch (err) {}

        var x = translateInit,
            dist = getDist(lastPosition, initPosition);
        if (!horizontal || fixedWidth || autoWidth) {
          x += dist;
          x += 'px';
        } else {
          var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : dist * 100 / (viewport + gutter);
          x += percentageX;
          x += '%';
        }

        container.style[transformAttr] = transformPrefix + x + transformPostfix;
      }
    }

    function onPanEnd(e) {
      if (panStart) {
        if (rafIndex) {
          caf(rafIndex);
          rafIndex = null;
        }
        if (carousel) {
          resetDuration(container, '');
        }
        panStart = false;

        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;
        var dist = getDist(lastPosition, initPosition);

        if (Math.abs(dist)) {
          // drag vs click
          if (!isTouchEvent(e)) {
            // prevent "click"
            var target = getTarget(e);
            addEvents(target, { 'click': function preventClick(e) {
                preventDefaultBehavior(e);
                removeEvents(target, { 'click': preventClick });
              } });
          }

          if (carousel) {
            rafIndex = raf(function () {
              if (horizontal && !autoWidth) {
                var indexMoved = -dist * items / (viewport + gutter);
                indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
                index += indexMoved;
              } else {
                var moved = -(translateInit + dist);
                if (moved <= 0) {
                  index = indexMin;
                } else if (moved >= slidePositions[slideCountNew - 1]) {
                  index = indexMax;
                } else {
                  var i = 0;
                  while (i < slideCountNew && moved >= slidePositions[i]) {
                    index = i;
                    if (moved > slidePositions[i] && dist < 0) {
                      index += 1;
                    }
                    i++;
                  }
                }
              }

              render(e, dist);
              events.emit(isTouchEvent(e) ? 'touchEnd' : 'dragEnd', info(e));
            });
          } else {
            if (moveDirectionExpected) {
              onControlsClick(e, dist > 0 ? -1 : 1);
            }
          }
        }
      }

      // reset
      if (options.preventScrollOnTouch === 'auto') {
        preventScroll = false;
      }
      if (swipeAngle) {
        moveDirectionExpected = '?';
      }
      if (autoplay && !animating) {
        setAutoplayTimer();
      }
    }

    // === RESIZE FUNCTIONS === //
    // (slidePositions, index, items) => vertical_conentWrapper.height
    function updateContentWrapperHeight() {
      var wp = middleWrapper ? middleWrapper : innerWrapper;
      wp.style.height = slidePositions[index + items] - slidePositions[index] + 'px';
    }

    function getPages() {
      var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items;
      return Math.min(Math.ceil(rough), slideCount);
    }

    /*
     * 1. update visible nav items list
     * 2. add "hidden" attributes to previous visible nav items
     * 3. remove "hidden" attrubutes to new visible nav items
     */
    function updateNavVisibility() {
      if (!nav || navAsThumbnails) {
        return;
      }

      if (pages !== pagesCached) {
        var min = pagesCached,
            max = pages,
            fn = showElement;

        if (pagesCached > pages) {
          min = pages;
          max = pagesCached;
          fn = hideElement;
        }

        while (min < max) {
          fn(navItems[min]);
          min++;
        }

        // cache pages
        pagesCached = pages;
      }
    }

    function info(e) {
      return {
        container: container,
        slideItems: slideItems,
        navContainer: navContainer,
        navItems: navItems,
        controlsContainer: controlsContainer,
        hasControls: hasControls,
        prevButton: prevButton,
        nextButton: nextButton,
        items: items,
        slideBy: slideBy,
        cloneCount: cloneCount,
        slideCount: slideCount,
        slideCountNew: slideCountNew,
        index: index,
        indexCached: indexCached,
        displayIndex: getCurrentSlide(),
        navCurrentIndex: navCurrentIndex,
        navCurrentIndexCached: navCurrentIndexCached,
        pages: pages,
        pagesCached: pagesCached,
        sheet: sheet,
        isOn: isOn,
        event: e || {}
      };
    }

    return {
      version: '2.9.2',
      getInfo: info,
      events: events,
      goTo: goTo,
      play: play,
      pause: pause,
      isOn: isOn,
      updateSliderHeight: updateInnerWrapperHeight,
      refresh: initSliderTransform,
      destroy: destroy,
      rebuild: function rebuild() {
        return tns(extend(options, optionsElements));
      }
    };
  };

  return tns;
}();
'use strict';

jQuery(function ($) {
  'use strict';

  // Flexy header

  flexy_header.init();

  // Sidr
  $('.slinky-menu').find('ul, li, a').removeClass();

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImZsZXh5LWhlYWRlci5qcyIsInBhY2UuanMiLCJqcXVlcnkuc2xpbmt5LmpzIiwidGlueS1zbGlkZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiRXJyb3IiLCIkIiwidmVyc2lvbiIsImZuIiwianF1ZXJ5Iiwic3BsaXQiLCJ0cmFuc2l0aW9uRW5kIiwiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0cmFuc0VuZEV2ZW50TmFtZXMiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsIm5hbWUiLCJzdHlsZSIsInVuZGVmaW5lZCIsImVuZCIsImVtdWxhdGVUcmFuc2l0aW9uRW5kIiwiZHVyYXRpb24iLCJjYWxsZWQiLCIkZWwiLCJvbmUiLCJjYWxsYmFjayIsInRyaWdnZXIiLCJzdXBwb3J0Iiwic2V0VGltZW91dCIsImV2ZW50Iiwic3BlY2lhbCIsImJzVHJhbnNpdGlvbkVuZCIsImJpbmRUeXBlIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiZSIsInRhcmdldCIsImlzIiwiaGFuZGxlT2JqIiwiaGFuZGxlciIsImFwcGx5IiwiYXJndW1lbnRzIiwiZGlzbWlzcyIsIkFsZXJ0Iiwib24iLCJjbG9zZSIsIlZFUlNJT04iLCJUUkFOU0lUSU9OX0RVUkFUSU9OIiwicHJvdG90eXBlIiwiJHRoaXMiLCJzZWxlY3RvciIsImF0dHIiLCJyZXBsYWNlIiwiJHBhcmVudCIsImZpbmQiLCJwcmV2ZW50RGVmYXVsdCIsImxlbmd0aCIsImNsb3Nlc3QiLCJFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsInJlbW92ZUNsYXNzIiwicmVtb3ZlRWxlbWVudCIsImRldGFjaCIsInJlbW92ZSIsImhhc0NsYXNzIiwiUGx1Z2luIiwib3B0aW9uIiwiZWFjaCIsImRhdGEiLCJjYWxsIiwib2xkIiwiYWxlcnQiLCJDb25zdHJ1Y3RvciIsIm5vQ29uZmxpY3QiLCJCdXR0b24iLCJlbGVtZW50Iiwib3B0aW9ucyIsIiRlbGVtZW50IiwiZXh0ZW5kIiwiREVGQVVMVFMiLCJpc0xvYWRpbmciLCJsb2FkaW5nVGV4dCIsInNldFN0YXRlIiwic3RhdGUiLCJkIiwidmFsIiwicmVzZXRUZXh0IiwicHJveHkiLCJhZGRDbGFzcyIsInByb3AiLCJyZW1vdmVBdHRyIiwidG9nZ2xlIiwiY2hhbmdlZCIsIiRpbnB1dCIsInRvZ2dsZUNsYXNzIiwiYnV0dG9uIiwiJGJ0biIsImZpcnN0IiwidGVzdCIsInR5cGUiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2VkIiwic2xpZGluZyIsImludGVydmFsIiwiJGFjdGl2ZSIsIiRpdGVtcyIsImtleWJvYXJkIiwia2V5ZG93biIsInBhdXNlIiwiZG9jdW1lbnRFbGVtZW50IiwiY3ljbGUiLCJ3cmFwIiwidGFnTmFtZSIsIndoaWNoIiwicHJldiIsIm5leHQiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJnZXRJdGVtSW5kZXgiLCJpdGVtIiwicGFyZW50IiwiY2hpbGRyZW4iLCJpbmRleCIsImdldEl0ZW1Gb3JEaXJlY3Rpb24iLCJkaXJlY3Rpb24iLCJhY3RpdmUiLCJhY3RpdmVJbmRleCIsIndpbGxXcmFwIiwiZGVsdGEiLCJpdGVtSW5kZXgiLCJlcSIsInRvIiwicG9zIiwidGhhdCIsInNsaWRlIiwiJG5leHQiLCJpc0N5Y2xpbmciLCJyZWxhdGVkVGFyZ2V0Iiwic2xpZGVFdmVudCIsIiRuZXh0SW5kaWNhdG9yIiwic2xpZEV2ZW50Iiwib2Zmc2V0V2lkdGgiLCJqb2luIiwiYWN0aW9uIiwiY2Fyb3VzZWwiLCJjbGlja0hhbmRsZXIiLCJocmVmIiwiJHRhcmdldCIsInNsaWRlSW5kZXgiLCJ3aW5kb3ciLCIkY2Fyb3VzZWwiLCJDb2xsYXBzZSIsIiR0cmlnZ2VyIiwiaWQiLCJ0cmFuc2l0aW9uaW5nIiwiZ2V0UGFyZW50IiwiYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzIiwiZGltZW5zaW9uIiwiaGFzV2lkdGgiLCJzaG93IiwiYWN0aXZlc0RhdGEiLCJhY3RpdmVzIiwic3RhcnRFdmVudCIsImNvbXBsZXRlIiwic2Nyb2xsU2l6ZSIsImNhbWVsQ2FzZSIsImhpZGUiLCJvZmZzZXRIZWlnaHQiLCJpIiwiZ2V0VGFyZ2V0RnJvbVRyaWdnZXIiLCJpc09wZW4iLCJjb2xsYXBzZSIsImJhY2tkcm9wIiwiRHJvcGRvd24iLCJjbGVhck1lbnVzIiwiY29udGFpbnMiLCJpc0FjdGl2ZSIsImluc2VydEFmdGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiZGVzYyIsImRyb3Bkb3duIiwiTW9kYWwiLCIkYm9keSIsImJvZHkiLCIkZGlhbG9nIiwiJGJhY2tkcm9wIiwiaXNTaG93biIsIm9yaWdpbmFsQm9keVBhZCIsInNjcm9sbGJhcldpZHRoIiwiaWdub3JlQmFja2Ryb3BDbGljayIsImZpeGVkQ29udGVudCIsInJlbW90ZSIsImxvYWQiLCJCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiX3JlbGF0ZWRUYXJnZXQiLCJjaGVja1Njcm9sbGJhciIsInNldFNjcm9sbGJhciIsImVzY2FwZSIsInJlc2l6ZSIsImFwcGVuZFRvIiwic2Nyb2xsVG9wIiwiYWRqdXN0RGlhbG9nIiwiZW5mb3JjZUZvY3VzIiwib2ZmIiwiaGlkZU1vZGFsIiwiaGFzIiwiaGFuZGxlVXBkYXRlIiwicmVzZXRBZGp1c3RtZW50cyIsInJlc2V0U2Nyb2xsYmFyIiwicmVtb3ZlQmFja2Ryb3AiLCJhbmltYXRlIiwiZG9BbmltYXRlIiwiY3VycmVudFRhcmdldCIsImZvY3VzIiwiY2FsbGJhY2tSZW1vdmUiLCJtb2RhbElzT3ZlcmZsb3dpbmciLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjc3MiLCJwYWRkaW5nTGVmdCIsImJvZHlJc092ZXJmbG93aW5nIiwicGFkZGluZ1JpZ2h0IiwiZnVsbFdpbmRvd1dpZHRoIiwiaW5uZXJXaWR0aCIsImRvY3VtZW50RWxlbWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyaWdodCIsIk1hdGgiLCJhYnMiLCJsZWZ0IiwiY2xpZW50V2lkdGgiLCJtZWFzdXJlU2Nyb2xsYmFyIiwiYm9keVBhZCIsInBhcnNlSW50IiwiYWN0dWFsUGFkZGluZyIsImNhbGN1bGF0ZWRQYWRkaW5nIiwicGFyc2VGbG9hdCIsInBhZGRpbmciLCJyZW1vdmVEYXRhIiwic2Nyb2xsRGl2IiwiY2xhc3NOYW1lIiwiYXBwZW5kIiwicmVtb3ZlQ2hpbGQiLCJtb2RhbCIsInNob3dFdmVudCIsIkRJU0FMTE9XRURfQVRUUklCVVRFUyIsInVyaUF0dHJzIiwiQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiIsIkRlZmF1bHRXaGl0ZWxpc3QiLCJhIiwiYXJlYSIsImIiLCJiciIsImNvbCIsImNvZGUiLCJkaXYiLCJlbSIsImhyIiwiaDEiLCJoMiIsImgzIiwiaDQiLCJoNSIsImg2IiwiaW1nIiwibGkiLCJvbCIsInAiLCJwcmUiLCJzIiwic21hbGwiLCJzcGFuIiwic3ViIiwic3VwIiwic3Ryb25nIiwidSIsInVsIiwiU0FGRV9VUkxfUEFUVEVSTiIsIkRBVEFfVVJMX1BBVFRFUk4iLCJhbGxvd2VkQXR0cmlidXRlIiwiYWxsb3dlZEF0dHJpYnV0ZUxpc3QiLCJhdHRyTmFtZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJpbkFycmF5IiwiQm9vbGVhbiIsIm5vZGVWYWx1ZSIsIm1hdGNoIiwicmVnRXhwIiwiZmlsdGVyIiwidmFsdWUiLCJSZWdFeHAiLCJsIiwic2FuaXRpemVIdG1sIiwidW5zYWZlSHRtbCIsIndoaXRlTGlzdCIsInNhbml0aXplRm4iLCJpbXBsZW1lbnRhdGlvbiIsImNyZWF0ZUhUTUxEb2N1bWVudCIsImNyZWF0ZWREb2N1bWVudCIsImlubmVySFRNTCIsIndoaXRlbGlzdEtleXMiLCJtYXAiLCJlbGVtZW50cyIsImxlbiIsImVsTmFtZSIsInBhcmVudE5vZGUiLCJhdHRyaWJ1dGVMaXN0IiwiYXR0cmlidXRlcyIsIndoaXRlbGlzdGVkQXR0cmlidXRlcyIsImNvbmNhdCIsImoiLCJsZW4yIiwicmVtb3ZlQXR0cmlidXRlIiwiVG9vbHRpcCIsImVuYWJsZWQiLCJ0aW1lb3V0IiwiaG92ZXJTdGF0ZSIsImluU3RhdGUiLCJpbml0IiwiYW5pbWF0aW9uIiwicGxhY2VtZW50IiwidGVtcGxhdGUiLCJ0aXRsZSIsImRlbGF5IiwiaHRtbCIsImNvbnRhaW5lciIsInZpZXdwb3J0Iiwic2FuaXRpemUiLCJnZXRPcHRpb25zIiwiJHZpZXdwb3J0IiwiaXNGdW5jdGlvbiIsImNsaWNrIiwiaG92ZXIiLCJjb25zdHJ1Y3RvciIsInRyaWdnZXJzIiwiZXZlbnRJbiIsImV2ZW50T3V0IiwiZW50ZXIiLCJsZWF2ZSIsIl9vcHRpb25zIiwiZml4VGl0bGUiLCJnZXREZWZhdWx0cyIsImRhdGFBdHRyaWJ1dGVzIiwiZGF0YUF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImdldERlbGVnYXRlT3B0aW9ucyIsImRlZmF1bHRzIiwia2V5Iiwib2JqIiwic2VsZiIsInRpcCIsImNsZWFyVGltZW91dCIsImlzSW5TdGF0ZVRydWUiLCJoYXNDb250ZW50IiwiaW5Eb20iLCJvd25lckRvY3VtZW50IiwiJHRpcCIsInRpcElkIiwiZ2V0VUlEIiwic2V0Q29udGVudCIsImF1dG9Ub2tlbiIsImF1dG9QbGFjZSIsInRvcCIsImRpc3BsYXkiLCJnZXRQb3NpdGlvbiIsImFjdHVhbFdpZHRoIiwiYWN0dWFsSGVpZ2h0Iiwib3JnUGxhY2VtZW50Iiwidmlld3BvcnREaW0iLCJib3R0b20iLCJ3aWR0aCIsImNhbGN1bGF0ZWRPZmZzZXQiLCJnZXRDYWxjdWxhdGVkT2Zmc2V0IiwiYXBwbHlQbGFjZW1lbnQiLCJwcmV2SG92ZXJTdGF0ZSIsIm9mZnNldCIsImhlaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkxlZnQiLCJpc05hTiIsInNldE9mZnNldCIsInVzaW5nIiwicHJvcHMiLCJyb3VuZCIsImdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YSIsImlzVmVydGljYWwiLCJhcnJvd0RlbHRhIiwiYXJyb3dPZmZzZXRQb3NpdGlvbiIsInJlcGxhY2VBcnJvdyIsImFycm93IiwiZ2V0VGl0bGUiLCJ0ZXh0IiwiJGUiLCJpc0JvZHkiLCJlbFJlY3QiLCJpc1N2ZyIsIlNWR0VsZW1lbnQiLCJlbE9mZnNldCIsInNjcm9sbCIsIm91dGVyRGltcyIsInZpZXdwb3J0UGFkZGluZyIsInZpZXdwb3J0RGltZW5zaW9ucyIsInRvcEVkZ2VPZmZzZXQiLCJib3R0b21FZGdlT2Zmc2V0IiwibGVmdEVkZ2VPZmZzZXQiLCJyaWdodEVkZ2VPZmZzZXQiLCJvIiwicHJlZml4IiwicmFuZG9tIiwiZ2V0RWxlbWVudEJ5SWQiLCIkYXJyb3ciLCJlbmFibGUiLCJkaXNhYmxlIiwidG9nZ2xlRW5hYmxlZCIsImRlc3Ryb3kiLCJ0b29sdGlwIiwiUG9wb3ZlciIsImNvbnRlbnQiLCJnZXRDb250ZW50IiwidHlwZUNvbnRlbnQiLCJwb3BvdmVyIiwiU2Nyb2xsU3B5IiwiJHNjcm9sbEVsZW1lbnQiLCJvZmZzZXRzIiwidGFyZ2V0cyIsImFjdGl2ZVRhcmdldCIsInByb2Nlc3MiLCJyZWZyZXNoIiwiZ2V0U2Nyb2xsSGVpZ2h0IiwibWF4Iiwib2Zmc2V0TWV0aG9kIiwib2Zmc2V0QmFzZSIsImlzV2luZG93IiwiJGhyZWYiLCJzb3J0IiwicHVzaCIsIm1heFNjcm9sbCIsImFjdGl2YXRlIiwiY2xlYXIiLCJwYXJlbnRzIiwicGFyZW50c1VudGlsIiwic2Nyb2xsc3B5IiwiJHNweSIsIlRhYiIsIiR1bCIsIiRwcmV2aW91cyIsImhpZGVFdmVudCIsInRhYiIsIkFmZml4IiwiY2hlY2tQb3NpdGlvbiIsImNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wIiwiYWZmaXhlZCIsInVucGluIiwicGlubmVkT2Zmc2V0IiwiUkVTRVQiLCJnZXRTdGF0ZSIsIm9mZnNldFRvcCIsIm9mZnNldEJvdHRvbSIsInBvc2l0aW9uIiwidGFyZ2V0SGVpZ2h0IiwiaW5pdGlhbGl6aW5nIiwiY29sbGlkZXJUb3AiLCJjb2xsaWRlckhlaWdodCIsImdldFBpbm5lZE9mZnNldCIsImFmZml4IiwiYWZmaXhUeXBlIiwiZmxleHlfaGVhZGVyIiwicHViIiwiJGhlYWRlcl9zdGF0aWMiLCIkaGVhZGVyX3N0aWNreSIsInVwZGF0ZV9pbnRlcnZhbCIsInRvbGVyYW5jZSIsInVwd2FyZCIsImRvd253YXJkIiwiX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20iLCJjbGFzc2VzIiwicGlubmVkIiwidW5waW5uZWQiLCJ3YXNfc2Nyb2xsZWQiLCJsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wIiwicmVnaXN0ZXJFdmVudEhhbmRsZXJzIiwicmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycyIsImRvY3VtZW50X3dhc19zY3JvbGxlZCIsImVsZW1lbnRfaGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJlbGVtZW50X29mZnNldCIsImN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AiLCJBamF4TW9uaXRvciIsIkJhciIsIkRvY3VtZW50TW9uaXRvciIsIkVsZW1lbnRNb25pdG9yIiwiRWxlbWVudFRyYWNrZXIiLCJFdmVudExhZ01vbml0b3IiLCJFdmVudGVkIiwiRXZlbnRzIiwiTm9UYXJnZXRFcnJvciIsIlBhY2UiLCJSZXF1ZXN0SW50ZXJjZXB0IiwiU09VUkNFX0tFWVMiLCJTY2FsZXIiLCJTb2NrZXRSZXF1ZXN0VHJhY2tlciIsIlhIUlJlcXVlc3RUcmFja2VyIiwiYXZnQW1wbGl0dWRlIiwiYmFyIiwiY2FuY2VsQW5pbWF0aW9uIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJkZWZhdWx0T3B0aW9ucyIsImV4dGVuZE5hdGl2ZSIsImdldEZyb21ET00iLCJnZXRJbnRlcmNlcHQiLCJoYW5kbGVQdXNoU3RhdGUiLCJpZ25vcmVTdGFjayIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJlc3VsdCIsInJ1bkFuaW1hdGlvbiIsInNjYWxlcnMiLCJzaG91bGRJZ25vcmVVUkwiLCJzaG91bGRUcmFjayIsInNvdXJjZSIsInNvdXJjZXMiLCJ1bmlTY2FsZXIiLCJfV2ViU29ja2V0IiwiX1hEb21haW5SZXF1ZXN0IiwiX1hNTEh0dHBSZXF1ZXN0IiwiX2kiLCJfaW50ZXJjZXB0IiwiX2xlbiIsIl9wdXNoU3RhdGUiLCJfcmVmIiwiX3JlZjEiLCJfcmVwbGFjZVN0YXRlIiwiX19zbGljZSIsInNsaWNlIiwiX19oYXNQcm9wIiwiX19leHRlbmRzIiwiY2hpbGQiLCJjdG9yIiwiX19zdXBlcl9fIiwiX19pbmRleE9mIiwiaW5kZXhPZiIsImNhdGNodXBUaW1lIiwiaW5pdGlhbFJhdGUiLCJtaW5UaW1lIiwiZ2hvc3RUaW1lIiwibWF4UHJvZ3Jlc3NQZXJGcmFtZSIsImVhc2VGYWN0b3IiLCJzdGFydE9uUGFnZUxvYWQiLCJyZXN0YXJ0T25QdXNoU3RhdGUiLCJyZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIiLCJjaGVja0ludGVydmFsIiwic2VsZWN0b3JzIiwiZXZlbnRMYWciLCJtaW5TYW1wbGVzIiwic2FtcGxlQ291bnQiLCJsYWdUaHJlc2hvbGQiLCJhamF4IiwidHJhY2tNZXRob2RzIiwidHJhY2tXZWJTb2NrZXRzIiwiaWdub3JlVVJMcyIsInBlcmZvcm1hbmNlIiwiRGF0ZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJsYXN0IiwidGljayIsImRpZmYiLCJhcmdzIiwib3V0IiwiYXJyIiwiY291bnQiLCJzdW0iLCJ2IiwianNvbiIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRBdHRyaWJ1dGUiLCJKU09OIiwicGFyc2UiLCJfZXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjdHgiLCJvbmNlIiwiX2Jhc2UiLCJiaW5kaW5ncyIsIl9yZXN1bHRzIiwic3BsaWNlIiwicGFjZU9wdGlvbnMiLCJfc3VwZXIiLCJwcm9ncmVzcyIsImdldEVsZW1lbnQiLCJ0YXJnZXRFbGVtZW50IiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsImFwcGVuZENoaWxkIiwiZmluaXNoIiwidXBkYXRlIiwicHJvZyIsInJlbmRlciIsInByb2dyZXNzU3RyIiwidHJhbnNmb3JtIiwiX2oiLCJfbGVuMSIsIl9yZWYyIiwibGFzdFJlbmRlcmVkUHJvZ3Jlc3MiLCJzZXRBdHRyaWJ1dGUiLCJkb25lIiwiYmluZGluZyIsIlhNTEh0dHBSZXF1ZXN0IiwiWERvbWFpblJlcXVlc3QiLCJXZWJTb2NrZXQiLCJmcm9tIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwiaWdub3JlIiwicmV0IiwidW5zaGlmdCIsInNoaWZ0IiwidHJhY2siLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsIm1vbml0b3JYSFIiLCJfdGhpcyIsInJlcSIsIl9vcGVuIiwib3BlbiIsInVybCIsImFzeW5jIiwicmVxdWVzdCIsImZsYWdzIiwicHJvdG9jb2xzIiwicGF0dGVybiIsIl9hcmciLCJhZnRlciIsInJ1bm5pbmciLCJzdGlsbEFjdGl2ZSIsIl9yZWYzIiwicmVhZHlTdGF0ZSIsInJlc3RhcnQiLCJ3YXRjaCIsInRyYWNrZXIiLCJzaXplIiwiX29ucmVhZHlzdGF0ZWNoYW5nZSIsIlByb2dyZXNzRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZ0IiwibGVuZ3RoQ29tcHV0YWJsZSIsImxvYWRlZCIsInRvdGFsIiwib25yZWFkeXN0YXRlY2hhbmdlIiwiY2hlY2siLCJzdGF0ZXMiLCJsb2FkaW5nIiwiaW50ZXJhY3RpdmUiLCJhdmciLCJwb2ludHMiLCJzYW1wbGVzIiwic2luY2VMYXN0VXBkYXRlIiwicmF0ZSIsImNhdGNodXAiLCJsYXN0UHJvZ3Jlc3MiLCJmcmFtZVRpbWUiLCJzY2FsaW5nIiwicG93IiwibWluIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInJlcGxhY2VTdGF0ZSIsIl9rIiwiX2xlbjIiLCJfcmVmNCIsImV4dHJhU291cmNlcyIsInN0b3AiLCJzdGFydCIsImdvIiwiZW5xdWV1ZU5leHRGcmFtZSIsInJlbWFpbmluZyIsInNjYWxlciIsInNjYWxlckxpc3QiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwidCIsInNsaW5reSIsImxhYmVsIiwic3BlZWQiLCJuIiwiciIsInByZXBlbmQiLCJqdW1wIiwiaG9tZSIsImMiLCJ0bnMiLCJrZXlzIiwib2JqZWN0IiwiRWxlbWVudCIsIndpbiIsInJhZiIsImNiIiwid2luJDEiLCJjYWYiLCJjb3B5IiwiY2hlY2tTdG9yYWdlVmFsdWUiLCJzZXRMb2NhbFN0b3JhZ2UiLCJzdG9yYWdlIiwiYWNjZXNzIiwic2V0SXRlbSIsImdldFNsaWRlSWQiLCJ0bnNJZCIsImdldEJvZHkiLCJkb2MiLCJmYWtlIiwiZG9jRWxlbWVudCIsInNldEZha2VCb2R5IiwiZG9jT3ZlcmZsb3ciLCJvdmVyZmxvdyIsImJhY2tncm91bmQiLCJyZXNldEZha2VCb2R5IiwiY2FsYyIsInN0ciIsInZhbHMiLCJwZXJjZW50YWdlTGF5b3V0Iiwid3JhcHBlciIsIm91dGVyIiwicGVyUGFnZSIsInN1cHBvcnRlZCIsIm1lZGlhcXVlcnlTdXBwb3J0IiwicnVsZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwiY3JlYXRlU3R5bGVTaGVldCIsIm1lZGlhIiwic2hlZXQiLCJhZGRDU1NSdWxlIiwicnVsZXMiLCJpbnNlcnRSdWxlIiwiYWRkUnVsZSIsInJlbW92ZUNTU1J1bGUiLCJkZWxldGVSdWxlIiwicmVtb3ZlUnVsZSIsImdldENzc1J1bGVzTGVuZ3RoIiwiY3NzUnVsZXMiLCJ0b0RlZ3JlZSIsInkiLCJ4IiwiYXRhbjIiLCJQSSIsImdldFRvdWNoRGlyZWN0aW9uIiwiYW5nbGUiLCJyYW5nZSIsImdhcCIsImZvckVhY2giLCJzY29wZSIsImNsYXNzTGlzdFN1cHBvcnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJoYXNBdHRyIiwiaGFzQXR0cmlidXRlIiwiZ2V0QXR0ciIsImlzTm9kZUxpc3QiLCJzZXRBdHRycyIsImVscyIsImF0dHJzIiwiQXJyYXkiLCJ0b1N0cmluZyIsInJlbW92ZUF0dHJzIiwiYXR0ckxlbmd0aCIsImFycmF5RnJvbU5vZGVMaXN0IiwibmwiLCJoaWRlRWxlbWVudCIsImZvcmNlSGlkZSIsInNob3dFbGVtZW50IiwiaXNWaXNpYmxlIiwid2hpY2hQcm9wZXJ0eSIsIlByb3BzIiwiY2hhckF0Iiwic3Vic3RyIiwicHJlZml4ZXMiLCJoYXMzRFRyYW5zZm9ybXMiLCJ0ZiIsImhhczNkIiwiY3NzVEYiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiZ2V0RW5kUHJvcGVydHkiLCJwcm9wSW4iLCJwcm9wT3V0IiwiZW5kUHJvcCIsInN1cHBvcnRzUGFzc2l2ZSIsIm9wdHMiLCJwYXNzaXZlT3B0aW9uIiwicGFzc2l2ZSIsImFkZEV2ZW50cyIsInByZXZlbnRTY3JvbGxpbmciLCJyZW1vdmVFdmVudHMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidG9waWNzIiwiZXZlbnROYW1lIiwiZW1pdCIsImpzVHJhbnNmb3JtIiwicG9zdGZpeCIsInVuaXQiLCJOdW1iZXIiLCJwb3NpdGlvblRpY2siLCJtb3ZlRWxlbWVudCIsIm1vZGUiLCJheGlzIiwiaXRlbXMiLCJndXR0ZXIiLCJlZGdlUGFkZGluZyIsImZpeGVkV2lkdGgiLCJhdXRvV2lkdGgiLCJ2aWV3cG9ydE1heCIsInNsaWRlQnkiLCJjZW50ZXIiLCJjb250cm9scyIsImNvbnRyb2xzUG9zaXRpb24iLCJjb250cm9sc1RleHQiLCJjb250cm9sc0NvbnRhaW5lciIsInByZXZCdXR0b24iLCJuZXh0QnV0dG9uIiwibmF2IiwibmF2UG9zaXRpb24iLCJuYXZDb250YWluZXIiLCJuYXZBc1RodW1ibmFpbHMiLCJhcnJvd0tleXMiLCJhdXRvcGxheSIsImF1dG9wbGF5UG9zaXRpb24iLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheURpcmVjdGlvbiIsImF1dG9wbGF5VGV4dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsImF1dG9wbGF5QnV0dG9uIiwiYXV0b3BsYXlCdXR0b25PdXRwdXQiLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5IiwiYW5pbWF0ZUluIiwiYW5pbWF0ZU91dCIsImFuaW1hdGVOb3JtYWwiLCJhbmltYXRlRGVsYXkiLCJsb29wIiwicmV3aW5kIiwiYXV0b0hlaWdodCIsInJlc3BvbnNpdmUiLCJsYXp5bG9hZCIsImxhenlsb2FkU2VsZWN0b3IiLCJ0b3VjaCIsIm1vdXNlRHJhZyIsInN3aXBlQW5nbGUiLCJuZXN0ZWQiLCJwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmciLCJwcmV2ZW50U2Nyb2xsT25Ub3VjaCIsImZyZWV6YWJsZSIsIm9uSW5pdCIsInVzZUxvY2FsU3RvcmFnZSIsIktFWVMiLCJFTlRFUiIsIlNQQUNFIiwiTEVGVCIsIlJJR0hUIiwidG5zU3RvcmFnZSIsImxvY2FsU3RvcmFnZUFjY2VzcyIsImJyb3dzZXJJbmZvIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidWlkIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJDQUxDIiwiUEVSQ0VOVEFHRUxBWU9VVCIsIkNTU01RIiwiVFJBTlNGT1JNIiwiSEFTM0RUUkFOU0ZPUk1TIiwiVFJBTlNJVElPTkRVUkFUSU9OIiwiVFJBTlNJVElPTkRFTEFZIiwiQU5JTUFUSU9ORFVSQVRJT04iLCJBTklNQVRJT05ERUxBWSIsIlRSQU5TSVRJT05FTkQiLCJBTklNQVRJT05FTkQiLCJzdXBwb3J0Q29uc29sZVdhcm4iLCJ3YXJuIiwidG5zTGlzdCIsIm9wdGlvbnNFbGVtZW50cyIsInJlc3BvbnNpdmVUZW0iLCJ1cGRhdGVPcHRpb25zIiwiaG9yaXpvbnRhbCIsIm91dGVyV3JhcHBlciIsImlubmVyV3JhcHBlciIsIm1pZGRsZVdyYXBwZXIiLCJjb250YWluZXJQYXJlbnQiLCJjb250YWluZXJIVE1MIiwib3V0ZXJIVE1MIiwic2xpZGVJdGVtcyIsInNsaWRlQ291bnQiLCJicmVha3BvaW50Wm9uZSIsIndpbmRvd1dpZHRoIiwiZ2V0V2luZG93V2lkdGgiLCJpc09uIiwic2V0QnJlYWtwb2ludFpvbmUiLCJnZXRPcHRpb24iLCJnZXRWaWV3cG9ydFdpZHRoIiwiZmxvb3IiLCJmaXhlZFdpZHRoVmlld3BvcnRXaWR0aCIsInNsaWRlUG9zaXRpb25zIiwic2xpZGVJdGVtc091dCIsImNsb25lQ291bnQiLCJnZXRDbG9uZUNvdW50Rm9yTG9vcCIsInNsaWRlQ291bnROZXciLCJoYXNSaWdodERlYWRab25lIiwicmlnaHRCb3VuZGFyeSIsImdldFJpZ2h0Qm91bmRhcnkiLCJ1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSIsInRyYW5zZm9ybUF0dHIiLCJ0cmFuc2Zvcm1QcmVmaXgiLCJ0cmFuc2Zvcm1Qb3N0Zml4IiwiZ2V0SW5kZXhNYXgiLCJjZWlsIiwiZ2V0U3RhcnRJbmRleCIsImluZGV4Q2FjaGVkIiwiZGlzcGxheUluZGV4IiwiZ2V0Q3VycmVudFNsaWRlIiwiaW5kZXhNaW4iLCJpbmRleE1heCIsInJlc2l6ZVRpbWVyIiwibW92ZURpcmVjdGlvbkV4cGVjdGVkIiwiZXZlbnRzIiwibmV3Q29udGFpbmVyQ2xhc3NlcyIsInNsaWRlSWQiLCJkaXNhYmxlZCIsImZyZWV6ZSIsImdldEZyZWV6ZSIsImZyb3plbiIsImNvbnRyb2xzRXZlbnRzIiwib25Db250cm9sc0NsaWNrIiwib25Db250cm9sc0tleWRvd24iLCJuYXZFdmVudHMiLCJvbk5hdkNsaWNrIiwib25OYXZLZXlkb3duIiwiaG92ZXJFdmVudHMiLCJtb3VzZW92ZXJQYXVzZSIsIm1vdXNlb3V0UmVzdGFydCIsInZpc2liaWxpdHlFdmVudCIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsImRvY21lbnRLZXlkb3duRXZlbnQiLCJvbkRvY3VtZW50S2V5ZG93biIsInRvdWNoRXZlbnRzIiwib25QYW5TdGFydCIsIm9uUGFuTW92ZSIsIm9uUGFuRW5kIiwiZHJhZ0V2ZW50cyIsImhhc0NvbnRyb2xzIiwiaGFzT3B0aW9uIiwiaGFzTmF2IiwiaGFzQXV0b3BsYXkiLCJoYXNUb3VjaCIsImhhc01vdXNlRHJhZyIsInNsaWRlQWN0aXZlQ2xhc3MiLCJpbWdDb21wbGV0ZUNsYXNzIiwiaW1nRXZlbnRzIiwib25JbWdMb2FkZWQiLCJvbkltZ0ZhaWxlZCIsImltZ3NDb21wbGV0ZSIsImxpdmVyZWdpb25DdXJyZW50IiwicHJldmVudFNjcm9sbCIsImNvbnRyb2xzQ29udGFpbmVySFRNTCIsInByZXZCdXR0b25IVE1MIiwibmV4dEJ1dHRvbkhUTUwiLCJwcmV2SXNCdXR0b24iLCJuZXh0SXNCdXR0b24iLCJuYXZDb250YWluZXJIVE1MIiwibmF2SXRlbXMiLCJwYWdlcyIsImdldFBhZ2VzIiwicGFnZXNDYWNoZWQiLCJuYXZDbGlja2VkIiwibmF2Q3VycmVudEluZGV4IiwiZ2V0Q3VycmVudE5hdkluZGV4IiwibmF2Q3VycmVudEluZGV4Q2FjaGVkIiwibmF2QWN0aXZlQ2xhc3MiLCJuYXZTdHIiLCJuYXZTdHJDdXJyZW50IiwiYXV0b3BsYXlCdXR0b25IVE1MIiwiYXV0b3BsYXlIdG1sU3RyaW5ncyIsImF1dG9wbGF5VGltZXIiLCJhbmltYXRpbmciLCJhdXRvcGxheUhvdmVyUGF1c2VkIiwiYXV0b3BsYXlVc2VyUGF1c2VkIiwiYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkIiwiaW5pdFBvc2l0aW9uIiwibGFzdFBvc2l0aW9uIiwidHJhbnNsYXRlSW5pdCIsImRpc1giLCJkaXNZIiwicGFuU3RhcnQiLCJyYWZJbmRleCIsImdldERpc3QiLCJyZXNldFZhcmlibGVzV2hlbkRpc2FibGUiLCJpbml0U3RydWN0dXJlIiwiaW5pdFNoZWV0IiwiaW5pdFNsaWRlclRyYW5zZm9ybSIsImNvbmRpdGlvbiIsInRlbSIsImluZCIsImdldEFic0luZGV4IiwiYWJzSW5kZXgiLCJnZXRJdGVtc01heCIsImJwIiwiaXRlbXNNYXgiLCJnZXRJbnNlcnRQb3NpdGlvbiIsImdldENsaWVudFdpZHRoIiwicmVjdCIsInd3IiwiZ2V0U2xpZGVNYXJnaW5MZWZ0IiwiZ2V0SW5uZXJXcmFwcGVyU3R5bGVzIiwiZWRnZVBhZGRpbmdUZW0iLCJndXR0ZXJUZW0iLCJmaXhlZFdpZHRoVGVtIiwic3BlZWRUZW0iLCJhdXRvSGVpZ2h0QlAiLCJndXR0ZXJUZW1Vbml0IiwiZGlyIiwiZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUiLCJnZXRDb250YWluZXJXaWR0aCIsIml0ZW1zVGVtIiwiZ2V0U2xpZGVXaWR0aFN0eWxlIiwiZGl2aWRlbmQiLCJnZXRTbGlkZUd1dHRlclN0eWxlIiwiZ2V0Q1NTUHJlZml4IiwibnVtIiwic3Vic3RyaW5nIiwiZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZSIsImNsYXNzT3V0ZXIiLCJjbGFzc0lubmVyIiwiaGFzR3V0dGVyIiwid3AiLCJmcmFnbWVudEJlZm9yZSIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJmcmFnbWVudEFmdGVyIiwiY2xvbmVGaXJzdCIsImNsb25lTm9kZSIsImNsb25lTGFzdCIsImltZ3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwic3JjIiwiaW1nTG9hZGVkIiwiaW1nc0xvYWRlZENoZWNrIiwiZ2V0SW1hZ2VBcnJheSIsImluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrIiwiZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQiLCJpbml0VG9vbHMiLCJpbml0RXZlbnRzIiwic3R5bGVzQXBwbGljYXRpb25DaGVjayIsInRvRml4ZWQiLCJpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSIsInNldFNsaWRlUG9zaXRpb25zIiwidXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQiLCJmb250U2l6ZSIsInVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uIiwibWlkZGxlV3JhcHBlclN0ciIsImlubmVyV3JhcHBlclN0ciIsImNvbnRhaW5lclN0ciIsInNsaWRlU3RyIiwiaXRlbXNCUCIsImZpeGVkV2lkdGhCUCIsInNwZWVkQlAiLCJlZGdlUGFkZGluZ0JQIiwiZ3V0dGVyQlAiLCJ1cGRhdGVTbGlkZVN0YXR1cyIsImluc2VydEFkamFjZW50SFRNTCIsImdldExpdmVSZWdpb25TdHIiLCJ0eHQiLCJ0b2dnbGVBdXRvcGxheSIsInN0YXJ0QXV0b3BsYXkiLCJpbml0SW5kZXgiLCJuYXZIdG1sIiwiaGlkZGVuU3RyIiwidXBkYXRlTmF2VmlzaWJpbGl0eSIsImlzQnV0dG9uIiwidXBkYXRlQ29udHJvbHNTdGF0dXMiLCJkaXNhYmxlVUkiLCJldmUiLCJvblRyYW5zaXRpb25FbmQiLCJyZXNpemVUYXNrcyIsImluZm8iLCJvblJlc2l6ZSIsImRvQXV0b0hlaWdodCIsImRvTGF6eUxvYWQiLCJkaXNhYmxlU2xpZGVyIiwiZnJlZXplU2xpZGVyIiwiYWRkaXRpb25hbFVwZGF0ZXMiLCJvd25lck5vZGUiLCJodG1sTGlzdCIsInByZXZFbCIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJwYXJlbnRFbCIsIm5leHRFbGVtZW50U2libGluZyIsImZpcnN0RWxlbWVudENoaWxkIiwiZ2V0RXZlbnQiLCJicENoYW5nZWQiLCJicmVha3BvaW50Wm9uZVRlbSIsIm5lZWRDb250YWluZXJUcmFuc2Zvcm0iLCJpbmRDaGFuZ2VkIiwiaXRlbXNDaGFuZ2VkIiwiZGlzYWJsZVRlbSIsImZyZWV6ZVRlbSIsImFycm93S2V5c1RlbSIsImNvbnRyb2xzVGVtIiwibmF2VGVtIiwidG91Y2hUZW0iLCJtb3VzZURyYWdUZW0iLCJhdXRvcGxheVRlbSIsImF1dG9wbGF5SG92ZXJQYXVzZVRlbSIsImF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlUZW0iLCJpbmRleFRlbSIsImF1dG9IZWlnaHRUZW0iLCJjb250cm9sc1RleHRUZW0iLCJjZW50ZXJUZW0iLCJhdXRvcGxheVRleHRUZW0iLCJ1cGRhdGVJbmRleCIsImVuYWJsZVNsaWRlciIsImRvQ29udGFpbmVyVHJhbnNmb3JtIiwiZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUiLCJ1bmZyZWV6ZVNsaWRlciIsInN0b3BBdXRvcGxheSIsInVwZGF0ZUxpdmVSZWdpb24iLCJ1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMiLCJhdXRvaGVpZ2h0VGVtIiwidnAiLCJsZWZ0RWRnZSIsInJpZ2h0RWRnZSIsImVuYWJsZVVJIiwibWFyZ2luIiwiY2xhc3NOIiwiZ2V0VmlzaWJsZVNsaWRlUmFuZ2UiLCJyYW5nZXN0YXJ0IiwicmFuZ2VlbmQiLCJwb2ludCIsImNlbGwiLCJzcmNzZXQiLCJnZXRUYXJnZXQiLCJpbWdGYWlsZWQiLCJpbWdDb21wbGV0ZWQiLCJ1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQiLCJ1cGRhdGVOYXZTdGF0dXMiLCJnZXRNYXhTbGlkZUhlaWdodCIsInNsaWRlU3RhcnQiLCJzbGlkZVJhbmdlIiwiaGVpZ2h0cyIsIm1heEhlaWdodCIsImF0dHIyIiwiYmFzZSIsIm5hdlByZXYiLCJuYXZDdXJyZW50IiwiZ2V0TG93ZXJDYXNlTm9kZU5hbWUiLCJpc0FyaWFEaXNhYmxlZCIsImRpc0VuYWJsZUVsZW1lbnQiLCJwcmV2RGlzYWJsZWQiLCJuZXh0RGlzYWJsZWQiLCJkaXNhYmxlUHJldiIsImRpc2FibGVOZXh0IiwicmVzZXREdXJhdGlvbiIsImdldFNsaWRlcldpZHRoIiwiZ2V0Q2VudGVyR2FwIiwiZGVub21pbmF0b3IiLCJhbmltYXRlU2xpZGUiLCJudW1iZXIiLCJjbGFzc091dCIsImNsYXNzSW4iLCJpc091dCIsInRyYW5zZm9ybUNvcmUiLCJzbGlkZXJNb3ZlZCIsInN0clRyYW5zIiwicHJvcGVydHlOYW1lIiwiZ29UbyIsInRhcmdldEluZGV4IiwiaW5kZXhHYXAiLCJmYWN0b3IiLCJwYXNzRXZlbnRPYmplY3QiLCJ0YXJnZXRJbiIsIm5hdkluZGV4IiwidGFyZ2V0SW5kZXhCYXNlIiwic2V0QXV0b3BsYXlUaW1lciIsInN0b3BBdXRvcGxheVRpbWVyIiwidXBkYXRlQXV0b3BsYXlCdXR0b24iLCJwbGF5IiwiaGlkZGVuIiwia2V5SW5kZXgiLCJrZXlDb2RlIiwic2V0Rm9jdXMiLCJjdXJFbGVtZW50IiwiYWN0aXZlRWxlbWVudCIsImlzVG91Y2hFdmVudCIsImNoYW5nZWRUb3VjaGVzIiwic3JjRWxlbWVudCIsInByZXZlbnREZWZhdWx0QmVoYXZpb3IiLCJyZXR1cm5WYWx1ZSIsImdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsImNsaWVudFgiLCJjbGllbnRZIiwicGFuVXBkYXRlIiwiZXJyIiwiZGlzdCIsInBlcmNlbnRhZ2VYIiwicHJldmVudENsaWNrIiwiaW5kZXhNb3ZlZCIsIm1vdmVkIiwicm91Z2giLCJnZXRJbmZvIiwidXBkYXRlU2xpZGVySGVpZ2h0IiwicmVidWlsZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7QUFNQSxJQUFJLE9BQU9BLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsUUFBTSxJQUFJQyxLQUFKLENBQVUseUNBQVYsQ0FBTjtBQUNEOztBQUVELENBQUMsVUFBVUMsQ0FBVixFQUFhO0FBQ1o7O0FBQ0EsTUFBSUMsVUFBVUQsRUFBRUUsRUFBRixDQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0IsR0FBbEIsRUFBdUIsQ0FBdkIsRUFBMEJBLEtBQTFCLENBQWdDLEdBQWhDLENBQWQ7QUFDQSxNQUFLSCxRQUFRLENBQVIsSUFBYSxDQUFiLElBQWtCQSxRQUFRLENBQVIsSUFBYSxDQUFoQyxJQUF1Q0EsUUFBUSxDQUFSLEtBQWMsQ0FBZCxJQUFtQkEsUUFBUSxDQUFSLEtBQWMsQ0FBakMsSUFBc0NBLFFBQVEsQ0FBUixJQUFhLENBQTFGLElBQWlHQSxRQUFRLENBQVIsSUFBYSxDQUFsSCxFQUFzSDtBQUNwSCxVQUFNLElBQUlGLEtBQUosQ0FBVSwyRkFBVixDQUFOO0FBQ0Q7QUFDRixDQU5BLENBTUNELE1BTkQsQ0FBRDs7QUFRQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVFLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsV0FBU0ssYUFBVCxHQUF5QjtBQUN2QixRQUFJQyxLQUFLQyxTQUFTQyxhQUFULENBQXVCLFdBQXZCLENBQVQ7O0FBRUEsUUFBSUMscUJBQXFCO0FBQ3ZCQyx3QkFBbUIscUJBREk7QUFFdkJDLHFCQUFtQixlQUZJO0FBR3ZCQyxtQkFBbUIsK0JBSEk7QUFJdkJDLGtCQUFtQjtBQUpJLEtBQXpCOztBQU9BLFNBQUssSUFBSUMsSUFB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OztBQStuRkEsU0FBT2hNLEdBQVA7QUFDQyxDQXptR1MsRUFBVjs7O0FDQUE1ckIsT0FBTyxVQUFVRSxDQUFWLEVBQWE7QUFDbEI7O0FBRUE7O0FBQ0FrZCxlQUFhcEosSUFBYjs7QUFFQTtBQUNBOVQsSUFBRSxjQUFGLEVBQ0dvRCxJQURILENBQ1EsV0FEUixFQUVHTSxXQUZIOztBQUlBO0FBQ0ExRCxJQUFFLHlCQUFGLEVBQTZCK1osT0FBN0I7QUFDRCxDQWJEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQm9vdHN0cmFwIHYzLjQuMSAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tLylcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuaWYgKHR5cGVvZiBqUXVlcnkgPT09ICd1bmRlZmluZWQnKSB7XG4gIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeScpXG59XG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciB2ZXJzaW9uID0gJC5mbi5qcXVlcnkuc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpXG4gIGlmICgodmVyc2lvblswXSA8IDIgJiYgdmVyc2lvblsxXSA8IDkpIHx8ICh2ZXJzaW9uWzBdID09IDEgJiYgdmVyc2lvblsxXSA9PSA5ICYmIHZlcnNpb25bMl0gPCAxKSB8fCAodmVyc2lvblswXSA+IDMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5IHZlcnNpb24gMS45LjEgb3IgaGlnaGVyLCBidXQgbG93ZXIgdGhhbiB2ZXJzaW9uIDQnKVxuICB9XG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0cmFuc2l0aW9uLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RyYW5zaXRpb25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ1NTIFRSQU5TSVRJT04gU1VQUE9SVCAoU2hvdXRvdXQ6IGh0dHBzOi8vbW9kZXJuaXpyLmNvbS8pXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9vdHN0cmFwJylcblxuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICBXZWJraXRUcmFuc2l0aW9uIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgTW96VHJhbnNpdGlvbiAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgIE9UcmFuc2l0aW9uICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgdHJhbnNpdGlvbiAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH1cblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4geyBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlIC8vIGV4cGxpY2l0IGZvciBpZTggKCAgLl8uKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9ibG9nLmFsZXhtYWNjYXcuY29tL2Nzcy10cmFuc2l0aW9uc1xuICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gICAgdmFyICRlbCA9IHRoaXNcbiAgICAkKHRoaXMpLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkgeyBjYWxsZWQgPSB0cnVlIH0pXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBpZiAoIWNhbGxlZCkgJCgkZWwpLnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKSB9XG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgZHVyYXRpb24pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gICQoZnVuY3Rpb24gKCkge1xuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkVuZCgpXG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm5cblxuICAgICQuZXZlbnQuc3BlY2lhbC5ic1RyYW5zaXRpb25FbmQgPSB7XG4gICAgICBiaW5kVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgZGVsZWdhdGVUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGlzKSkgcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWxlcnQuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWxlcnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUxFUlQgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGRpc21pc3MgPSAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ1xuICB2YXIgQWxlcnQgICA9IGZ1bmN0aW9uIChlbCkge1xuICAgICQoZWwpLm9uKCdjbGljaycsIGRpc21pc3MsIHRoaXMuY2xvc2UpXG4gIH1cblxuICBBbGVydC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBBbGVydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgICA9ICQodGhpcylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHNlbGVjdG9yICAgID0gc2VsZWN0b3IgPT09ICcjJyA/IFtdIDogc2VsZWN0b3JcbiAgICB2YXIgJHBhcmVudCA9ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpXG5cbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAoISRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICAkcGFyZW50ID0gJHRoaXMuY2xvc2VzdCgnLmFsZXJ0JylcbiAgICB9XG5cbiAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2Nsb3NlLmJzLmFsZXJ0JykpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KCkge1xuICAgICAgLy8gZGV0YWNoIGZyb20gcGFyZW50LCBmaXJlIGV2ZW50IHRoZW4gY2xlYW4gdXAgZGF0YVxuICAgICAgJHBhcmVudC5kZXRhY2goKS50cmlnZ2VyKCdjbG9zZWQuYnMuYWxlcnQnKS5yZW1vdmUoKVxuICAgIH1cblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICRwYXJlbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkcGFyZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIHJlbW92ZUVsZW1lbnQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICByZW1vdmVFbGVtZW50KClcbiAgfVxuXG5cbiAgLy8gQUxFUlQgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5hbGVydCcpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWxlcnQnLCAoZGF0YSA9IG5ldyBBbGVydCh0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFsZXJ0XG5cbiAgJC5mbi5hbGVydCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFsZXJ0LkNvbnN0cnVjdG9yID0gQWxlcnRcblxuXG4gIC8vIEFMRVJUIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hbGVydC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWxlcnQgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBTEVSVCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5hbGVydC5kYXRhLWFwaScsIGRpc21pc3MsIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYnV0dG9uLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2J1dHRvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBCVVRUT04gUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEJ1dHRvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSAkLmV4dGVuZCh7fSwgQnV0dG9uLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgfVxuXG4gIEJ1dHRvbi5WRVJTSU9OICA9ICczLjQuMSdcblxuICBCdXR0b24uREVGQVVMVFMgPSB7XG4gICAgbG9hZGluZ1RleHQ6ICdsb2FkaW5nLi4uJ1xuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBkICAgID0gJ2Rpc2FibGVkJ1xuICAgIHZhciAkZWwgID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciB2YWwgID0gJGVsLmlzKCdpbnB1dCcpID8gJ3ZhbCcgOiAnaHRtbCdcbiAgICB2YXIgZGF0YSA9ICRlbC5kYXRhKClcblxuICAgIHN0YXRlICs9ICdUZXh0J1xuXG4gICAgaWYgKGRhdGEucmVzZXRUZXh0ID09IG51bGwpICRlbC5kYXRhKCdyZXNldFRleHQnLCAkZWxbdmFsXSgpKVxuXG4gICAgLy8gcHVzaCB0byBldmVudCBsb29wIHRvIGFsbG93IGZvcm1zIHRvIHN1Ym1pdFxuICAgIHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAkZWxbdmFsXShkYXRhW3N0YXRlXSA9PSBudWxsID8gdGhpcy5vcHRpb25zW3N0YXRlXSA6IGRhdGFbc3RhdGVdKVxuXG4gICAgICBpZiAoc3RhdGUgPT0gJ2xvYWRpbmdUZXh0Jykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcbiAgICAgICAgJGVsLmFkZENsYXNzKGQpLmF0dHIoZCwgZCkucHJvcChkLCB0cnVlKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhkKS5yZW1vdmVBdHRyKGQpLnByb3AoZCwgZmFsc2UpXG4gICAgICB9XG4gICAgfSwgdGhpcyksIDApXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hhbmdlZCA9IHRydWVcbiAgICB2YXIgJHBhcmVudCA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScpXG5cbiAgICBpZiAoJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgIHZhciAkaW5wdXQgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdyYWRpbycpIHtcbiAgICAgICAgaWYgKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICAkcGFyZW50LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIH0gZWxzZSBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgIGlmICgoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgIT09IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICAgIH1cbiAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICBpZiAoY2hhbmdlZCkgJGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1wcmVzc2VkJywgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICB9XG4gIH1cblxuXG4gIC8vIEJVVFRPTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYnV0dG9uJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5idXR0b24nLCAoZGF0YSA9IG5ldyBCdXR0b24odGhpcywgb3B0aW9ucykpKVxuXG4gICAgICBpZiAob3B0aW9uID09ICd0b2dnbGUnKSBkYXRhLnRvZ2dsZSgpXG4gICAgICBlbHNlIGlmIChvcHRpb24pIGRhdGEuc2V0U3RhdGUob3B0aW9uKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5idXR0b25cblxuICAkLmZuLmJ1dHRvbiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmJ1dHRvbi5Db25zdHJ1Y3RvciA9IEJ1dHRvblxuXG5cbiAgLy8gQlVUVE9OIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYnV0dG9uLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5idXR0b24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBCVVRUT04gREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciAkYnRuID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpXG4gICAgICBQbHVnaW4uY2FsbCgkYnRuLCAndG9nZ2xlJylcbiAgICAgIGlmICghKCQoZS50YXJnZXQpLmlzKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0sIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSkge1xuICAgICAgICAvLyBQcmV2ZW50IGRvdWJsZSBjbGljayBvbiByYWRpb3MsIGFuZCB0aGUgZG91YmxlIHNlbGVjdGlvbnMgKHNvIGNhbmNlbGxhdGlvbikgb24gY2hlY2tib3hlc1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgLy8gVGhlIHRhcmdldCBjb21wb25lbnQgc3RpbGwgcmVjZWl2ZSB0aGUgZm9jdXNcbiAgICAgICAgaWYgKCRidG4uaXMoJ2lucHV0LGJ1dHRvbicpKSAkYnRuLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgZWxzZSAkYnRuLmZpbmQoJ2lucHV0OnZpc2libGUsYnV0dG9uOnZpc2libGUnKS5maXJzdCgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH1cbiAgICB9KVxuICAgIC5vbignZm9jdXMuYnMuYnV0dG9uLmRhdGEtYXBpIGJsdXIuYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpLnRvZ2dsZUNsYXNzKCdmb2N1cycsIC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSlcbiAgICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBjYXJvdXNlbC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjYXJvdXNlbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENBUk9VU0VMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRpbmRpY2F0b3JzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuY2Fyb3VzZWwtaW5kaWNhdG9ycycpXG4gICAgdGhpcy5vcHRpb25zICAgICA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdXNlZCAgICAgID0gbnVsbFxuICAgIHRoaXMuc2xpZGluZyAgICAgPSBudWxsXG4gICAgdGhpcy5pbnRlcnZhbCAgICA9IG51bGxcbiAgICB0aGlzLiRhY3RpdmUgICAgID0gbnVsbFxuICAgIHRoaXMuJGl0ZW1zICAgICAgPSBudWxsXG5cbiAgICB0aGlzLm9wdGlvbnMua2V5Ym9hcmQgJiYgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSlcblxuICAgIHRoaXMub3B0aW9ucy5wYXVzZSA9PSAnaG92ZXInICYmICEoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSAmJiB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ21vdXNlZW50ZXIuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMucGF1c2UsIHRoaXMpKVxuICAgICAgLm9uKCdtb3VzZWxlYXZlLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcbiAgfVxuXG4gIENhcm91c2VsLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04gPSA2MDBcblxuICBDYXJvdXNlbC5ERUZBVUxUUyA9IHtcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBwYXVzZTogJ2hvdmVyJyxcbiAgICB3cmFwOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgY2FzZSAzNzogdGhpcy5wcmV2KCk7IGJyZWFrXG4gICAgICBjYXNlIDM5OiB0aGlzLm5leHQoKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVyblxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmN5Y2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IGZhbHNlKVxuXG4gICAgdGhpcy5pbnRlcnZhbCAmJiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWxcbiAgICAgICYmICF0aGlzLnBhdXNlZFxuICAgICAgJiYgKHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgkLnByb3h5KHRoaXMubmV4dCwgdGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdGhpcy4kaXRlbXMgPSBpdGVtLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbScpXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmluZGV4KGl0ZW0gfHwgdGhpcy4kYWN0aXZlKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhY3RpdmUpIHtcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChhY3RpdmUpXG4gICAgdmFyIHdpbGxXcmFwID0gKGRpcmVjdGlvbiA9PSAncHJldicgJiYgYWN0aXZlSW5kZXggPT09IDApXG4gICAgICAgICAgICAgICAgfHwgKGRpcmVjdGlvbiA9PSAnbmV4dCcgJiYgYWN0aXZlSW5kZXggPT0gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpKVxuICAgIGlmICh3aWxsV3JhcCAmJiAhdGhpcy5vcHRpb25zLndyYXApIHJldHVybiBhY3RpdmVcbiAgICB2YXIgZGVsdGEgPSBkaXJlY3Rpb24gPT0gJ3ByZXYnID8gLTEgOiAxXG4gICAgdmFyIGl0ZW1JbmRleCA9IChhY3RpdmVJbmRleCArIGRlbHRhKSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5lcShpdGVtSW5kZXgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgdmFyIHRoYXQgICAgICAgID0gdGhpc1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJykpXG5cbiAgICBpZiAocG9zID4gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpIHx8IHBvcyA8IDApIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2xpZGluZykgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQub25lKCdzbGlkLmJzLmNhcm91c2VsJywgZnVuY3Rpb24gKCkgeyB0aGF0LnRvKHBvcykgfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmIChhY3RpdmVJbmRleCA9PSBwb3MpIHJldHVybiB0aGlzLnBhdXNlKCkuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUocG9zID4gYWN0aXZlSW5kZXggPyAnbmV4dCcgOiAncHJldicsIHRoaXMuJGl0ZW1zLmVxKHBvcykpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gdHJ1ZSlcblxuICAgIGlmICh0aGlzLiRlbGVtZW50LmZpbmQoJy5uZXh0LCAucHJldicpLmxlbmd0aCAmJiAkLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZClcbiAgICAgIHRoaXMuY3ljbGUodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmludGVydmFsID0gY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCduZXh0JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5zbGlkZSA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XG4gICAgdmFyICRhY3RpdmUgICA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJylcbiAgICB2YXIgJG5leHQgICAgID0gbmV4dCB8fCB0aGlzLmdldEl0ZW1Gb3JEaXJlY3Rpb24odHlwZSwgJGFjdGl2ZSlcbiAgICB2YXIgaXNDeWNsaW5nID0gdGhpcy5pbnRlcnZhbFxuICAgIHZhciBkaXJlY3Rpb24gPSB0eXBlID09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB2YXIgdGhhdCAgICAgID0gdGhpc1xuXG4gICAgaWYgKCRuZXh0Lmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuICh0aGlzLnNsaWRpbmcgPSBmYWxzZSlcblxuICAgIHZhciByZWxhdGVkVGFyZ2V0ID0gJG5leHRbMF1cbiAgICB2YXIgc2xpZGVFdmVudCA9ICQuRXZlbnQoJ3NsaWRlLmJzLmNhcm91c2VsJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCxcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgfSlcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZGVFdmVudClcbiAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLnNsaWRpbmcgPSB0cnVlXG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5wYXVzZSgpXG5cbiAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJGluZGljYXRvcnMuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgdmFyICRuZXh0SW5kaWNhdG9yID0gJCh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgoJG5leHQpXSlcbiAgICAgICRuZXh0SW5kaWNhdG9yICYmICRuZXh0SW5kaWNhdG9yLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KCdzbGlkLmJzLmNhcm91c2VsJywgeyByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKCQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3NsaWRlJykpIHtcbiAgICAgICRuZXh0LmFkZENsYXNzKHR5cGUpXG4gICAgICBpZiAodHlwZW9mICRuZXh0ID09PSAnb2JqZWN0JyAmJiAkbmV4dC5sZW5ndGgpIHtcbiAgICAgICAgJG5leHRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG4gICAgICAkYWN0aXZlLmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICRuZXh0LmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRuZXh0LnJlbW92ZUNsYXNzKFt0eXBlLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcyhbJ2FjdGl2ZScsIGRpcmVjdGlvbl0uam9pbignICcpKVxuICAgICAgICAgIHRoYXQuc2xpZGluZyA9IGZhbHNlXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgICAgICAgIH0sIDApXG4gICAgICAgIH0pXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgIH0gZWxzZSB7XG4gICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB0aGlzLnNsaWRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcbiAgICB9XG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDQVJPVVNFTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jYXJvdXNlbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDYXJvdXNlbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcbiAgICAgIHZhciBhY3Rpb24gID0gdHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyA/IG9wdGlvbiA6IG9wdGlvbnMuc2xpZGVcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jYXJvdXNlbCcsIChkYXRhID0gbmV3IENhcm91c2VsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdudW1iZXInKSBkYXRhLnRvKG9wdGlvbilcbiAgICAgIGVsc2UgaWYgKGFjdGlvbikgZGF0YVthY3Rpb25dKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuaW50ZXJ2YWwpIGRhdGEucGF1c2UoKS5jeWNsZSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmNhcm91c2VsXG5cbiAgJC5mbi5jYXJvdXNlbCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmNhcm91c2VsLkNvbnN0cnVjdG9yID0gQ2Fyb3VzZWxcblxuXG4gIC8vIENBUk9VU0VMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5jYXJvdXNlbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY2Fyb3VzZWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDQVJPVVNFTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgIHZhciBocmVmICAgID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgaWYgKGhyZWYpIHtcbiAgICAgIGhyZWYgPSBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgdmFyIHRhcmdldCAgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IGhyZWZcbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuXG4gICAgaWYgKCEkdGFyZ2V0Lmhhc0NsYXNzKCdjYXJvdXNlbCcpKSByZXR1cm5cblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG4gICAgdmFyIHNsaWRlSW5kZXggPSAkdGhpcy5hdHRyKCdkYXRhLXNsaWRlLXRvJylcbiAgICBpZiAoc2xpZGVJbmRleCkgb3B0aW9ucy5pbnRlcnZhbCA9IGZhbHNlXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb25zKVxuXG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICR0YXJnZXQuZGF0YSgnYnMuY2Fyb3VzZWwnKS50byhzbGlkZUluZGV4KVxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlLXRvXScsIGNsaWNrSGFuZGxlcilcblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGNhcm91c2VsID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJGNhcm91c2VsLCAkY2Fyb3VzZWwuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNvbGxhcHNlLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2NvbGxhcHNlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBqc2hpbnQgbGF0ZWRlZjogZmFsc2UgKi9cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDT0xMQVBTRSBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDb2xsYXBzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLiR0cmlnZ2VyICAgICAgPSAkKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnICsgZWxlbWVudC5pZCArICdcIl0nKVxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IG51bGxcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucGFyZW50KSB7XG4gICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuJGVsZW1lbnQsIHRoaXMuJHRyaWdnZXIpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy50b2dnbGUpIHRoaXMudG9nZ2xlKClcbiAgfVxuXG4gIENvbGxhcHNlLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzNTBcblxuICBDb2xsYXBzZS5ERUZBVUxUUyA9IHtcbiAgICB0b2dnbGU6IHRydWVcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5kaW1lbnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc1dpZHRoID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnd2lkdGgnKVxuICAgIHJldHVybiBoYXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0J1xuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBhY3RpdmVzRGF0YVxuICAgIHZhciBhY3RpdmVzID0gdGhpcy4kcGFyZW50ICYmIHRoaXMuJHBhcmVudC5jaGlsZHJlbignLnBhbmVsJykuY2hpbGRyZW4oJy5pbiwgLmNvbGxhcHNpbmcnKVxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZXNEYXRhID0gYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICBpZiAoYWN0aXZlc0RhdGEgJiYgYWN0aXZlc0RhdGEudHJhbnNpdGlvbmluZykgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgUGx1Z2luLmNhbGwoYWN0aXZlcywgJ2hpZGUnKVxuICAgICAgYWN0aXZlc0RhdGEgfHwgYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScsIG51bGwpXG4gICAgfVxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UnKVxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylbZGltZW5zaW9uXSgwKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlIGluJylbZGltZW5zaW9uXSgnJylcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnRyaWdnZXIoJ3Nob3duLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdmFyIHNjcm9sbFNpemUgPSAkLmNhbWVsQ2FzZShbJ3Njcm9sbCcsIGRpbWVuc2lvbl0uam9pbignLScpKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50WzBdW3Njcm9sbFNpemVdKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKCkpWzBdLm9mZnNldEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgW2RpbWVuc2lvbl0oMClcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXNbdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSA/ICdoaWRlJyA6ICdzaG93J10oKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMucGFyZW50KVxuICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyArIHRoaXMub3B0aW9ucy5wYXJlbnQgKyAnXCJdJylcbiAgICAgIC5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhnZXRUYXJnZXRGcm9tVHJpZ2dlcigkZWxlbWVudCksICRlbGVtZW50KVxuICAgICAgfSwgdGhpcykpXG4gICAgICAuZW5kKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICR0cmlnZ2VyKSB7XG4gICAgdmFyIGlzT3BlbiA9ICRlbGVtZW50Lmhhc0NsYXNzKCdpbicpXG5cbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICAgICR0cmlnZ2VyXG4gICAgICAudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcsICFpc09wZW4pXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRhcmdldEZyb21UcmlnZ2VyKCR0cmlnZ2VyKSB7XG4gICAgdmFyIGhyZWZcbiAgICB2YXIgdGFyZ2V0ID0gJHRyaWdnZXIuYXR0cignZGF0YS10YXJnZXQnKVxuICAgICAgfHwgKGhyZWYgPSAkdHJpZ2dlci5hdHRyKCdocmVmJykpICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSAmJiBvcHRpb25zLnRvZ2dsZSAmJiAvc2hvd3xoaWRlLy50ZXN0KG9wdGlvbikpIG9wdGlvbnMudG9nZ2xlID0gZmFsc2VcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnLCAoZGF0YSA9IG5ldyBDb2xsYXBzZSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY29sbGFwc2VcblxuICAkLmZuLmNvbGxhcHNlICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY29sbGFwc2UuQ29uc3RydWN0b3IgPSBDb2xsYXBzZVxuXG5cbiAgLy8gQ09MTEFQU0UgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jb2xsYXBzZSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmNvbGxhcHNlLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcblxuICAgIGlmICghJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB2YXIgJHRhcmdldCA9IGdldFRhcmdldEZyb21UcmlnZ2VyKCR0aGlzKVxuICAgIHZhciBkYXRhICAgID0gJHRhcmdldC5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgdmFyIG9wdGlvbiAgPSBkYXRhID8gJ3RvZ2dsZScgOiAkdGhpcy5kYXRhKClcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbilcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogZHJvcGRvd24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jZHJvcGRvd25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRFJPUERPV04gQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGJhY2tkcm9wID0gJy5kcm9wZG93bi1iYWNrZHJvcCdcbiAgdmFyIHRvZ2dsZSAgID0gJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJ1xuICB2YXIgRHJvcGRvd24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkub24oJ2NsaWNrLmJzLmRyb3Bkb3duJywgdGhpcy50b2dnbGUpXG4gIH1cblxuICBEcm9wZG93bi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIGZ1bmN0aW9uIGdldFBhcmVudCgkdGhpcykge1xuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIC8jW0EtWmEtel0vLnRlc3Qoc2VsZWN0b3IpICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgdmFyICRwYXJlbnQgPSBzZWxlY3RvciAhPT0gJyMnID8gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcikgOiBudWxsXG5cbiAgICByZXR1cm4gJHBhcmVudCAmJiAkcGFyZW50Lmxlbmd0aCA/ICRwYXJlbnQgOiAkdGhpcy5wYXJlbnQoKVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNZW51cyhlKSB7XG4gICAgaWYgKGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuXG4gICAgJChiYWNrZHJvcCkucmVtb3ZlKClcbiAgICAkKHRvZ2dsZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICAgICAgICA9ICQodGhpcylcbiAgICAgIHZhciAkcGFyZW50ICAgICAgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuXG4gICAgICBpZiAoISRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlICYmIGUudHlwZSA9PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucygkcGFyZW50WzBdLCBlLnRhcmdldCkpIHJldHVyblxuXG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2hpZGUuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcbiAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCQuRXZlbnQoJ2hpZGRlbi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH0pXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgY2xlYXJNZW51cygpXG5cbiAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICEkcGFyZW50LmNsb3Nlc3QoJy5uYXZiYXItbmF2JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIG1vYmlsZSB3ZSB1c2UgYSBiYWNrZHJvcCBiZWNhdXNlIGNsaWNrIGV2ZW50cyBkb24ndCBkZWxlZ2F0ZVxuICAgICAgICAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tYmFja2Ryb3AnKVxuICAgICAgICAgIC5pbnNlcnRBZnRlcigkKHRoaXMpKVxuICAgICAgICAgIC5vbignY2xpY2snLCBjbGVhck1lbnVzKVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ3Nob3cuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpc1xuICAgICAgICAudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcblxuICAgICAgJHBhcmVudFxuICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAudHJpZ2dlcigkLkV2ZW50KCdzaG93bi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghLygzOHw0MHwyN3wzMikvLnRlc3QoZS53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBlLndoaWNoICE9IDI3IHx8IGlzQWN0aXZlICYmIGUud2hpY2ggPT0gMjcpIHtcbiAgICAgIGlmIChlLndoaWNoID09IDI3KSAkcGFyZW50LmZpbmQodG9nZ2xlKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICByZXR1cm4gJHRoaXMudHJpZ2dlcignY2xpY2snKVxuICAgIH1cblxuICAgIHZhciBkZXNjID0gJyBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGEnXG4gICAgdmFyICRpdGVtcyA9ICRwYXJlbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnICsgZGVzYylcblxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICB2YXIgaW5kZXggPSAkaXRlbXMuaW5kZXgoZS50YXJnZXQpXG5cbiAgICBpZiAoZS53aGljaCA9PSAzOCAmJiBpbmRleCA+IDApICAgICAgICAgICAgICAgICBpbmRleC0tICAgICAgICAgLy8gdXBcbiAgICBpZiAoZS53aGljaCA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgLy8gZG93blxuICAgIGlmICghfmluZGV4KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuXG4gICAgJGl0ZW1zLmVxKGluZGV4KS50cmlnZ2VyKCdmb2N1cycpXG4gIH1cblxuXG4gIC8vIERST1BET1dOIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5kcm9wZG93blxuXG4gICQuZm4uZHJvcGRvd24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3RvciA9IERyb3Bkb3duXG5cblxuICAvLyBEUk9QRE9XTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duIGZvcm0nLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24tbWVudScsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBtb2RhbC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNtb2RhbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBNT0RBTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgTW9kYWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLiRib2R5ID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kZGlhbG9nID0gdGhpcy4kZWxlbWVudC5maW5kKCcubW9kYWwtZGlhbG9nJylcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgICB0aGlzLmlzU2hvd24gPSBudWxsXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IDBcbiAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgIHRoaXMuZml4ZWRDb250ZW50ID0gJy5uYXZiYXItZml4ZWQtdG9wLCAubmF2YmFyLWZpeGVkLWJvdHRvbSdcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3RlKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5maW5kKCcubW9kYWwtY29udGVudCcpXG4gICAgICAgIC5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsICQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignbG9hZGVkLmJzLm1vZGFsJylcbiAgICAgICAgfSwgdGhpcykpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwuVkVSU0lPTiA9ICczLjQuMSdcblxuICBNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzAwXG4gIE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBNb2RhbC5ERUZBVUxUUyA9IHtcbiAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICBzaG93OiB0cnVlXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICh0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSB0cnVlXG5cbiAgICB0aGlzLmNoZWNrU2Nyb2xsYmFyKClcbiAgICB0aGlzLnNldFNjcm9sbGJhcigpXG4gICAgdGhpcy4kYm9keS5hZGRDbGFzcygnbW9kYWwtb3BlbicpXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLCAkLnByb3h5KHRoaXMuaGlkZSwgdGhpcykpXG5cbiAgICB0aGlzLiRkaWFsb2cub24oJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vbmUoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGF0LiRlbGVtZW50KSkgdGhhdC5pZ25vcmVCYWNrZHJvcENsaWNrID0gdHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoYXQuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICBpZiAoIXRoYXQuJGVsZW1lbnQucGFyZW50KCkubGVuZ3RoKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnQuYXBwZW5kVG8odGhhdC4kYm9keSkgLy8gZG9uJ3QgbW92ZSBtb2RhbHMgZG9tIHBvc2l0aW9uXG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgLnNob3coKVxuICAgICAgICAuc2Nyb2xsVG9wKDApXG5cbiAgICAgIHRoYXQuYWRqdXN0RGlhbG9nKClcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICB0aGF0LmVuZm9yY2VGb2N1cygpXG5cbiAgICAgIHZhciBlID0gJC5FdmVudCgnc2hvd24uYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICAgIHRyYW5zaXRpb24gP1xuICAgICAgICB0aGF0LiRkaWFsb2cgLy8gd2FpdCBmb3IgbW9kYWwgdG8gc2xpZGUgaW5cbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGUgPSAkLkV2ZW50KCdoaWRlLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKCF0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSBmYWxzZVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgICQoZG9jdW1lbnQpLm9mZignZm9jdXNpbi5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2luJylcbiAgICAgIC5vZmYoJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnKVxuICAgICAgLm9mZignbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGRpYWxvZy5vZmYoJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkodGhpcy5oaWRlTW9kYWwsIHRoaXMpKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgdGhpcy5oaWRlTW9kYWwoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVuZm9yY2VGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KVxuICAgICAgLm9mZignZm9jdXNpbi5icy5tb2RhbCcpIC8vIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxuICAgICAgLm9uKCdmb2N1c2luLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQgIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgdGhpcy4kZWxlbWVudFswXSAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICAhdGhpcy4kZWxlbWVudC5oYXMoZS50YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lc2NhcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMua2V5Ym9hcmQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS53aGljaCA9PSAyNyAmJiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24pIHtcbiAgICAgICQod2luZG93KS5vbigncmVzaXplLmJzLm1vZGFsJywgJC5wcm94eSh0aGlzLmhhbmRsZVVwZGF0ZSwgdGhpcykpXG4gICAgfSBlbHNlIHtcbiAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZS5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB0aGlzLiRlbGVtZW50LmhpZGUoKVxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kYm9keS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpXG4gICAgICB0aGF0LnJlc2V0QWRqdXN0bWVudHMoKVxuICAgICAgdGhhdC5yZXNldFNjcm9sbGJhcigpXG4gICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2hpZGRlbi5icy5tb2RhbCcpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRiYWNrZHJvcCAmJiB0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmJhY2tkcm9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGFuaW1hdGUgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgPyAnZmFkZScgOiAnJ1xuXG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMuYmFja2Ryb3ApIHtcbiAgICAgIHZhciBkb0FuaW1hdGUgPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiBhbmltYXRlXG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgLmFkZENsYXNzKCdtb2RhbC1iYWNrZHJvcCAnICsgYW5pbWF0ZSlcbiAgICAgICAgLmFwcGVuZFRvKHRoaXMuJGJvZHkpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2spIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm5cbiAgICAgICAgdGhpcy5vcHRpb25zLmJhY2tkcm9wID09ICdzdGF0aWMnXG4gICAgICAgICAgPyB0aGlzLiRlbGVtZW50WzBdLmZvY3VzKClcbiAgICAgICAgICA6IHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcblxuICAgICAgaWYgKGRvQW5pbWF0ZSkgdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wLmFkZENsYXNzKCdpbicpXG5cbiAgICAgIGlmICghY2FsbGJhY2spIHJldHVyblxuXG4gICAgICBkb0FuaW1hdGUgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrKClcblxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93biAmJiB0aGlzLiRiYWNrZHJvcCkge1xuICAgICAgdGhpcy4kYmFja2Ryb3AucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICAgdmFyIGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnJlbW92ZUJhY2tkcm9wKClcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfVxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFja1JlbW92ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFja1JlbW92ZSgpXG5cbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgLy8gdGhlc2UgZm9sbG93aW5nIG1ldGhvZHMgYXJlIHVzZWQgdG8gaGFuZGxlIG92ZXJmbG93aW5nIG1vZGFsc1xuXG4gIE1vZGFsLnByb3RvdHlwZS5oYW5kbGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGp1c3REaWFsb2coKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmFkanVzdERpYWxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kYWxJc092ZXJmbG93aW5nID0gdGhpcy4kZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogIXRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiB0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmICFtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuY2hlY2tTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZ1bGxXaW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgaWYgKCFmdWxsV2luZG93V2lkdGgpIHsgLy8gd29ya2Fyb3VuZCBmb3IgbWlzc2luZyB3aW5kb3cuaW5uZXJXaWR0aCBpbiBJRThcbiAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBmdWxsV2luZG93V2lkdGggPSBkb2N1bWVudEVsZW1lbnRSZWN0LnJpZ2h0IC0gTWF0aC5hYnMoZG9jdW1lbnRFbGVtZW50UmVjdC5sZWZ0KVxuICAgIH1cbiAgICB0aGlzLmJvZHlJc092ZXJmbG93aW5nID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaW5kb3dXaWR0aFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLm1lYXN1cmVTY3JvbGxiYXIoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm9keVBhZCA9IHBhcnNlSW50KCh0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcpIHx8IDApLCAxMClcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0IHx8ICcnXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gdGhpcy5zY3JvbGxiYXJXaWR0aFxuICAgIGlmICh0aGlzLmJvZHlJc092ZXJmbG93aW5nKSB7XG4gICAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIGJvZHlQYWQgKyBzY3JvbGxiYXJXaWR0aClcbiAgICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhY3R1YWxQYWRkaW5nID0gZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHRcbiAgICAgICAgdmFyIGNhbGN1bGF0ZWRQYWRkaW5nID0gJChlbGVtZW50KS5jc3MoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgLmRhdGEoJ3BhZGRpbmctcmlnaHQnLCBhY3R1YWxQYWRkaW5nKVxuICAgICAgICAgIC5jc3MoJ3BhZGRpbmctcmlnaHQnLCBwYXJzZUZsb2F0KGNhbGN1bGF0ZWRQYWRkaW5nKSArIHNjcm9sbGJhcldpZHRoICsgJ3B4JylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgdGhpcy5vcmlnaW5hbEJvZHlQYWQpXG4gICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgIHZhciBwYWRkaW5nID0gJChlbGVtZW50KS5kYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlRGF0YSgncGFkZGluZy1yaWdodCcpXG4gICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHBhZGRpbmcgPyBwYWRkaW5nIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7IC8vIHRoeCB3YWxzaFxuICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSAnbW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmUnXG4gICAgdGhpcy4kYm9keS5hcHBlbmQoc2Nyb2xsRGl2KVxuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aFxuICAgIHRoaXMuJGJvZHlbMF0ucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KVxuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aFxuICB9XG5cblxuICAvLyBNT0RBTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24sIF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2JzLm1vZGFsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIE1vZGFsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLm1vZGFsJywgKGRhdGEgPSBuZXcgTW9kYWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXShfcmVsYXRlZFRhcmdldClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuc2hvdykgZGF0YS5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5tb2RhbFxuXG4gICQuZm4ubW9kYWwgPSBQbHVnaW5cbiAgJC5mbi5tb2RhbC5Db25zdHJ1Y3RvciA9IE1vZGFsXG5cblxuICAvLyBNT0RBTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ubW9kYWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLm1vZGFsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gTU9EQUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMubW9kYWwuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICB2YXIgaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIHZhciB0YXJnZXQgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8XG4gICAgICAoaHJlZiAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSkgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcbiAgICB2YXIgb3B0aW9uID0gJHRhcmdldC5kYXRhKCdicy5tb2RhbCcpID8gJ3RvZ2dsZScgOiAkLmV4dGVuZCh7IHJlbW90ZTogIS8jLy50ZXN0KGhyZWYpICYmIGhyZWYgfSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcblxuICAgIGlmICgkdGhpcy5pcygnYScpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICR0YXJnZXQub25lKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKHNob3dFdmVudCkge1xuICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuIC8vIG9ubHkgcmVnaXN0ZXIgZm9jdXMgcmVzdG9yZXIgaWYgbW9kYWwgd2lsbCBhY3R1YWxseSBnZXQgc2hvd25cbiAgICAgICR0YXJnZXQub25lKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aGlzLmlzKCc6dmlzaWJsZScpICYmICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH0pXG4gICAgfSlcbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24sIHRoaXMpXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRvb2x0aXAuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdG9vbHRpcFxuICogSW5zcGlyZWQgYnkgdGhlIG9yaWdpbmFsIGpRdWVyeS50aXBzeSBieSBKYXNvbiBGcmFtZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgRElTQUxMT1dFRF9BVFRSSUJVVEVTID0gWydzYW5pdGl6ZScsICd3aGl0ZUxpc3QnLCAnc2FuaXRpemVGbiddXG5cbiAgdmFyIHVyaUF0dHJzID0gW1xuICAgICdiYWNrZ3JvdW5kJyxcbiAgICAnY2l0ZScsXG4gICAgJ2hyZWYnLFxuICAgICdpdGVtdHlwZScsXG4gICAgJ2xvbmdkZXNjJyxcbiAgICAncG9zdGVyJyxcbiAgICAnc3JjJyxcbiAgICAneGxpbms6aHJlZidcbiAgXVxuXG4gIHZhciBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2lcblxuICB2YXIgRGVmYXVsdFdoaXRlbGlzdCA9IHtcbiAgICAvLyBHbG9iYWwgYXR0cmlidXRlcyBhbGxvd2VkIG9uIGFueSBzdXBwbGllZCBlbGVtZW50IGJlbG93LlxuICAgICcqJzogWydjbGFzcycsICdkaXInLCAnaWQnLCAnbGFuZycsICdyb2xlJywgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTl0sXG4gICAgYTogWyd0YXJnZXQnLCAnaHJlZicsICd0aXRsZScsICdyZWwnXSxcbiAgICBhcmVhOiBbXSxcbiAgICBiOiBbXSxcbiAgICBicjogW10sXG4gICAgY29sOiBbXSxcbiAgICBjb2RlOiBbXSxcbiAgICBkaXY6IFtdLFxuICAgIGVtOiBbXSxcbiAgICBocjogW10sXG4gICAgaDE6IFtdLFxuICAgIGgyOiBbXSxcbiAgICBoMzogW10sXG4gICAgaDQ6IFtdLFxuICAgIGg1OiBbXSxcbiAgICBoNjogW10sXG4gICAgaTogW10sXG4gICAgaW1nOiBbJ3NyYycsICdhbHQnLCAndGl0bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10sXG4gICAgbGk6IFtdLFxuICAgIG9sOiBbXSxcbiAgICBwOiBbXSxcbiAgICBwcmU6IFtdLFxuICAgIHM6IFtdLFxuICAgIHNtYWxsOiBbXSxcbiAgICBzcGFuOiBbXSxcbiAgICBzdWI6IFtdLFxuICAgIHN1cDogW10sXG4gICAgc3Ryb25nOiBbXSxcbiAgICB1OiBbXSxcbiAgICB1bDogW11cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHBhdHRlcm4gdGhhdCByZWNvZ25pemVzIGEgY29tbW9ubHkgdXNlZnVsIHN1YnNldCBvZiBVUkxzIHRoYXQgYXJlIHNhZmUuXG4gICAqXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcbiAgICovXG4gIHZhciBTQUZFX1VSTF9QQVRURVJOID0gL14oPzooPzpodHRwcz98bWFpbHRvfGZ0cHx0ZWx8ZmlsZSk6fFteJjovPyNdKig/OlsvPyNdfCQpKS9naVxuXG4gIC8qKlxuICAgKiBBIHBhdHRlcm4gdGhhdCBtYXRjaGVzIHNhZmUgZGF0YSBVUkxzLiBPbmx5IG1hdGNoZXMgaW1hZ2UsIHZpZGVvIGFuZCBhdWRpbyB0eXBlcy5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIERBVEFfVVJMX1BBVFRFUk4gPSAvXmRhdGE6KD86aW1hZ2VcXC8oPzpibXB8Z2lmfGpwZWd8anBnfHBuZ3x0aWZmfHdlYnApfHZpZGVvXFwvKD86bXBlZ3xtcDR8b2dnfHdlYm0pfGF1ZGlvXFwvKD86bXAzfG9nYXxvZ2d8b3B1cykpO2Jhc2U2NCxbYS16MC05Ky9dKz0qJC9pXG5cbiAgZnVuY3Rpb24gYWxsb3dlZEF0dHJpYnV0ZShhdHRyLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkge1xuICAgIHZhciBhdHRyTmFtZSA9IGF0dHIubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpICE9PSAtMSkge1xuICAgICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgdXJpQXR0cnMpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbihhdHRyLm5vZGVWYWx1ZS5tYXRjaChTQUZFX1VSTF9QQVRURVJOKSB8fCBhdHRyLm5vZGVWYWx1ZS5tYXRjaChEQVRBX1VSTF9QQVRURVJOKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICB2YXIgcmVnRXhwID0gJChhbGxvd2VkQXR0cmlidXRlTGlzdCkuZmlsdGVyKGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgIH0pXG5cbiAgICAvLyBDaGVjayBpZiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB2YWxpZGF0ZXMgdGhlIGF0dHJpYnV0ZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZ0V4cC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhdHRyTmFtZS5tYXRjaChyZWdFeHBbaV0pKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgd2hpdGVMaXN0LCBzYW5pdGl6ZUZuKSB7XG4gICAgaWYgKHVuc2FmZUh0bWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5zYWZlSHRtbFxuICAgIH1cblxuICAgIGlmIChzYW5pdGl6ZUZuICYmIHR5cGVvZiBzYW5pdGl6ZUZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gc2FuaXRpemVGbih1bnNhZmVIdG1sKVxuICAgIH1cblxuICAgIC8vIElFIDggYW5kIGJlbG93IGRvbid0IHN1cHBvcnQgY3JlYXRlSFRNTERvY3VtZW50XG4gICAgaWYgKCFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbiB8fCAhZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gdW5zYWZlSHRtbFxuICAgIH1cblxuICAgIHZhciBjcmVhdGVkRG9jdW1lbnQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ3Nhbml0aXphdGlvbicpXG4gICAgY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gdW5zYWZlSHRtbFxuXG4gICAgdmFyIHdoaXRlbGlzdEtleXMgPSAkLm1hcCh3aGl0ZUxpc3QsIGZ1bmN0aW9uIChlbCwgaSkgeyByZXR1cm4gaSB9KVxuICAgIHZhciBlbGVtZW50cyA9ICQoY3JlYXRlZERvY3VtZW50LmJvZHkpLmZpbmQoJyonKVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXVxuICAgICAgdmFyIGVsTmFtZSA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgaWYgKCQuaW5BcnJheShlbE5hbWUsIHdoaXRlbGlzdEtleXMpID09PSAtMSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHZhciBhdHRyaWJ1dGVMaXN0ID0gJC5tYXAoZWwuYXR0cmlidXRlcywgZnVuY3Rpb24gKGVsKSB7IHJldHVybiBlbCB9KVxuICAgICAgdmFyIHdoaXRlbGlzdGVkQXR0cmlidXRlcyA9IFtdLmNvbmNhdCh3aGl0ZUxpc3RbJyonXSB8fCBbXSwgd2hpdGVMaXN0W2VsTmFtZV0gfHwgW10pXG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBsZW4yID0gYXR0cmlidXRlTGlzdC5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgaWYgKCFhbGxvd2VkQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0sIHdoaXRlbGlzdGVkQXR0cmlidXRlcykpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXS5ub2RlTmFtZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUxcbiAgfVxuXG4gIC8vIFRPT0xUSVAgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUb29sdGlwID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnR5cGUgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxuICAgIHRoaXMuZW5hYmxlZCAgICA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgICAgPSBudWxsXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuICAgIHRoaXMuJGVsZW1lbnQgICA9IG51bGxcbiAgICB0aGlzLmluU3RhdGUgICAgPSBudWxsXG5cbiAgICB0aGlzLmluaXQoJ3Rvb2x0aXAnLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgVG9vbHRpcC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUb29sdGlwLkRFRkFVTFRTID0ge1xuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBkZWxheTogMCxcbiAgICBodG1sOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGZhbHNlLFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgcGFkZGluZzogMFxuICAgIH0sXG4gICAgc2FuaXRpemUgOiB0cnVlLFxuICAgIHNhbml0aXplRm4gOiBudWxsLFxuICAgIHdoaXRlTGlzdCA6IERlZmF1bHRXaGl0ZWxpc3RcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5hYmxlZCAgID0gdHJ1ZVxuICAgIHRoaXMudHlwZSAgICAgID0gdHlwZVxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgdGhpcy4kdmlld3BvcnQgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgJChkb2N1bWVudCkuZmluZCgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KSA/IHRoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsIHRoaXMuJGVsZW1lbnQpIDogKHRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMudmlld3BvcnQpKVxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3IgJiYgIXRoaXMub3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxuICAgIH1cblxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcblxuICAgIGZvciAodmFyIGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cblxuICAgICAgaWYgKHRyaWdnZXIgPT0gJ2NsaWNrJykge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgIHZhciBldmVudEluICA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1c2luJ1xuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMuZW50ZXIsIHRoaXMpKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9yID9cbiAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICB0aGlzLmZpeFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBUb29sdGlwLkRFRkFVTFRTXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YUF0dHJpYnV0ZXMgPSB0aGlzLiRlbGVtZW50LmRhdGEoKVxuXG4gICAgZm9yICh2YXIgZGF0YUF0dHIgaW4gZGF0YUF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmIChkYXRhQXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShkYXRhQXR0cikgJiYgJC5pbkFycmF5KGRhdGFBdHRyLCBESVNBTExPV0VEX0FUVFJJQlVURVMpICE9PSAtMSkge1xuICAgICAgICBkZWxldGUgZGF0YUF0dHJpYnV0ZXNbZGF0YUF0dHJdXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmdldERlZmF1bHRzKCksIGRhdGFBdHRyaWJ1dGVzLCBvcHRpb25zKVxuXG4gICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgdHlwZW9mIG9wdGlvbnMuZGVsYXkgPT0gJ251bWJlcicpIHtcbiAgICAgIG9wdGlvbnMuZGVsYXkgPSB7XG4gICAgICAgIHNob3c6IG9wdGlvbnMuZGVsYXksXG4gICAgICAgIGhpZGU6IG9wdGlvbnMuZGVsYXlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9IHNhbml0aXplSHRtbChvcHRpb25zLnRlbXBsYXRlLCBvcHRpb25zLndoaXRlTGlzdCwgb3B0aW9ucy5zYW5pdGl6ZUZuKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgID0ge31cbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKClcblxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVudGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3VzaW4nID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpIHx8IHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSB7XG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSBzZWxmLnNob3coKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5pblN0YXRlW2tleV0pIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ291dCdcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKHRoaXMuaGFzQ29udGVudCgpICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIHZhciBpbkRvbSA9ICQuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy4kZWxlbWVudFswXSlcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpbkRvbSkgcmV0dXJuXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG5cbiAgICAgIHZhciB0aXBJZCA9IHRoaXMuZ2V0VUlEKHRoaXMudHlwZSlcblxuICAgICAgdGhpcy5zZXRDb250ZW50KClcbiAgICAgICR0aXAuYXR0cignaWQnLCB0aXBJZClcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpcElkKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgJHRpcC5hZGRDbGFzcygnZmFkZScpXG5cbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsICR0aXBbMF0sIHRoaXMuJGVsZW1lbnRbMF0pIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICB2YXIgYXV0b1Rva2VuID0gL1xccz9hdXRvP1xccz8vaVxuICAgICAgdmFyIGF1dG9QbGFjZSA9IGF1dG9Ub2tlbi50ZXN0KHBsYWNlbWVudClcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXG5cbiAgICAgICR0aXBcbiAgICAgICAgLmRldGFjaCgpXG4gICAgICAgIC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAsIGRpc3BsYXk6ICdibG9jaycgfSlcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPyAkdGlwLmFwcGVuZFRvKCQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLmNvbnRhaW5lcikpIDogJHRpcC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgICB2YXIgcG9zICAgICAgICAgID0gdGhpcy5nZXRQb3NpdGlvbigpXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgdmFyIG9yZ1BsYWNlbWVudCA9IHBsYWNlbWVudFxuICAgICAgICB2YXIgdmlld3BvcnREaW0gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgJiYgcG9zLnRvcCAgICAtIGFjdHVhbEhlaWdodCA8IHZpZXdwb3J0RGltLnRvcCAgICA/ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICAmJiBwb3MubGVmdCAgIC0gYWN0dWFsV2lkdGggIDwgdmlld3BvcnREaW0ubGVmdCAgID8gJ3JpZ2h0JyAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRcblxuICAgICAgICAkdGlwXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXG5cbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gdGhhdC5ob3ZlclN0YXRlXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgICAgdGhhdC5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxuICAgICAgfVxuXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgICR0aXBcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQsIHBsYWNlbWVudCkge1xuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIC8vIG1hbnVhbGx5IHJlYWQgbWFyZ2lucyBiZWNhdXNlIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBkaWZmZXJlbmNlXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tdG9wJyksIDEwKVxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxuXG4gICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgTmFOIGZvciBpZSA4LzlcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXG4gICAgaWYgKGlzTmFOKG1hcmdpbkxlZnQpKSBtYXJnaW5MZWZ0ID0gMFxuXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXG4gICAgb2Zmc2V0LmxlZnQgKz0gbWFyZ2luTGVmdFxuXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcbiAgICAvLyBzbyB3ZSB1c2Ugc2V0T2Zmc2V0IGRpcmVjdGx5IHdpdGggb3VyIG93biBmdW5jdGlvbiBCLTBcbiAgICAkLm9mZnNldC5zZXRPZmZzZXQoJHRpcFswXSwgJC5leHRlbmQoe1xuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAkdGlwLmNzcyh7XG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHByb3BzLnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIG9mZnNldCksIDApXG5cbiAgICAkdGlwLmFkZENsYXNzKCdpbicpXG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgcGxhY2luZyB0aXAgaW4gbmV3IG9mZnNldCBjYXVzZWQgdGhlIHRpcCB0byByZXNpemUgaXRzZWxmXG4gICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChwbGFjZW1lbnQgPT0gJ3RvcCcgJiYgYWN0dWFsSGVpZ2h0ICE9IGhlaWdodCkge1xuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgIGlmIChkZWx0YS5sZWZ0KSBvZmZzZXQubGVmdCArPSBkZWx0YS5sZWZ0XG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxuXG4gICAgdmFyIGlzVmVydGljYWwgICAgICAgICAgPSAvdG9wfGJvdHRvbS8udGVzdChwbGFjZW1lbnQpXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxuICAgIHZhciBhcnJvd09mZnNldFBvc2l0aW9uID0gaXNWZXJ0aWNhbCA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J1xuXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIHRoaXMucmVwbGFjZUFycm93KGFycm93RGVsdGEsICR0aXBbMF1bYXJyb3dPZmZzZXRQb3NpdGlvbl0sIGlzVmVydGljYWwpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5yZXBsYWNlQXJyb3cgPSBmdW5jdGlvbiAoZGVsdGEsIGRpbWVuc2lvbiwgaXNWZXJ0aWNhbCkge1xuICAgIHRoaXMuYXJyb3coKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JywgJycpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaHRtbCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICB0aXRsZSA9IHNhbml0aXplSHRtbCh0aXRsZSwgdGhpcy5vcHRpb25zLndoaXRlTGlzdCwgdGhpcy5vcHRpb25zLnNhbml0aXplRm4pXG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS5odG1sKHRpdGxlKVxuICAgIH0gZWxzZSB7XG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykudGV4dCh0aXRsZSlcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIGluIHRvcCBib3R0b20gbGVmdCByaWdodCcpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyICR0aXAgPSAkKHRoaXMuJHRpcClcbiAgICB2YXIgZSAgICA9ICQuRXZlbnQoJ2hpZGUuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgaWYgKHRoYXQuaG92ZXJTdGF0ZSAhPSAnaW4nKSAkdGlwLmRldGFjaCgpXG4gICAgICBpZiAodGhhdC4kZWxlbWVudCkgeyAvLyBUT0RPOiBDaGVjayB3aGV0aGVyIGd1YXJkaW5nIHRoaXMgY29kZSB3aXRoIHRoaXMgYGlmYCBpcyByZWFsbHkgbmVjZXNzYXJ5LlxuICAgICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknKVxuICAgICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkdGlwXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBjb21wbGV0ZSgpXG5cbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZml4VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIGlmICgkZS5hdHRyKCd0aXRsZScpIHx8IHR5cGVvZiAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykgIT0gJ3N0cmluZycpIHtcbiAgICAgICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAkZS5hdHRyKCd0aXRsZScpIHx8ICcnKS5hdHRyKCd0aXRsZScsICcnKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAkZWxlbWVudCAgID0gJGVsZW1lbnQgfHwgdGhpcy4kZWxlbWVudFxuXG4gICAgdmFyIGVsICAgICA9ICRlbGVtZW50WzBdXG4gICAgdmFyIGlzQm9keSA9IGVsLnRhZ05hbWUgPT0gJ0JPRFknXG5cbiAgICB2YXIgZWxSZWN0ICAgID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoZWxSZWN0LndpZHRoID09IG51bGwpIHtcbiAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgYXJlIG1pc3NpbmcgaW4gSUU4LCBzbyBjb21wdXRlIHRoZW0gbWFudWFsbHk7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0MDkzXG4gICAgICBlbFJlY3QgPSAkLmV4dGVuZCh7fSwgZWxSZWN0LCB7IHdpZHRoOiBlbFJlY3QucmlnaHQgLSBlbFJlY3QubGVmdCwgaGVpZ2h0OiBlbFJlY3QuYm90dG9tIC0gZWxSZWN0LnRvcCB9KVxuICAgIH1cbiAgICB2YXIgaXNTdmcgPSB3aW5kb3cuU1ZHRWxlbWVudCAmJiBlbCBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50XG4gICAgLy8gQXZvaWQgdXNpbmcgJC5vZmZzZXQoKSBvbiBTVkdzIHNpbmNlIGl0IGdpdmVzIGluY29ycmVjdCByZXN1bHRzIGluIGpRdWVyeSAzLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzIwMjgwXG4gICAgdmFyIGVsT2Zmc2V0ICA9IGlzQm9keSA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAoaXNTdmcgPyBudWxsIDogJGVsZW1lbnQub2Zmc2V0KCkpXG4gICAgdmFyIHNjcm9sbCAgICA9IHsgc2Nyb2xsOiBpc0JvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogJGVsZW1lbnQuc2Nyb2xsVG9wKCkgfVxuICAgIHZhciBvdXRlckRpbXMgPSBpc0JvZHkgPyB7IHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkgfSA6IG51bGxcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZWxSZWN0LCBzY3JvbGwsIG91dGVyRGltcywgZWxPZmZzZXQpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0ID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudCA9PSAnYm90dG9tJyA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCwgICBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICA/IHsgdG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIGFjdHVhbFdpZHRoIH0gOlxuICAgICAgICAvKiBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAqLyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggfVxuXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICB2YXIgZGVsdGEgPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gICAgaWYgKCF0aGlzLiR2aWV3cG9ydCkgcmV0dXJuIGRlbHRhXG5cbiAgICB2YXIgdmlld3BvcnRQYWRkaW5nID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmIHRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nIHx8IDBcbiAgICB2YXIgdmlld3BvcnREaW1lbnNpb25zID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgIGlmICgvcmlnaHR8bGVmdC8udGVzdChwbGFjZW1lbnQpKSB7XG4gICAgICB2YXIgdG9wRWRnZU9mZnNldCAgICA9IHBvcy50b3AgLSB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsXG4gICAgICB2YXIgYm90dG9tRWRnZU9mZnNldCA9IHBvcy50b3AgKyB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsICsgYWN0dWFsSGVpZ2h0XG4gICAgICBpZiAodG9wRWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy50b3ApIHsgLy8gdG9wIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgLSB0b3BFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCkgeyAvLyBib3R0b20gb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQgLSBib3R0b21FZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZWZ0RWRnZU9mZnNldCAgPSBwb3MubGVmdCAtIHZpZXdwb3J0UGFkZGluZ1xuICAgICAgdmFyIHJpZ2h0RWRnZU9mZnNldCA9IHBvcy5sZWZ0ICsgdmlld3BvcnRQYWRkaW5nICsgYWN0dWFsV2lkdGhcbiAgICAgIGlmIChsZWZ0RWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0KSB7IC8vIGxlZnQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0IC0gbGVmdEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAocmlnaHRFZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnJpZ2h0KSB7IC8vIHJpZ2h0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCArIHZpZXdwb3J0RGltZW5zaW9ucy53aWR0aCAtIHJpZ2h0RWRnZU9mZnNldFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWx0YVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcbiAgICAgIHx8ICh0eXBlb2Ygby50aXRsZSA9PSAnZnVuY3Rpb24nID8gby50aXRsZS5jYWxsKCRlWzBdKSA6ICBvLnRpdGxlKVxuXG4gICAgcmV0dXJuIHRpdGxlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRVSUQgPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgZG8gcHJlZml4ICs9IH5+KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKVxuICAgIHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKVxuICAgIHJldHVybiBwcmVmaXhcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJHRpcCkge1xuICAgICAgdGhpcy4kdGlwID0gJCh0aGlzLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLnR5cGUgKyAnIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHRpcFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLnRvb2x0aXAtYXJyb3cnKSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWRcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcbiAgICAgIGlmICghc2VsZikge1xuICAgICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZSkge1xuICAgICAgc2VsZi5pblN0YXRlLmNsaWNrID0gIXNlbGYuaW5TdGF0ZS5jbGlja1xuICAgICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSBzZWxmLmVudGVyKHNlbGYpXG4gICAgICBlbHNlIHNlbGYubGVhdmUoc2VsZilcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSA/IHNlbGYubGVhdmUoc2VsZikgOiBzZWxmLmVudGVyKHNlbGYpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIHRoaXMuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9mZignLicgKyB0aGF0LnR5cGUpLnJlbW92ZURhdGEoJ2JzLicgKyB0aGF0LnR5cGUpXG4gICAgICBpZiAodGhhdC4kdGlwKSB7XG4gICAgICAgIHRoYXQuJHRpcC5kZXRhY2goKVxuICAgICAgfVxuICAgICAgdGhhdC4kdGlwID0gbnVsbFxuICAgICAgdGhhdC4kYXJyb3cgPSBudWxsXG4gICAgICB0aGF0LiR2aWV3cG9ydCA9IG51bGxcbiAgICAgIHRoYXQuJGVsZW1lbnQgPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNhbml0aXplSHRtbCA9IGZ1bmN0aW9uICh1bnNhZmVIdG1sKSB7XG4gICAgcmV0dXJuIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgfVxuXG4gIC8vIFRPT0xUSVAgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy50b29sdGlwJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnLCAoZGF0YSA9IG5ldyBUb29sdGlwKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50b29sdGlwXG5cbiAgJC5mbi50b29sdGlwICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udG9vbHRpcC5Db25zdHJ1Y3RvciA9IFRvb2x0aXBcblxuXG4gIC8vIFRPT0xUSVAgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4udG9vbHRpcC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udG9vbHRpcCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogcG9wb3Zlci5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNwb3BvdmVyc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFBPUE9WRVIgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBQb3BvdmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmluaXQoJ3BvcG92ZXInLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKCEkLmZuLnRvb2x0aXApIHRocm93IG5ldyBFcnJvcignUG9wb3ZlciByZXF1aXJlcyB0b29sdGlwLmpzJylcblxuICBQb3BvdmVyLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFBvcG92ZXIuREVGQVVMVFMgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLkRFRkFVTFRTLCB7XG4gICAgcGxhY2VtZW50OiAncmlnaHQnLFxuICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgY29udGVudDogJycsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2PidcbiAgfSlcblxuXG4gIC8vIE5PVEU6IFBPUE9WRVIgRVhURU5EUyB0b29sdGlwLmpzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSlcblxuICBQb3BvdmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUG9wb3Zlci5ERUZBVUxUU1xuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgICA9IHRoaXMuZ2V0VGl0bGUoKVxuICAgIHZhciBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KClcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaHRtbCkge1xuICAgICAgdmFyIHR5cGVDb250ZW50ID0gdHlwZW9mIGNvbnRlbnRcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICB0aXRsZSA9IHRoaXMuc2FuaXRpemVIdG1sKHRpdGxlKVxuXG4gICAgICAgIGlmICh0eXBlQ29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5zYW5pdGl6ZUh0bWwoY29udGVudClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCh0aXRsZSlcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbXG4gICAgICAgIHR5cGVDb250ZW50ID09PSAnc3RyaW5nJyA/ICdodG1sJyA6ICdhcHBlbmQnXG4gICAgICBdKGNvbnRlbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS50ZXh0KHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKS50ZXh0KGNvbnRlbnQpXG4gICAgfVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxuXG4gICAgLy8gSUU4IGRvZXNuJ3QgYWNjZXB0IGhpZGluZyB2aWEgdGhlIGA6ZW1wdHlgIHBzZXVkbyBzZWxlY3Rvciwgd2UgaGF2ZSB0byBkb1xuICAgIC8vIHRoaXMgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhlIGNvbnRlbnRzLlxuICAgIGlmICghJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwoKSkgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmhpZGUoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpIHx8IHRoaXMuZ2V0Q29udGVudCgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHJldHVybiAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxuICAgICAgfHwgKHR5cGVvZiBvLmNvbnRlbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIG8uY29udGVudC5jYWxsKCRlWzBdKSA6XG4gICAgICAgIG8uY29udGVudClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy5hcnJvdycpKVxuICB9XG5cblxuICAvLyBQT1BPVkVSIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJywgKGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ucG9wb3ZlclxuXG4gICQuZm4ucG9wb3ZlciAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnBvcG92ZXIuQ29uc3RydWN0b3IgPSBQb3BvdmVyXG5cblxuICAvLyBQT1BPVkVSIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnBvcG92ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnBvcG92ZXIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHNjcm9sbHNweS5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNzY3JvbGxzcHlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBTQ1JPTExTUFkgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFNjcm9sbFNweShlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kYm9keSAgICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRzY3JvbGxFbGVtZW50ID0gJChlbGVtZW50KS5pcyhkb2N1bWVudC5ib2R5KSA/ICQod2luZG93KSA6ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgID0gJC5leHRlbmQoe30sIFNjcm9sbFNweS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLnNlbGVjdG9yICAgICAgID0gKHRoaXMub3B0aW9ucy50YXJnZXQgfHwgJycpICsgJyAubmF2IGxpID4gYSdcbiAgICB0aGlzLm9mZnNldHMgICAgICAgID0gW11cbiAgICB0aGlzLnRhcmdldHMgICAgICAgID0gW11cbiAgICB0aGlzLmFjdGl2ZVRhcmdldCAgID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ICAgPSAwXG5cbiAgICB0aGlzLiRzY3JvbGxFbGVtZW50Lm9uKCdzY3JvbGwuYnMuc2Nyb2xsc3B5JywgJC5wcm94eSh0aGlzLnByb2Nlc3MsIHRoaXMpKVxuICAgIHRoaXMucmVmcmVzaCgpXG4gICAgdGhpcy5wcm9jZXNzKClcbiAgfVxuXG4gIFNjcm9sbFNweS5WRVJTSU9OICA9ICczLjQuMSdcblxuICBTY3JvbGxTcHkuREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAxMFxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5nZXRTY3JvbGxIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0IHx8IE1hdGgubWF4KHRoaXMuJGJvZHlbMF0uc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ICAgICAgICAgID0gdGhpc1xuICAgIHZhciBvZmZzZXRNZXRob2QgID0gJ29mZnNldCdcbiAgICB2YXIgb2Zmc2V0QmFzZSAgICA9IDBcblxuICAgIHRoaXMub2Zmc2V0cyAgICAgID0gW11cbiAgICB0aGlzLnRhcmdldHMgICAgICA9IFtdXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXG5cbiAgICBpZiAoISQuaXNXaW5kb3codGhpcy4kc2Nyb2xsRWxlbWVudFswXSkpIHtcbiAgICAgIG9mZnNldE1ldGhvZCA9ICdwb3NpdGlvbidcbiAgICAgIG9mZnNldEJhc2UgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKClcbiAgICB9XG5cbiAgICB0aGlzLiRib2R5XG4gICAgICAuZmluZCh0aGlzLnNlbGVjdG9yKVxuICAgICAgLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZWwgICA9ICQodGhpcylcbiAgICAgICAgdmFyIGhyZWYgID0gJGVsLmRhdGEoJ3RhcmdldCcpIHx8ICRlbC5hdHRyKCdocmVmJylcbiAgICAgICAgdmFyICRocmVmID0gL14jLi8udGVzdChocmVmKSAmJiAkKGhyZWYpXG5cbiAgICAgICAgcmV0dXJuICgkaHJlZlxuICAgICAgICAgICYmICRocmVmLmxlbmd0aFxuICAgICAgICAgICYmICRocmVmLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgJiYgW1skaHJlZltvZmZzZXRNZXRob2RdKCkudG9wICsgb2Zmc2V0QmFzZSwgaHJlZl1dKSB8fCBudWxsXG4gICAgICB9KVxuICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGFbMF0gLSBiWzBdIH0pXG4gICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQub2Zmc2V0cy5wdXNoKHRoaXNbMF0pXG4gICAgICAgIHRoYXQudGFyZ2V0cy5wdXNoKHRoaXNbMV0pXG4gICAgICB9KVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpICsgdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXG4gICAgdmFyIG1heFNjcm9sbCAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXQgKyBzY3JvbGxIZWlnaHQgLSB0aGlzLiRzY3JvbGxFbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldHMgICAgICA9IHRoaXMub2Zmc2V0c1xuICAgIHZhciB0YXJnZXRzICAgICAgPSB0aGlzLnRhcmdldHNcbiAgICB2YXIgYWN0aXZlVGFyZ2V0ID0gdGhpcy5hY3RpdmVUYXJnZXRcbiAgICB2YXIgaVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsSGVpZ2h0ICE9IHNjcm9sbEhlaWdodCkge1xuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xuICAgICAgcmV0dXJuIGFjdGl2ZVRhcmdldCAhPSAoaSA9IHRhcmdldHNbdGFyZ2V0cy5sZW5ndGggLSAxXSkgJiYgdGhpcy5hY3RpdmF0ZShpKVxuICAgIH1cblxuICAgIGlmIChhY3RpdmVUYXJnZXQgJiYgc2Nyb2xsVG9wIDwgb2Zmc2V0c1swXSkge1xuICAgICAgdGhpcy5hY3RpdmVUYXJnZXQgPSBudWxsXG4gICAgICByZXR1cm4gdGhpcy5jbGVhcigpXG4gICAgfVxuXG4gICAgZm9yIChpID0gb2Zmc2V0cy5sZW5ndGg7IGktLTspIHtcbiAgICAgIGFjdGl2ZVRhcmdldCAhPSB0YXJnZXRzW2ldXG4gICAgICAgICYmIHNjcm9sbFRvcCA+PSBvZmZzZXRzW2ldXG4gICAgICAgICYmIChvZmZzZXRzW2kgKyAxXSA9PT0gdW5kZWZpbmVkIHx8IHNjcm9sbFRvcCA8IG9mZnNldHNbaSArIDFdKVxuICAgICAgICAmJiB0aGlzLmFjdGl2YXRlKHRhcmdldHNbaV0pXG4gICAgfVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IHRhcmdldFxuXG4gICAgdGhpcy5jbGVhcigpXG5cbiAgICB2YXIgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yICtcbiAgICAgICdbZGF0YS10YXJnZXQ9XCInICsgdGFyZ2V0ICsgJ1wiXSwnICtcbiAgICAgIHRoaXMuc2VsZWN0b3IgKyAnW2hyZWY9XCInICsgdGFyZ2V0ICsgJ1wiXSdcblxuICAgIHZhciBhY3RpdmUgPSAkKHNlbGVjdG9yKVxuICAgICAgLnBhcmVudHMoJ2xpJylcbiAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcblxuICAgIGlmIChhY3RpdmUucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgYWN0aXZlID0gYWN0aXZlXG4gICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgICBhY3RpdmUudHJpZ2dlcignYWN0aXZhdGUuYnMuc2Nyb2xsc3B5JylcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnNlbGVjdG9yKVxuICAgICAgLnBhcmVudHNVbnRpbCh0aGlzLm9wdGlvbnMudGFyZ2V0LCAnLmFjdGl2ZScpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gIH1cblxuXG4gIC8vIFNDUk9MTFNQWSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknLCAoZGF0YSA9IG5ldyBTY3JvbGxTcHkodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnNjcm9sbHNweVxuXG4gICQuZm4uc2Nyb2xsc3B5ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uc2Nyb2xsc3B5LkNvbnN0cnVjdG9yID0gU2Nyb2xsU3B5XG5cblxuICAvLyBTQ1JPTExTUFkgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5zY3JvbGxzcHkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnNjcm9sbHNweSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFNDUk9MTFNQWSBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQuYnMuc2Nyb2xsc3B5LmRhdGEtYXBpJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cInNjcm9sbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCAkc3B5LmRhdGEoKSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0YWIuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdGFic1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRBQiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRhYiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgLy8ganNjczpkaXNhYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KVxuICAgIC8vIGpzY3M6ZW5hYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gIH1cblxuICBUYWIuVkVSU0lPTiA9ICczLjQuMSdcblxuICBUYWIuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRhYi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgICAgPSB0aGlzLmVsZW1lbnRcbiAgICB2YXIgJHVsICAgICAgPSAkdGhpcy5jbG9zZXN0KCd1bDpub3QoLmRyb3Bkb3duLW1lbnUpJylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5kYXRhKCd0YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBpZiAoJHRoaXMucGFyZW50KCdsaScpLmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHByZXZpb3VzID0gJHVsLmZpbmQoJy5hY3RpdmU6bGFzdCBhJylcbiAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgIH0pXG4gICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgfSlcblxuICAgICRwcmV2aW91cy50cmlnZ2VyKGhpZGVFdmVudClcbiAgICAkdGhpcy50cmlnZ2VyKHNob3dFdmVudClcblxuICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIHRoaXMuYWN0aXZhdGUoJHRoaXMuY2xvc2VzdCgnbGknKSwgJHVsKVxuICAgIHRoaXMuYWN0aXZhdGUoJHRhcmdldCwgJHRhcmdldC5wYXJlbnQoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgJHByZXZpb3VzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnaGlkZGVuLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgICB9KVxuICAgICAgJHRoaXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdzaG93bi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIFRhYi5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgIHZhciAkYWN0aXZlICAgID0gY29udGFpbmVyLmZpbmQoJz4gLmFjdGl2ZScpXG4gICAgdmFyIHRyYW5zaXRpb24gPSBjYWxsYmFja1xuICAgICAgJiYgJC5zdXBwb3J0LnRyYW5zaXRpb25cbiAgICAgICYmICgkYWN0aXZlLmxlbmd0aCAmJiAkYWN0aXZlLmhhc0NsYXNzKCdmYWRlJykgfHwgISFjb250YWluZXIuZmluZCgnPiAuZmFkZScpLmxlbmd0aClcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJz4gLmRyb3Bkb3duLW1lbnUgPiAuYWN0aXZlJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZW5kKClcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICAgIGVsZW1lbnRcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICBlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIHJlZmxvdyBmb3IgdHJhbnNpdGlvblxuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdpbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdmYWRlJylcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgICBlbGVtZW50XG4gICAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgJGFjdGl2ZS5sZW5ndGggJiYgdHJhbnNpdGlvbiA/XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIG5leHQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUYWIuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgbmV4dCgpXG5cbiAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdpbicpXG4gIH1cblxuXG4gIC8vIFRBQiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy50YWInKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRhYicsIChkYXRhID0gbmV3IFRhYih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udGFiXG5cbiAgJC5mbi50YWIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50YWIuQ29uc3RydWN0b3IgPSBUYWJcblxuXG4gIC8vIFRBQiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkLmZuLnRhYi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udGFiID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gVEFCIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFBsdWdpbi5jYWxsKCQodGhpcyksICdzaG93JylcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLCBjbGlja0hhbmRsZXIpXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFmZml4LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2FmZml4XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUZGSVggQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEFmZml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQWZmaXguREVGQVVMVFMsIG9wdGlvbnMpXG5cbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5vcHRpb25zLnRhcmdldCA9PT0gQWZmaXguREVGQVVMVFMudGFyZ2V0ID8gJCh0aGlzLm9wdGlvbnMudGFyZ2V0KSA6ICQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnRhcmdldClcblxuICAgIHRoaXMuJHRhcmdldCA9IHRhcmdldFxuICAgICAgLm9uKCdzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGknLCAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcykpXG4gICAgICAub24oJ2NsaWNrLmJzLmFmZml4LmRhdGEtYXBpJywgICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCwgdGhpcykpXG5cbiAgICB0aGlzLiRlbGVtZW50ICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLmFmZml4ZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnVucGluICAgICAgICA9IG51bGxcbiAgICB0aGlzLnBpbm5lZE9mZnNldCA9IG51bGxcblxuICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gIH1cblxuICBBZmZpeC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBBZmZpeC5SRVNFVCAgICA9ICdhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tJ1xuXG4gIEFmZml4LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMCxcbiAgICB0YXJnZXQ6IHdpbmRvd1xuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gICAgID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHZhciB0YXJnZXRIZWlnaHQgPSB0aGlzLiR0YXJnZXQuaGVpZ2h0KClcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiB0aGlzLmFmZml4ZWQgPT0gJ3RvcCcpIHJldHVybiBzY3JvbGxUb3AgPCBvZmZzZXRUb3AgPyAndG9wJyA6IGZhbHNlXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkID09ICdib3R0b20nKSB7XG4gICAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwpIHJldHVybiAoc2Nyb2xsVG9wICsgdGhpcy51bnBpbiA8PSBwb3NpdGlvbi50b3ApID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgICAgcmV0dXJuIChzY3JvbGxUb3AgKyB0YXJnZXRIZWlnaHQgPD0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICB9XG5cbiAgICB2YXIgaW5pdGlhbGl6aW5nICAgPSB0aGlzLmFmZml4ZWQgPT0gbnVsbFxuICAgIHZhciBjb2xsaWRlclRvcCAgICA9IGluaXRpYWxpemluZyA/IHNjcm9sbFRvcCA6IHBvc2l0aW9uLnRvcFxuICAgIHZhciBjb2xsaWRlckhlaWdodCA9IGluaXRpYWxpemluZyA/IHRhcmdldEhlaWdodCA6IGhlaWdodFxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHNjcm9sbFRvcCA8PSBvZmZzZXRUb3ApIHJldHVybiAndG9wJ1xuICAgIGlmIChvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAoY29sbGlkZXJUb3AgKyBjb2xsaWRlckhlaWdodCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pKSByZXR1cm4gJ2JvdHRvbSdcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5waW5uZWRPZmZzZXQpIHJldHVybiB0aGlzLnBpbm5lZE9mZnNldFxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpLmFkZENsYXNzKCdhZmZpeCcpXG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgcmV0dXJuICh0aGlzLnBpbm5lZE9mZnNldCA9IHBvc2l0aW9uLnRvcCAtIHNjcm9sbFRvcClcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSwgMSlcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkgcmV0dXJuXG5cbiAgICB2YXIgaGVpZ2h0ICAgICAgID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXQgICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3BcbiAgICB2YXIgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbVxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSBNYXRoLm1heCgkKGRvY3VtZW50KS5oZWlnaHQoKSwgJChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSlcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ICE9ICdvYmplY3QnKSAgICAgICAgIG9mZnNldEJvdHRvbSA9IG9mZnNldFRvcCA9IG9mZnNldFxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0VG9wID09ICdmdW5jdGlvbicpICAgIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3AodGhpcy4kZWxlbWVudClcbiAgICBpZiAodHlwZW9mIG9mZnNldEJvdHRvbSA9PSAnZnVuY3Rpb24nKSBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tKHRoaXMuJGVsZW1lbnQpXG5cbiAgICB2YXIgYWZmaXggPSB0aGlzLmdldFN0YXRlKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSlcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgIT0gYWZmaXgpIHtcbiAgICAgIGlmICh0aGlzLnVucGluICE9IG51bGwpIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCAnJylcblxuICAgICAgdmFyIGFmZml4VHlwZSA9ICdhZmZpeCcgKyAoYWZmaXggPyAnLScgKyBhZmZpeCA6ICcnKVxuICAgICAgdmFyIGUgICAgICAgICA9ICQuRXZlbnQoYWZmaXhUeXBlICsgJy5icy5hZmZpeCcpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuYWZmaXhlZCA9IGFmZml4XG4gICAgICB0aGlzLnVucGluID0gYWZmaXggPT0gJ2JvdHRvbScgPyB0aGlzLmdldFBpbm5lZE9mZnNldCgpIDogbnVsbFxuXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVClcbiAgICAgICAgLmFkZENsYXNzKGFmZml4VHlwZSlcbiAgICAgICAgLnRyaWdnZXIoYWZmaXhUeXBlLnJlcGxhY2UoJ2FmZml4JywgJ2FmZml4ZWQnKSArICcuYnMuYWZmaXgnKVxuICAgIH1cblxuICAgIGlmIChhZmZpeCA9PSAnYm90dG9tJykge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmZzZXQoe1xuICAgICAgICB0b3A6IHNjcm9sbEhlaWdodCAtIGhlaWdodCAtIG9mZnNldEJvdHRvbVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gIC8vIEFGRklYIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmFmZml4JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hZmZpeCcsIChkYXRhID0gbmV3IEFmZml4KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hZmZpeFxuXG4gICQuZm4uYWZmaXggICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hZmZpeC5Db25zdHJ1Y3RvciA9IEFmZml4XG5cblxuICAvLyBBRkZJWCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWZmaXgubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFmZml4ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUZGSVggREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwiYWZmaXhcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkc3B5LmRhdGEoKVxuXG4gICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IHt9XG5cbiAgICAgIGlmIChkYXRhLm9mZnNldEJvdHRvbSAhPSBudWxsKSBkYXRhLm9mZnNldC5ib3R0b20gPSBkYXRhLm9mZnNldEJvdHRvbVxuICAgICAgaWYgKGRhdGEub2Zmc2V0VG9wICAgICE9IG51bGwpIGRhdGEub2Zmc2V0LnRvcCAgICA9IGRhdGEub2Zmc2V0VG9wXG5cbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksIGRhdGEpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuIiwiLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8IEZsZXh5IGhlYWRlclxuLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8XG4vLyB8IFRoaXMgalF1ZXJ5IHNjcmlwdCBpcyB3cml0dGVuIGJ5XG4vLyB8XG4vLyB8IE1vcnRlbiBOaXNzZW5cbi8vIHwgaGplbW1lc2lkZWtvbmdlbi5ka1xuLy8gfFxuXG52YXIgZmxleHlfaGVhZGVyID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHB1YiA9IHt9LFxuICAgICAgICAkaGVhZGVyX3N0YXRpYyA9ICQoJy5mbGV4eS1oZWFkZXItLXN0YXRpYycpLFxuICAgICAgICAkaGVhZGVyX3N0aWNreSA9ICQoJy5mbGV4eS1oZWFkZXItLXN0aWNreScpLFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgdXBkYXRlX2ludGVydmFsOiAxMDAsXG4gICAgICAgICAgICB0b2xlcmFuY2U6IHtcbiAgICAgICAgICAgICAgICB1cHdhcmQ6IDIwLFxuICAgICAgICAgICAgICAgIGRvd253YXJkOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9mZnNldDogX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20oJGhlYWRlcl9zdGF0aWMpLFxuICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgIHBpbm5lZDogXCJmbGV4eS1oZWFkZXItLXBpbm5lZFwiLFxuICAgICAgICAgICAgICAgIHVucGlubmVkOiBcImZsZXh5LWhlYWRlci0tdW5waW5uZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3YXNfc2Nyb2xsZWQgPSBmYWxzZSxcbiAgICAgICAgbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZVxuICAgICAqL1xuICAgIHB1Yi5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYm9vdCBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgICRoZWFkZXJfc3RpY2t5LmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG5cbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICh3YXNfc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudF93YXNfc2Nyb2xsZWQoKTtcblxuICAgICAgICAgICAgICAgIHdhc19zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBvcHRpb25zLnVwZGF0ZV9pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHdhc19zY3JvbGxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBvZmZzZXQgZnJvbSBlbGVtZW50IGJvdHRvbVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tKCRlbGVtZW50KSB7XG4gICAgICAgIHZhciBlbGVtZW50X2hlaWdodCA9ICRlbGVtZW50Lm91dGVySGVpZ2h0KHRydWUpLFxuICAgICAgICAgICAgZWxlbWVudF9vZmZzZXQgPSAkZWxlbWVudC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtZW50X2hlaWdodCArIGVsZW1lbnRfb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2N1bWVudCB3YXMgc2Nyb2xsZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb2N1bWVudF93YXNfc2Nyb2xsZWQoKSB7XG4gICAgICAgIHZhciBjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIC8vIElmIHBhc3Qgb2Zmc2V0XG4gICAgICAgIGlmIChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID49IG9wdGlvbnMub2Zmc2V0KSB7XG5cbiAgICAgICAgICAgIC8vIERvd253YXJkcyBzY3JvbGxcbiAgICAgICAgICAgIGlmIChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID4gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkge1xuXG4gICAgICAgICAgICAgICAgLy8gT2JleSB0aGUgZG93bndhcmQgdG9sZXJhbmNlXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgLSBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSA8PSBvcHRpb25zLnRvbGVyYW5jZS5kb3dud2FyZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXB3YXJkcyBzY3JvbGxcbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gT2JleSB0aGUgdXB3YXJkIHRvbGVyYW5jZVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIC0gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkgPD0gb3B0aW9ucy50b2xlcmFuY2UudXB3YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBhcmUgbm90IHNjcm9sbGVkIHBhc3QgdGhlIGRvY3VtZW50IHdoaWNoIGlzIHBvc3NpYmxlIG9uIHRoZSBNYWNcbiAgICAgICAgICAgICAgICBpZiAoKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3QgcGFzdCBvZmZzZXRcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCA9IGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBBamF4TW9uaXRvciwgQmFyLCBEb2N1bWVudE1vbml0b3IsIEVsZW1lbnRNb25pdG9yLCBFbGVtZW50VHJhY2tlciwgRXZlbnRMYWdNb25pdG9yLCBFdmVudGVkLCBFdmVudHMsIE5vVGFyZ2V0RXJyb3IsIFBhY2UsIFJlcXVlc3RJbnRlcmNlcHQsIFNPVVJDRV9LRVlTLCBTY2FsZXIsIFNvY2tldFJlcXVlc3RUcmFja2VyLCBYSFJSZXF1ZXN0VHJhY2tlciwgYW5pbWF0aW9uLCBhdmdBbXBsaXR1ZGUsIGJhciwgY2FuY2VsQW5pbWF0aW9uLCBjYW5jZWxBbmltYXRpb25GcmFtZSwgZGVmYXVsdE9wdGlvbnMsIGV4dGVuZCwgZXh0ZW5kTmF0aXZlLCBnZXRGcm9tRE9NLCBnZXRJbnRlcmNlcHQsIGhhbmRsZVB1c2hTdGF0ZSwgaWdub3JlU3RhY2ssIGluaXQsIG5vdywgb3B0aW9ucywgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCByZXN1bHQsIHJ1bkFuaW1hdGlvbiwgc2NhbGVycywgc2hvdWxkSWdub3JlVVJMLCBzaG91bGRUcmFjaywgc291cmNlLCBzb3VyY2VzLCB1bmlTY2FsZXIsIF9XZWJTb2NrZXQsIF9YRG9tYWluUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0LCBfaSwgX2ludGVyY2VwdCwgX2xlbiwgX3B1c2hTdGF0ZSwgX3JlZiwgX3JlZjEsIF9yZXBsYWNlU3RhdGUsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNhdGNodXBUaW1lOiAxMDAsXG4gICAgaW5pdGlhbFJhdGU6IC4wMyxcbiAgICBtaW5UaW1lOiAyNTAsXG4gICAgZ2hvc3RUaW1lOiAxMDAsXG4gICAgbWF4UHJvZ3Jlc3NQZXJGcmFtZTogMjAsXG4gICAgZWFzZUZhY3RvcjogMS4yNSxcbiAgICBzdGFydE9uUGFnZUxvYWQ6IHRydWUsXG4gICAgcmVzdGFydE9uUHVzaFN0YXRlOiB0cnVlLFxuICAgIHJlc3RhcnRPblJlcXVlc3RBZnRlcjogNTAwLFxuICAgIHRhcmdldDogJ2JvZHknLFxuICAgIGVsZW1lbnRzOiB7XG4gICAgICBjaGVja0ludGVydmFsOiAxMDAsXG4gICAgICBzZWxlY3RvcnM6IFsnYm9keSddXG4gICAgfSxcbiAgICBldmVudExhZzoge1xuICAgICAgbWluU2FtcGxlczogMTAsXG4gICAgICBzYW1wbGVDb3VudDogMyxcbiAgICAgIGxhZ1RocmVzaG9sZDogM1xuICAgIH0sXG4gICAgYWpheDoge1xuICAgICAgdHJhY2tNZXRob2RzOiBbJ0dFVCddLFxuICAgICAgdHJhY2tXZWJTb2NrZXRzOiB0cnVlLFxuICAgICAgaWdub3JlVVJMczogW11cbiAgICB9XG4gIH07XG5cbiAgbm93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgcmV0dXJuIChfcmVmID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsID8gdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gXCJmdW5jdGlvblwiID8gcGVyZm9ybWFuY2Uubm93KCkgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwgPyBfcmVmIDogKyhuZXcgRGF0ZSk7XG4gIH07XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZTtcblxuICBpZiAocmVxdWVzdEFuaW1hdGlvbkZyYW1lID09IG51bGwpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZm4sIDUwKTtcbiAgICB9O1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHJldHVybiBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG4gIH1cblxuICBydW5BbmltYXRpb24gPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBsYXN0LCB0aWNrO1xuICAgIGxhc3QgPSBub3coKTtcbiAgICB0aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGlmZjtcbiAgICAgIGRpZmYgPSBub3coKSAtIGxhc3Q7XG4gICAgICBpZiAoZGlmZiA+PSAzMykge1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHJldHVybiBmbihkaWZmLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHRpY2ssIDMzIC0gZGlmZik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGljaygpO1xuICB9O1xuXG4gIHJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBrZXksIG9iajtcbiAgICBvYmogPSBhcmd1bWVudHNbMF0sIGtleSA9IGFyZ3VtZW50c1sxXSwgYXJncyA9IDMgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogW107XG4gICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9ialtrZXldLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9XG4gIH07XG5cbiAgZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGtleSwgb3V0LCBzb3VyY2UsIHNvdXJjZXMsIHZhbCwgX2ksIF9sZW47XG4gICAgb3V0ID0gYXJndW1lbnRzWzBdLCBzb3VyY2VzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHNvdXJjZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZXNbX2ldO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAoIV9faGFzUHJvcC5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7XG4gICAgICAgICAgdmFsID0gc291cmNlW2tleV07XG4gICAgICAgICAgaWYgKChvdXRba2V5XSAhPSBudWxsKSAmJiB0eXBlb2Ygb3V0W2tleV0gPT09ICdvYmplY3QnICYmICh2YWwgIT0gbnVsbCkgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGV4dGVuZChvdXRba2V5XSwgdmFsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0W2tleV0gPSB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgYXZnQW1wbGl0dWRlID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIGNvdW50LCBzdW0sIHYsIF9pLCBfbGVuO1xuICAgIHN1bSA9IGNvdW50ID0gMDtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGFyci5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdiA9IGFycltfaV07XG4gICAgICBzdW0gKz0gTWF0aC5hYnModik7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgICByZXR1cm4gc3VtIC8gY291bnQ7XG4gIH07XG5cbiAgZ2V0RnJvbURPTSA9IGZ1bmN0aW9uKGtleSwganNvbikge1xuICAgIHZhciBkYXRhLCBlLCBlbDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGtleSA9ICdvcHRpb25zJztcbiAgICB9XG4gICAgaWYgKGpzb24gPT0gbnVsbCkge1xuICAgICAganNvbiA9IHRydWU7XG4gICAgfVxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLXBhY2UtXCIgKyBrZXkgKyBcIl1cIik7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYWNlLVwiICsga2V5KTtcbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICBlID0gX2Vycm9yO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBpbmxpbmUgcGFjZSBvcHRpb25zXCIsIGUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcblxuICBFdmVudGVkID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50ZWQoKSB7fVxuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudCwgaGFuZGxlciwgY3R4LCBvbmNlKSB7XG4gICAgICB2YXIgX2Jhc2U7XG4gICAgICBpZiAob25jZSA9PSBudWxsKSB7XG4gICAgICAgIG9uY2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW2V2ZW50XSA9PSBudWxsKSB7XG4gICAgICAgIF9iYXNlW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbZXZlbnRdLnB1c2goe1xuICAgICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgICBjdHg6IGN0eCxcbiAgICAgICAgb25jZTogb25jZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgaGFuZGxlciwgY3R4KSB7XG4gICAgICByZXR1cm4gdGhpcy5vbihldmVudCwgaGFuZGxlciwgY3R4LCB0cnVlKTtcbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIHZhciBpLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIGlmICgoKF9yZWYgPSB0aGlzLmJpbmRpbmdzKSAhPSBudWxsID8gX3JlZltldmVudF0gOiB2b2lkIDApID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGhhbmRsZXIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMuYmluZGluZ3NbZXZlbnRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3NbZXZlbnRdW2ldLmhhbmRsZXIgPT09IGhhbmRsZXIpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5iaW5kaW5nc1tldmVudF0uc3BsaWNlKGksIDEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChpKyspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBjdHgsIGV2ZW50LCBoYW5kbGVyLCBpLCBvbmNlLCBfcmVmLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBldmVudCA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBpZiAoKF9yZWYgPSB0aGlzLmJpbmRpbmdzKSAhPSBudWxsID8gX3JlZltldmVudF0gOiB2b2lkIDApIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XG4gICAgICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXSwgaGFuZGxlciA9IF9yZWYxLmhhbmRsZXIsIGN0eCA9IF9yZWYxLmN0eCwgb25jZSA9IF9yZWYxLm9uY2U7XG4gICAgICAgICAgaGFuZGxlci5hcHBseShjdHggIT0gbnVsbCA/IGN0eCA6IHRoaXMsIGFyZ3MpO1xuICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRlZDtcblxuICB9KSgpO1xuXG4gIFBhY2UgPSB3aW5kb3cuUGFjZSB8fCB7fTtcblxuICB3aW5kb3cuUGFjZSA9IFBhY2U7XG5cbiAgZXh0ZW5kKFBhY2UsIEV2ZW50ZWQucHJvdG90eXBlKTtcblxuICBvcHRpb25zID0gUGFjZS5vcHRpb25zID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgd2luZG93LnBhY2VPcHRpb25zLCBnZXRGcm9tRE9NKCkpO1xuXG4gIF9yZWYgPSBbJ2FqYXgnLCAnZG9jdW1lbnQnLCAnZXZlbnRMYWcnLCAnZWxlbWVudHMnXTtcbiAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgc291cmNlID0gX3JlZltfaV07XG4gICAgaWYgKG9wdGlvbnNbc291cmNlXSA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9uc1tzb3VyY2VdID0gZGVmYXVsdE9wdGlvbnNbc291cmNlXTtcbiAgICB9XG4gIH1cblxuICBOb1RhcmdldEVycm9yID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb1RhcmdldEVycm9yLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gTm9UYXJnZXRFcnJvcigpIHtcbiAgICAgIF9yZWYxID0gTm9UYXJnZXRFcnJvci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfcmVmMTtcbiAgICB9XG5cbiAgICByZXR1cm4gTm9UYXJnZXRFcnJvcjtcblxuICB9KShFcnJvcik7XG5cbiAgQmFyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJhcigpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgIH1cblxuICAgIEJhci5wcm90b3R5cGUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRhcmdldEVsZW1lbnQ7XG4gICAgICBpZiAodGhpcy5lbCA9PSBudWxsKSB7XG4gICAgICAgIHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE5vVGFyZ2V0RXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTmFtZSA9IFwicGFjZSBwYWNlLWFjdGl2ZVwiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoL3BhY2UtZG9uZS9nLCAnJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1ydW5uaW5nJztcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInBhY2UtcHJvZ3Jlc3NcIj5cXG4gIDxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzLWlubmVyXCI+PC9kaXY+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cInBhY2UtYWN0aXZpdHlcIj48L2Rpdj4nO1xuICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5maXJzdENoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLmVsLCB0YXJnZXRFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsO1xuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLWFjdGl2ZScsICcnKTtcbiAgICAgIGVsLmNsYXNzTmFtZSArPSAnIHBhY2UtaW5hY3RpdmUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLXJ1bm5pbmcnLCAnJyk7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBwYWNlLWRvbmUnO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHByb2cpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9nO1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdldEVsZW1lbnQoKSk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsID0gdm9pZCAwO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsLCBrZXksIHByb2dyZXNzU3RyLCB0cmFuc2Zvcm0sIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBlbCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgdHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIHRoaXMucHJvZ3Jlc3MgKyBcIiUsIDAsIDApXCI7XG4gICAgICBfcmVmMiA9IFsnd2Via2l0VHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJywgJ3RyYW5zZm9ybSddO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGtleSA9IF9yZWYyW19qXTtcbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc3R5bGVba2V5XSA9IHRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8fCB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzIHwgMCAhPT0gdGhpcy5wcm9ncmVzcyB8IDApIHtcbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdkYXRhLXByb2dyZXNzLXRleHQnLCBcIlwiICsgKHRoaXMucHJvZ3Jlc3MgfCAwKSArIFwiJVwiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3MgPj0gMTAwKSB7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgPSAnOTknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gdGhpcy5wcm9ncmVzcyA8IDEwID8gXCIwXCIgOiBcIlwiO1xuICAgICAgICAgIHByb2dyZXNzU3RyICs9IHRoaXMucHJvZ3Jlc3MgfCAwO1xuICAgICAgICB9XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcycsIFwiXCIgKyBwcm9ncmVzc1N0cik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPj0gMTAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gQmFyO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50cygpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICB9XG5cbiAgICBFdmVudHMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjIgPSB0aGlzLmJpbmRpbmdzW25hbWVdO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBiaW5kaW5nID0gX3JlZjJbX2pdO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy5jYWxsKHRoaXMsIHZhbCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRXZlbnRzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgICB2YXIgX2Jhc2U7XG4gICAgICBpZiAoKF9iYXNlID0gdGhpcy5iaW5kaW5ncylbbmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtuYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbbmFtZV0ucHVzaChmbik7XG4gICAgfTtcblxuICAgIHJldHVybiBFdmVudHM7XG5cbiAgfSkoKTtcblxuICBfWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XG5cbiAgX1hEb21haW5SZXF1ZXN0ID0gd2luZG93LlhEb21haW5SZXF1ZXN0O1xuXG4gIF9XZWJTb2NrZXQgPSB3aW5kb3cuV2ViU29ja2V0O1xuXG4gIGV4dGVuZE5hdGl2ZSA9IGZ1bmN0aW9uKHRvLCBmcm9tKSB7XG4gICAgdmFyIGUsIGtleSwgX3Jlc3VsdHM7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiBmcm9tLnByb3RvdHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCh0b1trZXldID09IG51bGwpICYmIHR5cGVvZiBmcm9tW2tleV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIGtleSwge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tLnByb3RvdHlwZVtrZXldO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0b1trZXldID0gZnJvbS5wcm90b3R5cGVba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBpZ25vcmVTdGFjayA9IFtdO1xuXG4gIFBhY2UuaWdub3JlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XG4gICAgZm4gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGlnbm9yZVN0YWNrLnVuc2hpZnQoJ2lnbm9yZScpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBQYWNlLnRyYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XG4gICAgZm4gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGlnbm9yZVN0YWNrLnVuc2hpZnQoJ3RyYWNrJyk7XG4gICAgcmV0ID0gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgaWdub3JlU3RhY2suc2hpZnQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIHNob3VsZFRyYWNrID0gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgdmFyIF9yZWYyO1xuICAgIGlmIChtZXRob2QgPT0gbnVsbCkge1xuICAgICAgbWV0aG9kID0gJ0dFVCc7XG4gICAgfVxuICAgIGlmIChpZ25vcmVTdGFja1swXSA9PT0gJ3RyYWNrJykge1xuICAgICAgcmV0dXJuICdmb3JjZSc7XG4gICAgfVxuICAgIGlmICghaWdub3JlU3RhY2subGVuZ3RoICYmIG9wdGlvbnMuYWpheCkge1xuICAgICAgaWYgKG1ldGhvZCA9PT0gJ3NvY2tldCcgJiYgb3B0aW9ucy5hamF4LnRyYWNrV2ViU29ja2V0cykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoX3JlZjIgPSBtZXRob2QudG9VcHBlckNhc2UoKSwgX19pbmRleE9mLmNhbGwob3B0aW9ucy5hamF4LnRyYWNrTWV0aG9kcywgX3JlZjIpID49IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBSZXF1ZXN0SW50ZXJjZXB0ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZXF1ZXN0SW50ZXJjZXB0LCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gUmVxdWVzdEludGVyY2VwdCgpIHtcbiAgICAgIHZhciBtb25pdG9yWEhSLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICBSZXF1ZXN0SW50ZXJjZXB0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgbW9uaXRvclhIUiA9IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB2YXIgX29wZW47XG4gICAgICAgIF9vcGVuID0gcmVxLm9wZW47XG4gICAgICAgIHJldHVybiByZXEub3BlbiA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgYXN5bmMpIHtcbiAgICAgICAgICBpZiAoc2hvdWxkVHJhY2sodHlwZSkpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX29wZW4uYXBwbHkocmVxLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uKGZsYWdzKSB7XG4gICAgICAgIHZhciByZXE7XG4gICAgICAgIHJlcSA9IG5ldyBfWE1MSHR0cFJlcXVlc3QoZmxhZ3MpO1xuICAgICAgICBtb25pdG9yWEhSKHJlcSk7XG4gICAgICAgIHJldHVybiByZXE7XG4gICAgICB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0KTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIGlmIChfWERvbWFpblJlcXVlc3QgIT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgIHJlcSA9IG5ldyBfWERvbWFpblJlcXVlc3Q7XG4gICAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YRG9tYWluUmVxdWVzdCwgX1hEb21haW5SZXF1ZXN0KTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgfVxuICAgICAgaWYgKChfV2ViU29ja2V0ICE9IG51bGwpICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgd2luZG93LldlYlNvY2tldCA9IGZ1bmN0aW9uKHVybCwgcHJvdG9jb2xzKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICBpZiAocHJvdG9jb2xzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCwgcHJvdG9jb2xzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxID0gbmV3IF9XZWJTb2NrZXQodXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKCdzb2NrZXQnKSkge1xuICAgICAgICAgICAgX3RoaXMudHJpZ2dlcigncmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgdHlwZTogJ3NvY2tldCcsXG4gICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICBwcm90b2NvbHM6IHByb3RvY29scyxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHRlbmROYXRpdmUod2luZG93LldlYlNvY2tldCwgX1dlYlNvY2tldCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVxdWVzdEludGVyY2VwdDtcblxuICB9KShFdmVudHMpO1xuXG4gIF9pbnRlcmNlcHQgPSBudWxsO1xuXG4gIGdldEludGVyY2VwdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChfaW50ZXJjZXB0ID09IG51bGwpIHtcbiAgICAgIF9pbnRlcmNlcHQgPSBuZXcgUmVxdWVzdEludGVyY2VwdDtcbiAgICB9XG4gICAgcmV0dXJuIF9pbnRlcmNlcHQ7XG4gIH07XG5cbiAgc2hvdWxkSWdub3JlVVJMID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHBhdHRlcm4sIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgX3JlZjIgPSBvcHRpb25zLmFqYXguaWdub3JlVVJMcztcbiAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgIHBhdHRlcm4gPSBfcmVmMltfal07XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZihwYXR0ZXJuKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHBhdHRlcm4udGVzdCh1cmwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGdldEludGVyY2VwdCgpLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24oX2FyZykge1xuICAgIHZhciBhZnRlciwgYXJncywgcmVxdWVzdCwgdHlwZSwgdXJsO1xuICAgIHR5cGUgPSBfYXJnLnR5cGUsIHJlcXVlc3QgPSBfYXJnLnJlcXVlc3QsIHVybCA9IF9hcmcudXJsO1xuICAgIGlmIChzaG91bGRJZ25vcmVVUkwodXJsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIVBhY2UucnVubmluZyAmJiAob3B0aW9ucy5yZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIgIT09IGZhbHNlIHx8IHNob3VsZFRyYWNrKHR5cGUpID09PSAnZm9yY2UnKSkge1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGFmdGVyID0gb3B0aW9ucy5yZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIgfHwgMDtcbiAgICAgIGlmICh0eXBlb2YgYWZ0ZXIgPT09ICdib29sZWFuJykge1xuICAgICAgICBhZnRlciA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0aWxsQWN0aXZlLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVmMywgX3Jlc3VsdHM7XG4gICAgICAgIGlmICh0eXBlID09PSAnc29ja2V0Jykge1xuICAgICAgICAgIHN0aWxsQWN0aXZlID0gcmVxdWVzdC5yZWFkeVN0YXRlIDwgMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9ICgwIDwgKF9yZWYyID0gcmVxdWVzdC5yZWFkeVN0YXRlKSAmJiBfcmVmMiA8IDQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGlsbEFjdGl2ZSkge1xuICAgICAgICAgIFBhY2UucmVzdGFydCgpO1xuICAgICAgICAgIF9yZWYzID0gUGFjZS5zb3VyY2VzO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBfcmVmM1tfal07XG4gICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQWpheE1vbml0b3IpIHtcbiAgICAgICAgICAgICAgc291cmNlLndhdGNoLmFwcGx5KHNvdXJjZSwgYXJncyk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0sIGFmdGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIEFqYXhNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEFqYXhNb25pdG9yKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgIGdldEludGVyY2VwdCgpLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy53YXRjaC5hcHBseShfdGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIEFqYXhNb25pdG9yLnByb3RvdHlwZS53YXRjaCA9IGZ1bmN0aW9uKF9hcmcpIHtcbiAgICAgIHZhciByZXF1ZXN0LCB0cmFja2VyLCB0eXBlLCB1cmw7XG4gICAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICAgIGlmIChzaG91bGRJZ25vcmVVUkwodXJsKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgdHJhY2tlciA9IG5ldyBTb2NrZXRSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5wdXNoKHRyYWNrZXIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQWpheE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBYSFJSZXF1ZXN0VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBYSFJSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KSB7XG4gICAgICB2YXIgZXZlbnQsIHNpemUsIF9qLCBfbGVuMSwgX29ucmVhZHlzdGF0ZWNoYW5nZSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgaWYgKHdpbmRvdy5Qcm9ncmVzc0V2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgc2l6ZSA9IG51bGw7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IF90aGlzLnByb2dyZXNzICsgKDEwMCAtIF90aGlzLnByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIF9yZWYyID0gWydsb2FkJywgJ2Fib3J0JywgJ3RpbWVvdXQnLCAnZXJyb3InXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3JlZjM7XG4gICAgICAgICAgaWYgKChfcmVmMyA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgPT09IDAgfHwgX3JlZjMgPT09IDQpIHtcbiAgICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSAzKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDUwO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHlwZW9mIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPT09IFwiZnVuY3Rpb25cIiA/IF9vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKSA6IHZvaWQgMDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWEhSUmVxdWVzdFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBTb2NrZXRSZXF1ZXN0VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTb2NrZXRSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KSB7XG4gICAgICB2YXIgZXZlbnQsIF9qLCBfbGVuMSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgX3JlZjIgPSBbJ2Vycm9yJywgJ29wZW4nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBldmVudCA9IF9yZWYyW19qXTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gU29ja2V0UmVxdWVzdFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBFbGVtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbGVtZW50TW9uaXRvcihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZWN0b3IsIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdG9ycyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0b3JzID0gW107XG4gICAgICB9XG4gICAgICBfcmVmMiA9IG9wdGlvbnMuc2VsZWN0b3JzO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIHNlbGVjdG9yID0gX3JlZjJbX2pdO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnB1c2gobmV3IEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEVsZW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudFRyYWNrZXIoc2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgdGhpcy5jaGVjaygpO1xuICAgIH1cblxuICAgIEVsZW1lbnRUcmFja2VyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY2hlY2soKTtcbiAgICAgICAgfSksIG9wdGlvbnMuZWxlbWVudHMuY2hlY2tJbnRlcnZhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRUcmFja2VyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEVsZW1lbnRUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRG9jdW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIERvY3VtZW50TW9uaXRvci5wcm90b3R5cGUuc3RhdGVzID0ge1xuICAgICAgbG9hZGluZzogMCxcbiAgICAgIGludGVyYWN0aXZlOiA1MCxcbiAgICAgIGNvbXBsZXRlOiAxMDBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRG9jdW1lbnRNb25pdG9yKCkge1xuICAgICAgdmFyIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gKF9yZWYyID0gdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0pICE9IG51bGwgPyBfcmVmMiA6IDEwMDtcbiAgICAgIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPSBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF90aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXSAhPSBudWxsKSB7XG4gICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBEb2N1bWVudE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBFdmVudExhZ01vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRMYWdNb25pdG9yKCkge1xuICAgICAgdmFyIGF2ZywgaW50ZXJ2YWwsIGxhc3QsIHBvaW50cywgc2FtcGxlcyxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBhdmcgPSAwO1xuICAgICAgc2FtcGxlcyA9IFtdO1xuICAgICAgcG9pbnRzID0gMDtcbiAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkaWZmO1xuICAgICAgICBkaWZmID0gbm93KCkgLSBsYXN0IC0gNTA7XG4gICAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgICAgc2FtcGxlcy5wdXNoKGRpZmYpO1xuICAgICAgICBpZiAoc2FtcGxlcy5sZW5ndGggPiBvcHRpb25zLmV2ZW50TGFnLnNhbXBsZUNvdW50KSB7XG4gICAgICAgICAgc2FtcGxlcy5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIGF2ZyA9IGF2Z0FtcGxpdHVkZShzYW1wbGVzKTtcbiAgICAgICAgaWYgKCsrcG9pbnRzID49IG9wdGlvbnMuZXZlbnRMYWcubWluU2FtcGxlcyAmJiBhdmcgPCBvcHRpb25zLmV2ZW50TGFnLmxhZ1RocmVzaG9sZCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIHJldHVybiBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiAoMyAvIChhdmcgKyAzKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRXZlbnRMYWdNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgU2NhbGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFNjYWxlcihzb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5sYXN0ID0gdGhpcy5zaW5jZUxhc3RVcGRhdGUgPSAwO1xuICAgICAgdGhpcy5yYXRlID0gb3B0aW9ucy5pbml0aWFsUmF0ZTtcbiAgICAgIHRoaXMuY2F0Y2h1cCA9IDA7XG4gICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5sYXN0UHJvZ3Jlc3MgPSAwO1xuICAgICAgaWYgKHRoaXMuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgU2NhbGVyLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oZnJhbWVUaW1lLCB2YWwpIHtcbiAgICAgIHZhciBzY2FsaW5nO1xuICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgIHZhbCA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XG4gICAgICB9XG4gICAgICBpZiAodmFsID49IDEwMCkge1xuICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA9PT0gdGhpcy5sYXN0KSB7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlICs9IGZyYW1lVGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNpbmNlTGFzdFVwZGF0ZSkge1xuICAgICAgICAgIHRoaXMucmF0ZSA9ICh2YWwgLSB0aGlzLmxhc3QpIC8gdGhpcy5zaW5jZUxhc3RVcGRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYXRjaHVwID0gKHZhbCAtIHRoaXMucHJvZ3Jlc3MpIC8gb3B0aW9ucy5jYXRjaHVwVGltZTtcbiAgICAgICAgdGhpcy5zaW5jZUxhc3RVcGRhdGUgPSAwO1xuICAgICAgICB0aGlzLmxhc3QgPSB2YWw7XG4gICAgICB9XG4gICAgICBpZiAodmFsID4gdGhpcy5wcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2dyZXNzICs9IHRoaXMuY2F0Y2h1cCAqIGZyYW1lVGltZTtcbiAgICAgIH1cbiAgICAgIHNjYWxpbmcgPSAxIC0gTWF0aC5wb3codGhpcy5wcm9ncmVzcyAvIDEwMCwgb3B0aW9ucy5lYXNlRmFjdG9yKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgKz0gc2NhbGluZyAqIHRoaXMucmF0ZSAqIGZyYW1lVGltZTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1pbih0aGlzLmxhc3RQcm9ncmVzcyArIG9wdGlvbnMubWF4UHJvZ3Jlc3NQZXJGcmFtZSwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5tYXgoMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMubGFzdFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2NhbGVyO1xuXG4gIH0pKCk7XG5cbiAgc291cmNlcyA9IG51bGw7XG5cbiAgc2NhbGVycyA9IG51bGw7XG5cbiAgYmFyID0gbnVsbDtcblxuICB1bmlTY2FsZXIgPSBudWxsO1xuXG4gIGFuaW1hdGlvbiA9IG51bGw7XG5cbiAgY2FuY2VsQW5pbWF0aW9uID0gbnVsbDtcblxuICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcblxuICBoYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAob3B0aW9ucy5yZXN0YXJ0T25QdXNoU3RhdGUpIHtcbiAgICAgIHJldHVybiBQYWNlLnJlc3RhcnQoKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSAhPSBudWxsKSB7XG4gICAgX3B1c2hTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZTtcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgICAgcmV0dXJuIF9wdXNoU3RhdGUuYXBwbHkod2luZG93Lmhpc3RvcnksIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgIT0gbnVsbCkge1xuICAgIF9yZXBsYWNlU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcmVwbGFjZVN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBTT1VSQ0VfS0VZUyA9IHtcbiAgICBhamF4OiBBamF4TW9uaXRvcixcbiAgICBlbGVtZW50czogRWxlbWVudE1vbml0b3IsXG4gICAgZG9jdW1lbnQ6IERvY3VtZW50TW9uaXRvcixcbiAgICBldmVudExhZzogRXZlbnRMYWdNb25pdG9yXG4gIH07XG5cbiAgKGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHlwZSwgX2osIF9rLCBfbGVuMSwgX2xlbjIsIF9yZWYyLCBfcmVmMywgX3JlZjQ7XG4gICAgUGFjZS5zb3VyY2VzID0gc291cmNlcyA9IFtdO1xuICAgIF9yZWYyID0gWydhamF4JywgJ2VsZW1lbnRzJywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJ107XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICB0eXBlID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKG9wdGlvbnNbdHlwZV0gIT09IGZhbHNlKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaChuZXcgU09VUkNFX0tFWVNbdHlwZV0ob3B0aW9uc1t0eXBlXSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBfcmVmNCA9IChfcmVmMyA9IG9wdGlvbnMuZXh0cmFTb3VyY2VzKSAhPSBudWxsID8gX3JlZjMgOiBbXTtcbiAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmNC5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgIHNvdXJjZSA9IF9yZWY0W19rXTtcbiAgICAgIHNvdXJjZXMucHVzaChuZXcgc291cmNlKG9wdGlvbnMpKTtcbiAgICB9XG4gICAgUGFjZS5iYXIgPSBiYXIgPSBuZXcgQmFyO1xuICAgIHNjYWxlcnMgPSBbXTtcbiAgICByZXR1cm4gdW5pU2NhbGVyID0gbmV3IFNjYWxlcjtcbiAgfSkoKTtcblxuICBQYWNlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBQYWNlLnRyaWdnZXIoJ3N0b3AnKTtcbiAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBiYXIuZGVzdHJveSgpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IHRydWU7XG4gICAgaWYgKGFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFuaW1hdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBpbml0KCk7XG4gIH07XG5cbiAgUGFjZS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdyZXN0YXJ0Jyk7XG4gICAgUGFjZS5zdG9wKCk7XG4gICAgcmV0dXJuIFBhY2Uuc3RhcnQoKTtcbiAgfTtcblxuICBQYWNlLmdvID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXJ0O1xuICAgIFBhY2UucnVubmluZyA9IHRydWU7XG4gICAgYmFyLnJlbmRlcigpO1xuICAgIHN0YXJ0ID0gbm93KCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgcmV0dXJuIGFuaW1hdGlvbiA9IHJ1bkFuaW1hdGlvbihmdW5jdGlvbihmcmFtZVRpbWUsIGVucXVldWVOZXh0RnJhbWUpIHtcbiAgICAgIHZhciBhdmcsIGNvdW50LCBkb25lLCBlbGVtZW50LCBlbGVtZW50cywgaSwgaiwgcmVtYWluaW5nLCBzY2FsZXIsIHNjYWxlckxpc3QsIHN1bSwgX2osIF9rLCBfbGVuMSwgX2xlbjIsIF9yZWYyO1xuICAgICAgcmVtYWluaW5nID0gMTAwIC0gYmFyLnByb2dyZXNzO1xuICAgICAgY291bnQgPSBzdW0gPSAwO1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBmb3IgKGkgPSBfaiA9IDAsIF9sZW4xID0gc291cmNlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IGkgPSArK19qKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICAgIHNjYWxlckxpc3QgPSBzY2FsZXJzW2ldICE9IG51bGwgPyBzY2FsZXJzW2ldIDogc2NhbGVyc1tpXSA9IFtdO1xuICAgICAgICBlbGVtZW50cyA9IChfcmVmMiA9IHNvdXJjZS5lbGVtZW50cykgIT0gbnVsbCA/IF9yZWYyIDogW3NvdXJjZV07XG4gICAgICAgIGZvciAoaiA9IF9rID0gMCwgX2xlbjIgPSBlbGVtZW50cy5sZW5ndGg7IF9rIDwgX2xlbjI7IGogPSArK19rKSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2pdO1xuICAgICAgICAgIHNjYWxlciA9IHNjYWxlckxpc3Rbal0gIT0gbnVsbCA/IHNjYWxlckxpc3Rbal0gOiBzY2FsZXJMaXN0W2pdID0gbmV3IFNjYWxlcihlbGVtZW50KTtcbiAgICAgICAgICBkb25lICY9IHNjYWxlci5kb25lO1xuICAgICAgICAgIGlmIChzY2FsZXIuZG9uZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgc3VtICs9IHNjYWxlci50aWNrKGZyYW1lVGltZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF2ZyA9IHN1bSAvIGNvdW50O1xuICAgICAgYmFyLnVwZGF0ZSh1bmlTY2FsZXIudGljayhmcmFtZVRpbWUsIGF2ZykpO1xuICAgICAgaWYgKGJhci5kb25lKCkgfHwgZG9uZSB8fCBjYW5jZWxBbmltYXRpb24pIHtcbiAgICAgICAgYmFyLnVwZGF0ZSgxMDApO1xuICAgICAgICBQYWNlLnRyaWdnZXIoJ2RvbmUnKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYmFyLmZpbmlzaCgpO1xuICAgICAgICAgIFBhY2UucnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBQYWNlLnRyaWdnZXIoJ2hpZGUnKTtcbiAgICAgICAgfSwgTWF0aC5tYXgob3B0aW9ucy5naG9zdFRpbWUsIE1hdGgubWF4KG9wdGlvbnMubWluVGltZSAtIChub3coKSAtIHN0YXJ0KSwgMCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbnF1ZXVlTmV4dEZyYW1lKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgUGFjZS5zdGFydCA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG4gICAgZXh0ZW5kKG9wdGlvbnMsIF9vcHRpb25zKTtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBiYXIucmVuZGVyKCk7XG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICBOb1RhcmdldEVycm9yID0gX2Vycm9yO1xuICAgIH1cbiAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWNlJykpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KFBhY2Uuc3RhcnQsIDUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUGFjZS50cmlnZ2VyKCdzdGFydCcpO1xuICAgICAgcmV0dXJuIFBhY2UuZ28oKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3BhY2UnXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFjZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFBhY2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMuc3RhcnRPblBhZ2VMb2FkKSB7XG4gICAgICBQYWNlLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIhZnVuY3Rpb24oZSl7dmFyIHQ7ZS5mbi5zbGlua3k9ZnVuY3Rpb24oYSl7dmFyIHM9ZS5leHRlbmQoe2xhYmVsOlwiQmFja1wiLHRpdGxlOiExLHNwZWVkOjMwMCxyZXNpemU6ITB9LGEpLGk9ZSh0aGlzKSxuPWkuY2hpbGRyZW4oKS5maXJzdCgpO2kuYWRkQ2xhc3MoXCJzbGlua3ktbWVudVwiKTt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciBhPU1hdGgucm91bmQocGFyc2VJbnQobi5nZXQoMCkuc3R5bGUubGVmdCkpfHwwO24uY3NzKFwibGVmdFwiLGEtMTAwKmUrXCIlXCIpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJnNldFRpbWVvdXQodCxzLnNwZWVkKX0sbD1mdW5jdGlvbihlKXtpLmhlaWdodChlLm91dGVySGVpZ2h0KCkpfSxkPWZ1bmN0aW9uKGUpe2kuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLGUrXCJtc1wiKSxuLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixlK1wibXNcIil9O2lmKGQocy5zcGVlZCksZShcImEgKyB1bFwiLGkpLnByZXYoKS5hZGRDbGFzcyhcIm5leHRcIiksZShcImxpID4gdWxcIixpKS5wcmVwZW5kKCc8bGkgY2xhc3M9XCJoZWFkZXJcIj4nKSxzLnRpdGxlPT09ITAmJmUoXCJsaSA+IHVsXCIsaSkuZWFjaChmdW5jdGlvbigpe3ZhciB0PWUodGhpcykucGFyZW50KCkuZmluZChcImFcIikuZmlyc3QoKS50ZXh0KCksYT1lKFwiPGgyPlwiKS50ZXh0KHQpO2UoXCI+IC5oZWFkZXJcIix0aGlzKS5hcHBlbmQoYSl9KSxzLnRpdGxlfHxzLmxhYmVsIT09ITApe3ZhciBvPWUoXCI8YT5cIikudGV4dChzLmxhYmVsKS5wcm9wKFwiaHJlZlwiLFwiI1wiKS5hZGRDbGFzcyhcImJhY2tcIik7ZShcIi5oZWFkZXJcIixpKS5hcHBlbmQobyl9ZWxzZSBlKFwibGkgPiB1bFwiLGkpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1lKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJhXCIpLmZpcnN0KCkudGV4dCgpLGE9ZShcIjxhPlwiKS50ZXh0KHQpLnByb3AoXCJocmVmXCIsXCIjXCIpLmFkZENsYXNzKFwiYmFja1wiKTtlKFwiPiAuaGVhZGVyXCIsdGhpcykuYXBwZW5kKGEpfSk7ZShcImFcIixpKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oYSl7aWYoISh0K3Muc3BlZWQ+RGF0ZS5ub3coKSkpe3Q9RGF0ZS5ub3coKTt2YXIgbj1lKHRoaXMpOy8jLy50ZXN0KHRoaXMuaHJlZikmJmEucHJldmVudERlZmF1bHQoKSxuLmhhc0NsYXNzKFwibmV4dFwiKT8oaS5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxuLm5leHQoKS5zaG93KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIikscigxKSxzLnJlc2l6ZSYmbChuLm5leHQoKSkpOm4uaGFzQ2xhc3MoXCJiYWNrXCIpJiYocigtMSxmdW5jdGlvbigpe2kuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksbi5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKCkucGFyZW50c1VudGlsKGksXCJ1bFwiKS5maXJzdCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpfSkscy5yZXNpemUmJmwobi5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnRzVW50aWwoaSxcInVsXCIpKSl9fSksdGhpcy5qdW1wPWZ1bmN0aW9uKHQsYSl7dD1lKHQpO3ZhciBuPWkuZmluZChcIi5hY3RpdmVcIik7bj1uLmxlbmd0aD4wP24ucGFyZW50c1VudGlsKGksXCJ1bFwiKS5sZW5ndGg6MCxpLmZpbmQoXCJ1bFwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5oaWRlKCk7dmFyIG89dC5wYXJlbnRzVW50aWwoaSxcInVsXCIpO28uc2hvdygpLHQuc2hvdygpLmFkZENsYXNzKFwiYWN0aXZlXCIpLGE9PT0hMSYmZCgwKSxyKG8ubGVuZ3RoLW4pLHMucmVzaXplJiZsKHQpLGE9PT0hMSYmZChzLnNwZWVkKX0sdGhpcy5ob21lPWZ1bmN0aW9uKHQpe3Q9PT0hMSYmZCgwKTt2YXIgYT1pLmZpbmQoXCIuYWN0aXZlXCIpLG49YS5wYXJlbnRzVW50aWwoaSxcImxpXCIpLmxlbmd0aDtuPjAmJihyKC1uLGZ1bmN0aW9uKCl7YS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKX0pLHMucmVzaXplJiZsKGUoYS5wYXJlbnRzVW50aWwoaSxcImxpXCIpLmdldChuLTEpKS5wYXJlbnQoKSkpLHQ9PT0hMSYmZChzLnNwZWVkKX0sdGhpcy5kZXN0cm95PWZ1bmN0aW9uKCl7ZShcIi5oZWFkZXJcIixpKS5yZW1vdmUoKSxlKFwiYVwiLGkpLnJlbW92ZUNsYXNzKFwibmV4dFwiKS5vZmYoXCJjbGlja1wiKSxpLnJlbW92ZUNsYXNzKFwic2xpbmt5LW1lbnVcIikuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLFwiXCIpLG4uY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLFwiXCIpfTt2YXIgYz1pLmZpbmQoXCIuYWN0aXZlXCIpO3JldHVybiBjLmxlbmd0aD4wJiYoYy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSx0aGlzLmp1bXAoYywhMSkpLHRoaXN9fShqUXVlcnkpOyIsInZhciB0bnMgPSAoZnVuY3Rpb24gKCl7XG4vLyBPYmplY3Qua2V5c1xuaWYgKCFPYmplY3Qua2V5cykge1xuICBPYmplY3Qua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICBrZXlzLnB1c2gobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9O1xufVxuXG4vLyBDaGlsZE5vZGUucmVtb3ZlXG5pZighKFwicmVtb3ZlXCIgaW4gRWxlbWVudC5wcm90b3R5cGUpKXtcbiAgRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICBpZih0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciB3aW4gPSB3aW5kb3c7XG5cbnZhciByYWYgPSB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDE2KTsgfTtcblxudmFyIHdpbiQxID0gd2luZG93O1xuXG52YXIgY2FmID0gd2luJDEuY2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luJDEubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oaWQpeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gIHZhciBvYmosIG5hbWUsIGNvcHksXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sXG4gICAgICBpID0gMSxcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgob2JqID0gYXJndW1lbnRzW2ldKSAhPT0gbnVsbCkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBjb3B5ID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh0YXJnZXQgPT09IGNvcHkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RvcmFnZVZhbHVlICh2YWx1ZSkge1xuICByZXR1cm4gWyd0cnVlJywgJ2ZhbHNlJ10uaW5kZXhPZih2YWx1ZSkgPj0gMCA/IEpTT04ucGFyc2UodmFsdWUpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHNldExvY2FsU3RvcmFnZShzdG9yYWdlLCBrZXksIHZhbHVlLCBhY2Nlc3MpIHtcbiAgaWYgKGFjY2Vzcykge1xuICAgIHRyeSB7IHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTsgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldFNsaWRlSWQoKSB7XG4gIHZhciBpZCA9IHdpbmRvdy50bnNJZDtcbiAgd2luZG93LnRuc0lkID0gIWlkID8gMSA6IGlkICsgMTtcbiAgXG4gIHJldHVybiAndG5zJyArIHdpbmRvdy50bnNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0Qm9keSAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBkb2MuYm9keTtcblxuICBpZiAoIWJvZHkpIHtcbiAgICBib2R5ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2JvZHknKTtcbiAgICBib2R5LmZha2UgPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59XG5cbnZhciBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5mdW5jdGlvbiBzZXRGYWtlQm9keSAoYm9keSkge1xuICB2YXIgZG9jT3ZlcmZsb3cgPSAnJztcbiAgaWYgKGJvZHkuZmFrZSkge1xuICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcbiAgICAvL2F2b2lkIGNyYXNoaW5nIElFOCwgaWYgYmFja2dyb3VuZCBpbWFnZSBpcyB1c2VkXG4gICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gICAgLy9TYWZhcmkgNS4xMy81LjEuNCBPU1ggc3RvcHMgbG9hZGluZyBpZiA6Oi13ZWJraXQtc2Nyb2xsYmFyIGlzIHVzZWQgYW5kIHNjcm9sbGJhcnMgYXJlIHZpc2libGVcbiAgICBib2R5LnN0eWxlLm92ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XG4gIH1cblxuICByZXR1cm4gZG9jT3ZlcmZsb3c7XG59XG5cbmZ1bmN0aW9uIHJlc2V0RmFrZUJvZHkgKGJvZHksIGRvY092ZXJmbG93KSB7XG4gIGlmIChib2R5LmZha2UpIHtcbiAgICBib2R5LnJlbW92ZSgpO1xuICAgIGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBkb2NPdmVyZmxvdztcbiAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICB9XG59XG5cbi8vIGdldCBjc3MtY2FsYyBcblxuZnVuY3Rpb24gY2FsYygpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LCBcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgdHJ5IHtcbiAgICB2YXIgc3RyID0gJygxMHB4ICogMTApJyxcbiAgICAgICAgdmFscyA9IFsnY2FsYycgKyBzdHIsICctbW96LWNhbGMnICsgc3RyLCAnLXdlYmtpdC1jYWxjJyArIHN0cl0sXG4gICAgICAgIHZhbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgdmFsID0gdmFsc1tpXTtcbiAgICAgIGRpdi5zdHlsZS53aWR0aCA9IHZhbDtcbiAgICAgIGlmIChkaXYub2Zmc2V0V2lkdGggPT09IDEwMCkgeyBcbiAgICAgICAgcmVzdWx0ID0gdmFsLnJlcGxhY2Uoc3RyLCAnJyk7IFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIFxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGRpdi5yZW1vdmUoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBnZXQgc3VicGl4ZWwgc3VwcG9ydCB2YWx1ZVxuXG5mdW5jdGlvbiBwZXJjZW50YWdlTGF5b3V0KCkge1xuICAvLyBjaGVjayBzdWJwaXhlbCBsYXlvdXQgc3VwcG9ydGluZ1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIHdyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBvdXRlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIHN0ciA9ICcnLFxuICAgICAgY291bnQgPSA3MCxcbiAgICAgIHBlclBhZ2UgPSAzLFxuICAgICAgc3VwcG9ydGVkID0gZmFsc2U7XG5cbiAgd3JhcHBlci5jbGFzc05hbWUgPSBcInRucy10LXN1YnAyXCI7XG4gIG91dGVyLmNsYXNzTmFtZSA9IFwidG5zLXQtY3RcIjtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICBzdHIgKz0gJzxkaXY+PC9kaXY+JztcbiAgfVxuXG4gIG91dGVyLmlubmVySFRNTCA9IHN0cjtcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlcik7XG4gIGJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cbiAgc3VwcG9ydGVkID0gTWF0aC5hYnMod3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gb3V0ZXIuY2hpbGRyZW5bY291bnQgLSBwZXJQYWdlXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSA8IDI7XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiB3cmFwcGVyLnJlbW92ZSgpO1xuXG4gIHJldHVybiBzdXBwb3J0ZWQ7XG59XG5cbmZ1bmN0aW9uIG1lZGlhcXVlcnlTdXBwb3J0ICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBzdHlsZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgcnVsZSA9ICdAbWVkaWEgYWxsIGFuZCAobWluLXdpZHRoOjFweCl7LnRucy1tcS10ZXN0e3Bvc2l0aW9uOmFic29sdXRlfX0nLFxuICAgICAgcG9zaXRpb247XG5cbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIGRpdi5jbGFzc05hbWUgPSAndG5zLW1xLXRlc3QnO1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICBib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBydWxlO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XG4gIH1cblxuICBwb3NpdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2KS5wb3NpdGlvbiA6IGRpdi5jdXJyZW50U3R5bGVbJ3Bvc2l0aW9uJ107XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBkaXYucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHBvc2l0aW9uID09PSBcImFic29sdXRlXCI7XG59XG5cbi8vIGNyZWF0ZSBhbmQgYXBwZW5kIHN0eWxlIHNoZWV0XG5mdW5jdGlvbiBjcmVhdGVTdHlsZVNoZWV0IChtZWRpYSkge1xuICAvLyBDcmVhdGUgdGhlIDxzdHlsZT4gdGFnXG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvY3NzXCIpO1xuXG4gIC8vIEFkZCBhIG1lZGlhIChhbmQvb3IgbWVkaWEgcXVlcnkpIGhlcmUgaWYgeW91J2QgbGlrZSFcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgXCJzY3JlZW5cIilcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6IDEwMjRweClcIilcbiAgaWYgKG1lZGlhKSB7IHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKTsgfVxuXG4gIC8vIFdlYktpdCBoYWNrIDooXG4gIC8vIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpKTtcblxuICAvLyBBZGQgdGhlIDxzdHlsZT4gZWxlbWVudCB0byB0aGUgcGFnZVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gIHJldHVybiBzdHlsZS5zaGVldCA/IHN0eWxlLnNoZWV0IDogc3R5bGUuc3R5bGVTaGVldDtcbn1cblxuLy8gY3Jvc3MgYnJvd3NlcnMgYWRkUnVsZSBtZXRob2RcbmZ1bmN0aW9uIGFkZENTU1J1bGUoc2hlZXQsIHNlbGVjdG9yLCBydWxlcywgaW5kZXgpIHtcbiAgLy8gcmV0dXJuIHJhZihmdW5jdGlvbigpIHtcbiAgICAnaW5zZXJ0UnVsZScgaW4gc2hlZXQgP1xuICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIHJ1bGVzICsgJ30nLCBpbmRleCkgOlxuICAgICAgc2hlZXQuYWRkUnVsZShzZWxlY3RvciwgcnVsZXMsIGluZGV4KTtcbiAgLy8gfSk7XG59XG5cbi8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXG5mdW5jdGlvbiByZW1vdmVDU1NSdWxlKHNoZWV0LCBpbmRleCkge1xuICAvLyByZXR1cm4gcmFmKGZ1bmN0aW9uKCkge1xuICAgICdkZWxldGVSdWxlJyBpbiBzaGVldCA/XG4gICAgICBzaGVldC5kZWxldGVSdWxlKGluZGV4KSA6XG4gICAgICBzaGVldC5yZW1vdmVSdWxlKGluZGV4KTtcbiAgLy8gfSk7XG59XG5cbmZ1bmN0aW9uIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSB7XG4gIHZhciBydWxlID0gKCdpbnNlcnRSdWxlJyBpbiBzaGVldCkgPyBzaGVldC5jc3NSdWxlcyA6IHNoZWV0LnJ1bGVzO1xuICByZXR1cm4gcnVsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIHRvRGVncmVlICh5LCB4KSB7XG4gIHJldHVybiBNYXRoLmF0YW4yKHksIHgpICogKDE4MCAvIE1hdGguUEkpO1xufVxuXG5mdW5jdGlvbiBnZXRUb3VjaERpcmVjdGlvbihhbmdsZSwgcmFuZ2UpIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGZhbHNlLFxuICAgICAgZ2FwID0gTWF0aC5hYnMoOTAgLSBNYXRoLmFicyhhbmdsZSkpO1xuICAgICAgXG4gIGlmIChnYXAgPj0gOTAgLSByYW5nZSkge1xuICAgIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgfSBlbHNlIGlmIChnYXAgPD0gcmFuZ2UpIHtcbiAgICBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGlvbjtcbn1cblxuLy8gaHR0cHM6Ly90b2RkbW90dG8uY29tL2RpdGNoLXRoZS1hcnJheS1mb3JlYWNoLWNhbGwtbm9kZWxpc3QtaGFjay9cbmZ1bmN0aW9uIGZvckVhY2ggKGFyciwgY2FsbGJhY2ssIHNjb3BlKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGFycltpXSwgaSk7XG4gIH1cbn1cblxudmFyIGNsYXNzTGlzdFN1cHBvcnQgPSAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdfJyk7XG5cbnZhciBoYXNDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7IHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoc3RyKTsgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTmFtZS5pbmRleE9mKHN0cikgPj0gMDsgfTtcblxudmFyIGFkZENsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmICghaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5hZGQoc3RyKTsgfVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoIWhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc05hbWUgKz0gJyAnICsgc3RyOyB9XG4gICAgfTtcblxudmFyIHJlbW92ZUNsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NMaXN0LnJlbW92ZShzdHIpOyB9XG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhlbCwgc3RyKSkgeyBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShzdHIsICcnKTsgfVxuICAgIH07XG5cbmZ1bmN0aW9uIGhhc0F0dHIoZWwsIGF0dHIpIHtcbiAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShhdHRyKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXR0cihlbCwgYXR0cikge1xuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xufVxuXG5mdW5jdGlvbiBpc05vZGVMaXN0KGVsKSB7XG4gIC8vIE9ubHkgTm9kZUxpc3QgaGFzIHRoZSBcIml0ZW0oKVwiIGZ1bmN0aW9uXG4gIHJldHVybiB0eXBlb2YgZWwuaXRlbSAhPT0gXCJ1bmRlZmluZWRcIjsgXG59XG5cbmZ1bmN0aW9uIHNldEF0dHJzKGVscywgYXR0cnMpIHtcbiAgZWxzID0gKGlzTm9kZUxpc3QoZWxzKSB8fCBlbHMgaW5zdGFuY2VvZiBBcnJheSkgPyBlbHMgOiBbZWxzXTtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhdHRycykgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7IHJldHVybjsgfVxuXG4gIGZvciAodmFyIGkgPSBlbHMubGVuZ3RoOyBpLS07KSB7XG4gICAgZm9yKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgIGVsc1tpXS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQXR0cnMoZWxzLCBhdHRycykge1xuICBlbHMgPSAoaXNOb2RlTGlzdChlbHMpIHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSA/IGVscyA6IFtlbHNdO1xuICBhdHRycyA9IChhdHRycyBpbnN0YW5jZW9mIEFycmF5KSA/IGF0dHJzIDogW2F0dHJzXTtcblxuICB2YXIgYXR0ckxlbmd0aCA9IGF0dHJzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IGVscy5sZW5ndGg7IGktLTspIHtcbiAgICBmb3IgKHZhciBqID0gYXR0ckxlbmd0aDsgai0tOykge1xuICAgICAgZWxzW2ldLnJlbW92ZUF0dHJpYnV0ZShhdHRyc1tqXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFycmF5RnJvbU5vZGVMaXN0IChubCkge1xuICB2YXIgYXJyID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gbmwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYXJyLnB1c2gobmxbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGhpZGVFbGVtZW50KGVsLCBmb3JjZUhpZGUpIHtcbiAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykgeyBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyB9XG59XG5cbmZ1bmN0aW9uIHNob3dFbGVtZW50KGVsLCBmb3JjZUhpZGUpIHtcbiAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykgeyBlbC5zdHlsZS5kaXNwbGF5ID0gJyc7IH1cbn1cblxuZnVuY3Rpb24gaXNWaXNpYmxlKGVsKSB7XG4gIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSAhPT0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB3aGljaFByb3BlcnR5KHByb3BzKXtcbiAgaWYgKHR5cGVvZiBwcm9wcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgYXJyID0gW3Byb3BzXSxcbiAgICAgICAgUHJvcHMgPSBwcm9wcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BzLnN1YnN0cigxKSxcbiAgICAgICAgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnLCAnTyddO1xuICAgICAgICBcbiAgICBwcmVmaXhlcy5mb3JFYWNoKGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgaWYgKHByZWZpeCAhPT0gJ21zJyB8fCBwcm9wcyA9PT0gJ3RyYW5zZm9ybScpIHtcbiAgICAgICAgYXJyLnB1c2gocHJlZml4ICsgUHJvcHMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcHJvcHMgPSBhcnI7XG4gIH1cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmYWtlZWxlbWVudCcpLFxuICAgICAgbGVuID0gcHJvcHMubGVuZ3RoO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspe1xuICAgIHZhciBwcm9wID0gcHJvcHNbaV07XG4gICAgaWYoIGVsLnN0eWxlW3Byb3BdICE9PSB1bmRlZmluZWQgKXsgcmV0dXJuIHByb3A7IH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTsgLy8gZXhwbGljaXQgZm9yIGllOS1cbn1cblxuZnVuY3Rpb24gaGFzM0RUcmFuc2Zvcm1zKHRmKXtcbiAgaWYgKCF0ZikgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKCF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpLFxuICAgICAgaGFzM2QsXG4gICAgICBjc3NURiA9IHRmLmxlbmd0aCA+IDkgPyAnLScgKyB0Zi5zbGljZSgwLCAtOSkudG9Mb3dlckNhc2UoKSArICctJyA6ICcnO1xuXG4gIGNzc1RGICs9ICd0cmFuc2Zvcm0nO1xuXG4gIC8vIEFkZCBpdCB0byB0aGUgYm9keSB0byBnZXQgdGhlIGNvbXB1dGVkIHN0eWxlXG4gIGJvZHkuaW5zZXJ0QmVmb3JlKGVsLCBudWxsKTtcblxuICBlbC5zdHlsZVt0Zl0gPSAndHJhbnNsYXRlM2QoMXB4LDFweCwxcHgpJztcbiAgaGFzM2QgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShjc3NURik7XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBlbC5yZW1vdmUoKTtcblxuICByZXR1cm4gKGhhczNkICE9PSB1bmRlZmluZWQgJiYgaGFzM2QubGVuZ3RoID4gMCAmJiBoYXMzZCAhPT0gXCJub25lXCIpO1xufVxuXG4vLyBnZXQgdHJhbnNpdGlvbmVuZCwgYW5pbWF0aW9uZW5kIGJhc2VkIG9uIHRyYW5zaXRpb25EdXJhdGlvblxuLy8gQHByb3Bpbjogc3RyaW5nXG4vLyBAcHJvcE91dDogc3RyaW5nLCBmaXJzdC1sZXR0ZXIgdXBwZXJjYXNlXG4vLyBVc2FnZTogZ2V0RW5kUHJvcGVydHkoJ1dlYmtpdFRyYW5zaXRpb25EdXJhdGlvbicsICdUcmFuc2l0aW9uJykgPT4gd2Via2l0VHJhbnNpdGlvbkVuZFxuZnVuY3Rpb24gZ2V0RW5kUHJvcGVydHkocHJvcEluLCBwcm9wT3V0KSB7XG4gIHZhciBlbmRQcm9wID0gZmFsc2U7XG4gIGlmICgvXldlYmtpdC8udGVzdChwcm9wSW4pKSB7XG4gICAgZW5kUHJvcCA9ICd3ZWJraXQnICsgcHJvcE91dCArICdFbmQnO1xuICB9IGVsc2UgaWYgKC9eTy8udGVzdChwcm9wSW4pKSB7XG4gICAgZW5kUHJvcCA9ICdvJyArIHByb3BPdXQgKyAnRW5kJztcbiAgfSBlbHNlIGlmIChwcm9wSW4pIHtcbiAgICBlbmRQcm9wID0gcHJvcE91dC50b0xvd2VyQ2FzZSgpICsgJ2VuZCc7XG4gIH1cbiAgcmV0dXJuIGVuZFByb3A7XG59XG5cbi8vIFRlc3QgdmlhIGEgZ2V0dGVyIGluIHRoZSBvcHRpb25zIG9iamVjdCB0byBzZWUgaWYgdGhlIHBhc3NpdmUgcHJvcGVydHkgaXMgYWNjZXNzZWRcbnZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcbnRyeSB7XG4gIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIiwgbnVsbCwgb3B0cyk7XG59IGNhdGNoIChlKSB7fVxudmFyIHBhc3NpdmVPcHRpb24gPSBzdXBwb3J0c1Bhc3NpdmUgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlO1xuXG5mdW5jdGlvbiBhZGRFdmVudHMoZWwsIG9iaiwgcHJldmVudFNjcm9sbGluZykge1xuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwICYmICFwcmV2ZW50U2Nyb2xsaW5nID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50cyhlbCwgb2JqKSB7XG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgdmFyIG9wdGlvbiA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnXS5pbmRleE9mKHByb3ApID49IDAgPyBwYXNzaXZlT3B0aW9uIDogZmFsc2U7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihwcm9wLCBvYmpbcHJvcF0sIG9wdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gRXZlbnRzKCkge1xuICByZXR1cm4ge1xuICAgIHRvcGljczoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdID0gdGhpcy50b3BpY3NbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgIGRhdGEudHlwZSA9IGV2ZW50TmFtZTtcbiAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgIGZuKGRhdGEsIGV2ZW50TmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24ganNUcmFuc2Zvcm0oZWxlbWVudCwgYXR0ciwgcHJlZml4LCBwb3N0Zml4LCB0bywgZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciB0aWNrID0gTWF0aC5taW4oZHVyYXRpb24sIDEwKSxcbiAgICAgIHVuaXQgPSAodG8uaW5kZXhPZignJScpID49IDApID8gJyUnIDogJ3B4JyxcbiAgICAgIHRvID0gdG8ucmVwbGFjZSh1bml0LCAnJyksXG4gICAgICBmcm9tID0gTnVtYmVyKGVsZW1lbnQuc3R5bGVbYXR0cl0ucmVwbGFjZShwcmVmaXgsICcnKS5yZXBsYWNlKHBvc3RmaXgsICcnKS5yZXBsYWNlKHVuaXQsICcnKSksXG4gICAgICBwb3NpdGlvblRpY2sgPSAodG8gLSBmcm9tKSAvIGR1cmF0aW9uICogdGljayxcbiAgICAgIHJ1bm5pbmc7XG5cbiAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7XG4gIGZ1bmN0aW9uIG1vdmVFbGVtZW50KCkge1xuICAgIGR1cmF0aW9uIC09IHRpY2s7XG4gICAgZnJvbSArPSBwb3NpdGlvblRpY2s7XG4gICAgZWxlbWVudC5zdHlsZVthdHRyXSA9IHByZWZpeCArIGZyb20gKyB1bml0ICsgcG9zdGZpeDtcbiAgICBpZiAoZHVyYXRpb24gPiAwKSB7IFxuICAgICAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7IFxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgdG5zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gZXh0ZW5kKHtcbiAgICBjb250YWluZXI6ICcuc2xpZGVyJyxcbiAgICBtb2RlOiAnY2Fyb3VzZWwnLFxuICAgIGF4aXM6ICdob3Jpem9udGFsJyxcbiAgICBpdGVtczogMSxcbiAgICBndXR0ZXI6IDAsXG4gICAgZWRnZVBhZGRpbmc6IDAsXG4gICAgZml4ZWRXaWR0aDogZmFsc2UsXG4gICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICB2aWV3cG9ydE1heDogZmFsc2UsXG4gICAgc2xpZGVCeTogMSxcbiAgICBjZW50ZXI6IGZhbHNlLFxuICAgIGNvbnRyb2xzOiB0cnVlLFxuICAgIGNvbnRyb2xzUG9zaXRpb246ICd0b3AnLFxuICAgIGNvbnRyb2xzVGV4dDogWydwcmV2JywgJ25leHQnXSxcbiAgICBjb250cm9sc0NvbnRhaW5lcjogZmFsc2UsXG4gICAgcHJldkJ1dHRvbjogZmFsc2UsXG4gICAgbmV4dEJ1dHRvbjogZmFsc2UsXG4gICAgbmF2OiB0cnVlLFxuICAgIG5hdlBvc2l0aW9uOiAndG9wJyxcbiAgICBuYXZDb250YWluZXI6IGZhbHNlLFxuICAgIG5hdkFzVGh1bWJuYWlsczogZmFsc2UsXG4gICAgYXJyb3dLZXlzOiBmYWxzZSxcbiAgICBzcGVlZDogMzAwLFxuICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICBhdXRvcGxheVBvc2l0aW9uOiAndG9wJyxcbiAgICBhdXRvcGxheVRpbWVvdXQ6IDUwMDAsXG4gICAgYXV0b3BsYXlEaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgICBhdXRvcGxheVRleHQ6IFsnc3RhcnQnLCAnc3RvcCddLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogZmFsc2UsXG4gICAgYXV0b3BsYXlCdXR0b246IGZhbHNlLFxuICAgIGF1dG9wbGF5QnV0dG9uT3V0cHV0OiB0cnVlLFxuICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiAndG5zLWZhZGVJbicsXG4gICAgYW5pbWF0ZU91dDogJ3Rucy1mYWRlT3V0JyxcbiAgICBhbmltYXRlTm9ybWFsOiAndG5zLW5vcm1hbCcsXG4gICAgYW5pbWF0ZURlbGF5OiBmYWxzZSxcbiAgICBsb29wOiB0cnVlLFxuICAgIHJld2luZDogZmFsc2UsXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXG4gICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgbGF6eWxvYWQ6IGZhbHNlLFxuICAgIGxhenlsb2FkU2VsZWN0b3I6ICcudG5zLWxhenktaW1nJyxcbiAgICB0b3VjaDogdHJ1ZSxcbiAgICBtb3VzZURyYWc6IGZhbHNlLFxuICAgIHN3aXBlQW5nbGU6IDE1LFxuICAgIG5lc3RlZDogZmFsc2UsXG4gICAgcHJldmVudEFjdGlvbldoZW5SdW5uaW5nOiBmYWxzZSxcbiAgICBwcmV2ZW50U2Nyb2xsT25Ub3VjaDogZmFsc2UsXG4gICAgZnJlZXphYmxlOiB0cnVlLFxuICAgIG9uSW5pdDogZmFsc2UsXG4gICAgdXNlTG9jYWxTdG9yYWdlOiB0cnVlXG4gIH0sIG9wdGlvbnMgfHwge30pO1xuICBcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgd2luID0gd2luZG93LFxuICAgICAgS0VZUyA9IHtcbiAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgIExFRlQ6IDM3LFxuICAgICAgICBSSUdIVDogMzlcbiAgICAgIH0sXG4gICAgICB0bnNTdG9yYWdlID0ge30sXG4gICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBvcHRpb25zLnVzZUxvY2FsU3RvcmFnZTtcblxuICBpZiAobG9jYWxTdG9yYWdlQWNjZXNzKSB7XG4gICAgLy8gY2hlY2sgYnJvd3NlciB2ZXJzaW9uIGFuZCBsb2NhbCBzdG9yYWdlIGFjY2Vzc1xuICAgIHZhciBicm93c2VySW5mbyA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgdmFyIHVpZCA9IG5ldyBEYXRlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRuc1N0b3JhZ2UgPSB3aW4ubG9jYWxTdG9yYWdlO1xuICAgICAgaWYgKHRuc1N0b3JhZ2UpIHtcbiAgICAgICAgdG5zU3RvcmFnZS5zZXRJdGVtKHVpZCwgdWlkKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gdG5zU3RvcmFnZS5nZXRJdGVtKHVpZCkgPT0gdWlkO1xuICAgICAgICB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0odWlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2VBY2Nlc3MpIHsgdG5zU3RvcmFnZSA9IHt9OyB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlQWNjZXNzKSB7XG4gICAgICAvLyByZW1vdmUgc3RvcmFnZSB3aGVuIGJyb3dzZXIgdmVyc2lvbiBjaGFuZ2VzXG4gICAgICBpZiAodG5zU3RvcmFnZVsndG5zQXBwJ10gJiYgdG5zU3RvcmFnZVsndG5zQXBwJ10gIT09IGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIFsndEMnLCAndFBMJywgJ3RNUScsICd0VGYnLCAndDNEJywgJ3RURHUnLCAndFREZScsICd0QUR1JywgJ3RBRGUnLCAndFRFJywgJ3RBRSddLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0oaXRlbSk7IH0pO1xuICAgICAgfVxuICAgICAgLy8gdXBkYXRlIGJyb3dzZXJJbmZvXG4gICAgICBsb2NhbFN0b3JhZ2VbJ3Ruc0FwcCddID0gYnJvd3NlckluZm87XG4gICAgfVxuICB9XG5cbiAgdmFyIENBTEMgPSB0bnNTdG9yYWdlWyd0QyddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEMnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RDJywgY2FsYygpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgUEVSQ0VOVEFHRUxBWU9VVCA9IHRuc1N0b3JhZ2VbJ3RQTCddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFBMJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0UEwnLCBwZXJjZW50YWdlTGF5b3V0KCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBDU1NNUSA9IHRuc1N0b3JhZ2VbJ3RNUSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndE1RJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0TVEnLCBtZWRpYXF1ZXJ5U3VwcG9ydCgpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNGT1JNID0gdG5zU3RvcmFnZVsndFRmJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VGYnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RUZicsIHdoaWNoUHJvcGVydHkoJ3RyYW5zZm9ybScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgSEFTM0RUUkFOU0ZPUk1TID0gdG5zU3RvcmFnZVsndDNEJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0M0QnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3QzRCcsIGhhczNEVHJhbnNmb3JtcyhUUkFOU0ZPUk0pLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkRVUkFUSU9OID0gdG5zU3RvcmFnZVsndFREdSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFREdSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFREdScsIHdoaWNoUHJvcGVydHkoJ3RyYW5zaXRpb25EdXJhdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkRFTEFZID0gdG5zU3RvcmFnZVsndFREZSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFREZSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFREZScsIHdoaWNoUHJvcGVydHkoJ3RyYW5zaXRpb25EZWxheScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9ORFVSQVRJT04gPSB0bnNTdG9yYWdlWyd0QUR1J10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QUR1J10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUR1Jywgd2hpY2hQcm9wZXJ0eSgnYW5pbWF0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkRFTEFZID0gdG5zU3RvcmFnZVsndEFEZSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFEZSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFEZScsIHdoaWNoUHJvcGVydHkoJ2FuaW1hdGlvbkRlbGF5JyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9ORU5EID0gdG5zU3RvcmFnZVsndFRFJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VEUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURScsIGdldEVuZFByb3BlcnR5KFRSQU5TSVRJT05EVVJBVElPTiwgJ1RyYW5zaXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkVORCA9IHRuc1N0b3JhZ2VbJ3RBRSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFFJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUUnLCBnZXRFbmRQcm9wZXJ0eShBTklNQVRJT05EVVJBVElPTiwgJ0FuaW1hdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpO1xuXG4gIC8vIGdldCBlbGVtZW50IG5vZGVzIGZyb20gc2VsZWN0b3JzXG4gIHZhciBzdXBwb3J0Q29uc29sZVdhcm4gPSB3aW4uY29uc29sZSAmJiB0eXBlb2Ygd2luLmNvbnNvbGUud2FybiA9PT0gXCJmdW5jdGlvblwiLFxuICAgICAgdG5zTGlzdCA9IFsnY29udGFpbmVyJywgJ2NvbnRyb2xzQ29udGFpbmVyJywgJ3ByZXZCdXR0b24nLCAnbmV4dEJ1dHRvbicsICduYXZDb250YWluZXInLCAnYXV0b3BsYXlCdXR0b24nXSwgXG4gICAgICBvcHRpb25zRWxlbWVudHMgPSB7fTtcbiAgICAgIFxuICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tpdGVtXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBzdHIgPSBvcHRpb25zW2l0ZW1dLFxuICAgICAgICAgIGVsID0gZG9jLnF1ZXJ5U2VsZWN0b3Ioc3RyKTtcbiAgICAgIG9wdGlvbnNFbGVtZW50c1tpdGVtXSA9IHN0cjtcblxuICAgICAgaWYgKGVsICYmIGVsLm5vZGVOYW1lKSB7XG4gICAgICAgIG9wdGlvbnNbaXRlbV0gPSBlbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdDYW5cXCd0IGZpbmQnLCBvcHRpb25zW2l0ZW1dKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBtYWtlIHN1cmUgYXQgbGVhc3QgMSBzbGlkZVxuICBpZiAob3B0aW9ucy5jb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdObyBzbGlkZXMgZm91bmQgaW4nLCBvcHRpb25zLmNvbnRhaW5lcik7IH1cbiAgICByZXR1cm47XG4gICB9XG5cbiAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgdmFyIHJlc3BvbnNpdmUgPSBvcHRpb25zLnJlc3BvbnNpdmUsXG4gICAgICBuZXN0ZWQgPSBvcHRpb25zLm5lc3RlZCxcbiAgICAgIGNhcm91c2VsID0gb3B0aW9ucy5tb2RlID09PSAnY2Fyb3VzZWwnID8gdHJ1ZSA6IGZhbHNlO1xuXG4gIGlmIChyZXNwb25zaXZlKSB7XG4gICAgLy8gYXBwbHkgcmVzcG9uc2l2ZVswXSB0byBvcHRpb25zIGFuZCByZW1vdmUgaXRcbiAgICBpZiAoMCBpbiByZXNwb25zaXZlKSB7XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMsIHJlc3BvbnNpdmVbMF0pO1xuICAgICAgZGVsZXRlIHJlc3BvbnNpdmVbMF07XG4gICAgfVxuXG4gICAgdmFyIHJlc3BvbnNpdmVUZW0gPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgdmFyIHZhbCA9IHJlc3BvbnNpdmVba2V5XTtcbiAgICAgIC8vIHVwZGF0ZSByZXNwb25zaXZlXG4gICAgICAvLyBmcm9tOiAzMDA6IDJcbiAgICAgIC8vIHRvOiBcbiAgICAgIC8vICAgMzAwOiB7IFxuICAgICAgLy8gICAgIGl0ZW1zOiAyIFxuICAgICAgLy8gICB9IFxuICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyB7aXRlbXM6IHZhbH0gOiB2YWw7XG4gICAgICByZXNwb25zaXZlVGVtW2tleV0gPSB2YWw7XG4gICAgfVxuICAgIHJlc3BvbnNpdmUgPSByZXNwb25zaXZlVGVtO1xuICAgIHJlc3BvbnNpdmVUZW0gPSBudWxsO1xuICB9XG5cbiAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgZnVuY3Rpb24gdXBkYXRlT3B0aW9ucyAob2JqKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoa2V5ID09PSAnc2xpZGVCeScpIHsgb2JqW2tleV0gPSAncGFnZSc7IH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2VkZ2VQYWRkaW5nJykgeyBvYmpba2V5XSA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChrZXkgPT09ICdhdXRvSGVpZ2h0JykgeyBvYmpba2V5XSA9IGZhbHNlOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSByZXNwb25zaXZlIG9wdGlvbnNcbiAgICAgIGlmIChrZXkgPT09ICdyZXNwb25zaXZlJykgeyB1cGRhdGVPcHRpb25zKG9ialtrZXldKTsgfVxuICAgIH1cbiAgfVxuICBpZiAoIWNhcm91c2VsKSB7IHVwZGF0ZU9wdGlvbnMob3B0aW9ucyk7IH1cblxuXG4gIC8vID09PSBkZWZpbmUgYW5kIHNldCB2YXJpYWJsZXMgPT09XG4gIGlmICghY2Fyb3VzZWwpIHtcbiAgICBvcHRpb25zLmF4aXMgPSAnaG9yaXpvbnRhbCc7XG4gICAgb3B0aW9ucy5zbGlkZUJ5ID0gJ3BhZ2UnO1xuICAgIG9wdGlvbnMuZWRnZVBhZGRpbmcgPSBmYWxzZTtcblxuICAgIHZhciBhbmltYXRlSW4gPSBvcHRpb25zLmFuaW1hdGVJbixcbiAgICAgICAgYW5pbWF0ZU91dCA9IG9wdGlvbnMuYW5pbWF0ZU91dCxcbiAgICAgICAgYW5pbWF0ZURlbGF5ID0gb3B0aW9ucy5hbmltYXRlRGVsYXksXG4gICAgICAgIGFuaW1hdGVOb3JtYWwgPSBvcHRpb25zLmFuaW1hdGVOb3JtYWw7XG4gIH1cblxuICB2YXIgaG9yaXpvbnRhbCA9IG9wdGlvbnMuYXhpcyA9PT0gJ2hvcml6b250YWwnID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgb3V0ZXJXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgaW5uZXJXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgbWlkZGxlV3JhcHBlcixcbiAgICAgIGNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyLFxuICAgICAgY29udGFpbmVyUGFyZW50ID0gY29udGFpbmVyLnBhcmVudE5vZGUsXG4gICAgICBjb250YWluZXJIVE1MID0gY29udGFpbmVyLm91dGVySFRNTCxcbiAgICAgIHNsaWRlSXRlbXMgPSBjb250YWluZXIuY2hpbGRyZW4sXG4gICAgICBzbGlkZUNvdW50ID0gc2xpZGVJdGVtcy5sZW5ndGgsXG4gICAgICBicmVha3BvaW50Wm9uZSxcbiAgICAgIHdpbmRvd1dpZHRoID0gZ2V0V2luZG93V2lkdGgoKSxcbiAgICAgIGlzT24gPSBmYWxzZTtcbiAgaWYgKHJlc3BvbnNpdmUpIHsgc2V0QnJlYWtwb2ludFpvbmUoKTsgfVxuICBpZiAoY2Fyb3VzZWwpIHsgY29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRucy12cGZpeCc7IH1cblxuICAvLyBmaXhlZFdpZHRoOiB2aWV3cG9ydCA+IHJpZ2h0Qm91bmRhcnkgPiBpbmRleE1heFxuICB2YXIgYXV0b1dpZHRoID0gb3B0aW9ucy5hdXRvV2lkdGgsXG4gICAgICBmaXhlZFdpZHRoID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJyksXG4gICAgICBlZGdlUGFkZGluZyA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnKSxcbiAgICAgIGd1dHRlciA9IGdldE9wdGlvbignZ3V0dGVyJyksXG4gICAgICB2aWV3cG9ydCA9IGdldFZpZXdwb3J0V2lkdGgoKSxcbiAgICAgIGNlbnRlciA9IGdldE9wdGlvbignY2VudGVyJyksXG4gICAgICBpdGVtcyA9ICFhdXRvV2lkdGggPyBNYXRoLmZsb29yKGdldE9wdGlvbignaXRlbXMnKSkgOiAxLFxuICAgICAgc2xpZGVCeSA9IGdldE9wdGlvbignc2xpZGVCeScpLFxuICAgICAgdmlld3BvcnRNYXggPSBvcHRpb25zLnZpZXdwb3J0TWF4IHx8IG9wdGlvbnMuZml4ZWRXaWR0aFZpZXdwb3J0V2lkdGgsXG4gICAgICBhcnJvd0tleXMgPSBnZXRPcHRpb24oJ2Fycm93S2V5cycpLFxuICAgICAgc3BlZWQgPSBnZXRPcHRpb24oJ3NwZWVkJyksXG4gICAgICByZXdpbmQgPSBvcHRpb25zLnJld2luZCxcbiAgICAgIGxvb3AgPSByZXdpbmQgPyBmYWxzZSA6IG9wdGlvbnMubG9vcCxcbiAgICAgIGF1dG9IZWlnaHQgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnKSxcbiAgICAgIGNvbnRyb2xzID0gZ2V0T3B0aW9uKCdjb250cm9scycpLFxuICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKSxcbiAgICAgIG5hdiA9IGdldE9wdGlvbignbmF2JyksXG4gICAgICB0b3VjaCA9IGdldE9wdGlvbigndG91Y2gnKSxcbiAgICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyksXG4gICAgICBhdXRvcGxheSA9IGdldE9wdGlvbignYXV0b3BsYXknKSxcbiAgICAgIGF1dG9wbGF5VGltZW91dCA9IGdldE9wdGlvbignYXV0b3BsYXlUaW1lb3V0JyksXG4gICAgICBhdXRvcGxheVRleHQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGV4dCcpLFxuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID0gZ2V0T3B0aW9uKCdhdXRvcGxheUhvdmVyUGF1c2UnKSxcbiAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5UmVzZXRPblZpc2liaWxpdHknKSxcbiAgICAgIHNoZWV0ID0gY3JlYXRlU3R5bGVTaGVldCgpLFxuICAgICAgbGF6eWxvYWQgPSBvcHRpb25zLmxhenlsb2FkLFxuICAgICAgbGF6eWxvYWRTZWxlY3RvciA9IG9wdGlvbnMubGF6eWxvYWRTZWxlY3RvcixcbiAgICAgIHNsaWRlUG9zaXRpb25zLCAvLyBjb2xsZWN0aW9uIG9mIHNsaWRlIHBvc2l0aW9uc1xuICAgICAgc2xpZGVJdGVtc091dCA9IFtdLFxuICAgICAgY2xvbmVDb3VudCA9IGxvb3AgPyBnZXRDbG9uZUNvdW50Rm9yTG9vcCgpIDogMCxcbiAgICAgIHNsaWRlQ291bnROZXcgPSAhY2Fyb3VzZWwgPyBzbGlkZUNvdW50ICsgY2xvbmVDb3VudCA6IHNsaWRlQ291bnQgKyBjbG9uZUNvdW50ICogMixcbiAgICAgIGhhc1JpZ2h0RGVhZFpvbmUgPSAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpICYmICFsb29wID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgcmlnaHRCb3VuZGFyeSA9IGZpeGVkV2lkdGggPyBnZXRSaWdodEJvdW5kYXJ5KCkgOiBudWxsLFxuICAgICAgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSAoIWNhcm91c2VsIHx8ICFsb29wKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgIC8vIHRyYW5zZm9ybVxuICAgICAgdHJhbnNmb3JtQXR0ciA9IGhvcml6b250YWwgPyAnbGVmdCcgOiAndG9wJyxcbiAgICAgIHRyYW5zZm9ybVByZWZpeCA9ICcnLFxuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcnLFxuICAgICAgLy8gaW5kZXhcbiAgICAgIGdldEluZGV4TWF4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBjZW50ZXIgJiYgIWxvb3AgPyBzbGlkZUNvdW50IC0gMSA6IE1hdGguY2VpbCgtIHJpZ2h0Qm91bmRhcnkgLyAoZml4ZWRXaWR0aCArIGd1dHRlcikpOyB9O1xuICAgICAgICB9IGVsc2UgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzbGlkZUNvdW50TmV3OyBpLS07KSB7XG4gICAgICAgICAgICAgIGlmIChzbGlkZVBvc2l0aW9uc1tpXSA+PSAtIHJpZ2h0Qm91bmRhcnkpIHsgcmV0dXJuIGk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjZW50ZXIgJiYgY2Fyb3VzZWwgJiYgIWxvb3ApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNsaWRlQ291bnQgLSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGxvb3AgfHwgY2Fyb3VzZWwgPyBNYXRoLm1heCgwLCBzbGlkZUNvdW50TmV3IC0gTWF0aC5jZWlsKGl0ZW1zKSkgOiBzbGlkZUNvdW50TmV3IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KSgpLFxuICAgICAgaW5kZXggPSBnZXRTdGFydEluZGV4KGdldE9wdGlvbignc3RhcnRJbmRleCcpKSxcbiAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXgsXG4gICAgICBkaXNwbGF5SW5kZXggPSBnZXRDdXJyZW50U2xpZGUoKSxcbiAgICAgIGluZGV4TWluID0gMCxcbiAgICAgIGluZGV4TWF4ID0gIWF1dG9XaWR0aCA/IGdldEluZGV4TWF4KCkgOiBudWxsLFxuICAgICAgLy8gcmVzaXplXG4gICAgICByZXNpemVUaW1lcixcbiAgICAgIHByZXZlbnRBY3Rpb25XaGVuUnVubmluZyA9IG9wdGlvbnMucHJldmVudEFjdGlvbldoZW5SdW5uaW5nLFxuICAgICAgc3dpcGVBbmdsZSA9IG9wdGlvbnMuc3dpcGVBbmdsZSxcbiAgICAgIG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IHN3aXBlQW5nbGUgPyAnPycgOiB0cnVlLFxuICAgICAgcnVubmluZyA9IGZhbHNlLFxuICAgICAgb25Jbml0ID0gb3B0aW9ucy5vbkluaXQsXG4gICAgICBldmVudHMgPSBuZXcgRXZlbnRzKCksXG4gICAgICAvLyBpZCwgY2xhc3NcbiAgICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgPSAnIHRucy1zbGlkZXIgdG5zLScgKyBvcHRpb25zLm1vZGUsXG4gICAgICBzbGlkZUlkID0gY29udGFpbmVyLmlkIHx8IGdldFNsaWRlSWQoKSxcbiAgICAgIGRpc2FibGUgPSBnZXRPcHRpb24oJ2Rpc2FibGUnKSxcbiAgICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgICBmcmVlemFibGUgPSBvcHRpb25zLmZyZWV6YWJsZSxcbiAgICAgIGZyZWV6ZSA9IGZyZWV6YWJsZSAmJiAhYXV0b1dpZHRoID8gZ2V0RnJlZXplKCkgOiBmYWxzZSxcbiAgICAgIGZyb3plbiA9IGZhbHNlLFxuICAgICAgY29udHJvbHNFdmVudHMgPSB7XG4gICAgICAgICdjbGljayc6IG9uQ29udHJvbHNDbGljayxcbiAgICAgICAgJ2tleWRvd24nOiBvbkNvbnRyb2xzS2V5ZG93blxuICAgICAgfSxcbiAgICAgIG5hdkV2ZW50cyA9IHtcbiAgICAgICAgJ2NsaWNrJzogb25OYXZDbGljayxcbiAgICAgICAgJ2tleWRvd24nOiBvbk5hdktleWRvd25cbiAgICAgIH0sXG4gICAgICBob3ZlckV2ZW50cyA9IHtcbiAgICAgICAgJ21vdXNlb3Zlcic6IG1vdXNlb3ZlclBhdXNlLFxuICAgICAgICAnbW91c2VvdXQnOiBtb3VzZW91dFJlc3RhcnRcbiAgICAgIH0sXG4gICAgICB2aXNpYmlsaXR5RXZlbnQgPSB7J3Zpc2liaWxpdHljaGFuZ2UnOiBvblZpc2liaWxpdHlDaGFuZ2V9LFxuICAgICAgZG9jbWVudEtleWRvd25FdmVudCA9IHsna2V5ZG93bic6IG9uRG9jdW1lbnRLZXlkb3dufSxcbiAgICAgIHRvdWNoRXZlbnRzID0ge1xuICAgICAgICAndG91Y2hzdGFydCc6IG9uUGFuU3RhcnQsXG4gICAgICAgICd0b3VjaG1vdmUnOiBvblBhbk1vdmUsXG4gICAgICAgICd0b3VjaGVuZCc6IG9uUGFuRW5kLFxuICAgICAgICAndG91Y2hjYW5jZWwnOiBvblBhbkVuZFxuICAgICAgfSwgZHJhZ0V2ZW50cyA9IHtcbiAgICAgICAgJ21vdXNlZG93bic6IG9uUGFuU3RhcnQsXG4gICAgICAgICdtb3VzZW1vdmUnOiBvblBhbk1vdmUsXG4gICAgICAgICdtb3VzZXVwJzogb25QYW5FbmQsXG4gICAgICAgICdtb3VzZWxlYXZlJzogb25QYW5FbmRcbiAgICAgIH0sXG4gICAgICBoYXNDb250cm9scyA9IGhhc09wdGlvbignY29udHJvbHMnKSxcbiAgICAgIGhhc05hdiA9IGhhc09wdGlvbignbmF2JyksXG4gICAgICBuYXZBc1RodW1ibmFpbHMgPSBhdXRvV2lkdGggPyB0cnVlIDogb3B0aW9ucy5uYXZBc1RodW1ibmFpbHMsXG4gICAgICBoYXNBdXRvcGxheSA9IGhhc09wdGlvbignYXV0b3BsYXknKSxcbiAgICAgIGhhc1RvdWNoID0gaGFzT3B0aW9uKCd0b3VjaCcpLFxuICAgICAgaGFzTW91c2VEcmFnID0gaGFzT3B0aW9uKCdtb3VzZURyYWcnKSxcbiAgICAgIHNsaWRlQWN0aXZlQ2xhc3MgPSAndG5zLXNsaWRlLWFjdGl2ZScsXG4gICAgICBpbWdDb21wbGV0ZUNsYXNzID0gJ3Rucy1jb21wbGV0ZScsXG4gICAgICBpbWdFdmVudHMgPSB7XG4gICAgICAgICdsb2FkJzogb25JbWdMb2FkZWQsXG4gICAgICAgICdlcnJvcic6IG9uSW1nRmFpbGVkXG4gICAgICB9LFxuICAgICAgaW1nc0NvbXBsZXRlLFxuICAgICAgbGl2ZXJlZ2lvbkN1cnJlbnQsXG4gICAgICBwcmV2ZW50U2Nyb2xsID0gb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCA9PT0gJ2ZvcmNlJyA/IHRydWUgOiBmYWxzZTtcblxuICAvLyBjb250cm9sc1xuICBpZiAoaGFzQ29udHJvbHMpIHtcbiAgICB2YXIgY29udHJvbHNDb250YWluZXIgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyLFxuICAgICAgICBjb250cm9sc0NvbnRhaW5lckhUTUwgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyID8gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgcHJldkJ1dHRvbiA9IG9wdGlvbnMucHJldkJ1dHRvbixcbiAgICAgICAgbmV4dEJ1dHRvbiA9IG9wdGlvbnMubmV4dEJ1dHRvbixcbiAgICAgICAgcHJldkJ1dHRvbkhUTUwgPSBvcHRpb25zLnByZXZCdXR0b24gPyBvcHRpb25zLnByZXZCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIG5leHRCdXR0b25IVE1MID0gb3B0aW9ucy5uZXh0QnV0dG9uID8gb3B0aW9ucy5uZXh0QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBwcmV2SXNCdXR0b24sXG4gICAgICAgIG5leHRJc0J1dHRvbjtcbiAgfVxuXG4gIC8vIG5hdlxuICBpZiAoaGFzTmF2KSB7XG4gICAgdmFyIG5hdkNvbnRhaW5lciA9IG9wdGlvbnMubmF2Q29udGFpbmVyLFxuICAgICAgICBuYXZDb250YWluZXJIVE1MID0gb3B0aW9ucy5uYXZDb250YWluZXIgPyBvcHRpb25zLm5hdkNvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgbmF2SXRlbXMsXG4gICAgICAgIHBhZ2VzID0gYXV0b1dpZHRoID8gc2xpZGVDb3VudCA6IGdldFBhZ2VzKCksXG4gICAgICAgIHBhZ2VzQ2FjaGVkID0gMCxcbiAgICAgICAgbmF2Q2xpY2tlZCA9IC0xLFxuICAgICAgICBuYXZDdXJyZW50SW5kZXggPSBnZXRDdXJyZW50TmF2SW5kZXgoKSxcbiAgICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2Q3VycmVudEluZGV4LFxuICAgICAgICBuYXZBY3RpdmVDbGFzcyA9ICd0bnMtbmF2LWFjdGl2ZScsXG4gICAgICAgIG5hdlN0ciA9ICdDYXJvdXNlbCBQYWdlICcsXG4gICAgICAgIG5hdlN0ckN1cnJlbnQgPSAnIChDdXJyZW50IFNsaWRlKSc7XG4gIH1cblxuICAvLyBhdXRvcGxheVxuICBpZiAoaGFzQXV0b3BsYXkpIHtcbiAgICB2YXIgYXV0b3BsYXlEaXJlY3Rpb24gPSBvcHRpb25zLmF1dG9wbGF5RGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyAxIDogLTEsXG4gICAgICAgIGF1dG9wbGF5QnV0dG9uID0gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbixcbiAgICAgICAgYXV0b3BsYXlCdXR0b25IVE1MID0gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbiA/IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIGF1dG9wbGF5SHRtbFN0cmluZ3MgPSBbJzxzcGFuIGNsYXNzPVxcJ3Rucy12aXN1YWxseS1oaWRkZW5cXCc+JywgJyBhbmltYXRpb248L3NwYW4+J10sXG4gICAgICAgIGF1dG9wbGF5VGltZXIsXG4gICAgICAgIGFuaW1hdGluZyxcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCxcbiAgICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkLFxuICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQ7XG4gIH1cblxuICBpZiAoaGFzVG91Y2ggfHwgaGFzTW91c2VEcmFnKSB7XG4gICAgdmFyIGluaXRQb3NpdGlvbiA9IHt9LFxuICAgICAgICBsYXN0UG9zaXRpb24gPSB7fSxcbiAgICAgICAgdHJhbnNsYXRlSW5pdCxcbiAgICAgICAgZGlzWCxcbiAgICAgICAgZGlzWSxcbiAgICAgICAgcGFuU3RhcnQgPSBmYWxzZSxcbiAgICAgICAgcmFmSW5kZXgsXG4gICAgICAgIGdldERpc3QgPSBob3Jpem9udGFsID8gXG4gICAgICAgICAgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS54IC0gYi54OyB9IDpcbiAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnkgLSBiLnk7IH07XG4gIH1cbiAgXG4gIC8vIGRpc2FibGUgc2xpZGVyIHdoZW4gc2xpZGVjb3VudCA8PSBpdGVtc1xuICBpZiAoIWF1dG9XaWR0aCkgeyByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpOyB9XG5cbiAgaWYgKFRSQU5TRk9STSkge1xuICAgIHRyYW5zZm9ybUF0dHIgPSBUUkFOU0ZPUk07XG4gICAgdHJhbnNmb3JtUHJlZml4ID0gJ3RyYW5zbGF0ZSc7XG5cbiAgICBpZiAoSEFTM0RUUkFOU0ZPUk1TKSB7XG4gICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICczZCgnIDogJzNkKDBweCwgJztcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSBob3Jpem9udGFsID8gJywgMHB4LCAwcHgpJyA6ICcsIDBweCknO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICdYKCcgOiAnWSgnO1xuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcpJztcbiAgICB9XG5cbiAgfVxuXG4gIGlmIChjYXJvdXNlbCkgeyBjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCd0bnMtdnBmaXgnLCAnJyk7IH1cbiAgaW5pdFN0cnVjdHVyZSgpO1xuICBpbml0U2hlZXQoKTtcbiAgaW5pdFNsaWRlclRyYW5zZm9ybSgpO1xuXG4gIC8vID09PSBDT01NT04gRlVOQ1RJT05TID09PSAvL1xuICBmdW5jdGlvbiByZXNldFZhcmlibGVzV2hlbkRpc2FibGUgKGNvbmRpdGlvbikge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIGNvbnRyb2xzID0gbmF2ID0gdG91Y2ggPSBtb3VzZURyYWcgPSBhcnJvd0tleXMgPSBhdXRvcGxheSA9IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50U2xpZGUgKCkge1xuICAgIHZhciB0ZW0gPSBjYXJvdXNlbCA/IGluZGV4IC0gY2xvbmVDb3VudCA6IGluZGV4O1xuICAgIHdoaWxlICh0ZW0gPCAwKSB7IHRlbSArPSBzbGlkZUNvdW50OyB9XG4gICAgcmV0dXJuIHRlbSVzbGlkZUNvdW50ICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFN0YXJ0SW5kZXggKGluZCkge1xuICAgIGluZCA9IGluZCA/IE1hdGgubWF4KDAsIE1hdGgubWluKGxvb3AgPyBzbGlkZUNvdW50IC0gMSA6IHNsaWRlQ291bnQgLSBpdGVtcywgaW5kKSkgOiAwO1xuICAgIHJldHVybiBjYXJvdXNlbCA/IGluZCArIGNsb25lQ291bnQgOiBpbmQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBYnNJbmRleCAoaSkge1xuICAgIGlmIChpID09IG51bGwpIHsgaSA9IGluZGV4OyB9XG5cbiAgICBpZiAoY2Fyb3VzZWwpIHsgaSAtPSBjbG9uZUNvdW50OyB9XG4gICAgd2hpbGUgKGkgPCAwKSB7IGkgKz0gc2xpZGVDb3VudDsgfVxuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoaSVzbGlkZUNvdW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnROYXZJbmRleCAoKSB7XG4gICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgcmVzdWx0ID0gbmF2QXNUaHVtYm5haWxzID8gYWJzSW5kZXggOiBcbiAgICAgIGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoID8gTWF0aC5jZWlsKChhYnNJbmRleCArIDEpICogcGFnZXMgLyBzbGlkZUNvdW50IC0gMSkgOiBcbiAgICAgICAgICBNYXRoLmZsb29yKGFic0luZGV4IC8gaXRlbXMpO1xuXG4gICAgLy8gc2V0IGFjdGl2ZSBuYXYgdG8gdGhlIGxhc3Qgb25lIHdoZW4gcmVhY2hlcyB0aGUgcmlnaHQgZWRnZVxuICAgIGlmICghbG9vcCAmJiBjYXJvdXNlbCAmJiBpbmRleCA9PT0gaW5kZXhNYXgpIHsgcmVzdWx0ID0gcGFnZXMgLSAxOyB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXRlbXNNYXggKCkge1xuICAgIC8vIGZpeGVkV2lkdGggb3IgYXV0b1dpZHRoIHdoaWxlIHZpZXdwb3J0TWF4IGlzIG5vdCBhdmFpbGFibGVcbiAgICBpZiAoYXV0b1dpZHRoIHx8IChmaXhlZFdpZHRoICYmICF2aWV3cG9ydE1heCkpIHtcbiAgICAgIHJldHVybiBzbGlkZUNvdW50IC0gMTtcbiAgICAvLyBtb3N0IGNhc2VzXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdHIgPSBmaXhlZFdpZHRoID8gJ2ZpeGVkV2lkdGgnIDogJ2l0ZW1zJyxcbiAgICAgICAgICBhcnIgPSBbXTtcblxuICAgICAgaWYgKGZpeGVkV2lkdGggfHwgb3B0aW9uc1tzdHJdIDwgc2xpZGVDb3VudCkgeyBhcnIucHVzaChvcHRpb25zW3N0cl0pOyB9XG5cbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICB2YXIgdGVtID0gcmVzcG9uc2l2ZVticF1bc3RyXTtcbiAgICAgICAgICBpZiAodGVtICYmIChmaXhlZFdpZHRoIHx8IHRlbSA8IHNsaWRlQ291bnQpKSB7IGFyci5wdXNoKHRlbSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWFyci5sZW5ndGgpIHsgYXJyLnB1c2goMCk7IH1cblxuICAgICAgcmV0dXJuIE1hdGguY2VpbChmaXhlZFdpZHRoID8gdmlld3BvcnRNYXggLyBNYXRoLm1pbi5hcHBseShudWxsLCBhcnIpIDogTWF0aC5tYXguYXBwbHkobnVsbCwgYXJyKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2xvbmVDb3VudEZvckxvb3AgKCkge1xuICAgIHZhciBpdGVtc01heCA9IGdldEl0ZW1zTWF4KCksXG4gICAgICAgIHJlc3VsdCA9IGNhcm91c2VsID8gTWF0aC5jZWlsKChpdGVtc01heCAqIDUgLSBzbGlkZUNvdW50KS8yKSA6IChpdGVtc01heCAqIDQgLSBzbGlkZUNvdW50KTtcbiAgICByZXN1bHQgPSBNYXRoLm1heChpdGVtc01heCwgcmVzdWx0KTtcblxuICAgIHJldHVybiBoYXNPcHRpb24oJ2VkZ2VQYWRkaW5nJykgPyByZXN1bHQgKyAxIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2luZG93V2lkdGggKCkge1xuICAgIHJldHVybiB3aW4uaW5uZXJXaWR0aCB8fCBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvYy5ib2R5LmNsaWVudFdpZHRoO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5zZXJ0UG9zaXRpb24gKHBvcykge1xuICAgIHJldHVybiBwb3MgPT09ICd0b3AnID8gJ2FmdGVyYmVnaW4nIDogJ2JlZm9yZWVuZCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDbGllbnRXaWR0aCAoZWwpIHtcbiAgICB2YXIgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCByZWN0LCB3aWR0aDtcbiAgICBlbC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgd2lkdGggPSByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0O1xuICAgIGRpdi5yZW1vdmUoKTtcbiAgICByZXR1cm4gd2lkdGggfHwgZ2V0Q2xpZW50V2lkdGgoZWwucGFyZW50Tm9kZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaWV3cG9ydFdpZHRoICgpIHtcbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBlZGdlUGFkZGluZyAqIDIgLSBndXR0ZXIgOiAwO1xuICAgIHJldHVybiBnZXRDbGllbnRXaWR0aChjb250YWluZXJQYXJlbnQpIC0gZ2FwO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzT3B0aW9uIChpdGVtKSB7XG4gICAgaWYgKG9wdGlvbnNbaXRlbV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNpdmVbYnBdW2l0ZW1dKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBnZXQgb3B0aW9uOlxuICAvLyBmaXhlZCB3aWR0aDogdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlciA9PiBpdGVtc1xuICAvLyBvdGhlcnM6IHdpbmRvdyB3aWR0aCA9PiBhbGwgdmFyaWFibGVzXG4gIC8vIGFsbDogaXRlbXMgPT4gc2xpZGVCeVxuICBmdW5jdGlvbiBnZXRPcHRpb24gKGl0ZW0sIHd3KSB7XG4gICAgaWYgKHd3ID09IG51bGwpIHsgd3cgPSB3aW5kb3dXaWR0aDsgfVxuXG4gICAgaWYgKGl0ZW0gPT09ICdpdGVtcycgJiYgZml4ZWRXaWR0aCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHZpZXdwb3J0ICsgZ3V0dGVyKSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSkgfHwgMTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0ID0gb3B0aW9uc1tpdGVtXTtcblxuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIC8vIGJwOiBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgICBpZiAod3cgPj0gcGFyc2VJbnQoYnApKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbiByZXNwb25zaXZlW2JwXSkgeyByZXN1bHQgPSByZXNwb25zaXZlW2JwXVtpdGVtXTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSA9PT0gJ3NsaWRlQnknICYmIHJlc3VsdCA9PT0gJ3BhZ2UnKSB7IHJlc3VsdCA9IGdldE9wdGlvbignaXRlbXMnKTsgfVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiAoaXRlbSA9PT0gJ3NsaWRlQnknIHx8IGl0ZW0gPT09ICdpdGVtcycpKSB7IHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTsgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlTWFyZ2luTGVmdCAoaSkge1xuICAgIHJldHVybiBDQUxDID8gXG4gICAgICBDQUxDICsgJygnICsgaSAqIDEwMCArICclIC8gJyArIHNsaWRlQ291bnROZXcgKyAnKScgOiBcbiAgICAgIGkgKiAxMDAgLyBzbGlkZUNvdW50TmV3ICsgJyUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzIChlZGdlUGFkZGluZ1RlbSwgZ3V0dGVyVGVtLCBmaXhlZFdpZHRoVGVtLCBzcGVlZFRlbSwgYXV0b0hlaWdodEJQKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuXG4gICAgaWYgKGVkZ2VQYWRkaW5nVGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZ1RlbTtcbiAgICAgIGlmIChndXR0ZXJUZW0pIHsgZ2FwIC09IGd1dHRlclRlbTsgfVxuICAgICAgc3RyID0gaG9yaXpvbnRhbCA/XG4gICAgICAgICdtYXJnaW46IDAgJyArIGdhcCArICdweCAwICcgKyBlZGdlUGFkZGluZ1RlbSArICdweDsnIDpcbiAgICAgICAgJ21hcmdpbjogJyArIGVkZ2VQYWRkaW5nVGVtICsgJ3B4IDAgJyArIGdhcCArICdweCAwOyc7XG4gICAgfSBlbHNlIGlmIChndXR0ZXJUZW0gJiYgIWZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHZhciBndXR0ZXJUZW1Vbml0ID0gJy0nICsgZ3V0dGVyVGVtICsgJ3B4JyxcbiAgICAgICAgICBkaXIgPSBob3Jpem9udGFsID8gZ3V0dGVyVGVtVW5pdCArICcgMCAwJyA6ICcwICcgKyBndXR0ZXJUZW1Vbml0ICsgJyAwJztcbiAgICAgIHN0ciA9ICdtYXJnaW46IDAgJyArIGRpciArICc7JztcbiAgICB9XG5cbiAgICBpZiAoIWNhcm91c2VsICYmIGF1dG9IZWlnaHRCUCAmJiBUUkFOU0lUSU9ORFVSQVRJT04gJiYgc3BlZWRUZW0pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkVGVtKTsgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb250YWluZXJXaWR0aCAoZml4ZWRXaWR0aFRlbSwgZ3V0dGVyVGVtLCBpdGVtc1RlbSkge1xuICAgIGlmIChmaXhlZFdpZHRoVGVtKSB7XG4gICAgICByZXR1cm4gKGZpeGVkV2lkdGhUZW0gKyBndXR0ZXJUZW0pICogc2xpZGVDb3VudE5ldyArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDQUxDID9cbiAgICAgICAgQ0FMQyArICcoJyArIHNsaWRlQ291bnROZXcgKiAxMDAgKyAnJSAvICcgKyBpdGVtc1RlbSArICcpJyA6XG4gICAgICAgIHNsaWRlQ291bnROZXcgKiAxMDAgLyBpdGVtc1RlbSArICclJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZVdpZHRoU3R5bGUgKGZpeGVkV2lkdGhUZW0sIGd1dHRlclRlbSwgaXRlbXNUZW0pIHtcbiAgICB2YXIgd2lkdGg7XG5cbiAgICBpZiAoZml4ZWRXaWR0aFRlbSkge1xuICAgICAgd2lkdGggPSAoZml4ZWRXaWR0aFRlbSArIGd1dHRlclRlbSkgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNhcm91c2VsKSB7IGl0ZW1zVGVtID0gTWF0aC5mbG9vcihpdGVtc1RlbSk7IH1cbiAgICAgIHZhciBkaXZpZGVuZCA9IGNhcm91c2VsID8gc2xpZGVDb3VudE5ldyA6IGl0ZW1zVGVtO1xuICAgICAgd2lkdGggPSBDQUxDID8gXG4gICAgICAgIENBTEMgKyAnKDEwMCUgLyAnICsgZGl2aWRlbmQgKyAnKScgOiBcbiAgICAgICAgMTAwIC8gZGl2aWRlbmQgKyAnJSc7XG4gICAgfVxuXG4gICAgd2lkdGggPSAnd2lkdGg6JyArIHdpZHRoO1xuXG4gICAgLy8gaW5uZXIgc2xpZGVyOiBvdmVyd3JpdGUgb3V0ZXIgc2xpZGVyIHN0eWxlc1xuICAgIHJldHVybiBuZXN0ZWQgIT09ICdpbm5lcicgPyB3aWR0aCArICc7JyA6IHdpZHRoICsgJyAhaW1wb3J0YW50Oyc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZUd1dHRlclN0eWxlIChndXR0ZXJUZW0pIHtcbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICAvLyBndXR0ZXIgbWF5YmUgaW50ZXJnZXIgfHwgMFxuICAgIC8vIHNvIGNhbid0IHVzZSAnaWYgKGd1dHRlciknXG4gICAgaWYgKGd1dHRlclRlbSAhPT0gZmFsc2UpIHtcbiAgICAgIHZhciBwcm9wID0gaG9yaXpvbnRhbCA/ICdwYWRkaW5nLScgOiAnbWFyZ2luLScsXG4gICAgICAgICAgZGlyID0gaG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcbiAgICAgIHN0ciA9IHByb3AgKyAgZGlyICsgJzogJyArIGd1dHRlclRlbSArICdweDsnO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDU1NQcmVmaXggKG5hbWUsIG51bSkge1xuICAgIHZhciBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCAtIG51bSkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAocHJlZml4KSB7IHByZWZpeCA9ICctJyArIHByZWZpeCArICctJzsgfVxuXG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlIChzcGVlZCkge1xuICAgIHJldHVybiBnZXRDU1NQcmVmaXgoVFJBTlNJVElPTkRVUkFUSU9OLCAxOCkgKyAndHJhbnNpdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XG4gICAgcmV0dXJuIGdldENTU1ByZWZpeChBTklNQVRJT05EVVJBVElPTiwgMTcpICsgJ2FuaW1hdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTdHJ1Y3R1cmUgKCkge1xuICAgIHZhciBjbGFzc091dGVyID0gJ3Rucy1vdXRlcicsXG4gICAgICAgIGNsYXNzSW5uZXIgPSAndG5zLWlubmVyJyxcbiAgICAgICAgaGFzR3V0dGVyID0gaGFzT3B0aW9uKCdndXR0ZXInKTtcblxuICAgIG91dGVyV3JhcHBlci5jbGFzc05hbWUgPSBjbGFzc091dGVyO1xuICAgIGlubmVyV3JhcHBlci5jbGFzc05hbWUgPSBjbGFzc0lubmVyO1xuICAgIG91dGVyV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW93JztcbiAgICBpbm5lcldyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1pdyc7XG5cbiAgICAvLyBzZXQgY29udGFpbmVyIHByb3BlcnRpZXNcbiAgICBpZiAoY29udGFpbmVyLmlkID09PSAnJykgeyBjb250YWluZXIuaWQgPSBzbGlkZUlkOyB9XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSBQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCA/ICcgdG5zLXN1YnBpeGVsJyA6ICcgdG5zLW5vLXN1YnBpeGVsJztcbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9IENBTEMgPyAnIHRucy1jYWxjJyA6ICcgdG5zLW5vLWNhbGMnO1xuICAgIGlmIChhdXRvV2lkdGgpIHsgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSAnIHRucy1hdXRvd2lkdGgnOyB9XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSAnIHRucy0nICsgb3B0aW9ucy5heGlzO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gbmV3Q29udGFpbmVyQ2xhc3NlcztcblxuICAgIC8vIGFkZCBjb25zdHJhaW4gbGF5ZXIgZm9yIGNhcm91c2VsXG4gICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICBtaWRkbGVXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbWlkZGxlV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW13JztcbiAgICAgIG1pZGRsZVdyYXBwZXIuY2xhc3NOYW1lID0gJ3Rucy1vdmgnO1xuXG4gICAgICBvdXRlcldyYXBwZXIuYXBwZW5kQ2hpbGQobWlkZGxlV3JhcHBlcik7XG4gICAgICBtaWRkbGVXcmFwcGVyLmFwcGVuZENoaWxkKGlubmVyV3JhcHBlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dGVyV3JhcHBlci5hcHBlbmRDaGlsZChpbm5lcldyYXBwZXIpO1xuICAgIH1cblxuICAgIGlmIChhdXRvSGVpZ2h0KSB7XG4gICAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcbiAgICAgIHdwLmNsYXNzTmFtZSArPSAnIHRucy1haCc7XG4gICAgfVxuXG4gICAgY29udGFpbmVyUGFyZW50Lmluc2VydEJlZm9yZShvdXRlcldyYXBwZXIsIGNvbnRhaW5lcik7XG4gICAgaW5uZXJXcmFwcGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAvLyBhZGQgaWQsIGNsYXNzLCBhcmlhIGF0dHJpYnV0ZXMgXG4gICAgLy8gYmVmb3JlIGNsb25lIHNsaWRlc1xuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1pdGVtJyk7XG4gICAgICBpZiAoIWl0ZW0uaWQpIHsgaXRlbS5pZCA9IHNsaWRlSWQgKyAnLWl0ZW0nICsgaTsgfVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBhbmltYXRlTm9ybWFsKSB7IGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpOyB9XG4gICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAjIyBjbG9uZSBzbGlkZXNcbiAgICAvLyBjYXJvdXNlbDogbiArIHNsaWRlcyArIG5cbiAgICAvLyBnYWxsZXJ5OiAgICAgIHNsaWRlcyArIG5cbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIGZyYWdtZW50QmVmb3JlID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgXG4gICAgICAgICAgZnJhZ21lbnRBZnRlciA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIHZhciBudW0gPSBqJXNsaWRlQ291bnQsXG4gICAgICAgICAgICBjbG9uZUZpcnN0ID0gc2xpZGVJdGVtc1tudW1dLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVGaXJzdCwgJ2lkJyk7XG4gICAgICAgIGZyYWdtZW50QWZ0ZXIuaW5zZXJ0QmVmb3JlKGNsb25lRmlyc3QsIGZyYWdtZW50QWZ0ZXIuZmlyc3RDaGlsZCk7XG5cbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgdmFyIGNsb25lTGFzdCA9IHNsaWRlSXRlbXNbc2xpZGVDb3VudCAtIDEgLSBudW1dLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICByZW1vdmVBdHRycyhjbG9uZUxhc3QsICdpZCcpO1xuICAgICAgICAgIGZyYWdtZW50QmVmb3JlLmFwcGVuZENoaWxkKGNsb25lTGFzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZShmcmFnbWVudEJlZm9yZSwgY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50QWZ0ZXIpO1xuICAgICAgc2xpZGVJdGVtcyA9IGNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm0gKCkge1xuICAgIC8vICMjIGltYWdlcyBsb2FkZWQvZmFpbGVkXG4gICAgaWYgKGhhc09wdGlvbignYXV0b0hlaWdodCcpIHx8IGF1dG9XaWR0aCB8fCAhaG9yaXpvbnRhbCkge1xuICAgICAgdmFyIGltZ3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG5cbiAgICAgIC8vIGFkZCBjb21wbGV0ZSBjbGFzcyBpZiBhbGwgaW1hZ2VzIGFyZSBsb2FkZWQvZmFpbGVkXG4gICAgICBmb3JFYWNoKGltZ3MsIGZ1bmN0aW9uKGltZykge1xuICAgICAgICB2YXIgc3JjID0gaW1nLnNyYztcbiAgICAgICAgXG4gICAgICAgIGlmIChzcmMgJiYgc3JjLmluZGV4T2YoJ2RhdGE6aW1hZ2UnKSA8IDApIHtcbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuICAgICAgICAgIGltZy5zcmMgPSAnJztcbiAgICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICAgICAgfSBlbHNlIGlmICghbGF6eWxvYWQpIHtcbiAgICAgICAgICBpbWdMb2FkZWQoaW1nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEFsbCBpbWdzIGFyZSBjb21wbGV0ZWRcbiAgICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soYXJyYXlGcm9tTm9kZUxpc3QoaW1ncyksIGZ1bmN0aW9uKCkgeyBpbWdzQ29tcGxldGUgPSB0cnVlOyB9KTsgfSk7XG5cbiAgICAgIC8vIENoZWNrIGltZ3MgaW4gd2luZG93IG9ubHkgZm9yIGF1dG8gaGVpZ2h0XG4gICAgICBpZiAoIWF1dG9XaWR0aCAmJiBob3Jpem9udGFsKSB7IGltZ3MgPSBnZXRJbWFnZUFycmF5KGluZGV4LCBNYXRoLm1pbihpbmRleCArIGl0ZW1zIC0gMSwgc2xpZGVDb3VudE5ldyAtIDEpKTsgfVxuXG4gICAgICBsYXp5bG9hZCA/IGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrKCkgOiByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGFycmF5RnJvbU5vZGVMaXN0KGltZ3MpLCBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayk7IH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNldCBjb250YWluZXIgdHJhbnNmb3JtIHByb3BlcnR5XG4gICAgICBpZiAoY2Fyb3VzZWwpIHsgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTsgfVxuXG4gICAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcbiAgICAgIGluaXRUb29scygpO1xuICAgICAgaW5pdEV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrICgpIHtcbiAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAvLyBjaGVjayBzdHlsZXMgYXBwbGljYXRpb25cbiAgICAgIHZhciBudW0gPSBsb29wID8gaW5kZXggOiBzbGlkZUNvdW50IC0gMTtcbiAgICAgIChmdW5jdGlvbiBzdHlsZXNBcHBsaWNhdGlvbkNoZWNrKCkge1xuICAgICAgICBzbGlkZUl0ZW1zW251bSAtIDFdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0LnRvRml4ZWQoMikgPT09IHNsaWRlSXRlbXNbbnVtXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LnRvRml4ZWQoMikgP1xuICAgICAgICBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSgpIDpcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBzdHlsZXNBcHBsaWNhdGlvbkNoZWNrKCk7IH0sIDE2KTtcbiAgICAgIH0pKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlKCk7XG4gICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSAoKSB7XG4gICAgLy8gcnVuIEZuKClzIHdoaWNoIGFyZSByZWx5IG9uIGltYWdlIGxvYWRpbmdcbiAgICBpZiAoIWhvcml6b250YWwgfHwgYXV0b1dpZHRoKSB7XG4gICAgICBzZXRTbGlkZVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgIHJpZ2h0Qm91bmRhcnkgPSBnZXRSaWdodEJvdW5kYXJ5KCk7XG4gICAgICAgIGlmIChmcmVlemFibGUpIHsgZnJlZXplID0gZ2V0RnJlZXplKCk7IH1cbiAgICAgICAgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyAvLyA8PSBzbGlkZVBvc2l0aW9ucywgcmlnaHRCb3VuZGFyeSA8PVxuICAgICAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgY29udGFpbmVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxuICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XG5cbiAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcbiAgICBpbml0VG9vbHMoKTtcbiAgICBpbml0RXZlbnRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2hlZXQgKCkge1xuICAgIC8vIGdhbGxlcnk6XG4gICAgLy8gc2V0IGFuaW1hdGlvbiBjbGFzc2VzIGFuZCBsZWZ0IHZhbHVlIGZvciBnYWxsZXJ5IHNsaWRlclxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIE1hdGgubWluKHNsaWRlQ291bnQsIGl0ZW1zKTsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vICMjIyMgTEFZT1VUXG5cbiAgICAvLyAjIyBJTkxJTkUtQkxPQ0sgVlMgRkxPQVRcblxuICAgIC8vICMjIFBlcmNlbnRhZ2VMYXlvdXQ6XG4gICAgLy8gc2xpZGVzOiBpbmxpbmUtYmxvY2tcbiAgICAvLyByZW1vdmUgYmxhbmsgc3BhY2UgYmV0d2VlbiBzbGlkZXMgYnkgc2V0IGZvbnQtc2l6ZTogMFxuXG4gICAgLy8gIyMgTm9uIFBlcmNlbnRhZ2VMYXlvdXQ6XG4gICAgLy8gc2xpZGVzOiBmbG9hdFxuICAgIC8vICAgICAgICAgbWFyZ2luLXJpZ2h0OiAtMTAwJVxuICAgIC8vICAgICAgICAgbWFyZ2luLWxlZnQ6IH5cblxuICAgIC8vIFJlc291cmNlOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xNDd1cDI0NXd3VFhlUVl2ZTNCUlNBRDRvVmN2UW11R3NGdGVKT2VBNXhOUS9lZGl0P3VzcD1zaGFyaW5nXG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIGlmIChQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCkge1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsICdmb250LXNpemU6JyArIHdpbi5nZXRDb21wdXRlZFN0eWxlKHNsaWRlSXRlbXNbMF0pLmZvbnRTaXplICsgJzsnLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkLCAnZm9udC1zaXplOjA7JywgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbiAoc2xpZGUsIGkpIHtcbiAgICAgICAgICBzbGlkZS5zdHlsZS5tYXJnaW5MZWZ0ID0gZ2V0U2xpZGVNYXJnaW5MZWZ0KGkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vICMjIEJBU0lDIFNUWUxFU1xuICAgIGlmIChDU1NNUSkge1xuICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVcbiAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcbiAgICAgICAgdmFyIHN0ciA9IG1pZGRsZVdyYXBwZXIgJiYgb3B0aW9ucy5hdXRvSGVpZ2h0ID8gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUob3B0aW9ucy5zcGVlZCkgOiAnJztcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICctbXcnLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICBzdHIgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMob3B0aW9ucy5lZGdlUGFkZGluZywgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5hdXRvSGVpZ2h0KTtcbiAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnLWl3Jywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuXG4gICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gJ3dpZHRoOicgKyBnZXRDb250YWluZXJXaWR0aChvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLml0ZW1zKSArICc7JyA6ICcnO1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCwgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/IGdldFNsaWRlV2lkdGhTdHlsZShvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLml0ZW1zKSA6ICcnO1xuICAgICAgaWYgKG9wdGlvbnMuZ3V0dGVyKSB7IHN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKG9wdGlvbnMuZ3V0dGVyKTsgfVxuICAgICAgLy8gc2V0IGdhbGxlcnkgaXRlbXMgdHJhbnNpdGlvbi1kdXJhdGlvblxuICAgICAgaWYgKCFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgICAgaWYgKEFOSU1BVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxuXG4gICAgLy8gbm9uIENTUyBtZWRpYXF1ZXJpZXM6IElFOFxuICAgIC8vICMjIHVwZGF0ZSBpbm5lciB3cmFwcGVyLCBjb250YWluZXIsIHNsaWRlcyBpZiBuZWVkZWRcbiAgICAvLyBzZXQgaW5saW5lIHN0eWxlcyBmb3IgaW5uZXIgd3JhcHBlciAmIGNvbnRhaW5lclxuICAgIC8vIGluc2VydCBzdHlsZXNoZWV0IChvbmUgbGluZSkgZm9yIHNsaWRlcyBvbmx5IChzaW5jZSBzbGlkZXMgYXJlIG1hbnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlc1xuICAgICAgdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24oKTtcblxuICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIGF1dG9IZWlnaHQpO1xuXG4gICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICBpZiAoY2Fyb3VzZWwgJiYgaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgIHZhciBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcykgOiAnJztcbiAgICAgIGlmIChndXR0ZXIpIHsgc3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTsgfVxuXG4gICAgICAvLyBhcHBlbmQgdG8gdGhlIGxhc3QgbGluZVxuICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxuICAgIH1cblxuICAgIC8vICMjIE1FRElBUVVFUklFU1xuICAgIGlmIChyZXNwb25zaXZlICYmIENTU01RKSB7XG4gICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgIC8vIGJwOiBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgYnAgPSBwYXJzZUludChicCk7XG5cbiAgICAgICAgdmFyIG9wdHMgPSByZXNwb25zaXZlW2JwXSxcbiAgICAgICAgICAgIHN0ciA9ICcnLFxuICAgICAgICAgICAgbWlkZGxlV3JhcHBlclN0ciA9ICcnLFxuICAgICAgICAgICAgaW5uZXJXcmFwcGVyU3RyID0gJycsXG4gICAgICAgICAgICBjb250YWluZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHNsaWRlU3RyID0gJycsXG4gICAgICAgICAgICBpdGVtc0JQID0gIWF1dG9XaWR0aCA/IGdldE9wdGlvbignaXRlbXMnLCBicCkgOiBudWxsLFxuICAgICAgICAgICAgZml4ZWRXaWR0aEJQID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJywgYnApLFxuICAgICAgICAgICAgc3BlZWRCUCA9IGdldE9wdGlvbignc3BlZWQnLCBicCksXG4gICAgICAgICAgICBlZGdlUGFkZGluZ0JQID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycsIGJwKSxcbiAgICAgICAgICAgIGF1dG9IZWlnaHRCUCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSxcbiAgICAgICAgICAgIGd1dHRlckJQID0gZ2V0T3B0aW9uKCdndXR0ZXInLCBicCk7XG5cbiAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3RyaW5nXG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gJiYgbWlkZGxlV3JhcHBlciAmJiBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnLCBicCkgJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgbWlkZGxlV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLW13eycgKyBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKSArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3RyaW5nXG4gICAgICAgIGlmICgnZWRnZVBhZGRpbmcnIGluIG9wdHMgfHwgJ2d1dHRlcicgaW4gb3B0cykge1xuICAgICAgICAgIGlubmVyV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLWl3eycgKyBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmdCUCwgZ3V0dGVyQlAsIGZpeGVkV2lkdGhCUCwgc3BlZWRCUCwgYXV0b0hlaWdodEJQKSArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnRhaW5lciBzdHJpbmdcbiAgICAgICAgaWYgKGNhcm91c2VsICYmIGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAoJ2ZpeGVkV2lkdGgnIGluIG9wdHMgfHwgJ2l0ZW1zJyBpbiBvcHRzIHx8IChmaXhlZFdpZHRoICYmICdndXR0ZXInIGluIG9wdHMpKSkge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICd3aWR0aDonICsgZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aEJQLCBndXR0ZXJCUCwgaXRlbXNCUCkgKyAnOyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRhaW5lclN0cikge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICcjJyArIHNsaWRlSWQgKyAneycgKyBjb250YWluZXJTdHIgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzbGlkZSBzdHJpbmdcbiAgICAgICAgaWYgKCdmaXhlZFdpZHRoJyBpbiBvcHRzIHx8IChmaXhlZFdpZHRoICYmICdndXR0ZXInIGluIG9wdHMpIHx8ICFjYXJvdXNlbCAmJiAnaXRlbXMnIGluIG9wdHMpIHtcbiAgICAgICAgICBzbGlkZVN0ciArPSBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aEJQLCBndXR0ZXJCUCwgaXRlbXNCUCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdndXR0ZXInIGluIG9wdHMpIHtcbiAgICAgICAgICBzbGlkZVN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlckJQKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgZ2FsbGVyeSBpdGVtcyB0cmFuc2l0aW9uLWR1cmF0aW9uXG4gICAgICAgIGlmICghY2Fyb3VzZWwgJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzbGlkZVN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTsgfVxuICAgICAgICAgIGlmIChBTklNQVRJT05EVVJBVElPTikgeyBzbGlkZVN0ciArPSBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNsaWRlU3RyKSB7IHNsaWRlU3RyID0gJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW17JyArIHNsaWRlU3RyICsgJ30nOyB9XG5cbiAgICAgICAgLy8gYWRkIHVwXG4gICAgICAgIHN0ciA9IG1pZGRsZVdyYXBwZXJTdHIgKyBpbm5lcldyYXBwZXJTdHIgKyBjb250YWluZXJTdHIgKyBzbGlkZVN0cjtcblxuICAgICAgICBpZiAoc3RyKSB7XG4gICAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZSgnQG1lZGlhIChtaW4td2lkdGg6ICcgKyBicCAvIDE2ICsgJ2VtKSB7JyArIHN0ciArICd9Jywgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRUb29scyAoKSB7XG4gICAgLy8gPT0gc2xpZGVzID09XG4gICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcblxuICAgIC8vID09IGxpdmUgcmVnaW9uID09XG4gICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8ZGl2IGNsYXNzPVwidG5zLWxpdmVyZWdpb24gdG5zLXZpc3VhbGx5LWhpZGRlblwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPnNsaWRlIDxzcGFuIGNsYXNzPVwiY3VycmVudFwiPicgKyBnZXRMaXZlUmVnaW9uU3RyKCkgKyAnPC9zcGFuPiAgb2YgJyArIHNsaWRlQ291bnQgKyAnPC9kaXY+Jyk7XG4gICAgbGl2ZXJlZ2lvbkN1cnJlbnQgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1saXZlcmVnaW9uIC5jdXJyZW50Jyk7XG5cbiAgICAvLyA9PSBhdXRvcGxheUluaXQgPT1cbiAgICBpZiAoaGFzQXV0b3BsYXkpIHtcbiAgICAgIHZhciB0eHQgPSBhdXRvcGxheSA/ICdzdG9wJyA6ICdzdGFydCc7XG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHtcbiAgICAgICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiB0eHR9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hdXRvcGxheUJ1dHRvbk91dHB1dCkge1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMuYXV0b3BsYXlQb3NpdGlvbiksICc8YnV0dG9uIGRhdGEtYWN0aW9uPVwiJyArIHR4dCArICdcIj4nICsgYXV0b3BsYXlIdG1sU3RyaW5nc1swXSArIHR4dCArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMV0gKyBhdXRvcGxheVRleHRbMF0gKyAnPC9idXR0b24+Jyk7XG4gICAgICAgIGF1dG9wbGF5QnV0dG9uID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGV2ZW50XG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHtcbiAgICAgICAgYWRkRXZlbnRzKGF1dG9wbGF5QnV0dG9uLCB7J2NsaWNrJzogdG9nZ2xlQXV0b3BsYXl9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSkgeyBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7IH1cbiAgICAgICAgaWYgKGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdmlzaWJpbGl0eUV2ZW50KTsgfVxuICAgICAgfVxuICAgIH1cbiBcbiAgICAvLyA9PSBuYXZJbml0ID09XG4gICAgaWYgKGhhc05hdikge1xuICAgICAgdmFyIGluaXRJbmRleCA9ICFjYXJvdXNlbCA/IDAgOiBjbG9uZUNvdW50O1xuICAgICAgLy8gY3VzdG9taXplZCBuYXZcbiAgICAgIC8vIHdpbGwgbm90IGhpZGUgdGhlIG5hdnMgaW4gY2FzZSB0aGV5J3JlIHRodW1ibmFpbHNcbiAgICAgIGlmIChuYXZDb250YWluZXIpIHtcbiAgICAgICAgc2V0QXR0cnMobmF2Q29udGFpbmVyLCB7J2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgUGFnaW5hdGlvbid9KTtcbiAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XG4gICAgICAgIGZvckVhY2gobmF2SXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICAgICAnZGF0YS1uYXYnOiBpLFxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKGkgKyAxKSxcbiAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlZCBuYXYgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmF2SHRtbCA9ICcnLFxuICAgICAgICAgICAgaGlkZGVuU3RyID0gbmF2QXNUaHVtYm5haWxzID8gJycgOiAnc3R5bGU9XCJkaXNwbGF5Om5vbmVcIic7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgLy8gaGlkZSBuYXYgaXRlbXMgYnkgZGVmYXVsdFxuICAgICAgICAgIG5hdkh0bWwgKz0gJzxidXR0b24gZGF0YS1uYXY9XCInICsgaSArJ1wiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKyAnXCIgJyArIGhpZGRlblN0ciArICcgYXJpYS1sYWJlbD1cIicgKyBuYXZTdHIgKyAoaSArIDEpICsnXCI+PC9idXR0b24+JztcbiAgICAgICAgfVxuICAgICAgICBuYXZIdG1sID0gJzxkaXYgY2xhc3M9XCJ0bnMtbmF2XCIgYXJpYS1sYWJlbD1cIkNhcm91c2VsIFBhZ2luYXRpb25cIj4nICsgbmF2SHRtbCArICc8L2Rpdj4nO1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMubmF2UG9zaXRpb24pLCBuYXZIdG1sKTtcblxuICAgICAgICBuYXZDb250YWluZXIgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1uYXYnKTtcbiAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZU5hdlZpc2liaWxpdHkoKTtcblxuICAgICAgLy8gYWRkIHRyYW5zaXRpb25cbiAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IFRSQU5TSVRJT05EVVJBVElPTi5zdWJzdHJpbmcoMCwgVFJBTlNJVElPTkRVUkFUSU9OLmxlbmd0aCAtIDE4KS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgc3RyID0gJ3RyYW5zaXRpb246IGFsbCAnICsgc3BlZWQgLyAxMDAwICsgJ3MnO1xuXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICBzdHIgPSAnLScgKyBwcmVmaXggKyAnLScgKyBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnW2FyaWEtY29udHJvbHNePScgKyBzbGlkZUlkICsgJy1pdGVtXScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXR0cnMobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgeydhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleCArIDEpICsgbmF2U3RyQ3VycmVudH0pO1xuICAgICAgcmVtb3ZlQXR0cnMobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgJ3RhYmluZGV4Jyk7XG4gICAgICBhZGRDbGFzcyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCBuYXZBY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIGFkZCBldmVudHNcbiAgICAgIGFkZEV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7XG4gICAgfVxuXG5cblxuICAgIC8vID09IGNvbnRyb2xzSW5pdCA9PVxuICAgIGlmIChoYXNDb250cm9scykge1xuICAgICAgaWYgKCFjb250cm9sc0NvbnRhaW5lciAmJiAoIXByZXZCdXR0b24gfHwgIW5leHRCdXR0b24pKSB7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5jb250cm9sc1Bvc2l0aW9uKSwgJzxkaXYgY2xhc3M9XCJ0bnMtY29udHJvbHNcIiBhcmlhLWxhYmVsPVwiQ2Fyb3VzZWwgTmF2aWdhdGlvblwiIHRhYmluZGV4PVwiMFwiPjxidXR0b24gZGF0YS1jb250cm9scz1cInByZXZcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsnXCI+JyArIGNvbnRyb2xzVGV4dFswXSArICc8L2J1dHRvbj48YnV0dG9uIGRhdGEtY29udHJvbHM9XCJuZXh0XCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMV0gKyAnPC9idXR0b24+PC9kaXY+Jyk7XG5cbiAgICAgICAgY29udHJvbHNDb250YWluZXIgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1jb250cm9scycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXByZXZCdXR0b24gfHwgIW5leHRCdXR0b24pIHtcbiAgICAgICAgcHJldkJ1dHRvbiA9IGNvbnRyb2xzQ29udGFpbmVyLmNoaWxkcmVuWzBdO1xuICAgICAgICBuZXh0QnV0dG9uID0gY29udHJvbHNDb250YWluZXIuY2hpbGRyZW5bMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIHNldEF0dHJzKGNvbnRyb2xzQ29udGFpbmVyLCB7XG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgTmF2aWdhdGlvbicsXG4gICAgICAgICAgJ3RhYmluZGV4JzogJzAnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciB8fCAob3B0aW9ucy5wcmV2QnV0dG9uICYmIG9wdGlvbnMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgc2V0QXR0cnMoW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLCB7XG4gICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzbGlkZUlkLFxuICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciB8fCAob3B0aW9ucy5wcmV2QnV0dG9uICYmIG9wdGlvbnMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgc2V0QXR0cnMocHJldkJ1dHRvbiwgeydkYXRhLWNvbnRyb2xzJyA6ICdwcmV2J30pO1xuICAgICAgICBzZXRBdHRycyhuZXh0QnV0dG9uLCB7J2RhdGEtY29udHJvbHMnIDogJ25leHQnfSk7XG4gICAgICB9XG5cbiAgICAgIHByZXZJc0J1dHRvbiA9IGlzQnV0dG9uKHByZXZCdXR0b24pO1xuICAgICAgbmV4dElzQnV0dG9uID0gaXNCdXR0b24obmV4dEJ1dHRvbik7XG5cbiAgICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XG5cbiAgICAgIC8vIGFkZCBldmVudHNcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBhZGRFdmVudHMoY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZEV2ZW50cyhwcmV2QnV0dG9uLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICAgIGFkZEV2ZW50cyhuZXh0QnV0dG9uLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaGlkZSB0b29scyBpZiBuZWVkZWRcbiAgICBkaXNhYmxlVUkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRFdmVudHMgKCkge1xuICAgIC8vIGFkZCBldmVudHNcbiAgICBpZiAoY2Fyb3VzZWwgJiYgVFJBTlNJVElPTkVORCkge1xuICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgZXZlKTtcbiAgICB9XG5cbiAgICBpZiAodG91Y2gpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMsIG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2gpOyB9XG4gICAgaWYgKG1vdXNlRHJhZykgeyBhZGRFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTsgfVxuICAgIGlmIChhcnJvd0tleXMpIHsgYWRkRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cblxuICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHtcbiAgICAgIGV2ZW50cy5vbignb3V0ZXJSZXNpemVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNpemVUYXNrcygpO1xuICAgICAgICBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8IGF1dG9IZWlnaHQgfHwgIWhvcml6b250YWwpIHtcbiAgICAgIGFkZEV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b0hlaWdodCkge1xuICAgICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykge1xuICAgICAgICBldmVudHMub24oJ2lubmVyTG9hZGVkJywgZG9BdXRvSGVpZ2h0KTtcbiAgICAgIH0gZWxzZSBpZiAoIWRpc2FibGUpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cbiAgICB9XG5cbiAgICBkb0xhenlMb2FkKCk7XG4gICAgaWYgKGRpc2FibGUpIHsgZGlzYWJsZVNsaWRlcigpOyB9IGVsc2UgaWYgKGZyZWV6ZSkgeyBmcmVlemVTbGlkZXIoKTsgfVxuXG4gICAgZXZlbnRzLm9uKCdpbmRleENoYW5nZWQnLCBhZGRpdGlvbmFsVXBkYXRlcyk7XG4gICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykgeyBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpOyB9XG4gICAgaWYgKHR5cGVvZiBvbkluaXQgPT09ICdmdW5jdGlvbicpIHsgb25Jbml0KGluZm8oKSk7IH1cbiAgICBpc09uID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICAgIC8vIHNoZWV0XG4gICAgc2hlZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGlmIChzaGVldC5vd25lck5vZGUpIHsgc2hlZXQub3duZXJOb2RlLnJlbW92ZSgpOyB9XG5cbiAgICAvLyByZW1vdmUgd2luIGV2ZW50IGxpc3RlbmVyc1xuICAgIHJlbW92ZUV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcblxuICAgIC8vIGFycm93S2V5cywgY29udHJvbHMsIG5hdlxuICAgIGlmIChhcnJvd0tleXMpIHsgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cbiAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHsgcmVtb3ZlRXZlbnRzKGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0V2ZW50cyk7IH1cbiAgICBpZiAobmF2Q29udGFpbmVyKSB7IHJlbW92ZUV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7IH1cblxuICAgIC8vIGF1dG9wbGF5XG4gICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpO1xuICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHZpc2liaWxpdHlFdmVudCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHJlbW92ZUV2ZW50cyhhdXRvcGxheUJ1dHRvbiwgeydjbGljayc6IHRvZ2dsZUF1dG9wbGF5fSk7IH1cbiAgICBpZiAoYXV0b3BsYXkpIHsgY2xlYXJJbnRlcnZhbChhdXRvcGxheVRpbWVyKTsgfVxuXG4gICAgLy8gY29udGFpbmVyXG4gICAgaWYgKGNhcm91c2VsICYmIFRSQU5TSVRJT05FTkQpIHtcbiAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGV2ZSk7XG4gICAgfVxuICAgIGlmICh0b3VjaCkgeyByZW1vdmVFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cyk7IH1cbiAgICBpZiAobW91c2VEcmFnKSB7IHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpOyB9XG5cbiAgICAvLyBjYWNoZSBPYmplY3QgdmFsdWVzIGluIG9wdGlvbnMgJiYgcmVzZXQgSFRNTFxuICAgIHZhciBodG1sTGlzdCA9IFtjb250YWluZXJIVE1MLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b25IVE1MLCBuZXh0QnV0dG9uSFRNTCwgbmF2Q29udGFpbmVySFRNTCwgYXV0b3BsYXlCdXR0b25IVE1MXTtcblxuICAgIHRuc0xpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgZWwgPSBpdGVtID09PSAnY29udGFpbmVyJyA/IG91dGVyV3JhcHBlciA6IG9wdGlvbnNbaXRlbV07XG5cbiAgICAgIGlmICh0eXBlb2YgZWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBwcmV2RWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID8gZWwucHJldmlvdXNFbGVtZW50U2libGluZyA6IGZhbHNlLFxuICAgICAgICAgICAgcGFyZW50RWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgICBlbC5vdXRlckhUTUwgPSBodG1sTGlzdFtpXTtcbiAgICAgICAgb3B0aW9uc1tpdGVtXSA9IHByZXZFbCA/IHByZXZFbC5uZXh0RWxlbWVudFNpYmxpbmcgOiBwYXJlbnRFbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8gcmVzZXQgdmFyaWFibGVzXG4gICAgdG5zTGlzdCA9IGFuaW1hdGVJbiA9IGFuaW1hdGVPdXQgPSBhbmltYXRlRGVsYXkgPSBhbmltYXRlTm9ybWFsID0gaG9yaXpvbnRhbCA9IG91dGVyV3JhcHBlciA9IGlubmVyV3JhcHBlciA9IGNvbnRhaW5lciA9IGNvbnRhaW5lclBhcmVudCA9IGNvbnRhaW5lckhUTUwgPSBzbGlkZUl0ZW1zID0gc2xpZGVDb3VudCA9IGJyZWFrcG9pbnRab25lID0gd2luZG93V2lkdGggPSBhdXRvV2lkdGggPSBmaXhlZFdpZHRoID0gZWRnZVBhZGRpbmcgPSBndXR0ZXIgPSB2aWV3cG9ydCA9IGl0ZW1zID0gc2xpZGVCeSA9IHZpZXdwb3J0TWF4ID0gYXJyb3dLZXlzID0gc3BlZWQgPSByZXdpbmQgPSBsb29wID0gYXV0b0hlaWdodCA9IHNoZWV0ID0gbGF6eWxvYWQgPSBzbGlkZVBvc2l0aW9ucyA9IHNsaWRlSXRlbXNPdXQgPSBjbG9uZUNvdW50ID0gc2xpZGVDb3VudE5ldyA9IGhhc1JpZ2h0RGVhZFpvbmUgPSByaWdodEJvdW5kYXJ5ID0gdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1BdHRyID0gdHJhbnNmb3JtUHJlZml4ID0gdHJhbnNmb3JtUG9zdGZpeCA9IGdldEluZGV4TWF4ID0gaW5kZXggPSBpbmRleENhY2hlZCA9IGluZGV4TWluID0gaW5kZXhNYXggPSByZXNpemVUaW1lciA9IHN3aXBlQW5nbGUgPSBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBydW5uaW5nID0gb25Jbml0ID0gZXZlbnRzID0gbmV3Q29udGFpbmVyQ2xhc3NlcyA9IHNsaWRlSWQgPSBkaXNhYmxlID0gZGlzYWJsZWQgPSBmcmVlemFibGUgPSBmcmVlemUgPSBmcm96ZW4gPSBjb250cm9sc0V2ZW50cyA9IG5hdkV2ZW50cyA9IGhvdmVyRXZlbnRzID0gdmlzaWJpbGl0eUV2ZW50ID0gZG9jbWVudEtleWRvd25FdmVudCA9IHRvdWNoRXZlbnRzID0gZHJhZ0V2ZW50cyA9IGhhc0NvbnRyb2xzID0gaGFzTmF2ID0gbmF2QXNUaHVtYm5haWxzID0gaGFzQXV0b3BsYXkgPSBoYXNUb3VjaCA9IGhhc01vdXNlRHJhZyA9IHNsaWRlQWN0aXZlQ2xhc3MgPSBpbWdDb21wbGV0ZUNsYXNzID0gaW1nRXZlbnRzID0gaW1nc0NvbXBsZXRlID0gY29udHJvbHMgPSBjb250cm9sc1RleHQgPSBjb250cm9sc0NvbnRhaW5lciA9IGNvbnRyb2xzQ29udGFpbmVySFRNTCA9IHByZXZCdXR0b24gPSBuZXh0QnV0dG9uID0gcHJldklzQnV0dG9uID0gbmV4dElzQnV0dG9uID0gbmF2ID0gbmF2Q29udGFpbmVyID0gbmF2Q29udGFpbmVySFRNTCA9IG5hdkl0ZW1zID0gcGFnZXMgPSBwYWdlc0NhY2hlZCA9IG5hdkNsaWNrZWQgPSBuYXZDdXJyZW50SW5kZXggPSBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZBY3RpdmVDbGFzcyA9IG5hdlN0ciA9IG5hdlN0ckN1cnJlbnQgPSBhdXRvcGxheSA9IGF1dG9wbGF5VGltZW91dCA9IGF1dG9wbGF5RGlyZWN0aW9uID0gYXV0b3BsYXlUZXh0ID0gYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlCdXR0b24gPSBhdXRvcGxheUJ1dHRvbkhUTUwgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gYXV0b3BsYXlIdG1sU3RyaW5ncyA9IGF1dG9wbGF5VGltZXIgPSBhbmltYXRpbmcgPSBhdXRvcGxheUhvdmVyUGF1c2VkID0gYXV0b3BsYXlVc2VyUGF1c2VkID0gYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gaW5pdFBvc2l0aW9uID0gbGFzdFBvc2l0aW9uID0gdHJhbnNsYXRlSW5pdCA9IGRpc1ggPSBkaXNZID0gcGFuU3RhcnQgPSByYWZJbmRleCA9IGdldERpc3QgPSB0b3VjaCA9IG1vdXNlRHJhZyA9IG51bGw7XG4gICAgLy8gY2hlY2sgdmFyaWFibGVzXG4gICAgLy8gW2FuaW1hdGVJbiwgYW5pbWF0ZU91dCwgYW5pbWF0ZURlbGF5LCBhbmltYXRlTm9ybWFsLCBob3Jpem9udGFsLCBvdXRlcldyYXBwZXIsIGlubmVyV3JhcHBlciwgY29udGFpbmVyLCBjb250YWluZXJQYXJlbnQsIGNvbnRhaW5lckhUTUwsIHNsaWRlSXRlbXMsIHNsaWRlQ291bnQsIGJyZWFrcG9pbnRab25lLCB3aW5kb3dXaWR0aCwgYXV0b1dpZHRoLCBmaXhlZFdpZHRoLCBlZGdlUGFkZGluZywgZ3V0dGVyLCB2aWV3cG9ydCwgaXRlbXMsIHNsaWRlQnksIHZpZXdwb3J0TWF4LCBhcnJvd0tleXMsIHNwZWVkLCByZXdpbmQsIGxvb3AsIGF1dG9IZWlnaHQsIHNoZWV0LCBsYXp5bG9hZCwgc2xpZGVQb3NpdGlvbnMsIHNsaWRlSXRlbXNPdXQsIGNsb25lQ291bnQsIHNsaWRlQ291bnROZXcsIGhhc1JpZ2h0RGVhZFpvbmUsIHJpZ2h0Qm91bmRhcnksIHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtLCB0cmFuc2Zvcm1BdHRyLCB0cmFuc2Zvcm1QcmVmaXgsIHRyYW5zZm9ybVBvc3RmaXgsIGdldEluZGV4TWF4LCBpbmRleCwgaW5kZXhDYWNoZWQsIGluZGV4TWluLCBpbmRleE1heCwgcmVzaXplVGltZXIsIHN3aXBlQW5nbGUsIG1vdmVEaXJlY3Rpb25FeHBlY3RlZCwgcnVubmluZywgb25Jbml0LCBldmVudHMsIG5ld0NvbnRhaW5lckNsYXNzZXMsIHNsaWRlSWQsIGRpc2FibGUsIGRpc2FibGVkLCBmcmVlemFibGUsIGZyZWV6ZSwgZnJvemVuLCBjb250cm9sc0V2ZW50cywgbmF2RXZlbnRzLCBob3ZlckV2ZW50cywgdmlzaWJpbGl0eUV2ZW50LCBkb2NtZW50S2V5ZG93bkV2ZW50LCB0b3VjaEV2ZW50cywgZHJhZ0V2ZW50cywgaGFzQ29udHJvbHMsIGhhc05hdiwgbmF2QXNUaHVtYm5haWxzLCBoYXNBdXRvcGxheSwgaGFzVG91Y2gsIGhhc01vdXNlRHJhZywgc2xpZGVBY3RpdmVDbGFzcywgaW1nQ29tcGxldGVDbGFzcywgaW1nRXZlbnRzLCBpbWdzQ29tcGxldGUsIGNvbnRyb2xzLCBjb250cm9sc1RleHQsIGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b24sIG5leHRCdXR0b24sIHByZXZJc0J1dHRvbiwgbmV4dElzQnV0dG9uLCBuYXYsIG5hdkNvbnRhaW5lciwgbmF2Q29udGFpbmVySFRNTCwgbmF2SXRlbXMsIHBhZ2VzLCBwYWdlc0NhY2hlZCwgbmF2Q2xpY2tlZCwgbmF2Q3VycmVudEluZGV4LCBuYXZDdXJyZW50SW5kZXhDYWNoZWQsIG5hdkFjdGl2ZUNsYXNzLCBuYXZTdHIsIG5hdlN0ckN1cnJlbnQsIGF1dG9wbGF5LCBhdXRvcGxheVRpbWVvdXQsIGF1dG9wbGF5RGlyZWN0aW9uLCBhdXRvcGxheVRleHQsIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlCdXR0b24sIGF1dG9wbGF5QnV0dG9uSFRNTCwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSwgYXV0b3BsYXlIdG1sU3RyaW5ncywgYXV0b3BsYXlUaW1lciwgYW5pbWF0aW5nLCBhdXRvcGxheUhvdmVyUGF1c2VkLCBhdXRvcGxheVVzZXJQYXVzZWQsIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCwgaW5pdFBvc2l0aW9uLCBsYXN0UG9zaXRpb24sIHRyYW5zbGF0ZUluaXQsIGRpc1gsIGRpc1ksIHBhblN0YXJ0LCByYWZJbmRleCwgZ2V0RGlzdCwgdG91Y2gsIG1vdXNlRHJhZyBdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyBpZiAoaXRlbSAhPT0gbnVsbCkgeyBjb25zb2xlLmxvZyhpdGVtKTsgfSB9KTtcblxuICAgIGZvciAodmFyIGEgaW4gdGhpcykge1xuICAgICAgaWYgKGEgIT09ICdyZWJ1aWxkJykgeyB0aGlzW2FdID0gbnVsbDsgfVxuICAgIH1cbiAgICBpc09uID0gZmFsc2U7XG4gIH1cblxuLy8gPT09IE9OIFJFU0laRSA9PT1cbiAgLy8gcmVzcG9uc2l2ZSB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCB8fCAhaG9yaXpvbnRhbFxuICBmdW5jdGlvbiBvblJlc2l6ZSAoZSkge1xuICAgIHJhZihmdW5jdGlvbigpeyByZXNpemVUYXNrcyhnZXRFdmVudChlKSk7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzaXplVGFza3MgKGUpIHtcbiAgICBpZiAoIWlzT24pIHsgcmV0dXJuOyB9XG4gICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykgeyBldmVudHMuZW1pdCgnb3V0ZXJSZXNpemVkJywgaW5mbyhlKSk7IH1cbiAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCk7XG4gICAgdmFyIGJwQ2hhbmdlZCxcbiAgICAgICAgYnJlYWtwb2ludFpvbmVUZW0gPSBicmVha3BvaW50Wm9uZSxcbiAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IGZhbHNlO1xuXG4gICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgIHNldEJyZWFrcG9pbnRab25lKCk7XG4gICAgICBicENoYW5nZWQgPSBicmVha3BvaW50Wm9uZVRlbSAhPT0gYnJlYWtwb2ludFpvbmU7XG4gICAgICAvLyBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfSAvLyAqP1xuICAgICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludFN0YXJ0JywgaW5mbyhlKSk7IH1cbiAgICB9XG5cbiAgICB2YXIgaW5kQ2hhbmdlZCxcbiAgICAgICAgaXRlbXNDaGFuZ2VkLFxuICAgICAgICBpdGVtc1RlbSA9IGl0ZW1zLFxuICAgICAgICBkaXNhYmxlVGVtID0gZGlzYWJsZSxcbiAgICAgICAgZnJlZXplVGVtID0gZnJlZXplLFxuICAgICAgICBhcnJvd0tleXNUZW0gPSBhcnJvd0tleXMsXG4gICAgICAgIGNvbnRyb2xzVGVtID0gY29udHJvbHMsXG4gICAgICAgIG5hdlRlbSA9IG5hdixcbiAgICAgICAgdG91Y2hUZW0gPSB0b3VjaCxcbiAgICAgICAgbW91c2VEcmFnVGVtID0gbW91c2VEcmFnLFxuICAgICAgICBhdXRvcGxheVRlbSA9IGF1dG9wbGF5LFxuICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VUZW0gPSBhdXRvcGxheUhvdmVyUGF1c2UsXG4gICAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlUZW0gPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5LFxuICAgICAgICBpbmRleFRlbSA9IGluZGV4O1xuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgdmFyIGZpeGVkV2lkdGhUZW0gPSBmaXhlZFdpZHRoLFxuICAgICAgICAgIGF1dG9IZWlnaHRUZW0gPSBhdXRvSGVpZ2h0LFxuICAgICAgICAgIGNvbnRyb2xzVGV4dFRlbSA9IGNvbnRyb2xzVGV4dCxcbiAgICAgICAgICBjZW50ZXJUZW0gPSBjZW50ZXIsXG4gICAgICAgICAgYXV0b3BsYXlUZXh0VGVtID0gYXV0b3BsYXlUZXh0O1xuXG4gICAgICBpZiAoIUNTU01RKSB7XG4gICAgICAgIHZhciBndXR0ZXJUZW0gPSBndXR0ZXIsXG4gICAgICAgICAgICBlZGdlUGFkZGluZ1RlbSA9IGVkZ2VQYWRkaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCBvcHRpb246XG4gICAgLy8gZml4ZWQgd2lkdGg6IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXIgPT4gaXRlbXNcbiAgICAvLyBvdGhlcnM6IHdpbmRvdyB3aWR0aCA9PiBhbGwgdmFyaWFibGVzXG4gICAgLy8gYWxsOiBpdGVtcyA9PiBzbGlkZUJ5XG4gICAgYXJyb3dLZXlzID0gZ2V0T3B0aW9uKCdhcnJvd0tleXMnKTtcbiAgICBjb250cm9scyA9IGdldE9wdGlvbignY29udHJvbHMnKTtcbiAgICBuYXYgPSBnZXRPcHRpb24oJ25hdicpO1xuICAgIHRvdWNoID0gZ2V0T3B0aW9uKCd0b3VjaCcpO1xuICAgIGNlbnRlciA9IGdldE9wdGlvbignY2VudGVyJyk7XG4gICAgbW91c2VEcmFnID0gZ2V0T3B0aW9uKCdtb3VzZURyYWcnKTtcbiAgICBhdXRvcGxheSA9IGdldE9wdGlvbignYXV0b3BsYXknKTtcbiAgICBhdXRvcGxheUhvdmVyUGF1c2UgPSBnZXRPcHRpb24oJ2F1dG9wbGF5SG92ZXJQYXVzZScpO1xuICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5UmVzZXRPblZpc2liaWxpdHknKTtcblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGRpc2FibGUgPSBnZXRPcHRpb24oJ2Rpc2FibGUnKTtcbiAgICAgIGZpeGVkV2lkdGggPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnKTtcbiAgICAgIHNwZWVkID0gZ2V0T3B0aW9uKCdzcGVlZCcpO1xuICAgICAgYXV0b0hlaWdodCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcpO1xuICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKTtcbiAgICAgIGF1dG9wbGF5VGV4dCA9IGdldE9wdGlvbignYXV0b3BsYXlUZXh0Jyk7XG4gICAgICBhdXRvcGxheVRpbWVvdXQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGltZW91dCcpO1xuXG4gICAgICBpZiAoIUNTU01RKSB7XG4gICAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpO1xuICAgICAgICBndXR0ZXIgPSBnZXRPcHRpb24oJ2d1dHRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB1cGRhdGUgb3B0aW9uc1xuICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlKTtcblxuICAgIHZpZXdwb3J0ID0gZ2V0Vmlld3BvcnRXaWR0aCgpOyAvLyA8PSBlZGdlUGFkZGluZywgZ3V0dGVyXG4gICAgaWYgKCghaG9yaXpvbnRhbCB8fCBhdXRvV2lkdGgpICYmICFkaXNhYmxlKSB7XG4gICAgICBzZXRTbGlkZVBvc2l0aW9ucygpO1xuICAgICAgaWYgKCFob3Jpem9udGFsKSB7XG4gICAgICAgIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7IC8vIDw9IHNldFNsaWRlUG9zaXRpb25zXG4gICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIHJpZ2h0Qm91bmRhcnkgPSBnZXRSaWdodEJvdW5kYXJ5KCk7IC8vIGF1dG9XaWR0aDogPD0gdmlld3BvcnQsIHNsaWRlUG9zaXRpb25zLCBndXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpeGVkV2lkdGg6IDw9IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXJcbiAgICAgIGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgLy8gYXV0b1dpZHRoOiA8PSByaWdodEJvdW5kYXJ5LCBzbGlkZVBvc2l0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZFdpZHRoOiA8PSByaWdodEJvdW5kYXJ5LCBmaXhlZFdpZHRoLCBndXR0ZXJcbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkIHx8IGZpeGVkV2lkdGgpIHtcbiAgICAgIGl0ZW1zID0gZ2V0T3B0aW9uKCdpdGVtcycpO1xuICAgICAgc2xpZGVCeSA9IGdldE9wdGlvbignc2xpZGVCeScpO1xuICAgICAgaXRlbXNDaGFuZ2VkID0gaXRlbXMgIT09IGl0ZW1zVGVtO1xuXG4gICAgICBpZiAoaXRlbXNDaGFuZ2VkKSB7XG4gICAgICAgIGlmICghZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7IGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgfSAvLyA8PSBpdGVtc1xuICAgICAgICAvLyBjaGVjayBpbmRleCBiZWZvcmUgdHJhbnNmb3JtIGluIGNhc2VcbiAgICAgICAgLy8gc2xpZGVyIHJlYWNoIHRoZSByaWdodCBlZGdlIHRoZW4gaXRlbXMgYmVjb21lIGJpZ2dlclxuICAgICAgICB1cGRhdGVJbmRleCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBpZiAoZGlzYWJsZSAhPT0gZGlzYWJsZVRlbSkge1xuICAgICAgICBpZiAoZGlzYWJsZSkge1xuICAgICAgICAgIGRpc2FibGVTbGlkZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmFibGVTbGlkZXIoKTsgLy8gPD0gc2xpZGVQb3NpdGlvbnMsIHJpZ2h0Qm91bmRhcnksIGluZGV4TWF4XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnJlZXphYmxlICYmIChicENoYW5nZWQgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpKSB7XG4gICAgICBmcmVlemUgPSBnZXRGcmVlemUoKTsgLy8gPD0gYXV0b1dpZHRoOiBzbGlkZVBvc2l0aW9ucywgZ3V0dGVyLCB2aWV3cG9ydCwgcmlnaHRCb3VuZGFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDw9IGZpeGVkV2lkdGg6IGZpeGVkV2lkdGgsIGd1dHRlciwgcmlnaHRCb3VuZGFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDw9IG90aGVyczogaXRlbXNcblxuICAgICAgaWYgKGZyZWV6ZSAhPT0gZnJlZXplVGVtKSB7XG4gICAgICAgIGlmIChmcmVlemUpIHtcbiAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybShnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZShnZXRTdGFydEluZGV4KDApKSk7XG4gICAgICAgICAgZnJlZXplU2xpZGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5mcmVlemVTbGlkZXIoKTtcbiAgICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7IC8vIGNvbnRyb2xzLCBuYXYsIHRvdWNoLCBtb3VzZURyYWcsIGFycm93S2V5cywgYXV0b3BsYXksIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVxuICAgIGlmICghYXV0b3BsYXkpIHsgYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGZhbHNlOyB9XG5cbiAgICBpZiAoYXJyb3dLZXlzICE9PSBhcnJvd0tleXNUZW0pIHtcbiAgICAgIGFycm93S2V5cyA/XG4gICAgICAgIGFkZEV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7XG4gICAgfVxuICAgIGlmIChjb250cm9scyAhPT0gY29udHJvbHNUZW0pIHtcbiAgICAgIGlmIChjb250cm9scykge1xuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICBzaG93RWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgc2hvd0VsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBzaG93RWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICBoaWRlRWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgaGlkZUVsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBoaWRlRWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXYgIT09IG5hdlRlbSkge1xuICAgICAgbmF2ID9cbiAgICAgICAgc2hvd0VsZW1lbnQobmF2Q29udGFpbmVyKSA6XG4gICAgICAgIGhpZGVFbGVtZW50KG5hdkNvbnRhaW5lcik7XG4gICAgfVxuICAgIGlmICh0b3VjaCAhPT0gdG91Y2hUZW0pIHtcbiAgICAgIHRvdWNoID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMsIG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2gpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMpO1xuICAgIH1cbiAgICBpZiAobW91c2VEcmFnICE9PSBtb3VzZURyYWdUZW0pIHtcbiAgICAgIG1vdXNlRHJhZyA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7XG4gICAgfVxuICAgIGlmIChhdXRvcGxheSAhPT0gYXV0b3BsYXlUZW0pIHtcbiAgICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgc2hvd0VsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgICAgIGlmICghYW5pbWF0aW5nICYmICFhdXRvcGxheVVzZXJQYXVzZWQpIHsgc3RhcnRBdXRvcGxheSgpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgaGlkZUVsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgICAgIGlmIChhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5KCk7IH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSAhPT0gYXV0b3BsYXlIb3ZlclBhdXNlVGVtKSB7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2UgP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cykgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7XG4gICAgfVxuICAgIGlmIChhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ICE9PSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtKSB7XG4gICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID9cbiAgICAgICAgYWRkRXZlbnRzKGRvYywgdmlzaWJpbGl0eUV2ZW50KSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhkb2MsIHZpc2liaWxpdHlFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgaWYgKGZpeGVkV2lkdGggIT09IGZpeGVkV2lkdGhUZW0gfHwgY2VudGVyICE9PSBjZW50ZXJUZW0pIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH1cblxuICAgICAgaWYgKGF1dG9IZWlnaHQgIT09IGF1dG9IZWlnaHRUZW0pIHtcbiAgICAgICAgaWYgKCFhdXRvSGVpZ2h0KSB7IGlubmVyV3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJzsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29udHJvbHMgJiYgY29udHJvbHNUZXh0ICE9PSBjb250cm9sc1RleHRUZW0pIHtcbiAgICAgICAgcHJldkJ1dHRvbi5pbm5lckhUTUwgPSBjb250cm9sc1RleHRbMF07XG4gICAgICAgIG5leHRCdXR0b24uaW5uZXJIVE1MID0gY29udHJvbHNUZXh0WzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24gJiYgYXV0b3BsYXlUZXh0ICE9PSBhdXRvcGxheVRleHRUZW0pIHtcbiAgICAgICAgdmFyIGkgPSBhdXRvcGxheSA/IDEgOiAwLFxuICAgICAgICAgICAgaHRtbCA9IGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCxcbiAgICAgICAgICAgIGxlbiA9IGh0bWwubGVuZ3RoIC0gYXV0b3BsYXlUZXh0VGVtW2ldLmxlbmd0aDtcbiAgICAgICAgaWYgKGh0bWwuc3Vic3RyaW5nKGxlbikgPT09IGF1dG9wbGF5VGV4dFRlbVtpXSkge1xuICAgICAgICAgIGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCA9IGh0bWwuc3Vic3RyaW5nKDAsIGxlbikgKyBhdXRvcGxheVRleHRbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNlbnRlciAmJiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1zQ2hhbmdlZCB8fCBmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIHBhZ2VzID0gZ2V0UGFnZXMoKTtcbiAgICAgIHVwZGF0ZU5hdlZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICBpbmRDaGFuZ2VkID0gaW5kZXggIT09IGluZGV4VGVtO1xuICAgIGlmIChpbmRDaGFuZ2VkKSB7IFxuICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG4gICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1zQ2hhbmdlZCkge1xuICAgICAgaWYgKCFpbmRDaGFuZ2VkKSB7IGFkZGl0aW9uYWxVcGRhdGVzKCk7IH1cbiAgICB9IGVsc2UgaWYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICBkb0xhenlMb2FkKCk7IFxuICAgICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcbiAgICAgIHVwZGF0ZUxpdmVSZWdpb24oKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbXNDaGFuZ2VkICYmICFjYXJvdXNlbCkgeyB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMoKTsgfVxuXG4gICAgaWYgKCFkaXNhYmxlICYmICFmcmVlemUpIHtcbiAgICAgIC8vIG5vbi1tZWR1YXF1ZXJpZXM6IElFOFxuICAgICAgaWYgKGJwQ2hhbmdlZCAmJiAhQ1NTTVEpIHtcbiAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXG4gICAgICAgIGlmIChhdXRvSGVpZ2h0ICE9PSBhdXRvaGVpZ2h0VGVtIHx8IHNwZWVkICE9PSBzcGVlZFRlbSkge1xuICAgICAgICAgIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgICBpZiAoZWRnZVBhZGRpbmcgIT09IGVkZ2VQYWRkaW5nVGVtIHx8IGd1dHRlciAhPT0gZ3V0dGVyVGVtKSB7XG4gICAgICAgICAgaW5uZXJXcmFwcGVyLnN0eWxlLmNzc1RleHQgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmcsIGd1dHRlciwgZml4ZWRXaWR0aCwgc3BlZWQsIGF1dG9IZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgICAgICB2YXIgc3RyID0gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpICsgXG4gICAgICAgICAgICAgICAgICAgIGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTtcblxuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgbGFzdCBsaW5lIGFuZFxuICAgICAgICAgIC8vIGFkZCBuZXcgc3R5bGVzXG4gICAgICAgICAgcmVtb3ZlQ1NTUnVsZShzaGVldCwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpIC0gMSk7XG4gICAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXV0byBoZWlnaHRcbiAgICAgIGlmIChhdXRvSGVpZ2h0KSB7IGRvQXV0b0hlaWdodCgpOyB9XG5cbiAgICAgIGlmIChuZWVkQ29udGFpbmVyVHJhbnNmb3JtKSB7XG4gICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG4gICAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludEVuZCcsIGluZm8oZSkpOyB9XG4gIH1cblxuXG5cblxuXG4gIC8vID09PSBJTklUSUFMSVpBVElPTiBGVU5DVElPTlMgPT09IC8vXG4gIGZ1bmN0aW9uIGdldEZyZWV6ZSAoKSB7XG4gICAgaWYgKCFmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIHZhciBhID0gY2VudGVyID8gaXRlbXMgLSAoaXRlbXMgLSAxKSAvIDIgOiBpdGVtcztcbiAgICAgIHJldHVybiAgc2xpZGVDb3VudCA8PSBhO1xuICAgIH1cblxuICAgIHZhciB3aWR0aCA9IGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50IDogc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudF0sXG4gICAgICAgIHZwID0gZWRnZVBhZGRpbmcgPyB2aWV3cG9ydCArIGVkZ2VQYWRkaW5nICogMiA6IHZpZXdwb3J0ICsgZ3V0dGVyO1xuXG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgdnAgLT0gZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6ICh2aWV3cG9ydCAtIChzbGlkZVBvc2l0aW9uc1tpbmRleCArIDFdIC0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdIC0gZ3V0dGVyKSkgLyAyO1xuICAgIH1cblxuICAgIHJldHVybiB3aWR0aCA8PSB2cDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEJyZWFrcG9pbnRab25lICgpIHtcbiAgICBicmVha3BvaW50Wm9uZSA9IDA7XG4gICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgYnAgPSBwYXJzZUludChicCk7IC8vIGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgaWYgKHdpbmRvd1dpZHRoID49IGJwKSB7IGJyZWFrcG9pbnRab25lID0gYnA7IH1cbiAgICB9XG4gIH1cblxuICAvLyAoc2xpZGVCeSwgaW5kZXhNaW4sIGluZGV4TWF4KSA9PiBpbmRleFxuICB2YXIgdXBkYXRlSW5kZXggPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsb29wID8gXG4gICAgICBjYXJvdXNlbCA/XG4gICAgICAgIC8vIGxvb3AgKyBjYXJvdXNlbFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGxlZnRFZGdlID0gaW5kZXhNaW4sXG4gICAgICAgICAgICAgIHJpZ2h0RWRnZSA9IGluZGV4TWF4O1xuXG4gICAgICAgICAgbGVmdEVkZ2UgKz0gc2xpZGVCeTtcbiAgICAgICAgICByaWdodEVkZ2UgLT0gc2xpZGVCeTtcblxuICAgICAgICAgIC8vIGFkanVzdCBlZGdlcyB3aGVuIGhhcyBlZGdlIHBhZGRpbmdzXG4gICAgICAgICAgLy8gb3IgZml4ZWQtd2lkdGggc2xpZGVyIHdpdGggZXh0cmEgc3BhY2Ugb24gdGhlIHJpZ2h0IHNpZGVcbiAgICAgICAgICBpZiAoZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICAgIGxlZnRFZGdlICs9IDE7XG4gICAgICAgICAgICByaWdodEVkZ2UgLT0gMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgICAgIGlmICgodmlld3BvcnQgKyBndXR0ZXIpJShmaXhlZFdpZHRoICsgZ3V0dGVyKSkgeyByaWdodEVkZ2UgLT0gMTsgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICAgICAgaW5kZXggLT0gc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgICAgICBpbmRleCArPSBzbGlkZUNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAgIC8vIGxvb3AgKyBnYWxsZXJ5XG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gaW5kZXhNaW4gKyBzbGlkZUNvdW50KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA8PSBpbmRleE1heCAtIHNsaWRlQ291bnQpIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAvLyBub24tbG9vcFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXhNaW4sIE1hdGgubWluKGluZGV4TWF4LCBpbmRleCkpO1xuICAgICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiBkaXNhYmxlVUkgKCkge1xuICAgIGlmICghYXV0b3BsYXkgJiYgYXV0b3BsYXlCdXR0b24pIHsgaGlkZUVsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgaWYgKCFuYXYgJiYgbmF2Q29udGFpbmVyKSB7IGhpZGVFbGVtZW50KG5hdkNvbnRhaW5lcik7IH1cbiAgICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgaGlkZUVsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgaGlkZUVsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgaGlkZUVsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVVSSAoKSB7XG4gICAgaWYgKGF1dG9wbGF5ICYmIGF1dG9wbGF5QnV0dG9uKSB7IHNob3dFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgIGlmIChuYXYgJiYgbmF2Q29udGFpbmVyKSB7IHNob3dFbGVtZW50KG5hdkNvbnRhaW5lcik7IH1cbiAgICBpZiAoY29udHJvbHMpIHtcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBzaG93RWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBzaG93RWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBzaG93RWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZyZWV6ZVNsaWRlciAoKSB7XG4gICAgaWYgKGZyb3plbikgeyByZXR1cm47IH1cblxuICAgIC8vIHJlbW92ZSBlZGdlIHBhZGRpbmcgZnJvbSBpbm5lciB3cmFwcGVyXG4gICAgaWYgKGVkZ2VQYWRkaW5nKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnMHB4JzsgfVxuXG4gICAgLy8gYWRkIGNsYXNzIHRucy10cmFuc3BhcmVudCB0byBjbG9uZWQgc2xpZGVzXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBzdHIgPSAndG5zLXRyYW5zcGFyZW50JztcbiAgICAgIGZvciAodmFyIGkgPSBjbG9uZUNvdW50OyBpLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBhZGRDbGFzcyhzbGlkZUl0ZW1zW2ldLCBzdHIpOyB9XG4gICAgICAgIGFkZENsYXNzKHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGkgLSAxXSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBkaXNhYmxlVUkoKTtcblxuICAgIGZyb3plbiA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB1bmZyZWV6ZVNsaWRlciAoKSB7XG4gICAgaWYgKCFmcm96ZW4pIHsgcmV0dXJuOyB9XG5cbiAgICAvLyByZXN0b3JlIGVkZ2UgcGFkZGluZyBmb3IgaW5uZXIgd3JhcHBlclxuICAgIC8vIGZvciBtb3JkZXJuIGJyb3dzZXJzXG4gICAgaWYgKGVkZ2VQYWRkaW5nICYmIENTU01RKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnJzsgfVxuXG4gICAgLy8gcmVtb3ZlIGNsYXNzIHRucy10cmFuc3BhcmVudCB0byBjbG9uZWQgc2xpZGVzXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBzdHIgPSAndG5zLXRyYW5zcGFyZW50JztcbiAgICAgIGZvciAodmFyIGkgPSBjbG9uZUNvdW50OyBpLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyByZW1vdmVDbGFzcyhzbGlkZUl0ZW1zW2ldLCBzdHIpOyB9XG4gICAgICAgIHJlbW92ZUNsYXNzKHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGkgLSAxXSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBlbmFibGVVSSgpO1xuXG4gICAgZnJvemVuID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlU2xpZGVyICgpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBzaGVldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZShuZXdDb250YWluZXJDbGFzc2VzLnN1YnN0cmluZygxKSwgJycpO1xuICAgIHJlbW92ZUF0dHJzKGNvbnRhaW5lciwgWydzdHlsZSddKTtcbiAgICBpZiAobG9vcCkge1xuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IGhpZGVFbGVtZW50KHNsaWRlSXRlbXNbal0pOyB9XG4gICAgICAgIGhpZGVFbGVtZW50KHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGogLSAxXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmVydGljYWwgc2xpZGVyXG4gICAgaWYgKCFob3Jpem9udGFsIHx8ICFjYXJvdXNlbCkgeyByZW1vdmVBdHRycyhpbm5lcldyYXBwZXIsIFsnc3R5bGUnXSk7IH1cblxuICAgIC8vIGdhbGxlcnlcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcbiAgICAgICAgcmVtb3ZlQXR0cnMoaXRlbSwgWydzdHlsZSddKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZGlzYWJsZVVJKCk7XG5cbiAgICBkaXNhYmxlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVTbGlkZXIgKCkge1xuICAgIGlmICghZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBzaGVldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gbmV3Q29udGFpbmVyQ2xhc3NlcztcbiAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuXG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBzaG93RWxlbWVudChzbGlkZUl0ZW1zW2pdKTsgfVxuICAgICAgICBzaG93RWxlbWVudChzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBqIC0gMV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdhbGxlcnlcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXSxcbiAgICAgICAgICAgIGNsYXNzTiA9IGkgPCBpbmRleCArIGl0ZW1zID8gYW5pbWF0ZUluIDogYW5pbWF0ZU5vcm1hbDtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NOKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBlbmFibGVVSSgpO1xuXG4gICAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUxpdmVSZWdpb24gKCkge1xuICAgIHZhciBzdHIgPSBnZXRMaXZlUmVnaW9uU3RyKCk7XG4gICAgaWYgKGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCAhPT0gc3RyKSB7IGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCA9IHN0cjsgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGl2ZVJlZ2lvblN0ciAoKSB7XG4gICAgdmFyIGFyciA9IGdldFZpc2libGVTbGlkZVJhbmdlKCksXG4gICAgICAgIHN0YXJ0ID0gYXJyWzBdICsgMSxcbiAgICAgICAgZW5kID0gYXJyWzFdICsgMTtcbiAgICByZXR1cm4gc3RhcnQgPT09IGVuZCA/IHN0YXJ0ICsgJycgOiBzdGFydCArICcgdG8gJyArIGVuZDsgXG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaXNpYmxlU2xpZGVSYW5nZSAodmFsKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7IHZhbCA9IGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCk7IH1cbiAgICB2YXIgc3RhcnQgPSBpbmRleCwgZW5kLCByYW5nZXN0YXJ0LCByYW5nZWVuZDtcblxuICAgIC8vIGdldCByYW5nZSBzdGFydCwgcmFuZ2UgZW5kIGZvciBhdXRvV2lkdGggYW5kIGZpeGVkV2lkdGhcbiAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICBpZiAoYXV0b1dpZHRoIHx8IGZpeGVkV2lkdGgpIHtcbiAgICAgICAgcmFuZ2VzdGFydCA9IC0gKHBhcnNlRmxvYXQodmFsKSArIGVkZ2VQYWRkaW5nKTtcbiAgICAgICAgcmFuZ2VlbmQgPSByYW5nZXN0YXJ0ICsgdmlld3BvcnQgKyBlZGdlUGFkZGluZyAqIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgcmFuZ2VzdGFydCA9IHNsaWRlUG9zaXRpb25zW2luZGV4XTtcbiAgICAgICAgcmFuZ2VlbmQgPSByYW5nZXN0YXJ0ICsgdmlld3BvcnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IHN0YXJ0LCBlbmRcbiAgICAvLyAtIGNoZWNrIGF1dG8gd2lkdGhcbiAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICBzbGlkZVBvc2l0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50LCBpKSB7XG4gICAgICAgIGlmIChpIDwgc2xpZGVDb3VudE5ldykge1xuICAgICAgICAgIGlmICgoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSAmJiBwb2ludCA8PSByYW5nZXN0YXJ0ICsgMC41KSB7IHN0YXJ0ID0gaTsgfVxuICAgICAgICAgIGlmIChyYW5nZWVuZCAtIHBvaW50ID49IDAuNSkgeyBlbmQgPSBpOyB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgLy8gLSBjaGVjayBwZXJjZW50YWdlIHdpZHRoLCBmaXhlZCB3aWR0aFxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgIHZhciBjZWxsID0gZml4ZWRXaWR0aCArIGd1dHRlcjtcbiAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihyYW5nZXN0YXJ0L2NlbGwpO1xuICAgICAgICAgIGVuZCA9IE1hdGguY2VpbChyYW5nZWVuZC9jZWxsIC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBNYXRoLmNlaWwodmlld3BvcnQvY2VsbCkgLSAxO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICB2YXIgYSA9IGl0ZW1zIC0gMTtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBzdGFydCAtPSBhIC8gMjtcbiAgICAgICAgICAgIGVuZCA9IGluZGV4ICsgYSAvIDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZCA9IGluZGV4ICsgYTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICAgIHZhciBiID0gZWRnZVBhZGRpbmcgKiBpdGVtcyAvIHZpZXdwb3J0O1xuICAgICAgICAgICAgc3RhcnQgLT0gYjtcbiAgICAgICAgICAgIGVuZCArPSBiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihzdGFydCk7XG4gICAgICAgICAgZW5kID0gTWF0aC5jZWlsKGVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBpdGVtcyAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3RhcnQgPSBNYXRoLm1heChzdGFydCwgMCk7XG4gICAgICBlbmQgPSBNYXRoLm1pbihlbmQsIHNsaWRlQ291bnROZXcgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9MYXp5TG9hZCAoKSB7XG4gICAgaWYgKGxhenlsb2FkICYmICFkaXNhYmxlKSB7XG4gICAgICBnZXRJbWFnZUFycmF5LmFwcGx5KG51bGwsIGdldFZpc2libGVTbGlkZVJhbmdlKCkpLmZvckVhY2goZnVuY3Rpb24gKGltZykge1xuICAgICAgICBpZiAoIWhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHtcbiAgICAgICAgICAvLyBzdG9wIHByb3BhZ2F0aW9uIHRyYW5zaXRpb25lbmQgZXZlbnQgdG8gY29udGFpbmVyXG4gICAgICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH07XG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgZXZlKTtcblxuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgc3JjXG4gICAgICAgICAgaW1nLnNyYyA9IGdldEF0dHIoaW1nLCAnZGF0YS1zcmMnKTtcblxuICAgICAgICAgIC8vIHVwZGF0ZSBzcmNzZXRcbiAgICAgICAgICB2YXIgc3Jjc2V0ID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyY3NldCcpO1xuICAgICAgICAgIGlmIChzcmNzZXQpIHsgaW1nLnNyY3NldCA9IHNyY3NldDsgfVxuXG4gICAgICAgICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkltZ0xvYWRlZCAoZSkge1xuICAgIGltZ0xvYWRlZChnZXRUYXJnZXQoZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25JbWdGYWlsZWQgKGUpIHtcbiAgICBpbWdGYWlsZWQoZ2V0VGFyZ2V0KGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0xvYWRlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGVkJyk7XG4gICAgaW1nQ29tcGxldGVkKGltZyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdGYWlsZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ2ZhaWxlZCcpO1xuICAgIGltZ0NvbXBsZXRlZChpbWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nQ29tcGxldGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICd0bnMtY29tcGxldGUnKTtcbiAgICByZW1vdmVDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgcmVtb3ZlRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEltYWdlQXJyYXkgKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaW1ncyA9IFtdO1xuICAgIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICAgIGZvckVhY2goc2xpZGVJdGVtc1tzdGFydF0ucXVlcnlTZWxlY3RvckFsbCgnaW1nJyksIGZ1bmN0aW9uIChpbWcpIHsgaW1ncy5wdXNoKGltZyk7IH0pO1xuICAgICAgc3RhcnQrKztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1ncztcbiAgfVxuXG4gIC8vIGNoZWNrIGlmIGFsbCB2aXNpYmxlIGltYWdlcyBhcmUgbG9hZGVkXG4gIC8vIGFuZCB1cGRhdGUgY29udGFpbmVyIGhlaWdodCBpZiBpdCdzIGRvbmVcbiAgZnVuY3Rpb24gZG9BdXRvSGVpZ2h0ICgpIHtcbiAgICB2YXIgaW1ncyA9IGdldEltYWdlQXJyYXkuYXBwbHkobnVsbCwgZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSk7XG4gICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQpOyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ3NMb2FkZWRDaGVjayAoaW1ncywgY2IpIHtcbiAgICAvLyBkaXJlY3RseSBleGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uIGlmIGFsbCBpbWFnZXMgYXJlIGNvbXBsZXRlXG4gICAgaWYgKGltZ3NDb21wbGV0ZSkgeyByZXR1cm4gY2IoKTsgfVxuXG4gICAgLy8gY2hlY2sgc2VsZWN0ZWQgaW1hZ2UgY2xhc3NlcyBvdGhlcndpc2VcbiAgICBpbWdzLmZvckVhY2goZnVuY3Rpb24gKGltZywgaW5kZXgpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhpbWcsIGltZ0NvbXBsZXRlQ2xhc3MpKSB7IGltZ3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBzZWxlY3RlZCBpbWFnZXMgYXJlIGFsbCBjb21wbGV0ZVxuICAgIGlmICghaW1ncy5sZW5ndGgpIHsgcmV0dXJuIGNiKCk7IH1cblxuICAgIC8vIG90aGVyd2lzZSBleGVjdXRlIHRoaXMgZnVuY3Rpb25hIGFnYWluXG4gICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCBjYik7IH0pO1xuICB9IFxuXG4gIGZ1bmN0aW9uIGFkZGl0aW9uYWxVcGRhdGVzICgpIHtcbiAgICBkb0xhenlMb2FkKCk7IFxuICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG4gICAgdXBkYXRlTGl2ZVJlZ2lvbigpO1xuICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XG4gICAgdXBkYXRlTmF2U3RhdHVzKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uICgpIHtcbiAgICBpZiAoY2Fyb3VzZWwgJiYgYXV0b0hlaWdodCkge1xuICAgICAgbWlkZGxlV3JhcHBlci5zdHlsZVtUUkFOU0lUSU9ORFVSQVRJT05dID0gc3BlZWQgLyAxMDAwICsgJ3MnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1heFNsaWRlSGVpZ2h0IChzbGlkZVN0YXJ0LCBzbGlkZVJhbmdlKSB7XG4gICAgdmFyIGhlaWdodHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gc2xpZGVTdGFydCwgbCA9IE1hdGgubWluKHNsaWRlU3RhcnQgKyBzbGlkZVJhbmdlLCBzbGlkZUNvdW50TmV3KTsgaSA8IGw7IGkrKykge1xuICAgICAgaGVpZ2h0cy5wdXNoKHNsaWRlSXRlbXNbaV0ub2Zmc2V0SGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgaGVpZ2h0cyk7XG4gIH1cblxuICAvLyB1cGRhdGUgaW5uZXIgd3JhcHBlciBoZWlnaHRcbiAgLy8gMS4gZ2V0IHRoZSBtYXgtaGVpZ2h0IG9mIHRoZSB2aXNpYmxlIHNsaWRlc1xuICAvLyAyLiBzZXQgdHJhbnNpdGlvbkR1cmF0aW9uIHRvIHNwZWVkXG4gIC8vIDMuIHVwZGF0ZSBpbm5lciB3cmFwcGVyIGhlaWdodCB0byBtYXgtaGVpZ2h0XG4gIC8vIDQuIHNldCB0cmFuc2l0aW9uRHVyYXRpb24gdG8gMHMgYWZ0ZXIgdHJhbnNpdGlvbiBkb25lXG4gIGZ1bmN0aW9uIHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCAoKSB7XG4gICAgdmFyIG1heEhlaWdodCA9IGF1dG9IZWlnaHQgPyBnZXRNYXhTbGlkZUhlaWdodChpbmRleCwgaXRlbXMpIDogZ2V0TWF4U2xpZGVIZWlnaHQoY2xvbmVDb3VudCwgc2xpZGVDb3VudCksXG4gICAgICAgIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG5cbiAgICBpZiAod3Auc3R5bGUuaGVpZ2h0ICE9PSBtYXhIZWlnaHQpIHsgd3Auc3R5bGUuaGVpZ2h0ID0gbWF4SGVpZ2h0ICsgJ3B4JzsgfVxuICB9XG5cbiAgLy8gZ2V0IHRoZSBkaXN0YW5jZSBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgZmlyc3Qgc2xpZGUgdG8gZWFjaCBzbGlkZVxuICAvLyAoaW5pdCkgPT4gc2xpZGVQb3NpdGlvbnNcbiAgZnVuY3Rpb24gc2V0U2xpZGVQb3NpdGlvbnMgKCkge1xuICAgIHNsaWRlUG9zaXRpb25zID0gWzBdO1xuICAgIHZhciBhdHRyID0gaG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnLFxuICAgICAgICBhdHRyMiA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbScsXG4gICAgICAgIGJhc2UgPSBzbGlkZUl0ZW1zWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHJdO1xuXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAvLyBza2lwIHRoZSBmaXJzdCBzbGlkZVxuICAgICAgaWYgKGkpIHsgc2xpZGVQb3NpdGlvbnMucHVzaChpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHJdIC0gYmFzZSk7IH1cbiAgICAgIC8vIGFkZCB0aGUgZW5kIGVkZ2VcbiAgICAgIGlmIChpID09PSBzbGlkZUNvdW50TmV3IC0gMSkgeyBzbGlkZVBvc2l0aW9ucy5wdXNoKGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cjJdIC0gYmFzZSk7IH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBzbGlkZVxuICBmdW5jdGlvbiB1cGRhdGVTbGlkZVN0YXR1cyAoKSB7XG4gICAgdmFyIHJhbmdlID0gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSxcbiAgICAgICAgc3RhcnQgPSByYW5nZVswXSxcbiAgICAgICAgZW5kID0gcmFuZ2VbMV07XG5cbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIC8vIHNob3cgc2xpZGVzXG4gICAgICBpZiAoaSA+PSBzdGFydCAmJiBpIDw9IGVuZCkge1xuICAgICAgICBpZiAoaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICAgIHJlbW92ZUF0dHJzKGl0ZW0sIFsnYXJpYS1oaWRkZW4nLCAndGFiaW5kZXgnXSk7XG4gICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIC8vIGhpZGUgc2xpZGVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc0F0dHIoaXRlbSwgJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGdhbGxlcnk6IHVwZGF0ZSBzbGlkZSBwb3NpdGlvblxuICBmdW5jdGlvbiB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMgKCkge1xuICAgIHZhciBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7XG4gICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcbiAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcblxuICAgICAgaWYgKGkgPj0gaW5kZXggJiYgaSA8IGwpIHtcbiAgICAgICAgLy8gYWRkIHRyYW5zaXRpb25zIHRvIHZpc2libGUgc2xpZGVzIHdoZW4gYWRqdXN0aW5nIHRoZWlyIHBvc2l0aW9uc1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCAndG5zLW1vdmluZycpO1xuXG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLnN0eWxlLmxlZnQpIHtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgb3V0bGV0IGFuaW1hdGlvblxuICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZpbmcgJy50bnMtbW92aW5nJ1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCAndG5zLW1vdmluZycpO1xuICAgICAgfSk7XG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIC8vIHNldCB0YWJpbmRleCBvbiBOYXZcbiAgZnVuY3Rpb24gdXBkYXRlTmF2U3RhdHVzICgpIHtcbiAgICAvLyBnZXQgY3VycmVudCBuYXZcbiAgICBpZiAobmF2KSB7XG4gICAgICBuYXZDdXJyZW50SW5kZXggPSBuYXZDbGlja2VkID49IDAgPyBuYXZDbGlja2VkIDogZ2V0Q3VycmVudE5hdkluZGV4KCk7XG4gICAgICBuYXZDbGlja2VkID0gLTE7XG5cbiAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggIT09IG5hdkN1cnJlbnRJbmRleENhY2hlZCkge1xuICAgICAgICB2YXIgbmF2UHJldiA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleENhY2hlZF0sXG4gICAgICAgICAgICBuYXZDdXJyZW50ID0gbmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XTtcblxuICAgICAgICBzZXRBdHRycyhuYXZQcmV2LCB7XG4gICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXhDYWNoZWQgKyAxKVxuICAgICAgICB9KTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2UHJldiwgbmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICBcbiAgICAgICAgc2V0QXR0cnMobmF2Q3VycmVudCwgeydhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleCArIDEpICsgbmF2U3RyQ3VycmVudH0pO1xuICAgICAgICByZW1vdmVBdHRycyhuYXZDdXJyZW50LCAndGFiaW5kZXgnKTtcbiAgICAgICAgYWRkQ2xhc3MobmF2Q3VycmVudCwgbmF2QWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkN1cnJlbnRJbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMb3dlckNhc2VOb2RlTmFtZSAoZWwpIHtcbiAgICByZXR1cm4gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQnV0dG9uIChlbCkge1xuICAgIHJldHVybiBnZXRMb3dlckNhc2VOb2RlTmFtZShlbCkgPT09ICdidXR0b24nO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcmlhRGlzYWJsZWQgKGVsKSB7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNFbmFibGVFbGVtZW50IChpc0J1dHRvbiwgZWwsIHZhbCkge1xuICAgIGlmIChpc0J1dHRvbikge1xuICAgICAgZWwuZGlzYWJsZWQgPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIHZhbC50b1N0cmluZygpKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgJ2Rpc2FibGVkJyB0byB0cnVlIG9uIGNvbnRyb2xzIHdoZW4gcmVhY2ggdGhlIGVkZ2VzXG4gIGZ1bmN0aW9uIHVwZGF0ZUNvbnRyb2xzU3RhdHVzICgpIHtcbiAgICBpZiAoIWNvbnRyb2xzIHx8IHJld2luZCB8fCBsb29wKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIHByZXZEaXNhYmxlZCA9IChwcmV2SXNCdXR0b24pID8gcHJldkJ1dHRvbi5kaXNhYmxlZCA6IGlzQXJpYURpc2FibGVkKHByZXZCdXR0b24pLFxuICAgICAgICBuZXh0RGlzYWJsZWQgPSAobmV4dElzQnV0dG9uKSA/IG5leHRCdXR0b24uZGlzYWJsZWQgOiBpc0FyaWFEaXNhYmxlZChuZXh0QnV0dG9uKSxcbiAgICAgICAgZGlzYWJsZVByZXYgPSAoaW5kZXggPD0gaW5kZXhNaW4pID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBkaXNhYmxlTmV4dCA9ICghcmV3aW5kICYmIGluZGV4ID49IGluZGV4TWF4KSA/IHRydWUgOiBmYWxzZTtcblxuICAgIGlmIChkaXNhYmxlUHJldiAmJiAhcHJldkRpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICghZGlzYWJsZVByZXYgJiYgcHJldkRpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoZGlzYWJsZU5leHQgJiYgIW5leHREaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIWRpc2FibGVOZXh0ICYmIG5leHREaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgZHVyYXRpb25cbiAgZnVuY3Rpb24gcmVzZXREdXJhdGlvbiAoZWwsIHN0cikge1xuICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgZWwuc3R5bGVbVFJBTlNJVElPTkRVUkFUSU9OXSA9IHN0cjsgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVyV2lkdGggKCkge1xuICAgIHJldHVybiBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudE5ldyA6IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXddO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2VudGVyR2FwIChudW0pIHtcbiAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cblxuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGd1dHRlciA6IDA7XG4gICAgcmV0dXJuIGF1dG9XaWR0aCA/ICgodmlld3BvcnQgLSBnYXApIC0gKHNsaWRlUG9zaXRpb25zW251bSArIDFdIC0gc2xpZGVQb3NpdGlvbnNbbnVtXSAtIGd1dHRlcikpLzIgOlxuICAgICAgZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6XG4gICAgICAgIChpdGVtcyAtIDEpIC8gMjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJpZ2h0Qm91bmRhcnkgKCkge1xuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGd1dHRlciA6IDAsXG4gICAgICAgIHJlc3VsdCA9ICh2aWV3cG9ydCArIGdhcCkgLSBnZXRTbGlkZXJXaWR0aCgpO1xuXG4gICAgaWYgKGNlbnRlciAmJiAhbG9vcCkge1xuICAgICAgcmVzdWx0ID0gZml4ZWRXaWR0aCA/IC0gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogKHNsaWRlQ291bnROZXcgLSAxKSAtIGdldENlbnRlckdhcCgpIDpcbiAgICAgICAgZ2V0Q2VudGVyR2FwKHNsaWRlQ291bnROZXcgLSAxKSAtIHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXcgLSAxXTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA+IDApIHsgcmVzdWx0ID0gMDsgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlIChudW0pIHtcbiAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cblxuICAgIHZhciB2YWw7XG4gICAgaWYgKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgdmFsID0gLSAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBudW07XG4gICAgICAgIGlmIChjZW50ZXIpIHsgdmFsICs9IGdldENlbnRlckdhcCgpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVub21pbmF0b3IgPSBUUkFOU0ZPUk0gPyBzbGlkZUNvdW50TmV3IDogaXRlbXM7XG4gICAgICAgIGlmIChjZW50ZXIpIHsgbnVtIC09IGdldENlbnRlckdhcCgpOyB9XG4gICAgICAgIHZhbCA9IC0gbnVtICogMTAwIC8gZGVub21pbmF0b3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbCA9IC0gc2xpZGVQb3NpdGlvbnNbbnVtXTtcbiAgICAgIGlmIChjZW50ZXIgJiYgYXV0b1dpZHRoKSB7XG4gICAgICAgIHZhbCArPSBnZXRDZW50ZXJHYXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyB2YWwgPSBNYXRoLm1heCh2YWwsIHJpZ2h0Qm91bmRhcnkpOyB9XG5cbiAgICB2YWwgKz0gKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAhZml4ZWRXaWR0aCkgPyAnJScgOiAncHgnO1xuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50ICh2YWwpIHtcbiAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJzBzJyk7XG4gICAgZG9Db250YWluZXJUcmFuc2Zvcm0odmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtICh2YWwpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHsgdmFsID0gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKTsgfVxuICAgIGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXSA9IHRyYW5zZm9ybVByZWZpeCArIHZhbCArIHRyYW5zZm9ybVBvc3RmaXg7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlU2xpZGUgKG51bWJlciwgY2xhc3NPdXQsIGNsYXNzSW4sIGlzT3V0KSB7XG4gICAgdmFyIGwgPSBudW1iZXIgKyBpdGVtcztcbiAgICBpZiAoIWxvb3ApIHsgbCA9IE1hdGgubWluKGwsIHNsaWRlQ291bnROZXcpOyB9XG5cbiAgICBmb3IgKHZhciBpID0gbnVtYmVyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcblxuICAgICAgLy8gc2V0IGl0ZW0gcG9zaXRpb25zXG4gICAgICBpZiAoIWlzT3V0KSB7IGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7IH1cblxuICAgICAgaWYgKGFuaW1hdGVEZWxheSAmJiBUUkFOU0lUSU9OREVMQVkpIHtcbiAgICAgICAgaXRlbS5zdHlsZVtUUkFOU0lUSU9OREVMQVldID0gaXRlbS5zdHlsZVtBTklNQVRJT05ERUxBWV0gPSBhbmltYXRlRGVsYXkgKiAoaSAtIG51bWJlcikgLyAxMDAwICsgJ3MnO1xuICAgICAgfVxuICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgY2xhc3NPdXQpO1xuICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NJbik7XG4gICAgICBcbiAgICAgIGlmIChpc091dCkgeyBzbGlkZUl0ZW1zT3V0LnB1c2goaXRlbSk7IH1cbiAgICB9XG4gIH1cblxuICAvLyBtYWtlIHRyYW5zZmVyIGFmdGVyIGNsaWNrL2RyYWc6XG4gIC8vIDEuIGNoYW5nZSAndHJhbnNmb3JtJyBwcm9wZXJ0eSBmb3IgbW9yZGVybiBicm93c2Vyc1xuICAvLyAyLiBjaGFuZ2UgJ2xlZnQnIHByb3BlcnR5IGZvciBsZWdhY3kgYnJvd3NlcnNcbiAgdmFyIHRyYW5zZm9ybUNvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYXJvdXNlbCA/XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnJyk7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gfHwgIXNwZWVkKSB7XG4gICAgICAgICAgLy8gZm9yIG1vcmRlbiBicm93c2VycyB3aXRoIG5vbi16ZXJvIGR1cmF0aW9uIG9yIFxuICAgICAgICAgIC8vIHplcm8gZHVyYXRpb24gZm9yIGFsbCBicm93c2Vyc1xuICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKCk7XG4gICAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5IFxuICAgICAgICAgIC8vIHdoZW4gZHVyYXRpb24gaXMgMCAvIGNvbnRhaW5lciBpcyBoaWRkZW5cbiAgICAgICAgICBpZiAoIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZm9yIG9sZCBicm93c2VyIHdpdGggbm9uLXplcm8gZHVyYXRpb25cbiAgICAgICAgICBqc1RyYW5zZm9ybShjb250YWluZXIsIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKSwgc3BlZWQsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhvcml6b250YWwpIHsgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTsgfVxuICAgICAgfSA6XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNsaWRlSXRlbXNPdXQgPSBbXTtcblxuICAgICAgICB2YXIgZXZlID0ge307XG4gICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGV2ZVtBTklNQVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgICByZW1vdmVFdmVudHMoc2xpZGVJdGVtc1tpbmRleENhY2hlZF0sIGV2ZSk7XG4gICAgICAgIGFkZEV2ZW50cyhzbGlkZUl0ZW1zW2luZGV4XSwgZXZlKTtcblxuICAgICAgICBhbmltYXRlU2xpZGUoaW5kZXhDYWNoZWQsIGFuaW1hdGVJbiwgYW5pbWF0ZU91dCwgdHJ1ZSk7XG4gICAgICAgIGFuaW1hdGVTbGlkZShpbmRleCwgYW5pbWF0ZU5vcm1hbCwgYW5pbWF0ZUluKTtcblxuICAgICAgICAvLyBydW4gZmFsbGJhY2sgZnVuY3Rpb24gbWFudWFsbHkgXG4gICAgICAgIC8vIHdoZW4gdHJhbnNpdGlvbiBvciBhbmltYXRpb24gbm90IHN1cHBvcnRlZCAvIGR1cmF0aW9uIGlzIDBcbiAgICAgICAgaWYgKCFUUkFOU0lUSU9ORU5EIHx8ICFBTklNQVRJT05FTkQgfHwgIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiByZW5kZXIgKGUsIHNsaWRlck1vdmVkKSB7XG4gICAgaWYgKHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtKSB7IHVwZGF0ZUluZGV4KCk7IH1cblxuICAgIC8vIHJlbmRlciB3aGVuIHNsaWRlciB3YXMgbW92ZWQgKHRvdWNoIG9yIGRyYWcpIGV2ZW4gdGhvdWdoIGluZGV4IG1heSBub3QgY2hhbmdlXG4gICAgaWYgKGluZGV4ICE9PSBpbmRleENhY2hlZCB8fCBzbGlkZXJNb3ZlZCkge1xuICAgICAgLy8gZXZlbnRzXG4gICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcbiAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnLCBpbmZvKCkpO1xuICAgICAgaWYgKGF1dG9IZWlnaHQpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cblxuICAgICAgLy8gcGF1c2UgYXV0b3BsYXkgd2hlbiBjbGljayBvciBrZXlkb3duIGZyb20gdXNlclxuICAgICAgaWYgKGFuaW1hdGluZyAmJiBlICYmIFsnY2xpY2snLCAna2V5ZG93biddLmluZGV4T2YoZS50eXBlKSA+PSAwKSB7IHN0b3BBdXRvcGxheSgpOyB9XG5cbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgdHJhbnNmb3JtQ29yZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFRyYW5zZmVyIHByZWZpeGVkIHByb3BlcnRpZXMgdG8gdGhlIHNhbWUgZm9ybWF0XG4gICAqIENTUzogLVdlYmtpdC1UcmFuc2Zvcm0gPT4gd2Via2l0dHJhbnNmb3JtXG4gICAqIEpTOiBXZWJraXRUcmFuc2Zvcm0gPT4gd2Via2l0dHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBwcm9wZXJ0eVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gc3RyVHJhbnMgKHN0cikge1xuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tL2csICcnKTtcbiAgfVxuXG4gIC8vIEFGVEVSIFRSQU5TRk9STVxuICAvLyBUaGluZ3MgbmVlZCB0byBiZSBkb25lIGFmdGVyIGEgdHJhbnNmZXI6XG4gIC8vIDEuIGNoZWNrIGluZGV4XG4gIC8vIDIuIGFkZCBjbGFzc2VzIHRvIHZpc2libGUgc2xpZGVcbiAgLy8gMy4gZGlzYWJsZSBjb250cm9scyBidXR0b25zIHdoZW4gcmVhY2ggdGhlIGZpcnN0L2xhc3Qgc2xpZGUgaW4gbm9uLWxvb3Agc2xpZGVyXG4gIC8vIDQuIHVwZGF0ZSBuYXYgc3RhdHVzXG4gIC8vIDUuIGxhenlsb2FkIGltYWdlc1xuICAvLyA2LiB1cGRhdGUgY29udGFpbmVyIGhlaWdodFxuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQgKGV2ZW50KSB7XG4gICAgLy8gY2hlY2sgcnVubmluZyBvbiBnYWxsZXJ5IG1vZGVcbiAgICAvLyBtYWtlIHN1cmUgdHJhbnRpb25lbmQvYW5pbWF0aW9uZW5kIGV2ZW50cyBydW4gb25seSBvbmNlXG4gICAgaWYgKGNhcm91c2VsIHx8IHJ1bm5pbmcpIHtcbiAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uRW5kJywgaW5mbyhldmVudCkpO1xuXG4gICAgICBpZiAoIWNhcm91c2VsICYmIHNsaWRlSXRlbXNPdXQubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlSXRlbXNPdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNPdXRbaV07XG4gICAgICAgICAgLy8gc2V0IGl0ZW0gcG9zaXRpb25zXG4gICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gJyc7XG5cbiAgICAgICAgICBpZiAoQU5JTUFUSU9OREVMQVkgJiYgVFJBTlNJVElPTkRFTEFZKSB7IFxuICAgICAgICAgICAgaXRlbS5zdHlsZVtBTklNQVRJT05ERUxBWV0gPSAnJztcbiAgICAgICAgICAgIGl0ZW0uc3R5bGVbVFJBTlNJVElPTkRFTEFZXSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlT3V0KTtcbiAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiB1cGRhdGUgc2xpZGVzLCBuYXYsIGNvbnRyb2xzIGFmdGVyIGNoZWNraW5nIC4uLlxuICAgICAgICogPT4gbGVnYWN5IGJyb3dzZXJzIHdobyBkb24ndCBzdXBwb3J0ICdldmVudCcgXG4gICAgICAgKiAgICBoYXZlIHRvIGNoZWNrIGV2ZW50IGZpcnN0LCBvdGhlcndpc2UgZXZlbnQudGFyZ2V0IHdpbGwgY2F1c2UgYW4gZXJyb3IgXG4gICAgICAgKiA9PiBvciAnZ2FsbGVyeScgbW9kZTogXG4gICAgICAgKiAgICsgZXZlbnQgdGFyZ2V0IGlzIHNsaWRlIGl0ZW1cbiAgICAgICAqID0+IG9yICdjYXJvdXNlbCcgbW9kZTogXG4gICAgICAgKiAgICsgZXZlbnQgdGFyZ2V0IGlzIGNvbnRhaW5lciwgXG4gICAgICAgKiAgICsgZXZlbnQucHJvcGVydHkgaXMgdGhlIHNhbWUgd2l0aCB0cmFuc2Zvcm0gYXR0cmlidXRlXG4gICAgICAgKi9cbiAgICAgIGlmICghZXZlbnQgfHwgXG4gICAgICAgICAgIWNhcm91c2VsICYmIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlID09PSBjb250YWluZXIgfHwgXG4gICAgICAgICAgZXZlbnQudGFyZ2V0ID09PSBjb250YWluZXIgJiYgc3RyVHJhbnMoZXZlbnQucHJvcGVydHlOYW1lKSA9PT0gc3RyVHJhbnModHJhbnNmb3JtQXR0cikpIHtcblxuICAgICAgICBpZiAoIXVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtKSB7IFxuICAgICAgICAgIHZhciBpbmRleFRlbSA9IGluZGV4O1xuICAgICAgICAgIHVwZGF0ZUluZGV4KCk7XG4gICAgICAgICAgaWYgKGluZGV4ICE9PSBpbmRleFRlbSkgeyBcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuXG4gICAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcblxuICAgICAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7IGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7IH1cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICBpbmRleENhY2hlZCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLy8gIyBBQ1RJT05TXG4gIGZ1bmN0aW9uIGdvVG8gKHRhcmdldEluZGV4LCBlKSB7XG4gICAgaWYgKGZyZWV6ZSkgeyByZXR1cm47IH1cblxuICAgIC8vIHByZXYgc2xpZGVCeVxuICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ3ByZXYnKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpO1xuXG4gICAgLy8gbmV4dCBzbGlkZUJ5XG4gICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ25leHQnKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XG5cbiAgICAvLyBnbyB0byBleGFjdCBzbGlkZVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICAgIH1cblxuICAgICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSwgXG4gICAgICAgICAgaW5kZXhHYXAgPSAwO1xuXG4gICAgICBpZiAodGFyZ2V0SW5kZXggPT09ICdmaXJzdCcpIHtcbiAgICAgICAgaW5kZXhHYXAgPSAtIGFic0luZGV4O1xuICAgICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ2xhc3QnKSB7XG4gICAgICAgIGluZGV4R2FwID0gY2Fyb3VzZWwgPyBzbGlkZUNvdW50IC0gaXRlbXMgLSBhYnNJbmRleCA6IHNsaWRlQ291bnQgLSAxIC0gYWJzSW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldEluZGV4ICE9PSAnbnVtYmVyJykgeyB0YXJnZXRJbmRleCA9IHBhcnNlSW50KHRhcmdldEluZGV4KTsgfVxuXG4gICAgICAgIGlmICghaXNOYU4odGFyZ2V0SW5kZXgpKSB7XG4gICAgICAgICAgLy8gZnJvbSBkaXJlY3RseSBjYWxsZWQgZ29UbyBmdW5jdGlvblxuICAgICAgICAgIGlmICghZSkgeyB0YXJnZXRJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNsaWRlQ291bnQgLSAxLCB0YXJnZXRJbmRleCkpOyB9XG5cbiAgICAgICAgICBpbmRleEdhcCA9IHRhcmdldEluZGV4IC0gYWJzSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZ2FsbGVyeTogbWFrZSBzdXJlIG5ldyBwYWdlIHdvbid0IG92ZXJsYXAgd2l0aCBjdXJyZW50IHBhZ2VcbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgaW5kZXhHYXAgJiYgTWF0aC5hYnMoaW5kZXhHYXApIDwgaXRlbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvciA9IGluZGV4R2FwID4gMCA/IDEgOiAtMTtcbiAgICAgICAgaW5kZXhHYXAgKz0gKGluZGV4ICsgaW5kZXhHYXAgLSBzbGlkZUNvdW50KSA+PSBpbmRleE1pbiA/IHNsaWRlQ291bnQgKiBmYWN0b3IgOiBzbGlkZUNvdW50ICogMiAqIGZhY3RvciAqIC0xO1xuICAgICAgfVxuXG4gICAgICBpbmRleCArPSBpbmRleEdhcDtcblxuICAgICAgLy8gbWFrZSBzdXJlIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICBpZiAoY2Fyb3VzZWwgJiYgbG9vcCkge1xuICAgICAgICBpZiAoaW5kZXggPCBpbmRleE1pbikgeyBpbmRleCArPSBzbGlkZUNvdW50OyB9XG4gICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgaW5kZXggaXMgY2hhbmdlZCwgc3RhcnQgcmVuZGVyaW5nXG4gICAgICBpZiAoZ2V0QWJzSW5kZXgoaW5kZXgpICE9PSBnZXRBYnNJbmRleChpbmRleENhY2hlZCkpIHtcbiAgICAgICAgcmVuZGVyKGUpO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgLy8gb24gY29udHJvbHMgY2xpY2tcbiAgZnVuY3Rpb24gb25Db250cm9sc0NsaWNrIChlLCBkaXIpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuICAgIHZhciBwYXNzRXZlbnRPYmplY3Q7XG5cbiAgICBpZiAoIWRpcikge1xuICAgICAgZSA9IGdldEV2ZW50KGUpO1xuICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKTtcblxuICAgICAgd2hpbGUgKHRhcmdldCAhPT0gY29udHJvbHNDb250YWluZXIgJiYgW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KSA8IDApIHsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7IH1cblxuICAgICAgdmFyIHRhcmdldEluID0gW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgIGlmICh0YXJnZXRJbiA+PSAwKSB7XG4gICAgICAgIHBhc3NFdmVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGRpciA9IHRhcmdldEluID09PSAwID8gLTEgOiAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXdpbmQpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gaW5kZXhNaW4gJiYgZGlyID09PSAtMSkge1xuICAgICAgICBnb1RvKCdsYXN0JywgZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IGluZGV4TWF4ICYmIGRpciA9PT0gMSkge1xuICAgICAgICBnb1RvKCdmaXJzdCcsIGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpcikge1xuICAgICAgaW5kZXggKz0gc2xpZGVCeSAqIGRpcjtcbiAgICAgIGlmIChhdXRvV2lkdGgpIHsgaW5kZXggPSBNYXRoLmZsb29yKGluZGV4KTsgfVxuICAgICAgLy8gcGFzcyBlIHdoZW4gY2xpY2sgY29udHJvbCBidXR0b25zIG9yIGtleWRvd25cbiAgICAgIHJlbmRlcigocGFzc0V2ZW50T2JqZWN0IHx8IChlICYmIGUudHlwZSA9PT0gJ2tleWRvd24nKSkgPyBlIDogbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gb24gbmF2IGNsaWNrXG4gIGZ1bmN0aW9uIG9uTmF2Q2xpY2sgKGUpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuICAgIFxuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpLCBuYXZJbmRleDtcblxuICAgIC8vIGZpbmQgdGhlIGNsaWNrZWQgbmF2IGl0ZW1cbiAgICB3aGlsZSAodGFyZ2V0ICE9PSBuYXZDb250YWluZXIgJiYgIWhhc0F0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSkgeyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTsgfVxuICAgIGlmIChoYXNBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpIHtcbiAgICAgIHZhciBuYXZJbmRleCA9IG5hdkNsaWNrZWQgPSBOdW1iZXIoZ2V0QXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSxcbiAgICAgICAgICB0YXJnZXRJbmRleEJhc2UgPSBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IG5hdkluZGV4ICogc2xpZGVDb3VudCAvIHBhZ2VzIDogbmF2SW5kZXggKiBpdGVtcyxcbiAgICAgICAgICB0YXJnZXRJbmRleCA9IG5hdkFzVGh1bWJuYWlscyA/IG5hdkluZGV4IDogTWF0aC5taW4oTWF0aC5jZWlsKHRhcmdldEluZGV4QmFzZSksIHNsaWRlQ291bnQgLSAxKTtcbiAgICAgIGdvVG8odGFyZ2V0SW5kZXgsIGUpO1xuXG4gICAgICBpZiAobmF2Q3VycmVudEluZGV4ID09PSBuYXZJbmRleCkge1xuICAgICAgICBpZiAoYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheSgpOyB9XG4gICAgICAgIG5hdkNsaWNrZWQgPSAtMTsgLy8gcmVzZXQgbmF2Q2xpY2tlZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGF1dG9wbGF5IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBzZXRBdXRvcGxheVRpbWVyICgpIHtcbiAgICBhdXRvcGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgb25Db250cm9sc0NsaWNrKG51bGwsIGF1dG9wbGF5RGlyZWN0aW9uKTtcbiAgICB9LCBhdXRvcGxheVRpbWVvdXQpO1xuXG4gICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BBdXRvcGxheVRpbWVyICgpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9wbGF5VGltZXIpO1xuICAgIGFuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQXV0b3BsYXlCdXR0b24gKGFjdGlvbiwgdHh0KSB7XG4gICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiBhY3Rpb259KTtcbiAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBhdXRvcGxheUh0bWxTdHJpbmdzWzBdICsgYWN0aW9uICsgYXV0b3BsYXlIdG1sU3RyaW5nc1sxXSArIHR4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QXV0b3BsYXkgKCkge1xuICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgdXBkYXRlQXV0b3BsYXlCdXR0b24oJ3N0b3AnLCBhdXRvcGxheVRleHRbMV0pOyB9XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wQXV0b3BsYXkgKCkge1xuICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHVwZGF0ZUF1dG9wbGF5QnV0dG9uKCdzdGFydCcsIGF1dG9wbGF5VGV4dFswXSk7IH1cbiAgfVxuXG4gIC8vIHByb2dyYW1haXRjYWxseSBwbGF5L3BhdXNlIHRoZSBzbGlkZXJcbiAgZnVuY3Rpb24gcGxheSAoKSB7XG4gICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHtcbiAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwYXVzZSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgc3RvcEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUF1dG9wbGF5ICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICBzdG9wQXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVmlzaWJpbGl0eUNoYW5nZSAoKSB7XG4gICAgaWYgKGRvYy5oaWRkZW4pIHtcbiAgICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCkge1xuICAgICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdmVyUGF1c2UgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHsgXG4gICAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdXRSZXN0YXJ0ICgpIHtcbiAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlZCkgeyBcbiAgICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBrZXlkb3duIGV2ZW50cyBvbiBkb2N1bWVudCBcbiAgZnVuY3Rpb24gb25Eb2N1bWVudEtleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVF0uaW5kZXhPZihlLmtleUNvZGUpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCBrZXlJbmRleCA9PT0gMCA/IC0xIDogMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gb24ga2V5IGNvbnRyb2xcbiAgZnVuY3Rpb24gb25Db250cm9sc0tleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVF0uaW5kZXhPZihlLmtleUNvZGUpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIGlmIChrZXlJbmRleCA9PT0gMCkge1xuICAgICAgICBpZiAoIXByZXZCdXR0b24uZGlzYWJsZWQpIHsgb25Db250cm9sc0NsaWNrKGUsIC0xKTsgfVxuICAgICAgfSBlbHNlIGlmICghbmV4dEJ1dHRvbi5kaXNhYmxlZCkge1xuICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IGZvY3VzXG4gIGZ1bmN0aW9uIHNldEZvY3VzIChlbCkge1xuICAgIGVsLmZvY3VzKCk7XG4gIH1cblxuICAvLyBvbiBrZXkgbmF2XG4gIGZ1bmN0aW9uIG9uTmF2S2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIgY3VyRWxlbWVudCA9IGRvYy5hY3RpdmVFbGVtZW50O1xuICAgIGlmICghaGFzQXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSkgeyByZXR1cm47IH1cblxuICAgIC8vIHZhciBjb2RlID0gZS5rZXlDb2RlLFxuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFQsIEtFWVMuRU5URVIsIEtFWVMuU1BBQ0VdLmluZGV4T2YoZS5rZXlDb2RlKSxcbiAgICAgICAgbmF2SW5kZXggPSBOdW1iZXIoZ2V0QXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgaWYgKGtleUluZGV4ID09PSAwKSB7XG4gICAgICAgIGlmIChuYXZJbmRleCA+IDApIHsgc2V0Rm9jdXMobmF2SXRlbXNbbmF2SW5kZXggLSAxXSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoa2V5SW5kZXggPT09IDEpIHtcbiAgICAgICAgaWYgKG5hdkluZGV4IDwgcGFnZXMgLSAxKSB7IHNldEZvY3VzKG5hdkl0ZW1zW25hdkluZGV4ICsgMV0pOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYXZDbGlja2VkID0gbmF2SW5kZXg7XG4gICAgICAgIGdvVG8obmF2SW5kZXgsIGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV2ZW50IChlKSB7XG4gICAgZSA9IGUgfHwgd2luLmV2ZW50O1xuICAgIHJldHVybiBpc1RvdWNoRXZlbnQoZSkgPyBlLmNoYW5nZWRUb3VjaGVzWzBdIDogZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRUYXJnZXQgKGUpIHtcbiAgICByZXR1cm4gZS50YXJnZXQgfHwgd2luLmV2ZW50LnNyY0VsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQgKGUpIHtcbiAgICByZXR1cm4gZS50eXBlLmluZGV4T2YoJ3RvdWNoJykgPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0QmVoYXZpb3IgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkICgpIHtcbiAgICByZXR1cm4gZ2V0VG91Y2hEaXJlY3Rpb24odG9EZWdyZWUobGFzdFBvc2l0aW9uLnkgLSBpbml0UG9zaXRpb24ueSwgbGFzdFBvc2l0aW9uLnggLSBpbml0UG9zaXRpb24ueCksIHN3aXBlQW5nbGUpID09PSBvcHRpb25zLmF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiBvblBhblN0YXJ0IChlKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cblxuICAgIGlmIChhdXRvcGxheSAmJiBhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5VGltZXIoKTsgfVxuICAgIFxuICAgIHBhblN0YXJ0ID0gdHJ1ZTtcbiAgICBpZiAocmFmSW5kZXgpIHtcbiAgICAgIGNhZihyYWZJbmRleCk7XG4gICAgICByYWZJbmRleCA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hTdGFydCcgOiAnZHJhZ1N0YXJ0JywgaW5mbyhlKSk7XG5cbiAgICBpZiAoIWlzVG91Y2hFdmVudChlKSAmJiBbJ2ltZycsICdhJ10uaW5kZXhPZihnZXRMb3dlckNhc2VOb2RlTmFtZShnZXRUYXJnZXQoZSkpKSA+PSAwKSB7XG4gICAgICBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yKGUpO1xuICAgIH1cblxuICAgIGxhc3RQb3NpdGlvbi54ID0gaW5pdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgbGFzdFBvc2l0aW9uLnkgPSBpbml0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcbiAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgIHRyYW5zbGF0ZUluaXQgPSBwYXJzZUZsb2F0KGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXS5yZXBsYWNlKHRyYW5zZm9ybVByZWZpeCwgJycpKTtcbiAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnMHMnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblBhbk1vdmUgKGUpIHtcbiAgICBpZiAocGFuU3RhcnQpIHtcbiAgICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgICBsYXN0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICAgIGxhc3RQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuXG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKCFyYWZJbmRleCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkID09PSAnPycpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkKCk7IH1cbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldmVudFNjcm9sbCkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYW5VcGRhdGUgKGUpIHtcbiAgICBpZiAoIW1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgcGFuU3RhcnQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2FmKHJhZkluZGV4KTtcbiAgICBpZiAocGFuU3RhcnQpIHsgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKXsgcGFuVXBkYXRlKGUpOyB9KTsgfVxuXG4gICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9PT0gJz8nKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCgpOyB9XG4gICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgaWYgKCFwcmV2ZW50U2Nyb2xsICYmIGlzVG91Y2hFdmVudChlKSkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZS50eXBlKSB7IGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaE1vdmUnIDogJ2RyYWdNb3ZlJywgaW5mbyhlKSk7IH1cbiAgICAgIH0gY2F0Y2goZXJyKSB7fVxuXG4gICAgICB2YXIgeCA9IHRyYW5zbGF0ZUluaXQsXG4gICAgICAgICAgZGlzdCA9IGdldERpc3QobGFzdFBvc2l0aW9uLCBpbml0UG9zaXRpb24pO1xuICAgICAgaWYgKCFob3Jpem9udGFsIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICAgIHggKz0gZGlzdDtcbiAgICAgICAgeCArPSAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2VYID0gVFJBTlNGT1JNID8gZGlzdCAqIGl0ZW1zICogMTAwIC8gKCh2aWV3cG9ydCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3KTogZGlzdCAqIDEwMCAvICh2aWV3cG9ydCArIGd1dHRlcik7XG4gICAgICAgIHggKz0gcGVyY2VudGFnZVg7XG4gICAgICAgIHggKz0gJyUnO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0gPSB0cmFuc2Zvcm1QcmVmaXggKyB4ICsgdHJhbnNmb3JtUG9zdGZpeDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblBhbkVuZCAoZSkge1xuICAgIGlmIChwYW5TdGFydCkge1xuICAgICAgaWYgKHJhZkluZGV4KSB7XG4gICAgICAgIGNhZihyYWZJbmRleCk7XG4gICAgICAgIHJhZkluZGV4ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYXJvdXNlbCkgeyByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJycpOyB9XG4gICAgICBwYW5TdGFydCA9IGZhbHNlO1xuXG4gICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgICAgbGFzdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgICBsYXN0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcbiAgICAgIHZhciBkaXN0ID0gZ2V0RGlzdChsYXN0UG9zaXRpb24sIGluaXRQb3NpdGlvbik7XG5cbiAgICAgIGlmIChNYXRoLmFicyhkaXN0KSkge1xuICAgICAgICAvLyBkcmFnIHZzIGNsaWNrXG4gICAgICAgIGlmICghaXNUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgICAgLy8gcHJldmVudCBcImNsaWNrXCJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xuICAgICAgICAgIGFkZEV2ZW50cyh0YXJnZXQsIHsnY2xpY2snOiBmdW5jdGlvbiBwcmV2ZW50Q2xpY2sgKGUpIHtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0QmVoYXZpb3IoZSk7XG4gICAgICAgICAgICByZW1vdmVFdmVudHModGFyZ2V0LCB7J2NsaWNrJzogcHJldmVudENsaWNrfSk7XG4gICAgICAgICAgfX0pOyBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgIHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgICAgICAgICB2YXIgaW5kZXhNb3ZlZCA9IC0gZGlzdCAqIGl0ZW1zIC8gKHZpZXdwb3J0ICsgZ3V0dGVyKTtcbiAgICAgICAgICAgICAgaW5kZXhNb3ZlZCA9IGRpc3QgPiAwID8gTWF0aC5mbG9vcihpbmRleE1vdmVkKSA6IE1hdGguY2VpbChpbmRleE1vdmVkKTtcbiAgICAgICAgICAgICAgaW5kZXggKz0gaW5kZXhNb3ZlZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBtb3ZlZCA9IC0gKHRyYW5zbGF0ZUluaXQgKyBkaXN0KTtcbiAgICAgICAgICAgICAgaWYgKG1vdmVkIDw9IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4TWluO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vdmVkID49IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXcgLSAxXSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhNYXg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgc2xpZGVDb3VudE5ldyAmJiBtb3ZlZCA+PSBzbGlkZVBvc2l0aW9uc1tpXSkge1xuICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkID4gc2xpZGVQb3NpdGlvbnNbaV0gJiYgZGlzdCA8IDApIHsgaW5kZXggKz0gMTsgfVxuICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZW5kZXIoZSwgZGlzdCk7XG4gICAgICAgICAgICBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hFbmQnIDogJ2RyYWdFbmQnLCBpbmZvKGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgZGlzdCA+IDAgPyAtMSA6IDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc2V0XG4gICAgaWYgKG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdhdXRvJykgeyBwcmV2ZW50U2Nyb2xsID0gZmFsc2U7IH1cbiAgICBpZiAoc3dpcGVBbmdsZSkgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSAnPyc7IH0gXG4gICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHsgc2V0QXV0b3BsYXlUaW1lcigpOyB9XG4gIH1cblxuICAvLyA9PT0gUkVTSVpFIEZVTkNUSU9OUyA9PT0gLy9cbiAgLy8gKHNsaWRlUG9zaXRpb25zLCBpbmRleCwgaXRlbXMpID0+IHZlcnRpY2FsX2NvbmVudFdyYXBwZXIuaGVpZ2h0XG4gIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0ICgpIHtcbiAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcbiAgICB3cC5zdHlsZS5oZWlnaHQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleCArIGl0ZW1zXSAtIHNsaWRlUG9zaXRpb25zW2luZGV4XSArICdweCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWdlcyAoKSB7XG4gICAgdmFyIHJvdWdoID0gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnQgLyB2aWV3cG9ydCA6IHNsaWRlQ291bnQgLyBpdGVtcztcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5jZWlsKHJvdWdoKSwgc2xpZGVDb3VudCk7XG4gIH1cblxuICAvKlxuICAgKiAxLiB1cGRhdGUgdmlzaWJsZSBuYXYgaXRlbXMgbGlzdFxuICAgKiAyLiBhZGQgXCJoaWRkZW5cIiBhdHRyaWJ1dGVzIHRvIHByZXZpb3VzIHZpc2libGUgbmF2IGl0ZW1zXG4gICAqIDMuIHJlbW92ZSBcImhpZGRlblwiIGF0dHJ1YnV0ZXMgdG8gbmV3IHZpc2libGUgbmF2IGl0ZW1zXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGVOYXZWaXNpYmlsaXR5ICgpIHtcbiAgICBpZiAoIW5hdiB8fCBuYXZBc1RodW1ibmFpbHMpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAocGFnZXMgIT09IHBhZ2VzQ2FjaGVkKSB7XG4gICAgICB2YXIgbWluID0gcGFnZXNDYWNoZWQsXG4gICAgICAgICAgbWF4ID0gcGFnZXMsXG4gICAgICAgICAgZm4gPSBzaG93RWxlbWVudDtcblxuICAgICAgaWYgKHBhZ2VzQ2FjaGVkID4gcGFnZXMpIHtcbiAgICAgICAgbWluID0gcGFnZXM7XG4gICAgICAgIG1heCA9IHBhZ2VzQ2FjaGVkO1xuICAgICAgICBmbiA9IGhpZGVFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAobWluIDwgbWF4KSB7XG4gICAgICAgIGZuKG5hdkl0ZW1zW21pbl0pO1xuICAgICAgICBtaW4rKztcbiAgICAgIH1cblxuICAgICAgLy8gY2FjaGUgcGFnZXNcbiAgICAgIHBhZ2VzQ2FjaGVkID0gcGFnZXM7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5mbyAoZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIHNsaWRlSXRlbXM6IHNsaWRlSXRlbXMsXG4gICAgICBuYXZDb250YWluZXI6IG5hdkNvbnRhaW5lcixcbiAgICAgIG5hdkl0ZW1zOiBuYXZJdGVtcyxcbiAgICAgIGNvbnRyb2xzQ29udGFpbmVyOiBjb250cm9sc0NvbnRhaW5lcixcbiAgICAgIGhhc0NvbnRyb2xzOiBoYXNDb250cm9scyxcbiAgICAgIHByZXZCdXR0b246IHByZXZCdXR0b24sXG4gICAgICBuZXh0QnV0dG9uOiBuZXh0QnV0dG9uLFxuICAgICAgaXRlbXM6IGl0ZW1zLFxuICAgICAgc2xpZGVCeTogc2xpZGVCeSxcbiAgICAgIGNsb25lQ291bnQ6IGNsb25lQ291bnQsXG4gICAgICBzbGlkZUNvdW50OiBzbGlkZUNvdW50LFxuICAgICAgc2xpZGVDb3VudE5ldzogc2xpZGVDb3VudE5ldyxcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIGluZGV4Q2FjaGVkOiBpbmRleENhY2hlZCxcbiAgICAgIGRpc3BsYXlJbmRleDogZ2V0Q3VycmVudFNsaWRlKCksXG4gICAgICBuYXZDdXJyZW50SW5kZXg6IG5hdkN1cnJlbnRJbmRleCxcbiAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZDogbmF2Q3VycmVudEluZGV4Q2FjaGVkLFxuICAgICAgcGFnZXM6IHBhZ2VzLFxuICAgICAgcGFnZXNDYWNoZWQ6IHBhZ2VzQ2FjaGVkLFxuICAgICAgc2hlZXQ6IHNoZWV0LFxuICAgICAgaXNPbjogaXNPbixcbiAgICAgIGV2ZW50OiBlIHx8IHt9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246ICcyLjkuMicsXG4gICAgZ2V0SW5mbzogaW5mbyxcbiAgICBldmVudHM6IGV2ZW50cyxcbiAgICBnb1RvOiBnb1RvLFxuICAgIHBsYXk6IHBsYXksXG4gICAgcGF1c2U6IHBhdXNlLFxuICAgIGlzT246IGlzT24sXG4gICAgdXBkYXRlU2xpZGVySGVpZ2h0OiB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQsXG4gICAgcmVmcmVzaDogaW5pdFNsaWRlclRyYW5zZm9ybSxcbiAgICBkZXN0cm95OiBkZXN0cm95LFxuICAgIHJlYnVpbGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRucyhleHRlbmQob3B0aW9ucywgb3B0aW9uc0VsZW1lbnRzKSk7XG4gICAgfVxuICB9O1xufTtcblxucmV0dXJuIHRucztcbn0pKCk7IiwialF1ZXJ5KGZ1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBGbGV4eSBoZWFkZXJcbiAgZmxleHlfaGVhZGVyLmluaXQoKTtcblxuICAvLyBTaWRyXG4gICQoJy5zbGlua3ktbWVudScpXG4gICAgLmZpbmQoJ3VsLCBsaSwgYScpXG4gICAgLnJlbW92ZUNsYXNzKCk7XG5cbiAgLy8gRW5hYmxlIHRvb2x0aXBzLlxuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xufSk7XG4iXX0=
