
var matrix_size = 10;
var matrix_base = "decimal";

var baseToNumber = {"hex":"16","decimal":"10","binary":"2"}

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
    	return null;
    }else{	
    	return results[1] || 0;
    	}
}



$.validateParams = function(matrix_size, matrix_base) {
    var message = "";
    var isValid = true;
    if (matrix_size > 15 || matrix_size < 3){
		message = 'matrix_size is out of range, the determined range is between 3 and 15.';
		isValid = false;
		}
	if ( typeof(baseToNumber[matrix_base]) === "undefined"){
	    message = message + 'matrix_base is not in the range, the determined set is {"hex","decimal","binary"}.';
		isValid = false;	    
	}
	if (!isValid){
      $(".errors").html(message);
      $(".errors").show();	
	}else {
      $(".errors").hide();
    }
    return isValid;
}

$(function () {
    $(".test").bind("mouseenter", function (e) {
        $("#ToolTipDIv").offset({ left: e.pageX, top: e.pageY });
        $("#ToolTipDIv").show('normal');
    });
    $(".test").bind("mouseleave", function (e) {
        $("#ToolTipDIv").hide(); //Note I removed 'slow'
    });
});



GenerateTable = function(){
	output = "<center><table id='multiplicationTable' border='1px'>"; // open table element

	for (r = 0; r <= matrix_size; ++r) {
    	 output += "<tr style='height:40px'>"; // open row element

     	 for (c = 0; c <= matrix_size; ++c) {
     	    var tooltipValue = (c==0 || r==0) ? "" : r.toString() + "*" + c.toString();
        	if (c==0 || r==0 || c == r){
           		value =  Number((c * r) != 0 ?  c * r : c + r).toString(baseToNumber[matrix_base]);
           		if (value == 0){
              		value = "";
           		}

           		output += "<td title = '" + tooltipValue + "' style='width:40px' bgcolor='#2ECCFA' ><center>  <font size='4' ><b> " + value + "</b></center></font></td>"; // write columns
			} else{
           		output += "<td title = '" + tooltipValue + "' style='width:40px'  ><center> <font size='4'><b>" + Number( c * r ).toString(baseToNumber[matrix_base]) + "</center></font></td>"; // write columns
        	}
        	if (c == matrix_size)
            	break; // stop column generation when (n)th interval is reached
        	}
        	output += "</tr>"; // close row element
    }
	output += "</table></center>"; // close table element
	$(".output").html(output);
	$("table:eq(0)").fadeIn("slow");
}


if ($.urlParam('matrix_size') != null){
 matrix_size = $.urlParam('matrix_size');
 }
if ($.urlParam('matrix_base') != null){
 matrix_base = $.urlParam('matrix_base');
 }
 


function showTooltip(tooltipVal) {
    // insert code here to position your tooltip element (which i'll call $tip)
    $tip.html($el.attr('title'));
}
function hideTooltip() {
    $tip.hide();
} 

if ($.validateParams(matrix_size, matrix_base) == true){
	GenerateTable();
	$('#multiplicationTable td[title]')
    .hover(function(event) {
    
        var title = $(this).attr('title');
        if (title != ""){
        	var height = $(this).attr('height');
        	var width = $(this).attr('width');
        	var offset = $(this).offset();
        	$(this).data('tipText', title).removeAttr('title');
        	$('<p class="tooltip"></p>')
        		.text(title)
        		.appendTo('body')
        		.css({top:offset.top + 15, left:offset.left + 10})
        		.fadeIn('slow');
        		}

    }, function() {
        var title = $(this).attr('title');
    	if (title != ""){
        	$(this).attr('title', $(this).data('tipText'));
        	$('.tooltip').remove();
        	}
    })
;
}







