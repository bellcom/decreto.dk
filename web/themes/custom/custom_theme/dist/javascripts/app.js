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

// |--------------------------------------------------------------------------
// | Flexy navigation
// |--------------------------------------------------------------------------
// |
// | This jQuery script is written by
// |
// | Morten Nissen
// | hjemmesidekongen.dk
// |

var flexy_navigation = function ($) {
    'use strict';

    var pub = {},
        layout_classes = {
        'navigation': '.flexy-navigation',
        'obfuscator': '.flexy-navigation__obfuscator',
        'dropdown': '.flexy-navigation__item--dropdown',
        'dropdown_megamenu': '.flexy-navigation__item__dropdown-megamenu',

        'is_upgraded': 'is-upgraded',
        'navigation_has_megamenu': 'has-megamenu',
        'dropdown_has_megamenu': 'flexy-navigation__item--dropdown-with-megamenu'
    };

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

        // Upgrade
        upgrade();
    }

    /**
     * Register event handlers
     */
    function registerEventHandlers() {}

    /**
     * Upgrade elements.
     * Add classes to elements, based upon attached classes.
     */
    function upgrade() {
        var $navigations = $(layout_classes.navigation);

        // Navigations
        if ($navigations.length > 0) {
            $navigations.each(function (index, element) {
                var $navigation = $(this),
                    $megamenus = $navigation.find(layout_classes.dropdown_megamenu),
                    $dropdown_megamenu = $navigation.find(layout_classes.dropdown_has_megamenu);

                // Has already been upgraded
                if ($navigation.hasClass(layout_classes.is_upgraded)) {
                    return;
                }

                // Has megamenu
                if ($megamenus.length > 0) {
                    $navigation.addClass(layout_classes.navigation_has_megamenu);

                    // Run through all megamenus
                    $megamenus.each(function (index, element) {
                        var $megamenu = $(this),
                            has_obfuscator = $('html').hasClass('has-obfuscator') ? true : false;

                        $megamenu.parents(layout_classes.dropdown).addClass(layout_classes.dropdown_has_megamenu).hover(function () {

                            if (has_obfuscator) {
                                obfuscator.show();
                            }
                        }, function () {

                            if (has_obfuscator) {
                                obfuscator.hide();
                            }
                        });
                    });
                }

                // Is upgraded
                $navigation.addClass(layout_classes.is_upgraded);
            });
        }
    }

    return pub;
}(jQuery);
"use strict";

/*! sidr - v2.2.1 - 2016-02-17
 * http://www.berriart.com/sidr/
 * Copyright (c) 2013-2016 Alberto Varela; Licensed MIT */

(function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var sidrStatus = {
    moving: false,
    opened: false
  };

  var helper = {
    // Check for valids urls
    // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url

    isUrl: function isUrl(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

      if (pattern.test(str)) {
        return true;
      } else {
        return false;
      }
    },

    // Add sidr prefixes
    addPrefixes: function addPrefixes($element) {
      this.addPrefix($element, 'id');
      this.addPrefix($element, 'class');
      $element.removeAttr('style');
    },
    addPrefix: function addPrefix($element, attribute) {
      var toReplace = $element.attr(attribute);

      if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
        $element.attr(attribute, toReplace.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-' + attribute + '-$1'));
      }
    },

    // Check if transitions is supported
    transitions: function () {
      var body = document.body || document.documentElement,
          style = body.style,
          supported = false,
          property = 'transition';

      if (property in style) {
        supported = true;
      } else {
        (function () {
          var prefixes = ['moz', 'webkit', 'o', 'ms'],
              prefix = undefined,
              i = undefined;

          property = property.charAt(0).toUpperCase() + property.substr(1);
          supported = function () {
            for (i = 0; i < prefixes.length; i++) {
              prefix = prefixes[i];
              if (prefix + property in style) {
                return true;
              }
            }

            return false;
          }();
          property = supported ? '-' + prefix.toLowerCase() + '-' + property.toLowerCase() : null;
        })();
      }

      return {
        supported: supported,
        property: property
      };
    }()
  };

  var $$2 = jQuery;

  var bodyAnimationClass = 'sidr-animating';
  var openAction = 'open';
  var closeAction = 'close';
  var transitionEndEvent = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
  var Menu = function () {
    function Menu(name) {
      babelHelpers.classCallCheck(this, Menu);

      this.name = name;
      this.item = $$2('#' + name);
      this.openClass = name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open';
      this.menuWidth = this.item.outerWidth(true);
      this.speed = this.item.data('speed');
      this.side = this.item.data('side');
      this.displace = this.item.data('displace');
      this.timing = this.item.data('timing');
      this.method = this.item.data('method');
      this.onOpenCallback = this.item.data('onOpen');
      this.onCloseCallback = this.item.data('onClose');
      this.onOpenEndCallback = this.item.data('onOpenEnd');
      this.onCloseEndCallback = this.item.data('onCloseEnd');
      this.body = $$2(this.item.data('body'));
    }

    babelHelpers.createClass(Menu, [{
      key: 'getAnimation',
      value: function getAnimation(action, element) {
        var animation = {},
            prop = this.side;

        if (action === 'open' && element === 'body') {
          animation[prop] = this.menuWidth + 'px';
        } else if (action === 'close' && element === 'menu') {
          animation[prop] = '-' + this.menuWidth + 'px';
        } else {
          animation[prop] = 0;
        }

        return animation;
      }
    }, {
      key: 'prepareBody',
      value: function prepareBody(action) {
        var prop = action === 'open' ? 'hidden' : '';

        // Prepare page if container is body
        if (this.body.is('body')) {
          var $html = $$2('html'),
              scrollTop = $html.scrollTop();

          $html.css('overflow-x', prop).scrollTop(scrollTop);
        }
      }
    }, {
      key: 'openBody',
      value: function openBody() {
        if (this.displace) {
          var transitions = helper.transitions,
              $body = this.body;

          if (transitions.supported) {
            $body.css(transitions.property, this.side + ' ' + this.speed / 1000 + 's ' + this.timing).css(this.side, 0).css({
              width: $body.width(),
              position: 'absolute'
            });
            $body.css(this.side, this.menuWidth + 'px');
          } else {
            var bodyAnimation = this.getAnimation(openAction, 'body');

            $body.css({
              width: $body.width(),
              position: 'absolute'
            }).animate(bodyAnimation, {
              queue: false,
              duration: this.speed
            });
          }
        }
      }
    }, {
      key: 'onCloseBody',
      value: function onCloseBody() {
        var transitions = helper.transitions,
            resetStyles = {
          width: '',
          position: '',
          right: '',
          left: ''
        };

        if (transitions.supported) {
          resetStyles[transitions.property] = '';
        }

        this.body.css(resetStyles).unbind(transitionEndEvent);
      }
    }, {
      key: 'closeBody',
      value: function closeBody() {
        var _this = this;

        if (this.displace) {
          if (helper.transitions.supported) {
            this.body.css(this.side, 0).one(transitionEndEvent, function () {
              _this.onCloseBody();
            });
          } else {
            var bodyAnimation = this.getAnimation(closeAction, 'body');

            this.body.animate(bodyAnimation, {
              queue: false,
              duration: this.speed,
              complete: function complete() {
                _this.onCloseBody();
              }
            });
          }
        }
      }
    }, {
      key: 'moveBody',
      value: function moveBody(action) {
        if (action === openAction) {
          this.openBody();
        } else {
          this.closeBody();
        }
      }
    }, {
      key: 'onOpenMenu',
      value: function onOpenMenu(callback) {
        var name = this.name;

        sidrStatus.moving = false;
        sidrStatus.opened = name;

        this.item.unbind(transitionEndEvent);

        this.body.removeClass(bodyAnimationClass).addClass(this.openClass);

        this.onOpenEndCallback();

        if (typeof callback === 'function') {
          callback(name);
        }
      }
    }, {
      key: 'openMenu',
      value: function openMenu(callback) {
        var _this2 = this;

        var $item = this.item;

        if (helper.transitions.supported) {
          $item.css(this.side, 0).one(transitionEndEvent, function () {
            _this2.onOpenMenu(callback);
          });
        } else {
          var menuAnimation = this.getAnimation(openAction, 'menu');

          $item.css('display', 'block').animate(menuAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this2.onOpenMenu(callback);
            }
          });
        }
      }
    }, {
      key: 'onCloseMenu',
      value: function onCloseMenu(callback) {
        this.item.css({
          left: '',
          right: ''
        }).unbind(transitionEndEvent);
        $$2('html').css('overflow-x', '');

        sidrStatus.moving = false;
        sidrStatus.opened = false;

        this.body.removeClass(bodyAnimationClass).removeClass(this.openClass);

        this.onCloseEndCallback();

        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }
      }
    }, {
      key: 'closeMenu',
      value: function closeMenu(callback) {
        var _this3 = this;

        var item = this.item;

        if (helper.transitions.supported) {
          item.css(this.side, '').one(transitionEndEvent, function () {
            _this3.onCloseMenu(callback);
          });
        } else {
          var menuAnimation = this.getAnimation(closeAction, 'menu');

          item.animate(menuAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this3.onCloseMenu();
            }
          });
        }
      }
    }, {
      key: 'moveMenu',
      value: function moveMenu(action, callback) {
        this.body.addClass(bodyAnimationClass);

        if (action === openAction) {
          this.openMenu(callback);
        } else {
          this.closeMenu(callback);
        }
      }
    }, {
      key: 'move',
      value: function move(action, callback) {
        // Lock sidr
        sidrStatus.moving = true;

        this.prepareBody(action);
        this.moveBody(action);
        this.moveMenu(action, callback);
      }
    }, {
      key: 'open',
      value: function open(callback) {
        var _this4 = this;

        // Check if is already opened or moving
        if (sidrStatus.opened === this.name || sidrStatus.moving) {
          return;
        }

        // If another menu opened close first
        if (sidrStatus.opened !== false) {
          var alreadyOpenedMenu = new Menu(sidrStatus.opened);

          alreadyOpenedMenu.close(function () {
            _this4.open(callback);
          });

          return;
        }

        this.move('open', callback);

        // onOpen callback
        this.onOpenCallback();
      }
    }, {
      key: 'close',
      value: function close(callback) {
        // Check if is already closed or moving
        if (sidrStatus.opened !== this.name || sidrStatus.moving) {
          return;
        }

        this.move('close', callback);

        // onClose callback
        this.onCloseCallback();
      }
    }, {
      key: 'toggle',
      value: function toggle(callback) {
        if (sidrStatus.opened === this.name) {
          this.close(callback);
        } else {
          this.open(callback);
        }
      }
    }]);
    return Menu;
  }();

  var $$1 = jQuery;

  function execute(action, name, callback) {
    var sidr = new Menu(name);

    switch (action) {
      case 'open':
        sidr.open(callback);
        break;
      case 'close':
        sidr.close(callback);
        break;
      case 'toggle':
        sidr.toggle(callback);
        break;
      default:
        $$1.error('Method ' + action + ' does not exist on jQuery.sidr');
        break;
    }
  }

  var i;
  var $ = jQuery;
  var publicMethods = ['open', 'close', 'toggle'];
  var methodName;
  var methods = {};
  var getMethod = function getMethod(methodName) {
    return function (name, callback) {
      // Check arguments
      if (typeof name === 'function') {
        callback = name;
        name = 'sidr';
      } else if (!name) {
        name = 'sidr';
      }

      execute(methodName, name, callback);
    };
  };
  for (i = 0; i < publicMethods.length; i++) {
    methodName = publicMethods[i];
    methods[methodName] = getMethod(methodName);
  }

  function sidr(method) {
    if (method === 'status') {
      return sidrStatus;
    } else if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'function' || typeof method === 'string' || !method) {
      return methods.toggle.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sidr');
    }
  }

  var $$3 = jQuery;

  function fillContent($sideMenu, settings) {
    // The menu content
    if (typeof settings.source === 'function') {
      var newContent = settings.source(name);

      $sideMenu.html(newContent);
    } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
      $$3.get(settings.source, function (data) {
        $sideMenu.html(data);
      });
    } else if (typeof settings.source === 'string') {
      var htmlContent = '',
          selectors = settings.source.split(',');

      $$3.each(selectors, function (index, element) {
        htmlContent += '<div class="sidr-inner">' + $$3(element).html() + '</div>';
      });

      // Renaming ids and classes
      if (settings.renaming) {
        var $htmlContent = $$3('<div />').html(htmlContent);

        $htmlContent.find('*').each(function (index, element) {
          var $element = $$3(element);

          helper.addPrefixes($element);
        });
        htmlContent = $htmlContent.html();
      }

      $sideMenu.html(htmlContent);
    } else if (settings.source !== null) {
      $$3.error('Invalid Sidr Source');
    }

    return $sideMenu;
  }

  function fnSidr(options) {
    var transitions = helper.transitions,
        settings = $$3.extend({
      name: 'sidr', // Name for the 'sidr'
      speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side: 'left', // Accepts 'left' or 'right'
      source: null, // Override the source of the content.
      renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
      body: 'body', // Page container selector,
      displace: true, // Displace the body content or not
      timing: 'ease', // Timing function for CSS transitions
      method: 'toggle', // The method to call when element is clicked
      bind: 'touchstart click', // The event(s) to trigger the menu
      onOpen: function onOpen() {},
      // Callback when sidr start opening
      onClose: function onClose() {},
      // Callback when sidr start closing
      onOpenEnd: function onOpenEnd() {},
      // Callback when sidr end opening
      onCloseEnd: function onCloseEnd() {} // Callback when sidr end closing

    }, options),
        name = settings.name,
        $sideMenu = $$3('#' + name);

    // If the side menu do not exist create it
    if ($sideMenu.length === 0) {
      $sideMenu = $$3('<div />').attr('id', name).appendTo($$3('body'));
    }

    // Add transition to menu if are supported
    if (transitions.supported) {
      $sideMenu.css(transitions.property, settings.side + ' ' + settings.speed / 1000 + 's ' + settings.timing);
    }

    // Adding styles and options
    $sideMenu.addClass('sidr').addClass(settings.side).data({
      speed: settings.speed,
      side: settings.side,
      body: settings.body,
      displace: settings.displace,
      timing: settings.timing,
      method: settings.method,
      onOpen: settings.onOpen,
      onClose: settings.onClose,
      onOpenEnd: settings.onOpenEnd,
      onCloseEnd: settings.onCloseEnd
    });

    $sideMenu = fillContent($sideMenu, settings);

    return this.each(function () {
      var $this = $$3(this),
          data = $this.data('sidr'),
          flag = false;

      // If the plugin hasn't been initialized yet
      if (!data) {
        sidrStatus.moving = false;
        sidrStatus.opened = false;

        $this.data('sidr', name);

        $this.bind(settings.bind, function (event) {
          event.preventDefault();

          if (!flag) {
            flag = true;
            sidr(settings.method, name);

            setTimeout(function () {
              flag = false;
            }, 100);
          }
        });
      }
    });
  }

  jQuery.sidr = sidr;
  jQuery.fn.sidr = fnSidr;
})();
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
'use strict';

(function () {
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
})();
'use strict';

(function () {
  var fakeSubmit = function fakeSubmit(event) {
    event.preventDefault();

    var target = event.target;
    var parentForm = target.closest('form');

    parentForm.submit();
  };

  var highlight = function highlight(event) {
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
  var radios = document.querySelectorAll('.paragraph--type--package-chooser input[name="decreto_pakke_du_vaelger"]');

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
'use strict';

jQuery(function ($) {
  'use strict';

  // Flexy header

  flexy_header.init();

  // Sidr
  $('.slinky-menu').find('ul, li, a').removeClass();

  $('.sidr-toggle--right').sidr({
    name: 'sidr-main',
    side: 'right',
    renaming: false,
    body: '.layout__wrapper',
    source: '.sidr-source-provider'
  });

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();

  // Testimonials.
  tns({
    container: '.testimonials .view-content',
    center: true,
    items: 2,
    autoplay: true,
    autoplayHoverPause: true
  });

  // Explainers.
  tns({
    container: '.explainers .view-content',
    center: true,
    items: 1,
    autoplay: true,
    autoplayHoverPause: true
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbnktc2xpZGVyLmpzIiwiYm9vdHN0cmFwLmpzIiwiZmxleHktaGVhZGVyLmpzIiwiZmxleHktbmF2aWdhdGlvbi5qcyIsImpxdWVyeS5zaWRyLmpzIiwianF1ZXJ5LnNsaW5reS5qcyIsInBhY2UuanMiLCJmYXEtaXRlbXMuanMiLCJwYWNrYWdlLWNob29zZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOlsidG5zIiwiT2JqZWN0Iiwia2V5cyIsIm9iamVjdCIsIm5hbWUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJwdXNoIiwiRWxlbWVudCIsInJlbW92ZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIndpbiIsIndpbmRvdyIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2IiLCJzZXRUaW1lb3V0Iiwid2luJDEiLCJjYWYiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaWQiLCJjbGVhclRpbWVvdXQiLCJleHRlbmQiLCJvYmoiLCJjb3B5IiwidGFyZ2V0IiwiYXJndW1lbnRzIiwiaSIsImxlbmd0aCIsInVuZGVmaW5lZCIsImNoZWNrU3RvcmFnZVZhbHVlIiwidmFsdWUiLCJpbmRleE9mIiwiSlNPTiIsInBhcnNlIiwic2V0TG9jYWxTdG9yYWdlIiwic3RvcmFnZSIsImtleSIsImFjY2VzcyIsInNldEl0ZW0iLCJlIiwiZ2V0U2xpZGVJZCIsInRuc0lkIiwiZ2V0Qm9keSIsImRvYyIsImRvY3VtZW50IiwiYm9keSIsImNyZWF0ZUVsZW1lbnQiLCJmYWtlIiwiZG9jRWxlbWVudCIsImRvY3VtZW50RWxlbWVudCIsInNldEZha2VCb2R5IiwiZG9jT3ZlcmZsb3ciLCJzdHlsZSIsIm92ZXJmbG93IiwiYmFja2dyb3VuZCIsImFwcGVuZENoaWxkIiwicmVzZXRGYWtlQm9keSIsIm9mZnNldEhlaWdodCIsImNhbGMiLCJkaXYiLCJyZXN1bHQiLCJzdHIiLCJ2YWxzIiwidmFsIiwid2lkdGgiLCJvZmZzZXRXaWR0aCIsInJlcGxhY2UiLCJwZXJjZW50YWdlTGF5b3V0Iiwid3JhcHBlciIsIm91dGVyIiwiY291bnQiLCJwZXJQYWdlIiwic3VwcG9ydGVkIiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiTWF0aCIsImFicyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJjaGlsZHJlbiIsIm1lZGlhcXVlcnlTdXBwb3J0IiwicnVsZSIsInBvc2l0aW9uIiwidHlwZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwiY3JlYXRlU3R5bGVTaGVldCIsIm1lZGlhIiwic2V0QXR0cmlidXRlIiwicXVlcnlTZWxlY3RvciIsInNoZWV0IiwiYWRkQ1NTUnVsZSIsInNlbGVjdG9yIiwicnVsZXMiLCJpbmRleCIsImluc2VydFJ1bGUiLCJhZGRSdWxlIiwicmVtb3ZlQ1NTUnVsZSIsImRlbGV0ZVJ1bGUiLCJyZW1vdmVSdWxlIiwiZ2V0Q3NzUnVsZXNMZW5ndGgiLCJjc3NSdWxlcyIsInRvRGVncmVlIiwieSIsIngiLCJhdGFuMiIsIlBJIiwiZ2V0VG91Y2hEaXJlY3Rpb24iLCJhbmdsZSIsInJhbmdlIiwiZGlyZWN0aW9uIiwiZ2FwIiwiZm9yRWFjaCIsImFyciIsImNhbGxiYWNrIiwic2NvcGUiLCJsIiwiY2xhc3NMaXN0U3VwcG9ydCIsImhhc0NsYXNzIiwiZWwiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZENsYXNzIiwiYWRkIiwicmVtb3ZlQ2xhc3MiLCJoYXNBdHRyIiwiYXR0ciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJpc05vZGVMaXN0IiwiaXRlbSIsInNldEF0dHJzIiwiZWxzIiwiYXR0cnMiLCJBcnJheSIsInRvU3RyaW5nIiwicmVtb3ZlQXR0cnMiLCJhdHRyTGVuZ3RoIiwiaiIsInJlbW92ZUF0dHJpYnV0ZSIsImFycmF5RnJvbU5vZGVMaXN0IiwibmwiLCJoaWRlRWxlbWVudCIsImZvcmNlSGlkZSIsImRpc3BsYXkiLCJzaG93RWxlbWVudCIsImlzVmlzaWJsZSIsIndoaWNoUHJvcGVydHkiLCJwcm9wcyIsIlByb3BzIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJwcmVmaXhlcyIsInByZWZpeCIsImxlbiIsInByb3AiLCJoYXMzRFRyYW5zZm9ybXMiLCJ0ZiIsImhhczNkIiwiY3NzVEYiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiaW5zZXJ0QmVmb3JlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImdldEVuZFByb3BlcnR5IiwicHJvcEluIiwicHJvcE91dCIsImVuZFByb3AiLCJ0ZXN0Iiwic3VwcG9ydHNQYXNzaXZlIiwib3B0cyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmVPcHRpb24iLCJwYXNzaXZlIiwiYWRkRXZlbnRzIiwicHJldmVudFNjcm9sbGluZyIsIm9wdGlvbiIsInJlbW92ZUV2ZW50cyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJ0b3BpY3MiLCJvbiIsImV2ZW50TmFtZSIsImZuIiwib2ZmIiwic3BsaWNlIiwiZW1pdCIsImRhdGEiLCJqc1RyYW5zZm9ybSIsImVsZW1lbnQiLCJwb3N0Zml4IiwidG8iLCJkdXJhdGlvbiIsInRpY2siLCJtaW4iLCJ1bml0IiwiZnJvbSIsIk51bWJlciIsInBvc2l0aW9uVGljayIsInJ1bm5pbmciLCJtb3ZlRWxlbWVudCIsIm9wdGlvbnMiLCJjb250YWluZXIiLCJtb2RlIiwiYXhpcyIsIml0ZW1zIiwiZ3V0dGVyIiwiZWRnZVBhZGRpbmciLCJmaXhlZFdpZHRoIiwiYXV0b1dpZHRoIiwidmlld3BvcnRNYXgiLCJzbGlkZUJ5IiwiY2VudGVyIiwiY29udHJvbHMiLCJjb250cm9sc1Bvc2l0aW9uIiwiY29udHJvbHNUZXh0IiwiY29udHJvbHNDb250YWluZXIiLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsIm5hdiIsIm5hdlBvc2l0aW9uIiwibmF2Q29udGFpbmVyIiwibmF2QXNUaHVtYm5haWxzIiwiYXJyb3dLZXlzIiwic3BlZWQiLCJhdXRvcGxheSIsImF1dG9wbGF5UG9zaXRpb24iLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheURpcmVjdGlvbiIsImF1dG9wbGF5VGV4dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsImF1dG9wbGF5QnV0dG9uIiwiYXV0b3BsYXlCdXR0b25PdXRwdXQiLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5IiwiYW5pbWF0ZUluIiwiYW5pbWF0ZU91dCIsImFuaW1hdGVOb3JtYWwiLCJhbmltYXRlRGVsYXkiLCJsb29wIiwicmV3aW5kIiwiYXV0b0hlaWdodCIsInJlc3BvbnNpdmUiLCJsYXp5bG9hZCIsImxhenlsb2FkU2VsZWN0b3IiLCJ0b3VjaCIsIm1vdXNlRHJhZyIsInN3aXBlQW5nbGUiLCJuZXN0ZWQiLCJwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmciLCJwcmV2ZW50U2Nyb2xsT25Ub3VjaCIsImZyZWV6YWJsZSIsIm9uSW5pdCIsInVzZUxvY2FsU3RvcmFnZSIsIktFWVMiLCJFTlRFUiIsIlNQQUNFIiwiTEVGVCIsIlJJR0hUIiwidG5zU3RvcmFnZSIsImxvY2FsU3RvcmFnZUFjY2VzcyIsImJyb3dzZXJJbmZvIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidWlkIiwiRGF0ZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiQ0FMQyIsIlBFUkNFTlRBR0VMQVlPVVQiLCJDU1NNUSIsIlRSQU5TRk9STSIsIkhBUzNEVFJBTlNGT1JNUyIsIlRSQU5TSVRJT05EVVJBVElPTiIsIlRSQU5TSVRJT05ERUxBWSIsIkFOSU1BVElPTkRVUkFUSU9OIiwiQU5JTUFUSU9OREVMQVkiLCJUUkFOU0lUSU9ORU5EIiwiQU5JTUFUSU9ORU5EIiwic3VwcG9ydENvbnNvbGVXYXJuIiwiY29uc29sZSIsIndhcm4iLCJ0bnNMaXN0Iiwib3B0aW9uc0VsZW1lbnRzIiwibm9kZU5hbWUiLCJjYXJvdXNlbCIsInJlc3BvbnNpdmVUZW0iLCJ1cGRhdGVPcHRpb25zIiwiaG9yaXpvbnRhbCIsIm91dGVyV3JhcHBlciIsImlubmVyV3JhcHBlciIsIm1pZGRsZVdyYXBwZXIiLCJjb250YWluZXJQYXJlbnQiLCJjb250YWluZXJIVE1MIiwib3V0ZXJIVE1MIiwic2xpZGVJdGVtcyIsInNsaWRlQ291bnQiLCJicmVha3BvaW50Wm9uZSIsIndpbmRvd1dpZHRoIiwiZ2V0V2luZG93V2lkdGgiLCJpc09uIiwic2V0QnJlYWtwb2ludFpvbmUiLCJnZXRPcHRpb24iLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0V2lkdGgiLCJmbG9vciIsImZpeGVkV2lkdGhWaWV3cG9ydFdpZHRoIiwic2xpZGVQb3NpdGlvbnMiLCJzbGlkZUl0ZW1zT3V0IiwiY2xvbmVDb3VudCIsImdldENsb25lQ291bnRGb3JMb29wIiwic2xpZGVDb3VudE5ldyIsImhhc1JpZ2h0RGVhZFpvbmUiLCJyaWdodEJvdW5kYXJ5IiwiZ2V0UmlnaHRCb3VuZGFyeSIsInVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtIiwidHJhbnNmb3JtQXR0ciIsInRyYW5zZm9ybVByZWZpeCIsInRyYW5zZm9ybVBvc3RmaXgiLCJnZXRJbmRleE1heCIsImNlaWwiLCJtYXgiLCJnZXRTdGFydEluZGV4IiwiaW5kZXhDYWNoZWQiLCJkaXNwbGF5SW5kZXgiLCJnZXRDdXJyZW50U2xpZGUiLCJpbmRleE1pbiIsImluZGV4TWF4IiwicmVzaXplVGltZXIiLCJtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQiLCJldmVudHMiLCJuZXdDb250YWluZXJDbGFzc2VzIiwic2xpZGVJZCIsImRpc2FibGUiLCJkaXNhYmxlZCIsImZyZWV6ZSIsImdldEZyZWV6ZSIsImZyb3plbiIsImNvbnRyb2xzRXZlbnRzIiwib25Db250cm9sc0NsaWNrIiwib25Db250cm9sc0tleWRvd24iLCJuYXZFdmVudHMiLCJvbk5hdkNsaWNrIiwib25OYXZLZXlkb3duIiwiaG92ZXJFdmVudHMiLCJtb3VzZW92ZXJQYXVzZSIsIm1vdXNlb3V0UmVzdGFydCIsInZpc2liaWxpdHlFdmVudCIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsImRvY21lbnRLZXlkb3duRXZlbnQiLCJvbkRvY3VtZW50S2V5ZG93biIsInRvdWNoRXZlbnRzIiwib25QYW5TdGFydCIsIm9uUGFuTW92ZSIsIm9uUGFuRW5kIiwiZHJhZ0V2ZW50cyIsImhhc0NvbnRyb2xzIiwiaGFzT3B0aW9uIiwiaGFzTmF2IiwiaGFzQXV0b3BsYXkiLCJoYXNUb3VjaCIsImhhc01vdXNlRHJhZyIsInNsaWRlQWN0aXZlQ2xhc3MiLCJpbWdDb21wbGV0ZUNsYXNzIiwiaW1nRXZlbnRzIiwib25JbWdMb2FkZWQiLCJvbkltZ0ZhaWxlZCIsImltZ3NDb21wbGV0ZSIsImxpdmVyZWdpb25DdXJyZW50IiwicHJldmVudFNjcm9sbCIsImNvbnRyb2xzQ29udGFpbmVySFRNTCIsInByZXZCdXR0b25IVE1MIiwibmV4dEJ1dHRvbkhUTUwiLCJwcmV2SXNCdXR0b24iLCJuZXh0SXNCdXR0b24iLCJuYXZDb250YWluZXJIVE1MIiwibmF2SXRlbXMiLCJwYWdlcyIsImdldFBhZ2VzIiwicGFnZXNDYWNoZWQiLCJuYXZDbGlja2VkIiwibmF2Q3VycmVudEluZGV4IiwiZ2V0Q3VycmVudE5hdkluZGV4IiwibmF2Q3VycmVudEluZGV4Q2FjaGVkIiwibmF2QWN0aXZlQ2xhc3MiLCJuYXZTdHIiLCJuYXZTdHJDdXJyZW50IiwiYXV0b3BsYXlCdXR0b25IVE1MIiwiYXV0b3BsYXlIdG1sU3RyaW5ncyIsImF1dG9wbGF5VGltZXIiLCJhbmltYXRpbmciLCJhdXRvcGxheUhvdmVyUGF1c2VkIiwiYXV0b3BsYXlVc2VyUGF1c2VkIiwiYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkIiwiaW5pdFBvc2l0aW9uIiwibGFzdFBvc2l0aW9uIiwidHJhbnNsYXRlSW5pdCIsImRpc1giLCJkaXNZIiwicGFuU3RhcnQiLCJyYWZJbmRleCIsImdldERpc3QiLCJhIiwiYiIsInJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZSIsImluaXRTdHJ1Y3R1cmUiLCJpbml0U2hlZXQiLCJpbml0U2xpZGVyVHJhbnNmb3JtIiwiY29uZGl0aW9uIiwidGVtIiwiaW5kIiwiZ2V0QWJzSW5kZXgiLCJhYnNJbmRleCIsImdldEl0ZW1zTWF4IiwiYnAiLCJhcHBseSIsIml0ZW1zTWF4IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiZ2V0SW5zZXJ0UG9zaXRpb24iLCJwb3MiLCJnZXRDbGllbnRXaWR0aCIsInJlY3QiLCJyaWdodCIsInd3IiwicGFyc2VJbnQiLCJnZXRTbGlkZU1hcmdpbkxlZnQiLCJnZXRJbm5lcldyYXBwZXJTdHlsZXMiLCJlZGdlUGFkZGluZ1RlbSIsImd1dHRlclRlbSIsImZpeGVkV2lkdGhUZW0iLCJzcGVlZFRlbSIsImF1dG9IZWlnaHRCUCIsImd1dHRlclRlbVVuaXQiLCJkaXIiLCJnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZSIsImdldENvbnRhaW5lcldpZHRoIiwiaXRlbXNUZW0iLCJnZXRTbGlkZVdpZHRoU3R5bGUiLCJkaXZpZGVuZCIsImdldFNsaWRlR3V0dGVyU3R5bGUiLCJnZXRDU1NQcmVmaXgiLCJudW0iLCJzdWJzdHJpbmciLCJnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlIiwiY2xhc3NPdXRlciIsImNsYXNzSW5uZXIiLCJoYXNHdXR0ZXIiLCJ3cCIsImZyYWdtZW50QmVmb3JlIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImZyYWdtZW50QWZ0ZXIiLCJjbG9uZUZpcnN0IiwiY2xvbmVOb2RlIiwiZmlyc3RDaGlsZCIsImNsb25lTGFzdCIsImltZ3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW1nIiwic3JjIiwiaW1nTG9hZGVkIiwiaW1nc0xvYWRlZENoZWNrIiwiZ2V0SW1hZ2VBcnJheSIsImluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrIiwiZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQiLCJpbml0VG9vbHMiLCJpbml0RXZlbnRzIiwic3R5bGVzQXBwbGljYXRpb25DaGVjayIsInRvRml4ZWQiLCJpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSIsInNldFNsaWRlUG9zaXRpb25zIiwidXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQiLCJmb250U2l6ZSIsInNsaWRlIiwibWFyZ2luTGVmdCIsInVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uIiwibWlkZGxlV3JhcHBlclN0ciIsImlubmVyV3JhcHBlclN0ciIsImNvbnRhaW5lclN0ciIsInNsaWRlU3RyIiwiaXRlbXNCUCIsImZpeGVkV2lkdGhCUCIsInNwZWVkQlAiLCJlZGdlUGFkZGluZ0JQIiwiZ3V0dGVyQlAiLCJ1cGRhdGVTbGlkZVN0YXR1cyIsImluc2VydEFkamFjZW50SFRNTCIsImdldExpdmVSZWdpb25TdHIiLCJ0eHQiLCJ0b2dnbGVBdXRvcGxheSIsInN0YXJ0QXV0b3BsYXkiLCJpbml0SW5kZXgiLCJuYXZIdG1sIiwiaGlkZGVuU3RyIiwidXBkYXRlTmF2VmlzaWJpbGl0eSIsImlzQnV0dG9uIiwidXBkYXRlQ29udHJvbHNTdGF0dXMiLCJkaXNhYmxlVUkiLCJldmUiLCJvblRyYW5zaXRpb25FbmQiLCJyZXNpemVUYXNrcyIsImluZm8iLCJvblJlc2l6ZSIsImRvQXV0b0hlaWdodCIsImRvTGF6eUxvYWQiLCJkaXNhYmxlU2xpZGVyIiwiZnJlZXplU2xpZGVyIiwiYWRkaXRpb25hbFVwZGF0ZXMiLCJkZXN0cm95Iiwib3duZXJOb2RlIiwiY2xlYXJJbnRlcnZhbCIsImh0bWxMaXN0IiwicHJldkVsIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInBhcmVudEVsIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJnZXRFdmVudCIsImJwQ2hhbmdlZCIsImJyZWFrcG9pbnRab25lVGVtIiwibmVlZENvbnRhaW5lclRyYW5zZm9ybSIsImluZENoYW5nZWQiLCJpdGVtc0NoYW5nZWQiLCJkaXNhYmxlVGVtIiwiZnJlZXplVGVtIiwiYXJyb3dLZXlzVGVtIiwiY29udHJvbHNUZW0iLCJuYXZUZW0iLCJ0b3VjaFRlbSIsIm1vdXNlRHJhZ1RlbSIsImF1dG9wbGF5VGVtIiwiYXV0b3BsYXlIb3ZlclBhdXNlVGVtIiwiYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSIsImluZGV4VGVtIiwiYXV0b0hlaWdodFRlbSIsImNvbnRyb2xzVGV4dFRlbSIsImNlbnRlclRlbSIsImF1dG9wbGF5VGV4dFRlbSIsInVwZGF0ZUluZGV4IiwiZW5hYmxlU2xpZGVyIiwiZG9Db250YWluZXJUcmFuc2Zvcm0iLCJnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSIsInVuZnJlZXplU2xpZGVyIiwic3RvcEF1dG9wbGF5IiwiaGVpZ2h0IiwiaHRtbCIsInVwZGF0ZUxpdmVSZWdpb24iLCJ1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMiLCJhdXRvaGVpZ2h0VGVtIiwidnAiLCJsZWZ0RWRnZSIsInJpZ2h0RWRnZSIsImVuYWJsZVVJIiwibWFyZ2luIiwiY2xhc3NOIiwiZ2V0VmlzaWJsZVNsaWRlUmFuZ2UiLCJzdGFydCIsImVuZCIsInJhbmdlc3RhcnQiLCJyYW5nZWVuZCIsInBhcnNlRmxvYXQiLCJwb2ludCIsImNlbGwiLCJzdG9wUHJvcGFnYXRpb24iLCJzcmNzZXQiLCJnZXRUYXJnZXQiLCJpbWdGYWlsZWQiLCJpbWdDb21wbGV0ZWQiLCJ1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQiLCJ1cGRhdGVOYXZTdGF0dXMiLCJnZXRNYXhTbGlkZUhlaWdodCIsInNsaWRlU3RhcnQiLCJzbGlkZVJhbmdlIiwiaGVpZ2h0cyIsIm1heEhlaWdodCIsImF0dHIyIiwiYmFzZSIsIm5hdlByZXYiLCJuYXZDdXJyZW50IiwiZ2V0TG93ZXJDYXNlTm9kZU5hbWUiLCJpc0FyaWFEaXNhYmxlZCIsImRpc0VuYWJsZUVsZW1lbnQiLCJwcmV2RGlzYWJsZWQiLCJuZXh0RGlzYWJsZWQiLCJkaXNhYmxlUHJldiIsImRpc2FibGVOZXh0IiwicmVzZXREdXJhdGlvbiIsImdldFNsaWRlcldpZHRoIiwiZ2V0Q2VudGVyR2FwIiwiZGVub21pbmF0b3IiLCJhbmltYXRlU2xpZGUiLCJudW1iZXIiLCJjbGFzc091dCIsImNsYXNzSW4iLCJpc091dCIsInRyYW5zZm9ybUNvcmUiLCJyZW5kZXIiLCJzbGlkZXJNb3ZlZCIsInN0clRyYW5zIiwiZXZlbnQiLCJwcm9wZXJ0eU5hbWUiLCJnb1RvIiwidGFyZ2V0SW5kZXgiLCJpbmRleEdhcCIsImlzTmFOIiwiZmFjdG9yIiwicGFzc0V2ZW50T2JqZWN0IiwidGFyZ2V0SW4iLCJuYXZJbmRleCIsInRhcmdldEluZGV4QmFzZSIsInNldEF1dG9wbGF5VGltZXIiLCJzZXRJbnRlcnZhbCIsInN0b3BBdXRvcGxheVRpbWVyIiwidXBkYXRlQXV0b3BsYXlCdXR0b24iLCJhY3Rpb24iLCJwbGF5IiwicGF1c2UiLCJoaWRkZW4iLCJrZXlJbmRleCIsImtleUNvZGUiLCJzZXRGb2N1cyIsImZvY3VzIiwiY3VyRWxlbWVudCIsImFjdGl2ZUVsZW1lbnQiLCJpc1RvdWNoRXZlbnQiLCJjaGFuZ2VkVG91Y2hlcyIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsIiQiLCJjbGllbnRYIiwiY2xpZW50WSIsInBhblVwZGF0ZSIsImVyciIsImRpc3QiLCJwZXJjZW50YWdlWCIsInByZXZlbnRDbGljayIsImluZGV4TW92ZWQiLCJtb3ZlZCIsInJvdWdoIiwidmVyc2lvbiIsImdldEluZm8iLCJ1cGRhdGVTbGlkZXJIZWlnaHQiLCJyZWZyZXNoIiwicmVidWlsZCIsImpRdWVyeSIsIkVycm9yIiwianF1ZXJ5Iiwic3BsaXQiLCJ0cmFuc2l0aW9uRW5kIiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImNhbGxlZCIsIiRlbCIsIm9uZSIsInRyaWdnZXIiLCJzdXBwb3J0Iiwic3BlY2lhbCIsImJzVHJhbnNpdGlvbkVuZCIsImJpbmRUeXBlIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiZGlzbWlzcyIsIkFsZXJ0IiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsIiR0aGlzIiwiJHBhcmVudCIsImZpbmQiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVFbGVtZW50IiwiZGV0YWNoIiwiUGx1Z2luIiwiZWFjaCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiJGVsZW1lbnQiLCJERUZBVUxUUyIsImlzTG9hZGluZyIsImxvYWRpbmdUZXh0Iiwic2V0U3RhdGUiLCJzdGF0ZSIsImQiLCJyZXNldFRleHQiLCJwcm94eSIsInJlbW92ZUF0dHIiLCJ0b2dnbGUiLCJjaGFuZ2VkIiwiJGlucHV0IiwidG9nZ2xlQ2xhc3MiLCJidXR0b24iLCIkYnRuIiwiZmlyc3QiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2VkIiwic2xpZGluZyIsImludGVydmFsIiwiJGFjdGl2ZSIsIiRpdGVtcyIsImtleWJvYXJkIiwia2V5ZG93biIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiZ2V0SXRlbUluZGV4IiwicGFyZW50IiwiZ2V0SXRlbUZvckRpcmVjdGlvbiIsImFjdGl2ZSIsImFjdGl2ZUluZGV4Iiwid2lsbFdyYXAiLCJkZWx0YSIsIml0ZW1JbmRleCIsImVxIiwidGhhdCIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsImpvaW4iLCJjbGlja0hhbmRsZXIiLCJocmVmIiwiJHRhcmdldCIsInNsaWRlSW5kZXgiLCIkY2Fyb3VzZWwiLCJDb2xsYXBzZSIsIiR0cmlnZ2VyIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwiZ2V0VGFyZ2V0RnJvbVRyaWdnZXIiLCJpc09wZW4iLCJjb2xsYXBzZSIsImJhY2tkcm9wIiwiRHJvcGRvd24iLCJjbGVhck1lbnVzIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCIkZGlhbG9nIiwiJGJhY2tkcm9wIiwiaXNTaG93biIsIm9yaWdpbmFsQm9keVBhZCIsInNjcm9sbGJhcldpZHRoIiwiaWdub3JlQmFja2Ryb3BDbGljayIsImZpeGVkQ29udGVudCIsInJlbW90ZSIsImxvYWQiLCJCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiX3JlbGF0ZWRUYXJnZXQiLCJjaGVja1Njcm9sbGJhciIsInNldFNjcm9sbGJhciIsImVzY2FwZSIsInJlc2l6ZSIsImFwcGVuZFRvIiwic2Nyb2xsVG9wIiwiYWRqdXN0RGlhbG9nIiwiZW5mb3JjZUZvY3VzIiwiaGlkZU1vZGFsIiwiaGFzIiwiaGFuZGxlVXBkYXRlIiwicmVzZXRBZGp1c3RtZW50cyIsInJlc2V0U2Nyb2xsYmFyIiwicmVtb3ZlQmFja2Ryb3AiLCJhbmltYXRlIiwiZG9BbmltYXRlIiwiY3VycmVudFRhcmdldCIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImRvY3VtZW50RWxlbWVudFJlY3QiLCJtZWFzdXJlU2Nyb2xsYmFyIiwiYm9keVBhZCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhZGRpbmciLCJyZW1vdmVEYXRhIiwic2Nyb2xsRGl2IiwiYXBwZW5kIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYXJlYSIsImJyIiwiY29sIiwiY29kZSIsImVtIiwiaHIiLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJsaSIsIm9sIiwicCIsInByZSIsInMiLCJzbWFsbCIsInNwYW4iLCJzdWIiLCJzdXAiLCJzdHJvbmciLCJ1IiwidWwiLCJTQUZFX1VSTF9QQVRURVJOIiwiREFUQV9VUkxfUEFUVEVSTiIsImFsbG93ZWRBdHRyaWJ1dGUiLCJhbGxvd2VkQXR0cmlidXRlTGlzdCIsImF0dHJOYW1lIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsIlJlZ0V4cCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJlbE5hbWUiLCJhdHRyaWJ1dGVMaXN0IiwiYXR0cmlidXRlcyIsIndoaXRlbGlzdGVkQXR0cmlidXRlcyIsImNvbmNhdCIsImxlbjIiLCJUb29sdGlwIiwiZW5hYmxlZCIsInRpbWVvdXQiLCJob3ZlclN0YXRlIiwiaW5TdGF0ZSIsImluaXQiLCJhbmltYXRpb24iLCJwbGFjZW1lbnQiLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJzYW5pdGl6ZSIsImdldE9wdGlvbnMiLCIkdmlld3BvcnQiLCJpc0Z1bmN0aW9uIiwiY2xpY2siLCJob3ZlciIsImNvbnN0cnVjdG9yIiwidHJpZ2dlcnMiLCJldmVudEluIiwiZXZlbnRPdXQiLCJlbnRlciIsImxlYXZlIiwiX29wdGlvbnMiLCJmaXhUaXRsZSIsImdldERlZmF1bHRzIiwiZGF0YUF0dHJpYnV0ZXMiLCJkYXRhQXR0ciIsImdldERlbGVnYXRlT3B0aW9ucyIsImRlZmF1bHRzIiwic2VsZiIsInRpcCIsImlzSW5TdGF0ZVRydWUiLCJoYXNDb250ZW50IiwiaW5Eb20iLCJvd25lckRvY3VtZW50IiwiJHRpcCIsInRpcElkIiwiZ2V0VUlEIiwic2V0Q29udGVudCIsImF1dG9Ub2tlbiIsImF1dG9QbGFjZSIsInRvcCIsImdldFBvc2l0aW9uIiwiYWN0dWFsV2lkdGgiLCJhY3R1YWxIZWlnaHQiLCJvcmdQbGFjZW1lbnQiLCJ2aWV3cG9ydERpbSIsImJvdHRvbSIsImNhbGN1bGF0ZWRPZmZzZXQiLCJnZXRDYWxjdWxhdGVkT2Zmc2V0IiwiYXBwbHlQbGFjZW1lbnQiLCJwcmV2SG92ZXJTdGF0ZSIsIm9mZnNldCIsIm1hcmdpblRvcCIsInNldE9mZnNldCIsInVzaW5nIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwidG9nZ2xlRW5hYmxlZCIsInRvb2x0aXAiLCJQb3BvdmVyIiwiY29udGVudCIsImdldENvbnRlbnQiLCJ0eXBlQ29udGVudCIsInBvcG92ZXIiLCJTY3JvbGxTcHkiLCIkc2Nyb2xsRWxlbWVudCIsIm9mZnNldHMiLCJ0YXJnZXRzIiwiYWN0aXZlVGFyZ2V0IiwicHJvY2VzcyIsImdldFNjcm9sbEhlaWdodCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsIm1heFNjcm9sbCIsImFjdGl2YXRlIiwiY2xlYXIiLCJwYXJlbnRzIiwicGFyZW50c1VudGlsIiwic2Nyb2xsc3B5IiwiJHNweSIsIlRhYiIsIiR1bCIsIiRwcmV2aW91cyIsImhpZGVFdmVudCIsInRhYiIsIkFmZml4IiwiY2hlY2tQb3NpdGlvbiIsImNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wIiwiYWZmaXhlZCIsInVucGluIiwicGlubmVkT2Zmc2V0IiwiUkVTRVQiLCJnZXRTdGF0ZSIsIm9mZnNldFRvcCIsIm9mZnNldEJvdHRvbSIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiZmxleHlfbmF2aWdhdGlvbiIsImxheW91dF9jbGFzc2VzIiwidXBncmFkZSIsIiRuYXZpZ2F0aW9ucyIsIm5hdmlnYXRpb24iLCIkbmF2aWdhdGlvbiIsIiRtZWdhbWVudXMiLCJkcm9wZG93bl9tZWdhbWVudSIsIiRkcm9wZG93bl9tZWdhbWVudSIsImRyb3Bkb3duX2hhc19tZWdhbWVudSIsImlzX3VwZ3JhZGVkIiwibmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUiLCIkbWVnYW1lbnUiLCJoYXNfb2JmdXNjYXRvciIsIm9iZnVzY2F0b3IiLCJiYWJlbEhlbHBlcnMiLCJjbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInNpZHJTdGF0dXMiLCJtb3ZpbmciLCJvcGVuZWQiLCJoZWxwZXIiLCJpc1VybCIsInBhdHRlcm4iLCJhZGRQcmVmaXhlcyIsImFkZFByZWZpeCIsImF0dHJpYnV0ZSIsInRvUmVwbGFjZSIsInRyYW5zaXRpb25zIiwicHJvcGVydHkiLCIkJDIiLCJib2R5QW5pbWF0aW9uQ2xhc3MiLCJvcGVuQWN0aW9uIiwiY2xvc2VBY3Rpb24iLCJ0cmFuc2l0aW9uRW5kRXZlbnQiLCJNZW51Iiwib3BlbkNsYXNzIiwibWVudVdpZHRoIiwib3V0ZXJXaWR0aCIsInNpZGUiLCJkaXNwbGFjZSIsInRpbWluZyIsIm1ldGhvZCIsIm9uT3BlbkNhbGxiYWNrIiwib25DbG9zZUNhbGxiYWNrIiwib25PcGVuRW5kQ2FsbGJhY2siLCJvbkNsb3NlRW5kQ2FsbGJhY2siLCJnZXRBbmltYXRpb24iLCJwcmVwYXJlQm9keSIsIiRodG1sIiwib3BlbkJvZHkiLCJib2R5QW5pbWF0aW9uIiwicXVldWUiLCJvbkNsb3NlQm9keSIsInJlc2V0U3R5bGVzIiwidW5iaW5kIiwiY2xvc2VCb2R5IiwiX3RoaXMiLCJtb3ZlQm9keSIsIm9uT3Blbk1lbnUiLCJvcGVuTWVudSIsIl90aGlzMiIsIiRpdGVtIiwibWVudUFuaW1hdGlvbiIsIm9uQ2xvc2VNZW51IiwiY2xvc2VNZW51IiwiX3RoaXMzIiwibW92ZU1lbnUiLCJtb3ZlIiwib3BlbiIsIl90aGlzNCIsImFscmVhZHlPcGVuZWRNZW51IiwiJCQxIiwiZXhlY3V0ZSIsInNpZHIiLCJlcnJvciIsInB1YmxpY01ldGhvZHMiLCJtZXRob2ROYW1lIiwibWV0aG9kcyIsImdldE1ldGhvZCIsIiQkMyIsImZpbGxDb250ZW50IiwiJHNpZGVNZW51Iiwic2V0dGluZ3MiLCJzb3VyY2UiLCJuZXdDb250ZW50IiwiaHRtbENvbnRlbnQiLCJzZWxlY3RvcnMiLCJyZW5hbWluZyIsIiRodG1sQ29udGVudCIsImZuU2lkciIsImJpbmQiLCJvbk9wZW4iLCJvbkNsb3NlIiwib25PcGVuRW5kIiwib25DbG9zZUVuZCIsImZsYWciLCJ0Iiwic2xpbmt5IiwibGFiZWwiLCJuIiwiciIsInByZXBlbmQiLCJub3ciLCJqdW1wIiwiaG9tZSIsImMiLCJBamF4TW9uaXRvciIsIkJhciIsIkRvY3VtZW50TW9uaXRvciIsIkVsZW1lbnRNb25pdG9yIiwiRWxlbWVudFRyYWNrZXIiLCJFdmVudExhZ01vbml0b3IiLCJFdmVudGVkIiwiTm9UYXJnZXRFcnJvciIsIlBhY2UiLCJSZXF1ZXN0SW50ZXJjZXB0IiwiU09VUkNFX0tFWVMiLCJTY2FsZXIiLCJTb2NrZXRSZXF1ZXN0VHJhY2tlciIsIlhIUlJlcXVlc3RUcmFja2VyIiwiYXZnQW1wbGl0dWRlIiwiYmFyIiwiY2FuY2VsQW5pbWF0aW9uIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmROYXRpdmUiLCJnZXRGcm9tRE9NIiwiZ2V0SW50ZXJjZXB0IiwiaGFuZGxlUHVzaFN0YXRlIiwiaWdub3JlU3RhY2siLCJydW5BbmltYXRpb24iLCJzY2FsZXJzIiwic2hvdWxkSWdub3JlVVJMIiwic2hvdWxkVHJhY2siLCJzb3VyY2VzIiwidW5pU2NhbGVyIiwiX1dlYlNvY2tldCIsIl9YRG9tYWluUmVxdWVzdCIsIl9YTUxIdHRwUmVxdWVzdCIsIl9pIiwiX2ludGVyY2VwdCIsIl9sZW4iLCJfcHVzaFN0YXRlIiwiX3JlZiIsIl9yZWYxIiwiX3JlcGxhY2VTdGF0ZSIsIl9fc2xpY2UiLCJfX2hhc1Byb3AiLCJfX2V4dGVuZHMiLCJjaGlsZCIsImN0b3IiLCJfX3N1cGVyX18iLCJfX2luZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsImxhc3QiLCJkaWZmIiwiYXJncyIsIm91dCIsInN1bSIsInYiLCJqc29uIiwiX2Vycm9yIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiaWdub3JlIiwicmV0IiwidW5zaGlmdCIsInNoaWZ0IiwidHJhY2siLCJtb25pdG9yWEhSIiwicmVxIiwiX29wZW4iLCJ1cmwiLCJhc3luYyIsInJlcXVlc3QiLCJmbGFncyIsInByb3RvY29scyIsIl9hcmciLCJhZnRlciIsInN0aWxsQWN0aXZlIiwiX3JlZjMiLCJyZWFkeVN0YXRlIiwicmVzdGFydCIsIndhdGNoIiwidHJhY2tlciIsInNpemUiLCJfb25yZWFkeXN0YXRlY2hhbmdlIiwiUHJvZ3Jlc3NFdmVudCIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwiZ28iLCJlbnF1ZXVlTmV4dEZyYW1lIiwicmVtYWluaW5nIiwic2NhbGVyIiwic2NhbGVyTGlzdCIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJoYW5kbGVUb2dnbGUiLCJ0b2dnbGVzIiwiZmFrZVN1Ym1pdCIsInBhcmVudEZvcm0iLCJzdWJtaXQiLCJoaWdobGlnaHQiLCJidXR0b25zIiwicmFkaW9zIiwicmFkaW8iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxNQUFPLFlBQVc7QUFDdEI7QUFDQSxNQUFJLENBQUNDLE9BQU9DLElBQVosRUFBa0I7QUFDaEJELFdBQU9DLElBQVAsR0FBYyxVQUFTQyxNQUFULEVBQWlCO0FBQzdCLFVBQUlELE9BQU8sRUFBWDtBQUNBLFdBQUssSUFBSUUsSUFBVCxJQUFpQkQsTUFBakIsRUFBeUI7QUFDdkIsWUFBSUYsT0FBT0ksU0FBUCxDQUFpQkMsY0FBakIsQ0FBZ0NDLElB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O0FBQ0FoOUIsTUFBSTtBQUNGd04sZUFBVyw2QkFEVDtBQUVGVSxZQUFRLElBRk47QUFHRlAsV0FBTyxDQUhMO0FBSUZvQixjQUFVLElBSlI7QUFLRkssd0JBQW9CO0FBTGxCLEdBQUo7O0FBUUE7QUFDQXBQLE1BQUk7QUFDRndOLGVBQVcsMkJBRFQ7QUFFRlUsWUFBUSxJQUZOO0FBR0ZQLFdBQU8sQ0FITDtBQUlGb0IsY0FBVSxJQUpSO0FBS0ZLLHdCQUFvQjtBQUxsQixHQUFKO0FBT0QsQ0F2Q0QiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRucyA9IChmdW5jdGlvbiAoKXtcbi8vIE9iamVjdC5rZXlzXG5pZiAoIU9iamVjdC5rZXlzKSB7XG4gIE9iamVjdC5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG59XG5cbi8vIENoaWxkTm9kZS5yZW1vdmVcbmlmKCEoXCJyZW1vdmVcIiBpbiBFbGVtZW50LnByb3RvdHlwZSkpe1xuICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIHdpbiA9IHdpbmRvdztcblxudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG52YXIgd2luJDEgPSB3aW5kb3c7XG5cbnZhciBjYWYgPSB3aW4kMS5jYW5jZWxBbmltYXRpb25GcmFtZVxuICB8fCB3aW4kMS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihpZCl7IGNsZWFyVGltZW91dChpZCk7IH07XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgdmFyIG9iaiwgbmFtZSwgY29weSxcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgIGkgPSAxLFxuICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChvYmogPSBhcmd1bWVudHNbaV0pICE9PSBudWxsKSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGNvcHkgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY2hlY2tTdG9yYWdlVmFsdWUgKHZhbHVlKSB7XG4gIHJldHVybiBbJ3RydWUnLCAnZmFsc2UnXS5pbmRleE9mKHZhbHVlKSA+PSAwID8gSlNPTi5wYXJzZSh2YWx1ZSkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gc2V0TG9jYWxTdG9yYWdlKHN0b3JhZ2UsIGtleSwgdmFsdWUsIGFjY2Vzcykge1xuICBpZiAoYWNjZXNzKSB7XG4gICAgdHJ5IHsgc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpOyB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0U2xpZGVJZCgpIHtcbiAgdmFyIGlkID0gd2luZG93LnRuc0lkO1xuICB3aW5kb3cudG5zSWQgPSAhaWQgPyAxIDogaWQgKyAxO1xuICBcbiAgcmV0dXJuICd0bnMnICsgd2luZG93LnRuc0lkO1xufVxuXG5mdW5jdGlvbiBnZXRCb2R5ICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGRvYy5ib2R5O1xuXG4gIGlmICghYm9keSkge1xuICAgIGJvZHkgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgIGJvZHkuZmFrZSA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gYm9keTtcbn1cblxudmFyIGRvY0VsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbmZ1bmN0aW9uIHNldEZha2VCb2R5IChib2R5KSB7XG4gIHZhciBkb2NPdmVyZmxvdyA9ICcnO1xuICBpZiAoYm9keS5mYWtlKSB7XG4gICAgZG9jT3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93O1xuICAgIC8vYXZvaWQgY3Jhc2hpbmcgSUU4LCBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHVzZWRcbiAgICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSAnJztcbiAgICAvL1NhZmFyaSA1LjEzLzUuMS40IE9TWCBzdG9wcyBsb2FkaW5nIGlmIDo6LXdlYmtpdC1zY3JvbGxiYXIgaXMgdXNlZCBhbmQgc2Nyb2xsYmFycyBhcmUgdmlzaWJsZVxuICAgIGJvZHkuc3R5bGUub3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgZG9jRWxlbWVudC5hcHBlbmRDaGlsZChib2R5KTtcbiAgfVxuXG4gIHJldHVybiBkb2NPdmVyZmxvdztcbn1cblxuZnVuY3Rpb24gcmVzZXRGYWtlQm9keSAoYm9keSwgZG9jT3ZlcmZsb3cpIHtcbiAgaWYgKGJvZHkuZmFrZSkge1xuICAgIGJvZHkucmVtb3ZlKCk7XG4gICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IGRvY092ZXJmbG93O1xuICAgIC8vIFRyaWdnZXIgbGF5b3V0IHNvIGtpbmV0aWMgc2Nyb2xsaW5nIGlzbid0IGRpc2FibGVkIGluIGlPUzYrXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgZG9jRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gIH1cbn1cblxuLy8gZ2V0IGNzcy1jYWxjIFxuXG5mdW5jdGlvbiBjYWxjKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQsIFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIFxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICB0cnkge1xuICAgIHZhciBzdHIgPSAnKDEwcHggKiAxMCknLFxuICAgICAgICB2YWxzID0gWydjYWxjJyArIHN0ciwgJy1tb3otY2FsYycgKyBzdHIsICctd2Via2l0LWNhbGMnICsgc3RyXSxcbiAgICAgICAgdmFsO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICB2YWwgPSB2YWxzW2ldO1xuICAgICAgZGl2LnN0eWxlLndpZHRoID0gdmFsO1xuICAgICAgaWYgKGRpdi5vZmZzZXRXaWR0aCA9PT0gMTAwKSB7IFxuICAgICAgICByZXN1bHQgPSB2YWwucmVwbGFjZShzdHIsICcnKTsgXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZGl2LnJlbW92ZSgpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIGdldCBzdWJwaXhlbCBzdXBwb3J0IHZhbHVlXG5cbmZ1bmN0aW9uIHBlcmNlbnRhZ2VMYXlvdXQoKSB7XG4gIC8vIGNoZWNrIHN1YnBpeGVsIGxheW91dCBzdXBwb3J0aW5nXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgd3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIG91dGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgc3RyID0gJycsXG4gICAgICBjb3VudCA9IDcwLFxuICAgICAgcGVyUGFnZSA9IDMsXG4gICAgICBzdXBwb3J0ZWQgPSBmYWxzZTtcblxuICB3cmFwcGVyLmNsYXNzTmFtZSA9IFwidG5zLXQtc3VicDJcIjtcbiAgb3V0ZXIuY2xhc3NOYW1lID0gXCJ0bnMtdC1jdFwiO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHN0ciArPSAnPGRpdj48L2Rpdj4nO1xuICB9XG5cbiAgb3V0ZXIuaW5uZXJIVE1MID0gc3RyO1xuICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyKTtcbiAgYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICBzdXBwb3J0ZWQgPSBNYXRoLmFicyh3cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBvdXRlci5jaGlsZHJlbltjb3VudCAtIHBlclBhZ2VdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpIDwgMjtcblxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IHdyYXBwZXIucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHN1cHBvcnRlZDtcbn1cblxuZnVuY3Rpb24gbWVkaWFxdWVyeVN1cHBvcnQgKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIHN0eWxlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyksXG4gICAgICBydWxlID0gJ0BtZWRpYSBhbGwgYW5kIChtaW4td2lkdGg6MXB4KXsudG5zLW1xLXRlc3R7cG9zaXRpb246YWJzb2x1dGV9fScsXG4gICAgICBwb3NpdGlvbjtcblxuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgZGl2LmNsYXNzTmFtZSA9ICd0bnMtbXEtdGVzdCc7XG5cbiAgYm9keS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJ1bGU7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcbiAgfVxuXG4gIHBvc2l0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnBvc2l0aW9uIDogZGl2LmN1cnJlbnRTdHlsZVsncG9zaXRpb24nXTtcblxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGRpdi5yZW1vdmUoKTtcblxuICByZXR1cm4gcG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIjtcbn1cblxuLy8gY3JlYXRlIGFuZCBhcHBlbmQgc3R5bGUgc2hlZXRcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlU2hlZXQgKG1lZGlhKSB7XG4gIC8vIENyZWF0ZSB0aGUgPHN0eWxlPiB0YWdcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dC9jc3NcIik7XG5cbiAgLy8gQWRkIGEgbWVkaWEgKGFuZC9vciBtZWRpYSBxdWVyeSkgaGVyZSBpZiB5b3UnZCBsaWtlIVxuICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcInNjcmVlblwiKVxuICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogMTAyNHB4KVwiKVxuICBpZiAobWVkaWEpIHsgc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpOyB9XG5cbiAgLy8gV2ViS2l0IGhhY2sgOihcbiAgLy8gc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikpO1xuXG4gIC8vIEFkZCB0aGUgPHN0eWxlPiBlbGVtZW50IHRvIHRoZSBwYWdlXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmRDaGlsZChzdHlsZSk7XG5cbiAgcmV0dXJuIHN0eWxlLnNoZWV0ID8gc3R5bGUuc2hlZXQgOiBzdHlsZS5zdHlsZVNoZWV0O1xufVxuXG4vLyBjcm9zcyBicm93c2VycyBhZGRSdWxlIG1ldGhvZFxuZnVuY3Rpb24gYWRkQ1NTUnVsZShzaGVldCwgc2VsZWN0b3IsIHJ1bGVzLCBpbmRleCkge1xuICAvLyByZXR1cm4gcmFmKGZ1bmN0aW9uKCkge1xuICAgICdpbnNlcnRSdWxlJyBpbiBzaGVldCA/XG4gICAgICBzaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yICsgJ3snICsgcnVsZXMgKyAnfScsIGluZGV4KSA6XG4gICAgICBzaGVldC5hZGRSdWxlKHNlbGVjdG9yLCBydWxlcywgaW5kZXgpO1xuICAvLyB9KTtcbn1cblxuLy8gY3Jvc3MgYnJvd3NlcnMgYWRkUnVsZSBtZXRob2RcbmZ1bmN0aW9uIHJlbW92ZUNTU1J1bGUoc2hlZXQsIGluZGV4KSB7XG4gIC8vIHJldHVybiByYWYoZnVuY3Rpb24oKSB7XG4gICAgJ2RlbGV0ZVJ1bGUnIGluIHNoZWV0ID9cbiAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpIDpcbiAgICAgIHNoZWV0LnJlbW92ZVJ1bGUoaW5kZXgpO1xuICAvLyB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpIHtcbiAgdmFyIHJ1bGUgPSAoJ2luc2VydFJ1bGUnIGluIHNoZWV0KSA/IHNoZWV0LmNzc1J1bGVzIDogc2hlZXQucnVsZXM7XG4gIHJldHVybiBydWxlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gdG9EZWdyZWUgKHksIHgpIHtcbiAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAoMTgwIC8gTWF0aC5QSSk7XG59XG5cbmZ1bmN0aW9uIGdldFRvdWNoRGlyZWN0aW9uKGFuZ2xlLCByYW5nZSkge1xuICB2YXIgZGlyZWN0aW9uID0gZmFsc2UsXG4gICAgICBnYXAgPSBNYXRoLmFicyg5MCAtIE1hdGguYWJzKGFuZ2xlKSk7XG4gICAgICBcbiAgaWYgKGdhcCA+PSA5MCAtIHJhbmdlKSB7XG4gICAgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICB9IGVsc2UgaWYgKGdhcCA8PSByYW5nZSkge1xuICAgIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICByZXR1cm4gZGlyZWN0aW9uO1xufVxuXG4vLyBodHRwczovL3RvZGRtb3R0by5jb20vZGl0Y2gtdGhlLWFycmF5LWZvcmVhY2gtY2FsbC1ub2RlbGlzdC1oYWNrL1xuZnVuY3Rpb24gZm9yRWFjaCAoYXJyLCBjYWxsYmFjaywgc2NvcGUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2FsbGJhY2suY2FsbChzY29wZSwgYXJyW2ldLCBpKTtcbiAgfVxufVxuXG52YXIgY2xhc3NMaXN0U3VwcG9ydCA9ICdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ18nKTtcblxudmFyIGhhc0NsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhzdHIpOyB9IDpcbiAgICBmdW5jdGlvbiAoZWwsIHN0cikgeyByZXR1cm4gZWwuY2xhc3NOYW1lLmluZGV4T2Yoc3RyKSA+PSAwOyB9O1xuXG52YXIgYWRkQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKCFoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NMaXN0LmFkZChzdHIpOyB9XG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmICghaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTmFtZSArPSAnICcgKyBzdHI7IH1cbiAgICB9O1xuXG52YXIgcmVtb3ZlQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKGhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc0xpc3QucmVtb3ZlKHN0cik7IH1cbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKGhhc0NsYXNzKGVsLCBzdHIpKSB7IGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHN0ciwgJycpOyB9XG4gICAgfTtcblxuZnVuY3Rpb24gaGFzQXR0cihlbCwgYXR0cikge1xuICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKGF0dHIpO1xufVxuXG5mdW5jdGlvbiBnZXRBdHRyKGVsLCBhdHRyKSB7XG4gIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZUxpc3QoZWwpIHtcbiAgLy8gT25seSBOb2RlTGlzdCBoYXMgdGhlIFwiaXRlbSgpXCIgZnVuY3Rpb25cbiAgcmV0dXJuIHR5cGVvZiBlbC5pdGVtICE9PSBcInVuZGVmaW5lZFwiOyBcbn1cblxuZnVuY3Rpb24gc2V0QXR0cnMoZWxzLCBhdHRycykge1xuICBlbHMgPSAoaXNOb2RlTGlzdChlbHMpIHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSA/IGVscyA6IFtlbHNdO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGF0dHJzKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHsgcmV0dXJuOyB9XG5cbiAgZm9yICh2YXIgaSA9IGVscy5sZW5ndGg7IGktLTspIHtcbiAgICBmb3IodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgZWxzW2ldLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVBdHRycyhlbHMsIGF0dHJzKSB7XG4gIGVscyA9IChpc05vZGVMaXN0KGVscykgfHwgZWxzIGluc3RhbmNlb2YgQXJyYXkpID8gZWxzIDogW2Vsc107XG4gIGF0dHJzID0gKGF0dHJzIGluc3RhbmNlb2YgQXJyYXkpID8gYXR0cnMgOiBbYXR0cnNdO1xuXG4gIHZhciBhdHRyTGVuZ3RoID0gYXR0cnMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gZWxzLmxlbmd0aDsgaS0tOykge1xuICAgIGZvciAodmFyIGogPSBhdHRyTGVuZ3RoOyBqLS07KSB7XG4gICAgICBlbHNbaV0ucmVtb3ZlQXR0cmlidXRlKGF0dHJzW2pdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXJyYXlGcm9tTm9kZUxpc3QgKG5sKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBubC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBhcnIucHVzaChubFtpXSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWwsIGZvcmNlSGlkZSkge1xuICBpZiAoZWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7IGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7IH1cbn1cblxuZnVuY3Rpb24gc2hvd0VsZW1lbnQoZWwsIGZvcmNlSGlkZSkge1xuICBpZiAoZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7IGVsLnN0eWxlLmRpc3BsYXkgPSAnJzsgfVxufVxuXG5mdW5jdGlvbiBpc1Zpc2libGUoZWwpIHtcbiAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5ICE9PSAnbm9uZSc7XG59XG5cbmZ1bmN0aW9uIHdoaWNoUHJvcGVydHkocHJvcHMpe1xuICBpZiAodHlwZW9mIHByb3BzID09PSAnc3RyaW5nJykge1xuICAgIHZhciBhcnIgPSBbcHJvcHNdLFxuICAgICAgICBQcm9wcyA9IHByb3BzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcHMuc3Vic3RyKDEpLFxuICAgICAgICBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcycsICdPJ107XG4gICAgICAgIFxuICAgIHByZWZpeGVzLmZvckVhY2goZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICBpZiAocHJlZml4ICE9PSAnbXMnIHx8IHByb3BzID09PSAndHJhbnNmb3JtJykge1xuICAgICAgICBhcnIucHVzaChwcmVmaXggKyBQcm9wcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwcm9wcyA9IGFycjtcbiAgfVxuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50JyksXG4gICAgICBsZW4gPSBwcm9wcy5sZW5ndGg7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKyl7XG4gICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcbiAgICBpZiggZWwuc3R5bGVbcHJvcF0gIT09IHVuZGVmaW5lZCApeyByZXR1cm4gcHJvcDsgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlOyAvLyBleHBsaWNpdCBmb3IgaWU5LVxufVxuXG5mdW5jdGlvbiBoYXMzRFRyYW5zZm9ybXModGYpe1xuICBpZiAoIXRmKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoIXdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7IHJldHVybiBmYWxzZTsgfVxuICBcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdwJyksXG4gICAgICBoYXMzZCxcbiAgICAgIGNzc1RGID0gdGYubGVuZ3RoID4gOSA/ICctJyArIHRmLnNsaWNlKDAsIC05KS50b0xvd2VyQ2FzZSgpICsgJy0nIDogJyc7XG5cbiAgY3NzVEYgKz0gJ3RyYW5zZm9ybSc7XG5cbiAgLy8gQWRkIGl0IHRvIHRoZSBib2R5IHRvIGdldCB0aGUgY29tcHV0ZWQgc3R5bGVcbiAgYm9keS5pbnNlcnRCZWZvcmUoZWwsIG51bGwpO1xuXG4gIGVsLnN0eWxlW3RmXSA9ICd0cmFuc2xhdGUzZCgxcHgsMXB4LDFweCknO1xuICBoYXMzZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKGNzc1RGKTtcblxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGVsLnJlbW92ZSgpO1xuXG4gIHJldHVybiAoaGFzM2QgIT09IHVuZGVmaW5lZCAmJiBoYXMzZC5sZW5ndGggPiAwICYmIGhhczNkICE9PSBcIm5vbmVcIik7XG59XG5cbi8vIGdldCB0cmFuc2l0aW9uZW5kLCBhbmltYXRpb25lbmQgYmFzZWQgb24gdHJhbnNpdGlvbkR1cmF0aW9uXG4vLyBAcHJvcGluOiBzdHJpbmdcbi8vIEBwcm9wT3V0OiBzdHJpbmcsIGZpcnN0LWxldHRlciB1cHBlcmNhc2Vcbi8vIFVzYWdlOiBnZXRFbmRQcm9wZXJ0eSgnV2Via2l0VHJhbnNpdGlvbkR1cmF0aW9uJywgJ1RyYW5zaXRpb24nKSA9PiB3ZWJraXRUcmFuc2l0aW9uRW5kXG5mdW5jdGlvbiBnZXRFbmRQcm9wZXJ0eShwcm9wSW4sIHByb3BPdXQpIHtcbiAgdmFyIGVuZFByb3AgPSBmYWxzZTtcbiAgaWYgKC9eV2Via2l0Ly50ZXN0KHByb3BJbikpIHtcbiAgICBlbmRQcm9wID0gJ3dlYmtpdCcgKyBwcm9wT3V0ICsgJ0VuZCc7XG4gIH0gZWxzZSBpZiAoL15PLy50ZXN0KHByb3BJbikpIHtcbiAgICBlbmRQcm9wID0gJ28nICsgcHJvcE91dCArICdFbmQnO1xuICB9IGVsc2UgaWYgKHByb3BJbikge1xuICAgIGVuZFByb3AgPSBwcm9wT3V0LnRvTG93ZXJDYXNlKCkgKyAnZW5kJztcbiAgfVxuICByZXR1cm4gZW5kUHJvcDtcbn1cblxuLy8gVGVzdCB2aWEgYSBnZXR0ZXIgaW4gdGhlIG9wdGlvbnMgb2JqZWN0IHRvIHNlZSBpZiB0aGUgcGFzc2l2ZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZFxudmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xudHJ5IHtcbiAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLCBudWxsLCBvcHRzKTtcbn0gY2F0Y2ggKGUpIHt9XG52YXIgcGFzc2l2ZU9wdGlvbiA9IHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2U7XG5cbmZ1bmN0aW9uIGFkZEV2ZW50cyhlbCwgb2JqLCBwcmV2ZW50U2Nyb2xsaW5nKSB7XG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgdmFyIG9wdGlvbiA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnXS5pbmRleE9mKHByb3ApID49IDAgJiYgIXByZXZlbnRTY3JvbGxpbmcgPyBwYXNzaXZlT3B0aW9uIDogZmFsc2U7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihwcm9wLCBvYmpbcHJvcF0sIG9wdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRzKGVsLCBvYmopIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICB2YXIgb3B0aW9uID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZSddLmluZGV4T2YocHJvcCkgPj0gMCA/IHBhc3NpdmVPcHRpb24gOiBmYWxzZTtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHByb3AsIG9ialtwcm9wXSwgb3B0aW9uKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBFdmVudHMoKSB7XG4gIHJldHVybiB7XG4gICAgdG9waWNzOiB7fSxcbiAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0gPSB0aGlzLnRvcGljc1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIG9mZjogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvcGljc1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgZGF0YS50eXBlID0gZXZlbnROYW1lO1xuICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgZm4oZGF0YSwgZXZlbnROYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBqc1RyYW5zZm9ybShlbGVtZW50LCBhdHRyLCBwcmVmaXgsIHBvc3RmaXgsIHRvLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgdmFyIHRpY2sgPSBNYXRoLm1pbihkdXJhdGlvbiwgMTApLFxuICAgICAgdW5pdCA9ICh0by5pbmRleE9mKCclJykgPj0gMCkgPyAnJScgOiAncHgnLFxuICAgICAgdG8gPSB0by5yZXBsYWNlKHVuaXQsICcnKSxcbiAgICAgIGZyb20gPSBOdW1iZXIoZWxlbWVudC5zdHlsZVthdHRyXS5yZXBsYWNlKHByZWZpeCwgJycpLnJlcGxhY2UocG9zdGZpeCwgJycpLnJlcGxhY2UodW5pdCwgJycpKSxcbiAgICAgIHBvc2l0aW9uVGljayA9ICh0byAtIGZyb20pIC8gZHVyYXRpb24gKiB0aWNrLFxuICAgICAgcnVubmluZztcblxuICBzZXRUaW1lb3V0KG1vdmVFbGVtZW50LCB0aWNrKTtcbiAgZnVuY3Rpb24gbW92ZUVsZW1lbnQoKSB7XG4gICAgZHVyYXRpb24gLT0gdGljaztcbiAgICBmcm9tICs9IHBvc2l0aW9uVGljaztcbiAgICBlbGVtZW50LnN0eWxlW2F0dHJdID0gcHJlZml4ICsgZnJvbSArIHVuaXQgKyBwb3N0Zml4O1xuICAgIGlmIChkdXJhdGlvbiA+IDApIHsgXG4gICAgICBzZXRUaW1lb3V0KG1vdmVFbGVtZW50LCB0aWNrKTsgXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG59XG5cbnZhciB0bnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBleHRlbmQoe1xuICAgIGNvbnRhaW5lcjogJy5zbGlkZXInLFxuICAgIG1vZGU6ICdjYXJvdXNlbCcsXG4gICAgYXhpczogJ2hvcml6b250YWwnLFxuICAgIGl0ZW1zOiAxLFxuICAgIGd1dHRlcjogMCxcbiAgICBlZGdlUGFkZGluZzogMCxcbiAgICBmaXhlZFdpZHRoOiBmYWxzZSxcbiAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgIHZpZXdwb3J0TWF4OiBmYWxzZSxcbiAgICBzbGlkZUJ5OiAxLFxuICAgIGNlbnRlcjogZmFsc2UsXG4gICAgY29udHJvbHM6IHRydWUsXG4gICAgY29udHJvbHNQb3NpdGlvbjogJ3RvcCcsXG4gICAgY29udHJvbHNUZXh0OiBbJ3ByZXYnLCAnbmV4dCddLFxuICAgIGNvbnRyb2xzQ29udGFpbmVyOiBmYWxzZSxcbiAgICBwcmV2QnV0dG9uOiBmYWxzZSxcbiAgICBuZXh0QnV0dG9uOiBmYWxzZSxcbiAgICBuYXY6IHRydWUsXG4gICAgbmF2UG9zaXRpb246ICd0b3AnLFxuICAgIG5hdkNvbnRhaW5lcjogZmFsc2UsXG4gICAgbmF2QXNUaHVtYm5haWxzOiBmYWxzZSxcbiAgICBhcnJvd0tleXM6IGZhbHNlLFxuICAgIHNwZWVkOiAzMDAsXG4gICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgIGF1dG9wbGF5UG9zaXRpb246ICd0b3AnLFxuICAgIGF1dG9wbGF5VGltZW91dDogNTAwMCxcbiAgICBhdXRvcGxheURpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAgIGF1dG9wbGF5VGV4dDogWydzdGFydCcsICdzdG9wJ10sXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOiBmYWxzZSxcbiAgICBhdXRvcGxheUJ1dHRvbjogZmFsc2UsXG4gICAgYXV0b3BsYXlCdXR0b25PdXRwdXQ6IHRydWUsXG4gICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eTogdHJ1ZSxcbiAgICBhbmltYXRlSW46ICd0bnMtZmFkZUluJyxcbiAgICBhbmltYXRlT3V0OiAndG5zLWZhZGVPdXQnLFxuICAgIGFuaW1hdGVOb3JtYWw6ICd0bnMtbm9ybWFsJyxcbiAgICBhbmltYXRlRGVsYXk6IGZhbHNlLFxuICAgIGxvb3A6IHRydWUsXG4gICAgcmV3aW5kOiBmYWxzZSxcbiAgICBhdXRvSGVpZ2h0OiBmYWxzZSxcbiAgICByZXNwb25zaXZlOiBmYWxzZSxcbiAgICBsYXp5bG9hZDogZmFsc2UsXG4gICAgbGF6eWxvYWRTZWxlY3RvcjogJy50bnMtbGF6eS1pbWcnLFxuICAgIHRvdWNoOiB0cnVlLFxuICAgIG1vdXNlRHJhZzogZmFsc2UsXG4gICAgc3dpcGVBbmdsZTogMTUsXG4gICAgbmVzdGVkOiBmYWxzZSxcbiAgICBwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmc6IGZhbHNlLFxuICAgIHByZXZlbnRTY3JvbGxPblRvdWNoOiBmYWxzZSxcbiAgICBmcmVlemFibGU6IHRydWUsXG4gICAgb25Jbml0OiBmYWxzZSxcbiAgICB1c2VMb2NhbFN0b3JhZ2U6IHRydWVcbiAgfSwgb3B0aW9ucyB8fCB7fSk7XG4gIFxuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICB3aW4gPSB3aW5kb3csXG4gICAgICBLRVlTID0ge1xuICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgIFNQQUNFOiAzMixcbiAgICAgICAgTEVGVDogMzcsXG4gICAgICAgIFJJR0hUOiAzOVxuICAgICAgfSxcbiAgICAgIHRuc1N0b3JhZ2UgPSB7fSxcbiAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IG9wdGlvbnMudXNlTG9jYWxTdG9yYWdlO1xuXG4gIGlmIChsb2NhbFN0b3JhZ2VBY2Nlc3MpIHtcbiAgICAvLyBjaGVjayBicm93c2VyIHZlcnNpb24gYW5kIGxvY2FsIHN0b3JhZ2UgYWNjZXNzXG4gICAgdmFyIGJyb3dzZXJJbmZvID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB2YXIgdWlkID0gbmV3IERhdGU7XG5cbiAgICB0cnkge1xuICAgICAgdG5zU3RvcmFnZSA9IHdpbi5sb2NhbFN0b3JhZ2U7XG4gICAgICBpZiAodG5zU3RvcmFnZSkge1xuICAgICAgICB0bnNTdG9yYWdlLnNldEl0ZW0odWlkLCB1aWQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSB0bnNTdG9yYWdlLmdldEl0ZW0odWlkKSA9PSB1aWQ7XG4gICAgICAgIHRuc1N0b3JhZ2UucmVtb3ZlSXRlbSh1aWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZUFjY2VzcykgeyB0bnNTdG9yYWdlID0ge307IH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChsb2NhbFN0b3JhZ2VBY2Nlc3MpIHtcbiAgICAgIC8vIHJlbW92ZSBzdG9yYWdlIHdoZW4gYnJvd3NlciB2ZXJzaW9uIGNoYW5nZXNcbiAgICAgIGlmICh0bnNTdG9yYWdlWyd0bnNBcHAnXSAmJiB0bnNTdG9yYWdlWyd0bnNBcHAnXSAhPT0gYnJvd3NlckluZm8pIHtcbiAgICAgICAgWyd0QycsICd0UEwnLCAndE1RJywgJ3RUZicsICd0M0QnLCAndFREdScsICd0VERlJywgJ3RBRHUnLCAndEFEZScsICd0VEUnLCAndEFFJ10uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IHRuc1N0b3JhZ2UucmVtb3ZlSXRlbShpdGVtKTsgfSk7XG4gICAgICB9XG4gICAgICAvLyB1cGRhdGUgYnJvd3NlckluZm9cbiAgICAgIGxvY2FsU3RvcmFnZVsndG5zQXBwJ10gPSBicm93c2VySW5mbztcbiAgICB9XG4gIH1cblxuICB2YXIgQ0FMQyA9IHRuc1N0b3JhZ2VbJ3RDJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QyddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEMnLCBjYWxjKCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBQRVJDRU5UQUdFTEFZT1VUID0gdG5zU3RvcmFnZVsndFBMJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0UEwnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RQTCcsIHBlcmNlbnRhZ2VMYXlvdXQoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIENTU01RID0gdG5zU3RvcmFnZVsndE1RJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0TVEnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RNUScsIG1lZGlhcXVlcnlTdXBwb3J0KCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0ZPUk0gPSB0bnNTdG9yYWdlWyd0VGYnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RUZiddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFRmJywgd2hpY2hQcm9wZXJ0eSgndHJhbnNmb3JtJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBIQVMzRFRSQU5TRk9STVMgPSB0bnNTdG9yYWdlWyd0M0QnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3QzRCddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndDNEJywgaGFzM0RUcmFuc2Zvcm1zKFRSQU5TRk9STSksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9ORFVSQVRJT04gPSB0bnNTdG9yYWdlWyd0VER1J10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VER1J10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VER1Jywgd2hpY2hQcm9wZXJ0eSgndHJhbnNpdGlvbkR1cmF0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9OREVMQVkgPSB0bnNTdG9yYWdlWyd0VERlJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VERlJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VERlJywgd2hpY2hQcm9wZXJ0eSgndHJhbnNpdGlvbkRlbGF5JyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBBTklNQVRJT05EVVJBVElPTiA9IHRuc1N0b3JhZ2VbJ3RBRHUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRHUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRHUnLCB3aGljaFByb3BlcnR5KCdhbmltYXRpb25EdXJhdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9OREVMQVkgPSB0bnNTdG9yYWdlWyd0QURlJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QURlJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QURlJywgd2hpY2hQcm9wZXJ0eSgnYW5pbWF0aW9uRGVsYXknKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TSVRJT05FTkQgPSB0bnNTdG9yYWdlWyd0VEUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFRFJywgZ2V0RW5kUHJvcGVydHkoVFJBTlNJVElPTkRVUkFUSU9OLCAnVHJhbnNpdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9ORU5EID0gdG5zU3RvcmFnZVsndEFFJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QUUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRScsIGdldEVuZFByb3BlcnR5KEFOSU1BVElPTkRVUkFUSU9OLCAnQW5pbWF0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2Vzcyk7XG5cbiAgLy8gZ2V0IGVsZW1lbnQgbm9kZXMgZnJvbSBzZWxlY3RvcnNcbiAgdmFyIHN1cHBvcnRDb25zb2xlV2FybiA9IHdpbi5jb25zb2xlICYmIHR5cGVvZiB3aW4uY29uc29sZS53YXJuID09PSBcImZ1bmN0aW9uXCIsXG4gICAgICB0bnNMaXN0ID0gWydjb250YWluZXInLCAnY29udHJvbHNDb250YWluZXInLCAncHJldkJ1dHRvbicsICduZXh0QnV0dG9uJywgJ25hdkNvbnRhaW5lcicsICdhdXRvcGxheUJ1dHRvbiddLCBcbiAgICAgIG9wdGlvbnNFbGVtZW50cyA9IHt9O1xuICAgICAgXG4gIHRuc0xpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zW2l0ZW1dID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHN0ciA9IG9wdGlvbnNbaXRlbV0sXG4gICAgICAgICAgZWwgPSBkb2MucXVlcnlTZWxlY3RvcihzdHIpO1xuICAgICAgb3B0aW9uc0VsZW1lbnRzW2l0ZW1dID0gc3RyO1xuXG4gICAgICBpZiAoZWwgJiYgZWwubm9kZU5hbWUpIHtcbiAgICAgICAgb3B0aW9uc1tpdGVtXSA9IGVsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN1cHBvcnRDb25zb2xlV2FybikgeyBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZmluZCcsIG9wdGlvbnNbaXRlbV0pOyB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIG1ha2Ugc3VyZSBhdCBsZWFzdCAxIHNsaWRlXG4gIGlmIChvcHRpb25zLmNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPCAxKSB7XG4gICAgaWYgKHN1cHBvcnRDb25zb2xlV2FybikgeyBjb25zb2xlLndhcm4oJ05vIHNsaWRlcyBmb3VuZCBpbicsIG9wdGlvbnMuY29udGFpbmVyKTsgfVxuICAgIHJldHVybjtcbiAgIH1cblxuICAvLyB1cGRhdGUgb3B0aW9uc1xuICB2YXIgcmVzcG9uc2l2ZSA9IG9wdGlvbnMucmVzcG9uc2l2ZSxcbiAgICAgIG5lc3RlZCA9IG9wdGlvbnMubmVzdGVkLFxuICAgICAgY2Fyb3VzZWwgPSBvcHRpb25zLm1vZGUgPT09ICdjYXJvdXNlbCcgPyB0cnVlIDogZmFsc2U7XG5cbiAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAvLyBhcHBseSByZXNwb25zaXZlWzBdIHRvIG9wdGlvbnMgYW5kIHJlbW92ZSBpdFxuICAgIGlmICgwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywgcmVzcG9uc2l2ZVswXSk7XG4gICAgICBkZWxldGUgcmVzcG9uc2l2ZVswXTtcbiAgICB9XG5cbiAgICB2YXIgcmVzcG9uc2l2ZVRlbSA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiByZXNwb25zaXZlKSB7XG4gICAgICB2YXIgdmFsID0gcmVzcG9uc2l2ZVtrZXldO1xuICAgICAgLy8gdXBkYXRlIHJlc3BvbnNpdmVcbiAgICAgIC8vIGZyb206IDMwMDogMlxuICAgICAgLy8gdG86IFxuICAgICAgLy8gICAzMDA6IHsgXG4gICAgICAvLyAgICAgaXRlbXM6IDIgXG4gICAgICAvLyAgIH0gXG4gICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IHtpdGVtczogdmFsfSA6IHZhbDtcbiAgICAgIHJlc3BvbnNpdmVUZW1ba2V5XSA9IHZhbDtcbiAgICB9XG4gICAgcmVzcG9uc2l2ZSA9IHJlc3BvbnNpdmVUZW07XG4gICAgcmVzcG9uc2l2ZVRlbSA9IG51bGw7XG4gIH1cblxuICAvLyB1cGRhdGUgb3B0aW9uc1xuICBmdW5jdGlvbiB1cGRhdGVPcHRpb25zIChvYmopIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIWNhcm91c2VsKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdzbGlkZUJ5JykgeyBvYmpba2V5XSA9ICdwYWdlJzsgfVxuICAgICAgICBpZiAoa2V5ID09PSAnZWRnZVBhZGRpbmcnKSB7IG9ialtrZXldID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2F1dG9IZWlnaHQnKSB7IG9ialtrZXldID0gZmFsc2U7IH1cbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRlIHJlc3BvbnNpdmUgb3B0aW9uc1xuICAgICAgaWYgKGtleSA9PT0gJ3Jlc3BvbnNpdmUnKSB7IHVwZGF0ZU9wdGlvbnMob2JqW2tleV0pOyB9XG4gICAgfVxuICB9XG4gIGlmICghY2Fyb3VzZWwpIHsgdXBkYXRlT3B0aW9ucyhvcHRpb25zKTsgfVxuXG5cbiAgLy8gPT09IGRlZmluZSBhbmQgc2V0IHZhcmlhYmxlcyA9PT1cbiAgaWYgKCFjYXJvdXNlbCkge1xuICAgIG9wdGlvbnMuYXhpcyA9ICdob3Jpem9udGFsJztcbiAgICBvcHRpb25zLnNsaWRlQnkgPSAncGFnZSc7XG4gICAgb3B0aW9ucy5lZGdlUGFkZGluZyA9IGZhbHNlO1xuXG4gICAgdmFyIGFuaW1hdGVJbiA9IG9wdGlvbnMuYW5pbWF0ZUluLFxuICAgICAgICBhbmltYXRlT3V0ID0gb3B0aW9ucy5hbmltYXRlT3V0LFxuICAgICAgICBhbmltYXRlRGVsYXkgPSBvcHRpb25zLmFuaW1hdGVEZWxheSxcbiAgICAgICAgYW5pbWF0ZU5vcm1hbCA9IG9wdGlvbnMuYW5pbWF0ZU5vcm1hbDtcbiAgfVxuXG4gIHZhciBob3Jpem9udGFsID0gb3B0aW9ucy5heGlzID09PSAnaG9yaXpvbnRhbCcgPyB0cnVlIDogZmFsc2UsXG4gICAgICBvdXRlcldyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBpbm5lcldyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBtaWRkbGVXcmFwcGVyLFxuICAgICAgY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIsXG4gICAgICBjb250YWluZXJQYXJlbnQgPSBjb250YWluZXIucGFyZW50Tm9kZSxcbiAgICAgIGNvbnRhaW5lckhUTUwgPSBjb250YWluZXIub3V0ZXJIVE1MLFxuICAgICAgc2xpZGVJdGVtcyA9IGNvbnRhaW5lci5jaGlsZHJlbixcbiAgICAgIHNsaWRlQ291bnQgPSBzbGlkZUl0ZW1zLmxlbmd0aCxcbiAgICAgIGJyZWFrcG9pbnRab25lLFxuICAgICAgd2luZG93V2lkdGggPSBnZXRXaW5kb3dXaWR0aCgpLFxuICAgICAgaXNPbiA9IGZhbHNlO1xuICBpZiAocmVzcG9uc2l2ZSkgeyBzZXRCcmVha3BvaW50Wm9uZSgpOyB9XG4gIGlmIChjYXJvdXNlbCkgeyBjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG5zLXZwZml4JzsgfVxuXG4gIC8vIGZpeGVkV2lkdGg6IHZpZXdwb3J0ID4gcmlnaHRCb3VuZGFyeSA+IGluZGV4TWF4XG4gIHZhciBhdXRvV2lkdGggPSBvcHRpb25zLmF1dG9XaWR0aCxcbiAgICAgIGZpeGVkV2lkdGggPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnKSxcbiAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpLFxuICAgICAgZ3V0dGVyID0gZ2V0T3B0aW9uKCdndXR0ZXInKSxcbiAgICAgIHZpZXdwb3J0ID0gZ2V0Vmlld3BvcnRXaWR0aCgpLFxuICAgICAgY2VudGVyID0gZ2V0T3B0aW9uKCdjZW50ZXInKSxcbiAgICAgIGl0ZW1zID0gIWF1dG9XaWR0aCA/IE1hdGguZmxvb3IoZ2V0T3B0aW9uKCdpdGVtcycpKSA6IDEsXG4gICAgICBzbGlkZUJ5ID0gZ2V0T3B0aW9uKCdzbGlkZUJ5JyksXG4gICAgICB2aWV3cG9ydE1heCA9IG9wdGlvbnMudmlld3BvcnRNYXggfHwgb3B0aW9ucy5maXhlZFdpZHRoVmlld3BvcnRXaWR0aCxcbiAgICAgIGFycm93S2V5cyA9IGdldE9wdGlvbignYXJyb3dLZXlzJyksXG4gICAgICBzcGVlZCA9IGdldE9wdGlvbignc3BlZWQnKSxcbiAgICAgIHJld2luZCA9IG9wdGlvbnMucmV3aW5kLFxuICAgICAgbG9vcCA9IHJld2luZCA/IGZhbHNlIDogb3B0aW9ucy5sb29wLFxuICAgICAgYXV0b0hlaWdodCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcpLFxuICAgICAgY29udHJvbHMgPSBnZXRPcHRpb24oJ2NvbnRyb2xzJyksXG4gICAgICBjb250cm9sc1RleHQgPSBnZXRPcHRpb24oJ2NvbnRyb2xzVGV4dCcpLFxuICAgICAgbmF2ID0gZ2V0T3B0aW9uKCduYXYnKSxcbiAgICAgIHRvdWNoID0gZ2V0T3B0aW9uKCd0b3VjaCcpLFxuICAgICAgbW91c2VEcmFnID0gZ2V0T3B0aW9uKCdtb3VzZURyYWcnKSxcbiAgICAgIGF1dG9wbGF5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheScpLFxuICAgICAgYXV0b3BsYXlUaW1lb3V0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRpbWVvdXQnKSxcbiAgICAgIGF1dG9wbGF5VGV4dCA9IGdldE9wdGlvbignYXV0b3BsYXlUZXh0JyksXG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2UgPSBnZXRPcHRpb24oJ2F1dG9wbGF5SG92ZXJQYXVzZScpLFxuICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGdldE9wdGlvbignYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eScpLFxuICAgICAgc2hlZXQgPSBjcmVhdGVTdHlsZVNoZWV0KCksXG4gICAgICBsYXp5bG9hZCA9IG9wdGlvbnMubGF6eWxvYWQsXG4gICAgICBsYXp5bG9hZFNlbGVjdG9yID0gb3B0aW9ucy5sYXp5bG9hZFNlbGVjdG9yLFxuICAgICAgc2xpZGVQb3NpdGlvbnMsIC8vIGNvbGxlY3Rpb24gb2Ygc2xpZGUgcG9zaXRpb25zXG4gICAgICBzbGlkZUl0ZW1zT3V0ID0gW10sXG4gICAgICBjbG9uZUNvdW50ID0gbG9vcCA/IGdldENsb25lQ291bnRGb3JMb29wKCkgOiAwLFxuICAgICAgc2xpZGVDb3VudE5ldyA9ICFjYXJvdXNlbCA/IHNsaWRlQ291bnQgKyBjbG9uZUNvdW50IDogc2xpZGVDb3VudCArIGNsb25lQ291bnQgKiAyLFxuICAgICAgaGFzUmlnaHREZWFkWm9uZSA9IChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkgJiYgIWxvb3AgPyB0cnVlIDogZmFsc2UsXG4gICAgICByaWdodEJvdW5kYXJ5ID0gZml4ZWRXaWR0aCA/IGdldFJpZ2h0Qm91bmRhcnkoKSA6IG51bGwsXG4gICAgICB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSA9ICghY2Fyb3VzZWwgfHwgIWxvb3ApID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgLy8gdHJhbnNmb3JtXG4gICAgICB0cmFuc2Zvcm1BdHRyID0gaG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnLFxuICAgICAgdHJhbnNmb3JtUHJlZml4ID0gJycsXG4gICAgICB0cmFuc2Zvcm1Qb3N0Zml4ID0gJycsXG4gICAgICAvLyBpbmRleFxuICAgICAgZ2V0SW5kZXhNYXggPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIGNlbnRlciAmJiAhbG9vcCA/IHNsaWRlQ291bnQgLSAxIDogTWF0aC5jZWlsKC0gcmlnaHRCb3VuZGFyeSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSk7IH07XG4gICAgICAgIH0gZWxzZSBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcbiAgICAgICAgICAgICAgaWYgKHNsaWRlUG9zaXRpb25zW2ldID49IC0gcmlnaHRCb3VuZGFyeSkgeyByZXR1cm4gaTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNlbnRlciAmJiBjYXJvdXNlbCAmJiAhbG9vcCkge1xuICAgICAgICAgICAgICByZXR1cm4gc2xpZGVDb3VudCAtIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gbG9vcCB8fCBjYXJvdXNlbCA/IE1hdGgubWF4KDAsIHNsaWRlQ291bnROZXcgLSBNYXRoLmNlaWwoaXRlbXMpKSA6IHNsaWRlQ291bnROZXcgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgICBpbmRleCA9IGdldFN0YXJ0SW5kZXgoZ2V0T3B0aW9uKCdzdGFydEluZGV4JykpLFxuICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleCxcbiAgICAgIGRpc3BsYXlJbmRleCA9IGdldEN1cnJlbnRTbGlkZSgpLFxuICAgICAgaW5kZXhNaW4gPSAwLFxuICAgICAgaW5kZXhNYXggPSAhYXV0b1dpZHRoID8gZ2V0SW5kZXhNYXgoKSA6IG51bGwsXG4gICAgICAvLyByZXNpemVcbiAgICAgIHJlc2l6ZVRpbWVyLFxuICAgICAgcHJldmVudEFjdGlvbldoZW5SdW5uaW5nID0gb3B0aW9ucy5wcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcsXG4gICAgICBzd2lwZUFuZ2xlID0gb3B0aW9ucy5zd2lwZUFuZ2xlLFxuICAgICAgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gc3dpcGVBbmdsZSA/ICc/JyA6IHRydWUsXG4gICAgICBydW5uaW5nID0gZmFsc2UsXG4gICAgICBvbkluaXQgPSBvcHRpb25zLm9uSW5pdCxcbiAgICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKSxcbiAgICAgIC8vIGlkLCBjbGFzc1xuICAgICAgbmV3Q29udGFpbmVyQ2xhc3NlcyA9ICcgdG5zLXNsaWRlciB0bnMtJyArIG9wdGlvbnMubW9kZSxcbiAgICAgIHNsaWRlSWQgPSBjb250YWluZXIuaWQgfHwgZ2V0U2xpZGVJZCgpLFxuICAgICAgZGlzYWJsZSA9IGdldE9wdGlvbignZGlzYWJsZScpLFxuICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICAgIGZyZWV6YWJsZSA9IG9wdGlvbnMuZnJlZXphYmxlLFxuICAgICAgZnJlZXplID0gZnJlZXphYmxlICYmICFhdXRvV2lkdGggPyBnZXRGcmVlemUoKSA6IGZhbHNlLFxuICAgICAgZnJvemVuID0gZmFsc2UsXG4gICAgICBjb250cm9sc0V2ZW50cyA9IHtcbiAgICAgICAgJ2NsaWNrJzogb25Db250cm9sc0NsaWNrLFxuICAgICAgICAna2V5ZG93bic6IG9uQ29udHJvbHNLZXlkb3duXG4gICAgICB9LFxuICAgICAgbmF2RXZlbnRzID0ge1xuICAgICAgICAnY2xpY2snOiBvbk5hdkNsaWNrLFxuICAgICAgICAna2V5ZG93bic6IG9uTmF2S2V5ZG93blxuICAgICAgfSxcbiAgICAgIGhvdmVyRXZlbnRzID0ge1xuICAgICAgICAnbW91c2VvdmVyJzogbW91c2VvdmVyUGF1c2UsXG4gICAgICAgICdtb3VzZW91dCc6IG1vdXNlb3V0UmVzdGFydFxuICAgICAgfSxcbiAgICAgIHZpc2liaWxpdHlFdmVudCA9IHsndmlzaWJpbGl0eWNoYW5nZSc6IG9uVmlzaWJpbGl0eUNoYW5nZX0sXG4gICAgICBkb2NtZW50S2V5ZG93bkV2ZW50ID0geydrZXlkb3duJzogb25Eb2N1bWVudEtleWRvd259LFxuICAgICAgdG91Y2hFdmVudHMgPSB7XG4gICAgICAgICd0b3VjaHN0YXJ0Jzogb25QYW5TdGFydCxcbiAgICAgICAgJ3RvdWNobW92ZSc6IG9uUGFuTW92ZSxcbiAgICAgICAgJ3RvdWNoZW5kJzogb25QYW5FbmQsXG4gICAgICAgICd0b3VjaGNhbmNlbCc6IG9uUGFuRW5kXG4gICAgICB9LCBkcmFnRXZlbnRzID0ge1xuICAgICAgICAnbW91c2Vkb3duJzogb25QYW5TdGFydCxcbiAgICAgICAgJ21vdXNlbW92ZSc6IG9uUGFuTW92ZSxcbiAgICAgICAgJ21vdXNldXAnOiBvblBhbkVuZCxcbiAgICAgICAgJ21vdXNlbGVhdmUnOiBvblBhbkVuZFxuICAgICAgfSxcbiAgICAgIGhhc0NvbnRyb2xzID0gaGFzT3B0aW9uKCdjb250cm9scycpLFxuICAgICAgaGFzTmF2ID0gaGFzT3B0aW9uKCduYXYnKSxcbiAgICAgIG5hdkFzVGh1bWJuYWlscyA9IGF1dG9XaWR0aCA/IHRydWUgOiBvcHRpb25zLm5hdkFzVGh1bWJuYWlscyxcbiAgICAgIGhhc0F1dG9wbGF5ID0gaGFzT3B0aW9uKCdhdXRvcGxheScpLFxuICAgICAgaGFzVG91Y2ggPSBoYXNPcHRpb24oJ3RvdWNoJyksXG4gICAgICBoYXNNb3VzZURyYWcgPSBoYXNPcHRpb24oJ21vdXNlRHJhZycpLFxuICAgICAgc2xpZGVBY3RpdmVDbGFzcyA9ICd0bnMtc2xpZGUtYWN0aXZlJyxcbiAgICAgIGltZ0NvbXBsZXRlQ2xhc3MgPSAndG5zLWNvbXBsZXRlJyxcbiAgICAgIGltZ0V2ZW50cyA9IHtcbiAgICAgICAgJ2xvYWQnOiBvbkltZ0xvYWRlZCxcbiAgICAgICAgJ2Vycm9yJzogb25JbWdGYWlsZWRcbiAgICAgIH0sXG4gICAgICBpbWdzQ29tcGxldGUsXG4gICAgICBsaXZlcmVnaW9uQ3VycmVudCxcbiAgICAgIHByZXZlbnRTY3JvbGwgPSBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoID09PSAnZm9yY2UnID8gdHJ1ZSA6IGZhbHNlO1xuXG4gIC8vIGNvbnRyb2xzXG4gIGlmIChoYXNDb250cm9scykge1xuICAgIHZhciBjb250cm9sc0NvbnRhaW5lciA9IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIsXG4gICAgICAgIGNvbnRyb2xzQ29udGFpbmVySFRNTCA9IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgPyBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBwcmV2QnV0dG9uID0gb3B0aW9ucy5wcmV2QnV0dG9uLFxuICAgICAgICBuZXh0QnV0dG9uID0gb3B0aW9ucy5uZXh0QnV0dG9uLFxuICAgICAgICBwcmV2QnV0dG9uSFRNTCA9IG9wdGlvbnMucHJldkJ1dHRvbiA/IG9wdGlvbnMucHJldkJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgbmV4dEJ1dHRvbkhUTUwgPSBvcHRpb25zLm5leHRCdXR0b24gPyBvcHRpb25zLm5leHRCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIHByZXZJc0J1dHRvbixcbiAgICAgICAgbmV4dElzQnV0dG9uO1xuICB9XG5cbiAgLy8gbmF2XG4gIGlmIChoYXNOYXYpIHtcbiAgICB2YXIgbmF2Q29udGFpbmVyID0gb3B0aW9ucy5uYXZDb250YWluZXIsXG4gICAgICAgIG5hdkNvbnRhaW5lckhUTUwgPSBvcHRpb25zLm5hdkNvbnRhaW5lciA/IG9wdGlvbnMubmF2Q29udGFpbmVyLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBuYXZJdGVtcyxcbiAgICAgICAgcGFnZXMgPSBhdXRvV2lkdGggPyBzbGlkZUNvdW50IDogZ2V0UGFnZXMoKSxcbiAgICAgICAgcGFnZXNDYWNoZWQgPSAwLFxuICAgICAgICBuYXZDbGlja2VkID0gLTEsXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleCA9IGdldEN1cnJlbnROYXZJbmRleCgpLFxuICAgICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZDdXJyZW50SW5kZXgsXG4gICAgICAgIG5hdkFjdGl2ZUNsYXNzID0gJ3Rucy1uYXYtYWN0aXZlJyxcbiAgICAgICAgbmF2U3RyID0gJ0Nhcm91c2VsIFBhZ2UgJyxcbiAgICAgICAgbmF2U3RyQ3VycmVudCA9ICcgKEN1cnJlbnQgU2xpZGUpJztcbiAgfVxuXG4gIC8vIGF1dG9wbGF5XG4gIGlmIChoYXNBdXRvcGxheSkge1xuICAgIHZhciBhdXRvcGxheURpcmVjdGlvbiA9IG9wdGlvbnMuYXV0b3BsYXlEaXJlY3Rpb24gPT09ICdmb3J3YXJkJyA/IDEgOiAtMSxcbiAgICAgICAgYXV0b3BsYXlCdXR0b24gPSBvcHRpb25zLmF1dG9wbGF5QnV0dG9uLFxuICAgICAgICBhdXRvcGxheUJ1dHRvbkhUTUwgPSBvcHRpb25zLmF1dG9wbGF5QnV0dG9uID8gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgYXV0b3BsYXlIdG1sU3RyaW5ncyA9IFsnPHNwYW4gY2xhc3M9XFwndG5zLXZpc3VhbGx5LWhpZGRlblxcJz4nLCAnIGFuaW1hdGlvbjwvc3Bhbj4nXSxcbiAgICAgICAgYXV0b3BsYXlUaW1lcixcbiAgICAgICAgYW5pbWF0aW5nLFxuICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VkLFxuICAgICAgICBhdXRvcGxheVVzZXJQYXVzZWQsXG4gICAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZDtcbiAgfVxuXG4gIGlmIChoYXNUb3VjaCB8fCBoYXNNb3VzZURyYWcpIHtcbiAgICB2YXIgaW5pdFBvc2l0aW9uID0ge30sXG4gICAgICAgIGxhc3RQb3NpdGlvbiA9IHt9LFxuICAgICAgICB0cmFuc2xhdGVJbml0LFxuICAgICAgICBkaXNYLFxuICAgICAgICBkaXNZLFxuICAgICAgICBwYW5TdGFydCA9IGZhbHNlLFxuICAgICAgICByYWZJbmRleCxcbiAgICAgICAgZ2V0RGlzdCA9IGhvcml6b250YWwgPyBcbiAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnggLSBiLng7IH0gOlxuICAgICAgICAgIGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueSAtIGIueTsgfTtcbiAgfVxuICBcbiAgLy8gZGlzYWJsZSBzbGlkZXIgd2hlbiBzbGlkZWNvdW50IDw9IGl0ZW1zXG4gIGlmICghYXV0b1dpZHRoKSB7IHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7IH1cblxuICBpZiAoVFJBTlNGT1JNKSB7XG4gICAgdHJhbnNmb3JtQXR0ciA9IFRSQU5TRk9STTtcbiAgICB0cmFuc2Zvcm1QcmVmaXggPSAndHJhbnNsYXRlJztcblxuICAgIGlmIChIQVMzRFRSQU5TRk9STVMpIHtcbiAgICAgIHRyYW5zZm9ybVByZWZpeCArPSBob3Jpem9udGFsID8gJzNkKCcgOiAnM2QoMHB4LCAnO1xuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9IGhvcml6b250YWwgPyAnLCAwcHgsIDBweCknIDogJywgMHB4KSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zZm9ybVByZWZpeCArPSBob3Jpem9udGFsID8gJ1goJyA6ICdZKCc7XG4gICAgICB0cmFuc2Zvcm1Qb3N0Zml4ID0gJyknO1xuICAgIH1cblxuICB9XG5cbiAgaWYgKGNhcm91c2VsKSB7IGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoJ3Rucy12cGZpeCcsICcnKTsgfVxuICBpbml0U3RydWN0dXJlKCk7XG4gIGluaXRTaGVldCgpO1xuICBpbml0U2xpZGVyVHJhbnNmb3JtKCk7XG5cbiAgLy8gPT09IENPTU1PTiBGVU5DVElPTlMgPT09IC8vXG4gIGZ1bmN0aW9uIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZSAoY29uZGl0aW9uKSB7XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgY29udHJvbHMgPSBuYXYgPSB0b3VjaCA9IG1vdXNlRHJhZyA9IGFycm93S2V5cyA9IGF1dG9wbGF5ID0gYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRTbGlkZSAoKSB7XG4gICAgdmFyIHRlbSA9IGNhcm91c2VsID8gaW5kZXggLSBjbG9uZUNvdW50IDogaW5kZXg7XG4gICAgd2hpbGUgKHRlbSA8IDApIHsgdGVtICs9IHNsaWRlQ291bnQ7IH1cbiAgICByZXR1cm4gdGVtJXNsaWRlQ291bnQgKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U3RhcnRJbmRleCAoaW5kKSB7XG4gICAgaW5kID0gaW5kID8gTWF0aC5tYXgoMCwgTWF0aC5taW4obG9vcCA/IHNsaWRlQ291bnQgLSAxIDogc2xpZGVDb3VudCAtIGl0ZW1zLCBpbmQpKSA6IDA7XG4gICAgcmV0dXJuIGNhcm91c2VsID8gaW5kICsgY2xvbmVDb3VudCA6IGluZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFic0luZGV4IChpKSB7XG4gICAgaWYgKGkgPT0gbnVsbCkgeyBpID0gaW5kZXg7IH1cblxuICAgIGlmIChjYXJvdXNlbCkgeyBpIC09IGNsb25lQ291bnQ7IH1cbiAgICB3aGlsZSAoaSA8IDApIHsgaSArPSBzbGlkZUNvdW50OyB9XG5cbiAgICByZXR1cm4gTWF0aC5mbG9vcihpJXNsaWRlQ291bnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudE5hdkluZGV4ICgpIHtcbiAgICB2YXIgYWJzSW5kZXggPSBnZXRBYnNJbmRleCgpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICByZXN1bHQgPSBuYXZBc1RodW1ibmFpbHMgPyBhYnNJbmRleCA6IFxuICAgICAgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggPyBNYXRoLmNlaWwoKGFic0luZGV4ICsgMSkgKiBwYWdlcyAvIHNsaWRlQ291bnQgLSAxKSA6IFxuICAgICAgICAgIE1hdGguZmxvb3IoYWJzSW5kZXggLyBpdGVtcyk7XG5cbiAgICAvLyBzZXQgYWN0aXZlIG5hdiB0byB0aGUgbGFzdCBvbmUgd2hlbiByZWFjaGVzIHRoZSByaWdodCBlZGdlXG4gICAgaWYgKCFsb29wICYmIGNhcm91c2VsICYmIGluZGV4ID09PSBpbmRleE1heCkgeyByZXN1bHQgPSBwYWdlcyAtIDE7IH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJdGVtc01heCAoKSB7XG4gICAgLy8gZml4ZWRXaWR0aCBvciBhdXRvV2lkdGggd2hpbGUgdmlld3BvcnRNYXggaXMgbm90IGF2YWlsYWJsZVxuICAgIGlmIChhdXRvV2lkdGggfHwgKGZpeGVkV2lkdGggJiYgIXZpZXdwb3J0TWF4KSkge1xuICAgICAgcmV0dXJuIHNsaWRlQ291bnQgLSAxO1xuICAgIC8vIG1vc3QgY2FzZXNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0ciA9IGZpeGVkV2lkdGggPyAnZml4ZWRXaWR0aCcgOiAnaXRlbXMnLFxuICAgICAgICAgIGFyciA9IFtdO1xuXG4gICAgICBpZiAoZml4ZWRXaWR0aCB8fCBvcHRpb25zW3N0cl0gPCBzbGlkZUNvdW50KSB7IGFyci5wdXNoKG9wdGlvbnNbc3RyXSk7IH1cblxuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIHZhciB0ZW0gPSByZXNwb25zaXZlW2JwXVtzdHJdO1xuICAgICAgICAgIGlmICh0ZW0gJiYgKGZpeGVkV2lkdGggfHwgdGVtIDwgc2xpZGVDb3VudCkpIHsgYXJyLnB1c2godGVtKTsgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghYXJyLmxlbmd0aCkgeyBhcnIucHVzaCgwKTsgfVxuXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKGZpeGVkV2lkdGggPyB2aWV3cG9ydE1heCAvIE1hdGgubWluLmFwcGx5KG51bGwsIGFycikgOiBNYXRoLm1heC5hcHBseShudWxsLCBhcnIpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDbG9uZUNvdW50Rm9yTG9vcCAoKSB7XG4gICAgdmFyIGl0ZW1zTWF4ID0gZ2V0SXRlbXNNYXgoKSxcbiAgICAgICAgcmVzdWx0ID0gY2Fyb3VzZWwgPyBNYXRoLmNlaWwoKGl0ZW1zTWF4ICogNSAtIHNsaWRlQ291bnQpLzIpIDogKGl0ZW1zTWF4ICogNCAtIHNsaWRlQ291bnQpO1xuICAgIHJlc3VsdCA9IE1hdGgubWF4KGl0ZW1zTWF4LCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIGhhc09wdGlvbignZWRnZVBhZGRpbmcnKSA/IHJlc3VsdCArIDEgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRXaW5kb3dXaWR0aCAoKSB7XG4gICAgcmV0dXJuIHdpbi5pbm5lcldpZHRoIHx8IGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jLmJvZHkuY2xpZW50V2lkdGg7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbnNlcnRQb3NpdGlvbiAocG9zKSB7XG4gICAgcmV0dXJuIHBvcyA9PT0gJ3RvcCcgPyAnYWZ0ZXJiZWdpbicgOiAnYmVmb3JlZW5kJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENsaWVudFdpZHRoIChlbCkge1xuICAgIHZhciBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIHJlY3QsIHdpZHRoO1xuICAgIGVsLmFwcGVuZENoaWxkKGRpdik7XG4gICAgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB3aWR0aCA9IHJlY3QucmlnaHQgLSByZWN0LmxlZnQ7XG4gICAgZGl2LnJlbW92ZSgpO1xuICAgIHJldHVybiB3aWR0aCB8fCBnZXRDbGllbnRXaWR0aChlbC5wYXJlbnROb2RlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpZXdwb3J0V2lkdGggKCkge1xuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGVkZ2VQYWRkaW5nICogMiAtIGd1dHRlciA6IDA7XG4gICAgcmV0dXJuIGdldENsaWVudFdpZHRoKGNvbnRhaW5lclBhcmVudCkgLSBnYXA7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNPcHRpb24gKGl0ZW0pIHtcbiAgICBpZiAob3B0aW9uc1tpdGVtXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2l2ZVticF1baXRlbV0pIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGdldCBvcHRpb246XG4gIC8vIGZpeGVkIHdpZHRoOiB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyID0+IGl0ZW1zXG4gIC8vIG90aGVyczogd2luZG93IHdpZHRoID0+IGFsbCB2YXJpYWJsZXNcbiAgLy8gYWxsOiBpdGVtcyA9PiBzbGlkZUJ5XG4gIGZ1bmN0aW9uIGdldE9wdGlvbiAoaXRlbSwgd3cpIHtcbiAgICBpZiAod3cgPT0gbnVsbCkgeyB3dyA9IHdpbmRvd1dpZHRoOyB9XG5cbiAgICBpZiAoaXRlbSA9PT0gJ2l0ZW1zJyAmJiBmaXhlZFdpZHRoKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigodmlld3BvcnQgKyBndXR0ZXIpIC8gKGZpeGVkV2lkdGggKyBndXR0ZXIpKSB8fCAxO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXN1bHQgPSBvcHRpb25zW2l0ZW1dO1xuXG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgLy8gYnA6IGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgICAgIGlmICh3dyA+PSBwYXJzZUludChicCkpIHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluIHJlc3BvbnNpdmVbYnBdKSB7IHJlc3VsdCA9IHJlc3BvbnNpdmVbYnBdW2l0ZW1dOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtID09PSAnc2xpZGVCeScgJiYgcmVzdWx0ID09PSAncGFnZScpIHsgcmVzdWx0ID0gZ2V0T3B0aW9uKCdpdGVtcycpOyB9XG4gICAgICBpZiAoIWNhcm91c2VsICYmIChpdGVtID09PSAnc2xpZGVCeScgfHwgaXRlbSA9PT0gJ2l0ZW1zJykpIHsgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpOyB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVNYXJnaW5MZWZ0IChpKSB7XG4gICAgcmV0dXJuIENBTEMgPyBcbiAgICAgIENBTEMgKyAnKCcgKyBpICogMTAwICsgJyUgLyAnICsgc2xpZGVDb3VudE5ldyArICcpJyA6IFxuICAgICAgaSAqIDEwMCAvIHNsaWRlQ291bnROZXcgKyAnJSc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbm5lcldyYXBwZXJTdHlsZXMgKGVkZ2VQYWRkaW5nVGVtLCBndXR0ZXJUZW0sIGZpeGVkV2lkdGhUZW0sIHNwZWVkVGVtLCBhdXRvSGVpZ2h0QlApIHtcbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICBpZiAoZWRnZVBhZGRpbmdUZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nVGVtO1xuICAgICAgaWYgKGd1dHRlclRlbSkgeyBnYXAgLT0gZ3V0dGVyVGVtOyB9XG4gICAgICBzdHIgPSBob3Jpem9udGFsID9cbiAgICAgICAgJ21hcmdpbjogMCAnICsgZ2FwICsgJ3B4IDAgJyArIGVkZ2VQYWRkaW5nVGVtICsgJ3B4OycgOlxuICAgICAgICAnbWFyZ2luOiAnICsgZWRnZVBhZGRpbmdUZW0gKyAncHggMCAnICsgZ2FwICsgJ3B4IDA7JztcbiAgICB9IGVsc2UgaWYgKGd1dHRlclRlbSAmJiAhZml4ZWRXaWR0aFRlbSkge1xuICAgICAgdmFyIGd1dHRlclRlbVVuaXQgPSAnLScgKyBndXR0ZXJUZW0gKyAncHgnLFxuICAgICAgICAgIGRpciA9IGhvcml6b250YWwgPyBndXR0ZXJUZW1Vbml0ICsgJyAwIDAnIDogJzAgJyArIGd1dHRlclRlbVVuaXQgKyAnIDAnO1xuICAgICAgc3RyID0gJ21hcmdpbjogMCAnICsgZGlyICsgJzsnO1xuICAgIH1cblxuICAgIGlmICghY2Fyb3VzZWwgJiYgYXV0b0hlaWdodEJQICYmIFRSQU5TSVRJT05EVVJBVElPTiAmJiBzcGVlZFRlbSkgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRUZW0pOyB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbnRhaW5lcldpZHRoIChmaXhlZFdpZHRoVGVtLCBndXR0ZXJUZW0sIGl0ZW1zVGVtKSB7XG4gICAgaWYgKGZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHJldHVybiAoZml4ZWRXaWR0aFRlbSArIGd1dHRlclRlbSkgKiBzbGlkZUNvdW50TmV3ICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENBTEMgP1xuICAgICAgICBDQUxDICsgJygnICsgc2xpZGVDb3VudE5ldyAqIDEwMCArICclIC8gJyArIGl0ZW1zVGVtICsgJyknIDpcbiAgICAgICAgc2xpZGVDb3VudE5ldyAqIDEwMCAvIGl0ZW1zVGVtICsgJyUnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlV2lkdGhTdHlsZSAoZml4ZWRXaWR0aFRlbSwgZ3V0dGVyVGVtLCBpdGVtc1RlbSkge1xuICAgIHZhciB3aWR0aDtcblxuICAgIGlmIChmaXhlZFdpZHRoVGVtKSB7XG4gICAgICB3aWR0aCA9IChmaXhlZFdpZHRoVGVtICsgZ3V0dGVyVGVtKSArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2Fyb3VzZWwpIHsgaXRlbXNUZW0gPSBNYXRoLmZsb29yKGl0ZW1zVGVtKTsgfVxuICAgICAgdmFyIGRpdmlkZW5kID0gY2Fyb3VzZWwgPyBzbGlkZUNvdW50TmV3IDogaXRlbXNUZW07XG4gICAgICB3aWR0aCA9IENBTEMgPyBcbiAgICAgICAgQ0FMQyArICcoMTAwJSAvICcgKyBkaXZpZGVuZCArICcpJyA6IFxuICAgICAgICAxMDAgLyBkaXZpZGVuZCArICclJztcbiAgICB9XG5cbiAgICB3aWR0aCA9ICd3aWR0aDonICsgd2lkdGg7XG5cbiAgICAvLyBpbm5lciBzbGlkZXI6IG92ZXJ3cml0ZSBvdXRlciBzbGlkZXIgc3R5bGVzXG4gICAgcmV0dXJuIG5lc3RlZCAhPT0gJ2lubmVyJyA/IHdpZHRoICsgJzsnIDogd2lkdGggKyAnICFpbXBvcnRhbnQ7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlR3V0dGVyU3R5bGUgKGd1dHRlclRlbSkge1xuICAgIHZhciBzdHIgPSAnJztcblxuICAgIC8vIGd1dHRlciBtYXliZSBpbnRlcmdlciB8fCAwXG4gICAgLy8gc28gY2FuJ3QgdXNlICdpZiAoZ3V0dGVyKSdcbiAgICBpZiAoZ3V0dGVyVGVtICE9PSBmYWxzZSkge1xuICAgICAgdmFyIHByb3AgPSBob3Jpem9udGFsID8gJ3BhZGRpbmctJyA6ICdtYXJnaW4tJyxcbiAgICAgICAgICBkaXIgPSBob3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nO1xuICAgICAgc3RyID0gcHJvcCArICBkaXIgKyAnOiAnICsgZ3V0dGVyVGVtICsgJ3B4Oyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENTU1ByZWZpeCAobmFtZSwgbnVtKSB7XG4gICAgdmFyIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoIC0gbnVtKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChwcmVmaXgpIHsgcHJlZml4ID0gJy0nICsgcHJlZml4ICsgJy0nOyB9XG5cbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XG4gICAgcmV0dXJuIGdldENTU1ByZWZpeChUUkFOU0lUSU9ORFVSQVRJT04sIDE4KSArICd0cmFuc2l0aW9uLWR1cmF0aW9uOicgKyBzcGVlZCAvIDEwMDAgKyAnczsnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZSAoc3BlZWQpIHtcbiAgICByZXR1cm4gZ2V0Q1NTUHJlZml4KEFOSU1BVElPTkRVUkFUSU9OLCAxNykgKyAnYW5pbWF0aW9uLWR1cmF0aW9uOicgKyBzcGVlZCAvIDEwMDAgKyAnczsnO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFN0cnVjdHVyZSAoKSB7XG4gICAgdmFyIGNsYXNzT3V0ZXIgPSAndG5zLW91dGVyJyxcbiAgICAgICAgY2xhc3NJbm5lciA9ICd0bnMtaW5uZXInLFxuICAgICAgICBoYXNHdXR0ZXIgPSBoYXNPcHRpb24oJ2d1dHRlcicpO1xuXG4gICAgb3V0ZXJXcmFwcGVyLmNsYXNzTmFtZSA9IGNsYXNzT3V0ZXI7XG4gICAgaW5uZXJXcmFwcGVyLmNsYXNzTmFtZSA9IGNsYXNzSW5uZXI7XG4gICAgb3V0ZXJXcmFwcGVyLmlkID0gc2xpZGVJZCArICctb3cnO1xuICAgIGlubmVyV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLWl3JztcblxuICAgIC8vIHNldCBjb250YWluZXIgcHJvcGVydGllc1xuICAgIGlmIChjb250YWluZXIuaWQgPT09ICcnKSB7IGNvbnRhaW5lci5pZCA9IHNsaWRlSWQ7IH1cbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9IFBFUkNFTlRBR0VMQVlPVVQgfHwgYXV0b1dpZHRoID8gJyB0bnMtc3VicGl4ZWwnIDogJyB0bnMtbm8tc3VicGl4ZWwnO1xuICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gQ0FMQyA/ICcgdG5zLWNhbGMnIDogJyB0bnMtbm8tY2FsYyc7XG4gICAgaWYgKGF1dG9XaWR0aCkgeyBuZXdDb250YWluZXJDbGFzc2VzICs9ICcgdG5zLWF1dG93aWR0aCc7IH1cbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9ICcgdG5zLScgKyBvcHRpb25zLmF4aXM7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSArPSBuZXdDb250YWluZXJDbGFzc2VzO1xuXG4gICAgLy8gYWRkIGNvbnN0cmFpbiBsYXllciBmb3IgY2Fyb3VzZWxcbiAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgIG1pZGRsZVdyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtaWRkbGVXcmFwcGVyLmlkID0gc2xpZGVJZCArICctbXcnO1xuICAgICAgbWlkZGxlV3JhcHBlci5jbGFzc05hbWUgPSAndG5zLW92aCc7XG5cbiAgICAgIG91dGVyV3JhcHBlci5hcHBlbmRDaGlsZChtaWRkbGVXcmFwcGVyKTtcbiAgICAgIG1pZGRsZVdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJXcmFwcGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ZXJXcmFwcGVyLmFwcGVuZENoaWxkKGlubmVyV3JhcHBlcik7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9IZWlnaHQpIHtcbiAgICAgIHZhciB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xuICAgICAgd3AuY2xhc3NOYW1lICs9ICcgdG5zLWFoJztcbiAgICB9XG5cbiAgICBjb250YWluZXJQYXJlbnQuaW5zZXJ0QmVmb3JlKG91dGVyV3JhcHBlciwgY29udGFpbmVyKTtcbiAgICBpbm5lcldyYXBwZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgIC8vIGFkZCBpZCwgY2xhc3MsIGFyaWEgYXR0cmlidXRlcyBcbiAgICAvLyBiZWZvcmUgY2xvbmUgc2xpZGVzXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICBhZGRDbGFzcyhpdGVtLCAndG5zLWl0ZW0nKTtcbiAgICAgIGlmICghaXRlbS5pZCkgeyBpdGVtLmlkID0gc2xpZGVJZCArICctaXRlbScgKyBpOyB9XG4gICAgICBpZiAoIWNhcm91c2VsICYmIGFuaW1hdGVOb3JtYWwpIHsgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7IH1cbiAgICAgIHNldEF0dHJzKGl0ZW0sIHtcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vICMjIGNsb25lIHNsaWRlc1xuICAgIC8vIGNhcm91c2VsOiBuICsgc2xpZGVzICsgblxuICAgIC8vIGdhbGxlcnk6ICAgICAgc2xpZGVzICsgblxuICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICB2YXIgZnJhZ21lbnRCZWZvcmUgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCBcbiAgICAgICAgICBmcmFnbWVudEFmdGVyID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgdmFyIG51bSA9IGolc2xpZGVDb3VudCxcbiAgICAgICAgICAgIGNsb25lRmlyc3QgPSBzbGlkZUl0ZW1zW251bV0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICByZW1vdmVBdHRycyhjbG9uZUZpcnN0LCAnaWQnKTtcbiAgICAgICAgZnJhZ21lbnRBZnRlci5pbnNlcnRCZWZvcmUoY2xvbmVGaXJzdCwgZnJhZ21lbnRBZnRlci5maXJzdENoaWxkKTtcblxuICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICB2YXIgY2xvbmVMYXN0ID0gc2xpZGVJdGVtc1tzbGlkZUNvdW50IC0gMSAtIG51bV0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIHJlbW92ZUF0dHJzKGNsb25lTGFzdCwgJ2lkJyk7XG4gICAgICAgICAgZnJhZ21lbnRCZWZvcmUuYXBwZW5kQ2hpbGQoY2xvbmVMYXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKGZyYWdtZW50QmVmb3JlLCBjb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnRBZnRlcik7XG4gICAgICBzbGlkZUl0ZW1zID0gY29udGFpbmVyLmNoaWxkcmVuO1xuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybSAoKSB7XG4gICAgLy8gIyMgaW1hZ2VzIGxvYWRlZC9mYWlsZWRcbiAgICBpZiAoaGFzT3B0aW9uKCdhdXRvSGVpZ2h0JykgfHwgYXV0b1dpZHRoIHx8ICFob3Jpem9udGFsKSB7XG4gICAgICB2YXIgaW1ncyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKTtcblxuICAgICAgLy8gYWRkIGNvbXBsZXRlIGNsYXNzIGlmIGFsbCBpbWFnZXMgYXJlIGxvYWRlZC9mYWlsZWRcbiAgICAgIGZvckVhY2goaW1ncywgZnVuY3Rpb24oaW1nKSB7XG4gICAgICAgIHZhciBzcmMgPSBpbWcuc3JjO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNyYyAmJiBzcmMuaW5kZXhPZignZGF0YTppbWFnZScpIDwgMCkge1xuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG4gICAgICAgICAgaW1nLnNyYyA9ICcnO1xuICAgICAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgICAgICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgICAgICB9IGVsc2UgaWYgKCFsYXp5bG9hZCkge1xuICAgICAgICAgIGltZ0xvYWRlZChpbWcpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gQWxsIGltZ3MgYXJlIGNvbXBsZXRlZFxuICAgICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhhcnJheUZyb21Ob2RlTGlzdChpbWdzKSwgZnVuY3Rpb24oKSB7IGltZ3NDb21wbGV0ZSA9IHRydWU7IH0pOyB9KTtcblxuICAgICAgLy8gQ2hlY2sgaW1ncyBpbiB3aW5kb3cgb25seSBmb3IgYXV0byBoZWlnaHRcbiAgICAgIGlmICghYXV0b1dpZHRoICYmIGhvcml6b250YWwpIHsgaW1ncyA9IGdldEltYWdlQXJyYXkoaW5kZXgsIE1hdGgubWluKGluZGV4ICsgaXRlbXMgLSAxLCBzbGlkZUNvdW50TmV3IC0gMSkpOyB9XG5cbiAgICAgIGxhenlsb2FkID8gaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2soKSA6IHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soYXJyYXlGcm9tTm9kZUxpc3QoaW1ncyksIGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrKTsgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2V0IGNvbnRhaW5lciB0cmFuc2Zvcm0gcHJvcGVydHlcbiAgICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XG5cbiAgICAgIC8vIHVwZGF0ZSBzbGlkZXIgdG9vbHMgYW5kIGV2ZW50c1xuICAgICAgaW5pdFRvb2xzKCk7XG4gICAgICBpbml0RXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2sgKCkge1xuICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgIC8vIGNoZWNrIHN0eWxlcyBhcHBsaWNhdGlvblxuICAgICAgdmFyIG51bSA9IGxvb3AgPyBpbmRleCA6IHNsaWRlQ291bnQgLSAxO1xuICAgICAgKGZ1bmN0aW9uIHN0eWxlc0FwcGxpY2F0aW9uQ2hlY2soKSB7XG4gICAgICAgIHNsaWRlSXRlbXNbbnVtIC0gMV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQudG9GaXhlZCgyKSA9PT0gc2xpZGVJdGVtc1tudW1dLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQudG9GaXhlZCgyKSA/XG4gICAgICAgIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlKCkgOlxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHN0eWxlc0FwcGxpY2F0aW9uQ2hlY2soKTsgfSwgMTYpO1xuICAgICAgfSkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUoKTtcbiAgICB9XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlICgpIHtcbiAgICAvLyBydW4gRm4oKXMgd2hpY2ggYXJlIHJlbHkgb24gaW1hZ2UgbG9hZGluZ1xuICAgIGlmICghaG9yaXpvbnRhbCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIHNldFNsaWRlUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgcmlnaHRCb3VuZGFyeSA9IGdldFJpZ2h0Qm91bmRhcnkoKTtcbiAgICAgICAgaWYgKGZyZWV6YWJsZSkgeyBmcmVlemUgPSBnZXRGcmVlemUoKTsgfVxuICAgICAgICBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IC8vIDw9IHNsaWRlUG9zaXRpb25zLCByaWdodEJvdW5kYXJ5IDw9XG4gICAgICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNldCBjb250YWluZXIgdHJhbnNmb3JtIHByb3BlcnR5XG4gICAgaWYgKGNhcm91c2VsKSB7IGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7IH1cblxuICAgIC8vIHVwZGF0ZSBzbGlkZXIgdG9vbHMgYW5kIGV2ZW50c1xuICAgIGluaXRUb29scygpO1xuICAgIGluaXRFdmVudHMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTaGVldCAoKSB7XG4gICAgLy8gZ2FsbGVyeTpcbiAgICAvLyBzZXQgYW5pbWF0aW9uIGNsYXNzZXMgYW5kIGxlZnQgdmFsdWUgZm9yIGdhbGxlcnkgc2xpZGVyXG4gICAgaWYgKCFjYXJvdXNlbCkgeyBcbiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbCA9IGluZGV4ICsgTWF0aC5taW4oc2xpZGVDb3VudCwgaXRlbXMpOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gIyMjIyBMQVlPVVRcblxuICAgIC8vICMjIElOTElORS1CTE9DSyBWUyBGTE9BVFxuXG4gICAgLy8gIyMgUGVyY2VudGFnZUxheW91dDpcbiAgICAvLyBzbGlkZXM6IGlubGluZS1ibG9ja1xuICAgIC8vIHJlbW92ZSBibGFuayBzcGFjZSBiZXR3ZWVuIHNsaWRlcyBieSBzZXQgZm9udC1zaXplOiAwXG5cbiAgICAvLyAjIyBOb24gUGVyY2VudGFnZUxheW91dDpcbiAgICAvLyBzbGlkZXM6IGZsb2F0XG4gICAgLy8gICAgICAgICBtYXJnaW4tcmlnaHQ6IC0xMDAlXG4gICAgLy8gICAgICAgICBtYXJnaW4tbGVmdDogflxuXG4gICAgLy8gUmVzb3VyY2U6IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzE0N3VwMjQ1d3dUWGVRWXZlM0JSU0FENG9WY3ZRbXVHc0Z0ZUpPZUE1eE5RL2VkaXQ/dXNwPXNoYXJpbmdcbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgaWYgKFBFUkNFTlRBR0VMQVlPVVQgfHwgYXV0b1dpZHRoKSB7XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgJ2ZvbnQtc2l6ZTonICsgd2luLmdldENvbXB1dGVkU3R5bGUoc2xpZGVJdGVtc1swXSkuZm9udFNpemUgKyAnOycsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQsICdmb250LXNpemU6MDsnLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfSBlbHNlIGlmIChjYXJvdXNlbCkge1xuICAgICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uIChzbGlkZSwgaSkge1xuICAgICAgICAgIHNsaWRlLnN0eWxlLm1hcmdpbkxlZnQgPSBnZXRTbGlkZU1hcmdpbkxlZnQoaSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gIyMgQkFTSUMgU1RZTEVTXG4gICAgaWYgKENTU01RKSB7XG4gICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZVxuICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikge1xuICAgICAgICB2YXIgc3RyID0gbWlkZGxlV3JhcHBlciAmJiBvcHRpb25zLmF1dG9IZWlnaHQgPyBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShvcHRpb25zLnNwZWVkKSA6ICcnO1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJy1tdycsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgIHN0ciA9IGdldElubmVyV3JhcHBlclN0eWxlcyhvcHRpb25zLmVkZ2VQYWRkaW5nLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLnNwZWVkLCBvcHRpb25zLmF1dG9IZWlnaHQpO1xuICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICctaXcnLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG5cbiAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcbiAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyAnd2lkdGg6JyArIGdldENvbnRhaW5lcldpZHRoKG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuaXRlbXMpICsgJzsnIDogJyc7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNsaWRlIHN0eWxlc1xuICAgICAgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gZ2V0U2xpZGVXaWR0aFN0eWxlKG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuaXRlbXMpIDogJyc7XG4gICAgICBpZiAob3B0aW9ucy5ndXR0ZXIpIHsgc3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUob3B0aW9ucy5ndXR0ZXIpOyB9XG4gICAgICAvLyBzZXQgZ2FsbGVyeSBpdGVtcyB0cmFuc2l0aW9uLWR1cmF0aW9uXG4gICAgICBpZiAoIWNhcm91c2VsKSB7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgICBpZiAoQU5JTUFUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XG4gICAgICB9XG4gICAgICBpZiAoc3RyKSB7IGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpOyB9XG5cbiAgICAvLyBub24gQ1NTIG1lZGlhcXVlcmllczogSUU4XG4gICAgLy8gIyMgdXBkYXRlIGlubmVyIHdyYXBwZXIsIGNvbnRhaW5lciwgc2xpZGVzIGlmIG5lZWRlZFxuICAgIC8vIHNldCBpbmxpbmUgc3R5bGVzIGZvciBpbm5lciB3cmFwcGVyICYgY29udGFpbmVyXG4gICAgLy8gaW5zZXJ0IHN0eWxlc2hlZXQgKG9uZSBsaW5lKSBmb3Igc2xpZGVzIG9ubHkgKHNpbmNlIHNsaWRlcyBhcmUgbWFueSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXG4gICAgICB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbigpO1xuXG4gICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgaW5uZXJXcmFwcGVyLnN0eWxlLmNzc1RleHQgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmcsIGd1dHRlciwgZml4ZWRXaWR0aCwgYXV0b0hlaWdodCk7XG5cbiAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcbiAgICAgIGlmIChjYXJvdXNlbCAmJiBob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNsaWRlIHN0eWxlc1xuICAgICAgdmFyIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKSA6ICcnO1xuICAgICAgaWYgKGd1dHRlcikgeyBzdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXIpOyB9XG5cbiAgICAgIC8vIGFwcGVuZCB0byB0aGUgbGFzdCBsaW5lXG4gICAgICBpZiAoc3RyKSB7IGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpOyB9XG4gICAgfVxuXG4gICAgLy8gIyMgTUVESUFRVUVSSUVTXG4gICAgaWYgKHJlc3BvbnNpdmUgJiYgQ1NTTVEpIHtcbiAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgLy8gYnA6IGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgICBicCA9IHBhcnNlSW50KGJwKTtcblxuICAgICAgICB2YXIgb3B0cyA9IHJlc3BvbnNpdmVbYnBdLFxuICAgICAgICAgICAgc3RyID0gJycsXG4gICAgICAgICAgICBtaWRkbGVXcmFwcGVyU3RyID0gJycsXG4gICAgICAgICAgICBpbm5lcldyYXBwZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICcnLFxuICAgICAgICAgICAgc2xpZGVTdHIgPSAnJyxcbiAgICAgICAgICAgIGl0ZW1zQlAgPSAhYXV0b1dpZHRoID8gZ2V0T3B0aW9uKCdpdGVtcycsIGJwKSA6IG51bGwsXG4gICAgICAgICAgICBmaXhlZFdpZHRoQlAgPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnLCBicCksXG4gICAgICAgICAgICBzcGVlZEJQID0gZ2V0T3B0aW9uKCdzcGVlZCcsIGJwKSxcbiAgICAgICAgICAgIGVkZ2VQYWRkaW5nQlAgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJywgYnApLFxuICAgICAgICAgICAgYXV0b0hlaWdodEJQID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JywgYnApLFxuICAgICAgICAgICAgZ3V0dGVyQlAgPSBnZXRPcHRpb24oJ2d1dHRlcicsIGJwKTtcblxuICAgICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHJpbmdcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiAmJiBtaWRkbGVXcmFwcGVyICYmIGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBtaWRkbGVXcmFwcGVyU3RyID0gJyMnICsgc2xpZGVJZCArICctbXd7JyArIGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApICsgJ30nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHJpbmdcbiAgICAgICAgaWYgKCdlZGdlUGFkZGluZycgaW4gb3B0cyB8fCAnZ3V0dGVyJyBpbiBvcHRzKSB7XG4gICAgICAgICAgaW5uZXJXcmFwcGVyU3RyID0gJyMnICsgc2xpZGVJZCArICctaXd7JyArIGdldElubmVyV3JhcHBlclN0eWxlcyhlZGdlUGFkZGluZ0JQLCBndXR0ZXJCUCwgZml4ZWRXaWR0aEJQLCBzcGVlZEJQLCBhdXRvSGVpZ2h0QlApICsgJ30nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29udGFpbmVyIHN0cmluZ1xuICAgICAgICBpZiAoY2Fyb3VzZWwgJiYgaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoICYmICgnZml4ZWRXaWR0aCcgaW4gb3B0cyB8fCAnaXRlbXMnIGluIG9wdHMgfHwgKGZpeGVkV2lkdGggJiYgJ2d1dHRlcicgaW4gb3B0cykpKSB7XG4gICAgICAgICAgY29udGFpbmVyU3RyID0gJ3dpZHRoOicgKyBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoQlAsIGd1dHRlckJQLCBpdGVtc0JQKSArICc7JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OICYmICdzcGVlZCcgaW4gb3B0cykge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udGFpbmVyU3RyKSB7XG4gICAgICAgICAgY29udGFpbmVyU3RyID0gJyMnICsgc2xpZGVJZCArICd7JyArIGNvbnRhaW5lclN0ciArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNsaWRlIHN0cmluZ1xuICAgICAgICBpZiAoJ2ZpeGVkV2lkdGgnIGluIG9wdHMgfHwgKGZpeGVkV2lkdGggJiYgJ2d1dHRlcicgaW4gb3B0cykgfHwgIWNhcm91c2VsICYmICdpdGVtcycgaW4gb3B0cykge1xuICAgICAgICAgIHNsaWRlU3RyICs9IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoQlAsIGd1dHRlckJQLCBpdGVtc0JQKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2d1dHRlcicgaW4gb3B0cykge1xuICAgICAgICAgIHNsaWRlU3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyQlApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBnYWxsZXJ5IGl0ZW1zIHRyYW5zaXRpb24tZHVyYXRpb25cbiAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHNsaWRlU3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApOyB9XG4gICAgICAgICAgaWYgKEFOSU1BVElPTkRVUkFUSU9OKSB7IHNsaWRlU3RyICs9IGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2xpZGVTdHIpIHsgc2xpZGVTdHIgPSAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbXsnICsgc2xpZGVTdHIgKyAnfSc7IH1cblxuICAgICAgICAvLyBhZGQgdXBcbiAgICAgICAgc3RyID0gbWlkZGxlV3JhcHBlclN0ciArIGlubmVyV3JhcHBlclN0ciArIGNvbnRhaW5lclN0ciArIHNsaWRlU3RyO1xuXG4gICAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgICBzaGVldC5pbnNlcnRSdWxlKCdAbWVkaWEgKG1pbi13aWR0aDogJyArIGJwIC8gMTYgKyAnZW0pIHsnICsgc3RyICsgJ30nLCBzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFRvb2xzICgpIHtcbiAgICAvLyA9PSBzbGlkZXMgPT1cbiAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xuXG4gICAgLy8gPT0gbGl2ZSByZWdpb24gPT1cbiAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgJzxkaXYgY2xhc3M9XCJ0bnMtbGl2ZXJlZ2lvbiB0bnMtdmlzdWFsbHktaGlkZGVuXCIgYXJpYS1saXZlPVwicG9saXRlXCIgYXJpYS1hdG9taWM9XCJ0cnVlXCI+c2xpZGUgPHNwYW4gY2xhc3M9XCJjdXJyZW50XCI+JyArIGdldExpdmVSZWdpb25TdHIoKSArICc8L3NwYW4+ICBvZiAnICsgc2xpZGVDb3VudCArICc8L2Rpdj4nKTtcbiAgICBsaXZlcmVnaW9uQ3VycmVudCA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcudG5zLWxpdmVyZWdpb24gLmN1cnJlbnQnKTtcblxuICAgIC8vID09IGF1dG9wbGF5SW5pdCA9PVxuICAgIGlmIChoYXNBdXRvcGxheSkge1xuICAgICAgdmFyIHR4dCA9IGF1dG9wbGF5ID8gJ3N0b3AnIDogJ3N0YXJ0JztcbiAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikge1xuICAgICAgICBzZXRBdHRycyhhdXRvcGxheUJ1dHRvbiwgeydkYXRhLWFjdGlvbic6IHR4dH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmF1dG9wbGF5QnV0dG9uT3V0cHV0KSB7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5hdXRvcGxheVBvc2l0aW9uKSwgJzxidXR0b24gZGF0YS1hY3Rpb249XCInICsgdHh0ICsgJ1wiPicgKyBhdXRvcGxheUh0bWxTdHJpbmdzWzBdICsgdHh0ICsgYXV0b3BsYXlIdG1sU3RyaW5nc1sxXSArIGF1dG9wbGF5VGV4dFswXSArICc8L2J1dHRvbj4nKTtcbiAgICAgICAgYXV0b3BsYXlCdXR0b24gPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uXScpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgZXZlbnRcbiAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikge1xuICAgICAgICBhZGRFdmVudHMoYXV0b3BsYXlCdXR0b24sIHsnY2xpY2snOiB0b2dnbGVBdXRvcGxheX0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgICAgc3RhcnRBdXRvcGxheSgpO1xuICAgICAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTsgfVxuICAgICAgICBpZiAoYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSkgeyBhZGRFdmVudHMoY29udGFpbmVyLCB2aXNpYmlsaXR5RXZlbnQpOyB9XG4gICAgICB9XG4gICAgfVxuIFxuICAgIC8vID09IG5hdkluaXQgPT1cbiAgICBpZiAoaGFzTmF2KSB7XG4gICAgICB2YXIgaW5pdEluZGV4ID0gIWNhcm91c2VsID8gMCA6IGNsb25lQ291bnQ7XG4gICAgICAvLyBjdXN0b21pemVkIG5hdlxuICAgICAgLy8gd2lsbCBub3QgaGlkZSB0aGUgbmF2cyBpbiBjYXNlIHRoZXkncmUgdGh1bWJuYWlsc1xuICAgICAgaWYgKG5hdkNvbnRhaW5lcikge1xuICAgICAgICBzZXRBdHRycyhuYXZDb250YWluZXIsIHsnYXJpYS1sYWJlbCc6ICdDYXJvdXNlbCBQYWdpbmF0aW9uJ30pO1xuICAgICAgICBuYXZJdGVtcyA9IG5hdkNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICAgICAgZm9yRWFjaChuYXZJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgIHNldEF0dHJzKGl0ZW0sIHtcbiAgICAgICAgICAgICdkYXRhLW5hdic6IGksXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAoaSArIDEpLFxuICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzbGlkZUlkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgLy8gZ2VuZXJhdGVkIG5hdiBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuYXZIdG1sID0gJycsXG4gICAgICAgICAgICBoaWRkZW5TdHIgPSBuYXZBc1RodW1ibmFpbHMgPyAnJyA6ICdzdHlsZT1cImRpc3BsYXk6bm9uZVwiJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAvLyBoaWRlIG5hdiBpdGVtcyBieSBkZWZhdWx0XG4gICAgICAgICAgbmF2SHRtbCArPSAnPGJ1dHRvbiBkYXRhLW5hdj1cIicgKyBpICsnXCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArICdcIiAnICsgaGlkZGVuU3RyICsgJyBhcmlhLWxhYmVsPVwiJyArIG5hdlN0ciArIChpICsgMSkgKydcIj48L2J1dHRvbj4nO1xuICAgICAgICB9XG4gICAgICAgIG5hdkh0bWwgPSAnPGRpdiBjbGFzcz1cInRucy1uYXZcIiBhcmlhLWxhYmVsPVwiQ2Fyb3VzZWwgUGFnaW5hdGlvblwiPicgKyBuYXZIdG1sICsgJzwvZGl2Pic7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5uYXZQb3NpdGlvbiksIG5hdkh0bWwpO1xuXG4gICAgICAgIG5hdkNvbnRhaW5lciA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcudG5zLW5hdicpO1xuICAgICAgICBuYXZJdGVtcyA9IG5hdkNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlTmF2VmlzaWJpbGl0eSgpO1xuXG4gICAgICAvLyBhZGQgdHJhbnNpdGlvblxuICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikge1xuICAgICAgICB2YXIgcHJlZml4ID0gVFJBTlNJVElPTkRVUkFUSU9OLnN1YnN0cmluZygwLCBUUkFOU0lUSU9ORFVSQVRJT04ubGVuZ3RoIC0gMTgpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICBzdHIgPSAndHJhbnNpdGlvbjogYWxsICcgKyBzcGVlZCAvIDEwMDAgKyAncyc7XG5cbiAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgIHN0ciA9ICctJyArIHByZWZpeCArICctJyArIHN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICdbYXJpYS1jb250cm9sc149JyArIHNsaWRlSWQgKyAnLWl0ZW1dJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICBzZXRBdHRycyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCB7J2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAobmF2Q3VycmVudEluZGV4ICsgMSkgKyBuYXZTdHJDdXJyZW50fSk7XG4gICAgICByZW1vdmVBdHRycyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCAndGFiaW5kZXgnKTtcbiAgICAgIGFkZENsYXNzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sIG5hdkFjdGl2ZUNsYXNzKTtcblxuICAgICAgLy8gYWRkIGV2ZW50c1xuICAgICAgYWRkRXZlbnRzKG5hdkNvbnRhaW5lciwgbmF2RXZlbnRzKTtcbiAgICB9XG5cblxuXG4gICAgLy8gPT0gY29udHJvbHNJbml0ID09XG4gICAgaWYgKGhhc0NvbnRyb2xzKSB7XG4gICAgICBpZiAoIWNvbnRyb2xzQ29udGFpbmVyICYmICghcHJldkJ1dHRvbiB8fCAhbmV4dEJ1dHRvbikpIHtcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLmNvbnRyb2xzUG9zaXRpb24pLCAnPGRpdiBjbGFzcz1cInRucy1jb250cm9sc1wiIGFyaWEtbGFiZWw9XCJDYXJvdXNlbCBOYXZpZ2F0aW9uXCIgdGFiaW5kZXg9XCIwXCI+PGJ1dHRvbiBkYXRhLWNvbnRyb2xzPVwicHJldlwiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKydcIj4nICsgY29udHJvbHNUZXh0WzBdICsgJzwvYnV0dG9uPjxidXR0b24gZGF0YS1jb250cm9scz1cIm5leHRcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsnXCI+JyArIGNvbnRyb2xzVGV4dFsxXSArICc8L2J1dHRvbj48L2Rpdj4nKTtcblxuICAgICAgICBjb250cm9sc0NvbnRhaW5lciA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcudG5zLWNvbnRyb2xzJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcHJldkJ1dHRvbiB8fCAhbmV4dEJ1dHRvbikge1xuICAgICAgICBwcmV2QnV0dG9uID0gY29udHJvbHNDb250YWluZXIuY2hpbGRyZW5bMF07XG4gICAgICAgIG5leHRCdXR0b24gPSBjb250cm9sc0NvbnRhaW5lci5jaGlsZHJlblsxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgc2V0QXR0cnMoY29udHJvbHNDb250YWluZXIsIHtcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6ICdDYXJvdXNlbCBOYXZpZ2F0aW9uJyxcbiAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyIHx8IChvcHRpb25zLnByZXZCdXR0b24gJiYgb3B0aW9ucy5uZXh0QnV0dG9uKSkge1xuICAgICAgICBzZXRBdHRycyhbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0sIHtcbiAgICAgICAgICAnYXJpYS1jb250cm9scyc6IHNsaWRlSWQsXG4gICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyIHx8IChvcHRpb25zLnByZXZCdXR0b24gJiYgb3B0aW9ucy5uZXh0QnV0dG9uKSkge1xuICAgICAgICBzZXRBdHRycyhwcmV2QnV0dG9uLCB7J2RhdGEtY29udHJvbHMnIDogJ3ByZXYnfSk7XG4gICAgICAgIHNldEF0dHJzKG5leHRCdXR0b24sIHsnZGF0YS1jb250cm9scycgOiAnbmV4dCd9KTtcbiAgICAgIH1cblxuICAgICAgcHJldklzQnV0dG9uID0gaXNCdXR0b24ocHJldkJ1dHRvbik7XG4gICAgICBuZXh0SXNCdXR0b24gPSBpc0J1dHRvbihuZXh0QnV0dG9uKTtcblxuICAgICAgdXBkYXRlQ29udHJvbHNTdGF0dXMoKTtcblxuICAgICAgLy8gYWRkIGV2ZW50c1xuICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIGFkZEV2ZW50cyhjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNFdmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkRXZlbnRzKHByZXZCdXR0b24sIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgICAgYWRkRXZlbnRzKG5leHRCdXR0b24sIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBoaWRlIHRvb2xzIGlmIG5lZWRlZFxuICAgIGRpc2FibGVVSSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEV2ZW50cyAoKSB7XG4gICAgLy8gYWRkIGV2ZW50c1xuICAgIGlmIChjYXJvdXNlbCAmJiBUUkFOU0lUSU9ORU5EKSB7XG4gICAgICB2YXIgZXZlID0ge307XG4gICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XG4gICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBldmUpO1xuICAgIH1cblxuICAgIGlmICh0b3VjaCkgeyBhZGRFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cywgb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCk7IH1cbiAgICBpZiAobW91c2VEcmFnKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpOyB9XG4gICAgaWYgKGFycm93S2V5cykgeyBhZGRFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTsgfVxuXG4gICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykge1xuICAgICAgZXZlbnRzLm9uKCdvdXRlclJlc2l6ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2l6ZVRhc2tzKCk7XG4gICAgICAgIGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNpdmUgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggfHwgYXV0b0hlaWdodCB8fCAhaG9yaXpvbnRhbCkge1xuICAgICAgYWRkRXZlbnRzKHdpbiwgeydyZXNpemUnOiBvblJlc2l6ZX0pO1xuICAgIH1cblxuICAgIGlmIChhdXRvSGVpZ2h0KSB7XG4gICAgICBpZiAobmVzdGVkID09PSAnb3V0ZXInKSB7XG4gICAgICAgIGV2ZW50cy5vbignaW5uZXJMb2FkZWQnLCBkb0F1dG9IZWlnaHQpO1xuICAgICAgfSBlbHNlIGlmICghZGlzYWJsZSkgeyBkb0F1dG9IZWlnaHQoKTsgfVxuICAgIH1cblxuICAgIGRvTGF6eUxvYWQoKTtcbiAgICBpZiAoZGlzYWJsZSkgeyBkaXNhYmxlU2xpZGVyKCk7IH0gZWxzZSBpZiAoZnJlZXplKSB7IGZyZWV6ZVNsaWRlcigpOyB9XG5cbiAgICBldmVudHMub24oJ2luZGV4Q2hhbmdlZCcsIGFkZGl0aW9uYWxVcGRhdGVzKTtcbiAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7IGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7IH1cbiAgICBpZiAodHlwZW9mIG9uSW5pdCA9PT0gJ2Z1bmN0aW9uJykgeyBvbkluaXQoaW5mbygpKTsgfVxuICAgIGlzT24gPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gICAgLy8gc2hlZXRcbiAgICBzaGVldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgaWYgKHNoZWV0Lm93bmVyTm9kZSkgeyBzaGVldC5vd25lck5vZGUucmVtb3ZlKCk7IH1cblxuICAgIC8vIHJlbW92ZSB3aW4gZXZlbnQgbGlzdGVuZXJzXG4gICAgcmVtb3ZlRXZlbnRzKHdpbiwgeydyZXNpemUnOiBvblJlc2l6ZX0pO1xuXG4gICAgLy8gYXJyb3dLZXlzLCBjb250cm9scywgbmF2XG4gICAgaWYgKGFycm93S2V5cykgeyByZW1vdmVFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTsgfVxuICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikgeyByZW1vdmVFdmVudHMoY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzRXZlbnRzKTsgfVxuICAgIGlmIChuYXZDb250YWluZXIpIHsgcmVtb3ZlRXZlbnRzKG5hdkNvbnRhaW5lciwgbmF2RXZlbnRzKTsgfVxuXG4gICAgLy8gYXV0b3BsYXlcbiAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7XG4gICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdmlzaWJpbGl0eUV2ZW50KTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgcmVtb3ZlRXZlbnRzKGF1dG9wbGF5QnV0dG9uLCB7J2NsaWNrJzogdG9nZ2xlQXV0b3BsYXl9KTsgfVxuICAgIGlmIChhdXRvcGxheSkgeyBjbGVhckludGVydmFsKGF1dG9wbGF5VGltZXIpOyB9XG5cbiAgICAvLyBjb250YWluZXJcbiAgICBpZiAoY2Fyb3VzZWwgJiYgVFJBTlNJVElPTkVORCkge1xuICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZXZlKTtcbiAgICB9XG4gICAgaWYgKHRvdWNoKSB7IHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzKTsgfVxuICAgIGlmIChtb3VzZURyYWcpIHsgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7IH1cblxuICAgIC8vIGNhY2hlIE9iamVjdCB2YWx1ZXMgaW4gb3B0aW9ucyAmJiByZXNldCBIVE1MXG4gICAgdmFyIGh0bWxMaXN0ID0gW2NvbnRhaW5lckhUTUwsIGNvbnRyb2xzQ29udGFpbmVySFRNTCwgcHJldkJ1dHRvbkhUTUwsIG5leHRCdXR0b25IVE1MLCBuYXZDb250YWluZXJIVE1MLCBhdXRvcGxheUJ1dHRvbkhUTUxdO1xuXG4gICAgdG5zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBlbCA9IGl0ZW0gPT09ICdjb250YWluZXInID8gb3V0ZXJXcmFwcGVyIDogb3B0aW9uc1tpdGVtXTtcblxuICAgICAgaWYgKHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIHByZXZFbCA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPyBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDogZmFsc2UsXG4gICAgICAgICAgICBwYXJlbnRFbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIGVsLm91dGVySFRNTCA9IGh0bWxMaXN0W2ldO1xuICAgICAgICBvcHRpb25zW2l0ZW1dID0gcHJldkVsID8gcHJldkVsLm5leHRFbGVtZW50U2libGluZyA6IHBhcmVudEVsLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvLyByZXNldCB2YXJpYWJsZXNcbiAgICB0bnNMaXN0ID0gYW5pbWF0ZUluID0gYW5pbWF0ZU91dCA9IGFuaW1hdGVEZWxheSA9IGFuaW1hdGVOb3JtYWwgPSBob3Jpem9udGFsID0gb3V0ZXJXcmFwcGVyID0gaW5uZXJXcmFwcGVyID0gY29udGFpbmVyID0gY29udGFpbmVyUGFyZW50ID0gY29udGFpbmVySFRNTCA9IHNsaWRlSXRlbXMgPSBzbGlkZUNvdW50ID0gYnJlYWtwb2ludFpvbmUgPSB3aW5kb3dXaWR0aCA9IGF1dG9XaWR0aCA9IGZpeGVkV2lkdGggPSBlZGdlUGFkZGluZyA9IGd1dHRlciA9IHZpZXdwb3J0ID0gaXRlbXMgPSBzbGlkZUJ5ID0gdmlld3BvcnRNYXggPSBhcnJvd0tleXMgPSBzcGVlZCA9IHJld2luZCA9IGxvb3AgPSBhdXRvSGVpZ2h0ID0gc2hlZXQgPSBsYXp5bG9hZCA9IHNsaWRlUG9zaXRpb25zID0gc2xpZGVJdGVtc091dCA9IGNsb25lQ291bnQgPSBzbGlkZUNvdW50TmV3ID0gaGFzUmlnaHREZWFkWm9uZSA9IHJpZ2h0Qm91bmRhcnkgPSB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUF0dHIgPSB0cmFuc2Zvcm1QcmVmaXggPSB0cmFuc2Zvcm1Qb3N0Zml4ID0gZ2V0SW5kZXhNYXggPSBpbmRleCA9IGluZGV4Q2FjaGVkID0gaW5kZXhNaW4gPSBpbmRleE1heCA9IHJlc2l6ZVRpbWVyID0gc3dpcGVBbmdsZSA9IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IHJ1bm5pbmcgPSBvbkluaXQgPSBldmVudHMgPSBuZXdDb250YWluZXJDbGFzc2VzID0gc2xpZGVJZCA9IGRpc2FibGUgPSBkaXNhYmxlZCA9IGZyZWV6YWJsZSA9IGZyZWV6ZSA9IGZyb3plbiA9IGNvbnRyb2xzRXZlbnRzID0gbmF2RXZlbnRzID0gaG92ZXJFdmVudHMgPSB2aXNpYmlsaXR5RXZlbnQgPSBkb2NtZW50S2V5ZG93bkV2ZW50ID0gdG91Y2hFdmVudHMgPSBkcmFnRXZlbnRzID0gaGFzQ29udHJvbHMgPSBoYXNOYXYgPSBuYXZBc1RodW1ibmFpbHMgPSBoYXNBdXRvcGxheSA9IGhhc1RvdWNoID0gaGFzTW91c2VEcmFnID0gc2xpZGVBY3RpdmVDbGFzcyA9IGltZ0NvbXBsZXRlQ2xhc3MgPSBpbWdFdmVudHMgPSBpbWdzQ29tcGxldGUgPSBjb250cm9scyA9IGNvbnRyb2xzVGV4dCA9IGNvbnRyb2xzQ29udGFpbmVyID0gY29udHJvbHNDb250YWluZXJIVE1MID0gcHJldkJ1dHRvbiA9IG5leHRCdXR0b24gPSBwcmV2SXNCdXR0b24gPSBuZXh0SXNCdXR0b24gPSBuYXYgPSBuYXZDb250YWluZXIgPSBuYXZDb250YWluZXJIVE1MID0gbmF2SXRlbXMgPSBwYWdlcyA9IHBhZ2VzQ2FjaGVkID0gbmF2Q2xpY2tlZCA9IG5hdkN1cnJlbnRJbmRleCA9IG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkFjdGl2ZUNsYXNzID0gbmF2U3RyID0gbmF2U3RyQ3VycmVudCA9IGF1dG9wbGF5ID0gYXV0b3BsYXlUaW1lb3V0ID0gYXV0b3BsYXlEaXJlY3Rpb24gPSBhdXRvcGxheVRleHQgPSBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheUJ1dHRvbiA9IGF1dG9wbGF5QnV0dG9uSFRNTCA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBhdXRvcGxheUh0bWxTdHJpbmdzID0gYXV0b3BsYXlUaW1lciA9IGFuaW1hdGluZyA9IGF1dG9wbGF5SG92ZXJQYXVzZWQgPSBhdXRvcGxheVVzZXJQYXVzZWQgPSBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSBpbml0UG9zaXRpb24gPSBsYXN0UG9zaXRpb24gPSB0cmFuc2xhdGVJbml0ID0gZGlzWCA9IGRpc1kgPSBwYW5TdGFydCA9IHJhZkluZGV4ID0gZ2V0RGlzdCA9IHRvdWNoID0gbW91c2VEcmFnID0gbnVsbDtcbiAgICAvLyBjaGVjayB2YXJpYWJsZXNcbiAgICAvLyBbYW5pbWF0ZUluLCBhbmltYXRlT3V0LCBhbmltYXRlRGVsYXksIGFuaW1hdGVOb3JtYWwsIGhvcml6b250YWwsIG91dGVyV3JhcHBlciwgaW5uZXJXcmFwcGVyLCBjb250YWluZXIsIGNvbnRhaW5lclBhcmVudCwgY29udGFpbmVySFRNTCwgc2xpZGVJdGVtcywgc2xpZGVDb3VudCwgYnJlYWtwb2ludFpvbmUsIHdpbmRvd1dpZHRoLCBhdXRvV2lkdGgsIGZpeGVkV2lkdGgsIGVkZ2VQYWRkaW5nLCBndXR0ZXIsIHZpZXdwb3J0LCBpdGVtcywgc2xpZGVCeSwgdmlld3BvcnRNYXgsIGFycm93S2V5cywgc3BlZWQsIHJld2luZCwgbG9vcCwgYXV0b0hlaWdodCwgc2hlZXQsIGxhenlsb2FkLCBzbGlkZVBvc2l0aW9ucywgc2xpZGVJdGVtc091dCwgY2xvbmVDb3VudCwgc2xpZGVDb3VudE5ldywgaGFzUmlnaHREZWFkWm9uZSwgcmlnaHRCb3VuZGFyeSwgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0sIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0SW5kZXhNYXgsIGluZGV4LCBpbmRleENhY2hlZCwgaW5kZXhNaW4sIGluZGV4TWF4LCByZXNpemVUaW1lciwgc3dpcGVBbmdsZSwgbW92ZURpcmVjdGlvbkV4cGVjdGVkLCBydW5uaW5nLCBvbkluaXQsIGV2ZW50cywgbmV3Q29udGFpbmVyQ2xhc3Nlcywgc2xpZGVJZCwgZGlzYWJsZSwgZGlzYWJsZWQsIGZyZWV6YWJsZSwgZnJlZXplLCBmcm96ZW4sIGNvbnRyb2xzRXZlbnRzLCBuYXZFdmVudHMsIGhvdmVyRXZlbnRzLCB2aXNpYmlsaXR5RXZlbnQsIGRvY21lbnRLZXlkb3duRXZlbnQsIHRvdWNoRXZlbnRzLCBkcmFnRXZlbnRzLCBoYXNDb250cm9scywgaGFzTmF2LCBuYXZBc1RodW1ibmFpbHMsIGhhc0F1dG9wbGF5LCBoYXNUb3VjaCwgaGFzTW91c2VEcmFnLCBzbGlkZUFjdGl2ZUNsYXNzLCBpbWdDb21wbGV0ZUNsYXNzLCBpbWdFdmVudHMsIGltZ3NDb21wbGV0ZSwgY29udHJvbHMsIGNvbnRyb2xzVGV4dCwgY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzQ29udGFpbmVySFRNTCwgcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbiwgcHJldklzQnV0dG9uLCBuZXh0SXNCdXR0b24sIG5hdiwgbmF2Q29udGFpbmVyLCBuYXZDb250YWluZXJIVE1MLCBuYXZJdGVtcywgcGFnZXMsIHBhZ2VzQ2FjaGVkLCBuYXZDbGlja2VkLCBuYXZDdXJyZW50SW5kZXgsIG5hdkN1cnJlbnRJbmRleENhY2hlZCwgbmF2QWN0aXZlQ2xhc3MsIG5hdlN0ciwgbmF2U3RyQ3VycmVudCwgYXV0b3BsYXksIGF1dG9wbGF5VGltZW91dCwgYXV0b3BsYXlEaXJlY3Rpb24sIGF1dG9wbGF5VGV4dCwgYXV0b3BsYXlIb3ZlclBhdXNlLCBhdXRvcGxheUJ1dHRvbiwgYXV0b3BsYXlCdXR0b25IVE1MLCBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5LCBhdXRvcGxheUh0bWxTdHJpbmdzLCBhdXRvcGxheVRpbWVyLCBhbmltYXRpbmcsIGF1dG9wbGF5SG92ZXJQYXVzZWQsIGF1dG9wbGF5VXNlclBhdXNlZCwgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkLCBpbml0UG9zaXRpb24sIGxhc3RQb3NpdGlvbiwgdHJhbnNsYXRlSW5pdCwgZGlzWCwgZGlzWSwgcGFuU3RhcnQsIHJhZkluZGV4LCBnZXREaXN0LCB0b3VjaCwgbW91c2VEcmFnIF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IGlmIChpdGVtICE9PSBudWxsKSB7IGNvbnNvbGUubG9nKGl0ZW0pOyB9IH0pO1xuXG4gICAgZm9yICh2YXIgYSBpbiB0aGlzKSB7XG4gICAgICBpZiAoYSAhPT0gJ3JlYnVpbGQnKSB7IHRoaXNbYV0gPSBudWxsOyB9XG4gICAgfVxuICAgIGlzT24gPSBmYWxzZTtcbiAgfVxuXG4vLyA9PT0gT04gUkVTSVpFID09PVxuICAvLyByZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8ICFob3Jpem9udGFsXG4gIGZ1bmN0aW9uIG9uUmVzaXplIChlKSB7XG4gICAgcmFmKGZ1bmN0aW9uKCl7IHJlc2l6ZVRhc2tzKGdldEV2ZW50KGUpKTsgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNpemVUYXNrcyAoZSkge1xuICAgIGlmICghaXNPbikgeyByZXR1cm47IH1cbiAgICBpZiAobmVzdGVkID09PSAnb3V0ZXInKSB7IGV2ZW50cy5lbWl0KCdvdXRlclJlc2l6ZWQnLCBpbmZvKGUpKTsgfVxuICAgIHdpbmRvd1dpZHRoID0gZ2V0V2luZG93V2lkdGgoKTtcbiAgICB2YXIgYnBDaGFuZ2VkLFxuICAgICAgICBicmVha3BvaW50Wm9uZVRlbSA9IGJyZWFrcG9pbnRab25lLFxuICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gZmFsc2U7XG5cbiAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgc2V0QnJlYWtwb2ludFpvbmUoKTtcbiAgICAgIGJwQ2hhbmdlZCA9IGJyZWFrcG9pbnRab25lVGVtICE9PSBicmVha3BvaW50Wm9uZTtcbiAgICAgIC8vIGlmIChoYXNSaWdodERlYWRab25lKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9IC8vICo/XG4gICAgICBpZiAoYnBDaGFuZ2VkKSB7IGV2ZW50cy5lbWl0KCduZXdCcmVha3BvaW50U3RhcnQnLCBpbmZvKGUpKTsgfVxuICAgIH1cblxuICAgIHZhciBpbmRDaGFuZ2VkLFxuICAgICAgICBpdGVtc0NoYW5nZWQsXG4gICAgICAgIGl0ZW1zVGVtID0gaXRlbXMsXG4gICAgICAgIGRpc2FibGVUZW0gPSBkaXNhYmxlLFxuICAgICAgICBmcmVlemVUZW0gPSBmcmVlemUsXG4gICAgICAgIGFycm93S2V5c1RlbSA9IGFycm93S2V5cyxcbiAgICAgICAgY29udHJvbHNUZW0gPSBjb250cm9scyxcbiAgICAgICAgbmF2VGVtID0gbmF2LFxuICAgICAgICB0b3VjaFRlbSA9IHRvdWNoLFxuICAgICAgICBtb3VzZURyYWdUZW0gPSBtb3VzZURyYWcsXG4gICAgICAgIGF1dG9wbGF5VGVtID0gYXV0b3BsYXksXG4gICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZVRlbSA9IGF1dG9wbGF5SG92ZXJQYXVzZSxcbiAgICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHksXG4gICAgICAgIGluZGV4VGVtID0gaW5kZXg7XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICB2YXIgZml4ZWRXaWR0aFRlbSA9IGZpeGVkV2lkdGgsXG4gICAgICAgICAgYXV0b0hlaWdodFRlbSA9IGF1dG9IZWlnaHQsXG4gICAgICAgICAgY29udHJvbHNUZXh0VGVtID0gY29udHJvbHNUZXh0LFxuICAgICAgICAgIGNlbnRlclRlbSA9IGNlbnRlcixcbiAgICAgICAgICBhdXRvcGxheVRleHRUZW0gPSBhdXRvcGxheVRleHQ7XG5cbiAgICAgIGlmICghQ1NTTVEpIHtcbiAgICAgICAgdmFyIGd1dHRlclRlbSA9IGd1dHRlcixcbiAgICAgICAgICAgIGVkZ2VQYWRkaW5nVGVtID0gZWRnZVBhZGRpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IG9wdGlvbjpcbiAgICAvLyBmaXhlZCB3aWR0aDogdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlciA9PiBpdGVtc1xuICAgIC8vIG90aGVyczogd2luZG93IHdpZHRoID0+IGFsbCB2YXJpYWJsZXNcbiAgICAvLyBhbGw6IGl0ZW1zID0+IHNsaWRlQnlcbiAgICBhcnJvd0tleXMgPSBnZXRPcHRpb24oJ2Fycm93S2V5cycpO1xuICAgIGNvbnRyb2xzID0gZ2V0T3B0aW9uKCdjb250cm9scycpO1xuICAgIG5hdiA9IGdldE9wdGlvbignbmF2Jyk7XG4gICAgdG91Y2ggPSBnZXRPcHRpb24oJ3RvdWNoJyk7XG4gICAgY2VudGVyID0gZ2V0T3B0aW9uKCdjZW50ZXInKTtcbiAgICBtb3VzZURyYWcgPSBnZXRPcHRpb24oJ21vdXNlRHJhZycpO1xuICAgIGF1dG9wbGF5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheScpO1xuICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA9IGdldE9wdGlvbignYXV0b3BsYXlIb3ZlclBhdXNlJyk7XG4gICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGdldE9wdGlvbignYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eScpO1xuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgZGlzYWJsZSA9IGdldE9wdGlvbignZGlzYWJsZScpO1xuICAgICAgZml4ZWRXaWR0aCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcpO1xuICAgICAgc3BlZWQgPSBnZXRPcHRpb24oJ3NwZWVkJyk7XG4gICAgICBhdXRvSGVpZ2h0ID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0Jyk7XG4gICAgICBjb250cm9sc1RleHQgPSBnZXRPcHRpb24oJ2NvbnRyb2xzVGV4dCcpO1xuICAgICAgYXV0b3BsYXlUZXh0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRleHQnKTtcbiAgICAgIGF1dG9wbGF5VGltZW91dCA9IGdldE9wdGlvbignYXV0b3BsYXlUaW1lb3V0Jyk7XG5cbiAgICAgIGlmICghQ1NTTVEpIHtcbiAgICAgICAgZWRnZVBhZGRpbmcgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJyk7XG4gICAgICAgIGd1dHRlciA9IGdldE9wdGlvbignZ3V0dGVyJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHVwZGF0ZSBvcHRpb25zXG4gICAgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUpO1xuXG4gICAgdmlld3BvcnQgPSBnZXRWaWV3cG9ydFdpZHRoKCk7IC8vIDw9IGVkZ2VQYWRkaW5nLCBndXR0ZXJcbiAgICBpZiAoKCFob3Jpem9udGFsIHx8IGF1dG9XaWR0aCkgJiYgIWRpc2FibGUpIHtcbiAgICAgIHNldFNsaWRlUG9zaXRpb25zKCk7XG4gICAgICBpZiAoIWhvcml6b250YWwpIHtcbiAgICAgICAgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTsgLy8gPD0gc2V0U2xpZGVQb3NpdGlvbnNcbiAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkge1xuICAgICAgcmlnaHRCb3VuZGFyeSA9IGdldFJpZ2h0Qm91bmRhcnkoKTsgLy8gYXV0b1dpZHRoOiA8PSB2aWV3cG9ydCwgc2xpZGVQb3NpdGlvbnMsIGd1dHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml4ZWRXaWR0aDogPD0gdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlclxuICAgICAgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyAvLyBhdXRvV2lkdGg6IDw9IHJpZ2h0Qm91bmRhcnksIHNsaWRlUG9zaXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpeGVkV2lkdGg6IDw9IHJpZ2h0Qm91bmRhcnksIGZpeGVkV2lkdGgsIGd1dHRlclxuICAgIH1cblxuICAgIGlmIChicENoYW5nZWQgfHwgZml4ZWRXaWR0aCkge1xuICAgICAgaXRlbXMgPSBnZXRPcHRpb24oJ2l0ZW1zJyk7XG4gICAgICBzbGlkZUJ5ID0gZ2V0T3B0aW9uKCdzbGlkZUJ5Jyk7XG4gICAgICBpdGVtc0NoYW5nZWQgPSBpdGVtcyAhPT0gaXRlbXNUZW07XG5cbiAgICAgIGlmIChpdGVtc0NoYW5nZWQpIHtcbiAgICAgICAgaWYgKCFmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHsgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyB9IC8vIDw9IGl0ZW1zXG4gICAgICAgIC8vIGNoZWNrIGluZGV4IGJlZm9yZSB0cmFuc2Zvcm0gaW4gY2FzZVxuICAgICAgICAvLyBzbGlkZXIgcmVhY2ggdGhlIHJpZ2h0IGVkZ2UgdGhlbiBpdGVtcyBiZWNvbWUgYmlnZ2VyXG4gICAgICAgIHVwZGF0ZUluZGV4KCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGlmIChkaXNhYmxlICE9PSBkaXNhYmxlVGVtKSB7XG4gICAgICAgIGlmIChkaXNhYmxlKSB7XG4gICAgICAgICAgZGlzYWJsZVNsaWRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuYWJsZVNsaWRlcigpOyAvLyA8PSBzbGlkZVBvc2l0aW9ucywgcmlnaHRCb3VuZGFyeSwgaW5kZXhNYXhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmcmVlemFibGUgJiYgKGJwQ2hhbmdlZCB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkpIHtcbiAgICAgIGZyZWV6ZSA9IGdldEZyZWV6ZSgpOyAvLyA8PSBhdXRvV2lkdGg6IHNsaWRlUG9zaXRpb25zLCBndXR0ZXIsIHZpZXdwb3J0LCByaWdodEJvdW5kYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPD0gZml4ZWRXaWR0aDogZml4ZWRXaWR0aCwgZ3V0dGVyLCByaWdodEJvdW5kYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPD0gb3RoZXJzOiBpdGVtc1xuXG4gICAgICBpZiAoZnJlZXplICE9PSBmcmVlemVUZW0pIHtcbiAgICAgICAgaWYgKGZyZWV6ZSkge1xuICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKGdldFN0YXJ0SW5kZXgoMCkpKTtcbiAgICAgICAgICBmcmVlemVTbGlkZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bmZyZWV6ZVNsaWRlcigpO1xuICAgICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTsgLy8gY29udHJvbHMsIG5hdiwgdG91Y2gsIG1vdXNlRHJhZywgYXJyb3dLZXlzLCBhdXRvcGxheSwgYXV0b3BsYXlIb3ZlclBhdXNlLCBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5XG4gICAgaWYgKCFhdXRvcGxheSkgeyBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZmFsc2U7IH1cblxuICAgIGlmIChhcnJvd0tleXMgIT09IGFycm93S2V5c1RlbSkge1xuICAgICAgYXJyb3dLZXlzID9cbiAgICAgICAgYWRkRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCkgOlxuICAgICAgICByZW1vdmVFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTtcbiAgICB9XG4gICAgaWYgKGNvbnRyb2xzICE9PSBjb250cm9sc1RlbSkge1xuICAgICAgaWYgKGNvbnRyb2xzKSB7XG4gICAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICAgIHNob3dFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBzaG93RWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IHNob3dFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICAgIGhpZGVFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBoaWRlRWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IGhpZGVFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hdiAhPT0gbmF2VGVtKSB7XG4gICAgICBuYXYgP1xuICAgICAgICBzaG93RWxlbWVudChuYXZDb250YWluZXIpIDpcbiAgICAgICAgaGlkZUVsZW1lbnQobmF2Q29udGFpbmVyKTtcbiAgICB9XG4gICAgaWYgKHRvdWNoICE9PSB0b3VjaFRlbSkge1xuICAgICAgdG91Y2ggP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cywgb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCkgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cyk7XG4gICAgfVxuICAgIGlmIChtb3VzZURyYWcgIT09IG1vdXNlRHJhZ1RlbSkge1xuICAgICAgbW91c2VEcmFnID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cykgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTtcbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5ICE9PSBhdXRvcGxheVRlbSkge1xuICAgICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyBzaG93RWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICAgICAgaWYgKCFhbmltYXRpbmcgJiYgIWF1dG9wbGF5VXNlclBhdXNlZCkgeyBzdGFydEF1dG9wbGF5KCk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyBoaWRlRWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICAgICAgaWYgKGFuaW1hdGluZykgeyBzdG9wQXV0b3BsYXkoKTsgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlICE9PSBhdXRvcGxheUhvdmVyUGF1c2VUZW0pIHtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTtcbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgIT09IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlUZW0pIHtcbiAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgP1xuICAgICAgICBhZGRFdmVudHMoZG9jLCB2aXNpYmlsaXR5RXZlbnQpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGRvYywgdmlzaWJpbGl0eUV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBpZiAoZml4ZWRXaWR0aCAhPT0gZml4ZWRXaWR0aFRlbSB8fCBjZW50ZXIgIT09IGNlbnRlclRlbSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfVxuXG4gICAgICBpZiAoYXV0b0hlaWdodCAhPT0gYXV0b0hlaWdodFRlbSkge1xuICAgICAgICBpZiAoIWF1dG9IZWlnaHQpIHsgaW5uZXJXcmFwcGVyLnN0eWxlLmhlaWdodCA9ICcnOyB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250cm9scyAmJiBjb250cm9sc1RleHQgIT09IGNvbnRyb2xzVGV4dFRlbSkge1xuICAgICAgICBwcmV2QnV0dG9uLmlubmVySFRNTCA9IGNvbnRyb2xzVGV4dFswXTtcbiAgICAgICAgbmV4dEJ1dHRvbi5pbm5lckhUTUwgPSBjb250cm9sc1RleHRbMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChhdXRvcGxheUJ1dHRvbiAmJiBhdXRvcGxheVRleHQgIT09IGF1dG9wbGF5VGV4dFRlbSkge1xuICAgICAgICB2YXIgaSA9IGF1dG9wbGF5ID8gMSA6IDAsXG4gICAgICAgICAgICBodG1sID0gYXV0b3BsYXlCdXR0b24uaW5uZXJIVE1MLFxuICAgICAgICAgICAgbGVuID0gaHRtbC5sZW5ndGggLSBhdXRvcGxheVRleHRUZW1baV0ubGVuZ3RoO1xuICAgICAgICBpZiAoaHRtbC5zdWJzdHJpbmcobGVuKSA9PT0gYXV0b3BsYXlUZXh0VGVtW2ldKSB7XG4gICAgICAgICAgYXV0b3BsYXlCdXR0b24uaW5uZXJIVE1MID0gaHRtbC5zdWJzdHJpbmcoMCwgbGVuKSArIGF1dG9wbGF5VGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2VudGVyICYmIChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkpIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH1cbiAgICB9XG5cbiAgICBpZiAoaXRlbXNDaGFuZ2VkIHx8IGZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkge1xuICAgICAgcGFnZXMgPSBnZXRQYWdlcygpO1xuICAgICAgdXBkYXRlTmF2VmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIGluZENoYW5nZWQgPSBpbmRleCAhPT0gaW5kZXhUZW07XG4gICAgaWYgKGluZENoYW5nZWQpIHsgXG4gICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcbiAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaXRlbXNDaGFuZ2VkKSB7XG4gICAgICBpZiAoIWluZENoYW5nZWQpIHsgYWRkaXRpb25hbFVwZGF0ZXMoKTsgfVxuICAgIH0gZWxzZSBpZiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIGRvTGF6eUxvYWQoKTsgXG4gICAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xuICAgICAgdXBkYXRlTGl2ZVJlZ2lvbigpO1xuICAgIH1cblxuICAgIGlmIChpdGVtc0NoYW5nZWQgJiYgIWNhcm91c2VsKSB7IHVwZGF0ZUdhbGxlcnlTbGlkZVBvc2l0aW9ucygpOyB9XG5cbiAgICBpZiAoIWRpc2FibGUgJiYgIWZyZWV6ZSkge1xuICAgICAgLy8gbm9uLW1lZHVhcXVlcmllczogSUU4XG4gICAgICBpZiAoYnBDaGFuZ2VkICYmICFDU1NNUSkge1xuICAgICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZXNcbiAgICAgICAgaWYgKGF1dG9IZWlnaHQgIT09IGF1dG9oZWlnaHRUZW0gfHwgc3BlZWQgIT09IHNwZWVkVGVtKSB7XG4gICAgICAgICAgdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICAgIGlmIChlZGdlUGFkZGluZyAhPT0gZWRnZVBhZGRpbmdUZW0gfHwgZ3V0dGVyICE9PSBndXR0ZXJUZW0pIHtcbiAgICAgICAgICBpbm5lcldyYXBwZXIuc3R5bGUuY3NzVGV4dCA9IGdldElubmVyV3JhcHBlclN0eWxlcyhlZGdlUGFkZGluZywgZ3V0dGVyLCBmaXhlZFdpZHRoLCBzcGVlZCwgYXV0b0hlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcbiAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNsaWRlIHN0eWxlc1xuICAgICAgICAgIHZhciBzdHIgPSBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcykgKyBcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXIpO1xuXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBsYXN0IGxpbmUgYW5kXG4gICAgICAgICAgLy8gYWRkIG5ldyBzdHlsZXNcbiAgICAgICAgICByZW1vdmVDU1NSdWxlKHNoZWV0LCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkgLSAxKTtcbiAgICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhdXRvIGhlaWdodFxuICAgICAgaWYgKGF1dG9IZWlnaHQpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cblxuICAgICAgaWYgKG5lZWRDb250YWluZXJUcmFuc2Zvcm0pIHtcbiAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcbiAgICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7IGV2ZW50cy5lbWl0KCduZXdCcmVha3BvaW50RW5kJywgaW5mbyhlKSk7IH1cbiAgfVxuXG5cblxuXG5cbiAgLy8gPT09IElOSVRJQUxJWkFUSU9OIEZVTkNUSU9OUyA9PT0gLy9cbiAgZnVuY3Rpb24gZ2V0RnJlZXplICgpIHtcbiAgICBpZiAoIWZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkge1xuICAgICAgdmFyIGEgPSBjZW50ZXIgPyBpdGVtcyAtIChpdGVtcyAtIDEpIC8gMiA6IGl0ZW1zO1xuICAgICAgcmV0dXJuICBzbGlkZUNvdW50IDw9IGE7XG4gICAgfVxuXG4gICAgdmFyIHdpZHRoID0gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnQgOiBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50XSxcbiAgICAgICAgdnAgPSBlZGdlUGFkZGluZyA/IHZpZXdwb3J0ICsgZWRnZVBhZGRpbmcgKiAyIDogdmlld3BvcnQgKyBndXR0ZXI7XG5cbiAgICBpZiAoY2VudGVyKSB7XG4gICAgICB2cCAtPSBmaXhlZFdpZHRoID8gKHZpZXdwb3J0IC0gZml4ZWRXaWR0aCkgLyAyIDogKHZpZXdwb3J0IC0gKHNsaWRlUG9zaXRpb25zW2luZGV4ICsgMV0gLSBzbGlkZVBvc2l0aW9uc1tpbmRleF0gLSBndXR0ZXIpKSAvIDI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpZHRoIDw9IHZwO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0QnJlYWtwb2ludFpvbmUgKCkge1xuICAgIGJyZWFrcG9pbnRab25lID0gMDtcbiAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICBicCA9IHBhcnNlSW50KGJwKTsgLy8gY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICBpZiAod2luZG93V2lkdGggPj0gYnApIHsgYnJlYWtwb2ludFpvbmUgPSBicDsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIChzbGlkZUJ5LCBpbmRleE1pbiwgaW5kZXhNYXgpID0+IGluZGV4XG4gIHZhciB1cGRhdGVJbmRleCA9IChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxvb3AgPyBcbiAgICAgIGNhcm91c2VsID9cbiAgICAgICAgLy8gbG9vcCArIGNhcm91c2VsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbGVmdEVkZ2UgPSBpbmRleE1pbixcbiAgICAgICAgICAgICAgcmlnaHRFZGdlID0gaW5kZXhNYXg7XG5cbiAgICAgICAgICBsZWZ0RWRnZSArPSBzbGlkZUJ5O1xuICAgICAgICAgIHJpZ2h0RWRnZSAtPSBzbGlkZUJ5O1xuXG4gICAgICAgICAgLy8gYWRqdXN0IGVkZ2VzIHdoZW4gaGFzIGVkZ2UgcGFkZGluZ3NcbiAgICAgICAgICAvLyBvciBmaXhlZC13aWR0aCBzbGlkZXIgd2l0aCBleHRyYSBzcGFjZSBvbiB0aGUgcmlnaHQgc2lkZVxuICAgICAgICAgIGlmIChlZGdlUGFkZGluZykge1xuICAgICAgICAgICAgbGVmdEVkZ2UgKz0gMTtcbiAgICAgICAgICAgIHJpZ2h0RWRnZSAtPSAxO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICAgICAgaWYgKCh2aWV3cG9ydCArIGd1dHRlciklKGZpeGVkV2lkdGggKyBndXR0ZXIpKSB7IHJpZ2h0RWRnZSAtPSAxOyB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgICAgICBpbmRleCAtPSBzbGlkZUNvdW50O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgICAgIGluZGV4ICs9IHNsaWRlQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IDpcbiAgICAgICAgLy8gbG9vcCArIGdhbGxlcnlcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGluZGV4ID4gaW5kZXhNYXgpIHtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA+PSBpbmRleE1pbiArIHNsaWRlQ291bnQpIHsgaW5kZXggLT0gc2xpZGVDb3VudDsgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBpbmRleE1pbikge1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4IDw9IGluZGV4TWF4IC0gc2xpZGVDb3VudCkgeyBpbmRleCArPSBzbGlkZUNvdW50OyB9XG4gICAgICAgICAgfVxuICAgICAgICB9IDpcbiAgICAgIC8vIG5vbi1sb29wXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgaW5kZXggPSBNYXRoLm1heChpbmRleE1pbiwgTWF0aC5taW4oaW5kZXhNYXgsIGluZGV4KSk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIGRpc2FibGVVSSAoKSB7XG4gICAgaWYgKCFhdXRvcGxheSAmJiBhdXRvcGxheUJ1dHRvbikgeyBoaWRlRWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICBpZiAoIW5hdiAmJiBuYXZDb250YWluZXIpIHsgaGlkZUVsZW1lbnQobmF2Q29udGFpbmVyKTsgfVxuICAgIGlmICghY29udHJvbHMpIHtcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBoaWRlRWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBoaWRlRWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBoaWRlRWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZVVJICgpIHtcbiAgICBpZiAoYXV0b3BsYXkgJiYgYXV0b3BsYXlCdXR0b24pIHsgc2hvd0VsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgaWYgKG5hdiAmJiBuYXZDb250YWluZXIpIHsgc2hvd0VsZW1lbnQobmF2Q29udGFpbmVyKTsgfVxuICAgIGlmIChjb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIHNob3dFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IHNob3dFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IHNob3dFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZnJlZXplU2xpZGVyICgpIHtcbiAgICBpZiAoZnJvemVuKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcmVtb3ZlIGVkZ2UgcGFkZGluZyBmcm9tIGlubmVyIHdyYXBwZXJcbiAgICBpZiAoZWRnZVBhZGRpbmcpIHsgaW5uZXJXcmFwcGVyLnN0eWxlLm1hcmdpbiA9ICcwcHgnOyB9XG5cbiAgICAvLyBhZGQgY2xhc3MgdG5zLXRyYW5zcGFyZW50IHRvIGNsb25lZCBzbGlkZXNcbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIHN0ciA9ICd0bnMtdHJhbnNwYXJlbnQnO1xuICAgICAgZm9yICh2YXIgaSA9IGNsb25lQ291bnQ7IGktLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IGFkZENsYXNzKHNsaWRlSXRlbXNbaV0sIHN0cik7IH1cbiAgICAgICAgYWRkQ2xhc3Moc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaSAtIDFdLCBzdHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGRpc2FibGVVSSgpO1xuXG4gICAgZnJvemVuID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuZnJlZXplU2xpZGVyICgpIHtcbiAgICBpZiAoIWZyb3plbikgeyByZXR1cm47IH1cblxuICAgIC8vIHJlc3RvcmUgZWRnZSBwYWRkaW5nIGZvciBpbm5lciB3cmFwcGVyXG4gICAgLy8gZm9yIG1vcmRlcm4gYnJvd3NlcnNcbiAgICBpZiAoZWRnZVBhZGRpbmcgJiYgQ1NTTVEpIHsgaW5uZXJXcmFwcGVyLnN0eWxlLm1hcmdpbiA9ICcnOyB9XG5cbiAgICAvLyByZW1vdmUgY2xhc3MgdG5zLXRyYW5zcGFyZW50IHRvIGNsb25lZCBzbGlkZXNcbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIHN0ciA9ICd0bnMtdHJhbnNwYXJlbnQnO1xuICAgICAgZm9yICh2YXIgaSA9IGNsb25lQ291bnQ7IGktLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IHJlbW92ZUNsYXNzKHNsaWRlSXRlbXNbaV0sIHN0cik7IH1cbiAgICAgICAgcmVtb3ZlQ2xhc3Moc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaSAtIDFdLCBzdHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGVuYWJsZVVJKCk7XG5cbiAgICBmcm96ZW4gPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc2FibGVTbGlkZXIgKCkge1xuICAgIGlmIChkaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICAgIHNoZWV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKG5ld0NvbnRhaW5lckNsYXNzZXMuc3Vic3RyaW5nKDEpLCAnJyk7XG4gICAgcmVtb3ZlQXR0cnMoY29udGFpbmVyLCBbJ3N0eWxlJ10pO1xuICAgIGlmIChsb29wKSB7XG4gICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgaGlkZUVsZW1lbnQoc2xpZGVJdGVtc1tqXSk7IH1cbiAgICAgICAgaGlkZUVsZW1lbnQoc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaiAtIDFdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB2ZXJ0aWNhbCBzbGlkZXJcbiAgICBpZiAoIWhvcml6b250YWwgfHwgIWNhcm91c2VsKSB7IHJlbW92ZUF0dHJzKGlubmVyV3JhcHBlciwgWydzdHlsZSddKTsgfVxuXG4gICAgLy8gZ2FsbGVyeVxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIHNsaWRlQ291bnQ7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuICAgICAgICByZW1vdmVBdHRycyhpdGVtLCBbJ3N0eWxlJ10pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBkaXNhYmxlVUkoKTtcblxuICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZVNsaWRlciAoKSB7XG4gICAgaWYgKCFkaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICAgIHNoZWV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSArPSBuZXdDb250YWluZXJDbGFzc2VzO1xuICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG5cbiAgICBpZiAobG9vcCkge1xuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IHNob3dFbGVtZW50KHNsaWRlSXRlbXNbal0pOyB9XG4gICAgICAgIHNob3dFbGVtZW50KHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGogLSAxXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2FsbGVyeVxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIHNsaWRlQ291bnQ7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldLFxuICAgICAgICAgICAgY2xhc3NOID0gaSA8IGluZGV4ICsgaXRlbXMgPyBhbmltYXRlSW4gOiBhbmltYXRlTm9ybWFsO1xuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBjbGFzc04pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGVuYWJsZVVJKCk7XG5cbiAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGl2ZVJlZ2lvbiAoKSB7XG4gICAgdmFyIHN0ciA9IGdldExpdmVSZWdpb25TdHIoKTtcbiAgICBpZiAobGl2ZXJlZ2lvbkN1cnJlbnQuaW5uZXJIVE1MICE9PSBzdHIpIHsgbGl2ZXJlZ2lvbkN1cnJlbnQuaW5uZXJIVE1MID0gc3RyOyB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMaXZlUmVnaW9uU3RyICgpIHtcbiAgICB2YXIgYXJyID0gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSxcbiAgICAgICAgc3RhcnQgPSBhcnJbMF0gKyAxLFxuICAgICAgICBlbmQgPSBhcnJbMV0gKyAxO1xuICAgIHJldHVybiBzdGFydCA9PT0gZW5kID8gc3RhcnQgKyAnJyA6IHN0YXJ0ICsgJyB0byAnICsgZW5kOyBcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpc2libGVTbGlkZVJhbmdlICh2YWwpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHsgdmFsID0gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKTsgfVxuICAgIHZhciBzdGFydCA9IGluZGV4LCBlbmQsIHJhbmdlc3RhcnQsIHJhbmdlZW5kO1xuXG4gICAgLy8gZ2V0IHJhbmdlIHN0YXJ0LCByYW5nZSBlbmQgZm9yIGF1dG9XaWR0aCBhbmQgZml4ZWRXaWR0aFxuICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgIGlmIChhdXRvV2lkdGggfHwgZml4ZWRXaWR0aCkge1xuICAgICAgICByYW5nZXN0YXJ0ID0gLSAocGFyc2VGbG9hdCh2YWwpICsgZWRnZVBhZGRpbmcpO1xuICAgICAgICByYW5nZWVuZCA9IHJhbmdlc3RhcnQgKyB2aWV3cG9ydCArIGVkZ2VQYWRkaW5nICogMjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICByYW5nZXN0YXJ0ID0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgICByYW5nZWVuZCA9IHJhbmdlc3RhcnQgKyB2aWV3cG9ydDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXQgc3RhcnQsIGVuZFxuICAgIC8vIC0gY2hlY2sgYXV0byB3aWR0aFxuICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgIHNsaWRlUG9zaXRpb25zLmZvckVhY2goZnVuY3Rpb24ocG9pbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPCBzbGlkZUNvdW50TmV3KSB7XG4gICAgICAgICAgaWYgKChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpICYmIHBvaW50IDw9IHJhbmdlc3RhcnQgKyAwLjUpIHsgc3RhcnQgPSBpOyB9XG4gICAgICAgICAgaWYgKHJhbmdlZW5kIC0gcG9pbnQgPj0gMC41KSB7IGVuZCA9IGk7IH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAvLyAtIGNoZWNrIHBlcmNlbnRhZ2Ugd2lkdGgsIGZpeGVkIHdpZHRoXG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgdmFyIGNlbGwgPSBmaXhlZFdpZHRoICsgZ3V0dGVyO1xuICAgICAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgc3RhcnQgPSBNYXRoLmZsb29yKHJhbmdlc3RhcnQvY2VsbCk7XG4gICAgICAgICAgZW5kID0gTWF0aC5jZWlsKHJhbmdlZW5kL2NlbGwgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmQgPSBzdGFydCArIE1hdGguY2VpbCh2aWV3cG9ydC9jZWxsKSAtIDE7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgICAgIHZhciBhID0gaXRlbXMgLSAxO1xuICAgICAgICAgIGlmIChjZW50ZXIpIHtcbiAgICAgICAgICAgIHN0YXJ0IC09IGEgLyAyO1xuICAgICAgICAgICAgZW5kID0gaW5kZXggKyBhIC8gMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gaW5kZXggKyBhO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlZGdlUGFkZGluZykge1xuICAgICAgICAgICAgdmFyIGIgPSBlZGdlUGFkZGluZyAqIGl0ZW1zIC8gdmlld3BvcnQ7XG4gICAgICAgICAgICBzdGFydCAtPSBiO1xuICAgICAgICAgICAgZW5kICs9IGI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLmZsb29yKHN0YXJ0KTtcbiAgICAgICAgICBlbmQgPSBNYXRoLmNlaWwoZW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmQgPSBzdGFydCArIGl0ZW1zIC0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdGFydCA9IE1hdGgubWF4KHN0YXJ0LCAwKTtcbiAgICAgIGVuZCA9IE1hdGgubWluKGVuZCwgc2xpZGVDb3VudE5ldyAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gIH1cblxuICBmdW5jdGlvbiBkb0xhenlMb2FkICgpIHtcbiAgICBpZiAobGF6eWxvYWQgJiYgIWRpc2FibGUpIHtcbiAgICAgIGdldEltYWdlQXJyYXkuYXBwbHkobnVsbCwgZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSkuZm9yRWFjaChmdW5jdGlvbiAoaW1nKSB7XG4gICAgICAgIGlmICghaGFzQ2xhc3MoaW1nLCBpbWdDb21wbGV0ZUNsYXNzKSkge1xuICAgICAgICAgIC8vIHN0b3AgcHJvcGFnYXRpb24gdHJhbnNpdGlvbmVuZCBldmVudCB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgZXZlID0ge307XG4gICAgICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfTtcbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBldmUpO1xuXG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcblxuICAgICAgICAgIC8vIHVwZGF0ZSBzcmNcbiAgICAgICAgICBpbWcuc3JjID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyYycpO1xuXG4gICAgICAgICAgLy8gdXBkYXRlIHNyY3NldFxuICAgICAgICAgIHZhciBzcmNzZXQgPSBnZXRBdHRyKGltZywgJ2RhdGEtc3Jjc2V0Jyk7XG4gICAgICAgICAgaWYgKHNyY3NldCkgeyBpbWcuc3Jjc2V0ID0gc3Jjc2V0OyB9XG5cbiAgICAgICAgICBhZGRDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uSW1nTG9hZGVkIChlKSB7XG4gICAgaW1nTG9hZGVkKGdldFRhcmdldChlKSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkltZ0ZhaWxlZCAoZSkge1xuICAgIGltZ0ZhaWxlZChnZXRUYXJnZXQoZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nTG9hZGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICdsb2FkZWQnKTtcbiAgICBpbWdDb21wbGV0ZWQoaW1nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0ZhaWxlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAnZmFpbGVkJyk7XG4gICAgaW1nQ29tcGxldGVkKGltZyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdDb21wbGV0ZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ3Rucy1jb21wbGV0ZScpO1xuICAgIHJlbW92ZUNsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICByZW1vdmVFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW1hZ2VBcnJheSAoc3RhcnQsIGVuZCkge1xuICAgIHZhciBpbWdzID0gW107XG4gICAgd2hpbGUgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zW3N0YXJ0XS5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKSwgZnVuY3Rpb24gKGltZykgeyBpbWdzLnB1c2goaW1nKTsgfSk7XG4gICAgICBzdGFydCsrO1xuICAgIH1cblxuICAgIHJldHVybiBpbWdzO1xuICB9XG5cbiAgLy8gY2hlY2sgaWYgYWxsIHZpc2libGUgaW1hZ2VzIGFyZSBsb2FkZWRcbiAgLy8gYW5kIHVwZGF0ZSBjb250YWluZXIgaGVpZ2h0IGlmIGl0J3MgZG9uZVxuICBmdW5jdGlvbiBkb0F1dG9IZWlnaHQgKCkge1xuICAgIHZhciBpbWdzID0gZ2V0SW1hZ2VBcnJheS5hcHBseShudWxsLCBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpKTtcbiAgICByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGltZ3MsIHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCk7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nc0xvYWRlZENoZWNrIChpbWdzLCBjYikge1xuICAgIC8vIGRpcmVjdGx5IGV4ZWN1dGUgY2FsbGJhY2sgZnVuY3Rpb24gaWYgYWxsIGltYWdlcyBhcmUgY29tcGxldGVcbiAgICBpZiAoaW1nc0NvbXBsZXRlKSB7IHJldHVybiBjYigpOyB9XG5cbiAgICAvLyBjaGVjayBzZWxlY3RlZCBpbWFnZSBjbGFzc2VzIG90aGVyd2lzZVxuICAgIGltZ3MuZm9yRWFjaChmdW5jdGlvbiAoaW1nLCBpbmRleCkge1xuICAgICAgaWYgKGhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHsgaW1ncy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgfSk7XG5cbiAgICAvLyBleGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uIGlmIHNlbGVjdGVkIGltYWdlcyBhcmUgYWxsIGNvbXBsZXRlXG4gICAgaWYgKCFpbWdzLmxlbmd0aCkgeyByZXR1cm4gY2IoKTsgfVxuXG4gICAgLy8gb3RoZXJ3aXNlIGV4ZWN1dGUgdGhpcyBmdW5jdGlvbmEgYWdhaW5cbiAgICByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGltZ3MsIGNiKTsgfSk7XG4gIH0gXG5cbiAgZnVuY3Rpb24gYWRkaXRpb25hbFVwZGF0ZXMgKCkge1xuICAgIGRvTGF6eUxvYWQoKTsgXG4gICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcbiAgICB1cGRhdGVMaXZlUmVnaW9uKCk7XG4gICAgdXBkYXRlQ29udHJvbHNTdGF0dXMoKTtcbiAgICB1cGRhdGVOYXZTdGF0dXMoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24gKCkge1xuICAgIGlmIChjYXJvdXNlbCAmJiBhdXRvSGVpZ2h0KSB7XG4gICAgICBtaWRkbGVXcmFwcGVyLnN0eWxlW1RSQU5TSVRJT05EVVJBVElPTl0gPSBzcGVlZCAvIDEwMDAgKyAncyc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWF4U2xpZGVIZWlnaHQgKHNsaWRlU3RhcnQsIHNsaWRlUmFuZ2UpIHtcbiAgICB2YXIgaGVpZ2h0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSBzbGlkZVN0YXJ0LCBsID0gTWF0aC5taW4oc2xpZGVTdGFydCArIHNsaWRlUmFuZ2UsIHNsaWRlQ291bnROZXcpOyBpIDwgbDsgaSsrKSB7XG4gICAgICBoZWlnaHRzLnB1c2goc2xpZGVJdGVtc1tpXS5vZmZzZXRIZWlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBoZWlnaHRzKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBpbm5lciB3cmFwcGVyIGhlaWdodFxuICAvLyAxLiBnZXQgdGhlIG1heC1oZWlnaHQgb2YgdGhlIHZpc2libGUgc2xpZGVzXG4gIC8vIDIuIHNldCB0cmFuc2l0aW9uRHVyYXRpb24gdG8gc3BlZWRcbiAgLy8gMy4gdXBkYXRlIGlubmVyIHdyYXBwZXIgaGVpZ2h0IHRvIG1heC1oZWlnaHRcbiAgLy8gNC4gc2V0IHRyYW5zaXRpb25EdXJhdGlvbiB0byAwcyBhZnRlciB0cmFuc2l0aW9uIGRvbmVcbiAgZnVuY3Rpb24gdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0ICgpIHtcbiAgICB2YXIgbWF4SGVpZ2h0ID0gYXV0b0hlaWdodCA/IGdldE1heFNsaWRlSGVpZ2h0KGluZGV4LCBpdGVtcykgOiBnZXRNYXhTbGlkZUhlaWdodChjbG9uZUNvdW50LCBzbGlkZUNvdW50KSxcbiAgICAgICAgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcblxuICAgIGlmICh3cC5zdHlsZS5oZWlnaHQgIT09IG1heEhlaWdodCkgeyB3cC5zdHlsZS5oZWlnaHQgPSBtYXhIZWlnaHQgKyAncHgnOyB9XG4gIH1cblxuICAvLyBnZXQgdGhlIGRpc3RhbmNlIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBmaXJzdCBzbGlkZSB0byBlYWNoIHNsaWRlXG4gIC8vIChpbml0KSA9PiBzbGlkZVBvc2l0aW9uc1xuICBmdW5jdGlvbiBzZXRTbGlkZVBvc2l0aW9ucyAoKSB7XG4gICAgc2xpZGVQb3NpdGlvbnMgPSBbMF07XG4gICAgdmFyIGF0dHIgPSBob3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcsXG4gICAgICAgIGF0dHIyID0gaG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJyxcbiAgICAgICAgYmFzZSA9IHNsaWRlSXRlbXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cl07XG5cbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIC8vIHNraXAgdGhlIGZpcnN0IHNsaWRlXG4gICAgICBpZiAoaSkgeyBzbGlkZVBvc2l0aW9ucy5wdXNoKGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cl0gLSBiYXNlKTsgfVxuICAgICAgLy8gYWRkIHRoZSBlbmQgZWRnZVxuICAgICAgaWYgKGkgPT09IHNsaWRlQ291bnROZXcgLSAxKSB7IHNsaWRlUG9zaXRpb25zLnB1c2goaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyMl0gLSBiYXNlKTsgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gdXBkYXRlIHNsaWRlXG4gIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlU3RhdHVzICgpIHtcbiAgICB2YXIgcmFuZ2UgPSBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpLFxuICAgICAgICBzdGFydCA9IHJhbmdlWzBdLFxuICAgICAgICBlbmQgPSByYW5nZVsxXTtcblxuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgLy8gc2hvdyBzbGlkZXNcbiAgICAgIGlmIChpID49IHN0YXJ0ICYmIGkgPD0gZW5kKSB7XG4gICAgICAgIGlmIChoYXNBdHRyKGl0ZW0sICdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgICAgcmVtb3ZlQXR0cnMoaXRlbSwgWydhcmlhLWhpZGRlbicsICd0YWJpbmRleCddKTtcbiAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBzbGlkZUFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgLy8gaGlkZSBzbGlkZXNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICAgIHNldEF0dHJzKGl0ZW0sIHtcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBzbGlkZUFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZ2FsbGVyeTogdXBkYXRlIHNsaWRlIHBvc2l0aW9uXG4gIGZ1bmN0aW9uIHVwZGF0ZUdhbGxlcnlTbGlkZVBvc2l0aW9ucyAoKSB7XG4gICAgdmFyIGwgPSBpbmRleCArIE1hdGgubWluKHNsaWRlQ291bnQsIGl0ZW1zKTtcbiAgICBmb3IgKHZhciBpID0gc2xpZGVDb3VudE5ldzsgaS0tOykge1xuICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuXG4gICAgICBpZiAoaSA+PSBpbmRleCAmJiBpIDwgbCkge1xuICAgICAgICAvLyBhZGQgdHJhbnNpdGlvbnMgdG8gdmlzaWJsZSBzbGlkZXMgd2hlbiBhZGp1c3RpbmcgdGhlaXIgcG9zaXRpb25zXG4gICAgICAgIGFkZENsYXNzKGl0ZW0sICd0bnMtbW92aW5nJyk7XG5cbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uc3R5bGUubGVmdCkge1xuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAnJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSBvdXRsZXQgYW5pbWF0aW9uXG4gICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlT3V0KTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmluZyAnLnRucy1tb3ZpbmcnXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsICd0bnMtbW92aW5nJyk7XG4gICAgICB9KTtcbiAgICB9LCAzMDApO1xuICB9XG5cbiAgLy8gc2V0IHRhYmluZGV4IG9uIE5hdlxuICBmdW5jdGlvbiB1cGRhdGVOYXZTdGF0dXMgKCkge1xuICAgIC8vIGdldCBjdXJyZW50IG5hdlxuICAgIGlmIChuYXYpIHtcbiAgICAgIG5hdkN1cnJlbnRJbmRleCA9IG5hdkNsaWNrZWQgPj0gMCA/IG5hdkNsaWNrZWQgOiBnZXRDdXJyZW50TmF2SW5kZXgoKTtcbiAgICAgIG5hdkNsaWNrZWQgPSAtMTtcblxuICAgICAgaWYgKG5hdkN1cnJlbnRJbmRleCAhPT0gbmF2Q3VycmVudEluZGV4Q2FjaGVkKSB7XG4gICAgICAgIHZhciBuYXZQcmV2ID0gbmF2SXRlbXNbbmF2Q3VycmVudEluZGV4Q2FjaGVkXSxcbiAgICAgICAgICAgIG5hdkN1cnJlbnQgPSBuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdO1xuXG4gICAgICAgIHNldEF0dHJzKG5hdlByZXYsIHtcbiAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleENhY2hlZCArIDEpXG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVDbGFzcyhuYXZQcmV2LCBuYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgIFxuICAgICAgICBzZXRBdHRycyhuYXZDdXJyZW50LCB7J2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAobmF2Q3VycmVudEluZGV4ICsgMSkgKyBuYXZTdHJDdXJyZW50fSk7XG4gICAgICAgIHJlbW92ZUF0dHJzKG5hdkN1cnJlbnQsICd0YWJpbmRleCcpO1xuICAgICAgICBhZGRDbGFzcyhuYXZDdXJyZW50LCBuYXZBY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2Q3VycmVudEluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExvd2VyQ2FzZU5vZGVOYW1lIChlbCkge1xuICAgIHJldHVybiBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNCdXR0b24gKGVsKSB7XG4gICAgcmV0dXJuIGdldExvd2VyQ2FzZU5vZGVOYW1lKGVsKSA9PT0gJ2J1dHRvbic7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FyaWFEaXNhYmxlZCAoZWwpIHtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc0VuYWJsZUVsZW1lbnQgKGlzQnV0dG9uLCBlbCwgdmFsKSB7XG4gICAgaWYgKGlzQnV0dG9uKSB7XG4gICAgICBlbC5kaXNhYmxlZCA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgdmFsLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCAnZGlzYWJsZWQnIHRvIHRydWUgb24gY29udHJvbHMgd2hlbiByZWFjaCB0aGUgZWRnZXNcbiAgZnVuY3Rpb24gdXBkYXRlQ29udHJvbHNTdGF0dXMgKCkge1xuICAgIGlmICghY29udHJvbHMgfHwgcmV3aW5kIHx8IGxvb3ApIHsgcmV0dXJuOyB9XG5cbiAgICB2YXIgcHJldkRpc2FibGVkID0gKHByZXZJc0J1dHRvbikgPyBwcmV2QnV0dG9uLmRpc2FibGVkIDogaXNBcmlhRGlzYWJsZWQocHJldkJ1dHRvbiksXG4gICAgICAgIG5leHREaXNhYmxlZCA9IChuZXh0SXNCdXR0b24pID8gbmV4dEJ1dHRvbi5kaXNhYmxlZCA6IGlzQXJpYURpc2FibGVkKG5leHRCdXR0b24pLFxuICAgICAgICBkaXNhYmxlUHJldiA9IChpbmRleCA8PSBpbmRleE1pbikgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIGRpc2FibGVOZXh0ID0gKCFyZXdpbmQgJiYgaW5kZXggPj0gaW5kZXhNYXgpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgaWYgKGRpc2FibGVQcmV2ICYmICFwcmV2RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQocHJldklzQnV0dG9uLCBwcmV2QnV0dG9uLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKCFkaXNhYmxlUHJldiAmJiBwcmV2RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQocHJldklzQnV0dG9uLCBwcmV2QnV0dG9uLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmIChkaXNhYmxlTmV4dCAmJiAhbmV4dERpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KG5leHRJc0J1dHRvbiwgbmV4dEJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICghZGlzYWJsZU5leHQgJiYgbmV4dERpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KG5leHRJc0J1dHRvbiwgbmV4dEJ1dHRvbiwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBkdXJhdGlvblxuICBmdW5jdGlvbiByZXNldER1cmF0aW9uIChlbCwgc3RyKSB7XG4gICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBlbC5zdHlsZVtUUkFOU0lUSU9ORFVSQVRJT05dID0gc3RyOyB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZXJXaWR0aCAoKSB7XG4gICAgcmV0dXJuIGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3IDogc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ld107XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDZW50ZXJHYXAgKG51bSkge1xuICAgIGlmIChudW0gPT0gbnVsbCkgeyBudW0gPSBpbmRleDsgfVxuXG4gICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZ3V0dGVyIDogMDtcbiAgICByZXR1cm4gYXV0b1dpZHRoID8gKCh2aWV3cG9ydCAtIGdhcCkgLSAoc2xpZGVQb3NpdGlvbnNbbnVtICsgMV0gLSBzbGlkZVBvc2l0aW9uc1tudW1dIC0gZ3V0dGVyKSkvMiA6XG4gICAgICBmaXhlZFdpZHRoID8gKHZpZXdwb3J0IC0gZml4ZWRXaWR0aCkgLyAyIDpcbiAgICAgICAgKGl0ZW1zIC0gMSkgLyAyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmlnaHRCb3VuZGFyeSAoKSB7XG4gICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZ3V0dGVyIDogMCxcbiAgICAgICAgcmVzdWx0ID0gKHZpZXdwb3J0ICsgZ2FwKSAtIGdldFNsaWRlcldpZHRoKCk7XG5cbiAgICBpZiAoY2VudGVyICYmICFsb29wKSB7XG4gICAgICByZXN1bHQgPSBmaXhlZFdpZHRoID8gLSAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiAoc2xpZGVDb3VudE5ldyAtIDEpIC0gZ2V0Q2VudGVyR2FwKCkgOlxuICAgICAgICBnZXRDZW50ZXJHYXAoc2xpZGVDb3VudE5ldyAtIDEpIC0gc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ldyAtIDFdO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ID4gMCkgeyByZXN1bHQgPSAwOyB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUgKG51bSkge1xuICAgIGlmIChudW0gPT0gbnVsbCkgeyBudW0gPSBpbmRleDsgfVxuXG4gICAgdmFyIHZhbDtcbiAgICBpZiAoaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICB2YWwgPSAtIChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIG51bTtcbiAgICAgICAgaWYgKGNlbnRlcikgeyB2YWwgKz0gZ2V0Q2VudGVyR2FwKCk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZW5vbWluYXRvciA9IFRSQU5TRk9STSA/IHNsaWRlQ291bnROZXcgOiBpdGVtcztcbiAgICAgICAgaWYgKGNlbnRlcikgeyBudW0gLT0gZ2V0Q2VudGVyR2FwKCk7IH1cbiAgICAgICAgdmFsID0gLSBudW0gKiAxMDAgLyBkZW5vbWluYXRvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFsID0gLSBzbGlkZVBvc2l0aW9uc1tudW1dO1xuICAgICAgaWYgKGNlbnRlciAmJiBhdXRvV2lkdGgpIHtcbiAgICAgICAgdmFsICs9IGdldENlbnRlckdhcCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNSaWdodERlYWRab25lKSB7IHZhbCA9IE1hdGgubWF4KHZhbCwgcmlnaHRCb3VuZGFyeSk7IH1cblxuICAgIHZhbCArPSAoaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoICYmICFmaXhlZFdpZHRoKSA/ICclJyA6ICdweCc7XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQgKHZhbCkge1xuICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnMHMnKTtcbiAgICBkb0NvbnRhaW5lclRyYW5zZm9ybSh2YWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9Db250YWluZXJUcmFuc2Zvcm0gKHZhbCkge1xuICAgIGlmICh2YWwgPT0gbnVsbCkgeyB2YWwgPSBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSgpOyB9XG4gICAgY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdID0gdHJhbnNmb3JtUHJlZml4ICsgdmFsICsgdHJhbnNmb3JtUG9zdGZpeDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFuaW1hdGVTbGlkZSAobnVtYmVyLCBjbGFzc091dCwgY2xhc3NJbiwgaXNPdXQpIHtcbiAgICB2YXIgbCA9IG51bWJlciArIGl0ZW1zO1xuICAgIGlmICghbG9vcCkgeyBsID0gTWF0aC5taW4obCwgc2xpZGVDb3VudE5ldyk7IH1cblxuICAgIGZvciAodmFyIGkgPSBudW1iZXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuXG4gICAgICAvLyBzZXQgaXRlbSBwb3NpdGlvbnNcbiAgICAgIGlmICghaXNPdXQpIHsgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJzsgfVxuXG4gICAgICBpZiAoYW5pbWF0ZURlbGF5ICYmIFRSQU5TSVRJT05ERUxBWSkge1xuICAgICAgICBpdGVtLnN0eWxlW1RSQU5TSVRJT05ERUxBWV0gPSBpdGVtLnN0eWxlW0FOSU1BVElPTkRFTEFZXSA9IGFuaW1hdGVEZWxheSAqIChpIC0gbnVtYmVyKSAvIDEwMDAgKyAncyc7XG4gICAgICB9XG4gICAgICByZW1vdmVDbGFzcyhpdGVtLCBjbGFzc091dCk7XG4gICAgICBhZGRDbGFzcyhpdGVtLCBjbGFzc0luKTtcbiAgICAgIFxuICAgICAgaWYgKGlzT3V0KSB7IHNsaWRlSXRlbXNPdXQucHVzaChpdGVtKTsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG1ha2UgdHJhbnNmZXIgYWZ0ZXIgY2xpY2svZHJhZzpcbiAgLy8gMS4gY2hhbmdlICd0cmFuc2Zvcm0nIHByb3BlcnR5IGZvciBtb3JkZXJuIGJyb3dzZXJzXG4gIC8vIDIuIGNoYW5nZSAnbGVmdCcgcHJvcGVydHkgZm9yIGxlZ2FjeSBicm93c2Vyc1xuICB2YXIgdHJhbnNmb3JtQ29yZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhcm91c2VsID9cbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcnKTtcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiB8fCAhc3BlZWQpIHtcbiAgICAgICAgICAvLyBmb3IgbW9yZGVuIGJyb3dzZXJzIHdpdGggbm9uLXplcm8gZHVyYXRpb24gb3IgXG4gICAgICAgICAgLy8gemVybyBkdXJhdGlvbiBmb3IgYWxsIGJyb3dzZXJzXG4gICAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAvLyBydW4gZmFsbGJhY2sgZnVuY3Rpb24gbWFudWFsbHkgXG4gICAgICAgICAgLy8gd2hlbiBkdXJhdGlvbiBpcyAwIC8gY29udGFpbmVyIGlzIGhpZGRlblxuICAgICAgICAgIGlmICghc3BlZWQgfHwgIWlzVmlzaWJsZShjb250YWluZXIpKSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmb3Igb2xkIGJyb3dzZXIgd2l0aCBub24temVybyBkdXJhdGlvblxuICAgICAgICAgIGpzVHJhbnNmb3JtKGNvbnRhaW5lciwgdHJhbnNmb3JtQXR0ciwgdHJhbnNmb3JtUHJlZml4LCB0cmFuc2Zvcm1Qb3N0Zml4LCBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSgpLCBzcGVlZCwgb25UcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaG9yaXpvbnRhbCkgeyB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpOyB9XG4gICAgICB9IDpcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2xpZGVJdGVtc091dCA9IFtdO1xuXG4gICAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gZXZlW0FOSU1BVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XG4gICAgICAgIHJlbW92ZUV2ZW50cyhzbGlkZUl0ZW1zW2luZGV4Q2FjaGVkXSwgZXZlKTtcbiAgICAgICAgYWRkRXZlbnRzKHNsaWRlSXRlbXNbaW5kZXhdLCBldmUpO1xuXG4gICAgICAgIGFuaW1hdGVTbGlkZShpbmRleENhY2hlZCwgYW5pbWF0ZUluLCBhbmltYXRlT3V0LCB0cnVlKTtcbiAgICAgICAgYW5pbWF0ZVNsaWRlKGluZGV4LCBhbmltYXRlTm9ybWFsLCBhbmltYXRlSW4pO1xuXG4gICAgICAgIC8vIHJ1biBmYWxsYmFjayBmdW5jdGlvbiBtYW51YWxseSBcbiAgICAgICAgLy8gd2hlbiB0cmFuc2l0aW9uIG9yIGFuaW1hdGlvbiBub3Qgc3VwcG9ydGVkIC8gZHVyYXRpb24gaXMgMFxuICAgICAgICBpZiAoIVRSQU5TSVRJT05FTkQgfHwgIUFOSU1BVElPTkVORCB8fCAhc3BlZWQgfHwgIWlzVmlzaWJsZShjb250YWluZXIpKSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIHJlbmRlciAoZSwgc2xpZGVyTW92ZWQpIHtcbiAgICBpZiAodXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0pIHsgdXBkYXRlSW5kZXgoKTsgfVxuXG4gICAgLy8gcmVuZGVyIHdoZW4gc2xpZGVyIHdhcyBtb3ZlZCAodG91Y2ggb3IgZHJhZykgZXZlbiB0aG91Z2ggaW5kZXggbWF5IG5vdCBjaGFuZ2VcbiAgICBpZiAoaW5kZXggIT09IGluZGV4Q2FjaGVkIHx8IHNsaWRlck1vdmVkKSB7XG4gICAgICAvLyBldmVudHNcbiAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuICAgICAgZXZlbnRzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcsIGluZm8oKSk7XG4gICAgICBpZiAoYXV0b0hlaWdodCkgeyBkb0F1dG9IZWlnaHQoKTsgfVxuXG4gICAgICAvLyBwYXVzZSBhdXRvcGxheSB3aGVuIGNsaWNrIG9yIGtleWRvd24gZnJvbSB1c2VyXG4gICAgICBpZiAoYW5pbWF0aW5nICYmIGUgJiYgWydjbGljaycsICdrZXlkb3duJ10uaW5kZXhPZihlLnR5cGUpID49IDApIHsgc3RvcEF1dG9wbGF5KCk7IH1cblxuICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICB0cmFuc2Zvcm1Db3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogVHJhbnNmZXIgcHJlZml4ZWQgcHJvcGVydGllcyB0byB0aGUgc2FtZSBmb3JtYXRcbiAgICogQ1NTOiAtV2Via2l0LVRyYW5zZm9ybSA9PiB3ZWJraXR0cmFuc2Zvcm1cbiAgICogSlM6IFdlYmtpdFRyYW5zZm9ybSA9PiB3ZWJraXR0cmFuc2Zvcm1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIHByb3BlcnR5XG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBzdHJUcmFucyAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0vZywgJycpO1xuICB9XG5cbiAgLy8gQUZURVIgVFJBTlNGT1JNXG4gIC8vIFRoaW5ncyBuZWVkIHRvIGJlIGRvbmUgYWZ0ZXIgYSB0cmFuc2ZlcjpcbiAgLy8gMS4gY2hlY2sgaW5kZXhcbiAgLy8gMi4gYWRkIGNsYXNzZXMgdG8gdmlzaWJsZSBzbGlkZVxuICAvLyAzLiBkaXNhYmxlIGNvbnRyb2xzIGJ1dHRvbnMgd2hlbiByZWFjaCB0aGUgZmlyc3QvbGFzdCBzbGlkZSBpbiBub24tbG9vcCBzbGlkZXJcbiAgLy8gNC4gdXBkYXRlIG5hdiBzdGF0dXNcbiAgLy8gNS4gbGF6eWxvYWQgaW1hZ2VzXG4gIC8vIDYuIHVwZGF0ZSBjb250YWluZXIgaGVpZ2h0XG4gIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCAoZXZlbnQpIHtcbiAgICAvLyBjaGVjayBydW5uaW5nIG9uIGdhbGxlcnkgbW9kZVxuICAgIC8vIG1ha2Ugc3VyZSB0cmFudGlvbmVuZC9hbmltYXRpb25lbmQgZXZlbnRzIHJ1biBvbmx5IG9uY2VcbiAgICBpZiAoY2Fyb3VzZWwgfHwgcnVubmluZykge1xuICAgICAgZXZlbnRzLmVtaXQoJ3RyYW5zaXRpb25FbmQnLCBpbmZvKGV2ZW50KSk7XG5cbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgc2xpZGVJdGVtc091dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVJdGVtc091dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc091dFtpXTtcbiAgICAgICAgICAvLyBzZXQgaXRlbSBwb3NpdGlvbnNcbiAgICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAnJztcblxuICAgICAgICAgIGlmIChBTklNQVRJT05ERUxBWSAmJiBUUkFOU0lUSU9OREVMQVkpIHsgXG4gICAgICAgICAgICBpdGVtLnN0eWxlW0FOSU1BVElPTkRFTEFZXSA9ICcnO1xuICAgICAgICAgICAgaXRlbS5zdHlsZVtUUkFOU0lUSU9OREVMQVldID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVPdXQpO1xuICAgICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIHVwZGF0ZSBzbGlkZXMsIG5hdiwgY29udHJvbHMgYWZ0ZXIgY2hlY2tpbmcgLi4uXG4gICAgICAgKiA9PiBsZWdhY3kgYnJvd3NlcnMgd2hvIGRvbid0IHN1cHBvcnQgJ2V2ZW50JyBcbiAgICAgICAqICAgIGhhdmUgdG8gY2hlY2sgZXZlbnQgZmlyc3QsIG90aGVyd2lzZSBldmVudC50YXJnZXQgd2lsbCBjYXVzZSBhbiBlcnJvciBcbiAgICAgICAqID0+IG9yICdnYWxsZXJ5JyBtb2RlOiBcbiAgICAgICAqICAgKyBldmVudCB0YXJnZXQgaXMgc2xpZGUgaXRlbVxuICAgICAgICogPT4gb3IgJ2Nhcm91c2VsJyBtb2RlOiBcbiAgICAgICAqICAgKyBldmVudCB0YXJnZXQgaXMgY29udGFpbmVyLCBcbiAgICAgICAqICAgKyBldmVudC5wcm9wZXJ0eSBpcyB0aGUgc2FtZSB3aXRoIHRyYW5zZm9ybSBhdHRyaWJ1dGVcbiAgICAgICAqL1xuICAgICAgaWYgKCFldmVudCB8fCBcbiAgICAgICAgICAhY2Fyb3VzZWwgJiYgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUgPT09IGNvbnRhaW5lciB8fCBcbiAgICAgICAgICBldmVudC50YXJnZXQgPT09IGNvbnRhaW5lciAmJiBzdHJUcmFucyhldmVudC5wcm9wZXJ0eU5hbWUpID09PSBzdHJUcmFucyh0cmFuc2Zvcm1BdHRyKSkge1xuXG4gICAgICAgIGlmICghdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0pIHsgXG4gICAgICAgICAgdmFyIGluZGV4VGVtID0gaW5kZXg7XG4gICAgICAgICAgdXBkYXRlSW5kZXgoKTtcbiAgICAgICAgICBpZiAoaW5kZXggIT09IGluZGV4VGVtKSB7IFxuICAgICAgICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG5cbiAgICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuXG4gICAgICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHsgZXZlbnRzLmVtaXQoJ2lubmVyTG9hZGVkJywgaW5mbygpKTsgfVxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvLyAjIEFDVElPTlNcbiAgZnVuY3Rpb24gZ29UbyAodGFyZ2V0SW5kZXgsIGUpIHtcbiAgICBpZiAoZnJlZXplKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcHJldiBzbGlkZUJ5XG4gICAgaWYgKHRhcmdldEluZGV4ID09PSAncHJldicpIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCAtMSk7XG5cbiAgICAvLyBuZXh0IHNsaWRlQnlcbiAgICB9IGVsc2UgaWYgKHRhcmdldEluZGV4ID09PSAnbmV4dCcpIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCAxKTtcblxuICAgIC8vIGdvIHRvIGV4YWN0IHNsaWRlXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgICAgfVxuXG4gICAgICB2YXIgYWJzSW5kZXggPSBnZXRBYnNJbmRleCgpLCBcbiAgICAgICAgICBpbmRleEdhcCA9IDA7XG5cbiAgICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ2ZpcnN0Jykge1xuICAgICAgICBpbmRleEdhcCA9IC0gYWJzSW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKHRhcmdldEluZGV4ID09PSAnbGFzdCcpIHtcbiAgICAgICAgaW5kZXhHYXAgPSBjYXJvdXNlbCA/IHNsaWRlQ291bnQgLSBpdGVtcyAtIGFic0luZGV4IDogc2xpZGVDb3VudCAtIDEgLSBhYnNJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0SW5kZXggIT09ICdudW1iZXInKSB7IHRhcmdldEluZGV4ID0gcGFyc2VJbnQodGFyZ2V0SW5kZXgpOyB9XG5cbiAgICAgICAgaWYgKCFpc05hTih0YXJnZXRJbmRleCkpIHtcbiAgICAgICAgICAvLyBmcm9tIGRpcmVjdGx5IGNhbGxlZCBnb1RvIGZ1bmN0aW9uXG4gICAgICAgICAgaWYgKCFlKSB7IHRhcmdldEluZGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc2xpZGVDb3VudCAtIDEsIHRhcmdldEluZGV4KSk7IH1cblxuICAgICAgICAgIGluZGV4R2FwID0gdGFyZ2V0SW5kZXggLSBhYnNJbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBnYWxsZXJ5OiBtYWtlIHN1cmUgbmV3IHBhZ2Ugd29uJ3Qgb3ZlcmxhcCB3aXRoIGN1cnJlbnQgcGFnZVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBpbmRleEdhcCAmJiBNYXRoLmFicyhpbmRleEdhcCkgPCBpdGVtcykge1xuICAgICAgICB2YXIgZmFjdG9yID0gaW5kZXhHYXAgPiAwID8gMSA6IC0xO1xuICAgICAgICBpbmRleEdhcCArPSAoaW5kZXggKyBpbmRleEdhcCAtIHNsaWRlQ291bnQpID49IGluZGV4TWluID8gc2xpZGVDb3VudCAqIGZhY3RvciA6IHNsaWRlQ291bnQgKiAyICogZmFjdG9yICogLTE7XG4gICAgICB9XG5cbiAgICAgIGluZGV4ICs9IGluZGV4R2FwO1xuXG4gICAgICAvLyBtYWtlIHN1cmUgaW5kZXggaXMgaW4gcmFuZ2VcbiAgICAgIGlmIChjYXJvdXNlbCAmJiBsb29wKSB7XG4gICAgICAgIGlmIChpbmRleCA8IGluZGV4TWluKSB7IGluZGV4ICs9IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgaWYgKGluZGV4ID4gaW5kZXhNYXgpIHsgaW5kZXggLT0gc2xpZGVDb3VudDsgfVxuICAgICAgfVxuXG4gICAgICAvLyBpZiBpbmRleCBpcyBjaGFuZ2VkLCBzdGFydCByZW5kZXJpbmdcbiAgICAgIGlmIChnZXRBYnNJbmRleChpbmRleCkgIT09IGdldEFic0luZGV4KGluZGV4Q2FjaGVkKSkge1xuICAgICAgICByZW5kZXIoZSk7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICAvLyBvbiBjb250cm9scyBjbGlja1xuICBmdW5jdGlvbiBvbkNvbnRyb2xzQ2xpY2sgKGUsIGRpcikge1xuICAgIGlmIChydW5uaW5nKSB7XG4gICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICB9XG4gICAgdmFyIHBhc3NFdmVudE9iamVjdDtcblxuICAgIGlmICghZGlyKSB7XG4gICAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xuXG4gICAgICB3aGlsZSAodGFyZ2V0ICE9PSBjb250cm9sc0NvbnRhaW5lciAmJiBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0uaW5kZXhPZih0YXJnZXQpIDwgMCkgeyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTsgfVxuXG4gICAgICB2YXIgdGFyZ2V0SW4gPSBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0uaW5kZXhPZih0YXJnZXQpO1xuICAgICAgaWYgKHRhcmdldEluID49IDApIHtcbiAgICAgICAgcGFzc0V2ZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgZGlyID0gdGFyZ2V0SW4gPT09IDAgPyAtMSA6IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJld2luZCkge1xuICAgICAgaWYgKGluZGV4ID09PSBpbmRleE1pbiAmJiBkaXIgPT09IC0xKSB7XG4gICAgICAgIGdvVG8oJ2xhc3QnLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gaW5kZXhNYXggJiYgZGlyID09PSAxKSB7XG4gICAgICAgIGdvVG8oJ2ZpcnN0JywgZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGlyKSB7XG4gICAgICBpbmRleCArPSBzbGlkZUJ5ICogZGlyO1xuICAgICAgaWYgKGF1dG9XaWR0aCkgeyBpbmRleCA9IE1hdGguZmxvb3IoaW5kZXgpOyB9XG4gICAgICAvLyBwYXNzIGUgd2hlbiBjbGljayBjb250cm9sIGJ1dHRvbnMgb3Iga2V5ZG93blxuICAgICAgcmVuZGVyKChwYXNzRXZlbnRPYmplY3QgfHwgKGUgJiYgZS50eXBlID09PSAna2V5ZG93bicpKSA/IGUgOiBudWxsKTtcbiAgICB9XG4gIH1cblxuICAvLyBvbiBuYXYgY2xpY2tcbiAgZnVuY3Rpb24gb25OYXZDbGljayAoZSkge1xuICAgIGlmIChydW5uaW5nKSB7XG4gICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICB9XG4gICAgXG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoZSksIG5hdkluZGV4O1xuXG4gICAgLy8gZmluZCB0aGUgY2xpY2tlZCBuYXYgaXRlbVxuICAgIHdoaWxlICh0YXJnZXQgIT09IG5hdkNvbnRhaW5lciAmJiAhaGFzQXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSB7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlOyB9XG4gICAgaWYgKGhhc0F0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSkge1xuICAgICAgdmFyIG5hdkluZGV4ID0gbmF2Q2xpY2tlZCA9IE51bWJlcihnZXRBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpLFxuICAgICAgICAgIHRhcmdldEluZGV4QmFzZSA9IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoID8gbmF2SW5kZXggKiBzbGlkZUNvdW50IC8gcGFnZXMgOiBuYXZJbmRleCAqIGl0ZW1zLFxuICAgICAgICAgIHRhcmdldEluZGV4ID0gbmF2QXNUaHVtYm5haWxzID8gbmF2SW5kZXggOiBNYXRoLm1pbihNYXRoLmNlaWwodGFyZ2V0SW5kZXhCYXNlKSwgc2xpZGVDb3VudCAtIDEpO1xuICAgICAgZ29Ubyh0YXJnZXRJbmRleCwgZSk7XG5cbiAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggPT09IG5hdkluZGV4KSB7XG4gICAgICAgIGlmIChhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5KCk7IH1cbiAgICAgICAgbmF2Q2xpY2tlZCA9IC0xOyAvLyByZXNldCBuYXZDbGlja2VkXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gYXV0b3BsYXkgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIHNldEF1dG9wbGF5VGltZXIgKCkge1xuICAgIGF1dG9wbGF5VGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2sobnVsbCwgYXV0b3BsYXlEaXJlY3Rpb24pO1xuICAgIH0sIGF1dG9wbGF5VGltZW91dCk7XG5cbiAgICBhbmltYXRpbmcgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcEF1dG9wbGF5VGltZXIgKCkge1xuICAgIGNsZWFySW50ZXJ2YWwoYXV0b3BsYXlUaW1lcik7XG4gICAgYW5pbWF0aW5nID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVBdXRvcGxheUJ1dHRvbiAoYWN0aW9uLCB0eHQpIHtcbiAgICBzZXRBdHRycyhhdXRvcGxheUJ1dHRvbiwgeydkYXRhLWFjdGlvbic6IGFjdGlvbn0pO1xuICAgIGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCA9IGF1dG9wbGF5SHRtbFN0cmluZ3NbMF0gKyBhY3Rpb24gKyBhdXRvcGxheUh0bWxTdHJpbmdzWzFdICsgdHh0O1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRBdXRvcGxheSAoKSB7XG4gICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyB1cGRhdGVBdXRvcGxheUJ1dHRvbignc3RvcCcsIGF1dG9wbGF5VGV4dFsxXSk7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BBdXRvcGxheSAoKSB7XG4gICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgdXBkYXRlQXV0b3BsYXlCdXR0b24oJ3N0YXJ0JywgYXV0b3BsYXlUZXh0WzBdKTsgfVxuICB9XG5cbiAgLy8gcHJvZ3JhbWFpdGNhbGx5IHBsYXkvcGF1c2UgdGhlIHNsaWRlclxuICBmdW5jdGlvbiBwbGF5ICgpIHtcbiAgICBpZiAoYXV0b3BsYXkgJiYgIWFuaW1hdGluZykge1xuICAgICAgc3RhcnRBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBhdXNlICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICBzdG9wQXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQXV0b3BsYXkgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgIHN0b3BBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25WaXNpYmlsaXR5Q2hhbmdlICgpIHtcbiAgICBpZiAoZG9jLmhpZGRlbikge1xuICAgICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkKSB7XG4gICAgICBzZXRBdXRvcGxheVRpbWVyKCk7XG4gICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZW92ZXJQYXVzZSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykgeyBcbiAgICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZW91dFJlc3RhcnQgKCkge1xuICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2VkKSB7IFxuICAgICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGtleWRvd24gZXZlbnRzIG9uIGRvY3VtZW50IFxuICBmdW5jdGlvbiBvbkRvY3VtZW50S2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hUXS5pbmRleE9mKGUua2V5Q29kZSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgb25Db250cm9sc0NsaWNrKGUsIGtleUluZGV4ID09PSAwID8gLTEgOiAxKTtcbiAgICB9XG4gIH1cblxuICAvLyBvbiBrZXkgY29udHJvbFxuICBmdW5jdGlvbiBvbkNvbnRyb2xzS2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hUXS5pbmRleE9mKGUua2V5Q29kZSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgaWYgKGtleUluZGV4ID09PSAwKSB7XG4gICAgICAgIGlmICghcHJldkJ1dHRvbi5kaXNhYmxlZCkgeyBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpOyB9XG4gICAgICB9IGVsc2UgaWYgKCFuZXh0QnV0dG9uLmRpc2FibGVkKSB7XG4gICAgICAgIG9uQ29udHJvbHNDbGljayhlLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBzZXQgZm9jdXNcbiAgZnVuY3Rpb24gc2V0Rm9jdXMgKGVsKSB7XG4gICAgZWwuZm9jdXMoKTtcbiAgfVxuXG4gIC8vIG9uIGtleSBuYXZcbiAgZnVuY3Rpb24gb25OYXZLZXlkb3duIChlKSB7XG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciBjdXJFbGVtZW50ID0gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKCFoYXNBdHRyKGN1ckVsZW1lbnQsICdkYXRhLW5hdicpKSB7IHJldHVybjsgfVxuXG4gICAgLy8gdmFyIGNvZGUgPSBlLmtleUNvZGUsXG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVCwgS0VZUy5FTlRFUiwgS0VZUy5TUEFDRV0uaW5kZXhPZihlLmtleUNvZGUpLFxuICAgICAgICBuYXZJbmRleCA9IE51bWJlcihnZXRBdHRyKGN1ckVsZW1lbnQsICdkYXRhLW5hdicpKTtcblxuICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICBpZiAoa2V5SW5kZXggPT09IDApIHtcbiAgICAgICAgaWYgKG5hdkluZGV4ID4gMCkgeyBzZXRGb2N1cyhuYXZJdGVtc1tuYXZJbmRleCAtIDFdKTsgfVxuICAgICAgfSBlbHNlIGlmIChrZXlJbmRleCA9PT0gMSkge1xuICAgICAgICBpZiAobmF2SW5kZXggPCBwYWdlcyAtIDEpIHsgc2V0Rm9jdXMobmF2SXRlbXNbbmF2SW5kZXggKyAxXSk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hdkNsaWNrZWQgPSBuYXZJbmRleDtcbiAgICAgICAgZ29UbyhuYXZJbmRleCwgZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RXZlbnQgKGUpIHtcbiAgICBlID0gZSB8fCB3aW4uZXZlbnQ7XG4gICAgcmV0dXJuIGlzVG91Y2hFdmVudChlKSA/IGUuY2hhbmdlZFRvdWNoZXNbMF0gOiBlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFRhcmdldCAoZSkge1xuICAgIHJldHVybiBlLnRhcmdldCB8fCB3aW4uZXZlbnQuc3JjRWxlbWVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVG91Y2hFdmVudCAoZSkge1xuICAgIHJldHVybiBlLnR5cGUuaW5kZXhPZigndG91Y2gnKSA+PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJldmVudERlZmF1bHRCZWhhdmlvciAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgKCkge1xuICAgIHJldHVybiBnZXRUb3VjaERpcmVjdGlvbih0b0RlZ3JlZShsYXN0UG9zaXRpb24ueSAtIGluaXRQb3NpdGlvbi55LCBsYXN0UG9zaXRpb24ueCAtIGluaXRQb3NpdGlvbi54KSwgc3dpcGVBbmdsZSkgPT09IG9wdGlvbnMuYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUGFuU3RhcnQgKGUpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuXG4gICAgaWYgKGF1dG9wbGF5ICYmIGFuaW1hdGluZykgeyBzdG9wQXV0b3BsYXlUaW1lcigpOyB9XG4gICAgXG4gICAgcGFuU3RhcnQgPSB0cnVlO1xuICAgIGlmIChyYWZJbmRleCkge1xuICAgICAgY2FmKHJhZkluZGV4KTtcbiAgICAgIHJhZkluZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgIGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaFN0YXJ0JyA6ICdkcmFnU3RhcnQnLCBpbmZvKGUpKTtcblxuICAgIGlmICghaXNUb3VjaEV2ZW50KGUpICYmIFsnaW1nJywgJ2EnXS5pbmRleE9mKGdldExvd2VyQ2FzZU5vZGVOYW1lKGdldFRhcmdldChlKSkpID49IDApIHtcbiAgICAgIHByZXZlbnREZWZhdWx0QmVoYXZpb3IoZSk7XG4gICAgfVxuXG4gICAgbGFzdFBvc2l0aW9uLnggPSBpbml0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICBsYXN0UG9zaXRpb24ueSA9IGluaXRQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgdHJhbnNsYXRlSW5pdCA9IHBhcnNlRmxvYXQoY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdLnJlcGxhY2UodHJhbnNmb3JtUHJlZml4LCAnJykpO1xuICAgICAgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcwcycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUGFuTW92ZSAoZSkge1xuICAgIGlmIChwYW5TdGFydCkge1xuICAgICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICAgIGxhc3RQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xuICAgICAgbGFzdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XG5cbiAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICBpZiAoIXJhZkluZGV4KSB7IHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCl7IHBhblVwZGF0ZShlKTsgfSk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPT09ICc/JykgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQoKTsgfVxuICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7IHByZXZlbnRTY3JvbGwgPSB0cnVlOyB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2ZW50U2Nyb2xsKSB7IGUucHJldmVudERlZmF1bHQoKTsgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhblVwZGF0ZSAoZSkge1xuICAgIGlmICghbW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICBwYW5TdGFydCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYWYocmFmSW5kZXgpO1xuICAgIGlmIChwYW5TdGFydCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XG5cbiAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkID09PSAnPycpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkKCk7IH1cbiAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICBpZiAoIXByZXZlbnRTY3JvbGwgJiYgaXNUb3VjaEV2ZW50KGUpKSB7IHByZXZlbnRTY3JvbGwgPSB0cnVlOyB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChlLnR5cGUpIHsgZXZlbnRzLmVtaXQoaXNUb3VjaEV2ZW50KGUpID8gJ3RvdWNoTW92ZScgOiAnZHJhZ01vdmUnLCBpbmZvKGUpKTsgfVxuICAgICAgfSBjYXRjaChlcnIpIHt9XG5cbiAgICAgIHZhciB4ID0gdHJhbnNsYXRlSW5pdCxcbiAgICAgICAgICBkaXN0ID0gZ2V0RGlzdChsYXN0UG9zaXRpb24sIGluaXRQb3NpdGlvbik7XG4gICAgICBpZiAoIWhvcml6b250YWwgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgICAgeCArPSBkaXN0O1xuICAgICAgICB4ICs9ICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGVyY2VudGFnZVggPSBUUkFOU0ZPUk0gPyBkaXN0ICogaXRlbXMgKiAxMDAgLyAoKHZpZXdwb3J0ICsgZ3V0dGVyKSAqIHNsaWRlQ291bnROZXcpOiBkaXN0ICogMTAwIC8gKHZpZXdwb3J0ICsgZ3V0dGVyKTtcbiAgICAgICAgeCArPSBwZXJjZW50YWdlWDtcbiAgICAgICAgeCArPSAnJSc7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXSA9IHRyYW5zZm9ybVByZWZpeCArIHggKyB0cmFuc2Zvcm1Qb3N0Zml4O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUGFuRW5kIChlKSB7XG4gICAgaWYgKHBhblN0YXJ0KSB7XG4gICAgICBpZiAocmFmSW5kZXgpIHtcbiAgICAgICAgY2FmKHJhZkluZGV4KTtcbiAgICAgICAgcmFmSW5kZXggPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGNhcm91c2VsKSB7IHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnJyk7IH1cbiAgICAgIHBhblN0YXJ0ID0gZmFsc2U7XG5cbiAgICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgICBsYXN0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICAgIGxhc3RQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuICAgICAgdmFyIGRpc3QgPSBnZXREaXN0KGxhc3RQb3NpdGlvbiwgaW5pdFBvc2l0aW9uKTtcblxuICAgICAgaWYgKE1hdGguYWJzKGRpc3QpKSB7XG4gICAgICAgIC8vIGRyYWcgdnMgY2xpY2tcbiAgICAgICAgaWYgKCFpc1RvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgICAvLyBwcmV2ZW50IFwiY2xpY2tcIlxuICAgICAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoZSk7XG4gICAgICAgICAgYWRkRXZlbnRzKHRhcmdldCwgeydjbGljayc6IGZ1bmN0aW9uIHByZXZlbnRDbGljayAoZSkge1xuICAgICAgICAgICAgcHJldmVudERlZmF1bHRCZWhhdmlvcihlKTtcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50cyh0YXJnZXQsIHsnY2xpY2snOiBwcmV2ZW50Q2xpY2t9KTtcbiAgICAgICAgICB9fSk7IFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICAgICAgICAgIHZhciBpbmRleE1vdmVkID0gLSBkaXN0ICogaXRlbXMgLyAodmlld3BvcnQgKyBndXR0ZXIpO1xuICAgICAgICAgICAgICBpbmRleE1vdmVkID0gZGlzdCA+IDAgPyBNYXRoLmZsb29yKGluZGV4TW92ZWQpIDogTWF0aC5jZWlsKGluZGV4TW92ZWQpO1xuICAgICAgICAgICAgICBpbmRleCArPSBpbmRleE1vdmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIG1vdmVkID0gLSAodHJhbnNsYXRlSW5pdCArIGRpc3QpO1xuICAgICAgICAgICAgICBpZiAobW92ZWQgPD0gMCkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhNaW47XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAobW92ZWQgPj0gc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ldyAtIDFdKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE1heDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBzbGlkZUNvdW50TmV3ICYmIG1vdmVkID49IHNsaWRlUG9zaXRpb25zW2ldKSB7XG4gICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICBpZiAobW92ZWQgPiBzbGlkZVBvc2l0aW9uc1tpXSAmJiBkaXN0IDwgMCkgeyBpbmRleCArPSAxOyB9XG4gICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcihlLCBkaXN0KTtcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaEVuZCcgOiAnZHJhZ0VuZCcsIGluZm8oZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcbiAgICAgICAgICAgIG9uQ29udHJvbHNDbGljayhlLCBkaXN0ID4gMCA/IC0xIDogMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVzZXRcbiAgICBpZiAob3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCA9PT0gJ2F1dG8nKSB7IHByZXZlbnRTY3JvbGwgPSBmYWxzZTsgfVxuICAgIGlmIChzd2lwZUFuZ2xlKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9ICc/JzsgfSBcbiAgICBpZiAoYXV0b3BsYXkgJiYgIWFuaW1hdGluZykgeyBzZXRBdXRvcGxheVRpbWVyKCk7IH1cbiAgfVxuXG4gIC8vID09PSBSRVNJWkUgRlVOQ1RJT05TID09PSAvL1xuICAvLyAoc2xpZGVQb3NpdGlvbnMsIGluZGV4LCBpdGVtcykgPT4gdmVydGljYWxfY29uZW50V3JhcHBlci5oZWlnaHRcbiAgZnVuY3Rpb24gdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQgKCkge1xuICAgIHZhciB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xuICAgIHdwLnN0eWxlLmhlaWdodCA9IHNsaWRlUG9zaXRpb25zW2luZGV4ICsgaXRlbXNdIC0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdICsgJ3B4JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhZ2VzICgpIHtcbiAgICB2YXIgcm91Z2ggPSBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudCAvIHZpZXdwb3J0IDogc2xpZGVDb3VudCAvIGl0ZW1zO1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLmNlaWwocm91Z2gpLCBzbGlkZUNvdW50KTtcbiAgfVxuXG4gIC8qXG4gICAqIDEuIHVwZGF0ZSB2aXNpYmxlIG5hdiBpdGVtcyBsaXN0XG4gICAqIDIuIGFkZCBcImhpZGRlblwiIGF0dHJpYnV0ZXMgdG8gcHJldmlvdXMgdmlzaWJsZSBuYXYgaXRlbXNcbiAgICogMy4gcmVtb3ZlIFwiaGlkZGVuXCIgYXR0cnVidXRlcyB0byBuZXcgdmlzaWJsZSBuYXYgaXRlbXNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZU5hdlZpc2liaWxpdHkgKCkge1xuICAgIGlmICghbmF2IHx8IG5hdkFzVGh1bWJuYWlscykgeyByZXR1cm47IH1cblxuICAgIGlmIChwYWdlcyAhPT0gcGFnZXNDYWNoZWQpIHtcbiAgICAgIHZhciBtaW4gPSBwYWdlc0NhY2hlZCxcbiAgICAgICAgICBtYXggPSBwYWdlcyxcbiAgICAgICAgICBmbiA9IHNob3dFbGVtZW50O1xuXG4gICAgICBpZiAocGFnZXNDYWNoZWQgPiBwYWdlcykge1xuICAgICAgICBtaW4gPSBwYWdlcztcbiAgICAgICAgbWF4ID0gcGFnZXNDYWNoZWQ7XG4gICAgICAgIGZuID0gaGlkZUVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChtaW4gPCBtYXgpIHtcbiAgICAgICAgZm4obmF2SXRlbXNbbWluXSk7XG4gICAgICAgIG1pbisrO1xuICAgICAgfVxuXG4gICAgICAvLyBjYWNoZSBwYWdlc1xuICAgICAgcGFnZXNDYWNoZWQgPSBwYWdlcztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbmZvIChlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgc2xpZGVJdGVtczogc2xpZGVJdGVtcyxcbiAgICAgIG5hdkNvbnRhaW5lcjogbmF2Q29udGFpbmVyLFxuICAgICAgbmF2SXRlbXM6IG5hdkl0ZW1zLFxuICAgICAgY29udHJvbHNDb250YWluZXI6IGNvbnRyb2xzQ29udGFpbmVyLFxuICAgICAgaGFzQ29udHJvbHM6IGhhc0NvbnRyb2xzLFxuICAgICAgcHJldkJ1dHRvbjogcHJldkJ1dHRvbixcbiAgICAgIG5leHRCdXR0b246IG5leHRCdXR0b24sXG4gICAgICBpdGVtczogaXRlbXMsXG4gICAgICBzbGlkZUJ5OiBzbGlkZUJ5LFxuICAgICAgY2xvbmVDb3VudDogY2xvbmVDb3VudCxcbiAgICAgIHNsaWRlQ291bnQ6IHNsaWRlQ291bnQsXG4gICAgICBzbGlkZUNvdW50TmV3OiBzbGlkZUNvdW50TmV3LFxuICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgaW5kZXhDYWNoZWQ6IGluZGV4Q2FjaGVkLFxuICAgICAgZGlzcGxheUluZGV4OiBnZXRDdXJyZW50U2xpZGUoKSxcbiAgICAgIG5hdkN1cnJlbnRJbmRleDogbmF2Q3VycmVudEluZGV4LFxuICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkOiBuYXZDdXJyZW50SW5kZXhDYWNoZWQsXG4gICAgICBwYWdlczogcGFnZXMsXG4gICAgICBwYWdlc0NhY2hlZDogcGFnZXNDYWNoZWQsXG4gICAgICBzaGVldDogc2hlZXQsXG4gICAgICBpc09uOiBpc09uLFxuICAgICAgZXZlbnQ6IGUgfHwge30sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmVyc2lvbjogJzIuOS4yJyxcbiAgICBnZXRJbmZvOiBpbmZvLFxuICAgIGV2ZW50czogZXZlbnRzLFxuICAgIGdvVG86IGdvVG8sXG4gICAgcGxheTogcGxheSxcbiAgICBwYXVzZTogcGF1c2UsXG4gICAgaXNPbjogaXNPbixcbiAgICB1cGRhdGVTbGlkZXJIZWlnaHQ6IHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCxcbiAgICByZWZyZXNoOiBpbml0U2xpZGVyVHJhbnNmb3JtLFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgcmVidWlsZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdG5zKGV4dGVuZChvcHRpb25zLCBvcHRpb25zRWxlbWVudHMpKTtcbiAgICB9XG4gIH07XG59O1xuXG5yZXR1cm4gdG5zO1xufSkoKTsiLCIvKiFcbiAqIEJvb3RzdHJhcCB2My40LjEgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5cbmlmICh0eXBlb2YgalF1ZXJ5ID09PSAndW5kZWZpbmVkJykge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnknKVxufVxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgdmVyc2lvbiA9ICQuZm4uanF1ZXJ5LnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKVxuICBpZiAoKHZlcnNpb25bMF0gPCAyICYmIHZlcnNpb25bMV0gPCA5KSB8fCAodmVyc2lvblswXSA9PSAxICYmIHZlcnNpb25bMV0gPT0gOSAmJiB2ZXJzaW9uWzJdIDwgMSkgfHwgKHZlcnNpb25bMF0gPiAzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuOS4xIG9yIGhpZ2hlciwgYnV0IGxvd2VyIHRoYW4gdmVyc2lvbiA0JylcbiAgfVxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdHJhbnNpdGlvbi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0cmFuc2l0aW9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENTUyBUUkFOU0lUSU9OIFNVUFBPUlQgKFNob3V0b3V0OiBodHRwczovL21vZGVybml6ci5jb20vKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Jvb3RzdHJhcCcpXG5cbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0VHJhbnNpdGlvbiA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgIE1velRyYW5zaXRpb24gICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICBPVHJhbnNpdGlvbiAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgIHRyYW5zaXRpb24gICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV0gfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZSAvLyBleHBsaWNpdCBmb3IgaWU4ICggIC5fLilcbiAgfVxuXG4gIC8vIGh0dHBzOi8vYmxvZy5hbGV4bWFjY2F3LmNvbS9jc3MtdHJhbnNpdGlvbnNcbiAgJC5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgIHZhciBjYWxsZWQgPSBmYWxzZVxuICAgIHZhciAkZWwgPSB0aGlzXG4gICAgJCh0aGlzKS5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHsgY2FsbGVkID0gdHJ1ZSB9KVxuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgaWYgKCFjYWxsZWQpICQoJGVsKS50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCkgfVxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAkKGZ1bmN0aW9uICgpIHtcbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25FbmQoKVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuXG5cbiAgICAkLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kID0ge1xuICAgICAgYmluZFR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGRlbGVnYXRlVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhpcykpIHJldHVybiBlLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFsZXJ0LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2FsZXJ0c1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFMRVJUIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBkaXNtaXNzID0gJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXSdcbiAgdmFyIEFsZXJ0ICAgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAkKGVsKS5vbignY2xpY2snLCBkaXNtaXNzLCB0aGlzLmNsb3NlKVxuICB9XG5cbiAgQWxlcnQuVkVSU0lPTiA9ICczLjQuMSdcblxuICBBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgQWxlcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICAgPSAkKHRoaXMpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBzZWxlY3RvciAgICA9IHNlbGVjdG9yID09PSAnIycgPyBbXSA6IHNlbGVjdG9yXG4gICAgdmFyICRwYXJlbnQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgaWYgKCEkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgJHBhcmVudCA9ICR0aGlzLmNsb3Nlc3QoJy5hbGVydCcpXG4gICAgfVxuXG4gICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdjbG9zZS5icy5hbGVydCcpKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHBhcmVudC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudCgpIHtcbiAgICAgIC8vIGRldGFjaCBmcm9tIHBhcmVudCwgZmlyZSBldmVudCB0aGVuIGNsZWFuIHVwIGRhdGFcbiAgICAgICRwYXJlbnQuZGV0YWNoKCkudHJpZ2dlcignY2xvc2VkLmJzLmFsZXJ0JykucmVtb3ZlKClcbiAgICB9XG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkcGFyZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHBhcmVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCByZW1vdmVFbGVtZW50KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgcmVtb3ZlRWxlbWVudCgpXG4gIH1cblxuXG4gIC8vIEFMRVJUIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuYWxlcnQnKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JywgKGRhdGEgPSBuZXcgQWxlcnQodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hbGVydFxuXG4gICQuZm4uYWxlcnQgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hbGVydC5Db25zdHJ1Y3RvciA9IEFsZXJ0XG5cblxuICAvLyBBTEVSVCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWxlcnQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFsZXJ0ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUxFUlQgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuYWxlcnQuZGF0YS1hcGknLCBkaXNtaXNzLCBBbGVydC5wcm90b3R5cGUuY2xvc2UpXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGJ1dHRvbi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNidXR0b25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQlVUVE9OIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBCdXR0b24gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gJC5leHRlbmQoe30sIEJ1dHRvbi5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gIH1cblxuICBCdXR0b24uVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQnV0dG9uLkRFRkFVTFRTID0ge1xuICAgIGxvYWRpbmdUZXh0OiAnbG9hZGluZy4uLidcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgZCAgICA9ICdkaXNhYmxlZCdcbiAgICB2YXIgJGVsICA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgdmFsICA9ICRlbC5pcygnaW5wdXQnKSA/ICd2YWwnIDogJ2h0bWwnXG4gICAgdmFyIGRhdGEgPSAkZWwuZGF0YSgpXG5cbiAgICBzdGF0ZSArPSAnVGV4dCdcblxuICAgIGlmIChkYXRhLnJlc2V0VGV4dCA9PSBudWxsKSAkZWwuZGF0YSgncmVzZXRUZXh0JywgJGVsW3ZhbF0oKSlcblxuICAgIC8vIHB1c2ggdG8gZXZlbnQgbG9vcCB0byBhbGxvdyBmb3JtcyB0byBzdWJtaXRcbiAgICBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgJGVsW3ZhbF0oZGF0YVtzdGF0ZV0gPT0gbnVsbCA/IHRoaXMub3B0aW9uc1tzdGF0ZV0gOiBkYXRhW3N0YXRlXSlcblxuICAgICAgaWYgKHN0YXRlID09ICdsb2FkaW5nVGV4dCcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgICRlbC5hZGRDbGFzcyhkKS5hdHRyKGQsIGQpLnByb3AoZCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoZCkucmVtb3ZlQXR0cihkKS5wcm9wKGQsIGZhbHNlKVxuICAgICAgfVxuICAgIH0sIHRoaXMpLCAwKVxuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoYW5nZWQgPSB0cnVlXG4gICAgdmFyICRwYXJlbnQgPSB0aGlzLiRlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nKVxuXG4gICAgaWYgKCRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICB2YXIgJGlucHV0ID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbnB1dCcpXG4gICAgICBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAncmFkaW8nKSB7XG4gICAgICAgIGlmICgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgJHBhcmVudC5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2UgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xuICAgICAgICBpZiAoKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpICE9PSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgaWYgKGNoYW5nZWQpICRpbnB1dC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtcHJlc3NlZCcsICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG5cblxuICAvLyBCVVRUT04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYnV0dG9uJywgKGRhdGEgPSBuZXcgQnV0dG9uKHRoaXMsIG9wdGlvbnMpKSlcblxuICAgICAgaWYgKG9wdGlvbiA9PSAndG9nZ2xlJykgZGF0YS50b2dnbGUoKVxuICAgICAgZWxzZSBpZiAob3B0aW9uKSBkYXRhLnNldFN0YXRlKG9wdGlvbilcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYnV0dG9uXG5cbiAgJC5mbi5idXR0b24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5idXR0b24uQ29uc3RydWN0b3IgPSBCdXR0b25cblxuXG4gIC8vIEJVVFRPTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmJ1dHRvbi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYnV0dG9uID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQlVUVE9OIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJGJ0biA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKVxuICAgICAgUGx1Z2luLmNhbGwoJGJ0biwgJ3RvZ2dsZScpXG4gICAgICBpZiAoISgkKGUudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkpIHtcbiAgICAgICAgLy8gUHJldmVudCBkb3VibGUgY2xpY2sgb24gcmFkaW9zLCBhbmQgdGhlIGRvdWJsZSBzZWxlY3Rpb25zIChzbyBjYW5jZWxsYXRpb24pIG9uIGNoZWNrYm94ZXNcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIC8vIFRoZSB0YXJnZXQgY29tcG9uZW50IHN0aWxsIHJlY2VpdmUgdGhlIGZvY3VzXG4gICAgICAgIGlmICgkYnRuLmlzKCdpbnB1dCxidXR0b24nKSkgJGJ0bi50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIGVsc2UgJGJ0bi5maW5kKCdpbnB1dDp2aXNpYmxlLGJ1dHRvbjp2aXNpYmxlJykuZmlyc3QoKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9XG4gICAgfSlcbiAgICAub24oJ2ZvY3VzLmJzLmJ1dHRvbi5kYXRhLWFwaSBibHVyLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKS50b2dnbGVDbGFzcygnZm9jdXMnLCAvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpXG4gICAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY2Fyb3VzZWwuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY2Fyb3VzZWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDQVJPVVNFTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kaW5kaWNhdG9ycyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLmNhcm91c2VsLWluZGljYXRvcnMnKVxuICAgIHRoaXMub3B0aW9ucyAgICAgPSBvcHRpb25zXG4gICAgdGhpcy5wYXVzZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnNsaWRpbmcgICAgID0gbnVsbFxuICAgIHRoaXMuaW50ZXJ2YWwgICAgPSBudWxsXG4gICAgdGhpcy4kYWN0aXZlICAgICA9IG51bGxcbiAgICB0aGlzLiRpdGVtcyAgICAgID0gbnVsbFxuXG4gICAgdGhpcy5vcHRpb25zLmtleWJvYXJkICYmIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpXG5cbiAgICB0aGlzLm9wdGlvbnMucGF1c2UgPT0gJ2hvdmVyJyAmJiAhKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgJiYgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uKCdtb3VzZWVudGVyLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLnBhdXNlLCB0aGlzKSlcbiAgICAgIC5vbignbW91c2VsZWF2ZS5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5jeWNsZSwgdGhpcykpXG4gIH1cblxuICBDYXJvdXNlbC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gNjAwXG5cbiAgQ2Fyb3VzZWwuREVGQVVMVFMgPSB7XG4gICAgaW50ZXJ2YWw6IDUwMDAsXG4gICAgcGF1c2U6ICdob3ZlcicsXG4gICAgd3JhcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICgvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cbiAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgIGNhc2UgMzc6IHRoaXMucHJldigpOyBicmVha1xuICAgICAgY2FzZSAzOTogdGhpcy5uZXh0KCk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiByZXR1cm5cbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5jeWNsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSBmYWxzZSlcblxuICAgIHRoaXMuaW50ZXJ2YWwgJiYgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgdGhpcy5vcHRpb25zLmludGVydmFsXG4gICAgICAmJiAhdGhpcy5wYXVzZWRcbiAgICAgICYmICh0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoJC5wcm94eSh0aGlzLm5leHQsIHRoaXMpLCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwpKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtSW5kZXggPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHRoaXMuJGl0ZW1zID0gaXRlbS5wYXJlbnQoKS5jaGlsZHJlbignLml0ZW0nKVxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5pbmRleChpdGVtIHx8IHRoaXMuJGFjdGl2ZSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtRm9yRGlyZWN0aW9uID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYWN0aXZlKSB7XG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoYWN0aXZlKVxuICAgIHZhciB3aWxsV3JhcCA9IChkaXJlY3Rpb24gPT0gJ3ByZXYnICYmIGFjdGl2ZUluZGV4ID09PSAwKVxuICAgICAgICAgICAgICAgIHx8IChkaXJlY3Rpb24gPT0gJ25leHQnICYmIGFjdGl2ZUluZGV4ID09ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSlcbiAgICBpZiAod2lsbFdyYXAgJiYgIXRoaXMub3B0aW9ucy53cmFwKSByZXR1cm4gYWN0aXZlXG4gICAgdmFyIGRlbHRhID0gZGlyZWN0aW9uID09ICdwcmV2JyA/IC0xIDogMVxuICAgIHZhciBpdGVtSW5kZXggPSAoYWN0aXZlSW5kZXggKyBkZWx0YSkgJSB0aGlzLiRpdGVtcy5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuZXEoaXRlbUluZGV4KVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnRvID0gZnVuY3Rpb24gKHBvcykge1xuICAgIHZhciB0aGF0ICAgICAgICA9IHRoaXNcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleCh0aGlzLiRhY3RpdmUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpKVxuXG4gICAgaWYgKHBvcyA+ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSB8fCBwb3MgPCAwKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNsaWRpbmcpICAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50Lm9uZSgnc2xpZC5icy5jYXJvdXNlbCcsIGZ1bmN0aW9uICgpIHsgdGhhdC50byhwb3MpIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoYWN0aXZlSW5kZXggPT0gcG9zKSByZXR1cm4gdGhpcy5wYXVzZSgpLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzLnNsaWRlKHBvcyA+IGFjdGl2ZUluZGV4ID8gJ25leHQnIDogJ3ByZXYnLCB0aGlzLiRpdGVtcy5lcShwb3MpKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IHRydWUpXG5cbiAgICBpZiAodGhpcy4kZWxlbWVudC5maW5kKCcubmV4dCwgLnByZXYnKS5sZW5ndGggJiYgJC5zdXBwb3J0LnRyYW5zaXRpb24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpXG4gICAgICB0aGlzLmN5Y2xlKHRydWUpXG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnZhbCA9IGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5zbGlkZSgnbmV4dCcpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5zbGlkZSgncHJldicpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuc2xpZGUgPSBmdW5jdGlvbiAodHlwZSwgbmV4dCkge1xuICAgIHZhciAkYWN0aXZlICAgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpXG4gICAgdmFyICRuZXh0ICAgICA9IG5leHQgfHwgdGhpcy5nZXRJdGVtRm9yRGlyZWN0aW9uKHR5cGUsICRhY3RpdmUpXG4gICAgdmFyIGlzQ3ljbGluZyA9IHRoaXMuaW50ZXJ2YWxcbiAgICB2YXIgZGlyZWN0aW9uID0gdHlwZSA9PSAnbmV4dCcgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgdmFyIHRoYXQgICAgICA9IHRoaXNcblxuICAgIGlmICgkbmV4dC5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVybiAodGhpcy5zbGlkaW5nID0gZmFsc2UpXG5cbiAgICB2YXIgcmVsYXRlZFRhcmdldCA9ICRuZXh0WzBdXG4gICAgdmFyIHNsaWRlRXZlbnQgPSAkLkV2ZW50KCdzbGlkZS5icy5jYXJvdXNlbCcsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsXG4gICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxuICAgIH0pXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRlRXZlbnQpXG4gICAgaWYgKHNsaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5zbGlkaW5nID0gdHJ1ZVxuXG4gICAgaXNDeWNsaW5nICYmIHRoaXMucGF1c2UoKVxuXG4gICAgaWYgKHRoaXMuJGluZGljYXRvcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLiRpbmRpY2F0b3JzLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgIHZhciAkbmV4dEluZGljYXRvciA9ICQodGhpcy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoaXMuZ2V0SXRlbUluZGV4KCRuZXh0KV0pXG4gICAgICAkbmV4dEluZGljYXRvciAmJiAkbmV4dEluZGljYXRvci5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgICB2YXIgc2xpZEV2ZW50ID0gJC5FdmVudCgnc2xpZC5icy5jYXJvdXNlbCcsIHsgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCwgZGlyZWN0aW9uOiBkaXJlY3Rpb24gfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmICgkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdzbGlkZScpKSB7XG4gICAgICAkbmV4dC5hZGRDbGFzcyh0eXBlKVxuICAgICAgaWYgKHR5cGVvZiAkbmV4dCA9PT0gJ29iamVjdCcgJiYgJG5leHQubGVuZ3RoKSB7XG4gICAgICAgICRuZXh0WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuICAgICAgJGFjdGl2ZS5hZGRDbGFzcyhkaXJlY3Rpb24pXG4gICAgICAkbmV4dC5hZGRDbGFzcyhkaXJlY3Rpb24pXG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbmV4dC5yZW1vdmVDbGFzcyhbdHlwZSwgZGlyZWN0aW9uXS5qb2luKCcgJykpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoWydhY3RpdmUnLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSlcbiAgICAgICAgICB0aGF0LnNsaWRpbmcgPSBmYWxzZVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcbiAgICAgICAgICB9LCAwKVxuICAgICAgICB9KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICB9IGVsc2Uge1xuICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgdGhpcy5zbGlkaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgfVxuXG4gICAgaXNDeWNsaW5nICYmIHRoaXMuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ0FST1VTRUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ2Fyb3VzZWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG4gICAgICB2YXIgYWN0aW9uICA9IHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgPyBvcHRpb24gOiBvcHRpb25zLnNsaWRlXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnLCAoZGF0YSA9IG5ldyBDYXJvdXNlbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnbnVtYmVyJykgZGF0YS50byhvcHRpb24pXG4gICAgICBlbHNlIGlmIChhY3Rpb24pIGRhdGFbYWN0aW9uXSgpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLmludGVydmFsKSBkYXRhLnBhdXNlKCkuY3ljbGUoKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jYXJvdXNlbFxuXG4gICQuZm4uY2Fyb3VzZWwgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jYXJvdXNlbC5Db25zdHJ1Y3RvciA9IENhcm91c2VsXG5cblxuICAvLyBDQVJPVVNFTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY2Fyb3VzZWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNhcm91c2VsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ0FST1VTRUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICB2YXIgaHJlZiAgICA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIGlmIChocmVmKSB7XG4gICAgICBocmVmID0gaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciB0YXJnZXQgID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCBocmVmXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcblxuICAgIGlmICghJHRhcmdldC5oYXNDbGFzcygnY2Fyb3VzZWwnKSkgcmV0dXJuXG5cbiAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuICAgIHZhciBzbGlkZUluZGV4ID0gJHRoaXMuYXR0cignZGF0YS1zbGlkZS10bycpXG4gICAgaWYgKHNsaWRlSW5kZXgpIG9wdGlvbnMuaW50ZXJ2YWwgPSBmYWxzZVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9ucylcblxuICAgIGlmIChzbGlkZUluZGV4KSB7XG4gICAgICAkdGFyZ2V0LmRhdGEoJ2JzLmNhcm91c2VsJykudG8oc2xpZGVJbmRleClcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZV0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZS10b10nLCBjbGlja0hhbmRsZXIpXG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRjYXJvdXNlbCA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRjYXJvdXNlbCwgJGNhcm91c2VsLmRhdGEoKSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBjb2xsYXBzZS5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjb2xsYXBzZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoganNoaW50IGxhdGVkZWY6IGZhbHNlICovXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ09MTEFQU0UgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQ29sbGFwc2UgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy4kdHJpZ2dlciAgICAgID0gJCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnICsgZWxlbWVudC5pZCArICdcIl0sJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdJylcbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSBudWxsXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnBhcmVudCkge1xuICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLiRlbGVtZW50LCB0aGlzLiR0cmlnZ2VyKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMudG9nZ2xlKSB0aGlzLnRvZ2dsZSgpXG4gIH1cblxuICBDb2xsYXBzZS5WRVJTSU9OICA9ICczLjQuMSdcblxuICBDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzUwXG5cbiAgQ29sbGFwc2UuREVGQVVMVFMgPSB7XG4gICAgdG9nZ2xlOiB0cnVlXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZGltZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNXaWR0aCA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3dpZHRoJylcbiAgICByZXR1cm4gaGFzV2lkdGggPyAnd2lkdGgnIDogJ2hlaWdodCdcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmcgfHwgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgYWN0aXZlc0RhdGFcbiAgICB2YXIgYWN0aXZlcyA9IHRoaXMuJHBhcmVudCAmJiB0aGlzLiRwYXJlbnQuY2hpbGRyZW4oJy5wYW5lbCcpLmNoaWxkcmVuKCcuaW4sIC5jb2xsYXBzaW5nJylcblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBhY3RpdmVzRGF0YSA9IGFjdGl2ZXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgaWYgKGFjdGl2ZXNEYXRhICYmIGFjdGl2ZXNEYXRhLnRyYW5zaXRpb25pbmcpIHJldHVyblxuICAgIH1cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnc2hvdy5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIFBsdWdpbi5jYWxsKGFjdGl2ZXMsICdoaWRlJylcbiAgICAgIGFjdGl2ZXNEYXRhIHx8IGFjdGl2ZXMuZGF0YSgnYnMuY29sbGFwc2UnLCBudWxsKVxuICAgIH1cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpW2RpbWVuc2lvbl0oMClcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZSBpbicpW2RpbWVuc2lvbl0oJycpXG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC50cmlnZ2VyKCdzaG93bi5icy5jb2xsYXBzZScpXG4gICAgfVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcblxuICAgIHZhciBzY3JvbGxTaXplID0gJC5jYW1lbENhc2UoWydzY3JvbGwnLCBkaW1lbnNpb25dLmpvaW4oJy0nKSlcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pW2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFswXVtzY3JvbGxTaXplXSlcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmcgfHwgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSgpKVswXS5vZmZzZXRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlIGluJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy5jb2xsYXBzZScpXG4gICAgfVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIFtkaW1lbnNpb25dKDApXG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzW3RoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykgPyAnaGlkZScgOiAnc2hvdyddKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5nZXRQYXJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnBhcmVudClcbiAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicgKyB0aGlzLm9wdGlvbnMucGFyZW50ICsgJ1wiXScpXG4gICAgICAuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJGVsZW1lbnQpLCAkZWxlbWVudClcbiAgICAgIH0sIHRoaXMpKVxuICAgICAgLmVuZCgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzID0gZnVuY3Rpb24gKCRlbGVtZW50LCAkdHJpZ2dlcikge1xuICAgIHZhciBpc09wZW4gPSAkZWxlbWVudC5oYXNDbGFzcygnaW4nKVxuXG4gICAgJGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgICAkdHJpZ2dlclxuICAgICAgLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnLCAhaXNPcGVuKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdHJpZ2dlcikge1xuICAgIHZhciBocmVmXG4gICAgdmFyIHRhcmdldCA9ICR0cmlnZ2VyLmF0dHIoJ2RhdGEtdGFyZ2V0JylcbiAgICAgIHx8IChocmVmID0gJHRyaWdnZXIuYXR0cignaHJlZicpKSAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEgJiYgb3B0aW9ucy50b2dnbGUgJiYgL3Nob3d8aGlkZS8udGVzdChvcHRpb24pKSBvcHRpb25zLnRvZ2dsZSA9IGZhbHNlXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNvbGxhcHNlJywgKGRhdGEgPSBuZXcgQ29sbGFwc2UodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmNvbGxhcHNlXG5cbiAgJC5mbi5jb2xsYXBzZSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmNvbGxhcHNlLkNvbnN0cnVjdG9yID0gQ29sbGFwc2VcblxuXG4gIC8vIENPTExBUFNFIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5jb2xsYXBzZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY29sbGFwc2UgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDT0xMQVBTRSBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5jb2xsYXBzZS5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG5cbiAgICBpZiAoISR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgdmFyICR0YXJnZXQgPSBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdGhpcylcbiAgICB2YXIgZGF0YSAgICA9ICR0YXJnZXQuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgIHZhciBvcHRpb24gID0gZGF0YSA/ICd0b2dnbGUnIDogJHRoaXMuZGF0YSgpXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGRyb3Bkb3duLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Ryb3Bkb3duc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIERST1BET1dOIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBiYWNrZHJvcCA9ICcuZHJvcGRvd24tYmFja2Ryb3AnXG4gIHZhciB0b2dnbGUgICA9ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXSdcbiAgdmFyIERyb3Bkb3duID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAkKGVsZW1lbnQpLm9uKCdjbGljay5icy5kcm9wZG93bicsIHRoaXMudG9nZ2xlKVxuICB9XG5cbiAgRHJvcGRvd24uVkVSU0lPTiA9ICczLjQuMSdcblxuICBmdW5jdGlvbiBnZXRQYXJlbnQoJHRoaXMpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiAvI1tBLVphLXpdLy50ZXN0KHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciAkcGFyZW50ID0gc2VsZWN0b3IgIT09ICcjJyA/ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpIDogbnVsbFxuXG4gICAgcmV0dXJuICRwYXJlbnQgJiYgJHBhcmVudC5sZW5ndGggPyAkcGFyZW50IDogJHRoaXMucGFyZW50KClcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyTWVudXMoZSkge1xuICAgIGlmIChlICYmIGUud2hpY2ggPT09IDMpIHJldHVyblxuICAgICQoYmFja2Ryb3ApLnJlbW92ZSgpXG4gICAgJCh0b2dnbGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgICAgICAgPSAkKHRoaXMpXG4gICAgICB2YXIgJHBhcmVudCAgICAgICA9IGdldFBhcmVudCgkdGhpcylcbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cblxuICAgICAgaWYgKCEkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJykpIHJldHVyblxuXG4gICAgICBpZiAoZSAmJiBlLnR5cGUgPT0gJ2NsaWNrJyAmJiAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpICYmICQuY29udGFpbnMoJHBhcmVudFswXSwgZS50YXJnZXQpKSByZXR1cm5cblxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdoaWRlLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgJHRoaXMuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXG4gICAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdvcGVuJykudHJpZ2dlcigkLkV2ZW50KCdoaWRkZW4uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9KVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgIGNsZWFyTWVudXMoKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAhJHBhcmVudC5jbG9zZXN0KCcubmF2YmFyLW5hdicpLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiBtb2JpbGUgd2UgdXNlIGEgYmFja2Ryb3AgYmVjYXVzZSBjbGljayBldmVudHMgZG9uJ3QgZGVsZWdhdGVcbiAgICAgICAgJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2Ryb3Bkb3duLWJhY2tkcm9wJylcbiAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoJCh0aGlzKSlcbiAgICAgICAgICAub24oJ2NsaWNrJywgY2xlYXJNZW51cylcbiAgICAgIH1cblxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdzaG93LmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgJHRoaXNcbiAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpXG5cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLnRvZ2dsZUNsYXNzKCdvcGVuJylcbiAgICAgICAgLnRyaWdnZXIoJC5FdmVudCgnc2hvd24uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIS8oMzh8NDB8Mjd8MzIpLy50ZXN0KGUud2hpY2gpIHx8IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgIGlmICghaXNBY3RpdmUgJiYgZS53aGljaCAhPSAyNyB8fCBpc0FjdGl2ZSAmJiBlLndoaWNoID09IDI3KSB7XG4gICAgICBpZiAoZS53aGljaCA9PSAyNykgJHBhcmVudC5maW5kKHRvZ2dsZSkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgcmV0dXJuICR0aGlzLnRyaWdnZXIoJ2NsaWNrJylcbiAgICB9XG5cbiAgICB2YXIgZGVzYyA9ICcgbGk6bm90KC5kaXNhYmxlZCk6dmlzaWJsZSBhJ1xuICAgIHZhciAkaXRlbXMgPSAkcGFyZW50LmZpbmQoJy5kcm9wZG93bi1tZW51JyArIGRlc2MpXG5cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHJldHVyblxuXG4gICAgdmFyIGluZGV4ID0gJGl0ZW1zLmluZGV4KGUudGFyZ2V0KVxuXG4gICAgaWYgKGUud2hpY2ggPT0gMzggJiYgaW5kZXggPiAwKSAgICAgICAgICAgICAgICAgaW5kZXgtLSAgICAgICAgIC8vIHVwXG4gICAgaWYgKGUud2hpY2ggPT0gNDAgJiYgaW5kZXggPCAkaXRlbXMubGVuZ3RoIC0gMSkgaW5kZXgrKyAgICAgICAgIC8vIGRvd25cbiAgICBpZiAoIX5pbmRleCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDBcblxuICAgICRpdGVtcy5lcShpbmRleCkudHJpZ2dlcignZm9jdXMnKVxuICB9XG5cblxuICAvLyBEUk9QRE9XTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicsIChkYXRhID0gbmV3IERyb3Bkb3duKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uZHJvcGRvd25cblxuICAkLmZuLmRyb3Bkb3duICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IgPSBEcm9wZG93blxuXG5cbiAgLy8gRFJPUERPV04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmRyb3Bkb3duLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5kcm9wZG93biA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFQUExZIFRPIFNUQU5EQVJEIERST1BET1dOIEVMRU1FTlRTXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgY2xlYXJNZW51cylcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93biBmb3JtJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUpXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duLW1lbnUnLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogbW9kYWwuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jbW9kYWxzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gTU9EQUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIE1vZGFsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy4kYm9keSA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGRpYWxvZyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLm1vZGFsLWRpYWxvZycpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gICAgdGhpcy5pc1Nob3duID0gbnVsbFxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAwXG4gICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICB0aGlzLmZpeGVkQ29udGVudCA9ICcubmF2YmFyLWZpeGVkLXRvcCwgLm5hdmJhci1maXhlZC1ib3R0b20nXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW90ZSkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAuZmluZCgnLm1vZGFsLWNvbnRlbnQnKVxuICAgICAgICAubG9hZCh0aGlzLm9wdGlvbnMucmVtb3RlLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2xvYWRlZC5icy5tb2RhbCcpXG4gICAgICAgIH0sIHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDMwMFxuICBNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgTW9kYWwuREVGQVVMVFMgPSB7XG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgc2hvdzogdHJ1ZVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmlzU2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAodGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gdHJ1ZVxuXG4gICAgdGhpcy5jaGVja1Njcm9sbGJhcigpXG4gICAgdGhpcy5zZXRTY3JvbGxiYXIoKVxuICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9uKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub25lKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhhdC4kZWxlbWVudCkpIHRoYXQuaWdub3JlQmFja2Ryb3BDbGljayA9IHRydWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRyYW5zaXRpb24gPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGF0LiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJylcblxuICAgICAgaWYgKCF0aGF0LiRlbGVtZW50LnBhcmVudCgpLmxlbmd0aCkge1xuICAgICAgICB0aGF0LiRlbGVtZW50LmFwcGVuZFRvKHRoYXQuJGJvZHkpIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgIC5zaG93KClcbiAgICAgICAgLnNjcm9sbFRvcCgwKVxuXG4gICAgICB0aGF0LmFkanVzdERpYWxvZygpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgdGhhdC5lbmZvcmNlRm9jdXMoKVxuXG4gICAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3duLmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgICB0cmFuc2l0aW9uID9cbiAgICAgICAgdGhhdC4kZGlhbG9nIC8vIHdhaXQgZm9yIG1vZGFsIHRvIHNsaWRlIGluXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBlID0gJC5FdmVudCgnaGlkZS5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICghdGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gZmFsc2VcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICAkKGRvY3VtZW50KS5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdpbicpXG4gICAgICAub2ZmKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICAgIC5vZmYoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRkaWFsb2cub2ZmKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KHRoaXMuaGlkZU1vZGFsLCB0aGlzKSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHRoaXMuaGlkZU1vZGFsKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lbmZvcmNlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudClcbiAgICAgIC5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKSAvLyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGZvY3VzIGxvb3BcbiAgICAgIC5vbignZm9jdXNpbi5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50ICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgIHRoaXMuJGVsZW1lbnRbMF0gIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgIXRoaXMuJGVsZW1lbnQuaGFzKGUudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcykpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZXNjYXBlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUud2hpY2ggPT0gMjcgJiYgdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93bikge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duKSB7XG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5icy5tb2RhbCcsICQucHJveHkodGhpcy5oYW5kbGVVcGRhdGUsIHRoaXMpKVxuICAgIH0gZWxzZSB7XG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdGhpcy4kZWxlbWVudC5oaWRlKClcbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGJvZHkucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKVxuICAgICAgdGhhdC5yZXNldEFkanVzdG1lbnRzKClcbiAgICAgIHRoYXQucmVzZXRTY3JvbGxiYXIoKVxuICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRkZW4uYnMubW9kYWwnKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVtb3ZlQmFja2Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYmFja2Ryb3AgJiYgdGhpcy4kYmFja2Ryb3AucmVtb3ZlKClcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5iYWNrZHJvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBhbmltYXRlID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID8gJ2ZhZGUnIDogJydcblxuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmJhY2tkcm9wKSB7XG4gICAgICB2YXIgZG9BbmltYXRlID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgYW5pbWF0ZVxuXG4gICAgICB0aGlzLiRiYWNrZHJvcCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgIC5hZGRDbGFzcygnbW9kYWwtYmFja2Ryb3AgJyArIGFuaW1hdGUpXG4gICAgICAgIC5hcHBlbmRUbyh0aGlzLiRib2R5KVxuXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrKSB7XG4gICAgICAgICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkgcmV0dXJuXG4gICAgICAgIHRoaXMub3B0aW9ucy5iYWNrZHJvcCA9PSAnc3RhdGljJ1xuICAgICAgICAgID8gdGhpcy4kZWxlbWVudFswXS5mb2N1cygpXG4gICAgICAgICAgOiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG5cbiAgICAgIGlmIChkb0FuaW1hdGUpIHRoaXMuJGJhY2tkcm9wWzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuXG4gICAgICB0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm5cblxuICAgICAgZG9BbmltYXRlID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFjaylcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFjaygpXG5cbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24gJiYgdGhpcy4kYmFja2Ryb3ApIHtcbiAgICAgIHRoaXMuJGJhY2tkcm9wLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAgIHZhciBjYWxsYmFja1JlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2tSZW1vdmUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2tSZW1vdmUoKVxuXG4gICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZXNlIGZvbGxvd2luZyBtZXRob2RzIGFyZSB1c2VkIHRvIGhhbmRsZSBvdmVyZmxvd2luZyBtb2RhbHNcblxuICBNb2RhbC5wcm90b3R5cGUuaGFuZGxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWRqdXN0RGlhbG9nKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5hZGp1c3REaWFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGFsSXNPdmVyZmxvd2luZyA9IHRoaXMuJGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICF0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmIG1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiAhbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldEFkanVzdG1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmNoZWNrU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGlmICghZnVsbFdpbmRvd1dpZHRoKSB7IC8vIHdvcmthcm91bmQgZm9yIG1pc3Npbmcgd2luZG93LmlubmVyV2lkdGggaW4gSUU4XG4gICAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgZnVsbFdpbmRvd1dpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdClcbiAgICB9XG4gICAgdGhpcy5ib2R5SXNPdmVyZmxvd2luZyA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2luZG93V2lkdGhcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5tZWFzdXJlU2Nyb2xsYmFyKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJvZHlQYWQgPSBwYXJzZUludCgodGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnKSB8fCAwKSwgMTApXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAnJ1xuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGhcbiAgICBpZiAodGhpcy5ib2R5SXNPdmVyZmxvd2luZykge1xuICAgICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCBib2R5UGFkICsgc2Nyb2xsYmFyV2lkdGgpXG4gICAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYWN0dWFsUGFkZGluZyA9IGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0XG4gICAgICAgIHZhciBjYWxjdWxhdGVkUGFkZGluZyA9ICQoZWxlbWVudCkuY3NzKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgICAgJChlbGVtZW50KVxuICAgICAgICAgIC5kYXRhKCdwYWRkaW5nLXJpZ2h0JywgYWN0dWFsUGFkZGluZylcbiAgICAgICAgICAuY3NzKCdwYWRkaW5nLXJpZ2h0JywgcGFyc2VGbG9hdChjYWxjdWxhdGVkUGFkZGluZykgKyBzY3JvbGxiYXJXaWR0aCArICdweCcpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIHRoaXMub3JpZ2luYWxCb2R5UGFkKVxuICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICB2YXIgcGFkZGluZyA9ICQoZWxlbWVudCkuZGF0YSgncGFkZGluZy1yaWdodCcpXG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZURhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nID8gcGFkZGluZyA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5tZWFzdXJlU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkgeyAvLyB0aHggd2Fsc2hcbiAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJ1xuICAgIHRoaXMuJGJvZHkuYXBwZW5kKHNjcm9sbERpdilcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGhcbiAgICB0aGlzLiRib2R5WzBdLnJlbW92ZUNoaWxkKHNjcm9sbERpdilcbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGhcbiAgfVxuXG5cbiAgLy8gTU9EQUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uLCBfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdicy5tb2RhbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNb2RhbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5tb2RhbCcsIChkYXRhID0gbmV3IE1vZGFsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oX3JlbGF0ZWRUYXJnZXQpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLnNob3cpIGRhdGEuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ubW9kYWxcblxuICAkLmZuLm1vZGFsID0gUGx1Z2luXG4gICQuZm4ubW9kYWwuQ29uc3RydWN0b3IgPSBNb2RhbFxuXG5cbiAgLy8gTU9EQUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLm1vZGFsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5tb2RhbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIE1PREFMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLm1vZGFsLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICB2YXIgdGFyZ2V0ID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fFxuICAgICAgKGhyZWYgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG4gICAgdmFyIG9wdGlvbiA9ICR0YXJnZXQuZGF0YSgnYnMubW9kYWwnKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoeyByZW1vdGU6ICEvIy8udGVzdChocmVmKSAmJiBocmVmIH0sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG5cbiAgICBpZiAoJHRoaXMuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAkdGFyZ2V0Lm9uZSgnc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChzaG93RXZlbnQpIHtcbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVybiAvLyBvbmx5IHJlZ2lzdGVyIGZvY3VzIHJlc3RvcmVyIGlmIG1vZGFsIHdpbGwgYWN0dWFsbHkgZ2V0IHNob3duXG4gICAgICAkdGFyZ2V0Lm9uZSgnaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkdGhpcy5pcygnOnZpc2libGUnKSAmJiAkdGhpcy50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9KVxuICAgIH0pXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uLCB0aGlzKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0b29sdGlwLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Rvb2x0aXBcbiAqIEluc3BpcmVkIGJ5IHRoZSBvcmlnaW5hbCBqUXVlcnkudGlwc3kgYnkgSmFzb24gRnJhbWVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIERJU0FMTE9XRURfQVRUUklCVVRFUyA9IFsnc2FuaXRpemUnLCAnd2hpdGVMaXN0JywgJ3Nhbml0aXplRm4nXVxuXG4gIHZhciB1cmlBdHRycyA9IFtcbiAgICAnYmFja2dyb3VuZCcsXG4gICAgJ2NpdGUnLFxuICAgICdocmVmJyxcbiAgICAnaXRlbXR5cGUnLFxuICAgICdsb25nZGVzYycsXG4gICAgJ3Bvc3RlcicsXG4gICAgJ3NyYycsXG4gICAgJ3hsaW5rOmhyZWYnXG4gIF1cblxuICB2YXIgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiA9IC9eYXJpYS1bXFx3LV0qJC9pXG5cbiAgdmFyIERlZmF1bHRXaGl0ZWxpc3QgPSB7XG4gICAgLy8gR2xvYmFsIGF0dHJpYnV0ZXMgYWxsb3dlZCBvbiBhbnkgc3VwcGxpZWQgZWxlbWVudCBiZWxvdy5cbiAgICAnKic6IFsnY2xhc3MnLCAnZGlyJywgJ2lkJywgJ2xhbmcnLCAncm9sZScsIEFSSUFfQVRUUklCVVRFX1BBVFRFUk5dLFxuICAgIGE6IFsndGFyZ2V0JywgJ2hyZWYnLCAndGl0bGUnLCAncmVsJ10sXG4gICAgYXJlYTogW10sXG4gICAgYjogW10sXG4gICAgYnI6IFtdLFxuICAgIGNvbDogW10sXG4gICAgY29kZTogW10sXG4gICAgZGl2OiBbXSxcbiAgICBlbTogW10sXG4gICAgaHI6IFtdLFxuICAgIGgxOiBbXSxcbiAgICBoMjogW10sXG4gICAgaDM6IFtdLFxuICAgIGg0OiBbXSxcbiAgICBoNTogW10sXG4gICAgaDY6IFtdLFxuICAgIGk6IFtdLFxuICAgIGltZzogWydzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3dpZHRoJywgJ2hlaWdodCddLFxuICAgIGxpOiBbXSxcbiAgICBvbDogW10sXG4gICAgcDogW10sXG4gICAgcHJlOiBbXSxcbiAgICBzOiBbXSxcbiAgICBzbWFsbDogW10sXG4gICAgc3BhbjogW10sXG4gICAgc3ViOiBbXSxcbiAgICBzdXA6IFtdLFxuICAgIHN0cm9uZzogW10sXG4gICAgdTogW10sXG4gICAgdWw6IFtdXG4gIH1cblxuICAvKipcbiAgICogQSBwYXR0ZXJuIHRoYXQgcmVjb2duaXplcyBhIGNvbW1vbmx5IHVzZWZ1bCBzdWJzZXQgb2YgVVJMcyB0aGF0IGFyZSBzYWZlLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgU0FGRV9VUkxfUEFUVEVSTiA9IC9eKD86KD86aHR0cHM/fG1haWx0b3xmdHB8dGVsfGZpbGUpOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvZ2lcblxuICAvKipcbiAgICogQSBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBzYWZlIGRhdGEgVVJMcy4gT25seSBtYXRjaGVzIGltYWdlLCB2aWRlbyBhbmQgYXVkaW8gdHlwZXMuXG4gICAqXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcbiAgICovXG4gIHZhciBEQVRBX1VSTF9QQVRURVJOID0gL15kYXRhOig/OmltYWdlXFwvKD86Ym1wfGdpZnxqcGVnfGpwZ3xwbmd8dGlmZnx3ZWJwKXx2aWRlb1xcLyg/Om1wZWd8bXA0fG9nZ3x3ZWJtKXxhdWRpb1xcLyg/Om1wM3xvZ2F8b2dnfG9wdXMpKTtiYXNlNjQsW2EtejAtOSsvXSs9KiQvaVxuXG4gIGZ1bmN0aW9uIGFsbG93ZWRBdHRyaWJ1dGUoYXR0ciwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpIHtcbiAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSAhPT0gLTEpIHtcbiAgICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIHVyaUF0dHJzKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oYXR0ci5ub2RlVmFsdWUubWF0Y2goU0FGRV9VUkxfUEFUVEVSTikgfHwgYXR0ci5ub2RlVmFsdWUubWF0Y2goREFUQV9VUkxfUEFUVEVSTikpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgdmFyIHJlZ0V4cCA9ICQoYWxsb3dlZEF0dHJpYnV0ZUxpc3QpLmZpbHRlcihmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICB9KVxuXG4gICAgLy8gQ2hlY2sgaWYgYSByZWd1bGFyIGV4cHJlc3Npb24gdmFsaWRhdGVzIHRoZSBhdHRyaWJ1dGUuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWdFeHAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoYXR0ck5hbWUubWF0Y2gocmVnRXhwW2ldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHdoaXRlTGlzdCwgc2FuaXRpemVGbikge1xuICAgIGlmICh1bnNhZmVIdG1sLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgICB9XG5cbiAgICBpZiAoc2FuaXRpemVGbiAmJiB0eXBlb2Ygc2FuaXRpemVGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHNhbml0aXplRm4odW5zYWZlSHRtbClcbiAgICB9XG5cbiAgICAvLyBJRSA4IGFuZCBiZWxvdyBkb24ndCBzdXBwb3J0IGNyZWF0ZUhUTUxEb2N1bWVudFxuICAgIGlmICghZG9jdW1lbnQuaW1wbGVtZW50YXRpb24gfHwgIWRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgICB9XG5cbiAgICB2YXIgY3JlYXRlZERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdzYW5pdGl6YXRpb24nKVxuICAgIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IHVuc2FmZUh0bWxcblxuICAgIHZhciB3aGl0ZWxpc3RLZXlzID0gJC5tYXAod2hpdGVMaXN0LCBmdW5jdGlvbiAoZWwsIGkpIHsgcmV0dXJuIGkgfSlcbiAgICB2YXIgZWxlbWVudHMgPSAkKGNyZWF0ZWREb2N1bWVudC5ib2R5KS5maW5kKCcqJylcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGVsID0gZWxlbWVudHNbaV1cbiAgICAgIHZhciBlbE5hbWUgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgIGlmICgkLmluQXJyYXkoZWxOYW1lLCB3aGl0ZWxpc3RLZXlzKSA9PT0gLTEpIHtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB2YXIgYXR0cmlidXRlTGlzdCA9ICQubWFwKGVsLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gZWwgfSlcbiAgICAgIHZhciB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMgPSBbXS5jb25jYXQod2hpdGVMaXN0WycqJ10gfHwgW10sIHdoaXRlTGlzdFtlbE5hbWVdIHx8IFtdKVxuXG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuMiA9IGF0dHJpYnV0ZUxpc3QubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XG4gICAgICAgIGlmICghYWxsb3dlZEF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLCB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0ubm9kZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MXG4gIH1cblxuICAvLyBUT09MVElQIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy50eXBlICAgICAgID0gbnVsbFxuICAgIHRoaXMub3B0aW9ucyAgICA9IG51bGxcbiAgICB0aGlzLmVuYWJsZWQgICAgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ICAgID0gbnVsbFxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcbiAgICB0aGlzLiRlbGVtZW50ICAgPSBudWxsXG4gICAgdGhpcy5pblN0YXRlICAgID0gbnVsbFxuXG4gICAgdGhpcy5pbml0KCd0b29sdGlwJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIFRvb2x0aXAuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVG9vbHRpcC5ERUZBVUxUUyA9IHtcbiAgICBhbmltYXRpb246IHRydWUsXG4gICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICBzZWxlY3RvcjogZmFsc2UsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsXG4gICAgdHJpZ2dlcjogJ2hvdmVyIGZvY3VzJyxcbiAgICB0aXRsZTogJycsXG4gICAgZGVsYXk6IDAsXG4gICAgaHRtbDogZmFsc2UsXG4gICAgY29udGFpbmVyOiBmYWxzZSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgc2VsZWN0b3I6ICdib2R5JyxcbiAgICAgIHBhZGRpbmc6IDBcbiAgICB9LFxuICAgIHNhbml0aXplIDogdHJ1ZSxcbiAgICBzYW5pdGl6ZUZuIDogbnVsbCxcbiAgICB3aGl0ZUxpc3QgOiBEZWZhdWx0V2hpdGVsaXN0XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVuYWJsZWQgICA9IHRydWVcbiAgICB0aGlzLnR5cGUgICAgICA9IHR5cGVcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9IHRoaXMuZ2V0T3B0aW9ucyhvcHRpb25zKVxuICAgIHRoaXMuJHZpZXdwb3J0ID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmICQoZG9jdW1lbnQpLmZpbmQoJC5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy52aWV3cG9ydCkgPyB0aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLCB0aGlzLiRlbGVtZW50KSA6ICh0aGlzLm9wdGlvbnMudmlld3BvcnQuc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLnZpZXdwb3J0KSlcbiAgICB0aGlzLmluU3RhdGUgICA9IHsgY2xpY2s6IGZhbHNlLCBob3ZlcjogZmFsc2UsIGZvY3VzOiBmYWxzZSB9XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXSBpbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yICYmICF0aGlzLm9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlbGVjdG9yYCBvcHRpb24gbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgJyArIHRoaXMudHlwZSArICcgb24gdGhlIHdpbmRvdy5kb2N1bWVudCBvYmplY3QhJylcbiAgICB9XG5cbiAgICB2YXIgdHJpZ2dlcnMgPSB0aGlzLm9wdGlvbnMudHJpZ2dlci5zcGxpdCgnICcpXG5cbiAgICBmb3IgKHZhciBpID0gdHJpZ2dlcnMubGVuZ3RoOyBpLS07KSB7XG4gICAgICB2YXIgdHJpZ2dlciA9IHRyaWdnZXJzW2ldXG5cbiAgICAgIGlmICh0cmlnZ2VyID09ICdjbGljaycpIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMudG9nZ2xlLCB0aGlzKSlcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciAhPSAnbWFudWFsJykge1xuICAgICAgICB2YXIgZXZlbnRJbiAgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VlbnRlcicgOiAnZm9jdXNpbidcbiAgICAgICAgdmFyIGV2ZW50T3V0ID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlbGVhdmUnIDogJ2ZvY3Vzb3V0J1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRJbiAgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmVudGVyLCB0aGlzKSlcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudE91dCArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMubGVhdmUsIHRoaXMpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5zZWxlY3RvciA/XG4gICAgICAodGhpcy5fb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHsgdHJpZ2dlcjogJ21hbnVhbCcsIHNlbGVjdG9yOiAnJyB9KSkgOlxuICAgICAgdGhpcy5maXhUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gVG9vbHRpcC5ERUZBVUxUU1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGRhdGFBdHRyaWJ1dGVzID0gdGhpcy4kZWxlbWVudC5kYXRhKClcblxuICAgIGZvciAodmFyIGRhdGFBdHRyIGluIGRhdGFBdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoZGF0YUF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoZGF0YUF0dHIpICYmICQuaW5BcnJheShkYXRhQXR0ciwgRElTQUxMT1dFRF9BVFRSSUJVVEVTKSAhPT0gLTEpIHtcbiAgICAgICAgZGVsZXRlIGRhdGFBdHRyaWJ1dGVzW2RhdGFBdHRyXVxuICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBkYXRhQXR0cmlidXRlcywgb3B0aW9ucylcblxuICAgIGlmIChvcHRpb25zLmRlbGF5ICYmIHR5cGVvZiBvcHRpb25zLmRlbGF5ID09ICdudW1iZXInKSB7XG4gICAgICBvcHRpb25zLmRlbGF5ID0ge1xuICAgICAgICBzaG93OiBvcHRpb25zLmRlbGF5LFxuICAgICAgICBoaWRlOiBvcHRpb25zLmRlbGF5XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBzYW5pdGl6ZUh0bWwob3B0aW9ucy50ZW1wbGF0ZSwgb3B0aW9ucy53aGl0ZUxpc3QsIG9wdGlvbnMuc2FuaXRpemVGbilcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVsZWdhdGVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zICA9IHt9XG4gICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0cygpXG5cbiAgICB0aGlzLl9vcHRpb25zICYmICQuZWFjaCh0aGlzLl9vcHRpb25zLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKGRlZmF1bHRzW2tleV0gIT0gdmFsdWUpIG9wdGlvbnNba2V5XSA9IHZhbHVlXG4gICAgfSlcblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbnRlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c2luJyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAoc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSB8fCBzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykge1xuICAgICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdykgcmV0dXJuIHNlbGYuc2hvdygpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykgc2VsZi5zaG93KClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmlzSW5TdGF0ZVRydWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaW5TdGF0ZSkge1xuICAgICAgaWYgKHRoaXMuaW5TdGF0ZVtrZXldKSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUubGVhdmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNvdXQnID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHJldHVyblxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdvdXQnXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpIHJldHVybiBzZWxmLmhpZGUoKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdvdXQnKSBzZWxmLmhpZGUoKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5oaWRlKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICh0aGlzLmhhc0NvbnRlbnQoKSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICB2YXIgaW5Eb20gPSAkLmNvbnRhaW5zKHRoaXMuJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMuJGVsZW1lbnRbMF0pXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCAhaW5Eb20pIHJldHVyblxuICAgICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxuXG4gICAgICB2YXIgdGlwSWQgPSB0aGlzLmdldFVJRCh0aGlzLnR5cGUpXG5cbiAgICAgIHRoaXMuc2V0Q29udGVudCgpXG4gICAgICAkdGlwLmF0dHIoJ2lkJywgdGlwSWQpXG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24pICR0aXAuYWRkQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICB2YXIgcGxhY2VtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLCAkdGlwWzBdLCB0aGlzLiRlbGVtZW50WzBdKSA6XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnRcblxuICAgICAgdmFyIGF1dG9Ub2tlbiA9IC9cXHM/YXV0bz9cXHM/L2lcbiAgICAgIHZhciBhdXRvUGxhY2UgPSBhdXRvVG9rZW4udGVzdChwbGFjZW1lbnQpXG4gICAgICBpZiAoYXV0b1BsYWNlKSBwbGFjZW1lbnQgPSBwbGFjZW1lbnQucmVwbGFjZShhdXRvVG9rZW4sICcnKSB8fCAndG9wJ1xuXG4gICAgICAkdGlwXG4gICAgICAgIC5kZXRhY2goKVxuICAgICAgICAuY3NzKHsgdG9wOiAwLCBsZWZ0OiAwLCBkaXNwbGF5OiAnYmxvY2snIH0pXG4gICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICAgIC5kYXRhKCdicy4nICsgdGhpcy50eXBlLCB0aGlzKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuY29udGFpbmVyID8gJHRpcC5hcHBlbmRUbygkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5jb250YWluZXIpKSA6ICR0aXAuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudClcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignaW5zZXJ0ZWQuYnMuJyArIHRoaXMudHlwZSlcblxuICAgICAgdmFyIHBvcyAgICAgICAgICA9IHRoaXMuZ2V0UG9zaXRpb24oKVxuICAgICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgICBpZiAoYXV0b1BsYWNlKSB7XG4gICAgICAgIHZhciBvcmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRcbiAgICAgICAgdmFyIHZpZXdwb3J0RGltID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgJiYgcG9zLmJvdHRvbSArIGFjdHVhbEhlaWdodCA+IHZpZXdwb3J0RGltLmJvdHRvbSA/ICd0b3AnICAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgICYmIHBvcy50b3AgICAgLSBhY3R1YWxIZWlnaHQgPCB2aWV3cG9ydERpbS50b3AgICAgPyAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAncmlnaHQnICAmJiBwb3MucmlnaHQgICsgYWN0dWFsV2lkdGggID4gdmlld3BvcnREaW0ud2lkdGggID8gJ2xlZnQnICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgJiYgcG9zLmxlZnQgICAtIGFjdHVhbFdpZHRoICA8IHZpZXdwb3J0RGltLmxlZnQgICA/ICdyaWdodCcgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50XG5cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhvcmdQbGFjZW1lbnQpXG4gICAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGN1bGF0ZWRPZmZzZXQgPSB0aGlzLmdldENhbGN1bGF0ZWRPZmZzZXQocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICAgIHRoaXMuYXBwbHlQbGFjZW1lbnQoY2FsY3VsYXRlZE9mZnNldCwgcGxhY2VtZW50KVxuXG4gICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmV2SG92ZXJTdGF0ZSA9IHRoYXQuaG92ZXJTdGF0ZVxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3Nob3duLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICAgIHRoYXQuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgICAgICBpZiAocHJldkhvdmVyU3RhdGUgPT0gJ291dCcpIHRoYXQubGVhdmUodGhhdClcbiAgICAgIH1cblxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICAkdGlwXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjb21wbGV0ZSgpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQgPSBmdW5jdGlvbiAob2Zmc2V0LCBwbGFjZW1lbnQpIHtcbiAgICB2YXIgJHRpcCAgID0gdGhpcy50aXAoKVxuICAgIHZhciB3aWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAvLyBtYW51YWxseSByZWFkIG1hcmdpbnMgYmVjYXVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaW5jbHVkZXMgZGlmZmVyZW5jZVxuICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLXRvcCcpLCAxMClcbiAgICB2YXIgbWFyZ2luTGVmdCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMClcblxuICAgIC8vIHdlIG11c3QgY2hlY2sgZm9yIE5hTiBmb3IgaWUgOC85XG4gICAgaWYgKGlzTmFOKG1hcmdpblRvcCkpICBtYXJnaW5Ub3AgID0gMFxuICAgIGlmIChpc05hTihtYXJnaW5MZWZ0KSkgbWFyZ2luTGVmdCA9IDBcblxuICAgIG9mZnNldC50b3AgICs9IG1hcmdpblRvcFxuICAgIG9mZnNldC5sZWZ0ICs9IG1hcmdpbkxlZnRcblxuICAgIC8vICQuZm4ub2Zmc2V0IGRvZXNuJ3Qgcm91bmQgcGl4ZWwgdmFsdWVzXG4gICAgLy8gc28gd2UgdXNlIHNldE9mZnNldCBkaXJlY3RseSB3aXRoIG91ciBvd24gZnVuY3Rpb24gQi0wXG4gICAgJC5vZmZzZXQuc2V0T2Zmc2V0KCR0aXBbMF0sICQuZXh0ZW5kKHtcbiAgICAgIHVzaW5nOiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgJHRpcC5jc3Moe1xuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChwcm9wcy50b3ApLFxuICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQocHJvcHMubGVmdClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBvZmZzZXQpLCAwKVxuXG4gICAgJHRpcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHBsYWNpbmcgdGlwIGluIG5ldyBvZmZzZXQgY2F1c2VkIHRoZSB0aXAgdG8gcmVzaXplIGl0c2VsZlxuICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICBpZiAocGxhY2VtZW50ID09ICd0b3AnICYmIGFjdHVhbEhlaWdodCAhPSBoZWlnaHQpIHtcbiAgICAgIG9mZnNldC50b3AgPSBvZmZzZXQudG9wICsgaGVpZ2h0IC0gYWN0dWFsSGVpZ2h0XG4gICAgfVxuXG4gICAgdmFyIGRlbHRhID0gdGhpcy5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEocGxhY2VtZW50LCBvZmZzZXQsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICBpZiAoZGVsdGEubGVmdCkgb2Zmc2V0LmxlZnQgKz0gZGVsdGEubGVmdFxuICAgIGVsc2Ugb2Zmc2V0LnRvcCArPSBkZWx0YS50b3BcblxuICAgIHZhciBpc1ZlcnRpY2FsICAgICAgICAgID0gL3RvcHxib3R0b20vLnRlc3QocGxhY2VtZW50KVxuICAgIHZhciBhcnJvd0RlbHRhICAgICAgICAgID0gaXNWZXJ0aWNhbCA/IGRlbHRhLmxlZnQgKiAyIC0gd2lkdGggKyBhY3R1YWxXaWR0aCA6IGRlbHRhLnRvcCAqIDIgLSBoZWlnaHQgKyBhY3R1YWxIZWlnaHRcbiAgICB2YXIgYXJyb3dPZmZzZXRQb3NpdGlvbiA9IGlzVmVydGljYWwgPyAnb2Zmc2V0V2lkdGgnIDogJ29mZnNldEhlaWdodCdcblxuICAgICR0aXAub2Zmc2V0KG9mZnNldClcbiAgICB0aGlzLnJlcGxhY2VBcnJvdyhhcnJvd0RlbHRhLCAkdGlwWzBdW2Fycm93T2Zmc2V0UG9zaXRpb25dLCBpc1ZlcnRpY2FsKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUucmVwbGFjZUFycm93ID0gZnVuY3Rpb24gKGRlbHRhLCBkaW1lbnNpb24sIGlzVmVydGljYWwpIHtcbiAgICB0aGlzLmFycm93KClcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnLCA1MCAqICgxIC0gZGVsdGEgLyBkaW1lbnNpb24pICsgJyUnKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ3RvcCcgOiAnbGVmdCcsICcnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgdGl0bGUgPSBzYW5pdGl6ZUh0bWwodGl0bGUsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICAgICAgfVxuXG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykuaHRtbCh0aXRsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLnRleHQodGl0bGUpXG4gICAgfVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHQnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdoaWRlLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICh0aGF0LmhvdmVyU3RhdGUgIT0gJ2luJykgJHRpcC5kZXRhY2goKVxuICAgICAgaWYgKHRoYXQuJGVsZW1lbnQpIHsgLy8gVE9ETzogQ2hlY2sgd2hldGhlciBndWFyZGluZyB0aGlzIGNvZGUgd2l0aCB0aGlzIGBpZmAgaXMgcmVhbGx5IG5lY2Vzc2FyeS5cbiAgICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JylcbiAgICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICB9XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHRpcFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgY29tcGxldGUoKVxuXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmZpeFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICBpZiAoJGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpICE9ICdzdHJpbmcnKSB7XG4gICAgICAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgJGUuYXR0cigndGl0bGUnKSB8fCAnJykuYXR0cigndGl0bGUnLCAnJylcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgJGVsZW1lbnQgICA9ICRlbGVtZW50IHx8IHRoaXMuJGVsZW1lbnRcblxuICAgIHZhciBlbCAgICAgPSAkZWxlbWVudFswXVxuICAgIHZhciBpc0JvZHkgPSBlbC50YWdOYW1lID09ICdCT0RZJ1xuXG4gICAgdmFyIGVsUmVjdCAgICA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKGVsUmVjdC53aWR0aCA9PSBudWxsKSB7XG4gICAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBtaXNzaW5nIGluIElFOCwgc28gY29tcHV0ZSB0aGVtIG1hbnVhbGx5OyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8xNDA5M1xuICAgICAgZWxSZWN0ID0gJC5leHRlbmQoe30sIGVsUmVjdCwgeyB3aWR0aDogZWxSZWN0LnJpZ2h0IC0gZWxSZWN0LmxlZnQsIGhlaWdodDogZWxSZWN0LmJvdHRvbSAtIGVsUmVjdC50b3AgfSlcbiAgICB9XG4gICAgdmFyIGlzU3ZnID0gd2luZG93LlNWR0VsZW1lbnQgJiYgZWwgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudFxuICAgIC8vIEF2b2lkIHVzaW5nICQub2Zmc2V0KCkgb24gU1ZHcyBzaW5jZSBpdCBnaXZlcyBpbmNvcnJlY3QgcmVzdWx0cyBpbiBqUXVlcnkgMy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8yMDI4MFxuICAgIHZhciBlbE9mZnNldCAgPSBpc0JvZHkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogKGlzU3ZnID8gbnVsbCA6ICRlbGVtZW50Lm9mZnNldCgpKVxuICAgIHZhciBzY3JvbGwgICAgPSB7IHNjcm9sbDogaXNCb2R5ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA6ICRlbGVtZW50LnNjcm9sbFRvcCgpIH1cbiAgICB2YXIgb3V0ZXJEaW1zID0gaXNCb2R5ID8geyB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpIH0gOiBudWxsXG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGVsUmVjdCwgc2Nyb2xsLCBvdXRlckRpbXMsIGVsT2Zmc2V0KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRlZE9mZnNldCA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHJldHVybiBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQsICAgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgPyB7IHRvcDogcG9zLnRvcCAtIGFjdHVhbEhlaWdodCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCB9IDpcbiAgICAgICAgLyogcGxhY2VtZW50ID09ICdyaWdodCcgKi8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIH1cblxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgdmFyIGRlbHRhID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICAgIGlmICghdGhpcy4kdmlld3BvcnQpIHJldHVybiBkZWx0YVxuXG4gICAgdmFyIHZpZXdwb3J0UGFkZGluZyA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiB0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZyB8fCAwXG4gICAgdmFyIHZpZXdwb3J0RGltZW5zaW9ucyA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICBpZiAoL3JpZ2h0fGxlZnQvLnRlc3QocGxhY2VtZW50KSkge1xuICAgICAgdmFyIHRvcEVkZ2VPZmZzZXQgICAgPSBwb3MudG9wIC0gdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbFxuICAgICAgdmFyIGJvdHRvbUVkZ2VPZmZzZXQgPSBwb3MudG9wICsgdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbCArIGFjdHVhbEhlaWdodFxuICAgICAgaWYgKHRvcEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMudG9wKSB7IC8vIHRvcCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wIC0gdG9wRWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChib3R0b21FZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQpIHsgLy8gYm90dG9tIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0IC0gYm90dG9tRWRnZU9mZnNldFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGVmdEVkZ2VPZmZzZXQgID0gcG9zLmxlZnQgLSB2aWV3cG9ydFBhZGRpbmdcbiAgICAgIHZhciByaWdodEVkZ2VPZmZzZXQgPSBwb3MubGVmdCArIHZpZXdwb3J0UGFkZGluZyArIGFjdHVhbFdpZHRoXG4gICAgICBpZiAobGVmdEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCkgeyAvLyBsZWZ0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCAtIGxlZnRFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0RWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy5yaWdodCkgeyAvLyByaWdodCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgKyB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGggLSByaWdodEVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsdGFcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZVxuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHRpdGxlID0gJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpXG4gICAgICB8fCAodHlwZW9mIG8udGl0bGUgPT0gJ2Z1bmN0aW9uJyA/IG8udGl0bGUuY2FsbCgkZVswXSkgOiAgby50aXRsZSlcblxuICAgIHJldHVybiB0aXRsZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VUlEID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIGRvIHByZWZpeCArPSB+fihNYXRoLnJhbmRvbSgpICogMTAwMDAwMClcbiAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcbiAgICByZXR1cm4gcHJlZml4XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiR0aXApIHtcbiAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxuICAgICAgaWYgKHRoaXMuJHRpcC5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IScpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiR0aXBcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy50b29sdGlwLWFycm93JykpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmIChlKSB7XG4gICAgICBzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG4gICAgICBpZiAoIXNlbGYpIHtcbiAgICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZS5jbGljayA9ICFzZWxmLmluU3RhdGUuY2xpY2tcbiAgICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgc2VsZi5lbnRlcihzZWxmKVxuICAgICAgZWxzZSBzZWxmLmxlYXZlKHNlbGYpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgPyBzZWxmLmxlYXZlKHNlbGYpIDogc2VsZi5lbnRlcihzZWxmKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB0aGlzLmhpZGUoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vZmYoJy4nICsgdGhhdC50eXBlKS5yZW1vdmVEYXRhKCdicy4nICsgdGhhdC50eXBlKVxuICAgICAgaWYgKHRoYXQuJHRpcCkge1xuICAgICAgICB0aGF0LiR0aXAuZGV0YWNoKClcbiAgICAgIH1cbiAgICAgIHRoYXQuJHRpcCA9IG51bGxcbiAgICAgIHRoYXQuJGFycm93ID0gbnVsbFxuICAgICAgdGhhdC4kdmlld3BvcnQgPSBudWxsXG4gICAgICB0aGF0LiRlbGVtZW50ID0gbnVsbFxuICAgIH0pXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zYW5pdGl6ZUh0bWwgPSBmdW5jdGlvbiAodW5zYWZlSHRtbCkge1xuICAgIHJldHVybiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgdGhpcy5vcHRpb25zLndoaXRlTGlzdCwgdGhpcy5vcHRpb25zLnNhbml0aXplRm4pXG4gIH1cblxuICAvLyBUT09MVElQIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50b29sdGlwJywgKGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udG9vbHRpcFxuXG4gICQuZm4udG9vbHRpcCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IgPSBUb29sdGlwXG5cblxuICAvLyBUT09MVElQIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnRvb2x0aXAubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRvb2x0aXAgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHBvcG92ZXIuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jcG9wb3ZlcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgUG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0KCdwb3BvdmVyJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICghJC5mbi50b29sdGlwKSB0aHJvdyBuZXcgRXJyb3IoJ1BvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qcycpXG5cbiAgUG9wb3Zlci5WRVJTSU9OICA9ICczLjQuMSdcblxuICBQb3BvdmVyLkRFRkFVTFRTID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUywge1xuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB0cmlnZ2VyOiAnY2xpY2snLFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gIH0pXG5cblxuICAvLyBOT1RFOiBQT1BPVkVSIEVYVEVORFMgdG9vbHRpcC5qc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIFBvcG92ZXIucHJvdG90eXBlID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3BvdmVyXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBvcG92ZXIuREVGQVVMVFNcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlICAgPSB0aGlzLmdldFRpdGxlKClcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcbiAgICAgIHZhciB0eXBlQ29udGVudCA9IHR5cGVvZiBjb250ZW50XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgdGl0bGUgPSB0aGlzLnNhbml0aXplSHRtbCh0aXRsZSlcblxuICAgICAgICBpZiAodHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuc2FuaXRpemVIdG1sKGNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpW1xuICAgICAgICB0eXBlQ29udGVudCA9PT0gJ3N0cmluZycgPyAnaHRtbCcgOiAnYXBwZW5kJ1xuICAgICAgXShjb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykudGV4dCh0aXRsZSlcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKCkudGV4dChjb250ZW50KVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0IGluJylcblxuICAgIC8vIElFOCBkb2Vzbid0IGFjY2VwdCBoaWRpbmcgdmlhIHRoZSBgOmVtcHR5YCBwc2V1ZG8gc2VsZWN0b3IsIHdlIGhhdmUgdG8gZG9cbiAgICAvLyB0aGlzIG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoZSBjb250ZW50cy5cbiAgICBpZiAoISR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKCkpICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5oaWRlKClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKSB8fCB0aGlzLmdldENvbnRlbnQoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICByZXR1cm4gJGUuYXR0cignZGF0YS1jb250ZW50JylcbiAgICAgIHx8ICh0eXBlb2Ygby5jb250ZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOlxuICAgICAgICBvLmNvbnRlbnQpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcuYXJyb3cnKSlcbiAgfVxuXG5cbiAgLy8gUE9QT1ZFUiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicsIChkYXRhID0gbmV3IFBvcG92ZXIodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnBvcG92ZXJcblxuICAkLmZuLnBvcG92ZXIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG5cbiAgLy8gUE9QT1ZFUiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5wb3BvdmVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5wb3BvdmVyID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBzY3JvbGxzcHkuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jc2Nyb2xsc3B5XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gU0NST0xMU1BZIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBTY3JvbGxTcHkoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGJvZHkgICAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudCA9ICQoZWxlbWVudCkuaXMoZG9jdW1lbnQuYm9keSkgPyAkKHdpbmRvdykgOiAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgICA9ICQuZXh0ZW5kKHt9LCBTY3JvbGxTcHkuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5zZWxlY3RvciAgICAgICA9ICh0aGlzLm9wdGlvbnMudGFyZ2V0IHx8ICcnKSArICcgLm5hdiBsaSA+IGEnXG4gICAgdGhpcy5vZmZzZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgICA9IG51bGxcbiAgICB0aGlzLnNjcm9sbEhlaWdodCAgID0gMFxuXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudC5vbignc2Nyb2xsLmJzLnNjcm9sbHNweScsICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSlcbiAgICB0aGlzLnJlZnJlc2goKVxuICAgIHRoaXMucHJvY2VzcygpXG4gIH1cblxuICBTY3JvbGxTcHkuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgU2Nyb2xsU3B5LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMTBcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuZ2V0U2Nyb2xsSGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRzY3JvbGxFbGVtZW50WzBdLnNjcm9sbEhlaWdodCB8fCBNYXRoLm1heCh0aGlzLiRib2R5WzBdLnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodClcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgICA9IHRoaXNcbiAgICB2YXIgb2Zmc2V0TWV0aG9kICA9ICdvZmZzZXQnXG4gICAgdmFyIG9mZnNldEJhc2UgICAgPSAwXG5cbiAgICB0aGlzLm9mZnNldHMgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgPSBbXVxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuXG4gICAgaWYgKCEkLmlzV2luZG93KHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0pKSB7XG4gICAgICBvZmZzZXRNZXRob2QgPSAncG9zaXRpb24nXG4gICAgICBvZmZzZXRCYXNlICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpXG4gICAgfVxuXG4gICAgdGhpcy4kYm9keVxuICAgICAgLmZpbmQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGVsICAgPSAkKHRoaXMpXG4gICAgICAgIHZhciBocmVmICA9ICRlbC5kYXRhKCd0YXJnZXQnKSB8fCAkZWwuYXR0cignaHJlZicpXG4gICAgICAgIHZhciAkaHJlZiA9IC9eIy4vLnRlc3QoaHJlZikgJiYgJChocmVmKVxuXG4gICAgICAgIHJldHVybiAoJGhyZWZcbiAgICAgICAgICAmJiAkaHJlZi5sZW5ndGhcbiAgICAgICAgICAmJiAkaHJlZi5pcygnOnZpc2libGUnKVxuICAgICAgICAgICYmIFtbJGhyZWZbb2Zmc2V0TWV0aG9kXSgpLnRvcCArIG9mZnNldEJhc2UsIGhyZWZdXSkgfHwgbnVsbFxuICAgICAgfSlcbiAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhWzBdIC0gYlswXSB9KVxuICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Lm9mZnNldHMucHVzaCh0aGlzWzBdKVxuICAgICAgICB0aGF0LnRhcmdldHMucHVzaCh0aGlzWzFdKVxuICAgICAgfSlcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSArIHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuICAgIHZhciBtYXhTY3JvbGwgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0ICsgc2Nyb2xsSGVpZ2h0IC0gdGhpcy4kc2Nyb2xsRWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXRzICAgICAgPSB0aGlzLm9mZnNldHNcbiAgICB2YXIgdGFyZ2V0cyAgICAgID0gdGhpcy50YXJnZXRzXG4gICAgdmFyIGFjdGl2ZVRhcmdldCA9IHRoaXMuYWN0aXZlVGFyZ2V0XG4gICAgdmFyIGlcblxuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCAhPSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHJldHVybiBhY3RpdmVUYXJnZXQgIT0gKGkgPSB0YXJnZXRzW3RhcmdldHMubGVuZ3RoIC0gMV0pICYmIHRoaXMuYWN0aXZhdGUoaSlcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZlVGFyZ2V0ICYmIHNjcm9sbFRvcCA8IG9mZnNldHNbMF0pIHtcbiAgICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gbnVsbFxuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKVxuICAgIH1cblxuICAgIGZvciAoaSA9IG9mZnNldHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICBhY3RpdmVUYXJnZXQgIT0gdGFyZ2V0c1tpXVxuICAgICAgICAmJiBzY3JvbGxUb3AgPj0gb2Zmc2V0c1tpXVxuICAgICAgICAmJiAob2Zmc2V0c1tpICsgMV0gPT09IHVuZGVmaW5lZCB8fCBzY3JvbGxUb3AgPCBvZmZzZXRzW2kgKyAxXSlcbiAgICAgICAgJiYgdGhpcy5hY3RpdmF0ZSh0YXJnZXRzW2ldKVxuICAgIH1cbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgPSB0YXJnZXRcblxuICAgIHRoaXMuY2xlYXIoKVxuXG4gICAgdmFyIHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciArXG4gICAgICAnW2RhdGEtdGFyZ2V0PVwiJyArIHRhcmdldCArICdcIl0sJyArXG4gICAgICB0aGlzLnNlbGVjdG9yICsgJ1tocmVmPVwiJyArIHRhcmdldCArICdcIl0nXG5cbiAgICB2YXIgYWN0aXZlID0gJChzZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzKCdsaScpXG4gICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICBpZiAoYWN0aXZlLnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgYWN0aXZlLnRyaWdnZXIoJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzVW50aWwodGhpcy5vcHRpb25zLnRhcmdldCwgJy5hY3RpdmUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JywgKGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5zY3JvbGxzcHlcblxuICAkLmZuLnNjcm9sbHNweSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweVxuXG5cbiAgLy8gU0NST0xMU1BZIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uc2Nyb2xsc3B5Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5zY3JvbGxzcHkgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkLmJzLnNjcm9sbHNweS5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJzY3JvbGxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgJHNweS5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdGFiLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RhYnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBUQUIgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUYWIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIC8vIGpzY3M6ZGlzYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICAgIHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAvLyBqc2NzOmVuYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICB9XG5cbiAgVGFiLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgVGFiLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUYWIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzICAgID0gdGhpcy5lbGVtZW50XG4gICAgdmFyICR1bCAgICAgID0gJHRoaXMuY2xvc2VzdCgndWw6bm90KC5kcm9wZG93bi1tZW51KScpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuZGF0YSgndGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgaWYgKCR0aGlzLnBhcmVudCgnbGknKS5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVyblxuXG4gICAgdmFyICRwcmV2aW91cyA9ICR1bC5maW5kKCcuYWN0aXZlOmxhc3QgYScpXG4gICAgdmFyIGhpZGVFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICB9KVxuICAgIHZhciBzaG93RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgIH0pXG5cbiAgICAkcHJldmlvdXMudHJpZ2dlcihoaWRlRXZlbnQpXG4gICAgJHRoaXMudHJpZ2dlcihzaG93RXZlbnQpXG5cbiAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8IGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpXG5cbiAgICB0aGlzLmFjdGl2YXRlKCR0aGlzLmNsb3Nlc3QoJ2xpJyksICR1bClcbiAgICB0aGlzLmFjdGl2YXRlKCR0YXJnZXQsICR0YXJnZXQucGFyZW50KCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICRwcmV2aW91cy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ2hpZGRlbi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgICAgfSlcbiAgICAgICR0aGlzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnc2hvd24uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBUYWIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spIHtcbiAgICB2YXIgJGFjdGl2ZSAgICA9IGNvbnRhaW5lci5maW5kKCc+IC5hY3RpdmUnKVxuICAgIHZhciB0cmFuc2l0aW9uID0gY2FsbGJhY2tcbiAgICAgICYmICQuc3VwcG9ydC50cmFuc2l0aW9uXG4gICAgICAmJiAoJGFjdGl2ZS5sZW5ndGggJiYgJGFjdGl2ZS5oYXNDbGFzcygnZmFkZScpIHx8ICEhY29udGFpbmVyLmZpbmQoJz4gLmZhZGUnKS5sZW5ndGgpXG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCc+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmVuZCgpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgICBlbGVtZW50XG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyByZWZsb3cgZm9yIHRyYW5zaXRpb25cbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnZmFkZScpXG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgICAgZWxlbWVudFxuICAgICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgIC5lbmQoKVxuICAgICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgICRhY3RpdmUubGVuZ3RoICYmIHRyYW5zaXRpb24gP1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBuZXh0KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVGFiLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIG5leHQoKVxuXG4gICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnaW4nKVxuICB9XG5cblxuICAvLyBUQUIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMudGFiJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50YWInLCAoZGF0YSA9IG5ldyBUYWIodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRhYlxuXG4gICQuZm4udGFiICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udGFiLkNvbnN0cnVjdG9yID0gVGFiXG5cblxuICAvLyBUQUIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJC5mbi50YWIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRhYiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFRBQiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBQbHVnaW4uY2FsbCgkKHRoaXMpLCAnc2hvdycpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJwaWxsXCJdJywgY2xpY2tIYW5kbGVyKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhZmZpeC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhZmZpeFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFGRklYIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIEFmZml4LkRFRkFVTFRTLCBvcHRpb25zKVxuXG4gICAgdmFyIHRhcmdldCA9IHRoaXMub3B0aW9ucy50YXJnZXQgPT09IEFmZml4LkRFRkFVTFRTLnRhcmdldCA/ICQodGhpcy5vcHRpb25zLnRhcmdldCkgOiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpXG5cbiAgICB0aGlzLiR0YXJnZXQgPSB0YXJnZXRcbiAgICAgIC5vbignc2Nyb2xsLmJzLmFmZml4LmRhdGEtYXBpJywgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpKVxuICAgICAgLm9uKCdjbGljay5icy5hZmZpeC5kYXRhLWFwaScsICAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AsIHRoaXMpKVxuXG4gICAgdGhpcy4kZWxlbWVudCAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5hZmZpeGVkICAgICAgPSBudWxsXG4gICAgdGhpcy51bnBpbiAgICAgICAgPSBudWxsXG4gICAgdGhpcy5waW5uZWRPZmZzZXQgPSBudWxsXG5cbiAgICB0aGlzLmNoZWNrUG9zaXRpb24oKVxuICB9XG5cbiAgQWZmaXguVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQWZmaXguUkVTRVQgICAgPSAnYWZmaXggYWZmaXgtdG9wIGFmZml4LWJvdHRvbSdcblxuICBBZmZpeC5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDAsXG4gICAgdGFyZ2V0OiB3aW5kb3dcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uIChzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICAgICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gdGhpcy4kdGFyZ2V0LmhlaWdodCgpXG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgdGhpcy5hZmZpeGVkID09ICd0b3AnKSByZXR1cm4gc2Nyb2xsVG9wIDwgb2Zmc2V0VG9wID8gJ3RvcCcgOiBmYWxzZVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCA9PSAnYm90dG9tJykge1xuICAgICAgaWYgKG9mZnNldFRvcCAhPSBudWxsKSByZXR1cm4gKHNjcm9sbFRvcCArIHRoaXMudW5waW4gPD0gcG9zaXRpb24udG9wKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICAgIHJldHVybiAoc2Nyb2xsVG9wICsgdGFyZ2V0SGVpZ2h0IDw9IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgfVxuXG4gICAgdmFyIGluaXRpYWxpemluZyAgID0gdGhpcy5hZmZpeGVkID09IG51bGxcbiAgICB2YXIgY29sbGlkZXJUb3AgICAgPSBpbml0aWFsaXppbmcgPyBzY3JvbGxUb3AgOiBwb3NpdGlvbi50b3BcbiAgICB2YXIgY29sbGlkZXJIZWlnaHQgPSBpbml0aWFsaXppbmcgPyB0YXJnZXRIZWlnaHQgOiBoZWlnaHRcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiBzY3JvbGxUb3AgPD0gb2Zmc2V0VG9wKSByZXR1cm4gJ3RvcCdcbiAgICBpZiAob2Zmc2V0Qm90dG9tICE9IG51bGwgJiYgKGNvbGxpZGVyVG9wICsgY29sbGlkZXJIZWlnaHQgPj0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSkgcmV0dXJuICdib3R0b20nXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRQaW5uZWRPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucGlubmVkT2Zmc2V0KSByZXR1cm4gdGhpcy5waW5uZWRPZmZzZXRcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKS5hZGRDbGFzcygnYWZmaXgnKVxuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHJldHVybiAodGhpcy5waW5uZWRPZmZzZXQgPSBwb3NpdGlvbi50b3AgLSBzY3JvbGxUb3ApXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dCgkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcyksIDEpXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVyblxuXG4gICAgdmFyIGhlaWdodCAgICAgICA9IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0ICAgICAgID0gdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wXG4gICAgdmFyIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b21cbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gTWF0aC5tYXgoJChkb2N1bWVudCkuaGVpZ2h0KCksICQoZG9jdW1lbnQuYm9keSkuaGVpZ2h0KCkpXG5cbiAgICBpZiAodHlwZW9mIG9mZnNldCAhPSAnb2JqZWN0JykgICAgICAgICBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgPSBvZmZzZXRcbiAgICBpZiAodHlwZW9mIG9mZnNldFRvcCA9PSAnZnVuY3Rpb24nKSAgICBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wKHRoaXMuJGVsZW1lbnQpXG4gICAgaWYgKHR5cGVvZiBvZmZzZXRCb3R0b20gPT0gJ2Z1bmN0aW9uJykgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbSh0aGlzLiRlbGVtZW50KVxuXG4gICAgdmFyIGFmZml4ID0gdGhpcy5nZXRTdGF0ZShzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkICE9IGFmZml4KSB7XG4gICAgICBpZiAodGhpcy51bnBpbiAhPSBudWxsKSB0aGlzLiRlbGVtZW50LmNzcygndG9wJywgJycpXG5cbiAgICAgIHZhciBhZmZpeFR5cGUgPSAnYWZmaXgnICsgKGFmZml4ID8gJy0nICsgYWZmaXggOiAnJylcbiAgICAgIHZhciBlICAgICAgICAgPSAkLkV2ZW50KGFmZml4VHlwZSArICcuYnMuYWZmaXgnKVxuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICB0aGlzLmFmZml4ZWQgPSBhZmZpeFxuICAgICAgdGhpcy51bnBpbiA9IGFmZml4ID09ICdib3R0b20nID8gdGhpcy5nZXRQaW5uZWRPZmZzZXQoKSA6IG51bGxcblxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpXG4gICAgICAgIC5hZGRDbGFzcyhhZmZpeFR5cGUpXG4gICAgICAgIC50cmlnZ2VyKGFmZml4VHlwZS5yZXBsYWNlKCdhZmZpeCcsICdhZmZpeGVkJykgKyAnLmJzLmFmZml4JylcbiAgICB9XG5cbiAgICBpZiAoYWZmaXggPT0gJ2JvdHRvbScpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2Zmc2V0KHtcbiAgICAgICAgdG9wOiBzY3JvbGxIZWlnaHQgLSBoZWlnaHQgLSBvZmZzZXRCb3R0b21cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cblxuICAvLyBBRkZJWCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5hZmZpeCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWZmaXgnLCAoZGF0YSA9IG5ldyBBZmZpeCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWZmaXhcblxuICAkLmZuLmFmZml4ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWZmaXguQ29uc3RydWN0b3IgPSBBZmZpeFxuXG5cbiAgLy8gQUZGSVggTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFmZml4Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hZmZpeCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFGRklYIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHNweS5kYXRhKClcblxuICAgICAgZGF0YS5vZmZzZXQgPSBkYXRhLm9mZnNldCB8fCB7fVxuXG4gICAgICBpZiAoZGF0YS5vZmZzZXRCb3R0b20gIT0gbnVsbCkgZGF0YS5vZmZzZXQuYm90dG9tID0gZGF0YS5vZmZzZXRCb3R0b21cbiAgICAgIGlmIChkYXRhLm9mZnNldFRvcCAgICAhPSBudWxsKSBkYXRhLm9mZnNldC50b3AgICAgPSBkYXRhLm9mZnNldFRvcFxuXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCBkYXRhKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcbiIsIi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfCBGbGV4eSBoZWFkZXJcbi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfFxuLy8gfCBUaGlzIGpRdWVyeSBzY3JpcHQgaXMgd3JpdHRlbiBieVxuLy8gfFxuLy8gfCBNb3J0ZW4gTmlzc2VuXG4vLyB8IGhqZW1tZXNpZGVrb25nZW4uZGtcbi8vIHxcblxudmFyIGZsZXh5X2hlYWRlciA9IChmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwdWIgPSB7fSxcbiAgICAgICAgJGhlYWRlcl9zdGF0aWMgPSAkKCcuZmxleHktaGVhZGVyLS1zdGF0aWMnKSxcbiAgICAgICAgJGhlYWRlcl9zdGlja3kgPSAkKCcuZmxleHktaGVhZGVyLS1zdGlja3knKSxcbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHVwZGF0ZV9pbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlOiB7XG4gICAgICAgICAgICAgICAgdXB3YXJkOiAyMCxcbiAgICAgICAgICAgICAgICBkb3dud2FyZDogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvZmZzZXQ6IF9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tKCRoZWFkZXJfc3RhdGljKSxcbiAgICAgICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgICAgICBwaW5uZWQ6IFwiZmxleHktaGVhZGVyLS1waW5uZWRcIixcbiAgICAgICAgICAgICAgICB1bnBpbm5lZDogXCJmbGV4eS1oZWFkZXItLXVucGlubmVkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd2FzX3Njcm9sbGVkID0gZmFsc2UsXG4gICAgICAgIGxhc3RfZGlzdGFuY2VfZnJvbV90b3AgPSAwO1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVcbiAgICAgKi9cbiAgICBwdWIuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpO1xuICAgICAgICByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvb3QgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCkge1xuICAgICAgICAkaGVhZGVyX3N0aWNreS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAod2FzX3Njcm9sbGVkKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRfd2FzX3Njcm9sbGVkKCk7XG5cbiAgICAgICAgICAgICAgICB3YXNfc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgb3B0aW9ucy51cGRhdGVfaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCkge1xuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB3YXNfc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2Zmc2V0IGZyb20gZWxlbWVudCBib3R0b21cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0X29mZnNldF9mcm9tX2VsZW1lbnRzX2JvdHRvbSgkZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudF9oZWlnaHQgPSAkZWxlbWVudC5vdXRlckhlaWdodCh0cnVlKSxcbiAgICAgICAgICAgIGVsZW1lbnRfb2Zmc2V0ID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgIHJldHVybiAoZWxlbWVudF9oZWlnaHQgKyBlbGVtZW50X29mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9jdW1lbnQgd2FzIHNjcm9sbGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9jdW1lbnRfd2FzX3Njcm9sbGVkKCkge1xuICAgICAgICB2YXIgY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgICAvLyBJZiBwYXN0IG9mZnNldFxuICAgICAgICBpZiAoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA+PSBvcHRpb25zLm9mZnNldCkge1xuXG4gICAgICAgICAgICAvLyBEb3dud2FyZHMgc2Nyb2xsXG4gICAgICAgICAgICBpZiAoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA+IGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIHtcblxuICAgICAgICAgICAgICAgIC8vIE9iZXkgdGhlIGRvd253YXJkIHRvbGVyYW5jZVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIC0gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkgPD0gb3B0aW9ucy50b2xlcmFuY2UuZG93bndhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwd2FyZHMgc2Nyb2xsXG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIE9iZXkgdGhlIHVwd2FyZCB0b2xlcmFuY2VcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCAtIGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIDw9IG9wdGlvbnMudG9sZXJhbmNlLnVwd2FyZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gV2UgYXJlIG5vdCBzY3JvbGxlZCBwYXN0IHRoZSBkb2N1bWVudCB3aGljaCBpcyBwb3NzaWJsZSBvbiB0aGUgTWFjXG4gICAgICAgICAgICAgICAgaWYgKChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90IHBhc3Qgb2Zmc2V0XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RfZGlzdGFuY2VfZnJvbV90b3AgPSBjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wO1xuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuIiwiLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8IEZsZXh5IG5hdmlnYXRpb25cbi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfFxuLy8gfCBUaGlzIGpRdWVyeSBzY3JpcHQgaXMgd3JpdHRlbiBieVxuLy8gfFxuLy8gfCBNb3J0ZW4gTmlzc2VuXG4vLyB8IGhqZW1tZXNpZGVrb25nZW4uZGtcbi8vIHxcblxudmFyIGZsZXh5X25hdmlnYXRpb24gPSAoZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgcHViID0ge30sXG4gICAgICAgIGxheW91dF9jbGFzc2VzID0ge1xuICAgICAgICAgICAgJ25hdmlnYXRpb24nOiAnLmZsZXh5LW5hdmlnYXRpb24nLFxuICAgICAgICAgICAgJ29iZnVzY2F0b3InOiAnLmZsZXh5LW5hdmlnYXRpb25fX29iZnVzY2F0b3InLFxuICAgICAgICAgICAgJ2Ryb3Bkb3duJzogJy5mbGV4eS1uYXZpZ2F0aW9uX19pdGVtLS1kcm9wZG93bicsXG4gICAgICAgICAgICAnZHJvcGRvd25fbWVnYW1lbnUnOiAnLmZsZXh5LW5hdmlnYXRpb25fX2l0ZW1fX2Ryb3Bkb3duLW1lZ2FtZW51JyxcblxuICAgICAgICAgICAgJ2lzX3VwZ3JhZGVkJzogJ2lzLXVwZ3JhZGVkJyxcbiAgICAgICAgICAgICduYXZpZ2F0aW9uX2hhc19tZWdhbWVudSc6ICdoYXMtbWVnYW1lbnUnLFxuICAgICAgICAgICAgJ2Ryb3Bkb3duX2hhc19tZWdhbWVudSc6ICdmbGV4eS1uYXZpZ2F0aW9uX19pdGVtLS1kcm9wZG93bi13aXRoLW1lZ2FtZW51JyxcbiAgICAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlXG4gICAgICovXG4gICAgcHViLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZWdpc3RlckV2ZW50SGFuZGxlcnMoKTtcbiAgICAgICAgcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBib290IGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpIHtcblxuICAgICAgICAvLyBVcGdyYWRlXG4gICAgICAgIHVwZ3JhZGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpIHt9XG5cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlIGVsZW1lbnRzLlxuICAgICAqIEFkZCBjbGFzc2VzIHRvIGVsZW1lbnRzLCBiYXNlZCB1cG9uIGF0dGFjaGVkIGNsYXNzZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBncmFkZSgpIHtcbiAgICAgICAgdmFyICRuYXZpZ2F0aW9ucyA9ICQobGF5b3V0X2NsYXNzZXMubmF2aWdhdGlvbik7XG5cbiAgICAgICAgLy8gTmF2aWdhdGlvbnNcbiAgICAgICAgaWYgKCRuYXZpZ2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbmF2aWdhdGlvbnMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciAkbmF2aWdhdGlvbiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICRtZWdhbWVudXMgPSAkbmF2aWdhdGlvbi5maW5kKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duX21lZ2FtZW51KSxcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duX21lZ2FtZW51ID0gJG5hdmlnYXRpb24uZmluZChsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bl9oYXNfbWVnYW1lbnUpO1xuXG4gICAgICAgICAgICAgICAgLy8gSGFzIGFscmVhZHkgYmVlbiB1cGdyYWRlZFxuICAgICAgICAgICAgICAgIGlmICgkbmF2aWdhdGlvbi5oYXNDbGFzcyhsYXlvdXRfY2xhc3Nlcy5pc191cGdyYWRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEhhcyBtZWdhbWVudVxuICAgICAgICAgICAgICAgIGlmICgkbWVnYW1lbnVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJG5hdmlnYXRpb24uYWRkQ2xhc3MobGF5b3V0X2NsYXNzZXMubmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aHJvdWdoIGFsbCBtZWdhbWVudXNcbiAgICAgICAgICAgICAgICAgICAgJG1lZ2FtZW51cy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJG1lZ2FtZW51ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNfb2JmdXNjYXRvciA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnaGFzLW9iZnVzY2F0b3InKSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJG1lZ2FtZW51LnBhcmVudHMobGF5b3V0X2NsYXNzZXMuZHJvcGRvd24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duX2hhc19tZWdhbWVudSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaG92ZXIoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc19vYmZ1c2NhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmZ1c2NhdG9yLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc19vYmZ1c2NhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmZ1c2NhdG9yLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJcyB1cGdyYWRlZFxuICAgICAgICAgICAgICAgICRuYXZpZ2F0aW9uLmFkZENsYXNzKGxheW91dF9jbGFzc2VzLmlzX3VwZ3JhZGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvKiEgc2lkciAtIHYyLjIuMSAtIDIwMTYtMDItMTdcbiAqIGh0dHA6Ly93d3cuYmVycmlhcnQuY29tL3NpZHIvXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBBbGJlcnRvIFZhcmVsYTsgTGljZW5zZWQgTUlUICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgYmFiZWxIZWxwZXJzID0ge307XG5cbiAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9O1xuICB9KCk7XG5cbiAgYmFiZWxIZWxwZXJzO1xuXG4gIHZhciBzaWRyU3RhdHVzID0ge1xuICAgIG1vdmluZzogZmFsc2UsXG4gICAgb3BlbmVkOiBmYWxzZVxuICB9O1xuXG4gIHZhciBoZWxwZXIgPSB7XG4gICAgLy8gQ2hlY2sgZm9yIHZhbGlkcyB1cmxzXG4gICAgLy8gRnJvbSA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTcxNzA5My9jaGVjay1pZi1hLWphdmFzY3JpcHQtc3RyaW5nLWlzLWFuLXVybFxuXG4gICAgaXNVcmw6IGZ1bmN0aW9uIGlzVXJsKHN0cikge1xuICAgICAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdeKGh0dHBzPzpcXFxcL1xcXFwvKT8nICsgLy8gcHJvdG9jb2xcbiAgICAgICcoKChbYS16XFxcXGRdKFthLXpcXFxcZC1dKlthLXpcXFxcZF0pKilcXFxcLj8pK1thLXpdezIsfXwnICsgLy8gZG9tYWluIG5hbWVcbiAgICAgICcoKFxcXFxkezEsM31cXFxcLil7M31cXFxcZHsxLDN9KSknICsgLy8gT1IgaXAgKHY0KSBhZGRyZXNzXG4gICAgICAnKFxcXFw6XFxcXGQrKT8oXFxcXC9bLWEtelxcXFxkJV8ufitdKikqJyArIC8vIHBvcnQgYW5kIHBhdGhcbiAgICAgICcoXFxcXD9bOyZhLXpcXFxcZCVfLn4rPS1dKik/JyArIC8vIHF1ZXJ5IHN0cmluZ1xuICAgICAgJyhcXFxcI1stYS16XFxcXGRfXSopPyQnLCAnaScpOyAvLyBmcmFnbWVudCBsb2NhdG9yXG5cbiAgICAgIGlmIChwYXR0ZXJuLnRlc3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvLyBBZGQgc2lkciBwcmVmaXhlc1xuICAgIGFkZFByZWZpeGVzOiBmdW5jdGlvbiBhZGRQcmVmaXhlcygkZWxlbWVudCkge1xuICAgICAgdGhpcy5hZGRQcmVmaXgoJGVsZW1lbnQsICdpZCcpO1xuICAgICAgdGhpcy5hZGRQcmVmaXgoJGVsZW1lbnQsICdjbGFzcycpO1xuICAgICAgJGVsZW1lbnQucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICB9LFxuICAgIGFkZFByZWZpeDogZnVuY3Rpb24gYWRkUHJlZml4KCRlbGVtZW50LCBhdHRyaWJ1dGUpIHtcbiAgICAgIHZhciB0b1JlcGxhY2UgPSAkZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgdG9SZXBsYWNlID09PSAnc3RyaW5nJyAmJiB0b1JlcGxhY2UgIT09ICcnICYmIHRvUmVwbGFjZSAhPT0gJ3NpZHItaW5uZXInKSB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoYXR0cmlidXRlLCB0b1JlcGxhY2UucmVwbGFjZSgvKFtBLVphLXowLTlfLlxcLV0rKS9nLCAnc2lkci0nICsgYXR0cmlidXRlICsgJy0kMScpKTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvLyBDaGVjayBpZiB0cmFuc2l0aW9ucyBpcyBzdXBwb3J0ZWRcbiAgICB0cmFuc2l0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICBzdHlsZSA9IGJvZHkuc3R5bGUsXG4gICAgICAgICAgc3VwcG9ydGVkID0gZmFsc2UsXG4gICAgICAgICAgcHJvcGVydHkgPSAndHJhbnNpdGlvbic7XG5cbiAgICAgIGlmIChwcm9wZXJ0eSBpbiBzdHlsZSkge1xuICAgICAgICBzdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcHJlZml4ZXMgPSBbJ21veicsICd3ZWJraXQnLCAnbycsICdtcyddLFxuICAgICAgICAgICAgICBwcmVmaXggPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGkgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICAgIHN1cHBvcnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1tpXTtcbiAgICAgICAgICAgICAgaWYgKHByZWZpeCArIHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0oKTtcbiAgICAgICAgICBwcm9wZXJ0eSA9IHN1cHBvcnRlZCA/ICctJyArIHByZWZpeC50b0xvd2VyQ2FzZSgpICsgJy0nICsgcHJvcGVydHkudG9Mb3dlckNhc2UoKSA6IG51bGw7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1cHBvcnRlZDogc3VwcG9ydGVkLFxuICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHlcbiAgICAgIH07XG4gICAgfSgpXG4gIH07XG5cbiAgdmFyICQkMiA9IGpRdWVyeTtcblxuICB2YXIgYm9keUFuaW1hdGlvbkNsYXNzID0gJ3NpZHItYW5pbWF0aW5nJztcbiAgdmFyIG9wZW5BY3Rpb24gPSAnb3Blbic7XG4gIHZhciBjbG9zZUFjdGlvbiA9ICdjbG9zZSc7XG4gIHZhciB0cmFuc2l0aW9uRW5kRXZlbnQgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCc7XG4gIHZhciBNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1lbnUobmFtZSkge1xuICAgICAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrKHRoaXMsIE1lbnUpO1xuXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5pdGVtID0gJCQyKCcjJyArIG5hbWUpO1xuICAgICAgdGhpcy5vcGVuQ2xhc3MgPSBuYW1lID09PSAnc2lkcicgPyAnc2lkci1vcGVuJyA6ICdzaWRyLW9wZW4gJyArIG5hbWUgKyAnLW9wZW4nO1xuICAgICAgdGhpcy5tZW51V2lkdGggPSB0aGlzLml0ZW0ub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLml0ZW0uZGF0YSgnc3BlZWQnKTtcbiAgICAgIHRoaXMuc2lkZSA9IHRoaXMuaXRlbS5kYXRhKCdzaWRlJyk7XG4gICAgICB0aGlzLmRpc3BsYWNlID0gdGhpcy5pdGVtLmRhdGEoJ2Rpc3BsYWNlJyk7XG4gICAgICB0aGlzLnRpbWluZyA9IHRoaXMuaXRlbS5kYXRhKCd0aW1pbmcnKTtcbiAgICAgIHRoaXMubWV0aG9kID0gdGhpcy5pdGVtLmRhdGEoJ21ldGhvZCcpO1xuICAgICAgdGhpcy5vbk9wZW5DYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbk9wZW4nKTtcbiAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uQ2xvc2UnKTtcbiAgICAgIHRoaXMub25PcGVuRW5kQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25PcGVuRW5kJyk7XG4gICAgICB0aGlzLm9uQ2xvc2VFbmRDYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbkNsb3NlRW5kJyk7XG4gICAgICB0aGlzLmJvZHkgPSAkJDIodGhpcy5pdGVtLmRhdGEoJ2JvZHknKSk7XG4gICAgfVxuXG4gICAgYmFiZWxIZWxwZXJzLmNyZWF0ZUNsYXNzKE1lbnUsIFt7XG4gICAgICBrZXk6ICdnZXRBbmltYXRpb24nLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFuaW1hdGlvbihhY3Rpb24sIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IHt9LFxuICAgICAgICAgICAgcHJvcCA9IHRoaXMuc2lkZTtcblxuICAgICAgICBpZiAoYWN0aW9uID09PSAnb3BlbicgJiYgZWxlbWVudCA9PT0gJ2JvZHknKSB7XG4gICAgICAgICAgYW5pbWF0aW9uW3Byb3BdID0gdGhpcy5tZW51V2lkdGggKyAncHgnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2Nsb3NlJyAmJiBlbGVtZW50ID09PSAnbWVudScpIHtcbiAgICAgICAgICBhbmltYXRpb25bcHJvcF0gPSAnLScgKyB0aGlzLm1lbnVXaWR0aCArICdweCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW5pbWF0aW9uW3Byb3BdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbmltYXRpb247XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncHJlcGFyZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByZXBhcmVCb2R5KGFjdGlvbikge1xuICAgICAgICB2YXIgcHJvcCA9IGFjdGlvbiA9PT0gJ29wZW4nID8gJ2hpZGRlbicgOiAnJztcblxuICAgICAgICAvLyBQcmVwYXJlIHBhZ2UgaWYgY29udGFpbmVyIGlzIGJvZHlcbiAgICAgICAgaWYgKHRoaXMuYm9keS5pcygnYm9keScpKSB7XG4gICAgICAgICAgdmFyICRodG1sID0gJCQyKCdodG1sJyksXG4gICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRodG1sLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgJGh0bWwuY3NzKCdvdmVyZmxvdy14JywgcHJvcCkuc2Nyb2xsVG9wKHNjcm9sbFRvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvcGVuQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbkJvZHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3BsYWNlKSB7XG4gICAgICAgICAgdmFyIHRyYW5zaXRpb25zID0gaGVscGVyLnRyYW5zaXRpb25zLFxuICAgICAgICAgICAgICAkYm9keSA9IHRoaXMuYm9keTtcblxuICAgICAgICAgIGlmICh0cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICRib2R5LmNzcyh0cmFuc2l0aW9ucy5wcm9wZXJ0eSwgdGhpcy5zaWRlICsgJyAnICsgdGhpcy5zcGVlZCAvIDEwMDAgKyAncyAnICsgdGhpcy50aW1pbmcpLmNzcyh0aGlzLnNpZGUsIDApLmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiAkYm9keS53aWR0aCgpLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkYm9keS5jc3ModGhpcy5zaWRlLCB0aGlzLm1lbnVXaWR0aCArICdweCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYm9keUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKG9wZW5BY3Rpb24sICdib2R5Jyk7XG5cbiAgICAgICAgICAgICRib2R5LmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiAkYm9keS53aWR0aCgpLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgfSkuYW5pbWF0ZShib2R5QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29uQ2xvc2VCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsb3NlQm9keSgpIHtcbiAgICAgICAgdmFyIHRyYW5zaXRpb25zID0gaGVscGVyLnRyYW5zaXRpb25zLFxuICAgICAgICAgICAgcmVzZXRTdHlsZXMgPSB7XG4gICAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnJyxcbiAgICAgICAgICByaWdodDogJycsXG4gICAgICAgICAgbGVmdDogJydcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgcmVzZXRTdHlsZXNbdHJhbnNpdGlvbnMucHJvcGVydHldID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvZHkuY3NzKHJlc2V0U3R5bGVzKS51bmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlQm9keSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5kaXNwbGFjZSkge1xuICAgICAgICAgIGlmIChoZWxwZXIudHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHkuY3NzKHRoaXMuc2lkZSwgMCkub25lKHRyYW5zaXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBfdGhpcy5vbkNsb3NlQm9keSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBib2R5QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24oY2xvc2VBY3Rpb24sICdib2R5Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuYm9keS5hbmltYXRlKGJvZHlBbmltYXRpb24sIHtcbiAgICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm9uQ2xvc2VCb2R5KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21vdmVCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlQm9keShhY3Rpb24pIHtcbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gb3BlbkFjdGlvbikge1xuICAgICAgICAgIHRoaXMub3BlbkJvZHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsb3NlQm9keSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25PcGVuTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25PcGVuTWVudShjYWxsYmFjaykge1xuICAgICAgICB2YXIgbmFtZSA9IHRoaXMubmFtZTtcblxuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgICBzaWRyU3RhdHVzLm9wZW5lZCA9IG5hbWU7XG5cbiAgICAgICAgdGhpcy5pdGVtLnVuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnQpO1xuXG4gICAgICAgIHRoaXMuYm9keS5yZW1vdmVDbGFzcyhib2R5QW5pbWF0aW9uQ2xhc3MpLmFkZENsYXNzKHRoaXMub3BlbkNsYXNzKTtcblxuICAgICAgICB0aGlzLm9uT3BlbkVuZENhbGxiYWNrKCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrKG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb3Blbk1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW5NZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIHZhciAkaXRlbSA9IHRoaXMuaXRlbTtcblxuICAgICAgICBpZiAoaGVscGVyLnRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgICRpdGVtLmNzcyh0aGlzLnNpZGUsIDApLm9uZSh0cmFuc2l0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzMi5vbk9wZW5NZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbWVudUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKG9wZW5BY3Rpb24sICdtZW51Jyk7XG5cbiAgICAgICAgICAkaXRlbS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKS5hbmltYXRlKG1lbnVBbmltYXRpb24sIHtcbiAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICBfdGhpczIub25PcGVuTWVudShjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbkNsb3NlTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25DbG9zZU1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5pdGVtLmNzcyh7XG4gICAgICAgICAgbGVmdDogJycsXG4gICAgICAgICAgcmlnaHQ6ICcnXG4gICAgICAgIH0pLnVuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnQpO1xuICAgICAgICAkJDIoJ2h0bWwnKS5jc3MoJ292ZXJmbG93LXgnLCAnJyk7XG5cbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2lkclN0YXR1cy5vcGVuZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJvZHkucmVtb3ZlQ2xhc3MoYm9keUFuaW1hdGlvbkNsYXNzKS5yZW1vdmVDbGFzcyh0aGlzLm9wZW5DbGFzcyk7XG5cbiAgICAgICAgdGhpcy5vbkNsb3NlRW5kQ2FsbGJhY2soKTtcblxuICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZU1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlTWVudShjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbTtcblxuICAgICAgICBpZiAoaGVscGVyLnRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgIGl0ZW0uY3NzKHRoaXMuc2lkZSwgJycpLm9uZSh0cmFuc2l0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzMy5vbkNsb3NlTWVudShjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1lbnVBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihjbG9zZUFjdGlvbiwgJ21lbnUnKTtcblxuICAgICAgICAgIGl0ZW0uYW5pbWF0ZShtZW51QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgX3RoaXMzLm9uQ2xvc2VNZW51KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdtb3ZlTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZU1lbnUoYWN0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmJvZHkuYWRkQ2xhc3MoYm9keUFuaW1hdGlvbkNsYXNzKTtcblxuICAgICAgICBpZiAoYWN0aW9uID09PSBvcGVuQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vcGVuTWVudShjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbG9zZU1lbnUoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnbW92ZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZShhY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIExvY2sgc2lkclxuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlQm9keShhY3Rpb24pO1xuICAgICAgICB0aGlzLm1vdmVCb2R5KGFjdGlvbik7XG4gICAgICAgIHRoaXMubW92ZU1lbnUoYWN0aW9uLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb3BlbicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbihjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICAvLyBDaGVjayBpZiBpcyBhbHJlYWR5IG9wZW5lZCBvciBtb3ZpbmdcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkID09PSB0aGlzLm5hbWUgfHwgc2lkclN0YXR1cy5tb3ZpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBhbm90aGVyIG1lbnUgb3BlbmVkIGNsb3NlIGZpcnN0XG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB2YXIgYWxyZWFkeU9wZW5lZE1lbnUgPSBuZXcgTWVudShzaWRyU3RhdHVzLm9wZW5lZCk7XG5cbiAgICAgICAgICBhbHJlYWR5T3BlbmVkTWVudS5jbG9zZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczQub3BlbihjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmUoJ29wZW4nLCBjYWxsYmFjayk7XG5cbiAgICAgICAgLy8gb25PcGVuIGNhbGxiYWNrXG4gICAgICAgIHRoaXMub25PcGVuQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2UoY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXMgYWxyZWFkeSBjbG9zZWQgb3IgbW92aW5nXG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCAhPT0gdGhpcy5uYW1lIHx8IHNpZHJTdGF0dXMubW92aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlKCdjbG9zZScsIGNhbGxiYWNrKTtcblxuICAgICAgICAvLyBvbkNsb3NlIGNhbGxiYWNrXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAndG9nZ2xlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGUoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkID09PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlKGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9wZW4oY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBNZW51O1xuICB9KCk7XG5cbiAgdmFyICQkMSA9IGpRdWVyeTtcblxuICBmdW5jdGlvbiBleGVjdXRlKGFjdGlvbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgc2lkciA9IG5ldyBNZW51KG5hbWUpO1xuXG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ29wZW4nOlxuICAgICAgICBzaWRyLm9wZW4oY2FsbGJhY2spO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgICAgc2lkci5jbG9zZShjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndG9nZ2xlJzpcbiAgICAgICAgc2lkci50b2dnbGUoY2FsbGJhY2spO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgICQkMS5lcnJvcignTWV0aG9kICcgKyBhY3Rpb24gKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zaWRyJyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpO1xuICB2YXIgJCA9IGpRdWVyeTtcbiAgdmFyIHB1YmxpY01ldGhvZHMgPSBbJ29wZW4nLCAnY2xvc2UnLCAndG9nZ2xlJ107XG4gIHZhciBtZXRob2ROYW1lO1xuICB2YXIgbWV0aG9kcyA9IHt9O1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gZ2V0TWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAvLyBDaGVjayBhcmd1bWVudHNcbiAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IG5hbWU7XG4gICAgICAgIG5hbWUgPSAnc2lkcic7XG4gICAgICB9IGVsc2UgaWYgKCFuYW1lKSB7XG4gICAgICAgIG5hbWUgPSAnc2lkcic7XG4gICAgICB9XG5cbiAgICAgIGV4ZWN1dGUobWV0aG9kTmFtZSwgbmFtZSwgY2FsbGJhY2spO1xuICAgIH07XG4gIH07XG4gIGZvciAoaSA9IDA7IGkgPCBwdWJsaWNNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWV0aG9kTmFtZSA9IHB1YmxpY01ldGhvZHNbaV07XG4gICAgbWV0aG9kc1ttZXRob2ROYW1lXSA9IGdldE1ldGhvZChtZXRob2ROYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNpZHIobWV0aG9kKSB7XG4gICAgaWYgKG1ldGhvZCA9PT0gJ3N0YXR1cycpIHtcbiAgICAgIHJldHVybiBzaWRyU3RhdHVzO1xuICAgIH0gZWxzZSBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJyB8fCAhbWV0aG9kKSB7XG4gICAgICByZXR1cm4gbWV0aG9kcy50b2dnbGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5lcnJvcignTWV0aG9kICcgKyBtZXRob2QgKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zaWRyJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyICQkMyA9IGpRdWVyeTtcblxuICBmdW5jdGlvbiBmaWxsQ29udGVudCgkc2lkZU1lbnUsIHNldHRpbmdzKSB7XG4gICAgLy8gVGhlIG1lbnUgY29udGVudFxuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3Muc291cmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbmV3Q29udGVudCA9IHNldHRpbmdzLnNvdXJjZShuYW1lKTtcblxuICAgICAgJHNpZGVNZW51Lmh0bWwobmV3Q29udGVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2V0dGluZ3Muc291cmNlID09PSAnc3RyaW5nJyAmJiBoZWxwZXIuaXNVcmwoc2V0dGluZ3Muc291cmNlKSkge1xuICAgICAgJCQzLmdldChzZXR0aW5ncy5zb3VyY2UsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICRzaWRlTWVudS5odG1sKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2V0dGluZ3Muc291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIGh0bWxDb250ZW50ID0gJycsXG4gICAgICAgICAgc2VsZWN0b3JzID0gc2V0dGluZ3Muc291cmNlLnNwbGl0KCcsJyk7XG5cbiAgICAgICQkMy5lYWNoKHNlbGVjdG9ycywgZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgIGh0bWxDb250ZW50ICs9ICc8ZGl2IGNsYXNzPVwic2lkci1pbm5lclwiPicgKyAkJDMoZWxlbWVudCkuaHRtbCgpICsgJzwvZGl2Pic7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVuYW1pbmcgaWRzIGFuZCBjbGFzc2VzXG4gICAgICBpZiAoc2V0dGluZ3MucmVuYW1pbmcpIHtcbiAgICAgICAgdmFyICRodG1sQ29udGVudCA9ICQkMygnPGRpdiAvPicpLmh0bWwoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgICRodG1sQ29udGVudC5maW5kKCcqJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkJDMoZWxlbWVudCk7XG5cbiAgICAgICAgICBoZWxwZXIuYWRkUHJlZml4ZXMoJGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaHRtbENvbnRlbnQgPSAkaHRtbENvbnRlbnQuaHRtbCgpO1xuICAgICAgfVxuXG4gICAgICAkc2lkZU1lbnUuaHRtbChodG1sQ29udGVudCk7XG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5zb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICQkMy5lcnJvcignSW52YWxpZCBTaWRyIFNvdXJjZScpO1xuICAgIH1cblxuICAgIHJldHVybiAkc2lkZU1lbnU7XG4gIH1cblxuICBmdW5jdGlvbiBmblNpZHIob3B0aW9ucykge1xuICAgIHZhciB0cmFuc2l0aW9ucyA9IGhlbHBlci50cmFuc2l0aW9ucyxcbiAgICAgICAgc2V0dGluZ3MgPSAkJDMuZXh0ZW5kKHtcbiAgICAgIG5hbWU6ICdzaWRyJywgLy8gTmFtZSBmb3IgdGhlICdzaWRyJ1xuICAgICAgc3BlZWQ6IDIwMCwgLy8gQWNjZXB0cyBzdGFuZGFyZCBqUXVlcnkgZWZmZWN0cyBzcGVlZHMgKGkuZS4gZmFzdCwgbm9ybWFsIG9yIG1pbGxpc2Vjb25kcylcbiAgICAgIHNpZGU6ICdsZWZ0JywgLy8gQWNjZXB0cyAnbGVmdCcgb3IgJ3JpZ2h0J1xuICAgICAgc291cmNlOiBudWxsLCAvLyBPdmVycmlkZSB0aGUgc291cmNlIG9mIHRoZSBjb250ZW50LlxuICAgICAgcmVuYW1pbmc6IHRydWUsIC8vIFRoZSBpZHMgYW5kIGNsYXNzZXMgd2lsbCBiZSBwcmVwZW5kZWQgd2l0aCBhIHByZWZpeCB3aGVuIGxvYWRpbmcgZXhpc3RlbnQgY29udGVudFxuICAgICAgYm9keTogJ2JvZHknLCAvLyBQYWdlIGNvbnRhaW5lciBzZWxlY3RvcixcbiAgICAgIGRpc3BsYWNlOiB0cnVlLCAvLyBEaXNwbGFjZSB0aGUgYm9keSBjb250ZW50IG9yIG5vdFxuICAgICAgdGltaW5nOiAnZWFzZScsIC8vIFRpbWluZyBmdW5jdGlvbiBmb3IgQ1NTIHRyYW5zaXRpb25zXG4gICAgICBtZXRob2Q6ICd0b2dnbGUnLCAvLyBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiBlbGVtZW50IGlzIGNsaWNrZWRcbiAgICAgIGJpbmQ6ICd0b3VjaHN0YXJ0IGNsaWNrJywgLy8gVGhlIGV2ZW50KHMpIHRvIHRyaWdnZXIgdGhlIG1lbnVcbiAgICAgIG9uT3BlbjogZnVuY3Rpb24gb25PcGVuKCkge30sXG4gICAgICAvLyBDYWxsYmFjayB3aGVuIHNpZHIgc3RhcnQgb3BlbmluZ1xuICAgICAgb25DbG9zZTogZnVuY3Rpb24gb25DbG9zZSgpIHt9LFxuICAgICAgLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIHN0YXJ0IGNsb3NpbmdcbiAgICAgIG9uT3BlbkVuZDogZnVuY3Rpb24gb25PcGVuRW5kKCkge30sXG4gICAgICAvLyBDYWxsYmFjayB3aGVuIHNpZHIgZW5kIG9wZW5pbmdcbiAgICAgIG9uQ2xvc2VFbmQ6IGZ1bmN0aW9uIG9uQ2xvc2VFbmQoKSB7fSAvLyBDYWxsYmFjayB3aGVuIHNpZHIgZW5kIGNsb3NpbmdcblxuICAgIH0sIG9wdGlvbnMpLFxuICAgICAgICBuYW1lID0gc2V0dGluZ3MubmFtZSxcbiAgICAgICAgJHNpZGVNZW51ID0gJCQzKCcjJyArIG5hbWUpO1xuXG4gICAgLy8gSWYgdGhlIHNpZGUgbWVudSBkbyBub3QgZXhpc3QgY3JlYXRlIGl0XG4gICAgaWYgKCRzaWRlTWVudS5sZW5ndGggPT09IDApIHtcbiAgICAgICRzaWRlTWVudSA9ICQkMygnPGRpdiAvPicpLmF0dHIoJ2lkJywgbmFtZSkuYXBwZW5kVG8oJCQzKCdib2R5JykpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0cmFuc2l0aW9uIHRvIG1lbnUgaWYgYXJlIHN1cHBvcnRlZFxuICAgIGlmICh0cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICRzaWRlTWVudS5jc3ModHJhbnNpdGlvbnMucHJvcGVydHksIHNldHRpbmdzLnNpZGUgKyAnICcgKyBzZXR0aW5ncy5zcGVlZCAvIDEwMDAgKyAncyAnICsgc2V0dGluZ3MudGltaW5nKTtcbiAgICB9XG5cbiAgICAvLyBBZGRpbmcgc3R5bGVzIGFuZCBvcHRpb25zXG4gICAgJHNpZGVNZW51LmFkZENsYXNzKCdzaWRyJykuYWRkQ2xhc3Moc2V0dGluZ3Muc2lkZSkuZGF0YSh7XG4gICAgICBzcGVlZDogc2V0dGluZ3Muc3BlZWQsXG4gICAgICBzaWRlOiBzZXR0aW5ncy5zaWRlLFxuICAgICAgYm9keTogc2V0dGluZ3MuYm9keSxcbiAgICAgIGRpc3BsYWNlOiBzZXR0aW5ncy5kaXNwbGFjZSxcbiAgICAgIHRpbWluZzogc2V0dGluZ3MudGltaW5nLFxuICAgICAgbWV0aG9kOiBzZXR0aW5ncy5tZXRob2QsXG4gICAgICBvbk9wZW46IHNldHRpbmdzLm9uT3BlbixcbiAgICAgIG9uQ2xvc2U6IHNldHRpbmdzLm9uQ2xvc2UsXG4gICAgICBvbk9wZW5FbmQ6IHNldHRpbmdzLm9uT3BlbkVuZCxcbiAgICAgIG9uQ2xvc2VFbmQ6IHNldHRpbmdzLm9uQ2xvc2VFbmRcbiAgICB9KTtcblxuICAgICRzaWRlTWVudSA9IGZpbGxDb250ZW50KCRzaWRlTWVudSwgc2V0dGluZ3MpO1xuXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkJDModGhpcyksXG4gICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoJ3NpZHInKSxcbiAgICAgICAgICBmbGFnID0gZmFsc2U7XG5cbiAgICAgIC8vIElmIHRoZSBwbHVnaW4gaGFzbid0IGJlZW4gaW5pdGlhbGl6ZWQgeWV0XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2lkclN0YXR1cy5vcGVuZWQgPSBmYWxzZTtcblxuICAgICAgICAkdGhpcy5kYXRhKCdzaWRyJywgbmFtZSk7XG5cbiAgICAgICAgJHRoaXMuYmluZChzZXR0aW5ncy5iaW5kLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKCFmbGFnKSB7XG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgIHNpZHIoc2V0dGluZ3MubWV0aG9kLCBuYW1lKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGpRdWVyeS5zaWRyID0gc2lkcjtcbiAgalF1ZXJ5LmZuLnNpZHIgPSBmblNpZHI7XG5cbn0oKSk7IiwiIWZ1bmN0aW9uKGUpe3ZhciB0O2UuZm4uc2xpbmt5PWZ1bmN0aW9uKGEpe3ZhciBzPWUuZXh0ZW5kKHtsYWJlbDpcIkJhY2tcIix0aXRsZTohMSxzcGVlZDozMDAscmVzaXplOiEwfSxhKSxpPWUodGhpcyksbj1pLmNoaWxkcmVuKCkuZmlyc3QoKTtpLmFkZENsYXNzKFwic2xpbmt5LW1lbnVcIik7dmFyIHI9ZnVuY3Rpb24oZSx0KXt2YXIgYT1NYXRoLnJvdW5kKHBhcnNlSW50KG4uZ2V0KDApLnN0eWxlLmxlZnQpKXx8MDtuLmNzcyhcImxlZnRcIixhLTEwMCplK1wiJVwiKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiZzZXRUaW1lb3V0KHQscy5zcGVlZCl9LGw9ZnVuY3Rpb24oZSl7aS5oZWlnaHQoZS5vdXRlckhlaWdodCgpKX0sZD1mdW5jdGlvbihlKXtpLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixlK1wibXNcIiksbi5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsZStcIm1zXCIpfTtpZihkKHMuc3BlZWQpLGUoXCJhICsgdWxcIixpKS5wcmV2KCkuYWRkQ2xhc3MoXCJuZXh0XCIpLGUoXCJsaSA+IHVsXCIsaSkucHJlcGVuZCgnPGxpIGNsYXNzPVwiaGVhZGVyXCI+Jykscy50aXRsZT09PSEwJiZlKFwibGkgPiB1bFwiLGkpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1lKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJhXCIpLmZpcnN0KCkudGV4dCgpLGE9ZShcIjxoMj5cIikudGV4dCh0KTtlKFwiPiAuaGVhZGVyXCIsdGhpcykuYXBwZW5kKGEpfSkscy50aXRsZXx8cy5sYWJlbCE9PSEwKXt2YXIgbz1lKFwiPGE+XCIpLnRleHQocy5sYWJlbCkucHJvcChcImhyZWZcIixcIiNcIikuYWRkQ2xhc3MoXCJiYWNrXCIpO2UoXCIuaGVhZGVyXCIsaSkuYXBwZW5kKG8pfWVsc2UgZShcImxpID4gdWxcIixpKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9ZSh0aGlzKS5wYXJlbnQoKS5maW5kKFwiYVwiKS5maXJzdCgpLnRleHQoKSxhPWUoXCI8YT5cIikudGV4dCh0KS5wcm9wKFwiaHJlZlwiLFwiI1wiKS5hZGRDbGFzcyhcImJhY2tcIik7ZShcIj4gLmhlYWRlclwiLHRoaXMpLmFwcGVuZChhKX0pO2UoXCJhXCIsaSkub24oXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2lmKCEodCtzLnNwZWVkPkRhdGUubm93KCkpKXt0PURhdGUubm93KCk7dmFyIG49ZSh0aGlzKTsvIy8udGVzdCh0aGlzLmhyZWYpJiZhLnByZXZlbnREZWZhdWx0KCksbi5oYXNDbGFzcyhcIm5leHRcIik/KGkuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksbi5uZXh0KCkuc2hvdygpLmFkZENsYXNzKFwiYWN0aXZlXCIpLHIoMSkscy5yZXNpemUmJmwobi5uZXh0KCkpKTpuLmhhc0NsYXNzKFwiYmFja1wiKSYmKHIoLTEsZnVuY3Rpb24oKXtpLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLG4ucGFyZW50KCkucGFyZW50KCkuaGlkZSgpLnBhcmVudHNVbnRpbChpLFwidWxcIikuZmlyc3QoKS5hZGRDbGFzcyhcImFjdGl2ZVwiKX0pLHMucmVzaXplJiZsKG4ucGFyZW50KCkucGFyZW50KCkucGFyZW50c1VudGlsKGksXCJ1bFwiKSkpfX0pLHRoaXMuanVtcD1mdW5jdGlvbih0LGEpe3Q9ZSh0KTt2YXIgbj1pLmZpbmQoXCIuYWN0aXZlXCIpO249bi5sZW5ndGg+MD9uLnBhcmVudHNVbnRpbChpLFwidWxcIikubGVuZ3RoOjAsaS5maW5kKFwidWxcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuaGlkZSgpO3ZhciBvPXQucGFyZW50c1VudGlsKGksXCJ1bFwiKTtvLnNob3coKSx0LnNob3coKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxhPT09ITEmJmQoMCkscihvLmxlbmd0aC1uKSxzLnJlc2l6ZSYmbCh0KSxhPT09ITEmJmQocy5zcGVlZCl9LHRoaXMuaG9tZT1mdW5jdGlvbih0KXt0PT09ITEmJmQoMCk7dmFyIGE9aS5maW5kKFwiLmFjdGl2ZVwiKSxuPWEucGFyZW50c1VudGlsKGksXCJsaVwiKS5sZW5ndGg7bj4wJiYocigtbixmdW5jdGlvbigpe2EucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIil9KSxzLnJlc2l6ZSYmbChlKGEucGFyZW50c1VudGlsKGksXCJsaVwiKS5nZXQobi0xKSkucGFyZW50KCkpKSx0PT09ITEmJmQocy5zcGVlZCl9LHRoaXMuZGVzdHJveT1mdW5jdGlvbigpe2UoXCIuaGVhZGVyXCIsaSkucmVtb3ZlKCksZShcImFcIixpKS5yZW1vdmVDbGFzcyhcIm5leHRcIikub2ZmKFwiY2xpY2tcIiksaS5yZW1vdmVDbGFzcyhcInNsaW5reS1tZW51XCIpLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixcIlwiKSxuLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixcIlwiKX07dmFyIGM9aS5maW5kKFwiLmFjdGl2ZVwiKTtyZXR1cm4gYy5sZW5ndGg+MCYmKGMucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksdGhpcy5qdW1wKGMsITEpKSx0aGlzfX0oalF1ZXJ5KTsiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBBamF4TW9uaXRvciwgQmFyLCBEb2N1bWVudE1vbml0b3IsIEVsZW1lbnRNb25pdG9yLCBFbGVtZW50VHJhY2tlciwgRXZlbnRMYWdNb25pdG9yLCBFdmVudGVkLCBFdmVudHMsIE5vVGFyZ2V0RXJyb3IsIFBhY2UsIFJlcXVlc3RJbnRlcmNlcHQsIFNPVVJDRV9LRVlTLCBTY2FsZXIsIFNvY2tldFJlcXVlc3RUcmFja2VyLCBYSFJSZXF1ZXN0VHJhY2tlciwgYW5pbWF0aW9uLCBhdmdBbXBsaXR1ZGUsIGJhciwgY2FuY2VsQW5pbWF0aW9uLCBjYW5jZWxBbmltYXRpb25GcmFtZSwgZGVmYXVsdE9wdGlvbnMsIGV4dGVuZCwgZXh0ZW5kTmF0aXZlLCBnZXRGcm9tRE9NLCBnZXRJbnRlcmNlcHQsIGhhbmRsZVB1c2hTdGF0ZSwgaWdub3JlU3RhY2ssIGluaXQsIG5vdywgb3B0aW9ucywgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCByZXN1bHQsIHJ1bkFuaW1hdGlvbiwgc2NhbGVycywgc2hvdWxkSWdub3JlVVJMLCBzaG91bGRUcmFjaywgc291cmNlLCBzb3VyY2VzLCB1bmlTY2FsZXIsIF9XZWJTb2NrZXQsIF9YRG9tYWluUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0LCBfaSwgX2ludGVyY2VwdCwgX2xlbiwgX3B1c2hTdGF0ZSwgX3JlZiwgX3JlZjEsIF9yZXBsYWNlU3RhdGUsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNhdGNodXBUaW1lOiAxMDAsXG4gICAgaW5pdGlhbFJhdGU6IC4wMyxcbiAgICBtaW5UaW1lOiAyNTAsXG4gICAgZ2hvc3RUaW1lOiAxMDAsXG4gICAgbWF4UHJvZ3Jlc3NQZXJGcmFtZTogMjAsXG4gICAgZWFzZUZhY3RvcjogMS4yNSxcbiAgICBzdGFydE9uUGFnZUxvYWQ6IHRydWUsXG4gICAgcmVzdGFydE9uUHVzaFN0YXRlOiB0cnVlLFxuICAgIHJlc3RhcnRPblJlcXVlc3RBZnRlcjogNTAwLFxuICAgIHRhcmdldDogJ2JvZHknLFxuICAgIGVsZW1lbnRzOiB7XG4gICAgICBjaGVja0ludGVydmFsOiAxMDAsXG4gICAgICBzZWxlY3RvcnM6IFsnYm9keSddXG4gICAgfSxcbiAgICBldmVudExhZzoge1xuICAgICAgbWluU2FtcGxlczogMTAsXG4gICAgICBzYW1wbGVDb3VudDogMyxcbiAgICAgIGxhZ1RocmVzaG9sZDogM1xuICAgIH0sXG4gICAgYWpheDoge1xuICAgICAgdHJhY2tNZXRob2RzOiBbJ0dFVCddLFxuICAgICAgdHJhY2tXZWJTb2NrZXRzOiB0cnVlLFxuICAgICAgaWdub3JlVVJMczogW11cbiAgICB9XG4gIH07XG5cbiAgbm93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgcmV0dXJuIChfcmVmID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsID8gdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gXCJmdW5jdGlvblwiID8gcGVyZm9ybWFuY2Uubm93KCkgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwgPyBfcmVmIDogKyhuZXcgRGF0ZSk7XG4gIH07XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZTtcblxuICBpZiAocmVxdWVzdEFuaW1hdGlvbkZyYW1lID09IG51bGwpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZm4sIDUwKTtcbiAgICB9O1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHJldHVybiBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG4gIH1cblxuICBydW5BbmltYXRpb24gPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBsYXN0LCB0aWNrO1xuICAgIGxhc3QgPSBub3coKTtcbiAgICB0aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGlmZjtcbiAgICAgIGRpZmYgPSBub3coKSAtIGxhc3Q7XG4gICAgICBpZiAoZGlmZiA+PSAzMykge1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHJldHVybiBmbihkaWZmLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHRpY2ssIDMzIC0gZGlmZik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGljaygpO1xuICB9O1xuXG4gIHJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBrZXksIG9iajtcbiAgICBvYmogPSBhcmd1bWVudHNbMF0sIGtleSA9IGFyZ3VtZW50c1sxXSwgYXJncyA9IDMgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogW107XG4gICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9ialtrZXldLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9XG4gIH07XG5cbiAgZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGtleSwgb3V0LCBzb3VyY2UsIHNvdXJjZXMsIHZhbCwgX2ksIF9sZW47XG4gICAgb3V0ID0gYXJndW1lbnRzWzBdLCBzb3VyY2VzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHNvdXJjZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZXNbX2ldO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAoIV9faGFzUHJvcC5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7XG4gICAgICAgICAgdmFsID0gc291cmNlW2tleV07XG4gICAgICAgICAgaWYgKChvdXRba2V5XSAhPSBudWxsKSAmJiB0eXBlb2Ygb3V0W2tleV0gPT09ICdvYmplY3QnICYmICh2YWwgIT0gbnVsbCkgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGV4dGVuZChvdXRba2V5XSwgdmFsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0W2tleV0gPSB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgYXZnQW1wbGl0dWRlID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIGNvdW50LCBzdW0sIHYsIF9pLCBfbGVuO1xuICAgIHN1bSA9IGNvdW50ID0gMDtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGFyci5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdiA9IGFycltfaV07XG4gICAgICBzdW0gKz0gTWF0aC5hYnModik7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgICByZXR1cm4gc3VtIC8gY291bnQ7XG4gIH07XG5cbiAgZ2V0RnJvbURPTSA9IGZ1bmN0aW9uKGtleSwganNvbikge1xuICAgIHZhciBkYXRhLCBlLCBlbDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGtleSA9ICdvcHRpb25zJztcbiAgICB9XG4gICAgaWYgKGpzb24gPT0gbnVsbCkge1xuICAgICAganNvbiA9IHRydWU7XG4gICAgfVxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLXBhY2UtXCIgKyBrZXkgKyBcIl1cIik7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYWNlLVwiICsga2V5KTtcbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICBlID0gX2Vycm9yO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBpbmxpbmUgcGFjZSBvcHRpb25zXCIsIGUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcblxuICBFdmVudGVkID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50ZWQoKSB7fVxuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudCwgaGFuZGxlciwgY3R4LCBvbmNlKSB7XG4gICAgICB2YXIgX2Jhc2U7XG4gICAgICBpZiAob25jZSA9PSBudWxsKSB7XG4gICAgICAgIG9uY2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW2V2ZW50XSA9PSBudWxsKSB7XG4gICAgICAgIF9iYXNlW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbZXZlbnRdLnB1c2goe1xuICAgICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgICBjdHg6IGN0eCxcbiAgICAgICAgb25jZTogb25jZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgaGFuZGxlciwgY3R4KSB7XG4gICAgICByZXR1cm4gdGhpcy5vbihldmVudCwgaGFuZGxlciwgY3R4LCB0cnVlKTtcbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIHZhciBpLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIGlmICgoKF9yZWYgPSB0aGlzLmJpbmRpbmdzKSAhPSBudWxsID8gX3JlZltldmVudF0gOiB2b2lkIDApID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGhhbmRsZXIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMuYmluZGluZ3NbZXZlbnRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3NbZXZlbnRdW2ldLmhhbmRsZXIgPT09IGhhbmRsZXIpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5iaW5kaW5nc1tldmVudF0uc3BsaWNlKGksIDEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChpKyspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBjdHgsIGV2ZW50LCBoYW5kbGVyLCBpLCBvbmNlLCBfcmVmLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBldmVudCA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBpZiAoKF9yZWYgPSB0aGlzLmJpbmRpbmdzKSAhPSBudWxsID8gX3JlZltldmVudF0gOiB2b2lkIDApIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XG4gICAgICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXSwgaGFuZGxlciA9IF9yZWYxLmhhbmRsZXIsIGN0eCA9IF9yZWYxLmN0eCwgb25jZSA9IF9yZWYxLm9uY2U7XG4gICAgICAgICAgaGFuZGxlci5hcHBseShjdHggIT0gbnVsbCA/IGN0eCA6IHRoaXMsIGFyZ3MpO1xuICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRlZDtcblxuICB9KSgpO1xuXG4gIFBhY2UgPSB3aW5kb3cuUGFjZSB8fCB7fTtcblxuICB3aW5kb3cuUGFjZSA9IFBhY2U7XG5cbiAgZXh0ZW5kKFBhY2UsIEV2ZW50ZWQucHJvdG90eXBlKTtcblxuICBvcHRpb25zID0gUGFjZS5vcHRpb25zID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgd2luZG93LnBhY2VPcHRpb25zLCBnZXRGcm9tRE9NKCkpO1xuXG4gIF9yZWYgPSBbJ2FqYXgnLCAnZG9jdW1lbnQnLCAnZXZlbnRMYWcnLCAnZWxlbWVudHMnXTtcbiAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgc291cmNlID0gX3JlZltfaV07XG4gICAgaWYgKG9wdGlvbnNbc291cmNlXSA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9uc1tzb3VyY2VdID0gZGVmYXVsdE9wdGlvbnNbc291cmNlXTtcbiAgICB9XG4gIH1cblxuICBOb1RhcmdldEVycm9yID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb1RhcmdldEVycm9yLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gTm9UYXJnZXRFcnJvcigpIHtcbiAgICAgIF9yZWYxID0gTm9UYXJnZXRFcnJvci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfcmVmMTtcbiAgICB9XG5cbiAgICByZXR1cm4gTm9UYXJnZXRFcnJvcjtcblxuICB9KShFcnJvcik7XG5cbiAgQmFyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJhcigpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgIH1cblxuICAgIEJhci5wcm90b3R5cGUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRhcmdldEVsZW1lbnQ7XG4gICAgICBpZiAodGhpcy5lbCA9PSBudWxsKSB7XG4gICAgICAgIHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE5vVGFyZ2V0RXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTmFtZSA9IFwicGFjZSBwYWNlLWFjdGl2ZVwiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoL3BhY2UtZG9uZS9nLCAnJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1ydW5uaW5nJztcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInBhY2UtcHJvZ3Jlc3NcIj5cXG4gIDxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzLWlubmVyXCI+PC9kaXY+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cInBhY2UtYWN0aXZpdHlcIj48L2Rpdj4nO1xuICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5maXJzdENoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLmVsLCB0YXJnZXRFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsO1xuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLWFjdGl2ZScsICcnKTtcbiAgICAgIGVsLmNsYXNzTmFtZSArPSAnIHBhY2UtaW5hY3RpdmUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLXJ1bm5pbmcnLCAnJyk7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBwYWNlLWRvbmUnO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHByb2cpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9nO1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdldEVsZW1lbnQoKSk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsID0gdm9pZCAwO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsLCBrZXksIHByb2dyZXNzU3RyLCB0cmFuc2Zvcm0sIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBlbCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgdHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIHRoaXMucHJvZ3Jlc3MgKyBcIiUsIDAsIDApXCI7XG4gICAgICBfcmVmMiA9IFsnd2Via2l0VHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJywgJ3RyYW5zZm9ybSddO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGtleSA9IF9yZWYyW19qXTtcbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc3R5bGVba2V5XSA9IHRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8fCB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzIHwgMCAhPT0gdGhpcy5wcm9ncmVzcyB8IDApIHtcbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdkYXRhLXByb2dyZXNzLXRleHQnLCBcIlwiICsgKHRoaXMucHJvZ3Jlc3MgfCAwKSArIFwiJVwiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3MgPj0gMTAwKSB7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgPSAnOTknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gdGhpcy5wcm9ncmVzcyA8IDEwID8gXCIwXCIgOiBcIlwiO1xuICAgICAgICAgIHByb2dyZXNzU3RyICs9IHRoaXMucHJvZ3Jlc3MgfCAwO1xuICAgICAgICB9XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcycsIFwiXCIgKyBwcm9ncmVzc1N0cik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPj0gMTAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gQmFyO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50cygpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICB9XG5cbiAgICBFdmVudHMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjIgPSB0aGlzLmJpbmRpbmdzW25hbWVdO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBiaW5kaW5nID0gX3JlZjJbX2pdO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy5jYWxsKHRoaXMsIHZhbCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRXZlbnRzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgICB2YXIgX2Jhc2U7XG4gICAgICBpZiAoKF9iYXNlID0gdGhpcy5iaW5kaW5ncylbbmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtuYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbbmFtZV0ucHVzaChmbik7XG4gICAgfTtcblxuICAgIHJldHVybiBFdmVudHM7XG5cbiAgfSkoKTtcblxuICBfWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XG5cbiAgX1hEb21haW5SZXF1ZXN0ID0gd2luZG93LlhEb21haW5SZXF1ZXN0O1xuXG4gIF9XZWJTb2NrZXQgPSB3aW5kb3cuV2ViU29ja2V0O1xuXG4gIGV4dGVuZE5hdGl2ZSA9IGZ1bmN0aW9uKHRvLCBmcm9tKSB7XG4gICAgdmFyIGUsIGtleSwgX3Jlc3VsdHM7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiBmcm9tLnByb3RvdHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCh0b1trZXldID09IG51bGwpICYmIHR5cGVvZiBmcm9tW2tleV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIGtleSwge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tLnByb3RvdHlwZVtrZXldO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0b1trZXldID0gZnJvbS5wcm90b3R5cGVba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBpZ25vcmVTdGFjayA9IFtdO1xuXG4gIFBhY2UuaWdub3JlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XG4gICAgZm4gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGlnbm9yZVN0YWNrLnVuc2hpZnQoJ2lnbm9yZScpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBQYWNlLnRyYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XG4gICAgZm4gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGlnbm9yZVN0YWNrLnVuc2hpZnQoJ3RyYWNrJyk7XG4gICAgcmV0ID0gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgaWdub3JlU3RhY2suc2hpZnQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIHNob3VsZFRyYWNrID0gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgdmFyIF9yZWYyO1xuICAgIGlmIChtZXRob2QgPT0gbnVsbCkge1xuICAgICAgbWV0aG9kID0gJ0dFVCc7XG4gICAgfVxuICAgIGlmIChpZ25vcmVTdGFja1swXSA9PT0gJ3RyYWNrJykge1xuICAgICAgcmV0dXJuICdmb3JjZSc7XG4gICAgfVxuICAgIGlmICghaWdub3JlU3RhY2subGVuZ3RoICYmIG9wdGlvbnMuYWpheCkge1xuICAgICAgaWYgKG1ldGhvZCA9PT0gJ3NvY2tldCcgJiYgb3B0aW9ucy5hamF4LnRyYWNrV2ViU29ja2V0cykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoX3JlZjIgPSBtZXRob2QudG9VcHBlckNhc2UoKSwgX19pbmRleE9mLmNhbGwob3B0aW9ucy5hamF4LnRyYWNrTWV0aG9kcywgX3JlZjIpID49IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBSZXF1ZXN0SW50ZXJjZXB0ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZXF1ZXN0SW50ZXJjZXB0LCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gUmVxdWVzdEludGVyY2VwdCgpIHtcbiAgICAgIHZhciBtb25pdG9yWEhSLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICBSZXF1ZXN0SW50ZXJjZXB0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgbW9uaXRvclhIUiA9IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB2YXIgX29wZW47XG4gICAgICAgIF9vcGVuID0gcmVxLm9wZW47XG4gICAgICAgIHJldHVybiByZXEub3BlbiA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgYXN5bmMpIHtcbiAgICAgICAgICBpZiAoc2hvdWxkVHJhY2sodHlwZSkpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX29wZW4uYXBwbHkocmVxLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uKGZsYWdzKSB7XG4gICAgICAgIHZhciByZXE7XG4gICAgICAgIHJlcSA9IG5ldyBfWE1MSHR0cFJlcXVlc3QoZmxhZ3MpO1xuICAgICAgICBtb25pdG9yWEhSKHJlcSk7XG4gICAgICAgIHJldHVybiByZXE7XG4gICAgICB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0KTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIGlmIChfWERvbWFpblJlcXVlc3QgIT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgIHJlcSA9IG5ldyBfWERvbWFpblJlcXVlc3Q7XG4gICAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YRG9tYWluUmVxdWVzdCwgX1hEb21haW5SZXF1ZXN0KTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgfVxuICAgICAgaWYgKChfV2ViU29ja2V0ICE9IG51bGwpICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgd2luZG93LldlYlNvY2tldCA9IGZ1bmN0aW9uKHVybCwgcHJvdG9jb2xzKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICBpZiAocHJvdG9jb2xzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCwgcHJvdG9jb2xzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxID0gbmV3IF9XZWJTb2NrZXQodXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKCdzb2NrZXQnKSkge1xuICAgICAgICAgICAgX3RoaXMudHJpZ2dlcigncmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgdHlwZTogJ3NvY2tldCcsXG4gICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICBwcm90b2NvbHM6IHByb3RvY29scyxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHRlbmROYXRpdmUod2luZG93LldlYlNvY2tldCwgX1dlYlNvY2tldCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVxdWVzdEludGVyY2VwdDtcblxuICB9KShFdmVudHMpO1xuXG4gIF9pbnRlcmNlcHQgPSBudWxsO1xuXG4gIGdldEludGVyY2VwdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChfaW50ZXJjZXB0ID09IG51bGwpIHtcbiAgICAgIF9pbnRlcmNlcHQgPSBuZXcgUmVxdWVzdEludGVyY2VwdDtcbiAgICB9XG4gICAgcmV0dXJuIF9pbnRlcmNlcHQ7XG4gIH07XG5cbiAgc2hvdWxkSWdub3JlVVJMID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHBhdHRlcm4sIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgX3JlZjIgPSBvcHRpb25zLmFqYXguaWdub3JlVVJMcztcbiAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgIHBhdHRlcm4gPSBfcmVmMltfal07XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZihwYXR0ZXJuKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHBhdHRlcm4udGVzdCh1cmwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGdldEludGVyY2VwdCgpLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24oX2FyZykge1xuICAgIHZhciBhZnRlciwgYXJncywgcmVxdWVzdCwgdHlwZSwgdXJsO1xuICAgIHR5cGUgPSBfYXJnLnR5cGUsIHJlcXVlc3QgPSBfYXJnLnJlcXVlc3QsIHVybCA9IF9hcmcudXJsO1xuICAgIGlmIChzaG91bGRJZ25vcmVVUkwodXJsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIVBhY2UucnVubmluZyAmJiAob3B0aW9ucy5yZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIgIT09IGZhbHNlIHx8IHNob3VsZFRyYWNrKHR5cGUpID09PSAnZm9yY2UnKSkge1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGFmdGVyID0gb3B0aW9ucy5yZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIgfHwgMDtcbiAgICAgIGlmICh0eXBlb2YgYWZ0ZXIgPT09ICdib29sZWFuJykge1xuICAgICAgICBhZnRlciA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0aWxsQWN0aXZlLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVmMywgX3Jlc3VsdHM7XG4gICAgICAgIGlmICh0eXBlID09PSAnc29ja2V0Jykge1xuICAgICAgICAgIHN0aWxsQWN0aXZlID0gcmVxdWVzdC5yZWFkeVN0YXRlIDwgMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9ICgwIDwgKF9yZWYyID0gcmVxdWVzdC5yZWFkeVN0YXRlKSAmJiBfcmVmMiA8IDQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGlsbEFjdGl2ZSkge1xuICAgICAgICAgIFBhY2UucmVzdGFydCgpO1xuICAgICAgICAgIF9yZWYzID0gUGFjZS5zb3VyY2VzO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBfcmVmM1tfal07XG4gICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQWpheE1vbml0b3IpIHtcbiAgICAgICAgICAgICAgc291cmNlLndhdGNoLmFwcGx5KHNvdXJjZSwgYXJncyk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0sIGFmdGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIEFqYXhNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEFqYXhNb25pdG9yKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgIGdldEludGVyY2VwdCgpLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy53YXRjaC5hcHBseShfdGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIEFqYXhNb25pdG9yLnByb3RvdHlwZS53YXRjaCA9IGZ1bmN0aW9uKF9hcmcpIHtcbiAgICAgIHZhciByZXF1ZXN0LCB0cmFja2VyLCB0eXBlLCB1cmw7XG4gICAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICAgIGlmIChzaG91bGRJZ25vcmVVUkwodXJsKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgdHJhY2tlciA9IG5ldyBTb2NrZXRSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5wdXNoKHRyYWNrZXIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQWpheE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBYSFJSZXF1ZXN0VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBYSFJSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KSB7XG4gICAgICB2YXIgZXZlbnQsIHNpemUsIF9qLCBfbGVuMSwgX29ucmVhZHlzdGF0ZWNoYW5nZSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgaWYgKHdpbmRvdy5Qcm9ncmVzc0V2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgc2l6ZSA9IG51bGw7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IF90aGlzLnByb2dyZXNzICsgKDEwMCAtIF90aGlzLnByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIF9yZWYyID0gWydsb2FkJywgJ2Fib3J0JywgJ3RpbWVvdXQnLCAnZXJyb3InXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3JlZjM7XG4gICAgICAgICAgaWYgKChfcmVmMyA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgPT09IDAgfHwgX3JlZjMgPT09IDQpIHtcbiAgICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSAzKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDUwO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHlwZW9mIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPT09IFwiZnVuY3Rpb25cIiA/IF9vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKSA6IHZvaWQgMDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWEhSUmVxdWVzdFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBTb2NrZXRSZXF1ZXN0VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTb2NrZXRSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KSB7XG4gICAgICB2YXIgZXZlbnQsIF9qLCBfbGVuMSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgX3JlZjIgPSBbJ2Vycm9yJywgJ29wZW4nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBldmVudCA9IF9yZWYyW19qXTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gU29ja2V0UmVxdWVzdFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBFbGVtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbGVtZW50TW9uaXRvcihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZWN0b3IsIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdG9ycyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0b3JzID0gW107XG4gICAgICB9XG4gICAgICBfcmVmMiA9IG9wdGlvbnMuc2VsZWN0b3JzO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIHNlbGVjdG9yID0gX3JlZjJbX2pdO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnB1c2gobmV3IEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEVsZW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudFRyYWNrZXIoc2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgdGhpcy5jaGVjaygpO1xuICAgIH1cblxuICAgIEVsZW1lbnRUcmFja2VyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY2hlY2soKTtcbiAgICAgICAgfSksIG9wdGlvbnMuZWxlbWVudHMuY2hlY2tJbnRlcnZhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRUcmFja2VyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEVsZW1lbnRUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRG9jdW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIERvY3VtZW50TW9uaXRvci5wcm90b3R5cGUuc3RhdGVzID0ge1xuICAgICAgbG9hZGluZzogMCxcbiAgICAgIGludGVyYWN0aXZlOiA1MCxcbiAgICAgIGNvbXBsZXRlOiAxMDBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRG9jdW1lbnRNb25pdG9yKCkge1xuICAgICAgdmFyIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gKF9yZWYyID0gdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0pICE9IG51bGwgPyBfcmVmMiA6IDEwMDtcbiAgICAgIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPSBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF90aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXSAhPSBudWxsKSB7XG4gICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBEb2N1bWVudE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBFdmVudExhZ01vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRMYWdNb25pdG9yKCkge1xuICAgICAgdmFyIGF2ZywgaW50ZXJ2YWwsIGxhc3QsIHBvaW50cywgc2FtcGxlcyxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBhdmcgPSAwO1xuICAgICAgc2FtcGxlcyA9IFtdO1xuICAgICAgcG9pbnRzID0gMDtcbiAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkaWZmO1xuICAgICAgICBkaWZmID0gbm93KCkgLSBsYXN0IC0gNTA7XG4gICAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgICAgc2FtcGxlcy5wdXNoKGRpZmYpO1xuICAgICAgICBpZiAoc2FtcGxlcy5sZW5ndGggPiBvcHRpb25zLmV2ZW50TGFnLnNhbXBsZUNvdW50KSB7XG4gICAgICAgICAgc2FtcGxlcy5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIGF2ZyA9IGF2Z0FtcGxpdHVkZShzYW1wbGVzKTtcbiAgICAgICAgaWYgKCsrcG9pbnRzID49IG9wdGlvbnMuZXZlbnRMYWcubWluU2FtcGxlcyAmJiBhdmcgPCBvcHRpb25zLmV2ZW50TGFnLmxhZ1RocmVzaG9sZCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIHJldHVybiBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiAoMyAvIChhdmcgKyAzKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRXZlbnRMYWdNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgU2NhbGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFNjYWxlcihzb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5sYXN0ID0gdGhpcy5zaW5jZUxhc3RVcGRhdGUgPSAwO1xuICAgICAgdGhpcy5yYXRlID0gb3B0aW9ucy5pbml0aWFsUmF0ZTtcbiAgICAgIHRoaXMuY2F0Y2h1cCA9IDA7XG4gICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5sYXN0UHJvZ3Jlc3MgPSAwO1xuICAgICAgaWYgKHRoaXMuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgU2NhbGVyLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oZnJhbWVUaW1lLCB2YWwpIHtcbiAgICAgIHZhciBzY2FsaW5nO1xuICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgIHZhbCA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XG4gICAgICB9XG4gICAgICBpZiAodmFsID49IDEwMCkge1xuICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA9PT0gdGhpcy5sYXN0KSB7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlICs9IGZyYW1lVGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNpbmNlTGFzdFVwZGF0ZSkge1xuICAgICAgICAgIHRoaXMucmF0ZSA9ICh2YWwgLSB0aGlzLmxhc3QpIC8gdGhpcy5zaW5jZUxhc3RVcGRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYXRjaHVwID0gKHZhbCAtIHRoaXMucHJvZ3Jlc3MpIC8gb3B0aW9ucy5jYXRjaHVwVGltZTtcbiAgICAgICAgdGhpcy5zaW5jZUxhc3RVcGRhdGUgPSAwO1xuICAgICAgICB0aGlzLmxhc3QgPSB2YWw7XG4gICAgICB9XG4gICAgICBpZiAodmFsID4gdGhpcy5wcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2dyZXNzICs9IHRoaXMuY2F0Y2h1cCAqIGZyYW1lVGltZTtcbiAgICAgIH1cbiAgICAgIHNjYWxpbmcgPSAxIC0gTWF0aC5wb3codGhpcy5wcm9ncmVzcyAvIDEwMCwgb3B0aW9ucy5lYXNlRmFjdG9yKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgKz0gc2NhbGluZyAqIHRoaXMucmF0ZSAqIGZyYW1lVGltZTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1pbih0aGlzLmxhc3RQcm9ncmVzcyArIG9wdGlvbnMubWF4UHJvZ3Jlc3NQZXJGcmFtZSwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5tYXgoMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMubGFzdFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2NhbGVyO1xuXG4gIH0pKCk7XG5cbiAgc291cmNlcyA9IG51bGw7XG5cbiAgc2NhbGVycyA9IG51bGw7XG5cbiAgYmFyID0gbnVsbDtcblxuICB1bmlTY2FsZXIgPSBudWxsO1xuXG4gIGFuaW1hdGlvbiA9IG51bGw7XG5cbiAgY2FuY2VsQW5pbWF0aW9uID0gbnVsbDtcblxuICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcblxuICBoYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAob3B0aW9ucy5yZXN0YXJ0T25QdXNoU3RhdGUpIHtcbiAgICAgIHJldHVybiBQYWNlLnJlc3RhcnQoKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSAhPSBudWxsKSB7XG4gICAgX3B1c2hTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZTtcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgICAgcmV0dXJuIF9wdXNoU3RhdGUuYXBwbHkod2luZG93Lmhpc3RvcnksIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgIT0gbnVsbCkge1xuICAgIF9yZXBsYWNlU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcmVwbGFjZVN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBTT1VSQ0VfS0VZUyA9IHtcbiAgICBhamF4OiBBamF4TW9uaXRvcixcbiAgICBlbGVtZW50czogRWxlbWVudE1vbml0b3IsXG4gICAgZG9jdW1lbnQ6IERvY3VtZW50TW9uaXRvcixcbiAgICBldmVudExhZzogRXZlbnRMYWdNb25pdG9yXG4gIH07XG5cbiAgKGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHlwZSwgX2osIF9rLCBfbGVuMSwgX2xlbjIsIF9yZWYyLCBfcmVmMywgX3JlZjQ7XG4gICAgUGFjZS5zb3VyY2VzID0gc291cmNlcyA9IFtdO1xuICAgIF9yZWYyID0gWydhamF4JywgJ2VsZW1lbnRzJywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJ107XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICB0eXBlID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKG9wdGlvbnNbdHlwZV0gIT09IGZhbHNlKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaChuZXcgU09VUkNFX0tFWVNbdHlwZV0ob3B0aW9uc1t0eXBlXSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBfcmVmNCA9IChfcmVmMyA9IG9wdGlvbnMuZXh0cmFTb3VyY2VzKSAhPSBudWxsID8gX3JlZjMgOiBbXTtcbiAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmNC5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgIHNvdXJjZSA9IF9yZWY0W19rXTtcbiAgICAgIHNvdXJjZXMucHVzaChuZXcgc291cmNlKG9wdGlvbnMpKTtcbiAgICB9XG4gICAgUGFjZS5iYXIgPSBiYXIgPSBuZXcgQmFyO1xuICAgIHNjYWxlcnMgPSBbXTtcbiAgICByZXR1cm4gdW5pU2NhbGVyID0gbmV3IFNjYWxlcjtcbiAgfSkoKTtcblxuICBQYWNlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBQYWNlLnRyaWdnZXIoJ3N0b3AnKTtcbiAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBiYXIuZGVzdHJveSgpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IHRydWU7XG4gICAgaWYgKGFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFuaW1hdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBpbml0KCk7XG4gIH07XG5cbiAgUGFjZS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdyZXN0YXJ0Jyk7XG4gICAgUGFjZS5zdG9wKCk7XG4gICAgcmV0dXJuIFBhY2Uuc3RhcnQoKTtcbiAgfTtcblxuICBQYWNlLmdvID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXJ0O1xuICAgIFBhY2UucnVubmluZyA9IHRydWU7XG4gICAgYmFyLnJlbmRlcigpO1xuICAgIHN0YXJ0ID0gbm93KCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgcmV0dXJuIGFuaW1hdGlvbiA9IHJ1bkFuaW1hdGlvbihmdW5jdGlvbihmcmFtZVRpbWUsIGVucXVldWVOZXh0RnJhbWUpIHtcbiAgICAgIHZhciBhdmcsIGNvdW50LCBkb25lLCBlbGVtZW50LCBlbGVtZW50cywgaSwgaiwgcmVtYWluaW5nLCBzY2FsZXIsIHNjYWxlckxpc3QsIHN1bSwgX2osIF9rLCBfbGVuMSwgX2xlbjIsIF9yZWYyO1xuICAgICAgcmVtYWluaW5nID0gMTAwIC0gYmFyLnByb2dyZXNzO1xuICAgICAgY291bnQgPSBzdW0gPSAwO1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBmb3IgKGkgPSBfaiA9IDAsIF9sZW4xID0gc291cmNlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IGkgPSArK19qKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICAgIHNjYWxlckxpc3QgPSBzY2FsZXJzW2ldICE9IG51bGwgPyBzY2FsZXJzW2ldIDogc2NhbGVyc1tpXSA9IFtdO1xuICAgICAgICBlbGVtZW50cyA9IChfcmVmMiA9IHNvdXJjZS5lbGVtZW50cykgIT0gbnVsbCA/IF9yZWYyIDogW3NvdXJjZV07XG4gICAgICAgIGZvciAoaiA9IF9rID0gMCwgX2xlbjIgPSBlbGVtZW50cy5sZW5ndGg7IF9rIDwgX2xlbjI7IGogPSArK19rKSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2pdO1xuICAgICAgICAgIHNjYWxlciA9IHNjYWxlckxpc3Rbal0gIT0gbnVsbCA/IHNjYWxlckxpc3Rbal0gOiBzY2FsZXJMaXN0W2pdID0gbmV3IFNjYWxlcihlbGVtZW50KTtcbiAgICAgICAgICBkb25lICY9IHNjYWxlci5kb25lO1xuICAgICAgICAgIGlmIChzY2FsZXIuZG9uZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgc3VtICs9IHNjYWxlci50aWNrKGZyYW1lVGltZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF2ZyA9IHN1bSAvIGNvdW50O1xuICAgICAgYmFyLnVwZGF0ZSh1bmlTY2FsZXIudGljayhmcmFtZVRpbWUsIGF2ZykpO1xuICAgICAgaWYgKGJhci5kb25lKCkgfHwgZG9uZSB8fCBjYW5jZWxBbmltYXRpb24pIHtcbiAgICAgICAgYmFyLnVwZGF0ZSgxMDApO1xuICAgICAgICBQYWNlLnRyaWdnZXIoJ2RvbmUnKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYmFyLmZpbmlzaCgpO1xuICAgICAgICAgIFBhY2UucnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBQYWNlLnRyaWdnZXIoJ2hpZGUnKTtcbiAgICAgICAgfSwgTWF0aC5tYXgob3B0aW9ucy5naG9zdFRpbWUsIE1hdGgubWF4KG9wdGlvbnMubWluVGltZSAtIChub3coKSAtIHN0YXJ0KSwgMCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbnF1ZXVlTmV4dEZyYW1lKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgUGFjZS5zdGFydCA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG4gICAgZXh0ZW5kKG9wdGlvbnMsIF9vcHRpb25zKTtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBiYXIucmVuZGVyKCk7XG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICBOb1RhcmdldEVycm9yID0gX2Vycm9yO1xuICAgIH1cbiAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWNlJykpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KFBhY2Uuc3RhcnQsIDUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUGFjZS50cmlnZ2VyKCdzdGFydCcpO1xuICAgICAgcmV0dXJuIFBhY2UuZ28oKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3BhY2UnXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFjZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFBhY2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMuc3RhcnRPblBhZ2VMb2FkKSB7XG4gICAgICBQYWNlLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGhhbmRsZVRvZ2dsZSA9IChldmVudCkgPT4ge1xuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgdmFyIHBhcmVudE5vZGUgPSB0YXJnZXQuY2xvc2VzdCgnLmZhcS1pdGVtJyk7XG5cbiAgICBwYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbiAgfTtcblxuLy8gQWRkIGV2ZW50TGlzdGVuZXJzLlxuICB2YXIgdG9nZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1mYXEtaXRlbS10b2dnbGUnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IHRvZ2dsZXNbaV07XG5cbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlVG9nZ2xlKTtcbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgY29uc3QgZmFrZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciBwYXJlbnRGb3JtID0gdGFyZ2V0LmNsb3Nlc3QoJ2Zvcm0nKTtcblxuICAgIHBhcmVudEZvcm0uc3VibWl0KCk7XG4gIH07XG5cbiAgY29uc3QgaGlnaGxpZ2h0ID0gKGV2ZW50KSA9PiB7XG4gICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICB2YXIgd3JhcHBlciA9IHRhcmdldC5jbG9zZXN0KCcucGFyYWdyYXBoLS10eXBlLS1wYWNrYWdlLWNob29zZXInKTtcbiAgICB2YXIgY29udGFpbmVyID0gdGFyZ2V0LmNsb3Nlc3QoJy5wYWNrYWdlLXNlbGVjdG9yJyk7XG4gICAgdmFyIHNlbGVjdG9ycyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvckFsbCgnLnBhY2thZ2Utc2VsZWN0b3InKTtcblxuICAgIC8vIFJlbW92ZSBjbGFzcyBmcm9tIGFsbCBvdGhlciBjb250YWluZXJzLlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VsZWN0b3IgPSBzZWxlY3RvcnNbaV07XG5cbiAgICAgIHNlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodGVkJyk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGNsYXNzIHRvIGNvbnRhaW5lci5cbiAgICBjb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaGlnaGxpZ2h0ZWQnKTtcbiAgfTtcblxuICAvLyBBZGQgZXZlbnRMaXN0ZW5lcnMuXG4gIHZhciBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhcmFncmFwaC0tdHlwZS0tcGFja2FnZS1jaG9vc2VyIC5maWVsZC0tbmFtZS1maWVsZC1saW5rIGEnKTtcbiAgdmFyIHJhZGlvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYXJhZ3JhcGgtLXR5cGUtLXBhY2thZ2UtY2hvb3NlciBpbnB1dFtuYW1lPVwiZGVjcmV0b19wYWtrZV9kdV92YWVsZ2VyXCJdJyk7XG5cbiAgLy8gQnV0dG9ucy5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmYWtlU3VibWl0KTtcbiAgfVxuXG4gIC8vIFJhZGlvcy5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYWRpb3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcmFkaW8gPSByYWRpb3NbaV07XG5cbiAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoaWdobGlnaHQpO1xuICB9XG59KSgpO1xuIiwialF1ZXJ5KGZ1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBGbGV4eSBoZWFkZXJcbiAgZmxleHlfaGVhZGVyLmluaXQoKTtcblxuICAvLyBTaWRyXG4gICQoJy5zbGlua3ktbWVudScpXG4gICAgLmZpbmQoJ3VsLCBsaSwgYScpXG4gICAgLnJlbW92ZUNsYXNzKCk7XG5cbiAgJCgnLnNpZHItdG9nZ2xlLS1yaWdodCcpLnNpZHIoe1xuICAgIG5hbWU6ICdzaWRyLW1haW4nLFxuICAgIHNpZGU6ICdyaWdodCcsXG4gICAgcmVuYW1pbmc6IGZhbHNlLFxuICAgIGJvZHk6ICcubGF5b3V0X193cmFwcGVyJyxcbiAgICBzb3VyY2U6ICcuc2lkci1zb3VyY2UtcHJvdmlkZXInXG4gIH0pO1xuXG4gIC8vIEVuYWJsZSB0b29sdGlwcy5cbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcblxuICAvLyBUZXN0aW1vbmlhbHMuXG4gIHRucyh7XG4gICAgY29udGFpbmVyOiAnLnRlc3RpbW9uaWFscyAudmlldy1jb250ZW50JyxcbiAgICBjZW50ZXI6IHRydWUsXG4gICAgaXRlbXM6IDIsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOiB0cnVlXG4gIH0pO1xuXG4gIC8vIEV4cGxhaW5lcnMuXG4gIHRucyh7XG4gICAgY29udGFpbmVyOiAnLmV4cGxhaW5lcnMgLnZpZXctY29udGVudCcsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIGl0ZW1zOiAxLFxuICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZVxuICB9KTtcbn0pO1xuIl19
