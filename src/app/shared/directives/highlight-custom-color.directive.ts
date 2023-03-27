import { Directive, ElementRef, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightCustomColor]'
})
export class HighlightCustomColorDirective implements OnChanges {
  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
    // this.renderer2.setStyle(this.elementRef.nativeElement, 'background-color', '#ffd761');
    this.renderer2.setStyle(this.elementRef.nativeElement, 'border-left', '8px solid #ffd761');
  }

  public ngOnChanges(): void {
  }
}
