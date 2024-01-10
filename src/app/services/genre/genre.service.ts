import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreService {


  private REST_API_SERVER = "http://localhost:3000/api/v1/genre/";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  getAllGenres(): Observable<any> {
    return this.http.get(this.REST_API_SERVER, this.httpOptions);
  }

}
