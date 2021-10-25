export type Question = { name: string; body: string };
export type SheetInfo = { id: string; name: string };
export type Message =
  | { type: "darkTheme"; value: boolean }
  | { type: "question"; value: { name: string; body: name } };
