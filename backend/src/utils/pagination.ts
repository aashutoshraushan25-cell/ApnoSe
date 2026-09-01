export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationOptions = (
  queryPage?: any,
  queryLimit?: any,
  defaultLimit = 20,
  maxLimit = 50
): PaginationOptions => {
  const page = Math.max(1, parseInt(queryPage as string, 10) || 1);
  const parsedLimit = parseInt(queryLimit as string, 10) || defaultLimit;
  const limit = Math.min(maxLimit, Math.max(1, parsedLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMetadata = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
