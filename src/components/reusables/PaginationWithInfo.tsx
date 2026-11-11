"use client";
import { Pagination } from "@heroui/react";
// import { Pagination, Input, Button } from "@nextui-org/react";

interface PaginationWithInfoProps {
  currentPage: number;
  perPage: number;
  totalContent: number;
  onPageChange: (page: number) => void;
}

const PaginationWithInfo: React.FC<PaginationWithInfoProps> = ({
  currentPage,
  perPage,
  totalContent,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalContent / perPage);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Display total viewed and total data */}
      <div className="text-sm text-gray-500">
        Showing <strong>{(currentPage - 1) * perPage + 1}</strong> -{" "}
        <strong>{Math.min(currentPage * perPage, totalContent)}</strong> of{" "}
        <strong>{totalContent}</strong>
      </div>

      <Pagination
        initialPage={currentPage}
        total={totalPages}
        onChange={handlePageChange}
        size="md"
        color="default"
        loop
      />
    </div>
  );
};

export default PaginationWithInfo;
