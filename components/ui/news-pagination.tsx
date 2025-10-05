"use client";

import { useRouter } from "next/navigation";
import Pagination from "./pagination";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export default function NewsPagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
}: NewsPaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/news?page=${page}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalCount={totalCount}
      limit={limit}
    />
  );
}
