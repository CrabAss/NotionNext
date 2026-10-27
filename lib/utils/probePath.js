/**
 * 识别扫描器的探测路径（.well-known、点文件、配置文件、wp-*、api 等），
 * 这些路径不可能是 Notion 文章，直接 404，避免为它们拉取 Notion 数据
 */
const PROBE_FIRST_SEGMENTS = new Set([
  'api',
  'wp-json',
  'wp-admin',
  'wp-content',
  'wp-includes',
  'cgi-bin',
  'undefined',
  'null'
])

const PROBE_EXTENSION =
  /\.(json|xml|gz|txt|md|php|asp|aspx|jsp|cgi|env|ini|conf|config|yml|yaml|toml|bak|sql|zip|tar|rnd|js|map|woff2?|ttf)$/i

/**
 * @param {string[]} segments 路径分段，例如 ['.well-known', 'mcp.json']
 * @returns {boolean}
 */
export function isProbePath(segments) {
  const parts = (segments || []).filter(Boolean).map(String)
  if (parts.length === 0) return false
  if (PROBE_FIRST_SEGMENTS.has(parts[0].toLowerCase())) return true
  if (parts.some(part => part.startsWith('.'))) return true
  return PROBE_EXTENSION.test(parts.at(-1))
}

/**
 * 分页参数必须是正整数，否则 404（例如 /page/0、/page/-1）
 * @param {string|number} page
 * @returns {boolean}
 */
export function isValidPageNumber(page) {
  return /^[1-9]\d*$/.test(String(page ?? ''))
}
