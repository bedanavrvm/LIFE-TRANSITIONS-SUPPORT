import type { AdminViewServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import RequestInbox from './RequestInbox';

export default function RequestInboxView(props: AdminViewServerProps) {
  const { req } = props.initPageResult;
  return <DefaultTemplate {...props} {...props.initPageResult} req={req}>
    {['admin', 'care-team'].includes(String(req.user?.role))
      ? <RequestInbox />
      : <div className="request-workspace"><h1>Access restricted</h1><p>This workspace is available to care staff and administrators.</p></div>}
  </DefaultTemplate>;
}
