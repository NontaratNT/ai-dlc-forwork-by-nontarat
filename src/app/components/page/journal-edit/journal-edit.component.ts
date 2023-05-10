import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-journal-edit',
    templateUrl: './journal-edit.component.html',
    styleUrls: ['./journal-edit.component.scss']
})
export class JournalEditComponent implements OnInit {
    _editform = false;
    id: number;
    formdata = {
        information: "",
        description: "",
    };

    constructor(private _activatedRoute: ActivatedRoute, private _router: Router) { }

    ngOnInit(): void {
        this.id = this._activatedRoute.snapshot.params.id;
        // console.log(this._activatedRoute.snapshot.params.id);
        // eslint-disable-next-line max-len
        this.formdata.information = "\tข้าพเจ้านางสาวต้องตา วารกิจ อายุ 22 ปี เลขบัตรประจำตัวประชาชน 1234567890123 อยู่บ้านเลขที่ 111 หมู่ 11 ตรอก/ซอย โชคอนันต์ ตำบล/แขวง ท่าตะเภา อำเภอเมือง จังหวัด ชุมพร โทรศัพท์ 0812345678  \n\tแจ้งเหตุเมื่อวันที่ 11 เดือน กุมภาพันธ์ พ.ศ. 2564 เวลา 14.00 น.";
        // eslint-disable-next-line max-len
        this.formdata.description = "\tเมื่อวันที่ 13 เดือน กุมภาพันธ์ พ.ศ. 2564 เวลา 12.00 น. นายยสินทร นงเนียม อยู่บ้านเลาที่ 234 หมู่ 8 ตำบลท่ามะเขือ อำเภอเมือง จังหวัดระนอง ซึ่งเป็นญาติ ได้ขับชื่รถจักรยานยนตร์ ยี่ห้อ ฮอนด้า หมายเลข หะเบียน กย 130 ชุมพร มาตามถนน บ่อพลอย เพื่อไปรับสินคำตามที่ใด้นัดหมาย กับนางวันดี ทองปรือ ที่บริเวณ  ไปรษณีย์บ่อหลอย ปรากฏว่าได้รับสินค้าเป็นกล่องพัสดุเปล่า \n\tพงส. ร.ต.ย. ปกป้อง นิจนิรันตร์ ตำแหน่ง รองสว.(สอบสวน) สถ.บ่อพลอย อ.บ่อพลอย จ.ระนอง ได้รับแจ้งความตามประสงค์ผู้แจ้งไว้แล้ว จึงบันทึกไว้เป็นหลักฐาน";
    }
    onSave() {
        alert('save');
    }
    Back() {
        this._router.navigate(["/main/journal"]);
    }
}
