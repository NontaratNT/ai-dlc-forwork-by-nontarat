import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/re-design/news/news.service';

@Component({
  selector: 'box-frame',
  templateUrl: './box-frame.component.html',
  styleUrls: ['./box-frame.component.scss']
})
export class BoxFrameComponent implements OnInit, AfterViewInit {

  @Input() boxes: any[] = []; // ใช้เพื่อส่งข้อมูลเกี่ยวกับ box ที่จะแสดง

  @ViewChild('boxsLeft') boxsLeft!: ElementRef;
  @ViewChild('boxsCenter') boxsCenter!: ElementRef;
  @ViewChild('boxsRight') boxsRight!: ElementRef;

  isVisible = false;

  dataStatic: any;

  constructor(private service: NewsService) { }

  ngOnInit(): void {
    this.service.getStatic().subscribe((res) => {
      this.dataStatic = res.Value;
      // console.log(this.dataStatic);
    });
  }

  ngAfterViewInit() {
    if (this.boxsLeft && this.boxsRight && this.boxsCenter) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
          } else {
            this.isVisible = false;
          }
        });
      }, { threshold: 0.2 });

      observer.observe(this.boxsLeft.nativeElement);
      observer.observe(this.boxsCenter.nativeElement);
      observer.observe(this.boxsRight.nativeElement);
    } else {
      console.warn('One or more elements are not available yet.');
    }
  }
}