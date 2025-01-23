import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-re-design',
  templateUrl: './main-re-design.component.html',
  styleUrls: ['./main-re-design.component.scss']
})
export class MainReDesignComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  slides = [
    {
      images: 'assets/icon/bg/pages-1.png'
    },
    {
      images: 'assets/icon/bg/pages-2.png'
    },
    // เพิ่ม slide อื่น ๆ ได้ที่นี่
  ];

  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

}
