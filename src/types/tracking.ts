export interface TrackingRecord {
  recordedAt: string;
  assetId: string;
  positionId?: string;
  latitude: string | number;
  longitude: string | number;
  displayTime?: string;
  receivedTime?: string;
  utcTime?: string;
  localTime?: string;
  battery: string | number;
  temperature: string | number;
  speed?: string | number;
  altitude?: string | number;
  address?: string;
}

export interface TrackingApiResponse {
  success: boolean;
  latest: TrackingRecord;
  records: TrackingRecord[];
  message?: string;
}

export interface MapLayerConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  tileSize?: number;
  zoomOffset?: number;
  subdomains?: string[] | string;
}

export type AssetFilterType = 'ALL' | 'KK0Z01' | 'KK0Z02';

export type DateFilterMode = 'live' | '1h' | '24h' | '7d' | '1m' | 'all' | 'specific_date';

export interface AssetMetaConfig {
  id: string;
  normalizedId: 'KK0Z01' | 'KK0Z02';
  name: string;
  subName: string;
  tagColor: string;
  ringColor: string;
  markerColor: string;
  markerBgClass: string;
  markerBorderClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  lineColor: string;
  glowColor: string;
}

export const ASSET_META_MAP: Record<'KK0Z01' | 'KK0Z02', AssetMetaConfig> = {
  KK0Z01: {
    id: 'KK0Z01',
    normalizedId: 'KK0Z01',
    name: 'KK0Z01',
    subName: 'เขาเขียว - ชลบุรี (ตัวที่ 1)',
    tagColor: '#059669', // Emerald
    ringColor: 'ring-emerald-400',
    markerColor: '#059669',
    markerBgClass: 'bg-emerald-600',
    markerBorderClass: 'border-emerald-400',
    badgeBgClass: 'bg-emerald-100',
    badgeTextClass: 'text-emerald-800',
    lineColor: '#059669',
    glowColor: '#064e3b',
  },
  KK0Z02: {
    id: 'KK0Z02',
    normalizedId: 'KK0Z02',
    name: 'KK0Z02',
    subName: 'เขาเขียว - ชลบุรี (ตัวที่ 2)',
    tagColor: '#2563eb', // Royal Blue
    ringColor: 'ring-blue-400',
    markerColor: '#2563eb',
    markerBgClass: 'bg-blue-600',
    markerBorderClass: 'border-blue-400',
    badgeBgClass: 'bg-blue-100',
    badgeTextClass: 'text-blue-800',
    lineColor: '#2563eb',
    glowColor: '#1e3a8a',
  },
};

export function normalizeAssetId(rawId?: string): 'KK0Z01' | 'KK0Z02' {
  if (!rawId) return 'KK0Z01';
  const clean = rawId.trim().toUpperCase().replace(/O/g, '0');
  if (clean.includes('2') || clean === 'KK0Z02' || clean === 'KKOZ02') {
    return 'KK0Z02';
  }
  return 'KK0Z01';
}

export function getAssetMeta(rawId?: string): AssetMetaConfig {
  const norm = normalizeAssetId(rawId);
  return ASSET_META_MAP[norm];
}

export const KK0Z01_BASELINE_RECORD: TrackingRecord = {
  recordedAt: '2026-11-03 08:00:00',
  assetId: 'KK0Z01',
  positionId: 'kk0z01-khao-kheow-station',
  latitude: '13.214151',
  longitude: '101.068587',
  displayTime: '11/3/2026 8:00:00 AM',
  receivedTime: '11/3/2026 8:00:05 AM',
  utcTime: '2026-11-03 1:00:00',
  localTime: '2026-11-03T08:00:00Z',
  battery: '100.00',
  temperature: '28.00',
  speed: '0',
  altitude: '180',
  address: 'จุดปล่อยและฟื้นฟูนกกาฮัง สวนสัตว์เปิดเขาเขียว, ชลบุรี, ประเทศไทย',
};

// Alias for backwards compatibility
export const KKOZ01_BASELINE_RECORD = KK0Z01_BASELINE_RECORD;
