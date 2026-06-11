import { getAllProductRepository } from "../repositories/product.repository";
import { generateSku } from "../utils/generateSKU";
import { getCategoryByIdService } from "./category.service";

export const getAllProductService = async () => {
  return await getAllProductRepository();
};
