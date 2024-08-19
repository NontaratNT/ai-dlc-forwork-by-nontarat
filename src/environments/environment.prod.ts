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
//             apiUrl: "http://202.139.215.148/ccib/api",
//             reportUrl: "http://202.139.215.147/web-report/",
//             resourceUrl: "http://202.139.215.148/resource/ccib/",
//             hubUrl: "http://202.139.215.148/ccib/hub"
//         },
//         eFormHost: "http://202.139.215.148/e-form/api",
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
//             apiUrl: "http://192.168.10.71/ccib/api",
//             reportUrl: "http://192.168.10.70/web-report/",
//             resourceUrl: "http://192.168.10.71/resource/ccib/",
//             hubUrl: "http://192.168.10.73/hub"
//         },
//         eFormHost: "http://192.168.10.71/e-form/api",
//         recaptcha: {
//             siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
//             secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
//         },
        // versionControl: "1.6609.29.1"
//     }
// }

// export const environment = {
//         production: true,
//         baseUrl: 'https://green-plant-0331bd900.3.azurestaticapps.net/',
//         config: {
//             baseConfig: {
//                 apiUrl: "https://ccibapi.azurewebsites.net/api",
//                 reportUrl: "http://192.168.10.70/web-report/",
//                 resourceUrl: "http://192.168.10.71/resource/ccib/",
//                 hubUrl: "http://192.168.10.73/hub",
//                 urlgdcc:"https://officer.thaipoliceonline.com/api/ccib/v1.0",
//                 urlgdcceform:"https://officer.thaipoliceonline.com/api/e-form/v1.0"
//             },
//             eFormHost: "https://efromapi.azurewebsites.net/api",
//             recaptcha: {
//                 siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
//                 secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
//             },
//             versionControl: "1.6609.29.1"
//         }
//     }


//Thai ID
export const environment = {
    production: true,
    baseUrl: 'https://green-plant-0331bd900.3.azurestaticapps.net/',
    config: {
        baseConfig: {
            apiUrl: "https://officeruat.thaipoliceonline.com/api/ccib/v1.0",
            reportUrl: "http://192.168.10.70/web-report/",
            resourceUrl: "http://192.168.10.71/resource/ccib/",
            resourceUrlAzure: "https://api.thaipoliceonline.com/eformazure/api/resource/download?filePath=",

            hubUrl: "http://192.168.10.73/hub",
            urlgdcc:"https://officeruat.thaipoliceonline.com/api/ccib/v1.0",
            urlgdcceform:"https://officeruat.thaipoliceonline.com/api/e-form/v1.0"
        },
        eFormHost: "https://officeruat.thaipoliceonline.com/api/e-form/v1.0",
        recaptcha: {
            siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        },
        versionControl: "1.6609.29.1"
    }
}
