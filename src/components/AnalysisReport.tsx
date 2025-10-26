import { FileText, Activity } from 'lucide-react';
import { AnalysisResult } from '../App';

interface AnalysisReportProps {
  result: AnalysisResult;
}

function AnalysisReport({ result }: AnalysisReportProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-emerald-200">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Plant-alysis Report
        </h2>
      </div>

      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
        <p className="text-sm font-semibold text-emerald-800 mb-1">
          Crazy Dave, Bovine Bio-Acoustician
        </p>
        <p className="text-xs text-emerald-600">
          Certified in Lactonic-Frequency-Modulation Analysis
        </p>
      </div>

      <div className="mb-6">
        <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg mb-4">
          <p className="text-sm text-gray-600">Transcribed Vocalization:</p>
          <p className="text-xl font-bold text-gray-900">"{result.transcription}"</p>
        </div>
      </div>

      <div className="prose max-w-none mb-6">
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {result.report}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Growth Zone</h3>
          </div>
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Sound:</span> {result.growthSound}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Frequency:</span> {result.growthFrequency} Hz
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">No-Go Zone</h3>
          </div>
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Sound:</span> {result.deterrentSound}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Frequency:</span> {result.deterrentFrequency} Hz
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnalysisReport;
