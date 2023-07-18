// ==UserScript==
// @name         自动评教
// @namespace    https://github.com/Well2333/Auto-evaluate-scripts-for-HMU
// @version      0.2
// @description  自动评教脚本，适用于哈尔滨医科大学教务系统
// @author       Well404
// @match        https://jwweb.hrbmu.edu.cn/new/welcome.page
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hrbmu.edu.cn
// @grant        none
// ==/UserScript==


(function () {
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function insertButton() {
        var parentElement = document.querySelector('#header > div.infoDiv > div.bottom');
        var newButton = document.createElement('a');
        newButton.href = "javascript:void(0)";
        newButton.innerText = '开始评教';
        newButton.style.color = 'red';  // 使字体颜色变为红色
        parentElement.appendChild(newButton);
        newButton.addEventListener('click', async function () {
            await main();
        });
        alert("自动评教脚本已加载，请先手动切换到评教页面，然后再点击“开始评教”按钮，脚本便会自动在此页面评教（不会自动翻页）");
    }

    async function evaluateAndSubmit(iframeDoc) {
        var i = 1;
        while (true) {
            var radioButton = iframeDoc.querySelector("#container > div:nth-child(" + i + ") > input:nth-child(2)");
            if (radioButton) {
                radioButton.click();
                i++;
            } else {
                var nextElement = iframeDoc.querySelector("#container > div:nth-child(" + i + ")");
                if (nextElement) {
                    i++;
                } else {
                    break;
                }
            }
            await sleep(10);  // 适当地调整等待时间
        }

        var submitButton = iframeDoc.querySelector("#dlg > div > div > div > div.panel.layout-panel.layout-panel-south > div > div > a > span > span");
        if (submitButton) {
            submitButton.click();
            return true;
        } else {
            return false;
        }
    }

    async function main() {
        var frames = document.getElementsByTagName('iframe');
        for (var i = 0; i < frames.length; i++) {
            try {
                var buttons = frames[i].contentWindow.document.querySelectorAll('a');
                for (var j = 0; j < buttons.length; j++) {
                    if (buttons[j].textContent == '进入评价') {
                        try {
                            buttons[j].click();
                            await sleep(1000);  // 适当地调整等待时间
                            var evaluated = await evaluateAndSubmit(frames[i].contentWindow.document);
                            if (!evaluated) {
                                throw new Error('无法完成评价或点击提交按钮');
                            }
                        } catch (err) {
                            alert("脚本出现错误。错误描述：\n\n" + err.message + "\n\n点击确定继续。");
                        }
                    }
                }
            } catch (err) {
                // 忽略跨域iframe
            }
        }
        alert('评教已完成');
    }

    window.onload = function () {
        insertButton();
    }
})();
