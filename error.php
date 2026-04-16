<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
    <title>🚀 SPACE GLITCH · Error</title>
    <!-- Google Fonts + Font Awesome -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none; /* optional, keeps clean */
        }

        html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            background: #03050b;
        }

        /* animated starfield background */
        .starfield {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
        }

        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            opacity: 0.7;
            animation: floatStar linear infinite;
        }

        @keyframes floatStar {
            0% {
                transform: translateY(0vh) translateX(0px);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(100vh) translateX(20px);
                opacity: 0;
            }
        }

        /* main content layer */
        .error-container {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            backdrop-filter: blur(2px);
        }

        /* minimal header */
        .space-header {
            background: rgba(3, 7, 20, 0.6);
            backdrop-filter: blur(12px);
            padding: 0.8rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(251, 191, 36, 0.3);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logo i {
            font-size: 1.3rem;
            color: #fbbf24;
        }

        .logo span {
            font-size: 0.8rem;
            font-weight: 500;
            color: #cbd5e6;
        }

        .error-tag {
            background: rgba(251, 191, 36, 0.15);
            padding: 0.2rem 0.9rem;
            border-radius: 40px;
            font-size: 0.7rem;
            font-weight: 600;
            color: #fde047;
            border: 1px solid rgba(251, 191, 36, 0.4);
        }

        /* main content — centered, minimal text */
        .error-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 1rem;
        }

        .error-card {
            max-width: 500px;
            width: 100%;
        }

        /* astronaut + glitch */
        .astro-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 1rem;
        }

        .astronaut {
            font-size: 5rem;
            color: #cbd5e6;
            filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.4));
            animation: floatAstro 2.5s infinite ease-in-out;
        }

        @keyframes floatAstro {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }

        .warning-sign {
            position: absolute;
            bottom: -5px;
            right: -18px;
            font-size: 1.8rem;
            color: #f97316;
            animation: pulseWarn 1.2s infinite;
        }

        @keyframes pulseWarn {
            0% { transform: scale(0.9); opacity: 0.6; }
            100% { transform: scale(1.2); opacity: 1; }
        }

        /* big obvious error */
        .error-title {
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #fbbf24, #f97316);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            margin-bottom: 0.5rem;
        }

        .error-sub {
            font-size: 0.9rem;
            color: #fcd34d;
            background: rgba(251, 191, 36, 0.1);
            display: inline-block;
            padding: 0.2rem 1rem;
            border-radius: 30px;
            margin-bottom: 1.2rem;
        }

        /* very short description */
        .short-message {
            color: #9ca3af;
            font-size: 0.85rem;
            max-width: 320px;
            margin: 0 auto 1.2rem;
            line-height: 1.4;
        }

        /* minimal stats */
        .space-stats {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            border-radius: 2rem;
            padding: 0.4rem 1rem;
            display: inline-flex;
            gap: 1rem;
            margin: 0.5rem 0 1.5rem;
            border: 1px solid #334155;
            font-size: 0.7rem;
            color: #cbd5e1;
        }

        .space-stats i {
            color: #fbbf24;
            margin-right: 4px;
        }

        /* buttons */
        .actions {
            display: flex;
            gap: 0.8rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-primary {
            background: #f59e0b;
            border: none;
            padding: 0.6rem 1.5rem;
            border-radius: 3rem;
            font-weight: 600;
            font-size: 0.8rem;
            color: #0a0c15;
            cursor: pointer;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary:hover {
            background: #eab308;
            transform: scale(0.96);
        }

        .btn-outline {
            background: transparent;
            border: 1px solid #f59e0b;
            padding: 0.6rem 1.5rem;
            border-radius: 3rem;
            font-weight: 500;
            font-size: 0.8rem;
            color: #fcd34d;
            cursor: pointer;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-outline:hover {
            background: rgba(245, 158, 11, 0.1);
        }

        /* minimal footer */
        .space-footer {
            background: rgba(3, 7, 18, 0.5);
            backdrop-filter: blur(8px);
            border-top: 1px solid rgba(251, 191, 36, 0.2);
            padding: 0.4rem 2rem;
            display: flex;
            justify-content: space-between;
            font-size: 0.6rem;
            color: #6c7a96;
        }

        .space-footer i {
            margin-right: 4px;
            color: #fbbf24;
        }

        /* responsive */
        @media (max-width: 550px) {
            .astronaut {
                font-size: 3.5rem;
            }
            .warning-sign {
                font-size: 1.3rem;
                right: -12px;
            }
            .error-title {
                font-size: 1.5rem;
            }
            .btn-primary, .btn-outline {
                padding: 0.5rem 1.2rem;
                font-size: 0.7rem;
            }
            .space-header {
                padding: 0.5rem 1rem;
            }
        }

        /* hide scroll */
        body {
            overflow: hidden;
        }
    </style>
</head>
<body>
<div class="starfield" id="starfield"></div>

<div class="error-container">
    <header class="space-header">
        <div class="logo">
            <i class="fas fa-rocket"></i>
            <span>DocuSpace · Mission Control</span>
        </div>
        <div class="error-tag">
            <i class="fas fa-satellite-dish"></i> ORBIT ERROR
        </div>
    </header>

    <div class="error-main">
        <div class="error-card">
            <div class="astro-wrapper">
                <div class="astronaut">
                    <i class="fas fa-user-astronaut"></i>
                </div>
                <div class="warning-sign">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
            </div>

            <div class="error-title">
                🚨 SYSTEM ERROR 🚨
            </div>
            <div class="error-sub">
                <i class="fas fa-meteor"></i> Houston, we have a problem
            </div>
            <div class="short-message">
                Something went wrong — the document capsule drifted into deep space.
            </div>

            <div class="space-stats">
                <span><i class="fas fa-signal"></i> 0%</span>
                <span><i class="fas fa-hourglass-half"></i> recovery pending</span>
            </div>

            <div class="actions">
                <button class="btn-primary" id="refreshBtn">
                    <i class="fas fa-sync-alt"></i> Re-enter
                </button>
                <button class="btn-outline" id="backBtn">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </div>
    </div>

    <footer class="space-footer">
        <div><i class="fas fa-telescope"></i> Error · no specific code</div>
        <div><i class="fas fa-radar"></i> deep space glitch</div>
    </footer>
</div>

<script>
    // animated starfield (falling stars)
    function initStars() {
        const container = document.getElementById('starfield');
        const starCount = 120;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDuration = Math.random() * 4 + 3 + 's';
            star.style.animationDelay = Math.random() * 5 + 's';
            star.style.opacity = Math.random() * 0.6 + 0.2;
            container.appendChild(star);
        }
    }
    initStars();

    // button handlers
    const refreshBtn = document.getElementById('refreshBtn');
    const backBtn = document.getElementById('backBtn');
    if (refreshBtn) refreshBtn.onclick = () => window.location.reload();
    if (backBtn) backBtn.onclick = () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = '/';
    };
</script>
</body>
</html>