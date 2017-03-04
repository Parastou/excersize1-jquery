alert("20")

//Variables for storing URL parameter values, if URL parameter values not given, the default 
// values will be used.
var matrix_size = 10;
var matrix_base = "decimal";

//Hashmap contains a map from base names to corresponding base value. Base value will is 
// used  in GenerateTableContent function to convert multiplication result regarding 
//the base.
var baseToNumber = {"hex":"16","decimal":"10","binary":"2"}


// Input: URL parameter name, Output: URL parameter value
// JQuery code snippet returns URL parameter value for the given URL parameter name from 
// current URL, parameters section is followed by '?' or '&' and different parameters can 
// be separated by '&' or '#'. like: http://www.xxx.yyy?param1='111'&param2='nnn'.
$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){ // if parameter name not found
    	return null; 
    }else{	
    	return results[1] || 0;
    	}
}

//Input: parameter names defined for this question, Output: boolean value indicates correctness of parameter values
// This function validates parameter values based on the constraints defined in the question 
// for both size and base. If these parameter values are out of range, function returns false and also 
// give appropriate error messages to the user. 
function ValidateParams(matrix_size, matrix_base) {
    var message = "";
    var isValid = true;
    if (matrix_size > 15 || matrix_size < 3){
		message = 'matrix_size is out of range, the determined range is between 3 and 15.';
		isValid = false;
		}
	if ( typeof(baseToNumber[matrix_base]) === "undefined"){ // it means the parameter name is not as expected.
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

//Input: a number, Output: boolean value, true: if it is a prime number, fasle: if it is 
// not a prime number
function IsPrime(n){

   // If n is less than 2 or not an integer then by definition cannot be prime.
   if (n < 2) {
   return false
   }
   if (n != Math.round(n)) {return false}

   // Now check every whole number from 2 to the square root of n. If any of these divides
   // n exactly, n cannot be prime.
   for (var i = 2; i <= Math.sqrt(n); i++) {
      if (n % i == 0) {return false}
   }

   // If n%i was never == 0 above, then n must be prime
   return true;

}

// This function generates final html table contents based on the given size and base value.
// The style of cells can be different, for example cells with prime numbers have different
//background color.
function GenerateTableContent(){

	output = "<center><table id='multiplicationTable' border='1px'>"; // open table element

	for (r = 0; r <= matrix_size; ++r) {
    	 output += "<tr style='height:40px'>"; // open row element

		// c starts with zero, since edges just show numbers participating in multiplications.
     	 for (c = 0; c <= matrix_size; ++c) { 
     	 
     	    var style = 'regular';
     	    var value = Number( c * r ).toString(baseToNumber[matrix_base]) 
     	    
     	    // tooltipValue is stored as title of the cell, later will be retrieved 
     	    // to display in cell's tooltip
     	    var tooltipValue = (c==0 || r==0) ? "" : r.toString() + "*" + c.toString();
     	    
        	if (c==0 || r==0 || c == r){ // bold font and blue color for edges and diameter
           		
           		//Values on edges are just showing numbers, diameter shows multiplication 
           		// when reach c + r  either r or c are zero, their sum equals to the c or r.
           		value =  Number((c * r) != 0 ?  c * r : c + r).toString(baseToNumber[matrix_base]);
           		
           		if (value == 0){ // just cell[0,0] has a zero value
              		value = "";
           		}				
				style = 'diameter';


			} else{
			
				if (c == 1 || r == 1){ // Prime values can just appear in edges.
				    if (IsPrime(c*r)) style = 'prime'; // color for prime
				}

        	}
        	
           	output += "<td title = '" + tooltipValue + "' class='" + style +"' >" 
           		   + value + "</td>"; // write columns        	
        	
        	
        	if (c == matrix_size)
            	break; // stop column generation when (n)th interval is reached
        	}
        	output += "</tr>"; // close row element
    }
	output += "</table></center>"; // close table element
	$(".output").html(output);
	$("table:eq(0)").fadeIn("slow");
	
}



//This function calls function: GenerateTableContent(), to generate table structure and content. 
//Then, adds event handler to mouse hover event to display tooltip.
function GenerateTable(){

	GenerateTableContent();
	
	$( '#multiplicationTable td[title]' ).hover( function(){
    
        //title of cells contain the multiplication factors
        var title = $(this).attr('title');  
        
        //For cells on edges, tooltip values are not shown. So, their corresponding cell titles
        // are empty string.
        if (title != ""){
        	var offset = $(this).offset();
        	$(this).data('tipText', title).removeAttr('title');
        	$('<p class="tooltip"></p>')
        		.text(title)
        		.appendTo('body')
        		.css({top:offset.top + 15, left:offset.left + 10}) // positions tooltip based on current cell
        		.fadeIn('slow');
        		}

    }, function() {
        var title = $(this).attr('title');
    	if (title != ""){
        	$(this).attr('title', $(this).data('tipText'));
        	$('.tooltip').remove();
        	}
    });
}

//URL parameter values will be set to variables if they are given, otherwise default 
//values will be used.
if ($.urlParam('matrix_size') != null){
 matrix_size = $.urlParam('matrix_size');
 }
if ($.urlParam('matrix_base') != null){
// When given value is a combination of lowercase and uppercase letters
 matrix_base = $.urlParam('matrix_base').toLowerCase(); 
 }
 
//If the given URL parameter values are valid according to question constraints, table will be generated.
//So, first ValidateParams(,) checks parameter values validity, if so, GenerateTable will be called.
if (ValidateParams(matrix_size, matrix_base) == true){
	GenerateTable();	
}








