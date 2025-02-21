import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'box-senior-cyber',
  templateUrl: './box-senior-cyber.component.html',
  styleUrls: ['./box-senior-cyber.component.scss']
})
export class BoxSeniorCyberComponent implements OnInit {

  pdfUrl: SafeResourceUrl;
  popupVisible = false;
  questionnaireForm = {} as any;
  radioGroupItems : any = [];

  @Input() types: 'senior' | 'seniorPages' = 'senior';

  slides = [
    {
      id: 1,
      images: 'assets/image/img/senior/bg-senior-white.png'
    },
  ];

  constructor(private router: Router,
    private userServ: UserService,
    private sanitizer: DomSanitizer,
  ) {
    const pdfPath = '/assets/image/what.pdf'; // ระบุไฟล์ PDF
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
  }

  ngOnInit(): void {
    this.userServ.getListQuestion()
      .subscribe(_ => { 
        this.radioGroupItems = _ ?? [];
      });
    if (!User.Current) {
      this.router.navigate(["/"]);
    }
    if (User.Current.Age < 60) {
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
    localStorage.setItem('questionnaireForm', JSON.stringify(this.questionnaireForm));
    this.router.navigate(['/login'], { queryParams: { icli: 'landing' } });
  }

  clickPopup() {
    this.questionnaireForm = {} as any;
    this.popupVisible = true;
  }

  closePopup() {
    //delete localStorage name 'questionnaireForm'
    localStorage.removeItem('questionnaireForm');
    this.popupVisible = false;
  }

  openLinkPage(link: string) {
    this.router.navigate(["/"]);
  }

  ChangeRadioChannel(e: any) {
    this.questionnaireForm.SENIOR_CHANNEL_ID = e.value;
    if (e.value !== 6) {
      this.questionnaireForm.OTHER_TEXT = null;
    }
  }


}
