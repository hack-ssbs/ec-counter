import { createLazyFileRoute } from "@tanstack/react-router";
import { History } from "../History";

export const Route = createLazyFileRoute("/history")({
  component: () => <History />,
});
