import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'box-senior-cyber',
  templateUrl: './box-senior-cyber.component.html',
  styleUrls: ['./box-senior-cyber.component.scss']
})
export class BoxSeniorCyberComponent implements OnInit {

  slides = [
    {
      id: 1,
      images: 'assets/image/img/senior/bg-senior-white.png'
    },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(!User.Current){
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

  openLinkPage(link: string) {
    this.router.navigate(["/"]);
  }


}
