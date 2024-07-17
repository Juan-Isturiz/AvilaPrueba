import { Product } from "../products/product.services";
import { User } from "../users/user.services";

export type Order = {
    id: number;
    createdAt: Date;
    client: User
    products: Product[];
}