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
}

export type AssetFilterType = 'ALL' | 'KKOZ01' | 'KKOZ02';

export interface AssetMetaConfig {
  id: string;
  normalizedId: 'KKOZ01' | 'KKOZ02';
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

export const ASSET_META_MAP: Record<'KKOZ01' | 'KKOZ02', AssetMetaConfig> = {
  KKOZ01: {
    id: 'KKOZ01',
    normalizedId: 'KKOZ01',
    name: 'KKOZ01',
    subName: 'เขาเขียว - ชลบุรี',
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
  KKOZ02: {
    id: 'KKOZ02',
    normalizedId: 'KKOZ02',
    name: 'KKOZ02',
    subName: 'ตัวส่งสัญญาณชุดที่ 2',
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

export function normalizeAssetId(rawId?: string): 'KKOZ01' | 'KKOZ02' {
  if (!rawId) return 'KKOZ01';
  const clean = rawId.trim().toUpperCase().replace(/O/g, '0');
  if (clean.includes('2') || clean === 'KK0Z02' || clean === 'KKOZ02') {
    return 'KKOZ02';
  }
  return 'KKOZ01';
}

export function getAssetMeta(rawId?: string): AssetMetaConfig {
  const norm = normalizeAssetId(rawId);
  return ASSET_META_MAP[norm];
}
