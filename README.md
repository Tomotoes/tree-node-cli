# tree-node-cli

Lists the contents of directories in a tree-like format, similar to the Linux [`tree`](https://linux.die.net/man/1/tree) command. Both CLI and Node APIs are provided.

Tree is a recursive directory listing program that produces a depth indented listing of files. When a directory argument is given, tree lists all the files and/or directories found in the given directory.

Note: Symlinks are not followed.



## Installation

```bash
$ npm install tree-node-cli
# or globally
$ npm install -g tree-node-cli
```



## Example

```bash
$ tree -L 2 -I "node_modules" --folder-name \({name}\)[http://www.github.com]
(tree-node-cli)[http://www.github.com]
├── (bin)[http://www.github.com]
│   └── tree.js
├── (coverage)[http://www.github.com]
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── (lcov-report)[http://www.github.com]
│   └── lcov.info
├── jest.config.js
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
└── tree.js
```



## CLI

```bash
$ tree [options] [path/to/dir]
```

**Note:** Use the command `treee` on Windows and Linux to avoid conflicts with built-in `tree` command.

The following options are available:

```bash
$ tree -h
Usage: tree [options]

Options:
  -V, --version                        output the version number
  -a, --all-files                      All files, include hidden files, are printed.
  --dirs-first                         List directories before files.
  -d, --dirs-only                      List directories only.
  -I, --exclude [patterns]             Exclude files that match the pattern. | separates alternate patterns. Wrap your entire pattern in double quotes. E.g. `"node_modules|coverage".
  -L, --max-depth <n>                  Max display depth of the directory tree.
  -r, --reverse                        Sort the output in reverse alphabetic order.
  --folder-name [prefix{name}postfix]  The folder name of the output is accompanied by a prefix and suffix, where {name} represents the folder name. Note: Before you use some symbols you need to add \ , like `()` . If you need more advanced actions, such as editing folder names, use program calls.
  --file-name [prefix{name}postfix]    The file name of the output is accompanied by a prefix and suffix, where {name} represents the file name. Note: Before you use some symbols you need to add \ , like `()` . If you need more advanced actions, such as editing file names, use program calls.
  -h, --help                           output usage information


```



## API

```js
const tree = require('tree-node-cli')
const output = tree('path/to/dir', options)
```

`options` is a configuration object with the following fields:

| Field        | Default                    | Type     | Description                                                  |
| ------------ | -------------------------- | -------- | ------------------------------------------------------------ |
| `allFiles`   | `false`                    | Boolean  | All files are printed. By default, tree does not print hidden files (those beginning with a dot). |
| `dirsFirst`  | `false`                    | Boolean  | List directories before files.                               |
| `dirsOnly`   | `false`                    | Boolean  | List directories only.                                       |
| `exclude`    | `[]`                       | Array    | An array of regex to test each filename against. Matching files will be excluded and matching directories will not be traversed into. |
| `maxDepth`   | `Number.POSITIVE_INFINITY` | Number   | Max display depth of the directory tree.                     |
| `reverse`    | `false`                    | Boolean  | Sort the output in reverse alphabetic order.                 |
| `folderName` | `name => name`             | Function | The folder name of the output is accompanied by a prefix and suffix, where {name} represents the folder name. |
| `fileName`   | `name => name`             | Function | The file name of the output is accompanied by a prefix and suffix, where {name} represents the file name. |

```js
const tree = require('tree-node-cli')

const PRINT_PATH = 'path/to/dir'

const IMAGE_POSTFIX = ['.png', '.jpg', '.jpeg', '.webp']

const isImage = fileName => IMAGE_POSTFIX.find(_ => fileName.endsWith(_))

const output = tree(PRINT_PATH, {
	allFiles: false,
	exclude: [/node_modules/, /lcov/],
	maxDepth: 4,
	folderName(folderName) {
		if (folderName === 'src') {
			return 'my code'
		}
		return folderName
	},
	fileName(fileName) {
		if (isImage(fileName)) {
			return `https://github.com/tomotoes/CSharp/blob/master/${
				fileName.split('.')[0]
			}`
		}
		return fileName
	}
})

console.log(output)

```



## License

MIT
