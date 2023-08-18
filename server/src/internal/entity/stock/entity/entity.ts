
export interface Stock {
    stock_id: number;
    name: string;
    address: string;
}

export interface StockProductStats extends Stock {
    product_count: number;
    movement_in_count: number;
}

export interface StockSaleStats extends Stock {
    today_sales: number;
    total_sales: number;
}

export interface StockListResponse {
    stock_list: Stock[];
    page_count: number;
}