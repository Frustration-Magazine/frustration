import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* ------ */
/*  READ  */
/* ------ */

export async function readRecords({ table, where, orderBy, take, success }: { table: string; where: any; take?: number; orderBy: any; success: any }): Promise<any> {
  let status = {
    success: null,
    error: null
  };
  let data = [];

  // 🔁 readableError
  try {
    data = await (prisma as any)[table].findMany({ where, orderBy, take });
    status.success = success;
  } catch (e) {
    // ❌ Error | P202
    console.error("Error while reading records", e);
    const readableError = (e as any)?.message ?? "Une erreur inconnue s'est produite";
    status.error = readableError;
  } finally {
    return { data, status };
  }
}

/* ------ */
/* CREATE */
/* ------ */

export async function createRecord({ table, data, success }: { table: string; data: any; success: any }): Promise<any> {
  let status = {
    success: null,
    error: null
  };

  let result = null;
  // 🔁 Insert
  try {
    result = await (prisma as any)[table].create({ data });
    status.success = success;
  } catch (e) {
    // ❌ Error | P202
    console.error("Error while creating a new record", e);
    const readableError = (e as any)?.message ?? "Une erreur inconnue s'est produite";
    status.error = readableError;
  } finally {
    return { status, result };
  }
}

/* ------ */
/* UPDATE */
/* ------ */

export async function updateRecord({ table, data, success }: { table: string; data: any; success: any }): Promise<any> {
  let status = {
    success: null,
    error: null
  };

  // 🔁 Insert
  try {
    await (prisma as any)[table].update({ where: { id: data.id }, data });
    status.success = success;
  } catch (e) {
    // ❌ Error | P202
    console.error("Error while updating a new record", e);
    const readableError = (e as any)?.message ?? "Une erreur inconnue s'est produite";
    status.error = readableError;
  } finally {
    return status;
  }
}

/* ------ */
/* DELETE */
/* ------ */
export async function deleteRecord({ table, id, success }: { table: string; id: string | number; success: any }): Promise<any> {
  let status = {
    success: null,
    error: null
  };

  // 🔁 Insert
  try {
    await (prisma as any)[table].delete({
      where: {
        id
      }
    });
    status.success = success;
  } catch (e) {
    // ❌ Error | P202
    console.error("Error while deleting an existing record", e);
    const readableError = (e as any)?.message ?? "Une erreur inconnue s'est produite";
    status.error = readableError;
  } finally {
    return status;
  }
}
