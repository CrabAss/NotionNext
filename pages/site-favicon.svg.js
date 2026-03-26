import BLOG from '@/blog.config'
import fs from 'fs'
import path from 'path'

const escapeXmlAttr = value =>
  `${value || ''}`
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const guessMimeType = (src, headerValue = '') => {
  if (headerValue) {
    return headerValue.split(';')[0]
  }

  const lowerSrc = `${src || ''}`.toLowerCase()
  if (lowerSrc.endsWith('.png')) return 'image/png'
  if (lowerSrc.endsWith('.jpg') || lowerSrc.endsWith('.jpeg')) return 'image/jpeg'
  if (lowerSrc.endsWith('.webp')) return 'image/webp'
  if (lowerSrc.endsWith('.gif')) return 'image/gif'
  if (lowerSrc.endsWith('.svg')) return 'image/svg+xml'
  if (lowerSrc.endsWith('.ico')) return 'image/x-icon'
  return 'image/png'
}

const loadAvatarDataUri = async avatar => {
  if (!avatar) {
    return ''
  }

  if (avatar.startsWith('data:')) {
    return avatar
  }

  if (avatar.startsWith('/')) {
    const filePath = path.join(process.cwd(), 'public', avatar.replace(/^\/+/, ''))
    if (!fs.existsSync(filePath)) {
      return ''
    }

    const buffer = fs.readFileSync(filePath)
    const mimeType = guessMimeType(filePath)
    return `data:${mimeType};base64,${buffer.toString('base64')}`
  }

  if (/^https?:\/\//i.test(avatar)) {
    const response = await fetch(avatar)
    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const mimeType = guessMimeType(avatar, response.headers.get('content-type'))
    return `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`
  }

  return ''
}

export const getServerSideProps = async ctx => {
  const avatar = BLOG.AVATAR || BLOG.BLOG_FAVICON || '/favicon.ico'
  let imageHref = avatar

  try {
    imageHref = (await loadAvatarDataUri(avatar)) || avatar
  } catch (error) {
    console.warn('[favicon] Failed to inline avatar, fallback to source url.', error)
  }

  const safeAvatar = escapeXmlAttr(imageHref)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><clipPath id="avatar-circle"><circle cx="32" cy="32" r="32"/></clipPath></defs><image href="${safeAvatar}" width="64" height="64" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar-circle)"/></svg>`

  ctx.res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=59'
  )
  ctx.res.write(svg)
  ctx.res.end()

  return {
    props: {}
  }
}

export default function SiteFavicon() {
  return null
}
