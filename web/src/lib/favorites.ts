import { readJson, writeJson } from "./persist";

const KEY = "omnilearn-favorites-v1";

export type FavoriteItem = {
  id: string;
  kind: "cfa" | "en" | "speak" | "grammar" | "re" | "vocab" | "gre";
  title: string;
  subtitle: string;
  href: string;
  savedAt: number;
};

export function listFavorites(): FavoriteItem[] {
  return readJson<FavoriteItem[]>(KEY, []).sort((a, b) => b.savedAt - a.savedAt);
}

export function isFavorite(id: string): boolean {
  return listFavorites().some((f) => f.id === id);
}

export function toggleFavorite(item: Omit<FavoriteItem, "savedAt">): boolean {
  const list = listFavorites();
  const idx = list.findIndex((f) => f.id === item.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeJson(KEY, list);
    return false;
  }
  list.unshift({ ...item, savedAt: Date.now() });
  writeJson(KEY, list);
  return true;
}
