"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AgentListItem } from "@/interfaces";
import { formatNumberShort } from "@/utils/number";
import { formatAddress } from "@/utils/web3";
import { ClipboardPaste } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAddress } from "viem";
import { AgentSelection } from "./AgentSelection";

type RecipientMode = "address" | "agent";

export interface TransferFormData {
  recipientAddress: string;
  amount: string;
  subjectAddress: string;
  subjectName: string;
  isValid: boolean;
}

interface TransferShareSectionProps {
  subjectAddress: string;
  profileName: string;
  sharesBalance: number;
  transferData?: TransferFormData | null;
  onTransferDataChange?: (data: TransferFormData) => void;
}

export const TransferShareSection = ({
  subjectAddress,
  profileName,
  sharesBalance,
  transferData,
  onTransferDataChange,
}: TransferShareSectionProps) => {
  console.log("transferData", transferData);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("address");

  const [recipientAddress, setRecipientAddress] = useState("");
  const [selectedRecipientAgent, setSelectedRecipientAgent] =
    useState<AgentListItem | null>(null);

  const effectiveRecipientAddress =
    recipientMode === "agent" && selectedRecipientAgent
      ? selectedRecipientAgent.walletAddress
      : recipientAddress.trim();

  const amountNum = parseInt(transferData?.amount || "0", 10) || 0;
  const isValidAddress = effectiveRecipientAddress
    ? isAddress(effectiveRecipientAddress)
    : false;
  const hasSubject = !!subjectAddress;

  const notifyTransferDataChange = useCallback(
    (overrides: {
      recipientAddress?: string;
      amount?: string;
      recipientMode?: RecipientMode;
      selectedRecipientAgent?: AgentListItem | null;
    }) => {
      const mode = overrides.recipientMode ?? recipientMode;
      const addr =
        mode === "agent"
          ? ((overrides.selectedRecipientAgent ?? selectedRecipientAgent)
              ?.walletAddress ?? "")
          : (overrides.recipientAddress ?? recipientAddress).trim();
      const amt = overrides.amount ?? transferData?.amount ?? "";
      const addrValid = addr ? isAddress(addr) : false;
      const amtNum = parseInt(amt || "0", 10) || 0;
      const amtValid = amtNum > 0 && amtNum <= sharesBalance;
      const valid = addrValid && amtValid && hasSubject;

      const newFormData = {
        recipientAddress: addr,
        amount: amt,
        subjectAddress,
        subjectName: profileName,
        isValid: valid,
      };

      onTransferDataChange?.(newFormData);
    },
    [
      recipientMode,
      recipientAddress,
      selectedRecipientAgent,
      transferData?.amount,
      sharesBalance,
      hasSubject,
      onTransferDataChange,
      subjectAddress,
      profileName,
    ],
  );

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [recipientAddress, resizeTextarea]);

  const handlePasteAddress = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim().replace(/\s+/g, "");
      setRecipientAddress(trimmed);
      notifyTransferDataChange({ recipientAddress: trimmed });
    } catch {
      // Clipboard API may be blocked; ignore
    }
  }, [notifyTransferDataChange]);

  const addressError =
    recipientMode === "address"
      ? recipientAddress.trim() && !isValidAddress
        ? "Invalid wallet address"
        : null
      : recipientMode === "agent" && !selectedRecipientAgent
        ? "Select an agent"
        : null;
  const amountError =
    isNaN(amountNum) || amountNum <= 0
      ? null
      : amountNum > sharesBalance
        ? "Insufficient shares"
        : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Recipient address */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-body-xs font-medium text-neutral-tertiary">
            Recipient
          </label>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRecipientMode("address");
                setSelectedRecipientAgent(null);
                notifyTransferDataChange({
                  recipientMode: "address",
                  selectedRecipientAgent: null,
                });
              }}
              className={`px-2.5 py-1 text-label-xs font-medium rounded transition-colors ${
                recipientMode === "address"
                  ? "bg-primary text-white"
                  : "bg-neutral-03 text-neutral-primary hover:bg-neutral-04"
              }`}
            >
              Address
            </button>
            <button
              type="button"
              onClick={() => {
                setRecipientMode("agent");
                setRecipientAddress("");
                notifyTransferDataChange({ recipientMode: "agent" });
              }}
              className={`px-2.5 py-1 text-label-xs font-medium rounded transition-colors ${
                recipientMode === "agent"
                  ? "bg-primary text-white"
                  : "bg-neutral-03 text-neutral-primary hover:bg-neutral-04"
              }`}
            >
              Agent
            </button>
          </div>
        </div>
        {recipientMode === "address" ? (
          <div
            className={`flex items-start gap-2 pl-3 py-2 pr-2 border rounded-lg min-h-11 ${
              addressError ? "border-danger" : "border-neutral-03"
            }`}
          >
            <Textarea
              ref={textareaRef}
              placeholder="0x..."
              value={recipientAddress}
              autoFocus
              rows={1}
              onChange={(e) => {
                const v = e.target.value.replace(/\s+/g, "");
                setRecipientAddress(v);
                notifyTransferDataChange({ recipientAddress: v });
              }}
              onFocus={resizeTextarea}
              className="w-full min-w-0 bg-transparent border-none rounded-none text-label-sm !leading-7 min-h-7 !p-0 resize-none overflow-y-auto break-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0"
              style={{ wordBreak: "break-all", overflowWrap: "break-word" }}
            />
            <Button
              variant="secondary"
              buttonType="tonal"
              size="sm"
              onClick={handlePasteAddress}
              className="h-7 px-3 shrink-0 text-neutral-tertiary"
            >
              <ClipboardPaste className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <AgentSelection
            selectedAgent={selectedRecipientAgent}
            hasError={!!addressError}
            onSelect={(agent) => {
              setSelectedRecipientAgent(agent);
              notifyTransferDataChange({ selectedRecipientAgent: agent });
            }}
          />
        )}
        {addressError && (
          <p className="text-body-xs font-medium text-danger">{addressError}</p>
        )}
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-body-xs font-medium text-neutral-tertiary">
            Amount
          </label>
          <span className="text-body-xs text-neutral-tertiary">
            Balance: {formatNumberShort(sharesBalance)} shares
          </span>
        </div>
        <div
          className={`flex items-stretch rounded-lg overflow-hidden transition-all duration-200 focus-within:shadow-sm border border-neutral-03 ${
            amountError ? "bg-danger-muted-10" : ""
          }`}
        >
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="flex-1 min-w-0 bg-transparent border-0 rounded-none text-label-sm font-semibold py-2 px-3 h-11 placeholder:text-neutral-tertiary placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 transition-all duration-200"
            placeholder="0"
            value={transferData?.amount ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) {
                notifyTransferDataChange({ amount: v });
              }
            }}
          />
          <div className="flex items-center px-4">
            <span className="text-body-xs text-neutral-tertiary font-normal">
              shares
            </span>
          </div>
        </div>
        {amountError && (
          <p className="text-body-xs font-medium text-danger">{amountError}</p>
        )}
      </div>

      {/* Transaction info */}
      <TooltipProvider>
        <div className="flex flex-col gap-2 py-2.5 px-1 border-t border-neutral-03">
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  Subject
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">
                  The agent whose shares you are transferring
                </p>
              </TooltipContent>
            </Tooltip>
            <span className="text-label-xs font-medium text-neutral-primary truncate max-w-[180px]">
              {hasSubject ? profileName || subjectAddress : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  Subject address
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">
                  Wallet address of the agent whose shares you are transferring
                </p>
              </TooltipContent>
            </Tooltip>
            <span className="text-label-xs font-medium text-neutral-primary truncate max-w-[180px] font-mono">
              {hasSubject ? formatAddress(subjectAddress) : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  Amount
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">Number of shares to transfer</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-label-xs font-medium text-neutral-primary">
              {amountNum > 0 ? `${formatNumberShort(amountNum)} shares` : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  To
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">Recipient wallet address</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-label-xs font-medium text-neutral-primary truncate max-w-[180px] font-mono">
              {isValidAddress && effectiveRecipientAddress
                ? `${effectiveRecipientAddress.slice(
                    0,
                    6,
                  )}...${effectiveRecipientAddress.slice(-4)}`
                : "-"}
            </span>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default TransferShareSection;
