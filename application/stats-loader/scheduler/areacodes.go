package main

// AreaInfo holds codes and types to look up.
type AreaInfo struct {
	AreaCode string `json:"areaCode"`
	AreaType string `json:"areaType"`
}

// AreaCodes provides access to all area codes in the stats
// api that we need load stats for.
var AreaCodes = []AreaInfo{
	{AreaCode: "K02000001", AreaType: "overview"},
	{AreaCode: "E92000001", AreaType: "nation"},
	{AreaCode: "N92000002", AreaType: "nation"},
	{AreaCode: "S92000003", AreaType: "nation"},
	{AreaCode: "W92000004", AreaType: "nation"},
	{AreaCode: "E12000004", AreaType: "region"},
	{AreaCode: "E12000006", AreaType: "region"},
	{AreaCode: "E12000007", AreaType: "region"},
	{AreaCode: "E12000001", AreaType: "region"},
	{AreaCode: "E12000002", AreaType: "region"},
	{AreaCode: "E12000008", AreaType: "region"},
	{AreaCode: "E12000009", AreaType: "region"},
	{AreaCode: "E12000005", AreaType: "region"},
	{AreaCode: "E12000003", AreaType: "region"},
	{AreaCode: "S12000033", AreaType: "utla"},
	{AreaCode: "S12000034", AreaType: "utla"},
	{AreaCode: "S12000041", AreaType: "utla"},
	{AreaCode: "N09000001", AreaType: "utla"},
	{AreaCode: "N09000011", AreaType: "utla"},
	{AreaCode: "S12000035", AreaType: "utla"},
	{AreaCode: "N09000002", AreaType: "utla"},
	{AreaCode: "E09000002", AreaType: "utla"},
	{AreaCode: "E09000003", AreaType: "utla"},
	{AreaCode: "E08000016", AreaType: "utla"},
	{AreaCode: "E06000022", AreaType: "utla"},
	{AreaCode: "E06000055", AreaType: "utla"},
	{AreaCode: "N09000003", AreaType: "utla"},
	{AreaCode: "E09000004", AreaType: "utla"},
	{AreaCode: "E08000025", AreaType: "utla"},
	{AreaCode: "E06000008", AreaType: "utla"},
	{AreaCode: "E06000009", AreaType: "utla"},
	{AreaCode: "W06000019", AreaType: "utla"},
	{AreaCode: "E08000001", AreaType: "utla"},
	{AreaCode: "E06000058", AreaType: "utla"},
	{AreaCode: "E06000036", AreaType: "utla"},
	{AreaCode: "E08000032", AreaType: "utla"},
	{AreaCode: "E09000005", AreaType: "utla"},
	{AreaCode: "W06000013", AreaType: "utla"},
	{AreaCode: "E06000043", AreaType: "utla"},
	{AreaCode: "E06000023", AreaType: "utla"},
	{AreaCode: "E09000006", AreaType: "utla"},
	{AreaCode: "E10000002", AreaType: "utla"},
	{AreaCode: "E08000002", AreaType: "utla"},
	{AreaCode: "W06000018", AreaType: "utla"},
	{AreaCode: "E08000033", AreaType: "utla"},
	{AreaCode: "E10000003", AreaType: "utla"},
	{AreaCode: "E09000007", AreaType: "utla"},
	{AreaCode: "W06000015", AreaType: "utla"},
	{AreaCode: "W06000010", AreaType: "utla"},
	{AreaCode: "N09000004", AreaType: "utla"},
	{AreaCode: "E06000056", AreaType: "utla"},
	{AreaCode: "W06000008", AreaType: "utla"},
	{AreaCode: "E06000049", AreaType: "utla"},
	{AreaCode: "E06000050", AreaType: "utla"},
	{AreaCode: "S12000036", AreaType: "utla"},
	{AreaCode: "S12000005", AreaType: "utla"},
	{AreaCode: "S12000013", AreaType: "utla"},
	{AreaCode: "W06000003", AreaType: "utla"},
	{AreaCode: "E06000052", AreaType: "utla"},
	{AreaCode: "E06000047", AreaType: "utla"},
	{AreaCode: "E08000026", AreaType: "utla"},
	{AreaCode: "E09000008", AreaType: "utla"},
	{AreaCode: "E10000006", AreaType: "utla"},
	{AreaCode: "E06000005", AreaType: "utla"},
	{AreaCode: "W06000004", AreaType: "utla"},
	{AreaCode: "E06000015", AreaType: "utla"},
	{AreaCode: "E10000007", AreaType: "utla"},
	{AreaCode: "N09000005", AreaType: "utla"},
	{AreaCode: "E10000008", AreaType: "utla"},
	{AreaCode: "E08000017", AreaType: "utla"},
	{AreaCode: "E06000059", AreaType: "utla"},
	{AreaCode: "E08000027", AreaType: "utla"},
	{AreaCode: "S12000006", AreaType: "utla"},
	{AreaCode: "S12000042", AreaType: "utla"},
	{AreaCode: "E09000009", AreaType: "utla"},
	{AreaCode: "S12000008", AreaType: "utla"},
	{AreaCode: "S12000045", AreaType: "utla"},
	{AreaCode: "S12000010", AreaType: "utla"},
	{AreaCode: "S12000011", AreaType: "utla"},
	{AreaCode: "E06000011", AreaType: "utla"},
	{AreaCode: "E10000011", AreaType: "utla"},
	{AreaCode: "E09000010", AreaType: "utla"},
	{AreaCode: "E10000012", AreaType: "utla"},
	{AreaCode: "S12000014", AreaType: "utla"},
	{AreaCode: "N09000006", AreaType: "utla"},
	{AreaCode: "S12000047", AreaType: "utla"},
	{AreaCode: "W06000005", AreaType: "utla"},
	{AreaCode: "E08000037", AreaType: "utla"},
	{AreaCode: "S12000049", AreaType: "utla"},
	{AreaCode: "E10000013", AreaType: "utla"},
	{AreaCode: "E09000011", AreaType: "utla"},
	{AreaCode: "W06000002", AreaType: "utla"},
	{AreaCode: "E09000012", AreaType: "utla"},
	{AreaCode: "E06000006", AreaType: "utla"},
	{AreaCode: "E09000013", AreaType: "utla"},
	{AreaCode: "E10000014", AreaType: "utla"},
	{AreaCode: "E09000014", AreaType: "utla"},
	{AreaCode: "E09000015", AreaType: "utla"},
	{AreaCode: "E06000001", AreaType: "utla"},
	{AreaCode: "E09000016", AreaType: "utla"},
	{AreaCode: "E06000019", AreaType: "utla"},
	{AreaCode: "E10000015", AreaType: "utla"},
	{AreaCode: "S12000017", AreaType: "utla"},
	{AreaCode: "E09000017", AreaType: "utla"},
	{AreaCode: "E09000018", AreaType: "utla"},
	{AreaCode: "S12000018", AreaType: "utla"},
	{AreaCode: "W06000001", AreaType: "utla"},
	{AreaCode: "E06000046", AreaType: "utla"},
	{AreaCode: "E09000019", AreaType: "utla"},
	{AreaCode: "E09000020", AreaType: "utla"},
	{AreaCode: "E10000016", AreaType: "utla"},
	{AreaCode: "E06000010", AreaType: "utla"},
	{AreaCode: "E09000021", AreaType: "utla"},
	{AreaCode: "E08000034", AreaType: "utla"},
	{AreaCode: "E08000011", AreaType: "utla"},
	{AreaCode: "E09000022", AreaType: "utla"},
	{AreaCode: "E10000017", AreaType: "utla"},
	{AreaCode: "E08000035", AreaType: "utla"},
	{AreaCode: "E06000016", AreaType: "utla"},
	{AreaCode: "E10000018", AreaType: "utla"},
	{AreaCode: "E09000023", AreaType: "utla"},
	{AreaCode: "E10000019", AreaType: "utla"},
	{AreaCode: "N09000007", AreaType: "utla"},
	{AreaCode: "E08000012", AreaType: "utla"},
	{AreaCode: "E06000032", AreaType: "utla"},
	{AreaCode: "E08000003", AreaType: "utla"},
	{AreaCode: "E06000035", AreaType: "utla"},
	{AreaCode: "W06000024", AreaType: "utla"},
	{AreaCode: "E09000024", AreaType: "utla"},
	{AreaCode: "N09000008", AreaType: "utla"},
	{AreaCode: "N09000009", AreaType: "utla"},
	{AreaCode: "E06000002", AreaType: "utla"},
	{AreaCode: "S12000019", AreaType: "utla"},
	{AreaCode: "E06000042", AreaType: "utla"},
	{AreaCode: "W06000021", AreaType: "utla"},
	{AreaCode: "S12000020", AreaType: "utla"},
	{AreaCode: "W06000012", AreaType: "utla"},
	{AreaCode: "E08000021", AreaType: "utla"},
	{AreaCode: "E09000025", AreaType: "utla"},
	{AreaCode: "W06000022", AreaType: "utla"},
	{AreaCode: "N09000010", AreaType: "utla"},
	{AreaCode: "E10000020", AreaType: "utla"},
	{AreaCode: "S12000021", AreaType: "utla"},
	{AreaCode: "E06000012", AreaType: "utla"},
	{AreaCode: "S12000050", AreaType: "utla"},
	{AreaCode: "E06000013", AreaType: "utla"},
	{AreaCode: "E06000024", AreaType: "utla"},
	{AreaCode: "E08000022", AreaType: "utla"},
	{AreaCode: "E10000023", AreaType: "utla"},
	{AreaCode: "E10000021", AreaType: "utla"},
	{AreaCode: "E06000057", AreaType: "utla"},
	{AreaCode: "E06000018", AreaType: "utla"},
	{AreaCode: "E10000024", AreaType: "utla"},
	{AreaCode: "E08000004", AreaType: "utla"},
	{AreaCode: "S12000023", AreaType: "utla"},
	{AreaCode: "E10000025", AreaType: "utla"},
	{AreaCode: "W06000009", AreaType: "utla"},
	{AreaCode: "S12000048", AreaType: "utla"},
	{AreaCode: "E06000031", AreaType: "utla"},
	{AreaCode: "E06000026", AreaType: "utla"},
	{AreaCode: "E06000044", AreaType: "utla"},
	{AreaCode: "W06000023", AreaType: "utla"},
	{AreaCode: "E06000038", AreaType: "utla"},
	{AreaCode: "E09000026", AreaType: "utla"},
	{AreaCode: "E06000003", AreaType: "utla"},
	{AreaCode: "S12000038", AreaType: "utla"},
	{AreaCode: "W06000016", AreaType: "utla"},
	{AreaCode: "E09000027", AreaType: "utla"},
	{AreaCode: "E08000005", AreaType: "utla"},
	{AreaCode: "E08000018", AreaType: "utla"},
	{AreaCode: "E06000017", AreaType: "utla"},
	{AreaCode: "E08000006", AreaType: "utla"},
	{AreaCode: "E08000028", AreaType: "utla"},
	{AreaCode: "S12000026", AreaType: "utla"},
	{AreaCode: "E08000014", AreaType: "utla"},
	{AreaCode: "E08000019", AreaType: "utla"},
	{AreaCode: "S12000027", AreaType: "utla"},
	{AreaCode: "E06000051", AreaType: "utla"},
	{AreaCode: "E06000039", AreaType: "utla"},
	{AreaCode: "E08000029", AreaType: "utla"},
	{AreaCode: "E10000027", AreaType: "utla"},
	{AreaCode: "S12000028", AreaType: "utla"},
	{AreaCode: "E06000025", AreaType: "utla"},
	{AreaCode: "S12000029", AreaType: "utla"},
	{AreaCode: "E08000023", AreaType: "utla"},
	{AreaCode: "E06000045", AreaType: "utla"},
	{AreaCode: "E06000033", AreaType: "utla"},
	{AreaCode: "E09000028", AreaType: "utla"},
	{AreaCode: "E08000013", AreaType: "utla"},
	{AreaCode: "E10000028", AreaType: "utla"},
	{AreaCode: "S12000030", AreaType: "utla"},
	{AreaCode: "E08000007", AreaType: "utla"},
	{AreaCode: "E06000004", AreaType: "utla"},
	{AreaCode: "E06000021", AreaType: "utla"},
	{AreaCode: "E10000029", AreaType: "utla"},
	{AreaCode: "E08000024", AreaType: "utla"},
	{AreaCode: "E10000030", AreaType: "utla"},
	{AreaCode: "E09000029", AreaType: "utla"},
	{AreaCode: "W06000011", AreaType: "utla"},
	{AreaCode: "E06000030", AreaType: "utla"},
	{AreaCode: "E08000008", AreaType: "utla"},
	{AreaCode: "E06000020", AreaType: "utla"},
	{AreaCode: "E06000034", AreaType: "utla"},
	{AreaCode: "E06000027", AreaType: "utla"},
	{AreaCode: "W06000020", AreaType: "utla"},
	{AreaCode: "E09000030", AreaType: "utla"},
	{AreaCode: "E08000009", AreaType: "utla"},
	{AreaCode: "W06000014", AreaType: "utla"},
	{AreaCode: "E08000036", AreaType: "utla"},
	{AreaCode: "E08000030", AreaType: "utla"},
	{AreaCode: "E09000031", AreaType: "utla"},
	{AreaCode: "E09000032", AreaType: "utla"},
	{AreaCode: "E06000007", AreaType: "utla"},
	{AreaCode: "E10000031", AreaType: "utla"},
	{AreaCode: "E06000037", AreaType: "utla"},
	{AreaCode: "S12000039", AreaType: "utla"},
	{AreaCode: "S12000040", AreaType: "utla"},
	{AreaCode: "E10000032", AreaType: "utla"},
	{AreaCode: "E09000033", AreaType: "utla"},
	{AreaCode: "E08000010", AreaType: "utla"},
	{AreaCode: "E06000054", AreaType: "utla"},
	{AreaCode: "E06000040", AreaType: "utla"},
	{AreaCode: "E08000015", AreaType: "utla"},
	{AreaCode: "E06000041", AreaType: "utla"},
	{AreaCode: "E08000031", AreaType: "utla"},
	{AreaCode: "E10000034", AreaType: "utla"},
	{AreaCode: "W06000006", AreaType: "utla"},
	{AreaCode: "E06000014", AreaType: "utla"},
	{AreaCode: "E06000001", AreaType: "ltla"},
	{AreaCode: "E06000002", AreaType: "ltla"},
	{AreaCode: "E06000003", AreaType: "ltla"},
	{AreaCode: "E06000004", AreaType: "ltla"},
	{AreaCode: "E06000005", AreaType: "ltla"},
	{AreaCode: "E06000006", AreaType: "ltla"},
	{AreaCode: "E06000007", AreaType: "ltla"},
	{AreaCode: "E06000008", AreaType: "ltla"},
	{AreaCode: "E06000009", AreaType: "ltla"},
	{AreaCode: "E06000010", AreaType: "ltla"},
	{AreaCode: "E06000011", AreaType: "ltla"},
	{AreaCode: "E06000012", AreaType: "ltla"},
	{AreaCode: "E06000013", AreaType: "ltla"},
	{AreaCode: "E06000014", AreaType: "ltla"},
	{AreaCode: "E06000015", AreaType: "ltla"},
	{AreaCode: "E06000016", AreaType: "ltla"},
	{AreaCode: "E06000017", AreaType: "ltla"},
	{AreaCode: "E06000018", AreaType: "ltla"},
	{AreaCode: "E06000019", AreaType: "ltla"},
	{AreaCode: "E06000020", AreaType: "ltla"},
	{AreaCode: "E06000021", AreaType: "ltla"},
	{AreaCode: "E06000022", AreaType: "ltla"},
	{AreaCode: "E06000023", AreaType: "ltla"},
	{AreaCode: "E06000024", AreaType: "ltla"},
	{AreaCode: "E06000025", AreaType: "ltla"},
	{AreaCode: "E06000026", AreaType: "ltla"},
	{AreaCode: "E06000027", AreaType: "ltla"},
	{AreaCode: "E06000028", AreaType: "ltla"},
	{AreaCode: "E06000029", AreaType: "ltla"},
	{AreaCode: "E06000030", AreaType: "ltla"},
	{AreaCode: "E06000031", AreaType: "ltla"},
	{AreaCode: "E06000032", AreaType: "ltla"},
	{AreaCode: "E06000033", AreaType: "ltla"},
	{AreaCode: "E06000034", AreaType: "ltla"},
	{AreaCode: "E06000035", AreaType: "ltla"},
	{AreaCode: "E06000036", AreaType: "ltla"},
	{AreaCode: "E06000037", AreaType: "ltla"},
	{AreaCode: "E06000038", AreaType: "ltla"},
	{AreaCode: "E06000039", AreaType: "ltla"},
	{AreaCode: "E06000040", AreaType: "ltla"},
	{AreaCode: "E06000041", AreaType: "ltla"},
	{AreaCode: "E06000042", AreaType: "ltla"},
	{AreaCode: "E06000043", AreaType: "ltla"},
	{AreaCode: "E06000044", AreaType: "ltla"},
	{AreaCode: "E06000045", AreaType: "ltla"},
	{AreaCode: "E06000046", AreaType: "ltla"},
	{AreaCode: "E06000047", AreaType: "ltla"},
	{AreaCode: "E06000049", AreaType: "ltla"},
	{AreaCode: "E06000050", AreaType: "ltla"},
	{AreaCode: "E06000051", AreaType: "ltla"},
	{AreaCode: "E06000052", AreaType: "ltla"},
	{AreaCode: "E06000053", AreaType: "ltla"},
	{AreaCode: "E06000054", AreaType: "ltla"},
	{AreaCode: "E06000055", AreaType: "ltla"},
	{AreaCode: "E06000056", AreaType: "ltla"},
	{AreaCode: "E06000057", AreaType: "ltla"},
	{AreaCode: "E07000004", AreaType: "ltla"},
	{AreaCode: "E07000005", AreaType: "ltla"},
	{AreaCode: "E07000006", AreaType: "ltla"},
	{AreaCode: "E07000007", AreaType: "ltla"},
	{AreaCode: "E07000008", AreaType: "ltla"},
	{AreaCode: "E07000009", AreaType: "ltla"},
	{AreaCode: "E07000010", AreaType: "ltla"},
	{AreaCode: "E07000011", AreaType: "ltla"},
	{AreaCode: "E07000012", AreaType: "ltla"},
	{AreaCode: "E07000026", AreaType: "ltla"},
	{AreaCode: "E07000027", AreaType: "ltla"},
	{AreaCode: "E07000028", AreaType: "ltla"},
	{AreaCode: "E07000029", AreaType: "ltla"},
	{AreaCode: "E07000030", AreaType: "ltla"},
	{AreaCode: "E07000031", AreaType: "ltla"},
	{AreaCode: "E07000032", AreaType: "ltla"},
	{AreaCode: "E07000033", AreaType: "ltla"},
	{AreaCode: "E07000034", AreaType: "ltla"},
	{AreaCode: "E07000035", AreaType: "ltla"},
	{AreaCode: "E07000036", AreaType: "ltla"},
	{AreaCode: "E07000037", AreaType: "ltla"},
	{AreaCode: "E07000038", AreaType: "ltla"},
	{AreaCode: "E07000039", AreaType: "ltla"},
	{AreaCode: "E07000040", AreaType: "ltla"},
	{AreaCode: "E07000041", AreaType: "ltla"},
	{AreaCode: "E07000042", AreaType: "ltla"},
	{AreaCode: "E07000043", AreaType: "ltla"},
	{AreaCode: "E07000044", AreaType: "ltla"},
	{AreaCode: "E07000045", AreaType: "ltla"},
	{AreaCode: "E07000046", AreaType: "ltla"},
	{AreaCode: "E07000047", AreaType: "ltla"},
	{AreaCode: "E07000048", AreaType: "ltla"},
	{AreaCode: "E07000049", AreaType: "ltla"},
	{AreaCode: "E07000050", AreaType: "ltla"},
	{AreaCode: "E07000051", AreaType: "ltla"},
	{AreaCode: "E07000052", AreaType: "ltla"},
	{AreaCode: "E07000053", AreaType: "ltla"},
	{AreaCode: "E07000061", AreaType: "ltla"},
	{AreaCode: "E07000062", AreaType: "ltla"},
	{AreaCode: "E07000063", AreaType: "ltla"},
	{AreaCode: "E07000064", AreaType: "ltla"},
	{AreaCode: "E07000065", AreaType: "ltla"},
	{AreaCode: "E07000066", AreaType: "ltla"},
	{AreaCode: "E07000067", AreaType: "ltla"},
	{AreaCode: "E07000068", AreaType: "ltla"},
	{AreaCode: "E07000069", AreaType: "ltla"},
	{AreaCode: "E07000070", AreaType: "ltla"},
	{AreaCode: "E07000071", AreaType: "ltla"},
	{AreaCode: "E07000072", AreaType: "ltla"},
	{AreaCode: "E07000073", AreaType: "ltla"},
	{AreaCode: "E07000074", AreaType: "ltla"},
	{AreaCode: "E07000075", AreaType: "ltla"},
	{AreaCode: "E07000076", AreaType: "ltla"},
	{AreaCode: "E07000077", AreaType: "ltla"},
	{AreaCode: "E07000078", AreaType: "ltla"},
	{AreaCode: "E07000079", AreaType: "ltla"},
	{AreaCode: "E07000080", AreaType: "ltla"},
	{AreaCode: "E07000081", AreaType: "ltla"},
	{AreaCode: "E07000082", AreaType: "ltla"},
	{AreaCode: "E07000083", AreaType: "ltla"},
	{AreaCode: "E07000084", AreaType: "ltla"},
	{AreaCode: "E07000085", AreaType: "ltla"},
	{AreaCode: "E07000086", AreaType: "ltla"},
	{AreaCode: "E07000087", AreaType: "ltla"},
	{AreaCode: "E07000088", AreaType: "ltla"},
	{AreaCode: "E07000089", AreaType: "ltla"},
	{AreaCode: "E07000090", AreaType: "ltla"},
	{AreaCode: "E07000091", AreaType: "ltla"},
	{AreaCode: "E07000092", AreaType: "ltla"},
	{AreaCode: "E07000093", AreaType: "ltla"},
	{AreaCode: "E07000094", AreaType: "ltla"},
	{AreaCode: "E07000095", AreaType: "ltla"},
	{AreaCode: "E07000096", AreaType: "ltla"},
	{AreaCode: "E07000098", AreaType: "ltla"},
	{AreaCode: "E07000099", AreaType: "ltla"},
	{AreaCode: "E07000102", AreaType: "ltla"},
	{AreaCode: "E07000103", AreaType: "ltla"},
	{AreaCode: "E07000105", AreaType: "ltla"},
	{AreaCode: "E07000106", AreaType: "ltla"},
	{AreaCode: "E07000107", AreaType: "ltla"},
	{AreaCode: "E07000108", AreaType: "ltla"},
	{AreaCode: "E07000109", AreaType: "ltla"},
	{AreaCode: "E07000110", AreaType: "ltla"},
	{AreaCode: "E07000111", AreaType: "ltla"},
	{AreaCode: "E07000112", AreaType: "ltla"},
	{AreaCode: "E07000113", AreaType: "ltla"},
	{AreaCode: "E07000114", AreaType: "ltla"},
	{AreaCode: "E07000115", AreaType: "ltla"},
	{AreaCode: "E07000116", AreaType: "ltla"},
	{AreaCode: "E07000117", AreaType: "ltla"},
	{AreaCode: "E07000118", AreaType: "ltla"},
	{AreaCode: "E07000119", AreaType: "ltla"},
	{AreaCode: "E07000120", AreaType: "ltla"},
	{AreaCode: "E07000121", AreaType: "ltla"},
	{AreaCode: "E07000122", AreaType: "ltla"},
	{AreaCode: "E07000123", AreaType: "ltla"},
	{AreaCode: "E07000124", AreaType: "ltla"},
	{AreaCode: "E07000125", AreaType: "ltla"},
	{AreaCode: "E07000126", AreaType: "ltla"},
	{AreaCode: "E07000127", AreaType: "ltla"},
	{AreaCode: "E07000128", AreaType: "ltla"},
	{AreaCode: "E07000129", AreaType: "ltla"},
	{AreaCode: "E07000130", AreaType: "ltla"},
	{AreaCode: "E07000131", AreaType: "ltla"},
	{AreaCode: "E07000132", AreaType: "ltla"},
	{AreaCode: "E07000133", AreaType: "ltla"},
	{AreaCode: "E07000134", AreaType: "ltla"},
	{AreaCode: "E07000135", AreaType: "ltla"},
	{AreaCode: "E07000136", AreaType: "ltla"},
	{AreaCode: "E07000137", AreaType: "ltla"},
	{AreaCode: "E07000138", AreaType: "ltla"},
	{AreaCode: "E07000139", AreaType: "ltla"},
	{AreaCode: "E07000140", AreaType: "ltla"},
	{AreaCode: "E07000141", AreaType: "ltla"},
	{AreaCode: "E07000142", AreaType: "ltla"},
	{AreaCode: "E07000143", AreaType: "ltla"},
	{AreaCode: "E07000144", AreaType: "ltla"},
	{AreaCode: "E07000145", AreaType: "ltla"},
	{AreaCode: "E07000146", AreaType: "ltla"},
	{AreaCode: "E07000147", AreaType: "ltla"},
	{AreaCode: "E07000148", AreaType: "ltla"},
	{AreaCode: "E07000149", AreaType: "ltla"},
	{AreaCode: "E07000150", AreaType: "ltla"},
	{AreaCode: "E07000151", AreaType: "ltla"},
	{AreaCode: "E07000152", AreaType: "ltla"},
	{AreaCode: "E07000153", AreaType: "ltla"},
	{AreaCode: "E07000154", AreaType: "ltla"},
	{AreaCode: "E07000155", AreaType: "ltla"},
	{AreaCode: "E07000156", AreaType: "ltla"},
	{AreaCode: "E07000163", AreaType: "ltla"},
	{AreaCode: "E07000164", AreaType: "ltla"},
	{AreaCode: "E07000165", AreaType: "ltla"},
	{AreaCode: "E07000166", AreaType: "ltla"},
	{AreaCode: "E07000167", AreaType: "ltla"},
	{AreaCode: "E07000168", AreaType: "ltla"},
	{AreaCode: "E07000169", AreaType: "ltla"},
	{AreaCode: "E07000170", AreaType: "ltla"},
	{AreaCode: "E07000171", AreaType: "ltla"},
	{AreaCode: "E07000172", AreaType: "ltla"},
	{AreaCode: "E07000173", AreaType: "ltla"},
	{AreaCode: "E07000174", AreaType: "ltla"},
	{AreaCode: "E07000175", AreaType: "ltla"},
	{AreaCode: "E07000176", AreaType: "ltla"},
	{AreaCode: "E07000177", AreaType: "ltla"},
	{AreaCode: "E07000178", AreaType: "ltla"},
	{AreaCode: "E07000179", AreaType: "ltla"},
	{AreaCode: "E07000180", AreaType: "ltla"},
	{AreaCode: "E07000181", AreaType: "ltla"},
	{AreaCode: "E07000187", AreaType: "ltla"},
	{AreaCode: "E07000188", AreaType: "ltla"},
	{AreaCode: "E07000189", AreaType: "ltla"},
	{AreaCode: "E07000190", AreaType: "ltla"},
	{AreaCode: "E07000191", AreaType: "ltla"},
	{AreaCode: "E07000192", AreaType: "ltla"},
	{AreaCode: "E07000193", AreaType: "ltla"},
	{AreaCode: "E07000194", AreaType: "ltla"},
	{AreaCode: "E07000195", AreaType: "ltla"},
	{AreaCode: "E07000196", AreaType: "ltla"},
	{AreaCode: "E07000197", AreaType: "ltla"},
	{AreaCode: "E07000198", AreaType: "ltla"},
	{AreaCode: "E07000199", AreaType: "ltla"},
	{AreaCode: "E07000200", AreaType: "ltla"},
	{AreaCode: "E07000201", AreaType: "ltla"},
	{AreaCode: "E07000202", AreaType: "ltla"},
	{AreaCode: "E07000203", AreaType: "ltla"},
	{AreaCode: "E07000204", AreaType: "ltla"},
	{AreaCode: "E07000205", AreaType: "ltla"},
	{AreaCode: "E07000206", AreaType: "ltla"},
	{AreaCode: "E07000207", AreaType: "ltla"},
	{AreaCode: "E07000208", AreaType: "ltla"},
	{AreaCode: "E07000209", AreaType: "ltla"},
	{AreaCode: "E07000210", AreaType: "ltla"},
	{AreaCode: "E07000211", AreaType: "ltla"},
	{AreaCode: "E07000212", AreaType: "ltla"},
	{AreaCode: "E07000213", AreaType: "ltla"},
	{AreaCode: "E07000214", AreaType: "ltla"},
	{AreaCode: "E07000215", AreaType: "ltla"},
	{AreaCode: "E07000216", AreaType: "ltla"},
	{AreaCode: "E07000217", AreaType: "ltla"},
	{AreaCode: "E07000218", AreaType: "ltla"},
	{AreaCode: "E07000219", AreaType: "ltla"},
	{AreaCode: "E07000220", AreaType: "ltla"},
	{AreaCode: "E07000221", AreaType: "ltla"},
	{AreaCode: "E07000222", AreaType: "ltla"},
	{AreaCode: "E07000223", AreaType: "ltla"},
	{AreaCode: "E07000224", AreaType: "ltla"},
	{AreaCode: "E07000225", AreaType: "ltla"},
	{AreaCode: "E07000226", AreaType: "ltla"},
	{AreaCode: "E07000227", AreaType: "ltla"},
	{AreaCode: "E07000228", AreaType: "ltla"},
	{AreaCode: "E07000229", AreaType: "ltla"},
	{AreaCode: "E07000234", AreaType: "ltla"},
	{AreaCode: "E07000235", AreaType: "ltla"},
	{AreaCode: "E07000236", AreaType: "ltla"},
	{AreaCode: "E07000237", AreaType: "ltla"},
	{AreaCode: "E07000238", AreaType: "ltla"},
	{AreaCode: "E07000239", AreaType: "ltla"},
	{AreaCode: "E07000240", AreaType: "ltla"},
	{AreaCode: "E07000241", AreaType: "ltla"},
	{AreaCode: "E07000242", AreaType: "ltla"},
	{AreaCode: "E07000243", AreaType: "ltla"},
	{AreaCode: "E08000001", AreaType: "ltla"},
	{AreaCode: "E08000002", AreaType: "ltla"},
	{AreaCode: "E08000003", AreaType: "ltla"},
	{AreaCode: "E08000004", AreaType: "ltla"},
	{AreaCode: "E08000005", AreaType: "ltla"},
	{AreaCode: "E08000006", AreaType: "ltla"},
	{AreaCode: "E08000007", AreaType: "ltla"},
	{AreaCode: "E08000008", AreaType: "ltla"},
	{AreaCode: "E08000009", AreaType: "ltla"},
	{AreaCode: "E08000010", AreaType: "ltla"},
	{AreaCode: "E08000011", AreaType: "ltla"},
	{AreaCode: "E08000012", AreaType: "ltla"},
	{AreaCode: "E08000013", AreaType: "ltla"},
	{AreaCode: "E08000014", AreaType: "ltla"},
	{AreaCode: "E08000015", AreaType: "ltla"},
	{AreaCode: "E08000016", AreaType: "ltla"},
	{AreaCode: "E08000017", AreaType: "ltla"},
	{AreaCode: "E08000018", AreaType: "ltla"},
	{AreaCode: "E08000019", AreaType: "ltla"},
	{AreaCode: "E08000021", AreaType: "ltla"},
	{AreaCode: "E08000022", AreaType: "ltla"},
	{AreaCode: "E08000023", AreaType: "ltla"},
	{AreaCode: "E08000024", AreaType: "ltla"},
	{AreaCode: "E08000025", AreaType: "ltla"},
	{AreaCode: "E08000026", AreaType: "ltla"},
	{AreaCode: "E08000027", AreaType: "ltla"},
	{AreaCode: "E08000028", AreaType: "ltla"},
	{AreaCode: "E08000029", AreaType: "ltla"},
	{AreaCode: "E08000030", AreaType: "ltla"},
	{AreaCode: "E08000031", AreaType: "ltla"},
	{AreaCode: "E08000032", AreaType: "ltla"},
	{AreaCode: "E08000033", AreaType: "ltla"},
	{AreaCode: "E08000034", AreaType: "ltla"},
	{AreaCode: "E08000035", AreaType: "ltla"},
	{AreaCode: "E08000036", AreaType: "ltla"},
	{AreaCode: "E08000037", AreaType: "ltla"},
	{AreaCode: "E09000001", AreaType: "ltla"},
	{AreaCode: "E09000002", AreaType: "ltla"},
	{AreaCode: "E09000003", AreaType: "ltla"},
	{AreaCode: "E09000004", AreaType: "ltla"},
	{AreaCode: "E09000005", AreaType: "ltla"},
	{AreaCode: "E09000006", AreaType: "ltla"},
	{AreaCode: "E09000007", AreaType: "ltla"},
	{AreaCode: "E09000008", AreaType: "ltla"},
	{AreaCode: "E09000009", AreaType: "ltla"},
	{AreaCode: "E09000010", AreaType: "ltla"},
	{AreaCode: "E09000011", AreaType: "ltla"},
	{AreaCode: "E09000012", AreaType: "ltla"},
	{AreaCode: "E09000013", AreaType: "ltla"},
	{AreaCode: "E09000014", AreaType: "ltla"},
	{AreaCode: "E09000015", AreaType: "ltla"},
	{AreaCode: "E09000016", AreaType: "ltla"},
	{AreaCode: "E09000017", AreaType: "ltla"},
	{AreaCode: "E09000018", AreaType: "ltla"},
	{AreaCode: "E09000019", AreaType: "ltla"},
	{AreaCode: "E09000020", AreaType: "ltla"},
	{AreaCode: "E09000021", AreaType: "ltla"},
	{AreaCode: "E09000022", AreaType: "ltla"},
	{AreaCode: "E09000023", AreaType: "ltla"},
	{AreaCode: "E09000024", AreaType: "ltla"},
	{AreaCode: "E09000025", AreaType: "ltla"},
	{AreaCode: "E09000026", AreaType: "ltla"},
	{AreaCode: "E09000027", AreaType: "ltla"},
	{AreaCode: "E09000028", AreaType: "ltla"},
	{AreaCode: "E09000029", AreaType: "ltla"},
	{AreaCode: "E09000030", AreaType: "ltla"},
	{AreaCode: "E09000031", AreaType: "ltla"},
	{AreaCode: "E09000032", AreaType: "ltla"},
	{AreaCode: "E09000033", AreaType: "ltla"},
	{AreaCode: "S12000005", AreaType: "ltla"},
	{AreaCode: "S12000006", AreaType: "ltla"},
	{AreaCode: "S12000008", AreaType: "ltla"},
	{AreaCode: "S12000010", AreaType: "ltla"},
	{AreaCode: "S12000011", AreaType: "ltla"},
	{AreaCode: "S12000013", AreaType: "ltla"},
	{AreaCode: "S12000014", AreaType: "ltla"},
	{AreaCode: "S12000015", AreaType: "ltla"},
	{AreaCode: "S12000017", AreaType: "ltla"},
	{AreaCode: "S12000018", AreaType: "ltla"},
	{AreaCode: "S12000019", AreaType: "ltla"},
	{AreaCode: "S12000020", AreaType: "ltla"},
	{AreaCode: "S12000021", AreaType: "ltla"},
	{AreaCode: "S12000023", AreaType: "ltla"},
	{AreaCode: "S12000024", AreaType: "ltla"},
	{AreaCode: "S12000026", AreaType: "ltla"},
	{AreaCode: "S12000027", AreaType: "ltla"},
	{AreaCode: "S12000028", AreaType: "ltla"},
	{AreaCode: "S12000029", AreaType: "ltla"},
	{AreaCode: "S12000030", AreaType: "ltla"},
	{AreaCode: "S12000033", AreaType: "ltla"},
	{AreaCode: "S12000034", AreaType: "ltla"},
	{AreaCode: "S12000035", AreaType: "ltla"},
	{AreaCode: "S12000036", AreaType: "ltla"},
	{AreaCode: "S12000038", AreaType: "ltla"},
	{AreaCode: "S12000039", AreaType: "ltla"},
	{AreaCode: "S12000040", AreaType: "ltla"},
	{AreaCode: "S12000041", AreaType: "ltla"},
	{AreaCode: "S12000042", AreaType: "ltla"},
	{AreaCode: "S12000044", AreaType: "ltla"},
	{AreaCode: "S12000045", AreaType: "ltla"},
	{AreaCode: "S12000046", AreaType: "ltla"},
	{AreaCode: "W06000001", AreaType: "ltla"},
	{AreaCode: "W06000002", AreaType: "ltla"},
	{AreaCode: "W06000003", AreaType: "ltla"},
	{AreaCode: "W06000004", AreaType: "ltla"},
	{AreaCode: "W06000005", AreaType: "ltla"},
	{AreaCode: "W06000006", AreaType: "ltla"},
	{AreaCode: "W06000008", AreaType: "ltla"},
	{AreaCode: "W06000009", AreaType: "ltla"},
	{AreaCode: "W06000010", AreaType: "ltla"},
	{AreaCode: "W06000011", AreaType: "ltla"},
	{AreaCode: "W06000012", AreaType: "ltla"},
	{AreaCode: "W06000013", AreaType: "ltla"},
	{AreaCode: "W06000014", AreaType: "ltla"},
	{AreaCode: "W06000015", AreaType: "ltla"},
	{AreaCode: "W06000016", AreaType: "ltla"},
	{AreaCode: "W06000018", AreaType: "ltla"},
	{AreaCode: "W06000019", AreaType: "ltla"},
	{AreaCode: "W06000020", AreaType: "ltla"},
	{AreaCode: "W06000021", AreaType: "ltla"},
	{AreaCode: "W06000022", AreaType: "ltla"},
	{AreaCode: "W06000023", AreaType: "ltla"},
	{AreaCode: "W06000024", AreaType: "ltla"},
}
