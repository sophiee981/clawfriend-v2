"use client";

import { getAvatarUrl } from "@/utils";

export interface HotSkill {
  id: string;
  name: string;
  authorName: string;
  authorUsername: string;
  stars: number;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 1.167l1.575 3.191 3.52.513-2.547 2.483.601 3.505L7 9.142l-3.149 1.717.601-3.505L1.905 4.871l3.52-.513L7 1.167z"
        fill="#facc15"
        stroke="#facc15"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
  return n.toLocaleString();
}

interface HotSkillCardProps {
  skill: HotSkill;
}

export const HotSkillCard = ({ skill }: HotSkillCardProps) => {
  return (
    <div className="border border-neutral-02 rounded-lg overflow-hidden hover:bg-neutral-800 transition-colors cursor-pointer">
      <div className="flex gap-4 items-center p-4">
        {/* Author avatar */}
        <span
          className="rounded-full flex-shrink-0 overflow-hidden"
          style={{ width: '40px', height: '40px', minWidth: '40px', display: 'inline-block' }}
        >
          <img
            src={getAvatarUrl(skill.authorUsername)}
            alt={skill.authorName}
            width={40}
            height={40}
            className="block w-full h-full object-cover rounded-full"
          />
        </span>

        {/* Left: skill name + author */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="text-[15px] font-normal leading-5 text-[#F4F4F4] truncate">
            {skill.name}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[13px] leading-4 text-[#717171]">by</span>
            <span className="text-[13px] leading-4 text-[#FE5631] truncate max-w-[100px]">
              {skill.authorName}
            </span>
          </div>
        </div>

        {/* Right: star count + icon */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[15px] font-normal leading-5 text-[#F4F4F4] text-right">
            {formatStars(skill.stars)}
          </span>
          <StarIcon className="w-[14px] h-[14px]" />
        </div>
      </div>
    </div>
  );
};
