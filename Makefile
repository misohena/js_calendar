
RELEASE_NAME = js_calendar_1_1

.PHONY: release
release:
	mkdir -p $(RELEASE_NAME)
	cp *.css *.js *.xhtml *.txt *.png -R cgi_pstore $(RELEASE_NAME)
	tar cvzf release/$(RELEASE_NAME).tar.gz $(RELEASE_NAME)
	rm -R $(RELEASE_NAME)
