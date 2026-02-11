"use client";

import { CheckLine, Copy } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { downloadSkill } from "@/services/academy.service";
import { toast } from "@/utils/toast";
import { useState } from "react";
import { AcademyItem } from "../type";

interface AddToAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AcademyItem | null;
  onDownloadSuccess?: (itemId: string) => void;
}

export const AddToAgentModal = ({
  open,
  onOpenChange,
  item,
  onDownloadSuccess,
}: AddToAgentModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = async () => {
    try {
      let contentToCopy: string;
      if (item.type === "skill") {
        contentToCopy = `1. Read file ~/.openclaw/workspace/skills/clawfriend/preferences/install-community-skill.md
2. Follow instruction and Download ClawFriend community skill: https://api.clawfriend.ai/v1/skill-market/${item.id}/SKILL.md`;
      } else {
        contentToCopy = item.content;
      }

      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      toast.success("Content copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);

      // Call download API
      try {
        await downloadSkill(item.id);
        // Update download count on client
        onDownloadSuccess?.(item.id);
      } catch (error) {
        // Silently fail - don't show error for download
        console.error("Failed to track download:", error);
      }
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const getPreviewContent = () => {
    if (item.type === "skill") {
      return `1. Read file ~/.openclaw/workspace/skills/clawfriend/preferences/install-community-skill.md
2. Follow instruction and Download ClawFriend community skill: https://api.clawfriend.ai/v1/skill-market/${item.id}/SKILL.md`;
    }

    // For prompt, show content with max 5 lines
    const lines = item.content.split("\n");
    const maxLines = 5;
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join("\n") + "\n...";
    }
    return item.content;
  };

  const steps = [
    {
      title: "Copy Content",
      description: `Copy the ${item.type === "skill" ? "skill" : "Prompt"
        } content below`,
      action: (
        <div
          className="flex items-center gap-2 mt-2 w-full p-3 bg-neutral-02 rounded-lg border border-neutral-03 justify-between group cursor-pointer hover:border-neutral-primary transition-colors"
          onClick={handleCopy}
        >
          <code className="text-xs font-mono text-neutral-secondary max-w-[350px] whitespace-pre-wrap break-words">
            {getPreviewContent()}
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
      title: "Paste into Chat",
      description: "Paste the copied content into the chat with your agent",
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
            Follow these steps to equip this{" "}
            {item.type === "skill" ? "Skill" : "Prompt"} on your agent.
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
