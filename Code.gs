// =============================================================================
// GOOGLE APPS SCRIPT — Sales Management System (Intan Pariwara 2026)
// Sheet ID: 1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ
// Tabs: LEADS | TRACKER | USERS
// =============================================================================

var SHEET_ID = '1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ';
var AUTH_TOKEN = 'IPFUNNEL2026';

// =============================================================================
// CORS & RESPONSE HELPERS
// =============================================================================

function createJsonOutput(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function errorResponse(message) {
  return createJsonOutput({ error: message });
}

function successResponse(data) {
  return createJsonOutput(data);
}

// =============================================================================
// A1. doGet(e) — Main GET Router
// =============================================================================

function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var token = params.token || '';
    var action = params.action || '';

    // Token authentication
    if (token !== AUTH_TOKEN) {
      return errorResponse('Unauthorized');
    }

    switch (action) {
      case 'ping':
        return successResponse({ status: 'ok' });

      case 'getLeads':
        var glRole = params.role || '';
        var glUsername = params.username || '';
        return successResponse(getLeads(glRole, glUsername));

      case 'getTrackers':
        return successResponse(getTrackers());

      case 'verifyAuth':
        var username = params.username || '';
        var password = params.password || '';
        return successResponse(verifyAuth(username, password));

      case 'addLead':
        var payload = params.payload ? JSON.parse(params.payload) : {};
        return successResponse(addLead(payload));

      case 'updateTracker':
        var payload = params.payload ? JSON.parse(params.payload) : {};
        return successResponse(updateTracker(payload));

      case 'getSettings':
        return successResponse(getSettings());

      case 'saveSettings':
        var payload = params.payload ? JSON.parse(params.payload) : {};
        return successResponse(saveSettings(payload));

      case 'getUsers':
        return successResponse(getUsers());

      case 'addUser':
        var payload = params.payload ? JSON.parse(params.payload) : {};
        return successResponse(addUser(payload));

      case 'updateUser':
        var payload = params.payload ? JSON.parse(params.payload) : {};
        return successResponse(updateUser(payload));

      case 'deleteUser':
        var delUsername = params.username || '';
        return successResponse(deleteUser(delUsername));

      default:
        return errorResponse('Aksi tidak dikenali: ' + action);
    }
  } catch (err) {
    return errorResponse('Terjadi kesalahan server: ' + err.message);
  }
}

// =============================================================================
// A2. doPost(e) — Main POST Router
// =============================================================================

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    var token = body.token || '';
    var action = body.action || '';

    // Token authentication
    if (token !== AUTH_TOKEN) {
      return errorResponse('Unauthorized');
    }

    switch (action) {
      case 'addLead':
        return successResponse(addLead(body));

      case 'updateTracker':
        return successResponse(updateTracker(body));

      default:
        return errorResponse('Aksi tidak dikenali: ' + action);
    }
  } catch (err) {
    return errorResponse('Terjadi kesalahan server: ' + err.message);
  }
}

// =============================================================================
// A4. getLeads() — Read all LEADS rows
// =============================================================================

function getLeads(role, username) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('LEADS');
    if (!sheet) return [];

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return []; // Only header row or empty

    var lastCol = sheet.getLastColumn();
    if (lastCol < 1) return [];

    var range = sheet.getRange(2, 1, lastRow - 1, lastCol);
    var values = range.getValues();
    var result = [];

    // Column mapping (1-based in sheet, 0-based in array):
    // A=0: NO
    // B=1: funnelId
    // C=2: principal
    // D=3: status
    // E=4: pic
    // F=5: instansi
    // G=6: wilayah
    // H=7: kabupatenKota
    // I=8: provinsi
    // J=9: namaPaket
    // K=10: sumberDana
    // L=11: nilaiAnggaran
    // M=12: dpp
    // N=13: forecastNetto
    // O=14: ppnNon
    // P=15: perkiraanCb
    // Q=16: produk
    // R=17: qty
    // S=18: satuan
    // T=19: jenisProduk
    // U=20: tk
    // V=21: quarter
    // W=22: timestamp
    // X=23: keterangan

    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      // Skip empty rows (check if funnelId or namaPaket is empty)
      if (!row[1] && !row[9]) continue;

      // Convert tk from decimal (0.5) to integer percentage (50)
      var tkRaw = row[20] || 0;
      var tkValue = (typeof tkRaw === 'number' && tkRaw > 0 && tkRaw <= 1) ? Math.round(tkRaw * 100) : (typeof tkRaw === 'number' ? tkRaw : parseInt(tkRaw) || 0);

      result.push({
        id: row[0] || (i + 1),
        no: row[0] || (i + 1),
        funnelId: row[1] || '',
        principal: row[2] || '',
        status: row[3] || '',
        pic: row[4] || '',
        instansi: row[5] || '',
        wilayah: row[6] || '',
        kabupatenKota: row[7] || '',
        provinsi: row[8] || '',
        namaPaket: row[9] || '',
        sumberDana: row[10] || '',
        nilaiAnggaran: row[11] || 0,
        dpp: row[12] || 0,
        forecastNetto: row[13] || 0,
        ppnNon: row[14] || '',
        perkiraanCb: row[15] || 0,
        produk: row[16] || '',
        qty: row[17] || 0,
        satuan: row[18] || '',
        jenisProduk: row[19] || '',
        tk: tkValue,
        quarter: row[21] || '',
        timestamp: row[22] || '',
        keterangan: row[23] || ''
      });
    }

    // Backend role filter — sales hanya bisa lihat data milik sendiri
    if (role === 'sales' && username) {
      result = result.filter(function(row) {
        return (row.pic || '').toLowerCase().trim() === username.toLowerCase().trim();
      });
    }
    return result;
  } catch (err) {
    throw new Error('Gagal membaca data LEADS: ' + err.message);
  }
}

// =============================================================================
// A5. getTrackers() — Read all TRACKER rows
// =============================================================================

function getTrackers() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('TRACKER');
    if (!sheet) return [];

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];

    var lastCol = sheet.getLastColumn();
    if (lastCol < 1) return [];

    var range = sheet.getRange(2, 1, lastRow - 1, lastCol);
    var values = range.getValues();
    var result = [];

    // Column mapping:
    // A=0: id
    // B=1: funnelId
    // C=2: pic
    // D=3: namaPaket
    // E=4: statusBaru
    // F=5: forecastNetto
    // G=6: notes
    // H=7: week
    // I=8: adminNotes
    // J=9: timestamp

    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      // Skip empty rows
      if (!row[1] && !row[2]) continue;

      result.push({
        id: row[0] || (i + 1),
        funnelId: row[1] || '',
        pic: row[2] || '',
        namaPaket: row[3] || '',
        statusBaru: row[4] || '',
        forecastNetto: row[5] || 0,
        notes: row[6] || '',
        week: row[7] || '',
        adminNotes: row[8] || '',
        timestamp: row[9] || ''
      });
    }

    return result;
  } catch (err) {
    throw new Error('Gagal membaca data TRACKER: ' + err.message);
  }
}

// =============================================================================
// A5b. generateFunnelId(picName, sheet) — Generate unique funnel ID
// =============================================================================

function generateFunnelId(picName, sheet) {
    if (!picName) return '';

    var firstName = picName.split(' ')[0].toUpperCase();
    var prefix = firstName.substring(0, 3);

    // Ambil semua funnelId yang ada di sheet
    var lastRow = sheet.getLastRow();
    var existingIds = lastRow >= 2
        ? sheet.getRange(2, 2, lastRow - 1, 2).getValues() // kolom B=funnelId, E=pic
        : [];

    // Cek collision: prefix yang sama tapi PIC berbeda
    var collision = existingIds.some(function(row) {
        var id = row[0] || '';
        var pic = row[1] || '';
        return id.startsWith(prefix + '-') && pic !== picName;
    });

    if (collision) prefix = firstName.substring(0, 4);

    // Hitung sequence untuk PIC ini
    var count = existingIds.filter(function(row) {
        return (row[0] || '').startsWith(prefix + '-');
    }).length;

    var seq = (count + 1).toString().padStart(4, '0');
    return prefix + '-' + seq;
}

// =============================================================================
// A6. addLead(data) — Append one row to LEADS
// =============================================================================

function addLead(data) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('LEADS');
    if (!sheet) throw new Error('Tab LEADS tidak ditemukan');

    var lastRow = sheet.getLastRow();
    var rowNumber = lastRow < 1 ? 1 : lastRow; // Next row number (NO column)

    // Auto-generate timestamp: DD/MM/YYYY HH:mm
    var now = new Date();
    var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    // Map data to correct column order matching LEADS header
    var newRow = [
      rowNumber,                         // A: NO
      data.funnelId || generateFunnelId(data.pic, sheet),  // B: funnelId
      data.principal || '',              // C: principal
      data.status || '',                 // D: status
      data.pic || '',                    // E: pic
      data.instansi || '',               // F: instansi
      data.wilayah || '',                // G: wilayah
      data.kabupatenKota || '',          // H: kabupatenKota
      data.provinsi || '',               // I: provinsi
      data.namaPaket || '',              // J: namaPaket
      data.sumberDana || '',             // K: sumberDana
      data.nilaiAnggaran || 0,           // L: nilaiAnggaran
      data.dpp || 0,                     // M: dpp
      data.forecastNetto || 0,           // N: forecastNetto
      data.ppnNon || '',                 // O: ppnNon
      data.perkiraanCb || 0,             // P: perkiraanCb
      data.produk || '',                 // Q: produk
      data.qty || 0,                     // R: qty
      data.satuan || '',                 // S: satuan
      data.jenisProduk || '',            // T: jenisProduk
      data.tk || 0,                      // U: tk
      data.quarter || '',                // V: quarter
      timestamp,                         // W: timestamp
      data.keterangan || ''              // X: keterangan
    ];

    sheet.appendRow(newRow);

    return { success: true, message: 'Data berhasil ditambahkan', rowNumber: rowNumber, timestamp: timestamp };
  } catch (err) {
    throw new Error('Gagal menyimpan data LEADS: ' + err.message);
  }
}

// =============================================================================
// A7. updateTracker(data) — Append one row to TRACKER
// =============================================================================

function updateTracker(data) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('TRACKER');
    if (!sheet) throw new Error('Tab TRACKER tidak ditemukan');

    // Auto-generate week: W[N]-[YYYY]
    var now = new Date();
    var week = data.week || getISOWeekLabel(now);

    // Check for duplicate: same funnelId + same week → overwrite
    var funnelId = data.funnelId || '';
    if (funnelId && sheet.getLastRow() >= 2) {
      var lastRow = sheet.getLastRow();
      var existingData = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
      for (var i = 0; i < existingData.length; i++) {
        if (existingData[i][1] == funnelId && existingData[i][7] == week) {
          // Overwrite existing row
          var overwriteRow = i + 2; // +2 karena header di baris 1, array 0-based
          sheet.getRange(overwriteRow, 5).setValue(data.statusBaru || data.status || '');
          sheet.getRange(overwriteRow, 6).setValue(data.forecastNetto || 0);
          sheet.getRange(overwriteRow, 7).setValue(data.notes || '');
          sheet.getRange(overwriteRow, 9).setValue(data.adminNotes || '');
          sheet.getRange(overwriteRow, 10).setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'));
          // Update status di LEADS
          updateLeadStatus(funnelId, data.statusBaru || data.status || '');
          return { success: true, message: 'Tracker berhasil diupdate (overwrite)', week: week };
        }
      }
    }

    var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
    var lastRow = sheet.getLastRow();
    var newId = lastRow < 1 ? 1 : lastRow;

    var newRow = [
      newId,                             // A: id
      funnelId,                          // B: funnelId
      data.pic || '',                    // C: pic
      data.namaPaket || '',              // D: namaPaket
      data.statusBaru || data.status || '', // E: statusBaru
      data.forecastNetto || 0,           // F: forecastNetto
      data.notes || '',                  // G: notes
      week,                              // H: week
      data.adminNotes || '',             // I: adminNotes
      timestamp                          // J: timestamp
    ];

    sheet.appendRow(newRow);
    updateLeadStatus(funnelId, data.statusBaru || data.status || '');

    return { success: true, message: 'Tracker berhasil diupdate', week: week, timestamp: timestamp };
  } catch (err) {
    throw new Error('Gagal menyimpan data TRACKER: ' + err.message);
  }
}

// =============================================================================
// A8. verifyAuth(username, password) — Verify credentials from USERS tab
// =============================================================================

function verifyAuth(username, password) {
  try {
    if (!username || !password) {
      return { error: 'Username dan password wajib diisi' };
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('USERS');
    if (!sheet) {
      return { error: 'Tab USERS tidak ditemukan' };
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { error: 'Data pengguna tidak ditemukan' };
    }

    var data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

    // Expect columns: A=username, B=password, C=role
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var dbUser = (row[0] || '').toString().trim().toLowerCase();
      var dbPass = (row[1] || '').toString().trim();
      var dbRole = (row[2] || '').toString().trim().toLowerCase();

   if (dbUser === username.toLowerCase().trim() && dbPass === password) {
        var dbPicName = (row[3] || '').toString().trim();
        return { role: dbRole, username: dbUser, picName: dbPicName };
      }
    }

    return { error: 'Username atau password salah' };
  } catch (err) {
    throw new Error('Gagal memverifikasi kredensial: ' + err.message);
  }
}
function getSettings() {
    var ss = SpreadsheetApp.openById('1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ');
    var sheet = ss.getSheetByName('SETTINGS');
    if (!sheet) return { picNames: [], principals: [], sumberDana: [] };
    var data = sheet.getDataRange().getValues();
    var result = { picNames: [], principals: [], sumberDana: [] };
    for (var i = 1; i < data.length; i++) {
        if (data[i][0]) result.picNames.push(String(data[i][0]).trim());
        if (data[i][1]) result.principals.push(String(data[i][1]).trim());
        if (data[i][2]) result.sumberDana.push(String(data[i][2]).trim());
    }
    return result;
}

function saveSettings(data) {
    var ss = SpreadsheetApp.openById('1pRr17d546bcTTZEzB4MGfb70Hr4xO-JvUKgEINYu3XQ');
    var sheet = ss.getSheetByName('SETTINGS');
    if (!sheet) sheet = ss.insertSheet('SETTINGS');
    sheet.clearContents();
    sheet.getRange(1,1,1,3).setValues([['PIC Names','Principal','Sumber Dana']]);
    var maxLen = Math.max(
        (data.picNames || []).length,
        (data.principals || []).length,
        (data.sumberDana || []).length
    );
    if (maxLen === 0) return { success: true };
    var rows = [];
    for (var i = 0; i < maxLen; i++) {
        rows.push([
            (data.picNames || [])[i] || '',
            (data.principals || [])[i] || '',
            (data.sumberDana || [])[i] || ''
        ]);
    }
    sheet.getRange(2, 1, rows.length, 3).setValues(rows);
    return { success: true };
}

// =============================================================================
// USER MANAGEMENT FUNCTIONS
// =============================================================================

function getUsers() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('USERS');
    if (!sheet) return { success: false, error: 'Tab USERS tidak ditemukan' };
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { success: true, data: [] };
    var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    var users = data
      .filter(function(row) { return row[0]; })
      .map(function(row) {
        return { username: row[0], role: row[2], picName: row[3] };
        // password sengaja tidak dikembalikan ke frontend
      });
    return { success: true, data: users };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function addUser(data) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('USERS');
    if (!sheet) return { success: false, error: 'Tab USERS tidak ditemukan' };
    // Cek duplikat username
    var lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      var existing = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if ((existing[i][0] || '').toLowerCase() === (data.username || '').toLowerCase()) {
          return { success: false, error: 'Username sudah ada' };
        }
      }
    }
    // password sudah di-hash dari frontend (SHA-256)
    sheet.appendRow([
      data.username || '',
      data.password || '',
      data.role || 'sales',
      data.picName || ''
    ]);
    return { success: true, message: 'User berhasil ditambahkan' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function updateUser(data) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('USERS');
    if (!sheet) return { success: false, error: 'Tab USERS tidak ditemukan' };
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { success: false, error: 'User tidak ditemukan' };
    var rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    for (var i = 0; i < rows.length; i++) {
      if ((rows[i][0] || '').toLowerCase() === (data.username || '').toLowerCase()) {
        var targetRow = i + 2;
        if (data.password) sheet.getRange(targetRow, 2).setValue(data.password);
        if (data.role) sheet.getRange(targetRow, 3).setValue(data.role);
        if (data.picName !== undefined) sheet.getRange(targetRow, 4).setValue(data.picName);
        return { success: true, message: 'User berhasil diupdate' };
      }
    }
    return { success: false, error: 'User tidak ditemukan' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function deleteUser(username) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('USERS');
    if (!sheet) return { success: false, error: 'Tab USERS tidak ditemukan' };
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { success: false, error: 'User tidak ditemukan' };
    var rows = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < rows.length; i++) {
      if ((rows[i][0] || '').toLowerCase() === username.toLowerCase()) {
        sheet.deleteRow(i + 2);
        return { success: true, message: 'User berhasil dihapus' };
      }
    }
    return { success: false, error: 'User tidak ditemukan' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// =============================================================================
// HELPER: Get ISO Week Label
// =============================================================================

function sha256(input) {
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    input,
    Utilities.Charset.UTF_8
  );
  return rawHash.map(function(b) {
    var hex = (b < 0 ? b + 256 : b).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function updateLeadStatus(funnelId, newStatus) {
  try {
    if (!funnelId || !newStatus) return;
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('LEADS');
    if (!sheet) return;
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    var data = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // kolom B = funnelId
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] == funnelId) {
        sheet.getRange(i + 2, 4).setValue(newStatus); // kolom D = status
        var tkMap = { 'Gagal': 0, 'Informasi Awal': 5, 'Informasi Kebutuhan': 10, 'Presentasi': 25, 'Peluang 50:50': 50, 'Hot Prospek': 75, 'Closing': 100 };
        if (tkMap[newStatus] !== undefined) sheet.getRange(i + 2, 21).setValue(tkMap[newStatus]); // kolom U = tk
        return;
      }
    }
  } catch(e) {
    // Silent fail — jangan sampai gagalkan updateTracker
  }
}

function getISOWeekLabel(date) {
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return 'W' + weekNo + '-' + d.getUTCFullYear();
}
