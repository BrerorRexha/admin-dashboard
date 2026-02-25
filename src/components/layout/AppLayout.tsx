import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../../app/auth";

type NavItem = {
  label: string;
  to: string;
  permission?: string;
};

const drawerWidth = 260;

export function AppLayout() {
  const { me, can } = useAuth();
  const pathname = useRouterState({ select: s => s.location.pathname });

  const items: NavItem[] = [
    { label: "Dashboard", to: "/dashboard", permission: "analytics.read" },
    { label: "Products", to: "/products", permission: "products.read" },
    { label: "Users", to: "/users", permission: "users.read" },
    { label: "Orders", to: "/orders", permission: "orders.read" },
    { label: "Settings", to: "/settings" }
  ];

  const visibleItems = items.filter(i => !i.permission || can(i.permission));

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2">
            {me ? `${me.firstName} ${me.lastName} (${me.role})` : "Loading user"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
        }}
      >
        <Toolbar />
        <List>
          {visibleItems.map(item => (
            <ListItemButton
              key={item.to}
              selected={pathname === item.to}
              component={Link}
              to={item.to}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}