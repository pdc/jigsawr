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
    
    $('#f').submit(function (evt) {
        var imSrc = $('#u').val();
        var im = $('<img>').attr('src', imSrc);
        imElt = im.get(0);
        im.load(function () {
            var wd = imElt.width;
            var ht = imElt.height;
            if (wd > 980) {
                ht *= 980 / wd;
                wd = 980;
            }
            if (ht > 600) {
                wd *= 600 / ht;
                ht = 600;
            }
            var n = $('#d').val();
            var args = {
                u: imSrc,
                wd: wd,
                ht: ht,
                nh: Math.ceil(Math.pow(n * wd / ht, 0.5)),
                nv: Math.ceil(Math.pow(n * ht / wd, 0.5))
            }
            var embed = $('<embed>').attr({
                src: 'jigsaw.svg' + escapeArgs(args),
                type: 'image/svg+xml',
                width: 980,
                height: 600
            });
            $('#x').replaceWith(embed);
            embed.attr('id', 'x');            
        });
        if (imElt.complete) {
            im.trigger('load');
        }
        evt.preventDefault();
    });
    
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
            }
        })
        evt.preventDefault();
    })
})