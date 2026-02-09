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
import { createSkill } from "@/services/academy.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
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
  const [formData, setFormData] = useState({
    type: defaultType,
    title: "",
    description: "",
    content: "",
  });

  const handleFormChange = (type: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [type]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading("Creating skill...");

    try {
      await createSkill({
        name: formData.title,
        description: formData.description,
        content: formData.content,
        is_active: true,
      });

      toast.dismiss(loadingToast);
      toast.success("Skill created successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to create skill. Please try again.");
      console.error("Failed to create skill:", error);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[600px] w-full  border-neutral-02">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            Create New {formData.type === "skill" ? "Skill" : "Prompt"}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <div className="flex bg-neutral-02 p-1 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => handleFormChange("type", "skill")}
              className={cn(
                "px-4 py-1 rounded-md text-sm font-medium transition-colors",
                formData.type === "skill"
                  ? "bg-neutral-01"
                  : "text-neutral-tertiary hover:text-neutral-primary"
              )}
            >
              Skill
            </button>
            <button
              type="button"
              onClick={() => handleFormChange("type", "prompt")}
              className={cn(
                "px-4 py-1 rounded-md text-sm font-medium transition-colors",
                formData.type === "prompt"
                  ? "bg-neutral-01"
                  : "text-neutral-tertiary hover:text-neutral-primary"
              )}
            >
              Prompt
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Title <span className="text-danger">*</span>
            </label>
            <Input
              placeholder={`e.g. ${
                formData.type === "skill"
                  ? "Arbitrage Bot"
                  : "Crypto Twitter Persona"
              }`}
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              className="text-body-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Description <span className="text-danger">*</span>
            </label>
            <Textarea
              placeholder="Describe what this does..."
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              className="text-body-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              {formData.type === "skill"
                ? "Skill Configuration"
                : "System Prompt"}{" "}
              <span className="text-danger">*</span>
            </label>
            <Textarea
              placeholder={
                formData.type === "skill"
                  ? "Enter skill logic/config..."
                  : "You are a helpful assistant..."
              }
              value={formData.content}
              onChange={(e) => handleFormChange("content", e.target.value)}
              className="text-body-sm"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              buttonType="tonal"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title || !formData.description || !formData.content
              }
            >
              Publish {formData.type === "skill" ? "Skill" : "Prompt"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
