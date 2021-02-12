package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(HandleRequest)
}

// HandleRequest - lambda request handler.
func HandleRequest(ctx context.Context, event events.SQSEvent) {
	api := NewStatsAPI()
	uploader := NewUploader()

	for _, m := range event.Records {
		HandleMessage(m, api.FetchStats, TransformStats, uploader.Upload)
	}
}

// HandleMessage processes individual SQS messages
func HandleMessage(
	m events.SQSMessage,
	extractor func(AreaInfo) ([]DataResponse, error),
	transformer func([]DataResponse) (map[string]AreaStats, error),
	loader func(AreaStats) error,
) {
	area := LoadMessage(m)

	rawStats, extractErr := extractor(area)
	if extractErr != nil {
		log.Panicf("Failed to load stats from the gov API: %+v", extractErr)
	}

	stats, transformErr := transformer(rawStats)
	if transformErr != nil {
		log.Panicf("Failed to transform stats: %+v", transformErr)
	}

	for k := range stats {
		loadErr := loader(stats[k])
		if loadErr != nil {
			log.Panicf("Failed to upload stats: %+v", loadErr)
		}
	}
}

// LoadMessage into the expected AreaInfo struct
func LoadMessage(m events.SQSMessage) AreaInfo {
	var area AreaInfo
	err := MarshallFromEvent(m, &area)
	if err != nil {
		log.Panicf("Unable to extract area info (%+v) from event: %v", m, err)
	}
	return area
}

// MarshallFromEvent marshals the event message body into the supplied struct
func MarshallFromEvent(m events.SQSMessage, c interface{}) error {
	return json.Unmarshal([]byte(m.Body), c)
}
