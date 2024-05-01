import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMissionDto } from '@core/Dtos/CreateMission.Dto';
import { Mission } from '@core/models/mission';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
// import * as jwt from 'jsonwebtoken';


@Injectable({
  providedIn: 'root'
})
export class MissionService extends UnsubscribeOnDestroyAdapter {
  private baseUrl = 'https://backdeploy-7y83.onrender.com/missions'; 
  isTblLoading = true;
  public dataChange: BehaviorSubject<Mission[]> = new BehaviorSubject<Mission[]>([]);
  dialogData!: Mission;


  constructor(private http: HttpClient,private cookieService:CookieService) {
    super();
  }

  assignUserToMission(missionId: string, userId: string): Observable<Mission> {
    const data = { missionId, userId };
    return this.http.post<Mission>(`${this.baseUrl}/assign-user`, data);
  }
  getDialogData() {
    return this.dialogData;
  }

  createMission(createMissionDto: CreateMissionDto): Observable<Mission> {
    return this.http.post<Mission>(`${this.baseUrl }/create`, createMissionDto);
  }

  updateDataChange(missions: Mission[]): void {
    this.dataChange.next(missions);
  }

  getDataChange(): Observable<Mission[]> {
    return this.dataChange.asObservable();
  }
  get data(): Mission[] {
    return this.dataChange.value;
  }

  addMission(missions: Mission): void {
    this.dialogData = missions;

  
  }
  deleteMission(missionId: string): Observable<void> {
   const url = `${this.baseUrl}/${missionId}`;
    return this.http.delete<void>(url)
 
}
updateMission(missionId: string, updateMissionDto: CreateMissionDto): Observable<Mission> {
  const url = `${this.baseUrl}/${missionId}`;
  return this.http.put<Mission>(url, updateMissionDto);
}
deleteMultipleMissions(missionIds: (string | undefined)[]): Observable<void> {
  const filteredMissionIds= missionIds.map(id => id?.toString());
  const url = `${this.baseUrl}/delete-multiple`;
  return this.http.delete<void>(url);
}

getAllMissions():  void {
  const clientId = this.getTokenFromCookie();
 

  
  if (!clientId) {
    throw new Error('ID du client introuvable dans le cookie.');
  }

    this.subs.sink = this.http.get<Mission[]>(`${this.baseUrl}/client/${clientId}`).subscribe({
      next: (data:any) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
     
      },
    });
  }
  
  createAndAssignMission(createMissionDto: CreateMissionDto): Observable<Mission> {
    const clientId=  this.getTokenFromCookie();
    const url = `${this.baseUrl}/${clientId}`;
    return this.http.post<Mission>(url, createMissionDto);
  }

getTokenFromCookie(): string | null {
  if (this.cookieService.check('token')) {
    let s =this.cookieService.get('token');
 
    return s;
  } else {
    return null; 
  }
}
}
