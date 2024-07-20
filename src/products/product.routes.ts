import express from "express";
import type { Request, Response } from "express";
import * as ProductService from "./product.services"
import { body, validationResult } from 'express-validator';

export const productRouter = express.Router()

productRouter.get('/', async (req: Request, res: Response) => {
    try {
        const availableProducts = await ProductService.listAvailableProducts()
        return res.status(200).json(availableProducts)
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

productRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const productSearch = await ProductService.getProductById(id);
        return res.status(200).json(productSearch);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

productRouter.post('/',
    body('name').isString(),
    body("description").isString(),
    body("price").isFloat(),
    body("stock").optional({ checkFalsy: true }).isInt(),
    body("availability").isBoolean(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const input = req.body
            const newProduct = await ProductService.createProduct(input)
            return res.status(200).json(newProduct);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
)

productRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const input = req.body
        const updatedProduct = await ProductService.updateProduct(id, input)
        return res.status(200).json(updatedProduct);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

productRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await ProductService.deleteProduct(id)
        return res.status(200)
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})