export interface Przelewy24PaymentMethod {
    id: number,
    name: string,
    group: string,
    subgroup: string,
    status: boolean,
    imgUrl: string,
    mobileImgUrl: string,
    mobile: boolean,
    avilabilityHours: {
        mondayToFriday: string,
        saturday: string,
        sunday: string,        
    }        
}

export interface Przelewy24PaymentMethodsApiResponse {
    data: Przelewy24PaymentMethod[],
}