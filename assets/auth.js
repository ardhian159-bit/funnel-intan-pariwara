/**
 * auth.js
 * Session management, login/logout, role checks.
 * Dipakai oleh: prototype.html, dashboard.html
 */


        async function verifyLogin(username, password) {
            if (CONFIG.USE_MOCK_DATA) {
                const cfg = AUTH_CONFIG[username];
                return cfg && cfg.password === password ? cfg.role : null;
            }
            try {
                const result = await apiGet('verifyAuth', { username, password });
                return result.role || null;
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

            const role = await verifyLogin(u, p);
            if (role) {
                currentSession = { role: role, username: u };
                sessionStorage.setItem('ip_session', JSON.stringify({ role: role, username: u }));
                currentRole = currentSession.role;
                closeLoginModal();
                showToast(`✅ Berhasil login sebagai ${u.toUpperCase()}`);
                logActivity(`Logged in as ${u}`);
                updateNavVisibility();
               window.location.href = 'dashboard.html';
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

            document.getElementById('nav-dashboard').classList.toggle('hidden', !isLogged);
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