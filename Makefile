
CLOSURIFY=tools/closurify
CLOSURIFY_ARGS=--optimize=SIMPLE
DIST_DIR=10kjigsaw

js_files=index.js jigsaw.js
html_files=index.html
svg_files=jigsaw.svg
css_files=index.css
image_files=spin.gif

compressed_js_files=$(js_files:%.js=%.c.js)
compressed_html_files=$(html_files:%.html=%.c.html)
compressed_svg_files=$(svg_files:%.svg=%.c.svg)
compressed_css_files=$(css_files:%.css=%.c.css)
dist_files=$(compressed_js_files) $(compressed_html_files) \
	$(compressed_svg_files) $(compressed_css_files) $(image_files)

all: compressed_js compressed_html compressed_svg compressed_css
clean:
	rm -f $(compressed_js_files)
	rm -f $(compressed_html_files)
	rm -f $(compressed_svg_files)
	rm -f $(compressed_css_files)
	rm -rf $(DIST_DIR) $(DIST_DIR).zip
	
dist: $(dist_files)
	[ -d $(DIST_DIR) ] || mkdir $(DIST_DIR)
	for i in $(compressed_js_files); do cp $$i $(DIST_DIR)/$$(basename $$i .c.js).js; done	
	for i in $(compressed_html_files); do cp $$i $(DIST_DIR)/$$(basename $$i .c.html).html; done
	for i in $(compressed_svg_files); do cp $$i $(DIST_DIR)/$$(basename $$i .c.svg).svg; done
	for i in $(compressed_css_files); do cp $$i $(DIST_DIR)/$$(basename $$i .c.css).css; done
	cp -p $(image_files) $(DIST_DIR)
	wc $(DIST_DIR)/* | tee dist
	zip -9vr $(DIST_DIR) $(DIST_DIR) -x $(DIST_DIR)/.DS_Store

compressed_js: $(compressed_js_files)

compressed_html: $(compressed_html_files)

compressed_svg: $(compressed_svg_files)

compressed_css: $(compressed_css_files)

%.c.js: %.js
	$(CLOSURIFY) $(CLOSURIFY_ARGS) $<

%.c.html: %.html
	sed -e 's/^ *//' $< > $@
	
%.c.svg: %.svg
	sed -e 's/^ *//' $< > $@
	
%.c.css: %.css
	jsc tools/cssmin_jsc.js -- "`cat $<`" > $@
	
.SUFFIX: .js