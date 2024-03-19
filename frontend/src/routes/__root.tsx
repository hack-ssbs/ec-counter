// RouterComponent.tsx
import Bar from "../components/sidebar.tsx";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-row w-screen pr-10">
      <Bar />
      <div className="flex-1 ml-5">
        <Outlet />
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  ),
});
