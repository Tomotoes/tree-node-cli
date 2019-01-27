#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const tree = require('../tree')

const PATTERN_SEPARATOR = '|'

program
	.version(pkg.version)
	.option('-a, --all-files', 'All files, include hidden files, are printed.')
	.option('--dirs-first', 'List directories before files.')
	.option('-d, --dirs-only', 'List directories only.')
	.option(
		'-I, --exclude [patterns]',
		'Exclude files that match the pattern. | separates alternate patterns. ' +
			'Wrap your entire pattern in double quotes. E.g. `"node_modules|coverage".',
		string =>
			string.split(PATTERN_SEPARATOR).map(pattern => new RegExp(pattern))
	)
	.option(
		'-L, --max-depth <n>',
		'Max display depth of the directory tree.',
		parseInt
	)
	.option('-r, --reverse', 'Sort the output in reverse alphabetic order.')
	.option(
		'--folder-name [prefix{name}postfix]',
		'The folder name of the output is accompanied by a prefix and suffix, where {name} represents the folder name. ' +
			'Note: Before you use some symbols you need to add \\ , like `()` . ' +
			'If you need more advanced actions, such as editing folder names, use program calls.',
		name => folderName => name.replace(/{\s*name\s*}/gi, folderName)
	)
	.option(
		'--file-name [prefix{name}postfix]',
		'The file name of the output is accompanied by a prefix and suffix, where {name} represents the file name. ' +
		'Note: Before you use some symbols you need to add \\ , like `()` . ' +
			'If you need more advanced actions, such as editing file names, use program calls.',
		name => fileName => name.replace(/{\s*name\s*}/gi, fileName)
	)
	.parse(process.argv)

console.log(tree(program.args[0], program))
