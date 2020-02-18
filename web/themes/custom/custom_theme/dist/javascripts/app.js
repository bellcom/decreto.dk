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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {

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
  var testimonials = document.querySelectorAll('.testimonials .testimonial');
  var tallest = 0;

  // Loop through to find tallest element.
  [].concat(_toConsumableArray(testimonials)).forEach(function (testimonial) {
    var height = testimonial.offsetHeight;

    if (height > tallest) {
      tallest = height;
    }
  });

  // Apply tallest height to all testimonials.
  [].concat(_toConsumableArray(testimonials)).forEach(function (testimonial) {
    testimonial.style.minHeight = tallest + 'px';
  });
})();
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

  // Explainers.
  tns({
    container: '.explainers .view-content',
    center: true,
    items: 1,
    autoplay: true,
    autoplayHoverPause: true
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbnktc2xpZGVyLmpzIiwiYm9vdHN0cmFwLmpzIiwiZmxleHktaGVhZGVyLmpzIiwiZmxleHktbmF2aWdhdGlvbi5qcyIsImpxdWVyeS5zaWRyLmpzIiwianF1ZXJ5LnNsaW5reS5qcyIsInBhY2UuanMiLCJ0ZXN0aW1vbmlhbHMuanMiLCJmYXEtaXRlbXMuanMiLCJwYWNrYWdlLWNob29zZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOlsidG5zIiwiT2JqZWN0Iiwia2V5cyIsIm9iamVjdCIsIm5hbWUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJwdXNoIiwiRWxlbWVudCIsInJlbW92ZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIndpbiIsIndpbmRvdyIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2IiLCJzZXRUaW1lb3V0Iiwid2luJDEiLCJjYWYiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaWQiLCJjbGVhclRpbWVvdXQiLCJleHRlbmQiLCJvYmoiLCJjb3B5IiwidGFyZ2V0IiwiYXJndW1lbnRzIiwiaSIsImxlbmd0aCIsInVuZGVmaW5lZCIsImNoZWNrU3RvcmFnZVZhbHVlIiwidmFsdWUiLCJpbmRleE9mIiwiSlNPTiIsInBhcnNlIiwic2V0TG9jYWxTdG9yYWdlIiwic3RvcmFnZSIsImtleSIsImFjY2VzcyIsInNldEl0ZW0iLCJlIiwiZ2V0U2xpZGVJZCIsInRuc0lkIiwiZ2V0Qm9keSIsImRvYyIsImRvY3VtZW50IiwiYm9keSIsImNyZWF0ZUVsZW1lbnQiLCJmYWtlIiwiZG9jRWxlbWVudCIsImRvY3VtZW50RWxlbWVudCIsInNldEZha2VCb2R5IiwiZG9jT3ZlcmZsb3ciLCJzdHlsZSIsIm92ZXJmbG93IiwiYmFja2dyb3VuZCIsImFwcGVuZENoaWxkIiwicmVzZXRGYWtlQm9keSIsIm9mZnNldEhlaWdodCIsImNhbGMiLCJkaXYiLCJyZXN1bHQiLCJzdHIiLCJ2YWxzIiwidmFsIiwid2lkdGgiLCJvZmZzZXRXaWR0aCIsInJlcGxhY2UiLCJwZXJjZW50YWdlTGF5b3V0Iiwid3JhcHBlciIsIm91dGVyIiwiY291bnQiLCJwZXJQYWdlIiwic3VwcG9ydGVkIiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiTWF0aCIsImFicyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJjaGlsZHJlbiIsIm1lZGlhcXVlcnlTdXBwb3J0IiwicnVsZSIsInBvc2l0aW9uIiwidHlwZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwiY3JlYXRlU3R5bGVTaGVldCIsIm1lZGlhIiwic2V0QXR0cmlidXRlIiwicXVlcnlTZWxlY3RvciIsInNoZWV0IiwiYWRkQ1NTUnVsZSIsInNlbGVjdG9yIiwicnVsZXMiLCJpbmRleCIsImluc2VydFJ1bGUiLCJhZGRSdWxlIiwicmVtb3ZlQ1NTUnVsZSIsImRlbGV0ZVJ1bGUiLCJyZW1vdmVSdWxlIiwiZ2V0Q3NzUnVsZXNMZW5ndGgiLCJjc3NSdWxlcyIsInRvRGVncmVlIiwieSIsIngiLCJhdGFuMiIsIlBJIiwiZ2V0VG91Y2hEaXJlY3Rpb24iLCJhbmdsZSIsInJhbmdlIiwiZGlyZWN0aW9uIiwiZ2FwIiwiZm9yRWFjaCIsImFyciIsImNhbGxiYWNrIiwic2NvcGUiLCJsIiwiY2xhc3NMaXN0U3VwcG9ydCIsImhhc0NsYXNzIiwiZWwiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZENsYXNzIiwiYWRkIiwicmVtb3ZlQ2xhc3MiLCJoYXNBdHRyIiwiYXR0ciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJpc05vZGVMaXN0IiwiaXRlbSIsInNldEF0dHJzIiwiZWxzIiwiYXR0cnMiLCJBcnJheSIsInRvU3RyaW5nIiwicmVtb3ZlQXR0cnMiLCJhdHRyTGVuZ3RoIiwiaiIsInJlbW92ZUF0dHJpYnV0ZSIsImFycmF5RnJvbU5vZGVMaXN0IiwibmwiLCJoaWRlRWxlbWVudCIsImZvcmNlSGlkZSIsImRpc3BsYXkiLCJzaG93RWxlbWVudCIsImlzVmlzaWJsZSIsIndoaWNoUHJvcGVydHkiLCJwcm9wcyIsIlByb3BzIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJwcmVmaXhlcyIsInByZWZpeCIsImxlbiIsInByb3AiLCJoYXMzRFRyYW5zZm9ybXMiLCJ0ZiIsImhhczNkIiwiY3NzVEYiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiaW5zZXJ0QmVmb3JlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImdldEVuZFByb3BlcnR5IiwicHJvcEluIiwicHJvcE91dCIsImVuZFByb3AiLCJ0ZXN0Iiwic3VwcG9ydHNQYXNzaXZlIiwib3B0cyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmVPcHRpb24iLCJwYXNzaXZlIiwiYWRkRXZlbnRzIiwicHJldmVudFNjcm9sbGluZyIsIm9wdGlvbiIsInJlbW92ZUV2ZW50cyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJ0b3BpY3MiLCJvbiIsImV2ZW50TmFtZSIsImZuIiwib2ZmIiwic3BsaWNlIiwiZW1pdCIsImRhdGEiLCJqc1RyYW5zZm9ybSIsImVsZW1lbnQiLCJwb3N0Zml4IiwidG8iLCJkdXJhdGlvbiIsInRpY2siLCJtaW4iLCJ1bml0IiwiZnJvbSIsIk51bWJlciIsInBvc2l0aW9uVGljayIsInJ1bm5pbmciLCJtb3ZlRWxlbWVudCIsIm9wdGlvbnMiLCJjb250YWluZXIiLCJtb2RlIiwiYXhpcyIsIml0ZW1zIiwiZ3V0dGVyIiwiZWRnZVBhZGRpbmciLCJmaXhlZFdpZHRoIiwiYXV0b1dpZHRoIiwidmlld3BvcnRNYXgiLCJzbGlkZUJ5IiwiY2VudGVyIiwiY29udHJvbHMiLCJjb250cm9sc1Bvc2l0aW9uIiwiY29udHJvbHNUZXh0IiwiY29udHJvbHNDb250YWluZXIiLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsIm5hdiIsIm5hdlBvc2l0aW9uIiwibmF2Q29udGFpbmVyIiwibmF2QXNUaHVtYm5haWxzIiwiYXJyb3dLZXlzIiwic3BlZWQiLCJhdXRvcGxheSIsImF1dG9wbGF5UG9zaXRpb24iLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheURpcmVjdGlvbiIsImF1dG9wbGF5VGV4dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsImF1dG9wbGF5QnV0dG9uIiwiYXV0b3BsYXlCdXR0b25PdXRwdXQiLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5IiwiYW5pbWF0ZUluIiwiYW5pbWF0ZU91dCIsImFuaW1hdGVOb3JtYWwiLCJhbmltYXRlRGVsYXkiLCJsb29wIiwicmV3aW5kIiwiYXV0b0hlaWdodCIsInJlc3BvbnNpdmUiLCJsYXp5bG9hZCIsImxhenlsb2FkU2VsZWN0b3IiLCJ0b3VjaCIsIm1vdXNlRHJhZyIsInN3aXBlQW5nbGUiLCJuZXN0ZWQiLCJwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmciLCJwcmV2ZW50U2Nyb2xsT25Ub3VjaCIsImZyZWV6YWJsZSIsIm9uSW5pdCIsInVzZUxvY2FsU3RvcmFnZSIsIktFWVMiLCJFTlRFUiIsIlNQQUNFIiwiTEVGVCIsIlJJR0hUIiwidG5zU3RvcmFnZSIsImxvY2FsU3RvcmFnZUFjY2VzcyIsImJyb3dzZXJJbmZvIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidWlkIiwiRGF0ZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiQ0FMQyIsIlBFUkNFTlRBR0VMQVlPVVQiLCJDU1NNUSIsIlRSQU5TRk9STSIsIkhBUzNEVFJBTlNGT1JNUyIsIlRSQU5TSVRJT05EVVJBVElPTiIsIlRSQU5TSVRJT05ERUxBWSIsIkFOSU1BVElPTkRVUkFUSU9OIiwiQU5JTUFUSU9OREVMQVkiLCJUUkFOU0lUSU9ORU5EIiwiQU5JTUFUSU9ORU5EIiwic3VwcG9ydENvbnNvbGVXYXJuIiwiY29uc29sZSIsIndhcm4iLCJ0bnNMaXN0Iiwib3B0aW9uc0VsZW1lbnRzIiwibm9kZU5hbWUiLCJjYXJvdXNlbCIsInJlc3BvbnNpdmVUZW0iLCJ1cGRhdGVPcHRpb25zIiwiaG9yaXpvbnRhbCIsIm91dGVyV3JhcHBlciIsImlubmVyV3JhcHBlciIsIm1pZGRsZVdyYXBwZXIiLCJjb250YWluZXJQYXJlbnQiLCJjb250YWluZXJIVE1MIiwib3V0ZXJIVE1MIiwic2xpZGVJdGVtcyIsInNsaWRlQ291bnQiLCJicmVha3BvaW50Wm9uZSIsIndpbmRvd1dpZHRoIiwiZ2V0V2luZG93V2lkdGgiLCJpc09uIiwic2V0QnJlYWtwb2ludFpvbmUiLCJnZXRPcHRpb24iLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0V2lkdGgiLCJmbG9vciIsImZpeGVkV2lkdGhWaWV3cG9ydFdpZHRoIiwic2xpZGVQb3NpdGlvbnMiLCJzbGlkZUl0ZW1zT3V0IiwiY2xvbmVDb3VudCIsImdldENsb25lQ291bnRGb3JMb29wIiwic2xpZGVDb3VudE5ldyIsImhhc1JpZ2h0RGVhZFpvbmUiLCJyaWdodEJvdW5kYXJ5IiwiZ2V0UmlnaHRCb3VuZGFyeSIsInVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtIiwidHJhbnNmb3JtQXR0ciIsInRyYW5zZm9ybVByZWZpeCIsInRyYW5zZm9ybVBvc3RmaXgiLCJnZXRJbmRleE1heCIsImNlaWwiLCJtYXgiLCJnZXRTdGFydEluZGV4IiwiaW5kZXhDYWNoZWQiLCJkaXNwbGF5SW5kZXgiLCJnZXRDdXJyZW50U2xpZGUiLCJpbmRleE1pbiIsImluZGV4TWF4IiwicmVzaXplVGltZXIiLCJtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQiLCJldmVudHMiLCJuZXdDb250YWluZXJDbGFzc2VzIiwic2xpZGVJZCIsImRpc2FibGUiLCJkaXNhYmxlZCIsImZyZWV6ZSIsImdldEZyZWV6ZSIsImZyb3plbiIsImNvbnRyb2xzRXZlbnRzIiwib25Db250cm9sc0NsaWNrIiwib25Db250cm9sc0tleWRvd24iLCJuYXZFdmVudHMiLCJvbk5hdkNsaWNrIiwib25OYXZLZXlkb3duIiwiaG92ZXJFdmVudHMiLCJtb3VzZW92ZXJQYXVzZSIsIm1vdXNlb3V0UmVzdGFydCIsInZpc2liaWxpdHlFdmVudCIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsImRvY21lbnRLZXlkb3duRXZlbnQiLCJvbkRvY3VtZW50S2V5ZG93biIsInRvdWNoRXZlbnRzIiwib25QYW5TdGFydCIsIm9uUGFuTW92ZSIsIm9uUGFuRW5kIiwiZHJhZ0V2ZW50cyIsImhhc0NvbnRyb2xzIiwiaGFzT3B0aW9uIiwiaGFzTmF2IiwiaGFzQXV0b3BsYXkiLCJoYXNUb3VjaCIsImhhc01vdXNlRHJhZyIsInNsaWRlQWN0aXZlQ2xhc3MiLCJpbWdDb21wbGV0ZUNsYXNzIiwiaW1nRXZlbnRzIiwib25JbWdMb2FkZWQiLCJvbkltZ0ZhaWxlZCIsImltZ3NDb21wbGV0ZSIsImxpdmVyZWdpb25DdXJyZW50IiwicHJldmVudFNjcm9sbCIsImNvbnRyb2xzQ29udGFpbmVySFRNTCIsInByZXZCdXR0b25IVE1MIiwibmV4dEJ1dHRvbkhUTUwiLCJwcmV2SXNCdXR0b24iLCJuZXh0SXNCdXR0b24iLCJuYXZDb250YWluZXJIVE1MIiwibmF2SXRlbXMiLCJwYWdlcyIsImdldFBhZ2VzIiwicGFnZXNDYWNoZWQiLCJuYXZDbGlja2VkIiwibmF2Q3VycmVudEluZGV4IiwiZ2V0Q3VycmVudE5hdkluZGV4IiwibmF2Q3VycmVudEluZGV4Q2FjaGVkIiwibmF2QWN0aXZlQ2xhc3MiLCJuYXZTdHIiLCJuYXZTdHJDdXJyZW50IiwiYXV0b3BsYXlCdXR0b25IVE1MIiwiYXV0b3BsYXlIdG1sU3RyaW5ncyIsImF1dG9wbGF5VGltZXIiLCJhbmltYXRpbmciLCJhdXRvcGxheUhvdmVyUGF1c2VkIiwiYXV0b3BsYXlVc2VyUGF1c2VkIiwiYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkIiwiaW5pdFBvc2l0aW9uIiwibGFzdFBvc2l0aW9uIiwidHJhbnNsYXRlSW5pdCIsImRpc1giLCJkaXNZIiwicGFuU3RhcnQiLCJyYWZJbmRleCIsImdldERpc3QiLCJhIiwiYiIsInJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZSIsImluaXRTdHJ1Y3R1cmUiLCJpbml0U2hlZXQiLCJpbml0U2xpZGVyVHJhbnNmb3JtIiwiY29uZGl0aW9uIiwidGVtIiwiaW5kIiwiZ2V0QWJzSW5kZXgiLCJhYnNJbmRleCIsImdldEl0ZW1zTWF4IiwiYnAiLCJhcHBseSIsIml0ZW1zTWF4IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiZ2V0SW5zZXJ0UG9zaXRpb24iLCJwb3MiLCJnZXRDbGllbnRXaWR0aCIsInJlY3QiLCJyaWdodCIsInd3IiwicGFyc2VJbnQiLCJnZXRTbGlkZU1hcmdpbkxlZnQiLCJnZXRJbm5lcldyYXBwZXJTdHlsZXMiLCJlZGdlUGFkZGluZ1RlbSIsImd1dHRlclRlbSIsImZpeGVkV2lkdGhUZW0iLCJzcGVlZFRlbSIsImF1dG9IZWlnaHRCUCIsImd1dHRlclRlbVVuaXQiLCJkaXIiLCJnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZSIsImdldENvbnRhaW5lcldpZHRoIiwiaXRlbXNUZW0iLCJnZXRTbGlkZVdpZHRoU3R5bGUiLCJkaXZpZGVuZCIsImdldFNsaWRlR3V0dGVyU3R5bGUiLCJnZXRDU1NQcmVmaXgiLCJudW0iLCJzdWJzdHJpbmciLCJnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlIiwiY2xhc3NPdXRlciIsImNsYXNzSW5uZXIiLCJoYXNHdXR0ZXIiLCJ3cCIsImZyYWdtZW50QmVmb3JlIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImZyYWdtZW50QWZ0ZXIiLCJjbG9uZUZpcnN0IiwiY2xvbmVOb2RlIiwiZmlyc3RDaGlsZCIsImNsb25lTGFzdCIsImltZ3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW1nIiwic3JjIiwiaW1nTG9hZGVkIiwiaW1nc0xvYWRlZENoZWNrIiwiZ2V0SW1hZ2VBcnJheSIsImluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrIiwiZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQiLCJpbml0VG9vbHMiLCJpbml0RXZlbnRzIiwic3R5bGVzQXBwbGljYXRpb25DaGVjayIsInRvRml4ZWQiLCJpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSIsInNldFNsaWRlUG9zaXRpb25zIiwidXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQiLCJmb250U2l6ZSIsInNsaWRlIiwibWFyZ2luTGVmdCIsInVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uIiwibWlkZGxlV3JhcHBlclN0ciIsImlubmVyV3JhcHBlclN0ciIsImNvbnRhaW5lclN0ciIsInNsaWRlU3RyIiwiaXRlbXNCUCIsImZpeGVkV2lkdGhCUCIsInNwZWVkQlAiLCJlZGdlUGFkZGluZ0JQIiwiZ3V0dGVyQlAiLCJ1cGRhdGVTbGlkZVN0YXR1cyIsImluc2VydEFkamFjZW50SFRNTCIsImdldExpdmVSZWdpb25TdHIiLCJ0eHQiLCJ0b2dnbGVBdXRvcGxheSIsInN0YXJ0QXV0b3BsYXkiLCJpbml0SW5kZXgiLCJuYXZIdG1sIiwiaGlkZGVuU3RyIiwidXBkYXRlTmF2VmlzaWJpbGl0eSIsImlzQnV0dG9uIiwidXBkYXRlQ29udHJvbHNTdGF0dXMiLCJkaXNhYmxlVUkiLCJldmUiLCJvblRyYW5zaXRpb25FbmQiLCJyZXNpemVUYXNrcyIsImluZm8iLCJvblJlc2l6ZSIsImRvQXV0b0hlaWdodCIsImRvTGF6eUxvYWQiLCJkaXNhYmxlU2xpZGVyIiwiZnJlZXplU2xpZGVyIiwiYWRkaXRpb25hbFVwZGF0ZXMiLCJkZXN0cm95Iiwib3duZXJOb2RlIiwiY2xlYXJJbnRlcnZhbCIsImh0bWxMaXN0IiwicHJldkVsIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInBhcmVudEVsIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJnZXRFdmVudCIsImJwQ2hhbmdlZCIsImJyZWFrcG9pbnRab25lVGVtIiwibmVlZENvbnRhaW5lclRyYW5zZm9ybSIsImluZENoYW5nZWQiLCJpdGVtc0NoYW5nZWQiLCJkaXNhYmxlVGVtIiwiZnJlZXplVGVtIiwiYXJyb3dLZXlzVGVtIiwiY29udHJvbHNUZW0iLCJuYXZUZW0iLCJ0b3VjaFRlbSIsIm1vdXNlRHJhZ1RlbSIsImF1dG9wbGF5VGVtIiwiYXV0b3BsYXlIb3ZlclBhdXNlVGVtIiwiYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSIsImluZGV4VGVtIiwiYXV0b0hlaWdodFRlbSIsImNvbnRyb2xzVGV4dFRlbSIsImNlbnRlclRlbSIsImF1dG9wbGF5VGV4dFRlbSIsInVwZGF0ZUluZGV4IiwiZW5hYmxlU2xpZGVyIiwiZG9Db250YWluZXJUcmFuc2Zvcm0iLCJnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSIsInVuZnJlZXplU2xpZGVyIiwic3RvcEF1dG9wbGF5IiwiaGVpZ2h0IiwiaHRtbCIsInVwZGF0ZUxpdmVSZWdpb24iLCJ1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMiLCJhdXRvaGVpZ2h0VGVtIiwidnAiLCJsZWZ0RWRnZSIsInJpZ2h0RWRnZSIsImVuYWJsZVVJIiwibWFyZ2luIiwiY2xhc3NOIiwiZ2V0VmlzaWJsZVNsaWRlUmFuZ2UiLCJzdGFydCIsImVuZCIsInJhbmdlc3RhcnQiLCJyYW5nZWVuZCIsInBhcnNlRmxvYXQiLCJwb2ludCIsImNlbGwiLCJzdG9wUHJvcGFnYXRpb24iLCJzcmNzZXQiLCJnZXRUYXJnZXQiLCJpbWdGYWlsZWQiLCJpbWdDb21wbGV0ZWQiLCJ1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQiLCJ1cGRhdGVOYXZTdGF0dXMiLCJnZXRNYXhTbGlkZUhlaWdodCIsInNsaWRlU3RhcnQiLCJzbGlkZVJhbmdlIiwiaGVpZ2h0cyIsIm1heEhlaWdodCIsImF0dHIyIiwiYmFzZSIsIm5hdlByZXYiLCJuYXZDdXJyZW50IiwiZ2V0TG93ZXJDYXNlTm9kZU5hbWUiLCJpc0FyaWFEaXNhYmxlZCIsImRpc0VuYWJsZUVsZW1lbnQiLCJwcmV2RGlzYWJsZWQiLCJuZXh0RGlzYWJsZWQiLCJkaXNhYmxlUHJldiIsImRpc2FibGVOZXh0IiwicmVzZXREdXJhdGlvbiIsImdldFNsaWRlcldpZHRoIiwiZ2V0Q2VudGVyR2FwIiwiZGVub21pbmF0b3IiLCJhbmltYXRlU2xpZGUiLCJudW1iZXIiLCJjbGFzc091dCIsImNsYXNzSW4iLCJpc091dCIsInRyYW5zZm9ybUNvcmUiLCJyZW5kZXIiLCJzbGlkZXJNb3ZlZCIsInN0clRyYW5zIiwiZXZlbnQiLCJwcm9wZXJ0eU5hbWUiLCJnb1RvIiwidGFyZ2V0SW5kZXgiLCJpbmRleEdhcCIsImlzTmFOIiwiZmFjdG9yIiwicGFzc0V2ZW50T2JqZWN0IiwidGFyZ2V0SW4iLCJuYXZJbmRleCIsInRhcmdldEluZGV4QmFzZSIsInNldEF1dG9wbGF5VGltZXIiLCJzZXRJbnRlcnZhbCIsInN0b3BBdXRvcGxheVRpbWVyIiwidXBkYXRlQXV0b3BsYXlCdXR0b24iLCJhY3Rpb24iLCJwbGF5IiwicGF1c2UiLCJoaWRkZW4iLCJrZXlJbmRleCIsImtleUNvZGUiLCJzZXRGb2N1cyIsImZvY3VzIiwiY3VyRWxlbWVudCIsImFjdGl2ZUVsZW1lbnQiLCJpc1RvdWNoRXZlbnQiLCJjaGFuZ2VkVG91Y2hlcyIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsIiQiLCJjbGllbnRYIiwiY2xpZW50WSIsInBhblVwZGF0ZSIsImVyciIsImRpc3QiLCJwZXJjZW50YWdlWCIsInByZXZlbnRDbGljayIsImluZGV4TW92ZWQiLCJtb3ZlZCIsInJvdWdoIiwidmVyc2lvbiIsImdldEluZm8iLCJ1cGRhdGVTbGlkZXJIZWlnaHQiLCJyZWZyZXNoIiwicmVidWlsZCIsImpRdWVyeSIsIkVycm9yIiwianF1ZXJ5Iiwic3BsaXQiLCJ0cmFuc2l0aW9uRW5kIiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImNhbGxlZCIsIiRlbCIsIm9uZSIsInRyaWdnZXIiLCJzdXBwb3J0Iiwic3BlY2lhbCIsImJzVHJhbnNpdGlvbkVuZCIsImJpbmRUeXBlIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiZGlzbWlzcyIsIkFsZXJ0IiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsIiR0aGlzIiwiJHBhcmVudCIsImZpbmQiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVFbGVtZW50IiwiZGV0YWNoIiwiUGx1Z2luIiwiZWFjaCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiJGVsZW1lbnQiLCJERUZBVUxUUyIsImlzTG9hZGluZyIsImxvYWRpbmdUZXh0Iiwic2V0U3RhdGUiLCJzdGF0ZSIsImQiLCJyZXNldFRleHQiLCJwcm94eSIsInJlbW92ZUF0dHIiLCJ0b2dnbGUiLCJjaGFuZ2VkIiwiJGlucHV0IiwidG9nZ2xlQ2xhc3MiLCJidXR0b24iLCIkYnRuIiwiZmlyc3QiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2VkIiwic2xpZGluZyIsImludGVydmFsIiwiJGFjdGl2ZSIsIiRpdGVtcyIsImtleWJvYXJkIiwia2V5ZG93biIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiZ2V0SXRlbUluZGV4IiwicGFyZW50IiwiZ2V0SXRlbUZvckRpcmVjdGlvbiIsImFjdGl2ZSIsImFjdGl2ZUluZGV4Iiwid2lsbFdyYXAiLCJkZWx0YSIsIml0ZW1JbmRleCIsImVxIiwidGhhdCIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsImpvaW4iLCJjbGlja0hhbmRsZXIiLCJocmVmIiwiJHRhcmdldCIsInNsaWRlSW5kZXgiLCIkY2Fyb3VzZWwiLCJDb2xsYXBzZSIsIiR0cmlnZ2VyIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwiZ2V0VGFyZ2V0RnJvbVRyaWdnZXIiLCJpc09wZW4iLCJjb2xsYXBzZSIsImJhY2tkcm9wIiwiRHJvcGRvd24iLCJjbGVhck1lbnVzIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCIkZGlhbG9nIiwiJGJhY2tkcm9wIiwiaXNTaG93biIsIm9yaWdpbmFsQm9keVBhZCIsInNjcm9sbGJhcldpZHRoIiwiaWdub3JlQmFja2Ryb3BDbGljayIsImZpeGVkQ29udGVudCIsInJlbW90ZSIsImxvYWQiLCJCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiX3JlbGF0ZWRUYXJnZXQiLCJjaGVja1Njcm9sbGJhciIsInNldFNjcm9sbGJhciIsImVzY2FwZSIsInJlc2l6ZSIsImFwcGVuZFRvIiwic2Nyb2xsVG9wIiwiYWRqdXN0RGlhbG9nIiwiZW5mb3JjZUZvY3VzIiwiaGlkZU1vZGFsIiwiaGFzIiwiaGFuZGxlVXBkYXRlIiwicmVzZXRBZGp1c3RtZW50cyIsInJlc2V0U2Nyb2xsYmFyIiwicmVtb3ZlQmFja2Ryb3AiLCJhbmltYXRlIiwiZG9BbmltYXRlIiwiY3VycmVudFRhcmdldCIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImRvY3VtZW50RWxlbWVudFJlY3QiLCJtZWFzdXJlU2Nyb2xsYmFyIiwiYm9keVBhZCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhZGRpbmciLCJyZW1vdmVEYXRhIiwic2Nyb2xsRGl2IiwiYXBwZW5kIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYXJlYSIsImJyIiwiY29sIiwiY29kZSIsImVtIiwiaHIiLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJsaSIsIm9sIiwicCIsInByZSIsInMiLCJzbWFsbCIsInNwYW4iLCJzdWIiLCJzdXAiLCJzdHJvbmciLCJ1IiwidWwiLCJTQUZFX1VSTF9QQVRURVJOIiwiREFUQV9VUkxfUEFUVEVSTiIsImFsbG93ZWRBdHRyaWJ1dGUiLCJhbGxvd2VkQXR0cmlidXRlTGlzdCIsImF0dHJOYW1lIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsIlJlZ0V4cCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJlbE5hbWUiLCJhdHRyaWJ1dGVMaXN0IiwiYXR0cmlidXRlcyIsIndoaXRlbGlzdGVkQXR0cmlidXRlcyIsImNvbmNhdCIsImxlbjIiLCJUb29sdGlwIiwiZW5hYmxlZCIsInRpbWVvdXQiLCJob3ZlclN0YXRlIiwiaW5TdGF0ZSIsImluaXQiLCJhbmltYXRpb24iLCJwbGFjZW1lbnQiLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJzYW5pdGl6ZSIsImdldE9wdGlvbnMiLCIkdmlld3BvcnQiLCJpc0Z1bmN0aW9uIiwiY2xpY2siLCJob3ZlciIsImNvbnN0cnVjdG9yIiwidHJpZ2dlcnMiLCJldmVudEluIiwiZXZlbnRPdXQiLCJlbnRlciIsImxlYXZlIiwiX29wdGlvbnMiLCJmaXhUaXRsZSIsImdldERlZmF1bHRzIiwiZGF0YUF0dHJpYnV0ZXMiLCJkYXRhQXR0ciIsImdldERlbGVnYXRlT3B0aW9ucyIsImRlZmF1bHRzIiwic2VsZiIsInRpcCIsImlzSW5TdGF0ZVRydWUiLCJoYXNDb250ZW50IiwiaW5Eb20iLCJvd25lckRvY3VtZW50IiwiJHRpcCIsInRpcElkIiwiZ2V0VUlEIiwic2V0Q29udGVudCIsImF1dG9Ub2tlbiIsImF1dG9QbGFjZSIsInRvcCIsImdldFBvc2l0aW9uIiwiYWN0dWFsV2lkdGgiLCJhY3R1YWxIZWlnaHQiLCJvcmdQbGFjZW1lbnQiLCJ2aWV3cG9ydERpbSIsImJvdHRvbSIsImNhbGN1bGF0ZWRPZmZzZXQiLCJnZXRDYWxjdWxhdGVkT2Zmc2V0IiwiYXBwbHlQbGFjZW1lbnQiLCJwcmV2SG92ZXJTdGF0ZSIsIm9mZnNldCIsIm1hcmdpblRvcCIsInNldE9mZnNldCIsInVzaW5nIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwidG9nZ2xlRW5hYmxlZCIsInRvb2x0aXAiLCJQb3BvdmVyIiwiY29udGVudCIsImdldENvbnRlbnQiLCJ0eXBlQ29udGVudCIsInBvcG92ZXIiLCJTY3JvbGxTcHkiLCIkc2Nyb2xsRWxlbWVudCIsIm9mZnNldHMiLCJ0YXJnZXRzIiwiYWN0aXZlVGFyZ2V0IiwicHJvY2VzcyIsImdldFNjcm9sbEhlaWdodCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsIm1heFNjcm9sbCIsImFjdGl2YXRlIiwiY2xlYXIiLCJwYXJlbnRzIiwicGFyZW50c1VudGlsIiwic2Nyb2xsc3B5IiwiJHNweSIsIlRhYiIsIiR1bCIsIiRwcmV2aW91cyIsImhpZGVFdmVudCIsInRhYiIsIkFmZml4IiwiY2hlY2tQb3NpdGlvbiIsImNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wIiwiYWZmaXhlZCIsInVucGluIiwicGlubmVkT2Zmc2V0IiwiUkVTRVQiLCJnZXRTdGF0ZSIsIm9mZnNldFRvcCIsIm9mZnNldEJvdHRvbSIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiZmxleHlfbmF2aWdhdGlvbiIsImxheW91dF9jbGFzc2VzIiwidXBncmFkZSIsIiRuYXZpZ2F0aW9ucyIsIm5hdmlnYXRpb24iLCIkbmF2aWdhdGlvbiIsIiRtZWdhbWVudXMiLCJkcm9wZG93bl9tZWdhbWVudSIsIiRkcm9wZG93bl9tZWdhbWVudSIsImRyb3Bkb3duX2hhc19tZWdhbWVudSIsImlzX3VwZ3JhZGVkIiwibmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUiLCIkbWVnYW1lbnUiLCJoYXNfb2JmdXNjYXRvciIsIm9iZnVzY2F0b3IiLCJiYWJlbEhlbHBlcnMiLCJjbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInNpZHJTdGF0dXMiLCJtb3ZpbmciLCJvcGVuZWQiLCJoZWxwZXIiLCJpc1VybCIsInBhdHRlcm4iLCJhZGRQcmVmaXhlcyIsImFkZFByZWZpeCIsImF0dHJpYnV0ZSIsInRvUmVwbGFjZSIsInRyYW5zaXRpb25zIiwicHJvcGVydHkiLCIkJDIiLCJib2R5QW5pbWF0aW9uQ2xhc3MiLCJvcGVuQWN0aW9uIiwiY2xvc2VBY3Rpb24iLCJ0cmFuc2l0aW9uRW5kRXZlbnQiLCJNZW51Iiwib3BlbkNsYXNzIiwibWVudVdpZHRoIiwib3V0ZXJXaWR0aCIsInNpZGUiLCJkaXNwbGFjZSIsInRpbWluZyIsIm1ldGhvZCIsIm9uT3BlbkNhbGxiYWNrIiwib25DbG9zZUNhbGxiYWNrIiwib25PcGVuRW5kQ2FsbGJhY2siLCJvbkNsb3NlRW5kQ2FsbGJhY2siLCJnZXRBbmltYXRpb24iLCJwcmVwYXJlQm9keSIsIiRodG1sIiwib3BlbkJvZHkiLCJib2R5QW5pbWF0aW9uIiwicXVldWUiLCJvbkNsb3NlQm9keSIsInJlc2V0U3R5bGVzIiwidW5iaW5kIiwiY2xvc2VCb2R5IiwiX3RoaXMiLCJtb3ZlQm9keSIsIm9uT3Blbk1lbnUiLCJvcGVuTWVudSIsIl90aGlzMiIsIiRpdGVtIiwibWVudUFuaW1hdGlvbiIsIm9uQ2xvc2VNZW51IiwiY2xvc2VNZW51IiwiX3RoaXMzIiwibW92ZU1lbnUiLCJtb3ZlIiwib3BlbiIsIl90aGlzNCIsImFscmVhZHlPcGVuZWRNZW51IiwiJCQxIiwiZXhlY3V0ZSIsInNpZHIiLCJlcnJvciIsInB1YmxpY01ldGhvZHMiLCJtZXRob2ROYW1lIiwibWV0aG9kcyIsImdldE1ldGhvZCIsIiQkMyIsImZpbGxDb250ZW50IiwiJHNpZGVNZW51Iiwic2V0dGluZ3MiLCJzb3VyY2UiLCJuZXdDb250ZW50IiwiaHRtbENvbnRlbnQiLCJzZWxlY3RvcnMiLCJyZW5hbWluZyIsIiRodG1sQ29udGVudCIsImZuU2lkciIsImJpbmQiLCJvbk9wZW4iLCJvbkNsb3NlIiwib25PcGVuRW5kIiwib25DbG9zZUVuZCIsImZsYWciLCJ0Iiwic2xpbmt5IiwibGFiZWwiLCJuIiwiciIsInByZXBlbmQiLCJub3ciLCJqdW1wIiwiaG9tZSIsImMiLCJBamF4TW9uaXRvciIsIkJhciIsIkRvY3VtZW50TW9uaXRvciIsIkVsZW1lbnRNb25pdG9yIiwiRWxlbWVudFRyYWNrZXIiLCJFdmVudExhZ01vbml0b3IiLCJFdmVudGVkIiwiTm9UYXJnZXRFcnJvciIsIlBhY2UiLCJSZXF1ZXN0SW50ZXJjZXB0IiwiU09VUkNFX0tFWVMiLCJTY2FsZXIiLCJTb2NrZXRSZXF1ZXN0VHJhY2tlciIsIlhIUlJlcXVlc3RUcmFja2VyIiwiYXZnQW1wbGl0dWRlIiwiYmFyIiwiY2FuY2VsQW5pbWF0aW9uIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmROYXRpdmUiLCJnZXRGcm9tRE9NIiwiZ2V0SW50ZXJjZXB0IiwiaGFuZGxlUHVzaFN0YXRlIiwiaWdub3JlU3RhY2siLCJydW5BbmltYXRpb24iLCJzY2FsZXJzIiwic2hvdWxkSWdub3JlVVJMIiwic2hvdWxkVHJhY2siLCJzb3VyY2VzIiwidW5pU2NhbGVyIiwiX1dlYlNvY2tldCIsIl9YRG9tYWluUmVxdWVzdCIsIl9YTUxIdHRwUmVxdWVzdCIsIl9pIiwiX2ludGVyY2VwdCIsIl9sZW4iLCJfcHVzaFN0YXRlIiwiX3JlZiIsIl9yZWYxIiwiX3JlcGxhY2VTdGF0ZSIsIl9fc2xpY2UiLCJfX2hhc1Byb3AiLCJfX2V4dGVuZHMiLCJjaGlsZCIsImN0b3IiLCJfX3N1cGVyX18iLCJfX2luZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsImxhc3QiLCJkaWZmIiwiYXJncyIsIm91dCIsInN1bSIsInYiLCJqc29uIiwiX2Vycm9yIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiaWdub3JlIiwicmV0IiwidW5zaGlmdCIsInNoaWZ0IiwidHJhY2siLCJtb25pdG9yWEhSIiwicmVxIiwiX29wZW4iLCJ1cmwiLCJhc3luYyIsInJlcXVlc3QiLCJmbGFncyIsInByb3RvY29scyIsIl9hcmciLCJhZnRlciIsInN0aWxsQWN0aXZlIiwiX3JlZjMiLCJyZWFkeVN0YXRlIiwicmVzdGFydCIsIndhdGNoIiwidHJhY2tlciIsInNpemUiLCJfb25yZWFkeXN0YXRlY2hhbmdlIiwiUHJvZ3Jlc3NFdmVudCIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwiZ28iLCJlbnF1ZXVlTmV4dEZyYW1lIiwicmVtYWluaW5nIiwic2NhbGVyIiwic2NhbGVyTGlzdCIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJ0ZXN0aW1vbmlhbHMiLCJ0YWxsZXN0IiwidGVzdGltb25pYWwiLCJtaW5IZWlnaHQiLCJoYW5kbGVUb2dnbGUiLCJ0b2dnbGVzIiwiZmFrZVN1Ym1pdCIsInBhcmVudEZvcm0iLCJzdWJtaXQiLCJoaWdobGlnaHQiLCJidXR0b25zIiwicmFkaW9zIiwicmFkaW8iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxNQUFPLFlBQVc7QUFDdEI7QUFDQSxNQUFJLENBQUNDLE9BQU9DLElBQVosRUFBa0I7QUFDaEJELFdBQU9DLElBQVAsR0FBYyxVQUFTQyxNQUFULEVBQWlCO0FBQzdCLFVBQUlELE9BQU8sRUFBWDtBQUNBLFdBQUssSUFBSUUs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QUFTZ21CLFFBQVE5d0MsQ0FBUixDQUFiOztBQUVBOHFCLFdBQU90aEIsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUNrbkMsVUFBakM7QUFDRDs7QUFFRDtBQUNBLE9BQUssSUFBSTF3QyxJQUFJLENBQWIsRUFBZ0JBLElBQUkrd0MsT0FBTzl3QyxNQUEzQixFQUFtQ0QsR0FBbkMsRUFBd0M7QUFDdEMsUUFBSWd4QyxRQUFRRCxPQUFPL3dDLENBQVAsQ0FBWjs7QUFFQWd4QyxVQUFNeG5DLGdCQUFOLENBQXVCLFFBQXZCLEVBQWlDcW5DLFNBQWpDO0FBQ0Q7QUFDRixDQTVDRDs7O0FDQUF6cEIsT0FBTyxVQUFVaEIsQ0FBVixFQUFhO0FBQ2xCOztBQUVBOztBQUNBMFgsZUFBYWhJLElBQWI7O0FBRUE7QUFDQTFQLElBQUUsY0FBRixFQUNHK0MsSUFESCxDQUNRLFdBRFIsRUFFRzlpQixXQUZIOztBQUlBK2YsSUFBRSxxQkFBRixFQUF5QmtlLElBQXpCLENBQThCO0FBQzVCbm1DLFVBQU0sV0FEc0I7QUFFNUJna0MsVUFBTSxPQUZzQjtBQUc1QmlELGNBQVUsS0FIa0I7QUFJNUJqa0MsVUFBTSxrQkFKc0I7QUFLNUI2akMsWUFBUTtBQUxvQixHQUE5Qjs7QUFRQTtBQUNBNWUsSUFBRSx5QkFBRixFQUE2QjJVLE9BQTdCOztBQUVBO0FBQ0FoOUIsTUFBSTtBQUNGd04sZUFBVywyQkFEVDtBQUVGVSxZQUFRLElBRk47QUFHRlAsV0FBTyxDQUhMO0FBSUZvQixjQUFVLElBSlI7QUFLRkssd0JBQW9CO0FBTGxCLEdBQUo7QUFPRCxDQTlCRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG5zID0gKGZ1bmN0aW9uICgpe1xuLy8gT2JqZWN0LmtleXNcbmlmICghT2JqZWN0LmtleXMpIHtcbiAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfTtcbn1cblxuLy8gQ2hpbGROb2RlLnJlbW92ZVxuaWYoIShcInJlbW92ZVwiIGluIEVsZW1lbnQucHJvdG90eXBlKSl7XG4gIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYodGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgd2luID0gd2luZG93O1xuXG52YXIgcmFmID0gd2luLnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IGZ1bmN0aW9uKGNiKSB7IHJldHVybiBzZXRUaW1lb3V0KGNiLCAxNik7IH07XG5cbnZhciB3aW4kMSA9IHdpbmRvdztcblxudmFyIGNhZiA9IHdpbiQxLmNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbiQxLm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gIHx8IGZ1bmN0aW9uKGlkKXsgY2xlYXJUaW1lb3V0KGlkKTsgfTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICB2YXIgb2JqLCBuYW1lLCBjb3B5LFxuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgaSA9IDEsXG4gICAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKG9iaiA9IGFyZ3VtZW50c1tpXSkgIT09IG51bGwpIHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgY29weSA9IG9ialtuYW1lXTtcblxuICAgICAgICBpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGFyZ2V0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBjaGVja1N0b3JhZ2VWYWx1ZSAodmFsdWUpIHtcbiAgcmV0dXJuIFsndHJ1ZScsICdmYWxzZSddLmluZGV4T2YodmFsdWUpID49IDAgPyBKU09OLnBhcnNlKHZhbHVlKSA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBzZXRMb2NhbFN0b3JhZ2Uoc3RvcmFnZSwga2V5LCB2YWx1ZSwgYWNjZXNzKSB7XG4gIGlmIChhY2Nlc3MpIHtcbiAgICB0cnkgeyBzdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7IH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRTbGlkZUlkKCkge1xuICB2YXIgaWQgPSB3aW5kb3cudG5zSWQ7XG4gIHdpbmRvdy50bnNJZCA9ICFpZCA/IDEgOiBpZCArIDE7XG4gIFxuICByZXR1cm4gJ3RucycgKyB3aW5kb3cudG5zSWQ7XG59XG5cbmZ1bmN0aW9uIGdldEJvZHkgKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZG9jLmJvZHk7XG5cbiAgaWYgKCFib2R5KSB7XG4gICAgYm9keSA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgYm9keS5mYWtlID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBib2R5O1xufVxuXG52YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuZnVuY3Rpb24gc2V0RmFrZUJvZHkgKGJvZHkpIHtcbiAgdmFyIGRvY092ZXJmbG93ID0gJyc7XG4gIGlmIChib2R5LmZha2UpIHtcbiAgICBkb2NPdmVyZmxvdyA9IGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3c7XG4gICAgLy9hdm9pZCBjcmFzaGluZyBJRTgsIGlmIGJhY2tncm91bmQgaW1hZ2UgaXMgdXNlZFxuICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xuICAgIC8vU2FmYXJpIDUuMTMvNS4xLjQgT1NYIHN0b3BzIGxvYWRpbmcgaWYgOjotd2Via2l0LXNjcm9sbGJhciBpcyB1c2VkIGFuZCBzY3JvbGxiYXJzIGFyZSB2aXNpYmxlXG4gICAgYm9keS5zdHlsZS5vdmVyZmxvdyA9IGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKGJvZHkpO1xuICB9XG5cbiAgcmV0dXJuIGRvY092ZXJmbG93O1xufVxuXG5mdW5jdGlvbiByZXNldEZha2VCb2R5IChib2R5LCBkb2NPdmVyZmxvdykge1xuICBpZiAoYm9keS5mYWtlKSB7XG4gICAgYm9keS5yZW1vdmUoKTtcbiAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gZG9jT3ZlcmZsb3c7XG4gICAgLy8gVHJpZ2dlciBsYXlvdXQgc28ga2luZXRpYyBzY3JvbGxpbmcgaXNuJ3QgZGlzYWJsZWQgaW4gaU9TNitcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBkb2NFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgfVxufVxuXG4vLyBnZXQgY3NzLWNhbGMgXG5cbmZ1bmN0aW9uIGNhbGMoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCwgXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSwgXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICBib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gIHRyeSB7XG4gICAgdmFyIHN0ciA9ICcoMTBweCAqIDEwKScsXG4gICAgICAgIHZhbHMgPSBbJ2NhbGMnICsgc3RyLCAnLW1vei1jYWxjJyArIHN0ciwgJy13ZWJraXQtY2FsYycgKyBzdHJdLFxuICAgICAgICB2YWw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIHZhbCA9IHZhbHNbaV07XG4gICAgICBkaXYuc3R5bGUud2lkdGggPSB2YWw7XG4gICAgICBpZiAoZGl2Lm9mZnNldFdpZHRoID09PSAxMDApIHsgXG4gICAgICAgIHJlc3VsdCA9IHZhbC5yZXBsYWNlKHN0ciwgJycpOyBcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7fVxuICBcbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBkaXYucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gZ2V0IHN1YnBpeGVsIHN1cHBvcnQgdmFsdWVcblxuZnVuY3Rpb24gcGVyY2VudGFnZUxheW91dCgpIHtcbiAgLy8gY2hlY2sgc3VicGl4ZWwgbGF5b3V0IHN1cHBvcnRpbmdcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICB3cmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgb3V0ZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBzdHIgPSAnJyxcbiAgICAgIGNvdW50ID0gNzAsXG4gICAgICBwZXJQYWdlID0gMyxcbiAgICAgIHN1cHBvcnRlZCA9IGZhbHNlO1xuXG4gIHdyYXBwZXIuY2xhc3NOYW1lID0gXCJ0bnMtdC1zdWJwMlwiO1xuICBvdXRlci5jbGFzc05hbWUgPSBcInRucy10LWN0XCI7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgc3RyICs9ICc8ZGl2PjwvZGl2Pic7XG4gIH1cblxuICBvdXRlci5pbm5lckhUTUwgPSBzdHI7XG4gIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXIpO1xuICBib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gIHN1cHBvcnRlZCA9IE1hdGguYWJzKHdyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIG91dGVyLmNoaWxkcmVuW2NvdW50IC0gcGVyUGFnZV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgPCAyO1xuXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogd3JhcHBlci5yZW1vdmUoKTtcblxuICByZXR1cm4gc3VwcG9ydGVkO1xufVxuXG5mdW5jdGlvbiBtZWRpYXF1ZXJ5U3VwcG9ydCAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgc3R5bGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3R5bGUnKSxcbiAgICAgIHJ1bGUgPSAnQG1lZGlhIGFsbCBhbmQgKG1pbi13aWR0aDoxcHgpey50bnMtbXEtdGVzdHtwb3NpdGlvbjphYnNvbHV0ZX19JyxcbiAgICAgIHBvc2l0aW9uO1xuXG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICBkaXYuY2xhc3NOYW1lID0gJ3Rucy1tcS10ZXN0JztcblxuICBib2R5LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcnVsZTtcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUocnVsZSkpO1xuICB9XG5cbiAgcG9zaXRpb24gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRpdikucG9zaXRpb24gOiBkaXYuY3VycmVudFN0eWxlWydwb3NpdGlvbiddO1xuXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZGl2LnJlbW92ZSgpO1xuXG4gIHJldHVybiBwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiO1xufVxuXG4vLyBjcmVhdGUgYW5kIGFwcGVuZCBzdHlsZSBzaGVldFxuZnVuY3Rpb24gY3JlYXRlU3R5bGVTaGVldCAobWVkaWEpIHtcbiAgLy8gQ3JlYXRlIHRoZSA8c3R5bGU+IHRhZ1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcblxuICAvLyBBZGQgYSBtZWRpYSAoYW5kL29yIG1lZGlhIHF1ZXJ5KSBoZXJlIGlmIHlvdSdkIGxpa2UhXG4gIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIFwic2NyZWVuXCIpXG4gIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiAxMDI0cHgpXCIpXG4gIGlmIChtZWRpYSkgeyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSk7IH1cblxuICAvLyBXZWJLaXQgaGFjayA6KFxuICAvLyBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKSk7XG5cbiAgLy8gQWRkIHRoZSA8c3R5bGU+IGVsZW1lbnQgdG8gdGhlIHBhZ2VcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICByZXR1cm4gc3R5bGUuc2hlZXQgPyBzdHlsZS5zaGVldCA6IHN0eWxlLnN0eWxlU2hlZXQ7XG59XG5cbi8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXG5mdW5jdGlvbiBhZGRDU1NSdWxlKHNoZWV0LCBzZWxlY3RvciwgcnVsZXMsIGluZGV4KSB7XG4gIC8vIHJldHVybiByYWYoZnVuY3Rpb24oKSB7XG4gICAgJ2luc2VydFJ1bGUnIGluIHNoZWV0ID9cbiAgICAgIHNoZWV0Lmluc2VydFJ1bGUoc2VsZWN0b3IgKyAneycgKyBydWxlcyArICd9JywgaW5kZXgpIDpcbiAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIHJ1bGVzLCBpbmRleCk7XG4gIC8vIH0pO1xufVxuXG4vLyBjcm9zcyBicm93c2VycyBhZGRSdWxlIG1ldGhvZFxuZnVuY3Rpb24gcmVtb3ZlQ1NTUnVsZShzaGVldCwgaW5kZXgpIHtcbiAgLy8gcmV0dXJuIHJhZihmdW5jdGlvbigpIHtcbiAgICAnZGVsZXRlUnVsZScgaW4gc2hlZXQgP1xuICAgICAgc2hlZXQuZGVsZXRlUnVsZShpbmRleCkgOlxuICAgICAgc2hlZXQucmVtb3ZlUnVsZShpbmRleCk7XG4gIC8vIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkge1xuICB2YXIgcnVsZSA9ICgnaW5zZXJ0UnVsZScgaW4gc2hlZXQpID8gc2hlZXQuY3NzUnVsZXMgOiBzaGVldC5ydWxlcztcbiAgcmV0dXJuIHJ1bGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiB0b0RlZ3JlZSAoeSwgeCkge1xuICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KSAqICgxODAgLyBNYXRoLlBJKTtcbn1cblxuZnVuY3Rpb24gZ2V0VG91Y2hEaXJlY3Rpb24oYW5nbGUsIHJhbmdlKSB7XG4gIHZhciBkaXJlY3Rpb24gPSBmYWxzZSxcbiAgICAgIGdhcCA9IE1hdGguYWJzKDkwIC0gTWF0aC5hYnMoYW5nbGUpKTtcbiAgICAgIFxuICBpZiAoZ2FwID49IDkwIC0gcmFuZ2UpIHtcbiAgICBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gIH0gZWxzZSBpZiAoZ2FwIDw9IHJhbmdlKSB7XG4gICAgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgfVxuXG4gIHJldHVybiBkaXJlY3Rpb247XG59XG5cbi8vIGh0dHBzOi8vdG9kZG1vdHRvLmNvbS9kaXRjaC10aGUtYXJyYXktZm9yZWFjaC1jYWxsLW5vZGVsaXN0LWhhY2svXG5mdW5jdGlvbiBmb3JFYWNoIChhcnIsIGNhbGxiYWNrLCBzY29wZSkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjYWxsYmFjay5jYWxsKHNjb3BlLCBhcnJbaV0sIGkpO1xuICB9XG59XG5cbnZhciBjbGFzc0xpc3RTdXBwb3J0ID0gJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnXycpO1xuXG52YXIgaGFzQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cbiAgICBmdW5jdGlvbiAoZWwsIHN0cikgeyByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKHN0cik7IH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7IHJldHVybiBlbC5jbGFzc05hbWUuaW5kZXhPZihzdHIpID49IDA7IH07XG5cbnZhciBhZGRDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoIWhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc0xpc3QuYWRkKHN0cik7IH1cbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKCFoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NOYW1lICs9ICcgJyArIHN0cjsgfVxuICAgIH07XG5cbnZhciByZW1vdmVDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoc3RyKTsgfVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoaGFzQ2xhc3MoZWwsIHN0cikpIHsgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2Uoc3RyLCAnJyk7IH1cbiAgICB9O1xuXG5mdW5jdGlvbiBoYXNBdHRyKGVsLCBhdHRyKSB7XG4gIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHIoZWwsIGF0dHIpIHtcbiAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlTGlzdChlbCkge1xuICAvLyBPbmx5IE5vZGVMaXN0IGhhcyB0aGUgXCJpdGVtKClcIiBmdW5jdGlvblxuICByZXR1cm4gdHlwZW9mIGVsLml0ZW0gIT09IFwidW5kZWZpbmVkXCI7IFxufVxuXG5mdW5jdGlvbiBzZXRBdHRycyhlbHMsIGF0dHJzKSB7XG4gIGVscyA9IChpc05vZGVMaXN0KGVscykgfHwgZWxzIGluc3RhbmNlb2YgQXJyYXkpID8gZWxzIDogW2Vsc107XG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXR0cnMpICE9PSAnW29iamVjdCBPYmplY3RdJykgeyByZXR1cm47IH1cblxuICBmb3IgKHZhciBpID0gZWxzLmxlbmd0aDsgaS0tOykge1xuICAgIGZvcih2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICBlbHNbaV0uc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUF0dHJzKGVscywgYXR0cnMpIHtcbiAgZWxzID0gKGlzTm9kZUxpc3QoZWxzKSB8fCBlbHMgaW5zdGFuY2VvZiBBcnJheSkgPyBlbHMgOiBbZWxzXTtcbiAgYXR0cnMgPSAoYXR0cnMgaW5zdGFuY2VvZiBBcnJheSkgPyBhdHRycyA6IFthdHRyc107XG5cbiAgdmFyIGF0dHJMZW5ndGggPSBhdHRycy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSBlbHMubGVuZ3RoOyBpLS07KSB7XG4gICAgZm9yICh2YXIgaiA9IGF0dHJMZW5ndGg7IGotLTspIHtcbiAgICAgIGVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoYXR0cnNbal0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcnJheUZyb21Ob2RlTGlzdCAobmwpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IG5sLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGFyci5wdXNoKG5sW2ldKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBoaWRlRWxlbWVudChlbCwgZm9yY2VIaWRlKSB7XG4gIGlmIChlbC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHsgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgfVxufVxuXG5mdW5jdGlvbiBzaG93RWxlbWVudChlbCwgZm9yY2VIaWRlKSB7XG4gIGlmIChlbC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHsgZWwuc3R5bGUuZGlzcGxheSA9ICcnOyB9XG59XG5cbmZ1bmN0aW9uIGlzVmlzaWJsZShlbCkge1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgIT09ICdub25lJztcbn1cblxuZnVuY3Rpb24gd2hpY2hQcm9wZXJ0eShwcm9wcyl7XG4gIGlmICh0eXBlb2YgcHJvcHMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIGFyciA9IFtwcm9wc10sXG4gICAgICAgIFByb3BzID0gcHJvcHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wcy5zdWJzdHIoMSksXG4gICAgICAgIHByZWZpeGVzID0gWydXZWJraXQnLCAnTW96JywgJ21zJywgJ08nXTtcbiAgICAgICAgXG4gICAgcHJlZml4ZXMuZm9yRWFjaChmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgIGlmIChwcmVmaXggIT09ICdtcycgfHwgcHJvcHMgPT09ICd0cmFuc2Zvcm0nKSB7XG4gICAgICAgIGFyci5wdXNoKHByZWZpeCArIFByb3BzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHByb3BzID0gYXJyO1xuICB9XG5cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKSxcbiAgICAgIGxlbiA9IHByb3BzLmxlbmd0aDtcbiAgZm9yKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKXtcbiAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xuICAgIGlmKCBlbC5zdHlsZVtwcm9wXSAhPT0gdW5kZWZpbmVkICl7IHJldHVybiBwcm9wOyB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7IC8vIGV4cGxpY2l0IGZvciBpZTktXG59XG5cbmZ1bmN0aW9uIGhhczNEVHJhbnNmb3Jtcyh0Zil7XG4gIGlmICghdGYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICghd2luZG93LmdldENvbXB1dGVkU3R5bGUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIFxuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKSxcbiAgICAgIGhhczNkLFxuICAgICAgY3NzVEYgPSB0Zi5sZW5ndGggPiA5ID8gJy0nICsgdGYuc2xpY2UoMCwgLTkpLnRvTG93ZXJDYXNlKCkgKyAnLScgOiAnJztcblxuICBjc3NURiArPSAndHJhbnNmb3JtJztcblxuICAvLyBBZGQgaXQgdG8gdGhlIGJvZHkgdG8gZ2V0IHRoZSBjb21wdXRlZCBzdHlsZVxuICBib2R5Lmluc2VydEJlZm9yZShlbCwgbnVsbCk7XG5cbiAgZWwuc3R5bGVbdGZdID0gJ3RyYW5zbGF0ZTNkKDFweCwxcHgsMXB4KSc7XG4gIGhhczNkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoY3NzVEYpO1xuXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZWwucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIChoYXMzZCAhPT0gdW5kZWZpbmVkICYmIGhhczNkLmxlbmd0aCA+IDAgJiYgaGFzM2QgIT09IFwibm9uZVwiKTtcbn1cblxuLy8gZ2V0IHRyYW5zaXRpb25lbmQsIGFuaW1hdGlvbmVuZCBiYXNlZCBvbiB0cmFuc2l0aW9uRHVyYXRpb25cbi8vIEBwcm9waW46IHN0cmluZ1xuLy8gQHByb3BPdXQ6IHN0cmluZywgZmlyc3QtbGV0dGVyIHVwcGVyY2FzZVxuLy8gVXNhZ2U6IGdldEVuZFByb3BlcnR5KCdXZWJraXRUcmFuc2l0aW9uRHVyYXRpb24nLCAnVHJhbnNpdGlvbicpID0+IHdlYmtpdFRyYW5zaXRpb25FbmRcbmZ1bmN0aW9uIGdldEVuZFByb3BlcnR5KHByb3BJbiwgcHJvcE91dCkge1xuICB2YXIgZW5kUHJvcCA9IGZhbHNlO1xuICBpZiAoL15XZWJraXQvLnRlc3QocHJvcEluKSkge1xuICAgIGVuZFByb3AgPSAnd2Via2l0JyArIHByb3BPdXQgKyAnRW5kJztcbiAgfSBlbHNlIGlmICgvXk8vLnRlc3QocHJvcEluKSkge1xuICAgIGVuZFByb3AgPSAnbycgKyBwcm9wT3V0ICsgJ0VuZCc7XG4gIH0gZWxzZSBpZiAocHJvcEluKSB7XG4gICAgZW5kUHJvcCA9IHByb3BPdXQudG9Mb3dlckNhc2UoKSArICdlbmQnO1xuICB9XG4gIHJldHVybiBlbmRQcm9wO1xufVxuXG4vLyBUZXN0IHZpYSBhIGdldHRlciBpbiB0aGUgb3B0aW9ucyBvYmplY3QgdG8gc2VlIGlmIHRoZSBwYXNzaXZlIHByb3BlcnR5IGlzIGFjY2Vzc2VkXG52YXIgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XG50cnkge1xuICB2YXIgb3B0cyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsIG51bGwsIG9wdHMpO1xufSBjYXRjaCAoZSkge31cbnZhciBwYXNzaXZlT3B0aW9uID0gc3VwcG9ydHNQYXNzaXZlID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZTtcblxuZnVuY3Rpb24gYWRkRXZlbnRzKGVsLCBvYmosIHByZXZlbnRTY3JvbGxpbmcpIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICB2YXIgb3B0aW9uID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZSddLmluZGV4T2YocHJvcCkgPj0gMCAmJiAhcHJldmVudFNjcm9sbGluZyA/IHBhc3NpdmVPcHRpb24gOiBmYWxzZTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKHByb3AsIG9ialtwcm9wXSwgb3B0aW9uKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudHMoZWwsIG9iaikge1xuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIEV2ZW50cygpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3BpY3M6IHt9LFxuICAgIG9uOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXSA9IHRoaXMudG9waWNzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICBpZiAodGhpcy50b3BpY3NbZXZlbnROYW1lXSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9waWNzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy50b3BpY3NbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICBkYXRhLnR5cGUgPSBldmVudE5hbWU7XG4gICAgICBpZiAodGhpcy50b3BpY3NbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICBmbihkYXRhLCBldmVudE5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGpzVHJhbnNmb3JtKGVsZW1lbnQsIGF0dHIsIHByZWZpeCwgcG9zdGZpeCwgdG8sIGR1cmF0aW9uLCBjYWxsYmFjaykge1xuICB2YXIgdGljayA9IE1hdGgubWluKGR1cmF0aW9uLCAxMCksXG4gICAgICB1bml0ID0gKHRvLmluZGV4T2YoJyUnKSA+PSAwKSA/ICclJyA6ICdweCcsXG4gICAgICB0byA9IHRvLnJlcGxhY2UodW5pdCwgJycpLFxuICAgICAgZnJvbSA9IE51bWJlcihlbGVtZW50LnN0eWxlW2F0dHJdLnJlcGxhY2UocHJlZml4LCAnJykucmVwbGFjZShwb3N0Zml4LCAnJykucmVwbGFjZSh1bml0LCAnJykpLFxuICAgICAgcG9zaXRpb25UaWNrID0gKHRvIC0gZnJvbSkgLyBkdXJhdGlvbiAqIHRpY2ssXG4gICAgICBydW5uaW5nO1xuXG4gIHNldFRpbWVvdXQobW92ZUVsZW1lbnQsIHRpY2spO1xuICBmdW5jdGlvbiBtb3ZlRWxlbWVudCgpIHtcbiAgICBkdXJhdGlvbiAtPSB0aWNrO1xuICAgIGZyb20gKz0gcG9zaXRpb25UaWNrO1xuICAgIGVsZW1lbnQuc3R5bGVbYXR0cl0gPSBwcmVmaXggKyBmcm9tICsgdW5pdCArIHBvc3RmaXg7XG4gICAgaWYgKGR1cmF0aW9uID4gMCkgeyBcbiAgICAgIHNldFRpbWVvdXQobW92ZUVsZW1lbnQsIHRpY2spOyBcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbn1cblxudmFyIHRucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGV4dGVuZCh7XG4gICAgY29udGFpbmVyOiAnLnNsaWRlcicsXG4gICAgbW9kZTogJ2Nhcm91c2VsJyxcbiAgICBheGlzOiAnaG9yaXpvbnRhbCcsXG4gICAgaXRlbXM6IDEsXG4gICAgZ3V0dGVyOiAwLFxuICAgIGVkZ2VQYWRkaW5nOiAwLFxuICAgIGZpeGVkV2lkdGg6IGZhbHNlLFxuICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgdmlld3BvcnRNYXg6IGZhbHNlLFxuICAgIHNsaWRlQnk6IDEsXG4gICAgY2VudGVyOiBmYWxzZSxcbiAgICBjb250cm9sczogdHJ1ZSxcbiAgICBjb250cm9sc1Bvc2l0aW9uOiAndG9wJyxcbiAgICBjb250cm9sc1RleHQ6IFsncHJldicsICduZXh0J10sXG4gICAgY29udHJvbHNDb250YWluZXI6IGZhbHNlLFxuICAgIHByZXZCdXR0b246IGZhbHNlLFxuICAgIG5leHRCdXR0b246IGZhbHNlLFxuICAgIG5hdjogdHJ1ZSxcbiAgICBuYXZQb3NpdGlvbjogJ3RvcCcsXG4gICAgbmF2Q29udGFpbmVyOiBmYWxzZSxcbiAgICBuYXZBc1RodW1ibmFpbHM6IGZhbHNlLFxuICAgIGFycm93S2V5czogZmFsc2UsXG4gICAgc3BlZWQ6IDMwMCxcbiAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgYXV0b3BsYXlQb3NpdGlvbjogJ3RvcCcsXG4gICAgYXV0b3BsYXlUaW1lb3V0OiA1MDAwLFxuICAgIGF1dG9wbGF5RGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gICAgYXV0b3BsYXlUZXh0OiBbJ3N0YXJ0JywgJ3N0b3AnXSxcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6IGZhbHNlLFxuICAgIGF1dG9wbGF5QnV0dG9uOiBmYWxzZSxcbiAgICBhdXRvcGxheUJ1dHRvbk91dHB1dDogdHJ1ZSxcbiAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogJ3Rucy1mYWRlSW4nLFxuICAgIGFuaW1hdGVPdXQ6ICd0bnMtZmFkZU91dCcsXG4gICAgYW5pbWF0ZU5vcm1hbDogJ3Rucy1ub3JtYWwnLFxuICAgIGFuaW1hdGVEZWxheTogZmFsc2UsXG4gICAgbG9vcDogdHJ1ZSxcbiAgICByZXdpbmQ6IGZhbHNlLFxuICAgIGF1dG9IZWlnaHQ6IGZhbHNlLFxuICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgIGxhenlsb2FkOiBmYWxzZSxcbiAgICBsYXp5bG9hZFNlbGVjdG9yOiAnLnRucy1sYXp5LWltZycsXG4gICAgdG91Y2g6IHRydWUsXG4gICAgbW91c2VEcmFnOiBmYWxzZSxcbiAgICBzd2lwZUFuZ2xlOiAxNSxcbiAgICBuZXN0ZWQ6IGZhbHNlLFxuICAgIHByZXZlbnRBY3Rpb25XaGVuUnVubmluZzogZmFsc2UsXG4gICAgcHJldmVudFNjcm9sbE9uVG91Y2g6IGZhbHNlLFxuICAgIGZyZWV6YWJsZTogdHJ1ZSxcbiAgICBvbkluaXQ6IGZhbHNlLFxuICAgIHVzZUxvY2FsU3RvcmFnZTogdHJ1ZVxuICB9LCBvcHRpb25zIHx8IHt9KTtcbiAgXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIHdpbiA9IHdpbmRvdyxcbiAgICAgIEtFWVMgPSB7XG4gICAgICAgIEVOVEVSOiAxMyxcbiAgICAgICAgU1BBQ0U6IDMyLFxuICAgICAgICBMRUZUOiAzNyxcbiAgICAgICAgUklHSFQ6IDM5XG4gICAgICB9LFxuICAgICAgdG5zU3RvcmFnZSA9IHt9LFxuICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gb3B0aW9ucy51c2VMb2NhbFN0b3JhZ2U7XG5cbiAgaWYgKGxvY2FsU3RvcmFnZUFjY2Vzcykge1xuICAgIC8vIGNoZWNrIGJyb3dzZXIgdmVyc2lvbiBhbmQgbG9jYWwgc3RvcmFnZSBhY2Nlc3NcbiAgICB2YXIgYnJvd3NlckluZm8gPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIHZhciB1aWQgPSBuZXcgRGF0ZTtcblxuICAgIHRyeSB7XG4gICAgICB0bnNTdG9yYWdlID0gd2luLmxvY2FsU3RvcmFnZTtcbiAgICAgIGlmICh0bnNTdG9yYWdlKSB7XG4gICAgICAgIHRuc1N0b3JhZ2Uuc2V0SXRlbSh1aWQsIHVpZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IHRuc1N0b3JhZ2UuZ2V0SXRlbSh1aWQpID09IHVpZDtcbiAgICAgICAgdG5zU3RvcmFnZS5yZW1vdmVJdGVtKHVpZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghbG9jYWxTdG9yYWdlQWNjZXNzKSB7IHRuc1N0b3JhZ2UgPSB7fTsgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsU3RvcmFnZUFjY2Vzcykge1xuICAgICAgLy8gcmVtb3ZlIHN0b3JhZ2Ugd2hlbiBicm93c2VyIHZlcnNpb24gY2hhbmdlc1xuICAgICAgaWYgKHRuc1N0b3JhZ2VbJ3Ruc0FwcCddICYmIHRuc1N0b3JhZ2VbJ3Ruc0FwcCddICE9PSBicm93c2VySW5mbykge1xuICAgICAgICBbJ3RDJywgJ3RQTCcsICd0TVEnLCAndFRmJywgJ3QzRCcsICd0VER1JywgJ3RURGUnLCAndEFEdScsICd0QURlJywgJ3RURScsICd0QUUnXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgdG5zU3RvcmFnZS5yZW1vdmVJdGVtKGl0ZW0pOyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIHVwZGF0ZSBicm93c2VySW5mb1xuICAgICAgbG9jYWxTdG9yYWdlWyd0bnNBcHAnXSA9IGJyb3dzZXJJbmZvO1xuICAgIH1cbiAgfVxuXG4gIHZhciBDQUxDID0gdG5zU3RvcmFnZVsndEMnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RDJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QycsIGNhbGMoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFBFUkNFTlRBR0VMQVlPVVQgPSB0bnNTdG9yYWdlWyd0UEwnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RQTCddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFBMJywgcGVyY2VudGFnZUxheW91dCgpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQ1NTTVEgPSB0bnNTdG9yYWdlWyd0TVEnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RNUSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndE1RJywgbWVkaWFxdWVyeVN1cHBvcnQoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TRk9STSA9IHRuc1N0b3JhZ2VbJ3RUZiddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFRmJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VGYnLCB3aGljaFByb3BlcnR5KCd0cmFuc2Zvcm0nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEhBUzNEVFJBTlNGT1JNUyA9IHRuc1N0b3JhZ2VbJ3QzRCddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndDNEJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0M0QnLCBoYXMzRFRyYW5zZm9ybXMoVFJBTlNGT1JNKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TSVRJT05EVVJBVElPTiA9IHRuc1N0b3JhZ2VbJ3RURHUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURHUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURHUnLCB3aGljaFByb3BlcnR5KCd0cmFuc2l0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TSVRJT05ERUxBWSA9IHRuc1N0b3JhZ2VbJ3RURGUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURGUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURGUnLCB3aGljaFByb3BlcnR5KCd0cmFuc2l0aW9uRGVsYXknKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkRVUkFUSU9OID0gdG5zU3RvcmFnZVsndEFEdSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFEdSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFEdScsIHdoaWNoUHJvcGVydHkoJ2FuaW1hdGlvbkR1cmF0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBBTklNQVRJT05ERUxBWSA9IHRuc1N0b3JhZ2VbJ3RBRGUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRGUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRGUnLCB3aGljaFByb3BlcnR5KCdhbmltYXRpb25EZWxheScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkVORCA9IHRuc1N0b3JhZ2VbJ3RURSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFRFJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VEUnLCBnZXRFbmRQcm9wZXJ0eShUUkFOU0lUSU9ORFVSQVRJT04sICdUcmFuc2l0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBBTklNQVRJT05FTkQgPSB0bnNTdG9yYWdlWyd0QUUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFFJywgZ2V0RW5kUHJvcGVydHkoQU5JTUFUSU9ORFVSQVRJT04sICdBbmltYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKTtcblxuICAvLyBnZXQgZWxlbWVudCBub2RlcyBmcm9tIHNlbGVjdG9yc1xuICB2YXIgc3VwcG9ydENvbnNvbGVXYXJuID0gd2luLmNvbnNvbGUgJiYgdHlwZW9mIHdpbi5jb25zb2xlLndhcm4gPT09IFwiZnVuY3Rpb25cIixcbiAgICAgIHRuc0xpc3QgPSBbJ2NvbnRhaW5lcicsICdjb250cm9sc0NvbnRhaW5lcicsICdwcmV2QnV0dG9uJywgJ25leHRCdXR0b24nLCAnbmF2Q29udGFpbmVyJywgJ2F1dG9wbGF5QnV0dG9uJ10sIFxuICAgICAgb3B0aW9uc0VsZW1lbnRzID0ge307XG4gICAgICBcbiAgdG5zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNbaXRlbV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgc3RyID0gb3B0aW9uc1tpdGVtXSxcbiAgICAgICAgICBlbCA9IGRvYy5xdWVyeVNlbGVjdG9yKHN0cik7XG4gICAgICBvcHRpb25zRWxlbWVudHNbaXRlbV0gPSBzdHI7XG5cbiAgICAgIGlmIChlbCAmJiBlbC5ub2RlTmFtZSkge1xuICAgICAgICBvcHRpb25zW2l0ZW1dID0gZWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3VwcG9ydENvbnNvbGVXYXJuKSB7IGNvbnNvbGUud2FybignQ2FuXFwndCBmaW5kJywgb3B0aW9uc1tpdGVtXSk7IH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gbWFrZSBzdXJlIGF0IGxlYXN0IDEgc2xpZGVcbiAgaWYgKG9wdGlvbnMuY29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICBpZiAoc3VwcG9ydENvbnNvbGVXYXJuKSB7IGNvbnNvbGUud2FybignTm8gc2xpZGVzIGZvdW5kIGluJywgb3B0aW9ucy5jb250YWluZXIpOyB9XG4gICAgcmV0dXJuO1xuICAgfVxuXG4gIC8vIHVwZGF0ZSBvcHRpb25zXG4gIHZhciByZXNwb25zaXZlID0gb3B0aW9ucy5yZXNwb25zaXZlLFxuICAgICAgbmVzdGVkID0gb3B0aW9ucy5uZXN0ZWQsXG4gICAgICBjYXJvdXNlbCA9IG9wdGlvbnMubW9kZSA9PT0gJ2Nhcm91c2VsJyA/IHRydWUgOiBmYWxzZTtcblxuICBpZiAocmVzcG9uc2l2ZSkge1xuICAgIC8vIGFwcGx5IHJlc3BvbnNpdmVbMF0gdG8gb3B0aW9ucyBhbmQgcmVtb3ZlIGl0XG4gICAgaWYgKDAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCByZXNwb25zaXZlWzBdKTtcbiAgICAgIGRlbGV0ZSByZXNwb25zaXZlWzBdO1xuICAgIH1cblxuICAgIHZhciByZXNwb25zaXZlVGVtID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHJlc3BvbnNpdmUpIHtcbiAgICAgIHZhciB2YWwgPSByZXNwb25zaXZlW2tleV07XG4gICAgICAvLyB1cGRhdGUgcmVzcG9uc2l2ZVxuICAgICAgLy8gZnJvbTogMzAwOiAyXG4gICAgICAvLyB0bzogXG4gICAgICAvLyAgIDMwMDogeyBcbiAgICAgIC8vICAgICBpdGVtczogMiBcbiAgICAgIC8vICAgfSBcbiAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdudW1iZXInID8ge2l0ZW1zOiB2YWx9IDogdmFsO1xuICAgICAgcmVzcG9uc2l2ZVRlbVtrZXldID0gdmFsO1xuICAgIH1cbiAgICByZXNwb25zaXZlID0gcmVzcG9uc2l2ZVRlbTtcbiAgICByZXNwb25zaXZlVGVtID0gbnVsbDtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBvcHRpb25zXG4gIGZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnMgKG9iaikge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3NsaWRlQnknKSB7IG9ialtrZXldID0gJ3BhZ2UnOyB9XG4gICAgICAgIGlmIChrZXkgPT09ICdlZGdlUGFkZGluZycpIHsgb2JqW2tleV0gPSBmYWxzZTsgfVxuICAgICAgICBpZiAoa2V5ID09PSAnYXV0b0hlaWdodCcpIHsgb2JqW2tleV0gPSBmYWxzZTsgfVxuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgcmVzcG9uc2l2ZSBvcHRpb25zXG4gICAgICBpZiAoa2V5ID09PSAncmVzcG9uc2l2ZScpIHsgdXBkYXRlT3B0aW9ucyhvYmpba2V5XSk7IH1cbiAgICB9XG4gIH1cbiAgaWYgKCFjYXJvdXNlbCkgeyB1cGRhdGVPcHRpb25zKG9wdGlvbnMpOyB9XG5cblxuICAvLyA9PT0gZGVmaW5lIGFuZCBzZXQgdmFyaWFibGVzID09PVxuICBpZiAoIWNhcm91c2VsKSB7XG4gICAgb3B0aW9ucy5heGlzID0gJ2hvcml6b250YWwnO1xuICAgIG9wdGlvbnMuc2xpZGVCeSA9ICdwYWdlJztcbiAgICBvcHRpb25zLmVkZ2VQYWRkaW5nID0gZmFsc2U7XG5cbiAgICB2YXIgYW5pbWF0ZUluID0gb3B0aW9ucy5hbmltYXRlSW4sXG4gICAgICAgIGFuaW1hdGVPdXQgPSBvcHRpb25zLmFuaW1hdGVPdXQsXG4gICAgICAgIGFuaW1hdGVEZWxheSA9IG9wdGlvbnMuYW5pbWF0ZURlbGF5LFxuICAgICAgICBhbmltYXRlTm9ybWFsID0gb3B0aW9ucy5hbmltYXRlTm9ybWFsO1xuICB9XG5cbiAgdmFyIGhvcml6b250YWwgPSBvcHRpb25zLmF4aXMgPT09ICdob3Jpem9udGFsJyA/IHRydWUgOiBmYWxzZSxcbiAgICAgIG91dGVyV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIGlubmVyV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIG1pZGRsZVdyYXBwZXIsXG4gICAgICBjb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcixcbiAgICAgIGNvbnRhaW5lclBhcmVudCA9IGNvbnRhaW5lci5wYXJlbnROb2RlLFxuICAgICAgY29udGFpbmVySFRNTCA9IGNvbnRhaW5lci5vdXRlckhUTUwsXG4gICAgICBzbGlkZUl0ZW1zID0gY29udGFpbmVyLmNoaWxkcmVuLFxuICAgICAgc2xpZGVDb3VudCA9IHNsaWRlSXRlbXMubGVuZ3RoLFxuICAgICAgYnJlYWtwb2ludFpvbmUsXG4gICAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCksXG4gICAgICBpc09uID0gZmFsc2U7XG4gIGlmIChyZXNwb25zaXZlKSB7IHNldEJyZWFrcG9pbnRab25lKCk7IH1cbiAgaWYgKGNhcm91c2VsKSB7IGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0bnMtdnBmaXgnOyB9XG5cbiAgLy8gZml4ZWRXaWR0aDogdmlld3BvcnQgPiByaWdodEJvdW5kYXJ5ID4gaW5kZXhNYXhcbiAgdmFyIGF1dG9XaWR0aCA9IG9wdGlvbnMuYXV0b1dpZHRoLFxuICAgICAgZml4ZWRXaWR0aCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcpLFxuICAgICAgZWRnZVBhZGRpbmcgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJyksXG4gICAgICBndXR0ZXIgPSBnZXRPcHRpb24oJ2d1dHRlcicpLFxuICAgICAgdmlld3BvcnQgPSBnZXRWaWV3cG9ydFdpZHRoKCksXG4gICAgICBjZW50ZXIgPSBnZXRPcHRpb24oJ2NlbnRlcicpLFxuICAgICAgaXRlbXMgPSAhYXV0b1dpZHRoID8gTWF0aC5mbG9vcihnZXRPcHRpb24oJ2l0ZW1zJykpIDogMSxcbiAgICAgIHNsaWRlQnkgPSBnZXRPcHRpb24oJ3NsaWRlQnknKSxcbiAgICAgIHZpZXdwb3J0TWF4ID0gb3B0aW9ucy52aWV3cG9ydE1heCB8fCBvcHRpb25zLmZpeGVkV2lkdGhWaWV3cG9ydFdpZHRoLFxuICAgICAgYXJyb3dLZXlzID0gZ2V0T3B0aW9uKCdhcnJvd0tleXMnKSxcbiAgICAgIHNwZWVkID0gZ2V0T3B0aW9uKCdzcGVlZCcpLFxuICAgICAgcmV3aW5kID0gb3B0aW9ucy5yZXdpbmQsXG4gICAgICBsb29wID0gcmV3aW5kID8gZmFsc2UgOiBvcHRpb25zLmxvb3AsXG4gICAgICBhdXRvSGVpZ2h0ID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JyksXG4gICAgICBjb250cm9scyA9IGdldE9wdGlvbignY29udHJvbHMnKSxcbiAgICAgIGNvbnRyb2xzVGV4dCA9IGdldE9wdGlvbignY29udHJvbHNUZXh0JyksXG4gICAgICBuYXYgPSBnZXRPcHRpb24oJ25hdicpLFxuICAgICAgdG91Y2ggPSBnZXRPcHRpb24oJ3RvdWNoJyksXG4gICAgICBtb3VzZURyYWcgPSBnZXRPcHRpb24oJ21vdXNlRHJhZycpLFxuICAgICAgYXV0b3BsYXkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5JyksXG4gICAgICBhdXRvcGxheVRpbWVvdXQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGltZW91dCcpLFxuICAgICAgYXV0b3BsYXlUZXh0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRleHQnKSxcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA9IGdldE9wdGlvbignYXV0b3BsYXlIb3ZlclBhdXNlJyksXG4gICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5JyksXG4gICAgICBzaGVldCA9IGNyZWF0ZVN0eWxlU2hlZXQoKSxcbiAgICAgIGxhenlsb2FkID0gb3B0aW9ucy5sYXp5bG9hZCxcbiAgICAgIGxhenlsb2FkU2VsZWN0b3IgPSBvcHRpb25zLmxhenlsb2FkU2VsZWN0b3IsXG4gICAgICBzbGlkZVBvc2l0aW9ucywgLy8gY29sbGVjdGlvbiBvZiBzbGlkZSBwb3NpdGlvbnNcbiAgICAgIHNsaWRlSXRlbXNPdXQgPSBbXSxcbiAgICAgIGNsb25lQ291bnQgPSBsb29wID8gZ2V0Q2xvbmVDb3VudEZvckxvb3AoKSA6IDAsXG4gICAgICBzbGlkZUNvdW50TmV3ID0gIWNhcm91c2VsID8gc2xpZGVDb3VudCArIGNsb25lQ291bnQgOiBzbGlkZUNvdW50ICsgY2xvbmVDb3VudCAqIDIsXG4gICAgICBoYXNSaWdodERlYWRab25lID0gKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSAmJiAhbG9vcCA/IHRydWUgOiBmYWxzZSxcbiAgICAgIHJpZ2h0Qm91bmRhcnkgPSBmaXhlZFdpZHRoID8gZ2V0UmlnaHRCb3VuZGFyeSgpIDogbnVsbCxcbiAgICAgIHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtID0gKCFjYXJvdXNlbCB8fCAhbG9vcCkgPyB0cnVlIDogZmFsc2UsXG4gICAgICAvLyB0cmFuc2Zvcm1cbiAgICAgIHRyYW5zZm9ybUF0dHIgPSBob3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcsXG4gICAgICB0cmFuc2Zvcm1QcmVmaXggPSAnJyxcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSAnJyxcbiAgICAgIC8vIGluZGV4XG4gICAgICBnZXRJbmRleE1heCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gY2VudGVyICYmICFsb29wID8gc2xpZGVDb3VudCAtIDEgOiBNYXRoLmNlaWwoLSByaWdodEJvdW5kYXJ5IC8gKGZpeGVkV2lkdGggKyBndXR0ZXIpKTsgfTtcbiAgICAgICAgfSBlbHNlIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc2xpZGVDb3VudE5ldzsgaS0tOykge1xuICAgICAgICAgICAgICBpZiAoc2xpZGVQb3NpdGlvbnNbaV0gPj0gLSByaWdodEJvdW5kYXJ5KSB7IHJldHVybiBpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY2VudGVyICYmIGNhcm91c2VsICYmICFsb29wKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzbGlkZUNvdW50IC0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBsb29wIHx8IGNhcm91c2VsID8gTWF0aC5tYXgoMCwgc2xpZGVDb3VudE5ldyAtIE1hdGguY2VpbChpdGVtcykpIDogc2xpZGVDb3VudE5ldyAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSkoKSxcbiAgICAgIGluZGV4ID0gZ2V0U3RhcnRJbmRleChnZXRPcHRpb24oJ3N0YXJ0SW5kZXgnKSksXG4gICAgICBpbmRleENhY2hlZCA9IGluZGV4LFxuICAgICAgZGlzcGxheUluZGV4ID0gZ2V0Q3VycmVudFNsaWRlKCksXG4gICAgICBpbmRleE1pbiA9IDAsXG4gICAgICBpbmRleE1heCA9ICFhdXRvV2lkdGggPyBnZXRJbmRleE1heCgpIDogbnVsbCxcbiAgICAgIC8vIHJlc2l6ZVxuICAgICAgcmVzaXplVGltZXIsXG4gICAgICBwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcgPSBvcHRpb25zLnByZXZlbnRBY3Rpb25XaGVuUnVubmluZyxcbiAgICAgIHN3aXBlQW5nbGUgPSBvcHRpb25zLnN3aXBlQW5nbGUsXG4gICAgICBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBzd2lwZUFuZ2xlID8gJz8nIDogdHJ1ZSxcbiAgICAgIHJ1bm5pbmcgPSBmYWxzZSxcbiAgICAgIG9uSW5pdCA9IG9wdGlvbnMub25Jbml0LFxuICAgICAgZXZlbnRzID0gbmV3IEV2ZW50cygpLFxuICAgICAgLy8gaWQsIGNsYXNzXG4gICAgICBuZXdDb250YWluZXJDbGFzc2VzID0gJyB0bnMtc2xpZGVyIHRucy0nICsgb3B0aW9ucy5tb2RlLFxuICAgICAgc2xpZGVJZCA9IGNvbnRhaW5lci5pZCB8fCBnZXRTbGlkZUlkKCksXG4gICAgICBkaXNhYmxlID0gZ2V0T3B0aW9uKCdkaXNhYmxlJyksXG4gICAgICBkaXNhYmxlZCA9IGZhbHNlLFxuICAgICAgZnJlZXphYmxlID0gb3B0aW9ucy5mcmVlemFibGUsXG4gICAgICBmcmVlemUgPSBmcmVlemFibGUgJiYgIWF1dG9XaWR0aCA/IGdldEZyZWV6ZSgpIDogZmFsc2UsXG4gICAgICBmcm96ZW4gPSBmYWxzZSxcbiAgICAgIGNvbnRyb2xzRXZlbnRzID0ge1xuICAgICAgICAnY2xpY2snOiBvbkNvbnRyb2xzQ2xpY2ssXG4gICAgICAgICdrZXlkb3duJzogb25Db250cm9sc0tleWRvd25cbiAgICAgIH0sXG4gICAgICBuYXZFdmVudHMgPSB7XG4gICAgICAgICdjbGljayc6IG9uTmF2Q2xpY2ssXG4gICAgICAgICdrZXlkb3duJzogb25OYXZLZXlkb3duXG4gICAgICB9LFxuICAgICAgaG92ZXJFdmVudHMgPSB7XG4gICAgICAgICdtb3VzZW92ZXInOiBtb3VzZW92ZXJQYXVzZSxcbiAgICAgICAgJ21vdXNlb3V0JzogbW91c2VvdXRSZXN0YXJ0XG4gICAgICB9LFxuICAgICAgdmlzaWJpbGl0eUV2ZW50ID0geyd2aXNpYmlsaXR5Y2hhbmdlJzogb25WaXNpYmlsaXR5Q2hhbmdlfSxcbiAgICAgIGRvY21lbnRLZXlkb3duRXZlbnQgPSB7J2tleWRvd24nOiBvbkRvY3VtZW50S2V5ZG93bn0sXG4gICAgICB0b3VjaEV2ZW50cyA9IHtcbiAgICAgICAgJ3RvdWNoc3RhcnQnOiBvblBhblN0YXJ0LFxuICAgICAgICAndG91Y2htb3ZlJzogb25QYW5Nb3ZlLFxuICAgICAgICAndG91Y2hlbmQnOiBvblBhbkVuZCxcbiAgICAgICAgJ3RvdWNoY2FuY2VsJzogb25QYW5FbmRcbiAgICAgIH0sIGRyYWdFdmVudHMgPSB7XG4gICAgICAgICdtb3VzZWRvd24nOiBvblBhblN0YXJ0LFxuICAgICAgICAnbW91c2Vtb3ZlJzogb25QYW5Nb3ZlLFxuICAgICAgICAnbW91c2V1cCc6IG9uUGFuRW5kLFxuICAgICAgICAnbW91c2VsZWF2ZSc6IG9uUGFuRW5kXG4gICAgICB9LFxuICAgICAgaGFzQ29udHJvbHMgPSBoYXNPcHRpb24oJ2NvbnRyb2xzJyksXG4gICAgICBoYXNOYXYgPSBoYXNPcHRpb24oJ25hdicpLFxuICAgICAgbmF2QXNUaHVtYm5haWxzID0gYXV0b1dpZHRoID8gdHJ1ZSA6IG9wdGlvbnMubmF2QXNUaHVtYm5haWxzLFxuICAgICAgaGFzQXV0b3BsYXkgPSBoYXNPcHRpb24oJ2F1dG9wbGF5JyksXG4gICAgICBoYXNUb3VjaCA9IGhhc09wdGlvbigndG91Y2gnKSxcbiAgICAgIGhhc01vdXNlRHJhZyA9IGhhc09wdGlvbignbW91c2VEcmFnJyksXG4gICAgICBzbGlkZUFjdGl2ZUNsYXNzID0gJ3Rucy1zbGlkZS1hY3RpdmUnLFxuICAgICAgaW1nQ29tcGxldGVDbGFzcyA9ICd0bnMtY29tcGxldGUnLFxuICAgICAgaW1nRXZlbnRzID0ge1xuICAgICAgICAnbG9hZCc6IG9uSW1nTG9hZGVkLFxuICAgICAgICAnZXJyb3InOiBvbkltZ0ZhaWxlZFxuICAgICAgfSxcbiAgICAgIGltZ3NDb21wbGV0ZSxcbiAgICAgIGxpdmVyZWdpb25DdXJyZW50LFxuICAgICAgcHJldmVudFNjcm9sbCA9IG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdmb3JjZScgPyB0cnVlIDogZmFsc2U7XG5cbiAgLy8gY29udHJvbHNcbiAgaWYgKGhhc0NvbnRyb2xzKSB7XG4gICAgdmFyIGNvbnRyb2xzQ29udGFpbmVyID0gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lcixcbiAgICAgICAgY29udHJvbHNDb250YWluZXJIVE1MID0gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciA/IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIHByZXZCdXR0b24gPSBvcHRpb25zLnByZXZCdXR0b24sXG4gICAgICAgIG5leHRCdXR0b24gPSBvcHRpb25zLm5leHRCdXR0b24sXG4gICAgICAgIHByZXZCdXR0b25IVE1MID0gb3B0aW9ucy5wcmV2QnV0dG9uID8gb3B0aW9ucy5wcmV2QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBuZXh0QnV0dG9uSFRNTCA9IG9wdGlvbnMubmV4dEJ1dHRvbiA/IG9wdGlvbnMubmV4dEJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgcHJldklzQnV0dG9uLFxuICAgICAgICBuZXh0SXNCdXR0b247XG4gIH1cblxuICAvLyBuYXZcbiAgaWYgKGhhc05hdikge1xuICAgIHZhciBuYXZDb250YWluZXIgPSBvcHRpb25zLm5hdkNvbnRhaW5lcixcbiAgICAgICAgbmF2Q29udGFpbmVySFRNTCA9IG9wdGlvbnMubmF2Q29udGFpbmVyID8gb3B0aW9ucy5uYXZDb250YWluZXIub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIG5hdkl0ZW1zLFxuICAgICAgICBwYWdlcyA9IGF1dG9XaWR0aCA/IHNsaWRlQ291bnQgOiBnZXRQYWdlcygpLFxuICAgICAgICBwYWdlc0NhY2hlZCA9IDAsXG4gICAgICAgIG5hdkNsaWNrZWQgPSAtMSxcbiAgICAgICAgbmF2Q3VycmVudEluZGV4ID0gZ2V0Q3VycmVudE5hdkluZGV4KCksXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkN1cnJlbnRJbmRleCxcbiAgICAgICAgbmF2QWN0aXZlQ2xhc3MgPSAndG5zLW5hdi1hY3RpdmUnLFxuICAgICAgICBuYXZTdHIgPSAnQ2Fyb3VzZWwgUGFnZSAnLFxuICAgICAgICBuYXZTdHJDdXJyZW50ID0gJyAoQ3VycmVudCBTbGlkZSknO1xuICB9XG5cbiAgLy8gYXV0b3BsYXlcbiAgaWYgKGhhc0F1dG9wbGF5KSB7XG4gICAgdmFyIGF1dG9wbGF5RGlyZWN0aW9uID0gb3B0aW9ucy5hdXRvcGxheURpcmVjdGlvbiA9PT0gJ2ZvcndhcmQnID8gMSA6IC0xLFxuICAgICAgICBhdXRvcGxheUJ1dHRvbiA9IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24sXG4gICAgICAgIGF1dG9wbGF5QnV0dG9uSFRNTCA9IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24gPyBvcHRpb25zLmF1dG9wbGF5QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBhdXRvcGxheUh0bWxTdHJpbmdzID0gWyc8c3BhbiBjbGFzcz1cXCd0bnMtdmlzdWFsbHktaGlkZGVuXFwnPicsICcgYW5pbWF0aW9uPC9zcGFuPiddLFxuICAgICAgICBhdXRvcGxheVRpbWVyLFxuICAgICAgICBhbmltYXRpbmcsXG4gICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQsXG4gICAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCxcbiAgICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkO1xuICB9XG5cbiAgaWYgKGhhc1RvdWNoIHx8IGhhc01vdXNlRHJhZykge1xuICAgIHZhciBpbml0UG9zaXRpb24gPSB7fSxcbiAgICAgICAgbGFzdFBvc2l0aW9uID0ge30sXG4gICAgICAgIHRyYW5zbGF0ZUluaXQsXG4gICAgICAgIGRpc1gsXG4gICAgICAgIGRpc1ksXG4gICAgICAgIHBhblN0YXJ0ID0gZmFsc2UsXG4gICAgICAgIHJhZkluZGV4LFxuICAgICAgICBnZXREaXN0ID0gaG9yaXpvbnRhbCA/IFxuICAgICAgICAgIGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueCAtIGIueDsgfSA6XG4gICAgICAgICAgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS55IC0gYi55OyB9O1xuICB9XG4gIFxuICAvLyBkaXNhYmxlIHNsaWRlciB3aGVuIHNsaWRlY291bnQgPD0gaXRlbXNcbiAgaWYgKCFhdXRvV2lkdGgpIHsgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTsgfVxuXG4gIGlmIChUUkFOU0ZPUk0pIHtcbiAgICB0cmFuc2Zvcm1BdHRyID0gVFJBTlNGT1JNO1xuICAgIHRyYW5zZm9ybVByZWZpeCA9ICd0cmFuc2xhdGUnO1xuXG4gICAgaWYgKEhBUzNEVFJBTlNGT1JNUykge1xuICAgICAgdHJhbnNmb3JtUHJlZml4ICs9IGhvcml6b250YWwgPyAnM2QoJyA6ICczZCgwcHgsICc7XG4gICAgICB0cmFuc2Zvcm1Qb3N0Zml4ID0gaG9yaXpvbnRhbCA/ICcsIDBweCwgMHB4KScgOiAnLCAwcHgpJztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNmb3JtUHJlZml4ICs9IGhvcml6b250YWwgPyAnWCgnIDogJ1koJztcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSAnKSc7XG4gICAgfVxuXG4gIH1cblxuICBpZiAoY2Fyb3VzZWwpIHsgY29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSgndG5zLXZwZml4JywgJycpOyB9XG4gIGluaXRTdHJ1Y3R1cmUoKTtcbiAgaW5pdFNoZWV0KCk7XG4gIGluaXRTbGlkZXJUcmFuc2Zvcm0oKTtcblxuICAvLyA9PT0gQ09NTU9OIEZVTkNUSU9OUyA9PT0gLy9cbiAgZnVuY3Rpb24gcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlIChjb25kaXRpb24pIHtcbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICBjb250cm9scyA9IG5hdiA9IHRvdWNoID0gbW91c2VEcmFnID0gYXJyb3dLZXlzID0gYXV0b3BsYXkgPSBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFNsaWRlICgpIHtcbiAgICB2YXIgdGVtID0gY2Fyb3VzZWwgPyBpbmRleCAtIGNsb25lQ291bnQgOiBpbmRleDtcbiAgICB3aGlsZSAodGVtIDwgMCkgeyB0ZW0gKz0gc2xpZGVDb3VudDsgfVxuICAgIHJldHVybiB0ZW0lc2xpZGVDb3VudCArIDE7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTdGFydEluZGV4IChpbmQpIHtcbiAgICBpbmQgPSBpbmQgPyBNYXRoLm1heCgwLCBNYXRoLm1pbihsb29wID8gc2xpZGVDb3VudCAtIDEgOiBzbGlkZUNvdW50IC0gaXRlbXMsIGluZCkpIDogMDtcbiAgICByZXR1cm4gY2Fyb3VzZWwgPyBpbmQgKyBjbG9uZUNvdW50IDogaW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWJzSW5kZXggKGkpIHtcbiAgICBpZiAoaSA9PSBudWxsKSB7IGkgPSBpbmRleDsgfVxuXG4gICAgaWYgKGNhcm91c2VsKSB7IGkgLT0gY2xvbmVDb3VudDsgfVxuICAgIHdoaWxlIChpIDwgMCkgeyBpICs9IHNsaWRlQ291bnQ7IH1cblxuICAgIHJldHVybiBNYXRoLmZsb29yKGklc2xpZGVDb3VudCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50TmF2SW5kZXggKCkge1xuICAgIHZhciBhYnNJbmRleCA9IGdldEFic0luZGV4KCksXG4gICAgICAgIHJlc3VsdDtcblxuICAgIHJlc3VsdCA9IG5hdkFzVGh1bWJuYWlscyA/IGFic0luZGV4IDogXG4gICAgICBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IE1hdGguY2VpbCgoYWJzSW5kZXggKyAxKSAqIHBhZ2VzIC8gc2xpZGVDb3VudCAtIDEpIDogXG4gICAgICAgICAgTWF0aC5mbG9vcihhYnNJbmRleCAvIGl0ZW1zKTtcblxuICAgIC8vIHNldCBhY3RpdmUgbmF2IHRvIHRoZSBsYXN0IG9uZSB3aGVuIHJlYWNoZXMgdGhlIHJpZ2h0IGVkZ2VcbiAgICBpZiAoIWxvb3AgJiYgY2Fyb3VzZWwgJiYgaW5kZXggPT09IGluZGV4TWF4KSB7IHJlc3VsdCA9IHBhZ2VzIC0gMTsgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEl0ZW1zTWF4ICgpIHtcbiAgICAvLyBmaXhlZFdpZHRoIG9yIGF1dG9XaWR0aCB3aGlsZSB2aWV3cG9ydE1heCBpcyBub3QgYXZhaWxhYmxlXG4gICAgaWYgKGF1dG9XaWR0aCB8fCAoZml4ZWRXaWR0aCAmJiAhdmlld3BvcnRNYXgpKSB7XG4gICAgICByZXR1cm4gc2xpZGVDb3VudCAtIDE7XG4gICAgLy8gbW9zdCBjYXNlc1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RyID0gZml4ZWRXaWR0aCA/ICdmaXhlZFdpZHRoJyA6ICdpdGVtcycsXG4gICAgICAgICAgYXJyID0gW107XG5cbiAgICAgIGlmIChmaXhlZFdpZHRoIHx8IG9wdGlvbnNbc3RyXSA8IHNsaWRlQ291bnQpIHsgYXJyLnB1c2gob3B0aW9uc1tzdHJdKTsgfVxuXG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgdmFyIHRlbSA9IHJlc3BvbnNpdmVbYnBdW3N0cl07XG4gICAgICAgICAgaWYgKHRlbSAmJiAoZml4ZWRXaWR0aCB8fCB0ZW0gPCBzbGlkZUNvdW50KSkgeyBhcnIucHVzaCh0ZW0pOyB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7IGFyci5wdXNoKDApOyB9XG5cbiAgICAgIHJldHVybiBNYXRoLmNlaWwoZml4ZWRXaWR0aCA/IHZpZXdwb3J0TWF4IC8gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyKSA6IE1hdGgubWF4LmFwcGx5KG51bGwsIGFycikpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENsb25lQ291bnRGb3JMb29wICgpIHtcbiAgICB2YXIgaXRlbXNNYXggPSBnZXRJdGVtc01heCgpLFxuICAgICAgICByZXN1bHQgPSBjYXJvdXNlbCA/IE1hdGguY2VpbCgoaXRlbXNNYXggKiA1IC0gc2xpZGVDb3VudCkvMikgOiAoaXRlbXNNYXggKiA0IC0gc2xpZGVDb3VudCk7XG4gICAgcmVzdWx0ID0gTWF0aC5tYXgoaXRlbXNNYXgsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4gaGFzT3B0aW9uKCdlZGdlUGFkZGluZycpID8gcmVzdWx0ICsgMSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdpbmRvd1dpZHRoICgpIHtcbiAgICByZXR1cm4gd2luLmlubmVyV2lkdGggfHwgZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2MuYm9keS5jbGllbnRXaWR0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEluc2VydFBvc2l0aW9uIChwb3MpIHtcbiAgICByZXR1cm4gcG9zID09PSAndG9wJyA/ICdhZnRlcmJlZ2luJyA6ICdiZWZvcmVlbmQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2xpZW50V2lkdGggKGVsKSB7XG4gICAgdmFyIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSwgcmVjdCwgd2lkdGg7XG4gICAgZWwuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICByZWN0ID0gZGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHdpZHRoID0gcmVjdC5yaWdodCAtIHJlY3QubGVmdDtcbiAgICBkaXYucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHdpZHRoIHx8IGdldENsaWVudFdpZHRoKGVsLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Vmlld3BvcnRXaWR0aCAoKSB7XG4gICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZWRnZVBhZGRpbmcgKiAyIC0gZ3V0dGVyIDogMDtcbiAgICByZXR1cm4gZ2V0Q2xpZW50V2lkdGgoY29udGFpbmVyUGFyZW50KSAtIGdhcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc09wdGlvbiAoaXRlbSkge1xuICAgIGlmIChvcHRpb25zW2l0ZW1dKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zaXZlW2JwXVtpdGVtXSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gZ2V0IG9wdGlvbjpcbiAgLy8gZml4ZWQgd2lkdGg6IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXIgPT4gaXRlbXNcbiAgLy8gb3RoZXJzOiB3aW5kb3cgd2lkdGggPT4gYWxsIHZhcmlhYmxlc1xuICAvLyBhbGw6IGl0ZW1zID0+IHNsaWRlQnlcbiAgZnVuY3Rpb24gZ2V0T3B0aW9uIChpdGVtLCB3dykge1xuICAgIGlmICh3dyA9PSBudWxsKSB7IHd3ID0gd2luZG93V2lkdGg7IH1cblxuICAgIGlmIChpdGVtID09PSAnaXRlbXMnICYmIGZpeGVkV2lkdGgpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKCh2aWV3cG9ydCArIGd1dHRlcikgLyAoZml4ZWRXaWR0aCArIGd1dHRlcikpIHx8IDE7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlc3VsdCA9IG9wdGlvbnNbaXRlbV07XG5cbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICAvLyBicDogY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICAgICAgaWYgKHd3ID49IHBhcnNlSW50KGJwKSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0gaW4gcmVzcG9uc2l2ZVticF0pIHsgcmVzdWx0ID0gcmVzcG9uc2l2ZVticF1baXRlbV07IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0gPT09ICdzbGlkZUJ5JyAmJiByZXN1bHQgPT09ICdwYWdlJykgeyByZXN1bHQgPSBnZXRPcHRpb24oJ2l0ZW1zJyk7IH1cbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgKGl0ZW0gPT09ICdzbGlkZUJ5JyB8fCBpdGVtID09PSAnaXRlbXMnKSkgeyByZXN1bHQgPSBNYXRoLmZsb29yKHJlc3VsdCk7IH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZU1hcmdpbkxlZnQgKGkpIHtcbiAgICByZXR1cm4gQ0FMQyA/IFxuICAgICAgQ0FMQyArICcoJyArIGkgKiAxMDAgKyAnJSAvICcgKyBzbGlkZUNvdW50TmV3ICsgJyknIDogXG4gICAgICBpICogMTAwIC8gc2xpZGVDb3VudE5ldyArICclJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldElubmVyV3JhcHBlclN0eWxlcyAoZWRnZVBhZGRpbmdUZW0sIGd1dHRlclRlbSwgZml4ZWRXaWR0aFRlbSwgc3BlZWRUZW0sIGF1dG9IZWlnaHRCUCkge1xuICAgIHZhciBzdHIgPSAnJztcblxuICAgIGlmIChlZGdlUGFkZGluZ1RlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmdUZW07XG4gICAgICBpZiAoZ3V0dGVyVGVtKSB7IGdhcCAtPSBndXR0ZXJUZW07IH1cbiAgICAgIHN0ciA9IGhvcml6b250YWwgP1xuICAgICAgICAnbWFyZ2luOiAwICcgKyBnYXAgKyAncHggMCAnICsgZWRnZVBhZGRpbmdUZW0gKyAncHg7JyA6XG4gICAgICAgICdtYXJnaW46ICcgKyBlZGdlUGFkZGluZ1RlbSArICdweCAwICcgKyBnYXAgKyAncHggMDsnO1xuICAgIH0gZWxzZSBpZiAoZ3V0dGVyVGVtICYmICFmaXhlZFdpZHRoVGVtKSB7XG4gICAgICB2YXIgZ3V0dGVyVGVtVW5pdCA9ICctJyArIGd1dHRlclRlbSArICdweCcsXG4gICAgICAgICAgZGlyID0gaG9yaXpvbnRhbCA/IGd1dHRlclRlbVVuaXQgKyAnIDAgMCcgOiAnMCAnICsgZ3V0dGVyVGVtVW5pdCArICcgMCc7XG4gICAgICBzdHIgPSAnbWFyZ2luOiAwICcgKyBkaXIgKyAnOyc7XG4gICAgfVxuXG4gICAgaWYgKCFjYXJvdXNlbCAmJiBhdXRvSGVpZ2h0QlAgJiYgVFJBTlNJVElPTkRVUkFUSU9OICYmIHNwZWVkVGVtKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZFRlbSk7IH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyV2lkdGggKGZpeGVkV2lkdGhUZW0sIGd1dHRlclRlbSwgaXRlbXNUZW0pIHtcbiAgICBpZiAoZml4ZWRXaWR0aFRlbSkge1xuICAgICAgcmV0dXJuIChmaXhlZFdpZHRoVGVtICsgZ3V0dGVyVGVtKSAqIHNsaWRlQ291bnROZXcgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ0FMQyA/XG4gICAgICAgIENBTEMgKyAnKCcgKyBzbGlkZUNvdW50TmV3ICogMTAwICsgJyUgLyAnICsgaXRlbXNUZW0gKyAnKScgOlxuICAgICAgICBzbGlkZUNvdW50TmV3ICogMTAwIC8gaXRlbXNUZW0gKyAnJSc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVXaWR0aFN0eWxlIChmaXhlZFdpZHRoVGVtLCBndXR0ZXJUZW0sIGl0ZW1zVGVtKSB7XG4gICAgdmFyIHdpZHRoO1xuXG4gICAgaWYgKGZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHdpZHRoID0gKGZpeGVkV2lkdGhUZW0gKyBndXR0ZXJUZW0pICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjYXJvdXNlbCkgeyBpdGVtc1RlbSA9IE1hdGguZmxvb3IoaXRlbXNUZW0pOyB9XG4gICAgICB2YXIgZGl2aWRlbmQgPSBjYXJvdXNlbCA/IHNsaWRlQ291bnROZXcgOiBpdGVtc1RlbTtcbiAgICAgIHdpZHRoID0gQ0FMQyA/IFxuICAgICAgICBDQUxDICsgJygxMDAlIC8gJyArIGRpdmlkZW5kICsgJyknIDogXG4gICAgICAgIDEwMCAvIGRpdmlkZW5kICsgJyUnO1xuICAgIH1cblxuICAgIHdpZHRoID0gJ3dpZHRoOicgKyB3aWR0aDtcblxuICAgIC8vIGlubmVyIHNsaWRlcjogb3ZlcndyaXRlIG91dGVyIHNsaWRlciBzdHlsZXNcbiAgICByZXR1cm4gbmVzdGVkICE9PSAnaW5uZXInID8gd2lkdGggKyAnOycgOiB3aWR0aCArICcgIWltcG9ydGFudDsnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVHdXR0ZXJTdHlsZSAoZ3V0dGVyVGVtKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuXG4gICAgLy8gZ3V0dGVyIG1heWJlIGludGVyZ2VyIHx8IDBcbiAgICAvLyBzbyBjYW4ndCB1c2UgJ2lmIChndXR0ZXIpJ1xuICAgIGlmIChndXR0ZXJUZW0gIT09IGZhbHNlKSB7XG4gICAgICB2YXIgcHJvcCA9IGhvcml6b250YWwgPyAncGFkZGluZy0nIDogJ21hcmdpbi0nLFxuICAgICAgICAgIGRpciA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbSc7XG4gICAgICBzdHIgPSBwcm9wICsgIGRpciArICc6ICcgKyBndXR0ZXJUZW0gKyAncHg7JztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q1NTUHJlZml4IChuYW1lLCBudW0pIHtcbiAgICB2YXIgcHJlZml4ID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5sZW5ndGggLSBudW0pLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHByZWZpeCkgeyBwcmVmaXggPSAnLScgKyBwcmVmaXggKyAnLSc7IH1cblxuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZSAoc3BlZWQpIHtcbiAgICByZXR1cm4gZ2V0Q1NTUHJlZml4KFRSQU5TSVRJT05EVVJBVElPTiwgMTgpICsgJ3RyYW5zaXRpb24tZHVyYXRpb246JyArIHNwZWVkIC8gMTAwMCArICdzOyc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlIChzcGVlZCkge1xuICAgIHJldHVybiBnZXRDU1NQcmVmaXgoQU5JTUFUSU9ORFVSQVRJT04sIDE3KSArICdhbmltYXRpb24tZHVyYXRpb246JyArIHNwZWVkIC8gMTAwMCArICdzOyc7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U3RydWN0dXJlICgpIHtcbiAgICB2YXIgY2xhc3NPdXRlciA9ICd0bnMtb3V0ZXInLFxuICAgICAgICBjbGFzc0lubmVyID0gJ3Rucy1pbm5lcicsXG4gICAgICAgIGhhc0d1dHRlciA9IGhhc09wdGlvbignZ3V0dGVyJyk7XG5cbiAgICBvdXRlcldyYXBwZXIuY2xhc3NOYW1lID0gY2xhc3NPdXRlcjtcbiAgICBpbm5lcldyYXBwZXIuY2xhc3NOYW1lID0gY2xhc3NJbm5lcjtcbiAgICBvdXRlcldyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1vdyc7XG4gICAgaW5uZXJXcmFwcGVyLmlkID0gc2xpZGVJZCArICctaXcnO1xuXG4gICAgLy8gc2V0IGNvbnRhaW5lciBwcm9wZXJ0aWVzXG4gICAgaWYgKGNvbnRhaW5lci5pZCA9PT0gJycpIHsgY29udGFpbmVyLmlkID0gc2xpZGVJZDsgfVxuICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gUEVSQ0VOVEFHRUxBWU9VVCB8fCBhdXRvV2lkdGggPyAnIHRucy1zdWJwaXhlbCcgOiAnIHRucy1uby1zdWJwaXhlbCc7XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSBDQUxDID8gJyB0bnMtY2FsYycgOiAnIHRucy1uby1jYWxjJztcbiAgICBpZiAoYXV0b1dpZHRoKSB7IG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gJyB0bnMtYXV0b3dpZHRoJzsgfVxuICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gJyB0bnMtJyArIG9wdGlvbnMuYXhpcztcbiAgICBjb250YWluZXIuY2xhc3NOYW1lICs9IG5ld0NvbnRhaW5lckNsYXNzZXM7XG5cbiAgICAvLyBhZGQgY29uc3RyYWluIGxheWVyIGZvciBjYXJvdXNlbFxuICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgbWlkZGxlV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1pZGRsZVdyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1tdyc7XG4gICAgICBtaWRkbGVXcmFwcGVyLmNsYXNzTmFtZSA9ICd0bnMtb3ZoJztcblxuICAgICAgb3V0ZXJXcmFwcGVyLmFwcGVuZENoaWxkKG1pZGRsZVdyYXBwZXIpO1xuICAgICAgbWlkZGxlV3JhcHBlci5hcHBlbmRDaGlsZChpbm5lcldyYXBwZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRlcldyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJXcmFwcGVyKTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b0hlaWdodCkge1xuICAgICAgdmFyIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG4gICAgICB3cC5jbGFzc05hbWUgKz0gJyB0bnMtYWgnO1xuICAgIH1cblxuICAgIGNvbnRhaW5lclBhcmVudC5pbnNlcnRCZWZvcmUob3V0ZXJXcmFwcGVyLCBjb250YWluZXIpO1xuICAgIGlubmVyV3JhcHBlci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgLy8gYWRkIGlkLCBjbGFzcywgYXJpYSBhdHRyaWJ1dGVzIFxuICAgIC8vIGJlZm9yZSBjbG9uZSBzbGlkZXNcbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIGFkZENsYXNzKGl0ZW0sICd0bnMtaXRlbScpO1xuICAgICAgaWYgKCFpdGVtLmlkKSB7IGl0ZW0uaWQgPSBzbGlkZUlkICsgJy1pdGVtJyArIGk7IH1cbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgYW5pbWF0ZU5vcm1hbCkgeyBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTsgfVxuICAgICAgc2V0QXR0cnMoaXRlbSwge1xuICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gIyMgY2xvbmUgc2xpZGVzXG4gICAgLy8gY2Fyb3VzZWw6IG4gKyBzbGlkZXMgKyBuXG4gICAgLy8gZ2FsbGVyeTogICAgICBzbGlkZXMgKyBuXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBmcmFnbWVudEJlZm9yZSA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksIFxuICAgICAgICAgIGZyYWdtZW50QWZ0ZXIgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xuICAgICAgICB2YXIgbnVtID0gaiVzbGlkZUNvdW50LFxuICAgICAgICAgICAgY2xvbmVGaXJzdCA9IHNsaWRlSXRlbXNbbnVtXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgIHJlbW92ZUF0dHJzKGNsb25lRmlyc3QsICdpZCcpO1xuICAgICAgICBmcmFnbWVudEFmdGVyLmluc2VydEJlZm9yZShjbG9uZUZpcnN0LCBmcmFnbWVudEFmdGVyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgIHZhciBjbG9uZUxhc3QgPSBzbGlkZUl0ZW1zW3NsaWRlQ291bnQgLSAxIC0gbnVtXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVMYXN0LCAnaWQnKTtcbiAgICAgICAgICBmcmFnbWVudEJlZm9yZS5hcHBlbmRDaGlsZChjbG9uZUxhc3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZnJhZ21lbnRCZWZvcmUsIGNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudEFmdGVyKTtcbiAgICAgIHNsaWRlSXRlbXMgPSBjb250YWluZXIuY2hpbGRyZW47XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtICgpIHtcbiAgICAvLyAjIyBpbWFnZXMgbG9hZGVkL2ZhaWxlZFxuICAgIGlmIChoYXNPcHRpb24oJ2F1dG9IZWlnaHQnKSB8fCBhdXRvV2lkdGggfHwgIWhvcml6b250YWwpIHtcbiAgICAgIHZhciBpbWdzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuXG4gICAgICAvLyBhZGQgY29tcGxldGUgY2xhc3MgaWYgYWxsIGltYWdlcyBhcmUgbG9hZGVkL2ZhaWxlZFxuICAgICAgZm9yRWFjaChpbWdzLCBmdW5jdGlvbihpbWcpIHtcbiAgICAgICAgdmFyIHNyYyA9IGltZy5zcmM7XG4gICAgICAgIFxuICAgICAgICBpZiAoc3JjICYmIHNyYy5pbmRleE9mKCdkYXRhOmltYWdlJykgPCAwKSB7XG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcbiAgICAgICAgICBpbWcuc3JjID0gJyc7XG4gICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgICBhZGRDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWxhenlsb2FkKSB7XG4gICAgICAgICAgaW1nTG9hZGVkKGltZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBBbGwgaW1ncyBhcmUgY29tcGxldGVkXG4gICAgICByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGFycmF5RnJvbU5vZGVMaXN0KGltZ3MpLCBmdW5jdGlvbigpIHsgaW1nc0NvbXBsZXRlID0gdHJ1ZTsgfSk7IH0pO1xuXG4gICAgICAvLyBDaGVjayBpbWdzIGluIHdpbmRvdyBvbmx5IGZvciBhdXRvIGhlaWdodFxuICAgICAgaWYgKCFhdXRvV2lkdGggJiYgaG9yaXpvbnRhbCkgeyBpbWdzID0gZ2V0SW1hZ2VBcnJheShpbmRleCwgTWF0aC5taW4oaW5kZXggKyBpdGVtcyAtIDEsIHNsaWRlQ291bnROZXcgLSAxKSk7IH1cblxuICAgICAgbGF6eWxvYWQgPyBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjaygpIDogcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhhcnJheUZyb21Ob2RlTGlzdChpbWdzKSwgaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2spOyB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzZXQgY29udGFpbmVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxuICAgICAgaWYgKGNhcm91c2VsKSB7IGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7IH1cblxuICAgICAgLy8gdXBkYXRlIHNsaWRlciB0b29scyBhbmQgZXZlbnRzXG4gICAgICBpbml0VG9vbHMoKTtcbiAgICAgIGluaXRFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayAoKSB7XG4gICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgLy8gY2hlY2sgc3R5bGVzIGFwcGxpY2F0aW9uXG4gICAgICB2YXIgbnVtID0gbG9vcCA/IGluZGV4IDogc2xpZGVDb3VudCAtIDE7XG4gICAgICAoZnVuY3Rpb24gc3R5bGVzQXBwbGljYXRpb25DaGVjaygpIHtcbiAgICAgICAgc2xpZGVJdGVtc1tudW0gLSAxXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodC50b0ZpeGVkKDIpID09PSBzbGlkZUl0ZW1zW251bV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdC50b0ZpeGVkKDIpID9cbiAgICAgICAgaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUoKSA6XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgc3R5bGVzQXBwbGljYXRpb25DaGVjaygpOyB9LCAxNik7XG4gICAgICB9KSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUgKCkge1xuICAgIC8vIHJ1biBGbigpcyB3aGljaCBhcmUgcmVseSBvbiBpbWFnZSBsb2FkaW5nXG4gICAgaWYgKCFob3Jpem9udGFsIHx8IGF1dG9XaWR0aCkge1xuICAgICAgc2V0U2xpZGVQb3NpdGlvbnMoKTtcblxuICAgICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICByaWdodEJvdW5kYXJ5ID0gZ2V0UmlnaHRCb3VuZGFyeSgpO1xuICAgICAgICBpZiAoZnJlZXphYmxlKSB7IGZyZWV6ZSA9IGdldEZyZWV6ZSgpOyB9XG4gICAgICAgIGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgLy8gPD0gc2xpZGVQb3NpdGlvbnMsIHJpZ2h0Qm91bmRhcnkgPD1cbiAgICAgICAgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2V0IGNvbnRhaW5lciB0cmFuc2Zvcm0gcHJvcGVydHlcbiAgICBpZiAoY2Fyb3VzZWwpIHsgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTsgfVxuXG4gICAgLy8gdXBkYXRlIHNsaWRlciB0b29scyBhbmQgZXZlbnRzXG4gICAgaW5pdFRvb2xzKCk7XG4gICAgaW5pdEV2ZW50cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNoZWV0ICgpIHtcbiAgICAvLyBnYWxsZXJ5OlxuICAgIC8vIHNldCBhbmltYXRpb24gY2xhc3NlcyBhbmQgbGVmdCB2YWx1ZSBmb3IgZ2FsbGVyeSBzbGlkZXJcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAjIyMjIExBWU9VVFxuXG4gICAgLy8gIyMgSU5MSU5FLUJMT0NLIFZTIEZMT0FUXG5cbiAgICAvLyAjIyBQZXJjZW50YWdlTGF5b3V0OlxuICAgIC8vIHNsaWRlczogaW5saW5lLWJsb2NrXG4gICAgLy8gcmVtb3ZlIGJsYW5rIHNwYWNlIGJldHdlZW4gc2xpZGVzIGJ5IHNldCBmb250LXNpemU6IDBcblxuICAgIC8vICMjIE5vbiBQZXJjZW50YWdlTGF5b3V0OlxuICAgIC8vIHNsaWRlczogZmxvYXRcbiAgICAvLyAgICAgICAgIG1hcmdpbi1yaWdodDogLTEwMCVcbiAgICAvLyAgICAgICAgIG1hcmdpbi1sZWZ0OiB+XG5cbiAgICAvLyBSZXNvdXJjZTogaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMTQ3dXAyNDV3d1RYZVFZdmUzQlJTQUQ0b1ZjdlFtdUdzRnRlSk9lQTV4TlEvZWRpdD91c3A9c2hhcmluZ1xuICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICBpZiAoUEVSQ0VOVEFHRUxBWU9VVCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCAnZm9udC1zaXplOicgKyB3aW4uZ2V0Q29tcHV0ZWRTdHlsZShzbGlkZUl0ZW1zWzBdKS5mb250U2l6ZSArICc7JywgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCwgJ2ZvbnQtc2l6ZTowOycsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9IGVsc2UgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24gKHNsaWRlLCBpKSB7XG4gICAgICAgICAgc2xpZGUuc3R5bGUubWFyZ2luTGVmdCA9IGdldFNsaWRlTWFyZ2luTGVmdChpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyAjIyBCQVNJQyBTVFlMRVNcbiAgICBpZiAoQ1NTTVEpIHtcbiAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlXG4gICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7XG4gICAgICAgIHZhciBzdHIgPSBtaWRkbGVXcmFwcGVyICYmIG9wdGlvbnMuYXV0b0hlaWdodCA/IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKG9wdGlvbnMuc3BlZWQpIDogJyc7XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnLW13Jywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgc3RyID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKG9wdGlvbnMuZWRnZVBhZGRpbmcsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuc3BlZWQsIG9wdGlvbnMuYXV0b0hlaWdodCk7XG4gICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJy1pdycsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcblxuICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xuICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/ICd3aWR0aDonICsgZ2V0Q29udGFpbmVyV2lkdGgob3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5pdGVtcykgKyAnOycgOiAnJztcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2xpZGUgc3R5bGVzXG4gICAgICBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyBnZXRTbGlkZVdpZHRoU3R5bGUob3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5pdGVtcykgOiAnJztcbiAgICAgIGlmIChvcHRpb25zLmd1dHRlcikgeyBzdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShvcHRpb25zLmd1dHRlcik7IH1cbiAgICAgIC8vIHNldCBnYWxsZXJ5IGl0ZW1zIHRyYW5zaXRpb24tZHVyYXRpb25cbiAgICAgIGlmICghY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XG4gICAgICAgIGlmIChBTklNQVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzdHIpIHsgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7IH1cblxuICAgIC8vIG5vbiBDU1MgbWVkaWFxdWVyaWVzOiBJRThcbiAgICAvLyAjIyB1cGRhdGUgaW5uZXIgd3JhcHBlciwgY29udGFpbmVyLCBzbGlkZXMgaWYgbmVlZGVkXG4gICAgLy8gc2V0IGlubGluZSBzdHlsZXMgZm9yIGlubmVyIHdyYXBwZXIgJiBjb250YWluZXJcbiAgICAvLyBpbnNlcnQgc3R5bGVzaGVldCAob25lIGxpbmUpIGZvciBzbGlkZXMgb25seSAoc2luY2Ugc2xpZGVzIGFyZSBtYW55KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZXNcbiAgICAgIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uKCk7XG5cbiAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICBpbm5lcldyYXBwZXIuc3R5bGUuY3NzVGV4dCA9IGdldElubmVyV3JhcHBlclN0eWxlcyhlZGdlUGFkZGluZywgZ3V0dGVyLCBmaXhlZFdpZHRoLCBhdXRvSGVpZ2h0KTtcblxuICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xuICAgICAgaWYgKGNhcm91c2VsICYmIGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2xpZGUgc3R5bGVzXG4gICAgICB2YXIgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpIDogJyc7XG4gICAgICBpZiAoZ3V0dGVyKSB7IHN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlcik7IH1cblxuICAgICAgLy8gYXBwZW5kIHRvIHRoZSBsYXN0IGxpbmVcbiAgICAgIGlmIChzdHIpIHsgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7IH1cbiAgICB9XG5cbiAgICAvLyAjIyBNRURJQVFVRVJJRVNcbiAgICBpZiAocmVzcG9uc2l2ZSAmJiBDU1NNUSkge1xuICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAvLyBicDogY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICAgIGJwID0gcGFyc2VJbnQoYnApO1xuXG4gICAgICAgIHZhciBvcHRzID0gcmVzcG9uc2l2ZVticF0sXG4gICAgICAgICAgICBzdHIgPSAnJyxcbiAgICAgICAgICAgIG1pZGRsZVdyYXBwZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIGlubmVyV3JhcHBlclN0ciA9ICcnLFxuICAgICAgICAgICAgY29udGFpbmVyU3RyID0gJycsXG4gICAgICAgICAgICBzbGlkZVN0ciA9ICcnLFxuICAgICAgICAgICAgaXRlbXNCUCA9ICFhdXRvV2lkdGggPyBnZXRPcHRpb24oJ2l0ZW1zJywgYnApIDogbnVsbCxcbiAgICAgICAgICAgIGZpeGVkV2lkdGhCUCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcsIGJwKSxcbiAgICAgICAgICAgIHNwZWVkQlAgPSBnZXRPcHRpb24oJ3NwZWVkJywgYnApLFxuICAgICAgICAgICAgZWRnZVBhZGRpbmdCUCA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnLCBicCksXG4gICAgICAgICAgICBhdXRvSGVpZ2h0QlAgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnLCBicCksXG4gICAgICAgICAgICBndXR0ZXJCUCA9IGdldE9wdGlvbignZ3V0dGVyJywgYnApO1xuXG4gICAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0cmluZ1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OICYmIG1pZGRsZVdyYXBwZXIgJiYgZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JywgYnApICYmICdzcGVlZCcgaW4gb3B0cykge1xuICAgICAgICAgIG1pZGRsZVdyYXBwZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJy1td3snICsgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCkgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbm5lciB3cmFwcGVyIHN0cmluZ1xuICAgICAgICBpZiAoJ2VkZ2VQYWRkaW5nJyBpbiBvcHRzIHx8ICdndXR0ZXInIGluIG9wdHMpIHtcbiAgICAgICAgICBpbm5lcldyYXBwZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJy1pd3snICsgZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nQlAsIGd1dHRlckJQLCBmaXhlZFdpZHRoQlAsIHNwZWVkQlAsIGF1dG9IZWlnaHRCUCkgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb250YWluZXIgc3RyaW5nXG4gICAgICAgIGlmIChjYXJvdXNlbCAmJiBob3Jpem9udGFsICYmICFhdXRvV2lkdGggJiYgKCdmaXhlZFdpZHRoJyBpbiBvcHRzIHx8ICdpdGVtcycgaW4gb3B0cyB8fCAoZml4ZWRXaWR0aCAmJiAnZ3V0dGVyJyBpbiBvcHRzKSkpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgPSAnd2lkdGg6JyArIGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGhCUCwgZ3V0dGVyQlAsIGl0ZW1zQlApICsgJzsnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgY29udGFpbmVyU3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb250YWluZXJTdHIpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJ3snICsgY29udGFpbmVyU3RyICsgJ30nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2xpZGUgc3RyaW5nXG4gICAgICAgIGlmICgnZml4ZWRXaWR0aCcgaW4gb3B0cyB8fCAoZml4ZWRXaWR0aCAmJiAnZ3V0dGVyJyBpbiBvcHRzKSB8fCAhY2Fyb3VzZWwgJiYgJ2l0ZW1zJyBpbiBvcHRzKSB7XG4gICAgICAgICAgc2xpZGVTdHIgKz0gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGhCUCwgZ3V0dGVyQlAsIGl0ZW1zQlApO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnZ3V0dGVyJyBpbiBvcHRzKSB7XG4gICAgICAgICAgc2xpZGVTdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXJCUCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IGdhbGxlcnkgaXRlbXMgdHJhbnNpdGlvbi1kdXJhdGlvblxuICAgICAgICBpZiAoIWNhcm91c2VsICYmICdzcGVlZCcgaW4gb3B0cykge1xuICAgICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc2xpZGVTdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7IH1cbiAgICAgICAgICBpZiAoQU5JTUFUSU9ORFVSQVRJT04pIHsgc2xpZGVTdHIgKz0gZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzbGlkZVN0cikgeyBzbGlkZVN0ciA9ICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVteycgKyBzbGlkZVN0ciArICd9JzsgfVxuXG4gICAgICAgIC8vIGFkZCB1cFxuICAgICAgICBzdHIgPSBtaWRkbGVXcmFwcGVyU3RyICsgaW5uZXJXcmFwcGVyU3RyICsgY29udGFpbmVyU3RyICsgc2xpZGVTdHI7XG5cbiAgICAgICAgaWYgKHN0cikge1xuICAgICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoJ0BtZWRpYSAobWluLXdpZHRoOiAnICsgYnAgLyAxNiArICdlbSkgeycgKyBzdHIgKyAnfScsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0VG9vbHMgKCkge1xuICAgIC8vID09IHNsaWRlcyA9PVxuICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG5cbiAgICAvLyA9PSBsaXZlIHJlZ2lvbiA9PVxuICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCAnPGRpdiBjbGFzcz1cInRucy1saXZlcmVnaW9uIHRucy12aXN1YWxseS1oaWRkZW5cIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBhcmlhLWF0b21pYz1cInRydWVcIj5zbGlkZSA8c3BhbiBjbGFzcz1cImN1cnJlbnRcIj4nICsgZ2V0TGl2ZVJlZ2lvblN0cigpICsgJzwvc3Bhbj4gIG9mICcgKyBzbGlkZUNvdW50ICsgJzwvZGl2PicpO1xuICAgIGxpdmVyZWdpb25DdXJyZW50ID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtbGl2ZXJlZ2lvbiAuY3VycmVudCcpO1xuXG4gICAgLy8gPT0gYXV0b3BsYXlJbml0ID09XG4gICAgaWYgKGhhc0F1dG9wbGF5KSB7XG4gICAgICB2YXIgdHh0ID0gYXV0b3BsYXkgPyAnc3RvcCcgOiAnc3RhcnQnO1xuICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7XG4gICAgICAgIHNldEF0dHJzKGF1dG9wbGF5QnV0dG9uLCB7J2RhdGEtYWN0aW9uJzogdHh0fSk7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYXV0b3BsYXlCdXR0b25PdXRwdXQpIHtcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLmF1dG9wbGF5UG9zaXRpb24pLCAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cIicgKyB0eHQgKyAnXCI+JyArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMF0gKyB0eHQgKyBhdXRvcGxheUh0bWxTdHJpbmdzWzFdICsgYXV0b3BsYXlUZXh0WzBdICsgJzwvYnV0dG9uPicpO1xuICAgICAgICBhdXRvcGxheUJ1dHRvbiA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb25dJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBldmVudFxuICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7XG4gICAgICAgIGFkZEV2ZW50cyhhdXRvcGxheUJ1dHRvbiwgeydjbGljayc6IHRvZ2dsZUF1dG9wbGF5fSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgICBzdGFydEF1dG9wbGF5KCk7XG4gICAgICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2UpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpOyB9XG4gICAgICAgIGlmIChhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5KSB7IGFkZEV2ZW50cyhjb250YWluZXIsIHZpc2liaWxpdHlFdmVudCk7IH1cbiAgICAgIH1cbiAgICB9XG4gXG4gICAgLy8gPT0gbmF2SW5pdCA9PVxuICAgIGlmIChoYXNOYXYpIHtcbiAgICAgIHZhciBpbml0SW5kZXggPSAhY2Fyb3VzZWwgPyAwIDogY2xvbmVDb3VudDtcbiAgICAgIC8vIGN1c3RvbWl6ZWQgbmF2XG4gICAgICAvLyB3aWxsIG5vdCBoaWRlIHRoZSBuYXZzIGluIGNhc2UgdGhleSdyZSB0aHVtYm5haWxzXG4gICAgICBpZiAobmF2Q29udGFpbmVyKSB7XG4gICAgICAgIHNldEF0dHJzKG5hdkNvbnRhaW5lciwgeydhcmlhLWxhYmVsJzogJ0Nhcm91c2VsIFBhZ2luYXRpb24nfSk7XG4gICAgICAgIG5hdkl0ZW1zID0gbmF2Q29udGFpbmVyLmNoaWxkcmVuO1xuICAgICAgICBmb3JFYWNoKG5hdkl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAgICAgc2V0QXR0cnMoaXRlbSwge1xuICAgICAgICAgICAgJ2RhdGEtbmF2JzogaSxcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgICAgICAnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChpICsgMSksXG4gICAgICAgICAgICAnYXJpYS1jb250cm9scyc6IHNsaWRlSWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAvLyBnZW5lcmF0ZWQgbmF2IFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5hdkh0bWwgPSAnJyxcbiAgICAgICAgICAgIGhpZGRlblN0ciA9IG5hdkFzVGh1bWJuYWlscyA/ICcnIDogJ3N0eWxlPVwiZGlzcGxheTpub25lXCInO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlQ291bnQ7IGkrKykge1xuICAgICAgICAgIC8vIGhpZGUgbmF2IGl0ZW1zIGJ5IGRlZmF1bHRcbiAgICAgICAgICBuYXZIdG1sICs9ICc8YnV0dG9uIGRhdGEtbmF2PVwiJyArIGkgKydcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsgJ1wiICcgKyBoaWRkZW5TdHIgKyAnIGFyaWEtbGFiZWw9XCInICsgbmF2U3RyICsgKGkgKyAxKSArJ1wiPjwvYnV0dG9uPic7XG4gICAgICAgIH1cbiAgICAgICAgbmF2SHRtbCA9ICc8ZGl2IGNsYXNzPVwidG5zLW5hdlwiIGFyaWEtbGFiZWw9XCJDYXJvdXNlbCBQYWdpbmF0aW9uXCI+JyArIG5hdkh0bWwgKyAnPC9kaXY+JztcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLm5hdlBvc2l0aW9uKSwgbmF2SHRtbCk7XG5cbiAgICAgICAgbmF2Q29udGFpbmVyID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtbmF2Jyk7XG4gICAgICAgIG5hdkl0ZW1zID0gbmF2Q29udGFpbmVyLmNoaWxkcmVuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVOYXZWaXNpYmlsaXR5KCk7XG5cbiAgICAgIC8vIGFkZCB0cmFuc2l0aW9uXG4gICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBUUkFOU0lUSU9ORFVSQVRJT04uc3Vic3RyaW5nKDAsIFRSQU5TSVRJT05EVVJBVElPTi5sZW5ndGggLSAxOCkudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgIHN0ciA9ICd0cmFuc2l0aW9uOiBhbGwgJyArIHNwZWVkIC8gMTAwMCArICdzJztcblxuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgc3RyID0gJy0nICsgcHJlZml4ICsgJy0nICsgc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJ1thcmlhLWNvbnRyb2xzXj0nICsgc2xpZGVJZCArICctaXRlbV0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIHNldEF0dHJzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sIHsnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXggKyAxKSArIG5hdlN0ckN1cnJlbnR9KTtcbiAgICAgIHJlbW92ZUF0dHJzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sICd0YWJpbmRleCcpO1xuICAgICAgYWRkQ2xhc3MobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgbmF2QWN0aXZlQ2xhc3MpO1xuXG4gICAgICAvLyBhZGQgZXZlbnRzXG4gICAgICBhZGRFdmVudHMobmF2Q29udGFpbmVyLCBuYXZFdmVudHMpO1xuICAgIH1cblxuXG5cbiAgICAvLyA9PSBjb250cm9sc0luaXQgPT1cbiAgICBpZiAoaGFzQ29udHJvbHMpIHtcbiAgICAgIGlmICghY29udHJvbHNDb250YWluZXIgJiYgKCFwcmV2QnV0dG9uIHx8ICFuZXh0QnV0dG9uKSkge1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMuY29udHJvbHNQb3NpdGlvbiksICc8ZGl2IGNsYXNzPVwidG5zLWNvbnRyb2xzXCIgYXJpYS1sYWJlbD1cIkNhcm91c2VsIE5hdmlnYXRpb25cIiB0YWJpbmRleD1cIjBcIj48YnV0dG9uIGRhdGEtY29udHJvbHM9XCJwcmV2XCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMF0gKyAnPC9idXR0b24+PGJ1dHRvbiBkYXRhLWNvbnRyb2xzPVwibmV4dFwiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKydcIj4nICsgY29udHJvbHNUZXh0WzFdICsgJzwvYnV0dG9uPjwvZGl2PicpO1xuXG4gICAgICAgIGNvbnRyb2xzQ29udGFpbmVyID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtY29udHJvbHMnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwcmV2QnV0dG9uIHx8ICFuZXh0QnV0dG9uKSB7XG4gICAgICAgIHByZXZCdXR0b24gPSBjb250cm9sc0NvbnRhaW5lci5jaGlsZHJlblswXTtcbiAgICAgICAgbmV4dEJ1dHRvbiA9IGNvbnRyb2xzQ29udGFpbmVyLmNoaWxkcmVuWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBzZXRBdHRycyhjb250cm9sc0NvbnRhaW5lciwge1xuICAgICAgICAgICdhcmlhLWxhYmVsJzogJ0Nhcm91c2VsIE5hdmlnYXRpb24nLFxuICAgICAgICAgICd0YWJpbmRleCc6ICcwJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgfHwgKG9wdGlvbnMucHJldkJ1dHRvbiAmJiBvcHRpb25zLm5leHRCdXR0b24pKSB7XG4gICAgICAgIHNldEF0dHJzKFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXSwge1xuICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcbiAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgfHwgKG9wdGlvbnMucHJldkJ1dHRvbiAmJiBvcHRpb25zLm5leHRCdXR0b24pKSB7XG4gICAgICAgIHNldEF0dHJzKHByZXZCdXR0b24sIHsnZGF0YS1jb250cm9scycgOiAncHJldid9KTtcbiAgICAgICAgc2V0QXR0cnMobmV4dEJ1dHRvbiwgeydkYXRhLWNvbnRyb2xzJyA6ICduZXh0J30pO1xuICAgICAgfVxuXG4gICAgICBwcmV2SXNCdXR0b24gPSBpc0J1dHRvbihwcmV2QnV0dG9uKTtcbiAgICAgIG5leHRJc0J1dHRvbiA9IGlzQnV0dG9uKG5leHRCdXR0b24pO1xuXG4gICAgICB1cGRhdGVDb250cm9sc1N0YXR1cygpO1xuXG4gICAgICAvLyBhZGQgZXZlbnRzXG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgYWRkRXZlbnRzKGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRFdmVudHMocHJldkJ1dHRvbiwgY29udHJvbHNFdmVudHMpO1xuICAgICAgICBhZGRFdmVudHMobmV4dEJ1dHRvbiwgY29udHJvbHNFdmVudHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGhpZGUgdG9vbHMgaWYgbmVlZGVkXG4gICAgZGlzYWJsZVVJKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0RXZlbnRzICgpIHtcbiAgICAvLyBhZGQgZXZlbnRzXG4gICAgaWYgKGNhcm91c2VsICYmIFRSQU5TSVRJT05FTkQpIHtcbiAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGV2ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRvdWNoKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzLCBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoKTsgfVxuICAgIGlmIChtb3VzZURyYWcpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7IH1cbiAgICBpZiAoYXJyb3dLZXlzKSB7IGFkZEV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpOyB9XG5cbiAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7XG4gICAgICBldmVudHMub24oJ291dGVyUmVzaXplZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzaXplVGFza3MoKTtcbiAgICAgICAgZXZlbnRzLmVtaXQoJ2lubmVyTG9hZGVkJywgaW5mbygpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2l2ZSB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCB8fCBhdXRvSGVpZ2h0IHx8ICFob3Jpem9udGFsKSB7XG4gICAgICBhZGRFdmVudHMod2luLCB7J3Jlc2l6ZSc6IG9uUmVzaXplfSk7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9IZWlnaHQpIHtcbiAgICAgIGlmIChuZXN0ZWQgPT09ICdvdXRlcicpIHtcbiAgICAgICAgZXZlbnRzLm9uKCdpbm5lckxvYWRlZCcsIGRvQXV0b0hlaWdodCk7XG4gICAgICB9IGVsc2UgaWYgKCFkaXNhYmxlKSB7IGRvQXV0b0hlaWdodCgpOyB9XG4gICAgfVxuXG4gICAgZG9MYXp5TG9hZCgpO1xuICAgIGlmIChkaXNhYmxlKSB7IGRpc2FibGVTbGlkZXIoKTsgfSBlbHNlIGlmIChmcmVlemUpIHsgZnJlZXplU2xpZGVyKCk7IH1cblxuICAgIGV2ZW50cy5vbignaW5kZXhDaGFuZ2VkJywgYWRkaXRpb25hbFVwZGF0ZXMpO1xuICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHsgZXZlbnRzLmVtaXQoJ2lubmVyTG9hZGVkJywgaW5mbygpKTsgfVxuICAgIGlmICh0eXBlb2Ygb25Jbml0ID09PSAnZnVuY3Rpb24nKSB7IG9uSW5pdChpbmZvKCkpOyB9XG4gICAgaXNPbiA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgICAvLyBzaGVldFxuICAgIHNoZWV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBpZiAoc2hlZXQub3duZXJOb2RlKSB7IHNoZWV0Lm93bmVyTm9kZS5yZW1vdmUoKTsgfVxuXG4gICAgLy8gcmVtb3ZlIHdpbiBldmVudCBsaXN0ZW5lcnNcbiAgICByZW1vdmVFdmVudHMod2luLCB7J3Jlc2l6ZSc6IG9uUmVzaXplfSk7XG5cbiAgICAvLyBhcnJvd0tleXMsIGNvbnRyb2xzLCBuYXZcbiAgICBpZiAoYXJyb3dLZXlzKSB7IHJlbW92ZUV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpOyB9XG4gICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7IHJlbW92ZUV2ZW50cyhjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNFdmVudHMpOyB9XG4gICAgaWYgKG5hdkNvbnRhaW5lcikgeyByZW1vdmVFdmVudHMobmF2Q29udGFpbmVyLCBuYXZFdmVudHMpOyB9XG5cbiAgICAvLyBhdXRvcGxheVxuICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTtcbiAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCB2aXNpYmlsaXR5RXZlbnQpO1xuICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyByZW1vdmVFdmVudHMoYXV0b3BsYXlCdXR0b24sIHsnY2xpY2snOiB0b2dnbGVBdXRvcGxheX0pOyB9XG4gICAgaWYgKGF1dG9wbGF5KSB7IGNsZWFySW50ZXJ2YWwoYXV0b3BsYXlUaW1lcik7IH1cblxuICAgIC8vIGNvbnRhaW5lclxuICAgIGlmIChjYXJvdXNlbCAmJiBUUkFOU0lUSU9ORU5EKSB7XG4gICAgICB2YXIgZXZlID0ge307XG4gICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XG4gICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBldmUpO1xuICAgIH1cbiAgICBpZiAodG91Y2gpIHsgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMpOyB9XG4gICAgaWYgKG1vdXNlRHJhZykgeyByZW1vdmVFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTsgfVxuXG4gICAgLy8gY2FjaGUgT2JqZWN0IHZhbHVlcyBpbiBvcHRpb25zICYmIHJlc2V0IEhUTUxcbiAgICB2YXIgaHRtbExpc3QgPSBbY29udGFpbmVySFRNTCwgY29udHJvbHNDb250YWluZXJIVE1MLCBwcmV2QnV0dG9uSFRNTCwgbmV4dEJ1dHRvbkhUTUwsIG5hdkNvbnRhaW5lckhUTUwsIGF1dG9wbGF5QnV0dG9uSFRNTF07XG5cbiAgICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIGVsID0gaXRlbSA9PT0gJ2NvbnRhaW5lcicgPyBvdXRlcldyYXBwZXIgOiBvcHRpb25zW2l0ZW1dO1xuXG4gICAgICBpZiAodHlwZW9mIGVsID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgcHJldkVsID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZyA/IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcmVudEVsID0gZWwucGFyZW50Tm9kZTtcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gaHRtbExpc3RbaV07XG4gICAgICAgIG9wdGlvbnNbaXRlbV0gPSBwcmV2RWwgPyBwcmV2RWwubmV4dEVsZW1lbnRTaWJsaW5nIDogcGFyZW50RWwuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vIHJlc2V0IHZhcmlhYmxlc1xuICAgIHRuc0xpc3QgPSBhbmltYXRlSW4gPSBhbmltYXRlT3V0ID0gYW5pbWF0ZURlbGF5ID0gYW5pbWF0ZU5vcm1hbCA9IGhvcml6b250YWwgPSBvdXRlcldyYXBwZXIgPSBpbm5lcldyYXBwZXIgPSBjb250YWluZXIgPSBjb250YWluZXJQYXJlbnQgPSBjb250YWluZXJIVE1MID0gc2xpZGVJdGVtcyA9IHNsaWRlQ291bnQgPSBicmVha3BvaW50Wm9uZSA9IHdpbmRvd1dpZHRoID0gYXV0b1dpZHRoID0gZml4ZWRXaWR0aCA9IGVkZ2VQYWRkaW5nID0gZ3V0dGVyID0gdmlld3BvcnQgPSBpdGVtcyA9IHNsaWRlQnkgPSB2aWV3cG9ydE1heCA9IGFycm93S2V5cyA9IHNwZWVkID0gcmV3aW5kID0gbG9vcCA9IGF1dG9IZWlnaHQgPSBzaGVldCA9IGxhenlsb2FkID0gc2xpZGVQb3NpdGlvbnMgPSBzbGlkZUl0ZW1zT3V0ID0gY2xvbmVDb3VudCA9IHNsaWRlQ291bnROZXcgPSBoYXNSaWdodERlYWRab25lID0gcmlnaHRCb3VuZGFyeSA9IHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtID0gdHJhbnNmb3JtQXR0ciA9IHRyYW5zZm9ybVByZWZpeCA9IHRyYW5zZm9ybVBvc3RmaXggPSBnZXRJbmRleE1heCA9IGluZGV4ID0gaW5kZXhDYWNoZWQgPSBpbmRleE1pbiA9IGluZGV4TWF4ID0gcmVzaXplVGltZXIgPSBzd2lwZUFuZ2xlID0gbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gcnVubmluZyA9IG9uSW5pdCA9IGV2ZW50cyA9IG5ld0NvbnRhaW5lckNsYXNzZXMgPSBzbGlkZUlkID0gZGlzYWJsZSA9IGRpc2FibGVkID0gZnJlZXphYmxlID0gZnJlZXplID0gZnJvemVuID0gY29udHJvbHNFdmVudHMgPSBuYXZFdmVudHMgPSBob3ZlckV2ZW50cyA9IHZpc2liaWxpdHlFdmVudCA9IGRvY21lbnRLZXlkb3duRXZlbnQgPSB0b3VjaEV2ZW50cyA9IGRyYWdFdmVudHMgPSBoYXNDb250cm9scyA9IGhhc05hdiA9IG5hdkFzVGh1bWJuYWlscyA9IGhhc0F1dG9wbGF5ID0gaGFzVG91Y2ggPSBoYXNNb3VzZURyYWcgPSBzbGlkZUFjdGl2ZUNsYXNzID0gaW1nQ29tcGxldGVDbGFzcyA9IGltZ0V2ZW50cyA9IGltZ3NDb21wbGV0ZSA9IGNvbnRyb2xzID0gY29udHJvbHNUZXh0ID0gY29udHJvbHNDb250YWluZXIgPSBjb250cm9sc0NvbnRhaW5lckhUTUwgPSBwcmV2QnV0dG9uID0gbmV4dEJ1dHRvbiA9IHByZXZJc0J1dHRvbiA9IG5leHRJc0J1dHRvbiA9IG5hdiA9IG5hdkNvbnRhaW5lciA9IG5hdkNvbnRhaW5lckhUTUwgPSBuYXZJdGVtcyA9IHBhZ2VzID0gcGFnZXNDYWNoZWQgPSBuYXZDbGlja2VkID0gbmF2Q3VycmVudEluZGV4ID0gbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2QWN0aXZlQ2xhc3MgPSBuYXZTdHIgPSBuYXZTdHJDdXJyZW50ID0gYXV0b3BsYXkgPSBhdXRvcGxheVRpbWVvdXQgPSBhdXRvcGxheURpcmVjdGlvbiA9IGF1dG9wbGF5VGV4dCA9IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5QnV0dG9uID0gYXV0b3BsYXlCdXR0b25IVE1MID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGF1dG9wbGF5SHRtbFN0cmluZ3MgPSBhdXRvcGxheVRpbWVyID0gYW5pbWF0aW5nID0gYXV0b3BsYXlIb3ZlclBhdXNlZCA9IGF1dG9wbGF5VXNlclBhdXNlZCA9IGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCA9IGluaXRQb3NpdGlvbiA9IGxhc3RQb3NpdGlvbiA9IHRyYW5zbGF0ZUluaXQgPSBkaXNYID0gZGlzWSA9IHBhblN0YXJ0ID0gcmFmSW5kZXggPSBnZXREaXN0ID0gdG91Y2ggPSBtb3VzZURyYWcgPSBudWxsO1xuICAgIC8vIGNoZWNrIHZhcmlhYmxlc1xuICAgIC8vIFthbmltYXRlSW4sIGFuaW1hdGVPdXQsIGFuaW1hdGVEZWxheSwgYW5pbWF0ZU5vcm1hbCwgaG9yaXpvbnRhbCwgb3V0ZXJXcmFwcGVyLCBpbm5lcldyYXBwZXIsIGNvbnRhaW5lciwgY29udGFpbmVyUGFyZW50LCBjb250YWluZXJIVE1MLCBzbGlkZUl0ZW1zLCBzbGlkZUNvdW50LCBicmVha3BvaW50Wm9uZSwgd2luZG93V2lkdGgsIGF1dG9XaWR0aCwgZml4ZWRXaWR0aCwgZWRnZVBhZGRpbmcsIGd1dHRlciwgdmlld3BvcnQsIGl0ZW1zLCBzbGlkZUJ5LCB2aWV3cG9ydE1heCwgYXJyb3dLZXlzLCBzcGVlZCwgcmV3aW5kLCBsb29wLCBhdXRvSGVpZ2h0LCBzaGVldCwgbGF6eWxvYWQsIHNsaWRlUG9zaXRpb25zLCBzbGlkZUl0ZW1zT3V0LCBjbG9uZUNvdW50LCBzbGlkZUNvdW50TmV3LCBoYXNSaWdodERlYWRab25lLCByaWdodEJvdW5kYXJ5LCB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSwgdHJhbnNmb3JtQXR0ciwgdHJhbnNmb3JtUHJlZml4LCB0cmFuc2Zvcm1Qb3N0Zml4LCBnZXRJbmRleE1heCwgaW5kZXgsIGluZGV4Q2FjaGVkLCBpbmRleE1pbiwgaW5kZXhNYXgsIHJlc2l6ZVRpbWVyLCBzd2lwZUFuZ2xlLCBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQsIHJ1bm5pbmcsIG9uSW5pdCwgZXZlbnRzLCBuZXdDb250YWluZXJDbGFzc2VzLCBzbGlkZUlkLCBkaXNhYmxlLCBkaXNhYmxlZCwgZnJlZXphYmxlLCBmcmVlemUsIGZyb3plbiwgY29udHJvbHNFdmVudHMsIG5hdkV2ZW50cywgaG92ZXJFdmVudHMsIHZpc2liaWxpdHlFdmVudCwgZG9jbWVudEtleWRvd25FdmVudCwgdG91Y2hFdmVudHMsIGRyYWdFdmVudHMsIGhhc0NvbnRyb2xzLCBoYXNOYXYsIG5hdkFzVGh1bWJuYWlscywgaGFzQXV0b3BsYXksIGhhc1RvdWNoLCBoYXNNb3VzZURyYWcsIHNsaWRlQWN0aXZlQ2xhc3MsIGltZ0NvbXBsZXRlQ2xhc3MsIGltZ0V2ZW50cywgaW1nc0NvbXBsZXRlLCBjb250cm9scywgY29udHJvbHNUZXh0LCBjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNDb250YWluZXJIVE1MLCBwcmV2QnV0dG9uLCBuZXh0QnV0dG9uLCBwcmV2SXNCdXR0b24sIG5leHRJc0J1dHRvbiwgbmF2LCBuYXZDb250YWluZXIsIG5hdkNvbnRhaW5lckhUTUwsIG5hdkl0ZW1zLCBwYWdlcywgcGFnZXNDYWNoZWQsIG5hdkNsaWNrZWQsIG5hdkN1cnJlbnRJbmRleCwgbmF2Q3VycmVudEluZGV4Q2FjaGVkLCBuYXZBY3RpdmVDbGFzcywgbmF2U3RyLCBuYXZTdHJDdXJyZW50LCBhdXRvcGxheSwgYXV0b3BsYXlUaW1lb3V0LCBhdXRvcGxheURpcmVjdGlvbiwgYXV0b3BsYXlUZXh0LCBhdXRvcGxheUhvdmVyUGF1c2UsIGF1dG9wbGF5QnV0dG9uLCBhdXRvcGxheUJ1dHRvbkhUTUwsIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHksIGF1dG9wbGF5SHRtbFN0cmluZ3MsIGF1dG9wbGF5VGltZXIsIGFuaW1hdGluZywgYXV0b3BsYXlIb3ZlclBhdXNlZCwgYXV0b3BsYXlVc2VyUGF1c2VkLCBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQsIGluaXRQb3NpdGlvbiwgbGFzdFBvc2l0aW9uLCB0cmFuc2xhdGVJbml0LCBkaXNYLCBkaXNZLCBwYW5TdGFydCwgcmFmSW5kZXgsIGdldERpc3QsIHRvdWNoLCBtb3VzZURyYWcgXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgaWYgKGl0ZW0gIT09IG51bGwpIHsgY29uc29sZS5sb2coaXRlbSk7IH0gfSk7XG5cbiAgICBmb3IgKHZhciBhIGluIHRoaXMpIHtcbiAgICAgIGlmIChhICE9PSAncmVidWlsZCcpIHsgdGhpc1thXSA9IG51bGw7IH1cbiAgICB9XG4gICAgaXNPbiA9IGZhbHNlO1xuICB9XG5cbi8vID09PSBPTiBSRVNJWkUgPT09XG4gIC8vIHJlc3BvbnNpdmUgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggfHwgIWhvcml6b250YWxcbiAgZnVuY3Rpb24gb25SZXNpemUgKGUpIHtcbiAgICByYWYoZnVuY3Rpb24oKXsgcmVzaXplVGFza3MoZ2V0RXZlbnQoZSkpOyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZVRhc2tzIChlKSB7XG4gICAgaWYgKCFpc09uKSB7IHJldHVybjsgfVxuICAgIGlmIChuZXN0ZWQgPT09ICdvdXRlcicpIHsgZXZlbnRzLmVtaXQoJ291dGVyUmVzaXplZCcsIGluZm8oZSkpOyB9XG4gICAgd2luZG93V2lkdGggPSBnZXRXaW5kb3dXaWR0aCgpO1xuICAgIHZhciBicENoYW5nZWQsXG4gICAgICAgIGJyZWFrcG9pbnRab25lVGVtID0gYnJlYWtwb2ludFpvbmUsXG4gICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSBmYWxzZTtcblxuICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICBzZXRCcmVha3BvaW50Wm9uZSgpO1xuICAgICAgYnBDaGFuZ2VkID0gYnJlYWtwb2ludFpvbmVUZW0gIT09IGJyZWFrcG9pbnRab25lO1xuICAgICAgLy8gaWYgKGhhc1JpZ2h0RGVhZFpvbmUpIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH0gLy8gKj9cbiAgICAgIGlmIChicENoYW5nZWQpIHsgZXZlbnRzLmVtaXQoJ25ld0JyZWFrcG9pbnRTdGFydCcsIGluZm8oZSkpOyB9XG4gICAgfVxuXG4gICAgdmFyIGluZENoYW5nZWQsXG4gICAgICAgIGl0ZW1zQ2hhbmdlZCxcbiAgICAgICAgaXRlbXNUZW0gPSBpdGVtcyxcbiAgICAgICAgZGlzYWJsZVRlbSA9IGRpc2FibGUsXG4gICAgICAgIGZyZWV6ZVRlbSA9IGZyZWV6ZSxcbiAgICAgICAgYXJyb3dLZXlzVGVtID0gYXJyb3dLZXlzLFxuICAgICAgICBjb250cm9sc1RlbSA9IGNvbnRyb2xzLFxuICAgICAgICBuYXZUZW0gPSBuYXYsXG4gICAgICAgIHRvdWNoVGVtID0gdG91Y2gsXG4gICAgICAgIG1vdXNlRHJhZ1RlbSA9IG1vdXNlRHJhZyxcbiAgICAgICAgYXV0b3BsYXlUZW0gPSBhdXRvcGxheSxcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlVGVtID0gYXV0b3BsYXlIb3ZlclBhdXNlLFxuICAgICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSxcbiAgICAgICAgaW5kZXhUZW0gPSBpbmRleDtcblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIHZhciBmaXhlZFdpZHRoVGVtID0gZml4ZWRXaWR0aCxcbiAgICAgICAgICBhdXRvSGVpZ2h0VGVtID0gYXV0b0hlaWdodCxcbiAgICAgICAgICBjb250cm9sc1RleHRUZW0gPSBjb250cm9sc1RleHQsXG4gICAgICAgICAgY2VudGVyVGVtID0gY2VudGVyLFxuICAgICAgICAgIGF1dG9wbGF5VGV4dFRlbSA9IGF1dG9wbGF5VGV4dDtcblxuICAgICAgaWYgKCFDU1NNUSkge1xuICAgICAgICB2YXIgZ3V0dGVyVGVtID0gZ3V0dGVyLFxuICAgICAgICAgICAgZWRnZVBhZGRpbmdUZW0gPSBlZGdlUGFkZGluZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXQgb3B0aW9uOlxuICAgIC8vIGZpeGVkIHdpZHRoOiB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyID0+IGl0ZW1zXG4gICAgLy8gb3RoZXJzOiB3aW5kb3cgd2lkdGggPT4gYWxsIHZhcmlhYmxlc1xuICAgIC8vIGFsbDogaXRlbXMgPT4gc2xpZGVCeVxuICAgIGFycm93S2V5cyA9IGdldE9wdGlvbignYXJyb3dLZXlzJyk7XG4gICAgY29udHJvbHMgPSBnZXRPcHRpb24oJ2NvbnRyb2xzJyk7XG4gICAgbmF2ID0gZ2V0T3B0aW9uKCduYXYnKTtcbiAgICB0b3VjaCA9IGdldE9wdGlvbigndG91Y2gnKTtcbiAgICBjZW50ZXIgPSBnZXRPcHRpb24oJ2NlbnRlcicpO1xuICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyk7XG4gICAgYXV0b3BsYXkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5Jyk7XG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlID0gZ2V0T3B0aW9uKCdhdXRvcGxheUhvdmVyUGF1c2UnKTtcbiAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5Jyk7XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBkaXNhYmxlID0gZ2V0T3B0aW9uKCdkaXNhYmxlJyk7XG4gICAgICBmaXhlZFdpZHRoID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJyk7XG4gICAgICBzcGVlZCA9IGdldE9wdGlvbignc3BlZWQnKTtcbiAgICAgIGF1dG9IZWlnaHQgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnKTtcbiAgICAgIGNvbnRyb2xzVGV4dCA9IGdldE9wdGlvbignY29udHJvbHNUZXh0Jyk7XG4gICAgICBhdXRvcGxheVRleHQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGV4dCcpO1xuICAgICAgYXV0b3BsYXlUaW1lb3V0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRpbWVvdXQnKTtcblxuICAgICAgaWYgKCFDU1NNUSkge1xuICAgICAgICBlZGdlUGFkZGluZyA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnKTtcbiAgICAgICAgZ3V0dGVyID0gZ2V0T3B0aW9uKCdndXR0ZXInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSk7XG5cbiAgICB2aWV3cG9ydCA9IGdldFZpZXdwb3J0V2lkdGgoKTsgLy8gPD0gZWRnZVBhZGRpbmcsIGd1dHRlclxuICAgIGlmICgoIWhvcml6b250YWwgfHwgYXV0b1dpZHRoKSAmJiAhZGlzYWJsZSkge1xuICAgICAgc2V0U2xpZGVQb3NpdGlvbnMoKTtcbiAgICAgIGlmICghaG9yaXpvbnRhbCkge1xuICAgICAgICB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpOyAvLyA8PSBzZXRTbGlkZVBvc2l0aW9uc1xuICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICByaWdodEJvdW5kYXJ5ID0gZ2V0UmlnaHRCb3VuZGFyeSgpOyAvLyBhdXRvV2lkdGg6IDw9IHZpZXdwb3J0LCBzbGlkZVBvc2l0aW9ucywgZ3V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZFdpZHRoOiA8PSB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyXG4gICAgICBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IC8vIGF1dG9XaWR0aDogPD0gcmlnaHRCb3VuZGFyeSwgc2xpZGVQb3NpdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml4ZWRXaWR0aDogPD0gcmlnaHRCb3VuZGFyeSwgZml4ZWRXaWR0aCwgZ3V0dGVyXG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCB8fCBmaXhlZFdpZHRoKSB7XG4gICAgICBpdGVtcyA9IGdldE9wdGlvbignaXRlbXMnKTtcbiAgICAgIHNsaWRlQnkgPSBnZXRPcHRpb24oJ3NsaWRlQnknKTtcbiAgICAgIGl0ZW1zQ2hhbmdlZCA9IGl0ZW1zICE9PSBpdGVtc1RlbTtcblxuICAgICAgaWYgKGl0ZW1zQ2hhbmdlZCkge1xuICAgICAgICBpZiAoIWZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkgeyBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IH0gLy8gPD0gaXRlbXNcbiAgICAgICAgLy8gY2hlY2sgaW5kZXggYmVmb3JlIHRyYW5zZm9ybSBpbiBjYXNlXG4gICAgICAgIC8vIHNsaWRlciByZWFjaCB0aGUgcmlnaHQgZWRnZSB0aGVuIGl0ZW1zIGJlY29tZSBiaWdnZXJcbiAgICAgICAgdXBkYXRlSW5kZXgoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgaWYgKGRpc2FibGUgIT09IGRpc2FibGVUZW0pIHtcbiAgICAgICAgaWYgKGRpc2FibGUpIHtcbiAgICAgICAgICBkaXNhYmxlU2xpZGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5hYmxlU2xpZGVyKCk7IC8vIDw9IHNsaWRlUG9zaXRpb25zLCByaWdodEJvdW5kYXJ5LCBpbmRleE1heFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZyZWV6YWJsZSAmJiAoYnBDaGFuZ2VkIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSkge1xuICAgICAgZnJlZXplID0gZ2V0RnJlZXplKCk7IC8vIDw9IGF1dG9XaWR0aDogc2xpZGVQb3NpdGlvbnMsIGd1dHRlciwgdmlld3BvcnQsIHJpZ2h0Qm91bmRhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8PSBmaXhlZFdpZHRoOiBmaXhlZFdpZHRoLCBndXR0ZXIsIHJpZ2h0Qm91bmRhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8PSBvdGhlcnM6IGl0ZW1zXG5cbiAgICAgIGlmIChmcmVlemUgIT09IGZyZWV6ZVRlbSkge1xuICAgICAgICBpZiAoZnJlZXplKSB7XG4gICAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm0oZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoZ2V0U3RhcnRJbmRleCgwKSkpO1xuICAgICAgICAgIGZyZWV6ZVNsaWRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVuZnJlZXplU2xpZGVyKCk7XG4gICAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpOyAvLyBjb250cm9scywgbmF2LCB0b3VjaCwgbW91c2VEcmFnLCBhcnJvd0tleXMsIGF1dG9wbGF5LCBhdXRvcGxheUhvdmVyUGF1c2UsIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlcbiAgICBpZiAoIWF1dG9wbGF5KSB7IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBmYWxzZTsgfVxuXG4gICAgaWYgKGFycm93S2V5cyAhPT0gYXJyb3dLZXlzVGVtKSB7XG4gICAgICBhcnJvd0tleXMgP1xuICAgICAgICBhZGRFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpO1xuICAgIH1cbiAgICBpZiAoY29udHJvbHMgIT09IGNvbnRyb2xzVGVtKSB7XG4gICAgICBpZiAoY29udHJvbHMpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgICAgc2hvd0VsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IHNob3dFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgc2hvd0VsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgICAgaGlkZUVsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IGhpZGVFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgaGlkZUVsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF2ICE9PSBuYXZUZW0pIHtcbiAgICAgIG5hdiA/XG4gICAgICAgIHNob3dFbGVtZW50KG5hdkNvbnRhaW5lcikgOlxuICAgICAgICBoaWRlRWxlbWVudChuYXZDb250YWluZXIpO1xuICAgIH1cbiAgICBpZiAodG91Y2ggIT09IHRvdWNoVGVtKSB7XG4gICAgICB0b3VjaCA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzLCBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoKSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzKTtcbiAgICB9XG4gICAgaWYgKG1vdXNlRHJhZyAhPT0gbW91c2VEcmFnVGVtKSB7XG4gICAgICBtb3VzZURyYWcgP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpO1xuICAgIH1cbiAgICBpZiAoYXV0b3BsYXkgIT09IGF1dG9wbGF5VGVtKSB7XG4gICAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHNob3dFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgICAgICBpZiAoIWFuaW1hdGluZyAmJiAhYXV0b3BsYXlVc2VyUGF1c2VkKSB7IHN0YXJ0QXV0b3BsYXkoKTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IGhpZGVFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgICAgICBpZiAoYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheSgpOyB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2UgIT09IGF1dG9wbGF5SG92ZXJQYXVzZVRlbSkge1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpO1xuICAgIH1cbiAgICBpZiAoYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSAhPT0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSkge1xuICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA/XG4gICAgICAgIGFkZEV2ZW50cyhkb2MsIHZpc2liaWxpdHlFdmVudCkgOlxuICAgICAgICByZW1vdmVFdmVudHMoZG9jLCB2aXNpYmlsaXR5RXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGlmIChmaXhlZFdpZHRoICE9PSBmaXhlZFdpZHRoVGVtIHx8IGNlbnRlciAhPT0gY2VudGVyVGVtKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9XG5cbiAgICAgIGlmIChhdXRvSGVpZ2h0ICE9PSBhdXRvSGVpZ2h0VGVtKSB7XG4gICAgICAgIGlmICghYXV0b0hlaWdodCkgeyBpbm5lcldyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJyc7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRyb2xzICYmIGNvbnRyb2xzVGV4dCAhPT0gY29udHJvbHNUZXh0VGVtKSB7XG4gICAgICAgIHByZXZCdXR0b24uaW5uZXJIVE1MID0gY29udHJvbHNUZXh0WzBdO1xuICAgICAgICBuZXh0QnV0dG9uLmlubmVySFRNTCA9IGNvbnRyb2xzVGV4dFsxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uICYmIGF1dG9wbGF5VGV4dCAhPT0gYXV0b3BsYXlUZXh0VGVtKSB7XG4gICAgICAgIHZhciBpID0gYXV0b3BsYXkgPyAxIDogMCxcbiAgICAgICAgICAgIGh0bWwgPSBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwsXG4gICAgICAgICAgICBsZW4gPSBodG1sLmxlbmd0aCAtIGF1dG9wbGF5VGV4dFRlbVtpXS5sZW5ndGg7XG4gICAgICAgIGlmIChodG1sLnN1YnN0cmluZyhsZW4pID09PSBhdXRvcGxheVRleHRUZW1baV0pIHtcbiAgICAgICAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBodG1sLnN1YnN0cmluZygwLCBsZW4pICsgYXV0b3BsYXlUZXh0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjZW50ZXIgJiYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfVxuICAgIH1cblxuICAgIGlmIChpdGVtc0NoYW5nZWQgfHwgZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICBwYWdlcyA9IGdldFBhZ2VzKCk7XG4gICAgICB1cGRhdGVOYXZWaXNpYmlsaXR5KCk7XG4gICAgfVxuXG4gICAgaW5kQ2hhbmdlZCA9IGluZGV4ICE9PSBpbmRleFRlbTtcbiAgICBpZiAoaW5kQ2hhbmdlZCkgeyBcbiAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpdGVtc0NoYW5nZWQpIHtcbiAgICAgIGlmICghaW5kQ2hhbmdlZCkgeyBhZGRpdGlvbmFsVXBkYXRlcygpOyB9XG4gICAgfSBlbHNlIGlmIChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkge1xuICAgICAgZG9MYXp5TG9hZCgpOyBcbiAgICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG4gICAgICB1cGRhdGVMaXZlUmVnaW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1zQ2hhbmdlZCAmJiAhY2Fyb3VzZWwpIHsgdXBkYXRlR2FsbGVyeVNsaWRlUG9zaXRpb25zKCk7IH1cblxuICAgIGlmICghZGlzYWJsZSAmJiAhZnJlZXplKSB7XG4gICAgICAvLyBub24tbWVkdWFxdWVyaWVzOiBJRThcbiAgICAgIGlmIChicENoYW5nZWQgJiYgIUNTU01RKSB7XG4gICAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlc1xuICAgICAgICBpZiAoYXV0b0hlaWdodCAhPT0gYXV0b2hlaWdodFRlbSB8fCBzcGVlZCAhPT0gc3BlZWRUZW0pIHtcbiAgICAgICAgICB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgICAgaWYgKGVkZ2VQYWRkaW5nICE9PSBlZGdlUGFkZGluZ1RlbSB8fCBndXR0ZXIgIT09IGd1dHRlclRlbSkge1xuICAgICAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIHNwZWVkLCBhdXRvSGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xuICAgICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2xpZGUgc3R5bGVzXG4gICAgICAgICAgdmFyIHN0ciA9IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKSArIFxuICAgICAgICAgICAgICAgICAgICBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlcik7XG5cbiAgICAgICAgICAvLyByZW1vdmUgdGhlIGxhc3QgbGluZSBhbmRcbiAgICAgICAgICAvLyBhZGQgbmV3IHN0eWxlc1xuICAgICAgICAgIHJlbW92ZUNTU1J1bGUoc2hlZXQsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSAtIDEpO1xuICAgICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGF1dG8gaGVpZ2h0XG4gICAgICBpZiAoYXV0b0hlaWdodCkgeyBkb0F1dG9IZWlnaHQoKTsgfVxuXG4gICAgICBpZiAobmVlZENvbnRhaW5lclRyYW5zZm9ybSkge1xuICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuICAgICAgICBpbmRleENhY2hlZCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChicENoYW5nZWQpIHsgZXZlbnRzLmVtaXQoJ25ld0JyZWFrcG9pbnRFbmQnLCBpbmZvKGUpKTsgfVxuICB9XG5cblxuXG5cblxuICAvLyA9PT0gSU5JVElBTElaQVRJT04gRlVOQ1RJT05TID09PSAvL1xuICBmdW5jdGlvbiBnZXRGcmVlemUgKCkge1xuICAgIGlmICghZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICB2YXIgYSA9IGNlbnRlciA/IGl0ZW1zIC0gKGl0ZW1zIC0gMSkgLyAyIDogaXRlbXM7XG4gICAgICByZXR1cm4gIHNsaWRlQ291bnQgPD0gYTtcbiAgICB9XG5cbiAgICB2YXIgd2lkdGggPSBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudCA6IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnRdLFxuICAgICAgICB2cCA9IGVkZ2VQYWRkaW5nID8gdmlld3BvcnQgKyBlZGdlUGFkZGluZyAqIDIgOiB2aWV3cG9ydCArIGd1dHRlcjtcblxuICAgIGlmIChjZW50ZXIpIHtcbiAgICAgIHZwIC09IGZpeGVkV2lkdGggPyAodmlld3BvcnQgLSBmaXhlZFdpZHRoKSAvIDIgOiAodmlld3BvcnQgLSAoc2xpZGVQb3NpdGlvbnNbaW5kZXggKyAxXSAtIHNsaWRlUG9zaXRpb25zW2luZGV4XSAtIGd1dHRlcikpIC8gMjtcbiAgICB9XG5cbiAgICByZXR1cm4gd2lkdGggPD0gdnA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRCcmVha3BvaW50Wm9uZSAoKSB7XG4gICAgYnJlYWtwb2ludFpvbmUgPSAwO1xuICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgIGJwID0gcGFyc2VJbnQoYnApOyAvLyBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgIGlmICh3aW5kb3dXaWR0aCA+PSBicCkgeyBicmVha3BvaW50Wm9uZSA9IGJwOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gKHNsaWRlQnksIGluZGV4TWluLCBpbmRleE1heCkgPT4gaW5kZXhcbiAgdmFyIHVwZGF0ZUluZGV4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbG9vcCA/IFxuICAgICAgY2Fyb3VzZWwgP1xuICAgICAgICAvLyBsb29wICsgY2Fyb3VzZWxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsZWZ0RWRnZSA9IGluZGV4TWluLFxuICAgICAgICAgICAgICByaWdodEVkZ2UgPSBpbmRleE1heDtcblxuICAgICAgICAgIGxlZnRFZGdlICs9IHNsaWRlQnk7XG4gICAgICAgICAgcmlnaHRFZGdlIC09IHNsaWRlQnk7XG5cbiAgICAgICAgICAvLyBhZGp1c3QgZWRnZXMgd2hlbiBoYXMgZWRnZSBwYWRkaW5nc1xuICAgICAgICAgIC8vIG9yIGZpeGVkLXdpZHRoIHNsaWRlciB3aXRoIGV4dHJhIHNwYWNlIG9uIHRoZSByaWdodCBzaWRlXG4gICAgICAgICAgaWYgKGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgICBsZWZ0RWRnZSArPSAxO1xuICAgICAgICAgICAgcmlnaHRFZGdlIC09IDE7XG4gICAgICAgICAgfSBlbHNlIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgICAgICBpZiAoKHZpZXdwb3J0ICsgZ3V0dGVyKSUoZml4ZWRXaWR0aCArIGd1dHRlcikpIHsgcmlnaHRFZGdlIC09IDE7IH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gcmlnaHRFZGdlKSB7XG4gICAgICAgICAgICAgIGluZGV4IC09IHNsaWRlQ291bnQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgbGVmdEVkZ2UpIHtcbiAgICAgICAgICAgICAgaW5kZXggKz0gc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gOlxuICAgICAgICAvLyBsb29wICsgZ2FsbGVyeVxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoaW5kZXggPiBpbmRleE1heCkge1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4ID49IGluZGV4TWluICsgc2xpZGVDb3VudCkgeyBpbmRleCAtPSBzbGlkZUNvdW50OyB9XG4gICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IGluZGV4TWluKSB7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPD0gaW5kZXhNYXggLSBzbGlkZUNvdW50KSB7IGluZGV4ICs9IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gOlxuICAgICAgLy8gbm9uLWxvb3BcbiAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbmRleCA9IE1hdGgubWF4KGluZGV4TWluLCBNYXRoLm1pbihpbmRleE1heCwgaW5kZXgpKTtcbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gZGlzYWJsZVVJICgpIHtcbiAgICBpZiAoIWF1dG9wbGF5ICYmIGF1dG9wbGF5QnV0dG9uKSB7IGhpZGVFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgIGlmICghbmF2ICYmIG5hdkNvbnRhaW5lcikgeyBoaWRlRWxlbWVudChuYXZDb250YWluZXIpOyB9XG4gICAgaWYgKCFjb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIGhpZGVFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IGhpZGVFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IGhpZGVFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW5hYmxlVUkgKCkge1xuICAgIGlmIChhdXRvcGxheSAmJiBhdXRvcGxheUJ1dHRvbikgeyBzaG93RWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICBpZiAobmF2ICYmIG5hdkNvbnRhaW5lcikgeyBzaG93RWxlbWVudChuYXZDb250YWluZXIpOyB9XG4gICAgaWYgKGNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgc2hvd0VsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgc2hvd0VsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgc2hvd0VsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmcmVlemVTbGlkZXIgKCkge1xuICAgIGlmIChmcm96ZW4pIHsgcmV0dXJuOyB9XG5cbiAgICAvLyByZW1vdmUgZWRnZSBwYWRkaW5nIGZyb20gaW5uZXIgd3JhcHBlclxuICAgIGlmIChlZGdlUGFkZGluZykgeyBpbm5lcldyYXBwZXIuc3R5bGUubWFyZ2luID0gJzBweCc7IH1cblxuICAgIC8vIGFkZCBjbGFzcyB0bnMtdHJhbnNwYXJlbnQgdG8gY2xvbmVkIHNsaWRlc1xuICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICB2YXIgc3RyID0gJ3Rucy10cmFuc3BhcmVudCc7XG4gICAgICBmb3IgKHZhciBpID0gY2xvbmVDb3VudDsgaS0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgYWRkQ2xhc3Moc2xpZGVJdGVtc1tpXSwgc3RyKTsgfVxuICAgICAgICBhZGRDbGFzcyhzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBpIC0gMV0sIHN0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZGlzYWJsZVVJKCk7XG5cbiAgICBmcm96ZW4gPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5mcmVlemVTbGlkZXIgKCkge1xuICAgIGlmICghZnJvemVuKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcmVzdG9yZSBlZGdlIHBhZGRpbmcgZm9yIGlubmVyIHdyYXBwZXJcbiAgICAvLyBmb3IgbW9yZGVybiBicm93c2Vyc1xuICAgIGlmIChlZGdlUGFkZGluZyAmJiBDU1NNUSkgeyBpbm5lcldyYXBwZXIuc3R5bGUubWFyZ2luID0gJyc7IH1cblxuICAgIC8vIHJlbW92ZSBjbGFzcyB0bnMtdHJhbnNwYXJlbnQgdG8gY2xvbmVkIHNsaWRlc1xuICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICB2YXIgc3RyID0gJ3Rucy10cmFuc3BhcmVudCc7XG4gICAgICBmb3IgKHZhciBpID0gY2xvbmVDb3VudDsgaS0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgcmVtb3ZlQ2xhc3Moc2xpZGVJdGVtc1tpXSwgc3RyKTsgfVxuICAgICAgICByZW1vdmVDbGFzcyhzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBpIC0gMV0sIHN0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZW5hYmxlVUkoKTtcblxuICAgIGZyb3plbiA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZVNsaWRlciAoKSB7XG4gICAgaWYgKGRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gICAgc2hlZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UobmV3Q29udGFpbmVyQ2xhc3Nlcy5zdWJzdHJpbmcoMSksICcnKTtcbiAgICByZW1vdmVBdHRycyhjb250YWluZXIsIFsnc3R5bGUnXSk7XG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBoaWRlRWxlbWVudChzbGlkZUl0ZW1zW2pdKTsgfVxuICAgICAgICBoaWRlRWxlbWVudChzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBqIC0gMV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZlcnRpY2FsIHNsaWRlclxuICAgIGlmICghaG9yaXpvbnRhbCB8fCAhY2Fyb3VzZWwpIHsgcmVtb3ZlQXR0cnMoaW5uZXJXcmFwcGVyLCBbJ3N0eWxlJ10pOyB9XG5cbiAgICAvLyBnYWxsZXJ5XG4gICAgaWYgKCFjYXJvdXNlbCkgeyBcbiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbCA9IGluZGV4ICsgc2xpZGVDb3VudDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG4gICAgICAgIHJlbW92ZUF0dHJzKGl0ZW0sIFsnc3R5bGUnXSk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGRpc2FibGVVSSgpO1xuXG4gICAgZGlzYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5hYmxlU2xpZGVyICgpIHtcbiAgICBpZiAoIWRpc2FibGVkKSB7IHJldHVybjsgfVxuXG4gICAgc2hlZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lICs9IG5ld0NvbnRhaW5lckNsYXNzZXM7XG4gICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcblxuICAgIGlmIChsb29wKSB7XG4gICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgc2hvd0VsZW1lbnQoc2xpZGVJdGVtc1tqXSk7IH1cbiAgICAgICAgc2hvd0VsZW1lbnQoc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaiAtIDFdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnYWxsZXJ5XG4gICAgaWYgKCFjYXJvdXNlbCkgeyBcbiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbCA9IGluZGV4ICsgc2xpZGVDb3VudDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV0sXG4gICAgICAgICAgICBjbGFzc04gPSBpIDwgaW5kZXggKyBpdGVtcyA/IGFuaW1hdGVJbiA6IGFuaW1hdGVOb3JtYWw7XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGNsYXNzTik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZW5hYmxlVUkoKTtcblxuICAgIGRpc2FibGVkID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaXZlUmVnaW9uICgpIHtcbiAgICB2YXIgc3RyID0gZ2V0TGl2ZVJlZ2lvblN0cigpO1xuICAgIGlmIChsaXZlcmVnaW9uQ3VycmVudC5pbm5lckhUTUwgIT09IHN0cikgeyBsaXZlcmVnaW9uQ3VycmVudC5pbm5lckhUTUwgPSBzdHI7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpdmVSZWdpb25TdHIgKCkge1xuICAgIHZhciBhcnIgPSBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpLFxuICAgICAgICBzdGFydCA9IGFyclswXSArIDEsXG4gICAgICAgIGVuZCA9IGFyclsxXSArIDE7XG4gICAgcmV0dXJuIHN0YXJ0ID09PSBlbmQgPyBzdGFydCArICcnIDogc3RhcnQgKyAnIHRvICcgKyBlbmQ7IFxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UgKHZhbCkge1xuICAgIGlmICh2YWwgPT0gbnVsbCkgeyB2YWwgPSBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSgpOyB9XG4gICAgdmFyIHN0YXJ0ID0gaW5kZXgsIGVuZCwgcmFuZ2VzdGFydCwgcmFuZ2VlbmQ7XG5cbiAgICAvLyBnZXQgcmFuZ2Ugc3RhcnQsIHJhbmdlIGVuZCBmb3IgYXV0b1dpZHRoIGFuZCBmaXhlZFdpZHRoXG4gICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgaWYgKGF1dG9XaWR0aCB8fCBmaXhlZFdpZHRoKSB7XG4gICAgICAgIHJhbmdlc3RhcnQgPSAtIChwYXJzZUZsb2F0KHZhbCkgKyBlZGdlUGFkZGluZyk7XG4gICAgICAgIHJhbmdlZW5kID0gcmFuZ2VzdGFydCArIHZpZXdwb3J0ICsgZWRnZVBhZGRpbmcgKiAyO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgIHJhbmdlc3RhcnQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleF07XG4gICAgICAgIHJhbmdlZW5kID0gcmFuZ2VzdGFydCArIHZpZXdwb3J0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCBzdGFydCwgZW5kXG4gICAgLy8gLSBjaGVjayBhdXRvIHdpZHRoXG4gICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgc2xpZGVQb3NpdGlvbnMuZm9yRWFjaChmdW5jdGlvbihwb2ludCwgaSkge1xuICAgICAgICBpZiAoaSA8IHNsaWRlQ291bnROZXcpIHtcbiAgICAgICAgICBpZiAoKGNlbnRlciB8fCBlZGdlUGFkZGluZykgJiYgcG9pbnQgPD0gcmFuZ2VzdGFydCArIDAuNSkgeyBzdGFydCA9IGk7IH1cbiAgICAgICAgICBpZiAocmFuZ2VlbmQgLSBwb2ludCA+PSAwLjUpIHsgZW5kID0gaTsgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIC8vIC0gY2hlY2sgcGVyY2VudGFnZSB3aWR0aCwgZml4ZWQgd2lkdGhcbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICB2YXIgY2VsbCA9IGZpeGVkV2lkdGggKyBndXR0ZXI7XG4gICAgICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICBzdGFydCA9IE1hdGguZmxvb3IocmFuZ2VzdGFydC9jZWxsKTtcbiAgICAgICAgICBlbmQgPSBNYXRoLmNlaWwocmFuZ2VlbmQvY2VsbCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgTWF0aC5jZWlsKHZpZXdwb3J0L2NlbGwpIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgdmFyIGEgPSBpdGVtcyAtIDE7XG4gICAgICAgICAgaWYgKGNlbnRlcikge1xuICAgICAgICAgICAgc3RhcnQgLT0gYSAvIDI7XG4gICAgICAgICAgICBlbmQgPSBpbmRleCArIGEgLyAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQgPSBpbmRleCArIGE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgICB2YXIgYiA9IGVkZ2VQYWRkaW5nICogaXRlbXMgLyB2aWV3cG9ydDtcbiAgICAgICAgICAgIHN0YXJ0IC09IGI7XG4gICAgICAgICAgICBlbmQgKz0gYjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzdGFydCA9IE1hdGguZmxvb3Ioc3RhcnQpO1xuICAgICAgICAgIGVuZCA9IE1hdGguY2VpbChlbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgaXRlbXMgLSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoc3RhcnQsIDApO1xuICAgICAgZW5kID0gTWF0aC5taW4oZW5kLCBzbGlkZUNvdW50TmV3IC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvTGF6eUxvYWQgKCkge1xuICAgIGlmIChsYXp5bG9hZCAmJiAhZGlzYWJsZSkge1xuICAgICAgZ2V0SW1hZ2VBcnJheS5hcHBseShudWxsLCBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpKS5mb3JFYWNoKGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgICAgaWYgKCFoYXNDbGFzcyhpbWcsIGltZ0NvbXBsZXRlQ2xhc3MpKSB7XG4gICAgICAgICAgLy8gc3RvcCBwcm9wYWdhdGlvbiB0cmFuc2l0aW9uZW5kIGV2ZW50IHRvIGNvbnRhaW5lclxuICAgICAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9O1xuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGV2ZSk7XG5cbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuXG4gICAgICAgICAgLy8gdXBkYXRlIHNyY1xuICAgICAgICAgIGltZy5zcmMgPSBnZXRBdHRyKGltZywgJ2RhdGEtc3JjJyk7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgc3Jjc2V0XG4gICAgICAgICAgdmFyIHNyY3NldCA9IGdldEF0dHIoaW1nLCAnZGF0YS1zcmNzZXQnKTtcbiAgICAgICAgICBpZiAoc3Jjc2V0KSB7IGltZy5zcmNzZXQgPSBzcmNzZXQ7IH1cblxuICAgICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25JbWdMb2FkZWQgKGUpIHtcbiAgICBpbWdMb2FkZWQoZ2V0VGFyZ2V0KGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uSW1nRmFpbGVkIChlKSB7XG4gICAgaW1nRmFpbGVkKGdldFRhcmdldChlKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdMb2FkZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ2xvYWRlZCcpO1xuICAgIGltZ0NvbXBsZXRlZChpbWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nRmFpbGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICdmYWlsZWQnKTtcbiAgICBpbWdDb21wbGV0ZWQoaW1nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0NvbXBsZXRlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAndG5zLWNvbXBsZXRlJyk7XG4gICAgcmVtb3ZlQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgIHJlbW92ZUV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbWFnZUFycmF5IChzdGFydCwgZW5kKSB7XG4gICAgdmFyIGltZ3MgPSBbXTtcbiAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICBmb3JFYWNoKHNsaWRlSXRlbXNbc3RhcnRdLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpLCBmdW5jdGlvbiAoaW1nKSB7IGltZ3MucHVzaChpbWcpOyB9KTtcbiAgICAgIHN0YXJ0Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZ3M7XG4gIH1cblxuICAvLyBjaGVjayBpZiBhbGwgdmlzaWJsZSBpbWFnZXMgYXJlIGxvYWRlZFxuICAvLyBhbmQgdXBkYXRlIGNvbnRhaW5lciBoZWlnaHQgaWYgaXQncyBkb25lXG4gIGZ1bmN0aW9uIGRvQXV0b0hlaWdodCAoKSB7XG4gICAgdmFyIGltZ3MgPSBnZXRJbWFnZUFycmF5LmFwcGx5KG51bGwsIGdldFZpc2libGVTbGlkZVJhbmdlKCkpO1xuICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soaW1ncywgdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0KTsgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdzTG9hZGVkQ2hlY2sgKGltZ3MsIGNiKSB7XG4gICAgLy8gZGlyZWN0bHkgZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBhbGwgaW1hZ2VzIGFyZSBjb21wbGV0ZVxuICAgIGlmIChpbWdzQ29tcGxldGUpIHsgcmV0dXJuIGNiKCk7IH1cblxuICAgIC8vIGNoZWNrIHNlbGVjdGVkIGltYWdlIGNsYXNzZXMgb3RoZXJ3aXNlXG4gICAgaW1ncy5mb3JFYWNoKGZ1bmN0aW9uIChpbWcsIGluZGV4KSB7XG4gICAgICBpZiAoaGFzQ2xhc3MoaW1nLCBpbWdDb21wbGV0ZUNsYXNzKSkgeyBpbWdzLnNwbGljZShpbmRleCwgMSk7IH1cbiAgICB9KTtcblxuICAgIC8vIGV4ZWN1dGUgY2FsbGJhY2sgZnVuY3Rpb24gaWYgc2VsZWN0ZWQgaW1hZ2VzIGFyZSBhbGwgY29tcGxldGVcbiAgICBpZiAoIWltZ3MubGVuZ3RoKSB7IHJldHVybiBjYigpOyB9XG5cbiAgICAvLyBvdGhlcndpc2UgZXhlY3V0ZSB0aGlzIGZ1bmN0aW9uYSBhZ2FpblxuICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soaW1ncywgY2IpOyB9KTtcbiAgfSBcblxuICBmdW5jdGlvbiBhZGRpdGlvbmFsVXBkYXRlcyAoKSB7XG4gICAgZG9MYXp5TG9hZCgpOyBcbiAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xuICAgIHVwZGF0ZUxpdmVSZWdpb24oKTtcbiAgICB1cGRhdGVDb250cm9sc1N0YXR1cygpO1xuICAgIHVwZGF0ZU5hdlN0YXR1cygpO1xuICB9XG5cblxuICBmdW5jdGlvbiB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbiAoKSB7XG4gICAgaWYgKGNhcm91c2VsICYmIGF1dG9IZWlnaHQpIHtcbiAgICAgIG1pZGRsZVdyYXBwZXIuc3R5bGVbVFJBTlNJVElPTkRVUkFUSU9OXSA9IHNwZWVkIC8gMTAwMCArICdzJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXhTbGlkZUhlaWdodCAoc2xpZGVTdGFydCwgc2xpZGVSYW5nZSkge1xuICAgIHZhciBoZWlnaHRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IHNsaWRlU3RhcnQsIGwgPSBNYXRoLm1pbihzbGlkZVN0YXJ0ICsgc2xpZGVSYW5nZSwgc2xpZGVDb3VudE5ldyk7IGkgPCBsOyBpKyspIHtcbiAgICAgIGhlaWdodHMucHVzaChzbGlkZUl0ZW1zW2ldLm9mZnNldEhlaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIGhlaWdodHMpO1xuICB9XG5cbiAgLy8gdXBkYXRlIGlubmVyIHdyYXBwZXIgaGVpZ2h0XG4gIC8vIDEuIGdldCB0aGUgbWF4LWhlaWdodCBvZiB0aGUgdmlzaWJsZSBzbGlkZXNcbiAgLy8gMi4gc2V0IHRyYW5zaXRpb25EdXJhdGlvbiB0byBzcGVlZFxuICAvLyAzLiB1cGRhdGUgaW5uZXIgd3JhcHBlciBoZWlnaHQgdG8gbWF4LWhlaWdodFxuICAvLyA0LiBzZXQgdHJhbnNpdGlvbkR1cmF0aW9uIHRvIDBzIGFmdGVyIHRyYW5zaXRpb24gZG9uZVxuICBmdW5jdGlvbiB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQgKCkge1xuICAgIHZhciBtYXhIZWlnaHQgPSBhdXRvSGVpZ2h0ID8gZ2V0TWF4U2xpZGVIZWlnaHQoaW5kZXgsIGl0ZW1zKSA6IGdldE1heFNsaWRlSGVpZ2h0KGNsb25lQ291bnQsIHNsaWRlQ291bnQpLFxuICAgICAgICB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xuXG4gICAgaWYgKHdwLnN0eWxlLmhlaWdodCAhPT0gbWF4SGVpZ2h0KSB7IHdwLnN0eWxlLmhlaWdodCA9IG1heEhlaWdodCArICdweCc7IH1cbiAgfVxuXG4gIC8vIGdldCB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIGZpcnN0IHNsaWRlIHRvIGVhY2ggc2xpZGVcbiAgLy8gKGluaXQpID0+IHNsaWRlUG9zaXRpb25zXG4gIGZ1bmN0aW9uIHNldFNsaWRlUG9zaXRpb25zICgpIHtcbiAgICBzbGlkZVBvc2l0aW9ucyA9IFswXTtcbiAgICB2YXIgYXR0ciA9IGhvcml6b250YWwgPyAnbGVmdCcgOiAndG9wJyxcbiAgICAgICAgYXR0cjIgPSBob3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nLFxuICAgICAgICBiYXNlID0gc2xpZGVJdGVtc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyXTtcblxuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgLy8gc2tpcCB0aGUgZmlyc3Qgc2xpZGVcbiAgICAgIGlmIChpKSB7IHNsaWRlUG9zaXRpb25zLnB1c2goaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyXSAtIGJhc2UpOyB9XG4gICAgICAvLyBhZGQgdGhlIGVuZCBlZGdlXG4gICAgICBpZiAoaSA9PT0gc2xpZGVDb3VudE5ldyAtIDEpIHsgc2xpZGVQb3NpdGlvbnMucHVzaChpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHIyXSAtIGJhc2UpOyB9XG4gICAgfSk7XG4gIH1cblxuICAvLyB1cGRhdGUgc2xpZGVcbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVTdGF0dXMgKCkge1xuICAgIHZhciByYW5nZSA9IGdldFZpc2libGVTbGlkZVJhbmdlKCksXG4gICAgICAgIHN0YXJ0ID0gcmFuZ2VbMF0sXG4gICAgICAgIGVuZCA9IHJhbmdlWzFdO1xuXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAvLyBzaG93IHNsaWRlc1xuICAgICAgaWYgKGkgPj0gc3RhcnQgJiYgaSA8PSBlbmQpIHtcbiAgICAgICAgaWYgKGhhc0F0dHIoaXRlbSwgJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICByZW1vdmVBdHRycyhpdGVtLCBbJ2FyaWEtaGlkZGVuJywgJ3RhYmluZGV4J10pO1xuICAgICAgICAgIGFkZENsYXNzKGl0ZW0sIHNsaWRlQWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAvLyBoaWRlIHNsaWRlc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNBdHRyKGl0ZW0sICdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgICAgc2V0QXR0cnMoaXRlbSwge1xuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIHNsaWRlQWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBnYWxsZXJ5OiB1cGRhdGUgc2xpZGUgcG9zaXRpb25cbiAgZnVuY3Rpb24gdXBkYXRlR2FsbGVyeVNsaWRlUG9zaXRpb25zICgpIHtcbiAgICB2YXIgbCA9IGluZGV4ICsgTWF0aC5taW4oc2xpZGVDb3VudCwgaXRlbXMpO1xuICAgIGZvciAodmFyIGkgPSBzbGlkZUNvdW50TmV3OyBpLS07KSB7XG4gICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG5cbiAgICAgIGlmIChpID49IGluZGV4ICYmIGkgPCBsKSB7XG4gICAgICAgIC8vIGFkZCB0cmFuc2l0aW9ucyB0byB2aXNpYmxlIHNsaWRlcyB3aGVuIGFkanVzdGluZyB0aGVpciBwb3NpdGlvbnNcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1tb3ZpbmcnKTtcblxuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5zdHlsZS5sZWZ0KSB7XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIG91dGxldCBhbmltYXRpb25cbiAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVPdXQpO1xuICAgIH1cblxuICAgIC8vIHJlbW92aW5nICcudG5zLW1vdmluZydcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihlbCkge1xuICAgICAgICByZW1vdmVDbGFzcyhlbCwgJ3Rucy1tb3ZpbmcnKTtcbiAgICAgIH0pO1xuICAgIH0sIDMwMCk7XG4gIH1cblxuICAvLyBzZXQgdGFiaW5kZXggb24gTmF2XG4gIGZ1bmN0aW9uIHVwZGF0ZU5hdlN0YXR1cyAoKSB7XG4gICAgLy8gZ2V0IGN1cnJlbnQgbmF2XG4gICAgaWYgKG5hdikge1xuICAgICAgbmF2Q3VycmVudEluZGV4ID0gbmF2Q2xpY2tlZCA+PSAwID8gbmF2Q2xpY2tlZCA6IGdldEN1cnJlbnROYXZJbmRleCgpO1xuICAgICAgbmF2Q2xpY2tlZCA9IC0xO1xuXG4gICAgICBpZiAobmF2Q3VycmVudEluZGV4ICE9PSBuYXZDdXJyZW50SW5kZXhDYWNoZWQpIHtcbiAgICAgICAgdmFyIG5hdlByZXYgPSBuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhDYWNoZWRdLFxuICAgICAgICAgICAgbmF2Q3VycmVudCA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF07XG5cbiAgICAgICAgc2V0QXR0cnMobmF2UHJldiwge1xuICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAobmF2Q3VycmVudEluZGV4Q2FjaGVkICsgMSlcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdlByZXYsIG5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgXG4gICAgICAgIHNldEF0dHJzKG5hdkN1cnJlbnQsIHsnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXggKyAxKSArIG5hdlN0ckN1cnJlbnR9KTtcbiAgICAgICAgcmVtb3ZlQXR0cnMobmF2Q3VycmVudCwgJ3RhYmluZGV4Jyk7XG4gICAgICAgIGFkZENsYXNzKG5hdkN1cnJlbnQsIG5hdkFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZDdXJyZW50SW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TG93ZXJDYXNlTm9kZU5hbWUgKGVsKSB7XG4gICAgcmV0dXJuIGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0J1dHRvbiAoZWwpIHtcbiAgICByZXR1cm4gZ2V0TG93ZXJDYXNlTm9kZU5hbWUoZWwpID09PSAnYnV0dG9uJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXJpYURpc2FibGVkIChlbCkge1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzRW5hYmxlRWxlbWVudCAoaXNCdXR0b24sIGVsLCB2YWwpIHtcbiAgICBpZiAoaXNCdXR0b24pIHtcbiAgICAgIGVsLmRpc2FibGVkID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCB2YWwudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0ICdkaXNhYmxlZCcgdG8gdHJ1ZSBvbiBjb250cm9scyB3aGVuIHJlYWNoIHRoZSBlZGdlc1xuICBmdW5jdGlvbiB1cGRhdGVDb250cm9sc1N0YXR1cyAoKSB7XG4gICAgaWYgKCFjb250cm9scyB8fCByZXdpbmQgfHwgbG9vcCkgeyByZXR1cm47IH1cblxuICAgIHZhciBwcmV2RGlzYWJsZWQgPSAocHJldklzQnV0dG9uKSA/IHByZXZCdXR0b24uZGlzYWJsZWQgOiBpc0FyaWFEaXNhYmxlZChwcmV2QnV0dG9uKSxcbiAgICAgICAgbmV4dERpc2FibGVkID0gKG5leHRJc0J1dHRvbikgPyBuZXh0QnV0dG9uLmRpc2FibGVkIDogaXNBcmlhRGlzYWJsZWQobmV4dEJ1dHRvbiksXG4gICAgICAgIGRpc2FibGVQcmV2ID0gKGluZGV4IDw9IGluZGV4TWluKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgZGlzYWJsZU5leHQgPSAoIXJld2luZCAmJiBpbmRleCA+PSBpbmRleE1heCkgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBpZiAoZGlzYWJsZVByZXYgJiYgIXByZXZEaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChwcmV2SXNCdXR0b24sIHByZXZCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIWRpc2FibGVQcmV2ICYmIHByZXZEaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChwcmV2SXNCdXR0b24sIHByZXZCdXR0b24sIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKGRpc2FibGVOZXh0ICYmICFuZXh0RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQobmV4dElzQnV0dG9uLCBuZXh0QnV0dG9uLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKCFkaXNhYmxlTmV4dCAmJiBuZXh0RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQobmV4dElzQnV0dG9uLCBuZXh0QnV0dG9uLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IGR1cmF0aW9uXG4gIGZ1bmN0aW9uIHJlc2V0RHVyYXRpb24gKGVsLCBzdHIpIHtcbiAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IGVsLnN0eWxlW1RSQU5TSVRJT05EVVJBVElPTl0gPSBzdHI7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlcldpZHRoICgpIHtcbiAgICByZXR1cm4gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnROZXcgOiBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENlbnRlckdhcCAobnVtKSB7XG4gICAgaWYgKG51bSA9PSBudWxsKSB7IG51bSA9IGluZGV4OyB9XG5cbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBndXR0ZXIgOiAwO1xuICAgIHJldHVybiBhdXRvV2lkdGggPyAoKHZpZXdwb3J0IC0gZ2FwKSAtIChzbGlkZVBvc2l0aW9uc1tudW0gKyAxXSAtIHNsaWRlUG9zaXRpb25zW251bV0gLSBndXR0ZXIpKS8yIDpcbiAgICAgIGZpeGVkV2lkdGggPyAodmlld3BvcnQgLSBmaXhlZFdpZHRoKSAvIDIgOlxuICAgICAgICAoaXRlbXMgLSAxKSAvIDI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSaWdodEJvdW5kYXJ5ICgpIHtcbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBndXR0ZXIgOiAwLFxuICAgICAgICByZXN1bHQgPSAodmlld3BvcnQgKyBnYXApIC0gZ2V0U2xpZGVyV2lkdGgoKTtcblxuICAgIGlmIChjZW50ZXIgJiYgIWxvb3ApIHtcbiAgICAgIHJlc3VsdCA9IGZpeGVkV2lkdGggPyAtIChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIChzbGlkZUNvdW50TmV3IC0gMSkgLSBnZXRDZW50ZXJHYXAoKSA6XG4gICAgICAgIGdldENlbnRlckdhcChzbGlkZUNvdW50TmV3IC0gMSkgLSBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3IC0gMV07XG4gICAgfVxuICAgIGlmIChyZXN1bHQgPiAwKSB7IHJlc3VsdCA9IDA7IH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSAobnVtKSB7XG4gICAgaWYgKG51bSA9PSBudWxsKSB7IG51bSA9IGluZGV4OyB9XG5cbiAgICB2YXIgdmFsO1xuICAgIGlmIChob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgIHZhbCA9IC0gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogbnVtO1xuICAgICAgICBpZiAoY2VudGVyKSB7IHZhbCArPSBnZXRDZW50ZXJHYXAoKTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlbm9taW5hdG9yID0gVFJBTlNGT1JNID8gc2xpZGVDb3VudE5ldyA6IGl0ZW1zO1xuICAgICAgICBpZiAoY2VudGVyKSB7IG51bSAtPSBnZXRDZW50ZXJHYXAoKTsgfVxuICAgICAgICB2YWwgPSAtIG51bSAqIDEwMCAvIGRlbm9taW5hdG9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YWwgPSAtIHNsaWRlUG9zaXRpb25zW251bV07XG4gICAgICBpZiAoY2VudGVyICYmIGF1dG9XaWR0aCkge1xuICAgICAgICB2YWwgKz0gZ2V0Q2VudGVyR2FwKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1JpZ2h0RGVhZFpvbmUpIHsgdmFsID0gTWF0aC5tYXgodmFsLCByaWdodEJvdW5kYXJ5KTsgfVxuXG4gICAgdmFsICs9IChob3Jpem9udGFsICYmICFhdXRvV2lkdGggJiYgIWZpeGVkV2lkdGgpID8gJyUnIDogJ3B4JztcblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCAodmFsKSB7XG4gICAgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcwcycpO1xuICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKHZhbCk7XG4gIH1cblxuICBmdW5jdGlvbiBkb0NvbnRhaW5lclRyYW5zZm9ybSAodmFsKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7IHZhbCA9IGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCk7IH1cbiAgICBjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0gPSB0cmFuc2Zvcm1QcmVmaXggKyB2YWwgKyB0cmFuc2Zvcm1Qb3N0Zml4O1xuICB9XG5cbiAgZnVuY3Rpb24gYW5pbWF0ZVNsaWRlIChudW1iZXIsIGNsYXNzT3V0LCBjbGFzc0luLCBpc091dCkge1xuICAgIHZhciBsID0gbnVtYmVyICsgaXRlbXM7XG4gICAgaWYgKCFsb29wKSB7IGwgPSBNYXRoLm1pbihsLCBzbGlkZUNvdW50TmV3KTsgfVxuXG4gICAgZm9yICh2YXIgaSA9IG51bWJlcjsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG5cbiAgICAgIC8vIHNldCBpdGVtIHBvc2l0aW9uc1xuICAgICAgaWYgKCFpc091dCkgeyBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnOyB9XG5cbiAgICAgIGlmIChhbmltYXRlRGVsYXkgJiYgVFJBTlNJVElPTkRFTEFZKSB7XG4gICAgICAgIGl0ZW0uc3R5bGVbVFJBTlNJVElPTkRFTEFZXSA9IGl0ZW0uc3R5bGVbQU5JTUFUSU9OREVMQVldID0gYW5pbWF0ZURlbGF5ICogKGkgLSBudW1iZXIpIC8gMTAwMCArICdzJztcbiAgICAgIH1cbiAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGNsYXNzT3V0KTtcbiAgICAgIGFkZENsYXNzKGl0ZW0sIGNsYXNzSW4pO1xuICAgICAgXG4gICAgICBpZiAoaXNPdXQpIHsgc2xpZGVJdGVtc091dC5wdXNoKGl0ZW0pOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gbWFrZSB0cmFuc2ZlciBhZnRlciBjbGljay9kcmFnOlxuICAvLyAxLiBjaGFuZ2UgJ3RyYW5zZm9ybScgcHJvcGVydHkgZm9yIG1vcmRlcm4gYnJvd3NlcnNcbiAgLy8gMi4gY2hhbmdlICdsZWZ0JyBwcm9wZXJ0eSBmb3IgbGVnYWN5IGJyb3dzZXJzXG4gIHZhciB0cmFuc2Zvcm1Db3JlID0gKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2Fyb3VzZWwgP1xuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJycpO1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OIHx8ICFzcGVlZCkge1xuICAgICAgICAgIC8vIGZvciBtb3JkZW4gYnJvd3NlcnMgd2l0aCBub24temVybyBkdXJhdGlvbiBvciBcbiAgICAgICAgICAvLyB6ZXJvIGR1cmF0aW9uIGZvciBhbGwgYnJvd3NlcnNcbiAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybSgpO1xuICAgICAgICAgIC8vIHJ1biBmYWxsYmFjayBmdW5jdGlvbiBtYW51YWxseSBcbiAgICAgICAgICAvLyB3aGVuIGR1cmF0aW9uIGlzIDAgLyBjb250YWluZXIgaXMgaGlkZGVuXG4gICAgICAgICAgaWYgKCFzcGVlZCB8fCAhaXNWaXNpYmxlKGNvbnRhaW5lcikpIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZvciBvbGQgYnJvd3NlciB3aXRoIG5vbi16ZXJvIGR1cmF0aW9uXG4gICAgICAgICAganNUcmFuc2Zvcm0oY29udGFpbmVyLCB0cmFuc2Zvcm1BdHRyLCB0cmFuc2Zvcm1QcmVmaXgsIHRyYW5zZm9ybVBvc3RmaXgsIGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCksIHNwZWVkLCBvblRyYW5zaXRpb25FbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFob3Jpem9udGFsKSB7IHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7IH1cbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBzbGlkZUl0ZW1zT3V0ID0gW107XG5cbiAgICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBldmVbQU5JTUFUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgICAgcmVtb3ZlRXZlbnRzKHNsaWRlSXRlbXNbaW5kZXhDYWNoZWRdLCBldmUpO1xuICAgICAgICBhZGRFdmVudHMoc2xpZGVJdGVtc1tpbmRleF0sIGV2ZSk7XG5cbiAgICAgICAgYW5pbWF0ZVNsaWRlKGluZGV4Q2FjaGVkLCBhbmltYXRlSW4sIGFuaW1hdGVPdXQsIHRydWUpO1xuICAgICAgICBhbmltYXRlU2xpZGUoaW5kZXgsIGFuaW1hdGVOb3JtYWwsIGFuaW1hdGVJbik7XG5cbiAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5IFxuICAgICAgICAvLyB3aGVuIHRyYW5zaXRpb24gb3IgYW5pbWF0aW9uIG5vdCBzdXBwb3J0ZWQgLyBkdXJhdGlvbiBpcyAwXG4gICAgICAgIGlmICghVFJBTlNJVElPTkVORCB8fCAhQU5JTUFUSU9ORU5EIHx8ICFzcGVlZCB8fCAhaXNWaXNpYmxlKGNvbnRhaW5lcikpIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gcmVuZGVyIChlLCBzbGlkZXJNb3ZlZCkge1xuICAgIGlmICh1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSkgeyB1cGRhdGVJbmRleCgpOyB9XG5cbiAgICAvLyByZW5kZXIgd2hlbiBzbGlkZXIgd2FzIG1vdmVkICh0b3VjaCBvciBkcmFnKSBldmVuIHRob3VnaCBpbmRleCBtYXkgbm90IGNoYW5nZVxuICAgIGlmIChpbmRleCAhPT0gaW5kZXhDYWNoZWQgfHwgc2xpZGVyTW92ZWQpIHtcbiAgICAgIC8vIGV2ZW50c1xuICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG4gICAgICBldmVudHMuZW1pdCgndHJhbnNpdGlvblN0YXJ0JywgaW5mbygpKTtcbiAgICAgIGlmIChhdXRvSGVpZ2h0KSB7IGRvQXV0b0hlaWdodCgpOyB9XG5cbiAgICAgIC8vIHBhdXNlIGF1dG9wbGF5IHdoZW4gY2xpY2sgb3Iga2V5ZG93biBmcm9tIHVzZXJcbiAgICAgIGlmIChhbmltYXRpbmcgJiYgZSAmJiBbJ2NsaWNrJywgJ2tleWRvd24nXS5pbmRleE9mKGUudHlwZSkgPj0gMCkgeyBzdG9wQXV0b3BsYXkoKTsgfVxuXG4gICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgIHRyYW5zZm9ybUNvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBUcmFuc2ZlciBwcmVmaXhlZCBwcm9wZXJ0aWVzIHRvIHRoZSBzYW1lIGZvcm1hdFxuICAgKiBDU1M6IC1XZWJraXQtVHJhbnNmb3JtID0+IHdlYmtpdHRyYW5zZm9ybVxuICAgKiBKUzogV2Via2l0VHJhbnNmb3JtID0+IHdlYmtpdHRyYW5zZm9ybVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gcHJvcGVydHlcbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIHN0clRyYW5zIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLS9nLCAnJyk7XG4gIH1cblxuICAvLyBBRlRFUiBUUkFOU0ZPUk1cbiAgLy8gVGhpbmdzIG5lZWQgdG8gYmUgZG9uZSBhZnRlciBhIHRyYW5zZmVyOlxuICAvLyAxLiBjaGVjayBpbmRleFxuICAvLyAyLiBhZGQgY2xhc3NlcyB0byB2aXNpYmxlIHNsaWRlXG4gIC8vIDMuIGRpc2FibGUgY29udHJvbHMgYnV0dG9ucyB3aGVuIHJlYWNoIHRoZSBmaXJzdC9sYXN0IHNsaWRlIGluIG5vbi1sb29wIHNsaWRlclxuICAvLyA0LiB1cGRhdGUgbmF2IHN0YXR1c1xuICAvLyA1LiBsYXp5bG9hZCBpbWFnZXNcbiAgLy8gNi4gdXBkYXRlIGNvbnRhaW5lciBoZWlnaHRcbiAgZnVuY3Rpb24gb25UcmFuc2l0aW9uRW5kIChldmVudCkge1xuICAgIC8vIGNoZWNrIHJ1bm5pbmcgb24gZ2FsbGVyeSBtb2RlXG4gICAgLy8gbWFrZSBzdXJlIHRyYW50aW9uZW5kL2FuaW1hdGlvbmVuZCBldmVudHMgcnVuIG9ubHkgb25jZVxuICAgIGlmIChjYXJvdXNlbCB8fCBydW5uaW5nKSB7XG4gICAgICBldmVudHMuZW1pdCgndHJhbnNpdGlvbkVuZCcsIGluZm8oZXZlbnQpKTtcblxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBzbGlkZUl0ZW1zT3V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZUl0ZW1zT3V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zT3V0W2ldO1xuICAgICAgICAgIC8vIHNldCBpdGVtIHBvc2l0aW9uc1xuICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICcnO1xuXG4gICAgICAgICAgaWYgKEFOSU1BVElPTkRFTEFZICYmIFRSQU5TSVRJT05ERUxBWSkgeyBcbiAgICAgICAgICAgIGl0ZW0uc3R5bGVbQU5JTUFUSU9OREVMQVldID0gJyc7XG4gICAgICAgICAgICBpdGVtLnN0eWxlW1RSQU5TSVRJT05ERUxBWV0gPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XG4gICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogdXBkYXRlIHNsaWRlcywgbmF2LCBjb250cm9scyBhZnRlciBjaGVja2luZyAuLi5cbiAgICAgICAqID0+IGxlZ2FjeSBicm93c2VycyB3aG8gZG9uJ3Qgc3VwcG9ydCAnZXZlbnQnIFxuICAgICAgICogICAgaGF2ZSB0byBjaGVjayBldmVudCBmaXJzdCwgb3RoZXJ3aXNlIGV2ZW50LnRhcmdldCB3aWxsIGNhdXNlIGFuIGVycm9yIFxuICAgICAgICogPT4gb3IgJ2dhbGxlcnknIG1vZGU6IFxuICAgICAgICogICArIGV2ZW50IHRhcmdldCBpcyBzbGlkZSBpdGVtXG4gICAgICAgKiA9PiBvciAnY2Fyb3VzZWwnIG1vZGU6IFxuICAgICAgICogICArIGV2ZW50IHRhcmdldCBpcyBjb250YWluZXIsIFxuICAgICAgICogICArIGV2ZW50LnByb3BlcnR5IGlzIHRoZSBzYW1lIHdpdGggdHJhbnNmb3JtIGF0dHJpYnV0ZVxuICAgICAgICovXG4gICAgICBpZiAoIWV2ZW50IHx8IFxuICAgICAgICAgICFjYXJvdXNlbCAmJiBldmVudC50YXJnZXQucGFyZW50Tm9kZSA9PT0gY29udGFpbmVyIHx8IFxuICAgICAgICAgIGV2ZW50LnRhcmdldCA9PT0gY29udGFpbmVyICYmIHN0clRyYW5zKGV2ZW50LnByb3BlcnR5TmFtZSkgPT09IHN0clRyYW5zKHRyYW5zZm9ybUF0dHIpKSB7XG5cbiAgICAgICAgaWYgKCF1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSkgeyBcbiAgICAgICAgICB2YXIgaW5kZXhUZW0gPSBpbmRleDtcbiAgICAgICAgICB1cGRhdGVJbmRleCgpO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gaW5kZXhUZW0pIHsgXG4gICAgICAgICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcblxuICAgICAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykgeyBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpOyB9XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIC8vICMgQUNUSU9OU1xuICBmdW5jdGlvbiBnb1RvICh0YXJnZXRJbmRleCwgZSkge1xuICAgIGlmIChmcmVlemUpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBwcmV2IHNsaWRlQnlcbiAgICBpZiAodGFyZ2V0SW5kZXggPT09ICdwcmV2Jykge1xuICAgICAgb25Db250cm9sc0NsaWNrKGUsIC0xKTtcblxuICAgIC8vIG5leHQgc2xpZGVCeVxuICAgIH0gZWxzZSBpZiAodGFyZ2V0SW5kZXggPT09ICduZXh0Jykge1xuICAgICAgb25Db250cm9sc0NsaWNrKGUsIDEpO1xuXG4gICAgLy8gZ28gdG8gZXhhY3Qgc2xpZGVcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgICB9XG5cbiAgICAgIHZhciBhYnNJbmRleCA9IGdldEFic0luZGV4KCksIFxuICAgICAgICAgIGluZGV4R2FwID0gMDtcblxuICAgICAgaWYgKHRhcmdldEluZGV4ID09PSAnZmlyc3QnKSB7XG4gICAgICAgIGluZGV4R2FwID0gLSBhYnNJbmRleDtcbiAgICAgIH0gZWxzZSBpZiAodGFyZ2V0SW5kZXggPT09ICdsYXN0Jykge1xuICAgICAgICBpbmRleEdhcCA9IGNhcm91c2VsID8gc2xpZGVDb3VudCAtIGl0ZW1zIC0gYWJzSW5kZXggOiBzbGlkZUNvdW50IC0gMSAtIGFic0luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRJbmRleCAhPT0gJ251bWJlcicpIHsgdGFyZ2V0SW5kZXggPSBwYXJzZUludCh0YXJnZXRJbmRleCk7IH1cblxuICAgICAgICBpZiAoIWlzTmFOKHRhcmdldEluZGV4KSkge1xuICAgICAgICAgIC8vIGZyb20gZGlyZWN0bHkgY2FsbGVkIGdvVG8gZnVuY3Rpb25cbiAgICAgICAgICBpZiAoIWUpIHsgdGFyZ2V0SW5kZXggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzbGlkZUNvdW50IC0gMSwgdGFyZ2V0SW5kZXgpKTsgfVxuXG4gICAgICAgICAgaW5kZXhHYXAgPSB0YXJnZXRJbmRleCAtIGFic0luZGV4O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGdhbGxlcnk6IG1ha2Ugc3VyZSBuZXcgcGFnZSB3b24ndCBvdmVybGFwIHdpdGggY3VycmVudCBwYWdlXG4gICAgICBpZiAoIWNhcm91c2VsICYmIGluZGV4R2FwICYmIE1hdGguYWJzKGluZGV4R2FwKSA8IGl0ZW1zKSB7XG4gICAgICAgIHZhciBmYWN0b3IgPSBpbmRleEdhcCA+IDAgPyAxIDogLTE7XG4gICAgICAgIGluZGV4R2FwICs9IChpbmRleCArIGluZGV4R2FwIC0gc2xpZGVDb3VudCkgPj0gaW5kZXhNaW4gPyBzbGlkZUNvdW50ICogZmFjdG9yIDogc2xpZGVDb3VudCAqIDIgKiBmYWN0b3IgKiAtMTtcbiAgICAgIH1cblxuICAgICAgaW5kZXggKz0gaW5kZXhHYXA7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSBpbmRleCBpcyBpbiByYW5nZVxuICAgICAgaWYgKGNhcm91c2VsICYmIGxvb3ApIHtcbiAgICAgICAgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxuICAgICAgICBpZiAoaW5kZXggPiBpbmRleE1heCkgeyBpbmRleCAtPSBzbGlkZUNvdW50OyB9XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGluZGV4IGlzIGNoYW5nZWQsIHN0YXJ0IHJlbmRlcmluZ1xuICAgICAgaWYgKGdldEFic0luZGV4KGluZGV4KSAhPT0gZ2V0QWJzSW5kZXgoaW5kZXhDYWNoZWQpKSB7XG4gICAgICAgIHJlbmRlcihlKTtcbiAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIC8vIG9uIGNvbnRyb2xzIGNsaWNrXG4gIGZ1bmN0aW9uIG9uQ29udHJvbHNDbGljayAoZSwgZGlyKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cbiAgICB2YXIgcGFzc0V2ZW50T2JqZWN0O1xuXG4gICAgaWYgKCFkaXIpIHtcbiAgICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoZSk7XG5cbiAgICAgIHdoaWxlICh0YXJnZXQgIT09IGNvbnRyb2xzQ29udGFpbmVyICYmIFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXS5pbmRleE9mKHRhcmdldCkgPCAwKSB7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlOyB9XG5cbiAgICAgIHZhciB0YXJnZXRJbiA9IFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXS5pbmRleE9mKHRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0SW4gPj0gMCkge1xuICAgICAgICBwYXNzRXZlbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBkaXIgPSB0YXJnZXRJbiA9PT0gMCA/IC0xIDogMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmV3aW5kKSB7XG4gICAgICBpZiAoaW5kZXggPT09IGluZGV4TWluICYmIGRpciA9PT0gLTEpIHtcbiAgICAgICAgZ29UbygnbGFzdCcsIGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBpbmRleE1heCAmJiBkaXIgPT09IDEpIHtcbiAgICAgICAgZ29UbygnZmlyc3QnLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXIpIHtcbiAgICAgIGluZGV4ICs9IHNsaWRlQnkgKiBkaXI7XG4gICAgICBpZiAoYXV0b1dpZHRoKSB7IGluZGV4ID0gTWF0aC5mbG9vcihpbmRleCk7IH1cbiAgICAgIC8vIHBhc3MgZSB3aGVuIGNsaWNrIGNvbnRyb2wgYnV0dG9ucyBvciBrZXlkb3duXG4gICAgICByZW5kZXIoKHBhc3NFdmVudE9iamVjdCB8fCAoZSAmJiBlLnR5cGUgPT09ICdrZXlkb3duJykpID8gZSA6IG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG9uIG5hdiBjbGlja1xuICBmdW5jdGlvbiBvbk5hdkNsaWNrIChlKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cbiAgICBcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKSwgbmF2SW5kZXg7XG5cbiAgICAvLyBmaW5kIHRoZSBjbGlja2VkIG5hdiBpdGVtXG4gICAgd2hpbGUgKHRhcmdldCAhPT0gbmF2Q29udGFpbmVyICYmICFoYXNBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpIHsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7IH1cbiAgICBpZiAoaGFzQXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSB7XG4gICAgICB2YXIgbmF2SW5kZXggPSBuYXZDbGlja2VkID0gTnVtYmVyKGdldEF0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSksXG4gICAgICAgICAgdGFyZ2V0SW5kZXhCYXNlID0gZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggPyBuYXZJbmRleCAqIHNsaWRlQ291bnQgLyBwYWdlcyA6IG5hdkluZGV4ICogaXRlbXMsXG4gICAgICAgICAgdGFyZ2V0SW5kZXggPSBuYXZBc1RodW1ibmFpbHMgPyBuYXZJbmRleCA6IE1hdGgubWluKE1hdGguY2VpbCh0YXJnZXRJbmRleEJhc2UpLCBzbGlkZUNvdW50IC0gMSk7XG4gICAgICBnb1RvKHRhcmdldEluZGV4LCBlKTtcblxuICAgICAgaWYgKG5hdkN1cnJlbnRJbmRleCA9PT0gbmF2SW5kZXgpIHtcbiAgICAgICAgaWYgKGFuaW1hdGluZykgeyBzdG9wQXV0b3BsYXkoKTsgfVxuICAgICAgICBuYXZDbGlja2VkID0gLTE7IC8vIHJlc2V0IG5hdkNsaWNrZWRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBhdXRvcGxheSBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gc2V0QXV0b3BsYXlUaW1lciAoKSB7XG4gICAgYXV0b3BsYXlUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhudWxsLCBhdXRvcGxheURpcmVjdGlvbik7XG4gICAgfSwgYXV0b3BsYXlUaW1lb3V0KTtcblxuICAgIGFuaW1hdGluZyA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wQXV0b3BsYXlUaW1lciAoKSB7XG4gICAgY2xlYXJJbnRlcnZhbChhdXRvcGxheVRpbWVyKTtcbiAgICBhbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUF1dG9wbGF5QnV0dG9uIChhY3Rpb24sIHR4dCkge1xuICAgIHNldEF0dHJzKGF1dG9wbGF5QnV0dG9uLCB7J2RhdGEtYWN0aW9uJzogYWN0aW9ufSk7XG4gICAgYXV0b3BsYXlCdXR0b24uaW5uZXJIVE1MID0gYXV0b3BsYXlIdG1sU3RyaW5nc1swXSArIGFjdGlvbiArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMV0gKyB0eHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEF1dG9wbGF5ICgpIHtcbiAgICBzZXRBdXRvcGxheVRpbWVyKCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHVwZGF0ZUF1dG9wbGF5QnV0dG9uKCdzdG9wJywgYXV0b3BsYXlUZXh0WzFdKTsgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RvcEF1dG9wbGF5ICgpIHtcbiAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyB1cGRhdGVBdXRvcGxheUJ1dHRvbignc3RhcnQnLCBhdXRvcGxheVRleHRbMF0pOyB9XG4gIH1cblxuICAvLyBwcm9ncmFtYWl0Y2FsbHkgcGxheS9wYXVzZSB0aGUgc2xpZGVyXG4gIGZ1bmN0aW9uIHBsYXkgKCkge1xuICAgIGlmIChhdXRvcGxheSAmJiAhYW5pbWF0aW5nKSB7XG4gICAgICBzdGFydEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcGF1c2UgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgIHN0b3BBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGVBdXRvcGxheSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgc3RvcEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblZpc2liaWxpdHlDaGFuZ2UgKCkge1xuICAgIGlmIChkb2MuaGlkZGVuKSB7XG4gICAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQpIHtcbiAgICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlb3ZlclBhdXNlICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7IFxuICAgICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlb3V0UmVzdGFydCAoKSB7XG4gICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZWQpIHsgXG4gICAgICBzZXRBdXRvcGxheVRpbWVyKCk7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8ga2V5ZG93biBldmVudHMgb24gZG9jdW1lbnQgXG4gIGZ1bmN0aW9uIG9uRG9jdW1lbnRLZXlkb3duIChlKSB7XG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFRdLmluZGV4T2YoZS5rZXlDb2RlKTtcblxuICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwga2V5SW5kZXggPT09IDAgPyAtMSA6IDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG9uIGtleSBjb250cm9sXG4gIGZ1bmN0aW9uIG9uQ29udHJvbHNLZXlkb3duIChlKSB7XG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFRdLmluZGV4T2YoZS5rZXlDb2RlKTtcblxuICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICBpZiAoa2V5SW5kZXggPT09IDApIHtcbiAgICAgICAgaWYgKCFwcmV2QnV0dG9uLmRpc2FibGVkKSB7IG9uQ29udHJvbHNDbGljayhlLCAtMSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoIW5leHRCdXR0b24uZGlzYWJsZWQpIHtcbiAgICAgICAgb25Db250cm9sc0NsaWNrKGUsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBmb2N1c1xuICBmdW5jdGlvbiBzZXRGb2N1cyAoZWwpIHtcbiAgICBlbC5mb2N1cygpO1xuICB9XG5cbiAgLy8gb24ga2V5IG5hdlxuICBmdW5jdGlvbiBvbk5hdktleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGN1ckVsZW1lbnQgPSBkb2MuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoIWhhc0F0dHIoY3VyRWxlbWVudCwgJ2RhdGEtbmF2JykpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyB2YXIgY29kZSA9IGUua2V5Q29kZSxcbiAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hULCBLRVlTLkVOVEVSLCBLRVlTLlNQQUNFXS5pbmRleE9mKGUua2V5Q29kZSksXG4gICAgICAgIG5hdkluZGV4ID0gTnVtYmVyKGdldEF0dHIoY3VyRWxlbWVudCwgJ2RhdGEtbmF2JykpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIGlmIChrZXlJbmRleCA9PT0gMCkge1xuICAgICAgICBpZiAobmF2SW5kZXggPiAwKSB7IHNldEZvY3VzKG5hdkl0ZW1zW25hdkluZGV4IC0gMV0pOyB9XG4gICAgICB9IGVsc2UgaWYgKGtleUluZGV4ID09PSAxKSB7XG4gICAgICAgIGlmIChuYXZJbmRleCA8IHBhZ2VzIC0gMSkgeyBzZXRGb2N1cyhuYXZJdGVtc1tuYXZJbmRleCArIDFdKTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmF2Q2xpY2tlZCA9IG5hdkluZGV4O1xuICAgICAgICBnb1RvKG5hdkluZGV4LCBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFdmVudCAoZSkge1xuICAgIGUgPSBlIHx8IHdpbi5ldmVudDtcbiAgICByZXR1cm4gaXNUb3VjaEV2ZW50KGUpID8gZS5jaGFuZ2VkVG91Y2hlc1swXSA6IGU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0IChlKSB7XG4gICAgcmV0dXJuIGUudGFyZ2V0IHx8IHdpbi5ldmVudC5zcmNFbGVtZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNUb3VjaEV2ZW50IChlKSB7XG4gICAgcmV0dXJuIGUudHlwZS5pbmRleE9mKCd0b3VjaCcpID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCAoKSB7XG4gICAgcmV0dXJuIGdldFRvdWNoRGlyZWN0aW9uKHRvRGVncmVlKGxhc3RQb3NpdGlvbi55IC0gaW5pdFBvc2l0aW9uLnksIGxhc3RQb3NpdGlvbi54IC0gaW5pdFBvc2l0aW9uLngpLCBzd2lwZUFuZ2xlKSA9PT0gb3B0aW9ucy5heGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5TdGFydCAoZSkge1xuICAgIGlmIChydW5uaW5nKSB7XG4gICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICB9XG5cbiAgICBpZiAoYXV0b3BsYXkgJiYgYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheVRpbWVyKCk7IH1cbiAgICBcbiAgICBwYW5TdGFydCA9IHRydWU7XG4gICAgaWYgKHJhZkluZGV4KSB7XG4gICAgICBjYWYocmFmSW5kZXgpO1xuICAgICAgcmFmSW5kZXggPSBudWxsO1xuICAgIH1cblxuICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgZXZlbnRzLmVtaXQoaXNUb3VjaEV2ZW50KGUpID8gJ3RvdWNoU3RhcnQnIDogJ2RyYWdTdGFydCcsIGluZm8oZSkpO1xuXG4gICAgaWYgKCFpc1RvdWNoRXZlbnQoZSkgJiYgWydpbWcnLCAnYSddLmluZGV4T2YoZ2V0TG93ZXJDYXNlTm9kZU5hbWUoZ2V0VGFyZ2V0KGUpKSkgPj0gMCkge1xuICAgICAgcHJldmVudERlZmF1bHRCZWhhdmlvcihlKTtcbiAgICB9XG5cbiAgICBsYXN0UG9zaXRpb24ueCA9IGluaXRQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xuICAgIGxhc3RQb3NpdGlvbi55ID0gaW5pdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XG4gICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICB0cmFuc2xhdGVJbml0ID0gcGFyc2VGbG9hdChjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0ucmVwbGFjZSh0cmFuc2Zvcm1QcmVmaXgsICcnKSk7XG4gICAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJzBzJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5Nb3ZlIChlKSB7XG4gICAgaWYgKHBhblN0YXJ0KSB7XG4gICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgICAgbGFzdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgICBsYXN0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcblxuICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIGlmICghcmFmSW5kZXgpIHsgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKXsgcGFuVXBkYXRlKGUpOyB9KTsgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9PT0gJz8nKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCgpOyB9XG4gICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHsgcHJldmVudFNjcm9sbCA9IHRydWU7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZlbnRTY3JvbGwpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFuVXBkYXRlIChlKSB7XG4gICAgaWYgKCFtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcbiAgICAgIHBhblN0YXJ0ID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNhZihyYWZJbmRleCk7XG4gICAgaWYgKHBhblN0YXJ0KSB7IHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCl7IHBhblVwZGF0ZShlKTsgfSk7IH1cblxuICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPT09ICc/JykgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQoKTsgfVxuICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcbiAgICAgIGlmICghcHJldmVudFNjcm9sbCAmJiBpc1RvdWNoRXZlbnQoZSkpIHsgcHJldmVudFNjcm9sbCA9IHRydWU7IH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGUudHlwZSkgeyBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hNb3ZlJyA6ICdkcmFnTW92ZScsIGluZm8oZSkpOyB9XG4gICAgICB9IGNhdGNoKGVycikge31cblxuICAgICAgdmFyIHggPSB0cmFuc2xhdGVJbml0LFxuICAgICAgICAgIGRpc3QgPSBnZXREaXN0KGxhc3RQb3NpdGlvbiwgaW5pdFBvc2l0aW9uKTtcbiAgICAgIGlmICghaG9yaXpvbnRhbCB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkge1xuICAgICAgICB4ICs9IGRpc3Q7XG4gICAgICAgIHggKz0gJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwZXJjZW50YWdlWCA9IFRSQU5TRk9STSA/IGRpc3QgKiBpdGVtcyAqIDEwMCAvICgodmlld3BvcnQgKyBndXR0ZXIpICogc2xpZGVDb3VudE5ldyk6IGRpc3QgKiAxMDAgLyAodmlld3BvcnQgKyBndXR0ZXIpO1xuICAgICAgICB4ICs9IHBlcmNlbnRhZ2VYO1xuICAgICAgICB4ICs9ICclJztcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdID0gdHJhbnNmb3JtUHJlZml4ICsgeCArIHRyYW5zZm9ybVBvc3RmaXg7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5FbmQgKGUpIHtcbiAgICBpZiAocGFuU3RhcnQpIHtcbiAgICAgIGlmIChyYWZJbmRleCkge1xuICAgICAgICBjYWYocmFmSW5kZXgpO1xuICAgICAgICByYWZJbmRleCA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoY2Fyb3VzZWwpIHsgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcnKTsgfVxuICAgICAgcGFuU3RhcnQgPSBmYWxzZTtcblxuICAgICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICAgIGxhc3RQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xuICAgICAgbGFzdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XG4gICAgICB2YXIgZGlzdCA9IGdldERpc3QobGFzdFBvc2l0aW9uLCBpbml0UG9zaXRpb24pO1xuXG4gICAgICBpZiAoTWF0aC5hYnMoZGlzdCkpIHtcbiAgICAgICAgLy8gZHJhZyB2cyBjbGlja1xuICAgICAgICBpZiAoIWlzVG91Y2hFdmVudChlKSkge1xuICAgICAgICAgIC8vIHByZXZlbnQgXCJjbGlja1wiXG4gICAgICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKTtcbiAgICAgICAgICBhZGRFdmVudHModGFyZ2V0LCB7J2NsaWNrJzogZnVuY3Rpb24gcHJldmVudENsaWNrIChlKSB7XG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yKGUpO1xuICAgICAgICAgICAgcmVtb3ZlRXZlbnRzKHRhcmdldCwgeydjbGljayc6IHByZXZlbnRDbGlja30pO1xuICAgICAgICAgIH19KTsgXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcbiAgICAgICAgICAgICAgdmFyIGluZGV4TW92ZWQgPSAtIGRpc3QgKiBpdGVtcyAvICh2aWV3cG9ydCArIGd1dHRlcik7XG4gICAgICAgICAgICAgIGluZGV4TW92ZWQgPSBkaXN0ID4gMCA/IE1hdGguZmxvb3IoaW5kZXhNb3ZlZCkgOiBNYXRoLmNlaWwoaW5kZXhNb3ZlZCk7XG4gICAgICAgICAgICAgIGluZGV4ICs9IGluZGV4TW92ZWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgbW92ZWQgPSAtICh0cmFuc2xhdGVJbml0ICsgZGlzdCk7XG4gICAgICAgICAgICAgIGlmIChtb3ZlZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE1pbjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChtb3ZlZCA+PSBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3IC0gMV0pIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4TWF4O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IHNsaWRlQ291bnROZXcgJiYgbW92ZWQgPj0gc2xpZGVQb3NpdGlvbnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgIGlmIChtb3ZlZCA+IHNsaWRlUG9zaXRpb25zW2ldICYmIGRpc3QgPCAwKSB7IGluZGV4ICs9IDE7IH1cbiAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVuZGVyKGUsIGRpc3QpO1xuICAgICAgICAgICAgZXZlbnRzLmVtaXQoaXNUb3VjaEV2ZW50KGUpID8gJ3RvdWNoRW5kJyA6ICdkcmFnRW5kJywgaW5mbyhlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgICAgICAgb25Db250cm9sc0NsaWNrKGUsIGRpc3QgPiAwID8gLTEgOiAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXNldFxuICAgIGlmIChvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoID09PSAnYXV0bycpIHsgcHJldmVudFNjcm9sbCA9IGZhbHNlOyB9XG4gICAgaWYgKHN3aXBlQW5nbGUpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gJz8nOyB9IFxuICAgIGlmIChhdXRvcGxheSAmJiAhYW5pbWF0aW5nKSB7IHNldEF1dG9wbGF5VGltZXIoKTsgfVxuICB9XG5cbiAgLy8gPT09IFJFU0laRSBGVU5DVElPTlMgPT09IC8vXG4gIC8vIChzbGlkZVBvc2l0aW9ucywgaW5kZXgsIGl0ZW1zKSA9PiB2ZXJ0aWNhbF9jb25lbnRXcmFwcGVyLmhlaWdodFxuICBmdW5jdGlvbiB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCAoKSB7XG4gICAgdmFyIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG4gICAgd3Auc3R5bGUuaGVpZ2h0ID0gc2xpZGVQb3NpdGlvbnNbaW5kZXggKyBpdGVtc10gLSBzbGlkZVBvc2l0aW9uc1tpbmRleF0gKyAncHgnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFnZXMgKCkge1xuICAgIHZhciByb3VnaCA9IGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50IC8gdmlld3BvcnQgOiBzbGlkZUNvdW50IC8gaXRlbXM7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGguY2VpbChyb3VnaCksIHNsaWRlQ291bnQpO1xuICB9XG5cbiAgLypcbiAgICogMS4gdXBkYXRlIHZpc2libGUgbmF2IGl0ZW1zIGxpc3RcbiAgICogMi4gYWRkIFwiaGlkZGVuXCIgYXR0cmlidXRlcyB0byBwcmV2aW91cyB2aXNpYmxlIG5hdiBpdGVtc1xuICAgKiAzLiByZW1vdmUgXCJoaWRkZW5cIiBhdHRydWJ1dGVzIHRvIG5ldyB2aXNpYmxlIG5hdiBpdGVtc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlTmF2VmlzaWJpbGl0eSAoKSB7XG4gICAgaWYgKCFuYXYgfHwgbmF2QXNUaHVtYm5haWxzKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHBhZ2VzICE9PSBwYWdlc0NhY2hlZCkge1xuICAgICAgdmFyIG1pbiA9IHBhZ2VzQ2FjaGVkLFxuICAgICAgICAgIG1heCA9IHBhZ2VzLFxuICAgICAgICAgIGZuID0gc2hvd0VsZW1lbnQ7XG5cbiAgICAgIGlmIChwYWdlc0NhY2hlZCA+IHBhZ2VzKSB7XG4gICAgICAgIG1pbiA9IHBhZ2VzO1xuICAgICAgICBtYXggPSBwYWdlc0NhY2hlZDtcbiAgICAgICAgZm4gPSBoaWRlRWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKG1pbiA8IG1heCkge1xuICAgICAgICBmbihuYXZJdGVtc1ttaW5dKTtcbiAgICAgICAgbWluKys7XG4gICAgICB9XG5cbiAgICAgIC8vIGNhY2hlIHBhZ2VzXG4gICAgICBwYWdlc0NhY2hlZCA9IHBhZ2VzO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluZm8gKGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGFpbmVyOiBjb250YWluZXIsXG4gICAgICBzbGlkZUl0ZW1zOiBzbGlkZUl0ZW1zLFxuICAgICAgbmF2Q29udGFpbmVyOiBuYXZDb250YWluZXIsXG4gICAgICBuYXZJdGVtczogbmF2SXRlbXMsXG4gICAgICBjb250cm9sc0NvbnRhaW5lcjogY29udHJvbHNDb250YWluZXIsXG4gICAgICBoYXNDb250cm9sczogaGFzQ29udHJvbHMsXG4gICAgICBwcmV2QnV0dG9uOiBwcmV2QnV0dG9uLFxuICAgICAgbmV4dEJ1dHRvbjogbmV4dEJ1dHRvbixcbiAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgIHNsaWRlQnk6IHNsaWRlQnksXG4gICAgICBjbG9uZUNvdW50OiBjbG9uZUNvdW50LFxuICAgICAgc2xpZGVDb3VudDogc2xpZGVDb3VudCxcbiAgICAgIHNsaWRlQ291bnROZXc6IHNsaWRlQ291bnROZXcsXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBpbmRleENhY2hlZDogaW5kZXhDYWNoZWQsXG4gICAgICBkaXNwbGF5SW5kZXg6IGdldEN1cnJlbnRTbGlkZSgpLFxuICAgICAgbmF2Q3VycmVudEluZGV4OiBuYXZDdXJyZW50SW5kZXgsXG4gICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQ6IG5hdkN1cnJlbnRJbmRleENhY2hlZCxcbiAgICAgIHBhZ2VzOiBwYWdlcyxcbiAgICAgIHBhZ2VzQ2FjaGVkOiBwYWdlc0NhY2hlZCxcbiAgICAgIHNoZWV0OiBzaGVldCxcbiAgICAgIGlzT246IGlzT24sXG4gICAgICBldmVudDogZSB8fCB7fSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uOiAnMi45LjInLFxuICAgIGdldEluZm86IGluZm8sXG4gICAgZXZlbnRzOiBldmVudHMsXG4gICAgZ29UbzogZ29UbyxcbiAgICBwbGF5OiBwbGF5LFxuICAgIHBhdXNlOiBwYXVzZSxcbiAgICBpc09uOiBpc09uLFxuICAgIHVwZGF0ZVNsaWRlckhlaWdodDogdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0LFxuICAgIHJlZnJlc2g6IGluaXRTbGlkZXJUcmFuc2Zvcm0sXG4gICAgZGVzdHJveTogZGVzdHJveSxcbiAgICByZWJ1aWxkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0bnMoZXh0ZW5kKG9wdGlvbnMsIG9wdGlvbnNFbGVtZW50cykpO1xuICAgIH1cbiAgfTtcbn07XG5cbnJldHVybiB0bnM7XG59KSgpOyIsIi8qIVxuICogQm9vdHN0cmFwIHYzLjQuMSAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tLylcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuaWYgKHR5cGVvZiBqUXVlcnkgPT09ICd1bmRlZmluZWQnKSB7XG4gIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeScpXG59XG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciB2ZXJzaW9uID0gJC5mbi5qcXVlcnkuc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpXG4gIGlmICgodmVyc2lvblswXSA8IDIgJiYgdmVyc2lvblsxXSA8IDkpIHx8ICh2ZXJzaW9uWzBdID09IDEgJiYgdmVyc2lvblsxXSA9PSA5ICYmIHZlcnNpb25bMl0gPCAxKSB8fCAodmVyc2lvblswXSA+IDMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5IHZlcnNpb24gMS45LjEgb3IgaGlnaGVyLCBidXQgbG93ZXIgdGhhbiB2ZXJzaW9uIDQnKVxuICB9XG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0cmFuc2l0aW9uLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RyYW5zaXRpb25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ1NTIFRSQU5TSVRJT04gU1VQUE9SVCAoU2hvdXRvdXQ6IGh0dHBzOi8vbW9kZXJuaXpyLmNvbS8pXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9vdHN0cmFwJylcblxuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICBXZWJraXRUcmFuc2l0aW9uIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgTW96VHJhbnNpdGlvbiAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgIE9UcmFuc2l0aW9uICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgdHJhbnNpdGlvbiAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH1cblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4geyBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlIC8vIGV4cGxpY2l0IGZvciBpZTggKCAgLl8uKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9ibG9nLmFsZXhtYWNjYXcuY29tL2Nzcy10cmFuc2l0aW9uc1xuICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gICAgdmFyICRlbCA9IHRoaXNcbiAgICAkKHRoaXMpLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkgeyBjYWxsZWQgPSB0cnVlIH0pXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBpZiAoIWNhbGxlZCkgJCgkZWwpLnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKSB9XG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgZHVyYXRpb24pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gICQoZnVuY3Rpb24gKCkge1xuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkVuZCgpXG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm5cblxuICAgICQuZXZlbnQuc3BlY2lhbC5ic1RyYW5zaXRpb25FbmQgPSB7XG4gICAgICBiaW5kVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgZGVsZWdhdGVUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGlzKSkgcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWxlcnQuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWxlcnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUxFUlQgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGRpc21pc3MgPSAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ1xuICB2YXIgQWxlcnQgICA9IGZ1bmN0aW9uIChlbCkge1xuICAgICQoZWwpLm9uKCdjbGljaycsIGRpc21pc3MsIHRoaXMuY2xvc2UpXG4gIH1cblxuICBBbGVydC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBBbGVydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgICA9ICQodGhpcylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHNlbGVjdG9yICAgID0gc2VsZWN0b3IgPT09ICcjJyA/IFtdIDogc2VsZWN0b3JcbiAgICB2YXIgJHBhcmVudCA9ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpXG5cbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAoISRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICAkcGFyZW50ID0gJHRoaXMuY2xvc2VzdCgnLmFsZXJ0JylcbiAgICB9XG5cbiAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2Nsb3NlLmJzLmFsZXJ0JykpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KCkge1xuICAgICAgLy8gZGV0YWNoIGZyb20gcGFyZW50LCBmaXJlIGV2ZW50IHRoZW4gY2xlYW4gdXAgZGF0YVxuICAgICAgJHBhcmVudC5kZXRhY2goKS50cmlnZ2VyKCdjbG9zZWQuYnMuYWxlcnQnKS5yZW1vdmUoKVxuICAgIH1cblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICRwYXJlbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkcGFyZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIHJlbW92ZUVsZW1lbnQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICByZW1vdmVFbGVtZW50KClcbiAgfVxuXG5cbiAgLy8gQUxFUlQgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5hbGVydCcpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWxlcnQnLCAoZGF0YSA9IG5ldyBBbGVydCh0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFsZXJ0XG5cbiAgJC5mbi5hbGVydCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFsZXJ0LkNvbnN0cnVjdG9yID0gQWxlcnRcblxuXG4gIC8vIEFMRVJUIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hbGVydC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWxlcnQgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBTEVSVCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5hbGVydC5kYXRhLWFwaScsIGRpc21pc3MsIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYnV0dG9uLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2J1dHRvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBCVVRUT04gUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEJ1dHRvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSAkLmV4dGVuZCh7fSwgQnV0dG9uLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgfVxuXG4gIEJ1dHRvbi5WRVJTSU9OICA9ICczLjQuMSdcblxuICBCdXR0b24uREVGQVVMVFMgPSB7XG4gICAgbG9hZGluZ1RleHQ6ICdsb2FkaW5nLi4uJ1xuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBkICAgID0gJ2Rpc2FibGVkJ1xuICAgIHZhciAkZWwgID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciB2YWwgID0gJGVsLmlzKCdpbnB1dCcpID8gJ3ZhbCcgOiAnaHRtbCdcbiAgICB2YXIgZGF0YSA9ICRlbC5kYXRhKClcblxuICAgIHN0YXRlICs9ICdUZXh0J1xuXG4gICAgaWYgKGRhdGEucmVzZXRUZXh0ID09IG51bGwpICRlbC5kYXRhKCdyZXNldFRleHQnLCAkZWxbdmFsXSgpKVxuXG4gICAgLy8gcHVzaCB0byBldmVudCBsb29wIHRvIGFsbG93IGZvcm1zIHRvIHN1Ym1pdFxuICAgIHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAkZWxbdmFsXShkYXRhW3N0YXRlXSA9PSBudWxsID8gdGhpcy5vcHRpb25zW3N0YXRlXSA6IGRhdGFbc3RhdGVdKVxuXG4gICAgICBpZiAoc3RhdGUgPT0gJ2xvYWRpbmdUZXh0Jykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcbiAgICAgICAgJGVsLmFkZENsYXNzKGQpLmF0dHIoZCwgZCkucHJvcChkLCB0cnVlKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhkKS5yZW1vdmVBdHRyKGQpLnByb3AoZCwgZmFsc2UpXG4gICAgICB9XG4gICAgfSwgdGhpcyksIDApXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hhbmdlZCA9IHRydWVcbiAgICB2YXIgJHBhcmVudCA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScpXG5cbiAgICBpZiAoJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgIHZhciAkaW5wdXQgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdyYWRpbycpIHtcbiAgICAgICAgaWYgKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICAkcGFyZW50LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIH0gZWxzZSBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgIGlmICgoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgIT09IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICAgIH1cbiAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICBpZiAoY2hhbmdlZCkgJGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1wcmVzc2VkJywgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICB9XG4gIH1cblxuXG4gIC8vIEJVVFRPTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYnV0dG9uJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5idXR0b24nLCAoZGF0YSA9IG5ldyBCdXR0b24odGhpcywgb3B0aW9ucykpKVxuXG4gICAgICBpZiAob3B0aW9uID09ICd0b2dnbGUnKSBkYXRhLnRvZ2dsZSgpXG4gICAgICBlbHNlIGlmIChvcHRpb24pIGRhdGEuc2V0U3RhdGUob3B0aW9uKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5idXR0b25cblxuICAkLmZuLmJ1dHRvbiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmJ1dHRvbi5Db25zdHJ1Y3RvciA9IEJ1dHRvblxuXG5cbiAgLy8gQlVUVE9OIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYnV0dG9uLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5idXR0b24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBCVVRUT04gREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciAkYnRuID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpXG4gICAgICBQbHVnaW4uY2FsbCgkYnRuLCAndG9nZ2xlJylcbiAgICAgIGlmICghKCQoZS50YXJnZXQpLmlzKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0sIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSkge1xuICAgICAgICAvLyBQcmV2ZW50IGRvdWJsZSBjbGljayBvbiByYWRpb3MsIGFuZCB0aGUgZG91YmxlIHNlbGVjdGlvbnMgKHNvIGNhbmNlbGxhdGlvbikgb24gY2hlY2tib3hlc1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgLy8gVGhlIHRhcmdldCBjb21wb25lbnQgc3RpbGwgcmVjZWl2ZSB0aGUgZm9jdXNcbiAgICAgICAgaWYgKCRidG4uaXMoJ2lucHV0LGJ1dHRvbicpKSAkYnRuLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgZWxzZSAkYnRuLmZpbmQoJ2lucHV0OnZpc2libGUsYnV0dG9uOnZpc2libGUnKS5maXJzdCgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH1cbiAgICB9KVxuICAgIC5vbignZm9jdXMuYnMuYnV0dG9uLmRhdGEtYXBpIGJsdXIuYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpLnRvZ2dsZUNsYXNzKCdmb2N1cycsIC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSlcbiAgICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBjYXJvdXNlbC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjYXJvdXNlbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENBUk9VU0VMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRpbmRpY2F0b3JzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuY2Fyb3VzZWwtaW5kaWNhdG9ycycpXG4gICAgdGhpcy5vcHRpb25zICAgICA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdXNlZCAgICAgID0gbnVsbFxuICAgIHRoaXMuc2xpZGluZyAgICAgPSBudWxsXG4gICAgdGhpcy5pbnRlcnZhbCAgICA9IG51bGxcbiAgICB0aGlzLiRhY3RpdmUgICAgID0gbnVsbFxuICAgIHRoaXMuJGl0ZW1zICAgICAgPSBudWxsXG5cbiAgICB0aGlzLm9wdGlvbnMua2V5Ym9hcmQgJiYgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSlcblxuICAgIHRoaXMub3B0aW9ucy5wYXVzZSA9PSAnaG92ZXInICYmICEoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSAmJiB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ21vdXNlZW50ZXIuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMucGF1c2UsIHRoaXMpKVxuICAgICAgLm9uKCdtb3VzZWxlYXZlLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcbiAgfVxuXG4gIENhcm91c2VsLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04gPSA2MDBcblxuICBDYXJvdXNlbC5ERUZBVUxUUyA9IHtcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBwYXVzZTogJ2hvdmVyJyxcbiAgICB3cmFwOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgY2FzZSAzNzogdGhpcy5wcmV2KCk7IGJyZWFrXG4gICAgICBjYXNlIDM5OiB0aGlzLm5leHQoKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVyblxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmN5Y2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IGZhbHNlKVxuXG4gICAgdGhpcy5pbnRlcnZhbCAmJiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWxcbiAgICAgICYmICF0aGlzLnBhdXNlZFxuICAgICAgJiYgKHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgkLnByb3h5KHRoaXMubmV4dCwgdGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdGhpcy4kaXRlbXMgPSBpdGVtLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbScpXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmluZGV4KGl0ZW0gfHwgdGhpcy4kYWN0aXZlKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhY3RpdmUpIHtcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChhY3RpdmUpXG4gICAgdmFyIHdpbGxXcmFwID0gKGRpcmVjdGlvbiA9PSAncHJldicgJiYgYWN0aXZlSW5kZXggPT09IDApXG4gICAgICAgICAgICAgICAgfHwgKGRpcmVjdGlvbiA9PSAnbmV4dCcgJiYgYWN0aXZlSW5kZXggPT0gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpKVxuICAgIGlmICh3aWxsV3JhcCAmJiAhdGhpcy5vcHRpb25zLndyYXApIHJldHVybiBhY3RpdmVcbiAgICB2YXIgZGVsdGEgPSBkaXJlY3Rpb24gPT0gJ3ByZXYnID8gLTEgOiAxXG4gICAgdmFyIGl0ZW1JbmRleCA9IChhY3RpdmVJbmRleCArIGRlbHRhKSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5lcShpdGVtSW5kZXgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgdmFyIHRoYXQgICAgICAgID0gdGhpc1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJykpXG5cbiAgICBpZiAocG9zID4gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpIHx8IHBvcyA8IDApIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2xpZGluZykgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQub25lKCdzbGlkLmJzLmNhcm91c2VsJywgZnVuY3Rpb24gKCkgeyB0aGF0LnRvKHBvcykgfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmIChhY3RpdmVJbmRleCA9PSBwb3MpIHJldHVybiB0aGlzLnBhdXNlKCkuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUocG9zID4gYWN0aXZlSW5kZXggPyAnbmV4dCcgOiAncHJldicsIHRoaXMuJGl0ZW1zLmVxKHBvcykpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gdHJ1ZSlcblxuICAgIGlmICh0aGlzLiRlbGVtZW50LmZpbmQoJy5uZXh0LCAucHJldicpLmxlbmd0aCAmJiAkLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZClcbiAgICAgIHRoaXMuY3ljbGUodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmludGVydmFsID0gY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCduZXh0JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5zbGlkZSA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XG4gICAgdmFyICRhY3RpdmUgICA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJylcbiAgICB2YXIgJG5leHQgICAgID0gbmV4dCB8fCB0aGlzLmdldEl0ZW1Gb3JEaXJlY3Rpb24odHlwZSwgJGFjdGl2ZSlcbiAgICB2YXIgaXNDeWNsaW5nID0gdGhpcy5pbnRlcnZhbFxuICAgIHZhciBkaXJlY3Rpb24gPSB0eXBlID09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB2YXIgdGhhdCAgICAgID0gdGhpc1xuXG4gICAgaWYgKCRuZXh0Lmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuICh0aGlzLnNsaWRpbmcgPSBmYWxzZSlcblxuICAgIHZhciByZWxhdGVkVGFyZ2V0ID0gJG5leHRbMF1cbiAgICB2YXIgc2xpZGVFdmVudCA9ICQuRXZlbnQoJ3NsaWRlLmJzLmNhcm91c2VsJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCxcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgfSlcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZGVFdmVudClcbiAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLnNsaWRpbmcgPSB0cnVlXG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5wYXVzZSgpXG5cbiAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJGluZGljYXRvcnMuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgdmFyICRuZXh0SW5kaWNhdG9yID0gJCh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgoJG5leHQpXSlcbiAgICAgICRuZXh0SW5kaWNhdG9yICYmICRuZXh0SW5kaWNhdG9yLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KCdzbGlkLmJzLmNhcm91c2VsJywgeyByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKCQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3NsaWRlJykpIHtcbiAgICAgICRuZXh0LmFkZENsYXNzKHR5cGUpXG4gICAgICBpZiAodHlwZW9mICRuZXh0ID09PSAnb2JqZWN0JyAmJiAkbmV4dC5sZW5ndGgpIHtcbiAgICAgICAgJG5leHRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG4gICAgICAkYWN0aXZlLmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICRuZXh0LmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRuZXh0LnJlbW92ZUNsYXNzKFt0eXBlLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcyhbJ2FjdGl2ZScsIGRpcmVjdGlvbl0uam9pbignICcpKVxuICAgICAgICAgIHRoYXQuc2xpZGluZyA9IGZhbHNlXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgICAgICAgIH0sIDApXG4gICAgICAgIH0pXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgIH0gZWxzZSB7XG4gICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB0aGlzLnNsaWRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcbiAgICB9XG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDQVJPVVNFTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jYXJvdXNlbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDYXJvdXNlbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcbiAgICAgIHZhciBhY3Rpb24gID0gdHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyA/IG9wdGlvbiA6IG9wdGlvbnMuc2xpZGVcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jYXJvdXNlbCcsIChkYXRhID0gbmV3IENhcm91c2VsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdudW1iZXInKSBkYXRhLnRvKG9wdGlvbilcbiAgICAgIGVsc2UgaWYgKGFjdGlvbikgZGF0YVthY3Rpb25dKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuaW50ZXJ2YWwpIGRhdGEucGF1c2UoKS5jeWNsZSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmNhcm91c2VsXG5cbiAgJC5mbi5jYXJvdXNlbCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmNhcm91c2VsLkNvbnN0cnVjdG9yID0gQ2Fyb3VzZWxcblxuXG4gIC8vIENBUk9VU0VMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5jYXJvdXNlbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY2Fyb3VzZWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDQVJPVVNFTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgIHZhciBocmVmICAgID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgaWYgKGhyZWYpIHtcbiAgICAgIGhyZWYgPSBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgdmFyIHRhcmdldCAgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IGhyZWZcbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuXG4gICAgaWYgKCEkdGFyZ2V0Lmhhc0NsYXNzKCdjYXJvdXNlbCcpKSByZXR1cm5cblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG4gICAgdmFyIHNsaWRlSW5kZXggPSAkdGhpcy5hdHRyKCdkYXRhLXNsaWRlLXRvJylcbiAgICBpZiAoc2xpZGVJbmRleCkgb3B0aW9ucy5pbnRlcnZhbCA9IGZhbHNlXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb25zKVxuXG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICR0YXJnZXQuZGF0YSgnYnMuY2Fyb3VzZWwnKS50byhzbGlkZUluZGV4KVxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlLXRvXScsIGNsaWNrSGFuZGxlcilcblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGNhcm91c2VsID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJGNhcm91c2VsLCAkY2Fyb3VzZWwuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNvbGxhcHNlLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2NvbGxhcHNlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBqc2hpbnQgbGF0ZWRlZjogZmFsc2UgKi9cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDT0xMQVBTRSBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDb2xsYXBzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLiR0cmlnZ2VyICAgICAgPSAkKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnICsgZWxlbWVudC5pZCArICdcIl0nKVxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IG51bGxcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucGFyZW50KSB7XG4gICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuJGVsZW1lbnQsIHRoaXMuJHRyaWdnZXIpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy50b2dnbGUpIHRoaXMudG9nZ2xlKClcbiAgfVxuXG4gIENvbGxhcHNlLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzNTBcblxuICBDb2xsYXBzZS5ERUZBVUxUUyA9IHtcbiAgICB0b2dnbGU6IHRydWVcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5kaW1lbnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc1dpZHRoID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnd2lkdGgnKVxuICAgIHJldHVybiBoYXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0J1xuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBhY3RpdmVzRGF0YVxuICAgIHZhciBhY3RpdmVzID0gdGhpcy4kcGFyZW50ICYmIHRoaXMuJHBhcmVudC5jaGlsZHJlbignLnBhbmVsJykuY2hpbGRyZW4oJy5pbiwgLmNvbGxhcHNpbmcnKVxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZXNEYXRhID0gYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICBpZiAoYWN0aXZlc0RhdGEgJiYgYWN0aXZlc0RhdGEudHJhbnNpdGlvbmluZykgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgUGx1Z2luLmNhbGwoYWN0aXZlcywgJ2hpZGUnKVxuICAgICAgYWN0aXZlc0RhdGEgfHwgYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScsIG51bGwpXG4gICAgfVxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UnKVxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylbZGltZW5zaW9uXSgwKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlIGluJylbZGltZW5zaW9uXSgnJylcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnRyaWdnZXIoJ3Nob3duLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdmFyIHNjcm9sbFNpemUgPSAkLmNhbWVsQ2FzZShbJ3Njcm9sbCcsIGRpbWVuc2lvbl0uam9pbignLScpKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50WzBdW3Njcm9sbFNpemVdKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKCkpWzBdLm9mZnNldEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgW2RpbWVuc2lvbl0oMClcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXNbdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSA/ICdoaWRlJyA6ICdzaG93J10oKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMucGFyZW50KVxuICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyArIHRoaXMub3B0aW9ucy5wYXJlbnQgKyAnXCJdJylcbiAgICAgIC5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhnZXRUYXJnZXRGcm9tVHJpZ2dlcigkZWxlbWVudCksICRlbGVtZW50KVxuICAgICAgfSwgdGhpcykpXG4gICAgICAuZW5kKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICR0cmlnZ2VyKSB7XG4gICAgdmFyIGlzT3BlbiA9ICRlbGVtZW50Lmhhc0NsYXNzKCdpbicpXG5cbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICAgICR0cmlnZ2VyXG4gICAgICAudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcsICFpc09wZW4pXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRhcmdldEZyb21UcmlnZ2VyKCR0cmlnZ2VyKSB7XG4gICAgdmFyIGhyZWZcbiAgICB2YXIgdGFyZ2V0ID0gJHRyaWdnZXIuYXR0cignZGF0YS10YXJnZXQnKVxuICAgICAgfHwgKGhyZWYgPSAkdHJpZ2dlci5hdHRyKCdocmVmJykpICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSAmJiBvcHRpb25zLnRvZ2dsZSAmJiAvc2hvd3xoaWRlLy50ZXN0KG9wdGlvbikpIG9wdGlvbnMudG9nZ2xlID0gZmFsc2VcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnLCAoZGF0YSA9IG5ldyBDb2xsYXBzZSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY29sbGFwc2VcblxuICAkLmZuLmNvbGxhcHNlICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY29sbGFwc2UuQ29uc3RydWN0b3IgPSBDb2xsYXBzZVxuXG5cbiAgLy8gQ09MTEFQU0UgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jb2xsYXBzZSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmNvbGxhcHNlLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcblxuICAgIGlmICghJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB2YXIgJHRhcmdldCA9IGdldFRhcmdldEZyb21UcmlnZ2VyKCR0aGlzKVxuICAgIHZhciBkYXRhICAgID0gJHRhcmdldC5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgdmFyIG9wdGlvbiAgPSBkYXRhID8gJ3RvZ2dsZScgOiAkdGhpcy5kYXRhKClcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbilcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogZHJvcGRvd24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jZHJvcGRvd25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRFJPUERPV04gQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGJhY2tkcm9wID0gJy5kcm9wZG93bi1iYWNrZHJvcCdcbiAgdmFyIHRvZ2dsZSAgID0gJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJ1xuICB2YXIgRHJvcGRvd24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkub24oJ2NsaWNrLmJzLmRyb3Bkb3duJywgdGhpcy50b2dnbGUpXG4gIH1cblxuICBEcm9wZG93bi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIGZ1bmN0aW9uIGdldFBhcmVudCgkdGhpcykge1xuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIC8jW0EtWmEtel0vLnRlc3Qoc2VsZWN0b3IpICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgdmFyICRwYXJlbnQgPSBzZWxlY3RvciAhPT0gJyMnID8gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcikgOiBudWxsXG5cbiAgICByZXR1cm4gJHBhcmVudCAmJiAkcGFyZW50Lmxlbmd0aCA/ICRwYXJlbnQgOiAkdGhpcy5wYXJlbnQoKVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNZW51cyhlKSB7XG4gICAgaWYgKGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuXG4gICAgJChiYWNrZHJvcCkucmVtb3ZlKClcbiAgICAkKHRvZ2dsZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICAgICAgICA9ICQodGhpcylcbiAgICAgIHZhciAkcGFyZW50ICAgICAgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuXG4gICAgICBpZiAoISRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlICYmIGUudHlwZSA9PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucygkcGFyZW50WzBdLCBlLnRhcmdldCkpIHJldHVyblxuXG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2hpZGUuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcbiAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCQuRXZlbnQoJ2hpZGRlbi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH0pXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgY2xlYXJNZW51cygpXG5cbiAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICEkcGFyZW50LmNsb3Nlc3QoJy5uYXZiYXItbmF2JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIG1vYmlsZSB3ZSB1c2UgYSBiYWNrZHJvcCBiZWNhdXNlIGNsaWNrIGV2ZW50cyBkb24ndCBkZWxlZ2F0ZVxuICAgICAgICAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tYmFja2Ryb3AnKVxuICAgICAgICAgIC5pbnNlcnRBZnRlcigkKHRoaXMpKVxuICAgICAgICAgIC5vbignY2xpY2snLCBjbGVhck1lbnVzKVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ3Nob3cuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpc1xuICAgICAgICAudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcblxuICAgICAgJHBhcmVudFxuICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAudHJpZ2dlcigkLkV2ZW50KCdzaG93bi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghLygzOHw0MHwyN3wzMikvLnRlc3QoZS53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBlLndoaWNoICE9IDI3IHx8IGlzQWN0aXZlICYmIGUud2hpY2ggPT0gMjcpIHtcbiAgICAgIGlmIChlLndoaWNoID09IDI3KSAkcGFyZW50LmZpbmQodG9nZ2xlKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICByZXR1cm4gJHRoaXMudHJpZ2dlcignY2xpY2snKVxuICAgIH1cblxuICAgIHZhciBkZXNjID0gJyBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGEnXG4gICAgdmFyICRpdGVtcyA9ICRwYXJlbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnICsgZGVzYylcblxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICB2YXIgaW5kZXggPSAkaXRlbXMuaW5kZXgoZS50YXJnZXQpXG5cbiAgICBpZiAoZS53aGljaCA9PSAzOCAmJiBpbmRleCA+IDApICAgICAgICAgICAgICAgICBpbmRleC0tICAgICAgICAgLy8gdXBcbiAgICBpZiAoZS53aGljaCA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgLy8gZG93blxuICAgIGlmICghfmluZGV4KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuXG4gICAgJGl0ZW1zLmVxKGluZGV4KS50cmlnZ2VyKCdmb2N1cycpXG4gIH1cblxuXG4gIC8vIERST1BET1dOIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5kcm9wZG93blxuXG4gICQuZm4uZHJvcGRvd24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3RvciA9IERyb3Bkb3duXG5cblxuICAvLyBEUk9QRE9XTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duIGZvcm0nLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24tbWVudScsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBtb2RhbC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNtb2RhbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBNT0RBTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgTW9kYWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLiRib2R5ID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kZGlhbG9nID0gdGhpcy4kZWxlbWVudC5maW5kKCcubW9kYWwtZGlhbG9nJylcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgICB0aGlzLmlzU2hvd24gPSBudWxsXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IDBcbiAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgIHRoaXMuZml4ZWRDb250ZW50ID0gJy5uYXZiYXItZml4ZWQtdG9wLCAubmF2YmFyLWZpeGVkLWJvdHRvbSdcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3RlKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5maW5kKCcubW9kYWwtY29udGVudCcpXG4gICAgICAgIC5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsICQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignbG9hZGVkLmJzLm1vZGFsJylcbiAgICAgICAgfSwgdGhpcykpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwuVkVSU0lPTiA9ICczLjQuMSdcblxuICBNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzAwXG4gIE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBNb2RhbC5ERUZBVUxUUyA9IHtcbiAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICBzaG93OiB0cnVlXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICh0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSB0cnVlXG5cbiAgICB0aGlzLmNoZWNrU2Nyb2xsYmFyKClcbiAgICB0aGlzLnNldFNjcm9sbGJhcigpXG4gICAgdGhpcy4kYm9keS5hZGRDbGFzcygnbW9kYWwtb3BlbicpXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLCAkLnByb3h5KHRoaXMuaGlkZSwgdGhpcykpXG5cbiAgICB0aGlzLiRkaWFsb2cub24oJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vbmUoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGF0LiRlbGVtZW50KSkgdGhhdC5pZ25vcmVCYWNrZHJvcENsaWNrID0gdHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoYXQuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICBpZiAoIXRoYXQuJGVsZW1lbnQucGFyZW50KCkubGVuZ3RoKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnQuYXBwZW5kVG8odGhhdC4kYm9keSkgLy8gZG9uJ3QgbW92ZSBtb2RhbHMgZG9tIHBvc2l0aW9uXG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgLnNob3coKVxuICAgICAgICAuc2Nyb2xsVG9wKDApXG5cbiAgICAgIHRoYXQuYWRqdXN0RGlhbG9nKClcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICB0aGF0LmVuZm9yY2VGb2N1cygpXG5cbiAgICAgIHZhciBlID0gJC5FdmVudCgnc2hvd24uYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICAgIHRyYW5zaXRpb24gP1xuICAgICAgICB0aGF0LiRkaWFsb2cgLy8gd2FpdCBmb3IgbW9kYWwgdG8gc2xpZGUgaW5cbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGUgPSAkLkV2ZW50KCdoaWRlLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKCF0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSBmYWxzZVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgICQoZG9jdW1lbnQpLm9mZignZm9jdXNpbi5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2luJylcbiAgICAgIC5vZmYoJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnKVxuICAgICAgLm9mZignbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGRpYWxvZy5vZmYoJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkodGhpcy5oaWRlTW9kYWwsIHRoaXMpKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgdGhpcy5oaWRlTW9kYWwoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVuZm9yY2VGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KVxuICAgICAgLm9mZignZm9jdXNpbi5icy5tb2RhbCcpIC8vIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxuICAgICAgLm9uKCdmb2N1c2luLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQgIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgdGhpcy4kZWxlbWVudFswXSAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICAhdGhpcy4kZWxlbWVudC5oYXMoZS50YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lc2NhcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMua2V5Ym9hcmQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS53aGljaCA9PSAyNyAmJiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24pIHtcbiAgICAgICQod2luZG93KS5vbigncmVzaXplLmJzLm1vZGFsJywgJC5wcm94eSh0aGlzLmhhbmRsZVVwZGF0ZSwgdGhpcykpXG4gICAgfSBlbHNlIHtcbiAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZS5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB0aGlzLiRlbGVtZW50LmhpZGUoKVxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kYm9keS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpXG4gICAgICB0aGF0LnJlc2V0QWRqdXN0bWVudHMoKVxuICAgICAgdGhhdC5yZXNldFNjcm9sbGJhcigpXG4gICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2hpZGRlbi5icy5tb2RhbCcpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRiYWNrZHJvcCAmJiB0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmJhY2tkcm9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGFuaW1hdGUgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgPyAnZmFkZScgOiAnJ1xuXG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMuYmFja2Ryb3ApIHtcbiAgICAgIHZhciBkb0FuaW1hdGUgPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiBhbmltYXRlXG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgLmFkZENsYXNzKCdtb2RhbC1iYWNrZHJvcCAnICsgYW5pbWF0ZSlcbiAgICAgICAgLmFwcGVuZFRvKHRoaXMuJGJvZHkpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2spIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm5cbiAgICAgICAgdGhpcy5vcHRpb25zLmJhY2tkcm9wID09ICdzdGF0aWMnXG4gICAgICAgICAgPyB0aGlzLiRlbGVtZW50WzBdLmZvY3VzKClcbiAgICAgICAgICA6IHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcblxuICAgICAgaWYgKGRvQW5pbWF0ZSkgdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wLmFkZENsYXNzKCdpbicpXG5cbiAgICAgIGlmICghY2FsbGJhY2spIHJldHVyblxuXG4gICAgICBkb0FuaW1hdGUgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrKClcblxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93biAmJiB0aGlzLiRiYWNrZHJvcCkge1xuICAgICAgdGhpcy4kYmFja2Ryb3AucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICAgdmFyIGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnJlbW92ZUJhY2tkcm9wKClcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfVxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFja1JlbW92ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFja1JlbW92ZSgpXG5cbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgLy8gdGhlc2UgZm9sbG93aW5nIG1ldGhvZHMgYXJlIHVzZWQgdG8gaGFuZGxlIG92ZXJmbG93aW5nIG1vZGFsc1xuXG4gIE1vZGFsLnByb3RvdHlwZS5oYW5kbGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGp1c3REaWFsb2coKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmFkanVzdERpYWxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kYWxJc092ZXJmbG93aW5nID0gdGhpcy4kZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogIXRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiB0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmICFtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuY2hlY2tTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZ1bGxXaW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgaWYgKCFmdWxsV2luZG93V2lkdGgpIHsgLy8gd29ya2Fyb3VuZCBmb3IgbWlzc2luZyB3aW5kb3cuaW5uZXJXaWR0aCBpbiBJRThcbiAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBmdWxsV2luZG93V2lkdGggPSBkb2N1bWVudEVsZW1lbnRSZWN0LnJpZ2h0IC0gTWF0aC5hYnMoZG9jdW1lbnRFbGVtZW50UmVjdC5sZWZ0KVxuICAgIH1cbiAgICB0aGlzLmJvZHlJc092ZXJmbG93aW5nID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaW5kb3dXaWR0aFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLm1lYXN1cmVTY3JvbGxiYXIoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm9keVBhZCA9IHBhcnNlSW50KCh0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcpIHx8IDApLCAxMClcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0IHx8ICcnXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gdGhpcy5zY3JvbGxiYXJXaWR0aFxuICAgIGlmICh0aGlzLmJvZHlJc092ZXJmbG93aW5nKSB7XG4gICAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIGJvZHlQYWQgKyBzY3JvbGxiYXJXaWR0aClcbiAgICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhY3R1YWxQYWRkaW5nID0gZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHRcbiAgICAgICAgdmFyIGNhbGN1bGF0ZWRQYWRkaW5nID0gJChlbGVtZW50KS5jc3MoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgLmRhdGEoJ3BhZGRpbmctcmlnaHQnLCBhY3R1YWxQYWRkaW5nKVxuICAgICAgICAgIC5jc3MoJ3BhZGRpbmctcmlnaHQnLCBwYXJzZUZsb2F0KGNhbGN1bGF0ZWRQYWRkaW5nKSArIHNjcm9sbGJhcldpZHRoICsgJ3B4JylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgdGhpcy5vcmlnaW5hbEJvZHlQYWQpXG4gICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgIHZhciBwYWRkaW5nID0gJChlbGVtZW50KS5kYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlRGF0YSgncGFkZGluZy1yaWdodCcpXG4gICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHBhZGRpbmcgPyBwYWRkaW5nIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7IC8vIHRoeCB3YWxzaFxuICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSAnbW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmUnXG4gICAgdGhpcy4kYm9keS5hcHBlbmQoc2Nyb2xsRGl2KVxuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aFxuICAgIHRoaXMuJGJvZHlbMF0ucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KVxuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aFxuICB9XG5cblxuICAvLyBNT0RBTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24sIF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2JzLm1vZGFsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIE1vZGFsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLm1vZGFsJywgKGRhdGEgPSBuZXcgTW9kYWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXShfcmVsYXRlZFRhcmdldClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuc2hvdykgZGF0YS5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5tb2RhbFxuXG4gICQuZm4ubW9kYWwgPSBQbHVnaW5cbiAgJC5mbi5tb2RhbC5Db25zdHJ1Y3RvciA9IE1vZGFsXG5cblxuICAvLyBNT0RBTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ubW9kYWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLm1vZGFsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gTU9EQUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMubW9kYWwuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICB2YXIgaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIHZhciB0YXJnZXQgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8XG4gICAgICAoaHJlZiAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSkgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcbiAgICB2YXIgb3B0aW9uID0gJHRhcmdldC5kYXRhKCdicy5tb2RhbCcpID8gJ3RvZ2dsZScgOiAkLmV4dGVuZCh7IHJlbW90ZTogIS8jLy50ZXN0KGhyZWYpICYmIGhyZWYgfSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcblxuICAgIGlmICgkdGhpcy5pcygnYScpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICR0YXJnZXQub25lKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKHNob3dFdmVudCkge1xuICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuIC8vIG9ubHkgcmVnaXN0ZXIgZm9jdXMgcmVzdG9yZXIgaWYgbW9kYWwgd2lsbCBhY3R1YWxseSBnZXQgc2hvd25cbiAgICAgICR0YXJnZXQub25lKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aGlzLmlzKCc6dmlzaWJsZScpICYmICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH0pXG4gICAgfSlcbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24sIHRoaXMpXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRvb2x0aXAuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdG9vbHRpcFxuICogSW5zcGlyZWQgYnkgdGhlIG9yaWdpbmFsIGpRdWVyeS50aXBzeSBieSBKYXNvbiBGcmFtZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgRElTQUxMT1dFRF9BVFRSSUJVVEVTID0gWydzYW5pdGl6ZScsICd3aGl0ZUxpc3QnLCAnc2FuaXRpemVGbiddXG5cbiAgdmFyIHVyaUF0dHJzID0gW1xuICAgICdiYWNrZ3JvdW5kJyxcbiAgICAnY2l0ZScsXG4gICAgJ2hyZWYnLFxuICAgICdpdGVtdHlwZScsXG4gICAgJ2xvbmdkZXNjJyxcbiAgICAncG9zdGVyJyxcbiAgICAnc3JjJyxcbiAgICAneGxpbms6aHJlZidcbiAgXVxuXG4gIHZhciBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2lcblxuICB2YXIgRGVmYXVsdFdoaXRlbGlzdCA9IHtcbiAgICAvLyBHbG9iYWwgYXR0cmlidXRlcyBhbGxvd2VkIG9uIGFueSBzdXBwbGllZCBlbGVtZW50IGJlbG93LlxuICAgICcqJzogWydjbGFzcycsICdkaXInLCAnaWQnLCAnbGFuZycsICdyb2xlJywgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTl0sXG4gICAgYTogWyd0YXJnZXQnLCAnaHJlZicsICd0aXRsZScsICdyZWwnXSxcbiAgICBhcmVhOiBbXSxcbiAgICBiOiBbXSxcbiAgICBicjogW10sXG4gICAgY29sOiBbXSxcbiAgICBjb2RlOiBbXSxcbiAgICBkaXY6IFtdLFxuICAgIGVtOiBbXSxcbiAgICBocjogW10sXG4gICAgaDE6IFtdLFxuICAgIGgyOiBbXSxcbiAgICBoMzogW10sXG4gICAgaDQ6IFtdLFxuICAgIGg1OiBbXSxcbiAgICBoNjogW10sXG4gICAgaTogW10sXG4gICAgaW1nOiBbJ3NyYycsICdhbHQnLCAndGl0bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10sXG4gICAgbGk6IFtdLFxuICAgIG9sOiBbXSxcbiAgICBwOiBbXSxcbiAgICBwcmU6IFtdLFxuICAgIHM6IFtdLFxuICAgIHNtYWxsOiBbXSxcbiAgICBzcGFuOiBbXSxcbiAgICBzdWI6IFtdLFxuICAgIHN1cDogW10sXG4gICAgc3Ryb25nOiBbXSxcbiAgICB1OiBbXSxcbiAgICB1bDogW11cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHBhdHRlcm4gdGhhdCByZWNvZ25pemVzIGEgY29tbW9ubHkgdXNlZnVsIHN1YnNldCBvZiBVUkxzIHRoYXQgYXJlIHNhZmUuXG4gICAqXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcbiAgICovXG4gIHZhciBTQUZFX1VSTF9QQVRURVJOID0gL14oPzooPzpodHRwcz98bWFpbHRvfGZ0cHx0ZWx8ZmlsZSk6fFteJjovPyNdKig/OlsvPyNdfCQpKS9naVxuXG4gIC8qKlxuICAgKiBBIHBhdHRlcm4gdGhhdCBtYXRjaGVzIHNhZmUgZGF0YSBVUkxzLiBPbmx5IG1hdGNoZXMgaW1hZ2UsIHZpZGVvIGFuZCBhdWRpbyB0eXBlcy5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIERBVEFfVVJMX1BBVFRFUk4gPSAvXmRhdGE6KD86aW1hZ2VcXC8oPzpibXB8Z2lmfGpwZWd8anBnfHBuZ3x0aWZmfHdlYnApfHZpZGVvXFwvKD86bXBlZ3xtcDR8b2dnfHdlYm0pfGF1ZGlvXFwvKD86bXAzfG9nYXxvZ2d8b3B1cykpO2Jhc2U2NCxbYS16MC05Ky9dKz0qJC9pXG5cbiAgZnVuY3Rpb24gYWxsb3dlZEF0dHJpYnV0ZShhdHRyLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkge1xuICAgIHZhciBhdHRyTmFtZSA9IGF0dHIubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpICE9PSAtMSkge1xuICAgICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgdXJpQXR0cnMpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbihhdHRyLm5vZGVWYWx1ZS5tYXRjaChTQUZFX1VSTF9QQVRURVJOKSB8fCBhdHRyLm5vZGVWYWx1ZS5tYXRjaChEQVRBX1VSTF9QQVRURVJOKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICB2YXIgcmVnRXhwID0gJChhbGxvd2VkQXR0cmlidXRlTGlzdCkuZmlsdGVyKGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgIH0pXG5cbiAgICAvLyBDaGVjayBpZiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB2YWxpZGF0ZXMgdGhlIGF0dHJpYnV0ZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZ0V4cC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhdHRyTmFtZS5tYXRjaChyZWdFeHBbaV0pKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgd2hpdGVMaXN0LCBzYW5pdGl6ZUZuKSB7XG4gICAgaWYgKHVuc2FmZUh0bWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5zYWZlSHRtbFxuICAgIH1cblxuICAgIGlmIChzYW5pdGl6ZUZuICYmIHR5cGVvZiBzYW5pdGl6ZUZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gc2FuaXRpemVGbih1bnNhZmVIdG1sKVxuICAgIH1cblxuICAgIC8vIElFIDggYW5kIGJlbG93IGRvbid0IHN1cHBvcnQgY3JlYXRlSFRNTERvY3VtZW50XG4gICAgaWYgKCFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbiB8fCAhZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gdW5zYWZlSHRtbFxuICAgIH1cblxuICAgIHZhciBjcmVhdGVkRG9jdW1lbnQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ3Nhbml0aXphdGlvbicpXG4gICAgY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gdW5zYWZlSHRtbFxuXG4gICAgdmFyIHdoaXRlbGlzdEtleXMgPSAkLm1hcCh3aGl0ZUxpc3QsIGZ1bmN0aW9uIChlbCwgaSkgeyByZXR1cm4gaSB9KVxuICAgIHZhciBlbGVtZW50cyA9ICQoY3JlYXRlZERvY3VtZW50LmJvZHkpLmZpbmQoJyonKVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXVxuICAgICAgdmFyIGVsTmFtZSA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgaWYgKCQuaW5BcnJheShlbE5hbWUsIHdoaXRlbGlzdEtleXMpID09PSAtMSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHZhciBhdHRyaWJ1dGVMaXN0ID0gJC5tYXAoZWwuYXR0cmlidXRlcywgZnVuY3Rpb24gKGVsKSB7IHJldHVybiBlbCB9KVxuICAgICAgdmFyIHdoaXRlbGlzdGVkQXR0cmlidXRlcyA9IFtdLmNvbmNhdCh3aGl0ZUxpc3RbJyonXSB8fCBbXSwgd2hpdGVMaXN0W2VsTmFtZV0gfHwgW10pXG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBsZW4yID0gYXR0cmlidXRlTGlzdC5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgaWYgKCFhbGxvd2VkQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0sIHdoaXRlbGlzdGVkQXR0cmlidXRlcykpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXS5ub2RlTmFtZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUxcbiAgfVxuXG4gIC8vIFRPT0xUSVAgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUb29sdGlwID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnR5cGUgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxuICAgIHRoaXMuZW5hYmxlZCAgICA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgICAgPSBudWxsXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuICAgIHRoaXMuJGVsZW1lbnQgICA9IG51bGxcbiAgICB0aGlzLmluU3RhdGUgICAgPSBudWxsXG5cbiAgICB0aGlzLmluaXQoJ3Rvb2x0aXAnLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgVG9vbHRpcC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUb29sdGlwLkRFRkFVTFRTID0ge1xuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBkZWxheTogMCxcbiAgICBodG1sOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGZhbHNlLFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgcGFkZGluZzogMFxuICAgIH0sXG4gICAgc2FuaXRpemUgOiB0cnVlLFxuICAgIHNhbml0aXplRm4gOiBudWxsLFxuICAgIHdoaXRlTGlzdCA6IERlZmF1bHRXaGl0ZWxpc3RcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5hYmxlZCAgID0gdHJ1ZVxuICAgIHRoaXMudHlwZSAgICAgID0gdHlwZVxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgdGhpcy4kdmlld3BvcnQgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgJChkb2N1bWVudCkuZmluZCgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KSA/IHRoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsIHRoaXMuJGVsZW1lbnQpIDogKHRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMudmlld3BvcnQpKVxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3IgJiYgIXRoaXMub3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxuICAgIH1cblxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcblxuICAgIGZvciAodmFyIGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cblxuICAgICAgaWYgKHRyaWdnZXIgPT0gJ2NsaWNrJykge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgIHZhciBldmVudEluICA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1c2luJ1xuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMuZW50ZXIsIHRoaXMpKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9yID9cbiAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICB0aGlzLmZpeFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBUb29sdGlwLkRFRkFVTFRTXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YUF0dHJpYnV0ZXMgPSB0aGlzLiRlbGVtZW50LmRhdGEoKVxuXG4gICAgZm9yICh2YXIgZGF0YUF0dHIgaW4gZGF0YUF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmIChkYXRhQXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShkYXRhQXR0cikgJiYgJC5pbkFycmF5KGRhdGFBdHRyLCBESVNBTExPV0VEX0FUVFJJQlVURVMpICE9PSAtMSkge1xuICAgICAgICBkZWxldGUgZGF0YUF0dHJpYnV0ZXNbZGF0YUF0dHJdXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmdldERlZmF1bHRzKCksIGRhdGFBdHRyaWJ1dGVzLCBvcHRpb25zKVxuXG4gICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgdHlwZW9mIG9wdGlvbnMuZGVsYXkgPT0gJ251bWJlcicpIHtcbiAgICAgIG9wdGlvbnMuZGVsYXkgPSB7XG4gICAgICAgIHNob3c6IG9wdGlvbnMuZGVsYXksXG4gICAgICAgIGhpZGU6IG9wdGlvbnMuZGVsYXlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9IHNhbml0aXplSHRtbChvcHRpb25zLnRlbXBsYXRlLCBvcHRpb25zLndoaXRlTGlzdCwgb3B0aW9ucy5zYW5pdGl6ZUZuKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgID0ge31cbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKClcblxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVudGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3VzaW4nID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpIHx8IHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSB7XG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSBzZWxmLnNob3coKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5pblN0YXRlW2tleV0pIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ291dCdcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKHRoaXMuaGFzQ29udGVudCgpICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIHZhciBpbkRvbSA9ICQuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy4kZWxlbWVudFswXSlcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpbkRvbSkgcmV0dXJuXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG5cbiAgICAgIHZhciB0aXBJZCA9IHRoaXMuZ2V0VUlEKHRoaXMudHlwZSlcblxuICAgICAgdGhpcy5zZXRDb250ZW50KClcbiAgICAgICR0aXAuYXR0cignaWQnLCB0aXBJZClcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpcElkKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgJHRpcC5hZGRDbGFzcygnZmFkZScpXG5cbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsICR0aXBbMF0sIHRoaXMuJGVsZW1lbnRbMF0pIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICB2YXIgYXV0b1Rva2VuID0gL1xccz9hdXRvP1xccz8vaVxuICAgICAgdmFyIGF1dG9QbGFjZSA9IGF1dG9Ub2tlbi50ZXN0KHBsYWNlbWVudClcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXG5cbiAgICAgICR0aXBcbiAgICAgICAgLmRldGFjaCgpXG4gICAgICAgIC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAsIGRpc3BsYXk6ICdibG9jaycgfSlcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPyAkdGlwLmFwcGVuZFRvKCQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLmNvbnRhaW5lcikpIDogJHRpcC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgICB2YXIgcG9zICAgICAgICAgID0gdGhpcy5nZXRQb3NpdGlvbigpXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgdmFyIG9yZ1BsYWNlbWVudCA9IHBsYWNlbWVudFxuICAgICAgICB2YXIgdmlld3BvcnREaW0gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgJiYgcG9zLnRvcCAgICAtIGFjdHVhbEhlaWdodCA8IHZpZXdwb3J0RGltLnRvcCAgICA/ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICAmJiBwb3MubGVmdCAgIC0gYWN0dWFsV2lkdGggIDwgdmlld3BvcnREaW0ubGVmdCAgID8gJ3JpZ2h0JyAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRcblxuICAgICAgICAkdGlwXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXG5cbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gdGhhdC5ob3ZlclN0YXRlXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgICAgdGhhdC5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxuICAgICAgfVxuXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgICR0aXBcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQsIHBsYWNlbWVudCkge1xuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIC8vIG1hbnVhbGx5IHJlYWQgbWFyZ2lucyBiZWNhdXNlIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBkaWZmZXJlbmNlXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tdG9wJyksIDEwKVxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxuXG4gICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgTmFOIGZvciBpZSA4LzlcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXG4gICAgaWYgKGlzTmFOKG1hcmdpbkxlZnQpKSBtYXJnaW5MZWZ0ID0gMFxuXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXG4gICAgb2Zmc2V0LmxlZnQgKz0gbWFyZ2luTGVmdFxuXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcbiAgICAvLyBzbyB3ZSB1c2Ugc2V0T2Zmc2V0IGRpcmVjdGx5IHdpdGggb3VyIG93biBmdW5jdGlvbiBCLTBcbiAgICAkLm9mZnNldC5zZXRPZmZzZXQoJHRpcFswXSwgJC5leHRlbmQoe1xuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAkdGlwLmNzcyh7XG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHByb3BzLnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIG9mZnNldCksIDApXG5cbiAgICAkdGlwLmFkZENsYXNzKCdpbicpXG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgcGxhY2luZyB0aXAgaW4gbmV3IG9mZnNldCBjYXVzZWQgdGhlIHRpcCB0byByZXNpemUgaXRzZWxmXG4gICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChwbGFjZW1lbnQgPT0gJ3RvcCcgJiYgYWN0dWFsSGVpZ2h0ICE9IGhlaWdodCkge1xuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgIGlmIChkZWx0YS5sZWZ0KSBvZmZzZXQubGVmdCArPSBkZWx0YS5sZWZ0XG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxuXG4gICAgdmFyIGlzVmVydGljYWwgICAgICAgICAgPSAvdG9wfGJvdHRvbS8udGVzdChwbGFjZW1lbnQpXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxuICAgIHZhciBhcnJvd09mZnNldFBvc2l0aW9uID0gaXNWZXJ0aWNhbCA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J1xuXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIHRoaXMucmVwbGFjZUFycm93KGFycm93RGVsdGEsICR0aXBbMF1bYXJyb3dPZmZzZXRQb3NpdGlvbl0sIGlzVmVydGljYWwpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5yZXBsYWNlQXJyb3cgPSBmdW5jdGlvbiAoZGVsdGEsIGRpbWVuc2lvbiwgaXNWZXJ0aWNhbCkge1xuICAgIHRoaXMuYXJyb3coKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JywgJycpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaHRtbCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICB0aXRsZSA9IHNhbml0aXplSHRtbCh0aXRsZSwgdGhpcy5vcHRpb25zLndoaXRlTGlzdCwgdGhpcy5vcHRpb25zLnNhbml0aXplRm4pXG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS5odG1sKHRpdGxlKVxuICAgIH0gZWxzZSB7XG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykudGV4dCh0aXRsZSlcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIGluIHRvcCBib3R0b20gbGVmdCByaWdodCcpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyICR0aXAgPSAkKHRoaXMuJHRpcClcbiAgICB2YXIgZSAgICA9ICQuRXZlbnQoJ2hpZGUuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgaWYgKHRoYXQuaG92ZXJTdGF0ZSAhPSAnaW4nKSAkdGlwLmRldGFjaCgpXG4gICAgICBpZiAodGhhdC4kZWxlbWVudCkgeyAvLyBUT0RPOiBDaGVjayB3aGV0aGVyIGd1YXJkaW5nIHRoaXMgY29kZSB3aXRoIHRoaXMgYGlmYCBpcyByZWFsbHkgbmVjZXNzYXJ5LlxuICAgICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknKVxuICAgICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkdGlwXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBjb21wbGV0ZSgpXG5cbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZml4VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIGlmICgkZS5hdHRyKCd0aXRsZScpIHx8IHR5cGVvZiAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykgIT0gJ3N0cmluZycpIHtcbiAgICAgICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAkZS5hdHRyKCd0aXRsZScpIHx8ICcnKS5hdHRyKCd0aXRsZScsICcnKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAkZWxlbWVudCAgID0gJGVsZW1lbnQgfHwgdGhpcy4kZWxlbWVudFxuXG4gICAgdmFyIGVsICAgICA9ICRlbGVtZW50WzBdXG4gICAgdmFyIGlzQm9keSA9IGVsLnRhZ05hbWUgPT0gJ0JPRFknXG5cbiAgICB2YXIgZWxSZWN0ICAgID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoZWxSZWN0LndpZHRoID09IG51bGwpIHtcbiAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgYXJlIG1pc3NpbmcgaW4gSUU4LCBzbyBjb21wdXRlIHRoZW0gbWFudWFsbHk7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0MDkzXG4gICAgICBlbFJlY3QgPSAkLmV4dGVuZCh7fSwgZWxSZWN0LCB7IHdpZHRoOiBlbFJlY3QucmlnaHQgLSBlbFJlY3QubGVmdCwgaGVpZ2h0OiBlbFJlY3QuYm90dG9tIC0gZWxSZWN0LnRvcCB9KVxuICAgIH1cbiAgICB2YXIgaXNTdmcgPSB3aW5kb3cuU1ZHRWxlbWVudCAmJiBlbCBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50XG4gICAgLy8gQXZvaWQgdXNpbmcgJC5vZmZzZXQoKSBvbiBTVkdzIHNpbmNlIGl0IGdpdmVzIGluY29ycmVjdCByZXN1bHRzIGluIGpRdWVyeSAzLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzIwMjgwXG4gICAgdmFyIGVsT2Zmc2V0ICA9IGlzQm9keSA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAoaXNTdmcgPyBudWxsIDogJGVsZW1lbnQub2Zmc2V0KCkpXG4gICAgdmFyIHNjcm9sbCAgICA9IHsgc2Nyb2xsOiBpc0JvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogJGVsZW1lbnQuc2Nyb2xsVG9wKCkgfVxuICAgIHZhciBvdXRlckRpbXMgPSBpc0JvZHkgPyB7IHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkgfSA6IG51bGxcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZWxSZWN0LCBzY3JvbGwsIG91dGVyRGltcywgZWxPZmZzZXQpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0ID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudCA9PSAnYm90dG9tJyA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCwgICBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICA/IHsgdG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIGFjdHVhbFdpZHRoIH0gOlxuICAgICAgICAvKiBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAqLyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggfVxuXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICB2YXIgZGVsdGEgPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gICAgaWYgKCF0aGlzLiR2aWV3cG9ydCkgcmV0dXJuIGRlbHRhXG5cbiAgICB2YXIgdmlld3BvcnRQYWRkaW5nID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmIHRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nIHx8IDBcbiAgICB2YXIgdmlld3BvcnREaW1lbnNpb25zID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgIGlmICgvcmlnaHR8bGVmdC8udGVzdChwbGFjZW1lbnQpKSB7XG4gICAgICB2YXIgdG9wRWRnZU9mZnNldCAgICA9IHBvcy50b3AgLSB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsXG4gICAgICB2YXIgYm90dG9tRWRnZU9mZnNldCA9IHBvcy50b3AgKyB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsICsgYWN0dWFsSGVpZ2h0XG4gICAgICBpZiAodG9wRWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy50b3ApIHsgLy8gdG9wIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgLSB0b3BFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCkgeyAvLyBib3R0b20gb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQgLSBib3R0b21FZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZWZ0RWRnZU9mZnNldCAgPSBwb3MubGVmdCAtIHZpZXdwb3J0UGFkZGluZ1xuICAgICAgdmFyIHJpZ2h0RWRnZU9mZnNldCA9IHBvcy5sZWZ0ICsgdmlld3BvcnRQYWRkaW5nICsgYWN0dWFsV2lkdGhcbiAgICAgIGlmIChsZWZ0RWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0KSB7IC8vIGxlZnQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0IC0gbGVmdEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAocmlnaHRFZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnJpZ2h0KSB7IC8vIHJpZ2h0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCArIHZpZXdwb3J0RGltZW5zaW9ucy53aWR0aCAtIHJpZ2h0RWRnZU9mZnNldFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWx0YVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcbiAgICAgIHx8ICh0eXBlb2Ygby50aXRsZSA9PSAnZnVuY3Rpb24nID8gby50aXRsZS5jYWxsKCRlWzBdKSA6ICBvLnRpdGxlKVxuXG4gICAgcmV0dXJuIHRpdGxlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRVSUQgPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgZG8gcHJlZml4ICs9IH5+KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKVxuICAgIHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKVxuICAgIHJldHVybiBwcmVmaXhcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJHRpcCkge1xuICAgICAgdGhpcy4kdGlwID0gJCh0aGlzLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLnR5cGUgKyAnIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHRpcFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLnRvb2x0aXAtYXJyb3cnKSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWRcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcbiAgICAgIGlmICghc2VsZikge1xuICAgICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZSkge1xuICAgICAgc2VsZi5pblN0YXRlLmNsaWNrID0gIXNlbGYuaW5TdGF0ZS5jbGlja1xuICAgICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSBzZWxmLmVudGVyKHNlbGYpXG4gICAgICBlbHNlIHNlbGYubGVhdmUoc2VsZilcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSA/IHNlbGYubGVhdmUoc2VsZikgOiBzZWxmLmVudGVyKHNlbGYpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIHRoaXMuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9mZignLicgKyB0aGF0LnR5cGUpLnJlbW92ZURhdGEoJ2JzLicgKyB0aGF0LnR5cGUpXG4gICAgICBpZiAodGhhdC4kdGlwKSB7XG4gICAgICAgIHRoYXQuJHRpcC5kZXRhY2goKVxuICAgICAgfVxuICAgICAgdGhhdC4kdGlwID0gbnVsbFxuICAgICAgdGhhdC4kYXJyb3cgPSBudWxsXG4gICAgICB0aGF0LiR2aWV3cG9ydCA9IG51bGxcbiAgICAgIHRoYXQuJGVsZW1lbnQgPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNhbml0aXplSHRtbCA9IGZ1bmN0aW9uICh1bnNhZmVIdG1sKSB7XG4gICAgcmV0dXJuIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgfVxuXG4gIC8vIFRPT0xUSVAgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy50b29sdGlwJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnLCAoZGF0YSA9IG5ldyBUb29sdGlwKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50b29sdGlwXG5cbiAgJC5mbi50b29sdGlwICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udG9vbHRpcC5Db25zdHJ1Y3RvciA9IFRvb2x0aXBcblxuXG4gIC8vIFRPT0xUSVAgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4udG9vbHRpcC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udG9vbHRpcCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogcG9wb3Zlci5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNwb3BvdmVyc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFBPUE9WRVIgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBQb3BvdmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmluaXQoJ3BvcG92ZXInLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKCEkLmZuLnRvb2x0aXApIHRocm93IG5ldyBFcnJvcignUG9wb3ZlciByZXF1aXJlcyB0b29sdGlwLmpzJylcblxuICBQb3BvdmVyLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFBvcG92ZXIuREVGQVVMVFMgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLkRFRkFVTFRTLCB7XG4gICAgcGxhY2VtZW50OiAncmlnaHQnLFxuICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgY29udGVudDogJycsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2PidcbiAgfSlcblxuXG4gIC8vIE5PVEU6IFBPUE9WRVIgRVhURU5EUyB0b29sdGlwLmpzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSlcblxuICBQb3BvdmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUG9wb3Zlci5ERUZBVUxUU1xuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgICA9IHRoaXMuZ2V0VGl0bGUoKVxuICAgIHZhciBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KClcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaHRtbCkge1xuICAgICAgdmFyIHR5cGVDb250ZW50ID0gdHlwZW9mIGNvbnRlbnRcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICB0aXRsZSA9IHRoaXMuc2FuaXRpemVIdG1sKHRpdGxlKVxuXG4gICAgICAgIGlmICh0eXBlQ29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5zYW5pdGl6ZUh0bWwoY29udGVudClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCh0aXRsZSlcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbXG4gICAgICAgIHR5cGVDb250ZW50ID09PSAnc3RyaW5nJyA/ICdodG1sJyA6ICdhcHBlbmQnXG4gICAgICBdKGNvbnRlbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS50ZXh0KHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKS50ZXh0KGNvbnRlbnQpXG4gICAgfVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxuXG4gICAgLy8gSUU4IGRvZXNuJ3QgYWNjZXB0IGhpZGluZyB2aWEgdGhlIGA6ZW1wdHlgIHBzZXVkbyBzZWxlY3Rvciwgd2UgaGF2ZSB0byBkb1xuICAgIC8vIHRoaXMgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhlIGNvbnRlbnRzLlxuICAgIGlmICghJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwoKSkgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmhpZGUoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpIHx8IHRoaXMuZ2V0Q29udGVudCgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHJldHVybiAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxuICAgICAgfHwgKHR5cGVvZiBvLmNvbnRlbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIG8uY29udGVudC5jYWxsKCRlWzBdKSA6XG4gICAgICAgIG8uY29udGVudClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy5hcnJvdycpKVxuICB9XG5cblxuICAvLyBQT1BPVkVSIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJywgKGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ucG9wb3ZlclxuXG4gICQuZm4ucG9wb3ZlciAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnBvcG92ZXIuQ29uc3RydWN0b3IgPSBQb3BvdmVyXG5cblxuICAvLyBQT1BPVkVSIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnBvcG92ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnBvcG92ZXIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHNjcm9sbHNweS5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNzY3JvbGxzcHlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBTQ1JPTExTUFkgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFNjcm9sbFNweShlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kYm9keSAgICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRzY3JvbGxFbGVtZW50ID0gJChlbGVtZW50KS5pcyhkb2N1bWVudC5ib2R5KSA/ICQod2luZG93KSA6ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgID0gJC5leHRlbmQoe30sIFNjcm9sbFNweS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLnNlbGVjdG9yICAgICAgID0gKHRoaXMub3B0aW9ucy50YXJnZXQgfHwgJycpICsgJyAubmF2IGxpID4gYSdcbiAgICB0aGlzLm9mZnNldHMgICAgICAgID0gW11cbiAgICB0aGlzLnRhcmdldHMgICAgICAgID0gW11cbiAgICB0aGlzLmFjdGl2ZVRhcmdldCAgID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ICAgPSAwXG5cbiAgICB0aGlzLiRzY3JvbGxFbGVtZW50Lm9uKCdzY3JvbGwuYnMuc2Nyb2xsc3B5JywgJC5wcm94eSh0aGlzLnByb2Nlc3MsIHRoaXMpKVxuICAgIHRoaXMucmVmcmVzaCgpXG4gICAgdGhpcy5wcm9jZXNzKClcbiAgfVxuXG4gIFNjcm9sbFNweS5WRVJTSU9OICA9ICczLjQuMSdcblxuICBTY3JvbGxTcHkuREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAxMFxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5nZXRTY3JvbGxIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0IHx8IE1hdGgubWF4KHRoaXMuJGJvZHlbMF0uc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ICAgICAgICAgID0gdGhpc1xuICAgIHZhciBvZmZzZXRNZXRob2QgID0gJ29mZnNldCdcbiAgICB2YXIgb2Zmc2V0QmFzZSAgICA9IDBcblxuICAgIHRoaXMub2Zmc2V0cyAgICAgID0gW11cbiAgICB0aGlzLnRhcmdldHMgICAgICA9IFtdXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXG5cbiAgICBpZiAoISQuaXNXaW5kb3codGhpcy4kc2Nyb2xsRWxlbWVudFswXSkpIHtcbiAgICAgIG9mZnNldE1ldGhvZCA9ICdwb3NpdGlvbidcbiAgICAgIG9mZnNldEJhc2UgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKClcbiAgICB9XG5cbiAgICB0aGlzLiRib2R5XG4gICAgICAuZmluZCh0aGlzLnNlbGVjdG9yKVxuICAgICAgLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZWwgICA9ICQodGhpcylcbiAgICAgICAgdmFyIGhyZWYgID0gJGVsLmRhdGEoJ3RhcmdldCcpIHx8ICRlbC5hdHRyKCdocmVmJylcbiAgICAgICAgdmFyICRocmVmID0gL14jLi8udGVzdChocmVmKSAmJiAkKGhyZWYpXG5cbiAgICAgICAgcmV0dXJuICgkaHJlZlxuICAgICAgICAgICYmICRocmVmLmxlbmd0aFxuICAgICAgICAgICYmICRocmVmLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgJiYgW1skaHJlZltvZmZzZXRNZXRob2RdKCkudG9wICsgb2Zmc2V0QmFzZSwgaHJlZl1dKSB8fCBudWxsXG4gICAgICB9KVxuICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGFbMF0gLSBiWzBdIH0pXG4gICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQub2Zmc2V0cy5wdXNoKHRoaXNbMF0pXG4gICAgICAgIHRoYXQudGFyZ2V0cy5wdXNoKHRoaXNbMV0pXG4gICAgICB9KVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpICsgdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXG4gICAgdmFyIG1heFNjcm9sbCAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXQgKyBzY3JvbGxIZWlnaHQgLSB0aGlzLiRzY3JvbGxFbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldHMgICAgICA9IHRoaXMub2Zmc2V0c1xuICAgIHZhciB0YXJnZXRzICAgICAgPSB0aGlzLnRhcmdldHNcbiAgICB2YXIgYWN0aXZlVGFyZ2V0ID0gdGhpcy5hY3RpdmVUYXJnZXRcbiAgICB2YXIgaVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsSGVpZ2h0ICE9IHNjcm9sbEhlaWdodCkge1xuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xuICAgICAgcmV0dXJuIGFjdGl2ZVRhcmdldCAhPSAoaSA9IHRhcmdldHNbdGFyZ2V0cy5sZW5ndGggLSAxXSkgJiYgdGhpcy5hY3RpdmF0ZShpKVxuICAgIH1cblxuICAgIGlmIChhY3RpdmVUYXJnZXQgJiYgc2Nyb2xsVG9wIDwgb2Zmc2V0c1swXSkge1xuICAgICAgdGhpcy5hY3RpdmVUYXJnZXQgPSBudWxsXG4gICAgICByZXR1cm4gdGhpcy5jbGVhcigpXG4gICAgfVxuXG4gICAgZm9yIChpID0gb2Zmc2V0cy5sZW5ndGg7IGktLTspIHtcbiAgICAgIGFjdGl2ZVRhcmdldCAhPSB0YXJnZXRzW2ldXG4gICAgICAgICYmIHNjcm9sbFRvcCA+PSBvZmZzZXRzW2ldXG4gICAgICAgICYmIChvZmZzZXRzW2kgKyAxXSA9PT0gdW5kZWZpbmVkIHx8IHNjcm9sbFRvcCA8IG9mZnNldHNbaSArIDFdKVxuICAgICAgICAmJiB0aGlzLmFjdGl2YXRlKHRhcmdldHNbaV0pXG4gICAgfVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IHRhcmdldFxuXG4gICAgdGhpcy5jbGVhcigpXG5cbiAgICB2YXIgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yICtcbiAgICAgICdbZGF0YS10YXJnZXQ9XCInICsgdGFyZ2V0ICsgJ1wiXSwnICtcbiAgICAgIHRoaXMuc2VsZWN0b3IgKyAnW2hyZWY9XCInICsgdGFyZ2V0ICsgJ1wiXSdcblxuICAgIHZhciBhY3RpdmUgPSAkKHNlbGVjdG9yKVxuICAgICAgLnBhcmVudHMoJ2xpJylcbiAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcblxuICAgIGlmIChhY3RpdmUucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgYWN0aXZlID0gYWN0aXZlXG4gICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgICBhY3RpdmUudHJpZ2dlcignYWN0aXZhdGUuYnMuc2Nyb2xsc3B5JylcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnNlbGVjdG9yKVxuICAgICAgLnBhcmVudHNVbnRpbCh0aGlzLm9wdGlvbnMudGFyZ2V0LCAnLmFjdGl2ZScpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gIH1cblxuXG4gIC8vIFNDUk9MTFNQWSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknLCAoZGF0YSA9IG5ldyBTY3JvbGxTcHkodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnNjcm9sbHNweVxuXG4gICQuZm4uc2Nyb2xsc3B5ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uc2Nyb2xsc3B5LkNvbnN0cnVjdG9yID0gU2Nyb2xsU3B5XG5cblxuICAvLyBTQ1JPTExTUFkgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5zY3JvbGxzcHkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnNjcm9sbHNweSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFNDUk9MTFNQWSBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQuYnMuc2Nyb2xsc3B5LmRhdGEtYXBpJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cInNjcm9sbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCAkc3B5LmRhdGEoKSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0YWIuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdGFic1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRBQiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRhYiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgLy8ganNjczpkaXNhYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KVxuICAgIC8vIGpzY3M6ZW5hYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gIH1cblxuICBUYWIuVkVSU0lPTiA9ICczLjQuMSdcblxuICBUYWIuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRhYi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgICAgPSB0aGlzLmVsZW1lbnRcbiAgICB2YXIgJHVsICAgICAgPSAkdGhpcy5jbG9zZXN0KCd1bDpub3QoLmRyb3Bkb3duLW1lbnUpJylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5kYXRhKCd0YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBpZiAoJHRoaXMucGFyZW50KCdsaScpLmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHByZXZpb3VzID0gJHVsLmZpbmQoJy5hY3RpdmU6bGFzdCBhJylcbiAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgIH0pXG4gICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgfSlcblxuICAgICRwcmV2aW91cy50cmlnZ2VyKGhpZGVFdmVudClcbiAgICAkdGhpcy50cmlnZ2VyKHNob3dFdmVudClcblxuICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIHRoaXMuYWN0aXZhdGUoJHRoaXMuY2xvc2VzdCgnbGknKSwgJHVsKVxuICAgIHRoaXMuYWN0aXZhdGUoJHRhcmdldCwgJHRhcmdldC5wYXJlbnQoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgJHByZXZpb3VzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnaGlkZGVuLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgICB9KVxuICAgICAgJHRoaXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdzaG93bi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIFRhYi5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgIHZhciAkYWN0aXZlICAgID0gY29udGFpbmVyLmZpbmQoJz4gLmFjdGl2ZScpXG4gICAgdmFyIHRyYW5zaXRpb24gPSBjYWxsYmFja1xuICAgICAgJiYgJC5zdXBwb3J0LnRyYW5zaXRpb25cbiAgICAgICYmICgkYWN0aXZlLmxlbmd0aCAmJiAkYWN0aXZlLmhhc0NsYXNzKCdmYWRlJykgfHwgISFjb250YWluZXIuZmluZCgnPiAuZmFkZScpLmxlbmd0aClcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJz4gLmRyb3Bkb3duLW1lbnUgPiAuYWN0aXZlJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZW5kKClcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICAgIGVsZW1lbnRcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICBlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIHJlZmxvdyBmb3IgdHJhbnNpdGlvblxuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdpbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdmYWRlJylcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgICBlbGVtZW50XG4gICAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgJGFjdGl2ZS5sZW5ndGggJiYgdHJhbnNpdGlvbiA/XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIG5leHQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUYWIuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgbmV4dCgpXG5cbiAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdpbicpXG4gIH1cblxuXG4gIC8vIFRBQiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy50YWInKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRhYicsIChkYXRhID0gbmV3IFRhYih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udGFiXG5cbiAgJC5mbi50YWIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50YWIuQ29uc3RydWN0b3IgPSBUYWJcblxuXG4gIC8vIFRBQiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkLmZuLnRhYi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udGFiID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gVEFCIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFBsdWdpbi5jYWxsKCQodGhpcyksICdzaG93JylcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLCBjbGlja0hhbmRsZXIpXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFmZml4LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2FmZml4XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUZGSVggQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEFmZml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQWZmaXguREVGQVVMVFMsIG9wdGlvbnMpXG5cbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5vcHRpb25zLnRhcmdldCA9PT0gQWZmaXguREVGQVVMVFMudGFyZ2V0ID8gJCh0aGlzLm9wdGlvbnMudGFyZ2V0KSA6ICQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnRhcmdldClcblxuICAgIHRoaXMuJHRhcmdldCA9IHRhcmdldFxuICAgICAgLm9uKCdzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGknLCAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcykpXG4gICAgICAub24oJ2NsaWNrLmJzLmFmZml4LmRhdGEtYXBpJywgICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCwgdGhpcykpXG5cbiAgICB0aGlzLiRlbGVtZW50ICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLmFmZml4ZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnVucGluICAgICAgICA9IG51bGxcbiAgICB0aGlzLnBpbm5lZE9mZnNldCA9IG51bGxcblxuICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gIH1cblxuICBBZmZpeC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBBZmZpeC5SRVNFVCAgICA9ICdhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tJ1xuXG4gIEFmZml4LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMCxcbiAgICB0YXJnZXQ6IHdpbmRvd1xuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gICAgID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHZhciB0YXJnZXRIZWlnaHQgPSB0aGlzLiR0YXJnZXQuaGVpZ2h0KClcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiB0aGlzLmFmZml4ZWQgPT0gJ3RvcCcpIHJldHVybiBzY3JvbGxUb3AgPCBvZmZzZXRUb3AgPyAndG9wJyA6IGZhbHNlXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkID09ICdib3R0b20nKSB7XG4gICAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwpIHJldHVybiAoc2Nyb2xsVG9wICsgdGhpcy51bnBpbiA8PSBwb3NpdGlvbi50b3ApID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgICAgcmV0dXJuIChzY3JvbGxUb3AgKyB0YXJnZXRIZWlnaHQgPD0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICB9XG5cbiAgICB2YXIgaW5pdGlhbGl6aW5nICAgPSB0aGlzLmFmZml4ZWQgPT0gbnVsbFxuICAgIHZhciBjb2xsaWRlclRvcCAgICA9IGluaXRpYWxpemluZyA/IHNjcm9sbFRvcCA6IHBvc2l0aW9uLnRvcFxuICAgIHZhciBjb2xsaWRlckhlaWdodCA9IGluaXRpYWxpemluZyA/IHRhcmdldEhlaWdodCA6IGhlaWdodFxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHNjcm9sbFRvcCA8PSBvZmZzZXRUb3ApIHJldHVybiAndG9wJ1xuICAgIGlmIChvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAoY29sbGlkZXJUb3AgKyBjb2xsaWRlckhlaWdodCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pKSByZXR1cm4gJ2JvdHRvbSdcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5waW5uZWRPZmZzZXQpIHJldHVybiB0aGlzLnBpbm5lZE9mZnNldFxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpLmFkZENsYXNzKCdhZmZpeCcpXG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgcmV0dXJuICh0aGlzLnBpbm5lZE9mZnNldCA9IHBvc2l0aW9uLnRvcCAtIHNjcm9sbFRvcClcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSwgMSlcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkgcmV0dXJuXG5cbiAgICB2YXIgaGVpZ2h0ICAgICAgID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXQgICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3BcbiAgICB2YXIgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbVxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSBNYXRoLm1heCgkKGRvY3VtZW50KS5oZWlnaHQoKSwgJChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSlcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ICE9ICdvYmplY3QnKSAgICAgICAgIG9mZnNldEJvdHRvbSA9IG9mZnNldFRvcCA9IG9mZnNldFxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0VG9wID09ICdmdW5jdGlvbicpICAgIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3AodGhpcy4kZWxlbWVudClcbiAgICBpZiAodHlwZW9mIG9mZnNldEJvdHRvbSA9PSAnZnVuY3Rpb24nKSBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tKHRoaXMuJGVsZW1lbnQpXG5cbiAgICB2YXIgYWZmaXggPSB0aGlzLmdldFN0YXRlKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSlcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgIT0gYWZmaXgpIHtcbiAgICAgIGlmICh0aGlzLnVucGluICE9IG51bGwpIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCAnJylcblxuICAgICAgdmFyIGFmZml4VHlwZSA9ICdhZmZpeCcgKyAoYWZmaXggPyAnLScgKyBhZmZpeCA6ICcnKVxuICAgICAgdmFyIGUgICAgICAgICA9ICQuRXZlbnQoYWZmaXhUeXBlICsgJy5icy5hZmZpeCcpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuYWZmaXhlZCA9IGFmZml4XG4gICAgICB0aGlzLnVucGluID0gYWZmaXggPT0gJ2JvdHRvbScgPyB0aGlzLmdldFBpbm5lZE9mZnNldCgpIDogbnVsbFxuXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVClcbiAgICAgICAgLmFkZENsYXNzKGFmZml4VHlwZSlcbiAgICAgICAgLnRyaWdnZXIoYWZmaXhUeXBlLnJlcGxhY2UoJ2FmZml4JywgJ2FmZml4ZWQnKSArICcuYnMuYWZmaXgnKVxuICAgIH1cblxuICAgIGlmIChhZmZpeCA9PSAnYm90dG9tJykge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmZzZXQoe1xuICAgICAgICB0b3A6IHNjcm9sbEhlaWdodCAtIGhlaWdodCAtIG9mZnNldEJvdHRvbVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gIC8vIEFGRklYIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmFmZml4JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hZmZpeCcsIChkYXRhID0gbmV3IEFmZml4KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hZmZpeFxuXG4gICQuZm4uYWZmaXggICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hZmZpeC5Db25zdHJ1Y3RvciA9IEFmZml4XG5cblxuICAvLyBBRkZJWCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWZmaXgubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFmZml4ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUZGSVggREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwiYWZmaXhcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkc3B5LmRhdGEoKVxuXG4gICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IHt9XG5cbiAgICAgIGlmIChkYXRhLm9mZnNldEJvdHRvbSAhPSBudWxsKSBkYXRhLm9mZnNldC5ib3R0b20gPSBkYXRhLm9mZnNldEJvdHRvbVxuICAgICAgaWYgKGRhdGEub2Zmc2V0VG9wICAgICE9IG51bGwpIGRhdGEub2Zmc2V0LnRvcCAgICA9IGRhdGEub2Zmc2V0VG9wXG5cbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksIGRhdGEpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuIiwiLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8IEZsZXh5IGhlYWRlclxuLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8XG4vLyB8IFRoaXMgalF1ZXJ5IHNjcmlwdCBpcyB3cml0dGVuIGJ5XG4vLyB8XG4vLyB8IE1vcnRlbiBOaXNzZW5cbi8vIHwgaGplbW1lc2lkZWtvbmdlbi5ka1xuLy8gfFxuXG52YXIgZmxleHlfaGVhZGVyID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHB1YiA9IHt9LFxuICAgICAgICAkaGVhZGVyX3N0YXRpYyA9ICQoJy5mbGV4eS1oZWFkZXItLXN0YXRpYycpLFxuICAgICAgICAkaGVhZGVyX3N0aWNreSA9ICQoJy5mbGV4eS1oZWFkZXItLXN0aWNreScpLFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgdXBkYXRlX2ludGVydmFsOiAxMDAsXG4gICAgICAgICAgICB0b2xlcmFuY2U6IHtcbiAgICAgICAgICAgICAgICB1cHdhcmQ6IDIwLFxuICAgICAgICAgICAgICAgIGRvd253YXJkOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9mZnNldDogX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20oJGhlYWRlcl9zdGF0aWMpLFxuICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgIHBpbm5lZDogXCJmbGV4eS1oZWFkZXItLXBpbm5lZFwiLFxuICAgICAgICAgICAgICAgIHVucGlubmVkOiBcImZsZXh5LWhlYWRlci0tdW5waW5uZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3YXNfc2Nyb2xsZWQgPSBmYWxzZSxcbiAgICAgICAgbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZVxuICAgICAqL1xuICAgIHB1Yi5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYm9vdCBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgICRoZWFkZXJfc3RpY2t5LmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG5cbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICh3YXNfc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudF93YXNfc2Nyb2xsZWQoKTtcblxuICAgICAgICAgICAgICAgIHdhc19zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBvcHRpb25zLnVwZGF0ZV9pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHdhc19zY3JvbGxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBvZmZzZXQgZnJvbSBlbGVtZW50IGJvdHRvbVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tKCRlbGVtZW50KSB7XG4gICAgICAgIHZhciBlbGVtZW50X2hlaWdodCA9ICRlbGVtZW50Lm91dGVySGVpZ2h0KHRydWUpLFxuICAgICAgICAgICAgZWxlbWVudF9vZmZzZXQgPSAkZWxlbWVudC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtZW50X2hlaWdodCArIGVsZW1lbnRfb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2N1bWVudCB3YXMgc2Nyb2xsZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb2N1bWVudF93YXNfc2Nyb2xsZWQoKSB7XG4gICAgICAgIHZhciBjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIC8vIElmIHBhc3Qgb2Zmc2V0XG4gICAgICAgIGlmIChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID49IG9wdGlvbnMub2Zmc2V0KSB7XG5cbiAgICAgICAgICAgIC8vIERvd253YXJkcyBzY3JvbGxcbiAgICAgICAgICAgIGlmIChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID4gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkge1xuXG4gICAgICAgICAgICAgICAgLy8gT2JleSB0aGUgZG93bndhcmQgdG9sZXJhbmNlXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgLSBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSA8PSBvcHRpb25zLnRvbGVyYW5jZS5kb3dud2FyZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXB3YXJkcyBzY3JvbGxcbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gT2JleSB0aGUgdXB3YXJkIHRvbGVyYW5jZVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIC0gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkgPD0gb3B0aW9ucy50b2xlcmFuY2UudXB3YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBhcmUgbm90IHNjcm9sbGVkIHBhc3QgdGhlIGRvY3VtZW50IHdoaWNoIGlzIHBvc3NpYmxlIG9uIHRoZSBNYWNcbiAgICAgICAgICAgICAgICBpZiAoKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3QgcGFzdCBvZmZzZXRcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCA9IGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHwgRmxleHkgbmF2aWdhdGlvblxuLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8XG4vLyB8IFRoaXMgalF1ZXJ5IHNjcmlwdCBpcyB3cml0dGVuIGJ5XG4vLyB8XG4vLyB8IE1vcnRlbiBOaXNzZW5cbi8vIHwgaGplbW1lc2lkZWtvbmdlbi5ka1xuLy8gfFxuXG52YXIgZmxleHlfbmF2aWdhdGlvbiA9IChmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwdWIgPSB7fSxcbiAgICAgICAgbGF5b3V0X2NsYXNzZXMgPSB7XG4gICAgICAgICAgICAnbmF2aWdhdGlvbic6ICcuZmxleHktbmF2aWdhdGlvbicsXG4gICAgICAgICAgICAnb2JmdXNjYXRvcic6ICcuZmxleHktbmF2aWdhdGlvbl9fb2JmdXNjYXRvcicsXG4gICAgICAgICAgICAnZHJvcGRvd24nOiAnLmZsZXh5LW5hdmlnYXRpb25fX2l0ZW0tLWRyb3Bkb3duJyxcbiAgICAgICAgICAgICdkcm9wZG93bl9tZWdhbWVudSc6ICcuZmxleHktbmF2aWdhdGlvbl9faXRlbV9fZHJvcGRvd24tbWVnYW1lbnUnLFxuXG4gICAgICAgICAgICAnaXNfdXBncmFkZWQnOiAnaXMtdXBncmFkZWQnLFxuICAgICAgICAgICAgJ25hdmlnYXRpb25faGFzX21lZ2FtZW51JzogJ2hhcy1tZWdhbWVudScsXG4gICAgICAgICAgICAnZHJvcGRvd25faGFzX21lZ2FtZW51JzogJ2ZsZXh5LW5hdmlnYXRpb25fX2l0ZW0tLWRyb3Bkb3duLXdpdGgtbWVnYW1lbnUnLFxuICAgICAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVcbiAgICAgKi9cbiAgICBwdWIuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpO1xuICAgICAgICByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvb3QgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCkge1xuXG4gICAgICAgIC8vIFVwZ3JhZGVcbiAgICAgICAgdXBncmFkZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCkge31cblxuICAgIC8qKlxuICAgICAqIFVwZ3JhZGUgZWxlbWVudHMuXG4gICAgICogQWRkIGNsYXNzZXMgdG8gZWxlbWVudHMsIGJhc2VkIHVwb24gYXR0YWNoZWQgY2xhc3Nlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGdyYWRlKCkge1xuICAgICAgICB2YXIgJG5hdmlnYXRpb25zID0gJChsYXlvdXRfY2xhc3Nlcy5uYXZpZ2F0aW9uKTtcblxuICAgICAgICAvLyBOYXZpZ2F0aW9uc1xuICAgICAgICBpZiAoJG5hdmlnYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRuYXZpZ2F0aW9ucy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyICRuYXZpZ2F0aW9uID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgJG1lZ2FtZW51cyA9ICRuYXZpZ2F0aW9uLmZpbmQobGF5b3V0X2NsYXNzZXMuZHJvcGRvd25fbWVnYW1lbnUpLFxuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd25fbWVnYW1lbnUgPSAkbmF2aWdhdGlvbi5maW5kKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duX2hhc19tZWdhbWVudSk7XG5cbiAgICAgICAgICAgICAgICAvLyBIYXMgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkXG4gICAgICAgICAgICAgICAgaWYgKCRuYXZpZ2F0aW9uLmhhc0NsYXNzKGxheW91dF9jbGFzc2VzLmlzX3VwZ3JhZGVkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGFzIG1lZ2FtZW51XG4gICAgICAgICAgICAgICAgaWYgKCRtZWdhbWVudXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkbmF2aWdhdGlvbi5hZGRDbGFzcyhsYXlvdXRfY2xhc3Nlcy5uYXZpZ2F0aW9uX2hhc19tZWdhbWVudSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIHRocm91Z2ggYWxsIG1lZ2FtZW51c1xuICAgICAgICAgICAgICAgICAgICAkbWVnYW1lbnVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkbWVnYW1lbnUgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc19vYmZ1c2NhdG9yID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdoYXMtb2JmdXNjYXRvcicpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWVnYW1lbnUucGFyZW50cyhsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MobGF5b3V0X2NsYXNzZXMuZHJvcGRvd25faGFzX21lZ2FtZW51KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzX29iZnVzY2F0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iZnVzY2F0b3Iuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzX29iZnVzY2F0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iZnVzY2F0b3IuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElzIHVwZ3JhZGVkXG4gICAgICAgICAgICAgICAgJG5hdmlnYXRpb24uYWRkQ2xhc3MobGF5b3V0X2NsYXNzZXMuaXNfdXBncmFkZWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIi8qISBzaWRyIC0gdjIuMi4xIC0gMjAxNi0wMi0xN1xuICogaHR0cDovL3d3dy5iZXJyaWFydC5jb20vc2lkci9cbiAqIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IEFsYmVydG8gVmFyZWxhOyBMaWNlbnNlZCBNSVQgKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBiYWJlbEhlbHBlcnMgPSB7fTtcblxuICBiYWJlbEhlbHBlcnMuY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9O1xuXG4gIGJhYmVsSGVscGVycy5jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH07XG4gIH0oKTtcblxuICBiYWJlbEhlbHBlcnM7XG5cbiAgdmFyIHNpZHJTdGF0dXMgPSB7XG4gICAgbW92aW5nOiBmYWxzZSxcbiAgICBvcGVuZWQ6IGZhbHNlXG4gIH07XG5cbiAgdmFyIGhlbHBlciA9IHtcbiAgICAvLyBDaGVjayBmb3IgdmFsaWRzIHVybHNcbiAgICAvLyBGcm9tIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NzE3MDkzL2NoZWNrLWlmLWEtamF2YXNjcmlwdC1zdHJpbmctaXMtYW4tdXJsXG5cbiAgICBpc1VybDogZnVuY3Rpb24gaXNVcmwoc3RyKSB7XG4gICAgICB2YXIgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ14oaHR0cHM/OlxcXFwvXFxcXC8pPycgKyAvLyBwcm90b2NvbFxuICAgICAgJygoKFthLXpcXFxcZF0oW2EtelxcXFxkLV0qW2EtelxcXFxkXSkqKVxcXFwuPykrW2Etel17Mix9fCcgKyAvLyBkb21haW4gbmFtZVxuICAgICAgJygoXFxcXGR7MSwzfVxcXFwuKXszfVxcXFxkezEsM30pKScgKyAvLyBPUiBpcCAodjQpIGFkZHJlc3NcbiAgICAgICcoXFxcXDpcXFxcZCspPyhcXFxcL1stYS16XFxcXGQlXy5+K10qKSonICsgLy8gcG9ydCBhbmQgcGF0aFxuICAgICAgJyhcXFxcP1s7JmEtelxcXFxkJV8ufis9LV0qKT8nICsgLy8gcXVlcnkgc3RyaW5nXG4gICAgICAnKFxcXFwjWy1hLXpcXFxcZF9dKik/JCcsICdpJyk7IC8vIGZyYWdtZW50IGxvY2F0b3JcblxuICAgICAgaWYgKHBhdHRlcm4udGVzdChzdHIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8vIEFkZCBzaWRyIHByZWZpeGVzXG4gICAgYWRkUHJlZml4ZXM6IGZ1bmN0aW9uIGFkZFByZWZpeGVzKCRlbGVtZW50KSB7XG4gICAgICB0aGlzLmFkZFByZWZpeCgkZWxlbWVudCwgJ2lkJyk7XG4gICAgICB0aGlzLmFkZFByZWZpeCgkZWxlbWVudCwgJ2NsYXNzJyk7XG4gICAgICAkZWxlbWVudC5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgIH0sXG4gICAgYWRkUHJlZml4OiBmdW5jdGlvbiBhZGRQcmVmaXgoJGVsZW1lbnQsIGF0dHJpYnV0ZSkge1xuICAgICAgdmFyIHRvUmVwbGFjZSA9ICRlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcblxuICAgICAgaWYgKHR5cGVvZiB0b1JlcGxhY2UgPT09ICdzdHJpbmcnICYmIHRvUmVwbGFjZSAhPT0gJycgJiYgdG9SZXBsYWNlICE9PSAnc2lkci1pbm5lcicpIHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUsIHRvUmVwbGFjZS5yZXBsYWNlKC8oW0EtWmEtejAtOV8uXFwtXSspL2csICdzaWRyLScgKyBhdHRyaWJ1dGUgKyAnLSQxJykpO1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8vIENoZWNrIGlmIHRyYW5zaXRpb25zIGlzIHN1cHBvcnRlZFxuICAgIHRyYW5zaXRpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgIHN0eWxlID0gYm9keS5zdHlsZSxcbiAgICAgICAgICBzdXBwb3J0ZWQgPSBmYWxzZSxcbiAgICAgICAgICBwcm9wZXJ0eSA9ICd0cmFuc2l0aW9uJztcblxuICAgICAgaWYgKHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICAgIHN1cHBvcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBwcmVmaXhlcyA9IFsnbW96JywgJ3dlYmtpdCcsICdvJywgJ21zJ10sXG4gICAgICAgICAgICAgIHByZWZpeCA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgaSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zdWJzdHIoMSk7XG4gICAgICAgICAgc3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHByZWZpeCA9IHByZWZpeGVzW2ldO1xuICAgICAgICAgICAgICBpZiAocHJlZml4ICsgcHJvcGVydHkgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSgpO1xuICAgICAgICAgIHByb3BlcnR5ID0gc3VwcG9ydGVkID8gJy0nICsgcHJlZml4LnRvTG93ZXJDYXNlKCkgKyAnLScgKyBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VwcG9ydGVkOiBzdXBwb3J0ZWQsXG4gICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eVxuICAgICAgfTtcbiAgICB9KClcbiAgfTtcblxuICB2YXIgJCQyID0galF1ZXJ5O1xuXG4gIHZhciBib2R5QW5pbWF0aW9uQ2xhc3MgPSAnc2lkci1hbmltYXRpbmcnO1xuICB2YXIgb3BlbkFjdGlvbiA9ICdvcGVuJztcbiAgdmFyIGNsb3NlQWN0aW9uID0gJ2Nsb3NlJztcbiAgdmFyIHRyYW5zaXRpb25FbmRFdmVudCA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJztcbiAgdmFyIE1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWVudShuYW1lKSB7XG4gICAgICBiYWJlbEhlbHBlcnMuY2xhc3NDYWxsQ2hlY2sodGhpcywgTWVudSk7XG5cbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLml0ZW0gPSAkJDIoJyMnICsgbmFtZSk7XG4gICAgICB0aGlzLm9wZW5DbGFzcyA9IG5hbWUgPT09ICdzaWRyJyA/ICdzaWRyLW9wZW4nIDogJ3NpZHItb3BlbiAnICsgbmFtZSArICctb3Blbic7XG4gICAgICB0aGlzLm1lbnVXaWR0aCA9IHRoaXMuaXRlbS5vdXRlcldpZHRoKHRydWUpO1xuICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuaXRlbS5kYXRhKCdzcGVlZCcpO1xuICAgICAgdGhpcy5zaWRlID0gdGhpcy5pdGVtLmRhdGEoJ3NpZGUnKTtcbiAgICAgIHRoaXMuZGlzcGxhY2UgPSB0aGlzLml0ZW0uZGF0YSgnZGlzcGxhY2UnKTtcbiAgICAgIHRoaXMudGltaW5nID0gdGhpcy5pdGVtLmRhdGEoJ3RpbWluZycpO1xuICAgICAgdGhpcy5tZXRob2QgPSB0aGlzLml0ZW0uZGF0YSgnbWV0aG9kJyk7XG4gICAgICB0aGlzLm9uT3BlbkNhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uT3BlbicpO1xuICAgICAgdGhpcy5vbkNsb3NlQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25DbG9zZScpO1xuICAgICAgdGhpcy5vbk9wZW5FbmRDYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbk9wZW5FbmQnKTtcbiAgICAgIHRoaXMub25DbG9zZUVuZENhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uQ2xvc2VFbmQnKTtcbiAgICAgIHRoaXMuYm9keSA9ICQkMih0aGlzLml0ZW0uZGF0YSgnYm9keScpKTtcbiAgICB9XG5cbiAgICBiYWJlbEhlbHBlcnMuY3JlYXRlQ2xhc3MoTWVudSwgW3tcbiAgICAgIGtleTogJ2dldEFuaW1hdGlvbicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QW5pbWF0aW9uKGFjdGlvbiwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0ge30sXG4gICAgICAgICAgICBwcm9wID0gdGhpcy5zaWRlO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdvcGVuJyAmJiBlbGVtZW50ID09PSAnYm9keScpIHtcbiAgICAgICAgICBhbmltYXRpb25bcHJvcF0gPSB0aGlzLm1lbnVXaWR0aCArICdweCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnY2xvc2UnICYmIGVsZW1lbnQgPT09ICdtZW51Jykge1xuICAgICAgICAgIGFuaW1hdGlvbltwcm9wXSA9ICctJyArIHRoaXMubWVudVdpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbmltYXRpb25bcHJvcF0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdwcmVwYXJlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcHJlcGFyZUJvZHkoYWN0aW9uKSB7XG4gICAgICAgIHZhciBwcm9wID0gYWN0aW9uID09PSAnb3BlbicgPyAnaGlkZGVuJyA6ICcnO1xuXG4gICAgICAgIC8vIFByZXBhcmUgcGFnZSBpZiBjb250YWluZXIgaXMgYm9keVxuICAgICAgICBpZiAodGhpcy5ib2R5LmlzKCdib2R5JykpIHtcbiAgICAgICAgICB2YXIgJGh0bWwgPSAkJDIoJ2h0bWwnKSxcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGh0bWwuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAkaHRtbC5jc3MoJ292ZXJmbG93LXgnLCBwcm9wKS5zY3JvbGxUb3Aoc2Nyb2xsVG9wKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29wZW5Cb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuQm9keSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxhY2UpIHtcbiAgICAgICAgICB2YXIgdHJhbnNpdGlvbnMgPSBoZWxwZXIudHJhbnNpdGlvbnMsXG4gICAgICAgICAgICAgICRib2R5ID0gdGhpcy5ib2R5O1xuXG4gICAgICAgICAgaWYgKHRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgICAgJGJvZHkuY3NzKHRyYW5zaXRpb25zLnByb3BlcnR5LCB0aGlzLnNpZGUgKyAnICcgKyB0aGlzLnNwZWVkIC8gMTAwMCArICdzICcgKyB0aGlzLnRpbWluZykuY3NzKHRoaXMuc2lkZSwgMCkuY3NzKHtcbiAgICAgICAgICAgICAgd2lkdGg6ICRib2R5LndpZHRoKCksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRib2R5LmNzcyh0aGlzLnNpZGUsIHRoaXMubWVudVdpZHRoICsgJ3B4Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBib2R5QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24ob3BlbkFjdGlvbiwgJ2JvZHknKTtcblxuICAgICAgICAgICAgJGJvZHkuY3NzKHtcbiAgICAgICAgICAgICAgd2lkdGg6ICRib2R5LndpZHRoKCksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICB9KS5hbmltYXRlKGJvZHlBbmltYXRpb24sIHtcbiAgICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25DbG9zZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2xvc2VCb2R5KCkge1xuICAgICAgICB2YXIgdHJhbnNpdGlvbnMgPSBoZWxwZXIudHJhbnNpdGlvbnMsXG4gICAgICAgICAgICByZXNldFN0eWxlcyA9IHtcbiAgICAgICAgICB3aWR0aDogJycsXG4gICAgICAgICAgcG9zaXRpb246ICcnLFxuICAgICAgICAgIHJpZ2h0OiAnJyxcbiAgICAgICAgICBsZWZ0OiAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICByZXNldFN0eWxlc1t0cmFuc2l0aW9ucy5wcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm9keS5jc3MocmVzZXRTdHlsZXMpLnVuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2Nsb3NlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2VCb2R5KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYWNlKSB7XG4gICAgICAgICAgaWYgKGhlbHBlci50cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keS5jc3ModGhpcy5zaWRlLCAwKS5vbmUodHJhbnNpdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF90aGlzLm9uQ2xvc2VCb2R5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGJvZHlBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihjbG9zZUFjdGlvbiwgJ2JvZHknKTtcblxuICAgICAgICAgICAgdGhpcy5ib2R5LmFuaW1hdGUoYm9keUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub25DbG9zZUJvZHkoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnbW92ZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmVCb2R5KGFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uID09PSBvcGVuQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vcGVuQm9keSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xvc2VCb2R5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbk9wZW5NZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbk9wZW5NZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5uYW1lO1xuXG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNpZHJTdGF0dXMub3BlbmVkID0gbmFtZTtcblxuICAgICAgICB0aGlzLml0ZW0udW5iaW5kKHRyYW5zaXRpb25FbmRFdmVudCk7XG5cbiAgICAgICAgdGhpcy5ib2R5LnJlbW92ZUNsYXNzKGJvZHlBbmltYXRpb25DbGFzcykuYWRkQ2xhc3ModGhpcy5vcGVuQ2xhc3MpO1xuXG4gICAgICAgIHRoaXMub25PcGVuRW5kQ2FsbGJhY2soKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvcGVuTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb3Blbk1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdmFyICRpdGVtID0gdGhpcy5pdGVtO1xuXG4gICAgICAgIGlmIChoZWxwZXIudHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgJGl0ZW0uY3NzKHRoaXMuc2lkZSwgMCkub25lKHRyYW5zaXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMyLm9uT3Blbk1lbnUoY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtZW51QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24ob3BlbkFjdGlvbiwgJ21lbnUnKTtcblxuICAgICAgICAgICRpdGVtLmNzcygnZGlzcGxheScsICdibG9jaycpLmFuaW1hdGUobWVudUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWQsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgICAgICAgIF90aGlzMi5vbk9wZW5NZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29uQ2xvc2VNZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsb3NlTWVudShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLml0ZW0uY3NzKHtcbiAgICAgICAgICBsZWZ0OiAnJyxcbiAgICAgICAgICByaWdodDogJydcbiAgICAgICAgfSkudW5iaW5kKHRyYW5zaXRpb25FbmRFdmVudCk7XG4gICAgICAgICQkMignaHRtbCcpLmNzcygnb3ZlcmZsb3cteCcsICcnKTtcblxuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgICBzaWRyU3RhdHVzLm9wZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYm9keS5yZW1vdmVDbGFzcyhib2R5QW5pbWF0aW9uQ2xhc3MpLnJlbW92ZUNsYXNzKHRoaXMub3BlbkNsYXNzKTtcblxuICAgICAgICB0aGlzLm9uQ2xvc2VFbmRDYWxsYmFjaygpO1xuXG4gICAgICAgIC8vIENhbGxiYWNrXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjYWxsYmFjayhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2Nsb3NlTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2VNZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtO1xuXG4gICAgICAgIGlmIChoZWxwZXIudHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgaXRlbS5jc3ModGhpcy5zaWRlLCAnJykub25lKHRyYW5zaXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMzLm9uQ2xvc2VNZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbWVudUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKGNsb3NlQWN0aW9uLCAnbWVudScpO1xuXG4gICAgICAgICAgaXRlbS5hbmltYXRlKG1lbnVBbmltYXRpb24sIHtcbiAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICBfdGhpczMub25DbG9zZU1lbnUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21vdmVNZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlTWVudShhY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuYm9keS5hZGRDbGFzcyhib2R5QW5pbWF0aW9uQ2xhc3MpO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT09IG9wZW5BY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLm9wZW5NZW51KGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsb3NlTWVudShjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdtb3ZlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKGFjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gTG9jayBzaWRyXG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnByZXBhcmVCb2R5KGFjdGlvbik7XG4gICAgICAgIHRoaXMubW92ZUJvZHkoYWN0aW9uKTtcbiAgICAgICAgdGhpcy5tb3ZlTWVudShhY3Rpb24sIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvcGVuJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGlzIGFscmVhZHkgb3BlbmVkIG9yIG1vdmluZ1xuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgPT09IHRoaXMubmFtZSB8fCBzaWRyU3RhdHVzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGFub3RoZXIgbWVudSBvcGVuZWQgY2xvc2UgZmlyc3RcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkICE9PSBmYWxzZSkge1xuICAgICAgICAgIHZhciBhbHJlYWR5T3BlbmVkTWVudSA9IG5ldyBNZW51KHNpZHJTdGF0dXMub3BlbmVkKTtcblxuICAgICAgICAgIGFscmVhZHlPcGVuZWRNZW51LmNsb3NlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNC5vcGVuKGNhbGxiYWNrKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW92ZSgnb3BlbicsIGNhbGxiYWNrKTtcblxuICAgICAgICAvLyBvbk9wZW4gY2FsbGJhY2tcbiAgICAgICAgdGhpcy5vbk9wZW5DYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2Nsb3NlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZShjYWxsYmFjaykge1xuICAgICAgICAvLyBDaGVjayBpZiBpcyBhbHJlYWR5IGNsb3NlZCBvciBtb3ZpbmdcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkICE9PSB0aGlzLm5hbWUgfHwgc2lkclN0YXR1cy5tb3ZpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmUoJ2Nsb3NlJywgY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIG9uQ2xvc2UgY2FsbGJhY2tcbiAgICAgICAgdGhpcy5vbkNsb3NlQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICd0b2dnbGUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgPT09IHRoaXMubmFtZSkge1xuICAgICAgICAgIHRoaXMuY2xvc2UoY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3BlbihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIE1lbnU7XG4gIH0oKTtcblxuICB2YXIgJCQxID0galF1ZXJ5O1xuXG4gIGZ1bmN0aW9uIGV4ZWN1dGUoYWN0aW9uLCBuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBzaWRyID0gbmV3IE1lbnUobmFtZSk7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSAnb3Blbic6XG4gICAgICAgIHNpZHIub3BlbihjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICBzaWRyLmNsb3NlKGNhbGxiYWNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0b2dnbGUnOlxuICAgICAgICBzaWRyLnRvZ2dsZShjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgJCQxLmVycm9yKCdNZXRob2QgJyArIGFjdGlvbiArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LnNpZHInKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIGk7XG4gIHZhciAkID0galF1ZXJ5O1xuICB2YXIgcHVibGljTWV0aG9kcyA9IFsnb3BlbicsICdjbG9zZScsICd0b2dnbGUnXTtcbiAgdmFyIG1ldGhvZE5hbWU7XG4gIHZhciBtZXRob2RzID0ge307XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiBnZXRNZXRob2QobWV0aG9kTmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIC8vIENoZWNrIGFyZ3VtZW50c1xuICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmFtZTtcbiAgICAgICAgbmFtZSA9ICdzaWRyJztcbiAgICAgIH0gZWxzZSBpZiAoIW5hbWUpIHtcbiAgICAgICAgbmFtZSA9ICdzaWRyJztcbiAgICAgIH1cblxuICAgICAgZXhlY3V0ZShtZXRob2ROYW1lLCBuYW1lLCBjYWxsYmFjayk7XG4gICAgfTtcbiAgfTtcbiAgZm9yIChpID0gMDsgaSA8IHB1YmxpY01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXRob2ROYW1lID0gcHVibGljTWV0aG9kc1tpXTtcbiAgICBtZXRob2RzW21ldGhvZE5hbWVdID0gZ2V0TWV0aG9kKG1ldGhvZE5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2lkcihtZXRob2QpIHtcbiAgICBpZiAobWV0aG9kID09PSAnc3RhdHVzJykge1xuICAgICAgcmV0dXJuIHNpZHJTdGF0dXM7XG4gICAgfSBlbHNlIGlmIChtZXRob2RzW21ldGhvZF0pIHtcbiAgICAgIHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnIHx8ICFtZXRob2QpIHtcbiAgICAgIHJldHVybiBtZXRob2RzLnRvZ2dsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkLmVycm9yKCdNZXRob2QgJyArIG1ldGhvZCArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LnNpZHInKTtcbiAgICB9XG4gIH1cblxuICB2YXIgJCQzID0galF1ZXJ5O1xuXG4gIGZ1bmN0aW9uIGZpbGxDb250ZW50KCRzaWRlTWVudSwgc2V0dGluZ3MpIHtcbiAgICAvLyBUaGUgbWVudSBjb250ZW50XG4gICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBuZXdDb250ZW50ID0gc2V0dGluZ3Muc291cmNlKG5hbWUpO1xuXG4gICAgICAkc2lkZU1lbnUuaHRtbChuZXdDb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3VyY2UgPT09ICdzdHJpbmcnICYmIGhlbHBlci5pc1VybChzZXR0aW5ncy5zb3VyY2UpKSB7XG4gICAgICAkJDMuZ2V0KHNldHRpbmdzLnNvdXJjZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJHNpZGVNZW51Lmh0bWwoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgaHRtbENvbnRlbnQgPSAnJyxcbiAgICAgICAgICBzZWxlY3RvcnMgPSBzZXR0aW5ncy5zb3VyY2Uuc3BsaXQoJywnKTtcblxuICAgICAgJCQzLmVhY2goc2VsZWN0b3JzLCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgaHRtbENvbnRlbnQgKz0gJzxkaXYgY2xhc3M9XCJzaWRyLWlubmVyXCI+JyArICQkMyhlbGVtZW50KS5odG1sKCkgKyAnPC9kaXY+JztcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZW5hbWluZyBpZHMgYW5kIGNsYXNzZXNcbiAgICAgIGlmIChzZXR0aW5ncy5yZW5hbWluZykge1xuICAgICAgICB2YXIgJGh0bWxDb250ZW50ID0gJCQzKCc8ZGl2IC8+JykuaHRtbChodG1sQ29udGVudCk7XG5cbiAgICAgICAgJGh0bWxDb250ZW50LmZpbmQoJyonKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQkMyhlbGVtZW50KTtcblxuICAgICAgICAgIGhlbHBlci5hZGRQcmVmaXhlcygkZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBodG1sQ29udGVudCA9ICRodG1sQ29udGVudC5odG1sKCk7XG4gICAgICB9XG5cbiAgICAgICRzaWRlTWVudS5odG1sKGh0bWxDb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLnNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgJCQzLmVycm9yKCdJbnZhbGlkIFNpZHIgU291cmNlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRzaWRlTWVudTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZuU2lkcihvcHRpb25zKSB7XG4gICAgdmFyIHRyYW5zaXRpb25zID0gaGVscGVyLnRyYW5zaXRpb25zLFxuICAgICAgICBzZXR0aW5ncyA9ICQkMy5leHRlbmQoe1xuICAgICAgbmFtZTogJ3NpZHInLCAvLyBOYW1lIGZvciB0aGUgJ3NpZHInXG4gICAgICBzcGVlZDogMjAwLCAvLyBBY2NlcHRzIHN0YW5kYXJkIGpRdWVyeSBlZmZlY3RzIHNwZWVkcyAoaS5lLiBmYXN0LCBub3JtYWwgb3IgbWlsbGlzZWNvbmRzKVxuICAgICAgc2lkZTogJ2xlZnQnLCAvLyBBY2NlcHRzICdsZWZ0JyBvciAncmlnaHQnXG4gICAgICBzb3VyY2U6IG51bGwsIC8vIE92ZXJyaWRlIHRoZSBzb3VyY2Ugb2YgdGhlIGNvbnRlbnQuXG4gICAgICByZW5hbWluZzogdHJ1ZSwgLy8gVGhlIGlkcyBhbmQgY2xhc3NlcyB3aWxsIGJlIHByZXBlbmRlZCB3aXRoIGEgcHJlZml4IHdoZW4gbG9hZGluZyBleGlzdGVudCBjb250ZW50XG4gICAgICBib2R5OiAnYm9keScsIC8vIFBhZ2UgY29udGFpbmVyIHNlbGVjdG9yLFxuICAgICAgZGlzcGxhY2U6IHRydWUsIC8vIERpc3BsYWNlIHRoZSBib2R5IGNvbnRlbnQgb3Igbm90XG4gICAgICB0aW1pbmc6ICdlYXNlJywgLy8gVGltaW5nIGZ1bmN0aW9uIGZvciBDU1MgdHJhbnNpdGlvbnNcbiAgICAgIG1ldGhvZDogJ3RvZ2dsZScsIC8vIFRoZSBtZXRob2QgdG8gY2FsbCB3aGVuIGVsZW1lbnQgaXMgY2xpY2tlZFxuICAgICAgYmluZDogJ3RvdWNoc3RhcnQgY2xpY2snLCAvLyBUaGUgZXZlbnQocykgdG8gdHJpZ2dlciB0aGUgbWVudVxuICAgICAgb25PcGVuOiBmdW5jdGlvbiBvbk9wZW4oKSB7fSxcbiAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2lkciBzdGFydCBvcGVuaW5nXG4gICAgICBvbkNsb3NlOiBmdW5jdGlvbiBvbkNsb3NlKCkge30sXG4gICAgICAvLyBDYWxsYmFjayB3aGVuIHNpZHIgc3RhcnQgY2xvc2luZ1xuICAgICAgb25PcGVuRW5kOiBmdW5jdGlvbiBvbk9wZW5FbmQoKSB7fSxcbiAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2lkciBlbmQgb3BlbmluZ1xuICAgICAgb25DbG9zZUVuZDogZnVuY3Rpb24gb25DbG9zZUVuZCgpIHt9IC8vIENhbGxiYWNrIHdoZW4gc2lkciBlbmQgY2xvc2luZ1xuXG4gICAgfSwgb3B0aW9ucyksXG4gICAgICAgIG5hbWUgPSBzZXR0aW5ncy5uYW1lLFxuICAgICAgICAkc2lkZU1lbnUgPSAkJDMoJyMnICsgbmFtZSk7XG5cbiAgICAvLyBJZiB0aGUgc2lkZSBtZW51IGRvIG5vdCBleGlzdCBjcmVhdGUgaXRcbiAgICBpZiAoJHNpZGVNZW51Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgJHNpZGVNZW51ID0gJCQzKCc8ZGl2IC8+JykuYXR0cignaWQnLCBuYW1lKS5hcHBlbmRUbygkJDMoJ2JvZHknKSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRyYW5zaXRpb24gdG8gbWVudSBpZiBhcmUgc3VwcG9ydGVkXG4gICAgaWYgKHRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgJHNpZGVNZW51LmNzcyh0cmFuc2l0aW9ucy5wcm9wZXJ0eSwgc2V0dGluZ3Muc2lkZSArICcgJyArIHNldHRpbmdzLnNwZWVkIC8gMTAwMCArICdzICcgKyBzZXR0aW5ncy50aW1pbmcpO1xuICAgIH1cblxuICAgIC8vIEFkZGluZyBzdHlsZXMgYW5kIG9wdGlvbnNcbiAgICAkc2lkZU1lbnUuYWRkQ2xhc3MoJ3NpZHInKS5hZGRDbGFzcyhzZXR0aW5ncy5zaWRlKS5kYXRhKHtcbiAgICAgIHNwZWVkOiBzZXR0aW5ncy5zcGVlZCxcbiAgICAgIHNpZGU6IHNldHRpbmdzLnNpZGUsXG4gICAgICBib2R5OiBzZXR0aW5ncy5ib2R5LFxuICAgICAgZGlzcGxhY2U6IHNldHRpbmdzLmRpc3BsYWNlLFxuICAgICAgdGltaW5nOiBzZXR0aW5ncy50aW1pbmcsXG4gICAgICBtZXRob2Q6IHNldHRpbmdzLm1ldGhvZCxcbiAgICAgIG9uT3Blbjogc2V0dGluZ3Mub25PcGVuLFxuICAgICAgb25DbG9zZTogc2V0dGluZ3Mub25DbG9zZSxcbiAgICAgIG9uT3BlbkVuZDogc2V0dGluZ3Mub25PcGVuRW5kLFxuICAgICAgb25DbG9zZUVuZDogc2V0dGluZ3Mub25DbG9zZUVuZFxuICAgIH0pO1xuXG4gICAgJHNpZGVNZW51ID0gZmlsbENvbnRlbnQoJHNpZGVNZW51LCBzZXR0aW5ncyk7XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQkMyh0aGlzKSxcbiAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YSgnc2lkcicpLFxuICAgICAgICAgIGZsYWcgPSBmYWxzZTtcblxuICAgICAgLy8gSWYgdGhlIHBsdWdpbiBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXRcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgICBzaWRyU3RhdHVzLm9wZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgICR0aGlzLmRhdGEoJ3NpZHInLCBuYW1lKTtcblxuICAgICAgICAkdGhpcy5iaW5kKHNldHRpbmdzLmJpbmQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBpZiAoIWZsYWcpIHtcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgc2lkcihzZXR0aW5ncy5tZXRob2QsIG5hbWUpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5LnNpZHIgPSBzaWRyO1xuICBqUXVlcnkuZm4uc2lkciA9IGZuU2lkcjtcblxufSgpKTsiLCIhZnVuY3Rpb24oZSl7dmFyIHQ7ZS5mbi5zbGlua3k9ZnVuY3Rpb24oYSl7dmFyIHM9ZS5leHRlbmQoe2xhYmVsOlwiQmFja1wiLHRpdGxlOiExLHNwZWVkOjMwMCxyZXNpemU6ITB9LGEpLGk9ZSh0aGlzKSxuPWkuY2hpbGRyZW4oKS5maXJzdCgpO2kuYWRkQ2xhc3MoXCJzbGlua3ktbWVudVwiKTt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciBhPU1hdGgucm91bmQocGFyc2VJbnQobi5nZXQoMCkuc3R5bGUubGVmdCkpfHwwO24uY3NzKFwibGVmdFwiLGEtMTAwKmUrXCIlXCIpLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJnNldFRpbWVvdXQodCxzLnNwZWVkKX0sbD1mdW5jdGlvbihlKXtpLmhlaWdodChlLm91dGVySGVpZ2h0KCkpfSxkPWZ1bmN0aW9uKGUpe2kuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLGUrXCJtc1wiKSxuLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIixlK1wibXNcIil9O2lmKGQocy5zcGVlZCksZShcImEgKyB1bFwiLGkpLnByZXYoKS5hZGRDbGFzcyhcIm5leHRcIiksZShcImxpID4gdWxcIixpKS5wcmVwZW5kKCc8bGkgY2xhc3M9XCJoZWFkZXJcIj4nKSxzLnRpdGxlPT09ITAmJmUoXCJsaSA+IHVsXCIsaSkuZWFjaChmdW5jdGlvbigpe3ZhciB0PWUodGhpcykucGFyZW50KCkuZmluZChcImFcIikuZmlyc3QoKS50ZXh0KCksYT1lKFwiPGgyPlwiKS50ZXh0KHQpO2UoXCI+IC5oZWFkZXJcIix0aGlzKS5hcHBlbmQoYSl9KSxzLnRpdGxlfHxzLmxhYmVsIT09ITApe3ZhciBvPWUoXCI8YT5cIikudGV4dChzLmxhYmVsKS5wcm9wKFwiaHJlZlwiLFwiI1wiKS5hZGRDbGFzcyhcImJhY2tcIik7ZShcIi5oZWFkZXJcIixpKS5hcHBlbmQobyl9ZWxzZSBlKFwibGkgPiB1bFwiLGkpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1lKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJhXCIpLmZpcnN0KCkudGV4dCgpLGE9ZShcIjxhPlwiKS50ZXh0KHQpLnByb3AoXCJocmVmXCIsXCIjXCIpLmFkZENsYXNzKFwiYmFja1wiKTtlKFwiPiAuaGVhZGVyXCIsdGhpcykuYXBwZW5kKGEpfSk7ZShcImFcIixpKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oYSl7aWYoISh0K3Muc3BlZWQ+RGF0ZS5ub3coKSkpe3Q9RGF0ZS5ub3coKTt2YXIgbj1lKHRoaXMpOy8jLy50ZXN0KHRoaXMuaHJlZikmJmEucHJldmVudERlZmF1bHQoKSxuLmhhc0NsYXNzKFwibmV4dFwiKT8oaS5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxuLm5leHQoKS5zaG93KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIikscigxKSxzLnJlc2l6ZSYmbChuLm5leHQoKSkpOm4uaGFzQ2xhc3MoXCJiYWNrXCIpJiYocigtMSxmdW5jdGlvbigpe2kuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksbi5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKCkucGFyZW50c1VudGlsKGksXCJ1bFwiKS5maXJzdCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpfSkscy5yZXNpemUmJmwobi5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnRzVW50aWwoaSxcInVsXCIpKSl9fSksdGhpcy5qdW1wPWZ1bmN0aW9uKHQsYSl7dD1lKHQpO3ZhciBuPWkuZmluZChcIi5hY3RpdmVcIik7bj1uLmxlbmd0aD4wP24ucGFyZW50c1VudGlsKGksXCJ1bFwiKS5sZW5ndGg6MCxpLmZpbmQoXCJ1bFwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5oaWRlKCk7dmFyIG89dC5wYXJlbnRzVW50aWwoaSxcInVsXCIpO28uc2hvdygpLHQuc2hvdygpLmFkZENsYXNzKFwiYWN0aXZlXCIpLGE9PT0hMSYmZCgwKSxyKG8ubGVuZ3RoLW4pLHMucmVzaXplJiZsKHQpLGE9PT0hMSYmZChzLnNwZWVkKX0sdGhpcy5ob21lPWZ1bmN0aW9uKHQpe3Q9PT0hMSYmZCgwKTt2YXIgYT1pLmZpbmQoXCIuYWN0aXZlXCIpLG49YS5wYXJlbnRzVW50aWwoaSxcImxpXCIpLmxlbmd0aDtuPjAmJihyKC1uLGZ1bmN0aW9uKCl7YS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKX0pLHMucmVzaXplJiZsKGUoYS5wYXJlbnRzVW50aWwoaSxcImxpXCIpLmdldChuLTEpKS5wYXJlbnQoKSkpLHQ9PT0hMSYmZChzLnNwZWVkKX0sdGhpcy5kZXN0cm95PWZ1bmN0aW9uKCl7ZShcIi5oZWFkZXJcIixpKS5yZW1vdmUoKSxlKFwiYVwiLGkpLnJlbW92ZUNsYXNzKFwibmV4dFwiKS5vZmYoXCJjbGlja1wiKSxpLnJlbW92ZUNsYXNzKFwic2xpbmt5LW1lbnVcIikuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLFwiXCIpLG4uY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLFwiXCIpfTt2YXIgYz1pLmZpbmQoXCIuYWN0aXZlXCIpO3JldHVybiBjLmxlbmd0aD4wJiYoYy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSx0aGlzLmp1bXAoYywhMSkpLHRoaXN9fShqUXVlcnkpOyIsIihmdW5jdGlvbigpIHtcbiAgdmFyIEFqYXhNb25pdG9yLCBCYXIsIERvY3VtZW50TW9uaXRvciwgRWxlbWVudE1vbml0b3IsIEVsZW1lbnRUcmFja2VyLCBFdmVudExhZ01vbml0b3IsIEV2ZW50ZWQsIEV2ZW50cywgTm9UYXJnZXRFcnJvciwgUGFjZSwgUmVxdWVzdEludGVyY2VwdCwgU09VUkNFX0tFWVMsIFNjYWxlciwgU29ja2V0UmVxdWVzdFRyYWNrZXIsIFhIUlJlcXVlc3RUcmFja2VyLCBhbmltYXRpb24sIGF2Z0FtcGxpdHVkZSwgYmFyLCBjYW5jZWxBbmltYXRpb24sIGNhbmNlbEFuaW1hdGlvbkZyYW1lLCBkZWZhdWx0T3B0aW9ucywgZXh0ZW5kLCBleHRlbmROYXRpdmUsIGdldEZyb21ET00sIGdldEludGVyY2VwdCwgaGFuZGxlUHVzaFN0YXRlLCBpZ25vcmVTdGFjaywgaW5pdCwgbm93LCBvcHRpb25zLCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIHJlc3VsdCwgcnVuQW5pbWF0aW9uLCBzY2FsZXJzLCBzaG91bGRJZ25vcmVVUkwsIHNob3VsZFRyYWNrLCBzb3VyY2UsIHNvdXJjZXMsIHVuaVNjYWxlciwgX1dlYlNvY2tldCwgX1hEb21haW5SZXF1ZXN0LCBfWE1MSHR0cFJlcXVlc3QsIF9pLCBfaW50ZXJjZXB0LCBfbGVuLCBfcHVzaFN0YXRlLCBfcmVmLCBfcmVmMSwgX3JlcGxhY2VTdGF0ZSxcbiAgICBfX3NsaWNlID0gW10uc2xpY2UsXG4gICAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gICAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY2F0Y2h1cFRpbWU6IDEwMCxcbiAgICBpbml0aWFsUmF0ZTogLjAzLFxuICAgIG1pblRpbWU6IDI1MCxcbiAgICBnaG9zdFRpbWU6IDEwMCxcbiAgICBtYXhQcm9ncmVzc1BlckZyYW1lOiAyMCxcbiAgICBlYXNlRmFjdG9yOiAxLjI1LFxuICAgIHN0YXJ0T25QYWdlTG9hZDogdHJ1ZSxcbiAgICByZXN0YXJ0T25QdXNoU3RhdGU6IHRydWUsXG4gICAgcmVzdGFydE9uUmVxdWVzdEFmdGVyOiA1MDAsXG4gICAgdGFyZ2V0OiAnYm9keScsXG4gICAgZWxlbWVudHM6IHtcbiAgICAgIGNoZWNrSW50ZXJ2YWw6IDEwMCxcbiAgICAgIHNlbGVjdG9yczogWydib2R5J11cbiAgICB9LFxuICAgIGV2ZW50TGFnOiB7XG4gICAgICBtaW5TYW1wbGVzOiAxMCxcbiAgICAgIHNhbXBsZUNvdW50OiAzLFxuICAgICAgbGFnVGhyZXNob2xkOiAzXG4gICAgfSxcbiAgICBhamF4OiB7XG4gICAgICB0cmFja01ldGhvZHM6IFsnR0VUJ10sXG4gICAgICB0cmFja1dlYlNvY2tldHM6IHRydWUsXG4gICAgICBpZ25vcmVVUkxzOiBbXVxuICAgIH1cbiAgfTtcblxuICBub3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZjtcbiAgICByZXR1cm4gKF9yZWYgPSB0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwgPyB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIgPyBwZXJmb3JtYW5jZS5ub3coKSA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCA/IF9yZWYgOiArKG5ldyBEYXRlKTtcbiAgfTtcblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuXG4gIGlmIChyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT0gbnVsbCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmbiwgNTApO1xuICAgIH07XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG4gICAgfTtcbiAgfVxuXG4gIHJ1bkFuaW1hdGlvbiA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGxhc3QsIHRpY2s7XG4gICAgbGFzdCA9IG5vdygpO1xuICAgIHRpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkaWZmO1xuICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdDtcbiAgICAgIGlmIChkaWZmID49IDMzKSB7XG4gICAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgICAgcmV0dXJuIGZuKGRpZmYsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQodGljaywgMzMgLSBkaWZmKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB0aWNrKCk7XG4gIH07XG5cbiAgcmVzdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGtleSwgb2JqO1xuICAgIG9iaiA9IGFyZ3VtZW50c1swXSwga2V5ID0gYXJndW1lbnRzWzFdLCBhcmdzID0gMyA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiBbXTtcbiAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV0uYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH1cbiAgfTtcblxuICBleHRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIga2V5LCBvdXQsIHNvdXJjZSwgc291cmNlcywgdmFsLCBfaSwgX2xlbjtcbiAgICBvdXQgPSBhcmd1bWVudHNbMF0sIHNvdXJjZXMgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gc291cmNlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgc291cmNlID0gc291cmNlc1tfaV07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmICghX19oYXNQcm9wLmNhbGwoc291cmNlLCBrZXkpKSBjb250aW51ZTtcbiAgICAgICAgICB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICBpZiAoKG91dFtrZXldICE9IG51bGwpICYmIHR5cGVvZiBvdXRba2V5XSA9PT0gJ29iamVjdCcgJiYgKHZhbCAhPSBudWxsKSAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXh0ZW5kKG91dFtrZXldLCB2YWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRba2V5XSA9IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBhdmdBbXBsaXR1ZGUgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgY291bnQsIHN1bSwgdiwgX2ksIF9sZW47XG4gICAgc3VtID0gY291bnQgPSAwO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYXJyLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICB2ID0gYXJyW19pXTtcbiAgICAgIHN1bSArPSBNYXRoLmFicyh2KTtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICAgIHJldHVybiBzdW0gLyBjb3VudDtcbiAgfTtcblxuICBnZXRGcm9tRE9NID0gZnVuY3Rpb24oa2V5LCBqc29uKSB7XG4gICAgdmFyIGRhdGEsIGUsIGVsO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAga2V5ID0gJ29wdGlvbnMnO1xuICAgIH1cbiAgICBpZiAoanNvbiA9PSBudWxsKSB7XG4gICAgICBqc29uID0gdHJ1ZTtcbiAgICB9XG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtcGFjZS1cIiArIGtleSArIFwiXVwiKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhY2UtXCIgKyBrZXkpO1xuICAgIGlmICghanNvbikge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgIGUgPSBfZXJyb3I7XG4gICAgICByZXR1cm4gdHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIGlubGluZSBwYWNlIG9wdGlvbnNcIiwgZSkgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuXG4gIEV2ZW50ZWQgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRlZCgpIHt9XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyLCBjdHgsIG9uY2UpIHtcbiAgICAgIHZhciBfYmFzZTtcbiAgICAgIGlmIChvbmNlID09IG51bGwpIHtcbiAgICAgICAgb25jZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYmluZGluZ3MgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICB9XG4gICAgICBpZiAoKF9iYXNlID0gdGhpcy5iaW5kaW5ncylbZXZlbnRdID09IG51bGwpIHtcbiAgICAgICAgX2Jhc2VbZXZlbnRdID0gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5nc1tldmVudF0ucHVzaCh7XG4gICAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICAgIGN0eDogY3R4LFxuICAgICAgICBvbmNlOiBvbmNlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyLCBjdHgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9uKGV2ZW50LCBoYW5kbGVyLCBjdHgsIHRydWUpO1xuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudCwgaGFuZGxlcikge1xuICAgICAgdmFyIGksIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgaWYgKCgoX3JlZiA9IHRoaXMuYmluZGluZ3MpICE9IG51bGwgPyBfcmVmW2V2ZW50XSA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaGFuZGxlciA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5iaW5kaW5nc1tldmVudF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmJpbmRpbmdzW2V2ZW50XS5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodGhpcy5iaW5kaW5nc1tldmVudF1baV0uaGFuZGxlciA9PT0gaGFuZGxlcikge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmJpbmRpbmdzW2V2ZW50XS5zcGxpY2UoaSwgMSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIGN0eCwgZXZlbnQsIGhhbmRsZXIsIGksIG9uY2UsIF9yZWYsIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIGV2ZW50ID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgIGlmICgoX3JlZiA9IHRoaXMuYmluZGluZ3MpICE9IG51bGwgPyBfcmVmW2V2ZW50XSA6IHZvaWQgMCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmJpbmRpbmdzW2V2ZW50XS5sZW5ndGgpIHtcbiAgICAgICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3NbZXZlbnRdW2ldLCBoYW5kbGVyID0gX3JlZjEuaGFuZGxlciwgY3R4ID0gX3JlZjEuY3R4LCBvbmNlID0gX3JlZjEub25jZTtcbiAgICAgICAgICBoYW5kbGVyLmFwcGx5KGN0eCAhPSBudWxsID8gY3R4IDogdGhpcywgYXJncyk7XG4gICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5iaW5kaW5nc1tldmVudF0uc3BsaWNlKGksIDEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChpKyspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBFdmVudGVkO1xuXG4gIH0pKCk7XG5cbiAgUGFjZSA9IHdpbmRvdy5QYWNlIHx8IHt9O1xuXG4gIHdpbmRvdy5QYWNlID0gUGFjZTtcblxuICBleHRlbmQoUGFjZSwgRXZlbnRlZC5wcm90b3R5cGUpO1xuXG4gIG9wdGlvbnMgPSBQYWNlLm9wdGlvbnMgPSBleHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCB3aW5kb3cucGFjZU9wdGlvbnMsIGdldEZyb21ET00oKSk7XG5cbiAgX3JlZiA9IFsnYWpheCcsICdkb2N1bWVudCcsICdldmVudExhZycsICdlbGVtZW50cyddO1xuICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICBzb3VyY2UgPSBfcmVmW19pXTtcbiAgICBpZiAob3B0aW9uc1tzb3VyY2VdID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zW3NvdXJjZV0gPSBkZWZhdWx0T3B0aW9uc1tzb3VyY2VdO1xuICAgIH1cbiAgfVxuXG4gIE5vVGFyZ2V0RXJyb3IgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE5vVGFyZ2V0RXJyb3IsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBOb1RhcmdldEVycm9yKCkge1xuICAgICAgX3JlZjEgPSBOb1RhcmdldEVycm9yLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF9yZWYxO1xuICAgIH1cblxuICAgIHJldHVybiBOb1RhcmdldEVycm9yO1xuXG4gIH0pKEVycm9yKTtcblxuICBCYXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQmFyKCkge1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgfVxuXG4gICAgQmFyLnByb3RvdHlwZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdGFyZ2V0RWxlbWVudDtcbiAgICAgIGlmICh0aGlzLmVsID09IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICBpZiAoIXRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTm9UYXJnZXRFcnJvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NOYW1lID0gXCJwYWNlIHBhY2UtYWN0aXZlXCI7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgvcGFjZS1kb25lL2csICcnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBwYWNlLXJ1bm5pbmcnO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwicGFjZS1wcm9ncmVzc1wiPlxcbiAgPGRpdiBjbGFzcz1cInBhY2UtcHJvZ3Jlc3MtaW5uZXJcIj48L2Rpdj5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVwicGFjZS1hY3Rpdml0eVwiPjwvZGl2Pic7XG4gICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmZpcnN0Q2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgIHRhcmdldEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMuZWwsIHRhcmdldEVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWw7XG4gICAgICBlbCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoJ3BhY2UtYWN0aXZlJywgJycpO1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgcGFjZS1pbmFjdGl2ZSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoJ3BhY2UtcnVubmluZycsICcnKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtZG9uZSc7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ocHJvZykge1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2c7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZ2V0RWxlbWVudCgpKTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBOb1RhcmdldEVycm9yID0gX2Vycm9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWwgPSB2b2lkIDA7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwsIGtleSwgcHJvZ3Jlc3NTdHIsIHRyYW5zZm9ybSwgX2osIF9sZW4xLCBfcmVmMjtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMudGFyZ2V0KSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICB0cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKFwiICsgdGhpcy5wcm9ncmVzcyArIFwiJSwgMCwgMClcIjtcbiAgICAgIF9yZWYyID0gWyd3ZWJraXRUcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nLCAndHJhbnNmb3JtJ107XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAga2V5ID0gX3JlZjJbX2pdO1xuICAgICAgICBlbC5jaGlsZHJlblswXS5zdHlsZVtrZXldID0gdHJhbnNmb3JtO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzIHx8IHRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgfCAwICE9PSB0aGlzLnByb2dyZXNzIHwgMCkge1xuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MtdGV4dCcsIFwiXCIgKyAodGhpcy5wcm9ncmVzcyB8IDApICsgXCIlXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ncmVzcyA+PSAxMDApIHtcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9ICc5OSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgPSB0aGlzLnByb2dyZXNzIDwgMTAgPyBcIjBcIiA6IFwiXCI7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgKz0gdGhpcy5wcm9ncmVzcyB8IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdkYXRhLXByb2dyZXNzJywgXCJcIiArIHByb2dyZXNzU3RyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcyA+PSAxMDA7XG4gICAgfTtcblxuICAgIHJldHVybiBCYXI7XG5cbiAgfSkoKTtcblxuICBFdmVudHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRzKCkge1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgIH1cblxuICAgIEV2ZW50cy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9qLCBfbGVuMSwgX3JlZjIsIF9yZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuYmluZGluZ3NbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICBfcmVmMiA9IHRoaXMuYmluZGluZ3NbbmFtZV07XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGJpbmRpbmcgPSBfcmVmMltfal07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLmNhbGwodGhpcywgdmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFdmVudHMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICAgIHZhciBfYmFzZTtcbiAgICAgIGlmICgoX2Jhc2UgPSB0aGlzLmJpbmRpbmdzKVtuYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIF9iYXNlW25hbWVdID0gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5nc1tuYW1lXS5wdXNoKGZuKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50cztcblxuICB9KSgpO1xuXG4gIF9YTUxIdHRwUmVxdWVzdCA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcblxuICBfWERvbWFpblJlcXVlc3QgPSB3aW5kb3cuWERvbWFpblJlcXVlc3Q7XG5cbiAgX1dlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQ7XG5cbiAgZXh0ZW5kTmF0aXZlID0gZnVuY3Rpb24odG8sIGZyb20pIHtcbiAgICB2YXIgZSwga2V5LCBfcmVzdWx0cztcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoa2V5IGluIGZyb20ucHJvdG90eXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoKHRvW2tleV0gPT0gbnVsbCkgJiYgdHlwZW9mIGZyb21ba2V5XSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICh0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywga2V5LCB7XG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb20ucHJvdG90eXBlW2tleV07XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRvW2tleV0gPSBmcm9tLnByb3RvdHlwZVtrZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgZSA9IF9lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIGlnbm9yZVN0YWNrID0gW107XG5cbiAgUGFjZS5pZ25vcmUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywgZm4sIHJldDtcbiAgICBmbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgaWdub3JlU3RhY2sudW5zaGlmdCgnaWdub3JlJyk7XG4gICAgcmV0ID0gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgaWdub3JlU3RhY2suc2hpZnQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFBhY2UudHJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywgZm4sIHJldDtcbiAgICBmbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgaWdub3JlU3RhY2sudW5zaGlmdCgndHJhY2snKTtcbiAgICByZXQgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgc2hvdWxkVHJhY2sgPSBmdW5jdGlvbihtZXRob2QpIHtcbiAgICB2YXIgX3JlZjI7XG4gICAgaWYgKG1ldGhvZCA9PSBudWxsKSB7XG4gICAgICBtZXRob2QgPSAnR0VUJztcbiAgICB9XG4gICAgaWYgKGlnbm9yZVN0YWNrWzBdID09PSAndHJhY2snKSB7XG4gICAgICByZXR1cm4gJ2ZvcmNlJztcbiAgICB9XG4gICAgaWYgKCFpZ25vcmVTdGFjay5sZW5ndGggJiYgb3B0aW9ucy5hamF4KSB7XG4gICAgICBpZiAobWV0aG9kID09PSAnc29ja2V0JyAmJiBvcHRpb25zLmFqYXgudHJhY2tXZWJTb2NrZXRzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChfcmVmMiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfX2luZGV4T2YuY2FsbChvcHRpb25zLmFqYXgudHJhY2tNZXRob2RzLCBfcmVmMikgPj0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIFJlcXVlc3RJbnRlcmNlcHQgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFJlcXVlc3RJbnRlcmNlcHQsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBSZXF1ZXN0SW50ZXJjZXB0KCkge1xuICAgICAgdmFyIG1vbml0b3JYSFIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIFJlcXVlc3RJbnRlcmNlcHQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBtb25pdG9yWEhSID0gZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHZhciBfb3BlbjtcbiAgICAgICAgX29wZW4gPSByZXEub3BlbjtcbiAgICAgICAgcmV0dXJuIHJlcS5vcGVuID0gZnVuY3Rpb24odHlwZSwgdXJsLCBhc3luYykge1xuICAgICAgICAgIGlmIChzaG91bGRUcmFjayh0eXBlKSkge1xuICAgICAgICAgICAgX3RoaXMudHJpZ2dlcigncmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfb3Blbi5hcHBseShyZXEsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgd2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gZnVuY3Rpb24oZmxhZ3MpIHtcbiAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgcmVxID0gbmV3IF9YTUxIdHRwUmVxdWVzdChmbGFncyk7XG4gICAgICAgIG1vbml0b3JYSFIocmVxKTtcbiAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgIH07XG4gICAgICB0cnkge1xuICAgICAgICBleHRlbmROYXRpdmUod2luZG93LlhNTEh0dHBSZXF1ZXN0LCBfWE1MSHR0cFJlcXVlc3QpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgaWYgKF9YRG9tYWluUmVxdWVzdCAhPSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgcmVxID0gbmV3IF9YRG9tYWluUmVxdWVzdDtcbiAgICAgICAgICBtb25pdG9yWEhSKHJlcSk7XG4gICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHRlbmROYXRpdmUod2luZG93LlhEb21haW5SZXF1ZXN0LCBfWERvbWFpblJlcXVlc3QpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICB9XG4gICAgICBpZiAoKF9XZWJTb2NrZXQgIT0gbnVsbCkgJiYgb3B0aW9ucy5hamF4LnRyYWNrV2ViU29ja2V0cykge1xuICAgICAgICB3aW5kb3cuV2ViU29ja2V0ID0gZnVuY3Rpb24odXJsLCBwcm90b2NvbHMpIHtcbiAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgIGlmIChwcm90b2NvbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmVxID0gbmV3IF9XZWJTb2NrZXQodXJsLCBwcm90b2NvbHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2hvdWxkVHJhY2soJ3NvY2tldCcpKSB7XG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiAnc29ja2V0JyxcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgIHByb3RvY29sczogcHJvdG9jb2xzLFxuICAgICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuV2ViU29ja2V0LCBfV2ViU29ja2V0KTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZXF1ZXN0SW50ZXJjZXB0O1xuXG4gIH0pKEV2ZW50cyk7XG5cbiAgX2ludGVyY2VwdCA9IG51bGw7XG5cbiAgZ2V0SW50ZXJjZXB0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKF9pbnRlcmNlcHQgPT0gbnVsbCkge1xuICAgICAgX2ludGVyY2VwdCA9IG5ldyBSZXF1ZXN0SW50ZXJjZXB0O1xuICAgIH1cbiAgICByZXR1cm4gX2ludGVyY2VwdDtcbiAgfTtcblxuICBzaG91bGRJZ25vcmVVUkwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgcGF0dGVybiwgX2osIF9sZW4xLCBfcmVmMjtcbiAgICBfcmVmMiA9IG9wdGlvbnMuYWpheC5pZ25vcmVVUkxzO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgcGF0dGVybiA9IF9yZWYyW19qXTtcbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKHBhdHRlcm4pICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGF0dGVybi50ZXN0KHVybCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgZ2V0SW50ZXJjZXB0KCkub24oJ3JlcXVlc3QnLCBmdW5jdGlvbihfYXJnKSB7XG4gICAgdmFyIGFmdGVyLCBhcmdzLCByZXF1ZXN0LCB0eXBlLCB1cmw7XG4gICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XG4gICAgaWYgKHNob3VsZElnbm9yZVVSTCh1cmwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghUGFjZS5ydW5uaW5nICYmIChvcHRpb25zLnJlc3RhcnRPblJlcXVlc3RBZnRlciAhPT0gZmFsc2UgfHwgc2hvdWxkVHJhY2sodHlwZSkgPT09ICdmb3JjZScpKSB7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgYWZ0ZXIgPSBvcHRpb25zLnJlc3RhcnRPblJlcXVlc3RBZnRlciB8fCAwO1xuICAgICAgaWYgKHR5cGVvZiBhZnRlciA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIGFmdGVyID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RpbGxBY3RpdmUsIF9qLCBfbGVuMSwgX3JlZjIsIF9yZWYzLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XG4gICAgICAgICAgc3RpbGxBY3RpdmUgPSByZXF1ZXN0LnJlYWR5U3RhdGUgPCAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0aWxsQWN0aXZlID0gKDAgPCAoX3JlZjIgPSByZXF1ZXN0LnJlYWR5U3RhdGUpICYmIF9yZWYyIDwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0aWxsQWN0aXZlKSB7XG4gICAgICAgICAgUGFjZS5yZXN0YXJ0KCk7XG4gICAgICAgICAgX3JlZjMgPSBQYWNlLnNvdXJjZXM7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IF9yZWYzW19qXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBamF4TW9uaXRvcikge1xuICAgICAgICAgICAgICBzb3VyY2Uud2F0Y2guYXBwbHkoc291cmNlLCBhcmdzKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSwgYWZ0ZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgQWpheE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQWpheE1vbml0b3IoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgICAgZ2V0SW50ZXJjZXB0KCkub24oJ3JlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLndhdGNoLmFwcGx5KF90aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgQWpheE1vbml0b3IucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24oX2FyZykge1xuICAgICAgdmFyIHJlcXVlc3QsIHRyYWNrZXIsIHR5cGUsIHVybDtcbiAgICAgIHR5cGUgPSBfYXJnLnR5cGUsIHJlcXVlc3QgPSBfYXJnLnJlcXVlc3QsIHVybCA9IF9hcmcudXJsO1xuICAgICAgaWYgKHNob3VsZElnbm9yZVVSTCh1cmwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnc29ja2V0Jykge1xuICAgICAgICB0cmFja2VyID0gbmV3IFNvY2tldFJlcXVlc3RUcmFja2VyKHJlcXVlc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2tlciA9IG5ldyBYSFJSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzLnB1c2godHJhY2tlcik7XG4gICAgfTtcblxuICAgIHJldHVybiBBamF4TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIFhIUlJlcXVlc3RUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFhIUlJlcXVlc3RUcmFja2VyKHJlcXVlc3QpIHtcbiAgICAgIHZhciBldmVudCwgc2l6ZSwgX2osIF9sZW4xLCBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBpZiAod2luZG93LlByb2dyZXNzRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBzaXplID0gbnVsbDtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gX3RoaXMucHJvZ3Jlc3MgKyAoMTAwIC0gX3RoaXMucHJvZ3Jlc3MpIC8gMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgX3JlZjIgPSBbJ2xvYWQnLCAnYWJvcnQnLCAndGltZW91dCcsICdlcnJvciddO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBldmVudCA9IF9yZWYyW19qXTtcbiAgICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX29ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfcmVmMztcbiAgICAgICAgICBpZiAoKF9yZWYzID0gcmVxdWVzdC5yZWFkeVN0YXRlKSA9PT0gMCB8fCBfcmVmMyA9PT0gNCkge1xuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDMpIHtcbiAgICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gNTA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBYSFJSZXF1ZXN0VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIFNvY2tldFJlcXVlc3RUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFNvY2tldFJlcXVlc3RUcmFja2VyKHJlcXVlc3QpIHtcbiAgICAgIHZhciBldmVudCwgX2osIF9sZW4xLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBfcmVmMiA9IFsnZXJyb3InLCAnb3BlbiddO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBTb2NrZXRSZXF1ZXN0VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIEVsZW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEVsZW1lbnRNb25pdG9yKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxlY3RvciwgX2osIF9sZW4xLCBfcmVmMjtcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0b3JzID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3RvcnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIF9yZWYyID0gb3B0aW9ucy5zZWxlY3RvcnM7XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgc2VsZWN0b3IgPSBfcmVmMltfal07XG4gICAgICAgIHRoaXMuZWxlbWVudHMucHVzaChuZXcgRWxlbWVudFRyYWNrZXIoc2VsZWN0b3IpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gRWxlbWVudE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBFbGVtZW50VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbGVtZW50VHJhY2tlcihzZWxlY3Rvcikge1xuICAgICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICB0aGlzLmNoZWNrKCk7XG4gICAgfVxuXG4gICAgRWxlbWVudFRyYWNrZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5jaGVjaygpO1xuICAgICAgICB9KSwgb3B0aW9ucy5lbGVtZW50cy5jaGVja0ludGVydmFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRWxlbWVudFRyYWNrZXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID0gMTAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gRWxlbWVudFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBEb2N1bWVudE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgRG9jdW1lbnRNb25pdG9yLnByb3RvdHlwZS5zdGF0ZXMgPSB7XG4gICAgICBsb2FkaW5nOiAwLFxuICAgICAgaW50ZXJhY3RpdmU6IDUwLFxuICAgICAgY29tcGxldGU6IDEwMFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBEb2N1bWVudE1vbml0b3IoKSB7XG4gICAgICB2YXIgX29ucmVhZHlzdGF0ZWNoYW5nZSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAoX3JlZjIgPSB0aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXSkgIT0gbnVsbCA/IF9yZWYyIDogMTAwO1xuICAgICAgX29ucmVhZHlzdGF0ZWNoYW5nZSA9IGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdICE9IG51bGwpIHtcbiAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IF90aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPT09IFwiZnVuY3Rpb25cIiA/IF9vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIERvY3VtZW50TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIEV2ZW50TGFnTW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudExhZ01vbml0b3IoKSB7XG4gICAgICB2YXIgYXZnLCBpbnRlcnZhbCwgbGFzdCwgcG9pbnRzLCBzYW1wbGVzLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIGF2ZyA9IDA7XG4gICAgICBzYW1wbGVzID0gW107XG4gICAgICBwb2ludHMgPSAwO1xuICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRpZmY7XG4gICAgICAgIGRpZmYgPSBub3coKSAtIGxhc3QgLSA1MDtcbiAgICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgICBzYW1wbGVzLnB1c2goZGlmZik7XG4gICAgICAgIGlmIChzYW1wbGVzLmxlbmd0aCA+IG9wdGlvbnMuZXZlbnRMYWcuc2FtcGxlQ291bnQpIHtcbiAgICAgICAgICBzYW1wbGVzLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYXZnID0gYXZnQW1wbGl0dWRlKHNhbXBsZXMpO1xuICAgICAgICBpZiAoKytwb2ludHMgPj0gb3B0aW9ucy5ldmVudExhZy5taW5TYW1wbGVzICYmIGF2ZyA8IG9wdGlvbnMuZXZlbnRMYWcubGFnVGhyZXNob2xkKSB7XG4gICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgcmV0dXJuIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMCAqICgzIC8gKGF2ZyArIDMpKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH1cblxuICAgIHJldHVybiBFdmVudExhZ01vbml0b3I7XG5cbiAgfSkoKTtcblxuICBTY2FsZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU2NhbGVyKHNvdXJjZSkge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLmxhc3QgPSB0aGlzLnNpbmNlTGFzdFVwZGF0ZSA9IDA7XG4gICAgICB0aGlzLnJhdGUgPSBvcHRpb25zLmluaXRpYWxSYXRlO1xuICAgICAgdGhpcy5jYXRjaHVwID0gMDtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmxhc3RQcm9ncmVzcyA9IDA7XG4gICAgICBpZiAodGhpcy5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gcmVzdWx0KHRoaXMuc291cmNlLCAncHJvZ3Jlc3MnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTY2FsZXIucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbihmcmFtZVRpbWUsIHZhbCkge1xuICAgICAgdmFyIHNjYWxpbmc7XG4gICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgdmFsID0gcmVzdWx0KHRoaXMuc291cmNlLCAncHJvZ3Jlc3MnKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPj0gMTAwKSB7XG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodmFsID09PSB0aGlzLmxhc3QpIHtcbiAgICAgICAgdGhpcy5zaW5jZUxhc3RVcGRhdGUgKz0gZnJhbWVUaW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuc2luY2VMYXN0VXBkYXRlKSB7XG4gICAgICAgICAgdGhpcy5yYXRlID0gKHZhbCAtIHRoaXMubGFzdCkgLyB0aGlzLnNpbmNlTGFzdFVwZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhdGNodXAgPSAodmFsIC0gdGhpcy5wcm9ncmVzcykgLyBvcHRpb25zLmNhdGNodXBUaW1lO1xuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSA9IDA7XG4gICAgICAgIHRoaXMubGFzdCA9IHZhbDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPiB0aGlzLnByb2dyZXNzKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgKz0gdGhpcy5jYXRjaHVwICogZnJhbWVUaW1lO1xuICAgICAgfVxuICAgICAgc2NhbGluZyA9IDEgLSBNYXRoLnBvdyh0aGlzLnByb2dyZXNzIC8gMTAwLCBvcHRpb25zLmVhc2VGYWN0b3IpO1xuICAgICAgdGhpcy5wcm9ncmVzcyArPSBzY2FsaW5nICogdGhpcy5yYXRlICogZnJhbWVUaW1lO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKHRoaXMubGFzdFByb2dyZXNzICsgb3B0aW9ucy5tYXhQcm9ncmVzc1BlckZyYW1lLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1heCgwLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5sYXN0UHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3M7XG4gICAgfTtcblxuICAgIHJldHVybiBTY2FsZXI7XG5cbiAgfSkoKTtcblxuICBzb3VyY2VzID0gbnVsbDtcblxuICBzY2FsZXJzID0gbnVsbDtcblxuICBiYXIgPSBudWxsO1xuXG4gIHVuaVNjYWxlciA9IG51bGw7XG5cbiAgYW5pbWF0aW9uID0gbnVsbDtcblxuICBjYW5jZWxBbmltYXRpb24gPSBudWxsO1xuXG4gIFBhY2UucnVubmluZyA9IGZhbHNlO1xuXG4gIGhhbmRsZVB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChvcHRpb25zLnJlc3RhcnRPblB1c2hTdGF0ZSkge1xuICAgICAgcmV0dXJuIFBhY2UucmVzdGFydCgpO1xuICAgIH1cbiAgfTtcblxuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICE9IG51bGwpIHtcbiAgICBfcHVzaFN0YXRlID0gd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlO1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICByZXR1cm4gX3B1c2hTdGF0ZS5hcHBseSh3aW5kb3cuaGlzdG9yeSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSAhPSBudWxsKSB7XG4gICAgX3JlcGxhY2VTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZTtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgICAgcmV0dXJuIF9yZXBsYWNlU3RhdGUuYXBwbHkod2luZG93Lmhpc3RvcnksIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIFNPVVJDRV9LRVlTID0ge1xuICAgIGFqYXg6IEFqYXhNb25pdG9yLFxuICAgIGVsZW1lbnRzOiBFbGVtZW50TW9uaXRvcixcbiAgICBkb2N1bWVudDogRG9jdW1lbnRNb25pdG9yLFxuICAgIGV2ZW50TGFnOiBFdmVudExhZ01vbml0b3JcbiAgfTtcblxuICAoaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0eXBlLCBfaiwgX2ssIF9sZW4xLCBfbGVuMiwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcbiAgICBQYWNlLnNvdXJjZXMgPSBzb3VyY2VzID0gW107XG4gICAgX3JlZjIgPSBbJ2FqYXgnLCAnZWxlbWVudHMnLCAnZG9jdW1lbnQnLCAnZXZlbnRMYWcnXTtcbiAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgIHR5cGUgPSBfcmVmMltfal07XG4gICAgICBpZiAob3B0aW9uc1t0eXBlXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgc291cmNlcy5wdXNoKG5ldyBTT1VSQ0VfS0VZU1t0eXBlXShvcHRpb25zW3R5cGVdKSk7XG4gICAgICB9XG4gICAgfVxuICAgIF9yZWY0ID0gKF9yZWYzID0gb3B0aW9ucy5leHRyYVNvdXJjZXMpICE9IG51bGwgPyBfcmVmMyA6IFtdO1xuICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWY0Lmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgc291cmNlID0gX3JlZjRbX2tdO1xuICAgICAgc291cmNlcy5wdXNoKG5ldyBzb3VyY2Uob3B0aW9ucykpO1xuICAgIH1cbiAgICBQYWNlLmJhciA9IGJhciA9IG5ldyBCYXI7XG4gICAgc2NhbGVycyA9IFtdO1xuICAgIHJldHVybiB1bmlTY2FsZXIgPSBuZXcgU2NhbGVyO1xuICB9KSgpO1xuXG4gIFBhY2Uuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhY2UudHJpZ2dlcignc3RvcCcpO1xuICAgIFBhY2UucnVubmluZyA9IGZhbHNlO1xuICAgIGJhci5kZXN0cm95KCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICBpZiAoYW5pbWF0aW9uICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2YgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xuICAgICAgfVxuICAgICAgYW5pbWF0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQoKTtcbiAgfTtcblxuICBQYWNlLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBQYWNlLnRyaWdnZXIoJ3Jlc3RhcnQnKTtcbiAgICBQYWNlLnN0b3AoKTtcbiAgICByZXR1cm4gUGFjZS5zdGFydCgpO1xuICB9O1xuXG4gIFBhY2UuZ28gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhcnQ7XG4gICAgUGFjZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICBiYXIucmVuZGVyKCk7XG4gICAgc3RhcnQgPSBub3coKTtcbiAgICBjYW5jZWxBbmltYXRpb24gPSBmYWxzZTtcbiAgICByZXR1cm4gYW5pbWF0aW9uID0gcnVuQW5pbWF0aW9uKGZ1bmN0aW9uKGZyYW1lVGltZSwgZW5xdWV1ZU5leHRGcmFtZSkge1xuICAgICAgdmFyIGF2ZywgY291bnQsIGRvbmUsIGVsZW1lbnQsIGVsZW1lbnRzLCBpLCBqLCByZW1haW5pbmcsIHNjYWxlciwgc2NhbGVyTGlzdCwgc3VtLCBfaiwgX2ssIF9sZW4xLCBfbGVuMiwgX3JlZjI7XG4gICAgICByZW1haW5pbmcgPSAxMDAgLSBiYXIucHJvZ3Jlc3M7XG4gICAgICBjb3VudCA9IHN1bSA9IDA7XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIGZvciAoaSA9IF9qID0gMCwgX2xlbjEgPSBzb3VyY2VzLmxlbmd0aDsgX2ogPCBfbGVuMTsgaSA9ICsrX2opIHtcbiAgICAgICAgc291cmNlID0gc291cmNlc1tpXTtcbiAgICAgICAgc2NhbGVyTGlzdCA9IHNjYWxlcnNbaV0gIT0gbnVsbCA/IHNjYWxlcnNbaV0gOiBzY2FsZXJzW2ldID0gW107XG4gICAgICAgIGVsZW1lbnRzID0gKF9yZWYyID0gc291cmNlLmVsZW1lbnRzKSAhPSBudWxsID8gX3JlZjIgOiBbc291cmNlXTtcbiAgICAgICAgZm9yIChqID0gX2sgPSAwLCBfbGVuMiA9IGVsZW1lbnRzLmxlbmd0aDsgX2sgPCBfbGVuMjsgaiA9ICsrX2spIHtcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudHNbal07XG4gICAgICAgICAgc2NhbGVyID0gc2NhbGVyTGlzdFtqXSAhPSBudWxsID8gc2NhbGVyTGlzdFtqXSA6IHNjYWxlckxpc3Rbal0gPSBuZXcgU2NhbGVyKGVsZW1lbnQpO1xuICAgICAgICAgIGRvbmUgJj0gc2NhbGVyLmRvbmU7XG4gICAgICAgICAgaWYgKHNjYWxlci5kb25lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICBzdW0gKz0gc2NhbGVyLnRpY2soZnJhbWVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXZnID0gc3VtIC8gY291bnQ7XG4gICAgICBiYXIudXBkYXRlKHVuaVNjYWxlci50aWNrKGZyYW1lVGltZSwgYXZnKSk7XG4gICAgICBpZiAoYmFyLmRvbmUoKSB8fCBkb25lIHx8IGNhbmNlbEFuaW1hdGlvbikge1xuICAgICAgICBiYXIudXBkYXRlKDEwMCk7XG4gICAgICAgIFBhY2UudHJpZ2dlcignZG9uZScpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBiYXIuZmluaXNoKCk7XG4gICAgICAgICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIFBhY2UudHJpZ2dlcignaGlkZScpO1xuICAgICAgICB9LCBNYXRoLm1heChvcHRpb25zLmdob3N0VGltZSwgTWF0aC5tYXgob3B0aW9ucy5taW5UaW1lIC0gKG5vdygpIC0gc3RhcnQpLCAwKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVucXVldWVOZXh0RnJhbWUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBQYWNlLnN0YXJ0ID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgICBleHRlbmQob3B0aW9ucywgX29wdGlvbnMpO1xuICAgIFBhY2UucnVubmluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGJhci5yZW5kZXIoKTtcbiAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XG4gICAgfVxuICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhY2UnKSkge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoUGFjZS5zdGFydCwgNTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBQYWNlLnRyaWdnZXIoJ3N0YXJ0Jyk7XG4gICAgICByZXR1cm4gUGFjZS5nbygpO1xuICAgIH1cbiAgfTtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsncGFjZSddLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYWNlO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gUGFjZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob3B0aW9ucy5zdGFydE9uUGFnZUxvYWQpIHtcbiAgICAgIFBhY2Uuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAvLyBUaW55IFNsaWRlci5cbiAgdG5zKHtcbiAgICBjb250YWluZXI6ICcudGVzdGltb25pYWxzIC52aWV3LWNvbnRlbnQnLFxuICAgIGNlbnRlcjogdHJ1ZSxcbiAgICBpdGVtczogMSxcbiAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6IHRydWUsXG4gICAgcmVzcG9uc2l2ZToge1xuICAgICAgNzY4OiB7XG4gICAgICAgIGl0ZW1zOiAyXG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBBZGQgdGhlIHNhbWUgaGVpZ2h0IHRvIGFsbCBlbGVtZW50cy5cbiAgbGV0IHRlc3RpbW9uaWFscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZXN0aW1vbmlhbHMgLnRlc3RpbW9uaWFsJyk7XG4gIGxldCB0YWxsZXN0ID0gMDtcblxuICAvLyBMb29wIHRocm91Z2ggdG8gZmluZCB0YWxsZXN0IGVsZW1lbnQuXG4gIFsuLi50ZXN0aW1vbmlhbHNdLmZvckVhY2godGVzdGltb25pYWwgPT4ge1xuICAgIGNvbnN0IGhlaWdodCA9IHRlc3RpbW9uaWFsLm9mZnNldEhlaWdodDtcblxuICAgIGlmIChoZWlnaHQgPiB0YWxsZXN0KSB7XG4gICAgICB0YWxsZXN0ID0gaGVpZ2h0O1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQXBwbHkgdGFsbGVzdCBoZWlnaHQgdG8gYWxsIHRlc3RpbW9uaWFscy5cbiAgWy4uLnRlc3RpbW9uaWFsc10uZm9yRWFjaCh0ZXN0aW1vbmlhbCA9PiB7XG4gICAgdGVzdGltb25pYWwuc3R5bGUubWluSGVpZ2h0ID0gYCR7dGFsbGVzdH1weGA7XG4gIH0pO1xufSkoKTtcbiIsImNvbnN0IGhhbmRsZVRvZ2dsZSA9IChldmVudCkgPT4ge1xuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICB2YXIgcGFyZW50Tm9kZSA9IHRhcmdldC5jbG9zZXN0KCcuZmFxLWl0ZW0nKTtcblxuICBwYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbn07XG5cbi8vIEFkZCBldmVudExpc3RlbmVycy5cbnZhciB0b2dnbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWZhcS1pdGVtLXRvZ2dsZScpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIGl0ZW0gPSB0b2dnbGVzW2ldO1xuXG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVUb2dnbGUpO1xufVxuIiwiKGZ1bmN0aW9uKCkge1xuICBjb25zdCBmYWtlU3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgdmFyIHBhcmVudEZvcm0gPSB0YXJnZXQuY2xvc2VzdCgnZm9ybScpO1xuXG4gICAgcGFyZW50Rm9ybS5zdWJtaXQoKTtcbiAgfTtcblxuICBjb25zdCBoaWdobGlnaHQgPSAoZXZlbnQpID0+IHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciB3cmFwcGVyID0gdGFyZ2V0LmNsb3Nlc3QoJy5wYXJhZ3JhcGgtLXR5cGUtLXBhY2thZ2UtY2hvb3NlcicpO1xuICAgIHZhciBjb250YWluZXIgPSB0YXJnZXQuY2xvc2VzdCgnLnBhY2thZ2Utc2VsZWN0b3InKTtcbiAgICB2YXIgc2VsZWN0b3JzID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCcucGFja2FnZS1zZWxlY3RvcicpO1xuXG4gICAgLy8gUmVtb3ZlIGNsYXNzIGZyb20gYWxsIG90aGVyIGNvbnRhaW5lcnMuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWxlY3RvciA9IHNlbGVjdG9yc1tpXTtcblxuICAgICAgc2VsZWN0b3IuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0ZWQnKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgY2xhc3MgdG8gY29udGFpbmVyLlxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKCdoaWdobGlnaHRlZCcpO1xuICB9O1xuXG4gIC8vIEFkZCBldmVudExpc3RlbmVycy5cbiAgdmFyIGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFyYWdyYXBoLS10eXBlLS1wYWNrYWdlLWNob29zZXIgLmZpZWxkLS1uYW1lLWZpZWxkLWxpbmsgYScpO1xuICB2YXIgcmFkaW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhcmFncmFwaC0tdHlwZS0tcGFja2FnZS1jaG9vc2VyIGlucHV0W25hbWU9XCJkZWNyZXRvX3Bha2tlX2R1X3ZhZWxnZXJcIl0nKTtcblxuICAvLyBCdXR0b25zLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnV0dG9uID0gYnV0dG9uc1tpXTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZha2VTdWJtaXQpO1xuICB9XG5cbiAgLy8gUmFkaW9zLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByYWRpbyA9IHJhZGlvc1tpXTtcblxuICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhpZ2hsaWdodCk7XG4gIH1cbn0pKCk7XG4iLCJqUXVlcnkoZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEZsZXh5IGhlYWRlclxuICBmbGV4eV9oZWFkZXIuaW5pdCgpO1xuXG4gIC8vIFNpZHJcbiAgJCgnLnNsaW5reS1tZW51JylcbiAgICAuZmluZCgndWwsIGxpLCBhJylcbiAgICAucmVtb3ZlQ2xhc3MoKTtcblxuICAkKCcuc2lkci10b2dnbGUtLXJpZ2h0Jykuc2lkcih7XG4gICAgbmFtZTogJ3NpZHItbWFpbicsXG4gICAgc2lkZTogJ3JpZ2h0JyxcbiAgICByZW5hbWluZzogZmFsc2UsXG4gICAgYm9keTogJy5sYXlvdXRfX3dyYXBwZXInLFxuICAgIHNvdXJjZTogJy5zaWRyLXNvdXJjZS1wcm92aWRlcidcbiAgfSk7XG5cbiAgLy8gRW5hYmxlIHRvb2x0aXBzLlxuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuXG4gIC8vIEV4cGxhaW5lcnMuXG4gIHRucyh7XG4gICAgY29udGFpbmVyOiAnLmV4cGxhaW5lcnMgLnZpZXctY29udGVudCcsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIGl0ZW1zOiAxLFxuICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZVxuICB9KTtcbn0pO1xuIl19
