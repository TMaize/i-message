export interface IMessage {
  request: string
  target?: Window
  data?: any
  timeout?: number
}

export interface IRequest {
  request: string
  messageId: string
  data?: any
}

export interface IResponse {
  code: number
  messageId: string
  error?: unknown
  data?: any
}

export type CallbackHandler = (payload: IRequest, callback: (data: IResponse) => void) => void

export type PromiseHandler = (payload: IRequest) => Promise<IResponse>

const handlerMap: Record<string, PromiseHandler> = {}

const waitMap: Record<string, { payload: IRequest; resolve: Function; reject: Function; timer: number }> = {}

const global = {
  init: false
}

async function onMessage(ev: MessageEvent<IRequest | IResponse>) {
  const anyData = ev.data as any

  // 接收到请求
  if (anyData.messageId && anyData.request && anyData.messageId) {
    const data = anyData as IRequest
    const handler = handlerMap[data.request]
    if (!handler) return
    try {
      const result = await handler(data)
      if (result instanceof Error) throw result
      if (result.code) {
        const resp: IResponse = { messageId: data.messageId, data: result.data, code: result.code }
        ev.source?.postMessage(resp)
        return
      }
      const resp: IResponse = { messageId: data.messageId, data: result, code: 200 }
      ev.source?.postMessage(resp)
    } catch (err) {
      const resp: IResponse = { messageId: data.messageId, error: err, code: -1 }
      ev.source?.postMessage(resp)
    }
  }

  // 接收到响应
  if (anyData.messageId && !anyData.request && anyData.messageId) {
    const data = anyData as IResponse

    const detail = waitMap[data.messageId]
    clearTimeout(detail.timer)
    delete waitMap[data.messageId]
    if (!detail) return

    if (!data.error) {
      detail.resolve(data.data)
    } else {
      detail.reject(data.error)
    }
  }
}

function init() {
  if (global.init) return
  global.init = true
  window.addEventListener('message', onMessage)
}

export function on(request: string, handler: CallbackHandler | PromiseHandler) {
  init()

  handlerMap[request] = async function (payload: IRequest) {
    if (handler.length == 2) {
      return new Promise<IResponse>(resolve => handler(payload, resolve))
    }
    return await (handler as PromiseHandler)(payload)
  }
}

export function off(request: string): void {
  delete handlerMap[request]
}

export async function emit(data: IMessage): Promise<IResponse> {
  init()

  if (!data.request) throw new Error('缺少参数 request')

  const messageId = String(Date.now())
  const target = data.target || window.parent
  const timeout = data.timeout || 10 * 1000
  const payload: IRequest = { messageId, request: data.request, data: data.data }

  const promise = new Promise<IResponse>((resolve, reject) => {
    waitMap[messageId] = {
      payload,
      resolve,
      reject,
      timer: window.setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout)
    }
  })

  target.postMessage(payload, '*')
  return promise
}
