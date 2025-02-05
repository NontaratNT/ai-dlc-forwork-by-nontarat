import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/re-design/news/news.service';

@Component({
  selector: 'box-frame',
  templateUrl: './box-frame.component.html',
  styleUrls: ['./box-frame.component.scss']
})
export class BoxFrameComponent implements OnInit, AfterViewInit {

  @ViewChild('boxLeft', { static: false }) boxLeft!: ElementRef;

  @ViewChild('boxCenter') boxCenter!: ElementRef;
  @ViewChild('boxRight') boxRight!: ElementRef;

  isVisible = false;

  dataStatic: any;

  index: any;

  constructor(private service: NewsService) { }

  ngOnInit(): void {
    this.service.getStatic().subscribe((res) => {
      this.dataStatic = [res.Value];
    });
  }

  ngAfterViewInit() {
    if (this.boxLeft && this.boxRight && this.boxCenter) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          console.log('Element:', entry.target, 'isIntersecting:', entry.isIntersecting);
          if (entry.isIntersecting) {
            this.isVisible = true;
          } else {
            this.isVisible = false;
          }
        });
      }, { threshold: 0.2 });

      observer.observe(this.boxLeft.nativeElement);
      observer.observe(this.boxCenter.nativeElement);
      observer.observe(this.boxRight.nativeElement);
    } else {
      console.warn('One or more elements are not available yet.');
    }
  }
}