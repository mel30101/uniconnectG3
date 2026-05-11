export const IS_NATIVE = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
export const IS_WEB = !IS_NATIVE
