// Menu Script by Matt Hillman
$(document).ready(function() {
	var anyMenuOpen = 0;
    var dw = $(document).width();
    $(window).resize(function() {
        dw = $(document).width();
    });
	function addMenu() {anyMenuOpen++;}
	function closeMenu() { (anyMenuOpen <= 0) ? anyMenuOpen = 0 : anyMenuOpen--; }
    $('ul.subnav').each(function(i, el) {
        $(el).parent('li').append('<span class="arrow">></span>');
    });
    $('ul.navmenu li').each(function(i, el) {
        var left_calc = false;
        $(window).resize(function() {
            left_calc = false;
        });
        $(el).bind('mouseover.triggerEvent', function() {
            if (!left_calc) {
                var p = $(this);
                var c  = $($('ul', this).get(0));
                var sub_left = p.outerWidth() - 2;
                if ((p.offset().left + p.outerWidth() + c.outerWidth()) > dw) {
                    sub_left = 0-c.outerWidth();
                }
                c.css('left', sub_left + 'px');
                left_calc = true;
            }
        });
        if (window.overrideSubWithJS) {
            $(el).hover(function() {
                $('> a', this).addClass('over');
            }, function() {
                $('> a', this).removeClass('over');

            });
        }
    });
	$(".navitem > a").each(function(i, el) {
		var trigger = el;
		var mouseOverSub = false;
		var popupId = trigger.id.replace('-top', '-menu');
		var popup = $('#'+popupId).css('opacity', 0);
		var shown = false;
		var beingShown = false;
		var subSetupComplete = false;

		if (popup.size() > 0) {
			popup.hover(function() {
				mouseOverSub = true;
			}, function() { // hide on mouseout of menu
				mouseOverSub = false;
				popup.animate({
					opacity: 0
				}, 200, 'linear', function() {
					popup.css('display', 'none');
					$(trigger).removeClass('sub-clicked');
					shown = false;
					closeMenu(); // code above should only allow one menu to show at a time...
				});
			});

			$(trigger).bind('click.triggerEvent', function(e) { //When trigger is clicked...
				e.preventDefault();
                $(this).blur();

				//hide any other menus that are currently shown
				$('.navmenu').each(function() {
					if (this.id !== popupId && $(this).css('display') !== 'none') {
						$(this).trigger('mouseout');
					}
				});

				if (shown && $('#'+popupId).css('display')==='none') {
					shown = false;
				}

				if (beingShown) { // currently animating, do nothing
					return;
				} else if (shown) { // currently showing menu, hide
					popup.animate({
						opacity: 0
					}, 200, 'linear', function() {
						popup.css('display', 'none');
						$(trigger).removeClass('sub-clicked');
						shown = false;
						closeMenu(); // code above should only allow one menu to show at a time...
					});
				} else { // if all else fails, show the menu
					beingShown = true;
					var left_point = $(trigger).offset().left;
					if (left_point + popup.width() > $(document).width()) {
						left_point = ($(trigger).offset().left + $(trigger).width())-popup.width();
					}
					$(trigger).addClass('sub-clicked');
					popup.css({
						top: $(trigger).offset().top + $(trigger).parent().height() - 2,
						left: left_point,
						display: 'block'
					}).animate({
						opacity: 1
					}, 10, 'linear', function() {
						beingShown = false;
						shown = true;
						addMenu();

                        if (window.overrideSubWithJS) {
                            if (!subSetupComplete) {
                                //handle sub-menus
                                setupSub(popup);
                                subSetupComplete = true;
                            }
                        }
					});
				}
			}).hover(function() {
                    if (anyMenuOpen > 0 && $('#' + trigger.id.replace('-top', '-menu')).size() > 0 && $('#' + trigger.id.replace('-top', '-menu')).css('display')!=='block') {
                        $(trigger).trigger('click');
                    }
                }, function() {	//On Hover Out
                    shown = false;
                    beingShown = false;
                    mouseOverSub = false;
			});
		}
	});

});

function setupSub(popup) {
    $('li', popup).each(function(i, el) {
        var subMenuHideTimer = null;
        var thisSub = el;
        var subShown = false;
        if ($('> ul', thisSub).size() > 0) {
            $(thisSub).append('<span class="arrow">></span>');

            $(thisSub).unbind('mouseover.triggerEvent').bind('mouseover.triggerEvent', function() {
                if (subMenuHideTimer) clearTimeout(subMenuHideTimer);
                if (!subShown) {
                    var sub_left = $(thisSub).width() -2;

                    if (($(thisSub).offset().left + $(thisSub).width() + $($('> ul', thisSub)[0]).width()) > $(document).width()) {
                        sub_left = 0-$($('> ul', thisSub)[0]).width();
                    }

            $('> ul', thisSub).css('left', sub_left + 'px');

                    $('> ul', thisSub).css({
                        opacity: 0,
                        top: 2,//$(thisSub).position().top + 2,
                        left: sub_left,
                        display: 'block'
                    }).animate({
                            opacity: 1
                        }, 10, 'linear', function() {
                            subShown = true;
                        });
                }
            }).unbind('mouseout.triggerEvent').bind('mouseout.triggerEvent', function() {
                    subMenuHideTimer = setTimeout(function() {
                        $('> ul', thisSub).animate({
                            opacity: 0
                        }, 200, 'linear', function() {}).css({
                                display: 'none'
                            });

                        subShown = false;
                    }, 200);
                });

            $('> ul', thisSub).each(function() { setupSub(this); });
        }
    }).hover(function() {
        $(this).addClass('sub-hover');
    }, function() {
        $(this).removeClass('sub-hover');
        subShown = false;
    });
}