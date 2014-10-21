/**
 * Created by zhao on 2014/10/18.
 */
var proTitle = document.getElementById("J_ProTitle"),
    proImg = document.getElementById("J_ProImg"),
    textRound = document.getElementById("J_Round"),
    textStatus = document.getElementById("J_Status"),
    btnPause = document.getElementById("J_Pause"),
    btnReset = document.getElementById("J_Reset"),
    textTime = document.getElementById("J_Time"),
    progress = document.getElementById("J_Progress"),
    musicBass = document.getElementById("bass");
var timePre = 10,
    timeTrain = 30,
    score = 0,
    round = 0,
    roundTotal = parseInt(localStorage.roundTotal) || 0,
    index = 0,
    status = 0;
if (!localStorage.roundTotal) {
    localStorage.roundTotal = roundTotal;
}
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
    textStatus.style.display = "none";
    btnPause.style.display = "none";
    btnReset.style.display = "none";
    textTime.innerHTML = "START";
    textTime.addEventListener("click", start, false);
    play("http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text="+proTitle.innerText);
};

var start = function () {
    textTime.innerHTML = "10";
    proTitle.style.display = "";
    proImg.style.display = "none";
    textRound.style.display = "";
    textStatus.style.display = "";
    btnPause.style.display = "none";
    btnReset.style.display = "none";
    textTime.removeEventListener("click", start, false);
    index += 1;
    startClock();
};
var timer = 0;

function startClock() {
    status = 1;
    btnPause.style.display = "";
    btnReset.style.display = "";
    btnPause.className = "btn-left pause";
    btnPause.addEventListener("click", pause, false);
    btnReset.addEventListener("click",init,false);
    next();
}

init();


var clock = function (length) {
    var time = parseInt(textTime.innerHTML);
    var percent = Math.round(100 * (length - time + 1) / length, 2);
    textTime.innerHTML = time - 1;
    progress.className = "progress-radial progress-" + percent;
    score += 1;
    //console.log(score,percent,time,(length-time+1) / length);
    textRound.innerHTML = "Round " + (parseInt(round) + 1);
    textStatus.innerHTML = "历史累计" + roundTotal + "轮";
    if (time < 7){
        play("music/SFX-03.mp3");
    }
    if (percent == 100) {
        index += 1;
        //document.getElementById("bass").play();
        clearInterval(timer);
        next();
    }
    else {
        //document.getElementById("bass").play();
    }


    if (score == (project.length * (timePre +timeTrain))) {
        round += 1;
        roundTotal += 1;
        localStorage.roundTotal = roundTotal;
        clearInterval(timer);
        init();
        var title = "完成" + round + "轮7分钟训练，相当于" + round + "次长跑，累计完成" + roundTotal + "轮训练";
        proTitle.innerHTML = "<p>恭喜你，" + title + "，请每天坚持，练出好身体！</p>";
        play("http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text="+proTitle.innerText);
        dp_submitScore(title, roundTotal);
    }
};

function next() {
    progress.className = "progress-radial progress-0";
    switch (index % 2) {
        case 1 :
            status = 1;
            textTime.innerHTML = timePre;
            timer = window.setInterval("clock(timePre)", 1000);
            document.body.className = "pre";
            proTitle.innerHTML = "<p>接下来是</p><p>" + project[parseInt(index / 2)] +"</p>";
            proImg.style.display = "none";
            break;
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
    play("http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text="+proTitle.innerText)
}

function pause() {
    clearInterval(timer);
    btnPause.className = "btn-left restart";
    btnPause.removeEventListener("click", pause, false);
    setTimeout('btnPause.addEventListener("click", restart, false)',200);
    status = 0;
    textStatus.innerHTML = "已暂停";
}

function restart() {
    btnPause.removeEventListener("click", restart, false);
    btnPause.addEventListener("click", pause, false);
    btnPause.className = "btn-left pause";
    status = 1;
    textStatus.innerHTML = "";
    switch (index % 2) {
        case 1 :
            timer = setInterval("clock(timePre)", 1000);
            break;
        case 0 :
            timer = setInterval("clock(timeTrain)", 1000);
            break;

    }
}

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
//    createjs.Sound.alternateExtensions = ["mp3"];
//    createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));
//    createjs.Sound.registerSound(url, "sound");
//    function loadHandler(event) {
//        // This is fired for each sound that is registered.
//        var instance = createjs.Sound.play("sound");  // play using id.  Could also use full sourcepath or event.src.
//        instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
//        instance.volume = 0.5;
//    }
//    loadHandler(event);
}

