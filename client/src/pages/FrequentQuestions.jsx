import { useState } from 'react';

const frequentTopics = [
  { topic: 'CAP Theorem', subject: 'Distributed Systems', frequency: 8, probability: 92, years: [2024, 2023, 2022, 2021, 2020] },
  { topic: 'Schrödinger Equation', subject: 'Quantum Mechanics', frequency: 7, probability: 88, years: [2024, 2023, 2022, 2021] },
  { topic: 'Normalization (BCNF)', subject: 'Database Systems', frequency: 7, probability: 85, years: [2024, 2022, 2021, 2020] },
  { topic: 'Graph Isomorphism', subject: 'Discrete Mathematics', frequency: 6, probability: 80, years: [2023, 2022, 2021] },
  { topic: 'Deadlock Prevention', subject: 'Operating Systems', frequency: 6, probability: 78, years: [2024, 2023, 2022] },
  { topic: 'Eigenvalues & Eigenvectors', subject: 'Linear Algebra', frequency: 5, probability: 75, years: [2024, 2023, 2021] },
  { topic: 'TCP vs UDP', subject: 'Computer Networks', frequency: 5, probability: 72, years: [2023, 2022, 2020] },
  { topic: 'Page Replacement', subject: 'Operating Systems', frequency: 4, probability: 68, years: [2024, 2022] },
  { topic: 'Euler Paths & Circuits', subject: 'Graph Theory', frequency: 4, probability: 65, years: [2023, 2021] },
  { topic: 'Laws of Thermodynamics', subject: 'Thermodynamics', frequency: 3, probability: 60, years: [2022, 2020] },
];

export default function FrequentQuestions() {
  const [sortBy, setSortBy] = useState('frequency'); // frequency | probability
  const maxFreq = Math.max(...frequentTopics.map(t => t.frequency));

  const sorted = [...frequentTopics].sort((a, b) =>
    sortBy === 'frequency' ? b.frequency - a.frequency : b.probability - a.probability
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-stack-md gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary text-3xl">local_fire_department</span>
          <div>
            <h2 className="font-grotesk text-h2 text-on-surface">Frequent Questions Engine</h2>
            <p className="text-body-md text-on-surface-variant">AI-analyzed PYQ patterns & high-probability topics</p>
          </div>
        </div>
        <div className="flex gap-2 p-1 glass-vessel rounded-full">
          <button
            onClick={() => setSortBy('frequency')}
            className={`px-4 py-1.5 rounded-full font-grotesk text-caption transition-all ${sortBy === 'frequency' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:bg-white/10'}`}
          >
            By Frequency
          </button>
          <button
            onClick={() => setSortBy('probability')}
            className={`px-4 py-1.5 rounded-full font-grotesk text-caption transition-all ${sortBy === 'probability' ? 'bg-tertiary text-on-tertiary shadow-lg' : 'text-on-surface-variant hover:bg-white/10'}`}
          >
            By Probability
          </button>
        </div>
      </div>

      {/* Top 3 highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        {sorted.slice(0, 3).map((topic, idx) => (
          <div key={topic.topic} className={`glass-card rounded-2xl p-6 relative overflow-hidden ${idx === 0 ? 'border-2 border-primary/30' : ''}`}>
            {idx === 0 && (
              <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 rounded-bl-xl text-[10px] font-bold">
                MOST ASKED
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className={`material-symbols-outlined ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-600'} filled`}>
                emoji_events
              </span>
              <span className="text-caption text-on-surface-variant">#{idx + 1}</span>
            </div>
            <h4 className="font-grotesk text-[18px] text-on-surface font-semibold mb-1">{topic.topic}</h4>
            <p className="text-caption text-on-surface-variant mb-4">{topic.subject}</p>
            <div className="flex items-end gap-4">
              <div>
                <p className="font-grotesk text-h2 text-primary">{topic.frequency}×</p>
                <p className="text-[10px] text-on-surface-variant">Asked</p>
              </div>
              <div>
                <p className="font-grotesk text-h2 text-tertiary">{topic.probability}%</p>
                <p className="text-[10px] text-on-surface-variant">Probability</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full list with frequency bars */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <h3 className="font-grotesk text-action">All Frequent Topics</h3>
        </div>
        <div className="divide-y divide-white/20">
          {sorted.map((topic, idx) => (
            <div key={topic.topic} className="p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <span className="text-caption text-on-surface-variant w-6 text-center font-bold">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-grotesk text-on-surface font-semibold truncate">{topic.topic}</h5>
                  <span className="text-[10px] text-on-surface-variant bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap">{topic.subject}</span>
                </div>
                {/* Frequency bar */}
                <div className="w-full bg-white/20 h-2 rounded-full">
                  <div
                    className="h-full rounded-full transition-all bg-gradient-to-r from-primary to-primary-fixed-dim"
                    style={{ width: `${(topic.frequency / maxFreq) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-grotesk text-primary font-bold">{topic.frequency}×</p>
                  <p className="text-[10px] text-on-surface-variant">freq</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  topic.probability >= 80 ? 'bg-red-100 text-red-700' :
                  topic.probability >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {topic.probability}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
