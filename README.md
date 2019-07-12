<p align="center">
  <em>NOTICE</em>: <code>testrpc</code> is now <code>ganache-cli</code>. Use it just as you would <code>testrpc</code>.
</p>
<hr/>

[![npm](https://img.shields.io/npm/v/ganache-cli.svg)]()
[![npm](https://img.shields.io/npm/dm/ganache-cli.svg)]()
[![Build Status](https://travis-ci.org/trufflesuite/ganache-cli.svg?branch=master)](https://travis-ci.org/trufflesuite/ganache-cli)  

<p align="center">
  <img src="/resources/icons/ganache-cli-128x128.png">
</p>

## Welcome to Macaron CLI
Macaron CLI, is an alternative version of [ganache-cli](https://github.com/trufflesuite/ganache-cli) modified to work with [solidity-coverage](https://github.com/ripio/solidity-coverage)

Macaron CLI uses ethereumjs to simulate full client behavior and make developing Ethereum applications faster, easier, and safer. It also includes all popular RPC functions and features (like events) and can be run deterministically to make development a breeze.


### Installation

`macaron-cli` is written in JavaScript and distributed as a Node.js package via `npm`. Make sure you have Node.js (>= v6.11.5) installed.

Using npm:

```Bash
npm install -g macaron-cli
```

or, if you are using [Yarn](https://yarnpkg.com/):

```Bash
yarn global add macaron-cli
```
### Using Macaron CLI

#### Command Line

```Bash
$ macaron-cli <options>
```

Options:

* `-a` or `--accounts`: Specify the number of accounts to generate at startup.
* `-e` or `--defaultBalanceEther`: Amount of ether to assign each test account. Default is 100.
* `-b` or `--blockTime`: Specify blockTime in seconds for automatic mining. If you don't specify this flag, macaron will instantly mine a new block for every transaction. Using the --blockTime flag is discouraged unless you have tests which require a specific mining interval.
* `-d` or `--deterministic`: Generate deterministic addresses based on a pre-defined mnemonic.
* `-n` or `--secure`: Lock available accounts by default (good for third party transaction signing)
* `-m` or `--mnemonic`: Use a bip39 mnemonic phrase for generating a PRNG seed, which is in turn used for hierarchical deterministic (HD) account generation.
* `-p` or `--port`: Port number to listen on. Defaults to 8545.
* `-h` or `--host` or `--hostname`: Hostname to listen on. Defaults to 127.0.0.1 (defaults to 0.0.0.0 for Docker instances of macaron-cli).
* `-s` or `--seed`: Use arbitrary data to generate the HD wallet mnemonic to be used.
* `-g` or `--gasPrice`: The price of gas in wei (defaults to 20000000000)
* `-l` or `--gasLimit`: The block gas limit (defaults to 0x6691b7)
* `-f` or `--fork`: Fork from another currently running Ethereum client at a given block. Input should be the HTTP location and port of the other client, e.g. `http://localhost:8545`. You can optionally specify the block to fork from using an `@` sign: `http://localhost:8545@1599200`.
* `-i` or `--networkId`: Specify the network id macaron-cli will use to identify itself (defaults to the current time or the network id of the forked blockchain if configured)
* `--db`: Specify a path to a directory to save the chain database. If a database already exists, macaron-cli will initialize that chain instead of creating a new one.
* `--debug`: Output VM opcodes for debugging
* `--mem`: Output macaron-cli memory usage statistics. This replaces normal output.
* `-q` or `--quiet`: Run macaron-cli without any logs.
* `-v` or `--verbose`: Log all requests and responses to stdout
* `-?` or `--help`: Display help information
* `--version`: Display the version of macaron-cli
* `--noVMErrorsOnRPCResponse`: Do not transmit transaction failures as RPC errors. Enable this flag for error reporting behaviour which is compatible with other clients such as geth and Parity.
* `--allowUnlimitedContractSize`: Allows unlimited contract sizes while debugging. By enabling this flag, the check within the EVM for contract size limit of 24KB (see EIP-170) is bypassed. Enabling this flag **will** cause macaron-cli to behave differently than production environments.
* `--keepAliveTimeout`: Sets the HTTP server's `keepAliveTimeout` in milliseconds. See the [NodeJS HTTP docs](https://nodejs.org/api/http.html#http_server_keepalivetimeout) for details. `5000` by default.
* `-t` or `--time`: Date (ISO 8601) that the first block should start. Use this feature, along with the evm_increaseTime method to test time-dependent code.

Special Options:

* `--account`: Specify `--account=...` (no 's') any number of times passing arbitrary private keys and their associated balances to generate initial addresses:

  ```
  $ macaron-cli --account="<privatekey>,balance" [--account="<privatekey>,balance"]
  ```

  Note that private keys are 64 characters long, and must be input as a 0x-prefixed hex string. Balance can either be input as an integer or 0x-prefixed hex value specifying the amount of wei in that account.

  An HD wallet will not be created for you when using `--account`.

* `-u` or `--unlock`: Specify `--unlock ...` any number of times passing either an address or an account index to unlock specific accounts. When used in conjunction with `--secure`, `--unlock` will override the locked state of specified accounts.

  ```
  $ macaron-cli --secure --unlock "0x1234..." --unlock "0xabcd..."
  ```

  You can also specify a number, unlocking accounts by their index:

  ```
  $ macaron-cli --secure -u 0 -u 1
  ```

  This feature can also be used to impersonate accounts and unlock addresses you wouldn't otherwise have access to. When used with the `--fork` feature, you can use macaron-cli to make transactions as any address on the blockchain, which is very useful for testing and dynamic analysis.

#### Library

As a [Web3](https://github.com/ethereum/web3.js/) provider:

```javascript
const macaron = require("macaron-cli");
web3.setProvider(macaron.provider());
```

As an [ethers.js](https://github.com/ethers-io/ethers.js/) provider:

```javascript
const macaron = require("macaron-cli");
const provider = new ethers.providers.Web3Provider(macaron.provider());
```

As a general HTTP and WebSocket server:

```javascript
const macaron = require("macaron-cli");
const server = macaron.server();
server.listen(port, function(err, blockchain) {...});
```

Both `.provider()` and `.server()` take a single object which allows you to specify behavior of `macaron-cli`. This parameter is optional. Available options are:

* `"accounts"`: `Array` of `Object`'s. Each object should have a balance key with a hexadecimal value. The key `secretKey` can also be specified, which represents the account's private key. If no `secretKey`, the address is auto-generated with the given balance. If specified, the key is used to determine the account's address.
* `"debug"`: `boolean` - Output VM opcodes for debugging
* `"blockTime"`: `number` - Specify blockTime in seconds for automatic mining. If you don't specify this flag, macaron will instantly mine a new block for every transaction. Using the `blockTime` option is discouraged unless you have tests which require a specific mining interval.
* `"logger"`: `Object` - Object, like `console`, that implements a `log()` function.
* `"mnemonic"`: Use a specific HD wallet mnemonic to generate initial addresses.
* `"port"`: Port number to listen on when running as a server.
* `"seed"`: Use arbitrary data to generate the HD wallet mnemonic to be used.
* `"default_balance_ether"`: `number` - The default account balance, specified in ether.
* `"total_accounts"`: `number` - Number of accounts to generate at startup.
* `"fork"`: `string` or `object` - When a `string`, same as `--fork` option above. Can also be a Web3 Provider object, optionally used in conjunction with the `fork_block_number` option below.
* `"fork_block_number"`: `string` or `number` - Block number the provider should fork from, when the `fork` option is specified. If the `fork` option is specified as a string including the `@` sign and a block number, the block number in the `fork` parameter takes precedence.
* `"network_id"`: Specify the network id macaron-core will use to identify itself (defaults to the current time or the network id of the forked blockchain if configured)
* `"time"`: `Date` - Date that the first block should start. Use this feature, along with the `evm_increaseTime` method to test time-dependent code.
* `"locked"`: `boolean` - whether or not accounts are locked by default.
* `"unlocked_accounts"`: `Array` - array of addresses or address indexes specifying which accounts should be unlocked.
* `"db_path"`: `String` - Specify a path to a directory to save the chain database. If a database already exists, `macaron-cli` will initialize that chain instead of creating a new one.
* `"db"`: `Object` - Specify an alternative database instance, for instance [MemDOWN](https://github.com/level/memdown).
* `"ws"`: Enable a websocket server. This is `true` by default.
* `"account_keys_path"`: `String` - Specifies a file to save accounts and private keys to, for testing.
* `"vmErrorsOnRPCResponse"`: `boolean` - Whether or not to transmit transaction failures as RPC errors. Set to `false` for error reporting behaviour which is compatible with other clients such as geth and Parity. This is `true` by default to replicate the error reporting behavior of previous versions of macaron.
* `"hdPath"`: The hierarchical deterministic path to use when generating accounts. Default: "m/44'/60'/0'/0/"
* `"allowUnlimitedContractSize"`: `boolean` - Allows unlimited contract sizes while debugging. By setting this to `true`, the check within the EVM for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed. Setting this to `true` **will** cause `macaron-cli` to behave differently than production environments. (default: `false`; **ONLY** set to `true` during debugging).
* `"gasPrice"`: Sets the default gas price for transactions if not otherwise specified. Must be specified as a hex string in wei. Defaults to `"0x77359400"`, or 2 gwei.
* `"gasLimit"`: Sets the block gas limit. Must be specified as a hex string. Defaults to `"0x6691b7"`.
* `"keepAliveTimeout"`: If using `.server()` - Sets the HTTP server's `keepAliveTimeout` in milliseconds. See the [NodeJS HTTP docs](https://nodejs.org/api/http.html#http_server_keepalivetimeout) for details. `5000` by default.

### Implemented Methods

The RPC methods currently implemented are:

* `bzz_hive` (stub)
* `bzz_info` (stub)
* `debug_traceTransaction`
* `eth_accounts`
* `eth_blockNumber`
* `eth_call`
* `eth_coinbase`
* `eth_estimateGas`
* `eth_gasPrice`
* `eth_getBalance`
* `eth_getBlockByNumber`
* `eth_getBlockByHash`
* `eth_getBlockTransactionCountByHash`
* `eth_getBlockTransactionCountByNumber`
* `eth_getCode` (only supports block number “latest”)
* `eth_getCompilers`
* `eth_getFilterChanges`
* `eth_getFilterLogs`
* `eth_getLogs`
* `eth_getStorageAt`
* `eth_getTransactionByHash`
* `eth_getTransactionByBlockHashAndIndex`
* `eth_getTransactionByBlockNumberAndIndex`
* `eth_getTransactionCount`
* `eth_getTransactionReceipt`
* `eth_hashrate`
* `eth_mining`
* `eth_newBlockFilter`
* `eth_newFilter` (includes log/event filters)
* `eth_protocolVersion`
* `eth_sendTransaction`
* `eth_sendRawTransaction`
* `eth_sign`
* `eth_subscribe` (only for websocket connections. "syncing" subscriptions are not yet supported)
* `eth_unsubscribe` (only for websocket connections. "syncing" subscriptions are not yet supported)
* `eth_syncing`
* `eth_uninstallFilter`
* `net_listening`
* `net_peerCount`
* `net_version`
* `miner_start`
* `miner_stop`
* `personal_listAccounts`
* `personal_lockAccount`
* `personal_newAccount`
* `personal_importRawKey`
* `personal_unlockAccount`
* `personal_sendTransaction`
* `shh_version`
* `rpc_modules`
* `web3_clientVersion`
* `web3_sha3`

There’s also special non-standard methods that aren’t included within the original RPC specification:

* `evm_snapshot` : Snapshot the state of the blockchain at the current block. Takes no parameters. Returns the integer id of the snapshot created.
* `evm_revert` : Revert the state of the blockchain to a previous snapshot. Takes a single parameter, which is the snapshot id to revert to. If no snapshot id is passed it will revert to the latest snapshot. Returns `true`.
* `evm_increaseTime` : Jump forward in time. Takes one parameter, which is the amount of time to increase in seconds. Returns the total time adjustment, in seconds.
* `evm_mine` : Force a block to be mined. Takes one optional parameter, which is the timestamp a block should setup as the mining time. Mines a block independent of whether or not mining is started or stopped.

### Unsupported Methods

* `eth_compileSolidity`: If you'd like Solidity compilation in Javascript, please see the [solc-js project](https://github.com/ethereum/solc-js).

# License
[MIT](https://tldrlegal.com/license/mit-license)
