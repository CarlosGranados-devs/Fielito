"use client";

import dynamic from "next/dynamic";

const LocationPickerInner = dynamic(
  () => import("./location-picker-map").then((module) => module.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-slate-100">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    ),
  },
);

export function LocationPickerDynamic(props: {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}) {
  return <LocationPickerInner {...props} />;
}
