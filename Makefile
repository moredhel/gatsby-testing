# TODO make this more dynamic
build: gatsby mkdir godeps
	go build -o funcs/hello ./lambdas/hello.go

gatsby:
	gatsby build

godeps:
	go mod graph
	go mod download

mkdir:
	mkdir -p funcs
