const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiOrigin = (() => {
  try {
    return new URL(apiBaseUrl, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

export const assetUrl = (value) => {
  if (!value || typeof value !== 'string') return value;
  if (/^(blob:|data:)/i.test(value)) return value;

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith('/storage/')) {
        return apiOrigin + parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      return value;
    }
    return value;
  }

  if (value.startsWith('/storage/')) return apiOrigin + value;
  if (value.startsWith('storage/')) return apiOrigin + '/' + value;

  if (value.startsWith('/')) return value;

  return apiOrigin + '/storage/' + value.replace(/^\/+/, '');
};

export const normalizeMedia = (item) => {
  if (!item || typeof item !== 'object') return item;
  const images = Array.isArray(item.images) ? item.images.map(assetUrl).filter(Boolean) : [];
  const image = assetUrl(item.image || images[0] || '');

  return {
    ...item,
    image: image || null,
    images: images.length ? images : image ? [image] : [],
  };
};
