import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private REST_API_SERVER = "http://localhost:3000/api/v1/book/";
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) { }

  // getAllBooks(query: any): Observable<any> {
  //   return this.http.get(this.REST_API_SERVER + '?' + query, this.httpOptions);
  // }

  getBookByGenre(genre: any): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}?genre=${genre}`, this.httpOptions);
  }

  getBookById(bid: any): Observable<any> {
    return this.http.get(`${this.REST_API_SERVER}/${bid}`, this.httpOptions);
  }
}
