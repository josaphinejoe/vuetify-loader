import { extname } from 'path'
import { Plugin } from 'vite'
import { generateImports, Options } from '@vuetify/loader-shared'
import { parse as parseUrl, URLSearchParams } from 'url'

function parseId(id: string) {
  const { query, pathname } = parseUrl(id)

  return {
    query: query ? Object.fromEntries(new URLSearchParams(query)) : null,
    path: pathname ?? id
  }
}

export function importPlugin(options: Options): Plugin {
  return {
    name: 'vuetify:import',

    async transform(code, id) {
      const { query, path } = parseId(id)

      if (
        ((extname(path) === '.vue' && !/^import { render as _sfc_render } from ".*"$/m.test(code)) ||
          (extname(path) === '.html' && /<v-[^\s>]+/m.test(code))) ||
        (query && 'vue' in query && (query.type === 'template' || (query.type === 'script' && query.setup === 'true')))
      ) {
        const { code: imports, source } = generateImports(code, options)
        return {
          code: source + imports,
          map: null,
        }
      }

      return null
    }
  }
}
