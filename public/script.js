/**
 * yoobify - Main Application Logic
 * Uses Deezer JSONP API to bypass CORS restrictions
 */

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        GITHUB_REPO: 'nidalbenyakhelf/yoobify',
        DEEZER_API_BASE: 'https://api.deezer.com',
        PLAYLIST_ID_REGEX: /playlist\/(\d+)/i
    };

    // ===== DOM Elements =====
    const DOM = {
        form: document.getElementById('playlist-form'),
        input: document.getElementById('playlist-url'),
        loadingState: document.getElementById('loading-state'),
        errorState: document.getElementById('error-state'),
        errorText: document.getElementById('error-text'),
        resultsSection: document.getElementById('results-section'),
        playlistTitle: document.getElementById('playlist-title'),
        playlistMeta: document.getElementById('playlist-meta'),
        trackList: document.getElementById('track-list'),
        resetBtn: document.getElementById('reset-btn'),
        contributorsList: document.getElementById('contributors-list'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        nav: document.querySelector('.site-header nav')
    };

    // ===== Utility Functions =====
    const Utils = {
        extractPlaylistId(url) {
            const match = url.match(CONFIG.PLAYLIST_ID_REGEX);
            return match ? match[1] : null;
        },

        sanitizeHTML(str) {
            if (!str) return '';
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },

        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        /**
         * JSONP helper - bypasses CORS by loading script tags
         */
        jsonp(url, callbackName = 'callback') {
            return new Promise((resolve, reject) => {
                const uniqueCallback = 'yoobify_jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
                const separator = url.includes('?') ? '&' : '?';
                const fullUrl = `${url}${separator}output=jsonp&${callbackName}=${uniqueCallback}`;

                // Create global callback
                window[uniqueCallback] = function(data) {
                    resolve(data);
                    cleanup();
                };

                // Create script tag
                const script = document.createElement('script');
                script.src = fullUrl;
                script.async = true;

                // Handle errors
                const timeout = setTimeout(() => {
                    reject(new Error('Request timed out'));
                    cleanup();
                }, 10000);

                script.onerror = function() {
                    reject(new Error('Failed to load script'));
                    cleanup();
                };

                function cleanup() {
                    clearTimeout(timeout);
                    delete window[uniqueCallback];
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }

                document.head.appendChild(script);
            });
        }
    };

    // ===== API Services =====
    const API = {
        /**
         * Fetches playlist data from Deezer API using JSONP
         */
        async getDeezerPlaylist(playlistId) {
            const url = `${CONFIG.DEEZER_API_BASE}/playlist/${playlistId}`;
            
            try {
                const data = await Utils.jsonp(url);
                
                if (!data || !data.tracks) {
                    throw new Error('Invalid response from Deezer API');
                }
                
                return data;
            } catch (error) {
                if (error.message.includes('timed out')) {
                    throw new Error('Request timed out. Please check your connection and try again.');
                }
                if (error.message.includes('Failed to load')) {
                    throw new Error('Failed to connect to Deezer. Please try again later.');
                }
                throw error;
            }
        },

        /**
         * Fetches contributors from GitHub API
         */
        async getContributors() {
            const url = `https://api.github.com/repos/${CONFIG.GITHUB_REPO}/contributors?per_page=20`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch contributors');
            }
            
            return await response.json();
        }
    };

    // ===== UI Controller =====
    const UI = {
        showLoading() {
            DOM.loadingState.style.display = 'flex';
            DOM.errorState.style.display = 'none';
            DOM.resultsSection.style.display = 'none';
        },

        showError(message) {
            DOM.loadingState.style.display = 'none';
            DOM.errorText.textContent = message;
            DOM.errorState.style.display = 'flex';
            DOM.resultsSection.style.display = 'none';
        },

        hideAllStates() {
            DOM.loadingState.style.display = 'none';
            DOM.errorState.style.display = 'none';
        },

        displayResults(playlist) {
            DOM.hideAllStates();
            
            DOM.playlistTitle.textContent = Utils.sanitizeHTML(playlist.title);
            const trackCount = Utils.formatNumber(playlist.nb_tracks);
            const creator = playlist.creator ? Utils.sanitizeHTML(playlist.creator.name) : 'Unknown';
            DOM.playlistMeta.textContent = `${trackCount} tracks • By ${creator}`;
            
            DOM.trackList.innerHTML = '';
            
            const fragment = document.createDocumentFragment();
            
            playlist.tracks.data.forEach(track => {
                const li = document.createElement('li');
                li.className = 'track-item';
                
                const coverUrl = track.album && track.album.cover_medium 
                    ? Utils.sanitizeHTML(track.album.cover_medium) 
                    : '';
                
                li.innerHTML = `
                    ${coverUrl ? `<img src="${coverUrl}" 
                         alt="${Utils.sanitizeHTML(track.album.title)} cover" 
                         class="track-cover"
                         loading="lazy">` : '<div class="track-cover" style="background:#ddd;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-music" style="color:#999;"></i></div>'}
                    <div class="track-info">
                        <div class="track-title">${Utils.sanitizeHTML(track.title)}</div>
                        <div class="track-artist">${Utils.sanitizeHTML(track.artist ? track.artist.name : 'Unknown Artist')}</div>
                    </div>
                    ${track.preview ? `
                        <div class="track-preview">
                            <audio controls preload="none">
                                <source src="${Utils.sanitizeHTML(track.preview)}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ` : '<div class="track-preview" style="opacity: 0.3; display:flex; align-items:center; gap:0.3rem;"><i class="fa-solid fa-music"></i> No preview</div>'}
                `;
                
                fragment.appendChild(li);
            });
            
            DOM.trackList.appendChild(fragment);
            DOM.resultsSection.style.display = 'block';
            
            DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        resetView() {
            DOM.hideAllStates();
            DOM.resultsSection.style.display = 'none';
            DOM.input.value = '';
            DOM.input.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        async renderContributors() {
            if (!DOM.contributorsList) return;
            
            try {
                const contributors = await API.getContributors();
                DOM.contributorsList.innerHTML = '';
                
                if (contributors.length === 0) {
                    DOM.contributorsList.innerHTML = `
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
                        <a href="${Utils.sanitizeHTML(contributor.html_url)}" target="_blank" rel="noopener">
                            <img src="${Utils.sanitizeHTML(contributor.avatar_url)}" alt="${Utils.sanitizeHTML(contributor.login)}">
                            <div class="name">${Utils.sanitizeHTML(contributor.login)}</div>
                            <div class="contributions">${contributor.contributions} contribution${contributor.contributions !== 1 ? 's' : ''}</div>
                        </a>
                    `;
                    DOM.contributorsList.appendChild(card);
                });
            } catch (error) {
                console.error('Error loading contributors:', error);
                DOM.contributorsList.innerHTML = `
                    <div class="contributor-placeholder">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>Could not load contributors. Check the GitHub repository directly.</p>
                    </div>
                `;
            }
        }
    };

    // ===== Event Handlers =====
    const Handlers = {
        async handleFormSubmit(e) {
            e.preventDefault();
            
            const url = DOM.input.value.trim();
            
            if (!url) {
                UI.showError('Please enter a playlist URL.');
                return;
            }
            
            const playlistId = Utils.extractPlaylistId(url);
            
            if (!playlistId) {
                UI.showError('Invalid Deezer playlist URL. Please use a link like: https://www.deezer.com/playlist/123456');
                return;
            }
            
            UI.showLoading();
            
            try {
                const playlist = await API.getDeezerPlaylist(playlistId);
                UI.displayResults(playlist);
            } catch (error) {
                UI.showError(error.message || 'An unexpected error occurred.');
            }
        },

        handleReset() {
            UI.resetView();
        },

        handleMobileMenu() {
            if (!DOM.mobileMenuBtn || !DOM.nav) return;
            
            DOM.mobileMenuBtn.addEventListener('click', () => {
                const isVisible = DOM.nav.style.display === 'flex';
                DOM.nav.style.display = isVisible ? 'none' : 'flex';
                DOM.nav.style.flexDirection = 'column';
                DOM.nav.style.position = 'absolute';
                DOM.nav.style.top = '100%';
                DOM.nav.style.right = '0';
                DOM.nav.style.left = '0';
                DOM.nav.style.background = '#FFFFFF';
                DOM.nav.style.borderBottom = '3px solid #1A1A1A';
                DOM.nav.style.padding = '1rem';
                DOM.nav.style.gap = '0.5rem';
                DOM.nav.style.zIndex = '99';
            });
        },

        handleSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        if (window.innerWidth <= 768 && DOM.nav) {
                            DOM.nav.style.display = 'none';
                        }
                    }
                });
            });
        }
    };

    // ===== Initialization =====
    function init() {
        if (DOM.form) {
            DOM.form.addEventListener('submit', Handlers.handleFormSubmit);
        }
        
        if (DOM.resetBtn) {
            DOM.resetBtn.addEventListener('click', Handlers.handleReset);
        }
        
        Handlers.handleMobileMenu();
        Handlers.handleSmoothScroll();
        
        UI.renderContributors();
        
        console.log('yoobify initialized successfully.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
