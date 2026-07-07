import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/form-fields";
import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title?: string;
  description?: React.ReactNode;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title = "Delete Item",
  description = "Are you sure you want to delete this? This action cannot be undone.",
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 bg-card backdrop-blur-xl gap-0">
        <DialogHeader className="p-5 gap-1">
          <div className="flex items-center gap-2 text-destructive">
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="p-5 border-t sticky bottom-0 shrink-0 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </Button>
          <SubmitButton
            type="button"
            onClick={onConfirm}
            isPending={isPending}
            loadingText="Deleting..."
          >
            Delete
          </SubmitButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
