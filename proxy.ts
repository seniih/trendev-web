import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Dahili yollar (_next, _vercel), API ve dosyalar (nokta içerenler) hariç her şey
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
