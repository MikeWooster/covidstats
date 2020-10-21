package main

type Stat struct {
	Date      string `json:"date"`
	NewCases  int    `json:"newCases"`
	NewDeaths int    `json:"newDeaths"`
	NewTests  int    `json:"newTests"`
}

type AreaStats struct {
	AreaType   string `json:"areaType"`
	AreaName   string `json:"areaName"`
	AreaCode   string `json:"areaCode"`
	Population int    `json:"population"`
	MaxTests   int    `json:"maxTests"`
	Stats      []Stat `json:"stats"`
}

// AreaInfo holds codes and types to look up
type AreaInfo struct {
	AreaCode string `json:"areaCode"`
	AreaType string `json:"areaType"`
}

// TransformStats calls the api for a specific date and
// reformats the stats accordingly.
func TransformStats(rawStats []DataResponse) (map[string]AreaStats, error) {
	stats := map[string]AreaStats{}
	for _, s := range rawStats {
		loader := GetLoader(s.AreaType)
		newStat := loader(s)
		newTests := parseInt(s.NewPCRTestsByPublishDate)
		if val, ok := stats[s.AreaCode]; ok {
			val.Stats = append(val.Stats, newStat)
			if newTests > val.MaxTests {
				val.MaxTests = newTests
			}
			stats[s.AreaCode] = val
		} else {
			stats[s.AreaCode] = AreaStats{
				AreaType:   s.AreaType,
				AreaName:   s.AreaName,
				AreaCode:   s.AreaCode,
				Population: calculatePopulation(s),
				MaxTests:   newTests,
				Stats:      []Stat{newStat},
			}
		}
	}

	return stats, nil
}

func calculatePopulation(r DataResponse) int {
	rate := parseFloat(r.CumCasesByPublishDateRate)
	tot := parseInt(r.CumCasesByPublishDate)
	if tot == 0 || rate == 0 {
		return 0
	}
	pop := (100000 * float32(tot)) / rate
	return int(pop)
}

// Loader interface for function signatures
type Loader func(DataResponse) Stat

// GetLoader factory method to return a loader function
func GetLoader(areaType string) Loader {
	loaders := map[string]Loader{
		"overview": NationLoader,
		"nation":   NationLoader,
		"region":   LocalLoader,
		"ltla":     LocalLoader,
	}
	if l, ok := loaders[areaType]; ok {
		return l
	}
	// Use nation loader as a fallback.
	return NationLoader
}

// NationLoader uses publish dates to extract the stats
func NationLoader(s DataResponse) Stat {
	return Stat{
		Date:      s.Date,
		NewCases:  s.NewCasesByPublishDate,
		NewDeaths: parseInt(s.NewDeaths28DaysByPublishDate),
		NewTests:  parseInt(s.NewPCRTestsByPublishDate),
	}
}

// LocalLoader uses specimin dates to extract stats
func LocalLoader(s DataResponse) Stat {
	return Stat{
		Date:      s.Date,
		NewCases:  s.NewCasesBySpecimenDate,
		NewDeaths: parseInt(s.NewDeaths28DaysByDeathDate),
		NewTests:  parseInt(s.NewPCRTestsByPublishDate),
	}
}

func parseInt(i *int) int {
	if i == nil {
		return 0
	}
	return *i
}

func parseFloat(f *float32) float32 {
	if f == nil {
		return 0
	}
	return *f
}
