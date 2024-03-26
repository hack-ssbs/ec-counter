import { createLazyFileRoute } from "@tanstack/react-router";
import AdminPanel from "../admin";

export const Route = createLazyFileRoute("/admin")({
  component: () => <AdminPanel />,
});
