import md5 from 'js-md5'
import { siteConfig } from '@/lib/config'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

export const getSiteEmail = NOTION_CONFIG => {
  const plainEmail = siteConfig('EMAIL', null, NOTION_CONFIG)
  if (plainEmail) {
    return `${plainEmail}`.trim().toLowerCase()
  }

  const encryptedEmail = siteConfig('CONTACT_EMAIL', null, NOTION_CONFIG)
  if (!encryptedEmail) {
    return ''
  }

  const email = decryptEmail(encryptedEmail)
  return email ? `${email}`.trim().toLowerCase() : ''
}

export const getSiteEmailHash = NOTION_CONFIG => {
  const emailHash = siteConfig('EMAIL_HASH', null, NOTION_CONFIG)
  if (emailHash) {
    return `${emailHash}`.trim().toLowerCase()
  }

  const email = getSiteEmail(NOTION_CONFIG)
  if (!email) {
    return ''
  }

  return md5(email)
}

export const getGravatarUrl = (email, size = 160) => {
  if (!email) {
    return ''
  }

  const hash = md5(`${email}`.trim().toLowerCase())
  return `https://gravatar.com/avatar/${hash}?s=${size}&d=mp`
}

export const getGravatarUrlByHash = (hash, size = 160) => {
  if (!hash) {
    return ''
  }

  return `https://gravatar.com/avatar/${`${hash}`
    .trim()
    .toLowerCase()}?s=${size}&d=mp`
}

export const getSiteAvatarUrl = NOTION_CONFIG => {
  return siteConfig('AVATAR', null, NOTION_CONFIG) || ''
}

export const getAuthorAvatarUrl = (NOTION_CONFIG, size = 160) => {
  return (
    getGravatarUrlByHash(getSiteEmailHash(NOTION_CONFIG), size) ||
    getGravatarUrl(getSiteEmail(NOTION_CONFIG), size) ||
    getSiteAvatarUrl(NOTION_CONFIG)
  )
}

const toAbsoluteUrl = (src, baseUrl = '') => {
  if (!src) {
    return ''
  }

  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) {
    return src
  }

  if (src.startsWith('/') && baseUrl) {
    return `${baseUrl.replace(/\/+$/, '')}${src}`
  }

  return src
}

export const getCircularFaviconUrl = (src, size = 64, baseUrl = '') => {
  if (!src) {
    return ''
  }

  const safeSrc = toAbsoluteUrl(src, baseUrl)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><clipPath id="avatar-circle"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></clipPath></defs><image href="${safeSrc}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar-circle)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
