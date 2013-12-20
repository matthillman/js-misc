(function($) {
    var opts = {};
    var escapeRegex = function(value) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };

    function filterRows(table) {
        var hide = [], show = $(table).find('tbody tr');
        $('input.filterTable-search').each(function(i) {
            var term = $(this).val();
            if (term !== '' && term !== 'Contains') {
                var matcher = new RegExp(escapeRegex(term), "i");
                var showTemp = [];
                $(show).each(function() {
                    if (!!matcher.test($(this).find('td:eq('+i+')').text())) showTemp.push(this);
                    else hide.push(this);
                });
                show = showTemp;
            }
        });

        $(show).show();
        $(hide).hide();
    }

    var methods = {
        init: function(options) {
            opts = $.extend({}, $.fn.tableFilter.defaults, options);
            return this.each(function() {
                var t = this;
                $(this).find('thead .filterTable-show').remove();
                $(this).find('thead .filterTable-row').remove();
                var showRow = $('<tr/>').addClass('filterTable-show');
                var trBase = $(this).find('thead tr:last-of-type');
                var n = trBase.find('th').size();
                var th = $('<th/>').attr('colspan', n).css({
                    padding: '3px 1px',
                    margin: 0,
                    height: '7px',
                    background: '#dedede',
                    border: '1px solid #888'
                }).on('click', function() {
                    if (!$(t).find('thead .filterTable-row').size()) {
                        var tr = $('<tr/>').addClass('filterTable-row').css('display', 'none');
                        trBase.find('th').each(function() {
                            $(this).css('width', $(this).width());
                            var searchTimeout;
                            var input = $('<input/>').addClass('filterTable-search').attr('type', 'search').attr('placeholder', 'Contains').css('width', '100%').on('keydown', function() {
                                clearTimeout(searchTimeout);
                                searchTimeout = setTimeout(function() {filterRows(t)}, 300);
                            }).on('change', function() {$(this).trigger('keydown')});
                            $('<th/>').attr('colspan', $(this).attr('colspan')).css({
                                background: '#999',
                                borderLeft: 'none',
                                borderRight: 'none',
                                padding: '5px 1px',
                                margin: 0
                            }).append(input).appendTo(tr);
                        });
                        tr.insertBefore(showRow).show(750);
                        $(this).find('span').css({
                            borderTop: 'none',
                            borderBottom: '7px solid ' + opts.arrowColor
                        });
                    } else {
                        $(t).find('thead tr.filterTable-row').remove();;
                        $(this).find('span').css({
                            borderBottom: 'none',
                            borderTop: '7px solid ' + opts.arrowColor
                        });
                        $(t).find('tbody tr').show();
                    }
                }).hover(function(){
                    $(this).css('background-color', '#efefef');
                }, function() {
                    $(this).css('background-color', '#dedede');
                }).appendTo(showRow);
                $('<span/>').css({
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    top: ($(this).innerHeight()/2-3)+'px',
                    right: '6px',
                    margin: '0 auto',
                    display: 'block',
                    borderTop: '7px solid ' + opts.arrowColor
                }).appendTo(th);
                $(this).find('thead').append(showRow);
            });
        },
        filter: function() {
            return this.each(function() {
                filterRows(this);
            });
        }
    };
    $.fn.tableFilter = function () {
        var method = arguments[0];

        if(methods[method]) {
            method = methods[method];
        } else if( typeof(method) == 'object' || !method ) {
            method = methods.init;
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tableFilter' );
            return this;
        }

        return method.call(this);
    };

    $.fn.tableFilter.defaults = {
        arrowColor: "#000000"
    };
})(jQuery);