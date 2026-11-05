'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const kinds = { care: 'Support or home visit', callback: 'Callback', referral: 'Referral', 'training-group': 'Group training', 'training-private': 'Private training' };
const statuses = { new: 'New', reviewed: 'Reviewed', closed: 'Closed' };
const sources: Record<string, string> = { website: 'Website', phone: 'Phone', whatsapp: 'WhatsApp', 'staff-follow-up': 'Staff follow-up', legacy: 'Legacy / source not recorded' };
const date = (value: string) => new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' }).format(new Date(value));
const title = (value: any) => value && typeof value === 'object' ? value.title || value.reference : '';

async function api(path: string, data?: unknown) {
  const response = await fetch('/api/' + path, { credentials: 'same-origin', cache: 'no-store', ...(data ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) } : {}) });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.errors?.[0]?.message || 'Unable to load the workspace. Please refresh and try again.');
  return result;
}
function query(collection: string, where: Record<string, unknown>, extra: Record<string, string> = {}) {
  const params = new URLSearchParams(extra);
  function add(value: any, key: string) {
    if (value && typeof value === 'object') for (const [name, item] of Object.entries(value)) add(item, key + '[' + name + ']');
    else params.set(key, String(value));
  }
  add(where, 'where');
  return collection + '?' + params;
}

export default function RequestInbox() {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const id = pathname.split('/')[3];
  const capture = id === 'new';
  const [record, setRecord] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [related, setRelated] = useState<any>(null);
  const [choices, setChoices] = useState<any>({ services: [], courses: [] });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [notice, setNotice] = useState('');
  const status = search.get('status') || 'new';
  const page = Math.max(1, Number(search.get('page')) || 1);
  const kind = search.get('kind') || '';
  const term = search.get('q') || '';
  const original = search.get('from') || '';
  useEffect(() => { setHistoryPage(1); setNotice(''); }, [id]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    async function load() {
      if (capture) {
        const [services, courses] = await Promise.all(['services', 'courses'].map(collection => api(query(collection, { _status: { equals: 'published' } }, { limit: '100', depth: '0', sort: 'title' }))));
        return () => { setChoices({ services: services.docs, courses: courses.docs }); setRecord(null); };
      }
      if (id) {
        const where = { request: { equals: id } };
        const [item, activity, appointments, payments] = await Promise.all([
          api('support-requests/' + encodeURIComponent(id) + '?depth=1'),
          api(query('request-activity', where, { sort: '-createdAt', limit: '20', page: String(historyPage), depth: '0' })),
          api(query('appointments', where, { sort: '-startsAt', limit: '5', depth: '0' })),
          api(query('payments', where, { sort: '-createdAt', limit: '5', depth: '0' })),
        ]);
        return () => { setRecord(item); setHistory(activity); setRelated({ appointments, payments }); };
      }
      const filters: any[] = [];
      if (Object.keys(statuses).includes(status)) filters.push({ status: { equals: status } });
      if (Object.keys(kinds).includes(kind)) filters.push({ kind: { equals: kind } });
      if (term) filters.push({ or: [{ reference: { contains: term } }, { name: { contains: term } }] });
      const items = await api(query('support-requests', filters.length ? { and: filters } : {}, {
        sort: 'createdAt', page: String(page), limit: '20', depth: '1',
        'select[reference]': 'true', 'select[name]': 'true', 'select[kind]': 'true', 'select[service]': 'true', 'select[course]': 'true', 'select[status]': 'true', 'select[createdAt]': 'true',
        'populate[services][title]': 'true', 'populate[courses][title]': 'true',
      }));
      return () => setRecords(items);
    }
    load().then(apply => { if (active) apply(); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, capture, status, page, kind, term, refresh, historyPage]);
  function changeFilter(values: Record<string, string>) {
    const params = new URLSearchParams(search.toString());
    for (const [key, value] of Object.entries(values)) value ? params.set(key, value) : params.delete(key);
    router.push('/admin/requests?' + params);
  }
  async function action(path: string, data: unknown, done?: () => void) {
    setBusy(true); setError(''); setNotice('');
    try { const result = await api(path, data); done?.(); setNotice('Saved.'); setRefresh(n => n + 1); return result; }
    catch (e: any) { setError(e.message); return null; }
    finally { setBusy(false); }
  }
  async function captureRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = await action('request-workflow/capture', {
      ...values, consent: values.consent === 'on', ...(original ? { source: 'staff-follow-up', originalRequest: original } : {}),
    });
    if (result) router.push('/admin/requests/' + result.doc.id);
  }
  return <main className="request-workspace">
    <header className="request-heading"><div><p className="staff-eyebrow">Care &amp; training</p><h1>{capture ? 'Record an enquiry' : id ? 'Request details' : 'Request inbox'}</h1></div><nav aria-label="Request navigation"><a href="/admin/requests">Inbox</a><a href="/admin/requests/new">Record an enquiry</a><button type="button" onClick={() => setRefresh(n => n + 1)} disabled={busy}>Refresh</button></nav></header>
    {error && <div role="alert" className="request-error">{error}</div>}
    {notice && <p role="status">{notice}</p>}
    {loading && <p role="status">Loading requests…</p>}
    {!loading && !capture && !id && records && <>
      <nav className="request-tabs" aria-label="Request status">{Object.entries({ ...statuses, all: 'All' }).map(([value, label]) => <button type="button" key={value} aria-pressed={status === value} onClick={() => changeFilter({ status: value, page: '' })}>{label}</button>)}</nav>
      <form className="request-filters" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); changeFilter({ q: String(form.get('q') || ''), kind: String(form.get('kind') || ''), page: '' }); }}>
        <label>Search reference or name<input key={term} name="q" defaultValue={term} maxLength={100} /></label>
        <label>Request type<select key={kind} name="kind" defaultValue={kind}><option value="">All types</option>{Object.entries(kinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button type="submit">Filter requests</button>
      </form>
      <p>{records.totalDocs} requests · Oldest first</p>
      {records.docs.length ? <div className="request-table-scroll"><table><caption className="request-sr-only">Requests matching your filters</caption><thead><tr>{['Reference', 'Name', 'Type', 'Requested support', 'Received (Nairobi)', 'Status'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{records.docs.map((item: any) => <tr key={item.id}><td><a href={'/admin/requests/' + item.id}>{item.reference}</a></td><td>{item.name}</td><td>{kinds[item.kind as keyof typeof kinds]}</td><td>{title(item.course) || title(item.service) || 'Not specified'}</td><td>{date(item.createdAt)}</td><td>{statuses[item.status as keyof typeof statuses]}</td></tr>)}</tbody></table></div> : <p>No requests match these filters.</p>}
      <nav className="request-pagination" aria-label="Inbox pages"><button disabled={!records.hasPrevPage} onClick={() => changeFilter({ page: String(page - 1) })}>Previous</button><span>Page {records.page} of {Math.max(1, records.totalPages)}</span><button disabled={!records.hasNextPage} onClick={() => changeFilter({ page: String(page + 1) })}>Next</button></nav>
    </>}
    {!loading && capture && <section className="request-panel">
      <p>Record only necessary details. After saving, the submission is read-only; use follow-up notes for corrections.</p>
      <form className="request-capture" onSubmit={captureRequest}>
        {original ? <><p>Staff follow-up linked to request {original}.</p><label>Why is a new enquiry needed?<textarea name="note" required maxLength={2000} /></label></> : <label>Received through<select name="source" required><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option></select></label>}
        <label>Request type<select name="kind" required>{Object.entries(kinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Name<input name="name" required minLength={2} maxLength={100} autoComplete="off" /></label>
        <label>Preferred reply method<select name="preferredContact" required><option value="phone">Phone call</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></label>
        <label>Contact phone<input name="phone" type="tel" maxLength={25} autoComplete="off" /></label>
        <label>Contact email<input name="email" type="email" autoComplete="off" /></label>
        <label>Requested service<select name="service"><option value="">Not specified</option>{choices.services.map((item: any) => <option value={item.slug} key={item.id}>{item.title}</option>)}</select></label>
        <label>Requested training<select name="course"><option value="">Not specified</option>{choices.courses.map((item: any) => <option value={item.slug} key={item.id}>{item.title}</option>)}</select></label>
        <label>Brief request<textarea name="message" maxLength={1500} /></label>
        <label className="request-checkbox"><input type="checkbox" name="consent" required />Privacy information was communicated and acknowledgement received.</label>
        <button disabled={busy} type="submit">{busy ? 'Saving…' : 'Save enquiry'}</button>
      </form>
    </section>}
    {!loading && !capture && id && record && <div className="request-detail-grid">
      <section className="request-panel"><h2>Original request</h2><p><strong>{record.reference}</strong> · {statuses[record.status as keyof typeof statuses]}</p><p>Submitted details cannot be edited.</p>
        <dl>{[
          ['Received', date(record.createdAt)], ['Source', sources[record.source || 'legacy']], ['Captured by', record.capturedByName || record.capturedBy?.name || (record.source === 'website' ? 'Website submission' : 'Not recorded')],
          ['Name', record.name], ['Phone', record.phone], ['Email', record.email], ['Reply method', record.preferredContact], ['Request type', kinds[record.kind as keyof typeof kinds]],
          ['Service', title(record.service)], ['Training', title(record.course)], ['Relationship', record.relationship], ['Age group', record.ageGroup], ['Area', record.area], ['Availability', record.availability], ['Message', record.message],
          ['Privacy acknowledgement', record.consent ? 'Received' : 'Not recorded'],
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not supplied'}</dd></div>)}</dl>
        {record.originalRequest && <p><a href={'/admin/requests/' + (record.originalRequest.id || record.originalRequest)}>Original linked enquiry</a></p>}
        <p className="request-reassurance">Contact details shown are those originally supplied; check follow-up notes for corrections.</p>
        <a href={'/admin/requests/new?from=' + record.id}>Record a linked enquiry for different support</a>
      </section>
      <div><section className="request-panel"><h2>Follow-up</h2>
        <div className="request-actions">{record.status !== 'reviewed' && <button disabled={busy} onClick={() => action('request-workflow/' + id + '/status', { status: 'reviewed', revision: record.workflowRevision || 'legacy' })}>{record.status === 'closed' ? 'Reopen as reviewed' : 'Mark reviewed'}</button>}</div>
        {record.status !== 'closed' && <form onSubmit={event => { event.preventDefault(); const form = event.currentTarget; action('request-workflow/' + id + '/status', { status: 'closed', revision: record.workflowRevision || 'legacy', reason: new FormData(form).get('reason') }, () => form.reset()); }}><label>Reason for closing<textarea name="reason" required maxLength={2000} /></label><button type="submit" disabled={busy}>Close request</button></form>}
        <form onSubmit={event => { event.preventDefault(); const form = event.currentTarget; action('request-workflow/' + id + '/note', { text: new FormData(form).get('text') }, () => form.reset()); }}>
          <label>Add a follow-up note<textarea name="text" required maxLength={2000} /></label><p>Notes cannot be edited. Record corrections in a new note. Necessary operational details only; this is not a medical record.</p><button type="submit" disabled={busy}>Add note</button>
        </form>
        {record.staffNotes && <aside><h3>Legacy staff notes</h3><p className="request-preserve">{record.staffNotes}</p><p>Original author and entry time were not recorded.</p></aside>}
        <h3>Activity</h3>{history?.docs.length ? <ol className="request-timeline">{history.docs.map((entry: any) => <li key={entry.id}><p><strong>{entry.authorName}</strong> · {date(entry.createdAt)}</p>{entry.kind === 'status' && <p>{statuses[entry.fromStatus as keyof typeof statuses]} → {statuses[entry.toStatus as keyof typeof statuses]}</p>}<p className="request-preserve">{entry.text}</p></li>)}</ol> : <p>No follow-up activity recorded.</p>}
        {history?.totalPages > 1 && <nav className="request-pagination" aria-label="Activity pages"><button disabled={!history.hasPrevPage} onClick={() => setHistoryPage(n => n - 1)}>Newer</button><span>Page {historyPage}</span><button disabled={!history.hasNextPage} onClick={() => setHistoryPage(n => n + 1)}>Older</button></nav>}
      </section>
      <section className="request-panel"><h2>Related arrangements</h2>{['appointments', 'payments'].map(collection => <div key={collection}><h3>{collection === 'appointments' ? 'Appointments' : 'Payments'}</h3>{related?.[collection].docs.length ? <ul>{related[collection].docs.map((item: any) => <li key={item.id}><a href={'/admin/collections/' + collection + '/' + item.id}>{collection === 'appointments' ? date(item.startsAt) : item.reference} · {item.status}</a></li>)}</ul> : <p>None recorded.</p>}<a href={'/admin/collections/' + collection + '?' + new URLSearchParams({ 'where[request][equals]': id })}>View all {collection} for this request</a></div>)}<p>Review the request before confirming care. A changed service in notes does not change payment eligibility.</p></section></div>
    </div>}
  </main>;
}
