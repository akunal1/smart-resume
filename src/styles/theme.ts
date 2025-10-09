import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    // Key Achievements inspired light theme - pastel gradients and colors
    primary: "#3b82f6", // Blue-500 for primary actions (matching achievement borders)
    secondary: "#8b5cf6", // Purple-500 for secondary elements
    success: "#10b981", // Keep emerald for success
    danger: "#ef4444", // Keep red for danger
    warning: "#f59e0b", // Keep amber for warning
    info: "#06b6d4", // Cyan for info
    light: "#ffffff",
    dark: "#1e293b", // Slate-800 for text on light backgrounds
    background: "#f8fafc", // Slate-50 to slate-100 gradient equivalent (very light)
    surface: "rgba(255, 255, 255, 0.9)", // White surface with slight transparency
    surfaceHover: "rgba(255, 255, 255, 0.95)",
    text: "#1e293b", // Slate-800 for main text (dark on light background)
    textSecondary: "#64748b", // Slate-500 for secondary text
    accent: "#8b5cf6", // Purple accent
    glow: "0 0 20px rgba(59, 130, 246, 0.3)", // Blue glow effect (matching primary)
  },
  fonts: {
    primary:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", monospace',
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: "12px", // Slightly reduced for modern look
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // Dark theme shadow
  backdropFilter: "blur(16px)", // Glass effect
};
