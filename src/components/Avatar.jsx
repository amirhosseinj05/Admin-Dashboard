import { getAvatarColor, getInitials } from '../data/mockData.js';

/** Round avatar with initials - no image files needed for the dummy data. */
export default function Avatar({ name = '', id = 0, size = 'md', className = '' }) {
  const style =
    size === 'sm'
      ? { width: 32, height: 32, fontSize: 12 }
      : size === 'lg'
        ? { width: 46, height: 46, fontSize: 15 }
        : { width: 38, height: 38, fontSize: 13 };

  return (
    <span
      className={`app-avatar ${className}`}
      style={{ ...style, background: getAvatarColor(id || name.length) }}
      aria-hidden="true"
    >
      {getInitials(name) || 'U'}
    </span>
  );
}
