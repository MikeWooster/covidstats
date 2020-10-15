package main

import (
	"testing"
)

// func TestPublishMessages(t *testing.T) {
// 	os.Setenv("QUEUE_URL", "https://sqs.eu-west-1.amazonaws.com/842681785316/cvdsts-prod-stats-loading-tasks")
// 	areaCodes := AreaCodes[:11]
// 	messenger := NewMessenger()
// 	err := messenger.PublishMessages(areaCodes)
// 	if err != nil {
// 		t.Fatalf("PublishMessages() got unexpected error %v", err)
// 	}
// }

func TestCalcNumBatches(t *testing.T) {
	testCases := []struct {
		areas []AreaInfo
		want  int
	}{
		{areas: make([]AreaInfo, 0), want: 0},
		{areas: make([]AreaInfo, 1), want: 1},
		{areas: make([]AreaInfo, 9), want: 1},
		{areas: make([]AreaInfo, 10), want: 1},
		{areas: make([]AreaInfo, 11), want: 2},
		{areas: make([]AreaInfo, 99), want: 10},
		{areas: make([]AreaInfo, 101), want: 11},
	}
	for _, tc := range testCases {
		got := calcNumBatches(tc.areas)
		if got != tc.want {
			t.Fatalf("calcNumBatches() = %v, want %v", got, tc.want)
		}
	}
}

func TestGetStringBodies(t *testing.T) {
	got, err := getStringBodies(AreaCodes[:10])
	if err != nil {
		t.Fatalf("getStringBodies() got unexepcted error %v", err)
	}
	want := [][]string{
		{
			`{"areaCode":"K02000001","areaType":"overview"}`,
			`{"areaCode":"E92000001","areaType":"nation"}`,
			`{"areaCode":"N92000002","areaType":"nation"}`,
			`{"areaCode":"S92000003","areaType":"nation"}`,
			`{"areaCode":"W92000004","areaType":"nation"}`,
			`{"areaCode":"E12000004","areaType":"region"}`,
			`{"areaCode":"E12000006","areaType":"region"}`,
			`{"areaCode":"E12000007","areaType":"region"}`,
			`{"areaCode":"E12000001","areaType":"region"}`,
			`{"areaCode":"E12000002","areaType":"region"}`,
		},
	}
	var i, j int
	for i < len(got) {
		for j < len(got[i]) {
			gotS := got[i][j]
			wantS := want[i][j]
			if gotS != wantS {
				t.Fatalf("getStringBodies() failed at pos (%v, %v), got = %v, want = %v", i, j, gotS, wantS)
			}
			j++
		}
		i++
	}
}

// func getEntries(input *sqs.SendMessageBatchInput) []sqs.SendMessageBatchRequestEntry {
// 	entries := input.Entries
// 	return entries
// }
