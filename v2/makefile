default:
	@echo venv
	@echo server
	@echo pid
	@echo y2c
	@echo run
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

run:
	open http://127.0.0.1:$(PORT)/v3.html

DEST=paulshannnon@pshannon.net:public_html/pshannon.net/storymap

publish:
	scp v3.html $(DEST)/index.html
	scp scripts/main.js $(DEST)/scripts/
	scp scripts/storyMarker.js $(DEST)/scripts/
	scp scripts/storyDialog.js $(DEST)/scripts/
	scp scripts/jquery.csv.js $(DEST)/scripts/
	scp csv/sites.csv $(DEST)/csv/
	scp css/adaptive.css $(DEST)/css/
	scp media/*.jpg $(DEST)/media/
	scp media/*.jpeg $(DEST)/media/
	scp media/*.png $(DEST)/media/

viewRemote:
	open https://pshannon.net/storymap
