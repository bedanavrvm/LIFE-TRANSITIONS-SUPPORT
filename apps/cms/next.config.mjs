import { withPayload } from '@payloadcms/next/withPayload';

export default withPayload({
  distDir: process.env.LTSP_TEST_MODE === 'true' ? '.next/test' : '.next',
  transpilePackages: ['@ltsp/shared'],
  poweredByHeader: false,
});
