import { Component, OnInit, ViewChild } from '@angular/core';
import { IssueOnlineReportInformerComponent } from './issue-online-report-informer/issue-online-report-informer.component';
import { IssueOnlineReportEventComponent } from './issue-online-report-event/issue-online-report-event.component';
import { IssueOnlineReportValidateComponent } from './issue-online-report-validate/issue-online-report-validate.component';

@Component({
    selector: 'app-issue-online-report',
    templateUrl: './issue-online-report.component.html',
    styleUrls: ['./issue-online-report.component.scss']
})
export class IssueOnlineReportComponent implements OnInit {
    @ViewChild(IssueOnlineReportInformerComponent) set content0(content0: IssueOnlineReportInformerComponent) {
        if (content0) {
            this.informerComponent = content0;
            this.informerComponent.mainConponent = this;
            this.indexLocker.informerComponent = true;

        }
    }

    @ViewChild(IssueOnlineReportEventComponent) set content1(content1: IssueOnlineReportEventComponent) {
        if (content1) {
            this.evenComponent = content1;
            this.evenComponent.mainConponent = this;
            this.indexLocker.evenComponent = true;

        }
    }

    @ViewChild(IssueOnlineReportValidateComponent) set content2(content2: IssueOnlineReportValidateComponent) {
        if (content2) {
            this.validateComponent = content2;
            this.validateComponent.mainConponent = this;
            this.indexLocker.validateComponent = true;

        }
    }

    public informerComponent: IssueOnlineReportInformerComponent;
    public evenComponent: IssueOnlineReportEventComponent;
    public validateComponent: IssueOnlineReportValidateComponent;
    public formInsert: any = {};
    indexLocker: any = {};

    stepNavigationWidth = 1830;
    public indexTab = 0;
    stepNavigationZindex = 100;
    isLoading = false;
    public max = Number.MIN_VALUE;
    public formType = 'add';
    stepNavigation = [
        { text: "ข้อมูลผู้เสียหาย", textClass: "arrow-div arrow-center" },
        { text: "เรื่องที่เกิดขึ้น", textClass: "arrow-div arrow-center" },
        { text: "ยืนยันความถูกต้อง", textClass: "arrow-div arrow-end" }
    ];
    constructor() { }

    ngOnInit(): void {
        this.SetFormInit();
    }

    async SetFormInit() {
        this.indexTab = 0;
        this.max = Number.MIN_VALUE;
        this.formType = 'add';
        this.isLoading = false;
    }

    GetzIndexTab(index: number = 0) {
        return this.stepNavigationZindex - index;
    }

    // SelectTabIndex(index: number = 0) {

    //     this.indexTab = index;
    //     const countItem = this.stepNavigation.length;
    //     if (index === (countItem - 1)) {
    //         this.validateComponent.loadData();
    //     }
    // }

    SelectTabIndex(index: number = 0) {
        this.max = Math.max(this.max, this.indexTab);
        if (this.max >= index) {
            console.log(this.indexTab);
            switch (this.indexTab) {
                case 0: this.informerComponent.SubmitForm("tab"); break;
                case 1: this.evenComponent.SubmitForm("tab"); break;
            }
            this.indexTab = index;
        }
        const countItem = this.stepNavigation.length;
        if (index === (countItem - 1) && this.indexLocker.validateConponent) {
            this.validateComponent.loadData();
        }
    }

    SelectorTab(index) {
        var numbers = [];
        for (var i = index; i <= this.max; i++) {
            numbers.push(i);
        }
        if (this.indexTab >= index) {
            return 'arrow-selected';
        } else if (numbers.some(number => number <= this.max)) {
            return 'arrow-selected-back';
        } else {
            return 'arrow-default';
        }

    }

    public NextIndex(index: number = 0) {
        this.indexTab = index;
        const countItem = this.stepNavigation.length;
        if (index === (countItem - 1)) {
            console.log(this.validateComponent);
            this.validateComponent.loadData();
        }
    }

    public checkReload(page) {
        // console.log("เรียกข้อมูลไม่สำเร็จกำลังเรียกข้อมูลใหม่ที่หน้า ",page);
        switch (page) {
            case 1: this.informerComponent.ngOnInit(); break;
            case 2: this.evenComponent.ngOnInit(); break;
        }
    }

}
