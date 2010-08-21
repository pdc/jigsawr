
CLOSURIFY=tools/closurify

js_files=index.js jigsaw.js
html_files=index.html
svg_files=jigsaw.svg
css_files=index.css

compressed_js_files=$(js_files:%.js=%.c.js)
dist_files=$(compressed_js_files) $(html_files) $(svg_files) $(css_files)

all: compressed_js
clean:
	rm -f $(compressed_js_files)
	
dist: $(dist_files)
	[ -d dist ] || mkdir dist
	for i in $(compressed_js_files); do cp $$i dist/$$(basename $$i .c.js).js; done	
	cp -p $(html_files) dist	
	cp -p $(svg_files) dist	
	cp -p $(css_files) dist	

compressed_js: $(compressed_js_files)

%.c.js: %.js
	$(CLOSURIFY) $<
	
.SUFFIX: .js