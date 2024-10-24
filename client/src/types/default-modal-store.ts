export interface DefaultModal {
  extras: any;
  isOpen: boolean;
  onOpen: (extras?: any) => void;
  onClose: () => void;
}

export const defaultModalValues = (set: any) => ({
  isOpen: false,
  extras: {},
  onOpen: (extras?: any) => set({ isOpen: true, extras }),
  onClose: () => set({ isOpen: false, extras: {} }),
});
