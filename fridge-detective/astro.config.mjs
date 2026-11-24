// @ts-check
import { defineConfig } from 'astro/config';

// 部署到 https://<user>.github.io/fridge-detective/ ；本地或自定义域名可用 BASE_PATH=/ 覆盖
const base = process.env.BASE_PATH ?? '/fridge-detective';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://luckbubby2014.github.io',
  base,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    // 所有脚本与样式输出为外部文件，配合 CSP script-src 'self'
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
