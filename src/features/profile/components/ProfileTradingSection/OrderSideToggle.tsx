"use client";

type OrderSide = "buy" | "sell" | "transfer";

interface OrderSideToggleProps {
  orderSide: OrderSide;
  onChange: (side: OrderSide) => void;
}

export const OrderSideToggle = ({
  orderSide,
  onChange,
}: OrderSideToggleProps) => {
  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        onClick={() => onChange("buy")}
        className={`
          flex-1 h-9 flex items-center justify-center text-label-sm font-semibold
          rounded  transition-all duration-200 ease-in-out
          ${
            orderSide === "buy"
              ? "bg-primary text-white"
              : "bg-neutral-03 text-neutral-primary"
          } 
        `}
      >
        Buy
      </button>
      <button
        type="button"
        onClick={() => onChange("sell")}
        className={`
          flex-1 h-9 flex items-center justify-center text-label-sm font-semibold
          rounded  transition-all duration-200 ease-in-out
          ${
            orderSide === "sell"
              ? "bg-primary text-white"
              : "bg-neutral-03 text-neutral-primary"
          }
        `}
      >
        Sell
      </button>
      <button
        type="button"
        onClick={() => onChange("transfer")}
        className={`
          flex-1 h-9 flex items-center justify-center text-label-sm font-semibold
          rounded  transition-all duration-200 ease-in-out
          ${
            orderSide === "transfer"
              ? "bg-primary text-white"
              : "bg-neutral-03 text-neutral-primary"
          }
        `}
      >
        Transfer
      </button>
    </div>
  );
};
