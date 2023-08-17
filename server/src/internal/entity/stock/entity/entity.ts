
export interface Stock {
    stock_id: number;
    name: string;
    address: string;
    product_count: number;
}

export interface StockListResponse {
    stock_list: Stock[];
    page_count: number;
}