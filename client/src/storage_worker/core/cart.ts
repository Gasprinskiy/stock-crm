import { DexieDb }  from "../dexie/";
import { SaleProductData } from "@/entity/sales/entity";

export interface CartStorage {
    saveReceipt(receipt_id: number, stock_id: number, cart: SaleProductData[] | null) : Promise<void>;
    removeReceipt(receipt_id: number, stock_id: number,) : Promise<void>;
    getReceiptCartById(receipt_id: number, stock_id: number) : Promise<SaleProductData[] | null>;
    getReceiptsIdList(stock_id: number) : Promise<number[] | null>;
} 

export class CartStorageImpl implements CartStorage {
    private db: DexieDb;
    constructor(db: DexieDb) {
        this.db = db
    }

    async saveReceipt(receipt_id: number, stock_id: number, cart: SaleProductData[] | null): Promise<void> {
        const exists = await this.db.cart.get({receipt_id: receipt_id, stock_id: stock_id})
        const payload = {
            id: exists?.id,
            receipt_id: receipt_id,
            stock_id: stock_id,
            value: cart
        }

        if (exists) {
            
            console.log("put: ", payload);
            
            await this.db.cart.put(payload)
            return
        }
        console.log("add: ", payload);
        
        await this.db.cart.add(payload)
    }

    async getReceiptCartById(receipt_id: number, stock_id: number): Promise<SaleProductData[] | null> {
        const receipts = await this.db.cart.get({receipt_id: receipt_id, stock_id: stock_id})        
        return receipts ? receipts.value : null
    }

    async getReceiptsIdList(stock_id: number): Promise<number[] | null> {
        const receipts = await this.db.cart.where({stock_id: stock_id}).toArray()
        return receipts.length > 0 ? receipts.map(item => item.receipt_id) : null
    }

    async removeReceipt(receipt_id: number, stock_id: number): Promise<void> {
        const exists = await this.db.cart.get({receipt_id: receipt_id, stock_id: stock_id})
        if (exists?.id) {
            await this.db.cart.delete(exists.id)
        }
    }
}