package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const baseURL = "https://api.coronavirus.data.gov.uk"

// IHTTP is an interface representing the ability to
// issue an HTTP request and decode a JSON response into
// a given data structure.
type IHTTP interface {
	GetJSON(url string, data interface{}) error
}

// HTTP implements the IHTTP interface to issue requests to the gov api.
type HTTP struct {
	http *http.Client
}

// GetJSON requests data from the specified url decoding to the supplied structure.
func (c *HTTP) GetJSON(url string, data interface{}) error {
	log.Printf("Fetching URL = %v", url)
	resp, getErr := c.http.Get(url)
	if getErr != nil {
		return fmt.Errorf("Error fetching url %s with = %w", url, getErr)
	}

	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("Error fetching url %s. Got status code = %v", url, resp.StatusCode)
	}
	log.Printf("Status code = %v", resp.StatusCode)
	// Handle no data for the region
	if resp.StatusCode == 204 {
		return nil
	}
	decodeErr := json.NewDecoder(resp.Body).Decode(&data)
	if decodeErr != nil {
		return fmt.Errorf("Error fetching url %s. Failed to un-marshall response body to json. %w", url, decodeErr)
	}
	return nil
}

// StatsAPI contains methods to get the stats for a given area.
type StatsAPI struct {
	http IHTTP
}

// NewStatsAPI creates a StatsAPI.
func NewStatsAPI() *StatsAPI {
	api := &StatsAPI{
		http: &HTTP{http: &http.Client{Timeout: 2 * time.Second}},
	}
	return api
}

// DataResponse represents the response to the gov api for a single stat.
type DataResponse struct {
	AreaType                     string   `json:"areaType"`
	AreaName                     string   `json:"areaName"`
	AreaCode                     string   `json:"areaCode"`
	Date                         string   `json:"date"`
	NewCasesBySpecimenDate       int      `json:"newCasesBySpecimenDate"`
	NewCasesByPublishDate        int      `json:"newCasesByPublishDate"`
	CumCasesBySpecimenDateRate   float32  `json:"cumCasesBySpecimenDateRate"`
	NewDeaths28DaysByPublishDate *int     `json:"newDeaths28DaysByPublishDate"`
	NewDeaths28DaysByDeathDate   *int     `json:"newDeaths28DaysByDeathDate"`
	NewPCRTestsByPublishDate     *int     `json:"newPCRTestsByPublishDate"`
	CumCasesByPublishDate        *int     `json:"cumCasesByPublishDate"`
	CumCasesByPublishDateRate    *float32 `json:"cumCasesByPublishDateRate"`
}

// APIResponse represents the response to the gov api.
type APIResponse struct {
	Data         []DataResponse `json:"data"`
	Length       int            `json:"length"`
	MaxPageLimit int            `json:"maxPageLimit"`
	Pagination   struct {
		Current string  `json:"current"`
		First   string  `json:"first"`
		Last    string  `json:"last"`
		Next    *string `json:"next"`
	} `json:"pagination"`
}

// FetchStats returns the stats from the gov api.
func (s *StatsAPI) FetchStats(area AreaInfo) ([]DataResponse, error) {
	url := generateURL(area)
	r, err := s.paginate(&url)
	if err != nil {
		return r, err
	}
	return r, nil
}

func generateURL(area AreaInfo) string {
	structure := buildStructure()
	filters := buildFilter(area.AreaType, area.AreaCode)
	return "/v1/data?" + encodeParams(structure, filters)
}

// request multiple pages from the gov api.
func (s *StatsAPI) paginate(url *string) ([]DataResponse, error) {
	var r []DataResponse
	for url != nil {
		fullURL := baseURL + *url
		page, err := s.getPage(fullURL)
		if err != nil {
			return r, err
		}
		r = extend(r, page.Data)
		url = page.Pagination.Next
	}
	return r, nil
}

func extend(c, r []DataResponse) []DataResponse {
	for _, e := range r {
		c = append(c, e)
	}
	return c
}

func (s *StatsAPI) getPage(url string) (APIResponse, error) {
	r := APIResponse{}
	err := s.http.GetJSON(url, &r)
	if err != nil {
		return r, err
	}
	return r, nil
}

func buildStructure() string {
	s := []string{"date",
		"areaType",
		"areaName",
		"areaCode",
		"newCasesBySpecimenDate",
		"newCasesByPublishDate",
		"cumCasesBySpecimenDateRate",
		"newDeaths28DaysByPublishDate",
		"newDeaths28DaysByDeathDate",
		"newPCRTestsByPublishDate",
		"cumCasesByPublishDate",
		"cumCasesByPublishDateRate"}
	return encodeStructure(s)
}

func encodeStructure(s []string) string {
	var fmtS = make([]string, len(s))
	for i := range s {
		fmtS[i] = fmt.Sprintf(`"%[1]s":"%[1]s"`, s[i])
	}
	enc := strings.Join(fmtS, ",")
	return fmt.Sprintf("{%s}", enc)
}

func buildFilter(areaType, areaCode string) string {
	arr := []string{
		fmt.Sprintf("areaType=%s", areaType),
		fmt.Sprintf("areaCode=%s", areaCode),
	}
	return strings.Join(arr, ";")
}

func encodeParams(structure, filters string) string {
	p := url.Values{}
	p.Add("filters", filters)
	p.Add("structure", structure)
	return p.Encode()
}
