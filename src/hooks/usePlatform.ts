import { Platform } from "react-native"

export function usePlatform() {
  const os = Platform.OS
  const isWeb = os === "web"
  const isIOS = os === "ios"
  const isAndroid = os === "android"

  return {
    os,
    isWeb,
    isIOS,
    isAndroid,
  }
}