"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";
import { useState } from "react";
import { AcademyItemType } from "../data";

interface CreateAcademyItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: AcademyItemType;
}

export const CreateAcademyItemModal = ({
  open,
  onOpenChange,
  defaultType = "skill",
}: CreateAcademyItemModalProps) => {
  const [type, setType] = useState<AcademyItemType>(defaultType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log({ type, title, description, content, price, tags });
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[600px] w-full bg-neutral-01 border-neutral-02">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            Create New {type === "skill" ? "Skill" : "Prompt"}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <div className="flex bg-neutral-02 p-1 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setType("skill")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                type === "skill"
                  ? "bg-neutral-primary text-neutral-01"
                  : "text-neutral-tertiary hover:text-neutral-primary",
              )}
            >
              Skill
            </button>
            <button
              type="button"
              onClick={() => setType("prompt")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                type === "prompt"
                  ? "bg-neutral-primary text-neutral-01"
                  : "text-neutral-tertiary hover:text-neutral-primary",
              )}
            >
              Prompt
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Title
            </label>
            <Input
              placeholder={`e.g. ${type === "skill" ? "Arbitrage Bot" : "Crypto Twitter Persona"}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-neutral-02 border-transparent focus:border-neutral-03"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Description
            </label>
            <Textarea
              placeholder="Describe what this does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-neutral-02 border-transparent focus:border-neutral-03 min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              {type === "skill" ? "Skill Configuration" : "System Prompt"}
            </label>
            <Textarea
              placeholder={
                type === "skill"
                  ? "Enter skill logic/config..."
                  : "You are a helpful assistant..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-neutral-02 border-transparent focus:border-neutral-03 min-h-[150px] font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Tags
            </label>
            <Input
              placeholder="Comma separated"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-neutral-02 border-transparent focus:border-neutral-03"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              buttonType="tonal"
              onClick={() => onOpenChange(false)}
              className="bg-neutral-02 hover:bg-neutral-03 text-neutral-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-primary text-white hover:bg-brand-secondary"
            >
              Publish {type === "skill" ? "Skill" : "Prompt"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
