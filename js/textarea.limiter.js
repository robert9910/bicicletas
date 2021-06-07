(function($) {
    $.fn.extend( {
        limiter: function(limit, elem, showcount) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
				try {
					if (showcount) {
						elem.html( chars );
					} else {
						elem.html( limit - chars );
					}
				} catch(err) {}
            }
            setCount($(this)[0], elem, showcount);
        }
    });
})(jQuery);