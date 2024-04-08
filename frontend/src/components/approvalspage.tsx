import React, { useState, useEffect } from "react";
import { API_PATH } from "@/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

type LogEntry = {
  user_id: number;
  log_id: number;
  start_time: string;
  end_time: string;
  description: string;
  verified: boolean;
  username: string;
};

const columns: ColumnDef<LogEntry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: (info) => {
      const value = info.getValue() as string;
      return new Date(value).toLocaleString();
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: (info) => {
      const value = info.getValue() as string;
      return !value ? (
        <span className="text-muted-foreground">Not Specified</span>
      ) : (
        new Date(value).toLocaleString()
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => {
      const value = info.getValue() as string;
      const maxLength = 50; // Maximum number of characters to show
      return value.length > maxLength
        ? `${value.substring(0, maxLength)}...`
        : value;
    },
  },
];

const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [curAction, setCurAction] = useState<"verify" | "delete" | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    fetch(`${API_PATH}/logs?jwt=${localStorage.getItem("jwt")}&unverified=true`)
      .then((res) => res.json())
      .then((data) => {
        setApprovals(data);
        setIsLoading(false);
      });
  }, []);

  const table = useReactTable({
    data: approvals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  const actOnSelectedRows = (action: "verify" | "delete") => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedRowIds = selectedRows.map((row) => row.original.log_id);
    setCurAction(action);
    fetch(`${API_PATH}/update_logs?jwt=${localStorage.getItem("jwt")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logIDs: selectedRowIds,
        action,
      }),
    })
      .then((res) => res.json())
      .then(({ msg }) => {
        setApprovals((prev) =>
          prev.filter((log) => !selectedRowIds.includes(log.log_id))
        );
        setRowSelection({});
        toast.success(msg);
      })
      .finally(() => {
        setCurAction(null);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Approvals Queue</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => row.toggleSelected()}
                  className="cursor-pointer hover:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <Skeleton className="h-4 w-[200px]" />
                  ) : (
                    "No data"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Button
            variant="default"
            size="sm"
            className="ml-2"
            disabled={
              !table.getFilteredSelectedRowModel().rows.length ||
              curAction === "verify"
            }
            onClick={() => actOnSelectedRows("verify")}
          >
            {curAction === "verify" ? "Approving..." : "Approve"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="ml-2"
            disabled={
              !table.getFilteredSelectedRowModel().rows.length ||
              curAction === "delete"
            }
            onClick={() => actOnSelectedRows("delete")}
          >
            {curAction === "delete" ? "Deleting..." : "Delete"}
          </Button>
          <span className="ml-3">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ApprovalsPage;
