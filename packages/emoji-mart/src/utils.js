import { SearchIndex } from './helpers'

export function deepEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val == b[index])
  )
}

export async function sleep(frames = 1) {
  for (let _ in [...Array(frames).keys()]) {
    await new Promise(requestAnimationFrame)
  }
}

export function getEmojiData(emoji, { skinIndex } = {}) {
  const skin = emoji.skins[skinIndex] || emoji.skins[0]
  const emojiData = {
    id: emoji.id,
    name: emoji.name,
    native: skin.native,
    unified: skin.unified,
    keywords: emoji.keywords,
    shortcodes: skin.shortcodes || emoji.shortcodes,
  }

  if (skin.src) {
    emojiData.src = skin.src
  }

  if (emoji.aliases && emoji.aliases.length) {
    emojiData.aliases = emoji.aliases
  }

  if (emoji.emoticons && emoji.emoticons.length) {
    emojiData.emoticons = emoji.emoticons
  }

  return emojiData
}

export async function getEmojiDataFromNative(nativeString) {
  const results = await SearchIndex.search(nativeString, {
    maxResults: 1,
    caller: 'getEmojiDataFromNative',
  })
  if (!results || !results.length) return null

  const emoji = results[0]
  let skinIndex = 0

  for (let skin of emoji.skins) {
    if (skin.native == nativeString) {
      break
    }

    skinIndex++
  }

  return getEmojiData(emoji, { skinIndex })
}
