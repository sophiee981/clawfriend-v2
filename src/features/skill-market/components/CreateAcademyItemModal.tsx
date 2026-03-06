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
import { createSkill, updateSkill, newVersionSkill } from "@/services/academy.service";
import { getSkill } from "@/services";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useEffect, useState } from "react";
import { AcademyItem, AcademyItemType } from "../type";
import { useQuery } from "@tanstack/react-query";

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
  editItem,
  onSuccess,
}: CreateAcademyItemModalProps) => {
  const isEditMode = !!editItem;

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    version_number: "",
  });
  const [versionError, setVersionError] = useState<string>("");
  const [resolvedVersionId, setResolvedVersionId] = useState<string | undefined>(undefined);
  const [isNewVersion, setIsNewVersion] = useState<boolean>(false);
  const [hasUserModified, setHasUserModified] = useState<boolean>(false);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [originalVersionNumber, setOriginalVersionNumber] = useState<string>("");
  const [newVersionContent, setNewVersionContent] = useState<string>("");
  const [newVersionNumber, setNewVersionNumber] = useState<string>("");

  const { data: skillDetail } = useQuery({
    queryKey: ["skill", editItem?.id],
    queryFn: async () => {
      if (!editItem?.id) return null;
      const response = await getSkill(editItem.id);
      return response.data;
    },
    enabled: !!editItem && open,
  });

  useEffect(() => {
    if (editItem?.version_id) {
      setResolvedVersionId(editItem.version_id);
    } else if (skillDetail?.versions?.length) {
      setResolvedVersionId(skillDetail.versions[0].id);
    }
  }, [editItem?.version_id, skillDetail]);

  useEffect(() => {
    if (!open) {
      setHasUserModified(false);
      setNewVersionContent("");
      setNewVersionNumber("");
      return;
    }

    if (editItem && !hasUserModified) {
      let content = editItem.content;
      let version_number = editItem.version_number || "";

      if (skillDetail?.versions?.length) {
        const versionId = resolvedVersionId || editItem.version_id || skillDetail.versions[0].id;
        const selectedVersion = skillDetail.versions.find(v => v.id === versionId);
        if (selectedVersion) {
          if (selectedVersion.content) content = selectedVersion.content;
          if (selectedVersion.versionNumber) version_number = selectedVersion.versionNumber;
        }
      }

      setFormData({ name: editItem.title, content, version_number });
      setOriginalContent(content);
      setOriginalVersionNumber(version_number);
      setVersionError("");
      setIsNewVersion(false);
      setNewVersionContent("");
      setNewVersionNumber("");
    } else if (!editItem) {
      setFormData({ name: "", content: "", version_number: "" });
      setVersionError("");
      setIsNewVersion(false);
      setHasUserModified(false);
      setNewVersionContent("");
      setNewVersionNumber("");
    }
  }, [editItem, open, skillDetail, resolvedVersionId, hasUserModified]);

  const validateVersionNumber = (version: string): boolean => {
    if (!version) return true;
    return /^\d+\.\d+\.\d+$/.test(version);
  };

  const checkVersionExists = (version: string): boolean => {
    if (!version || !skillDetail?.versions) return false;
    return skillDetail.versions.some(
      (v) => v.versionNumber.toLowerCase() === version.toLowerCase()
    );
  };

  const handleFormChange = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (key === "version_number") {
      const v = value as string;
      if (!v) {
        setVersionError("");
      } else if (!validateVersionNumber(v)) {
        setVersionError("Version number must be in format 1.0.0");
      } else if (isEditMode && isNewVersion && checkVersionExists(v)) {
        setVersionError("This version number already exists.");
      } else {
        setVersionError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.version_number) {
      if (!validateVersionNumber(formData.version_number)) {
        setVersionError("Version number must be in format 1.0.0");
        return;
      }
      if (isEditMode && isNewVersion && checkVersionExists(formData.version_number)) {
        setVersionError("This version number already exists.");
        return;
      }
    }

    const loadingToast = toast.loading(
      editItem
        ? isNewVersion ? "Creating new version..." : "Updating skill..."
        : "Creating skill..."
    );

    try {
      if (editItem) {
        if (isNewVersion) {
          await newVersionSkill(editItem.id, {
            name: formData.name,
            content: formData.content,
            version_number: formData.version_number,
          });
          toast.dismiss(loadingToast);
          toast.success("New version created successfully!");
        } else {
          const versionId = resolvedVersionId || editItem.version_id;
          if (!versionId) {
            toast.dismiss(loadingToast);
            toast.error("Version ID is required. Please wait while we fetch skill details...");
            return;
          }
          await updateSkill(editItem.id, versionId, {
            name: formData.name,
            content: formData.content,
            version_number: formData.version_number,
            type: "skill",
          });
          toast.dismiss(loadingToast);
          toast.success("Skill updated successfully!");
        }
      } else {
        await createSkill({
          name: formData.name,
          content: formData.content,
          is_active: true,
          type: "skill",
          visibility: "public",
          version_number: formData.version_number,
        });
        toast.dismiss(loadingToast);
        toast.success("Skill created successfully!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        editItem ? "Failed to update skill. Please try again." : "Failed to create skill. Please try again."
      );
      console.error(error);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[600px] w-full border-neutral-02 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            {editItem ? "Edit" : "Create New"} Skill
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          {isEditMode && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-primary">
                Edit Mode
              </label>
              <div className="bg-[#1b1b1b] rounded-[8px] flex gap-[2px] w-fit">
                <button
                  type="button"
                  onClick={() => {
                    if (isNewVersion) {
                      setNewVersionContent(formData.content);
                      setNewVersionNumber(formData.version_number);
                    }
                    setIsNewVersion(false);
                    setHasUserModified(true);
                    setFormData((prev) => ({
                      ...prev,
                      content: originalContent,
                      version_number: originalVersionNumber,
                    }));
                  }}
                  className={cn(
                    "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[120px]",
                    !isNewVersion
                      ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                      : "bg-[#1b1b1b] text-[#717171]"
                  )}
                >
                  Edit Version
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewVersion(true);
                    setHasUserModified(true);
                    setFormData((prev) => ({
                      ...prev,
                      content: newVersionContent || "",
                      version_number: newVersionNumber || "",
                    }));
                  }}
                  className={cn(
                    "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[120px]",
                    isNewVersion
                      ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                      : "bg-[#1b1b1b] text-[#717171]"
                  )}
                >
                  New Version
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Name <span className="text-danger">*</span>
            </label>
            <Input
              placeholder="e.g. Arbitrage Bot"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className="text-body-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Skill <span className="text-danger">*</span>
            </label>
            <div className="rounded-xl border border-neutral-02 bg-neutral-01 overflow-hidden">
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => handleFormChange("content", value || "")}
                placeholder="Enter skill logic/config..."
                height={300}
                className="[&_.w-md-editor]:bg-transparent [&_.w-md-editor-text-textarea]:bg-transparent [&_.w-md-editor-text-textarea]:text-neutral-primary [&_.w-md-editor-text-textarea]:placeholder:text-neutral-tertiary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              Version number {isEditMode && isNewVersion && <span className="text-danger">*</span>}
            </label>
            <Input
              placeholder="e.g. 1.2.1"
              value={formData.version_number}
              onChange={(e) => handleFormChange("version_number", e.target.value)}
              className={cn(
                "text-body-sm",
                versionError && "border-danger focus:border-danger"
              )}
            />
            {versionError && (
              <p className="text-xs text-danger">{versionError}</p>
            )}
            {isEditMode && isNewVersion && !formData.version_number && (
              <p className="text-xs text-neutral-tertiary">Version number is required for new version</p>
            )}
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
                !formData.name ||
                !formData.content ||
                !!versionError ||
                (isEditMode && isNewVersion && !formData.version_number)
              }
            >
              {editItem ? (isNewVersion ? "Create New Version" : "Update") : "Publish"} Skill
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
