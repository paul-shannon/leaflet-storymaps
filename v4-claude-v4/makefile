default:
	@echo venv
	@echo server
	@echo pid
	@echo view
	@echo view-remote
	@echo publish

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

PORT =  6887

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view:
	open http://localhost:$(PORT)/index.html

view-remote:
	open http://pshannon.net/storyMap


DEST=paulshannnon@pshannon.net:public_html/pshannon.net/storymap

publish:
	scp index.html $(DEST)/
	rsync -a scripts/ $(DEST)/scripts
	rsync -a  csv/sites.csv $(DEST)/csv/
	rsync css/adaptive.css $(DEST)/css/adaptive.css
	rsync -a media/ $(DEST)/media/
