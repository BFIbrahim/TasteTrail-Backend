const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db')

dotenv.config();

connectDB()

const PORT = process.env.PORT || 5000

const app = express();

app.use(cors());
app.use(express.json());

app.use(require("./routes/auth.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/categories", require("./routes/category.routes"));
app.use("/recipes", require("./routes/recipe.routes"))
app.use("/reviews", require("./routes/review.routes"));
app.use("/cookbook", require("./routes/cookbook.routes"));
app.use("/meal-planner", require("./routes/mealPlanner.routes"));
app.use("/admin", require("./routes/admin.routes"));


app.get("/", (req, res) => {
    res.send("TasteTrail Server is Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



