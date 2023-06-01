import * as React from "react";
export enum OrderType {
	Standard = "Standard",
	SaleOrder = "SaleOrder",
	PurchaseOrder = "PurchaseOrder",
	TransferOrder = "TransferOrder",
	ReturnOrder = "ReturnOrder",
}

export type FriendlyFilter<T> = {
	label: string;
	value: T;
};

export const orderTypes: FriendlyFilter<OrderType>[] = Object.values(
	OrderType
).map((t) => ({
	label: t.replace(/([A-Z])/g, " $1").trim(), // separate capital letters
	value: t,
}));

export type OrderForm = {
	createdByUsername: string;
	orderType: OrderType;
	customerName: string;
};

export interface Orders {
	id: number;
	createdDate: string;
	createdByUsername: string;
	orderType: OrderType;
	customerName: string;
}

export interface OrderFilters {
	customerName: string;
	orderTypes: OrderType[];
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
