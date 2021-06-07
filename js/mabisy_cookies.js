// Tipos de cookies: Necesarias, Analiticas, Funcional, Publicidad

var cookieList = [
    { type: "Necesarias", name: "MABSession" },
    { type: "Necesarias", name: "MABCookieConfig" },
    { type: "Necesarias", name: "MABCookieRevision" },
    { type: 'Necesarias', name: 'ASP.NET_SessionId' },
    { type: 'Necesarias', name: '.ASPXAUTH' },
    { type: 'Necesarias', name: 'chkCookie' },
    { type: 'Necesarias', name: 'testCookie' },
    { type: 'Necesarias', name: '_dc_gtm_UA-xxxxxxxx' },
    { type: 'Necesarias', name: 'HideCustomPopup' },
    { type: 'Necesarias', name: 'HideNewsletter' },
    { type: 'Analiticas', name: 'VisitedProducts' },
    { type: 'Analiticas', name: 'MAButm' },
    { type: 'Analiticas', name: 'MAButmh' },
    { type: 'Analiticas', name: '_gid' },
    { type: 'Analiticas', name: '_ga' },
    { type: 'Analiticas', name: '_gat' },
    { type: 'Funcional', name: '__stripe_sid' },
    { type: 'Funcional', name: '__stripe_mid' },
    { type: 'Funcional', name: 'KievRPSSecAuth' },
    { type: 'Funcional', name: 'PPLState' },
    { type: 'Funcional', name: 'ipv6' },
    { type: 'Funcional', name: 'SRCHUSR' },
    { type: 'Funcional', name: 'WLS' },
    { type: 'Funcional', name: 'NAP' },
    { type: 'Funcional', name: '__zlcmid' },
    { type: 'Funcional', name: 'SRCHHPGUSR' },
    { type: 'Funcional', name: 'ABDEF' },
    { type: 'Publicidad', name: 'MUID' },
    { type: 'Publicidad', name: 'ANON' },
    { type: 'Publicidad', name: '_fbp' },
    { type: 'Publicidad', name: 'fr' },
    { type: 'Publicidad', name: 'IDE' },
    { type: 'Publicidad', name: 'test_cookie' },
    { type: 'Publicidad', name: '_uetsid' },
    { type: 'Publicidad', name: 'm' }
];

function SetCookie() {
    var CookieDate = new Date;
    CookieDate.setFullYear(CookieDate.getFullYear( ) + 1);
    //document.cookie = '{{Cookiename}}=true; path=/; expires=' + CookieDate.toGMTString( ) + ';SameSite=None;';
    document.getElementById('cookies').style.display = 'none';
}
function AcceptCookies() {
    SetCookie();
    setCookieConfig(false, true);
}
function RejectCookies() {        
    DeleteCookies(false);
    setCookieConfig(false, false);
    document.getElementById('cookies').style.display = 'none';
}
function ConfigCookies() {
    $('#modalCookiesConfig').modal('open');
}
function CookieNameDeletable(cookieName,viewChecks) {
    var eliminar = true;

    var cookie = cookieList.find(x => x.name.startsWith(cookieName));

    if (typeof cookie !== "undefined"){
        switch(cookie.type) {
            case "Necesarias": //Necesarias
                eliminar = false; break;
            case "Analiticas": //Analiticas
                eliminar = !viewChecks || !$('#chkCookiesAnaliticas').is(':checked'); break;
            case "Funcional": //Funcional
                eliminar = !viewChecks || !$('#chkCookiesFuncional').is(':checked'); break;
            case "Publicidad": //Publicidad
                eliminar = !viewChecks || !$('#chkCookiesPublicidad').is(':checked'); break;
            default: //otras no reconocidas
                eliminar = !viewChecks; break;
        }
    } else {
        sendCookieToClassify(cookieName);
    }
    return eliminar;
}
function DeleteCookies(viewChecks) {
    var cookies = document.cookie.split("; ");
    for(var i=0; i < cookies.length; i++) {
        var equals = cookies[i].indexOf("=");
        var name = (equals > -1 ? cookies[i].substr(0, equals) : cookies[i]) || '';
        var nametr = name.trim();
        if (CookieNameDeletable(nametr,viewChecks)) {
            var cookiestr = nametr + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = cookiestr;
            console.log('cookie ' + nametr + ' eliminada');
        } else {
            console.log('cookie ' + nametr + ' NO eliminada');
        }
    }
    
    document.getElementById('cookies').style.display = 'none';
}
function SaveConfigCookies() {
    DeleteCookies(true);
    document.getElementById('cookies').style.display = 'none';
    SetCookie();
    setCookieConfig(true, false);
    $('#modalCookiesConfig').modal('close');
}

function getCookiesConfig(){
    var configCookie = getCookie("MABCookieConfig");
    var cookies = JSON.parse(configCookie);

    console.log(cookies);
    if (cookies !== null){
        cookies.forEach(cookie => {
            switch(cookie.type) {
                case "Analiticas": //Analiticas
                    $('#chkCookiesAnaliticas').prop('checked', cookie.checked); break;
                case "Funcional": //Funcional
                    $('#chkCookiesFuncional').prop('checked', cookie.checked); break;
                case "Publicidad": //Publicidad
                    $('#chkCookiesPublicidad').prop('checked', cookie.checked); break;
                default: //otras no reconocidas
                break;
            }
        });
        DeleteCookies(true);
    }else{
        DeleteCookies(false);
        document.getElementById('cookies').style.display = null;
    }
}
function setCookieConfig(viewChecks, acceptAll) {
    var configCookie;
    if (viewChecks) {
        configCookie = [
            { type: 'Analiticas', checked: $('#chkCookiesAnaliticas').is(':checked') },
            { type: 'Funcional', checked: $('#chkCookiesFuncional').is(':checked') },
            { type: 'Publicidad', checked: $('#chkCookiesPublicidad').is(':checked') }
        ]
    } else {
        if (acceptAll){
            configCookie = [
                { type: 'Analiticas', checked: true },
                { type: 'Funcional', checked: true },
                { type: 'Publicidad', checked: true }
            ]
        }else{
            configCookie = [
                { type: 'Analiticas', checked: false },
                { type: 'Funcional', checked: false },
                { type: 'Publicidad', checked: false }
            ]
        }
    }

    var d = new Date();
    d.setTime(d.getTime() + (360 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "MABCookieConfig=" + JSON.stringify(configCookie) + ";" + expires + ";path=/;samesite";
    console.log(JSON.stringify(configCookie));
}
function getCookie(name) {
    function escape(s) {
        return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
    };
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function sendCookieToClassify(name){
    var cookies = getCookiesRevision();

    var cookie = cookies.find(x => x === name);

    if (typeof cookie === "undefined"){
        var ajax = $.post("/admin/handlers/cookiesregistro.ashx", { 
            cookie: name, domain: window.location.hostname
        },
            function (data) {
                var obj = jQuery.parseJSON(data);
                if (obj.status == "OK") {
                    putCookiesRevision(name);
    
                    console.log('ok');
                } else {
                    if(obj.message.includes("clave duplicado")){
                        putCookiesRevision(name);
                    }
                    //console.log(obj.message);
                }
            });
    }
}
function getCookiesRevision(){
    var configCookie = getCookie("MABCookieRevision");

    if(configCookie == null){configCookie = "[]"}
    return JSON.parse(configCookie);
}
function putCookiesRevision(name){
    var cookies = getCookiesRevision();

    cookies.push(name);
    var d = new Date();
    d.setTime(d.getTime() + (360 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "MABCookieRevision=" + JSON.stringify(cookies) + ";" + expires + ";path=/;samesite";
}