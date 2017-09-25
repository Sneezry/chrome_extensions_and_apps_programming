$.get('http://ip.chinaz.com', function (res){
    var resJ = $(res);
    var re = /\d+.\d+.\d+.\d+/;
    var ip = re.exec(resJ.find('p.pl10').text())[0];
    // console.log(resJ.find('p.pl10').text());
    $('#ip_div').text(ip);
})