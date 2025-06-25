import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChatService } from "src/app/services/chat.service";
import { User } from "src/app/services/user";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    numCount = 0;
    constructor(
        private router: Router,
        private _chatService: ChatService,
    ) { }

    ngOnInit(): void {
        this._chatService.getCountAllUnread(User.Current.PersonalId).subscribe((data) => {
            this.numCount = data  || 0;
        });
    }

    ngAfterViewInit(): void {
        const box = document.getElementById('chatboxWrapper');
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        box?.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - box.offsetLeft;
            offsetY = e.clientY - box.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                box!.style.left = `${e.clientX - offsetX}px`;
                box!.style.top = `${e.clientY - offsetY}px`;
                box!.style.right = 'auto'; // ป้องกันการ reset กลับไป right เดิม
                box!.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    openNewCase(link) {
        this.router.navigate([link]);
    }
}
