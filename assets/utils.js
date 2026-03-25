/**
 * utils.js
 * Utility functions: formatting, badges, toast, logging.
 * Dipakai oleh: prototype.html, dashboard.html, sales.html
 */
        // Helper: current ISO week
        function getISOWeek(d) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }
        // Currency formatting
                function fmtRp(n) {
            if (n === null || n === undefined || isNaN(n)) return 'Rp 0';
            return 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        function parseCurrency(s) {
            if (!s) return 0;
            const val = parseInt(s.toString().replace(/[^\d]/g, ''));
            return isNaN(val) ? 0 : val;
        }
        function formatCurrency(el) {
            let v = el.value.replace(/[^\d]/g, '');
            el.value = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        function calcForecast() {
    if (nettoManuallyEdited) return;
    const brutto = parseCurrency(document.getElementById('f-brutto').value);
    const ppn = document.getElementById('f-ppn').value;
    const cbInput = document.getElementById('f-cb').value;
    const cbVal = cbInput ? parseFloat(cbInput) : 0;
    const cbDecimal = cbVal / 100;
    const dpp = ppn === 'PPN' ? Math.round(brutto / 1.11) : brutto;
    const netto = Math.round(dpp * (1 - cbDecimal));
    document.getElementById('f-netto').value = netto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    document.getElementById('f-netto-hint').textContent = `DPP: ${fmtRp(dpp)} → Netto: ${fmtRp(netto)} (CB: ${cbVal}%)`;
}

        function manualNettoEdit(el) {
            nettoManuallyEdited = true;
            formatCurrency(el);
            document.getElementById('f-netto-hint').textContent = "(diisi manual)";
        }
        // ID & badges
        function generateFunnelId(picName) {
            if (!picName) return '';
            const initials = picName.split(' ').map(n => n[0]).join('').toUpperCase();
            const picEntries = funnelData.filter(f => f.pic === picName);
            const seq = (picEntries.length + 1).toString().padStart(4, '0');
            return `${initials}-${seq}`;
        }
        function getStatusBadgeClass(s) {
            const map = {
                'Gagal':               'badge-dead',
                'Informasi Peluang':   'badge-pendekatan',
                'Informasi Kebutuhan': 'badge-shortlisted',
                'Presentasi':          'badge-pitching',
                'Peluang':             'badge-pitching',
                'Hot Prospek':         'badge-closing',
                'Closing':             'badge-deal'
            };
            return map[s] || 'badge-pendekatan';
        }
        function getStatusRowClass(s) {
            const map = {
                'Gagal':               'status-row-dead',
                'Informasi Peluang':   'status-row-pendekatan',
                'Informasi Kebutuhan': 'status-row-shortlisted',
                'Presentasi':          'status-row-pitching',
                'Peluang':             'status-row-pitching',
                'Hot Prospek':         'status-row-closing',
                'Closing':             'status-row-deal'
            };
            return map[s] || '';
        }
        function getTKBadgeClass(tk) {
            const v = parseInt(tk);
            if (v >= 100) return 'badge-100';
            if (v >= 75) return 'badge-75';
            if (v >= 50) return 'badge-50';
            if (v >= 25) return 'badge-25';
            if (v >= 10) return 'badge-10';
            return 'badge-5';
        }
        // Toast & logging
                function showToast(msg, type = 'success') {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.className = `toast toast-${type} show`;
            setTimeout(() => t.classList.remove('show'), 3000);
        }
        function logActivity(action) {
            const now = today.toLocaleDateString('id-ID');
            const roleStr = currentRole ? currentRole.toUpperCase() : 'SYSTEM';
            activityLog.unshift({ time: now + ' ' + new Date().toLocaleTimeString('id-ID'), role: roleStr, action });
            if (activityLog.length > 50) activityLog.pop();
        }
     