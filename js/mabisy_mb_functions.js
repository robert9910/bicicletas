//http://blog.michaelckennedy.net/2012/10/11/preventing-javascript-files-from-loading-multiple-times/

mabisy = {};
mabisy.products = mabisy.products || {};
mabisy.products.debugMode = false;

/* comprobacion de si este fichero ya se cargó en navegador */
mabisy.isFirstLoad = function(namesp, jsFile) {
    var isFirst = namesp.firstLoad === undefined;
    namesp.firstLoad = false;
    
    if (!isFirst) {
        console.log("Warning: Javascript file is included twice: " + jsFile);
    }

    return isFirst;
};

/* para obtener parámetros de url */
mabisy.getUrlParameter = function(sParam,defaultValue) {
	try {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	} catch (err) {
        console.log("Error: " + err.message);
	}
	return defaultValue;
}   

mabisy.products.getProductsListUrlAjax = function(productListObj){
	return mabisy.products.getProductsUrlAjax(productListObj.data('currentpage'),productListObj.data('sizepage'),productListObj.data('ordertype'),productListObj.data('categoryid'),productListObj.data('familyid'),productListObj.data('markid'),productListObj.data('colorid'),productListObj.data('sizeid'),productListObj.data('amountrangeid'),productListObj.data('minprice'),productListObj.data('maxprice'),productListObj.data('feat'),productListObj.data('new'),productListObj.data('offered'),productListObj.data('language'),productListObj.data('attributes'),productListObj.data('modelid'),productListObj.data('currencyid'));
}

/* generador de url para obtener productos en json */
mabisy.products.getProductsUrlAjax = function(p,nit,ot,cat,fam,man,co,si,rp,minp,maxp,feat,nw,off,lng,attrs,mdl,crr){
	var urlAjax = '/handlers/products.ashx?item=productlist';
	if (cat){if (cat != 0){ urlAjax += '&cat=' + cat; }}
	if (fam){if (fam != 0){ urlAjax += '&fam=' + fam; }}
	if (man){if (man != 0){ urlAjax += '&man=' + man; }}
	if (co){if (co != 0){ urlAjax += '&co=' + co; }}
	if (si){if (si != 0){ urlAjax += '&si=' + si; }}
	if (mdl){if (mdl != 0){ urlAjax += '&mdl=' + mdl; }}
	if ((minp && maxp) && (minp != maxp && maxp > 0)) {
		urlAjax += '&pmin=' + minp;
		urlAjax += '&pmax=' + maxp;
	} else {
		if (rp){if (rp > 0){ urlAjax += '&rp=' + rp; }}
	}
	if (p){if (p > 1){ urlAjax += '&p=' + p; }}
	if (nit){if (nit > 0){ urlAjax += '&nit=' + nit; }}
	if (ot){if (ot > 0){ urlAjax += '&ot=' + ot; }}
	if (feat){if (feat > 0){ urlAjax += '&feat=' + feat; }}
	if (nw){if (nw > 0){ urlAjax += '&new=' + nw; }}
	if (off){if (off > 0){ urlAjax += '&off=' + off; }}
	if (lng){if (lng != ''){ urlAjax += '&lng=' + lng; }}
	if (attrs){if (attrs != ''){ urlAjax += '&attrs=' + attrs; }}
	if (crr){if (crr > 0){ urlAjax += '&crr=' + crr; }}
	return urlAjax;
}

/* funcion para inicializar listado de productos */
mabisy.products.initProductsListAjaxParams = function(productListObj,options){
	productListObj.addClass('mb-mod-product-list-ajax');
	productListObj.data('moduleid',options.moduleid);
	productListObj.data('language',options.language);
	productListObj.data('categoryid',options.categoryId);
	productListObj.data('familyid',options.familyId);
	productListObj.data('markid',options.markId);
	productListObj.data('colorid',options.colorId);
	productListObj.data('sizeid',options.sizeId);
	productListObj.data('amountrangeid',options.amountRangeId);
	productListObj.data('attributes',options.attributes);
	productListObj.data('minprice',options.minPrice);
	productListObj.data('maxprice',options.maxPrice);
	productListObj.data('sizepage',options.sizePage);
	productListObj.data('numpages',options.numPages);
	productListObj.data('currentpage',options.currentPage);
	productListObj.data('ordertype',options.orderType);
	productListObj.data('itemselector',options.itemSelector);
	productListObj.data('modelid',options.modelId);
	productListObj.data('currencyid',options.currencyId);
	
	
	productListObj.data('feat',options.feat);
	productListObj.data('new',options.nw);
	productListObj.data('offered',options.off);
	
	productListObj.data('fngetitem',options.fnGetItem);
	
	productListObj.data('cssclass',productListObj.find(options.itemSelector).first().attr("class"));
	
	productListObj.getProductsListUrlAjax = mabisy.products.getProductsListUrlAjax(productListObj);
	
	var strDivNotFound = '<div class="notfound" id="div-notfound-'+productListObj.data('moduleid')+'" style="display:none;">';
	strDivNotFound += '<div class="mb-mensaje alerta">';
	strDivNotFound += '<span class="title"><span class="mb-ico ico-lerta"></span> '+options.txtNoProductsFound+'</span>';
	strDivNotFound += '</div>';
	strDivNotFound += '</div>';
	if (productListObj.siblings('.buttons.bottom').length > 0 ) {
		productListObj.siblings('.buttons.bottom').prepend($(strDivNotFound));
	} else {
		productListObj.after($(strDivNotFound));
	}
	
	var strDivLoadingUpper = '<div class="loading" id="div-loadajax-upper-'+productListObj.data('moduleid')+'" style="display:none;">';
	strDivLoadingUpper += '<div id="span-loadajax-upper-'+productListObj.data('moduleid')+'" class="mb-mensaje info" style="display:none;">';
	strDivLoadingUpper += '<span class="title"><span class="mb-ico ico-spinner-spin"></span> '+options.txtLoading+'</span>';
	strDivLoadingUpper += '</div>';
	if (productListObj.siblings('.buttons.top').length > 0 ) {
		productListObj.siblings('.buttons.top').append($(strDivLoadingUpper));
	} else {
		productListObj.before($(strDivLoadingUpper));
	}
	
	var strDivLoading = '<div class="loading" id="div-loadajax-'+productListObj.data('moduleid')+'">';
	strDivLoading += '<div id="span-loadajax-'+productListObj.data('moduleid')+'" class="mb-mensaje info" style="display:none;">';
	strDivLoading += '<span class="title"><span class="mb-ico ico-spinner-spin"></span> '+options.txtLoading+'</span>';
	strDivLoading += '</div>';
	strDivLoading += '<span class="buttons">';
	strDivLoading += '<button id="btn-loadajax-'+productListObj.data('moduleid')+'" class="btn-loading" onclick="'+options.btnOnClick+'">'+options.txtViewmore+'</button>';
	strDivLoading += '</span>';
	strDivLoading += '</div>';
	if (productListObj.siblings('.buttons.bottom').length > 0 ) {
		productListObj.siblings('.buttons.bottom').prepend($(strDivLoading));
	} else {
		productListObj.after($(strDivLoading));
	}
	
	productListObj.data('divNotFound','#div-notfound-'+productListObj.data('moduleid'));
	productListObj.data('divLoadajaxUpper','#div-loadajax-upper-'+productListObj.data('moduleid'));
	productListObj.data('spanLoadajaxUpper','#span-loadajax-upper-'+productListObj.data('moduleid'));
	productListObj.data('divLoadajax','#div-loadajax-'+productListObj.data('moduleid'));
	productListObj.data('spanLoadajax','#span-loadajax-'+productListObj.data('moduleid'));
	productListObj.data('btnLoadajax','#btn-loadajax-'+productListObj.data('moduleid'));
	
	if (productListObj.data('currentpage') >= productListObj.data('numpages')) {
		$(productListObj.data('btnLoadajax')).hide();
	}
	
	productListObj.data('loadProductsListAjaxResponse',function (productListObj,cssclass,clearbefore,fnGetItem,functionDone){
		return function (data,status,xhr) {
			try {
				//try{ga('send', 'event', 'Filtros', 'Carga mas producto', 'Mas producto', data.N_items);}catch(err){console.log(err);} 
				console.log('Items found: '+ data.N_items);
				if (productListObj.find(productListObj.data('itemselector')).length > 0) {
					cssclass = productListObj.find(productListObj.data('itemselector')).first().attr("class");
				}
				
				var htmlItems = "";
				var htmlCurrentItem = "";
				/*for (i = 0; i < data.N_items; i++) { 
					htmlCurrentItem = "";
					htmlCurrentItem = fnGetItem(data.Items[i],cssclass); 
					htmlItems = htmlItems + htmlCurrentItem; 
					//htmlItems += fnGetItem(data.Items[i],cssclass); 
				}	*/		
				var i = 0;
				while (i< data.N_items) {
					htmlCurrentItem = "";
					htmlCurrentItem = fnGetItem(data.Items[i],cssclass); 
					htmlItems = htmlItems + htmlCurrentItem; 
					i++;
				}
				
				if (clearbefore) { productListObj.find(productListObj.data('itemselector')).remove(); }
				
				productListObj.append(htmlItems);
				$(window).trigger('resize');
				
				//try{ga('send', 'event', 'Filtros', 'Mas producto cargado', 'Mas producto', data.N_items);}catch(err){console.log(err);}
											
				//$(productListObj.data('btnLoadajax')).button('reset');
				//$(productListObj.data('spanLoadajax')).slideUp(function(){$(productListObj.data('divLoadajax')).hide();});
				$(productListObj.data('spanLoadajax')).slideUp();
				$(productListObj.data('spanLoadajaxUpper')).slideUp(function(){$(productListObj.data('divLoadajaxUpper')).hide();});
				
				//try{ga('send', 'event', 'Filtros', 'Oculta capa cargando', 'Cargado');}catch(err){console.log(err);} 
				
				if (data.N_items <= 0 && data.Page <= 1) { 
					$(productListObj.data('divNotFound')).show();
				} else {
					$(productListObj.data('divNotFound')).hide();
				}
				//$(productListObj.data('divNotFound')).appendTo(productListObj);
				
				if (data.Page >= data.N_Pages) { 
					$(productListObj.data('btnLoadajax')).hide();
					if (data.N_Pages > 1) {
						//try{ga('send', 'event', 'Filtros', 'Ultima pagina cargada', 'Ultima pagina');}catch(err){console.log(err);} 
					}
				} else {
					$(productListObj.data('btnLoadajax')).show();
				}
				//$(productListObj.data('divLoadajax')).appendTo(productListObj);
				
				productListObj.data('currentpage',data.Page);
				
				productListObj.siblings().find('.mb-pagination').hide();
				productListObj.siblings().find('.counter-stats').find('.pageitems').text((clearbefore ? data.N_items : parseInt(productListObj.siblings().find('.counter-stats').find('.pageitems').text()) + data.N_items));
				productListObj.siblings().find('.counter-stats').find('.totalitems').text(data.N_total_items);
				
				$(window).trigger('resize');
				setTimeout(function() {
					functionDone();
				}, 1500);
			
			} catch(err) {
				//$(productListObj.data('spanLoadajax')).slideUp(function(){$(window).trigger('resize');});
				//$(productListObj.data('spanLoadajaxUpper')).slideUp(function(){$(window).trigger('resize');});
				//$(productListObj.data('btnLoadajax')).button('error');
				//try{ga('send', 'event', 'Filtros', 'Error carga producto', 'Error carga', xhr.status );}catch(err){console.log(err);} 
				alert('Error: ' + xhr.statusText + ' (' + xhr.status + ')');
				console.log('Error: ' + xhr.statusText + ' (' + xhr.status + ')');
				
				$(window).trigger('resize');
				setTimeout(function() {
					//$(productListObj.data('btnLoadajax')).button('reset');
				}, 1500);
			}
		}
	});
	
	productListObj.on('loadProductsList',function(event,clearbefore,page,functionDone){
		if (clearbefore === undefined) {clearbefore = false}
		//try{ga('send', 'event', 'Filtros', 'Pulsa Ver mas', 'Ver mas',$(this).data('currentpage'));}catch(err){console.log(err);} 
		$(this).data('currentpage',page);
		$(this).data('cssclass',$(this).find($(this).data('itemselector')).first().attr("class"));
		
		//$($(this).data('btnLoadajax')).button('loading');
		$($(this).data('divLoadajax')).css('display','');
		$($(this).data('spanLoadajax')).slideDown();
		$($(this).data('divLoadajaxUpper')).css('display','');
		$($(this).data('spanLoadajaxUpper')).slideDown();
		//try{ga('send', 'event', 'Filtros', 'Muestra capa cargando', 'Cargando');}catch(err){console.log(err);} 
		
		var urlA = mabisy.products.getProductsListUrlAjax($(this));			
		
		console.log(urlA);
		
		var fnAjaxError = function(productListObj) {
			return function (xhr,status,error) {
				if(xhr.readyState == 0 || xhr.status == 0) {
					$($(productListObj).data('spanLoadajax')).slideUp(function(){$($(productListObj).data('divLoadajax')).hide();});
					$($(productListObj).data('spanLoadajaxUpper')).slideUp(function(){$($(productListObj).data('divLoadajaxUpper')).hide();});
					//$($(productListObj).data('btnLoadajax')).button('reset');
					//try{ga('send', 'event', 'Filtros', 'Oculta capa cargando', 'Cargado');}catch(err){console.log(err);} 
					return;  // it's not really an error
				} else {
					$($(productListObj).data('spanLoadajax')).slideUp(function(){$($(productListObj).data('divLoadajax')).hide();});
					$($(productListObj).data('spanLoadajaxUpper')).slideUp(function(){$($(productListObj).data('divLoadajaxUpper')).hide();});
					//$($(productListObj).data('btnLoadajax')).button('error');
					//try{ga('send', 'event', 'Filtros', 'Oculta capa cargando', 'Cargado', xhr.status );}catch(err){console.log(err);} 
					alert('Error: ' + xhr.statusText + ' (' + xhr.status + ')');
					console.log('Error: ' + xhr.statusText + ' (' + xhr.status + ')');
					
					$(window).trigger('resize');
					setTimeout(function() {
						//$($(productListObj).data('btnLoadajax')).button('reset');
					}, 1500);
					return;
				}
			}
		}
			
		/*var ajax = $.get(urlA, $(this).data('loadProductsListAjaxResponse')($(this),$(this).data('cssclass'),clearbefore,$(this).data('fngetitem'),functionDone));
		ajax.error(fnAjaxError(this));*/
		
		var ajaxReq = $.ajax({
			type: 'GET',
			url: urlA,
			beforeSend : function() { if(ajaxReq != null) { /*alert('abort');*/ ajaxReq.abort(); } },
			success: $(this).data('loadProductsListAjaxResponse')($(this),$(this).data('cssclass'),clearbefore,$(this).data('fngetitem'),functionDone),
			error: fnAjaxError(this)
		});
		
	});
}

$(document).ready(function () {
    if (!mabisy.isFirstLoad(mabisy.products, "mabisy_mb_functions.js")) {
        return;
    }

    //events
});
