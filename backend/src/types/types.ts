export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    meta?: {
        requestId: string;
        timestamp: string;
        [key: string]: any;
    };
    data?: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    meta: ApiResponse['meta'] & {
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
    };
}

export type FilterHandler = (value: any) => Record<string, any>;

// Type for pagination options
export interface PaginationOptions {
    page: number;
    limit: number;
    offset: number;
}

// Type for pagination result
export interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
