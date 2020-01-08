# TODO make this more dynamic
build: mkdir
	go build -o funcs/hello ./lambdas/hello.go

mkdir:
	mkdir -p funcs
