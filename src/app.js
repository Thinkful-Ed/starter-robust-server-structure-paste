const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

app.use(express.json());

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
	const {
		data: {
			name,
			syntax,
			exposure,
			expiration,
			text,
			user_id
		} = {}
	} = req.body;
	const newPaste = {
		id: ++lastPasteId,
		name,
		syntax,
		exposure,
		expiration,
		text,
		user_id,
	};
	pastes.push(newPaste);
	res.json({ data: newPaste });
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
