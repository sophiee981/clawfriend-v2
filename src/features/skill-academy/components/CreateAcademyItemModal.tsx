"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { createSkill, updateSkill } from "@/services/academy.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useEffect, useState } from "react";
import { AcademyItem, AcademyItemType } from "../type";

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
  const isEditMode = !!editItem;

  const [formData, setFormData] = useState({
    type: defaultType,
    title: "",
    content: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        type: editItem.type,
        title: editItem.title,
        content: editItem.content,
      });
    } else {
      setFormData({
        type: defaultType,
        title: "",
        content: "",
      });
    }
  }, [editItem, defaultType, open]);

  const handleFormChange = (type: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [type]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading(
      editItem ? "Updating skill..." : "Creating skill..."
    );

    try {
      if (editItem) {
        console.log(
          "Updating skill with ID:",
          editItem.id,
          "type:",
          typeof editItem.id
        );
        await updateSkill(editItem.id, {
          name: formData.title,
          content: formData.content,
          is_active: true,
        });
        toast.dismiss(loadingToast);
        toast.success("Skill updated successfully!");
      } else {
        await createSkill({
          name: formData.title,
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
      toast.error(
        editItem
          ? "Failed to update skill. Please try again."
          : "Failed to create skill. Please try again."
      );
      console.error(
        editItem ? "Failed to update skill:" : "Failed to create skill:",
        error
      );
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[600px] w-full  border-neutral-02 max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            {editItem ? "Edit" : "Create New"}{" "}
            {formData.type === "skill" ? "Skill" : "Prompt"}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          {!isEditMode && (
            <div className="bg-[#1b1b1b] rounded-[8px] flex gap-[2px] w-fit">
              <button
                type="button"
                onClick={() => handleFormChange("type", "prompt")}
                className={cn(
                  "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[100px]",
                  formData.type === "prompt"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]"
                )}
              >
                Prompt
              </button>
              <button
                type="button"
                onClick={() => handleFormChange("type", "skill")}
                className={cn(
                  "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[100px]",
                  formData.type === "skill"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]"
                )}
              >
                Skill
              </button>
            </div>
          )}

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
              {formData.type === "skill" ? "Skill" : "Prompt"}{" "}
              <span className="text-danger">*</span>
            </label>
            <div className="rounded-xl border border-neutral-02 bg-neutral-01 overflow-hidden">
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => handleFormChange("content", value || "")}
                placeholder={
                  formData.type === "skill"
                    ? "Enter skill logic/config..."
                    : "You are a helpful assistant..."
                }
                height={300}
                className="[&_.w-md-editor]:bg-transparent [&_.w-md-editor-text-textarea]:bg-transparent [&_.w-md-editor-text-textarea]:text-neutral-primary [&_.w-md-editor-text-textarea]:placeholder:text-neutral-tertiary"
              />
            </div>
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
              disabled={!formData.title || !formData.content}
            >
              {editItem ? "Update" : "Publish"}{" "}
              {formData.type === "skill" ? "Skill" : "Prompt"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
