/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees to convert
 * @returns {number} The angle converted to radians
 */
export const toRadians = (degrees) => degrees * (Math.PI / 180);


/**
 * Converts an angle from radians to degrees.
 * @param {number} radians - The angle in radians to be converted.
 * @returns {number} The angle converted to degrees.
 */
export const toDegrees = (radians) => radians * (180 / Math.PI);


/**
 * Calculate the distance in meters between two GPS coordinates using the Haversine formula.
 * @param {{lat: number, lon: number}} from - Starting coordinate in degrees.
 * @param {{lat: number, lon: number}} to - Destination coordinate in degrees.
 * @returns {number} Distance in meters.
 */
export function getGPSDistance(from, to) {
  const earthRadiusMeters = 6371000;

  const lat1 = toRadians(from.lat);
  const lon1 = toRadians(from.lon);
  const lat2 = toRadians(to.lat);
  const lon2 = toRadians(to.lon);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}


/**
 * Calculate the bearing (azimuth) in degrees from the first point to the second.
 * 0 degrees points North and increases clockwise.
 * @param {{lat: number, lon: number}} from - Starting coordinate in degrees.
 * @param {{lat: number, lon: number}} to - Destination coordinate in degrees.
 * @returns {number} Bearing in degrees from 0 to 360.
 */
export function getGPSBearing(from, to) {
  const lat1 = toRadians(from.lat);
  const lon1 = toRadians(from.lon);
  const lat2 = toRadians(to.lat);
  const lon2 = toRadians(to.lon);

  const dLon = lon2 - lon1;

  const x = Math.sin(dLon) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearingRadians = Math.atan2(x, y);
  const bearingDegrees = toDegrees(bearingRadians);

  return (bearingDegrees + 360) % 360;
}

