/**
 * =========================================================================
 * GOOGLE APPS SCRIPT UNTUK BUKU TAMU & RSVP GOOGLE SHEETS
 * =========================================================================
 * 
 * PANDUAN SINGKAT PEMASANGAN:
 * 1. Buka Google Sheets baru di https://sheets.google.com
 * 2. Di Baris 1 (Header), buat kolom berikut:
 *    A1: Timestamp
 *    B1: Nama Tamu
 *    C1: Kehadiran
 *    D1: Jumlah Tamu
 *    E1: Doa & Ucapan
 * 
 * 3. Klik menu: Ekstensi (Extensions) > Apps Script
 * 4. Hapus semua kode default, lalu COPAS seluruh isi script di bawah ini.
 * 5. Klik Simpan (ikon disket).
 * 6. Klik tombol "Deploy" (Terapkan) di kanan atas > "New deployment" (Penerapan baru)
 * 7. Pilih tipe: "Web app"
 *    - Description: "RSVP Wedding API"
 *    - Execute as: "Me" (Email Google Anda)
 *    - Who has access: "Anyone" (Siapa saja / Anonim) -> [PENTING!]
 * 8. Klik "Deploy" > Berikan Izin Akses (Review Permissions > Akun Google Anda > Advanced > Go to Untitled project (unsafe) > Allow).
 * 9. Salin "Web app URL" (format: https://script.google.com/macros/s/....../exec).
 * 10. Buka file js/app.js pada baris 278, lalu tempelkan URL tersebut pada variabel:
 *     const GOOGLE_SCRIPT_URL = "URL_WEB_APP_ANDA";
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Jakarta", "dd MMM yyyy, HH:mm");
    
    var name = data.name || "Tamu";
    var attendance = data.attendance || "Hadir";
    var pax = data.pax || "1";
    var message = data.message || "";
    
    // Tambahkan baris baru ke Google Sheet
    sheet.appendRow([formattedDate, name, attendance, pax, message]);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Data berhasil disimpan"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var result = [];
    
    // Lewati baris 1 (Header), ambil semua baris dari bawah ke atas (terbaru dulu)
    for (var i = rows.length - 1; i >= 1; i--) {
      var row = rows[i];
      if (row[1]) { // jika nama ada
        result.push({
          "timestamp": row[0] ? row[0].toString() : "Baru saja",
          "time": row[0] ? row[0].toString() : "Baru saja",
          "name": row[1],
          "attendance": row[2] || "Hadir",
          "pax": row[3] || "1",
          "message": row[4] || ""
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
