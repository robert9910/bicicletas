//* Requires JQuery *//

/* Javascript polyfills */

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

/*
  IE Doesn't have a .startsWith either?
*/
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str){
    return this.lastIndexOf(str, 0) === 0;
  };
}

// IE < 9 doesn't have a trim() for strings
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
/* Javascript polyfills END */

/* event propagation stop */
try {
    function eventStopPropagation(event) {
        if (event.stopPropagation) {
            event.stopPropagation();   // W3C model
        } else {
            event.cancelBubble = true; // IE model
        }
    }
} catch(err) {
    console.error('Error loading eventStopPropagation(): ' + err);
}
/* event propagation stop END */

/*page scroll detection*/
try {
    if (typeof window.scrollpage === 'undefined') {
        function scrollpage () {
            try {
                document.body.classList.add("scroll"); //scrolled
                var scrollTop = window.pageYOffset;
                if( scrollTop > 0 ){ document.body.classList.remove("scroll-top");document.body.classList.add("scroll-mid"); } else { document.body.classList.add("scroll-top");document.body.classList.remove("scroll-mid"); } //scroll al top?
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) { document.body.classList.add("scroll-bottom");document.body.classList.remove("scroll-mid"); } else	{ document.body.classList.remove("scroll-bottom"); } //scroll al bottom? 
            } catch (err) {console.log(err);}
        }
        window.onscroll = scrollpage;    
    }
    document.addEventListener("DOMContentLoaded", function(event) { 
        scrollpage();
    });
} catch (err) {
    console.error('Error loading scrollpage(): ' + err);
}
/* page scroll detection END */

/* page parts (header,body,footer) scroll detection*/
try {
  
  var pageObserver = new IntersectionObserver(function(entries) {
    // since there is a single target to be observed, there will be only one entry
    for (var i  = 0; i < entries.length; i++) {
      entries[i].target.classList.add("mb-js-scroll");
      entries[i].target.classList.remove("out");
      entries[i].target.classList.remove("part");
      entries[i].target.classList.remove("in");
      entries[i].target.classList.remove("zero");
      
      if(entries[i]['isIntersecting'] === true) {
        if(entries[i]['intersectionRatio'] === 1) {
          entries[i].target.classList.add("in");
        } else if(entries[i]['intersectionRatio'] > 0) {
          //console.log('Less than 50% of target is visible in the screen');
          entries[i].target.classList.add("part");
        }
      }
      else {
        //console.log('Target is not visible in the screen');
        entries[i].target.classList.add("out");
      }
      //var style = entries[i].target.getComputedStyle ? getComputedStyle(entries[i].target, null) : entries[i].target.currentStyle;
      if (entries[i].target.clientHeight == 0) {// && ((parseInt(style.marginTop) || 0) + (parseInt(style.marginBottom) || 0)) == 0) {
        entries[i].target.classList.add("zero");
      }
    }
  }, { threshold: [0,1] });
  
  function observeScroll(item) {
    if (item) { pageObserver.observe(item); }
  }
  function unobserveScroll(item) {
    if (item) { pageObserver.unobserve(item); }
  }

  observeScroll(document.querySelector(".mb-panel-hellobar"));
  observeScroll(document.querySelector("header.mb-panel-cabecera-sup"));
  observeScroll(document.querySelector("header.mb-panel-cabecera"));
  observeScroll(document.querySelector("header.mb-panel-cabecera-sub"));
  observeScroll(document.querySelector(".mb-center"));
  observeScroll(document.querySelector("footer.mb-panel-pie-sup"));
  observeScroll(document.querySelector("footer.mb-panel-pie"));
  observeScroll(document.querySelector("footer.mb-panel-pie-sub"));


} catch (err) {
  console.error('Error loading observeScroll(): ' + err);
}
/* page parts (header,body,footer) scroll detection END */

/* item is in view */
try {
  function isInViewport(elem) {
    var distance = elem.getBoundingClientRect();
    return (
      distance.top >= 0 &&
      distance.left >= 0 &&
      distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
} catch (err) {
    console.error('Error loading isInViewport(): ' + err);
}

/* item is in view END*/

/* carga asincrona de referencia externa javascript */
document.addEventListener("DOMContentLoaded", function(event) { 
  jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
  }
});
/* carga asincrona de referencia externa javascript END */

/* carga asincrona de referencia externa css */
function getCSS(path) {
  try {
    var link = document.createElement( "link" );
    link.href = path;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    var head = document.getElementsByTagName( "head" )[0];
    head.insertBefore(link, head.firstChild)

    //document.getElementsByTagName( "head" )[0].appendChild( link )
  } catch (err) {
    console.error('Error getCSS(\'' + path + '\'): ' + err);
  }

}
/* carga asincrona de referencia externa css END */

/* capas desplegables */
document.addEventListener("DOMContentLoaded", function(event) { 
    try {
        $('.mb-js-desplegable').children('.mb-js-desplegable-boton').click(function(e) {
            var principal = $(this).parent('.mb-js-desplegable').data('js-desplegable-principal') == undefined ? false : $(this).parent('.mb-js-desplegable').data('js-desplegable-principal');
            var acordeon = $(this).parent('.mb-js-desplegable').data('js-desplegable-acordeon') == undefined ? true : $(this).parent('.mb-js-desplegable').data('js-desplegable-acordeon');
            var op = !$(this).parent('.mb-js-desplegable').hasClass('abierto');
            if (principal) {
              $('body').toggleClass('mb-js-desplegable-abierto',false);  
              var capasAfectadas = $('.mb-js-desplegable[data-js-desplegable-principal]')
                          .not($(this).parents('.mb-js-desplegable'))
                          .not($(this).parent('.mb-js-desplegable').find('.mb-js-desplegable.abierto'));
              capasAfectadas.toggleClass('abierto',false);
              capasAfectadas.children('.mb-js-desplegable-capa').toggleClass('abierto',false);
              var op = !$(this).parent('.mb-js-desplegable').hasClass('abierto');
              if (acordeon) {$(this).siblings('.mb-js-desplegable-capa').toggleClass('abierto',op);}
              $(this).parent('.mb-js-desplegable').toggleClass('abierto',op);
              $(this).parent('.mb-js-desplegable').children('.mb-js-desplegable-capa').toggleClass('abierto',op);
              if (op) {
                  $(this).parent('.mb-js-desplegable').trigger("mb-js-desplegable-open");
              } else {
                  $(this).parent('.mb-js-desplegable').trigger("mb-js-desplegable-close");
              }
            } else {
              var op = !$(this).parent('.mb-js-desplegable').hasClass('abierto');
              $(this).parent('.mb-js-desplegable').toggleClass('abierto',op);
              $(this).parent('.mb-js-desplegable').find('.mb-js-desplegable-capa').toggleClass('abierto',op);
              if (op) {
                  $(this).parent('.mb-js-desplegable').trigger("mb-js-desplegable-open");
              } else {
                  $(this).parent('.mb-js-desplegable').trigger("mb-js-desplegable-close");
              }
            }
            eventStopPropagation(e);
        });
        $('.mb-js-desplegable-cerrar,.mb-js-desplegable-capa .overlay').click(function(e) {
            $('body').toggleClass('mb-js-desplegable-abierto',false);
            $(this).parents('.mb-js-desplegable-capa').toggleClass('abierto',false);
            $(this).parents('.mb-js-desplegable-capa').parent('.mb-js-desplegable').toggleClass('abierto',false);
            $(this).parents('.mb-js-desplegable-capa').parent('.mb-js-desplegable').trigger("mb-js-desplegable-close");
            eventStopPropagation(e);
        });
    } catch (err) {
        console.error('Error loading .mb-js-desplegable script: ' + err);
    }
});
/* capas desplegables END */

/* capas modales */
function openModal(modal) {
  $('.mb-js-modal').toggleClass('open',false);
  $('body').toggleClass('modal-open',false);
  $(modal).toggleClass('open',true);
  $(modal).trigger('modalopen');
  $('body').toggleClass('modal-open',true);
  return false;
}
function closeModal(modal) {
  $(modal).toggleClass('open',false);
  $(modal).trigger('modalclose');
  $('body').toggleClass('modal-open',false);
  return false;
}
function toggleModal(modal) {
  if ($(modal).hasClass('open')) {
    closeModal(modal);
  } else {
    openModal(modal);
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  try{
    $('.mb-js-modal').each(function(i) {
      var modal = $(this).clone();
      if ($(this).attr("id") != null && $(this).attr("id") != '') {
        $(modal).addClass($(this).attr("id"));
      }
      $(this).remove();
      $(modal).find('.mb-js-modal-content').click(function(e) {
        e.stopPropagation();
      })
      $('body').append(modal);
    });
    $('.mb-js-modal').click(function(e){
      //$(this).toggleClass('open',false);
      //$('body').toggleClass('modal-open',false);
      closeModal(this);
      e.stopPropagation();
    });
    $('.mb-js-modal *[data-dismiss="modal"]').click(function(e){
      //$(this).parents('.mb-js-modal').toggleClass('open',false);
      //$('body').toggleClass('modal-open',false);
      $(this).parents('.mb-js-modal').each(function() {
        closeModal(this);
      })
      e.stopPropagation();
    });
    $('[data-toggle="modal"]').click(function(e) {
      if ($(this).data('target') !== undefined) {
        //$('.mb-js-modal').toggleClass('open',false);
        //$('.mb-js-modal').trigger('modalclose');
        $('.mb-js-modal.open').modal('close');
        $($(this).data('target') + '.mb-js-modal').toggleClass('open',true);
        $($(this).data('target') + '.mb-js-modal').trigger('modalopen');
        $('body').toggleClass('modal-open',true);
        e.preventDefault();
        return false;
      }
    });
    (function ( $ ) {
        $.fn.modal = function(action) {
          var m_action = action;
            this.filter('.mb-js-modal').each(function() {
              if (!action || action == ''){
                openModal(this);
              } else {
                switch (action.toLowerCase()) {
                  case 'open':
                  case 'show':
                    openModal(this);
                    break;
                  case 'close':
                  case 'hide':
                    closeModal(this);
                    break;
                  case 'toggle':
                    toggleModal(this);
                    break;
                }
              }
            });
            return this;
        };
    }( jQuery ));
  } catch (err) {
      console.error('Error loading .mb-js-modal script: ' + err);
  }
});
/* capas modales END*/

/* menus con dropdown */
document.addEventListener("DOMContentLoaded", function(event) { 
    try {
        $('.menu .item > .dropdown').click(function(e) {
            //preventdefault
            var op = !$(this).hasClass('abierto');
            $(this).closest('.menu').children('.item').toggleClass('abierto',false);
            $(this).closest('.menu').children('.item').toggleClass('abierto',false);
            $(this).closest('.menu').children('.item').children('.dropdown, .menu').toggleClass('abierto',false);
            
            $(this).toggleClass('abierto',op);
            $(this).closest('.item').toggleClass('abierto',op);
            $(this).siblings('.menu').toggleClass('abierto',op);
            if (op) {
                $(this).siblings('.menu').trigger("mb-js-menu-open");
            } else {
                $(this).siblings('.menu').trigger("mb-js-menu-close");
            }
            return false;
        });
    } catch (err) {
        console.error('Error loading .mb-js-desplegable script: ' + err);
    }
});
/* menus con dropdown */

/* tabs / pestañas */
try {
  function openTab(tabCollection,tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tab-content" and hide them
    $(tabCollection).find('.tab-content').removeClass('active');//.hide();

    // Get all elements with class="tablinks" and remove the class "active"
    $(tabCollection).find('.tab-link').removeClass('active');

    // Show the current tab, and add an "active" class to the button that opened the tab
    $(tabCollection).find(".tab-content[data-tab='" + tabName + "']").addClass('active');//.show();
    $(tabCollection).find(".tab-link[data-tab='" + tabName + "']").addClass('active');
    $(tabCollection).attr("data-currenttab",tabName);
  }
} catch(err) {
  console.error('Error loading openTab(): ' + err);
}

document.addEventListener("DOMContentLoaded", function(event) { 
  try {
    $('.mb-js-tabs .tab-link').click(function(e) {
        openTab($(this).parents('.mb-js-tabs'),$(this).data("tab"));
        return false;
    });
  } catch (err) {
      console.error('Error loading .mb-js-tabs script: ' + err);
  }
});
/* tabs / pestañas END */



/* mb-mensaje con cierre */
document.addEventListener("DOMContentLoaded", function(event) { 
  try {
    $('.mb-js-mensaje .close').click(function(e) {
        $(this).parents('.mb-js-mensaje').remove();
    });
  } catch (err) {
      console.error('Error loading .mb-js-mensaje script: ' + err);
  }
});
/* mb-mensaje con cierre END */

throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

/* plugin carga imagenes lazy */
var lazyLoadInstance;
document.addEventListener("DOMContentLoaded", function(event) { 
  try {
    if ($('.lazy').length > 0) {
      $.getScript('/js/lazyload/dist/lazyload.min.js', function()
      {
        lazyLoadInstance = new LazyLoad({
          elements_selector: ".lazy",
          class_loading: "lazy-loading",
          class_loaded: "lazy-loaded",
          class_error: "lazy-error"
          // ... more custom settings?
        });
        if (lazyLoadInstance) {
          lazyLoadInstance.update();
          window.addEventListener('scroll', function(){ if (lazyLoadInstance) { lazyLoadInstance.update() } });
          window.addEventListener('resize', function(){ if (lazyLoadInstance) { lazyLoadInstance.update() } });
        }
      });
    }
  } catch (err) {
      console.error('Error loading lazyload plugin: ' + err);
  }
});
/* plugin carga imagenes lazy END*/

/* plugin jquery sliders 'Slick' */
document.addEventListener("DOMContentLoaded", function(event) { 
  try {
    
    if ($('.mb-js-slider').length > 0) {
      $.getScript('/js/slick/slick.min.js', function()
      {
          // script is now loaded and executed.
          // put your dependent JS here.
          //$('.mb-js-slider').slick();
          $.getScript('/js/slick/extraSlickOptions.js', function()
          {
              // script is now loaded and executed.
              // put your dependent JS here.
              $('.mb-js-slider').slick();
          });
      });
    }
  } catch (err) {
      console.error('Error loading .mb-js-slider script: ' + err);
  }
});
/* plugin jquery sliders 'Slick' END */

/* plugin lightbox */
document.addEventListener("DOMContentLoaded", function(event) {
  try {
    if ($('[data-lightbox]').length > 0) {
      $.getScript('/js/lightbox2/js/lightbox.min.js',function(script, textStatus) {
        lightbox.option({
          'resizeDuration': 200,
          'wrapAround': true,
          'albumLabel': "%1 / %2"
        });
      });
      getCSS('/js/lightbox2/css/lightbox.min.css');
    }
  } catch (err) {
      console.error('Error loading lightbox script: ' + err);
  }
});
/* plugin lightbox END*/

/* plugin jquery botones con estados */
document.addEventListener("DOMContentLoaded", function(event) { 
  try {
    
  +function ($) {
    'use strict';

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
      this.$element  = $(element)
      this.options   = $.extend({}, Button.DEFAULTS, options)
      this.isLoading = false
    }

    Button.VERSION  = '3.4.1'

    Button.DEFAULTS = {
      loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
      var d    = 'disabled'
      var $el  = this.$element
      var val  = $el.is('input') ? 'val' : 'html'
      var data = $el.data()

      state += 'Text'

      if (data.resetText == null) $el.data('resetText', $el[val]())

      // push to event loop to allow forms to submit
      setTimeout($.proxy(function () {
        $el[val](data[state] == null ? this.options[state] : data[state])

        if (state == 'loadingText') {
          this.isLoading = true
          $el.addClass(d).attr(d, d).prop(d, true)
        } else if (this.isLoading) {
          this.isLoading = false
          $el.removeClass(d).removeAttr(d).prop(d, false)
        }
      }, this), 0)
    }

    Button.prototype.toggle = function () {
      var changed = true
      var $parent = this.$element.closest('[data-toggle="buttons"]')

      if ($parent.length) {
        var $input = this.$element.find('input')
        if ($input.prop('type') == 'radio') {
          if ($input.prop('checked')) changed = false
          $parent.find('.active').removeClass('active')
          this.$element.addClass('active')
        } else if ($input.prop('type') == 'checkbox') {
          if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
          this.$element.toggleClass('active')
        }
        $input.prop('checked', this.$element.hasClass('active'))
        if (changed) $input.trigger('change')
      } else {
        this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
        this.$element.toggleClass('active')
      }
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.button')
        var options = typeof option == 'object' && option

        if (!data) $this.data('bs.button', (data = new Button(this, options)))

        if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
      })
    }

    var old = $.fn.button

    $.fn.button             = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
      $.fn.button = old
      return this
    }


    // BUTTON DATA-API
    // ===============

    $(document)
      .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        var $btn = $(e.target).closest('.btn')
        Plugin.call($btn, 'toggle')
        if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
          // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
          e.preventDefault()
          // The target component still receive the focus
          if ($btn.is('input,button')) $btn.trigger('focus')
          else $btn.find('input:visible,button:visible').first().trigger('focus')
        }
      })
      .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
      })

  }(jQuery);

  } catch (err) {
      console.error('Error loading .mb-js-slider script: ' + err);
  }
});
/* plugin jquery botones con estados END */
