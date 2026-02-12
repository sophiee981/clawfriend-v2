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
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.clawfriend.ai";
      console.log("item", item);
      // Get version number from item
      const versionNumber = item.version_number || "";
      const versionParam = versionNumber ? `?v=${versionNumber}` : "";

      if (item.type === "skill") {
        contentToCopy = `1. Read file ~/.openclaw/workspace/skills/clawfriend/preferences/install-community-skill.md
2. Follow instruction and Download ClawFriend community skill: ${apiBaseUrl}/v1/skill-market/${item.id}/SKILL.md${versionParam}`;
      } else if (item.type === "workflow") {
        contentToCopy = `Learn workflow from ${apiBaseUrl}/v1/skill-market/${item.id}/WORKFLOW.md${versionParam}`;
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
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.clawfriend.ai";

    // Get version number from item
    console.log("item", item);
    const versionNumber = item.version_number || "";
    const versionParam = versionNumber ? `?v=${versionNumber}` : "";

    if (item.type === "skill") {
      return `1. Read file ~/.openclaw/workspace/skills/clawfriend/preferences/install-community-skill.md
2. Follow instruction and Download ClawFriend community skill: ${apiBaseUrl}/v1/skill-market/${item.id}/SKILL.md${versionParam}`;
    }

    if (item.type === "workflow") {
      return `Learn workflow from ${apiBaseUrl}/v1/skill-market/${item.id}/WORKFLOW.md${versionParam}`;
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
      description: `Copy the ${
        item.type === "skill"
          ? "skill"
          : item.type === "workflow"
            ? "workflow"
            : "Prompt"
      } content below`,
      action: (
        <div
          className="flex items-center gap-2 mt-2 w-full p-3 bg-neutral-02 rounded-lg border border-neutral-03 justify-between group cursor-pointer hover:border-neutral-primary transition-colors"
          onClick={handleCopy}
        >
          <code className="text-xs font-mono text-neutral-secondary max-w-[220px] sm:max-w-[350px] whitespace-pre-wrap break-words">
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
            Add{" "}
            {item.type === "skill"
              ? "Skill"
              : item.type === "workflow"
                ? "Workflow"
                : "Prompt"}{" "}
            to Agent
          </ModalTitle>
          <p className="text-sm text-neutral-tertiary">
            Follow these steps to equip this{" "}
            {item.type === "skill"
              ? "Skill"
              : item.type === "workflow"
                ? "Workflow"
                : "Prompt"}{" "}
            on your agent.
          </p>
        </ModalHeader>

        <div className="flex flex-col gap-3 sm:gap-6 mt-2 relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-4 w-[2px] bg-neutral-02 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-neutral-02 border border-neutral-03 text-xs sm:text-sm font-bold text-neutral-primary shrink-0 z-10">
                  {index + 1}
                </div>
              </div>
              <div className="flex flex-col flex-1 pb-2">
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-primary">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-tertiary">
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
