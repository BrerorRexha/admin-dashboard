import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  AttachMoneyOutlined,
  Inventory2Outlined,
  PeopleOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  fetchDashboardStats,
  fetchRevenueSeries,
} from "../services/dashboardService";
import { mockOrders } from "../data/mockData";
import { brand } from "../theme/theme";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatCard({ label, value, sub, icon, color, loading }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            bgcolor: `${color}20`,
            color,
            display: "flex",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          {loading ? (
            <Skeleton width={80} height={32} />
          ) : (
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          )}
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

const ORDER_CHIP: Record<string, "warning" | "info" | "success"> = {
  processing: "warning",
  processed: "info",
  delivered: "success",
};
const ORDER_LABEL: Record<string, string> = {
  processing: "Processing",
  processed: "Processed",
  delivered: "Delivered",
};

const eurFmt = (v: number) =>
  `\u20AC${v.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const statsQ = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
  const revenueQ = useQuery({
    queryKey: ["revenueSeries"],
    queryFn: fetchRevenueSeries,
  });
  const s = statsQ.data;

  const statusData = s
    ? [
        { name: "Processing", value: s.processing, fill: "#ff9800" },
        { name: "Processed", value: s.processed, fill: brand[400] },
        { name: "Delivered", value: s.delivered, fill: "#4caf50" },
      ]
    : [];

  const recentOrders = [...mockOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" fontWeight={700}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Revenue"
            value={s ? eurFmt(s.totalRevenue) : ""}
            icon={<AttachMoneyOutlined />}
            color={brand[500]}
            loading={statsQ.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Orders"
            value={s?.totalOrders ?? ""}
            icon={<ReceiptLongOutlined />}
            color="#0288d1"
            loading={statsQ.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Users"
            value={s?.totalUsers ?? ""}
            icon={<PeopleOutlined />}
            color="#9c27b0"
            loading={statsQ.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Out of Stock"
            value={s?.outOfStockCount ?? ""}
            sub={s ? `${s.inStockCount} products in stock` : ""}
            icon={<Inventory2Outlined />}
            color="#f44336"
            loading={statsQ.isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Revenue &mdash; last 14 days
              </Typography>
              {revenueQ.isLoading ? (
                <Skeleton variant="rectangular" height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueQ.data ?? []}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={brand[500]}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={brand[500]}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v: number | undefined) => [eurFmt(v ?? 0), "Revenue"]}
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={brand[500]}
                      strokeWidth={2}
                      fill="url(#revGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Orders by Status
              </Typography>
              {statsQ.isLoading ? (
                <Skeleton variant="rectangular" height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={statusData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusData.map((e) => (
                        <Cell key={e.name} fill={e.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Orders
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {recentOrders.map((order, idx) => (
              <Box key={order.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customerName} &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={ORDER_LABEL[order.status]}
                      color={ORDER_CHIP[order.status]}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {eurFmt(order.total)}
                    </Typography>
                  </Box>
                </Box>
                {idx < recentOrders.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
