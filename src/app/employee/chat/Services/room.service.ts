import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../Models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  apiUrl = 'https://backdeploy-7y83.onrender.com/api/'

  constructor(private http: HttpClient) { }

  find(params? : any) {
    return this.http.get<Room[]>(this.apiUrl + 'rooms/', {params});
  }

  findById(id: string) {
    return this.http.get<Room>(this.apiUrl + 'rooms/' + id);
  }

  save(item: Room) {
    return this.http.post(this.apiUrl + 'rooms/', item);
  }
}
