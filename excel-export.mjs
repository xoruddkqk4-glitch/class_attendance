import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function buildAttendanceWorkbook({ className, startDate, endDate, rows }) {
  const workbook = Workbook.create();
  const summary = workbook.worksheets.add('기간 요약');
  const detail = workbook.worksheets.add('학생별 상세 기록');
  summary.showGridLines = false;
  detail.showGridLines = false;

  summary.getRange('A1:F1').merge();
  summary.getRange('A1').values = [[`${className} · 수업 기록`]];
  summary.getRange('A2').values = [[`조회 기간: ${startDate} ~ ${endDate}`]];
  summary.getRange('A4:F4').values = [['학번', '이름', '출석', '결석', '지각·조퇴', '태도 평균']];
  const byStudent = new Map();
  for (const row of rows) {
    const item = byStudent.get(row.studentId) || { number: row.number, name: row.name, present: 0, absent: 0, other: 0, scores: [] };
    if (row.attendance === '출석') item.present += 1;
    else if (row.attendance === '결석') item.absent += 1;
    else if (row.attendance) item.other += 1;
    if (typeof row.score === 'number') item.scores.push(row.score);
    byStudent.set(row.studentId, item);
  }
  const summaryRows = [...byStudent.values()].map(item => [item.number, item.name, item.present, item.absent, item.other, item.scores.length ? item.scores.reduce((a, b) => a + b, 0) / item.scores.length : null]);
  if (summaryRows.length) summary.getRange(`A5:F${summaryRows.length + 4}`).values = summaryRows;

  detail.getRange('A1:G1').merge();
  detail.getRange('A1').values = [[`${className} · 학생별 날짜 상세 기록`]];
  detail.getRange('A2').values = [[`조회 기간: ${startDate} ~ ${endDate}`]];
  detail.getRange('A4:G4').values = [['학번', '이름', '날짜', '출결', '태도 점수', '태도 메모', '기록 시각']];
  const detailRows = rows.map(row => [row.number, row.name, new Date(`${row.date}T00:00:00`), row.attendance || '', row.score ?? null, row.note || '', row.recordedAt ? new Date(row.recordedAt) : null]);
  if (detailRows.length) detail.getRange(`A5:G${detailRows.length + 4}`).values = detailRows;

  for (const sheet of [summary, detail]) {
    sheet.getRange('A1').format = { fill: '#5969EA', font: { bold: true, color: '#FFFFFF', size: 16 }, horizontalAlignment: 'left' };
    sheet.getRange('A2').format = { font: { color: '#64748B', italic: true } };
    sheet.getRange('A4:G4').format = { fill: '#EEF0FF', font: { bold: true, color: '#334155' }, horizontalAlignment: 'center', borders: { preset: 'outside', style: 'thin', color: '#DCE1FF' } };
    sheet.freezePanes.freezeRows(4);
  }
  summary.getRange('A:F').format.columnWidth = 15;
  detail.getRange('A:B').format.columnWidth = 14;
  detail.getRange('C:E').format.columnWidth = 13;
  detail.getRange('F:F').format.columnWidth = 42;
  detail.getRange('G:G').format.columnWidth = 20;
  if (summaryRows.length) summary.getRange(`F5:F${summaryRows.length + 4}`).format.numberFormat = '0.0';
  if (detailRows.length) {
    detail.getRange(`C5:C${detailRows.length + 4}`).format.numberFormat = 'yyyy-mm-dd';
    detail.getRange(`G5:G${detailRows.length + 4}`).format.numberFormat = 'yyyy-mm-dd hh:mm';
    detail.getRange(`A5:G${detailRows.length + 4}`).format.wrapText = true;
  }
  const file = await SpreadsheetFile.exportXlsx(workbook);
  const tempPath = path.join(os.tmpdir(), `attendance-export-${Date.now()}.xlsx`);
  await file.save(tempPath);
  try { return await fs.readFile(tempPath); }
  finally { await fs.unlink(tempPath).catch(() => {}); }
}
