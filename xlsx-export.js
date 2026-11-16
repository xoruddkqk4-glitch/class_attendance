(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ClassAttendanceExcel = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const encoder = new TextEncoder();

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function escapeXml(value) {
    return String(value ?? '')
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function columnName(index) {
    let n = index + 1;
    let name = '';
    while (n > 0) {
      const rem = (n - 1) % 26;
      name = String.fromCharCode(65 + rem) + name;
      n = Math.floor((n - 1) / 26);
    }
    return name;
  }

  function formatLocalDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function classifyAttendance(row) {
    const k = row.attendanceKey || row.attendance || '';
    if (k === 'present' || k === '출석') return 'present';
    if (k === 'absent' || k === '결석') return 'absent';
    if (k === 'late' || k === '지각') return 'late';
    if (k === 'early' || k === '조퇴') return 'early';
    return '';
  }

  function cellXml(colIdx, rowNum, value, styleId) {
    const ref = `${columnName(colIdx)}${rowNum}`;
    const styleAttr = styleId ? ` s="${styleId}"` : '';
    if (typeof value === 'number' && Number.isFinite(value)) {
      return `<c r="${ref}"${styleAttr} t="n"><v>${value}</v></c>`;
    }
    const text = String(value ?? '');
    if (text === '') {
      return styleId ? `<c r="${ref}"${styleAttr}/>` : '';
    }
    return `<c r="${ref}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
  }

  function rowXml(rowNum, values, styleForCell, height) {
    const cells = [];
    for (let c = 0; c < values.length; c++) {
      const sId = typeof styleForCell === 'function' ? styleForCell(c) : styleForCell;
      const cell = cellXml(c, rowNum, values[c], sId);
      if (cell) cells.push(cell);
    }
    const htAttr = height ? ` ht="${height}" customHeight="1"` : '';
    return `<row r="${rowNum}"${htAttr}>${cells.join('')}</row>`;
  }

  function buildWorksheetXml({ title, subtitle, headers, dataRows, colWidths, centerCols }) {
    const lastCol = columnName(headers.length - 1);
    const colsXml = colWidths
      .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
      .join('');

    const rowsXml = [];
    const titleCells = [title, ...new Array(headers.length - 1).fill('')];
    rowsXml.push(rowXml(1, titleCells, 1, 28));
    rowsXml.push(rowXml(2, [subtitle], 2, 20));
    rowsXml.push(`<row r="3" ht="10" customHeight="1"/>`);
    rowsXml.push(rowXml(4, headers, 3, 24));

    const centerSet = new Set(centerCols || []);
    for (let i = 0; i < dataRows.length; i++) {
      rowsXml.push(rowXml(5 + i, dataRows[i], col => (centerSet.has(col) ? 5 : 4), 21));
    }

    return [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
      '<sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>',
      '<sheetFormatPr defaultRowHeight="20"/>',
      `<cols>${colsXml}</cols>`,
      `<sheetData>${rowsXml.join('')}</sheetData>`,
      `<mergeCells count="1"><mergeCell ref="A1:${lastCol}1"/></mergeCells>`,
      '</worksheet>'
    ].join('');
  }

  function buildStylesXml() {
    return [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
      '<fonts count="4">',
      '<font><sz val="11"/><color rgb="FF1E293B"/><name val="Malgun Gothic"/></font>',
      '<font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Malgun Gothic"/></font>',
      '<font><i/><sz val="10"/><color rgb="FF526071"/><name val="Malgun Gothic"/></font>',
      '<font><b/><sz val="11"/><color rgb="FF1E293B"/><name val="Malgun Gothic"/></font>',
      '</fonts>',
      '<fills count="4">',
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>',
      '<fill><patternFill patternType="solid"><fgColor rgb="FF4F46E5"/><bgColor indexed="64"/></patternFill></fill>',
      '<fill><patternFill patternType="solid"><fgColor rgb="FFEEF0FF"/><bgColor indexed="64"/></patternFill></fill>',
      '</fills>',
      '<borders count="2">',
      '<border><left/><right/><top/><bottom/><diagonal/></border>',
      '<border><left style="thin"><color rgb="FFE2E8F0"/></left><right style="thin"><color rgb="FFE2E8F0"/></right><top style="thin"><color rgb="FFE2E8F0"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom><diagonal/></border>',
      '</borders>',
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>',
      '<cellXfs count="6">',
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>',
      '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>',
      '<xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>',
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>',
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>',
      '</cellXfs>',
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>',
      '</styleSheet>'
    ].join('');
  }

  function createZip(entries) {
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    const now = new Date();
    const dosTime = ((now.getHours() & 0x1f) << 11) | ((now.getMinutes() & 0x3f) << 5) | ((now.getSeconds() >> 1) & 0x1f);
    const dosDate = (((Math.max(1980, now.getFullYear()) - 1980) & 0x7f) << 9) | (((now.getMonth() + 1) & 0x0f) << 5) | (now.getDate() & 0x1f);

    for (const entry of entries) {
      const nameBytes = encoder.encode(entry.name);
      const dataBytes = typeof entry.data === 'string' ? encoder.encode(entry.data) : entry.data;
      const crc = crc32(dataBytes);
      const size = dataBytes.length;

      const localHeader = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true);
      lv.setUint16(8, 0, true);
      lv.setUint16(10, dosTime, true);
      lv.setUint16(12, dosDate, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, size, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      localHeader.set(nameBytes, 30);

      const centralHeader = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(centralHeader.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, dosTime, true);
      cv.setUint16(14, dosDate, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      centralHeader.set(nameBytes, 46);

      localParts.push(localHeader, dataBytes);
      centralParts.push(centralHeader);
      offset += localHeader.length + size;
    }

    const cdSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    const totalSize = offset + cdSize + eocd.length;
    const output = new Uint8Array(totalSize);
    let cursor = 0;
    for (const part of localParts) {
      output.set(part, cursor);
      cursor += part.length;
    }
    for (const part of centralParts) {
      output.set(part, cursor);
      cursor += part.length;
    }
    output.set(eocd, cursor);
    return output;
  }

  function buildAttendanceWorkbookBytes({ className = '', startDate = '', endDate = '', rows = [] } = {}) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const byStudent = new Map();
    const seenLegacyAttendance = new Set();

    for (const row of safeRows) {
      if (!row || typeof row !== 'object') continue;
      const rowClassName = String(row.className || className || '');
      const studentKey = `${row.classId || rowClassName}::${row.studentId || row.number || row.name || ''}`;
      let item = byStudent.get(studentKey);
      if (!item) {
        item = {
          className: rowClassName,
          number: String(row.number || ''),
          name: String(row.name || ''),
          present: 0,
          absent: 0,
          late: 0,
          early: 0,
          totalScore: 0
        };
        byStudent.set(studentKey, item);
      }

      const attKey = classifyAttendance(row);
      if (row.recordType === 'attendance') {
        if (attKey) item[attKey] += 1;
      } else if (!row.recordType && attKey) {
        const dedupeKey = `${studentKey}::${row.date || ''}`;
        if (!seenLegacyAttendance.has(dedupeKey)) {
          seenLegacyAttendance.add(dedupeKey);
          item[attKey] += 1;
        }
      }

      if ((row.recordType === 'attitude' || !row.recordType) && typeof row.score === 'number' && Number.isFinite(row.score) && row.score !== 0) {
        item.totalScore += row.score;
      }
    }

    const summaryItems = [...byStudent.values()].sort(
      (a, b) => a.className.localeCompare(b.className, 'ko') || a.number.localeCompare(b.number) || a.name.localeCompare(b.name, 'ko')
    );

    const summaryRows = summaryItems.map(item => [
      item.className,
      item.number,
      item.name,
      item.present,
      item.absent,
      item.late,
      item.early,
      item.totalScore
    ]);

    const detailRows = safeRows.map(row => [
      String(row.className || className || ''),
      String(row.number || ''),
      String(row.name || ''),
      String(row.date || ''),
      String(row.attendance || ''),
      typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : '',
      String(row.note || ''),
      formatLocalDateTime(row.recordedAt)
    ]);

    const titlePrefix = className ? `${className} · ` : '';
    const periodSubtitle = `조회 기간: ${startDate || '-'} ~ ${endDate || '-'}`;

    const sheet1Xml = buildWorksheetXml({
      title: `${titlePrefix}수업 기록`,
      subtitle: periodSubtitle,
      headers: ['학급', '학번', '이름', '출석', '결석', '지각', '조퇴', '총 태도 점수'],
      dataRows: summaryRows,
      colWidths: [16, 12, 14, 10, 10, 10, 10, 14],
      centerCols: [0, 1, 2, 3, 4, 5, 6, 7]
    });

    const sheet2Xml = buildWorksheetXml({
      title: `${titlePrefix}학생별 날짜 상세 기록`,
      subtitle: periodSubtitle,
      headers: ['학급', '학번', '이름', '날짜', '출결', '태도 점수', '태도 메모', '기록 시각'],
      dataRows: detailRows,
      colWidths: [16, 12, 14, 13, 10, 12, 42, 18],
      centerCols: [0, 1, 2, 3, 4, 5, 7]
    });

    const contentTypesXml = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
      '<Default Extension="xml" ContentType="application/xml"/>',
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>',
      '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>',
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
      '</Types>'
    ].join('');

    const rootRelsXml = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
      '</Relationships>'
    ].join('');

    const workbookXml = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
      '<sheets>',
      '<sheet name="기간 요약" sheetId="1" r:id="rId1"/>',
      '<sheet name="학생별 상세 기록" sheetId="2" r:id="rId2"/>',
      '</sheets>',
      '</workbook>'
    ].join('');

    const workbookRelsXml = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>',
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>',
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
      '</Relationships>'
    ].join('');

    return createZip([
      { name: '[Content_Types].xml', data: contentTypesXml },
      { name: '_rels/.rels', data: rootRelsXml },
      { name: 'xl/workbook.xml', data: workbookXml },
      { name: 'xl/_rels/workbook.xml.rels', data: workbookRelsXml },
      { name: 'xl/styles.xml', data: buildStylesXml() },
      { name: 'xl/worksheets/sheet1.xml', data: sheet1Xml },
      { name: 'xl/worksheets/sheet2.xml', data: sheet2Xml }
    ]);
  }

  return { buildAttendanceWorkbookBytes };
});
