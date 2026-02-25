import { Box, Button, Card, CardContent, Switch, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 520 }}>
      <Typography variant="h5">Settings</Typography>

      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle1">Profile</Typography>

          <TextField label="First name" size="small" defaultValue="Ali" />
          <TextField label="Last name" size="small" defaultValue="Rexha" />
          <TextField label="Email" size="small" defaultValue="admin@demo.com" />

          <Button variant="contained">Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Theme</Typography>
          <Switch checked={darkMode} onChange={(_, v) => setDarkMode(v)} />
        </CardContent>
      </Card>
    </Box>
  );
}