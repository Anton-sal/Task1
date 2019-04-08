({
	doInit : function(component, event, helper) {
        var action = component.get("c.getImages");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.documents", response.getReturnValue());
                
                component.set("v.maindoc", response.getReturnValue());
            }
        });
       
        $A.enqueueAction(action);
      
	},
    
    selectImage : function(component, event, helper) {
        
        var oldselect = component.get("v.oldselect");
        if (oldselect) {
        oldselect.classList.remove("changeMe");
        }
        var myImage = event.currentTarget;
    	myImage.classList.add("changeMe");
        console.log(typeof(myImage));
        
        component.set("v.oldselect", myImage);
        let picture = myImage.querySelector('img');
        
       	
        component.set("v.tempimage",picture.src);
	},
    
    
    loadPlaceholder: function(component, event, helper) {
        var tempimage = component.get("v.tempimage");
        component.set("v.placeholderimage",tempimage);
        
        var asor = component.get("v.documents");
      
	},
    
    search: function(component, event, helper) {
        var input = event.currentTarget;
        var query = input.value;
        var baseDoc = component.get("v.documents");
        
        var maindoc=[];
        
       
        baseDoc.forEach(function(item, index, array) {
            if (item.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
  			maindoc.push(item);
                }
	});
		component.set("v.maindoc", maindoc);        
        
    },
    
    download: function(component, event, helper) {
        
        var file = event.currentTarget.files[0];
        console.log(file.type);
        //---------------------------------------------------------------------------------------
        //



        //---------------------------------------------------------------------------------------
        
        //var newdoc = component.get("v.image");  // create document object
        	
        	var documents = component.get("v.documents");
        	var newdoc = documents[0];
        	newdoc.Name = file.name;
        	newdoc.FolderId =  '00l0o000002apMFAAY';
        newdoc.Id = null;
       
            //Function for convert base64 to Blob type
                    
        //Function for convert file to base type
        	var reader = new FileReader();
  			reader.onloadend = function() {
    			var body =  reader.result;
                //console.log(body);
                var body1 = body.slice(body.indexOf(',')+1);
                
                //Example convert base64 to Blob
                function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
    
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


var contentType = 'image/png';
                var blob2 = b64toBlob(body1, contentType);
				
               // console.log(body1);
               // console.log(body);
               // 
               // 
               // First example for convert base64=>blob
             /*   function base64toBlob(base64Data, contentType) {
  				contentType = contentType || '';
  				var sliceSize = 1024;
  				var byteCharacters = atob(base64Data);
  				var bytesLength = byteCharacters.length;
  				var slicesCount = Math.ceil(bytesLength / sliceSize);
  				var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    		var begin = sliceIndex * sliceSize;
    		var end = Math.min(begin + sliceSize, bytesLength);

    		var bytes = new Array(end - begin);
    		for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
      		bytes[i] = byteCharacters[offset].charCodeAt(0);
    		}
    		byteArrays[sliceIndex] = new Uint8Array(bytes);
  			}
  			return new Blob(byteArrays, { type: contentType });
} 
              var contentType = 'image/png';
              var myBlob = base64toBlob(body1, contentType);  */
                
                //Second example convert base64=>Blob
                //
                //var byteCharacters = atob(body1);
                //var byteNumbers = new Array(byteCharacters.length);
				//	for (var i = 0; i < byteCharacters.length; i++) {
    			//		byteNumbers[i] = byteCharacters.charCodeAt(i);
				//	}
                
               //  var byteArray = new Uint8Array(byteNumbers);
              //  var contentType = 'image/png';
              //  var blob = new Blob(byteArray, {type: contentType});
              //  console.log(blob);
                
                //////////////////////////////////////////////
               	
                
                newdoc.Body = blob2;
            }
  			reader.readAsDataURL(file);
        
        
        
        	console.log(newdoc.Name);
            //upload image to saleforce data
        var action = component.get("c.insertImages");
        action.setParams({"newdoc": newdoc});
        
        action.setCallback (this, function(response) {
                var state = response.getState();
            	console.log(state);
                if (state === "SUCCESS") {
                	console.log('Apex run');
                    console.log(response.getReturnValue().Id)
                }
            })
            
         $A.enqueueAction(action);
            
           
    
       // var newDoc = component.get("v.documents");
        //newDoc.push(files[0]);
        
       // component.set("v.documents", newDoc);             
        
    }
    
})
