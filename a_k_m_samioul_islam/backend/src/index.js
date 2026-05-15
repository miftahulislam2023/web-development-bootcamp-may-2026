import "dotenv/config";

process.env.TZ = process.env.TZ || "Asia/Dhaka";

import connectDB from "./config/db/dbConnect.js";
import app from "./app.js";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed", error.message);
  });

app.get("/",(req,res)=>{
    res.send("Server running")
});