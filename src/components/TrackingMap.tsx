import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  TrackingRecord,
  MapLayerConfig,
  AssetFilterType,
  getAssetMeta,
  normalizeAssetId,
  ASSET_META_MAP,
} from '../types/tracking';
import { formatLatitude, formatLongitude, formatThaiDate, formatThaiTime } from '../utils/formatters';
import { hornbillIcon } from '../assets/assets';
import {
  fetchPointCloudCover,
  getCloudConditionThai,
  getWmoWeatherThai,
  OpenMeteoPointCloudData,
} from '../services/openMeteo';
import {
  Layers,
  Crosshair,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Navigation,
  Calendar,
  Cloud,
  CloudSun,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  X,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react';

interface TrackingMapProps {
  records: TrackingRecord[];
  latestRecord?: TrackingRecord;
  selectedRecord?: TrackingRecord | null;
  onSelectRecord?: (record: TrackingRecord) => void;
  className?: string;
  dateBadgeText?: string;
  selectedAssetFilter?: AssetFilterType;
  onSelectAssetFilter?: (asset: AssetFilterType) => void;
}

const GISTDA_BASEMAP_URL =
  'https://api-gateway.gistda.or.th/api/2.0/resources/tiles/basemap_latest/{z}/{x}/{y}.png?api_key=QTaU1eTmZpIHIItdShp6fiUMcEHxBja3sRFcHYUeaRwAcAumkojB9FgIbxPCcuqW';

const MAP_LAYERS: MapLayerConfig[] = [
  {
    id: 'google_hybrid',
    name: 'Google Maps - Satellite Hybrid Basemap (ค่าเริ่มต้น)',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a>',
    maxZoom: 20,
    tileSize: 256,
    zoomOffset: 0,
    subdomains: ['0', '1', '2', '3'],
  },
  {
    id: 'gistda',
    name: 'แผนที่ดาวเทียม GISTDA',
    url: GISTDA_BASEMAP_URL,
    attribution: '&copy; <a href="https://www.gistda.or.th" target="_blank" rel="noopener noreferrer">GISTDA</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
  },
  {
    id: 'satellite',
    name: 'ภาพถ่ายดาวเทียม (Esri Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
  },
  {
    id: 'osm',
    name: 'OpenStreetMap (มาตรฐาน)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
  },
  {
    id: 'topo',
    name: 'แผนที่ภูมิประเทศ (OpenTopoMap)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
    tileSize: 256,
    zoomOffset: 0,
  },
];

export const TrackingMap: React.FC<TrackingMapProps> = ({
  records,
  latestRecord,
  selectedRecord,
  onSelectRecord,
  className = '',
  dateBadgeText,
  selectedAssetFilter = 'KK0Z01',
  onSelectAssetFilter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const latestMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  const [activeLayerId, setActiveLayerId] = useState<string>('google_hybrid');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localAssetFilter, setLocalAssetFilter] = useState<AssetFilterType>(selectedAssetFilter);
  const replayTimerRef = useRef<number | null>(null);

  // Open-Meteo Cloud Summary state (no overlays drawn on map canvas)
  const [showCloudPanel, setShowCloudPanel] = useState<boolean>(true);
  const [isCloudExpanded, setIsCloudExpanded] = useState<boolean>(false);
  const [cloudData, setCloudData] = useState<OpenMeteoPointCloudData | null>(null);
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [hoveredCloudHour, setHoveredCloudHour] = useState<{ hourLabel: string; cloudCover: number } | null>(null);
  const [cloudRefreshTick, setCloudRefreshTick] = useState<number>(0);

  // Sync prop changes to local filter
  useEffect(() => {
    setLocalAssetFilter(selectedAssetFilter);
  }, [selectedAssetFilter]);

  const handleAssetFilterChange = (asset: AssetFilterType) => {
    setLocalAssetFilter(asset);
    if (onSelectAssetFilter) {
      onSelectAssetFilter(asset);
    }
  };

  // Compute counts per asset
  const assetCounts = useMemo(() => {
    let kkoz01Count = 0;
    let kkoz02Count = 0;
    records.forEach((r) => {
      const norm = normalizeAssetId(r.assetId);
      if (norm === 'KK0Z01') kkoz01Count++;
      if (norm === 'KK0Z02') kkoz02Count++;
    });
    return {
      all: records.length,
      KK0Z01: kkoz01Count,
      KK0Z02: kkoz02Count,
    };
  }, [records]);

  // Filter records by active asset
  const activeRecords = useMemo(() => {
    if (localAssetFilter === 'ALL') return records;
    return records.filter((r) => normalizeAssetId(r.assetId) === localAssetFilter);
  }, [records, localAssetFilter]);

  // Target coordinate for Open-Meteo cloud telemetry (selected record or latest of active asset)
  const cloudTarget = useMemo(() => {
    const candidate = selectedRecord || activeRecords[0] || latestRecord;
    const lat = candidate?.latitude !== undefined ? parseFloat(String(candidate.latitude)) : NaN;
    const lng = candidate?.longitude !== undefined ? parseFloat(String(candidate.longitude)) : NaN;
    if (!isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return {
        lat,
        lng,
        assetLabel: normalizeAssetId(candidate?.assetId),
      };
    }
    return {
      lat: 13.214151,
      lng: 101.068587,
      assetLabel: localAssetFilter === 'KK0Z02' ? ('KK0Z02' as const) : ('KK0Z01' as const),
    };
  }, [selectedRecord, activeRecords, latestRecord, localAssetFilter]);

  // Fetch real-time Open-Meteo cloud cover for current target coordinate
  useEffect(() => {
    const controller = new AbortController();
    setIsCloudLoading(true);
    setCloudError(null);

    fetchPointCloudCover(cloudTarget.lat, cloudTarget.lng, controller.signal)
      .then((res) => {
        setCloudData(res);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          setCloudError('ไม่สามารถดึงข้อมูลเมฆจาก Open-Meteo ได้');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsCloudLoading(false);
        }
      });

    return () => controller.abort();
  }, [cloudTarget.lat, cloudTarget.lng, cloudRefreshTick]);

  // Hourly series for today (00:00 - 22:00 น.)
  const hourlySeriesToday = useMemo(() => {
    if (!cloudData?.hourlyCloudCover?.length) return [];
    return cloudData.hourlyCloudCover.filter((h) => {
      const hourNum = parseInt(h.hourLabel.slice(0, 2), 10);
      return !isNaN(hourNum) && hourNum >= 0 && hourNum <= 22;
    });
  }, [cloudData]);

  // Current Bangkok hour (00 - 23) for highlighting active bar
  const currentBangkokHourStr = useMemo(() => {
    try {
      const hour = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        hour12: false,
      }).format(new Date());
      return `${hour.padStart(2, '0')}:00`;
    } catch {
      return '';
    }
  }, [cloudData]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = latestRecord?.latitude ? parseFloat(String(latestRecord.latitude)) : 13.214151;
      const initialLng = latestRecord?.longitude ? parseFloat(String(latestRecord.longitude)) : 101.068587;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerConfig = MAP_LAYERS.find((l) => l.id === activeLayerId) || MAP_LAYERS[0];
      const tileLayer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: layerConfig.maxZoom,
        tileSize: layerConfig.tileSize || 256,
        zoomOffset: layerConfig.zoomOffset || 0,
        subdomains: layerConfig.subdomains || 'abc',
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (replayTimerRef.current) {
        clearInterval(replayTimerRef.current);
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const layerConfig = MAP_LAYERS.find((l) => l.id === activeLayerId) || MAP_LAYERS[0];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom,
      tileSize: layerConfig.tileSize || 256,
      zoomOffset: layerConfig.zoomOffset || 0,
      subdomains: layerConfig.subdomains || 'abc',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [activeLayerId]);

  // Render Paths & Markers SEPARATED by Asset (KKOZ01 vs KKOZ02)
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();
    markersMapRef.current.clear();
    latestMarkersRef.current.clear();

    if (!activeRecords || activeRecords.length === 0) return;

    // Filter valid coordinates
    const validPoints = activeRecords
      .map((r, originalIdx) => {
        const lat = parseFloat(String(r.latitude));
        const lng = parseFloat(String(r.longitude));
        return {
          record: r,
          lat,
          lng,
          originalIdx,
          assetKey: normalizeAssetId(r.assetId),
          isValid:
            !isNaN(lat) &&
            !isNaN(lng) &&
            !(lat === 0 && lng === 0) &&
            Math.abs(lat) <= 90 &&
            Math.abs(lng) <= 180,
        };
      })
      .filter((p) => p.isValid);

    if (validPoints.length === 0) return;

    // Group valid points by Asset ID so tracks don't cross or mix lines
    const groupedByAsset: Record<string, typeof validPoints> = {
      KK0Z01: [],
      KK0Z02: [],
    };

    validPoints.forEach((p) => {
      if (!groupedByAsset[p.assetKey]) {
        groupedByAsset[p.assetKey] = [];
      }
      groupedByAsset[p.assetKey].push(p);
    });

    const allLatLngs: [number, number][] = [];

    // Draw track and waypoints for each asset independently
    (['KK0Z01', 'KK0Z02'] as const).forEach((assetId) => {
      const assetPoints = groupedByAsset[assetId];
      if (!assetPoints || assetPoints.length === 0) return;

      const meta = ASSET_META_MAP[assetId];
      // Chronological order (from oldest to newest)
      const chronological = [...assetPoints].reverse();
      const trackLatLngs: [number, number][] = chronological.map((p) => [p.lat, p.lng]);
      allLatLngs.push(...trackLatLngs);

      // Draw Flight Path dashed polyline in asset-specific color
      if (trackLatLngs.length > 1) {
        // Shadow/glow line
        L.polyline(trackLatLngs, {
          color: meta.glowColor,
          weight: 6,
          opacity: 0.25,
          lineCap: 'round',
        }).addTo(layerGroup);

        // Main line
        L.polyline(trackLatLngs, {
          color: meta.lineColor,
          weight: 3.5,
          opacity: 0.95,
          dashArray: assetId === 'KK0Z01' ? '8, 8' : '4, 6',
          lineCap: 'round',
        }).addTo(layerGroup);
      }

      // Render waypoints and latest marker for this asset
      chronological.forEach((point, seqIndex) => {
        const isLatestForAsset = seqIndex === chronological.length - 1;
        const isSelected =
          selectedRecord?.positionId === point.record.positionId ||
          (selectedRecord?.recordedAt === point.record.recordedAt &&
            String(selectedRecord?.latitude) === String(point.record.latitude));

        const markerKey = point.record.positionId || `${point.record.recordedAt}-${point.lat}`;

        if (isLatestForAsset) {
          // Circle around latest point for this asset
          L.circle([point.lat, point.lng], {
            radius: 30,
            color: meta.lineColor,
            weight: 1.5,
            dashArray: '3, 3',
            fillColor: meta.tagColor,
            fillOpacity: 0.15,
          }).addTo(layerGroup);

          // Marker with distinct asset color
          const badgeBg = assetId === 'KK0Z01' ? 'bg-emerald-700' : 'bg-blue-700';
          const badgeRing = assetId === 'KK0Z01' ? 'ring-emerald-400' : 'ring-blue-400';
          const pulseBg = assetId === 'KK0Z01' ? 'bg-emerald-500/30' : 'bg-blue-500/30';
          const dotBg = assetId === 'KK0Z01' ? 'bg-emerald-600 ring-emerald-500' : 'bg-blue-600 ring-blue-500';

          const latestHtml = `
            <div class="relative flex flex-col items-center pointer-events-auto cursor-pointer" style="position: absolute; left: 0; top: 0; transform: translate(-50%, -50%);">
              <div style="position: absolute; bottom: 100%; margin-bottom: 4px; white-space: nowrap;">
                <div class="${
                  isSelected ? 'bg-amber-600 ring-2 ring-amber-300' : `${badgeBg} ring-1 ${badgeRing}`
                } text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 leading-none">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>${assetId} ล่าสุด</span>
                </div>
              </div>

              <div class="relative flex items-center justify-center">
                <div class="absolute -inset-1.5 rounded-full ${
                  isSelected ? 'bg-amber-400/40' : pulseBg
                } animate-ping pointer-events-none"></div>
                <div class="relative z-10 w-6 h-6 rounded-full border-2 border-white ${
                  isSelected ? 'bg-amber-500 ring-2 ring-amber-400' : `${dotBg} ring-2`
                } shadow-lg flex items-center justify-center">
                  <span class="w-2 h-2 rounded-full bg-white shadow-xs"></span>
                </div>
              </div>
            </div>
          `;

          const latestIcon = L.divIcon({
            className: `custom-marker-${assetId.toLowerCase()}`,
            html: latestHtml,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
            popupAnchor: [0, -20],
          });

          const marker = L.marker([point.lat, point.lng], {
            icon: latestIcon,
            zIndexOffset: isSelected ? 1200 : 1000,
          });

          latestMarkersRef.current.set(assetId, marker);
          markersMapRef.current.set(markerKey, marker);

          marker.bindPopup(`
            <div class="p-3.5 max-w-xs text-slate-800 font-['Prompt']">
              <div class="flex items-center gap-2.5 mb-2.5 pb-2 border-b border-slate-100">
                <img src="${hornbillIcon}" class="w-9 h-9 rounded-full border-2 ${
                  assetId === 'KK0Z01' ? 'border-emerald-400' : 'border-blue-400'
                } shadow-xs" />
                <div>
                  <div class="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span class="font-mono text-base ${assetId === 'KK0Z01' ? 'text-emerald-700' : 'text-blue-700'}">${point.record.assetId || assetId}</span>
                    <span class="text-[10px] ${meta.badgeBgClass} ${meta.badgeTextClass} font-semibold px-1.5 py-0.5 rounded-full">จุดล่าสุด</span>
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium">${meta.subName}</div>
                </div>
              </div>
              <div class="space-y-1.5 text-xs">
                <div class="flex justify-between"><span class="text-slate-500">วันที่:</span> <span class="font-medium">${formatThaiDate(point.record)}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">เวลา (Local Time):</span> <span class="font-bold font-mono ${assetId === 'KK0Z01' ? 'text-emerald-800' : 'text-blue-800'}">${formatThaiTime(point.record)}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">ละติจูด (Lat):</span> <span class="font-mono font-semibold">${formatLatitude(point.lat)}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">ลองจิจูด (Lng):</span> <span class="font-mono font-semibold">${formatLongitude(point.lng)}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">ระดับแบตเตอรี่:</span> <span class="font-semibold text-emerald-600">${point.record.battery}%</span></div>
                <div class="flex justify-between"><span class="text-slate-500">อุณหภูมิ:</span> <span class="font-semibold text-amber-600">${point.record.temperature} °C</span></div>
                ${point.record.speed ? `<div class="flex justify-between"><span class="text-slate-500">ความเร็ว:</span> <span>${point.record.speed} กม./ชม.</span></div>` : ''}
                ${point.record.address ? `<div class="mt-2 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/60 p-2 rounded-lg leading-relaxed">${point.record.address}</div>` : ''}
              </div>
            </div>
          `);

          marker.on('click', () => {
            if (onSelectRecord) onSelectRecord(point.record);
          });
          marker.addTo(layerGroup);
        } else {
          // Intermediate waypoints
          const wpBg = assetId === 'KK0Z01' ? 'bg-emerald-600 ring-emerald-800/40' : 'bg-blue-600 ring-blue-800/40';

          const waypointHtml = isSelected
            ? `
              <div class="relative flex flex-col items-center pointer-events-auto cursor-pointer" style="position: absolute; left: 0; top: 0; transform: translate(-50%, -50%);">
                <div style="position: absolute; bottom: 100%; margin-bottom: 4px; white-space: nowrap;">
                  <div class="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1 animate-bounce">
                    <span>📍 ${assetId} จุดที่เลือก</span>
                  </div>
                </div>
                <div class="w-5 h-5 rounded-full border-2 border-white bg-amber-500 ring-2 ring-amber-400 shadow-xl flex items-center justify-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </div>
              </div>
            `
            : `
              <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-150" style="position: absolute; left: 0; top: 0; transform: translate(-50%, -50%);">
                <div class="w-3.5 h-3.5 rounded-full border-2 border-white ${wpBg} shadow-md ring-1">
                </div>
              </div>
            `;

          const waypointIcon = L.divIcon({
            className: `custom-waypoint-${assetId.toLowerCase()}`,
            html: waypointHtml,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
            popupAnchor: [0, -16],
          });

          const marker = L.marker([point.lat, point.lng], {
            icon: waypointIcon,
            zIndexOffset: isSelected ? 900 : 100,
          });
          markersMapRef.current.set(markerKey, marker);

          marker.bindPopup(`
            <div class="p-3 max-w-xs text-slate-800 font-['Prompt']">
              <div class="font-bold text-sm text-slate-900 mb-1 flex items-center justify-between gap-1.5">
                <span class="font-mono ${assetId === 'KK0Z01' ? 'text-emerald-700' : 'text-blue-700'}">${point.record.assetId || assetId} • จุดที่ ${seqIndex + 1}</span>
                ${isSelected ? '<span class="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-full">จุดที่เลือก</span>' : ''}
              </div>
              <div class="space-y-1 text-xs">
                <div><span class="text-slate-500">วันที่:</span> <span class="font-medium">${formatThaiDate(point.record)}</span></div>
                <div><span class="text-slate-500">เวลา:</span> <span class="font-bold font-mono ${assetId === 'KK0Z01' ? 'text-emerald-800' : 'text-blue-800'}">${formatThaiTime(point.record)}</span></div>
                <div><span class="text-slate-500">ละติจูด (Lat):</span> <span class="font-mono font-semibold">${formatLatitude(point.lat)}</span></div>
                <div><span class="text-slate-500">ลองจิจูด (Lng):</span> <span class="font-mono font-semibold">${formatLongitude(point.lng)}</span></div>
                <div><span class="text-slate-500">แบตเตอรี่:</span> ${point.record.battery}% | ${point.record.temperature} °C</div>
                ${point.record.address ? `<div class="mt-1 text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded">${point.record.address}</div>` : ''}
              </div>
            </div>
          `);

          marker.on('click', () => {
            if (onSelectRecord) onSelectRecord(point.record);
          });
          marker.addTo(layerGroup);
        }
      });
    });

    // Auto-fit bounds on initial load if no specific record is selected
    if (allLatLngs.length > 0 && !selectedRecord) {
      const bounds = L.latLngBounds(allLatLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [activeRecords, activeLayerId, selectedRecord]);

  // Center and open popup on Selected Record
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRecord) return;
    const lat = parseFloat(String(selectedRecord.latitude));
    const lng = parseFloat(String(selectedRecord.longitude));
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.flyTo([lat, lng], 15, {
        duration: 0.9,
      });
      const key = selectedRecord.positionId || `${selectedRecord.recordedAt}-${lat}`;
      const marker = markersMapRef.current.get(key);
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 350);
      }
    }
  }, [selectedRecord]);

  // Fit all bounds manually
  const handleFitBounds = () => {
    if (!mapInstanceRef.current || !records || records.length === 0) return;
    const latLngs: [number, number][] = records
      .map((r) => [parseFloat(String(r.latitude)), parseFloat(String(r.longitude))] as [number, number])
      .filter(
        ([lat, lng]) =>
          !isNaN(lat) &&
          !isNaN(lng) &&
          !(lat === 0 && lng === 0) &&
          Math.abs(lat) <= 90 &&
          Math.abs(lng) <= 180
      );

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  };

  // Fly and Point to Latest Record ("ชี้ตำแหน่งล่าสุด")
  const handlePointToLatest = () => {
    if (!mapInstanceRef.current) return;
    const target = latestRecord || (activeRecords.length > 0 ? activeRecords[0] : undefined);
    if (!target) return;
    const lat = parseFloat(String(target.latitude));
    const lng = parseFloat(String(target.longitude));
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.flyTo([lat, lng], 15, {
        duration: 1.0,
      });
      const norm = normalizeAssetId(target.assetId);
      const marker = latestMarkersRef.current.get(norm);
      if (marker) {
        marker.openPopup();
      }
      if (onSelectRecord) {
        onSelectRecord(target);
      }
    }
  };

  // Replay animation handler
  const toggleReplay = () => {
    if (isPlayingReplay) {
      if (replayTimerRef.current) clearInterval(replayTimerRef.current);
      setIsPlayingReplay(false);
    } else {
      if (!records || records.length === 0) return;
      setIsPlayingReplay(true);
      const chronological = [...records].reverse();
      let currentIndex = replayIndex >= chronological.length - 1 ? 0 : replayIndex;

      if (replayTimerRef.current) clearInterval(replayTimerRef.current);
      replayTimerRef.current = window.setInterval(() => {
        if (currentIndex >= chronological.length) {
          clearInterval(replayTimerRef.current!);
          setIsPlayingReplay(false);
          setReplayIndex(0);
          return;
        }

        const point = chronological[currentIndex];
        setReplayIndex(currentIndex);
        if (onSelectRecord) onSelectRecord(point);

        currentIndex++;
      }, 1500);
    }
  };

  const handleResetReplay = () => {
    if (replayTimerRef.current) clearInterval(replayTimerRef.current);
    setIsPlayingReplay(false);
    setReplayIndex(0);
    handleFitBounds();
  };

  // Toggle Fullscreen modal view
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[360px] sm:min-h-[460px] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-white flex flex-col ${
        isFullscreen ? 'fixed inset-2 sm:inset-4 z-50 rounded-2xl shadow-2xl border-2 border-emerald-600' : ''
      } ${className}`}
    >
      {/* Map container - Expands 100% to fill bounding frame */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 min-h-[340px] sm:min-h-[440px]" />

      {/* Top Left: Map Controls & Pointing Tools */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-[400] flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-[calc(100%-60px)]">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/95 hover:bg-white text-slate-800 text-[11px] sm:text-xs font-semibold rounded-xl shadow-md border border-slate-200 backdrop-blur transition-all active:scale-95"
            title="เปลี่ยนรูปแบบแผนที่"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span className="hidden xs:inline sm:inline">แผนที่</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400">▾</span>
          </button>

          {showLayerMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-52 sm:w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ชั้นข้อมูลแผนที่ (Layer)
              </div>
              {MAP_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    setActiveLayerId(layer.id);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    activeLayerId === layer.id ? 'text-emerald-700 font-bold bg-emerald-50/70' : 'text-slate-700'
                  }`}
                >
                  <span>{layer.name}</span>
                  {activeLayerId === layer.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Target Indicator / Asset Switcher */}
        {onSelectAssetFilter ? (
          <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-200 text-xs">
            <button
              onClick={() => onSelectAssetFilter('KK0Z01')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedAssetFilter === 'KK0Z01'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
              title="ดูเฉพาะ KK0Z01 (เขาเขียว)"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedAssetFilter === 'KK0Z01' ? 'bg-white' : 'bg-emerald-500'}`}></span>
              <span>KK0Z01</span>
            </button>
            <button
              onClick={() => onSelectAssetFilter('KK0Z02')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedAssetFilter === 'KK0Z02'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
              title="ดูเฉพาะ KK0Z02 (ชุดที่ 2)"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedAssetFilter === 'KK0Z02' ? 'bg-white' : 'bg-blue-500'}`}></span>
              <span>KK0Z02</span>
            </button>
            <button
              onClick={() => onSelectAssetFilter('ALL')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedAssetFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="ดูทั้งสองตัวบนแผนที่"
            >
              <span>ทั้งหมด</span>
            </button>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono ml-0.5 font-semibold">
              {records.length} จุด
            </span>
          </div>
        ) : (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur rounded-xl shadow-md border border-slate-200 text-xs font-bold ${
            selectedAssetFilter === 'KK0Z02' ? 'text-blue-800' : 'text-emerald-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${selectedAssetFilter === 'KK0Z02' ? 'bg-blue-500' : 'bg-emerald-500'} ring-1 ring-emerald-300 animate-pulse`}></span>
            <span>{selectedAssetFilter === 'ALL' ? 'ทั้งหมด (ALL)' : selectedAssetFilter}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedAssetFilter === 'KK0Z02' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {records.length} จุด
            </span>
          </div>
        )}

        {/* Date Filter Status Badge */}
        {dateBadgeText && (
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-800/90 text-white text-[11px] sm:text-xs font-semibold rounded-xl shadow-md border border-emerald-700/80 backdrop-blur">
            <Calendar className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span className="whitespace-nowrap">{dateBadgeText}</span>
          </div>
        )}

        {/* Quick Point to Latest ("ชี้ตำแหน่งล่าสุด") Button */}
        <button
          onClick={handlePointToLatest}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] sm:text-xs font-semibold rounded-xl shadow-md border border-emerald-800 backdrop-blur transition-all active:scale-95 ring-2 ring-emerald-500/20"
          title="ชี้พิกัดตำแหน่งล่าสุดทันที"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">ชี้ตำแหน่งล่าสุด</span>
          <span className="sm:hidden">ชี้ตำแหน่ง</span>
        </button>

        {/* Center / Fit all points button */}
        <button
          onClick={handleFitBounds}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/95 hover:bg-white text-slate-700 text-[11px] sm:text-xs font-medium rounded-xl shadow-md border border-slate-200 backdrop-blur transition-all active:scale-95"
          title="จัดกึ่งกลางทุกพิกัด"
        >
          <Crosshair className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">จัดกึ่งกลาง</span>
        </button>

        {/* Flight replay button */}
        <button
          onClick={toggleReplay}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-xl shadow-md backdrop-blur transition-all active:scale-95 ${
            isPlayingReplay
              ? 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-600'
              : 'bg-white/95 hover:bg-white text-slate-700 border border-slate-200'
          }`}
          title="จำลองเส้นทางการบินย้อนหลัง"
        >
          {isPlayingReplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
          <span className="hidden sm:inline">{isPlayingReplay ? 'หยุดชั่วคราว' : 'เล่นเส้นทางบิน'}</span>
          <span className="sm:hidden">{isPlayingReplay ? 'หยุด' : 'เล่นบิน'}</span>
        </button>

        {isPlayingReplay && (
          <button
            onClick={handleResetReplay}
            className="p-1.5 sm:p-2 bg-white/95 hover:bg-white text-slate-600 text-xs rounded-xl shadow-md border border-slate-200 backdrop-blur"
            title="รีเซ็ตเส้นทาง"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Open-Meteo Cloud Toggle Button ("เมฆ X%") */}
        <button
          type="button"
          onClick={() => setShowCloudPanel((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl shadow-md border backdrop-blur transition-all active:scale-95 whitespace-nowrap shrink-0 ${
            showCloudPanel
              ? 'bg-sky-700 hover:bg-sky-800 text-white border-sky-800'
              : 'bg-white/95 hover:bg-white text-slate-700 border-slate-200'
          }`}
          title="เปิด/ปิดหน้าต่างสรุปปริมาณเมฆแบบเรียลไทม์ (Open-Meteo)"
        >
          <Cloud className={`w-3.5 h-3.5 ${showCloudPanel ? 'text-sky-200' : 'text-sky-600'}`} />
          <span className="tabular-nums">
            เมฆ {cloudData ? `${Math.round(cloudData.cloudCover)}%` : isCloudLoading ? '...' : '-'}
          </span>
        </button>
      </div>

      {/* Top Right: Fullscreen Expand/Collapse */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-[400]">
        <button
          onClick={toggleFullscreen}
          className="p-1.5 sm:p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 backdrop-blur transition-all active:scale-95"
          title={isFullscreen ? 'ย่อหน้าต่างกลับ' : 'ขยายแผนที่เต็มจอ'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-700" /> : <Maximize2 className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Bottom Left: Open-Meteo Real-Time Cloud Summary (Collapsed compact bar by default, expandable) */}
      {showCloudPanel && !isCloudExpanded && (
        <button
          type="button"
          onClick={() => setIsCloudExpanded(true)}
          className="absolute bottom-7 left-2.5 sm:bottom-8 sm:left-3 z-[400] flex items-center gap-2 px-3.5 py-2 bg-white/95 hover:bg-white backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-xs transition-all active:scale-95 whitespace-nowrap"
          title={`ขยายดูรายละเอียดปริมาณเมฆ Open-Meteo (${cloudTarget.assetLabel})`}
        >
          <CloudSun className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="font-bold text-slate-900">เมฆ Open-Meteo:</span>
          <span className="font-semibold text-sky-700 tabular-nums">
            {cloudData ? `${Math.round(cloudData.cloudCover)}%` : isCloudLoading ? '...' : '-'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </button>
      )}

      {showCloudPanel && isCloudExpanded && (
        <div className="absolute bottom-7 left-2.5 sm:bottom-8 sm:left-3 z-[400] w-[246px] sm:w-[272px] max-w-[calc(100%-20px)] bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg p-3 text-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 leading-tight">
                <CloudSun className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">เมฆ (Open-Meteo)</span>
                <span className="text-slate-300 font-normal" aria-hidden="true">·</span>
                <span className="font-mono text-[10px] text-emerald-700 shrink-0">{cloudTarget.assetLabel}</span>
              </div>
              <div className="text-[9.5px] text-slate-400 font-mono tabular-nums leading-tight mt-0.5 truncate">
                {cloudTarget.lat.toFixed(4)}°N, {cloudTarget.lng.toFixed(4)}°E
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setCloudRefreshTick((t) => t + 1)}
                disabled={isCloudLoading}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
                title="รีเฟรชข้อมูลเมฆล่าสุด"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCloudLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsCloudExpanded(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="ย่อหน้าต่างข้อมูลเมฆ"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowCloudPanel(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="ซ่อนหน้าต่างข้อมูลเมฆ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content States */}
          {isCloudLoading && !cloudData ? (
            <div className="py-3 text-center text-[11px] text-slate-500">
              กำลังโหลดข้อมูลเมฆ...
            </div>
          ) : cloudError && !cloudData ? (
            <div className="py-2.5 text-center space-y-1.5">
              <p className="text-[11px] text-rose-700">{cloudError}</p>
              <button
                type="button"
                onClick={() => setCloudRefreshTick((t) => t + 1)}
                className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-md"
              >
                ลองใหม่
              </button>
            </div>
          ) : cloudData ? (
            <div className="pt-1.5 space-y-1.5">
              {/* Total Cloud Cover + Sky Condition */}
              {(() => {
                const cond = getCloudConditionThai(cloudData.cloudCover);
                return (
                  <div className="flex items-baseline justify-between gap-1.5">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-lg font-bold font-mono tabular-nums text-slate-900 leading-none">
                        {Math.round(cloudData.cloudCover)}%
                      </span>
                      <span className={`text-[11px] font-semibold truncate ${cond.colorClass}`}>
                        {cond.shortLabel}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate max-w-[105px]" title={getWmoWeatherThai(cloudData.weatherCode)}>
                      {getWmoWeatherThai(cloudData.weatherCode)}
                    </span>
                  </div>
                );
              })()}

              {/* Compact Low / Mid / High Cloud Breakdown */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100 text-[10px]">
                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-0.5 leading-none">
                    <span>ต่ำ</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {Math.round(cloudData.cloudCoverLow)}%
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, cloudData.cloudCoverLow))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-0.5 leading-none">
                    <span>กลาง</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {Math.round(cloudData.cloudCoverMid)}%
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, cloudData.cloudCoverMid))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-0.5 leading-none">
                    <span>สูง</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {Math.round(cloudData.cloudCoverHigh)}%
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, cloudData.cloudCoverHigh))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Compact Weather Strip: Temp, Humidity, Wind */}
              <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 text-[10px] font-mono tabular-nums text-slate-700">
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap" title="อุณหภูมิ (°C)">
                  <Thermometer className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="font-semibold">{cloudData.temperature2m.toFixed(1)}°C</span>
                </span>
                <span className="text-slate-200" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap" title="ความชื้นสัมพัทธ์ (%)">
                  <Droplets className="w-3 h-3 text-sky-500 shrink-0" />
                  <span className="font-semibold">{Math.round(cloudData.relativeHumidity2m)}%</span>
                </span>
                <span className="text-slate-200" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap" title="ความเร็วลม (กม./ชม.)">
                  <Wind className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{cloudData.windSpeed10m.toFixed(1)}</span>
                  <span className="text-[9px] font-sans text-slate-400">กม./ชม.</span>
                </span>
              </div>

              {/* Compact Hourly Cloud Cover Trend (00:00 - 22:00 น.) */}
              {hourlySeriesToday.length > 0 && (
                <div className="pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[9.5px] mb-1 leading-none">
                    <span className="font-semibold text-slate-600">
                      รายชั่วโมง
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {hoveredCloudHour
                        ? `${hoveredCloudHour.hourLabel} น. · ${Math.round(hoveredCloudHour.cloudCover)}%`
                        : '00:00 – 22:00 น.'}
                    </span>
                  </div>

                  <div
                    className="h-7 flex items-end gap-[2px]"
                    onMouseLeave={() => setHoveredCloudHour(null)}
                  >
                    {hourlySeriesToday.map((item) => {
                      const pct = Math.min(100, Math.max(0, item.cloudCover));
                      const isCurrentHour = item.hourLabel === currentBangkokHourStr;
                      const barHeight = Math.max(10, Math.round((pct / 100) * 100));
                      return (
                        <button
                          key={item.time}
                          type="button"
                          onMouseEnter={() => setHoveredCloudHour(item)}
                          onFocus={() => setHoveredCloudHour(item)}
                          className="flex-1 h-full flex items-end group focus:outline-hidden"
                          title={`${item.hourLabel} น. — เมฆ ${Math.round(pct)}%`}
                          aria-label={`เวลา ${item.hourLabel} น. ปริมาณเมฆ ${Math.round(pct)} เปอร์เซ็นต์`}
                        >
                          <span
                            className={`w-full rounded-t-[2px] transition-colors ${
                              isCurrentHour
                                ? 'bg-emerald-600'
                                : 'bg-sky-400/80 group-hover:bg-sky-600'
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[8.5px] font-mono tabular-nums text-slate-400 mt-0.5 leading-none">
                    <span>00</span>
                    <span>06</span>
                    <span>12</span>
                    <span>18</span>
                    <span>22</span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Flight Legend overlay at bottom right */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-3 z-[400] bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-[10px] sm:text-[11px] text-slate-700 flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* KK0Z01 track indicator */}
        <div
          onClick={() => onSelectAssetFilter?.('KK0Z01')}
          className={`flex items-center gap-1 sm:gap-1.5 ${
            onSelectAssetFilter ? 'cursor-pointer hover:opacity-100 transition-opacity' : ''
          } ${selectedAssetFilter === 'KK0Z02' ? 'opacity-40' : 'opacity-100'}`}
          title="เส้นทางและพิกัด KK0Z01 (คลิกเพื่อเลือกดู)"
        >
          <span className="w-3 sm:w-4 h-0.5 border-t-2 border-dashed border-emerald-600"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="font-bold text-emerald-800">KK0Z01</span>
        </div>

        {/* KK0Z02 track indicator */}
        <div
          onClick={() => onSelectAssetFilter?.('KK0Z02')}
          className={`flex items-center gap-1 sm:gap-1.5 pl-1.5 border-l border-slate-200 ${
            onSelectAssetFilter ? 'cursor-pointer hover:opacity-100 transition-opacity' : ''
          } ${selectedAssetFilter === 'KK0Z01' ? 'opacity-40' : 'opacity-100'}`}
          title="เส้นทางและพิกัด KK0Z02 (คลิกเพื่อเลือกดู)"
        >
          <span className="w-3 sm:w-4 h-0.5 border-t-2 border-dashed border-blue-600"></span>
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="font-bold text-blue-800">KK0Z02</span>
        </div>

        {/* Latest badge */}
        <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5 border-l border-slate-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-medium text-slate-600">ล่าสุด</span>
        </div>
      </div>
    </div>
  );
};
