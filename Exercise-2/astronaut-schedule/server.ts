import express from "express";
import { scheduleController } from "./src/app/controllers/scheduleController";

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve HTML frontend

app.get("/", (req, res) => {
  res.send("Astronaut Schedule API is running 🚀");
});

app.post("/run", async (req, res) => {
  const { cmd, args } = req.body;
  const result = await scheduleController(cmd, args || []); 
  res.json(result); 
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));