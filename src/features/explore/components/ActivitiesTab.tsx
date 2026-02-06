"use client";

import { ActivityItem } from "./ActivityItem";

type ActivityAction = "bought" | "bid" | "sold" | "airdropped";

interface ActivityItemData {
  id: string;
  actorName: string;
  subjectName: string;
  action: ActivityAction;
  amount: string;
  timestamp: string;
  transactionLink?: string;
}

interface ActivitiesTabProps {
  activities: ActivityItemData[];
}

export const ActivitiesTab = ({ activities }: ActivitiesTabProps) => {
  return (
    <div className="flex w-full flex-col overflow-y-auto">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          id={activity.id}
          actorName={activity.actorName}
          subjectName={activity.subjectName}
          action={activity.action}
          amount={activity.amount}
          timestamp={activity.timestamp}
          transactionLink={activity.transactionLink}
        />
      ))}
    </div>
  );
};
