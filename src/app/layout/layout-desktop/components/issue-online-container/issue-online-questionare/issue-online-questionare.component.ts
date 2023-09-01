import { Component, OnInit, ViewChild } from '@angular/core';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DxFormComponent } from 'devextreme-angular';
import { PersonalService } from 'src/app/services/personal.service';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import { OnlineCaseService } from 'src/app/services/online-case.service';

@Component({
  selector: 'app-issue-online-questionare',
  templateUrl: './issue-online-questionare.component.html',
  styleUrls: ['./issue-online-questionare.component.scss']
})
export class IssueOnlineQuestionareComponent implements OnInit {
    @ViewChild('formblessing', { static: false }) formblessing: DxFormComponent;
    public mainConponent: IssueOnlineContainerComponent;
    formData: any = {};
    group1_1 = [
        { id: "1.1", txt: "ซื้อของใน social (เช่น facebook twitter) โอนเงินแล้วบล๊อกเลย" },
        { id: "1.2", txt: "ซื้อของใน platform  (lazada,shopee) แต่ ส่งให้ไปจ่ายเงินช่องทางอื่นๆ" },
        { id: "1.3", txt: "ซื้อแล้ว หลายวันยังไม่ส่ง ยังติดต่อได้บ่ายเบี่ยง ผลัดวันประกันพรุ่ง" },
    ];
    group1_2 = [
        { id: "1.4", txt: "ซื้อแล้วส่งสินค้าอย่างอื่น (ซื้อโทรศัพท์ ส่ง สบู่)" },
        { id: "1.5", txt: "ซื้อของแล้วส่งสินค้าไม่ตรงสเปค (ซื้อ tv 55 นิ้ว ส่ง 50 นิ้ว)" },
        { id: "1.6", txt: "เคยซื้อสินค้ากันมาก่อนแล้ว และเคยได้สินค้า" },
    ];
    group2 = [
        { id: "2.1", txt: "กู้เงิน ได้เงิน เรียกเก็บดอกเบี้ยเกินอัตรา" },
        { id: "2.2", txt: "เป็นผู้ถูกรบกวนถูกแก๊งค์ปล่อยเงินกู้ โดยคนร้ายโทรมาทวงเงิน โดยที่ไม่ได้เกี่ยวข้อง" },
        { id: "2.3", txt: "กู้เงิน ไม่ได้เงิน หลอกให้โอนค่าธรรมเนียมเพิ่มขึ้นเรื่อยๆ" },
    ];
    group3 = [
        { id: "3.1", txt: "ทำกิจกรรมต่างๆ หรืออ้างว่าซื้อขายสินค้า แล้วได้เงินรางวัลเพิ่มขึ้นเรื่อยๆ แต่ไม่มีการรับส่งสินค้าจริงๆ" },
        { id: "3.2", txt: "แชร์ลูกโซ่ หรือชักชวนลงทุนใน แชร์ทองบ้านออมทอง หรือแชร์รูปแบบต่างๆ" },
    ];
    group4 = [
        { id: "4.1", txt: "ถามว่าจำได้ไหมฉันเป็นใครแล้วให้ผู้เสียหายบันทึกเบอร์" },
        { id: "4.2", txt: "ปลอมเป็นคนอื่น แล้วหลอกยืมเงิน" },
        { id: "4.3", txt: "ปลอมเป็นคนอื่น แล้วหลอกให้โอนค่าสินค้า" },
    ];
    group5 = [
        { id: "5.1", txt: "อ้างเป็นหน่วยงานรัฐ  เช่น สรรพากร ตำรวจ ดีเอสไอ ปปง." },
        { id: "5.2", txt: "อ้างเป็นหน่วยงานเอกชน เช่น ขนส่ง หรือพัสดุตกค้าง" },
        { id: "5.3", txt: "ข่มขู่ และหรือหลอกลวงว่าจะช่วยเหลือ  และให้โอนเงินไปให้" },
    ];
    group6 = [
        { id: "6.1", txt: "ให้กรอกข้อมูลผ่านเว็บไซต์ หรือ แอปพลิเคชั่น" },
        { id: "6.2", txt: "หลอกให้ติดตั้ง แอปรีโมทเข้าโทรศัพท์มือถือ หรือลงโปรแกรมควบคุมคอมพิวเตอร์" },
        { id: "6.3", txt: "คนร้ายเข้าควบคุมอุปกรณ์แล้วถ่ายโอนทรัพย์สินผู้เสียหายออกไป" },
    ];
    group7 = [
        { id: "7.1", txt: "ใช้โปรไฟล์หล่อหรูดูไฮโซทำความรู้จัก" },
        { id: "7.2", txt: "จีบให้หลงรัก" },
        { id: "7.3", txt: "เชิญชวนให้ลงทุน เช่น หุ้น forex, crypto โดยให้ลงแอปพลิเคชั่น" },
        { id: "7.4", txt: "ให้โอนเงินเพื่อวัตถุประสงค์บางอย่าง" },
    ];
    group8 = [
        { id: "8.1", txt: "เป็นบุคคล ถูกนำ profile ไปใช้ไปใช้ในทางที่ทำให้เสียหาย" },
        { id: "8.2", txt: "เป็น นิติบุคคล ถูกนำ profile ไปใช้ในทางที่ทำให้เสียหาย" },
        { id: "8.3", txt: "มีการ sex video call โชว์ภาพโป๊เปลือย แล้วเรียกค่าไถ่" },
    ];
    group9 = [
        { id: "9.1", txt: "ถูกแฮ๊ค facebook หรือ account สื่อโซเชียลต่างๆ แล้วนำไปทำที่ทำให้เกิดความเสียหาย" },
        { id: "9.2", txt: "ถูกแฮ๊คระบบอีเมล แล้วแจ้งเปลี่ยนช่องทางการเงินโอนซื้อขายสินค้าจนทำให้เราผู้โอนไปผิด (business email compromize)" },
        { id: "9.3", txt: "ถูกฝัง ransomware spyware เพื่อเรียกค่าไถ่ระบบ" },
    ];
    value : any;
    formQuestionare: any  = {};
    isLoading = false;
    personalInfo: any = {};
    formReadOnly = false;
    checkBlessing = false;
    formType = 'add';

    constructor(private servicePersonal: PersonalService,private _OnlineCaseService: OnlineCaseService,) { }

    ngOnInit(): void {
        const userId = User.Current.PersonalId;
        this.isLoading = true;
        // this.servicePersonal.GetPersonalById(userId)
        //     .subscribe((_) => {
        //         this.personalInfo = _;
        //         this.setDefaultData();
        //     });
        setTimeout(async () => {
                this.setDefaultData();
        }, 100);
    }

    async setDefaultData(){
        this.checkBlessing = this.mainConponent.formDataInsert.CHECK_BLESSING;
        if (this.mainConponent.formType === 'add') {
            this.formData.CASE_QUESTIONARE = []
            this.formQuestionare.QUESTIONARE_4_1 = false;
            this.formQuestionare.QUESTIONARE_4_2 = false;
            this.formQuestionare.QUESTIONARE_4_3 = false;
            this.formQuestionare.QUESTIONARE_6_1 = false;
            this.formQuestionare.QUESTIONARE_6_2 = false;
            this.formQuestionare.QUESTIONARE_6_3 = false;
            this.formQuestionare.QUESTIONARE_7_1 = false;
            this.formQuestionare.QUESTIONARE_7_2 = false;
            this.formQuestionare.QUESTIONARE_7_3 = false;
            this.formQuestionare.QUESTIONARE_7_4 = false;
            this.formQuestionare.QUESTIONARE_8_1 = false;
            this.formQuestionare.QUESTIONARE_8_2 = false;
            this.formQuestionare.QUESTIONARE_8_3 = false;
            this.formQuestionare.QUESTIONARE_9_1 = false;
            this.formQuestionare.QUESTIONARE_9_2 = false;
            this.formQuestionare.QUESTIONARE_9_3 = false;
        }else{
            this.formReadOnly = true;
            this.formType = 'edit';
            const _case_id = Number(sessionStorage.getItem("case_id"));
            const _CASE_QUESTIONARE = await this._OnlineCaseService.GetcaseQuestionare(_case_id).toPromise();
            this.formQuestionare = _CASE_QUESTIONARE[0] ?? null;
            if(this.formQuestionare == null){
                this.formQuestionare.QUESTIONARE_4_1 = false;
                this.formQuestionare.QUESTIONARE_4_2 = false;
                this.formQuestionare.QUESTIONARE_4_3 = false;
                this.formQuestionare.QUESTIONARE_6_1 = false;
                this.formQuestionare.QUESTIONARE_6_2 = false;
                this.formQuestionare.QUESTIONARE_6_3 = false;
                this.formQuestionare.QUESTIONARE_7_1 = false;
                this.formQuestionare.QUESTIONARE_7_2 = false;
                this.formQuestionare.QUESTIONARE_7_3 = false;
                this.formQuestionare.QUESTIONARE_7_4 = false;
                this.formQuestionare.QUESTIONARE_8_1 = false;
                this.formQuestionare.QUESTIONARE_8_2 = false;
                this.formQuestionare.QUESTIONARE_8_3 = false;
                this.formQuestionare.QUESTIONARE_9_1 = false;
                this.formQuestionare.QUESTIONARE_9_2 = false;
                this.formQuestionare.QUESTIONARE_9_3 = false;
            }
        }
    }

    Back(e) {
    this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
    }
    SubmitForm(e) {
        const validate = this.validateQuestionare();
        if(validate == false){
            this.mainConponent.checkValidate = false;
            if(this.formData.CASE_QUESTIONARE.length == 0){
                this.formData.CASE_QUESTIONARE.push(this.formQuestionare);
            }else{
                this.formData.CASE_QUESTIONARE[0] = this.formQuestionare;
            }
            const formData = Object.assign({},this.formData);
            this.mainConponent.formDataAll.formQuestionnare = formData;
            if(e != 'tab'){
                this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
            }
        }
    }
    validateQuestionare(){
        if(this.checkBlessing == false){
            return false;
        }
        const validateMutiple = [this.formQuestionare.QUESTIONARE_4_1,
            this.formQuestionare.QUESTIONARE_4_2,
            this.formQuestionare.QUESTIONARE_4_3,
            this.formQuestionare.QUESTIONARE_6_1,
            this.formQuestionare.QUESTIONARE_6_2,
            this.formQuestionare.QUESTIONARE_6_3,
            this.formQuestionare.QUESTIONARE_7_1,
            this.formQuestionare.QUESTIONARE_7_2,
            this.formQuestionare.QUESTIONARE_7_3,
            this.formQuestionare.QUESTIONARE_7_4,
            this.formQuestionare.QUESTIONARE_8_1,
            this.formQuestionare.QUESTIONARE_8_2,
            this.formQuestionare.QUESTIONARE_8_3,
            this.formQuestionare.QUESTIONARE_9_1,
            this.formQuestionare.QUESTIONARE_9_2,
            this.formQuestionare.QUESTIONARE_9_3].some((value) => value === true) ? false :true;
        const validatesingle = this.formQuestionare.QUESTIONARE_1 != null || this.formQuestionare.QUESTIONARE_2 != null || this.formQuestionare.QUESTIONARE_3 != null || this.formQuestionare.QUESTIONARE_5 != null ? false : true;
        if(validateMutiple == true && validatesingle == true){
            Swal.fire({
                title: "ผิดพลาด!",
                html: "กรุณาเลือกที่เกี่ยวข้องกับการกระทำความผิด<br>อย่างน้อย 1 ข้อ",
                icon: "warning",
                confirmButtonText: "Ok",
            }).then(() => {});
            this.mainConponent.checkValidate = true;
            return true;
        }
        return false;
    }

    clear(){
        this.formQuestionare.QUESTIONARE_1 = null;
        this.formQuestionare.QUESTIONARE_2 = null;
        this.formQuestionare.QUESTIONARE_3 = null;
        this.formQuestionare.QUESTIONARE_5 = null;
        this.formQuestionare.QUESTIONARE_4_1 = false;
        this.formQuestionare.QUESTIONARE_4_2 = false;
        this.formQuestionare.QUESTIONARE_4_3 = false;
        this.formQuestionare.QUESTIONARE_6_1 = false;
        this.formQuestionare.QUESTIONARE_6_2 = false;
        this.formQuestionare.QUESTIONARE_6_3 = false;
        this.formQuestionare.QUESTIONARE_7_1 = false;
        this.formQuestionare.QUESTIONARE_7_2 = false;
        this.formQuestionare.QUESTIONARE_7_3 = false;
        this.formQuestionare.QUESTIONARE_7_4 = false;
        this.formQuestionare.QUESTIONARE_8_1 = false;
        this.formQuestionare.QUESTIONARE_8_2 = false;
        this.formQuestionare.QUESTIONARE_8_3 = false;
        this.formQuestionare.QUESTIONARE_9_1 = false;
        this.formQuestionare.QUESTIONARE_9_2 = false;
        this.formQuestionare.QUESTIONARE_9_3 = false;
    }

}
