export interface Przelewy24TransactionRegisterConfig {
    sessionId: string,
    amount: number,
    currency: string,
    description: string,
    email: string,
    country: string,    
    language: string,
    method?: number,
    methodRefId?: string,
    regulationAccept?: boolean
    client?: string,
    address? :string,
    zip?: string,
    city?: string,
    phone?: string,
    shipping?: number,
    transferLabel?: string,
    cart?: {
        sellerId: string,
        sellerCategory: string,
        name?: string,
        description?: string,
        quantity?: number,
        price?: number,
        number?: number,
    }[],
    additional?: {
        shipping?: {
            type: number,
            address: string,
            zip: string,
            city: string,
            country: string,
        }
    }
}



export interface Przelewy24TransactionRegisterApiResponse {
    data: {
        success: boolean,
        token: string,
    }
}



export interface Przelewy24TransactionRegisterSuccess {
    token: string,
}