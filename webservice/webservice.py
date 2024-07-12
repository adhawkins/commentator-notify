#!/usr/bin/env python3

import asyncio
import weakref
import aiohttp
import aiohttp.web

from pprint import pprint

websockets = aiohttp.web.AppKey("websockets", weakref.WeakSet)
routes = aiohttp.web.RouteTableDef()


@routes.get('/notify')
async def notify(request):
    notifications = []

    for ws in set(request.app[websockets]):
        notifications.append(asyncio.create_task(
            ws.send_str(request.query['user'])))

    if notifications:
        await asyncio.wait(notifications, return_when=asyncio.ALL_COMPLETED)

    return aiohttp.web.Response(text=f"Hello '{request.query['user']}'")


@routes.get('/ws')
async def websocket_handler(request):
    ws = aiohttp.web.WebSocketResponse()
    await ws.prepare(request)
    request.app[websockets].add(ws)
    sockets = set(request.app[websockets])

    try:
        async for msg in ws:
            if msg.type == aiohttp.WSMsgType.TEXT:
                if msg.data == 'close':
                    await ws.close()
                else:
                    await ws.send_str(msg.data + '/answer')
    finally:
        request.app[websockets].discard(ws)
        print('Websocket connection closed')

    return ws


async def on_shutdown(app):
    for ws in set(app[websockets]):
        await ws.close(code=aiohttp.WSCloseCode.GOING_AWAY, message="Server shutdown")


def main():
    app = aiohttp.web.Application()

    app[websockets] = weakref.WeakSet()
    app.on_shutdown.append(on_shutdown)

    app.router.add_routes(routes)

    app.router.add_static('/',
                          path='static',
                          name='static')

    aiohttp.web.run_app(app, host='0.0.0.0', port=54545)


if __name__ == '__main__':
    main()
