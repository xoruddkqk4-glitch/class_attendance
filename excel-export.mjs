import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { buildAttendanceWorkbookBytes } = require('./xlsx-export.js');

export async function buildAttendanceWorkbook(payload) {
  return Buffer.from(buildAttendanceWorkbookBytes(payload));
}
