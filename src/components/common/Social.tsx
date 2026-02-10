import { SocialX } from "@/components/icons";

const Social = () => {
  const handleXClick = () => {
    window.open("https://twitter.com/intent/user?screen_name=clawfriend_ai", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-center gap-1 text-[#717171]">
      <span className="text-[13px] leading-4 font-medium">Contact us on:</span>
      <button
        onClick={handleXClick}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-02 hover:bg-primary-muted-20 transition-all duration-200 cursor-pointer group"
        aria-label="Visit our X profile"
      >
        <SocialX className="text-sm text-primary group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
};

export default Social;
