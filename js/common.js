
const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

function initPage(demo) {
    
    $('body').scrollspy({ offset: 4.0 * rem });

    var scroll = getURLParameter("scroll");
    if (scroll) {
        // remove scroll parameter from url :P
        var url = window.location.href;
        url = url.replace(/scroll=\d*&?/, '');
        url = url.replace(/&$/, '')
        url = url.replace(/\/\?$/, '/')

        // html 5 yay
        window.history.pushState("string", "Title", url);

        // finally, scroll!
        $(window).scrollTop(scroll);
    }

    // if (!demo)
    //     return;

    // demo_gl();
}

function scrollAwareHRef(object, href) {
    object.attr('href', href + "?scroll=" + Math.round($(window).scrollTop()));
}

// from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
            return sParameterName[1];
    }
    return null;
}
