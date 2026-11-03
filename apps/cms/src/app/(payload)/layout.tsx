import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import '@payloadcms/next/css';
import { importMap } from './admin/importMap.js';
import { headers } from 'next/headers';
import { reportFailure } from '../../../../../scripts/observability.mjs';

const serverFunction: ServerFunctionClient = async args => {
  'use server';
  try { return await handleServerFunctions({ ...args, config, importMap }); }
  catch (error) {
    const id = reportFailure({ event: 'admin_server_action_failed', id: (await headers()).get('x-request-id'), method: 'POST', pathname: '/admin', status: 500, error });
    throw new Error(`Staff action failed. Reference: ${id}`);
  }
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>;
}
