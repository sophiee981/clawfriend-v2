"use client";

import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  SocialX,
  Telegram,
  WarningFill,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useRouter } from "@bprogress/next/app";
import { useState } from "react";
import { toast } from "sonner";

const reportReasons = [
  { id: "spam", label: "Spam or misleading" },
  { id: "harassment", label: "Harassment or hate speech" },
  { id: "violence", label: "Violence or dangerous content" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "copyright", label: "Copyright violation" },
  { id: "other", label: "Other" },
];

export const FeedDetailHeader = () => {
  const router = useRouter();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState<string>("");

  const handleBack = () => router.push("/feeds");

  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const text = "Check out this feed on ClawFriend!";

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(currentUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(text)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
      setShareModalOpen(false);
    }
  };

  const handleReport = () => {
    if (!selectedReportReason) {
      toast.error("Please select a reason for reporting", {
        duration: 2000,
        className: "bg-neutral-01 border-neutral-02 text-neutral-primary",
      });
      return;
    }

    // Simulate report submission
    toast.success("Report submitted successfully. We'll review it shortly.", {
      duration: 3000,
      className: "bg-neutral-01 border-neutral-02 text-neutral-primary",
    });
    setReportModalOpen(false);
    setSelectedReportReason("");
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-02 bg-neutral-01">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-primary" />
            <span className="text-label-sm">Back to Feeds</span>
          </button>
          <span className="sm:hidden block text-heading-sm font-medium text-neutral-primary">
            Feeds
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50">
              <svg
                className="w-6 h-6 text-neutral-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-neutral-02 border-neutral-02 shadow-xl"
          >
            <DropdownMenuItem
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-danger-muted-20 focus:bg-danger-muted-20 text-neutral-primary rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-primary-500" />
              <div className="flex flex-col">
                <span className="font-medium">Share</span>
                <span className="text-xs text-neutral-secondary">
                  Share this feed
                </span>
              </div>
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator className="bg-neutral-900 my-1" />

            <DropdownMenuItem
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-danger-muted-20 focus:bg-danger-muted-20 text-danger rounded-lg transition-colors"
            >
              <WarningFill className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-medium">Report</span>
                <span className="text-xs text-neutral-tertiary">
                  Report inappropriate content
                </span>
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Share Modal */}
      <Modal open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <ModalContent className="max-w-md bg-modal border-none">
          <ModalHeader>
            <ModalTitle className="text-heading-lg text-neutral-primary">
              Share Feed
            </ModalTitle>
            <ModalDescription className="text-body-sm text-neutral-secondary">
              Choose a platform to share this feed
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-3 mt-6">
            <button
              onClick={() => handleShare("twitter")}
              className="group w-full flex items-center gap-4 p-4 rounded-lg bg-neutral-02 border border-neutral-02 hover:border-primary-muted hover:bg-neutral-03 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-03">
                <SocialX className="w-5 h-5 text-neutral-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-body-md font-semibold text-neutral-primary group-hover:text-primary transition-colors">
                  Share on X (Twitter)
                </p>
                <p className="text-body-sm text-neutral-tertiary">
                  Post to your timeline
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-tertiary group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => handleShare("telegram")}
              className="group w-full flex items-center gap-4 p-4 rounded-lg bg-neutral-02 border border-neutral-02 hover:border-primary-muted hover:bg-neutral-03 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-03">
                <Telegram className="w-5 h-5 text-neutral-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-body-md font-semibold text-neutral-primary group-hover:text-primary transition-colors">
                  Share on Telegram
                </p>
                <p className="text-body-sm text-neutral-tertiary">
                  Send to your contacts
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-tertiary group-hover:text-primary transition-colors" />
            </button>
          </div>
        </ModalContent>
      </Modal>

      {/* Report Modal */}
      <Modal open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <ModalContent className="max-w-md bg-modal border-none">
          <ModalHeader>
            <ModalTitle className="text-heading-lg text-neutral-primary flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-danger/20 to-danger/10 border border-danger/30">
                <WarningFill className="w-5 h-5 text-danger" />
              </div>
              Report Content
            </ModalTitle>
            <ModalDescription className="text-body-sm text-neutral-secondary">
              Help us keep the community safe by reporting inappropriate content
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-2.5 mt-6">
            {reportReasons.map((reason) => (
              <label
                key={reason.id}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedReportReason === reason.id
                    ? "border-primary bg-primary-muted-20 shadow-sm"
                    : "border-neutral-02 hover:border-primary-muted bg-neutral-02"
                  }`}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason.id}
                  checked={selectedReportReason === reason.id}
                  onChange={(e) => setSelectedReportReason(e.target.value)}
                  className="w-4 h-4 text-primary border-neutral-700 focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-body-md text-neutral-primary font-medium">
                  {reason.label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              buttonType="outline"
              size="lg"
              onClick={() => {
                setReportModalOpen(false);
                setSelectedReportReason("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              buttonType="filled"
              size="lg"
              onClick={handleReport}
              className="flex-1"
            >
              Submit Report
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
