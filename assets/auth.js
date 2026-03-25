/**
 * auth.js
 * Session management, login/logout, role checks.
 * Dipakai oleh: prototype.html, dashboard.html
 */


async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
async function verifyLogin(username, password) {
    if (CONFIG.USE_MOCK_DATA) {
        const cfg = AUTH_CONFIG[username];
        return cfg && cfg.password === password ? cfg.role : null;
    }
    try {
        const hashedPassword = await hashPassword(password);
        const result = await apiGet('verifyAuth', { username, password: hashedPassword });
        return result.role ? result : null;
    } catch {
        return null;
    }
}
  function openLoginModal() { document.getElementById('login-modal').classList.add('open'); }
        function closeLoginModal() {
            document.getElementById('login-modal').classList.remove('open');
            document.getElementById('login-error').style.display = 'none';
            document.getElementById('login-form').reset();
        }
        async function handleLogin(e) {
            e.preventDefault();
            const u = document.getElementById('login-username').value.trim().toLowerCase();
            const p = document.getElementById('login-password').value;

            const result = await verifyLogin(u, p);
            const role = result?.role || null;
            if (role) {
                const picName = result?.picName || u.toUpperCase();
                currentSession = { role: role, username: u, picName: picName };
                sessionStorage.setItem('ip_session', JSON.stringify({ role: role, username: u, picName: picName }));
                currentRole = role;
                closeLoginModal();
                showToast(`✅ Berhasil login sebagai ${u.toUpperCase()}`);
                logActivity(`Logged in as ${u}`);
                updateNavVisibility();
              if (role === 'sales') {
    window.location.href = 'sales.html';
} else {
    window.location.href = 'dashboard.html';
}
            } else {
                document.getElementById('login-error').style.display = 'block';
            }
            return false;
        }
        function logout() {
            currentSession = { role: null, username: null };
            sessionStorage.removeItem('ip_session');
            currentRole = 'sales';
            showToast('👋 Berhasil logout!', 'success');
            logActivity('Logged out');
            updateNavVisibility();
            switchMenu('update');
        }
        function updateNavVisibility() {
        
            const isLogged = !!currentSession.role;
            const isSuper = currentSession.role === 'superadmin';
            document.getElementById('btn-login').classList.toggle('hidden', isLogged);
            const btnLogout = document.getElementById('btn-logout');
            btnLogout.classList.toggle('hidden', !isLogged);
            if (isLogged) btnLogout.textContent = `Logout [${currentSession.username}]`;
            document.getElementById('nav-monitoring').classList.toggle('hidden', !isLogged);
            document.getElementById('nav-control').classList.toggle('hidden', !isSuper);

            const sp = document.getElementById('sales-name-picker');
            if (sp) {
                sp.innerHTML = '';
                if (isLogged) {
                    sp.innerHTML = '<option value="ALL">Semua Sales</option>';
                    picNames.forEach(n => sp.innerHTML += `<option value="${n}">${n}</option>`);
                    sp.value = 'ALL';
                    currentSalesUser = 'ALL';
                } else {
                    picNames.forEach(n => sp.innerHTML += `<option value="${n}">${n}</option>`);
                    currentSalesUser = picNames[0];
                    sp.value = currentSalesUser;
                }
            }
        }   
        function canSeeAllData() { return ['admin', 'superadmin'].includes(currentRole); }
        function canDelete() { return ['superadmin'].includes(currentRole); }
        function canExportCSV() { return ['superadmin'].includes(currentRole); }
        function canEditDropdowns() { return ['admin', 'superadmin'].includes(currentRole); }
        function isSuperAdmin() { return currentRole === 'superadmin'; }   