import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Dil-farkında Link, useRouter, usePathname vb.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
