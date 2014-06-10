function getCpuUsage(callback){
    chrome.system.cpu.getInfo(function(info){
        var total = 0;
        var user = 0;
        var kernel = 0;
        for(var i=0; i<info.processors.length; i++){
            total += info.processors[i].usage.total - cpu_history.last_total[i];
            cpu_history.last_total[i] = info.processors[i].usage.total;
            user += info.processors[i].usage.user - cpu_history.last_user[i];
            cpu_history.last_user[i] = info.processors[i].usage.user;
            kernel += info.processors[i].usage.kernel - cpu_history.last_kernel[i];
            cpu_history.last_kernel[i] = info.processors[i].usage.kernel;
        }
        user = Math.round(user/total*100);
        kernel = Math.round(kernel/total*100);
        callback({user:user,kernel:kernel,total:user+kernel});
    });
}

function getMemUsage(callback){
    chrome.system.memory.getInfo(function(info){
        callback(info);
    });
}

function updateCpuHistory(){
    getCpuUsage(function(usage){
        cpu_history.user.shift();
        cpu_history.user.push(usage.user);
        cpu_history.kernel.shift();
        cpu_history.kernel.push(usage.kernel);
        cpu_history.total.shift();
        cpu_history.total.push(usage.total);
        showCpu();
    });
}

function updateMemHistory(){
    getMemUsage(function(usage){
        mem_history.used.shift();
        mem_history.used.push(Math.round((usage.capacity-usage.availableCapacity)/usage.capacity*100));
        showMem();
    });
}

function updateData(){
    updateCpuHistory();
    updateMemHistory();
}

    function showCpu(){
        var history = {
            labels : (function(){for(var i=0,labels=[];i<ponits_num;labels.push(''),i++);return labels;})(),
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    data : cpu_history.total
                },
                {
                    fillColor : "rgba(90,140,255,0.5)",
                    data : cpu_history.kernel
                },
                {
                    fillColor : "rgba(255,90,90,0.5)",
                    data : cpu_history.user
                }
            ]
        };

        var now = [
            {
                value: cpu_history.total[ponits_num-1],
                color:"rgba(220,220,220,0.7)"
            },
            {
                value : 100-cpu_history.total[ponits_num-1],
                color : "rgba(220,220,220,0.3)"
            }            
        ];
        var his_ctx = document.getElementById('cpu_history').getContext("2d");
        var now_ctx = document.getElementById("cpu_total").getContext("2d");
        if(!cpu_chart_line || !cpu_chart_pie){
            cpu_chart_line = new Chart(his_ctx);
            cpu_chart_pie = new Chart(now_ctx);
        }
        cpu_chart_line.Line(history, {scaleFontSize:4,pointDot:false,animation:false});
        cpu_chart_pie.Pie(now, {segmentShowStroke:false,animation:false});
    }

    function showMem(){
        var history = {
            labels : (function(){for(var i=0,labels=[];i<ponits_num;labels.push(''),i++);return labels;})(),
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    data : mem_history.used
                }
            ]
        };

        var now = [
            {
                value: mem_history.used[ponits_num-1],
                color:"rgba(220,220,220,0.7)"
            },
            {
                value : 100-mem_history.used[ponits_num-1],
                color : "rgba(220,220,220,0.3)"
            }            
        ];
        var his_ctx = document.getElementById('mem_history').getContext("2d");
        var now_ctx = document.getElementById("mem_total").getContext("2d");
        if(!mem_chart_line || !mem_chart_pie){
            mem_chart_line = new Chart(his_ctx);
            mem_chart_pie = new Chart(now_ctx);
        }
        mem_chart_line.Line(history, {scaleFontSize:4,pointDot:false,animation:false});
        mem_chart_pie.Pie(now, {segmentShowStroke:false,animation:false});
    }

function init(){
    cpu_history = {
        user: [],
        kernel: [],
        total: [],
        last_user: [],
        last_kernel: [],
        last_total: []
    };
    mem_history = {
        used: []
    };
    init_cpu_history();
}

function init_cpu_history(){
    for(var i=0; i<ponits_num; i++){
        cpu_history.user.push(0);
        cpu_history.kernel.push(0);
        cpu_history.total.push(0);
    }
    chrome.system.cpu.getInfo(function(info){
        for(var i=0; i<info.processors.length; i++){
            cpu_history.last_total.push(info.processors[i].usage.total);
            cpu_history.last_user.push(info.processors[i].usage.user);
            cpu_history.last_kernel.push(info.processors[i].usage.kernel);
        }
        init_mem_history();
    });
}

function init_mem_history(){
    for(var i=0; i<ponits_num; i++){
        mem_history.used.push(0);
    }
    updateData();
    setInterval(updateData, 1000);
}

var cpu_history, mem_history, ponits_num=20, cpu_chart_pie, cpu_chart_line, mem_chart_pie, mem_chart_line;

init();