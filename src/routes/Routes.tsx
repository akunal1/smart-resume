import { Routes as RouterRoutes, Route } from "react-router-dom";
import { AssistantContainer } from "@/features/assistant/containers/AssistantContainer";

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<AssistantContainer />} />
      <Route path="/assistant" element={<AssistantContainer />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </RouterRoutes>
  );
};
