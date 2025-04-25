import { JSONContent } from "@tiptap/react";

export interface Note {
  title?: string;
  content?: JSONContent;
  id: number;
}
