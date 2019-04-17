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
        component.set("v.oldselect", myImage);
        let picture = myImage.querySelector('img');
        component.set("v.tempimage",picture.src);
	},
    
    
    loadPlaceholder: function(component, event, helper) {
        var tempimage = component.get("v.tempimage");
        component.set("v.placeholderimage",tempimage);
	},
    
    search: function(component, event, helper) {
        var input = event.currentTarget;
        var query = input.value;
        component.set("v.query", query);
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
        var docName = file.name;
        var docType = file.type;
        var typeMy = docType.slice(docType.indexOf('/')+1)
    		
            //Check if name match other names in documents
        var invalidname = false;
        var documents = component.get("v.documents");
        documents.forEach(function(item, index, array) {
            if (docName === item.Name) {
                invalidname = true;}
        });
        	          
        if (!invalidname) {
        //Function for convert file to base64 type
            var reader = new FileReader();
            var action = component.get("c.insertImages");
            reader.onloadend = function() {
    	        var body =  reader.result;
                var docBody = body.slice(body.indexOf(',')+1);
                action.setParams({"body": docBody, "name": docName, "type": typeMy});
                $A.enqueueAction(action);
	}
        reader.readAsDataURL(file);
            
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var documents = component.get("v.documents");
                documents.push(response.getReturnValue());
                component.set("v.documents", documents);
	        var query = component.get("v.query");
                if (query) {
                    var maindoc=[];
                    documents.forEach(function(item, index, array) {
           		if (item.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
  			    maindoc.push(item);
                }
	});
		component.set("v.maindoc", maindoc);  
                } else {
                  component.set("v.maindoc", documents);
                }
             } 
        });
        $A.enqueueAction(action);
        }    else (console.log('Name is match to another name'));
    }
    
})
