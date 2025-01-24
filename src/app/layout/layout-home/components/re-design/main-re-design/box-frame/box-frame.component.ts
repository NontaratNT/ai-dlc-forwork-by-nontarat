import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-box-frame',
  templateUrl: './box-frame.component.html',
  styleUrls: ['./box-frame.component.scss']
})
export class BoxFrameComponent implements OnInit {

  @Input() boxes: any[] = []; // ใช้เพื่อส่งข้อมูลเกี่ยวกับ box ที่จะแสดง

  constructor() { }

  ngOnInit(): void {
  }

}
