default:
	@echo venv
	@echo server
	@echo run

venv:
	@echo source /Users/paul/github/slexil2/py3105slexil/bin/activate

server:
	python -m http.server 8001

y2c:
	(cd csv; R -f yamlToCsv.R)

run:
	open http://127.0.0.1:8001/readCsv.html

