About Jigsawr
=============

Jigsawr started as an SVG demonstration for the [10K Apart contest][] by
[Damian Cugley][], where it is [entry 269][]. You pick an image (either using Flickr tags or by
specifying the URL yourself) and it shows you a jigsaw puzzle.

Compatibility
-------------

This is an HTML5 + SVG + JavaScript application.

Because it uses SVG it requires an up-to-date version of [Apple Safari][], [Google Chrome][], [Opera][], or [Mozilla Firefox][]; or,
on Windows Vista or 7, [Microsoft Internet Explorer 9][]. You might be able to view it on older versions of
IE using [Google Chrome Frame][].

Bookmarklet
-----------

Just for fun, here’s a bookmarklet you can use to create a jigsaw from any page.

<blockquote>
    <p>
        <a href="javascript:(function(){for(var c=document.images,d=0,e,a=0;a<c.length;++a){var b=c[a],f=b.width*b.height;if(f>d){d=f;e=b}}location=&quot;http://jigsawr.org/?u=&quot;+escape(e.src)+&quot;&amp;d=24&amp;j=1&quot;})();return false
">&rarr;Jigsawr</a>
    </p>
</blockquote>

Drag the above link on to your bookmark bar. Then, when you are visiting
the web page of an image you fancy, click the bookmarklet to create
jigsaw (it automatically chooses the largest image on the page).

Note that some sites go to some effort to discourage downloading their images, and
the bookmarklet will generally be baffled by these. 

Read More
---------

If you are interested you can read about [Jigsawr Design][1] and [Jigsawr Minification][2] on my site,
and read the [Jigsawr source code on GitHub][].

  [10K Apart contest]: http://10k.aneventapart.com/
  [entry 269]: http://10k.aneventapart.com/Entry/269
  [Damian Cugley]: http://www.alleged.org.uk/pdc/
  [Apple Safari]: http://www.apple.com/safari/
  [Google Chrome]: http://www.google.com/chrome
  [Opera]: http://www.opera.com/
  [Mozilla Firefox]: http://www.mozilla-europe.org/en/firefox/
  [Microsoft Internet Explorer 9]: http://ie.microsoft.com/testdrive/
  [Google Chrome Frame]: http://code.google.com/chrome/chromeframe/
  [Jigsawr source code on GitHub]: http://github.com/pdc/jigsawr
  [1]: http://www.alleged.org.uk/pdc/2010/08/30.html
  [2]: http://www.alleged.org.uk/pdc/2010/08/29.html