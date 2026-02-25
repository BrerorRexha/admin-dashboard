import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchRevenueDaily, fetchRecentActivity } from "../services/dashboardService";

export default function Dashboard() {
  const revenueQuery = useQuery({
    queryKey: ["revenueDaily"],
    queryFn: fetchRevenueDaily
  });

  const activityQuery = useQuery({
    queryKey: ["activityEvents", "recent"],
    queryFn: fetchRecentActivity
  });

  const totalRevenue =
    revenueQuery.data?.reduce((sum, p) => sum + p.revenue, 0) ?? 0;

  const totalOrders =
    revenueQuery.data?.reduce((sum, p) => sum + p.orders, 0) ?? 0;

  return (
    <Grid container spacing={2}>
      <Grid>
        <Card>
          <CardContent>
            <Typography variant="overline">Revenue</Typography>
            <Typography variant="h5">{totalRevenue.toFixed(2)} EUR</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card>
          <CardContent>
            <Typography variant="overline">Orders</Typography>
            <Typography variant="h5">{totalOrders}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card sx={{ height: 180 }}>
          <CardContent sx={{ height: 180 }}>
            <Typography variant="overline">Revenue over time</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={revenueQuery.data ?? []}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card>
          <CardContent>
            <Typography variant="overline">Recent activity</Typography>
            {(activityQuery.data ?? []).map(e => (
              <Typography key={e.id} variant="body2">
                {e.type} at {new Date(e.createdAt).toLocaleString()}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}