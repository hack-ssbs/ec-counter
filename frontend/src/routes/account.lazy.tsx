import { createLazyFileRoute } from "@tanstack/react-router";
import Account from "../account";

export const Route = createLazyFileRoute("/account")({
  component: Account,
});
