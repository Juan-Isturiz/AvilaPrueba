import { db } from "../utils/db.server"


export type Product = {
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
    availability: boolean,
    status: boolean,
}


export const createProduct = async (
    name: string,
    description: string,
    price: number,
    stock: number = 0,
    availability: boolean
): Promise<Product | Error> => {
    try {
        const newProduct = await db.product.create({
            data: {
                name,
                description,
                price,
                stock,
                availability
            }
        })
        return newProduct
    } catch (error) {
        throw new Error()
    }

}

export const listAvailableProducts = async (): Promise<Product[] | Error> => {
    try {
        const productList = await db.product.findMany({
            where: { availability: true }
        })
        return productList
    } catch (error) {
        throw new Error()
    }
}

export const getProductById = async (id: number): Promise<Product | Error> => {
    try {
        const product = db.product.findUniqueOrThrow({
            where: { id: id }
        })
        return product

    } catch (error) {
        throw new Error()
    }
}