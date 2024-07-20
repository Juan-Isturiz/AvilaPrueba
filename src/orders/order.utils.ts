export type NewOrderInput = {
    client: number;
    products: {
        productId: number;
        quantity: number;
    }[]
}