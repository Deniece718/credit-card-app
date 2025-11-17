export interface RemainingSpend {
    used: number;
    limit: number;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
}

export interface Card {
    id: string;
    isActivated: boolean;
    cardNumber: string;
    expirationDate: Date;
    remainingSpend: RemainingSpend;
    transactions: Transaction[];
}

export interface CardInfo {
    _id: string;
    isActivated: boolean;
    cardNumber: string;
    creditLimit: number;
    expirationDate: Date;
    companyId: string;
}

export interface Company {
    _id: string;
    userId: string;
    companyName: string;
}

export interface Invoice {
    _id: string;
    companyId: string;
    cardId: string;
    isPaid: boolean;
    amount: number;
    createdAt: Date;
    dueDate: Date;
}

export interface User {
    _id: string;
    email: string;
}