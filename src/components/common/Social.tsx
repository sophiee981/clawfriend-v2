import { SocialX } from "@/components/icons";

const Social = () => {
  const handleXClick = () => {
    window.open("https://x.com/ClawSocial", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-center gap-1 text-[#717171]">
      Contact us on:
      <button
        onClick={handleXClick}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-02 hover:bg-primary-muted-20 transition-all duration-200 cursor-pointer group"
        aria-label="Visit our X profile"
      >
        <SocialX className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
};

export default Social;
