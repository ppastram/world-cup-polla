'use client';

import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';

interface PredictionStepperProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onSave: () => Promise<void>;
  saving?: boolean;
}

const STEP_TITLES = [
  'Fase de Grupos A-D',
  'Fase de Grupos E-H',
  'Fase de Grupos I-L',
  'Equipos Clasificados',
  'Premios Individuales',
];

export default function PredictionStepper({
  currentStep,
  totalSteps,
  onStepChange,
  onSave,
  saving = false,
}: PredictionStepperProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="space-y-4">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onStepChange(i)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i === currentStep
                ? 'bg-gold-500 text-black scale-110'
                : i < currentStep
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                : 'bg-wc-darker border border-wc-border text-gray-500'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Step Title */}
      <h2 className="text-center text-xl font-bold text-white">
        {STEP_TITLES[currentStep] || `Paso ${currentStep + 1}`}
      </h2>

      {/* Navigation + Save */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={isFirst}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-wc-border text-gray-300 hover:bg-wc-card hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Guardando...' : 'Guardar'}
        </button>

        <button
          type="button"
          onClick={() => onStepChange(currentStep + 1)}
          disabled={isLast}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-wc-border text-gray-300 hover:bg-wc-card hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
