"use client";

import { ActivitiesTab } from "@/components/common/RightSide/ActivitiesTab";

interface ActivityTabProps {
    trader: string;
}

export const ActivityTab = ({ trader }: ActivityTabProps) => {
    return (
        <div className="w-full">
            <ActivitiesTab trader={trader} />
        </div>
    );
};
