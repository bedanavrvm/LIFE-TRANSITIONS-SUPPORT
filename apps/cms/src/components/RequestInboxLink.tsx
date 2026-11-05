import type { ServerProps } from 'payload';
export default function RequestInboxLink({ user }: ServerProps) {
  return ['admin', 'care-team'].includes(String(user?.role)) ? <a className="request-inbox-link" href="/admin/requests">Request inbox</a> : null;
}
