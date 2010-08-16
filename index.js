$(document).ready(function () {
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
            var nh = Math.ceil(Math.pow(n * wd / ht, 0.5));
            var nv = Math.ceil(Math.pow(n * ht / wd, 0.5));
            var embedSrc = 'jigsaw.svg?u=' + escape(imSrc) + '&wd=' + wd + '&ht=' + ht + '&nh=' + nh + '&nv=' + nv;
            
            var embed = $('<embed>').attr({
                src: embedSrc,
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
})