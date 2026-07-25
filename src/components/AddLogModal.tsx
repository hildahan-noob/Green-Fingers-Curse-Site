import React, { useState } from 'react';
import { X, Camera, Plus, Check } from 'lucide-react';
import { CareLogEntry } from '../types';

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (log: CareLogEntry) => void;
  plantName: string;
}

export const AddLogModal: React.FC<AddLogModalProps> = ({ isOpen, onClose, onAddLog, plantName }) => {
  const [title, setTitle] = useState('');
  const [tagType, setTagType] = useState<'Note' | 'Action' | 'Nutrition' | 'Pruning'>('Note');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dateDay = String(now.getDate()).padStart(2, '0');
    const dateMonth = months[now.getMonth()];
    const fullDate = now.toISOString().split('T')[0];

    const newLog: CareLogEntry = {
      id: `log-${Date.now()}`,
      plantId: 'monstera-deliciosa',
      dateDay,
      dateMonth,
      fullDate,
      title,
      tagType,
      content,
      imageUrl: imageUrl || undefined,
    };

    onAddLog(newLog);
    setTitle('');
    setContent('');
    setImageUrl('');
    onClose();
  };

  const samplePhotos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC4YJW7zH042kzXMkAxPOb1enVvgZn9EaU1-bIlJBm5IAWXG86Ib0PdkcLWKdr8rW8HVw4RByTBX9qsxct-DX3-qhtcHMIO1RBwJKHud5rst738KL6Z62NDJuIVktZUpR7tosAvoug3MNoGmQJoQ9CVfbkuuyMapL0ePYshsQO90DyvlBW3StoDmbiXOa1rZ7n-1eDq_XwsCQLGHIVzL7qtKNb66uf7ijuHBMh7vJY_ZdcZLtaHx1glmXf19k56jtMCC2btOyNkTdVL',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAIVHo26a2UpqWJJZ-N1GpbDlwYYvwe4JMPyisUjIA3KtfWh3F0kbC19lCwUeXJCuJfTrmpGhzP8ZGSwVyzfkJKyUOy4s9xATlbbN3_hI6jOzlm4F0ITwq7iGWbJsYnrAHtQ8wga-lErUMblWtPG6rxTmtigX-1EAK9FS9kCDA-YI5-Vohw_d8CacxDs4WJ_GAmW3OxElCUFkxBKRYD_9XOQQWxNSKwqKuDHXOFhnA59euPVWIPHEL-r67BtqaL4OrTU-VOI7J_U9dM',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1c1c] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#e4bdc2]">
        <div className="flex items-center justify-between p-4 border-b border-[#e2e2e2] bg-[#f9f9f9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b80049]">edit_note</span>
            <h3 className="font-bold text-lg text-[#1a1c1c]">New Care Log for {plantName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Log Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Growth Update, Deep Watering, Repotting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b80049] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Category Tag
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Note', 'Action', 'Nutrition', 'Pruning'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagType(tag)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    tagType === tag
                      ? 'bg-[#b80049] text-white border-[#b80049]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Observations & Notes
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe soil condition, leaf health, new growth, or fertilization details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#b80049] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Attach Photo (Optional)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="url"
                placeholder="Paste image URL or pick sample below"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => setImageUrl(samplePhotos[0])}
                className="px-2.5 py-1.5 bg-gray-100 text-xs font-semibold rounded-lg hover:bg-gray-200 text-gray-700 flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" /> Sample
              </button>
            </div>
            {imageUrl && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={imageUrl} alt="Attached Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#b80049] text-white rounded-full text-xs font-bold hover:bg-[#e2165f] transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Save Care Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
