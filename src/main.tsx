import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";

const PageRedirect = () => {
  const { pageNumber } = useParams<{ pageNumber: string }>();
  if (pageNumber === "1") {
    return <Navigate to="/" replace />;
  }
  return <App />;
};

const router = createBrowserRouter([
  {
    path: "/:pageNumber?",
    element: <PageRedirect />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
