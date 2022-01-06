divs = document.querySelectorAll(".popout");
            for (div of divs) div.onmousedown = onMouseDown;
            
            document.onmousemove = onMouseMove;
            document.onmouseup   = onMouseUp;
            
            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight - 20;
            
            let the_moving_div = ''; 
            let the_last_mouse_position = { x:0, y:0 };
            
            
            function onMouseDown(e) {
                e.preventDefault();
                the_moving_div            = e.target.id;      // remember which div has been selected 
                the_last_mouse_position.x = e.clientX;        // remember where the mouse was when it was clicked
                the_last_mouse_position.y = e.clientY;
                e.target.style.border = "2px solid blue";     // highlight the border of the div
            
                var divs = document.getElementsByTagName("div");
                e.target.style.zIndex = divs.length;          // put this div  on top
                var i = 1; for (div of divs) if (div.id != the_moving_div) div.style.zIndex = i++;   // put all other divs behind the selected one
            }
            
            function onMouseMove(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                var d = document.getElementById(the_moving_div);
                d.style.left = d.offsetLeft + e.clientX - the_last_mouse_position.x + "px";     // move the div by however much the mouse moved
                d.style.top  = d.offsetTop  + e.clientY - the_last_mouse_position.y + "px";
                the_last_mouse_position.x = e.clientX;                                          // remember where the mouse is now
                the_last_mouse_position.y = e.clientY;
                drawConnectors();
            }
            
            function onMouseUp(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                document.getElementById(the_moving_div).style.border = "none";             // hide the border again
                the_moving_div = "";
            }