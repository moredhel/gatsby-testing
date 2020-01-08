package main

import (
	"fmt"
	"os"
	"log"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

const (
	templateUrl = "https://api.airtable.com/v0/appL2X8bMcfRY4v68/%s?view=%s"
)

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	fmt.Println("Request Received")

	return getTargetNetIncomes(), nil
}

func callAirTable(table string, view string) (*http.Response, error) {
	key := os.Getenv("AIRTABLE_KEY")
	url := fmt.Sprintf(templateUrl, table, view)

	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", key))

	return client.Do(req)
}

func getTargetNetIncomes() *events.APIGatewayProxyResponse {
	table := "Income"
	view := "Grid%20view"
	_, err := callAirTable(table, view)
	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body: "{}",
		}
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body: "{\"status\": true}",
	}
}

func main() {
	key := os.Getenv("AIRTABLE_KEY")
	if key == "" {
		log.Fatal("AIRTABLE_KEY must be set")
	}

	// Make the handler available for Remote Procedure Call by AWS Lambda
	lambda.Start(handler)
}
