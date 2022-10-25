import './style.css'
import * as msg from './lib/main'

window.name = 'child'

function addLog(text: string) {
  const out = document.querySelector('#output')
  const $el = document.createElement('p')
  $el.innerText = text
  out?.appendChild($el)
}

document.querySelector('#send')?.addEventListener('click', async () => {
  const request = (document.querySelector('#method') as HTMLInputElement)?.value
  const data = JSON.parse((document.querySelector('#data') as HTMLInputElement)?.value)

  addLog('发送数据：' + JSON.stringify({ request, data }))

  try {
    const resp = await msg.emit({ request, target: window.parent, data })
    addLog('收到数据：' + JSON.stringify(resp))
  } catch (err) {
    addLog('收到错误：' + (err as Error).message)
  }
})
