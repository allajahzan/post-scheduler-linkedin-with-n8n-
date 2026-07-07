"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { SuggestionTopics } from "./suggestion-topics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitButton } from "../ui/form-fields";

interface SuggestionsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopics?: string[];
}

export function SuggestionsSettingsModal({
  isOpen,
  onClose,
  initialTopics = [],
}: SuggestionsSettingsModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
  const [showOther, setShowOther] = useState(false);
  const [customTopic, setCustomTopic] = useState("");

  const queryClient = useQueryClient();

  // stringify topics to avoid infinite loops if the prop reference changes on every render
  const initialTopicsStr = JSON.stringify(initialTopics);

  useEffect(() => {
    if (isOpen) {
      setSelectedTopics(initialTopics);
      setShowOther(false);
      setCustomTopic("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTopicsStr]);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic));
    } else {
      setSelectedTopics((prev) => [...prev, topic]);
    }
  };

  const updatePreferences = useMutation({
    mutationFn: async (topics: string[]) => {
      const res = await api.patch("/user/preferences", {
        suggestions_enabled: true,
        topics,
      });
      return res.data;
    },
    onSuccess: (_, newTopics) => {
      queryClient.setQueryData(["user"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          user: {
            ...old.user,
            preferences: {
              ...old.user.preferences,
              suggestions_enabled: true,
              topics: newTopics,
            },
          },
        };
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      toast.success("Topics updated");
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update preferences",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTopics = [...selectedTopics];
    if (showOther && customTopic.trim()) {
      const customTopics = customTopic
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      finalTopics = [...finalTopics, ...customTopics];
      finalTopics = Array.from(new Set(finalTopics));
    }

    if (finalTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    updatePreferences.mutate(finalTopics);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <DialogHeader className="p-5 border-b gap-1">
            <DialogTitle>Edit Topics</DialogTitle>
            <DialogDescription>
              Select the topics you usually post about. We'll find the latest
              news and generate high-quality post ideas for you.
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-5 overflow-y-auto">
            <SuggestionTopics
              selectedTopics={selectedTopics}
              toggleTopic={toggleTopic}
              showOther={showOther}
              setShowOther={setShowOther}
              customTopic={customTopic}
              setCustomTopic={setCustomTopic}
            />
          </div>

          <div className="p-5 border-t sticky bottom-0 shrink-0 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <SubmitButton
              isPending={updatePreferences.isPending}
              loadingText="Saving..."
            >
              Save Topics
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
