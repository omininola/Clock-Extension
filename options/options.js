const fontColor = document.querySelector('#font');
const bgColor = document.querySelector('#background');

const clock = document.querySelector('.preview');

chrome.storage.sync.get(["fontColorSync", "bgColorSync"])
.then(result => {
    fontColor.value = result.fontColorSync || "#cccccc";
    clock.style.color = result.fontColorSync;

    bgColor.value = result.bgColorSync || "#111111";
    clock.style.backgroundColor = result.bgColorSync;
});

fontColor.addEventListener('change', ()=>{
    const value = fontColor.value;
    clock.style.color = value;

    chrome.storage.sync.set({ fontColorSync: value })
})

bgColor.addEventListener('change', ()=>{
    const value = bgColor.value;
    clock.style.backgroundColor = value;
    
    chrome.storage.sync.set({ bgColorSync: value })
})