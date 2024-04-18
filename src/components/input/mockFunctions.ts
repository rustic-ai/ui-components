export function getRandomDelayInSeconds(maxSeconds: number) {
  const conversionRate = 1000
  const minDelay = 1000
  const maxDelay = maxSeconds * conversionRate
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
}

export function onFileDelete(fileId: string): Promise<{ isDeleted: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ isDeleted: true })
      // eslint-disable-next-line no-console
      console.log('File deleted:', fileId)
    }, getRandomDelayInSeconds(1))
  })
}

export function delayReject(ms: number, signal: AbortSignal) {
  return new Promise((resolve, reject) => {
    const listener = () => {
      clearTimeout(timer)
    }
    signal?.throwIfAborted()
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', listener)
      reject('failed to upload')
    }, ms)
    signal?.addEventListener('abort', listener)
  }) as Promise<{ url: string }>
}

export function onFileAddSuccess(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  abortController: AbortController
): Promise<{ url: string }> {
  const signal = abortController.signal
  const delayTime = 50
  let progress = 0
  const progressTotal = 100
  const progressIncrementRate = 5
  return new Promise((resolve) => {
    const listener = () => {
      clearTimeout(timer)
    }
    signal?.throwIfAborted()
    const timer = setInterval(() => {
      if (progress < progressTotal) {
        const incrementAmount = Math.random() * progressIncrementRate
        progress += incrementAmount
        onUploadProgress({
          loaded: progress,
          total: progressTotal,
        } as ProgressEvent)
      } else {
        signal?.removeEventListener('abort', listener)
        resolve({ url: `https://rustic/${fileId}` })
      }
    }, delayTime)
    signal?.addEventListener('abort', listener)
  })
}

export function onFileAddFailedQuick(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  abortController: AbortController
): Promise<{ url: string }> {
  return delayReject(1, abortController.signal)
}

export function onFileAddFailedSlow(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  abortController: AbortController
): Promise<{ url: string }> {
  const deplayTimeInSeconds = 5
  return delayReject(
    getRandomDelayInSeconds(deplayTimeInSeconds),
    abortController.signal
  )
}
