import { Stack } from "@mui/material";
import type { Activity } from "../../../../../types/content";
import { ActivityCard } from "./ActivityDetails";

export function ActivityList({ activities }: { activities: Activity[] }) {
    return (
        <Stack spacing={2} sx={{ mt: 1 }}>
            {activities.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} index={index + 1} />
            ))}
        </Stack>
    );
}
