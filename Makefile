# TODO make this more dynamic
build: gatsby mkdir godeps build-go

build-go:
	go build -o funcs/hello ./lambdas/hello.go
	go build -o funcs/fire ./lambdas/fire.go

gatsby:
	gatsby build

godeps:
	go mod graph
	go mod download

mkdir:
	mkdir -p funcs
