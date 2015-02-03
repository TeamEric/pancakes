<!DOCTYPE html>
<html style="background-color:#f7f7f7;">
	<body>
		<?php
			$file = fopen($_POST['path'],"w");
			//$file = fopen('transcription/trsc_001.txt',"w");
			echo fwrite($file, $_POST['data']);
			//echo fwrite($file, 'sup doggyman');
			fclose($file);
			
		?>
	</body>
</html>