import generalIconPaths from '../assets/general-icons.json'
import awsIconPaths from '../assets/aws-icons.json'

export function addBaseURL(base: string, path: string): string {
  return `${base}${path}`
}

function findIconByList(title: string, iconPaths: string[], baseUrl: string) {
  let bestMatchPath = ''
  let bestMatchRate = 0
  const matchRates = new Map<string, number>()

  // Split the title into words and convert to lowercase
  const titleWords = title.toLowerCase().split(/\s+/)

  iconPaths.forEach((path) => {
    const pathParts = path.toLowerCase().split('/')
    let matchCount = 0

    pathParts.forEach((part) => {
      // Split each part of the path into words
      const partWords = part.split(/[-_\.]+/)

      partWords.forEach((word) => {
        if (titleWords.includes(word)) {
          matchCount++
        }
      })
    })

    const matchRate = (matchCount / titleWords.length) * 100
    matchRates.set(path, matchRate)
  })

  // Find the path with the highest match rate
  matchRates.forEach((rate, path) => {
    if (rate > bestMatchRate) {
      bestMatchRate = rate
      bestMatchPath = path
    }
  })

  return bestMatchPath ? addBaseURL(baseUrl, bestMatchPath) : ''
}

export function selectBestMatchingIcon(title: string) {
  const awsIconsBaseURL =
    'https://raw.githubusercontent.com/unimu-cic/aws-iconic/9be911f3dca99a54c7ea32f4af2cf616dddde9be/src/'
  const generalIconsBaseURL =
    'https://raw.githubusercontent.com/mingrammer/diagrams/master/resources/'

  const awsIcon = findIconByList(title, awsIconPaths, awsIconsBaseURL)

  if (awsIcon.length) {
    return awsIcon
  }

  const generalIcon = findIconByList(title, generalIconPaths, generalIconsBaseURL)

  return generalIcon
}
