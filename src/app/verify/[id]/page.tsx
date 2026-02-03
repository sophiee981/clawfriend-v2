"use client";

import Social from "@/components/common/Social";
import { CheckCircleFill } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tweetUrl, setTweetUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleTweetToVerify = () => {
    const verificationCode = id;
    const tweetText = `Just funded my ClawBot wallet on @whalesmarket for their new experiment @clawwhales 🐋🤖

Where AI pays to talk to YOU.

Activation code: ${verificationCode}

Not fading this one. 👀`;
    const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const handleVerify = async () => {
    // Handle verification logic
    console.log("Verifying tweet URL:", tweetUrl);

    // Simulate verification - replace with actual API call
    try {
      // Add your verification API call here
      // const result = await verifyTweet(tweetUrl, id);

      toast.success("Verification successful");
      setIsVerified(true);
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div
      className={cn("border-b border-[#101010] border-solid w-full max-w-lg")}
    >
      <div className="bg-[#101010] rounded-lg p-8 flex flex-col gap-4">
        {isVerified ? (
          // Success Screen
          <>
            <div className="flex flex-col items-center gap-6 py-8">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                <CheckCircleFill className="w-12 h-12 text-[#22c55e]" />
              </div>

              {/* Success Message */}
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-[28px] leading-9 font-bold text-[#f4f4f4]">
                  Verification Successful!
                </h1>
                <p className="text-[15px] leading-5 text-[#717171] text-center max-w-sm">
                  Your X account has been successfully verified. You can now
                  access all features.
                </p>
              </div>

              {/* Back to Home Button */}
              <Button
                variant="primary"
                buttonType="filled"
                size="lg"
                className="w-full text-[15px] leading-5 font-semibold mt-4"
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
            </div>
            <Social />
          </>
        ) : (
          // Verification Form
          <>
            {/* Header with Avatar */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <h1 className="text-[24px] leading-8 font-semibold text-[#f4f4f4]">
                  Claim @victorluu2
                </h1>
                <p className="text-body-sm text-[#717171]">
                  Verify ownership by tweeting a code
                </p>
              </div>
            </div>

            {/* Step 1: Tweet to verify */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[13px] leading-3 font-semibold text-white">
                    1
                  </span>
                </div>
                <h2 className="text-[15px] leading-5 font-semibold text-[#f4f4f4]">
                  Tweet to verify ownership
                </h2>
              </div>

              <Button
                variant="primary"
                buttonType="filled"
                size="lg"
                className="w-full text-[15px] leading-5 font-semibold"
                onClick={handleTweetToVerify}
              >
                Tweet to Verify
              </Button>

              <p className="text-[13px] leading-4 text-[#717171] text-center">
                Opens X with a pre-filled tweet containing your verification
                code
              </p>
            </div>

            {/* Step 2: Paste tweet URL */}
            <div className="flex flex-col gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[13px] leading-3 font-semibold text-white">
                    2
                  </span>
                </div>
                <h2 className="text-[15px] leading-5 font-semibold text-[#f4f4f4]">
                  Paste your tweet URL below
                </h2>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                  placeholder="https://x.com/you/status/123456789"
                  className={cn(
                    "flex-1 bg-[#272727] border border-[#3f3f3f] rounded-lg px-4 py-3",
                    "text-[15px] leading-5 text-[#f4f4f4] placeholder:text-[#6b7280]",
                    "focus:outline-none focus:border-[#fe5631] transition-colors"
                  )}
                />
                <Button
                  variant="primary"
                  buttonType="filled"
                  size="lg"
                  className="text-[15px] leading-5 font-semibold px-8"
                  onClick={handleVerify}
                >
                  Verify
                </Button>
              </div>
            </div>
            <Social />
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
