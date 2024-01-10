import { Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appToggleLogin]'
})
export class ToggleLoginDirective {

  constructor(private el: ElementRef, private router: Router) { }

  @HostListener('click')
  toggleFunc() {
    const space = this.el.nativeElement;
    space.classList.remove('active');
  }
}
