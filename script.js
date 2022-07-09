// ==UserScript==
// @name         自动评教
// @namespace    https://github.com/Well2333/Auto-evaluate-scripts-for-HMU
// @version      0.1
// @description  自动评教脚本，适用于哈尔滨医科大学教务系统
// @author       Well404
// @match        http://jwweb.hrbmu.edu.cn/new/welcome.page
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hrbmu.edu.cn
// @grant        none
// ==/UserScript==


(function() {
    function sleep(time){
        return new Promise((resolve) => setTimeout(resolve, time));
       }
    async function main() {
        await sleep(2000);
        document.querySelector("#sm3").click();
        await sleep(1000);
        document.querySelector("#\\34 0 > table > tbody > tr:nth-child(1) > td").click();
        await sleep(1000);
        var sNum = 0;
        var iframe_selector = document.querySelector('#nav_tab > div.tabs-panels.tabs-panels-noborder > div:nth-child(2) > div > iframe').contentWindow;
        var comment_flag = null
        while (true){
            comment_flag = iframe_selector.document.querySelector("#datagrid-row-r1-2-" + sNum + " > td:nth-child(6) > div > a > span > span").textContent
            try{
                if (comment_flag== '进入评价') {
                    iframe_selector.document.querySelector("#datagrid-row-r1-2-" + sNum + " > td:nth-child(6) > div > a").click();
                    sNum += 1;
                } else if (comment_flag == '已评价'){
                    sNum += 1;
                    continue;
                } else if (comment_flag == null){
                    alert('评教已完成');
                    break;
                }
            } catch(err) {
                alert("脚本出现错误。错误描述：\n\n"+ err.message + "\n\n点击确定继续。");
            }
            await sleep(1000);
            var qnum = 1;
            var panel_selector = document.querySelector('#nav_tab > div.tabs-panels.tabs-panels-noborder > div:nth-child(2) > div > iframe').contentDocument.querySelector("#searchpage > div.panel.window");
            var ques_selector = panel_selector.querySelector("#container > div:nth-child("+qnum+") > input:nth-child(2)");
            try{
                while (true){
                    if (ques_selector){
                        qnum += 1;
                        ques_selector.click();
                        ques_selector = panel_selector.querySelector("#container > div:nth-child("+qnum+") > input:nth-child(2)");
                    } else {
                        break;
                    }
                }
            } catch(err) {
                alert("脚本出现错误。错误描述：\n\n"+ err.message + "\n\n点击确定继续。");
            }
            ques_selector = panel_selector.querySelector("#dlg > div > div > div > div.panel.layout-panel.layout-panel-south > div > div > a").click();
        }
    }
    main();
})();