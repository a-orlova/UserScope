export default function Header({ mode,
                                 onToggleMode }) {
    return (
        <header>
            <a href="https://github.com/a-orlova/UserScope" target="_blank" className="header-btn">
                <i class="fa-brands fa-github"></i>
            </a>

            <a href="https://t.me/allenchkk" target="_blank" className="header-btn">
                <i class="fa-brands fa-telegram"></i>
            </a>

            <button onClick={onToggleMode} className="header-btn switch-mode">
                {mode === 'light'
                    ? <i class="fa-regular fa-moon"></i> 
                    : <i class="fa-regular fa-sun"></i>}
            </button>
            
        </header>
    )
}