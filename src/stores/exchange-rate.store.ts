import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ExchangeRateState {
    bnbToUsd: number;
    lastUpdated: number | null;
    isLoading: boolean;
    error: string | null;
    setExchangeRate: (rate: number) => void;
    fetchExchangeRate: () => Promise<void>;
    convertBnbToUsd: (bnbAmount: string | number) => number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useExchangeRateStore = create<ExchangeRateState>()(
    persist(
        (set, get) => ({
            bnbToUsd: 0,
            lastUpdated: null,
            isLoading: false,
            error: null,

            setExchangeRate: (rate: number) => {
                set({
                    bnbToUsd: rate,
                    lastUpdated: Date.now(),
                    error: null,
                });
            },

            fetchExchangeRate: async () => {
                const state = get();

                // Check if we have a recent cached value
                if (
                    state.lastUpdated &&
                    Date.now() - state.lastUpdated < CACHE_DURATION &&
                    state.bnbToUsd > 0
                ) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    // Fetch from backend API
                    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const response = await fetch(
                        `${baseUrl}/v1/price/bnb`,
                        {
                            headers: {
                                'accept': 'application/json',
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch exchange rate');
                    }

                    const result = await response.json();
                    const rate = result.data?.priceUsd;
                    const lastUpdatedAt = result.data?.lastUpdatedAt;

                    if (typeof rate === 'number') {
                        set({
                            bnbToUsd: rate,
                            lastUpdated: lastUpdatedAt ? lastUpdatedAt * 1000 : Date.now(), // Convert to milliseconds
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    console.error('Error fetching exchange rate:', error);
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    });
                }
            },

            convertBnbToUsd: (bnbAmount: string | number) => {
                const state = get();
                const bnb = typeof bnbAmount === 'string' ? parseFloat(bnbAmount) : bnbAmount;

                if (isNaN(bnb) || state.bnbToUsd === 0) {
                    return 0;
                }

                return bnb * state.bnbToUsd;
            },
        }),
        {
            name: 'exchange-rate-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                bnbToUsd: state.bnbToUsd,
                lastUpdated: state.lastUpdated,
            }),
        }
    )
);
