$(document).ready(function () {
    var escapeArgs = function (args) {
        var ss = [];
        for (var i in args) {
            ss.push(escape(i) + '=' + escape(args[i]));
        }
        if (ss.length) {
            return '?' + ss.join('&');
        }
    }

    // Disable submit buttons until argumenbts supplied.
    var updateSubmit = function (elt$) {
        var submit$ = elt$.nextAll('input');
        if (elt$.val() == '') {
            submit$.attr('disabled', 'disabled');
        } else {
            submit$.removeAttr('disabled');
        }
    }
    for (var e in {t: 1, u: 1}) {
        var e$ = $('#' + e);
        updateSubmit(e$);
        e$.change(function () {updateSubmit($(this))});
    }
    
    // this is the form that creates the jigsaw
    $('#f').submit(function (evt) {
        var em = $('#c a').height();
        var jigWd = $(document).width(),
            jigHt = $(document).height() - 6 * em;
        var imSrc = $('#u').val();
        var im = $('<img>').attr('src', imSrc);
        imElt = im.get(0);
        var isLoaded = false;
        im.load(function () {
            if (!isLoaded) { 
                var wd = imElt.width;
                var ht = imElt.height;
                if (wd > jigWd) {
                    ht *= jigWd / wd;
                    wd = jigWd;
                }
                if (ht > jigHt) {
                    wd *= jigHt / ht;
                    ht = jigHt;
                }
                var n = $('#d').val();
                var args = {
                    u: imSrc,
                    wd: wd,
                    ht: ht,
                    nh: Math.ceil(Math.pow(n * wd / ht, .5)),
                    nv: Math.ceil(Math.pow(n * ht / wd, .5))
                }
                var embed = $('<embed>').attr({
                    src: 'jigsaw.svg' + escapeArgs(args),
                    type: 'image/svg+xml',
                    width: jigWd,
                    height: jigHt
                });
                $('#x').replaceWith(embed);
                embed.attr('id', 'x');
                $('body').addClass('j');
                isLoaded = true;
            }
        });
        if (imElt.complete) {
            im.trigger('load');
        }
        evt.preventDefault();
    });
    
    // This is the form that updates the image URL.
    $('#g').submit(function (evt) {
        var tags = $('#t').val();
        var args = {
            method: 'flickr.photos.search',
            api_key: '489c9667c5c8957340a78bacacb051d6',
            tags: tags.split().join(','),
            license: '1,2,4,5,7',
            sort: 'interestingness-desc',
            content_type: 1,
            media: 'photos',
            per_page: 25,
            extras: 'url_m,owner_name',
            format: 'json'
        }
        var a = $.ajax({
            url: 'http://api.flickr.com/services/rest/',
            data: args,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function (data, textStatus, req) {
                var photo = data.photos.photo[0];
                var imgSrc = photo.url_m;
                $('#u').val(imgSrc);
                var pElt = $('<p>').attr('id', 'c');
                var aElt = $('<a>')
                    .attr('href', 'http://www.flickr.com/photos/' + photo.owner + '/' + photo.id)
                    .text(photo.title + ' by ' + photo.ownername)
                    .appendTo(pElt);
                $('#c').replaceWith(pElt);
                updateSubmit($('#u'));
            }
        })
        evt.preventDefault();
    });
});
