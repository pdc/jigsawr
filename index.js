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
    
    var jigHt, jigWd;
    
    // Called once we know the image and its dimensions.
    var showJigsaw = function (src, wd, ht) {
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
            u: src,
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
        $('#f').removeClass('l');
    }
    
    // User has clicked on the Jigsaw button.
    $('#f').submit(function (evt) {
        $(this).addClass('l');
        var em = $('#a a').height(); // SO TEMPTING to just write 13 here and be done with it.
        jigWd = $(document).width();
        jigHt = $(document).height() - 6 * em;
        
        if ($(this).hasClass('u')) {
            // User has specified picture URL directly.
            // We must loads the image to discover its dimensions.   
                     
            var src = $('#u').val();
            var im = $('<img>').attr('src', src);
            imElt = im.get(0);
            var isLoaded = false;
            im.load(function () {
                if (!isLoaded) { 
                    showJigsaw(src, imElt.width, imElt.height);
                    isLoaded = true;                
                }
            });
            if (imElt.complete) {
                im.trigger('load');
            }
        } else {
            // User has supplied Flickr tags; use API to find image src and dimens.
            
            var tags = $('#t').val();
            var args = {
                tags: tags.split().join(','),
                license: '1,2,4,5,7', // Licences that permit modified works.
                sort: 'interestingness-desc',
                content_type: 1, // Still images only
                media: 'photos',
                per_page: 25,
                extras: 'owner_name'
            };
            flickrCall('photos.search', args, function (data) {
                // We have a lost of photos. Choose one at random.
                var photoIndex = Math.floor(Math.random() * data.photos.photo.length);
                var photo = data.photos.photo[photoIndex];
                
                // Now to find the size of the photo that fits best.
                flickrCall('photos.getSizes', {photo_id: photo.id}, function (data) {
                    // Loop over sizes to get best fit.
                    var prev;
                    for (var i = 0; i < data.sizes.size.length; ++i) {
                        var size = data.sizes.size[i];
                        if (size.width > jigWd || size.height > jigHt) {
                            break;
                        }
                        prev = size;
                    }
                    size = prev;
            
                    var pElt = $('<p>');
                    var aElt = $('<a>')
                        .attr('href', 'http://www.flickr.com/photos/' + photo.owner + '/' + photo.id)
                        .text(photo.title + ' by ' + photo.ownername)
                        .appendTo(pElt);
                    $('#c').empty().append(pElt);
                    
                    showJigsaw(size.source, size.width, size.height);
                });
            });                
        }
        evt.preventDefault();
    });
    
    // This supplies the mechanism for switching between modes.
    $('form a').click(function (evt) {
        var which = this.parentNode.id == 'dt' ? 'u' : 't';
        this.parentNode.parentNode.className = which;
    });
    
    // While we’re at it, let’s check the query string.
    if (location.search) {
        var args = {};
        var kvs = location.search.substr(1).split('&');
        for (var i in kvs) {
            var kv = kvs[i];
            var p = kv.indexOf('=');
            args[unescape(kv.slice(0, p))] = unescape(kv.slice(p + 1));
        }
        for (var i in {d:1, u:1, t:1}) {
            $('#' + i).val(args[i]);
        }
        if (args.u) {
            $('#f').get(0).className = 'u';
        }
        if (args.j) {
            $('#f').submit();
        }
    }
});
