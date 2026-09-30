import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TrackingRecord, MapLayerConfig } from '../types/tracking';
import { formatCoordinates, formatLatitude, formatLongitude, formatThaiDate, formatThaiTime } from '../utils/formatters';
import { hornbillIcon } from '../assets/assets';
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
} from 'lucide-react';

interface TrackingMapProps {
  records: TrackingRecord[];
  latestRecord?: TrackingRecord;
  selectedRecord?: TrackingRecord | null;
  onSelectRecord?: (record: TrackingRecord) => void;
  className?: string;
  dateBadgeText?: string;
}

const MAP_LAYERS: MapLayerConfig[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap (มาตรฐาน)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: 'satellite',
    name: 'ภาพถ่ายดาวเทียม (Esri Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  },
  {
    id: 'topo',
    name: 'แผนที่ภูมิประเทศ (OpenTopoMap)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
];

export const TrackingMap: React.FC<TrackingMapProps> = ({
  records,
  latestRecord,
  selectedRecord,
  onSelectRecord,
  className = '',
  dateBadgeText,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const latestMarkerRef = useRef<L.Marker | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  const [activeLayerId, setActiveLayerId] = useState<string>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const replayTimerRef = useRef<number | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = latestRecord?.latitude ? parseFloat(String(latestRecord.latitude)) : 17.3345;
      const initialLng = latestRecord?.longitude ? parseFloat(String(latestRecord.longitude)) : 98.9752;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: false, // Positioned at top-right
      });

      // Add Zoom control on top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Tile layer
      const layerConfig = MAP_LAYERS.find((l) => l.id === activeLayerId) || MAP_LAYERS[0];
      const tileLayer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
        maxZoom: layerConfig.maxZoom,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Add Scale indicator
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

      // Layer group for markers and paths
      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;
    }

    // ResizeObserver to ensure map always expands to 100% of container frame without gray gaps
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

  // Update Tile Layer when layer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const layerConfig = MAP_LAYERS.find((l) => l.id === activeLayerId) || MAP_LAYERS[0];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [activeLayerId]);

  // Render Path, Markers, and the Latest Location Circle with Pointer
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();
    markersMapRef.current.clear();

    if (!records || records.length === 0) return;

    // Filter valid coordinates
    const validPoints = records
      .map((r, originalIdx) => {
        const lat = parseFloat(String(r.latitude));
        const lng = parseFloat(String(r.longitude));
        return {
          record: r,
          lat,
          lng,
          originalIdx,
          isValid: !isNaN(lat) && !isNaN(lng),
        };
      })
      .filter((p) => p.isValid);

    if (validPoints.length === 0) return;

    // Chronological order for flight path (from oldest to newest)
    const chronologicalPoints = [...validPoints].reverse();
    const latLngs: [number, number][] = chronologicalPoints.map((p) => [p.lat, p.lng]);

    // Draw Flight Path dashed polyline (Emerald green matching design)
    if (latLngs.length > 1) {
      // Glow back-shadow line
      L.polyline(latLngs, {
        color: '#064e3b',
        weight: 6,
        opacity: 0.25,
        lineCap: 'round',
      }).addTo(layerGroup);

      // Main dashed line
      L.polyline(latLngs, {
        color: '#059669',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(layerGroup);
    }

    // Place Waypoints and Latest Location Circle
    chronologicalPoints.forEach((point, seqIndex) => {
      const isLatest = seqIndex === chronologicalPoints.length - 1;
      const isSelected =
        selectedRecord?.positionId === point.record.positionId ||
        (selectedRecord?.recordedAt === point.record.recordedAt &&
          String(selectedRecord?.latitude) === String(point.record.latitude));

      const markerKey = point.record.positionId || `${point.record.recordedAt}-${point.lat}`;

      if (isLatest) {
        // 1. Subtle ground circle around latest point (วงกลมรัศมีขนาดเล็ก 25 เมตร ไม่บังจุดอื่น)
        L.circle([point.lat, point.lng], {
          radius: 25,
          color: '#059669',
          weight: 1.5,
          dashArray: '3, 3',
          fillColor: '#10b981',
          fillOpacity: 0.15,
        }).addTo(layerGroup);

        // 2. Latest Location Marker: Clean circular point (จุดวงกลม จุดล่าสุด) with sequence number and mini badge
        const isSelectedState = isSelected;
        const latestHtml = `
          <div class="relative flex flex-col items-center pointer-events-auto cursor-pointer" style="position: absolute; left: 0; top: 0; transform: translate(-50%, -50%);">
            <!-- Mini Tag 'ล่าสุด' above circle -->
            <div style="position: absolute; bottom: 100%; margin-bottom: 4px; white-space: nowrap;">
              <div class="${
                isSelectedState ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-emerald-700 ring-1 ring-emerald-400'
              } text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>ล่าสุด (จุดที่ ${seqIndex + 1})</span>
              </div>
            </div>

            <!-- Compact Circular Point (จุดวงกลม 28px) -->
            <div class="relative flex items-center justify-center">
              <div class="absolute -inset-1 rounded-full ${
                isSelectedState ? 'bg-amber-400/40' : 'bg-emerald-500/30'
              } animate-ping pointer-events-none"></div>
              <div class="relative z-10 w-7 h-7 rounded-full border-2 border-white ${
                isSelectedState ? 'bg-amber-500 ring-2 ring-amber-400 text-white' : 'bg-emerald-600 ring-2 ring-emerald-500 text-white'
              } shadow-lg flex items-center justify-center text-xs font-black">
                ${seqIndex + 1}
              </div>
            </div>
          </div>
        `;

        const latestIcon = L.divIcon({
          className: 'custom-hornbill-marker',
          html: latestHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([point.lat, point.lng], { icon: latestIcon, zIndexOffset: 1000 });
        latestMarkerRef.current = marker;
        markersMapRef.current.set(markerKey, marker);

        marker.bindPopup(`
          <div class="p-3.5 max-w-xs text-slate-800">
            <div class="flex items-center gap-2.5 mb-2.5 pb-2 border-b border-slate-100">
              <img src="${hornbillIcon}" class="w-9 h-9 rounded-full border-2 border-amber-400 shadow-xs" />
              <div>
                <div class="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>${point.record.assetId || 'KKOZ01'}</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">จุดที่ ${seqIndex + 1} (ล่าสุด)</span>
                </div>
                <div class="text-[11px] text-emerald-600 font-medium">🛰️ สัญญาณดาวเทียม GlobalStar</div>
              </div>
            </div>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between"><span class="text-slate-500">วันที่:</span> <span class="font-medium">${formatThaiDate(point.record)}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">เวลา (Local Time):</span> <span class="font-bold text-emerald-800 font-mono">${formatThaiTime(point.record)}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">ละติจูด (Lat):</span> <span class="font-mono text-emerald-700 font-semibold">${formatLatitude(point.lat)}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">ลองจิจูด (Lng):</span> <span class="font-mono text-emerald-700 font-semibold">${formatLongitude(point.lng)}</span></div>
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
        const waypointHtml = isSelected
          ? `
            <div class="relative flex flex-col items-center pointer-events-auto cursor-pointer" style="position: absolute; left: 0; top: 0; transform: translate(-50%, -50%);">
              <div style="position: absolute; bottom: 100%; margin-bottom: 4px; white-space: nowrap;">
                <div class="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1 animate-bounce">
                  <span>📍 จุดที่ ${seqIndex + 1}</span>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full border-2 border-white bg-amber-500 ring-2 ring-amber-400 shadow-2xl flex items-center justify-center text-xs font-black text-white">
                ${seqIndex + 1}
              </div>
            </div>
          `
          : `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125" style="position: absolute; left: 0; top: 0; transform: translate(-50%, -50%);">
              <div class="w-6 h-6 rounded-full border-2 border-emerald-600 bg-white shadow-md flex items-center justify-center text-[10px] font-bold text-slate-800">
                ${seqIndex + 1}
              </div>
            </div>
          `;

        const waypointIcon = L.divIcon({
          className: 'custom-waypoint-marker',
          html: waypointHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([point.lat, point.lng], { icon: waypointIcon, zIndexOffset: isSelected ? 900 : 100 });
        markersMapRef.current.set(markerKey, marker);

        marker.bindPopup(`
          <div class="p-3 max-w-xs text-slate-800">
            <div class="font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
              <span>จุดที่ ${seqIndex + 1}: ${point.record.assetId || 'KKOZ01'}</span>
              ${isSelected ? '<span class="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-full">จุดที่เลือก</span>' : ''}
            </div>
            <div class="space-y-1 text-xs">
              <div><span class="text-slate-500">วันที่:</span> <span class="font-medium">${formatThaiDate(point.record)}</span></div>
              <div><span class="text-slate-500">เวลา (Local Time):</span> <span class="font-bold text-emerald-800 font-mono">${formatThaiTime(point.record)}</span></div>
              <div><span class="text-slate-500">ละติจูด (Lat):</span> <span class="font-mono text-emerald-700 font-semibold">${formatLatitude(point.lat)}</span></div>
              <div><span class="text-slate-500">ลองจิจูด (Lng):</span> <span class="font-mono text-emerald-700 font-semibold">${formatLongitude(point.lng)}</span></div>
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

    // Auto-fit bounds on initial load if no specific record is selected
    if (latLngs.length > 0 && !selectedRecord) {
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [records, activeLayerId, selectedRecord]);

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
      .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  };

  // Fly and Point to Latest Record ("ชี้ตำแหน่งล่าสุด")
  const handlePointToLatest = () => {
    if (!mapInstanceRef.current || !latestRecord) return;
    const lat = parseFloat(String(latestRecord.latitude));
    const lng = parseFloat(String(latestRecord.longitude));
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.flyTo([lat, lng], 15, {
        duration: 1.0,
      });
      if (latestMarkerRef.current) {
        latestMarkerRef.current.openPopup();
      }
      if (onSelectRecord) {
        onSelectRecord(latestRecord);
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

      {/* Flight Legend overlay at bottom right */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-3 z-[400] bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-md border border-slate-200/80 text-[10px] sm:text-[11px] text-slate-700 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-2.5 sm:w-3.5 h-0.5 border-t-2 border-dashed border-emerald-600"></span>
          <span className="hidden xs:inline">เส้นทางบิน</span>
          <span className="xs:hidden">บิน</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          <span>จุดพิกัด</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 border border-white shadow-xs"></span>
          <span className="font-semibold text-emerald-800">ล่าสุด</span>
        </div>
      </div>
    </div>
  );
};
