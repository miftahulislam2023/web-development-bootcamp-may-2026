import { auth } from "@/lib/auth";
import prisma from "@/prisma/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import CategoriesTable from "./ui/categories-table";
import CreateCategoryModal from "./ui/create-category-modal";
import { ICategoriesOrderByMap } from "@/interfaces/interfaces";

export default async function Categories({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; orderBy?: string; orderDir?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Please sign in to see your categories.
      </div>
    );
  }

  const params = await searchParams;
  const page = params?.page ? parseInt(params.page) : 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const orderByParam = (params?.orderBy ?? "created_at").toLowerCase();
  const orderDirParam = (params?.orderDir ?? "desc").toLowerCase();
  const orderDirection = orderDirParam === "asc" ? "asc" : "desc";
  const orderByMap: ICategoriesOrderByMap = {
    name: "name",
    type: "type",
    created_at: "created_at",
  };
  const orderByField = orderByMap[orderByParam] ?? "created_at";

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { [orderByField]: orderDirection },
    skip,
    take: limit,
  });

  const totalCount = await prisma.category.count({
    where: { userId: session.user.id },
  });
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;
  const sortParams = `orderBy=${encodeURIComponent(orderByParam)}&orderDir=${encodeURIComponent(orderDirection)}`;

  return (
    <div className="container w-full py-10 px-5">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <CreateCategoryModal />
      </div>
      {categories && categories.length > 0 ? (
        <>
          <CategoriesTable 
            categories={categories} 
            pagination={{ totalPages, currentPage: page }}
            sortParams={sortParams}
          />
          {/* <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {prevPage ? (
                <Link
                  className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                  href={`/dashboard/categories?page=${prevPage}&${sortParams}`}
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-md border border-border/40 px-3 py-1.5 text-sm font-medium opacity-50">
                  Previous
                </span>
              )}
              {nextPage ? (
                <Link
                  className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                  href={`/dashboard/categories?page=${nextPage}&${sortParams}`}
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-md border border-border/40 px-3 py-1.5 text-sm font-medium opacity-50">
                  Next
                </span>
              )}
            </div>
          </div> */}
        </>
      ) : (
        <div className="py-8 text-sm text-muted-foreground">
          No category added yet.
        </div>
      )}
    </div>
  );
}