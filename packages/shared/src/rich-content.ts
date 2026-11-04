// Restrict API-supplied rich text to the same small vocabulary as the editor toolbar.
export function safeBody(value: any, depth = 0): any {
  if (depth > 30 || !value || typeof value !== 'object') throw new Error('Invalid content');
  if (value.root) return { root: safeBody(value.root, depth + 1) };
  const { type } = value;
  if (!['root', 'paragraph', 'heading', 'list', 'listitem', 'text', 'linebreak', 'link', 'autolink'].includes(type)) throw new Error('Unsupported content');
  const node: any = { type, version: 1, direction: null, format: '', indent: 0 };
  if (type === 'text') return { type, version: 1, text: String(value.text || ''), format: Number(value.format) & 3, detail: 0, mode: 'normal', style: '' };
  if (type === 'heading') { if (!['h2', 'h3'].includes(value.tag)) throw new Error('Use H2 or H3 headings'); node.tag = value.tag; }
  if (type === 'list') { node.tag = value.listType === 'number' ? 'ol' : 'ul'; node.listType = value.listType === 'number' ? 'number' : 'bullet'; node.start = 1; }
  if (type === 'listitem') node.value = Number(value.value) || 1;
  if (type === 'link' || type === 'autolink') {
    const url = String(value.fields?.url || '');
    if (!/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(url) || /[\x00-\x20]/.test(url)) throw new Error('Use a safe website, email or phone link');
    node.fields = { url, linkType: 'custom', newTab: Boolean(value.fields?.newTab) };
  }
  if (type !== 'linebreak') {
    if (!Array.isArray(value.children) || value.children.length > 5000) throw new Error('Invalid content');
    node.children = value.children.map((child: any) => safeBody(child, depth + 1));
  }
  return node;
}
