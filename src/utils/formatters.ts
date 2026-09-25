import { TrackingRecord } from '../types/tracking';

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function formatThaiDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString.replace(' ', 'T'));
    if (isNaN(d.getTime())) {
      // try parsing directly
      return dateString;
    }
    const day = d.getDate();
    const month = THAI_MONTHS_SHORT[d.getMonth()];
    const yearThai = d.getFullYear() + 543;
    return `${day} ${month} ${yearThai}`;
  } catch {
    return dateString;
  }
}

export function formatThaiTime(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString.replace(' ', 'T'));
    if (isNaN(d.getTime())) {
      return dateString;
    }
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} น.`;
  } catch {
    return dateString;
  }
}

export function formatThaiDateTime(dateString?: string): string {
  if (!dateString) return '-';
  const date = formatThaiDate(dateString);
  const time = formatThaiTime(dateString);
  return `${date} ${time}`;
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
    'วันที่-เวลา (RecordedAt)',
    'วันที่-เวลาแสดงผล (DisplayTime)',
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
    `"${r.recordedAt || ''}"`,
    `"${r.displayTime || r.localTime || ''}"`,
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
