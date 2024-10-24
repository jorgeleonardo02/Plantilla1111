import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat-message';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'], 
  imports: [FormsModule, CommonModule] // Importa FormsModule aquí
})
/* export class ChatComponent implements OnInit {
  messageInput: string = '';
  userId: string = '';
  messageList: ChatMessage[] = [];
  constructor(private chatService: ChatService,
              public route: ActivatedRoute
  ) {} */
  /* ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    this.chatService.joinRoom("ABC");
    this.lisenerMessage();
  }
  sendMessage() {
    const chatMessage: ChatMessage = {
      message: this.messageInput,
      user: this.userId
    }
    this.chatService.sendMessage("ABC", chatMessage);
    this.messageList.push(chatMessage);  // Agrega el mensaje a la lista de mensajes
  }
  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages:any) =>{
      this.messageList = messages;
      console.log(this.messageList);
    })
  } */
    /* ngOnInit(): void {
      this.userId = this.route.snapshot.paramMap.get('userId')!;
      this.chatService.joinRoom(this.userId).subscribe((message: ChatMessage) => {
        this.messageList.push(message);
      });
    }
  
    sendMessage() {
      const chatMessage: ChatMessage = {
        message: this.messageInput,
        user: this.userId
      };
      this.chatService.sendMessage(this.userId, chatMessage);
      this.messageList.push(chatMessage); // Agrega el mensaje a la lista de mensajes
      this.messageInput = ''; // Limpia el campo de entrada después de enviar
    }
} */

    export class ChatComponent implements OnInit {
      messageInput: string = '';
      userId: string = '';
      messageList: ChatMessage[] = [];
    
      constructor(private chatService: ChatService, private route: ActivatedRoute) {}
    
      ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('userId')!;
        this.chatService.joinRoom("ABC").subscribe((message: ChatMessage) => {
          this.messageList.push(message);
        });
      }
    
      sendMessage() {
        const chatMessage: ChatMessage = {
          message: this.messageInput,
          user: this.userId
        };
        this.chatService.sendMessage("ABC", chatMessage);
        this.messageInput = ''; // Limpia el campo de entrada después de enviar
      }
    }




  
