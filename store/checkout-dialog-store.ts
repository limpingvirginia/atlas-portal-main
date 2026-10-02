import { create } from "zustand";

interface CheckoutDialogStore {
  openProductId: string | null;
  setOpenProductId: (id: string | null) => void;
}

export const useCheckoutDialogStore = create<CheckoutDialogStore>((set) => ({
  openProductId: null,
  setOpenProductId: (id) => set({ openProductId: id })
}));
