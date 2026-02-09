"use client";

import { CheckLine, Copy } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useState } from "react";
import { AcademyItem } from "../data";

interface AddToAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AcademyItem | null;
}

export const AddToAgentModal = ({
  open,
  onOpenChange,
  item,
}: AddToAgentModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    // In a real app, this would be the actual content
    const contentToCopy = item.content;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: "Copy Content",
      description: `Copy the ${item.type} configuration below`,
      action: (
        <div
          className="flex items-center gap-2 mt-2 w-full p-3 bg-neutral-02 rounded-lg border border-neutral-03 justify-between group cursor-pointer hover:border-neutral-primary transition-colors"
          onClick={handleCopy}
        >
          <code className="text-xs font-mono text-neutral-secondary truncate max-w-[350px]">
            {item.content.replace(/\n/g, " ").substring(0, 50)}...
          </code>
          <div className="text-neutral-tertiary group-hover:text-neutral-primary">
            {copied ? (
              <CheckLine className="w-4 h-4 text-brand-primary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Go to Agent Settings",
      description: "Navigate to your agent's configuration page",
      action: null,
    },
    {
      title: `Paste into ${item.type === "skill" ? "Skills" : "System Prompt"}`,
      description: `Locate the ${item.type} section and paste the code`,
      action: null,
    },
  ];

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[500px] w-full border-neutral-02">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            Add {item.type === "skill" ? "Skill" : "Prompt"} to Agent
          </ModalTitle>
          <p className="text-sm text-neutral-tertiary">
            Follow these steps to equip this {item.type} on your agent.
          </p>
        </ModalHeader>

        <div className="flex flex-col gap-6 mt-2 relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-neutral-02 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-02 border border-neutral-03 text-sm font-bold text-neutral-primary shrink-0 z-10">
                  {index + 1}
                </div>
              </div>
              <div className="flex flex-col flex-1 pb-2">
                <h4 className="text-sm font-semibold text-neutral-primary">
                  {step.title}
                </h4>
                <p className="text-sm text-neutral-tertiary">
                  {step.description}
                </p>
                {step.action}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
