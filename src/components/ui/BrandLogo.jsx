import { useUI } from '../../contexts/UIContext';

const BrandLogo = ({ className = '', compact = false }) => {
  const { theme } = useUI();
  const logoFile = theme === 'light' ? 'incubateur-logo-light.png' : 'incubateur-logo-dark.png';

  return (
    <span className={`brand-logo ${compact ? 'brand-logo-compact' : ''} ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}brand/${logoFile}`}
        alt="Incubateur"
      />
    </span>
  );
};

export default BrandLogo;
