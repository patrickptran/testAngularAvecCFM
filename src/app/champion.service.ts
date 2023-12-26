import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Champion } from './champion';

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  private apiUrl = 'api/champions';

  constructor(private http: HttpClient) {}

  getChampions(): Observable<Champion[]> {
    return this.http.get<Champion[]>(this.apiUrl);
  }

  deleteChampion(champion: Champion): Observable<void> {
    const deleteUrl = `${this.apiUrl}/${champion.id}`; // Adjust the URL based on your API
    return this.http.delete<void>(deleteUrl);
  }
}
