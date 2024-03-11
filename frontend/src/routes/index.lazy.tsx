import { createLazyFileRoute } from "@tanstack/react-router";
import Timer from "../Timer";

export const Route = createLazyFileRoute("/")({
  component: Timer,
});
