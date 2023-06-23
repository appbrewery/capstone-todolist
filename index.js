import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
let workItems = [];
let lastDate;

app.get("/", function (req, res) {
  const now = new Date();
  if (lastDate && now.getDate() !== lastDate.getDate()) {
    items = [];
    workItems = [];
  }
  lastDate = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const day = now.toLocaleDateString("en-US", options);

  res.render("index.ejs", {
    listTitle: day,
    newListItems: items,
  });
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("index.ejs", {
    listTitle: "Work List",
    newListItems: workItems,
  });
});
app.post("/work", (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
