### Eth Interop Keystore

Creates interop keystore files

```
node index.js create --help
index.js create

generates interop keystore files

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --count     number of interop keystore files to generate   [number] [required]
  --password  password to encrypt the keystore file          [string] [required]
  --out       directory to generate the keystore files. if none is given, it is
              generated inside ./keystores                              [string]
```

#### Run via npx

```
➜  eth_key npx eth-interop-keystores create --count=4 --password="pass"
➜  eth_key ls keystores
keystore_interop_0.json keystore_interop_1.json keystore_interop_2.json keystore_interop_3.json
```