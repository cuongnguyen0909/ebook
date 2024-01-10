import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating!: number;

  get stars(): string[] {
    const roundedRating = Math.round(this.rating);
    const stars = new Array(5).fill('empty');

    for (let i = 0; i < roundedRating; i++) {
      stars[i] = 'full';
    }

    return stars;
  }
}
