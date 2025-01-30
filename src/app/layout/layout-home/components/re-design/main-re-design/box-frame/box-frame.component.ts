import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

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

    observer.observe(this.boxsLeft.nativeElement && this.boxsRight.nativeElement && this.boxsCenter.nativeElement);
  }

}