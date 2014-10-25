/*
 * 7minutes
 * binggg - v1.0.0 (2014年10月21日15:06:09)
 * http://binggg.net | Released under MIT license
 */

var proTitle = document.getElementById("J_ProTitle"),
    proImg = document.getElementById("J_ProImg"),
    textRound = document.getElementById("J_Round"),
    textStatus = document.getElementById("J_Status"),
    btnPause = document.getElementById("J_Pause"),
    btnReset = document.getElementById("J_Reset"),
    textTime = document.getElementById("J_Time"),
    progress = document.getElementById("J_Progress");

// timePre 表示准备活动的时间
var timePre = 10,

// timeTrain 表示训练的时间
    timeTrain = 30,

// score 表示当前轮次的累计时间
    score = 0,

// round 表示本次锻炼的轮次
    round = 0,

// 累计锻炼轮数的定义，如果localstorage中存在，则直接读取
    roundTotal = parseInt(localStorage.roundTotal) || 0,

// index 表示锻炼的第几个小节，包含 pre 和 train
    index = 0,

// status 存储倒计时开始和停止的状态，开始为1，停止为0
    status = 0,

// 存储倒计时的setinterval
    timer = 0;

// 将累计锻炼轮数从localstorage中读取出来
if (!localStorage.roundTotal) {
    localStorage.roundTotal = roundTotal;
}

// 锻炼项目
var project = [
    "Jumping jacks——开合跳",
    "Wall sit——背靠墙直角坐",
    "Push-up——俯卧撑",
    "Abdominal crunch——仰卧起坐",
    "Step-up onto chair——单腿上椅站立",
    "Squat——蹲起",
    "Triceps dip on chair——背椅仰卧撑",
    "Plank——平板支撑",
    "High Knees running in place——原地高抬腿",
    "Lunge——弓箭步",
    "Push-up and rotation——俯卧侧转",
    "Left side plank——左侧平板支撑",
    "Right side plank——右侧平板支撑"
];

// 界面初始化
var init = function () {
    score = 0;
    index = 0;
    clearInterval(timer);
    document.body.className = "";
    proTitle.style.display = "";
    progress.className = "progress-radial progress-0";
    proTitle.innerHTML = "<small><p>锻炼7分钟超越一次长跑,</p><p>点击 start 开始</p><p style='color:#fff'>跟着提示做运动吧~</p></small>";
    proImg.style.display = "none";
    textRound.style.display = "none";
    textStatus.style.display = "";
    btnPause.style.display = "none";
    btnReset.style.display = "none";
    textTime.innerHTML = "START";

    // 为start绑定点击事件
    textTime.addEventListener("click", start, false);

    // 使用百度中文语音接口播放介绍文字
    play("http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=" + getText(proTitle));

    // 开始检测应用程序缓存
    startWorker();
};

// 点击start启动后的操作
var start = function () {
    textTime.innerHTML = "10";
    proTitle.style.display = "";
    proImg.style.display = "none";
    textRound.style.display = "";
    textStatus.style.display = "";

    // 取消start部分的点击事件监听
    textTime.removeEventListener("click", start, false);

    // 锻炼场次增加
    index += 1;

    // 状态为开始
    status = 1;
    btnPause.style.display = "";
    btnReset.style.display = "";

    // 切换pause按钮的显示样式
    btnPause.className = "btn-left pause";

    //为暂停播放按钮的点击事件绑定 pause 方法
    btnPause.addEventListener("click", pause, false);

    // 为重置按钮的点击事件绑定 init 方法
    btnReset.addEventListener("click", init, false);

    // 进行下一步的选择
    next();
};

init();

// 主要功能 计时器
var clock = function (length) {
    var time = parseInt(textTime.innerHTML);
    var percent = Math.round(100 * (length - time + 1) / length, 2);
    textTime.innerHTML = time - 1;
    progress.className = "progress-radial progress-" + percent;
    score += 1;
    textRound.innerHTML = "Round " + (parseInt(round) + 1);
    textStatus.innerHTML = "历史累计" + roundTotal + "轮";

    // 在进入下一节之前，倒数5个数
    if (time < 7) {
        play("music/SFX-03.mp3");
    }

    // 完成一节，进入下一节
    if (percent == 100) {
        index += 1;
        clearInterval(timer);
        next();
    }

    // 如果总分达到一轮的总时间，就进行如下操作
    if (score == (project.length * (timePre + timeTrain))) {
        round += 1;
        roundTotal += 1;
        localStorage.roundTotal = roundTotal;
        clearInterval(timer);
        init();
        var title = "完成" + round + "轮7分钟训练，相当于" + round + "次长跑，累计完成" + roundTotal + "轮训练";
        proTitle.innerHTML = "<p>恭喜你，" + title + "，请每天坚持，练出好身体！</p>";
        play("http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=" + getText(proTitle));

        // 此处调用的为html中的方法，用于加入发现街排行排名
        dp_submitScore(title, roundTotal);
    }
};

// 下一步操作的方法
function next() {

    // 倒计时指示器归0
    progress.className = "progress-radial progress-0";

    // 根据小节判断下一步该进行哪一步
    switch (index % 2) {

        // pre 准备
        case 1 :
            status = 1;
            textTime.innerHTML = timePre;
            timer = window.setInterval("clock(timePre)", 1000);

            // 更换body的类名，从而实现相关显示的转换，比如背景色，详见css文件
            document.body.className = "pre";
            proTitle.innerHTML = "<p>接下来是</p><p>" + project[parseInt(index / 2)] + "</p>";
            proImg.style.display = "none";
            break;

        // train 训练
        case 0 :
            status = 1;
            textTime.innerHTML = timeTrain;
            document.body.className = "";
            timer = window.setInterval("clock(timeTrain)", 1000);
            proImg.src = "images/" + ( parseInt(index / 2)) + ".png";
            proTitle.innerHTML = "<p>" + project[parseInt(index / 2) - 1] + "</p>";
            proImg.style.display = "";
            break;
    }

    // 播放提示语音
    play("http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=" + getText(proTitle))
}


// 暂停计时方法
function pause() {
    clearInterval(timer);
    btnPause.className = "btn-left restart";
    btnPause.removeEventListener("click", pause, false);
    setTimeout('btnPause.addEventListener("click", restart, false)', 200);
    status = 0;
    textStatus.innerHTML = "已暂停";
}

// 重新启动计时方法
function restart() {

    // 事件的取消绑定和添加绑定
    btnPause.removeEventListener("click", restart, false);
    btnPause.addEventListener("click", pause, false);

    // 显示的切换
    btnPause.className = "btn-left pause";
    status = 1;
    textStatus.innerHTML = "";

    // 此处要判断该进行训练还是准备活动
    switch (index % 2) {
        case 1 :
            timer = setInterval("clock(timePre)", 1000);
            break;
        case 0 :
            timer = setInterval("clock(timeTrain)", 1000);
            break;

    }
}

// 播放音频方法
function play(url) {
    var audio = document.createElement('audio');
    var source = document.createElement('source');
    source.type = "audio/mpeg";
    source.src = url;
    source.autoplay = "autoplay";
    source.controls = "controls";
    source.isLoadedmetadata = false;
    source.touchstart = true;
    source.audio = true;
    audio.appendChild(source);
    audio.play();
}

// 获取文字方法
function getText(obj) {

    // Firefox 不支持innerText，使用它的TextContent方法
    if (window.navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
        return obj.textContent;
    }
    else {
        return obj.innerText;
    }
}

// 后台运行
var w;

function startWorker() {
    if (typeof(Worker) !== "undefined") {
        if (typeof(w) == "undefined") {
            w = new Worker("js/checkCacheStatus.js");
        }
        setTimeout("console.log(window.applicationCache)",50);
        w.onmessage = function (event) {
            alert(event.data);
            document.getElementById("J_Status").innerHTML = event.data;
        };
    }
    else {
        document.getElementById("J_Status").innerHTML = "Sorry, your browser does not support Web Workers...";
    }
}


//停止应用程序缓存
function stopWorker() {
    w.terminate();
}