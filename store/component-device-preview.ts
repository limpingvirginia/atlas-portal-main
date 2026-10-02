import { create } from "zustand";

export type ViewportDevice = "mobile" | "tablet" | "desktop";

type State = {
  devices: Record<string, ViewportDevice>;
  getDevice: (key: string) => ViewportDevice;
  setDevice: (key: string, device: ViewportDevice) => void;
};

export const useComponentDevicePreviewStore = create<State>((set, get) => ({
  devices: {},
  getDevice: (key) => get().devices[key] ?? "desktop",
  setDevice: (key, device) =>
    set((s) => ({ devices: { ...s.devices, [key]: device } })),
}));
