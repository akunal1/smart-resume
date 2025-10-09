import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      secondary: string
      success: string
      danger: string
      warning: string
      info: string
      light: string
      dark: string
      background: string
      surface: string
      surfaceHover: string
      text: string
      textSecondary: string
      accent: string
      glow: string
    }
    fonts: {
      primary: string
      mono: string
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    borderRadius: string
    boxShadow: string
    backdropFilter: string
  }
}
