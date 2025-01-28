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
    { name: 'ธนาคารกรุงไทย', phone: '0-2111-1111 กด 108', logo: 'assets/icon/ktb.png' },
    { name: 'ธนาคารกรุงศรีอยุธยา', phone: '1572 กด 5', logo: 'assets/icon/bay.png' },
    { name: 'ธนาคารกรุงเทพ', phone: '1333 หรือ 0-2645-5555 กด * 3', logo: 'assets/icon/bbl.png' },
    { name: 'ธนาคารไทยพาณิชย์', phone: '0-2777-7575', logo: 'assets/icon/scb.png' },
    { name: 'ธนาคารทหารไทยธนชาต', phone: '1428 กด 03', logo: 'assets/icon/ttb.png' },
    { name: 'ธนาคารออมสิน', phone: '1115 กด 6', logo: 'assets/icon/gsb.png' },
    { name: 'ธนาคารซีไอเอ็มบี ไทย', phone: '0-2626-7777 กด 12', logo: 'assets/icon/cimb.png' },
    { name: 'ธนาคารไทยเครดิต', phone: '0-2697-5454', logo: 'assets/icon/tcrb.png' },
    { name: 'ธนาคารแลนด์ แอนด์ เฮ้าส์', phone: '0-2459-0000 กด 8', logo: 'assets/icon/lhb.png' },
    { name: 'ธนาคารอาคารสงเคราะห์', phone: '0-2645-9000 กด 33', logo: 'assets/icon/ghb.png' },
    { name: 'ธนาคารเพื่อการเกษตรและสหกรณ์', phone: '0-2888-8888 กด 001', logo: 'assets/icon/baac.png' },
    { name: 'ธนาคารยูโอบี', phone: '0-2344-9555', logo: 'assets/icon/uob.png' },
    { name: 'ธนาคารเกียรตินาคินภัทร', phone: '0-2165-5555 กด 6', logo: 'assets/icon/kk.png' },
    { name: 'ธนาคารทิสโก้', phone: '0-2633-6000 กด * 7', logo: 'assets/icon/tisco.png' },
    { name: 'ธนาคารไอซีบีซี(ไทย)', phone: '0 2629 5588 กด 4', logo: 'assets/icon/icbc.png' },
    { name: 'ธนาคารอิสลามแห่งประเทศไทย', phone: '1302 กด 6', logo: 'assets/icon/ibank.png' },
    { name: 'ทรูมันนี่', phone: '1240 กด 6', logo: 'assets/icon/true.png' },
    { name: 'ทูซีทูพี(ประเทศไทย)', phone: '0 2026 3000 กด 0', logo: 'assets/icon/2C2P.png' },
    { name: 'แอดวานซ์ เอ็มเปย์', phone: '0 2078 9299 กด 1', logo: 'assets/icon/mpay.png' },
    { name: 'ธนาคารไทยไมโคร ดิจิทัล โซลูชั่นส์', phone: '0 2697 5353 กด 0', logo: 'assets/icon/tmc.jpg' },
    { name: 'แมกซ์ การ์ด', phone: '1614 กด 4', logo: 'assets/icon/max.jpg' },
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
