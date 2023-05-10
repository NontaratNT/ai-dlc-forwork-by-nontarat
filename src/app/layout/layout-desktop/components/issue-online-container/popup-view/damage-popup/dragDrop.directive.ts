import {
    Directive,
    HostBinding,
    HostListener,
    Output,
    EventEmitter,
} from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

export interface FileHandle {
    file: File;
    url: SafeUrl;
}
const colorNormal = '#ffffff';
const colorEvent = '#f6f7fc';
@Directive({
    selector: "[appDrag]",
})
export class DragDirective {
    @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

    @HostBinding("style.background") private background = colorNormal;

    constructor(private sanitizer: DomSanitizer) {}

    @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = colorEvent;
    }

    @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = colorNormal;
    }

    @HostListener("drop", ["$event"]) public onDrop(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = colorNormal;

        const files: FileHandle[] = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < evt.dataTransfer.files.length; i++) {
            const file = evt.dataTransfer.files[i];
            const url = this.sanitizer.bypassSecurityTrustUrl(
                window.URL.createObjectURL(file)
            );
            files.push({ file, url });
        }
        if (files.length > 0) {
            this.files.emit(files);
        }
    }
}
