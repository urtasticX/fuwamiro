"use client";

import { useEffect, useRef, useState } from "react";

export type CropSize = { width: number; height: number };

type Point = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function cropBounds(image: HTMLImageElement, size: CropSize, zoom: number) {
  const ratio = size.width / size.height;
  const width = Math.min(image.naturalWidth, image.naturalHeight * ratio) / zoom;
  return { width, height: width / ratio };
}

export function ImageCropper({
  file,
  size,
  onConfirm,
  onCancel,
}: {
  file: File;
  size: CropSize;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; pan: Point } | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const next = new Image();
    next.onload = () => setImage(next);
    next.onerror = () => setError("เปิดรูปนี้ไม่ได้ กรุณาเลือกไฟล์รูปภาพอื่น");
    next.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!image || !canvas.current) return;
    const { width, height } = cropBounds(image, size, zoom);
    const centerX = clamp(image.naturalWidth / 2 + pan.x, width / 2, image.naturalWidth - width / 2);
    const centerY = clamp(image.naturalHeight / 2 + pan.y, height / 2, image.naturalHeight - height / 2);
    const output = canvas.current;
    output.width = size.width;
    output.height = size.height;
    const context = output.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, size.width, size.height);
    context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height, 0, 0, size.width, size.height);
  }, [image, pan, size, zoom]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [onCancel]);

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag.current || !image) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const bounds = cropBounds(image, size, zoom);
    const maxX = (image.naturalWidth - bounds.width) / 2;
    const maxY = (image.naturalHeight - bounds.height) / 2;
    setPan({
      x: clamp(drag.current.pan.x - (event.clientX - drag.current.x) * bounds.width / rect.width, -maxX, maxX),
      y: clamp(drag.current.pan.y - (event.clientY - drag.current.y) * bounds.height / rect.height, -maxY, maxY),
    });
  }

  function confirm() {
    if (!canvas.current) return;
    const png = size.width === size.height;
    canvas.current.toBlob((blob) => {
      if (!blob) {
        setError("ครอปรูปไม่สำเร็จ กรุณาลองอีกครั้ง");
        return;
      }
      const name = file.name.replace(/\.[^.]+$/, "");
      onConfirm(new File([blob], `${name}-crop.${png ? "png" : "jpg"}`, { type: png ? "image/png" : "image/jpeg" }));
    }, png ? "image/png" : "image/jpeg", 0.9);
  }

  return (
    <div className="crop-overlay" role="dialog" aria-modal="true" aria-label="ครอปรูปภาพ">
      <div className="crop-dialog">
        <h2>ครอปรูปภาพ</h2>
        <p>ลากรูปเพื่อเลือกตำแหน่ง และเลื่อนแถบเพื่อขยาย ภาพที่ได้จะมีขนาด {size.width} × {size.height} พิกเซล</p>
        {error ? <p className="crop-error" role="alert">{error}</p> : (
          <canvas
            ref={canvas}
            className="crop-preview"
            style={{ aspectRatio: `${size.width} / ${size.height}`, width: `min(100%, 520px, ${Math.round(50 * size.width / size.height)}vh)` }}
            onPointerDown={(event) => {
              drag.current = { x: event.clientX, y: event.clientY, pan };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={move}
            onPointerUp={() => { drag.current = null; }}
            onPointerCancel={() => { drag.current = null; }}
          />
        )}
        <label className="crop-zoom">ขยายรูป <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
        <div className="crop-actions">
          <button type="button" className="button outline small" onClick={onCancel}>ยกเลิก</button>
          <button type="button" className="button small" disabled={!image || !!error} onClick={confirm}>ใช้รูปที่ครอป</button>
        </div>
      </div>
    </div>
  );
}

export async function imageSize(file: File): Promise<CropSize> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("เปิดรูปนี้ไม่ได้ กรุณาใช้ JPG, PNG, WebP หรือ AVIF"));
    };
    image.src = url;
  });
}
