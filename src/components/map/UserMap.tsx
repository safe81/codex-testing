// src/components/map/UserMap.tsx
import React from 'react';

interface MapPoint {
    id: string;
    x: number;
    y: number;
    color: string;
    label: string;
}

interface UserMapProps {
    points: MapPoint[];
}

const UserMap: React.FC<UserMapProps> = ({ points }) => {
    return (
        <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl overflow-hidden aspect-video">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* Background (pode ser uma imagem de mapa estilizada no futuro) */}
                <rect width="100" height="100" fill="#1e293b" />
                
                {points.map(point => (
                    <g key={point.id} className="cursor-pointer group">
                        <circle 
                            cx={point.x} 
                            cy={point.y} 
                            r="1.5" 
                            fill={point.color} 
                            className="transition-transform group-hover:scale-150"
                        />
                        {/* Tooltip simples que aparece em hover */}
                        <text
                            x={point.x + 2}
                            y={point.y}
                            fontSize="2"
                            fill="white"
                            className="opacity-0 group-hover:opacity-100 transition-opacity font-mono"
                        >
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default UserMap;
