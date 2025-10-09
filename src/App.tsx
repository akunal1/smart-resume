import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";
//@ts-ignore
import PortfolioApp from "./components/Portfolio/PortfolioApp";
import { Routes as FrontendRoutes } from "./routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Resume UI Routes */}
            <Route path="/" element={<PortfolioApp />} />

            {/* Frontend Routes - Assistant and Voice features */}
            <Route path="/assistant/*" element={<FrontendRoutes />} />
            <Route path="/resume/*" element={<FrontendRoutes />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
