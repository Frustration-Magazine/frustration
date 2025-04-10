"use client";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@ui/components/table";
import { Button } from "@/components/Button";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Customer } from "@data-access/stripe";

const DEFAULT_VALUE = "-";

const columnsCustomers: ColumnDef<Customer>[] = [
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-inherit hover:text-inherit"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const created = row.getValue("created") as Date;
      const formatted = created.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      return formatted;
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <a href={`mailto:${email}`}>{email}</a>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-inherit hover:text-inherit"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Montant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amountInEuro = row.getValue("amount") as number;
      const formattedAmount = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0, // No decimal
      }).format(amountInEuro);

      return formattedAmount;
    },
  },
  {
    accessorKey: "line1",
    header: "Adresse",
    cell: ({ row }) => {
      const address = row.getValue("line1") as string;
      return address || DEFAULT_VALUE;
    },
  },
  {
    accessorKey: "city",
    header: "Ville",
    cell: ({ row }) => {
      const city = row.getValue("city") as string;
      return <span className="capitalize">{city ? city.toLowerCase() : DEFAULT_VALUE}</span>;
    },
  },
  {
    accessorKey: "state",
    header: "Région",
    cell: ({ row }) => {
      const country = row.getValue("state") as string;
      return country || DEFAULT_VALUE;
    },
  },
  {
    accessorKey: "country",
    header: "Pays",
    cell: ({ row }) => {
      const country = row.getValue("country") as string;
      return country || DEFAULT_VALUE;
    },
  },
  {
    accessorKey: "postal_code",
    header: "Code postal",
    cell: ({ row }) => {
      const postalCode = row.getValue("postal_code") as string;
      return postalCode || DEFAULT_VALUE;
    },
  },
];

/* =============== */
/*       UI        */
/* =============== */

export default function ({ customers }: { customers: Customer[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const filteredCustomers = customers;
  const table = useReactTable<Customer>({
    data: filteredCustomers,
    columns: columnsCustomers,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  // ❌ Early return if no customers loaded
  if (customers.length === 0) return <p>Aucun nouvel abonné sur cette période 😭</p>;

  return (
    <div className="self-stretch overflow-auto rounded-md bg-white px-6 py-2 shadow-lg">
      <Table>
        <TableCaption>Abonnés récents</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (flexRender(header.column.columnDef.header, header.getContext()) as any)}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext()) as any}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
