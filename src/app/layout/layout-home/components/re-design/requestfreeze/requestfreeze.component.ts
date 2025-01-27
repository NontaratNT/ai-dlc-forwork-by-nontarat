import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-requestfreeze',
  templateUrl: './requestfreeze.component.html',
  styleUrls: ['./requestfreeze.component.scss']
})
export class RequestfreezeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.setupPagination();
  }
  bankContacts = [
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    { name: 'กสิกรไทย', phone: '0-2888-8888 กด 001', logo: 'assets/icon/kbank.png' },
    // เพิ่มธนาคารอื่นๆ
  ];

  paginatedBanks: any[][] = [];
  currentPage = 0;
  itemsPerPage = 6;

  setupPagination(): void {
    for (let i = 0; i < this.bankContacts.length; i += this.itemsPerPage) {
      this.paginatedBanks.push(this.bankContacts.slice(i, i + this.itemsPerPage));
    }
  }

  nextPage(): void {
    if (this.currentPage < this.paginatedBanks.length - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  navigateToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.paginatedBanks.length) {
      this.currentPage = pageIndex;
    }
  }
  
}
