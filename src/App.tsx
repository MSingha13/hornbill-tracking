/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TrackingMap } from './components/TrackingMap';
import { LatestDetailCard } from './components/LatestDetailCard';
import { HistoryTable, AvailableDateOption } from './components/HistoryTable';
import { SpeciesInfoView } from './components/SpeciesInfoView';
import { SatMapView } from './components/SatMapView';
import { UserManualView } from './components/UserManualView';
import { AssetSelector } from './components/AssetSelector';
import { TrackingRecord, TrackingApiResponse, AssetFilterType, DateFilterMode, normalizeAssetId, KKOZ01_BASELINE_RECORD } from './types/tracking';
import { exportToSplitSheetsExcel, formatThaiDateTime, formatThaiDate, getRecordDateKey, getRecordTimestamp } from './utils/formatters';
import { API_ENDPOINT, API_SPOT_SYNC_ENDPOINT, SCRIPT_UPDATE_ACTION } from './assets/assets';
import {
  SheetSourceConfig,
  loadSheetSourceConfig,
  saveSheetSourceConfig,
  fetchAllRowsFromPublicGoogleSheet,
  normalizeAndSortRecords,
} from './utils/googleSheetReader';
import { GoogleSheetSourceModal } from './components/GoogleSheetSourceModal';
import { Home, Map, Feather, AlertCircle, CheckCircle2, Menu, Calendar, Satellite } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [records, setRecords] = useState<TrackingRecord[]>([]);
  const [latestRecord, setLatestRecord] = useState<TrackingRecord | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<AssetFilterType>('KK0Z01');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filter mode: default to 'live' as requested (Live, 1H, 24H, 7D, 1M, and specific date)
  const [filterMode, setFilterMode] = useState<DateFilterMode>('live');
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');
  const [sheetSourceConfig, setSheetSourceConfig] = useState<SheetSourceConfig>(() => loadSheetSourceConfig());
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);

  // 1. Separate data: Filter records by selected asset ('KK0Z01' | 'KK0Z02' | 'ALL')
  const assetFilteredRecords = useMemo(() => {
    if (selectedAssetFilter === 'ALL') {
      return records;
    }
    return records.filter((r) => normalizeAssetId(r.assetId) === selectedAssetFilter);
  }, [records, selectedAssetFilter]);

  // Counts per asset
  const kkoz01Count = useMemo(
    () => records.filter((r) => normalizeAssetId(r.assetId) === 'KK0Z01').length,
    [records]
  );
  const kkoz02Count = useMemo(
    () => records.filter((r) => normalizeAssetId(r.assetId) === 'KK0Z02').length,
    [records]
  );

  // Active latest record for the selected asset
  const activeAssetLatestRecord = useMemo(() => {
    if (selectedAssetFilter === 'KK0Z01') {
      return records.find((r) => normalizeAssetId(r.assetId) === 'KK0Z01') || latestRecord;
    }
    if (selectedAssetFilter === 'KK0Z02') {
      return records.find((r) => normalizeAssetId(r.assetId) === 'KK0Z02') || latestRecord;
    }
    return latestRecord || records[0];
  }, [records, selectedAssetFilter, latestRecord]);

  // Identify the latest recorded date key (YYYY-MM-DD) for active asset
  const latestDateKey = useMemo(() => {
    if (assetFilteredRecords.length === 0) return '';
    return getRecordDateKey(activeAssetLatestRecord || assetFilteredRecords[0]);
  }, [activeAssetLatestRecord, assetFilteredRecords]);

  // Thai formatted string for the latest date (e.g. 30 ก.ย. 2569)
  const latestDateThai = useMemo(() => {
    if (assetFilteredRecords.length === 0) return '';
    return formatThaiDate(activeAssetLatestRecord || assetFilteredRecords[0]);
  }, [activeAssetLatestRecord, assetFilteredRecords]);

  // List of all unique recorded dates with Thai label and point count for active asset
  const availableDates: AvailableDateOption[] = useMemo(() => {
    if (!assetFilteredRecords || assetFilteredRecords.length === 0) return [];
    const dateMap: Record<string, AvailableDateOption> = {};
    assetFilteredRecords.forEach((r) => {
      const key = getRecordDateKey(r);
      if (!key) return;
      if (!dateMap[key]) {
        dateMap[key] = {
          dateKey: key,
          thaiDate: formatThaiDate(r),
          count: 1,
        };
      } else {
        dateMap[key].count += 1;
      }
    });
    return Object.keys(dateMap)
      .map((k) => dateMap[k])
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [assetFilteredRecords]);

  // Formatted Thai string for selected date
  const selectedDateThai = useMemo(() => {
    const found = availableDates.find((d) => d.dateKey === selectedDateKey);
    return found ? found.thaiDate : latestDateThai;
  }, [availableDates, selectedDateKey, latestDateThai]);

  // Points filtered: Live (default), 1H, 24H, 7D, 1M, All, or Specific Date
  const displayedRecords = useMemo(() => {
    if (!assetFilteredRecords || assetFilteredRecords.length === 0) return [];

    if (filterMode === 'live') {
      // Live mode: show the latest point for each tracked bird or active bird
      if (selectedAssetFilter === 'ALL') {
        const kkoz01Latest = assetFilteredRecords.find((r) => normalizeAssetId(r.assetId) === 'KK0Z01');
        const kkoz02Latest = assetFilteredRecords.find((r) => normalizeAssetId(r.assetId) === 'KK0Z02');
        const list = [kkoz01Latest, kkoz02Latest].filter(Boolean) as TrackingRecord[];
        return list.length > 0 ? list : [assetFilteredRecords[0]];
      }
      return [activeAssetLatestRecord || assetFilteredRecords[0]];
    }

    if (filterMode === '1h') {
      const timestamps = assetFilteredRecords.map(getRecordTimestamp).filter((t) => t > 0);
      const refTs = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
      const cutoff = refTs - 3600 * 1000;
      const matched = assetFilteredRecords.filter((r) => getRecordTimestamp(r) >= cutoff);
      return matched.length > 0 ? matched : [activeAssetLatestRecord || assetFilteredRecords[0]];
    }

    if (filterMode === '24h') {
      const timestamps = assetFilteredRecords.map(getRecordTimestamp).filter((t) => t > 0);
      const refTs = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
      const cutoff = refTs - 24 * 3600 * 1000;
      const matched = assetFilteredRecords.filter((r) => getRecordTimestamp(r) >= cutoff);
      return matched.length > 0 ? matched : [activeAssetLatestRecord || assetFilteredRecords[0]];
    }

    if (filterMode === '7d') {
      const timestamps = assetFilteredRecords.map(getRecordTimestamp).filter((t) => t > 0);
      const refTs = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
      const cutoff = refTs - 7 * 24 * 3600 * 1000;
      const matched = assetFilteredRecords.filter((r) => getRecordTimestamp(r) >= cutoff);
      return matched.length > 0 ? matched : assetFilteredRecords;
    }

    if (filterMode === '1m') {
      const timestamps = assetFilteredRecords.map(getRecordTimestamp).filter((t) => t > 0);
      const refTs = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
      const cutoff = refTs - 30 * 24 * 3600 * 1000;
      const matched = assetFilteredRecords.filter((r) => getRecordTimestamp(r) >= cutoff);
      return matched.length > 0 ? matched : assetFilteredRecords;
    }

    if (filterMode === 'all') {
      // อ่านข้อมูลทุกบรรทัด (All lines/records without filtering)
      return assetFilteredRecords;
    }

    if (filterMode === 'specific_date') {
      const targetKey = selectedDateKey || latestDateKey;
      return assetFilteredRecords.filter((r) => getRecordDateKey(r) === targetKey);
    }

    return assetFilteredRecords;
  }, [assetFilteredRecords, filterMode, selectedAssetFilter, activeAssetLatestRecord, latestDateKey, selectedDateKey]);

  // Dynamic date/time range label for currently displayed records
  const filterDateRangeText = useMemo(() => {
    if (!assetFilteredRecords || assetFilteredRecords.length === 0) return '';
    if (filterMode === 'live') {
      const target = activeAssetLatestRecord || assetFilteredRecords[0];
      return formatThaiDateTime(target);
    }
    if (displayedRecords.length === 1) {
      return formatThaiDateTime(displayedRecords[0]);
    }
    if (displayedRecords.length > 1) {
      const newestSample = displayedRecords[0];
      const oldestSample = displayedRecords[displayedRecords.length - 1];
      return `${formatThaiDate(oldestSample)} - ${formatThaiDate(newestSample)}`;
    }
    return '';
  }, [assetFilteredRecords, displayedRecords, filterMode, activeAssetLatestRecord]);

  // Reset selectedRecord if selection is not in displayedRecords
  useEffect(() => {
    if (
      selectedRecord &&
      !displayedRecords.some(
        (r) =>
          (selectedRecord.positionId && r.positionId === selectedRecord.positionId) ||
          (r.recordedAt === selectedRecord.recordedAt && String(r.latitude) === String(selectedRecord.latitude))
      )
    ) {
      setSelectedRecord(null);
    }
  }, [displayedRecords, selectedRecord]);

  // Fetch tracking data: reads all rows from Google Sheet via Apps Script Web App (or configured sheet link)
  const fetchData = useCallback(
    async (
      isManualTrigger = false,
      forceReadAll = false,
      overrideConfig?: SheetSourceConfig
    ) => {
      setIsLoading(true);
      setError(null);

      const activeConfig = overrideConfig || sheetSourceConfig;
      const isLocalhostOrXampp =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.protocol === 'file:');

      let lastError: unknown = null;
      let combinedRecords: TrackingRecord[] | null = null;
      let rawCount = 0;

      try {
        // 1. If user configured a public Google Sheet URL directly
        if (activeConfig.mode === 'public_google_sheet' && activeConfig.sheetUrlOrId) {
          combinedRecords = await fetchAllRowsFromPublicGoogleSheet(
            activeConfig.sheetUrlOrId,
            activeConfig.sheetName
          );
          rawCount = combinedRecords.length;
        } else {
          // 2. Fetch from Google Apps Script endpoint (default returns all rows in Google Sheet)
          const targetEndpoint =
            activeConfig.mode === 'custom_apps_script' && activeConfig.customAppsScriptUrl
              ? activeConfig.customAppsScriptUrl
              : API_ENDPOINT;

          // If manual refresh on default endpoint, trigger SPOT sync in background/parallel so new points are captured
          if (isManualTrigger && !forceReadAll && activeConfig.mode === 'default_apps_script') {
            fetch(`${API_SPOT_SYNC_ENDPOINT}?action=${SCRIPT_UPDATE_ACTION}&_t=${Date.now()}`, {
              method: 'GET',
              headers: { Accept: 'application/json' },
            }).catch(() => {
              // Non-blocking sync trigger
            });
          }

          const urlsToTry = [
            `${targetEndpoint}?action=getAll&limit=all&_t=${Date.now()}`,
            `${targetEndpoint}?action=${SCRIPT_UPDATE_ACTION}&_t=${Date.now()}`,
            isLocalhostOrXampp ? `api.php?action=getAll&limit=all&_t=${Date.now()}` : null,
          ].filter(Boolean) as string[];

          let successData: TrackingApiResponse | null = null;

          for (const url of urlsToTry) {
            try {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                },
              });

              if (response.ok) {
                const data: TrackingApiResponse = await response.json();
                if (data && data.success && Array.isArray(data.records)) {
                  successData = data;
                  break;
                }
              }
            } catch (e) {
              lastError = e;
            }
          }

          if (successData && successData.success) {
            const rawRecords = successData.records || [];
            rawCount = rawRecords.length;
            combinedRecords = normalizeAndSortRecords(rawRecords);
          } else {
            throw new Error((successData as any)?.message || 'ไม่สามารถดึงข้อมูลจาก Google Sheet ได้');
          }
        }

        setRecords(combinedRecords);

        const kkoz01List = combinedRecords.filter((r) => normalizeAssetId(r.assetId) === 'KK0Z01');
        const kkoz02List = combinedRecords.filter((r) => normalizeAssetId(r.assetId) === 'KK0Z02');

        // Determine latest record for active view
        const activeMatch =
          (selectedAssetFilter === 'KK0Z02' ? kkoz02List[0] : kkoz01List[0]) || combinedRecords[0];
        setLatestRecord(activeMatch);
        setLastUpdated(new Date());

        if (isManualTrigger || forceReadAll) {
          setSyncStatus({
            type: 'success',
            message: forceReadAll
              ? `อ่านค่าทั้งหมดจาก Google Sheet สำเร็จ (${rawCount} แถว)`
              : `อัปเดตข้อมูลจาก Google Sheet เรียบร้อยแล้ว (พบข้อมูลทั้งหมด ${rawCount} จุด)`,
          });
          setTimeout(() => {
            setSyncStatus(null);
          }, 5000);
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : String(lastError || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        console.warn('Signal fetch issue:', err);
        setError(`ไม่สามารถเชื่อมต่อข้อมูล Google Sheet ได้ (${msg}) กรุณากดลองใหม่`);
        if (overrideConfig) {
          throw err;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedAssetFilter, sheetSourceConfig]
  );

  const handleSelectAllFilter = useCallback(() => {
    setFilterMode('all');
    fetchData(true, true);
  }, [fetchData]);

  const handleApplySheetConfig = useCallback(
    async (newConfig: SheetSourceConfig) => {
      await fetchData(true, true, newConfig);
      setSheetSourceConfig(newConfig);
      saveSheetSourceConfig(newConfig);
    },
    [fetchData]
  );

  // Initial load and periodic background sync (in sync with ScriptApp 1-hour trigger)
  useEffect(() => {
    fetchData();

    const intervalId = window.setInterval(() => {
      fetchData(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleExportCSV = () => {
    if (!records || records.length === 0) return;

    // Apply active time/date filter across BOTH KK0Z01 and KK0Z02 (never drop either sheet)
    let recordsToExport = records;
    if (filterMode === '1h' || filterMode === '24h' || filterMode === '7d' || filterMode === '1m') {
      const hoursMap: Record<'1h' | '24h' | '7d' | '1m', number> = {
        '1h': 1,
        '24h': 24,
        '7d': 7 * 24,
        '1m': 30 * 24,
      };
      const timestamps = records.map(getRecordTimestamp).filter((t) => t > 0);
      const refTs = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
      const cutoff = refTs - hoursMap[filterMode] * 3600 * 1000;
      const matched = records.filter((r) => getRecordTimestamp(r) >= cutoff);
      if (matched.length > 0) recordsToExport = matched;
    } else if (filterMode === 'specific_date') {
      const targetKey = selectedDateKey || latestDateKey;
      const matched = records.filter((r) => getRecordDateKey(r) === targetKey);
      if (matched.length > 0) recordsToExport = matched;
    }

    const { kkoz01Count: sheet1Count, kkoz02Count: sheet2Count } = exportToSplitSheetsExcel(
      recordsToExport,
      `hornbill-tracking-KKOZ01-KKOZ02.xlsx`
    );

    setSyncStatus({
      type: 'success',
      message: `ส่งออกไฟล์ Excel แยกชีตสำเร็จ: ชีต KKOZ01 (${sheet1Count} แถว) และชีต KKOZ02 (${sheet2Count} แถว)`,
    });
    setTimeout(() => {
      setSyncStatus(null);
    }, 5000);
  };

  const handleSelectRecord = (r: TrackingRecord) => {
    setSelectedRecord(r);
    // If on mobile or smaller screen, scroll smoothly to map
    const mapElement = document.getElementById('tracking-map-container');
    if (mapElement && window.innerWidth < 1024) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetToLatest = () => {
    setSelectedRecord(null);
  };

  const handleAssetFilterChange = (filter: AssetFilterType) => {
    setSelectedAssetFilter(filter);
    setSelectedRecord(null);
    if (filter === 'KK0Z01') {
      const kkoz01 = records.find((r) => normalizeAssetId(r.assetId) === 'KK0Z01');
      if (kkoz01) setLatestRecord(kkoz01);
    } else if (filter === 'KK0Z02') {
      const kkoz02 = records.find((r) => normalizeAssetId(r.assetId) === 'KK0Z02');
      if (kkoz02) setLatestRecord(kkoz02);
    } else if (records.length > 0) {
      setLatestRecord(records[0]);
    }
  };

  const handleFocusActiveOnMap = () => {
    const mapElement = document.getElementById('tracking-map-container');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f5] text-slate-800 overflow-hidden font-['Prompt']">
      {/* Sidebar (Desktop persistent + Mobile slide-out drawer) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isMobileOpen={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onRefresh={() => fetchData(true)}
          isLoading={isLoading}
          onExportCSV={handleExportCSV}
          lastUpdatedTime={formatThaiDateTime(latestRecord?.localTime || latestRecord?.displayTime || latestRecord?.recordedAt || lastUpdated.toISOString())}
          onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        />

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto p-2.5 sm:p-4 lg:p-6 pb-24 sm:pb-28 lg:pb-6">
          {/* Sync Success Notification Banner */}
          {syncStatus && (
            <div className="mb-3 sm:mb-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{syncStatus.message}</span>
              </div>
              <button
                onClick={() => setSyncStatus(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 text-xs px-1.5 py-0.5 rounded hover:bg-emerald-100"
              >
                ✕ ปิด
              </button>
            </div>
          )}

          {/* Error Banner if any */}
          {error && (
            <div className="mb-3 sm:mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => fetchData(true)}
                className="underline hover:text-amber-950 font-semibold ml-2"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Tab 1: Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="space-y-3 sm:space-y-4 max-w-7xl mx-auto">
              {/* Asset Selector Bar: Separate KKOZ01 and KKOZ02 */}
              <div className="bg-white p-3 sm:px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-900">
                    เลือกรหัสติดตาม (อุปกรณ์):
                  </span>
                  <span className="text-[11px] text-slate-500 hidden md:inline">
                    แยกข้อมูลการบินและการติดตามระหว่าง KKOZ01 และ KKOZ02
                  </span>
                </div>
                <AssetSelector
                  selectedAsset={selectedAssetFilter}
                  onChange={handleAssetFilterChange}
                  kkoz01Count={kkoz01Count}
                  kkoz02Count={kkoz02Count}
                  totalCount={records.length}
                />
              </div>

              {/* Quick Date Filter Selector Bar */}
              <div className="bg-white p-3 sm:px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${filterMode === 'live' ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>การแสดงผลพิกัด:</span>
                  </span>
                  {filterMode === 'live' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>พิกัดสดล่าสุด Live ({displayedRecords.length} จุด • {filterDateRangeText || '-'})</span>
                    </span>
                  ) : filterMode === '1h' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      ย้อนหลัง 1 ชม. (1H • {displayedRecords.length} จุด)
                    </span>
                  ) : filterMode === '24h' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      ย้อนหลัง 24 ชม. (24H • {displayedRecords.length} จุด • {filterDateRangeText || '-'})
                    </span>
                  ) : filterMode === '7d' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      ย้อนหลัง 7 วัน (7D • {displayedRecords.length} จุด • {filterDateRangeText || '-'})
                    </span>
                  ) : filterMode === '1m' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      ย้อนหลัง 1 เดือน (1M • {displayedRecords.length} จุด • {filterDateRangeText || '-'})
                    </span>
                  ) : filterMode === 'all' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      พิกัดทั้งหมด (อ่านทุกบรรทัด {displayedRecords.length} จุด)
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      วันที่เลือก: {selectedDateThai || '-'} ({displayedRecords.length} จุด)
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-medium">
                  {/* Live Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('live')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      filterMode === 'live'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดสดล่าสุดแบบเรียลไทม์ (Live)"
                  >
                    <span className={`w-2 h-2 rounded-full ${filterMode === 'live' ? 'bg-emerald-300 animate-pulse' : 'bg-emerald-500'}`}></span>
                    <span>Live</span>
                  </button>

                  {/* 1H Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('1h')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '1h'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 1 ชั่วโมง (1H)"
                  >
                    <span>1H</span>
                  </button>

                  {/* 24H Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('24h')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '24h'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 24 ชั่วโมง (24H)"
                  >
                    <span>24H</span>
                  </button>

                  {/* 7D Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('7d')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '7d'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 7 วัน (7D)"
                  >
                    <span>7D</span>
                  </button>

                  {/* 1M Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('1m')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '1m'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 1 เดือน (1M)"
                  >
                    <span>1M</span>
                  </button>

                  {/* All Button */}
                  <button
                    type="button"
                    onClick={handleSelectAllFilter}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === 'all'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="อ่านค่าทั้งหมดทุกบรรทัดใน Google Sheet"
                  >
                    <span>ทั้งหมด</span>
                  </button>

                  {/* Dropdown to pick date */}
                  {availableDates.length > 0 && (
                    <div className="relative flex items-center">
                      <select
                        value={filterMode === 'specific_date' ? selectedDateKey : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            setSelectedDateKey(val);
                            setFilterMode('specific_date');
                          }
                        }}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all appearance-none cursor-pointer pr-6 ${
                          filterMode === 'specific_date'
                            ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                        }`}
                        title="เลือกวันที่ต้องการดูจุดพิกัด"
                      >
                        <option value="" disabled className="text-slate-400 bg-white">
                          📅 เลือกวันที่...
                        </option>
                        {availableDates.map((item) => (
                          <option key={item.dateKey} value={item.dateKey} className="text-slate-800 bg-white">
                            วันที่ {item.thaiDate} ({item.count} จุด)
                          </option>
                        ))}
                      </select>
                      <span className={`pointer-events-none absolute right-2 text-[10px] ${
                        filterMode === 'specific_date' ? 'text-amber-200' : 'text-slate-400'
                      }`}>▾</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Space & SatMap Banner Shortcut */}
              <div
                onClick={() => setCurrentTab('satmap')}
                className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-3.5 py-2.5 rounded-2xl border border-emerald-900/60 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-500/80 transition-all group"
                title="คลิกเพื่อเปิดดูแผนที่ดาวเทียมเรียลไทม์ satmap.space"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Satellite className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        แผนที่ดาวเทียมเรียลไทม์ (satmap.space)
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
                        Live 24/7
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 hidden sm:block">
                      คลิกดูตำแหน่งและเส้นทางวงโคจรดาวเทียมที่ผ่านประเทศไทย (Globalstar, SPOT)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex-shrink-0">
                  <span>เปิดดูดาวเทียมผ่านไทย</span>
                  <span>→</span>
                </div>
              </div>

              {/* 4 Top KPI Metric Cards */}
              <MetricCards
                latest={latestRecord}
                activeRecord={selectedRecord || latestRecord}
                recordsCount={displayedRecords.length}
                filterBadge={
                  filterMode === 'live'
                    ? 'Live (สดล่าสุด)'
                    : filterMode === '1h'
                    ? '1 ชม. ล่าสุด (1H)'
                    : filterMode === '24h'
                    ? '24 ชม. ล่าสุด (24H)'
                    : filterMode === '7d'
                    ? '7 วันล่าสุด (7D)'
                    : filterMode === '1m'
                    ? '1 เดือนล่าสุด (1M)'
                    : filterMode === 'all'
                    ? 'ทั้งหมด (ทุกบรรทัด)'
                    : `วันที่ ${selectedDateThai}`
                }
              />

              {/* Middle Section: Map (Left) + Latest Details (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
                <div
                  id="tracking-map-container"
                  className="lg:col-span-8 flex flex-col min-h-[360px] sm:min-h-[460px] lg:min-h-[570px] h-full"
                >
                  <TrackingMap
                    records={displayedRecords}
                    latestRecord={latestRecord}
                    selectedRecord={selectedRecord}
                    onSelectRecord={handleSelectRecord}
                    selectedAssetFilter={selectedAssetFilter}
                    onSelectAssetFilter={handleAssetFilterChange}
                    dateBadgeText={
                      filterMode === 'live'
                        ? `● พิกัดสดล่าสุด Live (${displayedRecords.length} จุด • ${filterDateRangeText || ''})`
                        : filterMode === '1h'
                        ? `พิกัด 1 ชม. ล่าสุด (1H • ${displayedRecords.length} จุด)`
                        : filterMode === '24h'
                        ? `พิกัด 24 ชม. ล่าสุด (24H • ${displayedRecords.length} จุด)`
                        : filterMode === '7d'
                        ? `พิกัด 7 วันล่าสุด (7D • ${displayedRecords.length} จุด)`
                        : filterMode === '1m'
                        ? `พิกัด 1 เดือนล่าสุด (1M • ${displayedRecords.length} จุด)`
                        : filterMode === 'all'
                        ? `พิกัดทั้งหมด: อ่านทุกบรรทัด (${displayedRecords.length} จุด)`
                        : `วันที่ ${selectedDateThai} (${displayedRecords.length} จุด)`
                    }
                    className="flex-1 w-full h-full"
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col h-full">
                  <LatestDetailCard
                    latest={latestRecord}
                    activeRecord={selectedRecord || latestRecord}
                    onFocusOnMap={handleFocusActiveOnMap}
                    onResetToLatest={handleResetToLatest}
                  />
                </div>
              </div>

              {/* Bottom Section: Location History Table (Desktop Table + Mobile Cards) */}
              <HistoryTable
                records={displayedRecords}
                allRecordsCount={records.length}
                latestDateText={latestDateThai}
                filterMode={filterMode}
                onToggleFilterMode={(mode) => {
                  if (mode === 'all') {
                    handleSelectAllFilter();
                  } else {
                    setFilterMode(mode);
                  }
                }}
                availableDates={availableDates}
                selectedDateKey={selectedDateKey}
                onSelectDateKey={(k) => setSelectedDateKey(k)}
                selectedRecord={selectedRecord}
                onSelectRecord={handleSelectRecord}
                selectedAssetFilter={selectedAssetFilter}
                onSelectAssetFilter={handleAssetFilterChange}
                kkoz01Count={kkoz01Count}
                kkoz02Count={kkoz02Count}
              />
            </div>
          )}

          {/* Tab 2: Fullscreen Tracking Map */}
          {currentTab === 'map' && (
            <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] w-full flex flex-col space-y-2 sm:space-y-3">
              <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      แผนที่ติดตามการบิน
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
                      ({displayedRecords.length} จุด{' '}
                      {filterMode === 'live'
                        ? '• Live สดล่าสุด'
                        : filterMode === '1h'
                        ? '• 1 ชม. ล่าสุด (1H)'
                        : filterMode === '24h'
                        ? '• 24 ชม. ล่าสุด (24H)'
                        : filterMode === '7d'
                        ? '• 7 วันล่าสุด (7D)'
                        : filterMode === '1m'
                        ? '• 1 เดือนล่าสุด (1M)'
                        : filterMode === 'all'
                        ? '• ทั้งหมดทุกวัน (อ่านทุกบรรทัด)'
                        : `• วันที่ ${selectedDateThai}`})
                    </span>
                  </div>

                  {/* Asset Switcher in Map Tab */}
                  <AssetSelector
                    selectedAsset={selectedAssetFilter}
                    onChange={handleAssetFilterChange}
                    kkoz01Count={kkoz01Count}
                    kkoz02Count={kkoz02Count}
                    totalCount={records.length}
                    compact
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-medium">
                  {/* Live Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('live')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      filterMode === 'live'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดสดล่าสุดแบบเรียลไทม์ (Live)"
                  >
                    <span className={`w-2 h-2 rounded-full ${filterMode === 'live' ? 'bg-emerald-300 animate-pulse' : 'bg-emerald-500'}`}></span>
                    <span>Live</span>
                  </button>

                  {/* 1H Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('1h')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '1h'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 1 ชั่วโมง (1H)"
                  >
                    <span>1H</span>
                  </button>

                  {/* 24H Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('24h')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '24h'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 24 ชั่วโมง (24H)"
                  >
                    <span>24H</span>
                  </button>

                  {/* 7D Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('7d')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '7d'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 7 วัน (7D)"
                  >
                    <span>7D</span>
                  </button>

                  {/* 1M Button */}
                  <button
                    type="button"
                    onClick={() => setFilterMode('1m')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === '1m'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัดย้อนหลัง 1 เดือน (1M)"
                  >
                    <span>1M</span>
                  </button>

                  {/* All Button */}
                  <button
                    type="button"
                    onClick={handleSelectAllFilter}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === 'all'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="อ่านค่าทั้งหมดทุกบรรทัดใน Google Sheet"
                  >
                    <span>ทั้งหมด</span>
                  </button>

                  {/* Dropdown to pick date */}
                  {availableDates.length > 0 && (
                    <div className="relative flex items-center">
                      <select
                        value={filterMode === 'specific_date' ? selectedDateKey : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            setSelectedDateKey(val);
                            setFilterMode('specific_date');
                          }
                        }}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all appearance-none cursor-pointer pr-6 ${
                          filterMode === 'specific_date'
                            ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                        }`}
                        title="เลือกวันที่ต้องการดูจุดพิกัด"
                      >
                        <option value="" disabled className="text-slate-400 bg-white">
                          📅 เลือกวันที่...
                        </option>
                        {availableDates.map((item) => (
                          <option key={item.dateKey} value={item.dateKey} className="text-slate-800 bg-white">
                            วันที่ {item.thaiDate} ({item.count} จุด)
                          </option>
                        ))}
                      </select>
                      <span className={`pointer-events-none absolute right-2 text-[10px] ${
                        filterMode === 'specific_date' ? 'text-amber-200' : 'text-slate-400'
                      }`}>▾</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <TrackingMap
                  records={displayedRecords}
                  latestRecord={latestRecord}
                  selectedRecord={selectedRecord}
                  onSelectRecord={handleSelectRecord}
                  selectedAssetFilter={selectedAssetFilter}
                  onSelectAssetFilter={handleAssetFilterChange}
                  dateBadgeText={
                    filterMode === 'live'
                      ? `● พิกัดสดล่าสุด Live (${displayedRecords.length} จุด • ${filterDateRangeText || ''})`
                      : filterMode === '1h'
                      ? `พิกัด 1 ชม. ล่าสุด (1H • ${displayedRecords.length} จุด)`
                      : filterMode === '24h'
                      ? `พิกัด 24 ชม. ล่าสุด (24H • ${displayedRecords.length} จุด)`
                      : filterMode === '7d'
                      ? `พิกัด 7 วันล่าสุด (7D • ${displayedRecords.length} จุด)`
                      : filterMode === '1m'
                      ? `พิกัด 1 เดือนล่าสุด (1M • ${displayedRecords.length} จุด)`
                      : filterMode === 'all'
                      ? `พิกัดทั้งหมด: อ่านทุกบรรทัด (${displayedRecords.length} จุด)`
                      : `วันที่ ${selectedDateThai} (${displayedRecords.length} จุด)`
                  }
                  className="h-full"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Species Information & Ecology */}
          {currentTab === 'species' && (
            <div className="max-w-7xl mx-auto">
              <SpeciesInfoView />
            </div>
          )}

          {/* Tab 5: SatMap Space & Satellites Passing Over Thailand */}
          {currentTab === 'satmap' && (
            <div className="max-w-7xl mx-auto">
              <SatMapView />
            </div>
          )}

          {/* Tab 6: Complete User Manual & Documentation */}
          {currentTab === 'manual' && (
            <div className="max-w-7xl mx-auto">
              <UserManualView />
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1.5 flex items-center justify-around z-40 shadow-lg safe-area-bottom">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
              currentTab === 'dashboard'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>หน้าหลัก</span>
          </button>

          <button
            onClick={() => setCurrentTab('map')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
              currentTab === 'map'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>แผนที่</span>
          </button>

          <button
            onClick={() => setCurrentTab('satmap')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
              currentTab === 'satmap'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Satellite className="w-5 h-5" />
            <span>ดาวเทียม</span>
          </button>

          <button
            onClick={() => setCurrentTab('species')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
              currentTab === 'species'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Feather className="w-5 h-5" />
            <span>นกกาฮัง</span>
          </button>

          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-medium text-slate-500 hover:text-slate-900 transition-all"
            title="เปิดเมนูและข้อมูลภาคี"
          >
            <Menu className="w-5 h-5" />
            <span>เมนู</span>
          </button>
        </nav>
      </div>

      {/* Google Sheet Source Configuration Modal */}
      <GoogleSheetSourceModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        config={sheetSourceConfig}
        currentRecordCount={records.length}
        onApplyConfig={handleApplySheetConfig}
      />
    </div>
  );
}
