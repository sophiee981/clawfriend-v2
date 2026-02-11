"use client";

import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { TimeInForce } from "@/lib/prediction-market/types";
import { memo } from "react";
import { TimeInForceSelectProps } from "../../types";

const TimeInForceSelect = ({
  value,
  onChange,
  options,
  orderForm,
  handleUpdateForm,
}: TimeInForceSelectProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm text-neutral-tertiary mb-1">
          Time in Force
        </label>
        <Select value={value} onValueChange={(v) => onChange(v as TimeInForce)}>
          <SelectTrigger className="w-full bg-neutral-03 px-3 py-2 h-10 rounded-sm text-body-sm">
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select Time in Force"}
          </SelectTrigger>
          <SelectContent className="bg-neutral-03">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {orderForm.timeInForce === TimeInForce.GTD && (
        <div className="mb-4">
          <label className="block text-body-xs text-neutral-tertiary mb-1">
            {t("tradingInterface.expirationDate")}{" "}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <DateTimePicker
            value={
              orderForm.expiresAt ? new Date(orderForm.expiresAt) : undefined
            }
            onChange={(date) =>
              handleUpdateForm("expiresAt", date?.toISOString() || "")
            }
            placeholder={t("tradingInterface.expirationDate")}
            minDate={new Date()}
          />
        </div>
      )}
    </>
  );
};

export default memo(TimeInForceSelect);
