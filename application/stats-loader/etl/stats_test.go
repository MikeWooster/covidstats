package main

import (
	"reflect"
	"testing"
)

func TestGetStats(t *testing.T) {
	rawStats := []DataResponse{
		{
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
		},
		{
			Date:                         "2020-09-02",
			AreaType:                     "ltla",
			AreaName:                     "Aberdeen City",
			AreaCode:                     "S12000033",
			NewCasesBySpecimenDate:       4,
			NewCasesByPublishDate:        8,
			CumCasesBySpecimenDateRate:   1006.4,
			NewDeaths28DaysByPublishDate: nil,
			NewDeaths28DaysByDeathDate:   nil,
			NewPCRTestsByPublishDate:     nil,
			CumCasesByPublishDate:        nil,
			CumCasesByPublishDateRate:    nil,
		},
	}
	got, err := TransformStats(rawStats)
	if err != nil {
		t.Fatalf("GetStats() returned unexpected error %v", err)
	}

	want := map[string]AreaStats{
		"S12000033": {
			AreaType:   "ltla",
			AreaName:   "Aberdeen City",
			AreaCode:   "S12000033",
			Population: 0,
			MaxTests:   0,
			Stats: []Stat{
				{
					Date:      "2020-09-01",
					NewCases:  2,
					NewDeaths: 0,
					NewTests:  0,
				},
				{
					Date:      "2020-09-02",
					NewCases:  4,
					NewDeaths: 0,
					NewTests:  0,
				},
			}}}
	if reflect.DeepEqual(got, want) != true {
		t.Fatalf("GetStats() = %+v want %+v", got, want)
	}
}
