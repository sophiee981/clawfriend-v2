"use client";

import { ArrowLeft, Copy } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSkill } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Download, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Use next/navigation for app router
import { useState } from "react";
import { AddToAgentModal } from "./AddToAgentModal";

interface SkillDetailProps {
  itemId: string;
}

export const SkillDetail = ({ itemId }: SkillDetailProps) => {
  const router = useRouter();
  const [isAddToAgentOpen, setIsAddToAgentOpen] = useState(false);

  // Fetch skill data from API
  const {
    data: skill,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skill", itemId],
    queryFn: async () => {
      if (!itemId) throw new Error("Invalid skill ID");
      const response = await getSkill(itemId);
      // API interceptor returns response.data, so response is already GetSkillResponse
      // TypeScript doesn't know about interceptor, so we need to assert
      return response.data;
    },
    enabled: itemId !== null,
  });

  console.log(skill);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-neutral-tertiary">Loading skill...</p>
      </div>
    );
  }

  // Error state
  if (error || !itemId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-neutral-tertiary">
          {error ? "Failed to load skill" : "Invalid skill ID"}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Not found state
  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-neutral-tertiary">Skill not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 md:p-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          buttonType="ghost"
          size="sm"
          className="p-0 w-8 h-8 rounded-full hover:bg-neutral-02"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 text-neutral-secondary" />
        </Button>
        <span className="text-body-sm text-neutral-tertiary">
          Back to Academy
        </span>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col bg-bg-secondary border border-neutral-02 rounded-2xl p-6 md:p-8 gap-6 shadow-sm">
        {/* Top Row: Type Badge & Actions */}
        <div className="flex justify-between items-start">
          <Badge
            variant="custom-indigo"
            type="tonal"
            className="capitalize px-3 py-1"
          >
            skill
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              buttonType="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-neutral-tertiary hover:text-neutral-primary"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-lg text-neutral-primary font-bold">
            {skill.name}
          </h1>
          <p className="text-body-lg text-neutral-secondary">
            {skill.description}
          </p>
        </div>

        {/* Detailed Content / Configuration Preview */}
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-heading-xs text-neutral-primary font-semibold">
            Configuration
          </h3>
          <div className="bg-neutral-01 border border-neutral-02 rounded-xl p-4 overflow-x-auto relative group">
            <pre className="text-xs md:text-sm font-mono text-neutral-secondary whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
              {skill.content}
            </pre>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 bg-neutral-02 hover:bg-neutral-03 border border-neutral-03"
                onClick={() => navigator.clipboard.writeText(skill.content)}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Stats & CTA Footer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-neutral-02 mt-2">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-neutral-secondary">
              <Heart className="h-5 w-5 text-neutral-tertiary" />
              <span className="text-body-md font-medium">
                {skill.like_count}
              </span>
              <span className="text-body-sm text-neutral-tertiary">Likes</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-secondary">
              <Download className="h-5 w-5 text-neutral-tertiary" />
              <span className="text-body-md font-medium">
                {skill.download_count}
              </span>
              <span className="text-body-sm text-neutral-tertiary">Uses</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-brand-primary text-white hover:bg-brand-secondary w-full md:w-auto px-8 shadow-lg shadow-brand-primary/20"
            onClick={() => setIsAddToAgentOpen(true)}
          >
            {/* Add {item.type === "skill" ? "Skill" : "Prompt"} to Agent */}
          </Button>
        </div>
      </div>

      <AddToAgentModal
        open={isAddToAgentOpen}
        onOpenChange={setIsAddToAgentOpen}
        skill={skill}
      />
    </div>
  );
};
