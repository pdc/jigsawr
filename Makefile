
CLOSURIFY=tools/closurify

js_files=index.js jigsaw.js
html_files=index.html
svg_files=jigsaw.svg
css_files=index.css

compressed_js_files=$(js_files:%.js=%.c.js)
compressed_html_files=$(html_files:%.html=%.c.html)
compressed_svg_files=$(svg_files:%.svg=%.c.svg)
dist_files=$(compressed_js_files) $(compressed_html_files) $(compressed_svg_files) $(css_files)

all: compressed_js compressed_html compressed_svg
clean:
	rm -f $(compressed_js_files)
	rm -f dist/*
	
dist: $(dist_files)
	[ -d dist ] || mkdir dist
	for i in $(compressed_js_files); do cp $$i dist/$$(basename $$i .c.js).js; done	
	for i in $(compressed_html_files); do cp $$i dist/$$(basename $$i .c.html).html; done
	for i in $(compressed_svg_files); do cp $$i dist/$$(basename $$i .c.svg).svg; done
	cp -p $(css_files) dist	

compressed_js: $(compressed_js_files)

compressed_html: $(compressed_html_files)

compressed_svg: $(compressed_svg_files)

%.c.js: %.js
	$(CLOSURIFY) $<

%.c.html: %.html
	sed -e 's/^ *//' $< > $@
	
%.c.svg: %.svg
	sed -e 's/^ *//' $< > $@
	
.SUFFIX: .js