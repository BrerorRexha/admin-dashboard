import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BarChartOutlined,
  CategoryOutlined,
  GridViewOutlined,
  Inventory2Outlined,
  LabelOutlined,
  PeopleOutlined,
  ReceiptLongOutlined,
  SettingsOutlined,
  ShieldOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../../app/auth";
import { useThemeMode } from "../../context/ThemeContext";
import type { Permission } from "../../types";

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  permission?: Permission;
};

const DRAWER_WIDTH = 240;

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <GridViewOutlined fontSize="small" />,
    permission: "analytics.read",
  },
  {
    label: "Products",
    to: "/products",
    icon: <Inventory2Outlined fontSize="small" />,
    permission: "products.read",
  },
  {
    label: "Orders",
    to: "/orders",
    icon: <ReceiptLongOutlined fontSize="small" />,
    permission: "orders.read",
  },
  {
    label: "Categories",
    to: "/categories",
    icon: <CategoryOutlined fontSize="small" />,
    permission: "categories.read",
  },
  {
    label: "Specifications",
    to: "/specifications",
    icon: <TuneOutlined fontSize="small" />,
    permission: "specifications.read",
  },
  {
    label: "Spec Values",
    to: "/spec-values",
    icon: <LabelOutlined fontSize="small" />,
    permission: "specifications.read",
  },
  {
    label: "Users",
    to: "/users",
    icon: <PeopleOutlined fontSize="small" />,
    permission: "users.read",
  },
  {
    label: "User Roles",
    to: "/user-roles",
    icon: <ShieldOutlined fontSize="small" />,
    permission: "roles.read",
  },
];

export function AppLayout() {
  const { me, can } = useAuth();
  const { mode } = useThemeMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const visibleItems = NAV_ITEMS.filter(
    (i) => !i.permission || can(i.permission as Permission),
  );
  const isLight = mode === "light";

  const sidebarBg = isLight ? "#ffffff" : "#1e2418";
  const borderColor = isLight ? "#d8e0c8" : "#2e3a24";

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6b7c35 0%, #3f4d1f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChartOutlined sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: isLight ? "#1c2411" : "#e8ecdf" }}
          >
            AdminPanel
          </Typography>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
          <List disablePadding>
            {visibleItems.map((item) => {
              const active =
                pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    selected={active}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: active ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Footer: user + settings */}
        <Divider />
        <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={me.avatar} sx={{ width: 34, height: 34, fontSize: 14 }}>
            {me.firstName[0]}
            {me.lastName[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              fontWeight={600}
              noWrap
              display="block"
            >
              {me.firstName} {me.lastName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              display="block"
              sx={{ fontSize: "0.68rem" }}
            >
              {me.email}
            </Typography>
          </Box>
          <Tooltip title="Settings">
            <IconButton
              component={Link}
              to="/settings"
              size="small"
              sx={{
                color:
                  pathname === "/settings" ? "primary.main" : "text.secondary",
                bgcolor:
                  pathname === "/settings"
                    ? isLight
                      ? "#e4ebd1"
                      : "#2e3917"
                    : "transparent",
              }}
            >
              <SettingsOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "background.default",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
