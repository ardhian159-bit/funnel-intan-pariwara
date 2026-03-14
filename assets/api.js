/**
 * api.js
 * Konfigurasi API dan fungsi fetch ke Google Apps Script.
 * Dipakai oleh: prototype.html, dashboard.html
 */
/**
 * api.js
 * Konfigurasi API dan fungsi fetch ke Google Apps Script.
 * Dipakai oleh: prototype.html, dashboard.html
 */

const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxchhQHWthWjnmffOMGgDt1ShO3-D-T0XXOmpGNvP6jhgmtdCQZ5hiXcyymixjCRZOxNA/exec',
    TOKEN: 'IPFUNNEL2026',
    USE_MOCK_DATA: false
};

async function apiGet(action, params = {}) {
    const url = new URL(CONFIG.APPS_SCRIPT_URL);
    url.searchParams.set('action', action);
    url.searchParams.set('token', CONFIG.TOKEN);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
}

async function apiPost(action, body = {}) {
    const url = new URL(CONFIG.APPS_SCRIPT_URL);
    url.searchParams.set('action', action);
    url.searchParams.set('token', CONFIG.TOKEN);
    url.searchParams.set('payload', JSON.stringify(body));
    const res = await fetch(url.toString());
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
}