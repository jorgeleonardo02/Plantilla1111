/* import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from './chat-message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([])

  constructor() {
    this.InitConectionSocket();
  }

  InitConectionSocket() {
    const url = 'http://localhost:8888/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  joinRoom(roomId: string) {
    this.stompClient.onConnect = () => {
      this.stompClient.subscribe(`/topic/${roomId}`, (message: Message) => {
        const messageContent = JSON.parse(message.body);
        console.log(messageContent);
        const currentsMessage = this.messageSubject.getValue();//capturo los mensajes que tengo en memeria
        this.messageSubject.next(messageContent);
      });
    };

    if (this.stompClient.connected) {
      this.stompClient.subscribe(`/topic/${roomId}`, (message: Message) => {
        const messageContent = JSON.parse(message.body);
        console.log(messageContent);
        const currentsMessage = this.messageSubject.getValue();//capturo los mensajes que tengo en memeria
        this.messageSubject.next(currentsMessage);
      });
    }
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    //if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(chatMessage)
      });
    //}
  }
  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
} */

/* import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from './chat-message';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;

  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([])

  constructor() {
    this.InitConectionSocket();
  }

  InitConectionSocket() {
    const url = '//localhost:8888/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        console.log(messageContent);
        //const currentsMessage = this.messageSubject.getValue();//capturo los mensajes que tengo en memeria
        this.messageSubject.next(messageContent);
      });
    });
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
  }
  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
} */
  import { Injectable } from '@angular/core';
  import { Stomp } from '@stomp/stompjs';
  import SockJS from 'sockjs-client';
  import { Observable, Subject } from 'rxjs';
  import { ChatMessage } from './chat-message';
  
  @Injectable({
    providedIn: 'root'
  })
  /* export class ChatService {
    private stompClient: any;
    private messageSubject: Subject<ChatMessage> = new Subject<ChatMessage>();
  
    constructor() {
      this.initConnectionSocket();
    }
  
    private initConnectionSocket() {
      const url = '//localhost:8888/chat-socket';
      const socket = new SockJS(url);
      this.stompClient = Stomp.over(socket);
    }
  
    joinRoom(roomId: string): Observable<ChatMessage> {
      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
          const messageContent: ChatMessage = JSON.parse(message.body);
          this.messageSubject.next(messageContent);
        });
      });
      return this.messageSubject.asObservable();
    }
  
    sendMessage(roomId: string, chatMessage: ChatMessage) {
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    }
  } */
    export class ChatService {
      private stompClient: any;
      private messageSubject: Subject<ChatMessage> = new Subject<ChatMessage>();
      constructor() {
        this.initConnectionSocket();
      }
      private initConnectionSocket() {
        const url = '//localhost:8888/chat-socket';
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
      }
      joinRoom(roomId: string): Observable<ChatMessage> {
        this.stompClient.connect({}, () => {
          if (!this.stompClient.connected) {
            return;
          }
          this.stompClient.unsubscribe(`/topic/${roomId}`);
          this.stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
            const messageContent: ChatMessage = JSON.parse(message.body);
            this.messageSubject.next(messageContent);
          });
        });
        return this.messageSubject.asObservable();
      }
      sendMessage(roomId: string, chatMessage: ChatMessage) {
        this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
      }
    }