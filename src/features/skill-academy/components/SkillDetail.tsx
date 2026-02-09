"use client";

import { ArrowLeft, Copy } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Use next/navigation for app router
import { useState } from "react";
import { MOCK_PROMPTS, MOCK_SKILLS } from "../data";
import { AddToAgentModal } from "./AddToAgentModal";

interface SkillDetailProps {
  itemId: string;
}

export const SkillDetail = ({ itemId }: SkillDetailProps) => {
  const router = useRouter();
  const [isAddToAgentOpen, setIsAddToAgentOpen] = useState(false);

  // Find item in both lists
  const item = [...MOCK_SKILLS, ...MOCK_PROMPTS].find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-neutral-tertiary">Item not found</p>
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
            variant={item.type === "skill" ? "custom-indigo" : "custom-teal"}
            type="tonal"
            className="capitalize px-3 py-1"
          >
            {item.type}
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
            {item.title}
          </h1>
          <p className="text-body-lg text-neutral-secondary">
            {item.description}
          </p>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 p-3 bg-neutral-02/50 rounded-xl w-fit pr-6">
          <Avatar className="h-10 w-10 border border-neutral-03">
            <AvatarImage src={item.author.avatar} alt={item.author.name} />
            <AvatarFallback>{item.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-body-sm-bold text-neutral-primary">
              {item.author.name}
            </span>
            <span className="text-body-xs text-neutral-tertiary font-mono">
              {item.author.handle}
            </span>
          </div>
        </div>

        {/* Dynamic Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-neutral-02 text-neutral-tertiary font-normal"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Detailed Content / Configuration Preview */}
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-heading-xs text-neutral-primary font-semibold">
            {item.type === "skill" ? "Configuration" : "System Prompt"}
          </h3>
          <div className="bg-neutral-01 border border-neutral-02 rounded-xl p-4 overflow-x-auto relative group">
            <pre className="text-xs md:text-sm font-mono text-neutral-secondary whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
              {item.content}
            </pre>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 bg-neutral-02 hover:bg-neutral-03 border border-neutral-03"
                onClick={() => navigator.clipboard.writeText(item.content)}
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
              <span className="text-body-md font-medium">{item.likes}</span>
              <span className="text-body-sm text-neutral-tertiary">Likes</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-secondary">
              <Download className="h-5 w-5 text-neutral-tertiary" />
              <span className="text-body-md font-medium">{item.uses}</span>
              <span className="text-body-sm text-neutral-tertiary">Uses</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-brand-primary text-white hover:bg-brand-secondary w-full md:w-auto px-8 shadow-lg shadow-brand-primary/20"
            onClick={() => setIsAddToAgentOpen(true)}
          >
            Add {item.type === "skill" ? "Skill" : "Prompt"} to Agent
          </Button>
        </div>
      </div>

      <AddToAgentModal
        open={isAddToAgentOpen}
        onOpenChange={setIsAddToAgentOpen}
        item={item}
      />
    </div>
  );
};
