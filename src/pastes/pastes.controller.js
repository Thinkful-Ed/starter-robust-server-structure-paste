const pastes = require('../data/pastes-data');

function list(req, res) {
	const { userId } = req.params;
	const foundPaste = pastes.filter(
		userId ? (paste) => paste.user_id === Number(userId) : () => true
	);
	res.json({
		data: foundPaste,
	});
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

function bodyDataHas(propertyName) {
	return function (req, res, next) {
		const { data = {} } = req.body;
		if (data[propertyName]) {
			return next();
		}
		next({ status: 400, message: `Must include a ${propertyName}` });
	};
}

function exposurePropertyIsValid(req, res, next) {
	const { data: { exposure } = {} } = req.body;
	const validExposure = ['private', 'public'];
	if (validExposure.includes(exposure)) return next();
	next({
		status: 400,
		message: `Value of the 'exposure' property must be on of '${validExposure.join(
			', '
		)}.' Received: ${exposure}`,
	});
}

function syntaxPropertyIsValid(req, res, next) {
	const { data: { syntax } = {} } = req.body;
	const validSyntax = [
		'None',
		'JavaScript',
		'Python',
		'Ruby',
		'Perl',
		'C',
		'Scheme',
	];
	if (validSyntax.includes(syntax)) return next();
	next({
		status: 400,
		message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
	});
}

function expirationIsValidNumber(req, res, next) {
	const { data: { expiration } = {} } = req.body;
	if (expiration <= 0 || !Number.isInteger(expiration)) {
		return next({
			status: 400,
			message: `Expiration requires a valid number`,
		});
	}
	next();
}

function create(req, res) {
	const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
		req.body;
	const newPaste = {
		data: {
			id: ++lastPasteId,
			name,
			syntax,
			exposure,
			expiration,
			text,
			user_id,
		},
	};
	pastes.push(newPaste);
	res.status(201).json({ data: newPaste });
}

function pasteExists(req, res, next) {
	const { pasteId } = req.params;
	const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
	if (foundPaste) {
		res.locals.paste = foundPaste;
		return next();
	}
	next({
		status: 404,
		message: `Paste id not found: ${pasteId}`,
	});
}

function read(req, res) {
	const { pasteId } = req.params;
	res.json({ data: res.locals.paste });
}

function update(req, res) {
	const paste = res.locals.paste;
	const { data: { name, syntax, expiration, exposure, text } = {} } =
		req.body;
	paste.name = name;
	paste.syntax = syntax;
	paste.expiration = expiration;
	paste.exposure = exposure;
	paste.text = text;
	res.json({ data: paste });
}

function destroy(req, res) {
	const { pasteId } = req.params;
	const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
	const deletedPaste = pastes.splice(index, 1);
	res.sendStatus(204);
}

module.exports = {
	create: [
		bodyDataHas('name'),
		bodyDataHas('syntax'),
		bodyDataHas('exposure'),
		bodyDataHas('expiration'),
		bodyDataHas('text'),
		bodyDataHas('user_id'),
		exposurePropertyIsValid,
		syntaxPropertyIsValid,
		expirationIsValidNumber,
		create,
	],
	list,
	read: [pasteExists, read],
	update: [
		pasteExists,
		bodyDataHas('name'),
		bodyDataHas('syntax'),
		bodyDataHas('exposure'),
		bodyDataHas('expiration'),
		bodyDataHas('text'),
		exposurePropertyIsValid,
		syntaxPropertyIsValid,
		expirationIsValidNumber,
		update,
	],
	delete: [pasteExists, destroy],
};
