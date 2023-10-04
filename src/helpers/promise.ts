export const wait = (seconds: number) => {
  return new Promise((done) => {
    setTimeout(done, seconds * 1000)
  })
}

export const waitUntil = async (conditionMethod: () => boolean) => {
  while (!conditionMethod()) {
    await wait(0.1)
  }
}
