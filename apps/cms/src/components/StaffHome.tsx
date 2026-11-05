import type { WidgetServerProps, Where } from 'payload';
import { reportFailure } from '../../../../scripts/observability.mjs';

export default async function StaffHome({ req }: WidgetServerProps) {
  const { payload, user } = req;
  if (!user) return null;
  const care = ['admin', 'care-team'].includes(String(user.role));
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const start = new Date(`${date}T00:00:00+03:00`);
  const end = new Date(start.getTime() + 86400000);
  const month = new Date(start.getTime() + 30 * 86400000);
  const links = [['Edit services', 'services'], ['Manage training', 'courses'], ...(care ? [['Review enquiries', 'support-requests'], ['Manage appointments', 'appointments']] : []), ...(user.role === 'admin' ? [['Manage staff', 'users']] : [])];
  const counts: { label: string; collection: string; where?: Where }[] = care ? [
    { label: 'New enquiries', collection: 'support-requests', where: { status: { equals: 'new' } } },
    { label: 'Callback requests', collection: 'support-requests', where: { and: [{ status: { equals: 'new' } }, { kind: { equals: 'callback' } }] } },
    { label: "Today's confirmed appointments", collection: 'appointments', where: { and: [{ status: { equals: 'confirmed' } }, { startsAt: { greater_than_equal: start.toISOString(), less_than: end.toISOString() } }] } },
    { label: 'Pending payments', collection: 'payments', where: { status: { equals: 'pending' } } },
  ] : [
    { label: 'Published services & packages', collection: 'services', where: { _status: { equals: 'published' } } },
    { label: 'Published training', collection: 'courses', where: { _status: { equals: 'published' } } },
  ];
  async function count(item: typeof counts[number]) {
    try { return (await payload.count({ collection: item.collection, where: item.where, req, overrideAccess: false })).totalDocs; }
    catch (error) { reportFailure({ event: 'dashboard_query_failed', id: req.headers.get('x-request-id'), method: 'GET', pathname: '/admin', status: 500, error }); return null; }
  }
  async function list(collection: string, where: Where, sort: string) {
    try { return (await payload.find({ collection, where, sort, limit: 5, depth: collection === 'appointments' ? 1 : 0, populate: { 'support-requests': { reference: true } }, req, overrideAccess: false })).docs; }
    catch (error) { reportFailure({ event: 'dashboard_query_failed', id: req.headers.get('x-request-id'), method: 'GET', pathname: '/admin', status: 500, error }); return null; }
  }
  const [numbers, enquiries, appointments, courses] = await Promise.all([
    Promise.all(counts.map(count)),
    care ? list('support-requests', { status: { equals: 'new' } }, '-createdAt') : null,
    care ? list('appointments', { and: [{ startsAt: { greater_than_equal: start.toISOString(), less_than: end.toISOString() } }, { status: { in: ['proposed', 'confirmed'] } }] }, 'startsAt') : null,
    list('courses', { and: [{ _status: { equals: 'published' } }, { date: { greater_than_equal: start.toISOString(), less_than: month.toISOString() } }] }, 'date'),
  ]);
  function filterLink(collection: string, where: Where = {}) {
    const params = new URLSearchParams();
    function add(value: any, key: string) {
      if (value && typeof value === 'object') for (const [name, child] of Object.entries(value)) add(child, `${key}[${name}]`);
      else params.append(key, String(value));
    }
    add(where, 'where');
    return collection === 'support-requests' ? '/admin/requests?status=new' + (JSON.stringify(where).includes('callback') ? '&kind=callback' : '') : `/admin/collections/${collection}?${params}`;
  }
  const requestLabels: Record<string, string> = { care: 'Care', callback: 'Callback', referral: 'Referral', 'training-group': 'Group training', 'training-private': 'Private training' };
  const time = (value: string) => new Intl.DateTimeFormat('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  function panel(title: string, collection: string, records: any[] | null, label: (record: any) => string, empty: string) {
    return <section className="staff-panel"><h2>{title}</h2>{records === null ? <p>Temporarily unavailable. <a href="/admin">Retry</a></p> : records.length ? <ul>{records.map(record => <li key={record.id}><a href={collection === 'support-requests' ? `/admin/requests/${record.id}` : `/admin/collections/${collection}/${record.id}`} >{label(record)}</a></li>)}</ul> : <p>{empty}</p>}</section>;
  }
  return <div className="staff-home">
    <header><p className="staff-eyebrow">Life Transitions Support Partners</p><h1>Welcome, {user.name || 'colleague'}.</h1><p>{care ? 'A clear view of the support and care ahead.' : 'Keep families informed with clear, up-to-date content.'}</p><a href="/admin">Refresh dashboard</a> · <a href={process.env.WEB_URL || '/'} target="_blank" rel="noreferrer">Open website</a></header>
    <nav aria-label="Quick actions" className="staff-actions">{links.map(([label, slug]) => <a key={slug} href={slug === 'support-requests' ? '/admin/requests' : `/admin/collections/${slug}`} >{label}</a>)}<a href="/admin/globals/site-settings">Website settings</a></nav>
    <div className="staff-stats">{counts.map((item, index) => <a className="staff-stat" key={item.label} href={filterLink(item.collection, item.where)}><span>{item.label}</span><strong>{numbers[index] ?? 'Unavailable'}</strong></a>)}</div>
    <div className="staff-panels">
      {care && panel('Awaiting review', 'support-requests', enquiries, record => `${record.reference} · ${requestLabels[record.kind] || record.kind} · ${time(record.createdAt)}`, 'No new enquiries awaiting review.')}
      {care && panel("Today's appointments", 'appointments', appointments, record => `${time(record.startsAt)} · ${record.status} · ${record.request?.reference || `Request ${record.request}`}`, 'No appointments scheduled today.')}
      {panel('Training in the next 30 days', 'courses', courses, record => `${record.title} · ${time(record.date)}`, 'No dated training in the next 30 days. You can update dates from Manage training.')}
      <section className="staff-panel"><h2>A little guidance</h2><p>{care ? 'Review an enquiry before confirming an appointment. Agree any fees with the family, and check the provider transaction before marking a payment paid.' : 'Use a draft to prepare your changes, preview the page, then publish when it is ready for families.'}</p><p>Use necessary operational notes only. This workspace is not a medical record.</p></section>
    </div>
  </div>;
}
