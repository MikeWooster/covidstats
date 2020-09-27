// getNeighbouringLAs will return a string of local authority codes

import geocoded from "./LAlut";

//that fall within the search radius (in meters).
export const getNeighbouringLAs = (
  lon: number,
  lat: number,
  radius: number
): string[] => {
  // Fallback incase we can't identify a LA within the search radius.
  const nearestLA: { code: string; distance: null | number } = {
    code: "",
    distance: null,
  };

  const keys = Object.keys(geocoded);
  const codes: string[] = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const dist = measure(lon, lat, geocoded[key][0], geocoded[key][1]);
    if (dist <= radius) {
      codes.push(key);
    }
    if (nearestLA.distance === null || dist < nearestLA.distance) {
      nearestLA.code = key;
      nearestLA.distance = dist;
    }
  }
  if (codes.length === 0) {
    return [nearestLA.code];
  }
  return codes;
};

const measure = (
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
): number => {
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
};
