
// Sounds reference
var greenSound = new Audio('./assets/sound/green.mp3');
var redSound = new Audio('./assets/sound/red.mp3');
var yellowSound = new Audio('./assets/sound/yellow.mp3');
var blueSound = new Audio('./assets/sound/blue.mp3');
var wrongSound = new Audio('./assets/sound/wrong.mp3');

// Game variables
var colorBoxesArray = ["green","red","yellow","blue"];
var hasStarted = false;
var currentLevel = 1;
var currentOrder = [];
var orderPointer = 0; // Which position in the order is the player currently at?
var isRight = true; // Did the player click the correct box?

function main()
{
    orderPointer = 0;
    generateOrder();
    playOrder();
    console.log("Expected clicks in order: "+currentOrder);
    console.log("Next expected click: "+currentOrder[orderPointer]);
}

function init()
{
    $(".box").click(function (e) { 

        var thisBox = $(this);
        verifyInput(thisBox.attr("id"));
        playSound(thisBox.attr("id"));
        pressedAnimation(thisBox);
        processInput();


    });
    $(document).one("keydown", function (e) {
        if(e.keyCode === 32)
        {
            hasStarted = true;
            $("h1").html("Level: <span class=\"highlight\">"+currentLevel+"</span>");
            main();
        }
    });
}

function generateOrder()
{
    currentOrder.push(colorBoxesArray[generateNumber()]);// Fills an array with strings pulled from a predetermined array using a random number generator
}

function generateNumber()
{
    return newNumber = Math.floor(Math.random()*4);// Generates a number between 0 and 4
}

function verifyInput(objectID)
{
    if(objectID!=currentOrder[orderPointer]) // If the ID is not the corrent ID
    {
        isRight= false;
    }
    else
    {
        isRight = true;
    }
}

function processInput()
{
    if(isRight)//Correct input
    {
        if(orderPointer==(currentOrder.length-1))// Finished sequence
        {
            currentLevel++;// Next Level
            $("h1").html("Level: <span class=\"highlight\">"+currentLevel+"</span>");
            main();
        }
        else
        {
            orderPointer++;//Next part of the sequence
        }
    }
    else // Lost the game
    {
        currentOrder = []; // Resets the order
        $(".box").addClass("disabled");
        $("h1").html("You lost at <span class=\"lost\">Level: "+currentLevel+"</span>! Press <span class=\"highlight\">Space</span> to start again!");
        $(document).one("keydown", function (e) {
            if(e.keyCode === 32)
            {
                currentLevel=1; // Resets current level
                orderPointer = 0; // Resets the order pointers
                $("h1").html("Level: <span class=\"highlight\">"+currentLevel+"</span>");
                $(".box").removeClass("disabled");
                main();
            }
        });
    }
}

async function playOrder() // Plays the sounds of the current order
{
    $(".box").addClass("disabled");
    await new Promise(r => setTimeout(r, 1000));
    console.log("At async");
    for(var i=0; i<currentOrder.length; i++)// Plays each sound in order
    {
        console.log("Playing animation");
        var totalAnimationLength = 500+currentLevel*300;// linear progression of .5secs as base plus .3 seconds for every element
        isRight= true; // Make sure it doesn't play the wrong sound/animation
        playSound(currentOrder[i]);// Play the corresponding sound
        pressedAnimation($("."+currentOrder[i]));// Animate the corresponding button
        await new Promise(r => setTimeout(r, totalAnimationLength/currentLevel));
    }
    $(".box").removeClass("disabled");
}


function playSound(objectID)
{
    if(isRight)
    {
        switch (objectID) {
            case "green":
                greenSound.currentTime = 0;
                greenSound.play();
                break;
            case "red":
                redSound.currentTime = 0;
                redSound.play();
                break;
            case "yellow":
                yellowSound.currentTime = 0;
                yellowSound.play();
                break;
            case "blue":
                blueSound.currentTime = 0;
                blueSound.play();
                break;
            default:
                break;
        }
    }
    else
    {
        wrongSound.currentTime = 0;
        wrongSound.play();
    }
}

function pressedAnimation(objectReference)
{
    if(isRight)
    {
        objectReference.addClass('pressed-right');
        setTimeout(function () {
            objectReference.removeClass('pressed-right');
        }, 100);
    }
    else{
        objectReference.addClass('pressed-wrong');
        setTimeout(function () {
            objectReference.removeClass('pressed-wrong');
        }, 100);
    }   
    
}

init();