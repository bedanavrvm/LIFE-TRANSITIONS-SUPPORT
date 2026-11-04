import logo from '../../../web/public/brand/official-logo.jpeg';

export function Logo() {
  return <div className="staff-brand"><img src={logo.src} alt="Life Transitions Support Partners" /><span>Staff workspace</span></div>;
}
export function Icon() {
  return <img src={logo.src} alt="Life Transitions Support Partners" style={{ width: 36, height: 36, objectFit: 'contain' }} />;
}
