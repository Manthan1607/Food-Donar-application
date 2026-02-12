import { useState, useEffect, useCallback } from "react";

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export const useGeolocation = (watch = false, highAccuracy = true) => {
  const [state, setState] = useState<GeoState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    loading: false,
    error: null,
    permissionDenied: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((p) => ({ ...p, error: "Geolocation not supported", loading: false }));
      return;
    }
    setState((p) => ({ ...p, loading: true, error: null }));

    const onSuccess = (pos: GeolocationPosition) => {
      setState({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
        loading: false,
        error: null,
        permissionDenied: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      setState((p) => ({
        ...p,
        loading: false,
        error: err.message,
        permissionDenied: err.code === 1,
      }));
    };

    const opts: PositionOptions = { enableHighAccuracy: highAccuracy, timeout: 10000, maximumAge: 30000 };

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, opts);
      return () => navigator.geolocation.clearWatch(id);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
    }
  }, [watch, highAccuracy]);

  return { ...state, requestLocation };
};
