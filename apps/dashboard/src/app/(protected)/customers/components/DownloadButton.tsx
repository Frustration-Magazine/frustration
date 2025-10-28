"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Customer } from "data-access/stripe";
import { explicitDate, createCSVinURL, downloadFileFromUrl } from "utils";

export interface FileHeader {
  name: string;
  key: string;
  display: boolean;
}

export const FILE_HEADERS: FileHeader[] = [
  {
    name: "Id",
    key: "id",
    display: false,
  },
  {
    name: "Crée",
    key: "created",
    display: true,
  },
  {
    name: "Nom",
    key: "name",
    display: true,
  },
  {
    name: "Email",
    key: "email",
    display: true,
  },
  {
    name: "Montant",
    key: "amount",
    display: true,
  },
  {
    name: "Adresse postale",
    key: "adresse_postale",
    display: true,
  },
  {
    name: "Ville",
    key: "ville",
    display: true,
  },
  {
    name: "Pays",
    key: "pays",
    display: true,
  },
  {
    name: "Code postal",
    key: "code_postal",
    display: true,
  },
];

/* =============== */
/*       UI        */
/* =============== */

export const DownloadButton = ({
  customers,
  rangeDate,
}: {
  customers: Customer[];
  rangeDate: {
    from: Date;
    to: Date;
  };
}) => {
  const handleDownloadCustomersList = () => {
    const headers = customers.length ? Object.keys(customers[0]) : [];
    const CSVinURL = createCSVinURL(headers, customers);
    let filename = `nouveaux_abonnes_du_${explicitDate(rangeDate.from)}_au_${explicitDate(rangeDate.to)}.csv`;
    filename = filename.toLowerCase().replace(/\s/g, "_");
    downloadFileFromUrl(CSVinURL, filename);
  };

  return (
    <Button
      onClick={handleDownloadCustomersList}
      className="flex items-center gap-2 rounded-md"
      variant="outline"
    >
      <Download />
      <span> Télécharger </span>
    </Button>
  );
};
