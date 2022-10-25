# i-message

优雅的 iframe 通信封装

## 注册消息处理器

```ts
import * as msg from '@tmaize/i-message'

// 回调风格
// callback(new Error('xxx')) 返回错误
msg.on('test1', function (payload: msg.IRequest, callback: (data: any) => void) {
  setTimeout(() => {
    callback('resp:' + payload.messageId)
  }, 3000)
})

// promise 风格
// return new Error('xxx') | Promise<Error> 返回错误
msg.on('test2', async function (payload: msg.IRequest) {
  await sleep(3000)
  return 'resp: ' + payload.messageId
})
```

## 发送消息

```ts
import * as msg from '@tmaize/i-message'

const resp = await msg.emit({ request: 'test1', target: window.parent, data: {} })
```
