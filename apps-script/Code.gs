// Deployed Google Apps Script web app (already set up and linked in script.js).
// doPost: appends each registration as a row + emails the owner.
// doGet : returns {count, recent:[{name(first), course, at}]} for the live counter.
const SHEET_ID = '1PBu8hxvKP7kJuT62hugAuaa0cpigsAvGPXNgbupFjnE';
const HEADERS = ['Timestamp', 'Name', 'WhatsApp', 'Email', 'Course', 'Level', 'Preferred time', 'Page'];

function sheet_() { return SpreadsheetApp.openById(SHEET_ID).getSheets()[0]; }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#7c5cff').setFontColor('#ffffff');
      sh.setFrozenRows(1);
    }
    const p = e.parameter;
    sh.appendRow([new Date(), p.name, "'" + p.phone, p.email, p.course, p.level, p.time, p.page]);
    try {
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'New free-class registration: ' + p.name,
        p.name + '
' + p.phone + '
' + p.email + '
' + p.course + ' | ' + p.level + ' | ' + p.time);
    } catch (err) {}
    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const sh = sheet_(), last = sh.getLastRow(), n = Math.max(last - 1, 0), recent = [];
  if (n > 0) {
    const from = Math.max(2, last - 4);
    sh.getRange(from, 1, last - from + 1, 5).getValues().reverse().forEach(r => recent.push({
      name: String(r[1]).trim().split(/\s+/)[0], course: r[4], at: new Date(r[0]).toISOString() }));
  }
  return ContentService.createTextOutput(JSON.stringify({ count: n, recent: recent })).setMimeType(ContentService.MimeType.JSON);
}
