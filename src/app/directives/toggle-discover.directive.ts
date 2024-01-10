import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleDiscover]',
})
export class ToggleDiscoverDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click')
  toggleFunc() {
    let elm = this.el.nativeElement;
    elm.classList.toggle('active');

    let img = this.el.nativeElement.children[0].children[0];
    if (elm.classList.contains('active')) {
      img.className = 'fa-solid fa-caret-up';
    } else {
      img.className = 'fa-solid fa-caret-down';
    }
  }
}
