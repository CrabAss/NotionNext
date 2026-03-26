import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { buildRssXml } from '@/lib/utils/rss'

export const getServerSideProps = async ctx => {
  const props = await fetchGlobalAllData({ from: 'rss.xml' })
  const rssXml = await buildRssXml(props)

  ctx.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  )
  ctx.res.write(rssXml)
  ctx.res.end()

  return {
    props: {}
  }
}

export default function Rss() {
  return null
}
