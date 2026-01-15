import { log } from './log'

export const defaultOrientationHandler = (alpha = null, beta = null, gama = null) => {
  // alpha is the compass heading in degrees (0-360) where 0 is north
  log.message(`Device heading: ${alpha}`)
}

const enableOrientationListener = (enableBtn, orientationHandler) => {
  const handler = typeof orientationHandler === 'function'
  ? orientationHandler
  : defaultOrientationHandler

  const hasAbsolute = 'ondeviceorientationabsolute' in window

  window.addEventListener(hasAbsolute ? 'deviceorientationabsolute' : 'deviceorientation', (event) => {
    handler(event);
  }, true)

  if (enableBtn) {
    enableBtn.disabled = true
    enableBtn.textContent = 'Compass enabled'

  }
  log.message('Orientation listener active')
}

export const initOrientation = (enableBtn, orientationHandler) => {
  log.message('Orientation init')

  if (!enableBtn) return

  enableBtn.addEventListener('click', async () => {
    if (!('DeviceOrientationEvent' in window)) {
      log.message('DeviceOrientationEvent is not supported in this browser.')
      return
    }

    // iOS requires an explicit permission request triggered by a user gesture
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission()
        if (permission === 'granted') {
          enableOrientationListener(enableBtn, orientationHandler)
        } else {
          log.message('Compass permission was denied.')
        }
      } catch (error) {
        log.message('Failed to request compass permission:', error)
      }
    } else {
      enableOrientationListener(enableBtn, orientationHandler)
    }
  })

  log.message(`Click "Enable compass" to activate orientation`)
}

