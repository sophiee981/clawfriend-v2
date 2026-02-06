"use client";

import { useEffect } from "react";
import { useExchangeRateStore } from "@/stores/exchange-rate.store";

export const ExchangeRateProvider = () => {
    const fetchExchangeRate = useExchangeRateStore((state) => state.fetchExchangeRate);

    useEffect(() => {
        fetchExchangeRate();
    }, [fetchExchangeRate]);

    // This component doesn't render anything
    return null;
};
