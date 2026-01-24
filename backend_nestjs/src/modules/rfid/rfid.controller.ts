import { Controller, Post, Body } from "@nestjs/common";
import { RfidService } from "./rfid.service";
import { ClientService } from "../client/client.service";
import { BookService } from "../book/book.service";
import { CardService } from "../card/card.service";
import { BorrowService } from "../borrow/borrow.service";

@Controller("rfid")
export class RfidController {
  constructor(
    private readonly rfidService: RfidService,
    private readonly clientService: ClientService,
    private readonly bookService: BookService,
    private readonly cardService: CardService,
    private readonly borrowService: BorrowService
  ) {}

  @Post("register-client")
  async registerClientAndScan(@Body() dto: any) {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: true };

      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    if (result.status === "ok" && result.uid) {
      let card = await this.cardService.findByUid(result.uid);
      if (!card) {
        card = await this.cardService.create(result.uid);
      }

      const client = await this.clientService.create({
        ...dto,
        cardId: result.uid,
      });
      return { status: "ok", client };
    }
    return result;
  }

  @Post("register-book")
  async registerBookAndScan(@Body() dto: any) {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: true };

      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    if (result.status === "ok" && result.uid) {
      let card = await this.cardService.findByUid(result.uid);
      if (!card) {
        card = await this.cardService.create(result.uid);
      }

      const book = await this.bookService.create({
        ...dto,
        cardId: result.uid,
      });
      return { status: "ok", book };
    }
    return result;
  }

  @Post("scan-client")
  async scanClientCard() {
    const result = await this.rfidService.scanForRfidCard(
      async (uid, card) => ({ ok: true })
    );

    if (result.status === "ok" && result.uid) {
      return { status: "ok", cardId: result.uid };
    }
    return result;
  }

  @Post("scan-book")
  async scanBookCard() {
    const result = await this.rfidService.scanForRfidCard(
      async (uid, card) => ({ ok: true })
    );
    if (result.status === "ok" && result.uid) {
      return { status: "ok", cardId: result.uid };
    }
    return result;
  }

  @Post("register-request")
  async registerRequest() {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: true };

      const existingClient =
        (await this.clientService.findOneByCardUid?.(card.uid)) || null;
      if (existingClient) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    this.rfidService.gateway.emit("rfid/register-result", result);
    return result;
  }

  // @Post("register-request")
  // async registerRequest() {
  //   const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
  //     if (!card) return { ok: true };

  //     const existingClient =
  //       (await this.clientService.findOneByCardUid?.(card.uid)) || null;
  //     if (existingClient) return { ok: false, reason: "busy" };

  //     return { ok: true };
  //   });
  //   this.rfidService.gateway.emit("rfid/register-result", result);
  //   return result;
  // }

  @Post("register-book-request")
  async registerBookRequest() {
    const result = await this.rfidService.scanForRfidCard(async (uid, card) => {
      if (!card) return { ok: true };

      const existingBook =
        (await this.bookService.findOneByCardUid?.(card.uid)) || null;
      if (existingBook) return { ok: false, reason: "busy" };

      return { ok: true };
    });
    this.rfidService.gateway.emit("rfid/register-book-result", result);
    return result;
  }

  @Post("cancel-scan")
  async cancelScan() {
    this.rfidService.cancelScan();
    return { status: "cancelled" };
  }

  @Post("return-book")
  async returnBookByCards(@Body("clientCardId") clientCardId?: string) {
    // Jeśli clientCardId nie jest podany, skanuj kartę klienta
    if (!clientCardId) {
      const clientResult = await this.rfidService.scanForRfidCard(
        async (uid, card) => {
          const client = await this.clientService.findOneByCardUid?.(uid);
          if (!client) {
            return { ok: false, reason: "client_not_found" };
          }
          return { ok: true };
        }
      );

      if (clientResult.status !== "ok" || !clientResult.uid) {
        return clientResult;
      }

      clientCardId = clientResult.uid;
    } else {
      // Weryfikuj, czy klient istnieje
      const client = await this.clientService.findOneByCardUid?.(clientCardId);
      if (!client) {
        return {
          status: "error",
          message: "Client not found",
        };
      }
    }

    // Skanuj kartę książki
    const bookResult = await this.rfidService.scanForRfidCard(
      async (uid, card) => {
        const book = await this.bookService.findOneByCardUid?.(uid);
        if (!book) {
          return { ok: false, reason: "book_not_found" };
        }
        return { ok: true };
      }
    );

    if (bookResult.status !== "ok" || !bookResult.uid) {
      return bookResult;
    }

    const bookCardId = bookResult.uid;

    // Zwróć książkę
    try {
      const borrow = await this.borrowService.returnBookByCards(clientCardId, bookCardId);
      return {
        status: "ok",
        message: "Book returned successfully",
        borrow,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error.message || "Failed to return book",
      };
    }
  }
}
