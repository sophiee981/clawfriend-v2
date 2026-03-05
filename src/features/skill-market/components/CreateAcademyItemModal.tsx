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
import { createSkill, updateSkill, updateVisibility, newVersionSkill } from "@/services/academy.service";
import { getSkill } from "@/services";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useEffect, useState } from "react";
import { AcademyItem, AcademyItemType } from "../type";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    name: "",
    content: "",
    version_number: "",
    visibility: "public" as "public" | "private",
  });
  const [versionError, setVersionError] = useState<string>("");
  const [resolvedVersionId, setResolvedVersionId] = useState<string | undefined>(undefined);
  const [isNewVersion, setIsNewVersion] = useState<boolean>(false);
  const [hasUserModified, setHasUserModified] = useState<boolean>(false);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [originalVersionNumber, setOriginalVersionNumber] = useState<string>("");
  const [newVersionContent, setNewVersionContent] = useState<string>("");
  const [newVersionNumber, setNewVersionNumber] = useState<string>("");

  // Fetch skill detail when editing to get versions list
  const { data: skillDetail } = useQuery({
    queryKey: ["skill", editItem?.id],
    queryFn: async () => {
      if (!editItem?.id) return null;
      const response = await getSkill(editItem.id);
      return response.data;
    },
    enabled: !!editItem && open,
  });

  // Resolve version_id from skill detail
  useEffect(() => {
    if (editItem?.version_id) {
      setResolvedVersionId(editItem.version_id);
    } else if (skillDetail) {
      if (skillDetail.versions && skillDetail.versions.length > 0) {
        setResolvedVersionId(skillDetail.versions[0].id);
      }
    }
  }, [editItem?.version_id, skillDetail]);

  useEffect(() => {
    // Only restore data when modal opens (not when switching between edit/new version modes)
    if (!open) {
      setHasUserModified(false);
      setNewVersionContent("");
      setNewVersionNumber("");
      return;
    }

    if (editItem && !hasUserModified) {
      // Convert "publish" to "public" for backward compatibility
      const visibilityValue = editItem.visibility as string | undefined;
      const visibility = visibilityValue === "publish"
        ? "public"
        : (editItem.visibility ?? "public");

      // Get content from version if skillDetail is available and has versions
      let content = editItem.content;
      if (skillDetail && skillDetail.versions && skillDetail.versions.length > 0) {
        const versionId = resolvedVersionId || editItem.version_id || skillDetail.versions[0].id;
        const selectedVersion = skillDetail.versions.find(v => v.id === versionId);
        if (selectedVersion && selectedVersion.content) {
          content = selectedVersion.content;
        }
      }

      // Get version_number from version if available
      let version_number = editItem.version_number || "";
      if (skillDetail && skillDetail.versions && skillDetail.versions.length > 0) {
        const versionId = resolvedVersionId || editItem.version_id || skillDetail.versions[0].id;
        const selectedVersion = skillDetail.versions.find(v => v.id === versionId);
        if (selectedVersion && selectedVersion.versionNumber) {
          version_number = selectedVersion.versionNumber;
        }
      }

      setFormData({
        type: editItem.type,
        name: editItem.title,
        content: content,
        version_number: version_number,
        visibility: visibility as "public" | "private",
      });
      setOriginalContent(content);
      setOriginalVersionNumber(version_number);
      setVersionError("");
      setIsNewVersion(false);
      setNewVersionContent("");
      setNewVersionNumber("");
    } else if (!editItem) {
      setFormData({
        type: defaultType,
        name: "",
        content: "",
        version_number: "",
        visibility: "public",
      });
      setVersionError("");
      setIsNewVersion(false);
      setHasUserModified(false);
      setNewVersionContent("");
      setNewVersionNumber("");
    }
  }, [editItem, defaultType, open, skillDetail, resolvedVersionId, hasUserModified]);

  const validateVersionNumber = (version: string): boolean => {
    if (!version) return true; // Optional field, empty is valid
    const versionPattern = /^\d+\.\d+\.\d+$/;
    return versionPattern.test(version);
  };

  const checkVersionExists = (version: string): boolean => {
    if (!version || !skillDetail?.versions) return false;
    return skillDetail.versions.some(
      (v) => v.versionNumber.toLowerCase() === version.toLowerCase()
    );
  };

  const handleFormChange = <K extends keyof typeof formData>(
    type: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [type]: value }));

    // Validate version_number
    if (type === "version_number") {
      const versionValue = value as string;
      if (!versionValue) {
        setVersionError("");
      } else if (!validateVersionNumber(versionValue)) {
        setVersionError("Version number must be in format 1.0.0 (e.g. 1.0.0, 2.3.4)");
      } else if (isEditMode && isNewVersion && checkVersionExists(versionValue)) {
        setVersionError("This version number already exists. Please use a different version number.");
      } else {
        setVersionError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate version_number before submit
    if (formData.version_number) {
      if (!validateVersionNumber(formData.version_number)) {
        setVersionError("Version number must be in format 1.2.1 (e.g. 1.0.0, 2.3.4)");
        return;
      }
      if (isEditMode && isNewVersion && checkVersionExists(formData.version_number)) {
        setVersionError("This version number already exists. Please use a different version number.");
        return;
      }
    }

    const loadingToast = toast.loading(
      editItem
        ? isNewVersion
          ? `Creating new version of ${formData.type}...`
          : `Updating ${formData.type}...`
        : `Creating ${formData.type}...`
    );

    try {
      if (editItem) {
        if (isNewVersion) {
          // Create new version
          await newVersionSkill(editItem.id, {
            name: formData.name,
            content: formData.content,
            version_number: formData.version_number,
            type: formData.type,
          });
          toast.dismiss(loadingToast);
          toast.success(`New version of ${formData.type === "skill" ? "Skill" : formData.type === "workflow" ? "Workflow" : "Prompt"} created successfully!`);
        } else {
          // Update existing version
          const versionId = resolvedVersionId || editItem.version_id;
          if (!versionId) {
            toast.dismiss(loadingToast);
            toast.error("Version ID is required for update. Please wait while we fetch the skill details...");
            return;
          }
          console.log(
            "Updating skill with ID:",
            editItem.id,
            "version ID:",
            versionId
          );
          await updateSkill(editItem.id, versionId, {
            name: formData.name,
            content: formData.content,
            version_number: formData.version_number,
            type: formData.type,
          });
          await updateVisibility(editItem.id, formData.visibility);
          toast.dismiss(loadingToast);
          toast.success(`${formData.type === "skill" ? "Skill" : formData.type === "workflow" ? "Workflow" : "Prompt"} updated successfully!`);
        }
      } else {
        await createSkill({
          name: formData.name,
          type: formData.type,
          content: formData.content,
          is_active: true,
          visibility: formData.visibility,
          version_number: formData.version_number,
        });
        toast.dismiss(loadingToast);
        toast.success(`${formData.type === "skill" ? "Skill" : formData.type === "workflow" ? "Workflow" : "Prompt"} created successfully!`);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.dismiss(loadingToast);
      const itemType = formData.type === "skill" ? "skill" : formData.type === "workflow" ? "workflow" : "prompt";
      toast.error(
        editItem
          ? `Failed to update ${itemType}. Please try again.`
          : `Failed to create ${itemType}. Please try again.`
      );
      console.error(
        editItem ? `Failed to update ${itemType}:` : `Failed to create ${itemType}:`,
        error
      );
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[600px] w-full  border-neutral-02 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            {editItem ? "Edit" : "Create New"}{" "}
            {formData.type === "skill"
              ? "Skill"
              : formData.type === "workflow"
                ? "Workflow"
                : "Prompt"}
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          {!isEditMode && (
            <div className="bg-[#1b1b1b] rounded-[8px] flex gap-[2px] w-fit">
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
              <button
                type="button"
                onClick={() => handleFormChange("type", "workflow")}
                className={cn(
                  "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[100px]",
                  formData.type === "workflow"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]"
                )}
              >
                Workflow
              </button>

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


            </div>
          )}

          {isEditMode && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-primary">
                Edit Mode
              </label>
              <div className="bg-[#1b1b1b] rounded-[8px] flex gap-[2px] w-fit">
                <button
                  type="button"
                  onClick={() => {
                    // Save current content and version before switching back to Edit Version
                    if (isNewVersion) {
                      const currentContent = formData.content;
                      const currentVersion = formData.version_number;
                      setNewVersionContent(currentContent);
                      setNewVersionNumber(currentVersion);
                    }
                    setIsNewVersion(false);
                    setHasUserModified(true);
                    // Restore original content and version when switching back to Edit Version
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
                    // Restore saved new version content if exists, otherwise clear
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
              placeholder={`e.g. ${formData.type === "skill"
                ? "Arbitrage Bot"
                : formData.type === "workflow"
                  ? "Trading Workflow"
                  : "Crypto Twitter Persona"
                }`}
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className="text-body-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-primary">
              {formData.type === "skill"
                ? "Skill"
                : formData.type === "workflow"
                  ? "Workflow"
                  : "Prompt"}{" "}
              <span className="text-danger">*</span>
            </label>
            <div className="rounded-xl border border-neutral-02 bg-neutral-01 overflow-hidden">
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => handleFormChange("content", value || "")}
                placeholder={
                  formData.type === "skill"
                    ? "Enter skill logic/config..."
                    : formData.type === "workflow"
                      ? "Enter workflow configuration..."
                      : "You are a helpful assistant..."
                }
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
              onChange={(e) =>
                handleFormChange("version_number", e.target.value)
              }
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

          {!(isEditMode && isNewVersion) && (
            <TooltipProvider>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-neutral-primary">
                    Visibility
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full p-1 text-neutral-tertiary hover:text-neutral-primary hover:bg-neutral-02 transition-colors"
                        aria-label="Visibility information"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <div className="flex flex-col gap-1 text-xs">
                        <p className="font-bold">
                          <span className="font-bold">Public</span>: Anyone can use this
                        </p>
                        <p className="font-bold">
                          <span className="font-bold">Private</span>: Only those who purchase shares can use this
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="bg-[#1b1b1b] rounded-[8px] flex gap-[2px] mt-1 w-fit">
                  <button
                    type="button"
                    onClick={() => handleFormChange("visibility", "public")}
                    className={cn(
                      "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[100px]",
                      formData.visibility === "public"
                        ? "bg-[rgba(34,197,94,0.2)] text-success"
                        : "bg-[#1b1b1b] text-[#717171]"
                    )}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormChange("visibility", "private")}
                    className={cn(
                      "px-4 py-1 rounded-[8px] text-sm font-medium transition-colors min-w-[100px]",
                      formData.visibility === "private"
                        ? "bg-[rgba(250,204,21,0.2)] text-yellow"
                        : "bg-[#1b1b1b] text-[#717171]"
                    )}
                  >
                    Private
                  </button>
                </div>
              </div>
            </TooltipProvider>
          )}

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
              {editItem
                ? isNewVersion
                  ? "Create New Version"
                  : "Update"
                : "Publish"}{" "}
              {formData.type === "skill"
                ? "Skill"
                : formData.type === "workflow"
                  ? "Workflow"
                  : "Prompt"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
