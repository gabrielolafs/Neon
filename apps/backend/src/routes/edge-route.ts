import express, { Router, Request, Response } from "express";
import { parseCSV } from "common/src/parser.ts";
import PrismaClient from "../bin/database-connection.ts";
import { edge } from "common/src/interfaces.ts";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    // const deleteNodes = PrismaClient.nodes.deleteMany({});
    // const deleteEdges = PrismaClient.edge.deleteMany({});
    // await PrismaClient.$transaction([deleteEdges, deleteNodes]);
    await PrismaClient.edge.deleteMany({});
    // Parse the CSV string to an array of CSVRow objects
    const rows = parseCSV(req.body["csvString"]);
    const transformed: edge[] = rows.map((row) => {
      const rowval = Object.values(row);
      return {
        edgeID: rowval[0].concat(rowval[1]),
        startNodeID: rowval[0],
        endNodeID: rowval[1],
      };
    });

    await PrismaClient.edge.createMany({
      data: transformed.map((self) => {
        return {
          startNodeID: self.startNodeID,
          edgeID: self.edgeID,
          endNodeID: self.endNodeID,
        };
      }),
    });
  } catch (error) {
    console.error(`Error while converting CSV to JSON: ${error}`);
    res.sendStatus(500);
  }
  res.sendStatus(200);
});

router.get("/", async function (req: Request, res: Response) {
  try {
    const edgeCSV = await PrismaClient.edge.findMany();
    res.send(edgeCSV);
  } catch (error) {
    console.error(`Error exporting edge data: ${error}`);
    res.sendStatus(500);
  }
  res.sendStatus(200);
});

export default router;
