import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { time } from 'console';
import { DxFormComponent } from 'devextreme-angular';
import { finalize, switchMap } from 'rxjs/operators';
import { IDistrictInfo } from 'src/app/services/district.service';
import { IProvinceinfo, ProvinceService } from 'src/app/services/province.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'box-senior-cyber',
  templateUrl: './box-senior-cyber.component.html',
  styleUrls: ['./box-senior-cyber.component.scss']
})
export class BoxSeniorCyberComponent implements OnInit {
  @ViewChild("formChannel", { static: false }) formChannel: DxFormComponent;
  @ViewChild("formAddress", { static: false }) formAddress: DxFormComponent;
  pdfUrl: SafeResourceUrl;
  popupVisible = false;
  questionnaireForm = {} as any;
  radioGroupItems: any = [];
  _isLoading = false;
  indexTab = 0;
  province: IProvinceinfo[];
  district: IDistrictInfo[];
  disableDistrict = true;

  @Input() types: 'senior' | 'seniorPages' = 'senior';

  slides = [
    {
      id: 1,
      images: 'assets/image/img/senior/bg-senior-white.png'
    },
  ];

  scheduleZoom = [
    {
      date: "5",
      month: "กุมภาพันธ์",
      time: "9:30 น.",
      title: "รู้ทันมิจฉาชีพออนไลน์ ภัยร้ายหลายรูปแบบใกล้ตัวสูงวัยกว่าที่คิด",
    },
    {
      date: "7",
      month: "กุมภาพันธ์",
      time: "14:00 น.",
      title: "การป้องกันและคุ้มครองสิทธิ์ผู้สูงอายุด้านทรัพย์สิน",
    },
    {
      date: "8",
      month: "กุมภาพันธ์",
      time: "12:30 น.",
      title: "ปัจจัยที่มีผลต่อการตกเป็นเหยื่ออาชญากรรมที่เกิดขึ้นกับผู้สูงอายุ",
    },
  ];

  scheduleYoutube = [
    {
      date: "5",
      month: "กุมภาพันธ์",
      time: "9:30 น.",
      title: "รู้ทันมิจฉาชีพออนไลน์ ภัยร้ายหลายรูปแบบใกล้ตัวสูงวัยกว่าที่คิด",
    },
    {
      date: "7",
      month: "กุมภาพันธ์",
      time: "14:00 น.",
      title: "การป้องกันและคุ้มครองสิทธิ์ผู้สูงอายุด้านทรัพย์สิน",
    },
    {
      date: "8",
      month: "กุมภาพันธ์",
      time: "12:30 น.",
      title: "ปัจจัยที่มีผลต่อการตกเป็นเหยื่ออาชญากรรมที่เกิดขึ้นกับผู้สูงอายุ",
    },
  ];



  constructor(private router: Router,
    private userServ: UserService,
    private sanitizer: DomSanitizer,
    private serviceProvince: ProvinceService,
  ) {
    const pdfPath = '/assets/image/what.pdf'; // ระบุไฟล์ PDF
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
  }

  ngOnInit(): void {
    this.userServ.getListQuestion()
      .subscribe(_ => {
        this.radioGroupItems = _ ?? [];
      });
    this.serviceProvince.GetProvince().subscribe(_ => this.province = _);
    if (!User.Current && window.location.pathname === "/senior-cyber-police") {
      this.router.navigate(["/"]);
    }
    if (User.Current.Age < 60 && window.location.pathname === "/senior-cyber-police") {
      Swal.fire({
        title: "ขออภัย!",
        text: "อายุของท่านยังไม่ถึงเกณฑ์ที่กำหนด",
        icon: "warning",
        confirmButtonText: "ตกลง",
      }).then((_) => {
        if (_.isConfirmed) {
          this.router.navigate(["/"]);
        }
      });
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  linktoZoom(link: string) {
    this.userServ.loginZoom(User.Current.PersonalId)
      .pipe(finalize(() => window.open(link, '_blank')))
      .subscribe(_ => { });
  }

  clickZoom() {
    if (!this.formChannel.instance.validate().isValid) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'กรุณาเลือกช่องทาง',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this._isLoading = true; // Set loading only after validation passes

    this.userServ.SaveQuestion(this.questionnaireForm).pipe(
      switchMap(() => this.userServ.UpdateSeniorFlag(User.Current.UserId)),
      switchMap(() => this.userServ.UpdateSeniorFlagAzure(User.Current.UserId))
    ).subscribe({
      next: () => {
        this._isLoading = false;
        User.Current.SeniorStatus = "Y";
        this.router.navigate(["/senior-cyber-police"]);
      },
      error: () => {
        this._isLoading = false;
        this.router.navigate(["/senior-cyber-police"]);
      }
    });
  }

  nextPage() {
    if (!this.formChannel.instance.validate().isValid) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'กรุณาเลือกช่องทาง',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }
    this.indexTab = 1;
  }
  back() {
    this.indexTab === 1 ? this.indexTab = 0 : this.popupVisible = false;
  }



  clickPopup() {
    if (!User?.Current) {
      this.router.navigate(['/login'], { queryParams: { icli: 'landing' } });
    } else {
      if (User.Current.Age >= 60) {
        this.questionnaireForm = {} as any;
        if (User.Current.SeniorStatus === "Y") {
          this.router.navigate(["/senior-cyber-police"]);
        } else {
          Swal.fire({
            title: "แจ้งเตือน!",
            text: "ท่านต้องการเข้าร่วม Senior Cyber Club ใช่หรือไม่",
            icon: "warning",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            showCancelButton: true,
          }).then((_) => {
            if (_.isConfirmed) {
              this.popupVisible = true;
            } else {
              this.router.navigate(["/"]);
            }
          });
        }
      } else {
        Swal.fire({
          title: "ขออภัย!",
          text: "อายุของท่านยังไม่ถึงเกณฑ์ที่กำหนด",
          icon: "warning",
          confirmButtonText: "ตกลง",
        })
      }
    }
  }

  OnSelectProvice(e) {
    this.district = [];

    if (e.value) {
      this.disableDistrict = false;
      this.serviceProvince.GetDistrictofProvince(e.value).subscribe(_ => this.district = _);
    }

  }

  closePopup() {
    this.popupVisible = false;
  }

  openLinkPage(link: string) {
    this.router.navigate(["/"]);
  }

  openLinkYouTube() {
    window.open("https://www.youtube.com/channel/UC8P6PJszHnKbvd1vjbt0Y2Q", "_blank");
  }



  ChangeRadioChannel(e: any) {
    this.questionnaireForm.SENIOR_CHANNEL_ID = e.value;
    if (e.value !== 6) {
      this.questionnaireForm.OTHER_TEXT = null;
    }
  }


  navigateBack() {
    this.router.navigate(['/']);
  }

}
