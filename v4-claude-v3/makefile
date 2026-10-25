default:
	@echo venv
	@echo server
	@echo pid
	@echo view

venv:
	@echo source /Users/paul/github/slexil2/py3119slexil/bin/activate

PORT =  6887

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

view:
	open http://localhost:$(PORT)/index.html


