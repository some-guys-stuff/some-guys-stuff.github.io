
async function go()
{
    const screenCanvas = document.getElementById('screen');
    if (!(screenCanvas instanceof HTMLCanvasElement))
    {
        throw new Error('Required elements missing from screen.');
    }

    const ctx = screenCanvas.getContext('2d');
    if (ctx === null)
    {
        throw new Error('Screen context could not be retrieved.');
    }

    const framesPerSecond = 30;

    const blockWidth = 30;
    const blockHeight = 30;

    const pcState = 
    {
        fillStyle: 'black',
        width: blockWidth,
        height: blockHeight,
        x: 0,
        y: 0
    };

    const drawBG = () =>
    {
        let fillStyleBefore = ctx.fillStyle;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height)
        
        ctx.fillStyle = 'black';
        ctx.fillText(`frameNumber: ${frame}`, 5, 15)

        ctx.fillStyle = fillStyleBefore;
    }

    const drawPC = () =>
    {
        let fillStyleBefore = ctx.fillStyle;
        ctx.fillStyle = pcState.fillStyle;
        ctx.fillRect(pcState.x, pcState.y, pcState.width, pcState.height)
        ctx.fillStyle = fillStyleBefore;
    }

    screenCanvas.addEventListener('keydown', (keyboardEvent) =>
    {
        switch (keyboardEvent.code)
        {
            case 'KeyR':
                pcState.fillStyle = 'red';
                break;
            case 'KeyG':
                pcState.fillStyle = 'green';
                break;
            case 'KeyB':
                pcState.fillStyle = 'blue';
                break;
            case 'KeyY':
                pcState.fillStyle = 'yellow';
                break;
            case 'KeyK':
                pcState.fillStyle = 'black';
                break;
            case 'ArrowLeft':
                pcState.x = clamp(pcState.x - blockWidth, 0, screenCanvas.width - pcState.width);
                break;
            case 'ArrowRight':
                pcState.x = clamp(pcState.x + blockWidth, 0, screenCanvas.width - pcState.width);
                break;
            case 'ArrowDown':
                pcState.y = clamp(pcState.y + blockHeight, 0, screenCanvas.height - pcState.height);
                break;
        }
    });

    const millisecondsPerSecond = 1000;
    const startMilliseconds = Date.now();
    let frame = 0;

    const processFrames = () =>
    {
        const targetFrameNumber =
            Math.floor(((Date.now() - startMilliseconds) / millisecondsPerSecond) * framesPerSecond);

        while (frame < targetFrameNumber)
        {
            frame++;

            if (frame % framesPerSecond === 0) 
            {
                pcState.y = clamp(pcState.y + blockHeight, 0, screenCanvas.height - pcState.height);
            }

            drawBG();
            drawPC();
        }

        const nextFrameTimeoutMilliseconds = millisecondsPerSecond / framesPerSecond;
        setInterval(processFrames, nextFrameTimeoutMilliseconds);
    }

    processFrames();

    screenCanvas.focus();
}

/**
 * @param {number} number 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function clamp(number, min, max)
{
    if (number < min)
    {
        return min;
    }
    
    if (number > max)
    {
        return max;
    }

    return number;
}

/**
 * @param {number} start 
 * @param {number} stop 
 * @param {number} [step=1] 
 * @returns {Generator<number>}
 */
function* range(start, stop, step = 1)
{
    for (let i = start; i < stop; i = i + step)
    {
        yield i;
    }
}

go();
