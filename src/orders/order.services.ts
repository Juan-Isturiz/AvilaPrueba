import { NewOrderInput } from './order.utils';
import { Product } from "../products/product.services";
import { User } from "../users/user.services";
import { db } from "../utils/db.server";
import { OrderStatus } from "../utils/util.types";

export type Order = {
    id: number
    createdAt: Date
    client: User
    OrderProducts: OrderProducts[]
    status: OrderStatus
}
export type OrderProducts = {
    product: Product
    quantity: number
}


/**
 * Fetches an order by its ID.
 * 
 * @param {number} id - The ID of the order to retrieve.
 * @returns {Promise<Order | Error>} A Promise resolving to the order object or an Error.
 */
export const getOrderById = async (id: number): Promise<Order | Error> => {
    try {
        const orderData = await db.order.findUniqueOrThrow({
            where: { id: id },
            include: {
                client: {
                    select: {
                        name: true,
                        id: true,
                        email: true,
                        role: true,
                        status: true
                    }
                },
                OrderProducts: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return orderData
    } catch (error) {
        throw new Error()
    }
}

/**
 * Fetches orders associated with a specific client.
 * 
 * @param {number} clientId - The ID of the client.
 * @returns {Promise<Order[] | Error>} A Promise resolving to an array of orders or an Error.
 */
export const getOrderByClientId = async (clientId: number): Promise<Order[] | Error> => {
    try {
        const orderData = await db.order.findMany({
            where: {
                client: {
                    id: clientId
                }
            },
            include: {
                client: {
                    select: {
                        name: true,
                        id: true,
                        email: true,
                        role: true,
                        status: true
                    }
                },
                OrderProducts: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return orderData
    } catch (error) {
        throw new Error()
    }
}

/**
 * Creates a new order.
 * 
 * @param {NewOrderInput} input - Data object containing client and product information.
 * @returns {Promise<Order | Error>} A Promise resolving to the created order object or an Error.
 */
export const createOrder = async (input: NewOrderInput): Promise<Order | Error> => {
    try {
        const { client, products } = input
        const newOrder = await db.order.create({
            data: {
                clientId: client,
                OrderProducts: {
                    create: [...products]
                }
            },
            include: {
                OrderProducts: {
                    include: {
                        product: true
                    }
                },
                client: true
            }
        })
        return newOrder
    } catch (error) {
        throw new Error()
    }
}

/**
 * Updates the status of an order.
 * 
 * @param {number} id - The ID of the order to update.
 * @param {OrderStatus} status - The new status for the order.
 * @returns {Promise<Order | Error>} A Promise resolving to the updated order object or an Error.
 */
export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order | Error> => {
    try {
        const updatedOrder = await db.order.update({
            data: {
                status: status
            },
            where: { id: id },
            include: {
                OrderProducts: {
                    include: {
                        product: true
                    }
                },
                client: true
            }
        })
        return updatedOrder
    } catch (error) {
        throw new Error()
    }
}