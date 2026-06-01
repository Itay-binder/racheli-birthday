// =============================================
//  📸 photos_data.js — פלייסהולדרים לתמונות
//  להחליף כל path בתמונה אמיתית כשיש
// =============================================

function _ph(label, c1, c2) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 16" width="270" height="480">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="9" height="16" fill="url(#g)" rx=".4"/>
    <text x="4.5" y="7.5" text-anchor="middle" dominant-baseline="middle"
      fill="rgba(255,255,255,.9)" font-size="1.1" font-family="Heebo,sans-serif">${label}</text>
    <text x="4.5" y="9.2" text-anchor="middle" dominant-baseline="middle"
      fill="rgba(255,255,255,.55)" font-size=".75" font-family="Heebo,sans-serif">📸 תמונה בקרוב</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}

const PLACEHOLDERS = {
  family:  (n) => _ph('משפחה ' + n,  '#b85c7a', '#7b2d4e'),
  tzafrir: (n) => _ph('צפריר ' + n,  '#8b6914', '#5c4208'),
  tal:     (n) => _ph('טל ' + n,     '#7b4fa6', '#4a2070'),
  guy:     (n) => _ph('גיא ' + n,    '#2e7d9e', '#174f66'),
  uri:     (n) => _ph('אורי ' + n,   '#3d8c5a', '#1e5c34'),
  scott:   (n) => _ph('סקוט 🐾 ' + n, '#5c4a2a', '#3a2d16'),
};

// ── תמונות משפחתיות (8 תמונות לגלריה + רקעים) ──────────────────
const familyPhotos = [
  { src: 'images/family-1.jpg',  caption: 'המשפחה' },
  { src: 'images/family-2.jpg',  caption: '' },
  { src: 'images/family-3.jpg',  caption: '' },
  { src: 'images/family-4.jpg',  caption: '' },
  { src: 'images/family-5.jpg',  caption: '' },
  { src: 'images/family-6.jpg',  caption: '' },
  { src: 'images/family-7.jpg',  caption: '' },
  { src: 'images/family-8.jpg',  caption: '' },
  { src: 'images/family-9.jpg',  caption: '' },
  { src: 'images/family-10.jpg', caption: '' },
  { src: 'images/family-11.jpg', caption: '' },
  { src: 'images/family-12.jpg', caption: '' },
];

// ── תמונות ברכות (כל מברך — 3 תמונות) ──────────────────────────
const tzafrirPhotos = [
  'images/tzafrir-1.jpg',
  'images/tzafrir-2.jpg',
  'images/tzafrir-3.jpg',
];

const talPhotos = [
  'images/tal-1.jpg',
  'images/tal-2.jpg',
  'images/tal-3.jpg',
];

const guyPhotos = [
  'images/guy-1.jpg',
  'images/guy-2.jpg',
  'images/guy-3.jpg',
];

const uriPhotos = [
  'images/uri-1.jpg',
  'images/uri-2.jpg',
  'images/uri-3.jpg',
];

const scottPhotos = [
  'images/scott-1.jpg',
  'images/scott-2.jpg',
  'images/scott-3.jpg',
];

// ── תמונת רקע לכל סקשן ──────────────────────────────────────────
const sectionBgs = {
  'hero-bg':     'images/family-1.jpg',
  'tzafrir-bg':  'images/tzafrir-1.jpg',
  'tal-bg':      'images/tal-1.jpg',
  'guy-bg':      'images/guy-1.jpg',
  'uri-bg':      'images/uri-1.jpg',
  'scott-bg':    'images/scott-1.jpg',
  'album-bg':    'images/family-3.jpg',
};
