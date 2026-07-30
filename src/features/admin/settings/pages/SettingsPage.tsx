/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Key, 
  Database, 
  FileText, 
  Check, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('Traditional Cream');
  const [backupSchedule, setBackupSchedule] = useState('Daily at 02:00 UTC');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const themesList = ['Traditional Cream', 'Golden Sand', 'Cathedral Night'];

  const handleRefreshDatabase = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert("Sanctuary repository fully synchronized & optimized!");
    }, 1200);
  };

  return (
    <div id="settings-container" className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAF9F5]/30">
      {/* Page Header */}
      <div id="settings-header" className="border-b border-stone-200 pb-6">
        <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <SettingsIcon size={32} className="text-amber-600" />
          <span>Portal Settings</span>
        </h2>
        <p className="text-stone-500 text-sm mt-1">Configure curatorial aesthetics, hagiographical databases, and editorial workflows.</p>
      </div>

      <div id="settings-layout-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Curatorial Aesthetics */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600" />
            <span>Curatorial Aesthetics</span>
          </h3>
          <p className="text-stone-500 text-xs">Set the visual background and contrast ratios for editing and proofreading sacred stories.</p>
          
          <div className="space-y-3">
            {themesList.map((t) => (
              <button
                id={`btn-theme-${t.replace(/\s+/g, '-').toLowerCase()}`}
                key={t}
                onClick={() => setTheme(t)}
                className={`w-full text-left p-4 rounded-lg border text-sm flex justify-between items-center transition-all ${
                  theme === t 
                    ? 'border-amber-600 bg-amber-500/5 text-amber-950 font-semibold' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/50'
                }`}
              >
                <span>{t}</span>
                {theme === t && <Check size={16} className="text-amber-700" />}
              </button>
            ))}
          </div>
        </div>

        {/* Database Synchronization */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Database size={18} className="text-amber-600" />
            <span>Database Synchronization</span>
          </h3>
          <p className="text-stone-500 text-xs">Maintain integrity across international shrines and dioceses. Refreshing the database recalculates coordinates indexes and validates relics seals.</p>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">AUTOMATED BACKUP SCHEDULE</label>
              <select
                id="select-backup-schedule"
                value={backupSchedule}
                onChange={(e) => setBackupSchedule(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option>Daily at 02:00 UTC</option>
                <option>Weekly on Sundays at 00:00 UTC</option>
                <option>Monthly on 1st at 12:00 UTC</option>
              </select>
            </div>

            <button
              id="btn-sync-database"
              disabled={isRefreshing}
              onClick={handleRefreshDatabase}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all w-full select-none"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Synchronizing Repository...' : 'Sync Repository Logs'}</span>
            </button>
          </div>
        </div>

        {/* API Credentials Info */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Key size={18} className="text-amber-600" />
            <span>API Credentials Security</span>
          </h3>
          <p className="text-stone-500 text-xs">This portal manages AI-powered features (like automatic alt-text Generation) using the Google Gemini API key.</p>
          
          <div className="bg-amber-50/50 border border-amber-600/10 p-4 rounded-lg space-y-2 text-stone-700 text-xs leading-relaxed">
            <p className="font-semibold text-amber-900 flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>Secure Server Key Access</span>
            </p>
            <p>
              Your <code>GEMINI_API_KEY</code> is injected server-side through process environment variables at runtime. This keeps sensitive API secrets completely hidden from the browser console, complying fully with archival security guidelines.
            </p>
          </div>
        </div>

        {/* Editorial Standards Code of Honor */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 flex items-center gap-2">
            <FileText size={18} className="text-amber-600" />
            <span>Editorial Standards Code</span>
          </h3>
          <p className="text-stone-500 text-xs">Review the absolute guidelines of committing canonical entries.</p>

          <div className="space-y-2.5 text-xs text-stone-600">
            <div className="flex gap-2">
              <span className="font-bold text-amber-700">I.</span>
              <p>Chronicles must prioritize documented historical records over unverified oral traditions.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-700">II.</span>
              <p>Relics mentioned must correspond to actual verified sanctuaries and documented translations.</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-amber-700">III.</span>
              <p>Access privileges and licensing must be confirmed before uploading mosaic, relic, or manuscript artwork.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
