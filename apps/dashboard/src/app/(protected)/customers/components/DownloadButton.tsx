"use client";

import { Button } from "@/components/ui/button";
import { Customer } from "data-access/stripe";
import { explicitDate } from "utils";
import { createCSVinURL, downloadFileFromUrl } from "utils";
import { IoIosDownload } from "react-icons/io";

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

export default function ({
  customers,
  rangeDate,
}: {
  customers: Customer[];
  rangeDate: {
    from: Date;
    to: Date;
  };
}) {
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
      variant="inverted"
    >
      <IoIosDownload size={17} />
      <span> Télécharger </span>
    </Button>
  );
}
