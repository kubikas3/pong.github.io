class Input
{
    static getKey(key)
    {
        return Input._newState.keys.includes(key);
    }
    
    static getKeyDown(key)
    {
        return Input._newState.keys.includes(key) && !Input._oldState.keys.includes(key);
    }
    
    static getKeyUp(key)
    {
        return !Input._newState.keys.includes(key) && Input._oldState.keys.includes(key);
    }
    
    static get touchCount()
    {
        return (Input._newState.touches.length > Input._oldState.touches.length) ? Input._newState.touches.length : Input._oldState.touches.length;
    }
    
    static getTouch(index)
    {
        var touch = null;
        
        if (index < Input._newState.touches.length)
        {
            touch =
            {
                position: new Vector2((Input._newState.touches[index].clientX - canvas.offsetLeft) * devicePixelRatio, (Input._newState.touches[index].clientY - canvas.offsetTop) * devicePixelRatio)
            };
            touch.prevPosition = touch.position.clone();
            
            if (index < Input._oldState.touches.length)
            {
                touch.prevPosition = new Vector2((Input._oldState.touches[index].clientX - canvas.offsetLeft) * devicePixelRatio, (Input._oldState.touches[index].clientY - canvas.offsetTop) * devicePixelRatio);
            }
        }
        
        else if (index < Input._oldState.touches.length)
        {
            touch =
            {
                position: new Vector2((Input._oldState.touches[index].clientX - canvas.offsetLeft) * devicePixelRatio, (Input._oldState.touches[index].clientY - canvas.offsetTop) * devicePixelRatio),
                prevPosition: new Vector2((Input._oldState.touches[index].clientX - canvas.offsetLeft) * devicePixelRatio, (Input._oldState.touches[index].clientY - canvas.offsetTop) * devicePixelRatio)
            };
        }
        
        if (Input._newState.touches[index] && !Input._oldState.touches[index])
            touch.phase = "began";
        
        else if (!Input._newState.touches[index] && Input._oldState.touches[index])
            touch.phase = "ended";
        
        else if (Input._newState.touches[index] && Input._oldState.touches[index])
            touch.phase = "stationary";
        
        return touch;
    }
}

Input.mousePosition = Vector2.zero;
Input._newState = 
{
    keys: [],
    touches: []
};
Input._oldState = 
{
    keys: [],
    touches: []
};
Input._keys = [];
Input._touches = [];

onkeydown = function(e)
{
    if (!Input._keys.includes(e.code))
        Input._keys.push(e.code);
}

onkeyup = function(e)
{
    if (Input._keys.includes(e.code))
        Input._keys.splice(Input._keys.indexOf(e.code), 1);
}

onmousemove = function(e)
{
    Input.mousePosition = new Vector2(e.clientX * devicePixelRatio, e.clientY * devicePixelRatio);
}

ontouchstart = function(e)
{
    Input._touches = e.touches;
}

ontouchend = function(e)
{
    Input._touches = e.touches;
    
    // var doc = window.document;
    // var docEl = doc.documentElement;
    // var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    
    // if(requestFullScreen && !doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
    // {
    //     requestFullScreen.call(docEl);
    //     // screen.orientation.lock("portrait");
    // }
}

ontouchcancel = function(e)
{
    Input._touches = e.touches;
}

ontouchmove = function(e)
{
    Input._touches = e.touches;
}