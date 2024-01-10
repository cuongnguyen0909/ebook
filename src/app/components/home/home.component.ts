import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenreService } from 'src/app/services/genre/genre.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  listGenres!: any;

  constructor(
    private router: Router,
    private genreService: GenreService
  ) {
    this.genreService.getAllGenres().subscribe((res) => {
      if (res.status) {
        this.listGenres = res.data;

        console.log(this.listGenres)
      }
    }
    );
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getBookByGenre(genre: string) {
    this.router.navigate(
      ['/books-by-genres'],
      { queryParams: { genre: genre } }
    )
  }

}
