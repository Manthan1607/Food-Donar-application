import { useState, useRef, useCallback } from "react";

interface CameraState {
  photoUrl: string | null;
  photoFile: File | null;
  loading: boolean;
  error: string | null;
  gpsMetadata: { lat: number; lng: number } | null;
  timestamp: string | null;
}

const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = (h * maxWidth) / w;
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.src = url;
  });
};

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    photoUrl: null,
    photoFile: null,
    loading: false,
    error: null,
    gpsMetadata: null,
    timestamp: null,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const captureFromCamera = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      await processFile(file);
    };
    input.click();
  }, []);

  const pickFromGallery = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      await processFile(file);
    };
    input.click();
  }, []);

  const processFile = async (file: File) => {
    setState((p) => ({ ...p, loading: true, error: null }));
    try {
      const compressed = await compressImage(file);
      const url = URL.createObjectURL(compressed);
      const now = new Date().toISOString();

      let gps: { lat: number; lng: number } | null = null;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 5000 })
        );
        gps = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch {}

      setState({
        photoUrl: url,
        photoFile: compressed,
        loading: false,
        error: null,
        gpsMetadata: gps,
        timestamp: now,
      });
    } catch (err: any) {
      setState((p) => ({ ...p, loading: false, error: err.message }));
    }
  };

  const clearPhoto = useCallback(() => {
    if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
    setState({ photoUrl: null, photoFile: null, loading: false, error: null, gpsMetadata: null, timestamp: null });
  }, [state.photoUrl]);

  return { ...state, captureFromCamera, pickFromGallery, clearPhoto };
};
