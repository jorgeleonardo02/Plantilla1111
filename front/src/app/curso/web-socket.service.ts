/* import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private subject: Subject<any> = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const socket = new SockJS('http://localhost:8888/chat-socket');
    this.stompClient = Stomp.over(socket);

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/actualizacion-contenidos', (message) => {
        if (message.body) {
          this.subject.next(JSON.parse(message.body));
        }
      });
    };
  } */

/* import { Injectable } from '@angular/core';
import { Client, over } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private subject: Subject<any> = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const socket = new SockJS('http://localhost:8080/chat-socket');
    this.stompClient = over(socket);

    this.stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/actualizacion-contenidos', (message) => {
        if (message.body) {
          this.subject.next(JSON.parse(message.body));
        }
      });
    }, (error) => {
      console.error('Error connecting to WebSocket:', error);
    });
  }
 */
  /* public getMessages() {
    return this.subject.asObservable();
  }

  public sendMessage(message: any): void {
    this.stompClient.publish({ destination: '/app/message', body: JSON.stringify(message) });
  }
} */
import { Injectable } from '@angular/core';
import { Client, Message, StompConfig, StompHeaders } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { Contenido } from './curso';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private contenidoSubject: Subject<any> = new Subject<any>();
  constructor() {
    this.initializeWebSocketConnection();
  }
  private initializeWebSocketConnection(): void {
    const serverUrl = 'http://localhost:8888/chat-socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = new Client({
      webSocketFactory: () => ws,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    this.stompClient.onConnect = (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/actualizacion-contenidos', (message: Message) => {
        if (message.body) {
          this.contenidoSubject.next(JSON.parse(message.body));
        }
      });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
    this.stompClient.activate();
  }
  getMessages(): Observable<any> {
    return this.contenidoSubject.asObservable();
  }
}