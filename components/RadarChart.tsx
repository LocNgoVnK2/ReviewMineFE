
import React from 'react';
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, ResponsiveContainer
} from 'recharts';
import { Review, DomainType } from '../types';
import { useTranslation } from '../services/languageContext';

interface MirrorChartProps {
  reviews: Review[];
}

export const MirrorChart: React.FC<MirrorChartProps> = ({ reviews }) => {
  const { t } = useTranslation();
  const domains = Object.values(DomainType);
  const data = domains.map(domain => {
    const domainReviews = reviews.filter(r => r.domain === domain);
    const avg = domainReviews.length 
      ? domainReviews.reduce((sum, r) => sum + r.rating, 0) / domainReviews.length 
      : 0;
    
    // Map internal enum value to translated label
    const label = t.domains[domain as keyof typeof t.domains] || domain;
    
    return {
      subject: label,
      A: avg,
      fullMark: 5,
    };
  });

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#facc1522" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#facc15', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
          />
          <Radar
            name="Insight"
            dataKey="A"
            stroke="#facc15"
            fill="#facc15"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
