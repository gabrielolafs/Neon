import express, { Router } from "express";
import { Form } from "common/src/form.ts";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req, res) {
  const form: Form = req.body;

  form.roomNumber = parseInt(form.roomNumber);

  try {
    await PrismaClient.form.create({ data: form });
    console.log("Successfully posted to form");
  } catch (error) {
    console.error("Unable to create form");
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

export default router;
