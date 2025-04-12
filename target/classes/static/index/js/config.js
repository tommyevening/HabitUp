/**
 * HabbitUp - Konfiguracja aplikacji
 * 
 * Ten plik zawiera główne ustawienia aplikacji i stałe używane w całym kodzie.
 */

const HABBITUP_CONFIG = {
    /**
     * Ustawienia API
     */
    api: {
        baseUrl: '/api/v1',
        timeout: 10000, // ms
        endpoints: {
            auth: {
                login: '/auth/login',
                register: '/auth/register',
                logout: '/auth/logout',
                refreshToken: '/auth/refresh-token'
            },
            user: {
                profile: '/user/profile',
                settings: '/user/settings',
                habits: '/user/habits'
            },
            chat: {
                messages: '/chat/messages',
                send: '/chat/send'
            }
        }
    },

    /**
     * Ustawienia autoryzacji
     */
    auth: {
        tokenName: 'habbitup_token',
        refreshTokenName: 'habbitup_refresh_token',
        tokenExpiry: 60 * 60 * 1000, // 1 godzina w ms
        autoRefresh: true
    },

    /**
     * Ustawienia UI
     */
    ui: {
        theme: 'dark',
        notificationDuration: 5000, // ms
        animations: true,
        defaultLang: 'pl'
    },

    /**
     * Ustawienia debugowania
     */
    debug: {
        enabled: false,
        logLevel: 'error', // 'debug', 'info', 'warn', 'error'
    },

    /**
     * Zwraca czy aplikacja działa w środowisku produkcyjnym
     * @returns {boolean}
     */
    isProduction() {
        return window.location.hostname !== 'localhost' && 
               !window.location.hostname.includes('127.0.0.1') && 
               !window.location.hostname.includes('192.168.');
    }
};

// Włącz debugowanie w środowisku lokalnym
if (!HABBITUP_CONFIG.isProduction()) {
    HABBITUP_CONFIG.debug.enabled = true;
    HABBITUP_CONFIG.debug.logLevel = 'debug';
    
    console.info('HabbitUp uruchomiony w trybie lokalnym - debugowanie włączone');
} 