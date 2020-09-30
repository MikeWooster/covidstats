const cache: { [key: string]: PostCodeResponse } = {};

interface PostCodeResponse {
  status: string;
  match_type: string;
  input: string;
  error?: string;
  data: {
    postcode: string;
    status: string;
    usertype: string;
    easting: number;
    northing: number;
    positional_quality_indicator: number;
    country: string;
    latitude: string;
    longitude: string;
    postcode_no_space: string;
    postcode_fixed_width_seven: string;
    postcode_fixed_width_eight: string;
    postcode_area: string;
    postcode_district: string;
    postcode_sector: string;
    outcode: string;
    incode: string;
  };
  copyright: string[];
}

export const geocodePostCode = async (
  postCode: string
): Promise<{ lon: number; lat: number }> => {
  let response: PostCodeResponse | null = null;
  if (postCode in cache) {
    response = cache[postCode];
  } else {
    const url = `https://api.getthedata.com/postcode/${encodeURIComponent(
      postCode
    )}`;
    response = (await fetch(url)
      .then((response) => response.json())
      .catch((err) => {
        throw new Error("Unable to geocode post code.");
      })) as PostCodeResponse;
    cache[postCode] = response;
  }
  if (response.error) {
    throw new Error(response.error);
  }
  if (response.match_type !== "unit_postcode") {
    throw new Error("Please enter a full post code.");
  }
  const lon = parseFloat(response.data.longitude);
  const lat = parseFloat(response.data.latitude);
  return { lon, lat };
};
