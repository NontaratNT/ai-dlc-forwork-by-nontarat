export class BusinessKey {
    private static _bnId = "bnId";
    private static _smId = "smId";
    private static _fcId = "fcId";
    private static _bpmId = "bpmId";

    bpmId: number;
    backendId: number;
    submissionId: string;
    formConfigId: string;

    constructor(backendId: number, bpmId: number, submitId: string, formConfigId: string) {
        this.backendId = backendId;
        this.bpmId = bpmId;
        this.submissionId = submitId;
        this.formConfigId = formConfigId;
    }

    static FromBusinessKey(key: string): BusinessKey {
        const rx = /(?<prop>\w+)=(?<value>[^\s;]+)/g;

        if (!rx.test(key)) {
            throw new Error("รูปแบบของ BusinessKey ไม่ถูกต้อง");
        }

        rx.lastIndex = 0;
        const ins: BusinessKey = new BusinessKey(0, 0, "", "");
        let m: RegExpExecArray;
        while ((m = rx.exec(key)) !== null) {
            if (m.index === rx.lastIndex) {
                rx.lastIndex++;
            }
            switch (m.groups.prop) {
            case BusinessKey._bnId:
                ins.backendId = +m.groups.value;
                break;
            case BusinessKey._bpmId:
                ins.bpmId = +m.groups.value;
                break;
            case BusinessKey._smId:
                ins.submissionId = m.groups.value;
                break;
            case BusinessKey._fcId:
                ins.formConfigId = m.groups.value;
                break;
            }
        }


        return ins;
    }

    toString(): string {
        return `${BusinessKey._bnId}=${this.backendId};${BusinessKey._smId}=${this.submissionId};` +
        `${BusinessKey._fcId}=${this.formConfigId};${BusinessKey._bpmId}=${this.bpmId}`;
    }
}
