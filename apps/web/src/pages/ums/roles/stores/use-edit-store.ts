import { create } from 'zustand';

interface EditState {
  isEditing: boolean;
  isEditAllowed: boolean;
  setIsEditing: (status: boolean) => void;
  setIsEditAllowed: (status: boolean) => void;
}

export const useEditStore = create<EditState>((set) => ({
  isEditing: false,
  isEditAllowed: false,
  setIsEditing: (status) => set({ isEditing: status }),
  setIsEditAllowed: (status) => set({ isEditAllowed: status }),
}));
