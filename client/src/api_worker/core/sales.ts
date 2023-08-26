import { PaymentType } from "@/entity/sales/entity";
import { handleApiGetRequest } from "../axios";

export interface SalesApiWorker {
    loadPaymentTypes(): Promise<PaymentType[]>;
}

export class SalesApiWorkerImpl implements SalesApiWorker {
    loadPaymentTypes(): Promise<PaymentType[]> {
        return handleApiGetRequest('payment_types')
    }
}