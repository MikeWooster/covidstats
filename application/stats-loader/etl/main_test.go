package main

import (
	"encoding/json"
	"log"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func createSQSMessage(area AreaInfo) events.SQSMessage {
	b, err := json.Marshal(area)
	if err != nil {
		log.Panicf("error marshalling to bytes: %v", err)
	}
	return events.SQSMessage{Body: string(b)}
}

func TestMarshallFromEvent(t *testing.T) {
	want := AreaInfo{AreaCode: "E06000001", AreaType: "ltla"}
	m := createSQSMessage(want)
	var got AreaInfo
	MarshallFromEvent(m, &got)
	if got != want {
		t.Errorf("MarshallFromEvent() = %v, want %v", got, want)
	}
}

func TestLoadMessage(t *testing.T) {
	want := AreaInfo{AreaCode: "E06000001", AreaType: "ltla"}
	m := createSQSMessage(want)
	got := LoadMessage(m)
	if got != want {
		t.Errorf("LoadMessage() = %v, want %v", got, want)
	}
}

// func TestHandleRequest(t *testing.T) {
// 	for _, a := range AreaCodes {
// 		event := events.SQSEvent{Records: []events.SQSMessage{
// 			createSQSMessage(a),
// 		}}
// 		HandleRequest(nil, event)
// 	}
// }
