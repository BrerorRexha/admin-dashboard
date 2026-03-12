import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  PhotoCameraOutlined,
} from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext";
import { useAuth } from "../app/auth";
import { brand } from "../theme/theme";

export default function Settings() {
  const { mode, setMode } = useThemeMode();
  const { me, setMe } = useAuth();

  const [firstName, setFirstName] = useState(me.firstName);
  const [lastName, setLastName] = useState(me.lastName);
  const [email, setEmail] = useState(me.email);
  const [avatarSrc, setAvatarSrc] = useState(me.avatar ?? "");
  const [saved, setSaved] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleSave() {
    setMe({
      ...me,
      firstName,
      lastName,
      email,
      avatar: avatarSrc || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isLight = mode === "light";

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 540 }}
    >
      <Typography variant="h5" fontWeight={700}>
        Settings
      </Typography>

      {/* ── Profile ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader title="Profile" />
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2.5} mb={3}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={avatarSrc || undefined}
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 24,
                  bgcolor: brand[500],
                }}
              >
                {me.firstName[0]}
                {me.lastName[0]}
              </Avatar>
              <Tooltip title="Change photo">
                <IconButton
                  size="small"
                  onClick={() => fileRef.current?.click()}
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    p: 0.5,
                    "&:hover": { bgcolor: isLight ? brand[50] : brand[900] },
                  }}
                >
                  <PhotoCameraOutlined sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {me.firstName} {me.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {me.email}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                size="small"
                sx={{ flex: 1 }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                size="small"
                sx={{ flex: 1 }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Stack>
            <TextField
              label="Email"
              size="small"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>

          <Box mt={2.5} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSave}>
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ── Appearance ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader title="Appearance" />
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="body1" fontWeight={500}>
                Dark Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Switch between light and dark theme
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LightModeOutlined
                sx={{
                  color: isLight ? brand[500] : "text.disabled",
                  fontSize: 20,
                }}
              />
              <Switch
                checked={mode === "dark"}
                onChange={(_, v) => setMode(v ? "dark" : "light")}
                sx={{
                  "& .MuiSwitch-thumb": { bgcolor: brand[500] },
                  "& .MuiSwitch-track": { bgcolor: `${brand[400]}80` },
                }}
              />
              <DarkModeOutlined
                sx={{
                  color: !isLight ? brand[300] : "text.disabled",
                  fontSize: 20,
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Color theme preview
          </Typography>
          <Stack direction="row" spacing={1}>
            {([brand[400], brand[500], brand[600], brand[700]] as string[]).map(
              (color) => (
                <Box
                  key={color}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: color,
                    border: `2px solid ${brand[500] === color ? brand[300] : "transparent"}`,
                  }}
                />
              ),
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ── Account info ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader title="Account" />
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {me.roleId}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontFamily: "monospace" }}
              >
                {me.id}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
