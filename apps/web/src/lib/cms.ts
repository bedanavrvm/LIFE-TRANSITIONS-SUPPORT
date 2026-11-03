import type { Course, Service, SiteSettings } from '@ltsp/shared';

export const cmsURL = process.env.CMS_INTERNAL_URL || process.env.CMS_URL || 'http://127.0.0.1:3000';
export const demoMode = process.env.DEMO_MODE !== 'false';
export async function cms<T>(pathname: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${cmsURL}/api/${pathname}`, { ...init, signal: AbortSignal.timeout(10000), cache: 'no-store' });
  if (!response.ok) throw new Error(`CMS response ${response.status}`);
  return response.json() as Promise<T>;
}
export async function publicContent() {
  try {
    const [services, courses, settings] = await Promise.all([
      cms<{ docs: Service[] }>('services?limit=20&sort=number'),
      cms<{ docs: Course[] }>('courses?limit=30&sort=title'),
      cms<SiteSettings>('globals/site-settings'),
    ]);
    return { services: services.docs, courses: courses.docs, settings, available: true };
  } catch {
    return { services: [] as Service[], courses: [] as Course[], settings: {} as SiteSettings, available: false };
  }
}
export function formatDate(value?: string | null) {
  return value ? new Intl.DateTimeFormat('en-KE', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Nairobi' }).format(new Date(value)) : 'Dates arranged with the team';
}
export function money(value: number) { return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value); }
