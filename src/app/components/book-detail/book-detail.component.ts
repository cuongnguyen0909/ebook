import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent {
  value: number = 0; //addition of .5
  id!: any;
  book!: any;
  starList: string[] = [];
  previousValueStar: number = 0;
  currentRating!: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService) { }
  redirectToReading() {
    this.router.navigate(['/reading-book']);
  }

  ngOnInit() {
    // this.setStyleStar();
    this.id = this.route.snapshot.paramMap.get('bid');
    this.bookService.getBookById(this.id).subscribe((res) => {
      // Xử lý dữ liệu sách nhận được từ API ở đây
      this.book = res.book;
      this.value = this.book.totalRating || 0;
      this.starList = this.renderStar(this.value);
      console.log(this.value)
    })
    // console.log(this.book)
    // console.log(this.value)
  }

  renderStar(number: any) {
    const starList = [];
    number = Math.round(number);
    if (+number === 0) {
      for (let i = 0; i < 5; i++) {
        starList.push('fa-regular fa-star');
      }
    }
    for (let i = 0; i < +number; i++) {
      starList.push('fas fa-star');
    }
    for (let i = 5; i > +number; i--) {
      starList.push('fa-regular fa-star');
    }
    return starList;
  }


  // thực hiện chức năng comment
  sendComment() {
    console.log(this.currentRating);

  }
}
