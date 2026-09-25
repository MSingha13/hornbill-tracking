import React, { useState } from 'react';
import { X, Copy, Check, Github, ExternalLink, Terminal, Globe, Rocket, Sparkles } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('msingha13');
  const [repoName, setRepoName] = useState('hornbill-tracking');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${username}/${repoName}.git`;

  const commands = [
    {
      title: '1. เริ่มต้น Git Repository',
      cmd: `git init\ngit add .\ngit commit -m "feat: ระบบติดตามนกกกแบบเรียลไทม์"`,
    },
    {
      title: '2. เชื่อมโยงกับ GitHub Repository',
      cmd: `git branch -M main\ngit remote add origin ${repoUrl}`,
    },
    {
      title: '3. Push โค้ดทั้งหมดขึ้น GitHub',
      cmd: `git push -u origin main`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const fullScript = `# คำสั่งนำขึ้น GitHub สำหรับโปรเจกต์ Hornbill Tracking
git init
git add .
git commit -m "feat: hornbill tracking real-time dashboard"
git branch -M main
git remote add origin ${repoUrl}
git push -u origin main`;
    navigator.clipboard.writeText(fullScript);
    setCopiedIndex(99);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <Github className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                วิธีนำโปรเจกต์นี้ขึ้น GitHub & GitHub Pages
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                คำสั่งและขั้นตอนเปิดใช้งานเว็บออนไลน์ฟรี
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Config Inputs */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>กำหนดชื่อบัญชี GitHub เพื่อสร้างคำสั่งที่พร้อมใช้งานทันที</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">ชื่อผู้ใช้ GitHub (Username):</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim() || 'your-username')}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-500 font-mono"
                  placeholder="เช่น somchai-dev"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">ชื่อ Repository:</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value.trim() || 'hornbill-tracking')}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-500 font-mono"
                  placeholder="hornbill-tracking"
                />
              </div>
            </div>
          </div>

          {/* Step 1: Create repo online */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">
                1
              </span>
              <span>สร้าง Repository ใหม่บน GitHub</span>
            </div>
            <p className="text-xs text-slate-600 pl-7">
              เข้าไปที่เว็บ{' '}
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline font-semibold inline-flex items-center gap-1"
              >
                github.com/new <ExternalLink className="w-3 h-3" />
              </a>{' '}
              และตั้งชื่อ Repository เป็น <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">{repoName}</code>
            </p>
          </div>

          {/* Step 2: Push commands */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>รันคำสั่งใน Terminal เพื่อ Push โค้ด</span>
              </div>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-800 text-amber-300 hover:bg-slate-900 rounded-lg transition-colors"
              >
                {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 99 ? 'คัดลอกทั้งหมดแล้ว!' : 'คัดลอกคำสั่งทั้งหมด'}</span>
              </button>
            </div>

            <div className="space-y-2.5 pl-7">
              {commands.map((c, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-slate-200 border border-slate-800 relative group">
                  <div className="text-[11px] text-slate-400 mb-1.5 font-sans font-medium flex items-center justify-between">
                    <span>{c.title}</span>
                    <button
                      onClick={() => handleCopy(c.cmd, idx)}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title="คัดลอกคำสั่ง"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-emerald-300 whitespace-pre-wrap">{c.cmd}</pre>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: GitHub Pages Workflow */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">
                3
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                เปิดใช้งานเว็บไซต์ออนไลน์ฟรี (GitHub Pages)
              </span>
            </div>
            <div className="pl-7 text-xs text-slate-600 space-y-2">
              <p>
                โปรเจกต์นี้มีไฟล์ <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">.github/workflows/deploy.yml</code> ติดตั้งพร้อมแล้ว!
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <div className="font-semibold text-slate-800">ขั้นตอนเปิดเว็บ:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>ไปที่แท็บ <strong>Settings</strong> ใน GitHub Repo ของคุณ</li>
                  <li>คลิกเมนู <strong>Pages</strong> ทางซ้ายมือ</li>
                  <li>ใต้หัวข้อ <strong>Build and deployment</strong> ให้เลือก Source เป็น: <strong className="text-emerald-700">GitHub Actions</strong></li>
                  <li>รอประมาณ 1-2 นาที เว็บไซต์จะออนไลน์อัตโนมัติที่ URL:</li>
                </ol>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-emerald-700 font-medium">
                  https://{username}.github.io/{repoName}/
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ดูรายละเอียดเพิ่มเติมในไฟล์ <code className="font-mono text-slate-700 font-bold">README.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
