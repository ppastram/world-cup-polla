'use client';

import {
  BookOpen,
  Trophy,
  Target,
  Star,
  Calendar,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  SCORING,
  ENTRY_FEE_COP,
  NEQUI_NUMBER,
} from '@/lib/constants';

function ScoringTable({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: React.ElementType;
  rows: { label: string; points: number }[];
}) {
  return (
    <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-wc-darker border-b border-wc-border">
        <Icon className="w-4 h-4 text-gold-400" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-wc-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-300">{row.label}</span>
            <span className="text-sm font-bold text-gold-400">{row.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-wc-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-wc-card hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-medium text-gray-200">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-wc-darker border-t border-wc-border">
          <p className="text-sm text-gray-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function ReglasPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Reglas</h1>
          <p className="text-sm text-gray-500">Todo lo que necesitas saber</p>
        </div>
      </div>

      {/* Scoring - Matches */}
      <ScoringTable
        title="Prediccion de Partidos"
        icon={Target}
        rows={[
          { label: 'Marcador exacto (ej: 2-1 y el resultado es 2-1)', points: SCORING.EXACT_SCORE },
          { label: 'Resultado correcto + diferencia de goles exacta', points: SCORING.CORRECT_RESULT_AND_DIFF },
          { label: 'Resultado correcto (Victoria/Empate/Derrota)', points: SCORING.CORRECT_RESULT },
        ]}
      />

      {/* Scoring - Advancing */}
      <ScoringTable
        title="Equipos Clasificados"
        icon={Trophy}
        rows={[
          { label: 'Acertar equipo en Dieciseisavos de Final', points: SCORING.ROUND_32 },
          { label: 'Acertar equipo en Octavos de Final', points: SCORING.ROUND_16 },
          { label: 'Acertar equipo en Cuartos de Final', points: SCORING.QUARTER },
          { label: 'Acertar equipo en Semifinales', points: SCORING.SEMI },
          { label: 'Acertar equipo en la Final', points: SCORING.FINAL },
          { label: 'Acertar al Campeon', points: SCORING.CHAMPION },
        ]}
      />

      {/* Scoring - Awards */}
      <ScoringTable
        title="Premios Individuales"
        icon={Star}
        rows={[
          { label: 'Acertar Balon de Oro (MVP)', points: SCORING.GOLDEN_BALL },
          { label: 'Acertar Bota de Oro (goleador)', points: SCORING.GOLDEN_BOOT },
          { label: 'Acertar Guante de Oro (mejor portero)', points: SCORING.GOLDEN_GLOVE },
          { label: 'Acertar Mejor Jugador Joven', points: SCORING.BEST_YOUNG },
          { label: 'Total de goles del torneo - exacto', points: SCORING.TOTAL_GOALS_EXACT },
          { label: 'Total de goles del torneo - dentro de 3', points: SCORING.TOTAL_GOALS_WITHIN_3 },
          { label: 'Total de goles del torneo - dentro de 5', points: SCORING.TOTAL_GOALS_WITHIN_5 },
        ]}
      />

      {/* Categories Explained */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          Categorias de Prediccion
        </h3>
        <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
          <p>
            <span className="text-gold-400 font-semibold">1. Partidos:</span>{' '}
            Predice el marcador de cada partido de la fase de grupos. Ganas puntos por acertar
            el marcador exacto, el resultado con la diferencia correcta, o simplemente el resultado.
          </p>
          <p>
            <span className="text-gold-400 font-semibold">2. Equipos clasificados:</span>{' '}
            Selecciona que equipos crees que avanzaran a cada ronda eliminatoria, desde dieciseisavos
            hasta el campeon. Mientras mas avanzada la ronda, mas puntos.
          </p>
          <p>
            <span className="text-gold-400 font-semibold">3. Premios individuales:</span>{' '}
            Predice quien ganara el Balon de Oro, la Bota de Oro, el Guante de Oro, el premio
            al Mejor Jugador Joven y cuantos goles totales habra en el torneo.
          </p>
        </div>
      </div>

      {/* Deadlines */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-400" />
          Fechas Importantes
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">4 de junio, 2026 - 11:59 PM (COT)</p>
              <p className="text-sm text-gray-500">
                Cierre de predicciones. Despues de esta fecha no se podran modificar predicciones.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">11 de junio, 2026</p>
              <p className="text-sm text-gray-500">
                Inicio del Mundial FIFA 2026. Las predicciones de todos los participantes se hacen
                visibles y comienza el conteo de puntos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Distribution */}
      <div className="bg-wc-card border border-gold-500/30 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gold-400" />
          Distribucion de Premios
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gold-500/10 rounded-lg border border-gold-500/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold-400" />
              <span className="text-sm font-semibold text-gold-400">1er Lugar</span>
            </div>
            <span className="text-sm font-bold text-gold-400">70% del pozo</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-400/5 rounded-lg border border-gray-400/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-300">2do Lugar</span>
            </div>
            <span className="text-sm font-bold text-gray-300">15% del pozo</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-700/5 rounded-lg border border-amber-700/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-500">3er Lugar</span>
            </div>
            <span className="text-sm font-bold text-amber-500">Devolucion de entrada (${ENTRY_FEE_COP.toLocaleString('es-CO')})</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          El restante 15% se destina a costos de operacion. El pozo total depende del numero de
          participantes con pago verificado.
        </p>
      </div>

      {/* Entry Fee */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">Inscripcion</h3>
        <div className="flex items-center justify-between p-4 bg-wc-darker rounded-lg">
          <span className="text-sm text-gray-400">Valor de la entrada</span>
          <span className="text-xl font-bold text-gold-400">
            ${ENTRY_FEE_COP.toLocaleString('es-CO')} COP
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Pago por Nequi al numero <span className="text-gold-400 font-mono font-semibold">{NEQUI_NUMBER}</span>.
          Sube tu comprobante en la seccion de{' '}
          <a href="/pago" className="text-gold-400 underline hover:text-gold-300">
            Pago
          </a>.
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gold-400" />
          Preguntas Frecuentes
        </h3>
        <div className="space-y-2">
          <FAQItem
            question="Puedo cambiar mis predicciones despues de enviarlas?"
            answer="Si, puedes modificar tus predicciones cuantas veces quieras antes del cierre el 4 de junio de 2026 a las 11:59 PM hora Colombia. Despues de esa fecha, las predicciones quedan bloqueadas."
          />
          <FAQItem
            question="Que pasa si no pago antes del inicio del torneo?"
            answer="Puedes ingresar tus predicciones sin haber pagado, pero no participaras oficialmente en la polla ni seras elegible para premios hasta que tu pago sea verificado."
          />
          <FAQItem
            question="Como se desempatan posiciones iguales?"
            answer="En caso de empate en puntos totales, se prioriza: 1) mas marcadores exactos, 2) mas resultados con diferencia correcta, 3) acierto del campeon. Si persiste el empate, se divide el premio."
          />
          <FAQItem
            question="Solo se predicen partidos de fase de grupos?"
            answer="Si, las predicciones de marcador son solo para los 48 partidos de la fase de grupos. Para las fases eliminatorias, predices que equipos clasifican a cada ronda."
          />
          <FAQItem
            question="Cuando puedo ver las predicciones de los demas?"
            answer="Las predicciones de todos los participantes se hacen visibles a partir del 11 de junio de 2026, cuando comienza el Mundial. Antes de esa fecha, solo puedes ver las tuyas."
          />
          <FAQItem
            question="Que pasa con los partidos que van a penales?"
            answer="Para la fase de grupos, solo aplica el resultado en los 90 minutos. Para las predicciones de equipos clasificados, lo que importa es que el equipo avance, independientemente de como."
          />
        </div>
      </div>
    </div>
  );
}
