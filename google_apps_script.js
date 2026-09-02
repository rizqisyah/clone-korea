/**
 * =========================================================================
 * GOOGLE APPS SCRIPT UNTUK BUKU TAMU & RSVP GOOGLE SHEETS (ROBUST VERSION)
 * =========================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    // Parse data dari JSON text ataupun parameter form
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
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
