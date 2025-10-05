"use client";

import { useRouter } from "next/navigation";
import Pagination from "./pagination";

interface KnowledgePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export default function KnowledgePagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
}: KnowledgePaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/knowledge?page=${page}`);
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
