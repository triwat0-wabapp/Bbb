import React from 'react';

interface GarudaEmblemProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  useOfficialImage?: boolean;
}

export const GarudaEmblem: React.FC<GarudaEmblemProps> = ({
  className = '',
  width = 75,
  height = 80,
  useOfficialImage = true,
}) => {
  if (useOfficialImage) {
    return (
      <img
        src="/assets/aistudio/images__1__cd25ae2e.jfif"
        alt="ตราครุฑทางการ"
        width={width}
        height={height}
        className={`inline-block select-none object-contain mix-blend-multiply ${className}`}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 215"
      width={width}
      height={height}
      className={`inline-block select-none ${className}`}
      fill="#000000"
    >
      <g id="GarudaCrown">
        <polygon points="100,5 92,30 108,30" />
        <polygon points="100,2 96,15 104,15" />
        <circle cx="100" cy="2" r="2.5" />
        <path d="M88,30 Q100,22 112,30 L115,38 Q100,34 85,38 Z" />
        <path d="M82,38 Q100,32 118,38 L122,46 Q100,40 78,46 Z" />
      </g>
      <g id="GarudaHead">
        <circle cx="100" cy="52" r="10" />
        <path d="M96,56 Q100,68 104,56 Q100,62 96,56" />
        <circle cx="94" cy="50" r="1.8" fill="#fff" />
        <circle cx="106" cy="50" r="1.8" fill="#fff" />
        <path d="M88,48 Q78,42 75,54 Q82,56 88,52 Z" />
        <path d="M112,48 Q122,42 125,54 Q118,56 112,52 Z" />
      </g>
      <g id="GarudaBody">
        <path d="M86,62 Q100,60 114,62 L120,95 Q100,102 80,95 Z" />
        <path d="M92,62 L90,90 M100,60 L100,94 M108,62 L110,90" stroke="#fff" strokeWidth="1.5" />
        <path d="M84,95 C88,110 112,110 116,95 Z" />
      </g>
      <g id="LeftWing">
        <path d="M82,62 C65,40 35,28 12,32 C25,52 38,72 52,90 C40,94 28,102 18,115 C34,116 52,114 68,108 C55,122 42,138 35,152 C52,142 70,132 82,120 Z" />
      </g>
      <g id="RightWing">
        <path d="M118,62 C135,40 165,28 188,32 C175,52 162,72 148,90 C160,94 172,102 182,115 C166,116 148,114 132,108 C145,122 158,138 165,152 C148,142 130,132 118,120 Z" />
      </g>
      <g id="ArmsAndNaga">
        <path d="M84,65 Q62,75 58,95 Q70,92 82,85 Z" />
        <path d="M116,65 Q138,75 142,95 Q130,92 118,85 Z" />
        <path d="M56,92 C45,108 30,135 25,170 C34,165 42,150 50,135 C55,120 60,105 60,94 Z" />
        <path d="M144,92 C155,108 170,135 175,170 C166,165 158,150 150,135 C145,120 140,105 140,94 Z" />
      </g>
      <g id="Tail">
        <path d="M92,105 Q100,125 100,165 Q108,125 108,105 Z" />
        <path d="M85,110 Q94,130 90,175 Q98,130 92,110 Z" />
        <path d="M115,110 Q106,130 110,175 Q102,130 108,110 Z" />
      </g>
      <g id="LegsClaws">
        <path d="M78,120 C72,140 68,160 55,185 C65,182 75,178 82,165 C85,150 88,135 88,122 Z" />
        <path d="M122,120 C128,140 132,160 145,185 C135,182 125,178 118,165 C115,150 112,135 112,122 Z" />
      </g>
      <path d="M25,170 Q45,200 100,205 Q155,200 175,170 Q145,190 100,192 Q55,190 25,170 Z" />
    </svg>
  );
};
