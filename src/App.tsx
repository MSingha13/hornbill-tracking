/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TrackingMap } from './components/TrackingMap';
import { LatestDetailCard } from './components/LatestDetailCard';
import { HistoryTable } from './components/HistoryTable';
import { ReportsView } from './components/ReportsView';
import { SpeciesInfoView } from './components/SpeciesInfoView';
import { GitHubModal } from './components/GitHubModal';
import { TrackingRecord, TrackingApiResponse } from './types/tracking';
import { exportToCSV, formatThaiDateTime } from './utils/formatters';
import { THAI_PARKS_DEMO_DATA } from './data/mockThaiData';
import { API_ENDPOINT } from './assets/assets';
import { Home, Map, BarChart3, Feather, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [records, setRecords] = useState<TrackingRecord[]>([]);
  const [latestRecord, setLatestRecord] = useState<TrackingRecord | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<number>(30);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // Fetch tracking data from Google Apps Script API
  const fetchData = useCallback(async (useDemo = isDemoMode) => {
    setIsLoading(true);
    setError(null);

    if (useDemo) {
      setTimeout(() => {
        setRecords(THAI_PARKS_DEMO_DATA.records);
        setLatestRecord(THAI_PARKS_DEMO_DATA.latest);
        setIsLoading(false);
        setLastUpdated(new Date());
        setAutoRefreshCountdown(30);
      }, 400);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
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
      } else {
        throw new Error(data.message || 'ไม่สามารถดึงข้อมูลจาก API ได้');
      }
    } catch (err) {
      console.warn('API fetch issue, using fallback data:', err);
      setError('ไม่สามารถเชื่อมต่อ Google Apps Script ชั่วคราว ใช้ข้อมูลสำรอง');
      // If error occurs, fall back gracefully
      setRecords(THAI_PARKS_DEMO_DATA.records);
      setLatestRecord(THAI_PARKS_DEMO_DATA.latest);
    } finally {
      setIsLoading(false);
      setAutoRefreshCountdown(30);
    }
  }, [isDemoMode]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh timer (every second tick, countdown from 30)
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchData();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchData]);

  const handleToggleDemoMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    fetchData(nextMode);
  };

  const handleExportCSV = () => {
    exportToCSV(records, `hornbill-tracking-${latestRecord?.assetId || 'KKOZ01'}.csv`);
  };

  const handleFocusOnMap = () => {
    if (latestRecord) {
      setSelectedRecord(latestRecord);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f5] text-slate-800 overflow-hidden font-['Prompt']">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onRefresh={() => fetchData()}
          isLoading={isLoading}
          onExportCSV={handleExportCSV}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          lastUpdatedTime={formatThaiDateTime(lastUpdated.toISOString())}
          isDemoMode={isDemoMode}
          onToggleDemoMode={handleToggleDemoMode}
          autoRefreshCountdown={autoRefreshCountdown}
        />

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-20 lg:pb-6">
          {/* Error Banner if any */}
          {error && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => fetchData()}
                className="underline hover:text-amber-950 font-semibold"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Tab 1: Dashboard (Matches exact Mockup) */}
          {currentTab === 'dashboard' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              {/* 4 Top KPI Metric Cards */}
              <MetricCards latest={latestRecord} recordsCount={records.length} />

              {/* Middle Section: Map (Left) + Latest Details (Right) - Equal Height Stretched */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-8 flex flex-col min-h-[500px] lg:min-h-[570px] h-full">
                  <TrackingMap
                    records={records}
                    latestRecord={latestRecord}
                    selectedRecord={selectedRecord}
                    onSelectRecord={(r) => setSelectedRecord(r)}
                    className="flex-1 w-full h-full"
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col h-full">
                  <LatestDetailCard
                    latest={latestRecord}
                    onFocusOnMap={handleFocusOnMap}
                  />
                </div>
              </div>

              {/* Bottom Section: Location History Table */}
              <HistoryTable
                records={records}
                selectedRecord={selectedRecord}
                onSelectRecord={(r) => setSelectedRecord(r)}
                onExportCSV={handleExportCSV}
              />
            </div>
          )}

          {/* Tab 2: Fullscreen Tracking Map */}
          {currentTab === 'map' && (
            <div className="h-[calc(100vh-140px)] w-full flex flex-col space-y-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-800">
                    แผนที่จำลองการบินแบบเต็มจอ
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    (แสดง {records.length} จุดพิกัด)
                  </span>
                </div>
                <div className="text-xs text-slate-600">
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around z-40 shadow-lg">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              currentTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>หน้าหลัก</span>
          </button>
          <button
            onClick={() => setCurrentTab('map')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              currentTab === 'map' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>แผนที่</span>
          </button>
          <button
            onClick={() => setCurrentTab('reports')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              currentTab === 'reports' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>รายงาน</span>
          </button>
          <button
            onClick={() => setCurrentTab('species')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              currentTab === 'species' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Feather className="w-5 h-5" />
            <span>นกกก</span>
          </button>
        </nav>
      </div>

      {/* GitHub Deployment Instructions Modal */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
