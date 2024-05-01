import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../Models/message';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
   apiUrl = environment.apiUrl+'/api/messages'
   private audio !: HTMLAudioElement;

  constructor(private http: HttpClient) { }
  find(params ?: any): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl, {params});
  }
  playAudio(): void {
    this.audio.play();
  }
}
