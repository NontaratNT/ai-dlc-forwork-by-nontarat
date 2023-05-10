import { custom } from 'devextreme/ui/dialog';

export class Dialogue {
    public static Confirm(titleText: string, message: string): Promise<boolean> {
        return new Promise(r => {
            custom({
                showTitle: true,
                title: titleText,
                messageHtml: `<div class="text-center"></div><br><h6>${message}</h6>`,
                buttons: [
                    {
                        icon: "check", text: "ใช่", type: "success", focusStateEnabled: false,
                        onClick: () => r(true)
                    },
                    {
                        icon: "close", text: "ไม่", type: "danger",
                        onClick: () => r(false)
                    }
                ]
            }).show();
        });
    }
}
