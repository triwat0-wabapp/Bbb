import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, PenTool, Check, Sparkles, Trash2 } from 'lucide-react';

interface SignaturePadProps {
  value?: string; // existing base64 PNG dataUrl
  onChange: (dataUrl: string) => void;
  applicantName?: string;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  applicantName = '',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale for high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual size in memory
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Normalize coordinate system to use CSS pixels
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#0f172a'; // Deep ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If existing value is passed, draw it onto the canvas
    if (value && value.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasSignature(true);
      };
      img.src = value;
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
      setHasSignature(false);
    }
  }, [value]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Coordinates helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e) {
      e.stopPropagation();
    }
    const coords = getCoordinates(e);
    lastPointRef.current = coords;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 1.25, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    if ('touches' in e) {
      e.preventDefault(); // Stop mobile scroll while drawing signature
      e.stopPropagation();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCoords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentCoords.x, currentCoords.y);
    ctx.stroke();

    lastPointRef.current = currentCoords;
    setHasSignature(true);
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
    onChange('');
  };

  // Generate a neat cursive/script mock signature from applicant name if preferred
  const handleAutoScript = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const nameToSign = applicantName.trim() || 'ผู้ยื่นคำร้อง';
    
    // Draw signature-like cursive stroke
    ctx.save();
    ctx.font = 'italic bold 28px "TH Sarabun New", "Angsana New", "Krub", cursive, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nameToSign, rect.width / 2, rect.height / 2 - 4);

    // Add a stylish flourish underline
    ctx.beginPath();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.moveTo(rect.width * 0.2, rect.height * 0.72);
    ctx.bezierCurveTo(
      rect.width * 0.4, rect.height * 0.65,
      rect.width * 0.7, rect.height * 0.85,
      rect.width * 0.85, rect.height * 0.68
    );
    ctx.stroke();
    ctx.restore();

    setHasSignature(true);
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
          <PenTool className="w-4 h-4 text-emerald-700" />
          <span>เซ็นลายมือชื่อผู้ยื่นคำร้อง (ลงนามดิจิทัล)</span>
        </div>
        {hasSignature && (
          <span className="inline-flex items-center text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Check className="w-3 h-3 mr-1" /> มีลายมือชื่อแล้ว
          </span>
        )}
      </div>

      {/* Signature Canvas Box */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-white overflow-hidden shadow-inner transition-colors">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full h-36 touch-none cursor-crosshair bg-amber-50/20"
          style={{ width: '100%', height: '144px' }}
        />

        {/* Guided baseline */}
        <div className="pointer-events-none absolute bottom-6 left-6 right-6 border-b border-dotted border-slate-300 flex justify-between text-[11px] text-slate-400 select-none">
          <span>(ลงชื่อ).................................................................</span>
          <span>ผู้ยื่นคำร้อง</span>
        </div>

        {/* Empty state hint */}
        {!hasSignature && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400 select-none">
            <PenTool className="w-6 h-6 mb-1 text-slate-300 animate-pulse" />
            <span className="text-xs">ใช้นิ้วมือหรือเมาส์เซ็นลายมือชื่อในกรอบนี้</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
        <div className="text-[11px] text-slate-500">
          * เอกสารสิ่งพิมพ์ทั้งหมดจะเว้นช่องลงชื่อไว้สำหรับเซ็นต์ชื่อจริงด้วยปากกา
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {applicantName && (
            <button
              type="button"
              onClick={handleAutoScript}
              className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1 transition-colors border border-slate-200"
              title="สร้างลายเซ็นจำลองจากชื่อผู้ยื่น"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>สร้างตัวเขียน</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClear}
            disabled={!hasSignature}
            className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 rounded-lg flex items-center space-x-1 transition-colors border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างลายเซ็น</span>
          </button>
        </div>
      </div>
    </div>
  );
};
