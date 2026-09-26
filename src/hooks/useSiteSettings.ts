import { useSingleton } from "../lib/cms/public";
export function useSiteSettings() {
  return useSingleton("settings");
}
