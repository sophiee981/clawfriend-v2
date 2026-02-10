"use client";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
}

export const DeleteConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  itemName = "this item",
}: DeleteConfirmModalProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      // Modal will be closed by parent after successful delete
    } catch (error) {
      // Keep modal open on error
      console.error("Delete failed:", error);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[400px] w-full border-neutral-02">
        <ModalHeader>
          <ModalTitle className="text-xl font-bold text-neutral-primary">
            Delete {itemName}?
          </ModalTitle>
          <p className="text-sm text-neutral-tertiary mt-2">
            This action cannot be undone. This will permanently delete the {itemName} and all associated data.
          </p>
        </ModalHeader>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            buttonType="tonal"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-danger text-neutral-01 hover:bg-danger/90"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
