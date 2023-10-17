
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
    production: true,
    baseUrl: 'https://ashy-sky-0b532af00.3.azurestaticapps.net/',
    config: {
        baseConfig: {
            apiUrl: "https://api.thaipoliceonline.com/ccibazure/api",
            reportUrl: "https://officer.thaipoliceonline.com/web-report/",
            resourceUrl: "https://api.thaipoliceonline.com/eformazure/api/resource/",
            hubUrl: "https://police-online-noti-azure.azurewebsites.net/hub",
            // urlgdcc:"https://citizenuat.thaipoliceonline.com/api/ccib/v1.0"
            urlgdcc:"https://officer.thaipoliceonline.com/api/ccib/v1.0",
            urlgdcceform:"https://officer.thaipoliceonline.com/api/e-form/v1.0"
        },
        eFormHost: "https://api.thaipoliceonline.com/eformazure/api",
        recaptcha: {
            siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        },
        versionControl: "1.6609.29.1"
    }
};