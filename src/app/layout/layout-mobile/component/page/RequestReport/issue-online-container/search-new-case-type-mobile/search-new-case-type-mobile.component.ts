import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-search-new-case-type-mobile',
  templateUrl: './search-new-case-type-mobile.component.html',
  styleUrls: ['./search-new-case-type-mobile.component.scss']
})
export class SearchNewCaseTypeMobileComponent implements OnInit {
  // ✅ รับข้อมูลจาก component แม่ได้
  @Input() items: Article[] = [];

  // ✅ ยิงค่าที่เลือกออกไป
  @Output() selected = new EventEmitter<Article>();

  query = '';

  showAll = false;
  readonly initialLimit = 3;
  get visibleItems() {
    const list = this.filtered;
    if (this.showAll) return list;
    return list.slice(0, this.initialLimit);
  }


  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void { }

  get filtered(): Article[] {
    const q = (this.query || '').trim().toLowerCase();
    if (!q) return this.items;


    return this.items.filter((a) =>
      a.name.toLowerCase().includes(q) || a.definition?.toLowerCase().includes(q) || a.keywords?.toLowerCase().includes(q) || a.classification_criteria?.toLowerCase().includes(q)
    );
  }

  highlight(text: any, query: string): SafeHtml {
    const raw = (text ?? '').toString();   // ✅ บังคับเป็น string
    const q = (query || '').trim();
    if (!q) return raw;

    const escaped = this.escapeRegExp(q);
    const regex = new RegExp(`(${escaped})`, 'gi');

    const html = this.escapeHtml(raw).replace(regex, '<span class="highlight">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  trackById(_: number, item: Article) {
    return item.id;
  }

  // ✅ ตอนคลิก -> emit ออกไป
  onCardClick(item: Article) {
    this.selected.emit(item);
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  onQueryChanged(value: string) {
    this.query = (value ?? '').trim();
    this.showAll = false; // ✅ เปลี่ยนคำค้นหาแล้วกลับไปโชว์ 3 อันแรก
  }
}

export type Article = {
  id: number;
  name: string;
  fraud_id?: number | null;
  fraud_sub_id?: number | null;
  fraud_tatic?: number | null;
  case_type_id?: number | null;
  definition?: string | null;
  keywords?: string | null;
  classification_criteria?: string | null;
}