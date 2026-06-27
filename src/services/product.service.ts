import { CustomError } from "../errors/customError";
import type {
  CreateProductRequest,
  ListProductResponse,
  ProductQueryRequest,
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
import { generateCode } from "../utils/generate-code";

export const getAllProductService = async (
  query: ProductQueryRequest,
): Promise<ListProductResponse> => {
  const {
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice,
    inStock,
    categoryId,
  } = query;
  const skip = (page - 1) * limit;

  const result = await getAllProductRepository({
    skip,
    take: limit,
    ...(search && { search }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(inStock && { inStock }),
    ...(categoryId && { categoryId }),
  });

  return {
    data: result.products,
    meta: {
      page,
      limit,
      totalPage: Math.ceil(result.totalData / limit),
      totalData: result.totalData,
    },
  };
};

export const createProductService = async (
  payload: CreateProductRequest,
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

  return product;
};

export const getProductByIdService = async (
  id: string,
): Promise<ProductResponse> => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  return product;
};

export const updateProductService = async (
  id: string,
  payload: UpdateProductRequest,
): Promise<ProductResponse> => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  const updateProduct = {
    name: payload.name || product.name,
    price: Number(payload.price) || Number(product.price),
    stock: payload.stock || product.stock,
    categoryId: payload.categoryId || product.category.id,
  };

  return await updateProductRepository(id, updateProduct);
};

export const deleteProductService = async (id: string): Promise<void> => {
  const product = await getProductByIdRepository(id);

  if (!product) throw new CustomError("Product not found", 404);

  await deleteProductRepository(id);
};
