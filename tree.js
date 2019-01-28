const fs = require('fs')
const path = require('path')

const DEFAULT_OPTIONS = {
	allFiles: false,
	dirsFirst: false,
	dirsOnly: false,
	exclude: [/\.DS_Store/, /node_modules/],
	maxDepth: Number.POSITIVE_INFINITY,
	reverse: false,
	folderName: name => name,
	fileName: name => name
}

const SYMBOLS = {
	BRANCH: '├── ',
	EMPTY: '',
	INDENT: '    ',
	LAST_BRANCH: '└── ',
	VERTICAL: '│   '
}

const isHiddenFile = fileName => /(^|\/)[_\.]/.test(fileName)
const isDirectory = filePath => fs.statSync(filePath).isDirectory()

const handleOptions = (options, files, filePath) => {
	if (!options.allFiles) {
		files = files.filter(file => !isHiddenFile(file))
	}

	if (options.reverse) {
		files.reverse()
	}

	if (options.dirsOnly) {
		files = files.filter(file => isDirectory(path.join(filePath, file)))
	} else if (options.dirsFirst) {
		const { _dirs, _files } = files.reduce(
			(result, file) => (
				result[isDirectory(file) ? '_dirs' : '_files'].push(file), result
			),
			{ _dirs: [], _files: [] }
		)
		files = [..._dirs, ..._files]
	}

	return files
}

const print = (
	{ file, filePath, currentDepth, precedingSymbols, isLast },
	options
) => {
	const lines = []

	if (options.exclude.find(pattern => pattern.test(filePath))) {
		return lines
	}

	if (currentDepth > options.maxDepth) {
		return lines
	}

	const isDir = isDirectory(filePath)

	const isFile = !isDir

	let line = precedingSymbols

	if (currentDepth >= 1) {
		line += isLast ? SYMBOLS.LAST_BRANCH : SYMBOLS.BRANCH
	}

	line += options[isDir ? 'folderName' : 'fileName'](file)
	
	lines.push(line)

	if (isFile) {
		return lines
	}

	const files = handleOptions(options, fs.readdirSync(filePath), filePath)

	files.forEach((file, index) => {
		const fileAttributes = {
			file,
			filePath: path.join(filePath, file),
			currentDepth: currentDepth + 1,
			precedingSymbols:
				precedingSymbols +
				(currentDepth >= 1
					? isLast
						? SYMBOLS.INDENT
						: SYMBOLS.VERTICAL
					: SYMBOLS.EMPTY),
			isLast: index === files.length - 1
		}

		const linesForFile = print(fileAttributes, options)

		lines.push(...linesForFile)
	})

	return lines
}

const tree = (filePath = '.', program) => {
	const combinedOptions = [
		'allFiles',
		'dirsFirst',
		'dirsOnly',
		'exclude',
		'maxDepth',
		'reverse',
		'folderName',
		'fileName'
	].reduce(
		(result, key) => (
			(result[key] = program[key] || DEFAULT_OPTIONS[key]), result
		),
		{}
	)

	const fileAttributes = {
		file: path.basename(path.join(process.cwd(), filePath)),
		filePath,
		currentDepth: 0,
		precedingSymbols: '',
		isLast: false
	}

	const output = print(fileAttributes, combinedOptions).join('\n')
	return output
}

module.exports = tree
