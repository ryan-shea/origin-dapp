import keyMirror from '../utils/keyMirror'

export const AlertConstants = keyMirror(
  {
    SHOW: null,
    HIDE: null,
  },
  'ALERT'
)

export function showAlert(message, sticky = false) {
  return { type: AlertConstants.SHOW, message, sticky }
}

export function hideAlert() {
  return { type: AlertConstants.HIDE }
}
