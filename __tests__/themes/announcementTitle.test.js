import { render, screen } from '@testing-library/react'
import NextAnnouncement from '@/themes/next/components/Announcement'

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      COMMON: {
        ANNOUNCEMENT: 'Announcement fallback'
      }
    }
  })
}))

const notice = {
  title: 'Custom notice title',
  blockMap: { block: {} }
}

describe('announcement titles', () => {
  test.each([
    ['next', NextAnnouncement, 'post']
  ])('%s uses the Notion Notice page title', (_name, Component, propName) => {
    render(<Component {...{ [propName]: notice }} />)

    expect(screen.getByText(/Custom notice title/)).toBeInTheDocument()
  })

  it('keeps the localized fallback when the Notice page has no title', () => {
    render(<NextAnnouncement post={{ blockMap: { block: {} } }} />)

    expect(screen.getByText('Announcement fallback')).toBeInTheDocument()
  })
})
