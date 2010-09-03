
CLOSURIFY=tools/closurify
CLOSURIFY_ARGS=--optimize=SIMPLE
JINJIFY=tools/jinjify
JINJIFY_ARGS=-ttemplates

DIST_DIR=10kjigsaw

js_files=index.js jigsaw.js
html_files=index.html
svg_files=jigsaw.svg
css_files=index.css
image_files=spin.gif

compressed_js_files=$(js_files:%.js=%.min.js)
compressed_html_files=$(html_files:%.html=%.min.html)
compressed_svg_files=$(svg_files:%.svg=%.min.svg)
compressed_css_files=$(css_files:%.css=%.min.css)
dist_files=$(compressed_js_files) $(compressed_html_files) \
	$(compressed_svg_files) $(compressed_css_files) $(image_files)

markdown_files=about/index.markdown
rendered_markdown_files=$(markdown_files:%.markdown=%.html)

all: compressed_js compressed_html compressed_svg compressed_css rendered_markdown
clean:
	rm -f $(compressed_js_files)
	rm -f $(compressed_html_files)
	rm -f $(compressed_svg_files)
	rm -f $(compressed_css_files)
	rm -rf $(DIST_DIR) $(DIST_DIR).zip
	
dist: $(dist_files)
	[ -d $(DIST_DIR) ] || mkdir $(DIST_DIR)
	for i in $(compressed_js_files); do cp $$i $(DIST_DIR)/$$(basename $$i .min.js).js; done	
	for i in $(compressed_html_files); do cp $$i $(DIST_DIR)/$$(basename $$i .min.html).html; done
	for i in $(compressed_svg_files); do cp $$i $(DIST_DIR)/$$(basename $$i .min.svg).svg; done
	for i in $(compressed_css_files); do cp $$i $(DIST_DIR)/$$(basename $$i .min.css).css; done
	cp -p $(image_files) $(DIST_DIR)
	wc $(DIST_DIR)/* | tee dist
	zip -9vr $(DIST_DIR) $(DIST_DIR) -x $(DIST_DIR)/.DS_Store

compressed_js: $(compressed_js_files)

compressed_html: $(compressed_html_files)

compressed_svg: $(compressed_svg_files)

compressed_css: $(compressed_css_files)

rendered_markdown: $(rendered_markdown_files)

%.min.js: %.js
	$(CLOSURIFY) $(CLOSURIFY_ARGS) $<

%.min.html: %.html
	sed -e 's/^ *//' $< > $@
	
%.min.svg: %.svg
	sed -e 's/^ *//' $< > $@
	
%.min.css: %.css
	cssparse -m $< >$@ 2>$<.log
	
%.html: %.markdown templates/about.html
	$(JINJIFY) $(JINJIFY_ARGS) -vo $@ $<