default:
	@echo venv
	@echo server
	@echo pid
	@echo y2c
	@echo view-local
	@echo publish
	@echo viewRemote

PORT=9000

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

y2c:
	(cd csv; make y2c)

view-local:
	open http://127.0.0.1:$(PORT)/v3.html

DEST=paulshannnon@pshannon.net:public_html/pshannon.net/storymap

publish:
	scp v3.html $(DEST)/index.html
	rsync -a scripts/ $(DEST)/scripts
	rsync -a  csv/sites.csv $(DEST)/csv/
	rsync css/adaptive.css $(DEST)/css/adaptive.css
	rsync -a media/ $(DEST)/media/

viewRemote:
	open https://pshannon.net/storymap
