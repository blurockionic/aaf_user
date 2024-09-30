import mongoose from "mongoose";
export const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URL, {
      dbName: "aqua_agro_farmtech", // MongoDB database name
    })
      .then(() => console.log("AAF CRM database connected."))
      .catch((error) => console.error("Error connecting to MongoDB:", error));
  };


  