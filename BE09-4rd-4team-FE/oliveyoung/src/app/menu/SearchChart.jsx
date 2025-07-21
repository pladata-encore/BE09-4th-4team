import React from 'react';
import { getImageUrl } from '@/utils/image'; 

function SearchChart({ word, rank }) {
  const upIconUrl = getImageUrl("product/up.svg");
  const downIconUrl = getImageUrl("product/down.svg");

  return (
    <div className="w-[100%] flex flex-row items-center">
      <p className="min-w-[24px] text-sm text-[#131518] leading-[34px]">{rank + 1}</p>
      <p className="text-sm text-[#131518] grow">{word.searchWord}</p>
      <div>
        {word.prev === 'up' ? (
          <img src={upIconUrl} alt="up" /> 
        ) : word.prev === 'down' ? (
          <img src={downIconUrl} alt="down" /> 
        ) : word.prev === 'keep' ? (
          <span className="text-[11px] text-[#666]]">─</span>
        ) : (
          <span className="text-[11px] text-[#c9cdd2]">NEW</span>
        )}
      </div>
    </div>
  );
}

export default SearchChart;