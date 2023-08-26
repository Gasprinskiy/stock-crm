import { SaleProductData } from "@/entity/sales/entity";
import Dexie from "dexie"
import type { Table } from "dexie";

interface Cart {
  id?: number;
  receipt_id: number;
  stock_id: number;
  value: SaleProductData[] | null
}

export class DexieDb extends Dexie {
  cart!: Table<Cart>
  constructor() {
    super('app_storage')
    this.version(1).stores({
      cart: "++id, receipt_id, stock_id, *value"
    });
  }
}