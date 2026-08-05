// Serializes a Lexical text node, applying format bitmask as inline HTML tags.
// Format bits: 1=bold 2=italic 4=strikethrough 8=underline 16=code 32=sub 64=sup
const HTML_BLOCK_RE = /^<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|tr|td|th|br|hr|figure|section|article)\b/i;

function serializeText(node) {
  const raw = node.text || '';
  // Content imported from legacy backend stores the entire HTML body as a single
  // text node. Skip escaping so dangerouslySetInnerHTML renders it properly.
  if (HTML_BLOCK_RE.test(raw.trimStart())) return raw;

  let text = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const fmt = node.format || 0;
  if (fmt & 16) text = `<code>${text}</code>`;
  if (fmt & 1)  text = `<strong>${text}</strong>`;
  if (fmt & 2)  text = `<em>${text}</em>`;
  if (fmt & 8)  text = `<u>${text}</u>`;
  if (fmt & 4)  text = `<s>${text}</s>`;
  if (fmt & 32) text = `<sub>${text}</sub>`;
  if (fmt & 64) text = `<sup>${text}</sup>`;
  return text;
}

function serializeChildren(nodes) {
  return (nodes || []).map(serializeNode).join('');
}

// Matches watch?v=, embed/, shorts/, and youtu.be/ links; captures the 11-char video id.
const YOUTUBE_ID_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;

function parseYouTubeUrl(url) {
  if (!url) return null;
  const match = url.match(YOUTUBE_ID_RE);
  if (!match) return null;
  return { id: match[1], isShorts: /\/shorts\//i.test(url) };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function serializeYouTubeBlock(fields) {
  const parsed = parseYouTubeUrl(fields?.url);
  if (!parsed) return '';
  const embedSrc = `https://www.youtube.com/embed/${parsed.id}`;
  // padding-top percentage resolves against the *containing block* width, so the
  // width constraint must live on the outer figure — putting max-width on the same
  // element as the padding-top trick makes the height compute off the wrong width.
  const figureStyle = parsed.isShorts
    ? 'margin:1.5rem auto;max-width:360px;'
    : 'margin:1.5rem 0;';
  // Shorts are 9:16 portrait; regular videos are 16:9 landscape.
  const ratio = parsed.isShorts ? '177.78%' : '56.25%';
  const caption = fields.caption
    ? `<figcaption style="text-align:center;font-size:0.9rem;color:#666;margin-top:0.5rem;">${escapeHtml(fields.caption)}</figcaption>`
    : '';
  return `<figure style="${figureStyle}"><div style="position:relative;width:100%;padding-top:${ratio};"><iframe src="${embedSrc}" title="YouTube video player" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div>${caption}</figure>`;
}

function serializeNode(node) {
  if (!node) return '';
  const ch = serializeChildren(node.children);

  switch (node.type) {
    case 'text':
      return serializeText(node);

    case 'linebreak':
      return '<br>';

    case 'paragraph':
      return ch ? `<p>${ch}</p>` : '<br>';

    case 'heading': {
      const tag = node.tag || 'h2';
      return `<${tag}>${ch}</${tag}>`;
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${ch}</${tag}>`;
    }

    case 'listitem':
      return `<li>${ch}</li>`;

    case 'quote':
      return `<blockquote>${ch}</blockquote>`;

    case 'code': {
      const lang = node.language ? ` class="language-${node.language}"` : '';
      return `<pre><code${lang}>${ch}</code></pre>`;
    }

    case 'link':
    case 'autolink': {
      const url = node.fields?.url || node.url || '#';
      const extra = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}"${extra}>${ch}</a>`;
    }

    case 'upload': {
      const src = node.value?.url || '';
      const alt = node.value?.alt || node.value?.filename || '';
      return src ? `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;">` : '';
    }

    case 'horizontalrule':
      return '<hr>';

    case 'block': {
      const fields = node.fields || {};
      if (fields.blockType === 'youtubeEmbed') return serializeYouTubeBlock(fields);
      return ch;
    }

    default:
      return ch;
  }
}

/**
 * Convert a Payload Lexical content object to an HTML string.
 * Accepts the full document object ({ root: { ... } }) or just a root node.
 * Returns empty string for null/undefined input.
 */
export function lexicalToHtml(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  try {
    return serializeNode(content.root || content);
  } catch {
    return '';
  }
}
