// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.site-header nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isVisible = nav.style.display === 'flex';
        nav.style.display = isVisible ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.right = '0';
        nav.style.left = '0';
        nav.style.background = '#FFFFFF';
        nav.style.borderBottom = '3px solid #1A1A1A';
        nav.style.padding = '1rem';
        nav.style.gap = '0.5rem';
    });
}

// ===== Fetch Contributors from GitHub =====
// IMPORTANT: Replace 'yourusername' with your actual GitHub username
const GITHUB_REPO = 'nidalbenyakhelf/yoobify';
const CONTRIBUTORS_API = `https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=20`;

async function loadContributors() {
    const container = document.getElementById('contributors-list');
    
    if (!container) return;
    
    try {
        const response = await fetch(CONTRIBUTORS_API);
        
        if (!response.ok) {
            throw new Error('Failed to fetch contributors');
        }
        
        const contributors = await response.json();
        
        // Clear placeholder
        container.innerHTML = '';
        
        if (contributors.length === 0) {
            container.innerHTML = `
                <div class="contributor-placeholder">
                    <i class="fa-solid fa-user-plus"></i>
                    <p>No contributors yet. Be the first!</p>
                </div>
            `;
            return;
        }
        
        contributors.forEach(contributor => {
            const card = document.createElement('div');
            card.className = 'contributor-card';
            card.innerHTML = `
                <a href="${contributor.html_url}" target="_blank" rel="noopener">
                    <img src="${contributor.avatar_url}" alt="${contributor.login}">
                    <div class="name">${contributor.login}</div>
                    <div class="contributions">${contributor.contributions} contribution${contributor.contributions !== 1 ? 's' : ''}</div>
                </a>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading contributors:', error);
        container.innerHTML = `
            <div class="contributor-placeholder">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Could not load contributors. Check the GitHub repository directly.</p>
            </div>
        `;
    }
}

// Load contributors when page loads
document.addEventListener('DOMContentLoaded', loadContributors);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768 && nav) {
                nav.style.display = 'none';
            }
        }
    });
});

// ===== Simple Input Interaction (placeholder for future) =====
const searchBtn = document.querySelector('.btn-primary');
const searchInput = document.querySelector('.input-box input');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        const url = searchInput.value.trim();
        if (!url) {
            searchInput.style.borderColor = '#FF4422';
            searchInput.placeholder = 'Please paste a playlist link first...';
            setTimeout(() => {
                searchInput.style.borderColor = '#1A1A1A';
                searchInput.placeholder = 'Paste Spotify or Deezer playlist link here...';
            }, 2000);
            return;
        }
        alert('This feature is coming soon! We are working on the API integration.');
    });
}