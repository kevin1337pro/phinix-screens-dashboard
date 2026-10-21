import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label="Darstellung wechseln"
    >
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export default ThemeToggle
