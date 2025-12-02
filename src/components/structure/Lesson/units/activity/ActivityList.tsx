import { Chip, Stack } from "@mui/material";
import type { Activity } from "../../../../../types/content";

export function ActivityList({ activities }: { activities: Activity[] }) {
    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {activities.map((activity) => (
                <Chip key={activity.id} label={activity.type} variant="outlined" sx={{ mb: 1 }} />
            ))}
        </Stack>
    );
}
