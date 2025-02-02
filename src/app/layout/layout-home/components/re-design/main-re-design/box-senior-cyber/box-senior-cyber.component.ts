import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }


}
