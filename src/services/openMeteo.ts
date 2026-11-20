/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OpenMeteoHourlyCloud {
  time: string;
  hourLabel: string;
  cloudCover: number;
}

export interface OpenMeteoPointCloudData {
  latitude: number;
  longitude: number;
  requestedLat: number;
  requestedLng: number;
  elevation: number;
  time: string;
  cloudCover: number; // %
  cloudCoverLow: number; // %
  cloudCoverMid: number; // %
  cloudCoverHigh: number; // %
  temperature2m: number; // °C
  relativeHumidity2m: number; // %
  windSpeed10m: number; // km/h
  weatherCode: number;
  hourlyCloudCover: OpenMeteoHourlyCloud[];
}

export interface OpenMeteoGridPoint {
  id: string;
  latitude: number;
  longitude: number;
  cloudCover: number;
  cloudCoverLow: number;
  cloudCoverMid: number;
  cloudCoverHigh: number;
  temperature2m: number;
  windSpeed10m: number;
  weatherCode: number;
  time: string;
}

export interface CloudConditionMeta {
  label: string;
  shortLabel: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  fillColor: string;
  strokeColor: string;
  badgeBg: string;
  badgeText: string;
  fillOpacity: number;
}

export function getCloudConditionThai(cloudCover: number): CloudConditionMeta {
  if (cloudCover <= 15) {
    return {
      label: 'ท้องฟ้าแจ่มใส (Clear)',
      shortLabel: 'ฟ้าโปร่ง',
      colorClass: 'text-sky-700',
      bgClass: 'bg-sky-50',
      borderClass: 'border-sky-200',
      fillColor: '#38bdf8',
      strokeColor: '#0284c7',
      badgeBg: '#e0f2fe',
      badgeText: '#0369a1',
      fillOpacity: 0.16,
    };
  }
  if (cloudCover <= 45) {
    return {
      label: 'มีเมฆบางส่วน (Partly Cloudy)',
      shortLabel: 'เมฆบางส่วน',
      colorClass: 'text-cyan-800',
      bgClass: 'bg-cyan-50',
      borderClass: 'border-cyan-200',
      fillColor: '#93c5fd',
      strokeColor: '#2563eb',
      badgeBg: '#dbeafe',
      badgeText: '#1e40af',
      fillOpacity: 0.28,
    };
  }
  if (cloudCover <= 75) {
    return {
      label: 'มีเมฆมาก (Mostly Cloudy)',
      shortLabel: 'เมฆมาก',
      colorClass: 'text-slate-700',
      bgClass: 'bg-slate-100',
      borderClass: 'border-slate-300',
      fillColor: '#cbd5e1',
      strokeColor: '#475569',
      badgeBg: '#f1f5f9',
      badgeText: '#334155',
      fillOpacity: 0.42,
    };
  }
  return {
    label: 'เมฆครึ้มหนาแน่น (Overcast)',
    shortLabel: 'เมฆหนา',
    colorClass: 'text-indigo-900',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-300',
    fillColor: '#94a3b8',
    strokeColor: '#334155',
    badgeBg: '#e2e8f0',
    badgeText: '#1e293b',
    fillOpacity: 0.56,
  };
}

export function getWmoWeatherThai(code: number): string {
  if (code === 0) return 'ท้องฟ้าโปร่ง';
  if (code === 1) return 'มีเมฆเล็กน้อย';
  if (code === 2) return 'มีเมฆเป็นบางส่วน';
  if (code === 3) return 'มีเมฆมาก / มืดครึ้ม';
  if (code === 45 || code === 48) return 'มีหมอก';
  if (code >= 51 && code <= 57) return 'ฝนปรอยๆ';
  if (code >= 61 && code <= 67) return 'ฝนตก';
  if (code >= 80 && code <= 82) return 'ฝนตกเป็นช่วงๆ';
  if (code >= 95) return 'พายุฝนฟ้าคะนอง';
  return 'ปกติ';
}

export async function fetchPointCloudCover(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<OpenMeteoPointCloudData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat.toFixed(5)}&longitude=${lng.toFixed(5)}` +
    `&current=temperature_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,weather_code,wind_speed_10m` +
    `&hourly=cloud_cover&timezone=Asia%2FBangkok&forecast_days=1`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP ${res.status}`);
  }
  const data = await res.json();
  const current = data.current || {};
  const hourlyTimes: string[] = data.hourly?.time || [];
  const hourlyClouds: number[] = data.hourly?.cloud_cover || [];

  const hourlyCloudCover: OpenMeteoHourlyCloud[] = hourlyTimes.map((t, idx) => ({
    time: t,
    hourLabel: t.length >= 16 ? t.slice(11, 16) : t,
    cloudCover: Number(hourlyClouds[idx] ?? 0),
  }));

  return {
    latitude: Number(data.latitude ?? lat),
    longitude: Number(data.longitude ?? lng),
    requestedLat: lat,
    requestedLng: lng,
    elevation: Number(data.elevation ?? 0),
    time: String(current.time || ''),
    cloudCover: Number(current.cloud_cover ?? 0),
    cloudCoverLow: Number(current.cloud_cover_low ?? 0),
    cloudCoverMid: Number(current.cloud_cover_mid ?? 0),
    cloudCoverHigh: Number(current.cloud_cover_high ?? 0),
    temperature2m: Number(current.temperature_2m ?? 0),
    relativeHumidity2m: Number(current.relative_humidity_2m ?? 0),
    windSpeed10m: Number(current.wind_speed_10m ?? 0),
    weatherCode: Number(current.weather_code ?? 0),
    hourlyCloudCover,
  };
}

export async function fetchCloudGrid(
  bounds: { south: number; north: number; west: number; east: number },
  signal?: AbortSignal
): Promise<OpenMeteoGridPoint[]> {
  // Ensure a reasonable minimum span (~0.18 deg) so Open-Meteo returns distinct grid cells
  const centerLat = (bounds.south + bounds.north) / 2;
  const centerLng = (bounds.west + bounds.east) / 2;
  const latSpan = Math.max(0.18, Math.min(3.0, bounds.north - bounds.south));
  const lngSpan = Math.max(0.18, Math.min(3.0, bounds.east - bounds.west));

  const minLat = centerLat - latSpan * 0.36;
  const maxLat = centerLat + latSpan * 0.36;
  const minLng = centerLng - lngSpan * 0.36;
  const maxLng = centerLng + lngSpan * 0.36;

  // 3x3 grid points across map viewport
  const latSteps = [minLat, centerLat, maxLat];
  const lngSteps = [minLng, centerLng, maxLng];

  const reqCoords: { lat: number; lng: number }[] = [];
  for (const la of latSteps) {
    for (const ln of lngSteps) {
      reqCoords.push({
        lat: Number(la.toFixed(4)),
        lng: Number(ln.toFixed(4)),
      });
    }
  }

  const latParam = reqCoords.map((c) => c.lat).join(',');
  const lngParam = reqCoords.map((c) => c.lng).join(',');

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latParam}&longitude=${lngParam}` +
    `&current=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,temperature_2m,wind_speed_10m,weather_code` +
    `&timezone=Asia%2FBangkok`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Open-Meteo Grid HTTP ${res.status}`);
  }
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [raw];

  return list.map((item, idx) => {
    const current = item.current || {};
    const fallbackCoord = reqCoords[idx] || { lat: centerLat, lng: centerLng };
    return {
      id: `cloud-grid-${idx}`,
      latitude: fallbackCoord.lat,
      longitude: fallbackCoord.lng,
      cloudCover: Number(current.cloud_cover ?? 0),
      cloudCoverLow: Number(current.cloud_cover_low ?? 0),
      cloudCoverMid: Number(current.cloud_cover_mid ?? 0),
      cloudCoverHigh: Number(current.cloud_cover_high ?? 0),
      temperature2m: Number(current.temperature_2m ?? 0),
      windSpeed10m: Number(current.wind_speed_10m ?? 0),
      weatherCode: Number(current.weather_code ?? 0),
      time: String(current.time || ''),
    };
  });
}
