import { cookies } from "next/headers";
import en from "@/messages/en.json";
import mm from "@/messages/mm.json";

export type Dict = typeof en;

const dictionaries = { en, mm } as const;

export type Lang = keyof typeof dictionaries;

export async function getDictionary(): Promise<Dict> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("locale")?.value;
  const dict = lang === "mm" ? dictionaries.mm : dictionaries.en;
  return dict as Dict;
}

export function getT(dict: Dict) {
  return (key: string): string => {
    if (key in dict) return (dict as Record<string, string>)[key];
    return key;
  };
}
