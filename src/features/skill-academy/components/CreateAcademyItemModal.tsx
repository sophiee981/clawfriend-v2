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
import { createSkill, updateSkill } from "@/services/academy.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useState, useEffect } from "react";
import { AcademyItemType, AcademyItem } from "../data";

interface CreateAcademyItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: AcademyItemType;
  editItem?: AcademyItem | null;
  onSuccess?: () => void;
}

export const CreateAcademyItemModal = ({
  open,
  onOpenChange,
  defaultType = "skill",
  editItem,
  onSuccess,
}: CreateAcademyItemModalProps) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    title: "",
    description: "",
    content: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        type: editItem.type,
        title: editItem.title,
        description: editItem.description,
        content: editItem.content,
      });
    } else {
      setFormData({
        type: defaultType,
        title: "",
        description: "",
        content: "",
      });
    }
  }, [editItem, defaultType, open]);

  const handleFormChange = (type: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [type]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading(editItem ? "Updating skill..." : "Creating skill...");

    try {
      if (editItem) {
        console.log("Updating skill with ID:", editItem.id, "type:", typeof editItem.id);
        await updateSkill(editItem.id, {
          name: formData.title,
          description: formData.description,
          content: formData.content,
          is_active: true,
        });
        toast.dismiss(loadingToast);
        toast.success("Skill updated successfully!");
      } else {
        await createSkill({
          name: formData.title,
          description: formData.description,
          content: formData.content,
          is_active: true,
          type: formData.type,
        });
        toast.dismiss(loadingToast);
        toast.success("Skill created successfully!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(editItem ? "Failed to update skill. Please try again." : "Failed to create skill. Please try again.");
      console.error(editItem ? "Failed to update skill:" : "Failed to create skill:", error);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[600px] w-full  border-neutral-02">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            {editItem ? "Edit" : "Create New"} {formData.type === "skill" ? "Skill" : "Prompt"}
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
              {editItem ? "Update" : "Publish"} {formData.type === "skill" ? "Skill" : "Prompt"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
