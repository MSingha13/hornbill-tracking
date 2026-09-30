/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TrackingMap } from './components/TrackingMap';
import { LatestDetailCard } from './components/LatestDetailCard';
import { HistoryTable } from './components/HistoryTable';
import { ReportsView } from './components/ReportsView';
import { SpeciesInfoView } from './components/SpeciesInfoView';
import { TrackingRecord, TrackingApiResponse } from './types/tracking';
import { exportToCSV, formatThaiDateTime } from './utils/formatters';
import { API_ENDPOINT, SCRIPT_UPDATE_ACTION } from './assets/assets';
import { Home, Map, Feather, AlertCircle, CheckCircle2, Menu } from 'lucide-react';

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
            message: `สั่งการ Google Apps Script (updateSportdata) สำเร็จ! ข้อมูลดาวเทียมอัปเดตลงตารางแล้ว (รวม ${count} จุด)`,
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

  // Initial load once on component mount
  useEffect(() => {
    fetchData();
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
              {/* 4 Top KPI Metric Cards */}
              <MetricCards
                latest={latestRecord}
                activeRecord={selectedRecord || latestRecord}
                recordsCount={records.length}
              />

              {/* Middle Section: Map (Left) + Latest Details (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
                <div
                  id="tracking-map-container"
                  className="lg:col-span-8 flex flex-col min-h-[360px] sm:min-h-[460px] lg:min-h-[570px] h-full"
                >
                  <TrackingMap
                    records={records}
                    latestRecord={latestRecord}
                    selectedRecord={selectedRecord}
                    onSelectRecord={handleSelectRecord}
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
                records={records}
                selectedRecord={selectedRecord}
                onSelectRecord={handleSelectRecord}
                onExportCSV={handleExportCSV}
              />
            </div>
          )}

          {/* Tab 2: Fullscreen Tracking Map */}
          {currentTab === 'map' && (
            <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] w-full flex flex-col space-y-2 sm:space-y-3">
              <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    แผนที่ติดตามการบิน
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
                    ({records.length} จุด)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  คลิกที่จุดเพื่อดูรายละเอียด หรือกด &quot;เล่นเส้นทางบิน&quot; บนแผนที่
                </div>
              </div>
              <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <TrackingMap
                  records={records}
                  latestRecord={latestRecord}
                  selectedRecord={selectedRecord}
                  onSelectRecord={(r) => setSelectedRecord(r)}
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
