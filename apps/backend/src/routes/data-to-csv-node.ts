import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

import { node } from "common/src/interfaces.ts";

function convertToCSV(data: node[]): string {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((node) => Object.values(node).join(","));
  return `${headers}\n${rows.join("\n")}`;
}

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodeCSV = await PrismaClient.nodes.findMany();
    const csvNode: string = convertToCSV(nodeCSV);
    res.status(200).send(csvNode);
  } catch (error) {
    console.error(`Error exporting node data: ${error}`);
    res.sendStatus(500);
  }
});

export default router;