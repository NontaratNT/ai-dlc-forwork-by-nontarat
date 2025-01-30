import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'box-frame-second',
  templateUrl: './box-frame-second.component.html',
  styleUrls: ['./box-frame-second.component.scss']
})
export class BoxFrameSecondComponent implements OnInit, AfterViewInit {

  isVisible: boolean;
  @ViewChild('containerDesktop') containerDesktop!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.containerDesktop.nativeElement);
  }

}
