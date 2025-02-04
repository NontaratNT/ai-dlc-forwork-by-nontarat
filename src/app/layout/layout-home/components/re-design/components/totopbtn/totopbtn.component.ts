import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-totopbtn',
  templateUrl: './totopbtn.component.html',
  styleUrls: ['./totopbtn.component.scss']
})
export class TotopbtnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
ngAfterViewInit(): void {
    window.addEventListener("scroll", () => {
        const button = document.querySelector(".to-top-btn");
        if (button) {
            if (window.scrollY > 150) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }
        }
    });
}

}
