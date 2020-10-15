package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/google/uuid"
)

func main() {
	lambda.Start(HandleRequest)
}

// HandleRequest - lambda request handler.
func HandleRequest(ctx context.Context, event events.CloudWatchEvent) {
	messenger := NewMessenger()
	messenger.PublishMessages(AreaCodes)
}

func NewMessenger() *SQS {
	url := os.Getenv("QUEUE_URL")
	sess := session.Must(session.NewSession())
	return &SQS{
		url: aws.String(url),
		sqs: sqs.New(sess, &aws.Config{Region: aws.String("eu-west-1")}),
	}
}

type SQS struct {
	url *string
	sqs *sqs.SQS
}

func (s *SQS) PublishMessages(areas []AreaInfo) error {
	stringBodies, err := getStringBodies(areas)
	if err != nil {
		return fmt.Errorf("Failed to generate string bodies for upload: %w", err)
	}
	for _, bodies := range stringBodies {
		_, sendErr := s.sendBatch(bodies)
		if sendErr != nil {
			return fmt.Errorf("Failed to send message batch = %w", sendErr)
		}
	}
	return nil
}

func getStringBodies(areas []AreaInfo) ([][]string, error) {
	numBatches := (len(areas)-1)/10 + 1
	var allBodies [][]string
	var area *AreaInfo

	b := 0
	for b < numBatches {
		if len(areas) == 0 {
			break
		}

		i := 0
		var bodies []string
		for i < 10 {
			area, areas = pop(areas)
			if area == nil {
				break
			}
			body, err := json.Marshal(*area)
			if err != nil {
				return allBodies, fmt.Errorf("Failed to marshal body: %v - %w", area, err)
			}
			bodies = append(bodies, string(body))
			i++
		}
		allBodies = append(allBodies, bodies)

		b++
	}
	return allBodies, nil
}

func pop(areas []AreaInfo) (*AreaInfo, []AreaInfo) {
	if len(areas) == 0 {
		return nil, areas
	}
	return &areas[0], areas[1:]
}

func calcNumBatches(areas []AreaInfo) int {
	if len(areas) == 0 {
		return 0
	}
	return (len(areas)-1)/10 + 1
}

func (s *SQS) sendBatch(bodies []string) (*sqs.SendMessageBatchOutput, error) {
	log.Printf("Publishing batch of messages: %+v", bodies)

	var entries []*sqs.SendMessageBatchRequestEntry
	entries = make([]*sqs.SendMessageBatchRequestEntry, len(bodies))

	for i, body := range bodies {
		uuid, uuidErr := uuid.NewRandom()
		if uuidErr != nil {
			return nil, fmt.Errorf("Failed to generate uuid: %w", uuidErr)
		}
		entries[i] = &sqs.SendMessageBatchRequestEntry{
			Id:          aws.String(uuid.String()),
			MessageBody: aws.String(body),
		}
	}
	return s.sqs.SendMessageBatch(&sqs.SendMessageBatchInput{
		Entries:  entries,
		QueueUrl: s.url,
	})
}
