import type { FilterQuery, Query } from 'mongoose';
export const excludeField = [
  'searchTerm',
  'sort',
  'fields',
  'page',
  'limit',
  'startDate',
  'endDate',
  'minAmount',
  'maxAmount',
  'includeSystem',
];
export type RangeFilterConfig = {
  field: string; // document field name, e.g. "amount" | "date"
  min?: string; // query param key for lower bound, e.g. "minAmount"
  max?: string; // query param key for upper bound, e.g. "maxAmount"
};

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter); // Model.find().find(filter)

    return this;
  }

  rangeFilter(configs: RangeFilterConfig[]): this {
    const rangeQuery: Record<string, Record<string, unknown>> = {};

    for (const { field, min, max } of configs) {
      const rawMin = min ? this.query[min] : undefined;
      const rawMax = max ? this.query[max] : undefined;

      if (rawMin == null && rawMax == null) continue;

      rangeQuery[field] = {};

      if (rawMin != null) {
        const parsed = Number(rawMin);
        rangeQuery[field].$gte = isNaN(parsed) ? new Date(rawMin) : parsed;
      }

      if (rawMax != null) {
        const parsed = Number(rawMax);
        rangeQuery[field].$lte = isNaN(parsed) ? new Date(rawMax) : parsed;
      }
    }

    if (Object.keys(rangeQuery).length > 0) {
      this.modelQuery = this.modelQuery.find(rangeQuery as FilterQuery<T>);
    }

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || '';
    const searchQuery = {
      $or: searchableField.map((field) => ({ [field]: { $regex: searchTerm, $options: 'i' } })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(',').join(' ') || '';

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const filter = this.modelQuery.getFilter();

    const totalDocuments = await this.modelQuery.model.countDocuments(filter);

    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;

    const totalPages = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPages };
  }
}
