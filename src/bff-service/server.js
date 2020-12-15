const app = require("./app");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3001;

app.listen(port, host, () => {
  console.log(`Server listening on port ${port}!`);
});
