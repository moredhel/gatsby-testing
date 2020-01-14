package main

import (
	"fmt"
	"os"
	"log"
	"net/http"
	"io/ioutil"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

const (
	templateUrl = "https://api.airtable.com/v0/%s/%s?view=%s"
)

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	resp := Response{
		TargetIncome: getTargetIncomes(),
		Principal: getPrincipal(),
	}

	data, _  := json.Marshal(resp)
	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body: string(data),
	}, nil
}

type Response struct {
	TargetIncome string
	Principal string
}

func callAirTable(base string, table string, view string) (*http.Response, error) {
	key := os.Getenv("AIRTABLE_KEY")
	url := fmt.Sprintf(templateUrl, base, table, view)

	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", key))

	return client.Do(req)
}

func errorResponse(err error) string {
	log.Println(err)
	return "{}"
}
func getTargetIncomes() string {
	table := "Income"
	view := "Grid%20view"
	base := os.Getenv("AIRTABLE_BASE")
	resp, err := callAirTable(base, table, view)
	if err != nil {
		return errorResponse(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return errorResponse(err)
	}
	return string(body)
}

func getPrincipal() string {
	table := "Monthly%20NW"
	view := "Grid%20view"
	base := os.Getenv("AIRTABLE_BASE")
	resp, err := callAirTable(base, table, view)
	if err != nil {
		return errorResponse(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return errorResponse(err)
	}
	return string(body)
}
func main() {
	key := os.Getenv("AIRTABLE_KEY")
	if key == "" {
		log.Fatal("AIRTABLE_KEY must be set")
	}

	// Make the handler available for Remote Procedure Call by AWS Lambda
	lambda.Start(handler)
}
