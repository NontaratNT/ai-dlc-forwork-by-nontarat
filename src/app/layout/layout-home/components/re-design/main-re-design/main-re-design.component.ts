import { AfterViewInit, Component, OnInit } from '@angular/core';

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
      id: 1,
      images: 'assets/icon/bg/pages-1.png'
    },
    {
      id: 2,
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


  boxes = [
    {
      header: 'สถิติความเสียหายสะสม : 1 มี.ค. 2565 - 30 พ.ย. 2567',
      textCaseOnline: 'คดีออนไลน์',
      countCaseOnline: '739,494',
      unitCaseOnline: 'เรื่อง',
      textCaseOnline2: 'มูลค่าความเสียหายรวม',
      countCaseOnline2: '7 หมื่นล้าน',
      unitCaseOnline2: 'บาท',
      reportOnline: 'แจ้งความออนไลน์',
      reportOnlineCount: '353,536',
      reportOnlineSubject: 'เรื่อง',
      reportToThePoliceAgency: 'แจ้งความที่หน่วยงาน',
      reportToThePoliceAgencyCount: '157,292',
      reportToThePoliceAgencySubject: 'เรื่อง',
      averageCase: 'เฉลี่ยคดี',
      averageCaseCount: '736',
      averageCaseSubjectToday: 'เรื่องต่อวัน',
      freezeTheAccountImmediately: 'อายัดบัญชีได้ทัน',
      freezeTheAccountImmediatelyCount: '1.55%',
      freezeTheAccountImmediatelyValue: 'มูลค่า : 8,627,715,890 ล้านบาท',
      freezeTheAccountImmediatelyFrom: 'จาก : 44,904,971,828 ล้านบาท',
      mostCommonOnlineCases: '5 คดีออนไลน์ที่พบมากที่สุด',
      mostCases: [
        {
          case: '1.หลอกหลวงซื้อขายสินค้า',
          count: '48.89%'
        },
        {
          case: '2.หลอกให้โอนเพื่อทำงาน',
          count: '12.81%'
        },
        {
          case: '3.หลอกให้กู้เงิน',
          count: '9.74%'
        },
        {
          case: '4.หลอกให้ลงทุน',
          count: '6.79%'
        },
        {
          case: '5.ข่มขู่ (Call center)',
          count: '6.69%'
        }
      ]
    },
  ];
}
