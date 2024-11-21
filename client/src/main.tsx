import { createRoot } from "react-dom/client";
import "./index.css";
import Provider from "./providers/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider/>
);
