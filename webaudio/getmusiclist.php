<?php 
$arr=[['name'=>'secret base','url'=>'secretbase.mp3'],['name'=>'seconde song','url'=>'secretbase.mp3']];
$dir=scandir('songs');
$res=[];
for ($i=0; $i <count($dir); $i++) { 
	if($dir[$i]!='.'&&$dir[$i]!='..'){
		array_push($res, ['name'=>substr($dir[$i], 0,strlen($dir[$i])-4),'url'=>$dir[$i]]);
	}
}
echo json_encode($res);
 ?>