/**
 * Extract html links from a string
 * @param str string
 * @returns {Array}
 */
export function extractHtmlLink(str) {
  const links = []
  const regex = /<a[^>]+href="(.*?)"[^>]*>([\s\S]*?)<\/a>/gm
  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm // eslint-disable-line no-useless-escape
  const rawLinks = regex.exec(str)

  if (Array.isArray(rawLinks)) {
    let i = 0
    while (i < rawLinks.length) {
      const title = rawLinks[i + 2]
      const address = rawLinks[i + 1]

      if (urlRegex.test(address)) {
        links.push({
          title,
          address
        })
      }

      i = i + 3
    }
  }

  return links
}

/**
 * Extract markdown links from a string
 * @param str string
 * @returns {Array}
 */
export function extractMarkdownLink(str) {
  const links = []
  const regex = /(?:__|[*#])|\[(.*?)\]\((.*?)\)/gm
  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm // eslint-disable-line no-useless-escape
  const rawLinks = regex.exec(str)

  if (Array.isArray(rawLinks)) {
    let i = 0
    while (i < rawLinks.length) {
      const title = rawLinks[i + 1]
      const address = rawLinks[i + 2]

      if (urlRegex.test(address)) {
        links.push({
          title,
          address
        })
      }

      i = i + 3
    }
  }

  return links
}

/**
 * Extract raw links from a string
 * @param str string
 * @returns {Array}
 */
export function extractRawLink(str) {
  let links = []
  const regex = /(\s|^)(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}[\s])(\s|$)/igm // eslint-disable-line no-useless-escape
  const rawLinks = str.match(regex)

  if (Array.isArray(rawLinks)) {
    links = rawLinks
      .filter(link => !link.includes(']'))
      .map(link => {
        const name = link.trim()
        const url = !/^https?:\/\//i.test(name) ? 'http://' + name : name

        return {
          title: name,
          address: url
        }
      })
  }

  return links
}
