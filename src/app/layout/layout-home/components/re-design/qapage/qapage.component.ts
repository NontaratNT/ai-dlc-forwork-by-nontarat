import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { FaqService } from "src/app/services/re-design/news/faq/faq.service";
import { ActivatedRoute } from "@angular/router";
@Component({
    selector: "app-qapage",
    templateUrl: "./qapage.component.html",
    styleUrls: ["./qapage.component.scss"],
})
export class QapageComponent implements OnInit {
    deviceInfo = null;
    activeFaq: number | null = null;
    private pendingScrollId: number | null = null;
    constructor(
        private router: Router,
        private deviceService: DeviceDetectorService,
        private faqService: FaqService,
        private activatedRoute: ActivatedRoute
    ) {}
    faq: any[] = [];
    faqmain: any[] = [];
    ngOnInit(): void {
        // ดึงข้อมูล FAQ
        this.faqService.getFaqAll().subscribe((res: any) => {
            if (res && res.IsSuccess && res.Value) {
                this.faq = res.Value.map((item: any) => ({
                    FAQ_ID: item.FAQ_ID,
                    FAQ_QUESTION: item.FAQ_QUESTION,
                    FAQ_ANSWER: item.FAQ_ANSWER,
                    FAQ_SEQ: item.FAQ_SEQ,
                }));
                this.faqmain = [...this.faq];

                this.activatedRoute.queryParams.subscribe((params) => {
                    const faqId = Number(params['id']);
                    if (faqId) {
                        this.pendingScrollId = faqId; // เก็บ ID ที่ต้องเลื่อน
                    }
                });
            } else {
                console.error("Error fetching FAQs:", res);
            }
        });
    }

    scrollTo(faqId: number): void {
        this.activeFaq = faqId;
        const target = document.getElementById(`faq-${faqId}`);
        const offset = 150; // ระยะห่างจาก Header
        if (target) {
            const topPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                offset;
            window.scrollTo({ top: topPosition, behavior: 'smooth' });
        } else {
            console.warn(`Element with ID faq-${faqId} not found.`);
        }
    }

    openLink(link: string) {
        this.router.navigate([link], { queryParams: { icli: "landing" } });
    }

    ToMain() {
        this.router.navigate(["/"]);
    }

    TelLink(href) {
        const downloadLink = document.createElement("a");
        downloadLink.href = href;
        downloadLink.click();
    }

    CheckDeviceMode() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        if (isMobile) {
            this.router.navigate([
                "/mobile/track-status?openExternalBrowser=1",
            ]);
        } else {
            this.router.navigate(["/main/issue-online/1"]);
        }
    }

    OnIssueOnline() {
        console.log("OnIssueOnline");
        // this.popupVisible = true;
        this.CheckDeviceMode();
    }

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    ngAfterViewInit(): void {
        window.addEventListener("scroll", () => {
            const button = document.querySelector(".to-top-btn");
            if (button) {
                if (window.scrollY > 300) {
                    button.classList.add("show");
                } else {
                    button.classList.remove("show");
                }
            }
        });
    }
    ngAfterViewChecked(): void {
        // ตรวจสอบว่า pendingScrollId มีค่าหรือไม่
        if (this.pendingScrollId) {
            this.scrollTo(this.pendingScrollId);
            this.pendingScrollId = null; // รีเซ็ตหลังจากเลื่อนแล้ว
        }
    }

    searchFaqList(event: any): void {
        const searchValue = event.target.value.trim().toLowerCase();
        if (searchValue) {
            this.faq = this.faqmain.filter((faq: any) =>
                faq.FAQ_QUESTION?.toLowerCase().includes(searchValue)
            );
        } else {
            this.faq = [...this.faqmain];
        }
    }
}
