// src/store/registrationStore.js
import { create } from 'zustand';

export const useRegistrationStore = create((set) => ({
    step: 1,
    data: {
        email: '',
        password: '',
        companion: false, // Moved companion here to be set in Step 1
        number: '',       // Renamed from cardId
        issuingDate: '',  // Renamed from issueDate
        expiry: '',       // Renamed from expiryDate
        proof: null,      // Renamed from photo, will hold the File object
        jwt: null,
        user: null,
    },
    setStep: (newStep) => set({ step: newStep }),
    setData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
    resetStore: () => set({
        step: 1,
        data: {
            email: '',
            password: '',
            companion: false,
            number: '',
            issuingDate: '',
            expiry: '',
            proof: null,
            jwt: null,
            user: null,
        },
    }),
}));
