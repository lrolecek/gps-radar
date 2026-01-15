import './style.css'
import './radar.css'
import './goal.css'
import './info.css'
import './log.css'

import { log } from './log'

import {
  getGPSBearing,
  getGPSDistance,
} from './geo-helpers'

import { initOrientation } from './orientation'
import { initGPS } from './gps'


log.message('App start - v0.01')
log.divider()


// current position
let currentPos = {
  lon: null,
  lat: null,
  accuracy: null,
  alpha: null,
  absolute: null,
  webkitCompassHeading: null,
}

// goal position
// ALBERT BRNO
let goalPos = {
  lon: 16.6235874,
  lat: 49.2239618,
}
// MEWS PRAHA
// let goalPos = {
//   lon: 14.4302007,
//   lat: 50.0751690,
// }

console.log('Distance to goal:', getGPSDistance(currentPos, goalPos))
console.log('Bearing to goal:', getGPSBearing(currentPos, goalPos))

const elRadarGoal = document.querySelector('#radar-goal')
const elGoalArrow = document.querySelector('#goal-arrow')
const elGoalDistance = document.querySelector('#goal-distance')

const elLat = document.querySelector('#lat')
const elLon = document.querySelector('#lon')
const elAlpha = document.querySelector('#alpha')

const elAbsolute = document.querySelector('#absolute')
const elWebkitCompassHeading = document.querySelector('#webkit-compass')

const elCompassBtn = document.querySelector('#compass-btn')

const handleOrientation = (event) => {
  const {alpha, absolute} = event

  const webkitCompassHeading = 'webkitCompassHeading' in event ? event.webkitCompassHeading : 'not supported'

  currentPos = {
    ...currentPos,
    alpha,
    absolute,
    webkitCompassHeading,
  }
  if (alpha === null) {
    log.message('Orientation failed, alpha = null')
  }
  updateDisplay()
}

const handlePosition = (coords) => {
  currentPos = {
    ...currentPos,
    ...coords,
  }
  updateDisplay()
}


const updateDisplay = () => {
  // update text info
  elLon.textContent = currentPos.lon === null ? 'null' : `${currentPos.lon.toFixed(7)}`
  elLat.textContent = currentPos.lat === null ? 'null' : `${currentPos.lat.toFixed(7)}`
  elAlpha.textContent = currentPos.alpha === null ? 'null' : currentPos.alpha.toFixed(0) + '°'
  elAbsolute.textContent = currentPos.absolute ? 'absolute' : 'relative'
  elWebkitCompassHeading.textContent = typeof currentPos.WebkitCompassHeading === 'number' ?  currentPos.webkitCompassHeading.toFixed(0) + '°' : currentPos.WebkitCompassHeading

  // calculate distance and bearing to target
  const distance = getGPSDistance(currentPos, goalPos)
  const bearing = getGPSBearing(currentPos, goalPos)

  // calculate angle to target
  // based on where the top of the phone is pointing
  const alpha = currentPos.alpha === null ? 0 : currentPos.alpha
  const angle = alpha + bearing

  // update distance
  elGoalDistance.textContent = distance < 1000
    ? distance.toFixed(0) + ' m'
    : (distance / 1000).toFixed(2) + ' km'

  // update arrow
  if (currentPos.alpha === null) {
    elGoalArrow.style.opacity = 0.2
  } else {
    elGoalArrow.style.opacity = 1
  }
  elGoalArrow.style.transform = `rotate(${angle.toFixed(0)}deg)`

  // update radar
  // distance from center
  const distanceFromCenter = distance < 1000 ? distance / 1000 : 1

  const angleRad = (angle / 360) * (2 * Math.PI) - (Math.PI * 0.5);
  const x = Math.cos(angleRad) * 50 * distanceFromCenter + 50
  const y = Math.sin(angleRad) * 50 * distanceFromCenter + 50

  elRadarGoal.style.left = `${x}%`;
  elRadarGoal.style.top = `${y}%`;
}

initGPS(handlePosition)
initOrientation(elCompassBtn, handleOrientation)
updateDisplay()