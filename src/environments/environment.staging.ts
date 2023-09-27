
import { EformModuleConfig } from 'eform-share';
import { Config } from 'share-ui';

// export const environment = {
//     production: false,
//     config: {
//         baseConfig: {
//             apiUrl: "https://www.thaipoliceonline.com/api/ccib/v1.0",
//             reportUrl: "https://www.thaipoliceonline.com/web-report/",
//             resourceUrl: "https://www.thaipoliceonline.com/resource/ccib/",
//             hubUrl: "https://noti.thaipoliceonline.com/hub"
//         },
//         eFormHost: "https://www.thaipoliceonline.com/api/e-form/v1.0",
//         recaptcha: {
//             siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
//             secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
//         }
//     }
// };


// export const environment = {
//     production: false,
//     config: {
//         baseConfig: {
//             apiUrl: "http://localhost:14121/api",
//             reportUrl: "http://202.139.215.147/web-report/",
//             resourceUrl: "http://202.139.215.148/resource/ccib/",
//             hubUrl: "http://192.168.10.73/hub"
//         },
//         eFormHost: "http://localhost:52169/api",
//         recaptcha: {
//             siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
//             secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
//         }
//     }
// };

export const environment = {
    production: false,
    config: {
        baseConfig: {
            apiUrl: "https://thaipoliceapimgmt.azure-api.net/ccibazure/api",
            reportUrl: "http://192.168.10.71/web-report/",
            resourceUrl: "http://192.168.10.71/resource/ccib/",
            hubUrl: "http://192.168.10.73/hub",
            urlgdcc:"http://localhost:14121/api"
        },
        eFormHost: "https://thaipoliceapimgmt.azure-api.net/eformazure/api",
        recaptcha: {
            siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        }
    }
};
