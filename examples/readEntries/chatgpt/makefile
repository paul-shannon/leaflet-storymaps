default:
	@echo venv
	@echo server
	@echo pid
	@echo run

PORT = 8004

venv:
	@echo source /Users/paul/github/slexil2/py3105slexil/bin/activate

server:
	python -m http.server $(PORT) &

pid:
	lsof -i -n -P | grep $(PORT)

y2c:
	(cd csv; R -f yamlToCsv.R)

run:
	open http://127.0.0.1:$(PORT)/v3.html



