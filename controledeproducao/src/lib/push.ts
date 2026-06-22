import { savePushSubscription } from './firebase'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i)
  return output
}

function getDeviceId(): string {
  let id = localStorage.getItem('pap-device-id')
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('pap-device-id', id)
  }
  return id
}

export async function subscribeWebPush(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!VAPID_KEY) return false

    const reg = await navigator.serviceWorker.ready

    let subscription = await reg.pushManager.getSubscription()
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY) as unknown as ArrayBuffer,
      })
    }

    const deviceId = getDeviceId()
    await savePushSubscription(deviceId, subscription.toJSON() as Record<string, unknown>)
    return true
  } catch (e) {
    console.warn('Web Push subscription failed:', e)
    return false
  }
}

export async function unsubscribeWebPush(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  const reg = await navigator.serviceWorker.ready
  const subscription = await reg.pushManager.getSubscription()
  if (subscription) await subscription.unsubscribe()
}
