import BLOG from '@/blog.config'
import fs from 'fs'
import path from 'path'

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

const readLocalFile = filePath => {
  if (!fs.existsSync(filePath)) {
    return null
  }

  return {
    body: fs.readFileSync(filePath),
    contentType: guessMimeType(filePath)
  }
}

const loadFaviconAsset = async src => {
  if (!src) {
    return null
  }

  if (src.startsWith('/')) {
    return readLocalFile(path.join(process.cwd(), 'public', src.replace(/^\/+/, '')))
  }

  if (/^https?:\/\//i.test(src)) {
    const response = await fetch(src)
    if (!response.ok) {
      throw new Error(`Failed to fetch favicon asset: ${response.status}`)
    }

    return {
      body: Buffer.from(await response.arrayBuffer()),
      contentType: guessMimeType(src, response.headers.get('content-type'))
    }
  }

  return null
}

export const getServerSideProps = async ctx => {
  const primarySource = BLOG.AVATAR || BLOG.BLOG_FAVICON || '/favicon.ico'
  const fallbackSource = BLOG.BLOG_FAVICON || '/favicon.ico'
  let asset = null

  try {
    asset = await loadFaviconAsset(primarySource)
  } catch (error) {
    console.warn('[favicon] Failed to load primary favicon asset.', error)
  }

  if (!asset && fallbackSource !== primarySource) {
    try {
      asset = await loadFaviconAsset(fallbackSource)
    } catch (error) {
      console.warn('[favicon] Failed to load fallback favicon asset.', error)
    }
  }

  if (!asset) {
    asset = readLocalFile(path.join(process.cwd(), 'public', 'favicon.ico'))
  }

  ctx.res.setHeader('Content-Type', asset?.contentType || 'image/x-icon')
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=59'
  )
  ctx.res.write(asset?.body || '')
  ctx.res.end()

  return {
    props: {}
  }
}

export default function SiteFavicon() {
  return null
}
