# regex-dns

Simple DNS server designed to map specific host names (determined by regular expressions) to static hosts. Non-matched host names are forwarded to DNS servers of your choosing

## Configuration

For all your configuration needs `Settings.json` file is located in the root folder. You can configure servers to forward to, regexp-to-IPv4 maps, port to listen on.

## Running
1. Install NodeJS and yarn globally
2. Clone this repo
3. Run `yarn install` in root folder
4. Run `.\node_modules\.bin\tsc` in root folder
4. Edit `Settings.json`
5. Run `node ./dist/index.js`