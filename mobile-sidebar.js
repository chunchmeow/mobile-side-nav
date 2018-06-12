(function () {
    'use strict';

    function hide(tar, con) {
        $(tar).removeClass("in");
        $(con).removeClass("in");
        $(con).off('click.mobile-slide-one');
        $("html, body").removeClass("os-overflow-hidden");
    }

    function toggle(tar, con) {
        setTimeout(function () {
            $(con).toggleClass("in");
            $(tar).toggleClass("in");
            $("html, body").toggleClass("os-overflow-hidden"); //<-- need this to hide additional scroll bars on body
        }, 10);
    }

    function initMobileSlide(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation(); //<-- prevent bubbling up
        }

        var debounceTimer = null,
            target = $(this).data("target"),
            container = $(this).data("container");

        if (target && target.length && container && container.length) {
            var left = target.indexOf("left") > 0;
            $(container).removeClass("left right").addClass(left ? "left" : "right");

            //add one time listener to main body so if user clicks outside target then we can close this aside 
            $(container).one('click.mobile-slide-one', function (e) {
                if (e) e.stopPropagation(); //<-- prevent bubbling up
                hide(target, container);
            });

            //add resize listener to toggle menu if user resize out of mobile
            $(window).on("resize.mobile-aside", function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    if ($(window).width() >= 768) {
                        hide(target, container);
                        $(window).off("resize.mobile-aside");
                    }
                }, 150);
            });

            toggle(target, container);
        } else
            console.log("data-toggle mobile-slide requires a target and container");
    }

    function initMobileSlideDismiss(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation(); //<-- prevent bubbling up
        }

        $('[data-toggle="mobile-slide"]').each(function () {
            hide($(this).data("target"), $(this).data("container"));
        });
    }

    $(document).on("click.mobile-aside", "[data-toggle='mobile-slide']", initMobileSlide);

    //this is for buttons to close all mobile aside
    $(document).on("click.mobile-slide-dismiss", "[data-dismiss='mobile-slide']", initMobileSlideDismiss);

    //optionally use jquery to call dismiss or show
    $.fn.mobileslide = function (method) {
        return this.each(function () {
            if (typeof method === "string") {
                method = method.toLowerCase();
                if (method === "close" || method === "dismiss")
                    hide($(this).data("target"), $(this).data("container"));
                else if (method === "open" || method === "show")
                    toggle($(this).data("target"), $(this).data("container"));
            } else {
                $(this).on("click.mobile-aside", initMobileSlide);
            }
        });        
    }

})();