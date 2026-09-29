import { TrackingRecord } from '../types/tracking';

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

/**
 * Resolves the primary date-time string from a record or string.
 * Priority: localTime > displayTime > recordedAt > raw input
 */
function resolveDateTimeString(input?: string | TrackingRecord | null): string {
  if (!input) return '';
  if (typeof input === 'object') {
    return input.localTime || input.displayTime || input.recordedAt || '';
  }
  return String(input);
}

interface ParsedDateTimeParts {
  date: string;
  time: string;
  hours: string;
  minutes: string;
}

function parseDateTimeParts(input?: string | TrackingRecord | null): ParsedDateTimeParts | null {
  const raw = resolveDateTimeString(input).trim();
  if (!raw) return null;

  // 1. ISO format: '2026-09-29T05:13:08Z' or '2026-09-29 08:15:26'
  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    const hh = String(parseInt(isoMatch[4], 10)).padStart(2, '0');
    const mm = String(parseInt(isoMatch[5], 10)).padStart(2, '0');
    const month = THAI_MONTHS_SHORT[m - 1] || String(m);
    const yearThai = y + 543;
    return {
      date: `${d} ${month} ${yearThai}`,
      time: `${hh}:${mm} น.`,
      hours: hh,
      minutes: mm,
    };
  }

  // 2. Display format: '9/29/2026 5:13:08 AM' or '09/25/2026 5:35:47 PM'
  const displayMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (displayMatch) {
    const m = parseInt(displayMatch[1], 10);
    const d = parseInt(displayMatch[2], 10);
    const y = parseInt(displayMatch[3], 10);
    let h = parseInt(displayMatch[4], 10);
    const mm = String(parseInt(displayMatch[5], 10)).padStart(2, '0');
    const ampm = displayMatch[7] ? displayMatch[7].toUpperCase() : null;
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const hh = String(h).padStart(2, '0');
    const month = THAI_MONTHS_SHORT[m - 1] || String(m);
    const yearThai = y + 543;
    return {
      date: `${d} ${month} ${yearThai}`,
      time: `${hh}:${mm} น.`,
      hours: hh,
      minutes: mm,
    };
  }

  // Fallback to Date object parsing
  try {
    const d = new Date(raw.replace(' ', 'T'));
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const month = THAI_MONTHS_SHORT[d.getMonth()];
      const yearThai = d.getFullYear() + 543;
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      return {
        date: `${day} ${month} ${yearThai}`,
        time: `${hh}:${mm} น.`,
        hours: hh,
        minutes: mm,
      };
    }
  } catch {
    // ignore
  }

  return null;
}

export function formatThaiDate(input?: string | TrackingRecord | null): string {
  if (!input) return '-';
  const parts = parseDateTimeParts(input);
  if (parts) return parts.date;
  return typeof input === 'string' ? input : '-';
}

export function formatThaiTime(input?: string | TrackingRecord | null): string {
  if (!input) return '-';
  const parts = parseDateTimeParts(input);
  if (parts) return parts.time;
  return typeof input === 'string' ? input : '-';
}

export function formatThaiDateTime(input?: string | TrackingRecord | null): string {
  if (!input) return '-';
  const date = formatThaiDate(input);
  const time = formatThaiTime(input);
  return `${date} ${time}`;
}

export function formatLatitude(lat?: string | number): string {
  if (lat === undefined || lat === '' || lat === null) return '-';
  const nLat = typeof lat === 'string' ? parseFloat(lat) : lat;
  if (isNaN(nLat)) return '-';
  const latDir = nLat >= 0 ? 'N' : 'S';
  return `${Math.abs(nLat).toFixed(4)}° ${latDir}`;
}

export function formatLongitude(lng?: string | number): string {
  if (lng === undefined || lng === '' || lng === null) return '-';
  const nLng = typeof lng === 'string' ? parseFloat(lng) : lng;
  if (isNaN(nLng)) return '-';
  const lngDir = nLng >= 0 ? 'E' : 'W';
  return `${Math.abs(nLng).toFixed(4)}° ${lngDir}`;
}

export function formatCoordinates(lat?: string | number, lng?: string | number): string {
  if (lat === undefined || lng === undefined || lat === '' || lng === '') return '-';
  const nLat = typeof lat === 'string' ? parseFloat(lat) : lat;
  const nLng = typeof lng === 'string' ? parseFloat(lng) : lng;
  if (isNaN(nLat) || isNaN(nLng)) return '-';

  const latDir = nLat >= 0 ? 'N' : 'S';
  const lngDir = nLng >= 0 ? 'E' : 'W';

  return `${Math.abs(nLat).toFixed(4)}° ${latDir}, ${Math.abs(nLng).toFixed(4)}° ${lngDir}`;
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function exportToCSV(records: TrackingRecord[], filename = 'hornbill-tracking-data.csv') {
  if (!records || records.length === 0) return;

  const headers = [
    'ลำดับ',
    'รหัสติดตาม',
    'เวลาท้องถิ่น (Local Time)',
    'วันที่-เวลาแสดงผล (DisplayTime)',
    'วันที่-เวลาที่บันทึก (RecordedAt)',
    'ละติจูด (Latitude)',
    'ลองจิจูด (Longitude)',
    'ระดับแบตเตอรี่ (%)',
    'อุณหภูมิ (°C)',
    'ความเร็ว (Speed)',
    'ที่อยู่/พื้นที่ (Address)'
  ];

  const rows = records.map((r, index) => [
    index + 1,
    `"${r.assetId || ''}"`,
    `"${r.localTime || ''}"`,
    `"${r.displayTime || ''}"`,
    `"${r.recordedAt || ''}"`,
    r.latitude,
    r.longitude,
    r.battery,
    r.temperature,
    r.speed || '0',
    `"${(r.address || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: unknown, filename = 'hornbill-tracking-data.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
