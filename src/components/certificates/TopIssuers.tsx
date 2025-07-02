import React from 'react'
import { Building, TrendingUp } from 'lucide-react'
import { CertificateStats } from '../../hooks/useCertificatesData'

interface TopIssuersProps {
  stats: CertificateStats
  isDark: boolean
}

export const TopIssuers: React.FC<TopIssuersProps> = ({ stats, isDark }) => {
  const topIssuers = Object.entries(stats.byIssuer)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)

  return (
    <div className={`rounded-2xl p-6 ${
      isDark
        ? 'bg-slate-800/50 border border-slate-700/50'
        : 'bg-white/70 border border-slate-200/50'
    } backdrop-blur-sm`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        <Building className="w-5 h-5 text-blue-500" />
        Top Learning Providers
      </h3>
      
      <div className="space-y-3">
        {topIssuers.map(([issuer, count], index) => (
          <div
            key={issuer}
            className={`flex items-center justify-between p-3 rounded-xl ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-500 text-white' :
                index === 1 ? 'bg-slate-400 text-white' :
                index === 2 ? 'bg-orange-400 text-white' :
                isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-300 text-slate-600'
              }`}>
                {index + 1}
              </div>
              
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {issuer}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {count}
              </span>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                certs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CertificationTimelineProps {
  stats: CertificateStats
  isDark: boolean
}

export const CertificationTimeline: React.FC<CertificationTimelineProps> = ({ stats, isDark }) => {
  const yearData = Object.entries(stats.byYear)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .slice(0, 5)

  const maxCount = Math.max(...yearData.map(([, count]) => count))

  return (
    <div className={`rounded-2xl p-6 ${
      isDark
        ? 'bg-slate-800/50 border border-slate-700/50'
        : 'bg-white/70 border border-slate-200/50'
    } backdrop-blur-sm`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        <TrendingUp className="w-5 h-5 text-green-500" />
        Learning Activity
      </h3>
      
      <div className="space-y-4">
        {yearData.map(([year, count]) => (
          <div key={year} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {year}
              </span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {count} certificates
              </span>
            </div>
            
            <div className={`w-full h-2 rounded-full ${
              isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'
            }`}>
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
