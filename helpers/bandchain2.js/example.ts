import { Message, Data, Client } from './src/index'
import { Address, PrivateKey } from './src/wallet'

const { MsgSend } = Message
const { Coin } = Data

const amount = [new Coin(10000, 'uband')]
const from_addr = Address.fromAccBech32(
  'band1ksnd0f3xjclvg0d4z9w0v9ydyzhzfhuy47yx79',
)
const to_addr = Address.fromAccBech32(
  'band1p843hkdj2svjzm7zaceak07m9mtyf6hatcpvnl',
)
const msgSend = new MsgSend(from_addr, to_addr, amount)

let result = msgSend.asJson()
console.log(JSON.stringify(result))

const client = new Client('http://d3n-debug.bandprotocol.com/rest')

console.log(PrivateKey.generate())
const x = PrivateKey.fromMnemonic('s')
console.log(x.toHex())

console.log('---------------------------------------')

client
  .getChainID()
  .then((e) => console.log('chain ID: ', e))
  .catch((err) => console.log(err.response.data.error))

client
  .getDataSource(3)
  .then((e) => console.log('data source: ', e))
  .catch((err) => console.log(err))

client
  .getLatestRequest(
    8,
    '000000190000000652454e4254430000000457425443000000034449410000000342544d00000004494f545800000003464554000000034a5354000000034d434f000000034b4d440000000342545300000003514b430000000559414d563200000003585a4300000003554f5300000004414b524f00000003484e5400000003484f54000000034b4149000000034f474e00000003575258000000034b4441000000034f524e00000003464f52000000034153540000000553544f524a000000003b9aca00',
    3,
    4,
  )
  .then((e) => console.log('latest request: ', e))
  .catch((err) => console.log(err))

client
  .getRequestIDByTxHash(
    Buffer.from(
      '1C6EC3AC3D81B8C546CB4356ED9B92498898800309D8E3F9526DCF36A8005286',
      'hex',
    ),
  )
  .then((e) => console.log('request id: ', e))
  .catch((err) => console.log(err))
