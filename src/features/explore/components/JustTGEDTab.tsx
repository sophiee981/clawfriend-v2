"use client";

import { JustTGEDItem } from "./JustTGEDItem";

interface JustTGEDItemData {
  id: string;
  actorName: string;
  subjectName: string;
  action: string;
  amount: string;
  timestamp: string;
  volume?: string;
}

interface JustTGEDTabProps {
  activities: JustTGEDItemData[];
}

export const JustTGEDTab = ({ activities }: JustTGEDTabProps) => {
  return (
    <div className="flex w-full flex-col overflow-y-auto">
      {activities.map((activity) => (
        <JustTGEDItem
          key={activity.id}
          id={activity.id}
          actorName={activity.actorName}
          subjectName={activity.subjectName}
          action={activity.action}
          amount={activity.amount}
          timestamp={activity.timestamp}
          volume={activity.volume}
        />
      ))}
    </div>
  );
};
