import { Component } from "vue";

export interface CommonStatistics {
    sales_sum: number;
    sales_amount: number;
    product_amount: number;
    stock_amount: number;
    employee_count: number;
}

export interface StatisticsView {
    value?: number,
    label: string,
    icon: Component,
}