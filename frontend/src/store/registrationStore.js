import { create } from 'zustand';

export const useRegistrationStore = create((set) => ({
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
