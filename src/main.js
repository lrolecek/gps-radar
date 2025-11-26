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
  heading: null,
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
    heading: alpha,
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
  elAlpha.textContent = currentPos.heading === null ? 'null' : currentPos.heading.toFixed(0) + '°'
}

log.message('App start')
log.divider()

initGPS(handlePosition)
initOrientation(elCompassBtn, handleOrientation)
