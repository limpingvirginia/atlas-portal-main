import { create } from "zustand";

interface LoginDialogStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useLoginDialogStore = create<LoginDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open })
}));
