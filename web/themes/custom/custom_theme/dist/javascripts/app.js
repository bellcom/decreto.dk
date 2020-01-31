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
    items: 1,
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
      768: {
        items: 2
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbnktc2xpZGVyLmpzIiwiYm9vdHN0cmFwLmpzIiwiZmxleHktaGVhZGVyLmpzIiwiZmxleHktbmF2aWdhdGlvbi5qcyIsImpxdWVyeS5zaWRyLmpzIiwianF1ZXJ5LnNsaW5reS5qcyIsInBhY2UuanMiLCJmYXEtaXRlbXMuanMiLCJwYWNrYWdlLWNob29zZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOlsidG5zIiwiT2JqZWN0Iiwia2V5cyIsIm9iamVjdCIsIm5hbWUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJwdXNoIiwiRWxlbWVudCIsInJlbW92ZSIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIndpbiIsIndpbmRvdyIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2IiLCJzZXRUaW1lb3V0Iiwid2luJDEiLCJjYWYiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaWQiLCJjbGVhclRpbWVvdXQiLCJleHRlbmQiLCJvYmoiLCJjb3B5IiwidGFyZ2V0IiwiYXJndW1lbnRzIiwiaSIsImxlbmd0aCIsInVuZGVmaW5lZCIsImNoZWNrU3RvcmFnZVZhbHVlIiwidmFsdWUiLCJpbmRleE9mIiwiSlNPTiIsInBhcnNlIiwic2V0TG9jYWxTdG9yYWdlIiwic3RvcmFnZSIsImtleSIsImFjY2VzcyIsInNldEl0ZW0iLCJlIiwiZ2V0U2xpZGVJZCIsInRuc0lkIiwiZ2V0Qm9keSIsImRvYyIsImRvY3VtZW50IiwiYm9keSIsImNyZWF0ZUVsZW1lbnQiLCJmYWtlIiwiZG9jRWxlbWVudCIsImRvY3VtZW50RWxlbWVudCIsInNldEZha2VCb2R5IiwiZG9jT3ZlcmZsb3ciLCJzdHlsZSIsIm92ZXJmbG93IiwiYmFja2dyb3VuZCIsImFwcGVuZENoaWxkIiwicmVzZXRGYWtlQm9keSIsIm9mZnNldEhlaWdodCIsImNhbGMiLCJkaXYiLCJyZXN1bHQiLCJzdHIiLCJ2YWxzIiwidmFsIiwid2lkdGgiLCJvZmZzZXRXaWR0aCIsInJlcGxhY2UiLCJwZXJjZW50YWdlTGF5b3V0Iiwid3JhcHBlciIsIm91dGVyIiwiY291bnQiLCJwZXJQYWdlIiwic3VwcG9ydGVkIiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiTWF0aCIsImFicyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJjaGlsZHJlbiIsIm1lZGlhcXVlcnlTdXBwb3J0IiwicnVsZSIsInBvc2l0aW9uIiwidHlwZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwiY3JlYXRlU3R5bGVTaGVldCIsIm1lZGlhIiwic2V0QXR0cmlidXRlIiwicXVlcnlTZWxlY3RvciIsInNoZWV0IiwiYWRkQ1NTUnVsZSIsInNlbGVjdG9yIiwicnVsZXMiLCJpbmRleCIsImluc2VydFJ1bGUiLCJhZGRSdWxlIiwicmVtb3ZlQ1NTUnVsZSIsImRlbGV0ZVJ1bGUiLCJyZW1vdmVSdWxlIiwiZ2V0Q3NzUnVsZXNMZW5ndGgiLCJjc3NSdWxlcyIsInRvRGVncmVlIiwieSIsIngiLCJhdGFuMiIsIlBJIiwiZ2V0VG91Y2hEaXJlY3Rpb24iLCJhbmdsZSIsInJhbmdlIiwiZGlyZWN0aW9uIiwiZ2FwIiwiZm9yRWFjaCIsImFyciIsImNhbGxiYWNrIiwic2NvcGUiLCJsIiwiY2xhc3NMaXN0U3VwcG9ydCIsImhhc0NsYXNzIiwiZWwiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZENsYXNzIiwiYWRkIiwicmVtb3ZlQ2xhc3MiLCJoYXNBdHRyIiwiYXR0ciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJpc05vZGVMaXN0IiwiaXRlbSIsInNldEF0dHJzIiwiZWxzIiwiYXR0cnMiLCJBcnJheSIsInRvU3RyaW5nIiwicmVtb3ZlQXR0cnMiLCJhdHRyTGVuZ3RoIiwiaiIsInJlbW92ZUF0dHJpYnV0ZSIsImFycmF5RnJvbU5vZGVMaXN0IiwibmwiLCJoaWRlRWxlbWVudCIsImZvcmNlSGlkZSIsImRpc3BsYXkiLCJzaG93RWxlbWVudCIsImlzVmlzaWJsZSIsIndoaWNoUHJvcGVydHkiLCJwcm9wcyIsIlByb3BzIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJwcmVmaXhlcyIsInByZWZpeCIsImxlbiIsInByb3AiLCJoYXMzRFRyYW5zZm9ybXMiLCJ0ZiIsImhhczNkIiwiY3NzVEYiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiaW5zZXJ0QmVmb3JlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImdldEVuZFByb3BlcnR5IiwicHJvcEluIiwicHJvcE91dCIsImVuZFByb3AiLCJ0ZXN0Iiwic3VwcG9ydHNQYXNzaXZlIiwib3B0cyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmVPcHRpb24iLCJwYXNzaXZlIiwiYWRkRXZlbnRzIiwicHJldmVudFNjcm9sbGluZyIsIm9wdGlvbiIsInJlbW92ZUV2ZW50cyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJ0b3BpY3MiLCJvbiIsImV2ZW50TmFtZSIsImZuIiwib2ZmIiwic3BsaWNlIiwiZW1pdCIsImRhdGEiLCJqc1RyYW5zZm9ybSIsImVsZW1lbnQiLCJwb3N0Zml4IiwidG8iLCJkdXJhdGlvbiIsInRpY2siLCJtaW4iLCJ1bml0IiwiZnJvbSIsIk51bWJlciIsInBvc2l0aW9uVGljayIsInJ1bm5pbmciLCJtb3ZlRWxlbWVudCIsIm9wdGlvbnMiLCJjb250YWluZXIiLCJtb2RlIiwiYXhpcyIsIml0ZW1zIiwiZ3V0dGVyIiwiZWRnZVBhZGRpbmciLCJmaXhlZFdpZHRoIiwiYXV0b1dpZHRoIiwidmlld3BvcnRNYXgiLCJzbGlkZUJ5IiwiY2VudGVyIiwiY29udHJvbHMiLCJjb250cm9sc1Bvc2l0aW9uIiwiY29udHJvbHNUZXh0IiwiY29udHJvbHNDb250YWluZXIiLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsIm5hdiIsIm5hdlBvc2l0aW9uIiwibmF2Q29udGFpbmVyIiwibmF2QXNUaHVtYm5haWxzIiwiYXJyb3dLZXlzIiwic3BlZWQiLCJhdXRvcGxheSIsImF1dG9wbGF5UG9zaXRpb24iLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheURpcmVjdGlvbiIsImF1dG9wbGF5VGV4dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsImF1dG9wbGF5QnV0dG9uIiwiYXV0b3BsYXlCdXR0b25PdXRwdXQiLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5IiwiYW5pbWF0ZUluIiwiYW5pbWF0ZU91dCIsImFuaW1hdGVOb3JtYWwiLCJhbmltYXRlRGVsYXkiLCJsb29wIiwicmV3aW5kIiwiYXV0b0hlaWdodCIsInJlc3BvbnNpdmUiLCJsYXp5bG9hZCIsImxhenlsb2FkU2VsZWN0b3IiLCJ0b3VjaCIsIm1vdXNlRHJhZyIsInN3aXBlQW5nbGUiLCJuZXN0ZWQiLCJwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmciLCJwcmV2ZW50U2Nyb2xsT25Ub3VjaCIsImZyZWV6YWJsZSIsIm9uSW5pdCIsInVzZUxvY2FsU3RvcmFnZSIsIktFWVMiLCJFTlRFUiIsIlNQQUNFIiwiTEVGVCIsIlJJR0hUIiwidG5zU3RvcmFnZSIsImxvY2FsU3RvcmFnZUFjY2VzcyIsImJyb3dzZXJJbmZvIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidWlkIiwiRGF0ZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiQ0FMQyIsIlBFUkNFTlRBR0VMQVlPVVQiLCJDU1NNUSIsIlRSQU5TRk9STSIsIkhBUzNEVFJBTlNGT1JNUyIsIlRSQU5TSVRJT05EVVJBVElPTiIsIlRSQU5TSVRJT05ERUxBWSIsIkFOSU1BVElPTkRVUkFUSU9OIiwiQU5JTUFUSU9OREVMQVkiLCJUUkFOU0lUSU9ORU5EIiwiQU5JTUFUSU9ORU5EIiwic3VwcG9ydENvbnNvbGVXYXJuIiwiY29uc29sZSIsIndhcm4iLCJ0bnNMaXN0Iiwib3B0aW9uc0VsZW1lbnRzIiwibm9kZU5hbWUiLCJjYXJvdXNlbCIsInJlc3BvbnNpdmVUZW0iLCJ1cGRhdGVPcHRpb25zIiwiaG9yaXpvbnRhbCIsIm91dGVyV3JhcHBlciIsImlubmVyV3JhcHBlciIsIm1pZGRsZVdyYXBwZXIiLCJjb250YWluZXJQYXJlbnQiLCJjb250YWluZXJIVE1MIiwib3V0ZXJIVE1MIiwic2xpZGVJdGVtcyIsInNsaWRlQ291bnQiLCJicmVha3BvaW50Wm9uZSIsIndpbmRvd1dpZHRoIiwiZ2V0V2luZG93V2lkdGgiLCJpc09uIiwic2V0QnJlYWtwb2ludFpvbmUiLCJnZXRPcHRpb24iLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0V2lkdGgiLCJmbG9vciIsImZpeGVkV2lkdGhWaWV3cG9ydFdpZHRoIiwic2xpZGVQb3NpdGlvbnMiLCJzbGlkZUl0ZW1zT3V0IiwiY2xvbmVDb3VudCIsImdldENsb25lQ291bnRGb3JMb29wIiwic2xpZGVDb3VudE5ldyIsImhhc1JpZ2h0RGVhZFpvbmUiLCJyaWdodEJvdW5kYXJ5IiwiZ2V0UmlnaHRCb3VuZGFyeSIsInVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtIiwidHJhbnNmb3JtQXR0ciIsInRyYW5zZm9ybVByZWZpeCIsInRyYW5zZm9ybVBvc3RmaXgiLCJnZXRJbmRleE1heCIsImNlaWwiLCJtYXgiLCJnZXRTdGFydEluZGV4IiwiaW5kZXhDYWNoZWQiLCJkaXNwbGF5SW5kZXgiLCJnZXRDdXJyZW50U2xpZGUiLCJpbmRleE1pbiIsImluZGV4TWF4IiwicmVzaXplVGltZXIiLCJtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQiLCJldmVudHMiLCJuZXdDb250YWluZXJDbGFzc2VzIiwic2xpZGVJZCIsImRpc2FibGUiLCJkaXNhYmxlZCIsImZyZWV6ZSIsImdldEZyZWV6ZSIsImZyb3plbiIsImNvbnRyb2xzRXZlbnRzIiwib25Db250cm9sc0NsaWNrIiwib25Db250cm9sc0tleWRvd24iLCJuYXZFdmVudHMiLCJvbk5hdkNsaWNrIiwib25OYXZLZXlkb3duIiwiaG92ZXJFdmVudHMiLCJtb3VzZW92ZXJQYXVzZSIsIm1vdXNlb3V0UmVzdGFydCIsInZpc2liaWxpdHlFdmVudCIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsImRvY21lbnRLZXlkb3duRXZlbnQiLCJvbkRvY3VtZW50S2V5ZG93biIsInRvdWNoRXZlbnRzIiwib25QYW5TdGFydCIsIm9uUGFuTW92ZSIsIm9uUGFuRW5kIiwiZHJhZ0V2ZW50cyIsImhhc0NvbnRyb2xzIiwiaGFzT3B0aW9uIiwiaGFzTmF2IiwiaGFzQXV0b3BsYXkiLCJoYXNUb3VjaCIsImhhc01vdXNlRHJhZyIsInNsaWRlQWN0aXZlQ2xhc3MiLCJpbWdDb21wbGV0ZUNsYXNzIiwiaW1nRXZlbnRzIiwib25JbWdMb2FkZWQiLCJvbkltZ0ZhaWxlZCIsImltZ3NDb21wbGV0ZSIsImxpdmVyZWdpb25DdXJyZW50IiwicHJldmVudFNjcm9sbCIsImNvbnRyb2xzQ29udGFpbmVySFRNTCIsInByZXZCdXR0b25IVE1MIiwibmV4dEJ1dHRvbkhUTUwiLCJwcmV2SXNCdXR0b24iLCJuZXh0SXNCdXR0b24iLCJuYXZDb250YWluZXJIVE1MIiwibmF2SXRlbXMiLCJwYWdlcyIsImdldFBhZ2VzIiwicGFnZXNDYWNoZWQiLCJuYXZDbGlja2VkIiwibmF2Q3VycmVudEluZGV4IiwiZ2V0Q3VycmVudE5hdkluZGV4IiwibmF2Q3VycmVudEluZGV4Q2FjaGVkIiwibmF2QWN0aXZlQ2xhc3MiLCJuYXZTdHIiLCJuYXZTdHJDdXJyZW50IiwiYXV0b3BsYXlCdXR0b25IVE1MIiwiYXV0b3BsYXlIdG1sU3RyaW5ncyIsImF1dG9wbGF5VGltZXIiLCJhbmltYXRpbmciLCJhdXRvcGxheUhvdmVyUGF1c2VkIiwiYXV0b3BsYXlVc2VyUGF1c2VkIiwiYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkIiwiaW5pdFBvc2l0aW9uIiwibGFzdFBvc2l0aW9uIiwidHJhbnNsYXRlSW5pdCIsImRpc1giLCJkaXNZIiwicGFuU3RhcnQiLCJyYWZJbmRleCIsImdldERpc3QiLCJhIiwiYiIsInJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZSIsImluaXRTdHJ1Y3R1cmUiLCJpbml0U2hlZXQiLCJpbml0U2xpZGVyVHJhbnNmb3JtIiwiY29uZGl0aW9uIiwidGVtIiwiaW5kIiwiZ2V0QWJzSW5kZXgiLCJhYnNJbmRleCIsImdldEl0ZW1zTWF4IiwiYnAiLCJhcHBseSIsIml0ZW1zTWF4IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiZ2V0SW5zZXJ0UG9zaXRpb24iLCJwb3MiLCJnZXRDbGllbnRXaWR0aCIsInJlY3QiLCJyaWdodCIsInd3IiwicGFyc2VJbnQiLCJnZXRTbGlkZU1hcmdpbkxlZnQiLCJnZXRJbm5lcldyYXBwZXJTdHlsZXMiLCJlZGdlUGFkZGluZ1RlbSIsImd1dHRlclRlbSIsImZpeGVkV2lkdGhUZW0iLCJzcGVlZFRlbSIsImF1dG9IZWlnaHRCUCIsImd1dHRlclRlbVVuaXQiLCJkaXIiLCJnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZSIsImdldENvbnRhaW5lcldpZHRoIiwiaXRlbXNUZW0iLCJnZXRTbGlkZVdpZHRoU3R5bGUiLCJkaXZpZGVuZCIsImdldFNsaWRlR3V0dGVyU3R5bGUiLCJnZXRDU1NQcmVmaXgiLCJudW0iLCJzdWJzdHJpbmciLCJnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlIiwiY2xhc3NPdXRlciIsImNsYXNzSW5uZXIiLCJoYXNHdXR0ZXIiLCJ3cCIsImZyYWdtZW50QmVmb3JlIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImZyYWdtZW50QWZ0ZXIiLCJjbG9uZUZpcnN0IiwiY2xvbmVOb2RlIiwiZmlyc3RDaGlsZCIsImNsb25lTGFzdCIsImltZ3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW1nIiwic3JjIiwiaW1nTG9hZGVkIiwiaW1nc0xvYWRlZENoZWNrIiwiZ2V0SW1hZ2VBcnJheSIsImluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrIiwiZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQiLCJpbml0VG9vbHMiLCJpbml0RXZlbnRzIiwic3R5bGVzQXBwbGljYXRpb25DaGVjayIsInRvRml4ZWQiLCJpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSIsInNldFNsaWRlUG9zaXRpb25zIiwidXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQiLCJmb250U2l6ZSIsInNsaWRlIiwibWFyZ2luTGVmdCIsInVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uIiwibWlkZGxlV3JhcHBlclN0ciIsImlubmVyV3JhcHBlclN0ciIsImNvbnRhaW5lclN0ciIsInNsaWRlU3RyIiwiaXRlbXNCUCIsImZpeGVkV2lkdGhCUCIsInNwZWVkQlAiLCJlZGdlUGFkZGluZ0JQIiwiZ3V0dGVyQlAiLCJ1cGRhdGVTbGlkZVN0YXR1cyIsImluc2VydEFkamFjZW50SFRNTCIsImdldExpdmVSZWdpb25TdHIiLCJ0eHQiLCJ0b2dnbGVBdXRvcGxheSIsInN0YXJ0QXV0b3BsYXkiLCJpbml0SW5kZXgiLCJuYXZIdG1sIiwiaGlkZGVuU3RyIiwidXBkYXRlTmF2VmlzaWJpbGl0eSIsImlzQnV0dG9uIiwidXBkYXRlQ29udHJvbHNTdGF0dXMiLCJkaXNhYmxlVUkiLCJldmUiLCJvblRyYW5zaXRpb25FbmQiLCJyZXNpemVUYXNrcyIsImluZm8iLCJvblJlc2l6ZSIsImRvQXV0b0hlaWdodCIsImRvTGF6eUxvYWQiLCJkaXNhYmxlU2xpZGVyIiwiZnJlZXplU2xpZGVyIiwiYWRkaXRpb25hbFVwZGF0ZXMiLCJkZXN0cm95Iiwib3duZXJOb2RlIiwiY2xlYXJJbnRlcnZhbCIsImh0bWxMaXN0IiwicHJldkVsIiwicHJldmlvdXNFbGVtZW50U2libGluZyIsInBhcmVudEVsIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJnZXRFdmVudCIsImJwQ2hhbmdlZCIsImJyZWFrcG9pbnRab25lVGVtIiwibmVlZENvbnRhaW5lclRyYW5zZm9ybSIsImluZENoYW5nZWQiLCJpdGVtc0NoYW5nZWQiLCJkaXNhYmxlVGVtIiwiZnJlZXplVGVtIiwiYXJyb3dLZXlzVGVtIiwiY29udHJvbHNUZW0iLCJuYXZUZW0iLCJ0b3VjaFRlbSIsIm1vdXNlRHJhZ1RlbSIsImF1dG9wbGF5VGVtIiwiYXV0b3BsYXlIb3ZlclBhdXNlVGVtIiwiYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSIsImluZGV4VGVtIiwiYXV0b0hlaWdodFRlbSIsImNvbnRyb2xzVGV4dFRlbSIsImNlbnRlclRlbSIsImF1dG9wbGF5VGV4dFRlbSIsInVwZGF0ZUluZGV4IiwiZW5hYmxlU2xpZGVyIiwiZG9Db250YWluZXJUcmFuc2Zvcm0iLCJnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSIsInVuZnJlZXplU2xpZGVyIiwic3RvcEF1dG9wbGF5IiwiaGVpZ2h0IiwiaHRtbCIsInVwZGF0ZUxpdmVSZWdpb24iLCJ1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMiLCJhdXRvaGVpZ2h0VGVtIiwidnAiLCJsZWZ0RWRnZSIsInJpZ2h0RWRnZSIsImVuYWJsZVVJIiwibWFyZ2luIiwiY2xhc3NOIiwiZ2V0VmlzaWJsZVNsaWRlUmFuZ2UiLCJzdGFydCIsImVuZCIsInJhbmdlc3RhcnQiLCJyYW5nZWVuZCIsInBhcnNlRmxvYXQiLCJwb2ludCIsImNlbGwiLCJzdG9wUHJvcGFnYXRpb24iLCJzcmNzZXQiLCJnZXRUYXJnZXQiLCJpbWdGYWlsZWQiLCJpbWdDb21wbGV0ZWQiLCJ1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQiLCJ1cGRhdGVOYXZTdGF0dXMiLCJnZXRNYXhTbGlkZUhlaWdodCIsInNsaWRlU3RhcnQiLCJzbGlkZVJhbmdlIiwiaGVpZ2h0cyIsIm1heEhlaWdodCIsImF0dHIyIiwiYmFzZSIsIm5hdlByZXYiLCJuYXZDdXJyZW50IiwiZ2V0TG93ZXJDYXNlTm9kZU5hbWUiLCJpc0FyaWFEaXNhYmxlZCIsImRpc0VuYWJsZUVsZW1lbnQiLCJwcmV2RGlzYWJsZWQiLCJuZXh0RGlzYWJsZWQiLCJkaXNhYmxlUHJldiIsImRpc2FibGVOZXh0IiwicmVzZXREdXJhdGlvbiIsImdldFNsaWRlcldpZHRoIiwiZ2V0Q2VudGVyR2FwIiwiZGVub21pbmF0b3IiLCJhbmltYXRlU2xpZGUiLCJudW1iZXIiLCJjbGFzc091dCIsImNsYXNzSW4iLCJpc091dCIsInRyYW5zZm9ybUNvcmUiLCJyZW5kZXIiLCJzbGlkZXJNb3ZlZCIsInN0clRyYW5zIiwiZXZlbnQiLCJwcm9wZXJ0eU5hbWUiLCJnb1RvIiwidGFyZ2V0SW5kZXgiLCJpbmRleEdhcCIsImlzTmFOIiwiZmFjdG9yIiwicGFzc0V2ZW50T2JqZWN0IiwidGFyZ2V0SW4iLCJuYXZJbmRleCIsInRhcmdldEluZGV4QmFzZSIsInNldEF1dG9wbGF5VGltZXIiLCJzZXRJbnRlcnZhbCIsInN0b3BBdXRvcGxheVRpbWVyIiwidXBkYXRlQXV0b3BsYXlCdXR0b24iLCJhY3Rpb24iLCJwbGF5IiwicGF1c2UiLCJoaWRkZW4iLCJrZXlJbmRleCIsImtleUNvZGUiLCJzZXRGb2N1cyIsImZvY3VzIiwiY3VyRWxlbWVudCIsImFjdGl2ZUVsZW1lbnQiLCJpc1RvdWNoRXZlbnQiLCJjaGFuZ2VkVG91Y2hlcyIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsIiQiLCJjbGllbnRYIiwiY2xpZW50WSIsInBhblVwZGF0ZSIsImVyciIsImRpc3QiLCJwZXJjZW50YWdlWCIsInByZXZlbnRDbGljayIsImluZGV4TW92ZWQiLCJtb3ZlZCIsInJvdWdoIiwidmVyc2lvbiIsImdldEluZm8iLCJ1cGRhdGVTbGlkZXJIZWlnaHQiLCJyZWZyZXNoIiwicmVidWlsZCIsImpRdWVyeSIsIkVycm9yIiwianF1ZXJ5Iiwic3BsaXQiLCJ0cmFuc2l0aW9uRW5kIiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImNhbGxlZCIsIiRlbCIsIm9uZSIsInRyaWdnZXIiLCJzdXBwb3J0Iiwic3BlY2lhbCIsImJzVHJhbnNpdGlvbkVuZCIsImJpbmRUeXBlIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiaXMiLCJoYW5kbGVPYmoiLCJoYW5kbGVyIiwiZGlzbWlzcyIsIkFsZXJ0IiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsIiR0aGlzIiwiJHBhcmVudCIsImZpbmQiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVFbGVtZW50IiwiZGV0YWNoIiwiUGx1Z2luIiwiZWFjaCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiJGVsZW1lbnQiLCJERUZBVUxUUyIsImlzTG9hZGluZyIsImxvYWRpbmdUZXh0Iiwic2V0U3RhdGUiLCJzdGF0ZSIsImQiLCJyZXNldFRleHQiLCJwcm94eSIsInJlbW92ZUF0dHIiLCJ0b2dnbGUiLCJjaGFuZ2VkIiwiJGlucHV0IiwidG9nZ2xlQ2xhc3MiLCJidXR0b24iLCIkYnRuIiwiZmlyc3QiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2VkIiwic2xpZGluZyIsImludGVydmFsIiwiJGFjdGl2ZSIsIiRpdGVtcyIsImtleWJvYXJkIiwia2V5ZG93biIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiZ2V0SXRlbUluZGV4IiwicGFyZW50IiwiZ2V0SXRlbUZvckRpcmVjdGlvbiIsImFjdGl2ZSIsImFjdGl2ZUluZGV4Iiwid2lsbFdyYXAiLCJkZWx0YSIsIml0ZW1JbmRleCIsImVxIiwidGhhdCIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsImpvaW4iLCJjbGlja0hhbmRsZXIiLCJocmVmIiwiJHRhcmdldCIsInNsaWRlSW5kZXgiLCIkY2Fyb3VzZWwiLCJDb2xsYXBzZSIsIiR0cmlnZ2VyIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwiZ2V0VGFyZ2V0RnJvbVRyaWdnZXIiLCJpc09wZW4iLCJjb2xsYXBzZSIsImJhY2tkcm9wIiwiRHJvcGRvd24iLCJjbGVhck1lbnVzIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCIkZGlhbG9nIiwiJGJhY2tkcm9wIiwiaXNTaG93biIsIm9yaWdpbmFsQm9keVBhZCIsInNjcm9sbGJhcldpZHRoIiwiaWdub3JlQmFja2Ryb3BDbGljayIsImZpeGVkQ29udGVudCIsInJlbW90ZSIsImxvYWQiLCJCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiX3JlbGF0ZWRUYXJnZXQiLCJjaGVja1Njcm9sbGJhciIsInNldFNjcm9sbGJhciIsImVzY2FwZSIsInJlc2l6ZSIsImFwcGVuZFRvIiwic2Nyb2xsVG9wIiwiYWRqdXN0RGlhbG9nIiwiZW5mb3JjZUZvY3VzIiwiaGlkZU1vZGFsIiwiaGFzIiwiaGFuZGxlVXBkYXRlIiwicmVzZXRBZGp1c3RtZW50cyIsInJlc2V0U2Nyb2xsYmFyIiwicmVtb3ZlQmFja2Ryb3AiLCJhbmltYXRlIiwiZG9BbmltYXRlIiwiY3VycmVudFRhcmdldCIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImRvY3VtZW50RWxlbWVudFJlY3QiLCJtZWFzdXJlU2Nyb2xsYmFyIiwiYm9keVBhZCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhZGRpbmciLCJyZW1vdmVEYXRhIiwic2Nyb2xsRGl2IiwiYXBwZW5kIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYXJlYSIsImJyIiwiY29sIiwiY29kZSIsImVtIiwiaHIiLCJoMSIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJsaSIsIm9sIiwicCIsInByZSIsInMiLCJzbWFsbCIsInNwYW4iLCJzdWIiLCJzdXAiLCJzdHJvbmciLCJ1IiwidWwiLCJTQUZFX1VSTF9QQVRURVJOIiwiREFUQV9VUkxfUEFUVEVSTiIsImFsbG93ZWRBdHRyaWJ1dGUiLCJhbGxvd2VkQXR0cmlidXRlTGlzdCIsImF0dHJOYW1lIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsIlJlZ0V4cCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJlbE5hbWUiLCJhdHRyaWJ1dGVMaXN0IiwiYXR0cmlidXRlcyIsIndoaXRlbGlzdGVkQXR0cmlidXRlcyIsImNvbmNhdCIsImxlbjIiLCJUb29sdGlwIiwiZW5hYmxlZCIsInRpbWVvdXQiLCJob3ZlclN0YXRlIiwiaW5TdGF0ZSIsImluaXQiLCJhbmltYXRpb24iLCJwbGFjZW1lbnQiLCJ0ZW1wbGF0ZSIsInRpdGxlIiwiZGVsYXkiLCJzYW5pdGl6ZSIsImdldE9wdGlvbnMiLCIkdmlld3BvcnQiLCJpc0Z1bmN0aW9uIiwiY2xpY2siLCJob3ZlciIsImNvbnN0cnVjdG9yIiwidHJpZ2dlcnMiLCJldmVudEluIiwiZXZlbnRPdXQiLCJlbnRlciIsImxlYXZlIiwiX29wdGlvbnMiLCJmaXhUaXRsZSIsImdldERlZmF1bHRzIiwiZGF0YUF0dHJpYnV0ZXMiLCJkYXRhQXR0ciIsImdldERlbGVnYXRlT3B0aW9ucyIsImRlZmF1bHRzIiwic2VsZiIsInRpcCIsImlzSW5TdGF0ZVRydWUiLCJoYXNDb250ZW50IiwiaW5Eb20iLCJvd25lckRvY3VtZW50IiwiJHRpcCIsInRpcElkIiwiZ2V0VUlEIiwic2V0Q29udGVudCIsImF1dG9Ub2tlbiIsImF1dG9QbGFjZSIsInRvcCIsImdldFBvc2l0aW9uIiwiYWN0dWFsV2lkdGgiLCJhY3R1YWxIZWlnaHQiLCJvcmdQbGFjZW1lbnQiLCJ2aWV3cG9ydERpbSIsImJvdHRvbSIsImNhbGN1bGF0ZWRPZmZzZXQiLCJnZXRDYWxjdWxhdGVkT2Zmc2V0IiwiYXBwbHlQbGFjZW1lbnQiLCJwcmV2SG92ZXJTdGF0ZSIsIm9mZnNldCIsIm1hcmdpblRvcCIsInNldE9mZnNldCIsInVzaW5nIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwidG9nZ2xlRW5hYmxlZCIsInRvb2x0aXAiLCJQb3BvdmVyIiwiY29udGVudCIsImdldENvbnRlbnQiLCJ0eXBlQ29udGVudCIsInBvcG92ZXIiLCJTY3JvbGxTcHkiLCIkc2Nyb2xsRWxlbWVudCIsIm9mZnNldHMiLCJ0YXJnZXRzIiwiYWN0aXZlVGFyZ2V0IiwicHJvY2VzcyIsImdldFNjcm9sbEhlaWdodCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsIm1heFNjcm9sbCIsImFjdGl2YXRlIiwiY2xlYXIiLCJwYXJlbnRzIiwicGFyZW50c1VudGlsIiwic2Nyb2xsc3B5IiwiJHNweSIsIlRhYiIsIiR1bCIsIiRwcmV2aW91cyIsImhpZGVFdmVudCIsInRhYiIsIkFmZml4IiwiY2hlY2tQb3NpdGlvbiIsImNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wIiwiYWZmaXhlZCIsInVucGluIiwicGlubmVkT2Zmc2V0IiwiUkVTRVQiLCJnZXRTdGF0ZSIsIm9mZnNldFRvcCIsIm9mZnNldEJvdHRvbSIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiZmxleHlfbmF2aWdhdGlvbiIsImxheW91dF9jbGFzc2VzIiwidXBncmFkZSIsIiRuYXZpZ2F0aW9ucyIsIm5hdmlnYXRpb24iLCIkbmF2aWdhdGlvbiIsIiRtZWdhbWVudXMiLCJkcm9wZG93bl9tZWdhbWVudSIsIiRkcm9wZG93bl9tZWdhbWVudSIsImRyb3Bkb3duX2hhc19tZWdhbWVudSIsImlzX3VwZ3JhZGVkIiwibmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUiLCIkbWVnYW1lbnUiLCJoYXNfb2JmdXNjYXRvciIsIm9iZnVzY2F0b3IiLCJiYWJlbEhlbHBlcnMiLCJjbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInByb3RvUHJvcHMiLCJzdGF0aWNQcm9wcyIsInNpZHJTdGF0dXMiLCJtb3ZpbmciLCJvcGVuZWQiLCJoZWxwZXIiLCJpc1VybCIsInBhdHRlcm4iLCJhZGRQcmVmaXhlcyIsImFkZFByZWZpeCIsImF0dHJpYnV0ZSIsInRvUmVwbGFjZSIsInRyYW5zaXRpb25zIiwicHJvcGVydHkiLCIkJDIiLCJib2R5QW5pbWF0aW9uQ2xhc3MiLCJvcGVuQWN0aW9uIiwiY2xvc2VBY3Rpb24iLCJ0cmFuc2l0aW9uRW5kRXZlbnQiLCJNZW51Iiwib3BlbkNsYXNzIiwibWVudVdpZHRoIiwib3V0ZXJXaWR0aCIsInNpZGUiLCJkaXNwbGFjZSIsInRpbWluZyIsIm1ldGhvZCIsIm9uT3BlbkNhbGxiYWNrIiwib25DbG9zZUNhbGxiYWNrIiwib25PcGVuRW5kQ2FsbGJhY2siLCJvbkNsb3NlRW5kQ2FsbGJhY2siLCJnZXRBbmltYXRpb24iLCJwcmVwYXJlQm9keSIsIiRodG1sIiwib3BlbkJvZHkiLCJib2R5QW5pbWF0aW9uIiwicXVldWUiLCJvbkNsb3NlQm9keSIsInJlc2V0U3R5bGVzIiwidW5iaW5kIiwiY2xvc2VCb2R5IiwiX3RoaXMiLCJtb3ZlQm9keSIsIm9uT3Blbk1lbnUiLCJvcGVuTWVudSIsIl90aGlzMiIsIiRpdGVtIiwibWVudUFuaW1hdGlvbiIsIm9uQ2xvc2VNZW51IiwiY2xvc2VNZW51IiwiX3RoaXMzIiwibW92ZU1lbnUiLCJtb3ZlIiwib3BlbiIsIl90aGlzNCIsImFscmVhZHlPcGVuZWRNZW51IiwiJCQxIiwiZXhlY3V0ZSIsInNpZHIiLCJlcnJvciIsInB1YmxpY01ldGhvZHMiLCJtZXRob2ROYW1lIiwibWV0aG9kcyIsImdldE1ldGhvZCIsIiQkMyIsImZpbGxDb250ZW50IiwiJHNpZGVNZW51Iiwic2V0dGluZ3MiLCJzb3VyY2UiLCJuZXdDb250ZW50IiwiaHRtbENvbnRlbnQiLCJzZWxlY3RvcnMiLCJyZW5hbWluZyIsIiRodG1sQ29udGVudCIsImZuU2lkciIsImJpbmQiLCJvbk9wZW4iLCJvbkNsb3NlIiwib25PcGVuRW5kIiwib25DbG9zZUVuZCIsImZsYWciLCJ0Iiwic2xpbmt5IiwibGFiZWwiLCJuIiwiciIsInByZXBlbmQiLCJub3ciLCJqdW1wIiwiaG9tZSIsImMiLCJBamF4TW9uaXRvciIsIkJhciIsIkRvY3VtZW50TW9uaXRvciIsIkVsZW1lbnRNb25pdG9yIiwiRWxlbWVudFRyYWNrZXIiLCJFdmVudExhZ01vbml0b3IiLCJFdmVudGVkIiwiTm9UYXJnZXRFcnJvciIsIlBhY2UiLCJSZXF1ZXN0SW50ZXJjZXB0IiwiU09VUkNFX0tFWVMiLCJTY2FsZXIiLCJTb2NrZXRSZXF1ZXN0VHJhY2tlciIsIlhIUlJlcXVlc3RUcmFja2VyIiwiYXZnQW1wbGl0dWRlIiwiYmFyIiwiY2FuY2VsQW5pbWF0aW9uIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmROYXRpdmUiLCJnZXRGcm9tRE9NIiwiZ2V0SW50ZXJjZXB0IiwiaGFuZGxlUHVzaFN0YXRlIiwiaWdub3JlU3RhY2siLCJydW5BbmltYXRpb24iLCJzY2FsZXJzIiwic2hvdWxkSWdub3JlVVJMIiwic2hvdWxkVHJhY2siLCJzb3VyY2VzIiwidW5pU2NhbGVyIiwiX1dlYlNvY2tldCIsIl9YRG9tYWluUmVxdWVzdCIsIl9YTUxIdHRwUmVxdWVzdCIsIl9pIiwiX2ludGVyY2VwdCIsIl9sZW4iLCJfcHVzaFN0YXRlIiwiX3JlZiIsIl9yZWYxIiwiX3JlcGxhY2VTdGF0ZSIsIl9fc2xpY2UiLCJfX2hhc1Byb3AiLCJfX2V4dGVuZHMiLCJjaGlsZCIsImN0b3IiLCJfX3N1cGVyX18iLCJfX2luZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsImxhc3QiLCJkaWZmIiwiYXJncyIsIm91dCIsInN1bSIsInYiLCJqc29uIiwiX2Vycm9yIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiaWdub3JlIiwicmV0IiwidW5zaGlmdCIsInNoaWZ0IiwidHJhY2siLCJtb25pdG9yWEhSIiwicmVxIiwiX29wZW4iLCJ1cmwiLCJhc3luYyIsInJlcXVlc3QiLCJmbGFncyIsInByb3RvY29scyIsIl9hcmciLCJhZnRlciIsInN0aWxsQWN0aXZlIiwiX3JlZjMiLCJyZWFkeVN0YXRlIiwicmVzdGFydCIsIndhdGNoIiwidHJhY2tlciIsInNpemUiLCJfb25yZWFkeXN0YXRlY2hhbmdlIiwiUHJvZ3Jlc3NFdmVudCIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwiZ28iLCJlbnF1ZXVlTmV4dEZyYW1lIiwicmVtYWluaW5nIiwic2NhbGVyIiwic2NhbGVyTGlzdCIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJoYW5kbGVUb2dnbGUiLCJ0b2dnbGVzIiwiZmFrZVN1Ym1pdCIsInBhcmVudEZvcm0iLCJzdWJtaXQiLCJoaWdobGlnaHQiLCJidXR0b25zIiwicmFkaW9zIiwicmFkaW8iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxNQUFPLFlBQVc7QUFDdEI7QUFDQSxNQUFJLENBQUNDLE9BQU9DLElBQVosRUFBa0I7QUFDaEJELFdBQU9DLElBQVAsR0FBYyxVQUFTQyxNQUFULEVBQWlCO0FBQzdCLFVBQUlELE9BQU8sRUFBWDtBQUNBLFdBQUssSUFBSUUsSUFBVCxJQUFpQkQsTUFBakIsRUFBeUI7QUFDdkIsWUFBSUYsT0FBT0ksU0FBUCxDQUFpQkMsY0FBakIsQ0FBZ0NDLElB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O0FBQ0FoOUIsTUFBSTtBQUNGd04sZUFBVyw2QkFEVDtBQUVGVSxZQUFRLElBRk47QUFHRlAsV0FBTyxDQUhMO0FBSUZvQixjQUFVLElBSlI7QUFLRkssd0JBQW9CLElBTGxCO0FBTUZXLGdCQUFZO0FBQ1YsV0FBSztBQUNIcEMsZUFBTztBQURKO0FBREs7QUFOVixHQUFKOztBQWFBO0FBQ0EzTixNQUFJO0FBQ0Z3TixlQUFXLDJCQURUO0FBRUZVLFlBQVEsSUFGTjtBQUdGUCxXQUFPLENBSEw7QUFJRm9CLGNBQVUsSUFKUjtBQUtGSyx3QkFBb0I7QUFMbEIsR0FBSjtBQU9ELENBNUNEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB0bnMgPSAoZnVuY3Rpb24gKCl7XG4vLyBPYmplY3Qua2V5c1xuaWYgKCFPYmplY3Qua2V5cykge1xuICBPYmplY3Qua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICBrZXlzLnB1c2gobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9O1xufVxuXG4vLyBDaGlsZE5vZGUucmVtb3ZlXG5pZighKFwicmVtb3ZlXCIgaW4gRWxlbWVudC5wcm90b3R5cGUpKXtcbiAgRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKXtcbiAgICBpZih0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciB3aW4gPSB3aW5kb3c7XG5cbnZhciByYWYgPSB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDE2KTsgfTtcblxudmFyIHdpbiQxID0gd2luZG93O1xuXG52YXIgY2FmID0gd2luJDEuY2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luJDEubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgZnVuY3Rpb24oaWQpeyBjbGVhclRpbWVvdXQoaWQpOyB9O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gIHZhciBvYmosIG5hbWUsIGNvcHksXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sXG4gICAgICBpID0gMSxcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgob2JqID0gYXJndW1lbnRzW2ldKSAhPT0gbnVsbCkge1xuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBjb3B5ID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh0YXJnZXQgPT09IGNvcHkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RvcmFnZVZhbHVlICh2YWx1ZSkge1xuICByZXR1cm4gWyd0cnVlJywgJ2ZhbHNlJ10uaW5kZXhPZih2YWx1ZSkgPj0gMCA/IEpTT04ucGFyc2UodmFsdWUpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHNldExvY2FsU3RvcmFnZShzdG9yYWdlLCBrZXksIHZhbHVlLCBhY2Nlc3MpIHtcbiAgaWYgKGFjY2Vzcykge1xuICAgIHRyeSB7IHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTsgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldFNsaWRlSWQoKSB7XG4gIHZhciBpZCA9IHdpbmRvdy50bnNJZDtcbiAgd2luZG93LnRuc0lkID0gIWlkID8gMSA6IGlkICsgMTtcbiAgXG4gIHJldHVybiAndG5zJyArIHdpbmRvdy50bnNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0Qm9keSAoKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBkb2MuYm9keTtcblxuICBpZiAoIWJvZHkpIHtcbiAgICBib2R5ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2JvZHknKTtcbiAgICBib2R5LmZha2UgPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59XG5cbnZhciBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5mdW5jdGlvbiBzZXRGYWtlQm9keSAoYm9keSkge1xuICB2YXIgZG9jT3ZlcmZsb3cgPSAnJztcbiAgaWYgKGJvZHkuZmFrZSkge1xuICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcbiAgICAvL2F2b2lkIGNyYXNoaW5nIElFOCwgaWYgYmFja2dyb3VuZCBpbWFnZSBpcyB1c2VkXG4gICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gICAgLy9TYWZhcmkgNS4xMy81LjEuNCBPU1ggc3RvcHMgbG9hZGluZyBpZiA6Oi13ZWJraXQtc2Nyb2xsYmFyIGlzIHVzZWQgYW5kIHNjcm9sbGJhcnMgYXJlIHZpc2libGVcbiAgICBib2R5LnN0eWxlLm92ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XG4gIH1cblxuICByZXR1cm4gZG9jT3ZlcmZsb3c7XG59XG5cbmZ1bmN0aW9uIHJlc2V0RmFrZUJvZHkgKGJvZHksIGRvY092ZXJmbG93KSB7XG4gIGlmIChib2R5LmZha2UpIHtcbiAgICBib2R5LnJlbW92ZSgpO1xuICAgIGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBkb2NPdmVyZmxvdztcbiAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICB9XG59XG5cbi8vIGdldCBjc3MtY2FsYyBcblxuZnVuY3Rpb24gY2FsYygpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LCBcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgdHJ5IHtcbiAgICB2YXIgc3RyID0gJygxMHB4ICogMTApJyxcbiAgICAgICAgdmFscyA9IFsnY2FsYycgKyBzdHIsICctbW96LWNhbGMnICsgc3RyLCAnLXdlYmtpdC1jYWxjJyArIHN0cl0sXG4gICAgICAgIHZhbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgdmFsID0gdmFsc1tpXTtcbiAgICAgIGRpdi5zdHlsZS53aWR0aCA9IHZhbDtcbiAgICAgIGlmIChkaXYub2Zmc2V0V2lkdGggPT09IDEwMCkgeyBcbiAgICAgICAgcmVzdWx0ID0gdmFsLnJlcGxhY2Uoc3RyLCAnJyk7IFxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIFxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGRpdi5yZW1vdmUoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBnZXQgc3VicGl4ZWwgc3VwcG9ydCB2YWx1ZVxuXG5mdW5jdGlvbiBwZXJjZW50YWdlTGF5b3V0KCkge1xuICAvLyBjaGVjayBzdWJwaXhlbCBsYXlvdXQgc3VwcG9ydGluZ1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIHdyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBvdXRlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIHN0ciA9ICcnLFxuICAgICAgY291bnQgPSA3MCxcbiAgICAgIHBlclBhZ2UgPSAzLFxuICAgICAgc3VwcG9ydGVkID0gZmFsc2U7XG5cbiAgd3JhcHBlci5jbGFzc05hbWUgPSBcInRucy10LXN1YnAyXCI7XG4gIG91dGVyLmNsYXNzTmFtZSA9IFwidG5zLXQtY3RcIjtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICBzdHIgKz0gJzxkaXY+PC9kaXY+JztcbiAgfVxuXG4gIG91dGVyLmlubmVySFRNTCA9IHN0cjtcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlcik7XG4gIGJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cbiAgc3VwcG9ydGVkID0gTWF0aC5hYnMod3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gb3V0ZXIuY2hpbGRyZW5bY291bnQgLSBwZXJQYWdlXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KSA8IDI7XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiB3cmFwcGVyLnJlbW92ZSgpO1xuXG4gIHJldHVybiBzdXBwb3J0ZWQ7XG59XG5cbmZ1bmN0aW9uIG1lZGlhcXVlcnlTdXBwb3J0ICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBzdHlsZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgcnVsZSA9ICdAbWVkaWEgYWxsIGFuZCAobWluLXdpZHRoOjFweCl7LnRucy1tcS10ZXN0e3Bvc2l0aW9uOmFic29sdXRlfX0nLFxuICAgICAgcG9zaXRpb247XG5cbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIGRpdi5jbGFzc05hbWUgPSAndG5zLW1xLXRlc3QnO1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICBib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBydWxlO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XG4gIH1cblxuICBwb3NpdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2KS5wb3NpdGlvbiA6IGRpdi5jdXJyZW50U3R5bGVbJ3Bvc2l0aW9uJ107XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBkaXYucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHBvc2l0aW9uID09PSBcImFic29sdXRlXCI7XG59XG5cbi8vIGNyZWF0ZSBhbmQgYXBwZW5kIHN0eWxlIHNoZWV0XG5mdW5jdGlvbiBjcmVhdGVTdHlsZVNoZWV0IChtZWRpYSkge1xuICAvLyBDcmVhdGUgdGhlIDxzdHlsZT4gdGFnXG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvY3NzXCIpO1xuXG4gIC8vIEFkZCBhIG1lZGlhIChhbmQvb3IgbWVkaWEgcXVlcnkpIGhlcmUgaWYgeW91J2QgbGlrZSFcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgXCJzY3JlZW5cIilcbiAgLy8gc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgXCJvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aCA6IDEwMjRweClcIilcbiAgaWYgKG1lZGlhKSB7IHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKTsgfVxuXG4gIC8vIFdlYktpdCBoYWNrIDooXG4gIC8vIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpKTtcblxuICAvLyBBZGQgdGhlIDxzdHlsZT4gZWxlbWVudCB0byB0aGUgcGFnZVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gIHJldHVybiBzdHlsZS5zaGVldCA/IHN0eWxlLnNoZWV0IDogc3R5bGUuc3R5bGVTaGVldDtcbn1cblxuLy8gY3Jvc3MgYnJvd3NlcnMgYWRkUnVsZSBtZXRob2RcbmZ1bmN0aW9uIGFkZENTU1J1bGUoc2hlZXQsIHNlbGVjdG9yLCBydWxlcywgaW5kZXgpIHtcbiAgLy8gcmV0dXJuIHJhZihmdW5jdGlvbigpIHtcbiAgICAnaW5zZXJ0UnVsZScgaW4gc2hlZXQgP1xuICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIHJ1bGVzICsgJ30nLCBpbmRleCkgOlxuICAgICAgc2hlZXQuYWRkUnVsZShzZWxlY3RvciwgcnVsZXMsIGluZGV4KTtcbiAgLy8gfSk7XG59XG5cbi8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXG5mdW5jdGlvbiByZW1vdmVDU1NSdWxlKHNoZWV0LCBpbmRleCkge1xuICAvLyByZXR1cm4gcmFmKGZ1bmN0aW9uKCkge1xuICAgICdkZWxldGVSdWxlJyBpbiBzaGVldCA/XG4gICAgICBzaGVldC5kZWxldGVSdWxlKGluZGV4KSA6XG4gICAgICBzaGVldC5yZW1vdmVSdWxlKGluZGV4KTtcbiAgLy8gfSk7XG59XG5cbmZ1bmN0aW9uIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSB7XG4gIHZhciBydWxlID0gKCdpbnNlcnRSdWxlJyBpbiBzaGVldCkgPyBzaGVldC5jc3NSdWxlcyA6IHNoZWV0LnJ1bGVzO1xuICByZXR1cm4gcnVsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIHRvRGVncmVlICh5LCB4KSB7XG4gIHJldHVybiBNYXRoLmF0YW4yKHksIHgpICogKDE4MCAvIE1hdGguUEkpO1xufVxuXG5mdW5jdGlvbiBnZXRUb3VjaERpcmVjdGlvbihhbmdsZSwgcmFuZ2UpIHtcbiAgdmFyIGRpcmVjdGlvbiA9IGZhbHNlLFxuICAgICAgZ2FwID0gTWF0aC5hYnMoOTAgLSBNYXRoLmFicyhhbmdsZSkpO1xuICAgICAgXG4gIGlmIChnYXAgPj0gOTAgLSByYW5nZSkge1xuICAgIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgfSBlbHNlIGlmIChnYXAgPD0gcmFuZ2UpIHtcbiAgICBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGlvbjtcbn1cblxuLy8gaHR0cHM6Ly90b2RkbW90dG8uY29tL2RpdGNoLXRoZS1hcnJheS1mb3JlYWNoLWNhbGwtbm9kZWxpc3QtaGFjay9cbmZ1bmN0aW9uIGZvckVhY2ggKGFyciwgY2FsbGJhY2ssIHNjb3BlKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGFycltpXSwgaSk7XG4gIH1cbn1cblxudmFyIGNsYXNzTGlzdFN1cHBvcnQgPSAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdfJyk7XG5cbnZhciBoYXNDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7IHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoc3RyKTsgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTmFtZS5pbmRleE9mKHN0cikgPj0gMDsgfTtcblxudmFyIGFkZENsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmICghaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5hZGQoc3RyKTsgfVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbCwgc3RyKSB7XG4gICAgICBpZiAoIWhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc05hbWUgKz0gJyAnICsgc3RyOyB9XG4gICAgfTtcblxudmFyIHJlbW92ZUNsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NMaXN0LnJlbW92ZShzdHIpOyB9XG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhlbCwgc3RyKSkgeyBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShzdHIsICcnKTsgfVxuICAgIH07XG5cbmZ1bmN0aW9uIGhhc0F0dHIoZWwsIGF0dHIpIHtcbiAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShhdHRyKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXR0cihlbCwgYXR0cikge1xuICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xufVxuXG5mdW5jdGlvbiBpc05vZGVMaXN0KGVsKSB7XG4gIC8vIE9ubHkgTm9kZUxpc3QgaGFzIHRoZSBcIml0ZW0oKVwiIGZ1bmN0aW9uXG4gIHJldHVybiB0eXBlb2YgZWwuaXRlbSAhPT0gXCJ1bmRlZmluZWRcIjsgXG59XG5cbmZ1bmN0aW9uIHNldEF0dHJzKGVscywgYXR0cnMpIHtcbiAgZWxzID0gKGlzTm9kZUxpc3QoZWxzKSB8fCBlbHMgaW5zdGFuY2VvZiBBcnJheSkgPyBlbHMgOiBbZWxzXTtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhdHRycykgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7IHJldHVybjsgfVxuXG4gIGZvciAodmFyIGkgPSBlbHMubGVuZ3RoOyBpLS07KSB7XG4gICAgZm9yKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgIGVsc1tpXS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQXR0cnMoZWxzLCBhdHRycykge1xuICBlbHMgPSAoaXNOb2RlTGlzdChlbHMpIHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSA/IGVscyA6IFtlbHNdO1xuICBhdHRycyA9IChhdHRycyBpbnN0YW5jZW9mIEFycmF5KSA/IGF0dHJzIDogW2F0dHJzXTtcblxuICB2YXIgYXR0ckxlbmd0aCA9IGF0dHJzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IGVscy5sZW5ndGg7IGktLTspIHtcbiAgICBmb3IgKHZhciBqID0gYXR0ckxlbmd0aDsgai0tOykge1xuICAgICAgZWxzW2ldLnJlbW92ZUF0dHJpYnV0ZShhdHRyc1tqXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFycmF5RnJvbU5vZGVMaXN0IChubCkge1xuICB2YXIgYXJyID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gbmwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYXJyLnB1c2gobmxbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGhpZGVFbGVtZW50KGVsLCBmb3JjZUhpZGUpIHtcbiAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykgeyBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyB9XG59XG5cbmZ1bmN0aW9uIHNob3dFbGVtZW50KGVsLCBmb3JjZUhpZGUpIHtcbiAgaWYgKGVsLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykgeyBlbC5zdHlsZS5kaXNwbGF5ID0gJyc7IH1cbn1cblxuZnVuY3Rpb24gaXNWaXNpYmxlKGVsKSB7XG4gIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSAhPT0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB3aGljaFByb3BlcnR5KHByb3BzKXtcbiAgaWYgKHR5cGVvZiBwcm9wcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgYXJyID0gW3Byb3BzXSxcbiAgICAgICAgUHJvcHMgPSBwcm9wcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BzLnN1YnN0cigxKSxcbiAgICAgICAgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnLCAnTyddO1xuICAgICAgICBcbiAgICBwcmVmaXhlcy5mb3JFYWNoKGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgaWYgKHByZWZpeCAhPT0gJ21zJyB8fCBwcm9wcyA9PT0gJ3RyYW5zZm9ybScpIHtcbiAgICAgICAgYXJyLnB1c2gocHJlZml4ICsgUHJvcHMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcHJvcHMgPSBhcnI7XG4gIH1cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmYWtlZWxlbWVudCcpLFxuICAgICAgbGVuID0gcHJvcHMubGVuZ3RoO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspe1xuICAgIHZhciBwcm9wID0gcHJvcHNbaV07XG4gICAgaWYoIGVsLnN0eWxlW3Byb3BdICE9PSB1bmRlZmluZWQgKXsgcmV0dXJuIHByb3A7IH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTsgLy8gZXhwbGljaXQgZm9yIGllOS1cbn1cblxuZnVuY3Rpb24gaGFzM0RUcmFuc2Zvcm1zKHRmKXtcbiAgaWYgKCF0ZikgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKCF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpLFxuICAgICAgaGFzM2QsXG4gICAgICBjc3NURiA9IHRmLmxlbmd0aCA+IDkgPyAnLScgKyB0Zi5zbGljZSgwLCAtOSkudG9Mb3dlckNhc2UoKSArICctJyA6ICcnO1xuXG4gIGNzc1RGICs9ICd0cmFuc2Zvcm0nO1xuXG4gIC8vIEFkZCBpdCB0byB0aGUgYm9keSB0byBnZXQgdGhlIGNvbXB1dGVkIHN0eWxlXG4gIGJvZHkuaW5zZXJ0QmVmb3JlKGVsLCBudWxsKTtcblxuICBlbC5zdHlsZVt0Zl0gPSAndHJhbnNsYXRlM2QoMXB4LDFweCwxcHgpJztcbiAgaGFzM2QgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShjc3NURik7XG5cbiAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBlbC5yZW1vdmUoKTtcblxuICByZXR1cm4gKGhhczNkICE9PSB1bmRlZmluZWQgJiYgaGFzM2QubGVuZ3RoID4gMCAmJiBoYXMzZCAhPT0gXCJub25lXCIpO1xufVxuXG4vLyBnZXQgdHJhbnNpdGlvbmVuZCwgYW5pbWF0aW9uZW5kIGJhc2VkIG9uIHRyYW5zaXRpb25EdXJhdGlvblxuLy8gQHByb3Bpbjogc3RyaW5nXG4vLyBAcHJvcE91dDogc3RyaW5nLCBmaXJzdC1sZXR0ZXIgdXBwZXJjYXNlXG4vLyBVc2FnZTogZ2V0RW5kUHJvcGVydHkoJ1dlYmtpdFRyYW5zaXRpb25EdXJhdGlvbicsICdUcmFuc2l0aW9uJykgPT4gd2Via2l0VHJhbnNpdGlvbkVuZFxuZnVuY3Rpb24gZ2V0RW5kUHJvcGVydHkocHJvcEluLCBwcm9wT3V0KSB7XG4gIHZhciBlbmRQcm9wID0gZmFsc2U7XG4gIGlmICgvXldlYmtpdC8udGVzdChwcm9wSW4pKSB7XG4gICAgZW5kUHJvcCA9ICd3ZWJraXQnICsgcHJvcE91dCArICdFbmQnO1xuICB9IGVsc2UgaWYgKC9eTy8udGVzdChwcm9wSW4pKSB7XG4gICAgZW5kUHJvcCA9ICdvJyArIHByb3BPdXQgKyAnRW5kJztcbiAgfSBlbHNlIGlmIChwcm9wSW4pIHtcbiAgICBlbmRQcm9wID0gcHJvcE91dC50b0xvd2VyQ2FzZSgpICsgJ2VuZCc7XG4gIH1cbiAgcmV0dXJuIGVuZFByb3A7XG59XG5cbi8vIFRlc3QgdmlhIGEgZ2V0dGVyIGluIHRoZSBvcHRpb25zIG9iamVjdCB0byBzZWUgaWYgdGhlIHBhc3NpdmUgcHJvcGVydHkgaXMgYWNjZXNzZWRcbnZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcbnRyeSB7XG4gIHZhciBvcHRzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIiwgbnVsbCwgb3B0cyk7XG59IGNhdGNoIChlKSB7fVxudmFyIHBhc3NpdmVPcHRpb24gPSBzdXBwb3J0c1Bhc3NpdmUgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlO1xuXG5mdW5jdGlvbiBhZGRFdmVudHMoZWwsIG9iaiwgcHJldmVudFNjcm9sbGluZykge1xuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwICYmICFwcmV2ZW50U2Nyb2xsaW5nID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50cyhlbCwgb2JqKSB7XG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgdmFyIG9wdGlvbiA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnXS5pbmRleE9mKHByb3ApID49IDAgPyBwYXNzaXZlT3B0aW9uIDogZmFsc2U7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihwcm9wLCBvYmpbcHJvcF0sIG9wdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gRXZlbnRzKCkge1xuICByZXR1cm4ge1xuICAgIHRvcGljczoge30sXG4gICAgb246IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdID0gdGhpcy50b3BpY3NbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgIGRhdGEudHlwZSA9IGV2ZW50TmFtZTtcbiAgICAgIGlmICh0aGlzLnRvcGljc1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgIGZuKGRhdGEsIGV2ZW50TmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24ganNUcmFuc2Zvcm0oZWxlbWVudCwgYXR0ciwgcHJlZml4LCBwb3N0Zml4LCB0bywgZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciB0aWNrID0gTWF0aC5taW4oZHVyYXRpb24sIDEwKSxcbiAgICAgIHVuaXQgPSAodG8uaW5kZXhPZignJScpID49IDApID8gJyUnIDogJ3B4JyxcbiAgICAgIHRvID0gdG8ucmVwbGFjZSh1bml0LCAnJyksXG4gICAgICBmcm9tID0gTnVtYmVyKGVsZW1lbnQuc3R5bGVbYXR0cl0ucmVwbGFjZShwcmVmaXgsICcnKS5yZXBsYWNlKHBvc3RmaXgsICcnKS5yZXBsYWNlKHVuaXQsICcnKSksXG4gICAgICBwb3NpdGlvblRpY2sgPSAodG8gLSBmcm9tKSAvIGR1cmF0aW9uICogdGljayxcbiAgICAgIHJ1bm5pbmc7XG5cbiAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7XG4gIGZ1bmN0aW9uIG1vdmVFbGVtZW50KCkge1xuICAgIGR1cmF0aW9uIC09IHRpY2s7XG4gICAgZnJvbSArPSBwb3NpdGlvblRpY2s7XG4gICAgZWxlbWVudC5zdHlsZVthdHRyXSA9IHByZWZpeCArIGZyb20gKyB1bml0ICsgcG9zdGZpeDtcbiAgICBpZiAoZHVyYXRpb24gPiAwKSB7IFxuICAgICAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7IFxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgdG5zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gZXh0ZW5kKHtcbiAgICBjb250YWluZXI6ICcuc2xpZGVyJyxcbiAgICBtb2RlOiAnY2Fyb3VzZWwnLFxuICAgIGF4aXM6ICdob3Jpem9udGFsJyxcbiAgICBpdGVtczogMSxcbiAgICBndXR0ZXI6IDAsXG4gICAgZWRnZVBhZGRpbmc6IDAsXG4gICAgZml4ZWRXaWR0aDogZmFsc2UsXG4gICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICB2aWV3cG9ydE1heDogZmFsc2UsXG4gICAgc2xpZGVCeTogMSxcbiAgICBjZW50ZXI6IGZhbHNlLFxuICAgIGNvbnRyb2xzOiB0cnVlLFxuICAgIGNvbnRyb2xzUG9zaXRpb246ICd0b3AnLFxuICAgIGNvbnRyb2xzVGV4dDogWydwcmV2JywgJ25leHQnXSxcbiAgICBjb250cm9sc0NvbnRhaW5lcjogZmFsc2UsXG4gICAgcHJldkJ1dHRvbjogZmFsc2UsXG4gICAgbmV4dEJ1dHRvbjogZmFsc2UsXG4gICAgbmF2OiB0cnVlLFxuICAgIG5hdlBvc2l0aW9uOiAndG9wJyxcbiAgICBuYXZDb250YWluZXI6IGZhbHNlLFxuICAgIG5hdkFzVGh1bWJuYWlsczogZmFsc2UsXG4gICAgYXJyb3dLZXlzOiBmYWxzZSxcbiAgICBzcGVlZDogMzAwLFxuICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICBhdXRvcGxheVBvc2l0aW9uOiAndG9wJyxcbiAgICBhdXRvcGxheVRpbWVvdXQ6IDUwMDAsXG4gICAgYXV0b3BsYXlEaXJlY3Rpb246ICdmb3J3YXJkJyxcbiAgICBhdXRvcGxheVRleHQ6IFsnc3RhcnQnLCAnc3RvcCddLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogZmFsc2UsXG4gICAgYXV0b3BsYXlCdXR0b246IGZhbHNlLFxuICAgIGF1dG9wbGF5QnV0dG9uT3V0cHV0OiB0cnVlLFxuICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiAndG5zLWZhZGVJbicsXG4gICAgYW5pbWF0ZU91dDogJ3Rucy1mYWRlT3V0JyxcbiAgICBhbmltYXRlTm9ybWFsOiAndG5zLW5vcm1hbCcsXG4gICAgYW5pbWF0ZURlbGF5OiBmYWxzZSxcbiAgICBsb29wOiB0cnVlLFxuICAgIHJld2luZDogZmFsc2UsXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXG4gICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgbGF6eWxvYWQ6IGZhbHNlLFxuICAgIGxhenlsb2FkU2VsZWN0b3I6ICcudG5zLWxhenktaW1nJyxcbiAgICB0b3VjaDogdHJ1ZSxcbiAgICBtb3VzZURyYWc6IGZhbHNlLFxuICAgIHN3aXBlQW5nbGU6IDE1LFxuICAgIG5lc3RlZDogZmFsc2UsXG4gICAgcHJldmVudEFjdGlvbldoZW5SdW5uaW5nOiBmYWxzZSxcbiAgICBwcmV2ZW50U2Nyb2xsT25Ub3VjaDogZmFsc2UsXG4gICAgZnJlZXphYmxlOiB0cnVlLFxuICAgIG9uSW5pdDogZmFsc2UsXG4gICAgdXNlTG9jYWxTdG9yYWdlOiB0cnVlXG4gIH0sIG9wdGlvbnMgfHwge30pO1xuICBcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgd2luID0gd2luZG93LFxuICAgICAgS0VZUyA9IHtcbiAgICAgICAgRU5URVI6IDEzLFxuICAgICAgICBTUEFDRTogMzIsXG4gICAgICAgIExFRlQ6IDM3LFxuICAgICAgICBSSUdIVDogMzlcbiAgICAgIH0sXG4gICAgICB0bnNTdG9yYWdlID0ge30sXG4gICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBvcHRpb25zLnVzZUxvY2FsU3RvcmFnZTtcblxuICBpZiAobG9jYWxTdG9yYWdlQWNjZXNzKSB7XG4gICAgLy8gY2hlY2sgYnJvd3NlciB2ZXJzaW9uIGFuZCBsb2NhbCBzdG9yYWdlIGFjY2Vzc1xuICAgIHZhciBicm93c2VySW5mbyA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgdmFyIHVpZCA9IG5ldyBEYXRlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRuc1N0b3JhZ2UgPSB3aW4ubG9jYWxTdG9yYWdlO1xuICAgICAgaWYgKHRuc1N0b3JhZ2UpIHtcbiAgICAgICAgdG5zU3RvcmFnZS5zZXRJdGVtKHVpZCwgdWlkKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gdG5zU3RvcmFnZS5nZXRJdGVtKHVpZCkgPT0gdWlkO1xuICAgICAgICB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0odWlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2VBY2Nlc3MpIHsgdG5zU3RvcmFnZSA9IHt9OyB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlQWNjZXNzKSB7XG4gICAgICAvLyByZW1vdmUgc3RvcmFnZSB3aGVuIGJyb3dzZXIgdmVyc2lvbiBjaGFuZ2VzXG4gICAgICBpZiAodG5zU3RvcmFnZVsndG5zQXBwJ10gJiYgdG5zU3RvcmFnZVsndG5zQXBwJ10gIT09IGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIFsndEMnLCAndFBMJywgJ3RNUScsICd0VGYnLCAndDNEJywgJ3RURHUnLCAndFREZScsICd0QUR1JywgJ3RBRGUnLCAndFRFJywgJ3RBRSddLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0oaXRlbSk7IH0pO1xuICAgICAgfVxuICAgICAgLy8gdXBkYXRlIGJyb3dzZXJJbmZvXG4gICAgICBsb2NhbFN0b3JhZ2VbJ3Ruc0FwcCddID0gYnJvd3NlckluZm87XG4gICAgfVxuICB9XG5cbiAgdmFyIENBTEMgPSB0bnNTdG9yYWdlWyd0QyddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEMnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RDJywgY2FsYygpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgUEVSQ0VOVEFHRUxBWU9VVCA9IHRuc1N0b3JhZ2VbJ3RQTCddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFBMJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0UEwnLCBwZXJjZW50YWdlTGF5b3V0KCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBDU1NNUSA9IHRuc1N0b3JhZ2VbJ3RNUSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndE1RJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0TVEnLCBtZWRpYXF1ZXJ5U3VwcG9ydCgpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNGT1JNID0gdG5zU3RvcmFnZVsndFRmJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VGYnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RUZicsIHdoaWNoUHJvcGVydHkoJ3RyYW5zZm9ybScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgSEFTM0RUUkFOU0ZPUk1TID0gdG5zU3RvcmFnZVsndDNEJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0M0QnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3QzRCcsIGhhczNEVHJhbnNmb3JtcyhUUkFOU0ZPUk0pLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkRVUkFUSU9OID0gdG5zU3RvcmFnZVsndFREdSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFREdSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFREdScsIHdoaWNoUHJvcGVydHkoJ3RyYW5zaXRpb25EdXJhdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgVFJBTlNJVElPTkRFTEFZID0gdG5zU3RvcmFnZVsndFREZSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFREZSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFREZScsIHdoaWNoUHJvcGVydHkoJ3RyYW5zaXRpb25EZWxheScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9ORFVSQVRJT04gPSB0bnNTdG9yYWdlWyd0QUR1J10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QUR1J10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUR1Jywgd2hpY2hQcm9wZXJ0eSgnYW5pbWF0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkRFTEFZID0gdG5zU3RvcmFnZVsndEFEZSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFEZSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEFEZScsIHdoaWNoUHJvcGVydHkoJ2FuaW1hdGlvbkRlbGF5JyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9ORU5EID0gdG5zU3RvcmFnZVsndFRFJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VEUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURScsIGdldEVuZFByb3BlcnR5KFRSQU5TSVRJT05EVVJBVElPTiwgJ1RyYW5zaXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIEFOSU1BVElPTkVORCA9IHRuc1N0b3JhZ2VbJ3RBRSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFFJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUUnLCBnZXRFbmRQcm9wZXJ0eShBTklNQVRJT05EVVJBVElPTiwgJ0FuaW1hdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpO1xuXG4gIC8vIGdldCBlbGVtZW50IG5vZGVzIGZyb20gc2VsZWN0b3JzXG4gIHZhciBzdXBwb3J0Q29uc29sZVdhcm4gPSB3aW4uY29uc29sZSAmJiB0eXBlb2Ygd2luLmNvbnNvbGUud2FybiA9PT0gXCJmdW5jdGlvblwiLFxuICAgICAgdG5zTGlzdCA9IFsnY29udGFpbmVyJywgJ2NvbnRyb2xzQ29udGFpbmVyJywgJ3ByZXZCdXR0b24nLCAnbmV4dEJ1dHRvbicsICduYXZDb250YWluZXInLCAnYXV0b3BsYXlCdXR0b24nXSwgXG4gICAgICBvcHRpb25zRWxlbWVudHMgPSB7fTtcbiAgICAgIFxuICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tpdGVtXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBzdHIgPSBvcHRpb25zW2l0ZW1dLFxuICAgICAgICAgIGVsID0gZG9jLnF1ZXJ5U2VsZWN0b3Ioc3RyKTtcbiAgICAgIG9wdGlvbnNFbGVtZW50c1tpdGVtXSA9IHN0cjtcblxuICAgICAgaWYgKGVsICYmIGVsLm5vZGVOYW1lKSB7XG4gICAgICAgIG9wdGlvbnNbaXRlbV0gPSBlbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdDYW5cXCd0IGZpbmQnLCBvcHRpb25zW2l0ZW1dKTsgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBtYWtlIHN1cmUgYXQgbGVhc3QgMSBzbGlkZVxuICBpZiAob3B0aW9ucy5jb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdObyBzbGlkZXMgZm91bmQgaW4nLCBvcHRpb25zLmNvbnRhaW5lcik7IH1cbiAgICByZXR1cm47XG4gICB9XG5cbiAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgdmFyIHJlc3BvbnNpdmUgPSBvcHRpb25zLnJlc3BvbnNpdmUsXG4gICAgICBuZXN0ZWQgPSBvcHRpb25zLm5lc3RlZCxcbiAgICAgIGNhcm91c2VsID0gb3B0aW9ucy5tb2RlID09PSAnY2Fyb3VzZWwnID8gdHJ1ZSA6IGZhbHNlO1xuXG4gIGlmIChyZXNwb25zaXZlKSB7XG4gICAgLy8gYXBwbHkgcmVzcG9uc2l2ZVswXSB0byBvcHRpb25zIGFuZCByZW1vdmUgaXRcbiAgICBpZiAoMCBpbiByZXNwb25zaXZlKSB7XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMsIHJlc3BvbnNpdmVbMF0pO1xuICAgICAgZGVsZXRlIHJlc3BvbnNpdmVbMF07XG4gICAgfVxuXG4gICAgdmFyIHJlc3BvbnNpdmVUZW0gPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgdmFyIHZhbCA9IHJlc3BvbnNpdmVba2V5XTtcbiAgICAgIC8vIHVwZGF0ZSByZXNwb25zaXZlXG4gICAgICAvLyBmcm9tOiAzMDA6IDJcbiAgICAgIC8vIHRvOiBcbiAgICAgIC8vICAgMzAwOiB7IFxuICAgICAgLy8gICAgIGl0ZW1zOiAyIFxuICAgICAgLy8gICB9IFxuICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyB7aXRlbXM6IHZhbH0gOiB2YWw7XG4gICAgICByZXNwb25zaXZlVGVtW2tleV0gPSB2YWw7XG4gICAgfVxuICAgIHJlc3BvbnNpdmUgPSByZXNwb25zaXZlVGVtO1xuICAgIHJlc3BvbnNpdmVUZW0gPSBudWxsO1xuICB9XG5cbiAgLy8gdXBkYXRlIG9wdGlvbnNcbiAgZnVuY3Rpb24gdXBkYXRlT3B0aW9ucyAob2JqKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoa2V5ID09PSAnc2xpZGVCeScpIHsgb2JqW2tleV0gPSAncGFnZSc7IH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2VkZ2VQYWRkaW5nJykgeyBvYmpba2V5XSA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChrZXkgPT09ICdhdXRvSGVpZ2h0JykgeyBvYmpba2V5XSA9IGZhbHNlOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSByZXNwb25zaXZlIG9wdGlvbnNcbiAgICAgIGlmIChrZXkgPT09ICdyZXNwb25zaXZlJykgeyB1cGRhdGVPcHRpb25zKG9ialtrZXldKTsgfVxuICAgIH1cbiAgfVxuICBpZiAoIWNhcm91c2VsKSB7IHVwZGF0ZU9wdGlvbnMob3B0aW9ucyk7IH1cblxuXG4gIC8vID09PSBkZWZpbmUgYW5kIHNldCB2YXJpYWJsZXMgPT09XG4gIGlmICghY2Fyb3VzZWwpIHtcbiAgICBvcHRpb25zLmF4aXMgPSAnaG9yaXpvbnRhbCc7XG4gICAgb3B0aW9ucy5zbGlkZUJ5ID0gJ3BhZ2UnO1xuICAgIG9wdGlvbnMuZWRnZVBhZGRpbmcgPSBmYWxzZTtcblxuICAgIHZhciBhbmltYXRlSW4gPSBvcHRpb25zLmFuaW1hdGVJbixcbiAgICAgICAgYW5pbWF0ZU91dCA9IG9wdGlvbnMuYW5pbWF0ZU91dCxcbiAgICAgICAgYW5pbWF0ZURlbGF5ID0gb3B0aW9ucy5hbmltYXRlRGVsYXksXG4gICAgICAgIGFuaW1hdGVOb3JtYWwgPSBvcHRpb25zLmFuaW1hdGVOb3JtYWw7XG4gIH1cblxuICB2YXIgaG9yaXpvbnRhbCA9IG9wdGlvbnMuYXhpcyA9PT0gJ2hvcml6b250YWwnID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgb3V0ZXJXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgaW5uZXJXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgbWlkZGxlV3JhcHBlcixcbiAgICAgIGNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyLFxuICAgICAgY29udGFpbmVyUGFyZW50ID0gY29udGFpbmVyLnBhcmVudE5vZGUsXG4gICAgICBjb250YWluZXJIVE1MID0gY29udGFpbmVyLm91dGVySFRNTCxcbiAgICAgIHNsaWRlSXRlbXMgPSBjb250YWluZXIuY2hpbGRyZW4sXG4gICAgICBzbGlkZUNvdW50ID0gc2xpZGVJdGVtcy5sZW5ndGgsXG4gICAgICBicmVha3BvaW50Wm9uZSxcbiAgICAgIHdpbmRvd1dpZHRoID0gZ2V0V2luZG93V2lkdGgoKSxcbiAgICAgIGlzT24gPSBmYWxzZTtcbiAgaWYgKHJlc3BvbnNpdmUpIHsgc2V0QnJlYWtwb2ludFpvbmUoKTsgfVxuICBpZiAoY2Fyb3VzZWwpIHsgY29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRucy12cGZpeCc7IH1cblxuICAvLyBmaXhlZFdpZHRoOiB2aWV3cG9ydCA+IHJpZ2h0Qm91bmRhcnkgPiBpbmRleE1heFxuICB2YXIgYXV0b1dpZHRoID0gb3B0aW9ucy5hdXRvV2lkdGgsXG4gICAgICBmaXhlZFdpZHRoID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJyksXG4gICAgICBlZGdlUGFkZGluZyA9IGdldE9wdGlvbignZWRnZVBhZGRpbmcnKSxcbiAgICAgIGd1dHRlciA9IGdldE9wdGlvbignZ3V0dGVyJyksXG4gICAgICB2aWV3cG9ydCA9IGdldFZpZXdwb3J0V2lkdGgoKSxcbiAgICAgIGNlbnRlciA9IGdldE9wdGlvbignY2VudGVyJyksXG4gICAgICBpdGVtcyA9ICFhdXRvV2lkdGggPyBNYXRoLmZsb29yKGdldE9wdGlvbignaXRlbXMnKSkgOiAxLFxuICAgICAgc2xpZGVCeSA9IGdldE9wdGlvbignc2xpZGVCeScpLFxuICAgICAgdmlld3BvcnRNYXggPSBvcHRpb25zLnZpZXdwb3J0TWF4IHx8IG9wdGlvbnMuZml4ZWRXaWR0aFZpZXdwb3J0V2lkdGgsXG4gICAgICBhcnJvd0tleXMgPSBnZXRPcHRpb24oJ2Fycm93S2V5cycpLFxuICAgICAgc3BlZWQgPSBnZXRPcHRpb24oJ3NwZWVkJyksXG4gICAgICByZXdpbmQgPSBvcHRpb25zLnJld2luZCxcbiAgICAgIGxvb3AgPSByZXdpbmQgPyBmYWxzZSA6IG9wdGlvbnMubG9vcCxcbiAgICAgIGF1dG9IZWlnaHQgPSBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnKSxcbiAgICAgIGNvbnRyb2xzID0gZ2V0T3B0aW9uKCdjb250cm9scycpLFxuICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKSxcbiAgICAgIG5hdiA9IGdldE9wdGlvbignbmF2JyksXG4gICAgICB0b3VjaCA9IGdldE9wdGlvbigndG91Y2gnKSxcbiAgICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyksXG4gICAgICBhdXRvcGxheSA9IGdldE9wdGlvbignYXV0b3BsYXknKSxcbiAgICAgIGF1dG9wbGF5VGltZW91dCA9IGdldE9wdGlvbignYXV0b3BsYXlUaW1lb3V0JyksXG4gICAgICBhdXRvcGxheVRleHQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGV4dCcpLFxuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID0gZ2V0T3B0aW9uKCdhdXRvcGxheUhvdmVyUGF1c2UnKSxcbiAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5UmVzZXRPblZpc2liaWxpdHknKSxcbiAgICAgIHNoZWV0ID0gY3JlYXRlU3R5bGVTaGVldCgpLFxuICAgICAgbGF6eWxvYWQgPSBvcHRpb25zLmxhenlsb2FkLFxuICAgICAgbGF6eWxvYWRTZWxlY3RvciA9IG9wdGlvbnMubGF6eWxvYWRTZWxlY3RvcixcbiAgICAgIHNsaWRlUG9zaXRpb25zLCAvLyBjb2xsZWN0aW9uIG9mIHNsaWRlIHBvc2l0aW9uc1xuICAgICAgc2xpZGVJdGVtc091dCA9IFtdLFxuICAgICAgY2xvbmVDb3VudCA9IGxvb3AgPyBnZXRDbG9uZUNvdW50Rm9yTG9vcCgpIDogMCxcbiAgICAgIHNsaWRlQ291bnROZXcgPSAhY2Fyb3VzZWwgPyBzbGlkZUNvdW50ICsgY2xvbmVDb3VudCA6IHNsaWRlQ291bnQgKyBjbG9uZUNvdW50ICogMixcbiAgICAgIGhhc1JpZ2h0RGVhZFpvbmUgPSAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpICYmICFsb29wID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgcmlnaHRCb3VuZGFyeSA9IGZpeGVkV2lkdGggPyBnZXRSaWdodEJvdW5kYXJ5KCkgOiBudWxsLFxuICAgICAgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSAoIWNhcm91c2VsIHx8ICFsb29wKSA/IHRydWUgOiBmYWxzZSxcbiAgICAgIC8vIHRyYW5zZm9ybVxuICAgICAgdHJhbnNmb3JtQXR0ciA9IGhvcml6b250YWwgPyAnbGVmdCcgOiAndG9wJyxcbiAgICAgIHRyYW5zZm9ybVByZWZpeCA9ICcnLFxuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcnLFxuICAgICAgLy8gaW5kZXhcbiAgICAgIGdldEluZGV4TWF4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBjZW50ZXIgJiYgIWxvb3AgPyBzbGlkZUNvdW50IC0gMSA6IE1hdGguY2VpbCgtIHJpZ2h0Qm91bmRhcnkgLyAoZml4ZWRXaWR0aCArIGd1dHRlcikpOyB9O1xuICAgICAgICB9IGVsc2UgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzbGlkZUNvdW50TmV3OyBpLS07KSB7XG4gICAgICAgICAgICAgIGlmIChzbGlkZVBvc2l0aW9uc1tpXSA+PSAtIHJpZ2h0Qm91bmRhcnkpIHsgcmV0dXJuIGk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjZW50ZXIgJiYgY2Fyb3VzZWwgJiYgIWxvb3ApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNsaWRlQ291bnQgLSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGxvb3AgfHwgY2Fyb3VzZWwgPyBNYXRoLm1heCgwLCBzbGlkZUNvdW50TmV3IC0gTWF0aC5jZWlsKGl0ZW1zKSkgOiBzbGlkZUNvdW50TmV3IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KSgpLFxuICAgICAgaW5kZXggPSBnZXRTdGFydEluZGV4KGdldE9wdGlvbignc3RhcnRJbmRleCcpKSxcbiAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXgsXG4gICAgICBkaXNwbGF5SW5kZXggPSBnZXRDdXJyZW50U2xpZGUoKSxcbiAgICAgIGluZGV4TWluID0gMCxcbiAgICAgIGluZGV4TWF4ID0gIWF1dG9XaWR0aCA/IGdldEluZGV4TWF4KCkgOiBudWxsLFxuICAgICAgLy8gcmVzaXplXG4gICAgICByZXNpemVUaW1lcixcbiAgICAgIHByZXZlbnRBY3Rpb25XaGVuUnVubmluZyA9IG9wdGlvbnMucHJldmVudEFjdGlvbldoZW5SdW5uaW5nLFxuICAgICAgc3dpcGVBbmdsZSA9IG9wdGlvbnMuc3dpcGVBbmdsZSxcbiAgICAgIG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IHN3aXBlQW5nbGUgPyAnPycgOiB0cnVlLFxuICAgICAgcnVubmluZyA9IGZhbHNlLFxuICAgICAgb25Jbml0ID0gb3B0aW9ucy5vbkluaXQsXG4gICAgICBldmVudHMgPSBuZXcgRXZlbnRzKCksXG4gICAgICAvLyBpZCwgY2xhc3NcbiAgICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgPSAnIHRucy1zbGlkZXIgdG5zLScgKyBvcHRpb25zLm1vZGUsXG4gICAgICBzbGlkZUlkID0gY29udGFpbmVyLmlkIHx8IGdldFNsaWRlSWQoKSxcbiAgICAgIGRpc2FibGUgPSBnZXRPcHRpb24oJ2Rpc2FibGUnKSxcbiAgICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgICBmcmVlemFibGUgPSBvcHRpb25zLmZyZWV6YWJsZSxcbiAgICAgIGZyZWV6ZSA9IGZyZWV6YWJsZSAmJiAhYXV0b1dpZHRoID8gZ2V0RnJlZXplKCkgOiBmYWxzZSxcbiAgICAgIGZyb3plbiA9IGZhbHNlLFxuICAgICAgY29udHJvbHNFdmVudHMgPSB7XG4gICAgICAgICdjbGljayc6IG9uQ29udHJvbHNDbGljayxcbiAgICAgICAgJ2tleWRvd24nOiBvbkNvbnRyb2xzS2V5ZG93blxuICAgICAgfSxcbiAgICAgIG5hdkV2ZW50cyA9IHtcbiAgICAgICAgJ2NsaWNrJzogb25OYXZDbGljayxcbiAgICAgICAgJ2tleWRvd24nOiBvbk5hdktleWRvd25cbiAgICAgIH0sXG4gICAgICBob3ZlckV2ZW50cyA9IHtcbiAgICAgICAgJ21vdXNlb3Zlcic6IG1vdXNlb3ZlclBhdXNlLFxuICAgICAgICAnbW91c2VvdXQnOiBtb3VzZW91dFJlc3RhcnRcbiAgICAgIH0sXG4gICAgICB2aXNpYmlsaXR5RXZlbnQgPSB7J3Zpc2liaWxpdHljaGFuZ2UnOiBvblZpc2liaWxpdHlDaGFuZ2V9LFxuICAgICAgZG9jbWVudEtleWRvd25FdmVudCA9IHsna2V5ZG93bic6IG9uRG9jdW1lbnRLZXlkb3dufSxcbiAgICAgIHRvdWNoRXZlbnRzID0ge1xuICAgICAgICAndG91Y2hzdGFydCc6IG9uUGFuU3RhcnQsXG4gICAgICAgICd0b3VjaG1vdmUnOiBvblBhbk1vdmUsXG4gICAgICAgICd0b3VjaGVuZCc6IG9uUGFuRW5kLFxuICAgICAgICAndG91Y2hjYW5jZWwnOiBvblBhbkVuZFxuICAgICAgfSwgZHJhZ0V2ZW50cyA9IHtcbiAgICAgICAgJ21vdXNlZG93bic6IG9uUGFuU3RhcnQsXG4gICAgICAgICdtb3VzZW1vdmUnOiBvblBhbk1vdmUsXG4gICAgICAgICdtb3VzZXVwJzogb25QYW5FbmQsXG4gICAgICAgICdtb3VzZWxlYXZlJzogb25QYW5FbmRcbiAgICAgIH0sXG4gICAgICBoYXNDb250cm9scyA9IGhhc09wdGlvbignY29udHJvbHMnKSxcbiAgICAgIGhhc05hdiA9IGhhc09wdGlvbignbmF2JyksXG4gICAgICBuYXZBc1RodW1ibmFpbHMgPSBhdXRvV2lkdGggPyB0cnVlIDogb3B0aW9ucy5uYXZBc1RodW1ibmFpbHMsXG4gICAgICBoYXNBdXRvcGxheSA9IGhhc09wdGlvbignYXV0b3BsYXknKSxcbiAgICAgIGhhc1RvdWNoID0gaGFzT3B0aW9uKCd0b3VjaCcpLFxuICAgICAgaGFzTW91c2VEcmFnID0gaGFzT3B0aW9uKCdtb3VzZURyYWcnKSxcbiAgICAgIHNsaWRlQWN0aXZlQ2xhc3MgPSAndG5zLXNsaWRlLWFjdGl2ZScsXG4gICAgICBpbWdDb21wbGV0ZUNsYXNzID0gJ3Rucy1jb21wbGV0ZScsXG4gICAgICBpbWdFdmVudHMgPSB7XG4gICAgICAgICdsb2FkJzogb25JbWdMb2FkZWQsXG4gICAgICAgICdlcnJvcic6IG9uSW1nRmFpbGVkXG4gICAgICB9LFxuICAgICAgaW1nc0NvbXBsZXRlLFxuICAgICAgbGl2ZXJlZ2lvbkN1cnJlbnQsXG4gICAgICBwcmV2ZW50U2Nyb2xsID0gb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCA9PT0gJ2ZvcmNlJyA/IHRydWUgOiBmYWxzZTtcblxuICAvLyBjb250cm9sc1xuICBpZiAoaGFzQ29udHJvbHMpIHtcbiAgICB2YXIgY29udHJvbHNDb250YWluZXIgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyLFxuICAgICAgICBjb250cm9sc0NvbnRhaW5lckhUTUwgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyID8gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgcHJldkJ1dHRvbiA9IG9wdGlvbnMucHJldkJ1dHRvbixcbiAgICAgICAgbmV4dEJ1dHRvbiA9IG9wdGlvbnMubmV4dEJ1dHRvbixcbiAgICAgICAgcHJldkJ1dHRvbkhUTUwgPSBvcHRpb25zLnByZXZCdXR0b24gPyBvcHRpb25zLnByZXZCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIG5leHRCdXR0b25IVE1MID0gb3B0aW9ucy5uZXh0QnV0dG9uID8gb3B0aW9ucy5uZXh0QnV0dG9uLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBwcmV2SXNCdXR0b24sXG4gICAgICAgIG5leHRJc0J1dHRvbjtcbiAgfVxuXG4gIC8vIG5hdlxuICBpZiAoaGFzTmF2KSB7XG4gICAgdmFyIG5hdkNvbnRhaW5lciA9IG9wdGlvbnMubmF2Q29udGFpbmVyLFxuICAgICAgICBuYXZDb250YWluZXJIVE1MID0gb3B0aW9ucy5uYXZDb250YWluZXIgPyBvcHRpb25zLm5hdkNvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgbmF2SXRlbXMsXG4gICAgICAgIHBhZ2VzID0gYXV0b1dpZHRoID8gc2xpZGVDb3VudCA6IGdldFBhZ2VzKCksXG4gICAgICAgIHBhZ2VzQ2FjaGVkID0gMCxcbiAgICAgICAgbmF2Q2xpY2tlZCA9IC0xLFxuICAgICAgICBuYXZDdXJyZW50SW5kZXggPSBnZXRDdXJyZW50TmF2SW5kZXgoKSxcbiAgICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2Q3VycmVudEluZGV4LFxuICAgICAgICBuYXZBY3RpdmVDbGFzcyA9ICd0bnMtbmF2LWFjdGl2ZScsXG4gICAgICAgIG5hdlN0ciA9ICdDYXJvdXNlbCBQYWdlICcsXG4gICAgICAgIG5hdlN0ckN1cnJlbnQgPSAnIChDdXJyZW50IFNsaWRlKSc7XG4gIH1cblxuICAvLyBhdXRvcGxheVxuICBpZiAoaGFzQXV0b3BsYXkpIHtcbiAgICB2YXIgYXV0b3BsYXlEaXJlY3Rpb24gPSBvcHRpb25zLmF1dG9wbGF5RGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyAxIDogLTEsXG4gICAgICAgIGF1dG9wbGF5QnV0dG9uID0gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbixcbiAgICAgICAgYXV0b3BsYXlCdXR0b25IVE1MID0gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbiA/IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIGF1dG9wbGF5SHRtbFN0cmluZ3MgPSBbJzxzcGFuIGNsYXNzPVxcJ3Rucy12aXN1YWxseS1oaWRkZW5cXCc+JywgJyBhbmltYXRpb248L3NwYW4+J10sXG4gICAgICAgIGF1dG9wbGF5VGltZXIsXG4gICAgICAgIGFuaW1hdGluZyxcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCxcbiAgICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkLFxuICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQ7XG4gIH1cblxuICBpZiAoaGFzVG91Y2ggfHwgaGFzTW91c2VEcmFnKSB7XG4gICAgdmFyIGluaXRQb3NpdGlvbiA9IHt9LFxuICAgICAgICBsYXN0UG9zaXRpb24gPSB7fSxcbiAgICAgICAgdHJhbnNsYXRlSW5pdCxcbiAgICAgICAgZGlzWCxcbiAgICAgICAgZGlzWSxcbiAgICAgICAgcGFuU3RhcnQgPSBmYWxzZSxcbiAgICAgICAgcmFmSW5kZXgsXG4gICAgICAgIGdldERpc3QgPSBob3Jpem9udGFsID8gXG4gICAgICAgICAgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS54IC0gYi54OyB9IDpcbiAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnkgLSBiLnk7IH07XG4gIH1cbiAgXG4gIC8vIGRpc2FibGUgc2xpZGVyIHdoZW4gc2xpZGVjb3VudCA8PSBpdGVtc1xuICBpZiAoIWF1dG9XaWR0aCkgeyByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpOyB9XG5cbiAgaWYgKFRSQU5TRk9STSkge1xuICAgIHRyYW5zZm9ybUF0dHIgPSBUUkFOU0ZPUk07XG4gICAgdHJhbnNmb3JtUHJlZml4ID0gJ3RyYW5zbGF0ZSc7XG5cbiAgICBpZiAoSEFTM0RUUkFOU0ZPUk1TKSB7XG4gICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICczZCgnIDogJzNkKDBweCwgJztcbiAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSBob3Jpem9udGFsID8gJywgMHB4LCAwcHgpJyA6ICcsIDBweCknO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICdYKCcgOiAnWSgnO1xuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcpJztcbiAgICB9XG5cbiAgfVxuXG4gIGlmIChjYXJvdXNlbCkgeyBjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCd0bnMtdnBmaXgnLCAnJyk7IH1cbiAgaW5pdFN0cnVjdHVyZSgpO1xuICBpbml0U2hlZXQoKTtcbiAgaW5pdFNsaWRlclRyYW5zZm9ybSgpO1xuXG4gIC8vID09PSBDT01NT04gRlVOQ1RJT05TID09PSAvL1xuICBmdW5jdGlvbiByZXNldFZhcmlibGVzV2hlbkRpc2FibGUgKGNvbmRpdGlvbikge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIGNvbnRyb2xzID0gbmF2ID0gdG91Y2ggPSBtb3VzZURyYWcgPSBhcnJvd0tleXMgPSBhdXRvcGxheSA9IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50U2xpZGUgKCkge1xuICAgIHZhciB0ZW0gPSBjYXJvdXNlbCA/IGluZGV4IC0gY2xvbmVDb3VudCA6IGluZGV4O1xuICAgIHdoaWxlICh0ZW0gPCAwKSB7IHRlbSArPSBzbGlkZUNvdW50OyB9XG4gICAgcmV0dXJuIHRlbSVzbGlkZUNvdW50ICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFN0YXJ0SW5kZXggKGluZCkge1xuICAgIGluZCA9IGluZCA/IE1hdGgubWF4KDAsIE1hdGgubWluKGxvb3AgPyBzbGlkZUNvdW50IC0gMSA6IHNsaWRlQ291bnQgLSBpdGVtcywgaW5kKSkgOiAwO1xuICAgIHJldHVybiBjYXJvdXNlbCA/IGluZCArIGNsb25lQ291bnQgOiBpbmQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBYnNJbmRleCAoaSkge1xuICAgIGlmIChpID09IG51bGwpIHsgaSA9IGluZGV4OyB9XG5cbiAgICBpZiAoY2Fyb3VzZWwpIHsgaSAtPSBjbG9uZUNvdW50OyB9XG4gICAgd2hpbGUgKGkgPCAwKSB7IGkgKz0gc2xpZGVDb3VudDsgfVxuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoaSVzbGlkZUNvdW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnROYXZJbmRleCAoKSB7XG4gICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgcmVzdWx0ID0gbmF2QXNUaHVtYm5haWxzID8gYWJzSW5kZXggOiBcbiAgICAgIGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoID8gTWF0aC5jZWlsKChhYnNJbmRleCArIDEpICogcGFnZXMgLyBzbGlkZUNvdW50IC0gMSkgOiBcbiAgICAgICAgICBNYXRoLmZsb29yKGFic0luZGV4IC8gaXRlbXMpO1xuXG4gICAgLy8gc2V0IGFjdGl2ZSBuYXYgdG8gdGhlIGxhc3Qgb25lIHdoZW4gcmVhY2hlcyB0aGUgcmlnaHQgZWRnZVxuICAgIGlmICghbG9vcCAmJiBjYXJvdXNlbCAmJiBpbmRleCA9PT0gaW5kZXhNYXgpIHsgcmVzdWx0ID0gcGFnZXMgLSAxOyB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXRlbXNNYXggKCkge1xuICAgIC8vIGZpeGVkV2lkdGggb3IgYXV0b1dpZHRoIHdoaWxlIHZpZXdwb3J0TWF4IGlzIG5vdCBhdmFpbGFibGVcbiAgICBpZiAoYXV0b1dpZHRoIHx8IChmaXhlZFdpZHRoICYmICF2aWV3cG9ydE1heCkpIHtcbiAgICAgIHJldHVybiBzbGlkZUNvdW50IC0gMTtcbiAgICAvLyBtb3N0IGNhc2VzXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdHIgPSBmaXhlZFdpZHRoID8gJ2ZpeGVkV2lkdGgnIDogJ2l0ZW1zJyxcbiAgICAgICAgICBhcnIgPSBbXTtcblxuICAgICAgaWYgKGZpeGVkV2lkdGggfHwgb3B0aW9uc1tzdHJdIDwgc2xpZGVDb3VudCkgeyBhcnIucHVzaChvcHRpb25zW3N0cl0pOyB9XG5cbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICB2YXIgdGVtID0gcmVzcG9uc2l2ZVticF1bc3RyXTtcbiAgICAgICAgICBpZiAodGVtICYmIChmaXhlZFdpZHRoIHx8IHRlbSA8IHNsaWRlQ291bnQpKSB7IGFyci5wdXNoKHRlbSk7IH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWFyci5sZW5ndGgpIHsgYXJyLnB1c2goMCk7IH1cblxuICAgICAgcmV0dXJuIE1hdGguY2VpbChmaXhlZFdpZHRoID8gdmlld3BvcnRNYXggLyBNYXRoLm1pbi5hcHBseShudWxsLCBhcnIpIDogTWF0aC5tYXguYXBwbHkobnVsbCwgYXJyKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2xvbmVDb3VudEZvckxvb3AgKCkge1xuICAgIHZhciBpdGVtc01heCA9IGdldEl0ZW1zTWF4KCksXG4gICAgICAgIHJlc3VsdCA9IGNhcm91c2VsID8gTWF0aC5jZWlsKChpdGVtc01heCAqIDUgLSBzbGlkZUNvdW50KS8yKSA6IChpdGVtc01heCAqIDQgLSBzbGlkZUNvdW50KTtcbiAgICByZXN1bHQgPSBNYXRoLm1heChpdGVtc01heCwgcmVzdWx0KTtcblxuICAgIHJldHVybiBoYXNPcHRpb24oJ2VkZ2VQYWRkaW5nJykgPyByZXN1bHQgKyAxIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0V2luZG93V2lkdGggKCkge1xuICAgIHJldHVybiB3aW4uaW5uZXJXaWR0aCB8fCBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvYy5ib2R5LmNsaWVudFdpZHRoO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5zZXJ0UG9zaXRpb24gKHBvcykge1xuICAgIHJldHVybiBwb3MgPT09ICd0b3AnID8gJ2FmdGVyYmVnaW4nIDogJ2JlZm9yZWVuZCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDbGllbnRXaWR0aCAoZWwpIHtcbiAgICB2YXIgZGl2ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCByZWN0LCB3aWR0aDtcbiAgICBlbC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIHJlY3QgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgd2lkdGggPSByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0O1xuICAgIGRpdi5yZW1vdmUoKTtcbiAgICByZXR1cm4gd2lkdGggfHwgZ2V0Q2xpZW50V2lkdGgoZWwucGFyZW50Tm9kZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaWV3cG9ydFdpZHRoICgpIHtcbiAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBlZGdlUGFkZGluZyAqIDIgLSBndXR0ZXIgOiAwO1xuICAgIHJldHVybiBnZXRDbGllbnRXaWR0aChjb250YWluZXJQYXJlbnQpIC0gZ2FwO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzT3B0aW9uIChpdGVtKSB7XG4gICAgaWYgKG9wdGlvbnNbaXRlbV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNpdmVbYnBdW2l0ZW1dKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBnZXQgb3B0aW9uOlxuICAvLyBmaXhlZCB3aWR0aDogdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlciA9PiBpdGVtc1xuICAvLyBvdGhlcnM6IHdpbmRvdyB3aWR0aCA9PiBhbGwgdmFyaWFibGVzXG4gIC8vIGFsbDogaXRlbXMgPT4gc2xpZGVCeVxuICBmdW5jdGlvbiBnZXRPcHRpb24gKGl0ZW0sIHd3KSB7XG4gICAgaWYgKHd3ID09IG51bGwpIHsgd3cgPSB3aW5kb3dXaWR0aDsgfVxuXG4gICAgaWYgKGl0ZW0gPT09ICdpdGVtcycgJiYgZml4ZWRXaWR0aCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHZpZXdwb3J0ICsgZ3V0dGVyKSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSkgfHwgMTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzdWx0ID0gb3B0aW9uc1tpdGVtXTtcblxuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIC8vIGJwOiBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgICBpZiAod3cgPj0gcGFyc2VJbnQoYnApKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbiByZXNwb25zaXZlW2JwXSkgeyByZXN1bHQgPSByZXNwb25zaXZlW2JwXVtpdGVtXTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSA9PT0gJ3NsaWRlQnknICYmIHJlc3VsdCA9PT0gJ3BhZ2UnKSB7IHJlc3VsdCA9IGdldE9wdGlvbignaXRlbXMnKTsgfVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiAoaXRlbSA9PT0gJ3NsaWRlQnknIHx8IGl0ZW0gPT09ICdpdGVtcycpKSB7IHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTsgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlTWFyZ2luTGVmdCAoaSkge1xuICAgIHJldHVybiBDQUxDID8gXG4gICAgICBDQUxDICsgJygnICsgaSAqIDEwMCArICclIC8gJyArIHNsaWRlQ291bnROZXcgKyAnKScgOiBcbiAgICAgIGkgKiAxMDAgLyBzbGlkZUNvdW50TmV3ICsgJyUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzIChlZGdlUGFkZGluZ1RlbSwgZ3V0dGVyVGVtLCBmaXhlZFdpZHRoVGVtLCBzcGVlZFRlbSwgYXV0b0hlaWdodEJQKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuXG4gICAgaWYgKGVkZ2VQYWRkaW5nVGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZ1RlbTtcbiAgICAgIGlmIChndXR0ZXJUZW0pIHsgZ2FwIC09IGd1dHRlclRlbTsgfVxuICAgICAgc3RyID0gaG9yaXpvbnRhbCA/XG4gICAgICAgICdtYXJnaW46IDAgJyArIGdhcCArICdweCAwICcgKyBlZGdlUGFkZGluZ1RlbSArICdweDsnIDpcbiAgICAgICAgJ21hcmdpbjogJyArIGVkZ2VQYWRkaW5nVGVtICsgJ3B4IDAgJyArIGdhcCArICdweCAwOyc7XG4gICAgfSBlbHNlIGlmIChndXR0ZXJUZW0gJiYgIWZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHZhciBndXR0ZXJUZW1Vbml0ID0gJy0nICsgZ3V0dGVyVGVtICsgJ3B4JyxcbiAgICAgICAgICBkaXIgPSBob3Jpem9udGFsID8gZ3V0dGVyVGVtVW5pdCArICcgMCAwJyA6ICcwICcgKyBndXR0ZXJUZW1Vbml0ICsgJyAwJztcbiAgICAgIHN0ciA9ICdtYXJnaW46IDAgJyArIGRpciArICc7JztcbiAgICB9XG5cbiAgICBpZiAoIWNhcm91c2VsICYmIGF1dG9IZWlnaHRCUCAmJiBUUkFOU0lUSU9ORFVSQVRJT04gJiYgc3BlZWRUZW0pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkVGVtKTsgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb250YWluZXJXaWR0aCAoZml4ZWRXaWR0aFRlbSwgZ3V0dGVyVGVtLCBpdGVtc1RlbSkge1xuICAgIGlmIChmaXhlZFdpZHRoVGVtKSB7XG4gICAgICByZXR1cm4gKGZpeGVkV2lkdGhUZW0gKyBndXR0ZXJUZW0pICogc2xpZGVDb3VudE5ldyArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDQUxDID9cbiAgICAgICAgQ0FMQyArICcoJyArIHNsaWRlQ291bnROZXcgKiAxMDAgKyAnJSAvICcgKyBpdGVtc1RlbSArICcpJyA6XG4gICAgICAgIHNsaWRlQ291bnROZXcgKiAxMDAgLyBpdGVtc1RlbSArICclJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZVdpZHRoU3R5bGUgKGZpeGVkV2lkdGhUZW0sIGd1dHRlclRlbSwgaXRlbXNUZW0pIHtcbiAgICB2YXIgd2lkdGg7XG5cbiAgICBpZiAoZml4ZWRXaWR0aFRlbSkge1xuICAgICAgd2lkdGggPSAoZml4ZWRXaWR0aFRlbSArIGd1dHRlclRlbSkgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNhcm91c2VsKSB7IGl0ZW1zVGVtID0gTWF0aC5mbG9vcihpdGVtc1RlbSk7IH1cbiAgICAgIHZhciBkaXZpZGVuZCA9IGNhcm91c2VsID8gc2xpZGVDb3VudE5ldyA6IGl0ZW1zVGVtO1xuICAgICAgd2lkdGggPSBDQUxDID8gXG4gICAgICAgIENBTEMgKyAnKDEwMCUgLyAnICsgZGl2aWRlbmQgKyAnKScgOiBcbiAgICAgICAgMTAwIC8gZGl2aWRlbmQgKyAnJSc7XG4gICAgfVxuXG4gICAgd2lkdGggPSAnd2lkdGg6JyArIHdpZHRoO1xuXG4gICAgLy8gaW5uZXIgc2xpZGVyOiBvdmVyd3JpdGUgb3V0ZXIgc2xpZGVyIHN0eWxlc1xuICAgIHJldHVybiBuZXN0ZWQgIT09ICdpbm5lcicgPyB3aWR0aCArICc7JyA6IHdpZHRoICsgJyAhaW1wb3J0YW50Oyc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZUd1dHRlclN0eWxlIChndXR0ZXJUZW0pIHtcbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICAvLyBndXR0ZXIgbWF5YmUgaW50ZXJnZXIgfHwgMFxuICAgIC8vIHNvIGNhbid0IHVzZSAnaWYgKGd1dHRlciknXG4gICAgaWYgKGd1dHRlclRlbSAhPT0gZmFsc2UpIHtcbiAgICAgIHZhciBwcm9wID0gaG9yaXpvbnRhbCA/ICdwYWRkaW5nLScgOiAnbWFyZ2luLScsXG4gICAgICAgICAgZGlyID0gaG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcbiAgICAgIHN0ciA9IHByb3AgKyAgZGlyICsgJzogJyArIGd1dHRlclRlbSArICdweDsnO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDU1NQcmVmaXggKG5hbWUsIG51bSkge1xuICAgIHZhciBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCAtIG51bSkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAocHJlZml4KSB7IHByZWZpeCA9ICctJyArIHByZWZpeCArICctJzsgfVxuXG4gICAgcmV0dXJuIHByZWZpeDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlIChzcGVlZCkge1xuICAgIHJldHVybiBnZXRDU1NQcmVmaXgoVFJBTlNJVElPTkRVUkFUSU9OLCAxOCkgKyAndHJhbnNpdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XG4gICAgcmV0dXJuIGdldENTU1ByZWZpeChBTklNQVRJT05EVVJBVElPTiwgMTcpICsgJ2FuaW1hdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTdHJ1Y3R1cmUgKCkge1xuICAgIHZhciBjbGFzc091dGVyID0gJ3Rucy1vdXRlcicsXG4gICAgICAgIGNsYXNzSW5uZXIgPSAndG5zLWlubmVyJyxcbiAgICAgICAgaGFzR3V0dGVyID0gaGFzT3B0aW9uKCdndXR0ZXInKTtcblxuICAgIG91dGVyV3JhcHBlci5jbGFzc05hbWUgPSBjbGFzc091dGVyO1xuICAgIGlubmVyV3JhcHBlci5jbGFzc05hbWUgPSBjbGFzc0lubmVyO1xuICAgIG91dGVyV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW93JztcbiAgICBpbm5lcldyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1pdyc7XG5cbiAgICAvLyBzZXQgY29udGFpbmVyIHByb3BlcnRpZXNcbiAgICBpZiAoY29udGFpbmVyLmlkID09PSAnJykgeyBjb250YWluZXIuaWQgPSBzbGlkZUlkOyB9XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSBQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCA/ICcgdG5zLXN1YnBpeGVsJyA6ICcgdG5zLW5vLXN1YnBpeGVsJztcbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9IENBTEMgPyAnIHRucy1jYWxjJyA6ICcgdG5zLW5vLWNhbGMnO1xuICAgIGlmIChhdXRvV2lkdGgpIHsgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSAnIHRucy1hdXRvd2lkdGgnOyB9XG4gICAgbmV3Q29udGFpbmVyQ2xhc3NlcyArPSAnIHRucy0nICsgb3B0aW9ucy5heGlzO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gbmV3Q29udGFpbmVyQ2xhc3NlcztcblxuICAgIC8vIGFkZCBjb25zdHJhaW4gbGF5ZXIgZm9yIGNhcm91c2VsXG4gICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICBtaWRkbGVXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbWlkZGxlV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW13JztcbiAgICAgIG1pZGRsZVdyYXBwZXIuY2xhc3NOYW1lID0gJ3Rucy1vdmgnO1xuXG4gICAgICBvdXRlcldyYXBwZXIuYXBwZW5kQ2hpbGQobWlkZGxlV3JhcHBlcik7XG4gICAgICBtaWRkbGVXcmFwcGVyLmFwcGVuZENoaWxkKGlubmVyV3JhcHBlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dGVyV3JhcHBlci5hcHBlbmRDaGlsZChpbm5lcldyYXBwZXIpO1xuICAgIH1cblxuICAgIGlmIChhdXRvSGVpZ2h0KSB7XG4gICAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcbiAgICAgIHdwLmNsYXNzTmFtZSArPSAnIHRucy1haCc7XG4gICAgfVxuXG4gICAgY29udGFpbmVyUGFyZW50Lmluc2VydEJlZm9yZShvdXRlcldyYXBwZXIsIGNvbnRhaW5lcik7XG4gICAgaW5uZXJXcmFwcGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAvLyBhZGQgaWQsIGNsYXNzLCBhcmlhIGF0dHJpYnV0ZXMgXG4gICAgLy8gYmVmb3JlIGNsb25lIHNsaWRlc1xuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1pdGVtJyk7XG4gICAgICBpZiAoIWl0ZW0uaWQpIHsgaXRlbS5pZCA9IHNsaWRlSWQgKyAnLWl0ZW0nICsgaTsgfVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBhbmltYXRlTm9ybWFsKSB7IGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpOyB9XG4gICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAjIyBjbG9uZSBzbGlkZXNcbiAgICAvLyBjYXJvdXNlbDogbiArIHNsaWRlcyArIG5cbiAgICAvLyBnYWxsZXJ5OiAgICAgIHNsaWRlcyArIG5cbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIGZyYWdtZW50QmVmb3JlID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgXG4gICAgICAgICAgZnJhZ21lbnRBZnRlciA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIHZhciBudW0gPSBqJXNsaWRlQ291bnQsXG4gICAgICAgICAgICBjbG9uZUZpcnN0ID0gc2xpZGVJdGVtc1tudW1dLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVGaXJzdCwgJ2lkJyk7XG4gICAgICAgIGZyYWdtZW50QWZ0ZXIuaW5zZXJ0QmVmb3JlKGNsb25lRmlyc3QsIGZyYWdtZW50QWZ0ZXIuZmlyc3RDaGlsZCk7XG5cbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgdmFyIGNsb25lTGFzdCA9IHNsaWRlSXRlbXNbc2xpZGVDb3VudCAtIDEgLSBudW1dLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICByZW1vdmVBdHRycyhjbG9uZUxhc3QsICdpZCcpO1xuICAgICAgICAgIGZyYWdtZW50QmVmb3JlLmFwcGVuZENoaWxkKGNsb25lTGFzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZShmcmFnbWVudEJlZm9yZSwgY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50QWZ0ZXIpO1xuICAgICAgc2xpZGVJdGVtcyA9IGNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm0gKCkge1xuICAgIC8vICMjIGltYWdlcyBsb2FkZWQvZmFpbGVkXG4gICAgaWYgKGhhc09wdGlvbignYXV0b0hlaWdodCcpIHx8IGF1dG9XaWR0aCB8fCAhaG9yaXpvbnRhbCkge1xuICAgICAgdmFyIGltZ3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG5cbiAgICAgIC8vIGFkZCBjb21wbGV0ZSBjbGFzcyBpZiBhbGwgaW1hZ2VzIGFyZSBsb2FkZWQvZmFpbGVkXG4gICAgICBmb3JFYWNoKGltZ3MsIGZ1bmN0aW9uKGltZykge1xuICAgICAgICB2YXIgc3JjID0gaW1nLnNyYztcbiAgICAgICAgXG4gICAgICAgIGlmIChzcmMgJiYgc3JjLmluZGV4T2YoJ2RhdGE6aW1hZ2UnKSA8IDApIHtcbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuICAgICAgICAgIGltZy5zcmMgPSAnJztcbiAgICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICAgICAgfSBlbHNlIGlmICghbGF6eWxvYWQpIHtcbiAgICAgICAgICBpbWdMb2FkZWQoaW1nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEFsbCBpbWdzIGFyZSBjb21wbGV0ZWRcbiAgICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soYXJyYXlGcm9tTm9kZUxpc3QoaW1ncyksIGZ1bmN0aW9uKCkgeyBpbWdzQ29tcGxldGUgPSB0cnVlOyB9KTsgfSk7XG5cbiAgICAgIC8vIENoZWNrIGltZ3MgaW4gd2luZG93IG9ubHkgZm9yIGF1dG8gaGVpZ2h0XG4gICAgICBpZiAoIWF1dG9XaWR0aCAmJiBob3Jpem9udGFsKSB7IGltZ3MgPSBnZXRJbWFnZUFycmF5KGluZGV4LCBNYXRoLm1pbihpbmRleCArIGl0ZW1zIC0gMSwgc2xpZGVDb3VudE5ldyAtIDEpKTsgfVxuXG4gICAgICBsYXp5bG9hZCA/IGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrKCkgOiByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGFycmF5RnJvbU5vZGVMaXN0KGltZ3MpLCBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayk7IH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNldCBjb250YWluZXIgdHJhbnNmb3JtIHByb3BlcnR5XG4gICAgICBpZiAoY2Fyb3VzZWwpIHsgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTsgfVxuXG4gICAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcbiAgICAgIGluaXRUb29scygpO1xuICAgICAgaW5pdEV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrICgpIHtcbiAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAvLyBjaGVjayBzdHlsZXMgYXBwbGljYXRpb25cbiAgICAgIHZhciBudW0gPSBsb29wID8gaW5kZXggOiBzbGlkZUNvdW50IC0gMTtcbiAgICAgIChmdW5jdGlvbiBzdHlsZXNBcHBsaWNhdGlvbkNoZWNrKCkge1xuICAgICAgICBzbGlkZUl0ZW1zW251bSAtIDFdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0LnRvRml4ZWQoMikgPT09IHNsaWRlSXRlbXNbbnVtXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LnRvRml4ZWQoMikgP1xuICAgICAgICBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSgpIDpcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBzdHlsZXNBcHBsaWNhdGlvbkNoZWNrKCk7IH0sIDE2KTtcbiAgICAgIH0pKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlKCk7XG4gICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSAoKSB7XG4gICAgLy8gcnVuIEZuKClzIHdoaWNoIGFyZSByZWx5IG9uIGltYWdlIGxvYWRpbmdcbiAgICBpZiAoIWhvcml6b250YWwgfHwgYXV0b1dpZHRoKSB7XG4gICAgICBzZXRTbGlkZVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgIHJpZ2h0Qm91bmRhcnkgPSBnZXRSaWdodEJvdW5kYXJ5KCk7XG4gICAgICAgIGlmIChmcmVlemFibGUpIHsgZnJlZXplID0gZ2V0RnJlZXplKCk7IH1cbiAgICAgICAgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyAvLyA8PSBzbGlkZVBvc2l0aW9ucywgcmlnaHRCb3VuZGFyeSA8PVxuICAgICAgICByZXNldFZhcmlibGVzV2hlbkRpc2FibGUoZGlzYWJsZSB8fCBmcmVlemUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgY29udGFpbmVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxuICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XG5cbiAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcbiAgICBpbml0VG9vbHMoKTtcbiAgICBpbml0RXZlbnRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U2hlZXQgKCkge1xuICAgIC8vIGdhbGxlcnk6XG4gICAgLy8gc2V0IGFuaW1hdGlvbiBjbGFzc2VzIGFuZCBsZWZ0IHZhbHVlIGZvciBnYWxsZXJ5IHNsaWRlclxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIE1hdGgubWluKHNsaWRlQ291bnQsIGl0ZW1zKTsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNbaV07XG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vICMjIyMgTEFZT1VUXG5cbiAgICAvLyAjIyBJTkxJTkUtQkxPQ0sgVlMgRkxPQVRcblxuICAgIC8vICMjIFBlcmNlbnRhZ2VMYXlvdXQ6XG4gICAgLy8gc2xpZGVzOiBpbmxpbmUtYmxvY2tcbiAgICAvLyByZW1vdmUgYmxhbmsgc3BhY2UgYmV0d2VlbiBzbGlkZXMgYnkgc2V0IGZvbnQtc2l6ZTogMFxuXG4gICAgLy8gIyMgTm9uIFBlcmNlbnRhZ2VMYXlvdXQ6XG4gICAgLy8gc2xpZGVzOiBmbG9hdFxuICAgIC8vICAgICAgICAgbWFyZ2luLXJpZ2h0OiAtMTAwJVxuICAgIC8vICAgICAgICAgbWFyZ2luLWxlZnQ6IH5cblxuICAgIC8vIFJlc291cmNlOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xNDd1cDI0NXd3VFhlUVl2ZTNCUlNBRDRvVmN2UW11R3NGdGVKT2VBNXhOUS9lZGl0P3VzcD1zaGFyaW5nXG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIGlmIChQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCkge1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsICdmb250LXNpemU6JyArIHdpbi5nZXRDb21wdXRlZFN0eWxlKHNsaWRlSXRlbXNbMF0pLmZvbnRTaXplICsgJzsnLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkLCAnZm9udC1zaXplOjA7JywgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH0gZWxzZSBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbiAoc2xpZGUsIGkpIHtcbiAgICAgICAgICBzbGlkZS5zdHlsZS5tYXJnaW5MZWZ0ID0gZ2V0U2xpZGVNYXJnaW5MZWZ0KGkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vICMjIEJBU0lDIFNUWUxFU1xuICAgIGlmIChDU1NNUSkge1xuICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVcbiAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcbiAgICAgICAgdmFyIHN0ciA9IG1pZGRsZVdyYXBwZXIgJiYgb3B0aW9ucy5hdXRvSGVpZ2h0ID8gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUob3B0aW9ucy5zcGVlZCkgOiAnJztcbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICctbXcnLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICBzdHIgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMob3B0aW9ucy5lZGdlUGFkZGluZywgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5hdXRvSGVpZ2h0KTtcbiAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnLWl3Jywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuXG4gICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gJ3dpZHRoOicgKyBnZXRDb250YWluZXJXaWR0aChvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLml0ZW1zKSArICc7JyA6ICcnO1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCwgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/IGdldFNsaWRlV2lkdGhTdHlsZShvcHRpb25zLmZpeGVkV2lkdGgsIG9wdGlvbnMuZ3V0dGVyLCBvcHRpb25zLml0ZW1zKSA6ICcnO1xuICAgICAgaWYgKG9wdGlvbnMuZ3V0dGVyKSB7IHN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKG9wdGlvbnMuZ3V0dGVyKTsgfVxuICAgICAgLy8gc2V0IGdhbGxlcnkgaXRlbXMgdHJhbnNpdGlvbi1kdXJhdGlvblxuICAgICAgaWYgKCFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZCk7IH1cbiAgICAgICAgaWYgKEFOSU1BVElPTkRVUkFUSU9OKSB7IHN0ciArPSBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxuXG4gICAgLy8gbm9uIENTUyBtZWRpYXF1ZXJpZXM6IElFOFxuICAgIC8vICMjIHVwZGF0ZSBpbm5lciB3cmFwcGVyLCBjb250YWluZXIsIHNsaWRlcyBpZiBuZWVkZWRcbiAgICAvLyBzZXQgaW5saW5lIHN0eWxlcyBmb3IgaW5uZXIgd3JhcHBlciAmIGNvbnRhaW5lclxuICAgIC8vIGluc2VydCBzdHlsZXNoZWV0IChvbmUgbGluZSkgZm9yIHNsaWRlcyBvbmx5IChzaW5jZSBzbGlkZXMgYXJlIG1hbnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG1pZGRsZSB3cmFwcGVyIHN0eWxlc1xuICAgICAgdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24oKTtcblxuICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIGF1dG9IZWlnaHQpO1xuXG4gICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICBpZiAoY2Fyb3VzZWwgJiYgaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgIHZhciBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcykgOiAnJztcbiAgICAgIGlmIChndXR0ZXIpIHsgc3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTsgfVxuXG4gICAgICAvLyBhcHBlbmQgdG8gdGhlIGxhc3QgbGluZVxuICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxuICAgIH1cblxuICAgIC8vICMjIE1FRElBUVVFUklFU1xuICAgIGlmIChyZXNwb25zaXZlICYmIENTU01RKSB7XG4gICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgIC8vIGJwOiBjb252ZXJ0IHN0cmluZyB0byBudW1iZXJcbiAgICAgICAgYnAgPSBwYXJzZUludChicCk7XG5cbiAgICAgICAgdmFyIG9wdHMgPSByZXNwb25zaXZlW2JwXSxcbiAgICAgICAgICAgIHN0ciA9ICcnLFxuICAgICAgICAgICAgbWlkZGxlV3JhcHBlclN0ciA9ICcnLFxuICAgICAgICAgICAgaW5uZXJXcmFwcGVyU3RyID0gJycsXG4gICAgICAgICAgICBjb250YWluZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIHNsaWRlU3RyID0gJycsXG4gICAgICAgICAgICBpdGVtc0JQID0gIWF1dG9XaWR0aCA/IGdldE9wdGlvbignaXRlbXMnLCBicCkgOiBudWxsLFxuICAgICAgICAgICAgZml4ZWRXaWR0aEJQID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJywgYnApLFxuICAgICAgICAgICAgc3BlZWRCUCA9IGdldE9wdGlvbignc3BlZWQnLCBicCksXG4gICAgICAgICAgICBlZGdlUGFkZGluZ0JQID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycsIGJwKSxcbiAgICAgICAgICAgIGF1dG9IZWlnaHRCUCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSxcbiAgICAgICAgICAgIGd1dHRlckJQID0gZ2V0T3B0aW9uKCdndXR0ZXInLCBicCk7XG5cbiAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3RyaW5nXG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gJiYgbWlkZGxlV3JhcHBlciAmJiBnZXRPcHRpb24oJ2F1dG9IZWlnaHQnLCBicCkgJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgbWlkZGxlV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLW13eycgKyBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKSArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3RyaW5nXG4gICAgICAgIGlmICgnZWRnZVBhZGRpbmcnIGluIG9wdHMgfHwgJ2d1dHRlcicgaW4gb3B0cykge1xuICAgICAgICAgIGlubmVyV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLWl3eycgKyBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmdCUCwgZ3V0dGVyQlAsIGZpeGVkV2lkdGhCUCwgc3BlZWRCUCwgYXV0b0hlaWdodEJQKSArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnRhaW5lciBzdHJpbmdcbiAgICAgICAgaWYgKGNhcm91c2VsICYmIGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAoJ2ZpeGVkV2lkdGgnIGluIG9wdHMgfHwgJ2l0ZW1zJyBpbiBvcHRzIHx8IChmaXhlZFdpZHRoICYmICdndXR0ZXInIGluIG9wdHMpKSkge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICd3aWR0aDonICsgZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aEJQLCBndXR0ZXJCUCwgaXRlbXNCUCkgKyAnOyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBjb250YWluZXJTdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRhaW5lclN0cikge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICcjJyArIHNsaWRlSWQgKyAneycgKyBjb250YWluZXJTdHIgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzbGlkZSBzdHJpbmdcbiAgICAgICAgaWYgKCdmaXhlZFdpZHRoJyBpbiBvcHRzIHx8IChmaXhlZFdpZHRoICYmICdndXR0ZXInIGluIG9wdHMpIHx8ICFjYXJvdXNlbCAmJiAnaXRlbXMnIGluIG9wdHMpIHtcbiAgICAgICAgICBzbGlkZVN0ciArPSBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aEJQLCBndXR0ZXJCUCwgaXRlbXNCUCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdndXR0ZXInIGluIG9wdHMpIHtcbiAgICAgICAgICBzbGlkZVN0ciArPSBnZXRTbGlkZUd1dHRlclN0eWxlKGd1dHRlckJQKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgZ2FsbGVyeSBpdGVtcyB0cmFuc2l0aW9uLWR1cmF0aW9uXG4gICAgICAgIGlmICghY2Fyb3VzZWwgJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XG4gICAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzbGlkZVN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTsgfVxuICAgICAgICAgIGlmIChBTklNQVRJT05EVVJBVElPTikgeyBzbGlkZVN0ciArPSBnZXRBbmltYXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNsaWRlU3RyKSB7IHNsaWRlU3RyID0gJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW17JyArIHNsaWRlU3RyICsgJ30nOyB9XG5cbiAgICAgICAgLy8gYWRkIHVwXG4gICAgICAgIHN0ciA9IG1pZGRsZVdyYXBwZXJTdHIgKyBpbm5lcldyYXBwZXJTdHIgKyBjb250YWluZXJTdHIgKyBzbGlkZVN0cjtcblxuICAgICAgICBpZiAoc3RyKSB7XG4gICAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZSgnQG1lZGlhIChtaW4td2lkdGg6ICcgKyBicCAvIDE2ICsgJ2VtKSB7JyArIHN0ciArICd9Jywgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRUb29scyAoKSB7XG4gICAgLy8gPT0gc2xpZGVzID09XG4gICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcblxuICAgIC8vID09IGxpdmUgcmVnaW9uID09XG4gICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8ZGl2IGNsYXNzPVwidG5zLWxpdmVyZWdpb24gdG5zLXZpc3VhbGx5LWhpZGRlblwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPnNsaWRlIDxzcGFuIGNsYXNzPVwiY3VycmVudFwiPicgKyBnZXRMaXZlUmVnaW9uU3RyKCkgKyAnPC9zcGFuPiAgb2YgJyArIHNsaWRlQ291bnQgKyAnPC9kaXY+Jyk7XG4gICAgbGl2ZXJlZ2lvbkN1cnJlbnQgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1saXZlcmVnaW9uIC5jdXJyZW50Jyk7XG5cbiAgICAvLyA9PSBhdXRvcGxheUluaXQgPT1cbiAgICBpZiAoaGFzQXV0b3BsYXkpIHtcbiAgICAgIHZhciB0eHQgPSBhdXRvcGxheSA/ICdzdG9wJyA6ICdzdGFydCc7XG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHtcbiAgICAgICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiB0eHR9KTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hdXRvcGxheUJ1dHRvbk91dHB1dCkge1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMuYXV0b3BsYXlQb3NpdGlvbiksICc8YnV0dG9uIGRhdGEtYWN0aW9uPVwiJyArIHR4dCArICdcIj4nICsgYXV0b3BsYXlIdG1sU3RyaW5nc1swXSArIHR4dCArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMV0gKyBhdXRvcGxheVRleHRbMF0gKyAnPC9idXR0b24+Jyk7XG4gICAgICAgIGF1dG9wbGF5QnV0dG9uID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbl0nKTtcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGV2ZW50XG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHtcbiAgICAgICAgYWRkRXZlbnRzKGF1dG9wbGF5QnV0dG9uLCB7J2NsaWNrJzogdG9nZ2xlQXV0b3BsYXl9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSkgeyBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7IH1cbiAgICAgICAgaWYgKGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdmlzaWJpbGl0eUV2ZW50KTsgfVxuICAgICAgfVxuICAgIH1cbiBcbiAgICAvLyA9PSBuYXZJbml0ID09XG4gICAgaWYgKGhhc05hdikge1xuICAgICAgdmFyIGluaXRJbmRleCA9ICFjYXJvdXNlbCA/IDAgOiBjbG9uZUNvdW50O1xuICAgICAgLy8gY3VzdG9taXplZCBuYXZcbiAgICAgIC8vIHdpbGwgbm90IGhpZGUgdGhlIG5hdnMgaW4gY2FzZSB0aGV5J3JlIHRodW1ibmFpbHNcbiAgICAgIGlmIChuYXZDb250YWluZXIpIHtcbiAgICAgICAgc2V0QXR0cnMobmF2Q29udGFpbmVyLCB7J2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgUGFnaW5hdGlvbid9KTtcbiAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XG4gICAgICAgIGZvckVhY2gobmF2SXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICAgICAnZGF0YS1uYXYnOiBpLFxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKGkgKyAxKSxcbiAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlZCBuYXYgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmF2SHRtbCA9ICcnLFxuICAgICAgICAgICAgaGlkZGVuU3RyID0gbmF2QXNUaHVtYm5haWxzID8gJycgOiAnc3R5bGU9XCJkaXNwbGF5Om5vbmVcIic7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgLy8gaGlkZSBuYXYgaXRlbXMgYnkgZGVmYXVsdFxuICAgICAgICAgIG5hdkh0bWwgKz0gJzxidXR0b24gZGF0YS1uYXY9XCInICsgaSArJ1wiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKyAnXCIgJyArIGhpZGRlblN0ciArICcgYXJpYS1sYWJlbD1cIicgKyBuYXZTdHIgKyAoaSArIDEpICsnXCI+PC9idXR0b24+JztcbiAgICAgICAgfVxuICAgICAgICBuYXZIdG1sID0gJzxkaXYgY2xhc3M9XCJ0bnMtbmF2XCIgYXJpYS1sYWJlbD1cIkNhcm91c2VsIFBhZ2luYXRpb25cIj4nICsgbmF2SHRtbCArICc8L2Rpdj4nO1xuICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMubmF2UG9zaXRpb24pLCBuYXZIdG1sKTtcblxuICAgICAgICBuYXZDb250YWluZXIgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1uYXYnKTtcbiAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZU5hdlZpc2liaWxpdHkoKTtcblxuICAgICAgLy8gYWRkIHRyYW5zaXRpb25cbiAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IFRSQU5TSVRJT05EVVJBVElPTi5zdWJzdHJpbmcoMCwgVFJBTlNJVElPTkRVUkFUSU9OLmxlbmd0aCAtIDE4KS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgc3RyID0gJ3RyYW5zaXRpb246IGFsbCAnICsgc3BlZWQgLyAxMDAwICsgJ3MnO1xuXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICBzdHIgPSAnLScgKyBwcmVmaXggKyAnLScgKyBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnW2FyaWEtY29udHJvbHNePScgKyBzbGlkZUlkICsgJy1pdGVtXScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXR0cnMobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgeydhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleCArIDEpICsgbmF2U3RyQ3VycmVudH0pO1xuICAgICAgcmVtb3ZlQXR0cnMobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgJ3RhYmluZGV4Jyk7XG4gICAgICBhZGRDbGFzcyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCBuYXZBY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIGFkZCBldmVudHNcbiAgICAgIGFkZEV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7XG4gICAgfVxuXG5cblxuICAgIC8vID09IGNvbnRyb2xzSW5pdCA9PVxuICAgIGlmIChoYXNDb250cm9scykge1xuICAgICAgaWYgKCFjb250cm9sc0NvbnRhaW5lciAmJiAoIXByZXZCdXR0b24gfHwgIW5leHRCdXR0b24pKSB7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5jb250cm9sc1Bvc2l0aW9uKSwgJzxkaXYgY2xhc3M9XCJ0bnMtY29udHJvbHNcIiBhcmlhLWxhYmVsPVwiQ2Fyb3VzZWwgTmF2aWdhdGlvblwiIHRhYmluZGV4PVwiMFwiPjxidXR0b24gZGF0YS1jb250cm9scz1cInByZXZcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsnXCI+JyArIGNvbnRyb2xzVGV4dFswXSArICc8L2J1dHRvbj48YnV0dG9uIGRhdGEtY29udHJvbHM9XCJuZXh0XCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMV0gKyAnPC9idXR0b24+PC9kaXY+Jyk7XG5cbiAgICAgICAgY29udHJvbHNDb250YWluZXIgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1jb250cm9scycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXByZXZCdXR0b24gfHwgIW5leHRCdXR0b24pIHtcbiAgICAgICAgcHJldkJ1dHRvbiA9IGNvbnRyb2xzQ29udGFpbmVyLmNoaWxkcmVuWzBdO1xuICAgICAgICBuZXh0QnV0dG9uID0gY29udHJvbHNDb250YWluZXIuY2hpbGRyZW5bMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIHNldEF0dHJzKGNvbnRyb2xzQ29udGFpbmVyLCB7XG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgTmF2aWdhdGlvbicsXG4gICAgICAgICAgJ3RhYmluZGV4JzogJzAnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciB8fCAob3B0aW9ucy5wcmV2QnV0dG9uICYmIG9wdGlvbnMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgc2V0QXR0cnMoW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLCB7XG4gICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzbGlkZUlkLFxuICAgICAgICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAob3B0aW9ucy5jb250cm9sc0NvbnRhaW5lciB8fCAob3B0aW9ucy5wcmV2QnV0dG9uICYmIG9wdGlvbnMubmV4dEJ1dHRvbikpIHtcbiAgICAgICAgc2V0QXR0cnMocHJldkJ1dHRvbiwgeydkYXRhLWNvbnRyb2xzJyA6ICdwcmV2J30pO1xuICAgICAgICBzZXRBdHRycyhuZXh0QnV0dG9uLCB7J2RhdGEtY29udHJvbHMnIDogJ25leHQnfSk7XG4gICAgICB9XG5cbiAgICAgIHByZXZJc0J1dHRvbiA9IGlzQnV0dG9uKHByZXZCdXR0b24pO1xuICAgICAgbmV4dElzQnV0dG9uID0gaXNCdXR0b24obmV4dEJ1dHRvbik7XG5cbiAgICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XG5cbiAgICAgIC8vIGFkZCBldmVudHNcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBhZGRFdmVudHMoY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZEV2ZW50cyhwcmV2QnV0dG9uLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICAgIGFkZEV2ZW50cyhuZXh0QnV0dG9uLCBjb250cm9sc0V2ZW50cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaGlkZSB0b29scyBpZiBuZWVkZWRcbiAgICBkaXNhYmxlVUkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRFdmVudHMgKCkge1xuICAgIC8vIGFkZCBldmVudHNcbiAgICBpZiAoY2Fyb3VzZWwgJiYgVFJBTlNJVElPTkVORCkge1xuICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgZXZlKTtcbiAgICB9XG5cbiAgICBpZiAodG91Y2gpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMsIG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2gpOyB9XG4gICAgaWYgKG1vdXNlRHJhZykgeyBhZGRFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTsgfVxuICAgIGlmIChhcnJvd0tleXMpIHsgYWRkRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cblxuICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHtcbiAgICAgIGV2ZW50cy5vbignb3V0ZXJSZXNpemVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNpemVUYXNrcygpO1xuICAgICAgICBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChyZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8IGF1dG9IZWlnaHQgfHwgIWhvcml6b250YWwpIHtcbiAgICAgIGFkZEV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b0hlaWdodCkge1xuICAgICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykge1xuICAgICAgICBldmVudHMub24oJ2lubmVyTG9hZGVkJywgZG9BdXRvSGVpZ2h0KTtcbiAgICAgIH0gZWxzZSBpZiAoIWRpc2FibGUpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cbiAgICB9XG5cbiAgICBkb0xhenlMb2FkKCk7XG4gICAgaWYgKGRpc2FibGUpIHsgZGlzYWJsZVNsaWRlcigpOyB9IGVsc2UgaWYgKGZyZWV6ZSkgeyBmcmVlemVTbGlkZXIoKTsgfVxuXG4gICAgZXZlbnRzLm9uKCdpbmRleENoYW5nZWQnLCBhZGRpdGlvbmFsVXBkYXRlcyk7XG4gICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykgeyBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpOyB9XG4gICAgaWYgKHR5cGVvZiBvbkluaXQgPT09ICdmdW5jdGlvbicpIHsgb25Jbml0KGluZm8oKSk7IH1cbiAgICBpc09uID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICAgIC8vIHNoZWV0XG4gICAgc2hlZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGlmIChzaGVldC5vd25lck5vZGUpIHsgc2hlZXQub3duZXJOb2RlLnJlbW92ZSgpOyB9XG5cbiAgICAvLyByZW1vdmUgd2luIGV2ZW50IGxpc3RlbmVyc1xuICAgIHJlbW92ZUV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcblxuICAgIC8vIGFycm93S2V5cywgY29udHJvbHMsIG5hdlxuICAgIGlmIChhcnJvd0tleXMpIHsgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cbiAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHsgcmVtb3ZlRXZlbnRzKGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0V2ZW50cyk7IH1cbiAgICBpZiAobmF2Q29udGFpbmVyKSB7IHJlbW92ZUV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7IH1cblxuICAgIC8vIGF1dG9wbGF5XG4gICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpO1xuICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHZpc2liaWxpdHlFdmVudCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHJlbW92ZUV2ZW50cyhhdXRvcGxheUJ1dHRvbiwgeydjbGljayc6IHRvZ2dsZUF1dG9wbGF5fSk7IH1cbiAgICBpZiAoYXV0b3BsYXkpIHsgY2xlYXJJbnRlcnZhbChhdXRvcGxheVRpbWVyKTsgfVxuXG4gICAgLy8gY29udGFpbmVyXG4gICAgaWYgKGNhcm91c2VsICYmIFRSQU5TSVRJT05FTkQpIHtcbiAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcbiAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGV2ZSk7XG4gICAgfVxuICAgIGlmICh0b3VjaCkgeyByZW1vdmVFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cyk7IH1cbiAgICBpZiAobW91c2VEcmFnKSB7IHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpOyB9XG5cbiAgICAvLyBjYWNoZSBPYmplY3QgdmFsdWVzIGluIG9wdGlvbnMgJiYgcmVzZXQgSFRNTFxuICAgIHZhciBodG1sTGlzdCA9IFtjb250YWluZXJIVE1MLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b25IVE1MLCBuZXh0QnV0dG9uSFRNTCwgbmF2Q29udGFpbmVySFRNTCwgYXV0b3BsYXlCdXR0b25IVE1MXTtcblxuICAgIHRuc0xpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgZWwgPSBpdGVtID09PSAnY29udGFpbmVyJyA/IG91dGVyV3JhcHBlciA6IG9wdGlvbnNbaXRlbV07XG5cbiAgICAgIGlmICh0eXBlb2YgZWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBwcmV2RWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID8gZWwucHJldmlvdXNFbGVtZW50U2libGluZyA6IGZhbHNlLFxuICAgICAgICAgICAgcGFyZW50RWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgICBlbC5vdXRlckhUTUwgPSBodG1sTGlzdFtpXTtcbiAgICAgICAgb3B0aW9uc1tpdGVtXSA9IHByZXZFbCA/IHByZXZFbC5uZXh0RWxlbWVudFNpYmxpbmcgOiBwYXJlbnRFbC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8gcmVzZXQgdmFyaWFibGVzXG4gICAgdG5zTGlzdCA9IGFuaW1hdGVJbiA9IGFuaW1hdGVPdXQgPSBhbmltYXRlRGVsYXkgPSBhbmltYXRlTm9ybWFsID0gaG9yaXpvbnRhbCA9IG91dGVyV3JhcHBlciA9IGlubmVyV3JhcHBlciA9IGNvbnRhaW5lciA9IGNvbnRhaW5lclBhcmVudCA9IGNvbnRhaW5lckhUTUwgPSBzbGlkZUl0ZW1zID0gc2xpZGVDb3VudCA9IGJyZWFrcG9pbnRab25lID0gd2luZG93V2lkdGggPSBhdXRvV2lkdGggPSBmaXhlZFdpZHRoID0gZWRnZVBhZGRpbmcgPSBndXR0ZXIgPSB2aWV3cG9ydCA9IGl0ZW1zID0gc2xpZGVCeSA9IHZpZXdwb3J0TWF4ID0gYXJyb3dLZXlzID0gc3BlZWQgPSByZXdpbmQgPSBsb29wID0gYXV0b0hlaWdodCA9IHNoZWV0ID0gbGF6eWxvYWQgPSBzbGlkZVBvc2l0aW9ucyA9IHNsaWRlSXRlbXNPdXQgPSBjbG9uZUNvdW50ID0gc2xpZGVDb3VudE5ldyA9IGhhc1JpZ2h0RGVhZFpvbmUgPSByaWdodEJvdW5kYXJ5ID0gdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1BdHRyID0gdHJhbnNmb3JtUHJlZml4ID0gdHJhbnNmb3JtUG9zdGZpeCA9IGdldEluZGV4TWF4ID0gaW5kZXggPSBpbmRleENhY2hlZCA9IGluZGV4TWluID0gaW5kZXhNYXggPSByZXNpemVUaW1lciA9IHN3aXBlQW5nbGUgPSBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBydW5uaW5nID0gb25Jbml0ID0gZXZlbnRzID0gbmV3Q29udGFpbmVyQ2xhc3NlcyA9IHNsaWRlSWQgPSBkaXNhYmxlID0gZGlzYWJsZWQgPSBmcmVlemFibGUgPSBmcmVlemUgPSBmcm96ZW4gPSBjb250cm9sc0V2ZW50cyA9IG5hdkV2ZW50cyA9IGhvdmVyRXZlbnRzID0gdmlzaWJpbGl0eUV2ZW50ID0gZG9jbWVudEtleWRvd25FdmVudCA9IHRvdWNoRXZlbnRzID0gZHJhZ0V2ZW50cyA9IGhhc0NvbnRyb2xzID0gaGFzTmF2ID0gbmF2QXNUaHVtYm5haWxzID0gaGFzQXV0b3BsYXkgPSBoYXNUb3VjaCA9IGhhc01vdXNlRHJhZyA9IHNsaWRlQWN0aXZlQ2xhc3MgPSBpbWdDb21wbGV0ZUNsYXNzID0gaW1nRXZlbnRzID0gaW1nc0NvbXBsZXRlID0gY29udHJvbHMgPSBjb250cm9sc1RleHQgPSBjb250cm9sc0NvbnRhaW5lciA9IGNvbnRyb2xzQ29udGFpbmVySFRNTCA9IHByZXZCdXR0b24gPSBuZXh0QnV0dG9uID0gcHJldklzQnV0dG9uID0gbmV4dElzQnV0dG9uID0gbmF2ID0gbmF2Q29udGFpbmVyID0gbmF2Q29udGFpbmVySFRNTCA9IG5hdkl0ZW1zID0gcGFnZXMgPSBwYWdlc0NhY2hlZCA9IG5hdkNsaWNrZWQgPSBuYXZDdXJyZW50SW5kZXggPSBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZBY3RpdmVDbGFzcyA9IG5hdlN0ciA9IG5hdlN0ckN1cnJlbnQgPSBhdXRvcGxheSA9IGF1dG9wbGF5VGltZW91dCA9IGF1dG9wbGF5RGlyZWN0aW9uID0gYXV0b3BsYXlUZXh0ID0gYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlCdXR0b24gPSBhdXRvcGxheUJ1dHRvbkhUTUwgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gYXV0b3BsYXlIdG1sU3RyaW5ncyA9IGF1dG9wbGF5VGltZXIgPSBhbmltYXRpbmcgPSBhdXRvcGxheUhvdmVyUGF1c2VkID0gYXV0b3BsYXlVc2VyUGF1c2VkID0gYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gaW5pdFBvc2l0aW9uID0gbGFzdFBvc2l0aW9uID0gdHJhbnNsYXRlSW5pdCA9IGRpc1ggPSBkaXNZID0gcGFuU3RhcnQgPSByYWZJbmRleCA9IGdldERpc3QgPSB0b3VjaCA9IG1vdXNlRHJhZyA9IG51bGw7XG4gICAgLy8gY2hlY2sgdmFyaWFibGVzXG4gICAgLy8gW2FuaW1hdGVJbiwgYW5pbWF0ZU91dCwgYW5pbWF0ZURlbGF5LCBhbmltYXRlTm9ybWFsLCBob3Jpem9udGFsLCBvdXRlcldyYXBwZXIsIGlubmVyV3JhcHBlciwgY29udGFpbmVyLCBjb250YWluZXJQYXJlbnQsIGNvbnRhaW5lckhUTUwsIHNsaWRlSXRlbXMsIHNsaWRlQ291bnQsIGJyZWFrcG9pbnRab25lLCB3aW5kb3dXaWR0aCwgYXV0b1dpZHRoLCBmaXhlZFdpZHRoLCBlZGdlUGFkZGluZywgZ3V0dGVyLCB2aWV3cG9ydCwgaXRlbXMsIHNsaWRlQnksIHZpZXdwb3J0TWF4LCBhcnJvd0tleXMsIHNwZWVkLCByZXdpbmQsIGxvb3AsIGF1dG9IZWlnaHQsIHNoZWV0LCBsYXp5bG9hZCwgc2xpZGVQb3NpdGlvbnMsIHNsaWRlSXRlbXNPdXQsIGNsb25lQ291bnQsIHNsaWRlQ291bnROZXcsIGhhc1JpZ2h0RGVhZFpvbmUsIHJpZ2h0Qm91bmRhcnksIHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtLCB0cmFuc2Zvcm1BdHRyLCB0cmFuc2Zvcm1QcmVmaXgsIHRyYW5zZm9ybVBvc3RmaXgsIGdldEluZGV4TWF4LCBpbmRleCwgaW5kZXhDYWNoZWQsIGluZGV4TWluLCBpbmRleE1heCwgcmVzaXplVGltZXIsIHN3aXBlQW5nbGUsIG1vdmVEaXJlY3Rpb25FeHBlY3RlZCwgcnVubmluZywgb25Jbml0LCBldmVudHMsIG5ld0NvbnRhaW5lckNsYXNzZXMsIHNsaWRlSWQsIGRpc2FibGUsIGRpc2FibGVkLCBmcmVlemFibGUsIGZyZWV6ZSwgZnJvemVuLCBjb250cm9sc0V2ZW50cywgbmF2RXZlbnRzLCBob3ZlckV2ZW50cywgdmlzaWJpbGl0eUV2ZW50LCBkb2NtZW50S2V5ZG93bkV2ZW50LCB0b3VjaEV2ZW50cywgZHJhZ0V2ZW50cywgaGFzQ29udHJvbHMsIGhhc05hdiwgbmF2QXNUaHVtYm5haWxzLCBoYXNBdXRvcGxheSwgaGFzVG91Y2gsIGhhc01vdXNlRHJhZywgc2xpZGVBY3RpdmVDbGFzcywgaW1nQ29tcGxldGVDbGFzcywgaW1nRXZlbnRzLCBpbWdzQ29tcGxldGUsIGNvbnRyb2xzLCBjb250cm9sc1RleHQsIGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b24sIG5leHRCdXR0b24sIHByZXZJc0J1dHRvbiwgbmV4dElzQnV0dG9uLCBuYXYsIG5hdkNvbnRhaW5lciwgbmF2Q29udGFpbmVySFRNTCwgbmF2SXRlbXMsIHBhZ2VzLCBwYWdlc0NhY2hlZCwgbmF2Q2xpY2tlZCwgbmF2Q3VycmVudEluZGV4LCBuYXZDdXJyZW50SW5kZXhDYWNoZWQsIG5hdkFjdGl2ZUNsYXNzLCBuYXZTdHIsIG5hdlN0ckN1cnJlbnQsIGF1dG9wbGF5LCBhdXRvcGxheVRpbWVvdXQsIGF1dG9wbGF5RGlyZWN0aW9uLCBhdXRvcGxheVRleHQsIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlCdXR0b24sIGF1dG9wbGF5QnV0dG9uSFRNTCwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSwgYXV0b3BsYXlIdG1sU3RyaW5ncywgYXV0b3BsYXlUaW1lciwgYW5pbWF0aW5nLCBhdXRvcGxheUhvdmVyUGF1c2VkLCBhdXRvcGxheVVzZXJQYXVzZWQsIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCwgaW5pdFBvc2l0aW9uLCBsYXN0UG9zaXRpb24sIHRyYW5zbGF0ZUluaXQsIGRpc1gsIGRpc1ksIHBhblN0YXJ0LCByYWZJbmRleCwgZ2V0RGlzdCwgdG91Y2gsIG1vdXNlRHJhZyBdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyBpZiAoaXRlbSAhPT0gbnVsbCkgeyBjb25zb2xlLmxvZyhpdGVtKTsgfSB9KTtcblxuICAgIGZvciAodmFyIGEgaW4gdGhpcykge1xuICAgICAgaWYgKGEgIT09ICdyZWJ1aWxkJykgeyB0aGlzW2FdID0gbnVsbDsgfVxuICAgIH1cbiAgICBpc09uID0gZmFsc2U7XG4gIH1cblxuLy8gPT09IE9OIFJFU0laRSA9PT1cbiAgLy8gcmVzcG9uc2l2ZSB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCB8fCAhaG9yaXpvbnRhbFxuICBmdW5jdGlvbiBvblJlc2l6ZSAoZSkge1xuICAgIHJhZihmdW5jdGlvbigpeyByZXNpemVUYXNrcyhnZXRFdmVudChlKSk7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzaXplVGFza3MgKGUpIHtcbiAgICBpZiAoIWlzT24pIHsgcmV0dXJuOyB9XG4gICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykgeyBldmVudHMuZW1pdCgnb3V0ZXJSZXNpemVkJywgaW5mbyhlKSk7IH1cbiAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCk7XG4gICAgdmFyIGJwQ2hhbmdlZCxcbiAgICAgICAgYnJlYWtwb2ludFpvbmVUZW0gPSBicmVha3BvaW50Wm9uZSxcbiAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IGZhbHNlO1xuXG4gICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgIHNldEJyZWFrcG9pbnRab25lKCk7XG4gICAgICBicENoYW5nZWQgPSBicmVha3BvaW50Wm9uZVRlbSAhPT0gYnJlYWtwb2ludFpvbmU7XG4gICAgICAvLyBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfSAvLyAqP1xuICAgICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludFN0YXJ0JywgaW5mbyhlKSk7IH1cbiAgICB9XG5cbiAgICB2YXIgaW5kQ2hhbmdlZCxcbiAgICAgICAgaXRlbXNDaGFuZ2VkLFxuICAgICAgICBpdGVtc1RlbSA9IGl0ZW1zLFxuICAgICAgICBkaXNhYmxlVGVtID0gZGlzYWJsZSxcbiAgICAgICAgZnJlZXplVGVtID0gZnJlZXplLFxuICAgICAgICBhcnJvd0tleXNUZW0gPSBhcnJvd0tleXMsXG4gICAgICAgIGNvbnRyb2xzVGVtID0gY29udHJvbHMsXG4gICAgICAgIG5hdlRlbSA9IG5hdixcbiAgICAgICAgdG91Y2hUZW0gPSB0b3VjaCxcbiAgICAgICAgbW91c2VEcmFnVGVtID0gbW91c2VEcmFnLFxuICAgICAgICBhdXRvcGxheVRlbSA9IGF1dG9wbGF5LFxuICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VUZW0gPSBhdXRvcGxheUhvdmVyUGF1c2UsXG4gICAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlUZW0gPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5LFxuICAgICAgICBpbmRleFRlbSA9IGluZGV4O1xuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgdmFyIGZpeGVkV2lkdGhUZW0gPSBmaXhlZFdpZHRoLFxuICAgICAgICAgIGF1dG9IZWlnaHRUZW0gPSBhdXRvSGVpZ2h0LFxuICAgICAgICAgIGNvbnRyb2xzVGV4dFRlbSA9IGNvbnRyb2xzVGV4dCxcbiAgICAgICAgICBjZW50ZXJUZW0gPSBjZW50ZXIsXG4gICAgICAgICAgYXV0b3BsYXlUZXh0VGVtID0gYXV0b3BsYXlUZXh0O1xuXG4gICAgICBpZiAoIUNTU01RKSB7XG4gICAgICAgIHZhciBndXR0ZXJUZW0gPSBndXR0ZXIsXG4gICAgICAgICAgICBlZGdlUGFkZGluZ1RlbSA9IGVkZ2VQYWRkaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCBvcHRpb246XG4gICAgLy8gZml4ZWQgd2lkdGg6IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXIgPT4gaXRlbXNcbiAgICAvLyBvdGhlcnM6IHdpbmRvdyB3aWR0aCA9PiBhbGwgdmFyaWFibGVzXG4gICAgLy8gYWxsOiBpdGVtcyA9PiBzbGlkZUJ5XG4gICAgYXJyb3dLZXlzID0gZ2V0T3B0aW9uKCdhcnJvd0tleXMnKTtcbiAgICBjb250cm9scyA9IGdldE9wdGlvbignY29udHJvbHMnKTtcbiAgICBuYXYgPSBnZXRPcHRpb24oJ25hdicpO1xuICAgIHRvdWNoID0gZ2V0T3B0aW9uKCd0b3VjaCcpO1xuICAgIGNlbnRlciA9IGdldE9wdGlvbignY2VudGVyJyk7XG4gICAgbW91c2VEcmFnID0gZ2V0T3B0aW9uKCdtb3VzZURyYWcnKTtcbiAgICBhdXRvcGxheSA9IGdldE9wdGlvbignYXV0b3BsYXknKTtcbiAgICBhdXRvcGxheUhvdmVyUGF1c2UgPSBnZXRPcHRpb24oJ2F1dG9wbGF5SG92ZXJQYXVzZScpO1xuICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5UmVzZXRPblZpc2liaWxpdHknKTtcblxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGRpc2FibGUgPSBnZXRPcHRpb24oJ2Rpc2FibGUnKTtcbiAgICAgIGZpeGVkV2lkdGggPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnKTtcbiAgICAgIHNwZWVkID0gZ2V0T3B0aW9uKCdzcGVlZCcpO1xuICAgICAgYXV0b0hlaWdodCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcpO1xuICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKTtcbiAgICAgIGF1dG9wbGF5VGV4dCA9IGdldE9wdGlvbignYXV0b3BsYXlUZXh0Jyk7XG4gICAgICBhdXRvcGxheVRpbWVvdXQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGltZW91dCcpO1xuXG4gICAgICBpZiAoIUNTU01RKSB7XG4gICAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpO1xuICAgICAgICBndXR0ZXIgPSBnZXRPcHRpb24oJ2d1dHRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB1cGRhdGUgb3B0aW9uc1xuICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlKTtcblxuICAgIHZpZXdwb3J0ID0gZ2V0Vmlld3BvcnRXaWR0aCgpOyAvLyA8PSBlZGdlUGFkZGluZywgZ3V0dGVyXG4gICAgaWYgKCghaG9yaXpvbnRhbCB8fCBhdXRvV2lkdGgpICYmICFkaXNhYmxlKSB7XG4gICAgICBzZXRTbGlkZVBvc2l0aW9ucygpO1xuICAgICAgaWYgKCFob3Jpem9udGFsKSB7XG4gICAgICAgIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7IC8vIDw9IHNldFNsaWRlUG9zaXRpb25zXG4gICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIHJpZ2h0Qm91bmRhcnkgPSBnZXRSaWdodEJvdW5kYXJ5KCk7IC8vIGF1dG9XaWR0aDogPD0gdmlld3BvcnQsIHNsaWRlUG9zaXRpb25zLCBndXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpeGVkV2lkdGg6IDw9IHZpZXdwb3J0LCBmaXhlZFdpZHRoLCBndXR0ZXJcbiAgICAgIGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgLy8gYXV0b1dpZHRoOiA8PSByaWdodEJvdW5kYXJ5LCBzbGlkZVBvc2l0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZFdpZHRoOiA8PSByaWdodEJvdW5kYXJ5LCBmaXhlZFdpZHRoLCBndXR0ZXJcbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkIHx8IGZpeGVkV2lkdGgpIHtcbiAgICAgIGl0ZW1zID0gZ2V0T3B0aW9uKCdpdGVtcycpO1xuICAgICAgc2xpZGVCeSA9IGdldE9wdGlvbignc2xpZGVCeScpO1xuICAgICAgaXRlbXNDaGFuZ2VkID0gaXRlbXMgIT09IGl0ZW1zVGVtO1xuXG4gICAgICBpZiAoaXRlbXNDaGFuZ2VkKSB7XG4gICAgICAgIGlmICghZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7IGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgfSAvLyA8PSBpdGVtc1xuICAgICAgICAvLyBjaGVjayBpbmRleCBiZWZvcmUgdHJhbnNmb3JtIGluIGNhc2VcbiAgICAgICAgLy8gc2xpZGVyIHJlYWNoIHRoZSByaWdodCBlZGdlIHRoZW4gaXRlbXMgYmVjb21lIGJpZ2dlclxuICAgICAgICB1cGRhdGVJbmRleCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBpZiAoZGlzYWJsZSAhPT0gZGlzYWJsZVRlbSkge1xuICAgICAgICBpZiAoZGlzYWJsZSkge1xuICAgICAgICAgIGRpc2FibGVTbGlkZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmFibGVTbGlkZXIoKTsgLy8gPD0gc2xpZGVQb3NpdGlvbnMsIHJpZ2h0Qm91bmRhcnksIGluZGV4TWF4XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnJlZXphYmxlICYmIChicENoYW5nZWQgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpKSB7XG4gICAgICBmcmVlemUgPSBnZXRGcmVlemUoKTsgLy8gPD0gYXV0b1dpZHRoOiBzbGlkZVBvc2l0aW9ucywgZ3V0dGVyLCB2aWV3cG9ydCwgcmlnaHRCb3VuZGFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDw9IGZpeGVkV2lkdGg6IGZpeGVkV2lkdGgsIGd1dHRlciwgcmlnaHRCb3VuZGFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDw9IG90aGVyczogaXRlbXNcblxuICAgICAgaWYgKGZyZWV6ZSAhPT0gZnJlZXplVGVtKSB7XG4gICAgICAgIGlmIChmcmVlemUpIHtcbiAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybShnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZShnZXRTdGFydEluZGV4KDApKSk7XG4gICAgICAgICAgZnJlZXplU2xpZGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5mcmVlemVTbGlkZXIoKTtcbiAgICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7IC8vIGNvbnRyb2xzLCBuYXYsIHRvdWNoLCBtb3VzZURyYWcsIGFycm93S2V5cywgYXV0b3BsYXksIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVxuICAgIGlmICghYXV0b3BsYXkpIHsgYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGZhbHNlOyB9XG5cbiAgICBpZiAoYXJyb3dLZXlzICE9PSBhcnJvd0tleXNUZW0pIHtcbiAgICAgIGFycm93S2V5cyA/XG4gICAgICAgIGFkZEV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7XG4gICAgfVxuICAgIGlmIChjb250cm9scyAhPT0gY29udHJvbHNUZW0pIHtcbiAgICAgIGlmIChjb250cm9scykge1xuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICBzaG93RWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgc2hvd0VsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBzaG93RWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICBoaWRlRWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgaGlkZUVsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBoaWRlRWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXYgIT09IG5hdlRlbSkge1xuICAgICAgbmF2ID9cbiAgICAgICAgc2hvd0VsZW1lbnQobmF2Q29udGFpbmVyKSA6XG4gICAgICAgIGhpZGVFbGVtZW50KG5hdkNvbnRhaW5lcik7XG4gICAgfVxuICAgIGlmICh0b3VjaCAhPT0gdG91Y2hUZW0pIHtcbiAgICAgIHRvdWNoID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMsIG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2gpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdG91Y2hFdmVudHMpO1xuICAgIH1cbiAgICBpZiAobW91c2VEcmFnICE9PSBtb3VzZURyYWdUZW0pIHtcbiAgICAgIG1vdXNlRHJhZyA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7XG4gICAgfVxuICAgIGlmIChhdXRvcGxheSAhPT0gYXV0b3BsYXlUZW0pIHtcbiAgICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgc2hvd0VsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgICAgIGlmICghYW5pbWF0aW5nICYmICFhdXRvcGxheVVzZXJQYXVzZWQpIHsgc3RhcnRBdXRvcGxheSgpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgaGlkZUVsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgICAgIGlmIChhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5KCk7IH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSAhPT0gYXV0b3BsYXlIb3ZlclBhdXNlVGVtKSB7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2UgP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cykgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7XG4gICAgfVxuICAgIGlmIChhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ICE9PSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtKSB7XG4gICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID9cbiAgICAgICAgYWRkRXZlbnRzKGRvYywgdmlzaWJpbGl0eUV2ZW50KSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhkb2MsIHZpc2liaWxpdHlFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgaWYgKGZpeGVkV2lkdGggIT09IGZpeGVkV2lkdGhUZW0gfHwgY2VudGVyICE9PSBjZW50ZXJUZW0pIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH1cblxuICAgICAgaWYgKGF1dG9IZWlnaHQgIT09IGF1dG9IZWlnaHRUZW0pIHtcbiAgICAgICAgaWYgKCFhdXRvSGVpZ2h0KSB7IGlubmVyV3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJzsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29udHJvbHMgJiYgY29udHJvbHNUZXh0ICE9PSBjb250cm9sc1RleHRUZW0pIHtcbiAgICAgICAgcHJldkJ1dHRvbi5pbm5lckhUTUwgPSBjb250cm9sc1RleHRbMF07XG4gICAgICAgIG5leHRCdXR0b24uaW5uZXJIVE1MID0gY29udHJvbHNUZXh0WzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXV0b3BsYXlCdXR0b24gJiYgYXV0b3BsYXlUZXh0ICE9PSBhdXRvcGxheVRleHRUZW0pIHtcbiAgICAgICAgdmFyIGkgPSBhdXRvcGxheSA/IDEgOiAwLFxuICAgICAgICAgICAgaHRtbCA9IGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCxcbiAgICAgICAgICAgIGxlbiA9IGh0bWwubGVuZ3RoIC0gYXV0b3BsYXlUZXh0VGVtW2ldLmxlbmd0aDtcbiAgICAgICAgaWYgKGh0bWwuc3Vic3RyaW5nKGxlbikgPT09IGF1dG9wbGF5VGV4dFRlbVtpXSkge1xuICAgICAgICAgIGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCA9IGh0bWwuc3Vic3RyaW5nKDAsIGxlbikgKyBhdXRvcGxheVRleHRbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNlbnRlciAmJiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9XG4gICAgfVxuXG4gICAgaWYgKGl0ZW1zQ2hhbmdlZCB8fCBmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIHBhZ2VzID0gZ2V0UGFnZXMoKTtcbiAgICAgIHVwZGF0ZU5hdlZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICBpbmRDaGFuZ2VkID0gaW5kZXggIT09IGluZGV4VGVtO1xuICAgIGlmIChpbmRDaGFuZ2VkKSB7IFxuICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG4gICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1zQ2hhbmdlZCkge1xuICAgICAgaWYgKCFpbmRDaGFuZ2VkKSB7IGFkZGl0aW9uYWxVcGRhdGVzKCk7IH1cbiAgICB9IGVsc2UgaWYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICBkb0xhenlMb2FkKCk7IFxuICAgICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcbiAgICAgIHVwZGF0ZUxpdmVSZWdpb24oKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbXNDaGFuZ2VkICYmICFjYXJvdXNlbCkgeyB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMoKTsgfVxuXG4gICAgaWYgKCFkaXNhYmxlICYmICFmcmVlemUpIHtcbiAgICAgIC8vIG5vbi1tZWR1YXF1ZXJpZXM6IElFOFxuICAgICAgaWYgKGJwQ2hhbmdlZCAmJiAhQ1NTTVEpIHtcbiAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXG4gICAgICAgIGlmIChhdXRvSGVpZ2h0ICE9PSBhdXRvaGVpZ2h0VGVtIHx8IHNwZWVkICE9PSBzcGVlZFRlbSkge1xuICAgICAgICAgIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgICBpZiAoZWRnZVBhZGRpbmcgIT09IGVkZ2VQYWRkaW5nVGVtIHx8IGd1dHRlciAhPT0gZ3V0dGVyVGVtKSB7XG4gICAgICAgICAgaW5uZXJXcmFwcGVyLnN0eWxlLmNzc1RleHQgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmcsIGd1dHRlciwgZml4ZWRXaWR0aCwgc3BlZWQsIGF1dG9IZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgICAgICAvLyBjb250YWluZXIgc3R5bGVzXG4gICAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzbGlkZSBzdHlsZXNcbiAgICAgICAgICB2YXIgc3RyID0gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpICsgXG4gICAgICAgICAgICAgICAgICAgIGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTtcblxuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgbGFzdCBsaW5lIGFuZFxuICAgICAgICAgIC8vIGFkZCBuZXcgc3R5bGVzXG4gICAgICAgICAgcmVtb3ZlQ1NTUnVsZShzaGVldCwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpIC0gMSk7XG4gICAgICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICcgPiAudG5zLWl0ZW0nLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXV0byBoZWlnaHRcbiAgICAgIGlmIChhdXRvSGVpZ2h0KSB7IGRvQXV0b0hlaWdodCgpOyB9XG5cbiAgICAgIGlmIChuZWVkQ29udGFpbmVyVHJhbnNmb3JtKSB7XG4gICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG4gICAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludEVuZCcsIGluZm8oZSkpOyB9XG4gIH1cblxuXG5cblxuXG4gIC8vID09PSBJTklUSUFMSVpBVElPTiBGVU5DVElPTlMgPT09IC8vXG4gIGZ1bmN0aW9uIGdldEZyZWV6ZSAoKSB7XG4gICAgaWYgKCFmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcbiAgICAgIHZhciBhID0gY2VudGVyID8gaXRlbXMgLSAoaXRlbXMgLSAxKSAvIDIgOiBpdGVtcztcbiAgICAgIHJldHVybiAgc2xpZGVDb3VudCA8PSBhO1xuICAgIH1cblxuICAgIHZhciB3aWR0aCA9IGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50IDogc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudF0sXG4gICAgICAgIHZwID0gZWRnZVBhZGRpbmcgPyB2aWV3cG9ydCArIGVkZ2VQYWRkaW5nICogMiA6IHZpZXdwb3J0ICsgZ3V0dGVyO1xuXG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgdnAgLT0gZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6ICh2aWV3cG9ydCAtIChzbGlkZVBvc2l0aW9uc1tpbmRleCArIDFdIC0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdIC0gZ3V0dGVyKSkgLyAyO1xuICAgIH1cblxuICAgIHJldHVybiB3aWR0aCA8PSB2cDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEJyZWFrcG9pbnRab25lICgpIHtcbiAgICBicmVha3BvaW50Wm9uZSA9IDA7XG4gICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgYnAgPSBwYXJzZUludChicCk7IC8vIGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgaWYgKHdpbmRvd1dpZHRoID49IGJwKSB7IGJyZWFrcG9pbnRab25lID0gYnA7IH1cbiAgICB9XG4gIH1cblxuICAvLyAoc2xpZGVCeSwgaW5kZXhNaW4sIGluZGV4TWF4KSA9PiBpbmRleFxuICB2YXIgdXBkYXRlSW5kZXggPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsb29wID8gXG4gICAgICBjYXJvdXNlbCA/XG4gICAgICAgIC8vIGxvb3AgKyBjYXJvdXNlbFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGxlZnRFZGdlID0gaW5kZXhNaW4sXG4gICAgICAgICAgICAgIHJpZ2h0RWRnZSA9IGluZGV4TWF4O1xuXG4gICAgICAgICAgbGVmdEVkZ2UgKz0gc2xpZGVCeTtcbiAgICAgICAgICByaWdodEVkZ2UgLT0gc2xpZGVCeTtcblxuICAgICAgICAgIC8vIGFkanVzdCBlZGdlcyB3aGVuIGhhcyBlZGdlIHBhZGRpbmdzXG4gICAgICAgICAgLy8gb3IgZml4ZWQtd2lkdGggc2xpZGVyIHdpdGggZXh0cmEgc3BhY2Ugb24gdGhlIHJpZ2h0IHNpZGVcbiAgICAgICAgICBpZiAoZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICAgIGxlZnRFZGdlICs9IDE7XG4gICAgICAgICAgICByaWdodEVkZ2UgLT0gMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgICAgIGlmICgodmlld3BvcnQgKyBndXR0ZXIpJShmaXhlZFdpZHRoICsgZ3V0dGVyKSkgeyByaWdodEVkZ2UgLT0gMTsgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICAgICAgaW5kZXggLT0gc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgICAgICBpbmRleCArPSBzbGlkZUNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAgIC8vIGxvb3AgKyBnYWxsZXJ5XG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gaW5kZXhNaW4gKyBzbGlkZUNvdW50KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA8PSBpbmRleE1heCAtIHNsaWRlQ291bnQpIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAvLyBub24tbG9vcFxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXhNaW4sIE1hdGgubWluKGluZGV4TWF4LCBpbmRleCkpO1xuICAgICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiBkaXNhYmxlVUkgKCkge1xuICAgIGlmICghYXV0b3BsYXkgJiYgYXV0b3BsYXlCdXR0b24pIHsgaGlkZUVsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgaWYgKCFuYXYgJiYgbmF2Q29udGFpbmVyKSB7IGhpZGVFbGVtZW50KG5hdkNvbnRhaW5lcik7IH1cbiAgICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgaGlkZUVsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZCdXR0b24pIHsgaGlkZUVsZW1lbnQocHJldkJ1dHRvbik7IH1cbiAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgaGlkZUVsZW1lbnQobmV4dEJ1dHRvbik7IH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVVSSAoKSB7XG4gICAgaWYgKGF1dG9wbGF5ICYmIGF1dG9wbGF5QnV0dG9uKSB7IHNob3dFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxuICAgIGlmIChuYXYgJiYgbmF2Q29udGFpbmVyKSB7IHNob3dFbGVtZW50KG5hdkNvbnRhaW5lcik7IH1cbiAgICBpZiAoY29udHJvbHMpIHtcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBzaG93RWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBzaG93RWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBzaG93RWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZyZWV6ZVNsaWRlciAoKSB7XG4gICAgaWYgKGZyb3plbikgeyByZXR1cm47IH1cblxuICAgIC8vIHJlbW92ZSBlZGdlIHBhZGRpbmcgZnJvbSBpbm5lciB3cmFwcGVyXG4gICAgaWYgKGVkZ2VQYWRkaW5nKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnMHB4JzsgfVxuXG4gICAgLy8gYWRkIGNsYXNzIHRucy10cmFuc3BhcmVudCB0byBjbG9uZWQgc2xpZGVzXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBzdHIgPSAndG5zLXRyYW5zcGFyZW50JztcbiAgICAgIGZvciAodmFyIGkgPSBjbG9uZUNvdW50OyBpLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBhZGRDbGFzcyhzbGlkZUl0ZW1zW2ldLCBzdHIpOyB9XG4gICAgICAgIGFkZENsYXNzKHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGkgLSAxXSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBkaXNhYmxlVUkoKTtcblxuICAgIGZyb3plbiA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB1bmZyZWV6ZVNsaWRlciAoKSB7XG4gICAgaWYgKCFmcm96ZW4pIHsgcmV0dXJuOyB9XG5cbiAgICAvLyByZXN0b3JlIGVkZ2UgcGFkZGluZyBmb3IgaW5uZXIgd3JhcHBlclxuICAgIC8vIGZvciBtb3JkZXJuIGJyb3dzZXJzXG4gICAgaWYgKGVkZ2VQYWRkaW5nICYmIENTU01RKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnJzsgfVxuXG4gICAgLy8gcmVtb3ZlIGNsYXNzIHRucy10cmFuc3BhcmVudCB0byBjbG9uZWQgc2xpZGVzXG4gICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgIHZhciBzdHIgPSAndG5zLXRyYW5zcGFyZW50JztcbiAgICAgIGZvciAodmFyIGkgPSBjbG9uZUNvdW50OyBpLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyByZW1vdmVDbGFzcyhzbGlkZUl0ZW1zW2ldLCBzdHIpOyB9XG4gICAgICAgIHJlbW92ZUNsYXNzKHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGkgLSAxXSwgc3RyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBlbmFibGVVSSgpO1xuXG4gICAgZnJvemVuID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlU2xpZGVyICgpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBzaGVldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZShuZXdDb250YWluZXJDbGFzc2VzLnN1YnN0cmluZygxKSwgJycpO1xuICAgIHJlbW92ZUF0dHJzKGNvbnRhaW5lciwgWydzdHlsZSddKTtcbiAgICBpZiAobG9vcCkge1xuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IGhpZGVFbGVtZW50KHNsaWRlSXRlbXNbal0pOyB9XG4gICAgICAgIGhpZGVFbGVtZW50KHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGogLSAxXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmVydGljYWwgc2xpZGVyXG4gICAgaWYgKCFob3Jpem9udGFsIHx8ICFjYXJvdXNlbCkgeyByZW1vdmVBdHRycyhpbm5lcldyYXBwZXIsIFsnc3R5bGUnXSk7IH1cblxuICAgIC8vIGdhbGxlcnlcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcbiAgICAgICAgcmVtb3ZlQXR0cnMoaXRlbSwgWydzdHlsZSddKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRvb2xzXG4gICAgZGlzYWJsZVVJKCk7XG5cbiAgICBkaXNhYmxlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVTbGlkZXIgKCkge1xuICAgIGlmICghZGlzYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBzaGVldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gbmV3Q29udGFpbmVyQ2xhc3NlcztcbiAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuXG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIGZvciAodmFyIGogPSBjbG9uZUNvdW50OyBqLS07KSB7XG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBzaG93RWxlbWVudChzbGlkZUl0ZW1zW2pdKTsgfVxuICAgICAgICBzaG93RWxlbWVudChzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBqIC0gMV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdhbGxlcnlcbiAgICBpZiAoIWNhcm91c2VsKSB7IFxuICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXSxcbiAgICAgICAgICAgIGNsYXNzTiA9IGkgPCBpbmRleCArIGl0ZW1zID8gYW5pbWF0ZUluIDogYW5pbWF0ZU5vcm1hbDtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NOKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBlbmFibGVVSSgpO1xuXG4gICAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUxpdmVSZWdpb24gKCkge1xuICAgIHZhciBzdHIgPSBnZXRMaXZlUmVnaW9uU3RyKCk7XG4gICAgaWYgKGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCAhPT0gc3RyKSB7IGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCA9IHN0cjsgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGl2ZVJlZ2lvblN0ciAoKSB7XG4gICAgdmFyIGFyciA9IGdldFZpc2libGVTbGlkZVJhbmdlKCksXG4gICAgICAgIHN0YXJ0ID0gYXJyWzBdICsgMSxcbiAgICAgICAgZW5kID0gYXJyWzFdICsgMTtcbiAgICByZXR1cm4gc3RhcnQgPT09IGVuZCA/IHN0YXJ0ICsgJycgOiBzdGFydCArICcgdG8gJyArIGVuZDsgXG4gIH1cblxuICBmdW5jdGlvbiBnZXRWaXNpYmxlU2xpZGVSYW5nZSAodmFsKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7IHZhbCA9IGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCk7IH1cbiAgICB2YXIgc3RhcnQgPSBpbmRleCwgZW5kLCByYW5nZXN0YXJ0LCByYW5nZWVuZDtcblxuICAgIC8vIGdldCByYW5nZSBzdGFydCwgcmFuZ2UgZW5kIGZvciBhdXRvV2lkdGggYW5kIGZpeGVkV2lkdGhcbiAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICBpZiAoYXV0b1dpZHRoIHx8IGZpeGVkV2lkdGgpIHtcbiAgICAgICAgcmFuZ2VzdGFydCA9IC0gKHBhcnNlRmxvYXQodmFsKSArIGVkZ2VQYWRkaW5nKTtcbiAgICAgICAgcmFuZ2VlbmQgPSByYW5nZXN0YXJ0ICsgdmlld3BvcnQgKyBlZGdlUGFkZGluZyAqIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgcmFuZ2VzdGFydCA9IHNsaWRlUG9zaXRpb25zW2luZGV4XTtcbiAgICAgICAgcmFuZ2VlbmQgPSByYW5nZXN0YXJ0ICsgdmlld3BvcnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IHN0YXJ0LCBlbmRcbiAgICAvLyAtIGNoZWNrIGF1dG8gd2lkdGhcbiAgICBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICBzbGlkZVBvc2l0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHBvaW50LCBpKSB7XG4gICAgICAgIGlmIChpIDwgc2xpZGVDb3VudE5ldykge1xuICAgICAgICAgIGlmICgoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSAmJiBwb2ludCA8PSByYW5nZXN0YXJ0ICsgMC41KSB7IHN0YXJ0ID0gaTsgfVxuICAgICAgICAgIGlmIChyYW5nZWVuZCAtIHBvaW50ID49IDAuNSkgeyBlbmQgPSBpOyB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgLy8gLSBjaGVjayBwZXJjZW50YWdlIHdpZHRoLCBmaXhlZCB3aWR0aFxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmIChmaXhlZFdpZHRoKSB7XG4gICAgICAgIHZhciBjZWxsID0gZml4ZWRXaWR0aCArIGd1dHRlcjtcbiAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihyYW5nZXN0YXJ0L2NlbGwpO1xuICAgICAgICAgIGVuZCA9IE1hdGguY2VpbChyYW5nZWVuZC9jZWxsIC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBNYXRoLmNlaWwodmlld3BvcnQvY2VsbCkgLSAxO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICB2YXIgYSA9IGl0ZW1zIC0gMTtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBzdGFydCAtPSBhIC8gMjtcbiAgICAgICAgICAgIGVuZCA9IGluZGV4ICsgYSAvIDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZCA9IGluZGV4ICsgYTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZWRnZVBhZGRpbmcpIHtcbiAgICAgICAgICAgIHZhciBiID0gZWRnZVBhZGRpbmcgKiBpdGVtcyAvIHZpZXdwb3J0O1xuICAgICAgICAgICAgc3RhcnQgLT0gYjtcbiAgICAgICAgICAgIGVuZCArPSBiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihzdGFydCk7XG4gICAgICAgICAgZW5kID0gTWF0aC5jZWlsKGVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gc3RhcnQgKyBpdGVtcyAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3RhcnQgPSBNYXRoLm1heChzdGFydCwgMCk7XG4gICAgICBlbmQgPSBNYXRoLm1pbihlbmQsIHNsaWRlQ291bnROZXcgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9MYXp5TG9hZCAoKSB7XG4gICAgaWYgKGxhenlsb2FkICYmICFkaXNhYmxlKSB7XG4gICAgICBnZXRJbWFnZUFycmF5LmFwcGx5KG51bGwsIGdldFZpc2libGVTbGlkZVJhbmdlKCkpLmZvckVhY2goZnVuY3Rpb24gKGltZykge1xuICAgICAgICBpZiAoIWhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHtcbiAgICAgICAgICAvLyBzdG9wIHByb3BhZ2F0aW9uIHRyYW5zaXRpb25lbmQgZXZlbnQgdG8gY29udGFpbmVyXG4gICAgICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH07XG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgZXZlKTtcblxuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgc3JjXG4gICAgICAgICAgaW1nLnNyYyA9IGdldEF0dHIoaW1nLCAnZGF0YS1zcmMnKTtcblxuICAgICAgICAgIC8vIHVwZGF0ZSBzcmNzZXRcbiAgICAgICAgICB2YXIgc3Jjc2V0ID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyY3NldCcpO1xuICAgICAgICAgIGlmIChzcmNzZXQpIHsgaW1nLnNyY3NldCA9IHNyY3NldDsgfVxuXG4gICAgICAgICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkltZ0xvYWRlZCAoZSkge1xuICAgIGltZ0xvYWRlZChnZXRUYXJnZXQoZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25JbWdGYWlsZWQgKGUpIHtcbiAgICBpbWdGYWlsZWQoZ2V0VGFyZ2V0KGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0xvYWRlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGVkJyk7XG4gICAgaW1nQ29tcGxldGVkKGltZyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdGYWlsZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ2ZhaWxlZCcpO1xuICAgIGltZ0NvbXBsZXRlZChpbWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nQ29tcGxldGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICd0bnMtY29tcGxldGUnKTtcbiAgICByZW1vdmVDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgcmVtb3ZlRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEltYWdlQXJyYXkgKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaW1ncyA9IFtdO1xuICAgIHdoaWxlIChzdGFydCA8PSBlbmQpIHtcbiAgICAgIGZvckVhY2goc2xpZGVJdGVtc1tzdGFydF0ucXVlcnlTZWxlY3RvckFsbCgnaW1nJyksIGZ1bmN0aW9uIChpbWcpIHsgaW1ncy5wdXNoKGltZyk7IH0pO1xuICAgICAgc3RhcnQrKztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1ncztcbiAgfVxuXG4gIC8vIGNoZWNrIGlmIGFsbCB2aXNpYmxlIGltYWdlcyBhcmUgbG9hZGVkXG4gIC8vIGFuZCB1cGRhdGUgY29udGFpbmVyIGhlaWdodCBpZiBpdCdzIGRvbmVcbiAgZnVuY3Rpb24gZG9BdXRvSGVpZ2h0ICgpIHtcbiAgICB2YXIgaW1ncyA9IGdldEltYWdlQXJyYXkuYXBwbHkobnVsbCwgZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSk7XG4gICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQpOyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ3NMb2FkZWRDaGVjayAoaW1ncywgY2IpIHtcbiAgICAvLyBkaXJlY3RseSBleGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uIGlmIGFsbCBpbWFnZXMgYXJlIGNvbXBsZXRlXG4gICAgaWYgKGltZ3NDb21wbGV0ZSkgeyByZXR1cm4gY2IoKTsgfVxuXG4gICAgLy8gY2hlY2sgc2VsZWN0ZWQgaW1hZ2UgY2xhc3NlcyBvdGhlcndpc2VcbiAgICBpbWdzLmZvckVhY2goZnVuY3Rpb24gKGltZywgaW5kZXgpIHtcbiAgICAgIGlmIChoYXNDbGFzcyhpbWcsIGltZ0NvbXBsZXRlQ2xhc3MpKSB7IGltZ3Muc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBzZWxlY3RlZCBpbWFnZXMgYXJlIGFsbCBjb21wbGV0ZVxuICAgIGlmICghaW1ncy5sZW5ndGgpIHsgcmV0dXJuIGNiKCk7IH1cblxuICAgIC8vIG90aGVyd2lzZSBleGVjdXRlIHRoaXMgZnVuY3Rpb25hIGFnYWluXG4gICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCBjYik7IH0pO1xuICB9IFxuXG4gIGZ1bmN0aW9uIGFkZGl0aW9uYWxVcGRhdGVzICgpIHtcbiAgICBkb0xhenlMb2FkKCk7IFxuICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XG4gICAgdXBkYXRlTGl2ZVJlZ2lvbigpO1xuICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XG4gICAgdXBkYXRlTmF2U3RhdHVzKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uICgpIHtcbiAgICBpZiAoY2Fyb3VzZWwgJiYgYXV0b0hlaWdodCkge1xuICAgICAgbWlkZGxlV3JhcHBlci5zdHlsZVtUUkFOU0lUSU9ORFVSQVRJT05dID0gc3BlZWQgLyAxMDAwICsgJ3MnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1heFNsaWRlSGVpZ2h0IChzbGlkZVN0YXJ0LCBzbGlkZVJhbmdlKSB7XG4gICAgdmFyIGhlaWdodHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gc2xpZGVTdGFydCwgbCA9IE1hdGgubWluKHNsaWRlU3RhcnQgKyBzbGlkZVJhbmdlLCBzbGlkZUNvdW50TmV3KTsgaSA8IGw7IGkrKykge1xuICAgICAgaGVpZ2h0cy5wdXNoKHNsaWRlSXRlbXNbaV0ub2Zmc2V0SGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgaGVpZ2h0cyk7XG4gIH1cblxuICAvLyB1cGRhdGUgaW5uZXIgd3JhcHBlciBoZWlnaHRcbiAgLy8gMS4gZ2V0IHRoZSBtYXgtaGVpZ2h0IG9mIHRoZSB2aXNpYmxlIHNsaWRlc1xuICAvLyAyLiBzZXQgdHJhbnNpdGlvbkR1cmF0aW9uIHRvIHNwZWVkXG4gIC8vIDMuIHVwZGF0ZSBpbm5lciB3cmFwcGVyIGhlaWdodCB0byBtYXgtaGVpZ2h0XG4gIC8vIDQuIHNldCB0cmFuc2l0aW9uRHVyYXRpb24gdG8gMHMgYWZ0ZXIgdHJhbnNpdGlvbiBkb25lXG4gIGZ1bmN0aW9uIHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCAoKSB7XG4gICAgdmFyIG1heEhlaWdodCA9IGF1dG9IZWlnaHQgPyBnZXRNYXhTbGlkZUhlaWdodChpbmRleCwgaXRlbXMpIDogZ2V0TWF4U2xpZGVIZWlnaHQoY2xvbmVDb3VudCwgc2xpZGVDb3VudCksXG4gICAgICAgIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XG5cbiAgICBpZiAod3Auc3R5bGUuaGVpZ2h0ICE9PSBtYXhIZWlnaHQpIHsgd3Auc3R5bGUuaGVpZ2h0ID0gbWF4SGVpZ2h0ICsgJ3B4JzsgfVxuICB9XG5cbiAgLy8gZ2V0IHRoZSBkaXN0YW5jZSBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgZmlyc3Qgc2xpZGUgdG8gZWFjaCBzbGlkZVxuICAvLyAoaW5pdCkgPT4gc2xpZGVQb3NpdGlvbnNcbiAgZnVuY3Rpb24gc2V0U2xpZGVQb3NpdGlvbnMgKCkge1xuICAgIHNsaWRlUG9zaXRpb25zID0gWzBdO1xuICAgIHZhciBhdHRyID0gaG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnLFxuICAgICAgICBhdHRyMiA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbScsXG4gICAgICAgIGJhc2UgPSBzbGlkZUl0ZW1zWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHJdO1xuXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICAvLyBza2lwIHRoZSBmaXJzdCBzbGlkZVxuICAgICAgaWYgKGkpIHsgc2xpZGVQb3NpdGlvbnMucHVzaChpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2F0dHJdIC0gYmFzZSk7IH1cbiAgICAgIC8vIGFkZCB0aGUgZW5kIGVkZ2VcbiAgICAgIGlmIChpID09PSBzbGlkZUNvdW50TmV3IC0gMSkgeyBzbGlkZVBvc2l0aW9ucy5wdXNoKGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cjJdIC0gYmFzZSk7IH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBzbGlkZVxuICBmdW5jdGlvbiB1cGRhdGVTbGlkZVN0YXR1cyAoKSB7XG4gICAgdmFyIHJhbmdlID0gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSxcbiAgICAgICAgc3RhcnQgPSByYW5nZVswXSxcbiAgICAgICAgZW5kID0gcmFuZ2VbMV07XG5cbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIC8vIHNob3cgc2xpZGVzXG4gICAgICBpZiAoaSA+PSBzdGFydCAmJiBpIDw9IGVuZCkge1xuICAgICAgICBpZiAoaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICAgIHJlbW92ZUF0dHJzKGl0ZW0sIFsnYXJpYS1oaWRkZW4nLCAndGFiaW5kZXgnXSk7XG4gICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIC8vIGhpZGUgc2xpZGVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc0F0dHIoaXRlbSwgJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGdhbGxlcnk6IHVwZGF0ZSBzbGlkZSBwb3NpdGlvblxuICBmdW5jdGlvbiB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMgKCkge1xuICAgIHZhciBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7XG4gICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcbiAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcblxuICAgICAgaWYgKGkgPj0gaW5kZXggJiYgaSA8IGwpIHtcbiAgICAgICAgLy8gYWRkIHRyYW5zaXRpb25zIHRvIHZpc2libGUgc2xpZGVzIHdoZW4gYWRqdXN0aW5nIHRoZWlyIHBvc2l0aW9uc1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCAndG5zLW1vdmluZycpO1xuXG4gICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgfSBlbHNlIGlmIChpdGVtLnN0eWxlLmxlZnQpIHtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgb3V0bGV0IGFuaW1hdGlvblxuICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZpbmcgJy50bnMtbW92aW5nJ1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCAndG5zLW1vdmluZycpO1xuICAgICAgfSk7XG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIC8vIHNldCB0YWJpbmRleCBvbiBOYXZcbiAgZnVuY3Rpb24gdXBkYXRlTmF2U3RhdHVzICgpIHtcbiAgICAvLyBnZXQgY3VycmVudCBuYXZcbiAgICBpZiAobmF2KSB7XG4gICAgICBuYXZDdXJyZW50SW5kZXggPSBuYXZDbGlja2VkID49IDAgPyBuYXZDbGlja2VkIDogZ2V0Q3VycmVudE5hdkluZGV4KCk7XG4gICAgICBuYXZDbGlja2VkID0gLTE7XG5cbiAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggIT09IG5hdkN1cnJlbnRJbmRleENhY2hlZCkge1xuICAgICAgICB2YXIgbmF2UHJldiA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleENhY2hlZF0sXG4gICAgICAgICAgICBuYXZDdXJyZW50ID0gbmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XTtcblxuICAgICAgICBzZXRBdHRycyhuYXZQcmV2LCB7XG4gICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXhDYWNoZWQgKyAxKVxuICAgICAgICB9KTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2UHJldiwgbmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICBcbiAgICAgICAgc2V0QXR0cnMobmF2Q3VycmVudCwgeydhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleCArIDEpICsgbmF2U3RyQ3VycmVudH0pO1xuICAgICAgICByZW1vdmVBdHRycyhuYXZDdXJyZW50LCAndGFiaW5kZXgnKTtcbiAgICAgICAgYWRkQ2xhc3MobmF2Q3VycmVudCwgbmF2QWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkN1cnJlbnRJbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMb3dlckNhc2VOb2RlTmFtZSAoZWwpIHtcbiAgICByZXR1cm4gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQnV0dG9uIChlbCkge1xuICAgIHJldHVybiBnZXRMb3dlckNhc2VOb2RlTmFtZShlbCkgPT09ICdidXR0b24nO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcmlhRGlzYWJsZWQgKGVsKSB7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpID09PSAndHJ1ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNFbmFibGVFbGVtZW50IChpc0J1dHRvbiwgZWwsIHZhbCkge1xuICAgIGlmIChpc0J1dHRvbikge1xuICAgICAgZWwuZGlzYWJsZWQgPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIHZhbC50b1N0cmluZygpKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgJ2Rpc2FibGVkJyB0byB0cnVlIG9uIGNvbnRyb2xzIHdoZW4gcmVhY2ggdGhlIGVkZ2VzXG4gIGZ1bmN0aW9uIHVwZGF0ZUNvbnRyb2xzU3RhdHVzICgpIHtcbiAgICBpZiAoIWNvbnRyb2xzIHx8IHJld2luZCB8fCBsb29wKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIHByZXZEaXNhYmxlZCA9IChwcmV2SXNCdXR0b24pID8gcHJldkJ1dHRvbi5kaXNhYmxlZCA6IGlzQXJpYURpc2FibGVkKHByZXZCdXR0b24pLFxuICAgICAgICBuZXh0RGlzYWJsZWQgPSAobmV4dElzQnV0dG9uKSA/IG5leHRCdXR0b24uZGlzYWJsZWQgOiBpc0FyaWFEaXNhYmxlZChuZXh0QnV0dG9uKSxcbiAgICAgICAgZGlzYWJsZVByZXYgPSAoaW5kZXggPD0gaW5kZXhNaW4pID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICBkaXNhYmxlTmV4dCA9ICghcmV3aW5kICYmIGluZGV4ID49IGluZGV4TWF4KSA/IHRydWUgOiBmYWxzZTtcblxuICAgIGlmIChkaXNhYmxlUHJldiAmJiAhcHJldkRpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICghZGlzYWJsZVByZXYgJiYgcHJldkRpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoZGlzYWJsZU5leHQgJiYgIW5leHREaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgICBpZiAoIWRpc2FibGVOZXh0ICYmIG5leHREaXNhYmxlZCkge1xuICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgZHVyYXRpb25cbiAgZnVuY3Rpb24gcmVzZXREdXJhdGlvbiAoZWwsIHN0cikge1xuICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgZWwuc3R5bGVbVFJBTlNJVElPTkRVUkFUSU9OXSA9IHN0cjsgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVyV2lkdGggKCkge1xuICAgIHJldHVybiBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudE5ldyA6IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXddO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2VudGVyR2FwIChudW0pIHtcbiAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cblxuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGd1dHRlciA6IDA7XG4gICAgcmV0dXJuIGF1dG9XaWR0aCA/ICgodmlld3BvcnQgLSBnYXApIC0gKHNsaWRlUG9zaXRpb25zW251bSArIDFdIC0gc2xpZGVQb3NpdGlvbnNbbnVtXSAtIGd1dHRlcikpLzIgOlxuICAgICAgZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6XG4gICAgICAgIChpdGVtcyAtIDEpIC8gMjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJpZ2h0Qm91bmRhcnkgKCkge1xuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGd1dHRlciA6IDAsXG4gICAgICAgIHJlc3VsdCA9ICh2aWV3cG9ydCArIGdhcCkgLSBnZXRTbGlkZXJXaWR0aCgpO1xuXG4gICAgaWYgKGNlbnRlciAmJiAhbG9vcCkge1xuICAgICAgcmVzdWx0ID0gZml4ZWRXaWR0aCA/IC0gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogKHNsaWRlQ291bnROZXcgLSAxKSAtIGdldENlbnRlckdhcCgpIDpcbiAgICAgICAgZ2V0Q2VudGVyR2FwKHNsaWRlQ291bnROZXcgLSAxKSAtIHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXcgLSAxXTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA+IDApIHsgcmVzdWx0ID0gMDsgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlIChudW0pIHtcbiAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cblxuICAgIHZhciB2YWw7XG4gICAgaWYgKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgdmFsID0gLSAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBudW07XG4gICAgICAgIGlmIChjZW50ZXIpIHsgdmFsICs9IGdldENlbnRlckdhcCgpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVub21pbmF0b3IgPSBUUkFOU0ZPUk0gPyBzbGlkZUNvdW50TmV3IDogaXRlbXM7XG4gICAgICAgIGlmIChjZW50ZXIpIHsgbnVtIC09IGdldENlbnRlckdhcCgpOyB9XG4gICAgICAgIHZhbCA9IC0gbnVtICogMTAwIC8gZGVub21pbmF0b3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbCA9IC0gc2xpZGVQb3NpdGlvbnNbbnVtXTtcbiAgICAgIGlmIChjZW50ZXIgJiYgYXV0b1dpZHRoKSB7XG4gICAgICAgIHZhbCArPSBnZXRDZW50ZXJHYXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyB2YWwgPSBNYXRoLm1heCh2YWwsIHJpZ2h0Qm91bmRhcnkpOyB9XG5cbiAgICB2YWwgKz0gKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAhZml4ZWRXaWR0aCkgPyAnJScgOiAncHgnO1xuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50ICh2YWwpIHtcbiAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJzBzJyk7XG4gICAgZG9Db250YWluZXJUcmFuc2Zvcm0odmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtICh2YWwpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHsgdmFsID0gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKTsgfVxuICAgIGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXSA9IHRyYW5zZm9ybVByZWZpeCArIHZhbCArIHRyYW5zZm9ybVBvc3RmaXg7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlU2xpZGUgKG51bWJlciwgY2xhc3NPdXQsIGNsYXNzSW4sIGlzT3V0KSB7XG4gICAgdmFyIGwgPSBudW1iZXIgKyBpdGVtcztcbiAgICBpZiAoIWxvb3ApIHsgbCA9IE1hdGgubWluKGwsIHNsaWRlQ291bnROZXcpOyB9XG5cbiAgICBmb3IgKHZhciBpID0gbnVtYmVyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcblxuICAgICAgLy8gc2V0IGl0ZW0gcG9zaXRpb25zXG4gICAgICBpZiAoIWlzT3V0KSB7IGl0ZW0uc3R5bGUubGVmdCA9IChpIC0gaW5kZXgpICogMTAwIC8gaXRlbXMgKyAnJSc7IH1cblxuICAgICAgaWYgKGFuaW1hdGVEZWxheSAmJiBUUkFOU0lUSU9OREVMQVkpIHtcbiAgICAgICAgaXRlbS5zdHlsZVtUUkFOU0lUSU9OREVMQVldID0gaXRlbS5zdHlsZVtBTklNQVRJT05ERUxBWV0gPSBhbmltYXRlRGVsYXkgKiAoaSAtIG51bWJlcikgLyAxMDAwICsgJ3MnO1xuICAgICAgfVxuICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgY2xhc3NPdXQpO1xuICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NJbik7XG4gICAgICBcbiAgICAgIGlmIChpc091dCkgeyBzbGlkZUl0ZW1zT3V0LnB1c2goaXRlbSk7IH1cbiAgICB9XG4gIH1cblxuICAvLyBtYWtlIHRyYW5zZmVyIGFmdGVyIGNsaWNrL2RyYWc6XG4gIC8vIDEuIGNoYW5nZSAndHJhbnNmb3JtJyBwcm9wZXJ0eSBmb3IgbW9yZGVybiBicm93c2Vyc1xuICAvLyAyLiBjaGFuZ2UgJ2xlZnQnIHByb3BlcnR5IGZvciBsZWdhY3kgYnJvd3NlcnNcbiAgdmFyIHRyYW5zZm9ybUNvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYXJvdXNlbCA/XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnJyk7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gfHwgIXNwZWVkKSB7XG4gICAgICAgICAgLy8gZm9yIG1vcmRlbiBicm93c2VycyB3aXRoIG5vbi16ZXJvIGR1cmF0aW9uIG9yIFxuICAgICAgICAgIC8vIHplcm8gZHVyYXRpb24gZm9yIGFsbCBicm93c2Vyc1xuICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKCk7XG4gICAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5IFxuICAgICAgICAgIC8vIHdoZW4gZHVyYXRpb24gaXMgMCAvIGNvbnRhaW5lciBpcyBoaWRkZW5cbiAgICAgICAgICBpZiAoIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZm9yIG9sZCBicm93c2VyIHdpdGggbm9uLXplcm8gZHVyYXRpb25cbiAgICAgICAgICBqc1RyYW5zZm9ybShjb250YWluZXIsIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKSwgc3BlZWQsIG9uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhvcml6b250YWwpIHsgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTsgfVxuICAgICAgfSA6XG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNsaWRlSXRlbXNPdXQgPSBbXTtcblxuICAgICAgICB2YXIgZXZlID0ge307XG4gICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGV2ZVtBTklNQVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgICByZW1vdmVFdmVudHMoc2xpZGVJdGVtc1tpbmRleENhY2hlZF0sIGV2ZSk7XG4gICAgICAgIGFkZEV2ZW50cyhzbGlkZUl0ZW1zW2luZGV4XSwgZXZlKTtcblxuICAgICAgICBhbmltYXRlU2xpZGUoaW5kZXhDYWNoZWQsIGFuaW1hdGVJbiwgYW5pbWF0ZU91dCwgdHJ1ZSk7XG4gICAgICAgIGFuaW1hdGVTbGlkZShpbmRleCwgYW5pbWF0ZU5vcm1hbCwgYW5pbWF0ZUluKTtcblxuICAgICAgICAvLyBydW4gZmFsbGJhY2sgZnVuY3Rpb24gbWFudWFsbHkgXG4gICAgICAgIC8vIHdoZW4gdHJhbnNpdGlvbiBvciBhbmltYXRpb24gbm90IHN1cHBvcnRlZCAvIGR1cmF0aW9uIGlzIDBcbiAgICAgICAgaWYgKCFUUkFOU0lUSU9ORU5EIHx8ICFBTklNQVRJT05FTkQgfHwgIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiByZW5kZXIgKGUsIHNsaWRlck1vdmVkKSB7XG4gICAgaWYgKHVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtKSB7IHVwZGF0ZUluZGV4KCk7IH1cblxuICAgIC8vIHJlbmRlciB3aGVuIHNsaWRlciB3YXMgbW92ZWQgKHRvdWNoIG9yIGRyYWcpIGV2ZW4gdGhvdWdoIGluZGV4IG1heSBub3QgY2hhbmdlXG4gICAgaWYgKGluZGV4ICE9PSBpbmRleENhY2hlZCB8fCBzbGlkZXJNb3ZlZCkge1xuICAgICAgLy8gZXZlbnRzXG4gICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcbiAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnLCBpbmZvKCkpO1xuICAgICAgaWYgKGF1dG9IZWlnaHQpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cblxuICAgICAgLy8gcGF1c2UgYXV0b3BsYXkgd2hlbiBjbGljayBvciBrZXlkb3duIGZyb20gdXNlclxuICAgICAgaWYgKGFuaW1hdGluZyAmJiBlICYmIFsnY2xpY2snLCAna2V5ZG93biddLmluZGV4T2YoZS50eXBlKSA+PSAwKSB7IHN0b3BBdXRvcGxheSgpOyB9XG5cbiAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgdHJhbnNmb3JtQ29yZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFRyYW5zZmVyIHByZWZpeGVkIHByb3BlcnRpZXMgdG8gdGhlIHNhbWUgZm9ybWF0XG4gICAqIENTUzogLVdlYmtpdC1UcmFuc2Zvcm0gPT4gd2Via2l0dHJhbnNmb3JtXG4gICAqIEpTOiBXZWJraXRUcmFuc2Zvcm0gPT4gd2Via2l0dHJhbnNmb3JtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBwcm9wZXJ0eVxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gc3RyVHJhbnMgKHN0cikge1xuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tL2csICcnKTtcbiAgfVxuXG4gIC8vIEFGVEVSIFRSQU5TRk9STVxuICAvLyBUaGluZ3MgbmVlZCB0byBiZSBkb25lIGFmdGVyIGEgdHJhbnNmZXI6XG4gIC8vIDEuIGNoZWNrIGluZGV4XG4gIC8vIDIuIGFkZCBjbGFzc2VzIHRvIHZpc2libGUgc2xpZGVcbiAgLy8gMy4gZGlzYWJsZSBjb250cm9scyBidXR0b25zIHdoZW4gcmVhY2ggdGhlIGZpcnN0L2xhc3Qgc2xpZGUgaW4gbm9uLWxvb3Agc2xpZGVyXG4gIC8vIDQuIHVwZGF0ZSBuYXYgc3RhdHVzXG4gIC8vIDUuIGxhenlsb2FkIGltYWdlc1xuICAvLyA2LiB1cGRhdGUgY29udGFpbmVyIGhlaWdodFxuICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQgKGV2ZW50KSB7XG4gICAgLy8gY2hlY2sgcnVubmluZyBvbiBnYWxsZXJ5IG1vZGVcbiAgICAvLyBtYWtlIHN1cmUgdHJhbnRpb25lbmQvYW5pbWF0aW9uZW5kIGV2ZW50cyBydW4gb25seSBvbmNlXG4gICAgaWYgKGNhcm91c2VsIHx8IHJ1bm5pbmcpIHtcbiAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uRW5kJywgaW5mbyhldmVudCkpO1xuXG4gICAgICBpZiAoIWNhcm91c2VsICYmIHNsaWRlSXRlbXNPdXQubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlSXRlbXNPdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IHNsaWRlSXRlbXNPdXRbaV07XG4gICAgICAgICAgLy8gc2V0IGl0ZW0gcG9zaXRpb25zXG4gICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gJyc7XG5cbiAgICAgICAgICBpZiAoQU5JTUFUSU9OREVMQVkgJiYgVFJBTlNJVElPTkRFTEFZKSB7IFxuICAgICAgICAgICAgaXRlbS5zdHlsZVtBTklNQVRJT05ERUxBWV0gPSAnJztcbiAgICAgICAgICAgIGl0ZW0uc3R5bGVbVFJBTlNJVElPTkRFTEFZXSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlT3V0KTtcbiAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKiB1cGRhdGUgc2xpZGVzLCBuYXYsIGNvbnRyb2xzIGFmdGVyIGNoZWNraW5nIC4uLlxuICAgICAgICogPT4gbGVnYWN5IGJyb3dzZXJzIHdobyBkb24ndCBzdXBwb3J0ICdldmVudCcgXG4gICAgICAgKiAgICBoYXZlIHRvIGNoZWNrIGV2ZW50IGZpcnN0LCBvdGhlcndpc2UgZXZlbnQudGFyZ2V0IHdpbGwgY2F1c2UgYW4gZXJyb3IgXG4gICAgICAgKiA9PiBvciAnZ2FsbGVyeScgbW9kZTogXG4gICAgICAgKiAgICsgZXZlbnQgdGFyZ2V0IGlzIHNsaWRlIGl0ZW1cbiAgICAgICAqID0+IG9yICdjYXJvdXNlbCcgbW9kZTogXG4gICAgICAgKiAgICsgZXZlbnQgdGFyZ2V0IGlzIGNvbnRhaW5lciwgXG4gICAgICAgKiAgICsgZXZlbnQucHJvcGVydHkgaXMgdGhlIHNhbWUgd2l0aCB0cmFuc2Zvcm0gYXR0cmlidXRlXG4gICAgICAgKi9cbiAgICAgIGlmICghZXZlbnQgfHwgXG4gICAgICAgICAgIWNhcm91c2VsICYmIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlID09PSBjb250YWluZXIgfHwgXG4gICAgICAgICAgZXZlbnQudGFyZ2V0ID09PSBjb250YWluZXIgJiYgc3RyVHJhbnMoZXZlbnQucHJvcGVydHlOYW1lKSA9PT0gc3RyVHJhbnModHJhbnNmb3JtQXR0cikpIHtcblxuICAgICAgICBpZiAoIXVwZGF0ZUluZGV4QmVmb3JlVHJhbnNmb3JtKSB7IFxuICAgICAgICAgIHZhciBpbmRleFRlbSA9IGluZGV4O1xuICAgICAgICAgIHVwZGF0ZUluZGV4KCk7XG4gICAgICAgICAgaWYgKGluZGV4ICE9PSBpbmRleFRlbSkgeyBcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuXG4gICAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcblxuICAgICAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7IGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7IH1cbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICBpbmRleENhY2hlZCA9IGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLy8gIyBBQ1RJT05TXG4gIGZ1bmN0aW9uIGdvVG8gKHRhcmdldEluZGV4LCBlKSB7XG4gICAgaWYgKGZyZWV6ZSkgeyByZXR1cm47IH1cblxuICAgIC8vIHByZXYgc2xpZGVCeVxuICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ3ByZXYnKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpO1xuXG4gICAgLy8gbmV4dCBzbGlkZUJ5XG4gICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ25leHQnKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XG5cbiAgICAvLyBnbyB0byBleGFjdCBzbGlkZVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICAgIH1cblxuICAgICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSwgXG4gICAgICAgICAgaW5kZXhHYXAgPSAwO1xuXG4gICAgICBpZiAodGFyZ2V0SW5kZXggPT09ICdmaXJzdCcpIHtcbiAgICAgICAgaW5kZXhHYXAgPSAtIGFic0luZGV4O1xuICAgICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ2xhc3QnKSB7XG4gICAgICAgIGluZGV4R2FwID0gY2Fyb3VzZWwgPyBzbGlkZUNvdW50IC0gaXRlbXMgLSBhYnNJbmRleCA6IHNsaWRlQ291bnQgLSAxIC0gYWJzSW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldEluZGV4ICE9PSAnbnVtYmVyJykgeyB0YXJnZXRJbmRleCA9IHBhcnNlSW50KHRhcmdldEluZGV4KTsgfVxuXG4gICAgICAgIGlmICghaXNOYU4odGFyZ2V0SW5kZXgpKSB7XG4gICAgICAgICAgLy8gZnJvbSBkaXJlY3RseSBjYWxsZWQgZ29UbyBmdW5jdGlvblxuICAgICAgICAgIGlmICghZSkgeyB0YXJnZXRJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNsaWRlQ291bnQgLSAxLCB0YXJnZXRJbmRleCkpOyB9XG5cbiAgICAgICAgICBpbmRleEdhcCA9IHRhcmdldEluZGV4IC0gYWJzSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZ2FsbGVyeTogbWFrZSBzdXJlIG5ldyBwYWdlIHdvbid0IG92ZXJsYXAgd2l0aCBjdXJyZW50IHBhZ2VcbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgaW5kZXhHYXAgJiYgTWF0aC5hYnMoaW5kZXhHYXApIDwgaXRlbXMpIHtcbiAgICAgICAgdmFyIGZhY3RvciA9IGluZGV4R2FwID4gMCA/IDEgOiAtMTtcbiAgICAgICAgaW5kZXhHYXAgKz0gKGluZGV4ICsgaW5kZXhHYXAgLSBzbGlkZUNvdW50KSA+PSBpbmRleE1pbiA/IHNsaWRlQ291bnQgKiBmYWN0b3IgOiBzbGlkZUNvdW50ICogMiAqIGZhY3RvciAqIC0xO1xuICAgICAgfVxuXG4gICAgICBpbmRleCArPSBpbmRleEdhcDtcblxuICAgICAgLy8gbWFrZSBzdXJlIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICBpZiAoY2Fyb3VzZWwgJiYgbG9vcCkge1xuICAgICAgICBpZiAoaW5kZXggPCBpbmRleE1pbikgeyBpbmRleCArPSBzbGlkZUNvdW50OyB9XG4gICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgaW5kZXggaXMgY2hhbmdlZCwgc3RhcnQgcmVuZGVyaW5nXG4gICAgICBpZiAoZ2V0QWJzSW5kZXgoaW5kZXgpICE9PSBnZXRBYnNJbmRleChpbmRleENhY2hlZCkpIHtcbiAgICAgICAgcmVuZGVyKGUpO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgLy8gb24gY29udHJvbHMgY2xpY2tcbiAgZnVuY3Rpb24gb25Db250cm9sc0NsaWNrIChlLCBkaXIpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuICAgIHZhciBwYXNzRXZlbnRPYmplY3Q7XG5cbiAgICBpZiAoIWRpcikge1xuICAgICAgZSA9IGdldEV2ZW50KGUpO1xuICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKTtcblxuICAgICAgd2hpbGUgKHRhcmdldCAhPT0gY29udHJvbHNDb250YWluZXIgJiYgW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KSA8IDApIHsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7IH1cblxuICAgICAgdmFyIHRhcmdldEluID0gW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgIGlmICh0YXJnZXRJbiA+PSAwKSB7XG4gICAgICAgIHBhc3NFdmVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGRpciA9IHRhcmdldEluID09PSAwID8gLTEgOiAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXdpbmQpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gaW5kZXhNaW4gJiYgZGlyID09PSAtMSkge1xuICAgICAgICBnb1RvKCdsYXN0JywgZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IGluZGV4TWF4ICYmIGRpciA9PT0gMSkge1xuICAgICAgICBnb1RvKCdmaXJzdCcsIGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpcikge1xuICAgICAgaW5kZXggKz0gc2xpZGVCeSAqIGRpcjtcbiAgICAgIGlmIChhdXRvV2lkdGgpIHsgaW5kZXggPSBNYXRoLmZsb29yKGluZGV4KTsgfVxuICAgICAgLy8gcGFzcyBlIHdoZW4gY2xpY2sgY29udHJvbCBidXR0b25zIG9yIGtleWRvd25cbiAgICAgIHJlbmRlcigocGFzc0V2ZW50T2JqZWN0IHx8IChlICYmIGUudHlwZSA9PT0gJ2tleWRvd24nKSkgPyBlIDogbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gb24gbmF2IGNsaWNrXG4gIGZ1bmN0aW9uIG9uTmF2Q2xpY2sgKGUpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuICAgIFxuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpLCBuYXZJbmRleDtcblxuICAgIC8vIGZpbmQgdGhlIGNsaWNrZWQgbmF2IGl0ZW1cbiAgICB3aGlsZSAodGFyZ2V0ICE9PSBuYXZDb250YWluZXIgJiYgIWhhc0F0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSkgeyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTsgfVxuICAgIGlmIChoYXNBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpIHtcbiAgICAgIHZhciBuYXZJbmRleCA9IG5hdkNsaWNrZWQgPSBOdW1iZXIoZ2V0QXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSxcbiAgICAgICAgICB0YXJnZXRJbmRleEJhc2UgPSBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IG5hdkluZGV4ICogc2xpZGVDb3VudCAvIHBhZ2VzIDogbmF2SW5kZXggKiBpdGVtcyxcbiAgICAgICAgICB0YXJnZXRJbmRleCA9IG5hdkFzVGh1bWJuYWlscyA/IG5hdkluZGV4IDogTWF0aC5taW4oTWF0aC5jZWlsKHRhcmdldEluZGV4QmFzZSksIHNsaWRlQ291bnQgLSAxKTtcbiAgICAgIGdvVG8odGFyZ2V0SW5kZXgsIGUpO1xuXG4gICAgICBpZiAobmF2Q3VycmVudEluZGV4ID09PSBuYXZJbmRleCkge1xuICAgICAgICBpZiAoYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheSgpOyB9XG4gICAgICAgIG5hdkNsaWNrZWQgPSAtMTsgLy8gcmVzZXQgbmF2Q2xpY2tlZFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGF1dG9wbGF5IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBzZXRBdXRvcGxheVRpbWVyICgpIHtcbiAgICBhdXRvcGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgb25Db250cm9sc0NsaWNrKG51bGwsIGF1dG9wbGF5RGlyZWN0aW9uKTtcbiAgICB9LCBhdXRvcGxheVRpbWVvdXQpO1xuXG4gICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BBdXRvcGxheVRpbWVyICgpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9wbGF5VGltZXIpO1xuICAgIGFuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQXV0b3BsYXlCdXR0b24gKGFjdGlvbiwgdHh0KSB7XG4gICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiBhY3Rpb259KTtcbiAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBhdXRvcGxheUh0bWxTdHJpbmdzWzBdICsgYWN0aW9uICsgYXV0b3BsYXlIdG1sU3RyaW5nc1sxXSArIHR4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QXV0b3BsYXkgKCkge1xuICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgdXBkYXRlQXV0b3BsYXlCdXR0b24oJ3N0b3AnLCBhdXRvcGxheVRleHRbMV0pOyB9XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wQXV0b3BsYXkgKCkge1xuICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHVwZGF0ZUF1dG9wbGF5QnV0dG9uKCdzdGFydCcsIGF1dG9wbGF5VGV4dFswXSk7IH1cbiAgfVxuXG4gIC8vIHByb2dyYW1haXRjYWxseSBwbGF5L3BhdXNlIHRoZSBzbGlkZXJcbiAgZnVuY3Rpb24gcGxheSAoKSB7XG4gICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHtcbiAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwYXVzZSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgc3RvcEF1dG9wbGF5KCk7XG4gICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUF1dG9wbGF5ICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICBzdG9wQXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVmlzaWJpbGl0eUNoYW5nZSAoKSB7XG4gICAgaWYgKGRvYy5oaWRkZW4pIHtcbiAgICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCkge1xuICAgICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdmVyUGF1c2UgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHsgXG4gICAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdXRSZXN0YXJ0ICgpIHtcbiAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlZCkgeyBcbiAgICAgIHNldEF1dG9wbGF5VGltZXIoKTtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBrZXlkb3duIGV2ZW50cyBvbiBkb2N1bWVudCBcbiAgZnVuY3Rpb24gb25Eb2N1bWVudEtleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVF0uaW5kZXhPZihlLmtleUNvZGUpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCBrZXlJbmRleCA9PT0gMCA/IC0xIDogMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gb24ga2V5IGNvbnRyb2xcbiAgZnVuY3Rpb24gb25Db250cm9sc0tleWRvd24gKGUpIHtcbiAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVF0uaW5kZXhPZihlLmtleUNvZGUpO1xuXG4gICAgaWYgKGtleUluZGV4ID49IDApIHtcbiAgICAgIGlmIChrZXlJbmRleCA9PT0gMCkge1xuICAgICAgICBpZiAoIXByZXZCdXR0b24uZGlzYWJsZWQpIHsgb25Db250cm9sc0NsaWNrKGUsIC0xKTsgfVxuICAgICAgfSBlbHNlIGlmICghbmV4dEJ1dHRvbi5kaXNhYmxlZCkge1xuICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IGZvY3VzXG4gIGZ1bmN0aW9uIHNldEZvY3VzIChlbCkge1xuICAgIGVsLmZvY3VzKCk7XG4gIH1cblxuICAvLyBvbiBrZXkgbmF2XG4gIGZ1bmN0aW9uIG9uTmF2S2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIgY3VyRWxlbWVudCA9IGRvYy5hY3RpdmVFbGVtZW50O1xuICAgIGlmICghaGFzQXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSkgeyByZXR1cm47IH1cblxuICAgIC8vIHZhciBjb2RlID0gZS5rZXlDb2RlLFxuICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFQsIEtFWVMuRU5URVIsIEtFWVMuU1BBQ0VdLmluZGV4T2YoZS5rZXlDb2RlKSxcbiAgICAgICAgbmF2SW5kZXggPSBOdW1iZXIoZ2V0QXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgaWYgKGtleUluZGV4ID09PSAwKSB7XG4gICAgICAgIGlmIChuYXZJbmRleCA+IDApIHsgc2V0Rm9jdXMobmF2SXRlbXNbbmF2SW5kZXggLSAxXSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoa2V5SW5kZXggPT09IDEpIHtcbiAgICAgICAgaWYgKG5hdkluZGV4IDwgcGFnZXMgLSAxKSB7IHNldEZvY3VzKG5hdkl0ZW1zW25hdkluZGV4ICsgMV0pOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYXZDbGlja2VkID0gbmF2SW5kZXg7XG4gICAgICAgIGdvVG8obmF2SW5kZXgsIGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV2ZW50IChlKSB7XG4gICAgZSA9IGUgfHwgd2luLmV2ZW50O1xuICAgIHJldHVybiBpc1RvdWNoRXZlbnQoZSkgPyBlLmNoYW5nZWRUb3VjaGVzWzBdIDogZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRUYXJnZXQgKGUpIHtcbiAgICByZXR1cm4gZS50YXJnZXQgfHwgd2luLmV2ZW50LnNyY0VsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQgKGUpIHtcbiAgICByZXR1cm4gZS50eXBlLmluZGV4T2YoJ3RvdWNoJykgPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0QmVoYXZpb3IgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkICgpIHtcbiAgICByZXR1cm4gZ2V0VG91Y2hEaXJlY3Rpb24odG9EZWdyZWUobGFzdFBvc2l0aW9uLnkgLSBpbml0UG9zaXRpb24ueSwgbGFzdFBvc2l0aW9uLnggLSBpbml0UG9zaXRpb24ueCksIHN3aXBlQW5nbGUpID09PSBvcHRpb25zLmF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiBvblBhblN0YXJ0IChlKSB7XG4gICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgIH1cblxuICAgIGlmIChhdXRvcGxheSAmJiBhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5VGltZXIoKTsgfVxuICAgIFxuICAgIHBhblN0YXJ0ID0gdHJ1ZTtcbiAgICBpZiAocmFmSW5kZXgpIHtcbiAgICAgIGNhZihyYWZJbmRleCk7XG4gICAgICByYWZJbmRleCA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hTdGFydCcgOiAnZHJhZ1N0YXJ0JywgaW5mbyhlKSk7XG5cbiAgICBpZiAoIWlzVG91Y2hFdmVudChlKSAmJiBbJ2ltZycsICdhJ10uaW5kZXhPZihnZXRMb3dlckNhc2VOb2RlTmFtZShnZXRUYXJnZXQoZSkpKSA+PSAwKSB7XG4gICAgICBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yKGUpO1xuICAgIH1cblxuICAgIGxhc3RQb3NpdGlvbi54ID0gaW5pdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgbGFzdFBvc2l0aW9uLnkgPSBpbml0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcbiAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgIHRyYW5zbGF0ZUluaXQgPSBwYXJzZUZsb2F0KGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXS5yZXBsYWNlKHRyYW5zZm9ybVByZWZpeCwgJycpKTtcbiAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnMHMnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblBhbk1vdmUgKGUpIHtcbiAgICBpZiAocGFuU3RhcnQpIHtcbiAgICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgICBsYXN0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICAgIGxhc3RQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuXG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKCFyYWZJbmRleCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkID09PSAnPycpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkKCk7IH1cbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldmVudFNjcm9sbCkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYW5VcGRhdGUgKGUpIHtcbiAgICBpZiAoIW1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgcGFuU3RhcnQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2FmKHJhZkluZGV4KTtcbiAgICBpZiAocGFuU3RhcnQpIHsgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKXsgcGFuVXBkYXRlKGUpOyB9KTsgfVxuXG4gICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9PT0gJz8nKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCgpOyB9XG4gICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xuICAgICAgaWYgKCFwcmV2ZW50U2Nyb2xsICYmIGlzVG91Y2hFdmVudChlKSkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZS50eXBlKSB7IGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaE1vdmUnIDogJ2RyYWdNb3ZlJywgaW5mbyhlKSk7IH1cbiAgICAgIH0gY2F0Y2goZXJyKSB7fVxuXG4gICAgICB2YXIgeCA9IHRyYW5zbGF0ZUluaXQsXG4gICAgICAgICAgZGlzdCA9IGdldERpc3QobGFzdFBvc2l0aW9uLCBpbml0UG9zaXRpb24pO1xuICAgICAgaWYgKCFob3Jpem9udGFsIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XG4gICAgICAgIHggKz0gZGlzdDtcbiAgICAgICAgeCArPSAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2VYID0gVFJBTlNGT1JNID8gZGlzdCAqIGl0ZW1zICogMTAwIC8gKCh2aWV3cG9ydCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3KTogZGlzdCAqIDEwMCAvICh2aWV3cG9ydCArIGd1dHRlcik7XG4gICAgICAgIHggKz0gcGVyY2VudGFnZVg7XG4gICAgICAgIHggKz0gJyUnO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0gPSB0cmFuc2Zvcm1QcmVmaXggKyB4ICsgdHJhbnNmb3JtUG9zdGZpeDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblBhbkVuZCAoZSkge1xuICAgIGlmIChwYW5TdGFydCkge1xuICAgICAgaWYgKHJhZkluZGV4KSB7XG4gICAgICAgIGNhZihyYWZJbmRleCk7XG4gICAgICAgIHJhZkluZGV4ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYXJvdXNlbCkgeyByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJycpOyB9XG4gICAgICBwYW5TdGFydCA9IGZhbHNlO1xuXG4gICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgICAgbGFzdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XG4gICAgICBsYXN0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcbiAgICAgIHZhciBkaXN0ID0gZ2V0RGlzdChsYXN0UG9zaXRpb24sIGluaXRQb3NpdGlvbik7XG5cbiAgICAgIGlmIChNYXRoLmFicyhkaXN0KSkge1xuICAgICAgICAvLyBkcmFnIHZzIGNsaWNrXG4gICAgICAgIGlmICghaXNUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgICAgLy8gcHJldmVudCBcImNsaWNrXCJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xuICAgICAgICAgIGFkZEV2ZW50cyh0YXJnZXQsIHsnY2xpY2snOiBmdW5jdGlvbiBwcmV2ZW50Q2xpY2sgKGUpIHtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0QmVoYXZpb3IoZSk7XG4gICAgICAgICAgICByZW1vdmVFdmVudHModGFyZ2V0LCB7J2NsaWNrJzogcHJldmVudENsaWNrfSk7XG4gICAgICAgICAgfX0pOyBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgIHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xuICAgICAgICAgICAgICB2YXIgaW5kZXhNb3ZlZCA9IC0gZGlzdCAqIGl0ZW1zIC8gKHZpZXdwb3J0ICsgZ3V0dGVyKTtcbiAgICAgICAgICAgICAgaW5kZXhNb3ZlZCA9IGRpc3QgPiAwID8gTWF0aC5mbG9vcihpbmRleE1vdmVkKSA6IE1hdGguY2VpbChpbmRleE1vdmVkKTtcbiAgICAgICAgICAgICAgaW5kZXggKz0gaW5kZXhNb3ZlZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBtb3ZlZCA9IC0gKHRyYW5zbGF0ZUluaXQgKyBkaXN0KTtcbiAgICAgICAgICAgICAgaWYgKG1vdmVkIDw9IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4TWluO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vdmVkID49IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnROZXcgLSAxXSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhNYXg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgc2xpZGVDb3VudE5ldyAmJiBtb3ZlZCA+PSBzbGlkZVBvc2l0aW9uc1tpXSkge1xuICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkID4gc2xpZGVQb3NpdGlvbnNbaV0gJiYgZGlzdCA8IDApIHsgaW5kZXggKz0gMTsgfVxuICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZW5kZXIoZSwgZGlzdCk7XG4gICAgICAgICAgICBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hFbmQnIDogJ2RyYWdFbmQnLCBpbmZvKGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgZGlzdCA+IDAgPyAtMSA6IDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc2V0XG4gICAgaWYgKG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdhdXRvJykgeyBwcmV2ZW50U2Nyb2xsID0gZmFsc2U7IH1cbiAgICBpZiAoc3dpcGVBbmdsZSkgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSAnPyc7IH0gXG4gICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHsgc2V0QXV0b3BsYXlUaW1lcigpOyB9XG4gIH1cblxuICAvLyA9PT0gUkVTSVpFIEZVTkNUSU9OUyA9PT0gLy9cbiAgLy8gKHNsaWRlUG9zaXRpb25zLCBpbmRleCwgaXRlbXMpID0+IHZlcnRpY2FsX2NvbmVudFdyYXBwZXIuaGVpZ2h0XG4gIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0ICgpIHtcbiAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcbiAgICB3cC5zdHlsZS5oZWlnaHQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleCArIGl0ZW1zXSAtIHNsaWRlUG9zaXRpb25zW2luZGV4XSArICdweCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWdlcyAoKSB7XG4gICAgdmFyIHJvdWdoID0gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnQgLyB2aWV3cG9ydCA6IHNsaWRlQ291bnQgLyBpdGVtcztcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5jZWlsKHJvdWdoKSwgc2xpZGVDb3VudCk7XG4gIH1cblxuICAvKlxuICAgKiAxLiB1cGRhdGUgdmlzaWJsZSBuYXYgaXRlbXMgbGlzdFxuICAgKiAyLiBhZGQgXCJoaWRkZW5cIiBhdHRyaWJ1dGVzIHRvIHByZXZpb3VzIHZpc2libGUgbmF2IGl0ZW1zXG4gICAqIDMuIHJlbW92ZSBcImhpZGRlblwiIGF0dHJ1YnV0ZXMgdG8gbmV3IHZpc2libGUgbmF2IGl0ZW1zXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGVOYXZWaXNpYmlsaXR5ICgpIHtcbiAgICBpZiAoIW5hdiB8fCBuYXZBc1RodW1ibmFpbHMpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAocGFnZXMgIT09IHBhZ2VzQ2FjaGVkKSB7XG4gICAgICB2YXIgbWluID0gcGFnZXNDYWNoZWQsXG4gICAgICAgICAgbWF4ID0gcGFnZXMsXG4gICAgICAgICAgZm4gPSBzaG93RWxlbWVudDtcblxuICAgICAgaWYgKHBhZ2VzQ2FjaGVkID4gcGFnZXMpIHtcbiAgICAgICAgbWluID0gcGFnZXM7XG4gICAgICAgIG1heCA9IHBhZ2VzQ2FjaGVkO1xuICAgICAgICBmbiA9IGhpZGVFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAobWluIDwgbWF4KSB7XG4gICAgICAgIGZuKG5hdkl0ZW1zW21pbl0pO1xuICAgICAgICBtaW4rKztcbiAgICAgIH1cblxuICAgICAgLy8gY2FjaGUgcGFnZXNcbiAgICAgIHBhZ2VzQ2FjaGVkID0gcGFnZXM7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5mbyAoZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIHNsaWRlSXRlbXM6IHNsaWRlSXRlbXMsXG4gICAgICBuYXZDb250YWluZXI6IG5hdkNvbnRhaW5lcixcbiAgICAgIG5hdkl0ZW1zOiBuYXZJdGVtcyxcbiAgICAgIGNvbnRyb2xzQ29udGFpbmVyOiBjb250cm9sc0NvbnRhaW5lcixcbiAgICAgIGhhc0NvbnRyb2xzOiBoYXNDb250cm9scyxcbiAgICAgIHByZXZCdXR0b246IHByZXZCdXR0b24sXG4gICAgICBuZXh0QnV0dG9uOiBuZXh0QnV0dG9uLFxuICAgICAgaXRlbXM6IGl0ZW1zLFxuICAgICAgc2xpZGVCeTogc2xpZGVCeSxcbiAgICAgIGNsb25lQ291bnQ6IGNsb25lQ291bnQsXG4gICAgICBzbGlkZUNvdW50OiBzbGlkZUNvdW50LFxuICAgICAgc2xpZGVDb3VudE5ldzogc2xpZGVDb3VudE5ldyxcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIGluZGV4Q2FjaGVkOiBpbmRleENhY2hlZCxcbiAgICAgIGRpc3BsYXlJbmRleDogZ2V0Q3VycmVudFNsaWRlKCksXG4gICAgICBuYXZDdXJyZW50SW5kZXg6IG5hdkN1cnJlbnRJbmRleCxcbiAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZDogbmF2Q3VycmVudEluZGV4Q2FjaGVkLFxuICAgICAgcGFnZXM6IHBhZ2VzLFxuICAgICAgcGFnZXNDYWNoZWQ6IHBhZ2VzQ2FjaGVkLFxuICAgICAgc2hlZXQ6IHNoZWV0LFxuICAgICAgaXNPbjogaXNPbixcbiAgICAgIGV2ZW50OiBlIHx8IHt9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246ICcyLjkuMicsXG4gICAgZ2V0SW5mbzogaW5mbyxcbiAgICBldmVudHM6IGV2ZW50cyxcbiAgICBnb1RvOiBnb1RvLFxuICAgIHBsYXk6IHBsYXksXG4gICAgcGF1c2U6IHBhdXNlLFxuICAgIGlzT246IGlzT24sXG4gICAgdXBkYXRlU2xpZGVySGVpZ2h0OiB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQsXG4gICAgcmVmcmVzaDogaW5pdFNsaWRlclRyYW5zZm9ybSxcbiAgICBkZXN0cm95OiBkZXN0cm95LFxuICAgIHJlYnVpbGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRucyhleHRlbmQob3B0aW9ucywgb3B0aW9uc0VsZW1lbnRzKSk7XG4gICAgfVxuICB9O1xufTtcblxucmV0dXJuIHRucztcbn0pKCk7IiwiLyohXG4gKiBCb290c3RyYXAgdjMuNC4xIChodHRwczovL2dldGJvb3RzdHJhcC5jb20vKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5Jylcbn1cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHZlcnNpb24gPSAkLmZuLmpxdWVyeS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJylcbiAgaWYgKCh2ZXJzaW9uWzBdIDwgMiAmJiB2ZXJzaW9uWzFdIDwgOSkgfHwgKHZlcnNpb25bMF0gPT0gMSAmJiB2ZXJzaW9uWzFdID09IDkgJiYgdmVyc2lvblsyXSA8IDEpIHx8ICh2ZXJzaW9uWzBdID4gMykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkgdmVyc2lvbiAxLjkuMSBvciBoaWdoZXIsIGJ1dCBsb3dlciB0aGFuIHZlcnNpb24gNCcpXG4gIH1cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRyYW5zaXRpb24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdHJhbnNpdGlvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDU1MgVFJBTlNJVElPTiBTVVBQT1JUIChTaG91dG91dDogaHR0cHM6Ly9tb2Rlcm5penIuY29tLylcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib290c3RyYXAnKVxuXG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICBNb3pUcmFuc2l0aW9uICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgT1RyYW5zaXRpb24gICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfVxuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7IGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2UgLy8gZXhwbGljaXQgZm9yIGllOCAoICAuXy4pXG4gIH1cblxuICAvLyBodHRwczovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXG4gICQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgICB2YXIgJGVsID0gdGhpc1xuICAgICQodGhpcykub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWUgfSlcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IGlmICghY2FsbGVkKSAkKCRlbCkudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpIH1cbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkdXJhdGlvbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgJChmdW5jdGlvbiAoKSB7XG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kKClcblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVyblxuXG4gICAgJC5ldmVudC5zcGVjaWFsLmJzVHJhbnNpdGlvbkVuZCA9IHtcbiAgICAgIGJpbmRUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBkZWxlZ2F0ZVR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoaXMpKSByZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhbGVydC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhbGVydHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBTEVSVCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgZGlzbWlzcyA9ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXG4gIHZhciBBbGVydCAgID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgJChlbCkub24oJ2NsaWNrJywgZGlzbWlzcywgdGhpcy5jbG9zZSlcbiAgfVxuXG4gIEFsZXJ0LlZFUlNJT04gPSAnMy40LjEnXG5cbiAgQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgID0gJCh0aGlzKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgc2VsZWN0b3IgICAgPSBzZWxlY3RvciA9PT0gJyMnID8gW10gOiBzZWxlY3RvclxuICAgIHZhciAkcGFyZW50ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxuICAgIH1cblxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XG4gICAgICAvLyBkZXRhY2ggZnJvbSBwYXJlbnQsIGZpcmUgZXZlbnQgdGhlbiBjbGVhbiB1cCBkYXRhXG4gICAgICAkcGFyZW50LmRldGFjaCgpLnRyaWdnZXIoJ2Nsb3NlZC5icy5hbGVydCcpLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHBhcmVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgcmVtb3ZlRWxlbWVudClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxuICB9XG5cblxuICAvLyBBTEVSVCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWxlcnRcblxuICAkLmZuLmFsZXJ0ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWxlcnQuQ29uc3RydWN0b3IgPSBBbGVydFxuXG5cbiAgLy8gQUxFUlQgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFMRVJUIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpJywgZGlzbWlzcywgQWxlcnQucHJvdG90eXBlLmNsb3NlKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBidXR0b24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYnV0dG9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEJVVFRPTiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9ICQuZXh0ZW5kKHt9LCBCdXR0b24uREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICB9XG5cbiAgQnV0dG9uLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEJ1dHRvbi5ERUZBVUxUUyA9IHtcbiAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGQgICAgPSAnZGlzYWJsZWQnXG4gICAgdmFyICRlbCAgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIHZhbCAgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xuICAgIHZhciBkYXRhID0gJGVsLmRhdGEoKVxuXG4gICAgc3RhdGUgKz0gJ1RleHQnXG5cbiAgICBpZiAoZGF0YS5yZXNldFRleHQgPT0gbnVsbCkgJGVsLmRhdGEoJ3Jlc2V0VGV4dCcsICRlbFt2YWxdKCkpXG5cbiAgICAvLyBwdXNoIHRvIGV2ZW50IGxvb3AgdG8gYWxsb3cgZm9ybXMgdG8gc3VibWl0XG4gICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbFt2YWxdKGRhdGFbc3RhdGVdID09IG51bGwgPyB0aGlzLm9wdGlvbnNbc3RhdGVdIDogZGF0YVtzdGF0ZV0pXG5cbiAgICAgIGlmIChzdGF0ZSA9PSAnbG9hZGluZ1RleHQnKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgICAkZWwuYWRkQ2xhc3MoZCkuYXR0cihkLCBkKS5wcm9wKGQsIHRydWUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgICAgJGVsLnJlbW92ZUNsYXNzKGQpLnJlbW92ZUF0dHIoZCkucHJvcChkLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9LCB0aGlzKSwgMClcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGFuZ2VkID0gdHJ1ZVxuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJylcblxuICAgIGlmICgkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgdmFyICRpbnB1dCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW5wdXQnKVxuICAgICAgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ3JhZGlvJykge1xuICAgICAgICBpZiAoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICRwYXJlbnQuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdjaGVja2JveCcpIHtcbiAgICAgICAgaWYgKCgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSAhPT0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgfVxuICAgICAgJGlucHV0LnByb3AoJ2NoZWNrZWQnLCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIGlmIChjaGFuZ2VkKSAkaW5wdXQudHJpZ2dlcignY2hhbmdlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLXByZXNzZWQnLCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQlVUVE9OIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5idXR0b24nKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicsIChkYXRhID0gbmV3IEJ1dHRvbih0aGlzLCBvcHRpb25zKSkpXG5cbiAgICAgIGlmIChvcHRpb24gPT0gJ3RvZ2dsZScpIGRhdGEudG9nZ2xlKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbikgZGF0YS5zZXRTdGF0ZShvcHRpb24pXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmJ1dHRvblxuXG4gICQuZm4uYnV0dG9uICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYnV0dG9uLkNvbnN0cnVjdG9yID0gQnV0dG9uXG5cblxuICAvLyBCVVRUT04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5idXR0b24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmJ1dHRvbiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEJVVFRPTiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICRidG4gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJylcbiAgICAgIFBsdWdpbi5jYWxsKCRidG4sICd0b2dnbGUnKVxuICAgICAgaWYgKCEoJChlLnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXSwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZG91YmxlIGNsaWNrIG9uIHJhZGlvcywgYW5kIHRoZSBkb3VibGUgc2VsZWN0aW9ucyAoc28gY2FuY2VsbGF0aW9uKSBvbiBjaGVja2JveGVzXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAvLyBUaGUgdGFyZ2V0IGNvbXBvbmVudCBzdGlsbCByZWNlaXZlIHRoZSBmb2N1c1xuICAgICAgICBpZiAoJGJ0bi5pcygnaW5wdXQsYnV0dG9uJykpICRidG4udHJpZ2dlcignZm9jdXMnKVxuICAgICAgICBlbHNlICRidG4uZmluZCgnaW5wdXQ6dmlzaWJsZSxidXR0b246dmlzaWJsZScpLmZpcnN0KCkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJykudG9nZ2xlQ2xhc3MoJ2ZvY3VzJywgL15mb2N1cyhpbik/JC8udGVzdChlLnR5cGUpKVxuICAgIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNhcm91c2VsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Nhcm91c2VsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ0FST1VTRUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGluZGljYXRvcnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5jYXJvdXNlbC1pbmRpY2F0b3JzJylcbiAgICB0aGlzLm9wdGlvbnMgICAgID0gb3B0aW9uc1xuICAgIHRoaXMucGF1c2VkICAgICAgPSBudWxsXG4gICAgdGhpcy5zbGlkaW5nICAgICA9IG51bGxcbiAgICB0aGlzLmludGVydmFsICAgID0gbnVsbFxuICAgIHRoaXMuJGFjdGl2ZSAgICAgPSBudWxsXG4gICAgdGhpcy4kaXRlbXMgICAgICA9IG51bGxcblxuICAgIHRoaXMub3B0aW9ucy5rZXlib2FyZCAmJiB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKVxuXG4gICAgdGhpcy5vcHRpb25zLnBhdXNlID09ICdob3ZlcicgJiYgISgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpICYmIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbignbW91c2VlbnRlci5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5wYXVzZSwgdGhpcykpXG4gICAgICAub24oJ21vdXNlbGVhdmUuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMuY3ljbGUsIHRoaXMpKVxuICB9XG5cbiAgQ2Fyb3VzZWwuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDYwMFxuXG4gIENhcm91c2VsLkRFRkFVTFRTID0ge1xuICAgIGludGVydmFsOiA1MDAwLFxuICAgIHBhdXNlOiAnaG92ZXInLFxuICAgIHdyYXA6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWVcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICBjYXNlIDM3OiB0aGlzLnByZXYoKTsgYnJlYWtcbiAgICAgIGNhc2UgMzk6IHRoaXMubmV4dCgpOyBicmVha1xuICAgICAgZGVmYXVsdDogcmV0dXJuXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuY3ljbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gZmFsc2UpXG5cbiAgICB0aGlzLmludGVydmFsICYmIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHRoaXMub3B0aW9ucy5pbnRlcnZhbFxuICAgICAgJiYgIXRoaXMucGF1c2VkXG4gICAgICAmJiAodGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCQucHJveHkodGhpcy5uZXh0LCB0aGlzKSwgdGhpcy5vcHRpb25zLmludGVydmFsKSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB0aGlzLiRpdGVtcyA9IGl0ZW0ucGFyZW50KCkuY2hpbGRyZW4oJy5pdGVtJylcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuaW5kZXgoaXRlbSB8fCB0aGlzLiRhY3RpdmUpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUZvckRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFjdGl2ZSkge1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGFjdGl2ZSlcbiAgICB2YXIgd2lsbFdyYXAgPSAoZGlyZWN0aW9uID09ICdwcmV2JyAmJiBhY3RpdmVJbmRleCA9PT0gMClcbiAgICAgICAgICAgICAgICB8fCAoZGlyZWN0aW9uID09ICduZXh0JyAmJiBhY3RpdmVJbmRleCA9PSAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkpXG4gICAgaWYgKHdpbGxXcmFwICYmICF0aGlzLm9wdGlvbnMud3JhcCkgcmV0dXJuIGFjdGl2ZVxuICAgIHZhciBkZWx0YSA9IGRpcmVjdGlvbiA9PSAncHJldicgPyAtMSA6IDFcbiAgICB2YXIgaXRlbUluZGV4ID0gKGFjdGl2ZUluZGV4ICsgZGVsdGEpICUgdGhpcy4kaXRlbXMubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmVxKGl0ZW1JbmRleClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgPSB0aGlzXG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgodGhpcy4kYWN0aXZlID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKSlcblxuICAgIGlmIChwb3MgPiAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkgfHwgcG9zIDwgMCkgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zbGlkaW5nKSAgICAgICByZXR1cm4gdGhpcy4kZWxlbWVudC5vbmUoJ3NsaWQuYnMuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoKSB7IHRoYXQudG8ocG9zKSB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKGFjdGl2ZUluZGV4ID09IHBvcykgcmV0dXJuIHRoaXMucGF1c2UoKS5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpcy5zbGlkZShwb3MgPiBhY3RpdmVJbmRleCA/ICduZXh0JyA6ICdwcmV2JywgdGhpcy4kaXRlbXMuZXEocG9zKSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSB0cnVlKVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCgnLm5leHQsIC5wcmV2JykubGVuZ3RoICYmICQuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKVxuICAgICAgdGhpcy5jeWNsZSh0cnVlKVxuICAgIH1cblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ25leHQnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ3ByZXYnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnNsaWRlID0gZnVuY3Rpb24gKHR5cGUsIG5leHQpIHtcbiAgICB2YXIgJGFjdGl2ZSAgID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKVxuICAgIHZhciAkbmV4dCAgICAgPSBuZXh0IHx8IHRoaXMuZ2V0SXRlbUZvckRpcmVjdGlvbih0eXBlLCAkYWN0aXZlKVxuICAgIHZhciBpc0N5Y2xpbmcgPSB0aGlzLmludGVydmFsXG4gICAgdmFyIGRpcmVjdGlvbiA9IHR5cGUgPT0gJ25leHQnID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIHZhciB0aGF0ICAgICAgPSB0aGlzXG5cbiAgICBpZiAoJG5leHQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm4gKHRoaXMuc2xpZGluZyA9IGZhbHNlKVxuXG4gICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSAkbmV4dFswXVxuICAgIHZhciBzbGlkZUV2ZW50ID0gJC5FdmVudCgnc2xpZGUuYnMuY2Fyb3VzZWwnLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25cbiAgICB9KVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkZUV2ZW50KVxuICAgIGlmIChzbGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuc2xpZGluZyA9IHRydWVcblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLnBhdXNlKClcblxuICAgIGlmICh0aGlzLiRpbmRpY2F0b3JzLmxlbmd0aCkge1xuICAgICAgdGhpcy4kaW5kaWNhdG9ycy5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB2YXIgJG5leHRJbmRpY2F0b3IgPSAkKHRoaXMuJGluZGljYXRvcnMuY2hpbGRyZW4oKVt0aGlzLmdldEl0ZW1JbmRleCgkbmV4dCldKVxuICAgICAgJG5leHRJbmRpY2F0b3IgJiYgJG5leHRJbmRpY2F0b3IuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgdmFyIHNsaWRFdmVudCA9ICQuRXZlbnQoJ3NsaWQuYnMuY2Fyb3VzZWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGRpcmVjdGlvbjogZGlyZWN0aW9uIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnc2xpZGUnKSkge1xuICAgICAgJG5leHQuYWRkQ2xhc3ModHlwZSlcbiAgICAgIGlmICh0eXBlb2YgJG5leHQgPT09ICdvYmplY3QnICYmICRuZXh0Lmxlbmd0aCkge1xuICAgICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cbiAgICAgICRhY3RpdmUuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKFsnYWN0aXZlJywgZGlyZWN0aW9uXS5qb2luKCcgJykpXG4gICAgICAgICAgdGhhdC5zbGlkaW5nID0gZmFsc2VcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgfSBlbHNlIHtcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkbmV4dC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgIH1cblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENhcm91c2VsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuICAgICAgdmFyIGFjdGlvbiAgPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJywgKGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ251bWJlcicpIGRhdGEudG8ob3B0aW9uKVxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5pbnRlcnZhbCkgZGF0YS5wYXVzZSgpLmN5Y2xlKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3IgPSBDYXJvdXNlbFxuXG5cbiAgLy8gQ0FST1VTRUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgICAgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICBpZiAoaHJlZikge1xuICAgICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0ICA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHwgaHJlZlxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG5cbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxuXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcbiAgICB2YXIgc2xpZGVJbmRleCA9ICR0aGlzLmF0dHIoJ2RhdGEtc2xpZGUtdG8nKVxuICAgIGlmIChzbGlkZUluZGV4KSBvcHRpb25zLmludGVydmFsID0gZmFsc2VcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbnMpXG5cbiAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgJHRhcmdldC5kYXRhKCdicy5jYXJvdXNlbCcpLnRvKHNsaWRlSW5kZXgpXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGVdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGUtdG9dJywgY2xpY2tIYW5kbGVyKVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkY2Fyb3VzZWwgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkY2Fyb3VzZWwsICRjYXJvdXNlbC5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY29sbGFwc2UuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY29sbGFwc2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIGpzaGludCBsYXRlZGVmOiBmYWxzZSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENPTExBUFNFIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENvbGxhcHNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuJHRyaWdnZXIgICAgICA9ICQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXScpXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gbnVsbFxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCwgdGhpcy4kdHJpZ2dlcilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkgdGhpcy50b2dnbGUoKVxuICB9XG5cbiAgQ29sbGFwc2UuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTiA9IDM1MFxuXG4gIENvbGxhcHNlLkRFRkFVTFRTID0ge1xuICAgIHRvZ2dsZTogdHJ1ZVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmRpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXG4gICAgcmV0dXJuIGhhc1dpZHRoID8gJ3dpZHRoJyA6ICdoZWlnaHQnXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIGFjdGl2ZXNEYXRhXG4gICAgdmFyIGFjdGl2ZXMgPSB0aGlzLiRwYXJlbnQgJiYgdGhpcy4kcGFyZW50LmNoaWxkcmVuKCcucGFuZWwnKS5jaGlsZHJlbignLmluLCAuY29sbGFwc2luZycpXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgYWN0aXZlc0RhdGEgPSBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBQbHVnaW4uY2FsbChhY3RpdmVzLCAnaGlkZScpXG4gICAgICBhY3RpdmVzRGF0YSB8fCBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJywgbnVsbClcbiAgICB9XG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVtkaW1lbnNpb25dKDApXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKVtkaW1lbnNpb25dKCcnKVxuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAudHJpZ2dlcignc2hvd24uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB2YXIgc2Nyb2xsU2l6ZSA9ICQuY2FtZWxDYXNlKFsnc2Nyb2xsJywgZGltZW5zaW9uXS5qb2luKCctJykpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbMF1bc2Nyb2xsU2l6ZV0pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8ICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0oKSlbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICBbZGltZW5zaW9uXSgwKVxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpID8gJ2hpZGUnIDogJ3Nob3cnXSgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5wYXJlbnQpXG4gICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInICsgdGhpcy5vcHRpb25zLnBhcmVudCArICdcIl0nKVxuICAgICAgLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGdldFRhcmdldEZyb21UcmlnZ2VyKCRlbGVtZW50KSwgJGVsZW1lbnQpXG4gICAgICB9LCB0aGlzKSlcbiAgICAgIC5lbmQoKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJHRyaWdnZXIpIHtcbiAgICB2YXIgaXNPcGVuID0gJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJylcblxuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gICAgJHRyaWdnZXJcbiAgICAgIC50b2dnbGVDbGFzcygnY29sbGFwc2VkJywgIWlzT3BlbilcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRyaWdnZXIpIHtcbiAgICB2YXIgaHJlZlxuICAgIHZhciB0YXJnZXQgPSAkdHJpZ2dlci5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgICB8fCAoaHJlZiA9ICR0cmlnZ2VyLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICB9XG5cblxuICAvLyBDT0xMQVBTRSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhICYmIG9wdGlvbnMudG9nZ2xlICYmIC9zaG93fGhpZGUvLnRlc3Qob3B0aW9uKSkgb3B0aW9ucy50b2dnbGUgPSBmYWxzZVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScsIChkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jb2xsYXBzZVxuXG4gICQuZm4uY29sbGFwc2UgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jb2xsYXBzZS5Db25zdHJ1Y3RvciA9IENvbGxhcHNlXG5cblxuICAvLyBDT0xMQVBTRSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY29sbGFwc2Uubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuXG4gICAgaWYgKCEkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIHZhciAkdGFyZ2V0ID0gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRoaXMpXG4gICAgdmFyIGRhdGEgICAgPSAkdGFyZ2V0LmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICB2YXIgb3B0aW9uICA9IGRhdGEgPyAndG9nZ2xlJyA6ICR0aGlzLmRhdGEoKVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBkcm9wZG93bi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNkcm9wZG93bnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEUk9QRE9XTiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgYmFja2Ryb3AgPSAnLmRyb3Bkb3duLWJhY2tkcm9wJ1xuICB2YXIgdG9nZ2xlICAgPSAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5vbignY2xpY2suYnMuZHJvcGRvd24nLCB0aGlzLnRvZ2dsZSlcbiAgfVxuXG4gIERyb3Bkb3duLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgLyNbQS1aYS16XS8udGVzdChzZWxlY3RvcikgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9IHNlbGVjdG9yICE9PSAnIycgPyAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKSA6IG51bGxcblxuICAgIHJldHVybiAkcGFyZW50ICYmICRwYXJlbnQubGVuZ3RoID8gJHBhcmVudCA6ICR0aGlzLnBhcmVudCgpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhck1lbnVzKGUpIHtcbiAgICBpZiAoZSAmJiBlLndoaWNoID09PSAzKSByZXR1cm5cbiAgICAkKGJhY2tkcm9wKS5yZW1vdmUoKVxuICAgICQodG9nZ2xlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgICAgICAgID0gJCh0aGlzKVxuICAgICAgdmFyICRwYXJlbnQgICAgICAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG5cbiAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnb3BlbicpKSByZXR1cm5cblxuICAgICAgaWYgKGUgJiYgZS50eXBlID09ICdjbGljaycgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSAmJiAkLmNvbnRhaW5zKCRwYXJlbnRbMF0sIGUudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnaGlkZS5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJC5FdmVudCgnaGlkZGVuLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfSlcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBjbGVhck1lbnVzKClcblxuICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgISRwYXJlbnQuY2xvc2VzdCgnLm5hdmJhci1uYXYnKS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgbW9iaWxlIHdlIHVzZSBhIGJhY2tkcm9wIGJlY2F1c2UgY2xpY2sgZXZlbnRzIGRvbid0IGRlbGVnYXRlXG4gICAgICAgICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1iYWNrZHJvcCcpXG4gICAgICAgICAgLmluc2VydEFmdGVyKCQodGhpcykpXG4gICAgICAgICAgLm9uKCdjbGljaycsIGNsZWFyTWVudXMpXG4gICAgICB9XG5cbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnc2hvdy5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzXG4gICAgICAgIC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxuXG4gICAgICAkcGFyZW50XG4gICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpXG4gICAgICAgIC50cmlnZ2VyKCQuRXZlbnQoJ3Nob3duLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCEvKDM4fDQwfDI3fDMyKS8udGVzdChlLndoaWNoKSB8fCAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cblxuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBpZiAoIWlzQWN0aXZlICYmIGUud2hpY2ggIT0gMjcgfHwgaXNBY3RpdmUgJiYgZS53aGljaCA9PSAyNykge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMjcpICRwYXJlbnQuZmluZCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VyKCdjbGljaycpXG4gICAgfVxuXG4gICAgdmFyIGRlc2MgPSAnIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYSdcbiAgICB2YXIgJGl0ZW1zID0gJHBhcmVudC5maW5kKCcuZHJvcGRvd24tbWVudScgKyBkZXNjKVxuXG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSByZXR1cm5cblxuICAgIHZhciBpbmRleCA9ICRpdGVtcy5pbmRleChlLnRhcmdldClcblxuICAgIGlmIChlLndoaWNoID09IDM4ICYmIGluZGV4ID4gMCkgICAgICAgICAgICAgICAgIGluZGV4LS0gICAgICAgICAvLyB1cFxuICAgIGlmIChlLndoaWNoID09IDQwICYmIGluZGV4IDwgJGl0ZW1zLmxlbmd0aCAtIDEpIGluZGV4KysgICAgICAgICAvLyBkb3duXG4gICAgaWYgKCF+aW5kZXgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwXG5cbiAgICAkaXRlbXMuZXEoaW5kZXgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgfVxuXG5cbiAgLy8gRFJPUERPV04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nLCAoZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmRyb3Bkb3duXG5cbiAgJC5mbi5kcm9wZG93biAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cblxuXG4gIC8vIERST1BET1dOIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5kcm9wZG93bi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uZHJvcGRvd24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBUFBMWSBUTyBTVEFOREFSRCBEUk9QRE9XTiBFTEVNRU5UU1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGNsZWFyTWVudXMpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24gZm9ybScsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCkgfSlcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93bi1tZW51JywgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IG1vZGFsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI21vZGFsc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIE1PREFMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRkaWFsb2cgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5tb2RhbC1kaWFsb2cnKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICAgIHRoaXMuaXNTaG93biA9IG51bGxcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IG51bGxcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gMFxuICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgdGhpcy5maXhlZENvbnRlbnQgPSAnLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tJ1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdGUpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLmZpbmQoJy5tb2RhbC1jb250ZW50JylcbiAgICAgICAgLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQuYnMubW9kYWwnKVxuICAgICAgICB9LCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzMDBcbiAgTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIE1vZGFsLkRFRkFVTFRTID0ge1xuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKHRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IHRydWVcblxuICAgIHRoaXMuY2hlY2tTY3JvbGxiYXIoKVxuICAgIHRoaXMuc2V0U2Nyb2xsYmFyKClcbiAgICB0aGlzLiRib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJylcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsICQucHJveHkodGhpcy5oaWRlLCB0aGlzKSlcblxuICAgIHRoaXMuJGRpYWxvZy5vbignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9uZSgnbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoYXQuJGVsZW1lbnQpKSB0aGF0Lmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhhdC4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpXG5cbiAgICAgIGlmICghdGhhdC4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGgpIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudC5hcHBlbmRUbyh0aGF0LiRib2R5KSAvLyBkb24ndCBtb3ZlIG1vZGFscyBkb20gcG9zaXRpb25cbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC5zY3JvbGxUb3AoMClcblxuICAgICAgdGhhdC5hZGp1c3REaWFsb2coKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICB0aGF0LiRlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50LmFkZENsYXNzKCdpbicpXG5cbiAgICAgIHRoYXQuZW5mb3JjZUZvY3VzKClcblxuICAgICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93bi5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgICAgdHJhbnNpdGlvbiA/XG4gICAgICAgIHRoYXQuJGRpYWxvZyAvLyB3YWl0IGZvciBtb2RhbCB0byBzbGlkZSBpblxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgZSA9ICQuRXZlbnQoJ2hpZGUuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoIXRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgJChkb2N1bWVudCkub2ZmKCdmb2N1c2luLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgLm9mZignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgICAub2ZmKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9mZignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eSh0aGlzLmhpZGVNb2RhbCwgdGhpcykpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICB0aGlzLmhpZGVNb2RhbCgpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZW5mb3JjZUZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICQoZG9jdW1lbnQpXG4gICAgICAub2ZmKCdmb2N1c2luLmJzLm1vZGFsJykgLy8gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBmb2N1cyBsb29wXG4gICAgICAub24oJ2ZvY3VzaW4uYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChkb2N1bWVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICB0aGlzLiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgICF0aGlzLiRlbGVtZW50LmhhcyhlLnRhcmdldCkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5rZXlib2FyZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLndoaWNoID09IDI3ICYmIHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93bikge1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYnMubW9kYWwnLCAkLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLCB0aGlzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHRoaXMuJGVsZW1lbnQuaGlkZSgpXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRib2R5LnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJylcbiAgICAgIHRoYXQucmVzZXRBZGp1c3RtZW50cygpXG4gICAgICB0aGF0LnJlc2V0U2Nyb2xsYmFyKClcbiAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuLmJzLm1vZGFsJylcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJhY2tkcm9wICYmIHRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYmFja2Ryb3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgYW5pbWF0ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/ICdmYWRlJyA6ICcnXG5cbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5iYWNrZHJvcCkge1xuICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcblxuICAgICAgdGhpcy4kYmFja2Ryb3AgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAuYWRkQ2xhc3MoJ21vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlKVxuICAgICAgICAuYXBwZW5kVG8odGhpcy4kYm9keSlcblxuICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaykge1xuICAgICAgICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVyblxuICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYydcbiAgICAgICAgICA/IHRoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKVxuICAgICAgICAgIDogdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuXG4gICAgICBpZiAoZG9BbmltYXRlKSB0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcblxuICAgICAgdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuXG5cbiAgICAgIGRvQW5pbWF0ZSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2spXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duICYmIHRoaXMuJGJhY2tkcm9wKSB7XG4gICAgICB0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgICB2YXIgY2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrUmVtb3ZlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrUmVtb3ZlKClcblxuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICAvLyB0aGVzZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgdXNlZCB0byBoYW5kbGUgb3ZlcmZsb3dpbmcgbW9kYWxzXG5cbiAgTW9kYWwucHJvdG90eXBlLmhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkanVzdERpYWxvZygpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYWRqdXN0RGlhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RhbElzT3ZlcmZsb3dpbmcgPSB0aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAhdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiBtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6IHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgIW1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRBZGp1c3RtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnVsbFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkgeyAvLyB3b3JrYXJvdW5kIGZvciBtaXNzaW5nIHdpbmRvdy5pbm5lcldpZHRoIGluIElFOFxuICAgICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpXG4gICAgfVxuICAgIHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpbmRvd1dpZHRoXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMubWVhc3VyZVNjcm9sbGJhcigpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib2R5UGFkID0gcGFyc2VJbnQoKHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCksIDEwKVxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgJydcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoXG4gICAgaWYgKHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgYm9keVBhZCArIHNjcm9sbGJhcldpZHRoKVxuICAgICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFjdHVhbFBhZGRpbmcgPSBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodFxuICAgICAgICB2YXIgY2FsY3VsYXRlZFBhZGRpbmcgPSAkKGVsZW1lbnQpLmNzcygncGFkZGluZy1yaWdodCcpXG4gICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAuZGF0YSgncGFkZGluZy1yaWdodCcsIGFjdHVhbFBhZGRpbmcpXG4gICAgICAgICAgLmNzcygncGFkZGluZy1yaWdodCcsIHBhcnNlRmxvYXQoY2FsY3VsYXRlZFBhZGRpbmcpICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCB0aGlzLm9yaWdpbmFsQm9keVBhZClcbiAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgdmFyIHBhZGRpbmcgPSAkKGVsZW1lbnQpLmRhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgJChlbGVtZW50KS5yZW1vdmVEYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA/IHBhZGRpbmcgOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHsgLy8gdGh4IHdhbHNoXG4gICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZSdcbiAgICB0aGlzLiRib2R5LmFwcGVuZChzY3JvbGxEaXYpXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoXG4gICAgdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpXG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoXG4gIH1cblxuXG4gIC8vIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbiwgX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnYnMubW9kYWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTW9kYWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMubW9kYWwnLCAoZGF0YSA9IG5ldyBNb2RhbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKF9yZWxhdGVkVGFyZ2V0KVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5zaG93KSBkYXRhLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLm1vZGFsXG5cbiAgJC5mbi5tb2RhbCA9IFBsdWdpblxuICAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yID0gTW9kYWxcblxuXG4gIC8vIE1PREFMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ubW9kYWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBNT0RBTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5tb2RhbC5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgIHZhciBocmVmID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgdmFyIHRhcmdldCA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHxcbiAgICAgIChocmVmICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICAgIHZhciBvcHRpb24gPSAkdGFyZ2V0LmRhdGEoJ2JzLm1vZGFsJykgPyAndG9nZ2xlJyA6ICQuZXh0ZW5kKHsgcmVtb3RlOiAhLyMvLnRlc3QoaHJlZikgJiYgaHJlZiB9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuXG4gICAgaWYgKCR0aGlzLmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgJHRhcmdldC5vbmUoJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoc2hvd0V2ZW50KSB7XG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm4gLy8gb25seSByZWdpc3RlciBmb2N1cyByZXN0b3JlciBpZiBtb2RhbCB3aWxsIGFjdHVhbGx5IGdldCBzaG93blxuICAgICAgJHRhcmdldC5vbmUoJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRoaXMuaXMoJzp2aXNpYmxlJykgJiYgJHRoaXMudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfSlcbiAgICB9KVxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbiwgdGhpcylcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdG9vbHRpcC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0b29sdGlwXG4gKiBJbnNwaXJlZCBieSB0aGUgb3JpZ2luYWwgalF1ZXJ5LnRpcHN5IGJ5IEphc29uIEZyYW1lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBESVNBTExPV0VEX0FUVFJJQlVURVMgPSBbJ3Nhbml0aXplJywgJ3doaXRlTGlzdCcsICdzYW5pdGl6ZUZuJ11cblxuICB2YXIgdXJpQXR0cnMgPSBbXG4gICAgJ2JhY2tncm91bmQnLFxuICAgICdjaXRlJyxcbiAgICAnaHJlZicsXG4gICAgJ2l0ZW10eXBlJyxcbiAgICAnbG9uZ2Rlc2MnLFxuICAgICdwb3N0ZXInLFxuICAgICdzcmMnLFxuICAgICd4bGluazpocmVmJ1xuICBdXG5cbiAgdmFyIEFSSUFfQVRUUklCVVRFX1BBVFRFUk4gPSAvXmFyaWEtW1xcdy1dKiQvaVxuXG4gIHZhciBEZWZhdWx0V2hpdGVsaXN0ID0ge1xuICAgIC8vIEdsb2JhbCBhdHRyaWJ1dGVzIGFsbG93ZWQgb24gYW55IHN1cHBsaWVkIGVsZW1lbnQgYmVsb3cuXG4gICAgJyonOiBbJ2NsYXNzJywgJ2RpcicsICdpZCcsICdsYW5nJywgJ3JvbGUnLCBBUklBX0FUVFJJQlVURV9QQVRURVJOXSxcbiAgICBhOiBbJ3RhcmdldCcsICdocmVmJywgJ3RpdGxlJywgJ3JlbCddLFxuICAgIGFyZWE6IFtdLFxuICAgIGI6IFtdLFxuICAgIGJyOiBbXSxcbiAgICBjb2w6IFtdLFxuICAgIGNvZGU6IFtdLFxuICAgIGRpdjogW10sXG4gICAgZW06IFtdLFxuICAgIGhyOiBbXSxcbiAgICBoMTogW10sXG4gICAgaDI6IFtdLFxuICAgIGgzOiBbXSxcbiAgICBoNDogW10sXG4gICAgaDU6IFtdLFxuICAgIGg2OiBbXSxcbiAgICBpOiBbXSxcbiAgICBpbWc6IFsnc3JjJywgJ2FsdCcsICd0aXRsZScsICd3aWR0aCcsICdoZWlnaHQnXSxcbiAgICBsaTogW10sXG4gICAgb2w6IFtdLFxuICAgIHA6IFtdLFxuICAgIHByZTogW10sXG4gICAgczogW10sXG4gICAgc21hbGw6IFtdLFxuICAgIHNwYW46IFtdLFxuICAgIHN1YjogW10sXG4gICAgc3VwOiBbXSxcbiAgICBzdHJvbmc6IFtdLFxuICAgIHU6IFtdLFxuICAgIHVsOiBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IHJlY29nbml6ZXMgYSBjb21tb25seSB1c2VmdWwgc3Vic2V0IG9mIFVSTHMgdGhhdCBhcmUgc2FmZS5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlKTp8W14mOi8/I10qKD86Wy8/I118JCkpL2dpXG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IG1hdGNoZXMgc2FmZSBkYXRhIFVSTHMuIE9ubHkgbWF0Y2hlcyBpbWFnZSwgdmlkZW8gYW5kIGF1ZGlvIHR5cGVzLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgREFUQV9VUkxfUEFUVEVSTiA9IC9eZGF0YTooPzppbWFnZVxcLyg/OmJtcHxnaWZ8anBlZ3xqcGd8cG5nfHRpZmZ8d2VicCl8dmlkZW9cXC8oPzptcGVnfG1wNHxvZ2d8d2VibSl8YXVkaW9cXC8oPzptcDN8b2dhfG9nZ3xvcHVzKSk7YmFzZTY0LFthLXowLTkrL10rPSokL2lcblxuICBmdW5jdGlvbiBhbGxvd2VkQXR0cmlidXRlKGF0dHIsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSB7XG4gICAgdmFyIGF0dHJOYW1lID0gYXR0ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkgIT09IC0xKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCB1cmlBdHRycykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKGF0dHIubm9kZVZhbHVlLm1hdGNoKFNBRkVfVVJMX1BBVFRFUk4pIHx8IGF0dHIubm9kZVZhbHVlLm1hdGNoKERBVEFfVVJMX1BBVFRFUk4pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHZhciByZWdFeHAgPSAkKGFsbG93ZWRBdHRyaWJ1dGVMaXN0KS5maWx0ZXIoZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgfSlcblxuICAgIC8vIENoZWNrIGlmIGEgcmVndWxhciBleHByZXNzaW9uIHZhbGlkYXRlcyB0aGUgYXR0cmlidXRlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVnRXhwLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGF0dHJOYW1lLm1hdGNoKHJlZ0V4cFtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB3aGl0ZUxpc3QsIHNhbml0aXplRm4pIHtcbiAgICBpZiAodW5zYWZlSHRtbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgaWYgKHNhbml0aXplRm4gJiYgdHlwZW9mIHNhbml0aXplRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBzYW5pdGl6ZUZuKHVuc2FmZUh0bWwpXG4gICAgfVxuXG4gICAgLy8gSUUgOCBhbmQgYmVsb3cgZG9uJ3Qgc3VwcG9ydCBjcmVhdGVIVE1MRG9jdW1lbnRcbiAgICBpZiAoIWRvY3VtZW50LmltcGxlbWVudGF0aW9uIHx8ICFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgdmFyIGNyZWF0ZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnc2FuaXRpemF0aW9uJylcbiAgICBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB1bnNhZmVIdG1sXG5cbiAgICB2YXIgd2hpdGVsaXN0S2V5cyA9ICQubWFwKHdoaXRlTGlzdCwgZnVuY3Rpb24gKGVsLCBpKSB7IHJldHVybiBpIH0pXG4gICAgdmFyIGVsZW1lbnRzID0gJChjcmVhdGVkRG9jdW1lbnQuYm9keSkuZmluZCgnKicpXG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2ldXG4gICAgICB2YXIgZWxOYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICBpZiAoJC5pbkFycmF5KGVsTmFtZSwgd2hpdGVsaXN0S2V5cykgPT09IC0xKSB7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHJpYnV0ZUxpc3QgPSAkLm1hcChlbC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIGVsIH0pXG4gICAgICB2YXIgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KHdoaXRlTGlzdFsnKiddIHx8IFtdLCB3aGl0ZUxpc3RbZWxOYW1lXSB8fCBbXSlcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbjIgPSBhdHRyaWJ1dGVMaXN0Lmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xuICAgICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXSwgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLm5vZGVOYW1lKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTFxuICB9XG5cbiAgLy8gVE9PTFRJUCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMudHlwZSAgICAgICA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgICAgPSBudWxsXG4gICAgdGhpcy5lbmFibGVkICAgID0gbnVsbFxuICAgIHRoaXMudGltZW91dCAgICA9IG51bGxcbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG4gICAgdGhpcy4kZWxlbWVudCAgID0gbnVsbFxuICAgIHRoaXMuaW5TdGF0ZSAgICA9IG51bGxcblxuICAgIHRoaXMuaW5pdCgndG9vbHRpcCcsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBUb29sdGlwLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRvb2x0aXAuREVGQVVMVFMgPSB7XG4gICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLFxuICAgIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXG4gICAgdGl0bGU6ICcnLFxuICAgIGRlbGF5OiAwLFxuICAgIGh0bWw6IGZhbHNlLFxuICAgIGNvbnRhaW5lcjogZmFsc2UsXG4gICAgdmlld3BvcnQ6IHtcbiAgICAgIHNlbGVjdG9yOiAnYm9keScsXG4gICAgICBwYWRkaW5nOiAwXG4gICAgfSxcbiAgICBzYW5pdGl6ZSA6IHRydWUsXG4gICAgc2FuaXRpemVGbiA6IG51bGwsXG4gICAgd2hpdGVMaXN0IDogRGVmYXVsdFdoaXRlbGlzdFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbmFibGVkICAgPSB0cnVlXG4gICAgdGhpcy50eXBlICAgICAgPSB0eXBlXG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSB0aGlzLmdldE9wdGlvbnMob3B0aW9ucylcbiAgICB0aGlzLiR2aWV3cG9ydCA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiAkKGRvY3VtZW50KS5maW5kKCQuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMudmlld3BvcnQpID8gdGhpcy5vcHRpb25zLnZpZXdwb3J0LmNhbGwodGhpcywgdGhpcy4kZWxlbWVudCkgOiAodGhpcy5vcHRpb25zLnZpZXdwb3J0LnNlbGVjdG9yIHx8IHRoaXMub3B0aW9ucy52aWV3cG9ydCkpXG4gICAgdGhpcy5pblN0YXRlICAgPSB7IGNsaWNrOiBmYWxzZSwgaG92ZXI6IGZhbHNlLCBmb2N1czogZmFsc2UgfVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0gaW5zdGFuY2VvZiBkb2N1bWVudC5jb25zdHJ1Y3RvciAmJiAhdGhpcy5vcHRpb25zLnNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BzZWxlY3RvcmAgb3B0aW9uIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nICcgKyB0aGlzLnR5cGUgKyAnIG9uIHRoZSB3aW5kb3cuZG9jdW1lbnQgb2JqZWN0IScpXG4gICAgfVxuXG4gICAgdmFyIHRyaWdnZXJzID0gdGhpcy5vcHRpb25zLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgZm9yICh2YXIgaSA9IHRyaWdnZXJzLmxlbmd0aDsgaS0tOykge1xuICAgICAgdmFyIHRyaWdnZXIgPSB0cmlnZ2Vyc1tpXVxuXG4gICAgICBpZiAodHJpZ2dlciA9PSAnY2xpY2snKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLnRvZ2dsZSwgdGhpcykpXG4gICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT0gJ21hbnVhbCcpIHtcbiAgICAgICAgdmFyIGV2ZW50SW4gID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlZW50ZXInIDogJ2ZvY3VzaW4nXG4gICAgICAgIHZhciBldmVudE91dCA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWxlYXZlJyA6ICdmb2N1c291dCdcblxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50SW4gICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5lbnRlciwgdGhpcykpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRPdXQgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmxlYXZlLCB0aGlzKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMuc2VsZWN0b3IgP1xuICAgICAgKHRoaXMuX29wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7IHRyaWdnZXI6ICdtYW51YWwnLCBzZWxlY3RvcjogJycgfSkpIDpcbiAgICAgIHRoaXMuZml4VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFRvb2x0aXAuREVGQVVMVFNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBkYXRhQXR0cmlidXRlcyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgpXG5cbiAgICBmb3IgKHZhciBkYXRhQXR0ciBpbiBkYXRhQXR0cmlidXRlcykge1xuICAgICAgaWYgKGRhdGFBdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGRhdGFBdHRyKSAmJiAkLmluQXJyYXkoZGF0YUF0dHIsIERJU0FMTE9XRURfQVRUUklCVVRFUykgIT09IC0xKSB7XG4gICAgICAgIGRlbGV0ZSBkYXRhQXR0cmlidXRlc1tkYXRhQXR0cl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgZGF0YUF0dHJpYnV0ZXMsIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNhbml0aXplKSB7XG4gICAgICBvcHRpb25zLnRlbXBsYXRlID0gc2FuaXRpemVIdG1sKG9wdGlvbnMudGVtcGxhdGUsIG9wdGlvbnMud2hpdGVMaXN0LCBvcHRpb25zLnNhbml0aXplRm4pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlbGVnYXRlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyAgPSB7fVxuICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdHMoKVxuXG4gICAgdGhpcy5fb3B0aW9ucyAmJiAkLmVhY2godGhpcy5fb3B0aW9ucywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmIChkZWZhdWx0c1trZXldICE9IHZhbHVlKSBvcHRpb25zW2tleV0gPSB2YWx1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW50ZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNpbicgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgfHwgc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHtcbiAgICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpIHJldHVybiBzZWxmLnNob3coKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHNlbGYuc2hvdygpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pc0luU3RhdGVUcnVlID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmluU3RhdGUpIHtcbiAgICAgIGlmICh0aGlzLmluU3RhdGVba2V5XSkgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmxlYXZlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3Vzb3V0JyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSByZXR1cm5cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnb3V0J1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5oaWRlKSByZXR1cm4gc2VsZi5oaWRlKClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnb3V0Jykgc2VsZi5oaWRlKClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAodGhpcy5oYXNDb250ZW50KCkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgdmFyIGluRG9tID0gJC5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB0aGlzLiRlbGVtZW50WzBdKVxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgIWluRG9tKSByZXR1cm5cbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICB2YXIgJHRpcCA9IHRoaXMudGlwKClcblxuICAgICAgdmFyIHRpcElkID0gdGhpcy5nZXRVSUQodGhpcy50eXBlKVxuXG4gICAgICB0aGlzLnNldENvbnRlbnQoKVxuICAgICAgJHRpcC5hdHRyKCdpZCcsIHRpcElkKVxuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGlwSWQpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSAkdGlwLmFkZENsYXNzKCdmYWRlJylcblxuICAgICAgdmFyIHBsYWNlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcywgJHRpcFswXSwgdGhpcy4kZWxlbWVudFswXSkgOlxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50XG5cbiAgICAgIHZhciBhdXRvVG9rZW4gPSAvXFxzP2F1dG8/XFxzPy9pXG4gICAgICB2YXIgYXV0b1BsYWNlID0gYXV0b1Rva2VuLnRlc3QocGxhY2VtZW50KVxuICAgICAgaWYgKGF1dG9QbGFjZSkgcGxhY2VtZW50ID0gcGxhY2VtZW50LnJlcGxhY2UoYXV0b1Rva2VuLCAnJykgfHwgJ3RvcCdcblxuICAgICAgJHRpcFxuICAgICAgICAuZGV0YWNoKClcbiAgICAgICAgLmNzcyh7IHRvcDogMCwgbGVmdDogMCwgZGlzcGxheTogJ2Jsb2NrJyB9KVxuICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgICAuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgdGhpcylcblxuICAgICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lciA/ICR0aXAuYXBwZW5kVG8oJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSkgOiAkdGlwLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2luc2VydGVkLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICAgIHZhciBwb3MgICAgICAgICAgPSB0aGlzLmdldFBvc2l0aW9uKClcbiAgICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgICAgaWYgKGF1dG9QbGFjZSkge1xuICAgICAgICB2YXIgb3JnUGxhY2VtZW50ID0gcGxhY2VtZW50XG4gICAgICAgIHZhciB2aWV3cG9ydERpbSA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICAgICAgcGxhY2VtZW50ID0gcGxhY2VtZW50ID09ICdib3R0b20nICYmIHBvcy5ib3R0b20gKyBhY3R1YWxIZWlnaHQgPiB2aWV3cG9ydERpbS5ib3R0b20gPyAndG9wJyAgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICAmJiBwb3MudG9wICAgIC0gYWN0dWFsSGVpZ2h0IDwgdmlld3BvcnREaW0udG9wICAgID8gJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAgJiYgcG9zLnJpZ2h0ICArIGFjdHVhbFdpZHRoICA+IHZpZXdwb3J0RGltLndpZHRoICA/ICdsZWZ0JyAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgICYmIHBvcy5sZWZ0ICAgLSBhY3R1YWxXaWR0aCAgPCB2aWV3cG9ydERpbS5sZWZ0ICAgPyAncmlnaHQnICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFxuXG4gICAgICAgICR0aXBcbiAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3JnUGxhY2VtZW50KVxuICAgICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxjdWxhdGVkT2Zmc2V0ID0gdGhpcy5nZXRDYWxjdWxhdGVkT2Zmc2V0KHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgICB0aGlzLmFwcGx5UGxhY2VtZW50KGNhbGN1bGF0ZWRPZmZzZXQsIHBsYWNlbWVudClcblxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJldkhvdmVyU3RhdGUgPSB0aGF0LmhvdmVyU3RhdGVcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdzaG93bi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgICB0aGF0LmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICAgICAgaWYgKHByZXZIb3ZlclN0YXRlID09ICdvdXQnKSB0aGF0LmxlYXZlKHRoYXQpXG4gICAgICB9XG5cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY29tcGxldGUoKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFwcGx5UGxhY2VtZW50ID0gZnVuY3Rpb24gKG9mZnNldCwgcGxhY2VtZW50KSB7XG4gICAgdmFyICR0aXAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgd2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBoZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgLy8gbWFudWFsbHkgcmVhZCBtYXJnaW5zIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGluY2x1ZGVzIGRpZmZlcmVuY2VcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi10b3AnKSwgMTApXG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApXG5cbiAgICAvLyB3ZSBtdXN0IGNoZWNrIGZvciBOYU4gZm9yIGllIDgvOVxuICAgIGlmIChpc05hTihtYXJnaW5Ub3ApKSAgbWFyZ2luVG9wICA9IDBcbiAgICBpZiAoaXNOYU4obWFyZ2luTGVmdCkpIG1hcmdpbkxlZnQgPSAwXG5cbiAgICBvZmZzZXQudG9wICArPSBtYXJnaW5Ub3BcbiAgICBvZmZzZXQubGVmdCArPSBtYXJnaW5MZWZ0XG5cbiAgICAvLyAkLmZuLm9mZnNldCBkb2Vzbid0IHJvdW5kIHBpeGVsIHZhbHVlc1xuICAgIC8vIHNvIHdlIHVzZSBzZXRPZmZzZXQgZGlyZWN0bHkgd2l0aCBvdXIgb3duIGZ1bmN0aW9uIEItMFxuICAgICQub2Zmc2V0LnNldE9mZnNldCgkdGlwWzBdLCAkLmV4dGVuZCh7XG4gICAgICB1c2luZzogZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICR0aXAuY3NzKHtcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQocHJvcHMudG9wKSxcbiAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKHByb3BzLmxlZnQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgb2Zmc2V0KSwgMClcblxuICAgICR0aXAuYWRkQ2xhc3MoJ2luJylcblxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBwbGFjaW5nIHRpcCBpbiBuZXcgb2Zmc2V0IGNhdXNlZCB0aGUgdGlwIHRvIHJlc2l6ZSBpdHNlbGZcbiAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgaWYgKHBsYWNlbWVudCA9PSAndG9wJyAmJiBhY3R1YWxIZWlnaHQgIT0gaGVpZ2h0KSB7XG4gICAgICBvZmZzZXQudG9wID0gb2Zmc2V0LnRvcCArIGhlaWdodCAtIGFjdHVhbEhlaWdodFxuICAgIH1cblxuICAgIHZhciBkZWx0YSA9IHRoaXMuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhKHBsYWNlbWVudCwgb2Zmc2V0LCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgaWYgKGRlbHRhLmxlZnQpIG9mZnNldC5sZWZ0ICs9IGRlbHRhLmxlZnRcbiAgICBlbHNlIG9mZnNldC50b3AgKz0gZGVsdGEudG9wXG5cbiAgICB2YXIgaXNWZXJ0aWNhbCAgICAgICAgICA9IC90b3B8Ym90dG9tLy50ZXN0KHBsYWNlbWVudClcbiAgICB2YXIgYXJyb3dEZWx0YSAgICAgICAgICA9IGlzVmVydGljYWwgPyBkZWx0YS5sZWZ0ICogMiAtIHdpZHRoICsgYWN0dWFsV2lkdGggOiBkZWx0YS50b3AgKiAyIC0gaGVpZ2h0ICsgYWN0dWFsSGVpZ2h0XG4gICAgdmFyIGFycm93T2Zmc2V0UG9zaXRpb24gPSBpc1ZlcnRpY2FsID8gJ29mZnNldFdpZHRoJyA6ICdvZmZzZXRIZWlnaHQnXG5cbiAgICAkdGlwLm9mZnNldChvZmZzZXQpXG4gICAgdGhpcy5yZXBsYWNlQXJyb3coYXJyb3dEZWx0YSwgJHRpcFswXVthcnJvd09mZnNldFBvc2l0aW9uXSwgaXNWZXJ0aWNhbClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnJlcGxhY2VBcnJvdyA9IGZ1bmN0aW9uIChkZWx0YSwgZGltZW5zaW9uLCBpc1ZlcnRpY2FsKSB7XG4gICAgdGhpcy5hcnJvdygpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJywgNTAgKiAoMSAtIGRlbHRhIC8gZGltZW5zaW9uKSArICclJylcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnLCAnJylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gc2FuaXRpemVIdG1sKHRpdGxlLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLmh0bWwodGl0bGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS50ZXh0KHRpdGxlKVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0JylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgJHRpcCA9ICQodGhpcy4kdGlwKVxuICAgIHZhciBlICAgID0gJC5FdmVudCgnaGlkZS5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICBpZiAodGhhdC5ob3ZlclN0YXRlICE9ICdpbicpICR0aXAuZGV0YWNoKClcbiAgICAgIGlmICh0aGF0LiRlbGVtZW50KSB7IC8vIFRPRE86IENoZWNrIHdoZXRoZXIgZ3VhcmRpbmcgdGhpcyBjb2RlIHdpdGggdGhpcyBgaWZgIGlzIHJlYWxseSBuZWNlc3NhcnkuXG4gICAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpXG4gICAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgfVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICR0aXBcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIGNvbXBsZXRlKClcblxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5maXhUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgaWYgKCRlLmF0dHIoJ3RpdGxlJykgfHwgdHlwZW9mICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSAhPSAnc3RyaW5nJykge1xuICAgICAgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScsICRlLmF0dHIoJ3RpdGxlJykgfHwgJycpLmF0dHIoJ3RpdGxlJywgJycpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgICRlbGVtZW50ICAgPSAkZWxlbWVudCB8fCB0aGlzLiRlbGVtZW50XG5cbiAgICB2YXIgZWwgICAgID0gJGVsZW1lbnRbMF1cbiAgICB2YXIgaXNCb2R5ID0gZWwudGFnTmFtZSA9PSAnQk9EWSdcblxuICAgIHZhciBlbFJlY3QgICAgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmIChlbFJlY3Qud2lkdGggPT0gbnVsbCkge1xuICAgICAgLy8gd2lkdGggYW5kIGhlaWdodCBhcmUgbWlzc2luZyBpbiBJRTgsIHNvIGNvbXB1dGUgdGhlbSBtYW51YWxseTsgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMTQwOTNcbiAgICAgIGVsUmVjdCA9ICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHsgd2lkdGg6IGVsUmVjdC5yaWdodCAtIGVsUmVjdC5sZWZ0LCBoZWlnaHQ6IGVsUmVjdC5ib3R0b20gLSBlbFJlY3QudG9wIH0pXG4gICAgfVxuICAgIHZhciBpc1N2ZyA9IHdpbmRvdy5TVkdFbGVtZW50ICYmIGVsIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnRcbiAgICAvLyBBdm9pZCB1c2luZyAkLm9mZnNldCgpIG9uIFNWR3Mgc2luY2UgaXQgZ2l2ZXMgaW5jb3JyZWN0IHJlc3VsdHMgaW4galF1ZXJ5IDMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMjAyODBcbiAgICB2YXIgZWxPZmZzZXQgID0gaXNCb2R5ID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IChpc1N2ZyA/IG51bGwgOiAkZWxlbWVudC5vZmZzZXQoKSlcbiAgICB2YXIgc2Nyb2xsICAgID0geyBzY3JvbGw6IGlzQm9keSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgOiAkZWxlbWVudC5zY3JvbGxUb3AoKSB9XG4gICAgdmFyIG91dGVyRGltcyA9IGlzQm9keSA/IHsgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSB9IDogbnVsbFxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHNjcm9sbCwgb3V0ZXJEaW1zLCBlbE9mZnNldClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICByZXR1cm4gcGxhY2VtZW50ID09ICdib3R0b20nID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0LCAgIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgID8geyB0b3A6IHBvcy50b3AgLSBhY3R1YWxIZWlnaHQsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0IC0gYWN0dWFsV2lkdGggfSA6XG4gICAgICAgIC8qIHBsYWNlbWVudCA9PSAncmlnaHQnICovIHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCB9XG5cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YSA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHZhciBkZWx0YSA9IHsgdG9wOiAwLCBsZWZ0OiAwIH1cbiAgICBpZiAoIXRoaXMuJHZpZXdwb3J0KSByZXR1cm4gZGVsdGFcblxuICAgIHZhciB2aWV3cG9ydFBhZGRpbmcgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgdGhpcy5vcHRpb25zLnZpZXdwb3J0LnBhZGRpbmcgfHwgMFxuICAgIHZhciB2aWV3cG9ydERpbWVuc2lvbnMgPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgaWYgKC9yaWdodHxsZWZ0Ly50ZXN0KHBsYWNlbWVudCkpIHtcbiAgICAgIHZhciB0b3BFZGdlT2Zmc2V0ICAgID0gcG9zLnRvcCAtIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGxcbiAgICAgIHZhciBib3R0b21FZGdlT2Zmc2V0ID0gcG9zLnRvcCArIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGwgKyBhY3R1YWxIZWlnaHRcbiAgICAgIGlmICh0b3BFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLnRvcCkgeyAvLyB0b3Agb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCAtIHRvcEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAoYm90dG9tRWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0KSB7IC8vIGJvdHRvbSBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCAtIGJvdHRvbUVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxlZnRFZGdlT2Zmc2V0ICA9IHBvcy5sZWZ0IC0gdmlld3BvcnRQYWRkaW5nXG4gICAgICB2YXIgcmlnaHRFZGdlT2Zmc2V0ID0gcG9zLmxlZnQgKyB2aWV3cG9ydFBhZGRpbmcgKyBhY3R1YWxXaWR0aFxuICAgICAgaWYgKGxlZnRFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLmxlZnQpIHsgLy8gbGVmdCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgLSBsZWZ0RWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChyaWdodEVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMucmlnaHQpIHsgLy8gcmlnaHQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0ICsgdmlld3BvcnREaW1lbnNpb25zLndpZHRoIC0gcmlnaHRFZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbHRhXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGl0bGVcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICB0aXRsZSA9ICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKVxuICAgICAgfHwgKHR5cGVvZiBvLnRpdGxlID09ICdmdW5jdGlvbicgPyBvLnRpdGxlLmNhbGwoJGVbMF0pIDogIG8udGl0bGUpXG5cbiAgICByZXR1cm4gdGl0bGVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFVJRCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICBkbyBwcmVmaXggKz0gfn4oTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApXG4gICAgd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG4gICAgcmV0dXJuIHByZWZpeFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kdGlwKSB7XG4gICAgICB0aGlzLiR0aXAgPSAkKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSlcbiAgICAgIGlmICh0aGlzLiR0aXAubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZSArICcgYHRlbXBsYXRlYCBvcHRpb24gbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgMSB0b3AtbGV2ZWwgZWxlbWVudCEnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4kdGlwXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcudG9vbHRpcC1hcnJvdycpKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gIXRoaXMuZW5hYmxlZFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAoZSkge1xuICAgICAgc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuICAgICAgaWYgKCFzZWxmKSB7XG4gICAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlKSB7XG4gICAgICBzZWxmLmluU3RhdGUuY2xpY2sgPSAhc2VsZi5pblN0YXRlLmNsaWNrXG4gICAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHNlbGYuZW50ZXIoc2VsZilcbiAgICAgIGVsc2Ugc2VsZi5sZWF2ZShzZWxmKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpID8gc2VsZi5sZWF2ZShzZWxmKSA6IHNlbGYuZW50ZXIoc2VsZilcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgdGhpcy5oaWRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub2ZmKCcuJyArIHRoYXQudHlwZSkucmVtb3ZlRGF0YSgnYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIGlmICh0aGF0LiR0aXApIHtcbiAgICAgICAgdGhhdC4kdGlwLmRldGFjaCgpXG4gICAgICB9XG4gICAgICB0aGF0LiR0aXAgPSBudWxsXG4gICAgICB0aGF0LiRhcnJvdyA9IG51bGxcbiAgICAgIHRoYXQuJHZpZXdwb3J0ID0gbnVsbFxuICAgICAgdGhhdC4kZWxlbWVudCA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2FuaXRpemVIdG1sID0gZnVuY3Rpb24gKHVuc2FmZUh0bWwpIHtcbiAgICByZXR1cm4gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICB9XG5cbiAgLy8gVE9PTFRJUCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcsIChkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRvb2x0aXBcblxuICAkLmZuLnRvb2x0aXAgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxuXG5cbiAgLy8gVE9PTFRJUCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50b29sdGlwID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBwb3BvdmVyLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3BvcG92ZXJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gUE9QT1ZFUiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFBvcG92ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdCgncG9wb3ZlcicsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBpZiAoISQuZm4udG9vbHRpcCkgdGhyb3cgbmV3IEVycm9yKCdQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanMnKVxuXG4gIFBvcG92ZXIuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgUG9wb3Zlci5ERUZBVUxUUyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMsIHtcbiAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgdHJpZ2dlcjogJ2NsaWNrJyxcbiAgICBjb250ZW50OiAnJyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J1xuICB9KVxuXG5cbiAgLy8gTk9URTogUE9QT1ZFUiBFWFRFTkRTIHRvb2x0aXAuanNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBQb3BvdmVyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IucHJvdG90eXBlKVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQb3BvdmVyLkRFRkFVTFRTXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSAgID0gdGhpcy5nZXRUaXRsZSgpXG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICB2YXIgdHlwZUNvbnRlbnQgPSB0eXBlb2YgY29udGVudFxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gdGhpcy5zYW5pdGl6ZUh0bWwodGl0bGUpXG5cbiAgICAgICAgaWYgKHR5cGVDb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLnNhbml0aXplSHRtbChjb250ZW50KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKVtcbiAgICAgICAgdHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnID8gJ2h0bWwnIDogJ2FwcGVuZCdcbiAgICAgIF0oY29udGVudClcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLnRleHQodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpLnRleHQoY29udGVudClcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIHRvcCBib3R0b20gbGVmdCByaWdodCBpbicpXG5cbiAgICAvLyBJRTggZG9lc24ndCBhY2NlcHQgaGlkaW5nIHZpYSB0aGUgYDplbXB0eWAgcHNldWRvIHNlbGVjdG9yLCB3ZSBoYXZlIHRvIGRvXG4gICAgLy8gdGhpcyBtYW51YWxseSBieSBjaGVja2luZyB0aGUgY29udGVudHMuXG4gICAgaWYgKCEkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCgpKSAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaGlkZSgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5nZXRDb250ZW50KClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgcmV0dXJuICRlLmF0dHIoJ2RhdGEtY29udGVudCcpXG4gICAgICB8fCAodHlwZW9mIG8uY29udGVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgby5jb250ZW50LmNhbGwoJGVbMF0pIDpcbiAgICAgICAgby5jb250ZW50KVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXG4gIH1cblxuXG4gIC8vIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInLCAoZGF0YSA9IG5ldyBQb3BvdmVyKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5wb3BvdmVyXG5cbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuXG4gIC8vIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ucG9wb3Zlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ucG9wb3ZlciA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogc2Nyb2xsc3B5LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Njcm9sbHNweVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFNDUk9MTFNQWSBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gU2Nyb2xsU3B5KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRib2R5ICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQgPSAkKGVsZW1lbnQpLmlzKGRvY3VtZW50LmJvZHkpID8gJCh3aW5kb3cpIDogJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICAgPSAkLmV4dGVuZCh7fSwgU2Nyb2xsU3B5LkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuc2VsZWN0b3IgICAgICAgPSAodGhpcy5vcHRpb25zLnRhcmdldCB8fCAnJykgKyAnIC5uYXYgbGkgPiBhJ1xuICAgIHRoaXMub2Zmc2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ICAgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgICA9IDBcblxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQub24oJ3Njcm9sbC5icy5zY3JvbGxzcHknLCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgICB0aGlzLnByb2Nlc3MoKVxuICB9XG5cbiAgU2Nyb2xsU3B5LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFNjcm9sbFNweS5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDEwXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgICAgICAgICAgPSB0aGlzXG4gICAgdmFyIG9mZnNldE1ldGhvZCAgPSAnb2Zmc2V0J1xuICAgIHZhciBvZmZzZXRCYXNlICAgID0gMFxuXG4gICAgdGhpcy5vZmZzZXRzICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgID0gW11cbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgIGlmICghJC5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKSkge1xuICAgICAgb2Zmc2V0TWV0aG9kID0gJ3Bvc2l0aW9uJ1xuICAgICAgb2Zmc2V0QmFzZSAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKVxuICAgIH1cblxuICAgIHRoaXMuJGJvZHlcbiAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXG4gICAgICAubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCAgID0gJCh0aGlzKVxuICAgICAgICB2YXIgaHJlZiAgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxuICAgICAgICB2YXIgJGhyZWYgPSAvXiMuLy50ZXN0KGhyZWYpICYmICQoaHJlZilcblxuICAgICAgICByZXR1cm4gKCRocmVmXG4gICAgICAgICAgJiYgJGhyZWYubGVuZ3RoXG4gICAgICAgICAgJiYgJGhyZWYuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICAmJiBbWyRocmVmW29mZnNldE1ldGhvZF0oKS50b3AgKyBvZmZzZXRCYXNlLCBocmVmXV0pIHx8IG51bGxcbiAgICAgIH0pXG4gICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF0gfSlcbiAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5vZmZzZXRzLnB1c2godGhpc1swXSlcbiAgICAgICAgdGhhdC50YXJnZXRzLnB1c2godGhpc1sxXSlcbiAgICAgIH0pXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcbiAgICB2YXIgbWF4U2Nyb2xsICAgID0gdGhpcy5vcHRpb25zLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0cyAgICAgID0gdGhpcy5vZmZzZXRzXG4gICAgdmFyIHRhcmdldHMgICAgICA9IHRoaXMudGFyZ2V0c1xuICAgIHZhciBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFxuICAgIHZhciBpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb3AgPj0gbWF4U2Nyb2xsKSB7XG4gICAgICByZXR1cm4gYWN0aXZlVGFyZ2V0ICE9IChpID0gdGFyZ2V0c1t0YXJnZXRzLmxlbmd0aCAtIDFdKSAmJiB0aGlzLmFjdGl2YXRlKGkpXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCBvZmZzZXRzWzBdKSB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKClcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBvZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgYWN0aXZlVGFyZ2V0ICE9IHRhcmdldHNbaV1cbiAgICAgICAgJiYgc2Nyb2xsVG9wID49IG9mZnNldHNbaV1cbiAgICAgICAgJiYgKG9mZnNldHNbaSArIDFdID09PSB1bmRlZmluZWQgfHwgc2Nyb2xsVG9wIDwgb2Zmc2V0c1tpICsgMV0pXG4gICAgICAgICYmIHRoaXMuYWN0aXZhdGUodGFyZ2V0c1tpXSlcbiAgICB9XG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICB0aGlzLmNsZWFyKClcblxuICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgK1xuICAgICAgJ1tkYXRhLXRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCJdLCcgK1xuICAgICAgdGhpcy5zZWxlY3RvciArICdbaHJlZj1cIicgKyB0YXJnZXQgKyAnXCJdJ1xuXG4gICAgdmFyIGFjdGl2ZSA9ICQoc2VsZWN0b3IpXG4gICAgICAucGFyZW50cygnbGknKVxuICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgaWYgKGFjdGl2ZS5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICBhY3RpdmUgPSBhY3RpdmVcbiAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGFjdGl2ZS50cmlnZ2VyKCdhY3RpdmF0ZS5icy5zY3JvbGxzcHknKVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMuc2VsZWN0b3IpXG4gICAgICAucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsICcuYWN0aXZlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScsIChkYXRhID0gbmV3IFNjcm9sbFNweSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uc2Nyb2xsc3B5XG5cbiAgJC5mbi5zY3JvbGxzcHkgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3IgPSBTY3JvbGxTcHlcblxuXG4gIC8vIFNDUk9MTFNQWSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uc2Nyb2xsc3B5ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksICRzcHkuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRhYi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0YWJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gVEFCIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVGFiID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBqc2NzOmRpc2FibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgLy8ganNjczplbmFibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgfVxuXG4gIFRhYi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVGFiLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyAgICA9IHRoaXMuZWxlbWVudFxuICAgIHZhciAkdWwgICAgICA9ICR0aGlzLmNsb3Nlc3QoJ3VsOm5vdCguZHJvcGRvd24tbWVudSknKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmRhdGEoJ3RhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIGlmICgkdGhpcy5wYXJlbnQoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm5cblxuICAgIHZhciAkcHJldmlvdXMgPSAkdWwuZmluZCgnLmFjdGl2ZTpsYXN0IGEnKVxuICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgfSlcbiAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCgnc2hvdy5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICB9KVxuXG4gICAgJHByZXZpb3VzLnRyaWdnZXIoaGlkZUV2ZW50KVxuICAgICR0aGlzLnRyaWdnZXIoc2hvd0V2ZW50KVxuXG4gICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGhpcy5jbG9zZXN0KCdsaScpLCAkdWwpXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkcHJldmlvdXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdoaWRkZW4uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICAgIH0pXG4gICAgICAkdGhpcy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ3Nob3duLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgVGFiLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyICRhY3RpdmUgICAgPSBjb250YWluZXIuZmluZCgnPiAuYWN0aXZlJylcbiAgICB2YXIgdHJhbnNpdGlvbiA9IGNhbGxiYWNrXG4gICAgICAmJiAkLnN1cHBvcnQudHJhbnNpdGlvblxuICAgICAgJiYgKCRhY3RpdmUubGVuZ3RoICYmICRhY3RpdmUuaGFzQ2xhc3MoJ2ZhZGUnKSB8fCAhIWNvbnRhaW5lci5maW5kKCc+IC5mYWRlJykubGVuZ3RoKVxuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmUnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5lbmQoKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgZWxlbWVudFxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gcmVmbG93IGZvciB0cmFuc2l0aW9uXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhZGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAuZW5kKClcbiAgICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICAkYWN0aXZlLmxlbmd0aCAmJiB0cmFuc2l0aW9uID9cbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgbmV4dClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBuZXh0KClcblxuICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2luJylcbiAgfVxuXG5cbiAgLy8gVEFCIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLnRhYicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudGFiJywgKGRhdGEgPSBuZXcgVGFiKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50YWJcblxuICAkLmZuLnRhYiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRhYi5Db25zdHJ1Y3RvciA9IFRhYlxuXG5cbiAgLy8gVEFCIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQuZm4udGFiLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50YWIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBUQUIgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgUGx1Z2luLmNhbGwoJCh0aGlzKSwgJ3Nob3cnKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsIGNsaWNrSGFuZGxlcilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWZmaXguanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWZmaXhcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBRkZJWCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQWZmaXggPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBZmZpeC5ERUZBVUxUUywgb3B0aW9ucylcblxuICAgIHZhciB0YXJnZXQgPSB0aGlzLm9wdGlvbnMudGFyZ2V0ID09PSBBZmZpeC5ERUZBVUxUUy50YXJnZXQgPyAkKHRoaXMub3B0aW9ucy50YXJnZXQpIDogJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMudGFyZ2V0KVxuXG4gICAgdGhpcy4kdGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAub24oJ3Njcm9sbC5icy5hZmZpeC5kYXRhLWFwaScsICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSlcbiAgICAgIC5vbignY2xpY2suYnMuYWZmaXguZGF0YS1hcGknLCAgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLCB0aGlzKSlcblxuICAgIHRoaXMuJGVsZW1lbnQgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuYWZmaXhlZCAgICAgID0gbnVsbFxuICAgIHRoaXMudW5waW4gICAgICAgID0gbnVsbFxuICAgIHRoaXMucGlubmVkT2Zmc2V0ID0gbnVsbFxuXG4gICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcbiAgfVxuXG4gIEFmZml4LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEFmZml4LlJFU0VUICAgID0gJ2FmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b20nXG5cbiAgQWZmaXguREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAwLFxuICAgIHRhcmdldDogd2luZG93XG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgICAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHRhcmdldEhlaWdodCA9IHRoaXMuJHRhcmdldC5oZWlnaHQoKVxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHRoaXMuYWZmaXhlZCA9PSAndG9wJykgcmV0dXJuIHNjcm9sbFRvcCA8IG9mZnNldFRvcCA/ICd0b3AnIDogZmFsc2VcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgPT0gJ2JvdHRvbScpIHtcbiAgICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCkgcmV0dXJuIChzY3JvbGxUb3AgKyB0aGlzLnVucGluIDw9IHBvc2l0aW9uLnRvcCkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgICByZXR1cm4gKHNjcm9sbFRvcCArIHRhcmdldEhlaWdodCA8PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgIH1cblxuICAgIHZhciBpbml0aWFsaXppbmcgICA9IHRoaXMuYWZmaXhlZCA9PSBudWxsXG4gICAgdmFyIGNvbGxpZGVyVG9wICAgID0gaW5pdGlhbGl6aW5nID8gc2Nyb2xsVG9wIDogcG9zaXRpb24udG9wXG4gICAgdmFyIGNvbGxpZGVySGVpZ2h0ID0gaW5pdGlhbGl6aW5nID8gdGFyZ2V0SGVpZ2h0IDogaGVpZ2h0XG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgc2Nyb2xsVG9wIDw9IG9mZnNldFRvcCkgcmV0dXJuICd0b3AnXG4gICAgaWYgKG9mZnNldEJvdHRvbSAhPSBudWxsICYmIChjb2xsaWRlclRvcCArIGNvbGxpZGVySGVpZ2h0ID49IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkpIHJldHVybiAnYm90dG9tJ1xuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBpbm5lZE9mZnNldCkgcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVCkuYWRkQ2xhc3MoJ2FmZml4JylcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICByZXR1cm4gKHRoaXMucGlubmVkT2Zmc2V0ID0gcG9zaXRpb24udG9wIC0gc2Nyb2xsVG9wKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpLCAxKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LmlzKCc6dmlzaWJsZScpKSByZXR1cm5cblxuICAgIHZhciBoZWlnaHQgICAgICAgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldCAgICAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcFxuICAgIHZhciBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KCQoZG9jdW1lbnQpLmhlaWdodCgpLCAkKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKVxuXG4gICAgaWYgKHR5cGVvZiBvZmZzZXQgIT0gJ29iamVjdCcpICAgICAgICAgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0VG9wID0gb2Zmc2V0XG4gICAgaWYgKHR5cGVvZiBvZmZzZXRUb3AgPT0gJ2Z1bmN0aW9uJykgICAgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcCh0aGlzLiRlbGVtZW50KVxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0Qm90dG9tID09ICdmdW5jdGlvbicpIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b20odGhpcy4kZWxlbWVudClcblxuICAgIHZhciBhZmZpeCA9IHRoaXMuZ2V0U3RhdGUoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCAhPSBhZmZpeCkge1xuICAgICAgaWYgKHRoaXMudW5waW4gIT0gbnVsbCkgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsICcnKVxuXG4gICAgICB2YXIgYWZmaXhUeXBlID0gJ2FmZml4JyArIChhZmZpeCA/ICctJyArIGFmZml4IDogJycpXG4gICAgICB2YXIgZSAgICAgICAgID0gJC5FdmVudChhZmZpeFR5cGUgKyAnLmJzLmFmZml4JylcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgdGhpcy5hZmZpeGVkID0gYWZmaXhcbiAgICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHRoaXMuZ2V0UGlubmVkT2Zmc2V0KCkgOiBudWxsXG5cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKVxuICAgICAgICAuYWRkQ2xhc3MoYWZmaXhUeXBlKVxuICAgICAgICAudHJpZ2dlcihhZmZpeFR5cGUucmVwbGFjZSgnYWZmaXgnLCAnYWZmaXhlZCcpICsgJy5icy5hZmZpeCcpXG4gICAgfVxuXG4gICAgaWYgKGFmZml4ID09ICdib3R0b20nKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZnNldCh7XG4gICAgICAgIHRvcDogc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0IC0gb2Zmc2V0Qm90dG9tXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQUZGSVggUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYWZmaXgnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFmZml4JywgKGRhdGEgPSBuZXcgQWZmaXgodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFmZml4XG5cbiAgJC5mbi5hZmZpeCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFmZml4LkNvbnN0cnVjdG9yID0gQWZmaXhcblxuXG4gIC8vIEFGRklYIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hZmZpeC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWZmaXggPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBRkZJWCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICRzcHkuZGF0YSgpXG5cbiAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwge31cblxuICAgICAgaWYgKGRhdGEub2Zmc2V0Qm90dG9tICE9IG51bGwpIGRhdGEub2Zmc2V0LmJvdHRvbSA9IGRhdGEub2Zmc2V0Qm90dG9tXG4gICAgICBpZiAoZGF0YS5vZmZzZXRUb3AgICAgIT0gbnVsbCkgZGF0YS5vZmZzZXQudG9wICAgID0gZGF0YS5vZmZzZXRUb3BcblxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgZGF0YSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG4iLCIvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHwgRmxleHkgaGVhZGVyXG4vLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHxcbi8vIHwgVGhpcyBqUXVlcnkgc2NyaXB0IGlzIHdyaXR0ZW4gYnlcbi8vIHxcbi8vIHwgTW9ydGVuIE5pc3NlblxuLy8gfCBoamVtbWVzaWRla29uZ2VuLmRrXG4vLyB8XG5cbnZhciBmbGV4eV9oZWFkZXIgPSAoZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgcHViID0ge30sXG4gICAgICAgICRoZWFkZXJfc3RhdGljID0gJCgnLmZsZXh5LWhlYWRlci0tc3RhdGljJyksXG4gICAgICAgICRoZWFkZXJfc3RpY2t5ID0gJCgnLmZsZXh5LWhlYWRlci0tc3RpY2t5JyksXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB1cGRhdGVfaW50ZXJ2YWw6IDEwMCxcbiAgICAgICAgICAgIHRvbGVyYW5jZToge1xuICAgICAgICAgICAgICAgIHVwd2FyZDogMjAsXG4gICAgICAgICAgICAgICAgZG93bndhcmQ6IDEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb2Zmc2V0OiBfZ2V0X29mZnNldF9mcm9tX2VsZW1lbnRzX2JvdHRvbSgkaGVhZGVyX3N0YXRpYyksXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgcGlubmVkOiBcImZsZXh5LWhlYWRlci0tcGlubmVkXCIsXG4gICAgICAgICAgICAgICAgdW5waW5uZWQ6IFwiZmxleHktaGVhZGVyLS11bnBpbm5lZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhc19zY3JvbGxlZCA9IGZhbHNlLFxuICAgICAgICBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wID0gMDtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlXG4gICAgICovXG4gICAgcHViLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZWdpc3RlckV2ZW50SGFuZGxlcnMoKTtcbiAgICAgICAgcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBib290IGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpIHtcbiAgICAgICAgJGhlYWRlcl9zdGlja3kuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcblxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKHdhc19zY3JvbGxlZCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50X3dhc19zY3JvbGxlZCgpO1xuXG4gICAgICAgICAgICAgICAgd2FzX3Njcm9sbGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG9wdGlvbnMudXBkYXRlX2ludGVydmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpIHtcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgd2FzX3Njcm9sbGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG9mZnNldCBmcm9tIGVsZW1lbnQgYm90dG9tXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20oJGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRfaGVpZ2h0ID0gJGVsZW1lbnQub3V0ZXJIZWlnaHQodHJ1ZSksXG4gICAgICAgICAgICBlbGVtZW50X29mZnNldCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcDtcblxuICAgICAgICByZXR1cm4gKGVsZW1lbnRfaGVpZ2h0ICsgZWxlbWVudF9vZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvY3VtZW50IHdhcyBzY3JvbGxlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvY3VtZW50X3dhc19zY3JvbGxlZCgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgLy8gSWYgcGFzdCBvZmZzZXRcbiAgICAgICAgaWYgKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPj0gb3B0aW9ucy5vZmZzZXQpIHtcblxuICAgICAgICAgICAgLy8gRG93bndhcmRzIHNjcm9sbFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPiBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBPYmV5IHRoZSBkb3dud2FyZCB0b2xlcmFuY2VcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCAtIGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIDw9IG9wdGlvbnMudG9sZXJhbmNlLmRvd253YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcHdhcmRzIHNjcm9sbFxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBPYmV5IHRoZSB1cHdhcmQgdG9sZXJhbmNlXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgLSBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSA8PSBvcHRpb25zLnRvbGVyYW5jZS51cHdhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBub3Qgc2Nyb2xsZWQgcGFzdCB0aGUgZG9jdW1lbnQgd2hpY2ggaXMgcG9zc2libGUgb24gdGhlIE1hY1xuICAgICAgICAgICAgICAgIGlmICgoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCArICQod2luZG93KS5oZWlnaHQoKSkgPCAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdCBwYXN0IG9mZnNldFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wID0gY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfCBGbGV4eSBuYXZpZ2F0aW9uXG4vLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHxcbi8vIHwgVGhpcyBqUXVlcnkgc2NyaXB0IGlzIHdyaXR0ZW4gYnlcbi8vIHxcbi8vIHwgTW9ydGVuIE5pc3NlblxuLy8gfCBoamVtbWVzaWRla29uZ2VuLmRrXG4vLyB8XG5cbnZhciBmbGV4eV9uYXZpZ2F0aW9uID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHB1YiA9IHt9LFxuICAgICAgICBsYXlvdXRfY2xhc3NlcyA9IHtcbiAgICAgICAgICAgICduYXZpZ2F0aW9uJzogJy5mbGV4eS1uYXZpZ2F0aW9uJyxcbiAgICAgICAgICAgICdvYmZ1c2NhdG9yJzogJy5mbGV4eS1uYXZpZ2F0aW9uX19vYmZ1c2NhdG9yJyxcbiAgICAgICAgICAgICdkcm9wZG93bic6ICcuZmxleHktbmF2aWdhdGlvbl9faXRlbS0tZHJvcGRvd24nLFxuICAgICAgICAgICAgJ2Ryb3Bkb3duX21lZ2FtZW51JzogJy5mbGV4eS1uYXZpZ2F0aW9uX19pdGVtX19kcm9wZG93bi1tZWdhbWVudScsXG5cbiAgICAgICAgICAgICdpc191cGdyYWRlZCc6ICdpcy11cGdyYWRlZCcsXG4gICAgICAgICAgICAnbmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUnOiAnaGFzLW1lZ2FtZW51JyxcbiAgICAgICAgICAgICdkcm9wZG93bl9oYXNfbWVnYW1lbnUnOiAnZmxleHktbmF2aWdhdGlvbl9faXRlbS0tZHJvcGRvd24td2l0aC1tZWdhbWVudScsXG4gICAgICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZVxuICAgICAqL1xuICAgIHB1Yi5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYm9vdCBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKSB7XG5cbiAgICAgICAgLy8gVXBncmFkZVxuICAgICAgICB1cGdyYWRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50SGFuZGxlcnMoKSB7fVxuXG4gICAgLyoqXG4gICAgICogVXBncmFkZSBlbGVtZW50cy5cbiAgICAgKiBBZGQgY2xhc3NlcyB0byBlbGVtZW50cywgYmFzZWQgdXBvbiBhdHRhY2hlZCBjbGFzc2VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZ3JhZGUoKSB7XG4gICAgICAgIHZhciAkbmF2aWdhdGlvbnMgPSAkKGxheW91dF9jbGFzc2VzLm5hdmlnYXRpb24pO1xuXG4gICAgICAgIC8vIE5hdmlnYXRpb25zXG4gICAgICAgIGlmICgkbmF2aWdhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJG5hdmlnYXRpb25zLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG5hdmlnYXRpb24gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAkbWVnYW1lbnVzID0gJG5hdmlnYXRpb24uZmluZChsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bl9tZWdhbWVudSksXG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bl9tZWdhbWVudSA9ICRuYXZpZ2F0aW9uLmZpbmQobGF5b3V0X2NsYXNzZXMuZHJvcGRvd25faGFzX21lZ2FtZW51KTtcblxuICAgICAgICAgICAgICAgIC8vIEhhcyBhbHJlYWR5IGJlZW4gdXBncmFkZWRcbiAgICAgICAgICAgICAgICBpZiAoJG5hdmlnYXRpb24uaGFzQ2xhc3MobGF5b3V0X2NsYXNzZXMuaXNfdXBncmFkZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBIYXMgbWVnYW1lbnVcbiAgICAgICAgICAgICAgICBpZiAoJG1lZ2FtZW51cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRuYXZpZ2F0aW9uLmFkZENsYXNzKGxheW91dF9jbGFzc2VzLm5hdmlnYXRpb25faGFzX21lZ2FtZW51KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gdGhyb3VnaCBhbGwgbWVnYW1lbnVzXG4gICAgICAgICAgICAgICAgICAgICRtZWdhbWVudXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRtZWdhbWVudSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzX29iZnVzY2F0b3IgPSAkKCdodG1sJykuaGFzQ2xhc3MoJ2hhcy1vYmZ1c2NhdG9yJykgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRtZWdhbWVudS5wYXJlbnRzKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bl9oYXNfbWVnYW1lbnUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhvdmVyKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNfb2JmdXNjYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JmdXNjYXRvci5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNfb2JmdXNjYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JmdXNjYXRvci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSXMgdXBncmFkZWRcbiAgICAgICAgICAgICAgICAkbmF2aWdhdGlvbi5hZGRDbGFzcyhsYXlvdXRfY2xhc3Nlcy5pc191cGdyYWRlZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuIiwiLyohIHNpZHIgLSB2Mi4yLjEgLSAyMDE2LTAyLTE3XG4gKiBodHRwOi8vd3d3LmJlcnJpYXJ0LmNvbS9zaWRyL1xuICogQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQWxiZXJ0byBWYXJlbGE7IExpY2Vuc2VkIE1JVCAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGJhYmVsSGVscGVycyA9IHt9O1xuXG4gIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH07XG5cbiAgYmFiZWxIZWxwZXJzLmNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfTtcbiAgfSgpO1xuXG4gIGJhYmVsSGVscGVycztcblxuICB2YXIgc2lkclN0YXR1cyA9IHtcbiAgICBtb3Zpbmc6IGZhbHNlLFxuICAgIG9wZW5lZDogZmFsc2VcbiAgfTtcblxuICB2YXIgaGVscGVyID0ge1xuICAgIC8vIENoZWNrIGZvciB2YWxpZHMgdXJsc1xuICAgIC8vIEZyb20gOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU3MTcwOTMvY2hlY2staWYtYS1qYXZhc2NyaXB0LXN0cmluZy1pcy1hbi11cmxcblxuICAgIGlzVXJsOiBmdW5jdGlvbiBpc1VybChzdHIpIHtcbiAgICAgIHZhciBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnXihodHRwcz86XFxcXC9cXFxcLyk/JyArIC8vIHByb3RvY29sXG4gICAgICAnKCgoW2EtelxcXFxkXShbYS16XFxcXGQtXSpbYS16XFxcXGRdKSopXFxcXC4/KStbYS16XXsyLH18JyArIC8vIGRvbWFpbiBuYW1lXG4gICAgICAnKChcXFxcZHsxLDN9XFxcXC4pezN9XFxcXGR7MSwzfSkpJyArIC8vIE9SIGlwICh2NCkgYWRkcmVzc1xuICAgICAgJyhcXFxcOlxcXFxkKyk/KFxcXFwvWy1hLXpcXFxcZCVfLn4rXSopKicgKyAvLyBwb3J0IGFuZCBwYXRoXG4gICAgICAnKFxcXFw/WzsmYS16XFxcXGQlXy5+Kz0tXSopPycgKyAvLyBxdWVyeSBzdHJpbmdcbiAgICAgICcoXFxcXCNbLWEtelxcXFxkX10qKT8kJywgJ2knKTsgLy8gZnJhZ21lbnQgbG9jYXRvclxuXG4gICAgICBpZiAocGF0dGVybi50ZXN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuXG4gICAgLy8gQWRkIHNpZHIgcHJlZml4ZXNcbiAgICBhZGRQcmVmaXhlczogZnVuY3Rpb24gYWRkUHJlZml4ZXMoJGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuYWRkUHJlZml4KCRlbGVtZW50LCAnaWQnKTtcbiAgICAgIHRoaXMuYWRkUHJlZml4KCRlbGVtZW50LCAnY2xhc3MnKTtcbiAgICAgICRlbGVtZW50LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgfSxcbiAgICBhZGRQcmVmaXg6IGZ1bmN0aW9uIGFkZFByZWZpeCgkZWxlbWVudCwgYXR0cmlidXRlKSB7XG4gICAgICB2YXIgdG9SZXBsYWNlID0gJGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUpO1xuXG4gICAgICBpZiAodHlwZW9mIHRvUmVwbGFjZSA9PT0gJ3N0cmluZycgJiYgdG9SZXBsYWNlICE9PSAnJyAmJiB0b1JlcGxhY2UgIT09ICdzaWRyLWlubmVyJykge1xuICAgICAgICAkZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSwgdG9SZXBsYWNlLnJlcGxhY2UoLyhbQS1aYS16MC05Xy5cXC1dKykvZywgJ3NpZHItJyArIGF0dHJpYnV0ZSArICctJDEnKSk7XG4gICAgICB9XG4gICAgfSxcblxuXG4gICAgLy8gQ2hlY2sgaWYgdHJhbnNpdGlvbnMgaXMgc3VwcG9ydGVkXG4gICAgdHJhbnNpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgc3R5bGUgPSBib2R5LnN0eWxlLFxuICAgICAgICAgIHN1cHBvcnRlZCA9IGZhbHNlLFxuICAgICAgICAgIHByb3BlcnR5ID0gJ3RyYW5zaXRpb24nO1xuXG4gICAgICBpZiAocHJvcGVydHkgaW4gc3R5bGUpIHtcbiAgICAgICAgc3VwcG9ydGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHByZWZpeGVzID0gWydtb3onLCAnd2Via2l0JywgJ28nLCAnbXMnXSxcbiAgICAgICAgICAgICAgcHJlZml4ID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBpID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnN1YnN0cigxKTtcbiAgICAgICAgICBzdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgICAgICAgICAgIGlmIChwcmVmaXggKyBwcm9wZXJ0eSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KCk7XG4gICAgICAgICAgcHJvcGVydHkgPSBzdXBwb3J0ZWQgPyAnLScgKyBwcmVmaXgudG9Mb3dlckNhc2UoKSArICctJyArIHByb3BlcnR5LnRvTG93ZXJDYXNlKCkgOiBudWxsO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdXBwb3J0ZWQ6IHN1cHBvcnRlZCxcbiAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5XG4gICAgICB9O1xuICAgIH0oKVxuICB9O1xuXG4gIHZhciAkJDIgPSBqUXVlcnk7XG5cbiAgdmFyIGJvZHlBbmltYXRpb25DbGFzcyA9ICdzaWRyLWFuaW1hdGluZyc7XG4gIHZhciBvcGVuQWN0aW9uID0gJ29wZW4nO1xuICB2YXIgY2xvc2VBY3Rpb24gPSAnY2xvc2UnO1xuICB2YXIgdHJhbnNpdGlvbkVuZEV2ZW50ID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnO1xuICB2YXIgTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNZW51KG5hbWUpIHtcbiAgICAgIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayh0aGlzLCBNZW51KTtcblxuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuaXRlbSA9ICQkMignIycgKyBuYW1lKTtcbiAgICAgIHRoaXMub3BlbkNsYXNzID0gbmFtZSA9PT0gJ3NpZHInID8gJ3NpZHItb3BlbicgOiAnc2lkci1vcGVuICcgKyBuYW1lICsgJy1vcGVuJztcbiAgICAgIHRoaXMubWVudVdpZHRoID0gdGhpcy5pdGVtLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgICB0aGlzLnNwZWVkID0gdGhpcy5pdGVtLmRhdGEoJ3NwZWVkJyk7XG4gICAgICB0aGlzLnNpZGUgPSB0aGlzLml0ZW0uZGF0YSgnc2lkZScpO1xuICAgICAgdGhpcy5kaXNwbGFjZSA9IHRoaXMuaXRlbS5kYXRhKCdkaXNwbGFjZScpO1xuICAgICAgdGhpcy50aW1pbmcgPSB0aGlzLml0ZW0uZGF0YSgndGltaW5nJyk7XG4gICAgICB0aGlzLm1ldGhvZCA9IHRoaXMuaXRlbS5kYXRhKCdtZXRob2QnKTtcbiAgICAgIHRoaXMub25PcGVuQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25PcGVuJyk7XG4gICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbkNsb3NlJyk7XG4gICAgICB0aGlzLm9uT3BlbkVuZENhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uT3BlbkVuZCcpO1xuICAgICAgdGhpcy5vbkNsb3NlRW5kQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25DbG9zZUVuZCcpO1xuICAgICAgdGhpcy5ib2R5ID0gJCQyKHRoaXMuaXRlbS5kYXRhKCdib2R5JykpO1xuICAgIH1cblxuICAgIGJhYmVsSGVscGVycy5jcmVhdGVDbGFzcyhNZW51LCBbe1xuICAgICAga2V5OiAnZ2V0QW5pbWF0aW9uJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBbmltYXRpb24oYWN0aW9uLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSB7fSxcbiAgICAgICAgICAgIHByb3AgPSB0aGlzLnNpZGU7XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ29wZW4nICYmIGVsZW1lbnQgPT09ICdib2R5Jykge1xuICAgICAgICAgIGFuaW1hdGlvbltwcm9wXSA9IHRoaXMubWVudVdpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdjbG9zZScgJiYgZWxlbWVudCA9PT0gJ21lbnUnKSB7XG4gICAgICAgICAgYW5pbWF0aW9uW3Byb3BdID0gJy0nICsgdGhpcy5tZW51V2lkdGggKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFuaW1hdGlvbltwcm9wXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYW5pbWF0aW9uO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3ByZXBhcmVCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcmVwYXJlQm9keShhY3Rpb24pIHtcbiAgICAgICAgdmFyIHByb3AgPSBhY3Rpb24gPT09ICdvcGVuJyA/ICdoaWRkZW4nIDogJyc7XG5cbiAgICAgICAgLy8gUHJlcGFyZSBwYWdlIGlmIGNvbnRhaW5lciBpcyBib2R5XG4gICAgICAgIGlmICh0aGlzLmJvZHkuaXMoJ2JvZHknKSkge1xuICAgICAgICAgIHZhciAkaHRtbCA9ICQkMignaHRtbCcpLFxuICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkaHRtbC5zY3JvbGxUb3AoKTtcblxuICAgICAgICAgICRodG1sLmNzcygnb3ZlcmZsb3cteCcsIHByb3ApLnNjcm9sbFRvcChzY3JvbGxUb3ApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb3BlbkJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW5Cb2R5KCkge1xuICAgICAgICBpZiAodGhpcy5kaXNwbGFjZSkge1xuICAgICAgICAgIHZhciB0cmFuc2l0aW9ucyA9IGhlbHBlci50cmFuc2l0aW9ucyxcbiAgICAgICAgICAgICAgJGJvZHkgPSB0aGlzLmJvZHk7XG5cbiAgICAgICAgICBpZiAodHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAkYm9keS5jc3ModHJhbnNpdGlvbnMucHJvcGVydHksIHRoaXMuc2lkZSArICcgJyArIHRoaXMuc3BlZWQgLyAxMDAwICsgJ3MgJyArIHRoaXMudGltaW5nKS5jc3ModGhpcy5zaWRlLCAwKS5jc3Moe1xuICAgICAgICAgICAgICB3aWR0aDogJGJvZHkud2lkdGgoKSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGJvZHkuY3NzKHRoaXMuc2lkZSwgdGhpcy5tZW51V2lkdGggKyAncHgnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGJvZHlBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihvcGVuQWN0aW9uLCAnYm9keScpO1xuXG4gICAgICAgICAgICAkYm9keS5jc3Moe1xuICAgICAgICAgICAgICB3aWR0aDogJGJvZHkud2lkdGgoKSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgIH0pLmFuaW1hdGUoYm9keUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbkNsb3NlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25DbG9zZUJvZHkoKSB7XG4gICAgICAgIHZhciB0cmFuc2l0aW9ucyA9IGhlbHBlci50cmFuc2l0aW9ucyxcbiAgICAgICAgICAgIHJlc2V0U3R5bGVzID0ge1xuICAgICAgICAgIHdpZHRoOiAnJyxcbiAgICAgICAgICBwb3NpdGlvbjogJycsXG4gICAgICAgICAgcmlnaHQ6ICcnLFxuICAgICAgICAgIGxlZnQ6ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgIHJlc2V0U3R5bGVzW3RyYW5zaXRpb25zLnByb3BlcnR5XSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2R5LmNzcyhyZXNldFN0eWxlcykudW5iaW5kKHRyYW5zaXRpb25FbmRFdmVudCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2xvc2VCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZUJvZHkoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzcGxhY2UpIHtcbiAgICAgICAgICBpZiAoaGVscGVyLnRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgICAgdGhpcy5ib2R5LmNzcyh0aGlzLnNpZGUsIDApLm9uZSh0cmFuc2l0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXMub25DbG9zZUJvZHkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYm9keUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKGNsb3NlQWN0aW9uLCAnYm9keScpO1xuXG4gICAgICAgICAgICB0aGlzLmJvZHkuYW5pbWF0ZShib2R5QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5vbkNsb3NlQm9keSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdtb3ZlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZUJvZHkoYWN0aW9uKSB7XG4gICAgICAgIGlmIChhY3Rpb24gPT09IG9wZW5BY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLm9wZW5Cb2R5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbG9zZUJvZHkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29uT3Blbk1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uT3Blbk1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLm5hbWU7XG5cbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2lkclN0YXR1cy5vcGVuZWQgPSBuYW1lO1xuXG4gICAgICAgIHRoaXMuaXRlbS51bmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50KTtcblxuICAgICAgICB0aGlzLmJvZHkucmVtb3ZlQ2xhc3MoYm9keUFuaW1hdGlvbkNsYXNzKS5hZGRDbGFzcyh0aGlzLm9wZW5DbGFzcyk7XG5cbiAgICAgICAgdGhpcy5vbk9wZW5FbmRDYWxsYmFjaygpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjYWxsYmFjayhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29wZW5NZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuTWVudShjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICB2YXIgJGl0ZW0gPSB0aGlzLml0ZW07XG5cbiAgICAgICAgaWYgKGhlbHBlci50cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAkaXRlbS5jc3ModGhpcy5zaWRlLCAwKS5vbmUodHJhbnNpdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczIub25PcGVuTWVudShjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1lbnVBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihvcGVuQWN0aW9uLCAnbWVudScpO1xuXG4gICAgICAgICAgJGl0ZW0uY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJykuYW5pbWF0ZShtZW51QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgX3RoaXMyLm9uT3Blbk1lbnUoY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25DbG9zZU1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2xvc2VNZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaXRlbS5jc3Moe1xuICAgICAgICAgIGxlZnQ6ICcnLFxuICAgICAgICAgIHJpZ2h0OiAnJ1xuICAgICAgICB9KS51bmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50KTtcbiAgICAgICAgJCQyKCdodG1sJykuY3NzKCdvdmVyZmxvdy14JywgJycpO1xuXG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNpZHJTdGF0dXMub3BlbmVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5ib2R5LnJlbW92ZUNsYXNzKGJvZHlBbmltYXRpb25DbGFzcykucmVtb3ZlQ2xhc3ModGhpcy5vcGVuQ2xhc3MpO1xuXG4gICAgICAgIHRoaXMub25DbG9zZUVuZENhbGxiYWNrKCk7XG5cbiAgICAgICAgLy8gQ2FsbGJhY2tcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrKG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2xvc2VNZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZU1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW07XG5cbiAgICAgICAgaWYgKGhlbHBlci50cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICBpdGVtLmNzcyh0aGlzLnNpZGUsICcnKS5vbmUodHJhbnNpdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczMub25DbG9zZU1lbnUoY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtZW51QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24oY2xvc2VBY3Rpb24sICdtZW51Jyk7XG5cbiAgICAgICAgICBpdGVtLmFuaW1hdGUobWVudUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWQsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgICAgICAgIF90aGlzMy5vbkNsb3NlTWVudSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnbW92ZU1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmVNZW51KGFjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ib2R5LmFkZENsYXNzKGJvZHlBbmltYXRpb25DbGFzcyk7XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gb3BlbkFjdGlvbikge1xuICAgICAgICAgIHRoaXMub3Blbk1lbnUoY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xvc2VNZW51KGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21vdmUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmUoYWN0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBMb2NrIHNpZHJcbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucHJlcGFyZUJvZHkoYWN0aW9uKTtcbiAgICAgICAgdGhpcy5tb3ZlQm9keShhY3Rpb24pO1xuICAgICAgICB0aGlzLm1vdmVNZW51KGFjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29wZW4nLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW4oY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgaXMgYWxyZWFkeSBvcGVuZWQgb3IgbW92aW5nXG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCA9PT0gdGhpcy5uYW1lIHx8IHNpZHJTdGF0dXMubW92aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgYW5vdGhlciBtZW51IG9wZW5lZCBjbG9zZSBmaXJzdFxuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgdmFyIGFscmVhZHlPcGVuZWRNZW51ID0gbmV3IE1lbnUoc2lkclN0YXR1cy5vcGVuZWQpO1xuXG4gICAgICAgICAgYWxyZWFkeU9wZW5lZE1lbnUuY2xvc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM0Lm9wZW4oY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlKCdvcGVuJywgY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIG9uT3BlbiBjYWxsYmFja1xuICAgICAgICB0aGlzLm9uT3BlbkNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2xvc2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGlzIGFscmVhZHkgY2xvc2VkIG9yIG1vdmluZ1xuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgIT09IHRoaXMubmFtZSB8fCBzaWRyU3RhdHVzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW92ZSgnY2xvc2UnLCBjYWxsYmFjayk7XG5cbiAgICAgICAgLy8gb25DbG9zZSBjYWxsYmFja1xuICAgICAgICB0aGlzLm9uQ2xvc2VDYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3RvZ2dsZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCA9PT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZShjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcGVuKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gTWVudTtcbiAgfSgpO1xuXG4gIHZhciAkJDEgPSBqUXVlcnk7XG5cbiAgZnVuY3Rpb24gZXhlY3V0ZShhY3Rpb24sIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNpZHIgPSBuZXcgTWVudShuYW1lKTtcblxuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdvcGVuJzpcbiAgICAgICAgc2lkci5vcGVuKGNhbGxiYWNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjbG9zZSc6XG4gICAgICAgIHNpZHIuY2xvc2UoY2FsbGJhY2spO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RvZ2dsZSc6XG4gICAgICAgIHNpZHIudG9nZ2xlKGNhbGxiYWNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAkJDEuZXJyb3IoJ01ldGhvZCAnICsgYWN0aW9uICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkuc2lkcicpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgaTtcbiAgdmFyICQgPSBqUXVlcnk7XG4gIHZhciBwdWJsaWNNZXRob2RzID0gWydvcGVuJywgJ2Nsb3NlJywgJ3RvZ2dsZSddO1xuICB2YXIgbWV0aG9kTmFtZTtcbiAgdmFyIG1ldGhvZHMgPSB7fTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIGdldE1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgICAgLy8gQ2hlY2sgYXJndW1lbnRzXG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuYW1lO1xuICAgICAgICBuYW1lID0gJ3NpZHInO1xuICAgICAgfSBlbHNlIGlmICghbmFtZSkge1xuICAgICAgICBuYW1lID0gJ3NpZHInO1xuICAgICAgfVxuXG4gICAgICBleGVjdXRlKG1ldGhvZE5hbWUsIG5hbWUsIGNhbGxiYWNrKTtcbiAgICB9O1xuICB9O1xuICBmb3IgKGkgPSAwOyBpIDwgcHVibGljTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgIG1ldGhvZE5hbWUgPSBwdWJsaWNNZXRob2RzW2ldO1xuICAgIG1ldGhvZHNbbWV0aG9kTmFtZV0gPSBnZXRNZXRob2QobWV0aG9kTmFtZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzaWRyKG1ldGhvZCkge1xuICAgIGlmIChtZXRob2QgPT09ICdzdGF0dXMnKSB7XG4gICAgICByZXR1cm4gc2lkclN0YXR1cztcbiAgICB9IGVsc2UgaWYgKG1ldGhvZHNbbWV0aG9kXSkge1xuICAgICAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycgfHwgIW1ldGhvZCkge1xuICAgICAgcmV0dXJuIG1ldGhvZHMudG9nZ2xlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQuZXJyb3IoJ01ldGhvZCAnICsgbWV0aG9kICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkuc2lkcicpO1xuICAgIH1cbiAgfVxuXG4gIHZhciAkJDMgPSBqUXVlcnk7XG5cbiAgZnVuY3Rpb24gZmlsbENvbnRlbnQoJHNpZGVNZW51LCBzZXR0aW5ncykge1xuICAgIC8vIFRoZSBtZW51IGNvbnRlbnRcbiAgICBpZiAodHlwZW9mIHNldHRpbmdzLnNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIG5ld0NvbnRlbnQgPSBzZXR0aW5ncy5zb3VyY2UobmFtZSk7XG5cbiAgICAgICRzaWRlTWVudS5odG1sKG5ld0NvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldHRpbmdzLnNvdXJjZSA9PT0gJ3N0cmluZycgJiYgaGVscGVyLmlzVXJsKHNldHRpbmdzLnNvdXJjZSkpIHtcbiAgICAgICQkMy5nZXQoc2V0dGluZ3Muc291cmNlLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAkc2lkZU1lbnUuaHRtbChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldHRpbmdzLnNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBodG1sQ29udGVudCA9ICcnLFxuICAgICAgICAgIHNlbGVjdG9ycyA9IHNldHRpbmdzLnNvdXJjZS5zcGxpdCgnLCcpO1xuXG4gICAgICAkJDMuZWFjaChzZWxlY3RvcnMsIGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICBodG1sQ29udGVudCArPSAnPGRpdiBjbGFzcz1cInNpZHItaW5uZXJcIj4nICsgJCQzKGVsZW1lbnQpLmh0bWwoKSArICc8L2Rpdj4nO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlbmFtaW5nIGlkcyBhbmQgY2xhc3Nlc1xuICAgICAgaWYgKHNldHRpbmdzLnJlbmFtaW5nKSB7XG4gICAgICAgIHZhciAkaHRtbENvbnRlbnQgPSAkJDMoJzxkaXYgLz4nKS5odG1sKGh0bWxDb250ZW50KTtcblxuICAgICAgICAkaHRtbENvbnRlbnQuZmluZCgnKicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyICRlbGVtZW50ID0gJCQzKGVsZW1lbnQpO1xuXG4gICAgICAgICAgaGVscGVyLmFkZFByZWZpeGVzKCRlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGh0bWxDb250ZW50ID0gJGh0bWxDb250ZW50Lmh0bWwoKTtcbiAgICAgIH1cblxuICAgICAgJHNpZGVNZW51Lmh0bWwoaHRtbENvbnRlbnQpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3Muc291cmNlICE9PSBudWxsKSB7XG4gICAgICAkJDMuZXJyb3IoJ0ludmFsaWQgU2lkciBTb3VyY2UnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHNpZGVNZW51O1xuICB9XG5cbiAgZnVuY3Rpb24gZm5TaWRyKG9wdGlvbnMpIHtcbiAgICB2YXIgdHJhbnNpdGlvbnMgPSBoZWxwZXIudHJhbnNpdGlvbnMsXG4gICAgICAgIHNldHRpbmdzID0gJCQzLmV4dGVuZCh7XG4gICAgICBuYW1lOiAnc2lkcicsIC8vIE5hbWUgZm9yIHRoZSAnc2lkcidcbiAgICAgIHNwZWVkOiAyMDAsIC8vIEFjY2VwdHMgc3RhbmRhcmQgalF1ZXJ5IGVmZmVjdHMgc3BlZWRzIChpLmUuIGZhc3QsIG5vcm1hbCBvciBtaWxsaXNlY29uZHMpXG4gICAgICBzaWRlOiAnbGVmdCcsIC8vIEFjY2VwdHMgJ2xlZnQnIG9yICdyaWdodCdcbiAgICAgIHNvdXJjZTogbnVsbCwgLy8gT3ZlcnJpZGUgdGhlIHNvdXJjZSBvZiB0aGUgY29udGVudC5cbiAgICAgIHJlbmFtaW5nOiB0cnVlLCAvLyBUaGUgaWRzIGFuZCBjbGFzc2VzIHdpbGwgYmUgcHJlcGVuZGVkIHdpdGggYSBwcmVmaXggd2hlbiBsb2FkaW5nIGV4aXN0ZW50IGNvbnRlbnRcbiAgICAgIGJvZHk6ICdib2R5JywgLy8gUGFnZSBjb250YWluZXIgc2VsZWN0b3IsXG4gICAgICBkaXNwbGFjZTogdHJ1ZSwgLy8gRGlzcGxhY2UgdGhlIGJvZHkgY29udGVudCBvciBub3RcbiAgICAgIHRpbWluZzogJ2Vhc2UnLCAvLyBUaW1pbmcgZnVuY3Rpb24gZm9yIENTUyB0cmFuc2l0aW9uc1xuICAgICAgbWV0aG9kOiAndG9nZ2xlJywgLy8gVGhlIG1ldGhvZCB0byBjYWxsIHdoZW4gZWxlbWVudCBpcyBjbGlja2VkXG4gICAgICBiaW5kOiAndG91Y2hzdGFydCBjbGljaycsIC8vIFRoZSBldmVudChzKSB0byB0cmlnZ2VyIHRoZSBtZW51XG4gICAgICBvbk9wZW46IGZ1bmN0aW9uIG9uT3BlbigpIHt9LFxuICAgICAgLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIHN0YXJ0IG9wZW5pbmdcbiAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uIG9uQ2xvc2UoKSB7fSxcbiAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2lkciBzdGFydCBjbG9zaW5nXG4gICAgICBvbk9wZW5FbmQ6IGZ1bmN0aW9uIG9uT3BlbkVuZCgpIHt9LFxuICAgICAgLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIGVuZCBvcGVuaW5nXG4gICAgICBvbkNsb3NlRW5kOiBmdW5jdGlvbiBvbkNsb3NlRW5kKCkge30gLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIGVuZCBjbG9zaW5nXG5cbiAgICB9LCBvcHRpb25zKSxcbiAgICAgICAgbmFtZSA9IHNldHRpbmdzLm5hbWUsXG4gICAgICAgICRzaWRlTWVudSA9ICQkMygnIycgKyBuYW1lKTtcblxuICAgIC8vIElmIHRoZSBzaWRlIG1lbnUgZG8gbm90IGV4aXN0IGNyZWF0ZSBpdFxuICAgIGlmICgkc2lkZU1lbnUubGVuZ3RoID09PSAwKSB7XG4gICAgICAkc2lkZU1lbnUgPSAkJDMoJzxkaXYgLz4nKS5hdHRyKCdpZCcsIG5hbWUpLmFwcGVuZFRvKCQkMygnYm9keScpKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdHJhbnNpdGlvbiB0byBtZW51IGlmIGFyZSBzdXBwb3J0ZWRcbiAgICBpZiAodHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAkc2lkZU1lbnUuY3NzKHRyYW5zaXRpb25zLnByb3BlcnR5LCBzZXR0aW5ncy5zaWRlICsgJyAnICsgc2V0dGluZ3Muc3BlZWQgLyAxMDAwICsgJ3MgJyArIHNldHRpbmdzLnRpbWluZyk7XG4gICAgfVxuXG4gICAgLy8gQWRkaW5nIHN0eWxlcyBhbmQgb3B0aW9uc1xuICAgICRzaWRlTWVudS5hZGRDbGFzcygnc2lkcicpLmFkZENsYXNzKHNldHRpbmdzLnNpZGUpLmRhdGEoe1xuICAgICAgc3BlZWQ6IHNldHRpbmdzLnNwZWVkLFxuICAgICAgc2lkZTogc2V0dGluZ3Muc2lkZSxcbiAgICAgIGJvZHk6IHNldHRpbmdzLmJvZHksXG4gICAgICBkaXNwbGFjZTogc2V0dGluZ3MuZGlzcGxhY2UsXG4gICAgICB0aW1pbmc6IHNldHRpbmdzLnRpbWluZyxcbiAgICAgIG1ldGhvZDogc2V0dGluZ3MubWV0aG9kLFxuICAgICAgb25PcGVuOiBzZXR0aW5ncy5vbk9wZW4sXG4gICAgICBvbkNsb3NlOiBzZXR0aW5ncy5vbkNsb3NlLFxuICAgICAgb25PcGVuRW5kOiBzZXR0aW5ncy5vbk9wZW5FbmQsXG4gICAgICBvbkNsb3NlRW5kOiBzZXR0aW5ncy5vbkNsb3NlRW5kXG4gICAgfSk7XG5cbiAgICAkc2lkZU1lbnUgPSBmaWxsQ29udGVudCgkc2lkZU1lbnUsIHNldHRpbmdzKTtcblxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCQzKHRoaXMpLFxuICAgICAgICAgIGRhdGEgPSAkdGhpcy5kYXRhKCdzaWRyJyksXG4gICAgICAgICAgZmxhZyA9IGZhbHNlO1xuXG4gICAgICAvLyBJZiB0aGUgcGx1Z2luIGhhc24ndCBiZWVuIGluaXRpYWxpemVkIHlldFxuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNpZHJTdGF0dXMub3BlbmVkID0gZmFsc2U7XG5cbiAgICAgICAgJHRoaXMuZGF0YSgnc2lkcicsIG5hbWUpO1xuXG4gICAgICAgICR0aGlzLmJpbmQoc2V0dGluZ3MuYmluZCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmICghZmxhZykge1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICBzaWRyKHNldHRpbmdzLm1ldGhvZCwgbmFtZSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkuc2lkciA9IHNpZHI7XG4gIGpRdWVyeS5mbi5zaWRyID0gZm5TaWRyO1xuXG59KCkpOyIsIiFmdW5jdGlvbihlKXt2YXIgdDtlLmZuLnNsaW5reT1mdW5jdGlvbihhKXt2YXIgcz1lLmV4dGVuZCh7bGFiZWw6XCJCYWNrXCIsdGl0bGU6ITEsc3BlZWQ6MzAwLHJlc2l6ZTohMH0sYSksaT1lKHRoaXMpLG49aS5jaGlsZHJlbigpLmZpcnN0KCk7aS5hZGRDbGFzcyhcInNsaW5reS1tZW51XCIpO3ZhciByPWZ1bmN0aW9uKGUsdCl7dmFyIGE9TWF0aC5yb3VuZChwYXJzZUludChuLmdldCgwKS5zdHlsZS5sZWZ0KSl8fDA7bi5jc3MoXCJsZWZ0XCIsYS0xMDAqZStcIiVcIiksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmc2V0VGltZW91dCh0LHMuc3BlZWQpfSxsPWZ1bmN0aW9uKGUpe2kuaGVpZ2h0KGUub3V0ZXJIZWlnaHQoKSl9LGQ9ZnVuY3Rpb24oZSl7aS5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsZStcIm1zXCIpLG4uY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLGUrXCJtc1wiKX07aWYoZChzLnNwZWVkKSxlKFwiYSArIHVsXCIsaSkucHJldigpLmFkZENsYXNzKFwibmV4dFwiKSxlKFwibGkgPiB1bFwiLGkpLnByZXBlbmQoJzxsaSBjbGFzcz1cImhlYWRlclwiPicpLHMudGl0bGU9PT0hMCYmZShcImxpID4gdWxcIixpKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9ZSh0aGlzKS5wYXJlbnQoKS5maW5kKFwiYVwiKS5maXJzdCgpLnRleHQoKSxhPWUoXCI8aDI+XCIpLnRleHQodCk7ZShcIj4gLmhlYWRlclwiLHRoaXMpLmFwcGVuZChhKX0pLHMudGl0bGV8fHMubGFiZWwhPT0hMCl7dmFyIG89ZShcIjxhPlwiKS50ZXh0KHMubGFiZWwpLnByb3AoXCJocmVmXCIsXCIjXCIpLmFkZENsYXNzKFwiYmFja1wiKTtlKFwiLmhlYWRlclwiLGkpLmFwcGVuZChvKX1lbHNlIGUoXCJsaSA+IHVsXCIsaSkuZWFjaChmdW5jdGlvbigpe3ZhciB0PWUodGhpcykucGFyZW50KCkuZmluZChcImFcIikuZmlyc3QoKS50ZXh0KCksYT1lKFwiPGE+XCIpLnRleHQodCkucHJvcChcImhyZWZcIixcIiNcIikuYWRkQ2xhc3MoXCJiYWNrXCIpO2UoXCI+IC5oZWFkZXJcIix0aGlzKS5hcHBlbmQoYSl9KTtlKFwiYVwiLGkpLm9uKFwiY2xpY2tcIixmdW5jdGlvbihhKXtpZighKHQrcy5zcGVlZD5EYXRlLm5vdygpKSl7dD1EYXRlLm5vdygpO3ZhciBuPWUodGhpcyk7LyMvLnRlc3QodGhpcy5ocmVmKSYmYS5wcmV2ZW50RGVmYXVsdCgpLG4uaGFzQ2xhc3MoXCJuZXh0XCIpPyhpLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLG4ubmV4dCgpLnNob3coKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxyKDEpLHMucmVzaXplJiZsKG4ubmV4dCgpKSk6bi5oYXNDbGFzcyhcImJhY2tcIikmJihyKC0xLGZ1bmN0aW9uKCl7aS5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxuLnBhcmVudCgpLnBhcmVudCgpLmhpZGUoKS5wYXJlbnRzVW50aWwoaSxcInVsXCIpLmZpcnN0KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIil9KSxzLnJlc2l6ZSYmbChuLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudHNVbnRpbChpLFwidWxcIikpKX19KSx0aGlzLmp1bXA9ZnVuY3Rpb24odCxhKXt0PWUodCk7dmFyIG49aS5maW5kKFwiLmFjdGl2ZVwiKTtuPW4ubGVuZ3RoPjA/bi5wYXJlbnRzVW50aWwoaSxcInVsXCIpLmxlbmd0aDowLGkuZmluZChcInVsXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmhpZGUoKTt2YXIgbz10LnBhcmVudHNVbnRpbChpLFwidWxcIik7by5zaG93KCksdC5zaG93KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIiksYT09PSExJiZkKDApLHIoby5sZW5ndGgtbikscy5yZXNpemUmJmwodCksYT09PSExJiZkKHMuc3BlZWQpfSx0aGlzLmhvbWU9ZnVuY3Rpb24odCl7dD09PSExJiZkKDApO3ZhciBhPWkuZmluZChcIi5hY3RpdmVcIiksbj1hLnBhcmVudHNVbnRpbChpLFwibGlcIikubGVuZ3RoO24+MCYmKHIoLW4sZnVuY3Rpb24oKXthLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpfSkscy5yZXNpemUmJmwoZShhLnBhcmVudHNVbnRpbChpLFwibGlcIikuZ2V0KG4tMSkpLnBhcmVudCgpKSksdD09PSExJiZkKHMuc3BlZWQpfSx0aGlzLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlKFwiLmhlYWRlclwiLGkpLnJlbW92ZSgpLGUoXCJhXCIsaSkucmVtb3ZlQ2xhc3MoXCJuZXh0XCIpLm9mZihcImNsaWNrXCIpLGkucmVtb3ZlQ2xhc3MoXCJzbGlua3ktbWVudVwiKS5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXCJcIiksbi5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXCJcIil9O3ZhciBjPWkuZmluZChcIi5hY3RpdmVcIik7cmV0dXJuIGMubGVuZ3RoPjAmJihjLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLHRoaXMuanVtcChjLCExKSksdGhpc319KGpRdWVyeSk7IiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgQWpheE1vbml0b3IsIEJhciwgRG9jdW1lbnRNb25pdG9yLCBFbGVtZW50TW9uaXRvciwgRWxlbWVudFRyYWNrZXIsIEV2ZW50TGFnTW9uaXRvciwgRXZlbnRlZCwgRXZlbnRzLCBOb1RhcmdldEVycm9yLCBQYWNlLCBSZXF1ZXN0SW50ZXJjZXB0LCBTT1VSQ0VfS0VZUywgU2NhbGVyLCBTb2NrZXRSZXF1ZXN0VHJhY2tlciwgWEhSUmVxdWVzdFRyYWNrZXIsIGFuaW1hdGlvbiwgYXZnQW1wbGl0dWRlLCBiYXIsIGNhbmNlbEFuaW1hdGlvbiwgY2FuY2VsQW5pbWF0aW9uRnJhbWUsIGRlZmF1bHRPcHRpb25zLCBleHRlbmQsIGV4dGVuZE5hdGl2ZSwgZ2V0RnJvbURPTSwgZ2V0SW50ZXJjZXB0LCBoYW5kbGVQdXNoU3RhdGUsIGlnbm9yZVN0YWNrLCBpbml0LCBub3csIG9wdGlvbnMsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgcmVzdWx0LCBydW5BbmltYXRpb24sIHNjYWxlcnMsIHNob3VsZElnbm9yZVVSTCwgc2hvdWxkVHJhY2ssIHNvdXJjZSwgc291cmNlcywgdW5pU2NhbGVyLCBfV2ViU29ja2V0LCBfWERvbWFpblJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCwgX2ksIF9pbnRlcmNlcHQsIF9sZW4sIF9wdXNoU3RhdGUsIF9yZWYsIF9yZWYxLCBfcmVwbGFjZVN0YXRlLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjYXRjaHVwVGltZTogMTAwLFxuICAgIGluaXRpYWxSYXRlOiAuMDMsXG4gICAgbWluVGltZTogMjUwLFxuICAgIGdob3N0VGltZTogMTAwLFxuICAgIG1heFByb2dyZXNzUGVyRnJhbWU6IDIwLFxuICAgIGVhc2VGYWN0b3I6IDEuMjUsXG4gICAgc3RhcnRPblBhZ2VMb2FkOiB0cnVlLFxuICAgIHJlc3RhcnRPblB1c2hTdGF0ZTogdHJ1ZSxcbiAgICByZXN0YXJ0T25SZXF1ZXN0QWZ0ZXI6IDUwMCxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBlbGVtZW50czoge1xuICAgICAgY2hlY2tJbnRlcnZhbDogMTAwLFxuICAgICAgc2VsZWN0b3JzOiBbJ2JvZHknXVxuICAgIH0sXG4gICAgZXZlbnRMYWc6IHtcbiAgICAgIG1pblNhbXBsZXM6IDEwLFxuICAgICAgc2FtcGxlQ291bnQ6IDMsXG4gICAgICBsYWdUaHJlc2hvbGQ6IDNcbiAgICB9LFxuICAgIGFqYXg6IHtcbiAgICAgIHRyYWNrTWV0aG9kczogWydHRVQnXSxcbiAgICAgIHRyYWNrV2ViU29ja2V0czogdHJ1ZSxcbiAgICAgIGlnbm9yZVVSTHM6IFtdXG4gICAgfVxuICB9O1xuXG4gIG5vdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVmO1xuICAgIHJldHVybiAoX3JlZiA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCA/IHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlLm5vdygpIDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZiA6ICsobmV3IERhdGUpO1xuICB9O1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PSBudWxsKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCA1MCk7XG4gICAgfTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuICB9XG5cbiAgcnVuQW5pbWF0aW9uID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgbGFzdCwgdGljaztcbiAgICBsYXN0ID0gbm93KCk7XG4gICAgdGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRpZmY7XG4gICAgICBkaWZmID0gbm93KCkgLSBsYXN0O1xuICAgICAgaWYgKGRpZmYgPj0gMzMpIHtcbiAgICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgICByZXR1cm4gZm4oZGlmZiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCh0aWNrLCAzMyAtIGRpZmYpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHRpY2soKTtcbiAgfTtcblxuICByZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywga2V5LCBvYmo7XG4gICAgb2JqID0gYXJndW1lbnRzWzBdLCBrZXkgPSBhcmd1bWVudHNbMV0sIGFyZ3MgPSAzIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IFtdO1xuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XS5hcHBseShvYmosIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfVxuICB9O1xuXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXksIG91dCwgc291cmNlLCBzb3VyY2VzLCB2YWwsIF9pLCBfbGVuO1xuICAgIG91dCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBzb3VyY2VzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2VzW19pXTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKCFfX2hhc1Byb3AuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgIHZhbCA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIGlmICgob3V0W2tleV0gIT0gbnVsbCkgJiYgdHlwZW9mIG91dFtrZXldID09PSAnb2JqZWN0JyAmJiAodmFsICE9IG51bGwpICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBleHRlbmQob3V0W2tleV0sIHZhbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGF2Z0FtcGxpdHVkZSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciBjb3VudCwgc3VtLCB2LCBfaSwgX2xlbjtcbiAgICBzdW0gPSBjb3VudCA9IDA7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcnIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHYgPSBhcnJbX2ldO1xuICAgICAgc3VtICs9IE1hdGguYWJzKHYpO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAvIGNvdW50O1xuICB9O1xuXG4gIGdldEZyb21ET00gPSBmdW5jdGlvbihrZXksIGpzb24pIHtcbiAgICB2YXIgZGF0YSwgZSwgZWw7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBrZXkgPSAnb3B0aW9ucyc7XG4gICAgfVxuICAgIGlmIChqc29uID09IG51bGwpIHtcbiAgICAgIGpzb24gPSB0cnVlO1xuICAgIH1cbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1wYWNlLVwiICsga2V5ICsgXCJdXCIpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGFjZS1cIiArIGtleSk7XG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgZSA9IF9lcnJvcjtcbiAgICAgIHJldHVybiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5lcnJvcihcIkVycm9yIHBhcnNpbmcgaW5saW5lIHBhY2Ugb3B0aW9uc1wiLCBlKSA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgRXZlbnRlZCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudGVkKCkge31cblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgb25jZSkge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKG9uY2UgPT0gbnVsbCkge1xuICAgICAgICBvbmNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5iaW5kaW5ncyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICgoX2Jhc2UgPSB0aGlzLmJpbmRpbmdzKVtldmVudF0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW2V2ZW50XS5wdXNoKHtcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgY3R4OiBjdHgsXG4gICAgICAgIG9uY2U6IG9uY2VcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCkge1xuICAgICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICB2YXIgaSwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBpZiAoKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChoYW5kbGVyID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmJpbmRpbmdzW2V2ZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXS5oYW5kbGVyID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgY3R4LCBldmVudCwgaGFuZGxlciwgaSwgb25jZSwgX3JlZiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgaWYgKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5nc1tldmVudF1baV0sIGhhbmRsZXIgPSBfcmVmMS5oYW5kbGVyLCBjdHggPSBfcmVmMS5jdHgsIG9uY2UgPSBfcmVmMS5vbmNlO1xuICAgICAgICAgIGhhbmRsZXIuYXBwbHkoY3R4ICE9IG51bGwgPyBjdHggOiB0aGlzLCBhcmdzKTtcbiAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmJpbmRpbmdzW2V2ZW50XS5zcGxpY2UoaSwgMSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50ZWQ7XG5cbiAgfSkoKTtcblxuICBQYWNlID0gd2luZG93LlBhY2UgfHwge307XG5cbiAgd2luZG93LlBhY2UgPSBQYWNlO1xuXG4gIGV4dGVuZChQYWNlLCBFdmVudGVkLnByb3RvdHlwZSk7XG5cbiAgb3B0aW9ucyA9IFBhY2Uub3B0aW9ucyA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHdpbmRvdy5wYWNlT3B0aW9ucywgZ2V0RnJvbURPTSgpKTtcblxuICBfcmVmID0gWydhamF4JywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJywgJ2VsZW1lbnRzJ107XG4gIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgIHNvdXJjZSA9IF9yZWZbX2ldO1xuICAgIGlmIChvcHRpb25zW3NvdXJjZV0gPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnNbc291cmNlXSA9IGRlZmF1bHRPcHRpb25zW3NvdXJjZV07XG4gICAgfVxuICB9XG5cbiAgTm9UYXJnZXRFcnJvciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTm9UYXJnZXRFcnJvciwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIE5vVGFyZ2V0RXJyb3IoKSB7XG4gICAgICBfcmVmMSA9IE5vVGFyZ2V0RXJyb3IuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gX3JlZjE7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5vVGFyZ2V0RXJyb3I7XG5cbiAgfSkoRXJyb3IpO1xuXG4gIEJhciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBCYXIoKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICB9XG5cbiAgICBCYXIucHJvdG90eXBlLmdldEVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YXJnZXRFbGVtZW50O1xuICAgICAgaWYgKHRoaXMuZWwgPT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCk7XG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBOb1RhcmdldEVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc05hbWUgPSBcInBhY2UgcGFjZS1hY3RpdmVcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKC9wYWNlLWRvbmUvZywgJycpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtcnVubmluZyc7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzXCI+XFxuICA8ZGl2IGNsYXNzPVwicGFjZS1wcm9ncmVzcy1pbm5lclwiPjwvZGl2PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJwYWNlLWFjdGl2aXR5XCI+PC9kaXY+JztcbiAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuZmlyc3RDaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGFyZ2V0RWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbDtcbiAgICAgIGVsID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1hY3RpdmUnLCAnJyk7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyBwYWNlLWluYWN0aXZlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1ydW5uaW5nJywgJycpO1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1kb25lJztcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihwcm9nKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gcHJvZztcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5nZXRFbGVtZW50KCkpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbCA9IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCwga2V5LCBwcm9ncmVzc1N0ciwgdHJhbnNmb3JtLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIHRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyB0aGlzLnByb2dyZXNzICsgXCIlLCAwLCAwKVwiO1xuICAgICAgX3JlZjIgPSBbJ3dlYmtpdFRyYW5zZm9ybScsICdtc1RyYW5zZm9ybScsICd0cmFuc2Zvcm0nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBrZXkgPSBfcmVmMltfal07XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnN0eWxlW2tleV0gPSB0cmFuc2Zvcm07XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgfHwgdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8IDAgIT09IHRoaXMucHJvZ3Jlc3MgfCAwKSB7XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcy10ZXh0JywgXCJcIiArICh0aGlzLnByb2dyZXNzIHwgMCkgKyBcIiVcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzID49IDEwMCkge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gJzk5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9IHRoaXMucHJvZ3Jlc3MgPCAxMCA/IFwiMFwiIDogXCJcIjtcbiAgICAgICAgICBwcm9ncmVzc1N0ciArPSB0aGlzLnByb2dyZXNzIHwgMDtcbiAgICAgICAgfVxuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MnLCBcIlwiICsgcHJvZ3Jlc3NTdHIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID49IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJhcjtcblxuICB9KSgpO1xuXG4gIEV2ZW50cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudHMoKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgfVxuXG4gICAgRXZlbnRzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgICB2YXIgYmluZGluZywgX2osIF9sZW4xLCBfcmVmMiwgX3Jlc3VsdHM7XG4gICAgICBpZiAodGhpcy5iaW5kaW5nc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYyID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgYmluZGluZyA9IF9yZWYyW19qXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcuY2FsbCh0aGlzLCB2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW25hbWVdID09IG51bGwpIHtcbiAgICAgICAgX2Jhc2VbbmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW25hbWVdLnB1c2goZm4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRzO1xuXG4gIH0pKCk7XG5cbiAgX1hNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuXG4gIF9YRG9tYWluUmVxdWVzdCA9IHdpbmRvdy5YRG9tYWluUmVxdWVzdDtcblxuICBfV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcblxuICBleHRlbmROYXRpdmUgPSBmdW5jdGlvbih0bywgZnJvbSkge1xuICAgIHZhciBlLCBrZXksIF9yZXN1bHRzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gZnJvbS5wcm90b3R5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICgodG9ba2V5XSA9PSBudWxsKSAmJiB0eXBlb2YgZnJvbVtrZXldICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBrZXksIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbS5wcm90b3R5cGVba2V5XTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godG9ba2V5XSA9IGZyb20ucHJvdG90eXBlW2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgaWdub3JlU3RhY2sgPSBbXTtcblxuICBQYWNlLmlnbm9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCdpZ25vcmUnKTtcbiAgICByZXQgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgUGFjZS50cmFjayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCd0cmFjaycpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBzaG91bGRUcmFjayA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHZhciBfcmVmMjtcbiAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgIG1ldGhvZCA9ICdHRVQnO1xuICAgIH1cbiAgICBpZiAoaWdub3JlU3RhY2tbMF0gPT09ICd0cmFjaycpIHtcbiAgICAgIHJldHVybiAnZm9yY2UnO1xuICAgIH1cbiAgICBpZiAoIWlnbm9yZVN0YWNrLmxlbmd0aCAmJiBvcHRpb25zLmFqYXgpIHtcbiAgICAgIGlmIChtZXRob2QgPT09ICdzb2NrZXQnICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKF9yZWYyID0gbWV0aG9kLnRvVXBwZXJDYXNlKCksIF9faW5kZXhPZi5jYWxsKG9wdGlvbnMuYWpheC50cmFja01ldGhvZHMsIF9yZWYyKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgUmVxdWVzdEludGVyY2VwdCA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVxdWVzdEludGVyY2VwdCwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIFJlcXVlc3RJbnRlcmNlcHQoKSB7XG4gICAgICB2YXIgbW9uaXRvclhIUixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgUmVxdWVzdEludGVyY2VwdC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIG1vbml0b3JYSFIgPSBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIF9vcGVuO1xuICAgICAgICBfb3BlbiA9IHJlcS5vcGVuO1xuICAgICAgICByZXR1cm4gcmVxLm9wZW4gPSBmdW5jdGlvbih0eXBlLCB1cmwsIGFzeW5jKSB7XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKHR5cGUpKSB7XG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9vcGVuLmFwcGx5KHJlcSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbihmbGFncykge1xuICAgICAgICB2YXIgcmVxO1xuICAgICAgICByZXEgPSBuZXcgX1hNTEh0dHBSZXF1ZXN0KGZsYWdzKTtcbiAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWE1MSHR0cFJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICBpZiAoX1hEb21haW5SZXF1ZXN0ICE9IG51bGwpIHtcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICByZXEgPSBuZXcgX1hEb21haW5SZXF1ZXN0O1xuICAgICAgICAgIG1vbml0b3JYSFIocmVxKTtcbiAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWERvbWFpblJlcXVlc3QsIF9YRG9tYWluUmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICAgIGlmICgoX1dlYlNvY2tldCAhPSBudWxsKSAmJiBvcHRpb25zLmFqYXgudHJhY2tXZWJTb2NrZXRzKSB7XG4gICAgICAgIHdpbmRvdy5XZWJTb2NrZXQgPSBmdW5jdGlvbih1cmwsIHByb3RvY29scykge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgaWYgKHByb3RvY29scyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwsIHByb3RvY29scyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzaG91bGRUcmFjaygnc29ja2V0JykpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6ICdzb2NrZXQnLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcHJvdG9jb2xzOiBwcm90b2NvbHMsXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5XZWJTb2NrZXQsIF9XZWJTb2NrZXQpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlcXVlc3RJbnRlcmNlcHQ7XG5cbiAgfSkoRXZlbnRzKTtcblxuICBfaW50ZXJjZXB0ID0gbnVsbDtcblxuICBnZXRJbnRlcmNlcHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoX2ludGVyY2VwdCA9PSBudWxsKSB7XG4gICAgICBfaW50ZXJjZXB0ID0gbmV3IFJlcXVlc3RJbnRlcmNlcHQ7XG4gICAgfVxuICAgIHJldHVybiBfaW50ZXJjZXB0O1xuICB9O1xuXG4gIHNob3VsZElnbm9yZVVSTCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBwYXR0ZXJuLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgIF9yZWYyID0gb3B0aW9ucy5hamF4Lmlnbm9yZVVSTHM7XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICBwYXR0ZXJuID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodXJsLmluZGV4T2YocGF0dGVybikgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QodXJsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKF9hcmcpIHtcbiAgICB2YXIgYWZ0ZXIsIGFyZ3MsIHJlcXVlc3QsIHR5cGUsIHVybDtcbiAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFQYWNlLnJ1bm5pbmcgJiYgKG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyICE9PSBmYWxzZSB8fCBzaG91bGRUcmFjayh0eXBlKSA9PT0gJ2ZvcmNlJykpIHtcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBhZnRlciA9IG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIGFmdGVyID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgYWZ0ZXIgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGlsbEFjdGl2ZSwgX2osIF9sZW4xLCBfcmVmMiwgX3JlZjMsIF9yZXN1bHRzO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9IHJlcXVlc3QucmVhZHlTdGF0ZSA8IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RpbGxBY3RpdmUgPSAoMCA8IChfcmVmMiA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgJiYgX3JlZjIgPCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RpbGxBY3RpdmUpIHtcbiAgICAgICAgICBQYWNlLnJlc3RhcnQoKTtcbiAgICAgICAgICBfcmVmMyA9IFBhY2Uuc291cmNlcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgc291cmNlID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFqYXhNb25pdG9yKSB7XG4gICAgICAgICAgICAgIHNvdXJjZS53YXRjaC5hcHBseShzb3VyY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LCBhZnRlcik7XG4gICAgfVxuICB9KTtcblxuICBBamF4TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBBamF4TW9uaXRvcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMud2F0Y2guYXBwbHkoX3RoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBBamF4TW9uaXRvci5wcm90b3R5cGUud2F0Y2ggPSBmdW5jdGlvbihfYXJnKSB7XG4gICAgICB2YXIgcmVxdWVzdCwgdHJhY2tlciwgdHlwZSwgdXJsO1xuICAgICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XG4gICAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja2VyID0gbmV3IFhIUlJlcXVlc3RUcmFja2VyKHJlcXVlc3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMucHVzaCh0cmFja2VyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEFqYXhNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgWEhSUmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBzaXplLCBfaiwgX2xlbjEsIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIGlmICh3aW5kb3cuUHJvZ3Jlc3NFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBudWxsO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5wcm9ncmVzcyArICgxMDAgLSBfdGhpcy5wcm9ncmVzcykgLyAyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBfcmVmMiA9IFsnbG9hZCcsICdhYm9ydCcsICd0aW1lb3V0JywgJ2Vycm9yJ107XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xuICAgICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYzO1xuICAgICAgICAgIGlmICgoX3JlZjMgPSByZXF1ZXN0LnJlYWR5U3RhdGUpID09PSAwIHx8IF9yZWYzID09PSA0KSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gMykge1xuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSA1MDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFhIUlJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgU29ja2V0UmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBfaiwgX2xlbjEsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIF9yZWYyID0gWydlcnJvcicsICdvcGVuJ107XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFNvY2tldFJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudE1vbml0b3Iob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGVjdG9yLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RvcnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdG9ycyA9IFtdO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSBvcHRpb25zLnNlbGVjdG9ycztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBzZWxlY3RvciA9IF9yZWYyW19qXTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKG5ldyBFbGVtZW50VHJhY2tlcihzZWxlY3RvcikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBFbGVtZW50TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIEVsZW1lbnRUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSB7XG4gICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuY2hlY2soKTtcbiAgICB9XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNoZWNrKCk7XG4gICAgICAgIH0pLCBvcHRpb25zLmVsZW1lbnRzLmNoZWNrSW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgfTtcblxuICAgIHJldHVybiBFbGVtZW50VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIERvY3VtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBEb2N1bWVudE1vbml0b3IucHJvdG90eXBlLnN0YXRlcyA9IHtcbiAgICAgIGxvYWRpbmc6IDAsXG4gICAgICBpbnRlcmFjdGl2ZTogNTAsXG4gICAgICBjb21wbGV0ZTogMTAwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIERvY3VtZW50TW9uaXRvcigpIHtcbiAgICAgIHZhciBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IChfcmVmMiA9IHRoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdKSAhPSBudWxsID8gX3JlZjIgOiAxMDA7XG4gICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0gIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9jdW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRMYWdNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50TGFnTW9uaXRvcigpIHtcbiAgICAgIHZhciBhdmcsIGludGVydmFsLCBsYXN0LCBwb2ludHMsIHNhbXBsZXMsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgYXZnID0gMDtcbiAgICAgIHNhbXBsZXMgPSBbXTtcbiAgICAgIHBvaW50cyA9IDA7XG4gICAgICBsYXN0ID0gbm93KCk7XG4gICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlmZjtcbiAgICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdCAtIDUwO1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHNhbXBsZXMucHVzaChkaWZmKTtcbiAgICAgICAgaWYgKHNhbXBsZXMubGVuZ3RoID4gb3B0aW9ucy5ldmVudExhZy5zYW1wbGVDb3VudCkge1xuICAgICAgICAgIHNhbXBsZXMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhdmcgPSBhdmdBbXBsaXR1ZGUoc2FtcGxlcyk7XG4gICAgICAgIGlmICgrK3BvaW50cyA+PSBvcHRpb25zLmV2ZW50TGFnLm1pblNhbXBsZXMgJiYgYXZnIDwgb3B0aW9ucy5ldmVudExhZy5sYWdUaHJlc2hvbGQpIHtcbiAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICByZXR1cm4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogKDMgLyAoYXZnICsgMykpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEV2ZW50TGFnTW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIFNjYWxlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTY2FsZXIoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMubGFzdCA9IHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgIHRoaXMucmF0ZSA9IG9wdGlvbnMuaW5pdGlhbFJhdGU7XG4gICAgICB0aGlzLmNhdGNodXAgPSAwO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMubGFzdFByb2dyZXNzID0gMDtcbiAgICAgIGlmICh0aGlzLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNjYWxlci5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKGZyYW1lVGltZSwgdmFsKSB7XG4gICAgICB2YXIgc2NhbGluZztcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICB2YWwgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+PSAxMDApIHtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPT09IHRoaXMubGFzdCkge1xuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSArPSBmcmFtZVRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zaW5jZUxhc3RVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLnJhdGUgPSAodmFsIC0gdGhpcy5sYXN0KSAvIHRoaXMuc2luY2VMYXN0VXBkYXRlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2F0Y2h1cCA9ICh2YWwgLSB0aGlzLnByb2dyZXNzKSAvIG9wdGlvbnMuY2F0Y2h1cFRpbWU7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgICAgdGhpcy5sYXN0ID0gdmFsO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+IHRoaXMucHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyArPSB0aGlzLmNhdGNodXAgKiBmcmFtZVRpbWU7XG4gICAgICB9XG4gICAgICBzY2FsaW5nID0gMSAtIE1hdGgucG93KHRoaXMucHJvZ3Jlc3MgLyAxMDAsIG9wdGlvbnMuZWFzZUZhY3Rvcik7XG4gICAgICB0aGlzLnByb2dyZXNzICs9IHNjYWxpbmcgKiB0aGlzLnJhdGUgKiBmcmFtZVRpbWU7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4odGhpcy5sYXN0UHJvZ3Jlc3MgKyBvcHRpb25zLm1heFByb2dyZXNzUGVyRnJhbWUsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWF4KDAsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLmxhc3RQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjYWxlcjtcblxuICB9KSgpO1xuXG4gIHNvdXJjZXMgPSBudWxsO1xuXG4gIHNjYWxlcnMgPSBudWxsO1xuXG4gIGJhciA9IG51bGw7XG5cbiAgdW5pU2NhbGVyID0gbnVsbDtcblxuICBhbmltYXRpb24gPSBudWxsO1xuXG4gIGNhbmNlbEFuaW1hdGlvbiA9IG51bGw7XG5cbiAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG5cbiAgaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9wdGlvbnMucmVzdGFydE9uUHVzaFN0YXRlKSB7XG4gICAgICByZXR1cm4gUGFjZS5yZXN0YXJ0KCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgIT0gbnVsbCkge1xuICAgIF9wdXNoU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcHVzaFN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAod2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlICE9IG51bGwpIHtcbiAgICBfcmVwbGFjZVN0YXRlID0gd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlO1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICByZXR1cm4gX3JlcGxhY2VTdGF0ZS5hcHBseSh3aW5kb3cuaGlzdG9yeSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgU09VUkNFX0tFWVMgPSB7XG4gICAgYWpheDogQWpheE1vbml0b3IsXG4gICAgZWxlbWVudHM6IEVsZW1lbnRNb25pdG9yLFxuICAgIGRvY3VtZW50OiBEb2N1bWVudE1vbml0b3IsXG4gICAgZXZlbnRMYWc6IEV2ZW50TGFnTW9uaXRvclxuICB9O1xuXG4gIChpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHR5cGUsIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgIFBhY2Uuc291cmNlcyA9IHNvdXJjZXMgPSBbXTtcbiAgICBfcmVmMiA9IFsnYWpheCcsICdlbGVtZW50cycsICdkb2N1bWVudCcsICdldmVudExhZyddO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgdHlwZSA9IF9yZWYyW19qXTtcbiAgICAgIGlmIChvcHRpb25zW3R5cGVdICE9PSBmYWxzZSkge1xuICAgICAgICBzb3VyY2VzLnB1c2gobmV3IFNPVVJDRV9LRVlTW3R5cGVdKG9wdGlvbnNbdHlwZV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3JlZjQgPSAoX3JlZjMgPSBvcHRpb25zLmV4dHJhU291cmNlcykgIT0gbnVsbCA/IF9yZWYzIDogW107XG4gICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjQubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICBzb3VyY2UgPSBfcmVmNFtfa107XG4gICAgICBzb3VyY2VzLnB1c2gobmV3IHNvdXJjZShvcHRpb25zKSk7XG4gICAgfVxuICAgIFBhY2UuYmFyID0gYmFyID0gbmV3IEJhcjtcbiAgICBzY2FsZXJzID0gW107XG4gICAgcmV0dXJuIHVuaVNjYWxlciA9IG5ldyBTY2FsZXI7XG4gIH0pKCk7XG5cbiAgUGFjZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdzdG9wJyk7XG4gICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgYmFyLmRlc3Ryb3koKTtcbiAgICBjYW5jZWxBbmltYXRpb24gPSB0cnVlO1xuICAgIGlmIChhbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgICBhbmltYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdCgpO1xuICB9O1xuXG4gIFBhY2UucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhY2UudHJpZ2dlcigncmVzdGFydCcpO1xuICAgIFBhY2Uuc3RvcCgpO1xuICAgIHJldHVybiBQYWNlLnN0YXJ0KCk7XG4gIH07XG5cbiAgUGFjZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFydDtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIGJhci5yZW5kZXIoKTtcbiAgICBzdGFydCA9IG5vdygpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHJldHVybiBhbmltYXRpb24gPSBydW5BbmltYXRpb24oZnVuY3Rpb24oZnJhbWVUaW1lLCBlbnF1ZXVlTmV4dEZyYW1lKSB7XG4gICAgICB2YXIgYXZnLCBjb3VudCwgZG9uZSwgZWxlbWVudCwgZWxlbWVudHMsIGksIGosIHJlbWFpbmluZywgc2NhbGVyLCBzY2FsZXJMaXN0LCBzdW0sIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMjtcbiAgICAgIHJlbWFpbmluZyA9IDEwMCAtIGJhci5wcm9ncmVzcztcbiAgICAgIGNvdW50ID0gc3VtID0gMDtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgZm9yIChpID0gX2ogPSAwLCBfbGVuMSA9IHNvdXJjZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBpID0gKytfaikge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgICAgICBzY2FsZXJMaXN0ID0gc2NhbGVyc1tpXSAhPSBudWxsID8gc2NhbGVyc1tpXSA6IHNjYWxlcnNbaV0gPSBbXTtcbiAgICAgICAgZWxlbWVudHMgPSAoX3JlZjIgPSBzb3VyY2UuZWxlbWVudHMpICE9IG51bGwgPyBfcmVmMiA6IFtzb3VyY2VdO1xuICAgICAgICBmb3IgKGogPSBfayA9IDAsIF9sZW4yID0gZWxlbWVudHMubGVuZ3RoOyBfayA8IF9sZW4yOyBqID0gKytfaykge1xuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tqXTtcbiAgICAgICAgICBzY2FsZXIgPSBzY2FsZXJMaXN0W2pdICE9IG51bGwgPyBzY2FsZXJMaXN0W2pdIDogc2NhbGVyTGlzdFtqXSA9IG5ldyBTY2FsZXIoZWxlbWVudCk7XG4gICAgICAgICAgZG9uZSAmPSBzY2FsZXIuZG9uZTtcbiAgICAgICAgICBpZiAoc2NhbGVyLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHN1bSArPSBzY2FsZXIudGljayhmcmFtZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdmcgPSBzdW0gLyBjb3VudDtcbiAgICAgIGJhci51cGRhdGUodW5pU2NhbGVyLnRpY2soZnJhbWVUaW1lLCBhdmcpKTtcbiAgICAgIGlmIChiYXIuZG9uZSgpIHx8IGRvbmUgfHwgY2FuY2VsQW5pbWF0aW9uKSB7XG4gICAgICAgIGJhci51cGRhdGUoMTAwKTtcbiAgICAgICAgUGFjZS50cmlnZ2VyKCdkb25lJyk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGJhci5maW5pc2goKTtcbiAgICAgICAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gUGFjZS50cmlnZ2VyKCdoaWRlJyk7XG4gICAgICAgIH0sIE1hdGgubWF4KG9wdGlvbnMuZ2hvc3RUaW1lLCBNYXRoLm1heChvcHRpb25zLm1pblRpbWUgLSAobm93KCkgLSBzdGFydCksIDApKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZW5xdWV1ZU5leHRGcmFtZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFBhY2Uuc3RhcnQgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICAgIGV4dGVuZChvcHRpb25zLCBfb3B0aW9ucyk7XG4gICAgUGFjZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgYmFyLnJlbmRlcigpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICB9XG4gICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFjZScpKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChQYWNlLnN0YXJ0LCA1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFBhY2UudHJpZ2dlcignc3RhcnQnKTtcbiAgICAgIHJldHVybiBQYWNlLmdvKCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydwYWNlJ10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhY2U7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQYWNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChvcHRpb25zLnN0YXJ0T25QYWdlTG9hZCkge1xuICAgICAgUGFjZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBjb25zdCBoYW5kbGVUb2dnbGUgPSAoZXZlbnQpID0+IHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciBwYXJlbnROb2RlID0gdGFyZ2V0LmNsb3Nlc3QoJy5mYXEtaXRlbScpO1xuXG4gICAgcGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG4gIH07XG5cbi8vIEFkZCBldmVudExpc3RlbmVycy5cbiAgdmFyIHRvZ2dsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZmFxLWl0ZW0tdG9nZ2xlJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2dnbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSB0b2dnbGVzW2ldO1xuXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZVRvZ2dsZSk7XG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGZha2VTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICB2YXIgcGFyZW50Rm9ybSA9IHRhcmdldC5jbG9zZXN0KCdmb3JtJyk7XG5cbiAgICBwYXJlbnRGb3JtLnN1Ym1pdCgpO1xuICB9O1xuXG4gIGNvbnN0IGhpZ2hsaWdodCA9IChldmVudCkgPT4ge1xuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgdmFyIHdyYXBwZXIgPSB0YXJnZXQuY2xvc2VzdCgnLnBhcmFncmFwaC0tdHlwZS0tcGFja2FnZS1jaG9vc2VyJyk7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRhcmdldC5jbG9zZXN0KCcucGFja2FnZS1zZWxlY3RvcicpO1xuICAgIHZhciBzZWxlY3RvcnMgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWNrYWdlLXNlbGVjdG9yJyk7XG5cbiAgICAvLyBSZW1vdmUgY2xhc3MgZnJvbSBhbGwgb3RoZXIgY29udGFpbmVycy5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlbGVjdG9yID0gc2VsZWN0b3JzW2ldO1xuXG4gICAgICBzZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHRlZCcpO1xuICAgIH1cblxuICAgIC8vIEFkZCBjbGFzcyB0byBjb250YWluZXIuXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoJ2hpZ2hsaWdodGVkJyk7XG4gIH07XG5cbiAgLy8gQWRkIGV2ZW50TGlzdGVuZXJzLlxuICB2YXIgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYXJhZ3JhcGgtLXR5cGUtLXBhY2thZ2UtY2hvb3NlciAuZmllbGQtLW5hbWUtZmllbGQtbGluayBhJyk7XG4gIHZhciByYWRpb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFyYWdyYXBoLS10eXBlLS1wYWNrYWdlLWNob29zZXIgaW5wdXRbbmFtZT1cImRlY3JldG9fcGFra2VfZHVfdmFlbGdlclwiXScpO1xuXG4gIC8vIEJ1dHRvbnMuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBidXR0b24gPSBidXR0b25zW2ldO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZmFrZVN1Ym1pdCk7XG4gIH1cblxuICAvLyBSYWRpb3MuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHJhZGlvID0gcmFkaW9zW2ldO1xuXG4gICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGlnaGxpZ2h0KTtcbiAgfVxufSkoKTtcbiIsImpRdWVyeShmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRmxleHkgaGVhZGVyXG4gIGZsZXh5X2hlYWRlci5pbml0KCk7XG5cbiAgLy8gU2lkclxuICAkKCcuc2xpbmt5LW1lbnUnKVxuICAgIC5maW5kKCd1bCwgbGksIGEnKVxuICAgIC5yZW1vdmVDbGFzcygpO1xuXG4gICQoJy5zaWRyLXRvZ2dsZS0tcmlnaHQnKS5zaWRyKHtcbiAgICBuYW1lOiAnc2lkci1tYWluJyxcbiAgICBzaWRlOiAncmlnaHQnLFxuICAgIHJlbmFtaW5nOiBmYWxzZSxcbiAgICBib2R5OiAnLmxheW91dF9fd3JhcHBlcicsXG4gICAgc291cmNlOiAnLnNpZHItc291cmNlLXByb3ZpZGVyJ1xuICB9KTtcblxuICAvLyBFbmFibGUgdG9vbHRpcHMuXG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG5cbiAgLy8gVGVzdGltb25pYWxzLlxuICB0bnMoe1xuICAgIGNvbnRhaW5lcjogJy50ZXN0aW1vbmlhbHMgLnZpZXctY29udGVudCcsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIGl0ZW1zOiAxLFxuICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZSxcbiAgICByZXNwb25zaXZlOiB7XG4gICAgICA3Njg6IHtcbiAgICAgICAgaXRlbXM6IDJcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIEV4cGxhaW5lcnMuXG4gIHRucyh7XG4gICAgY29udGFpbmVyOiAnLmV4cGxhaW5lcnMgLnZpZXctY29udGVudCcsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIGl0ZW1zOiAxLFxuICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTogdHJ1ZVxuICB9KTtcbn0pO1xuIl19
