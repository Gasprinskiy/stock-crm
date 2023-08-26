import { VNode } from "vue";

export interface SaleTab {
    key: number; 
    component: VNode
}

export interface SaleProductData {
    product_name: string;
    product_id: number;
    variation_id: number;
    amount: number;
    stock_id: number;
    price: number;
    summed_price: number;
}

export interface SaleProduct {
    product_id: number;
    variation_id: number;
    amount: number;
    stock_id: number;
    p_type_id: number;
}

export interface PaymentType {
    p_type_id: number;
    name: string;
}