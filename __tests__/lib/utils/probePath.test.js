import { isProbePath, isValidPageNumber } from '@/lib/utils/probePath'

describe('isProbePath', () => {
  it.each([
    [['.well-known', 'mcp.json']],
    [['.netrc']],
    [['.vscode', 'sftp.json']],
    [['api', 'v1']],
    [['wp-json']],
    [['openapi.json']],
    [['sitemap.xml.gz']],
    [['auth.md']],
    [['fonts', 'inter-var.woff2']],
    [['undefined']]
  ])('treats %j as a probe', segments => {
    expect(isProbePath(segments)).toBe(true)
  })

  it.each([
    [['article', 'thoughts-on-claude-code']],
    [['run-firefox-remotely-on-ubuntu']],
    [['16db91bd596380b4be84e80237c101dc']],
    [['article', 'numazu-photos-202501']],
    [['about.html']],
    [[]]
  ])('lets %j through', segments => {
    expect(isProbePath(segments)).toBe(false)
  })
})

describe('isValidPageNumber', () => {
  it('accepts positive integers', () => {
    expect(isValidPageNumber('1')).toBe(true)
    expect(isValidPageNumber('12')).toBe(true)
  })

  it.each(['0', '-1', '01', '1.5', 'abc', '', undefined])(
    'rejects %p',
    page => {
      expect(isValidPageNumber(page)).toBe(false)
    }
  )
})
