import { Component, OnInit, ViewChild } from '@angular/core';
import { DxMultiViewComponent } from 'devextreme-angular';

@Component({
    selector: 'app-detail-appove',
    templateUrl: './detail-appove.component.html',
    styleUrls: ['./detail-appove.component.scss']
})
export class DetailAppoveComponent implements OnInit {
    @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
    public formType = 'add';

    radioActive: any = [{ id: 1, text: "มีความประสงค์ให้ดำเนินการอายัดบัญชีของคนร้าย ในส่วนที่ข้าพเจ้าได้รับความเสียหาย" },
    { id: 2, text: "ข้าพเจ้ายินยอมให้นำข้อมูลตามที่ข้าพเจ้าให้ไว้นี้ ไปใช้ประโยชน์ในการสืบสวนสอบสวน" },
    { id: 3, text: "ข้าพเจ้าขอยืนยันว่าข้อมูลที่ได้ให้ไว้ในเว็ปไซต์นี้เป็นความจริงทุกประการ โดยถือว่าเป็นการแจ้งความต่อหน้าเจ้าหน้าที่" },
    { id: 4, text: "กรณีความผิดอันยอมความได้ ข้าพเจ้าจะต้องไปพบพนักงานสอบสวนเพื่อร้องทุกข์ภายในกำหนด x๓ เดือน นับแต่รู้เรื่องและรู้ตัวผู้กระทำความผิด" }];
    constructor() { }

    ngOnInit(): void {
    }
    onNext() {
        this.multiView.selectedIndex = 1;
    }
}
