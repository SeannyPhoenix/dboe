let debug = false;

export function debugLog(message: string, ...optionalParams: any[]) {
  if (debug) {
    console.log(`[DEBUG] ${message}`, ...optionalParams);
  }
}

export function debugWarn(message: string, ...optionalParams: any[]) {
  if (debug) {
    console.warn(`[DEBUG] ${message}`, ...optionalParams);
  }
}

export function debugError(message: string, ...optionalParams: any[]) {
  if (debug) {
    console.error(`[DEBUG] ${message}`, ...optionalParams);
  }
}

export function setDebug(value: boolean) {
  debug = value;
}
