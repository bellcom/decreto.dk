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

var handleToggle = function handleToggle(event) {
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
'use strict';

(function () {
  var handleToggle = function handleToggle(event) {
    var sidebars = document.querySelectorAll('.sidebar');

    for (var i = 0; i < sidebars.length; i++) {
      var sidebar = sidebars[i];

      sidebar.classList.toggle('open');
    }
  };

  // Add eventListeners.
  var toggles = document.querySelectorAll('.js-sidebar-toggle');

  for (var i = 0; i < toggles.length; i++) {
    var item = toggles[i];

    item.addEventListener('click', handleToggle);
  }
})();
'use strict';

(function () {
  function handleToggle(event) {
    var clickedElement = this;
    var wrapper = clickedElement.closest('.tabba');
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];
      var toggleWrapper = toggle.closest('.tabba');
      var nodeIsSame = toggle.isSameNode(clickedElement);
      var wrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (nodeIsSame && wrapperIsSame) {
        toggleElement(wrapper, i);
      }
    }
  }

  function toggleElement(wrapper, index) {
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');
    var contentItems = wrapper.querySelectorAll('.tabba-item');

    // Show content item
    var contentItemIndex = 0;
    for (var contentItemInt = 0; contentItemInt < contentItems.length; contentItemInt++) {
      var contentItem = contentItems[contentItemInt];
      var contentItemWrapper = contentItem.closest('.tabba');
      var contentWrapperIsSame = contentItemWrapper.isSameNode(wrapper);

      if (contentWrapperIsSame) {

        if (index === contentItemIndex) {
          contentItem.classList.remove('hidden');
        } else {
          contentItem.classList.add('hidden');
        }

        contentItemIndex++;
      }
    }

    // Set active class on toggle.
    var toggleIndex = 0;
    for (var toggleInt = 0; toggleInt < toggles.length; toggleInt++) {
      var toggle = toggles[toggleInt];
      var toggleWrapper = toggle.closest('.tabba');
      var toggleWrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (toggleWrapperIsSame) {

        if (index === toggleIndex) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }

        toggleIndex++;
      }
    }
  }

  // Add eventListeners.
  var wrappers = document.querySelectorAll('.tabba');

  for (var wrapperInt = 0; wrapperInt < wrappers.length; wrapperInt++) {
    var wrapper = wrappers[wrapperInt];
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    // Show the first element upon page load.
    toggleElement(wrapper, 0);

    // Run through toggles.
    for (var toggleInt = 0; toggleInt < toggles.length; toggleInt++) {
      var toggle = toggles[toggleInt];

      toggle.addEventListener('click', handleToggle);
    }
  }
})();
'use strict';

jQuery(function ($) {
  'use strict';

  // Flexy header
  // flexy_header.init();

  // Sidr

  $('.slinky-menu').find('ul, li, a').removeClass();

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();

  // Showcases.
  var slider = tns({
    container: '.showcases',
    items: 1,
    autoplay: true,
    autoplayHoverPause: true
  });

  var nextShowcaseButtons = document.querySelectorAll('.js-show-next-showcase');
  for (var nextInt = 0; nextInt < nextShowcaseButtons.length; nextInt++) {
    var nextShowcase = nextShowcaseButtons[nextInt];

    nextShowcase.addEventListener('click', function () {
      slider.goTo('next');
    });
  }

  var previousShowcaseButtons = document.querySelectorAll('.js-show-previous-showcase');
  for (var prevInt = 0; prevInt < previousShowcaseButtons.length; prevInt++) {
    var previousShowcase = previousShowcaseButtons[prevInt];

    previousShowcase.addEventListener('click', function () {
      slider.goTo('prev');
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImZsZXh5LWhlYWRlci5qcyIsInBhY2UuanMiLCJqcXVlcnkuc2xpbmt5LmpzIiwidGlueS1zbGlkZXIuanMiLCJmYXEtaXRlbXMuanMiLCJzaWRlYmFyLXRvZ2dsZS5qcyIsInRhYmJhLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsIkVycm9yIiwiJCIsInZlcnNpb24iLCJmbiIsImpxdWVyeSIsInNwbGl0IiwidHJhbnNpdGlvbkVuZCIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJuYW1lIiwic3R5bGUiLCJ1bmRlZmluZWQiLCJlbmQiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImR1cmF0aW9uIiwiY2FsbGVkIiwiJGVsIiwib25lIiwiY2FsbGJhY2siLCJ0cmlnZ2VyIiwic3VwcG9ydCIsInNldFRpbWVvdXQiLCJldmVudCIsInNwZWNpYWwiLCJic1RyYW5zaXRpb25FbmQiLCJiaW5kVHlwZSIsImRlbGVnYXRlVHlwZSIsImhhbmRsZSIsImUiLCJ0YXJnZXQiLCJpcyIsImhhbmRsZU9iaiIsImhhbmRsZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsImRpc21pc3MiLCJBbGVydCIsIm9uIiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsInByb3RvdHlwZSIsIiR0aGlzIiwic2VsZWN0b3IiLCJhdHRyIiwicmVwbGFjZSIsIiRwYXJlbnQiLCJmaW5kIiwicHJldmVudERlZmF1bHQiLCJsZW5ndGgiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVDbGFzcyIsInJlbW92ZUVsZW1lbnQiLCJkZXRhY2giLCJyZW1vdmUiLCJoYXNDbGFzcyIsIlBsdWdpbiIsIm9wdGlvbiIsImVhY2giLCJkYXRhIiwiY2FsbCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiZWxlbWVudCIsIm9wdGlvbnMiLCIkZWxlbWVudCIsImV4dGVuZCIsIkRFRkFVTFRTIiwiaXNMb2FkaW5nIiwibG9hZGluZ1RleHQiLCJzZXRTdGF0ZSIsInN0YXRlIiwiZCIsInZhbCIsInJlc2V0VGV4dCIsInByb3h5IiwiYWRkQ2xhc3MiLCJwcm9wIiwicmVtb3ZlQXR0ciIsInRvZ2dsZSIsImNoYW5nZWQiLCIkaW5wdXQiLCJ0b2dnbGVDbGFzcyIsImJ1dHRvbiIsIiRidG4iLCJmaXJzdCIsInRlc3QiLCJ0eXBlIiwiQ2Fyb3VzZWwiLCIkaW5kaWNhdG9ycyIsInBhdXNlZCIsInNsaWRpbmciLCJpbnRlcnZhbCIsIiRhY3RpdmUiLCIkaXRlbXMiLCJrZXlib2FyZCIsImtleWRvd24iLCJwYXVzZSIsImRvY3VtZW50RWxlbWVudCIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwiZ2V0SXRlbUluZGV4IiwiaXRlbSIsInBhcmVudCIsImNoaWxkcmVuIiwiaW5kZXgiLCJnZXRJdGVtRm9yRGlyZWN0aW9uIiwiZGlyZWN0aW9uIiwiYWN0aXZlIiwiYWN0aXZlSW5kZXgiLCJ3aWxsV3JhcCIsImRlbHRhIiwiaXRlbUluZGV4IiwiZXEiLCJ0byIsInBvcyIsInRoYXQiLCJzbGlkZSIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsIm9mZnNldFdpZHRoIiwiam9pbiIsImFjdGlvbiIsImNhcm91c2VsIiwiY2xpY2tIYW5kbGVyIiwiaHJlZiIsIiR0YXJnZXQiLCJzbGlkZUluZGV4Iiwid2luZG93IiwiJGNhcm91c2VsIiwiQ29sbGFwc2UiLCIkdHJpZ2dlciIsImlkIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwib2Zmc2V0SGVpZ2h0IiwiaSIsImdldFRhcmdldEZyb21UcmlnZ2VyIiwiaXNPcGVuIiwiY29sbGFwc2UiLCJiYWNrZHJvcCIsIkRyb3Bkb3duIiwiY2xlYXJNZW51cyIsImNvbnRhaW5zIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsInN0b3BQcm9wYWdhdGlvbiIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCJib2R5IiwiJGRpYWxvZyIsIiRiYWNrZHJvcCIsImlzU2hvd24iLCJvcmlnaW5hbEJvZHlQYWQiLCJzY3JvbGxiYXJXaWR0aCIsImlnbm9yZUJhY2tkcm9wQ2xpY2siLCJmaXhlZENvbnRlbnQiLCJyZW1vdGUiLCJsb2FkIiwiQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiIsIl9yZWxhdGVkVGFyZ2V0IiwiY2hlY2tTY3JvbGxiYXIiLCJzZXRTY3JvbGxiYXIiLCJlc2NhcGUiLCJyZXNpemUiLCJhcHBlbmRUbyIsInNjcm9sbFRvcCIsImFkanVzdERpYWxvZyIsImVuZm9yY2VGb2N1cyIsIm9mZiIsImhpZGVNb2RhbCIsImhhcyIsImhhbmRsZVVwZGF0ZSIsInJlc2V0QWRqdXN0bWVudHMiLCJyZXNldFNjcm9sbGJhciIsInJlbW92ZUJhY2tkcm9wIiwiYW5pbWF0ZSIsImRvQW5pbWF0ZSIsImN1cnJlbnRUYXJnZXQiLCJmb2N1cyIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImlubmVyV2lkdGgiLCJkb2N1bWVudEVsZW1lbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmlnaHQiLCJNYXRoIiwiYWJzIiwibGVmdCIsImNsaWVudFdpZHRoIiwibWVhc3VyZVNjcm9sbGJhciIsImJvZHlQYWQiLCJwYXJzZUludCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhcnNlRmxvYXQiLCJwYWRkaW5nIiwicmVtb3ZlRGF0YSIsInNjcm9sbERpdiIsImNsYXNzTmFtZSIsImFwcGVuZCIsInJlbW92ZUNoaWxkIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYSIsImFyZWEiLCJiIiwiYnIiLCJjb2wiLCJjb2RlIiwiZGl2IiwiZW0iLCJociIsImgxIiwiaDIiLCJoMyIsImg0IiwiaDUiLCJoNiIsImltZyIsImxpIiwib2wiLCJwIiwicHJlIiwicyIsInNtYWxsIiwic3BhbiIsInN1YiIsInN1cCIsInN0cm9uZyIsInUiLCJ1bCIsIlNBRkVfVVJMX1BBVFRFUk4iLCJEQVRBX1VSTF9QQVRURVJOIiwiYWxsb3dlZEF0dHJpYnV0ZSIsImFsbG93ZWRBdHRyaWJ1dGVMaXN0IiwiYXR0ck5hbWUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsInZhbHVlIiwiUmVnRXhwIiwibCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJpbm5lckhUTUwiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJsZW4iLCJlbE5hbWUiLCJwYXJlbnROb2RlIiwiYXR0cmlidXRlTGlzdCIsImF0dHJpYnV0ZXMiLCJ3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMiLCJjb25jYXQiLCJqIiwibGVuMiIsInJlbW92ZUF0dHJpYnV0ZSIsIlRvb2x0aXAiLCJlbmFibGVkIiwidGltZW91dCIsImhvdmVyU3RhdGUiLCJpblN0YXRlIiwiaW5pdCIsImFuaW1hdGlvbiIsInBsYWNlbWVudCIsInRlbXBsYXRlIiwidGl0bGUiLCJkZWxheSIsImh0bWwiLCJjb250YWluZXIiLCJ2aWV3cG9ydCIsInNhbml0aXplIiwiZ2V0T3B0aW9ucyIsIiR2aWV3cG9ydCIsImlzRnVuY3Rpb24iLCJjbGljayIsImhvdmVyIiwiY29uc3RydWN0b3IiLCJ0cmlnZ2VycyIsImV2ZW50SW4iLCJldmVudE91dCIsImVudGVyIiwibGVhdmUiLCJfb3B0aW9ucyIsImZpeFRpdGxlIiwiZ2V0RGVmYXVsdHMiLCJkYXRhQXR0cmlidXRlcyIsImRhdGFBdHRyIiwiaGFzT3duUHJvcGVydHkiLCJnZXREZWxlZ2F0ZU9wdGlvbnMiLCJkZWZhdWx0cyIsImtleSIsIm9iaiIsInNlbGYiLCJ0aXAiLCJjbGVhclRpbWVvdXQiLCJpc0luU3RhdGVUcnVlIiwiaGFzQ29udGVudCIsImluRG9tIiwib3duZXJEb2N1bWVudCIsIiR0aXAiLCJ0aXBJZCIsImdldFVJRCIsInNldENvbnRlbnQiLCJhdXRvVG9rZW4iLCJhdXRvUGxhY2UiLCJ0b3AiLCJkaXNwbGF5IiwiZ2V0UG9zaXRpb24iLCJhY3R1YWxXaWR0aCIsImFjdHVhbEhlaWdodCIsIm9yZ1BsYWNlbWVudCIsInZpZXdwb3J0RGltIiwiYm90dG9tIiwid2lkdGgiLCJjYWxjdWxhdGVkT2Zmc2V0IiwiZ2V0Q2FsY3VsYXRlZE9mZnNldCIsImFwcGx5UGxhY2VtZW50IiwicHJldkhvdmVyU3RhdGUiLCJvZmZzZXQiLCJoZWlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwiaXNOYU4iLCJzZXRPZmZzZXQiLCJ1c2luZyIsInByb3BzIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInByZWZpeCIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJkZXN0cm95IiwidG9vbHRpcCIsIlBvcG92ZXIiLCJjb250ZW50IiwiZ2V0Q29udGVudCIsInR5cGVDb250ZW50IiwicG9wb3ZlciIsIlNjcm9sbFNweSIsIiRzY3JvbGxFbGVtZW50Iiwib2Zmc2V0cyIsInRhcmdldHMiLCJhY3RpdmVUYXJnZXQiLCJwcm9jZXNzIiwicmVmcmVzaCIsImdldFNjcm9sbEhlaWdodCIsIm1heCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsInB1c2giLCJtYXhTY3JvbGwiLCJhY3RpdmF0ZSIsImNsZWFyIiwicGFyZW50cyIsInBhcmVudHNVbnRpbCIsInNjcm9sbHNweSIsIiRzcHkiLCJUYWIiLCIkdWwiLCIkcHJldmlvdXMiLCJoaWRlRXZlbnQiLCJ0YWIiLCJBZmZpeCIsImNoZWNrUG9zaXRpb24iLCJjaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCIsImFmZml4ZWQiLCJ1bnBpbiIsInBpbm5lZE9mZnNldCIsIlJFU0VUIiwiZ2V0U3RhdGUiLCJvZmZzZXRUb3AiLCJvZmZzZXRCb3R0b20iLCJwb3NpdGlvbiIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiQWpheE1vbml0b3IiLCJCYXIiLCJEb2N1bWVudE1vbml0b3IiLCJFbGVtZW50TW9uaXRvciIsIkVsZW1lbnRUcmFja2VyIiwiRXZlbnRMYWdNb25pdG9yIiwiRXZlbnRlZCIsIkV2ZW50cyIsIk5vVGFyZ2V0RXJyb3IiLCJQYWNlIiwiUmVxdWVzdEludGVyY2VwdCIsIlNPVVJDRV9LRVlTIiwiU2NhbGVyIiwiU29ja2V0UmVxdWVzdFRyYWNrZXIiLCJYSFJSZXF1ZXN0VHJhY2tlciIsImF2Z0FtcGxpdHVkZSIsImJhciIsImNhbmNlbEFuaW1hdGlvbiIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmROYXRpdmUiLCJnZXRGcm9tRE9NIiwiZ2V0SW50ZXJjZXB0IiwiaGFuZGxlUHVzaFN0YXRlIiwiaWdub3JlU3RhY2siLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXN1bHQiLCJydW5BbmltYXRpb24iLCJzY2FsZXJzIiwic2hvdWxkSWdub3JlVVJMIiwic2hvdWxkVHJhY2siLCJzb3VyY2UiLCJzb3VyY2VzIiwidW5pU2NhbGVyIiwiX1dlYlNvY2tldCIsIl9YRG9tYWluUmVxdWVzdCIsIl9YTUxIdHRwUmVxdWVzdCIsIl9pIiwiX2ludGVyY2VwdCIsIl9sZW4iLCJfcHVzaFN0YXRlIiwiX3JlZiIsIl9yZWYxIiwiX3JlcGxhY2VTdGF0ZSIsIl9fc2xpY2UiLCJzbGljZSIsIl9faGFzUHJvcCIsIl9fZXh0ZW5kcyIsImNoaWxkIiwiY3RvciIsIl9fc3VwZXJfXyIsIl9faW5kZXhPZiIsImluZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsInNlbGVjdG9ycyIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsIkRhdGUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc1JlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwibGFzdCIsInRpY2siLCJkaWZmIiwiYXJncyIsIm91dCIsImFyciIsImNvdW50Iiwic3VtIiwidiIsImpzb24iLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiSlNPTiIsInBhcnNlIiwiX2Vycm9yIiwiY29uc29sZSIsImVycm9yIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInNwbGljZSIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmRDaGlsZCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJyZW5kZXIiLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwic2V0QXR0cmlidXRlIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiZnJvbSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiY29uZmlndXJhYmxlIiwiZW51bWVyYWJsZSIsImlnbm9yZSIsInJldCIsInVuc2hpZnQiLCJzaGlmdCIsInRyYWNrIiwibWV0aG9kIiwidG9VcHBlckNhc2UiLCJtb25pdG9yWEhSIiwiX3RoaXMiLCJyZXEiLCJfb3BlbiIsIm9wZW4iLCJ1cmwiLCJhc3luYyIsInJlcXVlc3QiLCJmbGFncyIsInByb3RvY29scyIsInBhdHRlcm4iLCJfYXJnIiwiYWZ0ZXIiLCJydW5uaW5nIiwic3RpbGxBY3RpdmUiLCJfcmVmMyIsInJlYWR5U3RhdGUiLCJyZXN0YXJ0Iiwid2F0Y2giLCJ0cmFja2VyIiwic2l6ZSIsIl9vbnJlYWR5c3RhdGVjaGFuZ2UiLCJQcm9ncmVzc0V2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsIm1pbiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwic3RhcnQiLCJnbyIsImVucXVldWVOZXh0RnJhbWUiLCJyZW1haW5pbmciLCJzY2FsZXIiLCJzY2FsZXJMaXN0IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInQiLCJzbGlua3kiLCJsYWJlbCIsInNwZWVkIiwibiIsInIiLCJwcmVwZW5kIiwianVtcCIsImhvbWUiLCJjIiwidG5zIiwia2V5cyIsIm9iamVjdCIsIkVsZW1lbnQiLCJ3aW4iLCJyYWYiLCJjYiIsIndpbiQxIiwiY2FmIiwiY29weSIsImNoZWNrU3RvcmFnZVZhbHVlIiwic2V0TG9jYWxTdG9yYWdlIiwic3RvcmFnZSIsImFjY2VzcyIsInNldEl0ZW0iLCJnZXRTbGlkZUlkIiwidG5zSWQiLCJnZXRCb2R5IiwiZG9jIiwiZmFrZSIsImRvY0VsZW1lbnQiLCJzZXRGYWtlQm9keSIsImRvY092ZXJmbG93Iiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kIiwicmVzZXRGYWtlQm9keSIsImNhbGMiLCJzdHIiLCJ2YWxzIiwicGVyY2VudGFnZUxheW91dCIsIndyYXBwZXIiLCJvdXRlciIsInBlclBhZ2UiLCJzdXBwb3J0ZWQiLCJtZWRpYXF1ZXJ5U3VwcG9ydCIsInJ1bGUiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsImNyZWF0ZVRleHROb2RlIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImN1cnJlbnRTdHlsZSIsImNyZWF0ZVN0eWxlU2hlZXQiLCJtZWRpYSIsInNoZWV0IiwiYWRkQ1NTUnVsZSIsInJ1bGVzIiwiaW5zZXJ0UnVsZSIsImFkZFJ1bGUiLCJyZW1vdmVDU1NSdWxlIiwiZGVsZXRlUnVsZSIsInJlbW92ZVJ1bGUiLCJnZXRDc3NSdWxlc0xlbmd0aCIsImNzc1J1bGVzIiwidG9EZWdyZWUiLCJ5IiwieCIsImF0YW4yIiwiUEkiLCJnZXRUb3VjaERpcmVjdGlvbiIsImFuZ2xlIiwicmFuZ2UiLCJnYXAiLCJmb3JFYWNoIiwic2NvcGUiLCJjbGFzc0xpc3RTdXBwb3J0IiwiY2xhc3NMaXN0IiwiYWRkIiwiaGFzQXR0ciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHIiLCJpc05vZGVMaXN0Iiwic2V0QXR0cnMiLCJlbHMiLCJhdHRycyIsIkFycmF5IiwidG9TdHJpbmciLCJyZW1vdmVBdHRycyIsImF0dHJMZW5ndGgiLCJhcnJheUZyb21Ob2RlTGlzdCIsIm5sIiwiaGlkZUVsZW1lbnQiLCJmb3JjZUhpZGUiLCJzaG93RWxlbWVudCIsImlzVmlzaWJsZSIsIndoaWNoUHJvcGVydHkiLCJQcm9wcyIsImNoYXJBdCIsInN1YnN0ciIsInByZWZpeGVzIiwiaGFzM0RUcmFuc2Zvcm1zIiwidGYiLCJoYXMzZCIsImNzc1RGIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImdldEVuZFByb3BlcnR5IiwicHJvcEluIiwicHJvcE91dCIsImVuZFByb3AiLCJzdXBwb3J0c1Bhc3NpdmUiLCJvcHRzIiwicGFzc2l2ZU9wdGlvbiIsInBhc3NpdmUiLCJhZGRFdmVudHMiLCJwcmV2ZW50U2Nyb2xsaW5nIiwicmVtb3ZlRXZlbnRzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRvcGljcyIsImV2ZW50TmFtZSIsImVtaXQiLCJqc1RyYW5zZm9ybSIsInBvc3RmaXgiLCJ1bml0IiwiTnVtYmVyIiwicG9zaXRpb25UaWNrIiwibW92ZUVsZW1lbnQiLCJtb2RlIiwiYXhpcyIsIml0ZW1zIiwiZ3V0dGVyIiwiZWRnZVBhZGRpbmciLCJmaXhlZFdpZHRoIiwiYXV0b1dpZHRoIiwidmlld3BvcnRNYXgiLCJzbGlkZUJ5IiwiY2VudGVyIiwiY29udHJvbHMiLCJjb250cm9sc1Bvc2l0aW9uIiwiY29udHJvbHNUZXh0IiwiY29udHJvbHNDb250YWluZXIiLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsIm5hdiIsIm5hdlBvc2l0aW9uIiwibmF2Q29udGFpbmVyIiwibmF2QXNUaHVtYm5haWxzIiwiYXJyb3dLZXlzIiwiYXV0b3BsYXkiLCJhdXRvcGxheVBvc2l0aW9uIiwiYXV0b3BsYXlUaW1lb3V0IiwiYXV0b3BsYXlEaXJlY3Rpb24iLCJhdXRvcGxheVRleHQiLCJhdXRvcGxheUhvdmVyUGF1c2UiLCJhdXRvcGxheUJ1dHRvbiIsImF1dG9wbGF5QnV0dG9uT3V0cHV0IiwiYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSIsImFuaW1hdGVJbiIsImFuaW1hdGVPdXQiLCJhbmltYXRlTm9ybWFsIiwiYW5pbWF0ZURlbGF5IiwibG9vcCIsInJld2luZCIsImF1dG9IZWlnaHQiLCJyZXNwb25zaXZlIiwibGF6eWxvYWQiLCJsYXp5bG9hZFNlbGVjdG9yIiwidG91Y2giLCJtb3VzZURyYWciLCJzd2lwZUFuZ2xlIiwibmVzdGVkIiwicHJldmVudEFjdGlvbldoZW5SdW5uaW5nIiwicHJldmVudFNjcm9sbE9uVG91Y2giLCJmcmVlemFibGUiLCJvbkluaXQiLCJ1c2VMb2NhbFN0b3JhZ2UiLCJLRVlTIiwiRU5URVIiLCJTUEFDRSIsIkxFRlQiLCJSSUdIVCIsInRuc1N0b3JhZ2UiLCJsb2NhbFN0b3JhZ2VBY2Nlc3MiLCJicm93c2VySW5mbyIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInVpZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiQ0FMQyIsIlBFUkNFTlRBR0VMQVlPVVQiLCJDU1NNUSIsIlRSQU5TRk9STSIsIkhBUzNEVFJBTlNGT1JNUyIsIlRSQU5TSVRJT05EVVJBVElPTiIsIlRSQU5TSVRJT05ERUxBWSIsIkFOSU1BVElPTkRVUkFUSU9OIiwiQU5JTUFUSU9OREVMQVkiLCJUUkFOU0lUSU9ORU5EIiwiQU5JTUFUSU9ORU5EIiwic3VwcG9ydENvbnNvbGVXYXJuIiwid2FybiIsInRuc0xpc3QiLCJvcHRpb25zRWxlbWVudHMiLCJyZXNwb25zaXZlVGVtIiwidXBkYXRlT3B0aW9ucyIsImhvcml6b250YWwiLCJvdXRlcldyYXBwZXIiLCJpbm5lcldyYXBwZXIiLCJtaWRkbGVXcmFwcGVyIiwiY29udGFpbmVyUGFyZW50IiwiY29udGFpbmVySFRNTCIsIm91dGVySFRNTCIsInNsaWRlSXRlbXMiLCJzbGlkZUNvdW50IiwiYnJlYWtwb2ludFpvbmUiLCJ3aW5kb3dXaWR0aCIsImdldFdpbmRvd1dpZHRoIiwiaXNPbiIsInNldEJyZWFrcG9pbnRab25lIiwiZ2V0T3B0aW9uIiwiZ2V0Vmlld3BvcnRXaWR0aCIsImZsb29yIiwiZml4ZWRXaWR0aFZpZXdwb3J0V2lkdGgiLCJzbGlkZVBvc2l0aW9ucyIsInNsaWRlSXRlbXNPdXQiLCJjbG9uZUNvdW50IiwiZ2V0Q2xvbmVDb3VudEZvckxvb3AiLCJzbGlkZUNvdW50TmV3IiwiaGFzUmlnaHREZWFkWm9uZSIsInJpZ2h0Qm91bmRhcnkiLCJnZXRSaWdodEJvdW5kYXJ5IiwidXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm1BdHRyIiwidHJhbnNmb3JtUHJlZml4IiwidHJhbnNmb3JtUG9zdGZpeCIsImdldEluZGV4TWF4IiwiY2VpbCIsImdldFN0YXJ0SW5kZXgiLCJpbmRleENhY2hlZCIsImRpc3BsYXlJbmRleCIsImdldEN1cnJlbnRTbGlkZSIsImluZGV4TWluIiwiaW5kZXhNYXgiLCJyZXNpemVUaW1lciIsIm1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsImV2ZW50cyIsIm5ld0NvbnRhaW5lckNsYXNzZXMiLCJzbGlkZUlkIiwiZGlzYWJsZWQiLCJmcmVlemUiLCJnZXRGcmVlemUiLCJmcm96ZW4iLCJjb250cm9sc0V2ZW50cyIsIm9uQ29udHJvbHNDbGljayIsIm9uQ29udHJvbHNLZXlkb3duIiwibmF2RXZlbnRzIiwib25OYXZDbGljayIsIm9uTmF2S2V5ZG93biIsImhvdmVyRXZlbnRzIiwibW91c2VvdmVyUGF1c2UiLCJtb3VzZW91dFJlc3RhcnQiLCJ2aXNpYmlsaXR5RXZlbnQiLCJvblZpc2liaWxpdHlDaGFuZ2UiLCJkb2NtZW50S2V5ZG93bkV2ZW50Iiwib25Eb2N1bWVudEtleWRvd24iLCJ0b3VjaEV2ZW50cyIsIm9uUGFuU3RhcnQiLCJvblBhbk1vdmUiLCJvblBhbkVuZCIsImRyYWdFdmVudHMiLCJoYXNDb250cm9scyIsImhhc09wdGlvbiIsImhhc05hdiIsImhhc0F1dG9wbGF5IiwiaGFzVG91Y2giLCJoYXNNb3VzZURyYWciLCJzbGlkZUFjdGl2ZUNsYXNzIiwiaW1nQ29tcGxldGVDbGFzcyIsImltZ0V2ZW50cyIsIm9uSW1nTG9hZGVkIiwib25JbWdGYWlsZWQiLCJpbWdzQ29tcGxldGUiLCJsaXZlcmVnaW9uQ3VycmVudCIsInByZXZlbnRTY3JvbGwiLCJjb250cm9sc0NvbnRhaW5lckhUTUwiLCJwcmV2QnV0dG9uSFRNTCIsIm5leHRCdXR0b25IVE1MIiwicHJldklzQnV0dG9uIiwibmV4dElzQnV0dG9uIiwibmF2Q29udGFpbmVySFRNTCIsIm5hdkl0ZW1zIiwicGFnZXMiLCJnZXRQYWdlcyIsInBhZ2VzQ2FjaGVkIiwibmF2Q2xpY2tlZCIsIm5hdkN1cnJlbnRJbmRleCIsImdldEN1cnJlbnROYXZJbmRleCIsIm5hdkN1cnJlbnRJbmRleENhY2hlZCIsIm5hdkFjdGl2ZUNsYXNzIiwibmF2U3RyIiwibmF2U3RyQ3VycmVudCIsImF1dG9wbGF5QnV0dG9uSFRNTCIsImF1dG9wbGF5SHRtbFN0cmluZ3MiLCJhdXRvcGxheVRpbWVyIiwiYW5pbWF0aW5nIiwiYXV0b3BsYXlIb3ZlclBhdXNlZCIsImF1dG9wbGF5VXNlclBhdXNlZCIsImF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCIsImluaXRQb3NpdGlvbiIsImxhc3RQb3NpdGlvbiIsInRyYW5zbGF0ZUluaXQiLCJkaXNYIiwiZGlzWSIsInBhblN0YXJ0IiwicmFmSW5kZXgiLCJnZXREaXN0IiwicmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlIiwiaW5pdFN0cnVjdHVyZSIsImluaXRTaGVldCIsImluaXRTbGlkZXJUcmFuc2Zvcm0iLCJjb25kaXRpb24iLCJ0ZW0iLCJpbmQiLCJnZXRBYnNJbmRleCIsImFic0luZGV4IiwiZ2V0SXRlbXNNYXgiLCJicCIsIml0ZW1zTWF4IiwiZ2V0SW5zZXJ0UG9zaXRpb24iLCJnZXRDbGllbnRXaWR0aCIsInJlY3QiLCJ3dyIsImdldFNsaWRlTWFyZ2luTGVmdCIsImdldElubmVyV3JhcHBlclN0eWxlcyIsImVkZ2VQYWRkaW5nVGVtIiwiZ3V0dGVyVGVtIiwiZml4ZWRXaWR0aFRlbSIsInNwZWVkVGVtIiwiYXV0b0hlaWdodEJQIiwiZ3V0dGVyVGVtVW5pdCIsImRpciIsImdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlIiwiZ2V0Q29udGFpbmVyV2lkdGgiLCJpdGVtc1RlbSIsImdldFNsaWRlV2lkdGhTdHlsZSIsImRpdmlkZW5kIiwiZ2V0U2xpZGVHdXR0ZXJTdHlsZSIsImdldENTU1ByZWZpeCIsIm51bSIsInN1YnN0cmluZyIsImdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUiLCJjbGFzc091dGVyIiwiY2xhc3NJbm5lciIsImhhc0d1dHRlciIsIndwIiwiZnJhZ21lbnRCZWZvcmUiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZnJhZ21lbnRBZnRlciIsImNsb25lRmlyc3QiLCJjbG9uZU5vZGUiLCJjbG9uZUxhc3QiLCJpbWdzIiwicXVlcnlTZWxlY3RvckFsbCIsInNyYyIsImltZ0xvYWRlZCIsImltZ3NMb2FkZWRDaGVjayIsImdldEltYWdlQXJyYXkiLCJpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayIsImRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50IiwiaW5pdFRvb2xzIiwiaW5pdEV2ZW50cyIsInN0eWxlc0FwcGxpY2F0aW9uQ2hlY2siLCJ0b0ZpeGVkIiwiaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUiLCJzZXRTbGlkZVBvc2l0aW9ucyIsInVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0IiwiZm9udFNpemUiLCJ1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbiIsIm1pZGRsZVdyYXBwZXJTdHIiLCJpbm5lcldyYXBwZXJTdHIiLCJjb250YWluZXJTdHIiLCJzbGlkZVN0ciIsIml0ZW1zQlAiLCJmaXhlZFdpZHRoQlAiLCJzcGVlZEJQIiwiZWRnZVBhZGRpbmdCUCIsImd1dHRlckJQIiwidXBkYXRlU2xpZGVTdGF0dXMiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJnZXRMaXZlUmVnaW9uU3RyIiwidHh0IiwidG9nZ2xlQXV0b3BsYXkiLCJzdGFydEF1dG9wbGF5IiwiaW5pdEluZGV4IiwibmF2SHRtbCIsImhpZGRlblN0ciIsInVwZGF0ZU5hdlZpc2liaWxpdHkiLCJpc0J1dHRvbiIsInVwZGF0ZUNvbnRyb2xzU3RhdHVzIiwiZGlzYWJsZVVJIiwiZXZlIiwib25UcmFuc2l0aW9uRW5kIiwicmVzaXplVGFza3MiLCJpbmZvIiwib25SZXNpemUiLCJkb0F1dG9IZWlnaHQiLCJkb0xhenlMb2FkIiwiZGlzYWJsZVNsaWRlciIsImZyZWV6ZVNsaWRlciIsImFkZGl0aW9uYWxVcGRhdGVzIiwib3duZXJOb2RlIiwiaHRtbExpc3QiLCJwcmV2RWwiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwicGFyZW50RWwiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJmaXJzdEVsZW1lbnRDaGlsZCIsImdldEV2ZW50IiwiYnBDaGFuZ2VkIiwiYnJlYWtwb2ludFpvbmVUZW0iLCJuZWVkQ29udGFpbmVyVHJhbnNmb3JtIiwiaW5kQ2hhbmdlZCIsIml0ZW1zQ2hhbmdlZCIsImRpc2FibGVUZW0iLCJmcmVlemVUZW0iLCJhcnJvd0tleXNUZW0iLCJjb250cm9sc1RlbSIsIm5hdlRlbSIsInRvdWNoVGVtIiwibW91c2VEcmFnVGVtIiwiYXV0b3BsYXlUZW0iLCJhdXRvcGxheUhvdmVyUGF1c2VUZW0iLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtIiwiaW5kZXhUZW0iLCJhdXRvSGVpZ2h0VGVtIiwiY29udHJvbHNUZXh0VGVtIiwiY2VudGVyVGVtIiwiYXV0b3BsYXlUZXh0VGVtIiwidXBkYXRlSW5kZXgiLCJlbmFibGVTbGlkZXIiLCJkb0NvbnRhaW5lclRyYW5zZm9ybSIsImdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlIiwidW5mcmVlemVTbGlkZXIiLCJzdG9wQXV0b3BsYXkiLCJ1cGRhdGVMaXZlUmVnaW9uIiwidXBkYXRlR2FsbGVyeVNsaWRlUG9zaXRpb25zIiwiYXV0b2hlaWdodFRlbSIsInZwIiwibGVmdEVkZ2UiLCJyaWdodEVkZ2UiLCJlbmFibGVVSSIsIm1hcmdpbiIsImNsYXNzTiIsImdldFZpc2libGVTbGlkZVJhbmdlIiwicmFuZ2VzdGFydCIsInJhbmdlZW5kIiwicG9pbnQiLCJjZWxsIiwic3Jjc2V0IiwiZ2V0VGFyZ2V0IiwiaW1nRmFpbGVkIiwiaW1nQ29tcGxldGVkIiwidXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0IiwidXBkYXRlTmF2U3RhdHVzIiwiZ2V0TWF4U2xpZGVIZWlnaHQiLCJzbGlkZVN0YXJ0Iiwic2xpZGVSYW5nZSIsImhlaWdodHMiLCJtYXhIZWlnaHQiLCJhdHRyMiIsImJhc2UiLCJuYXZQcmV2IiwibmF2Q3VycmVudCIsImdldExvd2VyQ2FzZU5vZGVOYW1lIiwiaXNBcmlhRGlzYWJsZWQiLCJkaXNFbmFibGVFbGVtZW50IiwicHJldkRpc2FibGVkIiwibmV4dERpc2FibGVkIiwiZGlzYWJsZVByZXYiLCJkaXNhYmxlTmV4dCIsInJlc2V0RHVyYXRpb24iLCJnZXRTbGlkZXJXaWR0aCIsImdldENlbnRlckdhcCIsImRlbm9taW5hdG9yIiwiYW5pbWF0ZVNsaWRlIiwibnVtYmVyIiwiY2xhc3NPdXQiLCJjbGFzc0luIiwiaXNPdXQiLCJ0cmFuc2Zvcm1Db3JlIiwic2xpZGVyTW92ZWQiLCJzdHJUcmFucyIsInByb3BlcnR5TmFtZSIsImdvVG8iLCJ0YXJnZXRJbmRleCIsImluZGV4R2FwIiwiZmFjdG9yIiwicGFzc0V2ZW50T2JqZWN0IiwidGFyZ2V0SW4iLCJuYXZJbmRleCIsInRhcmdldEluZGV4QmFzZSIsInNldEF1dG9wbGF5VGltZXIiLCJzdG9wQXV0b3BsYXlUaW1lciIsInVwZGF0ZUF1dG9wbGF5QnV0dG9uIiwicGxheSIsImhpZGRlbiIsImtleUluZGV4Iiwia2V5Q29kZSIsInNldEZvY3VzIiwiY3VyRWxlbWVudCIsImFjdGl2ZUVsZW1lbnQiLCJpc1RvdWNoRXZlbnQiLCJjaGFuZ2VkVG91Y2hlcyIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIiwicmV0dXJuVmFsdWUiLCJnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQiLCJjbGllbnRYIiwiY2xpZW50WSIsInBhblVwZGF0ZSIsImVyciIsImRpc3QiLCJwZXJjZW50YWdlWCIsInByZXZlbnRDbGljayIsImluZGV4TW92ZWQiLCJtb3ZlZCIsInJvdWdoIiwiZ2V0SW5mbyIsInVwZGF0ZVNsaWRlckhlaWdodCIsInJlYnVpbGQiLCJoYW5kbGVUb2dnbGUiLCJ0b2dnbGVzIiwic2lkZWJhcnMiLCJzaWRlYmFyIiwiY2xpY2tlZEVsZW1lbnQiLCJ0b2dnbGVXcmFwcGVyIiwibm9kZUlzU2FtZSIsImlzU2FtZU5vZGUiLCJ3cmFwcGVySXNTYW1lIiwidG9nZ2xlRWxlbWVudCIsImNvbnRlbnRJdGVtcyIsImNvbnRlbnRJdGVtSW5kZXgiLCJjb250ZW50SXRlbUludCIsImNvbnRlbnRJdGVtIiwiY29udGVudEl0ZW1XcmFwcGVyIiwiY29udGVudFdyYXBwZXJJc1NhbWUiLCJ0b2dnbGVJbmRleCIsInRvZ2dsZUludCIsInRvZ2dsZVdyYXBwZXJJc1NhbWUiLCJ3cmFwcGVycyIsIndyYXBwZXJJbnQiLCJzbGlkZXIiLCJuZXh0U2hvd2Nhc2VCdXR0b25zIiwibmV4dEludCIsIm5leHRTaG93Y2FzZSIsInByZXZpb3VzU2hvd2Nhc2VCdXR0b25zIiwicHJldkludCIsInByZXZpb3VzU2hvd2Nhc2UiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7O0FBTUEsSUFBSSxPQUFPQSxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFFBQU0sSUFBSUMsS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxDQUFDLFVBQVVDLENBQVYsRUFBYTtBQUNaOztBQUNBLE1BQUlDLFVBQVVELEVBQUVFLEVBQUYsQ0FBS0MsTUFBTCxDQUFZQyxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLEVBQTBCQSxLQUExQixDQUFnQyxHQUFoQyxDQUFkO0FBQ0EsTUFBS0gsUUFBUSxD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MUQsSUFBRSx5QkFBRixFQUE2QitaLE9BQTdCOztBQUVBO0FBQ0EsTUFBSXd6QixTQUFTN2hCLElBQUk7QUFDZnJYLGVBQVcsWUFESTtBQUVmMGUsV0FBTyxDQUZRO0FBR2ZtQixjQUFVLElBSEs7QUFJZkssd0JBQW9CO0FBSkwsR0FBSixDQUFiOztBQU9BLE1BQUlpWixzQkFBc0JqdEMsU0FBU21oQyxnQkFBVCxDQUEwQix3QkFBMUIsQ0FBMUI7QUFDQSxPQUFJLElBQUkrTCxVQUFVLENBQWxCLEVBQXFCQSxVQUFVRCxvQkFBb0JscUMsTUFBbkQsRUFBMkRtcUMsU0FBM0QsRUFBc0U7QUFDcEUsUUFBSUMsZUFBZUYsb0JBQW9CQyxPQUFwQixDQUFuQjs7QUFFQUMsaUJBQWFqbEIsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsWUFBVztBQUNoRDhrQixhQUFPMUQsSUFBUCxDQUFZLE1BQVo7QUFDRCxLQUZEO0FBR0Q7O0FBRUQsTUFBSThELDBCQUEwQnB0QyxTQUFTbWhDLGdCQUFULENBQTBCLDRCQUExQixDQUE5QjtBQUNBLE9BQUksSUFBSWtNLFVBQVUsQ0FBbEIsRUFBcUJBLFVBQVVELHdCQUF3QnJxQyxNQUF2RCxFQUErRHNxQyxTQUEvRCxFQUEwRTtBQUN4RSxRQUFJQyxtQkFBbUJGLHdCQUF3QkMsT0FBeEIsQ0FBdkI7O0FBRUFDLHFCQUFpQnBsQixnQkFBakIsQ0FBa0MsT0FBbEMsRUFBMkMsWUFBVztBQUNwRDhrQixhQUFPMUQsSUFBUCxDQUFZLE1BQVo7QUFDRCxLQUZEO0FBR0Q7QUFDRixDQXZDRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJvb3RzdHJhcCB2My40LjEgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5cbmlmICh0eXBlb2YgalF1ZXJ5ID09PSAndW5kZWZpbmVkJykge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnknKVxufVxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgdmVyc2lvbiA9ICQuZm4uanF1ZXJ5LnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKVxuICBpZiAoKHZlcnNpb25bMF0gPCAyICYmIHZlcnNpb25bMV0gPCA5KSB8fCAodmVyc2lvblswXSA9PSAxICYmIHZlcnNpb25bMV0gPT0gOSAmJiB2ZXJzaW9uWzJdIDwgMSkgfHwgKHZlcnNpb25bMF0gPiAzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuOS4xIG9yIGhpZ2hlciwgYnV0IGxvd2VyIHRoYW4gdmVyc2lvbiA0JylcbiAgfVxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdHJhbnNpdGlvbi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0cmFuc2l0aW9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENTUyBUUkFOU0lUSU9OIFNVUFBPUlQgKFNob3V0b3V0OiBodHRwczovL21vZGVybml6ci5jb20vKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Jvb3RzdHJhcCcpXG5cbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0VHJhbnNpdGlvbiA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgIE1velRyYW5zaXRpb24gICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICBPVHJhbnNpdGlvbiAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgIHRyYW5zaXRpb24gICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV0gfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZSAvLyBleHBsaWNpdCBmb3IgaWU4ICggIC5fLilcbiAgfVxuXG4gIC8vIGh0dHBzOi8vYmxvZy5hbGV4bWFjY2F3LmNvbS9jc3MtdHJhbnNpdGlvbnNcbiAgJC5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgIHZhciBjYWxsZWQgPSBmYWxzZVxuICAgIHZhciAkZWwgPSB0aGlzXG4gICAgJCh0aGlzKS5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHsgY2FsbGVkID0gdHJ1ZSB9KVxuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgaWYgKCFjYWxsZWQpICQoJGVsKS50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCkgfVxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAkKGZ1bmN0aW9uICgpIHtcbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25FbmQoKVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuXG5cbiAgICAkLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kID0ge1xuICAgICAgYmluZFR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGRlbGVnYXRlVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhpcykpIHJldHVybiBlLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFsZXJ0LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2FsZXJ0c1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFMRVJUIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBkaXNtaXNzID0gJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXSdcbiAgdmFyIEFsZXJ0ICAgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAkKGVsKS5vbignY2xpY2snLCBkaXNtaXNzLCB0aGlzLmNsb3NlKVxuICB9XG5cbiAgQWxlcnQuVkVSU0lPTiA9ICczLjQuMSdcblxuICBBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgQWxlcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICAgPSAkKHRoaXMpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBzZWxlY3RvciAgICA9IHNlbGVjdG9yID09PSAnIycgPyBbXSA6IHNlbGVjdG9yXG4gICAgdmFyICRwYXJlbnQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgaWYgKCEkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgJHBhcmVudCA9ICR0aGlzLmNsb3Nlc3QoJy5hbGVydCcpXG4gICAgfVxuXG4gICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdjbG9zZS5icy5hbGVydCcpKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHBhcmVudC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudCgpIHtcbiAgICAgIC8vIGRldGFjaCBmcm9tIHBhcmVudCwgZmlyZSBldmVudCB0aGVuIGNsZWFuIHVwIGRhdGFcbiAgICAgICRwYXJlbnQuZGV0YWNoKCkudHJpZ2dlcignY2xvc2VkLmJzLmFsZXJ0JykucmVtb3ZlKClcbiAgICB9XG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkcGFyZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHBhcmVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCByZW1vdmVFbGVtZW50KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgcmVtb3ZlRWxlbWVudCgpXG4gIH1cblxuXG4gIC8vIEFMRVJUIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuYWxlcnQnKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JywgKGRhdGEgPSBuZXcgQWxlcnQodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hbGVydFxuXG4gICQuZm4uYWxlcnQgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hbGVydC5Db25zdHJ1Y3RvciA9IEFsZXJ0XG5cblxuICAvLyBBTEVSVCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWxlcnQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFsZXJ0ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUxFUlQgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuYWxlcnQuZGF0YS1hcGknLCBkaXNtaXNzLCBBbGVydC5wcm90b3R5cGUuY2xvc2UpXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGJ1dHRvbi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNidXR0b25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQlVUVE9OIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBCdXR0b24gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gJC5leHRlbmQoe30sIEJ1dHRvbi5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gIH1cblxuICBCdXR0b24uVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQnV0dG9uLkRFRkFVTFRTID0ge1xuICAgIGxvYWRpbmdUZXh0OiAnbG9hZGluZy4uLidcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgZCAgICA9ICdkaXNhYmxlZCdcbiAgICB2YXIgJGVsICA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgdmFsICA9ICRlbC5pcygnaW5wdXQnKSA/ICd2YWwnIDogJ2h0bWwnXG4gICAgdmFyIGRhdGEgPSAkZWwuZGF0YSgpXG5cbiAgICBzdGF0ZSArPSAnVGV4dCdcblxuICAgIGlmIChkYXRhLnJlc2V0VGV4dCA9PSBudWxsKSAkZWwuZGF0YSgncmVzZXRUZXh0JywgJGVsW3ZhbF0oKSlcblxuICAgIC8vIHB1c2ggdG8gZXZlbnQgbG9vcCB0byBhbGxvdyBmb3JtcyB0byBzdWJtaXRcbiAgICBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgJGVsW3ZhbF0oZGF0YVtzdGF0ZV0gPT0gbnVsbCA/IHRoaXMub3B0aW9uc1tzdGF0ZV0gOiBkYXRhW3N0YXRlXSlcblxuICAgICAgaWYgKHN0YXRlID09ICdsb2FkaW5nVGV4dCcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgICRlbC5hZGRDbGFzcyhkKS5hdHRyKGQsIGQpLnByb3AoZCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoZCkucmVtb3ZlQXR0cihkKS5wcm9wKGQsIGZhbHNlKVxuICAgICAgfVxuICAgIH0sIHRoaXMpLCAwKVxuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoYW5nZWQgPSB0cnVlXG4gICAgdmFyICRwYXJlbnQgPSB0aGlzLiRlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nKVxuXG4gICAgaWYgKCRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICB2YXIgJGlucHV0ID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbnB1dCcpXG4gICAgICBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAncmFkaW8nKSB7XG4gICAgICAgIGlmICgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgJHBhcmVudC5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2UgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xuICAgICAgICBpZiAoKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpICE9PSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgaWYgKGNoYW5nZWQpICRpbnB1dC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtcHJlc3NlZCcsICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG5cblxuICAvLyBCVVRUT04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYnV0dG9uJywgKGRhdGEgPSBuZXcgQnV0dG9uKHRoaXMsIG9wdGlvbnMpKSlcblxuICAgICAgaWYgKG9wdGlvbiA9PSAndG9nZ2xlJykgZGF0YS50b2dnbGUoKVxuICAgICAgZWxzZSBpZiAob3B0aW9uKSBkYXRhLnNldFN0YXRlKG9wdGlvbilcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYnV0dG9uXG5cbiAgJC5mbi5idXR0b24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5idXR0b24uQ29uc3RydWN0b3IgPSBCdXR0b25cblxuXG4gIC8vIEJVVFRPTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmJ1dHRvbi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYnV0dG9uID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQlVUVE9OIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJGJ0biA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKVxuICAgICAgUGx1Z2luLmNhbGwoJGJ0biwgJ3RvZ2dsZScpXG4gICAgICBpZiAoISgkKGUudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkpIHtcbiAgICAgICAgLy8gUHJldmVudCBkb3VibGUgY2xpY2sgb24gcmFkaW9zLCBhbmQgdGhlIGRvdWJsZSBzZWxlY3Rpb25zIChzbyBjYW5jZWxsYXRpb24pIG9uIGNoZWNrYm94ZXNcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIC8vIFRoZSB0YXJnZXQgY29tcG9uZW50IHN0aWxsIHJlY2VpdmUgdGhlIGZvY3VzXG4gICAgICAgIGlmICgkYnRuLmlzKCdpbnB1dCxidXR0b24nKSkgJGJ0bi50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIGVsc2UgJGJ0bi5maW5kKCdpbnB1dDp2aXNpYmxlLGJ1dHRvbjp2aXNpYmxlJykuZmlyc3QoKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9XG4gICAgfSlcbiAgICAub24oJ2ZvY3VzLmJzLmJ1dHRvbi5kYXRhLWFwaSBibHVyLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKS50b2dnbGVDbGFzcygnZm9jdXMnLCAvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpXG4gICAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY2Fyb3VzZWwuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY2Fyb3VzZWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDQVJPVVNFTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kaW5kaWNhdG9ycyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLmNhcm91c2VsLWluZGljYXRvcnMnKVxuICAgIHRoaXMub3B0aW9ucyAgICAgPSBvcHRpb25zXG4gICAgdGhpcy5wYXVzZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnNsaWRpbmcgICAgID0gbnVsbFxuICAgIHRoaXMuaW50ZXJ2YWwgICAgPSBudWxsXG4gICAgdGhpcy4kYWN0aXZlICAgICA9IG51bGxcbiAgICB0aGlzLiRpdGVtcyAgICAgID0gbnVsbFxuXG4gICAgdGhpcy5vcHRpb25zLmtleWJvYXJkICYmIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpXG5cbiAgICB0aGlzLm9wdGlvbnMucGF1c2UgPT0gJ2hvdmVyJyAmJiAhKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgJiYgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uKCdtb3VzZWVudGVyLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLnBhdXNlLCB0aGlzKSlcbiAgICAgIC5vbignbW91c2VsZWF2ZS5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5jeWNsZSwgdGhpcykpXG4gIH1cblxuICBDYXJvdXNlbC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gNjAwXG5cbiAgQ2Fyb3VzZWwuREVGQVVMVFMgPSB7XG4gICAgaW50ZXJ2YWw6IDUwMDAsXG4gICAgcGF1c2U6ICdob3ZlcicsXG4gICAgd3JhcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICgvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cbiAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgIGNhc2UgMzc6IHRoaXMucHJldigpOyBicmVha1xuICAgICAgY2FzZSAzOTogdGhpcy5uZXh0KCk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiByZXR1cm5cbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5jeWNsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSBmYWxzZSlcblxuICAgIHRoaXMuaW50ZXJ2YWwgJiYgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgdGhpcy5vcHRpb25zLmludGVydmFsXG4gICAgICAmJiAhdGhpcy5wYXVzZWRcbiAgICAgICYmICh0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoJC5wcm94eSh0aGlzLm5leHQsIHRoaXMpLCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwpKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtSW5kZXggPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHRoaXMuJGl0ZW1zID0gaXRlbS5wYXJlbnQoKS5jaGlsZHJlbignLml0ZW0nKVxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5pbmRleChpdGVtIHx8IHRoaXMuJGFjdGl2ZSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtRm9yRGlyZWN0aW9uID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYWN0aXZlKSB7XG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoYWN0aXZlKVxuICAgIHZhciB3aWxsV3JhcCA9IChkaXJlY3Rpb24gPT0gJ3ByZXYnICYmIGFjdGl2ZUluZGV4ID09PSAwKVxuICAgICAgICAgICAgICAgIHx8IChkaXJlY3Rpb24gPT0gJ25leHQnICYmIGFjdGl2ZUluZGV4ID09ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSlcbiAgICBpZiAod2lsbFdyYXAgJiYgIXRoaXMub3B0aW9ucy53cmFwKSByZXR1cm4gYWN0aXZlXG4gICAgdmFyIGRlbHRhID0gZGlyZWN0aW9uID09ICdwcmV2JyA/IC0xIDogMVxuICAgIHZhciBpdGVtSW5kZXggPSAoYWN0aXZlSW5kZXggKyBkZWx0YSkgJSB0aGlzLiRpdGVtcy5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuZXEoaXRlbUluZGV4KVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnRvID0gZnVuY3Rpb24gKHBvcykge1xuICAgIHZhciB0aGF0ICAgICAgICA9IHRoaXNcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleCh0aGlzLiRhY3RpdmUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpKVxuXG4gICAgaWYgKHBvcyA+ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSB8fCBwb3MgPCAwKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNsaWRpbmcpICAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50Lm9uZSgnc2xpZC5icy5jYXJvdXNlbCcsIGZ1bmN0aW9uICgpIHsgdGhhdC50byhwb3MpIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoYWN0aXZlSW5kZXggPT0gcG9zKSByZXR1cm4gdGhpcy5wYXVzZSgpLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzLnNsaWRlKHBvcyA+IGFjdGl2ZUluZGV4ID8gJ25leHQnIDogJ3ByZXYnLCB0aGlzLiRpdGVtcy5lcShwb3MpKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IHRydWUpXG5cbiAgICBpZiAodGhpcy4kZWxlbWVudC5maW5kKCcubmV4dCwgLnByZXYnKS5sZW5ndGggJiYgJC5zdXBwb3J0LnRyYW5zaXRpb24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpXG4gICAgICB0aGlzLmN5Y2xlKHRydWUpXG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnZhbCA9IGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5zbGlkZSgnbmV4dCcpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5zbGlkZSgncHJldicpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuc2xpZGUgPSBmdW5jdGlvbiAodHlwZSwgbmV4dCkge1xuICAgIHZhciAkYWN0aXZlICAgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpXG4gICAgdmFyICRuZXh0ICAgICA9IG5leHQgfHwgdGhpcy5nZXRJdGVtRm9yRGlyZWN0aW9uKHR5cGUsICRhY3RpdmUpXG4gICAgdmFyIGlzQ3ljbGluZyA9IHRoaXMuaW50ZXJ2YWxcbiAgICB2YXIgZGlyZWN0aW9uID0gdHlwZSA9PSAnbmV4dCcgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgdmFyIHRoYXQgICAgICA9IHRoaXNcblxuICAgIGlmICgkbmV4dC5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVybiAodGhpcy5zbGlkaW5nID0gZmFsc2UpXG5cbiAgICB2YXIgcmVsYXRlZFRhcmdldCA9ICRuZXh0WzBdXG4gICAgdmFyIHNsaWRlRXZlbnQgPSAkLkV2ZW50KCdzbGlkZS5icy5jYXJvdXNlbCcsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsXG4gICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxuICAgIH0pXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRlRXZlbnQpXG4gICAgaWYgKHNsaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5zbGlkaW5nID0gdHJ1ZVxuXG4gICAgaXNDeWNsaW5nICYmIHRoaXMucGF1c2UoKVxuXG4gICAgaWYgKHRoaXMuJGluZGljYXRvcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLiRpbmRpY2F0b3JzLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgIHZhciAkbmV4dEluZGljYXRvciA9ICQodGhpcy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoaXMuZ2V0SXRlbUluZGV4KCRuZXh0KV0pXG4gICAgICAkbmV4dEluZGljYXRvciAmJiAkbmV4dEluZGljYXRvci5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgICB2YXIgc2xpZEV2ZW50ID0gJC5FdmVudCgnc2xpZC5icy5jYXJvdXNlbCcsIHsgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCwgZGlyZWN0aW9uOiBkaXJlY3Rpb24gfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmICgkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdzbGlkZScpKSB7XG4gICAgICAkbmV4dC5hZGRDbGFzcyh0eXBlKVxuICAgICAgaWYgKHR5cGVvZiAkbmV4dCA9PT0gJ29iamVjdCcgJiYgJG5leHQubGVuZ3RoKSB7XG4gICAgICAgICRuZXh0WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuICAgICAgJGFjdGl2ZS5hZGRDbGFzcyhkaXJlY3Rpb24pXG4gICAgICAkbmV4dC5hZGRDbGFzcyhkaXJlY3Rpb24pXG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbmV4dC5yZW1vdmVDbGFzcyhbdHlwZSwgZGlyZWN0aW9uXS5qb2luKCcgJykpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoWydhY3RpdmUnLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSlcbiAgICAgICAgICB0aGF0LnNsaWRpbmcgPSBmYWxzZVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcbiAgICAgICAgICB9LCAwKVxuICAgICAgICB9KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICB9IGVsc2Uge1xuICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgdGhpcy5zbGlkaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgfVxuXG4gICAgaXNDeWNsaW5nICYmIHRoaXMuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ0FST1VTRUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ2Fyb3VzZWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG4gICAgICB2YXIgYWN0aW9uICA9IHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgPyBvcHRpb24gOiBvcHRpb25zLnNsaWRlXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnLCAoZGF0YSA9IG5ldyBDYXJvdXNlbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnbnVtYmVyJykgZGF0YS50byhvcHRpb24pXG4gICAgICBlbHNlIGlmIChhY3Rpb24pIGRhdGFbYWN0aW9uXSgpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLmludGVydmFsKSBkYXRhLnBhdXNlKCkuY3ljbGUoKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jYXJvdXNlbFxuXG4gICQuZm4uY2Fyb3VzZWwgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jYXJvdXNlbC5Db25zdHJ1Y3RvciA9IENhcm91c2VsXG5cblxuICAvLyBDQVJPVVNFTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY2Fyb3VzZWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNhcm91c2VsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ0FST1VTRUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICB2YXIgaHJlZiAgICA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIGlmIChocmVmKSB7XG4gICAgICBocmVmID0gaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciB0YXJnZXQgID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCBocmVmXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcblxuICAgIGlmICghJHRhcmdldC5oYXNDbGFzcygnY2Fyb3VzZWwnKSkgcmV0dXJuXG5cbiAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuICAgIHZhciBzbGlkZUluZGV4ID0gJHRoaXMuYXR0cignZGF0YS1zbGlkZS10bycpXG4gICAgaWYgKHNsaWRlSW5kZXgpIG9wdGlvbnMuaW50ZXJ2YWwgPSBmYWxzZVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9ucylcblxuICAgIGlmIChzbGlkZUluZGV4KSB7XG4gICAgICAkdGFyZ2V0LmRhdGEoJ2JzLmNhcm91c2VsJykudG8oc2xpZGVJbmRleClcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZV0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZS10b10nLCBjbGlja0hhbmRsZXIpXG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRjYXJvdXNlbCA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRjYXJvdXNlbCwgJGNhcm91c2VsLmRhdGEoKSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBjb2xsYXBzZS5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjb2xsYXBzZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoganNoaW50IGxhdGVkZWY6IGZhbHNlICovXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ09MTEFQU0UgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQ29sbGFwc2UgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy4kdHJpZ2dlciAgICAgID0gJCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnICsgZWxlbWVudC5pZCArICdcIl0sJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdJylcbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSBudWxsXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnBhcmVudCkge1xuICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLiRlbGVtZW50LCB0aGlzLiR0cmlnZ2VyKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMudG9nZ2xlKSB0aGlzLnRvZ2dsZSgpXG4gIH1cblxuICBDb2xsYXBzZS5WRVJTSU9OICA9ICczLjQuMSdcblxuICBDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzUwXG5cbiAgQ29sbGFwc2UuREVGQVVMVFMgPSB7XG4gICAgdG9nZ2xlOiB0cnVlXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZGltZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNXaWR0aCA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3dpZHRoJylcbiAgICByZXR1cm4gaGFzV2lkdGggPyAnd2lkdGgnIDogJ2hlaWdodCdcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmcgfHwgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgYWN0aXZlc0RhdGFcbiAgICB2YXIgYWN0aXZlcyA9IHRoaXMuJHBhcmVudCAmJiB0aGlzLiRwYXJlbnQuY2hpbGRyZW4oJy5wYW5lbCcpLmNoaWxkcmVuKCcuaW4sIC5jb2xsYXBzaW5nJylcblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBhY3RpdmVzRGF0YSA9IGFjdGl2ZXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgaWYgKGFjdGl2ZXNEYXRhICYmIGFjdGl2ZXNEYXRhLnRyYW5zaXRpb25pbmcpIHJldHVyblxuICAgIH1cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnc2hvdy5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIFBsdWdpbi5jYWxsKGFjdGl2ZXMsICdoaWRlJylcbiAgICAgIGFjdGl2ZXNEYXRhIHx8IGFjdGl2ZXMuZGF0YSgnYnMuY29sbGFwc2UnLCBudWxsKVxuICAgIH1cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpW2RpbWVuc2lvbl0oMClcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZSBpbicpW2RpbWVuc2lvbl0oJycpXG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC50cmlnZ2VyKCdzaG93bi5icy5jb2xsYXBzZScpXG4gICAgfVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcblxuICAgIHZhciBzY3JvbGxTaXplID0gJC5jYW1lbENhc2UoWydzY3JvbGwnLCBkaW1lbnNpb25dLmpvaW4oJy0nKSlcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pW2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFswXVtzY3JvbGxTaXplXSlcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmcgfHwgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSgpKVswXS5vZmZzZXRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlIGluJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy5jb2xsYXBzZScpXG4gICAgfVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIFtkaW1lbnNpb25dKDApXG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzW3RoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykgPyAnaGlkZScgOiAnc2hvdyddKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5nZXRQYXJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnBhcmVudClcbiAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicgKyB0aGlzLm9wdGlvbnMucGFyZW50ICsgJ1wiXScpXG4gICAgICAuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJGVsZW1lbnQpLCAkZWxlbWVudClcbiAgICAgIH0sIHRoaXMpKVxuICAgICAgLmVuZCgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzID0gZnVuY3Rpb24gKCRlbGVtZW50LCAkdHJpZ2dlcikge1xuICAgIHZhciBpc09wZW4gPSAkZWxlbWVudC5oYXNDbGFzcygnaW4nKVxuXG4gICAgJGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgICAkdHJpZ2dlclxuICAgICAgLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnLCAhaXNPcGVuKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdHJpZ2dlcikge1xuICAgIHZhciBocmVmXG4gICAgdmFyIHRhcmdldCA9ICR0cmlnZ2VyLmF0dHIoJ2RhdGEtdGFyZ2V0JylcbiAgICAgIHx8IChocmVmID0gJHRyaWdnZXIuYXR0cignaHJlZicpKSAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEgJiYgb3B0aW9ucy50b2dnbGUgJiYgL3Nob3d8aGlkZS8udGVzdChvcHRpb24pKSBvcHRpb25zLnRvZ2dsZSA9IGZhbHNlXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNvbGxhcHNlJywgKGRhdGEgPSBuZXcgQ29sbGFwc2UodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmNvbGxhcHNlXG5cbiAgJC5mbi5jb2xsYXBzZSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmNvbGxhcHNlLkNvbnN0cnVjdG9yID0gQ29sbGFwc2VcblxuXG4gIC8vIENPTExBUFNFIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5jb2xsYXBzZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY29sbGFwc2UgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDT0xMQVBTRSBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5jb2xsYXBzZS5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG5cbiAgICBpZiAoISR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgdmFyICR0YXJnZXQgPSBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdGhpcylcbiAgICB2YXIgZGF0YSAgICA9ICR0YXJnZXQuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgIHZhciBvcHRpb24gID0gZGF0YSA/ICd0b2dnbGUnIDogJHRoaXMuZGF0YSgpXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGRyb3Bkb3duLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Ryb3Bkb3duc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIERST1BET1dOIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBiYWNrZHJvcCA9ICcuZHJvcGRvd24tYmFja2Ryb3AnXG4gIHZhciB0b2dnbGUgICA9ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXSdcbiAgdmFyIERyb3Bkb3duID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAkKGVsZW1lbnQpLm9uKCdjbGljay5icy5kcm9wZG93bicsIHRoaXMudG9nZ2xlKVxuICB9XG5cbiAgRHJvcGRvd24uVkVSU0lPTiA9ICczLjQuMSdcblxuICBmdW5jdGlvbiBnZXRQYXJlbnQoJHRoaXMpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiAvI1tBLVphLXpdLy50ZXN0KHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciAkcGFyZW50ID0gc2VsZWN0b3IgIT09ICcjJyA/ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpIDogbnVsbFxuXG4gICAgcmV0dXJuICRwYXJlbnQgJiYgJHBhcmVudC5sZW5ndGggPyAkcGFyZW50IDogJHRoaXMucGFyZW50KClcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyTWVudXMoZSkge1xuICAgIGlmIChlICYmIGUud2hpY2ggPT09IDMpIHJldHVyblxuICAgICQoYmFja2Ryb3ApLnJlbW92ZSgpXG4gICAgJCh0b2dnbGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgICAgICAgPSAkKHRoaXMpXG4gICAgICB2YXIgJHBhcmVudCAgICAgICA9IGdldFBhcmVudCgkdGhpcylcbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cblxuICAgICAgaWYgKCEkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJykpIHJldHVyblxuXG4gICAgICBpZiAoZSAmJiBlLnR5cGUgPT0gJ2NsaWNrJyAmJiAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpICYmICQuY29udGFpbnMoJHBhcmVudFswXSwgZS50YXJnZXQpKSByZXR1cm5cblxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdoaWRlLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgJHRoaXMuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXG4gICAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdvcGVuJykudHJpZ2dlcigkLkV2ZW50KCdoaWRkZW4uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9KVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgIGNsZWFyTWVudXMoKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAhJHBhcmVudC5jbG9zZXN0KCcubmF2YmFyLW5hdicpLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiBtb2JpbGUgd2UgdXNlIGEgYmFja2Ryb3AgYmVjYXVzZSBjbGljayBldmVudHMgZG9uJ3QgZGVsZWdhdGVcbiAgICAgICAgJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2Ryb3Bkb3duLWJhY2tkcm9wJylcbiAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoJCh0aGlzKSlcbiAgICAgICAgICAub24oJ2NsaWNrJywgY2xlYXJNZW51cylcbiAgICAgIH1cblxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdzaG93LmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgJHRoaXNcbiAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpXG5cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLnRvZ2dsZUNsYXNzKCdvcGVuJylcbiAgICAgICAgLnRyaWdnZXIoJC5FdmVudCgnc2hvd24uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIS8oMzh8NDB8Mjd8MzIpLy50ZXN0KGUud2hpY2gpIHx8IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgIGlmICghaXNBY3RpdmUgJiYgZS53aGljaCAhPSAyNyB8fCBpc0FjdGl2ZSAmJiBlLndoaWNoID09IDI3KSB7XG4gICAgICBpZiAoZS53aGljaCA9PSAyNykgJHBhcmVudC5maW5kKHRvZ2dsZSkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgcmV0dXJuICR0aGlzLnRyaWdnZXIoJ2NsaWNrJylcbiAgICB9XG5cbiAgICB2YXIgZGVzYyA9ICcgbGk6bm90KC5kaXNhYmxlZCk6dmlzaWJsZSBhJ1xuICAgIHZhciAkaXRlbXMgPSAkcGFyZW50LmZpbmQoJy5kcm9wZG93bi1tZW51JyArIGRlc2MpXG5cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHJldHVyblxuXG4gICAgdmFyIGluZGV4ID0gJGl0ZW1zLmluZGV4KGUudGFyZ2V0KVxuXG4gICAgaWYgKGUud2hpY2ggPT0gMzggJiYgaW5kZXggPiAwKSAgICAgICAgICAgICAgICAgaW5kZXgtLSAgICAgICAgIC8vIHVwXG4gICAgaWYgKGUud2hpY2ggPT0gNDAgJiYgaW5kZXggPCAkaXRlbXMubGVuZ3RoIC0gMSkgaW5kZXgrKyAgICAgICAgIC8vIGRvd25cbiAgICBpZiAoIX5pbmRleCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDBcblxuICAgICRpdGVtcy5lcShpbmRleCkudHJpZ2dlcignZm9jdXMnKVxuICB9XG5cblxuICAvLyBEUk9QRE9XTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicsIChkYXRhID0gbmV3IERyb3Bkb3duKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uZHJvcGRvd25cblxuICAkLmZuLmRyb3Bkb3duICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IgPSBEcm9wZG93blxuXG5cbiAgLy8gRFJPUERPV04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmRyb3Bkb3duLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5kcm9wZG93biA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFQUExZIFRPIFNUQU5EQVJEIERST1BET1dOIEVMRU1FTlRTXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgY2xlYXJNZW51cylcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93biBmb3JtJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUpXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duLW1lbnUnLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogbW9kYWwuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jbW9kYWxzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gTU9EQUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIE1vZGFsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy4kYm9keSA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGRpYWxvZyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLm1vZGFsLWRpYWxvZycpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gICAgdGhpcy5pc1Nob3duID0gbnVsbFxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAwXG4gICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICB0aGlzLmZpeGVkQ29udGVudCA9ICcubmF2YmFyLWZpeGVkLXRvcCwgLm5hdmJhci1maXhlZC1ib3R0b20nXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW90ZSkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAuZmluZCgnLm1vZGFsLWNvbnRlbnQnKVxuICAgICAgICAubG9hZCh0aGlzLm9wdGlvbnMucmVtb3RlLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2xvYWRlZC5icy5tb2RhbCcpXG4gICAgICAgIH0sIHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDMwMFxuICBNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgTW9kYWwuREVGQVVMVFMgPSB7XG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgc2hvdzogdHJ1ZVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmlzU2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAodGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gdHJ1ZVxuXG4gICAgdGhpcy5jaGVja1Njcm9sbGJhcigpXG4gICAgdGhpcy5zZXRTY3JvbGxiYXIoKVxuICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9uKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub25lKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhhdC4kZWxlbWVudCkpIHRoYXQuaWdub3JlQmFja2Ryb3BDbGljayA9IHRydWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRyYW5zaXRpb24gPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGF0LiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJylcblxuICAgICAgaWYgKCF0aGF0LiRlbGVtZW50LnBhcmVudCgpLmxlbmd0aCkge1xuICAgICAgICB0aGF0LiRlbGVtZW50LmFwcGVuZFRvKHRoYXQuJGJvZHkpIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgIC5zaG93KClcbiAgICAgICAgLnNjcm9sbFRvcCgwKVxuXG4gICAgICB0aGF0LmFkanVzdERpYWxvZygpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgdGhhdC5lbmZvcmNlRm9jdXMoKVxuXG4gICAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3duLmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgICB0cmFuc2l0aW9uID9cbiAgICAgICAgdGhhdC4kZGlhbG9nIC8vIHdhaXQgZm9yIG1vZGFsIHRvIHNsaWRlIGluXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBlID0gJC5FdmVudCgnaGlkZS5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICghdGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gZmFsc2VcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICAkKGRvY3VtZW50KS5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdpbicpXG4gICAgICAub2ZmKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICAgIC5vZmYoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRkaWFsb2cub2ZmKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KHRoaXMuaGlkZU1vZGFsLCB0aGlzKSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHRoaXMuaGlkZU1vZGFsKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lbmZvcmNlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudClcbiAgICAgIC5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKSAvLyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGZvY3VzIGxvb3BcbiAgICAgIC5vbignZm9jdXNpbi5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50ICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgIHRoaXMuJGVsZW1lbnRbMF0gIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgIXRoaXMuJGVsZW1lbnQuaGFzKGUudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcykpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZXNjYXBlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUud2hpY2ggPT0gMjcgJiYgdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93bikge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duKSB7XG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5icy5tb2RhbCcsICQucHJveHkodGhpcy5oYW5kbGVVcGRhdGUsIHRoaXMpKVxuICAgIH0gZWxzZSB7XG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdGhpcy4kZWxlbWVudC5oaWRlKClcbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGJvZHkucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKVxuICAgICAgdGhhdC5yZXNldEFkanVzdG1lbnRzKClcbiAgICAgIHRoYXQucmVzZXRTY3JvbGxiYXIoKVxuICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRkZW4uYnMubW9kYWwnKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVtb3ZlQmFja2Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYmFja2Ryb3AgJiYgdGhpcy4kYmFja2Ryb3AucmVtb3ZlKClcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5iYWNrZHJvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBhbmltYXRlID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID8gJ2ZhZGUnIDogJydcblxuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmJhY2tkcm9wKSB7XG4gICAgICB2YXIgZG9BbmltYXRlID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgYW5pbWF0ZVxuXG4gICAgICB0aGlzLiRiYWNrZHJvcCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgIC5hZGRDbGFzcygnbW9kYWwtYmFja2Ryb3AgJyArIGFuaW1hdGUpXG4gICAgICAgIC5hcHBlbmRUbyh0aGlzLiRib2R5KVxuXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrKSB7XG4gICAgICAgICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkgcmV0dXJuXG4gICAgICAgIHRoaXMub3B0aW9ucy5iYWNrZHJvcCA9PSAnc3RhdGljJ1xuICAgICAgICAgID8gdGhpcy4kZWxlbWVudFswXS5mb2N1cygpXG4gICAgICAgICAgOiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG5cbiAgICAgIGlmIChkb0FuaW1hdGUpIHRoaXMuJGJhY2tkcm9wWzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuXG4gICAgICB0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm5cblxuICAgICAgZG9BbmltYXRlID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFjaylcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFjaygpXG5cbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24gJiYgdGhpcy4kYmFja2Ryb3ApIHtcbiAgICAgIHRoaXMuJGJhY2tkcm9wLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAgIHZhciBjYWxsYmFja1JlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2tSZW1vdmUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2tSZW1vdmUoKVxuXG4gICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZXNlIGZvbGxvd2luZyBtZXRob2RzIGFyZSB1c2VkIHRvIGhhbmRsZSBvdmVyZmxvd2luZyBtb2RhbHNcblxuICBNb2RhbC5wcm90b3R5cGUuaGFuZGxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWRqdXN0RGlhbG9nKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5hZGp1c3REaWFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGFsSXNPdmVyZmxvd2luZyA9IHRoaXMuJGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICF0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmIG1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiAhbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldEFkanVzdG1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmNoZWNrU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGlmICghZnVsbFdpbmRvd1dpZHRoKSB7IC8vIHdvcmthcm91bmQgZm9yIG1pc3Npbmcgd2luZG93LmlubmVyV2lkdGggaW4gSUU4XG4gICAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgZnVsbFdpbmRvd1dpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdClcbiAgICB9XG4gICAgdGhpcy5ib2R5SXNPdmVyZmxvd2luZyA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2luZG93V2lkdGhcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5tZWFzdXJlU2Nyb2xsYmFyKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJvZHlQYWQgPSBwYXJzZUludCgodGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnKSB8fCAwKSwgMTApXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAnJ1xuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGhcbiAgICBpZiAodGhpcy5ib2R5SXNPdmVyZmxvd2luZykge1xuICAgICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCBib2R5UGFkICsgc2Nyb2xsYmFyV2lkdGgpXG4gICAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYWN0dWFsUGFkZGluZyA9IGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0XG4gICAgICAgIHZhciBjYWxjdWxhdGVkUGFkZGluZyA9ICQoZWxlbWVudCkuY3NzKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgICAgJChlbGVtZW50KVxuICAgICAgICAgIC5kYXRhKCdwYWRkaW5nLXJpZ2h0JywgYWN0dWFsUGFkZGluZylcbiAgICAgICAgICAuY3NzKCdwYWRkaW5nLXJpZ2h0JywgcGFyc2VGbG9hdChjYWxjdWxhdGVkUGFkZGluZykgKyBzY3JvbGxiYXJXaWR0aCArICdweCcpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIHRoaXMub3JpZ2luYWxCb2R5UGFkKVxuICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICB2YXIgcGFkZGluZyA9ICQoZWxlbWVudCkuZGF0YSgncGFkZGluZy1yaWdodCcpXG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZURhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nID8gcGFkZGluZyA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5tZWFzdXJlU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkgeyAvLyB0aHggd2Fsc2hcbiAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJ1xuICAgIHRoaXMuJGJvZHkuYXBwZW5kKHNjcm9sbERpdilcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGhcbiAgICB0aGlzLiRib2R5WzBdLnJlbW92ZUNoaWxkKHNjcm9sbERpdilcbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGhcbiAgfVxuXG5cbiAgLy8gTU9EQUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uLCBfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdicy5tb2RhbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNb2RhbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5tb2RhbCcsIChkYXRhID0gbmV3IE1vZGFsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oX3JlbGF0ZWRUYXJnZXQpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLnNob3cpIGRhdGEuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ubW9kYWxcblxuICAkLmZuLm1vZGFsID0gUGx1Z2luXG4gICQuZm4ubW9kYWwuQ29uc3RydWN0b3IgPSBNb2RhbFxuXG5cbiAgLy8gTU9EQUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLm1vZGFsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5tb2RhbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIE1PREFMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLm1vZGFsLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICB2YXIgdGFyZ2V0ID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fFxuICAgICAgKGhyZWYgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG4gICAgdmFyIG9wdGlvbiA9ICR0YXJnZXQuZGF0YSgnYnMubW9kYWwnKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoeyByZW1vdGU6ICEvIy8udGVzdChocmVmKSAmJiBocmVmIH0sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG5cbiAgICBpZiAoJHRoaXMuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAkdGFyZ2V0Lm9uZSgnc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChzaG93RXZlbnQpIHtcbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVybiAvLyBvbmx5IHJlZ2lzdGVyIGZvY3VzIHJlc3RvcmVyIGlmIG1vZGFsIHdpbGwgYWN0dWFsbHkgZ2V0IHNob3duXG4gICAgICAkdGFyZ2V0Lm9uZSgnaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkdGhpcy5pcygnOnZpc2libGUnKSAmJiAkdGhpcy50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9KVxuICAgIH0pXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uLCB0aGlzKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0b29sdGlwLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Rvb2x0aXBcbiAqIEluc3BpcmVkIGJ5IHRoZSBvcmlnaW5hbCBqUXVlcnkudGlwc3kgYnkgSmFzb24gRnJhbWVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIERJU0FMTE9XRURfQVRUUklCVVRFUyA9IFsnc2FuaXRpemUnLCAnd2hpdGVMaXN0JywgJ3Nhbml0aXplRm4nXVxuXG4gIHZhciB1cmlBdHRycyA9IFtcbiAgICAnYmFja2dyb3VuZCcsXG4gICAgJ2NpdGUnLFxuICAgICdocmVmJyxcbiAgICAnaXRlbXR5cGUnLFxuICAgICdsb25nZGVzYycsXG4gICAgJ3Bvc3RlcicsXG4gICAgJ3NyYycsXG4gICAgJ3hsaW5rOmhyZWYnXG4gIF1cblxuICB2YXIgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiA9IC9eYXJpYS1bXFx3LV0qJC9pXG5cbiAgdmFyIERlZmF1bHRXaGl0ZWxpc3QgPSB7XG4gICAgLy8gR2xvYmFsIGF0dHJpYnV0ZXMgYWxsb3dlZCBvbiBhbnkgc3VwcGxpZWQgZWxlbWVudCBiZWxvdy5cbiAgICAnKic6IFsnY2xhc3MnLCAnZGlyJywgJ2lkJywgJ2xhbmcnLCAncm9sZScsIEFSSUFfQVRUUklCVVRFX1BBVFRFUk5dLFxuICAgIGE6IFsndGFyZ2V0JywgJ2hyZWYnLCAndGl0bGUnLCAncmVsJ10sXG4gICAgYXJlYTogW10sXG4gICAgYjogW10sXG4gICAgYnI6IFtdLFxuICAgIGNvbDogW10sXG4gICAgY29kZTogW10sXG4gICAgZGl2OiBbXSxcbiAgICBlbTogW10sXG4gICAgaHI6IFtdLFxuICAgIGgxOiBbXSxcbiAgICBoMjogW10sXG4gICAgaDM6IFtdLFxuICAgIGg0OiBbXSxcbiAgICBoNTogW10sXG4gICAgaDY6IFtdLFxuICAgIGk6IFtdLFxuICAgIGltZzogWydzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3dpZHRoJywgJ2hlaWdodCddLFxuICAgIGxpOiBbXSxcbiAgICBvbDogW10sXG4gICAgcDogW10sXG4gICAgcHJlOiBbXSxcbiAgICBzOiBbXSxcbiAgICBzbWFsbDogW10sXG4gICAgc3BhbjogW10sXG4gICAgc3ViOiBbXSxcbiAgICBzdXA6IFtdLFxuICAgIHN0cm9uZzogW10sXG4gICAgdTogW10sXG4gICAgdWw6IFtdXG4gIH1cblxuICAvKipcbiAgICogQSBwYXR0ZXJuIHRoYXQgcmVjb2duaXplcyBhIGNvbW1vbmx5IHVzZWZ1bCBzdWJzZXQgb2YgVVJMcyB0aGF0IGFyZSBzYWZlLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgU0FGRV9VUkxfUEFUVEVSTiA9IC9eKD86KD86aHR0cHM/fG1haWx0b3xmdHB8dGVsfGZpbGUpOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvZ2lcblxuICAvKipcbiAgICogQSBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBzYWZlIGRhdGEgVVJMcy4gT25seSBtYXRjaGVzIGltYWdlLCB2aWRlbyBhbmQgYXVkaW8gdHlwZXMuXG4gICAqXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcbiAgICovXG4gIHZhciBEQVRBX1VSTF9QQVRURVJOID0gL15kYXRhOig/OmltYWdlXFwvKD86Ym1wfGdpZnxqcGVnfGpwZ3xwbmd8dGlmZnx3ZWJwKXx2aWRlb1xcLyg/Om1wZWd8bXA0fG9nZ3x3ZWJtKXxhdWRpb1xcLyg/Om1wM3xvZ2F8b2dnfG9wdXMpKTtiYXNlNjQsW2EtejAtOSsvXSs9KiQvaVxuXG4gIGZ1bmN0aW9uIGFsbG93ZWRBdHRyaWJ1dGUoYXR0ciwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpIHtcbiAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSAhPT0gLTEpIHtcbiAgICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIHVyaUF0dHJzKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oYXR0ci5ub2RlVmFsdWUubWF0Y2goU0FGRV9VUkxfUEFUVEVSTikgfHwgYXR0ci5ub2RlVmFsdWUubWF0Y2goREFUQV9VUkxfUEFUVEVSTikpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgdmFyIHJlZ0V4cCA9ICQoYWxsb3dlZEF0dHJpYnV0ZUxpc3QpLmZpbHRlcihmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICB9KVxuXG4gICAgLy8gQ2hlY2sgaWYgYSByZWd1bGFyIGV4cHJlc3Npb24gdmFsaWRhdGVzIHRoZSBhdHRyaWJ1dGUuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWdFeHAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoYXR0ck5hbWUubWF0Y2gocmVnRXhwW2ldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHdoaXRlTGlzdCwgc2FuaXRpemVGbikge1xuICAgIGlmICh1bnNhZmVIdG1sLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgICB9XG5cbiAgICBpZiAoc2FuaXRpemVGbiAmJiB0eXBlb2Ygc2FuaXRpemVGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHNhbml0aXplRm4odW5zYWZlSHRtbClcbiAgICB9XG5cbiAgICAvLyBJRSA4IGFuZCBiZWxvdyBkb24ndCBzdXBwb3J0IGNyZWF0ZUhUTUxEb2N1bWVudFxuICAgIGlmICghZG9jdW1lbnQuaW1wbGVtZW50YXRpb24gfHwgIWRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgICB9XG5cbiAgICB2YXIgY3JlYXRlZERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdzYW5pdGl6YXRpb24nKVxuICAgIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IHVuc2FmZUh0bWxcblxuICAgIHZhciB3aGl0ZWxpc3RLZXlzID0gJC5tYXAod2hpdGVMaXN0LCBmdW5jdGlvbiAoZWwsIGkpIHsgcmV0dXJuIGkgfSlcbiAgICB2YXIgZWxlbWVudHMgPSAkKGNyZWF0ZWREb2N1bWVudC5ib2R5KS5maW5kKCcqJylcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGVsID0gZWxlbWVudHNbaV1cbiAgICAgIHZhciBlbE5hbWUgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgIGlmICgkLmluQXJyYXkoZWxOYW1lLCB3aGl0ZWxpc3RLZXlzKSA9PT0gLTEpIHtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB2YXIgYXR0cmlidXRlTGlzdCA9ICQubWFwKGVsLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gZWwgfSlcbiAgICAgIHZhciB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMgPSBbXS5jb25jYXQod2hpdGVMaXN0WycqJ10gfHwgW10sIHdoaXRlTGlzdFtlbE5hbWVdIHx8IFtdKVxuXG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuMiA9IGF0dHJpYnV0ZUxpc3QubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XG4gICAgICAgIGlmICghYWxsb3dlZEF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLCB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0ubm9kZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MXG4gIH1cblxuICAvLyBUT09MVElQIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy50eXBlICAgICAgID0gbnVsbFxuICAgIHRoaXMub3B0aW9ucyAgICA9IG51bGxcbiAgICB0aGlzLmVuYWJsZWQgICAgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ICAgID0gbnVsbFxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcbiAgICB0aGlzLiRlbGVtZW50ICAgPSBudWxsXG4gICAgdGhpcy5pblN0YXRlICAgID0gbnVsbFxuXG4gICAgdGhpcy5pbml0KCd0b29sdGlwJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIFRvb2x0aXAuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVG9vbHRpcC5ERUZBVUxUUyA9IHtcbiAgICBhbmltYXRpb246IHRydWUsXG4gICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICBzZWxlY3RvcjogZmFsc2UsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsXG4gICAgdHJpZ2dlcjogJ2hvdmVyIGZvY3VzJyxcbiAgICB0aXRsZTogJycsXG4gICAgZGVsYXk6IDAsXG4gICAgaHRtbDogZmFsc2UsXG4gICAgY29udGFpbmVyOiBmYWxzZSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgc2VsZWN0b3I6ICdib2R5JyxcbiAgICAgIHBhZGRpbmc6IDBcbiAgICB9LFxuICAgIHNhbml0aXplIDogdHJ1ZSxcbiAgICBzYW5pdGl6ZUZuIDogbnVsbCxcbiAgICB3aGl0ZUxpc3QgOiBEZWZhdWx0V2hpdGVsaXN0XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVuYWJsZWQgICA9IHRydWVcbiAgICB0aGlzLnR5cGUgICAgICA9IHR5cGVcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9IHRoaXMuZ2V0T3B0aW9ucyhvcHRpb25zKVxuICAgIHRoaXMuJHZpZXdwb3J0ID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmICQoZG9jdW1lbnQpLmZpbmQoJC5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy52aWV3cG9ydCkgPyB0aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLCB0aGlzLiRlbGVtZW50KSA6ICh0aGlzLm9wdGlvbnMudmlld3BvcnQuc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLnZpZXdwb3J0KSlcbiAgICB0aGlzLmluU3RhdGUgICA9IHsgY2xpY2s6IGZhbHNlLCBob3ZlcjogZmFsc2UsIGZvY3VzOiBmYWxzZSB9XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXSBpbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yICYmICF0aGlzLm9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlbGVjdG9yYCBvcHRpb24gbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgJyArIHRoaXMudHlwZSArICcgb24gdGhlIHdpbmRvdy5kb2N1bWVudCBvYmplY3QhJylcbiAgICB9XG5cbiAgICB2YXIgdHJpZ2dlcnMgPSB0aGlzLm9wdGlvbnMudHJpZ2dlci5zcGxpdCgnICcpXG5cbiAgICBmb3IgKHZhciBpID0gdHJpZ2dlcnMubGVuZ3RoOyBpLS07KSB7XG4gICAgICB2YXIgdHJpZ2dlciA9IHRyaWdnZXJzW2ldXG5cbiAgICAgIGlmICh0cmlnZ2VyID09ICdjbGljaycpIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMudG9nZ2xlLCB0aGlzKSlcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciAhPSAnbWFudWFsJykge1xuICAgICAgICB2YXIgZXZlbnRJbiAgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VlbnRlcicgOiAnZm9jdXNpbidcbiAgICAgICAgdmFyIGV2ZW50T3V0ID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlbGVhdmUnIDogJ2ZvY3Vzb3V0J1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRJbiAgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmVudGVyLCB0aGlzKSlcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudE91dCArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMubGVhdmUsIHRoaXMpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5zZWxlY3RvciA/XG4gICAgICAodGhpcy5fb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHsgdHJpZ2dlcjogJ21hbnVhbCcsIHNlbGVjdG9yOiAnJyB9KSkgOlxuICAgICAgdGhpcy5maXhUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gVG9vbHRpcC5ERUZBVUxUU1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGRhdGFBdHRyaWJ1dGVzID0gdGhpcy4kZWxlbWVudC5kYXRhKClcblxuICAgIGZvciAodmFyIGRhdGFBdHRyIGluIGRhdGFBdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoZGF0YUF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoZGF0YUF0dHIpICYmICQuaW5BcnJheShkYXRhQXR0ciwgRElTQUxMT1dFRF9BVFRSSUJVVEVTKSAhPT0gLTEpIHtcbiAgICAgICAgZGVsZXRlIGRhdGFBdHRyaWJ1dGVzW2RhdGFBdHRyXVxuICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBkYXRhQXR0cmlidXRlcywgb3B0aW9ucylcblxuICAgIGlmIChvcHRpb25zLmRlbGF5ICYmIHR5cGVvZiBvcHRpb25zLmRlbGF5ID09ICdudW1iZXInKSB7XG4gICAgICBvcHRpb25zLmRlbGF5ID0ge1xuICAgICAgICBzaG93OiBvcHRpb25zLmRlbGF5LFxuICAgICAgICBoaWRlOiBvcHRpb25zLmRlbGF5XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBzYW5pdGl6ZUh0bWwob3B0aW9ucy50ZW1wbGF0ZSwgb3B0aW9ucy53aGl0ZUxpc3QsIG9wdGlvbnMuc2FuaXRpemVGbilcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVsZWdhdGVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zICA9IHt9XG4gICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0cygpXG5cbiAgICB0aGlzLl9vcHRpb25zICYmICQuZWFjaCh0aGlzLl9vcHRpb25zLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKGRlZmF1bHRzW2tleV0gIT0gdmFsdWUpIG9wdGlvbnNba2V5XSA9IHZhbHVlXG4gICAgfSlcblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbnRlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c2luJyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAoc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSB8fCBzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykge1xuICAgICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdykgcmV0dXJuIHNlbGYuc2hvdygpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykgc2VsZi5zaG93KClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmlzSW5TdGF0ZVRydWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaW5TdGF0ZSkge1xuICAgICAgaWYgKHRoaXMuaW5TdGF0ZVtrZXldKSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUubGVhdmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNvdXQnID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHJldHVyblxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdvdXQnXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpIHJldHVybiBzZWxmLmhpZGUoKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdvdXQnKSBzZWxmLmhpZGUoKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5oaWRlKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICh0aGlzLmhhc0NvbnRlbnQoKSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICB2YXIgaW5Eb20gPSAkLmNvbnRhaW5zKHRoaXMuJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMuJGVsZW1lbnRbMF0pXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCAhaW5Eb20pIHJldHVyblxuICAgICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxuXG4gICAgICB2YXIgdGlwSWQgPSB0aGlzLmdldFVJRCh0aGlzLnR5cGUpXG5cbiAgICAgIHRoaXMuc2V0Q29udGVudCgpXG4gICAgICAkdGlwLmF0dHIoJ2lkJywgdGlwSWQpXG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24pICR0aXAuYWRkQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICB2YXIgcGxhY2VtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLCAkdGlwWzBdLCB0aGlzLiRlbGVtZW50WzBdKSA6XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnRcblxuICAgICAgdmFyIGF1dG9Ub2tlbiA9IC9cXHM/YXV0bz9cXHM/L2lcbiAgICAgIHZhciBhdXRvUGxhY2UgPSBhdXRvVG9rZW4udGVzdChwbGFjZW1lbnQpXG4gICAgICBpZiAoYXV0b1BsYWNlKSBwbGFjZW1lbnQgPSBwbGFjZW1lbnQucmVwbGFjZShhdXRvVG9rZW4sICcnKSB8fCAndG9wJ1xuXG4gICAgICAkdGlwXG4gICAgICAgIC5kZXRhY2goKVxuICAgICAgICAuY3NzKHsgdG9wOiAwLCBsZWZ0OiAwLCBkaXNwbGF5OiAnYmxvY2snIH0pXG4gICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICAgIC5kYXRhKCdicy4nICsgdGhpcy50eXBlLCB0aGlzKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuY29udGFpbmVyID8gJHRpcC5hcHBlbmRUbygkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5jb250YWluZXIpKSA6ICR0aXAuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudClcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignaW5zZXJ0ZWQuYnMuJyArIHRoaXMudHlwZSlcblxuICAgICAgdmFyIHBvcyAgICAgICAgICA9IHRoaXMuZ2V0UG9zaXRpb24oKVxuICAgICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgICBpZiAoYXV0b1BsYWNlKSB7XG4gICAgICAgIHZhciBvcmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRcbiAgICAgICAgdmFyIHZpZXdwb3J0RGltID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgJiYgcG9zLmJvdHRvbSArIGFjdHVhbEhlaWdodCA+IHZpZXdwb3J0RGltLmJvdHRvbSA/ICd0b3AnICAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgICYmIHBvcy50b3AgICAgLSBhY3R1YWxIZWlnaHQgPCB2aWV3cG9ydERpbS50b3AgICAgPyAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAncmlnaHQnICAmJiBwb3MucmlnaHQgICsgYWN0dWFsV2lkdGggID4gdmlld3BvcnREaW0ud2lkdGggID8gJ2xlZnQnICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgJiYgcG9zLmxlZnQgICAtIGFjdHVhbFdpZHRoICA8IHZpZXdwb3J0RGltLmxlZnQgICA/ICdyaWdodCcgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50XG5cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhvcmdQbGFjZW1lbnQpXG4gICAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGN1bGF0ZWRPZmZzZXQgPSB0aGlzLmdldENhbGN1bGF0ZWRPZmZzZXQocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICAgIHRoaXMuYXBwbHlQbGFjZW1lbnQoY2FsY3VsYXRlZE9mZnNldCwgcGxhY2VtZW50KVxuXG4gICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmV2SG92ZXJTdGF0ZSA9IHRoYXQuaG92ZXJTdGF0ZVxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3Nob3duLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICAgIHRoYXQuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgICAgICBpZiAocHJldkhvdmVyU3RhdGUgPT0gJ291dCcpIHRoYXQubGVhdmUodGhhdClcbiAgICAgIH1cblxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICAkdGlwXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjb21wbGV0ZSgpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQgPSBmdW5jdGlvbiAob2Zmc2V0LCBwbGFjZW1lbnQpIHtcbiAgICB2YXIgJHRpcCAgID0gdGhpcy50aXAoKVxuICAgIHZhciB3aWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAvLyBtYW51YWxseSByZWFkIG1hcmdpbnMgYmVjYXVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaW5jbHVkZXMgZGlmZmVyZW5jZVxuICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLXRvcCcpLCAxMClcbiAgICB2YXIgbWFyZ2luTGVmdCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMClcblxuICAgIC8vIHdlIG11c3QgY2hlY2sgZm9yIE5hTiBmb3IgaWUgOC85XG4gICAgaWYgKGlzTmFOKG1hcmdpblRvcCkpICBtYXJnaW5Ub3AgID0gMFxuICAgIGlmIChpc05hTihtYXJnaW5MZWZ0KSkgbWFyZ2luTGVmdCA9IDBcblxuICAgIG9mZnNldC50b3AgICs9IG1hcmdpblRvcFxuICAgIG9mZnNldC5sZWZ0ICs9IG1hcmdpbkxlZnRcblxuICAgIC8vICQuZm4ub2Zmc2V0IGRvZXNuJ3Qgcm91bmQgcGl4ZWwgdmFsdWVzXG4gICAgLy8gc28gd2UgdXNlIHNldE9mZnNldCBkaXJlY3RseSB3aXRoIG91ciBvd24gZnVuY3Rpb24gQi0wXG4gICAgJC5vZmZzZXQuc2V0T2Zmc2V0KCR0aXBbMF0sICQuZXh0ZW5kKHtcbiAgICAgIHVzaW5nOiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgJHRpcC5jc3Moe1xuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChwcm9wcy50b3ApLFxuICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQocHJvcHMubGVmdClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBvZmZzZXQpLCAwKVxuXG4gICAgJHRpcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHBsYWNpbmcgdGlwIGluIG5ldyBvZmZzZXQgY2F1c2VkIHRoZSB0aXAgdG8gcmVzaXplIGl0c2VsZlxuICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICBpZiAocGxhY2VtZW50ID09ICd0b3AnICYmIGFjdHVhbEhlaWdodCAhPSBoZWlnaHQpIHtcbiAgICAgIG9mZnNldC50b3AgPSBvZmZzZXQudG9wICsgaGVpZ2h0IC0gYWN0dWFsSGVpZ2h0XG4gICAgfVxuXG4gICAgdmFyIGRlbHRhID0gdGhpcy5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEocGxhY2VtZW50LCBvZmZzZXQsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICBpZiAoZGVsdGEubGVmdCkgb2Zmc2V0LmxlZnQgKz0gZGVsdGEubGVmdFxuICAgIGVsc2Ugb2Zmc2V0LnRvcCArPSBkZWx0YS50b3BcblxuICAgIHZhciBpc1ZlcnRpY2FsICAgICAgICAgID0gL3RvcHxib3R0b20vLnRlc3QocGxhY2VtZW50KVxuICAgIHZhciBhcnJvd0RlbHRhICAgICAgICAgID0gaXNWZXJ0aWNhbCA/IGRlbHRhLmxlZnQgKiAyIC0gd2lkdGggKyBhY3R1YWxXaWR0aCA6IGRlbHRhLnRvcCAqIDIgLSBoZWlnaHQgKyBhY3R1YWxIZWlnaHRcbiAgICB2YXIgYXJyb3dPZmZzZXRQb3NpdGlvbiA9IGlzVmVydGljYWwgPyAnb2Zmc2V0V2lkdGgnIDogJ29mZnNldEhlaWdodCdcblxuICAgICR0aXAub2Zmc2V0KG9mZnNldClcbiAgICB0aGlzLnJlcGxhY2VBcnJvdyhhcnJvd0RlbHRhLCAkdGlwWzBdW2Fycm93T2Zmc2V0UG9zaXRpb25dLCBpc1ZlcnRpY2FsKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUucmVwbGFjZUFycm93ID0gZnVuY3Rpb24gKGRlbHRhLCBkaW1lbnNpb24sIGlzVmVydGljYWwpIHtcbiAgICB0aGlzLmFycm93KClcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnLCA1MCAqICgxIC0gZGVsdGEgLyBkaW1lbnNpb24pICsgJyUnKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ3RvcCcgOiAnbGVmdCcsICcnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgdGl0bGUgPSBzYW5pdGl6ZUh0bWwodGl0bGUsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICAgICAgfVxuXG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykuaHRtbCh0aXRsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLnRleHQodGl0bGUpXG4gICAgfVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHQnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdoaWRlLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICh0aGF0LmhvdmVyU3RhdGUgIT0gJ2luJykgJHRpcC5kZXRhY2goKVxuICAgICAgaWYgKHRoYXQuJGVsZW1lbnQpIHsgLy8gVE9ETzogQ2hlY2sgd2hldGhlciBndWFyZGluZyB0aGlzIGNvZGUgd2l0aCB0aGlzIGBpZmAgaXMgcmVhbGx5IG5lY2Vzc2FyeS5cbiAgICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JylcbiAgICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICB9XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHRpcFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgY29tcGxldGUoKVxuXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmZpeFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICBpZiAoJGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpICE9ICdzdHJpbmcnKSB7XG4gICAgICAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgJGUuYXR0cigndGl0bGUnKSB8fCAnJykuYXR0cigndGl0bGUnLCAnJylcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgJGVsZW1lbnQgICA9ICRlbGVtZW50IHx8IHRoaXMuJGVsZW1lbnRcblxuICAgIHZhciBlbCAgICAgPSAkZWxlbWVudFswXVxuICAgIHZhciBpc0JvZHkgPSBlbC50YWdOYW1lID09ICdCT0RZJ1xuXG4gICAgdmFyIGVsUmVjdCAgICA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKGVsUmVjdC53aWR0aCA9PSBudWxsKSB7XG4gICAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBtaXNzaW5nIGluIElFOCwgc28gY29tcHV0ZSB0aGVtIG1hbnVhbGx5OyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8xNDA5M1xuICAgICAgZWxSZWN0ID0gJC5leHRlbmQoe30sIGVsUmVjdCwgeyB3aWR0aDogZWxSZWN0LnJpZ2h0IC0gZWxSZWN0LmxlZnQsIGhlaWdodDogZWxSZWN0LmJvdHRvbSAtIGVsUmVjdC50b3AgfSlcbiAgICB9XG4gICAgdmFyIGlzU3ZnID0gd2luZG93LlNWR0VsZW1lbnQgJiYgZWwgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudFxuICAgIC8vIEF2b2lkIHVzaW5nICQub2Zmc2V0KCkgb24gU1ZHcyBzaW5jZSBpdCBnaXZlcyBpbmNvcnJlY3QgcmVzdWx0cyBpbiBqUXVlcnkgMy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8yMDI4MFxuICAgIHZhciBlbE9mZnNldCAgPSBpc0JvZHkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogKGlzU3ZnID8gbnVsbCA6ICRlbGVtZW50Lm9mZnNldCgpKVxuICAgIHZhciBzY3JvbGwgICAgPSB7IHNjcm9sbDogaXNCb2R5ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA6ICRlbGVtZW50LnNjcm9sbFRvcCgpIH1cbiAgICB2YXIgb3V0ZXJEaW1zID0gaXNCb2R5ID8geyB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpIH0gOiBudWxsXG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGVsUmVjdCwgc2Nyb2xsLCBvdXRlckRpbXMsIGVsT2Zmc2V0KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRlZE9mZnNldCA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHJldHVybiBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQsICAgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgPyB7IHRvcDogcG9zLnRvcCAtIGFjdHVhbEhlaWdodCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCB9IDpcbiAgICAgICAgLyogcGxhY2VtZW50ID09ICdyaWdodCcgKi8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIH1cblxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgdmFyIGRlbHRhID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICAgIGlmICghdGhpcy4kdmlld3BvcnQpIHJldHVybiBkZWx0YVxuXG4gICAgdmFyIHZpZXdwb3J0UGFkZGluZyA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiB0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZyB8fCAwXG4gICAgdmFyIHZpZXdwb3J0RGltZW5zaW9ucyA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICBpZiAoL3JpZ2h0fGxlZnQvLnRlc3QocGxhY2VtZW50KSkge1xuICAgICAgdmFyIHRvcEVkZ2VPZmZzZXQgICAgPSBwb3MudG9wIC0gdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbFxuICAgICAgdmFyIGJvdHRvbUVkZ2VPZmZzZXQgPSBwb3MudG9wICsgdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbCArIGFjdHVhbEhlaWdodFxuICAgICAgaWYgKHRvcEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMudG9wKSB7IC8vIHRvcCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wIC0gdG9wRWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChib3R0b21FZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQpIHsgLy8gYm90dG9tIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0IC0gYm90dG9tRWRnZU9mZnNldFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGVmdEVkZ2VPZmZzZXQgID0gcG9zLmxlZnQgLSB2aWV3cG9ydFBhZGRpbmdcbiAgICAgIHZhciByaWdodEVkZ2VPZmZzZXQgPSBwb3MubGVmdCArIHZpZXdwb3J0UGFkZGluZyArIGFjdHVhbFdpZHRoXG4gICAgICBpZiAobGVmdEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCkgeyAvLyBsZWZ0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCAtIGxlZnRFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0RWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy5yaWdodCkgeyAvLyByaWdodCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgKyB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGggLSByaWdodEVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsdGFcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZVxuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHRpdGxlID0gJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpXG4gICAgICB8fCAodHlwZW9mIG8udGl0bGUgPT0gJ2Z1bmN0aW9uJyA/IG8udGl0bGUuY2FsbCgkZVswXSkgOiAgby50aXRsZSlcblxuICAgIHJldHVybiB0aXRsZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VUlEID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIGRvIHByZWZpeCArPSB+fihNYXRoLnJhbmRvbSgpICogMTAwMDAwMClcbiAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcbiAgICByZXR1cm4gcHJlZml4XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiR0aXApIHtcbiAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxuICAgICAgaWYgKHRoaXMuJHRpcC5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IScpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiR0aXBcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy50b29sdGlwLWFycm93JykpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmIChlKSB7XG4gICAgICBzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG4gICAgICBpZiAoIXNlbGYpIHtcbiAgICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZS5jbGljayA9ICFzZWxmLmluU3RhdGUuY2xpY2tcbiAgICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgc2VsZi5lbnRlcihzZWxmKVxuICAgICAgZWxzZSBzZWxmLmxlYXZlKHNlbGYpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgPyBzZWxmLmxlYXZlKHNlbGYpIDogc2VsZi5lbnRlcihzZWxmKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB0aGlzLmhpZGUoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vZmYoJy4nICsgdGhhdC50eXBlKS5yZW1vdmVEYXRhKCdicy4nICsgdGhhdC50eXBlKVxuICAgICAgaWYgKHRoYXQuJHRpcCkge1xuICAgICAgICB0aGF0LiR0aXAuZGV0YWNoKClcbiAgICAgIH1cbiAgICAgIHRoYXQuJHRpcCA9IG51bGxcbiAgICAgIHRoYXQuJGFycm93ID0gbnVsbFxuICAgICAgdGhhdC4kdmlld3BvcnQgPSBudWxsXG4gICAgICB0aGF0LiRlbGVtZW50ID0gbnVsbFxuICAgIH0pXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zYW5pdGl6ZUh0bWwgPSBmdW5jdGlvbiAodW5zYWZlSHRtbCkge1xuICAgIHJldHVybiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgdGhpcy5vcHRpb25zLndoaXRlTGlzdCwgdGhpcy5vcHRpb25zLnNhbml0aXplRm4pXG4gIH1cblxuICAvLyBUT09MVElQIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50b29sdGlwJywgKGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udG9vbHRpcFxuXG4gICQuZm4udG9vbHRpcCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IgPSBUb29sdGlwXG5cblxuICAvLyBUT09MVElQIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnRvb2x0aXAubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRvb2x0aXAgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHBvcG92ZXIuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jcG9wb3ZlcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgUG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0KCdwb3BvdmVyJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICghJC5mbi50b29sdGlwKSB0aHJvdyBuZXcgRXJyb3IoJ1BvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qcycpXG5cbiAgUG9wb3Zlci5WRVJTSU9OICA9ICczLjQuMSdcblxuICBQb3BvdmVyLkRFRkFVTFRTID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUywge1xuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB0cmlnZ2VyOiAnY2xpY2snLFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gIH0pXG5cblxuICAvLyBOT1RFOiBQT1BPVkVSIEVYVEVORFMgdG9vbHRpcC5qc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIFBvcG92ZXIucHJvdG90eXBlID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3BvdmVyXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBvcG92ZXIuREVGQVVMVFNcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlICAgPSB0aGlzLmdldFRpdGxlKClcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcbiAgICAgIHZhciB0eXBlQ29udGVudCA9IHR5cGVvZiBjb250ZW50XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgdGl0bGUgPSB0aGlzLnNhbml0aXplSHRtbCh0aXRsZSlcblxuICAgICAgICBpZiAodHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuc2FuaXRpemVIdG1sKGNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpW1xuICAgICAgICB0eXBlQ29udGVudCA9PT0gJ3N0cmluZycgPyAnaHRtbCcgOiAnYXBwZW5kJ1xuICAgICAgXShjb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykudGV4dCh0aXRsZSlcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKCkudGV4dChjb250ZW50KVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0IGluJylcblxuICAgIC8vIElFOCBkb2Vzbid0IGFjY2VwdCBoaWRpbmcgdmlhIHRoZSBgOmVtcHR5YCBwc2V1ZG8gc2VsZWN0b3IsIHdlIGhhdmUgdG8gZG9cbiAgICAvLyB0aGlzIG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoZSBjb250ZW50cy5cbiAgICBpZiAoISR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKCkpICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5oaWRlKClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKSB8fCB0aGlzLmdldENvbnRlbnQoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICByZXR1cm4gJGUuYXR0cignZGF0YS1jb250ZW50JylcbiAgICAgIHx8ICh0eXBlb2Ygby5jb250ZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOlxuICAgICAgICBvLmNvbnRlbnQpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcuYXJyb3cnKSlcbiAgfVxuXG5cbiAgLy8gUE9QT1ZFUiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicsIChkYXRhID0gbmV3IFBvcG92ZXIodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnBvcG92ZXJcblxuICAkLmZuLnBvcG92ZXIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG5cbiAgLy8gUE9QT1ZFUiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5wb3BvdmVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5wb3BvdmVyID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBzY3JvbGxzcHkuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jc2Nyb2xsc3B5XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gU0NST0xMU1BZIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBTY3JvbGxTcHkoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGJvZHkgICAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudCA9ICQoZWxlbWVudCkuaXMoZG9jdW1lbnQuYm9keSkgPyAkKHdpbmRvdykgOiAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgICA9ICQuZXh0ZW5kKHt9LCBTY3JvbGxTcHkuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5zZWxlY3RvciAgICAgICA9ICh0aGlzLm9wdGlvbnMudGFyZ2V0IHx8ICcnKSArICcgLm5hdiBsaSA+IGEnXG4gICAgdGhpcy5vZmZzZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgICA9IG51bGxcbiAgICB0aGlzLnNjcm9sbEhlaWdodCAgID0gMFxuXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudC5vbignc2Nyb2xsLmJzLnNjcm9sbHNweScsICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSlcbiAgICB0aGlzLnJlZnJlc2goKVxuICAgIHRoaXMucHJvY2VzcygpXG4gIH1cblxuICBTY3JvbGxTcHkuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgU2Nyb2xsU3B5LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMTBcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuZ2V0U2Nyb2xsSGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRzY3JvbGxFbGVtZW50WzBdLnNjcm9sbEhlaWdodCB8fCBNYXRoLm1heCh0aGlzLiRib2R5WzBdLnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodClcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgICA9IHRoaXNcbiAgICB2YXIgb2Zmc2V0TWV0aG9kICA9ICdvZmZzZXQnXG4gICAgdmFyIG9mZnNldEJhc2UgICAgPSAwXG5cbiAgICB0aGlzLm9mZnNldHMgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgPSBbXVxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuXG4gICAgaWYgKCEkLmlzV2luZG93KHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0pKSB7XG4gICAgICBvZmZzZXRNZXRob2QgPSAncG9zaXRpb24nXG4gICAgICBvZmZzZXRCYXNlICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpXG4gICAgfVxuXG4gICAgdGhpcy4kYm9keVxuICAgICAgLmZpbmQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGVsICAgPSAkKHRoaXMpXG4gICAgICAgIHZhciBocmVmICA9ICRlbC5kYXRhKCd0YXJnZXQnKSB8fCAkZWwuYXR0cignaHJlZicpXG4gICAgICAgIHZhciAkaHJlZiA9IC9eIy4vLnRlc3QoaHJlZikgJiYgJChocmVmKVxuXG4gICAgICAgIHJldHVybiAoJGhyZWZcbiAgICAgICAgICAmJiAkaHJlZi5sZW5ndGhcbiAgICAgICAgICAmJiAkaHJlZi5pcygnOnZpc2libGUnKVxuICAgICAgICAgICYmIFtbJGhyZWZbb2Zmc2V0TWV0aG9kXSgpLnRvcCArIG9mZnNldEJhc2UsIGhyZWZdXSkgfHwgbnVsbFxuICAgICAgfSlcbiAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhWzBdIC0gYlswXSB9KVxuICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Lm9mZnNldHMucHVzaCh0aGlzWzBdKVxuICAgICAgICB0aGF0LnRhcmdldHMucHVzaCh0aGlzWzFdKVxuICAgICAgfSlcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSArIHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuICAgIHZhciBtYXhTY3JvbGwgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0ICsgc2Nyb2xsSGVpZ2h0IC0gdGhpcy4kc2Nyb2xsRWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXRzICAgICAgPSB0aGlzLm9mZnNldHNcbiAgICB2YXIgdGFyZ2V0cyAgICAgID0gdGhpcy50YXJnZXRzXG4gICAgdmFyIGFjdGl2ZVRhcmdldCA9IHRoaXMuYWN0aXZlVGFyZ2V0XG4gICAgdmFyIGlcblxuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCAhPSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHJldHVybiBhY3RpdmVUYXJnZXQgIT0gKGkgPSB0YXJnZXRzW3RhcmdldHMubGVuZ3RoIC0gMV0pICYmIHRoaXMuYWN0aXZhdGUoaSlcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZlVGFyZ2V0ICYmIHNjcm9sbFRvcCA8IG9mZnNldHNbMF0pIHtcbiAgICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gbnVsbFxuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKVxuICAgIH1cblxuICAgIGZvciAoaSA9IG9mZnNldHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICBhY3RpdmVUYXJnZXQgIT0gdGFyZ2V0c1tpXVxuICAgICAgICAmJiBzY3JvbGxUb3AgPj0gb2Zmc2V0c1tpXVxuICAgICAgICAmJiAob2Zmc2V0c1tpICsgMV0gPT09IHVuZGVmaW5lZCB8fCBzY3JvbGxUb3AgPCBvZmZzZXRzW2kgKyAxXSlcbiAgICAgICAgJiYgdGhpcy5hY3RpdmF0ZSh0YXJnZXRzW2ldKVxuICAgIH1cbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgPSB0YXJnZXRcblxuICAgIHRoaXMuY2xlYXIoKVxuXG4gICAgdmFyIHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciArXG4gICAgICAnW2RhdGEtdGFyZ2V0PVwiJyArIHRhcmdldCArICdcIl0sJyArXG4gICAgICB0aGlzLnNlbGVjdG9yICsgJ1tocmVmPVwiJyArIHRhcmdldCArICdcIl0nXG5cbiAgICB2YXIgYWN0aXZlID0gJChzZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzKCdsaScpXG4gICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICBpZiAoYWN0aXZlLnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgYWN0aXZlLnRyaWdnZXIoJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzVW50aWwodGhpcy5vcHRpb25zLnRhcmdldCwgJy5hY3RpdmUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JywgKGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5zY3JvbGxzcHlcblxuICAkLmZuLnNjcm9sbHNweSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweVxuXG5cbiAgLy8gU0NST0xMU1BZIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uc2Nyb2xsc3B5Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5zY3JvbGxzcHkgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkLmJzLnNjcm9sbHNweS5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJzY3JvbGxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgJHNweS5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdGFiLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RhYnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBUQUIgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUYWIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIC8vIGpzY3M6ZGlzYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICAgIHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAvLyBqc2NzOmVuYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICB9XG5cbiAgVGFiLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgVGFiLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUYWIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzICAgID0gdGhpcy5lbGVtZW50XG4gICAgdmFyICR1bCAgICAgID0gJHRoaXMuY2xvc2VzdCgndWw6bm90KC5kcm9wZG93bi1tZW51KScpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuZGF0YSgndGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgaWYgKCR0aGlzLnBhcmVudCgnbGknKS5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVyblxuXG4gICAgdmFyICRwcmV2aW91cyA9ICR1bC5maW5kKCcuYWN0aXZlOmxhc3QgYScpXG4gICAgdmFyIGhpZGVFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICB9KVxuICAgIHZhciBzaG93RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgIH0pXG5cbiAgICAkcHJldmlvdXMudHJpZ2dlcihoaWRlRXZlbnQpXG4gICAgJHRoaXMudHJpZ2dlcihzaG93RXZlbnQpXG5cbiAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8IGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpXG5cbiAgICB0aGlzLmFjdGl2YXRlKCR0aGlzLmNsb3Nlc3QoJ2xpJyksICR1bClcbiAgICB0aGlzLmFjdGl2YXRlKCR0YXJnZXQsICR0YXJnZXQucGFyZW50KCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICRwcmV2aW91cy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ2hpZGRlbi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgICAgfSlcbiAgICAgICR0aGlzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnc2hvd24uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBUYWIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spIHtcbiAgICB2YXIgJGFjdGl2ZSAgICA9IGNvbnRhaW5lci5maW5kKCc+IC5hY3RpdmUnKVxuICAgIHZhciB0cmFuc2l0aW9uID0gY2FsbGJhY2tcbiAgICAgICYmICQuc3VwcG9ydC50cmFuc2l0aW9uXG4gICAgICAmJiAoJGFjdGl2ZS5sZW5ndGggJiYgJGFjdGl2ZS5oYXNDbGFzcygnZmFkZScpIHx8ICEhY29udGFpbmVyLmZpbmQoJz4gLmZhZGUnKS5sZW5ndGgpXG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCc+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmVuZCgpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgICBlbGVtZW50XG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyByZWZsb3cgZm9yIHRyYW5zaXRpb25cbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnZmFkZScpXG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgICAgZWxlbWVudFxuICAgICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgIC5lbmQoKVxuICAgICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgICRhY3RpdmUubGVuZ3RoICYmIHRyYW5zaXRpb24gP1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBuZXh0KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVGFiLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIG5leHQoKVxuXG4gICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnaW4nKVxuICB9XG5cblxuICAvLyBUQUIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMudGFiJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50YWInLCAoZGF0YSA9IG5ldyBUYWIodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRhYlxuXG4gICQuZm4udGFiICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udGFiLkNvbnN0cnVjdG9yID0gVGFiXG5cblxuICAvLyBUQUIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJC5mbi50YWIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRhYiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFRBQiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBQbHVnaW4uY2FsbCgkKHRoaXMpLCAnc2hvdycpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJwaWxsXCJdJywgY2xpY2tIYW5kbGVyKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhZmZpeC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhZmZpeFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFGRklYIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIEFmZml4LkRFRkFVTFRTLCBvcHRpb25zKVxuXG4gICAgdmFyIHRhcmdldCA9IHRoaXMub3B0aW9ucy50YXJnZXQgPT09IEFmZml4LkRFRkFVTFRTLnRhcmdldCA/ICQodGhpcy5vcHRpb25zLnRhcmdldCkgOiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpXG5cbiAgICB0aGlzLiR0YXJnZXQgPSB0YXJnZXRcbiAgICAgIC5vbignc2Nyb2xsLmJzLmFmZml4LmRhdGEtYXBpJywgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpKVxuICAgICAgLm9uKCdjbGljay5icy5hZmZpeC5kYXRhLWFwaScsICAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AsIHRoaXMpKVxuXG4gICAgdGhpcy4kZWxlbWVudCAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5hZmZpeGVkICAgICAgPSBudWxsXG4gICAgdGhpcy51bnBpbiAgICAgICAgPSBudWxsXG4gICAgdGhpcy5waW5uZWRPZmZzZXQgPSBudWxsXG5cbiAgICB0aGlzLmNoZWNrUG9zaXRpb24oKVxuICB9XG5cbiAgQWZmaXguVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQWZmaXguUkVTRVQgICAgPSAnYWZmaXggYWZmaXgtdG9wIGFmZml4LWJvdHRvbSdcblxuICBBZmZpeC5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDAsXG4gICAgdGFyZ2V0OiB3aW5kb3dcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uIChzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICAgICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gdGhpcy4kdGFyZ2V0LmhlaWdodCgpXG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgdGhpcy5hZmZpeGVkID09ICd0b3AnKSByZXR1cm4gc2Nyb2xsVG9wIDwgb2Zmc2V0VG9wID8gJ3RvcCcgOiBmYWxzZVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCA9PSAnYm90dG9tJykge1xuICAgICAgaWYgKG9mZnNldFRvcCAhPSBudWxsKSByZXR1cm4gKHNjcm9sbFRvcCArIHRoaXMudW5waW4gPD0gcG9zaXRpb24udG9wKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICAgIHJldHVybiAoc2Nyb2xsVG9wICsgdGFyZ2V0SGVpZ2h0IDw9IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgfVxuXG4gICAgdmFyIGluaXRpYWxpemluZyAgID0gdGhpcy5hZmZpeGVkID09IG51bGxcbiAgICB2YXIgY29sbGlkZXJUb3AgICAgPSBpbml0aWFsaXppbmcgPyBzY3JvbGxUb3AgOiBwb3NpdGlvbi50b3BcbiAgICB2YXIgY29sbGlkZXJIZWlnaHQgPSBpbml0aWFsaXppbmcgPyB0YXJnZXRIZWlnaHQgOiBoZWlnaHRcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiBzY3JvbGxUb3AgPD0gb2Zmc2V0VG9wKSByZXR1cm4gJ3RvcCdcbiAgICBpZiAob2Zmc2V0Qm90dG9tICE9IG51bGwgJiYgKGNvbGxpZGVyVG9wICsgY29sbGlkZXJIZWlnaHQgPj0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSkgcmV0dXJuICdib3R0b20nXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRQaW5uZWRPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucGlubmVkT2Zmc2V0KSByZXR1cm4gdGhpcy5waW5uZWRPZmZzZXRcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKS5hZGRDbGFzcygnYWZmaXgnKVxuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHJldHVybiAodGhpcy5waW5uZWRPZmZzZXQgPSBwb3NpdGlvbi50b3AgLSBzY3JvbGxUb3ApXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dCgkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcyksIDEpXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVyblxuXG4gICAgdmFyIGhlaWdodCAgICAgICA9IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0ICAgICAgID0gdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wXG4gICAgdmFyIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b21cbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gTWF0aC5tYXgoJChkb2N1bWVudCkuaGVpZ2h0KCksICQoZG9jdW1lbnQuYm9keSkuaGVpZ2h0KCkpXG5cbiAgICBpZiAodHlwZW9mIG9mZnNldCAhPSAnb2JqZWN0JykgICAgICAgICBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgPSBvZmZzZXRcbiAgICBpZiAodHlwZW9mIG9mZnNldFRvcCA9PSAnZnVuY3Rpb24nKSAgICBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wKHRoaXMuJGVsZW1lbnQpXG4gICAgaWYgKHR5cGVvZiBvZmZzZXRCb3R0b20gPT0gJ2Z1bmN0aW9uJykgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbSh0aGlzLiRlbGVtZW50KVxuXG4gICAgdmFyIGFmZml4ID0gdGhpcy5nZXRTdGF0ZShzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkICE9IGFmZml4KSB7XG4gICAgICBpZiAodGhpcy51bnBpbiAhPSBudWxsKSB0aGlzLiRlbGVtZW50LmNzcygndG9wJywgJycpXG5cbiAgICAgIHZhciBhZmZpeFR5cGUgPSAnYWZmaXgnICsgKGFmZml4ID8gJy0nICsgYWZmaXggOiAnJylcbiAgICAgIHZhciBlICAgICAgICAgPSAkLkV2ZW50KGFmZml4VHlwZSArICcuYnMuYWZmaXgnKVxuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICB0aGlzLmFmZml4ZWQgPSBhZmZpeFxuICAgICAgdGhpcy51bnBpbiA9IGFmZml4ID09ICdib3R0b20nID8gdGhpcy5nZXRQaW5uZWRPZmZzZXQoKSA6IG51bGxcblxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpXG4gICAgICAgIC5hZGRDbGFzcyhhZmZpeFR5cGUpXG4gICAgICAgIC50cmlnZ2VyKGFmZml4VHlwZS5yZXBsYWNlKCdhZmZpeCcsICdhZmZpeGVkJykgKyAnLmJzLmFmZml4JylcbiAgICB9XG5cbiAgICBpZiAoYWZmaXggPT0gJ2JvdHRvbScpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2Zmc2V0KHtcbiAgICAgICAgdG9wOiBzY3JvbGxIZWlnaHQgLSBoZWlnaHQgLSBvZmZzZXRCb3R0b21cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cblxuICAvLyBBRkZJWCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5hZmZpeCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWZmaXgnLCAoZGF0YSA9IG5ldyBBZmZpeCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWZmaXhcblxuICAkLmZuLmFmZml4ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWZmaXguQ29uc3RydWN0b3IgPSBBZmZpeFxuXG5cbiAgLy8gQUZGSVggTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFmZml4Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hZmZpeCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFGRklYIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHNweS5kYXRhKClcblxuICAgICAgZGF0YS5vZmZzZXQgPSBkYXRhLm9mZnNldCB8fCB7fVxuXG4gICAgICBpZiAoZGF0YS5vZmZzZXRCb3R0b20gIT0gbnVsbCkgZGF0YS5vZmZzZXQuYm90dG9tID0gZGF0YS5vZmZzZXRCb3R0b21cbiAgICAgIGlmIChkYXRhLm9mZnNldFRvcCAgICAhPSBudWxsKSBkYXRhLm9mZnNldC50b3AgICAgPSBkYXRhLm9mZnNldFRvcFxuXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCBkYXRhKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcbiIsIi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfCBGbGV4eSBoZWFkZXJcbi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfFxuLy8gfCBUaGlzIGpRdWVyeSBzY3JpcHQgaXMgd3JpdHRlbiBieVxuLy8gfFxuLy8gfCBNb3J0ZW4gTmlzc2VuXG4vLyB8IGhqZW1tZXNpZGVrb25nZW4uZGtcbi8vIHxcblxudmFyIGZsZXh5X2hlYWRlciA9IChmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwdWIgPSB7fSxcbiAgICAgICAgJGhlYWRlcl9zdGF0aWMgPSAkKCcuZmxleHktaGVhZGVyLS1zdGF0aWMnKSxcbiAgICAgICAgJGhlYWRlcl9zdGlja3kgPSAkKCcuZmxleHktaGVhZGVyLS1zdGlja3knKSxcbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHVwZGF0ZV9pbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlOiB7XG4gICAgICAgICAgICAgICAgdXB3YXJkOiAyMCxcbiAgICAgICAgICAgICAgICBkb3dud2FyZDogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvZmZzZXQ6IF9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tKCRoZWFkZXJfc3RhdGljKSxcbiAgICAgICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgICAgICBwaW5uZWQ6IFwiZmxleHktaGVhZGVyLS1waW5uZWRcIixcbiAgICAgICAgICAgICAgICB1bnBpbm5lZDogXCJmbGV4eS1oZWFkZXItLXVucGlubmVkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd2FzX3Njcm9sbGVkID0gZmFsc2UsXG4gICAgICAgIGxhc3RfZGlzdGFuY2VfZnJvbV90b3AgPSAwO1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVcbiAgICAgKi9cbiAgICBwdWIuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpO1xuICAgICAgICByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvb3QgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCkge1xuICAgICAgICAkaGVhZGVyX3N0aWNreS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAod2FzX3Njcm9sbGVkKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRfd2FzX3Njcm9sbGVkKCk7XG5cbiAgICAgICAgICAgICAgICB3YXNfc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgb3B0aW9ucy51cGRhdGVfaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCkge1xuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB3YXNfc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2Zmc2V0IGZyb20gZWxlbWVudCBib3R0b21cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0X29mZnNldF9mcm9tX2VsZW1lbnRzX2JvdHRvbSgkZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudF9oZWlnaHQgPSAkZWxlbWVudC5vdXRlckhlaWdodCh0cnVlKSxcbiAgICAgICAgICAgIGVsZW1lbnRfb2Zmc2V0ID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgIHJldHVybiAoZWxlbWVudF9oZWlnaHQgKyBlbGVtZW50X29mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9jdW1lbnQgd2FzIHNjcm9sbGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9jdW1lbnRfd2FzX3Njcm9sbGVkKCkge1xuICAgICAgICB2YXIgY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgICAvLyBJZiBwYXN0IG9mZnNldFxuICAgICAgICBpZiAoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA+PSBvcHRpb25zLm9mZnNldCkge1xuXG4gICAgICAgICAgICAvLyBEb3dud2FyZHMgc2Nyb2xsXG4gICAgICAgICAgICBpZiAoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA+IGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIHtcblxuICAgICAgICAgICAgICAgIC8vIE9iZXkgdGhlIGRvd253YXJkIHRvbGVyYW5jZVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIC0gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkgPD0gb3B0aW9ucy50b2xlcmFuY2UuZG93bndhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwd2FyZHMgc2Nyb2xsXG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIE9iZXkgdGhlIHVwd2FyZCB0b2xlcmFuY2VcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCAtIGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIDw9IG9wdGlvbnMudG9sZXJhbmNlLnVwd2FyZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gV2UgYXJlIG5vdCBzY3JvbGxlZCBwYXN0IHRoZSBkb2N1bWVudCB3aGljaCBpcyBwb3NzaWJsZSBvbiB0aGUgTWFjXG4gICAgICAgICAgICAgICAgaWYgKChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90IHBhc3Qgb2Zmc2V0XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RfZGlzdGFuY2VfZnJvbV90b3AgPSBjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wO1xuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgQWpheE1vbml0b3IsIEJhciwgRG9jdW1lbnRNb25pdG9yLCBFbGVtZW50TW9uaXRvciwgRWxlbWVudFRyYWNrZXIsIEV2ZW50TGFnTW9uaXRvciwgRXZlbnRlZCwgRXZlbnRzLCBOb1RhcmdldEVycm9yLCBQYWNlLCBSZXF1ZXN0SW50ZXJjZXB0LCBTT1VSQ0VfS0VZUywgU2NhbGVyLCBTb2NrZXRSZXF1ZXN0VHJhY2tlciwgWEhSUmVxdWVzdFRyYWNrZXIsIGFuaW1hdGlvbiwgYXZnQW1wbGl0dWRlLCBiYXIsIGNhbmNlbEFuaW1hdGlvbiwgY2FuY2VsQW5pbWF0aW9uRnJhbWUsIGRlZmF1bHRPcHRpb25zLCBleHRlbmQsIGV4dGVuZE5hdGl2ZSwgZ2V0RnJvbURPTSwgZ2V0SW50ZXJjZXB0LCBoYW5kbGVQdXNoU3RhdGUsIGlnbm9yZVN0YWNrLCBpbml0LCBub3csIG9wdGlvbnMsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgcmVzdWx0LCBydW5BbmltYXRpb24sIHNjYWxlcnMsIHNob3VsZElnbm9yZVVSTCwgc2hvdWxkVHJhY2ssIHNvdXJjZSwgc291cmNlcywgdW5pU2NhbGVyLCBfV2ViU29ja2V0LCBfWERvbWFpblJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCwgX2ksIF9pbnRlcmNlcHQsIF9sZW4sIF9wdXNoU3RhdGUsIF9yZWYsIF9yZWYxLCBfcmVwbGFjZVN0YXRlLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjYXRjaHVwVGltZTogMTAwLFxuICAgIGluaXRpYWxSYXRlOiAuMDMsXG4gICAgbWluVGltZTogMjUwLFxuICAgIGdob3N0VGltZTogMTAwLFxuICAgIG1heFByb2dyZXNzUGVyRnJhbWU6IDIwLFxuICAgIGVhc2VGYWN0b3I6IDEuMjUsXG4gICAgc3RhcnRPblBhZ2VMb2FkOiB0cnVlLFxuICAgIHJlc3RhcnRPblB1c2hTdGF0ZTogdHJ1ZSxcbiAgICByZXN0YXJ0T25SZXF1ZXN0QWZ0ZXI6IDUwMCxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBlbGVtZW50czoge1xuICAgICAgY2hlY2tJbnRlcnZhbDogMTAwLFxuICAgICAgc2VsZWN0b3JzOiBbJ2JvZHknXVxuICAgIH0sXG4gICAgZXZlbnRMYWc6IHtcbiAgICAgIG1pblNhbXBsZXM6IDEwLFxuICAgICAgc2FtcGxlQ291bnQ6IDMsXG4gICAgICBsYWdUaHJlc2hvbGQ6IDNcbiAgICB9LFxuICAgIGFqYXg6IHtcbiAgICAgIHRyYWNrTWV0aG9kczogWydHRVQnXSxcbiAgICAgIHRyYWNrV2ViU29ja2V0czogdHJ1ZSxcbiAgICAgIGlnbm9yZVVSTHM6IFtdXG4gICAgfVxuICB9O1xuXG4gIG5vdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVmO1xuICAgIHJldHVybiAoX3JlZiA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCA/IHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlLm5vdygpIDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZiA6ICsobmV3IERhdGUpO1xuICB9O1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PSBudWxsKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCA1MCk7XG4gICAgfTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuICB9XG5cbiAgcnVuQW5pbWF0aW9uID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgbGFzdCwgdGljaztcbiAgICBsYXN0ID0gbm93KCk7XG4gICAgdGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRpZmY7XG4gICAgICBkaWZmID0gbm93KCkgLSBsYXN0O1xuICAgICAgaWYgKGRpZmYgPj0gMzMpIHtcbiAgICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgICByZXR1cm4gZm4oZGlmZiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCh0aWNrLCAzMyAtIGRpZmYpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHRpY2soKTtcbiAgfTtcblxuICByZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywga2V5LCBvYmo7XG4gICAgb2JqID0gYXJndW1lbnRzWzBdLCBrZXkgPSBhcmd1bWVudHNbMV0sIGFyZ3MgPSAzIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IFtdO1xuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XS5hcHBseShvYmosIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfVxuICB9O1xuXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXksIG91dCwgc291cmNlLCBzb3VyY2VzLCB2YWwsIF9pLCBfbGVuO1xuICAgIG91dCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBzb3VyY2VzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2VzW19pXTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKCFfX2hhc1Byb3AuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgIHZhbCA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIGlmICgob3V0W2tleV0gIT0gbnVsbCkgJiYgdHlwZW9mIG91dFtrZXldID09PSAnb2JqZWN0JyAmJiAodmFsICE9IG51bGwpICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBleHRlbmQob3V0W2tleV0sIHZhbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGF2Z0FtcGxpdHVkZSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciBjb3VudCwgc3VtLCB2LCBfaSwgX2xlbjtcbiAgICBzdW0gPSBjb3VudCA9IDA7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcnIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHYgPSBhcnJbX2ldO1xuICAgICAgc3VtICs9IE1hdGguYWJzKHYpO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAvIGNvdW50O1xuICB9O1xuXG4gIGdldEZyb21ET00gPSBmdW5jdGlvbihrZXksIGpzb24pIHtcbiAgICB2YXIgZGF0YSwgZSwgZWw7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBrZXkgPSAnb3B0aW9ucyc7XG4gICAgfVxuICAgIGlmIChqc29uID09IG51bGwpIHtcbiAgICAgIGpzb24gPSB0cnVlO1xuICAgIH1cbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1wYWNlLVwiICsga2V5ICsgXCJdXCIpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGFjZS1cIiArIGtleSk7XG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgZSA9IF9lcnJvcjtcbiAgICAgIHJldHVybiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5lcnJvcihcIkVycm9yIHBhcnNpbmcgaW5saW5lIHBhY2Ugb3B0aW9uc1wiLCBlKSA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgRXZlbnRlZCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudGVkKCkge31cblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgb25jZSkge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKG9uY2UgPT0gbnVsbCkge1xuICAgICAgICBvbmNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5iaW5kaW5ncyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICgoX2Jhc2UgPSB0aGlzLmJpbmRpbmdzKVtldmVudF0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW2V2ZW50XS5wdXNoKHtcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgY3R4OiBjdHgsXG4gICAgICAgIG9uY2U6IG9uY2VcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCkge1xuICAgICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICB2YXIgaSwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBpZiAoKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChoYW5kbGVyID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmJpbmRpbmdzW2V2ZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXS5oYW5kbGVyID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgY3R4LCBldmVudCwgaGFuZGxlciwgaSwgb25jZSwgX3JlZiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgaWYgKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5nc1tldmVudF1baV0sIGhhbmRsZXIgPSBfcmVmMS5oYW5kbGVyLCBjdHggPSBfcmVmMS5jdHgsIG9uY2UgPSBfcmVmMS5vbmNlO1xuICAgICAgICAgIGhhbmRsZXIuYXBwbHkoY3R4ICE9IG51bGwgPyBjdHggOiB0aGlzLCBhcmdzKTtcbiAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmJpbmRpbmdzW2V2ZW50XS5zcGxpY2UoaSwgMSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50ZWQ7XG5cbiAgfSkoKTtcblxuICBQYWNlID0gd2luZG93LlBhY2UgfHwge307XG5cbiAgd2luZG93LlBhY2UgPSBQYWNlO1xuXG4gIGV4dGVuZChQYWNlLCBFdmVudGVkLnByb3RvdHlwZSk7XG5cbiAgb3B0aW9ucyA9IFBhY2Uub3B0aW9ucyA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHdpbmRvdy5wYWNlT3B0aW9ucywgZ2V0RnJvbURPTSgpKTtcblxuICBfcmVmID0gWydhamF4JywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJywgJ2VsZW1lbnRzJ107XG4gIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgIHNvdXJjZSA9IF9yZWZbX2ldO1xuICAgIGlmIChvcHRpb25zW3NvdXJjZV0gPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnNbc291cmNlXSA9IGRlZmF1bHRPcHRpb25zW3NvdXJjZV07XG4gICAgfVxuICB9XG5cbiAgTm9UYXJnZXRFcnJvciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTm9UYXJnZXRFcnJvciwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIE5vVGFyZ2V0RXJyb3IoKSB7XG4gICAgICBfcmVmMSA9IE5vVGFyZ2V0RXJyb3IuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gX3JlZjE7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5vVGFyZ2V0RXJyb3I7XG5cbiAgfSkoRXJyb3IpO1xuXG4gIEJhciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBCYXIoKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICB9XG5cbiAgICBCYXIucHJvdG90eXBlLmdldEVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YXJnZXRFbGVtZW50O1xuICAgICAgaWYgKHRoaXMuZWwgPT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCk7XG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBOb1RhcmdldEVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc05hbWUgPSBcInBhY2UgcGFjZS1hY3RpdmVcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKC9wYWNlLWRvbmUvZywgJycpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtcnVubmluZyc7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzXCI+XFxuICA8ZGl2IGNsYXNzPVwicGFjZS1wcm9ncmVzcy1pbm5lclwiPjwvZGl2PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJwYWNlLWFjdGl2aXR5XCI+PC9kaXY+JztcbiAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuZmlyc3RDaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGFyZ2V0RWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbDtcbiAgICAgIGVsID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1hY3RpdmUnLCAnJyk7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyBwYWNlLWluYWN0aXZlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1ydW5uaW5nJywgJycpO1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1kb25lJztcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihwcm9nKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gcHJvZztcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5nZXRFbGVtZW50KCkpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbCA9IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCwga2V5LCBwcm9ncmVzc1N0ciwgdHJhbnNmb3JtLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIHRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyB0aGlzLnByb2dyZXNzICsgXCIlLCAwLCAwKVwiO1xuICAgICAgX3JlZjIgPSBbJ3dlYmtpdFRyYW5zZm9ybScsICdtc1RyYW5zZm9ybScsICd0cmFuc2Zvcm0nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBrZXkgPSBfcmVmMltfal07XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnN0eWxlW2tleV0gPSB0cmFuc2Zvcm07XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgfHwgdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8IDAgIT09IHRoaXMucHJvZ3Jlc3MgfCAwKSB7XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcy10ZXh0JywgXCJcIiArICh0aGlzLnByb2dyZXNzIHwgMCkgKyBcIiVcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzID49IDEwMCkge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gJzk5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9IHRoaXMucHJvZ3Jlc3MgPCAxMCA/IFwiMFwiIDogXCJcIjtcbiAgICAgICAgICBwcm9ncmVzc1N0ciArPSB0aGlzLnByb2dyZXNzIHwgMDtcbiAgICAgICAgfVxuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MnLCBcIlwiICsgcHJvZ3Jlc3NTdHIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID49IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJhcjtcblxuICB9KSgpO1xuXG4gIEV2ZW50cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudHMoKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgfVxuXG4gICAgRXZlbnRzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgICB2YXIgYmluZGluZywgX2osIF9sZW4xLCBfcmVmMiwgX3Jlc3VsdHM7XG4gICAgICBpZiAodGhpcy5iaW5kaW5nc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYyID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgYmluZGluZyA9IF9yZWYyW19qXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcuY2FsbCh0aGlzLCB2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW25hbWVdID09IG51bGwpIHtcbiAgICAgICAgX2Jhc2VbbmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW25hbWVdLnB1c2goZm4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRzO1xuXG4gIH0pKCk7XG5cbiAgX1hNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuXG4gIF9YRG9tYWluUmVxdWVzdCA9IHdpbmRvdy5YRG9tYWluUmVxdWVzdDtcblxuICBfV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcblxuICBleHRlbmROYXRpdmUgPSBmdW5jdGlvbih0bywgZnJvbSkge1xuICAgIHZhciBlLCBrZXksIF9yZXN1bHRzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gZnJvbS5wcm90b3R5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICgodG9ba2V5XSA9PSBudWxsKSAmJiB0eXBlb2YgZnJvbVtrZXldICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBrZXksIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbS5wcm90b3R5cGVba2V5XTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godG9ba2V5XSA9IGZyb20ucHJvdG90eXBlW2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgaWdub3JlU3RhY2sgPSBbXTtcblxuICBQYWNlLmlnbm9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCdpZ25vcmUnKTtcbiAgICByZXQgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgUGFjZS50cmFjayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCd0cmFjaycpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBzaG91bGRUcmFjayA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHZhciBfcmVmMjtcbiAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgIG1ldGhvZCA9ICdHRVQnO1xuICAgIH1cbiAgICBpZiAoaWdub3JlU3RhY2tbMF0gPT09ICd0cmFjaycpIHtcbiAgICAgIHJldHVybiAnZm9yY2UnO1xuICAgIH1cbiAgICBpZiAoIWlnbm9yZVN0YWNrLmxlbmd0aCAmJiBvcHRpb25zLmFqYXgpIHtcbiAgICAgIGlmIChtZXRob2QgPT09ICdzb2NrZXQnICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKF9yZWYyID0gbWV0aG9kLnRvVXBwZXJDYXNlKCksIF9faW5kZXhPZi5jYWxsKG9wdGlvbnMuYWpheC50cmFja01ldGhvZHMsIF9yZWYyKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgUmVxdWVzdEludGVyY2VwdCA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVxdWVzdEludGVyY2VwdCwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIFJlcXVlc3RJbnRlcmNlcHQoKSB7XG4gICAgICB2YXIgbW9uaXRvclhIUixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgUmVxdWVzdEludGVyY2VwdC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIG1vbml0b3JYSFIgPSBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIF9vcGVuO1xuICAgICAgICBfb3BlbiA9IHJlcS5vcGVuO1xuICAgICAgICByZXR1cm4gcmVxLm9wZW4gPSBmdW5jdGlvbih0eXBlLCB1cmwsIGFzeW5jKSB7XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKHR5cGUpKSB7XG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9vcGVuLmFwcGx5KHJlcSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbihmbGFncykge1xuICAgICAgICB2YXIgcmVxO1xuICAgICAgICByZXEgPSBuZXcgX1hNTEh0dHBSZXF1ZXN0KGZsYWdzKTtcbiAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWE1MSHR0cFJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICBpZiAoX1hEb21haW5SZXF1ZXN0ICE9IG51bGwpIHtcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICByZXEgPSBuZXcgX1hEb21haW5SZXF1ZXN0O1xuICAgICAgICAgIG1vbml0b3JYSFIocmVxKTtcbiAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWERvbWFpblJlcXVlc3QsIF9YRG9tYWluUmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICAgIGlmICgoX1dlYlNvY2tldCAhPSBudWxsKSAmJiBvcHRpb25zLmFqYXgudHJhY2tXZWJTb2NrZXRzKSB7XG4gICAgICAgIHdpbmRvdy5XZWJTb2NrZXQgPSBmdW5jdGlvbih1cmwsIHByb3RvY29scykge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgaWYgKHByb3RvY29scyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwsIHByb3RvY29scyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzaG91bGRUcmFjaygnc29ja2V0JykpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6ICdzb2NrZXQnLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcHJvdG9jb2xzOiBwcm90b2NvbHMsXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5XZWJTb2NrZXQsIF9XZWJTb2NrZXQpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlcXVlc3RJbnRlcmNlcHQ7XG5cbiAgfSkoRXZlbnRzKTtcblxuICBfaW50ZXJjZXB0ID0gbnVsbDtcblxuICBnZXRJbnRlcmNlcHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoX2ludGVyY2VwdCA9PSBudWxsKSB7XG4gICAgICBfaW50ZXJjZXB0ID0gbmV3IFJlcXVlc3RJbnRlcmNlcHQ7XG4gICAgfVxuICAgIHJldHVybiBfaW50ZXJjZXB0O1xuICB9O1xuXG4gIHNob3VsZElnbm9yZVVSTCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBwYXR0ZXJuLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgIF9yZWYyID0gb3B0aW9ucy5hamF4Lmlnbm9yZVVSTHM7XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICBwYXR0ZXJuID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodXJsLmluZGV4T2YocGF0dGVybikgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QodXJsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKF9hcmcpIHtcbiAgICB2YXIgYWZ0ZXIsIGFyZ3MsIHJlcXVlc3QsIHR5cGUsIHVybDtcbiAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFQYWNlLnJ1bm5pbmcgJiYgKG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyICE9PSBmYWxzZSB8fCBzaG91bGRUcmFjayh0eXBlKSA9PT0gJ2ZvcmNlJykpIHtcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBhZnRlciA9IG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIGFmdGVyID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgYWZ0ZXIgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGlsbEFjdGl2ZSwgX2osIF9sZW4xLCBfcmVmMiwgX3JlZjMsIF9yZXN1bHRzO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9IHJlcXVlc3QucmVhZHlTdGF0ZSA8IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RpbGxBY3RpdmUgPSAoMCA8IChfcmVmMiA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgJiYgX3JlZjIgPCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RpbGxBY3RpdmUpIHtcbiAgICAgICAgICBQYWNlLnJlc3RhcnQoKTtcbiAgICAgICAgICBfcmVmMyA9IFBhY2Uuc291cmNlcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgc291cmNlID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFqYXhNb25pdG9yKSB7XG4gICAgICAgICAgICAgIHNvdXJjZS53YXRjaC5hcHBseShzb3VyY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LCBhZnRlcik7XG4gICAgfVxuICB9KTtcblxuICBBamF4TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBBamF4TW9uaXRvcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMud2F0Y2guYXBwbHkoX3RoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBBamF4TW9uaXRvci5wcm90b3R5cGUud2F0Y2ggPSBmdW5jdGlvbihfYXJnKSB7XG4gICAgICB2YXIgcmVxdWVzdCwgdHJhY2tlciwgdHlwZSwgdXJsO1xuICAgICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XG4gICAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja2VyID0gbmV3IFhIUlJlcXVlc3RUcmFja2VyKHJlcXVlc3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMucHVzaCh0cmFja2VyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEFqYXhNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgWEhSUmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBzaXplLCBfaiwgX2xlbjEsIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIGlmICh3aW5kb3cuUHJvZ3Jlc3NFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBudWxsO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5wcm9ncmVzcyArICgxMDAgLSBfdGhpcy5wcm9ncmVzcykgLyAyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBfcmVmMiA9IFsnbG9hZCcsICdhYm9ydCcsICd0aW1lb3V0JywgJ2Vycm9yJ107XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xuICAgICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYzO1xuICAgICAgICAgIGlmICgoX3JlZjMgPSByZXF1ZXN0LnJlYWR5U3RhdGUpID09PSAwIHx8IF9yZWYzID09PSA0KSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gMykge1xuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSA1MDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFhIUlJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgU29ja2V0UmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBfaiwgX2xlbjEsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIF9yZWYyID0gWydlcnJvcicsICdvcGVuJ107XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFNvY2tldFJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudE1vbml0b3Iob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGVjdG9yLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RvcnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdG9ycyA9IFtdO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSBvcHRpb25zLnNlbGVjdG9ycztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBzZWxlY3RvciA9IF9yZWYyW19qXTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKG5ldyBFbGVtZW50VHJhY2tlcihzZWxlY3RvcikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBFbGVtZW50TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIEVsZW1lbnRUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSB7XG4gICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuY2hlY2soKTtcbiAgICB9XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNoZWNrKCk7XG4gICAgICAgIH0pLCBvcHRpb25zLmVsZW1lbnRzLmNoZWNrSW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgfTtcblxuICAgIHJldHVybiBFbGVtZW50VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIERvY3VtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBEb2N1bWVudE1vbml0b3IucHJvdG90eXBlLnN0YXRlcyA9IHtcbiAgICAgIGxvYWRpbmc6IDAsXG4gICAgICBpbnRlcmFjdGl2ZTogNTAsXG4gICAgICBjb21wbGV0ZTogMTAwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIERvY3VtZW50TW9uaXRvcigpIHtcbiAgICAgIHZhciBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IChfcmVmMiA9IHRoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdKSAhPSBudWxsID8gX3JlZjIgOiAxMDA7XG4gICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0gIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9jdW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRMYWdNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50TGFnTW9uaXRvcigpIHtcbiAgICAgIHZhciBhdmcsIGludGVydmFsLCBsYXN0LCBwb2ludHMsIHNhbXBsZXMsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgYXZnID0gMDtcbiAgICAgIHNhbXBsZXMgPSBbXTtcbiAgICAgIHBvaW50cyA9IDA7XG4gICAgICBsYXN0ID0gbm93KCk7XG4gICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlmZjtcbiAgICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdCAtIDUwO1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHNhbXBsZXMucHVzaChkaWZmKTtcbiAgICAgICAgaWYgKHNhbXBsZXMubGVuZ3RoID4gb3B0aW9ucy5ldmVudExhZy5zYW1wbGVDb3VudCkge1xuICAgICAgICAgIHNhbXBsZXMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhdmcgPSBhdmdBbXBsaXR1ZGUoc2FtcGxlcyk7XG4gICAgICAgIGlmICgrK3BvaW50cyA+PSBvcHRpb25zLmV2ZW50TGFnLm1pblNhbXBsZXMgJiYgYXZnIDwgb3B0aW9ucy5ldmVudExhZy5sYWdUaHJlc2hvbGQpIHtcbiAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICByZXR1cm4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogKDMgLyAoYXZnICsgMykpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEV2ZW50TGFnTW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIFNjYWxlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTY2FsZXIoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMubGFzdCA9IHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgIHRoaXMucmF0ZSA9IG9wdGlvbnMuaW5pdGlhbFJhdGU7XG4gICAgICB0aGlzLmNhdGNodXAgPSAwO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMubGFzdFByb2dyZXNzID0gMDtcbiAgICAgIGlmICh0aGlzLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNjYWxlci5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKGZyYW1lVGltZSwgdmFsKSB7XG4gICAgICB2YXIgc2NhbGluZztcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICB2YWwgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+PSAxMDApIHtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPT09IHRoaXMubGFzdCkge1xuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSArPSBmcmFtZVRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zaW5jZUxhc3RVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLnJhdGUgPSAodmFsIC0gdGhpcy5sYXN0KSAvIHRoaXMuc2luY2VMYXN0VXBkYXRlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2F0Y2h1cCA9ICh2YWwgLSB0aGlzLnByb2dyZXNzKSAvIG9wdGlvbnMuY2F0Y2h1cFRpbWU7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgICAgdGhpcy5sYXN0ID0gdmFsO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+IHRoaXMucHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyArPSB0aGlzLmNhdGNodXAgKiBmcmFtZVRpbWU7XG4gICAgICB9XG4gICAgICBzY2FsaW5nID0gMSAtIE1hdGgucG93KHRoaXMucHJvZ3Jlc3MgLyAxMDAsIG9wdGlvbnMuZWFzZUZhY3Rvcik7XG4gICAgICB0aGlzLnByb2dyZXNzICs9IHNjYWxpbmcgKiB0aGlzLnJhdGUgKiBmcmFtZVRpbWU7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4odGhpcy5sYXN0UHJvZ3Jlc3MgKyBvcHRpb25zLm1heFByb2dyZXNzUGVyRnJhbWUsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWF4KDAsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLmxhc3RQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjYWxlcjtcblxuICB9KSgpO1xuXG4gIHNvdXJjZXMgPSBudWxsO1xuXG4gIHNjYWxlcnMgPSBudWxsO1xuXG4gIGJhciA9IG51bGw7XG5cbiAgdW5pU2NhbGVyID0gbnVsbDtcblxuICBhbmltYXRpb24gPSBudWxsO1xuXG4gIGNhbmNlbEFuaW1hdGlvbiA9IG51bGw7XG5cbiAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG5cbiAgaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9wdGlvbnMucmVzdGFydE9uUHVzaFN0YXRlKSB7XG4gICAgICByZXR1cm4gUGFjZS5yZXN0YXJ0KCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgIT0gbnVsbCkge1xuICAgIF9wdXNoU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcHVzaFN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAod2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlICE9IG51bGwpIHtcbiAgICBfcmVwbGFjZVN0YXRlID0gd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlO1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICByZXR1cm4gX3JlcGxhY2VTdGF0ZS5hcHBseSh3aW5kb3cuaGlzdG9yeSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgU09VUkNFX0tFWVMgPSB7XG4gICAgYWpheDogQWpheE1vbml0b3IsXG4gICAgZWxlbWVudHM6IEVsZW1lbnRNb25pdG9yLFxuICAgIGRvY3VtZW50OiBEb2N1bWVudE1vbml0b3IsXG4gICAgZXZlbnRMYWc6IEV2ZW50TGFnTW9uaXRvclxuICB9O1xuXG4gIChpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHR5cGUsIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgIFBhY2Uuc291cmNlcyA9IHNvdXJjZXMgPSBbXTtcbiAgICBfcmVmMiA9IFsnYWpheCcsICdlbGVtZW50cycsICdkb2N1bWVudCcsICdldmVudExhZyddO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgdHlwZSA9IF9yZWYyW19qXTtcbiAgICAgIGlmIChvcHRpb25zW3R5cGVdICE9PSBmYWxzZSkge1xuICAgICAgICBzb3VyY2VzLnB1c2gobmV3IFNPVVJDRV9LRVlTW3R5cGVdKG9wdGlvbnNbdHlwZV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3JlZjQgPSAoX3JlZjMgPSBvcHRpb25zLmV4dHJhU291cmNlcykgIT0gbnVsbCA/IF9yZWYzIDogW107XG4gICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjQubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICBzb3VyY2UgPSBfcmVmNFtfa107XG4gICAgICBzb3VyY2VzLnB1c2gobmV3IHNvdXJjZShvcHRpb25zKSk7XG4gICAgfVxuICAgIFBhY2UuYmFyID0gYmFyID0gbmV3IEJhcjtcbiAgICBzY2FsZXJzID0gW107XG4gICAgcmV0dXJuIHVuaVNjYWxlciA9IG5ldyBTY2FsZXI7XG4gIH0pKCk7XG5cbiAgUGFjZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdzdG9wJyk7XG4gICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgYmFyLmRlc3Ryb3koKTtcbiAgICBjYW5jZWxBbmltYXRpb24gPSB0cnVlO1xuICAgIGlmIChhbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgICBhbmltYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdCgpO1xuICB9O1xuXG4gIFBhY2UucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhY2UudHJpZ2dlcigncmVzdGFydCcpO1xuICAgIFBhY2Uuc3RvcCgpO1xuICAgIHJldHVybiBQYWNlLnN0YXJ0KCk7XG4gIH07XG5cbiAgUGFjZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFydDtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIGJhci5yZW5kZXIoKTtcbiAgICBzdGFydCA9IG5vdygpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHJldHVybiBhbmltYXRpb24gPSBydW5BbmltYXRpb24oZnVuY3Rpb24oZnJhbWVUaW1lLCBlbnF1ZXVlTmV4dEZyYW1lKSB7XG4gICAgICB2YXIgYXZnLCBjb3VudCwgZG9uZSwgZWxlbWVudCwgZWxlbWVudHMsIGksIGosIHJlbWFpbmluZywgc2NhbGVyLCBzY2FsZXJMaXN0LCBzdW0sIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMjtcbiAgICAgIHJlbWFpbmluZyA9IDEwMCAtIGJhci5wcm9ncmVzcztcbiAgICAgIGNvdW50ID0gc3VtID0gMDtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgZm9yIChpID0gX2ogPSAwLCBfbGVuMSA9IHNvdXJjZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBpID0gKytfaikge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgICAgICBzY2FsZXJMaXN0ID0gc2NhbGVyc1tpXSAhPSBudWxsID8gc2NhbGVyc1tpXSA6IHNjYWxlcnNbaV0gPSBbXTtcbiAgICAgICAgZWxlbWVudHMgPSAoX3JlZjIgPSBzb3VyY2UuZWxlbWVudHMpICE9IG51bGwgPyBfcmVmMiA6IFtzb3VyY2VdO1xuICAgICAgICBmb3IgKGogPSBfayA9IDAsIF9sZW4yID0gZWxlbWVudHMubGVuZ3RoOyBfayA8IF9sZW4yOyBqID0gKytfaykge1xuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tqXTtcbiAgICAgICAgICBzY2FsZXIgPSBzY2FsZXJMaXN0W2pdICE9IG51bGwgPyBzY2FsZXJMaXN0W2pdIDogc2NhbGVyTGlzdFtqXSA9IG5ldyBTY2FsZXIoZWxlbWVudCk7XG4gICAgICAgICAgZG9uZSAmPSBzY2FsZXIuZG9uZTtcbiAgICAgICAgICBpZiAoc2NhbGVyLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHN1bSArPSBzY2FsZXIudGljayhmcmFtZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdmcgPSBzdW0gLyBjb3VudDtcbiAgICAgIGJhci51cGRhdGUodW5pU2NhbGVyLnRpY2soZnJhbWVUaW1lLCBhdmcpKTtcbiAgICAgIGlmIChiYXIuZG9uZSgpIHx8IGRvbmUgfHwgY2FuY2VsQW5pbWF0aW9uKSB7XG4gICAgICAgIGJhci51cGRhdGUoMTAwKTtcbiAgICAgICAgUGFjZS50cmlnZ2VyKCdkb25lJyk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGJhci5maW5pc2goKTtcbiAgICAgICAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gUGFjZS50cmlnZ2VyKCdoaWRlJyk7XG4gICAgICAgIH0sIE1hdGgubWF4KG9wdGlvbnMuZ2hvc3RUaW1lLCBNYXRoLm1heChvcHRpb25zLm1pblRpbWUgLSAobm93KCkgLSBzdGFydCksIDApKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZW5xdWV1ZU5leHRGcmFtZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFBhY2Uuc3RhcnQgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICAgIGV4dGVuZChvcHRpb25zLCBfb3B0aW9ucyk7XG4gICAgUGFjZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgYmFyLnJlbmRlcigpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICB9XG4gICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFjZScpKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChQYWNlLnN0YXJ0LCA1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFBhY2UudHJpZ2dlcignc3RhcnQnKTtcbiAgICAgIHJldHVybiBQYWNlLmdvKCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydwYWNlJ10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhY2U7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQYWNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChvcHRpb25zLnN0YXJ0T25QYWdlTG9hZCkge1xuICAgICAgUGFjZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiIWZ1bmN0aW9uKGUpe3ZhciB0O2UuZm4uc2xpbmt5PWZ1bmN0aW9uKGEpe3ZhciBzPWUuZXh0ZW5kKHtsYWJlbDpcIkJhY2tcIix0aXRsZTohMSxzcGVlZDozMDAscmVzaXplOiEwfSxhKSxpPWUodGhpcyksbj1pLmNoaWxkcmVuKCkuZmlyc3QoKTtpLmFkZENsYXNzKFwic2xpbmt5LW1lbnVcIik7dmFyIHI9ZnVuY3Rpb24oZSx0KXt2YXIgYT1NYXRoLnJvdW5kKHBhcnNlSW50KG4uZ2V0KDApLnN0eWxlLmxlZnQpKXx8MDtuLmNzcyhcImxlZnRcIixhLTEwMCplK1wiJVwiKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiZzZXRUaW1lb3V0KHQscy5zcGVlZCl9LGw9ZnVuY3Rpb24oZSl7aS5oZWlnaHQoZS5vdXRlckhlaWdodCgpKX0sZD1mdW5jdGlvbihlKXtpLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixlK1wibXNcIiksbi5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsZStcIm1zXCIpfTtpZihkKHMuc3BlZWQpLGUoXCJhICsgdWxcIixpKS5wcmV2KCkuYWRkQ2xhc3MoXCJuZXh0XCIpLGUoXCJsaSA+IHVsXCIsaSkucHJlcGVuZCgnPGxpIGNsYXNzPVwiaGVhZGVyXCI+Jykscy50aXRsZT09PSEwJiZlKFwibGkgPiB1bFwiLGkpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1lKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJhXCIpLmZpcnN0KCkudGV4dCgpLGE9ZShcIjxoMj5cIikudGV4dCh0KTtlKFwiPiAuaGVhZGVyXCIsdGhpcykuYXBwZW5kKGEpfSkscy50aXRsZXx8cy5sYWJlbCE9PSEwKXt2YXIgbz1lKFwiPGE+XCIpLnRleHQocy5sYWJlbCkucHJvcChcImhyZWZcIixcIiNcIikuYWRkQ2xhc3MoXCJiYWNrXCIpO2UoXCIuaGVhZGVyXCIsaSkuYXBwZW5kKG8pfWVsc2UgZShcImxpID4gdWxcIixpKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9ZSh0aGlzKS5wYXJlbnQoKS5maW5kKFwiYVwiKS5maXJzdCgpLnRleHQoKSxhPWUoXCI8YT5cIikudGV4dCh0KS5wcm9wKFwiaHJlZlwiLFwiI1wiKS5hZGRDbGFzcyhcImJhY2tcIik7ZShcIj4gLmhlYWRlclwiLHRoaXMpLmFwcGVuZChhKX0pO2UoXCJhXCIsaSkub24oXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2lmKCEodCtzLnNwZWVkPkRhdGUubm93KCkpKXt0PURhdGUubm93KCk7dmFyIG49ZSh0aGlzKTsvIy8udGVzdCh0aGlzLmhyZWYpJiZhLnByZXZlbnREZWZhdWx0KCksbi5oYXNDbGFzcyhcIm5leHRcIik/KGkuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksbi5uZXh0KCkuc2hvdygpLmFkZENsYXNzKFwiYWN0aXZlXCIpLHIoMSkscy5yZXNpemUmJmwobi5uZXh0KCkpKTpuLmhhc0NsYXNzKFwiYmFja1wiKSYmKHIoLTEsZnVuY3Rpb24oKXtpLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLG4ucGFyZW50KCkucGFyZW50KCkuaGlkZSgpLnBhcmVudHNVbnRpbChpLFwidWxcIikuZmlyc3QoKS5hZGRDbGFzcyhcImFjdGl2ZVwiKX0pLHMucmVzaXplJiZsKG4ucGFyZW50KCkucGFyZW50KCkucGFyZW50c1VudGlsKGksXCJ1bFwiKSkpfX0pLHRoaXMuanVtcD1mdW5jdGlvbih0LGEpe3Q9ZSh0KTt2YXIgbj1pLmZpbmQoXCIuYWN0aXZlXCIpO249bi5sZW5ndGg+MD9uLnBhcmVudHNVbnRpbChpLFwidWxcIikubGVuZ3RoOjAsaS5maW5kKFwidWxcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuaGlkZSgpO3ZhciBvPXQucGFyZW50c1VudGlsKGksXCJ1bFwiKTtvLnNob3coKSx0LnNob3coKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxhPT09ITEmJmQoMCkscihvLmxlbmd0aC1uKSxzLnJlc2l6ZSYmbCh0KSxhPT09ITEmJmQocy5zcGVlZCl9LHRoaXMuaG9tZT1mdW5jdGlvbih0KXt0PT09ITEmJmQoMCk7dmFyIGE9aS5maW5kKFwiLmFjdGl2ZVwiKSxuPWEucGFyZW50c1VudGlsKGksXCJsaVwiKS5sZW5ndGg7bj4wJiYocigtbixmdW5jdGlvbigpe2EucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIil9KSxzLnJlc2l6ZSYmbChlKGEucGFyZW50c1VudGlsKGksXCJsaVwiKS5nZXQobi0xKSkucGFyZW50KCkpKSx0PT09ITEmJmQocy5zcGVlZCl9LHRoaXMuZGVzdHJveT1mdW5jdGlvbigpe2UoXCIuaGVhZGVyXCIsaSkucmVtb3ZlKCksZShcImFcIixpKS5yZW1vdmVDbGFzcyhcIm5leHRcIikub2ZmKFwiY2xpY2tcIiksaS5yZW1vdmVDbGFzcyhcInNsaW5reS1tZW51XCIpLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixcIlwiKSxuLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixcIlwiKX07dmFyIGM9aS5maW5kKFwiLmFjdGl2ZVwiKTtyZXR1cm4gYy5sZW5ndGg+MCYmKGMucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksdGhpcy5qdW1wKGMsITEpKSx0aGlzfX0oalF1ZXJ5KTsiLCJ2YXIgdG5zID0gKGZ1bmN0aW9uICgpe1xuLy8gT2JqZWN0LmtleXNcbmlmICghT2JqZWN0LmtleXMpIHtcbiAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfTtcbn1cblxuLy8gQ2hpbGROb2RlLnJlbW92ZVxuaWYoIShcInJlbW92ZVwiIGluIEVsZW1lbnQucHJvdG90eXBlKSl7XG4gIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYodGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgd2luID0gd2luZG93O1xuXG52YXIgcmFmID0gd2luLnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IGZ1bmN0aW9uKGNiKSB7IHJldHVybiBzZXRUaW1lb3V0KGNiLCAxNik7IH07XG5cbnZhciB3aW4kMSA9IHdpbmRvdztcblxudmFyIGNhZiA9IHdpbiQxLmNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbiQxLm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gIHx8IGZ1bmN0aW9uKGlkKXsgY2xlYXJUaW1lb3V0KGlkKTsgfTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICB2YXIgb2JqLCBuYW1lLCBjb3B5LFxuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgaSA9IDEsXG4gICAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKG9iaiA9IGFyZ3VtZW50c1tpXSkgIT09IG51bGwpIHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgY29weSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGFyZ2V0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBjaGVja1N0b3JhZ2VWYWx1ZSAodmFsdWUpIHtcbiAgcmV0dXJuIFsndHJ1ZScsICdmYWxzZSddLmluZGV4T2YodmFsdWUpID49IDAgPyBKU09OLnBhcnNlKHZhbHVlKSA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBzZXRMb2NhbFN0b3JhZ2Uoc3RvcmFnZSwga2V5LCB2YWx1ZSwgYWNjZXNzKSB7XG4gIGlmIChhY2Nlc3MpIHtcbiAgICB0cnkgeyBzdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7IH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRTbGlkZUlkKCkge1xuICB2YXIgaWQgPSB3aW5kb3cudG5zSWQ7XG4gIHdpbmRvdy50bnNJZCA9ICFpZCA/IDEgOiBpZCArIDE7XG4gIFxuICByZXR1cm4gJ3RucycgKyB3aW5kb3cudG5zSWQ7XG59XG5cbmZ1bmN0aW9uIGdldEJvZHkgKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZG9jLmJvZHk7XG5cbiAgaWYgKCFib2R5KSB7XG4gICAgYm9keSA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgYm9keS5mYWtlID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBib2R5O1xufVxuXG52YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuZnVuY3Rpb24gc2V0RmFrZUJvZHkgKGJvZHkpIHtcbiAgdmFyIGRvY092ZXJmbG93ID0gJyc7XG4gIGlmIChib2R5LmZha2UpIHtcbiAgICBkb2NPdmVyZmxvdyA9IGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3c7XG4gICAgLy9hdm9pZCBjcmFzaGluZyBJRTgsIGlmIGJhY2tncm91bmQgaW1hZ2UgaXMgdXNlZFxuICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xuICAgIC8vU2FmYXJpIDUuMTMvNS4xLjQgT1NYIHN0b3BzIGxvYWRpbmcgaWYgOjotd2Via2l0LXNjcm9sbGJhciBpcyB1c2VkIGFuZCBzY3JvbGxiYXJzIGFyZSB2aXNpYmxlXG4gICAgYm9keS5zdHlsZS5vdmVyZmxvdyA9IGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKGJvZHkpO1xuICB9XG5cbiAgcmV0dXJuIGRvY092ZXJmbG93O1xufVxuXG5mdW5jdGlvbiByZXNldEZha2VCb2R5IChib2R5LCBkb2NPdmVyZmxvdykge1xuICBpZiAoYm9keS5mYWtlKSB7XG4gICAgYm9keS5yZW1vdmUoKTtcbiAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gZG9jT3ZlcmZsb3c7XG4gICAgLy8gVHJpZ2dlciBsYXlvdXQgc28ga2luZXRpYyBzY3JvbGxpbmcgaXNuJ3QgZGlzYWJsZWQgaW4gaU9TNitcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBkb2NFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgfVxufVxuXG4vLyBnZXQgY3NzLWNhbGMgXG5cbmZ1bmN0aW9uIGNhbGMoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCwgXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSwgXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICBib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gIHRyeSB7XG4gICAgdmFyIHN0ciA9ICcoMTBweCAqIDEwKScsXG4gICAgICAgIHZhbHMgPSBbJ2NhbGMnICsgc3RyLCAnLW1vei1jYWxjJyArIHN0ciwgJy13ZWJraXQtY2FsYycgKyBzdHJdLFxuICAgICAgICB2YWw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIHZhbCA9IHZhbHNbaV07XG4gICAgICBkaXYuc3R5bGUud2lkdGggPSB2YWw7XG4gICAgICBpZiAoZGl2Lm9mZnNldFdpZHRoID09PSAxMDApIHsgXG4gICAgICAgIHJlc3VsdCA9IHZhbC5yZXBsYWNlKHN0ciwgJycpOyBcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7fVxuICBcbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBkaXYucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gZ2V0IHN1YnBpeGVsIHN1cHBvcnQgdmFsdWVcblxuZnVuY3Rpb24gcGVyY2VudGFnZUxheW91dCgpIHtcbiAgLy8gY2hlY2sgc3VicGl4ZWwgbGF5b3V0IHN1cHBvcnRpbmdcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICB3cmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgb3V0ZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBzdHIgPSAnJyxcbiAgICAgIGNvdW50ID0gNzAsXG4gICAgICBwZXJQYWdlID0gMyxcbiAgICAgIHN1cHBvcnRlZCA9IGZhbHNlO1xuXG4gIHdyYXBwZXIuY2xhc3NOYW1lID0gXCJ0bnMtdC1zdWJwMlwiO1xuICBvdXRlci5jbGFzc05hbWUgPSBcInRucy10LWN0XCI7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgc3RyICs9ICc8ZGl2PjwvZGl2Pic7XG4gIH1cblxuICBvdXRlci5pbm5lckhUTUwgPSBzdHI7XG4gIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXIpO1xuICBib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gIHN1cHBvcnRlZCA9IE1hdGguYWJzKHdyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIG91dGVyLmNoaWxkcmVuW2NvdW50IC0gcGVyUGFnZV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgPCAyO1xuXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogd3JhcHBlci5yZW1vdmUoKTtcblxuICByZXR1cm4gc3VwcG9ydGVkO1xufVxuXG5mdW5jdGlvbiBtZWRpYXF1ZXJ5U3VwcG9ydCAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgc3R5bGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKSxcbiAgICAgIHJ1bGUgPSAnQG1lZGlhIGFsbCBhbmQgKG1pbi13aWR0aDoxcHgpey50bnMtbXEtdGVzdHtwb3NpdGlvbjphYnNvbHV0ZX19JyxcbiAgICAgIHBvc2l0aW9uO1xuXG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICBkaXYuY2xhc3NOYW1lID0gJ3Rucy1tcS10ZXN0JztcblxuICBib2R5LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcnVsZTtcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUocnVsZSkpO1xuICB9XG5cbiAgcG9zaXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRpdikucG9zaXRpb24gOiBkaXYuY3VycmVudFN0eWxlWydwb3NpdGlvbiddO1xuXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZGl2LnJlbW92ZSgpO1xuXG4gIHJldHVybiBwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiO1xufVxuXG4vLyBjcmVhdGUgYW5kIGFwcGVuZCBzdHlsZSBzaGVldFxuZnVuY3Rpb24gY3JlYXRlU3R5bGVTaGVldCAobWVkaWEpIHtcbiAgLy8gQ3JlYXRlIHRoZSA8c3R5bGU+IHRhZ1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcblxuICAvLyBBZGQgYSBtZWRpYSAoYW5kL29yIG1lZGlhIHF1ZXJ5KSBoZXJlIGlmIHlvdSdkIGxpa2UhXG4gIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIFwic2NyZWVuXCIpXG4gIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAxMDI0cHgpXCIpXG4gIGlmIChtZWRpYSkgeyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSk7IH1cblxuICAvLyBXZWJLaXQgaGFjayA6KFxuICAvLyBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSk7XG5cbiAgLy8gQWRkIHRoZSA8c3R5bGU+IGVsZW1lbnQgdG8gdGhlIHBhZ2VcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICByZXR1cm4gc3R5bGUuc2hlZXQgPyBzdHlsZS5zaGVldCA6IHN0eWxlLnN0eWxlU2hlZXQ7XG59XG5cbi8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXG5mdW5jdGlvbiBhZGRDU1NSdWxlKHNoZWV0LCBzZWxlY3RvciwgcnVsZXMsIGluZGV4KSB7XG4gIC8vIHJldHVybiByYWYoZnVuY3Rpb24oKSB7XG4gICAgJ2luc2VydFJ1bGUnIGluIHNoZWV0ID9cbiAgICAgIHNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3IgKyAneycgKyBydWxlcyArICd9JywgaW5kZXgpIDpcbiAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIHJ1bGVzLCBpbmRleCk7XG4gIC8vIH0pO1xufVxuXG4vLyBjcm9zcyBicm93c2VycyBhZGRSdWxlIG1ldGhvZFxuZnVuY3Rpb24gcmVtb3ZlQ1NTUnVsZShzaGVldCwgaW5kZXgpIHtcbiAgLy8gcmV0dXJuIHJhZihmdW5jdGlvbigpIHtcbiAgICAnZGVsZXRlUnVsZScgaW4gc2hlZXQgP1xuICAgICAgc2hlZXQuZGVsZXRlUnVsZShpbmRleCkgOlxuICAgICAgc2hlZXQucmVtb3ZlUnVsZShpbmRleCk7XG4gIC8vIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkge1xuICB2YXIgcnVsZSA9ICgnaW5zZXJ0UnVsZScgaW4gc2hlZXQpID8gc2hlZXQuY3NzUnVsZXMgOiBzaGVldC5ydWxlcztcbiAgcmV0dXJuIHJ1bGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiB0b0RlZ3JlZSAoeSwgeCkge1xuICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KSAqICgxODAgLyBNYXRoLlBJKTtcbn1cblxuZnVuY3Rpb24gZ2V0VG91Y2hEaXJlY3Rpb24oYW5nbGUsIHJhbmdlKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBmYWxzZSxcbiAgICAgIGdhcCA9IE1hdGguYWJzKDkwIC0gTWF0aC5hYnMoYW5nbGUpKTtcbiAgICAgIFxuICBpZiAoZ2FwID49IDkwIC0gcmFuZ2UpIHtcbiAgICBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gIH0gZWxzZSBpZiAoZ2FwIDw9IHJhbmdlKSB7XG4gICAgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgfVxuXG4gIHJldHVybiBkaXJlY3Rpb247XG59XG5cbi8vIGh0dHBzOi8vdG9kZG1vdHRvLmNvbS9kaXRjaC10aGUtYXJyYXktZm9yZWFjaC1jYWxsLW5vZGVsaXN0LWhhY2svXG5mdW5jdGlvbiBmb3JFYWNoIChhcnIsIGNhbGxiYWNrLCBzY29wZSkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjYWxsYmFjay5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpO1xuICB9XG59XG5cbnZhciBjbGFzc0xpc3RTdXBwb3J0ID0gJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnXycpO1xuXG52YXIgaGFzQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cbiAgICBmdW5jdGlvbiAoZWwsIHN0cikgeyByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKHN0cik7IH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7IHJldHVybiBlbC5jbGFzc05hbWUuaW5kZXhPZihzdHIpID49IDA7IH07XG5cbnZhciBhZGRDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoIWhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc0xpc3QuYWRkKHN0cik7IH1cbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKCFoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NOYW1lICs9ICcgJyArIHN0cjsgfVxuICAgIH07XG5cbnZhciByZW1vdmVDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoc3RyKTsgfVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoaGFzQ2xhc3MoZWwsIHN0cikpIHsgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2Uoc3RyLCAnJyk7IH1cbiAgICB9O1xuXG5mdW5jdGlvbiBoYXNBdHRyKGVsLCBhdHRyKSB7XG4gIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHIoZWwsIGF0dHIpIHtcbiAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlTGlzdChlbCkge1xuICAvLyBPbmx5IE5vZGVMaXN0IGhhcyB0aGUgXCJpdGVtKClcIiBmdW5jdGlvblxuICByZXR1cm4gdHlwZW9mIGVsLml0ZW0gIT09IFwidW5kZWZpbmVkXCI7IFxufVxuXG5mdW5jdGlvbiBzZXRBdHRycyhlbHMsIGF0dHJzKSB7XG4gIGVscyA9IChpc05vZGVMaXN0KGVscykgfHwgZWxzIGluc3RhbmNlb2YgQXJyYXkpID8gZWxzIDogW2Vsc107XG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXR0cnMpICE9PSAnW29iamVjdCBPYmplY3RdJykgeyByZXR1cm47IH1cblxuICBmb3IgKHZhciBpID0gZWxzLmxlbmd0aDsgaS0tOykge1xuICAgIGZvcih2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICBlbHNbaV0uc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUF0dHJzKGVscywgYXR0cnMpIHtcbiAgZWxzID0gKGlzTm9kZUxpc3QoZWxzKSB8fCBlbHMgaW5zdGFuY2VvZiBBcnJheSkgPyBlbHMgOiBbZWxzXTtcbiAgYXR0cnMgPSAoYXR0cnMgaW5zdGFuY2VvZiBBcnJheSkgPyBhdHRycyA6IFthdHRyc107XG5cbiAgdmFyIGF0dHJMZW5ndGggPSBhdHRycy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSBlbHMubGVuZ3RoOyBpLS07KSB7XG4gICAgZm9yICh2YXIgaiA9IGF0dHJMZW5ndGg7IGotLTspIHtcbiAgICAgIGVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoYXR0cnNbal0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcnJheUZyb21Ob2RlTGlzdCAobmwpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IG5sLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGFyci5wdXNoKG5sW2ldKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBoaWRlRWxlbWVudChlbCwgZm9yY2VIaWRlKSB7XG4gIGlmIChlbC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHsgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgfVxufVxuXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbCwgZm9yY2VIaWRlKSB7XG4gIGlmIChlbC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHsgZWwuc3R5bGUuZGlzcGxheSA9ICcnOyB9XG59XG5cbmZ1bmN0aW9uIGlzVmlzaWJsZShlbCkge1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgIT09ICdub25lJztcbn1cblxuZnVuY3Rpb24gd2hpY2hQcm9wZXJ0eShwcm9wcyl7XG4gIGlmICh0eXBlb2YgcHJvcHMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIGFyciA9IFtwcm9wc10sXG4gICAgICAgIFByb3BzID0gcHJvcHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wcy5zdWJzdHIoMSksXG4gICAgICAgIHByZWZpeGVzID0gWydXZWJraXQnLCAnTW96JywgJ21zJywgJ08nXTtcbiAgICAgICAgXG4gICAgcHJlZml4ZXMuZm9yRWFjaChmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIGlmIChwcmVmaXggIT09ICdtcycgfHwgcHJvcHMgPT09ICd0cmFuc2Zvcm0nKSB7XG4gICAgICAgIGFyci5wdXNoKHByZWZpeCArIFByb3BzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHByb3BzID0gYXJyO1xuICB9XG5cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKSxcbiAgICAgIGxlbiA9IHByb3BzLmxlbmd0aDtcbiAgZm9yKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKXtcbiAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xuICAgIGlmKCBlbC5zdHlsZVtwcm9wXSAhPT0gdW5kZWZpbmVkICl7IHJldHVybiBwcm9wOyB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7IC8vIGV4cGxpY2l0IGZvciBpZTktXG59XG5cbmZ1bmN0aW9uIGhhczNEVHJhbnNmb3Jtcyh0Zil7XG4gIGlmICghdGYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICghd2luZG93LmdldENvbXB1dGVkU3R5bGUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIFxuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKSxcbiAgICAgIGhhczNkLFxuICAgICAgY3NzVEYgPSB0Zi5sZW5ndGggPiA5ID8gJy0nICsgdGYuc2xpY2UoMCwgLTkpLnRvTG93ZXJDYXNlKCkgKyAnLScgOiAnJztcblxuICBjc3NURiArPSAndHJhbnNmb3JtJztcblxuICAvLyBBZGQgaXQgdG8gdGhlIGJvZHkgdG8gZ2V0IHRoZSBjb21wdXRlZCBzdHlsZVxuICBib2R5Lmluc2VydEJlZm9yZShlbCwgbnVsbCk7XG5cbiAgZWwuc3R5bGVbdGZdID0gJ3RyYW5zbGF0ZTNkKDFweCwxcHgsMXB4KSc7XG4gIGhhczNkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoY3NzVEYpO1xuXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZWwucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIChoYXMzZCAhPT0gdW5kZWZpbmVkICYmIGhhczNkLmxlbmd0aCA+IDAgJiYgaGFzM2QgIT09IFwibm9uZVwiKTtcbn1cblxuLy8gZ2V0IHRyYW5zaXRpb25lbmQsIGFuaW1hdGlvbmVuZCBiYXNlZCBvbiB0cmFuc2l0aW9uRHVyYXRpb25cbi8vIEBwcm9waW46IHN0cmluZ1xuLy8gQHByb3BPdXQ6IHN0cmluZywgZmlyc3QtbGV0dGVyIHVwcGVyY2FzZVxuLy8gVXNhZ2U6IGdldEVuZFByb3BlcnR5KCdXZWJraXRUcmFuc2l0aW9uRHVyYXRpb24nLCAnVHJhbnNpdGlvbicpID0+IHdlYmtpdFRyYW5zaXRpb25FbmRcbmZ1bmN0aW9uIGdldEVuZFByb3BlcnR5KHByb3BJbiwgcHJvcE91dCkge1xuICB2YXIgZW5kUHJvcCA9IGZhbHNlO1xuICBpZiAoL15XZWJraXQvLnRlc3QocHJvcEluKSkge1xuICAgIGVuZFByb3AgPSAnd2Via2l0JyArIHByb3BPdXQgKyAnRW5kJztcbiAgfSBlbHNlIGlmICgvXk8vLnRlc3QocHJvcEluKSkge1xuICAgIGVuZFByb3AgPSAnbycgKyBwcm9wT3V0ICsgJ0VuZCc7XG4gIH0gZWxzZSBpZiAocHJvcEluKSB7XG4gICAgZW5kUHJvcCA9IHByb3BPdXQudG9Mb3dlckNhc2UoKSArICdlbmQnO1xuICB9XG4gIHJldHVybiBlbmRQcm9wO1xufVxuXG4vLyBUZXN0IHZpYSBhIGdldHRlciBpbiB0aGUgb3B0aW9ucyBvYmplY3QgdG8gc2VlIGlmIHRoZSBwYXNzaXZlIHByb3BlcnR5IGlzIGFjY2Vzc2VkXG52YXIgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XG50cnkge1xuICB2YXIgb3B0cyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsIG51bGwsIG9wdHMpO1xufSBjYXRjaCAoZSkge31cbnZhciBwYXNzaXZlT3B0aW9uID0gc3VwcG9ydHNQYXNzaXZlID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZTtcblxuZnVuY3Rpb24gYWRkRXZlbnRzKGVsLCBvYmosIHByZXZlbnRTY3JvbGxpbmcpIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICB2YXIgb3B0aW9uID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZSddLmluZGV4T2YocHJvcCkgPj0gMCAmJiAhcHJldmVudFNjcm9sbGluZyA/IHBhc3NpdmVPcHRpb24gOiBmYWxzZTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKHByb3AsIG9ialtwcm9wXSwgb3B0aW9uKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudHMoZWwsIG9iaikge1xuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIEV2ZW50cygpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3BpY3M6IHt9LFxuICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXSA9IHRoaXMudG9waWNzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICBpZiAodGhpcy50b3BpY3NbZXZlbnROYW1lXSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9waWNzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy50b3BpY3NbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICBkYXRhLnR5cGUgPSBldmVudE5hbWU7XG4gICAgICBpZiAodGhpcy50b3BpY3NbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICBmbihkYXRhLCBldmVudE5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGpzVHJhbnNmb3JtKGVsZW1lbnQsIGF0dHIsIHByZWZpeCwgcG9zdGZpeCwgdG8sIGR1cmF0aW9uLCBjYWxsYmFjaykge1xuICB2YXIgdGljayA9IE1hdGgubWluKGR1cmF0aW9uLCAxMCksXG4gICAgICB1bml0ID0gKHRvLmluZGV4T2YoJyUnKSA+PSAwKSA/ICclJyA6ICdweCcsXG4gICAgICB0byA9IHRvLnJlcGxhY2UodW5pdCwgJycpLFxuICAgICAgZnJvbSA9IE51bWJlcihlbGVtZW50LnN0eWxlW2F0dHJdLnJlcGxhY2UocHJlZml4LCAnJykucmVwbGFjZShwb3N0Zml4LCAnJykucmVwbGFjZSh1bml0LCAnJykpLFxuICAgICAgcG9zaXRpb25UaWNrID0gKHRvIC0gZnJvbSkgLyBkdXJhdGlvbiAqIHRpY2ssXG4gICAgICBydW5uaW5nO1xuXG4gIHNldFRpbWVvdXQobW92ZUVsZW1lbnQsIHRpY2spO1xuICBmdW5jdGlvbiBtb3ZlRWxlbWVudCgpIHtcbiAgICBkdXJhdGlvbiAtPSB0aWNrO1xuICAgIGZyb20gKz0gcG9zaXRpb25UaWNrO1xuICAgIGVsZW1lbnQuc3R5bGVbYXR0cl0gPSBwcmVmaXggKyBmcm9tICsgdW5pdCArIHBvc3RmaXg7XG4gICAgaWYgKGR1cmF0aW9uID4gMCkgeyBcbiAgICAgIHNldFRpbWVvdXQobW92ZUVsZW1lbnQsIHRpY2spOyBcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIHRucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGV4dGVuZCh7XG4gICAgY29udGFpbmVyOiAnLnNsaWRlcicsXG4gICAgbW9kZTogJ2Nhcm91c2VsJyxcbiAgICBheGlzOiAnaG9yaXpvbnRhbCcsXG4gICAgaXRlbXM6IDEsXG4gICAgZ3V0dGVyOiAwLFxuICAgIGVkZ2VQYWRkaW5nOiAwLFxuICAgIGZpeGVkV2lkdGg6IGZhbHNlLFxuICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgdmlld3BvcnRNYXg6IGZhbHNlLFxuICAgIHNsaWRlQnk6IDEsXG4gICAgY2VudGVyOiBmYWxzZSxcbiAgICBjb250cm9sczogdHJ1ZSxcbiAgICBjb250cm9sc1Bvc2l0aW9uOiAndG9wJyxcbiAgICBjb250cm9sc1RleHQ6IFsncHJldicsICduZXh0J10sXG4gICAgY29udHJvbHNDb250YWluZXI6IGZhbHNlLFxuICAgIHByZXZCdXR0b246IGZhbHNlLFxuICAgIG5leHRCdXR0b246IGZhbHNlLFxuICAgIG5hdjogdHJ1ZSxcbiAgICBuYXZQb3NpdGlvbjogJ3RvcCcsXG4gICAgbmF2Q29udGFpbmVyOiBmYWxzZSxcbiAgICBuYXZBc1RodW1ibmFpbHM6IGZhbHNlLFxuICAgIGFycm93S2V5czogZmFsc2UsXG4gICAgc3BlZWQ6IDMwMCxcbiAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgYXV0b3BsYXlQb3NpdGlvbjogJ3RvcCcsXG4gICAgYXV0b3BsYXlUaW1lb3V0OiA1MDAwLFxuICAgIGF1dG9wbGF5RGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gICAgYXV0b3BsYXlUZXh0OiBbJ3N0YXJ0JywgJ3N0b3AnXSxcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6IGZhbHNlLFxuICAgIGF1dG9wbGF5QnV0dG9uOiBmYWxzZSxcbiAgICBhdXRvcGxheUJ1dHRvbk91dHB1dDogdHJ1ZSxcbiAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogJ3Rucy1mYWRlSW4nLFxuICAgIGFuaW1hdGVPdXQ6ICd0bnMtZmFkZU91dCcsXG4gICAgYW5pbWF0ZU5vcm1hbDogJ3Rucy1ub3JtYWwnLFxuICAgIGFuaW1hdGVEZWxheTogZmFsc2UsXG4gICAgbG9vcDogdHJ1ZSxcbiAgICByZXdpbmQ6IGZhbHNlLFxuICAgIGF1dG9IZWlnaHQ6IGZhbHNlLFxuICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgIGxhenlsb2FkOiBmYWxzZSxcbiAgICBsYXp5bG9hZFNlbGVjdG9yOiAnLnRucy1sYXp5LWltZycsXG4gICAgdG91Y2g6IHRydWUsXG4gICAgbW91c2VEcmFnOiBmYWxzZSxcbiAgICBzd2lwZUFuZ2xlOiAxNSxcbiAgICBuZXN0ZWQ6IGZhbHNlLFxuICAgIHByZXZlbnRBY3Rpb25XaGVuUnVubmluZzogZmFsc2UsXG4gICAgcHJldmVudFNjcm9sbE9uVG91Y2g6IGZhbHNlLFxuICAgIGZyZWV6YWJsZTogdHJ1ZSxcbiAgICBvbkluaXQ6IGZhbHNlLFxuICAgIHVzZUxvY2FsU3RvcmFnZTogdHJ1ZVxuICB9LCBvcHRpb25zIHx8IHt9KTtcbiAgXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIHdpbiA9IHdpbmRvdyxcbiAgICAgIEtFWVMgPSB7XG4gICAgICAgIEVOVEVSOiAxMyxcbiAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICBMRUZUOiAzNyxcbiAgICAgICAgUklHSFQ6IDM5XG4gICAgICB9LFxuICAgICAgdG5zU3RvcmFnZSA9IHt9LFxuICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gb3B0aW9ucy51c2VMb2NhbFN0b3JhZ2U7XG5cbiAgaWYgKGxvY2FsU3RvcmFnZUFjY2Vzcykge1xuICAgIC8vIGNoZWNrIGJyb3dzZXIgdmVyc2lvbiBhbmQgbG9jYWwgc3RvcmFnZSBhY2Nlc3NcbiAgICB2YXIgYnJvd3NlckluZm8gPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHZhciB1aWQgPSBuZXcgRGF0ZTtcblxuICAgIHRyeSB7XG4gICAgICB0bnNTdG9yYWdlID0gd2luLmxvY2FsU3RvcmFnZTtcbiAgICAgIGlmICh0bnNTdG9yYWdlKSB7XG4gICAgICAgIHRuc1N0b3JhZ2Uuc2V0SXRlbSh1aWQsIHVpZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IHRuc1N0b3JhZ2UuZ2V0SXRlbSh1aWQpID09IHVpZDtcbiAgICAgICAgdG5zU3RvcmFnZS5yZW1vdmVJdGVtKHVpZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghbG9jYWxTdG9yYWdlQWNjZXNzKSB7IHRuc1N0b3JhZ2UgPSB7fTsgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsU3RvcmFnZUFjY2Vzcykge1xuICAgICAgLy8gcmVtb3ZlIHN0b3JhZ2Ugd2hlbiBicm93c2VyIHZlcnNpb24gY2hhbmdlc1xuICAgICAgaWYgKHRuc1N0b3JhZ2VbJ3Ruc0FwcCddICYmIHRuc1N0b3JhZ2VbJ3Ruc0FwcCddICE9PSBicm93c2VySW5mbykge1xuICAgICAgICBbJ3RDJywgJ3RQTCcsICd0TVEnLCAndFRmJywgJ3QzRCcsICd0VER1JywgJ3RURGUnLCAndEFEdScsICd0QURlJywgJ3RURScsICd0QUUnXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgdG5zU3RvcmFnZS5yZW1vdmVJdGVtKGl0ZW0pOyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIHVwZGF0ZSBicm93c2VySW5mb1xuICAgICAgbG9jYWxTdG9yYWdlWyd0bnNBcHAnXSA9IGJyb3dzZXJJbmZvO1xuICAgIH1cbiAgfVxuXG4gIHZhciBDQUxDID0gdG5zU3RvcmFnZVsndEMnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RDJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QycsIGNhbGMoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFBFUkNFTlRBR0VMQVlPVVQgPSB0bnNTdG9yYWdlWyd0UEwnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RQTCddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFBMJywgcGVyY2VudGFnZUxheW91dCgpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQ1NTTVEgPSB0bnNTdG9yYWdlWyd0TVEnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RNUSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndE1RJywgbWVkaWFxdWVyeVN1cHBvcnQoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TRk9STSA9IHRuc1N0b3JhZ2VbJ3RUZiddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFRmJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VGYnLCB3aGljaFByb3BlcnR5KCd0cmFuc2Zvcm0nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEhBUzNEVFJBTlNGT1JNUyA9IHRuc1N0b3JhZ2VbJ3QzRCddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndDNEJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0M0QnLCBoYXMzRFRyYW5zZm9ybXMoVFJBTlNGT1JNKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TSVRJT05EVVJBVElPTiA9IHRuc1N0b3JhZ2VbJ3RURHUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURHUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURHUnLCB3aGljaFByb3BlcnR5KCd0cmFuc2l0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TSVRJT05ERUxBWSA9IHRuc1N0b3JhZ2VbJ3RURGUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURGUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURGUnLCB3aGljaFByb3BlcnR5KCd0cmFuc2l0aW9uRGVsYXknKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkRVUkFUSU9OID0gdG5zU3RvcmFnZVsndEFEdSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFEdSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFEdScsIHdoaWNoUHJvcGVydHkoJ2FuaW1hdGlvbkR1cmF0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBBTklNQVRJT05ERUxBWSA9IHRuc1N0b3JhZ2VbJ3RBRGUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRGUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRGUnLCB3aGljaFByb3BlcnR5KCdhbmltYXRpb25EZWxheScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkVORCA9IHRuc1N0b3JhZ2VbJ3RURSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFRFJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VEUnLCBnZXRFbmRQcm9wZXJ0eShUUkFOU0lUSU9ORFVSQVRJT04sICdUcmFuc2l0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBBTklNQVRJT05FTkQgPSB0bnNTdG9yYWdlWyd0QUUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFFJywgZ2V0RW5kUHJvcGVydHkoQU5JTUFUSU9ORFVSQVRJT04sICdBbmltYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKTtcblxuICAvLyBnZXQgZWxlbWVudCBub2RlcyBmcm9tIHNlbGVjdG9yc1xuICB2YXIgc3VwcG9ydENvbnNvbGVXYXJuID0gd2luLmNvbnNvbGUgJiYgdHlwZW9mIHdpbi5jb25zb2xlLndhcm4gPT09IFwiZnVuY3Rpb25cIixcbiAgICAgIHRuc0xpc3QgPSBbJ2NvbnRhaW5lcicsICdjb250cm9sc0NvbnRhaW5lcicsICdwcmV2QnV0dG9uJywgJ25leHRCdXR0b24nLCAnbmF2Q29udGFpbmVyJywgJ2F1dG9wbGF5QnV0dG9uJ10sIFxuICAgICAgb3B0aW9uc0VsZW1lbnRzID0ge307XG4gICAgICBcbiAgdG5zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNbaXRlbV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgc3RyID0gb3B0aW9uc1tpdGVtXSxcbiAgICAgICAgICBlbCA9IGRvYy5xdWVyeVNlbGVjdG9yKHN0cik7XG4gICAgICBvcHRpb25zRWxlbWVudHNbaXRlbV0gPSBzdHI7XG5cbiAgICAgIGlmIChlbCAmJiBlbC5ub2RlTmFtZSkge1xuICAgICAgICBvcHRpb25zW2l0ZW1dID0gZWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3VwcG9ydENvbnNvbGVXYXJuKSB7IGNvbnNvbGUud2FybignQ2FuXFwndCBmaW5kJywgb3B0aW9uc1tpdGVtXSk7IH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gbWFrZSBzdXJlIGF0IGxlYXN0IDEgc2xpZGVcbiAgaWYgKG9wdGlvbnMuY29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICBpZiAoc3VwcG9ydENvbnNvbGVXYXJuKSB7IGNvbnNvbGUud2FybignTm8gc2xpZGVzIGZvdW5kIGluJywgb3B0aW9ucy5jb250YWluZXIpOyB9XG4gICAgcmV0dXJuO1xuICAgfVxuXG4gIC8vIHVwZGF0ZSBvcHRpb25zXG4gIHZhciByZXNwb25zaXZlID0gb3B0aW9ucy5yZXNwb25zaXZlLFxuICAgICAgbmVzdGVkID0gb3B0aW9ucy5uZXN0ZWQsXG4gICAgICBjYXJvdXNlbCA9IG9wdGlvbnMubW9kZSA9PT0gJ2Nhcm91c2VsJyA/IHRydWUgOiBmYWxzZTtcblxuICBpZiAocmVzcG9uc2l2ZSkge1xuICAgIC8vIGFwcGx5IHJlc3BvbnNpdmVbMF0gdG8gb3B0aW9ucyBhbmQgcmVtb3ZlIGl0XG4gICAgaWYgKDAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCByZXNwb25zaXZlWzBdKTtcbiAgICAgIGRlbGV0ZSByZXNwb25zaXZlWzBdO1xuICAgIH1cblxuICAgIHZhciByZXNwb25zaXZlVGVtID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHJlc3BvbnNpdmUpIHtcbiAgICAgIHZhciB2YWwgPSByZXNwb25zaXZlW2tleV07XG4gICAgICAvLyB1cGRhdGUgcmVzcG9uc2l2ZVxuICAgICAgLy8gZnJvbTogMzAwOiAyXG4gICAgICAvLyB0bzogXG4gICAgICAvLyAgIDMwMDogeyBcbiAgICAgIC8vICAgICBpdGVtczogMiBcbiAgICAgIC8vICAgfSBcbiAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdudW1iZXInID8ge2l0ZW1zOiB2YWx9IDogdmFsO1xuICAgICAgcmVzcG9uc2l2ZVRlbVtrZXldID0gdmFsO1xuICAgIH1cbiAgICByZXNwb25zaXZlID0gcmVzcG9uc2l2ZVRlbTtcbiAgICByZXNwb25zaXZlVGVtID0gbnVsbDtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBvcHRpb25zXG4gIGZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnMgKG9iaikge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3NsaWRlQnknKSB7IG9ialtrZXldID0gJ3BhZ2UnOyB9XG4gICAgICAgIGlmIChrZXkgPT09ICdlZGdlUGFkZGluZycpIHsgb2JqW2tleV0gPSBmYWxzZTsgfVxuICAgICAgICBpZiAoa2V5ID09PSAnYXV0b0hlaWdodCcpIHsgb2JqW2tleV0gPSBmYWxzZTsgfVxuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgcmVzcG9uc2l2ZSBvcHRpb25zXG4gICAgICBpZiAoa2V5ID09PSAncmVzcG9uc2l2ZScpIHsgdXBkYXRlT3B0aW9ucyhvYmpba2V5XSk7IH1cbiAgICB9XG4gIH1cbiAgaWYgKCFjYXJvdXNlbCkgeyB1cGRhdGVPcHRpb25zKG9wdGlvbnMpOyB9XG5cblxuICAvLyA9PT0gZGVmaW5lIGFuZCBzZXQgdmFyaWFibGVzID09PVxuICBpZiAoIWNhcm91c2VsKSB7XG4gICAgb3B0aW9ucy5heGlzID0gJ2hvcml6b250YWwnO1xuICAgIG9wdGlvbnMuc2xpZGVCeSA9ICdwYWdlJztcbiAgICBvcHRpb25zLmVkZ2VQYWRkaW5nID0gZmFsc2U7XG5cbiAgICB2YXIgYW5pbWF0ZUluID0gb3B0aW9ucy5hbmltYXRlSW4sXG4gICAgICAgIGFuaW1hdGVPdXQgPSBvcHRpb25zLmFuaW1hdGVPdXQsXG4gICAgICAgIGFuaW1hdGVEZWxheSA9IG9wdGlvbnMuYW5pbWF0ZURlbGF5LFxuICAgICAgICBhbmltYXRlTm9ybWFsID0gb3B0aW9ucy5hbmltYXRlTm9ybWFsO1xuICB9XG5cbiAgdmFyIGhvcml6b250YWwgPSBvcHRpb25zLmF4aXMgPT09ICdob3Jpem9udGFsJyA/IHRydWUgOiBmYWxzZSxcbiAgICAgIG91dGVyV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIGlubmVyV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIG1pZGRsZVdyYXBwZXIsXG4gICAgICBjb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcixcbiAgICAgIGNvbnRhaW5lclBhcmVudCA9IGNvbnRhaW5lci5wYXJlbnROb2RlLFxuICAgICAgY29udGFpbmVySFRNTCA9IGNvbnRhaW5lci5vdXRlckhUTUwsXG4gICAgICBzbGlkZUl0ZW1zID0gY29udGFpbmVyLmNoaWxkcmVuLFxuICAgICAgc2xpZGVDb3VudCA9IHNsaWRlSXRlbXMubGVuZ3RoLFxuICAgICAgYnJlYWtwb2ludFpvbmUsXG4gICAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCksXG4gICAgICBpc09uID0gZmFsc2U7XG4gIGlmIChyZXNwb25zaXZlKSB7IHNldEJyZWFrcG9pbnRab25lKCk7IH1cbiAgaWYgKGNhcm91c2VsKSB7IGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0bnMtdnBmaXgnOyB9XG5cbiAgLy8gZml4ZWRXaWR0aDogdmlld3BvcnQgPiByaWdodEJvdW5kYXJ5ID4gaW5kZXhNYXhcbiAgdmFyIGF1dG9XaWR0aCA9IG9wdGlvbnMuYXV0b1dpZHRoLFxuICAgICAgZml4ZWRXaWR0aCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcpLFxuICAgICAgZWRnZVBhZGRpbmcgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJyksXG4gICAgICBndXR0ZXIgPSBnZXRPcHRpb24oJ2d1dHRlcicpLFxuICAgICAgdmlld3BvcnQgPSBnZXRWaWV3cG9ydFdpZHRoKCksXG4gICAgICBjZW50ZXIgPSBnZXRPcHRpb24oJ2NlbnRlcicpLFxuICAgICAgaXRlbXMgPSAhYXV0b1dpZHRoID8gTWF0aC5mbG9vcihnZXRPcHRpb24oJ2l0ZW1zJykpIDogMSxcbiAgICAgIHNsaWRlQnkgPSBnZXRPcHRpb24oJ3NsaWRlQnknKSxcbiAgICAgIHZpZXdwb3J0TWF4ID0gb3B0aW9ucy52aWV3cG9ydE1heCB8fCBvcHRpb25zLmZpeGVkV2lkdGhWaWV3cG9ydFdpZHRoLFxuICAgICAgYXJyb3dLZXlzID0gZ2V0T3B0aW9uKCdhcnJvd0tleXMnKSxcbiAgICAgIHNwZWVkID0gZ2V0T3B0aW9uKCdzcGVlZCcpLFxuICAgICAgcmV3aW5kID0gb3B0aW9ucy5yZXdpbmQsXG4gICAgICBsb29wID0gcmV3aW5kID8gZmFsc2UgOiBvcHRpb25zLmxvb3AsXG4gICAgICBhdXRvSGVpZ2h0ID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JyksXG4gICAgICBjb250cm9scyA9IGdldE9wdGlvbignY29udHJvbHMnKSxcbiAgICAgIGNvbnRyb2xzVGV4dCA9IGdldE9wdGlvbignY29udHJvbHNUZXh0JyksXG4gICAgICBuYXYgPSBnZXRPcHRpb24oJ25hdicpLFxuICAgICAgdG91Y2ggPSBnZXRPcHRpb24oJ3RvdWNoJyksXG4gICAgICBtb3VzZURyYWcgPSBnZXRPcHRpb24oJ21vdXNlRHJhZycpLFxuICAgICAgYXV0b3BsYXkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5JyksXG4gICAgICBhdXRvcGxheVRpbWVvdXQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGltZW91dCcpLFxuICAgICAgYXV0b3BsYXlUZXh0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRleHQnKSxcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA9IGdldE9wdGlvbignYXV0b3BsYXlIb3ZlclBhdXNlJyksXG4gICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5JyksXG4gICAgICBzaGVldCA9IGNyZWF0ZVN0eWxlU2hlZXQoKSxcbiAgICAgIGxhenlsb2FkID0gb3B0aW9ucy5sYXp5bG9hZCxcbiAgICAgIGxhenlsb2FkU2VsZWN0b3IgPSBvcHRpb25zLmxhenlsb2FkU2VsZWN0b3IsXG4gICAgICBzbGlkZVBvc2l0aW9ucywgLy8gY29sbGVjdGlvbiBvZiBzbGlkZSBwb3NpdGlvbnNcbiAgICAgIHNsaWRlSXRlbXNPdXQgPSBbXSxcbiAgICAgIGNsb25lQ291bnQgPSBsb29wID8gZ2V0Q2xvbmVDb3VudEZvckxvb3AoKSA6IDAsXG4gICAgICBzbGlkZUNvdW50TmV3ID0gIWNhcm91c2VsID8gc2xpZGVDb3VudCArIGNsb25lQ291bnQgOiBzbGlkZUNvdW50ICsgY2xvbmVDb3VudCAqIDIsXG4gICAgICBoYXNSaWdodERlYWRab25lID0gKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSAmJiAhbG9vcCA/IHRydWUgOiBmYWxzZSxcbiAgICAgIHJpZ2h0Qm91bmRhcnkgPSBmaXhlZFdpZHRoID8gZ2V0UmlnaHRCb3VuZGFyeSgpIDogbnVsbCxcbiAgICAgIHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtID0gKCFjYXJvdXNlbCB8fCAhbG9vcCkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAvLyB0cmFuc2Zvcm1cbiAgICAgIHRyYW5zZm9ybUF0dHIgPSBob3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcsXG4gICAgICB0cmFuc2Zvcm1QcmVmaXggPSAnJyxcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSAnJyxcbiAgICAgIC8vIGluZGV4XG4gICAgICBnZXRJbmRleE1heCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gY2VudGVyICYmICFsb29wID8gc2xpZGVDb3VudCAtIDEgOiBNYXRoLmNlaWwoLSByaWdodEJvdW5kYXJ5IC8gKGZpeGVkV2lkdGggKyBndXR0ZXIpKTsgfTtcbiAgICAgICAgfSBlbHNlIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc2xpZGVDb3VudE5ldzsgaS0tOykge1xuICAgICAgICAgICAgICBpZiAoc2xpZGVQb3NpdGlvbnNbaV0gPj0gLSByaWdodEJvdW5kYXJ5KSB7IHJldHVybiBpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY2VudGVyICYmIGNhcm91c2VsICYmICFsb29wKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzbGlkZUNvdW50IC0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBsb29wIHx8IGNhcm91c2VsID8gTWF0aC5tYXgoMCwgc2xpZGVDb3VudE5ldyAtIE1hdGguY2VpbChpdGVtcykpIDogc2xpZGVDb3VudE5ldyAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSkoKSxcbiAgICAgIGluZGV4ID0gZ2V0U3RhcnRJbmRleChnZXRPcHRpb24oJ3N0YXJ0SW5kZXgnKSksXG4gICAgICBpbmRleENhY2hlZCA9IGluZGV4LFxuICAgICAgZGlzcGxheUluZGV4ID0gZ2V0Q3VycmVudFNsaWRlKCksXG4gICAgICBpbmRleE1pbiA9IDAsXG4gICAgICBpbmRleE1heCA9ICFhdXRvV2lkdGggPyBnZXRJbmRleE1heCgpIDogbnVsbCxcbiAgICAgIC8vIHJlc2l6ZVxuICAgICAgcmVzaXplVGltZXIsXG4gICAgICBwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcgPSBvcHRpb25zLnByZXZlbnRBY3Rpb25XaGVuUnVubmluZyxcbiAgICAgIHN3aXBlQW5nbGUgPSBvcHRpb25zLnN3aXBlQW5nbGUsXG4gICAgICBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBzd2lwZUFuZ2xlID8gJz8nIDogdHJ1ZSxcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZSxcbiAgICAgIG9uSW5pdCA9IG9wdGlvbnMub25Jbml0LFxuICAgICAgZXZlbnRzID0gbmV3IEV2ZW50cygpLFxuICAgICAgLy8gaWQsIGNsYXNzXG4gICAgICBuZXdDb250YWluZXJDbGFzc2VzID0gJyB0bnMtc2xpZGVyIHRucy0nICsgb3B0aW9ucy5tb2RlLFxuICAgICAgc2xpZGVJZCA9IGNvbnRhaW5lci5pZCB8fCBnZXRTbGlkZUlkKCksXG4gICAgICBkaXNhYmxlID0gZ2V0T3B0aW9uKCdkaXNhYmxlJyksXG4gICAgICBkaXNhYmxlZCA9IGZhbHNlLFxuICAgICAgZnJlZXphYmxlID0gb3B0aW9ucy5mcmVlemFibGUsXG4gICAgICBmcmVlemUgPSBmcmVlemFibGUgJiYgIWF1dG9XaWR0aCA/IGdldEZyZWV6ZSgpIDogZmFsc2UsXG4gICAgICBmcm96ZW4gPSBmYWxzZSxcbiAgICAgIGNvbnRyb2xzRXZlbnRzID0ge1xuICAgICAgICAnY2xpY2snOiBvbkNvbnRyb2xzQ2xpY2ssXG4gICAgICAgICdrZXlkb3duJzogb25Db250cm9sc0tleWRvd25cbiAgICAgIH0sXG4gICAgICBuYXZFdmVudHMgPSB7XG4gICAgICAgICdjbGljayc6IG9uTmF2Q2xpY2ssXG4gICAgICAgICdrZXlkb3duJzogb25OYXZLZXlkb3duXG4gICAgICB9LFxuICAgICAgaG92ZXJFdmVudHMgPSB7XG4gICAgICAgICdtb3VzZW92ZXInOiBtb3VzZW92ZXJQYXVzZSxcbiAgICAgICAgJ21vdXNlb3V0JzogbW91c2VvdXRSZXN0YXJ0XG4gICAgICB9LFxuICAgICAgdmlzaWJpbGl0eUV2ZW50ID0geyd2aXNpYmlsaXR5Y2hhbmdlJzogb25WaXNpYmlsaXR5Q2hhbmdlfSxcbiAgICAgIGRvY21lbnRLZXlkb3duRXZlbnQgPSB7J2tleWRvd24nOiBvbkRvY3VtZW50S2V5ZG93bn0sXG4gICAgICB0b3VjaEV2ZW50cyA9IHtcbiAgICAgICAgJ3RvdWNoc3RhcnQnOiBvblBhblN0YXJ0LFxuICAgICAgICAndG91Y2htb3ZlJzogb25QYW5Nb3ZlLFxuICAgICAgICAndG91Y2hlbmQnOiBvblBhbkVuZCxcbiAgICAgICAgJ3RvdWNoY2FuY2VsJzogb25QYW5FbmRcbiAgICAgIH0sIGRyYWdFdmVudHMgPSB7XG4gICAgICAgICdtb3VzZWRvd24nOiBvblBhblN0YXJ0LFxuICAgICAgICAnbW91c2Vtb3ZlJzogb25QYW5Nb3ZlLFxuICAgICAgICAnbW91c2V1cCc6IG9uUGFuRW5kLFxuICAgICAgICAnbW91c2VsZWF2ZSc6IG9uUGFuRW5kXG4gICAgICB9LFxuICAgICAgaGFzQ29udHJvbHMgPSBoYXNPcHRpb24oJ2NvbnRyb2xzJyksXG4gICAgICBoYXNOYXYgPSBoYXNPcHRpb24oJ25hdicpLFxuICAgICAgbmF2QXNUaHVtYm5haWxzID0gYXV0b1dpZHRoID8gdHJ1ZSA6IG9wdGlvbnMubmF2QXNUaHVtYm5haWxzLFxuICAgICAgaGFzQXV0b3BsYXkgPSBoYXNPcHRpb24oJ2F1dG9wbGF5JyksXG4gICAgICBoYXNUb3VjaCA9IGhhc09wdGlvbigndG91Y2gnKSxcbiAgICAgIGhhc01vdXNlRHJhZyA9IGhhc09wdGlvbignbW91c2VEcmFnJyksXG4gICAgICBzbGlkZUFjdGl2ZUNsYXNzID0gJ3Rucy1zbGlkZS1hY3RpdmUnLFxuICAgICAgaW1nQ29tcGxldGVDbGFzcyA9ICd0bnMtY29tcGxldGUnLFxuICAgICAgaW1nRXZlbnRzID0ge1xuICAgICAgICAnbG9hZCc6IG9uSW1nTG9hZGVkLFxuICAgICAgICAnZXJyb3InOiBvbkltZ0ZhaWxlZFxuICAgICAgfSxcbiAgICAgIGltZ3NDb21wbGV0ZSxcbiAgICAgIGxpdmVyZWdpb25DdXJyZW50LFxuICAgICAgcHJldmVudFNjcm9sbCA9IG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdmb3JjZScgPyB0cnVlIDogZmFsc2U7XG5cbiAgLy8gY29udHJvbHNcbiAgaWYgKGhhc0NvbnRyb2xzKSB7XG4gICAgdmFyIGNvbnRyb2xzQ29udGFpbmVyID0gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lcixcbiAgICAgICAgY29udHJvbHNDb250YWluZXJIVE1MID0gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciA/IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIHByZXZCdXR0b24gPSBvcHRpb25zLnByZXZCdXR0b24sXG4gICAgICAgIG5leHRCdXR0b24gPSBvcHRpb25zLm5leHRCdXR0b24sXG4gICAgICAgIHByZXZCdXR0b25IVE1MID0gb3B0aW9ucy5wcmV2QnV0dG9uID8gb3B0aW9ucy5wcmV2QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBuZXh0QnV0dG9uSFRNTCA9IG9wdGlvbnMubmV4dEJ1dHRvbiA/IG9wdGlvbnMubmV4dEJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgcHJldklzQnV0dG9uLFxuICAgICAgICBuZXh0SXNCdXR0b247XG4gIH1cblxuICAvLyBuYXZcbiAgaWYgKGhhc05hdikge1xuICAgIHZhciBuYXZDb250YWluZXIgPSBvcHRpb25zLm5hdkNvbnRhaW5lcixcbiAgICAgICAgbmF2Q29udGFpbmVySFRNTCA9IG9wdGlvbnMubmF2Q29udGFpbmVyID8gb3B0aW9ucy5uYXZDb250YWluZXIub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIG5hdkl0ZW1zLFxuICAgICAgICBwYWdlcyA9IGF1dG9XaWR0aCA/IHNsaWRlQ291bnQgOiBnZXRQYWdlcygpLFxuICAgICAgICBwYWdlc0NhY2hlZCA9IDAsXG4gICAgICAgIG5hdkNsaWNrZWQgPSAtMSxcbiAgICAgICAgbmF2Q3VycmVudEluZGV4ID0gZ2V0Q3VycmVudE5hdkluZGV4KCksXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkN1cnJlbnRJbmRleCxcbiAgICAgICAgbmF2QWN0aXZlQ2xhc3MgPSAndG5zLW5hdi1hY3RpdmUnLFxuICAgICAgICBuYXZTdHIgPSAnQ2Fyb3VzZWwgUGFnZSAnLFxuICAgICAgICBuYXZTdHJDdXJyZW50ID0gJyAoQ3VycmVudCBTbGlkZSknO1xuICB9XG5cbiAgLy8gYXV0b3BsYXlcbiAgaWYgKGhhc0F1dG9wbGF5KSB7XG4gICAgdmFyIGF1dG9wbGF5RGlyZWN0aW9uID0gb3B0aW9ucy5hdXRvcGxheURpcmVjdGlvbiA9PT0gJ2ZvcndhcmQnID8gMSA6IC0xLFxuICAgICAgICBhdXRvcGxheUJ1dHRvbiA9IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24sXG4gICAgICAgIGF1dG9wbGF5QnV0dG9uSFRNTCA9IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24gPyBvcHRpb25zLmF1dG9wbGF5QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBhdXRvcGxheUh0bWxTdHJpbmdzID0gWyc8c3BhbiBjbGFzcz1cXCd0bnMtdmlzdWFsbHktaGlkZGVuXFwnPicsICcgYW5pbWF0aW9uPC9zcGFuPiddLFxuICAgICAgICBhdXRvcGxheVRpbWVyLFxuICAgICAgICBhbmltYXRpbmcsXG4gICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQsXG4gICAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCxcbiAgICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkO1xuICB9XG5cbiAgaWYgKGhhc1RvdWNoIHx8IGhhc01vdXNlRHJhZykge1xuICAgIHZhciBpbml0UG9zaXRpb24gPSB7fSxcbiAgICAgICAgbGFzdFBvc2l0aW9uID0ge30sXG4gICAgICAgIHRyYW5zbGF0ZUluaXQsXG4gICAgICAgIGRpc1gsXG4gICAgICAgIGRpc1ksXG4gICAgICAgIHBhblN0YXJ0ID0gZmFsc2UsXG4gICAgICAgIHJhZkluZGV4LFxuICAgICAgICBnZXREaXN0ID0gaG9yaXpvbnRhbCA/IFxuICAgICAgICAgIGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueCAtIGIueDsgfSA6XG4gICAgICAgICAgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS55IC0gYi55OyB9O1xuICB9XG4gIFxuICAvLyBkaXNhYmxlIHNsaWRlciB3aGVuIHNsaWRlY291bnQgPD0gaXRlbXNcbiAgaWYgKCFhdXRvV2lkdGgpIHsgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTsgfVxuXG4gIGlmIChUUkFOU0ZPUk0pIHtcbiAgICB0cmFuc2Zvcm1BdHRyID0gVFJBTlNGT1JNO1xuICAgIHRyYW5zZm9ybVByZWZpeCA9ICd0cmFuc2xhdGUnO1xuXG4gICAgaWYgKEhBUzNEVFJBTlNGT1JNUykge1xuICAgICAgdHJhbnNmb3JtUHJlZml4ICs9IGhvcml6b250YWwgPyAnM2QoJyA6ICczZCgwcHgsICc7XG4gICAgICB0cmFuc2Zvcm1Qb3N0Zml4ID0gaG9yaXpvbnRhbCA/ICcsIDBweCwgMHB4KScgOiAnLCAwcHgpJztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNmb3JtUHJlZml4ICs9IGhvcml6b250YWwgPyAnWCgnIDogJ1koJztcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSAnKSc7XG4gICAgfVxuXG4gIH1cblxuICBpZiAoY2Fyb3VzZWwpIHsgY29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSgndG5zLXZwZml4JywgJycpOyB9XG4gIGluaXRTdHJ1Y3R1cmUoKTtcbiAgaW5pdFNoZWV0KCk7XG4gIGluaXRTbGlkZXJUcmFuc2Zvcm0oKTtcblxuICAvLyA9PT0gQ09NTU9OIEZVTkNUSU9OUyA9PT0gLy9cbiAgZnVuY3Rpb24gcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlIChjb25kaXRpb24pIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICBjb250cm9scyA9IG5hdiA9IHRvdWNoID0gbW91c2VEcmFnID0gYXJyb3dLZXlzID0gYXV0b3BsYXkgPSBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFNsaWRlICgpIHtcbiAgICB2YXIgdGVtID0gY2Fyb3VzZWwgPyBpbmRleCAtIGNsb25lQ291bnQgOiBpbmRleDtcbiAgICB3aGlsZSAodGVtIDwgMCkgeyB0ZW0gKz0gc2xpZGVDb3VudDsgfVxuICAgIHJldHVybiB0ZW0lc2xpZGVDb3VudCArIDE7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTdGFydEluZGV4IChpbmQpIHtcbiAgICBpbmQgPSBpbmQgPyBNYXRoLm1heCgwLCBNYXRoLm1pbihsb29wID8gc2xpZGVDb3VudCAtIDEgOiBzbGlkZUNvdW50IC0gaXRlbXMsIGluZCkpIDogMDtcbiAgICByZXR1cm4gY2Fyb3VzZWwgPyBpbmQgKyBjbG9uZUNvdW50IDogaW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWJzSW5kZXggKGkpIHtcbiAgICBpZiAoaSA9PSBudWxsKSB7IGkgPSBpbmRleDsgfVxuXG4gICAgaWYgKGNhcm91c2VsKSB7IGkgLT0gY2xvbmVDb3VudDsgfVxuICAgIHdoaWxlIChpIDwgMCkgeyBpICs9IHNsaWRlQ291bnQ7IH1cblxuICAgIHJldHVybiBNYXRoLmZsb29yKGklc2xpZGVDb3VudCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50TmF2SW5kZXggKCkge1xuICAgIHZhciBhYnNJbmRleCA9IGdldEFic0luZGV4KCksXG4gICAgICAgIHJlc3VsdDtcblxuICAgIHJlc3VsdCA9IG5hdkFzVGh1bWJuYWlscyA/IGFic0luZGV4IDogXG4gICAgICBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IE1hdGguY2VpbCgoYWJzSW5kZXggKyAxKSAqIHBhZ2VzIC8gc2xpZGVDb3VudCAtIDEpIDogXG4gICAgICAgICAgTWF0aC5mbG9vcihhYnNJbmRleCAvIGl0ZW1zKTtcblxuICAgIC8vIHNldCBhY3RpdmUgbmF2IHRvIHRoZSBsYXN0IG9uZSB3aGVuIHJlYWNoZXMgdGhlIHJpZ2h0IGVkZ2VcbiAgICBpZiAoIWxvb3AgJiYgY2Fyb3VzZWwgJiYgaW5kZXggPT09IGluZGV4TWF4KSB7IHJlc3VsdCA9IHBhZ2VzIC0gMTsgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEl0ZW1zTWF4ICgpIHtcbiAgICAvLyBmaXhlZFdpZHRoIG9yIGF1dG9XaWR0aCB3aGlsZSB2aWV3cG9ydE1heCBpcyBub3QgYXZhaWxhYmxlXG4gICAgaWYgKGF1dG9XaWR0aCB8fCAoZml4ZWRXaWR0aCAmJiAhdmlld3BvcnRNYXgpKSB7XG4gICAgICByZXR1cm4gc2xpZGVDb3VudCAtIDE7XG4gICAgLy8gbW9zdCBjYXNlc1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RyID0gZml4ZWRXaWR0aCA/ICdmaXhlZFdpZHRoJyA6ICdpdGVtcycsXG4gICAgICAgICAgYXJyID0gW107XG5cbiAgICAgIGlmIChmaXhlZFdpZHRoIHx8IG9wdGlvbnNbc3RyXSA8IHNsaWRlQ291bnQpIHsgYXJyLnB1c2gob3B0aW9uc1tzdHJdKTsgfVxuXG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgdmFyIHRlbSA9IHJlc3BvbnNpdmVbYnBdW3N0cl07XG4gICAgICAgICAgaWYgKHRlbSAmJiAoZml4ZWRXaWR0aCB8fCB0ZW0gPCBzbGlkZUNvdW50KSkgeyBhcnIucHVzaCh0ZW0pOyB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7IGFyci5wdXNoKDApOyB9XG5cbiAgICAgIHJldHVybiBNYXRoLmNlaWwoZml4ZWRXaWR0aCA/IHZpZXdwb3J0TWF4IC8gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyKSA6IE1hdGgubWF4LmFwcGx5KG51bGwsIGFycikpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENsb25lQ291bnRGb3JMb29wICgpIHtcbiAgICB2YXIgaXRlbXNNYXggPSBnZXRJdGVtc01heCgpLFxuICAgICAgICByZXN1bHQgPSBjYXJvdXNlbCA/IE1hdGguY2VpbCgoaXRlbXNNYXggKiA1IC0gc2xpZGVDb3VudCkvMikgOiAoaXRlbXNNYXggKiA0IC0gc2xpZGVDb3VudCk7XG4gICAgcmVzdWx0ID0gTWF0aC5tYXgoaXRlbXNNYXgsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4gaGFzT3B0aW9uKCdlZGdlUGFkZGluZycpID8gcmVzdWx0ICsgMSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdpbmRvd1dpZHRoICgpIHtcbiAgICByZXR1cm4gd2luLmlubmVyV2lkdGggfHwgZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2MuYm9keS5jbGllbnRXaWR0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEluc2VydFBvc2l0aW9uIChwb3MpIHtcbiAgICByZXR1cm4gcG9zID09PSAndG9wJyA/ICdhZnRlcmJlZ2luJyA6ICdiZWZvcmVlbmQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2xpZW50V2lkdGggKGVsKSB7XG4gICAgdmFyIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSwgcmVjdCwgd2lkdGg7XG4gICAgZWwuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHdpZHRoID0gcmVjdC5yaWdodCAtIHJlY3QubGVmdDtcbiAgICBkaXYucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHdpZHRoIHx8IGdldENsaWVudFdpZHRoKGVsLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRXaWR0aCAoKSB7XG4gICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZWRnZVBhZGRpbmcgKiAyIC0gZ3V0dGVyIDogMDtcbiAgICByZXR1cm4gZ2V0Q2xpZW50V2lkdGgoY29udGFpbmVyUGFyZW50KSAtIGdhcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc09wdGlvbiAoaXRlbSkge1xuICAgIGlmIChvcHRpb25zW2l0ZW1dKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zaXZlW2JwXVtpdGVtXSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gZ2V0IG9wdGlvbjpcbiAgLy8gZml4ZWQgd2lkdGg6IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXIgPT4gaXRlbXNcbiAgLy8gb3RoZXJzOiB3aW5kb3cgd2lkdGggPT4gYWxsIHZhcmlhYmxlc1xuICAvLyBhbGw6IGl0ZW1zID0+IHNsaWRlQnlcbiAgZnVuY3Rpb24gZ2V0T3B0aW9uIChpdGVtLCB3dykge1xuICAgIGlmICh3dyA9PSBudWxsKSB7IHd3ID0gd2luZG93V2lkdGg7IH1cblxuICAgIGlmIChpdGVtID09PSAnaXRlbXMnICYmIGZpeGVkV2lkdGgpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKCh2aWV3cG9ydCArIGd1dHRlcikgLyAoZml4ZWRXaWR0aCArIGd1dHRlcikpIHx8IDE7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlc3VsdCA9IG9wdGlvbnNbaXRlbV07XG5cbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICAvLyBicDogY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICAgICAgaWYgKHd3ID49IHBhcnNlSW50KGJwKSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0gaW4gcmVzcG9uc2l2ZVticF0pIHsgcmVzdWx0ID0gcmVzcG9uc2l2ZVticF1baXRlbV07IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0gPT09ICdzbGlkZUJ5JyAmJiByZXN1bHQgPT09ICdwYWdlJykgeyByZXN1bHQgPSBnZXRPcHRpb24oJ2l0ZW1zJyk7IH1cbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgKGl0ZW0gPT09ICdzbGlkZUJ5JyB8fCBpdGVtID09PSAnaXRlbXMnKSkgeyByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7IH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZU1hcmdpbkxlZnQgKGkpIHtcbiAgICByZXR1cm4gQ0FMQyA/IFxuICAgICAgQ0FMQyArICcoJyArIGkgKiAxMDAgKyAnJSAvICcgKyBzbGlkZUNvdW50TmV3ICsgJyknIDogXG4gICAgICBpICogMTAwIC8gc2xpZGVDb3VudE5ldyArICclJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldElubmVyV3JhcHBlclN0eWxlcyAoZWRnZVBhZGRpbmdUZW0sIGd1dHRlclRlbSwgZml4ZWRXaWR0aFRlbSwgc3BlZWRUZW0sIGF1dG9IZWlnaHRCUCkge1xuICAgIHZhciBzdHIgPSAnJztcblxuICAgIGlmIChlZGdlUGFkZGluZ1RlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmdUZW07XG4gICAgICBpZiAoZ3V0dGVyVGVtKSB7IGdhcCAtPSBndXR0ZXJUZW07IH1cbiAgICAgIHN0ciA9IGhvcml6b250YWwgP1xuICAgICAgICAnbWFyZ2luOiAwICcgKyBnYXAgKyAncHggMCAnICsgZWRnZVBhZGRpbmdUZW0gKyAncHg7JyA6XG4gICAgICAgICdtYXJnaW46ICcgKyBlZGdlUGFkZGluZ1RlbSArICdweCAwICcgKyBnYXAgKyAncHggMDsnO1xuICAgIH0gZWxzZSBpZiAoZ3V0dGVyVGVtICYmICFmaXhlZFdpZHRoVGVtKSB7XG4gICAgICB2YXIgZ3V0dGVyVGVtVW5pdCA9ICctJyArIGd1dHRlclRlbSArICdweCcsXG4gICAgICAgICAgZGlyID0gaG9yaXpvbnRhbCA/IGd1dHRlclRlbVVuaXQgKyAnIDAgMCcgOiAnMCAnICsgZ3V0dGVyVGVtVW5pdCArICcgMCc7XG4gICAgICBzdHIgPSAnbWFyZ2luOiAwICcgKyBkaXIgKyAnOyc7XG4gICAgfVxuXG4gICAgaWYgKCFjYXJvdXNlbCAmJiBhdXRvSGVpZ2h0QlAgJiYgVFJBTlNJVElPTkRVUkFUSU9OICYmIHNwZWVkVGVtKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZFRlbSk7IH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyV2lkdGggKGZpeGVkV2lkdGhUZW0sIGd1dHRlclRlbSwgaXRlbXNUZW0pIHtcbiAgICBpZiAoZml4ZWRXaWR0aFRlbSkge1xuICAgICAgcmV0dXJuIChmaXhlZFdpZHRoVGVtICsgZ3V0dGVyVGVtKSAqIHNsaWRlQ291bnROZXcgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ0FMQyA/XG4gICAgICAgIENBTEMgKyAnKCcgKyBzbGlkZUNvdW50TmV3ICogMTAwICsgJyUgLyAnICsgaXRlbXNUZW0gKyAnKScgOlxuICAgICAgICBzbGlkZUNvdW50TmV3ICogMTAwIC8gaXRlbXNUZW0gKyAnJSc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVXaWR0aFN0eWxlIChmaXhlZFdpZHRoVGVtLCBndXR0ZXJUZW0sIGl0ZW1zVGVtKSB7XG4gICAgdmFyIHdpZHRoO1xuXG4gICAgaWYgKGZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHdpZHRoID0gKGZpeGVkV2lkdGhUZW0gKyBndXR0ZXJUZW0pICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjYXJvdXNlbCkgeyBpdGVtc1RlbSA9IE1hdGguZmxvb3IoaXRlbXNUZW0pOyB9XG4gICAgICB2YXIgZGl2aWRlbmQgPSBjYXJvdXNlbCA/IHNsaWRlQ291bnROZXcgOiBpdGVtc1RlbTtcbiAgICAgIHdpZHRoID0gQ0FMQyA/IFxuICAgICAgICBDQUxDICsgJygxMDAlIC8gJyArIGRpdmlkZW5kICsgJyknIDogXG4gICAgICAgIDEwMCAvIGRpdmlkZW5kICsgJyUnO1xuICAgIH1cblxuICAgIHdpZHRoID0gJ3dpZHRoOicgKyB3aWR0aDtcblxuICAgIC8vIGlubmVyIHNsaWRlcjogb3ZlcndyaXRlIG91dGVyIHNsaWRlciBzdHlsZXNcbiAgICByZXR1cm4gbmVzdGVkICE9PSAnaW5uZXInID8gd2lkdGggKyAnOycgOiB3aWR0aCArICcgIWltcG9ydGFudDsnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVHdXR0ZXJTdHlsZSAoZ3V0dGVyVGVtKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuXG4gICAgLy8gZ3V0dGVyIG1heWJlIGludGVyZ2VyIHx8IDBcbiAgICAvLyBzbyBjYW4ndCB1c2UgJ2lmIChndXR0ZXIpJ1xuICAgIGlmIChndXR0ZXJUZW0gIT09IGZhbHNlKSB7XG4gICAgICB2YXIgcHJvcCA9IGhvcml6b250YWwgPyAncGFkZGluZy0nIDogJ21hcmdpbi0nLFxuICAgICAgICAgIGRpciA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbSc7XG4gICAgICBzdHIgPSBwcm9wICsgIGRpciArICc6ICcgKyBndXR0ZXJUZW0gKyAncHg7JztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q1NTUHJlZml4IChuYW1lLCBudW0pIHtcbiAgICB2YXIgcHJlZml4ID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggLSBudW0pLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHByZWZpeCkgeyBwcmVmaXggPSAnLScgKyBwcmVmaXggKyAnLSc7IH1cblxuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZSAoc3BlZWQpIHtcbiAgICByZXR1cm4gZ2V0Q1NTUHJlZml4KFRSQU5TSVRJT05EVVJBVElPTiwgMTgpICsgJ3RyYW5zaXRpb24tZHVyYXRpb246JyArIHNwZWVkIC8gMTAwMCArICdzOyc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlIChzcGVlZCkge1xuICAgIHJldHVybiBnZXRDU1NQcmVmaXgoQU5JTUFUSU9ORFVSQVRJT04sIDE3KSArICdhbmltYXRpb24tZHVyYXRpb246JyArIHNwZWVkIC8gMTAwMCArICdzOyc7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U3RydWN0dXJlICgpIHtcbiAgICB2YXIgY2xhc3NPdXRlciA9ICd0bnMtb3V0ZXInLFxuICAgICAgICBjbGFzc0lubmVyID0gJ3Rucy1pbm5lcicsXG4gICAgICAgIGhhc0d1dHRlciA9IGhhc09wdGlvbignZ3V0dGVyJyk7XG5cbiAgICBvdXRlcldyYXBwZXIuY2xhc3NOYW1lID0gY2xhc3NPdXRlcjtcbiAgICBpbm5lcldyYXBwZXIuY2xhc3NOYW1lID0gY2xhc3NJbm5lcjtcbiAgICBvdXRlcldyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1vdyc7XG4gICAgaW5uZXJXcmFwcGVyLmlkID0gc2xpZGVJZCArICctaXcnO1xuXG4gICAgLy8gc2V0IGNvbnRhaW5lciBwcm9wZXJ0aWVzXG4gICAgaWYgKGNvbnRhaW5lci5pZCA9PT0gJycpIHsgY29udGFpbmVyLmlkID0gc2xpZGVJZDsgfVxuICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gUEVSQ0VOVEFHRUxBWU9VVCB8fCBhdXRvV2lkdGggPyAnIHRucy1zdWJwaXhlbCcgOiAnIHRucy1uby1zdWJwaXhlbCc7XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSBDQUxDID8gJyB0bnMtY2FsYycgOiAnIHRucy1uby1jYWxjJztcbiAgICBpZiAoYXV0b1dpZHRoKSB7IG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gJyB0bnMtYXV0b3dpZHRoJzsgfVxuICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gJyB0bnMtJyArIG9wdGlvbnMuYXhpcztcbiAgICBjb250YWluZXIuY2xhc3NOYW1lICs9IG5ld0NvbnRhaW5lckNsYXNzZXM7XG5cbiAgICAvLyBhZGQgY29uc3RyYWluIGxheWVyIGZvciBjYXJvdXNlbFxuICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgbWlkZGxlV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1pZGRsZVdyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1tdyc7XG4gICAgICBtaWRkbGVXcmFwcGVyLmNsYXNzTmFtZSA9ICd0bnMtb3ZoJztcblxuICAgICAgb3V0ZXJXcmFwcGVyLmFwcGVuZENoaWxkKG1pZGRsZVdyYXBwZXIpO1xuICAgICAgbWlkZGxlV3JhcHBlci5hcHBlbmRDaGlsZChpbm5lcldyYXBwZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRlcldyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJXcmFwcGVyKTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b0hlaWdodCkge1xuICAgICAgdmFyIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG4gICAgICB3cC5jbGFzc05hbWUgKz0gJyB0bnMtYWgnO1xuICAgIH1cblxuICAgIGNvbnRhaW5lclBhcmVudC5pbnNlcnRCZWZvcmUob3V0ZXJXcmFwcGVyLCBjb250YWluZXIpO1xuICAgIGlubmVyV3JhcHBlci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgLy8gYWRkIGlkLCBjbGFzcywgYXJpYSBhdHRyaWJ1dGVzIFxuICAgIC8vIGJlZm9yZSBjbG9uZSBzbGlkZXNcbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIGFkZENsYXNzKGl0ZW0sICd0bnMtaXRlbScpO1xuICAgICAgaWYgKCFpdGVtLmlkKSB7IGl0ZW0uaWQgPSBzbGlkZUlkICsgJy1pdGVtJyArIGk7IH1cbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgYW5pbWF0ZU5vcm1hbCkgeyBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTsgfVxuICAgICAgc2V0QXR0cnMoaXRlbSwge1xuICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gIyMgY2xvbmUgc2xpZGVzXG4gICAgLy8gY2Fyb3VzZWw6IG4gKyBzbGlkZXMgKyBuXG4gICAgLy8gZ2FsbGVyeTogICAgICBzbGlkZXMgKyBuXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBmcmFnbWVudEJlZm9yZSA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksIFxuICAgICAgICAgIGZyYWdtZW50QWZ0ZXIgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xuICAgICAgICB2YXIgbnVtID0gaiVzbGlkZUNvdW50LFxuICAgICAgICAgICAgY2xvbmVGaXJzdCA9IHNsaWRlSXRlbXNbbnVtXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIHJlbW92ZUF0dHJzKGNsb25lRmlyc3QsICdpZCcpO1xuICAgICAgICBmcmFnbWVudEFmdGVyLmluc2VydEJlZm9yZShjbG9uZUZpcnN0LCBmcmFnbWVudEFmdGVyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgIHZhciBjbG9uZUxhc3QgPSBzbGlkZUl0ZW1zW3NsaWRlQ291bnQgLSAxIC0gbnVtXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVMYXN0LCAnaWQnKTtcbiAgICAgICAgICBmcmFnbWVudEJlZm9yZS5hcHBlbmRDaGlsZChjbG9uZUxhc3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZnJhZ21lbnRCZWZvcmUsIGNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudEFmdGVyKTtcbiAgICAgIHNsaWRlSXRlbXMgPSBjb250YWluZXIuY2hpbGRyZW47XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtICgpIHtcbiAgICAvLyAjIyBpbWFnZXMgbG9hZGVkL2ZhaWxlZFxuICAgIGlmIChoYXNPcHRpb24oJ2F1dG9IZWlnaHQnKSB8fCBhdXRvV2lkdGggfHwgIWhvcml6b250YWwpIHtcbiAgICAgIHZhciBpbWdzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuXG4gICAgICAvLyBhZGQgY29tcGxldGUgY2xhc3MgaWYgYWxsIGltYWdlcyBhcmUgbG9hZGVkL2ZhaWxlZFxuICAgICAgZm9yRWFjaChpbWdzLCBmdW5jdGlvbihpbWcpIHtcbiAgICAgICAgdmFyIHNyYyA9IGltZy5zcmM7XG4gICAgICAgIFxuICAgICAgICBpZiAoc3JjICYmIHNyYy5pbmRleE9mKCdkYXRhOmltYWdlJykgPCAwKSB7XG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcbiAgICAgICAgICBpbWcuc3JjID0gJyc7XG4gICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgICBhZGRDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxhenlsb2FkKSB7XG4gICAgICAgICAgaW1nTG9hZGVkKGltZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBBbGwgaW1ncyBhcmUgY29tcGxldGVkXG4gICAgICByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGFycmF5RnJvbU5vZGVMaXN0KGltZ3MpLCBmdW5jdGlvbigpIHsgaW1nc0NvbXBsZXRlID0gdHJ1ZTsgfSk7IH0pO1xuXG4gICAgICAvLyBDaGVjayBpbWdzIGluIHdpbmRvdyBvbmx5IGZvciBhdXRvIGhlaWdodFxuICAgICAgaWYgKCFhdXRvV2lkdGggJiYgaG9yaXpvbnRhbCkgeyBpbWdzID0gZ2V0SW1hZ2VBcnJheShpbmRleCwgTWF0aC5taW4oaW5kZXggKyBpdGVtcyAtIDEsIHNsaWRlQ291bnROZXcgLSAxKSk7IH1cblxuICAgICAgbGF6eWxvYWQgPyBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjaygpIDogcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhhcnJheUZyb21Ob2RlTGlzdChpbWdzKSwgaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2spOyB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzZXQgY29udGFpbmVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxuICAgICAgaWYgKGNhcm91c2VsKSB7IGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7IH1cblxuICAgICAgLy8gdXBkYXRlIHNsaWRlciB0b29scyBhbmQgZXZlbnRzXG4gICAgICBpbml0VG9vbHMoKTtcbiAgICAgIGluaXRFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayAoKSB7XG4gICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgLy8gY2hlY2sgc3R5bGVzIGFwcGxpY2F0aW9uXG4gICAgICB2YXIgbnVtID0gbG9vcCA/IGluZGV4IDogc2xpZGVDb3VudCAtIDE7XG4gICAgICAoZnVuY3Rpb24gc3R5bGVzQXBwbGljYXRpb25DaGVjaygpIHtcbiAgICAgICAgc2xpZGVJdGVtc1tudW0gLSAxXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodC50b0ZpeGVkKDIpID09PSBzbGlkZUl0ZW1zW251bV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdC50b0ZpeGVkKDIpID9cbiAgICAgICAgaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUoKSA6XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgc3R5bGVzQXBwbGljYXRpb25DaGVjaygpOyB9LCAxNik7XG4gICAgICB9KSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUgKCkge1xuICAgIC8vIHJ1biBGbigpcyB3aGljaCBhcmUgcmVseSBvbiBpbWFnZSBsb2FkaW5nXG4gICAgaWYgKCFob3Jpem9udGFsIHx8IGF1dG9XaWR0aCkge1xuICAgICAgc2V0U2xpZGVQb3NpdGlvbnMoKTtcblxuICAgICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICByaWdodEJvdW5kYXJ5ID0gZ2V0UmlnaHRCb3VuZGFyeSgpO1xuICAgICAgICBpZiAoZnJlZXphYmxlKSB7IGZyZWV6ZSA9IGdldEZyZWV6ZSgpOyB9XG4gICAgICAgIGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgLy8gPD0gc2xpZGVQb3NpdGlvbnMsIHJpZ2h0Qm91bmRhcnkgPD1cbiAgICAgICAgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2V0IGNvbnRhaW5lciB0cmFuc2Zvcm0gcHJvcGVydHlcbiAgICBpZiAoY2Fyb3VzZWwpIHsgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTsgfVxuXG4gICAgLy8gdXBkYXRlIHNsaWRlciB0b29scyBhbmQgZXZlbnRzXG4gICAgaW5pdFRvb2xzKCk7XG4gICAgaW5pdEV2ZW50cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNoZWV0ICgpIHtcbiAgICAvLyBnYWxsZXJ5OlxuICAgIC8vIHNldCBhbmltYXRpb24gY2xhc3NlcyBhbmQgbGVmdCB2YWx1ZSBmb3IgZ2FsbGVyeSBzbGlkZXJcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAjIyMjIExBWU9VVFxuXG4gICAgLy8gIyMgSU5MSU5FLUJMT0NLIFZTIEZMT0FUXG5cbiAgICAvLyAjIyBQZXJjZW50YWdlTGF5b3V0OlxuICAgIC8vIHNsaWRlczogaW5saW5lLWJsb2NrXG4gICAgLy8gcmVtb3ZlIGJsYW5rIHNwYWNlIGJldHdlZW4gc2xpZGVzIGJ5IHNldCBmb250LXNpemU6IDBcblxuICAgIC8vICMjIE5vbiBQZXJjZW50YWdlTGF5b3V0OlxuICAgIC8vIHNsaWRlczogZmxvYXRcbiAgICAvLyAgICAgICAgIG1hcmdpbi1yaWdodDogLTEwMCVcbiAgICAvLyAgICAgICAgIG1hcmdpbi1sZWZ0OiB+XG5cbiAgICAvLyBSZXNvdXJjZTogaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMTQ3dXAyNDV3d1RYZVFZdmUzQlJTQUQ0b1ZjdlFtdUdzRnRlSk9lQTV4TlEvZWRpdD91c3A9c2hhcmluZ1xuICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICBpZiAoUEVSQ0VOVEFHRUxBWU9VVCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCAnZm9udC1zaXplOicgKyB3aW4uZ2V0Q29tcHV0ZWRTdHlsZShzbGlkZUl0ZW1zWzBdKS5mb250U2l6ZSArICc7JywgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCwgJ2ZvbnQtc2l6ZTowOycsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9IGVsc2UgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24gKHNsaWRlLCBpKSB7XG4gICAgICAgICAgc2xpZGUuc3R5bGUubWFyZ2luTGVmdCA9IGdldFNsaWRlTWFyZ2luTGVmdChpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyAjIyBCQVNJQyBTVFlMRVNcbiAgICBpZiAoQ1NTTVEpIHtcbiAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlXG4gICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7XG4gICAgICAgIHZhciBzdHIgPSBtaWRkbGVXcmFwcGVyICYmIG9wdGlvbnMuYXV0b0hlaWdodCA/IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKG9wdGlvbnMuc3BlZWQpIDogJyc7XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnLW13Jywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgc3RyID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKG9wdGlvbnMuZWRnZVBhZGRpbmcsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuc3BlZWQsIG9wdGlvbnMuYXV0b0hlaWdodCk7XG4gICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJy1pdycsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcblxuICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xuICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/ICd3aWR0aDonICsgZ2V0Q29udGFpbmVyV2lkdGgob3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5pdGVtcykgKyAnOycgOiAnJztcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2xpZGUgc3R5bGVzXG4gICAgICBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyBnZXRTbGlkZVdpZHRoU3R5bGUob3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5pdGVtcykgOiAnJztcbiAgICAgIGlmIChvcHRpb25zLmd1dHRlcikgeyBzdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShvcHRpb25zLmd1dHRlcik7IH1cbiAgICAgIC8vIHNldCBnYWxsZXJ5IGl0ZW1zIHRyYW5zaXRpb24tZHVyYXRpb25cbiAgICAgIGlmICghY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XG4gICAgICAgIGlmIChBTklNQVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzdHIpIHsgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7IH1cblxuICAgIC8vIG5vbiBDU1MgbWVkaWFxdWVyaWVzOiBJRThcbiAgICAvLyAjIyB1cGRhdGUgaW5uZXIgd3JhcHBlciwgY29udGFpbmVyLCBzbGlkZXMgaWYgbmVlZGVkXG4gICAgLy8gc2V0IGlubGluZSBzdHlsZXMgZm9yIGlubmVyIHdyYXBwZXIgJiBjb250YWluZXJcbiAgICAvLyBpbnNlcnQgc3R5bGVzaGVldCAob25lIGxpbmUpIGZvciBzbGlkZXMgb25seSAoc2luY2Ugc2xpZGVzIGFyZSBtYW55KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZXNcbiAgICAgIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uKCk7XG5cbiAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICBpbm5lcldyYXBwZXIuc3R5bGUuY3NzVGV4dCA9IGdldElubmVyV3JhcHBlclN0eWxlcyhlZGdlUGFkZGluZywgZ3V0dGVyLCBmaXhlZFdpZHRoLCBhdXRvSGVpZ2h0KTtcblxuICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xuICAgICAgaWYgKGNhcm91c2VsICYmIGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2xpZGUgc3R5bGVzXG4gICAgICB2YXIgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpIDogJyc7XG4gICAgICBpZiAoZ3V0dGVyKSB7IHN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlcik7IH1cblxuICAgICAgLy8gYXBwZW5kIHRvIHRoZSBsYXN0IGxpbmVcbiAgICAgIGlmIChzdHIpIHsgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7IH1cbiAgICB9XG5cbiAgICAvLyAjIyBNRURJQVFVRVJJRVNcbiAgICBpZiAocmVzcG9uc2l2ZSAmJiBDU1NNUSkge1xuICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAvLyBicDogY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICAgIGJwID0gcGFyc2VJbnQoYnApO1xuXG4gICAgICAgIHZhciBvcHRzID0gcmVzcG9uc2l2ZVticF0sXG4gICAgICAgICAgICBzdHIgPSAnJyxcbiAgICAgICAgICAgIG1pZGRsZVdyYXBwZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIGlubmVyV3JhcHBlclN0ciA9ICcnLFxuICAgICAgICAgICAgY29udGFpbmVyU3RyID0gJycsXG4gICAgICAgICAgICBzbGlkZVN0ciA9ICcnLFxuICAgICAgICAgICAgaXRlbXNCUCA9ICFhdXRvV2lkdGggPyBnZXRPcHRpb24oJ2l0ZW1zJywgYnApIDogbnVsbCxcbiAgICAgICAgICAgIGZpeGVkV2lkdGhCUCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcsIGJwKSxcbiAgICAgICAgICAgIHNwZWVkQlAgPSBnZXRPcHRpb24oJ3NwZWVkJywgYnApLFxuICAgICAgICAgICAgZWRnZVBhZGRpbmdCUCA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnLCBicCksXG4gICAgICAgICAgICBhdXRvSGVpZ2h0QlAgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnLCBicCksXG4gICAgICAgICAgICBndXR0ZXJCUCA9IGdldE9wdGlvbignZ3V0dGVyJywgYnApO1xuXG4gICAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0cmluZ1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OICYmIG1pZGRsZVdyYXBwZXIgJiYgZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JywgYnApICYmICdzcGVlZCcgaW4gb3B0cykge1xuICAgICAgICAgIG1pZGRsZVdyYXBwZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJy1td3snICsgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCkgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbm5lciB3cmFwcGVyIHN0cmluZ1xuICAgICAgICBpZiAoJ2VkZ2VQYWRkaW5nJyBpbiBvcHRzIHx8ICdndXR0ZXInIGluIG9wdHMpIHtcbiAgICAgICAgICBpbm5lcldyYXBwZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJy1pd3snICsgZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nQlAsIGd1dHRlckJQLCBmaXhlZFdpZHRoQlAsIHNwZWVkQlAsIGF1dG9IZWlnaHRCUCkgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb250YWluZXIgc3RyaW5nXG4gICAgICAgIGlmIChjYXJvdXNlbCAmJiBob3Jpem9udGFsICYmICFhdXRvV2lkdGggJiYgKCdmaXhlZFdpZHRoJyBpbiBvcHRzIHx8ICdpdGVtcycgaW4gb3B0cyB8fCAoZml4ZWRXaWR0aCAmJiAnZ3V0dGVyJyBpbiBvcHRzKSkpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgPSAnd2lkdGg6JyArIGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGhCUCwgZ3V0dGVyQlAsIGl0ZW1zQlApICsgJzsnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgY29udGFpbmVyU3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb250YWluZXJTdHIpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJ3snICsgY29udGFpbmVyU3RyICsgJ30nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2xpZGUgc3RyaW5nXG4gICAgICAgIGlmICgnZml4ZWRXaWR0aCcgaW4gb3B0cyB8fCAoZml4ZWRXaWR0aCAmJiAnZ3V0dGVyJyBpbiBvcHRzKSB8fCAhY2Fyb3VzZWwgJiYgJ2l0ZW1zJyBpbiBvcHRzKSB7XG4gICAgICAgICAgc2xpZGVTdHIgKz0gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGhCUCwgZ3V0dGVyQlAsIGl0ZW1zQlApO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnZ3V0dGVyJyBpbiBvcHRzKSB7XG4gICAgICAgICAgc2xpZGVTdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXJCUCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IGdhbGxlcnkgaXRlbXMgdHJhbnNpdGlvbi1kdXJhdGlvblxuICAgICAgICBpZiAoIWNhcm91c2VsICYmICdzcGVlZCcgaW4gb3B0cykge1xuICAgICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc2xpZGVTdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7IH1cbiAgICAgICAgICBpZiAoQU5JTUFUSU9ORFVSQVRJT04pIHsgc2xpZGVTdHIgKz0gZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzbGlkZVN0cikgeyBzbGlkZVN0ciA9ICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVteycgKyBzbGlkZVN0ciArICd9JzsgfVxuXG4gICAgICAgIC8vIGFkZCB1cFxuICAgICAgICBzdHIgPSBtaWRkbGVXcmFwcGVyU3RyICsgaW5uZXJXcmFwcGVyU3RyICsgY29udGFpbmVyU3RyICsgc2xpZGVTdHI7XG5cbiAgICAgICAgaWYgKHN0cikge1xuICAgICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoJ0BtZWRpYSAobWluLXdpZHRoOiAnICsgYnAgLyAxNiArICdlbSkgeycgKyBzdHIgKyAnfScsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0VG9vbHMgKCkge1xuICAgIC8vID09IHNsaWRlcyA9PVxuICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG5cbiAgICAvLyA9PSBsaXZlIHJlZ2lvbiA9PVxuICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCAnPGRpdiBjbGFzcz1cInRucy1saXZlcmVnaW9uIHRucy12aXN1YWxseS1oaWRkZW5cIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBhcmlhLWF0b21pYz1cInRydWVcIj5zbGlkZSA8c3BhbiBjbGFzcz1cImN1cnJlbnRcIj4nICsgZ2V0TGl2ZVJlZ2lvblN0cigpICsgJzwvc3Bhbj4gIG9mICcgKyBzbGlkZUNvdW50ICsgJzwvZGl2PicpO1xuICAgIGxpdmVyZWdpb25DdXJyZW50ID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtbGl2ZXJlZ2lvbiAuY3VycmVudCcpO1xuXG4gICAgLy8gPT0gYXV0b3BsYXlJbml0ID09XG4gICAgaWYgKGhhc0F1dG9wbGF5KSB7XG4gICAgICB2YXIgdHh0ID0gYXV0b3BsYXkgPyAnc3RvcCcgOiAnc3RhcnQnO1xuICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7XG4gICAgICAgIHNldEF0dHJzKGF1dG9wbGF5QnV0dG9uLCB7J2RhdGEtYWN0aW9uJzogdHh0fSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYXV0b3BsYXlCdXR0b25PdXRwdXQpIHtcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLmF1dG9wbGF5UG9zaXRpb24pLCAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cIicgKyB0eHQgKyAnXCI+JyArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMF0gKyB0eHQgKyBhdXRvcGxheUh0bWxTdHJpbmdzWzFdICsgYXV0b3BsYXlUZXh0WzBdICsgJzwvYnV0dG9uPicpO1xuICAgICAgICBhdXRvcGxheUJ1dHRvbiA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBldmVudFxuICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7XG4gICAgICAgIGFkZEV2ZW50cyhhdXRvcGxheUJ1dHRvbiwgeydjbGljayc6IHRvZ2dsZUF1dG9wbGF5fSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgICBzdGFydEF1dG9wbGF5KCk7XG4gICAgICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2UpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpOyB9XG4gICAgICAgIGlmIChhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5KSB7IGFkZEV2ZW50cyhjb250YWluZXIsIHZpc2liaWxpdHlFdmVudCk7IH1cbiAgICAgIH1cbiAgICB9XG4gXG4gICAgLy8gPT0gbmF2SW5pdCA9PVxuICAgIGlmIChoYXNOYXYpIHtcbiAgICAgIHZhciBpbml0SW5kZXggPSAhY2Fyb3VzZWwgPyAwIDogY2xvbmVDb3VudDtcbiAgICAgIC8vIGN1c3RvbWl6ZWQgbmF2XG4gICAgICAvLyB3aWxsIG5vdCBoaWRlIHRoZSBuYXZzIGluIGNhc2UgdGhleSdyZSB0aHVtYm5haWxzXG4gICAgICBpZiAobmF2Q29udGFpbmVyKSB7XG4gICAgICAgIHNldEF0dHJzKG5hdkNvbnRhaW5lciwgeydhcmlhLWxhYmVsJzogJ0Nhcm91c2VsIFBhZ2luYXRpb24nfSk7XG4gICAgICAgIG5hdkl0ZW1zID0gbmF2Q29udGFpbmVyLmNoaWxkcmVuO1xuICAgICAgICBmb3JFYWNoKG5hdkl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgc2V0QXR0cnMoaXRlbSwge1xuICAgICAgICAgICAgJ2RhdGEtbmF2JzogaSxcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgICAgICAnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChpICsgMSksXG4gICAgICAgICAgICAnYXJpYS1jb250cm9scyc6IHNsaWRlSWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAvLyBnZW5lcmF0ZWQgbmF2IFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5hdkh0bWwgPSAnJyxcbiAgICAgICAgICAgIGhpZGRlblN0ciA9IG5hdkFzVGh1bWJuYWlscyA/ICcnIDogJ3N0eWxlPVwiZGlzcGxheTpub25lXCInO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlQ291bnQ7IGkrKykge1xuICAgICAgICAgIC8vIGhpZGUgbmF2IGl0ZW1zIGJ5IGRlZmF1bHRcbiAgICAgICAgICBuYXZIdG1sICs9ICc8YnV0dG9uIGRhdGEtbmF2PVwiJyArIGkgKydcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsgJ1wiICcgKyBoaWRkZW5TdHIgKyAnIGFyaWEtbGFiZWw9XCInICsgbmF2U3RyICsgKGkgKyAxKSArJ1wiPjwvYnV0dG9uPic7XG4gICAgICAgIH1cbiAgICAgICAgbmF2SHRtbCA9ICc8ZGl2IGNsYXNzPVwidG5zLW5hdlwiIGFyaWEtbGFiZWw9XCJDYXJvdXNlbCBQYWdpbmF0aW9uXCI+JyArIG5hdkh0bWwgKyAnPC9kaXY+JztcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLm5hdlBvc2l0aW9uKSwgbmF2SHRtbCk7XG5cbiAgICAgICAgbmF2Q29udGFpbmVyID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtbmF2Jyk7XG4gICAgICAgIG5hdkl0ZW1zID0gbmF2Q29udGFpbmVyLmNoaWxkcmVuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVOYXZWaXNpYmlsaXR5KCk7XG5cbiAgICAgIC8vIGFkZCB0cmFuc2l0aW9uXG4gICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBUUkFOU0lUSU9ORFVSQVRJT04uc3Vic3RyaW5nKDAsIFRSQU5TSVRJT05EVVJBVElPTi5sZW5ndGggLSAxOCkudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgIHN0ciA9ICd0cmFuc2l0aW9uOiBhbGwgJyArIHNwZWVkIC8gMTAwMCArICdzJztcblxuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgc3RyID0gJy0nICsgcHJlZml4ICsgJy0nICsgc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJ1thcmlhLWNvbnRyb2xzXj0nICsgc2xpZGVJZCArICctaXRlbV0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIHNldEF0dHJzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sIHsnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXggKyAxKSArIG5hdlN0ckN1cnJlbnR9KTtcbiAgICAgIHJlbW92ZUF0dHJzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sICd0YWJpbmRleCcpO1xuICAgICAgYWRkQ2xhc3MobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgbmF2QWN0aXZlQ2xhc3MpO1xuXG4gICAgICAvLyBhZGQgZXZlbnRzXG4gICAgICBhZGRFdmVudHMobmF2Q29udGFpbmVyLCBuYXZFdmVudHMpO1xuICAgIH1cblxuXG5cbiAgICAvLyA9PSBjb250cm9sc0luaXQgPT1cbiAgICBpZiAoaGFzQ29udHJvbHMpIHtcbiAgICAgIGlmICghY29udHJvbHNDb250YWluZXIgJiYgKCFwcmV2QnV0dG9uIHx8ICFuZXh0QnV0dG9uKSkge1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMuY29udHJvbHNQb3NpdGlvbiksICc8ZGl2IGNsYXNzPVwidG5zLWNvbnRyb2xzXCIgYXJpYS1sYWJlbD1cIkNhcm91c2VsIE5hdmlnYXRpb25cIiB0YWJpbmRleD1cIjBcIj48YnV0dG9uIGRhdGEtY29udHJvbHM9XCJwcmV2XCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMF0gKyAnPC9idXR0b24+PGJ1dHRvbiBkYXRhLWNvbnRyb2xzPVwibmV4dFwiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKydcIj4nICsgY29udHJvbHNUZXh0WzFdICsgJzwvYnV0dG9uPjwvZGl2PicpO1xuXG4gICAgICAgIGNvbnRyb2xzQ29udGFpbmVyID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtY29udHJvbHMnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwcmV2QnV0dG9uIHx8ICFuZXh0QnV0dG9uKSB7XG4gICAgICAgIHByZXZCdXR0b24gPSBjb250cm9sc0NvbnRhaW5lci5jaGlsZHJlblswXTtcbiAgICAgICAgbmV4dEJ1dHRvbiA9IGNvbnRyb2xzQ29udGFpbmVyLmNoaWxkcmVuWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBzZXRBdHRycyhjb250cm9sc0NvbnRhaW5lciwge1xuICAgICAgICAgICdhcmlhLWxhYmVsJzogJ0Nhcm91c2VsIE5hdmlnYXRpb24nLFxuICAgICAgICAgICd0YWJpbmRleCc6ICcwJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgfHwgKG9wdGlvbnMucHJldkJ1dHRvbiAmJiBvcHRpb25zLm5leHRCdXR0b24pKSB7XG4gICAgICAgIHNldEF0dHJzKFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXSwge1xuICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcbiAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgfHwgKG9wdGlvbnMucHJldkJ1dHRvbiAmJiBvcHRpb25zLm5leHRCdXR0b24pKSB7XG4gICAgICAgIHNldEF0dHJzKHByZXZCdXR0b24sIHsnZGF0YS1jb250cm9scycgOiAncHJldid9KTtcbiAgICAgICAgc2V0QXR0cnMobmV4dEJ1dHRvbiwgeydkYXRhLWNvbnRyb2xzJyA6ICduZXh0J30pO1xuICAgICAgfVxuXG4gICAgICBwcmV2SXNCdXR0b24gPSBpc0J1dHRvbihwcmV2QnV0dG9uKTtcbiAgICAgIG5leHRJc0J1dHRvbiA9IGlzQnV0dG9uKG5leHRCdXR0b24pO1xuXG4gICAgICB1cGRhdGVDb250cm9sc1N0YXR1cygpO1xuXG4gICAgICAvLyBhZGQgZXZlbnRzXG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgYWRkRXZlbnRzKGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRFdmVudHMocHJldkJ1dHRvbiwgY29udHJvbHNFdmVudHMpO1xuICAgICAgICBhZGRFdmVudHMobmV4dEJ1dHRvbiwgY29udHJvbHNFdmVudHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGhpZGUgdG9vbHMgaWYgbmVlZGVkXG4gICAgZGlzYWJsZVVJKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0RXZlbnRzICgpIHtcbiAgICAvLyBhZGQgZXZlbnRzXG4gICAgaWYgKGNhcm91c2VsICYmIFRSQU5TSVRJT05FTkQpIHtcbiAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGV2ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRvdWNoKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzLCBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoKTsgfVxuICAgIGlmIChtb3VzZURyYWcpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7IH1cbiAgICBpZiAoYXJyb3dLZXlzKSB7IGFkZEV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpOyB9XG5cbiAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7XG4gICAgICBldmVudHMub24oJ291dGVyUmVzaXplZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzaXplVGFza3MoKTtcbiAgICAgICAgZXZlbnRzLmVtaXQoJ2lubmVyTG9hZGVkJywgaW5mbygpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2l2ZSB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCB8fCBhdXRvSGVpZ2h0IHx8ICFob3Jpem9udGFsKSB7XG4gICAgICBhZGRFdmVudHMod2luLCB7J3Jlc2l6ZSc6IG9uUmVzaXplfSk7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9IZWlnaHQpIHtcbiAgICAgIGlmIChuZXN0ZWQgPT09ICdvdXRlcicpIHtcbiAgICAgICAgZXZlbnRzLm9uKCdpbm5lckxvYWRlZCcsIGRvQXV0b0hlaWdodCk7XG4gICAgICB9IGVsc2UgaWYgKCFkaXNhYmxlKSB7IGRvQXV0b0hlaWdodCgpOyB9XG4gICAgfVxuXG4gICAgZG9MYXp5TG9hZCgpO1xuICAgIGlmIChkaXNhYmxlKSB7IGRpc2FibGVTbGlkZXIoKTsgfSBlbHNlIGlmIChmcmVlemUpIHsgZnJlZXplU2xpZGVyKCk7IH1cblxuICAgIGV2ZW50cy5vbignaW5kZXhDaGFuZ2VkJywgYWRkaXRpb25hbFVwZGF0ZXMpO1xuICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHsgZXZlbnRzLmVtaXQoJ2lubmVyTG9hZGVkJywgaW5mbygpKTsgfVxuICAgIGlmICh0eXBlb2Ygb25Jbml0ID09PSAnZnVuY3Rpb24nKSB7IG9uSW5pdChpbmZvKCkpOyB9XG4gICAgaXNPbiA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgICAvLyBzaGVldFxuICAgIHNoZWV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBpZiAoc2hlZXQub3duZXJOb2RlKSB7IHNoZWV0Lm93bmVyTm9kZS5yZW1vdmUoKTsgfVxuXG4gICAgLy8gcmVtb3ZlIHdpbiBldmVudCBsaXN0ZW5lcnNcbiAgICByZW1vdmVFdmVudHMod2luLCB7J3Jlc2l6ZSc6IG9uUmVzaXplfSk7XG5cbiAgICAvLyBhcnJvd0tleXMsIGNvbnRyb2xzLCBuYXZcbiAgICBpZiAoYXJyb3dLZXlzKSB7IHJlbW92ZUV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpOyB9XG4gICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7IHJlbW92ZUV2ZW50cyhjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNFdmVudHMpOyB9XG4gICAgaWYgKG5hdkNvbnRhaW5lcikgeyByZW1vdmVFdmVudHMobmF2Q29udGFpbmVyLCBuYXZFdmVudHMpOyB9XG5cbiAgICAvLyBhdXRvcGxheVxuICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTtcbiAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCB2aXNpYmlsaXR5RXZlbnQpO1xuICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyByZW1vdmVFdmVudHMoYXV0b3BsYXlCdXR0b24sIHsnY2xpY2snOiB0b2dnbGVBdXRvcGxheX0pOyB9XG4gICAgaWYgKGF1dG9wbGF5KSB7IGNsZWFySW50ZXJ2YWwoYXV0b3BsYXlUaW1lcik7IH1cblxuICAgIC8vIGNvbnRhaW5lclxuICAgIGlmIChjYXJvdXNlbCAmJiBUUkFOU0lUSU9ORU5EKSB7XG4gICAgICB2YXIgZXZlID0ge307XG4gICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XG4gICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBldmUpO1xuICAgIH1cbiAgICBpZiAodG91Y2gpIHsgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMpOyB9XG4gICAgaWYgKG1vdXNlRHJhZykgeyByZW1vdmVFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTsgfVxuXG4gICAgLy8gY2FjaGUgT2JqZWN0IHZhbHVlcyBpbiBvcHRpb25zICYmIHJlc2V0IEhUTUxcbiAgICB2YXIgaHRtbExpc3QgPSBbY29udGFpbmVySFRNTCwgY29udHJvbHNDb250YWluZXJIVE1MLCBwcmV2QnV0dG9uSFRNTCwgbmV4dEJ1dHRvbkhUTUwsIG5hdkNvbnRhaW5lckhUTUwsIGF1dG9wbGF5QnV0dG9uSFRNTF07XG5cbiAgICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIGVsID0gaXRlbSA9PT0gJ2NvbnRhaW5lcicgPyBvdXRlcldyYXBwZXIgOiBvcHRpb25zW2l0ZW1dO1xuXG4gICAgICBpZiAodHlwZW9mIGVsID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgcHJldkVsID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZyA/IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcmVudEVsID0gZWwucGFyZW50Tm9kZTtcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gaHRtbExpc3RbaV07XG4gICAgICAgIG9wdGlvbnNbaXRlbV0gPSBwcmV2RWwgPyBwcmV2RWwubmV4dEVsZW1lbnRTaWJsaW5nIDogcGFyZW50RWwuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vIHJlc2V0IHZhcmlhYmxlc1xuICAgIHRuc0xpc3QgPSBhbmltYXRlSW4gPSBhbmltYXRlT3V0ID0gYW5pbWF0ZURlbGF5ID0gYW5pbWF0ZU5vcm1hbCA9IGhvcml6b250YWwgPSBvdXRlcldyYXBwZXIgPSBpbm5lcldyYXBwZXIgPSBjb250YWluZXIgPSBjb250YWluZXJQYXJlbnQgPSBjb250YWluZXJIVE1MID0gc2xpZGVJdGVtcyA9IHNsaWRlQ291bnQgPSBicmVha3BvaW50Wm9uZSA9IHdpbmRvd1dpZHRoID0gYXV0b1dpZHRoID0gZml4ZWRXaWR0aCA9IGVkZ2VQYWRkaW5nID0gZ3V0dGVyID0gdmlld3BvcnQgPSBpdGVtcyA9IHNsaWRlQnkgPSB2aWV3cG9ydE1heCA9IGFycm93S2V5cyA9IHNwZWVkID0gcmV3aW5kID0gbG9vcCA9IGF1dG9IZWlnaHQgPSBzaGVldCA9IGxhenlsb2FkID0gc2xpZGVQb3NpdGlvbnMgPSBzbGlkZUl0ZW1zT3V0ID0gY2xvbmVDb3VudCA9IHNsaWRlQ291bnROZXcgPSBoYXNSaWdodERlYWRab25lID0gcmlnaHRCb3VuZGFyeSA9IHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtID0gdHJhbnNmb3JtQXR0ciA9IHRyYW5zZm9ybVByZWZpeCA9IHRyYW5zZm9ybVBvc3RmaXggPSBnZXRJbmRleE1heCA9IGluZGV4ID0gaW5kZXhDYWNoZWQgPSBpbmRleE1pbiA9IGluZGV4TWF4ID0gcmVzaXplVGltZXIgPSBzd2lwZUFuZ2xlID0gbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gcnVubmluZyA9IG9uSW5pdCA9IGV2ZW50cyA9IG5ld0NvbnRhaW5lckNsYXNzZXMgPSBzbGlkZUlkID0gZGlzYWJsZSA9IGRpc2FibGVkID0gZnJlZXphYmxlID0gZnJlZXplID0gZnJvemVuID0gY29udHJvbHNFdmVudHMgPSBuYXZFdmVudHMgPSBob3ZlckV2ZW50cyA9IHZpc2liaWxpdHlFdmVudCA9IGRvY21lbnRLZXlkb3duRXZlbnQgPSB0b3VjaEV2ZW50cyA9IGRyYWdFdmVudHMgPSBoYXNDb250cm9scyA9IGhhc05hdiA9IG5hdkFzVGh1bWJuYWlscyA9IGhhc0F1dG9wbGF5ID0gaGFzVG91Y2ggPSBoYXNNb3VzZURyYWcgPSBzbGlkZUFjdGl2ZUNsYXNzID0gaW1nQ29tcGxldGVDbGFzcyA9IGltZ0V2ZW50cyA9IGltZ3NDb21wbGV0ZSA9IGNvbnRyb2xzID0gY29udHJvbHNUZXh0ID0gY29udHJvbHNDb250YWluZXIgPSBjb250cm9sc0NvbnRhaW5lckhUTUwgPSBwcmV2QnV0dG9uID0gbmV4dEJ1dHRvbiA9IHByZXZJc0J1dHRvbiA9IG5leHRJc0J1dHRvbiA9IG5hdiA9IG5hdkNvbnRhaW5lciA9IG5hdkNvbnRhaW5lckhUTUwgPSBuYXZJdGVtcyA9IHBhZ2VzID0gcGFnZXNDYWNoZWQgPSBuYXZDbGlja2VkID0gbmF2Q3VycmVudEluZGV4ID0gbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2QWN0aXZlQ2xhc3MgPSBuYXZTdHIgPSBuYXZTdHJDdXJyZW50ID0gYXV0b3BsYXkgPSBhdXRvcGxheVRpbWVvdXQgPSBhdXRvcGxheURpcmVjdGlvbiA9IGF1dG9wbGF5VGV4dCA9IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5QnV0dG9uID0gYXV0b3BsYXlCdXR0b25IVE1MID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGF1dG9wbGF5SHRtbFN0cmluZ3MgPSBhdXRvcGxheVRpbWVyID0gYW5pbWF0aW5nID0gYXV0b3BsYXlIb3ZlclBhdXNlZCA9IGF1dG9wbGF5VXNlclBhdXNlZCA9IGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCA9IGluaXRQb3NpdGlvbiA9IGxhc3RQb3NpdGlvbiA9IHRyYW5zbGF0ZUluaXQgPSBkaXNYID0gZGlzWSA9IHBhblN0YXJ0ID0gcmFmSW5kZXggPSBnZXREaXN0ID0gdG91Y2ggPSBtb3VzZURyYWcgPSBudWxsO1xuICAgIC8vIGNoZWNrIHZhcmlhYmxlc1xuICAgIC8vIFthbmltYXRlSW4sIGFuaW1hdGVPdXQsIGFuaW1hdGVEZWxheSwgYW5pbWF0ZU5vcm1hbCwgaG9yaXpvbnRhbCwgb3V0ZXJXcmFwcGVyLCBpbm5lcldyYXBwZXIsIGNvbnRhaW5lciwgY29udGFpbmVyUGFyZW50LCBjb250YWluZXJIVE1MLCBzbGlkZUl0ZW1zLCBzbGlkZUNvdW50LCBicmVha3BvaW50Wm9uZSwgd2luZG93V2lkdGgsIGF1dG9XaWR0aCwgZml4ZWRXaWR0aCwgZWRnZVBhZGRpbmcsIGd1dHRlciwgdmlld3BvcnQsIGl0ZW1zLCBzbGlkZUJ5LCB2aWV3cG9ydE1heCwgYXJyb3dLZXlzLCBzcGVlZCwgcmV3aW5kLCBsb29wLCBhdXRvSGVpZ2h0LCBzaGVldCwgbGF6eWxvYWQsIHNsaWRlUG9zaXRpb25zLCBzbGlkZUl0ZW1zT3V0LCBjbG9uZUNvdW50LCBzbGlkZUNvdW50TmV3LCBoYXNSaWdodERlYWRab25lLCByaWdodEJvdW5kYXJ5LCB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSwgdHJhbnNmb3JtQXR0ciwgdHJhbnNmb3JtUHJlZml4LCB0cmFuc2Zvcm1Qb3N0Zml4LCBnZXRJbmRleE1heCwgaW5kZXgsIGluZGV4Q2FjaGVkLCBpbmRleE1pbiwgaW5kZXhNYXgsIHJlc2l6ZVRpbWVyLCBzd2lwZUFuZ2xlLCBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQsIHJ1bm5pbmcsIG9uSW5pdCwgZXZlbnRzLCBuZXdDb250YWluZXJDbGFzc2VzLCBzbGlkZUlkLCBkaXNhYmxlLCBkaXNhYmxlZCwgZnJlZXphYmxlLCBmcmVlemUsIGZyb3plbiwgY29udHJvbHNFdmVudHMsIG5hdkV2ZW50cywgaG92ZXJFdmVudHMsIHZpc2liaWxpdHlFdmVudCwgZG9jbWVudEtleWRvd25FdmVudCwgdG91Y2hFdmVudHMsIGRyYWdFdmVudHMsIGhhc0NvbnRyb2xzLCBoYXNOYXYsIG5hdkFzVGh1bWJuYWlscywgaGFzQXV0b3BsYXksIGhhc1RvdWNoLCBoYXNNb3VzZURyYWcsIHNsaWRlQWN0aXZlQ2xhc3MsIGltZ0NvbXBsZXRlQ2xhc3MsIGltZ0V2ZW50cywgaW1nc0NvbXBsZXRlLCBjb250cm9scywgY29udHJvbHNUZXh0LCBjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNDb250YWluZXJIVE1MLCBwcmV2QnV0dG9uLCBuZXh0QnV0dG9uLCBwcmV2SXNCdXR0b24sIG5leHRJc0J1dHRvbiwgbmF2LCBuYXZDb250YWluZXIsIG5hdkNvbnRhaW5lckhUTUwsIG5hdkl0ZW1zLCBwYWdlcywgcGFnZXNDYWNoZWQsIG5hdkNsaWNrZWQsIG5hdkN1cnJlbnRJbmRleCwgbmF2Q3VycmVudEluZGV4Q2FjaGVkLCBuYXZBY3RpdmVDbGFzcywgbmF2U3RyLCBuYXZTdHJDdXJyZW50LCBhdXRvcGxheSwgYXV0b3BsYXlUaW1lb3V0LCBhdXRvcGxheURpcmVjdGlvbiwgYXV0b3BsYXlUZXh0LCBhdXRvcGxheUhvdmVyUGF1c2UsIGF1dG9wbGF5QnV0dG9uLCBhdXRvcGxheUJ1dHRvbkhUTUwsIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHksIGF1dG9wbGF5SHRtbFN0cmluZ3MsIGF1dG9wbGF5VGltZXIsIGFuaW1hdGluZywgYXV0b3BsYXlIb3ZlclBhdXNlZCwgYXV0b3BsYXlVc2VyUGF1c2VkLCBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQsIGluaXRQb3NpdGlvbiwgbGFzdFBvc2l0aW9uLCB0cmFuc2xhdGVJbml0LCBkaXNYLCBkaXNZLCBwYW5TdGFydCwgcmFmSW5kZXgsIGdldERpc3QsIHRvdWNoLCBtb3VzZURyYWcgXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgaWYgKGl0ZW0gIT09IG51bGwpIHsgY29uc29sZS5sb2coaXRlbSk7IH0gfSk7XG5cbiAgICBmb3IgKHZhciBhIGluIHRoaXMpIHtcbiAgICAgIGlmIChhICE9PSAncmVidWlsZCcpIHsgdGhpc1thXSA9IG51bGw7IH1cbiAgICB9XG4gICAgaXNPbiA9IGZhbHNlO1xuICB9XG5cbi8vID09PSBPTiBSRVNJWkUgPT09XG4gIC8vIHJlc3BvbnNpdmUgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggfHwgIWhvcml6b250YWxcbiAgZnVuY3Rpb24gb25SZXNpemUgKGUpIHtcbiAgICByYWYoZnVuY3Rpb24oKXsgcmVzaXplVGFza3MoZ2V0RXZlbnQoZSkpOyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZVRhc2tzIChlKSB7XG4gICAgaWYgKCFpc09uKSB7IHJldHVybjsgfVxuICAgIGlmIChuZXN0ZWQgPT09ICdvdXRlcicpIHsgZXZlbnRzLmVtaXQoJ291dGVyUmVzaXplZCcsIGluZm8oZSkpOyB9XG4gICAgd2luZG93V2lkdGggPSBnZXRXaW5kb3dXaWR0aCgpO1xuICAgIHZhciBicENoYW5nZWQsXG4gICAgICAgIGJyZWFrcG9pbnRab25lVGVtID0gYnJlYWtwb2ludFpvbmUsXG4gICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSBmYWxzZTtcblxuICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICBzZXRCcmVha3BvaW50Wm9uZSgpO1xuICAgICAgYnBDaGFuZ2VkID0gYnJlYWtwb2ludFpvbmVUZW0gIT09IGJyZWFrcG9pbnRab25lO1xuICAgICAgLy8gaWYgKGhhc1JpZ2h0RGVhZFpvbmUpIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH0gLy8gKj9cbiAgICAgIGlmIChicENoYW5nZWQpIHsgZXZlbnRzLmVtaXQoJ25ld0JyZWFrcG9pbnRTdGFydCcsIGluZm8oZSkpOyB9XG4gICAgfVxuXG4gICAgdmFyIGluZENoYW5nZWQsXG4gICAgICAgIGl0ZW1zQ2hhbmdlZCxcbiAgICAgICAgaXRlbXNUZW0gPSBpdGVtcyxcbiAgICAgICAgZGlzYWJsZVRlbSA9IGRpc2FibGUsXG4gICAgICAgIGZyZWV6ZVRlbSA9IGZyZWV6ZSxcbiAgICAgICAgYXJyb3dLZXlzVGVtID0gYXJyb3dLZXlzLFxuICAgICAgICBjb250cm9sc1RlbSA9IGNvbnRyb2xzLFxuICAgICAgICBuYXZUZW0gPSBuYXYsXG4gICAgICAgIHRvdWNoVGVtID0gdG91Y2gsXG4gICAgICAgIG1vdXNlRHJhZ1RlbSA9IG1vdXNlRHJhZyxcbiAgICAgICAgYXV0b3BsYXlUZW0gPSBhdXRvcGxheSxcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlVGVtID0gYXV0b3BsYXlIb3ZlclBhdXNlLFxuICAgICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSxcbiAgICAgICAgaW5kZXhUZW0gPSBpbmRleDtcblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIHZhciBmaXhlZFdpZHRoVGVtID0gZml4ZWRXaWR0aCxcbiAgICAgICAgICBhdXRvSGVpZ2h0VGVtID0gYXV0b0hlaWdodCxcbiAgICAgICAgICBjb250cm9sc1RleHRUZW0gPSBjb250cm9sc1RleHQsXG4gICAgICAgICAgY2VudGVyVGVtID0gY2VudGVyLFxuICAgICAgICAgIGF1dG9wbGF5VGV4dFRlbSA9IGF1dG9wbGF5VGV4dDtcblxuICAgICAgaWYgKCFDU1NNUSkge1xuICAgICAgICB2YXIgZ3V0dGVyVGVtID0gZ3V0dGVyLFxuICAgICAgICAgICAgZWRnZVBhZGRpbmdUZW0gPSBlZGdlUGFkZGluZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXQgb3B0aW9uOlxuICAgIC8vIGZpeGVkIHdpZHRoOiB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyID0+IGl0ZW1zXG4gICAgLy8gb3RoZXJzOiB3aW5kb3cgd2lkdGggPT4gYWxsIHZhcmlhYmxlc1xuICAgIC8vIGFsbDogaXRlbXMgPT4gc2xpZGVCeVxuICAgIGFycm93S2V5cyA9IGdldE9wdGlvbignYXJyb3dLZXlzJyk7XG4gICAgY29udHJvbHMgPSBnZXRPcHRpb24oJ2NvbnRyb2xzJyk7XG4gICAgbmF2ID0gZ2V0T3B0aW9uKCduYXYnKTtcbiAgICB0b3VjaCA9IGdldE9wdGlvbigndG91Y2gnKTtcbiAgICBjZW50ZXIgPSBnZXRPcHRpb24oJ2NlbnRlcicpO1xuICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyk7XG4gICAgYXV0b3BsYXkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5Jyk7XG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlID0gZ2V0T3B0aW9uKCdhdXRvcGxheUhvdmVyUGF1c2UnKTtcbiAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5Jyk7XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBkaXNhYmxlID0gZ2V0T3B0aW9uKCdkaXNhYmxlJyk7XG4gICAgICBmaXhlZFdpZHRoID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJyk7XG4gICAgICBzcGVlZCA9IGdldE9wdGlvbignc3BlZWQnKTtcbiAgICAgIGF1dG9IZWlnaHQgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnKTtcbiAgICAgIGNvbnRyb2xzVGV4dCA9IGdldE9wdGlvbignY29udHJvbHNUZXh0Jyk7XG4gICAgICBhdXRvcGxheVRleHQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGV4dCcpO1xuICAgICAgYXV0b3BsYXlUaW1lb3V0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRpbWVvdXQnKTtcblxuICAgICAgaWYgKCFDU1NNUSkge1xuICAgICAgICBlZGdlUGFkZGluZyA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnKTtcbiAgICAgICAgZ3V0dGVyID0gZ2V0T3B0aW9uKCdndXR0ZXInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSk7XG5cbiAgICB2aWV3cG9ydCA9IGdldFZpZXdwb3J0V2lkdGgoKTsgLy8gPD0gZWRnZVBhZGRpbmcsIGd1dHRlclxuICAgIGlmICgoIWhvcml6b250YWwgfHwgYXV0b1dpZHRoKSAmJiAhZGlzYWJsZSkge1xuICAgICAgc2V0U2xpZGVQb3NpdGlvbnMoKTtcbiAgICAgIGlmICghaG9yaXpvbnRhbCkge1xuICAgICAgICB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpOyAvLyA8PSBzZXRTbGlkZVBvc2l0aW9uc1xuICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICByaWdodEJvdW5kYXJ5ID0gZ2V0UmlnaHRCb3VuZGFyeSgpOyAvLyBhdXRvV2lkdGg6IDw9IHZpZXdwb3J0LCBzbGlkZVBvc2l0aW9ucywgZ3V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZFdpZHRoOiA8PSB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyXG4gICAgICBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IC8vIGF1dG9XaWR0aDogPD0gcmlnaHRCb3VuZGFyeSwgc2xpZGVQb3NpdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml4ZWRXaWR0aDogPD0gcmlnaHRCb3VuZGFyeSwgZml4ZWRXaWR0aCwgZ3V0dGVyXG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCB8fCBmaXhlZFdpZHRoKSB7XG4gICAgICBpdGVtcyA9IGdldE9wdGlvbignaXRlbXMnKTtcbiAgICAgIHNsaWRlQnkgPSBnZXRPcHRpb24oJ3NsaWRlQnknKTtcbiAgICAgIGl0ZW1zQ2hhbmdlZCA9IGl0ZW1zICE9PSBpdGVtc1RlbTtcblxuICAgICAgaWYgKGl0ZW1zQ2hhbmdlZCkge1xuICAgICAgICBpZiAoIWZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkgeyBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IH0gLy8gPD0gaXRlbXNcbiAgICAgICAgLy8gY2hlY2sgaW5kZXggYmVmb3JlIHRyYW5zZm9ybSBpbiBjYXNlXG4gICAgICAgIC8vIHNsaWRlciByZWFjaCB0aGUgcmlnaHQgZWRnZSB0aGVuIGl0ZW1zIGJlY29tZSBiaWdnZXJcbiAgICAgICAgdXBkYXRlSW5kZXgoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgaWYgKGRpc2FibGUgIT09IGRpc2FibGVUZW0pIHtcbiAgICAgICAgaWYgKGRpc2FibGUpIHtcbiAgICAgICAgICBkaXNhYmxlU2xpZGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5hYmxlU2xpZGVyKCk7IC8vIDw9IHNsaWRlUG9zaXRpb25zLCByaWdodEJvdW5kYXJ5LCBpbmRleE1heFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZyZWV6YWJsZSAmJiAoYnBDaGFuZ2VkIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSkge1xuICAgICAgZnJlZXplID0gZ2V0RnJlZXplKCk7IC8vIDw9IGF1dG9XaWR0aDogc2xpZGVQb3NpdGlvbnMsIGd1dHRlciwgdmlld3BvcnQsIHJpZ2h0Qm91bmRhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8PSBmaXhlZFdpZHRoOiBmaXhlZFdpZHRoLCBndXR0ZXIsIHJpZ2h0Qm91bmRhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8PSBvdGhlcnM6IGl0ZW1zXG5cbiAgICAgIGlmIChmcmVlemUgIT09IGZyZWV6ZVRlbSkge1xuICAgICAgICBpZiAoZnJlZXplKSB7XG4gICAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm0oZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoZ2V0U3RhcnRJbmRleCgwKSkpO1xuICAgICAgICAgIGZyZWV6ZVNsaWRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVuZnJlZXplU2xpZGVyKCk7XG4gICAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpOyAvLyBjb250cm9scywgbmF2LCB0b3VjaCwgbW91c2VEcmFnLCBhcnJvd0tleXMsIGF1dG9wbGF5LCBhdXRvcGxheUhvdmVyUGF1c2UsIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlcbiAgICBpZiAoIWF1dG9wbGF5KSB7IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBmYWxzZTsgfVxuXG4gICAgaWYgKGFycm93S2V5cyAhPT0gYXJyb3dLZXlzVGVtKSB7XG4gICAgICBhcnJvd0tleXMgP1xuICAgICAgICBhZGRFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpO1xuICAgIH1cbiAgICBpZiAoY29udHJvbHMgIT09IGNvbnRyb2xzVGVtKSB7XG4gICAgICBpZiAoY29udHJvbHMpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgICAgc2hvd0VsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IHNob3dFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgc2hvd0VsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgICAgaGlkZUVsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IGhpZGVFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgaGlkZUVsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF2ICE9PSBuYXZUZW0pIHtcbiAgICAgIG5hdiA/XG4gICAgICAgIHNob3dFbGVtZW50KG5hdkNvbnRhaW5lcikgOlxuICAgICAgICBoaWRlRWxlbWVudChuYXZDb250YWluZXIpO1xuICAgIH1cbiAgICBpZiAodG91Y2ggIT09IHRvdWNoVGVtKSB7XG4gICAgICB0b3VjaCA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzLCBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoKSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzKTtcbiAgICB9XG4gICAgaWYgKG1vdXNlRHJhZyAhPT0gbW91c2VEcmFnVGVtKSB7XG4gICAgICBtb3VzZURyYWcgP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpO1xuICAgIH1cbiAgICBpZiAoYXV0b3BsYXkgIT09IGF1dG9wbGF5VGVtKSB7XG4gICAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHNob3dFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgICAgICBpZiAoIWFuaW1hdGluZyAmJiAhYXV0b3BsYXlVc2VyUGF1c2VkKSB7IHN0YXJ0QXV0b3BsYXkoKTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IGhpZGVFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgICAgICBpZiAoYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheSgpOyB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2UgIT09IGF1dG9wbGF5SG92ZXJQYXVzZVRlbSkge1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpO1xuICAgIH1cbiAgICBpZiAoYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSAhPT0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSkge1xuICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA/XG4gICAgICAgIGFkZEV2ZW50cyhkb2MsIHZpc2liaWxpdHlFdmVudCkgOlxuICAgICAgICByZW1vdmVFdmVudHMoZG9jLCB2aXNpYmlsaXR5RXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGlmIChmaXhlZFdpZHRoICE9PSBmaXhlZFdpZHRoVGVtIHx8IGNlbnRlciAhPT0gY2VudGVyVGVtKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9XG5cbiAgICAgIGlmIChhdXRvSGVpZ2h0ICE9PSBhdXRvSGVpZ2h0VGVtKSB7XG4gICAgICAgIGlmICghYXV0b0hlaWdodCkgeyBpbm5lcldyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJyc7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRyb2xzICYmIGNvbnRyb2xzVGV4dCAhPT0gY29udHJvbHNUZXh0VGVtKSB7XG4gICAgICAgIHByZXZCdXR0b24uaW5uZXJIVE1MID0gY29udHJvbHNUZXh0WzBdO1xuICAgICAgICBuZXh0QnV0dG9uLmlubmVySFRNTCA9IGNvbnRyb2xzVGV4dFsxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uICYmIGF1dG9wbGF5VGV4dCAhPT0gYXV0b3BsYXlUZXh0VGVtKSB7XG4gICAgICAgIHZhciBpID0gYXV0b3BsYXkgPyAxIDogMCxcbiAgICAgICAgICAgIGh0bWwgPSBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwsXG4gICAgICAgICAgICBsZW4gPSBodG1sLmxlbmd0aCAtIGF1dG9wbGF5VGV4dFRlbVtpXS5sZW5ndGg7XG4gICAgICAgIGlmIChodG1sLnN1YnN0cmluZyhsZW4pID09PSBhdXRvcGxheVRleHRUZW1baV0pIHtcbiAgICAgICAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBodG1sLnN1YnN0cmluZygwLCBsZW4pICsgYXV0b3BsYXlUZXh0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjZW50ZXIgJiYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfVxuICAgIH1cblxuICAgIGlmIChpdGVtc0NoYW5nZWQgfHwgZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICBwYWdlcyA9IGdldFBhZ2VzKCk7XG4gICAgICB1cGRhdGVOYXZWaXNpYmlsaXR5KCk7XG4gICAgfVxuXG4gICAgaW5kQ2hhbmdlZCA9IGluZGV4ICE9PSBpbmRleFRlbTtcbiAgICBpZiAoaW5kQ2hhbmdlZCkgeyBcbiAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpdGVtc0NoYW5nZWQpIHtcbiAgICAgIGlmICghaW5kQ2hhbmdlZCkgeyBhZGRpdGlvbmFsVXBkYXRlcygpOyB9XG4gICAgfSBlbHNlIGlmIChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkge1xuICAgICAgZG9MYXp5TG9hZCgpOyBcbiAgICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG4gICAgICB1cGRhdGVMaXZlUmVnaW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1zQ2hhbmdlZCAmJiAhY2Fyb3VzZWwpIHsgdXBkYXRlR2FsbGVyeVNsaWRlUG9zaXRpb25zKCk7IH1cblxuICAgIGlmICghZGlzYWJsZSAmJiAhZnJlZXplKSB7XG4gICAgICAvLyBub24tbWVkdWFxdWVyaWVzOiBJRThcbiAgICAgIGlmIChicENoYW5nZWQgJiYgIUNTU01RKSB7XG4gICAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlc1xuICAgICAgICBpZiAoYXV0b0hlaWdodCAhPT0gYXV0b2hlaWdodFRlbSB8fCBzcGVlZCAhPT0gc3BlZWRUZW0pIHtcbiAgICAgICAgICB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgICAgaWYgKGVkZ2VQYWRkaW5nICE9PSBlZGdlUGFkZGluZ1RlbSB8fCBndXR0ZXIgIT09IGd1dHRlclRlbSkge1xuICAgICAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIHNwZWVkLCBhdXRvSGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xuICAgICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2xpZGUgc3R5bGVzXG4gICAgICAgICAgdmFyIHN0ciA9IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKSArIFxuICAgICAgICAgICAgICAgICAgICBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlcik7XG5cbiAgICAgICAgICAvLyByZW1vdmUgdGhlIGxhc3QgbGluZSBhbmRcbiAgICAgICAgICAvLyBhZGQgbmV3IHN0eWxlc1xuICAgICAgICAgIHJlbW92ZUNTU1J1bGUoc2hlZXQsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSAtIDEpO1xuICAgICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGF1dG8gaGVpZ2h0XG4gICAgICBpZiAoYXV0b0hlaWdodCkgeyBkb0F1dG9IZWlnaHQoKTsgfVxuXG4gICAgICBpZiAobmVlZENvbnRhaW5lclRyYW5zZm9ybSkge1xuICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuICAgICAgICBpbmRleENhY2hlZCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChicENoYW5nZWQpIHsgZXZlbnRzLmVtaXQoJ25ld0JyZWFrcG9pbnRFbmQnLCBpbmZvKGUpKTsgfVxuICB9XG5cblxuXG5cblxuICAvLyA9PT0gSU5JVElBTElaQVRJT04gRlVOQ1RJT05TID09PSAvL1xuICBmdW5jdGlvbiBnZXRGcmVlemUgKCkge1xuICAgIGlmICghZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICB2YXIgYSA9IGNlbnRlciA/IGl0ZW1zIC0gKGl0ZW1zIC0gMSkgLyAyIDogaXRlbXM7XG4gICAgICByZXR1cm4gIHNsaWRlQ291bnQgPD0gYTtcbiAgICB9XG5cbiAgICB2YXIgd2lkdGggPSBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudCA6IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnRdLFxuICAgICAgICB2cCA9IGVkZ2VQYWRkaW5nID8gdmlld3BvcnQgKyBlZGdlUGFkZGluZyAqIDIgOiB2aWV3cG9ydCArIGd1dHRlcjtcblxuICAgIGlmIChjZW50ZXIpIHtcbiAgICAgIHZwIC09IGZpeGVkV2lkdGggPyAodmlld3BvcnQgLSBmaXhlZFdpZHRoKSAvIDIgOiAodmlld3BvcnQgLSAoc2xpZGVQb3NpdGlvbnNbaW5kZXggKyAxXSAtIHNsaWRlUG9zaXRpb25zW2luZGV4XSAtIGd1dHRlcikpIC8gMjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2lkdGggPD0gdnA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRCcmVha3BvaW50Wm9uZSAoKSB7XG4gICAgYnJlYWtwb2ludFpvbmUgPSAwO1xuICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgIGJwID0gcGFyc2VJbnQoYnApOyAvLyBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgIGlmICh3aW5kb3dXaWR0aCA+PSBicCkgeyBicmVha3BvaW50Wm9uZSA9IGJwOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gKHNsaWRlQnksIGluZGV4TWluLCBpbmRleE1heCkgPT4gaW5kZXhcbiAgdmFyIHVwZGF0ZUluZGV4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbG9vcCA/IFxuICAgICAgY2Fyb3VzZWwgP1xuICAgICAgICAvLyBsb29wICsgY2Fyb3VzZWxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsZWZ0RWRnZSA9IGluZGV4TWluLFxuICAgICAgICAgICAgICByaWdodEVkZ2UgPSBpbmRleE1heDtcblxuICAgICAgICAgIGxlZnRFZGdlICs9IHNsaWRlQnk7XG4gICAgICAgICAgcmlnaHRFZGdlIC09IHNsaWRlQnk7XG5cbiAgICAgICAgICAvLyBhZGp1c3QgZWRnZXMgd2hlbiBoYXMgZWRnZSBwYWRkaW5nc1xuICAgICAgICAgIC8vIG9yIGZpeGVkLXdpZHRoIHNsaWRlciB3aXRoIGV4dHJhIHNwYWNlIG9uIHRoZSByaWdodCBzaWRlXG4gICAgICAgICAgaWYgKGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgICBsZWZ0RWRnZSArPSAxO1xuICAgICAgICAgICAgcmlnaHRFZGdlIC09IDE7XG4gICAgICAgICAgfSBlbHNlIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgICAgICBpZiAoKHZpZXdwb3J0ICsgZ3V0dGVyKSUoZml4ZWRXaWR0aCArIGd1dHRlcikpIHsgcmlnaHRFZGdlIC09IDE7IH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gcmlnaHRFZGdlKSB7XG4gICAgICAgICAgICAgIGluZGV4IC09IHNsaWRlQ291bnQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgbGVmdEVkZ2UpIHtcbiAgICAgICAgICAgICAgaW5kZXggKz0gc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gOlxuICAgICAgICAvLyBsb29wICsgZ2FsbGVyeVxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoaW5kZXggPiBpbmRleE1heCkge1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4ID49IGluZGV4TWluICsgc2xpZGVDb3VudCkgeyBpbmRleCAtPSBzbGlkZUNvdW50OyB9XG4gICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IGluZGV4TWluKSB7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPD0gaW5kZXhNYXggLSBzbGlkZUNvdW50KSB7IGluZGV4ICs9IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gOlxuICAgICAgLy8gbm9uLWxvb3BcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbmRleCA9IE1hdGgubWF4KGluZGV4TWluLCBNYXRoLm1pbihpbmRleE1heCwgaW5kZXgpKTtcbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gZGlzYWJsZVVJICgpIHtcbiAgICBpZiAoIWF1dG9wbGF5ICYmIGF1dG9wbGF5QnV0dG9uKSB7IGhpZGVFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgIGlmICghbmF2ICYmIG5hdkNvbnRhaW5lcikgeyBoaWRlRWxlbWVudChuYXZDb250YWluZXIpOyB9XG4gICAgaWYgKCFjb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIGhpZGVFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IGhpZGVFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IGhpZGVFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW5hYmxlVUkgKCkge1xuICAgIGlmIChhdXRvcGxheSAmJiBhdXRvcGxheUJ1dHRvbikgeyBzaG93RWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICBpZiAobmF2ICYmIG5hdkNvbnRhaW5lcikgeyBzaG93RWxlbWVudChuYXZDb250YWluZXIpOyB9XG4gICAgaWYgKGNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgc2hvd0VsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgc2hvd0VsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgc2hvd0VsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmcmVlemVTbGlkZXIgKCkge1xuICAgIGlmIChmcm96ZW4pIHsgcmV0dXJuOyB9XG5cbiAgICAvLyByZW1vdmUgZWRnZSBwYWRkaW5nIGZyb20gaW5uZXIgd3JhcHBlclxuICAgIGlmIChlZGdlUGFkZGluZykgeyBpbm5lcldyYXBwZXIuc3R5bGUubWFyZ2luID0gJzBweCc7IH1cblxuICAgIC8vIGFkZCBjbGFzcyB0bnMtdHJhbnNwYXJlbnQgdG8gY2xvbmVkIHNsaWRlc1xuICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICB2YXIgc3RyID0gJ3Rucy10cmFuc3BhcmVudCc7XG4gICAgICBmb3IgKHZhciBpID0gY2xvbmVDb3VudDsgaS0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgYWRkQ2xhc3Moc2xpZGVJdGVtc1tpXSwgc3RyKTsgfVxuICAgICAgICBhZGRDbGFzcyhzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBpIC0gMV0sIHN0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZGlzYWJsZVVJKCk7XG5cbiAgICBmcm96ZW4gPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5mcmVlemVTbGlkZXIgKCkge1xuICAgIGlmICghZnJvemVuKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcmVzdG9yZSBlZGdlIHBhZGRpbmcgZm9yIGlubmVyIHdyYXBwZXJcbiAgICAvLyBmb3IgbW9yZGVybiBicm93c2Vyc1xuICAgIGlmIChlZGdlUGFkZGluZyAmJiBDU1NNUSkgeyBpbm5lcldyYXBwZXIuc3R5bGUubWFyZ2luID0gJyc7IH1cblxuICAgIC8vIHJlbW92ZSBjbGFzcyB0bnMtdHJhbnNwYXJlbnQgdG8gY2xvbmVkIHNsaWRlc1xuICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICB2YXIgc3RyID0gJ3Rucy10cmFuc3BhcmVudCc7XG4gICAgICBmb3IgKHZhciBpID0gY2xvbmVDb3VudDsgaS0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgcmVtb3ZlQ2xhc3Moc2xpZGVJdGVtc1tpXSwgc3RyKTsgfVxuICAgICAgICByZW1vdmVDbGFzcyhzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBpIC0gMV0sIHN0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZW5hYmxlVUkoKTtcblxuICAgIGZyb3plbiA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZVNsaWRlciAoKSB7XG4gICAgaWYgKGRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gICAgc2hlZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UobmV3Q29udGFpbmVyQ2xhc3Nlcy5zdWJzdHJpbmcoMSksICcnKTtcbiAgICByZW1vdmVBdHRycyhjb250YWluZXIsIFsnc3R5bGUnXSk7XG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBoaWRlRWxlbWVudChzbGlkZUl0ZW1zW2pdKTsgfVxuICAgICAgICBoaWRlRWxlbWVudChzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBqIC0gMV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZlcnRpY2FsIHNsaWRlclxuICAgIGlmICghaG9yaXpvbnRhbCB8fCAhY2Fyb3VzZWwpIHsgcmVtb3ZlQXR0cnMoaW5uZXJXcmFwcGVyLCBbJ3N0eWxlJ10pOyB9XG5cbiAgICAvLyBnYWxsZXJ5XG4gICAgaWYgKCFjYXJvdXNlbCkgeyBcbiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbCA9IGluZGV4ICsgc2xpZGVDb3VudDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG4gICAgICAgIHJlbW92ZUF0dHJzKGl0ZW0sIFsnc3R5bGUnXSk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGRpc2FibGVVSSgpO1xuXG4gICAgZGlzYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5hYmxlU2xpZGVyICgpIHtcbiAgICBpZiAoIWRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gICAgc2hlZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lICs9IG5ld0NvbnRhaW5lckNsYXNzZXM7XG4gICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcblxuICAgIGlmIChsb29wKSB7XG4gICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgc2hvd0VsZW1lbnQoc2xpZGVJdGVtc1tqXSk7IH1cbiAgICAgICAgc2hvd0VsZW1lbnQoc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaiAtIDFdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnYWxsZXJ5XG4gICAgaWYgKCFjYXJvdXNlbCkgeyBcbiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbCA9IGluZGV4ICsgc2xpZGVDb3VudDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV0sXG4gICAgICAgICAgICBjbGFzc04gPSBpIDwgaW5kZXggKyBpdGVtcyA/IGFuaW1hdGVJbiA6IGFuaW1hdGVOb3JtYWw7XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGNsYXNzTik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZW5hYmxlVUkoKTtcblxuICAgIGRpc2FibGVkID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaXZlUmVnaW9uICgpIHtcbiAgICB2YXIgc3RyID0gZ2V0TGl2ZVJlZ2lvblN0cigpO1xuICAgIGlmIChsaXZlcmVnaW9uQ3VycmVudC5pbm5lckhUTUwgIT09IHN0cikgeyBsaXZlcmVnaW9uQ3VycmVudC5pbm5lckhUTUwgPSBzdHI7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpdmVSZWdpb25TdHIgKCkge1xuICAgIHZhciBhcnIgPSBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpLFxuICAgICAgICBzdGFydCA9IGFyclswXSArIDEsXG4gICAgICAgIGVuZCA9IGFyclsxXSArIDE7XG4gICAgcmV0dXJuIHN0YXJ0ID09PSBlbmQgPyBzdGFydCArICcnIDogc3RhcnQgKyAnIHRvICcgKyBlbmQ7IFxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UgKHZhbCkge1xuICAgIGlmICh2YWwgPT0gbnVsbCkgeyB2YWwgPSBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSgpOyB9XG4gICAgdmFyIHN0YXJ0ID0gaW5kZXgsIGVuZCwgcmFuZ2VzdGFydCwgcmFuZ2VlbmQ7XG5cbiAgICAvLyBnZXQgcmFuZ2Ugc3RhcnQsIHJhbmdlIGVuZCBmb3IgYXV0b1dpZHRoIGFuZCBmaXhlZFdpZHRoXG4gICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgaWYgKGF1dG9XaWR0aCB8fCBmaXhlZFdpZHRoKSB7XG4gICAgICAgIHJhbmdlc3RhcnQgPSAtIChwYXJzZUZsb2F0KHZhbCkgKyBlZGdlUGFkZGluZyk7XG4gICAgICAgIHJhbmdlZW5kID0gcmFuZ2VzdGFydCArIHZpZXdwb3J0ICsgZWRnZVBhZGRpbmcgKiAyO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgIHJhbmdlc3RhcnQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleF07XG4gICAgICAgIHJhbmdlZW5kID0gcmFuZ2VzdGFydCArIHZpZXdwb3J0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCBzdGFydCwgZW5kXG4gICAgLy8gLSBjaGVjayBhdXRvIHdpZHRoXG4gICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgc2xpZGVQb3NpdGlvbnMuZm9yRWFjaChmdW5jdGlvbihwb2ludCwgaSkge1xuICAgICAgICBpZiAoaSA8IHNsaWRlQ291bnROZXcpIHtcbiAgICAgICAgICBpZiAoKGNlbnRlciB8fCBlZGdlUGFkZGluZykgJiYgcG9pbnQgPD0gcmFuZ2VzdGFydCArIDAuNSkgeyBzdGFydCA9IGk7IH1cbiAgICAgICAgICBpZiAocmFuZ2VlbmQgLSBwb2ludCA+PSAwLjUpIHsgZW5kID0gaTsgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIC8vIC0gY2hlY2sgcGVyY2VudGFnZSB3aWR0aCwgZml4ZWQgd2lkdGhcbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICB2YXIgY2VsbCA9IGZpeGVkV2lkdGggKyBndXR0ZXI7XG4gICAgICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICBzdGFydCA9IE1hdGguZmxvb3IocmFuZ2VzdGFydC9jZWxsKTtcbiAgICAgICAgICBlbmQgPSBNYXRoLmNlaWwocmFuZ2VlbmQvY2VsbCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgTWF0aC5jZWlsKHZpZXdwb3J0L2NlbGwpIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgdmFyIGEgPSBpdGVtcyAtIDE7XG4gICAgICAgICAgaWYgKGNlbnRlcikge1xuICAgICAgICAgICAgc3RhcnQgLT0gYSAvIDI7XG4gICAgICAgICAgICBlbmQgPSBpbmRleCArIGEgLyAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBpbmRleCArIGE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGVkZ2VQYWRkaW5nICogaXRlbXMgLyB2aWV3cG9ydDtcbiAgICAgICAgICAgIHN0YXJ0IC09IGI7XG4gICAgICAgICAgICBlbmQgKz0gYjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdGFydCA9IE1hdGguZmxvb3Ioc3RhcnQpO1xuICAgICAgICAgIGVuZCA9IE1hdGguY2VpbChlbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgaXRlbXMgLSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoc3RhcnQsIDApO1xuICAgICAgZW5kID0gTWF0aC5taW4oZW5kLCBzbGlkZUNvdW50TmV3IC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvTGF6eUxvYWQgKCkge1xuICAgIGlmIChsYXp5bG9hZCAmJiAhZGlzYWJsZSkge1xuICAgICAgZ2V0SW1hZ2VBcnJheS5hcHBseShudWxsLCBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpKS5mb3JFYWNoKGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgICAgaWYgKCFoYXNDbGFzcyhpbWcsIGltZ0NvbXBsZXRlQ2xhc3MpKSB7XG4gICAgICAgICAgLy8gc3RvcCBwcm9wYWdhdGlvbiB0cmFuc2l0aW9uZW5kIGV2ZW50IHRvIGNvbnRhaW5lclxuICAgICAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9O1xuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGV2ZSk7XG5cbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuXG4gICAgICAgICAgLy8gdXBkYXRlIHNyY1xuICAgICAgICAgIGltZy5zcmMgPSBnZXRBdHRyKGltZywgJ2RhdGEtc3JjJyk7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgc3Jjc2V0XG4gICAgICAgICAgdmFyIHNyY3NldCA9IGdldEF0dHIoaW1nLCAnZGF0YS1zcmNzZXQnKTtcbiAgICAgICAgICBpZiAoc3Jjc2V0KSB7IGltZy5zcmNzZXQgPSBzcmNzZXQ7IH1cblxuICAgICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25JbWdMb2FkZWQgKGUpIHtcbiAgICBpbWdMb2FkZWQoZ2V0VGFyZ2V0KGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uSW1nRmFpbGVkIChlKSB7XG4gICAgaW1nRmFpbGVkKGdldFRhcmdldChlKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdMb2FkZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ2xvYWRlZCcpO1xuICAgIGltZ0NvbXBsZXRlZChpbWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nRmFpbGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICdmYWlsZWQnKTtcbiAgICBpbWdDb21wbGV0ZWQoaW1nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0NvbXBsZXRlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAndG5zLWNvbXBsZXRlJyk7XG4gICAgcmVtb3ZlQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgIHJlbW92ZUV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbWFnZUFycmF5IChzdGFydCwgZW5kKSB7XG4gICAgdmFyIGltZ3MgPSBbXTtcbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBmb3JFYWNoKHNsaWRlSXRlbXNbc3RhcnRdLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpLCBmdW5jdGlvbiAoaW1nKSB7IGltZ3MucHVzaChpbWcpOyB9KTtcbiAgICAgIHN0YXJ0Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZ3M7XG4gIH1cblxuICAvLyBjaGVjayBpZiBhbGwgdmlzaWJsZSBpbWFnZXMgYXJlIGxvYWRlZFxuICAvLyBhbmQgdXBkYXRlIGNvbnRhaW5lciBoZWlnaHQgaWYgaXQncyBkb25lXG4gIGZ1bmN0aW9uIGRvQXV0b0hlaWdodCAoKSB7XG4gICAgdmFyIGltZ3MgPSBnZXRJbWFnZUFycmF5LmFwcGx5KG51bGwsIGdldFZpc2libGVTbGlkZVJhbmdlKCkpO1xuICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soaW1ncywgdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0KTsgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdzTG9hZGVkQ2hlY2sgKGltZ3MsIGNiKSB7XG4gICAgLy8gZGlyZWN0bHkgZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBhbGwgaW1hZ2VzIGFyZSBjb21wbGV0ZVxuICAgIGlmIChpbWdzQ29tcGxldGUpIHsgcmV0dXJuIGNiKCk7IH1cblxuICAgIC8vIGNoZWNrIHNlbGVjdGVkIGltYWdlIGNsYXNzZXMgb3RoZXJ3aXNlXG4gICAgaW1ncy5mb3JFYWNoKGZ1bmN0aW9uIChpbWcsIGluZGV4KSB7XG4gICAgICBpZiAoaGFzQ2xhc3MoaW1nLCBpbWdDb21wbGV0ZUNsYXNzKSkgeyBpbWdzLnNwbGljZShpbmRleCwgMSk7IH1cbiAgICB9KTtcblxuICAgIC8vIGV4ZWN1dGUgY2FsbGJhY2sgZnVuY3Rpb24gaWYgc2VsZWN0ZWQgaW1hZ2VzIGFyZSBhbGwgY29tcGxldGVcbiAgICBpZiAoIWltZ3MubGVuZ3RoKSB7IHJldHVybiBjYigpOyB9XG5cbiAgICAvLyBvdGhlcndpc2UgZXhlY3V0ZSB0aGlzIGZ1bmN0aW9uYSBhZ2FpblxuICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soaW1ncywgY2IpOyB9KTtcbiAgfSBcblxuICBmdW5jdGlvbiBhZGRpdGlvbmFsVXBkYXRlcyAoKSB7XG4gICAgZG9MYXp5TG9hZCgpOyBcbiAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xuICAgIHVwZGF0ZUxpdmVSZWdpb24oKTtcbiAgICB1cGRhdGVDb250cm9sc1N0YXR1cygpO1xuICAgIHVwZGF0ZU5hdlN0YXR1cygpO1xuICB9XG5cblxuICBmdW5jdGlvbiB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbiAoKSB7XG4gICAgaWYgKGNhcm91c2VsICYmIGF1dG9IZWlnaHQpIHtcbiAgICAgIG1pZGRsZVdyYXBwZXIuc3R5bGVbVFJBTlNJVElPTkRVUkFUSU9OXSA9IHNwZWVkIC8gMTAwMCArICdzJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXhTbGlkZUhlaWdodCAoc2xpZGVTdGFydCwgc2xpZGVSYW5nZSkge1xuICAgIHZhciBoZWlnaHRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IHNsaWRlU3RhcnQsIGwgPSBNYXRoLm1pbihzbGlkZVN0YXJ0ICsgc2xpZGVSYW5nZSwgc2xpZGVDb3VudE5ldyk7IGkgPCBsOyBpKyspIHtcbiAgICAgIGhlaWdodHMucHVzaChzbGlkZUl0ZW1zW2ldLm9mZnNldEhlaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIGhlaWdodHMpO1xuICB9XG5cbiAgLy8gdXBkYXRlIGlubmVyIHdyYXBwZXIgaGVpZ2h0XG4gIC8vIDEuIGdldCB0aGUgbWF4LWhlaWdodCBvZiB0aGUgdmlzaWJsZSBzbGlkZXNcbiAgLy8gMi4gc2V0IHRyYW5zaXRpb25EdXJhdGlvbiB0byBzcGVlZFxuICAvLyAzLiB1cGRhdGUgaW5uZXIgd3JhcHBlciBoZWlnaHQgdG8gbWF4LWhlaWdodFxuICAvLyA0LiBzZXQgdHJhbnNpdGlvbkR1cmF0aW9uIHRvIDBzIGFmdGVyIHRyYW5zaXRpb24gZG9uZVxuICBmdW5jdGlvbiB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQgKCkge1xuICAgIHZhciBtYXhIZWlnaHQgPSBhdXRvSGVpZ2h0ID8gZ2V0TWF4U2xpZGVIZWlnaHQoaW5kZXgsIGl0ZW1zKSA6IGdldE1heFNsaWRlSGVpZ2h0KGNsb25lQ291bnQsIHNsaWRlQ291bnQpLFxuICAgICAgICB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xuXG4gICAgaWYgKHdwLnN0eWxlLmhlaWdodCAhPT0gbWF4SGVpZ2h0KSB7IHdwLnN0eWxlLmhlaWdodCA9IG1heEhlaWdodCArICdweCc7IH1cbiAgfVxuXG4gIC8vIGdldCB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIGZpcnN0IHNsaWRlIHRvIGVhY2ggc2xpZGVcbiAgLy8gKGluaXQpID0+IHNsaWRlUG9zaXRpb25zXG4gIGZ1bmN0aW9uIHNldFNsaWRlUG9zaXRpb25zICgpIHtcbiAgICBzbGlkZVBvc2l0aW9ucyA9IFswXTtcbiAgICB2YXIgYXR0ciA9IGhvcml6b250YWwgPyAnbGVmdCcgOiAndG9wJyxcbiAgICAgICAgYXR0cjIgPSBob3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nLFxuICAgICAgICBiYXNlID0gc2xpZGVJdGVtc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyXTtcblxuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgLy8gc2tpcCB0aGUgZmlyc3Qgc2xpZGVcbiAgICAgIGlmIChpKSB7IHNsaWRlUG9zaXRpb25zLnB1c2goaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyXSAtIGJhc2UpOyB9XG4gICAgICAvLyBhZGQgdGhlIGVuZCBlZGdlXG4gICAgICBpZiAoaSA9PT0gc2xpZGVDb3VudE5ldyAtIDEpIHsgc2xpZGVQb3NpdGlvbnMucHVzaChpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHIyXSAtIGJhc2UpOyB9XG4gICAgfSk7XG4gIH1cblxuICAvLyB1cGRhdGUgc2xpZGVcbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVTdGF0dXMgKCkge1xuICAgIHZhciByYW5nZSA9IGdldFZpc2libGVTbGlkZVJhbmdlKCksXG4gICAgICAgIHN0YXJ0ID0gcmFuZ2VbMF0sXG4gICAgICAgIGVuZCA9IHJhbmdlWzFdO1xuXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAvLyBzaG93IHNsaWRlc1xuICAgICAgaWYgKGkgPj0gc3RhcnQgJiYgaSA8PSBlbmQpIHtcbiAgICAgICAgaWYgKGhhc0F0dHIoaXRlbSwgJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICByZW1vdmVBdHRycyhpdGVtLCBbJ2FyaWEtaGlkZGVuJywgJ3RhYmluZGV4J10pO1xuICAgICAgICAgIGFkZENsYXNzKGl0ZW0sIHNsaWRlQWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAvLyBoaWRlIHNsaWRlc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNBdHRyKGl0ZW0sICdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgICAgc2V0QXR0cnMoaXRlbSwge1xuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIHNsaWRlQWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBnYWxsZXJ5OiB1cGRhdGUgc2xpZGUgcG9zaXRpb25cbiAgZnVuY3Rpb24gdXBkYXRlR2FsbGVyeVNsaWRlUG9zaXRpb25zICgpIHtcbiAgICB2YXIgbCA9IGluZGV4ICsgTWF0aC5taW4oc2xpZGVDb3VudCwgaXRlbXMpO1xuICAgIGZvciAodmFyIGkgPSBzbGlkZUNvdW50TmV3OyBpLS07KSB7XG4gICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG5cbiAgICAgIGlmIChpID49IGluZGV4ICYmIGkgPCBsKSB7XG4gICAgICAgIC8vIGFkZCB0cmFuc2l0aW9ucyB0byB2aXNpYmxlIHNsaWRlcyB3aGVuIGFkanVzdGluZyB0aGVpciBwb3NpdGlvbnNcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1tb3ZpbmcnKTtcblxuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5zdHlsZS5sZWZ0KSB7XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIG91dGxldCBhbmltYXRpb25cbiAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVPdXQpO1xuICAgIH1cblxuICAgIC8vIHJlbW92aW5nICcudG5zLW1vdmluZydcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihlbCkge1xuICAgICAgICByZW1vdmVDbGFzcyhlbCwgJ3Rucy1tb3ZpbmcnKTtcbiAgICAgIH0pO1xuICAgIH0sIDMwMCk7XG4gIH1cblxuICAvLyBzZXQgdGFiaW5kZXggb24gTmF2XG4gIGZ1bmN0aW9uIHVwZGF0ZU5hdlN0YXR1cyAoKSB7XG4gICAgLy8gZ2V0IGN1cnJlbnQgbmF2XG4gICAgaWYgKG5hdikge1xuICAgICAgbmF2Q3VycmVudEluZGV4ID0gbmF2Q2xpY2tlZCA+PSAwID8gbmF2Q2xpY2tlZCA6IGdldEN1cnJlbnROYXZJbmRleCgpO1xuICAgICAgbmF2Q2xpY2tlZCA9IC0xO1xuXG4gICAgICBpZiAobmF2Q3VycmVudEluZGV4ICE9PSBuYXZDdXJyZW50SW5kZXhDYWNoZWQpIHtcbiAgICAgICAgdmFyIG5hdlByZXYgPSBuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhDYWNoZWRdLFxuICAgICAgICAgICAgbmF2Q3VycmVudCA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF07XG5cbiAgICAgICAgc2V0QXR0cnMobmF2UHJldiwge1xuICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAobmF2Q3VycmVudEluZGV4Q2FjaGVkICsgMSlcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdlByZXYsIG5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgXG4gICAgICAgIHNldEF0dHJzKG5hdkN1cnJlbnQsIHsnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXggKyAxKSArIG5hdlN0ckN1cnJlbnR9KTtcbiAgICAgICAgcmVtb3ZlQXR0cnMobmF2Q3VycmVudCwgJ3RhYmluZGV4Jyk7XG4gICAgICAgIGFkZENsYXNzKG5hdkN1cnJlbnQsIG5hdkFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZDdXJyZW50SW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TG93ZXJDYXNlTm9kZU5hbWUgKGVsKSB7XG4gICAgcmV0dXJuIGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0J1dHRvbiAoZWwpIHtcbiAgICByZXR1cm4gZ2V0TG93ZXJDYXNlTm9kZU5hbWUoZWwpID09PSAnYnV0dG9uJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXJpYURpc2FibGVkIChlbCkge1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzRW5hYmxlRWxlbWVudCAoaXNCdXR0b24sIGVsLCB2YWwpIHtcbiAgICBpZiAoaXNCdXR0b24pIHtcbiAgICAgIGVsLmRpc2FibGVkID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCB2YWwudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0ICdkaXNhYmxlZCcgdG8gdHJ1ZSBvbiBjb250cm9scyB3aGVuIHJlYWNoIHRoZSBlZGdlc1xuICBmdW5jdGlvbiB1cGRhdGVDb250cm9sc1N0YXR1cyAoKSB7XG4gICAgaWYgKCFjb250cm9scyB8fCByZXdpbmQgfHwgbG9vcCkgeyByZXR1cm47IH1cblxuICAgIHZhciBwcmV2RGlzYWJsZWQgPSAocHJldklzQnV0dG9uKSA/IHByZXZCdXR0b24uZGlzYWJsZWQgOiBpc0FyaWFEaXNhYmxlZChwcmV2QnV0dG9uKSxcbiAgICAgICAgbmV4dERpc2FibGVkID0gKG5leHRJc0J1dHRvbikgPyBuZXh0QnV0dG9uLmRpc2FibGVkIDogaXNBcmlhRGlzYWJsZWQobmV4dEJ1dHRvbiksXG4gICAgICAgIGRpc2FibGVQcmV2ID0gKGluZGV4IDw9IGluZGV4TWluKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgZGlzYWJsZU5leHQgPSAoIXJld2luZCAmJiBpbmRleCA+PSBpbmRleE1heCkgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBpZiAoZGlzYWJsZVByZXYgJiYgIXByZXZEaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChwcmV2SXNCdXR0b24sIHByZXZCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIWRpc2FibGVQcmV2ICYmIHByZXZEaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChwcmV2SXNCdXR0b24sIHByZXZCdXR0b24sIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKGRpc2FibGVOZXh0ICYmICFuZXh0RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQobmV4dElzQnV0dG9uLCBuZXh0QnV0dG9uLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKCFkaXNhYmxlTmV4dCAmJiBuZXh0RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQobmV4dElzQnV0dG9uLCBuZXh0QnV0dG9uLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IGR1cmF0aW9uXG4gIGZ1bmN0aW9uIHJlc2V0RHVyYXRpb24gKGVsLCBzdHIpIHtcbiAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IGVsLnN0eWxlW1RSQU5TSVRJT05EVVJBVElPTl0gPSBzdHI7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlcldpZHRoICgpIHtcbiAgICByZXR1cm4gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnROZXcgOiBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENlbnRlckdhcCAobnVtKSB7XG4gICAgaWYgKG51bSA9PSBudWxsKSB7IG51bSA9IGluZGV4OyB9XG5cbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBndXR0ZXIgOiAwO1xuICAgIHJldHVybiBhdXRvV2lkdGggPyAoKHZpZXdwb3J0IC0gZ2FwKSAtIChzbGlkZVBvc2l0aW9uc1tudW0gKyAxXSAtIHNsaWRlUG9zaXRpb25zW251bV0gLSBndXR0ZXIpKS8yIDpcbiAgICAgIGZpeGVkV2lkdGggPyAodmlld3BvcnQgLSBmaXhlZFdpZHRoKSAvIDIgOlxuICAgICAgICAoaXRlbXMgLSAxKSAvIDI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSaWdodEJvdW5kYXJ5ICgpIHtcbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBndXR0ZXIgOiAwLFxuICAgICAgICByZXN1bHQgPSAodmlld3BvcnQgKyBnYXApIC0gZ2V0U2xpZGVyV2lkdGgoKTtcblxuICAgIGlmIChjZW50ZXIgJiYgIWxvb3ApIHtcbiAgICAgIHJlc3VsdCA9IGZpeGVkV2lkdGggPyAtIChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIChzbGlkZUNvdW50TmV3IC0gMSkgLSBnZXRDZW50ZXJHYXAoKSA6XG4gICAgICAgIGdldENlbnRlckdhcChzbGlkZUNvdW50TmV3IC0gMSkgLSBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3IC0gMV07XG4gICAgfVxuICAgIGlmIChyZXN1bHQgPiAwKSB7IHJlc3VsdCA9IDA7IH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSAobnVtKSB7XG4gICAgaWYgKG51bSA9PSBudWxsKSB7IG51bSA9IGluZGV4OyB9XG5cbiAgICB2YXIgdmFsO1xuICAgIGlmIChob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgIHZhbCA9IC0gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogbnVtO1xuICAgICAgICBpZiAoY2VudGVyKSB7IHZhbCArPSBnZXRDZW50ZXJHYXAoKTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlbm9taW5hdG9yID0gVFJBTlNGT1JNID8gc2xpZGVDb3VudE5ldyA6IGl0ZW1zO1xuICAgICAgICBpZiAoY2VudGVyKSB7IG51bSAtPSBnZXRDZW50ZXJHYXAoKTsgfVxuICAgICAgICB2YWwgPSAtIG51bSAqIDEwMCAvIGRlbm9taW5hdG9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YWwgPSAtIHNsaWRlUG9zaXRpb25zW251bV07XG4gICAgICBpZiAoY2VudGVyICYmIGF1dG9XaWR0aCkge1xuICAgICAgICB2YWwgKz0gZ2V0Q2VudGVyR2FwKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1JpZ2h0RGVhZFpvbmUpIHsgdmFsID0gTWF0aC5tYXgodmFsLCByaWdodEJvdW5kYXJ5KTsgfVxuXG4gICAgdmFsICs9IChob3Jpem9udGFsICYmICFhdXRvV2lkdGggJiYgIWZpeGVkV2lkdGgpID8gJyUnIDogJ3B4JztcblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCAodmFsKSB7XG4gICAgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcwcycpO1xuICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKHZhbCk7XG4gIH1cblxuICBmdW5jdGlvbiBkb0NvbnRhaW5lclRyYW5zZm9ybSAodmFsKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7IHZhbCA9IGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCk7IH1cbiAgICBjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0gPSB0cmFuc2Zvcm1QcmVmaXggKyB2YWwgKyB0cmFuc2Zvcm1Qb3N0Zml4O1xuICB9XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZVNsaWRlIChudW1iZXIsIGNsYXNzT3V0LCBjbGFzc0luLCBpc091dCkge1xuICAgIHZhciBsID0gbnVtYmVyICsgaXRlbXM7XG4gICAgaWYgKCFsb29wKSB7IGwgPSBNYXRoLm1pbihsLCBzbGlkZUNvdW50TmV3KTsgfVxuXG4gICAgZm9yICh2YXIgaSA9IG51bWJlcjsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG5cbiAgICAgIC8vIHNldCBpdGVtIHBvc2l0aW9uc1xuICAgICAgaWYgKCFpc091dCkgeyBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnOyB9XG5cbiAgICAgIGlmIChhbmltYXRlRGVsYXkgJiYgVFJBTlNJVElPTkRFTEFZKSB7XG4gICAgICAgIGl0ZW0uc3R5bGVbVFJBTlNJVElPTkRFTEFZXSA9IGl0ZW0uc3R5bGVbQU5JTUFUSU9OREVMQVldID0gYW5pbWF0ZURlbGF5ICogKGkgLSBudW1iZXIpIC8gMTAwMCArICdzJztcbiAgICAgIH1cbiAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGNsYXNzT3V0KTtcbiAgICAgIGFkZENsYXNzKGl0ZW0sIGNsYXNzSW4pO1xuICAgICAgXG4gICAgICBpZiAoaXNPdXQpIHsgc2xpZGVJdGVtc091dC5wdXNoKGl0ZW0pOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gbWFrZSB0cmFuc2ZlciBhZnRlciBjbGljay9kcmFnOlxuICAvLyAxLiBjaGFuZ2UgJ3RyYW5zZm9ybScgcHJvcGVydHkgZm9yIG1vcmRlcm4gYnJvd3NlcnNcbiAgLy8gMi4gY2hhbmdlICdsZWZ0JyBwcm9wZXJ0eSBmb3IgbGVnYWN5IGJyb3dzZXJzXG4gIHZhciB0cmFuc2Zvcm1Db3JlID0gKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2Fyb3VzZWwgP1xuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJycpO1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OIHx8ICFzcGVlZCkge1xuICAgICAgICAgIC8vIGZvciBtb3JkZW4gYnJvd3NlcnMgd2l0aCBub24temVybyBkdXJhdGlvbiBvciBcbiAgICAgICAgICAvLyB6ZXJvIGR1cmF0aW9uIGZvciBhbGwgYnJvd3NlcnNcbiAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybSgpO1xuICAgICAgICAgIC8vIHJ1biBmYWxsYmFjayBmdW5jdGlvbiBtYW51YWxseSBcbiAgICAgICAgICAvLyB3aGVuIGR1cmF0aW9uIGlzIDAgLyBjb250YWluZXIgaXMgaGlkZGVuXG4gICAgICAgICAgaWYgKCFzcGVlZCB8fCAhaXNWaXNpYmxlKGNvbnRhaW5lcikpIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZvciBvbGQgYnJvd3NlciB3aXRoIG5vbi16ZXJvIGR1cmF0aW9uXG4gICAgICAgICAganNUcmFuc2Zvcm0oY29udGFpbmVyLCB0cmFuc2Zvcm1BdHRyLCB0cmFuc2Zvcm1QcmVmaXgsIHRyYW5zZm9ybVBvc3RmaXgsIGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCksIHNwZWVkLCBvblRyYW5zaXRpb25FbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFob3Jpem9udGFsKSB7IHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7IH1cbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBzbGlkZUl0ZW1zT3V0ID0gW107XG5cbiAgICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBldmVbQU5JTUFUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgICAgcmVtb3ZlRXZlbnRzKHNsaWRlSXRlbXNbaW5kZXhDYWNoZWRdLCBldmUpO1xuICAgICAgICBhZGRFdmVudHMoc2xpZGVJdGVtc1tpbmRleF0sIGV2ZSk7XG5cbiAgICAgICAgYW5pbWF0ZVNsaWRlKGluZGV4Q2FjaGVkLCBhbmltYXRlSW4sIGFuaW1hdGVPdXQsIHRydWUpO1xuICAgICAgICBhbmltYXRlU2xpZGUoaW5kZXgsIGFuaW1hdGVOb3JtYWwsIGFuaW1hdGVJbik7XG5cbiAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5IFxuICAgICAgICAvLyB3aGVuIHRyYW5zaXRpb24gb3IgYW5pbWF0aW9uIG5vdCBzdXBwb3J0ZWQgLyBkdXJhdGlvbiBpcyAwXG4gICAgICAgIGlmICghVFJBTlNJVElPTkVORCB8fCAhQU5JTUFUSU9ORU5EIHx8ICFzcGVlZCB8fCAhaXNWaXNpYmxlKGNvbnRhaW5lcikpIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gcmVuZGVyIChlLCBzbGlkZXJNb3ZlZCkge1xuICAgIGlmICh1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSkgeyB1cGRhdGVJbmRleCgpOyB9XG5cbiAgICAvLyByZW5kZXIgd2hlbiBzbGlkZXIgd2FzIG1vdmVkICh0b3VjaCBvciBkcmFnKSBldmVuIHRob3VnaCBpbmRleCBtYXkgbm90IGNoYW5nZVxuICAgIGlmIChpbmRleCAhPT0gaW5kZXhDYWNoZWQgfHwgc2xpZGVyTW92ZWQpIHtcbiAgICAgIC8vIGV2ZW50c1xuICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG4gICAgICBldmVudHMuZW1pdCgndHJhbnNpdGlvblN0YXJ0JywgaW5mbygpKTtcbiAgICAgIGlmIChhdXRvSGVpZ2h0KSB7IGRvQXV0b0hlaWdodCgpOyB9XG5cbiAgICAgIC8vIHBhdXNlIGF1dG9wbGF5IHdoZW4gY2xpY2sgb3Iga2V5ZG93biBmcm9tIHVzZXJcbiAgICAgIGlmIChhbmltYXRpbmcgJiYgZSAmJiBbJ2NsaWNrJywgJ2tleWRvd24nXS5pbmRleE9mKGUudHlwZSkgPj0gMCkgeyBzdG9wQXV0b3BsYXkoKTsgfVxuXG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIHRyYW5zZm9ybUNvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBUcmFuc2ZlciBwcmVmaXhlZCBwcm9wZXJ0aWVzIHRvIHRoZSBzYW1lIGZvcm1hdFxuICAgKiBDU1M6IC1XZWJraXQtVHJhbnNmb3JtID0+IHdlYmtpdHRyYW5zZm9ybVxuICAgKiBKUzogV2Via2l0VHJhbnNmb3JtID0+IHdlYmtpdHRyYW5zZm9ybVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gcHJvcGVydHlcbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIHN0clRyYW5zIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLS9nLCAnJyk7XG4gIH1cblxuICAvLyBBRlRFUiBUUkFOU0ZPUk1cbiAgLy8gVGhpbmdzIG5lZWQgdG8gYmUgZG9uZSBhZnRlciBhIHRyYW5zZmVyOlxuICAvLyAxLiBjaGVjayBpbmRleFxuICAvLyAyLiBhZGQgY2xhc3NlcyB0byB2aXNpYmxlIHNsaWRlXG4gIC8vIDMuIGRpc2FibGUgY29udHJvbHMgYnV0dG9ucyB3aGVuIHJlYWNoIHRoZSBmaXJzdC9sYXN0IHNsaWRlIGluIG5vbi1sb29wIHNsaWRlclxuICAvLyA0LiB1cGRhdGUgbmF2IHN0YXR1c1xuICAvLyA1LiBsYXp5bG9hZCBpbWFnZXNcbiAgLy8gNi4gdXBkYXRlIGNvbnRhaW5lciBoZWlnaHRcbiAgZnVuY3Rpb24gb25UcmFuc2l0aW9uRW5kIChldmVudCkge1xuICAgIC8vIGNoZWNrIHJ1bm5pbmcgb24gZ2FsbGVyeSBtb2RlXG4gICAgLy8gbWFrZSBzdXJlIHRyYW50aW9uZW5kL2FuaW1hdGlvbmVuZCBldmVudHMgcnVuIG9ubHkgb25jZVxuICAgIGlmIChjYXJvdXNlbCB8fCBydW5uaW5nKSB7XG4gICAgICBldmVudHMuZW1pdCgndHJhbnNpdGlvbkVuZCcsIGluZm8oZXZlbnQpKTtcblxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBzbGlkZUl0ZW1zT3V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZUl0ZW1zT3V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zT3V0W2ldO1xuICAgICAgICAgIC8vIHNldCBpdGVtIHBvc2l0aW9uc1xuICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICcnO1xuXG4gICAgICAgICAgaWYgKEFOSU1BVElPTkRFTEFZICYmIFRSQU5TSVRJT05ERUxBWSkgeyBcbiAgICAgICAgICAgIGl0ZW0uc3R5bGVbQU5JTUFUSU9OREVMQVldID0gJyc7XG4gICAgICAgICAgICBpdGVtLnN0eWxlW1RSQU5TSVRJT05ERUxBWV0gPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XG4gICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogdXBkYXRlIHNsaWRlcywgbmF2LCBjb250cm9scyBhZnRlciBjaGVja2luZyAuLi5cbiAgICAgICAqID0+IGxlZ2FjeSBicm93c2VycyB3aG8gZG9uJ3Qgc3VwcG9ydCAnZXZlbnQnIFxuICAgICAgICogICAgaGF2ZSB0byBjaGVjayBldmVudCBmaXJzdCwgb3RoZXJ3aXNlIGV2ZW50LnRhcmdldCB3aWxsIGNhdXNlIGFuIGVycm9yIFxuICAgICAgICogPT4gb3IgJ2dhbGxlcnknIG1vZGU6IFxuICAgICAgICogICArIGV2ZW50IHRhcmdldCBpcyBzbGlkZSBpdGVtXG4gICAgICAgKiA9PiBvciAnY2Fyb3VzZWwnIG1vZGU6IFxuICAgICAgICogICArIGV2ZW50IHRhcmdldCBpcyBjb250YWluZXIsIFxuICAgICAgICogICArIGV2ZW50LnByb3BlcnR5IGlzIHRoZSBzYW1lIHdpdGggdHJhbnNmb3JtIGF0dHJpYnV0ZVxuICAgICAgICovXG4gICAgICBpZiAoIWV2ZW50IHx8IFxuICAgICAgICAgICFjYXJvdXNlbCAmJiBldmVudC50YXJnZXQucGFyZW50Tm9kZSA9PT0gY29udGFpbmVyIHx8IFxuICAgICAgICAgIGV2ZW50LnRhcmdldCA9PT0gY29udGFpbmVyICYmIHN0clRyYW5zKGV2ZW50LnByb3BlcnR5TmFtZSkgPT09IHN0clRyYW5zKHRyYW5zZm9ybUF0dHIpKSB7XG5cbiAgICAgICAgaWYgKCF1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSkgeyBcbiAgICAgICAgICB2YXIgaW5kZXhUZW0gPSBpbmRleDtcbiAgICAgICAgICB1cGRhdGVJbmRleCgpO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gaW5kZXhUZW0pIHsgXG4gICAgICAgICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcblxuICAgICAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykgeyBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpOyB9XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIC8vICMgQUNUSU9OU1xuICBmdW5jdGlvbiBnb1RvICh0YXJnZXRJbmRleCwgZSkge1xuICAgIGlmIChmcmVlemUpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBwcmV2IHNsaWRlQnlcbiAgICBpZiAodGFyZ2V0SW5kZXggPT09ICdwcmV2Jykge1xuICAgICAgb25Db250cm9sc0NsaWNrKGUsIC0xKTtcblxuICAgIC8vIG5leHQgc2xpZGVCeVxuICAgIH0gZWxzZSBpZiAodGFyZ2V0SW5kZXggPT09ICduZXh0Jykge1xuICAgICAgb25Db250cm9sc0NsaWNrKGUsIDEpO1xuXG4gICAgLy8gZ28gdG8gZXhhY3Qgc2xpZGVcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgICB9XG5cbiAgICAgIHZhciBhYnNJbmRleCA9IGdldEFic0luZGV4KCksIFxuICAgICAgICAgIGluZGV4R2FwID0gMDtcblxuICAgICAgaWYgKHRhcmdldEluZGV4ID09PSAnZmlyc3QnKSB7XG4gICAgICAgIGluZGV4R2FwID0gLSBhYnNJbmRleDtcbiAgICAgIH0gZWxzZSBpZiAodGFyZ2V0SW5kZXggPT09ICdsYXN0Jykge1xuICAgICAgICBpbmRleEdhcCA9IGNhcm91c2VsID8gc2xpZGVDb3VudCAtIGl0ZW1zIC0gYWJzSW5kZXggOiBzbGlkZUNvdW50IC0gMSAtIGFic0luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRJbmRleCAhPT0gJ251bWJlcicpIHsgdGFyZ2V0SW5kZXggPSBwYXJzZUludCh0YXJnZXRJbmRleCk7IH1cblxuICAgICAgICBpZiAoIWlzTmFOKHRhcmdldEluZGV4KSkge1xuICAgICAgICAgIC8vIGZyb20gZGlyZWN0bHkgY2FsbGVkIGdvVG8gZnVuY3Rpb25cbiAgICAgICAgICBpZiAoIWUpIHsgdGFyZ2V0SW5kZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzbGlkZUNvdW50IC0gMSwgdGFyZ2V0SW5kZXgpKTsgfVxuXG4gICAgICAgICAgaW5kZXhHYXAgPSB0YXJnZXRJbmRleCAtIGFic0luZGV4O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGdhbGxlcnk6IG1ha2Ugc3VyZSBuZXcgcGFnZSB3b24ndCBvdmVybGFwIHdpdGggY3VycmVudCBwYWdlXG4gICAgICBpZiAoIWNhcm91c2VsICYmIGluZGV4R2FwICYmIE1hdGguYWJzKGluZGV4R2FwKSA8IGl0ZW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3IgPSBpbmRleEdhcCA+IDAgPyAxIDogLTE7XG4gICAgICAgIGluZGV4R2FwICs9IChpbmRleCArIGluZGV4R2FwIC0gc2xpZGVDb3VudCkgPj0gaW5kZXhNaW4gPyBzbGlkZUNvdW50ICogZmFjdG9yIDogc2xpZGVDb3VudCAqIDIgKiBmYWN0b3IgKiAtMTtcbiAgICAgIH1cblxuICAgICAgaW5kZXggKz0gaW5kZXhHYXA7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSBpbmRleCBpcyBpbiByYW5nZVxuICAgICAgaWYgKGNhcm91c2VsICYmIGxvb3ApIHtcbiAgICAgICAgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxuICAgICAgICBpZiAoaW5kZXggPiBpbmRleE1heCkgeyBpbmRleCAtPSBzbGlkZUNvdW50OyB9XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGluZGV4IGlzIGNoYW5nZWQsIHN0YXJ0IHJlbmRlcmluZ1xuICAgICAgaWYgKGdldEFic0luZGV4KGluZGV4KSAhPT0gZ2V0QWJzSW5kZXgoaW5kZXhDYWNoZWQpKSB7XG4gICAgICAgIHJlbmRlcihlKTtcbiAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIC8vIG9uIGNvbnRyb2xzIGNsaWNrXG4gIGZ1bmN0aW9uIG9uQ29udHJvbHNDbGljayAoZSwgZGlyKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cbiAgICB2YXIgcGFzc0V2ZW50T2JqZWN0O1xuXG4gICAgaWYgKCFkaXIpIHtcbiAgICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoZSk7XG5cbiAgICAgIHdoaWxlICh0YXJnZXQgIT09IGNvbnRyb2xzQ29udGFpbmVyICYmIFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXS5pbmRleE9mKHRhcmdldCkgPCAwKSB7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlOyB9XG5cbiAgICAgIHZhciB0YXJnZXRJbiA9IFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXS5pbmRleE9mKHRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0SW4gPj0gMCkge1xuICAgICAgICBwYXNzRXZlbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBkaXIgPSB0YXJnZXRJbiA9PT0gMCA/IC0xIDogMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmV3aW5kKSB7XG4gICAgICBpZiAoaW5kZXggPT09IGluZGV4TWluICYmIGRpciA9PT0gLTEpIHtcbiAgICAgICAgZ29UbygnbGFzdCcsIGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBpbmRleE1heCAmJiBkaXIgPT09IDEpIHtcbiAgICAgICAgZ29UbygnZmlyc3QnLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXIpIHtcbiAgICAgIGluZGV4ICs9IHNsaWRlQnkgKiBkaXI7XG4gICAgICBpZiAoYXV0b1dpZHRoKSB7IGluZGV4ID0gTWF0aC5mbG9vcihpbmRleCk7IH1cbiAgICAgIC8vIHBhc3MgZSB3aGVuIGNsaWNrIGNvbnRyb2wgYnV0dG9ucyBvciBrZXlkb3duXG4gICAgICByZW5kZXIoKHBhc3NFdmVudE9iamVjdCB8fCAoZSAmJiBlLnR5cGUgPT09ICdrZXlkb3duJykpID8gZSA6IG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG9uIG5hdiBjbGlja1xuICBmdW5jdGlvbiBvbk5hdkNsaWNrIChlKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cbiAgICBcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKSwgbmF2SW5kZXg7XG5cbiAgICAvLyBmaW5kIHRoZSBjbGlja2VkIG5hdiBpdGVtXG4gICAgd2hpbGUgKHRhcmdldCAhPT0gbmF2Q29udGFpbmVyICYmICFoYXNBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpIHsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7IH1cbiAgICBpZiAoaGFzQXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSB7XG4gICAgICB2YXIgbmF2SW5kZXggPSBuYXZDbGlja2VkID0gTnVtYmVyKGdldEF0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSksXG4gICAgICAgICAgdGFyZ2V0SW5kZXhCYXNlID0gZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggPyBuYXZJbmRleCAqIHNsaWRlQ291bnQgLyBwYWdlcyA6IG5hdkluZGV4ICogaXRlbXMsXG4gICAgICAgICAgdGFyZ2V0SW5kZXggPSBuYXZBc1RodW1ibmFpbHMgPyBuYXZJbmRleCA6IE1hdGgubWluKE1hdGguY2VpbCh0YXJnZXRJbmRleEJhc2UpLCBzbGlkZUNvdW50IC0gMSk7XG4gICAgICBnb1RvKHRhcmdldEluZGV4LCBlKTtcblxuICAgICAgaWYgKG5hdkN1cnJlbnRJbmRleCA9PT0gbmF2SW5kZXgpIHtcbiAgICAgICAgaWYgKGFuaW1hdGluZykgeyBzdG9wQXV0b3BsYXkoKTsgfVxuICAgICAgICBuYXZDbGlja2VkID0gLTE7IC8vIHJlc2V0IG5hdkNsaWNrZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBhdXRvcGxheSBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gc2V0QXV0b3BsYXlUaW1lciAoKSB7XG4gICAgYXV0b3BsYXlUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhudWxsLCBhdXRvcGxheURpcmVjdGlvbik7XG4gICAgfSwgYXV0b3BsYXlUaW1lb3V0KTtcblxuICAgIGFuaW1hdGluZyA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wQXV0b3BsYXlUaW1lciAoKSB7XG4gICAgY2xlYXJJbnRlcnZhbChhdXRvcGxheVRpbWVyKTtcbiAgICBhbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUF1dG9wbGF5QnV0dG9uIChhY3Rpb24sIHR4dCkge1xuICAgIHNldEF0dHJzKGF1dG9wbGF5QnV0dG9uLCB7J2RhdGEtYWN0aW9uJzogYWN0aW9ufSk7XG4gICAgYXV0b3BsYXlCdXR0b24uaW5uZXJIVE1MID0gYXV0b3BsYXlIdG1sU3RyaW5nc1swXSArIGFjdGlvbiArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMV0gKyB0eHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEF1dG9wbGF5ICgpIHtcbiAgICBzZXRBdXRvcGxheVRpbWVyKCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHVwZGF0ZUF1dG9wbGF5QnV0dG9uKCdzdG9wJywgYXV0b3BsYXlUZXh0WzFdKTsgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RvcEF1dG9wbGF5ICgpIHtcbiAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyB1cGRhdGVBdXRvcGxheUJ1dHRvbignc3RhcnQnLCBhdXRvcGxheVRleHRbMF0pOyB9XG4gIH1cblxuICAvLyBwcm9ncmFtYWl0Y2FsbHkgcGxheS9wYXVzZSB0aGUgc2xpZGVyXG4gIGZ1bmN0aW9uIHBsYXkgKCkge1xuICAgIGlmIChhdXRvcGxheSAmJiAhYW5pbWF0aW5nKSB7XG4gICAgICBzdGFydEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcGF1c2UgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgIHN0b3BBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVBdXRvcGxheSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgc3RvcEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblZpc2liaWxpdHlDaGFuZ2UgKCkge1xuICAgIGlmIChkb2MuaGlkZGVuKSB7XG4gICAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQpIHtcbiAgICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlb3ZlclBhdXNlICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7IFxuICAgICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlb3V0UmVzdGFydCAoKSB7XG4gICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZWQpIHsgXG4gICAgICBzZXRBdXRvcGxheVRpbWVyKCk7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8ga2V5ZG93biBldmVudHMgb24gZG9jdW1lbnQgXG4gIGZ1bmN0aW9uIG9uRG9jdW1lbnRLZXlkb3duIChlKSB7XG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFRdLmluZGV4T2YoZS5rZXlDb2RlKTtcblxuICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwga2V5SW5kZXggPT09IDAgPyAtMSA6IDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG9uIGtleSBjb250cm9sXG4gIGZ1bmN0aW9uIG9uQ29udHJvbHNLZXlkb3duIChlKSB7XG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFRdLmluZGV4T2YoZS5rZXlDb2RlKTtcblxuICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICBpZiAoa2V5SW5kZXggPT09IDApIHtcbiAgICAgICAgaWYgKCFwcmV2QnV0dG9uLmRpc2FibGVkKSB7IG9uQ29udHJvbHNDbGljayhlLCAtMSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoIW5leHRCdXR0b24uZGlzYWJsZWQpIHtcbiAgICAgICAgb25Db250cm9sc0NsaWNrKGUsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBmb2N1c1xuICBmdW5jdGlvbiBzZXRGb2N1cyAoZWwpIHtcbiAgICBlbC5mb2N1cygpO1xuICB9XG5cbiAgLy8gb24ga2V5IG5hdlxuICBmdW5jdGlvbiBvbk5hdktleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGN1ckVsZW1lbnQgPSBkb2MuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoIWhhc0F0dHIoY3VyRWxlbWVudCwgJ2RhdGEtbmF2JykpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyB2YXIgY29kZSA9IGUua2V5Q29kZSxcbiAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hULCBLRVlTLkVOVEVSLCBLRVlTLlNQQUNFXS5pbmRleE9mKGUua2V5Q29kZSksXG4gICAgICAgIG5hdkluZGV4ID0gTnVtYmVyKGdldEF0dHIoY3VyRWxlbWVudCwgJ2RhdGEtbmF2JykpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIGlmIChrZXlJbmRleCA9PT0gMCkge1xuICAgICAgICBpZiAobmF2SW5kZXggPiAwKSB7IHNldEZvY3VzKG5hdkl0ZW1zW25hdkluZGV4IC0gMV0pOyB9XG4gICAgICB9IGVsc2UgaWYgKGtleUluZGV4ID09PSAxKSB7XG4gICAgICAgIGlmIChuYXZJbmRleCA8IHBhZ2VzIC0gMSkgeyBzZXRGb2N1cyhuYXZJdGVtc1tuYXZJbmRleCArIDFdKTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmF2Q2xpY2tlZCA9IG5hdkluZGV4O1xuICAgICAgICBnb1RvKG5hdkluZGV4LCBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFdmVudCAoZSkge1xuICAgIGUgPSBlIHx8IHdpbi5ldmVudDtcbiAgICByZXR1cm4gaXNUb3VjaEV2ZW50KGUpID8gZS5jaGFuZ2VkVG91Y2hlc1swXSA6IGU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0IChlKSB7XG4gICAgcmV0dXJuIGUudGFyZ2V0IHx8IHdpbi5ldmVudC5zcmNFbGVtZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNUb3VjaEV2ZW50IChlKSB7XG4gICAgcmV0dXJuIGUudHlwZS5pbmRleE9mKCd0b3VjaCcpID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCAoKSB7XG4gICAgcmV0dXJuIGdldFRvdWNoRGlyZWN0aW9uKHRvRGVncmVlKGxhc3RQb3NpdGlvbi55IC0gaW5pdFBvc2l0aW9uLnksIGxhc3RQb3NpdGlvbi54IC0gaW5pdFBvc2l0aW9uLngpLCBzd2lwZUFuZ2xlKSA9PT0gb3B0aW9ucy5heGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5TdGFydCAoZSkge1xuICAgIGlmIChydW5uaW5nKSB7XG4gICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICB9XG5cbiAgICBpZiAoYXV0b3BsYXkgJiYgYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheVRpbWVyKCk7IH1cbiAgICBcbiAgICBwYW5TdGFydCA9IHRydWU7XG4gICAgaWYgKHJhZkluZGV4KSB7XG4gICAgICBjYWYocmFmSW5kZXgpO1xuICAgICAgcmFmSW5kZXggPSBudWxsO1xuICAgIH1cblxuICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgZXZlbnRzLmVtaXQoaXNUb3VjaEV2ZW50KGUpID8gJ3RvdWNoU3RhcnQnIDogJ2RyYWdTdGFydCcsIGluZm8oZSkpO1xuXG4gICAgaWYgKCFpc1RvdWNoRXZlbnQoZSkgJiYgWydpbWcnLCAnYSddLmluZGV4T2YoZ2V0TG93ZXJDYXNlTm9kZU5hbWUoZ2V0VGFyZ2V0KGUpKSkgPj0gMCkge1xuICAgICAgcHJldmVudERlZmF1bHRCZWhhdmlvcihlKTtcbiAgICB9XG5cbiAgICBsYXN0UG9zaXRpb24ueCA9IGluaXRQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xuICAgIGxhc3RQb3NpdGlvbi55ID0gaW5pdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XG4gICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICB0cmFuc2xhdGVJbml0ID0gcGFyc2VGbG9hdChjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0ucmVwbGFjZSh0cmFuc2Zvcm1QcmVmaXgsICcnKSk7XG4gICAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJzBzJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5Nb3ZlIChlKSB7XG4gICAgaWYgKHBhblN0YXJ0KSB7XG4gICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgICAgbGFzdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgICBsYXN0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcblxuICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIGlmICghcmFmSW5kZXgpIHsgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKXsgcGFuVXBkYXRlKGUpOyB9KTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9PT0gJz8nKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCgpOyB9XG4gICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHsgcHJldmVudFNjcm9sbCA9IHRydWU7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZlbnRTY3JvbGwpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFuVXBkYXRlIChlKSB7XG4gICAgaWYgKCFtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcbiAgICAgIHBhblN0YXJ0ID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNhZihyYWZJbmRleCk7XG4gICAgaWYgKHBhblN0YXJ0KSB7IHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCl7IHBhblVwZGF0ZShlKTsgfSk7IH1cblxuICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPT09ICc/JykgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQoKTsgfVxuICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcbiAgICAgIGlmICghcHJldmVudFNjcm9sbCAmJiBpc1RvdWNoRXZlbnQoZSkpIHsgcHJldmVudFNjcm9sbCA9IHRydWU7IH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGUudHlwZSkgeyBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hNb3ZlJyA6ICdkcmFnTW92ZScsIGluZm8oZSkpOyB9XG4gICAgICB9IGNhdGNoKGVycikge31cblxuICAgICAgdmFyIHggPSB0cmFuc2xhdGVJbml0LFxuICAgICAgICAgIGRpc3QgPSBnZXREaXN0KGxhc3RQb3NpdGlvbiwgaW5pdFBvc2l0aW9uKTtcbiAgICAgIGlmICghaG9yaXpvbnRhbCB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkge1xuICAgICAgICB4ICs9IGRpc3Q7XG4gICAgICAgIHggKz0gJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwZXJjZW50YWdlWCA9IFRSQU5TRk9STSA/IGRpc3QgKiBpdGVtcyAqIDEwMCAvICgodmlld3BvcnQgKyBndXR0ZXIpICogc2xpZGVDb3VudE5ldyk6IGRpc3QgKiAxMDAgLyAodmlld3BvcnQgKyBndXR0ZXIpO1xuICAgICAgICB4ICs9IHBlcmNlbnRhZ2VYO1xuICAgICAgICB4ICs9ICclJztcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdID0gdHJhbnNmb3JtUHJlZml4ICsgeCArIHRyYW5zZm9ybVBvc3RmaXg7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5FbmQgKGUpIHtcbiAgICBpZiAocGFuU3RhcnQpIHtcbiAgICAgIGlmIChyYWZJbmRleCkge1xuICAgICAgICBjYWYocmFmSW5kZXgpO1xuICAgICAgICByYWZJbmRleCA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoY2Fyb3VzZWwpIHsgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcnKTsgfVxuICAgICAgcGFuU3RhcnQgPSBmYWxzZTtcblxuICAgICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICAgIGxhc3RQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xuICAgICAgbGFzdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XG4gICAgICB2YXIgZGlzdCA9IGdldERpc3QobGFzdFBvc2l0aW9uLCBpbml0UG9zaXRpb24pO1xuXG4gICAgICBpZiAoTWF0aC5hYnMoZGlzdCkpIHtcbiAgICAgICAgLy8gZHJhZyB2cyBjbGlja1xuICAgICAgICBpZiAoIWlzVG91Y2hFdmVudChlKSkge1xuICAgICAgICAgIC8vIHByZXZlbnQgXCJjbGlja1wiXG4gICAgICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKTtcbiAgICAgICAgICBhZGRFdmVudHModGFyZ2V0LCB7J2NsaWNrJzogZnVuY3Rpb24gcHJldmVudENsaWNrIChlKSB7XG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yKGUpO1xuICAgICAgICAgICAgcmVtb3ZlRXZlbnRzKHRhcmdldCwgeydjbGljayc6IHByZXZlbnRDbGlja30pO1xuICAgICAgICAgIH19KTsgXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcbiAgICAgICAgICAgICAgdmFyIGluZGV4TW92ZWQgPSAtIGRpc3QgKiBpdGVtcyAvICh2aWV3cG9ydCArIGd1dHRlcik7XG4gICAgICAgICAgICAgIGluZGV4TW92ZWQgPSBkaXN0ID4gMCA/IE1hdGguZmxvb3IoaW5kZXhNb3ZlZCkgOiBNYXRoLmNlaWwoaW5kZXhNb3ZlZCk7XG4gICAgICAgICAgICAgIGluZGV4ICs9IGluZGV4TW92ZWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgbW92ZWQgPSAtICh0cmFuc2xhdGVJbml0ICsgZGlzdCk7XG4gICAgICAgICAgICAgIGlmIChtb3ZlZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE1pbjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChtb3ZlZCA+PSBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3IC0gMV0pIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4TWF4O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IHNsaWRlQ291bnROZXcgJiYgbW92ZWQgPj0gc2xpZGVQb3NpdGlvbnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgIGlmIChtb3ZlZCA+IHNsaWRlUG9zaXRpb25zW2ldICYmIGRpc3QgPCAwKSB7IGluZGV4ICs9IDE7IH1cbiAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVuZGVyKGUsIGRpc3QpO1xuICAgICAgICAgICAgZXZlbnRzLmVtaXQoaXNUb3VjaEV2ZW50KGUpID8gJ3RvdWNoRW5kJyA6ICdkcmFnRW5kJywgaW5mbyhlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgICAgICAgb25Db250cm9sc0NsaWNrKGUsIGRpc3QgPiAwID8gLTEgOiAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXNldFxuICAgIGlmIChvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoID09PSAnYXV0bycpIHsgcHJldmVudFNjcm9sbCA9IGZhbHNlOyB9XG4gICAgaWYgKHN3aXBlQW5nbGUpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gJz8nOyB9IFxuICAgIGlmIChhdXRvcGxheSAmJiAhYW5pbWF0aW5nKSB7IHNldEF1dG9wbGF5VGltZXIoKTsgfVxuICB9XG5cbiAgLy8gPT09IFJFU0laRSBGVU5DVElPTlMgPT09IC8vXG4gIC8vIChzbGlkZVBvc2l0aW9ucywgaW5kZXgsIGl0ZW1zKSA9PiB2ZXJ0aWNhbF9jb25lbnRXcmFwcGVyLmhlaWdodFxuICBmdW5jdGlvbiB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCAoKSB7XG4gICAgdmFyIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG4gICAgd3Auc3R5bGUuaGVpZ2h0ID0gc2xpZGVQb3NpdGlvbnNbaW5kZXggKyBpdGVtc10gLSBzbGlkZVBvc2l0aW9uc1tpbmRleF0gKyAncHgnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFnZXMgKCkge1xuICAgIHZhciByb3VnaCA9IGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50IC8gdmlld3BvcnQgOiBzbGlkZUNvdW50IC8gaXRlbXM7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGguY2VpbChyb3VnaCksIHNsaWRlQ291bnQpO1xuICB9XG5cbiAgLypcbiAgICogMS4gdXBkYXRlIHZpc2libGUgbmF2IGl0ZW1zIGxpc3RcbiAgICogMi4gYWRkIFwiaGlkZGVuXCIgYXR0cmlidXRlcyB0byBwcmV2aW91cyB2aXNpYmxlIG5hdiBpdGVtc1xuICAgKiAzLiByZW1vdmUgXCJoaWRkZW5cIiBhdHRydWJ1dGVzIHRvIG5ldyB2aXNpYmxlIG5hdiBpdGVtc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlTmF2VmlzaWJpbGl0eSAoKSB7XG4gICAgaWYgKCFuYXYgfHwgbmF2QXNUaHVtYm5haWxzKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHBhZ2VzICE9PSBwYWdlc0NhY2hlZCkge1xuICAgICAgdmFyIG1pbiA9IHBhZ2VzQ2FjaGVkLFxuICAgICAgICAgIG1heCA9IHBhZ2VzLFxuICAgICAgICAgIGZuID0gc2hvd0VsZW1lbnQ7XG5cbiAgICAgIGlmIChwYWdlc0NhY2hlZCA+IHBhZ2VzKSB7XG4gICAgICAgIG1pbiA9IHBhZ2VzO1xuICAgICAgICBtYXggPSBwYWdlc0NhY2hlZDtcbiAgICAgICAgZm4gPSBoaWRlRWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKG1pbiA8IG1heCkge1xuICAgICAgICBmbihuYXZJdGVtc1ttaW5dKTtcbiAgICAgICAgbWluKys7XG4gICAgICB9XG5cbiAgICAgIC8vIGNhY2hlIHBhZ2VzXG4gICAgICBwYWdlc0NhY2hlZCA9IHBhZ2VzO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluZm8gKGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGFpbmVyOiBjb250YWluZXIsXG4gICAgICBzbGlkZUl0ZW1zOiBzbGlkZUl0ZW1zLFxuICAgICAgbmF2Q29udGFpbmVyOiBuYXZDb250YWluZXIsXG4gICAgICBuYXZJdGVtczogbmF2SXRlbXMsXG4gICAgICBjb250cm9sc0NvbnRhaW5lcjogY29udHJvbHNDb250YWluZXIsXG4gICAgICBoYXNDb250cm9sczogaGFzQ29udHJvbHMsXG4gICAgICBwcmV2QnV0dG9uOiBwcmV2QnV0dG9uLFxuICAgICAgbmV4dEJ1dHRvbjogbmV4dEJ1dHRvbixcbiAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgIHNsaWRlQnk6IHNsaWRlQnksXG4gICAgICBjbG9uZUNvdW50OiBjbG9uZUNvdW50LFxuICAgICAgc2xpZGVDb3VudDogc2xpZGVDb3VudCxcbiAgICAgIHNsaWRlQ291bnROZXc6IHNsaWRlQ291bnROZXcsXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBpbmRleENhY2hlZDogaW5kZXhDYWNoZWQsXG4gICAgICBkaXNwbGF5SW5kZXg6IGdldEN1cnJlbnRTbGlkZSgpLFxuICAgICAgbmF2Q3VycmVudEluZGV4OiBuYXZDdXJyZW50SW5kZXgsXG4gICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQ6IG5hdkN1cnJlbnRJbmRleENhY2hlZCxcbiAgICAgIHBhZ2VzOiBwYWdlcyxcbiAgICAgIHBhZ2VzQ2FjaGVkOiBwYWdlc0NhY2hlZCxcbiAgICAgIHNoZWV0OiBzaGVldCxcbiAgICAgIGlzT246IGlzT24sXG4gICAgICBldmVudDogZSB8fCB7fSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uOiAnMi45LjInLFxuICAgIGdldEluZm86IGluZm8sXG4gICAgZXZlbnRzOiBldmVudHMsXG4gICAgZ29UbzogZ29UbyxcbiAgICBwbGF5OiBwbGF5LFxuICAgIHBhdXNlOiBwYXVzZSxcbiAgICBpc09uOiBpc09uLFxuICAgIHVwZGF0ZVNsaWRlckhlaWdodDogdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0LFxuICAgIHJlZnJlc2g6IGluaXRTbGlkZXJUcmFuc2Zvcm0sXG4gICAgZGVzdHJveTogZGVzdHJveSxcbiAgICByZWJ1aWxkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0bnMoZXh0ZW5kKG9wdGlvbnMsIG9wdGlvbnNFbGVtZW50cykpO1xuICAgIH1cbiAgfTtcbn07XG5cbnJldHVybiB0bnM7XG59KSgpOyIsImNvbnN0IGhhbmRsZVRvZ2dsZSA9IChldmVudCkgPT4ge1xuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICB2YXIgcGFyZW50Tm9kZSA9IHRhcmdldC5jbG9zZXN0KCcuZmFxLWl0ZW0nKTtcblxuICBwYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbn07XG5cbi8vIEFkZCBldmVudExpc3RlbmVycy5cbnZhciB0b2dnbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWZhcS1pdGVtLXRvZ2dsZScpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIGl0ZW0gPSB0b2dnbGVzW2ldO1xuXG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVUb2dnbGUpO1xufVxuIiwiKGZ1bmN0aW9uKCkge1xuICBjb25zdCBoYW5kbGVUb2dnbGUgPSAoZXZlbnQpID0+IHtcbiAgICB2YXIgc2lkZWJhcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2lkZWJhcicpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWRlYmFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNpZGViYXIgPSBzaWRlYmFyc1tpXTtcblxuICAgICAgc2lkZWJhci5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEFkZCBldmVudExpc3RlbmVycy5cbiAgdmFyIHRvZ2dsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc2lkZWJhci10b2dnbGUnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IHRvZ2dsZXNbaV07XG5cbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlVG9nZ2xlKTtcbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gaGFuZGxlVG9nZ2xlKGV2ZW50KSB7XG4gICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gdGhpcztcbiAgICB2YXIgd3JhcHBlciA9IGNsaWNrZWRFbGVtZW50LmNsb3Nlc3QoJy50YWJiYScpO1xuICAgIHZhciB0b2dnbGVzID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFiYmEtdG9nZ2xlJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0b2dnbGUgPSB0b2dnbGVzW2ldO1xuICAgICAgdmFyIHRvZ2dsZVdyYXBwZXIgPSB0b2dnbGUuY2xvc2VzdCgnLnRhYmJhJyk7XG4gICAgICB2YXIgbm9kZUlzU2FtZSA9IHRvZ2dsZS5pc1NhbWVOb2RlKGNsaWNrZWRFbGVtZW50KTtcbiAgICAgIHZhciB3cmFwcGVySXNTYW1lID0gdG9nZ2xlV3JhcHBlci5pc1NhbWVOb2RlKHdyYXBwZXIpO1xuXG4gICAgICBpZiAobm9kZUlzU2FtZSAmJiB3cmFwcGVySXNTYW1lKSB7XG4gICAgICAgIHRvZ2dsZUVsZW1lbnQod3JhcHBlciwgaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlRWxlbWVudCh3cmFwcGVyLCBpbmRleCkge1xuICAgIHZhciB0b2dnbGVzID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFiYmEtdG9nZ2xlJyk7XG4gICAgdmFyIGNvbnRlbnRJdGVtcyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvckFsbCgnLnRhYmJhLWl0ZW0nKTtcblxuICAgIC8vIFNob3cgY29udGVudCBpdGVtXG4gICAgdmFyIGNvbnRlbnRJdGVtSW5kZXggPSAwO1xuICAgIGZvciAodmFyIGNvbnRlbnRJdGVtSW50ID0gMDsgY29udGVudEl0ZW1JbnQgPCBjb250ZW50SXRlbXMubGVuZ3RoOyBjb250ZW50SXRlbUludCsrKSB7XG4gICAgICB2YXIgY29udGVudEl0ZW0gPSBjb250ZW50SXRlbXNbY29udGVudEl0ZW1JbnRdO1xuICAgICAgdmFyIGNvbnRlbnRJdGVtV3JhcHBlciA9IGNvbnRlbnRJdGVtLmNsb3Nlc3QoJy50YWJiYScpO1xuICAgICAgdmFyIGNvbnRlbnRXcmFwcGVySXNTYW1lID0gY29udGVudEl0ZW1XcmFwcGVyLmlzU2FtZU5vZGUod3JhcHBlcik7XG5cbiAgICAgIGlmIChjb250ZW50V3JhcHBlcklzU2FtZSkge1xuXG4gICAgICAgIGlmIChpbmRleCA9PT0gY29udGVudEl0ZW1JbmRleCkge1xuICAgICAgICAgIGNvbnRlbnRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRlbnRJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGVudEl0ZW1JbmRleCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCBhY3RpdmUgY2xhc3Mgb24gdG9nZ2xlLlxuICAgIHZhciB0b2dnbGVJbmRleCA9IDA7XG4gICAgZm9yICh2YXIgdG9nZ2xlSW50ID0gMDsgdG9nZ2xlSW50IDwgdG9nZ2xlcy5sZW5ndGg7IHRvZ2dsZUludCsrKSB7XG4gICAgICB2YXIgdG9nZ2xlID0gdG9nZ2xlc1t0b2dnbGVJbnRdO1xuICAgICAgdmFyIHRvZ2dsZVdyYXBwZXIgPSB0b2dnbGUuY2xvc2VzdCgnLnRhYmJhJyk7XG4gICAgICB2YXIgdG9nZ2xlV3JhcHBlcklzU2FtZSA9IHRvZ2dsZVdyYXBwZXIuaXNTYW1lTm9kZSh3cmFwcGVyKTtcblxuICAgICAgaWYgKHRvZ2dsZVdyYXBwZXJJc1NhbWUpIHtcblxuICAgICAgICBpZiAoaW5kZXggPT09IHRvZ2dsZUluZGV4KSB7XG4gICAgICAgICAgdG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvZ2dsZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUluZGV4Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIGV2ZW50TGlzdGVuZXJzLlxuICB2YXIgd3JhcHBlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiYmEnKTtcblxuICBmb3IgKHZhciB3cmFwcGVySW50ID0gMDsgd3JhcHBlckludCA8IHdyYXBwZXJzLmxlbmd0aDsgd3JhcHBlckludCsrKSB7XG4gICAgdmFyIHdyYXBwZXIgPSB3cmFwcGVyc1t3cmFwcGVySW50XTtcbiAgICB2YXIgdG9nZ2xlcyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhYmJhLXRvZ2dsZScpO1xuXG4gICAgLy8gU2hvdyB0aGUgZmlyc3QgZWxlbWVudCB1cG9uIHBhZ2UgbG9hZC5cbiAgICB0b2dnbGVFbGVtZW50KHdyYXBwZXIsIDApO1xuXG4gICAgLy8gUnVuIHRocm91Z2ggdG9nZ2xlcy5cbiAgICBmb3IgKHZhciB0b2dnbGVJbnQgPSAwOyB0b2dnbGVJbnQgPCB0b2dnbGVzLmxlbmd0aDsgdG9nZ2xlSW50KyspIHtcbiAgICAgIHZhciB0b2dnbGUgPSB0b2dnbGVzW3RvZ2dsZUludF07XG5cbiAgICAgIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZVRvZ2dsZSk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwialF1ZXJ5KGZ1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBGbGV4eSBoZWFkZXJcbiAgLy8gZmxleHlfaGVhZGVyLmluaXQoKTtcblxuICAvLyBTaWRyXG4gICQoJy5zbGlua3ktbWVudScpXG4gICAgLmZpbmQoJ3VsLCBsaSwgYScpXG4gICAgLnJlbW92ZUNsYXNzKCk7XG5cbiAgLy8gRW5hYmxlIHRvb2x0aXBzLlxuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuXG4gIC8vIFNob3djYXNlcy5cbiAgdmFyIHNsaWRlciA9IHRucyh7XG4gICAgY29udGFpbmVyOiAnLnNob3djYXNlcycsXG4gICAgaXRlbXM6IDEsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOiB0cnVlXG4gIH0pO1xuXG4gIHZhciBuZXh0U2hvd2Nhc2VCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNob3ctbmV4dC1zaG93Y2FzZScpO1xuICBmb3IodmFyIG5leHRJbnQgPSAwOyBuZXh0SW50IDwgbmV4dFNob3djYXNlQnV0dG9ucy5sZW5ndGg7IG5leHRJbnQrKykge1xuICAgIHZhciBuZXh0U2hvd2Nhc2UgPSBuZXh0U2hvd2Nhc2VCdXR0b25zW25leHRJbnRdO1xuXG4gICAgbmV4dFNob3djYXNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBzbGlkZXIuZ29UbygnbmV4dCcpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHByZXZpb3VzU2hvd2Nhc2VCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNob3ctcHJldmlvdXMtc2hvd2Nhc2UnKTtcbiAgZm9yKHZhciBwcmV2SW50ID0gMDsgcHJldkludCA8IHByZXZpb3VzU2hvd2Nhc2VCdXR0b25zLmxlbmd0aDsgcHJldkludCsrKSB7XG4gICAgdmFyIHByZXZpb3VzU2hvd2Nhc2UgPSBwcmV2aW91c1Nob3djYXNlQnV0dG9uc1twcmV2SW50XTtcblxuICAgIHByZXZpb3VzU2hvd2Nhc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHNsaWRlci5nb1RvKCdwcmV2Jyk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
