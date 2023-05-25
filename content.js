
    let url = window.location.href;
    
    console.log(url);
    
    document.getElementById("docs-titlebar-share-client-button").style.display="none";
    document.getElementById("docs-file-menu").style.display = "none";
    document.getElementById("docs-extensions-menu").style.display = "none";
    
    
    window.addEventListener("load", function(event) {
      document.getElementById("docs-titlebar-share-client-button").style.display="none";
      document.getElementById("docs-file-menu").style.display = "none";
      document.getElementById("docs-extensions-menu").style.display = "none";
      setInterval(checkpage, 1000);
    });

    function checkpage(){
        
      //document.getElementById("docs-titlebar-share-client-button").style.display="none";
      
      if (url.indexOf('spreadsheets') > 0){
          console.log('Spreadsheets');
          document.getElementById("docs-file-menu").style.display = "none";
          document.getElementById("docs-extensions-menu").style.display = "none";
          /** Delen in menu **/
          document.getElementById(":5x").style.display = "none";
          
          /** Uitbreidingen **/
          document.getElementById(":8s").style.display = "none";
          document.getElementById(":8t").style.display = "none";
          document.getElementById(":8v").style.display = "none";
          /** Spelling **/
          document.getElementById(":8v").style.display = "none";
          
      } else if (url.indexOf('document') > 0) {
         console.log('Documenten'); 
         document.getElementById("docs-file-menu").style.display = "none";
         document.getElementById("docs-extensions-menu").style.display = "none";
         /** Delen in menu **/ 
        document.getElementById(":6i").style.display = "none";
        document.getElementById(":6j").style.display = "none";
        document.getElementById(":6k").style.display = "none";
        document.getElementById(":9a").style.display = "none";
        document.getElementById(":9j").style.display = "none";
        document.getElementById(":9v").style.display = "none";
        document.getElementById(":9u").style.display = "none";
      } else if (url.search('presentation')){
          console.log('Presentations'); 
          document.getElementById("docs-file-menu").style.display = "none";
          document.getElementById("docs-extensions-menu").style.display = "none";
      }
      //document.getElementById("docs-extensions-menu").style.visibility = "hidden";
      //document.getElementsByClassName("docs-meet-in-editors-entrypoint-container").style.visibility = "hidden";
    }

