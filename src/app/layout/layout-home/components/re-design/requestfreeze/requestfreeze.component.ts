import { Component, OnInit } from "@angular/core";
import { NewsService } from "src/app/services/re-design/news/news.service";
@Component({
    selector: "app-requestfreeze",
    templateUrl: "./requestfreeze.component.html",
    styleUrls: ["./requestfreeze.component.scss"],
})
export class RequestfreezeComponent implements OnInit {
    constructor(private service: NewsService) { }

    paginatedBanks: any[] = [];
    currentPage = 0;
    itemsPerPage = 8;
    bankContacts: any[] = [];
    orderBy = false;
    bankContactsMain: any[] = [];

    ngOnInit(): void {
        this.service.getBankList().subscribe((res: any) => {
            this.bankContacts = res.Value;
            this.bankContactsMain = res.Value;
            this.setupPagination();
        });
        this.setupPagination();
    }

    setupPagination(): void {
        // จำกัดจำนวน itemsPerPage สูงสุดที่ 8
        this.itemsPerPage = Math.min(8, this.bankContacts.length);

        console.log("Items Per Page:", this.itemsPerPage);
        console.log("Total Items:", this.bankContacts.length);

        this.paginatedBanks = [];
        for (let i = 0; i < this.bankContacts.length; i += this.itemsPerPage) {
            this.paginatedBanks.push(this.bankContacts.slice(i, i + this.itemsPerPage));
        }

        console.log("Total Pages:", this.paginatedBanks.length);
    }


    // ปรับให้ใช้งานได้กับ next และ prev
    nextPage(): void {
        if (this.currentPage < this.paginatedBanks.length - 1) {
            this.animatePageChange(() => {
                this.currentPage++;
            }, "next");
        }
    }

    prevPage(): void {
        if (this.currentPage > 0) {
            this.animatePageChange(() => {
                this.currentPage--;
            }, "prev");
        }
    }

    navigateToPage(pageIndex: number): void {
        if (
            pageIndex >= 0 &&
            pageIndex < this.paginatedBanks.length &&
            pageIndex !== this.currentPage
        ) {
            const direction = pageIndex > this.currentPage ? "next" : "prev";

            this.animatePageChange(() => {
                this.currentPage = pageIndex;
            }, direction);
        }
    }

    animatePageChange(callback: () => void, direction: "next" | "prev"): void {
        const bankList = document.querySelector(".bank-list");
        if (bankList) {
            // กำหนด class ให้ตรงกับทิศทาง
            const outClass =
                direction === "next" ? "slide-out-left" : "slide-out-right";
            const inClass =
                direction === "next" ? "slide-in-right" : "slide-in-left";

            // เพิ่ม animation ออกจากหน้าปัจจุบัน
            bankList.classList.add(outClass);

            setTimeout(() => {
                callback(); // เปลี่ยนหน้า

                bankList.classList.remove(outClass);
                bankList.classList.add(inClass);

                setTimeout(() => {
                    bankList.classList.remove(inClass);
                }, 800); // รอ animation จบ
            }, 800);
        }
    }

    sortBanksList(): void {
        this.orderBy = !this.orderBy;
        if (this.orderBy) {
            this.bankContacts.sort((a, b) => b.ContactSeq - a.ContactSeq);
        } else {
            this.bankContacts.sort((a, b) => a.ContactSeq - b.ContactSeq);
        }
        this.setupPagination();
    }

    searchBanksList(event: any): void {
        const searchValue = event.target.value;
        if (searchValue) {
            this.bankContacts = this.bankContactsMain.filter((bank: any) =>
                bank.ContactBankName.includes(searchValue)
            );
            this.setupPagination();
        } else {
            this.bankContacts = this.bankContactsMain;
            this.setupPagination();
        }
    }
}
