import { OrderStatus } from './../utils/util.types';
import express from "express";
import type { Request, Response } from "express";
import * as OrderService from "./order.services"
import { body, validationResult } from 'express-validator';

export const orderRouter = express.Router()

orderRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const order = await OrderService.getOrderById(id);
        if (order) {
            return res.status(200).json(order);
        }
    } catch (err: any) {
        return res.status(500).json(err.message);
    }
})

orderRouter.post(
    '/',
    body("client").isInt(),
    body("products").isArray(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const input = req.body
            const newOrder = await OrderService.createOrder(input);
            if (newOrder) {
                return res.status(200).json(newOrder);
            }
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
)

orderRouter.put('/process/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const updatedOrder = await OrderService.updateOrderStatus(id, OrderStatus.PROCESSING);
        return res.status(200).json(updatedOrder);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})
orderRouter.put('/deliver/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const updatedOrder = await OrderService.updateOrderStatus(id, OrderStatus.DELIVERING);
        return res.status(200).json(updatedOrder);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})
orderRouter.put('/complete/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const updatedOrder = await OrderService.updateOrderStatus(id, OrderStatus.COMPLETED);
        return res.status(200).json(updatedOrder);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})
orderRouter.put('/cancel/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const updatedOrder = await OrderService.updateOrderStatus(id, OrderStatus.CANCELED);
        return res.status(200).json(updatedOrder);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

