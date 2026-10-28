import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const website = new URL(process.env.WEB_URL || 'http://127.0.0.1:4321');

export default defineConfig({
  site: website.origin,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  devToolbar: { enabled: false },
  security: { allowedDomains: [{ hostname: website.hostname, protocol: website.protocol.slice(0, -1), port: website.port }] },
});
