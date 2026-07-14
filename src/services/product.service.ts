import type { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { CustomError } from "../errors/customError";
import type {
  ListProductResponse,
  ProductResponse,
  UpdateProductRequest,
} from "../model/product-model";
import { getCategoryByIdRepository } from "../repositories/category.repository";
import {
  createProductRepository,
  deleteProductRepository,
  getAllProductRepository,
  getProductByIdRepository,
  updateProductRepository,
} from "../repositories/product.repository";
import {
  serializeProduct,
  serializeProducts,
} from "../utils/formatter/product";
import { generateCode } from "../utils/generate-code";
import type { ProductQueryRequest } from "../validations/product.validation";

export const getAllProductService = async (
  query: ProductQueryRequest,
): Promise<ListProductResponse> => {
  const { page, limit, search, minPrice, maxPrice, stockStatus, categoryId } =
    query;
  const skip = (page - 1) * limit;

  const { products, totalData } = await getAllProductRepository({
    skip,
    take: limit,
    ...(search && { search }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(stockStatus && { stockStatus }),
    ...(categoryId && { categoryId }),
  });

  return {
    data: serializeProducts(products),
    meta: {
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
  };
};

export const createProductService = async (
  payload: CreateProductDTO,
): Promise<ProductResponse> => {
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

  return serializeProduct(product);
};

export const getProductByIdService = async (
  id: string,
): Promise<ProductResponse | null> => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  return serializeProduct(product);
};

export const updateProductService = async (
  id: string,
  payload: UpdateProductDTO,
): Promise<ProductResponse> => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  const updateProduct = {
    name: payload.name || product.name,
    price: Number(payload.price) || Number(product.price),
    stock: payload.stock || product.stock,
    categoryId: payload.categoryId || product.category.id,
  };

  const updatedProduct = await updateProductRepository(id, updateProduct);

  return serializeProduct(updatedProduct);
};

export const deleteProductService = async (id: string): Promise<void> => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  await deleteProductRepository(id);
};
