import { createTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// 1. BRAND & DASHBOARD COLORS
// ----------------------------------------------------------------------
const palette = {
  mode: 'light' as const,
  primary: {
    light: '#818CF8',
    main: '#4F46E5',  // Indigo
    dark: '#3730A3',
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: '#94A3B8',
    main: '#64748B',  // Slate/Neutral
    dark: '#475569',
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#DCFCE7',
    main: '#10B981',  // Emerald
    dark: '#065F46',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FEF9C3',
    main: '#F59E0B',  // Amber
    dark: '#92400E',
    contrastText: '#FFFFFF',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',  // Red
    dark: '#991B1B',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',  // Blue
    dark: '#1E40AF',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC', // Slightly off-white background for the main app
    paper: '#FFFFFF',   // Pure white for cards, sidebars, and modals
  },
  text: {
    primary: '#1E293B',   // Near-black for main headings
    secondary: '#64748B', // Muted slate for body text/labels
    disabled: '#94A3B8',
  },
  divider: '#E2E8F0',     // Soft borders
};

// ----------------------------------------------------------------------
// 2. TYPOGRAPHY
// ----------------------------------------------------------------------
const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  // Headings are scaled down slightly for dashboards to save screen space
  h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2 },
  h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.2 },
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.2 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.2 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.2 },
  subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.57 },
  button: {
    fontWeight: 600,
    textTransform: 'none' as const, // Removes MUI's default ALL CAPS for buttons
  },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
  },
};

// ----------------------------------------------------------------------
// 3. CREATE THEME & OVERRIDE COMPONENTS
// ----------------------------------------------------------------------
export const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 8, // Sets base border radius to 8px
  },
  components: {
    // RESET GLOBAL CSS
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
          color: palette.text.primary,
        },
      },
    },
    // APP BAR (Top Navigation)
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${palette.divider}`,
        },
      },
    },
    // DRAWER (Sidebar Navigation)
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.background.paper,
          borderRight: `1px solid ${palette.divider}`,
          boxShadow: 'none',
        },
      },
    },
    // CARDS (Dashboard Widgets)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly larger radius for cards
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          border: `1px solid ${palette.divider}`,
          backgroundImage: 'none', // Prevents MUI's default elevation overlay in dark mode
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px 24px 0 24px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    // BUTTONS
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: 'none', // Modern flat aesthetic
          },
        },
        sizeLarge: { padding: '10px 22px', fontSize: '1rem' },
        sizeSmall: { padding: '4px 10px', fontSize: '0.8125rem' },
        containedPrimary: {
          '&:hover': { backgroundColor: palette.primary.dark },
        },
      },
    },
    // DATA TABLES
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.default, // Light gray header bg
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${palette.divider}`,
          padding: '16px',
        },
        head: {
          color: palette.text.secondary,
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        },
      },
    },
    // TEXT INPUTS / FORMS
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.divider,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.secondary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.main,
            borderWidth: '2px',
          },
        },
      },
    },
    // TOOLTIPS
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.text.primary,
          color: palette.background.paper,
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '8px 12px',
        },
      },
    },
  },
});