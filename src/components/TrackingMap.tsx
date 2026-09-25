import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TrackingRecord, MapLayerConfig } from '../types/tracking';
import { formatCoordinates, formatThaiDate, formatThaiTime } from '../utils/formatters';
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
} from 'lucide-react';

interface TrackingMapProps {
  records: TrackingRecord[];
  latestRecord?: TrackingRecord;
  selectedRecord?: TrackingRecord | null;
  onSelectRecord?: (record: TrackingRecord) => void;
  className?: string;
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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const latestMarkerRef = useRef<L.Marker | null>(null);

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
          selectedRecord?.latitude === point.record.latitude);

      if (isLatest) {
        // 1. Add Signal Coverage / Accuracy Circle on the map
        L.circle([point.lat, point.lng], {
          radius: 1200, // meters
          color: '#059669',
          weight: 1.5,
          dashArray: '5, 5',
          fillColor: '#10b981',
          fillOpacity: 0.08,
        }).addTo(layerGroup);

        // 2. Latest Location Marker:
        // Features:
        // - Floating speech bubble callout pointing directly DOWN
        // - Multiple concentric pulsing radar waves (จุดวงกลมสัญญาณเรดาร์)
        // - Great Hornbill circular avatar
        // - Center target bullseye dot & pin pointer directly at coordinate
        const latestIcon = L.divIcon({
          className: 'custom-hornbill-marker',
          html: `
            <div class="relative flex flex-col items-center pointer-events-auto" style="transform: translate(-50%, -100px); width: 180px;">
              <!-- Pointer Callout Bubble (ชี้ตำแหน่ง) -->
              <div class="pointer-callout animate-float-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-lg flex flex-col items-center text-center">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="font-extrabold text-xs text-slate-900 tracking-tight">${point.record.assetId || 'KKOZ01'}</span>
                  <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">ตำแหน่งล่าสุด</span>
                </div>
                <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                  ${formatThaiTime(point.record.recordedAt)} • ${point.record.battery || '80'}%
                </div>
              </div>

              <!-- Connecting stem / pointer line down to target circle -->
              <div class="w-0.5 h-3 bg-gradient-to-b from-slate-400 to-emerald-600"></div>

              <!-- Concentric Radar Ripple Waves (จุดวงกลมล่าสุด) -->
              <div class="relative w-14 h-14 flex items-center justify-center">
                <div class="absolute inset-0 rounded-full bg-emerald-500/25 radar-wave-1 pointer-events-none"></div>
                <div class="absolute inset-0 rounded-full bg-emerald-400/35 radar-wave-2 pointer-events-none"></div>
                <div class="absolute inset-0 rounded-full bg-emerald-400/20 radar-wave-3 pointer-events-none"></div>

                <!-- Outer Gold & Emerald Ring -->
                <div class="relative z-10 w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-emerald-400 to-emerald-600 shadow-xl ring-2 ring-white">
                  <img
                    src="${hornbillIcon}"
                    alt="Hornbill"
                    class="w-full h-full object-cover rounded-full bg-slate-900"
                  />
                  <!-- Pinpoint center target dot -->
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-600 border-2 border-white rounded-full shadow-md"></div>
                </div>
              </div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([point.lat, point.lng], { icon: latestIcon, zIndexOffset: 1000 });
        latestMarkerRef.current = marker;

        marker.bindPopup(`
          <div class="p-3.5 max-w-xs text-slate-800">
            <div class="flex items-center gap-2.5 mb-2.5 pb-2 border-b border-slate-100">
              <img src="${hornbillIcon}" class="w-9 h-9 rounded-full border-2 border-amber-400 shadow-xs" />
              <div>
                <div class="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>${point.record.assetId || 'KKOZ01'}</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">ตำแหน่งล่าสุด</span>
                </div>
                <div class="text-[11px] text-emerald-600 font-medium">สัญญาณสดแบบเรียลไทม์</div>
              </div>
            </div>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between"><span class="text-slate-500">วันที่:</span> <span class="font-medium">${formatThaiDate(point.record.recordedAt)}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">เวลา:</span> <span class="font-medium">${formatThaiTime(point.record.recordedAt)}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">พิกัด:</span> <span class="font-mono text-emerald-700 font-semibold">${formatCoordinates(point.lat, point.lng)}</span></div>
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
        const waypointIcon = L.divIcon({
          className: 'custom-waypoint-marker',
          html: `
            <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125">
              <div class="w-6 h-6 rounded-full border-2 ${
                isSelected
                  ? 'border-amber-500 bg-amber-400 scale-125 ring-4 ring-amber-300'
                  : 'border-emerald-600 bg-white'
              } shadow-md flex items-center justify-center text-[10px] font-bold text-slate-800">
                ${seqIndex + 1}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([point.lat, point.lng], { icon: waypointIcon });
        marker.bindPopup(`
          <div class="p-3 max-w-xs text-slate-800">
            <div class="font-bold text-sm text-slate-900 mb-1">จุดที่ ${seqIndex + 1}: ${point.record.assetId || 'KKOZ01'}</div>
            <div class="space-y-1 text-xs">
              <div><span class="text-slate-500">เวลา:</span> <span class="font-medium">${formatThaiDate(point.record.recordedAt)} ${formatThaiTime(point.record.recordedAt)}</span></div>
              <div><span class="text-slate-500">พิกัด:</span> <span class="font-mono">${formatCoordinates(point.lat, point.lng)}</span></div>
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
  }, [records, activeLayerId]);

  // Center on Selected Record
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRecord) return;
    const lat = parseFloat(String(selectedRecord.latitude));
    const lng = parseFloat(String(selectedRecord.longitude));
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.flyTo([lat, lng], 14, {
        duration: 1.2,
      });
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
      className={`relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-white flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl border-2 border-emerald-600' : ''
      } ${className}`}
    >
      {/* Map container - Expands 100% to fill bounding frame */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0 min-h-[440px]" />

      {/* Top Left: Map Controls & Pointing Tools */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl shadow-md border border-slate-200 backdrop-blur transition-all active:scale-95"
            title="เปลี่ยนรูปแบบแผนที่"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>แผนที่ติดตาม</span>
            <span className="text-[10px] text-slate-400">▾</span>
          </button>

          {showLayerMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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

        {/* Quick Point to Latest ("ชี้ตำแหน่งล่าสุด") Button */}
        <button
          onClick={handlePointToLatest}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md border border-emerald-800 backdrop-blur transition-all active:scale-95 ring-2 ring-emerald-500/20"
          title="ชี้พิกัดตำแหน่งล่าสุดทันที"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-300" />
          <span>ชี้ตำแหน่งล่าสุด</span>
        </button>

        {/* Center / Fit all points button */}
        <button
          onClick={handleFitBounds}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-slate-700 text-xs font-medium rounded-xl shadow-md border border-slate-200 backdrop-blur transition-all active:scale-95"
          title="ซูมแสดงภาพรวมทุกพิกัด"
        >
          <Crosshair className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">จัดกึ่งกลาง</span>
        </button>

        {/* Flight replay button */}
        <button
          onClick={toggleReplay}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl shadow-md backdrop-blur transition-all active:scale-95 ${
            isPlayingReplay
              ? 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-600'
              : 'bg-white/95 hover:bg-white text-slate-700 border border-slate-200'
          }`}
          title="จำลองเส้นทางการบินย้อนหลัง"
        >
          {isPlayingReplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{isPlayingReplay ? 'หยุดชั่วคราว' : 'เล่นเส้นทางบิน'}</span>
        </button>

        {isPlayingReplay && (
          <button
            onClick={handleResetReplay}
            className="p-2 bg-white/95 hover:bg-white text-slate-600 text-xs rounded-xl shadow-md border border-slate-200 backdrop-blur"
            title="รีเซ็ตเส้นทาง"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Top Right: Fullscreen Expand/Collapse */}
      <div className="absolute top-3 right-12 z-[400]">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 backdrop-blur transition-all active:scale-95"
          title={isFullscreen ? 'ย่อหน้าต่างกลับ' : 'ขยายแผนที่เต็มจอ'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-700" /> : <Maximize2 className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Flight Legend overlay at bottom right */}
      <div className="absolute bottom-6 right-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] text-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 border-t-2 border-dashed border-emerald-600"></span>
          <span>เส้นทางบิน</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          <span>จุดพิกัด</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 border border-white shadow-xs"></span>
          <span className="font-semibold text-emerald-800">จุดล่าสุด</span>
        </div>
      </div>
    </div>
  );
};
