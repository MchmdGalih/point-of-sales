import type { ProductQueryDTO } from "../dto/product.dto";
import { CustomError } from "../errors/customError";
import { getCategoryByIdRepository } from "../repositories/category.repository";
import {
  createProductRepository,
  deleteProductRepository,
  getAllProductRepository,
  getProductByIdRepository,
  updateProductRepository,
} from "../repositories/product.repository";
import { generateCode } from "../utils/generate";
import type {
  ProductDTO,
  UpdateProductPayload,
} from "../validations/product.validation";

export const getAllProductService = async (query: ProductQueryDTO) => {
  return await getAllProductRepository(query);
};

export const createProductService = async (payload: ProductDTO) => {
  const { name, price, stock, categoryId } = payload;

  const category = await getCategoryByIdRepository(categoryId);

  if (!category) throw new CustomError("Category not found", 404);

  const sku_code = await generateCode("PRD");

  const product = await createProductRepository({
    name,
    price,
    stock,
    sku: sku_code,
    categoryId: category.id,
  });

  return {
    ...product,
    price: Number(product.price),
  };
};

export const getProductByIdService = async (id: string) => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  return product;
};

export const updateProductService = async (
  id: string,
  payload: UpdateProductPayload,
) => {
  const data = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined),
  );

  return await updateProductRepository(id, data);
};

export const deleteProductService = async (id: string) => {
  return await deleteProductRepository(id);
};
