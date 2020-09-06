// elements for navigation
const menuIcon = document.querySelector(".nav-header i");
const menu = document.querySelector("body nav");
const navItems = document.querySelector("nav ul");
const header = document.querySelector("header");

//element for canvas
const canvas = document.querySelector("canvas");

//elements for project cards
const projectCards = document.querySelectorAll(".project-card");



//canvas control stuff
const controlTitle = document.querySelector("header div.control button");
const controlSettings = document.querySelector("header div.control div.controls-grid-container");
const noLinesInput = document.getElementById("no-lines");
const gradientInput = document.getElementById("gradient");
const widthInput = document.getElementById("width");
const baseSpeedInput = document.getElementById("base-speed"); 
const circleSizeInput = document.getElementById("circle-size");
const lineColorInput = document.getElementById("line-color");
const circleColorInput = document.getElementById("circle-color");


//canvas stuff
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;


//resize canvas
window.addEventListener("resize",function(){
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
});

//canvas controls
//Closing this box has a delay idk why
controlTitle.addEventListener("click",function(){
    if(controlSettings.style.maxHeight){
        controlSettings.style.maxHeight = null;
        controlSettings.style.maxWidth = null;
    }else{
        controlSettings.style.maxHeight=controlSettings.scrollHeight+"px";
        controlSettings.style.maxWidth="100vw";
    }   
})


//canvas animation

//inputs
let numLines;
let color;
let gradient;
let width;
let circleColor;
let baseSpeed;
let radius;

const getInputs = function(){
    numLines = noLinesInput.value;
    color = lineColorInput.value;
    gradient = gradientInput.value;
    width = widthInput.value;
    circleColor = circleColorInput.value;
    baseSpeed = baseSpeedInput.value;
    radius = circleSizeInput.value;
};


const c = canvas.getContext("2d");

const drawLine = function(x1,y1,x2,y2,color,width,shadowColor){
    c.beginPath();
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.strokeStyle = color;
    

    if(findDistance(x1,y1,x2,y2,mouse.x,mouse.y) < 50 && mouse.y < y1 +20){
        c.shadowColor = shadowColor;
        c.shadowBlur = 10;
        c.lineWidth = width*5;
    } else{
        c.shadowColor = "transparent"
        c.lineWidth = width;
    }

    c.stroke();
    c.beginPath();
    c.arc(x1,y1,radius,0,Math.PI*2,false);
    c.stroke();
    c.fillStyle = circleColor;
    c.fill();
}

const findDistance = function(x1,y1,x2,y2,x0,y0){
    return Math.abs((y2-y1)*x0-(x2-x1)*y0+x2*y1-y2*x1)/Math.sqrt((Math.pow((y2-y1),2))+(Math.pow((x2-x1),2)));
}


class Line {
    constructor(a,b,theta,k,h,speed,shadowColor){
        this.x = undefined; //x position
        this.y = undefined; //y position
        this.a = a; //oval "radius" horizontal
        this.b = b; //oval "radius" vertical
        this.theta = theta; // speed kind of
        this.k = k; //oval center x
        this.h = h; //oval center y
        this.speed = speed;
        this.shadowColor = shadowColor;
    }

    update() {
        this.x = this.a * Math.cos(this.theta) + this.k;
        this.y = this.b * Math.sin(this.theta) + this.h;
        
        let m = gradient;
        m = 1/m;
        let y2 = 0;
        let x2 = (m*(this.y))+this.x
        

        drawLine(this.x,this.y,x2,y2,color,width,this.shadowColor);

        this.theta+=this.speed*baseSpeed;
        
    }
}

const mouse = {
    x: undefined,
    y: undefined
};

document.addEventListener("mousemove",(e)=>{
    mouse.x = e.x;
    mouse.y = e.y;
})

lines = [];

const generateLines = () =>{
    lines = [];
    for(let i = 0;i<numLines;i++){
        a = (Math.random()*canvas.width)/2;
        b = (Math.random()*canvas.height)/2;
        theta = Math.random();
        k = Math.random()*canvas.width;
        h = Math.random()*canvas.height;
        speed = Math.random();
        shadowColor = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
        lines[i] = new Line(a,b,theta,k,h,speed,shadowColor)
    }
}

const animate=function(){
    if(lines.length!=numLines){
        generateLines();
    }
    getInputs();
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    lines.forEach(element => {
        element.update();
    });
};

animate();


// menu stuff
menu.addEventListener("click",function(){
    if(navItems.style.maxHeight){
        navItems.style.maxHeight = null;
        menuIcon.innerHTML = "expand_more";
    } else {
        menuIcon.innerHTML = "expand_less";
        navItems.style.maxHeight = `${navItems.scrollHeight}px`;
    }

});

//project card display
projectCards.forEach(function(card,index){
    card.addEventListener("click",function(){
        projectCards[index].classList.toggle("displayed");
    })
})