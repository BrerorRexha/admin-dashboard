import { createTheme } from "@mui/material/styles";

// ─── Olive / Moss Green Palette ──────────────────────────────────────────────
export const brand = {
  50:  "#f4f6ee",
  100: "#e4ebd1",
  200: "#cad8a5",
  300: "#a9c070",
  400: "#8fa34e",
  500: "#6b7c35",  // primary – moss green
  600: "#556429",
  700: "#3f4d1f",
  800: "#2e3917",
  900: "#1e2610",
};

export const buildTheme = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        light:        brand[400],
        main:         brand[500],
        dark:         brand[700],
        contrastText: "#ffffff",
      },
      secondary: {
        light: isLight ? "#8fa4a0" : "#6b8480",
        main:  isLight ? "#5a7874" : "#4e6a66",
        dark:  isLight ? "#3d5652" : "#354e4a",
        contrastText: "#ffffff",
      },
      success: {
        main:  "#4caf50",
        light: "#81c784",
        dark:  "#388e3c",
        contrastText: "#ffffff",
      },
      warning: {
        main:  "#ff9800",
        light: "#ffb74d",
        dark:  "#f57c00",
        contrastText: "#ffffff",
      },
      error: {
        main:  "#f44336",
        light: "#e57373",
        dark:  "#d32f2f",
        contrastText: "#ffffff",
      },
      info: {
        main:  "#0288d1",
        light: "#29b6f6",
        dark:  "#01579b",
        contrastText: "#ffffff",
      },
      background: {
        default: isLight ? "#f5f6f0" : "#161a11",
        paper:   isLight ? "#ffffff"  : "#1e2418",
      },
      text: {
        primary:   isLight ? "#1c2411" : "#e8ecdf",
        secondary: isLight ? "#5a6648" : "#94a37a",
        disabled:  isLight ? "#9aaa80" : "#5a6648",
      },
      divider: isLight ? "#d8e0c8" : "#2e3a24",
    },

    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      h1: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.2 },
      h3: { fontSize: "1.5rem",   fontWeight: 600, lineHeight: 1.2 },
      h4: { fontSize: "1.25rem",  fontWeight: 600, lineHeight: 1.2 },
      h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.2 },
      h6: { fontSize: "1rem",     fontWeight: 600, lineHeight: 1.2 },
      subtitle1: { fontSize: "1rem",    fontWeight: 500, lineHeight: 1.5 },
      subtitle2: { fontSize: "0.875rem",fontWeight: 500, lineHeight: 1.57 },
      body1: { fontSize: "1rem",    fontWeight: 400, lineHeight: 1.5 },
      body2: { fontSize: "0.875rem",fontWeight: 400, lineHeight: 1.57 },
      button: { fontWeight: 600, textTransform: "none" as const },
      caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.66 },
      overline: { fontSize: "0.70rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const },
    },

    shape: { borderRadius: 8 },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box" },
          "html, body, #root": { height: "100%" },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "#ffffff" : "#1e2418",
            color:           isLight ? "#1c2411" : "#e8ecdf",
            boxShadow: "none",
            borderBottom: `1px solid ${isLight ? "#d8e0c8" : "#2e3a24"}`,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? "#ffffff" : "#1e2418",
            borderRight: `1px solid ${isLight ? "#d8e0c8" : "#2e3a24"}`,
            boxShadow: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isLight
              ? "0 1px 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
              : "0 1px 4px 0 rgba(0,0,0,0.3),  0 0 0 1px rgba(0,0,0,0.2)",
            border: `1px solid ${isLight ? "#d8e0c8" : "#2e3a24"}`,
            backgroundImage: "none",
          },
        },
      },

      MuiCardHeader: {
        styleOverrides: {
          root: { padding: "20px 20px 0" },
          title: { fontSize: "1rem", fontWeight: 600 },
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "20px",
            "&:last-child": { paddingBottom: "20px" },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            padding: "7px 16px",
            transition: "background-color 0.18s, transform 0.12s",
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
          },
          containedPrimary: {
            "&:hover": { backgroundColor: brand[600] },
          },
          outlinedPrimary: {
            borderColor: brand[500],
            "&:hover": {
              backgroundColor: isLight ? brand[50] : `${brand[900]}80`,
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "background-color 0.18s",
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 8px",
            padding: "8px 12px",
            transition: "background-color 0.15s",
            "&.Mui-selected": {
              backgroundColor: isLight ? brand[100] : brand[800],
              color: isLight ? brand[700] : brand[200],
              "& .MuiListItemIcon-root": {
                color: isLight ? brand[700] : brand[200],
              },
              "&:hover": {
                backgroundColor: isLight ? brand[200] : brand[700],
              },
            },
            "&:hover": {
              backgroundColor: isLight ? brand[50] : `${brand[900]}80`,
            },
          },
        },
      },

      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 38,
            color: isLight ? "#5a6648" : "#94a37a",
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 500, fontSize: "0.75rem" },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight ? "#d8e0c8" : "#2e3a24",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: brand[500],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: brand[500],
              borderWidth: "2px",
            },
          },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "#f5f6f0" : "#161a11",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? "#d8e0c8" : "#2e3a24"}`,
            padding: "14px 16px",
          },
          head: {
            color:      isLight ? "#5a6648" : "#94a37a",
            fontWeight: 600,
            fontSize:   "0.72rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight ? "#1c2411" : "#e8ecdf",
            color:           isLight ? "#ffffff"  : "#1c2411",
            fontSize: "0.75rem",
            borderRadius: 6,
            padding: "6px 10px",
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${isLight ? "#d8e0c8" : "#2e3a24"}`,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? "#d8e0c8" : "#2e3a24" },
        },
      },
    },
  });
};

// legacy export kept for compatibility during transition
export const theme = buildTheme("light");
