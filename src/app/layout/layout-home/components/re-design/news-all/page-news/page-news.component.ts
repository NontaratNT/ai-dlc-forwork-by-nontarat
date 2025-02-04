import { Component, OnInit } from "@angular/core";
import { NewsService } from "src/app/services/re-design/news/news.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-page-news",
    templateUrl: "./page-news.component.html",
    styleUrls: ["./page-news.component.scss"],
})
export class PageNewsComponent implements OnInit {
    newsData: any[] = [];
    news1: any[] = [];
    news2: any[] = [];
    news3: any[] = [];

    constructor(private service: NewsService, private router: Router) {}

    ngOnInit(): void {
        this.service.getNewsAll().subscribe((res) => {
            this.newsData = res.Value.Data;
            // console.log(this.newsData);
        });
    }

    activeTab: any = "all"; // ค่าเริ่มต้นของแท็บที่เลือก

    // formationNews = [
    //   {
    //     category: "ข่าวประชาสัมพันธ์",
    //     title: "ถูกแฮกข้อมูลส่วนตัว ภัยเงียบที่เติบโตในปี 2024",
    //     des: "การโจมตีไซเบอร์ที่ใหญ่ที่สุดในไทยส่งผลให้ข้อมูลผู้ใช้งานกว่า 5 ล้านคนรั่วไหล",
    //     date: "มกราคม 2567",
    //     image: "assets/image/news/news1.png",
    //   },
    //   {
    //     category: "เตือนภัยไซเบอร์",
    //     title: "ระบาดหนักอีเมลหลอกลวงพุ่งสูงสุดในรอบปี",
    //     des: "การแพร่ระบาดของอีเมลปลอมในชื่อธนาคารดัง หลอกขโมยเงินจากบัญชีผู้ใช้ไปกว่า 100 ล้านบาท",
    //     date: "พฤษภาคม 2567",
    //     image: "assets/image/news/news2.png",
    //   },
    //   {
    //     category: "กลโกงออนไลน์",
    //     title: "ผู้เสียหายจากกลโกงช้อปปิ้งพุ่งสูงในปี 2024",
    //     des: "เหตุการณ์มิจฉาชีพหลอกขายสินค้าออนไลน์กว่า 50,000 รายการ โดยไม่มีสินค้าส่งจริง",
    //     date: "ตุลาคม 2567",
    //     image: "assets/image/news/news3.png",
    //   },
    //   {
    //     category: "เตือนภัยไซเบอร์",
    //     title: "เตือนภัย! อีเมลปลอมแอบอ้างหน่วยงานรัฐ",
    //     des: "รายงานพบการระบาดของอีเมลปลอมที่แอบอ้างเป็นหน่วยงานรัฐ เพื่อหลอกให้ประชาชนกรอกข้อมูลส่วนตัว เช่น...",
    //     date: "มกราคม 2567",
    //     image: "assets/image/news/news4.png",
    //   },
    //   {
    //     category: "กลโกงออนไลน์",
    //     title: "ระวัง! มิจฉาชีพใช้ QR Code ปลอมดูดเงินในบัญชี",
    //     des: "ธนาคารและหน่วยงานด้านความปลอดภัยเตือนภัยการใช้ QR Code ปลอมที่มิจฉาชีพนำไปติดตามสถานที่ต่างๆ...",
    //     date: "พฤษภาคม 2567",
    //     image: "assets/image/news/news5.png",
    //   },
    //   {
    //     category: "ข่าวประชาสัมพันธ์",
    //     title: "เพิ่มความปลอดภัย! หน่วยงานรัฐแนะประชาชนใช้...",
    //     des: "หน่วยงานความปลอดภัยทางไซเบอร์ได้แนะนำให้ประชาชน ใช้ระบบยืนยันตัวตนแบบสองชั้นในการเข้าถึงบัญชี",
    //     date: "ตุลาคม 2567",
    //     image: "assets/image/news/news6.png",
    //   },
    // ];
    // ฟังก์ชันสำหรับเปลี่ยนแท็บ
    selectTab(tab: any) {
        this.activeTab = tab;

        // console.log(this.activeTab == "all");
        if (this.activeTab === "all") {
            this.service.getNewsAll().subscribe((res) => {
                this.newsData = res.Value.Data;
            });
        } else if (this.activeTab === 1) {
            this.service.getNewsByType(1).subscribe((res) => {
                this.news1 = res.Value.Data;
            });
        } else if (this.activeTab === 2) {
            this.service.getNewsByType(2).subscribe((res) => {
                this.news2 = res.Value.Data;
            });
        } else if (this.activeTab === 3) {
            this.service.getNewsByType(3).subscribe((res) => {
                this.news3 = res.Value.Data;
            });
        }
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

    ToMain() {
        this.router.navigate(["/"]);
    }

    navigateToDetail(newsId: number): void {
        this.router.navigate([`news/detail/${newsId}`]); 
    }
}
