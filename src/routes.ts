import { createBrowserRouter } from "react-router";
import EditorPage from "./pages/EditorPage";
import InvoicesPage from "./pages/InvoicesPage";

export const router = createBrowserRouter([
  { path: "/", Component: EditorPage },
  { path: "/edit/:id", Component: EditorPage },
  { path: "/invoices", Component: InvoicesPage },
]);
