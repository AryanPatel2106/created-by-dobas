import React from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

const Rating = ({ value, text, color = 'var(--theme-pink)' }) => {
  return (
    <div className="flex items-center">
      <span style={{ color }}>
        {value >= 1 ? <Star size={16} fill={color}/> : value >= 0.5 ? <StarHalf size={16} fill={color}/> : <StarOff size={16} />}
      </span>
      <span style={{ color }}>
        {value >= 2 ? <Star size={16} fill={color}/> : value >= 1.5 ? <StarHalf size={16} fill={color}/> : <StarOff size={16} />}
      </span>
      <span style={{ color }}>
        {value >= 3 ? <Star size={16} fill={color}/> : value >= 2.5 ? <StarHalf size={16} fill={color}/> : <StarOff size={16} />}
      </span>
      <span style={{ color }}>
        {value >= 4 ? <Star size={16} fill={color}/> : value >= 3.5 ? <StarHalf size={16} fill={color}/> : <StarOff size={16} />}
      </span>
      <span style={{ color }}>
        {value >= 5 ? <Star size={16} fill={color}/> : value >= 4.5 ? <StarHalf size={16} fill={color}/> : <StarOff size={16} />}
      </span>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;