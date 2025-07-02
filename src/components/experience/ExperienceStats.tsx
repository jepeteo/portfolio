import React from 'react'
import { Users, Award, Activity, Briefcase } from 'lucide-react'
import { ExperienceStats } from '../../hooks/useExperienceData'

interface ExperienceStatsProps {
  stats: ExperienceStats
  isDark: boolean
}

export const ExperienceStatsComponent: React.FC<ExperienceStatsProps> = ({ stats, isDark }) => {
  const statItems = [
    {
      icon: Activity,
      label: 'Years Experience',
      value: `${stats.totalYears}+`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      label: 'Projects Delivered',
      value: `${stats.totalProjects}+`,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      label: 'Clients Served',
      value: `${stats.totalClients}+`,
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Award,
      label: 'Current Roles',
      value: stats.currentRoles.toString(),
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`relative group overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
            isDark
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white/70 border border-slate-200/50'
          } backdrop-blur-sm`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}>
              <item.icon className="w-6 h-6" />
            </div>
            
            <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {item.value}
            </div>
            
            <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
