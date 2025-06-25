import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxTreeViewComponent } from "devextreme-angular";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit,OnDestroy {
    @ViewChild(DxTreeViewComponent) selectMenuList: DxTreeViewComponent;

    @Input() isDrawerOpen = true;
    @Output() menuChange = new EventEmitter<any>();
    @Output() drawerMenu = new EventEmitter<any>();
    listMneu = [
        { id: 1, text: 'ติดตามสถานะ', icon: 'fas fa-edit',link:"/main/task-list" },
        { id: 2, text: 'แจ้งเรื่องใหม่', icon: 'fas fa-folder-plus',link:"/main/issue-online/1" },
        { id: 17, text: 'ประวัติการนัดหมาย', icon: 'fas fa-history',link:"/main/appointment-history" },
        { id: 18, text: 'แจ้งปัญหา', icon: 'fas fa-folder',link:"/main/problem-online" },
        { id: 19, text: 'แจ้งเบาะแส', icon: 'fas fa-folder-plus',link:"/main/issue-online-report" },
        { id: 20, text: 'แชทกับเจ้าหน้าที่', icon: 'fas fa-folder-plus',link:"/main/chat-list" },
        // { id: 10, text: 'dashboard', icon: 'product',link:"/main/dashboard" },
        // { id: 11, text: 'page2', icon: 'money',link:"/main/page2" },
        // { id: 12, text: 'personal', icon: 'group',link:"/main/personal" },
        // { id: 13, text: 'task-list', icon: 'card',link:"/main/task-list" },
        // { id: 14, text: 'แจ้งเรื่องใหม่', icon: 'product',link:"/main/dashboard-case" },
        // { id: 15, text: 'issue-online', icon: 'product',link:"/main/issue-online" },
    ];
    isDrawerOpenReload = true;
    versionControl: string;
    constructor(
        private router: Router,
    ) {
        this.versionControl = environment.config.versionControl;
    }

    ngOnInit(): void {
        this.isDrawerOpenReload = this.isDrawerOpen;
        setTimeout(() => {
            const link = this.router.url ?? null;
            if(link){
                this.SelectChangeRoute(link);
            }
        });

    }
    ngOnDestroy(): void {
    }
    DrawerMenu() {
        this.isDrawerOpenReload = false;
        this.drawerMenu.emit(!this.isDrawerOpen);
        setTimeout(()=>(this.isDrawerOpenReload = true), 800);
    }
    SidebarSize(){
        return this.isDrawerOpen?"size-full":"size-mini";
    }
    SelectMenu(event) {
        const d = event.itemData || undefined;
        const link = d.link || undefined;
        if (link) {
            // this.selectMenuList.instance.selectItem(e.node.key);
            this.SelectChangeRoute(link);
            this.menuChange.emit(d);
        }

    }
    private SelectChangeRoute(url) {
        // console.log('url',url);
        // this.selectMenuList.instance.unselectAll();

        // let newUrl = this._route.url;
        let newUrl = url;

        if (this.router.url.startsWith("/")) {
            newUrl = newUrl.substring(1);
        }

        const urlSegment = newUrl.split("/");
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const pathMatch = urlSegment.length > 2 ? urlSegment[1] + "/" : urlSegment[1];
        const menuFinded = this.listMneu.filter(_ => _.link && _.link.indexOf(pathMatch) > -1);

        if (menuFinded) {
            let menu;
            if (menuFinded.length > 1) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                const newPathMatch = urlSegment[1] + "/" + urlSegment[2];
                menu = menuFinded.find(_ => _.link && _.link.indexOf(newPathMatch) > -1);

                if (menu == null) {
                    menu = menuFinded.find(_ => _.link && _.link.indexOf(pathMatch) > -1);
                }
                if (newUrl !== menu.link) {
                    menu = menuFinded.find(_ => _.link && _.link.indexOf(newUrl) > -1);
                }

            }
            else if (menuFinded.length === 0) {
                const newPathMatch = urlSegment[1];
                menu = this.listMneu.find(_ => _.link && _.link.indexOf(newPathMatch) > -1);

            } else {
                menu = menuFinded.pop();
            }


            // if (menu.MODULE_PARENT_ID !== undefined && menu.MODULE_PARENT_ID > 0) {
            //     this.selectMenuList.instance.expandItem(menu.MODULE_PARENT_ID);
            // }
            this.selectMenuList.instance.unselectAll();
            const isMenu = menu ?? undefined;
            if (!isMenu){
                return ;
            }

            const isMenuLink = isMenu.link ?? undefined;

            if (isMenuLink !== undefined) {
                this.selectMenuList.instance.selectItem(menu.id);
            }

        }

    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    GoUrl(url = '/'){
        this.router.navigate([url]);
    }
}
