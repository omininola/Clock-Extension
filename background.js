chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Add / Remove Clock",
        id: "newClock",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        title: "Clocker Options",
        id: "optionsClock",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        if(tab.url.includes("chrome://")) return
        
        if(info.menuItemId == "newClock"){
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: addClock
            });
        };

        if(info.menuItemId == "optionsClock"){
            chrome.runtime.openOptionsPage();
        }
    }
)

chrome.action.onClicked.addListener(
    tab => {
        if(tab.url.includes("chrome://")) return
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: addClock
        });
    }
);

function addClock(){
    const clockElement = document.querySelector('my-clock');
   
    if(clockElement) {
        clockElement.remove();
        clearInterval(updateTime, 1000*60);
        return;
    }

    const body = document.body;
    
    const myClock = document.createElement('my-clock');
    body.appendChild(myClock);

    const shadow = myClock.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = `
    #clockFromClocker{
        padding: 4px;
        cursor: move;
        font-size: 32px;
        top: 0%;
        left: 0%;
        z-index: 9999999999;
        box-sizing: border-box;
        position: absolute;
        user-select: none;
        border: 2px solid;
        border-radius: 10px;
        opacity: 0.5;
        transition: opacity 200ms, transform 200ms;
        -webkit-box-shadow: 0px 0px 5px 2px;
        -moz-box-shadow: 0px 0px 5px 2px;
        box-shadow: 0px 0px 5px 2px;
    }
    
    #clockFromClocker:hover {
        opacity: 1;
    }
    `;

    const clock = document.createElement('div');
    clock.id = "clockFromClocker";

    chrome.storage.sync.get(["bgColorSync", "fontColorSync"])
    .then(result => {
        clock.style.color = result.fontColorSync;
        clock.style.backgroundColor = result.bgColorSync;
    });

    clock.addEventListener('mousedown', (e)=>{
        e.preventDefault();

        clock.style.transform = 'scale(1.2)';

        initialX = e.clientX;
        initialY = e.clientY;

        moveClock = true;
    });

    clock.addEventListener('mousemove', (e)=>{
        if(moveClock){
            e.preventDefault();

            let newX = e.clientX;
            let newY = e.clientY;

            clock.style.left = clock.offsetLeft - ( initialX - newX ) + "px";
            clock.style.top = clock.offsetTop - ( initialY - newY ) + "px";

            initialX = newX;
            initialY = newY;
        }
    });

    clock.addEventListener('mouseup', (stopMovement = (e) => {
        clock.style.transform = 'scale(1)';

        moveClock = false;
    }));

    clock.addEventListener('mouseleave', stopMovement);

    shadow.appendChild(style);
    shadow.appendChild(clock);

    function updateTime(){
        const newDate = new Date();
        let hours = newDate.getHours().toString();
        let mins = newDate.getMinutes().toString();
    
        if(hours.length < 2) hours = '0' + hours;
        if(mins.length < 2) mins = '0' + mins;
    
        clock.textContent = hours + ':' + mins;
    }

    updateTime();
    setInterval(updateTime, 1000*60);
}