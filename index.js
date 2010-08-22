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

/*
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
*/

    var getJigsawSize = function () {
        var em = $('#c a').height(); // SO TEMPTING to just write 13 here and be done with it.
        return {
            width: $(document).width(),
            height: $(document).height() - 6 * em
        };
    }
    
    // this is the form that creates the jigsaw
    $('#f').submit(function (evt) {
        var jigSize = getJigsawSize();
        var jigWd = jigSize.width, jigHt = jigSize.height;
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
                $('#x').empty().append(embed);
                $('body').addClass('j');
                isLoaded = true;
            }
        });
        if (imElt.complete) {
            im.trigger('load');
        }
        evt.preventDefault();
    });
    
    
    var apiKey = '489c9667c5c8957340a78bacacb051d6';
    var flickrCall = function (meth, args, func) {
        $.extend(args, {
            method: 'flickr.' + meth,
            api_key: apiKey,
            format: 'json'
        });
        return $.ajax({
            url: 'http://api.flickr.com/services/rest/',
            data: args,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: func
        })
    };
    
    // This is the form that updates the image URL.
    $('#g').submit(function (evt) {
        var tags = $('#t').val();
        var perPage = 25;
        flickrCall('photos.search', {
            tags: tags.split().join(','),
            license: '1,2,4,5,7',
            sort: 'interestingness-desc',
            content_type: 1,
            media: 'photos',
            per_page: perPage,
            extras: 'owner_name'
        }, function (data) {
            // Choose a photo.
            var photoIndex = Math.floor(Math.random() * perPage);
            var photo = data.photos.photo[photoIndex];
            // Now to find the size of the photo that fits best.
            flickrCall('photos.getSizes', {photo_id: photo.id}, function (data) {
                // Loop over sizes to get best fit.
                var jigSize = getJigsawSize();
                var jigWd = jigSize.width, jigHt = jigSize.height;        
                var prev;
                for (var i = 0; i < data.sizes.size.length; ++i) {
                    var size = data.sizes.size[i];
                    if (size.width > jigWd || size.height > jigHt) {
                        break;
                    }
                    prev = size;
                }
                size = prev;
                
                $('#u').val(size.source);
                var pElt = $('<p>');
                var aElt = $('<a>')
                    .attr('href', 'http://www.flickr.com/photos/' + photo.owner + '/' + photo.id)
                    .text(photo.title + ' by ' + photo.ownername)
                    .appendTo(pElt);
                $('#c').empty().append(pElt);
                /*
                updateSubmit($('#u'));
                */
            });
        });
        evt.preventDefault();
    });
});
