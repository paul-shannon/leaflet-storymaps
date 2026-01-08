default:
	@echo venv
	@echo server
	@echo pid
	@echo y2c
	@echo run

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

