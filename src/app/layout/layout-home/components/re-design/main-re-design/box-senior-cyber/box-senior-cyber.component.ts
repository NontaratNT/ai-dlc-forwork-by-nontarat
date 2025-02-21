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
    this.router.navigate(['/login'], { queryParams: { icli: 'landing' } });
  }

  openLinkPage(link: string) {
    this.router.navigate(["/"]);
  }


}
