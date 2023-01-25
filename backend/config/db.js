const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected:: ${conn.connection.host}`.cyan.underline);
  } catch (e) {
    console.error(`Error in Mongo Connection:: ${e.message}`.red);
    process.exit(0);
  }
};

module.exports = connectDB;
