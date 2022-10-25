import './style.css'
import * as msg from './lib/main'

function addLog(text: string) {
  const out = document.querySelector('#output')
  const $el = document.createElement('p')
  $el.innerText = text
  out?.appendChild($el)
}

async function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

msg.on('test1', function (payload: msg.IRequest, callback: (data: any) => void) {
  addLog('收到数据:' + JSON.stringify(payload))
  setTimeout(() => {
    callback({ id: payload.messageId, k: 'v' })
  }, 1000)
})

msg.on('test2', async function (payload: msg.IRequest) {
  addLog('收到数据:' + JSON.stringify(payload))
  await sleep(1000)
  return 'resp: ' + payload.messageId
})

msg.on('testError', async function (payload: msg.IRequest) {
  addLog('收到数据:' + JSON.stringify(payload))
  return Promise.reject(new Error('reject:' + payload.messageId))
})
