const mongoose = require("mongoose");

mongoose.connect("TU_CADENA_DE_CONEXIÓN", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error:", err));
