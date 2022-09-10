#!/usr/bin/env node

import {toBufferBE} from "bigint-buffer";
import {digest} from "@chainsafe/as-sha256";
import bls from "@chainsafe/bls";
import {bytesToBigInt, intToBytes} from "@lodestar/utils";
import { Keystore } from "@chainsafe/bls-keystore";
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'fs'

yargs(hideBin(process.argv))
  .command({
    command: 'create',
    describe: 'generates interop keystore files',
    builder: {
        count: {
            describe: 'number of interop keystore files to generate',
            demandOption: true,
            type: 'number'
        },
        password: {
            describe: 'password to encrypt the keystore file',
            demandOption: true,
            type: 'string'
        },
        out: {
            describe: 'directory to generate the keystore files. if none is given, it is generated inside ./keystores',
            demandOption: false,
            type: 'string'
        }
    },
    handler(argv) {
        processCommand(argv);
    }
  })
  .demandCommand(1)
  .argv



function getCurveOrder() {
    let curveOrder;
    if (!curveOrder) {
        curveOrder = BigInt("52435875175126190479447740508185965837690552500527637822603658699938581184513");
    }
    return curveOrder;
}
  
function interopSecretKey(index) {
    const CURVE_ORDER = getCurveOrder();
    return toBufferBE(bytesToBigInt(digest(intToBytes(index, 32))) % CURVE_ORDER, 32);
}

async function processCommand(argv) {
    const count = argv.count;
    const password = argv.password;
    const destinationDir = argv.out || "./keystores"

    if (!fs.existsSync(destinationDir)){
        fs.mkdirSync(destinationDir, { recursive: true });
    }

    for (const index of Array(count).keys()) {
        const sk = interopSecretKey(index);
        const pk = bls.SecretKey.fromBytes(sk).toPublicKey().toBytes();
        const keystore = await Keystore.create(password, sk, pk, "");
        fs.writeFileSync(`${destinationDir}/keystore_interop_${index}.json`, keystore.stringify());
    }

}

  

