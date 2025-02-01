import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer-re-design',
  templateUrl: './footer-re-design.component.html',
  styleUrls: ['./footer-re-design.component.scss']
})
export class FooterReDesignComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  openLink(link: string) {
    window.open(link, '_blank');
  }
}
