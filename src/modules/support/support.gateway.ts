import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsResponse
} from '@nestjs/websockets'
import { from, map, Observable, pipe } from 'rxjs'
import { Socket, Server } from 'socket.io'

import { SupportRequestClientService } from './support.service'

@WebSocketGateway()
export class SupportGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly supportService: SupportRequestClientService) {}

  @WebSocketServer() ws: Server

  afterInit(server: Server) {
    console.log('WS server started!')
  }

  handleConnection(client: Socket) {
    console.log(`Подключился клиент: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Отключился клиент: ${client.id}`)
  }
  /*
  @SubscribeMessage('createSupport')
  create(@MessageBody() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto)
  }


   @SubscribeMessage('findAllSupport')
  findAll() {
    return this.supportService.findAll()
  }

  @SubscribeMessage('findOneSupport')
  findOne(@MessageBody() id: number) {
    return this.supportService.findOne(id)
  }

  @SubscribeMessage('updateSupport')
  update(@MessageBody() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(updateSupportDto.id, updateSupportDto)
  }

  @SubscribeMessage('removeSupport')
  remove(@MessageBody() id: number) {
    return this.supportService.remove(id)
  } */
}
