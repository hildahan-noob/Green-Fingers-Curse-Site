import React, { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Droplets, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { PlantProduct } from '../types';

interface Task {
  id: string;
  plantName: string;
  type: 'Watering' | 'Fertilizing' | 'Mist & Clean' | 'Rotate';
  dueDate: string;
  isCompleted: boolean;
  urgent?: boolean;
}

interface TasksViewProps {
  products: PlantProduct[];
  onWaterPlant: (id: string) => void;
  onFertilizePlant: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ products, onWaterPlant, onFertilizePlant }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      plantName: 'Monstera Deliciosa',
      type: 'Watering',
      dueDate: 'In 3 days',
      isCompleted: false,
      urgent: false,
    },
    {
      id: 't2',
      plantName: 'Fiddle Leaf Fig (Large)',
      type: 'Watering',
      dueDate: 'Today (Needs Water)',
      isCompleted: false,
      urgent: true,
    },
    {
      id: 't3',
      plantName: 'Calathea Orbifolia',
      type: 'Mist & Clean',
      dueDate: 'Tomorrow',
      isCompleted: false,
    },
    {
      id: 't4',
      plantName: 'Snake Plant Laurentii',
      type: 'Fertilizing',
      dueDate: 'In 12 days',
      isCompleted: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (!t.isCompleted) {
            if (t.plantName === 'Monstera Deliciosa' && t.type === 'Watering') {
              onWaterPlant('monstera-deliciosa');
            }
          }
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 mb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-extrabold text-2xl text-[#1a1c1c] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#b80049]" /> Plant Care Routine
          </h1>
          <p className="text-xs text-gray-500">Scheduled watering, misting, and nutrient feedings</p>
        </div>
        <span className="text-xs font-bold bg-[#b80049]/10 text-[#b80049] px-3 py-1 rounded-full">
          {completedCount} / {tasks.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              task.isCompleted
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : task.urgent
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-white border-[#e2e2e2] hover:border-[#b80049]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-[#b80049]">
                {task.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </button>
              <div>
                <h3
                  className={`font-bold text-sm ${
                    task.isCompleted ? 'line-through text-gray-400' : 'text-[#1a1c1c]'
                  }`}
                >
                  {task.type} - {task.plantName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className={task.urgent ? 'text-rose-600 font-bold flex items-center gap-1' : ''}>
                    {task.urgent && <AlertCircle className="w-3 h-3" />} {task.dueDate}
                  </span>
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                task.type === 'Watering'
                  ? 'bg-blue-50 text-blue-700'
                  : task.type === 'Fertilizing'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-purple-50 text-purple-700'
              }`}
            >
              {task.type}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
};
