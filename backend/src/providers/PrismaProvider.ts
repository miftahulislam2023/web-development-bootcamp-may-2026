// import { InfrastructureProvider } from "@/core/InfrastructureProvider";
// import { errorMapperRegistry } from "@/core/errors/ErrorMapperRegistry";
// import { AppError, ConflictError, NotFoundError } from "@/core/errors/AppError";
// import { HTTPStatusCode } from "@/types/HTTPStatusCode";
// import {
//   PrismaClientInitializationError,
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
// } from "@prisma/client/runtime/client";
// import { PrismaClient } from "@/prisma/generated/client";

// export class PrismaProvider implements InfrastructureProvider<PrismaClient> {
//   public name = "Prisma Database";

//   constructor(private readonly prismaClient: PrismaClient) {
//     // Register the error mapper when the provider is initialized
//     errorMapperRegistry.register(this.mapPrismaError.bind(this));
//   }

//   public getClient(): PrismaClient {
//     return this.prismaClient;
//   }

//   public async connect(): Promise<void> {
//     await this.prismaClient.$connect();
//   }

//   public async disconnect(): Promise<void> {
//     await this.prismaClient.$disconnect();
//   }

//   /**
//    * Translates Prisma ORM errors into standard domain AppErrors
//    */
//   private mapPrismaError(err: unknown): AppError | null {
//     // 1. Handle Known Errors (these have .code and .meta)
//     if (err instanceof PrismaClientKnownRequestError) {
//       switch (err.code) {
//         case "P2002":
//           return new ConflictError("A record with this data already exists", {
//             fields: err.meta?.target,
//             constraint: "unique_constraint",
//           });
//         case "P2025":
//           return new NotFoundError("Record to update not found", {
//             operation: err.meta,
//           });
//         case "P2003":
//           return new AppError({
//             statusCode: HTTPStatusCode.BAD_REQUEST,
//             message: "Foreign key constraint failed",
//             code: "FOREIGN_KEY_ERROR",
//             details: { constraint: err.meta },
//           });
//         case "P2014":
//           return new AppError({
//             statusCode: HTTPStatusCode.BAD_REQUEST,
//             message: "Invalid data provided",
//             code: "INVALID_DATA",
//             details: { relation: err.meta },
//           });
//         default:
//           return new AppError({
//             statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
//             message: "Database operation failed",
//             code: "DATABASE_ERROR",
//             details: { prismaCode: err.code, meta: err.meta },
//           });
//       }
//     }

//     // 2. Handle Unknown or Initialization Errors
//     if (
//       err instanceof PrismaClientUnknownRequestError ||
//       err instanceof PrismaClientInitializationError
//     ) {
//       return new AppError({
//         statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
//         message: "Database connection or execution failed",
//         code: "DATABASE_RUNTIME_ERROR",
//         details: { originalError: (err as Error).message },
//       });
//     }
//     // Return null if it's not a Prisma error, allowing other mappers to try
//     return null;
//   }
// }

import { InfrastructureProvider } from "@/core/InfrastructureProvider";
import { errorMapperRegistry } from "@/core/errors/ErrorMapperRegistry";
import { AppError, ConflictError, NotFoundError } from "@/core/errors/AppError";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/client";
import { PrismaClient } from "@/prisma/generated/client";

type ErrorWithCode = Error & { code?: string };

export class PrismaProvider implements InfrastructureProvider<PrismaClient> {
  public name = "Prisma Database";

  constructor(private readonly prismaClient: PrismaClient) {
    errorMapperRegistry.register(this.mapPrismaError.bind(this));
  }

  public getClient(): PrismaClient {
    return this.prismaClient;
  }

  public async connect(): Promise<void> {
    try {
      await this.prismaClient.$connect();
      console.log("✅ Prisma connected");
    } catch (error) {
      console.error("❌ Prisma connect failed", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.prismaClient.$disconnect();
  }

  private mapPrismaError(err: unknown): AppError | null {
    const errorCode = (err as ErrorWithCode)?.code;

    if (errorCode === "ETIMEDOUT") {
      return new AppError({
        statusCode: HTTPStatusCode.SERVICE_UNAVAILABLE,
        message: "Database connection timed out",
        code: "DATABASE_TIMEOUT",
        details: {
          hint: "Cannot reach PostgreSQL host. Check network/firewall access to port 5432.",
        },
      });
    }

    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002":
          return new ConflictError("A record with this data already exists", {
            fields: err.meta?.target,
          });

        case "P2025":
          return new NotFoundError("Record to update not found", {
            operation: err.meta,
          });

        default:
          return new AppError({
            statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
            message: "Database operation failed",
            code: "DATABASE_ERROR",
            details: {
              prismaCode: err.code,
              meta: err.meta,
            },
          });
      }
    }

    if (
      err instanceof PrismaClientUnknownRequestError ||
      err instanceof PrismaClientInitializationError
    ) {
      return new AppError({
        statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        message: "Database connection failed",
        code: "DATABASE_RUNTIME_ERROR",
        details: {
          originalError: (err as Error).message,
        },
      });
    }

    return null;
  }
}
