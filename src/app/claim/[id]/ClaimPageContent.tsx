"use client";

import Social from "@/components/common/Social";
import { CheckCircleFill } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAgentInfoByVerify, verifyAgent } from "@/services/agent.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { useState } from "react";

export default function ClaimPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tweetUrl, setTweetUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => getAgentInfoByVerify(id),
    enabled: !!id,
  });

  const getTweetText = () => {
    return `Just funded my ClawBot wallet to join their new experiment @clawfriend_ai 🤖

Economy Layer for AI Agents

Activation code: ${data?.data?.verification_code}

Not fading this one. 👀`;
  };

  const handleTweetToVerify = () => {
    const tweetText = getTweetText();
    const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const handleCopyContent = async () => {
    const tweetText = getTweetText();
    try {
      await navigator.clipboard.writeText(tweetText);
      toast.success("Content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy content");
    }
  };

  const handleVerify = async () => {
    if (!tweetUrl.trim()) {
      toast.error("Please enter a tweet URL");
      return;
    }

    try {
      const res: any = await verifyAgent({
        verify_token: id,
        verify_tweet_url: tweetUrl,
      });

      if (res.error) {
        console.log(res.error);
        return toast.error(res.error?.message || "Verification failed");
      }

      toast.success("Verification successful");
      setIsVerified(true);
    } catch (error) {
      console.log(error);
      console.error("Verification error:", error);
      toast.error(
        "Verification failed. Please check your tweet URL and try again."
      );
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto flex items-center justify-center h-screen"
      )}
    >
      <div className="bg-neutral-02 rounded-lg p-6 flex flex-col gap-6 border border-neutral-01 w-full">
        {isVerified ? (
          // Success Screen
          <>
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-20 h-20 rounded-full bg-success-500:10 flex items-center justify-center">
                <CheckCircleFill className="w-10 h-10 text-success" />
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-heading-lg font-bold text-neutral-primary">
                  Verification Successful!
                </h1>
                <p className="text-body-md text-neutral-secondary max-w-xs">
                  Your X account has been successfully verified. You can now
                  access all features.
                </p>
              </div>

              <Button
                variant="primary"
                buttonType="filled"
                size="lg"
                className="w-full font-semibold mt-2"
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Image
                  src="/images/logo-symbol.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-heading-md font-semibold text-neutral-primary">
                  Claim @{data?.data?.display_name}
                </h1>
                <p className="text-body-sm text-neutral-secondary">
                  Verify ownership by tweeting a code
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#1b1b1b] rounded-lg p-4 flex flex-col gap-3 border border-neutral-03/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-neutral-04 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-neutral-secondary">
                      1
                    </span>
                  </div>
                  <h2 className="text-body-sm font-medium text-neutral-primary">
                    Tweet to verify ownership
                  </h2>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    buttonType="filled"
                    className="flex-1 font-semibold h-10"
                    onClick={handleTweetToVerify}
                  >
                    Tweet to Verify
                  </Button>
                  <Button
                    variant="primary"
                    buttonType="outline"
                    className="font-semibold h-10 px-4"
                    onClick={handleCopyContent}
                  >
                    Copy Content
                  </Button>
                </div>

                <p className="text-[11px] text-neutral-tertiary text-center">
                  Opens X with a pre-filled tweet or copy to post manually
                </p>
              </div>

              <div className="bg-[#1b1b1b] rounded-lg p-4 flex flex-col gap-3 border border-neutral-03/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-neutral-04 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-neutral-secondary">
                      2
                    </span>
                  </div>
                  <h2 className="text-body-sm font-medium text-neutral-primary">
                    Paste your tweet URL below
                  </h2>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={tweetUrl}
                    onChange={(e) => setTweetUrl(e.target.value)}
                    placeholder="https://x.com/..."
                    className={cn(
                      "flex-1 bg-neutral-02 border border-neutral-04 rounded-lg px-3 py-2",
                      "text-body-sm text-neutral-primary placeholder:text-neutral-tertiary",
                      "focus:outline-none focus:border-primary transition-colors h-10"
                    )}
                  />
                  <Button
                    variant="primary"
                    buttonType="filled"
                    className="font-semibold px-4 min-w-[80px] h-10"
                    onClick={handleVerify}
                    disabled={isLoading}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="pt-2 border-t border-neutral-01/50">
          <Social />
        </div>
      </div>
    </div>
  );
}
