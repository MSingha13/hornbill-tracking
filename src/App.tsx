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
import { ReportsView } from './components/ReportsView';
import { SpeciesInfoView } from './components/SpeciesInfoView';
import { TrackingRecord, TrackingApiResponse } from './types/tracking';
import { exportToCSV, formatThaiDateTime, formatThaiDate, getRecordDateKey } from './utils/formatters';
import { API_ENDPOINT, SCRIPT_UPDATE_ACTION } from './assets/assets';
import { Home, Map, Feather, AlertCircle, CheckCircle2, Menu, Calendar } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [records, setRecords] = useState<TrackingRecord[]>([]);
  const [latestRecord, setLatestRecord] = useState<TrackingRecord | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filter mode: default to 'five_days' as requested ("ให้แสดง จุด 5 วันล่าสุด")
  const [filterMode, setFilterMode] = useState<'five_days' | 'latest_day' | 'specific_date'>('five_days');
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');

  // Identify the latest recorded date key (YYYY-MM-DD)
  const latestDateKey = useMemo(() => {
    if (!latestRecord && records.length === 0) return '';
    return getRecordDateKey(latestRecord || records[0]);
  }, [latestRecord, records]);

  // Thai formatted string for the latest date (e.g. 30 ก.ย. 2569)
  const latestDateThai = useMemo(() => {
    if (!latestRecord && records.length === 0) return '';
    return formatThaiDate(latestRecord || records[0]);
  }, [latestRecord, records]);

  // List of all unique recorded dates with Thai label and point count
  const availableDates: AvailableDateOption[] = useMemo(() => {
    if (!records || records.length === 0) return [];
    const dateMap: Record<string, AvailableDateOption> = {};
    records.forEach((r) => {
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
  }, [records]);

  // Formatted Thai string for selected date
  const selectedDateThai = useMemo(() => {
    const found = availableDates.find((d) => d.dateKey === selectedDateKey);
    return found ? found.thaiDate : latestDateThai;
  }, [availableDates, selectedDateKey, latestDateThai]);

  // Date range string for 5 latest days
  const fiveDaysDateRangeText = useMemo(() => {
    if (!records || records.length === 0) return '';
    const uniqueDates = Array.from(
      new Set(records.map((r) => getRecordDateKey(r)).filter(Boolean))
    ).sort((a, b) => b.localeCompare(a));
    const targetDates = uniqueDates.slice(0, 5);
    if (targetDates.length === 0) return '';
    if (targetDates.length === 1) {
      const sample = records.find((r) => getRecordDateKey(r) === targetDates[0]);
      return formatThaiDate(sample);
    }
    const newestSample = records.find((r) => getRecordDateKey(r) === targetDates[0]);
    const oldestSample = records.find((r) => getRecordDateKey(r) === targetDates[targetDates.length - 1]);
    return `${formatThaiDate(oldestSample)} - ${formatThaiDate(newestSample)}`;
  }, [records]);

  // Points filtered: 5 latest days by default, or latest day, or user-selected specific date
  const displayedRecords = useMemo(() => {
    if (filterMode === 'five_days') {
      if (!records || records.length === 0) return [];
      const uniqueDates = Array.from(
        new Set(records.map((r) => getRecordDateKey(r)).filter(Boolean))
      ).sort((a, b) => b.localeCompare(a));
      const targetDates = new Set(uniqueDates.slice(0, 5));
      return records.filter((r) => targetDates.has(getRecordDateKey(r)));
    }
    if (filterMode === 'latest_day' && latestDateKey) {
      return records.filter((r) => getRecordDateKey(r) === latestDateKey);
    }
    if (filterMode === 'specific_date') {
      const targetKey = selectedDateKey || latestDateKey;
      return records.filter((r) => getRecordDateKey(r) === targetKey);
    }
    return records;
  }, [records, filterMode, latestDateKey, selectedDateKey]);

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

  // Fetch tracking data: triggers updateSportdata in Google Apps Script Sheet
  const fetchData = useCallback(async (isManualTrigger = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Calls Google Apps Script Web App with action=updateSportdata to pull fresh satellite data
      const url = `${API_ENDPOINT}?action=${SCRIPT_UPDATE_ACTION}&_t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TrackingApiResponse = await response.json();

      if (data && data.success) {
        setRecords(data.records || []);
        setLatestRecord(data.latest || (data.records && data.records[0]));
        setLastUpdated(new Date());

        if (isManualTrigger) {
          const count = data.records?.length || 0;
          setSyncStatus({
            type: 'success',
            message: `อัปเดตข้อมูลพิกัดดาวเทียมล่าสุดเรียบร้อยแล้ว (พบข้อมูล ${count} จุด)`,
          });
          setTimeout(() => {
            setSyncStatus(null);
          }, 5000);
        }
      } else {
        throw new Error(data?.message || 'ไม่สามารถดึงข้อมูลจากสัญญาณ GlobalStar ได้');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      console.warn('Signal fetch issue:', err);
      setError(`ไม่สามารถเชื่อมต่อสัญญาณดาวเทียมได้ (${msg}) กรุณากดลองใหม่`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and periodic background sync (in sync with ScriptApp 1-hour trigger)
  useEffect(() => {
    fetchData();

    const intervalId = window.setInterval(() => {
      fetchData(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleExportCSV = () => {
    exportToCSV(records, `hornbill-tracking-${latestRecord?.assetId || 'KKOZ01'}.csv`);
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
              {/* Quick Date Filter Selector Bar */}
              <div className="bg-white p-3 sm:px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>การแสดงผลพิกัด:</span>
                  </span>
                  {filterMode === 'five_days' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      จุด 5 วันล่าสุด ({fiveDaysDateRangeText || '-'} • {displayedRecords.length} จุด)
                    </span>
                  ) : filterMode === 'latest_day' ? (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      เฉพาะวันล่าสุด ({latestDateThai || '-'} • {displayedRecords.length} จุด)
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
                      วันที่เลือก: {selectedDateThai || '-'} ({displayedRecords.length} จุด)
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setFilterMode('five_days')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      filterMode === 'five_days'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัด 5 วันล่าสุด"
                  >
                    <span>5 วันล่าสุด</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('latest_day')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      filterMode === 'latest_day'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงเฉพาะพิกัดวันล่าสุด"
                  >
                    <span>เฉพาะวันล่าสุด</span>
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

              {/* 4 Top KPI Metric Cards */}
              <MetricCards
                latest={latestRecord}
                activeRecord={selectedRecord || latestRecord}
                recordsCount={displayedRecords.length}
                filterBadge={
                  filterMode === 'five_days'
                    ? '5 วันล่าสุด'
                    : filterMode === 'latest_day'
                    ? 'วันล่าสุด'
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
                    dateBadgeText={
                      filterMode === 'five_days'
                        ? `จุด 5 วันล่าสุด: ${fiveDaysDateRangeText || ''} (${displayedRecords.length} จุด)`
                        : filterMode === 'latest_day'
                        ? `เฉพาะวันล่าสุด: ${latestDateThai} (${displayedRecords.length} จุด)`
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
                onToggleFilterMode={(mode) => setFilterMode(mode)}
                availableDates={availableDates}
                selectedDateKey={selectedDateKey}
                onSelectDateKey={(k) => setSelectedDateKey(k)}
                selectedRecord={selectedRecord}
                onSelectRecord={handleSelectRecord}
                onExportCSV={handleExportCSV}
                onRefresh={() => fetchData(true)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Tab 2: Fullscreen Tracking Map */}
          {currentTab === 'map' && (
            <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] w-full flex flex-col space-y-2 sm:space-y-3">
              <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    แผนที่ติดตามการบิน
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
                    ({displayedRecords.length} จุด{' '}
                    {filterMode === 'five_days'
                      ? '• 5 วันล่าสุด'
                      : filterMode === 'latest_day'
                      ? `• เฉพาะวันล่าสุด ${latestDateThai}`
                      : `• วันที่ ${selectedDateThai}`})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setFilterMode('five_days')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === 'five_days'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงพิกัด 5 วันล่าสุด"
                  >
                    <span>5 วันล่าสุด</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('latest_day')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      filterMode === 'latest_day'
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="แสดงเฉพาะพิกัดวันล่าสุด"
                  >
                    <span>เฉพาะวันล่าสุด</span>
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
                  dateBadgeText={
                    filterMode === 'five_days'
                      ? `จุด 5 วันล่าสุด: ${fiveDaysDateRangeText || ''} (${displayedRecords.length} จุด)`
                      : filterMode === 'latest_day'
                      ? `เฉพาะวันล่าสุด: ${latestDateThai} (${displayedRecords.length} จุด)`
                      : `วันที่ ${selectedDateThai} (${displayedRecords.length} จุด)`
                  }
                  className="h-full"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Reports & Analytics */}
          {currentTab === 'reports' && (
            <div className="max-w-7xl mx-auto">
              <ReportsView records={records} latest={latestRecord} />
            </div>
          )}

          {/* Tab 4: Species Information & Ecology */}
          {currentTab === 'species' && (
            <div className="max-w-7xl mx-auto">
              <SpeciesInfoView />
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around z-40 shadow-lg safe-area-bottom">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
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
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
              currentTab === 'map'
                ? 'text-emerald-800 font-bold bg-emerald-50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>แผนที่</span>
          </button>

          <button
            onClick={() => setCurrentTab('species')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
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
            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-medium text-slate-500 hover:text-slate-900 transition-all"
            title="เปิดเมนูและข้อมูลภาคี"
          >
            <Menu className="w-5 h-5" />
            <span>เมนู</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
