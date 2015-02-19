<!DOCTYPE html>
<html style="background-color:#f7f7f7;">
	<body>
		<?php
			$file = fopen($_POST['url'],"r");
			$data = fread($file,10000000);
			if (stripos($data,$_POST["string"]!=-1)) {
				$data = "True";
			}
			else {
				$data = "";
			}
			echo json_encode($data);
		?>
		
	</body>
</html>