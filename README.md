# crabass.me

Source for [crabass.me](https://crabass.me), Henry Johnson's blog. Posts are written in Notion and rendered by a trimmed-down fork of [NotionNext](https://github.com/notionnext-org/NotionNext) with a customized `nobelium` theme.

## How it differs from upstream

- Only the `nobelium` theme is kept, customized when the site moved over from Nobelium (nav, footer, styles, favicons, RSS page, SEO).
- The custom right-click menu is off.
- Upstream project tooling (docs site, scripts, Docker image, upstream sync, governance docs) is removed.
- Scanner probe paths (`.well-known/*`, dotfiles, config files, `wp-*`, `api/*`) and invalid page numbers return 404 without fetching Notion.

Upstream is merged by hand with a merge commit. After each merge, delete any themes, tooling or docs it brings back.

## Configuration

Site settings live in `blog.config.js` and `conf/*.js`. Each one can be overridden by an environment variable of the same name (`NEXT_PUBLIC_` prefix for client-side ones). The key ones are:

| Variable | Purpose |
| --- | --- |
| `NOTION_PAGE_ID` | The Notion database the posts come from |
| `API_BASE_URL` | Notion API endpoint, defaults to `https://app.notion.com/api/v3` |

## Development

Requires Node 22 (see `.nvmrc`) and Yarn 1.22.

```bash
yarn install --frozen-lockfile
yarn dev        # http://localhost:3000
yarn lint
yarn test
yarn build
```

## Deployment

The site deploys on Vercel. Pushes to `main` go to production, and pull requests get preview deployments.

## License

MIT, inherited from NotionNext. See `LICENSE`.
