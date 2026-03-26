import BLOG from '@/blog.config'

const escapeXmlAttr = value =>
  `${value || ''}`
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const getServerSideProps = async ctx => {
  const avatar = BLOG.AVATAR || BLOG.BLOG_FAVICON || '/favicon.ico'
  const safeAvatar = escapeXmlAttr(avatar)
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
