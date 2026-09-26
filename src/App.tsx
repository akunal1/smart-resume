import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";

const PortfolioPage = lazy(() => import("./features/portfolio/PortfolioPage"));
const FrontendRoutes = lazy(() => import("./routes").then((m) => ({ default: m.Routes })));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="App">
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
            <Routes>
              <Route path="/" element={<PortfolioPage />} />

              {/* Frontend Routes - Assistant and Voice features */}
              <Route path="/assistant/*" element={<FrontendRoutes />} />
              <Route path="/resume/*" element={<FrontendRoutes />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
