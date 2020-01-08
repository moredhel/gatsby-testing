# TODO make this more dynamic
build: mkdir
	go build -o funcs/hello functions/hello.go

mkdir:
	mkdir -p funcs
