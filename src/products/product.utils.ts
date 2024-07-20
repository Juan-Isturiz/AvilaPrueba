export type UpdateProductInput = {
    name?: string,
    description?: string,
    price?: number,
    stock?: number,
    availability?: boolean,
    status?: boolean,
}

export type NewProductInput = {
    name: string;
    description: string;
    price: number;
    stock?: number;
    availability: boolean;
}