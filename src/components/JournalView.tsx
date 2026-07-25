import React, { useState } from 'react';
import { PlantProduct, CareLogEntry } from '../types';
import { AddLogModal } from './AddLogModal';
import { Heart, Droplet, Sun, Wind, Plus, Sparkles, Camera, CheckCircle } from 'lucide-react';

interface JournalViewProps {
  plant: PlantProduct;
  careLogs: CareLogEntry[];
  expertTips: string[];
  onAddCareLog: (log: CareLogEntry) => void;
  onWaterPlant: (plantId: string) => void;
  onFertilizePlant: (plantId: string) => void;
  onUpdatePlantStatus: (plantId: string, status: 'Thriving' | 'Needs Water' | 'Dormant' | 'Repotted') => void;
  onBackToStore: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  plant,
  careLogs,
  expertTips,
  onAddCareLog,
  onWaterPlant,
  onFertilizePlant,
  onUpdatePlantStatus,
  onBackToStore,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);
  const [aiTipResponse, setAiTipResponse] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoToast, setPhotoToast] = useState<string | null>(null);

  const care = plant.careDetails || {
    wateringIntervalDays: 7,
    daysUntilWatering: 3,
    fertilizeIntervalDays: 30,
    daysUntilFertilize: 12,
    lightLevel: 'Bright Indirect',
    humidity: '60–80%',
    temperature: '24°C',
    soilMoisturePercent: 42,
    status: 'Thriving' as const,
  };

  const filteredLogs = activeFilterTag
    ? careLogs.filter((l) => l.tagType.toLowerCase() === activeFilterTag.toLowerCase())
    : careLogs;

  const handleSimulatePhotoSnapshot = () => {
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setPhotoToast(`AI Scan Complete: ${plant.name} foliage shows 98% health with pristine fenestrations!`);
      setTimeout(() => setPhotoToast(null), 4000);
    }, 1200);
  };

  const handleAskAIAdvice = () => {
    setAiTipResponse(
      `AI Botanist Tip for ${plant.name}: Keep humidity above 60% during dry seasons. Wipe foliage monthly with dilute neem oil to protect against dust and spider mites!`
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 mb-28">
      {/* Toast Alert for Photo Scanner */}
      {photoToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1a1c1c] text-white text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{photoToast}</span>
        </div>
      )}

      {/* Hero Section: Plant Photo & Basic Status */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10">
        {/* Plant Image Container */}
        <div className="relative group aspect-[4/5] max-h-[500px] rounded-2xl overflow-hidden shadow-sm border border-[#e2e2e2]">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => {
                const statuses: Array<'Thriving' | 'Needs Water' | 'Dormant' | 'Repotted'> = [
                  'Thriving',
                  'Needs Water',
                  'Dormant',
                  'Repotted',
                ];
                const currentIndex = statuses.indexOf(care.status);
                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                onUpdatePlantStatus(plant.id, nextStatus);
              }}
              className="bg-[#b80049] hover:bg-[#e2165f] px-3.5 py-1.5 rounded-full font-bold text-xs text-white shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Click to toggle status"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{care.status}</span>
            </button>
          </div>
        </div>

        {/* Header Info & Care Schedule */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-[#5f5e5e] font-bold text-xs uppercase tracking-wider mb-1">
              {plant.family || 'BOTANICAL FAMILY'}
            </p>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#1a1c1c] mb-2">{plant.name}</h2>
            <p className="text-[#5f5e5e] text-sm leading-relaxed">{plant.description}</p>
          </div>

          {/* Care Schedule Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Watering Card */}
            <div className="bg-[#f3f3f3] p-4 rounded-xl border border-[#e4bdc2]/60 flex items-center justify-between gap-3 hover:border-[#b80049]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#e2165f] text-white p-2.5 rounded-full shadow-xs">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider">Watering</p>
                  <p className="font-bold text-lg text-[#1a1c1c]">{care.daysUntilWatering} days left</p>
                </div>
              </div>
              <button
                onClick={() => onWaterPlant(plant.id)}
                className="text-[11px] font-bold text-white bg-[#b80049] hover:bg-[#e2165f] px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Water
              </button>
            </div>

            {/* Fertilizer Card */}
            <div className="bg-[#f3f3f3] p-4 rounded-xl border border-[#e4bdc2]/60 flex items-center justify-between gap-3 hover:border-[#006b1b]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e862d] text-white p-2.5 rounded-full shadow-xs">
                  <span className="material-symbols-outlined text-xl">nutrition</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider">Fertilize</p>
                  <p className="font-bold text-lg text-[#1a1c1c]">{care.daysUntilFertilize} days left</p>
                </div>
              </div>
              <button
                onClick={() => onFertilizePlant(plant.id)}
                className="text-[11px] font-bold text-white bg-[#006b1b] hover:bg-[#1e862d] px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Feed
              </button>
            </div>

            {/* Light Card */}
            <div className="bg-[#f3f3f3] p-4 rounded-xl border border-[#e4bdc2]/60 flex items-center gap-3">
              <div className="bg-[#e2dfde] text-[#636262] p-2.5 rounded-full">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider">Light Level</p>
                <p className="font-bold text-base text-[#1a1c1c]">{care.lightLevel}</p>
              </div>
            </div>

            {/* Humidity Card */}
            <div className="bg-[#f3f3f3] p-4 rounded-xl border border-[#e4bdc2]/60 flex items-center gap-3">
              <div className="bg-[#e2e2e2] text-[#b80049] p-2.5 rounded-full">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider">Humidity</p>
                <p className="font-bold text-base text-[#1a1c1c]">{care.humidity}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-[#b80049] hover:bg-[#e2165f] text-white font-bold text-sm py-3.5 px-8 rounded-full hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Log Entry
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area: Journal & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chronological Care Log */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-[#1a1c1c]">Care Log History</h3>
            <div className="flex items-center gap-2">
              {['All', 'Note', 'Action', 'Nutrition'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilterTag(tag === 'All' ? null : tag)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    (tag === 'All' && !activeFilterTag) || activeFilterTag === tag
                      ? 'bg-[#b80049] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-xl border border-gray-200 text-xs text-gray-500">
                No log entries found for this category.
              </div>
            ) : (
              filteredLogs.map((log) => {
                let badgeBg = 'bg-[#e8e8e8] text-[#5f5e5e]';
                let circleBg = 'bg-[#e2dfde] text-[#5f5e5e]';

                if (log.tagType === 'Action') {
                  badgeBg = 'bg-[#e2165f]/20 text-[#b80049]';
                  circleBg = 'bg-[#ffd9de] text-[#b80049]';
                } else if (log.tagType === 'Nutrition') {
                  badgeBg = 'bg-[#1e862d]/20 text-[#006b1b]';
                  circleBg = 'bg-[#94f990] text-[#002204]';
                }

                return (
                  <div
                    key={log.id}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-[#e2e2e2] hover:border-[#b80049] transition-colors flex gap-4 shadow-2xs"
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full ${circleBg} flex items-center justify-center font-extrabold text-base`}
                      >
                        {log.dateDay}
                      </div>
                      <span className="text-[10px] font-bold text-[#5f5e5e] mt-1">{log.dateMonth}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-base text-[#1a1c1c]">{log.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${badgeBg}`}>
                          {log.tagType}
                        </span>
                      </div>
                      <p className="text-[#5b3f43] text-sm leading-relaxed">{log.content}</p>
                      {log.imageUrl && (
                        <img
                          src={log.imageUrl}
                          alt="Log Attachment"
                          className="mt-3 rounded-lg max-h-36 object-cover border border-gray-200"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Expert Tips Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#2f3131] text-[#f1f1f1] p-5 rounded-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb2be]">psychiatry</span>
                <h3 className="font-bold text-lg text-white">Expert Tips</h3>
              </div>
              <button
                onClick={handleAskAIAdvice}
                className="text-[10px] font-bold bg-[#b80049] hover:bg-[#e2165f] text-white px-2.5 py-1 rounded-full flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3 h-3" /> Ask AI
              </button>
            </div>

            {aiTipResponse && (
              <div className="mb-4 p-3 bg-pink-950/60 border border-pink-500/40 rounded-lg text-xs text-pink-200 animate-in fade-in">
                {aiTipResponse}
              </div>
            )}

            <ul className="space-y-3.5">
              {expertTips.map((tip, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="material-symbols-outlined text-[#ffb2be] shrink-0 text-lg mt-0.5">
                    tips_and_updates
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Environmental Monitoring Widget */}
          <div className="bg-white p-5 rounded-xl border border-[#e2e2e2]">
            <h4 className="text-xs font-bold text-[#5f5e5e] uppercase tracking-wider mb-4">
              Current Environment
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Temperature</span>
                  <span className="font-bold text-[#1a1c1c]">{care.temperature}</span>
                </div>
                <div className="h-2 bg-[#eeeeee] rounded-full overflow-hidden">
                  <div className="h-full bg-[#b80049] rounded-full w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Soil Moisture</span>
                  <span className="font-bold text-[#1a1c1c]">{care.soilMoisturePercent}%</span>
                </div>
                <div className="h-2 bg-[#eeeeee] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006b1b] rounded-full" style={{ width: `${care.soilMoisturePercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Photo Scanner) */}
      <button
        onClick={handleSimulatePhotoSnapshot}
        disabled={isAnalyzingPhoto}
        className="fixed right-6 bottom-24 bg-[#e2165f] text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 hover:bg-[#b80049] transition-all z-40 cursor-pointer border border-white/20"
        title="Take plant photo for health diagnosis"
      >
        <Camera className={`w-7 h-7 ${isAnalyzingPhoto ? 'animate-spin' : ''}`} />
      </button>

      {/* Modal Dialog */}
      <AddLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddLog={onAddCareLog}
        plantName={plant.name}
      />
    </main>
  );
};
