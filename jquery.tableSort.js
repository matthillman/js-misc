(function($) {
    var opts = {};
    function sortTableWithColumnDirection(table, col, reverse) {
        var th = $('thead th', table).get(col);
        var sortFn = $.fn.sortableTable.compare[$(th).attr('id')] ? $.fn.sortableTable.compare[$(th).attr('id')] : $.fn.sortableTable.compare.default;
        var tr = $('tbody tr', table).sort(function(rowa, rowb) {
            var a = $('td', rowa).get(col);
            var b = $('td', rowb).get(col);
            var res = sortFn ? sortFn(a, b) : $(a).text().trim().localeCompare($(b).text().trim());
            return reverse * res;
        });
        $(tr).map(function() {
            $(table).append(this);
        });
    }
    var ths;
    var methods = {
        init: function(options) {
            opts = $.extend({}, $.fn.sortableTable.defaults, options);
            return this.each(function() {
                var t = this;
                ths = $(this).find('thead tr:first-of-type th');
                ths.each(function(i) {
                    $(this).css({'text-align': 'left', 'position': 'relative'}).click(function() {
                        var reverse = $('.sort-normal', this).length > 0;
                        sortTableWithColumnDirection(t, i, reverse ? -1 : 1);
                        var s = $('<span/>').css({
                            width: 0,
                            height: 0,
                            borderLeft: '4px solid transparent',
                            borderRight: '4px solid transparent',
                            position: 'absolute',
                            top: ($(this).innerHeight()/2-3)+'px',
                            right: '6px'
                        });
                        s.css('border' + (reverse ? 'Top' : 'Bottom'), '7px solid ' + opts.arrowColor);
                        s.addClass('tableSort-arrow').addClass('sort-' + (reverse ? 'reverse' : 'normal'));
                        $('.tableSort-arrow', t).remove();
                        $('.tableSort-sorted', t).removeClass('tableSort-sorted');
                        $(this).addClass('tableSort-sorted').append(s);
                    })
                });
            });
        },
        sort: function() {
            return this.each(function() {
                var reverse = $('.sort-reverse', this).length > 0;
                var i = ths.index($('.tableSort-arrow', this).parent('th'));
                if (!i) i = 0;
                sortTableWithColumnDirection(this, i, reverse ? -1 : 1);
            });
        }
    };
    $.fn.sortableTable = function () {
        var method = arguments[0];

        if(methods[method]) {
            method = methods[method];
        } else if( typeof(method) == 'object' || !method ) {
            method = methods.init;
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tableSort' );
            return this;
        }

        return method.call(this);
    };

    $.fn.sortableTable.defaults = {
        arrowColor: "#000000"
    };
    $.fn.sortableTable.compare = {};
})(jQuery);
