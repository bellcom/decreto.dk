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
  var slider = tns({
    container: '.testimonials .view-content',
    center: true,
    items: 2,
    autoplay: true,
    autoplayHoverPause: true
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbnktc2xpZGVyLmpzIiwiYm9vdHN0cmFwLmpzIiwiZmxleHktaGVhZGVyLmpzIiwiZmxleHktbmF2aWdhdGlvbi5qcyIsImpxdWVyeS5zaWRyLmpzIiwianF1ZXJ5LnNsaW5reS5qcyIsInBhY2UuanMiLCJmYXEtaXRlbXMuanMiLCJhcHAuanMiXSwibmFtZXMiOlsidG5zIiwiT2JqZWN0Iiwia2V5cyIsIm9iamVjdCIsIm5hbWUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJwdXNoIiwiRWxlbWVudCIsInJlbW92ZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIndpbiIsIndpbmRvdyIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2IiLCJzZXRUaW1lb3V0Iiwid2luJDEiLCJjYWYiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaWQiLCJjbGVhclRpbWVvdXQiLCJleHRlbmQiLCJvYmoiLCJjb3B5IiwidGFyZ2V0IiwiYXJndW1lbnRzIiwiaSIsImxlbmd0aCIsInVuZGVmaW5lZCIsImNoZWNrU3RvcmFnZVZhbHVlIiwidmFsdWUiLCJpbmRleE9mIiwiSlNPTiIsInBhcnNlIiwic2V0TG9jYWxTdG9yYWdlIiwic3RvcmFnZSIsImtleSIsImFjY2VzcyIsInNldEl0ZW0iLCJlIiwiZ2V0U2xpZGVJZCIsInRuc0lkIiwiZ2V0Qm9keSIsImRvYyIsImRvY3VtZW50IiwiYm9keSIsImNyZWF0ZUVsZW1lbnQiLCJmYWtlIiwiZG9jRWxlbWVudCIsImRvY3VtZW50RWxlbWVudCIsInNldEZha2VCb2R5IiwiZG9jT3ZlcmZsb3ciLCJzdHlsZSIsIm92ZXJmbG93IiwiYmFja2dyb3VuZCIsImFwcGVuZENoaWxkIiwicmVzZXRGYWtlQm9keSIsIm9mZnNldEhlaWdodCIsImNhbGMiLCJkaXYiLCJyZXN1bHQiLCJzdHIiLCJ2YWxzIiwidmFsIiwid2lkdGgiLCJvZmZzZXRXaWR0aCIsInJlcGxhY2UiLCJwZXJjZW50YWdlTGF5b3V0Iiwid3JhcHBlciIsIm91dGVyIiwiY291bnQiLCJwZXJQYWdlIiwic3VwcG9ydGVkIiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiTWF0aCIsImFicyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJjaGlsZHJlbiIsIm1lZGlhcXVlcnlTdXBwb3J0IiwicnVsZSIsInBvc2l0aW9uIiwidHlwZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwiY3JlYXRlU3R5bGVTaGVldCIsIm1lZGlhIiwic2V0QXR0cmlidXRlIiwicXVlcnlTZWxlY3RvciIsInNoZWV0IiwiYWRkQ1NTUnVsZSIsInNlbGVjdG9yIiwicnVsZXMiLCJpbmRleCIsImluc2VydFJ1bGUiLCJhZGRSdWxlIiwicmVtb3ZlQ1NTUnVsZSIsImRlbGV0ZVJ1bGUiLCJyZW1vdmVSdWxlIiwiZ2V0Q3NzUnVsZXNMZW5ndGgiLCJjc3NSdWxlcyIsInRvRGVncmVlIiwieSIsIngiLCJhdGFuMiIsIlBJIiwiZ2V0VG91Y2hEaXJlY3Rpb24iLCJhbmdsZSIsInJhbmdlIiwiZGlyZWN0aW9uIiwiZ2FwIiwiZm9yRWFjaCIsImFyciIsImNhbGxiYWNrIiwic2NvcGUiLCJsIiwiY2xhc3NMaXN0U3VwcG9ydCIsImhhc0NsYXNzIiwiZWwiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZENsYXNzIiwiYWRkIiwicmVtb3ZlQ2xhc3MiLCJoYXNBdHRyIiwiYXR0ciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJpc05vZGVMaXN0IiwiaXRlbSIsInNldEF0dHJzIiwiZWxzIiwiYXR0cnMiLCJBcnJheSIsInRvU3RyaW5nIiwicmVtb3ZlQXR0cnMiLCJhdHRyTGVuZ3RoIiwiaiIsInJlbW92ZUF0dHJpYnV0ZSIsImFycmF5RnJvbU5vZGVMaXN0IiwibmwiLCJoaWRlRWxlbWVudCIsImZvcmNlSGlkZSIsImRpc3BsYXkiLCJzaG93RWxlbWVudCIsImlzVmlzaWJsZSIsIndoaWNoUHJvcGVydHkiLCJwcm9wcyIsIlByb3BzIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJwcmVmaXhlcyIsInByZWZpeCIsImxlbiIsInByb3AiLCJoYXMzRFRyYW5zZm9ybXMiLCJ0ZiIsImhhczNkIiwiY3NzVEYiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiaW5zZXJ0QmVmb3JlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImdldEVuZFByb3BlcnR5IiwicHJvcEluIiwicHJvcE91dCIsImVuZFByb3AiLCJ0ZXN0Iiwic3VwcG9ydHNQYXNzaXZlIiwib3B0cyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmVPcHRpb24iLCJwYXNzaXZlIiwiYWRkRXZlbnRzIiwicHJldmVudFNjcm9sbGluZyIsIm9wdGlvbiIsInJlbW92ZUV2ZW50cyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJ0b3BpY3MiLCJvbiIsImV2ZW50TmFtZSIsImZuIiwib2ZmIiwic3BsaWNlIiwiZW1pdCIsImRhdGEiLCJqc1RyYW5zZm9ybSIsImVsZW1lbnQiLCJwb3N0Zml4IiwidG8iLCJkdXJhdGlvbiIsInRpY2siLCJtaW4iLCJ1bml0IiwiZnJvbSIsIk51bWJlciIsInBvc2l0aW9uVGljayIsInJ1bm5pbmciLCJtb3ZlRWxlbWVudCIsIm9wdGlvbnMiLCJjb250YWluZXIiLCJtb2RlIiwiYXhpcyIsIml0ZW1zIiwiZ3V0dGVyIiwiZWRnZVBhZGRpbmciLCJmaXhlZFdpZHRoIiwiYXV0b1dpZHRoIiwidmlld3BvcnRNYXgiLCJzbGlkZUJ5IiwiY2VudGVyIiwiY29udHJvbHMiLCJjb250cm9sc1Bvc2l0aW9uIiwiY29udHJvbHNUZXh0IiwiY29udHJvbHNDb250YWluZXIiLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsIm5hdiIsIm5hdlBvc2l0aW9uIiwibmF2Q29udGFpbmVyIiwibmF2QXNUaHVtYm5haWxzIiwiYXJyb3dLZXlzIiwic3BlZWQiLCJhdXRvcGxheSIsImF1dG9wbGF5UG9zaXRpb24iLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheURpcmVjdGlvbiIsImF1dG9wbGF5VGV4dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsImF1dG9wbGF5QnV0dG9uIiwiYXV0b3BsYXlCdXR0b25PdXRwdXQiLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5IiwiYW5pbWF0ZUluIiwiYW5pbWF0ZU91dCIsImFuaW1hdGVOb3JtYWwiLCJhbmltYXRlRGVsYXkiLCJsb29wIiwicmV3aW5kIiwiYXV0b0hlaWdodCIsInJlc3BvbnNpdmUiLCJsYXp5bG9hZCIsImxhenlsb2FkU2VsZWN0b3IiLCJ0b3VjaCIsIm1vdXNlRHJhZyIsInN3aXBlQW5nbGUiLCJuZXN0ZWQiLCJwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmciLCJwcmV2ZW50U2Nyb2xsT25Ub3VjaCIsImZyZWV6YWJsZSIsIm9uSW5pdCIsInVzZUxvY2FsU3RvcmFnZSIsIktFWVMiLCJFTlRFUiIsIlNQQUNFIiwiTEVGVCIsIlJJR0hUIiwidG5zU3RvcmFnZSIsImxvY2FsU3RvcmFnZUFjY2VzcyIsImJyb3dzZXJJbmZvIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidWlkIiwiRGF0ZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiQ0FMQyIsIlBFUkNFTlRBR0VMQVlPVVQiLCJDU1NNUSIsIlRSQU5TRk9STSIsIkhBUzNEVFJBTlNGT1JNUyIsIlRSQU5TSVRJT05EVVJBVElPTiIsIlRSQU5TSVRJT05ERUxBWSIsIkFOSU1BVElPTkRVUkFUSU9OIiwiQU5JTUFUSU9OREVMQVkiLCJUUkFOU0lUSU9ORU5EIiwiQU5JTUFUSU9ORU5EIiwic3VwcG9ydENvbnNvbGVXYXJuIiwiY29uc29sZSIsIndhcm4iLCJ0bnNMaXN0Iiwib3B0aW9uc0VsZW1lbnRzIiwibm9kZU5hbWUiLCJjYXJvdXNlbCIsInJlc3BvbnNpdmVUZW0iLCJ1cGRhdGVPcHRpb25zIiwiaG9yaXpvbnRhbCIsIm91dGVyV3JhcHBlciIsImlubmVyV3JhcHBlciIsIm1pZGRsZVdyYXBwZXIiLCJjb250YWluZXJQYXJlbnQiLCJjb250YWluZXJIVE1MIiwib3V0ZXJIVE1MIiwic2xpZGVJdGVtcyIsInNsaWRlQ291bnQiLCJicmVha3BvaW50Wm9uZSIsIndpbmRvd1dpZHRoIiwiZ2V0V2luZG93V2lkdGgiLCJpc09uIiwic2V0QnJlYWtwb2ludFpvbmUiLCJnZXRPcHRpb24iLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0V2lkdGgiLCJmbG9vciIsImZpeGVkV2lkdGhWaWV3cG9ydFdpZHRoIiwic2xpZGVQb3NpdGlvbnMiLCJzbGlkZUl0ZW1zT3V0IiwiY2xvbmVDb3VudCIsImdldENsb25lQ291bnRGb3JMb29wIiwic2xpZGVDb3VudE5ldyIsImhhc1JpZ2h0RGVhZFpvbmUiLCJyaWdodEJvdW5kYXJ5IiwiZ2V0UmlnaHRCb3VuZGFyeSIsInVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtIiwidHJhbnNmb3JtQXR0ciIsInRyYW5zZm9ybVByZWZpeCIsInRyYW5zZm9ybVBvc3RmaXgiLCJnZXRJbmRleE1heCIsImNlaWwiLCJtYXgiLCJnZXRTdGFydEluZGV4IiwiaW5kZXhDYWNoZWQiLCJkaXNwbGF5SW5kZXgiLCJnZXRDdXJyZW50U2xpZGUiLCJpbmRleE1pbiIsImluZGV4TWF4IiwicmVzaXplVGltZXIiLCJtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQiLCJldmVudHMiLCJuZXdDb250YWluZXJDbGFzc2VzIiwic2xpZGVJZCIsImRpc2FibGUiLCJkaXNhYmxlZCIsImZyZWV6ZSIsImdldEZyZWV6ZSIsImZyb3plbiIsImNvbnRyb2xzRXZlbnRzIiwib25Db250cm9sc0NsaWNrIiwib25Db250cm9sc0tleWRvd24iLCJuYXZFdmVudHMiLCJvbk5hdkNsaWNrIiwib25OYXZLZXlkb3duIiwiaG92ZXJFdmVudHMiLCJtb3VzZW92ZXJQYXVzZSIsIm1vdXNlb3V0UmVzdGFydCIsInZpc2liaWxpdHlFdmVudCIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsImRvY21lbnRLZXlkb3duRXZlbnQiLCJvbkRvY3VtZW50S2V5ZG93biIsInRvdWNoRXZlbnRzIiwib25QYW5TdGFydCIsIm9uUGFuTW92ZSIsIm9uUGFuRW5kIiwiZHJhZ0V2ZW50cyIsImhhc0NvbnRyb2xzIiwiaGFzT3B0aW9uIiwiaGFzTmF2IiwiaGFzQXV0b3BsYXkiLCJoYXNUb3VjaCIsImhhc01vdXNlRHJhZyIsInNsaWRlQWN0aXZlQ2xhc3MiLCJpbWdDb21wbGV0ZUNsYXNzIiwiaW1nRXZlbnRzIiwib25JbWdMb2FkZWQiLCJvbkltZ0ZhaWxlZCIsImltZ3NDb21wbGV0ZSIsImxpdmVyZWdpb25DdXJyZW50IiwicHJldmVudFNjcm9sbCIsImNvbnRyb2xzQ29udGFpbmVySFRNTCIsInByZXZCdXR0b25IVE1MIiwibmV4dEJ1dHRvbkhUTUwiLCJwcmV2SXNCdXR0b24iLCJuZXh0SXNCdXR0b24iLCJuYXZDb250YWluZXJIVE1MIiwibmF2SXRlbXMiLCJwYWdlcyIsImdldFBhZ2VzIiwicGFnZXNDYWNoZWQiLCJuYXZDbGlja2VkIiwibmF2Q3VycmVudEluZGV4IiwiZ2V0Q3VycmVudE5hdkluZGV4IiwibmF2Q3VycmVudEluZGV4Q2FjaGVkIiwibmF2QWN0aXZlQ2xhc3MiLCJuYXZTdHIiLCJuYXZTdHJDdXJyZW50IiwiYXV0b3BsYXlCdXR0b25IVE1MIiwiYXV0b3BsYXlIdG1sU3RyaW5ncyIsImF1dG9wbGF5VGltZXIiLCJhbmltYXRpbmciLCJhdXRvcGxheUhvdmVyUGF1c2VkIiwiYXV0b3BsYXlVc2VyUGF1c2VkIiwiYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkIiwiaW5pdFBvc2l0aW9uIiwibGFzdFBvc2l0aW9uIiwidHJhbnNsYXRlSW5pdCIsImRpc1giLCJkaXNZIiwicGFuU3RhcnQiLCJyYWZJbmRleCIsImdldERpc3QiLCJhIiwiYiIsInJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZSIsImluaXRTdHJ1Y3R1cmUiLCJpbml0U2hlZXQiLCJpbml0U2xpZGVyVHJhbnNmb3JtIiwiY29uZGl0aW9uIiwidGVtIiwiaW5kIiwiZ2V0QWJzSW5kZXgiLCJhYnNJbmRleCIsImdldEl0ZW1zTWF4IiwiYnAiLCJhcHBseSIsIml0ZW1zTWF4IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiZ2V0SW5zZXJ0UG9zaXRpb24iLCJwb3MiLCJnZXRDbGllbnRXaWR0aCIsInJlY3QiLCJyaWdodCIsInd3IiwicGFyc2VJbnQiLCJnZXRTbGlkZU1hcmdpbkxlZnQiLCJnZXRJbm5lcldyYXBwZXJTdHlsZXMiLCJlZGdlUGFkZGluZ1RlbSIsImd1dHRlclRlbSIsImZpeGVkV2lkdGhUZW0iLCJzcGVlZFRlbSIsImF1dG9IZWlnaHRCUCIsImd1dHRlclRlbVVuaXQiLCJkaXIiLCJnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZSIsImdldENvbnRhaW5lcldpZHRoIiwiaXRlbXNUZW0iLCJnZXRTbGlkZVdpZHRoU3R5bGUiLCJkaXZpZGVuZCIsImdldFNsaWRlR3V0dGVyU3R5bGUiLCJnZXRDU1NQcmVmaXgiLCJudW0iLCJzdWJzdHJpbmciLCJnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlIiwiY2xhc3NPdXRlciIsImNsYXNzSW5uZXIiLCJoYXNHdXR0ZXIiLCJ3cCIsImZyYWdtZW50QmVmb3JlIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImZyYWdtZW50QWZ0ZXIiLCJjbG9uZUZpcnN0IiwiY2xvbmVOb2RlIiwiZmlyc3RDaGlsZCIsImNsb25lTGFzdCIsImltZ3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW1nIiwic3JjIiwiaW1nTG9hZGVkIiwiaW1nc0xvYWRlZENoZWNrIiwiZ2V0SW1hZ2VBcnJheSIsImluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrIiwiZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQiLCJpbml0VG9vbHMiLCJpbml0RXZlbnRzIiwic3R5bGVzQXBwbGljYXRpb25DaGVjayIsInRvRml4ZWQiLCJpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSIsInNldFNsaWRlUG9zaXRpb25zIiwidXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQiLCJmb250U2l6ZSIsInNsaWRlIiwibWFyZ2luTGVmdCIsInVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uIiwibWlkZGxlV3JhcHBlclN0ciIsImlubmVyV3JhcHBlclN0ciIsImNvbnRhaW5lclN0ciIsInNsaWRlU3RyIiwiaXRlbXNCUCIsImZpeGVkV2lkdGhCUCIsInNwZWVkQlAiLCJlZGdlUGFkZGluZ0JQIiwiZ3V0dGVyQlAiLCJ1cGRhdGVTbGlkZVN0YXR1cyIsImluc2VydEFkamFjZW50SFRNTCIsImdldExpdmVSZWdpb25TdHIiLCJ0eHQiLCJ0b2dnbGVBdXRvcGxheSIsInN0YXJ0QXV0b3BsYXkiLCJpbml0SW5kZXgiLCJuYXZIdG1sIiwiaGlkZGVuU3RyIiwidXBkYXRlTmF2VmlzaWJpbGl0eSIsImlzQnV0dG9uIiwidXBkYXRlQ29udHJvbHNTdGF0dXMiLCJkaXNhYmxlVUkiLCJldmUiLCJvblRyYW5zaXRpb25FbmQiLCJyZXNpemVUYXNrcyIsImluZm8iLCJvblJlc2l6ZSIsImRvQXV0b0hlaWdodCIsImRvTGF6eUxvYWQiLCJkaXNhYmxlU2xpZGVyIiwiZnJlZXplU2xpZGVyIiwiYWRkaXRpb25hbFVwZGF0ZXMiLCJkZXN0cm95Iiwib3duZXJOb2RlIiwiY2xlYXJJbnRlcnZhbCIsImh0bWxMaXN0IiwicHJldkVsIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInBhcmVudEVsIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJnZXRFdmVudCIsImJwQ2hhbmdlZCIsImJyZWFrcG9pbnRab25lVGVtIiwibmVlZENvbnRhaW5lclRyYW5zZm9ybSIsImluZENoYW5nZWQiLCJpdGVtc0NoYW5nZWQiLCJkaXNhYmxlVGVtIiwiZnJlZXplVGVtIiwiYXJyb3dLZXlzVGVtIiwiY29udHJvbHNUZW0iLCJuYXZUZW0iLCJ0b3VjaFRlbSIsIm1vdXNlRHJhZ1RlbSIsImF1dG9wbGF5VGVtIiwiYXV0b3BsYXlIb3ZlclBhdXNlVGVtIiwiYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSIsImluZGV4VGVtIiwiYXV0b0hlaWdodFRlbSIsImNvbnRyb2xzVGV4dFRlbSIsImNlbnRlclRlbSIsImF1dG9wbGF5VGV4dFRlbSIsInVwZGF0ZUluZGV4IiwiZW5hYmxlU2xpZGVyIiwiZG9Db250YWluZXJUcmFuc2Zvcm0iLCJnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSIsInVuZnJlZXplU2xpZGVyIiwic3RvcEF1dG9wbGF5IiwiaGVpZ2h0IiwiaHRtbCIsInVwZGF0ZUxpdmVSZWdpb24iLCJ1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMiLCJhdXRvaGVpZ2h0VGVtIiwidnAiLCJsZWZ0RWRnZSIsInJpZ2h0RWRnZSIsImVuYWJsZVVJIiwibWFyZ2luIiwiY2xhc3NOIiwiZ2V0VmlzaWJsZVNsaWRlUmFuZ2UiLCJzdGFydCIsImVuZCIsInJhbmdlc3RhcnQiLCJyYW5nZWVuZCIsInBhcnNlRmxvYXQiLCJwb2ludCIsImNlbGwiLCJzdG9wUHJvcGFnYXRpb24iLCJzcmNzZXQiLCJnZXRUYXJnZXQiLCJpbWdGYWlsZWQiLCJpbWdDb21wbGV0ZWQiLCJ1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQiLCJ1cGRhdGVOYXZTdGF0dXMiLCJnZXRNYXhTbGlkZUhlaWdodCIsInNsaWRlU3RhcnQiLCJzbGlkZVJhbmdlIiwiaGVpZ2h0cyIsIm1heEhlaWdodCIsImF0dHIyIiwiYmFzZSIsIm5hdlByZXYiLCJuYXZDdXJyZW50IiwiZ2V0TG93ZXJDYXNlTm9kZU5hbWUiLCJpc0FyaWFEaXNhYmxlZCIsImRpc0VuYWJsZUVsZW1lbnQiLCJwcmV2RGlzYWJsZWQiLCJuZXh0RGlzYWJsZWQiLCJkaXNhYmxlUHJldiIsImRpc2FibGVOZXh0IiwicmVzZXREdXJhdGlvbiIsImdldFNsaWRlcldpZHRoIiwiZ2V0Q2VudGVyR2FwIiwiZGVub21pbmF0b3IiLCJhbmltYXRlU2xpZGUiLCJudW1iZXIiLCJjbGFzc091dCIsImNsYXNzSW4iLCJpc091dCIsInRyYW5zZm9ybUNvcmUiLCJyZW5kZXIiLCJzbGlkZXJNb3ZlZCIsInN0clRyYW5zIiwiZXZlbnQiLCJwcm9wZXJ0eU5hbWUiLCJnb1RvIiwidGFyZ2V0SW5kZXgiLCJpbmRleEdhcCIsImlzTmFOIiwiZmFjdG9yIiwicGFzc0V2ZW50T2JqZWN0IiwidGFyZ2V0SW4iLCJuYXZJbmRleCIsInRhcmdldEluZGV4QmFzZSIsInNldEF1dG9wbGF5VGltZXIiLCJzZXRJbnRlcnZhbCIsInN0b3BBdXRvcGxheVRpbWVyIiwidXBkYXRlQXV0b3BsYXlCdXR0b24iLCJhY3Rpb24iLCJwbGF5IiwicGF1c2UiLCJoaWRkZW4iLCJrZXlJbmRleCIsImtleUNvZGUiLCJzZXRGb2N1cyIsImZvY3VzIiwiY3VyRWxlbWVudCIsImFjdGl2ZUVsZW1lbnQiLCJpc1RvdWNoRXZlbnQiLCJjaGFuZ2VkVG91Y2hlcyIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsIiQiLCJjbGllbnRYIiwiY2xpZW50WSIsInBhblVwZGF0ZSIsImVyciIsImRpc3QiLCJwZXJjZW50YWdlWCIsInByZXZlbnRDbGljayIsImluZGV4TW92ZWQiLCJtb3ZlZCIsInJvdWdoIiwidmVyc2lvbiIsImdldEluZm8iLCJ1cGRhdGVTbGlkZXJIZWlnaHQiLCJyZWZyZXNoIiwicmVidWlsZCIsImpRdWVyeSIsIkVycm9yIiwianF1ZXJ5Iiwic3BsaXQiLCJ0cmFuc2l0aW9uRW5kIiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImNhbGxlZCIsIiRlbCIsIm9uZSIsInRyaWdnZXIiLCJzdXBwb3J0Iiwic3BlY2lhbCIsImJzVHJhbnNpdGlvbkVuZCIsImJpbmRUeXBlIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiZGlzbWlzcyIsIkFsZXJ0IiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsIiR0aGlzIiwiJHBhcmVudCIsImZpbmQiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVFbGVtZW50IiwiZGV0YWNoIiwiUGx1Z2luIiwiZWFjaCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiJGVsZW1lbnQiLCJERUZBVUxUUyIsImlzTG9hZGluZyIsImxvYWRpbmdUZXh0Iiwic2V0U3RhdGUiLCJzdGF0ZSIsImQiLCJyZXNldFRleHQiLCJwcm94eSIsInJlbW92ZUF0dHIiLCJ0b2dnbGUiLCJjaGFuZ2VkIiwiJGlucHV0IiwidG9nZ2xlQ2xhc3MiLCJidXR0b24iLCIkYnRuIiwiZmlyc3QiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2VkIiwic2xpZGluZyIsImludGVydmFsIiwiJGFjdGl2ZSIsIiRpdGVtcyIsImtleWJvYXJkIiwia2V5ZG93biIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiZ2V0SXRlbUluZGV4IiwicGFyZW50IiwiZ2V0SXRlbUZvckRpcmVjdGlvbiIsImFjdGl2ZSIsImFjdGl2ZUluZGV4Iiwid2lsbFdyYXAiLCJkZWx0YSIsIml0ZW1JbmRleCIsImVxIiwidGhhdCIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsImpvaW4iLCJjbGlja0hhbmRsZXIiLCJocmVmIiwiJHRhcmdldCIsInNsaWRlSW5kZXgiLCIkY2Fyb3VzZWwiLCJDb2xsYXBzZSIsIiR0cmlnZ2VyIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwiZ2V0VGFyZ2V0RnJvbVRyaWdnZXIiLCJpc09wZW4iLCJjb2xsYXBzZSIsImJhY2tkcm9wIiwiRHJvcGRvd24iLCJjbGVhck1lbnVzIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCIkZGlhbG9nIiwiJGJhY2tkcm9wIiwiaXNTaG93biIsIm9yaWdpbmFsQm9keVBhZCIsInNjcm9sbGJhcldpZHRoIiwiaWdub3JlQmFja2Ryb3BDbGljayIsImZpeGVkQ29udGVudCIsInJlbW90ZSIsImxvYWQiLCJCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiX3JlbGF0ZWRUYXJnZXQiLCJjaGVja1Njcm9sbGJhciIsInNldFNjcm9sbGJhciIsImVzY2FwZSIsInJlc2l6ZSIsImFwcGVuZFRvIiwic2Nyb2xsVG9wIiwiYWRqdXN0RGlhbG9nIiwiZW5mb3JjZUZvY3VzIiwiaGlkZU1vZGFsIiwiaGFzIiwiaGFuZGxlVXBkYXRlIiwicmVzZXRBZGp1c3RtZW50cyIsInJlc2V0U2Nyb2xsYmFyIiwicmVtb3ZlQmFja2Ryb3AiLCJhbmltYXRlIiwiZG9BbmltYXRlIiwiY3VycmVudFRhcmdldCIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImRvY3VtZW50RWxlbWVudFJlY3QiLCJtZWFzdXJlU2Nyb2xsYmFyIiwiYm9keVBhZCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhZGRpbmciLCJyZW1vdmVEYXRhIiwic2Nyb2xsRGl2IiwiYXBwZW5kIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYXJlYSIsImJyIiwiY29sIiwiY29kZSIsImVtIiwiaHIiLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJsaSIsIm9sIiwicCIsInByZSIsInMiLCJzbWFsbCIsInNwYW4iLCJzdWIiLCJzdXAiLCJzdHJvbmciLCJ1IiwidWwiLCJTQUZFX1VSTF9QQVRURVJOIiwiREFUQV9VUkxfUEFUVEVSTiIsImFsbG93ZWRBdHRyaWJ1dGUiLCJhbGxvd2VkQXR0cmlidXRlTGlzdCIsImF0dHJOYW1lIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsIlJlZ0V4cCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJlbE5hbWUiLCJhdHRyaWJ1dGVMaXN0IiwiYXR0cmlidXRlcyIsIndoaXRlbGlzdGVkQXR0cmlidXRlcyIsImNvbmNhdCIsImxlbjIiLCJUb29sdGlwIiwiZW5hYmxlZCIsInRpbWVvdXQiLCJob3ZlclN0YXRlIiwiaW5TdGF0ZSIsImluaXQiLCJhbmltYXRpb24iLCJwbGFjZW1lbnQiLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJzYW5pdGl6ZSIsImdldE9wdGlvbnMiLCIkdmlld3BvcnQiLCJpc0Z1bmN0aW9uIiwiY2xpY2siLCJob3ZlciIsImNvbnN0cnVjdG9yIiwidHJpZ2dlcnMiLCJldmVudEluIiwiZXZlbnRPdXQiLCJlbnRlciIsImxlYXZlIiwiX29wdGlvbnMiLCJmaXhUaXRsZSIsImdldERlZmF1bHRzIiwiZGF0YUF0dHJpYnV0ZXMiLCJkYXRhQXR0ciIsImdldERlbGVnYXRlT3B0aW9ucyIsImRlZmF1bHRzIiwic2VsZiIsInRpcCIsImlzSW5TdGF0ZVRydWUiLCJoYXNDb250ZW50IiwiaW5Eb20iLCJvd25lckRvY3VtZW50IiwiJHRpcCIsInRpcElkIiwiZ2V0VUlEIiwic2V0Q29udGVudCIsImF1dG9Ub2tlbiIsImF1dG9QbGFjZSIsInRvcCIsImdldFBvc2l0aW9uIiwiYWN0dWFsV2lkdGgiLCJhY3R1YWxIZWlnaHQiLCJvcmdQbGFjZW1lbnQiLCJ2aWV3cG9ydERpbSIsImJvdHRvbSIsImNhbGN1bGF0ZWRPZmZzZXQiLCJnZXRDYWxjdWxhdGVkT2Zmc2V0IiwiYXBwbHlQbGFjZW1lbnQiLCJwcmV2SG92ZXJTdGF0ZSIsIm9mZnNldCIsIm1hcmdpblRvcCIsInNldE9mZnNldCIsInVzaW5nIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwidG9nZ2xlRW5hYmxlZCIsInRvb2x0aXAiLCJQb3BvdmVyIiwiY29udGVudCIsImdldENvbnRlbnQiLCJ0eXBlQ29udGVudCIsInBvcG92ZXIiLCJTY3JvbGxTcHkiLCIkc2Nyb2xsRWxlbWVudCIsIm9mZnNldHMiLCJ0YXJnZXRzIiwiYWN0aXZlVGFyZ2V0IiwicHJvY2VzcyIsImdldFNjcm9sbEhlaWdodCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsIm1heFNjcm9sbCIsImFjdGl2YXRlIiwiY2xlYXIiLCJwYXJlbnRzIiwicGFyZW50c1VudGlsIiwic2Nyb2xsc3B5IiwiJHNweSIsIlRhYiIsIiR1bCIsIiRwcmV2aW91cyIsImhpZGVFdmVudCIsInRhYiIsIkFmZml4IiwiY2hlY2tQb3NpdGlvbiIsImNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wIiwiYWZmaXhlZCIsInVucGluIiwicGlubmVkT2Zmc2V0IiwiUkVTRVQiLCJnZXRTdGF0ZSIsIm9mZnNldFRvcCIsIm9mZnNldEJvdHRvbSIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiZmxleHlfbmF2aWdhdGlvbiIsImxheW91dF9jbGFzc2VzIiwidXBncmFkZSIsIiRuYXZpZ2F0aW9ucyIsIm5hdmlnYXRpb24iLCIkbmF2aWdhdGlvbiIsIiRtZWdhbWVudXMiLCJkcm9wZG93bl9tZWdhbWVudSIsIiRkcm9wZG93bl9tZWdhbWVudSIsImRyb3Bkb3duX2hhc19tZWdhbWVudSIsImlzX3VwZ3JhZGVkIiwibmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUiLCIkbWVnYW1lbnUiLCJoYXNfb2JmdXNjYXRvciIsIm9iZnVzY2F0b3IiLCJiYWJlbEhlbHBlcnMiLCJjbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInNpZHJTdGF0dXMiLCJtb3ZpbmciLCJvcGVuZWQiLCJoZWxwZXIiLCJpc1VybCIsInBhdHRlcm4iLCJhZGRQcmVmaXhlcyIsImFkZFByZWZpeCIsImF0dHJpYnV0ZSIsInRvUmVwbGFjZSIsInRyYW5zaXRpb25zIiwicHJvcGVydHkiLCIkJDIiLCJib2R5QW5pbWF0aW9uQ2xhc3MiLCJvcGVuQWN0aW9uIiwiY2xvc2VBY3Rpb24iLCJ0cmFuc2l0aW9uRW5kRXZlbnQiLCJNZW51Iiwib3BlbkNsYXNzIiwibWVudVdpZHRoIiwib3V0ZXJXaWR0aCIsInNpZGUiLCJkaXNwbGFjZSIsInRpbWluZyIsIm1ldGhvZCIsIm9uT3BlbkNhbGxiYWNrIiwib25DbG9zZUNhbGxiYWNrIiwib25PcGVuRW5kQ2FsbGJhY2siLCJvbkNsb3NlRW5kQ2FsbGJhY2siLCJnZXRBbmltYXRpb24iLCJwcmVwYXJlQm9keSIsIiRodG1sIiwib3BlbkJvZHkiLCJib2R5QW5pbWF0aW9uIiwicXVldWUiLCJvbkNsb3NlQm9keSIsInJlc2V0U3R5bGVzIiwidW5iaW5kIiwiY2xvc2VCb2R5IiwiX3RoaXMiLCJtb3ZlQm9keSIsIm9uT3Blbk1lbnUiLCJvcGVuTWVudSIsIl90aGlzMiIsIiRpdGVtIiwibWVudUFuaW1hdGlvbiIsIm9uQ2xvc2VNZW51IiwiY2xvc2VNZW51IiwiX3RoaXMzIiwibW92ZU1lbnUiLCJtb3ZlIiwib3BlbiIsIl90aGlzNCIsImFscmVhZHlPcGVuZWRNZW51IiwiJCQxIiwiZXhlY3V0ZSIsInNpZHIiLCJlcnJvciIsInB1YmxpY01ldGhvZHMiLCJtZXRob2ROYW1lIiwibWV0aG9kcyIsImdldE1ldGhvZCIsIiQkMyIsImZpbGxDb250ZW50IiwiJHNpZGVNZW51Iiwic2V0dGluZ3MiLCJzb3VyY2UiLCJuZXdDb250ZW50IiwiaHRtbENvbnRlbnQiLCJzZWxlY3RvcnMiLCJyZW5hbWluZyIsIiRodG1sQ29udGVudCIsImZuU2lkciIsImJpbmQiLCJvbk9wZW4iLCJvbkNsb3NlIiwib25PcGVuRW5kIiwib25DbG9zZUVuZCIsImZsYWciLCJ0Iiwic2xpbmt5IiwibGFiZWwiLCJuIiwiciIsInByZXBlbmQiLCJub3ciLCJqdW1wIiwiaG9tZSIsImMiLCJBamF4TW9uaXRvciIsIkJhciIsIkRvY3VtZW50TW9uaXRvciIsIkVsZW1lbnRNb25pdG9yIiwiRWxlbWVudFRyYWNrZXIiLCJFdmVudExhZ01vbml0b3IiLCJFdmVudGVkIiwiTm9UYXJnZXRFcnJvciIsIlBhY2UiLCJSZXF1ZXN0SW50ZXJjZXB0IiwiU09VUkNFX0tFWVMiLCJTY2FsZXIiLCJTb2NrZXRSZXF1ZXN0VHJhY2tlciIsIlhIUlJlcXVlc3RUcmFja2VyIiwiYXZnQW1wbGl0dWRlIiwiYmFyIiwiY2FuY2VsQW5pbWF0aW9uIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmROYXRpdmUiLCJnZXRGcm9tRE9NIiwiZ2V0SW50ZXJjZXB0IiwiaGFuZGxlUHVzaFN0YXRlIiwiaWdub3JlU3RhY2siLCJydW5BbmltYXRpb24iLCJzY2FsZXJzIiwic2hvdWxkSWdub3JlVVJMIiwic2hvdWxkVHJhY2siLCJzb3VyY2VzIiwidW5pU2NhbGVyIiwiX1dlYlNvY2tldCIsIl9YRG9tYWluUmVxdWVzdCIsIl9YTUxIdHRwUmVxdWVzdCIsIl9pIiwiX2ludGVyY2VwdCIsIl9sZW4iLCJfcHVzaFN0YXRlIiwiX3JlZiIsIl9yZWYxIiwiX3JlcGxhY2VTdGF0ZSIsIl9fc2xpY2UiLCJfX2hhc1Byb3AiLCJfX2V4dGVuZHMiLCJjaGlsZCIsImN0b3IiLCJfX3N1cGVyX18iLCJfX2luZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsImxhc3QiLCJkaWZmIiwiYXJncyIsIm91dCIsInN1bSIsInYiLCJqc29uIiwiX2Vycm9yIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiaWdub3JlIiwicmV0IiwidW5zaGlmdCIsInNoaWZ0IiwidHJhY2siLCJtb25pdG9yWEhSIiwicmVxIiwiX29wZW4iLCJ1cmwiLCJhc3luYyIsInJlcXVlc3QiLCJmbGFncyIsInByb3RvY29scyIsIl9hcmciLCJhZnRlciIsInN0aWxsQWN0aXZlIiwiX3JlZjMiLCJyZWFkeVN0YXRlIiwicmVzdGFydCIsIndhdGNoIiwidHJhY2tlciIsInNpemUiLCJfb25yZWFkeXN0YXRlY2hhbmdlIiwiUHJvZ3Jlc3NFdmVudCIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwiZ28iLCJlbnF1ZXVlTmV4dEZyYW1lIiwicmVtYWluaW5nIiwic2NhbGVyIiwic2NhbGVyTGlzdCIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJoYW5kbGVUb2dnbGUiLCJ0b2dnbGVzIiwic2xpZGVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsTUFBTyxZQUFXO0FBQ3RCO0FBQ0EsTUFBSSxDQUFDQyxPQUFPQyxJQUFaLEVBQWtCO0FBQ2hCRCxXQUFPQyxJQUFQLEdBQWMsVUFBU0MsTUFBVCxFQUFpQjtBQUM3QixVQUFJRCxPQUFPLEVBQVg7QUFDQSxXQUFLLElBQUlFLElBQVQsSUFBaUJELE1BQWpCLEVBQXlCO0FBQ3ZCLFlBQUlGLE9BQU9JLFNBQVAsQ0FBaUJDLGNBQWpCLENBQWdDQyxJQUFoQyxDQUFxQ0osTUFBckMsRUFBNkNDLElBQTdDLENBQUosRUFBd0Q7QUFDdERGLGVBQUtNLElBQUwsQ0FBVUosSUFBVjtBQUNEO0FBQ0Y7QUFDRCxhQUFPRixJQUFQO0FBQ0QsS0FSRDtBQVNEOztBQUVEO0FBQ0EsTUFBRyxFQUFFLFlBQVlPLFFBQVFKLFNBQXRCLENBQUgsRUFBb0M7QUFDbENJLFlBQVFKLFNBQVIsQ0FBa0JLLE1BQWxCLEdBQTJCLFlBQVU7QUFDbkMsVUFBRyxLQUFLQyxVQUFSLEVBQW9CO0FBQ2xCLGFBQUtBLFVBQUwsQ0FBZ0JDLFdBQWhCLENBQTRCLElBQTVCO0FBQ0Q7QUFDRixLQUpEO0FBS0Q7O0FBRUQsTUFBSUMsTUFBTUMsTUFBVjs7QUFFQSxNQUFJQyxNQUFNRixJQUFJRyxxQkFBSixJQUNMSCxJQUFJSSwyQkFEQyxJQUVMSixJQUFJSyx3QkFGQyxJQUdMTCxJQUFJTSx1QkFIQyxJQUlMLFVBQVNDLEVBQVQsRUFBYTtBQUFFLFdBQU9DLFdBQVdELEVBQVgsRUFBZSxFQUFmLENBQVA7QUFBNEIsR0FKaEQ7O0FBTUEsTUFBSUUsUUFBUVIsTUFBWjs7QUFFQSxNQUFJUyxNQUFNRCxNQUFNRSxvQkFBTixJQUNMRixNQUFNRyx1QkFERCxJQUVMLFVBQVNDLEVBQVQsRUFBWTtBQUFFQyxpQkFBYUQsRUFBYjtBQUFtQixHQUZ0Qzs7QUFJQSxXQUFTRSxNQUFULEdBQWtCO0FBQ2hCLFFBQUlDLEdBQUo7QUFBQSxRQUFTekIsSUFBVDtBQUFBLFFBQWUwQixJQUFmO0FBQUEsUUFDSUMsU0FBU0MsVUFBVSxDQUFWLEtBQWdCLEVBRDdCO0FBQUEsUUFFSUMsSUFBSSxDQUZSO0FBQUEsUUFHSUMsU0FBU0YsVUFBVUUsTUFIdkI7O0FBS0EsV0FBT0QsSUFBSUMsTUFBWCxFQUFtQkQsR0FBbkIsRUFBd0I7QUFDdEIsVUFBSSxDQUFDSixNQUFNRyxVQUFVQyxDQUFWLENBQVAsTUFBeUIsSUFBN0IsRUFBbUM7QUFDakMsYUFBSzdCLElBQUwsSUFBYXlCLEdBQWIsRUFBa0I7QUFDaEJDLGlCQUFPRCxJQUFJekIsSUFBSixDQUFQOztBQUVBLGNBQUkyQixXQUFXRCxJQUFmLEVBQXFCO0FBQ25CO0FBQ0QsV0FGRCxNQUVPLElBQUlBLFNBQVNLLFNBQWIsRUFBd0I7QUFDN0JKLG1CQUFPM0IsSUFBUCxJQUFlMEIsSUFBZjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0QsV0FBT0MsTUFBUDtBQUNEOztBQUVELFdBQVNLLGlCQUFULENBQTRCQyxLQUE1QixFQUFtQztBQUNqQyxXQUFPLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0JDLE9BQWxCLENBQTBCRCxLQUExQixLQUFvQyxDQUFwQyxHQUF3Q0UsS0FBS0MsS0FBTCxDQUFXSCxLQUFYLENBQXhDLEdBQTREQSxLQUFuRTtBQUNEOztBQUVELFdBQVNJLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDQyxHQUFsQyxFQUF1Q04sS0FBdkMsRUFBOENPLE1BQTlDLEVBQXNEO0FBQ3BELFFBQUlBLE1BQUosRUFBWTtBQUNWLFVBQUk7QUFBRUYsZ0JBQVFHLE9BQVIsQ0FBZ0JGLEdBQWhCLEVBQXFCTixLQUFyQjtBQUE4QixPQUFwQyxDQUFxQyxPQUFPUyxDQUFQLEVBQVUsQ0FBRTtBQUNsRDtBQUNELFdBQU9ULEtBQVA7QUFDRDs7QUFFRCxXQUFTVSxVQUFULEdBQXNCO0FBQ3BCLFFBQUlyQixLQUFLWixPQUFPa0MsS0FBaEI7QUFDQWxDLFdBQU9rQyxLQUFQLEdBQWUsQ0FBQ3RCLEVBQUQsR0FBTSxDQUFOLEdBQVVBLEtBQUssQ0FBOUI7O0FBRUEsV0FBTyxRQUFRWixPQUFPa0MsS0FBdEI7QUFDRDs7QUFFRCxXQUFTQyxPQUFULEdBQW9CO0FBQ2xCLFFBQUlDLE1BQU1DLFFBQVY7QUFBQSxRQUNJQyxPQUFPRixJQUFJRSxJQURmOztBQUdBLFFBQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1RBLGFBQU9GLElBQUlHLGFBQUosQ0FBa0IsTUFBbEIsQ0FBUDtBQUNBRCxXQUFLRSxJQUFMLEdBQVksSUFBWjtBQUNEOztBQUVELFdBQU9GLElBQVA7QUFDRDs7QUFFRCxNQUFJRyxhQUFhSixTQUFTSyxlQUExQjs7QUFFQSxXQUFTQyxXQUFULENBQXNCTCxJQUF0QixFQUE0QjtBQUMxQixRQUFJTSxjQUFjLEVBQWxCO0FBQ0EsUUFBSU4sS0FBS0UsSUFBVCxFQUFlO0FBQ2JJLG9CQUFjSCxXQUFXSSxLQUFYLENBQWlCQyxRQUEvQjtBQUNBO0FBQ0FSLFdBQUtPLEtBQUwsQ0FBV0UsVUFBWCxHQUF3QixFQUF4QjtBQUNBO0FBQ0FULFdBQUtPLEtBQUwsQ0FBV0MsUUFBWCxHQUFzQkwsV0FBV0ksS0FBWCxDQUFpQkMsUUFBakIsR0FBNEIsUUFBbEQ7QUFDQUwsaUJBQVdPLFdBQVgsQ0FBdUJWLElBQXZCO0FBQ0Q7O0FBRUQsV0FBT00sV0FBUDtBQUNEOztBQUVELFdBQVNLLGFBQVQsQ0FBd0JYLElBQXhCLEVBQThCTSxXQUE5QixFQUEyQztBQUN6QyxRQUFJTixLQUFLRSxJQUFULEVBQWU7QUFDYkYsV0FBSzFDLE1BQUw7QUFDQTZDLGlCQUFXSSxLQUFYLENBQWlCQyxRQUFqQixHQUE0QkYsV0FBNUI7QUFDQTtBQUNBO0FBQ0FILGlCQUFXUyxZQUFYO0FBQ0Q7QUFDRjs7QUFFRDs7QUFFQSxXQUFTQyxJQUFULEdBQWdCO0FBQ2QsUUFBSWYsTUFBTUMsUUFBVjtBQUFBLFFBQ0lDLE9BQU9ILFNBRFg7QUFBQSxRQUVJUyxjQUFjRCxZQUFZTCxJQUFaLENBRmxCO0FBQUEsUUFHSWMsTUFBTWhCLElBQUlHLGFBQUosQ0FBa0IsS0FBbEIsQ0FIVjtBQUFBLFFBSUljLFNBQVMsS0FKYjs7QUFNQWYsU0FBS1UsV0FBTCxDQUFpQkksR0FBakI7QUFDQSxRQUFJO0FBQ0YsVUFBSUUsTUFBTSxhQUFWO0FBQUEsVUFDSUMsT0FBTyxDQUFDLFNBQVNELEdBQVYsRUFBZSxjQUFjQSxHQUE3QixFQUFrQyxpQkFBaUJBLEdBQW5ELENBRFg7QUFBQSxVQUVJRSxHQUZKO0FBR0EsV0FBSyxJQUFJckMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLENBQXBCLEVBQXVCQSxHQUF2QixFQUE0QjtBQUMxQnFDLGNBQU1ELEtBQUtwQyxDQUFMLENBQU47QUFDQWlDLFlBQUlQLEtBQUosQ0FBVVksS0FBVixHQUFrQkQsR0FBbEI7QUFDQSxZQUFJSixJQUFJTSxXQUFKLEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCTCxtQkFBU0csSUFBSUcsT0FBSixDQUFZTCxHQUFaLEVBQWlCLEVBQWpCLENBQVQ7QUFDQTtBQUNEO0FBQ0Y7QUFDRixLQVpELENBWUUsT0FBT3RCLENBQVAsRUFBVSxDQUFFOztBQUVkTSxTQUFLRSxJQUFMLEdBQVlTLGNBQWNYLElBQWQsRUFBb0JNLFdBQXBCLENBQVosR0FBK0NRLElBQUl4RCxNQUFKLEVBQS9DOztBQUVBLFdBQU95RCxNQUFQO0FBQ0Q7O0FBRUQ7O0FBRUEsV0FBU08sZ0JBQVQsR0FBNEI7QUFDMUI7QUFDQSxRQUFJeEIsTUFBTUMsUUFBVjtBQUFBLFFBQ0lDLE9BQU9ILFNBRFg7QUFBQSxRQUVJUyxjQUFjRCxZQUFZTCxJQUFaLENBRmxCO0FBQUEsUUFHSXVCLFVBQVV6QixJQUFJRyxhQUFKLENBQWtCLEtBQWxCLENBSGQ7QUFBQSxRQUlJdUIsUUFBUTFCLElBQUlHLGFBQUosQ0FBa0IsS0FBbEIsQ0FKWjtBQUFBLFFBS0llLE1BQU0sRUFMVjtBQUFBLFFBTUlTLFFBQVEsRUFOWjtBQUFBLFFBT0lDLFVBQVUsQ0FQZDtBQUFBLFFBUUlDLFlBQVksS0FSaEI7O0FBVUFKLFlBQVFLLFNBQVIsR0FBb0IsYUFBcEI7QUFDQUosVUFBTUksU0FBTixHQUFrQixVQUFsQjs7QUFFQSxTQUFLLElBQUkvQyxJQUFJLENBQWIsRUFBZ0JBLElBQUk0QyxLQUFwQixFQUEyQjVDLEdBQTNCLEVBQWdDO0FBQzlCbUMsYUFBTyxhQUFQO0FBQ0Q7O0FBRURRLFVBQU1LLFNBQU4sR0FBa0JiLEdBQWxCO0FBQ0FPLFlBQVFiLFdBQVIsQ0FBb0JjLEtBQXBCO0FBQ0F4QixTQUFLVSxXQUFMLENBQWlCYSxPQUFqQjs7QUFFQUksZ0JBQVlHLEtBQUtDLEdBQUwsQ0FBU1IsUUFBUVMscUJBQVIsR0FBZ0NDLElBQWhDLEdBQXVDVCxNQUFNVSxRQUFOLENBQWVULFFBQVFDLE9BQXZCLEVBQWdDTSxxQkFBaEMsR0FBd0RDLElBQXhHLElBQWdILENBQTVIOztBQUVBakMsU0FBS0UsSUFBTCxHQUFZUyxjQUFjWCxJQUFkLEVBQW9CTSxXQUFwQixDQUFaLEdBQStDaUIsUUFBUWpFLE1BQVIsRUFBL0M7O0FBRUEsV0FBT3FFLFNBQVA7QUFDRDs7QUFFRCxXQUFTUSxpQkFBVCxHQUE4QjtBQUM1QixRQUFJckMsTUFBTUMsUUFBVjtBQUFBLFFBQ0lDLE9BQU9ILFNBRFg7QUFBQSxRQUVJUyxjQUFjRCxZQUFZTCxJQUFaLENBRmxCO0FBQUEsUUFHSWMsTUFBTWhCLElBQUlHLGFBQUosQ0FBa0IsS0FBbEIsQ0FIVjtBQUFBLFFBSUlNLFFBQVFULElBQUlHLGFBQUosQ0FBa0IsT0FBbEIsQ0FKWjtBQUFBLFFBS0ltQyxPQUFPLGlFQUxYO0FBQUEsUUFNSUMsUUFOSjs7QUFRQTlCLFVBQU0rQixJQUFOLEdBQWEsVUFBYjtBQUNBeEIsUUFBSWMsU0FBSixHQUFnQixhQUFoQjs7QUFFQTVCLFNBQUtVLFdBQUwsQ0FBaUJILEtBQWpCO0FBQ0FQLFNBQUtVLFdBQUwsQ0FBaUJJLEdBQWpCOztBQUVBLFFBQUlQLE1BQU1nQyxVQUFWLEVBQXNCO0FBQ3BCaEMsWUFBTWdDLFVBQU4sQ0FBaUJDLE9BQWpCLEdBQTJCSixJQUEzQjtBQUNELEtBRkQsTUFFTztBQUNMN0IsWUFBTUcsV0FBTixDQUFrQlosSUFBSTJDLGNBQUosQ0FBbUJMLElBQW5CLENBQWxCO0FBQ0Q7O0FBRURDLGVBQVczRSxPQUFPZ0YsZ0JBQVAsR0FBMEJoRixPQUFPZ0YsZ0JBQVAsQ0FBd0I1QixHQUF4QixFQUE2QnVCLFFBQXZELEdBQWtFdkIsSUFBSTZCLFlBQUosQ0FBaUIsVUFBakIsQ0FBN0U7O0FBRUEzQyxTQUFLRSxJQUFMLEdBQVlTLGNBQWNYLElBQWQsRUFBb0JNLFdBQXBCLENBQVosR0FBK0NRLElBQUl4RCxNQUFKLEVBQS9DOztBQUVBLFdBQU8rRSxhQUFhLFVBQXBCO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTTyxnQkFBVCxDQUEyQkMsS0FBM0IsRUFBa0M7QUFDaEM7QUFDQSxRQUFJdEMsUUFBUVIsU0FBU0UsYUFBVCxDQUF1QixPQUF2QixDQUFaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBSTRDLEtBQUosRUFBVztBQUFFdEMsWUFBTXVDLFlBQU4sQ0FBbUIsT0FBbkIsRUFBNEJELEtBQTVCO0FBQXFDOztBQUVsRDtBQUNBOztBQUVBO0FBQ0E5QyxhQUFTZ0QsYUFBVCxDQUF1QixNQUF2QixFQUErQnJDLFdBQS9CLENBQTJDSCxLQUEzQzs7QUFFQSxXQUFPQSxNQUFNeUMsS0FBTixHQUFjekMsTUFBTXlDLEtBQXBCLEdBQTRCekMsTUFBTWdDLFVBQXpDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTVSxVQUFULENBQW9CRCxLQUFwQixFQUEyQkUsUUFBM0IsRUFBcUNDLEtBQXJDLEVBQTRDQyxLQUE1QyxFQUFtRDtBQUNqRDtBQUNFLG9CQUFnQkosS0FBaEIsR0FDRUEsTUFBTUssVUFBTixDQUFpQkgsV0FBVyxHQUFYLEdBQWlCQyxLQUFqQixHQUF5QixHQUExQyxFQUErQ0MsS0FBL0MsQ0FERixHQUVFSixNQUFNTSxPQUFOLENBQWNKLFFBQWQsRUFBd0JDLEtBQXhCLEVBQStCQyxLQUEvQixDQUZGO0FBR0Y7QUFDRDs7QUFFRDtBQUNBLFdBQVNHLGFBQVQsQ0FBdUJQLEtBQXZCLEVBQThCSSxLQUE5QixFQUFxQztBQUNuQztBQUNFLG9CQUFnQkosS0FBaEIsR0FDRUEsTUFBTVEsVUFBTixDQUFpQkosS0FBakIsQ0FERixHQUVFSixNQUFNUyxVQUFOLENBQWlCTCxLQUFqQixDQUZGO0FBR0Y7QUFDRDs7QUFFRCxXQUFTTSxpQkFBVCxDQUEyQlYsS0FBM0IsRUFBa0M7QUFDaEMsUUFBSVosT0FBUSxnQkFBZ0JZLEtBQWpCLEdBQTBCQSxNQUFNVyxRQUFoQyxHQUEyQ1gsTUFBTUcsS0FBNUQ7QUFDQSxXQUFPZixLQUFLdEQsTUFBWjtBQUNEOztBQUVELFdBQVM4RSxRQUFULENBQW1CQyxDQUFuQixFQUFzQkMsQ0FBdEIsRUFBeUI7QUFDdkIsV0FBT2hDLEtBQUtpQyxLQUFMLENBQVdGLENBQVgsRUFBY0MsQ0FBZCxLQUFvQixNQUFNaEMsS0FBS2tDLEVBQS9CLENBQVA7QUFDRDs7QUFFRCxXQUFTQyxpQkFBVCxDQUEyQkMsS0FBM0IsRUFBa0NDLEtBQWxDLEVBQXlDO0FBQ3ZDLFFBQUlDLFlBQVksS0FBaEI7QUFBQSxRQUNJQyxNQUFNdkMsS0FBS0MsR0FBTCxDQUFTLEtBQUtELEtBQUtDLEdBQUwsQ0FBU21DLEtBQVQsQ0FBZCxDQURWOztBQUdBLFFBQUlHLE9BQU8sS0FBS0YsS0FBaEIsRUFBdUI7QUFDckJDLGtCQUFZLFlBQVo7QUFDRCxLQUZELE1BRU8sSUFBSUMsT0FBT0YsS0FBWCxFQUFrQjtBQUN2QkMsa0JBQVksVUFBWjtBQUNEOztBQUVELFdBQU9BLFNBQVA7QUFDRDs7QUFFRDtBQUNBLFdBQVNFLE9BQVQsQ0FBa0JDLEdBQWxCLEVBQXVCQyxRQUF2QixFQUFpQ0MsS0FBakMsRUFBd0M7QUFDdEMsU0FBSyxJQUFJNUYsSUFBSSxDQUFSLEVBQVc2RixJQUFJSCxJQUFJekYsTUFBeEIsRUFBZ0NELElBQUk2RixDQUFwQyxFQUF1QzdGLEdBQXZDLEVBQTRDO0FBQzFDMkYsZUFBU3JILElBQVQsQ0FBY3NILEtBQWQsRUFBcUJGLElBQUkxRixDQUFKLENBQXJCLEVBQTZCQSxDQUE3QjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSThGLG1CQUFtQixlQUFlNUUsU0FBU0UsYUFBVCxDQUF1QixHQUF2QixDQUF0Qzs7QUFFQSxNQUFJMkUsV0FBV0QsbUJBQ1gsVUFBVUUsRUFBVixFQUFjN0QsR0FBZCxFQUFtQjtBQUFFLFdBQU82RCxHQUFHQyxTQUFILENBQWFDLFFBQWIsQ0FBc0IvRCxHQUF0QixDQUFQO0FBQW9DLEdBRDlDLEdBRVgsVUFBVTZELEVBQVYsRUFBYzdELEdBQWQsRUFBbUI7QUFBRSxXQUFPNkQsR0FBR2pELFNBQUgsQ0FBYTFDLE9BQWIsQ0FBcUI4QixHQUFyQixLQUE2QixDQUFwQztBQUF3QyxHQUZqRTs7QUFJQSxNQUFJZ0UsV0FBV0wsbUJBQ1gsVUFBVUUsRUFBVixFQUFjN0QsR0FBZCxFQUFtQjtBQUNqQixRQUFJLENBQUM0RCxTQUFTQyxFQUFULEVBQWM3RCxHQUFkLENBQUwsRUFBeUI7QUFBRTZELFNBQUdDLFNBQUgsQ0FBYUcsR0FBYixDQUFpQmpFLEdBQWpCO0FBQXdCO0FBQ3BELEdBSFUsR0FJWCxVQUFVNkQsRUFBVixFQUFjN0QsR0FBZCxFQUFtQjtBQUNqQixRQUFJLENBQUM0RCxTQUFTQyxFQUFULEVBQWM3RCxHQUFkLENBQUwsRUFBeUI7QUFBRTZELFNBQUdqRCxTQUFILElBQWdCLE1BQU1aLEdBQXRCO0FBQTRCO0FBQ3hELEdBTkw7O0FBUUEsTUFBSWtFLGNBQWNQLG1CQUNkLFVBQVVFLEVBQVYsRUFBYzdELEdBQWQsRUFBbUI7QUFDakIsUUFBSTRELFNBQVNDLEVBQVQsRUFBYzdELEdBQWQsQ0FBSixFQUF3QjtBQUFFNkQsU0FBR0MsU0FBSCxDQUFheEgsTUFBYixDQUFvQjBELEdBQXBCO0FBQTJCO0FBQ3RELEdBSGEsR0FJZCxVQUFVNkQsRUFBVixFQUFjN0QsR0FBZCxFQUFtQjtBQUNqQixRQUFJNEQsU0FBU0MsRUFBVCxFQUFhN0QsR0FBYixDQUFKLEVBQXVCO0FBQUU2RCxTQUFHakQsU0FBSCxHQUFlaUQsR0FBR2pELFNBQUgsQ0FBYVAsT0FBYixDQUFxQkwsR0FBckIsRUFBMEIsRUFBMUIsQ0FBZjtBQUErQztBQUN6RSxHQU5MOztBQVFBLFdBQVNtRSxPQUFULENBQWlCTixFQUFqQixFQUFxQk8sSUFBckIsRUFBMkI7QUFDekIsV0FBT1AsR0FBR1EsWUFBSCxDQUFnQkQsSUFBaEIsQ0FBUDtBQUNEOztBQUVELFdBQVNFLE9BQVQsQ0FBaUJULEVBQWpCLEVBQXFCTyxJQUFyQixFQUEyQjtBQUN6QixXQUFPUCxHQUFHVSxZQUFILENBQWdCSCxJQUFoQixDQUFQO0FBQ0Q7O0FBRUQsV0FBU0ksVUFBVCxDQUFvQlgsRUFBcEIsRUFBd0I7QUFDdEI7QUFDQSxXQUFPLE9BQU9BLEdBQUdZLElBQVYsS0FBbUIsV0FBMUI7QUFDRDs7QUFFRCxXQUFTQyxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsS0FBdkIsRUFBOEI7QUFDNUJELFVBQU9ILFdBQVdHLEdBQVgsS0FBbUJBLGVBQWVFLEtBQW5DLEdBQTRDRixHQUE1QyxHQUFrRCxDQUFDQSxHQUFELENBQXhEO0FBQ0EsUUFBSTlJLE9BQU9JLFNBQVAsQ0FBaUI2SSxRQUFqQixDQUEwQjNJLElBQTFCLENBQStCeUksS0FBL0IsTUFBMEMsaUJBQTlDLEVBQWlFO0FBQUU7QUFBUzs7QUFFNUUsU0FBSyxJQUFJL0csSUFBSThHLElBQUk3RyxNQUFqQixFQUF5QkQsR0FBekIsR0FBK0I7QUFDN0IsV0FBSSxJQUFJVSxHQUFSLElBQWVxRyxLQUFmLEVBQXNCO0FBQ3BCRCxZQUFJOUcsQ0FBSixFQUFPaUUsWUFBUCxDQUFvQnZELEdBQXBCLEVBQXlCcUcsTUFBTXJHLEdBQU4sQ0FBekI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsV0FBU3dHLFdBQVQsQ0FBcUJKLEdBQXJCLEVBQTBCQyxLQUExQixFQUFpQztBQUMvQkQsVUFBT0gsV0FBV0csR0FBWCxLQUFtQkEsZUFBZUUsS0FBbkMsR0FBNENGLEdBQTVDLEdBQWtELENBQUNBLEdBQUQsQ0FBeEQ7QUFDQUMsWUFBU0EsaUJBQWlCQyxLQUFsQixHQUEyQkQsS0FBM0IsR0FBbUMsQ0FBQ0EsS0FBRCxDQUEzQzs7QUFFQSxRQUFJSSxhQUFhSixNQUFNOUcsTUFBdkI7QUFDQSxTQUFLLElBQUlELElBQUk4RyxJQUFJN0csTUFBakIsRUFBeUJELEdBQXpCLEdBQStCO0FBQzdCLFdBQUssSUFBSW9ILElBQUlELFVBQWIsRUFBeUJDLEdBQXpCLEdBQStCO0FBQzdCTixZQUFJOUcsQ0FBSixFQUFPcUgsZUFBUCxDQUF1Qk4sTUFBTUssQ0FBTixDQUF2QjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxXQUFTRSxpQkFBVCxDQUE0QkMsRUFBNUIsRUFBZ0M7QUFDOUIsUUFBSTdCLE1BQU0sRUFBVjtBQUNBLFNBQUssSUFBSTFGLElBQUksQ0FBUixFQUFXNkYsSUFBSTBCLEdBQUd0SCxNQUF2QixFQUErQkQsSUFBSTZGLENBQW5DLEVBQXNDN0YsR0FBdEMsRUFBMkM7QUFDekMwRixVQUFJbkgsSUFBSixDQUFTZ0osR0FBR3ZILENBQUgsQ0FBVDtBQUNEO0FBQ0QsV0FBTzBGLEdBQVA7QUFDRDs7QUFFRCxXQUFTOEIsV0FBVCxDQUFxQnhCLEVBQXJCLEVBQXlCeUIsU0FBekIsRUFBb0M7QUFDbEMsUUFBSXpCLEdBQUd0RSxLQUFILENBQVNnRyxPQUFULEtBQXFCLE1BQXpCLEVBQWlDO0FBQUUxQixTQUFHdEUsS0FBSCxDQUFTZ0csT0FBVCxHQUFtQixNQUFuQjtBQUE0QjtBQUNoRTs7QUFFRCxXQUFTQyxXQUFULENBQXFCM0IsRUFBckIsRUFBeUJ5QixTQUF6QixFQUFvQztBQUNsQyxRQUFJekIsR0FBR3RFLEtBQUgsQ0FBU2dHLE9BQVQsS0FBcUIsTUFBekIsRUFBaUM7QUFBRTFCLFNBQUd0RSxLQUFILENBQVNnRyxPQUFULEdBQW1CLEVBQW5CO0FBQXdCO0FBQzVEOztBQUVELFdBQVNFLFNBQVQsQ0FBbUI1QixFQUFuQixFQUF1QjtBQUNyQixXQUFPbkgsT0FBT2dGLGdCQUFQLENBQXdCbUMsRUFBeEIsRUFBNEIwQixPQUE1QixLQUF3QyxNQUEvQztBQUNEOztBQUVELFdBQVNHLGFBQVQsQ0FBdUJDLEtBQXZCLEVBQTZCO0FBQzNCLFFBQUksT0FBT0EsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixVQUFJcEMsTUFBTSxDQUFDb0MsS0FBRCxDQUFWO0FBQUEsVUFDSUMsUUFBUUQsTUFBTUUsTUFBTixDQUFhLENBQWIsRUFBZ0JDLFdBQWhCLEtBQWdDSCxNQUFNSSxNQUFOLENBQWEsQ0FBYixDQUQ1QztBQUFBLFVBRUlDLFdBQVcsQ0FBQyxRQUFELEVBQVcsS0FBWCxFQUFrQixJQUFsQixFQUF3QixHQUF4QixDQUZmOztBQUlBQSxlQUFTMUMsT0FBVCxDQUFpQixVQUFTMkMsTUFBVCxFQUFpQjtBQUNoQyxZQUFJQSxXQUFXLElBQVgsSUFBbUJOLFVBQVUsV0FBakMsRUFBOEM7QUFDNUNwQyxjQUFJbkgsSUFBSixDQUFTNkosU0FBU0wsS0FBbEI7QUFDRDtBQUNGLE9BSkQ7O0FBTUFELGNBQVFwQyxHQUFSO0FBQ0Q7O0FBRUQsUUFBSU0sS0FBSzlFLFNBQVNFLGFBQVQsQ0FBdUIsYUFBdkIsQ0FBVDtBQUFBLFFBQ0lpSCxNQUFNUCxNQUFNN0gsTUFEaEI7QUFFQSxTQUFJLElBQUlELElBQUksQ0FBWixFQUFlQSxJQUFJOEgsTUFBTTdILE1BQXpCLEVBQWlDRCxHQUFqQyxFQUFxQztBQUNuQyxVQUFJc0ksT0FBT1IsTUFBTTlILENBQU4sQ0FBWDtBQUNBLFVBQUlnRyxHQUFHdEUsS0FBSCxDQUFTNEcsSUFBVCxNQUFtQnBJLFNBQXZCLEVBQWtDO0FBQUUsZUFBT29JLElBQVA7QUFBYztBQUNuRDs7QUFFRCxXQUFPLEtBQVAsQ0F0QjJCLENBc0JiO0FBQ2Y7O0FBRUQsV0FBU0MsZUFBVCxDQUF5QkMsRUFBekIsRUFBNEI7QUFDMUIsUUFBSSxDQUFDQSxFQUFMLEVBQVM7QUFBRSxhQUFPLEtBQVA7QUFBZTtBQUMxQixRQUFJLENBQUMzSixPQUFPZ0YsZ0JBQVosRUFBOEI7QUFBRSxhQUFPLEtBQVA7QUFBZTs7QUFFL0MsUUFBSTVDLE1BQU1DLFFBQVY7QUFBQSxRQUNJQyxPQUFPSCxTQURYO0FBQUEsUUFFSVMsY0FBY0QsWUFBWUwsSUFBWixDQUZsQjtBQUFBLFFBR0k2RSxLQUFLL0UsSUFBSUcsYUFBSixDQUFrQixHQUFsQixDQUhUO0FBQUEsUUFJSXFILEtBSko7QUFBQSxRQUtJQyxRQUFRRixHQUFHdkksTUFBSCxHQUFZLENBQVosR0FBZ0IsTUFBTXVJLEdBQUdHLEtBQUgsQ0FBUyxDQUFULEVBQVksQ0FBQyxDQUFiLEVBQWdCQyxXQUFoQixFQUFOLEdBQXNDLEdBQXRELEdBQTRELEVBTHhFOztBQU9BRixhQUFTLFdBQVQ7O0FBRUE7QUFDQXZILFNBQUswSCxZQUFMLENBQWtCN0MsRUFBbEIsRUFBc0IsSUFBdEI7O0FBRUFBLE9BQUd0RSxLQUFILENBQVM4RyxFQUFULElBQWUsMEJBQWY7QUFDQUMsWUFBUTVKLE9BQU9nRixnQkFBUCxDQUF3Qm1DLEVBQXhCLEVBQTRCOEMsZ0JBQTVCLENBQTZDSixLQUE3QyxDQUFSOztBQUVBdkgsU0FBS0UsSUFBTCxHQUFZUyxjQUFjWCxJQUFkLEVBQW9CTSxXQUFwQixDQUFaLEdBQStDdUUsR0FBR3ZILE1BQUgsRUFBL0M7O0FBRUEsV0FBUWdLLFVBQVV2SSxTQUFWLElBQXVCdUksTUFBTXhJLE1BQU4sR0FBZSxDQUF0QyxJQUEyQ3dJLFVBQVUsTUFBN0Q7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVNNLGNBQVQsQ0FBd0JDLE1BQXhCLEVBQWdDQyxPQUFoQyxFQUF5QztBQUN2QyxRQUFJQyxVQUFVLEtBQWQ7QUFDQSxRQUFJLFVBQVVDLElBQVYsQ0FBZUgsTUFBZixDQUFKLEVBQTRCO0FBQzFCRSxnQkFBVSxXQUFXRCxPQUFYLEdBQXFCLEtBQS9CO0FBQ0QsS0FGRCxNQUVPLElBQUksS0FBS0UsSUFBTCxDQUFVSCxNQUFWLENBQUosRUFBdUI7QUFDNUJFLGdCQUFVLE1BQU1ELE9BQU4sR0FBZ0IsS0FBMUI7QUFDRCxLQUZNLE1BRUEsSUFBSUQsTUFBSixFQUFZO0FBQ2pCRSxnQkFBVUQsUUFBUUwsV0FBUixLQUF3QixLQUFsQztBQUNEO0FBQ0QsV0FBT00sT0FBUDtBQUNEOztBQUVEO0FBQ0EsTUFBSUUsa0JBQWtCLEtBQXRCO0FBQ0EsTUFBSTtBQUNGLFFBQUlDLE9BQU9yTCxPQUFPc0wsY0FBUCxDQUFzQixFQUF0QixFQUEwQixTQUExQixFQUFxQztBQUM5Q0MsV0FBSyxlQUFXO0FBQ2RILDBCQUFrQixJQUFsQjtBQUNEO0FBSDZDLEtBQXJDLENBQVg7QUFLQXZLLFdBQU8ySyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxJQUFoQyxFQUFzQ0gsSUFBdEM7QUFDRCxHQVBELENBT0UsT0FBT3hJLENBQVAsRUFBVSxDQUFFO0FBQ2QsTUFBSTRJLGdCQUFnQkwsa0JBQWtCLEVBQUVNLFNBQVMsSUFBWCxFQUFsQixHQUFzQyxLQUExRDs7QUFFQSxXQUFTQyxTQUFULENBQW1CM0QsRUFBbkIsRUFBdUJwRyxHQUF2QixFQUE0QmdLLGdCQUE1QixFQUE4QztBQUM1QyxTQUFLLElBQUl0QixJQUFULElBQWlCMUksR0FBakIsRUFBc0I7QUFDcEIsVUFBSWlLLFNBQVMsQ0FBQyxZQUFELEVBQWUsV0FBZixFQUE0QnhKLE9BQTVCLENBQW9DaUksSUFBcEMsS0FBNkMsQ0FBN0MsSUFBa0QsQ0FBQ3NCLGdCQUFuRCxHQUFzRUgsYUFBdEUsR0FBc0YsS0FBbkc7QUFDQXpELFNBQUd3RCxnQkFBSCxDQUFvQmxCLElBQXBCLEVBQTBCMUksSUFBSTBJLElBQUosQ0FBMUIsRUFBcUN1QixNQUFyQztBQUNEO0FBQ0Y7O0FBRUQsV0FBU0MsWUFBVCxDQUFzQjlELEVBQXRCLEVBQTBCcEcsR0FBMUIsRUFBK0I7QUFDN0IsU0FBSyxJQUFJMEksSUFBVCxJQUFpQjFJLEdBQWpCLEVBQXNCO0FBQ3BCLFVBQUlpSyxTQUFTLENBQUMsWUFBRCxFQUFlLFdBQWYsRUFBNEJ4SixPQUE1QixDQUFvQ2lJLElBQXBDLEtBQTZDLENBQTdDLEdBQWlEbUIsYUFBakQsR0FBaUUsS0FBOUU7QUFDQXpELFNBQUcrRCxtQkFBSCxDQUF1QnpCLElBQXZCLEVBQTZCMUksSUFBSTBJLElBQUosQ0FBN0IsRUFBd0N1QixNQUF4QztBQUNEO0FBQ0Y7O0FBRUQsV0FBU0csTUFBVCxHQUFrQjtBQUNoQixXQUFPO0FBQ0xDLGNBQVEsRUFESDtBQUVMQyxVQUFJLFlBQVVDLFNBQVYsRUFBcUJDLEVBQXJCLEVBQXlCO0FBQzNCLGFBQUtILE1BQUwsQ0FBWUUsU0FBWixJQUF5QixLQUFLRixNQUFMLENBQVlFLFNBQVosS0FBMEIsRUFBbkQ7QUFDQSxhQUFLRixNQUFMLENBQVlFLFNBQVosRUFBdUI1TCxJQUF2QixDQUE0QjZMLEVBQTVCO0FBQ0QsT0FMSTtBQU1MQyxXQUFLLGFBQVNGLFNBQVQsRUFBb0JDLEVBQXBCLEVBQXdCO0FBQzNCLFlBQUksS0FBS0gsTUFBTCxDQUFZRSxTQUFaLENBQUosRUFBNEI7QUFDMUIsZUFBSyxJQUFJbkssSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUtpSyxNQUFMLENBQVlFLFNBQVosRUFBdUJsSyxNQUEzQyxFQUFtREQsR0FBbkQsRUFBd0Q7QUFDdEQsZ0JBQUksS0FBS2lLLE1BQUwsQ0FBWUUsU0FBWixFQUF1Qm5LLENBQXZCLE1BQThCb0ssRUFBbEMsRUFBc0M7QUFDcEMsbUJBQUtILE1BQUwsQ0FBWUUsU0FBWixFQUF1QkcsTUFBdkIsQ0FBOEJ0SyxDQUE5QixFQUFpQyxDQUFqQztBQUNBO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsT0FmSTtBQWdCTHVLLFlBQU0sY0FBVUosU0FBVixFQUFxQkssSUFBckIsRUFBMkI7QUFDL0JBLGFBQUsvRyxJQUFMLEdBQVkwRyxTQUFaO0FBQ0EsWUFBSSxLQUFLRixNQUFMLENBQVlFLFNBQVosQ0FBSixFQUE0QjtBQUMxQixlQUFLRixNQUFMLENBQVlFLFNBQVosRUFBdUIxRSxPQUF2QixDQUErQixVQUFTMkUsRUFBVCxFQUFhO0FBQzFDQSxlQUFHSSxJQUFILEVBQVNMLFNBQVQ7QUFDRCxXQUZEO0FBR0Q7QUFDRjtBQXZCSSxLQUFQO0FBeUJEOztBQUVELFdBQVNNLFdBQVQsQ0FBcUJDLE9BQXJCLEVBQThCbkUsSUFBOUIsRUFBb0M2QixNQUFwQyxFQUE0Q3VDLE9BQTVDLEVBQXFEQyxFQUFyRCxFQUF5REMsUUFBekQsRUFBbUVsRixRQUFuRSxFQUE2RTtBQUMzRSxRQUFJbUYsT0FBTzdILEtBQUs4SCxHQUFMLENBQVNGLFFBQVQsRUFBbUIsRUFBbkIsQ0FBWDtBQUFBLFFBQ0lHLE9BQVFKLEdBQUd2SyxPQUFILENBQVcsR0FBWCxLQUFtQixDQUFwQixHQUF5QixHQUF6QixHQUErQixJQUQxQztBQUFBLFFBRUl1SyxLQUFLQSxHQUFHcEksT0FBSCxDQUFXd0ksSUFBWCxFQUFpQixFQUFqQixDQUZUO0FBQUEsUUFHSUMsT0FBT0MsT0FBT1IsUUFBUWhKLEtBQVIsQ0FBYzZFLElBQWQsRUFBb0IvRCxPQUFwQixDQUE0QjRGLE1BQTVCLEVBQW9DLEVBQXBDLEVBQXdDNUYsT0FBeEMsQ0FBZ0RtSSxPQUFoRCxFQUF5RCxFQUF6RCxFQUE2RG5JLE9BQTdELENBQXFFd0ksSUFBckUsRUFBMkUsRUFBM0UsQ0FBUCxDQUhYO0FBQUEsUUFJSUcsZUFBZSxDQUFDUCxLQUFLSyxJQUFOLElBQWNKLFFBQWQsR0FBeUJDLElBSjVDO0FBQUEsUUFLSU0sT0FMSjs7QUFPQWhNLGVBQVdpTSxXQUFYLEVBQXdCUCxJQUF4QjtBQUNBLGFBQVNPLFdBQVQsR0FBdUI7QUFDckJSLGtCQUFZQyxJQUFaO0FBQ0FHLGNBQVFFLFlBQVI7QUFDQVQsY0FBUWhKLEtBQVIsQ0FBYzZFLElBQWQsSUFBc0I2QixTQUFTNkMsSUFBVCxHQUFnQkQsSUFBaEIsR0FBdUJMLE9BQTdDO0FBQ0EsVUFBSUUsV0FBVyxDQUFmLEVBQWtCO0FBQ2hCekwsbUJBQVdpTSxXQUFYLEVBQXdCUCxJQUF4QjtBQUNELE9BRkQsTUFFTztBQUNMbkY7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsTUFBSTVILE1BQU0sU0FBTkEsR0FBTSxDQUFTdU4sT0FBVCxFQUFrQjtBQUMxQkEsY0FBVTNMLE9BQU87QUFDZjRMLGlCQUFXLFNBREk7QUFFZkMsWUFBTSxVQUZTO0FBR2ZDLFlBQU0sWUFIUztBQUlmQyxhQUFPLENBSlE7QUFLZkMsY0FBUSxDQUxPO0FBTWZDLG1CQUFhLENBTkU7QUFPZkMsa0JBQVksS0FQRztBQVFmQyxpQkFBVyxLQVJJO0FBU2ZDLG1CQUFhLEtBVEU7QUFVZkMsZUFBUyxDQVZNO0FBV2ZDLGNBQVEsS0FYTztBQVlmQyxnQkFBVSxJQVpLO0FBYWZDLHdCQUFrQixLQWJIO0FBY2ZDLG9CQUFjLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FkQztBQWVmQyx5QkFBbUIsS0FmSjtBQWdCZkMsa0JBQVksS0FoQkc7QUFpQmZDLGtCQUFZLEtBakJHO0FBa0JmQyxXQUFLLElBbEJVO0FBbUJmQyxtQkFBYSxLQW5CRTtBQW9CZkMsb0JBQWMsS0FwQkM7QUFxQmZDLHVCQUFpQixLQXJCRjtBQXNCZkMsaUJBQVcsS0F0Qkk7QUF1QmZDLGFBQU8sR0F2QlE7QUF3QmZDLGdCQUFVLEtBeEJLO0FBeUJmQyx3QkFBa0IsS0F6Qkg7QUEwQmZDLHVCQUFpQixJQTFCRjtBQTJCZkMseUJBQW1CLFNBM0JKO0FBNEJmQyxvQkFBYyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBNUJDO0FBNkJmQywwQkFBb0IsS0E3Qkw7QUE4QmZDLHNCQUFnQixLQTlCRDtBQStCZkMsNEJBQXNCLElBL0JQO0FBZ0NmQyxpQ0FBMkIsSUFoQ1o7QUFpQ2ZDLGlCQUFXLFlBakNJO0FBa0NmQyxrQkFBWSxhQWxDRztBQW1DZkMscUJBQWUsWUFuQ0E7QUFvQ2ZDLG9CQUFjLEtBcENDO0FBcUNmQyxZQUFNLElBckNTO0FBc0NmQyxjQUFRLEtBdENPO0FBdUNmQyxrQkFBWSxLQXZDRztBQXdDZkMsa0JBQVksS0F4Q0c7QUF5Q2ZDLGdCQUFVLEtBekNLO0FBMENmQyx3QkFBa0IsZUExQ0g7QUEyQ2ZDLGFBQU8sSUEzQ1E7QUE0Q2ZDLGlCQUFXLEtBNUNJO0FBNkNmQyxrQkFBWSxFQTdDRztBQThDZkMsY0FBUSxLQTlDTztBQStDZkMsZ0NBQTBCLEtBL0NYO0FBZ0RmQyw0QkFBc0IsS0FoRFA7QUFpRGZDLGlCQUFXLElBakRJO0FBa0RmQyxjQUFRLEtBbERPO0FBbURmQyx1QkFBaUI7QUFuREYsS0FBUCxFQW9EUG5ELFdBQVcsRUFwREosQ0FBVjs7QUFzREEsUUFBSXJLLE1BQU1DLFFBQVY7QUFBQSxRQUNJdEMsTUFBTUMsTUFEVjtBQUFBLFFBRUk2UCxPQUFPO0FBQ0xDLGFBQU8sRUFERjtBQUVMQyxhQUFPLEVBRkY7QUFHTEMsWUFBTSxFQUhEO0FBSUxDLGFBQU87QUFKRixLQUZYO0FBQUEsUUFRSUMsYUFBYSxFQVJqQjtBQUFBLFFBU0lDLHFCQUFxQjFELFFBQVFtRCxlQVRqQzs7QUFXQSxRQUFJTyxrQkFBSixFQUF3QjtBQUN0QjtBQUNBLFVBQUlDLGNBQWNDLFVBQVVDLFNBQTVCO0FBQ0EsVUFBSUMsTUFBTSxJQUFJQyxJQUFKLEVBQVY7O0FBRUEsVUFBSTtBQUNGTixxQkFBYW5RLElBQUkwUSxZQUFqQjtBQUNBLFlBQUlQLFVBQUosRUFBZ0I7QUFDZEEscUJBQVduTyxPQUFYLENBQW1Cd08sR0FBbkIsRUFBd0JBLEdBQXhCO0FBQ0FKLCtCQUFxQkQsV0FBV1EsT0FBWCxDQUFtQkgsR0FBbkIsS0FBMkJBLEdBQWhEO0FBQ0FMLHFCQUFXUyxVQUFYLENBQXNCSixHQUF0QjtBQUNELFNBSkQsTUFJTztBQUNMSiwrQkFBcUIsS0FBckI7QUFDRDtBQUNELFlBQUksQ0FBQ0Esa0JBQUwsRUFBeUI7QUFBRUQsdUJBQWEsRUFBYjtBQUFrQjtBQUM5QyxPQVZELENBVUUsT0FBTWxPLENBQU4sRUFBUztBQUNUbU8sNkJBQXFCLEtBQXJCO0FBQ0Q7O0FBRUQsVUFBSUEsa0JBQUosRUFBd0I7QUFDdEI7QUFDQSxZQUFJRCxXQUFXLFFBQVgsS0FBd0JBLFdBQVcsUUFBWCxNQUF5QkUsV0FBckQsRUFBa0U7QUFDaEUsV0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEtBQWQsRUFBcUIsS0FBckIsRUFBNEIsS0FBNUIsRUFBbUMsTUFBbkMsRUFBMkMsTUFBM0MsRUFBbUQsTUFBbkQsRUFBMkQsTUFBM0QsRUFBbUUsS0FBbkUsRUFBMEUsS0FBMUUsRUFBaUZ4SixPQUFqRixDQUF5RixVQUFTbUIsSUFBVCxFQUFlO0FBQUVtSSx1QkFBV1MsVUFBWCxDQUFzQjVJLElBQXRCO0FBQThCLFdBQXhJO0FBQ0Q7QUFDRDtBQUNBMEkscUJBQWEsUUFBYixJQUF5QkwsV0FBekI7QUFDRDtBQUNGOztBQUVELFFBQUlRLE9BQU9WLFdBQVcsSUFBWCxJQUFtQjVPLGtCQUFrQjRPLFdBQVcsSUFBWCxDQUFsQixDQUFuQixHQUF5RHZPLGdCQUFnQnVPLFVBQWhCLEVBQTRCLElBQTVCLEVBQWtDL00sTUFBbEMsRUFBMENnTixrQkFBMUMsQ0FBcEU7QUFBQSxRQUNJVSxtQkFBbUJYLFdBQVcsS0FBWCxJQUFvQjVPLGtCQUFrQjRPLFdBQVcsS0FBWCxDQUFsQixDQUFwQixHQUEyRHZPLGdCQUFnQnVPLFVBQWhCLEVBQTRCLEtBQTVCLEVBQW1DdE0sa0JBQW5DLEVBQXVEdU0sa0JBQXZELENBRGxGO0FBQUEsUUFFSVcsUUFBUVosV0FBVyxLQUFYLElBQW9CNU8sa0JBQWtCNE8sV0FBVyxLQUFYLENBQWxCLENBQXBCLEdBQTJEdk8sZ0JBQWdCdU8sVUFBaEIsRUFBNEIsS0FBNUIsRUFBbUN6TCxtQkFBbkMsRUFBd0QwTCxrQkFBeEQsQ0FGdkU7QUFBQSxRQUdJWSxZQUFZYixXQUFXLEtBQVgsSUFBb0I1TyxrQkFBa0I0TyxXQUFXLEtBQVgsQ0FBbEIsQ0FBcEIsR0FBMkR2TyxnQkFBZ0J1TyxVQUFoQixFQUE0QixLQUE1QixFQUFtQ2xILGNBQWMsV0FBZCxDQUFuQyxFQUErRG1ILGtCQUEvRCxDQUgzRTtBQUFBLFFBSUlhLGtCQUFrQmQsV0FBVyxLQUFYLElBQW9CNU8sa0JBQWtCNE8sV0FBVyxLQUFYLENBQWxCLENBQXBCLEdBQTJEdk8sZ0JBQWdCdU8sVUFBaEIsRUFBNEIsS0FBNUIsRUFBbUN4RyxnQkFBZ0JxSCxTQUFoQixDQUFuQyxFQUErRFosa0JBQS9ELENBSmpGO0FBQUEsUUFLSWMscUJBQXFCZixXQUFXLE1BQVgsSUFBcUI1TyxrQkFBa0I0TyxXQUFXLE1BQVgsQ0FBbEIsQ0FBckIsR0FBNkR2TyxnQkFBZ0J1TyxVQUFoQixFQUE0QixNQUE1QixFQUFvQ2xILGNBQWMsb0JBQWQsQ0FBcEMsRUFBeUVtSCxrQkFBekUsQ0FMdEY7QUFBQSxRQU1JZSxrQkFBa0JoQixXQUFXLE1BQVgsSUFBcUI1TyxrQkFBa0I0TyxXQUFXLE1BQVgsQ0FBbEIsQ0FBckIsR0FBNkR2TyxnQkFBZ0J1TyxVQUFoQixFQUE0QixNQUE1QixFQUFvQ2xILGNBQWMsaUJBQWQsQ0FBcEMsRUFBc0VtSCxrQkFBdEUsQ0FObkY7QUFBQSxRQU9JZ0Isb0JBQW9CakIsV0FBVyxNQUFYLElBQXFCNU8sa0JBQWtCNE8sV0FBVyxNQUFYLENBQWxCLENBQXJCLEdBQTZEdk8sZ0JBQWdCdU8sVUFBaEIsRUFBNEIsTUFBNUIsRUFBb0NsSCxjQUFjLG1CQUFkLENBQXBDLEVBQXdFbUgsa0JBQXhFLENBUHJGO0FBQUEsUUFRSWlCLGlCQUFpQmxCLFdBQVcsTUFBWCxJQUFxQjVPLGtCQUFrQjRPLFdBQVcsTUFBWCxDQUFsQixDQUFyQixHQUE2RHZPLGdCQUFnQnVPLFVBQWhCLEVBQTRCLE1BQTVCLEVBQW9DbEgsY0FBYyxnQkFBZCxDQUFwQyxFQUFxRW1ILGtCQUFyRSxDQVJsRjtBQUFBLFFBU0lrQixnQkFBZ0JuQixXQUFXLEtBQVgsSUFBb0I1TyxrQkFBa0I0TyxXQUFXLEtBQVgsQ0FBbEIsQ0FBcEIsR0FBMkR2TyxnQkFBZ0J1TyxVQUFoQixFQUE0QixLQUE1QixFQUFtQ2hHLGVBQWUrRyxrQkFBZixFQUFtQyxZQUFuQyxDQUFuQyxFQUFxRmQsa0JBQXJGLENBVC9FO0FBQUEsUUFVSW1CLGVBQWVwQixXQUFXLEtBQVgsSUFBb0I1TyxrQkFBa0I0TyxXQUFXLEtBQVgsQ0FBbEIsQ0FBcEIsR0FBMkR2TyxnQkFBZ0J1TyxVQUFoQixFQUE0QixLQUE1QixFQUFtQ2hHLGVBQWVpSCxpQkFBZixFQUFrQyxXQUFsQyxDQUFuQyxFQUFtRmhCLGtCQUFuRixDQVY5RTs7QUFZQTtBQUNBLFFBQUlvQixxQkFBcUJ4UixJQUFJeVIsT0FBSixJQUFlLE9BQU96UixJQUFJeVIsT0FBSixDQUFZQyxJQUFuQixLQUE0QixVQUFwRTtBQUFBLFFBQ0lDLFVBQVUsQ0FBQyxXQUFELEVBQWMsbUJBQWQsRUFBbUMsWUFBbkMsRUFBaUQsWUFBakQsRUFBK0QsY0FBL0QsRUFBK0UsZ0JBQS9FLENBRGQ7QUFBQSxRQUVJQyxrQkFBa0IsRUFGdEI7O0FBSUFELFlBQVE5SyxPQUFSLENBQWdCLFVBQVNtQixJQUFULEVBQWU7QUFDN0IsVUFBSSxPQUFPMEUsUUFBUTFFLElBQVIsQ0FBUCxLQUF5QixRQUE3QixFQUF1QztBQUNyQyxZQUFJekUsTUFBTW1KLFFBQVExRSxJQUFSLENBQVY7QUFBQSxZQUNJWixLQUFLL0UsSUFBSWlELGFBQUosQ0FBa0IvQixHQUFsQixDQURUO0FBRUFxTyx3QkFBZ0I1SixJQUFoQixJQUF3QnpFLEdBQXhCOztBQUVBLFlBQUk2RCxNQUFNQSxHQUFHeUssUUFBYixFQUF1QjtBQUNyQm5GLGtCQUFRMUUsSUFBUixJQUFnQlosRUFBaEI7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJb0ssa0JBQUosRUFBd0I7QUFBRUMsb0JBQVFDLElBQVIsQ0FBYSxhQUFiLEVBQTRCaEYsUUFBUTFFLElBQVIsQ0FBNUI7QUFBNkM7QUFDdkU7QUFDRDtBQUNGO0FBQ0YsS0FiRDs7QUFlQTtBQUNBLFFBQUkwRSxRQUFRQyxTQUFSLENBQWtCbEksUUFBbEIsQ0FBMkJwRCxNQUEzQixHQUFvQyxDQUF4QyxFQUEyQztBQUN6QyxVQUFJbVEsa0JBQUosRUFBd0I7QUFBRUMsZ0JBQVFDLElBQVIsQ0FBYSxvQkFBYixFQUFtQ2hGLFFBQVFDLFNBQTNDO0FBQXdEO0FBQ2xGO0FBQ0E7O0FBRUY7QUFDQSxRQUFJdUMsYUFBYXhDLFFBQVF3QyxVQUF6QjtBQUFBLFFBQ0lNLFNBQVM5QyxRQUFROEMsTUFEckI7QUFBQSxRQUVJc0MsV0FBV3BGLFFBQVFFLElBQVIsS0FBaUIsVUFBakIsR0FBOEIsSUFBOUIsR0FBcUMsS0FGcEQ7O0FBSUEsUUFBSXNDLFVBQUosRUFBZ0I7QUFDZDtBQUNBLFVBQUksS0FBS0EsVUFBVCxFQUFxQjtBQUNuQnhDLGtCQUFVM0wsT0FBTzJMLE9BQVAsRUFBZ0J3QyxXQUFXLENBQVgsQ0FBaEIsQ0FBVjtBQUNBLGVBQU9BLFdBQVcsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQsVUFBSTZDLGdCQUFnQixFQUFwQjtBQUNBLFdBQUssSUFBSWpRLEdBQVQsSUFBZ0JvTixVQUFoQixFQUE0QjtBQUMxQixZQUFJekwsTUFBTXlMLFdBQVdwTixHQUFYLENBQVY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTJCLGNBQU0sT0FBT0EsR0FBUCxLQUFlLFFBQWYsR0FBMEIsRUFBQ3FKLE9BQU9ySixHQUFSLEVBQTFCLEdBQXlDQSxHQUEvQztBQUNBc08sc0JBQWNqUSxHQUFkLElBQXFCMkIsR0FBckI7QUFDRDtBQUNEeUwsbUJBQWE2QyxhQUFiO0FBQ0FBLHNCQUFnQixJQUFoQjtBQUNEOztBQUVEO0FBQ0EsYUFBU0MsYUFBVCxDQUF3QmhSLEdBQXhCLEVBQTZCO0FBQzNCLFdBQUssSUFBSWMsR0FBVCxJQUFnQmQsR0FBaEIsRUFBcUI7QUFDbkIsWUFBSSxDQUFDOFEsUUFBTCxFQUFlO0FBQ2IsY0FBSWhRLFFBQVEsU0FBWixFQUF1QjtBQUFFZCxnQkFBSWMsR0FBSixJQUFXLE1BQVg7QUFBb0I7QUFDN0MsY0FBSUEsUUFBUSxhQUFaLEVBQTJCO0FBQUVkLGdCQUFJYyxHQUFKLElBQVcsS0FBWDtBQUFtQjtBQUNoRCxjQUFJQSxRQUFRLFlBQVosRUFBMEI7QUFBRWQsZ0JBQUljLEdBQUosSUFBVyxLQUFYO0FBQW1CO0FBQ2hEOztBQUVEO0FBQ0EsWUFBSUEsUUFBUSxZQUFaLEVBQTBCO0FBQUVrUSx3QkFBY2hSLElBQUljLEdBQUosQ0FBZDtBQUEwQjtBQUN2RDtBQUNGO0FBQ0QsUUFBSSxDQUFDZ1EsUUFBTCxFQUFlO0FBQUVFLG9CQUFjdEYsT0FBZDtBQUF5Qjs7QUFHMUM7QUFDQSxRQUFJLENBQUNvRixRQUFMLEVBQWU7QUFDYnBGLGNBQVFHLElBQVIsR0FBZSxZQUFmO0FBQ0FILGNBQVFVLE9BQVIsR0FBa0IsTUFBbEI7QUFDQVYsY0FBUU0sV0FBUixHQUFzQixLQUF0Qjs7QUFFQSxVQUFJMkIsWUFBWWpDLFFBQVFpQyxTQUF4QjtBQUFBLFVBQ0lDLGFBQWFsQyxRQUFRa0MsVUFEekI7QUFBQSxVQUVJRSxlQUFlcEMsUUFBUW9DLFlBRjNCO0FBQUEsVUFHSUQsZ0JBQWdCbkMsUUFBUW1DLGFBSDVCO0FBSUQ7O0FBRUQsUUFBSW9ELGFBQWF2RixRQUFRRyxJQUFSLEtBQWlCLFlBQWpCLEdBQWdDLElBQWhDLEdBQXVDLEtBQXhEO0FBQUEsUUFDSXFGLGVBQWU3UCxJQUFJRyxhQUFKLENBQWtCLEtBQWxCLENBRG5CO0FBQUEsUUFFSTJQLGVBQWU5UCxJQUFJRyxhQUFKLENBQWtCLEtBQWxCLENBRm5CO0FBQUEsUUFHSTRQLGFBSEo7QUFBQSxRQUlJekYsWUFBWUQsUUFBUUMsU0FKeEI7QUFBQSxRQUtJMEYsa0JBQWtCMUYsVUFBVTdNLFVBTGhDO0FBQUEsUUFNSXdTLGdCQUFnQjNGLFVBQVU0RixTQU45QjtBQUFBLFFBT0lDLGFBQWE3RixVQUFVbEksUUFQM0I7QUFBQSxRQVFJZ08sYUFBYUQsV0FBV25SLE1BUjVCO0FBQUEsUUFTSXFSLGNBVEo7QUFBQSxRQVVJQyxjQUFjQyxnQkFWbEI7QUFBQSxRQVdJQyxPQUFPLEtBWFg7QUFZQSxRQUFJM0QsVUFBSixFQUFnQjtBQUFFNEQ7QUFBc0I7QUFDeEMsUUFBSWhCLFFBQUosRUFBYztBQUFFbkYsZ0JBQVV4SSxTQUFWLElBQXVCLFlBQXZCO0FBQXNDOztBQUV0RDtBQUNBLFFBQUkrSSxZQUFZUixRQUFRUSxTQUF4QjtBQUFBLFFBQ0lELGFBQWE4RixVQUFVLFlBQVYsQ0FEakI7QUFBQSxRQUVJL0YsY0FBYytGLFVBQVUsYUFBVixDQUZsQjtBQUFBLFFBR0loRyxTQUFTZ0csVUFBVSxRQUFWLENBSGI7QUFBQSxRQUlJQyxXQUFXQyxrQkFKZjtBQUFBLFFBS0k1RixTQUFTMEYsVUFBVSxRQUFWLENBTGI7QUFBQSxRQU1JakcsUUFBUSxDQUFDSSxTQUFELEdBQWE3SSxLQUFLNk8sS0FBTCxDQUFXSCxVQUFVLE9BQVYsQ0FBWCxDQUFiLEdBQThDLENBTjFEO0FBQUEsUUFPSTNGLFVBQVUyRixVQUFVLFNBQVYsQ0FQZDtBQUFBLFFBUUk1RixjQUFjVCxRQUFRUyxXQUFSLElBQXVCVCxRQUFReUcsdUJBUmpEO0FBQUEsUUFTSW5GLFlBQVkrRSxVQUFVLFdBQVYsQ0FUaEI7QUFBQSxRQVVJOUUsUUFBUThFLFVBQVUsT0FBVixDQVZaO0FBQUEsUUFXSS9ELFNBQVN0QyxRQUFRc0MsTUFYckI7QUFBQSxRQVlJRCxPQUFPQyxTQUFTLEtBQVQsR0FBaUJ0QyxRQUFRcUMsSUFacEM7QUFBQSxRQWFJRSxhQUFhOEQsVUFBVSxZQUFWLENBYmpCO0FBQUEsUUFjSXpGLFdBQVd5RixVQUFVLFVBQVYsQ0FkZjtBQUFBLFFBZUl2RixlQUFldUYsVUFBVSxjQUFWLENBZm5CO0FBQUEsUUFnQkluRixNQUFNbUYsVUFBVSxLQUFWLENBaEJWO0FBQUEsUUFpQkkxRCxRQUFRMEQsVUFBVSxPQUFWLENBakJaO0FBQUEsUUFrQkl6RCxZQUFZeUQsVUFBVSxXQUFWLENBbEJoQjtBQUFBLFFBbUJJN0UsV0FBVzZFLFVBQVUsVUFBVixDQW5CZjtBQUFBLFFBb0JJM0Usa0JBQWtCMkUsVUFBVSxpQkFBVixDQXBCdEI7QUFBQSxRQXFCSXpFLGVBQWV5RSxVQUFVLGNBQVYsQ0FyQm5CO0FBQUEsUUFzQkl4RSxxQkFBcUJ3RSxVQUFVLG9CQUFWLENBdEJ6QjtBQUFBLFFBdUJJckUsNEJBQTRCcUUsVUFBVSwyQkFBVixDQXZCaEM7QUFBQSxRQXdCSXhOLFFBQVFKLGtCQXhCWjtBQUFBLFFBeUJJZ0ssV0FBV3pDLFFBQVF5QyxRQXpCdkI7QUFBQSxRQTBCSUMsbUJBQW1CMUMsUUFBUTBDLGdCQTFCL0I7QUFBQSxRQTJCSWdFLGNBM0JKO0FBQUEsUUEyQm9CO0FBQ2hCQyxvQkFBZ0IsRUE1QnBCO0FBQUEsUUE2QklDLGFBQWF2RSxPQUFPd0Usc0JBQVAsR0FBZ0MsQ0E3QmpEO0FBQUEsUUE4QklDLGdCQUFnQixDQUFDMUIsUUFBRCxHQUFZVyxhQUFhYSxVQUF6QixHQUFzQ2IsYUFBYWEsYUFBYSxDQTlCcEY7QUFBQSxRQStCSUcsbUJBQW1CLENBQUN4RyxjQUFjQyxTQUFmLEtBQTZCLENBQUM2QixJQUE5QixHQUFxQyxJQUFyQyxHQUE0QyxLQS9CbkU7QUFBQSxRQWdDSTJFLGdCQUFnQnpHLGFBQWEwRyxrQkFBYixHQUFrQyxJQWhDdEQ7QUFBQSxRQWlDSUMsNkJBQThCLENBQUM5QixRQUFELElBQWEsQ0FBQy9DLElBQWYsR0FBdUIsSUFBdkIsR0FBOEIsS0FqQy9EOztBQWtDSTtBQUNBOEUsb0JBQWdCNUIsYUFBYSxNQUFiLEdBQXNCLEtBbkMxQztBQUFBLFFBb0NJNkIsa0JBQWtCLEVBcEN0QjtBQUFBLFFBcUNJQyxtQkFBbUIsRUFyQ3ZCOztBQXNDSTtBQUNBQyxrQkFBZSxZQUFZO0FBQ3pCLFVBQUkvRyxVQUFKLEVBQWdCO0FBQ2QsZUFBTyxZQUFXO0FBQUUsaUJBQU9JLFVBQVUsQ0FBQzBCLElBQVgsR0FBa0IwRCxhQUFhLENBQS9CLEdBQW1DcE8sS0FBSzRQLElBQUwsQ0FBVSxDQUFFUCxhQUFGLElBQW1CekcsYUFBYUYsTUFBaEMsQ0FBVixDQUExQztBQUErRixTQUFuSDtBQUNELE9BRkQsTUFFTyxJQUFJRyxTQUFKLEVBQWU7QUFDcEIsZUFBTyxZQUFXO0FBQ2hCLGVBQUssSUFBSTlMLElBQUlvUyxhQUFiLEVBQTRCcFMsR0FBNUIsR0FBa0M7QUFDaEMsZ0JBQUlnUyxlQUFlaFMsQ0FBZixLQUFxQixDQUFFc1MsYUFBM0IsRUFBMEM7QUFBRSxxQkFBT3RTLENBQVA7QUFBVztBQUN4RDtBQUNGLFNBSkQ7QUFLRCxPQU5NLE1BTUE7QUFDTCxlQUFPLFlBQVc7QUFDaEIsY0FBSWlNLFVBQVV5RSxRQUFWLElBQXNCLENBQUMvQyxJQUEzQixFQUFpQztBQUMvQixtQkFBTzBELGFBQWEsQ0FBcEI7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBTzFELFFBQVErQyxRQUFSLEdBQW1Cek4sS0FBSzZQLEdBQUwsQ0FBUyxDQUFULEVBQVlWLGdCQUFnQm5QLEtBQUs0UCxJQUFMLENBQVVuSCxLQUFWLENBQTVCLENBQW5CLEdBQW1FMEcsZ0JBQWdCLENBQTFGO0FBQ0Q7QUFDRixTQU5EO0FBT0Q7QUFDRixLQWxCYSxFQXZDbEI7QUFBQSxRQTBESTdOLFFBQVF3TyxjQUFjcEIsVUFBVSxZQUFWLENBQWQsQ0ExRFo7QUFBQSxRQTJESXFCLGNBQWN6TyxLQTNEbEI7QUFBQSxRQTRESTBPLGVBQWVDLGlCQTVEbkI7QUFBQSxRQTZESUMsV0FBVyxDQTdEZjtBQUFBLFFBOERJQyxXQUFXLENBQUN0SCxTQUFELEdBQWE4RyxhQUFiLEdBQTZCLElBOUQ1Qzs7QUErREk7QUFDQVMsZUFoRUo7QUFBQSxRQWlFSWhGLDJCQUEyQi9DLFFBQVErQyx3QkFqRXZDO0FBQUEsUUFrRUlGLGFBQWE3QyxRQUFRNkMsVUFsRXpCO0FBQUEsUUFtRUltRix3QkFBd0JuRixhQUFhLEdBQWIsR0FBbUIsSUFuRS9DO0FBQUEsUUFvRUkvQyxVQUFVLEtBcEVkO0FBQUEsUUFxRUlvRCxTQUFTbEQsUUFBUWtELE1BckVyQjtBQUFBLFFBc0VJK0UsU0FBUyxJQUFJdkosTUFBSixFQXRFYjs7QUF1RUk7QUFDQXdKLDBCQUFzQixxQkFBcUJsSSxRQUFRRSxJQXhFdkQ7QUFBQSxRQXlFSWlJLFVBQVVsSSxVQUFVOUwsRUFBVixJQUFnQnFCLFlBekU5QjtBQUFBLFFBMEVJNFMsVUFBVS9CLFVBQVUsU0FBVixDQTFFZDtBQUFBLFFBMkVJZ0MsV0FBVyxLQTNFZjtBQUFBLFFBNEVJcEYsWUFBWWpELFFBQVFpRCxTQTVFeEI7QUFBQSxRQTZFSXFGLFNBQVNyRixhQUFhLENBQUN6QyxTQUFkLEdBQTBCK0gsV0FBMUIsR0FBd0MsS0E3RXJEO0FBQUEsUUE4RUlDLFNBQVMsS0E5RWI7QUFBQSxRQStFSUMsaUJBQWlCO0FBQ2YsZUFBU0MsZUFETTtBQUVmLGlCQUFXQztBQUZJLEtBL0VyQjtBQUFBLFFBbUZJQyxZQUFZO0FBQ1YsZUFBU0MsVUFEQztBQUVWLGlCQUFXQztBQUZELEtBbkZoQjtBQUFBLFFBdUZJQyxjQUFjO0FBQ1osbUJBQWFDLGNBREQ7QUFFWixrQkFBWUM7QUFGQSxLQXZGbEI7QUFBQSxRQTJGSUMsa0JBQWtCLEVBQUMsb0JBQW9CQyxrQkFBckIsRUEzRnRCO0FBQUEsUUE0RklDLHNCQUFzQixFQUFDLFdBQVdDLGlCQUFaLEVBNUYxQjtBQUFBLFFBNkZJQyxjQUFjO0FBQ1osb0JBQWNDLFVBREY7QUFFWixtQkFBYUMsU0FGRDtBQUdaLGtCQUFZQyxRQUhBO0FBSVoscUJBQWVBO0FBSkgsS0E3RmxCO0FBQUEsUUFrR09DLGFBQWE7QUFDZCxtQkFBYUgsVUFEQztBQUVkLG1CQUFhQyxTQUZDO0FBR2QsaUJBQVdDLFFBSEc7QUFJZCxvQkFBY0E7QUFKQSxLQWxHcEI7QUFBQSxRQXdHSUUsY0FBY0MsVUFBVSxVQUFWLENBeEdsQjtBQUFBLFFBeUdJQyxTQUFTRCxVQUFVLEtBQVYsQ0F6R2I7QUFBQSxRQTBHSXZJLGtCQUFrQmIsWUFBWSxJQUFaLEdBQW1CUixRQUFRcUIsZUExR2pEO0FBQUEsUUEyR0l5SSxjQUFjRixVQUFVLFVBQVYsQ0EzR2xCO0FBQUEsUUE0R0lHLFdBQVdILFVBQVUsT0FBVixDQTVHZjtBQUFBLFFBNkdJSSxlQUFlSixVQUFVLFdBQVYsQ0E3R25CO0FBQUEsUUE4R0lLLG1CQUFtQixrQkE5R3ZCO0FBQUEsUUErR0lDLG1CQUFtQixjQS9HdkI7QUFBQSxRQWdISUMsWUFBWTtBQUNWLGNBQVFDLFdBREU7QUFFVixlQUFTQztBQUZDLEtBaEhoQjtBQUFBLFFBb0hJQyxZQXBISjtBQUFBLFFBcUhJQyxpQkFySEo7QUFBQSxRQXNISUMsZ0JBQWdCeEssUUFBUWdELG9CQUFSLEtBQWlDLE9BQWpDLEdBQTJDLElBQTNDLEdBQWtELEtBdEh0RTs7QUF3SEE7QUFDQSxRQUFJMkcsV0FBSixFQUFpQjtBQUNmLFVBQUk1SSxvQkFBb0JmLFFBQVFlLGlCQUFoQztBQUFBLFVBQ0kwSix3QkFBd0J6SyxRQUFRZSxpQkFBUixHQUE0QmYsUUFBUWUsaUJBQVIsQ0FBMEI4RSxTQUF0RCxHQUFrRSxFQUQ5RjtBQUFBLFVBRUk3RSxhQUFhaEIsUUFBUWdCLFVBRnpCO0FBQUEsVUFHSUMsYUFBYWpCLFFBQVFpQixVQUh6QjtBQUFBLFVBSUl5SixpQkFBaUIxSyxRQUFRZ0IsVUFBUixHQUFxQmhCLFFBQVFnQixVQUFSLENBQW1CNkUsU0FBeEMsR0FBb0QsRUFKekU7QUFBQSxVQUtJOEUsaUJBQWlCM0ssUUFBUWlCLFVBQVIsR0FBcUJqQixRQUFRaUIsVUFBUixDQUFtQjRFLFNBQXhDLEdBQW9ELEVBTHpFO0FBQUEsVUFNSStFLFlBTko7QUFBQSxVQU9JQyxZQVBKO0FBUUQ7O0FBRUQ7QUFDQSxRQUFJaEIsTUFBSixFQUFZO0FBQ1YsVUFBSXpJLGVBQWVwQixRQUFRb0IsWUFBM0I7QUFBQSxVQUNJMEosbUJBQW1COUssUUFBUW9CLFlBQVIsR0FBdUJwQixRQUFRb0IsWUFBUixDQUFxQnlFLFNBQTVDLEdBQXdELEVBRC9FO0FBQUEsVUFFSWtGLFFBRko7QUFBQSxVQUdJQyxRQUFReEssWUFBWXVGLFVBQVosR0FBeUJrRixVQUhyQztBQUFBLFVBSUlDLGNBQWMsQ0FKbEI7QUFBQSxVQUtJQyxhQUFhLENBQUMsQ0FMbEI7QUFBQSxVQU1JQyxrQkFBa0JDLG9CQU50QjtBQUFBLFVBT0lDLHdCQUF3QkYsZUFQNUI7QUFBQSxVQVFJRyxpQkFBaUIsZ0JBUnJCO0FBQUEsVUFTSUMsU0FBUyxnQkFUYjtBQUFBLFVBVUlDLGdCQUFnQixrQkFWcEI7QUFXRDs7QUFFRDtBQUNBLFFBQUkzQixXQUFKLEVBQWlCO0FBQ2YsVUFBSW5JLG9CQUFvQjNCLFFBQVEyQixpQkFBUixLQUE4QixTQUE5QixHQUEwQyxDQUExQyxHQUE4QyxDQUFDLENBQXZFO0FBQUEsVUFDSUcsaUJBQWlCOUIsUUFBUThCLGNBRDdCO0FBQUEsVUFFSTRKLHFCQUFxQjFMLFFBQVE4QixjQUFSLEdBQXlCOUIsUUFBUThCLGNBQVIsQ0FBdUIrRCxTQUFoRCxHQUE0RCxFQUZyRjtBQUFBLFVBR0k4RixzQkFBc0IsQ0FBQyxzQ0FBRCxFQUF5QyxtQkFBekMsQ0FIMUI7QUFBQSxVQUlJQyxhQUpKO0FBQUEsVUFLSUMsU0FMSjtBQUFBLFVBTUlDLG1CQU5KO0FBQUEsVUFPSUMsa0JBUEo7QUFBQSxVQVFJQyx3QkFSSjtBQVNEOztBQUVELFFBQUlqQyxZQUFZQyxZQUFoQixFQUE4QjtBQUM1QixVQUFJaUMsZUFBZSxFQUFuQjtBQUFBLFVBQ0lDLGVBQWUsRUFEbkI7QUFBQSxVQUVJQyxhQUZKO0FBQUEsVUFHSUMsSUFISjtBQUFBLFVBSUlDLElBSko7QUFBQSxVQUtJQyxXQUFXLEtBTGY7QUFBQSxVQU1JQyxRQU5KO0FBQUEsVUFPSUMsVUFBVWpILGFBQ1IsVUFBU2tILENBQVQsRUFBWUMsQ0FBWixFQUFlO0FBQUUsZUFBT0QsRUFBRTlTLENBQUYsR0FBTStTLEVBQUUvUyxDQUFmO0FBQW1CLE9BRDVCLEdBRVIsVUFBUzhTLENBQVQsRUFBWUMsQ0FBWixFQUFlO0FBQUUsZUFBT0QsRUFBRS9TLENBQUYsR0FBTWdULEVBQUVoVCxDQUFmO0FBQW1CLE9BVDFDO0FBVUQ7O0FBRUQ7QUFDQSxRQUFJLENBQUM4RyxTQUFMLEVBQWdCO0FBQUVtTSwrQkFBeUJ2RSxXQUFXRSxNQUFwQztBQUE4Qzs7QUFFaEUsUUFBSWhFLFNBQUosRUFBZTtBQUNiNkMsc0JBQWdCN0MsU0FBaEI7QUFDQThDLHdCQUFrQixXQUFsQjs7QUFFQSxVQUFJN0MsZUFBSixFQUFxQjtBQUNuQjZDLDJCQUFtQjdCLGFBQWEsS0FBYixHQUFxQixVQUF4QztBQUNBOEIsMkJBQW1COUIsYUFBYSxhQUFiLEdBQTZCLFFBQWhEO0FBQ0QsT0FIRCxNQUdPO0FBQ0w2QiwyQkFBbUI3QixhQUFhLElBQWIsR0FBb0IsSUFBdkM7QUFDQThCLDJCQUFtQixHQUFuQjtBQUNEO0FBRUY7O0FBRUQsUUFBSWpDLFFBQUosRUFBYztBQUFFbkYsZ0JBQVV4SSxTQUFWLEdBQXNCd0ksVUFBVXhJLFNBQVYsQ0FBb0JQLE9BQXBCLENBQTRCLFdBQTVCLEVBQXlDLEVBQXpDLENBQXRCO0FBQXFFO0FBQ3JGMFY7QUFDQUM7QUFDQUM7O0FBRUE7QUFDQSxhQUFTSCx3QkFBVCxDQUFtQ0ksU0FBbkMsRUFBOEM7QUFDNUMsVUFBSUEsU0FBSixFQUFlO0FBQ2JuTSxtQkFBV00sTUFBTXlCLFFBQVFDLFlBQVl0QixZQUFZRSxXQUFXSyxxQkFBcUJHLDRCQUE0QixLQUE3RztBQUNEO0FBQ0Y7O0FBRUQsYUFBUzRGLGVBQVQsR0FBNEI7QUFDMUIsVUFBSW9GLE1BQU01SCxXQUFXbk0sUUFBUTJOLFVBQW5CLEdBQWdDM04sS0FBMUM7QUFDQSxhQUFPK1QsTUFBTSxDQUFiLEVBQWdCO0FBQUVBLGVBQU9qSCxVQUFQO0FBQW9CO0FBQ3RDLGFBQU9pSCxNQUFJakgsVUFBSixHQUFpQixDQUF4QjtBQUNEOztBQUVELGFBQVMwQixhQUFULENBQXdCd0YsR0FBeEIsRUFBNkI7QUFDM0JBLFlBQU1BLE1BQU10VixLQUFLNlAsR0FBTCxDQUFTLENBQVQsRUFBWTdQLEtBQUs4SCxHQUFMLENBQVM0QyxPQUFPMEQsYUFBYSxDQUFwQixHQUF3QkEsYUFBYTNGLEtBQTlDLEVBQXFENk0sR0FBckQsQ0FBWixDQUFOLEdBQStFLENBQXJGO0FBQ0EsYUFBTzdILFdBQVc2SCxNQUFNckcsVUFBakIsR0FBOEJxRyxHQUFyQztBQUNEOztBQUVELGFBQVNDLFdBQVQsQ0FBc0J4WSxDQUF0QixFQUF5QjtBQUN2QixVQUFJQSxLQUFLLElBQVQsRUFBZTtBQUFFQSxZQUFJdUUsS0FBSjtBQUFZOztBQUU3QixVQUFJbU0sUUFBSixFQUFjO0FBQUUxUSxhQUFLa1MsVUFBTDtBQUFrQjtBQUNsQyxhQUFPbFMsSUFBSSxDQUFYLEVBQWM7QUFBRUEsYUFBS3FSLFVBQUw7QUFBa0I7O0FBRWxDLGFBQU9wTyxLQUFLNk8sS0FBTCxDQUFXOVIsSUFBRXFSLFVBQWIsQ0FBUDtBQUNEOztBQUVELGFBQVNzRixrQkFBVCxHQUErQjtBQUM3QixVQUFJOEIsV0FBV0QsYUFBZjtBQUFBLFVBQ0l0VyxNQURKOztBQUdBQSxlQUFTeUssa0JBQWtCOEwsUUFBbEIsR0FDUDVNLGNBQWNDLFNBQWQsR0FBMEI3SSxLQUFLNFAsSUFBTCxDQUFVLENBQUM0RixXQUFXLENBQVosSUFBaUJuQyxLQUFqQixHQUF5QmpGLFVBQXpCLEdBQXNDLENBQWhELENBQTFCLEdBQ0lwTyxLQUFLNk8sS0FBTCxDQUFXMkcsV0FBVy9NLEtBQXRCLENBRk47O0FBSUE7QUFDQSxVQUFJLENBQUNpQyxJQUFELElBQVMrQyxRQUFULElBQXFCbk0sVUFBVTZPLFFBQW5DLEVBQTZDO0FBQUVsUixpQkFBU29VLFFBQVEsQ0FBakI7QUFBcUI7O0FBRXBFLGFBQU9wVSxNQUFQO0FBQ0Q7O0FBRUQsYUFBU3dXLFdBQVQsR0FBd0I7QUFDdEI7QUFDQSxVQUFJNU0sYUFBY0QsY0FBYyxDQUFDRSxXQUFqQyxFQUErQztBQUM3QyxlQUFPc0YsYUFBYSxDQUFwQjtBQUNGO0FBQ0MsT0FIRCxNQUdPO0FBQ0wsWUFBSWxQLE1BQU0wSixhQUFhLFlBQWIsR0FBNEIsT0FBdEM7QUFBQSxZQUNJbkcsTUFBTSxFQURWOztBQUdBLFlBQUltRyxjQUFjUCxRQUFRbkosR0FBUixJQUFla1AsVUFBakMsRUFBNkM7QUFBRTNMLGNBQUluSCxJQUFKLENBQVMrTSxRQUFRbkosR0FBUixDQUFUO0FBQXlCOztBQUV4RSxZQUFJMkwsVUFBSixFQUFnQjtBQUNkLGVBQUssSUFBSTZLLEVBQVQsSUFBZTdLLFVBQWYsRUFBMkI7QUFDekIsZ0JBQUl3SyxNQUFNeEssV0FBVzZLLEVBQVgsRUFBZXhXLEdBQWYsQ0FBVjtBQUNBLGdCQUFJbVcsUUFBUXpNLGNBQWN5TSxNQUFNakgsVUFBNUIsQ0FBSixFQUE2QztBQUFFM0wsa0JBQUluSCxJQUFKLENBQVMrWixHQUFUO0FBQWdCO0FBQ2hFO0FBQ0Y7O0FBRUQsWUFBSSxDQUFDNVMsSUFBSXpGLE1BQVQsRUFBaUI7QUFBRXlGLGNBQUluSCxJQUFKLENBQVMsQ0FBVDtBQUFjOztBQUVqQyxlQUFPMEUsS0FBSzRQLElBQUwsQ0FBVWhILGFBQWFFLGNBQWM5SSxLQUFLOEgsR0FBTCxDQUFTNk4sS0FBVCxDQUFlLElBQWYsRUFBcUJsVCxHQUFyQixDQUEzQixHQUF1RHpDLEtBQUs2UCxHQUFMLENBQVM4RixLQUFULENBQWUsSUFBZixFQUFxQmxULEdBQXJCLENBQWpFLENBQVA7QUFDRDtBQUNGOztBQUVELGFBQVN5TSxvQkFBVCxHQUFpQztBQUMvQixVQUFJMEcsV0FBV0gsYUFBZjtBQUFBLFVBQ0l4VyxTQUFTd08sV0FBV3pOLEtBQUs0UCxJQUFMLENBQVUsQ0FBQ2dHLFdBQVcsQ0FBWCxHQUFleEgsVUFBaEIsSUFBNEIsQ0FBdEMsQ0FBWCxHQUF1RHdILFdBQVcsQ0FBWCxHQUFleEgsVUFEbkY7QUFFQW5QLGVBQVNlLEtBQUs2UCxHQUFMLENBQVMrRixRQUFULEVBQW1CM1csTUFBbkIsQ0FBVDs7QUFFQSxhQUFPZ1QsVUFBVSxhQUFWLElBQTJCaFQsU0FBUyxDQUFwQyxHQUF3Q0EsTUFBL0M7QUFDRDs7QUFFRCxhQUFTc1AsY0FBVCxHQUEyQjtBQUN6QixhQUFPNVMsSUFBSWthLFVBQUosSUFBa0I3WCxJQUFJTSxlQUFKLENBQW9Cd1gsV0FBdEMsSUFBcUQ5WCxJQUFJRSxJQUFKLENBQVM0WCxXQUFyRTtBQUNEOztBQUVELGFBQVNDLGlCQUFULENBQTRCQyxHQUE1QixFQUFpQztBQUMvQixhQUFPQSxRQUFRLEtBQVIsR0FBZ0IsWUFBaEIsR0FBK0IsV0FBdEM7QUFDRDs7QUFFRCxhQUFTQyxjQUFULENBQXlCbFQsRUFBekIsRUFBNkI7QUFDM0IsVUFBSS9ELE1BQU1oQixJQUFJRyxhQUFKLENBQWtCLEtBQWxCLENBQVY7QUFBQSxVQUFvQytYLElBQXBDO0FBQUEsVUFBMEM3VyxLQUExQztBQUNBMEQsU0FBR25FLFdBQUgsQ0FBZUksR0FBZjtBQUNBa1gsYUFBT2xYLElBQUlrQixxQkFBSixFQUFQO0FBQ0FiLGNBQVE2VyxLQUFLQyxLQUFMLEdBQWFELEtBQUsvVixJQUExQjtBQUNBbkIsVUFBSXhELE1BQUo7QUFDQSxhQUFPNkQsU0FBUzRXLGVBQWVsVCxHQUFHdEgsVUFBbEIsQ0FBaEI7QUFDRDs7QUFFRCxhQUFTbVQsZ0JBQVQsR0FBNkI7QUFDM0IsVUFBSXJNLE1BQU1vRyxjQUFjQSxjQUFjLENBQWQsR0FBa0JELE1BQWhDLEdBQXlDLENBQW5EO0FBQ0EsYUFBT3VOLGVBQWVqSSxlQUFmLElBQWtDekwsR0FBekM7QUFDRDs7QUFFRCxhQUFTMFAsU0FBVCxDQUFvQnRPLElBQXBCLEVBQTBCO0FBQ3hCLFVBQUkwRSxRQUFRMUUsSUFBUixDQUFKLEVBQW1CO0FBQ2pCLGVBQU8sSUFBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUlrSCxVQUFKLEVBQWdCO0FBQ2QsZUFBSyxJQUFJNkssRUFBVCxJQUFlN0ssVUFBZixFQUEyQjtBQUN6QixnQkFBSUEsV0FBVzZLLEVBQVgsRUFBZS9SLElBQWYsQ0FBSixFQUEwQjtBQUFFLHFCQUFPLElBQVA7QUFBYztBQUMzQztBQUNGO0FBQ0QsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVMrSyxTQUFULENBQW9CL0ssSUFBcEIsRUFBMEJ5UyxFQUExQixFQUE4QjtBQUM1QixVQUFJQSxNQUFNLElBQVYsRUFBZ0I7QUFBRUEsYUFBSzlILFdBQUw7QUFBbUI7O0FBRXJDLFVBQUkzSyxTQUFTLE9BQVQsSUFBb0JpRixVQUF4QixFQUFvQztBQUNsQyxlQUFPNUksS0FBSzZPLEtBQUwsQ0FBVyxDQUFDRixXQUFXakcsTUFBWixLQUF1QkUsYUFBYUYsTUFBcEMsQ0FBWCxLQUEyRCxDQUFsRTtBQUVELE9BSEQsTUFHTztBQUNMLFlBQUl6SixTQUFTb0osUUFBUTFFLElBQVIsQ0FBYjs7QUFFQSxZQUFJa0gsVUFBSixFQUFnQjtBQUNkLGVBQUssSUFBSTZLLEVBQVQsSUFBZTdLLFVBQWYsRUFBMkI7QUFDekI7QUFDQSxnQkFBSXVMLE1BQU1DLFNBQVNYLEVBQVQsQ0FBVixFQUF3QjtBQUN0QixrQkFBSS9SLFFBQVFrSCxXQUFXNkssRUFBWCxDQUFaLEVBQTRCO0FBQUV6Vyx5QkFBUzRMLFdBQVc2SyxFQUFYLEVBQWUvUixJQUFmLENBQVQ7QUFBZ0M7QUFDL0Q7QUFDRjtBQUNGOztBQUVELFlBQUlBLFNBQVMsU0FBVCxJQUFzQjFFLFdBQVcsTUFBckMsRUFBNkM7QUFBRUEsbUJBQVN5UCxVQUFVLE9BQVYsQ0FBVDtBQUE4QjtBQUM3RSxZQUFJLENBQUNqQixRQUFELEtBQWM5SixTQUFTLFNBQVQsSUFBc0JBLFNBQVMsT0FBN0MsQ0FBSixFQUEyRDtBQUFFMUUsbUJBQVNlLEtBQUs2TyxLQUFMLENBQVc1UCxNQUFYLENBQVQ7QUFBOEI7O0FBRTNGLGVBQU9BLE1BQVA7QUFDRDtBQUNGOztBQUVELGFBQVNxWCxrQkFBVCxDQUE2QnZaLENBQTdCLEVBQWdDO0FBQzlCLGFBQU95UCxPQUNMQSxPQUFPLEdBQVAsR0FBYXpQLElBQUksR0FBakIsR0FBdUIsTUFBdkIsR0FBZ0NvUyxhQUFoQyxHQUFnRCxHQUQzQyxHQUVMcFMsSUFBSSxHQUFKLEdBQVVvUyxhQUFWLEdBQTBCLEdBRjVCO0FBR0Q7O0FBRUQsYUFBU29ILHFCQUFULENBQWdDQyxjQUFoQyxFQUFnREMsU0FBaEQsRUFBMkRDLGFBQTNELEVBQTBFQyxRQUExRSxFQUFvRkMsWUFBcEYsRUFBa0c7QUFDaEcsVUFBSTFYLE1BQU0sRUFBVjs7QUFFQSxVQUFJc1gsbUJBQW1CdlosU0FBdkIsRUFBa0M7QUFDaEMsWUFBSXNGLE1BQU1pVSxjQUFWO0FBQ0EsWUFBSUMsU0FBSixFQUFlO0FBQUVsVSxpQkFBT2tVLFNBQVA7QUFBbUI7QUFDcEN2WCxjQUFNME8sYUFDSixlQUFlckwsR0FBZixHQUFxQixPQUFyQixHQUErQmlVLGNBQS9CLEdBQWdELEtBRDVDLEdBRUosYUFBYUEsY0FBYixHQUE4QixPQUE5QixHQUF3Q2pVLEdBQXhDLEdBQThDLE9BRmhEO0FBR0QsT0FORCxNQU1PLElBQUlrVSxhQUFhLENBQUNDLGFBQWxCLEVBQWlDO0FBQ3RDLFlBQUlHLGdCQUFnQixNQUFNSixTQUFOLEdBQWtCLElBQXRDO0FBQUEsWUFDSUssTUFBTWxKLGFBQWFpSixnQkFBZ0IsTUFBN0IsR0FBc0MsT0FBT0EsYUFBUCxHQUF1QixJQUR2RTtBQUVBM1gsY0FBTSxlQUFlNFgsR0FBZixHQUFxQixHQUEzQjtBQUNEOztBQUVELFVBQUksQ0FBQ3JKLFFBQUQsSUFBYW1KLFlBQWIsSUFBNkIvSixrQkFBN0IsSUFBbUQ4SixRQUF2RCxFQUFpRTtBQUFFelgsZUFBTzZYLDJCQUEyQkosUUFBM0IsQ0FBUDtBQUE4QztBQUNqSCxhQUFPelgsR0FBUDtBQUNEOztBQUVELGFBQVM4WCxpQkFBVCxDQUE0Qk4sYUFBNUIsRUFBMkNELFNBQTNDLEVBQXNEUSxRQUF0RCxFQUFnRTtBQUM5RCxVQUFJUCxhQUFKLEVBQW1CO0FBQ2pCLGVBQU8sQ0FBQ0EsZ0JBQWdCRCxTQUFqQixJQUE4QnRILGFBQTlCLEdBQThDLElBQXJEO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTzNDLE9BQ0xBLE9BQU8sR0FBUCxHQUFhMkMsZ0JBQWdCLEdBQTdCLEdBQW1DLE1BQW5DLEdBQTRDOEgsUUFBNUMsR0FBdUQsR0FEbEQsR0FFTDlILGdCQUFnQixHQUFoQixHQUFzQjhILFFBQXRCLEdBQWlDLEdBRm5DO0FBR0Q7QUFDRjs7QUFFRCxhQUFTQyxrQkFBVCxDQUE2QlIsYUFBN0IsRUFBNENELFNBQTVDLEVBQXVEUSxRQUF2RCxFQUFpRTtBQUMvRCxVQUFJNVgsS0FBSjs7QUFFQSxVQUFJcVgsYUFBSixFQUFtQjtBQUNqQnJYLGdCQUFTcVgsZ0JBQWdCRCxTQUFqQixHQUE4QixJQUF0QztBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksQ0FBQ2hKLFFBQUwsRUFBZTtBQUFFd0oscUJBQVdqWCxLQUFLNk8sS0FBTCxDQUFXb0ksUUFBWCxDQUFYO0FBQWtDO0FBQ25ELFlBQUlFLFdBQVcxSixXQUFXMEIsYUFBWCxHQUEyQjhILFFBQTFDO0FBQ0E1WCxnQkFBUW1OLE9BQ05BLE9BQU8sVUFBUCxHQUFvQjJLLFFBQXBCLEdBQStCLEdBRHpCLEdBRU4sTUFBTUEsUUFBTixHQUFpQixHQUZuQjtBQUdEOztBQUVEOVgsY0FBUSxXQUFXQSxLQUFuQjs7QUFFQTtBQUNBLGFBQU84TCxXQUFXLE9BQVgsR0FBcUI5TCxRQUFRLEdBQTdCLEdBQW1DQSxRQUFRLGNBQWxEO0FBQ0Q7O0FBRUQsYUFBUytYLG1CQUFULENBQThCWCxTQUE5QixFQUF5QztBQUN2QyxVQUFJdlgsTUFBTSxFQUFWOztBQUVBO0FBQ0E7QUFDQSxVQUFJdVgsY0FBYyxLQUFsQixFQUF5QjtBQUN2QixZQUFJcFIsT0FBT3VJLGFBQWEsVUFBYixHQUEwQixTQUFyQztBQUFBLFlBQ0lrSixNQUFNbEosYUFBYSxPQUFiLEdBQXVCLFFBRGpDO0FBRUExTyxjQUFNbUcsT0FBUXlSLEdBQVIsR0FBYyxJQUFkLEdBQXFCTCxTQUFyQixHQUFpQyxLQUF2QztBQUNEOztBQUVELGFBQU92WCxHQUFQO0FBQ0Q7O0FBRUQsYUFBU21ZLFlBQVQsQ0FBdUJuYyxJQUF2QixFQUE2Qm9jLEdBQTdCLEVBQWtDO0FBQ2hDLFVBQUluUyxTQUFTakssS0FBS3FjLFNBQUwsQ0FBZSxDQUFmLEVBQWtCcmMsS0FBSzhCLE1BQUwsR0FBY3NhLEdBQWhDLEVBQXFDM1IsV0FBckMsRUFBYjtBQUNBLFVBQUlSLE1BQUosRUFBWTtBQUFFQSxpQkFBUyxNQUFNQSxNQUFOLEdBQWUsR0FBeEI7QUFBOEI7O0FBRTVDLGFBQU9BLE1BQVA7QUFDRDs7QUFFRCxhQUFTNFIsMEJBQVQsQ0FBcUNuTixLQUFyQyxFQUE0QztBQUMxQyxhQUFPeU4sYUFBYXhLLGtCQUFiLEVBQWlDLEVBQWpDLElBQXVDLHNCQUF2QyxHQUFnRWpELFFBQVEsSUFBeEUsR0FBK0UsSUFBdEY7QUFDRDs7QUFFRCxhQUFTNE4seUJBQVQsQ0FBb0M1TixLQUFwQyxFQUEyQztBQUN6QyxhQUFPeU4sYUFBYXRLLGlCQUFiLEVBQWdDLEVBQWhDLElBQXNDLHFCQUF0QyxHQUE4RG5ELFFBQVEsSUFBdEUsR0FBNkUsSUFBcEY7QUFDRDs7QUFFRCxhQUFTcUwsYUFBVCxHQUEwQjtBQUN4QixVQUFJd0MsYUFBYSxXQUFqQjtBQUFBLFVBQ0lDLGFBQWEsV0FEakI7QUFBQSxVQUVJQyxZQUFZMUYsVUFBVSxRQUFWLENBRmhCOztBQUlBcEUsbUJBQWEvTixTQUFiLEdBQXlCMlgsVUFBekI7QUFDQTNKLG1CQUFhaE8sU0FBYixHQUF5QjRYLFVBQXpCO0FBQ0E3SixtQkFBYXJSLEVBQWIsR0FBa0JnVSxVQUFVLEtBQTVCO0FBQ0ExQyxtQkFBYXRSLEVBQWIsR0FBa0JnVSxVQUFVLEtBQTVCOztBQUVBO0FBQ0EsVUFBSWxJLFVBQVU5TCxFQUFWLEtBQWlCLEVBQXJCLEVBQXlCO0FBQUU4TCxrQkFBVTlMLEVBQVYsR0FBZWdVLE9BQWY7QUFBeUI7QUFDcERELDZCQUF1QjlELG9CQUFvQjVELFNBQXBCLEdBQWdDLGVBQWhDLEdBQWtELGtCQUF6RTtBQUNBMEgsNkJBQXVCL0QsT0FBTyxXQUFQLEdBQXFCLGNBQTVDO0FBQ0EsVUFBSTNELFNBQUosRUFBZTtBQUFFMEgsK0JBQXVCLGdCQUF2QjtBQUEwQztBQUMzREEsNkJBQXVCLFVBQVVsSSxRQUFRRyxJQUF6QztBQUNBRixnQkFBVXhJLFNBQVYsSUFBdUJ5USxtQkFBdkI7O0FBRUE7QUFDQSxVQUFJOUMsUUFBSixFQUFjO0FBQ1pNLHdCQUFnQi9QLElBQUlHLGFBQUosQ0FBa0IsS0FBbEIsQ0FBaEI7QUFDQTRQLHNCQUFjdlIsRUFBZCxHQUFtQmdVLFVBQVUsS0FBN0I7QUFDQXpDLHNCQUFjak8sU0FBZCxHQUEwQixTQUExQjs7QUFFQStOLHFCQUFhalAsV0FBYixDQUF5Qm1QLGFBQXpCO0FBQ0FBLHNCQUFjblAsV0FBZCxDQUEwQmtQLFlBQTFCO0FBQ0QsT0FQRCxNQU9PO0FBQ0xELHFCQUFhalAsV0FBYixDQUF5QmtQLFlBQXpCO0FBQ0Q7O0FBRUQsVUFBSWxELFVBQUosRUFBZ0I7QUFDZCxZQUFJZ04sS0FBSzdKLGdCQUFnQkEsYUFBaEIsR0FBZ0NELFlBQXpDO0FBQ0E4SixXQUFHOVgsU0FBSCxJQUFnQixTQUFoQjtBQUNEOztBQUVEa08sc0JBQWdCcEksWUFBaEIsQ0FBNkJpSSxZQUE3QixFQUEyQ3ZGLFNBQTNDO0FBQ0F3RixtQkFBYWxQLFdBQWIsQ0FBeUIwSixTQUF6Qjs7QUFFQTtBQUNBO0FBQ0E5RixjQUFRMkwsVUFBUixFQUFvQixVQUFTeEssSUFBVCxFQUFlNUcsQ0FBZixFQUFrQjtBQUNwQ21HLGlCQUFTUyxJQUFULEVBQWUsVUFBZjtBQUNBLFlBQUksQ0FBQ0EsS0FBS25ILEVBQVYsRUFBYztBQUFFbUgsZUFBS25ILEVBQUwsR0FBVWdVLFVBQVUsT0FBVixHQUFvQnpULENBQTlCO0FBQWtDO0FBQ2xELFlBQUksQ0FBQzBRLFFBQUQsSUFBYWpELGFBQWpCLEVBQWdDO0FBQUV0SCxtQkFBU1MsSUFBVCxFQUFlNkcsYUFBZjtBQUFnQztBQUNsRTVHLGlCQUFTRCxJQUFULEVBQWU7QUFDYix5QkFBZSxNQURGO0FBRWIsc0JBQVk7QUFGQyxTQUFmO0FBSUQsT0FSRDs7QUFVQTtBQUNBO0FBQ0E7QUFDQSxVQUFJc0wsVUFBSixFQUFnQjtBQUNkLFlBQUk0SSxpQkFBaUI3WixJQUFJOFosc0JBQUosRUFBckI7QUFBQSxZQUNJQyxnQkFBZ0IvWixJQUFJOFosc0JBQUosRUFEcEI7O0FBR0EsYUFBSyxJQUFJM1QsSUFBSThLLFVBQWIsRUFBeUI5SyxHQUF6QixHQUErQjtBQUM3QixjQUFJbVQsTUFBTW5ULElBQUVpSyxVQUFaO0FBQUEsY0FDSTRKLGFBQWE3SixXQUFXbUosR0FBWCxFQUFnQlcsU0FBaEIsQ0FBMEIsSUFBMUIsQ0FEakI7QUFFQWhVLHNCQUFZK1QsVUFBWixFQUF3QixJQUF4QjtBQUNBRCx3QkFBY25TLFlBQWQsQ0FBMkJvUyxVQUEzQixFQUF1Q0QsY0FBY0csVUFBckQ7O0FBRUEsY0FBSXpLLFFBQUosRUFBYztBQUNaLGdCQUFJMEssWUFBWWhLLFdBQVdDLGFBQWEsQ0FBYixHQUFpQmtKLEdBQTVCLEVBQWlDVyxTQUFqQyxDQUEyQyxJQUEzQyxDQUFoQjtBQUNBaFUsd0JBQVlrVSxTQUFaLEVBQXVCLElBQXZCO0FBQ0FOLDJCQUFlalosV0FBZixDQUEyQnVaLFNBQTNCO0FBQ0Q7QUFDRjs7QUFFRDdQLGtCQUFVMUMsWUFBVixDQUF1QmlTLGNBQXZCLEVBQXVDdlAsVUFBVTRQLFVBQWpEO0FBQ0E1UCxrQkFBVTFKLFdBQVYsQ0FBc0JtWixhQUF0QjtBQUNBNUoscUJBQWE3RixVQUFVbEksUUFBdkI7QUFDRDtBQUVGOztBQUVELGFBQVMrVSxtQkFBVCxHQUFnQztBQUM5QjtBQUNBLFVBQUlsRCxVQUFVLFlBQVYsS0FBMkJwSixTQUEzQixJQUF3QyxDQUFDK0UsVUFBN0MsRUFBeUQ7QUFDdkQsWUFBSXdLLE9BQU85UCxVQUFVK1AsZ0JBQVYsQ0FBMkIsS0FBM0IsQ0FBWDs7QUFFQTtBQUNBN1YsZ0JBQVE0VixJQUFSLEVBQWMsVUFBU0UsR0FBVCxFQUFjO0FBQzFCLGNBQUlDLE1BQU1ELElBQUlDLEdBQWQ7O0FBRUEsY0FBSUEsT0FBT0EsSUFBSW5iLE9BQUosQ0FBWSxZQUFaLElBQTRCLENBQXZDLEVBQTBDO0FBQ3hDc0osc0JBQVU0UixHQUFWLEVBQWU5RixTQUFmO0FBQ0E4RixnQkFBSUMsR0FBSixHQUFVLEVBQVY7QUFDQUQsZ0JBQUlDLEdBQUosR0FBVUEsR0FBVjtBQUNBclYscUJBQVNvVixHQUFULEVBQWMsU0FBZDtBQUNELFdBTEQsTUFLTyxJQUFJLENBQUN4TixRQUFMLEVBQWU7QUFDcEIwTixzQkFBVUYsR0FBVjtBQUNEO0FBQ0YsU0FYRDs7QUFhQTtBQUNBemMsWUFBSSxZQUFVO0FBQUU0YywwQkFBZ0JwVSxrQkFBa0IrVCxJQUFsQixDQUFoQixFQUF5QyxZQUFXO0FBQUV6RiwyQkFBZSxJQUFmO0FBQXNCLFdBQTVFO0FBQWdGLFNBQWhHOztBQUVBO0FBQ0EsWUFBSSxDQUFDOUosU0FBRCxJQUFjK0UsVUFBbEIsRUFBOEI7QUFBRXdLLGlCQUFPTSxjQUFjcFgsS0FBZCxFQUFxQnRCLEtBQUs4SCxHQUFMLENBQVN4RyxRQUFRbUgsS0FBUixHQUFnQixDQUF6QixFQUE0QjBHLGdCQUFnQixDQUE1QyxDQUFyQixDQUFQO0FBQThFOztBQUU5R3JFLG1CQUFXNk4sK0JBQVgsR0FBNkM5YyxJQUFJLFlBQVU7QUFBRTRjLDBCQUFnQnBVLGtCQUFrQitULElBQWxCLENBQWhCLEVBQXlDTyw2QkFBekM7QUFBMEUsU0FBMUYsQ0FBN0M7QUFFRCxPQXpCRCxNQXlCTztBQUNMO0FBQ0EsWUFBSWxMLFFBQUosRUFBYztBQUFFbUw7QUFBK0I7O0FBRS9DO0FBQ0FDO0FBQ0FDO0FBQ0Q7QUFDRjs7QUFFRCxhQUFTSCw2QkFBVCxHQUEwQztBQUN4QyxVQUFJOVAsU0FBSixFQUFlO0FBQ2I7QUFDQSxZQUFJeU8sTUFBTTVNLE9BQU9wSixLQUFQLEdBQWU4TSxhQUFhLENBQXRDO0FBQ0EsU0FBQyxTQUFTMkssc0JBQVQsR0FBa0M7QUFDakM1SyxxQkFBV21KLE1BQU0sQ0FBakIsRUFBb0JwWCxxQkFBcEIsR0FBNENpVyxLQUE1QyxDQUFrRDZDLE9BQWxELENBQTBELENBQTFELE1BQWlFN0ssV0FBV21KLEdBQVgsRUFBZ0JwWCxxQkFBaEIsR0FBd0NDLElBQXhDLENBQTZDNlksT0FBN0MsQ0FBcUQsQ0FBckQsQ0FBakUsR0FDQUMseUJBREEsR0FFQTljLFdBQVcsWUFBVTtBQUFFNGM7QUFBMkIsV0FBbEQsRUFBb0QsRUFBcEQsQ0FGQTtBQUdELFNBSkQ7QUFLRCxPQVJELE1BUU87QUFDTEU7QUFDRDtBQUNGOztBQUdELGFBQVNBLHVCQUFULEdBQW9DO0FBQ2xDO0FBQ0EsVUFBSSxDQUFDckwsVUFBRCxJQUFlL0UsU0FBbkIsRUFBOEI7QUFDNUJxUTs7QUFFQSxZQUFJclEsU0FBSixFQUFlO0FBQ2J3RywwQkFBZ0JDLGtCQUFoQjtBQUNBLGNBQUloRSxTQUFKLEVBQWU7QUFBRXFGLHFCQUFTQyxXQUFUO0FBQXVCO0FBQ3hDVCxxQkFBV1IsYUFBWCxDQUhhLENBR2E7QUFDMUJxRixtQ0FBeUJ2RSxXQUFXRSxNQUFwQztBQUNELFNBTEQsTUFLTztBQUNMd0k7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBSTFMLFFBQUosRUFBYztBQUFFbUw7QUFBK0I7O0FBRS9DO0FBQ0FDO0FBQ0FDO0FBQ0Q7O0FBRUQsYUFBUzVELFNBQVQsR0FBc0I7QUFDcEI7QUFDQTtBQUNBLFVBQUksQ0FBQ3pILFFBQUwsRUFBZTtBQUNiLGFBQUssSUFBSTFRLElBQUl1RSxLQUFSLEVBQWVzQixJQUFJdEIsUUFBUXRCLEtBQUs4SCxHQUFMLENBQVNzRyxVQUFULEVBQXFCM0YsS0FBckIsQ0FBaEMsRUFBNkQxTCxJQUFJNkYsQ0FBakUsRUFBb0U3RixHQUFwRSxFQUF5RTtBQUN2RSxjQUFJNEcsT0FBT3dLLFdBQVdwUixDQUFYLENBQVg7QUFDQTRHLGVBQUtsRixLQUFMLENBQVcwQixJQUFYLEdBQWtCLENBQUNwRCxJQUFJdUUsS0FBTCxJQUFjLEdBQWQsR0FBb0JtSCxLQUFwQixHQUE0QixHQUE5QztBQUNBdkYsbUJBQVNTLElBQVQsRUFBZTJHLFNBQWY7QUFDQWxILHNCQUFZTyxJQUFaLEVBQWtCNkcsYUFBbEI7QUFDRDtBQUNGOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQUlvRCxVQUFKLEVBQWdCO0FBQ2QsWUFBSW5CLG9CQUFvQjVELFNBQXhCLEVBQW1DO0FBQ2pDMUgscUJBQVdELEtBQVgsRUFBa0IsTUFBTXNQLE9BQU4sR0FBZ0IsY0FBbEMsRUFBa0QsZUFBZTdVLElBQUlpRixnQkFBSixDQUFxQnVOLFdBQVcsQ0FBWCxDQUFyQixFQUFvQ2lMLFFBQW5ELEdBQThELEdBQWhILEVBQXFIeFgsa0JBQWtCVixLQUFsQixDQUFySDtBQUNBQyxxQkFBV0QsS0FBWCxFQUFrQixNQUFNc1AsT0FBeEIsRUFBaUMsY0FBakMsRUFBaUQ1TyxrQkFBa0JWLEtBQWxCLENBQWpEO0FBQ0QsU0FIRCxNQUdPLElBQUl1TSxRQUFKLEVBQWM7QUFDbkJqTCxrQkFBUTJMLFVBQVIsRUFBb0IsVUFBVWtMLEtBQVYsRUFBaUJ0YyxDQUFqQixFQUFvQjtBQUN0Q3NjLGtCQUFNNWEsS0FBTixDQUFZNmEsVUFBWixHQUF5QmhELG1CQUFtQnZaLENBQW5CLENBQXpCO0FBQ0QsV0FGRDtBQUdEO0FBQ0Y7O0FBR0Q7QUFDQSxVQUFJMlAsS0FBSixFQUFXO0FBQ1Q7QUFDQSxZQUFJRyxrQkFBSixFQUF3QjtBQUN0QixjQUFJM04sTUFBTTZPLGlCQUFpQjFGLFFBQVF1QyxVQUF6QixHQUFzQ21NLDJCQUEyQjFPLFFBQVF1QixLQUFuQyxDQUF0QyxHQUFrRixFQUE1RjtBQUNBekkscUJBQVdELEtBQVgsRUFBa0IsTUFBTXNQLE9BQU4sR0FBZ0IsS0FBbEMsRUFBeUN0UixHQUF6QyxFQUE4QzBDLGtCQUFrQlYsS0FBbEIsQ0FBOUM7QUFDRDs7QUFFRDtBQUNBaEMsY0FBTXFYLHNCQUFzQmxPLFFBQVFNLFdBQTlCLEVBQTJDTixRQUFRSyxNQUFuRCxFQUEyREwsUUFBUU8sVUFBbkUsRUFBK0VQLFFBQVF1QixLQUF2RixFQUE4RnZCLFFBQVF1QyxVQUF0RyxDQUFOO0FBQ0F6SixtQkFBV0QsS0FBWCxFQUFrQixNQUFNc1AsT0FBTixHQUFnQixLQUFsQyxFQUF5Q3RSLEdBQXpDLEVBQThDMEMsa0JBQWtCVixLQUFsQixDQUE5Qzs7QUFFQTtBQUNBLFlBQUl1TSxRQUFKLEVBQWM7QUFDWnZPLGdCQUFNME8sY0FBYyxDQUFDL0UsU0FBZixHQUEyQixXQUFXbU8sa0JBQWtCM08sUUFBUU8sVUFBMUIsRUFBc0NQLFFBQVFLLE1BQTlDLEVBQXNETCxRQUFRSSxLQUE5RCxDQUFYLEdBQWtGLEdBQTdHLEdBQW1ILEVBQXpIO0FBQ0EsY0FBSW9FLGtCQUFKLEVBQXdCO0FBQUUzTixtQkFBTzZYLDJCQUEyQm5OLEtBQTNCLENBQVA7QUFBMkM7QUFDckV6SSxxQkFBV0QsS0FBWCxFQUFrQixNQUFNc1AsT0FBeEIsRUFBaUN0UixHQUFqQyxFQUFzQzBDLGtCQUFrQlYsS0FBbEIsQ0FBdEM7QUFDRDs7QUFFRDtBQUNBaEMsY0FBTTBPLGNBQWMsQ0FBQy9FLFNBQWYsR0FBMkJxTyxtQkFBbUI3TyxRQUFRTyxVQUEzQixFQUF1Q1AsUUFBUUssTUFBL0MsRUFBdURMLFFBQVFJLEtBQS9ELENBQTNCLEdBQW1HLEVBQXpHO0FBQ0EsWUFBSUosUUFBUUssTUFBWixFQUFvQjtBQUFFeEosaUJBQU9rWSxvQkFBb0IvTyxRQUFRSyxNQUE1QixDQUFQO0FBQTZDO0FBQ25FO0FBQ0EsWUFBSSxDQUFDK0UsUUFBTCxFQUFlO0FBQ2IsY0FBSVosa0JBQUosRUFBd0I7QUFBRTNOLG1CQUFPNlgsMkJBQTJCbk4sS0FBM0IsQ0FBUDtBQUEyQztBQUNyRSxjQUFJbUQsaUJBQUosRUFBdUI7QUFBRTdOLG1CQUFPc1ksMEJBQTBCNU4sS0FBMUIsQ0FBUDtBQUEwQztBQUNwRTtBQUNELFlBQUkxSyxHQUFKLEVBQVM7QUFBRWlDLHFCQUFXRCxLQUFYLEVBQWtCLE1BQU1zUCxPQUFOLEdBQWdCLGNBQWxDLEVBQWtEdFIsR0FBbEQsRUFBdUQwQyxrQkFBa0JWLEtBQWxCLENBQXZEO0FBQW1GOztBQUVoRztBQUNBO0FBQ0E7QUFDQTtBQUNDLE9BaENELE1BZ0NPO0FBQ0w7QUFDQXFZOztBQUVBO0FBQ0F6TCxxQkFBYXJQLEtBQWIsQ0FBbUJpQyxPQUFuQixHQUE2QjZWLHNCQUFzQjVOLFdBQXRCLEVBQW1DRCxNQUFuQyxFQUEyQ0UsVUFBM0MsRUFBdURnQyxVQUF2RCxDQUE3Qjs7QUFFQTtBQUNBLFlBQUk2QyxZQUFZRyxVQUFaLElBQTBCLENBQUMvRSxTQUEvQixFQUEwQztBQUN4Q1Asb0JBQVU3SixLQUFWLENBQWdCWSxLQUFoQixHQUF3QjJYLGtCQUFrQnBPLFVBQWxCLEVBQThCRixNQUE5QixFQUFzQ0QsS0FBdEMsQ0FBeEI7QUFDRDs7QUFFRDtBQUNBLFlBQUl2SixNQUFNME8sY0FBYyxDQUFDL0UsU0FBZixHQUEyQnFPLG1CQUFtQnRPLFVBQW5CLEVBQStCRixNQUEvQixFQUF1Q0QsS0FBdkMsQ0FBM0IsR0FBMkUsRUFBckY7QUFDQSxZQUFJQyxNQUFKLEVBQVk7QUFBRXhKLGlCQUFPa1ksb0JBQW9CMU8sTUFBcEIsQ0FBUDtBQUFxQzs7QUFFbkQ7QUFDQSxZQUFJeEosR0FBSixFQUFTO0FBQUVpQyxxQkFBV0QsS0FBWCxFQUFrQixNQUFNc1AsT0FBTixHQUFnQixjQUFsQyxFQUFrRHRSLEdBQWxELEVBQXVEMEMsa0JBQWtCVixLQUFsQixDQUF2RDtBQUFtRjtBQUMvRjs7QUFFRDtBQUNBLFVBQUkySixjQUFjNkIsS0FBbEIsRUFBeUI7QUFDdkIsYUFBSyxJQUFJZ0osRUFBVCxJQUFlN0ssVUFBZixFQUEyQjtBQUN6QjtBQUNBNkssZUFBS1csU0FBU1gsRUFBVCxDQUFMOztBQUVBLGNBQUl0UCxPQUFPeUUsV0FBVzZLLEVBQVgsQ0FBWDtBQUFBLGNBQ0l4VyxNQUFNLEVBRFY7QUFBQSxjQUVJc2EsbUJBQW1CLEVBRnZCO0FBQUEsY0FHSUMsa0JBQWtCLEVBSHRCO0FBQUEsY0FJSUMsZUFBZSxFQUpuQjtBQUFBLGNBS0lDLFdBQVcsRUFMZjtBQUFBLGNBTUlDLFVBQVUsQ0FBQy9RLFNBQUQsR0FBYTZGLFVBQVUsT0FBVixFQUFtQmdILEVBQW5CLENBQWIsR0FBc0MsSUFOcEQ7QUFBQSxjQU9JbUUsZUFBZW5MLFVBQVUsWUFBVixFQUF3QmdILEVBQXhCLENBUG5CO0FBQUEsY0FRSW9FLFVBQVVwTCxVQUFVLE9BQVYsRUFBbUJnSCxFQUFuQixDQVJkO0FBQUEsY0FTSXFFLGdCQUFnQnJMLFVBQVUsYUFBVixFQUF5QmdILEVBQXpCLENBVHBCO0FBQUEsY0FVSWtCLGVBQWVsSSxVQUFVLFlBQVYsRUFBd0JnSCxFQUF4QixDQVZuQjtBQUFBLGNBV0lzRSxXQUFXdEwsVUFBVSxRQUFWLEVBQW9CZ0gsRUFBcEIsQ0FYZjs7QUFhQTtBQUNBLGNBQUk3SSxzQkFBc0JrQixhQUF0QixJQUF1Q1csVUFBVSxZQUFWLEVBQXdCZ0gsRUFBeEIsQ0FBdkMsSUFBc0UsV0FBV3RQLElBQXJGLEVBQTJGO0FBQ3pGb1QsK0JBQW1CLE1BQU1oSixPQUFOLEdBQWdCLE1BQWhCLEdBQXlCdUcsMkJBQTJCK0MsT0FBM0IsQ0FBekIsR0FBK0QsR0FBbEY7QUFDRDs7QUFFRDtBQUNBLGNBQUksaUJBQWlCMVQsSUFBakIsSUFBeUIsWUFBWUEsSUFBekMsRUFBK0M7QUFDN0NxVCw4QkFBa0IsTUFBTWpKLE9BQU4sR0FBZ0IsTUFBaEIsR0FBeUIrRixzQkFBc0J3RCxhQUF0QixFQUFxQ0MsUUFBckMsRUFBK0NILFlBQS9DLEVBQTZEQyxPQUE3RCxFQUFzRWxELFlBQXRFLENBQXpCLEdBQStHLEdBQWpJO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJbkosWUFBWUcsVUFBWixJQUEwQixDQUFDL0UsU0FBM0IsS0FBeUMsZ0JBQWdCekMsSUFBaEIsSUFBd0IsV0FBV0EsSUFBbkMsSUFBNEN3QyxjQUFjLFlBQVl4QyxJQUEvRyxDQUFKLEVBQTJIO0FBQ3pIc1QsMkJBQWUsV0FBVzFDLGtCQUFrQjZDLFlBQWxCLEVBQWdDRyxRQUFoQyxFQUEwQ0osT0FBMUMsQ0FBWCxHQUFnRSxHQUEvRTtBQUNEO0FBQ0QsY0FBSS9NLHNCQUFzQixXQUFXekcsSUFBckMsRUFBMkM7QUFDekNzVCw0QkFBZ0IzQywyQkFBMkIrQyxPQUEzQixDQUFoQjtBQUNEO0FBQ0QsY0FBSUosWUFBSixFQUFrQjtBQUNoQkEsMkJBQWUsTUFBTWxKLE9BQU4sR0FBZ0IsR0FBaEIsR0FBc0JrSixZQUF0QixHQUFxQyxHQUFwRDtBQUNEOztBQUVEO0FBQ0EsY0FBSSxnQkFBZ0J0VCxJQUFoQixJQUF5QndDLGNBQWMsWUFBWXhDLElBQW5ELElBQTRELENBQUNxSCxRQUFELElBQWEsV0FBV3JILElBQXhGLEVBQThGO0FBQzVGdVQsd0JBQVl6QyxtQkFBbUIyQyxZQUFuQixFQUFpQ0csUUFBakMsRUFBMkNKLE9BQTNDLENBQVo7QUFDRDtBQUNELGNBQUksWUFBWXhULElBQWhCLEVBQXNCO0FBQ3BCdVQsd0JBQVl2QyxvQkFBb0I0QyxRQUFwQixDQUFaO0FBQ0Q7QUFDRDtBQUNBLGNBQUksQ0FBQ3ZNLFFBQUQsSUFBYSxXQUFXckgsSUFBNUIsRUFBa0M7QUFDaEMsZ0JBQUl5RyxrQkFBSixFQUF3QjtBQUFFOE0sMEJBQVk1QywyQkFBMkIrQyxPQUEzQixDQUFaO0FBQWtEO0FBQzVFLGdCQUFJL00saUJBQUosRUFBdUI7QUFBRTRNLDBCQUFZbkMsMEJBQTBCc0MsT0FBMUIsQ0FBWjtBQUFpRDtBQUMzRTtBQUNELGNBQUlILFFBQUosRUFBYztBQUFFQSx1QkFBVyxNQUFNbkosT0FBTixHQUFnQixlQUFoQixHQUFrQ21KLFFBQWxDLEdBQTZDLEdBQXhEO0FBQThEOztBQUU5RTtBQUNBemEsZ0JBQU1zYSxtQkFBbUJDLGVBQW5CLEdBQXFDQyxZQUFyQyxHQUFvREMsUUFBMUQ7O0FBRUEsY0FBSXphLEdBQUosRUFBUztBQUNQZ0Msa0JBQU1LLFVBQU4sQ0FBaUIsd0JBQXdCbVUsS0FBSyxFQUE3QixHQUFrQyxPQUFsQyxHQUE0Q3hXLEdBQTVDLEdBQWtELEdBQW5FLEVBQXdFZ0MsTUFBTVcsUUFBTixDQUFlN0UsTUFBdkY7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxhQUFTNmIsU0FBVCxHQUFzQjtBQUNwQjtBQUNBb0I7O0FBRUE7QUFDQXBNLG1CQUFhcU0sa0JBQWIsQ0FBZ0MsWUFBaEMsRUFBOEMsdUhBQXVIQyxrQkFBdkgsR0FBNEksY0FBNUksR0FBNkovTCxVQUE3SixHQUEwSyxRQUF4TjtBQUNBd0UsMEJBQW9CL0UsYUFBYTVNLGFBQWIsQ0FBMkIsMEJBQTNCLENBQXBCOztBQUVBO0FBQ0EsVUFBSWtSLFdBQUosRUFBaUI7QUFDZixZQUFJaUksTUFBTXZRLFdBQVcsTUFBWCxHQUFvQixPQUE5QjtBQUNBLFlBQUlNLGNBQUosRUFBb0I7QUFDbEJ2RyxtQkFBU3VHLGNBQVQsRUFBeUIsRUFBQyxlQUFlaVEsR0FBaEIsRUFBekI7QUFDRCxTQUZELE1BRU8sSUFBSS9SLFFBQVErQixvQkFBWixFQUFrQztBQUN2Q3lELHVCQUFhcU0sa0JBQWIsQ0FBZ0NuRSxrQkFBa0IxTixRQUFReUIsZ0JBQTFCLENBQWhDLEVBQTZFLDBCQUEwQnNRLEdBQTFCLEdBQWdDLElBQWhDLEdBQXVDcEcsb0JBQW9CLENBQXBCLENBQXZDLEdBQWdFb0csR0FBaEUsR0FBc0VwRyxvQkFBb0IsQ0FBcEIsQ0FBdEUsR0FBK0YvSixhQUFhLENBQWIsQ0FBL0YsR0FBaUgsV0FBOUw7QUFDQUUsMkJBQWlCMEQsYUFBYTVNLGFBQWIsQ0FBMkIsZUFBM0IsQ0FBakI7QUFDRDs7QUFFRDtBQUNBLFlBQUlrSixjQUFKLEVBQW9CO0FBQ2xCekQsb0JBQVV5RCxjQUFWLEVBQTBCLEVBQUMsU0FBU2tRLGNBQVYsRUFBMUI7QUFDRDs7QUFFRCxZQUFJeFEsUUFBSixFQUFjO0FBQ1p5UTtBQUNBLGNBQUlwUSxrQkFBSixFQUF3QjtBQUFFeEQsc0JBQVU0QixTQUFWLEVBQXFCOEksV0FBckI7QUFBb0M7QUFDOUQsY0FBSS9HLHlCQUFKLEVBQStCO0FBQUUzRCxzQkFBVTRCLFNBQVYsRUFBcUJpSixlQUFyQjtBQUF3QztBQUMxRTtBQUNGOztBQUVEO0FBQ0EsVUFBSVcsTUFBSixFQUFZO0FBQ1YsWUFBSXFJLFlBQVksQ0FBQzlNLFFBQUQsR0FBWSxDQUFaLEdBQWdCd0IsVUFBaEM7QUFDQTtBQUNBO0FBQ0EsWUFBSXhGLFlBQUosRUFBa0I7QUFDaEI3RixtQkFBUzZGLFlBQVQsRUFBdUIsRUFBQyxjQUFjLHFCQUFmLEVBQXZCO0FBQ0EySixxQkFBVzNKLGFBQWFySixRQUF4QjtBQUNBb0Msa0JBQVE0USxRQUFSLEVBQWtCLFVBQVN6UCxJQUFULEVBQWU1RyxDQUFmLEVBQWtCO0FBQ2xDNkcscUJBQVNELElBQVQsRUFBZTtBQUNiLDBCQUFZNUcsQ0FEQztBQUViLDBCQUFZLElBRkM7QUFHYiw0QkFBYzhXLFVBQVU5VyxJQUFJLENBQWQsQ0FIRDtBQUliLCtCQUFpQnlUO0FBSkosYUFBZjtBQU1ELFdBUEQ7O0FBU0Y7QUFDQyxTQWJELE1BYU87QUFDTCxjQUFJZ0ssVUFBVSxFQUFkO0FBQUEsY0FDSUMsWUFBWS9RLGtCQUFrQixFQUFsQixHQUF1QixzQkFEdkM7QUFFQSxlQUFLLElBQUkzTSxJQUFJLENBQWIsRUFBZ0JBLElBQUlxUixVQUFwQixFQUFnQ3JSLEdBQWhDLEVBQXFDO0FBQ25DO0FBQ0F5ZCx1QkFBVyx1QkFBdUJ6ZCxDQUF2QixHQUEwQixpQ0FBMUIsR0FBOER5VCxPQUE5RCxHQUF3RSxJQUF4RSxHQUErRWlLLFNBQS9FLEdBQTJGLGVBQTNGLEdBQTZHNUcsTUFBN0csSUFBdUg5VyxJQUFJLENBQTNILElBQStILGFBQTFJO0FBQ0Q7QUFDRHlkLG9CQUFVLDJEQUEyREEsT0FBM0QsR0FBcUUsUUFBL0U7QUFDQTNNLHVCQUFhcU0sa0JBQWIsQ0FBZ0NuRSxrQkFBa0IxTixRQUFRbUIsV0FBMUIsQ0FBaEMsRUFBd0VnUixPQUF4RTs7QUFFQS9RLHlCQUFlb0UsYUFBYTVNLGFBQWIsQ0FBMkIsVUFBM0IsQ0FBZjtBQUNBbVMscUJBQVczSixhQUFhckosUUFBeEI7QUFDRDs7QUFFRHNhOztBQUVBO0FBQ0EsWUFBSTdOLGtCQUFKLEVBQXdCO0FBQ3RCLGNBQUkxSCxTQUFTMEgsbUJBQW1CMEssU0FBbkIsQ0FBNkIsQ0FBN0IsRUFBZ0MxSyxtQkFBbUI3UCxNQUFuQixHQUE0QixFQUE1RCxFQUFnRTJJLFdBQWhFLEVBQWI7QUFBQSxjQUNJekcsTUFBTSxxQkFBcUIwSyxRQUFRLElBQTdCLEdBQW9DLEdBRDlDOztBQUdBLGNBQUl6RSxNQUFKLEVBQVk7QUFDVmpHLGtCQUFNLE1BQU1pRyxNQUFOLEdBQWUsR0FBZixHQUFxQmpHLEdBQTNCO0FBQ0Q7O0FBRURpQyxxQkFBV0QsS0FBWCxFQUFrQixxQkFBcUJzUCxPQUFyQixHQUErQixRQUFqRCxFQUEyRHRSLEdBQTNELEVBQWdFMEMsa0JBQWtCVixLQUFsQixDQUFoRTtBQUNEOztBQUVEMEMsaUJBQVN3UCxTQUFTSyxlQUFULENBQVQsRUFBb0MsRUFBQyxjQUFjSSxVQUFVSixrQkFBa0IsQ0FBNUIsSUFBaUNLLGFBQWhELEVBQXBDO0FBQ0E3UCxvQkFBWW1QLFNBQVNLLGVBQVQsQ0FBWixFQUF1QyxVQUF2QztBQUNBdlEsaUJBQVNrUSxTQUFTSyxlQUFULENBQVQsRUFBb0NHLGNBQXBDOztBQUVBO0FBQ0FsTixrQkFBVStDLFlBQVYsRUFBd0J3SCxTQUF4QjtBQUNEOztBQUlEO0FBQ0EsVUFBSWUsV0FBSixFQUFpQjtBQUNmLFlBQUksQ0FBQzVJLGlCQUFELEtBQXVCLENBQUNDLFVBQUQsSUFBZSxDQUFDQyxVQUF2QyxDQUFKLEVBQXdEO0FBQ3REdUUsdUJBQWFxTSxrQkFBYixDQUFnQ25FLGtCQUFrQjFOLFFBQVFhLGdCQUExQixDQUFoQyxFQUE2RSx1SUFBdUlzSCxPQUF2SSxHQUFnSixJQUFoSixHQUF1SnJILGFBQWEsQ0FBYixDQUF2SixHQUF5SyxxRUFBekssR0FBaVBxSCxPQUFqUCxHQUEwUCxJQUExUCxHQUFpUXJILGFBQWEsQ0FBYixDQUFqUSxHQUFtUixpQkFBaFc7O0FBRUFDLDhCQUFvQnlFLGFBQWE1TSxhQUFiLENBQTJCLGVBQTNCLENBQXBCO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDb0ksVUFBRCxJQUFlLENBQUNDLFVBQXBCLEVBQWdDO0FBQzlCRCx1QkFBYUQsa0JBQWtCaEosUUFBbEIsQ0FBMkIsQ0FBM0IsQ0FBYjtBQUNBa0osdUJBQWFGLGtCQUFrQmhKLFFBQWxCLENBQTJCLENBQTNCLENBQWI7QUFDRDs7QUFFRCxZQUFJaUksUUFBUWUsaUJBQVosRUFBK0I7QUFDN0J4RixtQkFBU3dGLGlCQUFULEVBQTRCO0FBQzFCLDBCQUFjLHFCQURZO0FBRTFCLHdCQUFZO0FBRmMsV0FBNUI7QUFJRDs7QUFFRCxZQUFJZixRQUFRZSxpQkFBUixJQUE4QmYsUUFBUWdCLFVBQVIsSUFBc0JoQixRQUFRaUIsVUFBaEUsRUFBNkU7QUFDM0UxRixtQkFBUyxDQUFDeUYsVUFBRCxFQUFhQyxVQUFiLENBQVQsRUFBbUM7QUFDakMsNkJBQWlCa0gsT0FEZ0I7QUFFakMsd0JBQVk7QUFGcUIsV0FBbkM7QUFJRDs7QUFFRCxZQUFJbkksUUFBUWUsaUJBQVIsSUFBOEJmLFFBQVFnQixVQUFSLElBQXNCaEIsUUFBUWlCLFVBQWhFLEVBQTZFO0FBQzNFMUYsbUJBQVN5RixVQUFULEVBQXFCLEVBQUMsaUJBQWtCLE1BQW5CLEVBQXJCO0FBQ0F6RixtQkFBUzBGLFVBQVQsRUFBcUIsRUFBQyxpQkFBa0IsTUFBbkIsRUFBckI7QUFDRDs7QUFFRDJKLHVCQUFlMEgsU0FBU3RSLFVBQVQsQ0FBZjtBQUNBNkosdUJBQWV5SCxTQUFTclIsVUFBVCxDQUFmOztBQUVBc1I7O0FBRUE7QUFDQSxZQUFJeFIsaUJBQUosRUFBdUI7QUFDckIxQyxvQkFBVTBDLGlCQUFWLEVBQTZCMEgsY0FBN0I7QUFDRCxTQUZELE1BRU87QUFDTHBLLG9CQUFVMkMsVUFBVixFQUFzQnlILGNBQXRCO0FBQ0FwSyxvQkFBVTRDLFVBQVYsRUFBc0J3SCxjQUF0QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQStKO0FBQ0Q7O0FBRUQsYUFBUy9CLFVBQVQsR0FBdUI7QUFDckI7QUFDQSxVQUFJckwsWUFBWVIsYUFBaEIsRUFBK0I7QUFDN0IsWUFBSTZOLE1BQU0sRUFBVjtBQUNBQSxZQUFJN04sYUFBSixJQUFxQjhOLGVBQXJCO0FBQ0FyVSxrQkFBVTRCLFNBQVYsRUFBcUJ3UyxHQUFyQjtBQUNEOztBQUVELFVBQUk5UCxLQUFKLEVBQVc7QUFBRXRFLGtCQUFVNEIsU0FBVixFQUFxQnFKLFdBQXJCLEVBQWtDdEosUUFBUWdELG9CQUExQztBQUFrRTtBQUMvRSxVQUFJSixTQUFKLEVBQWU7QUFBRXZFLGtCQUFVNEIsU0FBVixFQUFxQnlKLFVBQXJCO0FBQW1DO0FBQ3BELFVBQUlwSSxTQUFKLEVBQWU7QUFBRWpELGtCQUFVMUksR0FBVixFQUFleVQsbUJBQWY7QUFBc0M7O0FBRXZELFVBQUl0RyxXQUFXLE9BQWYsRUFBd0I7QUFDdEJtRixlQUFPckosRUFBUCxDQUFVLGNBQVYsRUFBMEIsWUFBWTtBQUNwQytUO0FBQ0ExSyxpQkFBT2hKLElBQVAsQ0FBWSxhQUFaLEVBQTJCMlQsTUFBM0I7QUFDRCxTQUhEO0FBSUQsT0FMRCxNQUtPLElBQUlwUSxjQUFjakMsVUFBZCxJQUE0QkMsU0FBNUIsSUFBeUMrQixVQUF6QyxJQUF1RCxDQUFDZ0QsVUFBNUQsRUFBd0U7QUFDN0VsSCxrQkFBVS9LLEdBQVYsRUFBZSxFQUFDLFVBQVV1ZixRQUFYLEVBQWY7QUFDRDs7QUFFRCxVQUFJdFEsVUFBSixFQUFnQjtBQUNkLFlBQUlPLFdBQVcsT0FBZixFQUF3QjtBQUN0Qm1GLGlCQUFPckosRUFBUCxDQUFVLGFBQVYsRUFBeUJrVSxZQUF6QjtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUMxSyxPQUFMLEVBQWM7QUFBRTBLO0FBQWlCO0FBQ3pDOztBQUVEQztBQUNBLFVBQUkzSyxPQUFKLEVBQWE7QUFBRTRLO0FBQWtCLE9BQWpDLE1BQXVDLElBQUkxSyxNQUFKLEVBQVk7QUFBRTJLO0FBQWlCOztBQUV0RWhMLGFBQU9ySixFQUFQLENBQVUsY0FBVixFQUEwQnNVLGlCQUExQjtBQUNBLFVBQUlwUSxXQUFXLE9BQWYsRUFBd0I7QUFBRW1GLGVBQU9oSixJQUFQLENBQVksYUFBWixFQUEyQjJULE1BQTNCO0FBQXFDO0FBQy9ELFVBQUksT0FBTzFQLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFBRUEsZUFBTzBQLE1BQVA7QUFBaUI7QUFDckR6TSxhQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFTZ04sT0FBVCxHQUFvQjtBQUNsQjtBQUNBdGEsWUFBTXdQLFFBQU4sR0FBaUIsSUFBakI7QUFDQSxVQUFJeFAsTUFBTXVhLFNBQVYsRUFBcUI7QUFBRXZhLGNBQU11YSxTQUFOLENBQWdCamdCLE1BQWhCO0FBQTJCOztBQUVsRDtBQUNBcUwsbUJBQWFsTCxHQUFiLEVBQWtCLEVBQUMsVUFBVXVmLFFBQVgsRUFBbEI7O0FBRUE7QUFDQSxVQUFJdlIsU0FBSixFQUFlO0FBQUU5QyxxQkFBYTdJLEdBQWIsRUFBa0J5VCxtQkFBbEI7QUFBeUM7QUFDMUQsVUFBSXJJLGlCQUFKLEVBQXVCO0FBQUV2QyxxQkFBYXVDLGlCQUFiLEVBQWdDMEgsY0FBaEM7QUFBa0Q7QUFDM0UsVUFBSXJILFlBQUosRUFBa0I7QUFBRTVDLHFCQUFhNEMsWUFBYixFQUEyQndILFNBQTNCO0FBQXdDOztBQUU1RDtBQUNBcEssbUJBQWF5QixTQUFiLEVBQXdCOEksV0FBeEI7QUFDQXZLLG1CQUFheUIsU0FBYixFQUF3QmlKLGVBQXhCO0FBQ0EsVUFBSXBILGNBQUosRUFBb0I7QUFBRXRELHFCQUFhc0QsY0FBYixFQUE2QixFQUFDLFNBQVNrUSxjQUFWLEVBQTdCO0FBQTBEO0FBQ2hGLFVBQUl4USxRQUFKLEVBQWM7QUFBRTZSLHNCQUFjekgsYUFBZDtBQUErQjs7QUFFL0M7QUFDQSxVQUFJeEcsWUFBWVIsYUFBaEIsRUFBK0I7QUFDN0IsWUFBSTZOLE1BQU0sRUFBVjtBQUNBQSxZQUFJN04sYUFBSixJQUFxQjhOLGVBQXJCO0FBQ0FsVSxxQkFBYXlCLFNBQWIsRUFBd0J3UyxHQUF4QjtBQUNEO0FBQ0QsVUFBSTlQLEtBQUosRUFBVztBQUFFbkUscUJBQWF5QixTQUFiLEVBQXdCcUosV0FBeEI7QUFBdUM7QUFDcEQsVUFBSTFHLFNBQUosRUFBZTtBQUFFcEUscUJBQWF5QixTQUFiLEVBQXdCeUosVUFBeEI7QUFBc0M7O0FBRXZEO0FBQ0EsVUFBSTRKLFdBQVcsQ0FBQzFOLGFBQUQsRUFBZ0I2RSxxQkFBaEIsRUFBdUNDLGNBQXZDLEVBQXVEQyxjQUF2RCxFQUF1RUcsZ0JBQXZFLEVBQXlGWSxrQkFBekYsQ0FBZjs7QUFFQXpHLGNBQVE5SyxPQUFSLENBQWdCLFVBQVNtQixJQUFULEVBQWU1RyxDQUFmLEVBQWtCO0FBQ2hDLFlBQUlnRyxLQUFLWSxTQUFTLFdBQVQsR0FBdUJrSyxZQUF2QixHQUFzQ3hGLFFBQVExRSxJQUFSLENBQS9DOztBQUVBLFlBQUksUUFBT1osRUFBUCx5Q0FBT0EsRUFBUCxPQUFjLFFBQWxCLEVBQTRCO0FBQzFCLGNBQUk2WSxTQUFTN1ksR0FBRzhZLHNCQUFILEdBQTRCOVksR0FBRzhZLHNCQUEvQixHQUF3RCxLQUFyRTtBQUFBLGNBQ0lDLFdBQVcvWSxHQUFHdEgsVUFEbEI7QUFFQXNILGFBQUdtTCxTQUFILEdBQWV5TixTQUFTNWUsQ0FBVCxDQUFmO0FBQ0FzTCxrQkFBUTFFLElBQVIsSUFBZ0JpWSxTQUFTQSxPQUFPRyxrQkFBaEIsR0FBcUNELFNBQVNFLGlCQUE5RDtBQUNEO0FBQ0YsT0FURDs7QUFZQTtBQUNBMU8sZ0JBQVVoRCxZQUFZQyxhQUFhRSxlQUFlRCxnQkFBZ0JvRCxhQUFhQyxlQUFlQyxlQUFleEYsWUFBWTBGLGtCQUFrQkMsZ0JBQWdCRSxhQUFhQyxhQUFhQyxpQkFBaUJDLGNBQWN6RixZQUFZRCxhQUFhRCxjQUFjRCxTQUFTaUcsV0FBV2xHLFFBQVFNLFVBQVVELGNBQWNhLFlBQVlDLFFBQVFlLFNBQVNELE9BQU9FLGFBQWExSixRQUFRNEosV0FBV2lFLGlCQUFpQkMsZ0JBQWdCQyxhQUFhRSxnQkFBZ0JDLG1CQUFtQkMsZ0JBQWdCRSw2QkFBNkJDLGdCQUFnQkMsa0JBQWtCQyxtQkFBbUJDLGNBQWNyTyxRQUFReU8sY0FBY0csV0FBV0MsV0FBV0MsY0FBY2xGLGFBQWFtRix3QkFBd0JsSSxVQUFVb0QsU0FBUytFLFNBQVNDLHNCQUFzQkMsVUFBVUMsVUFBVUMsV0FBV3BGLFlBQVlxRixTQUFTRSxTQUFTQyxpQkFBaUJHLFlBQVlHLGNBQWNHLGtCQUFrQkUsc0JBQXNCRSxjQUFjSSxhQUFhQyxjQUFjRSxTQUFTeEksa0JBQWtCeUksY0FBY0MsV0FBV0MsZUFBZUMsbUJBQW1CQyxtQkFBbUJDLFlBQVlHLGVBQWUxSixXQUFXRSxlQUFlQyxvQkFBb0IwSix3QkFBd0J6SixhQUFhQyxhQUFhMkosZUFBZUMsZUFBZTNKLE1BQU1FLGVBQWUwSixtQkFBbUJDLFdBQVdDLFFBQVFFLGNBQWNDLGFBQWFDLGtCQUFrQkUsd0JBQXdCQyxpQkFBaUJDLFNBQVNDLGdCQUFnQmpLLFdBQVdFLGtCQUFrQkMsb0JBQW9CQyxlQUFlQyxxQkFBcUJDLGlCQUFpQjRKLHFCQUFxQjFKLDRCQUE0QjJKLHNCQUFzQkMsZ0JBQWdCQyxZQUFZQyxzQkFBc0JDLHFCQUFxQkMsMkJBQTJCQyxlQUFlQyxlQUFlQyxnQkFBZ0JDLE9BQU9DLE9BQU9DLFdBQVdDLFdBQVdDLFVBQVU3SixRQUFRQyxZQUFZLElBQXpxRDtBQUNBO0FBQ0E7O0FBRUEsV0FBSyxJQUFJNkosQ0FBVCxJQUFjLElBQWQsRUFBb0I7QUFDbEIsWUFBSUEsTUFBTSxTQUFWLEVBQXFCO0FBQUUsZUFBS0EsQ0FBTCxJQUFVLElBQVY7QUFBaUI7QUFDekM7QUFDRHRHLGFBQU8sS0FBUDtBQUNEOztBQUVIO0FBQ0U7QUFDQSxhQUFTME0sUUFBVCxDQUFtQnRkLENBQW5CLEVBQXNCO0FBQ3BCL0IsVUFBSSxZQUFVO0FBQUVtZixvQkFBWWlCLFNBQVNyZSxDQUFULENBQVo7QUFBMkIsT0FBM0M7QUFDRDs7QUFFRCxhQUFTb2QsV0FBVCxDQUFzQnBkLENBQXRCLEVBQXlCO0FBQ3ZCLFVBQUksQ0FBQzRRLElBQUwsRUFBVztBQUFFO0FBQVM7QUFDdEIsVUFBSXJELFdBQVcsT0FBZixFQUF3QjtBQUFFbUYsZUFBT2hKLElBQVAsQ0FBWSxjQUFaLEVBQTRCMlQsS0FBS3JkLENBQUwsQ0FBNUI7QUFBdUM7QUFDakUwUSxvQkFBY0MsZ0JBQWQ7QUFDQSxVQUFJMk4sU0FBSjtBQUFBLFVBQ0lDLG9CQUFvQjlOLGNBRHhCO0FBQUEsVUFFSStOLHlCQUF5QixLQUY3Qjs7QUFJQSxVQUFJdlIsVUFBSixFQUFnQjtBQUNkNEQ7QUFDQXlOLG9CQUFZQyxzQkFBc0I5TixjQUFsQztBQUNBO0FBQ0EsWUFBSTZOLFNBQUosRUFBZTtBQUFFNUwsaUJBQU9oSixJQUFQLENBQVksb0JBQVosRUFBa0MyVCxLQUFLcmQsQ0FBTCxDQUFsQztBQUE2QztBQUMvRDs7QUFFRCxVQUFJeWUsVUFBSjtBQUFBLFVBQ0lDLFlBREo7QUFBQSxVQUVJckYsV0FBV3hPLEtBRmY7QUFBQSxVQUdJOFQsYUFBYTlMLE9BSGpCO0FBQUEsVUFJSStMLFlBQVk3TCxNQUpoQjtBQUFBLFVBS0k4TCxlQUFlOVMsU0FMbkI7QUFBQSxVQU1JK1MsY0FBY3pULFFBTmxCO0FBQUEsVUFPSTBULFNBQVNwVCxHQVBiO0FBQUEsVUFRSXFULFdBQVc1UixLQVJmO0FBQUEsVUFTSTZSLGVBQWU1UixTQVRuQjtBQUFBLFVBVUk2UixjQUFjalQsUUFWbEI7QUFBQSxVQVdJa1Qsd0JBQXdCN1Msa0JBWDVCO0FBQUEsVUFZSThTLCtCQUErQjNTLHlCQVpuQztBQUFBLFVBYUk0UyxXQUFXM2IsS0FiZjs7QUFlQSxVQUFJNGEsU0FBSixFQUFlO0FBQ2IsWUFBSXhGLGdCQUFnQjlOLFVBQXBCO0FBQUEsWUFDSXNVLGdCQUFnQnRTLFVBRHBCO0FBQUEsWUFFSXVTLGtCQUFrQmhVLFlBRnRCO0FBQUEsWUFHSWlVLFlBQVlwVSxNQUhoQjtBQUFBLFlBSUlxVSxrQkFBa0JwVCxZQUp0Qjs7QUFNQSxZQUFJLENBQUN5QyxLQUFMLEVBQVk7QUFDVixjQUFJK0osWUFBWS9OLE1BQWhCO0FBQUEsY0FDSThOLGlCQUFpQjdOLFdBRHJCO0FBRUQ7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBZ0Isa0JBQVkrRSxVQUFVLFdBQVYsQ0FBWjtBQUNBekYsaUJBQVd5RixVQUFVLFVBQVYsQ0FBWDtBQUNBbkYsWUFBTW1GLFVBQVUsS0FBVixDQUFOO0FBQ0ExRCxjQUFRMEQsVUFBVSxPQUFWLENBQVI7QUFDQTFGLGVBQVMwRixVQUFVLFFBQVYsQ0FBVDtBQUNBekQsa0JBQVl5RCxVQUFVLFdBQVYsQ0FBWjtBQUNBN0UsaUJBQVc2RSxVQUFVLFVBQVYsQ0FBWDtBQUNBeEUsMkJBQXFCd0UsVUFBVSxvQkFBVixDQUFyQjtBQUNBckUsa0NBQTRCcUUsVUFBVSwyQkFBVixDQUE1Qjs7QUFFQSxVQUFJd04sU0FBSixFQUFlO0FBQ2J6TCxrQkFBVS9CLFVBQVUsU0FBVixDQUFWO0FBQ0E5RixxQkFBYThGLFVBQVUsWUFBVixDQUFiO0FBQ0E5RSxnQkFBUThFLFVBQVUsT0FBVixDQUFSO0FBQ0E5RCxxQkFBYThELFVBQVUsWUFBVixDQUFiO0FBQ0F2Rix1QkFBZXVGLFVBQVUsY0FBVixDQUFmO0FBQ0F6RSx1QkFBZXlFLFVBQVUsY0FBVixDQUFmO0FBQ0EzRSwwQkFBa0IyRSxVQUFVLGlCQUFWLENBQWxCOztBQUVBLFlBQUksQ0FBQ2hDLEtBQUwsRUFBWTtBQUNWL0Qsd0JBQWMrRixVQUFVLGFBQVYsQ0FBZDtBQUNBaEcsbUJBQVNnRyxVQUFVLFFBQVYsQ0FBVDtBQUNEO0FBQ0Y7QUFDRDtBQUNBc0csK0JBQXlCdkUsT0FBekI7O0FBRUE5QixpQkFBV0Msa0JBQVgsQ0ExRXVCLENBMEVRO0FBQy9CLFVBQUksQ0FBQyxDQUFDaEIsVUFBRCxJQUFlL0UsU0FBaEIsS0FBOEIsQ0FBQzRILE9BQW5DLEVBQTRDO0FBQzFDeUk7QUFDQSxZQUFJLENBQUN0TCxVQUFMLEVBQWlCO0FBQ2Z1TCx1Q0FEZSxDQUNlO0FBQzlCaUQsbUNBQXlCLElBQXpCO0FBQ0Q7QUFDRjtBQUNELFVBQUl4VCxjQUFjQyxTQUFsQixFQUE2QjtBQUMzQndHLHdCQUFnQkMsa0JBQWhCLENBRDJCLENBQ1M7QUFDQTtBQUNwQ2EsbUJBQVdSLGFBQVgsQ0FIMkIsQ0FHRDtBQUNBO0FBQzNCOztBQUVELFVBQUl1TSxhQUFhdFQsVUFBakIsRUFBNkI7QUFDM0JILGdCQUFRaUcsVUFBVSxPQUFWLENBQVI7QUFDQTNGLGtCQUFVMkYsVUFBVSxTQUFWLENBQVY7QUFDQTROLHVCQUFlN1QsVUFBVXdPLFFBQXpCOztBQUVBLFlBQUlxRixZQUFKLEVBQWtCO0FBQ2hCLGNBQUksQ0FBQzFULFVBQUQsSUFBZSxDQUFDQyxTQUFwQixFQUErQjtBQUFFc0gsdUJBQVdSLGFBQVg7QUFBMkIsV0FENUMsQ0FDNkM7QUFDN0Q7QUFDQTtBQUNBMk47QUFDRDtBQUNGOztBQUVELFVBQUlwQixTQUFKLEVBQWU7QUFDYixZQUFJekwsWUFBWThMLFVBQWhCLEVBQTRCO0FBQzFCLGNBQUk5TCxPQUFKLEVBQWE7QUFDWDRLO0FBQ0QsV0FGRCxNQUVPO0FBQ0xrQywyQkFESyxDQUNXO0FBQ2pCO0FBQ0Y7QUFDRjs7QUFFRCxVQUFJalMsY0FBYzRRLGFBQWF0VCxVQUFiLElBQTJCQyxTQUF6QyxDQUFKLEVBQXlEO0FBQ3ZEOEgsaUJBQVNDLFdBQVQsQ0FEdUQsQ0FDakM7QUFDQTtBQUNBOztBQUV0QixZQUFJRCxXQUFXNkwsU0FBZixFQUEwQjtBQUN4QixjQUFJN0wsTUFBSixFQUFZO0FBQ1Y2TSxpQ0FBcUJDLDJCQUEyQjNOLGNBQWMsQ0FBZCxDQUEzQixDQUFyQjtBQUNBd0w7QUFDRCxXQUhELE1BR087QUFDTG9DO0FBQ0F0QixxQ0FBeUIsSUFBekI7QUFDRDtBQUNGO0FBQ0Y7O0FBRURwSCwrQkFBeUJ2RSxXQUFXRSxNQUFwQyxFQWhJdUIsQ0FnSXNCO0FBQzdDLFVBQUksQ0FBQzlHLFFBQUwsRUFBZTtBQUFFSyw2QkFBcUJHLDRCQUE0QixLQUFqRDtBQUF5RDs7QUFFMUUsVUFBSVYsY0FBYzhTLFlBQWxCLEVBQWdDO0FBQzlCOVMsb0JBQ0VqRCxVQUFVMUksR0FBVixFQUFleVQsbUJBQWYsQ0FERixHQUVFNUssYUFBYTdJLEdBQWIsRUFBa0J5VCxtQkFBbEIsQ0FGRjtBQUdEO0FBQ0QsVUFBSXhJLGFBQWF5VCxXQUFqQixFQUE4QjtBQUM1QixZQUFJelQsUUFBSixFQUFjO0FBQ1osY0FBSUcsaUJBQUosRUFBdUI7QUFDckIxRSx3QkFBWTBFLGlCQUFaO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsZ0JBQUlDLFVBQUosRUFBZ0I7QUFBRTNFLDBCQUFZMkUsVUFBWjtBQUEwQjtBQUM1QyxnQkFBSUMsVUFBSixFQUFnQjtBQUFFNUUsMEJBQVk0RSxVQUFaO0FBQTBCO0FBQzdDO0FBQ0YsU0FQRCxNQU9PO0FBQ0wsY0FBSUYsaUJBQUosRUFBdUI7QUFDckI3RSx3QkFBWTZFLGlCQUFaO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsZ0JBQUlDLFVBQUosRUFBZ0I7QUFBRTlFLDBCQUFZOEUsVUFBWjtBQUEwQjtBQUM1QyxnQkFBSUMsVUFBSixFQUFnQjtBQUFFL0UsMEJBQVkrRSxVQUFaO0FBQTBCO0FBQzdDO0FBQ0Y7QUFDRjtBQUNELFVBQUlDLFFBQVFvVCxNQUFaLEVBQW9CO0FBQ2xCcFQsY0FDRTdFLFlBQVkrRSxZQUFaLENBREYsR0FFRWxGLFlBQVlrRixZQUFaLENBRkY7QUFHRDtBQUNELFVBQUl1QixVQUFVNFIsUUFBZCxFQUF3QjtBQUN0QjVSLGdCQUNFdEUsVUFBVTRCLFNBQVYsRUFBcUJxSixXQUFyQixFQUFrQ3RKLFFBQVFnRCxvQkFBMUMsQ0FERixHQUVFeEUsYUFBYXlCLFNBQWIsRUFBd0JxSixXQUF4QixDQUZGO0FBR0Q7QUFDRCxVQUFJMUcsY0FBYzRSLFlBQWxCLEVBQWdDO0FBQzlCNVIsb0JBQ0V2RSxVQUFVNEIsU0FBVixFQUFxQnlKLFVBQXJCLENBREYsR0FFRWxMLGFBQWF5QixTQUFiLEVBQXdCeUosVUFBeEIsQ0FGRjtBQUdEO0FBQ0QsVUFBSWxJLGFBQWFpVCxXQUFqQixFQUE4QjtBQUM1QixZQUFJalQsUUFBSixFQUFjO0FBQ1osY0FBSU0sY0FBSixFQUFvQjtBQUFFekYsd0JBQVl5RixjQUFaO0FBQThCO0FBQ3BELGNBQUksQ0FBQytKLFNBQUQsSUFBYyxDQUFDRSxrQkFBbkIsRUFBdUM7QUFBRWtHO0FBQWtCO0FBQzVELFNBSEQsTUFHTztBQUNMLGNBQUluUSxjQUFKLEVBQW9CO0FBQUU1Rix3QkFBWTRGLGNBQVo7QUFBOEI7QUFDcEQsY0FBSStKLFNBQUosRUFBZTtBQUFFeUo7QUFBaUI7QUFDbkM7QUFDRjtBQUNELFVBQUl6VCx1QkFBdUI2UyxxQkFBM0IsRUFBa0Q7QUFDaEQ3Uyw2QkFDRXhELFVBQVU0QixTQUFWLEVBQXFCOEksV0FBckIsQ0FERixHQUVFdkssYUFBYXlCLFNBQWIsRUFBd0I4SSxXQUF4QixDQUZGO0FBR0Q7QUFDRCxVQUFJL0csOEJBQThCMlMsNEJBQWxDLEVBQWdFO0FBQzlEM1Msb0NBQ0UzRCxVQUFVMUksR0FBVixFQUFldVQsZUFBZixDQURGLEdBRUUxSyxhQUFhN0ksR0FBYixFQUFrQnVULGVBQWxCLENBRkY7QUFHRDs7QUFFRCxVQUFJMkssU0FBSixFQUFlO0FBQ2IsWUFBSXRULGVBQWU4TixhQUFmLElBQWdDMU4sV0FBV29VLFNBQS9DLEVBQTBEO0FBQUVoQixtQ0FBeUIsSUFBekI7QUFBZ0M7O0FBRTVGLFlBQUl4UixlQUFlc1MsYUFBbkIsRUFBa0M7QUFDaEMsY0FBSSxDQUFDdFMsVUFBTCxFQUFpQjtBQUFFa0QseUJBQWFyUCxLQUFiLENBQW1CbWYsTUFBbkIsR0FBNEIsRUFBNUI7QUFBaUM7QUFDckQ7O0FBRUQsWUFBSTNVLFlBQVlFLGlCQUFpQmdVLGVBQWpDLEVBQWtEO0FBQ2hEOVQscUJBQVd0SixTQUFYLEdBQXVCb0osYUFBYSxDQUFiLENBQXZCO0FBQ0FHLHFCQUFXdkosU0FBWCxHQUF1Qm9KLGFBQWEsQ0FBYixDQUF2QjtBQUNEOztBQUVELFlBQUlnQixrQkFBa0JGLGlCQUFpQm9ULGVBQXZDLEVBQXdEO0FBQ3RELGNBQUl0Z0IsSUFBSThNLFdBQVcsQ0FBWCxHQUFlLENBQXZCO0FBQUEsY0FDSWdVLE9BQU8xVCxlQUFlcEssU0FEMUI7QUFBQSxjQUVJcUYsTUFBTXlZLEtBQUs3Z0IsTUFBTCxHQUFjcWdCLGdCQUFnQnRnQixDQUFoQixFQUFtQkMsTUFGM0M7QUFHQSxjQUFJNmdCLEtBQUt0RyxTQUFMLENBQWVuUyxHQUFmLE1BQXdCaVksZ0JBQWdCdGdCLENBQWhCLENBQTVCLEVBQWdEO0FBQzlDb04sMkJBQWVwSyxTQUFmLEdBQTJCOGQsS0FBS3RHLFNBQUwsQ0FBZSxDQUFmLEVBQWtCblMsR0FBbEIsSUFBeUI2RSxhQUFhbE4sQ0FBYixDQUFwRDtBQUNEO0FBQ0Y7QUFDRixPQXBCRCxNQW9CTztBQUNMLFlBQUlpTSxXQUFXSixjQUFjQyxTQUF6QixDQUFKLEVBQXlDO0FBQUV1VCxtQ0FBeUIsSUFBekI7QUFBZ0M7QUFDNUU7O0FBRUQsVUFBSUUsZ0JBQWdCMVQsY0FBYyxDQUFDQyxTQUFuQyxFQUE4QztBQUM1Q3dLLGdCQUFRQyxVQUFSO0FBQ0FvSDtBQUNEOztBQUVEMkIsbUJBQWEvYSxVQUFVMmIsUUFBdkI7QUFDQSxVQUFJWixVQUFKLEVBQWdCO0FBQ2QvTCxlQUFPaEosSUFBUCxDQUFZLGNBQVosRUFBNEIyVCxNQUE1QjtBQUNBbUIsaUNBQXlCLElBQXpCO0FBQ0QsT0FIRCxNQUdPLElBQUlFLFlBQUosRUFBa0I7QUFDdkIsWUFBSSxDQUFDRCxVQUFMLEVBQWlCO0FBQUVkO0FBQXNCO0FBQzFDLE9BRk0sTUFFQSxJQUFJM1MsY0FBY0MsU0FBbEIsRUFBNkI7QUFDbEN1UztBQUNBbkI7QUFDQTZEO0FBQ0Q7O0FBRUQsVUFBSXhCLGdCQUFnQixDQUFDN08sUUFBckIsRUFBK0I7QUFBRXNRO0FBQWdDOztBQUVqRSxVQUFJLENBQUN0TixPQUFELElBQVksQ0FBQ0UsTUFBakIsRUFBeUI7QUFDdkI7QUFDQSxZQUFJdUwsYUFBYSxDQUFDeFAsS0FBbEIsRUFBeUI7QUFDdkI7QUFDQSxjQUFJOUIsZUFBZW9ULGFBQWYsSUFBZ0NwVSxVQUFVK00sUUFBOUMsRUFBd0Q7QUFDdEQ0QztBQUNEOztBQUVEO0FBQ0EsY0FBSTVRLGdCQUFnQjZOLGNBQWhCLElBQWtDOU4sV0FBVytOLFNBQWpELEVBQTREO0FBQzFEM0kseUJBQWFyUCxLQUFiLENBQW1CaUMsT0FBbkIsR0FBNkI2VixzQkFBc0I1TixXQUF0QixFQUFtQ0QsTUFBbkMsRUFBMkNFLFVBQTNDLEVBQXVEZ0IsS0FBdkQsRUFBOERnQixVQUE5RCxDQUE3QjtBQUNEOztBQUVELGNBQUlnRCxVQUFKLEVBQWdCO0FBQ2Q7QUFDQSxnQkFBSUgsUUFBSixFQUFjO0FBQ1puRix3QkFBVTdKLEtBQVYsQ0FBZ0JZLEtBQWhCLEdBQXdCMlgsa0JBQWtCcE8sVUFBbEIsRUFBOEJGLE1BQTlCLEVBQXNDRCxLQUF0QyxDQUF4QjtBQUNEOztBQUVEO0FBQ0EsZ0JBQUl2SixNQUFNZ1ksbUJBQW1CdE8sVUFBbkIsRUFBK0JGLE1BQS9CLEVBQXVDRCxLQUF2QyxJQUNBMk8sb0JBQW9CMU8sTUFBcEIsQ0FEVjs7QUFHQTtBQUNBO0FBQ0FqSCwwQkFBY1AsS0FBZCxFQUFxQlUsa0JBQWtCVixLQUFsQixJQUEyQixDQUFoRDtBQUNBQyx1QkFBV0QsS0FBWCxFQUFrQixNQUFNc1AsT0FBTixHQUFnQixjQUFsQyxFQUFrRHRSLEdBQWxELEVBQXVEMEMsa0JBQWtCVixLQUFsQixDQUF2RDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxZQUFJMEosVUFBSixFQUFnQjtBQUFFdVE7QUFBaUI7O0FBRW5DLFlBQUlpQixzQkFBSixFQUE0QjtBQUMxQnhEO0FBQ0E3SSx3QkFBY3pPLEtBQWQ7QUFDRDtBQUNGOztBQUVELFVBQUk0YSxTQUFKLEVBQWU7QUFBRTVMLGVBQU9oSixJQUFQLENBQVksa0JBQVosRUFBZ0MyVCxLQUFLcmQsQ0FBTCxDQUFoQztBQUEyQztBQUM3RDs7QUFNRDtBQUNBLGFBQVNnVCxTQUFULEdBQXNCO0FBQ3BCLFVBQUksQ0FBQ2hJLFVBQUQsSUFBZSxDQUFDQyxTQUFwQixFQUErQjtBQUM3QixZQUFJaU0sSUFBSTlMLFNBQVNQLFFBQVEsQ0FBQ0EsUUFBUSxDQUFULElBQWMsQ0FBL0IsR0FBbUNBLEtBQTNDO0FBQ0EsZUFBUTJGLGNBQWMwRyxDQUF0QjtBQUNEOztBQUVELFVBQUl6VixRQUFRdUosYUFBYSxDQUFDQSxhQUFhRixNQUFkLElBQXdCMEYsVUFBckMsR0FBa0RXLGVBQWVYLFVBQWYsQ0FBOUQ7QUFBQSxVQUNJNlAsS0FBS3RWLGNBQWNnRyxXQUFXaEcsY0FBYyxDQUF2QyxHQUEyQ2dHLFdBQVdqRyxNQUQvRDs7QUFHQSxVQUFJTSxNQUFKLEVBQVk7QUFDVmlWLGNBQU1yVixhQUFhLENBQUMrRixXQUFXL0YsVUFBWixJQUEwQixDQUF2QyxHQUEyQyxDQUFDK0YsWUFBWUksZUFBZXpOLFFBQVEsQ0FBdkIsSUFBNEJ5TixlQUFlek4sS0FBZixDQUE1QixHQUFvRG9ILE1BQWhFLENBQUQsSUFBNEUsQ0FBN0g7QUFDRDs7QUFFRCxhQUFPckosU0FBUzRlLEVBQWhCO0FBQ0Q7O0FBRUQsYUFBU3hQLGlCQUFULEdBQThCO0FBQzVCSix1QkFBaUIsQ0FBakI7QUFDQSxXQUFLLElBQUlxSCxFQUFULElBQWU3SyxVQUFmLEVBQTJCO0FBQ3pCNkssYUFBS1csU0FBU1gsRUFBVCxDQUFMLENBRHlCLENBQ047QUFDbkIsWUFBSXBILGVBQWVvSCxFQUFuQixFQUF1QjtBQUFFckgsMkJBQWlCcUgsRUFBakI7QUFBc0I7QUFDaEQ7QUFDRjs7QUFFRDtBQUNBLFFBQUk0SCxjQUFlLFlBQVk7QUFDN0IsYUFBTzVTLE9BQ0wrQztBQUNFO0FBQ0Esa0JBQVk7QUFDVixZQUFJeVEsV0FBV2hPLFFBQWY7QUFBQSxZQUNJaU8sWUFBWWhPLFFBRGhCOztBQUdBK04sb0JBQVluVixPQUFaO0FBQ0FvVixxQkFBYXBWLE9BQWI7O0FBRUE7QUFDQTtBQUNBLFlBQUlKLFdBQUosRUFBaUI7QUFDZnVWLHNCQUFZLENBQVo7QUFDQUMsdUJBQWEsQ0FBYjtBQUNELFNBSEQsTUFHTyxJQUFJdlYsVUFBSixFQUFnQjtBQUNyQixjQUFJLENBQUMrRixXQUFXakcsTUFBWixLQUFxQkUsYUFBYUYsTUFBbEMsQ0FBSixFQUErQztBQUFFeVYseUJBQWEsQ0FBYjtBQUFpQjtBQUNuRTs7QUFFRCxZQUFJbFAsVUFBSixFQUFnQjtBQUNkLGNBQUkzTixRQUFRNmMsU0FBWixFQUF1QjtBQUNyQjdjLHFCQUFTOE0sVUFBVDtBQUNELFdBRkQsTUFFTyxJQUFJOU0sUUFBUTRjLFFBQVosRUFBc0I7QUFDM0I1YyxxQkFBUzhNLFVBQVQ7QUFDRDtBQUNGO0FBQ0YsT0F6Qkg7QUEwQkU7QUFDQSxrQkFBVztBQUNULFlBQUk5TSxRQUFRNk8sUUFBWixFQUFzQjtBQUNwQixpQkFBTzdPLFNBQVM0TyxXQUFXOUIsVUFBM0IsRUFBdUM7QUFBRTlNLHFCQUFTOE0sVUFBVDtBQUFzQjtBQUNoRSxTQUZELE1BRU8sSUFBSTlNLFFBQVE0TyxRQUFaLEVBQXNCO0FBQzNCLGlCQUFPNU8sU0FBUzZPLFdBQVcvQixVQUEzQixFQUF1QztBQUFFOU0scUJBQVM4TSxVQUFUO0FBQXNCO0FBQ2hFO0FBQ0YsT0FsQ0U7QUFtQ0w7QUFDQSxrQkFBVztBQUNUOU0sZ0JBQVF0QixLQUFLNlAsR0FBTCxDQUFTSyxRQUFULEVBQW1CbFEsS0FBSzhILEdBQUwsQ0FBU3FJLFFBQVQsRUFBbUI3TyxLQUFuQixDQUFuQixDQUFSO0FBQ0QsT0F0Q0g7QUF1Q0QsS0F4Q2lCLEVBQWxCOztBQTBDQSxhQUFTdVosU0FBVCxHQUFzQjtBQUNwQixVQUFJLENBQUNoUixRQUFELElBQWFNLGNBQWpCLEVBQWlDO0FBQUU1RixvQkFBWTRGLGNBQVo7QUFBOEI7QUFDakUsVUFBSSxDQUFDWixHQUFELElBQVFFLFlBQVosRUFBMEI7QUFBRWxGLG9CQUFZa0YsWUFBWjtBQUE0QjtBQUN4RCxVQUFJLENBQUNSLFFBQUwsRUFBZTtBQUNiLFlBQUlHLGlCQUFKLEVBQXVCO0FBQ3JCN0Usc0JBQVk2RSxpQkFBWjtBQUNELFNBRkQsTUFFTztBQUNMLGNBQUlDLFVBQUosRUFBZ0I7QUFBRTlFLHdCQUFZOEUsVUFBWjtBQUEwQjtBQUM1QyxjQUFJQyxVQUFKLEVBQWdCO0FBQUUvRSx3QkFBWStFLFVBQVo7QUFBMEI7QUFDN0M7QUFDRjtBQUNGOztBQUVELGFBQVM4VSxRQUFULEdBQXFCO0FBQ25CLFVBQUl2VSxZQUFZTSxjQUFoQixFQUFnQztBQUFFekYsb0JBQVl5RixjQUFaO0FBQThCO0FBQ2hFLFVBQUlaLE9BQU9FLFlBQVgsRUFBeUI7QUFBRS9FLG9CQUFZK0UsWUFBWjtBQUE0QjtBQUN2RCxVQUFJUixRQUFKLEVBQWM7QUFDWixZQUFJRyxpQkFBSixFQUF1QjtBQUNyQjFFLHNCQUFZMEUsaUJBQVo7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJQyxVQUFKLEVBQWdCO0FBQUUzRSx3QkFBWTJFLFVBQVo7QUFBMEI7QUFDNUMsY0FBSUMsVUFBSixFQUFnQjtBQUFFNUUsd0JBQVk0RSxVQUFaO0FBQTBCO0FBQzdDO0FBQ0Y7QUFDRjs7QUFFRCxhQUFTZ1MsWUFBVCxHQUF5QjtBQUN2QixVQUFJekssTUFBSixFQUFZO0FBQUU7QUFBUzs7QUFFdkI7QUFDQSxVQUFJbEksV0FBSixFQUFpQjtBQUFFbUYscUJBQWFyUCxLQUFiLENBQW1CNGYsTUFBbkIsR0FBNEIsS0FBNUI7QUFBb0M7O0FBRXZEO0FBQ0EsVUFBSXBQLFVBQUosRUFBZ0I7QUFDZCxZQUFJL1AsTUFBTSxpQkFBVjtBQUNBLGFBQUssSUFBSW5DLElBQUlrUyxVQUFiLEVBQXlCbFMsR0FBekIsR0FBK0I7QUFDN0IsY0FBSTBRLFFBQUosRUFBYztBQUFFdksscUJBQVNpTCxXQUFXcFIsQ0FBWCxDQUFULEVBQXdCbUMsR0FBeEI7QUFBK0I7QUFDL0NnRSxtQkFBU2lMLFdBQVdnQixnQkFBZ0JwUyxDQUFoQixHQUFvQixDQUEvQixDQUFULEVBQTRDbUMsR0FBNUM7QUFDRDtBQUNGOztBQUVEO0FBQ0EyYjs7QUFFQWhLLGVBQVMsSUFBVDtBQUNEOztBQUVELGFBQVM2TSxjQUFULEdBQTJCO0FBQ3pCLFVBQUksQ0FBQzdNLE1BQUwsRUFBYTtBQUFFO0FBQVM7O0FBRXhCO0FBQ0E7QUFDQSxVQUFJbEksZUFBZStELEtBQW5CLEVBQTBCO0FBQUVvQixxQkFBYXJQLEtBQWIsQ0FBbUI0ZixNQUFuQixHQUE0QixFQUE1QjtBQUFpQzs7QUFFN0Q7QUFDQSxVQUFJcFAsVUFBSixFQUFnQjtBQUNkLFlBQUkvUCxNQUFNLGlCQUFWO0FBQ0EsYUFBSyxJQUFJbkMsSUFBSWtTLFVBQWIsRUFBeUJsUyxHQUF6QixHQUErQjtBQUM3QixjQUFJMFEsUUFBSixFQUFjO0FBQUVySyx3QkFBWStLLFdBQVdwUixDQUFYLENBQVosRUFBMkJtQyxHQUEzQjtBQUFrQztBQUNsRGtFLHNCQUFZK0ssV0FBV2dCLGdCQUFnQnBTLENBQWhCLEdBQW9CLENBQS9CLENBQVosRUFBK0NtQyxHQUEvQztBQUNEO0FBQ0Y7O0FBRUQ7QUFDQWtmOztBQUVBdk4sZUFBUyxLQUFUO0FBQ0Q7O0FBRUQsYUFBU3dLLGFBQVQsR0FBMEI7QUFDeEIsVUFBSTNLLFFBQUosRUFBYztBQUFFO0FBQVM7O0FBRXpCeFAsWUFBTXdQLFFBQU4sR0FBaUIsSUFBakI7QUFDQXBJLGdCQUFVeEksU0FBVixHQUFzQndJLFVBQVV4SSxTQUFWLENBQW9CUCxPQUFwQixDQUE0QmdSLG9CQUFvQmdILFNBQXBCLENBQThCLENBQTlCLENBQTVCLEVBQThELEVBQTlELENBQXRCO0FBQ0F0VCxrQkFBWXFFLFNBQVosRUFBdUIsQ0FBQyxPQUFELENBQXZCO0FBQ0EsVUFBSW9DLElBQUosRUFBVTtBQUNSLGFBQUssSUFBSXZHLElBQUk4SyxVQUFiLEVBQXlCOUssR0FBekIsR0FBK0I7QUFDN0IsY0FBSXNKLFFBQUosRUFBYztBQUFFbEosd0JBQVk0SixXQUFXaEssQ0FBWCxDQUFaO0FBQTZCO0FBQzdDSSxzQkFBWTRKLFdBQVdnQixnQkFBZ0JoTCxDQUFoQixHQUFvQixDQUEvQixDQUFaO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUksQ0FBQ3lKLFVBQUQsSUFBZSxDQUFDSCxRQUFwQixFQUE4QjtBQUFFeEosb0JBQVk2SixZQUFaLEVBQTBCLENBQUMsT0FBRCxDQUExQjtBQUF1Qzs7QUFFdkU7QUFDQSxVQUFJLENBQUNMLFFBQUwsRUFBZTtBQUNiLGFBQUssSUFBSTFRLElBQUl1RSxLQUFSLEVBQWVzQixJQUFJdEIsUUFBUThNLFVBQWhDLEVBQTRDclIsSUFBSTZGLENBQWhELEVBQW1EN0YsR0FBbkQsRUFBd0Q7QUFDdEQsY0FBSTRHLE9BQU93SyxXQUFXcFIsQ0FBWCxDQUFYO0FBQ0FrSCxzQkFBWU4sSUFBWixFQUFrQixDQUFDLE9BQUQsQ0FBbEI7QUFDQVAsc0JBQVlPLElBQVosRUFBa0IyRyxTQUFsQjtBQUNBbEgsc0JBQVlPLElBQVosRUFBa0I2RyxhQUFsQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQXFROztBQUVBbkssaUJBQVcsSUFBWDtBQUNEOztBQUVELGFBQVM2TSxZQUFULEdBQXlCO0FBQ3ZCLFVBQUksQ0FBQzdNLFFBQUwsRUFBZTtBQUFFO0FBQVM7O0FBRTFCeFAsWUFBTXdQLFFBQU4sR0FBaUIsS0FBakI7QUFDQXBJLGdCQUFVeEksU0FBVixJQUF1QnlRLG1CQUF2QjtBQUNBcUk7O0FBRUEsVUFBSWxPLElBQUosRUFBVTtBQUNSLGFBQUssSUFBSXZHLElBQUk4SyxVQUFiLEVBQXlCOUssR0FBekIsR0FBK0I7QUFDN0IsY0FBSXNKLFFBQUosRUFBYztBQUFFL0ksd0JBQVl5SixXQUFXaEssQ0FBWCxDQUFaO0FBQTZCO0FBQzdDTyxzQkFBWXlKLFdBQVdnQixnQkFBZ0JoTCxDQUFoQixHQUFvQixDQUEvQixDQUFaO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUksQ0FBQ3NKLFFBQUwsRUFBZTtBQUNiLGFBQUssSUFBSTFRLElBQUl1RSxLQUFSLEVBQWVzQixJQUFJdEIsUUFBUThNLFVBQWhDLEVBQTRDclIsSUFBSTZGLENBQWhELEVBQW1EN0YsR0FBbkQsRUFBd0Q7QUFDdEQsY0FBSTRHLE9BQU93SyxXQUFXcFIsQ0FBWCxDQUFYO0FBQUEsY0FDSXVoQixTQUFTdmhCLElBQUl1RSxRQUFRbUgsS0FBWixHQUFvQjZCLFNBQXBCLEdBQWdDRSxhQUQ3QztBQUVBN0csZUFBS2xGLEtBQUwsQ0FBVzBCLElBQVgsR0FBa0IsQ0FBQ3BELElBQUl1RSxLQUFMLElBQWMsR0FBZCxHQUFvQm1ILEtBQXBCLEdBQTRCLEdBQTlDO0FBQ0F2RixtQkFBU1MsSUFBVCxFQUFlMmEsTUFBZjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQUY7O0FBRUExTixpQkFBVyxLQUFYO0FBQ0Q7O0FBRUQsYUFBU29OLGdCQUFULEdBQTZCO0FBQzNCLFVBQUk1ZSxNQUFNaWIsa0JBQVY7QUFDQSxVQUFJdkgsa0JBQWtCN1MsU0FBbEIsS0FBZ0NiLEdBQXBDLEVBQXlDO0FBQUUwVCwwQkFBa0I3UyxTQUFsQixHQUE4QmIsR0FBOUI7QUFBb0M7QUFDaEY7O0FBRUQsYUFBU2liLGdCQUFULEdBQTZCO0FBQzNCLFVBQUkxWCxNQUFNOGIsc0JBQVY7QUFBQSxVQUNJQyxRQUFRL2IsSUFBSSxDQUFKLElBQVMsQ0FEckI7QUFBQSxVQUVJZ2MsTUFBTWhjLElBQUksQ0FBSixJQUFTLENBRm5CO0FBR0EsYUFBTytiLFVBQVVDLEdBQVYsR0FBZ0JELFFBQVEsRUFBeEIsR0FBNkJBLFFBQVEsTUFBUixHQUFpQkMsR0FBckQ7QUFDRDs7QUFFRCxhQUFTRixvQkFBVCxDQUErQm5mLEdBQS9CLEVBQW9DO0FBQ2xDLFVBQUlBLE9BQU8sSUFBWCxFQUFpQjtBQUFFQSxjQUFNcWUsNEJBQU47QUFBcUM7QUFDeEQsVUFBSWUsUUFBUWxkLEtBQVo7QUFBQSxVQUFtQm1kLEdBQW5CO0FBQUEsVUFBd0JDLFVBQXhCO0FBQUEsVUFBb0NDLFFBQXBDOztBQUVBO0FBQ0EsVUFBSTNWLFVBQVVMLFdBQWQsRUFBMkI7QUFDekIsWUFBSUUsYUFBYUQsVUFBakIsRUFBNkI7QUFDM0I4Vix1QkFBYSxFQUFHRSxXQUFXeGYsR0FBWCxJQUFrQnVKLFdBQXJCLENBQWI7QUFDQWdXLHFCQUFXRCxhQUFhL1AsUUFBYixHQUF3QmhHLGNBQWMsQ0FBakQ7QUFDRDtBQUNGLE9BTEQsTUFLTztBQUNMLFlBQUlFLFNBQUosRUFBZTtBQUNiNlYsdUJBQWEzUCxlQUFlek4sS0FBZixDQUFiO0FBQ0FxZCxxQkFBV0QsYUFBYS9QLFFBQXhCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0EsVUFBSTlGLFNBQUosRUFBZTtBQUNia0csdUJBQWV2TSxPQUFmLENBQXVCLFVBQVNxYyxLQUFULEVBQWdCOWhCLENBQWhCLEVBQW1CO0FBQ3hDLGNBQUlBLElBQUlvUyxhQUFSLEVBQXVCO0FBQ3JCLGdCQUFJLENBQUNuRyxVQUFVTCxXQUFYLEtBQTJCa1csU0FBU0gsYUFBYSxHQUFyRCxFQUEwRDtBQUFFRixzQkFBUXpoQixDQUFSO0FBQVk7QUFDeEUsZ0JBQUk0aEIsV0FBV0UsS0FBWCxJQUFvQixHQUF4QixFQUE2QjtBQUFFSixvQkFBTTFoQixDQUFOO0FBQVU7QUFDMUM7QUFDRixTQUxEOztBQU9GO0FBQ0MsT0FURCxNQVNPOztBQUVMLFlBQUk2TCxVQUFKLEVBQWdCO0FBQ2QsY0FBSWtXLE9BQU9sVyxhQUFhRixNQUF4QjtBQUNBLGNBQUlNLFVBQVVMLFdBQWQsRUFBMkI7QUFDekI2VixvQkFBUXhlLEtBQUs2TyxLQUFMLENBQVc2UCxhQUFXSSxJQUF0QixDQUFSO0FBQ0FMLGtCQUFNemUsS0FBSzRQLElBQUwsQ0FBVStPLFdBQVNHLElBQVQsR0FBZ0IsQ0FBMUIsQ0FBTjtBQUNELFdBSEQsTUFHTztBQUNMTCxrQkFBTUQsUUFBUXhlLEtBQUs0UCxJQUFMLENBQVVqQixXQUFTbVEsSUFBbkIsQ0FBUixHQUFtQyxDQUF6QztBQUNEO0FBRUYsU0FURCxNQVNPO0FBQ0wsY0FBSTlWLFVBQVVMLFdBQWQsRUFBMkI7QUFDekIsZ0JBQUltTSxJQUFJck0sUUFBUSxDQUFoQjtBQUNBLGdCQUFJTyxNQUFKLEVBQVk7QUFDVndWLHVCQUFTMUosSUFBSSxDQUFiO0FBQ0EySixvQkFBTW5kLFFBQVF3VCxJQUFJLENBQWxCO0FBQ0QsYUFIRCxNQUdPO0FBQ0wySixvQkFBTW5kLFFBQVF3VCxDQUFkO0FBQ0Q7O0FBRUQsZ0JBQUluTSxXQUFKLEVBQWlCO0FBQ2Ysa0JBQUlvTSxJQUFJcE0sY0FBY0YsS0FBZCxHQUFzQmtHLFFBQTlCO0FBQ0E2UCx1QkFBU3pKLENBQVQ7QUFDQTBKLHFCQUFPMUosQ0FBUDtBQUNEOztBQUVEeUosb0JBQVF4ZSxLQUFLNk8sS0FBTCxDQUFXMlAsS0FBWCxDQUFSO0FBQ0FDLGtCQUFNemUsS0FBSzRQLElBQUwsQ0FBVTZPLEdBQVYsQ0FBTjtBQUNELFdBakJELE1BaUJPO0FBQ0xBLGtCQUFNRCxRQUFRL1YsS0FBUixHQUFnQixDQUF0QjtBQUNEO0FBQ0Y7O0FBRUQrVixnQkFBUXhlLEtBQUs2UCxHQUFMLENBQVMyTyxLQUFULEVBQWdCLENBQWhCLENBQVI7QUFDQUMsY0FBTXplLEtBQUs4SCxHQUFMLENBQVMyVyxHQUFULEVBQWN0UCxnQkFBZ0IsQ0FBOUIsQ0FBTjtBQUNEOztBQUVELGFBQU8sQ0FBQ3FQLEtBQUQsRUFBUUMsR0FBUixDQUFQO0FBQ0Q7O0FBRUQsYUFBU3JELFVBQVQsR0FBdUI7QUFDckIsVUFBSXRRLFlBQVksQ0FBQzJGLE9BQWpCLEVBQTBCO0FBQ3hCaUksc0JBQWMvQyxLQUFkLENBQW9CLElBQXBCLEVBQTBCNEksc0JBQTFCLEVBQWtEL2IsT0FBbEQsQ0FBMEQsVUFBVThWLEdBQVYsRUFBZTtBQUN2RSxjQUFJLENBQUN4VixTQUFTd1YsR0FBVCxFQUFjL0YsZ0JBQWQsQ0FBTCxFQUFzQztBQUNwQztBQUNBLGdCQUFJdUksTUFBTSxFQUFWO0FBQ0FBLGdCQUFJN04sYUFBSixJQUFxQixVQUFVclAsQ0FBVixFQUFhO0FBQUVBLGdCQUFFbWhCLGVBQUY7QUFBc0IsYUFBMUQ7QUFDQXJZLHNCQUFVNFIsR0FBVixFQUFld0MsR0FBZjs7QUFFQXBVLHNCQUFVNFIsR0FBVixFQUFlOUYsU0FBZjs7QUFFQTtBQUNBOEYsZ0JBQUlDLEdBQUosR0FBVS9VLFFBQVE4VSxHQUFSLEVBQWEsVUFBYixDQUFWOztBQUVBO0FBQ0EsZ0JBQUkwRyxTQUFTeGIsUUFBUThVLEdBQVIsRUFBYSxhQUFiLENBQWI7QUFDQSxnQkFBSTBHLE1BQUosRUFBWTtBQUFFMUcsa0JBQUkwRyxNQUFKLEdBQWFBLE1BQWI7QUFBc0I7O0FBRXBDOWIscUJBQVNvVixHQUFULEVBQWMsU0FBZDtBQUNEO0FBQ0YsU0FsQkQ7QUFtQkQ7QUFDRjs7QUFFRCxhQUFTN0YsV0FBVCxDQUFzQjdVLENBQXRCLEVBQXlCO0FBQ3ZCNGEsZ0JBQVV5RyxVQUFVcmhCLENBQVYsQ0FBVjtBQUNEOztBQUVELGFBQVM4VSxXQUFULENBQXNCOVUsQ0FBdEIsRUFBeUI7QUFDdkJzaEIsZ0JBQVVELFVBQVVyaEIsQ0FBVixDQUFWO0FBQ0Q7O0FBRUQsYUFBUzRhLFNBQVQsQ0FBb0JGLEdBQXBCLEVBQXlCO0FBQ3ZCcFYsZUFBU29WLEdBQVQsRUFBYyxRQUFkO0FBQ0E2RyxtQkFBYTdHLEdBQWI7QUFDRDs7QUFFRCxhQUFTNEcsU0FBVCxDQUFvQjVHLEdBQXBCLEVBQXlCO0FBQ3ZCcFYsZUFBU29WLEdBQVQsRUFBYyxRQUFkO0FBQ0E2RyxtQkFBYTdHLEdBQWI7QUFDRDs7QUFFRCxhQUFTNkcsWUFBVCxDQUF1QjdHLEdBQXZCLEVBQTRCO0FBQzFCcFYsZUFBU29WLEdBQVQsRUFBYyxjQUFkO0FBQ0FsVixrQkFBWWtWLEdBQVosRUFBaUIsU0FBakI7QUFDQXpSLG1CQUFheVIsR0FBYixFQUFrQjlGLFNBQWxCO0FBQ0Q7O0FBRUQsYUFBU2tHLGFBQVQsQ0FBd0I4RixLQUF4QixFQUErQkMsR0FBL0IsRUFBb0M7QUFDbEMsVUFBSXJHLE9BQU8sRUFBWDtBQUNBLGFBQU9vRyxTQUFTQyxHQUFoQixFQUFxQjtBQUNuQmpjLGdCQUFRMkwsV0FBV3FRLEtBQVgsRUFBa0JuRyxnQkFBbEIsQ0FBbUMsS0FBbkMsQ0FBUixFQUFtRCxVQUFVQyxHQUFWLEVBQWU7QUFBRUYsZUFBSzljLElBQUwsQ0FBVWdkLEdBQVY7QUFBaUIsU0FBckY7QUFDQWtHO0FBQ0Q7O0FBRUQsYUFBT3BHLElBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsYUFBUytDLFlBQVQsR0FBeUI7QUFDdkIsVUFBSS9DLE9BQU9NLGNBQWMvQyxLQUFkLENBQW9CLElBQXBCLEVBQTBCNEksc0JBQTFCLENBQVg7QUFDQTFpQixVQUFJLFlBQVU7QUFBRTRjLHdCQUFnQkwsSUFBaEIsRUFBc0JnSCx3QkFBdEI7QUFBa0QsT0FBbEU7QUFDRDs7QUFFRCxhQUFTM0csZUFBVCxDQUEwQkwsSUFBMUIsRUFBZ0NsYyxFQUFoQyxFQUFvQztBQUNsQztBQUNBLFVBQUl5VyxZQUFKLEVBQWtCO0FBQUUsZUFBT3pXLElBQVA7QUFBYzs7QUFFbEM7QUFDQWtjLFdBQUs1VixPQUFMLENBQWEsVUFBVThWLEdBQVYsRUFBZWhYLEtBQWYsRUFBc0I7QUFDakMsWUFBSXdCLFNBQVN3VixHQUFULEVBQWMvRixnQkFBZCxDQUFKLEVBQXFDO0FBQUU2RixlQUFLL1EsTUFBTCxDQUFZL0YsS0FBWixFQUFtQixDQUFuQjtBQUF3QjtBQUNoRSxPQUZEOztBQUlBO0FBQ0EsVUFBSSxDQUFDOFcsS0FBS3BiLE1BQVYsRUFBa0I7QUFBRSxlQUFPZCxJQUFQO0FBQWM7O0FBRWxDO0FBQ0FMLFVBQUksWUFBVTtBQUFFNGMsd0JBQWdCTCxJQUFoQixFQUFzQmxjLEVBQXRCO0FBQTRCLE9BQTVDO0FBQ0Q7O0FBRUQsYUFBU3FmLGlCQUFULEdBQThCO0FBQzVCSDtBQUNBbkI7QUFDQTZEO0FBQ0FsRDtBQUNBeUU7QUFDRDs7QUFHRCxhQUFTOUYsbUNBQVQsR0FBZ0Q7QUFDOUMsVUFBSTlMLFlBQVk3QyxVQUFoQixFQUE0QjtBQUMxQm1ELHNCQUFjdFAsS0FBZCxDQUFvQm9PLGtCQUFwQixJQUEwQ2pELFFBQVEsSUFBUixHQUFlLEdBQXpEO0FBQ0Q7QUFDRjs7QUFFRCxhQUFTMFYsaUJBQVQsQ0FBNEJDLFVBQTVCLEVBQXdDQyxVQUF4QyxFQUFvRDtBQUNsRCxVQUFJQyxVQUFVLEVBQWQ7QUFDQSxXQUFLLElBQUkxaUIsSUFBSXdpQixVQUFSLEVBQW9CM2MsSUFBSTVDLEtBQUs4SCxHQUFMLENBQVN5WCxhQUFhQyxVQUF0QixFQUFrQ3JRLGFBQWxDLENBQTdCLEVBQStFcFMsSUFBSTZGLENBQW5GLEVBQXNGN0YsR0FBdEYsRUFBMkY7QUFDekYwaUIsZ0JBQVFua0IsSUFBUixDQUFhNlMsV0FBV3BSLENBQVgsRUFBYytCLFlBQTNCO0FBQ0Q7O0FBRUQsYUFBT2tCLEtBQUs2UCxHQUFMLENBQVM4RixLQUFULENBQWUsSUFBZixFQUFxQjhKLE9BQXJCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBU0wsd0JBQVQsR0FBcUM7QUFDbkMsVUFBSU0sWUFBWTlVLGFBQWEwVSxrQkFBa0JoZSxLQUFsQixFQUF5Qm1ILEtBQXpCLENBQWIsR0FBK0M2VyxrQkFBa0JyUSxVQUFsQixFQUE4QmIsVUFBOUIsQ0FBL0Q7QUFBQSxVQUNJd0osS0FBSzdKLGdCQUFnQkEsYUFBaEIsR0FBZ0NELFlBRHpDOztBQUdBLFVBQUk4SixHQUFHblosS0FBSCxDQUFTbWYsTUFBVCxLQUFvQjhCLFNBQXhCLEVBQW1DO0FBQUU5SCxXQUFHblosS0FBSCxDQUFTbWYsTUFBVCxHQUFrQjhCLFlBQVksSUFBOUI7QUFBcUM7QUFDM0U7O0FBRUQ7QUFDQTtBQUNBLGFBQVN4RyxpQkFBVCxHQUE4QjtBQUM1Qm5LLHVCQUFpQixDQUFDLENBQUQsQ0FBakI7QUFDQSxVQUFJekwsT0FBT3NLLGFBQWEsTUFBYixHQUFzQixLQUFqQztBQUFBLFVBQ0krUixRQUFRL1IsYUFBYSxPQUFiLEdBQXVCLFFBRG5DO0FBQUEsVUFFSWdTLE9BQU96UixXQUFXLENBQVgsRUFBY2pPLHFCQUFkLEdBQXNDb0QsSUFBdEMsQ0FGWDs7QUFJQWQsY0FBUTJMLFVBQVIsRUFBb0IsVUFBU3hLLElBQVQsRUFBZTVHLENBQWYsRUFBa0I7QUFDcEM7QUFDQSxZQUFJQSxDQUFKLEVBQU87QUFBRWdTLHlCQUFlelQsSUFBZixDQUFvQnFJLEtBQUt6RCxxQkFBTCxHQUE2Qm9ELElBQTdCLElBQXFDc2MsSUFBekQ7QUFBaUU7QUFDMUU7QUFDQSxZQUFJN2lCLE1BQU1vUyxnQkFBZ0IsQ0FBMUIsRUFBNkI7QUFBRUoseUJBQWV6VCxJQUFmLENBQW9CcUksS0FBS3pELHFCQUFMLEdBQTZCeWYsS0FBN0IsSUFBc0NDLElBQTFEO0FBQWtFO0FBQ2xHLE9BTEQ7QUFNRDs7QUFFRDtBQUNBLGFBQVMzRixpQkFBVCxHQUE4QjtBQUM1QixVQUFJNVgsUUFBUWtjLHNCQUFaO0FBQUEsVUFDSUMsUUFBUW5jLE1BQU0sQ0FBTixDQURaO0FBQUEsVUFFSW9jLE1BQU1wYyxNQUFNLENBQU4sQ0FGVjs7QUFJQUcsY0FBUTJMLFVBQVIsRUFBb0IsVUFBU3hLLElBQVQsRUFBZTVHLENBQWYsRUFBa0I7QUFDcEM7QUFDQSxZQUFJQSxLQUFLeWhCLEtBQUwsSUFBY3poQixLQUFLMGhCLEdBQXZCLEVBQTRCO0FBQzFCLGNBQUlwYixRQUFRTSxJQUFSLEVBQWMsYUFBZCxDQUFKLEVBQWtDO0FBQ2hDTSx3QkFBWU4sSUFBWixFQUFrQixDQUFDLGFBQUQsRUFBZ0IsVUFBaEIsQ0FBbEI7QUFDQVQscUJBQVNTLElBQVQsRUFBZTJPLGdCQUFmO0FBQ0Q7QUFDSDtBQUNDLFNBTkQsTUFNTztBQUNMLGNBQUksQ0FBQ2pQLFFBQVFNLElBQVIsRUFBYyxhQUFkLENBQUwsRUFBbUM7QUFDakNDLHFCQUFTRCxJQUFULEVBQWU7QUFDYiw2QkFBZSxNQURGO0FBRWIsMEJBQVk7QUFGQyxhQUFmO0FBSUFQLHdCQUFZTyxJQUFaLEVBQWtCMk8sZ0JBQWxCO0FBQ0Q7QUFDRjtBQUNGLE9BakJEO0FBa0JEOztBQUVEO0FBQ0EsYUFBU3lMLDJCQUFULEdBQXdDO0FBQ3RDLFVBQUluYixJQUFJdEIsUUFBUXRCLEtBQUs4SCxHQUFMLENBQVNzRyxVQUFULEVBQXFCM0YsS0FBckIsQ0FBaEI7QUFDQSxXQUFLLElBQUkxTCxJQUFJb1MsYUFBYixFQUE0QnBTLEdBQTVCLEdBQWtDO0FBQ2hDLFlBQUk0RyxPQUFPd0ssV0FBV3BSLENBQVgsQ0FBWDs7QUFFQSxZQUFJQSxLQUFLdUUsS0FBTCxJQUFjdkUsSUFBSTZGLENBQXRCLEVBQXlCO0FBQ3ZCO0FBQ0FNLG1CQUFTUyxJQUFULEVBQWUsWUFBZjs7QUFFQUEsZUFBS2xGLEtBQUwsQ0FBVzBCLElBQVgsR0FBa0IsQ0FBQ3BELElBQUl1RSxLQUFMLElBQWMsR0FBZCxHQUFvQm1ILEtBQXBCLEdBQTRCLEdBQTlDO0FBQ0F2RixtQkFBU1MsSUFBVCxFQUFlMkcsU0FBZjtBQUNBbEgsc0JBQVlPLElBQVosRUFBa0I2RyxhQUFsQjtBQUNELFNBUEQsTUFPTyxJQUFJN0csS0FBS2xGLEtBQUwsQ0FBVzBCLElBQWYsRUFBcUI7QUFDMUJ3RCxlQUFLbEYsS0FBTCxDQUFXMEIsSUFBWCxHQUFrQixFQUFsQjtBQUNBK0MsbUJBQVNTLElBQVQsRUFBZTZHLGFBQWY7QUFDQXBILHNCQUFZTyxJQUFaLEVBQWtCMkcsU0FBbEI7QUFDRDs7QUFFRDtBQUNBbEgsb0JBQVlPLElBQVosRUFBa0I0RyxVQUFsQjtBQUNEOztBQUVEO0FBQ0FwTyxpQkFBVyxZQUFXO0FBQ3BCcUcsZ0JBQVEyTCxVQUFSLEVBQW9CLFVBQVNwTCxFQUFULEVBQWE7QUFDL0JLLHNCQUFZTCxFQUFaLEVBQWdCLFlBQWhCO0FBQ0QsU0FGRDtBQUdELE9BSkQsRUFJRyxHQUpIO0FBS0Q7O0FBRUQ7QUFDQSxhQUFTc2MsZUFBVCxHQUE0QjtBQUMxQjtBQUNBLFVBQUk5VixHQUFKLEVBQVM7QUFDUGtLLDBCQUFrQkQsY0FBYyxDQUFkLEdBQWtCQSxVQUFsQixHQUErQkUsb0JBQWpEO0FBQ0FGLHFCQUFhLENBQUMsQ0FBZDs7QUFFQSxZQUFJQyxvQkFBb0JFLHFCQUF4QixFQUErQztBQUM3QyxjQUFJa00sVUFBVXpNLFNBQVNPLHFCQUFULENBQWQ7QUFBQSxjQUNJbU0sYUFBYTFNLFNBQVNLLGVBQVQsQ0FEakI7O0FBR0E3UCxtQkFBU2ljLE9BQVQsRUFBa0I7QUFDaEIsd0JBQVksSUFESTtBQUVoQiwwQkFBY2hNLFVBQVVGLHdCQUF3QixDQUFsQztBQUZFLFdBQWxCO0FBSUF2USxzQkFBWXljLE9BQVosRUFBcUJqTSxjQUFyQjs7QUFFQWhRLG1CQUFTa2MsVUFBVCxFQUFxQixFQUFDLGNBQWNqTSxVQUFVSixrQkFBa0IsQ0FBNUIsSUFBaUNLLGFBQWhELEVBQXJCO0FBQ0E3UCxzQkFBWTZiLFVBQVosRUFBd0IsVUFBeEI7QUFDQTVjLG1CQUFTNGMsVUFBVCxFQUFxQmxNLGNBQXJCOztBQUVBRCxrQ0FBd0JGLGVBQXhCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELGFBQVNzTSxvQkFBVCxDQUErQmhkLEVBQS9CLEVBQW1DO0FBQ2pDLGFBQU9BLEdBQUd5SyxRQUFILENBQVk3SCxXQUFaLEVBQVA7QUFDRDs7QUFFRCxhQUFTZ1YsUUFBVCxDQUFtQjVYLEVBQW5CLEVBQXVCO0FBQ3JCLGFBQU9nZCxxQkFBcUJoZCxFQUFyQixNQUE2QixRQUFwQztBQUNEOztBQUVELGFBQVNpZCxjQUFULENBQXlCamQsRUFBekIsRUFBNkI7QUFDM0IsYUFBT0EsR0FBR1UsWUFBSCxDQUFnQixlQUFoQixNQUFxQyxNQUE1QztBQUNEOztBQUVELGFBQVN3YyxnQkFBVCxDQUEyQnRGLFFBQTNCLEVBQXFDNVgsRUFBckMsRUFBeUMzRCxHQUF6QyxFQUE4QztBQUM1QyxVQUFJdWIsUUFBSixFQUFjO0FBQ1o1WCxXQUFHMk4sUUFBSCxHQUFjdFIsR0FBZDtBQUNELE9BRkQsTUFFTztBQUNMMkQsV0FBRy9CLFlBQUgsQ0FBZ0IsZUFBaEIsRUFBaUM1QixJQUFJNEUsUUFBSixFQUFqQztBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxhQUFTNFcsb0JBQVQsR0FBaUM7QUFDL0IsVUFBSSxDQUFDM1IsUUFBRCxJQUFhMEIsTUFBYixJQUF1QkQsSUFBM0IsRUFBaUM7QUFBRTtBQUFTOztBQUU1QyxVQUFJd1YsZUFBZ0JqTixZQUFELEdBQWlCNUosV0FBV3FILFFBQTVCLEdBQXVDc1AsZUFBZTNXLFVBQWYsQ0FBMUQ7QUFBQSxVQUNJOFcsZUFBZ0JqTixZQUFELEdBQWlCNUosV0FBV29ILFFBQTVCLEdBQXVDc1AsZUFBZTFXLFVBQWYsQ0FEMUQ7QUFBQSxVQUVJOFcsY0FBZTllLFNBQVM0TyxRQUFWLEdBQXNCLElBQXRCLEdBQTZCLEtBRi9DO0FBQUEsVUFHSW1RLGNBQWUsQ0FBQzFWLE1BQUQsSUFBV3JKLFNBQVM2TyxRQUFyQixHQUFpQyxJQUFqQyxHQUF3QyxLQUgxRDs7QUFLQSxVQUFJaVEsZUFBZSxDQUFDRixZQUFwQixFQUFrQztBQUNoQ0QseUJBQWlCaE4sWUFBakIsRUFBK0I1SixVQUEvQixFQUEyQyxJQUEzQztBQUNEO0FBQ0QsVUFBSSxDQUFDK1csV0FBRCxJQUFnQkYsWUFBcEIsRUFBa0M7QUFDaENELHlCQUFpQmhOLFlBQWpCLEVBQStCNUosVUFBL0IsRUFBMkMsS0FBM0M7QUFDRDtBQUNELFVBQUlnWCxlQUFlLENBQUNGLFlBQXBCLEVBQWtDO0FBQ2hDRix5QkFBaUIvTSxZQUFqQixFQUErQjVKLFVBQS9CLEVBQTJDLElBQTNDO0FBQ0Q7QUFDRCxVQUFJLENBQUMrVyxXQUFELElBQWdCRixZQUFwQixFQUFrQztBQUNoQ0YseUJBQWlCL00sWUFBakIsRUFBK0I1SixVQUEvQixFQUEyQyxLQUEzQztBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxhQUFTZ1gsYUFBVCxDQUF3QnZkLEVBQXhCLEVBQTRCN0QsR0FBNUIsRUFBaUM7QUFDL0IsVUFBSTJOLGtCQUFKLEVBQXdCO0FBQUU5SixXQUFHdEUsS0FBSCxDQUFTb08sa0JBQVQsSUFBK0IzTixHQUEvQjtBQUFxQztBQUNoRTs7QUFFRCxhQUFTcWhCLGNBQVQsR0FBMkI7QUFDekIsYUFBTzNYLGFBQWEsQ0FBQ0EsYUFBYUYsTUFBZCxJQUF3QnlHLGFBQXJDLEdBQXFESixlQUFlSSxhQUFmLENBQTVEO0FBQ0Q7O0FBRUQsYUFBU3FSLFlBQVQsQ0FBdUJsSixHQUF2QixFQUE0QjtBQUMxQixVQUFJQSxPQUFPLElBQVgsRUFBaUI7QUFBRUEsY0FBTWhXLEtBQU47QUFBYzs7QUFFakMsVUFBSWlCLE1BQU1vRyxjQUFjRCxNQUFkLEdBQXVCLENBQWpDO0FBQ0EsYUFBT0csWUFBWSxDQUFFOEYsV0FBV3BNLEdBQVosSUFBb0J3TSxlQUFldUksTUFBTSxDQUFyQixJQUEwQnZJLGVBQWV1SSxHQUFmLENBQTFCLEdBQWdENU8sTUFBcEUsQ0FBRCxJQUE4RSxDQUExRixHQUNMRSxhQUFhLENBQUMrRixXQUFXL0YsVUFBWixJQUEwQixDQUF2QyxHQUNFLENBQUNILFFBQVEsQ0FBVCxJQUFjLENBRmxCO0FBR0Q7O0FBRUQsYUFBUzZHLGdCQUFULEdBQTZCO0FBQzNCLFVBQUkvTSxNQUFNb0csY0FBY0QsTUFBZCxHQUF1QixDQUFqQztBQUFBLFVBQ0l6SixTQUFVMFAsV0FBV3BNLEdBQVosR0FBbUJnZSxnQkFEaEM7O0FBR0EsVUFBSXZYLFVBQVUsQ0FBQzBCLElBQWYsRUFBcUI7QUFDbkJ6TCxpQkFBUzJKLGFBQWEsRUFBR0EsYUFBYUYsTUFBaEIsS0FBMkJ5RyxnQkFBZ0IsQ0FBM0MsSUFBZ0RxUixjQUE3RCxHQUNQQSxhQUFhclIsZ0JBQWdCLENBQTdCLElBQWtDSixlQUFlSSxnQkFBZ0IsQ0FBL0IsQ0FEcEM7QUFFRDtBQUNELFVBQUlsUSxTQUFTLENBQWIsRUFBZ0I7QUFBRUEsaUJBQVMsQ0FBVDtBQUFhOztBQUUvQixhQUFPQSxNQUFQO0FBQ0Q7O0FBRUQsYUFBU3dlLDBCQUFULENBQXFDbkcsR0FBckMsRUFBMEM7QUFDeEMsVUFBSUEsT0FBTyxJQUFYLEVBQWlCO0FBQUVBLGNBQU1oVyxLQUFOO0FBQWM7O0FBRWpDLFVBQUlsQyxHQUFKO0FBQ0EsVUFBSXdPLGNBQWMsQ0FBQy9FLFNBQW5CLEVBQThCO0FBQzVCLFlBQUlELFVBQUosRUFBZ0I7QUFDZHhKLGdCQUFNLEVBQUd3SixhQUFhRixNQUFoQixJQUEwQjRPLEdBQWhDO0FBQ0EsY0FBSXRPLE1BQUosRUFBWTtBQUFFNUosbUJBQU9vaEIsY0FBUDtBQUF3QjtBQUN2QyxTQUhELE1BR087QUFDTCxjQUFJQyxjQUFjOVQsWUFBWXdDLGFBQVosR0FBNEIxRyxLQUE5QztBQUNBLGNBQUlPLE1BQUosRUFBWTtBQUFFc08sbUJBQU9rSixjQUFQO0FBQXdCO0FBQ3RDcGhCLGdCQUFNLENBQUVrWSxHQUFGLEdBQVEsR0FBUixHQUFjbUosV0FBcEI7QUFDRDtBQUNGLE9BVEQsTUFTTztBQUNMcmhCLGNBQU0sQ0FBRTJQLGVBQWV1SSxHQUFmLENBQVI7QUFDQSxZQUFJdE8sVUFBVUgsU0FBZCxFQUF5QjtBQUN2QnpKLGlCQUFPb2hCLGNBQVA7QUFDRDtBQUNGOztBQUVELFVBQUlwUixnQkFBSixFQUFzQjtBQUFFaFEsY0FBTVksS0FBSzZQLEdBQUwsQ0FBU3pRLEdBQVQsRUFBY2lRLGFBQWQsQ0FBTjtBQUFxQzs7QUFFN0RqUSxhQUFRd08sY0FBYyxDQUFDL0UsU0FBZixJQUE0QixDQUFDRCxVQUE5QixHQUE0QyxHQUE1QyxHQUFrRCxJQUF6RDs7QUFFQSxhQUFPeEosR0FBUDtBQUNEOztBQUVELGFBQVN3WiwwQkFBVCxDQUFxQ3haLEdBQXJDLEVBQTBDO0FBQ3hDa2hCLG9CQUFjaFksU0FBZCxFQUF5QixJQUF6QjtBQUNBa1YsMkJBQXFCcGUsR0FBckI7QUFDRDs7QUFFRCxhQUFTb2Usb0JBQVQsQ0FBK0JwZSxHQUEvQixFQUFvQztBQUNsQyxVQUFJQSxPQUFPLElBQVgsRUFBaUI7QUFBRUEsY0FBTXFlLDRCQUFOO0FBQXFDO0FBQ3hEblYsZ0JBQVU3SixLQUFWLENBQWdCK1EsYUFBaEIsSUFBaUNDLGtCQUFrQnJRLEdBQWxCLEdBQXdCc1EsZ0JBQXpEO0FBQ0Q7O0FBRUQsYUFBU2dSLFlBQVQsQ0FBdUJDLE1BQXZCLEVBQStCQyxRQUEvQixFQUF5Q0MsT0FBekMsRUFBa0RDLEtBQWxELEVBQXlEO0FBQ3ZELFVBQUlsZSxJQUFJK2QsU0FBU2xZLEtBQWpCO0FBQ0EsVUFBSSxDQUFDaUMsSUFBTCxFQUFXO0FBQUU5SCxZQUFJNUMsS0FBSzhILEdBQUwsQ0FBU2xGLENBQVQsRUFBWXVNLGFBQVosQ0FBSjtBQUFpQzs7QUFFOUMsV0FBSyxJQUFJcFMsSUFBSTRqQixNQUFiLEVBQXFCNWpCLElBQUk2RixDQUF6QixFQUE0QjdGLEdBQTVCLEVBQWlDO0FBQzdCLFlBQUk0RyxPQUFPd0ssV0FBV3BSLENBQVgsQ0FBWDs7QUFFRjtBQUNBLFlBQUksQ0FBQytqQixLQUFMLEVBQVk7QUFBRW5kLGVBQUtsRixLQUFMLENBQVcwQixJQUFYLEdBQWtCLENBQUNwRCxJQUFJdUUsS0FBTCxJQUFjLEdBQWQsR0FBb0JtSCxLQUFwQixHQUE0QixHQUE5QztBQUFvRDs7QUFFbEUsWUFBSWdDLGdCQUFnQnFDLGVBQXBCLEVBQXFDO0FBQ25DbkosZUFBS2xGLEtBQUwsQ0FBV3FPLGVBQVgsSUFBOEJuSixLQUFLbEYsS0FBTCxDQUFXdU8sY0FBWCxJQUE2QnZDLGdCQUFnQjFOLElBQUk0akIsTUFBcEIsSUFBOEIsSUFBOUIsR0FBcUMsR0FBaEc7QUFDRDtBQUNEdmQsb0JBQVlPLElBQVosRUFBa0JpZCxRQUFsQjtBQUNBMWQsaUJBQVNTLElBQVQsRUFBZWtkLE9BQWY7O0FBRUEsWUFBSUMsS0FBSixFQUFXO0FBQUU5Uix3QkFBYzFULElBQWQsQ0FBbUJxSSxJQUFuQjtBQUEyQjtBQUN6QztBQUNGOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFFBQUlvZCxnQkFBaUIsWUFBWTtBQUMvQixhQUFPdFQsV0FDTCxZQUFZO0FBQ1Y2UyxzQkFBY2hZLFNBQWQsRUFBeUIsRUFBekI7QUFDQSxZQUFJdUUsc0JBQXNCLENBQUNqRCxLQUEzQixFQUFrQztBQUNoQztBQUNBO0FBQ0E0VDtBQUNBO0FBQ0E7QUFDQSxjQUFJLENBQUM1VCxLQUFELElBQVUsQ0FBQ2pGLFVBQVUyRCxTQUFWLENBQWYsRUFBcUM7QUFBRXlTO0FBQW9CO0FBRTVELFNBUkQsTUFRTztBQUNMO0FBQ0F2VCxzQkFBWWMsU0FBWixFQUF1QmtILGFBQXZCLEVBQXNDQyxlQUF0QyxFQUF1REMsZ0JBQXZELEVBQXlFK04sNEJBQXpFLEVBQXVHN1QsS0FBdkcsRUFBOEdtUixlQUE5RztBQUNEOztBQUVELFlBQUksQ0FBQ25OLFVBQUwsRUFBaUI7QUFBRXVMO0FBQStCO0FBQ25ELE9BakJJLEdBa0JMLFlBQVk7QUFDVm5LLHdCQUFnQixFQUFoQjs7QUFFQSxZQUFJOEwsTUFBTSxFQUFWO0FBQ0FBLFlBQUk3TixhQUFKLElBQXFCNk4sSUFBSTVOLFlBQUosSUFBb0I2TixlQUF6QztBQUNBbFUscUJBQWFzSCxXQUFXNEIsV0FBWCxDQUFiLEVBQXNDK0ssR0FBdEM7QUFDQXBVLGtCQUFVeUgsV0FBVzdNLEtBQVgsQ0FBVixFQUE2QndaLEdBQTdCOztBQUVBNEYscUJBQWEzUSxXQUFiLEVBQTBCekYsU0FBMUIsRUFBcUNDLFVBQXJDLEVBQWlELElBQWpEO0FBQ0FtVyxxQkFBYXBmLEtBQWIsRUFBb0JrSixhQUFwQixFQUFtQ0YsU0FBbkM7O0FBRUE7QUFDQTtBQUNBLFlBQUksQ0FBQzJDLGFBQUQsSUFBa0IsQ0FBQ0MsWUFBbkIsSUFBbUMsQ0FBQ3RELEtBQXBDLElBQTZDLENBQUNqRixVQUFVMkQsU0FBVixDQUFsRCxFQUF3RTtBQUFFeVM7QUFBb0I7QUFDL0YsT0FoQ0g7QUFpQ0QsS0FsQ21CLEVBQXBCOztBQW9DQSxhQUFTaUcsTUFBVCxDQUFpQnBqQixDQUFqQixFQUFvQnFqQixXQUFwQixFQUFpQztBQUMvQixVQUFJMVIsMEJBQUosRUFBZ0M7QUFBRStOO0FBQWdCOztBQUVsRDtBQUNBLFVBQUloYyxVQUFVeU8sV0FBVixJQUF5QmtSLFdBQTdCLEVBQTBDO0FBQ3hDO0FBQ0EzUSxlQUFPaEosSUFBUCxDQUFZLGNBQVosRUFBNEIyVCxNQUE1QjtBQUNBM0ssZUFBT2hKLElBQVAsQ0FBWSxpQkFBWixFQUErQjJULE1BQS9CO0FBQ0EsWUFBSXJRLFVBQUosRUFBZ0I7QUFBRXVRO0FBQWlCOztBQUVuQztBQUNBLFlBQUlqSCxhQUFhdFcsQ0FBYixJQUFrQixDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCUixPQUFyQixDQUE2QlEsRUFBRTRDLElBQS9CLEtBQXdDLENBQTlELEVBQWlFO0FBQUVtZDtBQUFpQjs7QUFFcEZ4VixrQkFBVSxJQUFWO0FBQ0E0WTtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTRyxRQUFULENBQW1CaGlCLEdBQW5CLEVBQXdCO0FBQ3RCLGFBQU9BLElBQUl5RyxXQUFKLEdBQWtCcEcsT0FBbEIsQ0FBMEIsSUFBMUIsRUFBZ0MsRUFBaEMsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFTd2IsZUFBVCxDQUEwQm9HLEtBQTFCLEVBQWlDO0FBQy9CO0FBQ0E7QUFDQSxVQUFJMVQsWUFBWXRGLE9BQWhCLEVBQXlCO0FBQ3ZCbUksZUFBT2hKLElBQVAsQ0FBWSxlQUFaLEVBQTZCMlQsS0FBS2tHLEtBQUwsQ0FBN0I7O0FBRUEsWUFBSSxDQUFDMVQsUUFBRCxJQUFhdUIsY0FBY2hTLE1BQWQsR0FBdUIsQ0FBeEMsRUFBMkM7QUFDekMsZUFBSyxJQUFJRCxJQUFJLENBQWIsRUFBZ0JBLElBQUlpUyxjQUFjaFMsTUFBbEMsRUFBMENELEdBQTFDLEVBQStDO0FBQzdDLGdCQUFJNEcsT0FBT3FMLGNBQWNqUyxDQUFkLENBQVg7QUFDQTtBQUNBNEcsaUJBQUtsRixLQUFMLENBQVcwQixJQUFYLEdBQWtCLEVBQWxCOztBQUVBLGdCQUFJNk0sa0JBQWtCRixlQUF0QixFQUF1QztBQUNyQ25KLG1CQUFLbEYsS0FBTCxDQUFXdU8sY0FBWCxJQUE2QixFQUE3QjtBQUNBckosbUJBQUtsRixLQUFMLENBQVdxTyxlQUFYLElBQThCLEVBQTlCO0FBQ0Q7QUFDRDFKLHdCQUFZTyxJQUFaLEVBQWtCNEcsVUFBbEI7QUFDQXJILHFCQUFTUyxJQUFULEVBQWU2RyxhQUFmO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O0FBU0EsWUFBSSxDQUFDMlcsS0FBRCxJQUNBLENBQUMxVCxRQUFELElBQWEwVCxNQUFNdGtCLE1BQU4sQ0FBYXBCLFVBQWIsS0FBNEI2TSxTQUR6QyxJQUVBNlksTUFBTXRrQixNQUFOLEtBQWlCeUwsU0FBakIsSUFBOEI0WSxTQUFTQyxNQUFNQyxZQUFmLE1BQWlDRixTQUFTMVIsYUFBVCxDQUZuRSxFQUU0Rjs7QUFFMUYsY0FBSSxDQUFDRCwwQkFBTCxFQUFpQztBQUMvQixnQkFBSTBOLFdBQVczYixLQUFmO0FBQ0FnYztBQUNBLGdCQUFJaGMsVUFBVTJiLFFBQWQsRUFBd0I7QUFDdEIzTSxxQkFBT2hKLElBQVAsQ0FBWSxjQUFaLEVBQTRCMlQsTUFBNUI7O0FBRUFyQztBQUNEO0FBQ0Y7O0FBRUQsY0FBSXpOLFdBQVcsT0FBZixFQUF3QjtBQUFFbUYsbUJBQU9oSixJQUFQLENBQVksYUFBWixFQUEyQjJULE1BQTNCO0FBQXFDO0FBQy9EOVMsb0JBQVUsS0FBVjtBQUNBNEgsd0JBQWN6TyxLQUFkO0FBQ0Q7QUFDRjtBQUVGOztBQUVEO0FBQ0EsYUFBUytmLElBQVQsQ0FBZUMsV0FBZixFQUE0QjFqQixDQUE1QixFQUErQjtBQUM3QixVQUFJK1MsTUFBSixFQUFZO0FBQUU7QUFBUzs7QUFFdkI7QUFDQSxVQUFJMlEsZ0JBQWdCLE1BQXBCLEVBQTRCO0FBQzFCdlEsd0JBQWdCblQsQ0FBaEIsRUFBbUIsQ0FBQyxDQUFwQjs7QUFFRjtBQUNDLE9BSkQsTUFJTyxJQUFJMGpCLGdCQUFnQixNQUFwQixFQUE0QjtBQUNqQ3ZRLHdCQUFnQm5ULENBQWhCLEVBQW1CLENBQW5COztBQUVGO0FBQ0MsT0FKTSxNQUlBO0FBQ0wsWUFBSXVLLE9BQUosRUFBYTtBQUNYLGNBQUlpRCx3QkFBSixFQUE4QjtBQUFFO0FBQVMsV0FBekMsTUFBK0M7QUFBRTJQO0FBQW9CO0FBQ3RFOztBQUVELFlBQUl2RixXQUFXRCxhQUFmO0FBQUEsWUFDSWdNLFdBQVcsQ0FEZjs7QUFHQSxZQUFJRCxnQkFBZ0IsT0FBcEIsRUFBNkI7QUFDM0JDLHFCQUFXLENBQUUvTCxRQUFiO0FBQ0QsU0FGRCxNQUVPLElBQUk4TCxnQkFBZ0IsTUFBcEIsRUFBNEI7QUFDakNDLHFCQUFXOVQsV0FBV1csYUFBYTNGLEtBQWIsR0FBcUIrTSxRQUFoQyxHQUEyQ3BILGFBQWEsQ0FBYixHQUFpQm9ILFFBQXZFO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsY0FBSSxPQUFPOEwsV0FBUCxLQUF1QixRQUEzQixFQUFxQztBQUFFQSwwQkFBY2pMLFNBQVNpTCxXQUFULENBQWQ7QUFBc0M7O0FBRTdFLGNBQUksQ0FBQ0UsTUFBTUYsV0FBTixDQUFMLEVBQXlCO0FBQ3ZCO0FBQ0EsZ0JBQUksQ0FBQzFqQixDQUFMLEVBQVE7QUFBRTBqQiw0QkFBY3RoQixLQUFLNlAsR0FBTCxDQUFTLENBQVQsRUFBWTdQLEtBQUs4SCxHQUFMLENBQVNzRyxhQUFhLENBQXRCLEVBQXlCa1QsV0FBekIsQ0FBWixDQUFkO0FBQW1FOztBQUU3RUMsdUJBQVdELGNBQWM5TCxRQUF6QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxZQUFJLENBQUMvSCxRQUFELElBQWE4VCxRQUFiLElBQXlCdmhCLEtBQUtDLEdBQUwsQ0FBU3NoQixRQUFULElBQXFCOVksS0FBbEQsRUFBeUQ7QUFDdkQsY0FBSWdaLFNBQVNGLFdBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUIsQ0FBQyxDQUFqQztBQUNBQSxzQkFBYWpnQixRQUFRaWdCLFFBQVIsR0FBbUJuVCxVQUFwQixJQUFtQzhCLFFBQW5DLEdBQThDOUIsYUFBYXFULE1BQTNELEdBQW9FclQsYUFBYSxDQUFiLEdBQWlCcVQsTUFBakIsR0FBMEIsQ0FBQyxDQUEzRztBQUNEOztBQUVEbmdCLGlCQUFTaWdCLFFBQVQ7O0FBRUE7QUFDQSxZQUFJOVQsWUFBWS9DLElBQWhCLEVBQXNCO0FBQ3BCLGNBQUlwSixRQUFRNE8sUUFBWixFQUFzQjtBQUFFNU8scUJBQVM4TSxVQUFUO0FBQXNCO0FBQzlDLGNBQUk5TSxRQUFRNk8sUUFBWixFQUFzQjtBQUFFN08scUJBQVM4TSxVQUFUO0FBQXNCO0FBQy9DOztBQUVEO0FBQ0EsWUFBSW1ILFlBQVlqVSxLQUFaLE1BQXVCaVUsWUFBWXhGLFdBQVosQ0FBM0IsRUFBcUQ7QUFDbkRpUixpQkFBT3BqQixDQUFQO0FBQ0Q7QUFFRjtBQUNGOztBQUVEO0FBQ0EsYUFBU21ULGVBQVQsQ0FBMEJuVCxDQUExQixFQUE2QmtaLEdBQTdCLEVBQWtDO0FBQ2hDLFVBQUkzTyxPQUFKLEVBQWE7QUFDWCxZQUFJaUQsd0JBQUosRUFBOEI7QUFBRTtBQUFTLFNBQXpDLE1BQStDO0FBQUUyUDtBQUFvQjtBQUN0RTtBQUNELFVBQUkyRyxlQUFKOztBQUVBLFVBQUksQ0FBQzVLLEdBQUwsRUFBVTtBQUNSbFosWUFBSXFlLFNBQVNyZSxDQUFULENBQUo7QUFDQSxZQUFJZixTQUFTb2lCLFVBQVVyaEIsQ0FBVixDQUFiOztBQUVBLGVBQU9mLFdBQVd1TSxpQkFBWCxJQUFnQyxDQUFDQyxVQUFELEVBQWFDLFVBQWIsRUFBeUJsTSxPQUF6QixDQUFpQ1AsTUFBakMsSUFBMkMsQ0FBbEYsRUFBcUY7QUFBRUEsbUJBQVNBLE9BQU9wQixVQUFoQjtBQUE2Qjs7QUFFcEgsWUFBSWttQixXQUFXLENBQUN0WSxVQUFELEVBQWFDLFVBQWIsRUFBeUJsTSxPQUF6QixDQUFpQ1AsTUFBakMsQ0FBZjtBQUNBLFlBQUk4a0IsWUFBWSxDQUFoQixFQUFtQjtBQUNqQkQsNEJBQWtCLElBQWxCO0FBQ0E1SyxnQkFBTTZLLGFBQWEsQ0FBYixHQUFpQixDQUFDLENBQWxCLEdBQXNCLENBQTVCO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJaFgsTUFBSixFQUFZO0FBQ1YsWUFBSXJKLFVBQVU0TyxRQUFWLElBQXNCNEcsUUFBUSxDQUFDLENBQW5DLEVBQXNDO0FBQ3BDdUssZUFBSyxNQUFMLEVBQWF6akIsQ0FBYjtBQUNBO0FBQ0QsU0FIRCxNQUdPLElBQUkwRCxVQUFVNk8sUUFBVixJQUFzQjJHLFFBQVEsQ0FBbEMsRUFBcUM7QUFDMUN1SyxlQUFLLE9BQUwsRUFBY3pqQixDQUFkO0FBQ0E7QUFDRDtBQUNGOztBQUVELFVBQUlrWixHQUFKLEVBQVM7QUFDUHhWLGlCQUFTeUgsVUFBVStOLEdBQW5CO0FBQ0EsWUFBSWpPLFNBQUosRUFBZTtBQUFFdkgsa0JBQVF0QixLQUFLNk8sS0FBTCxDQUFXdk4sS0FBWCxDQUFSO0FBQTRCO0FBQzdDO0FBQ0EwZixlQUFRVSxtQkFBb0I5akIsS0FBS0EsRUFBRTRDLElBQUYsS0FBVyxTQUFyQyxHQUFtRDVDLENBQW5ELEdBQXVELElBQTlEO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGFBQVNzVCxVQUFULENBQXFCdFQsQ0FBckIsRUFBd0I7QUFDdEIsVUFBSXVLLE9BQUosRUFBYTtBQUNYLFlBQUlpRCx3QkFBSixFQUE4QjtBQUFFO0FBQVMsU0FBekMsTUFBK0M7QUFBRTJQO0FBQW9CO0FBQ3RFOztBQUVEbmQsVUFBSXFlLFNBQVNyZSxDQUFULENBQUo7QUFDQSxVQUFJZixTQUFTb2lCLFVBQVVyaEIsQ0FBVixDQUFiO0FBQUEsVUFBMkJna0IsUUFBM0I7O0FBRUE7QUFDQSxhQUFPL2tCLFdBQVc0TSxZQUFYLElBQTJCLENBQUNwRyxRQUFReEcsTUFBUixFQUFnQixVQUFoQixDQUFuQyxFQUFnRTtBQUFFQSxpQkFBU0EsT0FBT3BCLFVBQWhCO0FBQTZCO0FBQy9GLFVBQUk0SCxRQUFReEcsTUFBUixFQUFnQixVQUFoQixDQUFKLEVBQWlDO0FBQy9CLFlBQUkra0IsV0FBV3BPLGFBQWF2TCxPQUFPekUsUUFBUTNHLE1BQVIsRUFBZ0IsVUFBaEIsQ0FBUCxDQUE1QjtBQUFBLFlBQ0lnbEIsa0JBQWtCalosY0FBY0MsU0FBZCxHQUEwQitZLFdBQVd4VCxVQUFYLEdBQXdCaUYsS0FBbEQsR0FBMER1TyxXQUFXblosS0FEM0Y7QUFBQSxZQUVJNlksY0FBYzVYLGtCQUFrQmtZLFFBQWxCLEdBQTZCNWhCLEtBQUs4SCxHQUFMLENBQVM5SCxLQUFLNFAsSUFBTCxDQUFVaVMsZUFBVixDQUFULEVBQXFDelQsYUFBYSxDQUFsRCxDQUYvQztBQUdBaVQsYUFBS0MsV0FBTCxFQUFrQjFqQixDQUFsQjs7QUFFQSxZQUFJNlYsb0JBQW9CbU8sUUFBeEIsRUFBa0M7QUFDaEMsY0FBSTFOLFNBQUosRUFBZTtBQUFFeUo7QUFBaUI7QUFDbENuSyx1QkFBYSxDQUFDLENBQWQsQ0FGZ0MsQ0FFZjtBQUNsQjtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxhQUFTc08sZ0JBQVQsR0FBNkI7QUFDM0I3TixzQkFBZ0I4TixZQUFZLFlBQVk7QUFDdENoUix3QkFBZ0IsSUFBaEIsRUFBc0IvRyxpQkFBdEI7QUFDRCxPQUZlLEVBRWJELGVBRmEsQ0FBaEI7O0FBSUFtSyxrQkFBWSxJQUFaO0FBQ0Q7O0FBRUQsYUFBUzhOLGlCQUFULEdBQThCO0FBQzVCdEcsb0JBQWN6SCxhQUFkO0FBQ0FDLGtCQUFZLEtBQVo7QUFDRDs7QUFFRCxhQUFTK04sb0JBQVQsQ0FBK0JDLE1BQS9CLEVBQXVDOUgsR0FBdkMsRUFBNEM7QUFDMUN4VyxlQUFTdUcsY0FBVCxFQUF5QixFQUFDLGVBQWUrWCxNQUFoQixFQUF6QjtBQUNBL1gscUJBQWVwSyxTQUFmLEdBQTJCaVUsb0JBQW9CLENBQXBCLElBQXlCa08sTUFBekIsR0FBa0NsTyxvQkFBb0IsQ0FBcEIsQ0FBbEMsR0FBMkRvRyxHQUF0RjtBQUNEOztBQUVELGFBQVNFLGFBQVQsR0FBMEI7QUFDeEJ3SDtBQUNBLFVBQUkzWCxjQUFKLEVBQW9CO0FBQUU4WCw2QkFBcUIsTUFBckIsRUFBNkJoWSxhQUFhLENBQWIsQ0FBN0I7QUFBZ0Q7QUFDdkU7O0FBRUQsYUFBUzBULFlBQVQsR0FBeUI7QUFDdkJxRTtBQUNBLFVBQUk3WCxjQUFKLEVBQW9CO0FBQUU4WCw2QkFBcUIsT0FBckIsRUFBOEJoWSxhQUFhLENBQWIsQ0FBOUI7QUFBaUQ7QUFDeEU7O0FBRUQ7QUFDQSxhQUFTa1ksSUFBVCxHQUFpQjtBQUNmLFVBQUl0WSxZQUFZLENBQUNxSyxTQUFqQixFQUE0QjtBQUMxQm9HO0FBQ0FsRyw2QkFBcUIsS0FBckI7QUFDRDtBQUNGO0FBQ0QsYUFBU2dPLEtBQVQsR0FBa0I7QUFDaEIsVUFBSWxPLFNBQUosRUFBZTtBQUNieUo7QUFDQXZKLDZCQUFxQixJQUFyQjtBQUNEO0FBQ0Y7O0FBRUQsYUFBU2lHLGNBQVQsR0FBMkI7QUFDekIsVUFBSW5HLFNBQUosRUFBZTtBQUNieUo7QUFDQXZKLDZCQUFxQixJQUFyQjtBQUNELE9BSEQsTUFHTztBQUNMa0c7QUFDQWxHLDZCQUFxQixLQUFyQjtBQUNEO0FBQ0Y7O0FBRUQsYUFBUzVDLGtCQUFULEdBQStCO0FBQzdCLFVBQUl4VCxJQUFJcWtCLE1BQVIsRUFBZ0I7QUFDZCxZQUFJbk8sU0FBSixFQUFlO0FBQ2I4TjtBQUNBM04scUNBQTJCLElBQTNCO0FBQ0Q7QUFDRixPQUxELE1BS08sSUFBSUEsd0JBQUosRUFBOEI7QUFDbkN5TjtBQUNBek4sbUNBQTJCLEtBQTNCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFTaEQsY0FBVCxHQUEyQjtBQUN6QixVQUFJNkMsU0FBSixFQUFlO0FBQ2I4TjtBQUNBN04sOEJBQXNCLElBQXRCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFTN0MsZUFBVCxHQUE0QjtBQUMxQixVQUFJNkMsbUJBQUosRUFBeUI7QUFDdkIyTjtBQUNBM04sOEJBQXNCLEtBQXRCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGFBQVN6QyxpQkFBVCxDQUE0QjlULENBQTVCLEVBQStCO0FBQzdCQSxVQUFJcWUsU0FBU3JlLENBQVQsQ0FBSjtBQUNBLFVBQUkwa0IsV0FBVyxDQUFDN1csS0FBS0csSUFBTixFQUFZSCxLQUFLSSxLQUFqQixFQUF3QnpPLE9BQXhCLENBQWdDUSxFQUFFMmtCLE9BQWxDLENBQWY7O0FBRUEsVUFBSUQsWUFBWSxDQUFoQixFQUFtQjtBQUNqQnZSLHdCQUFnQm5ULENBQWhCLEVBQW1CMGtCLGFBQWEsQ0FBYixHQUFpQixDQUFDLENBQWxCLEdBQXNCLENBQXpDO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGFBQVN0UixpQkFBVCxDQUE0QnBULENBQTVCLEVBQStCO0FBQzdCQSxVQUFJcWUsU0FBU3JlLENBQVQsQ0FBSjtBQUNBLFVBQUkwa0IsV0FBVyxDQUFDN1csS0FBS0csSUFBTixFQUFZSCxLQUFLSSxLQUFqQixFQUF3QnpPLE9BQXhCLENBQWdDUSxFQUFFMmtCLE9BQWxDLENBQWY7O0FBRUEsVUFBSUQsWUFBWSxDQUFoQixFQUFtQjtBQUNqQixZQUFJQSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGNBQUksQ0FBQ2paLFdBQVdxSCxRQUFoQixFQUEwQjtBQUFFSyw0QkFBZ0JuVCxDQUFoQixFQUFtQixDQUFDLENBQXBCO0FBQXlCO0FBQ3RELFNBRkQsTUFFTyxJQUFJLENBQUMwTCxXQUFXb0gsUUFBaEIsRUFBMEI7QUFDL0JLLDBCQUFnQm5ULENBQWhCLEVBQW1CLENBQW5CO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0EsYUFBUzRrQixRQUFULENBQW1CemYsRUFBbkIsRUFBdUI7QUFDckJBLFNBQUcwZixLQUFIO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFTdFIsWUFBVCxDQUF1QnZULENBQXZCLEVBQTBCO0FBQ3hCQSxVQUFJcWUsU0FBU3JlLENBQVQsQ0FBSjtBQUNBLFVBQUk4a0IsYUFBYTFrQixJQUFJMmtCLGFBQXJCO0FBQ0EsVUFBSSxDQUFDdGYsUUFBUXFmLFVBQVIsRUFBb0IsVUFBcEIsQ0FBTCxFQUFzQztBQUFFO0FBQVM7O0FBRWpEO0FBQ0EsVUFBSUosV0FBVyxDQUFDN1csS0FBS0csSUFBTixFQUFZSCxLQUFLSSxLQUFqQixFQUF3QkosS0FBS0MsS0FBN0IsRUFBb0NELEtBQUtFLEtBQXpDLEVBQWdEdk8sT0FBaEQsQ0FBd0RRLEVBQUUya0IsT0FBMUQsQ0FBZjtBQUFBLFVBQ0lYLFdBQVczWixPQUFPekUsUUFBUWtmLFVBQVIsRUFBb0IsVUFBcEIsQ0FBUCxDQURmOztBQUdBLFVBQUlKLFlBQVksQ0FBaEIsRUFBbUI7QUFDakIsWUFBSUEsYUFBYSxDQUFqQixFQUFvQjtBQUNsQixjQUFJVixXQUFXLENBQWYsRUFBa0I7QUFBRVkscUJBQVNwUCxTQUFTd08sV0FBVyxDQUFwQixDQUFUO0FBQW1DO0FBQ3hELFNBRkQsTUFFTyxJQUFJVSxhQUFhLENBQWpCLEVBQW9CO0FBQ3pCLGNBQUlWLFdBQVd2TyxRQUFRLENBQXZCLEVBQTBCO0FBQUVtUCxxQkFBU3BQLFNBQVN3TyxXQUFXLENBQXBCLENBQVQ7QUFBbUM7QUFDaEUsU0FGTSxNQUVBO0FBQ0xwTyx1QkFBYW9PLFFBQWI7QUFDQVAsZUFBS08sUUFBTCxFQUFlaGtCLENBQWY7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBU3FlLFFBQVQsQ0FBbUJyZSxDQUFuQixFQUFzQjtBQUNwQkEsVUFBSUEsS0FBS2pDLElBQUl3bEIsS0FBYjtBQUNBLGFBQU95QixhQUFhaGxCLENBQWIsSUFBa0JBLEVBQUVpbEIsY0FBRixDQUFpQixDQUFqQixDQUFsQixHQUF3Q2psQixDQUEvQztBQUNEO0FBQ0QsYUFBU3FoQixTQUFULENBQW9CcmhCLENBQXBCLEVBQXVCO0FBQ3JCLGFBQU9BLEVBQUVmLE1BQUYsSUFBWWxCLElBQUl3bEIsS0FBSixDQUFVMkIsVUFBN0I7QUFDRDs7QUFFRCxhQUFTRixZQUFULENBQXVCaGxCLENBQXZCLEVBQTBCO0FBQ3hCLGFBQU9BLEVBQUU0QyxJQUFGLENBQU9wRCxPQUFQLENBQWUsT0FBZixLQUEyQixDQUFsQztBQUNEOztBQUVELGFBQVMybEIsc0JBQVQsQ0FBaUNubEIsQ0FBakMsRUFBb0M7QUFDbENBLFFBQUVvbEIsY0FBRixHQUFtQnBsQixFQUFFb2xCLGNBQUYsRUFBbkIsR0FBd0NwbEIsRUFBRXFsQixXQUFGLEdBQWdCLEtBQXhEO0FBQ0Q7O0FBRUQsYUFBU0Msd0JBQVQsR0FBcUM7QUFDbkMsYUFBTy9nQixrQkFBa0JMLFNBQVN5UyxhQUFheFMsQ0FBYixHQUFpQnVTLGFBQWF2UyxDQUF2QyxFQUEwQ3dTLGFBQWF2UyxDQUFiLEdBQWlCc1MsYUFBYXRTLENBQXhFLENBQWxCLEVBQThGa0osVUFBOUYsTUFBOEc3QyxRQUFRRyxJQUE3SDtBQUNEOztBQUVELGFBQVNvSixVQUFULENBQXFCaFUsQ0FBckIsRUFBd0I7QUFDdEIsVUFBSXVLLE9BQUosRUFBYTtBQUNYLFlBQUlpRCx3QkFBSixFQUE4QjtBQUFFO0FBQVMsU0FBekMsTUFBK0M7QUFBRTJQO0FBQW9CO0FBQ3RFOztBQUVELFVBQUlsUixZQUFZcUssU0FBaEIsRUFBMkI7QUFBRThOO0FBQXNCOztBQUVuRHJOLGlCQUFXLElBQVg7QUFDQSxVQUFJQyxRQUFKLEVBQWM7QUFDWnZZLFlBQUl1WSxRQUFKO0FBQ0FBLG1CQUFXLElBQVg7QUFDRDs7QUFFRCxVQUFJdU8sSUFBSWxILFNBQVNyZSxDQUFULENBQVI7QUFDQTBTLGFBQU9oSixJQUFQLENBQVlzYixhQUFhaGxCLENBQWIsSUFBa0IsWUFBbEIsR0FBaUMsV0FBN0MsRUFBMERxZCxLQUFLcmQsQ0FBTCxDQUExRDs7QUFFQSxVQUFJLENBQUNnbEIsYUFBYWhsQixDQUFiLENBQUQsSUFBb0IsQ0FBQyxLQUFELEVBQVEsR0FBUixFQUFhUixPQUFiLENBQXFCMmlCLHFCQUFxQmQsVUFBVXJoQixDQUFWLENBQXJCLENBQXJCLEtBQTRELENBQXBGLEVBQXVGO0FBQ3JGbWxCLCtCQUF1Qm5sQixDQUF2QjtBQUNEOztBQUVEMlcsbUJBQWF2UyxDQUFiLEdBQWlCc1MsYUFBYXRTLENBQWIsR0FBaUJtaEIsRUFBRUMsT0FBcEM7QUFDQTdPLG1CQUFheFMsQ0FBYixHQUFpQnVTLGFBQWF2UyxDQUFiLEdBQWlCb2hCLEVBQUVFLE9BQXBDO0FBQ0EsVUFBSTVWLFFBQUosRUFBYztBQUNaK0csd0JBQWdCb0ssV0FBV3RXLFVBQVU3SixLQUFWLENBQWdCK1EsYUFBaEIsRUFBK0JqUSxPQUEvQixDQUF1Q2tRLGVBQXZDLEVBQXdELEVBQXhELENBQVgsQ0FBaEI7QUFDQTZRLHNCQUFjaFksU0FBZCxFQUF5QixJQUF6QjtBQUNEO0FBQ0Y7O0FBRUQsYUFBU3VKLFNBQVQsQ0FBb0JqVSxDQUFwQixFQUF1QjtBQUNyQixVQUFJK1csUUFBSixFQUFjO0FBQ1osWUFBSXdPLElBQUlsSCxTQUFTcmUsQ0FBVCxDQUFSO0FBQ0EyVyxxQkFBYXZTLENBQWIsR0FBaUJtaEIsRUFBRUMsT0FBbkI7QUFDQTdPLHFCQUFheFMsQ0FBYixHQUFpQm9oQixFQUFFRSxPQUFuQjs7QUFFQSxZQUFJNVYsUUFBSixFQUFjO0FBQ1osY0FBSSxDQUFDbUgsUUFBTCxFQUFlO0FBQUVBLHVCQUFXL1ksSUFBSSxZQUFVO0FBQUV5bkIsd0JBQVUxbEIsQ0FBVjtBQUFlLGFBQS9CLENBQVg7QUFBOEM7QUFDaEUsU0FGRCxNQUVPO0FBQ0wsY0FBSXlTLDBCQUEwQixHQUE5QixFQUFtQztBQUFFQSxvQ0FBd0I2UywwQkFBeEI7QUFBcUQ7QUFDMUYsY0FBSTdTLHFCQUFKLEVBQTJCO0FBQUV3Qyw0QkFBZ0IsSUFBaEI7QUFBdUI7QUFDckQ7O0FBRUQsWUFBSUEsYUFBSixFQUFtQjtBQUFFalYsWUFBRW9sQixjQUFGO0FBQXFCO0FBQzNDO0FBQ0Y7O0FBRUQsYUFBU00sU0FBVCxDQUFvQjFsQixDQUFwQixFQUF1QjtBQUNyQixVQUFJLENBQUN5UyxxQkFBTCxFQUE0QjtBQUMxQnNFLG1CQUFXLEtBQVg7QUFDQTtBQUNEO0FBQ0R0WSxVQUFJdVksUUFBSjtBQUNBLFVBQUlELFFBQUosRUFBYztBQUFFQyxtQkFBVy9ZLElBQUksWUFBVTtBQUFFeW5CLG9CQUFVMWxCLENBQVY7QUFBZSxTQUEvQixDQUFYO0FBQThDOztBQUU5RCxVQUFJeVMsMEJBQTBCLEdBQTlCLEVBQW1DO0FBQUVBLGdDQUF3QjZTLDBCQUF4QjtBQUFxRDtBQUMxRixVQUFJN1MscUJBQUosRUFBMkI7QUFDekIsWUFBSSxDQUFDd0MsYUFBRCxJQUFrQitQLGFBQWFobEIsQ0FBYixDQUF0QixFQUF1QztBQUFFaVYsMEJBQWdCLElBQWhCO0FBQXVCOztBQUVoRSxZQUFJO0FBQ0YsY0FBSWpWLEVBQUU0QyxJQUFOLEVBQVk7QUFBRThQLG1CQUFPaEosSUFBUCxDQUFZc2IsYUFBYWhsQixDQUFiLElBQWtCLFdBQWxCLEdBQWdDLFVBQTVDLEVBQXdEcWQsS0FBS3JkLENBQUwsQ0FBeEQ7QUFBbUU7QUFDbEYsU0FGRCxDQUVFLE9BQU0ybEIsR0FBTixFQUFXLENBQUU7O0FBRWYsWUFBSXZoQixJQUFJd1MsYUFBUjtBQUFBLFlBQ0lnUCxPQUFPM08sUUFBUU4sWUFBUixFQUFzQkQsWUFBdEIsQ0FEWDtBQUVBLFlBQUksQ0FBQzFHLFVBQUQsSUFBZWhGLFVBQWYsSUFBNkJDLFNBQWpDLEVBQTRDO0FBQzFDN0csZUFBS3doQixJQUFMO0FBQ0F4aEIsZUFBSyxJQUFMO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsY0FBSXloQixjQUFjOVcsWUFBWTZXLE9BQU8vYSxLQUFQLEdBQWUsR0FBZixJQUFzQixDQUFDa0csV0FBV2pHLE1BQVosSUFBc0J5RyxhQUE1QyxDQUFaLEdBQXdFcVUsT0FBTyxHQUFQLElBQWM3VSxXQUFXakcsTUFBekIsQ0FBMUY7QUFDQTFHLGVBQUt5aEIsV0FBTDtBQUNBemhCLGVBQUssR0FBTDtBQUNEOztBQUVEc0csa0JBQVU3SixLQUFWLENBQWdCK1EsYUFBaEIsSUFBaUNDLGtCQUFrQnpOLENBQWxCLEdBQXNCME4sZ0JBQXZEO0FBQ0Q7QUFDRjs7QUFFRCxhQUFTb0MsUUFBVCxDQUFtQmxVLENBQW5CLEVBQXNCO0FBQ3BCLFVBQUkrVyxRQUFKLEVBQWM7QUFDWixZQUFJQyxRQUFKLEVBQWM7QUFDWnZZLGNBQUl1WSxRQUFKO0FBQ0FBLHFCQUFXLElBQVg7QUFDRDtBQUNELFlBQUluSCxRQUFKLEVBQWM7QUFBRTZTLHdCQUFjaFksU0FBZCxFQUF5QixFQUF6QjtBQUErQjtBQUMvQ3FNLG1CQUFXLEtBQVg7O0FBRUEsWUFBSXdPLElBQUlsSCxTQUFTcmUsQ0FBVCxDQUFSO0FBQ0EyVyxxQkFBYXZTLENBQWIsR0FBaUJtaEIsRUFBRUMsT0FBbkI7QUFDQTdPLHFCQUFheFMsQ0FBYixHQUFpQm9oQixFQUFFRSxPQUFuQjtBQUNBLFlBQUlHLE9BQU8zTyxRQUFRTixZQUFSLEVBQXNCRCxZQUF0QixDQUFYOztBQUVBLFlBQUl0VSxLQUFLQyxHQUFMLENBQVN1akIsSUFBVCxDQUFKLEVBQW9CO0FBQ2xCO0FBQ0EsY0FBSSxDQUFDWixhQUFhaGxCLENBQWIsQ0FBTCxFQUFzQjtBQUNwQjtBQUNBLGdCQUFJZixTQUFTb2lCLFVBQVVyaEIsQ0FBVixDQUFiO0FBQ0E4SSxzQkFBVTdKLE1BQVYsRUFBa0IsRUFBQyxTQUFTLFNBQVM2bUIsWUFBVCxDQUF1QjlsQixDQUF2QixFQUEwQjtBQUNwRG1sQix1Q0FBdUJubEIsQ0FBdkI7QUFDQWlKLDZCQUFhaEssTUFBYixFQUFxQixFQUFDLFNBQVM2bUIsWUFBVixFQUFyQjtBQUNELGVBSGlCLEVBQWxCO0FBSUQ7O0FBRUQsY0FBSWpXLFFBQUosRUFBYztBQUNabUgsdUJBQVcvWSxJQUFJLFlBQVc7QUFDeEIsa0JBQUkrUixjQUFjLENBQUMvRSxTQUFuQixFQUE4QjtBQUM1QixvQkFBSThhLGFBQWEsQ0FBRUgsSUFBRixHQUFTL2EsS0FBVCxJQUFrQmtHLFdBQVdqRyxNQUE3QixDQUFqQjtBQUNBaWIsNkJBQWFILE9BQU8sQ0FBUCxHQUFXeGpCLEtBQUs2TyxLQUFMLENBQVc4VSxVQUFYLENBQVgsR0FBb0MzakIsS0FBSzRQLElBQUwsQ0FBVStULFVBQVYsQ0FBakQ7QUFDQXJpQix5QkFBU3FpQixVQUFUO0FBQ0QsZUFKRCxNQUlPO0FBQ0wsb0JBQUlDLFFBQVEsRUFBR3BQLGdCQUFnQmdQLElBQW5CLENBQVo7QUFDQSxvQkFBSUksU0FBUyxDQUFiLEVBQWdCO0FBQ2R0aUIsMEJBQVE0TyxRQUFSO0FBQ0QsaUJBRkQsTUFFTyxJQUFJMFQsU0FBUzdVLGVBQWVJLGdCQUFnQixDQUEvQixDQUFiLEVBQWdEO0FBQ3JEN04sMEJBQVE2TyxRQUFSO0FBQ0QsaUJBRk0sTUFFQTtBQUNMLHNCQUFJcFQsSUFBSSxDQUFSO0FBQ0EseUJBQU9BLElBQUlvUyxhQUFKLElBQXFCeVUsU0FBUzdVLGVBQWVoUyxDQUFmLENBQXJDLEVBQXdEO0FBQ3REdUUsNEJBQVF2RSxDQUFSO0FBQ0Esd0JBQUk2bUIsUUFBUTdVLGVBQWVoUyxDQUFmLENBQVIsSUFBNkJ5bUIsT0FBTyxDQUF4QyxFQUEyQztBQUFFbGlCLCtCQUFTLENBQVQ7QUFBYTtBQUMxRHZFO0FBQ0Q7QUFDRjtBQUNGOztBQUVEaWtCLHFCQUFPcGpCLENBQVAsRUFBVTRsQixJQUFWO0FBQ0FsVCxxQkFBT2hKLElBQVAsQ0FBWXNiLGFBQWFobEIsQ0FBYixJQUFrQixVQUFsQixHQUErQixTQUEzQyxFQUFzRHFkLEtBQUtyZCxDQUFMLENBQXREO0FBQ0QsYUF2QlUsQ0FBWDtBQXdCRCxXQXpCRCxNQXlCTztBQUNMLGdCQUFJeVMscUJBQUosRUFBMkI7QUFDekJVLDhCQUFnQm5ULENBQWhCLEVBQW1CNGxCLE9BQU8sQ0FBUCxHQUFXLENBQUMsQ0FBWixHQUFnQixDQUFuQztBQUNEO0FBQ0Y7QUFDRjtBQUNGOztBQUVEO0FBQ0EsVUFBSW5iLFFBQVFnRCxvQkFBUixLQUFpQyxNQUFyQyxFQUE2QztBQUFFd0gsd0JBQWdCLEtBQWhCO0FBQXdCO0FBQ3ZFLFVBQUkzSCxVQUFKLEVBQWdCO0FBQUVtRixnQ0FBd0IsR0FBeEI7QUFBOEI7QUFDaEQsVUFBSXhHLFlBQVksQ0FBQ3FLLFNBQWpCLEVBQTRCO0FBQUU0TjtBQUFxQjtBQUNwRDs7QUFFRDtBQUNBO0FBQ0EsYUFBUzNJLDBCQUFULEdBQXVDO0FBQ3JDLFVBQUl2QixLQUFLN0osZ0JBQWdCQSxhQUFoQixHQUFnQ0QsWUFBekM7QUFDQThKLFNBQUduWixLQUFILENBQVNtZixNQUFULEdBQWtCN08sZUFBZXpOLFFBQVFtSCxLQUF2QixJQUFnQ3NHLGVBQWV6TixLQUFmLENBQWhDLEdBQXdELElBQTFFO0FBQ0Q7O0FBRUQsYUFBU2dTLFFBQVQsR0FBcUI7QUFDbkIsVUFBSXVRLFFBQVFqYixhQUFhLENBQUNBLGFBQWFGLE1BQWQsSUFBd0IwRixVQUF4QixHQUFxQ08sUUFBbEQsR0FBNkRQLGFBQWEzRixLQUF0RjtBQUNBLGFBQU96SSxLQUFLOEgsR0FBTCxDQUFTOUgsS0FBSzRQLElBQUwsQ0FBVWlVLEtBQVYsQ0FBVCxFQUEyQnpWLFVBQTNCLENBQVA7QUFDRDs7QUFFRDs7Ozs7QUFLQSxhQUFTc00sbUJBQVQsR0FBZ0M7QUFDOUIsVUFBSSxDQUFDblIsR0FBRCxJQUFRRyxlQUFaLEVBQTZCO0FBQUU7QUFBUzs7QUFFeEMsVUFBSTJKLFVBQVVFLFdBQWQsRUFBMkI7QUFDekIsWUFBSXpMLE1BQU15TCxXQUFWO0FBQUEsWUFDSTFELE1BQU13RCxLQURWO0FBQUEsWUFFSWxNLEtBQUt6QyxXQUZUOztBQUlBLFlBQUk2TyxjQUFjRixLQUFsQixFQUF5QjtBQUN2QnZMLGdCQUFNdUwsS0FBTjtBQUNBeEQsZ0JBQU0wRCxXQUFOO0FBQ0FwTSxlQUFLNUMsV0FBTDtBQUNEOztBQUVELGVBQU91RCxNQUFNK0gsR0FBYixFQUFrQjtBQUNoQjFJLGFBQUdpTSxTQUFTdEwsR0FBVCxDQUFIO0FBQ0FBO0FBQ0Q7O0FBRUQ7QUFDQXlMLHNCQUFjRixLQUFkO0FBQ0Q7QUFDRjs7QUFFRCxhQUFTNEgsSUFBVCxDQUFlcmQsQ0FBZixFQUFrQjtBQUNoQixhQUFPO0FBQ0wwSyxtQkFBV0EsU0FETjtBQUVMNkYsb0JBQVlBLFVBRlA7QUFHTDFFLHNCQUFjQSxZQUhUO0FBSUwySixrQkFBVUEsUUFKTDtBQUtMaEssMkJBQW1CQSxpQkFMZDtBQU1MNEkscUJBQWFBLFdBTlI7QUFPTDNJLG9CQUFZQSxVQVBQO0FBUUxDLG9CQUFZQSxVQVJQO0FBU0xiLGVBQU9BLEtBVEY7QUFVTE0saUJBQVNBLE9BVko7QUFXTGtHLG9CQUFZQSxVQVhQO0FBWUxiLG9CQUFZQSxVQVpQO0FBYUxlLHVCQUFlQSxhQWJWO0FBY0w3TixlQUFPQSxLQWRGO0FBZUx5TyxxQkFBYUEsV0FmUjtBQWdCTEMsc0JBQWNDLGlCQWhCVDtBQWlCTHdELHlCQUFpQkEsZUFqQlo7QUFrQkxFLCtCQUF1QkEscUJBbEJsQjtBQW1CTE4sZUFBT0EsS0FuQkY7QUFvQkxFLHFCQUFhQSxXQXBCUjtBQXFCTHJTLGVBQU9BLEtBckJGO0FBc0JMc04sY0FBTUEsSUF0QkQ7QUF1QkwyUyxlQUFPdmpCLEtBQUs7QUF2QlAsT0FBUDtBQXlCRDs7QUFFRCxXQUFPO0FBQ0xrbUIsZUFBUyxPQURKO0FBRUxDLGVBQVM5SSxJQUZKO0FBR0wzSyxjQUFRQSxNQUhIO0FBSUwrUSxZQUFNQSxJQUpEO0FBS0xjLFlBQU1BLElBTEQ7QUFNTEMsYUFBT0EsS0FORjtBQU9MNVQsWUFBTUEsSUFQRDtBQVFMd1YsMEJBQW9CNUUsd0JBUmY7QUFTTDZFLGVBQVM5TyxtQkFUSjtBQVVMcUcsZUFBU0EsT0FWSjtBQVdMMEksZUFBUyxtQkFBVztBQUNsQixlQUFPcHBCLElBQUk0QixPQUFPMkwsT0FBUCxFQUFnQmtGLGVBQWhCLENBQUosQ0FBUDtBQUNEO0FBYkksS0FBUDtBQWVELEdBN25GRDs7QUErbkZBLFNBQU96UyxHQUFQO0FBQ0MsQ0F6bUdTLEVBQVY7Ozs7O0FDQUE7Ozs7OztBQU1BLElBQUksT0FBT3FwQixNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFFBQU0sSUFBSUMsS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxDQUFDLFVBQVVqQixDQUFWLEVBQWE7QUFDWjs7QUFDQSxNQUFJVyxVQUFVWCxFQUFFaGMsRUFBRixDQUFLa2QsTUFBTCxDQUFZQyxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLEVBQTBCQSxLQUExQixDQUFnQyxHQUFoQyxDQUFkO0FBQ0EsTUFBS1IsUUFBUSxDQUFSLElBQWEsQ0FBYixJQUFrQkEsUUFBUSxDQUFSLElBQWEsQ0FBaEMsSUFBdUNBLFFBQVEsQ0FBUixLQUFjLENBQWQsSUFBbUJBLFFBQVEsQ0FBUixLQUFjLENBQWpDLElBQXNDQSxRQUFRLENBQVIsSUFBYSxDQUExRixJQUFpR0EsUUFBUSxDQUFSLElBQWEsQ0FBbEgsRUFBc0g7QUFDcEgsVUFBTSxJQUFJTSxLQUFKLENBQVUsMkZBQVYsQ0FBTjtBQUNEO0FBQ0YsQ0FOQSxDQU1DRCxNQU5ELENBQUQ7O0FBUUE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVaEIsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxXQUFTb0IsYUFBVCxHQUF5QjtBQUN2QixRQUFJeGhCLEtBQUs5RSxTQUFTRSxhQUFULENBQXVCLFdBQXZCLENBQVQ7O0FBRUEsUUFBSXFtQixxQkFBcUI7QUFDdkJDLHdCQUFtQixxQkFESTtBQUV2QkMscUJBQW1CLGVBRkk7QUFHdkJDLG1CQUFtQiwrQkFISTtBQUl2QkMsa0JBQW1CO0FBSkksS0FBekI7O0FBT0EsU0FBSyxJQUFJMXBCLElBQVQsSUFBaUJzcEIsa0JBQWpCLEVBQXFDO0FBQ25DLFVBQUl6aEIsR0FBR3RFLEtBQUgsQ0FBU3ZELElBQVQsTUFBbUIrQixTQUF2QixFQUFrQztBQUNoQyxlQUFPLEVBQUV3aEIsS0FBSytGLG1CQUFtQnRwQixJQUFuQixDQUFQLEVBQVA7QUFDRDtBQUNGOztBQUVELFdBQU8sS0FBUCxDQWhCdUIsQ0FnQlY7QUFDZDs7QUFFRDtBQUNBaW9CLElBQUVoYyxFQUFGLENBQUswZCxvQkFBTCxHQUE0QixVQUFVamQsUUFBVixFQUFvQjtBQUM5QyxRQUFJa2QsU0FBUyxLQUFiO0FBQ0EsUUFBSUMsTUFBTSxJQUFWO0FBQ0E1QixNQUFFLElBQUYsRUFBUTZCLEdBQVIsQ0FBWSxpQkFBWixFQUErQixZQUFZO0FBQUVGLGVBQVMsSUFBVDtBQUFlLEtBQTVEO0FBQ0EsUUFBSXBpQixXQUFXLFNBQVhBLFFBQVcsR0FBWTtBQUFFLFVBQUksQ0FBQ29pQixNQUFMLEVBQWEzQixFQUFFNEIsR0FBRixFQUFPRSxPQUFQLENBQWU5QixFQUFFK0IsT0FBRixDQUFVTixVQUFWLENBQXFCbkcsR0FBcEM7QUFBMEMsS0FBcEY7QUFDQXRpQixlQUFXdUcsUUFBWCxFQUFxQmtGLFFBQXJCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FQRDs7QUFTQXViLElBQUUsWUFBWTtBQUNaQSxNQUFFK0IsT0FBRixDQUFVTixVQUFWLEdBQXVCTCxlQUF2Qjs7QUFFQSxRQUFJLENBQUNwQixFQUFFK0IsT0FBRixDQUFVTixVQUFmLEVBQTJCOztBQUUzQnpCLE1BQUVoQyxLQUFGLENBQVFnRSxPQUFSLENBQWdCQyxlQUFoQixHQUFrQztBQUNoQ0MsZ0JBQVVsQyxFQUFFK0IsT0FBRixDQUFVTixVQUFWLENBQXFCbkcsR0FEQztBQUVoQzZHLG9CQUFjbkMsRUFBRStCLE9BQUYsQ0FBVU4sVUFBVixDQUFxQm5HLEdBRkg7QUFHaEM4RyxjQUFRLGdCQUFVM25CLENBQVYsRUFBYTtBQUNuQixZQUFJdWxCLEVBQUV2bEIsRUFBRWYsTUFBSixFQUFZMm9CLEVBQVosQ0FBZSxJQUFmLENBQUosRUFBMEIsT0FBTzVuQixFQUFFNm5CLFNBQUYsQ0FBWUMsT0FBWixDQUFvQi9QLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDN1ksU0FBaEMsQ0FBUDtBQUMzQjtBQUwrQixLQUFsQztBQU9ELEdBWkQ7QUFjRCxDQWpEQSxDQWlEQ3FuQixNQWpERCxDQUFEOztBQW1EQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVoQixDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLE1BQUl3QyxVQUFVLHdCQUFkO0FBQ0EsTUFBSUMsUUFBVSxTQUFWQSxLQUFVLENBQVU3aUIsRUFBVixFQUFjO0FBQzFCb2dCLE1BQUVwZ0IsRUFBRixFQUFNa0UsRUFBTixDQUFTLE9BQVQsRUFBa0IwZSxPQUFsQixFQUEyQixLQUFLRSxLQUFoQztBQUNELEdBRkQ7O0FBSUFELFFBQU1FLE9BQU4sR0FBZ0IsT0FBaEI7O0FBRUFGLFFBQU1HLG1CQUFOLEdBQTRCLEdBQTVCOztBQUVBSCxRQUFNenFCLFNBQU4sQ0FBZ0IwcUIsS0FBaEIsR0FBd0IsVUFBVWpvQixDQUFWLEVBQWE7QUFDbkMsUUFBSW9vQixRQUFXN0MsRUFBRSxJQUFGLENBQWY7QUFDQSxRQUFJL2hCLFdBQVc0a0IsTUFBTTFpQixJQUFOLENBQVcsYUFBWCxDQUFmOztBQUVBLFFBQUksQ0FBQ2xDLFFBQUwsRUFBZTtBQUNiQSxpQkFBVzRrQixNQUFNMWlCLElBQU4sQ0FBVyxNQUFYLENBQVg7QUFDQWxDLGlCQUFXQSxZQUFZQSxTQUFTN0IsT0FBVCxDQUFpQixnQkFBakIsRUFBbUMsRUFBbkMsQ0FBdkIsQ0FGYSxDQUVpRDtBQUMvRDs7QUFFRDZCLGVBQWNBLGFBQWEsR0FBYixHQUFtQixFQUFuQixHQUF3QkEsUUFBdEM7QUFDQSxRQUFJNmtCLFVBQVU5QyxFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCOWtCLFFBQWpCLENBQWQ7O0FBRUEsUUFBSXhELENBQUosRUFBT0EsRUFBRW9sQixjQUFGOztBQUVQLFFBQUksQ0FBQ2lELFFBQVFqcEIsTUFBYixFQUFxQjtBQUNuQmlwQixnQkFBVUQsTUFBTUcsT0FBTixDQUFjLFFBQWQsQ0FBVjtBQUNEOztBQUVERixZQUFRaEIsT0FBUixDQUFnQnJuQixJQUFJdWxCLEVBQUVpRCxLQUFGLENBQVEsZ0JBQVIsQ0FBcEI7O0FBRUEsUUFBSXhvQixFQUFFeW9CLGtCQUFGLEVBQUosRUFBNEI7O0FBRTVCSixZQUFRN2lCLFdBQVIsQ0FBb0IsSUFBcEI7O0FBRUEsYUFBU2tqQixhQUFULEdBQXlCO0FBQ3ZCO0FBQ0FMLGNBQVFNLE1BQVIsR0FBaUJ0QixPQUFqQixDQUF5QixpQkFBekIsRUFBNEN6cEIsTUFBNUM7QUFDRDs7QUFFRDJuQixNQUFFK0IsT0FBRixDQUFVTixVQUFWLElBQXdCcUIsUUFBUW5qQixRQUFSLENBQWlCLE1BQWpCLENBQXhCLEdBQ0VtakIsUUFDR2pCLEdBREgsQ0FDTyxpQkFEUCxFQUMwQnNCLGFBRDFCLEVBRUd6QixvQkFGSCxDQUV3QmUsTUFBTUcsbUJBRjlCLENBREYsR0FJRU8sZUFKRjtBQUtELEdBbENEOztBQXFDQTtBQUNBOztBQUVBLFdBQVNFLE1BQVQsQ0FBZ0I1ZixNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUs2ZixJQUFMLENBQVUsWUFBWTtBQUMzQixVQUFJVCxRQUFRN0MsRUFBRSxJQUFGLENBQVo7QUFDQSxVQUFJNWIsT0FBUXllLE1BQU16ZSxJQUFOLENBQVcsVUFBWCxDQUFaOztBQUVBLFVBQUksQ0FBQ0EsSUFBTCxFQUFXeWUsTUFBTXplLElBQU4sQ0FBVyxVQUFYLEVBQXdCQSxPQUFPLElBQUlxZSxLQUFKLENBQVUsSUFBVixDQUEvQjtBQUNYLFVBQUksT0FBT2hmLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JXLEtBQUtYLE1BQUwsRUFBYXZMLElBQWIsQ0FBa0IycUIsS0FBbEI7QUFDaEMsS0FOTSxDQUFQO0FBT0Q7O0FBRUQsTUFBSVUsTUFBTXZELEVBQUVoYyxFQUFGLENBQUt3ZixLQUFmOztBQUVBeEQsSUFBRWhjLEVBQUYsQ0FBS3dmLEtBQUwsR0FBeUJILE1BQXpCO0FBQ0FyRCxJQUFFaGMsRUFBRixDQUFLd2YsS0FBTCxDQUFXQyxXQUFYLEdBQXlCaEIsS0FBekI7O0FBR0E7QUFDQTs7QUFFQXpDLElBQUVoYyxFQUFGLENBQUt3ZixLQUFMLENBQVdFLFVBQVgsR0FBd0IsWUFBWTtBQUNsQzFELE1BQUVoYyxFQUFGLENBQUt3ZixLQUFMLEdBQWFELEdBQWI7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQU1BO0FBQ0E7O0FBRUF2RCxJQUFFbGxCLFFBQUYsRUFBWWdKLEVBQVosQ0FBZSx5QkFBZixFQUEwQzBlLE9BQTFDLEVBQW1EQyxNQUFNenFCLFNBQU4sQ0FBZ0IwcUIsS0FBbkU7QUFFRCxDQXJGQSxDQXFGQzFCLE1BckZELENBQUQ7O0FBdUZBOzs7Ozs7OztBQVNBLENBQUMsVUFBVWhCLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSTJELFNBQVMsU0FBVEEsTUFBUyxDQUFVcmYsT0FBVixFQUFtQlksT0FBbkIsRUFBNEI7QUFDdkMsU0FBSzBlLFFBQUwsR0FBaUI1RCxFQUFFMWIsT0FBRixDQUFqQjtBQUNBLFNBQUtZLE9BQUwsR0FBaUI4YSxFQUFFem1CLE1BQUYsQ0FBUyxFQUFULEVBQWFvcUIsT0FBT0UsUUFBcEIsRUFBOEIzZSxPQUE5QixDQUFqQjtBQUNBLFNBQUs0ZSxTQUFMLEdBQWlCLEtBQWpCO0FBQ0QsR0FKRDs7QUFNQUgsU0FBT2hCLE9BQVAsR0FBa0IsT0FBbEI7O0FBRUFnQixTQUFPRSxRQUFQLEdBQWtCO0FBQ2hCRSxpQkFBYTtBQURHLEdBQWxCOztBQUlBSixTQUFPM3JCLFNBQVAsQ0FBaUJnc0IsUUFBakIsR0FBNEIsVUFBVUMsS0FBVixFQUFpQjtBQUMzQyxRQUFJQyxJQUFPLFVBQVg7QUFDQSxRQUFJdEMsTUFBTyxLQUFLZ0MsUUFBaEI7QUFDQSxRQUFJM25CLE1BQU8ybEIsSUFBSVMsRUFBSixDQUFPLE9BQVAsSUFBa0IsS0FBbEIsR0FBMEIsTUFBckM7QUFDQSxRQUFJamUsT0FBT3dkLElBQUl4ZCxJQUFKLEVBQVg7O0FBRUE2ZixhQUFTLE1BQVQ7O0FBRUEsUUFBSTdmLEtBQUsrZixTQUFMLElBQWtCLElBQXRCLEVBQTRCdkMsSUFBSXhkLElBQUosQ0FBUyxXQUFULEVBQXNCd2QsSUFBSTNsQixHQUFKLEdBQXRCOztBQUU1QjtBQUNBakQsZUFBV2duQixFQUFFb0UsS0FBRixDQUFRLFlBQVk7QUFDN0J4QyxVQUFJM2xCLEdBQUosRUFBU21JLEtBQUs2ZixLQUFMLEtBQWUsSUFBZixHQUFzQixLQUFLL2UsT0FBTCxDQUFhK2UsS0FBYixDQUF0QixHQUE0QzdmLEtBQUs2ZixLQUFMLENBQXJEOztBQUVBLFVBQUlBLFNBQVMsYUFBYixFQUE0QjtBQUMxQixhQUFLSCxTQUFMLEdBQWlCLElBQWpCO0FBQ0FsQyxZQUFJN2hCLFFBQUosQ0FBYW1rQixDQUFiLEVBQWdCL2pCLElBQWhCLENBQXFCK2pCLENBQXJCLEVBQXdCQSxDQUF4QixFQUEyQmhpQixJQUEzQixDQUFnQ2dpQixDQUFoQyxFQUFtQyxJQUFuQztBQUNELE9BSEQsTUFHTyxJQUFJLEtBQUtKLFNBQVQsRUFBb0I7QUFDekIsYUFBS0EsU0FBTCxHQUFpQixLQUFqQjtBQUNBbEMsWUFBSTNoQixXQUFKLENBQWdCaWtCLENBQWhCLEVBQW1CRyxVQUFuQixDQUE4QkgsQ0FBOUIsRUFBaUNoaUIsSUFBakMsQ0FBc0NnaUIsQ0FBdEMsRUFBeUMsS0FBekM7QUFDRDtBQUNGLEtBVlUsRUFVUixJQVZRLENBQVgsRUFVVSxDQVZWO0FBV0QsR0F0QkQ7O0FBd0JBUCxTQUFPM3JCLFNBQVAsQ0FBaUJzc0IsTUFBakIsR0FBMEIsWUFBWTtBQUNwQyxRQUFJQyxVQUFVLElBQWQ7QUFDQSxRQUFJekIsVUFBVSxLQUFLYyxRQUFMLENBQWNaLE9BQWQsQ0FBc0IseUJBQXRCLENBQWQ7O0FBRUEsUUFBSUYsUUFBUWpwQixNQUFaLEVBQW9CO0FBQ2xCLFVBQUkycUIsU0FBUyxLQUFLWixRQUFMLENBQWNiLElBQWQsQ0FBbUIsT0FBbkIsQ0FBYjtBQUNBLFVBQUl5QixPQUFPdGlCLElBQVAsQ0FBWSxNQUFaLEtBQXVCLE9BQTNCLEVBQW9DO0FBQ2xDLFlBQUlzaUIsT0FBT3RpQixJQUFQLENBQVksU0FBWixDQUFKLEVBQTRCcWlCLFVBQVUsS0FBVjtBQUM1QnpCLGdCQUFRQyxJQUFSLENBQWEsU0FBYixFQUF3QjlpQixXQUF4QixDQUFvQyxRQUFwQztBQUNBLGFBQUsyakIsUUFBTCxDQUFjN2pCLFFBQWQsQ0FBdUIsUUFBdkI7QUFDRCxPQUpELE1BSU8sSUFBSXlrQixPQUFPdGlCLElBQVAsQ0FBWSxNQUFaLEtBQXVCLFVBQTNCLEVBQXVDO0FBQzVDLFlBQUtzaUIsT0FBT3RpQixJQUFQLENBQVksU0FBWixDQUFELEtBQTZCLEtBQUswaEIsUUFBTCxDQUFjamtCLFFBQWQsQ0FBdUIsUUFBdkIsQ0FBakMsRUFBbUU0a0IsVUFBVSxLQUFWO0FBQ25FLGFBQUtYLFFBQUwsQ0FBY2EsV0FBZCxDQUEwQixRQUExQjtBQUNEO0FBQ0RELGFBQU90aUIsSUFBUCxDQUFZLFNBQVosRUFBdUIsS0FBSzBoQixRQUFMLENBQWNqa0IsUUFBZCxDQUF1QixRQUF2QixDQUF2QjtBQUNBLFVBQUk0a0IsT0FBSixFQUFhQyxPQUFPMUMsT0FBUCxDQUFlLFFBQWY7QUFDZCxLQVpELE1BWU87QUFDTCxXQUFLOEIsUUFBTCxDQUFjempCLElBQWQsQ0FBbUIsY0FBbkIsRUFBbUMsQ0FBQyxLQUFLeWpCLFFBQUwsQ0FBY2prQixRQUFkLENBQXVCLFFBQXZCLENBQXBDO0FBQ0EsV0FBS2lrQixRQUFMLENBQWNhLFdBQWQsQ0FBMEIsUUFBMUI7QUFDRDtBQUNGLEdBcEJEOztBQXVCQTtBQUNBOztBQUVBLFdBQVNwQixNQUFULENBQWdCNWYsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLNmYsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSVQsUUFBVTdDLEVBQUUsSUFBRixDQUFkO0FBQ0EsVUFBSTViLE9BQVV5ZSxNQUFNemUsSUFBTixDQUFXLFdBQVgsQ0FBZDtBQUNBLFVBQUljLFVBQVUsUUFBT3pCLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNDOztBQUVBLFVBQUksQ0FBQ1csSUFBTCxFQUFXeWUsTUFBTXplLElBQU4sQ0FBVyxXQUFYLEVBQXlCQSxPQUFPLElBQUl1ZixNQUFKLENBQVcsSUFBWCxFQUFpQnplLE9BQWpCLENBQWhDOztBQUVYLFVBQUl6QixVQUFVLFFBQWQsRUFBd0JXLEtBQUtrZ0IsTUFBTCxHQUF4QixLQUNLLElBQUk3Z0IsTUFBSixFQUFZVyxLQUFLNGYsUUFBTCxDQUFjdmdCLE1BQWQ7QUFDbEIsS0FUTSxDQUFQO0FBVUQ7O0FBRUQsTUFBSThmLE1BQU12RCxFQUFFaGMsRUFBRixDQUFLMGdCLE1BQWY7O0FBRUExRSxJQUFFaGMsRUFBRixDQUFLMGdCLE1BQUwsR0FBMEJyQixNQUExQjtBQUNBckQsSUFBRWhjLEVBQUYsQ0FBSzBnQixNQUFMLENBQVlqQixXQUFaLEdBQTBCRSxNQUExQjs7QUFHQTtBQUNBOztBQUVBM0QsSUFBRWhjLEVBQUYsQ0FBSzBnQixNQUFMLENBQVloQixVQUFaLEdBQXlCLFlBQVk7QUFDbkMxRCxNQUFFaGMsRUFBRixDQUFLMGdCLE1BQUwsR0FBY25CLEdBQWQ7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQU1BO0FBQ0E7O0FBRUF2RCxJQUFFbGxCLFFBQUYsRUFDR2dKLEVBREgsQ0FDTSwwQkFETixFQUNrQyx5QkFEbEMsRUFDNkQsVUFBVXJKLENBQVYsRUFBYTtBQUN0RSxRQUFJa3FCLE9BQU8zRSxFQUFFdmxCLEVBQUVmLE1BQUosRUFBWXNwQixPQUFaLENBQW9CLE1BQXBCLENBQVg7QUFDQUssV0FBT25yQixJQUFQLENBQVl5c0IsSUFBWixFQUFrQixRQUFsQjtBQUNBLFFBQUksQ0FBRTNFLEVBQUV2bEIsRUFBRWYsTUFBSixFQUFZMm9CLEVBQVosQ0FBZSw2Q0FBZixDQUFOLEVBQXNFO0FBQ3BFO0FBQ0E1bkIsUUFBRW9sQixjQUFGO0FBQ0E7QUFDQSxVQUFJOEUsS0FBS3RDLEVBQUwsQ0FBUSxjQUFSLENBQUosRUFBNkJzQyxLQUFLN0MsT0FBTCxDQUFhLE9BQWIsRUFBN0IsS0FDSzZDLEtBQUs1QixJQUFMLENBQVUsOEJBQVYsRUFBMEM2QixLQUExQyxHQUFrRDlDLE9BQWxELENBQTBELE9BQTFEO0FBQ047QUFDRixHQVhILEVBWUdoZSxFQVpILENBWU0sa0RBWk4sRUFZMEQseUJBWjFELEVBWXFGLFVBQVVySixDQUFWLEVBQWE7QUFDOUZ1bEIsTUFBRXZsQixFQUFFZixNQUFKLEVBQVlzcEIsT0FBWixDQUFvQixNQUFwQixFQUE0QnlCLFdBQTVCLENBQXdDLE9BQXhDLEVBQWlELGVBQWUxaEIsSUFBZixDQUFvQnRJLEVBQUU0QyxJQUF0QixDQUFqRDtBQUNELEdBZEg7QUFnQkQsQ0FuSEEsQ0FtSEMyakIsTUFuSEQsQ0FBRDs7QUFxSEE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVaEIsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxNQUFJNkUsV0FBVyxTQUFYQSxRQUFXLENBQVV2Z0IsT0FBVixFQUFtQlksT0FBbkIsRUFBNEI7QUFDekMsU0FBSzBlLFFBQUwsR0FBbUI1RCxFQUFFMWIsT0FBRixDQUFuQjtBQUNBLFNBQUt3Z0IsV0FBTCxHQUFtQixLQUFLbEIsUUFBTCxDQUFjYixJQUFkLENBQW1CLHNCQUFuQixDQUFuQjtBQUNBLFNBQUs3ZCxPQUFMLEdBQW1CQSxPQUFuQjtBQUNBLFNBQUs2ZixNQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0MsT0FBTCxHQUFtQixJQUFuQjtBQUNBLFNBQUtDLFFBQUwsR0FBbUIsSUFBbkI7QUFDQSxTQUFLQyxPQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0MsTUFBTCxHQUFtQixJQUFuQjs7QUFFQSxTQUFLamdCLE9BQUwsQ0FBYWtnQixRQUFiLElBQXlCLEtBQUt4QixRQUFMLENBQWM5ZixFQUFkLENBQWlCLHFCQUFqQixFQUF3Q2tjLEVBQUVvRSxLQUFGLENBQVEsS0FBS2lCLE9BQWIsRUFBc0IsSUFBdEIsQ0FBeEMsQ0FBekI7O0FBRUEsU0FBS25nQixPQUFMLENBQWErWixLQUFiLElBQXNCLE9BQXRCLElBQWlDLEVBQUUsa0JBQWtCbmtCLFNBQVNLLGVBQTdCLENBQWpDLElBQWtGLEtBQUt5b0IsUUFBTCxDQUMvRTlmLEVBRCtFLENBQzVFLHdCQUQ0RSxFQUNsRGtjLEVBQUVvRSxLQUFGLENBQVEsS0FBS25GLEtBQWIsRUFBb0IsSUFBcEIsQ0FEa0QsRUFFL0VuYixFQUYrRSxDQUU1RSx3QkFGNEUsRUFFbERrYyxFQUFFb0UsS0FBRixDQUFRLEtBQUtrQixLQUFiLEVBQW9CLElBQXBCLENBRmtELENBQWxGO0FBR0QsR0FmRDs7QUFpQkFULFdBQVNsQyxPQUFULEdBQW9CLE9BQXBCOztBQUVBa0MsV0FBU2pDLG1CQUFULEdBQStCLEdBQS9COztBQUVBaUMsV0FBU2hCLFFBQVQsR0FBb0I7QUFDbEJvQixjQUFVLElBRFE7QUFFbEJoRyxXQUFPLE9BRlc7QUFHbEJzRyxVQUFNLElBSFk7QUFJbEJILGNBQVU7QUFKUSxHQUFwQjs7QUFPQVAsV0FBUzdzQixTQUFULENBQW1CcXRCLE9BQW5CLEdBQTZCLFVBQVU1cUIsQ0FBVixFQUFhO0FBQ3hDLFFBQUksa0JBQWtCc0ksSUFBbEIsQ0FBdUJ0SSxFQUFFZixNQUFGLENBQVM4ckIsT0FBaEMsQ0FBSixFQUE4QztBQUM5QyxZQUFRL3FCLEVBQUVnckIsS0FBVjtBQUNFLFdBQUssRUFBTDtBQUFTLGFBQUtDLElBQUwsR0FBYTtBQUN0QixXQUFLLEVBQUw7QUFBUyxhQUFLQyxJQUFMLEdBQWE7QUFDdEI7QUFBUztBQUhYOztBQU1BbHJCLE1BQUVvbEIsY0FBRjtBQUNELEdBVEQ7O0FBV0FnRixXQUFTN3NCLFNBQVQsQ0FBbUJzdEIsS0FBbkIsR0FBMkIsVUFBVTdxQixDQUFWLEVBQWE7QUFDdENBLFVBQU0sS0FBS3NxQixNQUFMLEdBQWMsS0FBcEI7O0FBRUEsU0FBS0UsUUFBTCxJQUFpQjFNLGNBQWMsS0FBSzBNLFFBQW5CLENBQWpCOztBQUVBLFNBQUsvZixPQUFMLENBQWErZixRQUFiLElBQ0ssQ0FBQyxLQUFLRixNQURYLEtBRU0sS0FBS0UsUUFBTCxHQUFnQnJHLFlBQVlvQixFQUFFb0UsS0FBRixDQUFRLEtBQUt1QixJQUFiLEVBQW1CLElBQW5CLENBQVosRUFBc0MsS0FBS3pnQixPQUFMLENBQWErZixRQUFuRCxDQUZ0Qjs7QUFJQSxXQUFPLElBQVA7QUFDRCxHQVZEOztBQVlBSixXQUFTN3NCLFNBQVQsQ0FBbUI0dEIsWUFBbkIsR0FBa0MsVUFBVXBsQixJQUFWLEVBQWdCO0FBQ2hELFNBQUsya0IsTUFBTCxHQUFjM2tCLEtBQUtxbEIsTUFBTCxHQUFjNW9CLFFBQWQsQ0FBdUIsT0FBdkIsQ0FBZDtBQUNBLFdBQU8sS0FBS2tvQixNQUFMLENBQVlobkIsS0FBWixDQUFrQnFDLFFBQVEsS0FBSzBrQixPQUEvQixDQUFQO0FBQ0QsR0FIRDs7QUFLQUwsV0FBUzdzQixTQUFULENBQW1COHRCLG1CQUFuQixHQUF5QyxVQUFVM21CLFNBQVYsRUFBcUI0bUIsTUFBckIsRUFBNkI7QUFDcEUsUUFBSUMsY0FBYyxLQUFLSixZQUFMLENBQWtCRyxNQUFsQixDQUFsQjtBQUNBLFFBQUlFLFdBQVk5bUIsYUFBYSxNQUFiLElBQXVCNm1CLGdCQUFnQixDQUF4QyxJQUNDN21CLGFBQWEsTUFBYixJQUF1QjZtQixlQUFnQixLQUFLYixNQUFMLENBQVl0ckIsTUFBWixHQUFxQixDQUQ1RTtBQUVBLFFBQUlvc0IsWUFBWSxDQUFDLEtBQUsvZ0IsT0FBTCxDQUFhcWdCLElBQTlCLEVBQW9DLE9BQU9RLE1BQVA7QUFDcEMsUUFBSUcsUUFBUS9tQixhQUFhLE1BQWIsR0FBc0IsQ0FBQyxDQUF2QixHQUEyQixDQUF2QztBQUNBLFFBQUlnbkIsWUFBWSxDQUFDSCxjQUFjRSxLQUFmLElBQXdCLEtBQUtmLE1BQUwsQ0FBWXRyQixNQUFwRDtBQUNBLFdBQU8sS0FBS3NyQixNQUFMLENBQVlpQixFQUFaLENBQWVELFNBQWYsQ0FBUDtBQUNELEdBUkQ7O0FBVUF0QixXQUFTN3NCLFNBQVQsQ0FBbUJ3TSxFQUFuQixHQUF3QixVQUFVcU8sR0FBVixFQUFlO0FBQ3JDLFFBQUl3VCxPQUFjLElBQWxCO0FBQ0EsUUFBSUwsY0FBYyxLQUFLSixZQUFMLENBQWtCLEtBQUtWLE9BQUwsR0FBZSxLQUFLdEIsUUFBTCxDQUFjYixJQUFkLENBQW1CLGNBQW5CLENBQWpDLENBQWxCOztBQUVBLFFBQUlsUSxNQUFPLEtBQUtzUyxNQUFMLENBQVl0ckIsTUFBWixHQUFxQixDQUE1QixJQUFrQ2daLE1BQU0sQ0FBNUMsRUFBK0M7O0FBRS9DLFFBQUksS0FBS21TLE9BQVQsRUFBd0IsT0FBTyxLQUFLcEIsUUFBTCxDQUFjL0IsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsWUFBWTtBQUFFd0UsV0FBSzdoQixFQUFMLENBQVFxTyxHQUFSO0FBQWMsS0FBbEUsQ0FBUCxDQU5hLENBTThEO0FBQ25HLFFBQUltVCxlQUFlblQsR0FBbkIsRUFBd0IsT0FBTyxLQUFLb00sS0FBTCxHQUFhcUcsS0FBYixFQUFQOztBQUV4QixXQUFPLEtBQUtwUCxLQUFMLENBQVdyRCxNQUFNbVQsV0FBTixHQUFvQixNQUFwQixHQUE2QixNQUF4QyxFQUFnRCxLQUFLYixNQUFMLENBQVlpQixFQUFaLENBQWV2VCxHQUFmLENBQWhELENBQVA7QUFDRCxHQVZEOztBQVlBZ1MsV0FBUzdzQixTQUFULENBQW1CaW5CLEtBQW5CLEdBQTJCLFVBQVV4a0IsQ0FBVixFQUFhO0FBQ3RDQSxVQUFNLEtBQUtzcUIsTUFBTCxHQUFjLElBQXBCOztBQUVBLFFBQUksS0FBS25CLFFBQUwsQ0FBY2IsSUFBZCxDQUFtQixjQUFuQixFQUFtQ2xwQixNQUFuQyxJQUE2Q21tQixFQUFFK0IsT0FBRixDQUFVTixVQUEzRCxFQUF1RTtBQUNyRSxXQUFLbUMsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQjlCLEVBQUUrQixPQUFGLENBQVVOLFVBQVYsQ0FBcUJuRyxHQUEzQztBQUNBLFdBQUtnSyxLQUFMLENBQVcsSUFBWDtBQUNEOztBQUVELFNBQUtMLFFBQUwsR0FBZ0IxTSxjQUFjLEtBQUswTSxRQUFuQixDQUFoQjs7QUFFQSxXQUFPLElBQVA7QUFDRCxHQVhEOztBQWFBSixXQUFTN3NCLFNBQVQsQ0FBbUIydEIsSUFBbkIsR0FBMEIsWUFBWTtBQUNwQyxRQUFJLEtBQUtYLE9BQVQsRUFBa0I7QUFDbEIsV0FBTyxLQUFLOU8sS0FBTCxDQUFXLE1BQVgsQ0FBUDtBQUNELEdBSEQ7O0FBS0EyTyxXQUFTN3NCLFNBQVQsQ0FBbUIwdEIsSUFBbkIsR0FBMEIsWUFBWTtBQUNwQyxRQUFJLEtBQUtWLE9BQVQsRUFBa0I7QUFDbEIsV0FBTyxLQUFLOU8sS0FBTCxDQUFXLE1BQVgsQ0FBUDtBQUNELEdBSEQ7O0FBS0EyTyxXQUFTN3NCLFNBQVQsQ0FBbUJrZSxLQUFuQixHQUEyQixVQUFVN1ksSUFBVixFQUFnQnNvQixJQUFoQixFQUFzQjtBQUMvQyxRQUFJVCxVQUFZLEtBQUt0QixRQUFMLENBQWNiLElBQWQsQ0FBbUIsY0FBbkIsQ0FBaEI7QUFDQSxRQUFJdUQsUUFBWVgsUUFBUSxLQUFLRyxtQkFBTCxDQUF5QnpvQixJQUF6QixFQUErQjZuQixPQUEvQixDQUF4QjtBQUNBLFFBQUlxQixZQUFZLEtBQUt0QixRQUFyQjtBQUNBLFFBQUk5bEIsWUFBWTlCLFFBQVEsTUFBUixHQUFpQixNQUFqQixHQUEwQixPQUExQztBQUNBLFFBQUlncEIsT0FBWSxJQUFoQjs7QUFFQSxRQUFJQyxNQUFNM21CLFFBQU4sQ0FBZSxRQUFmLENBQUosRUFBOEIsT0FBUSxLQUFLcWxCLE9BQUwsR0FBZSxLQUF2Qjs7QUFFOUIsUUFBSXdCLGdCQUFnQkYsTUFBTSxDQUFOLENBQXBCO0FBQ0EsUUFBSUcsYUFBYXpHLEVBQUVpRCxLQUFGLENBQVEsbUJBQVIsRUFBNkI7QUFDNUN1RCxxQkFBZUEsYUFENkI7QUFFNUNybkIsaUJBQVdBO0FBRmlDLEtBQTdCLENBQWpCO0FBSUEsU0FBS3lrQixRQUFMLENBQWM5QixPQUFkLENBQXNCMkUsVUFBdEI7QUFDQSxRQUFJQSxXQUFXdkQsa0JBQVgsRUFBSixFQUFxQzs7QUFFckMsU0FBSzhCLE9BQUwsR0FBZSxJQUFmOztBQUVBdUIsaUJBQWEsS0FBS3RILEtBQUwsRUFBYjs7QUFFQSxRQUFJLEtBQUs2RixXQUFMLENBQWlCanJCLE1BQXJCLEVBQTZCO0FBQzNCLFdBQUtpckIsV0FBTCxDQUFpQi9CLElBQWpCLENBQXNCLFNBQXRCLEVBQWlDOWlCLFdBQWpDLENBQTZDLFFBQTdDO0FBQ0EsVUFBSXltQixpQkFBaUIxRyxFQUFFLEtBQUs4RSxXQUFMLENBQWlCN25CLFFBQWpCLEdBQTRCLEtBQUsyb0IsWUFBTCxDQUFrQlUsS0FBbEIsQ0FBNUIsQ0FBRixDQUFyQjtBQUNBSSx3QkFBa0JBLGVBQWUzbUIsUUFBZixDQUF3QixRQUF4QixDQUFsQjtBQUNEOztBQUVELFFBQUk0bUIsWUFBWTNHLEVBQUVpRCxLQUFGLENBQVEsa0JBQVIsRUFBNEIsRUFBRXVELGVBQWVBLGFBQWpCLEVBQWdDcm5CLFdBQVdBLFNBQTNDLEVBQTVCLENBQWhCLENBM0IrQyxDQTJCcUQ7QUFDcEcsUUFBSTZnQixFQUFFK0IsT0FBRixDQUFVTixVQUFWLElBQXdCLEtBQUttQyxRQUFMLENBQWNqa0IsUUFBZCxDQUF1QixPQUF2QixDQUE1QixFQUE2RDtBQUMzRDJtQixZQUFNdm1CLFFBQU4sQ0FBZTFDLElBQWY7QUFDQSxVQUFJLFFBQU9pcEIsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUFqQixJQUE2QkEsTUFBTXpzQixNQUF2QyxFQUErQztBQUM3Q3lzQixjQUFNLENBQU4sRUFBU25xQixXQUFULENBRDZDLENBQ3hCO0FBQ3RCO0FBQ0Qrb0IsY0FBUW5sQixRQUFSLENBQWlCWixTQUFqQjtBQUNBbW5CLFlBQU12bUIsUUFBTixDQUFlWixTQUFmO0FBQ0ErbEIsY0FDR3JELEdBREgsQ0FDTyxpQkFEUCxFQUMwQixZQUFZO0FBQ2xDeUUsY0FBTXJtQixXQUFOLENBQWtCLENBQUM1QyxJQUFELEVBQU84QixTQUFQLEVBQWtCeW5CLElBQWxCLENBQXVCLEdBQXZCLENBQWxCLEVBQStDN21CLFFBQS9DLENBQXdELFFBQXhEO0FBQ0FtbEIsZ0JBQVFqbEIsV0FBUixDQUFvQixDQUFDLFFBQUQsRUFBV2QsU0FBWCxFQUFzQnluQixJQUF0QixDQUEyQixHQUEzQixDQUFwQjtBQUNBUCxhQUFLckIsT0FBTCxHQUFlLEtBQWY7QUFDQWhzQixtQkFBVyxZQUFZO0FBQ3JCcXRCLGVBQUt6QyxRQUFMLENBQWM5QixPQUFkLENBQXNCNkUsU0FBdEI7QUFDRCxTQUZELEVBRUcsQ0FGSDtBQUdELE9BUkgsRUFTR2pGLG9CQVRILENBU3dCbUQsU0FBU2pDLG1CQVRqQztBQVVELEtBakJELE1BaUJPO0FBQ0xzQyxjQUFRamxCLFdBQVIsQ0FBb0IsUUFBcEI7QUFDQXFtQixZQUFNdm1CLFFBQU4sQ0FBZSxRQUFmO0FBQ0EsV0FBS2lsQixPQUFMLEdBQWUsS0FBZjtBQUNBLFdBQUtwQixRQUFMLENBQWM5QixPQUFkLENBQXNCNkUsU0FBdEI7QUFDRDs7QUFFREosaUJBQWEsS0FBS2pCLEtBQUwsRUFBYjs7QUFFQSxXQUFPLElBQVA7QUFDRCxHQXZERDs7QUEwREE7QUFDQTs7QUFFQSxXQUFTakMsTUFBVCxDQUFnQjVmLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQU8sS0FBSzZmLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlULFFBQVU3QyxFQUFFLElBQUYsQ0FBZDtBQUNBLFVBQUk1YixPQUFVeWUsTUFBTXplLElBQU4sQ0FBVyxhQUFYLENBQWQ7QUFDQSxVQUFJYyxVQUFVOGEsRUFBRXptQixNQUFGLENBQVMsRUFBVCxFQUFhc3JCLFNBQVNoQixRQUF0QixFQUFnQ2hCLE1BQU16ZSxJQUFOLEVBQWhDLEVBQThDLFFBQU9YLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNFLENBQWQ7QUFDQSxVQUFJc2IsU0FBVSxPQUFPdGIsTUFBUCxJQUFpQixRQUFqQixHQUE0QkEsTUFBNUIsR0FBcUN5QixRQUFRZ1IsS0FBM0Q7O0FBRUEsVUFBSSxDQUFDOVIsSUFBTCxFQUFXeWUsTUFBTXplLElBQU4sQ0FBVyxhQUFYLEVBQTJCQSxPQUFPLElBQUl5Z0IsUUFBSixDQUFhLElBQWIsRUFBbUIzZixPQUFuQixDQUFsQztBQUNYLFVBQUksT0FBT3pCLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JXLEtBQUtJLEVBQUwsQ0FBUWYsTUFBUixFQUEvQixLQUNLLElBQUlzYixNQUFKLEVBQVkzYSxLQUFLMmEsTUFBTCxJQUFaLEtBQ0EsSUFBSTdaLFFBQVErZixRQUFaLEVBQXNCN2dCLEtBQUs2YSxLQUFMLEdBQWFxRyxLQUFiO0FBQzVCLEtBVk0sQ0FBUDtBQVdEOztBQUVELE1BQUkvQixNQUFNdkQsRUFBRWhjLEVBQUYsQ0FBS3NHLFFBQWY7O0FBRUEwVixJQUFFaGMsRUFBRixDQUFLc0csUUFBTCxHQUE0QitZLE1BQTVCO0FBQ0FyRCxJQUFFaGMsRUFBRixDQUFLc0csUUFBTCxDQUFjbVosV0FBZCxHQUE0Qm9CLFFBQTVCOztBQUdBO0FBQ0E7O0FBRUE3RSxJQUFFaGMsRUFBRixDQUFLc0csUUFBTCxDQUFjb1osVUFBZCxHQUEyQixZQUFZO0FBQ3JDMUQsTUFBRWhjLEVBQUYsQ0FBS3NHLFFBQUwsR0FBZ0JpWixHQUFoQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7O0FBTUE7QUFDQTs7QUFFQSxNQUFJc0QsZUFBZSxTQUFmQSxZQUFlLENBQVVwc0IsQ0FBVixFQUFhO0FBQzlCLFFBQUlvb0IsUUFBVTdDLEVBQUUsSUFBRixDQUFkO0FBQ0EsUUFBSThHLE9BQVVqRSxNQUFNMWlCLElBQU4sQ0FBVyxNQUFYLENBQWQ7QUFDQSxRQUFJMm1CLElBQUosRUFBVTtBQUNSQSxhQUFPQSxLQUFLMXFCLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUEvQixDQUFQLENBRFEsQ0FDa0M7QUFDM0M7O0FBRUQsUUFBSTFDLFNBQVVtcEIsTUFBTTFpQixJQUFOLENBQVcsYUFBWCxLQUE2QjJtQixJQUEzQztBQUNBLFFBQUlDLFVBQVUvRyxFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCcnBCLE1BQWpCLENBQWQ7O0FBRUEsUUFBSSxDQUFDcXRCLFFBQVFwbkIsUUFBUixDQUFpQixVQUFqQixDQUFMLEVBQW1DOztBQUVuQyxRQUFJdUYsVUFBVThhLEVBQUV6bUIsTUFBRixDQUFTLEVBQVQsRUFBYXd0QixRQUFRM2lCLElBQVIsRUFBYixFQUE2QnllLE1BQU16ZSxJQUFOLEVBQTdCLENBQWQ7QUFDQSxRQUFJNGlCLGFBQWFuRSxNQUFNMWlCLElBQU4sQ0FBVyxlQUFYLENBQWpCO0FBQ0EsUUFBSTZtQixVQUFKLEVBQWdCOWhCLFFBQVErZixRQUFSLEdBQW1CLEtBQW5COztBQUVoQjVCLFdBQU9uckIsSUFBUCxDQUFZNnVCLE9BQVosRUFBcUI3aEIsT0FBckI7O0FBRUEsUUFBSThoQixVQUFKLEVBQWdCO0FBQ2RELGNBQVEzaUIsSUFBUixDQUFhLGFBQWIsRUFBNEJJLEVBQTVCLENBQStCd2lCLFVBQS9CO0FBQ0Q7O0FBRUR2c0IsTUFBRW9sQixjQUFGO0FBQ0QsR0F2QkQ7O0FBeUJBRyxJQUFFbGxCLFFBQUYsRUFDR2dKLEVBREgsQ0FDTSw0QkFETixFQUNvQyxjQURwQyxFQUNvRCtpQixZQURwRCxFQUVHL2lCLEVBRkgsQ0FFTSw0QkFGTixFQUVvQyxpQkFGcEMsRUFFdUQraUIsWUFGdkQ7O0FBSUE3RyxJQUFFdm5CLE1BQUYsRUFBVXFMLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVk7QUFDL0JrYyxNQUFFLHdCQUFGLEVBQTRCc0QsSUFBNUIsQ0FBaUMsWUFBWTtBQUMzQyxVQUFJMkQsWUFBWWpILEVBQUUsSUFBRixDQUFoQjtBQUNBcUQsYUFBT25yQixJQUFQLENBQVkrdUIsU0FBWixFQUF1QkEsVUFBVTdpQixJQUFWLEVBQXZCO0FBQ0QsS0FIRDtBQUlELEdBTEQ7QUFPRCxDQTVPQSxDQTRPQzRjLE1BNU9ELENBQUQ7O0FBOE9BOzs7Ozs7OztBQVFBOztBQUVBLENBQUMsVUFBVWhCLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSWtILFdBQVcsU0FBWEEsUUFBVyxDQUFVNWlCLE9BQVYsRUFBbUJZLE9BQW5CLEVBQTRCO0FBQ3pDLFNBQUswZSxRQUFMLEdBQXFCNUQsRUFBRTFiLE9BQUYsQ0FBckI7QUFDQSxTQUFLWSxPQUFMLEdBQXFCOGEsRUFBRXptQixNQUFGLENBQVMsRUFBVCxFQUFhMnRCLFNBQVNyRCxRQUF0QixFQUFnQzNlLE9BQWhDLENBQXJCO0FBQ0EsU0FBS2lpQixRQUFMLEdBQXFCbkgsRUFBRSxxQ0FBcUMxYixRQUFRakwsRUFBN0MsR0FBa0QsS0FBbEQsR0FDQSx5Q0FEQSxHQUM0Q2lMLFFBQVFqTCxFQURwRCxHQUN5RCxJQUQzRCxDQUFyQjtBQUVBLFNBQUsrdEIsYUFBTCxHQUFxQixJQUFyQjs7QUFFQSxRQUFJLEtBQUtsaUIsT0FBTCxDQUFhMmdCLE1BQWpCLEVBQXlCO0FBQ3ZCLFdBQUsvQyxPQUFMLEdBQWUsS0FBS3VFLFNBQUwsRUFBZjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtDLHdCQUFMLENBQThCLEtBQUsxRCxRQUFuQyxFQUE2QyxLQUFLdUQsUUFBbEQ7QUFDRDs7QUFFRCxRQUFJLEtBQUtqaUIsT0FBTCxDQUFhb2YsTUFBakIsRUFBeUIsS0FBS0EsTUFBTDtBQUMxQixHQWREOztBQWdCQTRDLFdBQVN2RSxPQUFULEdBQW9CLE9BQXBCOztBQUVBdUUsV0FBU3RFLG1CQUFULEdBQStCLEdBQS9COztBQUVBc0UsV0FBU3JELFFBQVQsR0FBb0I7QUFDbEJTLFlBQVE7QUFEVSxHQUFwQjs7QUFJQTRDLFdBQVNsdkIsU0FBVCxDQUFtQnV2QixTQUFuQixHQUErQixZQUFZO0FBQ3pDLFFBQUlDLFdBQVcsS0FBSzVELFFBQUwsQ0FBY2prQixRQUFkLENBQXVCLE9BQXZCLENBQWY7QUFDQSxXQUFPNm5CLFdBQVcsT0FBWCxHQUFxQixRQUE1QjtBQUNELEdBSEQ7O0FBS0FOLFdBQVNsdkIsU0FBVCxDQUFtQnl2QixJQUFuQixHQUEwQixZQUFZO0FBQ3BDLFFBQUksS0FBS0wsYUFBTCxJQUFzQixLQUFLeEQsUUFBTCxDQUFjamtCLFFBQWQsQ0FBdUIsSUFBdkIsQ0FBMUIsRUFBd0Q7O0FBRXhELFFBQUkrbkIsV0FBSjtBQUNBLFFBQUlDLFVBQVUsS0FBSzdFLE9BQUwsSUFBZ0IsS0FBS0EsT0FBTCxDQUFhN2xCLFFBQWIsQ0FBc0IsUUFBdEIsRUFBZ0NBLFFBQWhDLENBQXlDLGtCQUF6QyxDQUE5Qjs7QUFFQSxRQUFJMHFCLFdBQVdBLFFBQVE5dEIsTUFBdkIsRUFBK0I7QUFDN0I2dEIsb0JBQWNDLFFBQVF2akIsSUFBUixDQUFhLGFBQWIsQ0FBZDtBQUNBLFVBQUlzakIsZUFBZUEsWUFBWU4sYUFBL0IsRUFBOEM7QUFDL0M7O0FBRUQsUUFBSVEsYUFBYTVILEVBQUVpRCxLQUFGLENBQVEsa0JBQVIsQ0FBakI7QUFDQSxTQUFLVyxRQUFMLENBQWM5QixPQUFkLENBQXNCOEYsVUFBdEI7QUFDQSxRQUFJQSxXQUFXMUUsa0JBQVgsRUFBSixFQUFxQzs7QUFFckMsUUFBSXlFLFdBQVdBLFFBQVE5dEIsTUFBdkIsRUFBK0I7QUFDN0J3cEIsYUFBT25yQixJQUFQLENBQVl5dkIsT0FBWixFQUFxQixNQUFyQjtBQUNBRCxxQkFBZUMsUUFBUXZqQixJQUFSLENBQWEsYUFBYixFQUE0QixJQUE1QixDQUFmO0FBQ0Q7O0FBRUQsUUFBSW1qQixZQUFZLEtBQUtBLFNBQUwsRUFBaEI7O0FBRUEsU0FBSzNELFFBQUwsQ0FDRzNqQixXQURILENBQ2UsVUFEZixFQUVHRixRQUZILENBRVksWUFGWixFQUUwQnduQixTQUYxQixFQUVxQyxDQUZyQyxFQUdHcG5CLElBSEgsQ0FHUSxlQUhSLEVBR3lCLElBSHpCOztBQUtBLFNBQUtnbkIsUUFBTCxDQUNHbG5CLFdBREgsQ0FDZSxXQURmLEVBRUdFLElBRkgsQ0FFUSxlQUZSLEVBRXlCLElBRnpCOztBQUlBLFNBQUtpbkIsYUFBTCxHQUFxQixDQUFyQjs7QUFFQSxRQUFJUyxXQUFXLFNBQVhBLFFBQVcsR0FBWTtBQUN6QixXQUFLakUsUUFBTCxDQUNHM2pCLFdBREgsQ0FDZSxZQURmLEVBRUdGLFFBRkgsQ0FFWSxhQUZaLEVBRTJCd25CLFNBRjNCLEVBRXNDLEVBRnRDO0FBR0EsV0FBS0gsYUFBTCxHQUFxQixDQUFyQjtBQUNBLFdBQUt4RCxRQUFMLENBQ0c5QixPQURILENBQ1csbUJBRFg7QUFFRCxLQVBEOztBQVNBLFFBQUksQ0FBQzlCLEVBQUUrQixPQUFGLENBQVVOLFVBQWYsRUFBMkIsT0FBT29HLFNBQVMzdkIsSUFBVCxDQUFjLElBQWQsQ0FBUDs7QUFFM0IsUUFBSTR2QixhQUFhOUgsRUFBRStILFNBQUYsQ0FBWSxDQUFDLFFBQUQsRUFBV1IsU0FBWCxFQUFzQlgsSUFBdEIsQ0FBMkIsR0FBM0IsQ0FBWixDQUFqQjs7QUFFQSxTQUFLaEQsUUFBTCxDQUNHL0IsR0FESCxDQUNPLGlCQURQLEVBQzBCN0IsRUFBRW9FLEtBQUYsQ0FBUXlELFFBQVIsRUFBa0IsSUFBbEIsQ0FEMUIsRUFFR25HLG9CQUZILENBRXdCd0YsU0FBU3RFLG1CQUZqQyxFQUVzRDJFLFNBRnRELEVBRWlFLEtBQUszRCxRQUFMLENBQWMsQ0FBZCxFQUFpQmtFLFVBQWpCLENBRmpFO0FBR0QsR0FqREQ7O0FBbURBWixXQUFTbHZCLFNBQVQsQ0FBbUJnd0IsSUFBbkIsR0FBMEIsWUFBWTtBQUNwQyxRQUFJLEtBQUtaLGFBQUwsSUFBc0IsQ0FBQyxLQUFLeEQsUUFBTCxDQUFjamtCLFFBQWQsQ0FBdUIsSUFBdkIsQ0FBM0IsRUFBeUQ7O0FBRXpELFFBQUlpb0IsYUFBYTVILEVBQUVpRCxLQUFGLENBQVEsa0JBQVIsQ0FBakI7QUFDQSxTQUFLVyxRQUFMLENBQWM5QixPQUFkLENBQXNCOEYsVUFBdEI7QUFDQSxRQUFJQSxXQUFXMUUsa0JBQVgsRUFBSixFQUFxQzs7QUFFckMsUUFBSXFFLFlBQVksS0FBS0EsU0FBTCxFQUFoQjs7QUFFQSxTQUFLM0QsUUFBTCxDQUFjMkQsU0FBZCxFQUF5QixLQUFLM0QsUUFBTCxDQUFjMkQsU0FBZCxHQUF6QixFQUFxRCxDQUFyRCxFQUF3RDVyQixZQUF4RDs7QUFFQSxTQUFLaW9CLFFBQUwsQ0FDRzdqQixRQURILENBQ1ksWUFEWixFQUVHRSxXQUZILENBRWUsYUFGZixFQUdHRSxJQUhILENBR1EsZUFIUixFQUd5QixLQUh6Qjs7QUFLQSxTQUFLZ25CLFFBQUwsQ0FDR3BuQixRQURILENBQ1ksV0FEWixFQUVHSSxJQUZILENBRVEsZUFGUixFQUV5QixLQUZ6Qjs7QUFJQSxTQUFLaW5CLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsUUFBSVMsV0FBVyxTQUFYQSxRQUFXLEdBQVk7QUFDekIsV0FBS1QsYUFBTCxHQUFxQixDQUFyQjtBQUNBLFdBQUt4RCxRQUFMLENBQ0czakIsV0FESCxDQUNlLFlBRGYsRUFFR0YsUUFGSCxDQUVZLFVBRlosRUFHRytoQixPQUhILENBR1csb0JBSFg7QUFJRCxLQU5EOztBQVFBLFFBQUksQ0FBQzlCLEVBQUUrQixPQUFGLENBQVVOLFVBQWYsRUFBMkIsT0FBT29HLFNBQVMzdkIsSUFBVCxDQUFjLElBQWQsQ0FBUDs7QUFFM0IsU0FBSzByQixRQUFMLENBQ0cyRCxTQURILEVBQ2MsQ0FEZCxFQUVHMUYsR0FGSCxDQUVPLGlCQUZQLEVBRTBCN0IsRUFBRW9FLEtBQUYsQ0FBUXlELFFBQVIsRUFBa0IsSUFBbEIsQ0FGMUIsRUFHR25HLG9CQUhILENBR3dCd0YsU0FBU3RFLG1CQUhqQztBQUlELEdBcENEOztBQXNDQXNFLFdBQVNsdkIsU0FBVCxDQUFtQnNzQixNQUFuQixHQUE0QixZQUFZO0FBQ3RDLFNBQUssS0FBS1YsUUFBTCxDQUFjamtCLFFBQWQsQ0FBdUIsSUFBdkIsSUFBK0IsTUFBL0IsR0FBd0MsTUFBN0M7QUFDRCxHQUZEOztBQUlBdW5CLFdBQVNsdkIsU0FBVCxDQUFtQnF2QixTQUFuQixHQUErQixZQUFZO0FBQ3pDLFdBQU9ySCxFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCLEtBQUs3ZCxPQUFMLENBQWEyZ0IsTUFBOUIsRUFDSjlDLElBREksQ0FDQywyQ0FBMkMsS0FBSzdkLE9BQUwsQ0FBYTJnQixNQUF4RCxHQUFpRSxJQURsRSxFQUVKdkMsSUFGSSxDQUVDdEQsRUFBRW9FLEtBQUYsQ0FBUSxVQUFVeHFCLENBQVYsRUFBYTBLLE9BQWIsRUFBc0I7QUFDbEMsVUFBSXNmLFdBQVc1RCxFQUFFMWIsT0FBRixDQUFmO0FBQ0EsV0FBS2dqQix3QkFBTCxDQUE4QlcscUJBQXFCckUsUUFBckIsQ0FBOUIsRUFBOERBLFFBQTlEO0FBQ0QsS0FISyxFQUdILElBSEcsQ0FGRCxFQU1KdEksR0FOSSxFQUFQO0FBT0QsR0FSRDs7QUFVQTRMLFdBQVNsdkIsU0FBVCxDQUFtQnN2Qix3QkFBbkIsR0FBOEMsVUFBVTFELFFBQVYsRUFBb0J1RCxRQUFwQixFQUE4QjtBQUMxRSxRQUFJZSxTQUFTdEUsU0FBU2prQixRQUFULENBQWtCLElBQWxCLENBQWI7O0FBRUFpa0IsYUFBU3pqQixJQUFULENBQWMsZUFBZCxFQUErQituQixNQUEvQjtBQUNBZixhQUNHMUMsV0FESCxDQUNlLFdBRGYsRUFDNEIsQ0FBQ3lELE1BRDdCLEVBRUcvbkIsSUFGSCxDQUVRLGVBRlIsRUFFeUIrbkIsTUFGekI7QUFHRCxHQVBEOztBQVNBLFdBQVNELG9CQUFULENBQThCZCxRQUE5QixFQUF3QztBQUN0QyxRQUFJTCxJQUFKO0FBQ0EsUUFBSXB0QixTQUFTeXRCLFNBQVNobkIsSUFBVCxDQUFjLGFBQWQsS0FDUixDQUFDMm1CLE9BQU9LLFNBQVNobkIsSUFBVCxDQUFjLE1BQWQsQ0FBUixLQUFrQzJtQixLQUFLMXFCLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUEvQixDQUR2QyxDQUZzQyxDQUdvQzs7QUFFMUUsV0FBTzRqQixFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCcnBCLE1BQWpCLENBQVA7QUFDRDs7QUFHRDtBQUNBOztBQUVBLFdBQVMycEIsTUFBVCxDQUFnQjVmLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQU8sS0FBSzZmLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlULFFBQVU3QyxFQUFFLElBQUYsQ0FBZDtBQUNBLFVBQUk1YixPQUFVeWUsTUFBTXplLElBQU4sQ0FBVyxhQUFYLENBQWQ7QUFDQSxVQUFJYyxVQUFVOGEsRUFBRXptQixNQUFGLENBQVMsRUFBVCxFQUFhMnRCLFNBQVNyRCxRQUF0QixFQUFnQ2hCLE1BQU16ZSxJQUFOLEVBQWhDLEVBQThDLFFBQU9YLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNFLENBQWQ7O0FBRUEsVUFBSSxDQUFDVyxJQUFELElBQVNjLFFBQVFvZixNQUFqQixJQUEyQixZQUFZdmhCLElBQVosQ0FBaUJVLE1BQWpCLENBQS9CLEVBQXlEeUIsUUFBUW9mLE1BQVIsR0FBaUIsS0FBakI7QUFDekQsVUFBSSxDQUFDbGdCLElBQUwsRUFBV3llLE1BQU16ZSxJQUFOLENBQVcsYUFBWCxFQUEyQkEsT0FBTyxJQUFJOGlCLFFBQUosQ0FBYSxJQUFiLEVBQW1CaGlCLE9BQW5CLENBQWxDO0FBQ1gsVUFBSSxPQUFPekIsTUFBUCxJQUFpQixRQUFyQixFQUErQlcsS0FBS1gsTUFBTDtBQUNoQyxLQVJNLENBQVA7QUFTRDs7QUFFRCxNQUFJOGYsTUFBTXZELEVBQUVoYyxFQUFGLENBQUtta0IsUUFBZjs7QUFFQW5JLElBQUVoYyxFQUFGLENBQUtta0IsUUFBTCxHQUE0QjlFLE1BQTVCO0FBQ0FyRCxJQUFFaGMsRUFBRixDQUFLbWtCLFFBQUwsQ0FBYzFFLFdBQWQsR0FBNEJ5RCxRQUE1Qjs7QUFHQTtBQUNBOztBQUVBbEgsSUFBRWhjLEVBQUYsQ0FBS21rQixRQUFMLENBQWN6RSxVQUFkLEdBQTJCLFlBQVk7QUFDckMxRCxNQUFFaGMsRUFBRixDQUFLbWtCLFFBQUwsR0FBZ0I1RSxHQUFoQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7O0FBTUE7QUFDQTs7QUFFQXZELElBQUVsbEIsUUFBRixFQUFZZ0osRUFBWixDQUFlLDRCQUFmLEVBQTZDLDBCQUE3QyxFQUF5RSxVQUFVckosQ0FBVixFQUFhO0FBQ3BGLFFBQUlvb0IsUUFBVTdDLEVBQUUsSUFBRixDQUFkOztBQUVBLFFBQUksQ0FBQzZDLE1BQU0xaUIsSUFBTixDQUFXLGFBQVgsQ0FBTCxFQUFnQzFGLEVBQUVvbEIsY0FBRjs7QUFFaEMsUUFBSWtILFVBQVVrQixxQkFBcUJwRixLQUFyQixDQUFkO0FBQ0EsUUFBSXplLE9BQVUyaUIsUUFBUTNpQixJQUFSLENBQWEsYUFBYixDQUFkO0FBQ0EsUUFBSVgsU0FBVVcsT0FBTyxRQUFQLEdBQWtCeWUsTUFBTXplLElBQU4sRUFBaEM7O0FBRUFpZixXQUFPbnJCLElBQVAsQ0FBWTZ1QixPQUFaLEVBQXFCdGpCLE1BQXJCO0FBQ0QsR0FWRDtBQVlELENBek1BLENBeU1DdWQsTUF6TUQsQ0FBRDs7QUEyTUE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVaEIsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxNQUFJb0ksV0FBVyxvQkFBZjtBQUNBLE1BQUk5RCxTQUFXLDBCQUFmO0FBQ0EsTUFBSStELFdBQVcsU0FBWEEsUUFBVyxDQUFVL2pCLE9BQVYsRUFBbUI7QUFDaEMwYixNQUFFMWIsT0FBRixFQUFXUixFQUFYLENBQWMsbUJBQWQsRUFBbUMsS0FBS3dnQixNQUF4QztBQUNELEdBRkQ7O0FBSUErRCxXQUFTMUYsT0FBVCxHQUFtQixPQUFuQjs7QUFFQSxXQUFTMEUsU0FBVCxDQUFtQnhFLEtBQW5CLEVBQTBCO0FBQ3hCLFFBQUk1a0IsV0FBVzRrQixNQUFNMWlCLElBQU4sQ0FBVyxhQUFYLENBQWY7O0FBRUEsUUFBSSxDQUFDbEMsUUFBTCxFQUFlO0FBQ2JBLGlCQUFXNGtCLE1BQU0xaUIsSUFBTixDQUFXLE1BQVgsQ0FBWDtBQUNBbEMsaUJBQVdBLFlBQVksWUFBWThFLElBQVosQ0FBaUI5RSxRQUFqQixDQUFaLElBQTBDQSxTQUFTN0IsT0FBVCxDQUFpQixnQkFBakIsRUFBbUMsRUFBbkMsQ0FBckQsQ0FGYSxDQUUrRTtBQUM3Rjs7QUFFRCxRQUFJMG1CLFVBQVU3a0IsYUFBYSxHQUFiLEdBQW1CK2hCLEVBQUVsbEIsUUFBRixFQUFZaW9CLElBQVosQ0FBaUI5a0IsUUFBakIsQ0FBbkIsR0FBZ0QsSUFBOUQ7O0FBRUEsV0FBTzZrQixXQUFXQSxRQUFRanBCLE1BQW5CLEdBQTRCaXBCLE9BQTVCLEdBQXNDRCxNQUFNZ0QsTUFBTixFQUE3QztBQUNEOztBQUVELFdBQVN5QyxVQUFULENBQW9CN3RCLENBQXBCLEVBQXVCO0FBQ3JCLFFBQUlBLEtBQUtBLEVBQUVnckIsS0FBRixLQUFZLENBQXJCLEVBQXdCO0FBQ3hCekYsTUFBRW9JLFFBQUYsRUFBWS92QixNQUFaO0FBQ0EybkIsTUFBRXNFLE1BQUYsRUFBVWhCLElBQVYsQ0FBZSxZQUFZO0FBQ3pCLFVBQUlULFFBQWdCN0MsRUFBRSxJQUFGLENBQXBCO0FBQ0EsVUFBSThDLFVBQWdCdUUsVUFBVXhFLEtBQVYsQ0FBcEI7QUFDQSxVQUFJMkQsZ0JBQWdCLEVBQUVBLGVBQWUsSUFBakIsRUFBcEI7O0FBRUEsVUFBSSxDQUFDMUQsUUFBUW5qQixRQUFSLENBQWlCLE1BQWpCLENBQUwsRUFBK0I7O0FBRS9CLFVBQUlsRixLQUFLQSxFQUFFNEMsSUFBRixJQUFVLE9BQWYsSUFBMEIsa0JBQWtCMEYsSUFBbEIsQ0FBdUJ0SSxFQUFFZixNQUFGLENBQVM4ckIsT0FBaEMsQ0FBMUIsSUFBc0V4RixFQUFFbGdCLFFBQUYsQ0FBV2dqQixRQUFRLENBQVIsQ0FBWCxFQUF1QnJvQixFQUFFZixNQUF6QixDQUExRSxFQUE0Rzs7QUFFNUdvcEIsY0FBUWhCLE9BQVIsQ0FBZ0JybkIsSUFBSXVsQixFQUFFaUQsS0FBRixDQUFRLGtCQUFSLEVBQTRCdUQsYUFBNUIsQ0FBcEI7O0FBRUEsVUFBSS9yQixFQUFFeW9CLGtCQUFGLEVBQUosRUFBNEI7O0FBRTVCTCxZQUFNMWlCLElBQU4sQ0FBVyxlQUFYLEVBQTRCLE9BQTVCO0FBQ0EyaUIsY0FBUTdpQixXQUFSLENBQW9CLE1BQXBCLEVBQTRCNmhCLE9BQTVCLENBQW9DOUIsRUFBRWlELEtBQUYsQ0FBUSxvQkFBUixFQUE4QnVELGFBQTlCLENBQXBDO0FBQ0QsS0FmRDtBQWdCRDs7QUFFRDZCLFdBQVNyd0IsU0FBVCxDQUFtQnNzQixNQUFuQixHQUE0QixVQUFVN3BCLENBQVYsRUFBYTtBQUN2QyxRQUFJb29CLFFBQVE3QyxFQUFFLElBQUYsQ0FBWjs7QUFFQSxRQUFJNkMsTUFBTVIsRUFBTixDQUFTLHNCQUFULENBQUosRUFBc0M7O0FBRXRDLFFBQUlTLFVBQVd1RSxVQUFVeEUsS0FBVixDQUFmO0FBQ0EsUUFBSTBGLFdBQVd6RixRQUFRbmpCLFFBQVIsQ0FBaUIsTUFBakIsQ0FBZjs7QUFFQTJvQjs7QUFFQSxRQUFJLENBQUNDLFFBQUwsRUFBZTtBQUNiLFVBQUksa0JBQWtCenRCLFNBQVNLLGVBQTNCLElBQThDLENBQUMybkIsUUFBUUUsT0FBUixDQUFnQixhQUFoQixFQUErQm5wQixNQUFsRixFQUEwRjtBQUN4RjtBQUNBbW1CLFVBQUVsbEIsU0FBU0UsYUFBVCxDQUF1QixLQUF2QixDQUFGLEVBQ0crRSxRQURILENBQ1ksbUJBRFosRUFFR3lvQixXQUZILENBRWV4SSxFQUFFLElBQUYsQ0FGZixFQUdHbGMsRUFISCxDQUdNLE9BSE4sRUFHZXdrQixVQUhmO0FBSUQ7O0FBRUQsVUFBSTlCLGdCQUFnQixFQUFFQSxlQUFlLElBQWpCLEVBQXBCO0FBQ0ExRCxjQUFRaEIsT0FBUixDQUFnQnJuQixJQUFJdWxCLEVBQUVpRCxLQUFGLENBQVEsa0JBQVIsRUFBNEJ1RCxhQUE1QixDQUFwQjs7QUFFQSxVQUFJL3JCLEVBQUV5b0Isa0JBQUYsRUFBSixFQUE0Qjs7QUFFNUJMLFlBQ0dmLE9BREgsQ0FDVyxPQURYLEVBRUczaEIsSUFGSCxDQUVRLGVBRlIsRUFFeUIsTUFGekI7O0FBSUEyaUIsY0FDRzJCLFdBREgsQ0FDZSxNQURmLEVBRUczQyxPQUZILENBRVc5QixFQUFFaUQsS0FBRixDQUFRLG1CQUFSLEVBQTZCdUQsYUFBN0IsQ0FGWDtBQUdEOztBQUVELFdBQU8sS0FBUDtBQUNELEdBbENEOztBQW9DQTZCLFdBQVNyd0IsU0FBVCxDQUFtQnF0QixPQUFuQixHQUE2QixVQUFVNXFCLENBQVYsRUFBYTtBQUN4QyxRQUFJLENBQUMsZ0JBQWdCc0ksSUFBaEIsQ0FBcUJ0SSxFQUFFZ3JCLEtBQXZCLENBQUQsSUFBa0Msa0JBQWtCMWlCLElBQWxCLENBQXVCdEksRUFBRWYsTUFBRixDQUFTOHJCLE9BQWhDLENBQXRDLEVBQWdGOztBQUVoRixRQUFJM0MsUUFBUTdDLEVBQUUsSUFBRixDQUFaOztBQUVBdmxCLE1BQUVvbEIsY0FBRjtBQUNBcGxCLE1BQUVtaEIsZUFBRjs7QUFFQSxRQUFJaUgsTUFBTVIsRUFBTixDQUFTLHNCQUFULENBQUosRUFBc0M7O0FBRXRDLFFBQUlTLFVBQVd1RSxVQUFVeEUsS0FBVixDQUFmO0FBQ0EsUUFBSTBGLFdBQVd6RixRQUFRbmpCLFFBQVIsQ0FBaUIsTUFBakIsQ0FBZjs7QUFFQSxRQUFJLENBQUM0b0IsUUFBRCxJQUFhOXRCLEVBQUVnckIsS0FBRixJQUFXLEVBQXhCLElBQThCOEMsWUFBWTl0QixFQUFFZ3JCLEtBQUYsSUFBVyxFQUF6RCxFQUE2RDtBQUMzRCxVQUFJaHJCLEVBQUVnckIsS0FBRixJQUFXLEVBQWYsRUFBbUIzQyxRQUFRQyxJQUFSLENBQWF1QixNQUFiLEVBQXFCeEMsT0FBckIsQ0FBNkIsT0FBN0I7QUFDbkIsYUFBT2UsTUFBTWYsT0FBTixDQUFjLE9BQWQsQ0FBUDtBQUNEOztBQUVELFFBQUkyRyxPQUFPLDhCQUFYO0FBQ0EsUUFBSXRELFNBQVNyQyxRQUFRQyxJQUFSLENBQWEsbUJBQW1CMEYsSUFBaEMsQ0FBYjs7QUFFQSxRQUFJLENBQUN0RCxPQUFPdHJCLE1BQVosRUFBb0I7O0FBRXBCLFFBQUlzRSxRQUFRZ25CLE9BQU9obkIsS0FBUCxDQUFhMUQsRUFBRWYsTUFBZixDQUFaOztBQUVBLFFBQUllLEVBQUVnckIsS0FBRixJQUFXLEVBQVgsSUFBaUJ0bkIsUUFBUSxDQUE3QixFQUFnREEsUUF6QlIsQ0F5QndCO0FBQ2hFLFFBQUkxRCxFQUFFZ3JCLEtBQUYsSUFBVyxFQUFYLElBQWlCdG5CLFFBQVFnbkIsT0FBT3RyQixNQUFQLEdBQWdCLENBQTdDLEVBQWdEc0UsUUExQlIsQ0EwQndCO0FBQ2hFLFFBQUksQ0FBQyxDQUFDQSxLQUFOLEVBQWdEQSxRQUFRLENBQVI7O0FBRWhEZ25CLFdBQU9pQixFQUFQLENBQVVqb0IsS0FBVixFQUFpQjJqQixPQUFqQixDQUF5QixPQUF6QjtBQUNELEdBOUJEOztBQWlDQTtBQUNBOztBQUVBLFdBQVN1QixNQUFULENBQWdCNWYsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLNmYsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSVQsUUFBUTdDLEVBQUUsSUFBRixDQUFaO0FBQ0EsVUFBSTViLE9BQVF5ZSxNQUFNemUsSUFBTixDQUFXLGFBQVgsQ0FBWjs7QUFFQSxVQUFJLENBQUNBLElBQUwsRUFBV3llLE1BQU16ZSxJQUFOLENBQVcsYUFBWCxFQUEyQkEsT0FBTyxJQUFJaWtCLFFBQUosQ0FBYSxJQUFiLENBQWxDO0FBQ1gsVUFBSSxPQUFPNWtCLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JXLEtBQUtYLE1BQUwsRUFBYXZMLElBQWIsQ0FBa0IycUIsS0FBbEI7QUFDaEMsS0FOTSxDQUFQO0FBT0Q7O0FBRUQsTUFBSVUsTUFBTXZELEVBQUVoYyxFQUFGLENBQUswa0IsUUFBZjs7QUFFQTFJLElBQUVoYyxFQUFGLENBQUswa0IsUUFBTCxHQUE0QnJGLE1BQTVCO0FBQ0FyRCxJQUFFaGMsRUFBRixDQUFLMGtCLFFBQUwsQ0FBY2pGLFdBQWQsR0FBNEI0RSxRQUE1Qjs7QUFHQTtBQUNBOztBQUVBckksSUFBRWhjLEVBQUYsQ0FBSzBrQixRQUFMLENBQWNoRixVQUFkLEdBQTJCLFlBQVk7QUFDckMxRCxNQUFFaGMsRUFBRixDQUFLMGtCLFFBQUwsR0FBZ0JuRixHQUFoQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7O0FBTUE7QUFDQTs7QUFFQXZELElBQUVsbEIsUUFBRixFQUNHZ0osRUFESCxDQUNNLDRCQUROLEVBQ29Dd2tCLFVBRHBDLEVBRUd4a0IsRUFGSCxDQUVNLDRCQUZOLEVBRW9DLGdCQUZwQyxFQUVzRCxVQUFVckosQ0FBVixFQUFhO0FBQUVBLE1BQUVtaEIsZUFBRjtBQUFxQixHQUYxRixFQUdHOVgsRUFISCxDQUdNLDRCQUhOLEVBR29Dd2dCLE1BSHBDLEVBRzRDK0QsU0FBU3J3QixTQUFULENBQW1Cc3NCLE1BSC9ELEVBSUd4Z0IsRUFKSCxDQUlNLDhCQUpOLEVBSXNDd2dCLE1BSnRDLEVBSThDK0QsU0FBU3J3QixTQUFULENBQW1CcXRCLE9BSmpFLEVBS0d2aEIsRUFMSCxDQUtNLDhCQUxOLEVBS3NDLGdCQUx0QyxFQUt3RHVrQixTQUFTcndCLFNBQVQsQ0FBbUJxdEIsT0FMM0U7QUFPRCxDQTNKQSxDQTJKQ3JFLE1BM0pELENBQUQ7O0FBNkpBOzs7Ozs7OztBQVNBLENBQUMsVUFBVWhCLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSTJJLFFBQVEsU0FBUkEsS0FBUSxDQUFVcmtCLE9BQVYsRUFBbUJZLE9BQW5CLEVBQTRCO0FBQ3RDLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUswakIsS0FBTCxHQUFhNUksRUFBRWxsQixTQUFTQyxJQUFYLENBQWI7QUFDQSxTQUFLNm9CLFFBQUwsR0FBZ0I1RCxFQUFFMWIsT0FBRixDQUFoQjtBQUNBLFNBQUt1a0IsT0FBTCxHQUFlLEtBQUtqRixRQUFMLENBQWNiLElBQWQsQ0FBbUIsZUFBbkIsQ0FBZjtBQUNBLFNBQUsrRixTQUFMLEdBQWlCLElBQWpCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxTQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixDQUF0QjtBQUNBLFNBQUtDLG1CQUFMLEdBQTJCLEtBQTNCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQix5Q0FBcEI7O0FBRUEsUUFBSSxLQUFLamtCLE9BQUwsQ0FBYWtrQixNQUFqQixFQUF5QjtBQUN2QixXQUFLeEYsUUFBTCxDQUNHYixJQURILENBQ1EsZ0JBRFIsRUFFR3NHLElBRkgsQ0FFUSxLQUFLbmtCLE9BQUwsQ0FBYWtrQixNQUZyQixFQUU2QnBKLEVBQUVvRSxLQUFGLENBQVEsWUFBWTtBQUM3QyxhQUFLUixRQUFMLENBQWM5QixPQUFkLENBQXNCLGlCQUF0QjtBQUNELE9BRjBCLEVBRXhCLElBRndCLENBRjdCO0FBS0Q7QUFDRixHQW5CRDs7QUFxQkE2RyxRQUFNaEcsT0FBTixHQUFnQixPQUFoQjs7QUFFQWdHLFFBQU0vRixtQkFBTixHQUE0QixHQUE1QjtBQUNBK0YsUUFBTVcsNEJBQU4sR0FBcUMsR0FBckM7O0FBRUFYLFFBQU05RSxRQUFOLEdBQWlCO0FBQ2Z1RSxjQUFVLElBREs7QUFFZmhELGNBQVUsSUFGSztBQUdmcUMsVUFBTTtBQUhTLEdBQWpCOztBQU1Ba0IsUUFBTTN3QixTQUFOLENBQWdCc3NCLE1BQWhCLEdBQXlCLFVBQVVpRixjQUFWLEVBQTBCO0FBQ2pELFdBQU8sS0FBS1IsT0FBTCxHQUFlLEtBQUtmLElBQUwsRUFBZixHQUE2QixLQUFLUCxJQUFMLENBQVU4QixjQUFWLENBQXBDO0FBQ0QsR0FGRDs7QUFJQVosUUFBTTN3QixTQUFOLENBQWdCeXZCLElBQWhCLEdBQXVCLFVBQVU4QixjQUFWLEVBQTBCO0FBQy9DLFFBQUlsRCxPQUFPLElBQVg7QUFDQSxRQUFJNXJCLElBQUl1bEIsRUFBRWlELEtBQUYsQ0FBUSxlQUFSLEVBQXlCLEVBQUV1RCxlQUFlK0MsY0FBakIsRUFBekIsQ0FBUjs7QUFFQSxTQUFLM0YsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQnJuQixDQUF0Qjs7QUFFQSxRQUFJLEtBQUtzdUIsT0FBTCxJQUFnQnR1QixFQUFFeW9CLGtCQUFGLEVBQXBCLEVBQTRDOztBQUU1QyxTQUFLNkYsT0FBTCxHQUFlLElBQWY7O0FBRUEsU0FBS1MsY0FBTDtBQUNBLFNBQUtDLFlBQUw7QUFDQSxTQUFLYixLQUFMLENBQVc3b0IsUUFBWCxDQUFvQixZQUFwQjs7QUFFQSxTQUFLMnBCLE1BQUw7QUFDQSxTQUFLQyxNQUFMOztBQUVBLFNBQUsvRixRQUFMLENBQWM5ZixFQUFkLENBQWlCLHdCQUFqQixFQUEyQyx3QkFBM0MsRUFBcUVrYyxFQUFFb0UsS0FBRixDQUFRLEtBQUs0RCxJQUFiLEVBQW1CLElBQW5CLENBQXJFOztBQUVBLFNBQUthLE9BQUwsQ0FBYS9rQixFQUFiLENBQWdCLDRCQUFoQixFQUE4QyxZQUFZO0FBQ3hEdWlCLFdBQUt6QyxRQUFMLENBQWMvQixHQUFkLENBQWtCLDBCQUFsQixFQUE4QyxVQUFVcG5CLENBQVYsRUFBYTtBQUN6RCxZQUFJdWxCLEVBQUV2bEIsRUFBRWYsTUFBSixFQUFZMm9CLEVBQVosQ0FBZWdFLEtBQUt6QyxRQUFwQixDQUFKLEVBQW1DeUMsS0FBSzZDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ3BDLE9BRkQ7QUFHRCxLQUpEOztBQU1BLFNBQUtkLFFBQUwsQ0FBYyxZQUFZO0FBQ3hCLFVBQUkzRyxhQUFhekIsRUFBRStCLE9BQUYsQ0FBVU4sVUFBVixJQUF3QjRFLEtBQUt6QyxRQUFMLENBQWNqa0IsUUFBZCxDQUF1QixNQUF2QixDQUF6Qzs7QUFFQSxVQUFJLENBQUMwbUIsS0FBS3pDLFFBQUwsQ0FBY2lDLE1BQWQsR0FBdUJoc0IsTUFBNUIsRUFBb0M7QUFDbEN3c0IsYUFBS3pDLFFBQUwsQ0FBY2dHLFFBQWQsQ0FBdUJ2RCxLQUFLdUMsS0FBNUIsRUFEa0MsQ0FDQztBQUNwQzs7QUFFRHZDLFdBQUt6QyxRQUFMLENBQ0c2RCxJQURILEdBRUdvQyxTQUZILENBRWEsQ0FGYjs7QUFJQXhELFdBQUt5RCxZQUFMOztBQUVBLFVBQUlySSxVQUFKLEVBQWdCO0FBQ2Q0RSxhQUFLekMsUUFBTCxDQUFjLENBQWQsRUFBaUJ6bkIsV0FBakIsQ0FEYyxDQUNlO0FBQzlCOztBQUVEa3FCLFdBQUt6QyxRQUFMLENBQWM3akIsUUFBZCxDQUF1QixJQUF2Qjs7QUFFQXNtQixXQUFLMEQsWUFBTDs7QUFFQSxVQUFJdHZCLElBQUl1bEIsRUFBRWlELEtBQUYsQ0FBUSxnQkFBUixFQUEwQixFQUFFdUQsZUFBZStDLGNBQWpCLEVBQTFCLENBQVI7O0FBRUE5SCxtQkFDRTRFLEtBQUt3QyxPQUFMLENBQWE7QUFBYixPQUNHaEgsR0FESCxDQUNPLGlCQURQLEVBQzBCLFlBQVk7QUFDbEN3RSxhQUFLekMsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQixPQUF0QixFQUErQkEsT0FBL0IsQ0FBdUNybkIsQ0FBdkM7QUFDRCxPQUhILEVBSUdpbkIsb0JBSkgsQ0FJd0JpSCxNQUFNL0YsbUJBSjlCLENBREYsR0FNRXlELEtBQUt6QyxRQUFMLENBQWM5QixPQUFkLENBQXNCLE9BQXRCLEVBQStCQSxPQUEvQixDQUF1Q3JuQixDQUF2QyxDQU5GO0FBT0QsS0E5QkQ7QUErQkQsR0F4REQ7O0FBMERBa3VCLFFBQU0zd0IsU0FBTixDQUFnQmd3QixJQUFoQixHQUF1QixVQUFVdnRCLENBQVYsRUFBYTtBQUNsQyxRQUFJQSxDQUFKLEVBQU9BLEVBQUVvbEIsY0FBRjs7QUFFUHBsQixRQUFJdWxCLEVBQUVpRCxLQUFGLENBQVEsZUFBUixDQUFKOztBQUVBLFNBQUtXLFFBQUwsQ0FBYzlCLE9BQWQsQ0FBc0JybkIsQ0FBdEI7O0FBRUEsUUFBSSxDQUFDLEtBQUtzdUIsT0FBTixJQUFpQnR1QixFQUFFeW9CLGtCQUFGLEVBQXJCLEVBQTZDOztBQUU3QyxTQUFLNkYsT0FBTCxHQUFlLEtBQWY7O0FBRUEsU0FBS1csTUFBTDtBQUNBLFNBQUtDLE1BQUw7O0FBRUEzSixNQUFFbGxCLFFBQUYsRUFBWW1KLEdBQVosQ0FBZ0Isa0JBQWhCOztBQUVBLFNBQUsyZixRQUFMLENBQ0czakIsV0FESCxDQUNlLElBRGYsRUFFR2dFLEdBRkgsQ0FFTyx3QkFGUCxFQUdHQSxHQUhILENBR08sMEJBSFA7O0FBS0EsU0FBSzRrQixPQUFMLENBQWE1a0IsR0FBYixDQUFpQiw0QkFBakI7O0FBRUErYixNQUFFK0IsT0FBRixDQUFVTixVQUFWLElBQXdCLEtBQUttQyxRQUFMLENBQWNqa0IsUUFBZCxDQUF1QixNQUF2QixDQUF4QixHQUNFLEtBQUtpa0IsUUFBTCxDQUNHL0IsR0FESCxDQUNPLGlCQURQLEVBQzBCN0IsRUFBRW9FLEtBQUYsQ0FBUSxLQUFLNEYsU0FBYixFQUF3QixJQUF4QixDQUQxQixFQUVHdEksb0JBRkgsQ0FFd0JpSCxNQUFNL0YsbUJBRjlCLENBREYsR0FJRSxLQUFLb0gsU0FBTCxFQUpGO0FBS0QsR0E1QkQ7O0FBOEJBckIsUUFBTTN3QixTQUFOLENBQWdCK3hCLFlBQWhCLEdBQStCLFlBQVk7QUFDekMvSixNQUFFbGxCLFFBQUYsRUFDR21KLEdBREgsQ0FDTyxrQkFEUCxFQUMyQjtBQUQzQixLQUVHSCxFQUZILENBRU0sa0JBRk4sRUFFMEJrYyxFQUFFb0UsS0FBRixDQUFRLFVBQVUzcEIsQ0FBVixFQUFhO0FBQzNDLFVBQUlLLGFBQWFMLEVBQUVmLE1BQWYsSUFDRixLQUFLa3FCLFFBQUwsQ0FBYyxDQUFkLE1BQXFCbnBCLEVBQUVmLE1BRHJCLElBRUYsQ0FBQyxLQUFLa3FCLFFBQUwsQ0FBY3FHLEdBQWQsQ0FBa0J4dkIsRUFBRWYsTUFBcEIsRUFBNEJHLE1BRi9CLEVBRXVDO0FBQ3JDLGFBQUsrcEIsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQixPQUF0QjtBQUNEO0FBQ0YsS0FOdUIsRUFNckIsSUFOcUIsQ0FGMUI7QUFTRCxHQVZEOztBQVlBNkcsUUFBTTN3QixTQUFOLENBQWdCMHhCLE1BQWhCLEdBQXlCLFlBQVk7QUFDbkMsUUFBSSxLQUFLWCxPQUFMLElBQWdCLEtBQUs3akIsT0FBTCxDQUFha2dCLFFBQWpDLEVBQTJDO0FBQ3pDLFdBQUt4QixRQUFMLENBQWM5ZixFQUFkLENBQWlCLDBCQUFqQixFQUE2Q2tjLEVBQUVvRSxLQUFGLENBQVEsVUFBVTNwQixDQUFWLEVBQWE7QUFDaEVBLFVBQUVnckIsS0FBRixJQUFXLEVBQVgsSUFBaUIsS0FBS3VDLElBQUwsRUFBakI7QUFDRCxPQUY0QyxFQUUxQyxJQUYwQyxDQUE3QztBQUdELEtBSkQsTUFJTyxJQUFJLENBQUMsS0FBS2UsT0FBVixFQUFtQjtBQUN4QixXQUFLbkYsUUFBTCxDQUFjM2YsR0FBZCxDQUFrQiwwQkFBbEI7QUFDRDtBQUNGLEdBUkQ7O0FBVUEwa0IsUUFBTTN3QixTQUFOLENBQWdCMnhCLE1BQWhCLEdBQXlCLFlBQVk7QUFDbkMsUUFBSSxLQUFLWixPQUFULEVBQWtCO0FBQ2hCL0ksUUFBRXZuQixNQUFGLEVBQVVxTCxFQUFWLENBQWEsaUJBQWIsRUFBZ0NrYyxFQUFFb0UsS0FBRixDQUFRLEtBQUs4RixZQUFiLEVBQTJCLElBQTNCLENBQWhDO0FBQ0QsS0FGRCxNQUVPO0FBQ0xsSyxRQUFFdm5CLE1BQUYsRUFBVXdMLEdBQVYsQ0FBYyxpQkFBZDtBQUNEO0FBQ0YsR0FORDs7QUFRQTBrQixRQUFNM3dCLFNBQU4sQ0FBZ0JneUIsU0FBaEIsR0FBNEIsWUFBWTtBQUN0QyxRQUFJM0QsT0FBTyxJQUFYO0FBQ0EsU0FBS3pDLFFBQUwsQ0FBY29FLElBQWQ7QUFDQSxTQUFLSSxRQUFMLENBQWMsWUFBWTtBQUN4Qi9CLFdBQUt1QyxLQUFMLENBQVczb0IsV0FBWCxDQUF1QixZQUF2QjtBQUNBb21CLFdBQUs4RCxnQkFBTDtBQUNBOUQsV0FBSytELGNBQUw7QUFDQS9ELFdBQUt6QyxRQUFMLENBQWM5QixPQUFkLENBQXNCLGlCQUF0QjtBQUNELEtBTEQ7QUFNRCxHQVREOztBQVdBNkcsUUFBTTN3QixTQUFOLENBQWdCcXlCLGNBQWhCLEdBQWlDLFlBQVk7QUFDM0MsU0FBS3ZCLFNBQUwsSUFBa0IsS0FBS0EsU0FBTCxDQUFlendCLE1BQWYsRUFBbEI7QUFDQSxTQUFLeXdCLFNBQUwsR0FBaUIsSUFBakI7QUFDRCxHQUhEOztBQUtBSCxRQUFNM3dCLFNBQU4sQ0FBZ0Jvd0IsUUFBaEIsR0FBMkIsVUFBVTdvQixRQUFWLEVBQW9CO0FBQzdDLFFBQUk4bUIsT0FBTyxJQUFYO0FBQ0EsUUFBSWlFLFVBQVUsS0FBSzFHLFFBQUwsQ0FBY2prQixRQUFkLENBQXVCLE1BQXZCLElBQWlDLE1BQWpDLEdBQTBDLEVBQXhEOztBQUVBLFFBQUksS0FBS29wQixPQUFMLElBQWdCLEtBQUs3akIsT0FBTCxDQUFha2pCLFFBQWpDLEVBQTJDO0FBQ3pDLFVBQUltQyxZQUFZdkssRUFBRStCLE9BQUYsQ0FBVU4sVUFBVixJQUF3QjZJLE9BQXhDOztBQUVBLFdBQUt4QixTQUFMLEdBQWlCOUksRUFBRWxsQixTQUFTRSxhQUFULENBQXVCLEtBQXZCLENBQUYsRUFDZCtFLFFBRGMsQ0FDTCxvQkFBb0J1cUIsT0FEZixFQUVkVixRQUZjLENBRUwsS0FBS2hCLEtBRkEsQ0FBakI7O0FBSUEsV0FBS2hGLFFBQUwsQ0FBYzlmLEVBQWQsQ0FBaUIsd0JBQWpCLEVBQTJDa2MsRUFBRW9FLEtBQUYsQ0FBUSxVQUFVM3BCLENBQVYsRUFBYTtBQUM5RCxZQUFJLEtBQUt5dUIsbUJBQVQsRUFBOEI7QUFDNUIsZUFBS0EsbUJBQUwsR0FBMkIsS0FBM0I7QUFDQTtBQUNEO0FBQ0QsWUFBSXp1QixFQUFFZixNQUFGLEtBQWFlLEVBQUUrdkIsYUFBbkIsRUFBa0M7QUFDbEMsYUFBS3RsQixPQUFMLENBQWFrakIsUUFBYixJQUF5QixRQUF6QixHQUNJLEtBQUt4RSxRQUFMLENBQWMsQ0FBZCxFQUFpQnRFLEtBQWpCLEVBREosR0FFSSxLQUFLMEksSUFBTCxFQUZKO0FBR0QsT0FUMEMsRUFTeEMsSUFUd0MsQ0FBM0M7O0FBV0EsVUFBSXVDLFNBQUosRUFBZSxLQUFLekIsU0FBTCxDQUFlLENBQWYsRUFBa0Izc0IsV0FBbEIsQ0FsQjBCLENBa0JJOztBQUU3QyxXQUFLMnNCLFNBQUwsQ0FBZS9vQixRQUFmLENBQXdCLElBQXhCOztBQUVBLFVBQUksQ0FBQ1IsUUFBTCxFQUFlOztBQUVmZ3JCLGtCQUNFLEtBQUt6QixTQUFMLENBQ0dqSCxHQURILENBQ08saUJBRFAsRUFDMEJ0aUIsUUFEMUIsRUFFR21pQixvQkFGSCxDQUV3QmlILE1BQU1XLDRCQUY5QixDQURGLEdBSUUvcEIsVUFKRjtBQU1ELEtBOUJELE1BOEJPLElBQUksQ0FBQyxLQUFLd3BCLE9BQU4sSUFBaUIsS0FBS0QsU0FBMUIsRUFBcUM7QUFDMUMsV0FBS0EsU0FBTCxDQUFlN29CLFdBQWYsQ0FBMkIsSUFBM0I7O0FBRUEsVUFBSXdxQixpQkFBaUIsU0FBakJBLGNBQWlCLEdBQVk7QUFDL0JwRSxhQUFLZ0UsY0FBTDtBQUNBOXFCLG9CQUFZQSxVQUFaO0FBQ0QsT0FIRDtBQUlBeWdCLFFBQUUrQixPQUFGLENBQVVOLFVBQVYsSUFBd0IsS0FBS21DLFFBQUwsQ0FBY2prQixRQUFkLENBQXVCLE1BQXZCLENBQXhCLEdBQ0UsS0FBS21wQixTQUFMLENBQ0dqSCxHQURILENBQ08saUJBRFAsRUFDMEI0SSxjQUQxQixFQUVHL0ksb0JBRkgsQ0FFd0JpSCxNQUFNVyw0QkFGOUIsQ0FERixHQUlFbUIsZ0JBSkY7QUFNRCxLQWJNLE1BYUEsSUFBSWxyQixRQUFKLEVBQWM7QUFDbkJBO0FBQ0Q7QUFDRixHQWxERDs7QUFvREE7O0FBRUFvcEIsUUFBTTN3QixTQUFOLENBQWdCa3lCLFlBQWhCLEdBQStCLFlBQVk7QUFDekMsU0FBS0osWUFBTDtBQUNELEdBRkQ7O0FBSUFuQixRQUFNM3dCLFNBQU4sQ0FBZ0I4eEIsWUFBaEIsR0FBK0IsWUFBWTtBQUN6QyxRQUFJWSxxQkFBcUIsS0FBSzlHLFFBQUwsQ0FBYyxDQUFkLEVBQWlCK0csWUFBakIsR0FBZ0M3dkIsU0FBU0ssZUFBVCxDQUF5Qnl2QixZQUFsRjs7QUFFQSxTQUFLaEgsUUFBTCxDQUFjaUgsR0FBZCxDQUFrQjtBQUNoQkMsbUJBQWEsQ0FBQyxLQUFLQyxpQkFBTixJQUEyQkwsa0JBQTNCLEdBQWdELEtBQUt6QixjQUFyRCxHQUFzRSxFQURuRTtBQUVoQitCLG9CQUFjLEtBQUtELGlCQUFMLElBQTBCLENBQUNMLGtCQUEzQixHQUFnRCxLQUFLekIsY0FBckQsR0FBc0U7QUFGcEUsS0FBbEI7QUFJRCxHQVBEOztBQVNBTixRQUFNM3dCLFNBQU4sQ0FBZ0JteUIsZ0JBQWhCLEdBQW1DLFlBQVk7QUFDN0MsU0FBS3ZHLFFBQUwsQ0FBY2lILEdBQWQsQ0FBa0I7QUFDaEJDLG1CQUFhLEVBREc7QUFFaEJFLG9CQUFjO0FBRkUsS0FBbEI7QUFJRCxHQUxEOztBQU9BckMsUUFBTTN3QixTQUFOLENBQWdCd3hCLGNBQWhCLEdBQWlDLFlBQVk7QUFDM0MsUUFBSXlCLGtCQUFrQnh5QixPQUFPaWEsVUFBN0I7QUFDQSxRQUFJLENBQUN1WSxlQUFMLEVBQXNCO0FBQUU7QUFDdEIsVUFBSUMsc0JBQXNCcHdCLFNBQVNLLGVBQVQsQ0FBeUI0QixxQkFBekIsRUFBMUI7QUFDQWt1Qix3QkFBa0JDLG9CQUFvQmxZLEtBQXBCLEdBQTRCblcsS0FBS0MsR0FBTCxDQUFTb3VCLG9CQUFvQmx1QixJQUE3QixDQUE5QztBQUNEO0FBQ0QsU0FBSyt0QixpQkFBTCxHQUF5Qmp3QixTQUFTQyxJQUFULENBQWM0WCxXQUFkLEdBQTRCc1ksZUFBckQ7QUFDQSxTQUFLaEMsY0FBTCxHQUFzQixLQUFLa0MsZ0JBQUwsRUFBdEI7QUFDRCxHQVJEOztBQVVBeEMsUUFBTTN3QixTQUFOLENBQWdCeXhCLFlBQWhCLEdBQStCLFlBQVk7QUFDekMsUUFBSTJCLFVBQVVsWSxTQUFVLEtBQUswVixLQUFMLENBQVdpQyxHQUFYLENBQWUsZUFBZixLQUFtQyxDQUE3QyxFQUFpRCxFQUFqRCxDQUFkO0FBQ0EsU0FBSzdCLGVBQUwsR0FBdUJsdUIsU0FBU0MsSUFBVCxDQUFjTyxLQUFkLENBQW9CMHZCLFlBQXBCLElBQW9DLEVBQTNEO0FBQ0EsUUFBSS9CLGlCQUFpQixLQUFLQSxjQUExQjtBQUNBLFFBQUksS0FBSzhCLGlCQUFULEVBQTRCO0FBQzFCLFdBQUtuQyxLQUFMLENBQVdpQyxHQUFYLENBQWUsZUFBZixFQUFnQ08sVUFBVW5DLGNBQTFDO0FBQ0FqSixRQUFFLEtBQUttSixZQUFQLEVBQXFCN0YsSUFBckIsQ0FBMEIsVUFBVW5sQixLQUFWLEVBQWlCbUcsT0FBakIsRUFBMEI7QUFDbEQsWUFBSSttQixnQkFBZ0IvbUIsUUFBUWhKLEtBQVIsQ0FBYzB2QixZQUFsQztBQUNBLFlBQUlNLG9CQUFvQnRMLEVBQUUxYixPQUFGLEVBQVd1bUIsR0FBWCxDQUFlLGVBQWYsQ0FBeEI7QUFDQTdLLFVBQUUxYixPQUFGLEVBQ0dGLElBREgsQ0FDUSxlQURSLEVBQ3lCaW5CLGFBRHpCLEVBRUdSLEdBRkgsQ0FFTyxlQUZQLEVBRXdCcFAsV0FBVzZQLGlCQUFYLElBQWdDckMsY0FBaEMsR0FBaUQsSUFGekU7QUFHRCxPQU5EO0FBT0Q7QUFDRixHQWREOztBQWdCQU4sUUFBTTN3QixTQUFOLENBQWdCb3lCLGNBQWhCLEdBQWlDLFlBQVk7QUFDM0MsU0FBS3hCLEtBQUwsQ0FBV2lDLEdBQVgsQ0FBZSxlQUFmLEVBQWdDLEtBQUs3QixlQUFyQztBQUNBaEosTUFBRSxLQUFLbUosWUFBUCxFQUFxQjdGLElBQXJCLENBQTBCLFVBQVVubEIsS0FBVixFQUFpQm1HLE9BQWpCLEVBQTBCO0FBQ2xELFVBQUlpbkIsVUFBVXZMLEVBQUUxYixPQUFGLEVBQVdGLElBQVgsQ0FBZ0IsZUFBaEIsQ0FBZDtBQUNBNGIsUUFBRTFiLE9BQUYsRUFBV2tuQixVQUFYLENBQXNCLGVBQXRCO0FBQ0FsbkIsY0FBUWhKLEtBQVIsQ0FBYzB2QixZQUFkLEdBQTZCTyxVQUFVQSxPQUFWLEdBQW9CLEVBQWpEO0FBQ0QsS0FKRDtBQUtELEdBUEQ7O0FBU0E1QyxRQUFNM3dCLFNBQU4sQ0FBZ0JtekIsZ0JBQWhCLEdBQW1DLFlBQVk7QUFBRTtBQUMvQyxRQUFJTSxZQUFZM3dCLFNBQVNFLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQXl3QixjQUFVOXVCLFNBQVYsR0FBc0IseUJBQXRCO0FBQ0EsU0FBS2lzQixLQUFMLENBQVc4QyxNQUFYLENBQWtCRCxTQUFsQjtBQUNBLFFBQUl4QyxpQkFBaUJ3QyxVQUFVdHZCLFdBQVYsR0FBd0JzdkIsVUFBVTlZLFdBQXZEO0FBQ0EsU0FBS2lXLEtBQUwsQ0FBVyxDQUFYLEVBQWNyd0IsV0FBZCxDQUEwQmt6QixTQUExQjtBQUNBLFdBQU94QyxjQUFQO0FBQ0QsR0FQRDs7QUFVQTtBQUNBOztBQUVBLFdBQVM1RixNQUFULENBQWdCNWYsTUFBaEIsRUFBd0I4bEIsY0FBeEIsRUFBd0M7QUFDdEMsV0FBTyxLQUFLakcsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSVQsUUFBUTdDLEVBQUUsSUFBRixDQUFaO0FBQ0EsVUFBSTViLE9BQU95ZSxNQUFNemUsSUFBTixDQUFXLFVBQVgsQ0FBWDtBQUNBLFVBQUljLFVBQVU4YSxFQUFFem1CLE1BQUYsQ0FBUyxFQUFULEVBQWFvdkIsTUFBTTlFLFFBQW5CLEVBQTZCaEIsTUFBTXplLElBQU4sRUFBN0IsRUFBMkMsUUFBT1gsTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFqQixJQUE2QkEsTUFBeEUsQ0FBZDs7QUFFQSxVQUFJLENBQUNXLElBQUwsRUFBV3llLE1BQU16ZSxJQUFOLENBQVcsVUFBWCxFQUF3QkEsT0FBTyxJQUFJdWtCLEtBQUosQ0FBVSxJQUFWLEVBQWdCempCLE9BQWhCLENBQS9CO0FBQ1gsVUFBSSxPQUFPekIsTUFBUCxJQUFpQixRQUFyQixFQUErQlcsS0FBS1gsTUFBTCxFQUFhOGxCLGNBQWIsRUFBL0IsS0FDSyxJQUFJcmtCLFFBQVF1aUIsSUFBWixFQUFrQnJqQixLQUFLcWpCLElBQUwsQ0FBVThCLGNBQVY7QUFDeEIsS0FSTSxDQUFQO0FBU0Q7O0FBRUQsTUFBSWhHLE1BQU12RCxFQUFFaGMsRUFBRixDQUFLMm5CLEtBQWY7O0FBRUEzTCxJQUFFaGMsRUFBRixDQUFLMm5CLEtBQUwsR0FBYXRJLE1BQWI7QUFDQXJELElBQUVoYyxFQUFGLENBQUsybkIsS0FBTCxDQUFXbEksV0FBWCxHQUF5QmtGLEtBQXpCOztBQUdBO0FBQ0E7O0FBRUEzSSxJQUFFaGMsRUFBRixDQUFLMm5CLEtBQUwsQ0FBV2pJLFVBQVgsR0FBd0IsWUFBWTtBQUNsQzFELE1BQUVoYyxFQUFGLENBQUsybkIsS0FBTCxHQUFhcEksR0FBYjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7O0FBTUE7QUFDQTs7QUFFQXZELElBQUVsbEIsUUFBRixFQUFZZ0osRUFBWixDQUFlLHlCQUFmLEVBQTBDLHVCQUExQyxFQUFtRSxVQUFVckosQ0FBVixFQUFhO0FBQzlFLFFBQUlvb0IsUUFBUTdDLEVBQUUsSUFBRixDQUFaO0FBQ0EsUUFBSThHLE9BQU9qRSxNQUFNMWlCLElBQU4sQ0FBVyxNQUFYLENBQVg7QUFDQSxRQUFJekcsU0FBU21wQixNQUFNMWlCLElBQU4sQ0FBVyxhQUFYLEtBQ1YybUIsUUFBUUEsS0FBSzFxQixPQUFMLENBQWEsZ0JBQWIsRUFBK0IsRUFBL0IsQ0FEWCxDQUg4RSxDQUkvQjs7QUFFL0MsUUFBSTJxQixVQUFVL0csRUFBRWxsQixRQUFGLEVBQVlpb0IsSUFBWixDQUFpQnJwQixNQUFqQixDQUFkO0FBQ0EsUUFBSStKLFNBQVNzakIsUUFBUTNpQixJQUFSLENBQWEsVUFBYixJQUEyQixRQUEzQixHQUFzQzRiLEVBQUV6bUIsTUFBRixDQUFTLEVBQUU2dkIsUUFBUSxDQUFDLElBQUlybUIsSUFBSixDQUFTK2pCLElBQVQsQ0FBRCxJQUFtQkEsSUFBN0IsRUFBVCxFQUE4Q0MsUUFBUTNpQixJQUFSLEVBQTlDLEVBQThEeWUsTUFBTXplLElBQU4sRUFBOUQsQ0FBbkQ7O0FBRUEsUUFBSXllLE1BQU1SLEVBQU4sQ0FBUyxHQUFULENBQUosRUFBbUI1bkIsRUFBRW9sQixjQUFGOztBQUVuQmtILFlBQVFsRixHQUFSLENBQVksZUFBWixFQUE2QixVQUFVK0osU0FBVixFQUFxQjtBQUNoRCxVQUFJQSxVQUFVMUksa0JBQVYsRUFBSixFQUFvQyxPQURZLENBQ0w7QUFDM0M2RCxjQUFRbEYsR0FBUixDQUFZLGlCQUFaLEVBQStCLFlBQVk7QUFDekNnQixjQUFNUixFQUFOLENBQVMsVUFBVCxLQUF3QlEsTUFBTWYsT0FBTixDQUFjLE9BQWQsQ0FBeEI7QUFDRCxPQUZEO0FBR0QsS0FMRDtBQU1BdUIsV0FBT25yQixJQUFQLENBQVk2dUIsT0FBWixFQUFxQnRqQixNQUFyQixFQUE2QixJQUE3QjtBQUNELEdBbEJEO0FBb0JELENBNVZBLENBNFZDdWQsTUE1VkQsQ0FBRDs7QUE4VkE7Ozs7Ozs7OztBQVNBLENBQUMsVUFBVWhCLENBQVYsRUFBYTtBQUNaOztBQUVBLE1BQUk2TCx3QkFBd0IsQ0FBQyxVQUFELEVBQWEsV0FBYixFQUEwQixZQUExQixDQUE1Qjs7QUFFQSxNQUFJQyxXQUFXLENBQ2IsWUFEYSxFQUViLE1BRmEsRUFHYixNQUhhLEVBSWIsVUFKYSxFQUtiLFVBTGEsRUFNYixRQU5hLEVBT2IsS0FQYSxFQVFiLFlBUmEsQ0FBZjs7QUFXQSxNQUFJQyx5QkFBeUIsZ0JBQTdCOztBQUVBLE1BQUlDLG1CQUFtQjtBQUNyQjtBQUNBLFNBQUssQ0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixNQUF2QixFQUErQixNQUEvQixFQUF1Q0Qsc0JBQXZDLENBRmdCO0FBR3JCcGEsT0FBRyxDQUFDLFFBQUQsRUFBVyxNQUFYLEVBQW1CLE9BQW5CLEVBQTRCLEtBQTVCLENBSGtCO0FBSXJCc2EsVUFBTSxFQUplO0FBS3JCcmEsT0FBRyxFQUxrQjtBQU1yQnNhLFFBQUksRUFOaUI7QUFPckJDLFNBQUssRUFQZ0I7QUFRckJDLFVBQU0sRUFSZTtBQVNyQnZ3QixTQUFLLEVBVGdCO0FBVXJCd3dCLFFBQUksRUFWaUI7QUFXckJDLFFBQUksRUFYaUI7QUFZckJDLFFBQUksRUFaaUI7QUFhckJDLFFBQUksRUFiaUI7QUFjckJDLFFBQUksRUFkaUI7QUFlckJDLFFBQUksRUFmaUI7QUFnQnJCQyxRQUFJLEVBaEJpQjtBQWlCckJDLFFBQUksRUFqQmlCO0FBa0JyQmh6QixPQUFHLEVBbEJrQjtBQW1CckJ1YixTQUFLLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxPQUFmLEVBQXdCLE9BQXhCLEVBQWlDLFFBQWpDLENBbkJnQjtBQW9CckIwWCxRQUFJLEVBcEJpQjtBQXFCckJDLFFBQUksRUFyQmlCO0FBc0JyQkMsT0FBRyxFQXRCa0I7QUF1QnJCQyxTQUFLLEVBdkJnQjtBQXdCckJDLE9BQUcsRUF4QmtCO0FBeUJyQkMsV0FBTyxFQXpCYztBQTBCckJDLFVBQU0sRUExQmU7QUEyQnJCQyxTQUFLLEVBM0JnQjtBQTRCckJDLFNBQUssRUE1QmdCO0FBNkJyQkMsWUFBUSxFQTdCYTtBQThCckJDLE9BQUcsRUE5QmtCO0FBK0JyQkMsUUFBSTs7QUFHTjs7Ozs7QUFsQ3VCLEdBQXZCLENBdUNBLElBQUlDLG1CQUFtQiw2REFBdkI7O0FBRUE7Ozs7O0FBS0EsTUFBSUMsbUJBQW1CLHFJQUF2Qjs7QUFFQSxXQUFTQyxnQkFBVCxDQUEwQnh0QixJQUExQixFQUFnQ3l0QixvQkFBaEMsRUFBc0Q7QUFDcEQsUUFBSUMsV0FBVzF0QixLQUFLa0ssUUFBTCxDQUFjN0gsV0FBZCxFQUFmOztBQUVBLFFBQUl3ZCxFQUFFOE4sT0FBRixDQUFVRCxRQUFWLEVBQW9CRCxvQkFBcEIsTUFBOEMsQ0FBQyxDQUFuRCxFQUFzRDtBQUNwRCxVQUFJNU4sRUFBRThOLE9BQUYsQ0FBVUQsUUFBVixFQUFvQi9CLFFBQXBCLE1BQWtDLENBQUMsQ0FBdkMsRUFBMEM7QUFDeEMsZUFBT2lDLFFBQVE1dEIsS0FBSzZ0QixTQUFMLENBQWVDLEtBQWYsQ0FBcUJSLGdCQUFyQixLQUEwQ3R0QixLQUFLNnRCLFNBQUwsQ0FBZUMsS0FBZixDQUFxQlAsZ0JBQXJCLENBQWxELENBQVA7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJUSxTQUFTbE8sRUFBRTROLG9CQUFGLEVBQXdCTyxNQUF4QixDQUErQixVQUFVaHdCLEtBQVYsRUFBaUJuRSxLQUFqQixFQUF3QjtBQUNsRSxhQUFPQSxpQkFBaUJvMEIsTUFBeEI7QUFDRCxLQUZZLENBQWI7O0FBSUE7QUFDQSxTQUFLLElBQUl4MEIsSUFBSSxDQUFSLEVBQVc2RixJQUFJeXVCLE9BQU9yMEIsTUFBM0IsRUFBbUNELElBQUk2RixDQUF2QyxFQUEwQzdGLEdBQTFDLEVBQStDO0FBQzdDLFVBQUlpMEIsU0FBU0ksS0FBVCxDQUFlQyxPQUFPdDBCLENBQVAsQ0FBZixDQUFKLEVBQStCO0FBQzdCLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsV0FBU3kwQixZQUFULENBQXNCQyxVQUF0QixFQUFrQ0MsU0FBbEMsRUFBNkNDLFVBQTdDLEVBQXlEO0FBQ3ZELFFBQUlGLFdBQVd6MEIsTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUMzQixhQUFPeTBCLFVBQVA7QUFDRDs7QUFFRCxRQUFJRSxjQUFjLE9BQU9BLFVBQVAsS0FBc0IsVUFBeEMsRUFBb0Q7QUFDbEQsYUFBT0EsV0FBV0YsVUFBWCxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLENBQUN4ekIsU0FBUzJ6QixjQUFWLElBQTRCLENBQUMzekIsU0FBUzJ6QixjQUFULENBQXdCQyxrQkFBekQsRUFBNkU7QUFDM0UsYUFBT0osVUFBUDtBQUNEOztBQUVELFFBQUlLLGtCQUFrQjd6QixTQUFTMnpCLGNBQVQsQ0FBd0JDLGtCQUF4QixDQUEyQyxjQUEzQyxDQUF0QjtBQUNBQyxvQkFBZ0I1ekIsSUFBaEIsQ0FBcUI2QixTQUFyQixHQUFpQzB4QixVQUFqQzs7QUFFQSxRQUFJTSxnQkFBZ0I1TyxFQUFFNk8sR0FBRixDQUFNTixTQUFOLEVBQWlCLFVBQVUzdUIsRUFBVixFQUFjaEcsQ0FBZCxFQUFpQjtBQUFFLGFBQU9BLENBQVA7QUFBVSxLQUE5QyxDQUFwQjtBQUNBLFFBQUlrMUIsV0FBVzlPLEVBQUUyTyxnQkFBZ0I1ekIsSUFBbEIsRUFBd0Jnb0IsSUFBeEIsQ0FBNkIsR0FBN0IsQ0FBZjs7QUFFQSxTQUFLLElBQUlucEIsSUFBSSxDQUFSLEVBQVdxSSxNQUFNNnNCLFNBQVNqMUIsTUFBL0IsRUFBdUNELElBQUlxSSxHQUEzQyxFQUFnRHJJLEdBQWhELEVBQXFEO0FBQ25ELFVBQUlnRyxLQUFLa3ZCLFNBQVNsMUIsQ0FBVCxDQUFUO0FBQ0EsVUFBSW0xQixTQUFTbnZCLEdBQUd5SyxRQUFILENBQVk3SCxXQUFaLEVBQWI7O0FBRUEsVUFBSXdkLEVBQUU4TixPQUFGLENBQVVpQixNQUFWLEVBQWtCSCxhQUFsQixNQUFxQyxDQUFDLENBQTFDLEVBQTZDO0FBQzNDaHZCLFdBQUd0SCxVQUFILENBQWNDLFdBQWQsQ0FBMEJxSCxFQUExQjs7QUFFQTtBQUNEOztBQUVELFVBQUlvdkIsZ0JBQWdCaFAsRUFBRTZPLEdBQUYsQ0FBTWp2QixHQUFHcXZCLFVBQVQsRUFBcUIsVUFBVXJ2QixFQUFWLEVBQWM7QUFBRSxlQUFPQSxFQUFQO0FBQVcsT0FBaEQsQ0FBcEI7QUFDQSxVQUFJc3ZCLHdCQUF3QixHQUFHQyxNQUFILENBQVVaLFVBQVUsR0FBVixLQUFrQixFQUE1QixFQUFnQ0EsVUFBVVEsTUFBVixLQUFxQixFQUFyRCxDQUE1Qjs7QUFFQSxXQUFLLElBQUkvdEIsSUFBSSxDQUFSLEVBQVdvdUIsT0FBT0osY0FBY24xQixNQUFyQyxFQUE2Q21ILElBQUlvdUIsSUFBakQsRUFBdURwdUIsR0FBdkQsRUFBNEQ7QUFDMUQsWUFBSSxDQUFDMnNCLGlCQUFpQnFCLGNBQWNodUIsQ0FBZCxDQUFqQixFQUFtQ2t1QixxQkFBbkMsQ0FBTCxFQUFnRTtBQUM5RHR2QixhQUFHcUIsZUFBSCxDQUFtQit0QixjQUFjaHVCLENBQWQsRUFBaUJxSixRQUFwQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxXQUFPc2tCLGdCQUFnQjV6QixJQUFoQixDQUFxQjZCLFNBQTVCO0FBQ0Q7O0FBRUQ7QUFDQTs7QUFFQSxNQUFJeXlCLFVBQVUsU0FBVkEsT0FBVSxDQUFVL3FCLE9BQVYsRUFBbUJZLE9BQW5CLEVBQTRCO0FBQ3hDLFNBQUs3SCxJQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBSzZILE9BQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLb3FCLE9BQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFNBQUs1TCxRQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBSzZMLE9BQUwsR0FBa0IsSUFBbEI7O0FBRUEsU0FBS0MsSUFBTCxDQUFVLFNBQVYsRUFBcUJwckIsT0FBckIsRUFBOEJZLE9BQTlCO0FBQ0QsR0FWRDs7QUFZQW1xQixVQUFRMU0sT0FBUixHQUFtQixPQUFuQjs7QUFFQTBNLFVBQVF6TSxtQkFBUixHQUE4QixHQUE5Qjs7QUFFQXlNLFVBQVF4TCxRQUFSLEdBQW1CO0FBQ2pCOEwsZUFBVyxJQURNO0FBRWpCQyxlQUFXLEtBRk07QUFHakIzeEIsY0FBVSxLQUhPO0FBSWpCNHhCLGNBQVUsOEdBSk87QUFLakIvTixhQUFTLGFBTFE7QUFNakJnTyxXQUFPLEVBTlU7QUFPakJDLFdBQU8sQ0FQVTtBQVFqQnJWLFVBQU0sS0FSVztBQVNqQnZWLGVBQVcsS0FUTTtBQVVqQnFHLGNBQVU7QUFDUnZOLGdCQUFVLE1BREY7QUFFUnN0QixlQUFTO0FBRkQsS0FWTztBQWNqQnlFLGNBQVcsSUFkTTtBQWVqQnhCLGdCQUFhLElBZkk7QUFnQmpCRCxlQUFZdkM7QUFoQkssR0FBbkI7O0FBbUJBcUQsVUFBUXIzQixTQUFSLENBQWtCMDNCLElBQWxCLEdBQXlCLFVBQVVyeUIsSUFBVixFQUFnQmlILE9BQWhCLEVBQXlCWSxPQUF6QixFQUFrQztBQUN6RCxTQUFLb3FCLE9BQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLanlCLElBQUwsR0FBaUJBLElBQWpCO0FBQ0EsU0FBS3VtQixRQUFMLEdBQWlCNUQsRUFBRTFiLE9BQUYsQ0FBakI7QUFDQSxTQUFLWSxPQUFMLEdBQWlCLEtBQUsrcUIsVUFBTCxDQUFnQi9xQixPQUFoQixDQUFqQjtBQUNBLFNBQUtnckIsU0FBTCxHQUFpQixLQUFLaHJCLE9BQUwsQ0FBYXNHLFFBQWIsSUFBeUJ3VSxFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCL0MsRUFBRW1RLFVBQUYsQ0FBYSxLQUFLanJCLE9BQUwsQ0FBYXNHLFFBQTFCLElBQXNDLEtBQUt0RyxPQUFMLENBQWFzRyxRQUFiLENBQXNCdFQsSUFBdEIsQ0FBMkIsSUFBM0IsRUFBaUMsS0FBSzByQixRQUF0QyxDQUF0QyxHQUF5RixLQUFLMWUsT0FBTCxDQUFhc0csUUFBYixDQUFzQnZOLFFBQXRCLElBQWtDLEtBQUtpSCxPQUFMLENBQWFzRyxRQUF6SixDQUExQztBQUNBLFNBQUtpa0IsT0FBTCxHQUFpQixFQUFFVyxPQUFPLEtBQVQsRUFBZ0JDLE9BQU8sS0FBdkIsRUFBOEIvUSxPQUFPLEtBQXJDLEVBQWpCOztBQUVBLFFBQUksS0FBS3NFLFFBQUwsQ0FBYyxDQUFkLGFBQTRCOW9CLFNBQVN3MUIsV0FBckMsSUFBb0QsQ0FBQyxLQUFLcHJCLE9BQUwsQ0FBYWpILFFBQXRFLEVBQWdGO0FBQzlFLFlBQU0sSUFBSWdqQixLQUFKLENBQVUsMkRBQTJELEtBQUs1akIsSUFBaEUsR0FBdUUsaUNBQWpGLENBQU47QUFDRDs7QUFFRCxRQUFJa3pCLFdBQVcsS0FBS3JyQixPQUFMLENBQWE0YyxPQUFiLENBQXFCWCxLQUFyQixDQUEyQixHQUEzQixDQUFmOztBQUVBLFNBQUssSUFBSXZuQixJQUFJMjJCLFNBQVMxMkIsTUFBdEIsRUFBOEJELEdBQTlCLEdBQW9DO0FBQ2xDLFVBQUlrb0IsVUFBVXlPLFNBQVMzMkIsQ0FBVCxDQUFkOztBQUVBLFVBQUlrb0IsV0FBVyxPQUFmLEVBQXdCO0FBQ3RCLGFBQUs4QixRQUFMLENBQWM5ZixFQUFkLENBQWlCLFdBQVcsS0FBS3pHLElBQWpDLEVBQXVDLEtBQUs2SCxPQUFMLENBQWFqSCxRQUFwRCxFQUE4RCtoQixFQUFFb0UsS0FBRixDQUFRLEtBQUtFLE1BQWIsRUFBcUIsSUFBckIsQ0FBOUQ7QUFDRCxPQUZELE1BRU8sSUFBSXhDLFdBQVcsUUFBZixFQUF5QjtBQUM5QixZQUFJME8sVUFBVzFPLFdBQVcsT0FBWCxHQUFxQixZQUFyQixHQUFvQyxTQUFuRDtBQUNBLFlBQUkyTyxXQUFXM08sV0FBVyxPQUFYLEdBQXFCLFlBQXJCLEdBQW9DLFVBQW5EOztBQUVBLGFBQUs4QixRQUFMLENBQWM5ZixFQUFkLENBQWlCMHNCLFVBQVcsR0FBWCxHQUFpQixLQUFLbnpCLElBQXZDLEVBQTZDLEtBQUs2SCxPQUFMLENBQWFqSCxRQUExRCxFQUFvRStoQixFQUFFb0UsS0FBRixDQUFRLEtBQUtzTSxLQUFiLEVBQW9CLElBQXBCLENBQXBFO0FBQ0EsYUFBSzlNLFFBQUwsQ0FBYzlmLEVBQWQsQ0FBaUIyc0IsV0FBVyxHQUFYLEdBQWlCLEtBQUtwekIsSUFBdkMsRUFBNkMsS0FBSzZILE9BQUwsQ0FBYWpILFFBQTFELEVBQW9FK2hCLEVBQUVvRSxLQUFGLENBQVEsS0FBS3VNLEtBQWIsRUFBb0IsSUFBcEIsQ0FBcEU7QUFDRDtBQUNGOztBQUVELFNBQUt6ckIsT0FBTCxDQUFhakgsUUFBYixHQUNHLEtBQUsyeUIsUUFBTCxHQUFnQjVRLEVBQUV6bUIsTUFBRixDQUFTLEVBQVQsRUFBYSxLQUFLMkwsT0FBbEIsRUFBMkIsRUFBRTRjLFNBQVMsUUFBWCxFQUFxQjdqQixVQUFVLEVBQS9CLEVBQTNCLENBRG5CLEdBRUUsS0FBSzR5QixRQUFMLEVBRkY7QUFHRCxHQS9CRDs7QUFpQ0F4QixVQUFRcjNCLFNBQVIsQ0FBa0I4NEIsV0FBbEIsR0FBZ0MsWUFBWTtBQUMxQyxXQUFPekIsUUFBUXhMLFFBQWY7QUFDRCxHQUZEOztBQUlBd0wsVUFBUXIzQixTQUFSLENBQWtCaTRCLFVBQWxCLEdBQStCLFVBQVUvcUIsT0FBVixFQUFtQjtBQUNoRCxRQUFJNnJCLGlCQUFpQixLQUFLbk4sUUFBTCxDQUFjeGYsSUFBZCxFQUFyQjs7QUFFQSxTQUFLLElBQUk0c0IsUUFBVCxJQUFxQkQsY0FBckIsRUFBcUM7QUFDbkMsVUFBSUEsZUFBZTk0QixjQUFmLENBQThCKzRCLFFBQTlCLEtBQTJDaFIsRUFBRThOLE9BQUYsQ0FBVWtELFFBQVYsRUFBb0JuRixxQkFBcEIsTUFBK0MsQ0FBQyxDQUEvRixFQUFrRztBQUNoRyxlQUFPa0YsZUFBZUMsUUFBZixDQUFQO0FBQ0Q7QUFDRjs7QUFFRDlyQixjQUFVOGEsRUFBRXptQixNQUFGLENBQVMsRUFBVCxFQUFhLEtBQUt1M0IsV0FBTCxFQUFiLEVBQWlDQyxjQUFqQyxFQUFpRDdyQixPQUFqRCxDQUFWOztBQUVBLFFBQUlBLFFBQVE2cUIsS0FBUixJQUFpQixPQUFPN3FCLFFBQVE2cUIsS0FBZixJQUF3QixRQUE3QyxFQUF1RDtBQUNyRDdxQixjQUFRNnFCLEtBQVIsR0FBZ0I7QUFDZHRJLGNBQU12aUIsUUFBUTZxQixLQURBO0FBRWQvSCxjQUFNOWlCLFFBQVE2cUI7QUFGQSxPQUFoQjtBQUlEOztBQUVELFFBQUk3cUIsUUFBUThxQixRQUFaLEVBQXNCO0FBQ3BCOXFCLGNBQVEycUIsUUFBUixHQUFtQnhCLGFBQWFucEIsUUFBUTJxQixRQUFyQixFQUErQjNxQixRQUFRcXBCLFNBQXZDLEVBQWtEcnBCLFFBQVFzcEIsVUFBMUQsQ0FBbkI7QUFDRDs7QUFFRCxXQUFPdHBCLE9BQVA7QUFDRCxHQXZCRDs7QUF5QkFtcUIsVUFBUXIzQixTQUFSLENBQWtCaTVCLGtCQUFsQixHQUF1QyxZQUFZO0FBQ2pELFFBQUkvckIsVUFBVyxFQUFmO0FBQ0EsUUFBSWdzQixXQUFXLEtBQUtKLFdBQUwsRUFBZjs7QUFFQSxTQUFLRixRQUFMLElBQWlCNVEsRUFBRXNELElBQUYsQ0FBTyxLQUFLc04sUUFBWixFQUFzQixVQUFVdDJCLEdBQVYsRUFBZU4sS0FBZixFQUFzQjtBQUMzRCxVQUFJazNCLFNBQVM1MkIsR0FBVCxLQUFpQk4sS0FBckIsRUFBNEJrTCxRQUFRNUssR0FBUixJQUFlTixLQUFmO0FBQzdCLEtBRmdCLENBQWpCOztBQUlBLFdBQU9rTCxPQUFQO0FBQ0QsR0FURDs7QUFXQW1xQixVQUFRcjNCLFNBQVIsQ0FBa0IwNEIsS0FBbEIsR0FBMEIsVUFBVWwzQixHQUFWLEVBQWU7QUFDdkMsUUFBSTIzQixPQUFPMzNCLGVBQWUsS0FBSzgyQixXQUFwQixHQUNUOTJCLEdBRFMsR0FDSHdtQixFQUFFeG1CLElBQUlneEIsYUFBTixFQUFxQnBtQixJQUFyQixDQUEwQixRQUFRLEtBQUsvRyxJQUF2QyxDQURSOztBQUdBLFFBQUksQ0FBQzh6QixJQUFMLEVBQVc7QUFDVEEsYUFBTyxJQUFJLEtBQUtiLFdBQVQsQ0FBcUI5MkIsSUFBSWd4QixhQUF6QixFQUF3QyxLQUFLeUcsa0JBQUwsRUFBeEMsQ0FBUDtBQUNBalIsUUFBRXhtQixJQUFJZ3hCLGFBQU4sRUFBcUJwbUIsSUFBckIsQ0FBMEIsUUFBUSxLQUFLL0csSUFBdkMsRUFBNkM4ekIsSUFBN0M7QUFDRDs7QUFFRCxRQUFJMzNCLGVBQWV3bUIsRUFBRWlELEtBQXJCLEVBQTRCO0FBQzFCa08sV0FBSzFCLE9BQUwsQ0FBYWoyQixJQUFJNkQsSUFBSixJQUFZLFNBQVosR0FBd0IsT0FBeEIsR0FBa0MsT0FBL0MsSUFBMEQsSUFBMUQ7QUFDRDs7QUFFRCxRQUFJOHpCLEtBQUtDLEdBQUwsR0FBV3p4QixRQUFYLENBQW9CLElBQXBCLEtBQTZCd3hCLEtBQUszQixVQUFMLElBQW1CLElBQXBELEVBQTBEO0FBQ3hEMkIsV0FBSzNCLFVBQUwsR0FBa0IsSUFBbEI7QUFDQTtBQUNEOztBQUVEbDJCLGlCQUFhNjNCLEtBQUs1QixPQUFsQjs7QUFFQTRCLFNBQUszQixVQUFMLEdBQWtCLElBQWxCOztBQUVBLFFBQUksQ0FBQzJCLEtBQUtqc0IsT0FBTCxDQUFhNnFCLEtBQWQsSUFBdUIsQ0FBQ29CLEtBQUtqc0IsT0FBTCxDQUFhNnFCLEtBQWIsQ0FBbUJ0SSxJQUEvQyxFQUFxRCxPQUFPMEosS0FBSzFKLElBQUwsRUFBUDs7QUFFckQwSixTQUFLNUIsT0FBTCxHQUFldjJCLFdBQVcsWUFBWTtBQUNwQyxVQUFJbTRCLEtBQUszQixVQUFMLElBQW1CLElBQXZCLEVBQTZCMkIsS0FBSzFKLElBQUw7QUFDOUIsS0FGYyxFQUVaMEosS0FBS2pzQixPQUFMLENBQWE2cUIsS0FBYixDQUFtQnRJLElBRlAsQ0FBZjtBQUdELEdBM0JEOztBQTZCQTRILFVBQVFyM0IsU0FBUixDQUFrQnE1QixhQUFsQixHQUFrQyxZQUFZO0FBQzVDLFNBQUssSUFBSS8yQixHQUFULElBQWdCLEtBQUttMUIsT0FBckIsRUFBOEI7QUFDNUIsVUFBSSxLQUFLQSxPQUFMLENBQWFuMUIsR0FBYixDQUFKLEVBQXVCLE9BQU8sSUFBUDtBQUN4Qjs7QUFFRCxXQUFPLEtBQVA7QUFDRCxHQU5EOztBQVFBKzBCLFVBQVFyM0IsU0FBUixDQUFrQjI0QixLQUFsQixHQUEwQixVQUFVbjNCLEdBQVYsRUFBZTtBQUN2QyxRQUFJMjNCLE9BQU8zM0IsZUFBZSxLQUFLODJCLFdBQXBCLEdBQ1Q5MkIsR0FEUyxHQUNId21CLEVBQUV4bUIsSUFBSWd4QixhQUFOLEVBQXFCcG1CLElBQXJCLENBQTBCLFFBQVEsS0FBSy9HLElBQXZDLENBRFI7O0FBR0EsUUFBSSxDQUFDOHpCLElBQUwsRUFBVztBQUNUQSxhQUFPLElBQUksS0FBS2IsV0FBVCxDQUFxQjkyQixJQUFJZ3hCLGFBQXpCLEVBQXdDLEtBQUt5RyxrQkFBTCxFQUF4QyxDQUFQO0FBQ0FqUixRQUFFeG1CLElBQUlneEIsYUFBTixFQUFxQnBtQixJQUFyQixDQUEwQixRQUFRLEtBQUsvRyxJQUF2QyxFQUE2Qzh6QixJQUE3QztBQUNEOztBQUVELFFBQUkzM0IsZUFBZXdtQixFQUFFaUQsS0FBckIsRUFBNEI7QUFDMUJrTyxXQUFLMUIsT0FBTCxDQUFhajJCLElBQUk2RCxJQUFKLElBQVksVUFBWixHQUF5QixPQUF6QixHQUFtQyxPQUFoRCxJQUEyRCxLQUEzRDtBQUNEOztBQUVELFFBQUk4ekIsS0FBS0UsYUFBTCxFQUFKLEVBQTBCOztBQUUxQi8zQixpQkFBYTYzQixLQUFLNUIsT0FBbEI7O0FBRUE0QixTQUFLM0IsVUFBTCxHQUFrQixLQUFsQjs7QUFFQSxRQUFJLENBQUMyQixLQUFLanNCLE9BQUwsQ0FBYTZxQixLQUFkLElBQXVCLENBQUNvQixLQUFLanNCLE9BQUwsQ0FBYTZxQixLQUFiLENBQW1CL0gsSUFBL0MsRUFBcUQsT0FBT21KLEtBQUtuSixJQUFMLEVBQVA7O0FBRXJEbUosU0FBSzVCLE9BQUwsR0FBZXYyQixXQUFXLFlBQVk7QUFDcEMsVUFBSW00QixLQUFLM0IsVUFBTCxJQUFtQixLQUF2QixFQUE4QjJCLEtBQUtuSixJQUFMO0FBQy9CLEtBRmMsRUFFWm1KLEtBQUtqc0IsT0FBTCxDQUFhNnFCLEtBQWIsQ0FBbUIvSCxJQUZQLENBQWY7QUFHRCxHQXhCRDs7QUEwQkFxSCxVQUFRcjNCLFNBQVIsQ0FBa0J5dkIsSUFBbEIsR0FBeUIsWUFBWTtBQUNuQyxRQUFJaHRCLElBQUl1bEIsRUFBRWlELEtBQUYsQ0FBUSxhQUFhLEtBQUs1bEIsSUFBMUIsQ0FBUjs7QUFFQSxRQUFJLEtBQUtpMEIsVUFBTCxNQUFxQixLQUFLaEMsT0FBOUIsRUFBdUM7QUFDckMsV0FBSzFMLFFBQUwsQ0FBYzlCLE9BQWQsQ0FBc0JybkIsQ0FBdEI7O0FBRUEsVUFBSTgyQixRQUFRdlIsRUFBRWxnQixRQUFGLENBQVcsS0FBSzhqQixRQUFMLENBQWMsQ0FBZCxFQUFpQjROLGFBQWpCLENBQStCcjJCLGVBQTFDLEVBQTJELEtBQUt5b0IsUUFBTCxDQUFjLENBQWQsQ0FBM0QsQ0FBWjtBQUNBLFVBQUlucEIsRUFBRXlvQixrQkFBRixNQUEwQixDQUFDcU8sS0FBL0IsRUFBc0M7QUFDdEMsVUFBSWxMLE9BQU8sSUFBWDs7QUFFQSxVQUFJb0wsT0FBTyxLQUFLTCxHQUFMLEVBQVg7O0FBRUEsVUFBSU0sUUFBUSxLQUFLQyxNQUFMLENBQVksS0FBS3QwQixJQUFqQixDQUFaOztBQUVBLFdBQUt1MEIsVUFBTDtBQUNBSCxXQUFLdHhCLElBQUwsQ0FBVSxJQUFWLEVBQWdCdXhCLEtBQWhCO0FBQ0EsV0FBSzlOLFFBQUwsQ0FBY3pqQixJQUFkLENBQW1CLGtCQUFuQixFQUF1Q3V4QixLQUF2Qzs7QUFFQSxVQUFJLEtBQUt4c0IsT0FBTCxDQUFheXFCLFNBQWpCLEVBQTRCOEIsS0FBSzF4QixRQUFMLENBQWMsTUFBZDs7QUFFNUIsVUFBSTZ2QixZQUFZLE9BQU8sS0FBSzFxQixPQUFMLENBQWEwcUIsU0FBcEIsSUFBaUMsVUFBakMsR0FDZCxLQUFLMXFCLE9BQUwsQ0FBYTBxQixTQUFiLENBQXVCMTNCLElBQXZCLENBQTRCLElBQTVCLEVBQWtDdTVCLEtBQUssQ0FBTCxDQUFsQyxFQUEyQyxLQUFLN04sUUFBTCxDQUFjLENBQWQsQ0FBM0MsQ0FEYyxHQUVkLEtBQUsxZSxPQUFMLENBQWEwcUIsU0FGZjs7QUFJQSxVQUFJaUMsWUFBWSxjQUFoQjtBQUNBLFVBQUlDLFlBQVlELFVBQVU5dUIsSUFBVixDQUFlNnNCLFNBQWYsQ0FBaEI7QUFDQSxVQUFJa0MsU0FBSixFQUFlbEMsWUFBWUEsVUFBVXh6QixPQUFWLENBQWtCeTFCLFNBQWxCLEVBQTZCLEVBQTdCLEtBQW9DLEtBQWhEOztBQUVmSixXQUNHck8sTUFESCxHQUVHeUgsR0FGSCxDQUVPLEVBQUVrSCxLQUFLLENBQVAsRUFBVS8wQixNQUFNLENBQWhCLEVBQW1Cc0UsU0FBUyxPQUE1QixFQUZQLEVBR0d2QixRQUhILENBR1k2dkIsU0FIWixFQUlHeHJCLElBSkgsQ0FJUSxRQUFRLEtBQUsvRyxJQUpyQixFQUkyQixJQUozQjs7QUFNQSxXQUFLNkgsT0FBTCxDQUFhQyxTQUFiLEdBQXlCc3NCLEtBQUs3SCxRQUFMLENBQWM1SixFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCLEtBQUs3ZCxPQUFMLENBQWFDLFNBQTlCLENBQWQsQ0FBekIsR0FBbUZzc0IsS0FBS2pKLFdBQUwsQ0FBaUIsS0FBSzVFLFFBQXRCLENBQW5GO0FBQ0EsV0FBS0EsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQixpQkFBaUIsS0FBS3prQixJQUE1Qzs7QUFFQSxVQUFJd1YsTUFBZSxLQUFLbWYsV0FBTCxFQUFuQjtBQUNBLFVBQUlDLGNBQWVSLEtBQUssQ0FBTCxFQUFRdDFCLFdBQTNCO0FBQ0EsVUFBSSsxQixlQUFlVCxLQUFLLENBQUwsRUFBUTkxQixZQUEzQjs7QUFFQSxVQUFJbTJCLFNBQUosRUFBZTtBQUNiLFlBQUlLLGVBQWV2QyxTQUFuQjtBQUNBLFlBQUl3QyxjQUFjLEtBQUtKLFdBQUwsQ0FBaUIsS0FBSzlCLFNBQXRCLENBQWxCOztBQUVBTixvQkFBWUEsYUFBYSxRQUFiLElBQXlCL2MsSUFBSXdmLE1BQUosR0FBYUgsWUFBYixHQUE0QkUsWUFBWUMsTUFBakUsR0FBMEUsS0FBMUUsR0FDQXpDLGFBQWEsS0FBYixJQUF5Qi9jLElBQUlrZixHQUFKLEdBQWFHLFlBQWIsR0FBNEJFLFlBQVlMLEdBQWpFLEdBQTBFLFFBQTFFLEdBQ0FuQyxhQUFhLE9BQWIsSUFBeUIvYyxJQUFJRyxLQUFKLEdBQWFpZixXQUFiLEdBQTRCRyxZQUFZbDJCLEtBQWpFLEdBQTBFLE1BQTFFLEdBQ0EwekIsYUFBYSxNQUFiLElBQXlCL2MsSUFBSTdWLElBQUosR0FBYWkxQixXQUFiLEdBQTRCRyxZQUFZcDFCLElBQWpFLEdBQTBFLE9BQTFFLEdBQ0E0eUIsU0FKWjs7QUFNQTZCLGFBQ0d4eEIsV0FESCxDQUNla3lCLFlBRGYsRUFFR3B5QixRQUZILENBRVk2dkIsU0FGWjtBQUdEOztBQUVELFVBQUkwQyxtQkFBbUIsS0FBS0MsbUJBQUwsQ0FBeUIzQyxTQUF6QixFQUFvQy9jLEdBQXBDLEVBQXlDb2YsV0FBekMsRUFBc0RDLFlBQXRELENBQXZCOztBQUVBLFdBQUtNLGNBQUwsQ0FBb0JGLGdCQUFwQixFQUFzQzFDLFNBQXRDOztBQUVBLFVBQUkvSCxXQUFXLFNBQVhBLFFBQVcsR0FBWTtBQUN6QixZQUFJNEssaUJBQWlCcE0sS0FBS21KLFVBQTFCO0FBQ0FuSixhQUFLekMsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQixjQUFjdUUsS0FBS2hwQixJQUF6QztBQUNBZ3BCLGFBQUttSixVQUFMLEdBQWtCLElBQWxCOztBQUVBLFlBQUlpRCxrQkFBa0IsS0FBdEIsRUFBNkJwTSxLQUFLc0ssS0FBTCxDQUFXdEssSUFBWDtBQUM5QixPQU5EOztBQVFBckcsUUFBRStCLE9BQUYsQ0FBVU4sVUFBVixJQUF3QixLQUFLZ1EsSUFBTCxDQUFVOXhCLFFBQVYsQ0FBbUIsTUFBbkIsQ0FBeEIsR0FDRTh4QixLQUNHNVAsR0FESCxDQUNPLGlCQURQLEVBQzBCZ0csUUFEMUIsRUFFR25HLG9CQUZILENBRXdCMk4sUUFBUXpNLG1CQUZoQyxDQURGLEdBSUVpRixVQUpGO0FBS0Q7QUFDRixHQTFFRDs7QUE0RUF3SCxVQUFRcjNCLFNBQVIsQ0FBa0J3NkIsY0FBbEIsR0FBbUMsVUFBVUUsTUFBVixFQUFrQjlDLFNBQWxCLEVBQTZCO0FBQzlELFFBQUk2QixPQUFTLEtBQUtMLEdBQUwsRUFBYjtBQUNBLFFBQUlsMUIsUUFBU3UxQixLQUFLLENBQUwsRUFBUXQxQixXQUFyQjtBQUNBLFFBQUlzZSxTQUFTZ1gsS0FBSyxDQUFMLEVBQVE5MUIsWUFBckI7O0FBRUE7QUFDQSxRQUFJZzNCLFlBQVl6ZixTQUFTdWUsS0FBSzVHLEdBQUwsQ0FBUyxZQUFULENBQVQsRUFBaUMsRUFBakMsQ0FBaEI7QUFDQSxRQUFJMVUsYUFBYWpELFNBQVN1ZSxLQUFLNUcsR0FBTCxDQUFTLGFBQVQsQ0FBVCxFQUFrQyxFQUFsQyxDQUFqQjs7QUFFQTtBQUNBLFFBQUl4TSxNQUFNc1UsU0FBTixDQUFKLEVBQXVCQSxZQUFhLENBQWI7QUFDdkIsUUFBSXRVLE1BQU1sSSxVQUFOLENBQUosRUFBdUJBLGFBQWEsQ0FBYjs7QUFFdkJ1YyxXQUFPWCxHQUFQLElBQWVZLFNBQWY7QUFDQUQsV0FBTzExQixJQUFQLElBQWVtWixVQUFmOztBQUVBO0FBQ0E7QUFDQTZKLE1BQUUwUyxNQUFGLENBQVNFLFNBQVQsQ0FBbUJuQixLQUFLLENBQUwsQ0FBbkIsRUFBNEJ6UixFQUFFem1CLE1BQUYsQ0FBUztBQUNuQ3M1QixhQUFPLGVBQVVueEIsS0FBVixFQUFpQjtBQUN0Qit2QixhQUFLNUcsR0FBTCxDQUFTO0FBQ1BrSCxlQUFLbDFCLEtBQUtpMkIsS0FBTCxDQUFXcHhCLE1BQU1xd0IsR0FBakIsQ0FERTtBQUVQLzBCLGdCQUFNSCxLQUFLaTJCLEtBQUwsQ0FBV3B4QixNQUFNMUUsSUFBakI7QUFGQyxTQUFUO0FBSUQ7QUFOa0MsS0FBVCxFQU96QjAxQixNQVB5QixDQUE1QixFQU9ZLENBUFo7O0FBU0FqQixTQUFLMXhCLFFBQUwsQ0FBYyxJQUFkOztBQUVBO0FBQ0EsUUFBSWt5QixjQUFlUixLQUFLLENBQUwsRUFBUXQxQixXQUEzQjtBQUNBLFFBQUkrMUIsZUFBZVQsS0FBSyxDQUFMLEVBQVE5MUIsWUFBM0I7O0FBRUEsUUFBSWkwQixhQUFhLEtBQWIsSUFBc0JzQyxnQkFBZ0J6WCxNQUExQyxFQUFrRDtBQUNoRGlZLGFBQU9YLEdBQVAsR0FBYVcsT0FBT1gsR0FBUCxHQUFhdFgsTUFBYixHQUFzQnlYLFlBQW5DO0FBQ0Q7O0FBRUQsUUFBSWhNLFFBQVEsS0FBSzZNLHdCQUFMLENBQThCbkQsU0FBOUIsRUFBeUM4QyxNQUF6QyxFQUFpRFQsV0FBakQsRUFBOERDLFlBQTlELENBQVo7O0FBRUEsUUFBSWhNLE1BQU1scEIsSUFBVixFQUFnQjAxQixPQUFPMTFCLElBQVAsSUFBZWtwQixNQUFNbHBCLElBQXJCLENBQWhCLEtBQ0swMUIsT0FBT1gsR0FBUCxJQUFjN0wsTUFBTTZMLEdBQXBCOztBQUVMLFFBQUlpQixhQUFzQixhQUFhandCLElBQWIsQ0FBa0I2c0IsU0FBbEIsQ0FBMUI7QUFDQSxRQUFJcUQsYUFBc0JELGFBQWE5TSxNQUFNbHBCLElBQU4sR0FBYSxDQUFiLEdBQWlCZCxLQUFqQixHQUF5QisxQixXQUF0QyxHQUFvRC9MLE1BQU02TCxHQUFOLEdBQVksQ0FBWixHQUFnQnRYLE1BQWhCLEdBQXlCeVgsWUFBdkc7QUFDQSxRQUFJZ0Isc0JBQXNCRixhQUFhLGFBQWIsR0FBNkIsY0FBdkQ7O0FBRUF2QixTQUFLaUIsTUFBTCxDQUFZQSxNQUFaO0FBQ0EsU0FBS1MsWUFBTCxDQUFrQkYsVUFBbEIsRUFBOEJ4QixLQUFLLENBQUwsRUFBUXlCLG1CQUFSLENBQTlCLEVBQTRERixVQUE1RDtBQUNELEdBaEREOztBQWtEQTNELFVBQVFyM0IsU0FBUixDQUFrQm03QixZQUFsQixHQUFpQyxVQUFVak4sS0FBVixFQUFpQnFCLFNBQWpCLEVBQTRCeUwsVUFBNUIsRUFBd0M7QUFDdkUsU0FBS0ksS0FBTCxHQUNHdkksR0FESCxDQUNPbUksYUFBYSxNQUFiLEdBQXNCLEtBRDdCLEVBQ29DLE1BQU0sSUFBSTlNLFFBQVFxQixTQUFsQixJQUErQixHQURuRSxFQUVHc0QsR0FGSCxDQUVPbUksYUFBYSxLQUFiLEdBQXFCLE1BRjVCLEVBRW9DLEVBRnBDO0FBR0QsR0FKRDs7QUFNQTNELFVBQVFyM0IsU0FBUixDQUFrQjQ1QixVQUFsQixHQUErQixZQUFZO0FBQ3pDLFFBQUlILE9BQVEsS0FBS0wsR0FBTCxFQUFaO0FBQ0EsUUFBSXRCLFFBQVEsS0FBS3VELFFBQUwsRUFBWjs7QUFFQSxRQUFJLEtBQUtudUIsT0FBTCxDQUFhd1YsSUFBakIsRUFBdUI7QUFDckIsVUFBSSxLQUFLeFYsT0FBTCxDQUFhOHFCLFFBQWpCLEVBQTJCO0FBQ3pCRixnQkFBUXpCLGFBQWF5QixLQUFiLEVBQW9CLEtBQUs1cUIsT0FBTCxDQUFhcXBCLFNBQWpDLEVBQTRDLEtBQUtycEIsT0FBTCxDQUFhc3BCLFVBQXpELENBQVI7QUFDRDs7QUFFRGlELFdBQUsxTyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJySSxJQUE1QixDQUFpQ29WLEtBQWpDO0FBQ0QsS0FORCxNQU1PO0FBQ0wyQixXQUFLMU8sSUFBTCxDQUFVLGdCQUFWLEVBQTRCdVEsSUFBNUIsQ0FBaUN4RCxLQUFqQztBQUNEOztBQUVEMkIsU0FBS3h4QixXQUFMLENBQWlCLCtCQUFqQjtBQUNELEdBZkQ7O0FBaUJBb3ZCLFVBQVFyM0IsU0FBUixDQUFrQmd3QixJQUFsQixHQUF5QixVQUFVem9CLFFBQVYsRUFBb0I7QUFDM0MsUUFBSThtQixPQUFPLElBQVg7QUFDQSxRQUFJb0wsT0FBT3pSLEVBQUUsS0FBS3lSLElBQVAsQ0FBWDtBQUNBLFFBQUloM0IsSUFBT3VsQixFQUFFaUQsS0FBRixDQUFRLGFBQWEsS0FBSzVsQixJQUExQixDQUFYOztBQUVBLGFBQVN3cUIsUUFBVCxHQUFvQjtBQUNsQixVQUFJeEIsS0FBS21KLFVBQUwsSUFBbUIsSUFBdkIsRUFBNkJpQyxLQUFLck8sTUFBTDtBQUM3QixVQUFJaUQsS0FBS3pDLFFBQVQsRUFBbUI7QUFBRTtBQUNuQnlDLGFBQUt6QyxRQUFMLENBQ0dTLFVBREgsQ0FDYyxrQkFEZCxFQUVHdkMsT0FGSCxDQUVXLGVBQWV1RSxLQUFLaHBCLElBRi9CO0FBR0Q7QUFDRGtDLGtCQUFZQSxVQUFaO0FBQ0Q7O0FBRUQsU0FBS3FrQixRQUFMLENBQWM5QixPQUFkLENBQXNCcm5CLENBQXRCOztBQUVBLFFBQUlBLEVBQUV5b0Isa0JBQUYsRUFBSixFQUE0Qjs7QUFFNUJ1TyxTQUFLeHhCLFdBQUwsQ0FBaUIsSUFBakI7O0FBRUErZixNQUFFK0IsT0FBRixDQUFVTixVQUFWLElBQXdCZ1EsS0FBSzl4QixRQUFMLENBQWMsTUFBZCxDQUF4QixHQUNFOHhCLEtBQ0c1UCxHQURILENBQ08saUJBRFAsRUFDMEJnRyxRQUQxQixFQUVHbkcsb0JBRkgsQ0FFd0IyTixRQUFRek0sbUJBRmhDLENBREYsR0FJRWlGLFVBSkY7O0FBTUEsU0FBSzJILFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsV0FBTyxJQUFQO0FBQ0QsR0E5QkQ7O0FBZ0NBSCxVQUFRcjNCLFNBQVIsQ0FBa0I2NEIsUUFBbEIsR0FBNkIsWUFBWTtBQUN2QyxRQUFJMEMsS0FBSyxLQUFLM1AsUUFBZDtBQUNBLFFBQUkyUCxHQUFHcHpCLElBQUgsQ0FBUSxPQUFSLEtBQW9CLE9BQU9vekIsR0FBR3B6QixJQUFILENBQVEscUJBQVIsQ0FBUCxJQUF5QyxRQUFqRSxFQUEyRTtBQUN6RW96QixTQUFHcHpCLElBQUgsQ0FBUSxxQkFBUixFQUErQm96QixHQUFHcHpCLElBQUgsQ0FBUSxPQUFSLEtBQW9CLEVBQW5ELEVBQXVEQSxJQUF2RCxDQUE0RCxPQUE1RCxFQUFxRSxFQUFyRTtBQUNEO0FBQ0YsR0FMRDs7QUFPQWt2QixVQUFRcjNCLFNBQVIsQ0FBa0JzNUIsVUFBbEIsR0FBK0IsWUFBWTtBQUN6QyxXQUFPLEtBQUsrQixRQUFMLEVBQVA7QUFDRCxHQUZEOztBQUlBaEUsVUFBUXIzQixTQUFSLENBQWtCZzZCLFdBQWxCLEdBQWdDLFVBQVVwTyxRQUFWLEVBQW9CO0FBQ2xEQSxlQUFhQSxZQUFZLEtBQUtBLFFBQTlCOztBQUVBLFFBQUloa0IsS0FBU2drQixTQUFTLENBQVQsQ0FBYjtBQUNBLFFBQUk0UCxTQUFTNXpCLEdBQUc0bEIsT0FBSCxJQUFjLE1BQTNCOztBQUVBLFFBQUlpTyxTQUFZN3pCLEdBQUc3QyxxQkFBSCxFQUFoQjtBQUNBLFFBQUkwMkIsT0FBT3YzQixLQUFQLElBQWdCLElBQXBCLEVBQTBCO0FBQ3hCO0FBQ0F1M0IsZUFBU3pULEVBQUV6bUIsTUFBRixDQUFTLEVBQVQsRUFBYWs2QixNQUFiLEVBQXFCLEVBQUV2M0IsT0FBT3UzQixPQUFPemdCLEtBQVAsR0FBZXlnQixPQUFPejJCLElBQS9CLEVBQXFDeWQsUUFBUWdaLE9BQU9wQixNQUFQLEdBQWdCb0IsT0FBTzFCLEdBQXBFLEVBQXJCLENBQVQ7QUFDRDtBQUNELFFBQUkyQixRQUFRajdCLE9BQU9rN0IsVUFBUCxJQUFxQi96QixjQUFjbkgsT0FBT2s3QixVQUF0RDtBQUNBO0FBQ0E7QUFDQSxRQUFJQyxXQUFZSixTQUFTLEVBQUV6QixLQUFLLENBQVAsRUFBVS8wQixNQUFNLENBQWhCLEVBQVQsR0FBZ0MwMkIsUUFBUSxJQUFSLEdBQWU5UCxTQUFTOE8sTUFBVCxFQUEvRDtBQUNBLFFBQUltQixTQUFZLEVBQUVBLFFBQVFMLFNBQVMxNEIsU0FBU0ssZUFBVCxDQUF5QjB1QixTQUF6QixJQUFzQy91QixTQUFTQyxJQUFULENBQWM4dUIsU0FBN0QsR0FBeUVqRyxTQUFTaUcsU0FBVCxFQUFuRixFQUFoQjtBQUNBLFFBQUlpSyxZQUFZTixTQUFTLEVBQUV0M0IsT0FBTzhqQixFQUFFdm5CLE1BQUYsRUFBVXlELEtBQVYsRUFBVCxFQUE0QnVlLFFBQVF1RixFQUFFdm5CLE1BQUYsRUFBVWdpQixNQUFWLEVBQXBDLEVBQVQsR0FBb0UsSUFBcEY7O0FBRUEsV0FBT3VGLEVBQUV6bUIsTUFBRixDQUFTLEVBQVQsRUFBYWs2QixNQUFiLEVBQXFCSSxNQUFyQixFQUE2QkMsU0FBN0IsRUFBd0NGLFFBQXhDLENBQVA7QUFDRCxHQW5CRDs7QUFxQkF2RSxVQUFRcjNCLFNBQVIsQ0FBa0J1NkIsbUJBQWxCLEdBQXdDLFVBQVUzQyxTQUFWLEVBQXFCL2MsR0FBckIsRUFBMEJvZixXQUExQixFQUF1Q0MsWUFBdkMsRUFBcUQ7QUFDM0YsV0FBT3RDLGFBQWEsUUFBYixHQUF3QixFQUFFbUMsS0FBS2xmLElBQUlrZixHQUFKLEdBQVVsZixJQUFJNEgsTUFBckIsRUFBK0J6ZCxNQUFNNlYsSUFBSTdWLElBQUosR0FBVzZWLElBQUkzVyxLQUFKLEdBQVksQ0FBdkIsR0FBMkIrMUIsY0FBYyxDQUE5RSxFQUF4QixHQUNBckMsYUFBYSxLQUFiLEdBQXdCLEVBQUVtQyxLQUFLbGYsSUFBSWtmLEdBQUosR0FBVUcsWUFBakIsRUFBK0JsMUIsTUFBTTZWLElBQUk3VixJQUFKLEdBQVc2VixJQUFJM1csS0FBSixHQUFZLENBQXZCLEdBQTJCKzFCLGNBQWMsQ0FBOUUsRUFBeEIsR0FDQXJDLGFBQWEsTUFBYixHQUF3QixFQUFFbUMsS0FBS2xmLElBQUlrZixHQUFKLEdBQVVsZixJQUFJNEgsTUFBSixHQUFhLENBQXZCLEdBQTJCeVgsZUFBZSxDQUFqRCxFQUFvRGwxQixNQUFNNlYsSUFBSTdWLElBQUosR0FBV2kxQixXQUFyRSxFQUF4QjtBQUNILDhCQUEyQixFQUFFRixLQUFLbGYsSUFBSWtmLEdBQUosR0FBVWxmLElBQUk0SCxNQUFKLEdBQWEsQ0FBdkIsR0FBMkJ5WCxlQUFlLENBQWpELEVBQW9EbDFCLE1BQU02VixJQUFJN1YsSUFBSixHQUFXNlYsSUFBSTNXLEtBQXpFLEVBSC9CO0FBS0QsR0FORDs7QUFRQW16QixVQUFRcjNCLFNBQVIsQ0FBa0IrNkIsd0JBQWxCLEdBQTZDLFVBQVVuRCxTQUFWLEVBQXFCL2MsR0FBckIsRUFBMEJvZixXQUExQixFQUF1Q0MsWUFBdkMsRUFBcUQ7QUFDaEcsUUFBSWhNLFFBQVEsRUFBRTZMLEtBQUssQ0FBUCxFQUFVLzBCLE1BQU0sQ0FBaEIsRUFBWjtBQUNBLFFBQUksQ0FBQyxLQUFLa3pCLFNBQVYsRUFBcUIsT0FBT2hLLEtBQVA7O0FBRXJCLFFBQUk2TixrQkFBa0IsS0FBSzd1QixPQUFMLENBQWFzRyxRQUFiLElBQXlCLEtBQUt0RyxPQUFMLENBQWFzRyxRQUFiLENBQXNCK2YsT0FBL0MsSUFBMEQsQ0FBaEY7QUFDQSxRQUFJeUkscUJBQXFCLEtBQUtoQyxXQUFMLENBQWlCLEtBQUs5QixTQUF0QixDQUF6Qjs7QUFFQSxRQUFJLGFBQWFudEIsSUFBYixDQUFrQjZzQixTQUFsQixDQUFKLEVBQWtDO0FBQ2hDLFVBQUlxRSxnQkFBbUJwaEIsSUFBSWtmLEdBQUosR0FBVWdDLGVBQVYsR0FBNEJDLG1CQUFtQkgsTUFBdEU7QUFDQSxVQUFJSyxtQkFBbUJyaEIsSUFBSWtmLEdBQUosR0FBVWdDLGVBQVYsR0FBNEJDLG1CQUFtQkgsTUFBL0MsR0FBd0QzQixZQUEvRTtBQUNBLFVBQUkrQixnQkFBZ0JELG1CQUFtQmpDLEdBQXZDLEVBQTRDO0FBQUU7QUFDNUM3TCxjQUFNNkwsR0FBTixHQUFZaUMsbUJBQW1CakMsR0FBbkIsR0FBeUJrQyxhQUFyQztBQUNELE9BRkQsTUFFTyxJQUFJQyxtQkFBbUJGLG1CQUFtQmpDLEdBQW5CLEdBQXlCaUMsbUJBQW1CdlosTUFBbkUsRUFBMkU7QUFBRTtBQUNsRnlMLGNBQU02TCxHQUFOLEdBQVlpQyxtQkFBbUJqQyxHQUFuQixHQUF5QmlDLG1CQUFtQnZaLE1BQTVDLEdBQXFEeVosZ0JBQWpFO0FBQ0Q7QUFDRixLQVJELE1BUU87QUFDTCxVQUFJQyxpQkFBa0J0aEIsSUFBSTdWLElBQUosR0FBVysyQixlQUFqQztBQUNBLFVBQUlLLGtCQUFrQnZoQixJQUFJN1YsSUFBSixHQUFXKzJCLGVBQVgsR0FBNkI5QixXQUFuRDtBQUNBLFVBQUlrQyxpQkFBaUJILG1CQUFtQmgzQixJQUF4QyxFQUE4QztBQUFFO0FBQzlDa3BCLGNBQU1scEIsSUFBTixHQUFhZzNCLG1CQUFtQmgzQixJQUFuQixHQUEwQm0zQixjQUF2QztBQUNELE9BRkQsTUFFTyxJQUFJQyxrQkFBa0JKLG1CQUFtQmhoQixLQUF6QyxFQUFnRDtBQUFFO0FBQ3ZEa1QsY0FBTWxwQixJQUFOLEdBQWFnM0IsbUJBQW1CaDNCLElBQW5CLEdBQTBCZzNCLG1CQUFtQjkzQixLQUE3QyxHQUFxRGs0QixlQUFsRTtBQUNEO0FBQ0Y7O0FBRUQsV0FBT2xPLEtBQVA7QUFDRCxHQTFCRDs7QUE0QkFtSixVQUFRcjNCLFNBQVIsQ0FBa0JxN0IsUUFBbEIsR0FBNkIsWUFBWTtBQUN2QyxRQUFJdkQsS0FBSjtBQUNBLFFBQUl5RCxLQUFLLEtBQUszUCxRQUFkO0FBQ0EsUUFBSXlRLElBQUssS0FBS252QixPQUFkOztBQUVBNHFCLFlBQVF5RCxHQUFHcHpCLElBQUgsQ0FBUSxxQkFBUixNQUNGLE9BQU9rMEIsRUFBRXZFLEtBQVQsSUFBa0IsVUFBbEIsR0FBK0J1RSxFQUFFdkUsS0FBRixDQUFRNTNCLElBQVIsQ0FBYXE3QixHQUFHLENBQUgsQ0FBYixDQUEvQixHQUFzRGMsRUFBRXZFLEtBRHRELENBQVI7O0FBR0EsV0FBT0EsS0FBUDtBQUNELEdBVEQ7O0FBV0FULFVBQVFyM0IsU0FBUixDQUFrQjI1QixNQUFsQixHQUEyQixVQUFVM3ZCLE1BQVYsRUFBa0I7QUFDM0M7QUFBR0EsZ0JBQVUsQ0FBQyxFQUFFbkYsS0FBS3kzQixNQUFMLEtBQWdCLE9BQWxCLENBQVg7QUFBSCxhQUNPeDVCLFNBQVN5NUIsY0FBVCxDQUF3QnZ5QixNQUF4QixDQURQO0FBRUEsV0FBT0EsTUFBUDtBQUNELEdBSkQ7O0FBTUFxdEIsVUFBUXIzQixTQUFSLENBQWtCbzVCLEdBQWxCLEdBQXdCLFlBQVk7QUFDbEMsUUFBSSxDQUFDLEtBQUtLLElBQVYsRUFBZ0I7QUFDZCxXQUFLQSxJQUFMLEdBQVl6UixFQUFFLEtBQUs5YSxPQUFMLENBQWEycUIsUUFBZixDQUFaO0FBQ0EsVUFBSSxLQUFLNEIsSUFBTCxDQUFVNTNCLE1BQVYsSUFBb0IsQ0FBeEIsRUFBMkI7QUFDekIsY0FBTSxJQUFJb25CLEtBQUosQ0FBVSxLQUFLNWpCLElBQUwsR0FBWSxpRUFBdEIsQ0FBTjtBQUNEO0FBQ0Y7QUFDRCxXQUFPLEtBQUtvMEIsSUFBWjtBQUNELEdBUkQ7O0FBVUFwQyxVQUFRcjNCLFNBQVIsQ0FBa0JvN0IsS0FBbEIsR0FBMEIsWUFBWTtBQUNwQyxXQUFRLEtBQUtvQixNQUFMLEdBQWMsS0FBS0EsTUFBTCxJQUFlLEtBQUtwRCxHQUFMLEdBQVdyTyxJQUFYLENBQWdCLGdCQUFoQixDQUFyQztBQUNELEdBRkQ7O0FBSUFzTSxVQUFRcjNCLFNBQVIsQ0FBa0J5OEIsTUFBbEIsR0FBMkIsWUFBWTtBQUNyQyxTQUFLbkYsT0FBTCxHQUFlLElBQWY7QUFDRCxHQUZEOztBQUlBRCxVQUFRcjNCLFNBQVIsQ0FBa0JzVixPQUFsQixHQUE0QixZQUFZO0FBQ3RDLFNBQUtnaUIsT0FBTCxHQUFlLEtBQWY7QUFDRCxHQUZEOztBQUlBRCxVQUFRcjNCLFNBQVIsQ0FBa0IwOEIsYUFBbEIsR0FBa0MsWUFBWTtBQUM1QyxTQUFLcEYsT0FBTCxHQUFlLENBQUMsS0FBS0EsT0FBckI7QUFDRCxHQUZEOztBQUlBRCxVQUFRcjNCLFNBQVIsQ0FBa0Jzc0IsTUFBbEIsR0FBMkIsVUFBVTdwQixDQUFWLEVBQWE7QUFDdEMsUUFBSTAyQixPQUFPLElBQVg7QUFDQSxRQUFJMTJCLENBQUosRUFBTztBQUNMMDJCLGFBQU9uUixFQUFFdmxCLEVBQUUrdkIsYUFBSixFQUFtQnBtQixJQUFuQixDQUF3QixRQUFRLEtBQUsvRyxJQUFyQyxDQUFQO0FBQ0EsVUFBSSxDQUFDOHpCLElBQUwsRUFBVztBQUNUQSxlQUFPLElBQUksS0FBS2IsV0FBVCxDQUFxQjcxQixFQUFFK3ZCLGFBQXZCLEVBQXNDLEtBQUt5RyxrQkFBTCxFQUF0QyxDQUFQO0FBQ0FqUixVQUFFdmxCLEVBQUUrdkIsYUFBSixFQUFtQnBtQixJQUFuQixDQUF3QixRQUFRLEtBQUsvRyxJQUFyQyxFQUEyQzh6QixJQUEzQztBQUNEO0FBQ0Y7O0FBRUQsUUFBSTEyQixDQUFKLEVBQU87QUFDTDAyQixXQUFLMUIsT0FBTCxDQUFhVyxLQUFiLEdBQXFCLENBQUNlLEtBQUsxQixPQUFMLENBQWFXLEtBQW5DO0FBQ0EsVUFBSWUsS0FBS0UsYUFBTCxFQUFKLEVBQTBCRixLQUFLVCxLQUFMLENBQVdTLElBQVgsRUFBMUIsS0FDS0EsS0FBS1IsS0FBTCxDQUFXUSxJQUFYO0FBQ04sS0FKRCxNQUlPO0FBQ0xBLFdBQUtDLEdBQUwsR0FBV3p4QixRQUFYLENBQW9CLElBQXBCLElBQTRCd3hCLEtBQUtSLEtBQUwsQ0FBV1EsSUFBWCxDQUE1QixHQUErQ0EsS0FBS1QsS0FBTCxDQUFXUyxJQUFYLENBQS9DO0FBQ0Q7QUFDRixHQWpCRDs7QUFtQkE5QixVQUFRcjNCLFNBQVIsQ0FBa0JxZ0IsT0FBbEIsR0FBNEIsWUFBWTtBQUN0QyxRQUFJZ08sT0FBTyxJQUFYO0FBQ0Evc0IsaUJBQWEsS0FBS2kyQixPQUFsQjtBQUNBLFNBQUt2SCxJQUFMLENBQVUsWUFBWTtBQUNwQjNCLFdBQUt6QyxRQUFMLENBQWMzZixHQUFkLENBQWtCLE1BQU1vaUIsS0FBS2hwQixJQUE3QixFQUFtQ211QixVQUFuQyxDQUE4QyxRQUFRbkYsS0FBS2hwQixJQUEzRDtBQUNBLFVBQUlncEIsS0FBS29MLElBQVQsRUFBZTtBQUNicEwsYUFBS29MLElBQUwsQ0FBVXJPLE1BQVY7QUFDRDtBQUNEaUQsV0FBS29MLElBQUwsR0FBWSxJQUFaO0FBQ0FwTCxXQUFLbU8sTUFBTCxHQUFjLElBQWQ7QUFDQW5PLFdBQUs2SixTQUFMLEdBQWlCLElBQWpCO0FBQ0E3SixXQUFLekMsUUFBTCxHQUFnQixJQUFoQjtBQUNELEtBVEQ7QUFVRCxHQWJEOztBQWVBeUwsVUFBUXIzQixTQUFSLENBQWtCcTJCLFlBQWxCLEdBQWlDLFVBQVVDLFVBQVYsRUFBc0I7QUFDckQsV0FBT0QsYUFBYUMsVUFBYixFQUF5QixLQUFLcHBCLE9BQUwsQ0FBYXFwQixTQUF0QyxFQUFpRCxLQUFLcnBCLE9BQUwsQ0FBYXNwQixVQUE5RCxDQUFQO0FBQ0QsR0FGRDs7QUFJQTtBQUNBOztBQUVBLFdBQVNuTCxNQUFULENBQWdCNWYsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLNmYsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSVQsUUFBVTdDLEVBQUUsSUFBRixDQUFkO0FBQ0EsVUFBSTViLE9BQVV5ZSxNQUFNemUsSUFBTixDQUFXLFlBQVgsQ0FBZDtBQUNBLFVBQUljLFVBQVUsUUFBT3pCLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNDOztBQUVBLFVBQUksQ0FBQ1csSUFBRCxJQUFTLGVBQWVyQixJQUFmLENBQW9CVSxNQUFwQixDQUFiLEVBQTBDO0FBQzFDLFVBQUksQ0FBQ1csSUFBTCxFQUFXeWUsTUFBTXplLElBQU4sQ0FBVyxZQUFYLEVBQTBCQSxPQUFPLElBQUlpckIsT0FBSixDQUFZLElBQVosRUFBa0JucUIsT0FBbEIsQ0FBakM7QUFDWCxVQUFJLE9BQU96QixNQUFQLElBQWlCLFFBQXJCLEVBQStCVyxLQUFLWCxNQUFMO0FBQ2hDLEtBUk0sQ0FBUDtBQVNEOztBQUVELE1BQUk4ZixNQUFNdkQsRUFBRWhjLEVBQUYsQ0FBSzJ3QixPQUFmOztBQUVBM1UsSUFBRWhjLEVBQUYsQ0FBSzJ3QixPQUFMLEdBQTJCdFIsTUFBM0I7QUFDQXJELElBQUVoYyxFQUFGLENBQUsyd0IsT0FBTCxDQUFhbFIsV0FBYixHQUEyQjRMLE9BQTNCOztBQUdBO0FBQ0E7O0FBRUFyUCxJQUFFaGMsRUFBRixDQUFLMndCLE9BQUwsQ0FBYWpSLFVBQWIsR0FBMEIsWUFBWTtBQUNwQzFELE1BQUVoYyxFQUFGLENBQUsyd0IsT0FBTCxHQUFlcFIsR0FBZjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSEQ7QUFLRCxDQTNwQkEsQ0EycEJDdkMsTUEzcEJELENBQUQ7O0FBNnBCQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVoQixDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLE1BQUk0VSxVQUFVLFNBQVZBLE9BQVUsQ0FBVXR3QixPQUFWLEVBQW1CWSxPQUFuQixFQUE0QjtBQUN4QyxTQUFLd3FCLElBQUwsQ0FBVSxTQUFWLEVBQXFCcHJCLE9BQXJCLEVBQThCWSxPQUE5QjtBQUNELEdBRkQ7O0FBSUEsTUFBSSxDQUFDOGEsRUFBRWhjLEVBQUYsQ0FBSzJ3QixPQUFWLEVBQW1CLE1BQU0sSUFBSTFULEtBQUosQ0FBVSw2QkFBVixDQUFOOztBQUVuQjJULFVBQVFqUyxPQUFSLEdBQW1CLE9BQW5COztBQUVBaVMsVUFBUS9RLFFBQVIsR0FBbUI3RCxFQUFFem1CLE1BQUYsQ0FBUyxFQUFULEVBQWF5bUIsRUFBRWhjLEVBQUYsQ0FBSzJ3QixPQUFMLENBQWFsUixXQUFiLENBQXlCSSxRQUF0QyxFQUFnRDtBQUNqRStMLGVBQVcsT0FEc0Q7QUFFakU5TixhQUFTLE9BRndEO0FBR2pFK1MsYUFBUyxFQUh3RDtBQUlqRWhGLGNBQVU7QUFKdUQsR0FBaEQsQ0FBbkI7O0FBUUE7QUFDQTs7QUFFQStFLFVBQVE1OEIsU0FBUixHQUFvQmdvQixFQUFFem1CLE1BQUYsQ0FBUyxFQUFULEVBQWF5bUIsRUFBRWhjLEVBQUYsQ0FBSzJ3QixPQUFMLENBQWFsUixXQUFiLENBQXlCenJCLFNBQXRDLENBQXBCOztBQUVBNDhCLFVBQVE1OEIsU0FBUixDQUFrQnM0QixXQUFsQixHQUFnQ3NFLE9BQWhDOztBQUVBQSxVQUFRNThCLFNBQVIsQ0FBa0I4NEIsV0FBbEIsR0FBZ0MsWUFBWTtBQUMxQyxXQUFPOEQsUUFBUS9RLFFBQWY7QUFDRCxHQUZEOztBQUlBK1EsVUFBUTU4QixTQUFSLENBQWtCNDVCLFVBQWxCLEdBQStCLFlBQVk7QUFDekMsUUFBSUgsT0FBVSxLQUFLTCxHQUFMLEVBQWQ7QUFDQSxRQUFJdEIsUUFBVSxLQUFLdUQsUUFBTCxFQUFkO0FBQ0EsUUFBSXdCLFVBQVUsS0FBS0MsVUFBTCxFQUFkOztBQUVBLFFBQUksS0FBSzV2QixPQUFMLENBQWF3VixJQUFqQixFQUF1QjtBQUNyQixVQUFJcWEscUJBQXFCRixPQUFyQix5Q0FBcUJBLE9BQXJCLENBQUo7O0FBRUEsVUFBSSxLQUFLM3ZCLE9BQUwsQ0FBYThxQixRQUFqQixFQUEyQjtBQUN6QkYsZ0JBQVEsS0FBS3pCLFlBQUwsQ0FBa0J5QixLQUFsQixDQUFSOztBQUVBLFlBQUlpRixnQkFBZ0IsUUFBcEIsRUFBOEI7QUFDNUJGLG9CQUFVLEtBQUt4RyxZQUFMLENBQWtCd0csT0FBbEIsQ0FBVjtBQUNEO0FBQ0Y7O0FBRURwRCxXQUFLMU8sSUFBTCxDQUFVLGdCQUFWLEVBQTRCckksSUFBNUIsQ0FBaUNvVixLQUFqQztBQUNBMkIsV0FBSzFPLElBQUwsQ0FBVSxrQkFBVixFQUE4QjlsQixRQUE5QixHQUF5Q21tQixNQUF6QyxHQUFrRDlILEdBQWxELEdBQ0V5WixnQkFBZ0IsUUFBaEIsR0FBMkIsTUFBM0IsR0FBb0MsUUFEdEMsRUFFRUYsT0FGRjtBQUdELEtBZkQsTUFlTztBQUNMcEQsV0FBSzFPLElBQUwsQ0FBVSxnQkFBVixFQUE0QnVRLElBQTVCLENBQWlDeEQsS0FBakM7QUFDQTJCLFdBQUsxTyxJQUFMLENBQVUsa0JBQVYsRUFBOEI5bEIsUUFBOUIsR0FBeUNtbUIsTUFBekMsR0FBa0Q5SCxHQUFsRCxHQUF3RGdZLElBQXhELENBQTZEdUIsT0FBN0Q7QUFDRDs7QUFFRHBELFNBQUt4eEIsV0FBTCxDQUFpQiwrQkFBakI7O0FBRUE7QUFDQTtBQUNBLFFBQUksQ0FBQ3d4QixLQUFLMU8sSUFBTCxDQUFVLGdCQUFWLEVBQTRCckksSUFBNUIsRUFBTCxFQUF5QytXLEtBQUsxTyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJpRixJQUE1QjtBQUMxQyxHQTlCRDs7QUFnQ0E0TSxVQUFRNThCLFNBQVIsQ0FBa0JzNUIsVUFBbEIsR0FBK0IsWUFBWTtBQUN6QyxXQUFPLEtBQUsrQixRQUFMLE1BQW1CLEtBQUt5QixVQUFMLEVBQTFCO0FBQ0QsR0FGRDs7QUFJQUYsVUFBUTU4QixTQUFSLENBQWtCODhCLFVBQWxCLEdBQStCLFlBQVk7QUFDekMsUUFBSXZCLEtBQUssS0FBSzNQLFFBQWQ7QUFDQSxRQUFJeVEsSUFBSyxLQUFLbnZCLE9BQWQ7O0FBRUEsV0FBT3F1QixHQUFHcHpCLElBQUgsQ0FBUSxjQUFSLE1BQ0QsT0FBT2swQixFQUFFUSxPQUFULElBQW9CLFVBQXBCLEdBQ0ZSLEVBQUVRLE9BQUYsQ0FBVTM4QixJQUFWLENBQWVxN0IsR0FBRyxDQUFILENBQWYsQ0FERSxHQUVGYyxFQUFFUSxPQUhDLENBQVA7QUFJRCxHQVJEOztBQVVBRCxVQUFRNThCLFNBQVIsQ0FBa0JvN0IsS0FBbEIsR0FBMEIsWUFBWTtBQUNwQyxXQUFRLEtBQUtvQixNQUFMLEdBQWMsS0FBS0EsTUFBTCxJQUFlLEtBQUtwRCxHQUFMLEdBQVdyTyxJQUFYLENBQWdCLFFBQWhCLENBQXJDO0FBQ0QsR0FGRDs7QUFLQTtBQUNBOztBQUVBLFdBQVNNLE1BQVQsQ0FBZ0I1ZixNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUs2ZixJQUFMLENBQVUsWUFBWTtBQUMzQixVQUFJVCxRQUFVN0MsRUFBRSxJQUFGLENBQWQ7QUFDQSxVQUFJNWIsT0FBVXllLE1BQU16ZSxJQUFOLENBQVcsWUFBWCxDQUFkO0FBQ0EsVUFBSWMsVUFBVSxRQUFPekIsTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFqQixJQUE2QkEsTUFBM0M7O0FBRUEsVUFBSSxDQUFDVyxJQUFELElBQVMsZUFBZXJCLElBQWYsQ0FBb0JVLE1BQXBCLENBQWIsRUFBMEM7QUFDMUMsVUFBSSxDQUFDVyxJQUFMLEVBQVd5ZSxNQUFNemUsSUFBTixDQUFXLFlBQVgsRUFBMEJBLE9BQU8sSUFBSXd3QixPQUFKLENBQVksSUFBWixFQUFrQjF2QixPQUFsQixDQUFqQztBQUNYLFVBQUksT0FBT3pCLE1BQVAsSUFBaUIsUUFBckIsRUFBK0JXLEtBQUtYLE1BQUw7QUFDaEMsS0FSTSxDQUFQO0FBU0Q7O0FBRUQsTUFBSThmLE1BQU12RCxFQUFFaGMsRUFBRixDQUFLZ3hCLE9BQWY7O0FBRUFoVixJQUFFaGMsRUFBRixDQUFLZ3hCLE9BQUwsR0FBMkIzUixNQUEzQjtBQUNBckQsSUFBRWhjLEVBQUYsQ0FBS2d4QixPQUFMLENBQWF2UixXQUFiLEdBQTJCbVIsT0FBM0I7O0FBR0E7QUFDQTs7QUFFQTVVLElBQUVoYyxFQUFGLENBQUtneEIsT0FBTCxDQUFhdFIsVUFBYixHQUEwQixZQUFZO0FBQ3BDMUQsTUFBRWhjLEVBQUYsQ0FBS2d4QixPQUFMLEdBQWV6UixHQUFmO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDtBQUtELENBakhBLENBaUhDdkMsTUFqSEQsQ0FBRDs7QUFtSEE7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVaEIsQ0FBVixFQUFhO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxXQUFTaVYsU0FBVCxDQUFtQjN3QixPQUFuQixFQUE0QlksT0FBNUIsRUFBcUM7QUFDbkMsU0FBSzBqQixLQUFMLEdBQXNCNUksRUFBRWxsQixTQUFTQyxJQUFYLENBQXRCO0FBQ0EsU0FBS202QixjQUFMLEdBQXNCbFYsRUFBRTFiLE9BQUYsRUFBVytkLEVBQVgsQ0FBY3ZuQixTQUFTQyxJQUF2QixJQUErQmlsQixFQUFFdm5CLE1BQUYsQ0FBL0IsR0FBMkN1bkIsRUFBRTFiLE9BQUYsQ0FBakU7QUFDQSxTQUFLWSxPQUFMLEdBQXNCOGEsRUFBRXptQixNQUFGLENBQVMsRUFBVCxFQUFhMDdCLFVBQVVwUixRQUF2QixFQUFpQzNlLE9BQWpDLENBQXRCO0FBQ0EsU0FBS2pILFFBQUwsR0FBc0IsQ0FBQyxLQUFLaUgsT0FBTCxDQUFheEwsTUFBYixJQUF1QixFQUF4QixJQUE4QixjQUFwRDtBQUNBLFNBQUt5N0IsT0FBTCxHQUFzQixFQUF0QjtBQUNBLFNBQUtDLE9BQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLQyxZQUFMLEdBQXNCLElBQXRCO0FBQ0EsU0FBSzFLLFlBQUwsR0FBc0IsQ0FBdEI7O0FBRUEsU0FBS3VLLGNBQUwsQ0FBb0JweEIsRUFBcEIsQ0FBdUIscUJBQXZCLEVBQThDa2MsRUFBRW9FLEtBQUYsQ0FBUSxLQUFLa1IsT0FBYixFQUFzQixJQUF0QixDQUE5QztBQUNBLFNBQUt4VSxPQUFMO0FBQ0EsU0FBS3dVLE9BQUw7QUFDRDs7QUFFREwsWUFBVXRTLE9BQVYsR0FBcUIsT0FBckI7O0FBRUFzUyxZQUFVcFIsUUFBVixHQUFxQjtBQUNuQjZPLFlBQVE7QUFEVyxHQUFyQjs7QUFJQXVDLFlBQVVqOUIsU0FBVixDQUFvQnU5QixlQUFwQixHQUFzQyxZQUFZO0FBQ2hELFdBQU8sS0FBS0wsY0FBTCxDQUFvQixDQUFwQixFQUF1QnZLLFlBQXZCLElBQXVDOXRCLEtBQUs2UCxHQUFMLENBQVMsS0FBS2tjLEtBQUwsQ0FBVyxDQUFYLEVBQWMrQixZQUF2QixFQUFxQzd2QixTQUFTSyxlQUFULENBQXlCd3ZCLFlBQTlELENBQTlDO0FBQ0QsR0FGRDs7QUFJQXNLLFlBQVVqOUIsU0FBVixDQUFvQjhvQixPQUFwQixHQUE4QixZQUFZO0FBQ3hDLFFBQUl1RixPQUFnQixJQUFwQjtBQUNBLFFBQUltUCxlQUFnQixRQUFwQjtBQUNBLFFBQUlDLGFBQWdCLENBQXBCOztBQUVBLFNBQUtOLE9BQUwsR0FBb0IsRUFBcEI7QUFDQSxTQUFLQyxPQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS3pLLFlBQUwsR0FBb0IsS0FBSzRLLGVBQUwsRUFBcEI7O0FBRUEsUUFBSSxDQUFDdlYsRUFBRTBWLFFBQUYsQ0FBVyxLQUFLUixjQUFMLENBQW9CLENBQXBCLENBQVgsQ0FBTCxFQUF5QztBQUN2Q00scUJBQWUsVUFBZjtBQUNBQyxtQkFBZSxLQUFLUCxjQUFMLENBQW9CckwsU0FBcEIsRUFBZjtBQUNEOztBQUVELFNBQUtqQixLQUFMLENBQ0c3RixJQURILENBQ1EsS0FBSzlrQixRQURiLEVBRUc0d0IsR0FGSCxDQUVPLFlBQVk7QUFDZixVQUFJak4sTUFBUTVCLEVBQUUsSUFBRixDQUFaO0FBQ0EsVUFBSThHLE9BQVFsRixJQUFJeGQsSUFBSixDQUFTLFFBQVQsS0FBc0J3ZCxJQUFJemhCLElBQUosQ0FBUyxNQUFULENBQWxDO0FBQ0EsVUFBSXcxQixRQUFRLE1BQU01eUIsSUFBTixDQUFXK2pCLElBQVgsS0FBb0I5RyxFQUFFOEcsSUFBRixDQUFoQzs7QUFFQSxhQUFRNk8sU0FDSEEsTUFBTTk3QixNQURILElBRUg4N0IsTUFBTXRULEVBQU4sQ0FBUyxVQUFULENBRkcsSUFHSCxDQUFDLENBQUNzVCxNQUFNSCxZQUFOLElBQXNCekQsR0FBdEIsR0FBNEIwRCxVQUE3QixFQUF5QzNPLElBQXpDLENBQUQsQ0FIRSxJQUdtRCxJQUgxRDtBQUlELEtBWEgsRUFZRzhPLElBWkgsQ0FZUSxVQUFVamtCLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtBQUFFLGFBQU9ELEVBQUUsQ0FBRixJQUFPQyxFQUFFLENBQUYsQ0FBZDtBQUFvQixLQVo5QyxFQWFHMFIsSUFiSCxDQWFRLFlBQVk7QUFDaEIrQyxXQUFLOE8sT0FBTCxDQUFhaDlCLElBQWIsQ0FBa0IsS0FBSyxDQUFMLENBQWxCO0FBQ0FrdUIsV0FBSytPLE9BQUwsQ0FBYWo5QixJQUFiLENBQWtCLEtBQUssQ0FBTCxDQUFsQjtBQUNELEtBaEJIO0FBaUJELEdBL0JEOztBQWlDQTg4QixZQUFVajlCLFNBQVYsQ0FBb0JzOUIsT0FBcEIsR0FBOEIsWUFBWTtBQUN4QyxRQUFJekwsWUFBZSxLQUFLcUwsY0FBTCxDQUFvQnJMLFNBQXBCLEtBQWtDLEtBQUsza0IsT0FBTCxDQUFhd3RCLE1BQWxFO0FBQ0EsUUFBSS9ILGVBQWUsS0FBSzRLLGVBQUwsRUFBbkI7QUFDQSxRQUFJTSxZQUFlLEtBQUszd0IsT0FBTCxDQUFhd3RCLE1BQWIsR0FBc0IvSCxZQUF0QixHQUFxQyxLQUFLdUssY0FBTCxDQUFvQnphLE1BQXBCLEVBQXhEO0FBQ0EsUUFBSTBhLFVBQWUsS0FBS0EsT0FBeEI7QUFDQSxRQUFJQyxVQUFlLEtBQUtBLE9BQXhCO0FBQ0EsUUFBSUMsZUFBZSxLQUFLQSxZQUF4QjtBQUNBLFFBQUl6N0IsQ0FBSjs7QUFFQSxRQUFJLEtBQUsrd0IsWUFBTCxJQUFxQkEsWUFBekIsRUFBdUM7QUFDckMsV0FBSzdKLE9BQUw7QUFDRDs7QUFFRCxRQUFJK0ksYUFBYWdNLFNBQWpCLEVBQTRCO0FBQzFCLGFBQU9SLGlCQUFpQno3QixJQUFJdzdCLFFBQVFBLFFBQVF2N0IsTUFBUixHQUFpQixDQUF6QixDQUFyQixLQUFxRCxLQUFLaThCLFFBQUwsQ0FBY2w4QixDQUFkLENBQTVEO0FBQ0Q7O0FBRUQsUUFBSXk3QixnQkFBZ0J4TCxZQUFZc0wsUUFBUSxDQUFSLENBQWhDLEVBQTRDO0FBQzFDLFdBQUtFLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFPLEtBQUtVLEtBQUwsRUFBUDtBQUNEOztBQUVELFNBQUtuOEIsSUFBSXU3QixRQUFRdDdCLE1BQWpCLEVBQXlCRCxHQUF6QixHQUErQjtBQUM3Qnk3QixzQkFBZ0JELFFBQVF4N0IsQ0FBUixDQUFoQixJQUNLaXdCLGFBQWFzTCxRQUFRdjdCLENBQVIsQ0FEbEIsS0FFTXU3QixRQUFRdjdCLElBQUksQ0FBWixNQUFtQkUsU0FBbkIsSUFBZ0MrdkIsWUFBWXNMLFFBQVF2N0IsSUFBSSxDQUFaLENBRmxELEtBR0ssS0FBS2s4QixRQUFMLENBQWNWLFFBQVF4N0IsQ0FBUixDQUFkLENBSEw7QUFJRDtBQUNGLEdBNUJEOztBQThCQXE3QixZQUFVajlCLFNBQVYsQ0FBb0I4OUIsUUFBcEIsR0FBK0IsVUFBVXA4QixNQUFWLEVBQWtCO0FBQy9DLFNBQUsyN0IsWUFBTCxHQUFvQjM3QixNQUFwQjs7QUFFQSxTQUFLcThCLEtBQUw7O0FBRUEsUUFBSTkzQixXQUFXLEtBQUtBLFFBQUwsR0FDYixnQkFEYSxHQUNNdkUsTUFETixHQUNlLEtBRGYsR0FFYixLQUFLdUUsUUFGUSxHQUVHLFNBRkgsR0FFZXZFLE1BRmYsR0FFd0IsSUFGdkM7O0FBSUEsUUFBSXFzQixTQUFTL0YsRUFBRS9oQixRQUFGLEVBQ1YrM0IsT0FEVSxDQUNGLElBREUsRUFFVmoyQixRQUZVLENBRUQsUUFGQyxDQUFiOztBQUlBLFFBQUlnbUIsT0FBT0YsTUFBUCxDQUFjLGdCQUFkLEVBQWdDaHNCLE1BQXBDLEVBQTRDO0FBQzFDa3NCLGVBQVNBLE9BQ04vQyxPQURNLENBQ0UsYUFERixFQUVOampCLFFBRk0sQ0FFRyxRQUZILENBQVQ7QUFHRDs7QUFFRGdtQixXQUFPakUsT0FBUCxDQUFlLHVCQUFmO0FBQ0QsR0FwQkQ7O0FBc0JBbVQsWUFBVWo5QixTQUFWLENBQW9CKzlCLEtBQXBCLEdBQTRCLFlBQVk7QUFDdEMvVixNQUFFLEtBQUsvaEIsUUFBUCxFQUNHZzRCLFlBREgsQ0FDZ0IsS0FBSy93QixPQUFMLENBQWF4TCxNQUQ3QixFQUNxQyxTQURyQyxFQUVHdUcsV0FGSCxDQUVlLFFBRmY7QUFHRCxHQUpEOztBQU9BO0FBQ0E7O0FBRUEsV0FBU29qQixNQUFULENBQWdCNWYsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLNmYsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSVQsUUFBVTdDLEVBQUUsSUFBRixDQUFkO0FBQ0EsVUFBSTViLE9BQVV5ZSxNQUFNemUsSUFBTixDQUFXLGNBQVgsQ0FBZDtBQUNBLFVBQUljLFVBQVUsUUFBT3pCLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE1BQTNDOztBQUVBLFVBQUksQ0FBQ1csSUFBTCxFQUFXeWUsTUFBTXplLElBQU4sQ0FBVyxjQUFYLEVBQTRCQSxPQUFPLElBQUk2d0IsU0FBSixDQUFjLElBQWQsRUFBb0IvdkIsT0FBcEIsQ0FBbkM7QUFDWCxVQUFJLE9BQU96QixNQUFQLElBQWlCLFFBQXJCLEVBQStCVyxLQUFLWCxNQUFMO0FBQ2hDLEtBUE0sQ0FBUDtBQVFEOztBQUVELE1BQUk4ZixNQUFNdkQsRUFBRWhjLEVBQUYsQ0FBS2t5QixTQUFmOztBQUVBbFcsSUFBRWhjLEVBQUYsQ0FBS2t5QixTQUFMLEdBQTZCN1MsTUFBN0I7QUFDQXJELElBQUVoYyxFQUFGLENBQUtreUIsU0FBTCxDQUFlelMsV0FBZixHQUE2QndSLFNBQTdCOztBQUdBO0FBQ0E7O0FBRUFqVixJQUFFaGMsRUFBRixDQUFLa3lCLFNBQUwsQ0FBZXhTLFVBQWYsR0FBNEIsWUFBWTtBQUN0QzFELE1BQUVoYyxFQUFGLENBQUtreUIsU0FBTCxHQUFpQjNTLEdBQWpCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDs7QUFNQTtBQUNBOztBQUVBdkQsSUFBRXZuQixNQUFGLEVBQVVxTCxFQUFWLENBQWEsNEJBQWIsRUFBMkMsWUFBWTtBQUNyRGtjLE1BQUUscUJBQUYsRUFBeUJzRCxJQUF6QixDQUE4QixZQUFZO0FBQ3hDLFVBQUk2UyxPQUFPblcsRUFBRSxJQUFGLENBQVg7QUFDQXFELGFBQU9uckIsSUFBUCxDQUFZaStCLElBQVosRUFBa0JBLEtBQUsveEIsSUFBTCxFQUFsQjtBQUNELEtBSEQ7QUFJRCxHQUxEO0FBT0QsQ0FsS0EsQ0FrS0M0YyxNQWxLRCxDQUFEOztBQW9LQTs7Ozs7Ozs7QUFTQSxDQUFDLFVBQVVoQixDQUFWLEVBQWE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLE1BQUlvVyxNQUFNLFNBQU5BLEdBQU0sQ0FBVTl4QixPQUFWLEVBQW1CO0FBQzNCO0FBQ0EsU0FBS0EsT0FBTCxHQUFlMGIsRUFBRTFiLE9BQUYsQ0FBZjtBQUNBO0FBQ0QsR0FKRDs7QUFNQTh4QixNQUFJelQsT0FBSixHQUFjLE9BQWQ7O0FBRUF5VCxNQUFJeFQsbUJBQUosR0FBMEIsR0FBMUI7O0FBRUF3VCxNQUFJcCtCLFNBQUosQ0FBY3l2QixJQUFkLEdBQXFCLFlBQVk7QUFDL0IsUUFBSTVFLFFBQVcsS0FBS3ZlLE9BQXBCO0FBQ0EsUUFBSSt4QixNQUFXeFQsTUFBTUcsT0FBTixDQUFjLHdCQUFkLENBQWY7QUFDQSxRQUFJL2tCLFdBQVc0a0IsTUFBTXplLElBQU4sQ0FBVyxRQUFYLENBQWY7O0FBRUEsUUFBSSxDQUFDbkcsUUFBTCxFQUFlO0FBQ2JBLGlCQUFXNGtCLE1BQU0xaUIsSUFBTixDQUFXLE1BQVgsQ0FBWDtBQUNBbEMsaUJBQVdBLFlBQVlBLFNBQVM3QixPQUFULENBQWlCLGdCQUFqQixFQUFtQyxFQUFuQyxDQUF2QixDQUZhLENBRWlEO0FBQy9EOztBQUVELFFBQUl5bUIsTUFBTWdELE1BQU4sQ0FBYSxJQUFiLEVBQW1CbG1CLFFBQW5CLENBQTRCLFFBQTVCLENBQUosRUFBMkM7O0FBRTNDLFFBQUkyMkIsWUFBWUQsSUFBSXRULElBQUosQ0FBUyxnQkFBVCxDQUFoQjtBQUNBLFFBQUl3VCxZQUFZdlcsRUFBRWlELEtBQUYsQ0FBUSxhQUFSLEVBQXVCO0FBQ3JDdUQscUJBQWUzRCxNQUFNLENBQU47QUFEc0IsS0FBdkIsQ0FBaEI7QUFHQSxRQUFJK0ksWUFBWTVMLEVBQUVpRCxLQUFGLENBQVEsYUFBUixFQUF1QjtBQUNyQ3VELHFCQUFlOFAsVUFBVSxDQUFWO0FBRHNCLEtBQXZCLENBQWhCOztBQUlBQSxjQUFVeFUsT0FBVixDQUFrQnlVLFNBQWxCO0FBQ0ExVCxVQUFNZixPQUFOLENBQWM4SixTQUFkOztBQUVBLFFBQUlBLFVBQVUxSSxrQkFBVixNQUFrQ3FULFVBQVVyVCxrQkFBVixFQUF0QyxFQUFzRTs7QUFFdEUsUUFBSTZELFVBQVUvRyxFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCOWtCLFFBQWpCLENBQWQ7O0FBRUEsU0FBSzYzQixRQUFMLENBQWNqVCxNQUFNRyxPQUFOLENBQWMsSUFBZCxDQUFkLEVBQW1DcVQsR0FBbkM7QUFDQSxTQUFLUCxRQUFMLENBQWMvTyxPQUFkLEVBQXVCQSxRQUFRbEIsTUFBUixFQUF2QixFQUF5QyxZQUFZO0FBQ25EeVEsZ0JBQVV4VSxPQUFWLENBQWtCO0FBQ2hCemtCLGNBQU0sZUFEVTtBQUVoQm1wQix1QkFBZTNELE1BQU0sQ0FBTjtBQUZDLE9BQWxCO0FBSUFBLFlBQU1mLE9BQU4sQ0FBYztBQUNaemtCLGNBQU0sY0FETTtBQUVabXBCLHVCQUFlOFAsVUFBVSxDQUFWO0FBRkgsT0FBZDtBQUlELEtBVEQ7QUFVRCxHQXRDRDs7QUF3Q0FGLE1BQUlwK0IsU0FBSixDQUFjODlCLFFBQWQsR0FBeUIsVUFBVXh4QixPQUFWLEVBQW1CYSxTQUFuQixFQUE4QjVGLFFBQTlCLEVBQXdDO0FBQy9ELFFBQUkybEIsVUFBYS9mLFVBQVU0ZCxJQUFWLENBQWUsV0FBZixDQUFqQjtBQUNBLFFBQUl0QixhQUFhbGlCLFlBQ1p5Z0IsRUFBRStCLE9BQUYsQ0FBVU4sVUFERSxLQUVYeUQsUUFBUXJyQixNQUFSLElBQWtCcXJCLFFBQVF2bEIsUUFBUixDQUFpQixNQUFqQixDQUFsQixJQUE4QyxDQUFDLENBQUN3RixVQUFVNGQsSUFBVixDQUFlLFNBQWYsRUFBMEJscEIsTUFGL0QsQ0FBakI7O0FBSUEsYUFBUzhyQixJQUFULEdBQWdCO0FBQ2RULGNBQ0dqbEIsV0FESCxDQUNlLFFBRGYsRUFFRzhpQixJQUZILENBRVEsNEJBRlIsRUFHRzlpQixXQUhILENBR2UsUUFIZixFQUlHcWIsR0FKSCxHQUtHeUgsSUFMSCxDQUtRLHFCQUxSLEVBTUc1aUIsSUFOSCxDQU1RLGVBTlIsRUFNeUIsS0FOekI7O0FBUUFtRSxjQUNHdkUsUUFESCxDQUNZLFFBRFosRUFFR2dqQixJQUZILENBRVEscUJBRlIsRUFHRzVpQixJQUhILENBR1EsZUFIUixFQUd5QixJQUh6Qjs7QUFLQSxVQUFJc2hCLFVBQUosRUFBZ0I7QUFDZG5kLGdCQUFRLENBQVIsRUFBV25JLFdBQVgsQ0FEYyxDQUNTO0FBQ3ZCbUksZ0JBQVF2RSxRQUFSLENBQWlCLElBQWpCO0FBQ0QsT0FIRCxNQUdPO0FBQ0x1RSxnQkFBUXJFLFdBQVIsQ0FBb0IsTUFBcEI7QUFDRDs7QUFFRCxVQUFJcUUsUUFBUXVoQixNQUFSLENBQWUsZ0JBQWYsRUFBaUNoc0IsTUFBckMsRUFBNkM7QUFDM0N5SyxnQkFDRzBlLE9BREgsQ0FDVyxhQURYLEVBRUdqakIsUUFGSCxDQUVZLFFBRlosRUFHR3ViLEdBSEgsR0FJR3lILElBSkgsQ0FJUSxxQkFKUixFQUtHNWlCLElBTEgsQ0FLUSxlQUxSLEVBS3lCLElBTHpCO0FBTUQ7O0FBRURaLGtCQUFZQSxVQUFaO0FBQ0Q7O0FBRUQybEIsWUFBUXJyQixNQUFSLElBQWtCNG5CLFVBQWxCLEdBQ0V5RCxRQUNHckQsR0FESCxDQUNPLGlCQURQLEVBQzBCOEQsSUFEMUIsRUFFR2pFLG9CQUZILENBRXdCMFUsSUFBSXhULG1CQUY1QixDQURGLEdBSUUrQyxNQUpGOztBQU1BVCxZQUFRamxCLFdBQVIsQ0FBb0IsSUFBcEI7QUFDRCxHQTlDRDs7QUFpREE7QUFDQTs7QUFFQSxXQUFTb2pCLE1BQVQsQ0FBZ0I1ZixNQUFoQixFQUF3QjtBQUN0QixXQUFPLEtBQUs2ZixJQUFMLENBQVUsWUFBWTtBQUMzQixVQUFJVCxRQUFRN0MsRUFBRSxJQUFGLENBQVo7QUFDQSxVQUFJNWIsT0FBUXllLE1BQU16ZSxJQUFOLENBQVcsUUFBWCxDQUFaOztBQUVBLFVBQUksQ0FBQ0EsSUFBTCxFQUFXeWUsTUFBTXplLElBQU4sQ0FBVyxRQUFYLEVBQXNCQSxPQUFPLElBQUlneUIsR0FBSixDQUFRLElBQVIsQ0FBN0I7QUFDWCxVQUFJLE9BQU8zeUIsTUFBUCxJQUFpQixRQUFyQixFQUErQlcsS0FBS1gsTUFBTDtBQUNoQyxLQU5NLENBQVA7QUFPRDs7QUFFRCxNQUFJOGYsTUFBTXZELEVBQUVoYyxFQUFGLENBQUt3eUIsR0FBZjs7QUFFQXhXLElBQUVoYyxFQUFGLENBQUt3eUIsR0FBTCxHQUF1Qm5ULE1BQXZCO0FBQ0FyRCxJQUFFaGMsRUFBRixDQUFLd3lCLEdBQUwsQ0FBUy9TLFdBQVQsR0FBdUIyUyxHQUF2Qjs7QUFHQTtBQUNBOztBQUVBcFcsSUFBRWhjLEVBQUYsQ0FBS3d5QixHQUFMLENBQVM5UyxVQUFULEdBQXNCLFlBQVk7QUFDaEMxRCxNQUFFaGMsRUFBRixDQUFLd3lCLEdBQUwsR0FBV2pULEdBQVg7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQU1BO0FBQ0E7O0FBRUEsTUFBSXNELGVBQWUsU0FBZkEsWUFBZSxDQUFVcHNCLENBQVYsRUFBYTtBQUM5QkEsTUFBRW9sQixjQUFGO0FBQ0F3RCxXQUFPbnJCLElBQVAsQ0FBWThuQixFQUFFLElBQUYsQ0FBWixFQUFxQixNQUFyQjtBQUNELEdBSEQ7O0FBS0FBLElBQUVsbEIsUUFBRixFQUNHZ0osRUFESCxDQUNNLHVCQUROLEVBQytCLHFCQUQvQixFQUNzRCtpQixZQUR0RCxFQUVHL2lCLEVBRkgsQ0FFTSx1QkFGTixFQUUrQixzQkFGL0IsRUFFdUQraUIsWUFGdkQ7QUFJRCxDQWpKQSxDQWlKQzdGLE1BakpELENBQUQ7O0FBbUpBOzs7Ozs7OztBQVNBLENBQUMsVUFBVWhCLENBQVYsRUFBYTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsTUFBSXlXLFFBQVEsU0FBUkEsS0FBUSxDQUFVbnlCLE9BQVYsRUFBbUJZLE9BQW5CLEVBQTRCO0FBQ3RDLFNBQUtBLE9BQUwsR0FBZThhLEVBQUV6bUIsTUFBRixDQUFTLEVBQVQsRUFBYWs5QixNQUFNNVMsUUFBbkIsRUFBNkIzZSxPQUE3QixDQUFmOztBQUVBLFFBQUl4TCxTQUFTLEtBQUt3TCxPQUFMLENBQWF4TCxNQUFiLEtBQXdCKzhCLE1BQU01UyxRQUFOLENBQWVucUIsTUFBdkMsR0FBZ0RzbUIsRUFBRSxLQUFLOWEsT0FBTCxDQUFheEwsTUFBZixDQUFoRCxHQUF5RXNtQixFQUFFbGxCLFFBQUYsRUFBWWlvQixJQUFaLENBQWlCLEtBQUs3ZCxPQUFMLENBQWF4TCxNQUE5QixDQUF0Rjs7QUFFQSxTQUFLcXRCLE9BQUwsR0FBZXJ0QixPQUNab0ssRUFEWSxDQUNULDBCQURTLEVBQ21Ca2MsRUFBRW9FLEtBQUYsQ0FBUSxLQUFLc1MsYUFBYixFQUE0QixJQUE1QixDQURuQixFQUVaNXlCLEVBRlksQ0FFVCx5QkFGUyxFQUVtQmtjLEVBQUVvRSxLQUFGLENBQVEsS0FBS3VTLDBCQUFiLEVBQXlDLElBQXpDLENBRm5CLENBQWY7O0FBSUEsU0FBSy9TLFFBQUwsR0FBb0I1RCxFQUFFMWIsT0FBRixDQUFwQjtBQUNBLFNBQUtzeUIsT0FBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUtDLEtBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLElBQXBCOztBQUVBLFNBQUtKLGFBQUw7QUFDRCxHQWZEOztBQWlCQUQsUUFBTTlULE9BQU4sR0FBaUIsT0FBakI7O0FBRUE4VCxRQUFNTSxLQUFOLEdBQWlCLDhCQUFqQjs7QUFFQU4sUUFBTTVTLFFBQU4sR0FBaUI7QUFDZjZPLFlBQVEsQ0FETztBQUVmaDVCLFlBQVFqQjtBQUZPLEdBQWpCOztBQUtBZytCLFFBQU16K0IsU0FBTixDQUFnQmcvQixRQUFoQixHQUEyQixVQUFVck0sWUFBVixFQUF3QmxRLE1BQXhCLEVBQWdDd2MsU0FBaEMsRUFBMkNDLFlBQTNDLEVBQXlEO0FBQ2xGLFFBQUlyTixZQUFlLEtBQUs5QyxPQUFMLENBQWE4QyxTQUFiLEVBQW5CO0FBQ0EsUUFBSXpzQixXQUFlLEtBQUt3bUIsUUFBTCxDQUFjOE8sTUFBZCxFQUFuQjtBQUNBLFFBQUl5RSxlQUFlLEtBQUtwUSxPQUFMLENBQWF0TSxNQUFiLEVBQW5COztBQUVBLFFBQUl3YyxhQUFhLElBQWIsSUFBcUIsS0FBS0wsT0FBTCxJQUFnQixLQUF6QyxFQUFnRCxPQUFPL00sWUFBWW9OLFNBQVosR0FBd0IsS0FBeEIsR0FBZ0MsS0FBdkM7O0FBRWhELFFBQUksS0FBS0wsT0FBTCxJQUFnQixRQUFwQixFQUE4QjtBQUM1QixVQUFJSyxhQUFhLElBQWpCLEVBQXVCLE9BQVFwTixZQUFZLEtBQUtnTixLQUFqQixJQUEwQno1QixTQUFTMjBCLEdBQXBDLEdBQTJDLEtBQTNDLEdBQW1ELFFBQTFEO0FBQ3ZCLGFBQVFsSSxZQUFZc04sWUFBWixJQUE0QnhNLGVBQWV1TSxZQUE1QyxHQUE0RCxLQUE1RCxHQUFvRSxRQUEzRTtBQUNEOztBQUVELFFBQUlFLGVBQWlCLEtBQUtSLE9BQUwsSUFBZ0IsSUFBckM7QUFDQSxRQUFJUyxjQUFpQkQsZUFBZXZOLFNBQWYsR0FBMkJ6c0IsU0FBUzIwQixHQUF6RDtBQUNBLFFBQUl1RixpQkFBaUJGLGVBQWVELFlBQWYsR0FBOEIxYyxNQUFuRDs7QUFFQSxRQUFJd2MsYUFBYSxJQUFiLElBQXFCcE4sYUFBYW9OLFNBQXRDLEVBQWlELE9BQU8sS0FBUDtBQUNqRCxRQUFJQyxnQkFBZ0IsSUFBaEIsSUFBeUJHLGNBQWNDLGNBQWQsSUFBZ0MzTSxlQUFldU0sWUFBNUUsRUFBMkYsT0FBTyxRQUFQOztBQUUzRixXQUFPLEtBQVA7QUFDRCxHQXBCRDs7QUFzQkFULFFBQU16K0IsU0FBTixDQUFnQnUvQixlQUFoQixHQUFrQyxZQUFZO0FBQzVDLFFBQUksS0FBS1QsWUFBVCxFQUF1QixPQUFPLEtBQUtBLFlBQVo7QUFDdkIsU0FBS2xULFFBQUwsQ0FBYzNqQixXQUFkLENBQTBCdzJCLE1BQU1NLEtBQWhDLEVBQXVDaDNCLFFBQXZDLENBQWdELE9BQWhEO0FBQ0EsUUFBSThwQixZQUFZLEtBQUs5QyxPQUFMLENBQWE4QyxTQUFiLEVBQWhCO0FBQ0EsUUFBSXpzQixXQUFZLEtBQUt3bUIsUUFBTCxDQUFjOE8sTUFBZCxFQUFoQjtBQUNBLFdBQVEsS0FBS29FLFlBQUwsR0FBb0IxNUIsU0FBUzIwQixHQUFULEdBQWVsSSxTQUEzQztBQUNELEdBTkQ7O0FBUUE0TSxRQUFNeitCLFNBQU4sQ0FBZ0IyK0IsMEJBQWhCLEdBQTZDLFlBQVk7QUFDdkQzOUIsZUFBV2duQixFQUFFb0UsS0FBRixDQUFRLEtBQUtzUyxhQUFiLEVBQTRCLElBQTVCLENBQVgsRUFBOEMsQ0FBOUM7QUFDRCxHQUZEOztBQUlBRCxRQUFNeitCLFNBQU4sQ0FBZ0IwK0IsYUFBaEIsR0FBZ0MsWUFBWTtBQUMxQyxRQUFJLENBQUMsS0FBSzlTLFFBQUwsQ0FBY3ZCLEVBQWQsQ0FBaUIsVUFBakIsQ0FBTCxFQUFtQzs7QUFFbkMsUUFBSTVILFNBQWUsS0FBS21KLFFBQUwsQ0FBY25KLE1BQWQsRUFBbkI7QUFDQSxRQUFJaVksU0FBZSxLQUFLeHRCLE9BQUwsQ0FBYXd0QixNQUFoQztBQUNBLFFBQUl1RSxZQUFldkUsT0FBT1gsR0FBMUI7QUFDQSxRQUFJbUYsZUFBZXhFLE9BQU9MLE1BQTFCO0FBQ0EsUUFBSTFILGVBQWU5dEIsS0FBSzZQLEdBQUwsQ0FBU3NULEVBQUVsbEIsUUFBRixFQUFZMmYsTUFBWixFQUFULEVBQStCdUYsRUFBRWxsQixTQUFTQyxJQUFYLEVBQWlCMGYsTUFBakIsRUFBL0IsQ0FBbkI7O0FBRUEsUUFBSSxRQUFPaVksTUFBUCx5Q0FBT0EsTUFBUCxNQUFpQixRQUFyQixFQUF1Q3dFLGVBQWVELFlBQVl2RSxNQUEzQjtBQUN2QyxRQUFJLE9BQU91RSxTQUFQLElBQW9CLFVBQXhCLEVBQXVDQSxZQUFldkUsT0FBT1gsR0FBUCxDQUFXLEtBQUtuTyxRQUFoQixDQUFmO0FBQ3ZDLFFBQUksT0FBT3NULFlBQVAsSUFBdUIsVUFBM0IsRUFBdUNBLGVBQWV4RSxPQUFPTCxNQUFQLENBQWMsS0FBS3pPLFFBQW5CLENBQWY7O0FBRXZDLFFBQUk0VCxRQUFRLEtBQUtSLFFBQUwsQ0FBY3JNLFlBQWQsRUFBNEJsUSxNQUE1QixFQUFvQ3djLFNBQXBDLEVBQStDQyxZQUEvQyxDQUFaOztBQUVBLFFBQUksS0FBS04sT0FBTCxJQUFnQlksS0FBcEIsRUFBMkI7QUFDekIsVUFBSSxLQUFLWCxLQUFMLElBQWMsSUFBbEIsRUFBd0IsS0FBS2pULFFBQUwsQ0FBY2lILEdBQWQsQ0FBa0IsS0FBbEIsRUFBeUIsRUFBekI7O0FBRXhCLFVBQUk0TSxZQUFZLFdBQVdELFFBQVEsTUFBTUEsS0FBZCxHQUFzQixFQUFqQyxDQUFoQjtBQUNBLFVBQUkvOEIsSUFBWXVsQixFQUFFaUQsS0FBRixDQUFRd1UsWUFBWSxXQUFwQixDQUFoQjs7QUFFQSxXQUFLN1QsUUFBTCxDQUFjOUIsT0FBZCxDQUFzQnJuQixDQUF0Qjs7QUFFQSxVQUFJQSxFQUFFeW9CLGtCQUFGLEVBQUosRUFBNEI7O0FBRTVCLFdBQUswVCxPQUFMLEdBQWVZLEtBQWY7QUFDQSxXQUFLWCxLQUFMLEdBQWFXLFNBQVMsUUFBVCxHQUFvQixLQUFLRCxlQUFMLEVBQXBCLEdBQTZDLElBQTFEOztBQUVBLFdBQUszVCxRQUFMLENBQ0czakIsV0FESCxDQUNldzJCLE1BQU1NLEtBRHJCLEVBRUdoM0IsUUFGSCxDQUVZMDNCLFNBRlosRUFHRzNWLE9BSEgsQ0FHVzJWLFVBQVVyN0IsT0FBVixDQUFrQixPQUFsQixFQUEyQixTQUEzQixJQUF3QyxXQUhuRDtBQUlEOztBQUVELFFBQUlvN0IsU0FBUyxRQUFiLEVBQXVCO0FBQ3JCLFdBQUs1VCxRQUFMLENBQWM4TyxNQUFkLENBQXFCO0FBQ25CWCxhQUFLcEgsZUFBZWxRLE1BQWYsR0FBd0J5YztBQURWLE9BQXJCO0FBR0Q7QUFDRixHQXZDRDs7QUEwQ0E7QUFDQTs7QUFFQSxXQUFTN1QsTUFBVCxDQUFnQjVmLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQU8sS0FBSzZmLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUlULFFBQVU3QyxFQUFFLElBQUYsQ0FBZDtBQUNBLFVBQUk1YixPQUFVeWUsTUFBTXplLElBQU4sQ0FBVyxVQUFYLENBQWQ7QUFDQSxVQUFJYyxVQUFVLFFBQU96QixNQUFQLHlDQUFPQSxNQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxNQUEzQzs7QUFFQSxVQUFJLENBQUNXLElBQUwsRUFBV3llLE1BQU16ZSxJQUFOLENBQVcsVUFBWCxFQUF3QkEsT0FBTyxJQUFJcXlCLEtBQUosQ0FBVSxJQUFWLEVBQWdCdnhCLE9BQWhCLENBQS9CO0FBQ1gsVUFBSSxPQUFPekIsTUFBUCxJQUFpQixRQUFyQixFQUErQlcsS0FBS1gsTUFBTDtBQUNoQyxLQVBNLENBQVA7QUFRRDs7QUFFRCxNQUFJOGYsTUFBTXZELEVBQUVoYyxFQUFGLENBQUt3ekIsS0FBZjs7QUFFQXhYLElBQUVoYyxFQUFGLENBQUt3ekIsS0FBTCxHQUF5Qm5VLE1BQXpCO0FBQ0FyRCxJQUFFaGMsRUFBRixDQUFLd3pCLEtBQUwsQ0FBVy9ULFdBQVgsR0FBeUJnVCxLQUF6Qjs7QUFHQTtBQUNBOztBQUVBelcsSUFBRWhjLEVBQUYsQ0FBS3d6QixLQUFMLENBQVc5VCxVQUFYLEdBQXdCLFlBQVk7QUFDbEMxRCxNQUFFaGMsRUFBRixDQUFLd3pCLEtBQUwsR0FBYWpVLEdBQWI7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQU1BO0FBQ0E7O0FBRUF2RCxJQUFFdm5CLE1BQUYsRUFBVXFMLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVk7QUFDL0JrYyxNQUFFLG9CQUFGLEVBQXdCc0QsSUFBeEIsQ0FBNkIsWUFBWTtBQUN2QyxVQUFJNlMsT0FBT25XLEVBQUUsSUFBRixDQUFYO0FBQ0EsVUFBSTViLE9BQU8reEIsS0FBSy94QixJQUFMLEVBQVg7O0FBRUFBLFdBQUtzdUIsTUFBTCxHQUFjdHVCLEtBQUtzdUIsTUFBTCxJQUFlLEVBQTdCOztBQUVBLFVBQUl0dUIsS0FBSzh5QixZQUFMLElBQXFCLElBQXpCLEVBQStCOXlCLEtBQUtzdUIsTUFBTCxDQUFZTCxNQUFaLEdBQXFCanVCLEtBQUs4eUIsWUFBMUI7QUFDL0IsVUFBSTl5QixLQUFLNnlCLFNBQUwsSUFBcUIsSUFBekIsRUFBK0I3eUIsS0FBS3N1QixNQUFMLENBQVlYLEdBQVosR0FBcUIzdEIsS0FBSzZ5QixTQUExQjs7QUFFL0I1VCxhQUFPbnJCLElBQVAsQ0FBWWkrQixJQUFaLEVBQWtCL3hCLElBQWxCO0FBQ0QsS0FWRDtBQVdELEdBWkQ7QUFjRCxDQTFKQSxDQTBKQzRjLE1BMUpELENBQUQ7OztBQ3ozRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUkwVyxlQUFnQixVQUFVMVgsQ0FBVixFQUFhO0FBQzdCOztBQUVBLFFBQUkyWCxNQUFNLEVBQVY7QUFBQSxRQUNJQyxpQkFBaUI1WCxFQUFFLHVCQUFGLENBRHJCO0FBQUEsUUFFSTZYLGlCQUFpQjdYLEVBQUUsdUJBQUYsQ0FGckI7QUFBQSxRQUdJOWEsVUFBVTtBQUNONHlCLHlCQUFpQixHQURYO0FBRU5DLG1CQUFXO0FBQ1BDLG9CQUFRLEVBREQ7QUFFUEMsc0JBQVU7QUFGSCxTQUZMO0FBTU52RixnQkFBUXdGLGlDQUFpQ04sY0FBakMsQ0FORjtBQU9OTyxpQkFBUztBQUNMQyxvQkFBUSxzQkFESDtBQUVMQyxzQkFBVTtBQUZMO0FBUEgsS0FIZDtBQUFBLFFBZUlDLGVBQWUsS0FmbkI7QUFBQSxRQWdCSUMseUJBQXlCLENBaEI3Qjs7QUFrQkE7OztBQUdBWixRQUFJakksSUFBSixHQUFXLFVBQVV4cUIsT0FBVixFQUFtQjtBQUMxQnN6QjtBQUNBQztBQUNILEtBSEQ7O0FBS0E7OztBQUdBLGFBQVNBLHlCQUFULEdBQXFDO0FBQ2pDWix1QkFBZTkzQixRQUFmLENBQXdCbUYsUUFBUWl6QixPQUFSLENBQWdCRSxRQUF4Qzs7QUFFQXpaLG9CQUFZLFlBQVc7O0FBRW5CLGdCQUFJMFosWUFBSixFQUFrQjtBQUNkSTs7QUFFQUosK0JBQWUsS0FBZjtBQUNIO0FBQ0osU0FQRCxFQU9HcHpCLFFBQVE0eUIsZUFQWDtBQVFIOztBQUVEOzs7QUFHQSxhQUFTVSxxQkFBVCxHQUFpQztBQUM3QnhZLFVBQUV2bkIsTUFBRixFQUFVbzdCLE1BQVYsQ0FBaUIsVUFBUzdWLEtBQVQsRUFBZ0I7QUFDN0JzYSwyQkFBZSxJQUFmO0FBQ0gsU0FGRDtBQUdIOztBQUVEOzs7QUFHQSxhQUFTSixnQ0FBVCxDQUEwQ3RVLFFBQTFDLEVBQW9EO0FBQ2hELFlBQUkrVSxpQkFBaUIvVSxTQUFTZ1YsV0FBVCxDQUFxQixJQUFyQixDQUFyQjtBQUFBLFlBQ0lDLGlCQUFpQmpWLFNBQVM4TyxNQUFULEdBQWtCWCxHQUR2Qzs7QUFHQSxlQUFRNEcsaUJBQWlCRSxjQUF6QjtBQUNIOztBQUVEOzs7QUFHQSxhQUFTSCxxQkFBVCxHQUFpQztBQUM3QixZQUFJSSw0QkFBNEI5WSxFQUFFdm5CLE1BQUYsRUFBVW94QixTQUFWLEVBQWhDOztBQUVBO0FBQ0EsWUFBSWlQLDZCQUE2QjV6QixRQUFRd3RCLE1BQXpDLEVBQWlEOztBQUU3QztBQUNBLGdCQUFJb0csNEJBQTRCUCxzQkFBaEMsRUFBd0Q7O0FBRXBEO0FBQ0Esb0JBQUkxN0IsS0FBS0MsR0FBTCxDQUFTZzhCLDRCQUE0QlAsc0JBQXJDLEtBQWdFcnpCLFFBQVE2eUIsU0FBUixDQUFrQkUsUUFBdEYsRUFBZ0c7QUFDNUY7QUFDSDs7QUFFREosK0JBQWU1M0IsV0FBZixDQUEyQmlGLFFBQVFpekIsT0FBUixDQUFnQkMsTUFBM0MsRUFBbURyNEIsUUFBbkQsQ0FBNERtRixRQUFRaXpCLE9BQVIsQ0FBZ0JFLFFBQTVFO0FBQ0g7O0FBRUQ7QUFWQSxpQkFXSzs7QUFFRDtBQUNBLHdCQUFJeDdCLEtBQUtDLEdBQUwsQ0FBU2c4Qiw0QkFBNEJQLHNCQUFyQyxLQUFnRXJ6QixRQUFRNnlCLFNBQVIsQ0FBa0JDLE1BQXRGLEVBQThGO0FBQzFGO0FBQ0g7O0FBRUQ7QUFDQSx3QkFBS2MsNEJBQTRCOVksRUFBRXZuQixNQUFGLEVBQVVnaUIsTUFBVixFQUE3QixHQUFtRHVGLEVBQUVsbEIsUUFBRixFQUFZMmYsTUFBWixFQUF2RCxFQUE2RTtBQUN6RW9kLHVDQUFlNTNCLFdBQWYsQ0FBMkJpRixRQUFRaXpCLE9BQVIsQ0FBZ0JFLFFBQTNDLEVBQXFEdDRCLFFBQXJELENBQThEbUYsUUFBUWl6QixPQUFSLENBQWdCQyxNQUE5RTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQTVCQSxhQTZCSztBQUNEUCwrQkFBZTUzQixXQUFmLENBQTJCaUYsUUFBUWl6QixPQUFSLENBQWdCQyxNQUEzQyxFQUFtRHI0QixRQUFuRCxDQUE0RG1GLFFBQVFpekIsT0FBUixDQUFnQkUsUUFBNUU7QUFDSDs7QUFFREUsaUNBQXlCTyx5QkFBekI7QUFDSDs7QUFFRCxXQUFPbkIsR0FBUDtBQUNILENBNUdrQixDQTRHaEIzVyxNQTVHZ0IsQ0FBbkI7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJK1gsbUJBQW9CLFVBQVUvWSxDQUFWLEVBQWE7QUFDakM7O0FBRUEsUUFBSTJYLE1BQU0sRUFBVjtBQUFBLFFBQ0lxQixpQkFBaUI7QUFDYixzQkFBYyxtQkFERDtBQUViLHNCQUFjLCtCQUZEO0FBR2Isb0JBQVksbUNBSEM7QUFJYiw2QkFBcUIsNENBSlI7O0FBTWIsdUJBQWUsYUFORjtBQU9iLG1DQUEyQixjQVBkO0FBUWIsaUNBQXlCO0FBUlosS0FEckI7O0FBWUE7OztBQUdBckIsUUFBSWpJLElBQUosR0FBVyxVQUFVeHFCLE9BQVYsRUFBbUI7QUFDMUJzekI7QUFDQUM7QUFDSCxLQUhEOztBQUtBOzs7QUFHQSxhQUFTQSx5QkFBVCxHQUFxQzs7QUFFakM7QUFDQVE7QUFDSDs7QUFFRDs7O0FBR0EsYUFBU1QscUJBQVQsR0FBaUMsQ0FBRTs7QUFFbkM7Ozs7QUFJQSxhQUFTUyxPQUFULEdBQW1CO0FBQ2YsWUFBSUMsZUFBZWxaLEVBQUVnWixlQUFlRyxVQUFqQixDQUFuQjs7QUFFQTtBQUNBLFlBQUlELGFBQWFyL0IsTUFBYixHQUFzQixDQUExQixFQUE2QjtBQUN6QnEvQix5QkFBYTVWLElBQWIsQ0FBa0IsVUFBU25sQixLQUFULEVBQWdCbUcsT0FBaEIsRUFBeUI7QUFDdkMsb0JBQUk4MEIsY0FBY3BaLEVBQUUsSUFBRixDQUFsQjtBQUFBLG9CQUNJcVosYUFBYUQsWUFBWXJXLElBQVosQ0FBaUJpVyxlQUFlTSxpQkFBaEMsQ0FEakI7QUFBQSxvQkFFSUMscUJBQXFCSCxZQUFZclcsSUFBWixDQUFpQmlXLGVBQWVRLHFCQUFoQyxDQUZ6Qjs7QUFJQTtBQUNBLG9CQUFJSixZQUFZejVCLFFBQVosQ0FBcUJxNUIsZUFBZVMsV0FBcEMsQ0FBSixFQUFzRDtBQUNsRDtBQUNIOztBQUVEO0FBQ0Esb0JBQUlKLFdBQVd4L0IsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN2QnUvQixnQ0FBWXI1QixRQUFaLENBQXFCaTVCLGVBQWVVLHVCQUFwQzs7QUFFQTtBQUNBTCwrQkFBVy9WLElBQVgsQ0FBZ0IsVUFBU25sQixLQUFULEVBQWdCbUcsT0FBaEIsRUFBeUI7QUFDckMsNEJBQUlxMUIsWUFBWTNaLEVBQUUsSUFBRixDQUFoQjtBQUFBLDRCQUNJNFosaUJBQWlCNVosRUFBRSxNQUFGLEVBQVVyZ0IsUUFBVixDQUFtQixnQkFBbkIsSUFBdUMsSUFBdkMsR0FBOEMsS0FEbkU7O0FBR0FnNkIsa0NBQVUzRCxPQUFWLENBQWtCZ0QsZUFBZXRRLFFBQWpDLEVBQ0szb0IsUUFETCxDQUNjaTVCLGVBQWVRLHFCQUQ3QixFQUVLbkosS0FGTCxDQUVXLFlBQVc7O0FBRWQsZ0NBQUl1SixjQUFKLEVBQW9CO0FBQ2hCQywyQ0FBV3BTLElBQVg7QUFDSDtBQUNKLHlCQVBMLEVBT08sWUFBVzs7QUFFVixnQ0FBSW1TLGNBQUosRUFBb0I7QUFDaEJDLDJDQUFXN1IsSUFBWDtBQUNIO0FBQ0oseUJBWkw7QUFhSCxxQkFqQkQ7QUFrQkg7O0FBRUQ7QUFDQW9SLDRCQUFZcjVCLFFBQVosQ0FBcUJpNUIsZUFBZVMsV0FBcEM7QUFDSCxhQXJDRDtBQXNDSDtBQUNKOztBQUVELFdBQU85QixHQUFQO0FBQ0gsQ0F4RnNCLENBd0ZwQjNXLE1BeEZvQixDQUF2Qjs7O0FDVkE7Ozs7QUFJQyxhQUFZO0FBQ1g7O0FBRUEsTUFBSThZLGVBQWUsRUFBbkI7O0FBRUFBLGVBQWFDLGNBQWIsR0FBOEIsVUFBVUMsUUFBVixFQUFvQnZXLFdBQXBCLEVBQWlDO0FBQzdELFFBQUksRUFBRXVXLG9CQUFvQnZXLFdBQXRCLENBQUosRUFBd0M7QUFDdEMsWUFBTSxJQUFJd1csU0FBSixDQUFjLG1DQUFkLENBQU47QUFDRDtBQUNGLEdBSkQ7O0FBTUFILGVBQWFJLFdBQWIsR0FBMkIsWUFBWTtBQUNyQyxhQUFTQyxnQkFBVCxDQUEwQnpnQyxNQUExQixFQUFrQ2dJLEtBQWxDLEVBQXlDO0FBQ3ZDLFdBQUssSUFBSTlILElBQUksQ0FBYixFQUFnQkEsSUFBSThILE1BQU03SCxNQUExQixFQUFrQ0QsR0FBbEMsRUFBdUM7QUFDckMsWUFBSXdnQyxhQUFhMTRCLE1BQU05SCxDQUFOLENBQWpCO0FBQ0F3Z0MsbUJBQVdDLFVBQVgsR0FBd0JELFdBQVdDLFVBQVgsSUFBeUIsS0FBakQ7QUFDQUQsbUJBQVdFLFlBQVgsR0FBMEIsSUFBMUI7QUFDQSxZQUFJLFdBQVdGLFVBQWYsRUFBMkJBLFdBQVdHLFFBQVgsR0FBc0IsSUFBdEI7QUFDM0IzaUMsZUFBT3NMLGNBQVAsQ0FBc0J4SixNQUF0QixFQUE4QjBnQyxXQUFXOS9CLEdBQXpDLEVBQThDOC9CLFVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLFVBQVUzVyxXQUFWLEVBQXVCK1csVUFBdkIsRUFBbUNDLFdBQW5DLEVBQWdEO0FBQ3JELFVBQUlELFVBQUosRUFBZ0JMLGlCQUFpQjFXLFlBQVl6ckIsU0FBN0IsRUFBd0N3aUMsVUFBeEM7QUFDaEIsVUFBSUMsV0FBSixFQUFpQk4saUJBQWlCMVcsV0FBakIsRUFBOEJnWCxXQUE5QjtBQUNqQixhQUFPaFgsV0FBUDtBQUNELEtBSkQ7QUFLRCxHQWhCMEIsRUFBM0I7O0FBa0JBcVc7O0FBRUEsTUFBSVksYUFBYTtBQUNmQyxZQUFRLEtBRE87QUFFZkMsWUFBUTtBQUZPLEdBQWpCOztBQUtBLE1BQUlDLFNBQVM7QUFDWDtBQUNBOztBQUVBQyxXQUFPLFNBQVNBLEtBQVQsQ0FBZS8rQixHQUFmLEVBQW9CO0FBQ3pCLFVBQUlnL0IsVUFBVSxJQUFJM00sTUFBSixDQUFXLHNCQUFzQjtBQUMvQyx5REFEeUIsR0FDNkI7QUFDdEQsbUNBRnlCLEdBRU87QUFDaEMsdUNBSHlCLEdBR1c7QUFDcEMsZ0NBSnlCLEdBSUk7QUFDN0IsMEJBTGMsRUFLUSxHQUxSLENBQWQsQ0FEeUIsQ0FNRzs7QUFFNUIsVUFBSTJNLFFBQVFoNEIsSUFBUixDQUFhaEgsR0FBYixDQUFKLEVBQXVCO0FBQ3JCLGVBQU8sSUFBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sS0FBUDtBQUNEO0FBQ0YsS0FqQlU7O0FBb0JYO0FBQ0FpL0IsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQnBYLFFBQXJCLEVBQStCO0FBQzFDLFdBQUtxWCxTQUFMLENBQWVyWCxRQUFmLEVBQXlCLElBQXpCO0FBQ0EsV0FBS3FYLFNBQUwsQ0FBZXJYLFFBQWYsRUFBeUIsT0FBekI7QUFDQUEsZUFBU1MsVUFBVCxDQUFvQixPQUFwQjtBQUNELEtBekJVO0FBMEJYNFcsZUFBVyxTQUFTQSxTQUFULENBQW1CclgsUUFBbkIsRUFBNkJzWCxTQUE3QixFQUF3QztBQUNqRCxVQUFJQyxZQUFZdlgsU0FBU3pqQixJQUFULENBQWMrNkIsU0FBZCxDQUFoQjs7QUFFQSxVQUFJLE9BQU9DLFNBQVAsS0FBcUIsUUFBckIsSUFBaUNBLGNBQWMsRUFBL0MsSUFBcURBLGNBQWMsWUFBdkUsRUFBcUY7QUFDbkZ2WCxpQkFBU3pqQixJQUFULENBQWMrNkIsU0FBZCxFQUF5QkMsVUFBVS8rQixPQUFWLENBQWtCLHFCQUFsQixFQUF5QyxVQUFVOCtCLFNBQVYsR0FBc0IsS0FBL0QsQ0FBekI7QUFDRDtBQUNGLEtBaENVOztBQW1DWDtBQUNBRSxpQkFBYSxZQUFZO0FBQ3ZCLFVBQUlyZ0MsT0FBT0QsU0FBU0MsSUFBVCxJQUFpQkQsU0FBU0ssZUFBckM7QUFBQSxVQUNJRyxRQUFRUCxLQUFLTyxLQURqQjtBQUFBLFVBRUlvQixZQUFZLEtBRmhCO0FBQUEsVUFHSTIrQixXQUFXLFlBSGY7O0FBS0EsVUFBSUEsWUFBWS8vQixLQUFoQixFQUF1QjtBQUNyQm9CLG9CQUFZLElBQVo7QUFDRCxPQUZELE1BRU87QUFDTCxTQUFDLFlBQVk7QUFDWCxjQUFJcUYsV0FBVyxDQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLEdBQWxCLEVBQXVCLElBQXZCLENBQWY7QUFBQSxjQUNJQyxTQUFTbEksU0FEYjtBQUFBLGNBRUlGLElBQUlFLFNBRlI7O0FBSUF1aEMscUJBQVdBLFNBQVN6NUIsTUFBVCxDQUFnQixDQUFoQixFQUFtQkMsV0FBbkIsS0FBbUN3NUIsU0FBU3Y1QixNQUFULENBQWdCLENBQWhCLENBQTlDO0FBQ0FwRixzQkFBWSxZQUFZO0FBQ3RCLGlCQUFLOUMsSUFBSSxDQUFULEVBQVlBLElBQUltSSxTQUFTbEksTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ3BDb0ksdUJBQVNELFNBQVNuSSxDQUFULENBQVQ7QUFDQSxrQkFBSW9JLFNBQVNxNUIsUUFBVCxJQUFxQi8vQixLQUF6QixFQUFnQztBQUM5Qix1QkFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFRCxtQkFBTyxLQUFQO0FBQ0QsV0FUVyxFQUFaO0FBVUErL0IscUJBQVczK0IsWUFBWSxNQUFNc0YsT0FBT1EsV0FBUCxFQUFOLEdBQTZCLEdBQTdCLEdBQW1DNjRCLFNBQVM3NEIsV0FBVCxFQUEvQyxHQUF3RSxJQUFuRjtBQUNELFNBakJEO0FBa0JEOztBQUVELGFBQU87QUFDTDlGLG1CQUFXQSxTQUROO0FBRUwyK0Isa0JBQVVBO0FBRkwsT0FBUDtBQUlELEtBakNZO0FBcENGLEdBQWI7O0FBd0VBLE1BQUlDLE1BQU10YSxNQUFWOztBQUVBLE1BQUl1YSxxQkFBcUIsZ0JBQXpCO0FBQ0EsTUFBSUMsYUFBYSxNQUFqQjtBQUNBLE1BQUlDLGNBQWMsT0FBbEI7QUFDQSxNQUFJQyxxQkFBcUIsaUZBQXpCO0FBQ0EsTUFBSUMsT0FBTyxZQUFZO0FBQ3JCLGFBQVNBLElBQVQsQ0FBYzVqQyxJQUFkLEVBQW9CO0FBQ2xCK2hDLG1CQUFhQyxjQUFiLENBQTRCLElBQTVCLEVBQWtDNEIsSUFBbEM7O0FBRUEsV0FBSzVqQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxXQUFLeUksSUFBTCxHQUFZODZCLElBQUksTUFBTXZqQyxJQUFWLENBQVo7QUFDQSxXQUFLNmpDLFNBQUwsR0FBaUI3akMsU0FBUyxNQUFULEdBQWtCLFdBQWxCLEdBQWdDLGVBQWVBLElBQWYsR0FBc0IsT0FBdkU7QUFDQSxXQUFLOGpDLFNBQUwsR0FBaUIsS0FBS3I3QixJQUFMLENBQVVzN0IsVUFBVixDQUFxQixJQUFyQixDQUFqQjtBQUNBLFdBQUtyMUIsS0FBTCxHQUFhLEtBQUtqRyxJQUFMLENBQVU0RCxJQUFWLENBQWUsT0FBZixDQUFiO0FBQ0EsV0FBSzIzQixJQUFMLEdBQVksS0FBS3Y3QixJQUFMLENBQVU0RCxJQUFWLENBQWUsTUFBZixDQUFaO0FBQ0EsV0FBSzQzQixRQUFMLEdBQWdCLEtBQUt4N0IsSUFBTCxDQUFVNEQsSUFBVixDQUFlLFVBQWYsQ0FBaEI7QUFDQSxXQUFLNjNCLE1BQUwsR0FBYyxLQUFLejdCLElBQUwsQ0FBVTRELElBQVYsQ0FBZSxRQUFmLENBQWQ7QUFDQSxXQUFLODNCLE1BQUwsR0FBYyxLQUFLMTdCLElBQUwsQ0FBVTRELElBQVYsQ0FBZSxRQUFmLENBQWQ7QUFDQSxXQUFLKzNCLGNBQUwsR0FBc0IsS0FBSzM3QixJQUFMLENBQVU0RCxJQUFWLENBQWUsUUFBZixDQUF0QjtBQUNBLFdBQUtnNEIsZUFBTCxHQUF1QixLQUFLNTdCLElBQUwsQ0FBVTRELElBQVYsQ0FBZSxTQUFmLENBQXZCO0FBQ0EsV0FBS2k0QixpQkFBTCxHQUF5QixLQUFLNzdCLElBQUwsQ0FBVTRELElBQVYsQ0FBZSxXQUFmLENBQXpCO0FBQ0EsV0FBS2s0QixrQkFBTCxHQUEwQixLQUFLOTdCLElBQUwsQ0FBVTRELElBQVYsQ0FBZSxZQUFmLENBQTFCO0FBQ0EsV0FBS3JKLElBQUwsR0FBWXVnQyxJQUFJLEtBQUs5NkIsSUFBTCxDQUFVNEQsSUFBVixDQUFlLE1BQWYsQ0FBSixDQUFaO0FBQ0Q7O0FBRUQwMUIsaUJBQWFJLFdBQWIsQ0FBeUJ5QixJQUF6QixFQUErQixDQUFDO0FBQzlCcmhDLFdBQUssY0FEeUI7QUFFOUJOLGFBQU8sU0FBU3VpQyxZQUFULENBQXNCeGQsTUFBdEIsRUFBOEJ6YSxPQUE5QixFQUF1QztBQUM1QyxZQUFJcXJCLFlBQVksRUFBaEI7QUFBQSxZQUNJenRCLE9BQU8sS0FBSzY1QixJQURoQjs7QUFHQSxZQUFJaGQsV0FBVyxNQUFYLElBQXFCemEsWUFBWSxNQUFyQyxFQUE2QztBQUMzQ3FyQixvQkFBVXp0QixJQUFWLElBQWtCLEtBQUsyNUIsU0FBTCxHQUFpQixJQUFuQztBQUNELFNBRkQsTUFFTyxJQUFJOWMsV0FBVyxPQUFYLElBQXNCemEsWUFBWSxNQUF0QyxFQUE4QztBQUNuRHFyQixvQkFBVXp0QixJQUFWLElBQWtCLE1BQU0sS0FBSzI1QixTQUFYLEdBQXVCLElBQXpDO0FBQ0QsU0FGTSxNQUVBO0FBQ0xsTSxvQkFBVXp0QixJQUFWLElBQWtCLENBQWxCO0FBQ0Q7O0FBRUQsZUFBT3l0QixTQUFQO0FBQ0Q7QUFmNkIsS0FBRCxFQWdCNUI7QUFDRHIxQixXQUFLLGFBREo7QUFFRE4sYUFBTyxTQUFTd2lDLFdBQVQsQ0FBcUJ6ZCxNQUFyQixFQUE2QjtBQUNsQyxZQUFJN2MsT0FBTzZjLFdBQVcsTUFBWCxHQUFvQixRQUFwQixHQUErQixFQUExQzs7QUFFQTtBQUNBLFlBQUksS0FBS2hrQixJQUFMLENBQVVzbkIsRUFBVixDQUFhLE1BQWIsQ0FBSixFQUEwQjtBQUN4QixjQUFJb2EsUUFBUW5CLElBQUksTUFBSixDQUFaO0FBQUEsY0FDSXpSLFlBQVk0UyxNQUFNNVMsU0FBTixFQURoQjs7QUFHQTRTLGdCQUFNNVIsR0FBTixDQUFVLFlBQVYsRUFBd0Izb0IsSUFBeEIsRUFBOEIybkIsU0FBOUIsQ0FBd0NBLFNBQXhDO0FBQ0Q7QUFDRjtBQVpBLEtBaEI0QixFQTZCNUI7QUFDRHZ2QixXQUFLLFVBREo7QUFFRE4sYUFBTyxTQUFTMGlDLFFBQVQsR0FBb0I7QUFDekIsWUFBSSxLQUFLVixRQUFULEVBQW1CO0FBQ2pCLGNBQUlaLGNBQWNQLE9BQU9PLFdBQXpCO0FBQUEsY0FDSXhTLFFBQVEsS0FBSzd0QixJQURqQjs7QUFHQSxjQUFJcWdDLFlBQVkxK0IsU0FBaEIsRUFBMkI7QUFDekJrc0Isa0JBQU1pQyxHQUFOLENBQVV1USxZQUFZQyxRQUF0QixFQUFnQyxLQUFLVSxJQUFMLEdBQVksR0FBWixHQUFrQixLQUFLdDFCLEtBQUwsR0FBYSxJQUEvQixHQUFzQyxJQUF0QyxHQUE2QyxLQUFLdzFCLE1BQWxGLEVBQTBGcFIsR0FBMUYsQ0FBOEYsS0FBS2tSLElBQW5HLEVBQXlHLENBQXpHLEVBQTRHbFIsR0FBNUcsQ0FBZ0g7QUFDOUczdUIscUJBQU8wc0IsTUFBTTFzQixLQUFOLEVBRHVHO0FBRTlHa0Isd0JBQVU7QUFGb0csYUFBaEg7QUFJQXdyQixrQkFBTWlDLEdBQU4sQ0FBVSxLQUFLa1IsSUFBZixFQUFxQixLQUFLRixTQUFMLEdBQWlCLElBQXRDO0FBQ0QsV0FORCxNQU1PO0FBQ0wsZ0JBQUljLGdCQUFnQixLQUFLSixZQUFMLENBQWtCZixVQUFsQixFQUE4QixNQUE5QixDQUFwQjs7QUFFQTVTLGtCQUFNaUMsR0FBTixDQUFVO0FBQ1IzdUIscUJBQU8wc0IsTUFBTTFzQixLQUFOLEVBREM7QUFFUmtCLHdCQUFVO0FBRkYsYUFBVixFQUdHa3RCLE9BSEgsQ0FHV3FTLGFBSFgsRUFHMEI7QUFDeEJDLHFCQUFPLEtBRGlCO0FBRXhCbjRCLHdCQUFVLEtBQUtnQztBQUZTLGFBSDFCO0FBT0Q7QUFDRjtBQUNGO0FBekJBLEtBN0I0QixFQXVENUI7QUFDRG5NLFdBQUssYUFESjtBQUVETixhQUFPLFNBQVM2aUMsV0FBVCxHQUF1QjtBQUM1QixZQUFJekIsY0FBY1AsT0FBT08sV0FBekI7QUFBQSxZQUNJMEIsY0FBYztBQUNoQjVnQyxpQkFBTyxFQURTO0FBRWhCa0Isb0JBQVUsRUFGTTtBQUdoQjRWLGlCQUFPLEVBSFM7QUFJaEJoVyxnQkFBTTtBQUpVLFNBRGxCOztBQVFBLFlBQUlvK0IsWUFBWTErQixTQUFoQixFQUEyQjtBQUN6Qm9nQyxzQkFBWTFCLFlBQVlDLFFBQXhCLElBQW9DLEVBQXBDO0FBQ0Q7O0FBRUQsYUFBS3RnQyxJQUFMLENBQVU4dkIsR0FBVixDQUFjaVMsV0FBZCxFQUEyQkMsTUFBM0IsQ0FBa0NyQixrQkFBbEM7QUFDRDtBQWhCQSxLQXZENEIsRUF3RTVCO0FBQ0RwaEMsV0FBSyxXQURKO0FBRUROLGFBQU8sU0FBU2dqQyxTQUFULEdBQXFCO0FBQzFCLFlBQUlDLFFBQVEsSUFBWjs7QUFFQSxZQUFJLEtBQUtqQixRQUFULEVBQW1CO0FBQ2pCLGNBQUluQixPQUFPTyxXQUFQLENBQW1CMStCLFNBQXZCLEVBQWtDO0FBQ2hDLGlCQUFLM0IsSUFBTCxDQUFVOHZCLEdBQVYsQ0FBYyxLQUFLa1IsSUFBbkIsRUFBeUIsQ0FBekIsRUFBNEJsYSxHQUE1QixDQUFnQzZaLGtCQUFoQyxFQUFvRCxZQUFZO0FBQzlEdUIsb0JBQU1KLFdBQU47QUFDRCxhQUZEO0FBR0QsV0FKRCxNQUlPO0FBQ0wsZ0JBQUlGLGdCQUFnQixLQUFLSixZQUFMLENBQWtCZCxXQUFsQixFQUErQixNQUEvQixDQUFwQjs7QUFFQSxpQkFBSzFnQyxJQUFMLENBQVV1dkIsT0FBVixDQUFrQnFTLGFBQWxCLEVBQWlDO0FBQy9CQyxxQkFBTyxLQUR3QjtBQUUvQm40Qix3QkFBVSxLQUFLZ0MsS0FGZ0I7QUFHL0JvaEIsd0JBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1Qm9WLHNCQUFNSixXQUFOO0FBQ0Q7QUFMOEIsYUFBakM7QUFPRDtBQUNGO0FBQ0Y7QUF0QkEsS0F4RTRCLEVBK0Y1QjtBQUNEdmlDLFdBQUssVUFESjtBQUVETixhQUFPLFNBQVNrakMsUUFBVCxDQUFrQm5lLE1BQWxCLEVBQTBCO0FBQy9CLFlBQUlBLFdBQVd5YyxVQUFmLEVBQTJCO0FBQ3pCLGVBQUtrQixRQUFMO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS00sU0FBTDtBQUNEO0FBQ0Y7QUFSQSxLQS9GNEIsRUF3RzVCO0FBQ0QxaUMsV0FBSyxZQURKO0FBRUROLGFBQU8sU0FBU21qQyxVQUFULENBQW9CNTlCLFFBQXBCLEVBQThCO0FBQ25DLFlBQUl4SCxPQUFPLEtBQUtBLElBQWhCOztBQUVBMmlDLG1CQUFXQyxNQUFYLEdBQW9CLEtBQXBCO0FBQ0FELG1CQUFXRSxNQUFYLEdBQW9CN2lDLElBQXBCOztBQUVBLGFBQUt5SSxJQUFMLENBQVV1OEIsTUFBVixDQUFpQnJCLGtCQUFqQjs7QUFFQSxhQUFLM2dDLElBQUwsQ0FBVWtGLFdBQVYsQ0FBc0JzN0Isa0JBQXRCLEVBQTBDeDdCLFFBQTFDLENBQW1ELEtBQUs2N0IsU0FBeEQ7O0FBRUEsYUFBS1MsaUJBQUw7O0FBRUEsWUFBSSxPQUFPOThCLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDbENBLG1CQUFTeEgsSUFBVDtBQUNEO0FBQ0Y7QUFqQkEsS0F4RzRCLEVBMEg1QjtBQUNEdUMsV0FBSyxVQURKO0FBRUROLGFBQU8sU0FBU29qQyxRQUFULENBQWtCNzlCLFFBQWxCLEVBQTRCO0FBQ2pDLFlBQUk4OUIsU0FBUyxJQUFiOztBQUVBLFlBQUlDLFFBQVEsS0FBSzk4QixJQUFqQjs7QUFFQSxZQUFJcTZCLE9BQU9PLFdBQVAsQ0FBbUIxK0IsU0FBdkIsRUFBa0M7QUFDaEM0Z0MsZ0JBQU16UyxHQUFOLENBQVUsS0FBS2tSLElBQWYsRUFBcUIsQ0FBckIsRUFBd0JsYSxHQUF4QixDQUE0QjZaLGtCQUE1QixFQUFnRCxZQUFZO0FBQzFEMkIsbUJBQU9GLFVBQVAsQ0FBa0I1OUIsUUFBbEI7QUFDRCxXQUZEO0FBR0QsU0FKRCxNQUlPO0FBQ0wsY0FBSWcrQixnQkFBZ0IsS0FBS2hCLFlBQUwsQ0FBa0JmLFVBQWxCLEVBQThCLE1BQTlCLENBQXBCOztBQUVBOEIsZ0JBQU16UyxHQUFOLENBQVUsU0FBVixFQUFxQixPQUFyQixFQUE4QlAsT0FBOUIsQ0FBc0NpVCxhQUF0QyxFQUFxRDtBQUNuRFgsbUJBQU8sS0FENEM7QUFFbkRuNEIsc0JBQVUsS0FBS2dDLEtBRm9DO0FBR25Eb2hCLHNCQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUJ3VixxQkFBT0YsVUFBUCxDQUFrQjU5QixRQUFsQjtBQUNEO0FBTGtELFdBQXJEO0FBT0Q7QUFDRjtBQXRCQSxLQTFINEIsRUFpSjVCO0FBQ0RqRixXQUFLLGFBREo7QUFFRE4sYUFBTyxTQUFTd2pDLFdBQVQsQ0FBcUJqK0IsUUFBckIsRUFBK0I7QUFDcEMsYUFBS2lCLElBQUwsQ0FBVXFxQixHQUFWLENBQWM7QUFDWjd0QixnQkFBTSxFQURNO0FBRVpnVyxpQkFBTztBQUZLLFNBQWQsRUFHRytwQixNQUhILENBR1VyQixrQkFIVjtBQUlBSixZQUFJLE1BQUosRUFBWXpRLEdBQVosQ0FBZ0IsWUFBaEIsRUFBOEIsRUFBOUI7O0FBRUE2UCxtQkFBV0MsTUFBWCxHQUFvQixLQUFwQjtBQUNBRCxtQkFBV0UsTUFBWCxHQUFvQixLQUFwQjs7QUFFQSxhQUFLNy9CLElBQUwsQ0FBVWtGLFdBQVYsQ0FBc0JzN0Isa0JBQXRCLEVBQTBDdDdCLFdBQTFDLENBQXNELEtBQUsyN0IsU0FBM0Q7O0FBRUEsYUFBS1Usa0JBQUw7O0FBRUE7QUFDQSxZQUFJLE9BQU8vOEIsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNsQ0EsbUJBQVN4SCxJQUFUO0FBQ0Q7QUFDRjtBQXBCQSxLQWpKNEIsRUFzSzVCO0FBQ0R1QyxXQUFLLFdBREo7QUFFRE4sYUFBTyxTQUFTeWpDLFNBQVQsQ0FBbUJsK0IsUUFBbkIsRUFBNkI7QUFDbEMsWUFBSW0rQixTQUFTLElBQWI7O0FBRUEsWUFBSWw5QixPQUFPLEtBQUtBLElBQWhCOztBQUVBLFlBQUlxNkIsT0FBT08sV0FBUCxDQUFtQjErQixTQUF2QixFQUFrQztBQUNoQzhELGVBQUtxcUIsR0FBTCxDQUFTLEtBQUtrUixJQUFkLEVBQW9CLEVBQXBCLEVBQXdCbGEsR0FBeEIsQ0FBNEI2WixrQkFBNUIsRUFBZ0QsWUFBWTtBQUMxRGdDLG1CQUFPRixXQUFQLENBQW1CaitCLFFBQW5CO0FBQ0QsV0FGRDtBQUdELFNBSkQsTUFJTztBQUNMLGNBQUlnK0IsZ0JBQWdCLEtBQUtoQixZQUFMLENBQWtCZCxXQUFsQixFQUErQixNQUEvQixDQUFwQjs7QUFFQWo3QixlQUFLOHBCLE9BQUwsQ0FBYWlULGFBQWIsRUFBNEI7QUFDMUJYLG1CQUFPLEtBRG1CO0FBRTFCbjRCLHNCQUFVLEtBQUtnQyxLQUZXO0FBRzFCb2hCLHNCQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUI2VixxQkFBT0YsV0FBUDtBQUNEO0FBTHlCLFdBQTVCO0FBT0Q7QUFDRjtBQXRCQSxLQXRLNEIsRUE2TDVCO0FBQ0RsakMsV0FBSyxVQURKO0FBRUROLGFBQU8sU0FBUzJqQyxRQUFULENBQWtCNWUsTUFBbEIsRUFBMEJ4ZixRQUExQixFQUFvQztBQUN6QyxhQUFLeEUsSUFBTCxDQUFVZ0YsUUFBVixDQUFtQnc3QixrQkFBbkI7O0FBRUEsWUFBSXhjLFdBQVd5YyxVQUFmLEVBQTJCO0FBQ3pCLGVBQUs0QixRQUFMLENBQWM3OUIsUUFBZDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtrK0IsU0FBTCxDQUFlbCtCLFFBQWY7QUFDRDtBQUNGO0FBVkEsS0E3TDRCLEVBd001QjtBQUNEakYsV0FBSyxNQURKO0FBRUROLGFBQU8sU0FBUzRqQyxJQUFULENBQWM3ZSxNQUFkLEVBQXNCeGYsUUFBdEIsRUFBZ0M7QUFDckM7QUFDQW03QixtQkFBV0MsTUFBWCxHQUFvQixJQUFwQjs7QUFFQSxhQUFLNkIsV0FBTCxDQUFpQnpkLE1BQWpCO0FBQ0EsYUFBS21lLFFBQUwsQ0FBY25lLE1BQWQ7QUFDQSxhQUFLNGUsUUFBTCxDQUFjNWUsTUFBZCxFQUFzQnhmLFFBQXRCO0FBQ0Q7QUFUQSxLQXhNNEIsRUFrTjVCO0FBQ0RqRixXQUFLLE1BREo7QUFFRE4sYUFBTyxTQUFTNmpDLElBQVQsQ0FBY3QrQixRQUFkLEVBQXdCO0FBQzdCLFlBQUl1K0IsU0FBUyxJQUFiOztBQUVBO0FBQ0EsWUFBSXBELFdBQVdFLE1BQVgsS0FBc0IsS0FBSzdpQyxJQUEzQixJQUFtQzJpQyxXQUFXQyxNQUFsRCxFQUEwRDtBQUN4RDtBQUNEOztBQUVEO0FBQ0EsWUFBSUQsV0FBV0UsTUFBWCxLQUFzQixLQUExQixFQUFpQztBQUMvQixjQUFJbUQsb0JBQW9CLElBQUlwQyxJQUFKLENBQVNqQixXQUFXRSxNQUFwQixDQUF4Qjs7QUFFQW1ELDRCQUFrQnJiLEtBQWxCLENBQXdCLFlBQVk7QUFDbENvYixtQkFBT0QsSUFBUCxDQUFZdCtCLFFBQVo7QUFDRCxXQUZEOztBQUlBO0FBQ0Q7O0FBRUQsYUFBS3ErQixJQUFMLENBQVUsTUFBVixFQUFrQnIrQixRQUFsQjs7QUFFQTtBQUNBLGFBQUs0OEIsY0FBTDtBQUNEO0FBekJBLEtBbE40QixFQTRPNUI7QUFDRDdoQyxXQUFLLE9BREo7QUFFRE4sYUFBTyxTQUFTMG9CLEtBQVQsQ0FBZW5qQixRQUFmLEVBQXlCO0FBQzlCO0FBQ0EsWUFBSW03QixXQUFXRSxNQUFYLEtBQXNCLEtBQUs3aUMsSUFBM0IsSUFBbUMyaUMsV0FBV0MsTUFBbEQsRUFBMEQ7QUFDeEQ7QUFDRDs7QUFFRCxhQUFLaUQsSUFBTCxDQUFVLE9BQVYsRUFBbUJyK0IsUUFBbkI7O0FBRUE7QUFDQSxhQUFLNjhCLGVBQUw7QUFDRDtBQVpBLEtBNU80QixFQXlQNUI7QUFDRDloQyxXQUFLLFFBREo7QUFFRE4sYUFBTyxTQUFTc3FCLE1BQVQsQ0FBZ0Iva0IsUUFBaEIsRUFBMEI7QUFDL0IsWUFBSW03QixXQUFXRSxNQUFYLEtBQXNCLEtBQUs3aUMsSUFBL0IsRUFBcUM7QUFDbkMsZUFBSzJxQixLQUFMLENBQVduakIsUUFBWDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtzK0IsSUFBTCxDQUFVdCtCLFFBQVY7QUFDRDtBQUNGO0FBUkEsS0F6UDRCLENBQS9CO0FBbVFBLFdBQU9vOEIsSUFBUDtBQUNELEdBeFJVLEVBQVg7O0FBMFJBLE1BQUlxQyxNQUFNaGQsTUFBVjs7QUFFQSxXQUFTaWQsT0FBVCxDQUFpQmxmLE1BQWpCLEVBQXlCaG5CLElBQXpCLEVBQStCd0gsUUFBL0IsRUFBeUM7QUFDdkMsUUFBSTIrQixPQUFPLElBQUl2QyxJQUFKLENBQVM1akMsSUFBVCxDQUFYOztBQUVBLFlBQVFnbkIsTUFBUjtBQUNFLFdBQUssTUFBTDtBQUNFbWYsYUFBS0wsSUFBTCxDQUFVdCtCLFFBQVY7QUFDQTtBQUNGLFdBQUssT0FBTDtBQUNFMitCLGFBQUt4YixLQUFMLENBQVduakIsUUFBWDtBQUNBO0FBQ0YsV0FBSyxRQUFMO0FBQ0UyK0IsYUFBSzVaLE1BQUwsQ0FBWS9rQixRQUFaO0FBQ0E7QUFDRjtBQUNFeStCLFlBQUlHLEtBQUosQ0FBVSxZQUFZcGYsTUFBWixHQUFxQixnQ0FBL0I7QUFDQTtBQVpKO0FBY0Q7O0FBRUQsTUFBSW5sQixDQUFKO0FBQ0EsTUFBSW9tQixJQUFJZ0IsTUFBUjtBQUNBLE1BQUlvZCxnQkFBZ0IsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixRQUFsQixDQUFwQjtBQUNBLE1BQUlDLFVBQUo7QUFDQSxNQUFJQyxVQUFVLEVBQWQ7QUFDQSxNQUFJQyxZQUFZLFNBQVNBLFNBQVQsQ0FBbUJGLFVBQW5CLEVBQStCO0FBQzdDLFdBQU8sVUFBVXRtQyxJQUFWLEVBQWdCd0gsUUFBaEIsRUFBMEI7QUFDL0I7QUFDQSxVQUFJLE9BQU94SCxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzlCd0gsbUJBQVd4SCxJQUFYO0FBQ0FBLGVBQU8sTUFBUDtBQUNELE9BSEQsTUFHTyxJQUFJLENBQUNBLElBQUwsRUFBVztBQUNoQkEsZUFBTyxNQUFQO0FBQ0Q7O0FBRURrbUMsY0FBUUksVUFBUixFQUFvQnRtQyxJQUFwQixFQUEwQndILFFBQTFCO0FBQ0QsS0FWRDtBQVdELEdBWkQ7QUFhQSxPQUFLM0YsSUFBSSxDQUFULEVBQVlBLElBQUl3a0MsY0FBY3ZrQyxNQUE5QixFQUFzQ0QsR0FBdEMsRUFBMkM7QUFDekN5a0MsaUJBQWFELGNBQWN4a0MsQ0FBZCxDQUFiO0FBQ0Ewa0MsWUFBUUQsVUFBUixJQUFzQkUsVUFBVUYsVUFBVixDQUF0QjtBQUNEOztBQUVELFdBQVNILElBQVQsQ0FBY2hDLE1BQWQsRUFBc0I7QUFDcEIsUUFBSUEsV0FBVyxRQUFmLEVBQXlCO0FBQ3ZCLGFBQU94QixVQUFQO0FBQ0QsS0FGRCxNQUVPLElBQUk0RCxRQUFRcEMsTUFBUixDQUFKLEVBQXFCO0FBQzFCLGFBQU9vQyxRQUFRcEMsTUFBUixFQUFnQjFwQixLQUFoQixDQUFzQixJQUF0QixFQUE0QjVSLE1BQU01SSxTQUFOLENBQWdCdUssS0FBaEIsQ0FBc0JySyxJQUF0QixDQUEyQnlCLFNBQTNCLEVBQXNDLENBQXRDLENBQTVCLENBQVA7QUFDRCxLQUZNLE1BRUEsSUFBSSxPQUFPdWlDLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBT0EsTUFBUCxLQUFrQixRQUFsRCxJQUE4RCxDQUFDQSxNQUFuRSxFQUEyRTtBQUNoRixhQUFPb0MsUUFBUWhhLE1BQVIsQ0FBZTlSLEtBQWYsQ0FBcUIsSUFBckIsRUFBMkI3WSxTQUEzQixDQUFQO0FBQ0QsS0FGTSxNQUVBO0FBQ0xxbUIsUUFBRW1lLEtBQUYsQ0FBUSxZQUFZakMsTUFBWixHQUFxQixnQ0FBN0I7QUFDRDtBQUNGOztBQUVELE1BQUlzQyxNQUFNeGQsTUFBVjs7QUFFQSxXQUFTeWQsV0FBVCxDQUFxQkMsU0FBckIsRUFBZ0NDLFFBQWhDLEVBQTBDO0FBQ3hDO0FBQ0EsUUFBSSxPQUFPQSxTQUFTQyxNQUFoQixLQUEyQixVQUEvQixFQUEyQztBQUN6QyxVQUFJQyxhQUFhRixTQUFTQyxNQUFULENBQWdCN21DLElBQWhCLENBQWpCOztBQUVBMm1DLGdCQUFVaGtCLElBQVYsQ0FBZW1rQixVQUFmO0FBQ0QsS0FKRCxNQUlPLElBQUksT0FBT0YsU0FBU0MsTUFBaEIsS0FBMkIsUUFBM0IsSUFBdUMvRCxPQUFPQyxLQUFQLENBQWE2RCxTQUFTQyxNQUF0QixDQUEzQyxFQUEwRTtBQUMvRUosVUFBSXI3QixHQUFKLENBQVF3N0IsU0FBU0MsTUFBakIsRUFBeUIsVUFBVXg2QixJQUFWLEVBQWdCO0FBQ3ZDczZCLGtCQUFVaGtCLElBQVYsQ0FBZXRXLElBQWY7QUFDRCxPQUZEO0FBR0QsS0FKTSxNQUlBLElBQUksT0FBT3U2QixTQUFTQyxNQUFoQixLQUEyQixRQUEvQixFQUF5QztBQUM5QyxVQUFJRSxjQUFjLEVBQWxCO0FBQUEsVUFDSUMsWUFBWUosU0FBU0MsTUFBVCxDQUFnQnpkLEtBQWhCLENBQXNCLEdBQXRCLENBRGhCOztBQUdBcWQsVUFBSWxiLElBQUosQ0FBU3liLFNBQVQsRUFBb0IsVUFBVTVnQyxLQUFWLEVBQWlCbUcsT0FBakIsRUFBMEI7QUFDNUN3NkIsdUJBQWUsNkJBQTZCTixJQUFJbDZCLE9BQUosRUFBYW9XLElBQWIsRUFBN0IsR0FBbUQsUUFBbEU7QUFDRCxPQUZEOztBQUlBO0FBQ0EsVUFBSWlrQixTQUFTSyxRQUFiLEVBQXVCO0FBQ3JCLFlBQUlDLGVBQWVULElBQUksU0FBSixFQUFlOWpCLElBQWYsQ0FBb0Jva0IsV0FBcEIsQ0FBbkI7O0FBRUFHLHFCQUFhbGMsSUFBYixDQUFrQixHQUFsQixFQUF1Qk8sSUFBdkIsQ0FBNEIsVUFBVW5sQixLQUFWLEVBQWlCbUcsT0FBakIsRUFBMEI7QUFDcEQsY0FBSXNmLFdBQVc0YSxJQUFJbDZCLE9BQUosQ0FBZjs7QUFFQXUyQixpQkFBT0csV0FBUCxDQUFtQnBYLFFBQW5CO0FBQ0QsU0FKRDtBQUtBa2Isc0JBQWNHLGFBQWF2a0IsSUFBYixFQUFkO0FBQ0Q7O0FBRURna0IsZ0JBQVVoa0IsSUFBVixDQUFlb2tCLFdBQWY7QUFDRCxLQXJCTSxNQXFCQSxJQUFJSCxTQUFTQyxNQUFULEtBQW9CLElBQXhCLEVBQThCO0FBQ25DSixVQUFJTCxLQUFKLENBQVUscUJBQVY7QUFDRDs7QUFFRCxXQUFPTyxTQUFQO0FBQ0Q7O0FBRUQsV0FBU1EsTUFBVCxDQUFnQmg2QixPQUFoQixFQUF5QjtBQUN2QixRQUFJazJCLGNBQWNQLE9BQU9PLFdBQXpCO0FBQUEsUUFDSXVELFdBQVdILElBQUlqbEMsTUFBSixDQUFXO0FBQ3hCeEIsWUFBTSxNQURrQixFQUNWO0FBQ2QwTyxhQUFPLEdBRmlCLEVBRVo7QUFDWnMxQixZQUFNLE1BSGtCLEVBR1Y7QUFDZDZDLGNBQVEsSUFKZ0IsRUFJVjtBQUNkSSxnQkFBVSxJQUxjLEVBS1I7QUFDaEJqa0MsWUFBTSxNQU5rQixFQU1WO0FBQ2RpaEMsZ0JBQVUsSUFQYyxFQU9SO0FBQ2hCQyxjQUFRLE1BUmdCLEVBUVI7QUFDaEJDLGNBQVEsUUFUZ0IsRUFTTjtBQUNsQmlELFlBQU0sa0JBVmtCLEVBVUU7QUFDMUJDLGNBQVEsU0FBU0EsTUFBVCxHQUFrQixDQUFFLENBWEo7QUFZeEI7QUFDQUMsZUFBUyxTQUFTQSxPQUFULEdBQW1CLENBQUUsQ0FiTjtBQWN4QjtBQUNBQyxpQkFBVyxTQUFTQSxTQUFULEdBQXFCLENBQUUsQ0FmVjtBQWdCeEI7QUFDQUMsa0JBQVksU0FBU0EsVUFBVCxHQUFzQixDQUFFLENBakJaLENBaUJhOztBQWpCYixLQUFYLEVBbUJacjZCLE9BbkJZLENBRGY7QUFBQSxRQXFCSW5OLE9BQU80bUMsU0FBUzVtQyxJQXJCcEI7QUFBQSxRQXNCSTJtQyxZQUFZRixJQUFJLE1BQU16bUMsSUFBVixDQXRCaEI7O0FBd0JBO0FBQ0EsUUFBSTJtQyxVQUFVN2tDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUI2a0Msa0JBQVlGLElBQUksU0FBSixFQUFlcitCLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEJwSSxJQUExQixFQUFnQzZ4QixRQUFoQyxDQUF5QzRVLElBQUksTUFBSixDQUF6QyxDQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJcEQsWUFBWTErQixTQUFoQixFQUEyQjtBQUN6QmdpQyxnQkFBVTdULEdBQVYsQ0FBY3VRLFlBQVlDLFFBQTFCLEVBQW9Dc0QsU0FBUzVDLElBQVQsR0FBZ0IsR0FBaEIsR0FBc0I0QyxTQUFTbDRCLEtBQVQsR0FBaUIsSUFBdkMsR0FBOEMsSUFBOUMsR0FBcURrNEIsU0FBUzFDLE1BQWxHO0FBQ0Q7O0FBRUQ7QUFDQXlDLGNBQVUzK0IsUUFBVixDQUFtQixNQUFuQixFQUEyQkEsUUFBM0IsQ0FBb0M0K0IsU0FBUzVDLElBQTdDLEVBQW1EMzNCLElBQW5ELENBQXdEO0FBQ3REcUMsYUFBT2s0QixTQUFTbDRCLEtBRHNDO0FBRXREczFCLFlBQU00QyxTQUFTNUMsSUFGdUM7QUFHdERoaEMsWUFBTTRqQyxTQUFTNWpDLElBSHVDO0FBSXREaWhDLGdCQUFVMkMsU0FBUzNDLFFBSm1DO0FBS3REQyxjQUFRMEMsU0FBUzFDLE1BTHFDO0FBTXREQyxjQUFReUMsU0FBU3pDLE1BTnFDO0FBT3REa0QsY0FBUVQsU0FBU1MsTUFQcUM7QUFRdERDLGVBQVNWLFNBQVNVLE9BUm9DO0FBU3REQyxpQkFBV1gsU0FBU1csU0FUa0M7QUFVdERDLGtCQUFZWixTQUFTWTtBQVZpQyxLQUF4RDs7QUFhQWIsZ0JBQVlELFlBQVlDLFNBQVosRUFBdUJDLFFBQXZCLENBQVo7O0FBRUEsV0FBTyxLQUFLcmIsSUFBTCxDQUFVLFlBQVk7QUFDM0IsVUFBSVQsUUFBUTJiLElBQUksSUFBSixDQUFaO0FBQUEsVUFDSXA2QixPQUFPeWUsTUFBTXplLElBQU4sQ0FBVyxNQUFYLENBRFg7QUFBQSxVQUVJbzdCLE9BQU8sS0FGWDs7QUFJQTtBQUNBLFVBQUksQ0FBQ3A3QixJQUFMLEVBQVc7QUFDVHMyQixtQkFBV0MsTUFBWCxHQUFvQixLQUFwQjtBQUNBRCxtQkFBV0UsTUFBWCxHQUFvQixLQUFwQjs7QUFFQS9YLGNBQU16ZSxJQUFOLENBQVcsTUFBWCxFQUFtQnJNLElBQW5COztBQUVBOHFCLGNBQU1zYyxJQUFOLENBQVdSLFNBQVNRLElBQXBCLEVBQTBCLFVBQVVuaEIsS0FBVixFQUFpQjtBQUN6Q0EsZ0JBQU02QixjQUFOOztBQUVBLGNBQUksQ0FBQzJmLElBQUwsRUFBVztBQUNUQSxtQkFBTyxJQUFQO0FBQ0F0QixpQkFBS1MsU0FBU3pDLE1BQWQsRUFBc0Jua0MsSUFBdEI7O0FBRUFpQix1QkFBVyxZQUFZO0FBQ3JCd21DLHFCQUFPLEtBQVA7QUFDRCxhQUZELEVBRUcsR0FGSDtBQUdEO0FBQ0YsU0FYRDtBQVlEO0FBQ0YsS0F6Qk0sQ0FBUDtBQTBCRDs7QUFFRHhlLFNBQU9rZCxJQUFQLEdBQWNBLElBQWQ7QUFDQWxkLFNBQU9oZCxFQUFQLENBQVVrNkIsSUFBVixHQUFpQmdCLE1BQWpCO0FBRUQsQ0E5akJBLEdBQUQ7OztBQ0pBLENBQUMsVUFBU3prQyxDQUFULEVBQVc7QUFBQyxNQUFJZ2xDLENBQUosQ0FBTWhsQyxFQUFFdUosRUFBRixDQUFLMDdCLE1BQUwsR0FBWSxVQUFTL3RCLENBQVQsRUFBVztBQUFDLFFBQUlzYixJQUFFeHlCLEVBQUVsQixNQUFGLENBQVMsRUFBQ29tQyxPQUFNLE1BQVAsRUFBYzdQLE9BQU0sQ0FBQyxDQUFyQixFQUF1QnJwQixPQUFNLEdBQTdCLEVBQWlDa2pCLFFBQU8sQ0FBQyxDQUF6QyxFQUFULEVBQXFEaFksQ0FBckQsQ0FBTjtBQUFBLFFBQThEL1gsSUFBRWEsRUFBRSxJQUFGLENBQWhFO0FBQUEsUUFBd0VtbEMsSUFBRWhtQyxFQUFFcUQsUUFBRixHQUFhMm5CLEtBQWIsRUFBMUUsQ0FBK0ZockIsRUFBRW1HLFFBQUYsQ0FBVyxhQUFYLEVBQTBCLElBQUk4L0IsSUFBRSxTQUFGQSxDQUFFLENBQVNwbEMsQ0FBVCxFQUFXZ2xDLENBQVgsRUFBYTtBQUFDLFVBQUk5dEIsSUFBRTlVLEtBQUtpMkIsS0FBTCxDQUFXNWYsU0FBUzBzQixFQUFFejhCLEdBQUYsQ0FBTSxDQUFOLEVBQVM3SCxLQUFULENBQWUwQixJQUF4QixDQUFYLEtBQTJDLENBQWpELENBQW1ENGlDLEVBQUUvVSxHQUFGLENBQU0sTUFBTixFQUFhbFosSUFBRSxNQUFJbFgsQ0FBTixHQUFRLEdBQXJCLEdBQTBCLGNBQVksT0FBT2dsQyxDQUFuQixJQUFzQnptQyxXQUFXeW1DLENBQVgsRUFBYXhTLEVBQUV4bUIsS0FBZixDQUFoRDtBQUFzRSxLQUE3STtBQUFBLFFBQThJaEgsSUFBRSxTQUFGQSxDQUFFLENBQVNoRixDQUFULEVBQVc7QUFBQ2IsUUFBRTZnQixNQUFGLENBQVNoZ0IsRUFBRW0rQixXQUFGLEVBQVQ7QUFBMEIsS0FBdEw7QUFBQSxRQUF1TDFVLElBQUUsU0FBRkEsQ0FBRSxDQUFTenBCLENBQVQsRUFBVztBQUFDYixRQUFFaXhCLEdBQUYsQ0FBTSxxQkFBTixFQUE0QnB3QixJQUFFLElBQTlCLEdBQW9DbWxDLEVBQUUvVSxHQUFGLENBQU0scUJBQU4sRUFBNEJwd0IsSUFBRSxJQUE5QixDQUFwQztBQUF3RSxLQUE3USxDQUE4USxJQUFHeXBCLEVBQUUrSSxFQUFFeG1CLEtBQUosR0FBV2hNLEVBQUUsUUFBRixFQUFXYixDQUFYLEVBQWM4ckIsSUFBZCxHQUFxQjNsQixRQUFyQixDQUE4QixNQUE5QixDQUFYLEVBQWlEdEYsRUFBRSxTQUFGLEVBQVliLENBQVosRUFBZWttQyxPQUFmLENBQXVCLHFCQUF2QixDQUFqRCxFQUErRjdTLEVBQUU2QyxLQUFGLEtBQVUsQ0FBQyxDQUFYLElBQWNyMUIsRUFBRSxTQUFGLEVBQVliLENBQVosRUFBZTBwQixJQUFmLENBQW9CLFlBQVU7QUFBQyxVQUFJbWMsSUFBRWhsQyxFQUFFLElBQUYsRUFBUW9yQixNQUFSLEdBQWlCOUMsSUFBakIsQ0FBc0IsR0FBdEIsRUFBMkI2QixLQUEzQixHQUFtQzBPLElBQW5DLEVBQU47QUFBQSxVQUFnRDNoQixJQUFFbFgsRUFBRSxNQUFGLEVBQVU2NEIsSUFBVixDQUFlbU0sQ0FBZixDQUFsRCxDQUFvRWhsQyxFQUFFLFdBQUYsRUFBYyxJQUFkLEVBQW9CaXhCLE1BQXBCLENBQTJCL1osQ0FBM0I7QUFBOEIsS0FBakksQ0FBN0csRUFBZ1BzYixFQUFFNkMsS0FBRixJQUFTN0MsRUFBRTBTLEtBQUYsS0FBVSxDQUFDLENBQXZRLEVBQXlRO0FBQUMsVUFBSXRMLElBQUU1NUIsRUFBRSxLQUFGLEVBQVM2NEIsSUFBVCxDQUFjckcsRUFBRTBTLEtBQWhCLEVBQXVCejlCLElBQXZCLENBQTRCLE1BQTVCLEVBQW1DLEdBQW5DLEVBQXdDbkMsUUFBeEMsQ0FBaUQsTUFBakQsQ0FBTixDQUErRHRGLEVBQUUsU0FBRixFQUFZYixDQUFaLEVBQWU4eEIsTUFBZixDQUFzQjJJLENBQXRCO0FBQXlCLEtBQWxXLE1BQXVXNTVCLEVBQUUsU0FBRixFQUFZYixDQUFaLEVBQWUwcEIsSUFBZixDQUFvQixZQUFVO0FBQUMsVUFBSW1jLElBQUVobEMsRUFBRSxJQUFGLEVBQVFvckIsTUFBUixHQUFpQjlDLElBQWpCLENBQXNCLEdBQXRCLEVBQTJCNkIsS0FBM0IsR0FBbUMwTyxJQUFuQyxFQUFOO0FBQUEsVUFBZ0QzaEIsSUFBRWxYLEVBQUUsS0FBRixFQUFTNjRCLElBQVQsQ0FBY21NLENBQWQsRUFBaUJ2OUIsSUFBakIsQ0FBc0IsTUFBdEIsRUFBNkIsR0FBN0IsRUFBa0NuQyxRQUFsQyxDQUEyQyxNQUEzQyxDQUFsRCxDQUFxR3RGLEVBQUUsV0FBRixFQUFjLElBQWQsRUFBb0JpeEIsTUFBcEIsQ0FBMkIvWixDQUEzQjtBQUE4QixLQUFsSyxFQUFvS2xYLEVBQUUsR0FBRixFQUFNYixDQUFOLEVBQVNrSyxFQUFULENBQVksT0FBWixFQUFvQixVQUFTNk4sQ0FBVCxFQUFXO0FBQUMsVUFBRyxFQUFFOHRCLElBQUV4UyxFQUFFeG1CLEtBQUosR0FBVXdDLEtBQUs4MkIsR0FBTCxFQUFaLENBQUgsRUFBMkI7QUFBQ04sWUFBRXgyQixLQUFLODJCLEdBQUwsRUFBRixDQUFhLElBQUlILElBQUVubEMsRUFBRSxJQUFGLENBQU4sQ0FBYyxJQUFJc0ksSUFBSixDQUFTLEtBQUsrakIsSUFBZCxLQUFxQm5WLEVBQUVrTyxjQUFGLEVBQXJCLEVBQXdDK2YsRUFBRWpnQyxRQUFGLENBQVcsTUFBWCxLQUFvQi9GLEVBQUVtcEIsSUFBRixDQUFPLFNBQVAsRUFBa0I5aUIsV0FBbEIsQ0FBOEIsUUFBOUIsR0FBd0MyL0IsRUFBRWphLElBQUYsR0FBUzhCLElBQVQsR0FBZ0IxbkIsUUFBaEIsQ0FBeUIsUUFBekIsQ0FBeEMsRUFBMkU4L0IsRUFBRSxDQUFGLENBQTNFLEVBQWdGNVMsRUFBRXRELE1BQUYsSUFBVWxxQixFQUFFbWdDLEVBQUVqYSxJQUFGLEVBQUYsQ0FBOUcsSUFBMkhpYSxFQUFFamdDLFFBQUYsQ0FBVyxNQUFYLE1BQXFCa2dDLEVBQUUsQ0FBQyxDQUFILEVBQUssWUFBVTtBQUFDam1DLFlBQUVtcEIsSUFBRixDQUFPLFNBQVAsRUFBa0I5aUIsV0FBbEIsQ0FBOEIsUUFBOUIsR0FBd0MyL0IsRUFBRS9aLE1BQUYsR0FBV0EsTUFBWCxHQUFvQm1DLElBQXBCLEdBQTJCaU8sWUFBM0IsQ0FBd0NyOEIsQ0FBeEMsRUFBMEMsSUFBMUMsRUFBZ0RnckIsS0FBaEQsR0FBd0Q3a0IsUUFBeEQsQ0FBaUUsUUFBakUsQ0FBeEM7QUFBbUgsU0FBbkksR0FBcUlrdEIsRUFBRXRELE1BQUYsSUFBVWxxQixFQUFFbWdDLEVBQUUvWixNQUFGLEdBQVdBLE1BQVgsR0FBb0JvUSxZQUFwQixDQUFpQ3I4QixDQUFqQyxFQUFtQyxJQUFuQyxDQUFGLENBQXBLLENBQW5LO0FBQW9YO0FBQUMsS0FBNWMsR0FBOGMsS0FBS29tQyxJQUFMLEdBQVUsVUFBU1AsQ0FBVCxFQUFXOXRCLENBQVgsRUFBYTtBQUFDOHRCLFVBQUVobEMsRUFBRWdsQyxDQUFGLENBQUYsQ0FBTyxJQUFJRyxJQUFFaG1DLEVBQUVtcEIsSUFBRixDQUFPLFNBQVAsQ0FBTixDQUF3QjZjLElBQUVBLEVBQUUvbEMsTUFBRixHQUFTLENBQVQsR0FBVytsQyxFQUFFM0osWUFBRixDQUFlcjhCLENBQWYsRUFBaUIsSUFBakIsRUFBdUJDLE1BQWxDLEdBQXlDLENBQTNDLEVBQTZDRCxFQUFFbXBCLElBQUYsQ0FBTyxJQUFQLEVBQWE5aUIsV0FBYixDQUF5QixRQUF6QixFQUFtQytuQixJQUFuQyxFQUE3QyxDQUF1RixJQUFJcU0sSUFBRW9MLEVBQUV4SixZQUFGLENBQWVyOEIsQ0FBZixFQUFpQixJQUFqQixDQUFOLENBQTZCeTZCLEVBQUU1TSxJQUFGLElBQVNnWSxFQUFFaFksSUFBRixHQUFTMW5CLFFBQVQsQ0FBa0IsUUFBbEIsQ0FBVCxFQUFxQzRSLE1BQUksQ0FBQyxDQUFMLElBQVF1UyxFQUFFLENBQUYsQ0FBN0MsRUFBa0QyYixFQUFFeEwsRUFBRXg2QixNQUFGLEdBQVMrbEMsQ0FBWCxDQUFsRCxFQUFnRTNTLEVBQUV0RCxNQUFGLElBQVVscUIsRUFBRWdnQyxDQUFGLENBQTFFLEVBQStFOXRCLE1BQUksQ0FBQyxDQUFMLElBQVF1UyxFQUFFK0ksRUFBRXhtQixLQUFKLENBQXZGO0FBQWtHLEtBQTN0QixFQUE0dEIsS0FBS3c1QixJQUFMLEdBQVUsVUFBU1IsQ0FBVCxFQUFXO0FBQUNBLFlBQUksQ0FBQyxDQUFMLElBQVF2YixFQUFFLENBQUYsQ0FBUixDQUFhLElBQUl2UyxJQUFFL1gsRUFBRW1wQixJQUFGLENBQU8sU0FBUCxDQUFOO0FBQUEsVUFBd0I2YyxJQUFFanVCLEVBQUVza0IsWUFBRixDQUFlcjhCLENBQWYsRUFBaUIsSUFBakIsRUFBdUJDLE1BQWpELENBQXdEK2xDLElBQUUsQ0FBRixLQUFNQyxFQUFFLENBQUNELENBQUgsRUFBSyxZQUFVO0FBQUNqdUIsVUFBRTFSLFdBQUYsQ0FBYyxRQUFkO0FBQXdCLE9BQXhDLEdBQTBDZ3RCLEVBQUV0RCxNQUFGLElBQVVscUIsRUFBRWhGLEVBQUVrWCxFQUFFc2tCLFlBQUYsQ0FBZXI4QixDQUFmLEVBQWlCLElBQWpCLEVBQXVCdUosR0FBdkIsQ0FBMkJ5OEIsSUFBRSxDQUE3QixDQUFGLEVBQW1DL1osTUFBbkMsRUFBRixDQUExRCxHQUEwRzRaLE1BQUksQ0FBQyxDQUFMLElBQVF2YixFQUFFK0ksRUFBRXhtQixLQUFKLENBQWxIO0FBQTZILEtBQXA3QixFQUFxN0IsS0FBSzRSLE9BQUwsR0FBYSxZQUFVO0FBQUM1ZCxRQUFFLFNBQUYsRUFBWWIsQ0FBWixFQUFldkIsTUFBZixJQUF3Qm9DLEVBQUUsR0FBRixFQUFNYixDQUFOLEVBQVNxRyxXQUFULENBQXFCLE1BQXJCLEVBQTZCZ0UsR0FBN0IsQ0FBaUMsT0FBakMsQ0FBeEIsRUFBa0VySyxFQUFFcUcsV0FBRixDQUFjLGFBQWQsRUFBNkI0cUIsR0FBN0IsQ0FBaUMscUJBQWpDLEVBQXVELEVBQXZELENBQWxFLEVBQTZIK1UsRUFBRS9VLEdBQUYsQ0FBTSxxQkFBTixFQUE0QixFQUE1QixDQUE3SDtBQUE2SixLQUExbUMsQ0FBMm1DLElBQUlxVixJQUFFdG1DLEVBQUVtcEIsSUFBRixDQUFPLFNBQVAsQ0FBTixDQUF3QixPQUFPbWQsRUFBRXJtQyxNQUFGLEdBQVMsQ0FBVCxLQUFhcW1DLEVBQUVqZ0MsV0FBRixDQUFjLFFBQWQsR0FBd0IsS0FBSysvQixJQUFMLENBQVVFLENBQVYsRUFBWSxDQUFDLENBQWIsQ0FBckMsR0FBc0QsSUFBN0Q7QUFBa0UsR0FBL21FO0FBQWduRSxDQUFsb0UsQ0FBbW9FbGYsTUFBbm9FLENBQUQ7Ozs7O0FDQUEsQ0FBQyxZQUFXO0FBQ1YsTUFBSW1mLFdBQUo7QUFBQSxNQUFpQkMsR0FBakI7QUFBQSxNQUFzQkMsZUFBdEI7QUFBQSxNQUF1Q0MsY0FBdkM7QUFBQSxNQUF1REMsY0FBdkQ7QUFBQSxNQUF1RUMsZUFBdkU7QUFBQSxNQUF3RkMsT0FBeEY7QUFBQSxNQUFpRzc4QixNQUFqRztBQUFBLE1BQXlHODhCLGFBQXpHO0FBQUEsTUFBd0hDLElBQXhIO0FBQUEsTUFBOEhDLGdCQUE5SDtBQUFBLE1BQWdKQyxXQUFoSjtBQUFBLE1BQTZKQyxNQUE3SjtBQUFBLE1BQXFLQyxvQkFBcks7QUFBQSxNQUEyTEMsaUJBQTNMO0FBQUEsTUFBOE1yUixTQUE5TTtBQUFBLE1BQXlOc1IsWUFBek47QUFBQSxNQUF1T0MsR0FBdk87QUFBQSxNQUE0T0MsZUFBNU87QUFBQSxNQUE2UGhvQyxvQkFBN1A7QUFBQSxNQUFtUmlvQyxjQUFuUjtBQUFBLE1BQW1TN25DLE9BQW5TO0FBQUEsTUFBMlM4bkMsWUFBM1M7QUFBQSxNQUF5VEMsVUFBelQ7QUFBQSxNQUFxVUMsWUFBclU7QUFBQSxNQUFtVkMsZUFBblY7QUFBQSxNQUFvV0MsV0FBcFc7QUFBQSxNQUFpWC9SLElBQWpYO0FBQUEsTUFBdVhxUSxHQUF2WDtBQUFBLE1BQTRYNzZCLE9BQTVYO0FBQUEsTUFBcVl2TSxxQkFBclk7QUFBQSxNQUE0Wm1ELE1BQTVaO0FBQUEsTUFBb2E0bEMsWUFBcGE7QUFBQSxNQUFrYkMsT0FBbGI7QUFBQSxNQUEyYkMsZUFBM2I7QUFBQSxNQUE0Y0MsV0FBNWM7QUFBQSxNQUF5ZGpELE1BQXpkO0FBQUEsTUFBaWVrRCxPQUFqZTtBQUFBLE1BQTBlQyxTQUExZTtBQUFBLE1BQXFmQyxVQUFyZjtBQUFBLE1BQWlnQkMsZUFBamdCO0FBQUEsTUFBa2hCQyxlQUFsaEI7QUFBQSxNQUFtaUJDLEVBQW5pQjtBQUFBLE1BQXVpQkMsVUFBdmlCO0FBQUEsTUFBbWpCQyxJQUFuakI7QUFBQSxNQUF5akJDLFVBQXpqQjtBQUFBLE1BQXFrQkMsSUFBcmtCO0FBQUEsTUFBMmtCQyxLQUEza0I7QUFBQSxNQUFrbEJDLGFBQWxsQjtBQUFBLE1BQ0VDLFVBQVUsR0FBR25nQyxLQURmO0FBQUEsTUFFRW9nQyxZQUFZLEdBQUcxcUMsY0FGakI7QUFBQSxNQUdFMnFDLFlBQVksU0FBWkEsU0FBWSxDQUFTQyxLQUFULEVBQWdCaGQsTUFBaEIsRUFBd0I7QUFBRSxTQUFLLElBQUl2ckIsR0FBVCxJQUFnQnVyQixNQUFoQixFQUF3QjtBQUFFLFVBQUk4YyxVQUFVenFDLElBQVYsQ0FBZTJ0QixNQUFmLEVBQXVCdnJCLEdBQXZCLENBQUosRUFBaUN1b0MsTUFBTXZvQyxHQUFOLElBQWF1ckIsT0FBT3ZyQixHQUFQLENBQWI7QUFBMkIsS0FBQyxTQUFTd29DLElBQVQsR0FBZ0I7QUFBRSxXQUFLeFMsV0FBTCxHQUFtQnVTLEtBQW5CO0FBQTJCLEtBQUNDLEtBQUs5cUMsU0FBTCxHQUFpQjZ0QixPQUFPN3RCLFNBQXhCLENBQW1DNnFDLE1BQU03cUMsU0FBTixHQUFrQixJQUFJOHFDLElBQUosRUFBbEIsQ0FBOEJELE1BQU1FLFNBQU4sR0FBa0JsZCxPQUFPN3RCLFNBQXpCLENBQW9DLE9BQU82cUMsS0FBUDtBQUFlLEdBSGpTO0FBQUEsTUFJRUcsWUFBWSxHQUFHL29DLE9BQUgsSUFBYyxVQUFTdUcsSUFBVCxFQUFlO0FBQUUsU0FBSyxJQUFJNUcsSUFBSSxDQUFSLEVBQVc2RixJQUFJLEtBQUs1RixNQUF6QixFQUFpQ0QsSUFBSTZGLENBQXJDLEVBQXdDN0YsR0FBeEMsRUFBNkM7QUFBRSxVQUFJQSxLQUFLLElBQUwsSUFBYSxLQUFLQSxDQUFMLE1BQVk0RyxJQUE3QixFQUFtQyxPQUFPNUcsQ0FBUDtBQUFXLEtBQUMsT0FBTyxDQUFDLENBQVI7QUFBWSxHQUp2Sjs7QUFNQXduQyxtQkFBaUI7QUFDZjZCLGlCQUFhLEdBREU7QUFFZkMsaUJBQWEsR0FGRTtBQUdmQyxhQUFTLEdBSE07QUFJZkMsZUFBVyxHQUpJO0FBS2ZDLHlCQUFxQixFQUxOO0FBTWZDLGdCQUFZLElBTkc7QUFPZkMscUJBQWlCLElBUEY7QUFRZkMsd0JBQW9CLElBUkw7QUFTZkMsMkJBQXVCLEdBVFI7QUFVZi9wQyxZQUFRLE1BVk87QUFXZm8xQixjQUFVO0FBQ1I0VSxxQkFBZSxHQURQO0FBRVIzRSxpQkFBVyxDQUFDLE1BQUQ7QUFGSCxLQVhLO0FBZWY0RSxjQUFVO0FBQ1JDLGtCQUFZLEVBREo7QUFFUkMsbUJBQWEsQ0FGTDtBQUdSQyxvQkFBYztBQUhOLEtBZks7QUFvQmZDLFVBQU07QUFDSkMsb0JBQWMsQ0FBQyxLQUFELENBRFY7QUFFSkMsdUJBQWlCLElBRmI7QUFHSkMsa0JBQVk7QUFIUjtBQXBCUyxHQUFqQjs7QUEyQkFuRSxRQUFNLGVBQVc7QUFDZixRQUFJd0MsSUFBSjtBQUNBLFdBQU8sQ0FBQ0EsT0FBTyxPQUFPNEIsV0FBUCxLQUF1QixXQUF2QixJQUFzQ0EsZ0JBQWdCLElBQXRELEdBQTZELE9BQU9BLFlBQVlwRSxHQUFuQixLQUEyQixVQUEzQixHQUF3Q29FLFlBQVlwRSxHQUFaLEVBQXhDLEdBQTRELEtBQUssQ0FBOUgsR0FBa0ksS0FBSyxDQUEvSSxLQUFxSixJQUFySixHQUE0SndDLElBQTVKLEdBQW1LLENBQUUsSUFBSXQ1QixJQUFKLEVBQTVLO0FBQ0QsR0FIRDs7QUFLQXRRLDBCQUF3QkYsT0FBT0UscUJBQVAsSUFBZ0NGLE9BQU9JLHdCQUF2QyxJQUFtRUosT0FBT0csMkJBQTFFLElBQXlHSCxPQUFPSyx1QkFBeEk7O0FBRUFLLHlCQUF1QlYsT0FBT1Usb0JBQVAsSUFBK0JWLE9BQU9XLHVCQUE3RDs7QUFFQSxNQUFJVCx5QkFBeUIsSUFBN0IsRUFBbUM7QUFDakNBLDRCQUF3QiwrQkFBU3FMLEVBQVQsRUFBYTtBQUNuQyxhQUFPaEwsV0FBV2dMLEVBQVgsRUFBZSxFQUFmLENBQVA7QUFDRCxLQUZEO0FBR0E3SywyQkFBdUIsOEJBQVNFLEVBQVQsRUFBYTtBQUNsQyxhQUFPQyxhQUFhRCxFQUFiLENBQVA7QUFDRCxLQUZEO0FBR0Q7O0FBRURxb0MsaUJBQWUsc0JBQVMxOUIsRUFBVCxFQUFhO0FBQzFCLFFBQUlvZ0MsSUFBSixFQUFVMS9CLEtBQVY7QUFDQTAvQixXQUFPckUsS0FBUDtBQUNBcjdCLFlBQU8sZ0JBQVc7QUFDaEIsVUFBSTIvQixJQUFKO0FBQ0FBLGFBQU90RSxRQUFRcUUsSUFBZjtBQUNBLFVBQUlDLFFBQVEsRUFBWixFQUFnQjtBQUNkRCxlQUFPckUsS0FBUDtBQUNBLGVBQU8vN0IsR0FBR3FnQyxJQUFILEVBQVMsWUFBVztBQUN6QixpQkFBTzFyQyxzQkFBc0IrTCxLQUF0QixDQUFQO0FBQ0QsU0FGTSxDQUFQO0FBR0QsT0FMRCxNQUtPO0FBQ0wsZUFBTzFMLFdBQVcwTCxLQUFYLEVBQWlCLEtBQUsyL0IsSUFBdEIsQ0FBUDtBQUNEO0FBQ0YsS0FYRDtBQVlBLFdBQU8zL0IsT0FBUDtBQUNELEdBaEJEOztBQWtCQTVJLFdBQVMsa0JBQVc7QUFDbEIsUUFBSXdvQyxJQUFKLEVBQVVocUMsR0FBVixFQUFlZCxHQUFmO0FBQ0FBLFVBQU1HLFVBQVUsQ0FBVixDQUFOLEVBQW9CVyxNQUFNWCxVQUFVLENBQVYsQ0FBMUIsRUFBd0MycUMsT0FBTyxLQUFLM3FDLFVBQVVFLE1BQWYsR0FBd0I2b0MsUUFBUXhxQyxJQUFSLENBQWF5QixTQUFiLEVBQXdCLENBQXhCLENBQXhCLEdBQXFELEVBQXBHO0FBQ0EsUUFBSSxPQUFPSCxJQUFJYyxHQUFKLENBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDbEMsYUFBT2QsSUFBSWMsR0FBSixFQUFTa1ksS0FBVCxDQUFlaFosR0FBZixFQUFvQjhxQyxJQUFwQixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTzlxQyxJQUFJYyxHQUFKLENBQVA7QUFDRDtBQUNGLEdBUkQ7O0FBVUFmLFlBQVMsa0JBQVc7QUFDbEIsUUFBSWUsR0FBSixFQUFTaXFDLEdBQVQsRUFBYzNGLE1BQWQsRUFBc0JrRCxPQUF0QixFQUErQjdsQyxHQUEvQixFQUFvQ2ttQyxFQUFwQyxFQUF3Q0UsSUFBeEM7QUFDQWtDLFVBQU01cUMsVUFBVSxDQUFWLENBQU4sRUFBb0Jtb0MsVUFBVSxLQUFLbm9DLFVBQVVFLE1BQWYsR0FBd0I2b0MsUUFBUXhxQyxJQUFSLENBQWF5QixTQUFiLEVBQXdCLENBQXhCLENBQXhCLEdBQXFELEVBQW5GO0FBQ0EsU0FBS3dvQyxLQUFLLENBQUwsRUFBUUUsT0FBT1AsUUFBUWpvQyxNQUE1QixFQUFvQ3NvQyxLQUFLRSxJQUF6QyxFQUErQ0YsSUFBL0MsRUFBcUQ7QUFDbkR2RCxlQUFTa0QsUUFBUUssRUFBUixDQUFUO0FBQ0EsVUFBSXZELE1BQUosRUFBWTtBQUNWLGFBQUt0a0MsR0FBTCxJQUFZc2tDLE1BQVosRUFBb0I7QUFDbEIsY0FBSSxDQUFDK0QsVUFBVXpxQyxJQUFWLENBQWUwbUMsTUFBZixFQUF1QnRrQyxHQUF2QixDQUFMLEVBQWtDO0FBQ2xDMkIsZ0JBQU0yaUMsT0FBT3RrQyxHQUFQLENBQU47QUFDQSxjQUFLaXFDLElBQUlqcUMsR0FBSixLQUFZLElBQWIsSUFBc0IsUUFBT2lxQyxJQUFJanFDLEdBQUosQ0FBUCxNQUFvQixRQUExQyxJQUF1RDJCLE9BQU8sSUFBOUQsSUFBdUUsUUFBT0EsR0FBUCx5Q0FBT0EsR0FBUCxPQUFlLFFBQTFGLEVBQW9HO0FBQ2xHMUMsb0JBQU9nckMsSUFBSWpxQyxHQUFKLENBQVAsRUFBaUIyQixHQUFqQjtBQUNELFdBRkQsTUFFTztBQUNMc29DLGdCQUFJanFDLEdBQUosSUFBVzJCLEdBQVg7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNELFdBQU9zb0MsR0FBUDtBQUNELEdBbEJEOztBQW9CQXRELGlCQUFlLHNCQUFTM2hDLEdBQVQsRUFBYztBQUMzQixRQUFJOUMsS0FBSixFQUFXZ29DLEdBQVgsRUFBZ0JDLENBQWhCLEVBQW1CdEMsRUFBbkIsRUFBdUJFLElBQXZCO0FBQ0FtQyxVQUFNaG9DLFFBQVEsQ0FBZDtBQUNBLFNBQUsybEMsS0FBSyxDQUFMLEVBQVFFLE9BQU8vaUMsSUFBSXpGLE1BQXhCLEVBQWdDc29DLEtBQUtFLElBQXJDLEVBQTJDRixJQUEzQyxFQUFpRDtBQUMvQ3NDLFVBQUlubEMsSUFBSTZpQyxFQUFKLENBQUo7QUFDQXFDLGFBQU8zbkMsS0FBS0MsR0FBTCxDQUFTMm5DLENBQVQsQ0FBUDtBQUNBam9DO0FBQ0Q7QUFDRCxXQUFPZ29DLE1BQU1ob0MsS0FBYjtBQUNELEdBVEQ7O0FBV0E4a0MsZUFBYSxvQkFBU2huQyxHQUFULEVBQWNvcUMsSUFBZCxFQUFvQjtBQUMvQixRQUFJdGdDLElBQUosRUFBVTNKLENBQVYsRUFBYW1GLEVBQWI7QUFDQSxRQUFJdEYsT0FBTyxJQUFYLEVBQWlCO0FBQ2ZBLFlBQU0sU0FBTjtBQUNEO0FBQ0QsUUFBSW9xQyxRQUFRLElBQVosRUFBa0I7QUFDaEJBLGFBQU8sSUFBUDtBQUNEO0FBQ0Q5a0MsU0FBSzlFLFNBQVNnRCxhQUFULENBQXVCLGdCQUFnQnhELEdBQWhCLEdBQXNCLEdBQTdDLENBQUw7QUFDQSxRQUFJLENBQUNzRixFQUFMLEVBQVM7QUFDUDtBQUNEO0FBQ0R3RSxXQUFPeEUsR0FBR1UsWUFBSCxDQUFnQixlQUFlaEcsR0FBL0IsQ0FBUDtBQUNBLFFBQUksQ0FBQ29xQyxJQUFMLEVBQVc7QUFDVCxhQUFPdGdDLElBQVA7QUFDRDtBQUNELFFBQUk7QUFDRixhQUFPbEssS0FBS0MsS0FBTCxDQUFXaUssSUFBWCxDQUFQO0FBQ0QsS0FGRCxDQUVFLE9BQU91Z0MsTUFBUCxFQUFlO0FBQ2ZscUMsVUFBSWtxQyxNQUFKO0FBQ0EsYUFBTyxPQUFPMTZCLE9BQVAsS0FBbUIsV0FBbkIsSUFBa0NBLFlBQVksSUFBOUMsR0FBcURBLFFBQVFrMEIsS0FBUixDQUFjLG1DQUFkLEVBQW1EMWpDLENBQW5ELENBQXJELEdBQTZHLEtBQUssQ0FBekg7QUFDRDtBQUNGLEdBdEJEOztBQXdCQWdtQyxZQUFXLFlBQVc7QUFDcEIsYUFBU0EsT0FBVCxHQUFtQixDQUFFOztBQUVyQkEsWUFBUXpvQyxTQUFSLENBQWtCOEwsRUFBbEIsR0FBdUIsVUFBU2thLEtBQVQsRUFBZ0J1RSxPQUFoQixFQUF5QnFpQixHQUF6QixFQUE4QkMsSUFBOUIsRUFBb0M7QUFDekQsVUFBSUMsS0FBSjtBQUNBLFVBQUlELFFBQVEsSUFBWixFQUFrQjtBQUNoQkEsZUFBTyxLQUFQO0FBQ0Q7QUFDRCxVQUFJLEtBQUtFLFFBQUwsSUFBaUIsSUFBckIsRUFBMkI7QUFDekIsYUFBS0EsUUFBTCxHQUFnQixFQUFoQjtBQUNEO0FBQ0QsVUFBSSxDQUFDRCxRQUFRLEtBQUtDLFFBQWQsRUFBd0IvbUIsS0FBeEIsS0FBa0MsSUFBdEMsRUFBNEM7QUFDMUM4bUIsY0FBTTltQixLQUFOLElBQWUsRUFBZjtBQUNEO0FBQ0QsYUFBTyxLQUFLK21CLFFBQUwsQ0FBYy9tQixLQUFkLEVBQXFCN2xCLElBQXJCLENBQTBCO0FBQy9Cb3FCLGlCQUFTQSxPQURzQjtBQUUvQnFpQixhQUFLQSxHQUYwQjtBQUcvQkMsY0FBTUE7QUFIeUIsT0FBMUIsQ0FBUDtBQUtELEtBaEJEOztBQWtCQXBFLFlBQVF6b0MsU0FBUixDQUFrQjZzQyxJQUFsQixHQUF5QixVQUFTN21CLEtBQVQsRUFBZ0J1RSxPQUFoQixFQUF5QnFpQixHQUF6QixFQUE4QjtBQUNyRCxhQUFPLEtBQUs5Z0MsRUFBTCxDQUFRa2EsS0FBUixFQUFldUUsT0FBZixFQUF3QnFpQixHQUF4QixFQUE2QixJQUE3QixDQUFQO0FBQ0QsS0FGRDs7QUFJQW5FLFlBQVF6b0MsU0FBUixDQUFrQmlNLEdBQWxCLEdBQXdCLFVBQVMrWixLQUFULEVBQWdCdUUsT0FBaEIsRUFBeUI7QUFDL0MsVUFBSTNvQixDQUFKLEVBQU8yb0MsSUFBUCxFQUFheUMsUUFBYjtBQUNBLFVBQUksQ0FBQyxDQUFDekMsT0FBTyxLQUFLd0MsUUFBYixLQUEwQixJQUExQixHQUFpQ3hDLEtBQUt2a0IsS0FBTCxDQUFqQyxHQUErQyxLQUFLLENBQXJELEtBQTJELElBQS9ELEVBQXFFO0FBQ25FO0FBQ0Q7QUFDRCxVQUFJdUUsV0FBVyxJQUFmLEVBQXFCO0FBQ25CLGVBQU8sT0FBTyxLQUFLd2lCLFFBQUwsQ0FBYy9tQixLQUFkLENBQWQ7QUFDRCxPQUZELE1BRU87QUFDTHBrQixZQUFJLENBQUo7QUFDQW9yQyxtQkFBVyxFQUFYO0FBQ0EsZUFBT3ByQyxJQUFJLEtBQUttckMsUUFBTCxDQUFjL21CLEtBQWQsRUFBcUJua0IsTUFBaEMsRUFBd0M7QUFDdEMsY0FBSSxLQUFLa3JDLFFBQUwsQ0FBYy9tQixLQUFkLEVBQXFCcGtCLENBQXJCLEVBQXdCMm9CLE9BQXhCLEtBQW9DQSxPQUF4QyxFQUFpRDtBQUMvQ3lpQixxQkFBUzdzQyxJQUFULENBQWMsS0FBSzRzQyxRQUFMLENBQWMvbUIsS0FBZCxFQUFxQjlaLE1BQXJCLENBQTRCdEssQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBZDtBQUNELFdBRkQsTUFFTztBQUNMb3JDLHFCQUFTN3NDLElBQVQsQ0FBY3lCLEdBQWQ7QUFDRDtBQUNGO0FBQ0QsZUFBT29yQyxRQUFQO0FBQ0Q7QUFDRixLQW5CRDs7QUFxQkF2RSxZQUFRem9DLFNBQVIsQ0FBa0I4cEIsT0FBbEIsR0FBNEIsWUFBVztBQUNyQyxVQUFJd2lCLElBQUosRUFBVU0sR0FBVixFQUFlNW1CLEtBQWYsRUFBc0J1RSxPQUF0QixFQUErQjNvQixDQUEvQixFQUFrQ2lyQyxJQUFsQyxFQUF3Q3RDLElBQXhDLEVBQThDQyxLQUE5QyxFQUFxRHdDLFFBQXJEO0FBQ0FobkIsY0FBUXJrQixVQUFVLENBQVYsQ0FBUixFQUFzQjJxQyxPQUFPLEtBQUszcUMsVUFBVUUsTUFBZixHQUF3QjZvQyxRQUFReHFDLElBQVIsQ0FBYXlCLFNBQWIsRUFBd0IsQ0FBeEIsQ0FBeEIsR0FBcUQsRUFBbEY7QUFDQSxVQUFJLENBQUM0b0MsT0FBTyxLQUFLd0MsUUFBYixLQUEwQixJQUExQixHQUFpQ3hDLEtBQUt2a0IsS0FBTCxDQUFqQyxHQUErQyxLQUFLLENBQXhELEVBQTJEO0FBQ3pEcGtCLFlBQUksQ0FBSjtBQUNBb3JDLG1CQUFXLEVBQVg7QUFDQSxlQUFPcHJDLElBQUksS0FBS21yQyxRQUFMLENBQWMvbUIsS0FBZCxFQUFxQm5rQixNQUFoQyxFQUF3QztBQUN0QzJvQyxrQkFBUSxLQUFLdUMsUUFBTCxDQUFjL21CLEtBQWQsRUFBcUJwa0IsQ0FBckIsQ0FBUixFQUFpQzJvQixVQUFVaWdCLE1BQU1qZ0IsT0FBakQsRUFBMERxaUIsTUFBTXBDLE1BQU1vQyxHQUF0RSxFQUEyRUMsT0FBT3JDLE1BQU1xQyxJQUF4RjtBQUNBdGlCLGtCQUFRL1AsS0FBUixDQUFjb3lCLE9BQU8sSUFBUCxHQUFjQSxHQUFkLEdBQW9CLElBQWxDLEVBQXdDTixJQUF4QztBQUNBLGNBQUlPLElBQUosRUFBVTtBQUNSRyxxQkFBUzdzQyxJQUFULENBQWMsS0FBSzRzQyxRQUFMLENBQWMvbUIsS0FBZCxFQUFxQjlaLE1BQXJCLENBQTRCdEssQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBZDtBQUNELFdBRkQsTUFFTztBQUNMb3JDLHFCQUFTN3NDLElBQVQsQ0FBY3lCLEdBQWQ7QUFDRDtBQUNGO0FBQ0QsZUFBT29yQyxRQUFQO0FBQ0Q7QUFDRixLQWpCRDs7QUFtQkEsV0FBT3ZFLE9BQVA7QUFFRCxHQW5FUyxFQUFWOztBQXFFQUUsU0FBT2xvQyxPQUFPa29DLElBQVAsSUFBZSxFQUF0Qjs7QUFFQWxvQyxTQUFPa29DLElBQVAsR0FBY0EsSUFBZDs7QUFFQXBuQyxVQUFPb25DLElBQVAsRUFBYUYsUUFBUXpvQyxTQUFyQjs7QUFFQWtOLFlBQVV5N0IsS0FBS3o3QixPQUFMLEdBQWUzTCxRQUFPLEVBQVAsRUFBVzZuQyxjQUFYLEVBQTJCM29DLE9BQU93c0MsV0FBbEMsRUFBK0MzRCxZQUEvQyxDQUF6Qjs7QUFFQWlCLFNBQU8sQ0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixVQUFyQixFQUFpQyxVQUFqQyxDQUFQO0FBQ0EsT0FBS0osS0FBSyxDQUFMLEVBQVFFLE9BQU9FLEtBQUsxb0MsTUFBekIsRUFBaUNzb0MsS0FBS0UsSUFBdEMsRUFBNENGLElBQTVDLEVBQWtEO0FBQ2hEdkQsYUFBUzJELEtBQUtKLEVBQUwsQ0FBVDtBQUNBLFFBQUlqOUIsUUFBUTA1QixNQUFSLE1BQW9CLElBQXhCLEVBQThCO0FBQzVCMTVCLGNBQVEwNUIsTUFBUixJQUFrQndDLGVBQWV4QyxNQUFmLENBQWxCO0FBQ0Q7QUFDRjs7QUFFRDhCLGtCQUFpQixVQUFTd0UsTUFBVCxFQUFpQjtBQUNoQ3RDLGNBQVVsQyxhQUFWLEVBQXlCd0UsTUFBekI7O0FBRUEsYUFBU3hFLGFBQVQsR0FBeUI7QUFDdkI4QixjQUFROUIsY0FBY3FDLFNBQWQsQ0FBd0J6UyxXQUF4QixDQUFvQzlkLEtBQXBDLENBQTBDLElBQTFDLEVBQWdEN1ksU0FBaEQsQ0FBUjtBQUNBLGFBQU82b0MsS0FBUDtBQUNEOztBQUVELFdBQU85QixhQUFQO0FBRUQsR0FWZSxDQVViemYsS0FWYSxDQUFoQjs7QUFZQW1mLFFBQU8sWUFBVztBQUNoQixhQUFTQSxHQUFULEdBQWU7QUFDYixXQUFLK0UsUUFBTCxHQUFnQixDQUFoQjtBQUNEOztBQUVEL0UsUUFBSXBvQyxTQUFKLENBQWNvdEMsVUFBZCxHQUEyQixZQUFXO0FBQ3BDLFVBQUlDLGFBQUo7QUFDQSxVQUFJLEtBQUt6bEMsRUFBTCxJQUFXLElBQWYsRUFBcUI7QUFDbkJ5bEMsd0JBQWdCdnFDLFNBQVNnRCxhQUFULENBQXVCb0gsUUFBUXhMLE1BQS9CLENBQWhCO0FBQ0EsWUFBSSxDQUFDMnJDLGFBQUwsRUFBb0I7QUFDbEIsZ0JBQU0sSUFBSTNFLGFBQUosRUFBTjtBQUNEO0FBQ0QsYUFBSzlnQyxFQUFMLEdBQVU5RSxTQUFTRSxhQUFULENBQXVCLEtBQXZCLENBQVY7QUFDQSxhQUFLNEUsRUFBTCxDQUFRakQsU0FBUixHQUFvQixrQkFBcEI7QUFDQTdCLGlCQUFTQyxJQUFULENBQWM0QixTQUFkLEdBQTBCN0IsU0FBU0MsSUFBVCxDQUFjNEIsU0FBZCxDQUF3QlAsT0FBeEIsQ0FBZ0MsWUFBaEMsRUFBOEMsRUFBOUMsQ0FBMUI7QUFDQXRCLGlCQUFTQyxJQUFULENBQWM0QixTQUFkLElBQTJCLGVBQTNCO0FBQ0EsYUFBS2lELEVBQUwsQ0FBUWhELFNBQVIsR0FBb0IsbUhBQXBCO0FBQ0EsWUFBSXlvQyxjQUFjdHdCLFVBQWQsSUFBNEIsSUFBaEMsRUFBc0M7QUFDcENzd0Isd0JBQWM1aUMsWUFBZCxDQUEyQixLQUFLN0MsRUFBaEMsRUFBb0N5bEMsY0FBY3R3QixVQUFsRDtBQUNELFNBRkQsTUFFTztBQUNMc3dCLHdCQUFjNXBDLFdBQWQsQ0FBMEIsS0FBS21FLEVBQS9CO0FBQ0Q7QUFDRjtBQUNELGFBQU8sS0FBS0EsRUFBWjtBQUNELEtBbkJEOztBQXFCQXdnQyxRQUFJcG9DLFNBQUosQ0FBY3N0QyxNQUFkLEdBQXVCLFlBQVc7QUFDaEMsVUFBSTFsQyxFQUFKO0FBQ0FBLFdBQUssS0FBS3dsQyxVQUFMLEVBQUw7QUFDQXhsQyxTQUFHakQsU0FBSCxHQUFlaUQsR0FBR2pELFNBQUgsQ0FBYVAsT0FBYixDQUFxQixhQUFyQixFQUFvQyxFQUFwQyxDQUFmO0FBQ0F3RCxTQUFHakQsU0FBSCxJQUFnQixnQkFBaEI7QUFDQTdCLGVBQVNDLElBQVQsQ0FBYzRCLFNBQWQsR0FBMEI3QixTQUFTQyxJQUFULENBQWM0QixTQUFkLENBQXdCUCxPQUF4QixDQUFnQyxjQUFoQyxFQUFnRCxFQUFoRCxDQUExQjtBQUNBLGFBQU90QixTQUFTQyxJQUFULENBQWM0QixTQUFkLElBQTJCLFlBQWxDO0FBQ0QsS0FQRDs7QUFTQXlqQyxRQUFJcG9DLFNBQUosQ0FBY3V0QyxNQUFkLEdBQXVCLFVBQVNDLElBQVQsRUFBZTtBQUNwQyxXQUFLTCxRQUFMLEdBQWdCSyxJQUFoQjtBQUNBLGFBQU8sS0FBSzNuQixNQUFMLEVBQVA7QUFDRCxLQUhEOztBQUtBdWlCLFFBQUlwb0MsU0FBSixDQUFjcWdCLE9BQWQsR0FBd0IsWUFBVztBQUNqQyxVQUFJO0FBQ0YsYUFBSytzQixVQUFMLEdBQWtCOXNDLFVBQWxCLENBQTZCQyxXQUE3QixDQUF5QyxLQUFLNnNDLFVBQUwsRUFBekM7QUFDRCxPQUZELENBRUUsT0FBT1QsTUFBUCxFQUFlO0FBQ2ZqRSx3QkFBZ0JpRSxNQUFoQjtBQUNEO0FBQ0QsYUFBTyxLQUFLL2tDLEVBQUwsR0FBVSxLQUFLLENBQXRCO0FBQ0QsS0FQRDs7QUFTQXdnQyxRQUFJcG9DLFNBQUosQ0FBYzZsQixNQUFkLEdBQXVCLFlBQVc7QUFDaEMsVUFBSWplLEVBQUosRUFBUXRGLEdBQVIsRUFBYW1yQyxXQUFiLEVBQTBCQyxTQUExQixFQUFxQ0MsRUFBckMsRUFBeUNDLEtBQXpDLEVBQWdEQyxLQUFoRDtBQUNBLFVBQUkvcUMsU0FBU2dELGFBQVQsQ0FBdUJvSCxRQUFReEwsTUFBL0IsS0FBMEMsSUFBOUMsRUFBb0Q7QUFDbEQsZUFBTyxLQUFQO0FBQ0Q7QUFDRGtHLFdBQUssS0FBS3dsQyxVQUFMLEVBQUw7QUFDQU0sa0JBQVksaUJBQWlCLEtBQUtQLFFBQXRCLEdBQWlDLFVBQTdDO0FBQ0FVLGNBQVEsQ0FBQyxpQkFBRCxFQUFvQixhQUFwQixFQUFtQyxXQUFuQyxDQUFSO0FBQ0EsV0FBS0YsS0FBSyxDQUFMLEVBQVFDLFFBQVFDLE1BQU1oc0MsTUFBM0IsRUFBbUM4ckMsS0FBS0MsS0FBeEMsRUFBK0NELElBQS9DLEVBQXFEO0FBQ25EcnJDLGNBQU11ckMsTUFBTUYsRUFBTixDQUFOO0FBQ0EvbEMsV0FBRzNDLFFBQUgsQ0FBWSxDQUFaLEVBQWUzQixLQUFmLENBQXFCaEIsR0FBckIsSUFBNEJvckMsU0FBNUI7QUFDRDtBQUNELFVBQUksQ0FBQyxLQUFLSSxvQkFBTixJQUE4QixLQUFLQSxvQkFBTCxHQUE0QixNQUFNLEtBQUtYLFFBQXZDLEdBQWtELENBQXBGLEVBQXVGO0FBQ3JGdmxDLFdBQUczQyxRQUFILENBQVksQ0FBWixFQUFlWSxZQUFmLENBQTRCLG9CQUE1QixFQUFrRCxNQUFNLEtBQUtzbkMsUUFBTCxHQUFnQixDQUF0QixJQUEyQixHQUE3RTtBQUNBLFlBQUksS0FBS0EsUUFBTCxJQUFpQixHQUFyQixFQUEwQjtBQUN4Qk0sd0JBQWMsSUFBZDtBQUNELFNBRkQsTUFFTztBQUNMQSx3QkFBYyxLQUFLTixRQUFMLEdBQWdCLEVBQWhCLEdBQXFCLEdBQXJCLEdBQTJCLEVBQXpDO0FBQ0FNLHlCQUFlLEtBQUtOLFFBQUwsR0FBZ0IsQ0FBL0I7QUFDRDtBQUNEdmxDLFdBQUczQyxRQUFILENBQVksQ0FBWixFQUFlWSxZQUFmLENBQTRCLGVBQTVCLEVBQTZDLEtBQUs0bkMsV0FBbEQ7QUFDRDtBQUNELGFBQU8sS0FBS0ssb0JBQUwsR0FBNEIsS0FBS1gsUUFBeEM7QUFDRCxLQXZCRDs7QUF5QkEvRSxRQUFJcG9DLFNBQUosQ0FBYyt0QyxJQUFkLEdBQXFCLFlBQVc7QUFDOUIsYUFBTyxLQUFLWixRQUFMLElBQWlCLEdBQXhCO0FBQ0QsS0FGRDs7QUFJQSxXQUFPL0UsR0FBUDtBQUVELEdBaEZLLEVBQU47O0FBa0ZBeDhCLFdBQVUsWUFBVztBQUNuQixhQUFTQSxNQUFULEdBQWtCO0FBQ2hCLFdBQUttaEMsUUFBTCxHQUFnQixFQUFoQjtBQUNEOztBQUVEbmhDLFdBQU81TCxTQUFQLENBQWlCOHBCLE9BQWpCLEdBQTJCLFVBQVMvcEIsSUFBVCxFQUFla0UsR0FBZixFQUFvQjtBQUM3QyxVQUFJK3BDLE9BQUosRUFBYUwsRUFBYixFQUFpQkMsS0FBakIsRUFBd0JDLEtBQXhCLEVBQStCYixRQUEvQjtBQUNBLFVBQUksS0FBS0QsUUFBTCxDQUFjaHRDLElBQWQsS0FBdUIsSUFBM0IsRUFBaUM7QUFDL0I4dEMsZ0JBQVEsS0FBS2QsUUFBTCxDQUFjaHRDLElBQWQsQ0FBUjtBQUNBaXRDLG1CQUFXLEVBQVg7QUFDQSxhQUFLVyxLQUFLLENBQUwsRUFBUUMsUUFBUUMsTUFBTWhzQyxNQUEzQixFQUFtQzhyQyxLQUFLQyxLQUF4QyxFQUErQ0QsSUFBL0MsRUFBcUQ7QUFDbkRLLG9CQUFVSCxNQUFNRixFQUFOLENBQVY7QUFDQVgsbUJBQVM3c0MsSUFBVCxDQUFjNnRDLFFBQVE5dEMsSUFBUixDQUFhLElBQWIsRUFBbUIrRCxHQUFuQixDQUFkO0FBQ0Q7QUFDRCxlQUFPK29DLFFBQVA7QUFDRDtBQUNGLEtBWEQ7O0FBYUFwaEMsV0FBTzVMLFNBQVAsQ0FBaUI4TCxFQUFqQixHQUFzQixVQUFTL0wsSUFBVCxFQUFlaU0sRUFBZixFQUFtQjtBQUN2QyxVQUFJOGdDLEtBQUo7QUFDQSxVQUFJLENBQUNBLFFBQVEsS0FBS0MsUUFBZCxFQUF3Qmh0QyxJQUF4QixLQUFpQyxJQUFyQyxFQUEyQztBQUN6QytzQyxjQUFNL3NDLElBQU4sSUFBYyxFQUFkO0FBQ0Q7QUFDRCxhQUFPLEtBQUtndEMsUUFBTCxDQUFjaHRDLElBQWQsRUFBb0JJLElBQXBCLENBQXlCNkwsRUFBekIsQ0FBUDtBQUNELEtBTkQ7O0FBUUEsV0FBT0osTUFBUDtBQUVELEdBNUJRLEVBQVQ7O0FBOEJBcytCLG9CQUFrQnpwQyxPQUFPd3RDLGNBQXpCOztBQUVBaEUsb0JBQWtCeHBDLE9BQU95dEMsY0FBekI7O0FBRUFsRSxlQUFhdnBDLE9BQU8wdEMsU0FBcEI7O0FBRUE5RSxpQkFBZSxzQkFBUzc4QixFQUFULEVBQWFLLElBQWIsRUFBbUI7QUFDaEMsUUFBSXBLLENBQUosRUFBT0gsR0FBUCxFQUFZMHFDLFFBQVo7QUFDQUEsZUFBVyxFQUFYO0FBQ0EsU0FBSzFxQyxHQUFMLElBQVl1SyxLQUFLN00sU0FBakIsRUFBNEI7QUFDMUIsVUFBSTtBQUNGLFlBQUt3TSxHQUFHbEssR0FBSCxLQUFXLElBQVosSUFBcUIsT0FBT3VLLEtBQUt2SyxHQUFMLENBQVAsS0FBcUIsVUFBOUMsRUFBMEQ7QUFDeEQsY0FBSSxPQUFPMUMsT0FBT3NMLGNBQWQsS0FBaUMsVUFBckMsRUFBaUQ7QUFDL0M4aEMscUJBQVM3c0MsSUFBVCxDQUFjUCxPQUFPc0wsY0FBUCxDQUFzQnNCLEVBQXRCLEVBQTBCbEssR0FBMUIsRUFBK0I7QUFDM0M2SSxtQkFBSyxlQUFXO0FBQ2QsdUJBQU8wQixLQUFLN00sU0FBTCxDQUFlc0MsR0FBZixDQUFQO0FBQ0QsZUFIMEM7QUFJM0NnZ0MsNEJBQWMsSUFKNkI7QUFLM0NELDBCQUFZO0FBTCtCLGFBQS9CLENBQWQ7QUFPRCxXQVJELE1BUU87QUFDTDJLLHFCQUFTN3NDLElBQVQsQ0FBY3FNLEdBQUdsSyxHQUFILElBQVV1SyxLQUFLN00sU0FBTCxDQUFlc0MsR0FBZixDQUF4QjtBQUNEO0FBQ0YsU0FaRCxNQVlPO0FBQ0wwcUMsbUJBQVM3c0MsSUFBVCxDQUFjLEtBQUssQ0FBbkI7QUFDRDtBQUNGLE9BaEJELENBZ0JFLE9BQU93c0MsTUFBUCxFQUFlO0FBQ2ZscUMsWUFBSWtxQyxNQUFKO0FBQ0Q7QUFDRjtBQUNELFdBQU9LLFFBQVA7QUFDRCxHQXpCRDs7QUEyQkF2RCxnQkFBYyxFQUFkOztBQUVBZCxPQUFLeUYsTUFBTCxHQUFjLFlBQVc7QUFDdkIsUUFBSTlCLElBQUosRUFBVXRnQyxFQUFWLEVBQWNxaUMsR0FBZDtBQUNBcmlDLFNBQUtySyxVQUFVLENBQVYsQ0FBTCxFQUFtQjJxQyxPQUFPLEtBQUszcUMsVUFBVUUsTUFBZixHQUF3QjZvQyxRQUFReHFDLElBQVIsQ0FBYXlCLFNBQWIsRUFBd0IsQ0FBeEIsQ0FBeEIsR0FBcUQsRUFBL0U7QUFDQThuQyxnQkFBWTZFLE9BQVosQ0FBb0IsUUFBcEI7QUFDQUQsVUFBTXJpQyxHQUFHd08sS0FBSCxDQUFTLElBQVQsRUFBZTh4QixJQUFmLENBQU47QUFDQTdDLGdCQUFZOEUsS0FBWjtBQUNBLFdBQU9GLEdBQVA7QUFDRCxHQVBEOztBQVNBMUYsT0FBSzZGLEtBQUwsR0FBYSxZQUFXO0FBQ3RCLFFBQUlsQyxJQUFKLEVBQVV0Z0MsRUFBVixFQUFjcWlDLEdBQWQ7QUFDQXJpQyxTQUFLckssVUFBVSxDQUFWLENBQUwsRUFBbUIycUMsT0FBTyxLQUFLM3FDLFVBQVVFLE1BQWYsR0FBd0I2b0MsUUFBUXhxQyxJQUFSLENBQWF5QixTQUFiLEVBQXdCLENBQXhCLENBQXhCLEdBQXFELEVBQS9FO0FBQ0E4bkMsZ0JBQVk2RSxPQUFaLENBQW9CLE9BQXBCO0FBQ0FELFVBQU1yaUMsR0FBR3dPLEtBQUgsQ0FBUyxJQUFULEVBQWU4eEIsSUFBZixDQUFOO0FBQ0E3QyxnQkFBWThFLEtBQVo7QUFDQSxXQUFPRixHQUFQO0FBQ0QsR0FQRDs7QUFTQXhFLGdCQUFjLHFCQUFTM0YsTUFBVCxFQUFpQjtBQUM3QixRQUFJMkosS0FBSjtBQUNBLFFBQUkzSixVQUFVLElBQWQsRUFBb0I7QUFDbEJBLGVBQVMsS0FBVDtBQUNEO0FBQ0QsUUFBSXVGLFlBQVksQ0FBWixNQUFtQixPQUF2QixFQUFnQztBQUM5QixhQUFPLE9BQVA7QUFDRDtBQUNELFFBQUksQ0FBQ0EsWUFBWTVuQyxNQUFiLElBQXVCcUwsUUFBUTYrQixJQUFuQyxFQUF5QztBQUN2QyxVQUFJN0gsV0FBVyxRQUFYLElBQXVCaDNCLFFBQVE2K0IsSUFBUixDQUFhRSxlQUF4QyxFQUF5RDtBQUN2RCxlQUFPLElBQVA7QUFDRCxPQUZELE1BRU8sSUFBSTRCLFFBQVEzSixPQUFPcjZCLFdBQVAsRUFBUixFQUE4Qm1oQyxVQUFVOXFDLElBQVYsQ0FBZWdOLFFBQVE2K0IsSUFBUixDQUFhQyxZQUE1QixFQUEwQzZCLEtBQTFDLEtBQW9ELENBQXRGLEVBQXlGO0FBQzlGLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxXQUFPLEtBQVA7QUFDRCxHQWhCRDs7QUFrQkFqRixxQkFBb0IsVUFBU3NFLE1BQVQsRUFBaUI7QUFDbkN0QyxjQUFVaEMsZ0JBQVYsRUFBNEJzRSxNQUE1Qjs7QUFFQSxhQUFTdEUsZ0JBQVQsR0FBNEI7QUFDMUIsVUFBSTZGLFVBQUo7QUFBQSxVQUNFeEosUUFBUSxJQURWO0FBRUEyRCx1QkFBaUJtQyxTQUFqQixDQUEyQnpTLFdBQTNCLENBQXVDOWQsS0FBdkMsQ0FBNkMsSUFBN0MsRUFBbUQ3WSxTQUFuRDtBQUNBOHNDLG1CQUFhLG9CQUFTQyxHQUFULEVBQWM7QUFDekIsWUFBSUMsS0FBSjtBQUNBQSxnQkFBUUQsSUFBSTdJLElBQVo7QUFDQSxlQUFPNkksSUFBSTdJLElBQUosR0FBVyxVQUFTeGdDLElBQVQsRUFBZXVwQyxHQUFmLEVBQW9CQyxLQUFwQixFQUEyQjtBQUMzQyxjQUFJaEYsWUFBWXhrQyxJQUFaLENBQUosRUFBdUI7QUFDckI0L0Isa0JBQU1uYixPQUFOLENBQWMsU0FBZCxFQUF5QjtBQUN2QnprQixvQkFBTUEsSUFEaUI7QUFFdkJ1cEMsbUJBQUtBLEdBRmtCO0FBR3ZCRSx1QkFBU0o7QUFIYyxhQUF6QjtBQUtEO0FBQ0QsaUJBQU9DLE1BQU1uMEIsS0FBTixDQUFZazBCLEdBQVosRUFBaUIvc0MsU0FBakIsQ0FBUDtBQUNELFNBVEQ7QUFVRCxPQWJEO0FBY0FsQixhQUFPd3RDLGNBQVAsR0FBd0IsVUFBU2MsS0FBVCxFQUFnQjtBQUN0QyxZQUFJTCxHQUFKO0FBQ0FBLGNBQU0sSUFBSXhFLGVBQUosQ0FBb0I2RSxLQUFwQixDQUFOO0FBQ0FOLG1CQUFXQyxHQUFYO0FBQ0EsZUFBT0EsR0FBUDtBQUNELE9BTEQ7QUFNQSxVQUFJO0FBQ0ZyRixxQkFBYTVvQyxPQUFPd3RDLGNBQXBCLEVBQW9DL0QsZUFBcEM7QUFDRCxPQUZELENBRUUsT0FBT3lDLE1BQVAsRUFBZSxDQUFFO0FBQ25CLFVBQUkxQyxtQkFBbUIsSUFBdkIsRUFBNkI7QUFDM0J4cEMsZUFBT3l0QyxjQUFQLEdBQXdCLFlBQVc7QUFDakMsY0FBSVEsR0FBSjtBQUNBQSxnQkFBTSxJQUFJekUsZUFBSixFQUFOO0FBQ0F3RSxxQkFBV0MsR0FBWDtBQUNBLGlCQUFPQSxHQUFQO0FBQ0QsU0FMRDtBQU1BLFlBQUk7QUFDRnJGLHVCQUFhNW9DLE9BQU95dEMsY0FBcEIsRUFBb0NqRSxlQUFwQztBQUNELFNBRkQsQ0FFRSxPQUFPMEMsTUFBUCxFQUFlLENBQUU7QUFDcEI7QUFDRCxVQUFLM0MsY0FBYyxJQUFmLElBQXdCOThCLFFBQVE2K0IsSUFBUixDQUFhRSxlQUF6QyxFQUEwRDtBQUN4RHhyQyxlQUFPMHRDLFNBQVAsR0FBbUIsVUFBU1MsR0FBVCxFQUFjSSxTQUFkLEVBQXlCO0FBQzFDLGNBQUlOLEdBQUo7QUFDQSxjQUFJTSxhQUFhLElBQWpCLEVBQXVCO0FBQ3JCTixrQkFBTSxJQUFJMUUsVUFBSixDQUFlNEUsR0FBZixFQUFvQkksU0FBcEIsQ0FBTjtBQUNELFdBRkQsTUFFTztBQUNMTixrQkFBTSxJQUFJMUUsVUFBSixDQUFlNEUsR0FBZixDQUFOO0FBQ0Q7QUFDRCxjQUFJL0UsWUFBWSxRQUFaLENBQUosRUFBMkI7QUFDekI1RSxrQkFBTW5iLE9BQU4sQ0FBYyxTQUFkLEVBQXlCO0FBQ3ZCemtCLG9CQUFNLFFBRGlCO0FBRXZCdXBDLG1CQUFLQSxHQUZrQjtBQUd2QkkseUJBQVdBLFNBSFk7QUFJdkJGLHVCQUFTSjtBQUpjLGFBQXpCO0FBTUQ7QUFDRCxpQkFBT0EsR0FBUDtBQUNELFNBaEJEO0FBaUJBLFlBQUk7QUFDRnJGLHVCQUFhNW9DLE9BQU8wdEMsU0FBcEIsRUFBK0JuRSxVQUEvQjtBQUNELFNBRkQsQ0FFRSxPQUFPMkMsTUFBUCxFQUFlLENBQUU7QUFDcEI7QUFDRjs7QUFFRCxXQUFPL0QsZ0JBQVA7QUFFRCxHQW5Fa0IsQ0FtRWhCaDlCLE1BbkVnQixDQUFuQjs7QUFxRUF3K0IsZUFBYSxJQUFiOztBQUVBYixpQkFBZSx3QkFBVztBQUN4QixRQUFJYSxjQUFjLElBQWxCLEVBQXdCO0FBQ3RCQSxtQkFBYSxJQUFJeEIsZ0JBQUosRUFBYjtBQUNEO0FBQ0QsV0FBT3dCLFVBQVA7QUFDRCxHQUxEOztBQU9BUixvQkFBa0IseUJBQVNnRixHQUFULEVBQWM7QUFDOUIsUUFBSTdMLE9BQUosRUFBYTRLLEVBQWIsRUFBaUJDLEtBQWpCLEVBQXdCQyxLQUF4QjtBQUNBQSxZQUFRM2dDLFFBQVE2K0IsSUFBUixDQUFhRyxVQUFyQjtBQUNBLFNBQUt5QixLQUFLLENBQUwsRUFBUUMsUUFBUUMsTUFBTWhzQyxNQUEzQixFQUFtQzhyQyxLQUFLQyxLQUF4QyxFQUErQ0QsSUFBL0MsRUFBcUQ7QUFDbkQ1SyxnQkFBVThLLE1BQU1GLEVBQU4sQ0FBVjtBQUNBLFVBQUksT0FBTzVLLE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsWUFBSTZMLElBQUkzc0MsT0FBSixDQUFZOGdDLE9BQVosTUFBeUIsQ0FBQyxDQUE5QixFQUFpQztBQUMvQixpQkFBTyxJQUFQO0FBQ0Q7QUFDRixPQUpELE1BSU87QUFDTCxZQUFJQSxRQUFRaDRCLElBQVIsQ0FBYTZqQyxHQUFiLENBQUosRUFBdUI7QUFDckIsaUJBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRjtBQUNELFdBQU8sS0FBUDtBQUNELEdBaEJEOztBQWtCQXJGLGlCQUFlejlCLEVBQWYsQ0FBa0IsU0FBbEIsRUFBNkIsVUFBU21qQyxJQUFULEVBQWU7QUFDMUMsUUFBSUMsS0FBSixFQUFXNUMsSUFBWCxFQUFpQndDLE9BQWpCLEVBQTBCenBDLElBQTFCLEVBQWdDdXBDLEdBQWhDO0FBQ0F2cEMsV0FBTzRwQyxLQUFLNXBDLElBQVosRUFBa0J5cEMsVUFBVUcsS0FBS0gsT0FBakMsRUFBMENGLE1BQU1LLEtBQUtMLEdBQXJEO0FBQ0EsUUFBSWhGLGdCQUFnQmdGLEdBQWhCLENBQUosRUFBMEI7QUFDeEI7QUFDRDtBQUNELFFBQUksQ0FBQ2pHLEtBQUszN0IsT0FBTixLQUFrQkUsUUFBUXUrQixxQkFBUixLQUFrQyxLQUFsQyxJQUEyQzVCLFlBQVl4a0MsSUFBWixNQUFzQixPQUFuRixDQUFKLEVBQWlHO0FBQy9GaW5DLGFBQU8zcUMsU0FBUDtBQUNBdXRDLGNBQVFoaUMsUUFBUXUrQixxQkFBUixJQUFpQyxDQUF6QztBQUNBLFVBQUksT0FBT3lELEtBQVAsS0FBaUIsU0FBckIsRUFBZ0M7QUFDOUJBLGdCQUFRLENBQVI7QUFDRDtBQUNELGFBQU9sdUMsV0FBVyxZQUFXO0FBQzNCLFlBQUltdUMsV0FBSixFQUFpQnhCLEVBQWpCLEVBQXFCQyxLQUFyQixFQUE0QkMsS0FBNUIsRUFBbUN1QixLQUFuQyxFQUEwQ3BDLFFBQTFDO0FBQ0EsWUFBSTNuQyxTQUFTLFFBQWIsRUFBdUI7QUFDckI4cEMsd0JBQWNMLFFBQVFPLFVBQVIsR0FBcUIsQ0FBbkM7QUFDRCxTQUZELE1BRU87QUFDTEYsd0JBQWUsS0FBS3RCLFFBQVFpQixRQUFRTyxVQUFyQixLQUFvQ3hCLFFBQVEsQ0FBM0Q7QUFDRDtBQUNELFlBQUlzQixXQUFKLEVBQWlCO0FBQ2Z4RyxlQUFLMkcsT0FBTDtBQUNBRixrQkFBUXpHLEtBQUttQixPQUFiO0FBQ0FrRCxxQkFBVyxFQUFYO0FBQ0EsZUFBS1csS0FBSyxDQUFMLEVBQVFDLFFBQVF3QixNQUFNdnRDLE1BQTNCLEVBQW1DOHJDLEtBQUtDLEtBQXhDLEVBQStDRCxJQUEvQyxFQUFxRDtBQUNuRC9HLHFCQUFTd0ksTUFBTXpCLEVBQU4sQ0FBVDtBQUNBLGdCQUFJL0csa0JBQWtCdUIsV0FBdEIsRUFBbUM7QUFDakN2QixxQkFBTzJJLEtBQVAsQ0FBYS8wQixLQUFiLENBQW1Cb3NCLE1BQW5CLEVBQTJCMEYsSUFBM0I7QUFDQTtBQUNELGFBSEQsTUFHTztBQUNMVSx1QkFBUzdzQyxJQUFULENBQWMsS0FBSyxDQUFuQjtBQUNEO0FBQ0Y7QUFDRCxpQkFBTzZzQyxRQUFQO0FBQ0Q7QUFDRixPQXRCTSxFQXNCSmtDLEtBdEJJLENBQVA7QUF1QkQ7QUFDRixHQXBDRDs7QUFzQ0EvRyxnQkFBZSxZQUFXO0FBQ3hCLGFBQVNBLFdBQVQsR0FBdUI7QUFDckIsVUFBSWxELFFBQVEsSUFBWjtBQUNBLFdBQUtuTyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0F5UyxxQkFBZXo5QixFQUFmLENBQWtCLFNBQWxCLEVBQTZCLFlBQVc7QUFDdEMsZUFBT201QixNQUFNc0ssS0FBTixDQUFZLzBCLEtBQVosQ0FBa0J5cUIsS0FBbEIsRUFBeUJ0akMsU0FBekIsQ0FBUDtBQUNELE9BRkQ7QUFHRDs7QUFFRHdtQyxnQkFBWW5vQyxTQUFaLENBQXNCdXZDLEtBQXRCLEdBQThCLFVBQVNOLElBQVQsRUFBZTtBQUMzQyxVQUFJSCxPQUFKLEVBQWFVLE9BQWIsRUFBc0JucUMsSUFBdEIsRUFBNEJ1cEMsR0FBNUI7QUFDQXZwQyxhQUFPNHBDLEtBQUs1cEMsSUFBWixFQUFrQnlwQyxVQUFVRyxLQUFLSCxPQUFqQyxFQUEwQ0YsTUFBTUssS0FBS0wsR0FBckQ7QUFDQSxVQUFJaEYsZ0JBQWdCZ0YsR0FBaEIsQ0FBSixFQUEwQjtBQUN4QjtBQUNEO0FBQ0QsVUFBSXZwQyxTQUFTLFFBQWIsRUFBdUI7QUFDckJtcUMsa0JBQVUsSUFBSXpHLG9CQUFKLENBQXlCK0YsT0FBekIsQ0FBVjtBQUNELE9BRkQsTUFFTztBQUNMVSxrQkFBVSxJQUFJeEcsaUJBQUosQ0FBc0I4RixPQUF0QixDQUFWO0FBQ0Q7QUFDRCxhQUFPLEtBQUtoWSxRQUFMLENBQWMzMkIsSUFBZCxDQUFtQnF2QyxPQUFuQixDQUFQO0FBQ0QsS0FaRDs7QUFjQSxXQUFPckgsV0FBUDtBQUVELEdBekJhLEVBQWQ7O0FBMkJBYSxzQkFBcUIsWUFBVztBQUM5QixhQUFTQSxpQkFBVCxDQUEyQjhGLE9BQTNCLEVBQW9DO0FBQ2xDLFVBQUk5b0IsS0FBSjtBQUFBLFVBQVd5cEIsSUFBWDtBQUFBLFVBQWlCOUIsRUFBakI7QUFBQSxVQUFxQkMsS0FBckI7QUFBQSxVQUE0QjhCLG1CQUE1QjtBQUFBLFVBQWlEN0IsS0FBakQ7QUFBQSxVQUNFNUksUUFBUSxJQURWO0FBRUEsV0FBS2tJLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxVQUFJMXNDLE9BQU9rdkMsYUFBUCxJQUF3QixJQUE1QixFQUFrQztBQUNoQ0YsZUFBTyxJQUFQO0FBQ0FYLGdCQUFRMWpDLGdCQUFSLENBQXlCLFVBQXpCLEVBQXFDLFVBQVN3a0MsR0FBVCxFQUFjO0FBQ2pELGNBQUlBLElBQUlDLGdCQUFSLEVBQTBCO0FBQ3hCLG1CQUFPNUssTUFBTWtJLFFBQU4sR0FBaUIsTUFBTXlDLElBQUlFLE1BQVYsR0FBbUJGLElBQUlHLEtBQS9DO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU85SyxNQUFNa0ksUUFBTixHQUFpQmxJLE1BQU1rSSxRQUFOLEdBQWlCLENBQUMsTUFBTWxJLE1BQU1rSSxRQUFiLElBQXlCLENBQWxFO0FBQ0Q7QUFDRixTQU5ELEVBTUcsS0FOSDtBQU9BVSxnQkFBUSxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFNBQWxCLEVBQTZCLE9BQTdCLENBQVI7QUFDQSxhQUFLRixLQUFLLENBQUwsRUFBUUMsUUFBUUMsTUFBTWhzQyxNQUEzQixFQUFtQzhyQyxLQUFLQyxLQUF4QyxFQUErQ0QsSUFBL0MsRUFBcUQ7QUFDbkQzbkIsa0JBQVE2bkIsTUFBTUYsRUFBTixDQUFSO0FBQ0FtQixrQkFBUTFqQyxnQkFBUixDQUF5QjRhLEtBQXpCLEVBQWdDLFlBQVc7QUFDekMsbUJBQU9pZixNQUFNa0ksUUFBTixHQUFpQixHQUF4QjtBQUNELFdBRkQsRUFFRyxLQUZIO0FBR0Q7QUFDRixPQWhCRCxNQWdCTztBQUNMdUMsOEJBQXNCWixRQUFRa0Isa0JBQTlCO0FBQ0FsQixnQkFBUWtCLGtCQUFSLEdBQTZCLFlBQVc7QUFDdEMsY0FBSVosS0FBSjtBQUNBLGNBQUksQ0FBQ0EsUUFBUU4sUUFBUU8sVUFBakIsTUFBaUMsQ0FBakMsSUFBc0NELFVBQVUsQ0FBcEQsRUFBdUQ7QUFDckRuSyxrQkFBTWtJLFFBQU4sR0FBaUIsR0FBakI7QUFDRCxXQUZELE1BRU8sSUFBSTJCLFFBQVFPLFVBQVIsS0FBdUIsQ0FBM0IsRUFBOEI7QUFDbkNwSyxrQkFBTWtJLFFBQU4sR0FBaUIsRUFBakI7QUFDRDtBQUNELGlCQUFPLE9BQU91QyxtQkFBUCxLQUErQixVQUEvQixHQUE0Q0Esb0JBQW9CbDFCLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDN1ksU0FBaEMsQ0FBNUMsR0FBeUYsS0FBSyxDQUFyRztBQUNELFNBUkQ7QUFTRDtBQUNGOztBQUVELFdBQU9xbkMsaUJBQVA7QUFFRCxHQXJDbUIsRUFBcEI7O0FBdUNBRCx5QkFBd0IsWUFBVztBQUNqQyxhQUFTQSxvQkFBVCxDQUE4QitGLE9BQTlCLEVBQXVDO0FBQ3JDLFVBQUk5b0IsS0FBSjtBQUFBLFVBQVcybkIsRUFBWDtBQUFBLFVBQWVDLEtBQWY7QUFBQSxVQUFzQkMsS0FBdEI7QUFBQSxVQUNFNUksUUFBUSxJQURWO0FBRUEsV0FBS2tJLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQVUsY0FBUSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQVI7QUFDQSxXQUFLRixLQUFLLENBQUwsRUFBUUMsUUFBUUMsTUFBTWhzQyxNQUEzQixFQUFtQzhyQyxLQUFLQyxLQUF4QyxFQUErQ0QsSUFBL0MsRUFBcUQ7QUFDbkQzbkIsZ0JBQVE2bkIsTUFBTUYsRUFBTixDQUFSO0FBQ0FtQixnQkFBUTFqQyxnQkFBUixDQUF5QjRhLEtBQXpCLEVBQWdDLFlBQVc7QUFDekMsaUJBQU9pZixNQUFNa0ksUUFBTixHQUFpQixHQUF4QjtBQUNELFNBRkQsRUFFRyxLQUZIO0FBR0Q7QUFDRjs7QUFFRCxXQUFPcEUsb0JBQVA7QUFFRCxHQWhCc0IsRUFBdkI7O0FBa0JBVCxtQkFBa0IsWUFBVztBQUMzQixhQUFTQSxjQUFULENBQXdCcDdCLE9BQXhCLEVBQWlDO0FBQy9CLFVBQUlqSCxRQUFKLEVBQWMwbkMsRUFBZCxFQUFrQkMsS0FBbEIsRUFBeUJDLEtBQXpCO0FBQ0EsVUFBSTNnQyxXQUFXLElBQWYsRUFBcUI7QUFDbkJBLGtCQUFVLEVBQVY7QUFDRDtBQUNELFdBQUs0cEIsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFVBQUk1cEIsUUFBUTY1QixTQUFSLElBQXFCLElBQXpCLEVBQStCO0FBQzdCNzVCLGdCQUFRNjVCLFNBQVIsR0FBb0IsRUFBcEI7QUFDRDtBQUNEOEcsY0FBUTNnQyxRQUFRNjVCLFNBQWhCO0FBQ0EsV0FBSzRHLEtBQUssQ0FBTCxFQUFRQyxRQUFRQyxNQUFNaHNDLE1BQTNCLEVBQW1DOHJDLEtBQUtDLEtBQXhDLEVBQStDRCxJQUEvQyxFQUFxRDtBQUNuRDFuQyxtQkFBVzRuQyxNQUFNRixFQUFOLENBQVg7QUFDQSxhQUFLN1csUUFBTCxDQUFjMzJCLElBQWQsQ0FBbUIsSUFBSW9vQyxjQUFKLENBQW1CdGlDLFFBQW5CLENBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPcWlDLGNBQVA7QUFFRCxHQW5CZ0IsRUFBakI7O0FBcUJBQyxtQkFBa0IsWUFBVztBQUMzQixhQUFTQSxjQUFULENBQXdCdGlDLFFBQXhCLEVBQWtDO0FBQ2hDLFdBQUtBLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsV0FBS2tuQyxRQUFMLEdBQWdCLENBQWhCO0FBQ0EsV0FBSzhDLEtBQUw7QUFDRDs7QUFFRDFILG1CQUFldm9DLFNBQWYsQ0FBeUJpd0MsS0FBekIsR0FBaUMsWUFBVztBQUMxQyxVQUFJaEwsUUFBUSxJQUFaO0FBQ0EsVUFBSW5pQyxTQUFTZ0QsYUFBVCxDQUF1QixLQUFLRyxRQUE1QixDQUFKLEVBQTJDO0FBQ3pDLGVBQU8sS0FBSzhuQyxJQUFMLEVBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPL3NDLFdBQVksWUFBVztBQUM1QixpQkFBT2lrQyxNQUFNZ0wsS0FBTixFQUFQO0FBQ0QsU0FGTSxFQUVIL2lDLFFBQVE0cEIsUUFBUixDQUFpQjRVLGFBRmQsQ0FBUDtBQUdEO0FBQ0YsS0FURDs7QUFXQW5ELG1CQUFldm9DLFNBQWYsQ0FBeUIrdEMsSUFBekIsR0FBZ0MsWUFBVztBQUN6QyxhQUFPLEtBQUtaLFFBQUwsR0FBZ0IsR0FBdkI7QUFDRCxLQUZEOztBQUlBLFdBQU81RSxjQUFQO0FBRUQsR0F4QmdCLEVBQWpCOztBQTBCQUYsb0JBQW1CLFlBQVc7QUFDNUJBLG9CQUFnQnJvQyxTQUFoQixDQUEwQmt3QyxNQUExQixHQUFtQztBQUNqQ0MsZUFBUyxDQUR3QjtBQUVqQ0MsbUJBQWEsRUFGb0I7QUFHakN2Z0IsZ0JBQVU7QUFIdUIsS0FBbkM7O0FBTUEsYUFBU3dZLGVBQVQsR0FBMkI7QUFDekIsVUFBSXFILG1CQUFKO0FBQUEsVUFBeUI3QixLQUF6QjtBQUFBLFVBQ0U1SSxRQUFRLElBRFY7QUFFQSxXQUFLa0ksUUFBTCxHQUFnQixDQUFDVSxRQUFRLEtBQUtxQyxNQUFMLENBQVlwdEMsU0FBU3VzQyxVQUFyQixDQUFULEtBQThDLElBQTlDLEdBQXFEeEIsS0FBckQsR0FBNkQsR0FBN0U7QUFDQTZCLDRCQUFzQjVzQyxTQUFTa3RDLGtCQUEvQjtBQUNBbHRDLGVBQVNrdEMsa0JBQVQsR0FBOEIsWUFBVztBQUN2QyxZQUFJL0ssTUFBTWlMLE1BQU4sQ0FBYXB0QyxTQUFTdXNDLFVBQXRCLEtBQXFDLElBQXpDLEVBQStDO0FBQzdDcEssZ0JBQU1rSSxRQUFOLEdBQWlCbEksTUFBTWlMLE1BQU4sQ0FBYXB0QyxTQUFTdXNDLFVBQXRCLENBQWpCO0FBQ0Q7QUFDRCxlQUFPLE9BQU9LLG1CQUFQLEtBQStCLFVBQS9CLEdBQTRDQSxvQkFBb0JsMUIsS0FBcEIsQ0FBMEIsSUFBMUIsRUFBZ0M3WSxTQUFoQyxDQUE1QyxHQUF5RixLQUFLLENBQXJHO0FBQ0QsT0FMRDtBQU1EOztBQUVELFdBQU8wbUMsZUFBUDtBQUVELEdBdEJpQixFQUFsQjs7QUF3QkFHLG9CQUFtQixZQUFXO0FBQzVCLGFBQVNBLGVBQVQsR0FBMkI7QUFDekIsVUFBSTZILEdBQUo7QUFBQSxVQUFTcGpCLFFBQVQ7QUFBQSxVQUFtQm1mLElBQW5CO0FBQUEsVUFBeUJrRSxNQUF6QjtBQUFBLFVBQWlDQyxPQUFqQztBQUFBLFVBQ0V0TCxRQUFRLElBRFY7QUFFQSxXQUFLa0ksUUFBTCxHQUFnQixDQUFoQjtBQUNBa0QsWUFBTSxDQUFOO0FBQ0FFLGdCQUFVLEVBQVY7QUFDQUQsZUFBUyxDQUFUO0FBQ0FsRSxhQUFPckUsS0FBUDtBQUNBOWEsaUJBQVdyRyxZQUFZLFlBQVc7QUFDaEMsWUFBSXlsQixJQUFKO0FBQ0FBLGVBQU90RSxRQUFRcUUsSUFBUixHQUFlLEVBQXRCO0FBQ0FBLGVBQU9yRSxLQUFQO0FBQ0F3SSxnQkFBUXB3QyxJQUFSLENBQWFrc0MsSUFBYjtBQUNBLFlBQUlrRSxRQUFRMXVDLE1BQVIsR0FBaUJxTCxRQUFReStCLFFBQVIsQ0FBaUJFLFdBQXRDLEVBQW1EO0FBQ2pEMEUsa0JBQVFoQyxLQUFSO0FBQ0Q7QUFDRDhCLGNBQU1wSCxhQUFhc0gsT0FBYixDQUFOO0FBQ0EsWUFBSSxFQUFFRCxNQUFGLElBQVlwakMsUUFBUXkrQixRQUFSLENBQWlCQyxVQUE3QixJQUEyQ3lFLE1BQU1uakMsUUFBUXkrQixRQUFSLENBQWlCRyxZQUF0RSxFQUFvRjtBQUNsRjdHLGdCQUFNa0ksUUFBTixHQUFpQixHQUFqQjtBQUNBLGlCQUFPNXNCLGNBQWMwTSxRQUFkLENBQVA7QUFDRCxTQUhELE1BR087QUFDTCxpQkFBT2dZLE1BQU1rSSxRQUFOLEdBQWlCLE9BQU8sS0FBS2tELE1BQU0sQ0FBWCxDQUFQLENBQXhCO0FBQ0Q7QUFDRixPQWZVLEVBZVIsRUFmUSxDQUFYO0FBZ0JEOztBQUVELFdBQU83SCxlQUFQO0FBRUQsR0E3QmlCLEVBQWxCOztBQStCQU0sV0FBVSxZQUFXO0FBQ25CLGFBQVNBLE1BQVQsQ0FBZ0JsQyxNQUFoQixFQUF3QjtBQUN0QixXQUFLQSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxXQUFLd0YsSUFBTCxHQUFZLEtBQUtvRSxlQUFMLEdBQXVCLENBQW5DO0FBQ0EsV0FBS0MsSUFBTCxHQUFZdmpDLFFBQVFnK0IsV0FBcEI7QUFDQSxXQUFLd0YsT0FBTCxHQUFlLENBQWY7QUFDQSxXQUFLdkQsUUFBTCxHQUFnQixLQUFLd0QsWUFBTCxHQUFvQixDQUFwQztBQUNBLFVBQUksS0FBSy9KLE1BQUwsSUFBZSxJQUFuQixFQUF5QjtBQUN2QixhQUFLdUcsUUFBTCxHQUFnQnJwQyxPQUFPLEtBQUs4aUMsTUFBWixFQUFvQixVQUFwQixDQUFoQjtBQUNEO0FBQ0Y7O0FBRURrQyxXQUFPOW9DLFNBQVAsQ0FBaUIwTSxJQUFqQixHQUF3QixVQUFTa2tDLFNBQVQsRUFBb0Izc0MsR0FBcEIsRUFBeUI7QUFDL0MsVUFBSTRzQyxPQUFKO0FBQ0EsVUFBSTVzQyxPQUFPLElBQVgsRUFBaUI7QUFDZkEsY0FBTUgsT0FBTyxLQUFLOGlDLE1BQVosRUFBb0IsVUFBcEIsQ0FBTjtBQUNEO0FBQ0QsVUFBSTNpQyxPQUFPLEdBQVgsRUFBZ0I7QUFDZCxhQUFLOHBDLElBQUwsR0FBWSxJQUFaO0FBQ0Q7QUFDRCxVQUFJOXBDLFFBQVEsS0FBS21vQyxJQUFqQixFQUF1QjtBQUNyQixhQUFLb0UsZUFBTCxJQUF3QkksU0FBeEI7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJLEtBQUtKLGVBQVQsRUFBMEI7QUFDeEIsZUFBS0MsSUFBTCxHQUFZLENBQUN4c0MsTUFBTSxLQUFLbW9DLElBQVosSUFBb0IsS0FBS29FLGVBQXJDO0FBQ0Q7QUFDRCxhQUFLRSxPQUFMLEdBQWUsQ0FBQ3pzQyxNQUFNLEtBQUtrcEMsUUFBWixJQUF3QmpnQyxRQUFRKzlCLFdBQS9DO0FBQ0EsYUFBS3VGLGVBQUwsR0FBdUIsQ0FBdkI7QUFDQSxhQUFLcEUsSUFBTCxHQUFZbm9DLEdBQVo7QUFDRDtBQUNELFVBQUlBLE1BQU0sS0FBS2twQyxRQUFmLEVBQXlCO0FBQ3ZCLGFBQUtBLFFBQUwsSUFBaUIsS0FBS3VELE9BQUwsR0FBZUUsU0FBaEM7QUFDRDtBQUNEQyxnQkFBVSxJQUFJaHNDLEtBQUtpc0MsR0FBTCxDQUFTLEtBQUszRCxRQUFMLEdBQWdCLEdBQXpCLEVBQThCamdDLFFBQVFvK0IsVUFBdEMsQ0FBZDtBQUNBLFdBQUs2QixRQUFMLElBQWlCMEQsVUFBVSxLQUFLSixJQUFmLEdBQXNCRyxTQUF2QztBQUNBLFdBQUt6RCxRQUFMLEdBQWdCdG9DLEtBQUs4SCxHQUFMLENBQVMsS0FBS2drQyxZQUFMLEdBQW9CempDLFFBQVFtK0IsbUJBQXJDLEVBQTBELEtBQUs4QixRQUEvRCxDQUFoQjtBQUNBLFdBQUtBLFFBQUwsR0FBZ0J0b0MsS0FBSzZQLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBS3k0QixRQUFqQixDQUFoQjtBQUNBLFdBQUtBLFFBQUwsR0FBZ0J0b0MsS0FBSzhILEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBS3dnQyxRQUFuQixDQUFoQjtBQUNBLFdBQUt3RCxZQUFMLEdBQW9CLEtBQUt4RCxRQUF6QjtBQUNBLGFBQU8sS0FBS0EsUUFBWjtBQUNELEtBNUJEOztBQThCQSxXQUFPckUsTUFBUDtBQUVELEdBNUNRLEVBQVQ7O0FBOENBZ0IsWUFBVSxJQUFWOztBQUVBSCxZQUFVLElBQVY7O0FBRUFULFFBQU0sSUFBTjs7QUFFQWEsY0FBWSxJQUFaOztBQUVBcFMsY0FBWSxJQUFaOztBQUVBd1Isb0JBQWtCLElBQWxCOztBQUVBUixPQUFLMzdCLE9BQUwsR0FBZSxLQUFmOztBQUVBdzhCLG9CQUFrQiwyQkFBVztBQUMzQixRQUFJdDhCLFFBQVFzK0Isa0JBQVosRUFBZ0M7QUFDOUIsYUFBTzdDLEtBQUsyRyxPQUFMLEVBQVA7QUFDRDtBQUNGLEdBSkQ7O0FBTUEsTUFBSTd1QyxPQUFPc3dDLE9BQVAsQ0FBZUMsU0FBZixJQUE0QixJQUFoQyxFQUFzQztBQUNwQzFHLGlCQUFhN3BDLE9BQU9zd0MsT0FBUCxDQUFlQyxTQUE1QjtBQUNBdndDLFdBQU9zd0MsT0FBUCxDQUFlQyxTQUFmLEdBQTJCLFlBQVc7QUFDcEN4SDtBQUNBLGFBQU9jLFdBQVc5dkIsS0FBWCxDQUFpQi9aLE9BQU9zd0MsT0FBeEIsRUFBaUNwdkMsU0FBakMsQ0FBUDtBQUNELEtBSEQ7QUFJRDs7QUFFRCxNQUFJbEIsT0FBT3N3QyxPQUFQLENBQWVFLFlBQWYsSUFBK0IsSUFBbkMsRUFBeUM7QUFDdkN4RyxvQkFBZ0JocUMsT0FBT3N3QyxPQUFQLENBQWVFLFlBQS9CO0FBQ0F4d0MsV0FBT3N3QyxPQUFQLENBQWVFLFlBQWYsR0FBOEIsWUFBVztBQUN2Q3pIO0FBQ0EsYUFBT2lCLGNBQWNqd0IsS0FBZCxDQUFvQi9aLE9BQU9zd0MsT0FBM0IsRUFBb0NwdkMsU0FBcEMsQ0FBUDtBQUNELEtBSEQ7QUFJRDs7QUFFRGtuQyxnQkFBYztBQUNaa0QsVUFBTTVELFdBRE07QUFFWnJSLGNBQVV3UixjQUZFO0FBR1p4bEMsY0FBVXVsQyxlQUhFO0FBSVpzRCxjQUFVbkQ7QUFKRSxHQUFkOztBQU9BLEdBQUM5USxPQUFPLGdCQUFXO0FBQ2pCLFFBQUlyeUIsSUFBSixFQUFVc29DLEVBQVYsRUFBY3VELEVBQWQsRUFBa0J0RCxLQUFsQixFQUF5QnVELEtBQXpCLEVBQWdDdEQsS0FBaEMsRUFBdUN1QixLQUF2QyxFQUE4Q2dDLEtBQTlDO0FBQ0F6SSxTQUFLbUIsT0FBTCxHQUFlQSxVQUFVLEVBQXpCO0FBQ0ErRCxZQUFRLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsVUFBckIsRUFBaUMsVUFBakMsQ0FBUjtBQUNBLFNBQUtGLEtBQUssQ0FBTCxFQUFRQyxRQUFRQyxNQUFNaHNDLE1BQTNCLEVBQW1DOHJDLEtBQUtDLEtBQXhDLEVBQStDRCxJQUEvQyxFQUFxRDtBQUNuRHRvQyxhQUFPd29DLE1BQU1GLEVBQU4sQ0FBUDtBQUNBLFVBQUl6Z0MsUUFBUTdILElBQVIsTUFBa0IsS0FBdEIsRUFBNkI7QUFDM0J5a0MsZ0JBQVEzcEMsSUFBUixDQUFhLElBQUkwb0MsWUFBWXhqQyxJQUFaLENBQUosQ0FBc0I2SCxRQUFRN0gsSUFBUixDQUF0QixDQUFiO0FBQ0Q7QUFDRjtBQUNEK3JDLFlBQVEsQ0FBQ2hDLFFBQVFsaUMsUUFBUW1rQyxZQUFqQixLQUFrQyxJQUFsQyxHQUF5Q2pDLEtBQXpDLEdBQWlELEVBQXpEO0FBQ0EsU0FBSzhCLEtBQUssQ0FBTCxFQUFRQyxRQUFRQyxNQUFNdnZDLE1BQTNCLEVBQW1DcXZDLEtBQUtDLEtBQXhDLEVBQStDRCxJQUEvQyxFQUFxRDtBQUNuRHRLLGVBQVN3SyxNQUFNRixFQUFOLENBQVQ7QUFDQXBILGNBQVEzcEMsSUFBUixDQUFhLElBQUl5bUMsTUFBSixDQUFXMTVCLE9BQVgsQ0FBYjtBQUNEO0FBQ0R5N0IsU0FBS08sR0FBTCxHQUFXQSxNQUFNLElBQUlkLEdBQUosRUFBakI7QUFDQXVCLGNBQVUsRUFBVjtBQUNBLFdBQU9JLFlBQVksSUFBSWpCLE1BQUosRUFBbkI7QUFDRCxHQWxCRDs7QUFvQkFILE9BQUsySSxJQUFMLEdBQVksWUFBVztBQUNyQjNJLFNBQUs3ZSxPQUFMLENBQWEsTUFBYjtBQUNBNmUsU0FBSzM3QixPQUFMLEdBQWUsS0FBZjtBQUNBazhCLFFBQUk3b0IsT0FBSjtBQUNBOG9CLHNCQUFrQixJQUFsQjtBQUNBLFFBQUl4UixhQUFhLElBQWpCLEVBQXVCO0FBQ3JCLFVBQUksT0FBT3gyQixvQkFBUCxLQUFnQyxVQUFwQyxFQUFnRDtBQUM5Q0EsNkJBQXFCdzJCLFNBQXJCO0FBQ0Q7QUFDREEsa0JBQVksSUFBWjtBQUNEO0FBQ0QsV0FBT0QsTUFBUDtBQUNELEdBWkQ7O0FBY0FpUixPQUFLMkcsT0FBTCxHQUFlLFlBQVc7QUFDeEIzRyxTQUFLN2UsT0FBTCxDQUFhLFNBQWI7QUFDQTZlLFNBQUsySSxJQUFMO0FBQ0EsV0FBTzNJLEtBQUt0bEIsS0FBTCxFQUFQO0FBQ0QsR0FKRDs7QUFNQXNsQixPQUFLNEksRUFBTCxHQUFVLFlBQVc7QUFDbkIsUUFBSWx1QixLQUFKO0FBQ0FzbEIsU0FBSzM3QixPQUFMLEdBQWUsSUFBZjtBQUNBazhCLFFBQUlyakIsTUFBSjtBQUNBeEMsWUFBUTBrQixLQUFSO0FBQ0FvQixzQkFBa0IsS0FBbEI7QUFDQSxXQUFPeFIsWUFBWStSLGFBQWEsVUFBU2tILFNBQVQsRUFBb0JZLGdCQUFwQixFQUFzQztBQUNwRSxVQUFJbkIsR0FBSixFQUFTN3JDLEtBQVQsRUFBZ0J1cEMsSUFBaEIsRUFBc0J6aEMsT0FBdEIsRUFBK0J3cUIsUUFBL0IsRUFBeUNsMUIsQ0FBekMsRUFBNENvSCxDQUE1QyxFQUErQ3lvQyxTQUEvQyxFQUEwREMsTUFBMUQsRUFBa0VDLFVBQWxFLEVBQThFbkYsR0FBOUUsRUFBbUZtQixFQUFuRixFQUF1RnVELEVBQXZGLEVBQTJGdEQsS0FBM0YsRUFBa0d1RCxLQUFsRyxFQUF5R3RELEtBQXpHO0FBQ0E0RCxrQkFBWSxNQUFNdkksSUFBSWlFLFFBQXRCO0FBQ0Ezb0MsY0FBUWdvQyxNQUFNLENBQWQ7QUFDQXVCLGFBQU8sSUFBUDtBQUNBLFdBQUtuc0MsSUFBSStyQyxLQUFLLENBQVQsRUFBWUMsUUFBUTlELFFBQVFqb0MsTUFBakMsRUFBeUM4ckMsS0FBS0MsS0FBOUMsRUFBcURoc0MsSUFBSSxFQUFFK3JDLEVBQTNELEVBQStEO0FBQzdEL0csaUJBQVNrRCxRQUFRbG9DLENBQVIsQ0FBVDtBQUNBK3ZDLHFCQUFhaEksUUFBUS9uQyxDQUFSLEtBQWMsSUFBZCxHQUFxQituQyxRQUFRL25DLENBQVIsQ0FBckIsR0FBa0MrbkMsUUFBUS9uQyxDQUFSLElBQWEsRUFBNUQ7QUFDQWsxQixtQkFBVyxDQUFDK1csUUFBUWpILE9BQU85UCxRQUFoQixLQUE2QixJQUE3QixHQUFvQytXLEtBQXBDLEdBQTRDLENBQUNqSCxNQUFELENBQXZEO0FBQ0EsYUFBSzU5QixJQUFJa29DLEtBQUssQ0FBVCxFQUFZQyxRQUFRcmEsU0FBU2oxQixNQUFsQyxFQUEwQ3F2QyxLQUFLQyxLQUEvQyxFQUFzRG5vQyxJQUFJLEVBQUVrb0MsRUFBNUQsRUFBZ0U7QUFDOUQ1a0Msb0JBQVV3cUIsU0FBUzl0QixDQUFULENBQVY7QUFDQTBvQyxtQkFBU0MsV0FBVzNvQyxDQUFYLEtBQWlCLElBQWpCLEdBQXdCMm9DLFdBQVczb0MsQ0FBWCxDQUF4QixHQUF3QzJvQyxXQUFXM29DLENBQVgsSUFBZ0IsSUFBSTgvQixNQUFKLENBQVd4OEIsT0FBWCxDQUFqRTtBQUNBeWhDLGtCQUFRMkQsT0FBTzNELElBQWY7QUFDQSxjQUFJMkQsT0FBTzNELElBQVgsRUFBaUI7QUFDZjtBQUNEO0FBQ0R2cEM7QUFDQWdvQyxpQkFBT2tGLE9BQU9obEMsSUFBUCxDQUFZa2tDLFNBQVosQ0FBUDtBQUNEO0FBQ0Y7QUFDRFAsWUFBTTdELE1BQU1ob0MsS0FBWjtBQUNBMGtDLFVBQUlxRSxNQUFKLENBQVd4RCxVQUFVcjlCLElBQVYsQ0FBZWtrQyxTQUFmLEVBQTBCUCxHQUExQixDQUFYO0FBQ0EsVUFBSW5ILElBQUk2RSxJQUFKLE1BQWNBLElBQWQsSUFBc0I1RSxlQUExQixFQUEyQztBQUN6Q0QsWUFBSXFFLE1BQUosQ0FBVyxHQUFYO0FBQ0E1RSxhQUFLN2UsT0FBTCxDQUFhLE1BQWI7QUFDQSxlQUFPOW9CLFdBQVcsWUFBVztBQUMzQmtvQyxjQUFJb0UsTUFBSjtBQUNBM0UsZUFBSzM3QixPQUFMLEdBQWUsS0FBZjtBQUNBLGlCQUFPMjdCLEtBQUs3ZSxPQUFMLENBQWEsTUFBYixDQUFQO0FBQ0QsU0FKTSxFQUlKamxCLEtBQUs2UCxHQUFMLENBQVN4SCxRQUFRaytCLFNBQWpCLEVBQTRCdm1DLEtBQUs2UCxHQUFMLENBQVN4SCxRQUFRaStCLE9BQVIsSUFBbUJwRCxRQUFRMWtCLEtBQTNCLENBQVQsRUFBNEMsQ0FBNUMsQ0FBNUIsQ0FKSSxDQUFQO0FBS0QsT0FSRCxNQVFPO0FBQ0wsZUFBT211QixrQkFBUDtBQUNEO0FBQ0YsS0FqQ2tCLENBQW5CO0FBa0NELEdBeENEOztBQTBDQTdJLE9BQUt0bEIsS0FBTCxHQUFhLFVBQVN1VixRQUFULEVBQW1CO0FBQzlCcjNCLFlBQU8yTCxPQUFQLEVBQWdCMHJCLFFBQWhCO0FBQ0ErUCxTQUFLMzdCLE9BQUwsR0FBZSxJQUFmO0FBQ0EsUUFBSTtBQUNGazhCLFVBQUlyakIsTUFBSjtBQUNELEtBRkQsQ0FFRSxPQUFPOG1CLE1BQVAsRUFBZTtBQUNmakUsc0JBQWdCaUUsTUFBaEI7QUFDRDtBQUNELFFBQUksQ0FBQzdwQyxTQUFTZ0QsYUFBVCxDQUF1QixPQUF2QixDQUFMLEVBQXNDO0FBQ3BDLGFBQU85RSxXQUFXMm5DLEtBQUt0bEIsS0FBaEIsRUFBdUIsRUFBdkIsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMc2xCLFdBQUs3ZSxPQUFMLENBQWEsT0FBYjtBQUNBLGFBQU82ZSxLQUFLNEksRUFBTCxFQUFQO0FBQ0Q7QUFDRixHQWREOztBQWdCQSxNQUFJLE9BQU9LLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE9BQU9DLEdBQTNDLEVBQWdEO0FBQzlDRCxXQUFPLENBQUMsTUFBRCxDQUFQLEVBQWlCLFlBQVc7QUFDMUIsYUFBT2pKLElBQVA7QUFDRCxLQUZEO0FBR0QsR0FKRCxNQUlPLElBQUksUUFBT21KLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdENDLFdBQU9ELE9BQVAsR0FBaUJuSixJQUFqQjtBQUNELEdBRk0sTUFFQTtBQUNMLFFBQUl6N0IsUUFBUXErQixlQUFaLEVBQTZCO0FBQzNCNUMsV0FBS3RsQixLQUFMO0FBQ0Q7QUFDRjtBQUVGLENBdDZCRCxFQXM2QkduakIsSUF0NkJIOzs7QUNBQSxDQUFDLFlBQVc7QUFDVixNQUFNOHhDLGVBQWUsU0FBZkEsWUFBZSxDQUFDaHNCLEtBQUQsRUFBVztBQUM5QixRQUFJdGtCLFNBQVNza0IsTUFBTXRrQixNQUFuQjtBQUNBLFFBQUlwQixhQUFhb0IsT0FBT3NwQixPQUFQLENBQWUsV0FBZixDQUFqQjs7QUFFQTFxQixlQUFXdUgsU0FBWCxDQUFxQnlrQixNQUFyQixDQUE0QixNQUE1QjtBQUNELEdBTEQ7O0FBT0Y7QUFDRSxNQUFJMmxCLFVBQVVudkMsU0FBU29hLGdCQUFULENBQTBCLHFCQUExQixDQUFkOztBQUVBLE9BQUssSUFBSXRiLElBQUksQ0FBYixFQUFnQkEsSUFBSXF3QyxRQUFRcHdDLE1BQTVCLEVBQW9DRCxHQUFwQyxFQUF5QztBQUN2QyxRQUFJNEcsT0FBT3lwQyxRQUFRcndDLENBQVIsQ0FBWDs7QUFFQTRHLFNBQUs0QyxnQkFBTCxDQUFzQixPQUF0QixFQUErQjRtQyxZQUEvQjtBQUNEO0FBQ0YsQ0FoQkQ7OztBQ0FBaHBCLE9BQU8sVUFBVWhCLENBQVYsRUFBYTtBQUNsQjs7QUFFQTs7QUFDQTBYLGVBQWFoSSxJQUFiOztBQUVBO0FBQ0ExUCxJQUFFLGNBQUYsRUFDRytDLElBREgsQ0FDUSxXQURSLEVBRUc5aUIsV0FGSDs7QUFJQStmLElBQUUscUJBQUYsRUFBeUJrZSxJQUF6QixDQUE4QjtBQUM1Qm5tQyxVQUFNLFdBRHNCO0FBRTVCZ2tDLFVBQU0sT0FGc0I7QUFHNUJpRCxjQUFVLEtBSGtCO0FBSTVCamtDLFVBQU0sa0JBSnNCO0FBSzVCNmpDLFlBQVE7QUFMb0IsR0FBOUI7O0FBUUE7QUFDQTVlLElBQUUseUJBQUYsRUFBNkIyVSxPQUE3Qjs7QUFFQTtBQUNBLE1BQUl1VixTQUFTdnlDLElBQUk7QUFDZndOLGVBQVcsNkJBREk7QUFFZlUsWUFBUSxJQUZPO0FBR2ZQLFdBQU8sQ0FIUTtBQUlmb0IsY0FBVSxJQUpLO0FBS2ZLLHdCQUFvQjtBQUxMLEdBQUosQ0FBYjtBQU9ELENBOUJEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB0bnMgPSAoZnVuY3Rpb24gKCl7XG4vLyBPYmplY3Qua2V5c1xuaWYgKCFPYmplY3Qua2V5cykge1xuICBPYmplY3Qua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICBrZXlzLnB1c2gobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9O1xufVxuXG4vLyBDaGlsZE5vZGUucmVtb3ZlXG5pZighKFwicmVtb3ZlXCIgaW4gRWxlbWVudC5wcm90b3R5cGUpKXtcbiAgRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICBpZih0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciB3aW4gPSB3aW5kb3c7XG5cbnZhciByYWYgPSB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDE2KTsgfTtcblxudmFyIHdpbiQxID0gd2luZG93O1xuXG52YXIgY2FmID0gd2luJDEuY2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luJDEubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oaWQpeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gIHZhciBvYmosIG5hbWUsIGNvcHksXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sXG4gICAgICBpID0gMSxcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgob2JqID0gYXJndW1lbnRzW2ldKSAhPT0gbnVsbCkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBjb3B5ID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh0YXJnZXQgPT09IGNvcHkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RvcmFnZVZhbHVlICh2YWx1ZSkge1xuICByZXR1cm4gWyd0cnVlJywgJ2ZhbHNlJ10uaW5kZXhPZih2YWx1ZSkgPj0gMCA/IEpTT04ucGFyc2UodmFsdWUpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHNldExvY2FsU3RvcmFnZShzdG9yYWdlLCBrZXksIHZhbHVlLCBhY2Nlc3MpIHtcbiAgaWYgKGFjY2Vzcykge1xuICAgIHRyeSB7IHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTsgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldFNsaWRlSWQoKSB7XG4gIHZhciBpZCA9IHdpbmRvdy50bnNJZDtcbiAgd2luZG93LnRuc0lkID0gIWlkID8gMSA6IGlkICsgMTtcbiAgXG4gIHJldHVybiAndG5zJyArIHdpbmRvdy50bnNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0Qm9keSAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBkb2MuYm9keTtcblxuICBpZiAoIWJvZHkpIHtcbiAgICBib2R5ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2JvZHknKTtcbiAgICBib2R5LmZha2UgPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59XG5cbnZhciBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5mdW5jdGlvbiBzZXRGYWtlQm9keSAoYm9keSkge1xuICB2YXIgZG9jT3ZlcmZsb3cgPSAnJztcbiAgaWYgKGJvZHkuZmFrZSkge1xuICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcbiAgICAvL2F2b2lkIGNyYXNoaW5nIElFOCwgaWYgYmFja2dyb3VuZCBpbWFnZSBpcyB1c2VkXG4gICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gICAgLy9TYWZhcmkgNS4xMy81LjEuNCBPU1ggc3RvcHMgbG9hZGluZyBpZiA6Oi13ZWJraXQtc2Nyb2xsYmFyIGlzIHVzZWQgYW5kIHNjcm9sbGJhcnMgYXJlIHZpc2libGVcbiAgICBib2R5LnN0eWxlLm92ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XG4gIH1cblxuICByZXR1cm4gZG9jT3ZlcmZsb3c7XG59XG5cbmZ1bmN0aW9uIHJlc2V0RmFrZUJvZHkgKGJvZHksIGRvY092ZXJmbG93KSB7XG4gIGlmIChib2R5LmZha2UpIHtcbiAgICBib2R5LnJlbW92ZSgpO1xuICAgIGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBkb2NPdmVyZmxvdztcbiAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICB9XG59XG5cbi8vIGdldCBjc3MtY2FsYyBcblxuZnVuY3Rpb24gY2FsYygpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LCBcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgdHJ5IHtcbiAgICB2YXIgc3RyID0gJygxMHB4ICogMTApJyxcbiAgICAgICAgdmFscyA9IFsnY2FsYycgKyBzdHIsICctbW96LWNhbGMnICsgc3RyLCAnLXdlYmtpdC1jYWxjJyArIHN0cl0sXG4gICAgICAgIHZhbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgdmFsID0gdmFsc1tpXTtcbiAgICAgIGRpdi5zdHlsZS53aWR0aCA9IHZhbDtcbiAgICAgIGlmIChkaXYub2Zmc2V0V2lkdGggPT09IDEwMCkgeyBcbiAgICAgICAgcmVzdWx0ID0gdmFsLnJlcGxhY2Uoc3RyLCAnJyk7IFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIFxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGRpdi5yZW1vdmUoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBnZXQgc3VicGl4ZWwgc3VwcG9ydCB2YWx1ZVxuXG5mdW5jdGlvbiBwZXJjZW50YWdlTGF5b3V0KCkge1xuICAvLyBjaGVjayBzdWJwaXhlbCBsYXlvdXQgc3VwcG9ydGluZ1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIHdyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBvdXRlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIHN0ciA9ICcnLFxuICAgICAgY291bnQgPSA3MCxcbiAgICAgIHBlclBhZ2UgPSAzLFxuICAgICAgc3VwcG9ydGVkID0gZmFsc2U7XG5cbiAgd3JhcHBlci5jbGFzc05hbWUgPSBcInRucy10LXN1YnAyXCI7XG4gIG91dGVyLmNsYXNzTmFtZSA9IFwidG5zLXQtY3RcIjtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICBzdHIgKz0gJzxkaXY+PC9kaXY+JztcbiAgfVxuXG4gIG91dGVyLmlubmVySFRNTCA9IHN0cjtcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlcik7XG4gIGJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cbiAgc3VwcG9ydGVkID0gTWF0aC5hYnMod3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gb3V0ZXIuY2hpbGRyZW5bY291bnQgLSBwZXJQYWdlXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSA8IDI7XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiB3cmFwcGVyLnJlbW92ZSgpO1xuXG4gIHJldHVybiBzdXBwb3J0ZWQ7XG59XG5cbmZ1bmN0aW9uIG1lZGlhcXVlcnlTdXBwb3J0ICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBzdHlsZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgcnVsZSA9ICdAbWVkaWEgYWxsIGFuZCAobWluLXdpZHRoOjFweCl7LnRucy1tcS10ZXN0e3Bvc2l0aW9uOmFic29sdXRlfX0nLFxuICAgICAgcG9zaXRpb247XG5cbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIGRpdi5jbGFzc05hbWUgPSAndG5zLW1xLXRlc3QnO1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICBib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBydWxlO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XG4gIH1cblxuICBwb3NpdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2KS5wb3NpdGlvbiA6IGRpdi5jdXJyZW50U3R5bGVbJ3Bvc2l0aW9uJ107XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBkaXYucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHBvc2l0aW9uID09PSBcImFic29sdXRlXCI7XG59XG5cbi8vIGNyZWF0ZSBhbmQgYXBwZW5kIHN0eWxlIHNoZWV0XG5mdW5jdGlvbiBjcmVhdGVTdHlsZVNoZWV0IChtZWRpYSkge1xuICAvLyBDcmVhdGUgdGhlIDxzdHlsZT4gdGFnXG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvY3NzXCIpO1xuXG4gIC8vIEFkZCBhIG1lZGlhIChhbmQvb3IgbWVkaWEgcXVlcnkpIGhlcmUgaWYgeW91J2QgbGlrZSFcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgXCJzY3JlZW5cIilcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6IDEwMjRweClcIilcbiAgaWYgKG1lZGlhKSB7IHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKTsgfVxuXG4gIC8vIFdlYktpdCBoYWNrIDooXG4gIC8vIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpKTtcblxuICAvLyBBZGQgdGhlIDxzdHlsZT4gZWxlbWVudCB0byB0aGUgcGFnZVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gIHJldHVybiBzdHlsZS5zaGVldCA/IHN0eWxlLnNoZWV0IDogc3R5bGUuc3R5bGVTaGVldDtcbn1cblxuLy8gY3Jvc3MgYnJvd3NlcnMgYWRkUnVsZSBtZXRob2RcbmZ1bmN0aW9uIGFkZENTU1J1bGUoc2hlZXQsIHNlbGVjdG9yLCBydWxlcywgaW5kZXgpIHtcbiAgLy8gcmV0dXJuIHJhZihmdW5jdGlvbigpIHtcbiAgICAnaW5zZXJ0UnVsZScgaW4gc2hlZXQgP1xuICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIHJ1bGVzICsgJ30nLCBpbmRleCkgOlxuICAgICAgc2hlZXQuYWRkUnVsZShzZWxlY3RvciwgcnVsZXMsIGluZGV4KTtcbiAgLy8gfSk7XG59XG5cbi8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXG5mdW5jdGlvbiByZW1vdmVDU1NSdWxlKHNoZWV0LCBpbmRleCkge1xuICAvLyByZXR1cm4gcmFmKGZ1bmN0aW9uKCkge1xuICAgICdkZWxldGVSdWxlJyBpbiBzaGVldCA/XG4gICAgICBzaGVldC5kZWxldGVSdWxlKGluZGV4KSA6XG4gICAgICBzaGVldC5yZW1vdmVSdWxlKGluZGV4KTtcbiAgLy8gfSk7XG59XG5cbmZ1bmN0aW9uIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSB7XG4gIHZhciBydWxlID0gKCdpbnNlcnRSdWxlJyBpbiBzaGVldCkgPyBzaGVldC5jc3NSdWxlcyA6IHNoZWV0LnJ1bGVzO1xuICByZXR1cm4gcnVsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIHRvRGVncmVlICh5LCB4KSB7XG4gIHJldHVybiBNYXRoLmF0YW4yKHksIHgpICogKDE4MCAvIE1hdGguUEkpO1xufVxuXG5mdW5jdGlvbiBnZXRUb3VjaERpcmVjdGlvbihhbmdsZSwgcmFuZ2UpIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGZhbHNlLFxuICAgICAgZ2FwID0gTWF0aC5hYnMoOTAgLSBNYXRoLmFicyhhbmdsZSkpO1xuICAgICAgXG4gIGlmIChnYXAgPj0gOTAgLSByYW5nZSkge1xuICAgIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgfSBlbHNlIGlmIChnYXAgPD0gcmFuZ2UpIHtcbiAgICBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGlvbjtcbn1cblxuLy8gaHR0cHM6Ly90b2RkbW90dG8uY29tL2RpdGNoLXRoZS1hcnJheS1mb3JlYWNoLWNhbGwtbm9kZWxpc3QtaGFjay9cbmZ1bmN0aW9uIGZvckVhY2ggKGFyciwgY2FsbGJhY2ssIHNjb3BlKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGFycltpXSwgaSk7XG4gIH1cbn1cblxudmFyIGNsYXNzTGlzdFN1cHBvcnQgPSAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdfJyk7XG5cbnZhciBoYXNDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7IHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoc3RyKTsgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTmFtZS5pbmRleE9mKHN0cikgPj0gMDsgfTtcblxudmFyIGFkZENsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmICghaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5hZGQoc3RyKTsgfVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoIWhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc05hbWUgKz0gJyAnICsgc3RyOyB9XG4gICAgfTtcblxudmFyIHJlbW92ZUNsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NMaXN0LnJlbW92ZShzdHIpOyB9XG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhlbCwgc3RyKSkgeyBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShzdHIsICcnKTsgfVxuICAgIH07XG5cbmZ1bmN0aW9uIGhhc0F0dHIoZWwsIGF0dHIpIHtcbiAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShhdHRyKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXR0cihlbCwgYXR0cikge1xuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xufVxuXG5mdW5jdGlvbiBpc05vZGVMaXN0KGVsKSB7XG4gIC8vIE9ubHkgTm9kZUxpc3QgaGFzIHRoZSBcIml0ZW0oKVwiIGZ1bmN0aW9uXG4gIHJldHVybiB0eXBlb2YgZWwuaXRlbSAhPT0gXCJ1bmRlZmluZWRcIjsgXG59XG5cbmZ1bmN0aW9uIHNldEF0dHJzKGVscywgYXR0cnMpIHtcbiAgZWxzID0gKGlzTm9kZUxpc3QoZWxzKSB8fCBlbHMgaW5zdGFuY2VvZiBBcnJheSkgPyBlbHMgOiBbZWxzXTtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhdHRycykgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7IHJldHVybjsgfVxuXG4gIGZvciAodmFyIGkgPSBlbHMubGVuZ3RoOyBpLS07KSB7XG4gICAgZm9yKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgIGVsc1tpXS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQXR0cnMoZWxzLCBhdHRycykge1xuICBlbHMgPSAoaXNOb2RlTGlzdChlbHMpIHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSA/IGVscyA6IFtlbHNdO1xuICBhdHRycyA9IChhdHRycyBpbnN0YW5jZW9mIEFycmF5KSA/IGF0dHJzIDogW2F0dHJzXTtcblxuICB2YXIgYXR0ckxlbmd0aCA9IGF0dHJzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IGVscy5sZW5ndGg7IGktLTspIHtcbiAgICBmb3IgKHZhciBqID0gYXR0ckxlbmd0aDsgai0tOykge1xuICAgICAgZWxzW2ldLnJlbW92ZUF0dHJpYnV0ZShhdHRyc1tqXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFycmF5RnJvbU5vZGVMaXN0IChubCkge1xuICB2YXIgYXJyID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gbmwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYXJyLnB1c2gobmxbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGhpZGVFbGVtZW50KGVsLCBmb3JjZUhpZGUpIHtcbiAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykgeyBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyB9XG59XG5cbmZ1bmN0aW9uIHNob3dFbGVtZW50KGVsLCBmb3JjZUhpZGUpIHtcbiAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykgeyBlbC5zdHlsZS5kaXNwbGF5ID0gJyc7IH1cbn1cblxuZnVuY3Rpb24gaXNWaXNpYmxlKGVsKSB7XG4gIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSAhPT0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB3aGljaFByb3BlcnR5KHByb3BzKXtcbiAgaWYgKHR5cGVvZiBwcm9wcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgYXJyID0gW3Byb3BzXSxcbiAgICAgICAgUHJvcHMgPSBwcm9wcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BzLnN1YnN0cigxKSxcbiAgICAgICAgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnLCAnTyddO1xuICAgICAgICBcbiAgICBwcmVmaXhlcy5mb3JFYWNoKGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgaWYgKHByZWZpeCAhPT0gJ21zJyB8fCBwcm9wcyA9PT0gJ3RyYW5zZm9ybScpIHtcbiAgICAgICAgYXJyLnB1c2gocHJlZml4ICsgUHJvcHMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcHJvcHMgPSBhcnI7XG4gIH1cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmYWtlZWxlbWVudCcpLFxuICAgICAgbGVuID0gcHJvcHMubGVuZ3RoO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspe1xuICAgIHZhciBwcm9wID0gcHJvcHNbaV07XG4gICAgaWYoIGVsLnN0eWxlW3Byb3BdICE9PSB1bmRlZmluZWQgKXsgcmV0dXJuIHByb3A7IH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTsgLy8gZXhwbGljaXQgZm9yIGllOS1cbn1cblxuZnVuY3Rpb24gaGFzM0RUcmFuc2Zvcm1zKHRmKXtcbiAgaWYgKCF0ZikgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKCF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpLFxuICAgICAgaGFzM2QsXG4gICAgICBjc3NURiA9IHRmLmxlbmd0aCA+IDkgPyAnLScgKyB0Zi5zbGljZSgwLCAtOSkudG9Mb3dlckNhc2UoKSArICctJyA6ICcnO1xuXG4gIGNzc1RGICs9ICd0cmFuc2Zvcm0nO1xuXG4gIC8vIEFkZCBpdCB0byB0aGUgYm9keSB0byBnZXQgdGhlIGNvbXB1dGVkIHN0eWxlXG4gIGJvZHkuaW5zZXJ0QmVmb3JlKGVsLCBudWxsKTtcblxuICBlbC5zdHlsZVt0Zl0gPSAndHJhbnNsYXRlM2QoMXB4LDFweCwxcHgpJztcbiAgaGFzM2QgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShjc3NURik7XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBlbC5yZW1vdmUoKTtcblxuICByZXR1cm4gKGhhczNkICE9PSB1bmRlZmluZWQgJiYgaGFzM2QubGVuZ3RoID4gMCAmJiBoYXMzZCAhPT0gXCJub25lXCIpO1xufVxuXG4vLyBnZXQgdHJhbnNpdGlvbmVuZCwgYW5pbWF0aW9uZW5kIGJhc2VkIG9uIHRyYW5zaXRpb25EdXJhdGlvblxuLy8gQHByb3Bpbjogc3RyaW5nXG4vLyBAcHJvcE91dDogc3RyaW5nLCBmaXJzdC1sZXR0ZXIgdXBwZXJjYXNlXG4vLyBVc2FnZTogZ2V0RW5kUHJvcGVydHkoJ1dlYmtpdFRyYW5zaXRpb25EdXJhdGlvbicsICdUcmFuc2l0aW9uJykgPT4gd2Via2l0VHJhbnNpdGlvbkVuZFxuZnVuY3Rpb24gZ2V0RW5kUHJvcGVydHkocHJvcEluLCBwcm9wT3V0KSB7XG4gIHZhciBlbmRQcm9wID0gZmFsc2U7XG4gIGlmICgvXldlYmtpdC8udGVzdChwcm9wSW4pKSB7XG4gICAgZW5kUHJvcCA9ICd3ZWJraXQnICsgcHJvcE91dCArICdFbmQnO1xuICB9IGVsc2UgaWYgKC9eTy8udGVzdChwcm9wSW4pKSB7XG4gICAgZW5kUHJvcCA9ICdvJyArIHByb3BPdXQgKyAnRW5kJztcbiAgfSBlbHNlIGlmIChwcm9wSW4pIHtcbiAgICBlbmRQcm9wID0gcHJvcE91dC50b0xvd2VyQ2FzZSgpICsgJ2VuZCc7XG4gIH1cbiAgcmV0dXJuIGVuZFByb3A7XG59XG5cbi8vIFRlc3QgdmlhIGEgZ2V0dGVyIGluIHRoZSBvcHRpb25zIG9iamVjdCB0byBzZWUgaWYgdGhlIHBhc3NpdmUgcHJvcGVydHkgaXMgYWNjZXNzZWRcbnZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcbnRyeSB7XG4gIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIiwgbnVsbCwgb3B0cyk7XG59IGNhdGNoIChlKSB7fVxudmFyIHBhc3NpdmVPcHRpb24gPSBzdXBwb3J0c1Bhc3NpdmUgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlO1xuXG5mdW5jdGlvbiBhZGRFdmVudHMoZWwsIG9iaiwgcHJldmVudFNjcm9sbGluZykge1xuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwICYmICFwcmV2ZW50U2Nyb2xsaW5nID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50cyhlbCwgb2JqKSB7XG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgdmFyIG9wdGlvbiA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnXS5pbmRleE9mKHByb3ApID49IDAgPyBwYXNzaXZlT3B0aW9uIDogZmFsc2U7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihwcm9wLCBvYmpbcHJvcF0sIG9wdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gRXZlbnRzKCkge1xuICByZXR1cm4ge1xuICAgIHRvcGljczoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdID0gdGhpcy50b3BpY3NbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgIGRhdGEudHlwZSA9IGV2ZW50TmFtZTtcbiAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgIGZuKGRhdGEsIGV2ZW50TmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24ganNUcmFuc2Zvcm0oZWxlbWVudCwgYXR0ciwgcHJlZml4LCBwb3N0Zml4LCB0bywgZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciB0aWNrID0gTWF0aC5taW4oZHVyYXRpb24sIDEwKSxcbiAgICAgIHVuaXQgPSAodG8uaW5kZXhPZignJScpID49IDApID8gJyUnIDogJ3B4JyxcbiAgICAgIHRvID0gdG8ucmVwbGFjZSh1bml0LCAnJyksXG4gICAgICBmcm9tID0gTnVtYmVyKGVsZW1lbnQuc3R5bGVbYXR0cl0ucmVwbGFjZShwcmVmaXgsICcnKS5yZXBsYWNlKHBvc3RmaXgsICcnKS5yZXBsYWNlKHVuaXQsICcnKSksXG4gICAgICBwb3NpdGlvblRpY2sgPSAodG8gLSBmcm9tKSAvIGR1cmF0aW9uICogdGljayxcbiAgICAgIHJ1bm5pbmc7XG5cbiAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7XG4gIGZ1bmN0aW9uIG1vdmVFbGVtZW50KCkge1xuICAgIGR1cmF0aW9uIC09IHRpY2s7XG4gICAgZnJvbSArPSBwb3NpdGlvblRpY2s7XG4gICAgZWxlbWVudC5zdHlsZVthdHRyXSA9IHByZWZpeCArIGZyb20gKyB1bml0ICsgcG9zdGZpeDtcbiAgICBpZiAoZHVyYXRpb24gPiAwKSB7IFxuICAgICAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7IFxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgdG5zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gZXh0ZW5kKHtcbiAgICBjb250YWluZXI6ICcuc2xpZGVyJyxcbiAgICBtb2RlOiAnY2Fyb3VzZWwnLFxuICAgIGF4aXM6ICdob3Jpem9udGFsJyxcbiAgICBpdGVtczogMSxcbiAgICBndXR0ZXI6IDAsXG4gICAgZWRnZVBhZGRpbmc6IDAsXG4gICAgZml4ZWRXaWR0aDogZmFsc2UsXG4gICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICB2aWV3cG9ydE1heDogZmFsc2UsXG4gICAgc2xpZGVCeTogMSxcbiAgICBjZW50ZXI6IGZhbHNlLFxuICAgIGNvbnRyb2xzOiB0cnVlLFxuICAgIGNvbnRyb2xzUG9zaXRpb246ICd0b3AnLFxuICAgIGNvbnRyb2xzVGV4dDogWydwcmV2JywgJ25leHQnXSxcbiAgICBjb250cm9sc0NvbnRhaW5lcjogZmFsc2UsXG4gICAgcHJldkJ1dHRvbjogZmFsc2UsXG4gICAgbmV4dEJ1dHRvbjogZmFsc2UsXG4gICAgbmF2OiB0cnVlLFxuICAgIG5hdlBvc2l0aW9uOiAndG9wJyxcbiAgICBuYXZDb250YWluZXI6IGZhbHNlLFxuICAgIG5hdkFzVGh1bWJuYWlsczogZmFsc2UsXG4gICAgYXJyb3dLZXlzOiBmYWxzZSxcbiAgICBzcGVlZDogMzAwLFxuICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICBhdXRvcGxheVBvc2l0aW9uOiAndG9wJyxcbiAgICBhdXRvcGxheVRpbWVvdXQ6IDUwMDAsXG4gICAgYXV0b3BsYXlEaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgICBhdXRvcGxheVRleHQ6IFsnc3RhcnQnLCAnc3RvcCddLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogZmFsc2UsXG4gICAgYXV0b3BsYXlCdXR0b246IGZhbHNlLFxuICAgIGF1dG9wbGF5QnV0dG9uT3V0cHV0OiB0cnVlLFxuICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiAndG5zLWZhZGVJbicsXG4gICAgYW5pbWF0ZU91dDogJ3Rucy1mYWRlT3V0JyxcbiAgICBhbmltYXRlTm9ybWFsOiAndG5zLW5vcm1hbCcsXG4gICAgYW5pbWF0ZURlbGF5OiBmYWxzZSxcbiAgICBsb29wOiB0cnVlLFxuICAgIHJld2luZDogZmFsc2UsXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXG4gICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgbGF6eWxvYWQ6IGZhbHNlLFxuICAgIGxhenlsb2FkU2VsZWN0b3I6ICcudG5zLWxhenktaW1nJyxcbiAgICB0b3VjaDogdHJ1ZSxcbiAgICBtb3VzZURyYWc6IGZhbHNlLFxuICAgIHN3aXBlQW5nbGU6IDE1LFxuICAgIG5lc3RlZDogZmFsc2UsXG4gICAgcHJldmVudEFjdGlvbldoZW5SdW5uaW5nOiBmYWxzZSxcbiAgICBwcmV2ZW50U2Nyb2xsT25Ub3VjaDogZmFsc2UsXG4gICAgZnJlZXphYmxlOiB0cnVlLFxuICAgIG9uSW5pdDogZmFsc2UsXG4gICAgdXNlTG9jYWxTdG9yYWdlOiB0cnVlXG4gIH0sIG9wdGlvbnMgfHwge30pO1xuICBcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgd2luID0gd2luZG93LFxuICAgICAgS0VZUyA9IHtcbiAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgIExFRlQ6IDM3LFxuICAgICAgICBSSUdIVDogMzlcbiAgICAgIH0sXG4gICAgICB0bnNTdG9yYWdlID0ge30sXG4gICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBvcHRpb25zLnVzZUxvY2FsU3RvcmFnZTtcblxuICBpZiAobG9jYWxTdG9yYWdlQWNjZXNzKSB7XG4gICAgLy8gY2hlY2sgYnJvd3NlciB2ZXJzaW9uIGFuZCBsb2NhbCBzdG9yYWdlIGFjY2Vzc1xuICAgIHZhciBicm93c2VySW5mbyA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgdmFyIHVpZCA9IG5ldyBEYXRlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRuc1N0b3JhZ2UgPSB3aW4ubG9jYWxTdG9yYWdlO1xuICAgICAgaWYgKHRuc1N0b3JhZ2UpIHtcbiAgICAgICAgdG5zU3RvcmFnZS5zZXRJdGVtKHVpZCwgdWlkKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gdG5zU3RvcmFnZS5nZXRJdGVtKHVpZCkgPT0gdWlkO1xuICAgICAgICB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0odWlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2VBY2Nlc3MpIHsgdG5zU3RvcmFnZSA9IHt9OyB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlQWNjZXNzKSB7XG4gICAgICAvLyByZW1vdmUgc3RvcmFnZSB3aGVuIGJyb3dzZXIgdmVyc2lvbiBjaGFuZ2VzXG4gICAgICBpZiAodG5zU3RvcmFnZVsndG5zQXBwJ10gJiYgdG5zU3RvcmFnZVsndG5zQXBwJ10gIT09IGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIFsndEMnLCAndFBMJywgJ3RNUScsICd0VGYnLCAndDNEJywgJ3RURHUnLCAndFREZScsICd0QUR1JywgJ3RBRGUnLCAndFRFJywgJ3RBRSddLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0oaXRlbSk7IH0pO1xuICAgICAgfVxuICAgICAgLy8gdXBkYXRlIGJyb3dzZXJJbmZvXG4gICAgICBsb2NhbFN0b3JhZ2VbJ3Ruc0FwcCddID0gYnJvd3NlckluZm87XG4gICAgfVxuICB9XG5cbiAgdmFyIENBTEMgPSB0bnNTdG9yYWdlWyd0QyddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEMnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RDJywgY2FsYygpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgUEVSQ0VOVEFHRUxBWU9VVCA9IHRuc1N0b3JhZ2VbJ3RQTCddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFBMJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0UEwnLCBwZXJjZW50YWdlTGF5b3V0KCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBDU1NNUSA9IHRuc1N0b3JhZ2VbJ3RNUSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndE1RJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0TVEnLCBtZWRpYXF1ZXJ5U3VwcG9ydCgpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNGT1JNID0gdG5zU3RvcmFnZVsndFRmJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VGYnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RUZicsIHdoaWNoUHJvcGVydHkoJ3RyYW5zZm9ybScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgSEFTM0RUUkFOU0ZPUk1TID0gdG5zU3RvcmFnZVsndDNEJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0M0QnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3QzRCcsIGhhczNEVHJhbnNmb3JtcyhUUkFOU0ZPUk0pLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkRVUkFUSU9OID0gdG5zU3RvcmFnZVsndFREdSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFREdSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFREdScsIHdoaWNoUHJvcGVydHkoJ3RyYW5zaXRpb25EdXJhdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkRFTEFZID0gdG5zU3RvcmFnZVsndFREZSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFREZSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFREZScsIHdoaWNoUHJvcGVydHkoJ3RyYW5zaXRpb25EZWxheScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9ORFVSQVRJT04gPSB0bnNTdG9yYWdlWyd0QUR1J10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QUR1J10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUR1Jywgd2hpY2hQcm9wZXJ0eSgnYW5pbWF0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkRFTEFZID0gdG5zU3RvcmFnZVsndEFEZSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFEZSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFEZScsIHdoaWNoUHJvcGVydHkoJ2FuaW1hdGlvbkRlbGF5JyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9ORU5EID0gdG5zU3RvcmFnZVsndFRFJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VEUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURScsIGdldEVuZFByb3BlcnR5KFRSQU5TSVRJT05EVVJBVElPTiwgJ1RyYW5zaXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkVORCA9IHRuc1N0b3JhZ2VbJ3RBRSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFFJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUUnLCBnZXRFbmRQcm9wZXJ0eShBTklNQVRJT05EVVJBVElPTiwgJ0FuaW1hdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpO1xuXG4gIC8vIGdldCBlbGVtZW50IG5vZGVzIGZyb20gc2VsZWN0b3JzXG4gIHZhciBzdXBwb3J0Q29uc29sZVdhcm4gPSB3aW4uY29uc29sZSAmJiB0eXBlb2Ygd2luLmNvbnNvbGUud2FybiA9PT0gXCJmdW5jdGlvblwiLFxuICAgICAgdG5zTGlzdCA9IFsnY29udGFpbmVyJywgJ2NvbnRyb2xzQ29udGFpbmVyJywgJ3ByZXZCdXR0b24nLCAnbmV4dEJ1dHRvbicsICduYXZDb250YWluZXInLCAnYXV0b3BsYXlCdXR0b24nXSwgXG4gICAgICBvcHRpb25zRWxlbWVudHMgPSB7fTtcbiAgICAgIFxuICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tpdGVtXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBzdHIgPSBvcHRpb25zW2l0ZW1dLFxuICAgICAgICAgIGVsID0gZG9jLnF1ZXJ5U2VsZWN0b3Ioc3RyKTtcbiAgICAgIG9wdGlvbnNFbGVtZW50c1tpdGVtXSA9IHN0cjtcblxuICAgICAgaWYgKGVsICYmIGVsLm5vZGVOYW1lKSB7XG4gICAgICAgIG9wdGlvbnNbaXRlbV0gPSBlbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdDYW5cXCd0IGZpbmQnLCBvcHRpb25zW2l0ZW1dKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBtYWtlIHN1cmUgYXQgbGVhc3QgMSBzbGlkZVxuICBpZiAob3B0aW9ucy5jb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdObyBzbGlkZXMgZm91bmQgaW4nLCBvcHRpb25zLmNvbnRhaW5lcik7IH1cbiAgICByZXR1cm47XG4gICB9XG5cbiAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgdmFyIHJlc3BvbnNpdmUgPSBvcHRpb25zLnJlc3BvbnNpdmUsXG4gICAgICBuZXN0ZWQgPSBvcHRpb25zLm5lc3RlZCxcbiAgICAgIGNhcm91c2VsID0gb3B0aW9ucy5tb2RlID09PSAnY2Fyb3VzZWwnID8gdHJ1ZSA6IGZhbHNlO1xuXG4gIGlmIChyZXNwb25zaXZlKSB7XG4gICAgLy8gYXBwbHkgcmVzcG9uc2l2ZVswXSB0byBvcHRpb25zIGFuZCByZW1vdmUgaXRcbiAgICBpZiAoMCBpbiByZXNwb25zaXZlKSB7XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMsIHJlc3BvbnNpdmVbMF0pO1xuICAgICAgZGVsZXRlIHJlc3BvbnNpdmVbMF07XG4gICAgfVxuXG4gICAgdmFyIHJlc3BvbnNpdmVUZW0gPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgdmFyIHZhbCA9IHJlc3BvbnNpdmVba2V5XTtcbiAgICAgIC8vIHVwZGF0ZSByZXNwb25zaXZlXG4gICAgICAvLyBmcm9tOiAzMDA6IDJcbiAgICAgIC8vIHRvOiBcbiAgICAgIC8vICAgMzAwOiB7IFxuICAgICAgLy8gICAgIGl0ZW1zOiAyIFxuICAgICAgLy8gICB9IFxuICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyB7aXRlbXM6IHZhbH0gOiB2YWw7XG4gICAgICByZXNwb25zaXZlVGVtW2tleV0gPSB2YWw7XG4gICAgfVxuICAgIHJlc3BvbnNpdmUgPSByZXNwb25zaXZlVGVtO1xuICAgIHJlc3BvbnNpdmVUZW0gPSBudWxsO1xuICB9XG5cbiAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgZnVuY3Rpb24gdXBkYXRlT3B0aW9ucyAob2JqKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoa2V5ID09PSAnc2xpZGVCeScpIHsgb2JqW2tleV0gPSAncGFnZSc7IH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2VkZ2VQYWRkaW5nJykgeyBvYmpba2V5XSA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChrZXkgPT09ICdhdXRvSGVpZ2h0JykgeyBvYmpba2V5XSA9IGZhbHNlOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSByZXNwb25zaXZlIG9wdGlvbnNcbiAgICAgIGlmIChrZXkgPT09ICdyZXNwb25zaXZlJykgeyB1cGRhdGVPcHRpb25zKG9ialtrZXldKTsgfVxuICAgIH1cbiAgfVxuICBpZiAoIWNhcm91c2VsKSB7IHVwZGF0ZU9wdGlvbnMob3B0aW9ucyk7IH1cblxuXG4gIC8vID09PSBkZWZpbmUgYW5kIHNldCB2YXJpYWJsZXMgPT09XG4gIGlmICghY2Fyb3VzZWwpIHtcbiAgICBvcHRpb25zLmF4aXMgPSAnaG9yaXpvbnRhbCc7XG4gICAgb3B0aW9ucy5zbGlkZUJ5ID0gJ3BhZ2UnO1xuICAgIG9wdGlvbnMuZWRnZVBhZGRpbmcgPSBmYWxzZTtcblxuICAgIHZhciBhbmltYXRlSW4gPSBvcHRpb25zLmFuaW1hdGVJbixcbiAgICAgICAgYW5pbWF0ZU91dCA9IG9wdGlvbnMuYW5pbWF0ZU91dCxcbiAgICAgICAgYW5pbWF0ZURlbGF5ID0gb3B0aW9ucy5hbmltYXRlRGVsYXksXG4gICAgICAgIGFuaW1hdGVOb3JtYWwgPSBvcHRpb25zLmFuaW1hdGVOb3JtYWw7XG4gIH1cblxuICB2YXIgaG9yaXpvbnRhbCA9IG9wdGlvbnMuYXhpcyA9PT0gJ2hvcml6b250YWwnID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgb3V0ZXJXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgaW5uZXJXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgbWlkZGxlV3JhcHBlcixcbiAgICAgIGNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyLFxuICAgICAgY29udGFpbmVyUGFyZW50ID0gY29udGFpbmVyLnBhcmVudE5vZGUsXG4gICAgICBjb250YWluZXJIVE1MID0gY29udGFpbmVyLm91dGVySFRNTCxcbiAgICAgIHNsaWRlSXRlbXMgPSBjb250YWluZXIuY2hpbGRyZW4sXG4gICAgICBzbGlkZUNvdW50ID0gc2xpZGVJdGVtcy5sZW5ndGgsXG4gICAgICBicmVha3BvaW50Wm9uZSxcbiAgICAgIHdpbmRvd1dpZHRoID0gZ2V0V2luZG93V2lkdGgoKSxcbiAgICAgIGlzT24gPSBmYWxzZTtcbiAgaWYgKHJlc3BvbnNpdmUpIHsgc2V0QnJlYWtwb2ludFpvbmUoKTsgfVxuICBpZiAoY2Fyb3VzZWwpIHsgY29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRucy12cGZpeCc7IH1cblxuICAvLyBmaXhlZFdpZHRoOiB2aWV3cG9ydCA+IHJpZ2h0Qm91bmRhcnkgPiBpbmRleE1heFxuICB2YXIgYXV0b1dpZHRoID0gb3B0aW9ucy5hdXRvV2lkdGgsXG4gICAgICBmaXhlZFdpZHRoID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJyksXG4gICAgICBlZGdlUGFkZGluZyA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnKSxcbiAgICAgIGd1dHRlciA9IGdldE9wdGlvbignZ3V0dGVyJyksXG4gICAgICB2aWV3cG9ydCA9IGdldFZpZXdwb3J0V2lkdGgoKSxcbiAgICAgIGNlbnRlciA9IGdldE9wdGlvbignY2VudGVyJyksXG4gICAgICBpdGVtcyA9ICFhdXRvV2lkdGggPyBNYXRoLmZsb29yKGdldE9wdGlvbignaXRlbXMnKSkgOiAxLFxuICAgICAgc2xpZGVCeSA9IGdldE9wdGlvbignc2xpZGVCeScpLFxuICAgICAgdmlld3BvcnRNYXggPSBvcHRpb25zLnZpZXdwb3J0TWF4IHx8IG9wdGlvbnMuZml4ZWRXaWR0aFZpZXdwb3J0V2lkdGgsXG4gICAgICBhcnJvd0tleXMgPSBnZXRPcHRpb24oJ2Fycm93S2V5cycpLFxuICAgICAgc3BlZWQgPSBnZXRPcHRpb24oJ3NwZWVkJyksXG4gICAgICByZXdpbmQgPSBvcHRpb25zLnJld2luZCxcbiAgICAgIGxvb3AgPSByZXdpbmQgPyBmYWxzZSA6IG9wdGlvbnMubG9vcCxcbiAgICAgIGF1dG9IZWlnaHQgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnKSxcbiAgICAgIGNvbnRyb2xzID0gZ2V0T3B0aW9uKCdjb250cm9scycpLFxuICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKSxcbiAgICAgIG5hdiA9IGdldE9wdGlvbignbmF2JyksXG4gICAgICB0b3VjaCA9IGdldE9wdGlvbigndG91Y2gnKSxcbiAgICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyksXG4gICAgICBhdXRvcGxheSA9IGdldE9wdGlvbignYXV0b3BsYXknKSxcbiAgICAgIGF1dG9wbGF5VGltZW91dCA9IGdldE9wdGlvbignYXV0b3BsYXlUaW1lb3V0JyksXG4gICAgICBhdXRvcGxheVRleHQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGV4dCcpLFxuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID0gZ2V0T3B0aW9uKCdhdXRvcGxheUhvdmVyUGF1c2UnKSxcbiAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5UmVzZXRPblZpc2liaWxpdHknKSxcbiAgICAgIHNoZWV0ID0gY3JlYXRlU3R5bGVTaGVldCgpLFxuICAgICAgbGF6eWxvYWQgPSBvcHRpb25zLmxhenlsb2FkLFxuICAgICAgbGF6eWxvYWRTZWxlY3RvciA9IG9wdGlvbnMubGF6eWxvYWRTZWxlY3RvcixcbiAgICAgIHNsaWRlUG9zaXRpb25zLCAvLyBjb2xsZWN0aW9uIG9mIHNsaWRlIHBvc2l0aW9uc1xuICAgICAgc2xpZGVJdGVtc091dCA9IFtdLFxuICAgICAgY2xvbmVDb3VudCA9IGxvb3AgPyBnZXRDbG9uZUNvdW50Rm9yTG9vcCgpIDogMCxcbiAgICAgIHNsaWRlQ291bnROZXcgPSAhY2Fyb3VzZWwgPyBzbGlkZUNvdW50ICsgY2xvbmVDb3VudCA6IHNsaWRlQ291bnQgKyBjbG9uZUNvdW50ICogMixcbiAgICAgIGhhc1JpZ2h0RGVhZFpvbmUgPSAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpICYmICFsb29wID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgcmlnaHRCb3VuZGFyeSA9IGZpeGVkV2lkdGggPyBnZXRSaWdodEJvdW5kYXJ5KCkgOiBudWxsLFxuICAgICAgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSAoIWNhcm91c2VsIHx8ICFsb29wKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgIC8vIHRyYW5zZm9ybVxuICAgICAgdHJhbnNmb3JtQXR0ciA9IGhvcml6b250YWwgPyAnbGVmdCcgOiAndG9wJyxcbiAgICAgIHRyYW5zZm9ybVByZWZpeCA9ICcnLFxuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcnLFxuICAgICAgLy8gaW5kZXhcbiAgICAgIGdldEluZGV4TWF4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBjZW50ZXIgJiYgIWxvb3AgPyBzbGlkZUNvdW50IC0gMSA6IE1hdGguY2VpbCgtIHJpZ2h0Qm91bmRhcnkgLyAoZml4ZWRXaWR0aCArIGd1dHRlcikpOyB9O1xuICAgICAgICB9IGVsc2UgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzbGlkZUNvdW50TmV3OyBpLS07KSB7XG4gICAgICAgICAgICAgIGlmIChzbGlkZVBvc2l0aW9uc1tpXSA+PSAtIHJpZ2h0Qm91bmRhcnkpIHsgcmV0dXJuIGk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjZW50ZXIgJiYgY2Fyb3VzZWwgJiYgIWxvb3ApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNsaWRlQ291bnQgLSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGxvb3AgfHwgY2Fyb3VzZWwgPyBNYXRoLm1heCgwLCBzbGlkZUNvdW50TmV3IC0gTWF0aC5jZWlsKGl0ZW1zKSkgOiBzbGlkZUNvdW50TmV3IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KSgpLFxuICAgICAgaW5kZXggPSBnZXRTdGFydEluZGV4KGdldE9wdGlvbignc3RhcnRJbmRleCcpKSxcbiAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXgsXG4gICAgICBkaXNwbGF5SW5kZXggPSBnZXRDdXJyZW50U2xpZGUoKSxcbiAgICAgIGluZGV4TWluID0gMCxcbiAgICAgIGluZGV4TWF4ID0gIWF1dG9XaWR0aCA/IGdldEluZGV4TWF4KCkgOiBudWxsLFxuICAgICAgLy8gcmVzaXplXG4gICAgICByZXNpemVUaW1lcixcbiAgICAgIHByZXZlbnRBY3Rpb25XaGVuUnVubmluZyA9IG9wdGlvbnMucHJldmVudEFjdGlvbldoZW5SdW5uaW5nLFxuICAgICAgc3dpcGVBbmdsZSA9IG9wdGlvbnMuc3dpcGVBbmdsZSxcbiAgICAgIG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IHN3aXBlQW5nbGUgPyAnPycgOiB0cnVlLFxuICAgICAgcnVubmluZyA9IGZhbHNlLFxuICAgICAgb25Jbml0ID0gb3B0aW9ucy5vbkluaXQsXG4gICAgICBldmVudHMgPSBuZXcgRXZlbnRzKCksXG4gICAgICAvLyBpZCwgY2xhc3NcbiAgICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgPSAnIHRucy1zbGlkZXIgdG5zLScgKyBvcHRpb25zLm1vZGUsXG4gICAgICBzbGlkZUlkID0gY29udGFpbmVyLmlkIHx8IGdldFNsaWRlSWQoKSxcbiAgICAgIGRpc2FibGUgPSBnZXRPcHRpb24oJ2Rpc2FibGUnKSxcbiAgICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgICBmcmVlemFibGUgPSBvcHRpb25zLmZyZWV6YWJsZSxcbiAgICAgIGZyZWV6ZSA9IGZyZWV6YWJsZSAmJiAhYXV0b1dpZHRoID8gZ2V0RnJlZXplKCkgOiBmYWxzZSxcbiAgICAgIGZyb3plbiA9IGZhbHNlLFxuICAgICAgY29udHJvbHNFdmVudHMgPSB7XG4gICAgICAgICdjbGljayc6IG9uQ29udHJvbHNDbGljayxcbiAgICAgICAgJ2tleWRvd24nOiBvbkNvbnRyb2xzS2V5ZG93blxuICAgICAgfSxcbiAgICAgIG5hdkV2ZW50cyA9IHtcbiAgICAgICAgJ2NsaWNrJzogb25OYXZDbGljayxcbiAgICAgICAgJ2tleWRvd24nOiBvbk5hdktleWRvd25cbiAgICAgIH0sXG4gICAgICBob3ZlckV2ZW50cyA9IHtcbiAgICAgICAgJ21vdXNlb3Zlcic6IG1vdXNlb3ZlclBhdXNlLFxuICAgICAgICAnbW91c2VvdXQnOiBtb3VzZW91dFJlc3RhcnRcbiAgICAgIH0sXG4gICAgICB2aXNpYmlsaXR5RXZlbnQgPSB7J3Zpc2liaWxpdHljaGFuZ2UnOiBvblZpc2liaWxpdHlDaGFuZ2V9LFxuICAgICAgZG9jbWVudEtleWRvd25FdmVudCA9IHsna2V5ZG93bic6IG9uRG9jdW1lbnRLZXlkb3dufSxcbiAgICAgIHRvdWNoRXZlbnRzID0ge1xuICAgICAgICAndG91Y2hzdGFydCc6IG9uUGFuU3RhcnQsXG4gICAgICAgICd0b3VjaG1vdmUnOiBvblBhbk1vdmUsXG4gICAgICAgICd0b3VjaGVuZCc6IG9uUGFuRW5kLFxuICAgICAgICAndG91Y2hjYW5jZWwnOiBvblBhbkVuZFxuICAgICAgfSwgZHJhZ0V2ZW50cyA9IHtcbiAgICAgICAgJ21vdXNlZG93bic6IG9uUGFuU3RhcnQsXG4gICAgICAgICdtb3VzZW1vdmUnOiBvblBhbk1vdmUsXG4gICAgICAgICdtb3VzZXVwJzogb25QYW5FbmQsXG4gICAgICAgICdtb3VzZWxlYXZlJzogb25QYW5FbmRcbiAgICAgIH0sXG4gICAgICBoYXNDb250cm9scyA9IGhhc09wdGlvbignY29udHJvbHMnKSxcbiAgICAgIGhhc05hdiA9IGhhc09wdGlvbignbmF2JyksXG4gICAgICBuYXZBc1RodW1ibmFpbHMgPSBhdXRvV2lkdGggPyB0cnVlIDogb3B0aW9ucy5uYXZBc1RodW1ibmFpbHMsXG4gICAgICBoYXNBdXRvcGxheSA9IGhhc09wdGlvbignYXV0b3BsYXknKSxcbiAgICAgIGhhc1RvdWNoID0gaGFzT3B0aW9uKCd0b3VjaCcpLFxuICAgICAgaGFzTW91c2VEcmFnID0gaGFzT3B0aW9uKCdtb3VzZURyYWcnKSxcbiAgICAgIHNsaWRlQWN0aXZlQ2xhc3MgPSAndG5zLXNsaWRlLWFjdGl2ZScsXG4gICAgICBpbWdDb21wbGV0ZUNsYXNzID0gJ3Rucy1jb21wbGV0ZScsXG4gICAgICBpbWdFdmVudHMgPSB7XG4gICAgICAgICdsb2FkJzogb25JbWdMb2FkZWQsXG4gICAgICAgICdlcnJvcic6IG9uSW1nRmFpbGVkXG4gICAgICB9LFxuICAgICAgaW1nc0NvbXBsZXRlLFxuICAgICAgbGl2ZXJlZ2lvbkN1cnJlbnQsXG4gICAgICBwcmV2ZW50U2Nyb2xsID0gb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCA9PT0gJ2ZvcmNlJyA/IHRydWUgOiBmYWxzZTtcblxuICAvLyBjb250cm9sc1xuICBpZiAoaGFzQ29udHJvbHMpIHtcbiAgICB2YXIgY29udHJvbHNDb250YWluZXIgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyLFxuICAgICAgICBjb250cm9sc0NvbnRhaW5lckhUTUwgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyID8gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgcHJldkJ1dHRvbiA9IG9wdGlvbnMucHJldkJ1dHRvbixcbiAgICAgICAgbmV4dEJ1dHRvbiA9IG9wdGlvbnMubmV4dEJ1dHRvbixcbiAgICAgICAgcHJldkJ1dHRvbkhUTUwgPSBvcHRpb25zLnByZXZCdXR0b24gPyBvcHRpb25zLnByZXZCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIG5leHRCdXR0b25IVE1MID0gb3B0aW9ucy5uZXh0QnV0dG9uID8gb3B0aW9ucy5uZXh0QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBwcmV2SXNCdXR0b24sXG4gICAgICAgIG5leHRJc0J1dHRvbjtcbiAgfVxuXG4gIC8vIG5hdlxuICBpZiAoaGFzTmF2KSB7XG4gICAgdmFyIG5hdkNvbnRhaW5lciA9IG9wdGlvbnMubmF2Q29udGFpbmVyLFxuICAgICAgICBuYXZDb250YWluZXJIVE1MID0gb3B0aW9ucy5uYXZDb250YWluZXIgPyBvcHRpb25zLm5hdkNvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgbmF2SXRlbXMsXG4gICAgICAgIHBhZ2VzID0gYXV0b1dpZHRoID8gc2xpZGVDb3VudCA6IGdldFBhZ2VzKCksXG4gICAgICAgIHBhZ2VzQ2FjaGVkID0gMCxcbiAgICAgICAgbmF2Q2xpY2tlZCA9IC0xLFxuICAgICAgICBuYXZDdXJyZW50SW5kZXggPSBnZXRDdXJyZW50TmF2SW5kZXgoKSxcbiAgICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2Q3VycmVudEluZGV4LFxuICAgICAgICBuYXZBY3RpdmVDbGFzcyA9ICd0bnMtbmF2LWFjdGl2ZScsXG4gICAgICAgIG5hdlN0ciA9ICdDYXJvdXNlbCBQYWdlICcsXG4gICAgICAgIG5hdlN0ckN1cnJlbnQgPSAnIChDdXJyZW50IFNsaWRlKSc7XG4gIH1cblxuICAvLyBhdXRvcGxheVxuICBpZiAoaGFzQXV0b3BsYXkpIHtcbiAgICB2YXIgYXV0b3BsYXlEaXJlY3Rpb24gPSBvcHRpb25zLmF1dG9wbGF5RGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyAxIDogLTEsXG4gICAgICAgIGF1dG9wbGF5QnV0dG9uID0gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbixcbiAgICAgICAgYXV0b3BsYXlCdXR0b25IVE1MID0gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbiA/IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIGF1dG9wbGF5SHRtbFN0cmluZ3MgPSBbJzxzcGFuIGNsYXNzPVxcJ3Rucy12aXN1YWxseS1oaWRkZW5cXCc+JywgJyBhbmltYXRpb248L3NwYW4+J10sXG4gICAgICAgIGF1dG9wbGF5VGltZXIsXG4gICAgICAgIGFuaW1hdGluZyxcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCxcbiAgICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkLFxuICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQ7XG4gIH1cblxuICBpZiAoaGFzVG91Y2ggfHwgaGFzTW91c2VEcmFnKSB7XG4gICAgdmFyIGluaXRQb3NpdGlvbiA9IHt9LFxuICAgICAgICBsYXN0UG9zaXRpb24gPSB7fSxcbiAgICAgICAgdHJhbnNsYXRlSW5pdCxcbiAgICAgICAgZGlzWCxcbiAgICAgICAgZGlzWSxcbiAgICAgICAgcGFuU3RhcnQgPSBmYWxzZSxcbiAgICAgICAgcmFmSW5kZXgsXG4gICAgICAgIGdldERpc3QgPSBob3Jpem9udGFsID8gXG4gICAgICAgICAgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS54IC0gYi54OyB9IDpcbiAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnkgLSBiLnk7IH07XG4gIH1cbiAgXG4gIC8vIGRpc2FibGUgc2xpZGVyIHdoZW4gc2xpZGVjb3VudCA8PSBpdGVtc1xuICBpZiAoIWF1dG9XaWR0aCkgeyByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpOyB9XG5cbiAgaWYgKFRSQU5TRk9STSkge1xuICAgIHRyYW5zZm9ybUF0dHIgPSBUUkFOU0ZPUk07XG4gICAgdHJhbnNmb3JtUHJlZml4ID0gJ3RyYW5zbGF0ZSc7XG5cbiAgICBpZiAoSEFTM0RUUkFOU0ZPUk1TKSB7XG4gICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICczZCgnIDogJzNkKDBweCwgJztcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSBob3Jpem9udGFsID8gJywgMHB4LCAwcHgpJyA6ICcsIDBweCknO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICdYKCcgOiAnWSgnO1xuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcpJztcbiAgICB9XG5cbiAgfVxuXG4gIGlmIChjYXJvdXNlbCkgeyBjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCd0bnMtdnBmaXgnLCAnJyk7IH1cbiAgaW5pdFN0cnVjdHVyZSgpO1xuICBpbml0U2hlZXQoKTtcbiAgaW5pdFNsaWRlclRyYW5zZm9ybSgpO1xuXG4gIC8vID09PSBDT01NT04gRlVOQ1RJT05TID09PSAvL1xuICBmdW5jdGlvbiByZXNldFZhcmlibGVzV2hlbkRpc2FibGUgKGNvbmRpdGlvbikge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIGNvbnRyb2xzID0gbmF2ID0gdG91Y2ggPSBtb3VzZURyYWcgPSBhcnJvd0tleXMgPSBhdXRvcGxheSA9IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50U2xpZGUgKCkge1xuICAgIHZhciB0ZW0gPSBjYXJvdXNlbCA/IGluZGV4IC0gY2xvbmVDb3VudCA6IGluZGV4O1xuICAgIHdoaWxlICh0ZW0gPCAwKSB7IHRlbSArPSBzbGlkZUNvdW50OyB9XG4gICAgcmV0dXJuIHRlbSVzbGlkZUNvdW50ICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFN0YXJ0SW5kZXggKGluZCkge1xuICAgIGluZCA9IGluZCA/IE1hdGgubWF4KDAsIE1hdGgubWluKGxvb3AgPyBzbGlkZUNvdW50IC0gMSA6IHNsaWRlQ291bnQgLSBpdGVtcywgaW5kKSkgOiAwO1xuICAgIHJldHVybiBjYXJvdXNlbCA/IGluZCArIGNsb25lQ291bnQgOiBpbmQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBYnNJbmRleCAoaSkge1xuICAgIGlmIChpID09IG51bGwpIHsgaSA9IGluZGV4OyB9XG5cbiAgICBpZiAoY2Fyb3VzZWwpIHsgaSAtPSBjbG9uZUNvdW50OyB9XG4gICAgd2hpbGUgKGkgPCAwKSB7IGkgKz0gc2xpZGVDb3VudDsgfVxuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoaSVzbGlkZUNvdW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnROYXZJbmRleCAoKSB7XG4gICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgcmVzdWx0ID0gbmF2QXNUaHVtYm5haWxzID8gYWJzSW5kZXggOiBcbiAgICAgIGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoID8gTWF0aC5jZWlsKChhYnNJbmRleCArIDEpICogcGFnZXMgLyBzbGlkZUNvdW50IC0gMSkgOiBcbiAgICAgICAgICBNYXRoLmZsb29yKGFic0luZGV4IC8gaXRlbXMpO1xuXG4gICAgLy8gc2V0IGFjdGl2ZSBuYXYgdG8gdGhlIGxhc3Qgb25lIHdoZW4gcmVhY2hlcyB0aGUgcmlnaHQgZWRnZVxuICAgIGlmICghbG9vcCAmJiBjYXJvdXNlbCAmJiBpbmRleCA9PT0gaW5kZXhNYXgpIHsgcmVzdWx0ID0gcGFnZXMgLSAxOyB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXRlbXNNYXggKCkge1xuICAgIC8vIGZpeGVkV2lkdGggb3IgYXV0b1dpZHRoIHdoaWxlIHZpZXdwb3J0TWF4IGlzIG5vdCBhdmFpbGFibGVcbiAgICBpZiAoYXV0b1dpZHRoIHx8IChmaXhlZFdpZHRoICYmICF2aWV3cG9ydE1heCkpIHtcbiAgICAgIHJldHVybiBzbGlkZUNvdW50IC0gMTtcbiAgICAvLyBtb3N0IGNhc2VzXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdHIgPSBmaXhlZFdpZHRoID8gJ2ZpeGVkV2lkdGgnIDogJ2l0ZW1zJyxcbiAgICAgICAgICBhcnIgPSBbXTtcblxuICAgICAgaWYgKGZpeGVkV2lkdGggfHwgb3B0aW9uc1tzdHJdIDwgc2xpZGVDb3VudCkgeyBhcnIucHVzaChvcHRpb25zW3N0cl0pOyB9XG5cbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICB2YXIgdGVtID0gcmVzcG9uc2l2ZVticF1bc3RyXTtcbiAgICAgICAgICBpZiAodGVtICYmIChmaXhlZFdpZHRoIHx8IHRlbSA8IHNsaWRlQ291bnQpKSB7IGFyci5wdXNoKHRlbSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWFyci5sZW5ndGgpIHsgYXJyLnB1c2goMCk7IH1cblxuICAgICAgcmV0dXJuIE1hdGguY2VpbChmaXhlZFdpZHRoID8gdmlld3BvcnRNYXggLyBNYXRoLm1pbi5hcHBseShudWxsLCBhcnIpIDogTWF0aC5tYXguYXBwbHkobnVsbCwgYXJyKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2xvbmVDb3VudEZvckxvb3AgKCkge1xuICAgIHZhciBpdGVtc01heCA9IGdldEl0ZW1zTWF4KCksXG4gICAgICAgIHJlc3VsdCA9IGNhcm91c2VsID8gTWF0aC5jZWlsKChpdGVtc01heCAqIDUgLSBzbGlkZUNvdW50KS8yKSA6IChpdGVtc01heCAqIDQgLSBzbGlkZUNvdW50KTtcbiAgICByZXN1bHQgPSBNYXRoLm1heChpdGVtc01heCwgcmVzdWx0KTtcblxuICAgIHJldHVybiBoYXNPcHRpb24oJ2VkZ2VQYWRkaW5nJykgPyByZXN1bHQgKyAxIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2luZG93V2lkdGggKCkge1xuICAgIHJldHVybiB3aW4uaW5uZXJXaWR0aCB8fCBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvYy5ib2R5LmNsaWVudFdpZHRoO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5zZXJ0UG9zaXRpb24gKHBvcykge1xuICAgIHJldHVybiBwb3MgPT09ICd0b3AnID8gJ2FmdGVyYmVnaW4nIDogJ2JlZm9yZWVuZCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDbGllbnRXaWR0aCAoZWwpIHtcbiAgICB2YXIgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCByZWN0LCB3aWR0aDtcbiAgICBlbC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgd2lkdGggPSByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0O1xuICAgIGRpdi5yZW1vdmUoKTtcbiAgICByZXR1cm4gd2lkdGggfHwgZ2V0Q2xpZW50V2lkdGgoZWwucGFyZW50Tm9kZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaWV3cG9ydFdpZHRoICgpIHtcbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBlZGdlUGFkZGluZyAqIDIgLSBndXR0ZXIgOiAwO1xuICAgIHJldHVybiBnZXRDbGllbnRXaWR0aChjb250YWluZXJQYXJlbnQpIC0gZ2FwO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzT3B0aW9uIChpdGVtKSB7XG4gICAgaWYgKG9wdGlvbnNbaXRlbV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNpdmVbYnBdW2l0ZW1dKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBnZXQgb3B0aW9uOlxuICAvLyBmaXhlZCB3aWR0aDogdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlciA9PiBpdGVtc1xuICAvLyBvdGhlcnM6IHdpbmRvdyB3aWR0aCA9PiBhbGwgdmFyaWFibGVzXG4gIC8vIGFsbDogaXRlbXMgPT4gc2xpZGVCeVxuICBmdW5jdGlvbiBnZXRPcHRpb24gKGl0ZW0sIHd3KSB7XG4gICAgaWYgKHd3ID09IG51bGwpIHsgd3cgPSB3aW5kb3dXaWR0aDsgfVxuXG4gICAgaWYgKGl0ZW0gPT09ICdpdGVtcycgJiYgZml4ZWRXaWR0aCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHZpZXdwb3J0ICsgZ3V0dGVyKSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSkgfHwgMTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0ID0gb3B0aW9uc1tpdGVtXTtcblxuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIC8vIGJwOiBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgICBpZiAod3cgPj0gcGFyc2VJbnQoYnApKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbiByZXNwb25zaXZlW2JwXSkgeyByZXN1bHQgPSByZXNwb25zaXZlW2JwXVtpdGVtXTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSA9PT0gJ3NsaWRlQnknICYmIHJlc3VsdCA9PT0gJ3BhZ2UnKSB7IHJlc3VsdCA9IGdldE9wdGlvbignaXRlbXMnKTsgfVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiAoaXRlbSA9PT0gJ3NsaWRlQnknIHx8IGl0ZW0gPT09ICdpdGVtcycpKSB7IHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTsgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlTWFyZ2luTGVmdCAoaSkge1xuICAgIHJldHVybiBDQUxDID8gXG4gICAgICBDQUxDICsgJygnICsgaSAqIDEwMCArICclIC8gJyArIHNsaWRlQ291bnROZXcgKyAnKScgOiBcbiAgICAgIGkgKiAxMDAgLyBzbGlkZUNvdW50TmV3ICsgJyUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzIChlZGdlUGFkZGluZ1RlbSwgZ3V0dGVyVGVtLCBmaXhlZFdpZHRoVGVtLCBzcGVlZFRlbSwgYXV0b0hlaWdodEJQKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuXG4gICAgaWYgKGVkZ2VQYWRkaW5nVGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZ1RlbTtcbiAgICAgIGlmIChndXR0ZXJUZW0pIHsgZ2FwIC09IGd1dHRlclRlbTsgfVxuICAgICAgc3RyID0gaG9yaXpvbnRhbCA/XG4gICAgICAgICdtYXJnaW46IDAgJyArIGdhcCArICdweCAwICcgKyBlZGdlUGFkZGluZ1RlbSArICdweDsnIDpcbiAgICAgICAgJ21hcmdpbjogJyArIGVkZ2VQYWRkaW5nVGVtICsgJ3B4IDAgJyArIGdhcCArICdweCAwOyc7XG4gICAgfSBlbHNlIGlmIChndXR0ZXJUZW0gJiYgIWZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHZhciBndXR0ZXJUZW1Vbml0ID0gJy0nICsgZ3V0dGVyVGVtICsgJ3B4JyxcbiAgICAgICAgICBkaXIgPSBob3Jpem9udGFsID8gZ3V0dGVyVGVtVW5pdCArICcgMCAwJyA6ICcwICcgKyBndXR0ZXJUZW1Vbml0ICsgJyAwJztcbiAgICAgIHN0ciA9ICdtYXJnaW46IDAgJyArIGRpciArICc7JztcbiAgICB9XG5cbiAgICBpZiAoIWNhcm91c2VsICYmIGF1dG9IZWlnaHRCUCAmJiBUUkFOU0lUSU9ORFVSQVRJT04gJiYgc3BlZWRUZW0pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkVGVtKTsgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb250YWluZXJXaWR0aCAoZml4ZWRXaWR0aFRlbSwgZ3V0dGVyVGVtLCBpdGVtc1RlbSkge1xuICAgIGlmIChmaXhlZFdpZHRoVGVtKSB7XG4gICAgICByZXR1cm4gKGZpeGVkV2lkdGhUZW0gKyBndXR0ZXJUZW0pICogc2xpZGVDb3VudE5ldyArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDQUxDID9cbiAgICAgICAgQ0FMQyArICcoJyArIHNsaWRlQ291bnROZXcgKiAxMDAgKyAnJSAvICcgKyBpdGVtc1RlbSArICcpJyA6XG4gICAgICAgIHNsaWRlQ291bnROZXcgKiAxMDAgLyBpdGVtc1RlbSArICclJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZVdpZHRoU3R5bGUgKGZpeGVkV2lkdGhUZW0sIGd1dHRlclRlbSwgaXRlbXNUZW0pIHtcbiAgICB2YXIgd2lkdGg7XG5cbiAgICBpZiAoZml4ZWRXaWR0aFRlbSkge1xuICAgICAgd2lkdGggPSAoZml4ZWRXaWR0aFRlbSArIGd1dHRlclRlbSkgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNhcm91c2VsKSB7IGl0ZW1zVGVtID0gTWF0aC5mbG9vcihpdGVtc1RlbSk7IH1cbiAgICAgIHZhciBkaXZpZGVuZCA9IGNhcm91c2VsID8gc2xpZGVDb3VudE5ldyA6IGl0ZW1zVGVtO1xuICAgICAgd2lkdGggPSBDQUxDID8gXG4gICAgICAgIENBTEMgKyAnKDEwMCUgLyAnICsgZGl2aWRlbmQgKyAnKScgOiBcbiAgICAgICAgMTAwIC8gZGl2aWRlbmQgKyAnJSc7XG4gICAgfVxuXG4gICAgd2lkdGggPSAnd2lkdGg6JyArIHdpZHRoO1xuXG4gICAgLy8gaW5uZXIgc2xpZGVyOiBvdmVyd3JpdGUgb3V0ZXIgc2xpZGVyIHN0eWxlc1xuICAgIHJldHVybiBuZXN0ZWQgIT09ICdpbm5lcicgPyB3aWR0aCArICc7JyA6IHdpZHRoICsgJyAhaW1wb3J0YW50Oyc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZUd1dHRlclN0eWxlIChndXR0ZXJUZW0pIHtcbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICAvLyBndXR0ZXIgbWF5YmUgaW50ZXJnZXIgfHwgMFxuICAgIC8vIHNvIGNhbid0IHVzZSAnaWYgKGd1dHRlciknXG4gICAgaWYgKGd1dHRlclRlbSAhPT0gZmFsc2UpIHtcbiAgICAgIHZhciBwcm9wID0gaG9yaXpvbnRhbCA/ICdwYWRkaW5nLScgOiAnbWFyZ2luLScsXG4gICAgICAgICAgZGlyID0gaG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcbiAgICAgIHN0ciA9IHByb3AgKyAgZGlyICsgJzogJyArIGd1dHRlclRlbSArICdweDsnO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDU1NQcmVmaXggKG5hbWUsIG51bSkge1xuICAgIHZhciBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCAtIG51bSkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAocHJlZml4KSB7IHByZWZpeCA9ICctJyArIHByZWZpeCArICctJzsgfVxuXG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlIChzcGVlZCkge1xuICAgIHJldHVybiBnZXRDU1NQcmVmaXgoVFJBTlNJVElPTkRVUkFUSU9OLCAxOCkgKyAndHJhbnNpdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XG4gICAgcmV0dXJuIGdldENTU1ByZWZpeChBTklNQVRJT05EVVJBVElPTiwgMTcpICsgJ2FuaW1hdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTdHJ1Y3R1cmUgKCkge1xuICAgIHZhciBjbGFzc091dGVyID0gJ3Rucy1vdXRlcicsXG4gICAgICAgIGNsYXNzSW5uZXIgPSAndG5zLWlubmVyJyxcbiAgICAgICAgaGFzR3V0dGVyID0gaGFzT3B0aW9uKCdndXR0ZXInKTtcblxuICAgIG91dGVyV3JhcHBlci5jbGFzc05hbWUgPSBjbGFzc091dGVyO1xuICAgIGlubmVyV3JhcHBlci5jbGFzc05hbWUgPSBjbGFzc0lubmVyO1xuICAgIG91dGVyV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW93JztcbiAgICBpbm5lcldyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1pdyc7XG5cbiAgICAvLyBzZXQgY29udGFpbmVyIHByb3BlcnRpZXNcbiAgICBpZiAoY29udGFpbmVyLmlkID09PSAnJykgeyBjb250YWluZXIuaWQgPSBzbGlkZUlkOyB9XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSBQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCA/ICcgdG5zLXN1YnBpeGVsJyA6ICcgdG5zLW5vLXN1YnBpeGVsJztcbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9IENBTEMgPyAnIHRucy1jYWxjJyA6ICcgdG5zLW5vLWNhbGMnO1xuICAgIGlmIChhdXRvV2lkdGgpIHsgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSAnIHRucy1hdXRvd2lkdGgnOyB9XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSAnIHRucy0nICsgb3B0aW9ucy5heGlzO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gbmV3Q29udGFpbmVyQ2xhc3NlcztcblxuICAgIC8vIGFkZCBjb25zdHJhaW4gbGF5ZXIgZm9yIGNhcm91c2VsXG4gICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICBtaWRkbGVXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbWlkZGxlV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW13JztcbiAgICAgIG1pZGRsZVdyYXBwZXIuY2xhc3NOYW1lID0gJ3Rucy1vdmgnO1xuXG4gICAgICBvdXRlcldyYXBwZXIuYXBwZW5kQ2hpbGQobWlkZGxlV3JhcHBlcik7XG4gICAgICBtaWRkbGVXcmFwcGVyLmFwcGVuZENoaWxkKGlubmVyV3JhcHBlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dGVyV3JhcHBlci5hcHBlbmRDaGlsZChpbm5lcldyYXBwZXIpO1xuICAgIH1cblxuICAgIGlmIChhdXRvSGVpZ2h0KSB7XG4gICAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcbiAgICAgIHdwLmNsYXNzTmFtZSArPSAnIHRucy1haCc7XG4gICAgfVxuXG4gICAgY29udGFpbmVyUGFyZW50Lmluc2VydEJlZm9yZShvdXRlcldyYXBwZXIsIGNvbnRhaW5lcik7XG4gICAgaW5uZXJXcmFwcGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAvLyBhZGQgaWQsIGNsYXNzLCBhcmlhIGF0dHJpYnV0ZXMgXG4gICAgLy8gYmVmb3JlIGNsb25lIHNsaWRlc1xuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1pdGVtJyk7XG4gICAgICBpZiAoIWl0ZW0uaWQpIHsgaXRlbS5pZCA9IHNsaWRlSWQgKyAnLWl0ZW0nICsgaTsgfVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBhbmltYXRlTm9ybWFsKSB7IGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpOyB9XG4gICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAjIyBjbG9uZSBzbGlkZXNcbiAgICAvLyBjYXJvdXNlbDogbiArIHNsaWRlcyArIG5cbiAgICAvLyBnYWxsZXJ5OiAgICAgIHNsaWRlcyArIG5cbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIGZyYWdtZW50QmVmb3JlID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgXG4gICAgICAgICAgZnJhZ21lbnRBZnRlciA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIHZhciBudW0gPSBqJXNsaWRlQ291bnQsXG4gICAgICAgICAgICBjbG9uZUZpcnN0ID0gc2xpZGVJdGVtc1tudW1dLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVGaXJzdCwgJ2lkJyk7XG4gICAgICAgIGZyYWdtZW50QWZ0ZXIuaW5zZXJ0QmVmb3JlKGNsb25lRmlyc3QsIGZyYWdtZW50QWZ0ZXIuZmlyc3RDaGlsZCk7XG5cbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgdmFyIGNsb25lTGFzdCA9IHNsaWRlSXRlbXNbc2xpZGVDb3VudCAtIDEgLSBudW1dLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICByZW1vdmVBdHRycyhjbG9uZUxhc3QsICdpZCcpO1xuICAgICAgICAgIGZyYWdtZW50QmVmb3JlLmFwcGVuZENoaWxkKGNsb25lTGFzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZShmcmFnbWVudEJlZm9yZSwgY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50QWZ0ZXIpO1xuICAgICAgc2xpZGVJdGVtcyA9IGNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm0gKCkge1xuICAgIC8vICMjIGltYWdlcyBsb2FkZWQvZmFpbGVkXG4gICAgaWYgKGhhc09wdGlvbignYXV0b0hlaWdodCcpIHx8IGF1dG9XaWR0aCB8fCAhaG9yaXpvbnRhbCkge1xuICAgICAgdmFyIGltZ3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG5cbiAgICAgIC8vIGFkZCBjb21wbGV0ZSBjbGFzcyBpZiBhbGwgaW1hZ2VzIGFyZSBsb2FkZWQvZmFpbGVkXG4gICAgICBmb3JFYWNoKGltZ3MsIGZ1bmN0aW9uKGltZykge1xuICAgICAgICB2YXIgc3JjID0gaW1nLnNyYztcbiAgICAgICAgXG4gICAgICAgIGlmIChzcmMgJiYgc3JjLmluZGV4T2YoJ2RhdGE6aW1hZ2UnKSA8IDApIHtcbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuICAgICAgICAgIGltZy5zcmMgPSAnJztcbiAgICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICAgICAgfSBlbHNlIGlmICghbGF6eWxvYWQpIHtcbiAgICAgICAgICBpbWdMb2FkZWQoaW1nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEFsbCBpbWdzIGFyZSBjb21wbGV0ZWRcbiAgICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soYXJyYXlGcm9tTm9kZUxpc3QoaW1ncyksIGZ1bmN0aW9uKCkgeyBpbWdzQ29tcGxldGUgPSB0cnVlOyB9KTsgfSk7XG5cbiAgICAgIC8vIENoZWNrIGltZ3MgaW4gd2luZG93IG9ubHkgZm9yIGF1dG8gaGVpZ2h0XG4gICAgICBpZiAoIWF1dG9XaWR0aCAmJiBob3Jpem9udGFsKSB7IGltZ3MgPSBnZXRJbWFnZUFycmF5KGluZGV4LCBNYXRoLm1pbihpbmRleCArIGl0ZW1zIC0gMSwgc2xpZGVDb3VudE5ldyAtIDEpKTsgfVxuXG4gICAgICBsYXp5bG9hZCA/IGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrKCkgOiByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGFycmF5RnJvbU5vZGVMaXN0KGltZ3MpLCBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayk7IH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNldCBjb250YWluZXIgdHJhbnNmb3JtIHByb3BlcnR5XG4gICAgICBpZiAoY2Fyb3VzZWwpIHsgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTsgfVxuXG4gICAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcbiAgICAgIGluaXRUb29scygpO1xuICAgICAgaW5pdEV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrICgpIHtcbiAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAvLyBjaGVjayBzdHlsZXMgYXBwbGljYXRpb25cbiAgICAgIHZhciBudW0gPSBsb29wID8gaW5kZXggOiBzbGlkZUNvdW50IC0gMTtcbiAgICAgIChmdW5jdGlvbiBzdHlsZXNBcHBsaWNhdGlvbkNoZWNrKCkge1xuICAgICAgICBzbGlkZUl0ZW1zW251bSAtIDFdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0LnRvRml4ZWQoMikgPT09IHNsaWRlSXRlbXNbbnVtXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LnRvRml4ZWQoMikgP1xuICAgICAgICBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSgpIDpcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBzdHlsZXNBcHBsaWNhdGlvbkNoZWNrKCk7IH0sIDE2KTtcbiAgICAgIH0pKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlKCk7XG4gICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSAoKSB7XG4gICAgLy8gcnVuIEZuKClzIHdoaWNoIGFyZSByZWx5IG9uIGltYWdlIGxvYWRpbmdcbiAgICBpZiAoIWhvcml6b250YWwgfHwgYXV0b1dpZHRoKSB7XG4gICAgICBzZXRTbGlkZVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgIHJpZ2h0Qm91bmRhcnkgPSBnZXRSaWdodEJvdW5kYXJ5KCk7XG4gICAgICAgIGlmIChmcmVlemFibGUpIHsgZnJlZXplID0gZ2V0RnJlZXplKCk7IH1cbiAgICAgICAgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyAvLyA8PSBzbGlkZVBvc2l0aW9ucywgcmlnaHRCb3VuZGFyeSA8PVxuICAgICAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgY29udGFpbmVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxuICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XG5cbiAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcbiAgICBpbml0VG9vbHMoKTtcbiAgICBpbml0RXZlbnRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2hlZXQgKCkge1xuICAgIC8vIGdhbGxlcnk6XG4gICAgLy8gc2V0IGFuaW1hdGlvbiBjbGFzc2VzIGFuZCBsZWZ0IHZhbHVlIGZvciBnYWxsZXJ5IHNsaWRlclxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIE1hdGgubWluKHNsaWRlQ291bnQsIGl0ZW1zKTsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vICMjIyMgTEFZT1VUXG5cbiAgICAvLyAjIyBJTkxJTkUtQkxPQ0sgVlMgRkxPQVRcblxuICAgIC8vICMjIFBlcmNlbnRhZ2VMYXlvdXQ6XG4gICAgLy8gc2xpZGVzOiBpbmxpbmUtYmxvY2tcbiAgICAvLyByZW1vdmUgYmxhbmsgc3BhY2UgYmV0d2VlbiBzbGlkZXMgYnkgc2V0IGZvbnQtc2l6ZTogMFxuXG4gICAgLy8gIyMgTm9uIFBlcmNlbnRhZ2VMYXlvdXQ6XG4gICAgLy8gc2xpZGVzOiBmbG9hdFxuICAgIC8vICAgICAgICAgbWFyZ2luLXJpZ2h0OiAtMTAwJVxuICAgIC8vICAgICAgICAgbWFyZ2luLWxlZnQ6IH5cblxuICAgIC8vIFJlc291cmNlOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xNDd1cDI0NXd3VFhlUVl2ZTNCUlNBRDRvVmN2UW11R3NGdGVKT2VBNXhOUS9lZGl0P3VzcD1zaGFyaW5nXG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIGlmIChQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCkge1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsICdmb250LXNpemU6JyArIHdpbi5nZXRDb21wdXRlZFN0eWxlKHNsaWRlSXRlbXNbMF0pLmZvbnRTaXplICsgJzsnLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkLCAnZm9udC1zaXplOjA7JywgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbiAoc2xpZGUsIGkpIHtcbiAgICAgICAgICBzbGlkZS5zdHlsZS5tYXJnaW5MZWZ0ID0gZ2V0U2xpZGVNYXJnaW5MZWZ0KGkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vICMjIEJBU0lDIFNUWUxFU1xuICAgIGlmIChDU1NNUSkge1xuICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVcbiAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcbiAgICAgICAgdmFyIHN0ciA9IG1pZGRsZVdyYXBwZXIgJiYgb3B0aW9ucy5hdXRvSGVpZ2h0ID8gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUob3B0aW9ucy5zcGVlZCkgOiAnJztcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICctbXcnLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICBzdHIgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMob3B0aW9ucy5lZGdlUGFkZGluZywgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5hdXRvSGVpZ2h0KTtcbiAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnLWl3Jywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuXG4gICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gJ3dpZHRoOicgKyBnZXRDb250YWluZXJXaWR0aChvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLml0ZW1zKSArICc7JyA6ICcnO1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCwgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/IGdldFNsaWRlV2lkdGhTdHlsZShvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLml0ZW1zKSA6ICcnO1xuICAgICAgaWYgKG9wdGlvbnMuZ3V0dGVyKSB7IHN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKG9wdGlvbnMuZ3V0dGVyKTsgfVxuICAgICAgLy8gc2V0IGdhbGxlcnkgaXRlbXMgdHJhbnNpdGlvbi1kdXJhdGlvblxuICAgICAgaWYgKCFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgICAgaWYgKEFOSU1BVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxuXG4gICAgLy8gbm9uIENTUyBtZWRpYXF1ZXJpZXM6IElFOFxuICAgIC8vICMjIHVwZGF0ZSBpbm5lciB3cmFwcGVyLCBjb250YWluZXIsIHNsaWRlcyBpZiBuZWVkZWRcbiAgICAvLyBzZXQgaW5saW5lIHN0eWxlcyBmb3IgaW5uZXIgd3JhcHBlciAmIGNvbnRhaW5lclxuICAgIC8vIGluc2VydCBzdHlsZXNoZWV0IChvbmUgbGluZSkgZm9yIHNsaWRlcyBvbmx5IChzaW5jZSBzbGlkZXMgYXJlIG1hbnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlc1xuICAgICAgdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24oKTtcblxuICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIGF1dG9IZWlnaHQpO1xuXG4gICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICBpZiAoY2Fyb3VzZWwgJiYgaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgIHZhciBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcykgOiAnJztcbiAgICAgIGlmIChndXR0ZXIpIHsgc3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTsgfVxuXG4gICAgICAvLyBhcHBlbmQgdG8gdGhlIGxhc3QgbGluZVxuICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxuICAgIH1cblxuICAgIC8vICMjIE1FRElBUVVFUklFU1xuICAgIGlmIChyZXNwb25zaXZlICYmIENTU01RKSB7XG4gICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgIC8vIGJwOiBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgYnAgPSBwYXJzZUludChicCk7XG5cbiAgICAgICAgdmFyIG9wdHMgPSByZXNwb25zaXZlW2JwXSxcbiAgICAgICAgICAgIHN0ciA9ICcnLFxuICAgICAgICAgICAgbWlkZGxlV3JhcHBlclN0ciA9ICcnLFxuICAgICAgICAgICAgaW5uZXJXcmFwcGVyU3RyID0gJycsXG4gICAgICAgICAgICBjb250YWluZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHNsaWRlU3RyID0gJycsXG4gICAgICAgICAgICBpdGVtc0JQID0gIWF1dG9XaWR0aCA/IGdldE9wdGlvbignaXRlbXMnLCBicCkgOiBudWxsLFxuICAgICAgICAgICAgZml4ZWRXaWR0aEJQID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJywgYnApLFxuICAgICAgICAgICAgc3BlZWRCUCA9IGdldE9wdGlvbignc3BlZWQnLCBicCksXG4gICAgICAgICAgICBlZGdlUGFkZGluZ0JQID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycsIGJwKSxcbiAgICAgICAgICAgIGF1dG9IZWlnaHRCUCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSxcbiAgICAgICAgICAgIGd1dHRlckJQID0gZ2V0T3B0aW9uKCdndXR0ZXInLCBicCk7XG5cbiAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3RyaW5nXG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gJiYgbWlkZGxlV3JhcHBlciAmJiBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnLCBicCkgJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgbWlkZGxlV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLW13eycgKyBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKSArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3RyaW5nXG4gICAgICAgIGlmICgnZWRnZVBhZGRpbmcnIGluIG9wdHMgfHwgJ2d1dHRlcicgaW4gb3B0cykge1xuICAgICAgICAgIGlubmVyV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLWl3eycgKyBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmdCUCwgZ3V0dGVyQlAsIGZpeGVkV2lkdGhCUCwgc3BlZWRCUCwgYXV0b0hlaWdodEJQKSArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnRhaW5lciBzdHJpbmdcbiAgICAgICAgaWYgKGNhcm91c2VsICYmIGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAoJ2ZpeGVkV2lkdGgnIGluIG9wdHMgfHwgJ2l0ZW1zJyBpbiBvcHRzIHx8IChmaXhlZFdpZHRoICYmICdndXR0ZXInIGluIG9wdHMpKSkge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICd3aWR0aDonICsgZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aEJQLCBndXR0ZXJCUCwgaXRlbXNCUCkgKyAnOyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRhaW5lclN0cikge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICcjJyArIHNsaWRlSWQgKyAneycgKyBjb250YWluZXJTdHIgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzbGlkZSBzdHJpbmdcbiAgICAgICAgaWYgKCdmaXhlZFdpZHRoJyBpbiBvcHRzIHx8IChmaXhlZFdpZHRoICYmICdndXR0ZXInIGluIG9wdHMpIHx8ICFjYXJvdXNlbCAmJiAnaXRlbXMnIGluIG9wdHMpIHtcbiAgICAgICAgICBzbGlkZVN0ciArPSBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aEJQLCBndXR0ZXJCUCwgaXRlbXNCUCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdndXR0ZXInIGluIG9wdHMpIHtcbiAgICAgICAgICBzbGlkZVN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlckJQKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgZ2FsbGVyeSBpdGVtcyB0cmFuc2l0aW9uLWR1cmF0aW9uXG4gICAgICAgIGlmICghY2Fyb3VzZWwgJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzbGlkZVN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTsgfVxuICAgICAgICAgIGlmIChBTklNQVRJT05EVVJBVElPTikgeyBzbGlkZVN0ciArPSBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNsaWRlU3RyKSB7IHNsaWRlU3RyID0gJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW17JyArIHNsaWRlU3RyICsgJ30nOyB9XG5cbiAgICAgICAgLy8gYWRkIHVwXG4gICAgICAgIHN0ciA9IG1pZGRsZVdyYXBwZXJTdHIgKyBpbm5lcldyYXBwZXJTdHIgKyBjb250YWluZXJTdHIgKyBzbGlkZVN0cjtcblxuICAgICAgICBpZiAoc3RyKSB7XG4gICAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZSgnQG1lZGlhIChtaW4td2lkdGg6ICcgKyBicCAvIDE2ICsgJ2VtKSB7JyArIHN0ciArICd9Jywgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRUb29scyAoKSB7XG4gICAgLy8gPT0gc2xpZGVzID09XG4gICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcblxuICAgIC8vID09IGxpdmUgcmVnaW9uID09XG4gICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8ZGl2IGNsYXNzPVwidG5zLWxpdmVyZWdpb24gdG5zLXZpc3VhbGx5LWhpZGRlblwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPnNsaWRlIDxzcGFuIGNsYXNzPVwiY3VycmVudFwiPicgKyBnZXRMaXZlUmVnaW9uU3RyKCkgKyAnPC9zcGFuPiAgb2YgJyArIHNsaWRlQ291bnQgKyAnPC9kaXY+Jyk7XG4gICAgbGl2ZXJlZ2lvbkN1cnJlbnQgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1saXZlcmVnaW9uIC5jdXJyZW50Jyk7XG5cbiAgICAvLyA9PSBhdXRvcGxheUluaXQgPT1cbiAgICBpZiAoaGFzQXV0b3BsYXkpIHtcbiAgICAgIHZhciB0eHQgPSBhdXRvcGxheSA/ICdzdG9wJyA6ICdzdGFydCc7XG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHtcbiAgICAgICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiB0eHR9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hdXRvcGxheUJ1dHRvbk91dHB1dCkge1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMuYXV0b3BsYXlQb3NpdGlvbiksICc8YnV0dG9uIGRhdGEtYWN0aW9uPVwiJyArIHR4dCArICdcIj4nICsgYXV0b3BsYXlIdG1sU3RyaW5nc1swXSArIHR4dCArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMV0gKyBhdXRvcGxheVRleHRbMF0gKyAnPC9idXR0b24+Jyk7XG4gICAgICAgIGF1dG9wbGF5QnV0dG9uID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGV2ZW50XG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHtcbiAgICAgICAgYWRkRXZlbnRzKGF1dG9wbGF5QnV0dG9uLCB7J2NsaWNrJzogdG9nZ2xlQXV0b3BsYXl9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSkgeyBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7IH1cbiAgICAgICAgaWYgKGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdmlzaWJpbGl0eUV2ZW50KTsgfVxuICAgICAgfVxuICAgIH1cbiBcbiAgICAvLyA9PSBuYXZJbml0ID09XG4gICAgaWYgKGhhc05hdikge1xuICAgICAgdmFyIGluaXRJbmRleCA9ICFjYXJvdXNlbCA/IDAgOiBjbG9uZUNvdW50O1xuICAgICAgLy8gY3VzdG9taXplZCBuYXZcbiAgICAgIC8vIHdpbGwgbm90IGhpZGUgdGhlIG5hdnMgaW4gY2FzZSB0aGV5J3JlIHRodW1ibmFpbHNcbiAgICAgIGlmIChuYXZDb250YWluZXIpIHtcbiAgICAgICAgc2V0QXR0cnMobmF2Q29udGFpbmVyLCB7J2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgUGFnaW5hdGlvbid9KTtcbiAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XG4gICAgICAgIGZvckVhY2gobmF2SXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICAgICAnZGF0YS1uYXYnOiBpLFxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKGkgKyAxKSxcbiAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlZCBuYXYgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmF2SHRtbCA9ICcnLFxuICAgICAgICAgICAgaGlkZGVuU3RyID0gbmF2QXNUaHVtYm5haWxzID8gJycgOiAnc3R5bGU9XCJkaXNwbGF5Om5vbmVcIic7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgLy8gaGlkZSBuYXYgaXRlbXMgYnkgZGVmYXVsdFxuICAgICAgICAgIG5hdkh0bWwgKz0gJzxidXR0b24gZGF0YS1uYXY9XCInICsgaSArJ1wiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKyAnXCIgJyArIGhpZGRlblN0ciArICcgYXJpYS1sYWJlbD1cIicgKyBuYXZTdHIgKyAoaSArIDEpICsnXCI+PC9idXR0b24+JztcbiAgICAgICAgfVxuICAgICAgICBuYXZIdG1sID0gJzxkaXYgY2xhc3M9XCJ0bnMtbmF2XCIgYXJpYS1sYWJlbD1cIkNhcm91c2VsIFBhZ2luYXRpb25cIj4nICsgbmF2SHRtbCArICc8L2Rpdj4nO1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMubmF2UG9zaXRpb24pLCBuYXZIdG1sKTtcblxuICAgICAgICBuYXZDb250YWluZXIgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1uYXYnKTtcbiAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZU5hdlZpc2liaWxpdHkoKTtcblxuICAgICAgLy8gYWRkIHRyYW5zaXRpb25cbiAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IFRSQU5TSVRJT05EVVJBVElPTi5zdWJzdHJpbmcoMCwgVFJBTlNJVElPTkRVUkFUSU9OLmxlbmd0aCAtIDE4KS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgc3RyID0gJ3RyYW5zaXRpb246IGFsbCAnICsgc3BlZWQgLyAxMDAwICsgJ3MnO1xuXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICBzdHIgPSAnLScgKyBwcmVmaXggKyAnLScgKyBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnW2FyaWEtY29udHJvbHNePScgKyBzbGlkZUlkICsgJy1pdGVtXScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXR0cnMobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgeydhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleCArIDEpICsgbmF2U3RyQ3VycmVudH0pO1xuICAgICAgcmVtb3ZlQXR0cnMobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgJ3RhYmluZGV4Jyk7XG4gICAgICBhZGRDbGFzcyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCBuYXZBY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIGFkZCBldmVudHNcbiAgICAgIGFkZEV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7XG4gICAgfVxuXG5cblxuICAgIC8vID09IGNvbnRyb2xzSW5pdCA9PVxuICAgIGlmIChoYXNDb250cm9scykge1xuICAgICAgaWYgKCFjb250cm9sc0NvbnRhaW5lciAmJiAoIXByZXZCdXR0b24gfHwgIW5leHRCdXR0b24pKSB7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5jb250cm9sc1Bvc2l0aW9uKSwgJzxkaXYgY2xhc3M9XCJ0bnMtY29udHJvbHNcIiBhcmlhLWxhYmVsPVwiQ2Fyb3VzZWwgTmF2aWdhdGlvblwiIHRhYmluZGV4PVwiMFwiPjxidXR0b24gZGF0YS1jb250cm9scz1cInByZXZcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsnXCI+JyArIGNvbnRyb2xzVGV4dFswXSArICc8L2J1dHRvbj48YnV0dG9uIGRhdGEtY29udHJvbHM9XCJuZXh0XCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMV0gKyAnPC9idXR0b24+PC9kaXY+Jyk7XG5cbiAgICAgICAgY29udHJvbHNDb250YWluZXIgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1jb250cm9scycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXByZXZCdXR0b24gfHwgIW5leHRCdXR0b24pIHtcbiAgICAgICAgcHJldkJ1dHRvbiA9IGNvbnRyb2xzQ29udGFpbmVyLmNoaWxkcmVuWzBdO1xuICAgICAgICBuZXh0QnV0dG9uID0gY29udHJvbHNDb250YWluZXIuY2hpbGRyZW5bMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIHNldEF0dHJzKGNvbnRyb2xzQ29udGFpbmVyLCB7XG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgTmF2aWdhdGlvbicsXG4gICAgICAgICAgJ3RhYmluZGV4JzogJzAnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciB8fCAob3B0aW9ucy5wcmV2QnV0dG9uICYmIG9wdGlvbnMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgc2V0QXR0cnMoW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLCB7XG4gICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzbGlkZUlkLFxuICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciB8fCAob3B0aW9ucy5wcmV2QnV0dG9uICYmIG9wdGlvbnMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgc2V0QXR0cnMocHJldkJ1dHRvbiwgeydkYXRhLWNvbnRyb2xzJyA6ICdwcmV2J30pO1xuICAgICAgICBzZXRBdHRycyhuZXh0QnV0dG9uLCB7J2RhdGEtY29udHJvbHMnIDogJ25leHQnfSk7XG4gICAgICB9XG5cbiAgICAgIHByZXZJc0J1dHRvbiA9IGlzQnV0dG9uKHByZXZCdXR0b24pO1xuICAgICAgbmV4dElzQnV0dG9uID0gaXNCdXR0b24obmV4dEJ1dHRvbik7XG5cbiAgICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XG5cbiAgICAgIC8vIGFkZCBldmVudHNcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBhZGRFdmVudHMoY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZEV2ZW50cyhwcmV2QnV0dG9uLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICAgIGFkZEV2ZW50cyhuZXh0QnV0dG9uLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaGlkZSB0b29scyBpZiBuZWVkZWRcbiAgICBkaXNhYmxlVUkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRFdmVudHMgKCkge1xuICAgIC8vIGFkZCBldmVudHNcbiAgICBpZiAoY2Fyb3VzZWwgJiYgVFJBTlNJVElPTkVORCkge1xuICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgZXZlKTtcbiAgICB9XG5cbiAgICBpZiAodG91Y2gpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMsIG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2gpOyB9XG4gICAgaWYgKG1vdXNlRHJhZykgeyBhZGRFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTsgfVxuICAgIGlmIChhcnJvd0tleXMpIHsgYWRkRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cblxuICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHtcbiAgICAgIGV2ZW50cy5vbignb3V0ZXJSZXNpemVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNpemVUYXNrcygpO1xuICAgICAgICBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8IGF1dG9IZWlnaHQgfHwgIWhvcml6b250YWwpIHtcbiAgICAgIGFkZEV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b0hlaWdodCkge1xuICAgICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykge1xuICAgICAgICBldmVudHMub24oJ2lubmVyTG9hZGVkJywgZG9BdXRvSGVpZ2h0KTtcbiAgICAgIH0gZWxzZSBpZiAoIWRpc2FibGUpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cbiAgICB9XG5cbiAgICBkb0xhenlMb2FkKCk7XG4gICAgaWYgKGRpc2FibGUpIHsgZGlzYWJsZVNsaWRlcigpOyB9IGVsc2UgaWYgKGZyZWV6ZSkgeyBmcmVlemVTbGlkZXIoKTsgfVxuXG4gICAgZXZlbnRzLm9uKCdpbmRleENoYW5nZWQnLCBhZGRpdGlvbmFsVXBkYXRlcyk7XG4gICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykgeyBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpOyB9XG4gICAgaWYgKHR5cGVvZiBvbkluaXQgPT09ICdmdW5jdGlvbicpIHsgb25Jbml0KGluZm8oKSk7IH1cbiAgICBpc09uID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICAgIC8vIHNoZWV0XG4gICAgc2hlZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGlmIChzaGVldC5vd25lck5vZGUpIHsgc2hlZXQub3duZXJOb2RlLnJlbW92ZSgpOyB9XG5cbiAgICAvLyByZW1vdmUgd2luIGV2ZW50IGxpc3RlbmVyc1xuICAgIHJlbW92ZUV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcblxuICAgIC8vIGFycm93S2V5cywgY29udHJvbHMsIG5hdlxuICAgIGlmIChhcnJvd0tleXMpIHsgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cbiAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHsgcmVtb3ZlRXZlbnRzKGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0V2ZW50cyk7IH1cbiAgICBpZiAobmF2Q29udGFpbmVyKSB7IHJlbW92ZUV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7IH1cblxuICAgIC8vIGF1dG9wbGF5XG4gICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpO1xuICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHZpc2liaWxpdHlFdmVudCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHJlbW92ZUV2ZW50cyhhdXRvcGxheUJ1dHRvbiwgeydjbGljayc6IHRvZ2dsZUF1dG9wbGF5fSk7IH1cbiAgICBpZiAoYXV0b3BsYXkpIHsgY2xlYXJJbnRlcnZhbChhdXRvcGxheVRpbWVyKTsgfVxuXG4gICAgLy8gY29udGFpbmVyXG4gICAgaWYgKGNhcm91c2VsICYmIFRSQU5TSVRJT05FTkQpIHtcbiAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGV2ZSk7XG4gICAgfVxuICAgIGlmICh0b3VjaCkgeyByZW1vdmVFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cyk7IH1cbiAgICBpZiAobW91c2VEcmFnKSB7IHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpOyB9XG5cbiAgICAvLyBjYWNoZSBPYmplY3QgdmFsdWVzIGluIG9wdGlvbnMgJiYgcmVzZXQgSFRNTFxuICAgIHZhciBodG1sTGlzdCA9IFtjb250YWluZXJIVE1MLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b25IVE1MLCBuZXh0QnV0dG9uSFRNTCwgbmF2Q29udGFpbmVySFRNTCwgYXV0b3BsYXlCdXR0b25IVE1MXTtcblxuICAgIHRuc0xpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgZWwgPSBpdGVtID09PSAnY29udGFpbmVyJyA/IG91dGVyV3JhcHBlciA6IG9wdGlvbnNbaXRlbV07XG5cbiAgICAgIGlmICh0eXBlb2YgZWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBwcmV2RWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID8gZWwucHJldmlvdXNFbGVtZW50U2libGluZyA6IGZhbHNlLFxuICAgICAgICAgICAgcGFyZW50RWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgICBlbC5vdXRlckhUTUwgPSBodG1sTGlzdFtpXTtcbiAgICAgICAgb3B0aW9uc1tpdGVtXSA9IHByZXZFbCA/IHByZXZFbC5uZXh0RWxlbWVudFNpYmxpbmcgOiBwYXJlbnRFbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8gcmVzZXQgdmFyaWFibGVzXG4gICAgdG5zTGlzdCA9IGFuaW1hdGVJbiA9IGFuaW1hdGVPdXQgPSBhbmltYXRlRGVsYXkgPSBhbmltYXRlTm9ybWFsID0gaG9yaXpvbnRhbCA9IG91dGVyV3JhcHBlciA9IGlubmVyV3JhcHBlciA9IGNvbnRhaW5lciA9IGNvbnRhaW5lclBhcmVudCA9IGNvbnRhaW5lckhUTUwgPSBzbGlkZUl0ZW1zID0gc2xpZGVDb3VudCA9IGJyZWFrcG9pbnRab25lID0gd2luZG93V2lkdGggPSBhdXRvV2lkdGggPSBmaXhlZFdpZHRoID0gZWRnZVBhZGRpbmcgPSBndXR0ZXIgPSB2aWV3cG9ydCA9IGl0ZW1zID0gc2xpZGVCeSA9IHZpZXdwb3J0TWF4ID0gYXJyb3dLZXlzID0gc3BlZWQgPSByZXdpbmQgPSBsb29wID0gYXV0b0hlaWdodCA9IHNoZWV0ID0gbGF6eWxvYWQgPSBzbGlkZVBvc2l0aW9ucyA9IHNsaWRlSXRlbXNPdXQgPSBjbG9uZUNvdW50ID0gc2xpZGVDb3VudE5ldyA9IGhhc1JpZ2h0RGVhZFpvbmUgPSByaWdodEJvdW5kYXJ5ID0gdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1BdHRyID0gdHJhbnNmb3JtUHJlZml4ID0gdHJhbnNmb3JtUG9zdGZpeCA9IGdldEluZGV4TWF4ID0gaW5kZXggPSBpbmRleENhY2hlZCA9IGluZGV4TWluID0gaW5kZXhNYXggPSByZXNpemVUaW1lciA9IHN3aXBlQW5nbGUgPSBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBydW5uaW5nID0gb25Jbml0ID0gZXZlbnRzID0gbmV3Q29udGFpbmVyQ2xhc3NlcyA9IHNsaWRlSWQgPSBkaXNhYmxlID0gZGlzYWJsZWQgPSBmcmVlemFibGUgPSBmcmVlemUgPSBmcm96ZW4gPSBjb250cm9sc0V2ZW50cyA9IG5hdkV2ZW50cyA9IGhvdmVyRXZlbnRzID0gdmlzaWJpbGl0eUV2ZW50ID0gZG9jbWVudEtleWRvd25FdmVudCA9IHRvdWNoRXZlbnRzID0gZHJhZ0V2ZW50cyA9IGhhc0NvbnRyb2xzID0gaGFzTmF2ID0gbmF2QXNUaHVtYm5haWxzID0gaGFzQXV0b3BsYXkgPSBoYXNUb3VjaCA9IGhhc01vdXNlRHJhZyA9IHNsaWRlQWN0aXZlQ2xhc3MgPSBpbWdDb21wbGV0ZUNsYXNzID0gaW1nRXZlbnRzID0gaW1nc0NvbXBsZXRlID0gY29udHJvbHMgPSBjb250cm9sc1RleHQgPSBjb250cm9sc0NvbnRhaW5lciA9IGNvbnRyb2xzQ29udGFpbmVySFRNTCA9IHByZXZCdXR0b24gPSBuZXh0QnV0dG9uID0gcHJldklzQnV0dG9uID0gbmV4dElzQnV0dG9uID0gbmF2ID0gbmF2Q29udGFpbmVyID0gbmF2Q29udGFpbmVySFRNTCA9IG5hdkl0ZW1zID0gcGFnZXMgPSBwYWdlc0NhY2hlZCA9IG5hdkNsaWNrZWQgPSBuYXZDdXJyZW50SW5kZXggPSBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZBY3RpdmVDbGFzcyA9IG5hdlN0ciA9IG5hdlN0ckN1cnJlbnQgPSBhdXRvcGxheSA9IGF1dG9wbGF5VGltZW91dCA9IGF1dG9wbGF5RGlyZWN0aW9uID0gYXV0b3BsYXlUZXh0ID0gYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlCdXR0b24gPSBhdXRvcGxheUJ1dHRvbkhUTUwgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gYXV0b3BsYXlIdG1sU3RyaW5ncyA9IGF1dG9wbGF5VGltZXIgPSBhbmltYXRpbmcgPSBhdXRvcGxheUhvdmVyUGF1c2VkID0gYXV0b3BsYXlVc2VyUGF1c2VkID0gYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gaW5pdFBvc2l0aW9uID0gbGFzdFBvc2l0aW9uID0gdHJhbnNsYXRlSW5pdCA9IGRpc1ggPSBkaXNZID0gcGFuU3RhcnQgPSByYWZJbmRleCA9IGdldERpc3QgPSB0b3VjaCA9IG1vdXNlRHJhZyA9IG51bGw7XG4gICAgLy8gY2hlY2sgdmFyaWFibGVzXG4gICAgLy8gW2FuaW1hdGVJbiwgYW5pbWF0ZU91dCwgYW5pbWF0ZURlbGF5LCBhbmltYXRlTm9ybWFsLCBob3Jpem9udGFsLCBvdXRlcldyYXBwZXIsIGlubmVyV3JhcHBlciwgY29udGFpbmVyLCBjb250YWluZXJQYXJlbnQsIGNvbnRhaW5lckhUTUwsIHNsaWRlSXRlbXMsIHNsaWRlQ291bnQsIGJyZWFrcG9pbnRab25lLCB3aW5kb3dXaWR0aCwgYXV0b1dpZHRoLCBmaXhlZFdpZHRoLCBlZGdlUGFkZGluZywgZ3V0dGVyLCB2aWV3cG9ydCwgaXRlbXMsIHNsaWRlQnksIHZpZXdwb3J0TWF4LCBhcnJvd0tleXMsIHNwZWVkLCByZXdpbmQsIGxvb3AsIGF1dG9IZWlnaHQsIHNoZWV0LCBsYXp5bG9hZCwgc2xpZGVQb3NpdGlvbnMsIHNsaWRlSXRlbXNPdXQsIGNsb25lQ291bnQsIHNsaWRlQ291bnROZXcsIGhhc1JpZ2h0RGVhZFpvbmUsIHJpZ2h0Qm91bmRhcnksIHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtLCB0cmFuc2Zvcm1BdHRyLCB0cmFuc2Zvcm1QcmVmaXgsIHRyYW5zZm9ybVBvc3RmaXgsIGdldEluZGV4TWF4LCBpbmRleCwgaW5kZXhDYWNoZWQsIGluZGV4TWluLCBpbmRleE1heCwgcmVzaXplVGltZXIsIHN3aXBlQW5nbGUsIG1vdmVEaXJlY3Rpb25FeHBlY3RlZCwgcnVubmluZywgb25Jbml0LCBldmVudHMsIG5ld0NvbnRhaW5lckNsYXNzZXMsIHNsaWRlSWQsIGRpc2FibGUsIGRpc2FibGVkLCBmcmVlemFibGUsIGZyZWV6ZSwgZnJvemVuLCBjb250cm9sc0V2ZW50cywgbmF2RXZlbnRzLCBob3ZlckV2ZW50cywgdmlzaWJpbGl0eUV2ZW50LCBkb2NtZW50S2V5ZG93bkV2ZW50LCB0b3VjaEV2ZW50cywgZHJhZ0V2ZW50cywgaGFzQ29udHJvbHMsIGhhc05hdiwgbmF2QXNUaHVtYm5haWxzLCBoYXNBdXRvcGxheSwgaGFzVG91Y2gsIGhhc01vdXNlRHJhZywgc2xpZGVBY3RpdmVDbGFzcywgaW1nQ29tcGxldGVDbGFzcywgaW1nRXZlbnRzLCBpbWdzQ29tcGxldGUsIGNvbnRyb2xzLCBjb250cm9sc1RleHQsIGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b24sIG5leHRCdXR0b24sIHByZXZJc0J1dHRvbiwgbmV4dElzQnV0dG9uLCBuYXYsIG5hdkNvbnRhaW5lciwgbmF2Q29udGFpbmVySFRNTCwgbmF2SXRlbXMsIHBhZ2VzLCBwYWdlc0NhY2hlZCwgbmF2Q2xpY2tlZCwgbmF2Q3VycmVudEluZGV4LCBuYXZDdXJyZW50SW5kZXhDYWNoZWQsIG5hdkFjdGl2ZUNsYXNzLCBuYXZTdHIsIG5hdlN0ckN1cnJlbnQsIGF1dG9wbGF5LCBhdXRvcGxheVRpbWVvdXQsIGF1dG9wbGF5RGlyZWN0aW9uLCBhdXRvcGxheVRleHQsIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlCdXR0b24sIGF1dG9wbGF5QnV0dG9uSFRNTCwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSwgYXV0b3BsYXlIdG1sU3RyaW5ncywgYXV0b3BsYXlUaW1lciwgYW5pbWF0aW5nLCBhdXRvcGxheUhvdmVyUGF1c2VkLCBhdXRvcGxheVVzZXJQYXVzZWQsIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCwgaW5pdFBvc2l0aW9uLCBsYXN0UG9zaXRpb24sIHRyYW5zbGF0ZUluaXQsIGRpc1gsIGRpc1ksIHBhblN0YXJ0LCByYWZJbmRleCwgZ2V0RGlzdCwgdG91Y2gsIG1vdXNlRHJhZyBdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyBpZiAoaXRlbSAhPT0gbnVsbCkgeyBjb25zb2xlLmxvZyhpdGVtKTsgfSB9KTtcblxuICAgIGZvciAodmFyIGEgaW4gdGhpcykge1xuICAgICAgaWYgKGEgIT09ICdyZWJ1aWxkJykgeyB0aGlzW2FdID0gbnVsbDsgfVxuICAgIH1cbiAgICBpc09uID0gZmFsc2U7XG4gIH1cblxuLy8gPT09IE9OIFJFU0laRSA9PT1cbiAgLy8gcmVzcG9uc2l2ZSB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCB8fCAhaG9yaXpvbnRhbFxuICBmdW5jdGlvbiBvblJlc2l6ZSAoZSkge1xuICAgIHJhZihmdW5jdGlvbigpeyByZXNpemVUYXNrcyhnZXRFdmVudChlKSk7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzaXplVGFza3MgKGUpIHtcbiAgICBpZiAoIWlzT24pIHsgcmV0dXJuOyB9XG4gICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykgeyBldmVudHMuZW1pdCgnb3V0ZXJSZXNpemVkJywgaW5mbyhlKSk7IH1cbiAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCk7XG4gICAgdmFyIGJwQ2hhbmdlZCxcbiAgICAgICAgYnJlYWtwb2ludFpvbmVUZW0gPSBicmVha3BvaW50Wm9uZSxcbiAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IGZhbHNlO1xuXG4gICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgIHNldEJyZWFrcG9pbnRab25lKCk7XG4gICAgICBicENoYW5nZWQgPSBicmVha3BvaW50Wm9uZVRlbSAhPT0gYnJlYWtwb2ludFpvbmU7XG4gICAgICAvLyBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfSAvLyAqP1xuICAgICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludFN0YXJ0JywgaW5mbyhlKSk7IH1cbiAgICB9XG5cbiAgICB2YXIgaW5kQ2hhbmdlZCxcbiAgICAgICAgaXRlbXNDaGFuZ2VkLFxuICAgICAgICBpdGVtc1RlbSA9IGl0ZW1zLFxuICAgICAgICBkaXNhYmxlVGVtID0gZGlzYWJsZSxcbiAgICAgICAgZnJlZXplVGVtID0gZnJlZXplLFxuICAgICAgICBhcnJvd0tleXNUZW0gPSBhcnJvd0tleXMsXG4gICAgICAgIGNvbnRyb2xzVGVtID0gY29udHJvbHMsXG4gICAgICAgIG5hdlRlbSA9IG5hdixcbiAgICAgICAgdG91Y2hUZW0gPSB0b3VjaCxcbiAgICAgICAgbW91c2VEcmFnVGVtID0gbW91c2VEcmFnLFxuICAgICAgICBhdXRvcGxheVRlbSA9IGF1dG9wbGF5LFxuICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VUZW0gPSBhdXRvcGxheUhvdmVyUGF1c2UsXG4gICAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlUZW0gPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5LFxuICAgICAgICBpbmRleFRlbSA9IGluZGV4O1xuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgdmFyIGZpeGVkV2lkdGhUZW0gPSBmaXhlZFdpZHRoLFxuICAgICAgICAgIGF1dG9IZWlnaHRUZW0gPSBhdXRvSGVpZ2h0LFxuICAgICAgICAgIGNvbnRyb2xzVGV4dFRlbSA9IGNvbnRyb2xzVGV4dCxcbiAgICAgICAgICBjZW50ZXJUZW0gPSBjZW50ZXIsXG4gICAgICAgICAgYXV0b3BsYXlUZXh0VGVtID0gYXV0b3BsYXlUZXh0O1xuXG4gICAgICBpZiAoIUNTU01RKSB7XG4gICAgICAgIHZhciBndXR0ZXJUZW0gPSBndXR0ZXIsXG4gICAgICAgICAgICBlZGdlUGFkZGluZ1RlbSA9IGVkZ2VQYWRkaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCBvcHRpb246XG4gICAgLy8gZml4ZWQgd2lkdGg6IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXIgPT4gaXRlbXNcbiAgICAvLyBvdGhlcnM6IHdpbmRvdyB3aWR0aCA9PiBhbGwgdmFyaWFibGVzXG4gICAgLy8gYWxsOiBpdGVtcyA9PiBzbGlkZUJ5XG4gICAgYXJyb3dLZXlzID0gZ2V0T3B0aW9uKCdhcnJvd0tleXMnKTtcbiAgICBjb250cm9scyA9IGdldE9wdGlvbignY29udHJvbHMnKTtcbiAgICBuYXYgPSBnZXRPcHRpb24oJ25hdicpO1xuICAgIHRvdWNoID0gZ2V0T3B0aW9uKCd0b3VjaCcpO1xuICAgIGNlbnRlciA9IGdldE9wdGlvbignY2VudGVyJyk7XG4gICAgbW91c2VEcmFnID0gZ2V0T3B0aW9uKCdtb3VzZURyYWcnKTtcbiAgICBhdXRvcGxheSA9IGdldE9wdGlvbignYXV0b3BsYXknKTtcbiAgICBhdXRvcGxheUhvdmVyUGF1c2UgPSBnZXRPcHRpb24oJ2F1dG9wbGF5SG92ZXJQYXVzZScpO1xuICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5UmVzZXRPblZpc2liaWxpdHknKTtcblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGRpc2FibGUgPSBnZXRPcHRpb24oJ2Rpc2FibGUnKTtcbiAgICAgIGZpeGVkV2lkdGggPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnKTtcbiAgICAgIHNwZWVkID0gZ2V0T3B0aW9uKCdzcGVlZCcpO1xuICAgICAgYXV0b0hlaWdodCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcpO1xuICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKTtcbiAgICAgIGF1dG9wbGF5VGV4dCA9IGdldE9wdGlvbignYXV0b3BsYXlUZXh0Jyk7XG4gICAgICBhdXRvcGxheVRpbWVvdXQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGltZW91dCcpO1xuXG4gICAgICBpZiAoIUNTU01RKSB7XG4gICAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpO1xuICAgICAgICBndXR0ZXIgPSBnZXRPcHRpb24oJ2d1dHRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB1cGRhdGUgb3B0aW9uc1xuICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlKTtcblxuICAgIHZpZXdwb3J0ID0gZ2V0Vmlld3BvcnRXaWR0aCgpOyAvLyA8PSBlZGdlUGFkZGluZywgZ3V0dGVyXG4gICAgaWYgKCghaG9yaXpvbnRhbCB8fCBhdXRvV2lkdGgpICYmICFkaXNhYmxlKSB7XG4gICAgICBzZXRTbGlkZVBvc2l0aW9ucygpO1xuICAgICAgaWYgKCFob3Jpem9udGFsKSB7XG4gICAgICAgIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7IC8vIDw9IHNldFNsaWRlUG9zaXRpb25zXG4gICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIHJpZ2h0Qm91bmRhcnkgPSBnZXRSaWdodEJvdW5kYXJ5KCk7IC8vIGF1dG9XaWR0aDogPD0gdmlld3BvcnQsIHNsaWRlUG9zaXRpb25zLCBndXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpeGVkV2lkdGg6IDw9IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXJcbiAgICAgIGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgLy8gYXV0b1dpZHRoOiA8PSByaWdodEJvdW5kYXJ5LCBzbGlkZVBvc2l0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZFdpZHRoOiA8PSByaWdodEJvdW5kYXJ5LCBmaXhlZFdpZHRoLCBndXR0ZXJcbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkIHx8IGZpeGVkV2lkdGgpIHtcbiAgICAgIGl0ZW1zID0gZ2V0T3B0aW9uKCdpdGVtcycpO1xuICAgICAgc2xpZGVCeSA9IGdldE9wdGlvbignc2xpZGVCeScpO1xuICAgICAgaXRlbXNDaGFuZ2VkID0gaXRlbXMgIT09IGl0ZW1zVGVtO1xuXG4gICAgICBpZiAoaXRlbXNDaGFuZ2VkKSB7XG4gICAgICAgIGlmICghZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7IGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgfSAvLyA8PSBpdGVtc1xuICAgICAgICAvLyBjaGVjayBpbmRleCBiZWZvcmUgdHJhbnNmb3JtIGluIGNhc2VcbiAgICAgICAgLy8gc2xpZGVyIHJlYWNoIHRoZSByaWdodCBlZGdlIHRoZW4gaXRlbXMgYmVjb21lIGJpZ2dlclxuICAgICAgICB1cGRhdGVJbmRleCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBpZiAoZGlzYWJsZSAhPT0gZGlzYWJsZVRlbSkge1xuICAgICAgICBpZiAoZGlzYWJsZSkge1xuICAgICAgICAgIGRpc2FibGVTbGlkZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmFibGVTbGlkZXIoKTsgLy8gPD0gc2xpZGVQb3NpdGlvbnMsIHJpZ2h0Qm91bmRhcnksIGluZGV4TWF4XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnJlZXphYmxlICYmIChicENoYW5nZWQgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpKSB7XG4gICAgICBmcmVlemUgPSBnZXRGcmVlemUoKTsgLy8gPD0gYXV0b1dpZHRoOiBzbGlkZVBvc2l0aW9ucywgZ3V0dGVyLCB2aWV3cG9ydCwgcmlnaHRCb3VuZGFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDw9IGZpeGVkV2lkdGg6IGZpeGVkV2lkdGgsIGd1dHRlciwgcmlnaHRCb3VuZGFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDw9IG90aGVyczogaXRlbXNcblxuICAgICAgaWYgKGZyZWV6ZSAhPT0gZnJlZXplVGVtKSB7XG4gICAgICAgIGlmIChmcmVlemUpIHtcbiAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybShnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZShnZXRTdGFydEluZGV4KDApKSk7XG4gICAgICAgICAgZnJlZXplU2xpZGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5mcmVlemVTbGlkZXIoKTtcbiAgICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7IC8vIGNvbnRyb2xzLCBuYXYsIHRvdWNoLCBtb3VzZURyYWcsIGFycm93S2V5cywgYXV0b3BsYXksIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVxuICAgIGlmICghYXV0b3BsYXkpIHsgYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGZhbHNlOyB9XG5cbiAgICBpZiAoYXJyb3dLZXlzICE9PSBhcnJvd0tleXNUZW0pIHtcbiAgICAgIGFycm93S2V5cyA/XG4gICAgICAgIGFkZEV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7XG4gICAgfVxuICAgIGlmIChjb250cm9scyAhPT0gY29udHJvbHNUZW0pIHtcbiAgICAgIGlmIChjb250cm9scykge1xuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICBzaG93RWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgc2hvd0VsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBzaG93RWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICBoaWRlRWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgaGlkZUVsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBoaWRlRWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXYgIT09IG5hdlRlbSkge1xuICAgICAgbmF2ID9cbiAgICAgICAgc2hvd0VsZW1lbnQobmF2Q29udGFpbmVyKSA6XG4gICAgICAgIGhpZGVFbGVtZW50KG5hdkNvbnRhaW5lcik7XG4gICAgfVxuICAgIGlmICh0b3VjaCAhPT0gdG91Y2hUZW0pIHtcbiAgICAgIHRvdWNoID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMsIG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2gpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMpO1xuICAgIH1cbiAgICBpZiAobW91c2VEcmFnICE9PSBtb3VzZURyYWdUZW0pIHtcbiAgICAgIG1vdXNlRHJhZyA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7XG4gICAgfVxuICAgIGlmIChhdXRvcGxheSAhPT0gYXV0b3BsYXlUZW0pIHtcbiAgICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgc2hvd0VsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgICAgIGlmICghYW5pbWF0aW5nICYmICFhdXRvcGxheVVzZXJQYXVzZWQpIHsgc3RhcnRBdXRvcGxheSgpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgaGlkZUVsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgICAgIGlmIChhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5KCk7IH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSAhPT0gYXV0b3BsYXlIb3ZlclBhdXNlVGVtKSB7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2UgP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cykgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7XG4gICAgfVxuICAgIGlmIChhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ICE9PSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtKSB7XG4gICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID9cbiAgICAgICAgYWRkRXZlbnRzKGRvYywgdmlzaWJpbGl0eUV2ZW50KSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhkb2MsIHZpc2liaWxpdHlFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgaWYgKGZpeGVkV2lkdGggIT09IGZpeGVkV2lkdGhUZW0gfHwgY2VudGVyICE9PSBjZW50ZXJUZW0pIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH1cblxuICAgICAgaWYgKGF1dG9IZWlnaHQgIT09IGF1dG9IZWlnaHRUZW0pIHtcbiAgICAgICAgaWYgKCFhdXRvSGVpZ2h0KSB7IGlubmVyV3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJzsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29udHJvbHMgJiYgY29udHJvbHNUZXh0ICE9PSBjb250cm9sc1RleHRUZW0pIHtcbiAgICAgICAgcHJldkJ1dHRvbi5pbm5lckhUTUwgPSBjb250cm9sc1RleHRbMF07XG4gICAgICAgIG5leHRCdXR0b24uaW5uZXJIVE1MID0gY29udHJvbHNUZXh0WzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24gJiYgYXV0b3BsYXlUZXh0ICE9PSBhdXRvcGxheVRleHRUZW0pIHtcbiAgICAgICAgdmFyIGkgPSBhdXRvcGxheSA/IDEgOiAwLFxuICAgICAgICAgICAgaHRtbCA9IGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCxcbiAgICAgICAgICAgIGxlbiA9IGh0bWwubGVuZ3RoIC0gYXV0b3BsYXlUZXh0VGVtW2ldLmxlbmd0aDtcbiAgICAgICAgaWYgKGh0bWwuc3Vic3RyaW5nKGxlbikgPT09IGF1dG9wbGF5VGV4dFRlbVtpXSkge1xuICAgICAgICAgIGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCA9IGh0bWwuc3Vic3RyaW5nKDAsIGxlbikgKyBhdXRvcGxheVRleHRbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNlbnRlciAmJiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1zQ2hhbmdlZCB8fCBmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIHBhZ2VzID0gZ2V0UGFnZXMoKTtcbiAgICAgIHVwZGF0ZU5hdlZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICBpbmRDaGFuZ2VkID0gaW5kZXggIT09IGluZGV4VGVtO1xuICAgIGlmIChpbmRDaGFuZ2VkKSB7IFxuICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG4gICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1zQ2hhbmdlZCkge1xuICAgICAgaWYgKCFpbmRDaGFuZ2VkKSB7IGFkZGl0aW9uYWxVcGRhdGVzKCk7IH1cbiAgICB9IGVsc2UgaWYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICBkb0xhenlMb2FkKCk7IFxuICAgICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcbiAgICAgIHVwZGF0ZUxpdmVSZWdpb24oKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbXNDaGFuZ2VkICYmICFjYXJvdXNlbCkgeyB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMoKTsgfVxuXG4gICAgaWYgKCFkaXNhYmxlICYmICFmcmVlemUpIHtcbiAgICAgIC8vIG5vbi1tZWR1YXF1ZXJpZXM6IElFOFxuICAgICAgaWYgKGJwQ2hhbmdlZCAmJiAhQ1NTTVEpIHtcbiAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXG4gICAgICAgIGlmIChhdXRvSGVpZ2h0ICE9PSBhdXRvaGVpZ2h0VGVtIHx8IHNwZWVkICE9PSBzcGVlZFRlbSkge1xuICAgICAgICAgIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgICBpZiAoZWRnZVBhZGRpbmcgIT09IGVkZ2VQYWRkaW5nVGVtIHx8IGd1dHRlciAhPT0gZ3V0dGVyVGVtKSB7XG4gICAgICAgICAgaW5uZXJXcmFwcGVyLnN0eWxlLmNzc1RleHQgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmcsIGd1dHRlciwgZml4ZWRXaWR0aCwgc3BlZWQsIGF1dG9IZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgICAgICB2YXIgc3RyID0gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpICsgXG4gICAgICAgICAgICAgICAgICAgIGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTtcblxuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgbGFzdCBsaW5lIGFuZFxuICAgICAgICAgIC8vIGFkZCBuZXcgc3R5bGVzXG4gICAgICAgICAgcmVtb3ZlQ1NTUnVsZShzaGVldCwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpIC0gMSk7XG4gICAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXV0byBoZWlnaHRcbiAgICAgIGlmIChhdXRvSGVpZ2h0KSB7IGRvQXV0b0hlaWdodCgpOyB9XG5cbiAgICAgIGlmIChuZWVkQ29udGFpbmVyVHJhbnNmb3JtKSB7XG4gICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG4gICAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludEVuZCcsIGluZm8oZSkpOyB9XG4gIH1cblxuXG5cblxuXG4gIC8vID09PSBJTklUSUFMSVpBVElPTiBGVU5DVElPTlMgPT09IC8vXG4gIGZ1bmN0aW9uIGdldEZyZWV6ZSAoKSB7XG4gICAgaWYgKCFmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIHZhciBhID0gY2VudGVyID8gaXRlbXMgLSAoaXRlbXMgLSAxKSAvIDIgOiBpdGVtcztcbiAgICAgIHJldHVybiAgc2xpZGVDb3VudCA8PSBhO1xuICAgIH1cblxuICAgIHZhciB3aWR0aCA9IGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50IDogc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudF0sXG4gICAgICAgIHZwID0gZWRnZVBhZGRpbmcgPyB2aWV3cG9ydCArIGVkZ2VQYWRkaW5nICogMiA6IHZpZXdwb3J0ICsgZ3V0dGVyO1xuXG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgdnAgLT0gZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6ICh2aWV3cG9ydCAtIChzbGlkZVBvc2l0aW9uc1tpbmRleCArIDFdIC0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdIC0gZ3V0dGVyKSkgLyAyO1xuICAgIH1cblxuICAgIHJldHVybiB3aWR0aCA8PSB2cDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEJyZWFrcG9pbnRab25lICgpIHtcbiAgICBicmVha3BvaW50Wm9uZSA9IDA7XG4gICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgYnAgPSBwYXJzZUludChicCk7IC8vIGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgaWYgKHdpbmRvd1dpZHRoID49IGJwKSB7IGJyZWFrcG9pbnRab25lID0gYnA7IH1cbiAgICB9XG4gIH1cblxuICAvLyAoc2xpZGVCeSwgaW5kZXhNaW4sIGluZGV4TWF4KSA9PiBpbmRleFxuICB2YXIgdXBkYXRlSW5kZXggPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsb29wID8gXG4gICAgICBjYXJvdXNlbCA/XG4gICAgICAgIC8vIGxvb3AgKyBjYXJvdXNlbFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGxlZnRFZGdlID0gaW5kZXhNaW4sXG4gICAgICAgICAgICAgIHJpZ2h0RWRnZSA9IGluZGV4TWF4O1xuXG4gICAgICAgICAgbGVmdEVkZ2UgKz0gc2xpZGVCeTtcbiAgICAgICAgICByaWdodEVkZ2UgLT0gc2xpZGVCeTtcblxuICAgICAgICAgIC8vIGFkanVzdCBlZGdlcyB3aGVuIGhhcyBlZGdlIHBhZGRpbmdzXG4gICAgICAgICAgLy8gb3IgZml4ZWQtd2lkdGggc2xpZGVyIHdpdGggZXh0cmEgc3BhY2Ugb24gdGhlIHJpZ2h0IHNpZGVcbiAgICAgICAgICBpZiAoZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICAgIGxlZnRFZGdlICs9IDE7XG4gICAgICAgICAgICByaWdodEVkZ2UgLT0gMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgICAgIGlmICgodmlld3BvcnQgKyBndXR0ZXIpJShmaXhlZFdpZHRoICsgZ3V0dGVyKSkgeyByaWdodEVkZ2UgLT0gMTsgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICAgICAgaW5kZXggLT0gc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgICAgICBpbmRleCArPSBzbGlkZUNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAgIC8vIGxvb3AgKyBnYWxsZXJ5XG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gaW5kZXhNaW4gKyBzbGlkZUNvdW50KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA8PSBpbmRleE1heCAtIHNsaWRlQ291bnQpIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAvLyBub24tbG9vcFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXhNaW4sIE1hdGgubWluKGluZGV4TWF4LCBpbmRleCkpO1xuICAgICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiBkaXNhYmxlVUkgKCkge1xuICAgIGlmICghYXV0b3BsYXkgJiYgYXV0b3BsYXlCdXR0b24pIHsgaGlkZUVsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgaWYgKCFuYXYgJiYgbmF2Q29udGFpbmVyKSB7IGhpZGVFbGVtZW50KG5hdkNvbnRhaW5lcik7IH1cbiAgICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgaGlkZUVsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgaGlkZUVsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgaGlkZUVsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVVSSAoKSB7XG4gICAgaWYgKGF1dG9wbGF5ICYmIGF1dG9wbGF5QnV0dG9uKSB7IHNob3dFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgIGlmIChuYXYgJiYgbmF2Q29udGFpbmVyKSB7IHNob3dFbGVtZW50KG5hdkNvbnRhaW5lcik7IH1cbiAgICBpZiAoY29udHJvbHMpIHtcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBzaG93RWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBzaG93RWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBzaG93RWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZyZWV6ZVNsaWRlciAoKSB7XG4gICAgaWYgKGZyb3plbikgeyByZXR1cm47IH1cblxuICAgIC8vIHJlbW92ZSBlZGdlIHBhZGRpbmcgZnJvbSBpbm5lciB3cmFwcGVyXG4gICAgaWYgKGVkZ2VQYWRkaW5nKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnMHB4JzsgfVxuXG4gICAgLy8gYWRkIGNsYXNzIHRucy10cmFuc3BhcmVudCB0byBjbG9uZWQgc2xpZGVzXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBzdHIgPSAndG5zLXRyYW5zcGFyZW50JztcbiAgICAgIGZvciAodmFyIGkgPSBjbG9uZUNvdW50OyBpLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBhZGRDbGFzcyhzbGlkZUl0ZW1zW2ldLCBzdHIpOyB9XG4gICAgICAgIGFkZENsYXNzKHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGkgLSAxXSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBkaXNhYmxlVUkoKTtcblxuICAgIGZyb3plbiA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB1bmZyZWV6ZVNsaWRlciAoKSB7XG4gICAgaWYgKCFmcm96ZW4pIHsgcmV0dXJuOyB9XG5cbiAgICAvLyByZXN0b3JlIGVkZ2UgcGFkZGluZyBmb3IgaW5uZXIgd3JhcHBlclxuICAgIC8vIGZvciBtb3JkZXJuIGJyb3dzZXJzXG4gICAgaWYgKGVkZ2VQYWRkaW5nICYmIENTU01RKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnJzsgfVxuXG4gICAgLy8gcmVtb3ZlIGNsYXNzIHRucy10cmFuc3BhcmVudCB0byBjbG9uZWQgc2xpZGVzXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBzdHIgPSAndG5zLXRyYW5zcGFyZW50JztcbiAgICAgIGZvciAodmFyIGkgPSBjbG9uZUNvdW50OyBpLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyByZW1vdmVDbGFzcyhzbGlkZUl0ZW1zW2ldLCBzdHIpOyB9XG4gICAgICAgIHJlbW92ZUNsYXNzKHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGkgLSAxXSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBlbmFibGVVSSgpO1xuXG4gICAgZnJvemVuID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlU2xpZGVyICgpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBzaGVldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZShuZXdDb250YWluZXJDbGFzc2VzLnN1YnN0cmluZygxKSwgJycpO1xuICAgIHJlbW92ZUF0dHJzKGNvbnRhaW5lciwgWydzdHlsZSddKTtcbiAgICBpZiAobG9vcCkge1xuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IGhpZGVFbGVtZW50KHNsaWRlSXRlbXNbal0pOyB9XG4gICAgICAgIGhpZGVFbGVtZW50KHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGogLSAxXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmVydGljYWwgc2xpZGVyXG4gICAgaWYgKCFob3Jpem9udGFsIHx8ICFjYXJvdXNlbCkgeyByZW1vdmVBdHRycyhpbm5lcldyYXBwZXIsIFsnc3R5bGUnXSk7IH1cblxuICAgIC8vIGdhbGxlcnlcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcbiAgICAgICAgcmVtb3ZlQXR0cnMoaXRlbSwgWydzdHlsZSddKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZGlzYWJsZVVJKCk7XG5cbiAgICBkaXNhYmxlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVTbGlkZXIgKCkge1xuICAgIGlmICghZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBzaGVldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gbmV3Q29udGFpbmVyQ2xhc3NlcztcbiAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuXG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBzaG93RWxlbWVudChzbGlkZUl0ZW1zW2pdKTsgfVxuICAgICAgICBzaG93RWxlbWVudChzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBqIC0gMV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdhbGxlcnlcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXSxcbiAgICAgICAgICAgIGNsYXNzTiA9IGkgPCBpbmRleCArIGl0ZW1zID8gYW5pbWF0ZUluIDogYW5pbWF0ZU5vcm1hbDtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NOKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBlbmFibGVVSSgpO1xuXG4gICAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUxpdmVSZWdpb24gKCkge1xuICAgIHZhciBzdHIgPSBnZXRMaXZlUmVnaW9uU3RyKCk7XG4gICAgaWYgKGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCAhPT0gc3RyKSB7IGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCA9IHN0cjsgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGl2ZVJlZ2lvblN0ciAoKSB7XG4gICAgdmFyIGFyciA9IGdldFZpc2libGVTbGlkZVJhbmdlKCksXG4gICAgICAgIHN0YXJ0ID0gYXJyWzBdICsgMSxcbiAgICAgICAgZW5kID0gYXJyWzFdICsgMTtcbiAgICByZXR1cm4gc3RhcnQgPT09IGVuZCA/IHN0YXJ0ICsgJycgOiBzdGFydCArICcgdG8gJyArIGVuZDsgXG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaXNpYmxlU2xpZGVSYW5nZSAodmFsKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7IHZhbCA9IGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCk7IH1cbiAgICB2YXIgc3RhcnQgPSBpbmRleCwgZW5kLCByYW5nZXN0YXJ0LCByYW5nZWVuZDtcblxuICAgIC8vIGdldCByYW5nZSBzdGFydCwgcmFuZ2UgZW5kIGZvciBhdXRvV2lkdGggYW5kIGZpeGVkV2lkdGhcbiAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICBpZiAoYXV0b1dpZHRoIHx8IGZpeGVkV2lkdGgpIHtcbiAgICAgICAgcmFuZ2VzdGFydCA9IC0gKHBhcnNlRmxvYXQodmFsKSArIGVkZ2VQYWRkaW5nKTtcbiAgICAgICAgcmFuZ2VlbmQgPSByYW5nZXN0YXJ0ICsgdmlld3BvcnQgKyBlZGdlUGFkZGluZyAqIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgcmFuZ2VzdGFydCA9IHNsaWRlUG9zaXRpb25zW2luZGV4XTtcbiAgICAgICAgcmFuZ2VlbmQgPSByYW5nZXN0YXJ0ICsgdmlld3BvcnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IHN0YXJ0LCBlbmRcbiAgICAvLyAtIGNoZWNrIGF1dG8gd2lkdGhcbiAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICBzbGlkZVBvc2l0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50LCBpKSB7XG4gICAgICAgIGlmIChpIDwgc2xpZGVDb3VudE5ldykge1xuICAgICAgICAgIGlmICgoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSAmJiBwb2ludCA8PSByYW5nZXN0YXJ0ICsgMC41KSB7IHN0YXJ0ID0gaTsgfVxuICAgICAgICAgIGlmIChyYW5nZWVuZCAtIHBvaW50ID49IDAuNSkgeyBlbmQgPSBpOyB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgLy8gLSBjaGVjayBwZXJjZW50YWdlIHdpZHRoLCBmaXhlZCB3aWR0aFxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgIHZhciBjZWxsID0gZml4ZWRXaWR0aCArIGd1dHRlcjtcbiAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihyYW5nZXN0YXJ0L2NlbGwpO1xuICAgICAgICAgIGVuZCA9IE1hdGguY2VpbChyYW5nZWVuZC9jZWxsIC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBNYXRoLmNlaWwodmlld3BvcnQvY2VsbCkgLSAxO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICB2YXIgYSA9IGl0ZW1zIC0gMTtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBzdGFydCAtPSBhIC8gMjtcbiAgICAgICAgICAgIGVuZCA9IGluZGV4ICsgYSAvIDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZCA9IGluZGV4ICsgYTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICAgIHZhciBiID0gZWRnZVBhZGRpbmcgKiBpdGVtcyAvIHZpZXdwb3J0O1xuICAgICAgICAgICAgc3RhcnQgLT0gYjtcbiAgICAgICAgICAgIGVuZCArPSBiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihzdGFydCk7XG4gICAgICAgICAgZW5kID0gTWF0aC5jZWlsKGVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBpdGVtcyAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3RhcnQgPSBNYXRoLm1heChzdGFydCwgMCk7XG4gICAgICBlbmQgPSBNYXRoLm1pbihlbmQsIHNsaWRlQ291bnROZXcgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9MYXp5TG9hZCAoKSB7XG4gICAgaWYgKGxhenlsb2FkICYmICFkaXNhYmxlKSB7XG4gICAgICBnZXRJbWFnZUFycmF5LmFwcGx5KG51bGwsIGdldFZpc2libGVTbGlkZVJhbmdlKCkpLmZvckVhY2goZnVuY3Rpb24gKGltZykge1xuICAgICAgICBpZiAoIWhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHtcbiAgICAgICAgICAvLyBzdG9wIHByb3BhZ2F0aW9uIHRyYW5zaXRpb25lbmQgZXZlbnQgdG8gY29udGFpbmVyXG4gICAgICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH07XG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgZXZlKTtcblxuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgc3JjXG4gICAgICAgICAgaW1nLnNyYyA9IGdldEF0dHIoaW1nLCAnZGF0YS1zcmMnKTtcblxuICAgICAgICAgIC8vIHVwZGF0ZSBzcmNzZXRcbiAgICAgICAgICB2YXIgc3Jjc2V0ID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyY3NldCcpO1xuICAgICAgICAgIGlmIChzcmNzZXQpIHsgaW1nLnNyY3NldCA9IHNyY3NldDsgfVxuXG4gICAgICAgICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkltZ0xvYWRlZCAoZSkge1xuICAgIGltZ0xvYWRlZChnZXRUYXJnZXQoZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25JbWdGYWlsZWQgKGUpIHtcbiAgICBpbWdGYWlsZWQoZ2V0VGFyZ2V0KGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0xvYWRlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGVkJyk7XG4gICAgaW1nQ29tcGxldGVkKGltZyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdGYWlsZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ2ZhaWxlZCcpO1xuICAgIGltZ0NvbXBsZXRlZChpbWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nQ29tcGxldGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICd0bnMtY29tcGxldGUnKTtcbiAgICByZW1vdmVDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgcmVtb3ZlRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEltYWdlQXJyYXkgKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaW1ncyA9IFtdO1xuICAgIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICAgIGZvckVhY2goc2xpZGVJdGVtc1tzdGFydF0ucXVlcnlTZWxlY3RvckFsbCgnaW1nJyksIGZ1bmN0aW9uIChpbWcpIHsgaW1ncy5wdXNoKGltZyk7IH0pO1xuICAgICAgc3RhcnQrKztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1ncztcbiAgfVxuXG4gIC8vIGNoZWNrIGlmIGFsbCB2aXNpYmxlIGltYWdlcyBhcmUgbG9hZGVkXG4gIC8vIGFuZCB1cGRhdGUgY29udGFpbmVyIGhlaWdodCBpZiBpdCdzIGRvbmVcbiAgZnVuY3Rpb24gZG9BdXRvSGVpZ2h0ICgpIHtcbiAgICB2YXIgaW1ncyA9IGdldEltYWdlQXJyYXkuYXBwbHkobnVsbCwgZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSk7XG4gICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQpOyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ3NMb2FkZWRDaGVjayAoaW1ncywgY2IpIHtcbiAgICAvLyBkaXJlY3RseSBleGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uIGlmIGFsbCBpbWFnZXMgYXJlIGNvbXBsZXRlXG4gICAgaWYgKGltZ3NDb21wbGV0ZSkgeyByZXR1cm4gY2IoKTsgfVxuXG4gICAgLy8gY2hlY2sgc2VsZWN0ZWQgaW1hZ2UgY2xhc3NlcyBvdGhlcndpc2VcbiAgICBpbWdzLmZvckVhY2goZnVuY3Rpb24gKGltZywgaW5kZXgpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhpbWcsIGltZ0NvbXBsZXRlQ2xhc3MpKSB7IGltZ3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBzZWxlY3RlZCBpbWFnZXMgYXJlIGFsbCBjb21wbGV0ZVxuICAgIGlmICghaW1ncy5sZW5ndGgpIHsgcmV0dXJuIGNiKCk7IH1cblxuICAgIC8vIG90aGVyd2lzZSBleGVjdXRlIHRoaXMgZnVuY3Rpb25hIGFnYWluXG4gICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCBjYik7IH0pO1xuICB9IFxuXG4gIGZ1bmN0aW9uIGFkZGl0aW9uYWxVcGRhdGVzICgpIHtcbiAgICBkb0xhenlMb2FkKCk7IFxuICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG4gICAgdXBkYXRlTGl2ZVJlZ2lvbigpO1xuICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XG4gICAgdXBkYXRlTmF2U3RhdHVzKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uICgpIHtcbiAgICBpZiAoY2Fyb3VzZWwgJiYgYXV0b0hlaWdodCkge1xuICAgICAgbWlkZGxlV3JhcHBlci5zdHlsZVtUUkFOU0lUSU9ORFVSQVRJT05dID0gc3BlZWQgLyAxMDAwICsgJ3MnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1heFNsaWRlSGVpZ2h0IChzbGlkZVN0YXJ0LCBzbGlkZVJhbmdlKSB7XG4gICAgdmFyIGhlaWdodHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gc2xpZGVTdGFydCwgbCA9IE1hdGgubWluKHNsaWRlU3RhcnQgKyBzbGlkZVJhbmdlLCBzbGlkZUNvdW50TmV3KTsgaSA8IGw7IGkrKykge1xuICAgICAgaGVpZ2h0cy5wdXNoKHNsaWRlSXRlbXNbaV0ub2Zmc2V0SGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgaGVpZ2h0cyk7XG4gIH1cblxuICAvLyB1cGRhdGUgaW5uZXIgd3JhcHBlciBoZWlnaHRcbiAgLy8gMS4gZ2V0IHRoZSBtYXgtaGVpZ2h0IG9mIHRoZSB2aXNpYmxlIHNsaWRlc1xuICAvLyAyLiBzZXQgdHJhbnNpdGlvbkR1cmF0aW9uIHRvIHNwZWVkXG4gIC8vIDMuIHVwZGF0ZSBpbm5lciB3cmFwcGVyIGhlaWdodCB0byBtYXgtaGVpZ2h0XG4gIC8vIDQuIHNldCB0cmFuc2l0aW9uRHVyYXRpb24gdG8gMHMgYWZ0ZXIgdHJhbnNpdGlvbiBkb25lXG4gIGZ1bmN0aW9uIHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCAoKSB7XG4gICAgdmFyIG1heEhlaWdodCA9IGF1dG9IZWlnaHQgPyBnZXRNYXhTbGlkZUhlaWdodChpbmRleCwgaXRlbXMpIDogZ2V0TWF4U2xpZGVIZWlnaHQoY2xvbmVDb3VudCwgc2xpZGVDb3VudCksXG4gICAgICAgIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG5cbiAgICBpZiAod3Auc3R5bGUuaGVpZ2h0ICE9PSBtYXhIZWlnaHQpIHsgd3Auc3R5bGUuaGVpZ2h0ID0gbWF4SGVpZ2h0ICsgJ3B4JzsgfVxuICB9XG5cbiAgLy8gZ2V0IHRoZSBkaXN0YW5jZSBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgZmlyc3Qgc2xpZGUgdG8gZWFjaCBzbGlkZVxuICAvLyAoaW5pdCkgPT4gc2xpZGVQb3NpdGlvbnNcbiAgZnVuY3Rpb24gc2V0U2xpZGVQb3NpdGlvbnMgKCkge1xuICAgIHNsaWRlUG9zaXRpb25zID0gWzBdO1xuICAgIHZhciBhdHRyID0gaG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnLFxuICAgICAgICBhdHRyMiA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbScsXG4gICAgICAgIGJhc2UgPSBzbGlkZUl0ZW1zWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHJdO1xuXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAvLyBza2lwIHRoZSBmaXJzdCBzbGlkZVxuICAgICAgaWYgKGkpIHsgc2xpZGVQb3NpdGlvbnMucHVzaChpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHJdIC0gYmFzZSk7IH1cbiAgICAgIC8vIGFkZCB0aGUgZW5kIGVkZ2VcbiAgICAgIGlmIChpID09PSBzbGlkZUNvdW50TmV3IC0gMSkgeyBzbGlkZVBvc2l0aW9ucy5wdXNoKGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cjJdIC0gYmFzZSk7IH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBzbGlkZVxuICBmdW5jdGlvbiB1cGRhdGVTbGlkZVN0YXR1cyAoKSB7XG4gICAgdmFyIHJhbmdlID0gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSxcbiAgICAgICAgc3RhcnQgPSByYW5nZVswXSxcbiAgICAgICAgZW5kID0gcmFuZ2VbMV07XG5cbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIC8vIHNob3cgc2xpZGVzXG4gICAgICBpZiAoaSA+PSBzdGFydCAmJiBpIDw9IGVuZCkge1xuICAgICAgICBpZiAoaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICAgIHJlbW92ZUF0dHJzKGl0ZW0sIFsnYXJpYS1oaWRkZW4nLCAndGFiaW5kZXgnXSk7XG4gICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIC8vIGhpZGUgc2xpZGVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc0F0dHIoaXRlbSwgJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGdhbGxlcnk6IHVwZGF0ZSBzbGlkZSBwb3NpdGlvblxuICBmdW5jdGlvbiB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMgKCkge1xuICAgIHZhciBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7XG4gICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcbiAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcblxuICAgICAgaWYgKGkgPj0gaW5kZXggJiYgaSA8IGwpIHtcbiAgICAgICAgLy8gYWRkIHRyYW5zaXRpb25zIHRvIHZpc2libGUgc2xpZGVzIHdoZW4gYWRqdXN0aW5nIHRoZWlyIHBvc2l0aW9uc1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCAndG5zLW1vdmluZycpO1xuXG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLnN0eWxlLmxlZnQpIHtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgb3V0bGV0IGFuaW1hdGlvblxuICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZpbmcgJy50bnMtbW92aW5nJ1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCAndG5zLW1vdmluZycpO1xuICAgICAgfSk7XG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIC8vIHNldCB0YWJpbmRleCBvbiBOYXZcbiAgZnVuY3Rpb24gdXBkYXRlTmF2U3RhdHVzICgpIHtcbiAgICAvLyBnZXQgY3VycmVudCBuYXZcbiAgICBpZiAobmF2KSB7XG4gICAgICBuYXZDdXJyZW50SW5kZXggPSBuYXZDbGlja2VkID49IDAgPyBuYXZDbGlja2VkIDogZ2V0Q3VycmVudE5hdkluZGV4KCk7XG4gICAgICBuYXZDbGlja2VkID0gLTE7XG5cbiAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggIT09IG5hdkN1cnJlbnRJbmRleENhY2hlZCkge1xuICAgICAgICB2YXIgbmF2UHJldiA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleENhY2hlZF0sXG4gICAgICAgICAgICBuYXZDdXJyZW50ID0gbmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XTtcblxuICAgICAgICBzZXRBdHRycyhuYXZQcmV2LCB7XG4gICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXhDYWNoZWQgKyAxKVxuICAgICAgICB9KTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2UHJldiwgbmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICBcbiAgICAgICAgc2V0QXR0cnMobmF2Q3VycmVudCwgeydhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleCArIDEpICsgbmF2U3RyQ3VycmVudH0pO1xuICAgICAgICByZW1vdmVBdHRycyhuYXZDdXJyZW50LCAndGFiaW5kZXgnKTtcbiAgICAgICAgYWRkQ2xhc3MobmF2Q3VycmVudCwgbmF2QWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkN1cnJlbnRJbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMb3dlckNhc2VOb2RlTmFtZSAoZWwpIHtcbiAgICByZXR1cm4gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQnV0dG9uIChlbCkge1xuICAgIHJldHVybiBnZXRMb3dlckNhc2VOb2RlTmFtZShlbCkgPT09ICdidXR0b24nO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcmlhRGlzYWJsZWQgKGVsKSB7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNFbmFibGVFbGVtZW50IChpc0J1dHRvbiwgZWwsIHZhbCkge1xuICAgIGlmIChpc0J1dHRvbikge1xuICAgICAgZWwuZGlzYWJsZWQgPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIHZhbC50b1N0cmluZygpKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgJ2Rpc2FibGVkJyB0byB0cnVlIG9uIGNvbnRyb2xzIHdoZW4gcmVhY2ggdGhlIGVkZ2VzXG4gIGZ1bmN0aW9uIHVwZGF0ZUNvbnRyb2xzU3RhdHVzICgpIHtcbiAgICBpZiAoIWNvbnRyb2xzIHx8IHJld2luZCB8fCBsb29wKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIHByZXZEaXNhYmxlZCA9IChwcmV2SXNCdXR0b24pID8gcHJldkJ1dHRvbi5kaXNhYmxlZCA6IGlzQXJpYURpc2FibGVkKHByZXZCdXR0b24pLFxuICAgICAgICBuZXh0RGlzYWJsZWQgPSAobmV4dElzQnV0dG9uKSA/IG5leHRCdXR0b24uZGlzYWJsZWQgOiBpc0FyaWFEaXNhYmxlZChuZXh0QnV0dG9uKSxcbiAgICAgICAgZGlzYWJsZVByZXYgPSAoaW5kZXggPD0gaW5kZXhNaW4pID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBkaXNhYmxlTmV4dCA9ICghcmV3aW5kICYmIGluZGV4ID49IGluZGV4TWF4KSA/IHRydWUgOiBmYWxzZTtcblxuICAgIGlmIChkaXNhYmxlUHJldiAmJiAhcHJldkRpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICghZGlzYWJsZVByZXYgJiYgcHJldkRpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoZGlzYWJsZU5leHQgJiYgIW5leHREaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIWRpc2FibGVOZXh0ICYmIG5leHREaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgZHVyYXRpb25cbiAgZnVuY3Rpb24gcmVzZXREdXJhdGlvbiAoZWwsIHN0cikge1xuICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgZWwuc3R5bGVbVFJBTlNJVElPTkRVUkFUSU9OXSA9IHN0cjsgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVyV2lkdGggKCkge1xuICAgIHJldHVybiBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudE5ldyA6IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXddO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2VudGVyR2FwIChudW0pIHtcbiAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cblxuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGd1dHRlciA6IDA7XG4gICAgcmV0dXJuIGF1dG9XaWR0aCA/ICgodmlld3BvcnQgLSBnYXApIC0gKHNsaWRlUG9zaXRpb25zW251bSArIDFdIC0gc2xpZGVQb3NpdGlvbnNbbnVtXSAtIGd1dHRlcikpLzIgOlxuICAgICAgZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6XG4gICAgICAgIChpdGVtcyAtIDEpIC8gMjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJpZ2h0Qm91bmRhcnkgKCkge1xuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGd1dHRlciA6IDAsXG4gICAgICAgIHJlc3VsdCA9ICh2aWV3cG9ydCArIGdhcCkgLSBnZXRTbGlkZXJXaWR0aCgpO1xuXG4gICAgaWYgKGNlbnRlciAmJiAhbG9vcCkge1xuICAgICAgcmVzdWx0ID0gZml4ZWRXaWR0aCA/IC0gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogKHNsaWRlQ291bnROZXcgLSAxKSAtIGdldENlbnRlckdhcCgpIDpcbiAgICAgICAgZ2V0Q2VudGVyR2FwKHNsaWRlQ291bnROZXcgLSAxKSAtIHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXcgLSAxXTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA+IDApIHsgcmVzdWx0ID0gMDsgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlIChudW0pIHtcbiAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cblxuICAgIHZhciB2YWw7XG4gICAgaWYgKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgdmFsID0gLSAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBudW07XG4gICAgICAgIGlmIChjZW50ZXIpIHsgdmFsICs9IGdldENlbnRlckdhcCgpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVub21pbmF0b3IgPSBUUkFOU0ZPUk0gPyBzbGlkZUNvdW50TmV3IDogaXRlbXM7XG4gICAgICAgIGlmIChjZW50ZXIpIHsgbnVtIC09IGdldENlbnRlckdhcCgpOyB9XG4gICAgICAgIHZhbCA9IC0gbnVtICogMTAwIC8gZGVub21pbmF0b3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbCA9IC0gc2xpZGVQb3NpdGlvbnNbbnVtXTtcbiAgICAgIGlmIChjZW50ZXIgJiYgYXV0b1dpZHRoKSB7XG4gICAgICAgIHZhbCArPSBnZXRDZW50ZXJHYXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyB2YWwgPSBNYXRoLm1heCh2YWwsIHJpZ2h0Qm91bmRhcnkpOyB9XG5cbiAgICB2YWwgKz0gKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAhZml4ZWRXaWR0aCkgPyAnJScgOiAncHgnO1xuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50ICh2YWwpIHtcbiAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJzBzJyk7XG4gICAgZG9Db250YWluZXJUcmFuc2Zvcm0odmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtICh2YWwpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHsgdmFsID0gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKTsgfVxuICAgIGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXSA9IHRyYW5zZm9ybVByZWZpeCArIHZhbCArIHRyYW5zZm9ybVBvc3RmaXg7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlU2xpZGUgKG51bWJlciwgY2xhc3NPdXQsIGNsYXNzSW4sIGlzT3V0KSB7XG4gICAgdmFyIGwgPSBudW1iZXIgKyBpdGVtcztcbiAgICBpZiAoIWxvb3ApIHsgbCA9IE1hdGgubWluKGwsIHNsaWRlQ291bnROZXcpOyB9XG5cbiAgICBmb3IgKHZhciBpID0gbnVtYmVyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcblxuICAgICAgLy8gc2V0IGl0ZW0gcG9zaXRpb25zXG4gICAgICBpZiAoIWlzT3V0KSB7IGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7IH1cblxuICAgICAgaWYgKGFuaW1hdGVEZWxheSAmJiBUUkFOU0lUSU9OREVMQVkpIHtcbiAgICAgICAgaXRlbS5zdHlsZVtUUkFOU0lUSU9OREVMQVldID0gaXRlbS5zdHlsZVtBTklNQVRJT05ERUxBWV0gPSBhbmltYXRlRGVsYXkgKiAoaSAtIG51bWJlcikgLyAxMDAwICsgJ3MnO1xuICAgICAgfVxuICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgY2xhc3NPdXQpO1xuICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NJbik7XG4gICAgICBcbiAgICAgIGlmIChpc091dCkgeyBzbGlkZUl0ZW1zT3V0LnB1c2goaXRlbSk7IH1cbiAgICB9XG4gIH1cblxuICAvLyBtYWtlIHRyYW5zZmVyIGFmdGVyIGNsaWNrL2RyYWc6XG4gIC8vIDEuIGNoYW5nZSAndHJhbnNmb3JtJyBwcm9wZXJ0eSBmb3IgbW9yZGVybiBicm93c2Vyc1xuICAvLyAyLiBjaGFuZ2UgJ2xlZnQnIHByb3BlcnR5IGZvciBsZWdhY3kgYnJvd3NlcnNcbiAgdmFyIHRyYW5zZm9ybUNvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYXJvdXNlbCA/XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnJyk7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gfHwgIXNwZWVkKSB7XG4gICAgICAgICAgLy8gZm9yIG1vcmRlbiBicm93c2VycyB3aXRoIG5vbi16ZXJvIGR1cmF0aW9uIG9yIFxuICAgICAgICAgIC8vIHplcm8gZHVyYXRpb24gZm9yIGFsbCBicm93c2Vyc1xuICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKCk7XG4gICAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5IFxuICAgICAgICAgIC8vIHdoZW4gZHVyYXRpb24gaXMgMCAvIGNvbnRhaW5lciBpcyBoaWRkZW5cbiAgICAgICAgICBpZiAoIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZm9yIG9sZCBicm93c2VyIHdpdGggbm9uLXplcm8gZHVyYXRpb25cbiAgICAgICAgICBqc1RyYW5zZm9ybShjb250YWluZXIsIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKSwgc3BlZWQsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhvcml6b250YWwpIHsgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTsgfVxuICAgICAgfSA6XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNsaWRlSXRlbXNPdXQgPSBbXTtcblxuICAgICAgICB2YXIgZXZlID0ge307XG4gICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGV2ZVtBTklNQVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgICByZW1vdmVFdmVudHMoc2xpZGVJdGVtc1tpbmRleENhY2hlZF0sIGV2ZSk7XG4gICAgICAgIGFkZEV2ZW50cyhzbGlkZUl0ZW1zW2luZGV4XSwgZXZlKTtcblxuICAgICAgICBhbmltYXRlU2xpZGUoaW5kZXhDYWNoZWQsIGFuaW1hdGVJbiwgYW5pbWF0ZU91dCwgdHJ1ZSk7XG4gICAgICAgIGFuaW1hdGVTbGlkZShpbmRleCwgYW5pbWF0ZU5vcm1hbCwgYW5pbWF0ZUluKTtcblxuICAgICAgICAvLyBydW4gZmFsbGJhY2sgZnVuY3Rpb24gbWFudWFsbHkgXG4gICAgICAgIC8vIHdoZW4gdHJhbnNpdGlvbiBvciBhbmltYXRpb24gbm90IHN1cHBvcnRlZCAvIGR1cmF0aW9uIGlzIDBcbiAgICAgICAgaWYgKCFUUkFOU0lUSU9ORU5EIHx8ICFBTklNQVRJT05FTkQgfHwgIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiByZW5kZXIgKGUsIHNsaWRlck1vdmVkKSB7XG4gICAgaWYgKHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtKSB7IHVwZGF0ZUluZGV4KCk7IH1cblxuICAgIC8vIHJlbmRlciB3aGVuIHNsaWRlciB3YXMgbW92ZWQgKHRvdWNoIG9yIGRyYWcpIGV2ZW4gdGhvdWdoIGluZGV4IG1heSBub3QgY2hhbmdlXG4gICAgaWYgKGluZGV4ICE9PSBpbmRleENhY2hlZCB8fCBzbGlkZXJNb3ZlZCkge1xuICAgICAgLy8gZXZlbnRzXG4gICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcbiAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnLCBpbmZvKCkpO1xuICAgICAgaWYgKGF1dG9IZWlnaHQpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cblxuICAgICAgLy8gcGF1c2UgYXV0b3BsYXkgd2hlbiBjbGljayBvciBrZXlkb3duIGZyb20gdXNlclxuICAgICAgaWYgKGFuaW1hdGluZyAmJiBlICYmIFsnY2xpY2snLCAna2V5ZG93biddLmluZGV4T2YoZS50eXBlKSA+PSAwKSB7IHN0b3BBdXRvcGxheSgpOyB9XG5cbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgdHJhbnNmb3JtQ29yZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFRyYW5zZmVyIHByZWZpeGVkIHByb3BlcnRpZXMgdG8gdGhlIHNhbWUgZm9ybWF0XG4gICAqIENTUzogLVdlYmtpdC1UcmFuc2Zvcm0gPT4gd2Via2l0dHJhbnNmb3JtXG4gICAqIEpTOiBXZWJraXRUcmFuc2Zvcm0gPT4gd2Via2l0dHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBwcm9wZXJ0eVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gc3RyVHJhbnMgKHN0cikge1xuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tL2csICcnKTtcbiAgfVxuXG4gIC8vIEFGVEVSIFRSQU5TRk9STVxuICAvLyBUaGluZ3MgbmVlZCB0byBiZSBkb25lIGFmdGVyIGEgdHJhbnNmZXI6XG4gIC8vIDEuIGNoZWNrIGluZGV4XG4gIC8vIDIuIGFkZCBjbGFzc2VzIHRvIHZpc2libGUgc2xpZGVcbiAgLy8gMy4gZGlzYWJsZSBjb250cm9scyBidXR0b25zIHdoZW4gcmVhY2ggdGhlIGZpcnN0L2xhc3Qgc2xpZGUgaW4gbm9uLWxvb3Agc2xpZGVyXG4gIC8vIDQuIHVwZGF0ZSBuYXYgc3RhdHVzXG4gIC8vIDUuIGxhenlsb2FkIGltYWdlc1xuICAvLyA2LiB1cGRhdGUgY29udGFpbmVyIGhlaWdodFxuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQgKGV2ZW50KSB7XG4gICAgLy8gY2hlY2sgcnVubmluZyBvbiBnYWxsZXJ5IG1vZGVcbiAgICAvLyBtYWtlIHN1cmUgdHJhbnRpb25lbmQvYW5pbWF0aW9uZW5kIGV2ZW50cyBydW4gb25seSBvbmNlXG4gICAgaWYgKGNhcm91c2VsIHx8IHJ1bm5pbmcpIHtcbiAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uRW5kJywgaW5mbyhldmVudCkpO1xuXG4gICAgICBpZiAoIWNhcm91c2VsICYmIHNsaWRlSXRlbXNPdXQubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlSXRlbXNPdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNPdXRbaV07XG4gICAgICAgICAgLy8gc2V0IGl0ZW0gcG9zaXRpb25zXG4gICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gJyc7XG5cbiAgICAgICAgICBpZiAoQU5JTUFUSU9OREVMQVkgJiYgVFJBTlNJVElPTkRFTEFZKSB7IFxuICAgICAgICAgICAgaXRlbS5zdHlsZVtBTklNQVRJT05ERUxBWV0gPSAnJztcbiAgICAgICAgICAgIGl0ZW0uc3R5bGVbVFJBTlNJVElPTkRFTEFZXSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlT3V0KTtcbiAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiB1cGRhdGUgc2xpZGVzLCBuYXYsIGNvbnRyb2xzIGFmdGVyIGNoZWNraW5nIC4uLlxuICAgICAgICogPT4gbGVnYWN5IGJyb3dzZXJzIHdobyBkb24ndCBzdXBwb3J0ICdldmVudCcgXG4gICAgICAgKiAgICBoYXZlIHRvIGNoZWNrIGV2ZW50IGZpcnN0LCBvdGhlcndpc2UgZXZlbnQudGFyZ2V0IHdpbGwgY2F1c2UgYW4gZXJyb3IgXG4gICAgICAgKiA9PiBvciAnZ2FsbGVyeScgbW9kZTogXG4gICAgICAgKiAgICsgZXZlbnQgdGFyZ2V0IGlzIHNsaWRlIGl0ZW1cbiAgICAgICAqID0+IG9yICdjYXJvdXNlbCcgbW9kZTogXG4gICAgICAgKiAgICsgZXZlbnQgdGFyZ2V0IGlzIGNvbnRhaW5lciwgXG4gICAgICAgKiAgICsgZXZlbnQucHJvcGVydHkgaXMgdGhlIHNhbWUgd2l0aCB0cmFuc2Zvcm0gYXR0cmlidXRlXG4gICAgICAgKi9cbiAgICAgIGlmICghZXZlbnQgfHwgXG4gICAgICAgICAgIWNhcm91c2VsICYmIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlID09PSBjb250YWluZXIgfHwgXG4gICAgICAgICAgZXZlbnQudGFyZ2V0ID09PSBjb250YWluZXIgJiYgc3RyVHJhbnMoZXZlbnQucHJvcGVydHlOYW1lKSA9PT0gc3RyVHJhbnModHJhbnNmb3JtQXR0cikpIHtcblxuICAgICAgICBpZiAoIXVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtKSB7IFxuICAgICAgICAgIHZhciBpbmRleFRlbSA9IGluZGV4O1xuICAgICAgICAgIHVwZGF0ZUluZGV4KCk7XG4gICAgICAgICAgaWYgKGluZGV4ICE9PSBpbmRleFRlbSkgeyBcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuXG4gICAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcblxuICAgICAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7IGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7IH1cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICBpbmRleENhY2hlZCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLy8gIyBBQ1RJT05TXG4gIGZ1bmN0aW9uIGdvVG8gKHRhcmdldEluZGV4LCBlKSB7XG4gICAgaWYgKGZyZWV6ZSkgeyByZXR1cm47IH1cblxuICAgIC8vIHByZXYgc2xpZGVCeVxuICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ3ByZXYnKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpO1xuXG4gICAgLy8gbmV4dCBzbGlkZUJ5XG4gICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ25leHQnKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XG5cbiAgICAvLyBnbyB0byBleGFjdCBzbGlkZVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICAgIH1cblxuICAgICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSwgXG4gICAgICAgICAgaW5kZXhHYXAgPSAwO1xuXG4gICAgICBpZiAodGFyZ2V0SW5kZXggPT09ICdmaXJzdCcpIHtcbiAgICAgICAgaW5kZXhHYXAgPSAtIGFic0luZGV4O1xuICAgICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ2xhc3QnKSB7XG4gICAgICAgIGluZGV4R2FwID0gY2Fyb3VzZWwgPyBzbGlkZUNvdW50IC0gaXRlbXMgLSBhYnNJbmRleCA6IHNsaWRlQ291bnQgLSAxIC0gYWJzSW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldEluZGV4ICE9PSAnbnVtYmVyJykgeyB0YXJnZXRJbmRleCA9IHBhcnNlSW50KHRhcmdldEluZGV4KTsgfVxuXG4gICAgICAgIGlmICghaXNOYU4odGFyZ2V0SW5kZXgpKSB7XG4gICAgICAgICAgLy8gZnJvbSBkaXJlY3RseSBjYWxsZWQgZ29UbyBmdW5jdGlvblxuICAgICAgICAgIGlmICghZSkgeyB0YXJnZXRJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNsaWRlQ291bnQgLSAxLCB0YXJnZXRJbmRleCkpOyB9XG5cbiAgICAgICAgICBpbmRleEdhcCA9IHRhcmdldEluZGV4IC0gYWJzSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZ2FsbGVyeTogbWFrZSBzdXJlIG5ldyBwYWdlIHdvbid0IG92ZXJsYXAgd2l0aCBjdXJyZW50IHBhZ2VcbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgaW5kZXhHYXAgJiYgTWF0aC5hYnMoaW5kZXhHYXApIDwgaXRlbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvciA9IGluZGV4R2FwID4gMCA/IDEgOiAtMTtcbiAgICAgICAgaW5kZXhHYXAgKz0gKGluZGV4ICsgaW5kZXhHYXAgLSBzbGlkZUNvdW50KSA+PSBpbmRleE1pbiA/IHNsaWRlQ291bnQgKiBmYWN0b3IgOiBzbGlkZUNvdW50ICogMiAqIGZhY3RvciAqIC0xO1xuICAgICAgfVxuXG4gICAgICBpbmRleCArPSBpbmRleEdhcDtcblxuICAgICAgLy8gbWFrZSBzdXJlIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICBpZiAoY2Fyb3VzZWwgJiYgbG9vcCkge1xuICAgICAgICBpZiAoaW5kZXggPCBpbmRleE1pbikgeyBpbmRleCArPSBzbGlkZUNvdW50OyB9XG4gICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgaW5kZXggaXMgY2hhbmdlZCwgc3RhcnQgcmVuZGVyaW5nXG4gICAgICBpZiAoZ2V0QWJzSW5kZXgoaW5kZXgpICE9PSBnZXRBYnNJbmRleChpbmRleENhY2hlZCkpIHtcbiAgICAgICAgcmVuZGVyKGUpO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgLy8gb24gY29udHJvbHMgY2xpY2tcbiAgZnVuY3Rpb24gb25Db250cm9sc0NsaWNrIChlLCBkaXIpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuICAgIHZhciBwYXNzRXZlbnRPYmplY3Q7XG5cbiAgICBpZiAoIWRpcikge1xuICAgICAgZSA9IGdldEV2ZW50KGUpO1xuICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKTtcblxuICAgICAgd2hpbGUgKHRhcmdldCAhPT0gY29udHJvbHNDb250YWluZXIgJiYgW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KSA8IDApIHsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7IH1cblxuICAgICAgdmFyIHRhcmdldEluID0gW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgIGlmICh0YXJnZXRJbiA+PSAwKSB7XG4gICAgICAgIHBhc3NFdmVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGRpciA9IHRhcmdldEluID09PSAwID8gLTEgOiAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXdpbmQpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gaW5kZXhNaW4gJiYgZGlyID09PSAtMSkge1xuICAgICAgICBnb1RvKCdsYXN0JywgZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IGluZGV4TWF4ICYmIGRpciA9PT0gMSkge1xuICAgICAgICBnb1RvKCdmaXJzdCcsIGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpcikge1xuICAgICAgaW5kZXggKz0gc2xpZGVCeSAqIGRpcjtcbiAgICAgIGlmIChhdXRvV2lkdGgpIHsgaW5kZXggPSBNYXRoLmZsb29yKGluZGV4KTsgfVxuICAgICAgLy8gcGFzcyBlIHdoZW4gY2xpY2sgY29udHJvbCBidXR0b25zIG9yIGtleWRvd25cbiAgICAgIHJlbmRlcigocGFzc0V2ZW50T2JqZWN0IHx8IChlICYmIGUudHlwZSA9PT0gJ2tleWRvd24nKSkgPyBlIDogbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gb24gbmF2IGNsaWNrXG4gIGZ1bmN0aW9uIG9uTmF2Q2xpY2sgKGUpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuICAgIFxuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpLCBuYXZJbmRleDtcblxuICAgIC8vIGZpbmQgdGhlIGNsaWNrZWQgbmF2IGl0ZW1cbiAgICB3aGlsZSAodGFyZ2V0ICE9PSBuYXZDb250YWluZXIgJiYgIWhhc0F0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSkgeyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTsgfVxuICAgIGlmIChoYXNBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpIHtcbiAgICAgIHZhciBuYXZJbmRleCA9IG5hdkNsaWNrZWQgPSBOdW1iZXIoZ2V0QXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSxcbiAgICAgICAgICB0YXJnZXRJbmRleEJhc2UgPSBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IG5hdkluZGV4ICogc2xpZGVDb3VudCAvIHBhZ2VzIDogbmF2SW5kZXggKiBpdGVtcyxcbiAgICAgICAgICB0YXJnZXRJbmRleCA9IG5hdkFzVGh1bWJuYWlscyA/IG5hdkluZGV4IDogTWF0aC5taW4oTWF0aC5jZWlsKHRhcmdldEluZGV4QmFzZSksIHNsaWRlQ291bnQgLSAxKTtcbiAgICAgIGdvVG8odGFyZ2V0SW5kZXgsIGUpO1xuXG4gICAgICBpZiAobmF2Q3VycmVudEluZGV4ID09PSBuYXZJbmRleCkge1xuICAgICAgICBpZiAoYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheSgpOyB9XG4gICAgICAgIG5hdkNsaWNrZWQgPSAtMTsgLy8gcmVzZXQgbmF2Q2xpY2tlZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGF1dG9wbGF5IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBzZXRBdXRvcGxheVRpbWVyICgpIHtcbiAgICBhdXRvcGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgb25Db250cm9sc0NsaWNrKG51bGwsIGF1dG9wbGF5RGlyZWN0aW9uKTtcbiAgICB9LCBhdXRvcGxheVRpbWVvdXQpO1xuXG4gICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BBdXRvcGxheVRpbWVyICgpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9wbGF5VGltZXIpO1xuICAgIGFuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQXV0b3BsYXlCdXR0b24gKGFjdGlvbiwgdHh0KSB7XG4gICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiBhY3Rpb259KTtcbiAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBhdXRvcGxheUh0bWxTdHJpbmdzWzBdICsgYWN0aW9uICsgYXV0b3BsYXlIdG1sU3RyaW5nc1sxXSArIHR4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QXV0b3BsYXkgKCkge1xuICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgdXBkYXRlQXV0b3BsYXlCdXR0b24oJ3N0b3AnLCBhdXRvcGxheVRleHRbMV0pOyB9XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wQXV0b3BsYXkgKCkge1xuICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHVwZGF0ZUF1dG9wbGF5QnV0dG9uKCdzdGFydCcsIGF1dG9wbGF5VGV4dFswXSk7IH1cbiAgfVxuXG4gIC8vIHByb2dyYW1haXRjYWxseSBwbGF5L3BhdXNlIHRoZSBzbGlkZXJcbiAgZnVuY3Rpb24gcGxheSAoKSB7XG4gICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHtcbiAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwYXVzZSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgc3RvcEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUF1dG9wbGF5ICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICBzdG9wQXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVmlzaWJpbGl0eUNoYW5nZSAoKSB7XG4gICAgaWYgKGRvYy5oaWRkZW4pIHtcbiAgICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCkge1xuICAgICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdmVyUGF1c2UgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHsgXG4gICAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdXRSZXN0YXJ0ICgpIHtcbiAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlZCkgeyBcbiAgICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBrZXlkb3duIGV2ZW50cyBvbiBkb2N1bWVudCBcbiAgZnVuY3Rpb24gb25Eb2N1bWVudEtleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVF0uaW5kZXhPZihlLmtleUNvZGUpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCBrZXlJbmRleCA9PT0gMCA/IC0xIDogMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gb24ga2V5IGNvbnRyb2xcbiAgZnVuY3Rpb24gb25Db250cm9sc0tleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVF0uaW5kZXhPZihlLmtleUNvZGUpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIGlmIChrZXlJbmRleCA9PT0gMCkge1xuICAgICAgICBpZiAoIXByZXZCdXR0b24uZGlzYWJsZWQpIHsgb25Db250cm9sc0NsaWNrKGUsIC0xKTsgfVxuICAgICAgfSBlbHNlIGlmICghbmV4dEJ1dHRvbi5kaXNhYmxlZCkge1xuICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IGZvY3VzXG4gIGZ1bmN0aW9uIHNldEZvY3VzIChlbCkge1xuICAgIGVsLmZvY3VzKCk7XG4gIH1cblxuICAvLyBvbiBrZXkgbmF2XG4gIGZ1bmN0aW9uIG9uTmF2S2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIgY3VyRWxlbWVudCA9IGRvYy5hY3RpdmVFbGVtZW50O1xuICAgIGlmICghaGFzQXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSkgeyByZXR1cm47IH1cblxuICAgIC8vIHZhciBjb2RlID0gZS5rZXlDb2RlLFxuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFQsIEtFWVMuRU5URVIsIEtFWVMuU1BBQ0VdLmluZGV4T2YoZS5rZXlDb2RlKSxcbiAgICAgICAgbmF2SW5kZXggPSBOdW1iZXIoZ2V0QXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgaWYgKGtleUluZGV4ID09PSAwKSB7XG4gICAgICAgIGlmIChuYXZJbmRleCA+IDApIHsgc2V0Rm9jdXMobmF2SXRlbXNbbmF2SW5kZXggLSAxXSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoa2V5SW5kZXggPT09IDEpIHtcbiAgICAgICAgaWYgKG5hdkluZGV4IDwgcGFnZXMgLSAxKSB7IHNldEZvY3VzKG5hdkl0ZW1zW25hdkluZGV4ICsgMV0pOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYXZDbGlja2VkID0gbmF2SW5kZXg7XG4gICAgICAgIGdvVG8obmF2SW5kZXgsIGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV2ZW50IChlKSB7XG4gICAgZSA9IGUgfHwgd2luLmV2ZW50O1xuICAgIHJldHVybiBpc1RvdWNoRXZlbnQoZSkgPyBlLmNoYW5nZWRUb3VjaGVzWzBdIDogZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRUYXJnZXQgKGUpIHtcbiAgICByZXR1cm4gZS50YXJnZXQgfHwgd2luLmV2ZW50LnNyY0VsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQgKGUpIHtcbiAgICByZXR1cm4gZS50eXBlLmluZGV4T2YoJ3RvdWNoJykgPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0QmVoYXZpb3IgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkICgpIHtcbiAgICByZXR1cm4gZ2V0VG91Y2hEaXJlY3Rpb24odG9EZWdyZWUobGFzdFBvc2l0aW9uLnkgLSBpbml0UG9zaXRpb24ueSwgbGFzdFBvc2l0aW9uLnggLSBpbml0UG9zaXRpb24ueCksIHN3aXBlQW5nbGUpID09PSBvcHRpb25zLmF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiBvblBhblN0YXJ0IChlKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cblxuICAgIGlmIChhdXRvcGxheSAmJiBhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5VGltZXIoKTsgfVxuICAgIFxuICAgIHBhblN0YXJ0ID0gdHJ1ZTtcbiAgICBpZiAocmFmSW5kZXgpIHtcbiAgICAgIGNhZihyYWZJbmRleCk7XG4gICAgICByYWZJbmRleCA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hTdGFydCcgOiAnZHJhZ1N0YXJ0JywgaW5mbyhlKSk7XG5cbiAgICBpZiAoIWlzVG91Y2hFdmVudChlKSAmJiBbJ2ltZycsICdhJ10uaW5kZXhPZihnZXRMb3dlckNhc2VOb2RlTmFtZShnZXRUYXJnZXQoZSkpKSA+PSAwKSB7XG4gICAgICBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yKGUpO1xuICAgIH1cblxuICAgIGxhc3RQb3NpdGlvbi54ID0gaW5pdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgbGFzdFBvc2l0aW9uLnkgPSBpbml0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcbiAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgIHRyYW5zbGF0ZUluaXQgPSBwYXJzZUZsb2F0KGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXS5yZXBsYWNlKHRyYW5zZm9ybVByZWZpeCwgJycpKTtcbiAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnMHMnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblBhbk1vdmUgKGUpIHtcbiAgICBpZiAocGFuU3RhcnQpIHtcbiAgICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgICBsYXN0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICAgIGxhc3RQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuXG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKCFyYWZJbmRleCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkID09PSAnPycpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkKCk7IH1cbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldmVudFNjcm9sbCkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYW5VcGRhdGUgKGUpIHtcbiAgICBpZiAoIW1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgcGFuU3RhcnQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2FmKHJhZkluZGV4KTtcbiAgICBpZiAocGFuU3RhcnQpIHsgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKXsgcGFuVXBkYXRlKGUpOyB9KTsgfVxuXG4gICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9PT0gJz8nKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCgpOyB9XG4gICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgaWYgKCFwcmV2ZW50U2Nyb2xsICYmIGlzVG91Y2hFdmVudChlKSkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZS50eXBlKSB7IGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaE1vdmUnIDogJ2RyYWdNb3ZlJywgaW5mbyhlKSk7IH1cbiAgICAgIH0gY2F0Y2goZXJyKSB7fVxuXG4gICAgICB2YXIgeCA9IHRyYW5zbGF0ZUluaXQsXG4gICAgICAgICAgZGlzdCA9IGdldERpc3QobGFzdFBvc2l0aW9uLCBpbml0UG9zaXRpb24pO1xuICAgICAgaWYgKCFob3Jpem9udGFsIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICAgIHggKz0gZGlzdDtcbiAgICAgICAgeCArPSAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2VYID0gVFJBTlNGT1JNID8gZGlzdCAqIGl0ZW1zICogMTAwIC8gKCh2aWV3cG9ydCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3KTogZGlzdCAqIDEwMCAvICh2aWV3cG9ydCArIGd1dHRlcik7XG4gICAgICAgIHggKz0gcGVyY2VudGFnZVg7XG4gICAgICAgIHggKz0gJyUnO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0gPSB0cmFuc2Zvcm1QcmVmaXggKyB4ICsgdHJhbnNmb3JtUG9zdGZpeDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblBhbkVuZCAoZSkge1xuICAgIGlmIChwYW5TdGFydCkge1xuICAgICAgaWYgKHJhZkluZGV4KSB7XG4gICAgICAgIGNhZihyYWZJbmRleCk7XG4gICAgICAgIHJhZkluZGV4ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYXJvdXNlbCkgeyByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJycpOyB9XG4gICAgICBwYW5TdGFydCA9IGZhbHNlO1xuXG4gICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgICAgbGFzdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgICBsYXN0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcbiAgICAgIHZhciBkaXN0ID0gZ2V0RGlzdChsYXN0UG9zaXRpb24sIGluaXRQb3NpdGlvbik7XG5cbiAgICAgIGlmIChNYXRoLmFicyhkaXN0KSkge1xuICAgICAgICAvLyBkcmFnIHZzIGNsaWNrXG4gICAgICAgIGlmICghaXNUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgICAgLy8gcHJldmVudCBcImNsaWNrXCJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xuICAgICAgICAgIGFkZEV2ZW50cyh0YXJnZXQsIHsnY2xpY2snOiBmdW5jdGlvbiBwcmV2ZW50Q2xpY2sgKGUpIHtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0QmVoYXZpb3IoZSk7XG4gICAgICAgICAgICByZW1vdmVFdmVudHModGFyZ2V0LCB7J2NsaWNrJzogcHJldmVudENsaWNrfSk7XG4gICAgICAgICAgfX0pOyBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgIHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgICAgICAgICB2YXIgaW5kZXhNb3ZlZCA9IC0gZGlzdCAqIGl0ZW1zIC8gKHZpZXdwb3J0ICsgZ3V0dGVyKTtcbiAgICAgICAgICAgICAgaW5kZXhNb3ZlZCA9IGRpc3QgPiAwID8gTWF0aC5mbG9vcihpbmRleE1vdmVkKSA6IE1hdGguY2VpbChpbmRleE1vdmVkKTtcbiAgICAgICAgICAgICAgaW5kZXggKz0gaW5kZXhNb3ZlZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBtb3ZlZCA9IC0gKHRyYW5zbGF0ZUluaXQgKyBkaXN0KTtcbiAgICAgICAgICAgICAgaWYgKG1vdmVkIDw9IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4TWluO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vdmVkID49IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXcgLSAxXSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhNYXg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgc2xpZGVDb3VudE5ldyAmJiBtb3ZlZCA+PSBzbGlkZVBvc2l0aW9uc1tpXSkge1xuICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkID4gc2xpZGVQb3NpdGlvbnNbaV0gJiYgZGlzdCA8IDApIHsgaW5kZXggKz0gMTsgfVxuICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZW5kZXIoZSwgZGlzdCk7XG4gICAgICAgICAgICBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hFbmQnIDogJ2RyYWdFbmQnLCBpbmZvKGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgZGlzdCA+IDAgPyAtMSA6IDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc2V0XG4gICAgaWYgKG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdhdXRvJykgeyBwcmV2ZW50U2Nyb2xsID0gZmFsc2U7IH1cbiAgICBpZiAoc3dpcGVBbmdsZSkgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSAnPyc7IH0gXG4gICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHsgc2V0QXV0b3BsYXlUaW1lcigpOyB9XG4gIH1cblxuICAvLyA9PT0gUkVTSVpFIEZVTkNUSU9OUyA9PT0gLy9cbiAgLy8gKHNsaWRlUG9zaXRpb25zLCBpbmRleCwgaXRlbXMpID0+IHZlcnRpY2FsX2NvbmVudFdyYXBwZXIuaGVpZ2h0XG4gIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0ICgpIHtcbiAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcbiAgICB3cC5zdHlsZS5oZWlnaHQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleCArIGl0ZW1zXSAtIHNsaWRlUG9zaXRpb25zW2luZGV4XSArICdweCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWdlcyAoKSB7XG4gICAgdmFyIHJvdWdoID0gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnQgLyB2aWV3cG9ydCA6IHNsaWRlQ291bnQgLyBpdGVtcztcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5jZWlsKHJvdWdoKSwgc2xpZGVDb3VudCk7XG4gIH1cblxuICAvKlxuICAgKiAxLiB1cGRhdGUgdmlzaWJsZSBuYXYgaXRlbXMgbGlzdFxuICAgKiAyLiBhZGQgXCJoaWRkZW5cIiBhdHRyaWJ1dGVzIHRvIHByZXZpb3VzIHZpc2libGUgbmF2IGl0ZW1zXG4gICAqIDMuIHJlbW92ZSBcImhpZGRlblwiIGF0dHJ1YnV0ZXMgdG8gbmV3IHZpc2libGUgbmF2IGl0ZW1zXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGVOYXZWaXNpYmlsaXR5ICgpIHtcbiAgICBpZiAoIW5hdiB8fCBuYXZBc1RodW1ibmFpbHMpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAocGFnZXMgIT09IHBhZ2VzQ2FjaGVkKSB7XG4gICAgICB2YXIgbWluID0gcGFnZXNDYWNoZWQsXG4gICAgICAgICAgbWF4ID0gcGFnZXMsXG4gICAgICAgICAgZm4gPSBzaG93RWxlbWVudDtcblxuICAgICAgaWYgKHBhZ2VzQ2FjaGVkID4gcGFnZXMpIHtcbiAgICAgICAgbWluID0gcGFnZXM7XG4gICAgICAgIG1heCA9IHBhZ2VzQ2FjaGVkO1xuICAgICAgICBmbiA9IGhpZGVFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAobWluIDwgbWF4KSB7XG4gICAgICAgIGZuKG5hdkl0ZW1zW21pbl0pO1xuICAgICAgICBtaW4rKztcbiAgICAgIH1cblxuICAgICAgLy8gY2FjaGUgcGFnZXNcbiAgICAgIHBhZ2VzQ2FjaGVkID0gcGFnZXM7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5mbyAoZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIHNsaWRlSXRlbXM6IHNsaWRlSXRlbXMsXG4gICAgICBuYXZDb250YWluZXI6IG5hdkNvbnRhaW5lcixcbiAgICAgIG5hdkl0ZW1zOiBuYXZJdGVtcyxcbiAgICAgIGNvbnRyb2xzQ29udGFpbmVyOiBjb250cm9sc0NvbnRhaW5lcixcbiAgICAgIGhhc0NvbnRyb2xzOiBoYXNDb250cm9scyxcbiAgICAgIHByZXZCdXR0b246IHByZXZCdXR0b24sXG4gICAgICBuZXh0QnV0dG9uOiBuZXh0QnV0dG9uLFxuICAgICAgaXRlbXM6IGl0ZW1zLFxuICAgICAgc2xpZGVCeTogc2xpZGVCeSxcbiAgICAgIGNsb25lQ291bnQ6IGNsb25lQ291bnQsXG4gICAgICBzbGlkZUNvdW50OiBzbGlkZUNvdW50LFxuICAgICAgc2xpZGVDb3VudE5ldzogc2xpZGVDb3VudE5ldyxcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIGluZGV4Q2FjaGVkOiBpbmRleENhY2hlZCxcbiAgICAgIGRpc3BsYXlJbmRleDogZ2V0Q3VycmVudFNsaWRlKCksXG4gICAgICBuYXZDdXJyZW50SW5kZXg6IG5hdkN1cnJlbnRJbmRleCxcbiAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZDogbmF2Q3VycmVudEluZGV4Q2FjaGVkLFxuICAgICAgcGFnZXM6IHBhZ2VzLFxuICAgICAgcGFnZXNDYWNoZWQ6IHBhZ2VzQ2FjaGVkLFxuICAgICAgc2hlZXQ6IHNoZWV0LFxuICAgICAgaXNPbjogaXNPbixcbiAgICAgIGV2ZW50OiBlIHx8IHt9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246ICcyLjkuMicsXG4gICAgZ2V0SW5mbzogaW5mbyxcbiAgICBldmVudHM6IGV2ZW50cyxcbiAgICBnb1RvOiBnb1RvLFxuICAgIHBsYXk6IHBsYXksXG4gICAgcGF1c2U6IHBhdXNlLFxuICAgIGlzT246IGlzT24sXG4gICAgdXBkYXRlU2xpZGVySGVpZ2h0OiB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQsXG4gICAgcmVmcmVzaDogaW5pdFNsaWRlclRyYW5zZm9ybSxcbiAgICBkZXN0cm95OiBkZXN0cm95LFxuICAgIHJlYnVpbGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRucyhleHRlbmQob3B0aW9ucywgb3B0aW9uc0VsZW1lbnRzKSk7XG4gICAgfVxuICB9O1xufTtcblxucmV0dXJuIHRucztcbn0pKCk7IiwiLyohXG4gKiBCb290c3RyYXAgdjMuNC4xIChodHRwczovL2dldGJvb3RzdHJhcC5jb20vKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5Jylcbn1cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHZlcnNpb24gPSAkLmZuLmpxdWVyeS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJylcbiAgaWYgKCh2ZXJzaW9uWzBdIDwgMiAmJiB2ZXJzaW9uWzFdIDwgOSkgfHwgKHZlcnNpb25bMF0gPT0gMSAmJiB2ZXJzaW9uWzFdID09IDkgJiYgdmVyc2lvblsyXSA8IDEpIHx8ICh2ZXJzaW9uWzBdID4gMykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkgdmVyc2lvbiAxLjkuMSBvciBoaWdoZXIsIGJ1dCBsb3dlciB0aGFuIHZlcnNpb24gNCcpXG4gIH1cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRyYW5zaXRpb24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdHJhbnNpdGlvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDU1MgVFJBTlNJVElPTiBTVVBQT1JUIChTaG91dG91dDogaHR0cHM6Ly9tb2Rlcm5penIuY29tLylcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib290c3RyYXAnKVxuXG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICBNb3pUcmFuc2l0aW9uICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgT1RyYW5zaXRpb24gICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfVxuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7IGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2UgLy8gZXhwbGljaXQgZm9yIGllOCAoICAuXy4pXG4gIH1cblxuICAvLyBodHRwczovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXG4gICQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgICB2YXIgJGVsID0gdGhpc1xuICAgICQodGhpcykub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWUgfSlcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IGlmICghY2FsbGVkKSAkKCRlbCkudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpIH1cbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkdXJhdGlvbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgJChmdW5jdGlvbiAoKSB7XG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kKClcblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVyblxuXG4gICAgJC5ldmVudC5zcGVjaWFsLmJzVHJhbnNpdGlvbkVuZCA9IHtcbiAgICAgIGJpbmRUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBkZWxlZ2F0ZVR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoaXMpKSByZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhbGVydC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhbGVydHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBTEVSVCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgZGlzbWlzcyA9ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXG4gIHZhciBBbGVydCAgID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgJChlbCkub24oJ2NsaWNrJywgZGlzbWlzcywgdGhpcy5jbG9zZSlcbiAgfVxuXG4gIEFsZXJ0LlZFUlNJT04gPSAnMy40LjEnXG5cbiAgQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgID0gJCh0aGlzKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgc2VsZWN0b3IgICAgPSBzZWxlY3RvciA9PT0gJyMnID8gW10gOiBzZWxlY3RvclxuICAgIHZhciAkcGFyZW50ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxuICAgIH1cblxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XG4gICAgICAvLyBkZXRhY2ggZnJvbSBwYXJlbnQsIGZpcmUgZXZlbnQgdGhlbiBjbGVhbiB1cCBkYXRhXG4gICAgICAkcGFyZW50LmRldGFjaCgpLnRyaWdnZXIoJ2Nsb3NlZC5icy5hbGVydCcpLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHBhcmVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgcmVtb3ZlRWxlbWVudClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxuICB9XG5cblxuICAvLyBBTEVSVCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWxlcnRcblxuICAkLmZuLmFsZXJ0ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWxlcnQuQ29uc3RydWN0b3IgPSBBbGVydFxuXG5cbiAgLy8gQUxFUlQgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFMRVJUIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpJywgZGlzbWlzcywgQWxlcnQucHJvdG90eXBlLmNsb3NlKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBidXR0b24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYnV0dG9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEJVVFRPTiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9ICQuZXh0ZW5kKHt9LCBCdXR0b24uREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICB9XG5cbiAgQnV0dG9uLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEJ1dHRvbi5ERUZBVUxUUyA9IHtcbiAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGQgICAgPSAnZGlzYWJsZWQnXG4gICAgdmFyICRlbCAgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIHZhbCAgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xuICAgIHZhciBkYXRhID0gJGVsLmRhdGEoKVxuXG4gICAgc3RhdGUgKz0gJ1RleHQnXG5cbiAgICBpZiAoZGF0YS5yZXNldFRleHQgPT0gbnVsbCkgJGVsLmRhdGEoJ3Jlc2V0VGV4dCcsICRlbFt2YWxdKCkpXG5cbiAgICAvLyBwdXNoIHRvIGV2ZW50IGxvb3AgdG8gYWxsb3cgZm9ybXMgdG8gc3VibWl0XG4gICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbFt2YWxdKGRhdGFbc3RhdGVdID09IG51bGwgPyB0aGlzLm9wdGlvbnNbc3RhdGVdIDogZGF0YVtzdGF0ZV0pXG5cbiAgICAgIGlmIChzdGF0ZSA9PSAnbG9hZGluZ1RleHQnKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgICAkZWwuYWRkQ2xhc3MoZCkuYXR0cihkLCBkKS5wcm9wKGQsIHRydWUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgICAgJGVsLnJlbW92ZUNsYXNzKGQpLnJlbW92ZUF0dHIoZCkucHJvcChkLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9LCB0aGlzKSwgMClcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGFuZ2VkID0gdHJ1ZVxuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJylcblxuICAgIGlmICgkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgdmFyICRpbnB1dCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW5wdXQnKVxuICAgICAgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ3JhZGlvJykge1xuICAgICAgICBpZiAoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICRwYXJlbnQuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdjaGVja2JveCcpIHtcbiAgICAgICAgaWYgKCgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSAhPT0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgfVxuICAgICAgJGlucHV0LnByb3AoJ2NoZWNrZWQnLCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIGlmIChjaGFuZ2VkKSAkaW5wdXQudHJpZ2dlcignY2hhbmdlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLXByZXNzZWQnLCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQlVUVE9OIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5idXR0b24nKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicsIChkYXRhID0gbmV3IEJ1dHRvbih0aGlzLCBvcHRpb25zKSkpXG5cbiAgICAgIGlmIChvcHRpb24gPT0gJ3RvZ2dsZScpIGRhdGEudG9nZ2xlKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbikgZGF0YS5zZXRTdGF0ZShvcHRpb24pXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmJ1dHRvblxuXG4gICQuZm4uYnV0dG9uICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYnV0dG9uLkNvbnN0cnVjdG9yID0gQnV0dG9uXG5cblxuICAvLyBCVVRUT04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5idXR0b24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmJ1dHRvbiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEJVVFRPTiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICRidG4gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJylcbiAgICAgIFBsdWdpbi5jYWxsKCRidG4sICd0b2dnbGUnKVxuICAgICAgaWYgKCEoJChlLnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXSwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZG91YmxlIGNsaWNrIG9uIHJhZGlvcywgYW5kIHRoZSBkb3VibGUgc2VsZWN0aW9ucyAoc28gY2FuY2VsbGF0aW9uKSBvbiBjaGVja2JveGVzXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAvLyBUaGUgdGFyZ2V0IGNvbXBvbmVudCBzdGlsbCByZWNlaXZlIHRoZSBmb2N1c1xuICAgICAgICBpZiAoJGJ0bi5pcygnaW5wdXQsYnV0dG9uJykpICRidG4udHJpZ2dlcignZm9jdXMnKVxuICAgICAgICBlbHNlICRidG4uZmluZCgnaW5wdXQ6dmlzaWJsZSxidXR0b246dmlzaWJsZScpLmZpcnN0KCkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJykudG9nZ2xlQ2xhc3MoJ2ZvY3VzJywgL15mb2N1cyhpbik/JC8udGVzdChlLnR5cGUpKVxuICAgIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNhcm91c2VsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Nhcm91c2VsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ0FST1VTRUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGluZGljYXRvcnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5jYXJvdXNlbC1pbmRpY2F0b3JzJylcbiAgICB0aGlzLm9wdGlvbnMgICAgID0gb3B0aW9uc1xuICAgIHRoaXMucGF1c2VkICAgICAgPSBudWxsXG4gICAgdGhpcy5zbGlkaW5nICAgICA9IG51bGxcbiAgICB0aGlzLmludGVydmFsICAgID0gbnVsbFxuICAgIHRoaXMuJGFjdGl2ZSAgICAgPSBudWxsXG4gICAgdGhpcy4kaXRlbXMgICAgICA9IG51bGxcblxuICAgIHRoaXMub3B0aW9ucy5rZXlib2FyZCAmJiB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKVxuXG4gICAgdGhpcy5vcHRpb25zLnBhdXNlID09ICdob3ZlcicgJiYgISgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpICYmIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbignbW91c2VlbnRlci5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5wYXVzZSwgdGhpcykpXG4gICAgICAub24oJ21vdXNlbGVhdmUuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMuY3ljbGUsIHRoaXMpKVxuICB9XG5cbiAgQ2Fyb3VzZWwuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDYwMFxuXG4gIENhcm91c2VsLkRFRkFVTFRTID0ge1xuICAgIGludGVydmFsOiA1MDAwLFxuICAgIHBhdXNlOiAnaG92ZXInLFxuICAgIHdyYXA6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWVcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICBjYXNlIDM3OiB0aGlzLnByZXYoKTsgYnJlYWtcbiAgICAgIGNhc2UgMzk6IHRoaXMubmV4dCgpOyBicmVha1xuICAgICAgZGVmYXVsdDogcmV0dXJuXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuY3ljbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gZmFsc2UpXG5cbiAgICB0aGlzLmludGVydmFsICYmIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHRoaXMub3B0aW9ucy5pbnRlcnZhbFxuICAgICAgJiYgIXRoaXMucGF1c2VkXG4gICAgICAmJiAodGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCQucHJveHkodGhpcy5uZXh0LCB0aGlzKSwgdGhpcy5vcHRpb25zLmludGVydmFsKSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB0aGlzLiRpdGVtcyA9IGl0ZW0ucGFyZW50KCkuY2hpbGRyZW4oJy5pdGVtJylcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuaW5kZXgoaXRlbSB8fCB0aGlzLiRhY3RpdmUpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUZvckRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFjdGl2ZSkge1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGFjdGl2ZSlcbiAgICB2YXIgd2lsbFdyYXAgPSAoZGlyZWN0aW9uID09ICdwcmV2JyAmJiBhY3RpdmVJbmRleCA9PT0gMClcbiAgICAgICAgICAgICAgICB8fCAoZGlyZWN0aW9uID09ICduZXh0JyAmJiBhY3RpdmVJbmRleCA9PSAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkpXG4gICAgaWYgKHdpbGxXcmFwICYmICF0aGlzLm9wdGlvbnMud3JhcCkgcmV0dXJuIGFjdGl2ZVxuICAgIHZhciBkZWx0YSA9IGRpcmVjdGlvbiA9PSAncHJldicgPyAtMSA6IDFcbiAgICB2YXIgaXRlbUluZGV4ID0gKGFjdGl2ZUluZGV4ICsgZGVsdGEpICUgdGhpcy4kaXRlbXMubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmVxKGl0ZW1JbmRleClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgPSB0aGlzXG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgodGhpcy4kYWN0aXZlID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKSlcblxuICAgIGlmIChwb3MgPiAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkgfHwgcG9zIDwgMCkgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zbGlkaW5nKSAgICAgICByZXR1cm4gdGhpcy4kZWxlbWVudC5vbmUoJ3NsaWQuYnMuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoKSB7IHRoYXQudG8ocG9zKSB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKGFjdGl2ZUluZGV4ID09IHBvcykgcmV0dXJuIHRoaXMucGF1c2UoKS5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpcy5zbGlkZShwb3MgPiBhY3RpdmVJbmRleCA/ICduZXh0JyA6ICdwcmV2JywgdGhpcy4kaXRlbXMuZXEocG9zKSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSB0cnVlKVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCgnLm5leHQsIC5wcmV2JykubGVuZ3RoICYmICQuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKVxuICAgICAgdGhpcy5jeWNsZSh0cnVlKVxuICAgIH1cblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ25leHQnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ3ByZXYnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnNsaWRlID0gZnVuY3Rpb24gKHR5cGUsIG5leHQpIHtcbiAgICB2YXIgJGFjdGl2ZSAgID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKVxuICAgIHZhciAkbmV4dCAgICAgPSBuZXh0IHx8IHRoaXMuZ2V0SXRlbUZvckRpcmVjdGlvbih0eXBlLCAkYWN0aXZlKVxuICAgIHZhciBpc0N5Y2xpbmcgPSB0aGlzLmludGVydmFsXG4gICAgdmFyIGRpcmVjdGlvbiA9IHR5cGUgPT0gJ25leHQnID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIHZhciB0aGF0ICAgICAgPSB0aGlzXG5cbiAgICBpZiAoJG5leHQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm4gKHRoaXMuc2xpZGluZyA9IGZhbHNlKVxuXG4gICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSAkbmV4dFswXVxuICAgIHZhciBzbGlkZUV2ZW50ID0gJC5FdmVudCgnc2xpZGUuYnMuY2Fyb3VzZWwnLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25cbiAgICB9KVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkZUV2ZW50KVxuICAgIGlmIChzbGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuc2xpZGluZyA9IHRydWVcblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLnBhdXNlKClcblxuICAgIGlmICh0aGlzLiRpbmRpY2F0b3JzLmxlbmd0aCkge1xuICAgICAgdGhpcy4kaW5kaWNhdG9ycy5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB2YXIgJG5leHRJbmRpY2F0b3IgPSAkKHRoaXMuJGluZGljYXRvcnMuY2hpbGRyZW4oKVt0aGlzLmdldEl0ZW1JbmRleCgkbmV4dCldKVxuICAgICAgJG5leHRJbmRpY2F0b3IgJiYgJG5leHRJbmRpY2F0b3IuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgdmFyIHNsaWRFdmVudCA9ICQuRXZlbnQoJ3NsaWQuYnMuY2Fyb3VzZWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGRpcmVjdGlvbjogZGlyZWN0aW9uIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnc2xpZGUnKSkge1xuICAgICAgJG5leHQuYWRkQ2xhc3ModHlwZSlcbiAgICAgIGlmICh0eXBlb2YgJG5leHQgPT09ICdvYmplY3QnICYmICRuZXh0Lmxlbmd0aCkge1xuICAgICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cbiAgICAgICRhY3RpdmUuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKFsnYWN0aXZlJywgZGlyZWN0aW9uXS5qb2luKCcgJykpXG4gICAgICAgICAgdGhhdC5zbGlkaW5nID0gZmFsc2VcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgfSBlbHNlIHtcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkbmV4dC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgIH1cblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENhcm91c2VsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuICAgICAgdmFyIGFjdGlvbiAgPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJywgKGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ251bWJlcicpIGRhdGEudG8ob3B0aW9uKVxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5pbnRlcnZhbCkgZGF0YS5wYXVzZSgpLmN5Y2xlKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3IgPSBDYXJvdXNlbFxuXG5cbiAgLy8gQ0FST1VTRUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgICAgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICBpZiAoaHJlZikge1xuICAgICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0ICA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHwgaHJlZlxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG5cbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxuXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcbiAgICB2YXIgc2xpZGVJbmRleCA9ICR0aGlzLmF0dHIoJ2RhdGEtc2xpZGUtdG8nKVxuICAgIGlmIChzbGlkZUluZGV4KSBvcHRpb25zLmludGVydmFsID0gZmFsc2VcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbnMpXG5cbiAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgJHRhcmdldC5kYXRhKCdicy5jYXJvdXNlbCcpLnRvKHNsaWRlSW5kZXgpXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGVdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGUtdG9dJywgY2xpY2tIYW5kbGVyKVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkY2Fyb3VzZWwgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkY2Fyb3VzZWwsICRjYXJvdXNlbC5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY29sbGFwc2UuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY29sbGFwc2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIGpzaGludCBsYXRlZGVmOiBmYWxzZSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENPTExBUFNFIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENvbGxhcHNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuJHRyaWdnZXIgICAgICA9ICQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXScpXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gbnVsbFxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCwgdGhpcy4kdHJpZ2dlcilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkgdGhpcy50b2dnbGUoKVxuICB9XG5cbiAgQ29sbGFwc2UuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTiA9IDM1MFxuXG4gIENvbGxhcHNlLkRFRkFVTFRTID0ge1xuICAgIHRvZ2dsZTogdHJ1ZVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmRpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXG4gICAgcmV0dXJuIGhhc1dpZHRoID8gJ3dpZHRoJyA6ICdoZWlnaHQnXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIGFjdGl2ZXNEYXRhXG4gICAgdmFyIGFjdGl2ZXMgPSB0aGlzLiRwYXJlbnQgJiYgdGhpcy4kcGFyZW50LmNoaWxkcmVuKCcucGFuZWwnKS5jaGlsZHJlbignLmluLCAuY29sbGFwc2luZycpXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgYWN0aXZlc0RhdGEgPSBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBQbHVnaW4uY2FsbChhY3RpdmVzLCAnaGlkZScpXG4gICAgICBhY3RpdmVzRGF0YSB8fCBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJywgbnVsbClcbiAgICB9XG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVtkaW1lbnNpb25dKDApXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKVtkaW1lbnNpb25dKCcnKVxuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAudHJpZ2dlcignc2hvd24uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB2YXIgc2Nyb2xsU2l6ZSA9ICQuY2FtZWxDYXNlKFsnc2Nyb2xsJywgZGltZW5zaW9uXS5qb2luKCctJykpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbMF1bc2Nyb2xsU2l6ZV0pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8ICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0oKSlbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICBbZGltZW5zaW9uXSgwKVxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpID8gJ2hpZGUnIDogJ3Nob3cnXSgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5wYXJlbnQpXG4gICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInICsgdGhpcy5vcHRpb25zLnBhcmVudCArICdcIl0nKVxuICAgICAgLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGdldFRhcmdldEZyb21UcmlnZ2VyKCRlbGVtZW50KSwgJGVsZW1lbnQpXG4gICAgICB9LCB0aGlzKSlcbiAgICAgIC5lbmQoKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJHRyaWdnZXIpIHtcbiAgICB2YXIgaXNPcGVuID0gJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJylcblxuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gICAgJHRyaWdnZXJcbiAgICAgIC50b2dnbGVDbGFzcygnY29sbGFwc2VkJywgIWlzT3BlbilcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRyaWdnZXIpIHtcbiAgICB2YXIgaHJlZlxuICAgIHZhciB0YXJnZXQgPSAkdHJpZ2dlci5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgICB8fCAoaHJlZiA9ICR0cmlnZ2VyLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICB9XG5cblxuICAvLyBDT0xMQVBTRSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhICYmIG9wdGlvbnMudG9nZ2xlICYmIC9zaG93fGhpZGUvLnRlc3Qob3B0aW9uKSkgb3B0aW9ucy50b2dnbGUgPSBmYWxzZVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScsIChkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jb2xsYXBzZVxuXG4gICQuZm4uY29sbGFwc2UgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jb2xsYXBzZS5Db25zdHJ1Y3RvciA9IENvbGxhcHNlXG5cblxuICAvLyBDT0xMQVBTRSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY29sbGFwc2Uubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuXG4gICAgaWYgKCEkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIHZhciAkdGFyZ2V0ID0gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRoaXMpXG4gICAgdmFyIGRhdGEgICAgPSAkdGFyZ2V0LmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICB2YXIgb3B0aW9uICA9IGRhdGEgPyAndG9nZ2xlJyA6ICR0aGlzLmRhdGEoKVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBkcm9wZG93bi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNkcm9wZG93bnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEUk9QRE9XTiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgYmFja2Ryb3AgPSAnLmRyb3Bkb3duLWJhY2tkcm9wJ1xuICB2YXIgdG9nZ2xlICAgPSAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5vbignY2xpY2suYnMuZHJvcGRvd24nLCB0aGlzLnRvZ2dsZSlcbiAgfVxuXG4gIERyb3Bkb3duLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgLyNbQS1aYS16XS8udGVzdChzZWxlY3RvcikgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9IHNlbGVjdG9yICE9PSAnIycgPyAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKSA6IG51bGxcblxuICAgIHJldHVybiAkcGFyZW50ICYmICRwYXJlbnQubGVuZ3RoID8gJHBhcmVudCA6ICR0aGlzLnBhcmVudCgpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhck1lbnVzKGUpIHtcbiAgICBpZiAoZSAmJiBlLndoaWNoID09PSAzKSByZXR1cm5cbiAgICAkKGJhY2tkcm9wKS5yZW1vdmUoKVxuICAgICQodG9nZ2xlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgICAgICAgID0gJCh0aGlzKVxuICAgICAgdmFyICRwYXJlbnQgICAgICAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG5cbiAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnb3BlbicpKSByZXR1cm5cblxuICAgICAgaWYgKGUgJiYgZS50eXBlID09ICdjbGljaycgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSAmJiAkLmNvbnRhaW5zKCRwYXJlbnRbMF0sIGUudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnaGlkZS5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJC5FdmVudCgnaGlkZGVuLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfSlcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBjbGVhck1lbnVzKClcblxuICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgISRwYXJlbnQuY2xvc2VzdCgnLm5hdmJhci1uYXYnKS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgbW9iaWxlIHdlIHVzZSBhIGJhY2tkcm9wIGJlY2F1c2UgY2xpY2sgZXZlbnRzIGRvbid0IGRlbGVnYXRlXG4gICAgICAgICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1iYWNrZHJvcCcpXG4gICAgICAgICAgLmluc2VydEFmdGVyKCQodGhpcykpXG4gICAgICAgICAgLm9uKCdjbGljaycsIGNsZWFyTWVudXMpXG4gICAgICB9XG5cbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnc2hvdy5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzXG4gICAgICAgIC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxuXG4gICAgICAkcGFyZW50XG4gICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpXG4gICAgICAgIC50cmlnZ2VyKCQuRXZlbnQoJ3Nob3duLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCEvKDM4fDQwfDI3fDMyKS8udGVzdChlLndoaWNoKSB8fCAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cblxuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBpZiAoIWlzQWN0aXZlICYmIGUud2hpY2ggIT0gMjcgfHwgaXNBY3RpdmUgJiYgZS53aGljaCA9PSAyNykge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMjcpICRwYXJlbnQuZmluZCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VyKCdjbGljaycpXG4gICAgfVxuXG4gICAgdmFyIGRlc2MgPSAnIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYSdcbiAgICB2YXIgJGl0ZW1zID0gJHBhcmVudC5maW5kKCcuZHJvcGRvd24tbWVudScgKyBkZXNjKVxuXG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSByZXR1cm5cblxuICAgIHZhciBpbmRleCA9ICRpdGVtcy5pbmRleChlLnRhcmdldClcblxuICAgIGlmIChlLndoaWNoID09IDM4ICYmIGluZGV4ID4gMCkgICAgICAgICAgICAgICAgIGluZGV4LS0gICAgICAgICAvLyB1cFxuICAgIGlmIChlLndoaWNoID09IDQwICYmIGluZGV4IDwgJGl0ZW1zLmxlbmd0aCAtIDEpIGluZGV4KysgICAgICAgICAvLyBkb3duXG4gICAgaWYgKCF+aW5kZXgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwXG5cbiAgICAkaXRlbXMuZXEoaW5kZXgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgfVxuXG5cbiAgLy8gRFJPUERPV04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nLCAoZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmRyb3Bkb3duXG5cbiAgJC5mbi5kcm9wZG93biAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cblxuXG4gIC8vIERST1BET1dOIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5kcm9wZG93bi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uZHJvcGRvd24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBUFBMWSBUTyBTVEFOREFSRCBEUk9QRE9XTiBFTEVNRU5UU1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGNsZWFyTWVudXMpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24gZm9ybScsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCkgfSlcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93bi1tZW51JywgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IG1vZGFsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI21vZGFsc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIE1PREFMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRkaWFsb2cgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5tb2RhbC1kaWFsb2cnKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICAgIHRoaXMuaXNTaG93biA9IG51bGxcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IG51bGxcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gMFxuICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgdGhpcy5maXhlZENvbnRlbnQgPSAnLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tJ1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdGUpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLmZpbmQoJy5tb2RhbC1jb250ZW50JylcbiAgICAgICAgLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQuYnMubW9kYWwnKVxuICAgICAgICB9LCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzMDBcbiAgTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIE1vZGFsLkRFRkFVTFRTID0ge1xuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKHRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IHRydWVcblxuICAgIHRoaXMuY2hlY2tTY3JvbGxiYXIoKVxuICAgIHRoaXMuc2V0U2Nyb2xsYmFyKClcbiAgICB0aGlzLiRib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJylcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsICQucHJveHkodGhpcy5oaWRlLCB0aGlzKSlcblxuICAgIHRoaXMuJGRpYWxvZy5vbignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9uZSgnbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoYXQuJGVsZW1lbnQpKSB0aGF0Lmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhhdC4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpXG5cbiAgICAgIGlmICghdGhhdC4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGgpIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudC5hcHBlbmRUbyh0aGF0LiRib2R5KSAvLyBkb24ndCBtb3ZlIG1vZGFscyBkb20gcG9zaXRpb25cbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC5zY3JvbGxUb3AoMClcblxuICAgICAgdGhhdC5hZGp1c3REaWFsb2coKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICB0aGF0LiRlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50LmFkZENsYXNzKCdpbicpXG5cbiAgICAgIHRoYXQuZW5mb3JjZUZvY3VzKClcblxuICAgICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93bi5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgICAgdHJhbnNpdGlvbiA/XG4gICAgICAgIHRoYXQuJGRpYWxvZyAvLyB3YWl0IGZvciBtb2RhbCB0byBzbGlkZSBpblxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgZSA9ICQuRXZlbnQoJ2hpZGUuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoIXRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgJChkb2N1bWVudCkub2ZmKCdmb2N1c2luLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgLm9mZignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgICAub2ZmKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9mZignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eSh0aGlzLmhpZGVNb2RhbCwgdGhpcykpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICB0aGlzLmhpZGVNb2RhbCgpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZW5mb3JjZUZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICQoZG9jdW1lbnQpXG4gICAgICAub2ZmKCdmb2N1c2luLmJzLm1vZGFsJykgLy8gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBmb2N1cyBsb29wXG4gICAgICAub24oJ2ZvY3VzaW4uYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChkb2N1bWVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICB0aGlzLiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgICF0aGlzLiRlbGVtZW50LmhhcyhlLnRhcmdldCkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5rZXlib2FyZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLndoaWNoID09IDI3ICYmIHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93bikge1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYnMubW9kYWwnLCAkLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLCB0aGlzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHRoaXMuJGVsZW1lbnQuaGlkZSgpXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRib2R5LnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJylcbiAgICAgIHRoYXQucmVzZXRBZGp1c3RtZW50cygpXG4gICAgICB0aGF0LnJlc2V0U2Nyb2xsYmFyKClcbiAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuLmJzLm1vZGFsJylcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJhY2tkcm9wICYmIHRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYmFja2Ryb3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgYW5pbWF0ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/ICdmYWRlJyA6ICcnXG5cbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5iYWNrZHJvcCkge1xuICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcblxuICAgICAgdGhpcy4kYmFja2Ryb3AgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAuYWRkQ2xhc3MoJ21vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlKVxuICAgICAgICAuYXBwZW5kVG8odGhpcy4kYm9keSlcblxuICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaykge1xuICAgICAgICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVyblxuICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYydcbiAgICAgICAgICA/IHRoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKVxuICAgICAgICAgIDogdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuXG4gICAgICBpZiAoZG9BbmltYXRlKSB0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcblxuICAgICAgdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuXG5cbiAgICAgIGRvQW5pbWF0ZSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2spXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duICYmIHRoaXMuJGJhY2tkcm9wKSB7XG4gICAgICB0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgICB2YXIgY2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrUmVtb3ZlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrUmVtb3ZlKClcblxuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICAvLyB0aGVzZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgdXNlZCB0byBoYW5kbGUgb3ZlcmZsb3dpbmcgbW9kYWxzXG5cbiAgTW9kYWwucHJvdG90eXBlLmhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkanVzdERpYWxvZygpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYWRqdXN0RGlhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RhbElzT3ZlcmZsb3dpbmcgPSB0aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAhdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiBtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6IHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgIW1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRBZGp1c3RtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnVsbFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkgeyAvLyB3b3JrYXJvdW5kIGZvciBtaXNzaW5nIHdpbmRvdy5pbm5lcldpZHRoIGluIElFOFxuICAgICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpXG4gICAgfVxuICAgIHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpbmRvd1dpZHRoXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMubWVhc3VyZVNjcm9sbGJhcigpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib2R5UGFkID0gcGFyc2VJbnQoKHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCksIDEwKVxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgJydcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoXG4gICAgaWYgKHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgYm9keVBhZCArIHNjcm9sbGJhcldpZHRoKVxuICAgICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFjdHVhbFBhZGRpbmcgPSBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodFxuICAgICAgICB2YXIgY2FsY3VsYXRlZFBhZGRpbmcgPSAkKGVsZW1lbnQpLmNzcygncGFkZGluZy1yaWdodCcpXG4gICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAuZGF0YSgncGFkZGluZy1yaWdodCcsIGFjdHVhbFBhZGRpbmcpXG4gICAgICAgICAgLmNzcygncGFkZGluZy1yaWdodCcsIHBhcnNlRmxvYXQoY2FsY3VsYXRlZFBhZGRpbmcpICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCB0aGlzLm9yaWdpbmFsQm9keVBhZClcbiAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgdmFyIHBhZGRpbmcgPSAkKGVsZW1lbnQpLmRhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgJChlbGVtZW50KS5yZW1vdmVEYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA/IHBhZGRpbmcgOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHsgLy8gdGh4IHdhbHNoXG4gICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZSdcbiAgICB0aGlzLiRib2R5LmFwcGVuZChzY3JvbGxEaXYpXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoXG4gICAgdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpXG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoXG4gIH1cblxuXG4gIC8vIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbiwgX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnYnMubW9kYWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTW9kYWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMubW9kYWwnLCAoZGF0YSA9IG5ldyBNb2RhbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKF9yZWxhdGVkVGFyZ2V0KVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5zaG93KSBkYXRhLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLm1vZGFsXG5cbiAgJC5mbi5tb2RhbCA9IFBsdWdpblxuICAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yID0gTW9kYWxcblxuXG4gIC8vIE1PREFMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ubW9kYWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBNT0RBTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5tb2RhbC5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgIHZhciBocmVmID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgdmFyIHRhcmdldCA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHxcbiAgICAgIChocmVmICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICAgIHZhciBvcHRpb24gPSAkdGFyZ2V0LmRhdGEoJ2JzLm1vZGFsJykgPyAndG9nZ2xlJyA6ICQuZXh0ZW5kKHsgcmVtb3RlOiAhLyMvLnRlc3QoaHJlZikgJiYgaHJlZiB9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuXG4gICAgaWYgKCR0aGlzLmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgJHRhcmdldC5vbmUoJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoc2hvd0V2ZW50KSB7XG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm4gLy8gb25seSByZWdpc3RlciBmb2N1cyByZXN0b3JlciBpZiBtb2RhbCB3aWxsIGFjdHVhbGx5IGdldCBzaG93blxuICAgICAgJHRhcmdldC5vbmUoJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRoaXMuaXMoJzp2aXNpYmxlJykgJiYgJHRoaXMudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfSlcbiAgICB9KVxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbiwgdGhpcylcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdG9vbHRpcC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0b29sdGlwXG4gKiBJbnNwaXJlZCBieSB0aGUgb3JpZ2luYWwgalF1ZXJ5LnRpcHN5IGJ5IEphc29uIEZyYW1lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBESVNBTExPV0VEX0FUVFJJQlVURVMgPSBbJ3Nhbml0aXplJywgJ3doaXRlTGlzdCcsICdzYW5pdGl6ZUZuJ11cblxuICB2YXIgdXJpQXR0cnMgPSBbXG4gICAgJ2JhY2tncm91bmQnLFxuICAgICdjaXRlJyxcbiAgICAnaHJlZicsXG4gICAgJ2l0ZW10eXBlJyxcbiAgICAnbG9uZ2Rlc2MnLFxuICAgICdwb3N0ZXInLFxuICAgICdzcmMnLFxuICAgICd4bGluazpocmVmJ1xuICBdXG5cbiAgdmFyIEFSSUFfQVRUUklCVVRFX1BBVFRFUk4gPSAvXmFyaWEtW1xcdy1dKiQvaVxuXG4gIHZhciBEZWZhdWx0V2hpdGVsaXN0ID0ge1xuICAgIC8vIEdsb2JhbCBhdHRyaWJ1dGVzIGFsbG93ZWQgb24gYW55IHN1cHBsaWVkIGVsZW1lbnQgYmVsb3cuXG4gICAgJyonOiBbJ2NsYXNzJywgJ2RpcicsICdpZCcsICdsYW5nJywgJ3JvbGUnLCBBUklBX0FUVFJJQlVURV9QQVRURVJOXSxcbiAgICBhOiBbJ3RhcmdldCcsICdocmVmJywgJ3RpdGxlJywgJ3JlbCddLFxuICAgIGFyZWE6IFtdLFxuICAgIGI6IFtdLFxuICAgIGJyOiBbXSxcbiAgICBjb2w6IFtdLFxuICAgIGNvZGU6IFtdLFxuICAgIGRpdjogW10sXG4gICAgZW06IFtdLFxuICAgIGhyOiBbXSxcbiAgICBoMTogW10sXG4gICAgaDI6IFtdLFxuICAgIGgzOiBbXSxcbiAgICBoNDogW10sXG4gICAgaDU6IFtdLFxuICAgIGg2OiBbXSxcbiAgICBpOiBbXSxcbiAgICBpbWc6IFsnc3JjJywgJ2FsdCcsICd0aXRsZScsICd3aWR0aCcsICdoZWlnaHQnXSxcbiAgICBsaTogW10sXG4gICAgb2w6IFtdLFxuICAgIHA6IFtdLFxuICAgIHByZTogW10sXG4gICAgczogW10sXG4gICAgc21hbGw6IFtdLFxuICAgIHNwYW46IFtdLFxuICAgIHN1YjogW10sXG4gICAgc3VwOiBbXSxcbiAgICBzdHJvbmc6IFtdLFxuICAgIHU6IFtdLFxuICAgIHVsOiBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IHJlY29nbml6ZXMgYSBjb21tb25seSB1c2VmdWwgc3Vic2V0IG9mIFVSTHMgdGhhdCBhcmUgc2FmZS5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlKTp8W14mOi8/I10qKD86Wy8/I118JCkpL2dpXG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IG1hdGNoZXMgc2FmZSBkYXRhIFVSTHMuIE9ubHkgbWF0Y2hlcyBpbWFnZSwgdmlkZW8gYW5kIGF1ZGlvIHR5cGVzLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgREFUQV9VUkxfUEFUVEVSTiA9IC9eZGF0YTooPzppbWFnZVxcLyg/OmJtcHxnaWZ8anBlZ3xqcGd8cG5nfHRpZmZ8d2VicCl8dmlkZW9cXC8oPzptcGVnfG1wNHxvZ2d8d2VibSl8YXVkaW9cXC8oPzptcDN8b2dhfG9nZ3xvcHVzKSk7YmFzZTY0LFthLXowLTkrL10rPSokL2lcblxuICBmdW5jdGlvbiBhbGxvd2VkQXR0cmlidXRlKGF0dHIsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSB7XG4gICAgdmFyIGF0dHJOYW1lID0gYXR0ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkgIT09IC0xKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCB1cmlBdHRycykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKGF0dHIubm9kZVZhbHVlLm1hdGNoKFNBRkVfVVJMX1BBVFRFUk4pIHx8IGF0dHIubm9kZVZhbHVlLm1hdGNoKERBVEFfVVJMX1BBVFRFUk4pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHZhciByZWdFeHAgPSAkKGFsbG93ZWRBdHRyaWJ1dGVMaXN0KS5maWx0ZXIoZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgfSlcblxuICAgIC8vIENoZWNrIGlmIGEgcmVndWxhciBleHByZXNzaW9uIHZhbGlkYXRlcyB0aGUgYXR0cmlidXRlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVnRXhwLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGF0dHJOYW1lLm1hdGNoKHJlZ0V4cFtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB3aGl0ZUxpc3QsIHNhbml0aXplRm4pIHtcbiAgICBpZiAodW5zYWZlSHRtbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgaWYgKHNhbml0aXplRm4gJiYgdHlwZW9mIHNhbml0aXplRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBzYW5pdGl6ZUZuKHVuc2FmZUh0bWwpXG4gICAgfVxuXG4gICAgLy8gSUUgOCBhbmQgYmVsb3cgZG9uJ3Qgc3VwcG9ydCBjcmVhdGVIVE1MRG9jdW1lbnRcbiAgICBpZiAoIWRvY3VtZW50LmltcGxlbWVudGF0aW9uIHx8ICFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgdmFyIGNyZWF0ZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnc2FuaXRpemF0aW9uJylcbiAgICBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB1bnNhZmVIdG1sXG5cbiAgICB2YXIgd2hpdGVsaXN0S2V5cyA9ICQubWFwKHdoaXRlTGlzdCwgZnVuY3Rpb24gKGVsLCBpKSB7IHJldHVybiBpIH0pXG4gICAgdmFyIGVsZW1lbnRzID0gJChjcmVhdGVkRG9jdW1lbnQuYm9keSkuZmluZCgnKicpXG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2ldXG4gICAgICB2YXIgZWxOYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICBpZiAoJC5pbkFycmF5KGVsTmFtZSwgd2hpdGVsaXN0S2V5cykgPT09IC0xKSB7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHJpYnV0ZUxpc3QgPSAkLm1hcChlbC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIGVsIH0pXG4gICAgICB2YXIgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KHdoaXRlTGlzdFsnKiddIHx8IFtdLCB3aGl0ZUxpc3RbZWxOYW1lXSB8fCBbXSlcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbjIgPSBhdHRyaWJ1dGVMaXN0Lmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xuICAgICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXSwgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLm5vZGVOYW1lKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTFxuICB9XG5cbiAgLy8gVE9PTFRJUCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMudHlwZSAgICAgICA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgICAgPSBudWxsXG4gICAgdGhpcy5lbmFibGVkICAgID0gbnVsbFxuICAgIHRoaXMudGltZW91dCAgICA9IG51bGxcbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG4gICAgdGhpcy4kZWxlbWVudCAgID0gbnVsbFxuICAgIHRoaXMuaW5TdGF0ZSAgICA9IG51bGxcblxuICAgIHRoaXMuaW5pdCgndG9vbHRpcCcsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBUb29sdGlwLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRvb2x0aXAuREVGQVVMVFMgPSB7XG4gICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLFxuICAgIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXG4gICAgdGl0bGU6ICcnLFxuICAgIGRlbGF5OiAwLFxuICAgIGh0bWw6IGZhbHNlLFxuICAgIGNvbnRhaW5lcjogZmFsc2UsXG4gICAgdmlld3BvcnQ6IHtcbiAgICAgIHNlbGVjdG9yOiAnYm9keScsXG4gICAgICBwYWRkaW5nOiAwXG4gICAgfSxcbiAgICBzYW5pdGl6ZSA6IHRydWUsXG4gICAgc2FuaXRpemVGbiA6IG51bGwsXG4gICAgd2hpdGVMaXN0IDogRGVmYXVsdFdoaXRlbGlzdFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbmFibGVkICAgPSB0cnVlXG4gICAgdGhpcy50eXBlICAgICAgPSB0eXBlXG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSB0aGlzLmdldE9wdGlvbnMob3B0aW9ucylcbiAgICB0aGlzLiR2aWV3cG9ydCA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiAkKGRvY3VtZW50KS5maW5kKCQuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMudmlld3BvcnQpID8gdGhpcy5vcHRpb25zLnZpZXdwb3J0LmNhbGwodGhpcywgdGhpcy4kZWxlbWVudCkgOiAodGhpcy5vcHRpb25zLnZpZXdwb3J0LnNlbGVjdG9yIHx8IHRoaXMub3B0aW9ucy52aWV3cG9ydCkpXG4gICAgdGhpcy5pblN0YXRlICAgPSB7IGNsaWNrOiBmYWxzZSwgaG92ZXI6IGZhbHNlLCBmb2N1czogZmFsc2UgfVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0gaW5zdGFuY2VvZiBkb2N1bWVudC5jb25zdHJ1Y3RvciAmJiAhdGhpcy5vcHRpb25zLnNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BzZWxlY3RvcmAgb3B0aW9uIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nICcgKyB0aGlzLnR5cGUgKyAnIG9uIHRoZSB3aW5kb3cuZG9jdW1lbnQgb2JqZWN0IScpXG4gICAgfVxuXG4gICAgdmFyIHRyaWdnZXJzID0gdGhpcy5vcHRpb25zLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgZm9yICh2YXIgaSA9IHRyaWdnZXJzLmxlbmd0aDsgaS0tOykge1xuICAgICAgdmFyIHRyaWdnZXIgPSB0cmlnZ2Vyc1tpXVxuXG4gICAgICBpZiAodHJpZ2dlciA9PSAnY2xpY2snKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLnRvZ2dsZSwgdGhpcykpXG4gICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT0gJ21hbnVhbCcpIHtcbiAgICAgICAgdmFyIGV2ZW50SW4gID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlZW50ZXInIDogJ2ZvY3VzaW4nXG4gICAgICAgIHZhciBldmVudE91dCA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWxlYXZlJyA6ICdmb2N1c291dCdcblxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50SW4gICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5lbnRlciwgdGhpcykpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRPdXQgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmxlYXZlLCB0aGlzKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMuc2VsZWN0b3IgP1xuICAgICAgKHRoaXMuX29wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7IHRyaWdnZXI6ICdtYW51YWwnLCBzZWxlY3RvcjogJycgfSkpIDpcbiAgICAgIHRoaXMuZml4VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFRvb2x0aXAuREVGQVVMVFNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBkYXRhQXR0cmlidXRlcyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgpXG5cbiAgICBmb3IgKHZhciBkYXRhQXR0ciBpbiBkYXRhQXR0cmlidXRlcykge1xuICAgICAgaWYgKGRhdGFBdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGRhdGFBdHRyKSAmJiAkLmluQXJyYXkoZGF0YUF0dHIsIERJU0FMTE9XRURfQVRUUklCVVRFUykgIT09IC0xKSB7XG4gICAgICAgIGRlbGV0ZSBkYXRhQXR0cmlidXRlc1tkYXRhQXR0cl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgZGF0YUF0dHJpYnV0ZXMsIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNhbml0aXplKSB7XG4gICAgICBvcHRpb25zLnRlbXBsYXRlID0gc2FuaXRpemVIdG1sKG9wdGlvbnMudGVtcGxhdGUsIG9wdGlvbnMud2hpdGVMaXN0LCBvcHRpb25zLnNhbml0aXplRm4pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlbGVnYXRlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyAgPSB7fVxuICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdHMoKVxuXG4gICAgdGhpcy5fb3B0aW9ucyAmJiAkLmVhY2godGhpcy5fb3B0aW9ucywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmIChkZWZhdWx0c1trZXldICE9IHZhbHVlKSBvcHRpb25zW2tleV0gPSB2YWx1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW50ZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNpbicgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgfHwgc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHtcbiAgICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpIHJldHVybiBzZWxmLnNob3coKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHNlbGYuc2hvdygpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pc0luU3RhdGVUcnVlID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmluU3RhdGUpIHtcbiAgICAgIGlmICh0aGlzLmluU3RhdGVba2V5XSkgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmxlYXZlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3Vzb3V0JyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSByZXR1cm5cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnb3V0J1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5oaWRlKSByZXR1cm4gc2VsZi5oaWRlKClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnb3V0Jykgc2VsZi5oaWRlKClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAodGhpcy5oYXNDb250ZW50KCkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgdmFyIGluRG9tID0gJC5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB0aGlzLiRlbGVtZW50WzBdKVxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgIWluRG9tKSByZXR1cm5cbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICB2YXIgJHRpcCA9IHRoaXMudGlwKClcblxuICAgICAgdmFyIHRpcElkID0gdGhpcy5nZXRVSUQodGhpcy50eXBlKVxuXG4gICAgICB0aGlzLnNldENvbnRlbnQoKVxuICAgICAgJHRpcC5hdHRyKCdpZCcsIHRpcElkKVxuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGlwSWQpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSAkdGlwLmFkZENsYXNzKCdmYWRlJylcblxuICAgICAgdmFyIHBsYWNlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcywgJHRpcFswXSwgdGhpcy4kZWxlbWVudFswXSkgOlxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50XG5cbiAgICAgIHZhciBhdXRvVG9rZW4gPSAvXFxzP2F1dG8/XFxzPy9pXG4gICAgICB2YXIgYXV0b1BsYWNlID0gYXV0b1Rva2VuLnRlc3QocGxhY2VtZW50KVxuICAgICAgaWYgKGF1dG9QbGFjZSkgcGxhY2VtZW50ID0gcGxhY2VtZW50LnJlcGxhY2UoYXV0b1Rva2VuLCAnJykgfHwgJ3RvcCdcblxuICAgICAgJHRpcFxuICAgICAgICAuZGV0YWNoKClcbiAgICAgICAgLmNzcyh7IHRvcDogMCwgbGVmdDogMCwgZGlzcGxheTogJ2Jsb2NrJyB9KVxuICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgICAuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgdGhpcylcblxuICAgICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lciA/ICR0aXAuYXBwZW5kVG8oJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSkgOiAkdGlwLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2luc2VydGVkLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICAgIHZhciBwb3MgICAgICAgICAgPSB0aGlzLmdldFBvc2l0aW9uKClcbiAgICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgICAgaWYgKGF1dG9QbGFjZSkge1xuICAgICAgICB2YXIgb3JnUGxhY2VtZW50ID0gcGxhY2VtZW50XG4gICAgICAgIHZhciB2aWV3cG9ydERpbSA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICAgICAgcGxhY2VtZW50ID0gcGxhY2VtZW50ID09ICdib3R0b20nICYmIHBvcy5ib3R0b20gKyBhY3R1YWxIZWlnaHQgPiB2aWV3cG9ydERpbS5ib3R0b20gPyAndG9wJyAgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICAmJiBwb3MudG9wICAgIC0gYWN0dWFsSGVpZ2h0IDwgdmlld3BvcnREaW0udG9wICAgID8gJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAgJiYgcG9zLnJpZ2h0ICArIGFjdHVhbFdpZHRoICA+IHZpZXdwb3J0RGltLndpZHRoICA/ICdsZWZ0JyAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgICYmIHBvcy5sZWZ0ICAgLSBhY3R1YWxXaWR0aCAgPCB2aWV3cG9ydERpbS5sZWZ0ICAgPyAncmlnaHQnICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFxuXG4gICAgICAgICR0aXBcbiAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3JnUGxhY2VtZW50KVxuICAgICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxjdWxhdGVkT2Zmc2V0ID0gdGhpcy5nZXRDYWxjdWxhdGVkT2Zmc2V0KHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgICB0aGlzLmFwcGx5UGxhY2VtZW50KGNhbGN1bGF0ZWRPZmZzZXQsIHBsYWNlbWVudClcblxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJldkhvdmVyU3RhdGUgPSB0aGF0LmhvdmVyU3RhdGVcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdzaG93bi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgICB0aGF0LmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICAgICAgaWYgKHByZXZIb3ZlclN0YXRlID09ICdvdXQnKSB0aGF0LmxlYXZlKHRoYXQpXG4gICAgICB9XG5cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY29tcGxldGUoKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFwcGx5UGxhY2VtZW50ID0gZnVuY3Rpb24gKG9mZnNldCwgcGxhY2VtZW50KSB7XG4gICAgdmFyICR0aXAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgd2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBoZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgLy8gbWFudWFsbHkgcmVhZCBtYXJnaW5zIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGluY2x1ZGVzIGRpZmZlcmVuY2VcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi10b3AnKSwgMTApXG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApXG5cbiAgICAvLyB3ZSBtdXN0IGNoZWNrIGZvciBOYU4gZm9yIGllIDgvOVxuICAgIGlmIChpc05hTihtYXJnaW5Ub3ApKSAgbWFyZ2luVG9wICA9IDBcbiAgICBpZiAoaXNOYU4obWFyZ2luTGVmdCkpIG1hcmdpbkxlZnQgPSAwXG5cbiAgICBvZmZzZXQudG9wICArPSBtYXJnaW5Ub3BcbiAgICBvZmZzZXQubGVmdCArPSBtYXJnaW5MZWZ0XG5cbiAgICAvLyAkLmZuLm9mZnNldCBkb2Vzbid0IHJvdW5kIHBpeGVsIHZhbHVlc1xuICAgIC8vIHNvIHdlIHVzZSBzZXRPZmZzZXQgZGlyZWN0bHkgd2l0aCBvdXIgb3duIGZ1bmN0aW9uIEItMFxuICAgICQub2Zmc2V0LnNldE9mZnNldCgkdGlwWzBdLCAkLmV4dGVuZCh7XG4gICAgICB1c2luZzogZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICR0aXAuY3NzKHtcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQocHJvcHMudG9wKSxcbiAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKHByb3BzLmxlZnQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgb2Zmc2V0KSwgMClcblxuICAgICR0aXAuYWRkQ2xhc3MoJ2luJylcblxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBwbGFjaW5nIHRpcCBpbiBuZXcgb2Zmc2V0IGNhdXNlZCB0aGUgdGlwIHRvIHJlc2l6ZSBpdHNlbGZcbiAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgaWYgKHBsYWNlbWVudCA9PSAndG9wJyAmJiBhY3R1YWxIZWlnaHQgIT0gaGVpZ2h0KSB7XG4gICAgICBvZmZzZXQudG9wID0gb2Zmc2V0LnRvcCArIGhlaWdodCAtIGFjdHVhbEhlaWdodFxuICAgIH1cblxuICAgIHZhciBkZWx0YSA9IHRoaXMuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhKHBsYWNlbWVudCwgb2Zmc2V0LCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgaWYgKGRlbHRhLmxlZnQpIG9mZnNldC5sZWZ0ICs9IGRlbHRhLmxlZnRcbiAgICBlbHNlIG9mZnNldC50b3AgKz0gZGVsdGEudG9wXG5cbiAgICB2YXIgaXNWZXJ0aWNhbCAgICAgICAgICA9IC90b3B8Ym90dG9tLy50ZXN0KHBsYWNlbWVudClcbiAgICB2YXIgYXJyb3dEZWx0YSAgICAgICAgICA9IGlzVmVydGljYWwgPyBkZWx0YS5sZWZ0ICogMiAtIHdpZHRoICsgYWN0dWFsV2lkdGggOiBkZWx0YS50b3AgKiAyIC0gaGVpZ2h0ICsgYWN0dWFsSGVpZ2h0XG4gICAgdmFyIGFycm93T2Zmc2V0UG9zaXRpb24gPSBpc1ZlcnRpY2FsID8gJ29mZnNldFdpZHRoJyA6ICdvZmZzZXRIZWlnaHQnXG5cbiAgICAkdGlwLm9mZnNldChvZmZzZXQpXG4gICAgdGhpcy5yZXBsYWNlQXJyb3coYXJyb3dEZWx0YSwgJHRpcFswXVthcnJvd09mZnNldFBvc2l0aW9uXSwgaXNWZXJ0aWNhbClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnJlcGxhY2VBcnJvdyA9IGZ1bmN0aW9uIChkZWx0YSwgZGltZW5zaW9uLCBpc1ZlcnRpY2FsKSB7XG4gICAgdGhpcy5hcnJvdygpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJywgNTAgKiAoMSAtIGRlbHRhIC8gZGltZW5zaW9uKSArICclJylcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnLCAnJylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gc2FuaXRpemVIdG1sKHRpdGxlLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLmh0bWwodGl0bGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS50ZXh0KHRpdGxlKVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0JylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgJHRpcCA9ICQodGhpcy4kdGlwKVxuICAgIHZhciBlICAgID0gJC5FdmVudCgnaGlkZS5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICBpZiAodGhhdC5ob3ZlclN0YXRlICE9ICdpbicpICR0aXAuZGV0YWNoKClcbiAgICAgIGlmICh0aGF0LiRlbGVtZW50KSB7IC8vIFRPRE86IENoZWNrIHdoZXRoZXIgZ3VhcmRpbmcgdGhpcyBjb2RlIHdpdGggdGhpcyBgaWZgIGlzIHJlYWxseSBuZWNlc3NhcnkuXG4gICAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpXG4gICAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgfVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICR0aXBcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIGNvbXBsZXRlKClcblxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5maXhUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgaWYgKCRlLmF0dHIoJ3RpdGxlJykgfHwgdHlwZW9mICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSAhPSAnc3RyaW5nJykge1xuICAgICAgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScsICRlLmF0dHIoJ3RpdGxlJykgfHwgJycpLmF0dHIoJ3RpdGxlJywgJycpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgICRlbGVtZW50ICAgPSAkZWxlbWVudCB8fCB0aGlzLiRlbGVtZW50XG5cbiAgICB2YXIgZWwgICAgID0gJGVsZW1lbnRbMF1cbiAgICB2YXIgaXNCb2R5ID0gZWwudGFnTmFtZSA9PSAnQk9EWSdcblxuICAgIHZhciBlbFJlY3QgICAgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmIChlbFJlY3Qud2lkdGggPT0gbnVsbCkge1xuICAgICAgLy8gd2lkdGggYW5kIGhlaWdodCBhcmUgbWlzc2luZyBpbiBJRTgsIHNvIGNvbXB1dGUgdGhlbSBtYW51YWxseTsgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMTQwOTNcbiAgICAgIGVsUmVjdCA9ICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHsgd2lkdGg6IGVsUmVjdC5yaWdodCAtIGVsUmVjdC5sZWZ0LCBoZWlnaHQ6IGVsUmVjdC5ib3R0b20gLSBlbFJlY3QudG9wIH0pXG4gICAgfVxuICAgIHZhciBpc1N2ZyA9IHdpbmRvdy5TVkdFbGVtZW50ICYmIGVsIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnRcbiAgICAvLyBBdm9pZCB1c2luZyAkLm9mZnNldCgpIG9uIFNWR3Mgc2luY2UgaXQgZ2l2ZXMgaW5jb3JyZWN0IHJlc3VsdHMgaW4galF1ZXJ5IDMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMjAyODBcbiAgICB2YXIgZWxPZmZzZXQgID0gaXNCb2R5ID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IChpc1N2ZyA/IG51bGwgOiAkZWxlbWVudC5vZmZzZXQoKSlcbiAgICB2YXIgc2Nyb2xsICAgID0geyBzY3JvbGw6IGlzQm9keSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgOiAkZWxlbWVudC5zY3JvbGxUb3AoKSB9XG4gICAgdmFyIG91dGVyRGltcyA9IGlzQm9keSA/IHsgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSB9IDogbnVsbFxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHNjcm9sbCwgb3V0ZXJEaW1zLCBlbE9mZnNldClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICByZXR1cm4gcGxhY2VtZW50ID09ICdib3R0b20nID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0LCAgIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgID8geyB0b3A6IHBvcy50b3AgLSBhY3R1YWxIZWlnaHQsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0IC0gYWN0dWFsV2lkdGggfSA6XG4gICAgICAgIC8qIHBsYWNlbWVudCA9PSAncmlnaHQnICovIHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCB9XG5cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YSA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHZhciBkZWx0YSA9IHsgdG9wOiAwLCBsZWZ0OiAwIH1cbiAgICBpZiAoIXRoaXMuJHZpZXdwb3J0KSByZXR1cm4gZGVsdGFcblxuICAgIHZhciB2aWV3cG9ydFBhZGRpbmcgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgdGhpcy5vcHRpb25zLnZpZXdwb3J0LnBhZGRpbmcgfHwgMFxuICAgIHZhciB2aWV3cG9ydERpbWVuc2lvbnMgPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgaWYgKC9yaWdodHxsZWZ0Ly50ZXN0KHBsYWNlbWVudCkpIHtcbiAgICAgIHZhciB0b3BFZGdlT2Zmc2V0ICAgID0gcG9zLnRvcCAtIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGxcbiAgICAgIHZhciBib3R0b21FZGdlT2Zmc2V0ID0gcG9zLnRvcCArIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGwgKyBhY3R1YWxIZWlnaHRcbiAgICAgIGlmICh0b3BFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLnRvcCkgeyAvLyB0b3Agb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCAtIHRvcEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAoYm90dG9tRWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0KSB7IC8vIGJvdHRvbSBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCAtIGJvdHRvbUVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxlZnRFZGdlT2Zmc2V0ICA9IHBvcy5sZWZ0IC0gdmlld3BvcnRQYWRkaW5nXG4gICAgICB2YXIgcmlnaHRFZGdlT2Zmc2V0ID0gcG9zLmxlZnQgKyB2aWV3cG9ydFBhZGRpbmcgKyBhY3R1YWxXaWR0aFxuICAgICAgaWYgKGxlZnRFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLmxlZnQpIHsgLy8gbGVmdCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgLSBsZWZ0RWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChyaWdodEVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMucmlnaHQpIHsgLy8gcmlnaHQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0ICsgdmlld3BvcnREaW1lbnNpb25zLndpZHRoIC0gcmlnaHRFZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbHRhXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGl0bGVcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICB0aXRsZSA9ICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKVxuICAgICAgfHwgKHR5cGVvZiBvLnRpdGxlID09ICdmdW5jdGlvbicgPyBvLnRpdGxlLmNhbGwoJGVbMF0pIDogIG8udGl0bGUpXG5cbiAgICByZXR1cm4gdGl0bGVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFVJRCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICBkbyBwcmVmaXggKz0gfn4oTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApXG4gICAgd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG4gICAgcmV0dXJuIHByZWZpeFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kdGlwKSB7XG4gICAgICB0aGlzLiR0aXAgPSAkKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSlcbiAgICAgIGlmICh0aGlzLiR0aXAubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZSArICcgYHRlbXBsYXRlYCBvcHRpb24gbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgMSB0b3AtbGV2ZWwgZWxlbWVudCEnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4kdGlwXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcudG9vbHRpcC1hcnJvdycpKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gIXRoaXMuZW5hYmxlZFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAoZSkge1xuICAgICAgc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuICAgICAgaWYgKCFzZWxmKSB7XG4gICAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlKSB7XG4gICAgICBzZWxmLmluU3RhdGUuY2xpY2sgPSAhc2VsZi5pblN0YXRlLmNsaWNrXG4gICAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHNlbGYuZW50ZXIoc2VsZilcbiAgICAgIGVsc2Ugc2VsZi5sZWF2ZShzZWxmKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpID8gc2VsZi5sZWF2ZShzZWxmKSA6IHNlbGYuZW50ZXIoc2VsZilcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgdGhpcy5oaWRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub2ZmKCcuJyArIHRoYXQudHlwZSkucmVtb3ZlRGF0YSgnYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIGlmICh0aGF0LiR0aXApIHtcbiAgICAgICAgdGhhdC4kdGlwLmRldGFjaCgpXG4gICAgICB9XG4gICAgICB0aGF0LiR0aXAgPSBudWxsXG4gICAgICB0aGF0LiRhcnJvdyA9IG51bGxcbiAgICAgIHRoYXQuJHZpZXdwb3J0ID0gbnVsbFxuICAgICAgdGhhdC4kZWxlbWVudCA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2FuaXRpemVIdG1sID0gZnVuY3Rpb24gKHVuc2FmZUh0bWwpIHtcbiAgICByZXR1cm4gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICB9XG5cbiAgLy8gVE9PTFRJUCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcsIChkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRvb2x0aXBcblxuICAkLmZuLnRvb2x0aXAgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxuXG5cbiAgLy8gVE9PTFRJUCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50b29sdGlwID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBwb3BvdmVyLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3BvcG92ZXJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gUE9QT1ZFUiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFBvcG92ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdCgncG9wb3ZlcicsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBpZiAoISQuZm4udG9vbHRpcCkgdGhyb3cgbmV3IEVycm9yKCdQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanMnKVxuXG4gIFBvcG92ZXIuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgUG9wb3Zlci5ERUZBVUxUUyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMsIHtcbiAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgdHJpZ2dlcjogJ2NsaWNrJyxcbiAgICBjb250ZW50OiAnJyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J1xuICB9KVxuXG5cbiAgLy8gTk9URTogUE9QT1ZFUiBFWFRFTkRTIHRvb2x0aXAuanNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBQb3BvdmVyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IucHJvdG90eXBlKVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQb3BvdmVyLkRFRkFVTFRTXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSAgID0gdGhpcy5nZXRUaXRsZSgpXG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICB2YXIgdHlwZUNvbnRlbnQgPSB0eXBlb2YgY29udGVudFxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gdGhpcy5zYW5pdGl6ZUh0bWwodGl0bGUpXG5cbiAgICAgICAgaWYgKHR5cGVDb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLnNhbml0aXplSHRtbChjb250ZW50KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKVtcbiAgICAgICAgdHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnID8gJ2h0bWwnIDogJ2FwcGVuZCdcbiAgICAgIF0oY29udGVudClcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLnRleHQodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpLnRleHQoY29udGVudClcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIHRvcCBib3R0b20gbGVmdCByaWdodCBpbicpXG5cbiAgICAvLyBJRTggZG9lc24ndCBhY2NlcHQgaGlkaW5nIHZpYSB0aGUgYDplbXB0eWAgcHNldWRvIHNlbGVjdG9yLCB3ZSBoYXZlIHRvIGRvXG4gICAgLy8gdGhpcyBtYW51YWxseSBieSBjaGVja2luZyB0aGUgY29udGVudHMuXG4gICAgaWYgKCEkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCgpKSAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaGlkZSgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5nZXRDb250ZW50KClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgcmV0dXJuICRlLmF0dHIoJ2RhdGEtY29udGVudCcpXG4gICAgICB8fCAodHlwZW9mIG8uY29udGVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgby5jb250ZW50LmNhbGwoJGVbMF0pIDpcbiAgICAgICAgby5jb250ZW50KVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXG4gIH1cblxuXG4gIC8vIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInLCAoZGF0YSA9IG5ldyBQb3BvdmVyKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5wb3BvdmVyXG5cbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuXG4gIC8vIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ucG9wb3Zlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ucG9wb3ZlciA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogc2Nyb2xsc3B5LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Njcm9sbHNweVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFNDUk9MTFNQWSBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gU2Nyb2xsU3B5KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRib2R5ICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQgPSAkKGVsZW1lbnQpLmlzKGRvY3VtZW50LmJvZHkpID8gJCh3aW5kb3cpIDogJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICAgPSAkLmV4dGVuZCh7fSwgU2Nyb2xsU3B5LkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuc2VsZWN0b3IgICAgICAgPSAodGhpcy5vcHRpb25zLnRhcmdldCB8fCAnJykgKyAnIC5uYXYgbGkgPiBhJ1xuICAgIHRoaXMub2Zmc2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ICAgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgICA9IDBcblxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQub24oJ3Njcm9sbC5icy5zY3JvbGxzcHknLCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgICB0aGlzLnByb2Nlc3MoKVxuICB9XG5cbiAgU2Nyb2xsU3B5LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFNjcm9sbFNweS5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDEwXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgICAgICAgICAgPSB0aGlzXG4gICAgdmFyIG9mZnNldE1ldGhvZCAgPSAnb2Zmc2V0J1xuICAgIHZhciBvZmZzZXRCYXNlICAgID0gMFxuXG4gICAgdGhpcy5vZmZzZXRzICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgID0gW11cbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgIGlmICghJC5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKSkge1xuICAgICAgb2Zmc2V0TWV0aG9kID0gJ3Bvc2l0aW9uJ1xuICAgICAgb2Zmc2V0QmFzZSAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKVxuICAgIH1cblxuICAgIHRoaXMuJGJvZHlcbiAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXG4gICAgICAubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCAgID0gJCh0aGlzKVxuICAgICAgICB2YXIgaHJlZiAgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxuICAgICAgICB2YXIgJGhyZWYgPSAvXiMuLy50ZXN0KGhyZWYpICYmICQoaHJlZilcblxuICAgICAgICByZXR1cm4gKCRocmVmXG4gICAgICAgICAgJiYgJGhyZWYubGVuZ3RoXG4gICAgICAgICAgJiYgJGhyZWYuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICAmJiBbWyRocmVmW29mZnNldE1ldGhvZF0oKS50b3AgKyBvZmZzZXRCYXNlLCBocmVmXV0pIHx8IG51bGxcbiAgICAgIH0pXG4gICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF0gfSlcbiAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5vZmZzZXRzLnB1c2godGhpc1swXSlcbiAgICAgICAgdGhhdC50YXJnZXRzLnB1c2godGhpc1sxXSlcbiAgICAgIH0pXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcbiAgICB2YXIgbWF4U2Nyb2xsICAgID0gdGhpcy5vcHRpb25zLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0cyAgICAgID0gdGhpcy5vZmZzZXRzXG4gICAgdmFyIHRhcmdldHMgICAgICA9IHRoaXMudGFyZ2V0c1xuICAgIHZhciBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFxuICAgIHZhciBpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb3AgPj0gbWF4U2Nyb2xsKSB7XG4gICAgICByZXR1cm4gYWN0aXZlVGFyZ2V0ICE9IChpID0gdGFyZ2V0c1t0YXJnZXRzLmxlbmd0aCAtIDFdKSAmJiB0aGlzLmFjdGl2YXRlKGkpXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCBvZmZzZXRzWzBdKSB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKClcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBvZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgYWN0aXZlVGFyZ2V0ICE9IHRhcmdldHNbaV1cbiAgICAgICAgJiYgc2Nyb2xsVG9wID49IG9mZnNldHNbaV1cbiAgICAgICAgJiYgKG9mZnNldHNbaSArIDFdID09PSB1bmRlZmluZWQgfHwgc2Nyb2xsVG9wIDwgb2Zmc2V0c1tpICsgMV0pXG4gICAgICAgICYmIHRoaXMuYWN0aXZhdGUodGFyZ2V0c1tpXSlcbiAgICB9XG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICB0aGlzLmNsZWFyKClcblxuICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgK1xuICAgICAgJ1tkYXRhLXRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCJdLCcgK1xuICAgICAgdGhpcy5zZWxlY3RvciArICdbaHJlZj1cIicgKyB0YXJnZXQgKyAnXCJdJ1xuXG4gICAgdmFyIGFjdGl2ZSA9ICQoc2VsZWN0b3IpXG4gICAgICAucGFyZW50cygnbGknKVxuICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgaWYgKGFjdGl2ZS5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICBhY3RpdmUgPSBhY3RpdmVcbiAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGFjdGl2ZS50cmlnZ2VyKCdhY3RpdmF0ZS5icy5zY3JvbGxzcHknKVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMuc2VsZWN0b3IpXG4gICAgICAucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsICcuYWN0aXZlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScsIChkYXRhID0gbmV3IFNjcm9sbFNweSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uc2Nyb2xsc3B5XG5cbiAgJC5mbi5zY3JvbGxzcHkgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3IgPSBTY3JvbGxTcHlcblxuXG4gIC8vIFNDUk9MTFNQWSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uc2Nyb2xsc3B5ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksICRzcHkuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRhYi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0YWJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gVEFCIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVGFiID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBqc2NzOmRpc2FibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgLy8ganNjczplbmFibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgfVxuXG4gIFRhYi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVGFiLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyAgICA9IHRoaXMuZWxlbWVudFxuICAgIHZhciAkdWwgICAgICA9ICR0aGlzLmNsb3Nlc3QoJ3VsOm5vdCguZHJvcGRvd24tbWVudSknKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmRhdGEoJ3RhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIGlmICgkdGhpcy5wYXJlbnQoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm5cblxuICAgIHZhciAkcHJldmlvdXMgPSAkdWwuZmluZCgnLmFjdGl2ZTpsYXN0IGEnKVxuICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgfSlcbiAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCgnc2hvdy5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICB9KVxuXG4gICAgJHByZXZpb3VzLnRyaWdnZXIoaGlkZUV2ZW50KVxuICAgICR0aGlzLnRyaWdnZXIoc2hvd0V2ZW50KVxuXG4gICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGhpcy5jbG9zZXN0KCdsaScpLCAkdWwpXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkcHJldmlvdXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdoaWRkZW4uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICAgIH0pXG4gICAgICAkdGhpcy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ3Nob3duLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgVGFiLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyICRhY3RpdmUgICAgPSBjb250YWluZXIuZmluZCgnPiAuYWN0aXZlJylcbiAgICB2YXIgdHJhbnNpdGlvbiA9IGNhbGxiYWNrXG4gICAgICAmJiAkLnN1cHBvcnQudHJhbnNpdGlvblxuICAgICAgJiYgKCRhY3RpdmUubGVuZ3RoICYmICRhY3RpdmUuaGFzQ2xhc3MoJ2ZhZGUnKSB8fCAhIWNvbnRhaW5lci5maW5kKCc+IC5mYWRlJykubGVuZ3RoKVxuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmUnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5lbmQoKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgZWxlbWVudFxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gcmVmbG93IGZvciB0cmFuc2l0aW9uXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhZGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAuZW5kKClcbiAgICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICAkYWN0aXZlLmxlbmd0aCAmJiB0cmFuc2l0aW9uID9cbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgbmV4dClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBuZXh0KClcblxuICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2luJylcbiAgfVxuXG5cbiAgLy8gVEFCIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLnRhYicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudGFiJywgKGRhdGEgPSBuZXcgVGFiKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50YWJcblxuICAkLmZuLnRhYiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRhYi5Db25zdHJ1Y3RvciA9IFRhYlxuXG5cbiAgLy8gVEFCIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQuZm4udGFiLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50YWIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBUQUIgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgUGx1Z2luLmNhbGwoJCh0aGlzKSwgJ3Nob3cnKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsIGNsaWNrSGFuZGxlcilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWZmaXguanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWZmaXhcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBRkZJWCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQWZmaXggPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBZmZpeC5ERUZBVUxUUywgb3B0aW9ucylcblxuICAgIHZhciB0YXJnZXQgPSB0aGlzLm9wdGlvbnMudGFyZ2V0ID09PSBBZmZpeC5ERUZBVUxUUy50YXJnZXQgPyAkKHRoaXMub3B0aW9ucy50YXJnZXQpIDogJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMudGFyZ2V0KVxuXG4gICAgdGhpcy4kdGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAub24oJ3Njcm9sbC5icy5hZmZpeC5kYXRhLWFwaScsICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSlcbiAgICAgIC5vbignY2xpY2suYnMuYWZmaXguZGF0YS1hcGknLCAgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLCB0aGlzKSlcblxuICAgIHRoaXMuJGVsZW1lbnQgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuYWZmaXhlZCAgICAgID0gbnVsbFxuICAgIHRoaXMudW5waW4gICAgICAgID0gbnVsbFxuICAgIHRoaXMucGlubmVkT2Zmc2V0ID0gbnVsbFxuXG4gICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcbiAgfVxuXG4gIEFmZml4LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEFmZml4LlJFU0VUICAgID0gJ2FmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b20nXG5cbiAgQWZmaXguREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAwLFxuICAgIHRhcmdldDogd2luZG93XG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgICAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHRhcmdldEhlaWdodCA9IHRoaXMuJHRhcmdldC5oZWlnaHQoKVxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHRoaXMuYWZmaXhlZCA9PSAndG9wJykgcmV0dXJuIHNjcm9sbFRvcCA8IG9mZnNldFRvcCA/ICd0b3AnIDogZmFsc2VcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgPT0gJ2JvdHRvbScpIHtcbiAgICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCkgcmV0dXJuIChzY3JvbGxUb3AgKyB0aGlzLnVucGluIDw9IHBvc2l0aW9uLnRvcCkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgICByZXR1cm4gKHNjcm9sbFRvcCArIHRhcmdldEhlaWdodCA8PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgIH1cblxuICAgIHZhciBpbml0aWFsaXppbmcgICA9IHRoaXMuYWZmaXhlZCA9PSBudWxsXG4gICAgdmFyIGNvbGxpZGVyVG9wICAgID0gaW5pdGlhbGl6aW5nID8gc2Nyb2xsVG9wIDogcG9zaXRpb24udG9wXG4gICAgdmFyIGNvbGxpZGVySGVpZ2h0ID0gaW5pdGlhbGl6aW5nID8gdGFyZ2V0SGVpZ2h0IDogaGVpZ2h0XG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgc2Nyb2xsVG9wIDw9IG9mZnNldFRvcCkgcmV0dXJuICd0b3AnXG4gICAgaWYgKG9mZnNldEJvdHRvbSAhPSBudWxsICYmIChjb2xsaWRlclRvcCArIGNvbGxpZGVySGVpZ2h0ID49IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkpIHJldHVybiAnYm90dG9tJ1xuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBpbm5lZE9mZnNldCkgcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVCkuYWRkQ2xhc3MoJ2FmZml4JylcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICByZXR1cm4gKHRoaXMucGlubmVkT2Zmc2V0ID0gcG9zaXRpb24udG9wIC0gc2Nyb2xsVG9wKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpLCAxKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LmlzKCc6dmlzaWJsZScpKSByZXR1cm5cblxuICAgIHZhciBoZWlnaHQgICAgICAgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldCAgICAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcFxuICAgIHZhciBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KCQoZG9jdW1lbnQpLmhlaWdodCgpLCAkKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKVxuXG4gICAgaWYgKHR5cGVvZiBvZmZzZXQgIT0gJ29iamVjdCcpICAgICAgICAgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0VG9wID0gb2Zmc2V0XG4gICAgaWYgKHR5cGVvZiBvZmZzZXRUb3AgPT0gJ2Z1bmN0aW9uJykgICAgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcCh0aGlzLiRlbGVtZW50KVxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0Qm90dG9tID09ICdmdW5jdGlvbicpIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b20odGhpcy4kZWxlbWVudClcblxuICAgIHZhciBhZmZpeCA9IHRoaXMuZ2V0U3RhdGUoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCAhPSBhZmZpeCkge1xuICAgICAgaWYgKHRoaXMudW5waW4gIT0gbnVsbCkgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsICcnKVxuXG4gICAgICB2YXIgYWZmaXhUeXBlID0gJ2FmZml4JyArIChhZmZpeCA/ICctJyArIGFmZml4IDogJycpXG4gICAgICB2YXIgZSAgICAgICAgID0gJC5FdmVudChhZmZpeFR5cGUgKyAnLmJzLmFmZml4JylcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgdGhpcy5hZmZpeGVkID0gYWZmaXhcbiAgICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHRoaXMuZ2V0UGlubmVkT2Zmc2V0KCkgOiBudWxsXG5cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKVxuICAgICAgICAuYWRkQ2xhc3MoYWZmaXhUeXBlKVxuICAgICAgICAudHJpZ2dlcihhZmZpeFR5cGUucmVwbGFjZSgnYWZmaXgnLCAnYWZmaXhlZCcpICsgJy5icy5hZmZpeCcpXG4gICAgfVxuXG4gICAgaWYgKGFmZml4ID09ICdib3R0b20nKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZnNldCh7XG4gICAgICAgIHRvcDogc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0IC0gb2Zmc2V0Qm90dG9tXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQUZGSVggUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYWZmaXgnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFmZml4JywgKGRhdGEgPSBuZXcgQWZmaXgodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFmZml4XG5cbiAgJC5mbi5hZmZpeCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFmZml4LkNvbnN0cnVjdG9yID0gQWZmaXhcblxuXG4gIC8vIEFGRklYIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hZmZpeC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWZmaXggPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBRkZJWCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICRzcHkuZGF0YSgpXG5cbiAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwge31cblxuICAgICAgaWYgKGRhdGEub2Zmc2V0Qm90dG9tICE9IG51bGwpIGRhdGEub2Zmc2V0LmJvdHRvbSA9IGRhdGEub2Zmc2V0Qm90dG9tXG4gICAgICBpZiAoZGF0YS5vZmZzZXRUb3AgICAgIT0gbnVsbCkgZGF0YS5vZmZzZXQudG9wICAgID0gZGF0YS5vZmZzZXRUb3BcblxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgZGF0YSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG4iLCIvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHwgRmxleHkgaGVhZGVyXG4vLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHxcbi8vIHwgVGhpcyBqUXVlcnkgc2NyaXB0IGlzIHdyaXR0ZW4gYnlcbi8vIHxcbi8vIHwgTW9ydGVuIE5pc3NlblxuLy8gfCBoamVtbWVzaWRla29uZ2VuLmRrXG4vLyB8XG5cbnZhciBmbGV4eV9oZWFkZXIgPSAoZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgcHViID0ge30sXG4gICAgICAgICRoZWFkZXJfc3RhdGljID0gJCgnLmZsZXh5LWhlYWRlci0tc3RhdGljJyksXG4gICAgICAgICRoZWFkZXJfc3RpY2t5ID0gJCgnLmZsZXh5LWhlYWRlci0tc3RpY2t5JyksXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB1cGRhdGVfaW50ZXJ2YWw6IDEwMCxcbiAgICAgICAgICAgIHRvbGVyYW5jZToge1xuICAgICAgICAgICAgICAgIHVwd2FyZDogMjAsXG4gICAgICAgICAgICAgICAgZG93bndhcmQ6IDEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb2Zmc2V0OiBfZ2V0X29mZnNldF9mcm9tX2VsZW1lbnRzX2JvdHRvbSgkaGVhZGVyX3N0YXRpYyksXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgcGlubmVkOiBcImZsZXh5LWhlYWRlci0tcGlubmVkXCIsXG4gICAgICAgICAgICAgICAgdW5waW5uZWQ6IFwiZmxleHktaGVhZGVyLS11bnBpbm5lZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhc19zY3JvbGxlZCA9IGZhbHNlLFxuICAgICAgICBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wID0gMDtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlXG4gICAgICovXG4gICAgcHViLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZWdpc3RlckV2ZW50SGFuZGxlcnMoKTtcbiAgICAgICAgcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBib290IGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpIHtcbiAgICAgICAgJGhlYWRlcl9zdGlja3kuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcblxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKHdhc19zY3JvbGxlZCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50X3dhc19zY3JvbGxlZCgpO1xuXG4gICAgICAgICAgICAgICAgd2FzX3Njcm9sbGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG9wdGlvbnMudXBkYXRlX2ludGVydmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpIHtcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgd2FzX3Njcm9sbGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG9mZnNldCBmcm9tIGVsZW1lbnQgYm90dG9tXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20oJGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRfaGVpZ2h0ID0gJGVsZW1lbnQub3V0ZXJIZWlnaHQodHJ1ZSksXG4gICAgICAgICAgICBlbGVtZW50X29mZnNldCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcDtcblxuICAgICAgICByZXR1cm4gKGVsZW1lbnRfaGVpZ2h0ICsgZWxlbWVudF9vZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvY3VtZW50IHdhcyBzY3JvbGxlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvY3VtZW50X3dhc19zY3JvbGxlZCgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgLy8gSWYgcGFzdCBvZmZzZXRcbiAgICAgICAgaWYgKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPj0gb3B0aW9ucy5vZmZzZXQpIHtcblxuICAgICAgICAgICAgLy8gRG93bndhcmRzIHNjcm9sbFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPiBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBPYmV5IHRoZSBkb3dud2FyZCB0b2xlcmFuY2VcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCAtIGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIDw9IG9wdGlvbnMudG9sZXJhbmNlLmRvd253YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcHdhcmRzIHNjcm9sbFxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBPYmV5IHRoZSB1cHdhcmQgdG9sZXJhbmNlXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgLSBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSA8PSBvcHRpb25zLnRvbGVyYW5jZS51cHdhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBub3Qgc2Nyb2xsZWQgcGFzdCB0aGUgZG9jdW1lbnQgd2hpY2ggaXMgcG9zc2libGUgb24gdGhlIE1hY1xuICAgICAgICAgICAgICAgIGlmICgoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCArICQod2luZG93KS5oZWlnaHQoKSkgPCAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdCBwYXN0IG9mZnNldFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wID0gY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfCBGbGV4eSBuYXZpZ2F0aW9uXG4vLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHxcbi8vIHwgVGhpcyBqUXVlcnkgc2NyaXB0IGlzIHdyaXR0ZW4gYnlcbi8vIHxcbi8vIHwgTW9ydGVuIE5pc3NlblxuLy8gfCBoamVtbWVzaWRla29uZ2VuLmRrXG4vLyB8XG5cbnZhciBmbGV4eV9uYXZpZ2F0aW9uID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHB1YiA9IHt9LFxuICAgICAgICBsYXlvdXRfY2xhc3NlcyA9IHtcbiAgICAgICAgICAgICduYXZpZ2F0aW9uJzogJy5mbGV4eS1uYXZpZ2F0aW9uJyxcbiAgICAgICAgICAgICdvYmZ1c2NhdG9yJzogJy5mbGV4eS1uYXZpZ2F0aW9uX19vYmZ1c2NhdG9yJyxcbiAgICAgICAgICAgICdkcm9wZG93bic6ICcuZmxleHktbmF2aWdhdGlvbl9faXRlbS0tZHJvcGRvd24nLFxuICAgICAgICAgICAgJ2Ryb3Bkb3duX21lZ2FtZW51JzogJy5mbGV4eS1uYXZpZ2F0aW9uX19pdGVtX19kcm9wZG93bi1tZWdhbWVudScsXG5cbiAgICAgICAgICAgICdpc191cGdyYWRlZCc6ICdpcy11cGdyYWRlZCcsXG4gICAgICAgICAgICAnbmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUnOiAnaGFzLW1lZ2FtZW51JyxcbiAgICAgICAgICAgICdkcm9wZG93bl9oYXNfbWVnYW1lbnUnOiAnZmxleHktbmF2aWdhdGlvbl9faXRlbS0tZHJvcGRvd24td2l0aC1tZWdhbWVudScsXG4gICAgICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZVxuICAgICAqL1xuICAgIHB1Yi5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYm9vdCBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKSB7XG5cbiAgICAgICAgLy8gVXBncmFkZVxuICAgICAgICB1cGdyYWRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50SGFuZGxlcnMoKSB7fVxuXG4gICAgLyoqXG4gICAgICogVXBncmFkZSBlbGVtZW50cy5cbiAgICAgKiBBZGQgY2xhc3NlcyB0byBlbGVtZW50cywgYmFzZWQgdXBvbiBhdHRhY2hlZCBjbGFzc2VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZ3JhZGUoKSB7XG4gICAgICAgIHZhciAkbmF2aWdhdGlvbnMgPSAkKGxheW91dF9jbGFzc2VzLm5hdmlnYXRpb24pO1xuXG4gICAgICAgIC8vIE5hdmlnYXRpb25zXG4gICAgICAgIGlmICgkbmF2aWdhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJG5hdmlnYXRpb25zLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG5hdmlnYXRpb24gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAkbWVnYW1lbnVzID0gJG5hdmlnYXRpb24uZmluZChsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bl9tZWdhbWVudSksXG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bl9tZWdhbWVudSA9ICRuYXZpZ2F0aW9uLmZpbmQobGF5b3V0X2NsYXNzZXMuZHJvcGRvd25faGFzX21lZ2FtZW51KTtcblxuICAgICAgICAgICAgICAgIC8vIEhhcyBhbHJlYWR5IGJlZW4gdXBncmFkZWRcbiAgICAgICAgICAgICAgICBpZiAoJG5hdmlnYXRpb24uaGFzQ2xhc3MobGF5b3V0X2NsYXNzZXMuaXNfdXBncmFkZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBIYXMgbWVnYW1lbnVcbiAgICAgICAgICAgICAgICBpZiAoJG1lZ2FtZW51cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRuYXZpZ2F0aW9uLmFkZENsYXNzKGxheW91dF9jbGFzc2VzLm5hdmlnYXRpb25faGFzX21lZ2FtZW51KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gdGhyb3VnaCBhbGwgbWVnYW1lbnVzXG4gICAgICAgICAgICAgICAgICAgICRtZWdhbWVudXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRtZWdhbWVudSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzX29iZnVzY2F0b3IgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2hhcy1vYmZ1c2NhdG9yJykgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRtZWdhbWVudS5wYXJlbnRzKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bl9oYXNfbWVnYW1lbnUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhvdmVyKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNfb2JmdXNjYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JmdXNjYXRvci5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNfb2JmdXNjYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JmdXNjYXRvci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSXMgdXBncmFkZWRcbiAgICAgICAgICAgICAgICAkbmF2aWdhdGlvbi5hZGRDbGFzcyhsYXlvdXRfY2xhc3Nlcy5pc191cGdyYWRlZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuIiwiLyohIHNpZHIgLSB2Mi4yLjEgLSAyMDE2LTAyLTE3XG4gKiBodHRwOi8vd3d3LmJlcnJpYXJ0LmNvbS9zaWRyL1xuICogQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQWxiZXJ0byBWYXJlbGE7IExpY2Vuc2VkIE1JVCAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGJhYmVsSGVscGVycyA9IHt9O1xuXG4gIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH07XG5cbiAgYmFiZWxIZWxwZXJzLmNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfTtcbiAgfSgpO1xuXG4gIGJhYmVsSGVscGVycztcblxuICB2YXIgc2lkclN0YXR1cyA9IHtcbiAgICBtb3Zpbmc6IGZhbHNlLFxuICAgIG9wZW5lZDogZmFsc2VcbiAgfTtcblxuICB2YXIgaGVscGVyID0ge1xuICAgIC8vIENoZWNrIGZvciB2YWxpZHMgdXJsc1xuICAgIC8vIEZyb20gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU3MTcwOTMvY2hlY2staWYtYS1qYXZhc2NyaXB0LXN0cmluZy1pcy1hbi11cmxcblxuICAgIGlzVXJsOiBmdW5jdGlvbiBpc1VybChzdHIpIHtcbiAgICAgIHZhciBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnXihodHRwcz86XFxcXC9cXFxcLyk/JyArIC8vIHByb3RvY29sXG4gICAgICAnKCgoW2EtelxcXFxkXShbYS16XFxcXGQtXSpbYS16XFxcXGRdKSopXFxcXC4/KStbYS16XXsyLH18JyArIC8vIGRvbWFpbiBuYW1lXG4gICAgICAnKChcXFxcZHsxLDN9XFxcXC4pezN9XFxcXGR7MSwzfSkpJyArIC8vIE9SIGlwICh2NCkgYWRkcmVzc1xuICAgICAgJyhcXFxcOlxcXFxkKyk/KFxcXFwvWy1hLXpcXFxcZCVfLn4rXSopKicgKyAvLyBwb3J0IGFuZCBwYXRoXG4gICAgICAnKFxcXFw/WzsmYS16XFxcXGQlXy5+Kz0tXSopPycgKyAvLyBxdWVyeSBzdHJpbmdcbiAgICAgICcoXFxcXCNbLWEtelxcXFxkX10qKT8kJywgJ2knKTsgLy8gZnJhZ21lbnQgbG9jYXRvclxuXG4gICAgICBpZiAocGF0dGVybi50ZXN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuXG4gICAgLy8gQWRkIHNpZHIgcHJlZml4ZXNcbiAgICBhZGRQcmVmaXhlczogZnVuY3Rpb24gYWRkUHJlZml4ZXMoJGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuYWRkUHJlZml4KCRlbGVtZW50LCAnaWQnKTtcbiAgICAgIHRoaXMuYWRkUHJlZml4KCRlbGVtZW50LCAnY2xhc3MnKTtcbiAgICAgICRlbGVtZW50LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgfSxcbiAgICBhZGRQcmVmaXg6IGZ1bmN0aW9uIGFkZFByZWZpeCgkZWxlbWVudCwgYXR0cmlidXRlKSB7XG4gICAgICB2YXIgdG9SZXBsYWNlID0gJGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUpO1xuXG4gICAgICBpZiAodHlwZW9mIHRvUmVwbGFjZSA9PT0gJ3N0cmluZycgJiYgdG9SZXBsYWNlICE9PSAnJyAmJiB0b1JlcGxhY2UgIT09ICdzaWRyLWlubmVyJykge1xuICAgICAgICAkZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSwgdG9SZXBsYWNlLnJlcGxhY2UoLyhbQS1aYS16MC05Xy5cXC1dKykvZywgJ3NpZHItJyArIGF0dHJpYnV0ZSArICctJDEnKSk7XG4gICAgICB9XG4gICAgfSxcblxuXG4gICAgLy8gQ2hlY2sgaWYgdHJhbnNpdGlvbnMgaXMgc3VwcG9ydGVkXG4gICAgdHJhbnNpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgc3R5bGUgPSBib2R5LnN0eWxlLFxuICAgICAgICAgIHN1cHBvcnRlZCA9IGZhbHNlLFxuICAgICAgICAgIHByb3BlcnR5ID0gJ3RyYW5zaXRpb24nO1xuXG4gICAgICBpZiAocHJvcGVydHkgaW4gc3R5bGUpIHtcbiAgICAgICAgc3VwcG9ydGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHByZWZpeGVzID0gWydtb3onLCAnd2Via2l0JywgJ28nLCAnbXMnXSxcbiAgICAgICAgICAgICAgcHJlZml4ID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBpID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgICBzdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgICAgICAgICAgIGlmIChwcmVmaXggKyBwcm9wZXJ0eSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KCk7XG4gICAgICAgICAgcHJvcGVydHkgPSBzdXBwb3J0ZWQgPyAnLScgKyBwcmVmaXgudG9Mb3dlckNhc2UoKSArICctJyArIHByb3BlcnR5LnRvTG93ZXJDYXNlKCkgOiBudWxsO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdXBwb3J0ZWQ6IHN1cHBvcnRlZCxcbiAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5XG4gICAgICB9O1xuICAgIH0oKVxuICB9O1xuXG4gIHZhciAkJDIgPSBqUXVlcnk7XG5cbiAgdmFyIGJvZHlBbmltYXRpb25DbGFzcyA9ICdzaWRyLWFuaW1hdGluZyc7XG4gIHZhciBvcGVuQWN0aW9uID0gJ29wZW4nO1xuICB2YXIgY2xvc2VBY3Rpb24gPSAnY2xvc2UnO1xuICB2YXIgdHJhbnNpdGlvbkVuZEV2ZW50ID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnO1xuICB2YXIgTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNZW51KG5hbWUpIHtcbiAgICAgIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayh0aGlzLCBNZW51KTtcblxuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuaXRlbSA9ICQkMignIycgKyBuYW1lKTtcbiAgICAgIHRoaXMub3BlbkNsYXNzID0gbmFtZSA9PT0gJ3NpZHInID8gJ3NpZHItb3BlbicgOiAnc2lkci1vcGVuICcgKyBuYW1lICsgJy1vcGVuJztcbiAgICAgIHRoaXMubWVudVdpZHRoID0gdGhpcy5pdGVtLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgICB0aGlzLnNwZWVkID0gdGhpcy5pdGVtLmRhdGEoJ3NwZWVkJyk7XG4gICAgICB0aGlzLnNpZGUgPSB0aGlzLml0ZW0uZGF0YSgnc2lkZScpO1xuICAgICAgdGhpcy5kaXNwbGFjZSA9IHRoaXMuaXRlbS5kYXRhKCdkaXNwbGFjZScpO1xuICAgICAgdGhpcy50aW1pbmcgPSB0aGlzLml0ZW0uZGF0YSgndGltaW5nJyk7XG4gICAgICB0aGlzLm1ldGhvZCA9IHRoaXMuaXRlbS5kYXRhKCdtZXRob2QnKTtcbiAgICAgIHRoaXMub25PcGVuQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25PcGVuJyk7XG4gICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbkNsb3NlJyk7XG4gICAgICB0aGlzLm9uT3BlbkVuZENhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uT3BlbkVuZCcpO1xuICAgICAgdGhpcy5vbkNsb3NlRW5kQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25DbG9zZUVuZCcpO1xuICAgICAgdGhpcy5ib2R5ID0gJCQyKHRoaXMuaXRlbS5kYXRhKCdib2R5JykpO1xuICAgIH1cblxuICAgIGJhYmVsSGVscGVycy5jcmVhdGVDbGFzcyhNZW51LCBbe1xuICAgICAga2V5OiAnZ2V0QW5pbWF0aW9uJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBbmltYXRpb24oYWN0aW9uLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSB7fSxcbiAgICAgICAgICAgIHByb3AgPSB0aGlzLnNpZGU7XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ29wZW4nICYmIGVsZW1lbnQgPT09ICdib2R5Jykge1xuICAgICAgICAgIGFuaW1hdGlvbltwcm9wXSA9IHRoaXMubWVudVdpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdjbG9zZScgJiYgZWxlbWVudCA9PT0gJ21lbnUnKSB7XG4gICAgICAgICAgYW5pbWF0aW9uW3Byb3BdID0gJy0nICsgdGhpcy5tZW51V2lkdGggKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFuaW1hdGlvbltwcm9wXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYW5pbWF0aW9uO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3ByZXBhcmVCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcmVwYXJlQm9keShhY3Rpb24pIHtcbiAgICAgICAgdmFyIHByb3AgPSBhY3Rpb24gPT09ICdvcGVuJyA/ICdoaWRkZW4nIDogJyc7XG5cbiAgICAgICAgLy8gUHJlcGFyZSBwYWdlIGlmIGNvbnRhaW5lciBpcyBib2R5XG4gICAgICAgIGlmICh0aGlzLmJvZHkuaXMoJ2JvZHknKSkge1xuICAgICAgICAgIHZhciAkaHRtbCA9ICQkMignaHRtbCcpLFxuICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkaHRtbC5zY3JvbGxUb3AoKTtcblxuICAgICAgICAgICRodG1sLmNzcygnb3ZlcmZsb3cteCcsIHByb3ApLnNjcm9sbFRvcChzY3JvbGxUb3ApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb3BlbkJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW5Cb2R5KCkge1xuICAgICAgICBpZiAodGhpcy5kaXNwbGFjZSkge1xuICAgICAgICAgIHZhciB0cmFuc2l0aW9ucyA9IGhlbHBlci50cmFuc2l0aW9ucyxcbiAgICAgICAgICAgICAgJGJvZHkgPSB0aGlzLmJvZHk7XG5cbiAgICAgICAgICBpZiAodHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAkYm9keS5jc3ModHJhbnNpdGlvbnMucHJvcGVydHksIHRoaXMuc2lkZSArICcgJyArIHRoaXMuc3BlZWQgLyAxMDAwICsgJ3MgJyArIHRoaXMudGltaW5nKS5jc3ModGhpcy5zaWRlLCAwKS5jc3Moe1xuICAgICAgICAgICAgICB3aWR0aDogJGJvZHkud2lkdGgoKSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGJvZHkuY3NzKHRoaXMuc2lkZSwgdGhpcy5tZW51V2lkdGggKyAncHgnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGJvZHlBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihvcGVuQWN0aW9uLCAnYm9keScpO1xuXG4gICAgICAgICAgICAkYm9keS5jc3Moe1xuICAgICAgICAgICAgICB3aWR0aDogJGJvZHkud2lkdGgoKSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgIH0pLmFuaW1hdGUoYm9keUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbkNsb3NlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25DbG9zZUJvZHkoKSB7XG4gICAgICAgIHZhciB0cmFuc2l0aW9ucyA9IGhlbHBlci50cmFuc2l0aW9ucyxcbiAgICAgICAgICAgIHJlc2V0U3R5bGVzID0ge1xuICAgICAgICAgIHdpZHRoOiAnJyxcbiAgICAgICAgICBwb3NpdGlvbjogJycsXG4gICAgICAgICAgcmlnaHQ6ICcnLFxuICAgICAgICAgIGxlZnQ6ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgIHJlc2V0U3R5bGVzW3RyYW5zaXRpb25zLnByb3BlcnR5XSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2R5LmNzcyhyZXNldFN0eWxlcykudW5iaW5kKHRyYW5zaXRpb25FbmRFdmVudCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2xvc2VCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZUJvZHkoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzcGxhY2UpIHtcbiAgICAgICAgICBpZiAoaGVscGVyLnRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgICAgdGhpcy5ib2R5LmNzcyh0aGlzLnNpZGUsIDApLm9uZSh0cmFuc2l0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXMub25DbG9zZUJvZHkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYm9keUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKGNsb3NlQWN0aW9uLCAnYm9keScpO1xuXG4gICAgICAgICAgICB0aGlzLmJvZHkuYW5pbWF0ZShib2R5QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5vbkNsb3NlQm9keSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdtb3ZlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZUJvZHkoYWN0aW9uKSB7XG4gICAgICAgIGlmIChhY3Rpb24gPT09IG9wZW5BY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLm9wZW5Cb2R5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbG9zZUJvZHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29uT3Blbk1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uT3Blbk1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLm5hbWU7XG5cbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2lkclN0YXR1cy5vcGVuZWQgPSBuYW1lO1xuXG4gICAgICAgIHRoaXMuaXRlbS51bmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50KTtcblxuICAgICAgICB0aGlzLmJvZHkucmVtb3ZlQ2xhc3MoYm9keUFuaW1hdGlvbkNsYXNzKS5hZGRDbGFzcyh0aGlzLm9wZW5DbGFzcyk7XG5cbiAgICAgICAgdGhpcy5vbk9wZW5FbmRDYWxsYmFjaygpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjYWxsYmFjayhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29wZW5NZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuTWVudShjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB2YXIgJGl0ZW0gPSB0aGlzLml0ZW07XG5cbiAgICAgICAgaWYgKGhlbHBlci50cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAkaXRlbS5jc3ModGhpcy5zaWRlLCAwKS5vbmUodHJhbnNpdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczIub25PcGVuTWVudShjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1lbnVBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihvcGVuQWN0aW9uLCAnbWVudScpO1xuXG4gICAgICAgICAgJGl0ZW0uY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJykuYW5pbWF0ZShtZW51QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgX3RoaXMyLm9uT3Blbk1lbnUoY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25DbG9zZU1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2xvc2VNZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaXRlbS5jc3Moe1xuICAgICAgICAgIGxlZnQ6ICcnLFxuICAgICAgICAgIHJpZ2h0OiAnJ1xuICAgICAgICB9KS51bmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50KTtcbiAgICAgICAgJCQyKCdodG1sJykuY3NzKCdvdmVyZmxvdy14JywgJycpO1xuXG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNpZHJTdGF0dXMub3BlbmVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5ib2R5LnJlbW92ZUNsYXNzKGJvZHlBbmltYXRpb25DbGFzcykucmVtb3ZlQ2xhc3ModGhpcy5vcGVuQ2xhc3MpO1xuXG4gICAgICAgIHRoaXMub25DbG9zZUVuZENhbGxiYWNrKCk7XG5cbiAgICAgICAgLy8gQ2FsbGJhY2tcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrKG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2xvc2VNZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZU1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW07XG5cbiAgICAgICAgaWYgKGhlbHBlci50cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICBpdGVtLmNzcyh0aGlzLnNpZGUsICcnKS5vbmUodHJhbnNpdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczMub25DbG9zZU1lbnUoY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtZW51QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24oY2xvc2VBY3Rpb24sICdtZW51Jyk7XG5cbiAgICAgICAgICBpdGVtLmFuaW1hdGUobWVudUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWQsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgICAgICAgIF90aGlzMy5vbkNsb3NlTWVudSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnbW92ZU1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmVNZW51KGFjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ib2R5LmFkZENsYXNzKGJvZHlBbmltYXRpb25DbGFzcyk7XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gb3BlbkFjdGlvbikge1xuICAgICAgICAgIHRoaXMub3Blbk1lbnUoY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xvc2VNZW51KGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21vdmUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmUoYWN0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBMb2NrIHNpZHJcbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucHJlcGFyZUJvZHkoYWN0aW9uKTtcbiAgICAgICAgdGhpcy5tb3ZlQm9keShhY3Rpb24pO1xuICAgICAgICB0aGlzLm1vdmVNZW51KGFjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29wZW4nLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW4oY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgaXMgYWxyZWFkeSBvcGVuZWQgb3IgbW92aW5nXG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCA9PT0gdGhpcy5uYW1lIHx8IHNpZHJTdGF0dXMubW92aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgYW5vdGhlciBtZW51IG9wZW5lZCBjbG9zZSBmaXJzdFxuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFyIGFscmVhZHlPcGVuZWRNZW51ID0gbmV3IE1lbnUoc2lkclN0YXR1cy5vcGVuZWQpO1xuXG4gICAgICAgICAgYWxyZWFkeU9wZW5lZE1lbnUuY2xvc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM0Lm9wZW4oY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlKCdvcGVuJywgY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIG9uT3BlbiBjYWxsYmFja1xuICAgICAgICB0aGlzLm9uT3BlbkNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2xvc2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGlzIGFscmVhZHkgY2xvc2VkIG9yIG1vdmluZ1xuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgIT09IHRoaXMubmFtZSB8fCBzaWRyU3RhdHVzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW92ZSgnY2xvc2UnLCBjYWxsYmFjayk7XG5cbiAgICAgICAgLy8gb25DbG9zZSBjYWxsYmFja1xuICAgICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3RvZ2dsZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCA9PT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZShjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcGVuKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gTWVudTtcbiAgfSgpO1xuXG4gIHZhciAkJDEgPSBqUXVlcnk7XG5cbiAgZnVuY3Rpb24gZXhlY3V0ZShhY3Rpb24sIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNpZHIgPSBuZXcgTWVudShuYW1lKTtcblxuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdvcGVuJzpcbiAgICAgICAgc2lkci5vcGVuKGNhbGxiYWNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbG9zZSc6XG4gICAgICAgIHNpZHIuY2xvc2UoY2FsbGJhY2spO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RvZ2dsZSc6XG4gICAgICAgIHNpZHIudG9nZ2xlKGNhbGxiYWNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAkJDEuZXJyb3IoJ01ldGhvZCAnICsgYWN0aW9uICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkuc2lkcicpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgaTtcbiAgdmFyICQgPSBqUXVlcnk7XG4gIHZhciBwdWJsaWNNZXRob2RzID0gWydvcGVuJywgJ2Nsb3NlJywgJ3RvZ2dsZSddO1xuICB2YXIgbWV0aG9kTmFtZTtcbiAgdmFyIG1ldGhvZHMgPSB7fTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIGdldE1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgICAgLy8gQ2hlY2sgYXJndW1lbnRzXG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuYW1lO1xuICAgICAgICBuYW1lID0gJ3NpZHInO1xuICAgICAgfSBlbHNlIGlmICghbmFtZSkge1xuICAgICAgICBuYW1lID0gJ3NpZHInO1xuICAgICAgfVxuXG4gICAgICBleGVjdXRlKG1ldGhvZE5hbWUsIG5hbWUsIGNhbGxiYWNrKTtcbiAgICB9O1xuICB9O1xuICBmb3IgKGkgPSAwOyBpIDwgcHVibGljTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgIG1ldGhvZE5hbWUgPSBwdWJsaWNNZXRob2RzW2ldO1xuICAgIG1ldGhvZHNbbWV0aG9kTmFtZV0gPSBnZXRNZXRob2QobWV0aG9kTmFtZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzaWRyKG1ldGhvZCkge1xuICAgIGlmIChtZXRob2QgPT09ICdzdGF0dXMnKSB7XG4gICAgICByZXR1cm4gc2lkclN0YXR1cztcbiAgICB9IGVsc2UgaWYgKG1ldGhvZHNbbWV0aG9kXSkge1xuICAgICAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycgfHwgIW1ldGhvZCkge1xuICAgICAgcmV0dXJuIG1ldGhvZHMudG9nZ2xlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQuZXJyb3IoJ01ldGhvZCAnICsgbWV0aG9kICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkuc2lkcicpO1xuICAgIH1cbiAgfVxuXG4gIHZhciAkJDMgPSBqUXVlcnk7XG5cbiAgZnVuY3Rpb24gZmlsbENvbnRlbnQoJHNpZGVNZW51LCBzZXR0aW5ncykge1xuICAgIC8vIFRoZSBtZW51IGNvbnRlbnRcbiAgICBpZiAodHlwZW9mIHNldHRpbmdzLnNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIG5ld0NvbnRlbnQgPSBzZXR0aW5ncy5zb3VyY2UobmFtZSk7XG5cbiAgICAgICRzaWRlTWVudS5odG1sKG5ld0NvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldHRpbmdzLnNvdXJjZSA9PT0gJ3N0cmluZycgJiYgaGVscGVyLmlzVXJsKHNldHRpbmdzLnNvdXJjZSkpIHtcbiAgICAgICQkMy5nZXQoc2V0dGluZ3Muc291cmNlLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAkc2lkZU1lbnUuaHRtbChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldHRpbmdzLnNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBodG1sQ29udGVudCA9ICcnLFxuICAgICAgICAgIHNlbGVjdG9ycyA9IHNldHRpbmdzLnNvdXJjZS5zcGxpdCgnLCcpO1xuXG4gICAgICAkJDMuZWFjaChzZWxlY3RvcnMsIGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICBodG1sQ29udGVudCArPSAnPGRpdiBjbGFzcz1cInNpZHItaW5uZXJcIj4nICsgJCQzKGVsZW1lbnQpLmh0bWwoKSArICc8L2Rpdj4nO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlbmFtaW5nIGlkcyBhbmQgY2xhc3Nlc1xuICAgICAgaWYgKHNldHRpbmdzLnJlbmFtaW5nKSB7XG4gICAgICAgIHZhciAkaHRtbENvbnRlbnQgPSAkJDMoJzxkaXYgLz4nKS5odG1sKGh0bWxDb250ZW50KTtcblxuICAgICAgICAkaHRtbENvbnRlbnQuZmluZCgnKicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtZW50ID0gJCQzKGVsZW1lbnQpO1xuXG4gICAgICAgICAgaGVscGVyLmFkZFByZWZpeGVzKCRlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGh0bWxDb250ZW50ID0gJGh0bWxDb250ZW50Lmh0bWwoKTtcbiAgICAgIH1cblxuICAgICAgJHNpZGVNZW51Lmh0bWwoaHRtbENvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3Muc291cmNlICE9PSBudWxsKSB7XG4gICAgICAkJDMuZXJyb3IoJ0ludmFsaWQgU2lkciBTb3VyY2UnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHNpZGVNZW51O1xuICB9XG5cbiAgZnVuY3Rpb24gZm5TaWRyKG9wdGlvbnMpIHtcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSBoZWxwZXIudHJhbnNpdGlvbnMsXG4gICAgICAgIHNldHRpbmdzID0gJCQzLmV4dGVuZCh7XG4gICAgICBuYW1lOiAnc2lkcicsIC8vIE5hbWUgZm9yIHRoZSAnc2lkcidcbiAgICAgIHNwZWVkOiAyMDAsIC8vIEFjY2VwdHMgc3RhbmRhcmQgalF1ZXJ5IGVmZmVjdHMgc3BlZWRzIChpLmUuIGZhc3QsIG5vcm1hbCBvciBtaWxsaXNlY29uZHMpXG4gICAgICBzaWRlOiAnbGVmdCcsIC8vIEFjY2VwdHMgJ2xlZnQnIG9yICdyaWdodCdcbiAgICAgIHNvdXJjZTogbnVsbCwgLy8gT3ZlcnJpZGUgdGhlIHNvdXJjZSBvZiB0aGUgY29udGVudC5cbiAgICAgIHJlbmFtaW5nOiB0cnVlLCAvLyBUaGUgaWRzIGFuZCBjbGFzc2VzIHdpbGwgYmUgcHJlcGVuZGVkIHdpdGggYSBwcmVmaXggd2hlbiBsb2FkaW5nIGV4aXN0ZW50IGNvbnRlbnRcbiAgICAgIGJvZHk6ICdib2R5JywgLy8gUGFnZSBjb250YWluZXIgc2VsZWN0b3IsXG4gICAgICBkaXNwbGFjZTogdHJ1ZSwgLy8gRGlzcGxhY2UgdGhlIGJvZHkgY29udGVudCBvciBub3RcbiAgICAgIHRpbWluZzogJ2Vhc2UnLCAvLyBUaW1pbmcgZnVuY3Rpb24gZm9yIENTUyB0cmFuc2l0aW9uc1xuICAgICAgbWV0aG9kOiAndG9nZ2xlJywgLy8gVGhlIG1ldGhvZCB0byBjYWxsIHdoZW4gZWxlbWVudCBpcyBjbGlja2VkXG4gICAgICBiaW5kOiAndG91Y2hzdGFydCBjbGljaycsIC8vIFRoZSBldmVudChzKSB0byB0cmlnZ2VyIHRoZSBtZW51XG4gICAgICBvbk9wZW46IGZ1bmN0aW9uIG9uT3BlbigpIHt9LFxuICAgICAgLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIHN0YXJ0IG9wZW5pbmdcbiAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uIG9uQ2xvc2UoKSB7fSxcbiAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2lkciBzdGFydCBjbG9zaW5nXG4gICAgICBvbk9wZW5FbmQ6IGZ1bmN0aW9uIG9uT3BlbkVuZCgpIHt9LFxuICAgICAgLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIGVuZCBvcGVuaW5nXG4gICAgICBvbkNsb3NlRW5kOiBmdW5jdGlvbiBvbkNsb3NlRW5kKCkge30gLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIGVuZCBjbG9zaW5nXG5cbiAgICB9LCBvcHRpb25zKSxcbiAgICAgICAgbmFtZSA9IHNldHRpbmdzLm5hbWUsXG4gICAgICAgICRzaWRlTWVudSA9ICQkMygnIycgKyBuYW1lKTtcblxuICAgIC8vIElmIHRoZSBzaWRlIG1lbnUgZG8gbm90IGV4aXN0IGNyZWF0ZSBpdFxuICAgIGlmICgkc2lkZU1lbnUubGVuZ3RoID09PSAwKSB7XG4gICAgICAkc2lkZU1lbnUgPSAkJDMoJzxkaXYgLz4nKS5hdHRyKCdpZCcsIG5hbWUpLmFwcGVuZFRvKCQkMygnYm9keScpKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdHJhbnNpdGlvbiB0byBtZW51IGlmIGFyZSBzdXBwb3J0ZWRcbiAgICBpZiAodHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAkc2lkZU1lbnUuY3NzKHRyYW5zaXRpb25zLnByb3BlcnR5LCBzZXR0aW5ncy5zaWRlICsgJyAnICsgc2V0dGluZ3Muc3BlZWQgLyAxMDAwICsgJ3MgJyArIHNldHRpbmdzLnRpbWluZyk7XG4gICAgfVxuXG4gICAgLy8gQWRkaW5nIHN0eWxlcyBhbmQgb3B0aW9uc1xuICAgICRzaWRlTWVudS5hZGRDbGFzcygnc2lkcicpLmFkZENsYXNzKHNldHRpbmdzLnNpZGUpLmRhdGEoe1xuICAgICAgc3BlZWQ6IHNldHRpbmdzLnNwZWVkLFxuICAgICAgc2lkZTogc2V0dGluZ3Muc2lkZSxcbiAgICAgIGJvZHk6IHNldHRpbmdzLmJvZHksXG4gICAgICBkaXNwbGFjZTogc2V0dGluZ3MuZGlzcGxhY2UsXG4gICAgICB0aW1pbmc6IHNldHRpbmdzLnRpbWluZyxcbiAgICAgIG1ldGhvZDogc2V0dGluZ3MubWV0aG9kLFxuICAgICAgb25PcGVuOiBzZXR0aW5ncy5vbk9wZW4sXG4gICAgICBvbkNsb3NlOiBzZXR0aW5ncy5vbkNsb3NlLFxuICAgICAgb25PcGVuRW5kOiBzZXR0aW5ncy5vbk9wZW5FbmQsXG4gICAgICBvbkNsb3NlRW5kOiBzZXR0aW5ncy5vbkNsb3NlRW5kXG4gICAgfSk7XG5cbiAgICAkc2lkZU1lbnUgPSBmaWxsQ29udGVudCgkc2lkZU1lbnUsIHNldHRpbmdzKTtcblxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCQzKHRoaXMpLFxuICAgICAgICAgIGRhdGEgPSAkdGhpcy5kYXRhKCdzaWRyJyksXG4gICAgICAgICAgZmxhZyA9IGZhbHNlO1xuXG4gICAgICAvLyBJZiB0aGUgcGx1Z2luIGhhc24ndCBiZWVuIGluaXRpYWxpemVkIHlldFxuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNpZHJTdGF0dXMub3BlbmVkID0gZmFsc2U7XG5cbiAgICAgICAgJHRoaXMuZGF0YSgnc2lkcicsIG5hbWUpO1xuXG4gICAgICAgICR0aGlzLmJpbmQoc2V0dGluZ3MuYmluZCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmICghZmxhZykge1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICBzaWRyKHNldHRpbmdzLm1ldGhvZCwgbmFtZSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkuc2lkciA9IHNpZHI7XG4gIGpRdWVyeS5mbi5zaWRyID0gZm5TaWRyO1xuXG59KCkpOyIsIiFmdW5jdGlvbihlKXt2YXIgdDtlLmZuLnNsaW5reT1mdW5jdGlvbihhKXt2YXIgcz1lLmV4dGVuZCh7bGFiZWw6XCJCYWNrXCIsdGl0bGU6ITEsc3BlZWQ6MzAwLHJlc2l6ZTohMH0sYSksaT1lKHRoaXMpLG49aS5jaGlsZHJlbigpLmZpcnN0KCk7aS5hZGRDbGFzcyhcInNsaW5reS1tZW51XCIpO3ZhciByPWZ1bmN0aW9uKGUsdCl7dmFyIGE9TWF0aC5yb3VuZChwYXJzZUludChuLmdldCgwKS5zdHlsZS5sZWZ0KSl8fDA7bi5jc3MoXCJsZWZ0XCIsYS0xMDAqZStcIiVcIiksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmc2V0VGltZW91dCh0LHMuc3BlZWQpfSxsPWZ1bmN0aW9uKGUpe2kuaGVpZ2h0KGUub3V0ZXJIZWlnaHQoKSl9LGQ9ZnVuY3Rpb24oZSl7aS5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsZStcIm1zXCIpLG4uY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLGUrXCJtc1wiKX07aWYoZChzLnNwZWVkKSxlKFwiYSArIHVsXCIsaSkucHJldigpLmFkZENsYXNzKFwibmV4dFwiKSxlKFwibGkgPiB1bFwiLGkpLnByZXBlbmQoJzxsaSBjbGFzcz1cImhlYWRlclwiPicpLHMudGl0bGU9PT0hMCYmZShcImxpID4gdWxcIixpKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9ZSh0aGlzKS5wYXJlbnQoKS5maW5kKFwiYVwiKS5maXJzdCgpLnRleHQoKSxhPWUoXCI8aDI+XCIpLnRleHQodCk7ZShcIj4gLmhlYWRlclwiLHRoaXMpLmFwcGVuZChhKX0pLHMudGl0bGV8fHMubGFiZWwhPT0hMCl7dmFyIG89ZShcIjxhPlwiKS50ZXh0KHMubGFiZWwpLnByb3AoXCJocmVmXCIsXCIjXCIpLmFkZENsYXNzKFwiYmFja1wiKTtlKFwiLmhlYWRlclwiLGkpLmFwcGVuZChvKX1lbHNlIGUoXCJsaSA+IHVsXCIsaSkuZWFjaChmdW5jdGlvbigpe3ZhciB0PWUodGhpcykucGFyZW50KCkuZmluZChcImFcIikuZmlyc3QoKS50ZXh0KCksYT1lKFwiPGE+XCIpLnRleHQodCkucHJvcChcImhyZWZcIixcIiNcIikuYWRkQ2xhc3MoXCJiYWNrXCIpO2UoXCI+IC5oZWFkZXJcIix0aGlzKS5hcHBlbmQoYSl9KTtlKFwiYVwiLGkpLm9uKFwiY2xpY2tcIixmdW5jdGlvbihhKXtpZighKHQrcy5zcGVlZD5EYXRlLm5vdygpKSl7dD1EYXRlLm5vdygpO3ZhciBuPWUodGhpcyk7LyMvLnRlc3QodGhpcy5ocmVmKSYmYS5wcmV2ZW50RGVmYXVsdCgpLG4uaGFzQ2xhc3MoXCJuZXh0XCIpPyhpLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLG4ubmV4dCgpLnNob3coKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxyKDEpLHMucmVzaXplJiZsKG4ubmV4dCgpKSk6bi5oYXNDbGFzcyhcImJhY2tcIikmJihyKC0xLGZ1bmN0aW9uKCl7aS5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxuLnBhcmVudCgpLnBhcmVudCgpLmhpZGUoKS5wYXJlbnRzVW50aWwoaSxcInVsXCIpLmZpcnN0KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIil9KSxzLnJlc2l6ZSYmbChuLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudHNVbnRpbChpLFwidWxcIikpKX19KSx0aGlzLmp1bXA9ZnVuY3Rpb24odCxhKXt0PWUodCk7dmFyIG49aS5maW5kKFwiLmFjdGl2ZVwiKTtuPW4ubGVuZ3RoPjA/bi5wYXJlbnRzVW50aWwoaSxcInVsXCIpLmxlbmd0aDowLGkuZmluZChcInVsXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmhpZGUoKTt2YXIgbz10LnBhcmVudHNVbnRpbChpLFwidWxcIik7by5zaG93KCksdC5zaG93KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIiksYT09PSExJiZkKDApLHIoby5sZW5ndGgtbikscy5yZXNpemUmJmwodCksYT09PSExJiZkKHMuc3BlZWQpfSx0aGlzLmhvbWU9ZnVuY3Rpb24odCl7dD09PSExJiZkKDApO3ZhciBhPWkuZmluZChcIi5hY3RpdmVcIiksbj1hLnBhcmVudHNVbnRpbChpLFwibGlcIikubGVuZ3RoO24+MCYmKHIoLW4sZnVuY3Rpb24oKXthLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpfSkscy5yZXNpemUmJmwoZShhLnBhcmVudHNVbnRpbChpLFwibGlcIikuZ2V0KG4tMSkpLnBhcmVudCgpKSksdD09PSExJiZkKHMuc3BlZWQpfSx0aGlzLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlKFwiLmhlYWRlclwiLGkpLnJlbW92ZSgpLGUoXCJhXCIsaSkucmVtb3ZlQ2xhc3MoXCJuZXh0XCIpLm9mZihcImNsaWNrXCIpLGkucmVtb3ZlQ2xhc3MoXCJzbGlua3ktbWVudVwiKS5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXCJcIiksbi5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXCJcIil9O3ZhciBjPWkuZmluZChcIi5hY3RpdmVcIik7cmV0dXJuIGMubGVuZ3RoPjAmJihjLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLHRoaXMuanVtcChjLCExKSksdGhpc319KGpRdWVyeSk7IiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgQWpheE1vbml0b3IsIEJhciwgRG9jdW1lbnRNb25pdG9yLCBFbGVtZW50TW9uaXRvciwgRWxlbWVudFRyYWNrZXIsIEV2ZW50TGFnTW9uaXRvciwgRXZlbnRlZCwgRXZlbnRzLCBOb1RhcmdldEVycm9yLCBQYWNlLCBSZXF1ZXN0SW50ZXJjZXB0LCBTT1VSQ0VfS0VZUywgU2NhbGVyLCBTb2NrZXRSZXF1ZXN0VHJhY2tlciwgWEhSUmVxdWVzdFRyYWNrZXIsIGFuaW1hdGlvbiwgYXZnQW1wbGl0dWRlLCBiYXIsIGNhbmNlbEFuaW1hdGlvbiwgY2FuY2VsQW5pbWF0aW9uRnJhbWUsIGRlZmF1bHRPcHRpb25zLCBleHRlbmQsIGV4dGVuZE5hdGl2ZSwgZ2V0RnJvbURPTSwgZ2V0SW50ZXJjZXB0LCBoYW5kbGVQdXNoU3RhdGUsIGlnbm9yZVN0YWNrLCBpbml0LCBub3csIG9wdGlvbnMsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgcmVzdWx0LCBydW5BbmltYXRpb24sIHNjYWxlcnMsIHNob3VsZElnbm9yZVVSTCwgc2hvdWxkVHJhY2ssIHNvdXJjZSwgc291cmNlcywgdW5pU2NhbGVyLCBfV2ViU29ja2V0LCBfWERvbWFpblJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCwgX2ksIF9pbnRlcmNlcHQsIF9sZW4sIF9wdXNoU3RhdGUsIF9yZWYsIF9yZWYxLCBfcmVwbGFjZVN0YXRlLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjYXRjaHVwVGltZTogMTAwLFxuICAgIGluaXRpYWxSYXRlOiAuMDMsXG4gICAgbWluVGltZTogMjUwLFxuICAgIGdob3N0VGltZTogMTAwLFxuICAgIG1heFByb2dyZXNzUGVyRnJhbWU6IDIwLFxuICAgIGVhc2VGYWN0b3I6IDEuMjUsXG4gICAgc3RhcnRPblBhZ2VMb2FkOiB0cnVlLFxuICAgIHJlc3RhcnRPblB1c2hTdGF0ZTogdHJ1ZSxcbiAgICByZXN0YXJ0T25SZXF1ZXN0QWZ0ZXI6IDUwMCxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBlbGVtZW50czoge1xuICAgICAgY2hlY2tJbnRlcnZhbDogMTAwLFxuICAgICAgc2VsZWN0b3JzOiBbJ2JvZHknXVxuICAgIH0sXG4gICAgZXZlbnRMYWc6IHtcbiAgICAgIG1pblNhbXBsZXM6IDEwLFxuICAgICAgc2FtcGxlQ291bnQ6IDMsXG4gICAgICBsYWdUaHJlc2hvbGQ6IDNcbiAgICB9LFxuICAgIGFqYXg6IHtcbiAgICAgIHRyYWNrTWV0aG9kczogWydHRVQnXSxcbiAgICAgIHRyYWNrV2ViU29ja2V0czogdHJ1ZSxcbiAgICAgIGlnbm9yZVVSTHM6IFtdXG4gICAgfVxuICB9O1xuXG4gIG5vdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVmO1xuICAgIHJldHVybiAoX3JlZiA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCA/IHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlLm5vdygpIDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZiA6ICsobmV3IERhdGUpO1xuICB9O1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PSBudWxsKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCA1MCk7XG4gICAgfTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuICB9XG5cbiAgcnVuQW5pbWF0aW9uID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgbGFzdCwgdGljaztcbiAgICBsYXN0ID0gbm93KCk7XG4gICAgdGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRpZmY7XG4gICAgICBkaWZmID0gbm93KCkgLSBsYXN0O1xuICAgICAgaWYgKGRpZmYgPj0gMzMpIHtcbiAgICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgICByZXR1cm4gZm4oZGlmZiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCh0aWNrLCAzMyAtIGRpZmYpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHRpY2soKTtcbiAgfTtcblxuICByZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywga2V5LCBvYmo7XG4gICAgb2JqID0gYXJndW1lbnRzWzBdLCBrZXkgPSBhcmd1bWVudHNbMV0sIGFyZ3MgPSAzIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IFtdO1xuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XS5hcHBseShvYmosIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfVxuICB9O1xuXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXksIG91dCwgc291cmNlLCBzb3VyY2VzLCB2YWwsIF9pLCBfbGVuO1xuICAgIG91dCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBzb3VyY2VzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2VzW19pXTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKCFfX2hhc1Byb3AuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgIHZhbCA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIGlmICgob3V0W2tleV0gIT0gbnVsbCkgJiYgdHlwZW9mIG91dFtrZXldID09PSAnb2JqZWN0JyAmJiAodmFsICE9IG51bGwpICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBleHRlbmQob3V0W2tleV0sIHZhbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGF2Z0FtcGxpdHVkZSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciBjb3VudCwgc3VtLCB2LCBfaSwgX2xlbjtcbiAgICBzdW0gPSBjb3VudCA9IDA7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcnIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHYgPSBhcnJbX2ldO1xuICAgICAgc3VtICs9IE1hdGguYWJzKHYpO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAvIGNvdW50O1xuICB9O1xuXG4gIGdldEZyb21ET00gPSBmdW5jdGlvbihrZXksIGpzb24pIHtcbiAgICB2YXIgZGF0YSwgZSwgZWw7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBrZXkgPSAnb3B0aW9ucyc7XG4gICAgfVxuICAgIGlmIChqc29uID09IG51bGwpIHtcbiAgICAgIGpzb24gPSB0cnVlO1xuICAgIH1cbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1wYWNlLVwiICsga2V5ICsgXCJdXCIpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGFjZS1cIiArIGtleSk7XG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgZSA9IF9lcnJvcjtcbiAgICAgIHJldHVybiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5lcnJvcihcIkVycm9yIHBhcnNpbmcgaW5saW5lIHBhY2Ugb3B0aW9uc1wiLCBlKSA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgRXZlbnRlZCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudGVkKCkge31cblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgb25jZSkge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKG9uY2UgPT0gbnVsbCkge1xuICAgICAgICBvbmNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5iaW5kaW5ncyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICgoX2Jhc2UgPSB0aGlzLmJpbmRpbmdzKVtldmVudF0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW2V2ZW50XS5wdXNoKHtcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgY3R4OiBjdHgsXG4gICAgICAgIG9uY2U6IG9uY2VcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCkge1xuICAgICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICB2YXIgaSwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBpZiAoKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChoYW5kbGVyID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmJpbmRpbmdzW2V2ZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXS5oYW5kbGVyID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgY3R4LCBldmVudCwgaGFuZGxlciwgaSwgb25jZSwgX3JlZiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgaWYgKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5nc1tldmVudF1baV0sIGhhbmRsZXIgPSBfcmVmMS5oYW5kbGVyLCBjdHggPSBfcmVmMS5jdHgsIG9uY2UgPSBfcmVmMS5vbmNlO1xuICAgICAgICAgIGhhbmRsZXIuYXBwbHkoY3R4ICE9IG51bGwgPyBjdHggOiB0aGlzLCBhcmdzKTtcbiAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmJpbmRpbmdzW2V2ZW50XS5zcGxpY2UoaSwgMSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50ZWQ7XG5cbiAgfSkoKTtcblxuICBQYWNlID0gd2luZG93LlBhY2UgfHwge307XG5cbiAgd2luZG93LlBhY2UgPSBQYWNlO1xuXG4gIGV4dGVuZChQYWNlLCBFdmVudGVkLnByb3RvdHlwZSk7XG5cbiAgb3B0aW9ucyA9IFBhY2Uub3B0aW9ucyA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHdpbmRvdy5wYWNlT3B0aW9ucywgZ2V0RnJvbURPTSgpKTtcblxuICBfcmVmID0gWydhamF4JywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJywgJ2VsZW1lbnRzJ107XG4gIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgIHNvdXJjZSA9IF9yZWZbX2ldO1xuICAgIGlmIChvcHRpb25zW3NvdXJjZV0gPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnNbc291cmNlXSA9IGRlZmF1bHRPcHRpb25zW3NvdXJjZV07XG4gICAgfVxuICB9XG5cbiAgTm9UYXJnZXRFcnJvciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTm9UYXJnZXRFcnJvciwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIE5vVGFyZ2V0RXJyb3IoKSB7XG4gICAgICBfcmVmMSA9IE5vVGFyZ2V0RXJyb3IuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gX3JlZjE7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5vVGFyZ2V0RXJyb3I7XG5cbiAgfSkoRXJyb3IpO1xuXG4gIEJhciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBCYXIoKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICB9XG5cbiAgICBCYXIucHJvdG90eXBlLmdldEVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YXJnZXRFbGVtZW50O1xuICAgICAgaWYgKHRoaXMuZWwgPT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCk7XG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBOb1RhcmdldEVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc05hbWUgPSBcInBhY2UgcGFjZS1hY3RpdmVcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKC9wYWNlLWRvbmUvZywgJycpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtcnVubmluZyc7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzXCI+XFxuICA8ZGl2IGNsYXNzPVwicGFjZS1wcm9ncmVzcy1pbm5lclwiPjwvZGl2PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJwYWNlLWFjdGl2aXR5XCI+PC9kaXY+JztcbiAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuZmlyc3RDaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGFyZ2V0RWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbDtcbiAgICAgIGVsID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1hY3RpdmUnLCAnJyk7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyBwYWNlLWluYWN0aXZlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1ydW5uaW5nJywgJycpO1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1kb25lJztcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihwcm9nKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gcHJvZztcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5nZXRFbGVtZW50KCkpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbCA9IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCwga2V5LCBwcm9ncmVzc1N0ciwgdHJhbnNmb3JtLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIHRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyB0aGlzLnByb2dyZXNzICsgXCIlLCAwLCAwKVwiO1xuICAgICAgX3JlZjIgPSBbJ3dlYmtpdFRyYW5zZm9ybScsICdtc1RyYW5zZm9ybScsICd0cmFuc2Zvcm0nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBrZXkgPSBfcmVmMltfal07XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnN0eWxlW2tleV0gPSB0cmFuc2Zvcm07XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgfHwgdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8IDAgIT09IHRoaXMucHJvZ3Jlc3MgfCAwKSB7XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcy10ZXh0JywgXCJcIiArICh0aGlzLnByb2dyZXNzIHwgMCkgKyBcIiVcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzID49IDEwMCkge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gJzk5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9IHRoaXMucHJvZ3Jlc3MgPCAxMCA/IFwiMFwiIDogXCJcIjtcbiAgICAgICAgICBwcm9ncmVzc1N0ciArPSB0aGlzLnByb2dyZXNzIHwgMDtcbiAgICAgICAgfVxuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MnLCBcIlwiICsgcHJvZ3Jlc3NTdHIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID49IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJhcjtcblxuICB9KSgpO1xuXG4gIEV2ZW50cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudHMoKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgfVxuXG4gICAgRXZlbnRzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgICB2YXIgYmluZGluZywgX2osIF9sZW4xLCBfcmVmMiwgX3Jlc3VsdHM7XG4gICAgICBpZiAodGhpcy5iaW5kaW5nc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYyID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgYmluZGluZyA9IF9yZWYyW19qXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcuY2FsbCh0aGlzLCB2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW25hbWVdID09IG51bGwpIHtcbiAgICAgICAgX2Jhc2VbbmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW25hbWVdLnB1c2goZm4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRzO1xuXG4gIH0pKCk7XG5cbiAgX1hNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuXG4gIF9YRG9tYWluUmVxdWVzdCA9IHdpbmRvdy5YRG9tYWluUmVxdWVzdDtcblxuICBfV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcblxuICBleHRlbmROYXRpdmUgPSBmdW5jdGlvbih0bywgZnJvbSkge1xuICAgIHZhciBlLCBrZXksIF9yZXN1bHRzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gZnJvbS5wcm90b3R5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICgodG9ba2V5XSA9PSBudWxsKSAmJiB0eXBlb2YgZnJvbVtrZXldICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBrZXksIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbS5wcm90b3R5cGVba2V5XTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godG9ba2V5XSA9IGZyb20ucHJvdG90eXBlW2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgaWdub3JlU3RhY2sgPSBbXTtcblxuICBQYWNlLmlnbm9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCdpZ25vcmUnKTtcbiAgICByZXQgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgUGFjZS50cmFjayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCd0cmFjaycpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBzaG91bGRUcmFjayA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHZhciBfcmVmMjtcbiAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgIG1ldGhvZCA9ICdHRVQnO1xuICAgIH1cbiAgICBpZiAoaWdub3JlU3RhY2tbMF0gPT09ICd0cmFjaycpIHtcbiAgICAgIHJldHVybiAnZm9yY2UnO1xuICAgIH1cbiAgICBpZiAoIWlnbm9yZVN0YWNrLmxlbmd0aCAmJiBvcHRpb25zLmFqYXgpIHtcbiAgICAgIGlmIChtZXRob2QgPT09ICdzb2NrZXQnICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKF9yZWYyID0gbWV0aG9kLnRvVXBwZXJDYXNlKCksIF9faW5kZXhPZi5jYWxsKG9wdGlvbnMuYWpheC50cmFja01ldGhvZHMsIF9yZWYyKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgUmVxdWVzdEludGVyY2VwdCA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVxdWVzdEludGVyY2VwdCwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIFJlcXVlc3RJbnRlcmNlcHQoKSB7XG4gICAgICB2YXIgbW9uaXRvclhIUixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgUmVxdWVzdEludGVyY2VwdC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIG1vbml0b3JYSFIgPSBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIF9vcGVuO1xuICAgICAgICBfb3BlbiA9IHJlcS5vcGVuO1xuICAgICAgICByZXR1cm4gcmVxLm9wZW4gPSBmdW5jdGlvbih0eXBlLCB1cmwsIGFzeW5jKSB7XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKHR5cGUpKSB7XG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9vcGVuLmFwcGx5KHJlcSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbihmbGFncykge1xuICAgICAgICB2YXIgcmVxO1xuICAgICAgICByZXEgPSBuZXcgX1hNTEh0dHBSZXF1ZXN0KGZsYWdzKTtcbiAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWE1MSHR0cFJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICBpZiAoX1hEb21haW5SZXF1ZXN0ICE9IG51bGwpIHtcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICByZXEgPSBuZXcgX1hEb21haW5SZXF1ZXN0O1xuICAgICAgICAgIG1vbml0b3JYSFIocmVxKTtcbiAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWERvbWFpblJlcXVlc3QsIF9YRG9tYWluUmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICAgIGlmICgoX1dlYlNvY2tldCAhPSBudWxsKSAmJiBvcHRpb25zLmFqYXgudHJhY2tXZWJTb2NrZXRzKSB7XG4gICAgICAgIHdpbmRvdy5XZWJTb2NrZXQgPSBmdW5jdGlvbih1cmwsIHByb3RvY29scykge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgaWYgKHByb3RvY29scyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwsIHByb3RvY29scyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzaG91bGRUcmFjaygnc29ja2V0JykpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6ICdzb2NrZXQnLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcHJvdG9jb2xzOiBwcm90b2NvbHMsXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5XZWJTb2NrZXQsIF9XZWJTb2NrZXQpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlcXVlc3RJbnRlcmNlcHQ7XG5cbiAgfSkoRXZlbnRzKTtcblxuICBfaW50ZXJjZXB0ID0gbnVsbDtcblxuICBnZXRJbnRlcmNlcHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoX2ludGVyY2VwdCA9PSBudWxsKSB7XG4gICAgICBfaW50ZXJjZXB0ID0gbmV3IFJlcXVlc3RJbnRlcmNlcHQ7XG4gICAgfVxuICAgIHJldHVybiBfaW50ZXJjZXB0O1xuICB9O1xuXG4gIHNob3VsZElnbm9yZVVSTCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBwYXR0ZXJuLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgIF9yZWYyID0gb3B0aW9ucy5hamF4Lmlnbm9yZVVSTHM7XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICBwYXR0ZXJuID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodXJsLmluZGV4T2YocGF0dGVybikgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QodXJsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKF9hcmcpIHtcbiAgICB2YXIgYWZ0ZXIsIGFyZ3MsIHJlcXVlc3QsIHR5cGUsIHVybDtcbiAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFQYWNlLnJ1bm5pbmcgJiYgKG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyICE9PSBmYWxzZSB8fCBzaG91bGRUcmFjayh0eXBlKSA9PT0gJ2ZvcmNlJykpIHtcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBhZnRlciA9IG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIGFmdGVyID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgYWZ0ZXIgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGlsbEFjdGl2ZSwgX2osIF9sZW4xLCBfcmVmMiwgX3JlZjMsIF9yZXN1bHRzO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9IHJlcXVlc3QucmVhZHlTdGF0ZSA8IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RpbGxBY3RpdmUgPSAoMCA8IChfcmVmMiA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgJiYgX3JlZjIgPCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RpbGxBY3RpdmUpIHtcbiAgICAgICAgICBQYWNlLnJlc3RhcnQoKTtcbiAgICAgICAgICBfcmVmMyA9IFBhY2Uuc291cmNlcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgc291cmNlID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFqYXhNb25pdG9yKSB7XG4gICAgICAgICAgICAgIHNvdXJjZS53YXRjaC5hcHBseShzb3VyY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LCBhZnRlcik7XG4gICAgfVxuICB9KTtcblxuICBBamF4TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBBamF4TW9uaXRvcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMud2F0Y2guYXBwbHkoX3RoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBBamF4TW9uaXRvci5wcm90b3R5cGUud2F0Y2ggPSBmdW5jdGlvbihfYXJnKSB7XG4gICAgICB2YXIgcmVxdWVzdCwgdHJhY2tlciwgdHlwZSwgdXJsO1xuICAgICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XG4gICAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja2VyID0gbmV3IFhIUlJlcXVlc3RUcmFja2VyKHJlcXVlc3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMucHVzaCh0cmFja2VyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEFqYXhNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgWEhSUmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBzaXplLCBfaiwgX2xlbjEsIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIGlmICh3aW5kb3cuUHJvZ3Jlc3NFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBudWxsO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5wcm9ncmVzcyArICgxMDAgLSBfdGhpcy5wcm9ncmVzcykgLyAyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBfcmVmMiA9IFsnbG9hZCcsICdhYm9ydCcsICd0aW1lb3V0JywgJ2Vycm9yJ107XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xuICAgICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYzO1xuICAgICAgICAgIGlmICgoX3JlZjMgPSByZXF1ZXN0LnJlYWR5U3RhdGUpID09PSAwIHx8IF9yZWYzID09PSA0KSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gMykge1xuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSA1MDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFhIUlJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgU29ja2V0UmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBfaiwgX2xlbjEsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIF9yZWYyID0gWydlcnJvcicsICdvcGVuJ107XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFNvY2tldFJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudE1vbml0b3Iob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGVjdG9yLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RvcnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdG9ycyA9IFtdO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSBvcHRpb25zLnNlbGVjdG9ycztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBzZWxlY3RvciA9IF9yZWYyW19qXTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKG5ldyBFbGVtZW50VHJhY2tlcihzZWxlY3RvcikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBFbGVtZW50TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIEVsZW1lbnRUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSB7XG4gICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuY2hlY2soKTtcbiAgICB9XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNoZWNrKCk7XG4gICAgICAgIH0pLCBvcHRpb25zLmVsZW1lbnRzLmNoZWNrSW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgfTtcblxuICAgIHJldHVybiBFbGVtZW50VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIERvY3VtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBEb2N1bWVudE1vbml0b3IucHJvdG90eXBlLnN0YXRlcyA9IHtcbiAgICAgIGxvYWRpbmc6IDAsXG4gICAgICBpbnRlcmFjdGl2ZTogNTAsXG4gICAgICBjb21wbGV0ZTogMTAwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIERvY3VtZW50TW9uaXRvcigpIHtcbiAgICAgIHZhciBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IChfcmVmMiA9IHRoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdKSAhPSBudWxsID8gX3JlZjIgOiAxMDA7XG4gICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0gIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9jdW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRMYWdNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50TGFnTW9uaXRvcigpIHtcbiAgICAgIHZhciBhdmcsIGludGVydmFsLCBsYXN0LCBwb2ludHMsIHNhbXBsZXMsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgYXZnID0gMDtcbiAgICAgIHNhbXBsZXMgPSBbXTtcbiAgICAgIHBvaW50cyA9IDA7XG4gICAgICBsYXN0ID0gbm93KCk7XG4gICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlmZjtcbiAgICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdCAtIDUwO1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHNhbXBsZXMucHVzaChkaWZmKTtcbiAgICAgICAgaWYgKHNhbXBsZXMubGVuZ3RoID4gb3B0aW9ucy5ldmVudExhZy5zYW1wbGVDb3VudCkge1xuICAgICAgICAgIHNhbXBsZXMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhdmcgPSBhdmdBbXBsaXR1ZGUoc2FtcGxlcyk7XG4gICAgICAgIGlmICgrK3BvaW50cyA+PSBvcHRpb25zLmV2ZW50TGFnLm1pblNhbXBsZXMgJiYgYXZnIDwgb3B0aW9ucy5ldmVudExhZy5sYWdUaHJlc2hvbGQpIHtcbiAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICByZXR1cm4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogKDMgLyAoYXZnICsgMykpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEV2ZW50TGFnTW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIFNjYWxlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTY2FsZXIoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMubGFzdCA9IHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgIHRoaXMucmF0ZSA9IG9wdGlvbnMuaW5pdGlhbFJhdGU7XG4gICAgICB0aGlzLmNhdGNodXAgPSAwO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMubGFzdFByb2dyZXNzID0gMDtcbiAgICAgIGlmICh0aGlzLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNjYWxlci5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKGZyYW1lVGltZSwgdmFsKSB7XG4gICAgICB2YXIgc2NhbGluZztcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICB2YWwgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+PSAxMDApIHtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPT09IHRoaXMubGFzdCkge1xuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSArPSBmcmFtZVRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zaW5jZUxhc3RVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLnJhdGUgPSAodmFsIC0gdGhpcy5sYXN0KSAvIHRoaXMuc2luY2VMYXN0VXBkYXRlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2F0Y2h1cCA9ICh2YWwgLSB0aGlzLnByb2dyZXNzKSAvIG9wdGlvbnMuY2F0Y2h1cFRpbWU7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgICAgdGhpcy5sYXN0ID0gdmFsO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+IHRoaXMucHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyArPSB0aGlzLmNhdGNodXAgKiBmcmFtZVRpbWU7XG4gICAgICB9XG4gICAgICBzY2FsaW5nID0gMSAtIE1hdGgucG93KHRoaXMucHJvZ3Jlc3MgLyAxMDAsIG9wdGlvbnMuZWFzZUZhY3Rvcik7XG4gICAgICB0aGlzLnByb2dyZXNzICs9IHNjYWxpbmcgKiB0aGlzLnJhdGUgKiBmcmFtZVRpbWU7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4odGhpcy5sYXN0UHJvZ3Jlc3MgKyBvcHRpb25zLm1heFByb2dyZXNzUGVyRnJhbWUsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWF4KDAsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLmxhc3RQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjYWxlcjtcblxuICB9KSgpO1xuXG4gIHNvdXJjZXMgPSBudWxsO1xuXG4gIHNjYWxlcnMgPSBudWxsO1xuXG4gIGJhciA9IG51bGw7XG5cbiAgdW5pU2NhbGVyID0gbnVsbDtcblxuICBhbmltYXRpb24gPSBudWxsO1xuXG4gIGNhbmNlbEFuaW1hdGlvbiA9IG51bGw7XG5cbiAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG5cbiAgaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9wdGlvbnMucmVzdGFydE9uUHVzaFN0YXRlKSB7XG4gICAgICByZXR1cm4gUGFjZS5yZXN0YXJ0KCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgIT0gbnVsbCkge1xuICAgIF9wdXNoU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcHVzaFN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAod2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlICE9IG51bGwpIHtcbiAgICBfcmVwbGFjZVN0YXRlID0gd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlO1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICByZXR1cm4gX3JlcGxhY2VTdGF0ZS5hcHBseSh3aW5kb3cuaGlzdG9yeSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgU09VUkNFX0tFWVMgPSB7XG4gICAgYWpheDogQWpheE1vbml0b3IsXG4gICAgZWxlbWVudHM6IEVsZW1lbnRNb25pdG9yLFxuICAgIGRvY3VtZW50OiBEb2N1bWVudE1vbml0b3IsXG4gICAgZXZlbnRMYWc6IEV2ZW50TGFnTW9uaXRvclxuICB9O1xuXG4gIChpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHR5cGUsIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgIFBhY2Uuc291cmNlcyA9IHNvdXJjZXMgPSBbXTtcbiAgICBfcmVmMiA9IFsnYWpheCcsICdlbGVtZW50cycsICdkb2N1bWVudCcsICdldmVudExhZyddO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgdHlwZSA9IF9yZWYyW19qXTtcbiAgICAgIGlmIChvcHRpb25zW3R5cGVdICE9PSBmYWxzZSkge1xuICAgICAgICBzb3VyY2VzLnB1c2gobmV3IFNPVVJDRV9LRVlTW3R5cGVdKG9wdGlvbnNbdHlwZV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3JlZjQgPSAoX3JlZjMgPSBvcHRpb25zLmV4dHJhU291cmNlcykgIT0gbnVsbCA/IF9yZWYzIDogW107XG4gICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjQubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICBzb3VyY2UgPSBfcmVmNFtfa107XG4gICAgICBzb3VyY2VzLnB1c2gobmV3IHNvdXJjZShvcHRpb25zKSk7XG4gICAgfVxuICAgIFBhY2UuYmFyID0gYmFyID0gbmV3IEJhcjtcbiAgICBzY2FsZXJzID0gW107XG4gICAgcmV0dXJuIHVuaVNjYWxlciA9IG5ldyBTY2FsZXI7XG4gIH0pKCk7XG5cbiAgUGFjZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdzdG9wJyk7XG4gICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgYmFyLmRlc3Ryb3koKTtcbiAgICBjYW5jZWxBbmltYXRpb24gPSB0cnVlO1xuICAgIGlmIChhbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgICBhbmltYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdCgpO1xuICB9O1xuXG4gIFBhY2UucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhY2UudHJpZ2dlcigncmVzdGFydCcpO1xuICAgIFBhY2Uuc3RvcCgpO1xuICAgIHJldHVybiBQYWNlLnN0YXJ0KCk7XG4gIH07XG5cbiAgUGFjZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFydDtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIGJhci5yZW5kZXIoKTtcbiAgICBzdGFydCA9IG5vdygpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHJldHVybiBhbmltYXRpb24gPSBydW5BbmltYXRpb24oZnVuY3Rpb24oZnJhbWVUaW1lLCBlbnF1ZXVlTmV4dEZyYW1lKSB7XG4gICAgICB2YXIgYXZnLCBjb3VudCwgZG9uZSwgZWxlbWVudCwgZWxlbWVudHMsIGksIGosIHJlbWFpbmluZywgc2NhbGVyLCBzY2FsZXJMaXN0LCBzdW0sIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMjtcbiAgICAgIHJlbWFpbmluZyA9IDEwMCAtIGJhci5wcm9ncmVzcztcbiAgICAgIGNvdW50ID0gc3VtID0gMDtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgZm9yIChpID0gX2ogPSAwLCBfbGVuMSA9IHNvdXJjZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBpID0gKytfaikge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgICAgICBzY2FsZXJMaXN0ID0gc2NhbGVyc1tpXSAhPSBudWxsID8gc2NhbGVyc1tpXSA6IHNjYWxlcnNbaV0gPSBbXTtcbiAgICAgICAgZWxlbWVudHMgPSAoX3JlZjIgPSBzb3VyY2UuZWxlbWVudHMpICE9IG51bGwgPyBfcmVmMiA6IFtzb3VyY2VdO1xuICAgICAgICBmb3IgKGogPSBfayA9IDAsIF9sZW4yID0gZWxlbWVudHMubGVuZ3RoOyBfayA8IF9sZW4yOyBqID0gKytfaykge1xuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tqXTtcbiAgICAgICAgICBzY2FsZXIgPSBzY2FsZXJMaXN0W2pdICE9IG51bGwgPyBzY2FsZXJMaXN0W2pdIDogc2NhbGVyTGlzdFtqXSA9IG5ldyBTY2FsZXIoZWxlbWVudCk7XG4gICAgICAgICAgZG9uZSAmPSBzY2FsZXIuZG9uZTtcbiAgICAgICAgICBpZiAoc2NhbGVyLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHN1bSArPSBzY2FsZXIudGljayhmcmFtZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdmcgPSBzdW0gLyBjb3VudDtcbiAgICAgIGJhci51cGRhdGUodW5pU2NhbGVyLnRpY2soZnJhbWVUaW1lLCBhdmcpKTtcbiAgICAgIGlmIChiYXIuZG9uZSgpIHx8IGRvbmUgfHwgY2FuY2VsQW5pbWF0aW9uKSB7XG4gICAgICAgIGJhci51cGRhdGUoMTAwKTtcbiAgICAgICAgUGFjZS50cmlnZ2VyKCdkb25lJyk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGJhci5maW5pc2goKTtcbiAgICAgICAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gUGFjZS50cmlnZ2VyKCdoaWRlJyk7XG4gICAgICAgIH0sIE1hdGgubWF4KG9wdGlvbnMuZ2hvc3RUaW1lLCBNYXRoLm1heChvcHRpb25zLm1pblRpbWUgLSAobm93KCkgLSBzdGFydCksIDApKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZW5xdWV1ZU5leHRGcmFtZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFBhY2Uuc3RhcnQgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICAgIGV4dGVuZChvcHRpb25zLCBfb3B0aW9ucyk7XG4gICAgUGFjZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgYmFyLnJlbmRlcigpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICB9XG4gICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFjZScpKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChQYWNlLnN0YXJ0LCA1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFBhY2UudHJpZ2dlcignc3RhcnQnKTtcbiAgICAgIHJldHVybiBQYWNlLmdvKCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydwYWNlJ10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhY2U7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQYWNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChvcHRpb25zLnN0YXJ0T25QYWdlTG9hZCkge1xuICAgICAgUGFjZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBjb25zdCBoYW5kbGVUb2dnbGUgPSAoZXZlbnQpID0+IHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciBwYXJlbnROb2RlID0gdGFyZ2V0LmNsb3Nlc3QoJy5mYXEtaXRlbScpO1xuXG4gICAgcGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG4gIH07XG5cbi8vIEFkZCBldmVudExpc3RlbmVycy5cbiAgdmFyIHRvZ2dsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZmFxLWl0ZW0tdG9nZ2xlJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2dnbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSB0b2dnbGVzW2ldO1xuXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZVRvZ2dsZSk7XG4gIH1cbn0pKCk7XG4iLCJqUXVlcnkoZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEZsZXh5IGhlYWRlclxuICBmbGV4eV9oZWFkZXIuaW5pdCgpO1xuXG4gIC8vIFNpZHJcbiAgJCgnLnNsaW5reS1tZW51JylcbiAgICAuZmluZCgndWwsIGxpLCBhJylcbiAgICAucmVtb3ZlQ2xhc3MoKTtcblxuICAkKCcuc2lkci10b2dnbGUtLXJpZ2h0Jykuc2lkcih7XG4gICAgbmFtZTogJ3NpZHItbWFpbicsXG4gICAgc2lkZTogJ3JpZ2h0JyxcbiAgICByZW5hbWluZzogZmFsc2UsXG4gICAgYm9keTogJy5sYXlvdXRfX3dyYXBwZXInLFxuICAgIHNvdXJjZTogJy5zaWRyLXNvdXJjZS1wcm92aWRlcidcbiAgfSk7XG5cbiAgLy8gRW5hYmxlIHRvb2x0aXBzLlxuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuXG4gIC8vIFRlc3RpbW9uaWFscy5cbiAgdmFyIHNsaWRlciA9IHRucyh7XG4gICAgY29udGFpbmVyOiAnLnRlc3RpbW9uaWFscyAudmlldy1jb250ZW50JyxcbiAgICBjZW50ZXI6IHRydWUsXG4gICAgaXRlbXM6IDIsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOiB0cnVlXG4gIH0pO1xufSk7XG4iXX0=
