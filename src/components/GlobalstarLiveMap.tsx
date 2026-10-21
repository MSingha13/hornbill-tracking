import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import * as satellite from 'satellite.js';
import { GLOBALSTAR_TLE_LIST, GlobalstarTleData } from '../data/globalstarTle';
import {
  Satellite,
  Compass,
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  RefreshCw,
  Radio,
  CheckCircle2,
  Info,
  MapPin,
  Sparkles,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

// Observer Station: Chae Son National Park, Lampang, Thailand
export const CHAE_SON_COORDS = {
  lat: 18.8350,
  lng: 99.4715,
  name: 'อุทยานแห่งชาติแจ้ซ้อน',
  province: 'จ.ลำปาง',
  altitudeM: 500
};

interface LiveSatPos {
  name: string;
  noradId: string;
  lat: number;
  lng: number;
  altKm: number;
  velocityKmS: number;
  elevationDeg: number;
  distanceKm: number;
  inCoverage: boolean;
}

const GISTDA_BASEMAP_URL =
  'https://api-gateway.gistda.or.th/api/2.0/resources/tiles/basemap_latest/{z}/{x}/{y}.png?api_key=QTaU1eTmZpIHIItdShp6fiUMcEHxBja3sRFcHYUeaRwAcAumkojB9FgIbxPCcuqW';

const MAP_TILES = [
  {
    id: 'gistda',
    name: 'แผนที่ GISTDA (Basemap ล่าสุด)',
    url: GISTDA_BASEMAP_URL,
    attribution: '',
    maxZoom: 17,
    tileSize: 512,
    zoomOffset: -1,
  },
  {
    id: 'satellite',
    name: 'ภาพถ่ายดาวเทียม (Esri Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
    maxZoom: 18,
    tileSize: 256,
    zoomOffset: 0,
  },
  {
    id: 'osm',
    name: 'OpenStreetMap (แผนที่ถนน)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
  }
];

export const GlobalstarLiveMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const orbitLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const satLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const beamLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeTileId, setActiveTileId] = useState<string>('gistda');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedSatName, setSelectedSatName] = useState<string>('GLOBALSTAR M074');
  const [orbitMode, setOrbitMode] = useState<'selected' | 'in_coverage' | 'all' | 'none'>('in_coverage');
  const [liveSats, setLiveSats] = useState<LiveSatPos[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Prepare observer geodetic position
  const observerGd = useMemo(() => {
    return {
      latitude: satellite.degreesToRadians(CHAE_SON_COORDS.lat),
      longitude: satellite.degreesToRadians(CHAE_SON_COORDS.lng),
      height: CHAE_SON_COORDS.altitudeM / 1000
    };
  }, []);

  // Compute live positions for all 28 Globalstar satellites
  const computePositions = () => {
    const now = new Date();
    const gmst = satellite.gstime(now);
    const results: LiveSatPos[] = [];

    for (const satData of GLOBALSTAR_TLE_LIST) {
      try {
        const satrec = satellite.twoline2satrec(satData.tle1, satData.tle2);
        const posVel = satellite.propagate(satrec, now);
        if (!posVel || !posVel.position || typeof posVel.position === 'boolean') continue;

        const pos = posVel.position as satellite.EciVec3<number>;

        // Position ECI & Geodetic
        const geodetic = satellite.eciToGeodetic(pos, gmst);
        const lat = satellite.degreesLat(geodetic.latitude);
        let lng = satellite.degreesLong(geodetic.longitude);
        if (lng > 180) lng -= 360;
        if (lng < -180) lng += 360;
        const altKm = Math.round(geodetic.height);

        // Velocity magnitude (km/s)
        let velKmS = 7.1;
        if (posVel.velocity && typeof posVel.velocity !== 'boolean') {
          const v = posVel.velocity as satellite.EciVec3<number>;
          velKmS = Math.round(Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 10) / 10;
        }

        // Look angles relative to Chae Son
        const posEcf = satellite.eciToEcf(pos, gmst);
        const lookAngles = satellite.ecfToLookAngles(observerGd, posEcf);
        const elevationDeg = Math.round(satellite.radiansToDegrees(lookAngles.elevation));
        const distanceKm = Math.round(lookAngles.rangeSat);

        // Visible pass or within satellite radio footprint (รัศมี 2,000 กม. จาก อช.แจ้ซ้อน)
        const inCoverage = distanceKm <= 2000;

        results.push({
          name: satData.name,
          noradId: satData.noradId,
          lat,
          lng,
          altKm,
          velocityKmS: velKmS,
          elevationDeg,
          distanceKm,
          inCoverage
        });
      } catch (e) {
        // ignore calculation error
      }
    }

    setLiveSats(results);
    setLastUpdate(now);

    // Auto-select active in-coverage satellite if available
    const activeCovSat = results.find(s => s.inCoverage);
    if (activeCovSat && !results.some(s => s.name === selectedSatName && s.inCoverage)) {
      setSelectedSatName(activeCovSat.name);
    }

    return results;
  };

  // Compute 1 full orbital period ground track trajectory segments (split at antimeridian)
  const computeOrbitSegments = (
    satData: GlobalstarTleData,
    startTime: Date = new Date(),
    durationMinutes: number = 118,
    stepMinutes: number = 1.5
  ): [number, number][][] => {
    try {
      const satrec = satellite.twoline2satrec(satData.tle1, satData.tle2);
      const segments: [number, number][][] = [];
      let currentSegment: [number, number][] = [];

      const totalSteps = Math.ceil(durationMinutes / stepMinutes);
      for (let i = 0; i <= totalSteps; i++) {
        const t = new Date(startTime.getTime() + i * stepMinutes * 60000);
        const gmst = satellite.gstime(t);
        const posVel = satellite.propagate(satrec, t);
        if (!posVel || !posVel.position || typeof posVel.position === 'boolean') continue;
        const pos = posVel.position as satellite.EciVec3<number>;
        const geo = satellite.eciToGeodetic(pos, gmst);
        const lat = satellite.degreesLat(geo.latitude);
        let lng = satellite.degreesLong(geo.longitude);
        if (lng > 180) lng -= 360;
        if (lng < -180) lng += 360;

        if (currentSegment.length > 0) {
          const prevLng = currentSegment[currentSegment.length - 1][1];
          if (Math.abs(lng - prevLng) > 180) {
            segments.push(currentSegment);
            currentSegment = [];
          }
        }
        currentSegment.push([lat, lng]);
      }
      if (currentSegment.length > 0) segments.push(currentSegment);
      return segments;
    } catch (e) {
      return [];
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [CHAE_SON_COORDS.lat, CHAE_SON_COORDS.lng],
        zoom: 4,
        minZoom: 2,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Tile layer
      const tileConfig = MAP_TILES.find(t => t.id === activeTileId) || MAP_TILES[0];
      const tileLayer = L.tileLayer(tileConfig.url, {
        maxZoom: tileConfig.maxZoom,
        attribution: tileConfig.attribution,
        tileSize: tileConfig.tileSize || 256,
        zoomOffset: tileConfig.zoomOffset || 0
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Layer groups in order: Orbits (bottom), Beams (middle), Satellites (top)
      orbitLayerGroupRef.current = L.layerGroup().addTo(map);
      beamLayerGroupRef.current = L.layerGroup().addTo(map);
      satLayerGroupRef.current = L.layerGroup().addTo(map);

      // Add Observer Ground Station Marker: Chae Son National Park
      const chaeSonIcon = L.divIcon({
        className: 'custom-chaeson-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #10b981; border: 3px solid #ffffff; box-shadow: 0 0 16px #10b981; display: flex; align-items: center; justify-content: center;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const groundMarker = L.marker([CHAE_SON_COORDS.lat, CHAE_SON_COORDS.lng], { icon: chaeSonIcon }).addTo(map);
      groundMarker.bindPopup(`
        <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #1e293b;">
          <strong style="color: #065f46; font-size: 13px;">📍 สถานีสังเกตการณ์: ${CHAE_SON_COORDS.name}</strong><br/>
          <span>${CHAE_SON_COORDS.province} (พิกัด: ${CHAE_SON_COORDS.lat}°N, ${CHAE_SON_COORDS.lng}°E)</span><br/>
          <span style="color: #64748b; font-size: 11px;">ความสูง: ~${CHAE_SON_COORDS.altitudeM} เมตรจากระดับน้ำทะเล • รัศมีตรวจจับ: 2,000 กม.</span><br/>
          <div style="margin-top: 6px; padding: 4px 6px; background: #ecfdf5; border-radius: 4px; font-size: 11px; color: #047857;">
            ศูนย์กลางการรับสัญญาณดาวเทียมเครือข่าย Globalstar สำหรับเครื่องส่ง SPOT บนตัวนกกาฮัง (KKOZ01)
          </div>
        </div>
      `);

      // Draw Horizon Coverage Circle for Chae Son (รัศมี 2,000 กม. ตามที่ระบุ)
      L.circle([CHAE_SON_COORDS.lat, CHAE_SON_COORDS.lng], {
        radius: 2000000, // 2,000 km
        color: '#10b981',
        weight: 1.5,
        dashArray: '5, 8',
        fillColor: '#10b981',
        fillOpacity: 0.05
      }).addTo(map);

      mapRef.current = map;
    }

    // Run first calculation
    computePositions();

    // Auto-update every 2.5 seconds
    const interval = setInterval(() => {
      computePositions();
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Update tile layer
  useEffect(() => {
    if (!mapRef.current) return;
    const tileConfig = MAP_TILES.find(t => t.id === activeTileId) || MAP_TILES[0];
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      attribution: tileConfig.attribution,
      tileSize: tileConfig.tileSize || 256,
      zoomOffset: tileConfig.zoomOffset || 0
    }).addTo(mapRef.current);
    tileLayerRef.current = newTile;
  }, [activeTileId]);

  // Redraw Satellite Orbits (วงโคจรดาวเทียม)
  useEffect(() => {
    if (!orbitLayerGroupRef.current) return;
    const orbitGroup = orbitLayerGroupRef.current;
    orbitGroup.clearLayers();

    if (orbitMode === 'none') return;

    const now = new Date();

    if (orbitMode === 'selected') {
      const satData = GLOBALSTAR_TLE_LIST.find(s => s.name === selectedSatName) || GLOBALSTAR_TLE_LIST[0];
      const segments = computeOrbitSegments(satData, now, 118, 1.5);
      segments.forEach((seg) => {
        // Glow trail
        L.polyline(seg, {
          color: '#0284c7',
          weight: 5,
          opacity: 0.35,
          lineCap: 'round',
        }).addTo(orbitGroup);

        // Main dashed orbit trajectory line
        L.polyline(seg, {
          color: '#38bdf8',
          weight: 2.5,
          dashArray: '6, 6',
          opacity: 0.95,
        }).addTo(orbitGroup);
      });
    } else if (orbitMode === 'in_coverage') {
      const activeCoverageSats = liveSats.filter(s => s.inCoverage);
      const targetSats = activeCoverageSats.length > 0 ? activeCoverageSats : liveSats.slice(0, 3);
      targetSats.forEach((sat) => {
        const satData = GLOBALSTAR_TLE_LIST.find(d => d.name === sat.name);
        if (!satData) return;
        const segments = computeOrbitSegments(satData, now, 118, 2);
        segments.forEach((seg) => {
          L.polyline(seg, {
            color: '#059669',
            weight: 4,
            opacity: 0.35,
          }).addTo(orbitGroup);
          L.polyline(seg, {
            color: '#10b981',
            weight: 2,
            dashArray: '5, 5',
            opacity: 0.9,
          }).addTo(orbitGroup);
        });
      });
    } else if (orbitMode === 'all') {
      GLOBALSTAR_TLE_LIST.forEach((satData) => {
        const isSelected = satData.name === selectedSatName;
        const segments = computeOrbitSegments(satData, now, 118, 3);
        segments.forEach((seg) => {
          L.polyline(seg, {
            color: isSelected ? '#38bdf8' : '#0284c7',
            weight: isSelected ? 3 : 1.2,
            opacity: isSelected ? 0.95 : 0.25,
            dashArray: isSelected ? '6, 6' : undefined,
          }).addTo(orbitGroup);
        });
      });
    }
  }, [orbitMode, selectedSatName, liveSats]);

  // Redraw satellites whenever liveSats update
  useEffect(() => {
    if (!satLayerGroupRef.current || !beamLayerGroupRef.current || !mapRef.current) return;

    satLayerGroupRef.current.clearLayers();
    beamLayerGroupRef.current.clearLayers();

    liveSats.forEach((sat) => {
      const isSelected = selectedSatName === sat.name;
      const inCoverage = sat.inCoverage;

      // Color coding: green if in coverage of Chae Son, gold if selected, cyan/white otherwise
      const fillColor = inCoverage ? '#10b981' : isSelected ? '#f59e0b' : '#38bdf8';
      const glowColor = inCoverage ? 'rgba(16, 185, 129, 0.7)' : isSelected ? 'rgba(245, 158, 11, 0.7)' : 'rgba(56, 189, 248, 0.4)';

      const satIcon = L.divIcon({
        className: 'custom-sat-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: ${inCoverage || isSelected ? '24px' : '18px'}; height: ${inCoverage || isSelected ? '24px' : '18px'}; border-radius: 50%; background: ${fillColor}; border: 2px solid #ffffff; box-shadow: 0 0 ${inCoverage ? '15px' : '9px'} ${glowColor}; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
              <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
            </div>
            <div style="position: absolute; top: ${inCoverage || isSelected ? '26px' : '20px'}; white-space: nowrap; background: rgba(15, 23, 42, 0.9); color: ${inCoverage ? '#6ee7b7' : isSelected ? '#fef08a' : '#f8fafc'}; font-size: ${inCoverage || isSelected ? '10px' : '9px'}; font-family: monospace; font-weight: bold; padding: 1px 6px; border-radius: 5px; border: 1px solid ${inCoverage ? '#10b981' : isSelected ? '#f59e0b' : 'rgba(255,255,255,0.2)'}; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
              ${sat.name.replace('GLOBALSTAR ', 'M')}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const satMarker = L.marker([sat.lat, sat.lng], { icon: satIcon });
      satMarker.on('click', () => {
        setSelectedSatName(sat.name);
      });

      satMarker.bindPopup(`
        <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #1e293b; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #0f172a; font-size: 13px;">${sat.name}</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${inCoverage ? '#d1fae5' : '#f1f5f9'}; color: ${inCoverage ? '#047857' : '#64748b'};">
              ${inCoverage ? '🟢 เชื่อมต่อแจ้ซ้อน' : '⚪ นอกระยะ'}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
            <div>พิกัด: <strong>${sat.lat.toFixed(2)}°, ${sat.lng.toFixed(2)}°</strong></div>
            <div>ความสูง: <strong>~${sat.altKm} km</strong></div>
            <div>ความเร็ว: <strong>${sat.velocityKmS} km/s</strong></div>
            <div>มุมเงย: <strong style="color: ${inCoverage ? '#059669' : '#475569'};">${sat.elevationDeg}°</strong></div>
          </div>
          <div style="margin-top: 6px; font-size: 11px; color: #64748b;">
            ระยะห่างจาก อช.แจ้ซ้อน: <strong>${sat.distanceKm.toLocaleString()} กม.</strong>
          </div>
          <div style="margin-top: 6px; padding: 4px; background: #f8fafc; border-radius: 4px; font-size: 10px; color: #0284c7; text-align: center; font-weight: bold;">
            คลิกที่ตัวดาวเทียมเพื่อวาดวงโคจร (Orbit Track)
          </div>
        </div>
      `);

      satLayerGroupRef.current?.addLayer(satMarker);

      // If satellite is currently in coverage of Chae Son, draw direct signal beacon line
      if (inCoverage) {
        const beamLine = L.polyline(
          [
            [CHAE_SON_COORDS.lat, CHAE_SON_COORDS.lng],
            [sat.lat, sat.lng]
          ],
          {
            color: '#10b981',
            weight: 2.5,
            dashArray: '4, 6',
            opacity: 0.85
          }
        );
        beamLayerGroupRef.current?.addLayer(beamLine);
      }
    });
  }, [liveSats, selectedSatName]);

  const inCoverageCount = liveSats.filter(s => s.inCoverage).length;
  const currentSelectedSat = liveSats.find(s => s.name === selectedSatName) || liveSats[0];

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : ''
    } ${className}`}>
      {/* Top Map Control Bar matching image.png */}
      <div className="px-4 py-3.5 bg-[#0b1329] text-white flex flex-col gap-3 border-b border-slate-800/80">
        {/* Row 1: Header & Station */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-white text-sm sm:text-base tracking-tight">
                วงโคจรดาวเทียม Globalstar สด (Live Satellite Orbits)
              </h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono shadow-xs">
                ● TLE SGP4 จาก satmap.space
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              สถานีสังเกตการณ์: <strong className="text-emerald-400 font-bold">{CHAE_SON_COORDS.name} {CHAE_SON_COORDS.province}</strong> ({CHAE_SON_COORDS.lat}°N, {CHAE_SON_COORDS.lng}°E)
            </p>
          </div>
        </div>

        {/* Row 2: Control Toolbar exactly as in image.png */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Satellite Dropdown Selector */}
          <div className="relative inline-flex items-center gap-2 bg-[#17233f] hover:bg-[#1e2e50] px-3 py-2 rounded-2xl border border-slate-700/80 text-xs font-semibold shadow-xs">
            <Satellite className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <select
              value={selectedSatName}
              onChange={(e) => setSelectedSatName(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-5 appearance-none"
              title="เลือกดาวเทียมเพื่อดูวงโคจร"
            >
              {GLOBALSTAR_TLE_LIST.map((s) => {
                const liveInfo = liveSats.find(l => l.name === s.name);
                const isCov = liveInfo?.inCoverage;
                return (
                  <option key={s.name} value={s.name} className="bg-slate-900 text-white font-medium">
                    {s.name} {isCov ? '🟢 (ผ่านไทย)' : ''}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5" />
          </div>

          {/* Orbit Mode Buttons Group */}
          <div className="flex items-center gap-1 bg-[#17233f] p-1 rounded-2xl border border-slate-700/80 text-xs">
            <button
              type="button"
              onClick={() => setOrbitMode('selected')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                orbitMode === 'selected'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ดวงที่เลือก
            </button>

            <button
              type="button"
              onClick={() => setOrbitMode('in_coverage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                orbitMode === 'in_coverage'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>ที่ผ่านไทย</span>
              <span>({inCoverageCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setOrbitMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                orbitMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ทั้งหมด 28 ดวง
            </button>

            <button
              type="button"
              onClick={() => setOrbitMode('none')}
              className={`px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                orbitMode === 'none'
                  ? 'bg-slate-700 text-slate-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ซ่อน
            </button>
          </div>

          {/* Layer Selector Group */}
          <div className="flex items-center gap-1 bg-[#17233f] p-1 rounded-2xl border border-slate-700/80 text-xs">
            {MAP_TILES.map(tile => (
              <button
                type="button"
                key={tile.id}
                onClick={() => setActiveTileId(tile.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTileId === tile.id
                    ? 'bg-slate-700 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tile.id === 'gistda' ? 'GISTDA' : tile.id === 'satellite' ? 'ดาวเทียม' : 'ถนน'}
              </button>
            ))}
          </div>

          {/* Focus Jae Sorn Button */}
          <button
            type="button"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView([CHAE_SON_COORDS.lat, CHAE_SON_COORDS.lng], 5);
              }
            }}
            className="px-3 py-2 rounded-2xl bg-[#17233f] hover:bg-[#1e2e50] text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition-colors shadow-xs"
            title="ซูมกลับไปที่อุทยานแห่งชาติแจ้ซ้อน"
          >
            <Crosshair className="w-3.5 h-3.5 text-slate-300" />
            <span>โฟกัสแจ้ซ้อน</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-2xl bg-[#17233f] hover:bg-[#1e2e50] text-slate-200 text-xs flex items-center justify-center border border-slate-700/80 transition-colors shadow-xs"
            title={isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มกรอบ'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Leaflet Map Viewport */}
      <div className={`relative ${isFullscreen ? 'flex-1 h-full' : 'h-[500px] sm:h-[580px] lg:h-[640px]'}`}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Live Telemetry & Orbit Specifications Card on Bottom-Right */}
        {currentSelectedSat && (
          <div className="absolute bottom-3 right-3 max-w-xs sm:max-w-sm bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl text-xs pointer-events-auto space-y-2 z-10">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
                <span>วงโคจร: {currentSelectedSat.name}</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                currentSelectedSat.inCoverage
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {currentSelectedSat.inCoverage ? '🟢 ครอบคลุม อช.แจ้ซ้อน' : '⚪ นอกระยะรับสัญญาณ'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">คาบเวลาโคจร (Period)</span>
                <strong className="text-sky-300 font-mono">~114 นาที/รอบ</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">ความเอียง (Inclination)</span>
                <strong className="text-amber-300 font-mono">52.0° LEO</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">มุมเงยจากแจ้ซ้อน</span>
                <strong className={currentSelectedSat.inCoverage ? 'text-emerald-400 font-mono' : 'text-slate-300 font-mono'}>
                  {currentSelectedSat.elevationDeg}°
                </strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">ระยะห่างจากแจ้ซ้อน</span>
                <strong className="text-slate-200 font-mono">
                  {currentSelectedSat.distanceKm.toLocaleString()} กม.
                </strong>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800 font-mono">
              <span>ความเร็ว: {currentSelectedSat.velocityKmS} km/s</span>
              <span className="text-emerald-400">ความสูง: ~{currentSelectedSat.altKm} km</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
