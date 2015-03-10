
<!-- define -->
var RADIUS=6;
var SPOTPOS={x:0,y:0};
var txt='CANVAS电子时钟';
var SPOTRADIUS=15*(RADIUS+1);
var WINDOW_WIDTH=RADIUS*200;
var WINDOW_HEIGHT=RADIUS*100;
var MARGIN_LEFT=(WINDOW_WIDTH-114*(RADIUS+1))/2;
var MARGIN_TOP=(WINDOW_HEIGHT-20*(RADIUS+1))/3;
var focus={x:SPOTRADIUS,y:(WINDOW_HEIGHT-20*(RADIUS+1))/2,vx:5,vy:0};
var balls=[];
<!-- main -->
var canvas=document.getElementById('canvas');
var c=canvas.getContext('2d');
const colors=['#33b5e5','#0099cc','#aa66cc','#9933cc','#99cc99','#99cc00','#669900','#ffbb33','#ff8800','#ff4444','#cc0000'];
canvas.width=WINDOW_WIDTH;
canvas.height=WINDOW_HEIGHT;
var time=gettimedata();
var hour=time.getHours();
var minute=time.getMinutes();
var second=time.getSeconds();
setInterval(function(){
	execute();
	update();
},50);
<!-- functions -->
function execute(){
c.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

spotlight(SPOTPOS.x,SPOTPOS.y);

draw(MARGIN_LEFT,MARGIN_TOP,parseInt(hour/10),c);
draw(MARGIN_LEFT+16*(RADIUS+1),MARGIN_TOP,parseInt(hour%10),c);
draw(MARGIN_LEFT+32*(RADIUS+1),MARGIN_TOP,10,c);
draw(MARGIN_LEFT+42*(RADIUS+1),MARGIN_TOP,parseInt(minute/10),c);
draw(MARGIN_LEFT+58*(RADIUS+1),MARGIN_TOP,parseInt(minute%10),c);
draw(MARGIN_LEFT+74*(RADIUS+1),MARGIN_TOP,10,c);
draw(MARGIN_LEFT+84*(RADIUS+1),MARGIN_TOP,parseInt(second/10),c);
draw(MARGIN_LEFT+100*(RADIUS+1),MARGIN_TOP,parseInt(second%10),c);
drawballs();
textAct();
}
function draw(x,y,num,c){
	c.fillStyle = "#00EE76";
	for(var i=0;i<10;i++){
		for(var j=0;j<7;j++){
			if(digit[num][i][j]==1){
				c.beginPath();
				if((x+RADIUS+1+2*j*(RADIUS+1)-focus.x)*(x+RADIUS+1+2*j*(RADIUS+1)-focus.x)+(y+RADIUS+1+2*i*(RADIUS+1)-focus.y)*(y+RADIUS+1+2*i*(RADIUS+1)-focus.y)<(SPOTRADIUS)*(SPOTRADIUS)){
					c.fillStyle = "#FF7F00";
				}else{
					c.fillStyle = "#00EE76";
				}
				c.arc(x+RADIUS+1+2*j*(RADIUS+1),y+RADIUS+1+2*i*(RADIUS+1),RADIUS,0,2*Math.PI);
				c.fill();
			}
		}
	}
}
function update(){
		var curtime=gettimedata();
		var curhour=curtime.getHours();
		var curminute=curtime.getMinutes();
		var cursecond=curtime.getSeconds();
		
		if(parseInt(curhour/10)!=parseInt(hour/10)){
			addBall(MARGIN_LEFT,MARGIN_TOP,parseInt(hour/10))
		}
		if(parseInt(curhour%10)!=parseInt(hour%10)){
			addBall(MARGIN_LEFT+16*(RADIUS+1),MARGIN_TOP,parseInt(hour%10))
		}
		if(parseInt(curminute/10)!=parseInt(minute/10)){
			addBall(MARGIN_LEFT+42*(RADIUS+1),MARGIN_TOP,parseInt(minute/10))
		}
		if(parseInt(curminute%10)!=parseInt(minute%10)){
			addBall(MARGIN_LEFT+58*(RADIUS+1),MARGIN_TOP,parseInt(minute%10))
		}
		if(parseInt(cursecond/10)!=parseInt(second/10)){
			addBall(MARGIN_LEFT+84*(RADIUS+1),MARGIN_TOP,parseInt(second/10))
		}
		if(parseInt(cursecond%10)!=parseInt(second%10)){
			addBall(MARGIN_LEFT+100*(RADIUS+1),MARGIN_TOP,parseInt(second%10))
		}
		if(curtime!=time){
			time=curtime;
			hour=time.getHours();
			minute=time.getMinutes();
			second=time.getSeconds();
		}
		updateballs();
		updatefocus();

}
function gettimedata(){
	return new Date();
}
function addBall(x,y,num){
		for(var i=0;i<10;i++){
		for(var j=0;j<7;j++){
			if(digit[num][i][j]==1){
				var ball={
					x:x+RADIUS+1+2*j*(RADIUS+1),
					y:y+RADIUS+1+2*i*(RADIUS+1),
					g:2,
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:Math.random()*-15,
					color:colors[Math.floor(Math.random()*colors.length)]
				};
				balls.push(ball);
			}
		}
	}
}
function updateballs(){
	var cnt=0;
	for(var i=0;i<balls.length;i++){
			balls[i].x+=balls[i].vx;
			balls[i].y+=balls[i].vy;
			balls[i].vy+=balls[i].g;
		if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
			balls[i].x=-1-RADIUS;
			//balls[i].y=WINDOW_HEIGHT-RADIUS;
			//balls[i].vy=(balls[i].vy)*-1;
		}
		
		if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<WINDOW_WIDTH){
			balls[cnt++]=balls[i];
		}
		}
	while(balls.length>cnt){
		balls.pop();
	}
//console.log(balls.length)
}
function updatefocus(){
	focus.x+=focus.vx;
	focus.y+=focus.vy;
	if(focus.y-SPOTRADIUS<=0){
		focus.y=SPOTRADIUS;
		focus.vx=Math.random()*10-5;
		focus.vy=Math.random()*2+2;
	}
	if(focus.x+SPOTRADIUS>=WINDOW_WIDTH){
		focus.x=WINDOW_WIDTH-SPOTRADIUS;
		focus.vx=-(Math.random()*5+5);
		focus.vy=Math.random()*10-5;
	}
	if(focus.y+SPOTRADIUS>=WINDOW_HEIGHT){
		focus.y=WINDOW_HEIGHT-SPOTRADIUS;
		focus.vx=Math.random()*10-5;
		focus.vy=-(Math.random()*2+2);
	}
	if(focus.x-SPOTRADIUS<=0){
		focus.x=SPOTRADIUS;
		focus.vx=Math.random()*5+5;
		focus.vy=Math.random()*10-5;
	}

}
function textAct(){
	var linegrad=c.createLinearGradient(WINDOW_WIDTH/10, WINDOW_HEIGHT*0.5+20*(1+RADIUS), WINDOW_WIDTH/10+c.measureText(txt).width,WINDOW_HEIGHT*0.5+20*(1+RADIUS));
	for(var i=0;i<colors.length;i++){
		linegrad.addColorStop(0.1*i,colors[i]);
	}
	addText(txt,WINDOW_WIDTH/10,WINDOW_HEIGHT*0.5+20*(1+RADIUS),'bold 2em MircrosoftYahei',linegrad);
}
function addText(text,x,y,font,style){
	c.font=font;
	c.fillStyle=style;
	c.fillText(text, x,y,WINDOW_WIDTH*8/10);

}
function drawballs(){
	for(var i=0;i<balls.length;i++){
		c.beginPath();
		c.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
		c.fillStyle=balls[i].color;
		c.fill();
	}
}
function spotlight(x,y){
		c.save();
		c.fillStyle = "rgba(0,0,0,.5)";
		c.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

		c.fillStyle = "#ccc";
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(focus.x,focus.y-SPOTRADIUS);
		c.lineTo(focus.x+SPOTRADIUS, focus.y);
		c.lineTo(focus.x,focus.y+SPOTRADIUS);
		c.lineTo(focus.x-SPOTRADIUS, focus.y);
		c.closePath();
		c.fill();
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(focus.x+SPOTRADIUS, focus.y);
		c.lineTo(focus.x,focus.y+SPOTRADIUS);
		c.lineTo(focus.x-SPOTRADIUS, focus.y);
		c.closePath();
		c.fill();
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(focus.x,focus.y-SPOTRADIUS);
		c.lineTo(focus.x,focus.y+SPOTRADIUS);
		c.lineTo(focus.x-SPOTRADIUS, focus.y);
		c.closePath();
		c.fill();
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(focus.x,focus.y-SPOTRADIUS);
		c.lineTo(focus.x+SPOTRADIUS, focus.y);
		c.lineTo(focus.x-SPOTRADIUS, focus.y);
		c.closePath();
		c.fill();
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(focus.x,focus.y-SPOTRADIUS);
		c.lineTo(focus.x+SPOTRADIUS, focus.y);
		c.lineTo(focus.x,focus.y+SPOTRADIUS);
		c.closePath();
		c.fill();


		c.beginPath();
		c.fillStyle = "#F0F8FF";
		c.arc(focus.x,focus.y, SPOTRADIUS, 0, 2*Math.PI);
		c.fill();
		c.clip();
		c.restore();
}