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

// brno
let currentPos = {
  lat: null,
  lon: null,
  accuracy: null,
  alpha: null,
}

// prague
let goalPos = {
  lat: 50.0755,
  lon: 14.4378
}

console.log('Distance to goal:', getGPSDistance(currentPos, goalPos))
console.log('Bearing to goal:', getGPSBearing(currentPos, goalPos))

const elRadarGoal = document.querySelector('#radar-goal')
const elGoalArrow = document.querySelector('#goal-arrow')
const elGoalDistance = document.querySelector('#goal-distance')

const elLat = document.querySelector('#lat')
const elLon = document.querySelector('#lon')
const elAlpha = document.querySelector('#alpha')

const elCompassBtn = document.querySelector('#compass-btn')

const handleOrientation = (alpha, beta, gama) => {
  currentPos = {
    ...currentPos,
    alpha: alpha,
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
  elLat.textContent = currentPos.lat === null ? 'null' : `${currentPos.lat.toFixed(4)}`
  elLon.textContent = currentPos.lon === null ? 'null' : `${currentPos.lon.toFixed(4)}`
  elAlpha.textContent = currentPos.alpha === null ? 'null' : currentPos.alpha.toFixed(0) + '°'

  const alphaNorth = currentPos.alpha === null
    ? -90
    : -90 + currentPos.alpha

  if (currentPos.alpha === null) {
    elGoalArrow.style.opacity = 0.2
  } else {
    elGoalArrow.style.opacity = 1
  }
  elGoalArrow.style.transform = `rotate(${alphaNorth.toFixed(0)}deg)`

}

log.message('App start')
log.divider()

initGPS(handlePosition)
initOrientation(elCompassBtn, handleOrientation)
