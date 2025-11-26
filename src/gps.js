import { log } from './log'

const defaultPositionHandler = (coords) => {
  console.log('Current position:', coords)
}

/**
 * Enable GPS tracking and call the provided handler on each position change.
 * @param {(coords: {lat: number, lon: number, accuracy: number}, rawPosition: GeolocationPosition) => void} [positionHandler]
 *        Callback invoked whenever the device reports a new position.
 * @returns {() => void} stop function to remove the GPS watcher.
 */
export const initGPS = (positionHandler = defaultPositionHandler) => {
  log.message('GPS init')

  const handler = typeof positionHandler === 'function'
    ? positionHandler
    : defaultPositionHandler

  if (!('geolocation' in navigator)) {
    log.message('Geolocation is not supported in this browser.')
    return () => {}
  }

  const success = (position) => {
    const coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy,
    }
    handler(coords, position)
  }

  const error = (err) => {
    log.message(`Failed to retrieve position: ${err}`)
    return
  }

  const watchId = navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  })

  log.message('GPS listener active')

  // return cleanup to stop watching if caller needs it
  return () => navigator.geolocation.clearWatch(watchId)
}
