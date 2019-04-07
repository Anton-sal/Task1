({
	doInit : function(component, event, helper) {
        var action = component.get("c.getImages");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.documents", response.getReturnValue());
                console.log('data is load in component');
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
        
        //var newdoc = component.get("v.image");  // create document object
        	var newdoc = { 'sobjectType': 'Document'};
        	newdoc.Name = file.name;
        	newdoc.FolderId =  '00l0o000002apMFAAY';
       
            //Convert new File to base64 type
        	var reader = new FileReader();
  			reader.onloadend = function() {
    			var body =  reader.result;
                console.log(body);
                newdoc.Body = body;
  			}
  			reader.readAsDataURL(file);
        	
            //upload image to saleforce data
        var action = component.get("c.insertImages");
        action.setParams("newdoc", newdoc);
        action.setCallback (this, function(response) {
                var state = response.getState();
                if (state === "SUCCES") {
                component.set("v.image", response.getReturnValue());
                }
            })
            
         
            
           
    
       // var newDoc = component.get("v.documents");
        //newDoc.push(files[0]);
        
       // component.set("v.documents", newDoc);             
        
    }
    
})