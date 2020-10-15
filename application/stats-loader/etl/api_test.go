package main

import (
	"bytes"
	"encoding/json"
	"testing"
)

func TestBuildStructure(t *testing.T) {
	got := buildStructure()
	want := `{"date":"date","areaType":"areaType","areaName":"areaName","areaCode":"areaCode","newCasesBySpecimenDate":"newCasesBySpecimenDate","newCasesByPublishDate":"newCasesByPublishDate","cumCasesBySpecimenDateRate":"cumCasesBySpecimenDateRate","newDeaths28DaysByPublishDate":"newDeaths28DaysByPublishDate","newDeaths28DaysByDeathDate":"newDeaths28DaysByDeathDate","newPCRTestsByPublishDate":"newPCRTestsByPublishDate","cumCasesByPublishDate":"cumCasesByPublishDate","cumCasesByPublishDateRate":"cumCasesByPublishDateRate"}`
	if got != want {
		t.Errorf("buildStructure() = %v, want %v", got, want)
	}
}

func TestEncodeStructure(t *testing.T) {
	s := []string{
		"test", "hello",
	}
	got := encodeStructure(s)
	want := `{"test":"test","hello":"hello"}`

	if got != want {
		t.Errorf("encodeStructure() = %v, want %v", got, want)
	}
}

func TestBuildFilter(t *testing.T) {
	got := buildFilter("overview", "foo")
	want := "areaType=overview;areaCode=foo"
	if got != want {
		t.Errorf("buildFilter() = %v, want %v", got, want)
	}
}

func TestEncodeParams(t *testing.T) {
	got := encodeParams("myStructure", "myFilters")
	want := "filters=myFilters&structure=myStructure"
	if got != want {
		t.Errorf("encodeParams() = %v, want %v", got, want)
	}
}

func TestGenerateURL(t *testing.T) {
	got := generateURL(AreaInfo{"overview", "foo"})
	want := `/v1/data?filters=areaType%3Dfoo%3BareaCode%3Doverview&structure=%7B%22date%22%3A%22date%22%2C%22areaType%22%3A%22areaType%22%2C%22areaName%22%3A%22areaName%22%2C%22areaCode%22%3A%22areaCode%22%2C%22newCasesBySpecimenDate%22%3A%22newCasesBySpecimenDate%22%2C%22newCasesByPublishDate%22%3A%22newCasesByPublishDate%22%2C%22cumCasesBySpecimenDateRate%22%3A%22cumCasesBySpecimenDateRate%22%2C%22newDeaths28DaysByPublishDate%22%3A%22newDeaths28DaysByPublishDate%22%2C%22newDeaths28DaysByDeathDate%22%3A%22newDeaths28DaysByDeathDate%22%2C%22newPCRTestsByPublishDate%22%3A%22newPCRTestsByPublishDate%22%2C%22cumCasesByPublishDate%22%3A%22cumCasesByPublishDate%22%2C%22cumCasesByPublishDateRate%22%3A%22cumCasesByPublishDateRate%22%7D`
	if got != want {
		t.Errorf("GenerateURL() = %v, want %v", got, want)
	}
}

type TestHTTP struct{}

func (c *TestHTTP) GetJSON(url string, data interface{}) error {
	newData := APIResponse{Data: []DataResponse{{
		Date:                         "2020-09-01",
		AreaType:                     "ltla",
		AreaName:                     "Aberdeen City",
		AreaCode:                     "S12000033",
		NewCasesBySpecimenDate:       2,
		NewCasesByPublishDate:        2,
		CumCasesBySpecimenDateRate:   506.4,
		NewDeaths28DaysByPublishDate: nil,
		NewDeaths28DaysByDeathDate:   nil,
		NewPCRTestsByPublishDate:     nil,
		CumCasesByPublishDate:        nil,
		CumCasesByPublishDateRate:    nil,
	}}}
	b, err := json.Marshal(newData)
	if err != nil {
		panic("failed to marshal to bytes")
	}
	json.NewDecoder(bytes.NewReader(b)).Decode(&data)
	return nil
}

func NewTestHTTPClient() IHTTP {
	return &TestHTTP{}
}

func TestFetchStats(t *testing.T) {
	api := StatsAPI{http: NewTestHTTPClient()}
	got, err := api.FetchStats(AreaInfo{AreaCode: "S12000033", AreaType: "ltla"})
	if err != nil {
		t.Fatalf("FetchStats() returned unexpected error: %v", err)
	}
	want := []DataResponse{{
		Date:                         "2020-09-01",
		AreaType:                     "ltla",
		AreaName:                     "Aberdeen City",
		AreaCode:                     "S12000033",
		NewCasesBySpecimenDate:       2,
		NewCasesByPublishDate:        2,
		CumCasesBySpecimenDateRate:   506.4,
		NewDeaths28DaysByPublishDate: nil,
		NewDeaths28DaysByDeathDate:   nil,
		NewPCRTestsByPublishDate:     nil,
		CumCasesByPublishDate:        nil,
		CumCasesByPublishDateRate:    nil,
	}}
	if cmpDataResponse(got, want) != true {
		t.Fatalf("FetchStats() = %+v, want %+v", got, want)
	}
}

func cmpDataResponse(a, b []DataResponse) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
