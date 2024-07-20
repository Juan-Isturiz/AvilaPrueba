export type noneValue = null | undefined

export const UserStatus: { [x: string]: 'ACTIVE' | 'SUSPENDED' | 'DELETED' } = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED',
}

export type UserStatus = typeof UserStatus[keyof typeof UserStatus]


export const OrderStatus: { [x: string]: 'PENDING' | 'PROCESSING' | 'DELIVERING' | 'COMPLETED' | 'CANCELED' } = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    DELIVERING: 'DELIVERING',
    COMPLETED: 'COMPLETED',
    CANCELED: 'CANCELED'

}

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]