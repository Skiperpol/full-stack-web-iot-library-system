import type { Book } from "./book";
import type { Client } from "./client";

export type Borrow = {
  id: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  book: Book;
  client?: Client;
};
