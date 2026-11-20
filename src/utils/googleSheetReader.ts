import { TrackingRecord, KKOZ01_BASELINE_RECORD, normalizeAssetId } from '../types/tracking';
import { getRecordTimestamp } from './formatters';

export interface SheetSourceConfig {
  mode: 'default_apps_script' | 'public_google_sheet' | 'custom_apps_script';
  sheetUrlOrId: string;
  sheetName: string;
  customAppsScriptUrl: string;
}

export const SHEET_SOURCE_STORAGE_KEY = 'hornbill_google_sheet_source_v1';

export const DEFAULT_SHEET_SOURCE_CONFIG: SheetSourceConfig = {
  mode: 'default_apps_script',
  sheetUrlOrId: '',
  sheetName: '',
  customAppsScriptUrl: '',
};

export function loadSheetSourceConfig(): SheetSourceConfig {
  try {
    const raw = localStorage.getItem(SHEET_SOURCE_STORAGE_KEY);
    if (!raw) return DEFAULT_SHEET_SOURCE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode || 'default_apps_script',
      sheetUrlOrId: parsed.sheetUrlOrId || '',
      sheetName: parsed.sheetName || '',
      customAppsScriptUrl: parsed.customAppsScriptUrl || '',
    };
  } catch {
    return DEFAULT_SHEET_SOURCE_CONFIG;
  }
}

export function saveSheetSourceConfig(config: SheetSourceConfig): void {
  try {
    localStorage.setItem(SHEET_SOURCE_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}

export function extractSpreadsheetInfo(input: string): { spreadsheetId: string; gid?: string } | null {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;

  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = trimmed.match(/[?#&]gid=(\d+)/);

  if (urlMatch) {
    return {
      spreadsheetId: urlMatch[1],
      gid: gidMatch ? gidMatch[1] : undefined,
    };
  }

  // Raw spreadsheet ID
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return {
      spreadsheetId: trimmed,
    };
  }

  return null;
}

/**
 * Parse a single CSV text string into rows of string values (handles quotes and commas).
 */
function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell !== ''));
}

type RecordFieldKey = keyof TrackingRecord;

function matchHeaderToField(header: string): RecordFieldKey | null {
  const h = header.toLowerCase().replace(/[\s_-]+/g, '');
  if (!h) return null;

  if (h === 'recordedat' || h === 'timestamp' || h === 'createdat' || h === 'วันที่บันทึก') return 'recordedAt';
  if (h === 'assetid' || h === 'esn' || h === 'deviceid' || h === 'messengername' || h === 'รหัสติดตาม' || h === 'รหัสอุปกรณ์') return 'assetId';
  if (h === 'positionid' || h === 'id' || h === 'messageid' || h === 'uuid') return 'positionId';
  if (h === 'latitude' || h === 'lat' || h === 'ละติจูด') return 'latitude';
  if (h === 'longitude' || h === 'lng' || h === 'lon' || h === 'long' || h === 'ลองจิจูด') return 'longitude';
  if (h === 'displaytime' || h === 'datetime' || h === 'dateinlocal' || h === 'เวลาแสดงผล') return 'displayTime';
  if (h === 'receivedtime' || h === 'unixtime' || h === 'เวลาที่รับ') return 'receivedTime';
  if (h === 'utctime' || h === 'utc') return 'utcTime';
  if (h === 'localtime' || h === 'local' || h === 'เวลาท้องถิ่น') return 'localTime';
  if (h === 'battery' || h === 'batterystate' || h === 'batt' || h === 'แบตเตอรี่' || h === 'ระดับแบตเตอรี่') return 'battery';
  if (h === 'temperature' || h === 'temp' || h === 'อุณหภูมิ') return 'temperature';
  if (h === 'speed' || h === 'velocity' || h === 'ความเร็ว') return 'speed';
  if (h === 'altitude' || h === 'alt' || h === 'elevation' || h === 'ความสูง') return 'altitude';
  if (h === 'address' || h === 'location' || h === 'place' || h === 'ที่อยู่' || h === 'พื้นที่') return 'address';

  // Partial matches
  if (h.includes('latitude') || h === 'lat') return 'latitude';
  if (h.includes('longitude') || h.includes('lng')) return 'longitude';
  if (h.includes('asset') || h.includes('esn')) return 'assetId';
  if (h.includes('batter')) return 'battery';
  if (h.includes('temp')) return 'temperature';
  if (h.includes('address') || h.includes('location')) return 'address';
  if (h.includes('local')) return 'localTime';
  if (h.includes('utc')) return 'utcTime';
  if (h.includes('display')) return 'displayTime';
  if (h.includes('received')) return 'receivedTime';
  if (h.includes('record')) return 'recordedAt';
  if (h.includes('position')) return 'positionId';

  return null;
}

/**
 * Convert 2D grid (header + rows) into TrackingRecord[]
 */
export function rowsToTrackingRecords(rows: string[][]): TrackingRecord[] {
  if (!rows || rows.length === 0) return [];

  const firstRow = rows[0];
  const mappedFields = firstRow.map(matchHeaderToField);
  const hasHeaderRow = mappedFields.filter(Boolean).length >= 2;

  const dataRows = hasHeaderRow ? rows.slice(1) : rows;
  const fallbackOrder: RecordFieldKey[] = [
    'recordedAt',
    'assetId',
    'positionId',
    'latitude',
    'longitude',
    'displayTime',
    'receivedTime',
    'utcTime',
    'localTime',
    'battery',
    'temperature',
    'speed',
    'altitude',
    'address',
  ];

  const records: TrackingRecord[] = [];

  for (const row of dataRows) {
    const rec: Partial<TrackingRecord> = {};

    if (hasHeaderRow) {
      mappedFields.forEach((field, colIdx) => {
        if (field && row[colIdx] !== undefined && row[colIdx] !== '') {
          (rec as Record<string, string>)[field] = String(row[colIdx]);
        }
      });
    } else {
      fallbackOrder.forEach((field, colIdx) => {
        if (row[colIdx] !== undefined && row[colIdx] !== '') {
          (rec as Record<string, string>)[field] = String(row[colIdx]);
        }
      });
    }

    const lat = parseFloat(String(rec.latitude ?? ''));
    const lng = parseFloat(String(rec.longitude ?? ''));
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      continue;
    }

    records.push({
      recordedAt: rec.recordedAt || rec.localTime || rec.displayTime || '',
      assetId: rec.assetId || 'KK0Z01',
      positionId: rec.positionId || undefined,
      latitude: String(lat),
      longitude: String(lng),
      displayTime: rec.displayTime,
      receivedTime: rec.receivedTime,
      utcTime: rec.utcTime,
      localTime: rec.localTime,
      battery: rec.battery ?? '100',
      temperature: rec.temperature ?? '28',
      speed: rec.speed ?? '0',
      altitude: rec.altitude ?? '',
      address: rec.address ?? '',
    });
  }

  return normalizeAndSortRecords(records);
}

export function normalizeAndSortRecords(rawRecords: TrackingRecord[]): TrackingRecord[] {
  const seen = new Set<string>();
  const deduped: TrackingRecord[] = [];

  for (const r of rawRecords) {
    const lat = parseFloat(String(r.latitude));
    const lng = parseFloat(String(r.longitude));
    if (isNaN(lat) || isNaN(lng)) continue;

    const key = r.positionId
      ? `${normalizeAssetId(r.assetId)}::${r.positionId}`
      : `${normalizeAssetId(r.assetId)}::${r.recordedAt}::${lat.toFixed(5)}::${lng.toFixed(5)}`;

    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  deduped.sort((a, b) => getRecordTimestamp(b) - getRecordTimestamp(a));

  const hasKkoz01 = deduped.some((r) => normalizeAssetId(r.assetId) === 'KK0Z01');
  return hasKkoz01 ? deduped : [KKOZ01_BASELINE_RECORD, ...deduped];
}

/**
 * Fetch ALL rows from a public/shared Google Sheet (Anyone with link can view)
 * without requiring OAuth. Tries GViz JSON first, then CSV export fallback.
 */
export async function fetchAllRowsFromPublicGoogleSheet(
  sheetUrlOrId: string,
  sheetName?: string
): Promise<TrackingRecord[]> {
  const info = extractSpreadsheetInfo(sheetUrlOrId);
  if (!info) {
    throw new Error('ลิงก์หรือ Spreadsheet ID ไม่ถูกต้อง (กรุณาคัดลอก URL ของ Google Sheets มาวาง)');
  }

  const { spreadsheetId, gid } = info;
  const trimmedSheetName = (sheetName || '').trim();

  // 1. Try Google Visualization API (returns full sheet JSON)
  const gvizParams = new URLSearchParams({ tqx: 'out:json' });
  if (trimmedSheetName) {
    gvizParams.set('sheet', trimmedSheetName);
  } else if (gid) {
    gvizParams.set('gid', gid);
  }

  const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${gvizParams.toString()}`;

  try {
    const res = await fetch(gvizUrl, { method: 'GET' });
    if (res.ok) {
      const text = await res.text();
      // Check if Google returned an HTML login page (sheet is private)
      if (!text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed?.status === 'error') {
            throw new Error(parsed.errors?.[0]?.detailed_message || 'ไม่สามารถอ่าน Google Sheet ได้');
          }
          const table = parsed?.table;
          if (table && Array.isArray(table.cols) && Array.isArray(table.rows)) {
            const headers: string[] = table.cols.map((c: any) => String(c?.label || c?.id || '').trim());
            const grid: string[][] = [];
            if (headers.some((h) => h !== '')) {
              grid.push(headers);
            }
            for (const row of table.rows) {
              const cells = (row?.c || []).map((cell: any) => {
                if (!cell) return '';
                if (cell.f !== undefined && cell.f !== null) return String(cell.f);
                if (cell.v !== undefined && cell.v !== null) return String(cell.v);
                return '';
              });
              if (cells.some((c: string) => c !== '')) {
                grid.push(cells);
              }
            }
            const records = rowsToTrackingRecords(grid);
            if (records.length > 0) return records;
          }
        }
      }
    }
  } catch (err) {
    // Continue to CSV fallback if GViz fails
    console.warn('GViz sheet read failed, trying CSV fallback:', err);
  }

  // 2. Fallback: CSV Export endpoint
  const csvParams = new URLSearchParams({ format: 'csv' });
  if (trimmedSheetName) {
    csvParams.set('sheet', trimmedSheetName);
  } else if (gid) {
    csvParams.set('gid', gid);
  }

  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?${csvParams.toString()}`;
  const csvRes = await fetch(csvUrl, { method: 'GET' });
  if (!csvRes.ok) {
    throw new Error(
      'ไม่สามารถเข้าถึง Google Sheet ได้ กรุณาตรวจสอบว่าได้แชร์ไฟล์เป็น "ทุกคนที่มีลิงก์สามารถดูได้" (Anyone with the link)'
    );
  }

  const csvText = await csvRes.text();
  if (csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().startsWith('<html')) {
    throw new Error(
      'Google Sheet นี้ยังตั้งค่าเป็นส่วนตัว กรุณาตั้งค่าแชร์เป็น "ทุกคนที่มีลิงก์สามารถดูได้" หรือใช้ Google Apps Script Web App URL'
    );
  }

  const rows = parseCsvRows(csvText);
  const records = rowsToTrackingRecords(rows);
  if (records.length === 0) {
    throw new Error('ไม่พบข้อมูลพิกัด (ละติจูด/ลองจิจูด) ใน Google Sheet ที่ระบุ');
  }
  return records;
}
