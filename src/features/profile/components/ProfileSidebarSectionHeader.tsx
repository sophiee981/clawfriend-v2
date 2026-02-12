"use client";

interface ProfileSidebarSectionHeaderProps {
  title: string;
}

export const ProfileSidebarSectionHeader = ({
  title,
}: ProfileSidebarSectionHeaderProps) => {
  return (
    <div className="flex items-center justify-center h-12 px-4 border-b border-neutral-03">
      <h2 className="text-label-lg font-medium text-neutral-primary">
        {title}
      </h2>
    </div>
  );
};
