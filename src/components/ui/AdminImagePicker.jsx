import { ImagePlus, X } from 'lucide-react';

const fileToItem = (file) => ({
  id: file.name + '-' + file.size + '-' + file.lastModified + '-' + Math.random().toString(36).slice(2),
  file,
  url: URL.createObjectURL(file),
  name: file.name,
  isExisting: false,
});

export default function AdminImagePicker({ label, help, value = [], onChange, max = 12 }) {
  const items = Array.isArray(value) ? value : [];

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    const nextItems = [...items, ...files.map(fileToItem)].slice(0, max);
    onChange(nextItems);
    event.target.value = '';
  };

  const removeItem = (id) => {
    const item = items.find((entry) => entry.id === id);
    if (item?.url && !item.isExisting) URL.revokeObjectURL(item.url);
    onChange(items.filter((entry) => entry.id !== id));
  };

  return (
    <div className="admin-image-picker">
      <div className="admin-image-picker__header">
        <div>
          <label className="admin-image-picker__label">{label}</label>
          {help && <p>{help}</p>}
        </div>
        <span>{items.length}/{max}</span>
      </div>

      {items.length > 0 && (
        <div className="admin-image-picker__grid">
          {items.map((item, index) => (
            <figure key={item.id || item.url} className="admin-image-picker__item">
              <img src={item.url} alt={item.name || 'Photo ' + (index + 1)} />
              {index === 0 && <figcaption>Couverture</figcaption>}
              <button type="button" onClick={() => removeItem(item.id)} aria-label="Retirer la photo">
                <X size={16} />
              </button>
            </figure>
          ))}
        </div>
      )}

      <label className="admin-image-picker__dropzone">
        <ImagePlus size={22} />
        <span>Ajouter des photos</span>
        <small>JPG, PNG ou WebP. La première photo devient la couverture.</small>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
      </label>
    </div>
  );
}
