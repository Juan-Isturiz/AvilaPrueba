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

export type UpdateProductInput = {
    name?: string,
    description?: string,
    price?: number,
    stock?: number,
    availability?: boolean,
    status?: boolean,
}


/**
 * Creates a new product.
 *
 * @param {string} name - The name of the product.
 * @param {string} description - The description of the product.
 * @param {number} price - The price of the product.
 * @param {number} [stock=0] - The initial stock of the product. Defaults to 0.
 * @param {boolean} availability - Indicates whether the product is available.
 * @returns {Promise<Product | Error>} A Promise resolving to the created product or an Error.
 */
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

/**
 * Lists all available products.
 *
 * @returns {Promise<Product[] | Error>} A Promise resolving to an array of available products or an Error.
 */
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

/**
 * Gets a product by its ID.
 *
 * @param {number} id - The ID of the product.
 * @returns {Promise<Product | Error>} A Promise resolving to the found product or an Error.
 */
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

/**
 * Updates a product by its ID.
 *
 * @param {number} id - The ID of the product to update.
 * @param {UpdateProductInput} data - The updated product data.
 * @returns {Promise<Product | Error>} A Promise resolving to the updated product or an Error.
 */
export const updateProduct = async (id: number, data: UpdateProductInput): Promise<Product | Error> => {
    try {
        const updatedProduct = await db.product.update({
            where: { id: id },
            data: data
        })
        return updatedProduct
    } catch (error) {
        throw new Error()
    }
}

/**
 * Deletes a product by its ID.
 *
 * @param {number} id - The ID of the product to delete.
 */
export const deleteProduct = async (id: number) => {
    try {
        await db.product.delete({ where: { id: id } })
    } catch (error) {
        throw new Error()
    }
}