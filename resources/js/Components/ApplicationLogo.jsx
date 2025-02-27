export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Gradient background */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4FC3F7" />
                    <stop offset="100%" stopColor="#2196F3" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
                </filter>
            </defs>
            
            {/* Main rounded square */}
            <rect x="15" y="15" width="70" height="70" rx="16" 
                fill="url(#logoGradient)" 
                filter="url(#shadow)"
            />
            
            {/* White inner shape */}
            <rect x="25" y="25" width="50" height="50" rx="10" fill="white" />
            
            {/* Stylized "N" */}
            <path 
                d="M33 35L33 65L40 65L40 45L47 65L54 65L54 35L47 35L47 55L40 35L33 35Z" 
                fill="#2196F3"
            />
            
            {/* Dot for "o" */}
            <circle cx="60" cy="42" r="5" fill="#FF5252" />
            
            {/* Stylized "Bi" */}
            <path 
                d="M57 50C57 50 62 50 65 50C68 50 70 52 70 55C70 58 68 60 65 60C62 60 57 60 57 60L57 50Z" 
                fill="#2196F3"
            />
            
            {/* Dot for "i" */}
            <circle cx="63" cy="65" r="3" fill="#FF5252" />
            
            {/* Decorative elements */}
            <circle cx="20" cy="20" r="3" fill="#FFEB3B" />
            <circle cx="80" cy="20" r="3" fill="#FFEB3B" />
            <circle cx="20" cy="80" r="3" fill="#FFEB3B" />
            <circle cx="80" cy="80" r="3" fill="#FFEB3B" />
        </svg>
    );
}
